var ui = {
	pokemon_species: function(data)
	{
		pageInit();
		$(".hcontent").append(data.name);
	}
}

function pageInit()
{
	$(".content").empty();
	$(".hcontent").empty();
}

function searchPage()
{
	pageInit();
	var match = function(qd)
	{
		for (var i in qd)
		{
			var qd = qd[i];
			var b = $("<button>"+qd.type+": "+qd.name+"</button>");
			$("#results").append(b);
		}
	}
	$(".content").append('<input id="search" type="text"/><button id="searchb">Search</button><br><div id="results"></div>');
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
