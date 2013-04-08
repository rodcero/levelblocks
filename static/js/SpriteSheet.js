SpriteSheetClass = Class.extend({
    img: null,
    url:"",
    sprites: new Array(),
    spriteData: null,
    //-----------------------------------------
    init: function () {},
    //-----------------------------------------
    load: function (img) {
        this.img = img;
        var jsonatlas = document.getElementById('atlas-map').attributes['data-map'].value;
        this.spriteData = JSON.parse(jsonatlas);
    },
    //-----------------------------------------
    defSprite: function (name, x, y, w, h, cx, cy) {
        var spt = {
            "id": name,
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "cx": cx==null? 0 : cx,
            "cy": cy==null? 0 : cy
        };
        this.sprites.push(spt);
    },
    //-----------------------------------------
    getStats: function (name) {
        for (var i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].id == name) return this.sprites[i];
        }
        return null;
    }


});
//-----------------------------------------
SpriteSheetAnimClass = Class.extend({
    _spriteSheet:null,
    _spriteNames:new Array(),
    _currAnimIdx: 0,
    _fps:15,
    _animIncPerFrame:0.5,
    _paused:false,
    //-----------------------------------------
    loadSheet: function(sheetName, spriteSheetURI)
    {
        this._spriteSheet = gSpriteSheets[sheetName];
        if(this._spriteSheet != null)
            return;

        var sheet = new SpriteSheetClass();
        sheet.load(spriteSheetURI);

        this._spriteSheet = sheet
        gSpriteSheets['grits_effects'] =sheet;

        this._spriteNames.length = 0;
        this._currAnimIdx = 0;
    },
    //-----------------------------------------
    pushFrame: function(spriteName)
    {
        this._spriteNames.push(spriteName);
    },
    //-----------------------------------------
    pause: function(onOff)
    {
        this._paused = onOff;
    },
    //-----------------------------------------
    getNumFrames: function()
    {
        return this._spriteNames.length;
    },
    //-----------------------------------------
    draw: function(posX, posY)
    {
        //if(this._spriteSheet == null) return;

        if(!this._paused)
            this._currAnimIdx +=  this._animIncPerFrame;

        var cIDX = Math.floor(this._currAnimIdx) % this._spriteNames.length;

        //var spt = this._spriteSheet.getStats(this._spriteNames[cIDX]);
        //if(spt == null)
            //return;

        drawSprite(this._spriteNames[cIDX],posX,posY);
    },
    //-----------------------------------------
    getCurrentFrameStats:function()
    {
        var cIDX = Math.floor(this._currAnimIdx) % this._spriteNames.length;
        return this._spriteSheet.getStats(this._spriteNames[cIDX]);
    }
});
//-----------------------------------------
function getSpriteNamesSimilarTo(nameValue)
{
    var d = new Array();
    for( sheetName in gSpriteSheets)
    {
        var sheet = gSpriteSheets[sheetName];
        for(var i =0; i < sheet.sprites.length; i++)
        {
            if(sheet.sprites[i].id.indexOf(nameValue) ==-1)
                continue;

            d.push(sheet.sprites[i].id);
        }
    }
    return d;
}

//-----------------------------------------
function drawSprite(spritename, posx, posy)
{
    var ctx = gRenderEngine.context;
    var sprite = gSpriteSheets["atlas"].spriteData.frames[spritename];
    ctx.drawImage(gSpriteSheets["atlas"].img, sprite.frame.x, sprite.frame.y , sprite.frame.w , sprite.frame.h , posx, posy, sprite.frame.w , sprite.frame.h);

    //for( sheetName in gSpriteSheets)
   // {
       // var sheet = gSpriteSheets[sheetName];
       // var spt = sheet.getStats(spritename);
       // if(spt == null)
        //    continue;

       // __drawSpriteInternal(spt,sheet,posX,posY,settings);


       // return;

   // }

};

//-------
function __drawSpriteInternal(spt,sheet,posX,posY,settings)
{
    if(spt == null || sheet == null)
        return;

    var gMap = gGameEngine.gMap;
    var hlf = {x: spt.cx , y: spt.cy};
    //var hlf = {x: spt.w * 0.5, y: spt.h * 0.5};



    var mapTrans = {x: gMap.viewRect.x, y: gMap.viewRect.y};
    var ctx = gRenderEngine.context;
    if(settings)
    {
        if(settings.noMapTrans)
        {
            mapTrans.x = 0;
            mapTrans.y = 0;
        }
        if(settings.ctx)
        {
            ctx = settings.ctx;
        }

    }


    if(settings && settings.rotRadians != null)
    {
        ctx.save();
        var rotRadians = Math.PI + settings.rotRadians;

        ctx.translate(posX - mapTrans.x, posY - mapTrans.y);
        ctx.rotate(rotRadians); //rotate in origin


        ctx.drawImage(sheet.img,
            spt.x, spt.y,
            spt.w, spt.h,
            +hlf.x,
            +hlf.y,
            spt.w,
            spt.h);
        ctx.restore();


    }
    else
    {
        ctx.drawImage(sheet.img,
            spt.x, spt.y,
            spt.w, spt.h,
            (posX - mapTrans.x) + (hlf.x),
            (posY - mapTrans.y) + (hlf.y),
            spt.w,
            spt.h);
    }

};
var gSpriteSheets = {};