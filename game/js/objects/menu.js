var menu = function()  {
  // pauseMenu= [],
  this.options = [];
  this.arrow = null;
  this.selItem = 0;

  //PauseMenu functions
  var MenuItem = function(text, sprite, width, height, x, y, func){
      this.text = text;
      this.sprite = sprite;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.func = func;
  };

  this.addMenuItem = function(text, sprite, func) {
      var width = game.cache.getImage(sprite).width,
          height = game.cache.getImage(sprite).height,
          x = ((game.width/2) - (width/2)),
          y = (game.height/2) - 100 + (this.options.length * 50);

      var item = new MenuItem(text, sprite, width, height, x, y, func);
      this.options.push(item);
  };

  this.showPauseMenu = function() {
      this.arrow = game.add.sprite(this.options[0].x - 40, game.camera.y + this.options[0].y, 'arrow').bringToTop();
      for (var i = 0; i < this.options.length; i++) {
          var e = this.options[i];
          var eX = game.camera.x + e.x,
              eY = game.camera.y + e.y;

          e.item = game.add.sprite(eX, eY, e.sprite);
          e.label = game.add.text(eX + (e.width/2) - (e.text.length * 5) - 25, eY + 5, e.text, {font: '28px Calibri', fill: '#fff'});
      }
  };

  this.hidePauseMenu= function() {
      this.arrow.y = -100;
      for (var i = 0; i < this.options.length; i++) {
          var e = this.options[i];
          e.item.kill();
          e.label.visible = false;
      }
  };

  this.pausegame = function() {
    // console.log(this.options);
      if(this.options.length > 0 && !game.paused){
          game.paused = true;
          isPaused = true;
          this.showPauseMenu();
          var e = game.input.onDown.add(this.pauseInput, this);
      }

  };

  this.unpausegame= function() {
      game.paused = false;
      isPaused = false;
      this.hidePauseMenu();
  };

  this.pauseInput= function(event) {
      if(game.paused){
          for (var i = 0; i < this.options.length; i++) {
              var e = this.options[i],
                  mX = game.camera.x + e.x,
                  mY = game.camera.y + e.y,
                  eX = game.camera.x + event.x,
                  eY = game.camera.y + event.y;

              if(eX > mX && eX < (mX + e.width) && eY > mY && eY < (mY + e.height)){
                  e.func();
              }
          }
      }
  },

  this.setArrow= function(){
      if(this.selItem < 0){
          this.selItem = this.options.length - 1;
      }
      this.arrow.y = game.camera.y + this.options[this.selItem].y;
  },
  //Pausemenu functions end

  //Pausemenu Keys
  this.keyWDown= function() {
      if(game.paused){
          this.selItem = (this.selItem - 1) % this.options.length;
          this.setArrow();
      }
  },

  this.keySDown= function() {
      if(game.paused){
          this.selItem = (this.selItem + 1) % this.options.length;
          this.setArrow();
      }
  },

  this.keyEnterDown= function() {
      if(game.paused){
          this.options[this.selItem].func();
      }
  };

};
