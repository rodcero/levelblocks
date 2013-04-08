EntityClass = Class.extend({
    // can all be referenced by child classes
    pos : {x:0,y:0},
    size : {x:0,y:0},
    last : {x:0,y:0},
    hsize : {x:0,y:0},
    hpos : {x:0,y:0},
    //yoffset for entites that are shorter than the standard 70px height
    yoffset: 0,
    zIndex : 0,
    _killed : false,
    currSpriteName : null,

    init : function() { },
    // can be overloaded by child classes
    update : function() { },
    draw : function() {
        if (this.currSpriteName){
            drawSprite(this.currSpriteName, this.pos.x - gMap.viewRect.x, this.pos.y - gMap.viewRect.y - this.yoffset);
        }
    },
    setPhysBody: function(){

    }
});