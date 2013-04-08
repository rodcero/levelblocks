CrateBlockClass = EntityClass.extend({
    zIndex : 50,
    myPhysBody: null,

    init: function (inputx, inputy, settings) {
        this.currSpriteName = 'crate.png';
        this.pos.x = 200;
        this.pos.y = 300;
        this.hpos.x = 235;
        this.hpos.y = 335;
        this.hsize.x = 70;
        this.hsize.y = 70;

    },
    setPhysBody: function(){
        var  entityDef = {
            id: "crate",
            type: 'dynamic',
            x: this.hpos.x,
            y: this.hpos.y,
            halfHeight: this.hsize.y / 2,
            halfWidth: this.hsize.x / 2,
            damping: 0.1,
            density: 0,
            friction: 0.5,
            angle: 0,
            collidesWith: ['all'],
            userData: {
                "id": "crate",
                "ent": this
            }
        }
        this.myPhysBody = gPhysicsEngine.addBody(entityDef);
    },
    update: function(){
        if(this.myPhysBody !== null){
            var mPos = this.myPhysBody.GetPosition();
            this.pos.x = mPos.x - 35;
            this.pos.y = mPos.y - 35;
        }
        this.parent();

    },
    draw: function(){
        this.parent();
    }
});
gGameEngine.factory['crate'] = CrateBlockClass;