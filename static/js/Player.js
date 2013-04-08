PlayerClass = EntityClass.extend({
    zIndex : 60,
    walkSpeed: 3,
    myPhysBody: null,
    anim: null,
    walking: false,
    jump: false,

    init: function () {
        this.currSpriteName = 'front.png';
        this.pos.x = 200;
        this.pos.y = 100;
        this.hpos.x = 233;
        this.hpos.y = 146;
        this.hsize.x = 66;
        this.hsize.y = 92;
        var  entityDef = {
            id: "Player",
            x: this.hpos.x,
            y: this.hpos.y,
            halfHeight: this.hsize.y / 2,
            halfWidth: this.hsize.x / 2,
            damping: 0.1,
            angle: 0,
            friction: 0.1,
            restitution: 0.1,
            density: 0,
            collidesWith: ['all'],
            userData: {
               "id": "Player",
               "ent": this
            }
        }
        //unique way to initialize
        var bodyDef = new BodyDef();
        bodyDef.type = Body.b2_dynamicBody;

        bodyDef.position.x = entityDef.x;
        bodyDef.position.y = entityDef.y;

        bodyDef.userData = entityDef.userData;
        bodyDef.angle = entityDef.angle;
        bodyDef.damping = entityDef.damping;
        bodyDef.density = entityDef.density;

        var body = gPhysicsEngine.world.CreateBody(bodyDef);
        var fixtureDefinition = new FixtureDef();
        fixtureDefinition.density = entityDef.density;
        fixtureDefinition.restitution = entityDef.restitution;
        fixtureDefinition.friction = entityDef.friction;
        fixtureDefinition.damping = entityDef.damping;

        // Now we define the shape of this object as a box
        fixtureDefinition.shape = new PolygonShape();
        fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight - 10);
        body.CreateFixture(fixtureDefinition);

        var circlefixDef = new FixtureDef();
        var circle = new CircleShape();
        circlefixDef.density = entityDef.density;
        circlefixDef.restitution = entityDef.restitution;
        circlefixDef.friction = entityDef.friction;
        circlefixDef.damping = entityDef.damping;
        circlefixDef.userData = "feet";
        circle.SetRadius(32);
        circle.SetLocalPosition(new Vec2(0, 37));
        circlefixDef.shape = circle;

        var playerSensorFixture = body.CreateFixture(circlefixDef);

        this.myPhysBody = body;

        //this.myPhysBody = gPhysicsEngine.addBody(entityDef);

        this.anim = new SpriteSheetAnimClass();
        this.anim._spriteNames.push("walk0001.png");
        this.anim._spriteNames.push("walk0002.png");
        this.anim._spriteNames.push("walk0003.png");
        this.anim._spriteNames.push("walk0004.png");
        this.anim._spriteNames.push("walk0005.png");
        this.anim._spriteNames.push("walk0006.png");
        this.anim._spriteNames.push("walk0007.png");
        this.anim._spriteNames.push("walk0008.png");
        this.anim._spriteNames.push("walk0009.png");
        this.anim._spriteNames.push("walk0010.png");
        this.anim._spriteNames.push("walk0011.png");
    },
    update: function(){
        //if postion lower than map kill

        if(this.myPhysBody !== null){
            var mPos = this.myPhysBody.GetPosition();
            this.pos.x = mPos.x - 33;
            this.pos.y = mPos.y - 22;
        }
       this.parent();
    },
    draw: function(){
        if(this.walking){
            this.anim.draw(this.pos.x  - gMap.viewRect.x, this.pos.y  - gMap.viewRect.y);
        }else{
            this.parent();
        }


        //
    },
    onTouch: function(otherBody, point, impulse){
        if(!this.myPhysBody) return false;

        if(otherBody === null || !otherBody.GetUserData()){
            return false;
        }

    }
});
gGameEngine.factory['Player'] = PlayerClass;