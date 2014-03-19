//csv2json.js
var $ = jQuery = require('jquery');
require('./js/jquery.csv.js');
var fs = require('fs');
deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
if (fs.existsSync("json"))
{
	deleteFolderRecursive("json");
}
fs.mkdirSync("json");
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function handleFile(file)
{
	var data = fs.readFileSync("csv/"+file);
	//console.log();
	var csvdata = $.csv.toObjects(String(data));
	if (endsWith(file,"_names.csv"))
	{
		//cull languages to english
		var old = csvdata;
		csvdata = [];
		old.forEach(function(v)
		{
			if (v.local_language_id == 9)
			{
				csvdata.push(v)
			}
		});
	}
	fs.writeFileSync("json/"+file.substring(0,file.length-4)+".json",JSON.stringify(csvdata));
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
