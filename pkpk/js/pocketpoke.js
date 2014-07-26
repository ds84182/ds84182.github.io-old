//polyfills

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position !== undefined && position < this.length ? position : this.length;
            position = position - searchString.length;
            return position >= 0 && this.lastIndexOf(searchString, position) === position;
        }
    });
}

if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

window["queryData"] = {}; //objects that point to datatype and id
window["queryKeys"] = [];
window["dataNum"] = 0;
window["queryFiles"] = [ //These are also the types
	"ability_names",
	"item_names",
	"location_names",
	//"location_area_prose",
	"move_names",
	"pokemon_species_names",
	//"region_names",
	"stat_names",
	//"version_names"
];

window["mediaDir"] = "/media/";
window["lowMem"] = false;
window["loadedQueryData"] = false;

function doLater(func)
{
	setTimeout(func,100);
}
window["doLater"] = doLater;

function UrlExists(url)
{
		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status!=404;
}
window["UrlExists"] = UrlExists;

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
window["foreach"] = foreach;

function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = data;
		var prev;
		for (var i in csvobj)
		{
			var v = csvobj[i];
			var nam = v.name.toLowerCase();
			if (queryData[nam] == null)
			{
				queryData[nam] = [];
				queryKeys.push(nam);
			}
			var cur = {type:q,id:v[q+"_id"],csv:v,name:v.name,prev:prev};
			if (prev != null)
				prev.next = cur;
			queryData[nam].push(cur);
			prev = cur;
		}
		dataNum--;
		if (dataNum <= 0)
		{
			ui.searchPage();
		}
	}
}
window["getDataProcessor"] = getDataProcessor;

function doQuery(q)
{
	$.get( "/json/"+q+".json", getDataProcessor(q.substring(0,q.length-6)),"json");
}

function loadJSON(f,obj,index)
{
	$.get( "/json/"+f+".json", function(data)
	{
		obj[index] = JSON.parse(data);
	},"json");
}
window["loadJSON"] = loadJSON;

window["version_groups"] = [{"id":"1","identifier":"red-blue","generation_id":"1","order":"1"},
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

window["versions"] = [{"id":"1","version_group_id":"1","identifier":"red"},{"id":"2","version_group_id":"1","identifier":"blue"},{"id":"3","version_group_id":"2","identifier":"yellow"},{"id":"4","version_group_id":"3","identifier":"gold"},{"id":"5","version_group_id":"3","identifier":"silver"},{"id":"6","version_group_id":"4","identifier":"crystal"},{"id":"7","version_group_id":"5","identifier":"ruby"},{"id":"8","version_group_id":"5","identifier":"sapphire"},{"id":"9","version_group_id":"6","identifier":"emerald"},{"id":"10","version_group_id":"7","identifier":"firered"},{"id":"11","version_group_id":"7","identifier":"leafgreen"},{"id":"12","version_group_id":"8","identifier":"diamond"},{"id":"13","version_group_id":"8","identifier":"pearl"},{"id":"14","version_group_id":"9","identifier":"platinum"},{"id":"15","version_group_id":"10","identifier":"heartgold"},{"id":"16","version_group_id":"10","identifier":"soulsilver"},{"id":"17","version_group_id":"11","identifier":"black"},{"id":"18","version_group_id":"11","identifier":"white"},{"id":"19","version_group_id":"12","identifier":"colosseum"},{"id":"20","version_group_id":"13","identifier":"xd"},{"id":"21","version_group_id":"14","identifier":"black-2"},{"id":"22","version_group_id":"14","identifier":"white-2"},{"id":"23","version_group_id":"15","identifier":"x"},{"id":"24","version_group_id":"15","identifier":"y"}];

window["stats"] = [{"id":"1","damage_class_id":"","identifier":"hp","is_battle_only":"0","game_index":"1"},{"id":"2","damage_class_id":"2","identifier":"attack","is_battle_only":"0","game_index":"2"},{"id":"3","damage_class_id":"2","identifier":"defense","is_battle_only":"0","game_index":"3"},{"id":"4","damage_class_id":"3","identifier":"special-attack","is_battle_only":"0","game_index":"5"},{"id":"5","damage_class_id":"3","identifier":"special-defense","is_battle_only":"0","game_index":"6"},{"id":"6","damage_class_id":"","identifier":"speed","is_battle_only":"0","game_index":"4"},{"id":"7","damage_class_id":"","identifier":"accuracy","is_battle_only":"1","game_index":""},{"id":"8","damage_class_id":"","identifier":"evasion","is_battle_only":"1","game_index":""}];

function unloadPP()
{
	if (lowMem)
	{
		//only unload if lowMem enabled
		queryData = {};
		queryKeys = [];
		loadedQueryData = false;
	}
}

function loadData()
{
	if (!loadedQueryData)
	{
		dataNum = queryFiles.length;
		
		for (var i in queryFiles)
		{
			setTimeout(doQuery,0,queryFiles[i]);
		}
		loadedQueryData = true;
	}
}

function loadPP()
{
	if (location.protocol != "file:")
	{
		pageInit();
		loadScreen();
		loadData()
	}
	else
	{
		ui.searchPage();
	}
}
window["loadPP"] = loadPP;
searchPage = loadPP;

window["LevenshteinDistance"] = (function() {
        var row2 = new Array(64);
        return function(s1, s2) {
            if (s1 === s2) {
                return 0;
            } else {
                var s1_len = s1.length, s2_len = s2.length;
                if (s1_len && s2_len) {
                    var i1 = 0, i2 = 0, a, b, c, c2, row = row2;
                    while (i1 < s1_len)
                        row[i1] = ++i1;
                    while (i2 < s2_len) {
                        c2 = s2.charAt(i2);
                        a = i2;
                        ++i2;
                        b = i2;
                        for (i1 = 0; i1 < s1_len; ++i1) {
                            c = a + (s1.charAt(i1) === c2 ? 0 : 1);
                            a = row[i1];
                            b = b < a ? (b < c ? b + 1 : c) : (a < c ? a + 1 : c);
                            row[i1] = b;
                        }
                    }
                    return b;
                } else {
                    return s1_len + s2_len;
                }
            }
        };
})();

function registerLinkHandler()
{
	$(".link").click(function()
	{
		var l = $(this).attr("pklink").split(":");
		var type = l[0];
		var name = l[1];
		//in order for links to work, we need to not have lowMem
		if (!loadedQueryData)
		{
			loadPP();
		}
		console.log(queryData[name]);
	});
}

function formatData(str)
{
	console.log(str);
	//finds links in the style of [%s-]{%s-} and redisplays them
	var out = "";
	var i = 0;
	var lll = 0; //last link location
	while (i<str.length)
	{
		var c = str.charAt(i);
		if (c == "[")
		{
			out += str.substring(lll,i);
			var oi = ++i;
			while (c!="]")
			{
				c = str.charAt(i++);
			}
			var name = str.substring(oi,i-1);
			c = str.charAt(i++);
			oi = i;
			while (c!="}")
			{
				c = str.charAt(i++);
			}
			var link = str.substring(oi,i-1);
			out += "<a pklink='"+link+"' class='link'>"+(name.length == 0 ? link : name)+"</a>";
			lll = i;
		}
		else if (c == "\n")
		{
			out += str.substring(lll,i) + "<br>";
			lll = i;
		}
		i++;
	}
	out += str.substring(lll,i);
	return out;
}
