// Screen 16123.pts-3.web-apps1

/*=====================================
== Require Library
=======================================*/
var express 	= require('express');
var app 		= express();
var fs      	= require('fs');
var vm      	= require('vm');
var bodyParser 	= require('body-parser');
var options = {
  key: fs.readFileSync('/etc/nginx/ssl/kredivest.co.id.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/kredivest.co.id.chained.crt')
};
var server 		= require('https').createServer(options,app);
var io 			= require("socket.io").listen(server);
var request 	= require('request');
var CronJob 	= require('cron').CronJob;
var include 	= require('include');

// Listen Port
server.listen(3000);

// Body Parser
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/*=====================================
== Welcome Page
=======================================*/
app.get("/", function (req, res){
    res.setHeader('Content-Type', 'text/html');
    res.send(fs.readFileSync('./index.html'));
});

/*=====================================
== User Socket
=======================================*/

// Initial variable
var users = {'socket':0}; // users
var uso = []; // user socket
var auth = []; // Authenticate users

// Create Socket User
for(var key in users){
	uso[key] = io.of('/'+key);
	auth[key] = users[key] ? users[key] : '12345';
	uso[key].on('connection', function (socket) {
	    socket.on('app', function (data) {
	    	if(data.event != "eval"){
		        uso[key].emit(data.channel, {event:data.event,data:data.data});
		    }
	    });
	});
}

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

/*=====================================
== Cron Job
=======================================*/
new CronJob('0 * * * * *', function(){
	// request('http://google.com?token=ad69e7e0c6c0b71961a46c624aa5180fa593f1db');
}, function () {
	// This function is executed when the job stops
},true,"Asia/Jakarta");

console.log('Server run');