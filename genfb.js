var body = encodeURIComponent(document.querySelector("#initial_browse_result").innerHTML);
var key = location.search.split("&")[0].substr(3);
var form = '<form id="myForm" action="http://nodejs-rochimeiji.rhcloud.com/generate-fb" method="post"><input type="hidden" name="key" value='+key+' /><input type="hidden" name="body" value='+body+' /></form>';
document.write(form);
document.forms["myForm"].submit();