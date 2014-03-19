queryData = {}; //objects that point to datatype and id
function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = $.csv.toObjects(data);
		for (var i in csvobj)
		{
			var v = csvobj[i];
			if (queryData[v.name] == null)
			{
				queryData[v.name] = [];
			}
			queryData[v.name].push({type:q,id:v[q+"_id"]});
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
		var s = $("#search").val();
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
		searchPage();
		if (location.protocol != "file:")
		{
			//load files to do querys on
			//use majik: $.csv.toObjects(data)
			var queryFiles = [
				"ability",
				"item",
			];
			
			for (var i in queryFiles)
			{
				var q = queryFiles[i];
				$.get( "/csv/"+q+"_names.csv", getDataProcessor(q));
			}
		}
	},500);
});
