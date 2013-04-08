GrassBlockClass = EntityClass.extend({
    zIndex : 50,
    myPhysBody: null,

    init: function (inputx, inputy, settings) {
        this.currSpriteName = 'ground.png';
        this.pos.x = 200;
        this.pos.y = 300;
        this.hpos.x = 235;
        this.hpos.y = 335;
        this.hsize.x = 70;
        this.hsize.y = 70;

    },
    setPhysBody: function(){
        var  entityDef = {
            id: "ground",
            type: 'static',
            x: this.hpos.x,
            y: this.hpos.y,
            halfHeight: this.hsize.y / 2,
            halfWidth: this.hsize.x / 2,
            damping: 0,
            friction: 0.1,
            restitution: 0.2,
            density: 0,
            angle: 0,
            collidesWith: ['all'],
            userData: {
                "id": "ground",
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
    }
});
gGameEngine.factory['ground'] = GrassBlockClass;