CaveBlockClass = EntityClass.extend({
    zIndex : 50,
    myPhysBody: null,

    init: function (inputx, inputy) {
        this.currSpriteName = 'ground_cave.png';
        this.pos.x = 200;
        this.pos.y = 300;
        this.hpos.x = 235;
        this.hpos.y = 335;
        this.hsize.x = 70;
        this.hsize.y = 70;

    },
    setPhysBody: function(){
        var  entityDef = {
            id: "ground_cave",
            type: 'static',
            x: this.hpos.x,
            y: this.hpos.y,
            halfHeight: this.hsize.y / 2,
            halfWidth: this.hsize.x / 2,
            damping: 100,
            density: 100,
            friction: 100,
            angle: 0,
            collidesWith: ['all'],
            userData: {
                "id": "ground_cave",
                "ent": this
            }
        }
        this.myPhysBody = gPhysicsEngine.addBody(entityDef);
    },
    update: function(){
        //if postion lower than map kill

    },
    draw: function(){
        this.parent();
    },
    onTouch: function(otherBody, point, impulse){
        if(!this.myPhysBody) return false;

        if(otherBody === null || !otherBody.GetUserData()){
            return false;
        }
        var data = otherBody.GetUserData();

        if(data.id == 'Player'){
            gGameEngine.gameOver();
        }
    }
});
gGameEngine.factory['ground_cave'] = CaveBlockClass;