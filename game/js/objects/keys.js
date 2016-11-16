var keys = {

  key:  {
    up: Phaser.Keyboard.W,
    left: Phaser.Keyboard.A,
    down: Phaser.Keyboard.S,
    right: Phaser.Keyboard.D,
    enter: Phaser.Keyboard.K,
    back: Phaser.Keyboard.L,
    menu: Phaser.Keyboard.ESC
  },

  // Keys
  wasd: {},
  enter: null,
  back: null,
  menu: null,

  // OnLoad, define our keys
  defineKeys: function() {
    // WASD
    this.wasd.up    = game.input.keyboard.addKey(this.key.up);
    this.wasd.left  = game.input.keyboard.addKey(this.key.left);
    this.wasd.down  = game.input.keyboard.addKey(this.key.down);
    this.wasd.right = game.input.keyboard.addKey(this.key.right);

    // Enter/Back/Menu
    this.enter  = game.input.keyboard.addKey(this.key.enter);
    this.back  = game.input.keyboard.addKey(this.key.back);
    this.menu  = game.input.keyboard.addKey(this.key.menu);
  },


  // Initalize our standard keys and their functions
  initKeys: function(battle) {
    this.resetAllKeys(); // Clear the keys
    if(battle) {

      // Move Left/Right on menu
      this.wasd.left.onDown.add(combat.menu.arrowMinus,combat.menu);
      this.wasd.right.onDown.add(combat.menu.arrowPlus,combat.menu);
      // Enter and back
      this.enter.onDown.add(combat.menu.executeSelected,combat.menu);
      this.back.onDown.add(combat.menu.goToParent,combat.menu);

    } else {

      // Enter, Backspace & Pause
      this.enter.onDown.add(explorationMode.checkItemCollision,explorationMode);
      this.menu.onDown.add(explorationMode.pauseGame,explorationMode);

    }
  },

  removeKey: function(keyCode) {
    if(this.wasd.left.keyCode == keyCode) {
      this.wasd.left.reset();
    } else if (this.wasd.right.keyCode == keyCode) {
      this.wasd.right.reset();
    } else if (this.wasd.up.keyCode == keyCode) {
      this.wasd.up.reset();
    } else if (this.wasd.down.keyCode == keyCode) {
      this.wasd.down.reset();
    } else if (this.back.keyCode == keyCode) {
      this.back.reset();
    } else if (this.enter.keyCode == keyCode) {
      this.enter.reset();
    }
  },

  // This function gives mneu keys priority
  initMenu: function(theMenu) {
    // First reset all keys
    this.resetAllKeys();

    this.wasd.up.onDown.add(theMenu.arrowMinus,theMenu);
    this.wasd.down.onDown.add(theMenu.arrowPlus,theMenu);
    this.back.onDown.add(theMenu.goToParent,theMenu);
    this.enter.onDown.add(theMenu.executeSelected,theMenu);
  },

  resetAllKeys: function() {
    this.wasd.left.reset();
    this.wasd.right.reset();
    this.wasd.up.reset();
    this.wasd.down.reset();
    this.back.reset();
    this.enter.reset();
    this.menu.reset();
  },

  addKeyOnce: function(key,func) {
    var k = key || this.keys.enter,
        self = this;
    // Restore the original key when done.
    var newFunc = function() {
          func();
          self.initKeys();
    };

    // Remove the current key
    this.removeKey(k.keyCode);
    // Finally add the function to the key once.
    k.onDown.addOnce(newFunc);
  },

};
