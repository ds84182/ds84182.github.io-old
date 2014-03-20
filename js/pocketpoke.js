var queryData = {}; //objects that point to datatype and id
var queryKeys = [];
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
	setTimeout(func,100);
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
					queryKeys.push(nam);
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

var v0 = new Array(26);
var v1 = new Array(26);
//basically returns the number of unmatching characters
function LevenshteinDistance(s, t)
{
    // degenerate cases
    if (s == t) return 0;
    if (s.length == 0) return t.length;
    if (t.length == 0) return s.length;
 
    // initialize v0 (the previous row of distances)
    // this row is A[0][i]: edit distance for an empty s
    // the distance is just the number of characters to delete from t
	var i, j, fi;
	i = v0.length;
    while(i--)
        v0[i] = i;
 
    for (var i = 0; i < s.length; i++)
    {
        // calculate v1 (current row distances) from the previous row v0
 
        // first element of v1 is A[i+1][0]
        //   edit distance is delete (i+1) chars from s to match empty t
        v1[0] = i + 1;
		var x = s[i];
 
        // use formula to fill in the rest of the row
        for (var j = 0; j < t.length; j++)
        {
            var cost = (x == t[j]) ? 0 : 1;
			var min = v1[j] + 1;
			var a = v0[j + 1] + 1;
			var b = v0[j] + cost;
			if (a < min)
				min = a;
			if (b < min)
				min = b;
            v1[j + 1] = min;
        }
 
        // copy v1 (current row) to v0 (previous row) for next iteration
		j = v0.length
        while (j--)
            v0[j] = v1[j];
    }
 
    return v1[t.length];
}

LevenshteinDistance = (function() {
        var row2 = [];
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
