var ET = require('./base.js');
require('./http.js');
var bot = ET.bot();
var SPR = ET.SPR();

// Last Command
ET.LC('/daftar', function() {
	console.log(ET.msg.text);
});

bot.onText(/\/start/, function(msg) {
	SPR.telreg(msg);

	return bot.sendMessage(msg.chat.id, "Anda belum punya akun SohibPulsa? klik link dibawah : \n"+
	process.env.spurl+"/register\n"+
	"Atau koneksikan akun SohibPulsa kamu dengan telegram, klik link dibawah : "+
	process.env.spurl+"/apps/connect-telegram/"+ET.user.id+"\n");
});
bot.onText(/\/daftar/, function(msg) {
	// ET.loading();
	bot.sendMessage(msg.chat.id, "Ketik format dibawah untuk pendaftaran :\n"+
		"NAMALENGKAP;NOHP;EMAIL;USERNAME;PASSWORD");
});