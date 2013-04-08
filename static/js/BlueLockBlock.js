BlueLockBlockClass = EntityClass.extend({
    zIndex : 50,
    myPhysBody: null,

    init: function (inputx, inputy, settings) {
        this.currSpriteName = 'lock_blue.png';
        this.pos.x = 200;
        this.pos.y = 300;
        this.hpos.x = 235;
        this.hpos.y = 335;
        this.hsize.x = 70;
        this.hsize.y = 70;

    },
    setPhysBody: function(){
        var  entityDef = {
            id: "lock_blue",
            type: 'static',
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
                "id": "lock_blue",
                "ent": this,
                "activated": false
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
    onTouch: function(otherBody, point, impulse){
        if(!this.myPhysBody) return false;

        if(otherBody === null || !otherBody.GetUserData()){
            return false;
        }
        var data = otherBody.GetUserData();
        if(data.id == 'lock_blue' && this.myPhysBody.GetUserData().activated){
            otherBody.SetType(Body.b2_dynamicBody);
            data.activated = true;

        }
    },
    draw: function(){
        this.parent();
    }
});
gGameEngine.factory['lock_blue'] = BlueLockBlockClass;