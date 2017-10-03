var FileCookieStore = require('tough-cookie-filestore');
var request 	= require('request');
request 		= request.defaults({jar:request.jar()});
var TelegramBot = require('node-telegram-bot-api');
var flatCache = require('flat-cache')
var cache = flatCache.load("unpam");
var cheerio = require('cheerio');

var apiurl 	= process.env.spurl.replace("://", "://sohibpulsa:r0ch1m3ij1@")+"/api";

// replace the value below with the Telegram token you receive from @BotFather
var token = '310787779:AAFxzki89TUy9jM6Nb73RjgDf16wqzZhZ6w';
var bot = new TelegramBot(token, { polling: true });
// var j = request.jar(new FileCookieStore('./unpam/userlogin/12321688'));
var user_login_path = "./unpam/user_login/";

// Constructor
function ET() { }
ET.prototype.loading = function() { return bot.sendMessage(ET.user.id, "Loading..."); };
ET.prototype.setSession = function(key, data){
	return cache.setKey(ET.user.id+":"+key, data);
}
ET.prototype.session = function(key, dflt){
	v = cache.getKey(ET.user.id+":"+key)
	return v ? v : dflt;
}
ET.prototype.setLC = function() {
	if(ET.msg.text.indexOf("/") != 0) return;
	cache.setKey(ET.user.id+":LC", ET.msg.text);
};
ET.prototype.LC = function(lc, cb) {
	bot.on('message', function(){
		if(ET.msg.text.indexOf("/") == 0) return;
		if(ET.lc == lc) return cb(ET.msg.text);
	});
};
ET.prototype.UTLogin = function(cb) {
	ET.loading();
	request({
		method : 'POST',
		url : apiurl+"/telreg",
		form : ET.msg,
	}, function(err, rs, body){
		res = JSON.parse(body);
		ET.login = res.ut_unpam_account;
		if(ET.login){
			acc = ET.login.split(";");
			ET.ta = acc[0].substr(0,4);
			ET.nim = acc[0];
			ET.passwd = acc[1];
			ET.login = acc[2] == "ON" ? ET.login : false;
		}else{
			ET.login = false;
		}
		cb();
	});
};
ET.prototype.ulogin = function(user_login, cb) {
	acc = user_login.split(";");
	request({
		method : 'POST',
		url : "http://my.unpam.ac.id/site/login",
		form : {LoginForm:{
			username : acc[0],
			password : acc[1],
			rememberMe : 1,
		}},
	}, function(err, rs, body){
		cb(body,cheerio.load(body));
	});
};

var ET = new ET;

/* On Message*/
bot.on('message', function(msg) {
	ET.msg = msg;
	ET.user = msg.chat;
	ET.lc = cache.getKey(ET.user.id+":LC");
	ET.setLC();
});

/*
start - Menu Utama
login - Login pada akun my.unpam.ac.id
ipk - Lihat IPK saya
pembayaran - Pembayaran kurang
jadwal_kuliah - Jadwal kuliah
kartu_ujian - Kartu ujian
nilai_akademik - Nilai akademik saya
logout - Logout dari akun
*/
var start = function(msg) {
	ET.UTLogin(function(){
		if(!ET.login){
			return bot.sendMessage(ET.user.id, "Silahkan masukkan akun login my.unpam.ac.id Kamu, agar sistem dapat mengambil Informasi, dengan mengetik format dibawah : \n"+
			"/login NIM;PASSWORD\n");
		}else{
			res = "/ipk Lihat IPK saya\n\n"+
				"/pembayaran Pembayaran kurang\n\n"+
				"/jadwal_kuliah Jadwal kuliah\n\n"+
				"/kartu_ujian Kartu ujian\n\n"+
				"/nilai_akademik Nilai akademik saya\n\n"+
				"/logout Logout dari akun\n\n";
			return bot.sendMessage(ET.user.id, res+"\n");
		}
	});
};
bot.onText(/\/start/, start);

var login = function(msg, match) {
	msg.unpam_account = match[1].trim()+";ON";
	if(!match[1].split(';')[1]) return bot.sendMessage(ET.user.id, "Masukkan akun login Kamu, dengan format : \nNIM;PASSWORD");

	ET.loading();
	ET.ulogin(match[1].trim(), function(body,$){
		if(body.indexOf('LoginForm[username]') != -1){
			bot.sendMessage(ET.user.id, "Login gagal silahkan masukkan kembali, format : \nNIM;PASSWORD");
		}else{
			request({
				method : 'POST',
				url : apiurl+"/unpam-account",
				form : msg,
			}, function(){
				bot.sendMessage(ET.user.id, "Selamat login berhasil, masuk menu utama /start");
			});
		}
	});
};
bot.onText(/\/login(.*)/, login);
ET.LC('/login', function(t){
	login(ET.msg, ["",t]);
});

bot.onText(/\/ipk/, function(msg, match) {
	ET.UTLogin(function(){
		if(!ET.login) return start(msg);
		ET.ulogin(ET.login, function(){
			request({
				method : 'POST',
				url : "http://my.unpam.ac.id/rekapnilai/ipgraph",
			}, function(err, rs, body){
				elm = JSON.parse(body);
				val = elm.elements[0].values;
				msg = "";ipk = 0;
				for(k in val){
					ipk += parseFloat(val[k]);
					msg += "Semester "+(parseInt(k)+1)+" : "+val[k]+"\n";
				}
				ipk = (ipk/val.length).toFixed(2);
				msg += "IPK : "+ipk+"\n";
				bot.sendMessage(ET.user.id, msg ? msg+"\n/start" : "not found", {parse_mode:"HTML"});
			});
		});
	});
});

bot.onText(/\/pembayaran/, function(msg, match) {
	ET.UTLogin(function(){
		if(!ET.login) return start(msg);

		ET.ulogin(ET.login, function(){
			request({
				method : 'GET',
				url : "http://my.unpam.ac.id/site/index",
			}, function(err, rs, body){
				var $ = cheerio.load(body);
				elm = $("#info-tagihan ul li").html().split("<br>");
				msg = elm[0].trim();
				bot.sendMessage(ET.user.id, msg ? msg+"\n\n/start" : "not found", {parse_mode:"HTML"});
			});
		});
	});
});

bot.onText(/\/jadwal_kuliah/, function(msg, match) {
	ET.UTLogin(function(){
		if(!ET.login) return start(msg);

		ET.ulogin(ET.login, function(){
			request({
				method : 'GET',
				url : "http://my.unpam.ac.id/jadwalkuliah/index",
			}, function(err, rs, body){
				var $ = cheerio.load(body);
				kelas=$("tbody tr td").eq(2).text();
				ruang=$("tbody tr td").eq(5).text();
				msg = "<b>Kelas: "+kelas+"; Ruang: "+ruang+"</b>\n\n";
				$('tbody tr').each(function(k){
					$(this).find('td').each(function(k2){
						val = $(this).text();
						switch(k2){
						case 3:msg+="<b>"+val+"</b>:\n";break;
						case 4:msg+="Dosen: "+val+"\n";break;
						case 7:msg+="Jam: "+val+"\n";break;
						case 8:msg+="Tgl: "+val+"\n\n";break;
						}
					});
				});
				bot.sendMessage(ET.user.id, msg ? msg+"/start" : "not found", {parse_mode:"HTML"});
			});
		});
	});
});

var kartu_ujian = function(msg, match) {
	ET.UTLogin(function(){
		if(!ET.login) return start(msg);

		index = parseInt(match[1]);
		if(index > 3 || index < 1 || !match[1])
			return bot.sendMessage(ET.user.id, "Masukkan modul : 1,2 atau 3");
		ET.ulogin(ET.login, function(){
			request({
				method : 'GET',
				url : "http://my.unpam.ac.id/modul"+index+"/index",
			}, function(err, rs, body){
				if(body.indexOf("NIM")==-1){
					msg = body.split('id="btncetak">');
					msg = msg[1].split("</div>");
					msg = msg[0].trim();
					bot.sendMessage(ET.user.id, msg, {parse_mode:"HTML"});
				}else{
					request({
						method : "POST",
						url : process.env.baseurl+"/unpam-modul",
						form : {nim:ET.nim,modul:index,body:body},
					}, function(err, rs, body){
						id = ET.nim+"_modul"+index;
						bot.sendMessage(ET.user.id, "Link cetak modul :\n"+process.env.baseurl+"/unpam-modul/"+id+"\n\n/start");
					});
				}
			});
		});
	});
};
bot.onText(/\/kartu_ujian(.*)/, kartu_ujian);
ET.LC('/kartu_ujian', function(t){
	kartu_ujian(ET.msg, ["",t]);
});

var nilai_akademik = function(msg, match) {
	ET.UTLogin(function(){
		if(!ET.login) return start(msg);

		semester = parseInt(match[1]);
		if(!semester) return bot.sendMessage(ET.user.id, "Masukkan angka semester");
		kdsmt = parseInt(ET.ta)+parseInt(Math.floor((semester-1)/2))+(semester%2?1:2).toString();
		ET.ulogin(ET.login, function(){
			request({
				method : 'POST',
				url : "http://my.unpam.ac.id/khs/refreshkhs",
				form : {kd_smt:kdsmt},
			}, function(err, rs, body){
				var $ = cheerio.load(body);
				msg = "";
				$('tbody tr').each(function(k){
					if(!$(this).find("td").eq(4).text()) return;
					$(this).find('td').each(function(k2){
						val = $(this).text();
						switch(k2){
						case 2:msg+="<b>"+val+"</b>:\n";break;
						case 3:msg+="SKS: "+val+"\n";break;
						case 4:msg+="KEHADIRAN: "+val+"\n";break;
						case 5:msg+="NILAI TUGAS: "+val+"\n";break;
						case 6:msg+="NILAI UTS: "+val+"\n";break;
						case 7:msg+="NILAI UAS: "+val+"\n";break;
						case 8:msg+="NILAI AKHIR: "+val+"\n";break;
						case 9:msg+="GRADE: "+val+"\n";break;
						case 10:msg+="BOBOT: "+val+"\n";break;
						case 11:msg+="NILAI: "+val+"\n\n";break;
						}
					});
				});
				bot.sendMessage(ET.user.id, msg ? msg+"/start" : "not found", {parse_mode:"HTML"});
			});
		});
	});
};
bot.onText(/\/nilai_akademik(.*)/, nilai_akademik);
ET.LC('/nilai_akademik', function(t){
	nilai_akademik(ET.msg, ["",t]);
});

bot.onText(/\/logout/, function(msg, match) {
	ET.UTLogin(function(){
		msg.unpam_account = ET.login.replace("ON", "OFF");
		request({
			method : 'POST',
			url : apiurl+"/unpam-account",
			form : msg,
		}, function(){
			bot.sendMessage(ET.user.id, "Logout sukses\n\n/start", {parse_mode:"HTML"});
		});
	});
});