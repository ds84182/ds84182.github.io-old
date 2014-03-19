var queryData = {}; //objects that point to datatype and id
var dataNum = 0;
function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = JSON.parse(data);
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
	$.get( "/json/"+q+"_names.json", getDataProcessor(q));
}

function loadPP()
{
	if (location.protocol != "file:")
	{
		pageInit();
		loadScreen();
		var queryFiles = [
			"ability",
			"item",
			"location",
			"move",
			"pokemon_species",
			"region",
			"stat",
			"version"
		];
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
