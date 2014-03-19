var queryData = {}; //objects that point to datatype and id
var dataNum = 0;
queryFiles = [ //These are also the types
	"ability",
	"item",
	"location",
	"move",
	"pokemon_species",
	"region",
	"stat",
	"version"
];

var mediaDir = "/media/";

function doLater(func)
{
	setTimeout(func,0);
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function foreach(array,doSomething,onComplete) {
	var i = 0, len = array.length, completeCount = 0;
	for(;i < len; i++) {
		window.setTimeout(function() {
			doSomething(arguments[0]);
			completeCount++;
			if (completeCount === len) { 
				onComplete(); 
			}
		},0,array[i]);
	}
};

function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = data;
		for (var i in csvobj)
		{
			var v = csvobj[i];
			if (v.local_language_id == "9")
			{
				var nam = v.name.toLowerCase();
				if (queryData[nam] == null)
				{
					queryData[nam] = [];
				}
				queryData[nam].push({type:q,id:v[q+"_id"],csv:v,name:v.name});
			}
		}
		dataNum--;
		if (dataNum <= 0)
		{
			searchPage();
		}
	}
}

function doQuery(q)
{
	$.get( "/json/"+q+"_names.json", getDataProcessor(q),"json");
}

function loadJSON(f,obj,index)
{
	$.get( "/json/"+f+".json", function(data)
	{
		obj[index] = JSON.parse(data);
	},"json");
}

sprite_versions = [{"id":"1","identifier":"red-blue","generation_id":"1","order":"1"},
{"id":"2","identifier":"yellow","generation_id":"1","order":"2"},
{"id":"3","identifier":"gold","generation_id":"2","order":"3"},
{"id":"3","identifier":"silver","generation_id":"2","order":"3"},
{"id":"4","identifier":"crystal","generation_id":"2","order":"4"},
{"id":"5","identifier":"ruby-sapphire","generation_id":"3","order":"5"},
{"id":"6","identifier":"emerald","generation_id":"3","order":"6"},
{"id":"7","identifier":"firered-leafgreen","generation_id":"3","order":"9"},
{"id":"8","identifier":"diamond-pearl","generation_id":"4","order":"10"},
{"id":"9","identifier":"platinum","generation_id":"4","order":"11"},
{"id":"10","identifier":"heartgold-soulsilver","generation_id":"4","order":"12"},
{"id":"11","identifier":"black-white","generation_id":"5","order":"13"},
{"id":"15","identifier":"x-y","generation_id":"6","order":"15"}];

function loadPP()
{
	if (location.protocol != "file:")
	{
		pageInit();
		loadScreen();
		dataNum = queryFiles.length;
		
		for (var i in queryFiles)
		{
			setTimeout(doQuery,100,queryFiles[i]);
		}
	}
	else
	{
		searchPage();
	}
}

function unloadPP()
{
	//unloads the querydata after a search is completed
	queryData = {}; //I hope this works
}
