var request = require('request');
request 	= request.defaults({jar:request.jar()});
var cheerio = require('cheerio');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var math = require('mathjs');

// Variable
var cron = {}, cronj = {};

function es(method, path, param, callback){
	if(typeof param == "object") param = JSON.stringify(param);
	request({method:method, uri:'https://5dwxz1u2ks:h9me60cac1@sandbox-cluster-2593386204.us-east-1.bonsaisearch.net'+path,form:param}, callback);
}

var customNode = function(req, res){
	url = req.body.url;
	code = req.body.code ? req.body.code : '';
	if(!url){
		eval(code);
		if(code.indexOf("res.") == -1) res.send("success");
	}else{
		request(url, function(err, rs, body){
			try{
				var $ = cheerio.load(body);
				eval(code);
			}catch(e){
				res.send(e);
			}
		});
		if(code.indexOf("res.") == -1) res.send("success");
	}
}

var cronJobNode = function(req, res){
	name = req.body.name;
	patern = req.body.patern;
	// validation
	if(!req.body.name) res.send("name required");

	// cronjob
	if(cron[name]) cron[name].stop();
	cronj[name] = req.body;
	cron[name] = new CronJob(patern, function(){
		customNode(req, res);
	}, function () {
		// This function is executed when the job stops
	},true,"Asia/Jakarta");

	es("PUT", "/cronjob/job/data", cronj);
	res.send(cronj[name]);
}

module.exports.controller = function(app) {
	es("GET", "/cronjob/job/data", "", function(err, rs, body){
		source = JSON.parse(decodeURIComponent(body))._source;
		for(k in source){
			request.post(app.get('baseurl')+"/cronjob", {form:source[k]});
		}
	});
	app.post("/cronjob", cronJobNode);
	app.get("/cronjob/list", function(req, res){
		res.json(cronj);
	});
	app.get("/cronjob/delete/:name", function(req, res){
		name = req.params.name;
		if(!cronj[name]) return res.send("no cronjob");
		delete cronj[name];
		cron[name].stop();
		es("PUT", "/cronjob/job/data", cronj);
		res.send("delete cronjob "+name);
	});

	app.post("/custom", customNode);

	function handleGet(req, res){
		var $ = cheerio.load(decodeURIComponent(req.body.body));
		var key = decodeURIComponent(req.body.key).replace(/[^a-zA-Z0-9# ]/g, '');
		data = [];
		$("._401d").each(function(k){
			var bt = JSON.parse($(this).find('[data-bt]').attr('data-bt'));
			var article = $(this).find('._52c6').attr("href");
			// var gf = JSON.parse(wait.for(request, "http://graph.facebook.com/?id="+article).body);
			var location = $(this).find('._5pcq').eq(1).text().trim();
			// var lc = JSON.parse(wait.for(request, "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyBVizdQeh3udy11xDc5Ao2YStR2gLc-rfc&language=id").body);

			data[k] = {
				id : bt.id,
				text : $(this).find('._5pbx p').text(),
				url : "https://www.facebook.com/"+bt.id,
				image : $(this).find('._46-i').attr('src'),
				timestamp : parseInt($(this).find('[data-utime]').attr('data-utime')),
				like : parseInt($(this).find('._4arz span').text()),
				comment : parseInt($(this).find('._4qba').text()),
				article_link : article ? article : null,
				// share_count : gf.share ? gf.share.share_count : 0,
				location : location ? location : null,
				user : {
					name : $(this).find('.fwb a').eq(0).text(),
					link : $(this).find('.fwb a').eq(0).attr('href'),
					pic : $(this).find('._38vo img').attr('src'),
				}
			}
		});
		request({
			method : "POST",
			url : 'http://lingkar9.com/digital-marketing/social-background',
			form : {sc:'fb',key:key,body:JSON.stringify(data)},
		});
		res.send('Success Generate Facebook');
	}

	app.post("/generate-fb", handleGet);

	// app.post("/generate-fb", function(req, res){
	// 	wait.launchFiber(handleGet, req, res);
	// });

	var unpam_modul = "./unpam/unpam_modul/";
	app.post("/unpam-modul", function(req, res){
		res.send('Success Save Modul');
		var nim = req.body.nim;
		var modul = req.body.modul;
		var html = req.body.body;
		html = html.replace(/href="\//g, 'href="http://my.unpam.ac.id/');
		html = html.replace(/src="..\//g, 'src="http://my.unpam.ac.id/');

		fs.writeFile(unpam_modul+nim+"_modul"+modul, html, function(){
			res.send('Success Save Modul');
		});
	});
	app.get("/unpam-modul/:id", function(req, res){
		var id = req.params.id;
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync(unpam_modul+id));
	});
}