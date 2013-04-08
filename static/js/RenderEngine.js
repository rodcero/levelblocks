RenderEngineClass = Class.extend({
    canvas: null,
    context: null,
    lastMouse: {
        x: 0,
        y: 0
    },
    lastMouseCanvas: {
        x: 0,
        y: 0
    },
    // mouse position normalized & clamped to the canvas bounds
    init: function () {
        //Logger.log("RENDER ENGINE INIT CALLED");
        this.setup();
    },

    setup: function () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('keydown', this.keydown, false);
        window.addEventListener('keyup', this.keyup, false);

        //window.addEventListener('mousedown', this.mousedown, false);
        //window.addEventListener('mouseup', this.mouseup, false);
        //window.addEventListener('mousemove', this.mousemove, false);


    },

    keydown: function (event) {
        if (event.target.type == 'text') {
            return;
        }

        gInputEngine.onKeyDown(event);
    },

    //-----------------------------------------
    keyup: function (event) {
        if (event.target.type == 'text') {
           return;
        }

        gInputEngine.onKeyUp(event);
    },

    //-----------------------------------------
    mousemove: function (event) {
        var el = this.canvas;
        var pos = {
            left: 0,
            top: 0
        };
        while (el != null) {
            pos.left += el.offsetLeft;
            pos.top += el.offsetTop;
            el = el.offsetParent;
        }
        var tx = event.pageX;
        var ty = event.pageY;

        //RenderEngine.lastMouse.x = (tx - pos.left);
        //RenderEngine.lastMouse.y = (ty - pos.top);
        gRenderEngine.lastMouse.x = tx;
        gRenderEngine.lastMouse.y = ty;
        gInputEngine.onMouseMoveEvent(gRenderEngine.lastMouse.x,gRenderEngine.lastMouse.y);


        //weapons and events need the mouse locations clamped to the canvas bounds
        gRenderEngine.lastMouseCanvas.x = gRenderEngine.lastMouse.x;
        gRenderEngine.lastMouseCanvas.y = gRenderEngine.lastMouse.y - gRenderEngine.canvas.offsetTop;

    },

    getCanvasPosition: function (screenPosition) {

        //transfer position to world-space
        return {
            x: screenPosition.x - this.canvas.offsetLeft,
            y: screenPosition.y - this.canvas.offsetTop
        };
    },

    getScreenPosition: function(worldPosition) {
        return {
            x: -(gGameEngine.gMap.viewRect.x) + worldPosition.x,
            y: -(gGameEngine.gMap.viewRect.y) + worldPosition.y
        }
    },

    getWorldPosition: function (screenPosition) {
        var gMap = gGameEngine.gMap;

        //transfer position to world-space
        return {
            x: screenPosition.x + gMap.viewRect.x,
            y: screenPosition.y + gMap.viewRect.y
        };
    },

    getWorldMousePosition: function () {
        var gMap = gGameEngine.gMap;

        //transfer mouse position to world-space
        return {
            x: this.lastMouseCanvas.x + gMap.viewRect.x,
            y: this.lastMouseCanvas.y + gMap.viewRect.y
        };
    },

    drawString : function(pString, pFontName, locX, locY, size, settings)
    {
        var ctx = gRenderEngine.context;
        ctx.font =  size + "pt " + pFontName;

        if(settings.color)
            ctx.fillStyle=settings.color;

        if(settings.bounds)
        {
            var maxWidth = settings.bounds.w;
            var words = pString.split(" ");
            var line = "";
            var lineHeight = size + 4;
            var y = locY;
            for(var n = 0; n < words.length; n++)
            {
                var testLine = line + words[n] + " ";
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if(testWidth >= maxWidth)
                {
                    ctx.fillText(line, locX, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else
                {
                    line = testLine;
                }
            }
            ctx.fillText(line, locX, y);

        }
        else
        {
            if(settings.borderColor)
            {
                ctx.strokeStyle = settings.borderColor;
                if(settings.borderSize)
                    ctx.lineWidth  = settings.borderSize;

                ctx.strokeText(pString, locX, locY);
            }
            else
            {
                ctx.fillText(pString, locX, locY);
            }
        }




        ctx.fillStyle="#AAAAAA";
    }

});

var gRenderEngine = new RenderEngineClass();