local block = {x=0,y=0,sw=1,sh=1}
local doTweens
local finished = true

doTweens = function()
	finished = false
	flux.to(block,(math.random()*1.75)+0.25,{x=math.random(32,800-32),y=math.random(32,600-32),sw=math.random()*8,sh=math.random()*8}):oncomplete(function()
		finished = true
	end)
end

function update(dt)
	if finished then
		doTweens()
	end
end

function draw()
	love.graphics.draw(getAsset("block.png"),block.x,block.y,0,block.sw,block.sh)
end
