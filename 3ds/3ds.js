var ui = {
	pokemon_species: function(data)
	{
		pageInit();
		unloadPP(); // Unload data to prepare for loading pkmn data
		loadScreen();
		$.get( "/json/pokemon.json", function(pk)
		{
			pk = JSON.parse(pk);
			//find the id for the pkmn
			for (var k in pk)
			{
				var v = pk[k];
				if (v.id == data.id)
				{
					pk = v;
					break;
				}
			}
			pageInit();
			$(".hcontent").append("<h4>"+data.name+" - The "+data.csv.genus+" Pokemon</h4>");
			var b = $("<button>Search</button>");
			$(".content").append(b);
			b.click(loadPP);
			
			$(".content").append(JSON.stringify(pk));
		});
	}
}

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert("Error occured: " + errorMsg);//or any message
    return false;
}

function pageInit()
{
	$(".content").empty();
	$(".hcontent").empty();
	window.scrollTo(0,215);
}

function loadScreen()
{
	$(".content").append('<p style="float: right; position: relative; top:188px; margin: 0;">Loading...</p>');
}

function searchPage()
{
	pageInit();
	
	var searcher = function(qd)
	{
		return function()
		{
			if (ui[qd.type] != null)
			{
				ui[qd.type](qd)
			}
			else
			{
				alert("Cannot load a "+qd.type);
			}
		}
	}
	
	var match = function(qd)
	{
		for (var i in qd)
		{
			var qd = qd[i];
			var b = $("<button>"+qd.type+": "+qd.name+"</button>");
			b.click(searcher(qd));
			$("#results").append(b);
		}
	}
	$(".content").append('<input id="search" type="text"/><button id="searchb">Search</button><div id="results"></div>');
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
		loadPP()
	},500);
});
