InputEngineClass = Class.extend({

    // A dictionary mapping ASCII key codes to string values
    // describing the action we want to take when that key is
    // pressed.
    bindings: {},

    // A dictionary mapping actions that might be taken in our
    // game to a boolean value indicating whether that action
    // is currently being performed.
    actions: {},

    mouse: {
        x: 0,
        y: 0
    },

    //-----------------------------
    setup: function () {
        // Example usage of bind, where we're setting up
        // the W, A, S, and D keys in that order.
        gInputEngine.bind(32, 'jump');
        gInputEngine.bind(65, 'move-left');
        gInputEngine.bind(68, 'move-right');

        // Adding the event listeners for the appropriate DOM events.
        //document.getElementById('canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
        //document.getElementById('canvas').addEventListener('keydown', gInputEngine.onKeyDown);
        //document.getElementById('canvas').addEventListener('keyup', gInputEngine.onKeyUp);
        $(document.body).keydown(gInputEngine.onKeyDown);
        $(document.body).keyup(gInputEngine.onKeyUp);
    },

    //-----------------------------
    onMouseMove: function (event) {
        gInputEngine.mouse.x = event.clientX;
        gInputEngine.mouse.y = event.clientY;
    },

    //-----------------------------
    onKeyDown: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to true.
        //
        // You'll need to use the bindings object you set in 'bind'
        // in order to do this.

        var action = gInputEngine.bindings[event.keyCode];
        console.log("down",action);
        if (action) {
            gInputEngine.actions[action] = true;
        }
    },

    //-----------------------------
    onKeyUp: function (event) {
        // Grab the keyID property of the event object parameter,
        // then set the equivalent element in the 'actions' object
        // to false.
        //
        // You'll need to use the bindings object you set in 'bind'
        // in order to do this.
        var action = gInputEngine.bindings[event.keyCode];
        console.log("up",action);
        if (action) {
            gInputEngine.actions[action] = false;
        }
    },

    // The bind function takes an ASCII keycode
    // and a string representing the action to
    // take when that key is pressed.
    //
    // Fill in the bind function so that it
    // sets the element at the 'key'th value
    // of the 'bindings' object to be the
    // provided 'action'.
    bind: function (key, action) {
        gInputEngine.bindings[key] = action;
    },
    clearPressed: function () {
        //for (var i = 0; i < this.delayedKeyup.length; i++) {
            //var action = this.delayedKeyup[i];
            //this.actions[action] = false;
            //this.locks[action] = false;
        //}
        for (var action in this.actions) {
            this.actions[action] = false;
        }
        //this.delayedKeyup = [];
        //this.presses = {};
    }

});

gInputEngine = new InputEngineClass();