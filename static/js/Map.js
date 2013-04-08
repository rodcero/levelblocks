var CanvasTile = Class.extend({
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    cvsHdl: null,
    ctx: null,

    //-----------------------------------------
    // Initializes this CanvasTile with initial
    // values and creates a new Canvas element
    // and context for it.
    create: function (width, height) {
        this.x = -1;
        this.y = -1;
        this.w = width;
        this.h = height;
        var can2 = document.getElementById('canvas');
        can2.width = width;
        can2.height = height;
        this.cvsHdl = can2;
        this.ctx = can2.getContext('2d');
    },

    //-----------------------------------------
    // Tests if this CanvasTile intersects the
    // 'viewRect' of the 'TILEDMapClass' using
    // the 'intersectRect' method below.
    isVisible: function () {
        var r2 = gMap.viewRect;
        var r1 = this;
        return gMap.intersectRect({
            top: r1.y,
            left: r1.x,
            bottom: r1.y + r1.h,
            right: r1.x + r1.w
        }, {
            top: r2.y,
            left: r2.x,
            bottom: r2.y + r2.h,
            right: r2.x + r2.w
        });
    }

});


var TILEDMapClass = Class.extend({
    // This is where we store the full parsed
    // JSON of the map.json file.
    currMapData: null,
    currentAtlasData: null,

    // tilesets stores each individual tileset
    // from the map.json's 'tilesets' Array.
    // The structure of each entry of this
    // Array is explained below in the
    // parseAtlasDefinition method.
    tilesets: [],

    // Our 'viewRect' determines what position
    // of the map that is visible on our canvas.
    // It defaults to the top-left corner of the
    // map with a width of 1000 and a height of
    // 1000.
    viewRect: {
        "x": 0,
        "y": 0,
        "w": 900,
        "h": 600
    },

    // This is where we store the width and
    // height of the map in tiles. This is
    // in the 'width' and 'height' fields
    // of map.json, respectively.
    // The values 100 here are just set
    // so these fields are initialized to
    // something, rather than null.
    numXTiles: 100,
    numYTiles: 100,

    // The size of each individual map
    // tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields
    // of map.json, respectively.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    tileSize: {
        "x": 64,
        "y": 64
    },

    // The size of the entire map,
    // in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles',
    // and 'tileSize' parameters.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    pixelSize: {
        "x": 64,
        "y": 64
    },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
    imgLoadCount: 0,

    // Boolean flag we set once our tile images
    // has finished loading.
    fullyLoaded: false,

    // Gives a default size for all of our
    // 'CanvasTiles' in pixels.
    canvasTileSize: {
        "x": 900,
        "y": 600
    },

    // An array to store all of our 'CanvasTile'
    // objects, so that we can cache them using
    // the preDrawCache method below.
    canvasTileArray: [],

    //-----------------------------------------
    // Load the json file at the url 'map' into
    // memory. This is similar to the requests
    // we've done in the past using
    // XMLHttpRequests.
    load: function () {

        var jsontext = document.getElementById('map').attributes['data-map'].value;
        this.parseMapJSON(jsontext);
        var jsonatlas = document.getElementById('atlas-map').attributes['data-map'].value;
        this.parseAtlasMapJSON(jsonatlas);

        //create collision objects
        var dat = gMap.currMapData.levelGrid;

        // ...For each tileID in the 'data' Array...
        for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
            // ...Check if that tileID is 0. Remember, we don't draw
            // draw those, so we can skip processing them...
            var tID = dat[tileIDX];
            if(tID === "") continue;

            var tPKT = gMap.getTilePacket(tID);

            var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
            var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;

            var block = gGameEngine.spawnEntity(tID);
            block.pos.x = worldX;
            block.pos.y = worldY;
            block.hpos.x = worldX + 35;
            block.hpos.y = worldY + 35;
            block.setPhysBody();
            //this.viewRect.x = gGameEngine.player.pos.x - 450;
            //this.viewRect.y = gGameEngine.player.pos.y - 300;

            //ctx.drawImage(tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y, worldX - vRect.left, worldY - vRect.top, this.tileSize.x, this.tileSize.y);

        }
    },
    parseAtlasMapJSON: function(atlasJSON){
        gMap.currentAtlasData = JSON.parse(atlasJSON);
    },
    //-----------------------------------------
    // Parses the map data from 'mapJSON', then
    // stores that data in a number of members
    // of our 'TILEDMapClass' that are defined
    // above.
    parseMapJSON: function (mapJSON) {
        // Call JSON.parse on 'mapJSON' and store
        // the resulting map data
        gMap.currMapData = JSON.parse(mapJSON);

        var map = gMap.currMapData;

        // Set 'numXTiles' and 'numYTiles' from the
        // 'width' and 'height' fields of our parsed
        // map data.
        gMap.numXTiles = map.width;
        gMap.numYTiles = map.height;

        // Set the 'tileSize.x' and 'tileSize.y' fields
        // from the 'tilewidth' and 'tileheight' fields
        // of our parsed map data.
        //gMap.tileSize.x = map.tilewidth;
        //gMap.tileSize.y = map.tileheight;
        gMap.tileSize.x = 70;
        gMap.tileSize.y = 70;
        // Set the 'pixelSize.x' and 'pixelSize.y' fields
        // by multiplying the number of tiles in our map
        // by the size of each tile in pixels.
        gMap.pixelSize.x = gMap.numXTiles * gMap.tileSize.x;
        gMap.pixelSize.y = gMap.numYTiles * gMap.tileSize.y;

        // Loop through 'map.tilesets', an Array...
        //for(var i = 0; i < map.tilesets.length; i++) {

            // ...loading each of the provided tilesets as
            // Images...
            var img = new Image();
            img.onload = function () {
                // ...Increment the above 'imgLoadCount'
                // field of 'TILEDMap' as each tileset is
                // loading...
                gMap.imgLoadCount++;
                if (gMap.imgLoadCount === 1){//gMap.tileSets.length) {
                    // ...Once all the tilesets are loaded,
                    // set the 'fullyLoaded' flag to true...
                    gMap.fullyLoaded = true;
                }
                gMap.preDrawCache();
                var ssc = new SpriteSheetClass();
                ssc.load(img);
                gSpriteSheets["atlas"] = ssc;
            };

            // The 'src' value to load each new Image from is in
            // the 'image' property of the 'tilesets'.
            img.src = '/static/img/atlas.png';//map.tilesets[i].image;
            img.id = 'atlas';
            //document.body.appendChild(img);
            // This is the javascript object we'll create for
            // the 'tilesets' Array above. First, fill in the
            // given fields with the corresponding fields from
            // the 'tilesets' Array in 'currMapData'.
            var ts = {
                "firstgid": 1,//currMapData.tilesets[i].firstgid,

                // 'image' should equal the Image object we
                // just created.

                "image": img,
                "imageheight": 520,//currMapData.tilesets[i].imageheight,
                "imagewidth": 520,//currMapData.tilesets[i].imagewidth,
                "name": 'atlas',//currMapData.tilesets[i].name,

                // These next two fields are tricky. You'll
                // need to calculate this data from the
                // width and height of the overall image and
                // the size of each individual tile.
                // 
                // Remember: This should be an integer, so you
                // might need to do a bit of manipulation after
                // you calculate it.

                "numXTiles": gMap.numXTiles,//Math.floor(currMapData.tilesets[i].imagewidth / gMap.tileSize.x),
                "numYTiles": gMap.numYTiles//Math.floor(currMapData.tilesets[i].imageheight / gMap.tileSize.y)
            };

            // After that, push the newly created object into
            // the 'tilesets' Array above. Javascript Arrays
            // have a handy method called, appropriately, 'push'
            // that does exactly this. It takes the object
            // we'd like to put into the Array as a parameter.
            // 
            // YOUR CODE HERE
            gMap.tilesets.push(ts);
        //}
    },
    parseAssetJSON: function(atlasJSON){
        gMap.currImgData = JSON.parse(atlasJSON);
        //parse atlas and get images
    },

    //-----------------------------------------
    // Grabs a tile from our 'layer' data and returns
    // the 'pkt' object for the layer we want to draw.
    // It takes as a parameter 'tileIndex', which is
    // the id of the tile we'd like to draw in our
    // layer data.
    getTilePacket: function (tileIndex) {

        // We define a 'pkt' object that will contain
        // 
        // 1) The Image object of the given tile.
        // 2) The (x,y) values that we want to draw
        //    the tile to in map coordinates.
        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        // The first thing we need to do is find the
        // appropriate tileset that we want to draw
        // from.
        //
        // Remember, if the tileset's 'firstgid'
        // parameter is less than the 'tileIndex'
        // of the tile we want to draw, then we know
        // that tile is not in the given tileset and
        // we can skip to the next one.
        //var tile = 0;
        //for(tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
            //if(gMap.tilesets[tile].firstgid <= tileIndex) break;
        //}

        // Next, we need to set the 'img' parameter
        // in our 'pkt' object to the Image object
        // of the appropriate 'tileset' that we found
        // above.
        pkt.img = gMap.tilesets[0].image;


        // Finally, we need to calculate the position to
        // draw to based on:
        //
        // 1) The local id of the tile, calculated from the
        //    'tileIndex' of the tile we want to draw and
        //    the 'firstgid' of the tileset we found earlier.
        //var localIdx = tileIndex - gMap.tilesets[0].firstgid;

        // 2) The (x,y) position of the tile in terms of the
        //    number of tiles in our tileset. This is based on
        //    the 'numXTiles' of the given tileset. Note that
        //    'numYTiles' isn't actually needed here. Think about
        //    how the tiles are arranged if you don't see this,
        //    It's a little tricky. You might want to use the 
        //    modulo and division operators here.
        ///var lTileX = Math.floor(1 % gMap.tilesets[0].numXTiles);
        //var lTileY = Math.floor(1 / gMap.tilesets[0].numXTiles);

        // 3) the (x,y) pixel position in our tileset image of the
        //    tile we want to draw. This is based on the tile
        //    position we just calculated and the (x,y) size of
        //    each tile in pixels.
        //pkt.px = (lTileX * gMap.tileSize.x);
        //pkt.py = (lTileY * gMap.tileSize.y);

        pkt.px = gMap.currentAtlasData.frames[tileIndex+".png"].frame.x;
        pkt.py = gMap.currentAtlasData.frames[tileIndex+".png"].frame.y;
        return pkt;
    },

    //-----------------------------------------
    // Test if two rectangles intersect. The parameters
    // are objects of the shape:
    // {
    //     top: The 'y' coordinate of the top edge
    //     left: The 'x' coordinate of the left edge
    //     bottom: The 'y' coordinate of the bottom edge
    //     right: The 'x' coordinate of the right edge
    // }
    intersectRect: function (r1, r2) {
        // Check if the rectangles r1 and r2 intersect,
        // returning true if they do intersect and false
        // if they do not intersect.
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    },

    //-----------------------------------------
    // Shifts the 'viewRect' object such that it's
    // center stays at the center of the canvas.
    centerAt: function(x, y) {
        // Set the properties of the 'viewRect' such that:
        //
        // 1) The width and height is equal to that of the
        //    canvas.
        //
        // 2) The (x,y) position of the top-left corner of
        //    the 'viewRect' is equal to the passed-in
        //    (x,y) parameters, shifted by the width and
        //    height of half the canvas.
        gMap.viewRect.x = x - (canvas_width / 2);
        gMap.viewRect.y = y - (canvas_height / 2);
        gMap.viewRect.w = canvas_width;
        gMap.viewRect.h = canvas_height;
    },

    //-----------------------------------------
    draw: function (ctx) {
        if(!gMap.fullyLoaded) return;

        //adjust viewRect to center player
        this.viewRect.x = gGameEngine.player.pos.x - this.viewRect.w * 0.5;
        this.viewRect.y = gGameEngine.player.pos.y - this.viewRect.h * 0.5;

        if(this.viewRect.y < 0){
            this.viewRect.y = 0;
        }else if(this.viewRect.y > (this.pixelSize.y - this.viewRect.h)){
            this.viewRect.y = this.pixelSize.y - this.viewRect.h;
        }

        if(this.viewRect.x < 0){
            this.viewRect.x = 0;
        }else if(this.viewRect.x > (this.pixelSize.x - this.viewRect.w)){
            this.viewRect.x = this.pixelSize.x - this.viewRect.w;
        }



        var g = ctx.createLinearGradient(0, 200, 0, 600);
        g.addColorStop(0, '#38B0DE');
        g.addColorStop(1, '#82CFFD');
        ctx.fillStyle = g;
        //ctx.fillStyle = '#3090C7'
        ctx.fillRect(0, 0, this.viewRect.w, this.viewRect.h);
    },

    //-----------------------------------------
    // Draws all of our map tiles to the 'canvasTileArray'
    // property of our 'TILEDMapClass' that we defined above.
    preDrawCache: function () {
        // First let's grab the total number of canvases (canvi? canvii?)
        // that we need to draw to fully tile our map, both across and
        // down.
        //
        // Be careful to make sure that at least 1 canvas is always drawn!
        var xCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.x / gMap.canvasTileSize.x);
        var yCanvasCount = /* YOUR CODE HERE */1 + Math.floor(gMap.pixelSize.y / gMap.canvasTileSize.y);

        // Now we'll need to create a new 'CanvasTile' for each of the
        // tile positions we calculated above, and initialize it with
        // the default size of our canvases as defined in our
        // 'canvasTileSize' property defined above.
        //
        // Finally, we'll need to push this new canvas to our
        // 'canvasTileArray'.
        //for(var yC = 0; yC < yCanvasCount; yC++) {
            //for(var xC = 0; xC < xCanvasCount; xC++) {
                var canvasTile = new CanvasTile();
                canvasTile.create(gMap.canvasTileSize.x, gMap.canvasTileSize.y);
                //canvasTile.x = xC * gMap.canvasTileSize.x;
                //canvasTile.y = yC * gMap.canvasTileSize.y;
                gMap.canvasTileArray.push(canvasTile);

                gMap.fillCanvasTile(canvasTile);
           // }
        //}

        gMap.fullyLoaded = true;
    },

    //-----------------------------------------
    // Draws all the relevant data to the passed-in
    // 'CanvasTile'. Note that this is very similar
    // to our 'draw' method above, but draws to the
    // context of the passed-in 'ctile'.
    fillCanvasTile: function (ctile) {
        // What we'd like to do is draw to Canvas context
        // of the passed-in 'ctile', rather than the
        // context of our game canvas.
        // We also need to create a new rectangle object
        // to use with intersectRect to test against
        // drawing below.
        // Create this here instead of within the for loop.
        var ctx = gRenderEngine.context;
        var g = ctx.createLinearGradient(0, 200, 0, 600);
        g.addColorStop(0, '#38B0DE');
        g.addColorStop(1, '#82CFFD');
        ctx.fillStyle = g;
        //ctx.fillStyle = '#3090C7'
        ctx.fillRect(0, 0, ctile.w, ctile.h);
        var vRect = {
           top: this.viewRect.y,
           left: this.viewRect.x,
           bottom: this.viewRect.y + this.viewRect.h,
           right: this.viewRect.x + this.viewRect.w
        };

        // Now, for every single layer in the 'layers' Array
        // of 'currMapData'...
        //for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
            // Check if the 'type' of the layer is "tilelayer". If it isn't, we don't
            // care about drawing it...
            //if(gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;

            // ...Grab the 'data' Array of the given layer...
            var dat = gMap.currMapData.levelGrid;

            // ...For each tileID in the 'data' Array...
            for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
                // ...Check if that tileID is 0. Remember, we don't draw
                // draw those, so we can skip processing them...
                var tID = dat[tileIDX];
                if(tID === "") continue;

                // ...If the tileID is not 0, then we grab the
                // packet data using getTilePacket.
                //var tPKT = gMap.getTilePacket(tID);
                var tPKT = gMap.getTilePacket(tID);

                // Now we need to calculate the (x,y) position we want to draw
                // to in our game world.
                //
                // We've performed a similar calculation in 'getTilePacket',
                // think about how to calculate this based on the tile id and
                // various tile properties that our TILEDMapClass has.
                var worldX = Math.floor(tileIDX % gMap.numXTiles) * gMap.tileSize.x;
                var worldY = Math.floor(tileIDX / gMap.numXTiles) * gMap.tileSize.y;

                // We also need to test whether the world position we're drawing to
                // is within the bounds of our 'ctile'.
                //
                // Use the rectangle you created above and the 'intersectRect' method
                // to determine this. If it isn't visible, then don't continue with
                // drawing.
                //var visible = gMap.intersectRect(vRect, {
                //    top: worldY,
                //    left: worldX,
                //    bottom: worldY + gMap.tileSize.y,
                //    right: worldX + gMap.tileSize.x
                //});
                //if(!visible) continue;

                this.viewRect.x = gGameEngine.player.pos.x - 450;
                this.viewRect.y = gGameEngine.player.pos.y - 300;

                // Nine arguments: the element, source (x,y) coordinates, source width and
                // height (for cropping), destination (x,y) coordinates, and destination width
                // and height (resize).
                //
                // Note that we don't want to stretch our tiles at all, so the
                // source height and width should be the same as the destination!
                //
                // Change the 'drawImage' call below as necessary to draw to the 'ctile' context
                // instead, and take into account the rectangle you created above when drawing
                // to the canvas tile.
                ctx.drawImage(tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y, worldX - vRect.left, worldY - vRect.top, this.tileSize.x, this.tileSize.y);
                //var img = document.getElementById('atlas');
                //ctx.drawImage(img, 10, 10);
            }
        //}
    }

});

var gMap = new TILEDMapClass();
