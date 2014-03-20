var ui = {
	pokemon_species: function(data)
	{
		pageInit();
		//unloadPP(); // Unload data to prepare for loading pkmn data
		loadScreen();
		$.get( "/json/pokemon/"+data.id+".json", function(pk)
		{
			$.get( "/json/pokemon_species/"+data.id+".json", function(species)
			{
				
				var included = [];
				for (var i in sprite_versions)
				{
					i = sprite_versions[i];
					if (Number(i.generation_id) >= Number(species.generation_id))
					{
						included.push(i.identifier);
					}
				}
				
				pageInit();
				$(".hcontent").append("<h4>"+data.name+" - The "+data.csv.genus+" Pokemon</h4>");
				var b = $("<button>Search</button>");
				$(".content").append(b);
				b.click(searchPage);
				
				foreach(included,function(v)
				{
					var s = mediaDir+"pokemon/main-sprites/"+v+"/"+pk.id+".png";
					var div = $("<div id='"+v+"'>"+v+": </div><br>");
					$(".content").append(div);
					$.ajax({
						url:s,
						type:'HEAD',
						error: function()
						{
							
						},
						success: function()
						{
							div.append("<img src='"+s+"' style='display:block;margin:0 auto;'/>");
						}
					});
				},function(){});
			},"json").fail(function() {
				alert( "An error occured while downloading the pokemon data" );
				searchPage();
			});
		},"json").fail(function() {
			alert( "An error occured while downloading the pokemon data" );
			searchPage();
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
	var obj;
	var match = function(qd,i)
	{
		if (obj[i] == null)
			obj[i] = []
		obj[i].push(qd);
	}
	$(".content").append('<input id="search" type="text"/><button id="searchb">Search</button><div id="results"></div>');
	$("#searchb").click(function()
	{
		var start = new Date().getTime();
		obj = {};
		$("#results").empty();
		var s = $("#search").val().toLowerCase();
		var ltrs = s.split("");
		if (queryData[s] != null)
		{
			match(queryData[s],1);
		}
		var j = queryKeys.length;
		while (j--)
		{
			var k = queryKeys[j];
			var d = queryData[k];
			if (k != s)
			{
				if (k.indexOf(s) >= 0)
				{
					match(d,1);
					continue;
				}
				var i = ltrs.length;
				var f = false;
				while (i--)
				{
					if (k.indexOf(ltrs[i]) >= 0)
					{
						f = true;
						break;
					}
				}
				if (!f)
					continue;
				
				var larg = Math.max(k.length,s.length);
				var val = (larg-LevenshteinDistance(s.toLowerCase(),k.toLowerCase()))/larg;
				if (val >= 0.5)
				{
					match(d,val);
				}
			}
		}
		
		function keys(obj)
		{
			var keys = [];

			for(var key in obj)
			{
				if(obj.hasOwnProperty(key))
				{
					keys.push(key);
				}
			}

			return keys;
		}
		
		keys(obj).sort().reverse().forEach(function(v)
		{
			var o = obj[v];
			for (var e in o)
			{
				var qd = o[e];
				for (var i in qd)
				{
					var v = qd[i];
					if (v != null)
					{
						var b = $("<button>"+v.type+": "+v.name+"</button>");
						b.click(searcher(v));
						$("#results").append(b);
					}
				}
			}
		});
		var end = new Date().getTime();
		var time = end - start;
		alert("Search time: "+time);
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
