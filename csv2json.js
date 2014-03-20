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
	else if (endsWith(file,"encounters.csv"))
	{
		//extract encounters into a pokemon, not ids
		var encdata = new Array(1000);
		csvdata.forEach(function(v)
		{
			var i = v.pokemon_id;
			if (encdata[i] == null)
			{
				encdata[i] = [];
			}
			encdata[i].push(v);
		});
		
		var dn = file.substring(0,file.length-4);
		fs.mkdirSync("json/"+dn);
		encdata.forEach(function(v,i)
		{
			if (v != null)
			{
				//export to files
				fs.writeFileSync("json/"+dn+"/"+i+".json",JSON.stringify(v));
			}
		});
	}
	else if (endsWith(file,"pokemon_moves.csv"))
	{
		//extract encounters into a pokemon, not ids
		var piddata = new Array(1000);
		var middata = new Array(1000);
		csvdata.forEach(function(v)
		{
			var i = v.pokemon_id;
			if (piddata[i] == null)
			{
				piddata[i] = [];
			}
			piddata[i].push(v);
			
			var i = v.move_id;
			if (middata[i] == null)
			{
				middata[i] = [];
			}
			middata[i].push(v);
		});
		
		var dn = file.substring(0,file.length-4);
		fs.mkdirSync("json/"+dn+"_pid");
		piddata.forEach(function(v,i)
		{
			if (v != null)
			{
				//export to files
				fs.writeFileSync("json/"+dn+"_pid/"+i+".json",JSON.stringify(v));
			}
		});
		
		fs.mkdirSync("json/"+dn+"_mid");
		middata.forEach(function(v,i)
		{
			if (v != null)
			{
				//export to files
				fs.writeFileSync("json/"+dn+"_mid/"+i+".json",JSON.stringify(v));
			}
		});
	}
	else
	{
		if (csvdata[0] != null && csvdata[0].id)
		{
			//id entries
			//create a dir in json
			var dn = file.substring(0,file.length-4);
			fs.mkdirSync("json/"+dn);
			csvdata.forEach(function(v)
			{
				//export to files
				fs.writeFileSync("json/"+dn+"/"+v.id+".json",JSON.stringify(v));
			});
		}
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
