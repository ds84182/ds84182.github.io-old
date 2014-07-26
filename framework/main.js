framework = {};

document.addEventListener('click', function(e) {
	var target = $(e.target);
	if ( e.target.className.indexOf("frameworklink") != -1 ) {
		e.stopPropagation();
		e.preventDefault();
		framework.load(target.attr("href"));
	}
}, true);

framework.load = function(page)
{
	$(document.body).animate({scrollTop: 0}, 500);
	
	$("#maincontentghost").css("opacity",1).empty().append($("#maincontent").children().detach());
	$("#maincontent").css("opacity",0).load("pages/"+page,function()
	{
		$("#maincontentghost").animate({opacity: 0}, 500, function(){$("#maincontentghost").empty();});
		$("#maincontent").animate({opacity: 1}, 500);
	});
}

$(window).load(function()
{
	framework.load("index");
});
