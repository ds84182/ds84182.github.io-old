backgroundcolor = {}
backgroundcolor[1] = {92, 148, 252}
backgroundcolor[2] = {0, 0, 0}
backgroundcolor[3] = {32, 56, 236}

smbtilecount = 132
portaltilecount = 88
tilequads = {}
rgblist = {}
entityquads = {}
xtodraw = 224
camx = 0
scale = 1

function string:split(sep)
        local sep, fields = sep or ":", {}
        local pattern = string.format("([^%s]+)", sep)
        self:gsub(pattern, function(c) fields[#fields+1] = c end)
        return fields
end

function getaveragecolor(imgdata, cox, coy)
	local xstart = (cox-1)*17
	local ystart = (coy-1)*17
	
	local r, g, b = 0, 0, 0
	
	local count = 0
	
	for x = xstart, xstart+15 do
		for y = ystart, ystart+15 do
			local pr, pg, pb, a = imgdata:getPixel(x, y)
			if a > 127 then
				r, g, b = r+pr, g+pg, b+pb
				count = count + 1
			end
		end
	end
	
	r, g, b = r/count, g/count, b/count
	
	return r, g, b
end

quad = {}
function quad:new(...)
	local obj = {}
	setmetatable(obj,{__index=quad})
	obj:init(...)
	return obj
end

--COLLIDE?
--INVISIBLE?
--BREAKABLE?
--COINBLOCK?
--COIN?
--_NOT_ PORTALABLE?

function quad:init(img, imgdata, x, y, width, height)
	--get if empty?

	self.image = img
	self.quad = love.graphics.newQuad((x-1)*17, (y-1)*17, 16, 16, width, height)
	
	--get collision
	self.collision = false
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17)
	if a > 127 then
		self.collision = true
	end
	
	--get invisible
	self.invisible = false
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17+1)
	if a > 127 then
		self.invisible = true
	end
	
	--get breakable
	self.breakable = false
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17+2)
	if a > 127 then
		self.breakable = true
	end
	
	--get coinblock
	self.coinblock = false
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17+3)
	if a > 127 then
		self.coinblock = true
	end
	
	--get coin
	self.coin = false
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17+4)
	if a > 127 then
		self.coin = true
	end
	
	self.portalable = true
	local r, g, b, a = imgdata:getPixel(x*17-1, (y-1)*17+5)
	if a > 127 then
		self.portalable = false
	end
end

function loadbackground(background)
	local s = getAsset(background)
	if not s then print("Cannot load because: Missing map file") return false end
	
	customtiles = true
	customtilesimg = getAsset "tiles.png"
	if not customtilesimg then print("Cannot load because: Missing tileset") return false end
	customtilesimg:setFilter("nearest")
	
	local s2 = s:split(";")
	
	--remove custom sprites
	for i = smbtilecount+portaltilecount+1, #tilequads do
		tilequads[i] = nil
	end
	
	for i = smbtilecount+portaltilecount+1, #rgblist do
		rgblist[i] = nil
	end
	
	--load custom tiles
	local imgwidth, imgheight = customtilesimg:getWidth(), customtilesimg:getHeight()
	local width = math.floor(imgwidth/17)
	local height = math.floor(imgheight/17)
	local imgdata = customtilesimg:getData()
	
	for y = 1, height do
		for x = 1, width do
			table.insert(tilequads, quad:new(customtilesimg, imgdata, x, y, imgwidth, imgheight))
			local r, g, b = getaveragecolor(imgdata, x, y)
			table.insert(rgblist, {r, g, b})
		end
	end
	customtilecount = width*height
	
	--MAP ITSELF
	local t = s2[1]:split(",")
	
	if math.mod(#t, 15) ~= 0 then
		print("Incorrect number of entries: " .. #t)
		return false
	end
	
	mapwidth = #t/15
	startx = 3
	starty = 13
	
	map = {}
	
	for y = 1, 15 do
		for x = 1, #t/15 do
			if y == 1 then
				map[x] = {}
			end
			
			map[x][y] = t[(y-1)*(#t/15)+x]:split("-")
			
			r = map[x][y]
			
			if #r > 1 then
				if tonumber(r[2]) == 8 then
					startx = x
					starty = y
				end
			end
			
			if tonumber(r[1]) > smbtilecount+portaltilecount+customtilecount then
				r[1] = 1
			end
		end
	end
	
	--get background color
	custombackground = false
	
	for i = 2, #s2 do
		s3 = s2[i]:split("=")
		if s3[1] == "background" then
			local backgroundi = tonumber(s3[2])
	
			backgroundc = backgroundcolor[backgroundi]
		elseif s3[1] == "spriteset" then
			spriteset = tonumber(s3[2])
		elseif s3[1] == "custombackground" or s3[1] == "portalbackground" then
			custombackground = true
		end
	end
	
	if custombackground then
		loadcustombackground()
	end
end

function update(dt)
	if not map then
		loadbackground("1-1.txt")
	else
		camx = camx+(dt*32)
	end
end

function draw()
	if map then
		local scale = 2--love.graphics.getHeight()/(15*16)
		love.graphics.setColor(backgroundc)
		love.graphics.rectangle("fill",0,0,love.graphics.getDimensions())
		
		love.graphics.setColor(255,255,255)
		love.graphics.push()
		love.graphics.translate(-camx,0)
		for y = 1, 15 do
			for x = 1, xtodraw do
				local t = map[x][y]
				local tilenumber = tonumber(t[1])
				if tilequads[tilenumber].coinblock and tilequads[tilenumber].invisible == false then --coinblock
					--love.graphics.draw(coinblockimage, coinblockquads[spriteset][coinframe], math.floor((x-1)*16*scale), ((y-1)*16-8)*scale, 0, scale, scale)
					love.graphics.draw(tilequads[tilenumber].image, tilequads[tilenumber].quad, math.floor((x-1)*16*scale), ((y-1)*16+60)*scale, 0, scale, scale)
				elseif tilenumber ~= 0 and tilequads[tilenumber].invisible == false then
					love.graphics.draw(tilequads[tilenumber].image, tilequads[tilenumber].quad, math.floor((x-1)*16*scale), ((y-1)*16+60)*scale, 0, scale, scale)
				end
			end
		end
		love.graphics.pop()
	end
end
