var barGroup = {
  hp:[],
  mana:[],
  addHp: function(object) {
    this.hp.push(object);
  },
  addMana: function(object) {
    this.mana.push(object);
  }
};

var barObject = function(x,y,tiles,mana,background) {
  this.x = x || 0;
  this.y = y || 0;
  this.tiles = tiles || 17.5;
  this.mana = mana || false;
  this.background = null;

  if(background) {
    (this.background = game.add.image(x-4,y-5,'hpbars','hpBackground.png')).fixedToCamera = true;
  }

  // Add the images
  (this.first = game.add.image(x,y,'hpbars','redLeftCorner.png')).fixedToCamera = true;
  (this.middle = game.add.image(x+this.first.width,y,'hpbars','redBar.png')).fixedToCamera = true;
  (this.last = game.add.image(x+this.first.width+this.middle.width,y,'hpbars','redRightCorner.png')).fixedToCamera = true;


  this.addBackground = function() {
    (this.background = game.add.image(this.x-4,this.y-5,'hpbars','hpBackground.png')).fixedToCamera = true;
    this.first.bringToTop();
    this.middle.bringToTop();
    this.last.bringToTop();
  };

  // Change the color
  this.changeColor = function(color) {
    // Make the bar visable
    // this.show();

    if(color == 'yellow') {
      this.first.loadTexture('hpbars', 'yellowLeftCorner.png');
      this.middle.loadTexture('hpbars', 'yellowBar.png');
      this.last.loadTexture('hpbars','yellowRightCorner.png');
    } else if (color == 'red') {
      this.first.loadTexture('hpbars', 'redLeftCorner.png');
      this.middle.loadTexture('hpbars', 'redBar.png');
      this.last.loadTexture('hpbars','redRightCorner.png');
    } else if (color == 'green') {
      this.first.loadTexture('hpbars', 'greenLeftCorner.png');
      this.middle.loadTexture('hpbars', 'greenBar.png');
      this.last.loadTexture('hpbars','greenRightCorner.png');
    } else if (color == 'blue') {
      this.first.loadTexture('hpbars', 'blueLeftCorner.png');
      this.middle.loadTexture('hpbars', 'blueBarH.png');
      this.last.loadTexture('hpbars','blueRightCorner.png');
    }  else if (color == 'orange') {
      this.first.loadTexture('hpbars', 'orangeLeftCorner.png');
      this.middle.loadTexture('hpbars', 'orangeBar.png');
      this.last.loadTexture('hpbars','orangeRightCorner.png');
    }
  };

  // Hide the bar
  this.hide = function() {
    var self = this;
    this.first.kill();
    this.middle.kill();
    this.last.kill();

    if(this.background != null) {
      self.background.kill();
    }
  };

  // Show the bar
  this.show = function() {
    var self = this;
    if(this.background != null) {
      self.background.revive();
      self.background.bringToTop();
    }

    if(!this.first.alive || !this.middle.alive || !this.last.alive) {
    this.first.revive();
    this.middle.revive();
    this.last.revive();

    this.first.bringToTop();
    this.middle.bringToTop();
    this.last.bringToTop();
    }
  };

  this.remove = function() {
    this.first.destroy();
    this.middle.destroy();
    this.last.destroy();
  }

  this.changeScale = function(current,max) {
    // First remove the fixedToCamera
    this.first.fixedToCamera = false;
    this.middle.fixedToCamera = false;
    this.last.fixedToCamera = false;


    this.first.y = this.y;
    this.middle.y = this.y;
    this.last.y = this.y;

    this.middle.x = this.first.x+this.first.width;
    this.last.x   = this.middle.x+this.middle.width;
    this.last.scale.x = 1;

    var procent = current/max;
    if(procent > 0.1) {
      this.middle.scale.x = this.tiles*procent;
      this.last.x = (this.middle.x+this.middle.width);

    } else {
      // this.middle.scale.x = 0.5;
      this.middle.scale.x = this.tiles*procent;
      this.last.scale.x = 0.5;
      this.middle.x = this.first.x+5;
      this.last.x = this.middle.x+this.middle.width;

    }
    if(!mana) {
      if(procent >= 0.75) {
        this.changeColor('green');
      } else if (procent >= 0.50 && procent < 0.75 ) {
        this.changeColor('yellow');
      } else if (procent >= 0.25 && procent < 0.50) {
        this.changeColor('orange');
      } else if (procent > 0 && procent < 0.25) {
        this.changeColor('red');
      }
    } else {
        this.changeColor('blue');
      }

    this.first.fixedToCamera = true;
    this.middle.fixedToCamera = true;
    this.last.fixedToCamera = true;

    if(procent <= 0 || procent > 100) {
      this.hide();
    }

    return true;
  };
  // if(this.color == 'red')

  this.changePosition = function(x,y) {
    this.first.fixedToCamera = false;
    this.middle.fixedToCamera = false;
    this.last.fixedToCamera = false;

    // console.log('change position', x, y);
    this.x = x;
    this.y = y;

    // x position
    // console.log('before: ',this.first.position.x);
    this.first.position.x = x;
    // console.log('after: ',this.first.position.x);

    this.middle.position.x = x+this.first.width;
    this.last.position.x = x+this.first.width+this.middle.width;

    // y position
    this.first.position.y = y;
    this.middle.position.y = y;
    this.last.position.y = y;

    if(this.background != null) {
      this.background.fixedToCamera = false;
      this.background.x = this.x-4;
      this.background.y = this.y-5;
      this.background.fixedToCamera = true;
    }

    this.first.fixedToCamera = true;
    this.middle.fixedToCamera = true;
    this.last.fixedToCamera = true;

    return true;

  }
};
