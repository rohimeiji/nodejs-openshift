var fs = require('fs');

module.exports.controller = function(app) {
	app.post("/et/login_store", function(req, res){
		fs.writeFile("./telegram/user_login/"+req.body.scid, true);
		res.send("success");
	});
}