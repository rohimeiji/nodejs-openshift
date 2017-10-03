var TelegramBot = require('node-telegram-bot-api');
var flatCache = require('flat-cache')
var cache = flatCache.load(process.env.cachename);
var fs = require('fs');

// replace the value below with the Telegram token you receive from @BotFather
var token = '323833023:AAFtFb9WbYoacES17KHOcPhdHBtaiJm2Gxs';
// var token = '299615486:AAG5UxXz9gIy9dacdOoTsVTZpBjn1bOjYmk';

// See https://developers.openshift.com/en/node-js-environment-variables.html
var port = process.env.OPENSHIFT_NODEJS_PORT;
var host = process.env.OPENSHIFT_NODEJS_IP;
var domain = process.env.OPENSHIFT_APP_DNS;

if (host && 0) {
	var bot = new TelegramBot(token, { webHook: { port: port, host: host } });
	// OpenShift enroutes :443 request to OPENSHIFT_NODEJS_PORT
	bot.setWebHook(domain + ':443/bot' + token);
} else {
	// Create a bot that uses 'polling' to fetch new updates
	var bot = new TelegramBot(token, { polling: true });
}

// Constructor
function ET() { }
ET.prototype.bot = function() { return bot; };
ET.prototype.request = function() { return request; };
ET.prototype.SPR = function() { return require('./SPR.js'); };
// class methods
ET.prototype.setSession = function(key, data){
	return cache.setKey(ET.user.id+":"+key, data);
}
ET.prototype.session = function(key, dflt){
	v = cache.getKey(ET.user.id+":"+key)
	return v ? v : dflt;
}
ET.prototype.loading = function() { return bot.sendMessage(ET.user.id, "Loading..."); };
ET.prototype.setLC = function() {
	if(ET.msg.text.indexOf("/") != 0) return;
	cache.setKey(ET.user.id+":LC", ET.msg.text);
};
ET.prototype.LC = function(lc, cb) {
	bot.on('message', function(){
		if(ET.msg.text.indexOf("/") == 0) return;
		if(ET.lc == lc) return cb();
	});
};

// Footer Menu
ET.prototype.footStart = function() { return "\n/start"; };

// Create ET
var ET = new ET;

/* On Message*/
bot.on('message', function(msg) {
	ET.msg = msg;
	ET.user = msg.chat;
	ET.lc = cache.getKey(ET.user.id+":LC");
	try{
		ET.login = fs.readFileSync('./telegram/user_login/a'+ET.user.id, 'utf8');
	}catch(e){};
	ET.setLC();
});

// Express JS HTTP

// export the class
module.exports = ET;