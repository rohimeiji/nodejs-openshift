/*=====================================
== Require Library
=======================================*/
var express 	= require('express');
var app 		= express();
var fs      	= require('fs');
var vm      	= require('vm');
var bodyParser 	= require('body-parser');
var server 		= require('http').createServer(app);
var io 			= require("socket.io").listen(server);
var request 	= require('request');
request 		= request.defaults({jar:request.jar()});
var CronJob 	= require('cron').CronJob;
var include 	= require('include');

// Set Configuration
var host = process.env.OPENSHIFT_NODEJS_IP;
if(!host){
	process.env.local = true;
	process.env.baseurl = "http://localhost:8000";
	process.env.spurl = "http://sp-new.local";
	process.env.cachename = "rochimeiji";
}else{
	process.env.local = true;
	process.env.baseurl = "http://nodejs-rochimeiji.herokuapp.com";
	process.env.spurl = "https://sohibpulsa.com";
	process.env.cachename = "rochimeiji";
}

app.set('port', (process.env.PORT || 5000));
// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8000);
// app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// Listen Port
server.listen(app.get('port'), app.get('ipaddr'));

// Body Parser
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded

/*=====================================
== Welcome Page
=======================================*/
app.get("/", function (req, res){
	res.setHeader('Content-Type', 'text/html');
	res.send(fs.readFileSync('./index.html'));
});
app.get("/baseurl", function (req, res){
	res.send("baseurl : ");
});

/*=====================================
== User Socket
=======================================*/

// Initial variable
var users = {'pub':0, 'rochim':0, 'public':0}; // users
var uso = []; // user socket
var auth = []; // Authenticate users
// Create Socket User
for(var key in users){
	uso[key] = io.of('/'+key);
	auth[key] = users[key] ? users[key] : '12345';
	uso[key].on('connection', function(socket) {
		socket.on('app', function(data){
			if(data.event != "eval"){
				uso[socket.nsp.name.substr(1)].emit(data.channel, {event:data.event,data:data.data});
			}
		});
	});
}

app.post('/social-search', function (req, res) {
	sc_get = req.body.sc ? req.body.sc : ["fb","tw","yt","ig"];
	sc_get = typeof sc_get == "string" ? [sc_get] : sc_get;
	key_get = req.body.key ? req.body.key : null;
	if(!key_get) return res.send("fail");
	key_get = typeof key_get == "string" ? [key_get] : key_get;
	callback = req.body.callback ? req.body.callback : "";
	if(!callback) return res.send("fail");

	for(k in sc_get){
		sc = sc_get[k];
		if(!sc) continue;
		for(k1 in key_get){
			keyv = key = key_get[k1];
			if(!key) continue;
			if(sc == "fb") continue;
			if(sc == "ig"){
				if(key.indexOf("#") == -1) continue;
				keyv = keyv.replace("#", "");
			}
			if(keyv.indexOf(" ") != -1) keyv = '"'+keyv+'"';
			request({uri:'http://php-rochimeiji.herokuapp.com/socialsearch/?'+sc+'='+encodeURIComponent(keyv),sc:sc,key:key}, function(err, rs, body){
				// if(this.sc == "ig") res.send(body);
				request({
					method: 'POST',
					uri: callback,
					form: {sc:this.sc,key:this.key,body:body},
				});
			});
		}
	}
	res.send("success");
});

fs.readdirSync('./controllers').forEach(function (file) {
	if(file.substr(-3) == '.js') {
		route = require('./controllers/' + file);
		route.controller(app);
	}
});

app.all('/:user', function (req, res) {
	$user = req.params.user;
	$secret = req.body.secret;
	$channel = req.body.channel;
	$my_event = req.body.event;
	$data = req.body.data;

	if(typeof auth[$user] == "undefined") return res.end();
	if(auth[$user] != $secret) return res.end();

	// Emit data
	uso[$user].emit($channel, { event : $my_event, data : $data});

	res.end();
});

/* Include nodejs */
// ETRoute = require('./telegram/http');
// ETRoute.controller(app);
// require('./telegram/index');
// require('./unpam/index.js');

/*=====================================
== Cron Job
=======================================*/
include('cronjob/lingkar9.com.js');
include('cronjob/sohibpulsa.com.js');
// include('cronjob/ift.js');

console.log('Server run on '+app.get('ipaddr')+":"+app.get("port"));
