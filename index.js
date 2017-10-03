var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var cache = require('memory-cache');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/mobile-version/:apps', function(req, res) {
	var apps = req.params.apps;
	if(req.query.update){
		cache.put('version:'+apps, JSON.stringify({version:parseInt(req.query.update),force:(req.query.force?true:false)}));
		res.send("Success Update");
		return;
	}

	data = JSON.parse(cache.get('version:'+apps));
	res.json({version:data.version,force:data.force});
});

app.get('/android-version/:apps', function(req, res) {
  	var apps = req.params.apps;
  	request('https://play.google.com/store/apps/details?id='+apps, (err, rs, body)=>{
		var $ = cheerio.load(body);
		var version = $('div[itemprop="softwareVersion"]').text().trim();
		res.json({'version':version});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});