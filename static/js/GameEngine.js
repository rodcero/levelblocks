$(document).ready(function(){
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //var canvas_tile = new CanvasTile();
    //canvas_tile.create(600, 600);
    gInputEngine.setup();
    gGameEngine.setup();
    var tile_map = new TILEDMapClass();
    tile_map.load();
    var img = new Image();
    img.onload = function () {
        var ssc = new SpriteSheetClass();
        ssc.load(img);
        gSpriteSheets["atlas"] = ssc;

        //setInterval(gGameEngine.run, 1000/60);
        requestAnimFrame(gGameEngine.run);
    };

    // The 'src' value to load each new Image from is in
    // the 'image' property of the 'tilesets'.
    img.src = '/static/img/atlas.png';//map.tilesets[i].image;
    img.id = 'atlas';


    $('#share-modal').modal({
        show: false
    });

    $('#win-modal').modal({
        show: false
    });

    $('#done-button').click(function(){
        document.location = '/mylevels/';
    });

    $('#points-button').click(function(){
        document.location = '/';
    });

});

GameEngineClass = Class.extend({

    entities: [],
    factory: {},
    _deferredKill: [],
    clock: null,
    player : null,
    flag: false,
    publish: false,

    actions : {},
    bindings: {},
    //-----------------------------
    setup: function () {
        // Create physics engine
        gPhysicsEngine.create();
        this.player = this.spawnEntity('Player');
        //var block = this.spawnEntity('GrassBlock');

        gPhysicsEngine.addContactListener({
            PostSolve: function(bodyA, bodyB, impulse){
                var a = bodyA ? bodyA.GetUserData() : null;
                var b = bodyB ? bodyB.GetUserData() : null;

                if(a != null){
                    if(a.ent != null && a.ent.onTouch){
                        a.ent.onTouch(bodyB, null, impulse);
                    }
                }
                if(b != null){
                    if(b.ent != null && b.ent.onTouch){
                        b.ent.onTouch(bodyA, null, impulse);
                    }
                }

            }
        });
        // Example usage of bind, where we're setting up
        // the W, D, and Space keys in that order.
        this.bindings[32] = 'jump';
        this.bindings[65] = 'move-left';
        this.bindings[68] = 'move-right';
        $(document.body).keydown(onKeyDown);
        $(document.body).keyup(onKeyUp);
    },

    spawnEntity: function (typename) {
        var ent = new (gGameEngine.factory[typename])();
        gGameEngine.entities.push(ent);
        return ent;
    },

    update: function () {

        var move_dir = this.player.myPhysBody.GetLinearVelocity();
        gGameEngine.player.myPhysBody.jump = false;
        var cl = this.player.myPhysBody.GetContactList();
        if(cl){
            if(cl.contact.m_fixtureA.m_userData == "feet" || cl.contact.m_fixtureB.m_userData == "feet" ){
                this.player.jump = true;
            }

        }


        if(this.actions["move-left"]){
            move_dir.x -= this.player.walkSpeed;
            this.player.walking = true;
            gGameEngine.player.myPhysBody.SetLinearVelocity(move_dir);
        }
        if(this.actions["jump"] && this.player.jump){
            this.player.myPhysBody.ApplyImpulse(new Vec2(move_dir.x,-150), this.player.myPhysBody.GetWorldCenter());
            this.player.walking = false;
            this.player.jump = false;
        }
        if(this.actions["move-right"]){
            move_dir.x += this.player.walkSpeed;
            this.player.walking = true;
            gGameEngine.player.myPhysBody.SetLinearVelocity(move_dir);
        }

        // Loop through the entities and call that entity's
        // 'update' method, but only do it if that entity's
        // '_killed' flag is set to true.
        //
        // Otherwise, push that entity onto the '_deferredKill'
        // list defined above.
        for (var i = 0; i < gGameEngine.entities.length; i++) {
            var ent = gGameEngine.entities[i];
            if(!ent._killed) {
                ent.update();
            } else {
                gGameEngine._deferredKill.push(ent);
            }
        }

        // Loop through the '_deferredKill' list and remove each
        // entity in it from the 'entities' list.
        //
        // Once you're done looping through '_deferredKill', set
        // it back to the empty array, indicating all entities
        // in it have been removed from the 'entities' list.
        for (var j = 0; j < gGameEngine._deferredKill.length; j++) {
            gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
        }

        gGameEngine._deferredKill = [];

        // Update physics engine
        //gPhysicsEngine.update();
        gInputEngine.clearPressed();

        //check to see if gameover


    },
    draw: function(){
        gMap.draw(gRenderEngine.context);

        // Bucket entities by zIndex
        var fudgeVariance = 100;

        gGameEngine.entities.forEach(function(entity) {
            //don't draw entities that are off screen
           if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
                entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
                entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
                entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {

                entity.draw();

            }
        });
    },
    run: function(){
        gGameEngine.update();
        gPhysicsEngine.update();

        gGameEngine.draw();

        //gPhysicsEngine.world.DrawDebugData();
        gPhysicsEngine.world.ClearForces();


        //check to see if player is out of bounds
        var margin = 150;
        var pos = gGameEngine.player.pos;
        if(pos.x > gMap.pixelSize.x + margin || pos.x + margin < 0  ||
            pos.y > gMap.pixelSize.y + margin || pos.y + margin < 0 || gGameEngine.flag){
            gGameEngine.gameOver();
        }else{
            requestAnimFrame(gGameEngine.run);
        }
    },
    gameOver: function(){
        if(gGameEngine.flag){

            $.post(document.location.pathname, {done:true}, function(data){
                if(data.publish){
                    $('#share-modal').modal('show');
                }else{
                    $('#points').html(data.points);
                    $('#win-modal').modal('show');
                }
            });
        }
        else{
            $.post(document.location.pathname, {done:false}, function(data){
                location.reload()
            });
        }
    }
});

gGameEngine = new GameEngineClass();

function onKeyDown(event) {
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to true.
    //
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.

    var action = gGameEngine.bindings[event.keyCode];
    console.log("down",action);
    if (action) {
        gGameEngine.actions[action] = true;
    }
}

function onKeyUp(event) {
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to false.
    //
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.
    var action = gGameEngine.bindings[event.keyCode];
    console.log("up",action);
    if (action) {
        gGameEngine.actions[action] = false;
    }
}
