var queryData = {}; //objects that point to datatype and id
var dataNum = 0;
function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = data;
		for (var i in csvobj)
		{
			var v = csvobj[i];
			if (v.local_language_id == 9)
			{
				var nam = v.name.toLowerCase();
				if (queryData[nam] == null)
				{
					queryData[nam] = [];
				}
				queryData[nam].push({type:q,id:v[q+"_id"],csv:v});
			}
		}
		dataNum--;
		if (dataNum <= 0)
		{
			searchPage();
		}
	}
}

function searchPage()
{
	var match = function(qd)
	{
		$("#results").append(JSON.stringify(qd)+"<br>");
	}
	$(".content").empty().append('<input id="search" type="text"/><button id="searchb">Search</button><br><div id="results"></div>');
	$("#searchb").click(function()
	{
		$("#results").empty();
		var s = $("#search").val().toLowerCase();
		var words = s.split(" ");
		if (queryData[s] != null)
		{
			match(queryData[s]);
		}
		for (var k in queryData)
		{
			var d = queryData[k];
			if (k != s)
			{
				for (var n in words)
				{
					var word = words[n];
					if (k.indexOf(word) >= 0)
					{
						match(d);
						break;
					}
				}
			}
		}
	});
}

$(function()
{
	setTimeout(function()
	{
		window.scrollTo(0,215);
		if (location.protocol != "file:")
		{
			//load files to do querys on
			//use majik: $.csv.toObjects(data)
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
				var q = queryFiles[i];
				$.get( "/json/"+q+"_names.json", getDataProcessor(q));
			}
		}
		else
		{
			searchPage();
		}
	},500);
});
