var request 	= require('request');
request 		= request.defaults({jar:request.jar()});
var apiurl 		= process.env.spurl.replace("://", "://sohibpulsa:r0ch1m3ij1@")+"/api";

// Constructor
function SPR() { }

// Function
SPR.prototype.telreg = function(msg){
	request({
		method : 'POST',
		url : apiurl+"/telreg",
		form : msg,
	});
}

// Container
var SPR = new SPR;

// export the class
module.exports = SPR;