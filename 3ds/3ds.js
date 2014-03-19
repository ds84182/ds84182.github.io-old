queryData = {}; //objects that point to datatype and id
function getDataProcessor(q)
{
	return function( data ) {
		var csvobj = $.csv.toObjects(data);
		alert("Loaded "+q);
		for (var i in cvsobj)
		{
			var v = cvsobj[i];
			if (queryData[v.name] === "undefined")
			{
				queryData[v.name] = [];
			}
			queryData[v.name].push({type:q,id:v[q+"_id"]});
		}
	}
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
			];
			
			for (var i in queryFiles)
			{
				var q = queryFiles[i];
				$.get( "/csv/"+q+"_names.csv", getDataProcessor(q));
			}
		}
	},500);
});
