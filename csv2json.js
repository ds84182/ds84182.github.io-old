//csv2json.js
var $ = jQuery = require('jquery');
require('./js/jquery.csv.js');
var fs = require('fs');
if (fs.existsSync("json"))
{
	fs.rmdirSync("json");
}
fs.mkdirSync("json");
function handleFile(file)
{
	var data = fs.readFileSync("csv/"+file);
	//console.log();
	fs.writeFileSync("json/"+file.substring(0,file.length-4)+".json",JSON.stringify($.csv.toObjects(String(data))));
}
fs.readdir("csv",function(error,files)
{
	for (var i in files)
	{
		var file = files[i];
		console.log(file);
		handleFile(file);
	}
});
