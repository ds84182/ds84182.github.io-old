queryData = []; //objects that point to datatype and id
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
				{file:"ability_names",qdata:"name",qid:"ability_id"},
				{file:"item_names",qdata:"name",qid:"item_id"},
			];
			
			for (q in queryFiles)
			{
				$.get( "/csv/"+q.file+".csv", function( data ) {
					var csvobj = $.csv.toObjects(data);
					alert("Loaded "+q.file);
				});
			}
		}
	},500);
});
