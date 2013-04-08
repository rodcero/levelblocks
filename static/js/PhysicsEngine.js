

// These are global shorthands we declare for Box2D primitives
// we'll be using very frequently.
Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef = Box2D.Dynamics.b2BodyDef;
Body = Box2D.Dynamics.b2Body;
FixtureDef = Box2D.Dynamics.b2FixtureDef;
Fixture = Box2D.Dynamics.b2Fixture;
World = Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw = Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
AABB = Box2D.Collision.b2AABB;

PhysicsEngineClass = Class.extend({
    world: null,

    PHYSICS_LOOP_HZ : 1.0 / 60.0,

    //-----------------------------------------
    create: function () {

        gPhysicsEngine.world = new World(
            new Vec2(0, 100), // Gravity vector
            false           // Don't allow sleep
        );

        //var debugDraw = new DebugDraw();
        //debugDraw.SetSprite(document.getElementById('canvas2').getContext('2d'));
        //debugDraw.SetDrawScale(0.65);
        //debugDraw.SetFillAlpha(0.3);
        //debugDraw.SetLineThickness(1.0);
        //debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
        //gPhysicsEngine.world.SetDebugDraw(debugDraw);
    },

    //-----------------------------------------
    update: function () {
        var start = Date.now();

        gPhysicsEngine.world.Step(
            gPhysicsEngine.PHYSICS_LOOP_HZ,    //frame-rate
            10,                 //velocity iterations
            10                  //position iterations
        );

        return(Date.now() - start);
    },

    //-----------------------------------------
    addContactListener: function (callbacks) {
        var listener = new Box2D.Dynamics.b2ContactListener();

        if(callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
            callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                contact.GetFixtureB().GetBody(),
                impulse.normalImpulses[0]);
        };

        this.world.SetContactListener(listener);
    },

    //-----------------------------------------
    registerBody: function (bodyDef) {
        var body = gPhysicsEngine.world.CreateBody(bodyDef);
        return body;
    },

    //-----------------------------------------
    addBody: function (entityDef) {
        var bodyDef = new BodyDef();

        var id = entityDef.id;

        if(entityDef.type == 'static') {
            bodyDef.type = Body.b2_staticBody;

        } else {
            bodyDef.type = Body.b2_dynamicBody;
        }

        bodyDef.position.x = entityDef.x;
        bodyDef.position.y = entityDef.y;

        if(entityDef.userData)  bodyDef.userData = entityDef.userData;
        bodyDef.angle = entityDef.angle;
        bodyDef.damping = entityDef.damping;

        var body = this.registerBody(bodyDef);
        var fixtureDefinition = new FixtureDef();
        fixtureDefinition.density = entityDef.density;
        fixtureDefinition.restitution = entityDef.restitution;
        fixtureDefinition.friction = entityDef.friction;
        fixtureDefinition.damping = entityDef.damping;

        // Now we define the shape of this object as a box
        fixtureDefinition.shape = new PolygonShape();
        fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
        body.CreateFixture(fixtureDefinition);

        return body;
    },

    //-----------------------------------------
    removeBody: function (obj) {
        gPhysicsEngine.world.DestroyBody(obj);
    }

});

var gPhysicsEngine = new PhysicsEngineClass();

