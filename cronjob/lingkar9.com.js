var CronJob 	= require('cron').CronJob;
var request 	= require('request');

new CronJob('0 */10 * * * *', function(){
	request('http://lingkar9.com/digital-marketing/cron/socialbackground?token=ad69e7e0c6c0b71961a46c624aa5180fa593f1db');
}, function () {
	// This function is executed when the job stops
},true,"Asia/Jakarta");

/* The Apartment */
new CronJob('0 * * * * *', function(){
	request('http://theapartmentindonesia.com/generate-twitter');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality2');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks2');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality3');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks3');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality4');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks4');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality5');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks5');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality6');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks6');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality7');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks7');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality8');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks8');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality9');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks9');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality10');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks10');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality11');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks11');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-gallery?hashtag=reality12');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 */20 * * * *', function(){
	request('http://theapartmentindonesia.com/generate-theworks?hashtag=theworks12');
}, function () { },true,"Asia/Jakarta");

new CronJob('0 0 */12 * * *', function(){
	request('http://theapartmentindonesia.com/generate-youtube');
}, function () { },true,"Asia/Jakarta");