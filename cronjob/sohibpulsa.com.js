var CronJob 	= require('cron').CronJob;
var request 	= require('request');

/*
* Cron job
*/
new CronJob('0 * * * * *', function(){
	request('https://php-rochimeiji.herokuapp.com');
},true,"Asia/Jakarta");
new CronJob('0 * * * * *', function(){
	request('https://sohibpulsa.com/cronjob/auto_deposit');
	request('https://sohibpulsa.com/cronjob/pending_api2');
},true,"Asia/Jakarta");
new CronJob('0 0 0,10,16 * * *', function(){
	request('https://sohibpulsa.com/cronjob/update_product_price');
},true,"Asia/Jakarta");
new CronJob('0 0 20 * * *', function(){
	request('https://sohibpulsa.com/cronjob/infaq?token=ad69e7e0c6c0b71961a46c624aa5180fa593f1db');
},true,"Asia/Jakarta");