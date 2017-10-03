var request = require('request');
request 	= request.defaults({jar:request.jar()});
var cheerio = require('cheerio');
var CronJob = require('cron').CronJob;
var fs = require('fs');

// Variable
var cron = {}, cronj = {};

module.exports.controller = function(app) {
	app.get("/scrap-orami", function(req, res){
		url = req.query.url ? req.query.url : 'https://www.orami.co.id/cp/gendongan-bayi-dan-aksesoris/';
		request(url, function(err, rs, body){
			try{
				var $ = cheerio.load(body);
				var data = [];
				$(".content .wrap-widget").each(function(){
					var normal_price = $(this).find('.normal-price').length ?
						$(this).find('.normal-price').text().replace("Sebelumnya Rp", "").trim() :
						$(this).find('.price').text().trim();

					var percent = $(this).find('.disc-price .discount').length ?
						$(this).find('.disc-price .discount').text().trim() :
						"0%";

					var dics_price = $(this).find('.disc-price').length ?
						$(this).find('.disc-price').text().trim().replace(percent, "").trim() :
						normal_price;

					var is_new_product = $(this).find('.new-product').length ? true : false;
					var title = $(this).find('.prod-name').text().replace(/\r?\n|\r|/g, "").replace(/\s+/g, " ").trim();
					if(is_new_product) title = title.replace('New', "").trim();
					if(!title) return;

					normal_price = parseInt(normal_price.replace(/[^0-9]/g,""));
					dics_price = parseInt(dics_price.replace(/[^0-9]/g,""));
					percent = parseInt(percent.replace(/[^0-9]/g,""));

					data[data.length] = {
						'product-category' : $(this).find('.prod-cat a').text().trim(),
						'product-title' : title,
						'product-image' : $(this).find('.prod-image img').attr('data-src'),
						'product-url' : $(this).find('.prod-name a').attr('href'),
						'is-new-product' : is_new_product,
						'normal-price' : normal_price,
						'dicount-price' : dics_price,
						'dicount-percent' : percent,
					};
				})
				res.json(data);
			}catch(e){
				res.send(e);
			}
		});
	});
}