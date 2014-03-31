var err = function() {
	alert( "An error occured while downloading the pokemon data" );
	searchPage();
}

var ui = {
	"pokemon_species": function(data)
	{
		pageInit();
		loadScreen();
		
		$.get( "/json/pokemon/"+data.id+".json", function(pk)
		{
			$.get( "/json/pokemon_species/"+data.id+".json", function(species)
			{
				$.get( "/json/pokemon_stats/"+data.id+".json", function(st)
				{
					$.get( "/json/pokemon_species_flavor_text/"+data.id+".json", function(desc)
					{
						var included = [];
						for (var i in version_groups)
						{
							i = version_groups[i];
							if (Number(i.generation_id) >= Number(species.generation_id))
							{
								included.push(i);
							}
						}
						
						pageInit();
						
						var bstats = "";
						st.forEach(function(v)
						{
							bstats += "Base "+stats[v.stat_id-1].identifier.toUpperCase()+": "+v.base_stat+"<br>";
						});
						
						$(".content")
							.append("<h2>"+data.id+": "+data.name+" - The "+data.csv.genus+" Pokemon</h2>");
						$(".content").append("<h3>Base Stats</h3><p>"+bstats+"</p>");
						
						var gen = included[0];
						$(".content").append("<h4>Version Switcher</h4>");
						function loadSprite()
						{
							var s = mediaDir+"pokemon/main-sprites/"+gen.identifier+"/"+pk.id+".png";
							var div = $("<div id='sprites'></div>");
							$("#gendata").append(div);
							div.append("<img id='pkimg' src='"+s+"' style='display:block;margin:0 auto;'/>");
						}
						function switchGen(g)
						{
							//g is a value in included
							$("#pkimg").attr("src","/1x1.png");
							gen = g;
							var gd = $("#gendata").empty().append("<h2>Version Group: "+gen.identifier+"</h2>");
							loadSprite();
							gd.append("<h3>Versions: </h3>");
							var vgs;
							versions.every(function(v,i)
							{
								if (v.version_group_id == gen.id)
								{
									vgs = i;
									return false;
								}
								return true;
							});
							gen.identifier.split("-").forEach(function(ver,i)
							{
								gd.append("<h4>"+ver.charAt(0).toUpperCase()+ver.substring(1)+"</h4>");
								desc.every(function(d,i)
								{
									if (d.version_id == versions[vgs].id)
									{
										gd.append("<p>"+d.flavor_text+"</p>");
										vgs++;
										return false;
									}
									
									return true;
								});
							});
						}
						included.forEach(function(v)
						{
							var b = $("<button id='"+v.identifier+"'>"+v.identifier+"</button>");
							$(".content").append(b);
							b.click(function()
							{
								switchGen(v);
							});
						},function(){});
						$(".content").append("<div id='gendata'></div>");
						
						function leave()
						{
							//code called when the page is left
							//replaces all img src with 1x1.png
							$("#pkimg").attr("src","/1x1.png");
							//free memory by removing arguments
							pk = null;
							species = null;
							st = null;
							desc = null;
						}
						
						function postleave()
						{
							data = null;
						}
						
						var search = $("<button>Search</button>");
						search.click(function()
						{
							leave();
							searchPage();
							postleave();
						});
						
						var prev = $("<button>Previous</button>");
						prev.click(function()
						{
							leave();
							ui.pokemon_species(data.prev);
							postleave();
						});
						
						var next = $("<button>Next</button>");
						next.click(function()
						{
							leave();
							ui.pokemon_species(data.next);
							postleave();
						});
						
						$(".content").append(prev,search,next);
					},"json").onerror=err;
				},"json").onerror=err;
			},"json").onerror=err;
		},"json").onerror=err;
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
	$("#loader").css("display","none");
}
window['pageInit'] = pageInit;

function loadScreen()
{
	$("#loader").css("display","");
}
window['loadScreen'] = loadScreen;

ui.item = function(item)
{
	pageInit();
	loadScreen();
	$.get( "/json/items/"+item.id+".json", function(pk)
	{
		$.get( "/json/item_prose/"+item.id+".json", function(prose)
		{
			pageInit();
			var s = mediaDir+"items/"+pk.identifier+".png";
			$(".content").append("<h2>"+item.id+": "+item.name+"</h2>");
			$(".content").append("<img id='pkimg' src='"+s+"' style='display:block;margin:0 auto;'/>");
			$(".content").append("<p>"+formatData(prose.effect)+"</p>");
			registerLinkHandler();
			
			var search = $("<button>Search</button>");
			search.click(function()
			{
				searchPage();
			});
			
			var prev = $("<button>Previous</button>");
			prev.click(function()
			{
				ui.item(item.prev);
			});
			
			var next = $("<button>Next</button>");
			next.click(function()
			{
				ui.item(item.next);
			});
			
			$(".content").append(prev,search,next);
		},"json").onerror=err;
	},"json").onerror=err;
}

ui.home = function ()
{
	pageInit();
	$(".hcontent").append("<h3>Home</h3>");
	$(".content").append('<button id="gotosearchPage">Search</button><p>Welcome to PocketPoke, a pokemon data browser for the 3DS, desktop, and Wii U. The data here is indexed via the search feature. To start searching, press the search button above.</p><p>Yes, there are some loading screens, but it is very fluid. If you find any problems, please go to <a href="http://github.com/ds84182/ds84182.github.io/issues">Github</a> to report them.</p>');
	$("#gotosearchPage").click(function()
	{
		searchPage();
	});
}

ui.searchPage = function ()
{
	pageInit();
	
	var searcher = function(qd)
	{
		return function()
		{
			if (ui[qd.type] != null)
			{
				unloadPP();
				ui[qd.type](qd);
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
			
			if (k.startsWith(s))
			{
				match(d,1);
				continue;
			} else if (k.indexOf(s) >= 0)
			{
				match(d,0.75);
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

$(function()
{
	setTimeout(function()
	{
		window.scrollTo(0,215);
		lowMem = true;
		ui.home();
	},200);
});
