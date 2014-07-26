framework = {};

document.addEventListener('click', function(e) {
	var target = $(e.target);
	if ( target.attr("class").indexOf("frameworklink") != -1 ) {
		e.stopPropagation();
		e.preventDefault();
		framework.load(target.attr("href"));
	}
}, true);

framework.load = function(page)
{
	$(document.body).animate({scrollTop: 0}, 500, function()
	{
		$(".maincontent").load("pages/"+page,function()
		{
		});
	});
}

$(window).load(function()
{
	framework.load("index");
});
