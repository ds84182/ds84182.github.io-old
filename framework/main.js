framework = {};

framework.load = function(page)
{
	$(".maincontent").load("pages/"+page);
}

$(window).load(function()
{
	framework.load("index");
});
