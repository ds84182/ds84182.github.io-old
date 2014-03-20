var ui = {
	"pokemon_species": function(data)
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
			},"json")["fail"](function() {
				alert( "An error occured while downloading the pokemon data" );
				searchPage();
			});
		},"json")["fail"](function() {
			alert( "An error occured while downloading the pokemon data" );
			searchPage();
		});
	}
}
window["ui"] = ui;

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
window['pageInit'] = pageInit;

function loadScreen()
{
	$(".content").append('<p style="float: right; position: relative; top:188px; margin: 0;">Loading...</p>');
}
window['loadScreen'] = loadScreen;

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
	var matchm = function(qd,i)
	{
		if (obj[i] == null)
			obj[i] = [];
		obj[i].push(qd);
	}
	$(".content").append('<input id="search" type="text"/><button id="searchb">Search</button><div id="results"></div>');
	$("#searchb").click(function()
	{
		obj = {};
		$("#results").empty();
		//var start = new Date().getTime();
		var s = $("#search")["val"]().toLowerCase();
		var ltrs = s.split(" ");
		var j = queryKeys.length;
		var match = matchm;
		var qk = queryKeys;
		var qdat = queryData;
		var ltrs = ltrs;
		var ldist = LevenshteinDistance;
		var ltrslen = ltrs.length;
		
		while (j--)
		{
			var k = qk[j];
			var d = qdat[k];
			
			if (k.indexOf(s) >= 0)
			{
				match(d,1);
				continue;
			}
			var i = ltrslen;
			var f = false;
			while (i--)
			{
				var w = ltrs[i];
				var e = w.length;
				while (e--)
				{
					if (k.indexOf(w.substring(0,e)) >= 0)
					{
						f = true;
						break;
					}
					if (e<4) break;
				}
			}
			if (!f)
				continue;
			match(d,0.5);
			/*var larg = k.length;
			var val = (larg-ldist(s,k))/larg;
			if (val >= 0.5)
			{
				match(d,val);
			}*/
		}
		//var end = new Date().getTime();
		//var time = end - start;
		//alert("Search time: "+time);
		
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
	});
}
window['searchPage'] = searchPage;

$(function()
{
	setTimeout(function()
	{
		window.scrollTo(0,215);
		loadPP()
	},500);
});
