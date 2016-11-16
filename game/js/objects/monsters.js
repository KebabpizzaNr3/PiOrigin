var monster = function(id,n,hp,mana,xp,mHp,mMana,speed,defense,damage,lvl,type,attacks,battle) {

  this.id = id || 0;
  // The Name
  this.name = n || 'Squirtle';

  // Stats
  this.hp = hp || 0;
  this.mana = mana || 0;
  this.xp = xp || 0;
  this.maxHp = mHp || 100;
  this.maxMana = mMana || 100;
  this.speed = speed || 0;
  this.defense = defense || 0;
  this.damage = damage || 0;
  this.level =  lvl || 6;
  this.type = type || 'Grass';
  this.attacks = attacks || [];

  // this.reqExp=lvl*136*1.10^lvl; // Set this in combat mode, no need to be a variable.
  // Information

  if(hp <= 0) {
    this.alive = false;
  } else {
    this.alive = true;
  }
  this.outOfMana = false;
  this.text = null;

  // Init bars
  if(battle) {
    this.hpBar = new barObject(40,55,24.5,false,true);
    this.manaBar = new barObject(41,78,24.2,true,true);
  } else {
    this.hpBar = new barObject(40,55);
    this.manaBar = new barObject(41,78,17.2,true);
  }

  // Init the image if the image exist
  if(game.cache.checkImageKey('pokemon_f', this.name) != null) {
    this.image = game.add.image(55,50,'pokemon_f', this.name);
  } else {
    // Ofcourse Squirtle should be the standard one.
    this.image = game.add.image(55,50,'pokemon_f', 'Squirtle');
  };

  // Functions
  // ---------

  // Hide all the visual things
  this.kill = function() {
    this.hpBar.hide();
    this.manaBar.hide();
    this.text.kill();
    this.image.kill();
  }

  // Show all the visual things
  this.revive = function() {
    this.hpBar.show();
    this.manaBar.show();
    this.text.revive();
    this.image.revive();
    this.image.bringToTop();
    this.text.bringToTop();
  }

  // Update Hp or Mana
  this.setHp = function(hp) {
    var self = this;
    this.hp = hp;
    if(self.hp >= self.maxHp) {
      self.hp = self.maxHp;
    }
    this.hpBar.changeScale(this.hp,this.maxHp);
    if(this.hp <= 0) {
      this.alive = false;
      this.hp = 0;
    } else {
      this.alive = true;
    }
  };

  this.setMana = function(mana) {
    var self = this;
    this.mana = mana;
    if(self.mana >= self.maxMana) {
      self.mana = self.maxMana;
    }
    this.manaBar.changeScale(this.mana,this.maxMana);
    if(this.mana <= 0) {
      this.mana = 0;
      this.outOfMana = true;
    } else {
      this.outOfMana = false;
    }
  }

  // Set the image properties
  this.initImages = function() {
    this.image.fixedToCamera = true;
    this.image.anchor.x = 0.5;
    this.image.anchor.y = 1;
    this.image.smoothed = false;

    if(this.image.height > 46.5) {
      var scale = 46.5 / this.image.height;
      this.image.scale.setTo(scale);
    }
  };

  // Set the text properties
  this.initImageText = function() {
    var style = { font: "14px Calibri Light", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.text = game.add.text(Math.round(this.image.x + (this.image.width/2) + 2), Math.round(this.image.y), this.name, style);
    this.text.anchor.y = 1;
    this.text.fixedToCamera = true;
  };

  // Align everything
  this.align = function(x,y,index,hp,mana,text,battle,front) {



    var self = this;
    // Default values
    var index = index   ||  0;
    var text = text     ||  {x:(83+(x*index)),y:(52+(y*index))};
    var hp = hp         ||  {x:40+(142*index),y:55};
    var mana = mana     ||  {x:41+(142*index),y:78};
    var battle = battle ||  false;
    var front = front   &&  true;

    // image
    this.image.fixedToCamera = false;

    if(battle) {
      if(!front) {
        self.image.loadTexture('pokemon_b', self.name);
      }
        this.image.x = x;
        this.image.y = y;
    } else {
      this.image.x = 55+(x*index);
      this.image.y = 52+(y*index);
    }

    this.image.fixedToCamera = true;

    // Text
    this.text.fixedToCamera = false;
    this.text.x = text.x;
    this.text.y = text.y;
    this.text.fixedToCamera = true;

    // Bars
    this.hpBar.changeScale(self.hp,self.maxHp);
    this.manaBar.changeScale(self.mana,self.maxMana);
    this.hpBar.changePosition(hp.x,hp.y);
    this.manaBar.changePosition(mana.x,mana.y);

  };

  this.initBattle = function(img,text,hp,mana,front) {
    this.hpBar.addBackground();
    this.manaBar.addBackground();
    this.hpBar.tiles = 24.5;
    this.manaBar.tiles = 24.5;
    if(front) {
      this.image.scale.setTo(1.5);
    } else {
      this.image.scale.setTo(3);
    }
    this.align(img.x,img.y,0,hp,mana,text,true,front);
  }

  // Set the properties by default
  this.initImages();
  this.initImageText();



  // Give xp
  this.giveXp = function(opponentLvl){
    // Variables
    var self = this;
    var currentLvl = this.level
    var reqExp=this.level*136*Math.pow(1.10,this.level);

    // Add the xp
    this.xp += opponentLvl*100;

    while(this.xp>reqExp){
      this.lvlUp();
      this.xp -= this.level*136*Math.pow(1.10,this.level);
    }

    if(currentLvl < self.level) {
      combat.menu.disable();
      var text = combat.addText(self.name + " grew to level " + self.level);
      _.delay(function(){
        combat.removeText(text);
        $.when(currentLvl,self,
          $.ajax({
          url: "http://localhost:8000/api/monster/name/"+self.name,
        })).then(CheckEvolve);
      },1500);
    } else {
      game.paused = false;
    }

  };

  var CheckEvolve = function(currentLvl,self,m) {
    m = m[0][0];
    if(m.evolveLevel <= self.level) {
      $.when(currentLvl,self,
        $.ajax({
        url: "http://localhost:8000/api/monster/id/"+(m.id+1),
        success: function(mon) {
          mon = mon[0];
          self.name = mon.name;
          self.text.setText(self.name);
          self.image.loadTexture('pokemon_b', self.name);
          self.lvlUp(10,1);
        }
      })).then(
        function(currentLvl,self,m) {
          // Change Stats
          m = m[0][0];
          $.when(currentLvl,self,
            $.ajax({
            url: "http://localhost:8000/api/monster/"+JSON.stringify([m.id,m.id+1])+"/attacks",
          })
        ).then(checkAttacks);
        }
      );

    } else {
      $.when(currentLvl,self,
        $.ajax({
        url: "http://localhost:8000/api/monster/"+JSON.stringify([m.id])+"/attacks",
      })
    ).then(checkAttacks);
    }
  };

  var checkAttacks = function(oldLvl,self,attacks) {
    if(attacks[0].length < 1) {
      game.paused = false;
      return;
    }

    var unpause = true;

    attacks[0].forEach(function(attack, index) {
      if(oldLvl < attack.LevelRequirement && attack.LevelRequirement <= self.level) {
        unpause = false;
        $.when(self,
          $.ajax({
          url: "http://localhost:8000/api/attack/"+JSON.stringify([attack.AttackId]),
        })
      ).then(function(self,attack){
        attack = attack[0][0];
        game.paused = true;
        game.input.keyboard.start();
        combat.menu.enable();
        var text = combat.addText("Do you want to learn " + self.name + " " +attack.name+"?");

        // Yes/No options
        combat.menu.addMenuItem('Yes', 450, 100, 0, function () {
          combat.removeText(text);
          text = combat.addText("Remove one:");
          combat.menu.showMenu(101);
        });
        combat.menu.addMenuItem('No', 515, 100, 0, function () {
            game.paused = false;
        });

        self.attacks.forEach(function(a, index){
          combat.menu.addMenuItem(a.name, 180+(120*index), 101, 0, function () {
              a.id = attack.id;
              a.animation = attack.animation;
              a.manaCost = attack.manaCost;
              a.name = attack.name;
              a.power = attack.power;
              a.type = attack.type;
              game.paused = false;
          });
        })
        combat.menu.showMenu(100);
      });
    }
    });
    if(unpause){
      game.paused = false;
    }
  };

  this.lvlUp = function(extra, procent){
    var extra = extra || 1;
    var procent = procent || 1.05;

    // Stats
    this.level += 1;
    this.hp       = this.hp*procent+extra;
    this.maxHp    = this.maxHp*procent+extra;
    this.mana     = this.mana*procent+extra;
    this.maxMana  = this.maxMana*procent+extra;
    this.speed    = this.speed*procent+extra;
    this.damage   = this.damage*procent+extra;
    this.defense  = this.defense*procent+extra;

  };

// End of monster
};
