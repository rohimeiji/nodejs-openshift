<?php
class EIO{
	var $websocket = "http://nodejs-rochimeiji.rhcloud.com:8000/";
	var $app_user = "pub";
	var $app_secret = "12345";
	var $channel = "c0083b8246f171cf7820aac1686d182d6b7fb83b";
	static $instance;

	function __construct(){
		$this->websocket .= $this->app_user;
	}

	function push($field = []){
		if(!env('NODEJS_NOTIF')) return;

		$field['channel'] = $this->channel;
		$field['secret'] = $this->app_secret;

	    $ch = curl_init();

	    curl_setopt($ch, CURLOPT_URL, $this->websocket);
	    curl_setopt($ch, CURLOPT_HEADER, 0);
	    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($field));
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	    $data = curl_exec($ch);
	    curl_close($ch);

	    return $data;
	}

	static function instance(){
		if(!self::$instance) self::$instance = new self();
		return self::$instance;
	}

	static function send($event, $data){
		$self = self::instance();
		$self->push(['event' => $event, 'data' => $data]);
	}
}