

SimpleProjectileClass = WeaponInstanceClass.extend({
    physBody: null,
    speed: 800,

    /*
     Position is inherited from Entity:
     pos: {
     x: 0,
     y: 0
     },
     */

    init: function (x, y, settings) {
        this.parent(x, y, settings);

        var startPos = settings.pos;

        this.dir = {
            x: settings.dir.x,
            y: settings.dir.y
        };

        this.lifetime = 2;

        // Create our physics body;
        var entityDef = {
            id: "SimpleProjectile",
            x: startPos.x,
            y: startPos.y,
            halfHeight: 5 * 0.5,
            halfWidth: 5 * 0.5,
            damping: 0,
            // YOUR CODE HERE
            // fill the userData object with
            // a unique string 'id' and an
            // 'ent' that contains a pointer
            // to this simple projectile.
            userData: {

            }
        };

        this.physBody = gPhysicsEngine.addBody(entityDef);

        this.physBody.SetLinearVelocity(new Vec2(settings.dir.x * this.speed,
            settings.dir.y * this.speed));
    },

    //--------------------------------------
    update: function () {
        this.lifetime -= 0.05;
        if(this.lifetime <= 0) {
            this.kill();
            return;
        }

        this.physBody.SetLinearVelocity(new Vec2(this.dir.x * this.speed,
            this.dir.y * this.speed));

        if(this.physBody !== null) {
            this.pos = this.physBody.GetPosition();
        }

        this.parent();
    }

});

gGameEngine.factory['SimpleProjectile'] = SimpleProjectileClass;

