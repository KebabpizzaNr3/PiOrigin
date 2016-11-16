var player = {

  // Player Settings
  name: "",
  faceLeft: 9,
  faceRight: 4,
  faceDown: 1,
  faceUp: 7,
  walkPhase: 150,

  // The phaser object
  phaser: null,

  // The bag
  bag: {
    items:{},
    monsters:[],
  },

  db:{
    monsters: [],
  },

  // Functions

  // Move the player
  move: function() {
    //  Reset the players velocity (movement)
    this.phaser.body.velocity.x = 0;
    this.phaser.body.velocity.y = 0;

    // Move the player
    if(keys.wasd.left.isDown)
    {
        this.phaser.body.velocity.x = -this.walkPhase;
        this.phaser.animations.play('left');
        this.direction = this.faceLeft;
    }
    else if (keys.wasd.right.isDown)
    {
        this.phaser.body.velocity.x = +this.walkPhase;
        this.phaser.animations.play('right');
        this.direction = this.faceRight;
    }
    else if (keys.wasd.up.isDown)
    {
        this.phaser.body.velocity.y = -this.walkPhase;
        this.phaser.animations.play('up');
        this.direction = this.faceUp;
    }
    else if (keys.wasd.down.isDown)
    {
        this.phaser.body.velocity.y = +this.walkPhase;
        this.phaser.animations.play('down');
        this.direction = this.faceDown;
    }
    else
    {
        //  If no cursor is detected, stand still
        this.phaser.animations.stop();
        this.phaser.frame = this.direction;
    }

    if(this.phaser.body.velocity.x != 0 || this.phaser.body.velocity.y != 0)
    {
      socket.emit('moving',{
        frame: this.phaser.frame,
        x: this.phaser.x,
        y: this.phaser.y
      });
    }

  },

  //Heals all monsters to full health
  healAll: function(){
    var self = this;
    this.bag.monsters.forEach(function(monster,index){
        monster.setHp(monster.maxHp);
        monster.setMana(monster.maxMana);
        monster.hpBar.show();
        monster.manaBar.show();
    });
  },

  // Returns a object of the found tile
  findTile: function(layer) {
    var layer = layer || explorationMode.layer;
    var item;
    var tile;
    if(this.phaser.frame == this.faceRight) {
      if((item = explorationMode.getRayTile(this.phaser.body.width/2+5,0,layer)).index > -1) {
        tile = item;
      }
    } else if(this.phaser.frame == this.faceDown) {
        if((item = explorationMode.getRayTile(0,this.phaser.body.height/2+5,layer)).index > -1) {
          tile = item;
        }
    } else if(this.phaser.frame == this.faceLeft) {
        if((item = explorationMode.getRayTile(-(this.phaser.body.width/2+5),0,layer)).index > -1) {
          tile = item;
        }
    } else if(this.phaser.frame == this.faceUp) {
        if((item = explorationMode.getRayTile(0,-(this.phaser.body.height/2+5),layer)).index > -1) {
          tile = item;
        }
    }
    return tile;
  },

  // Initaliaze the player
  init: function(x,y,monstersInfo) {
    var self = this;
    this.phaser = game.add.sprite(x, y, 'ash');
    game.physics.arcade.enable(this.phaser);
    this.phaser.body.collideWorldBounds = true;

    // Make camera follow player
    game.camera.follow(this.phaser);

    //  This adjusts the collision body size.
    this.phaser.body.setSize(26,30,0,0);
    this.phaser.anchor.set(0.5,0.5);

    //  Our animations
    this.phaser.animations.add('left', [this.faceLeft,10, this.faceLeft,11], 10, true);
    this.phaser.animations.add('right', [this.faceRight,3,this.faceRight,5], 10, true);
    this.phaser.animations.add('up', [7,6,8], 10, true);
    this.phaser.animations.add('down', [1,0,2], 10, true);
    this.phaser.direction = 1;

    this.initBag(monstersInfo);
  },

  initBag: function(monstersInfo) {
    var self = this;
    if(monstersInfo) {
      var allMonsters = [];
      // Add our monster in the bag
      monstersInfo.forEach(function(monsterInfo) {

            // Create array of attack objects
            var attacks = [
              {id:monsterInfo.attackId1, name:monsterInfo.a1Name, type:monsterInfo.a1Type, manaCost:monsterInfo.a1ManaCost, power:monsterInfo.a1Power, animation:monsterInfo.a1Animation},
              {id:monsterInfo.attackId2, name:monsterInfo.a2Name, type:monsterInfo.a2Type, manaCost:monsterInfo.a2ManaCost, power:monsterInfo.a2Power, animation:monsterInfo.a2Animation},
              {id:monsterInfo.attackId3, name:monsterInfo.a3Name, type:monsterInfo.a3Type, manaCost:monsterInfo.a3ManaCost, power:monsterInfo.a3Power, animation:monsterInfo.a3Animation},
              {id:monsterInfo.attackId4, name:monsterInfo.a4Name, type:monsterInfo.a4Type, manaCost:monsterInfo.a4ManaCost, power:monsterInfo.a4Power, animation:monsterInfo.a4Animation}
              ];

            // Insert monsters at their given position
            if(monsterInfo.slotNr != 0) {
            allMonsters.splice(monsterInfo.slotNr-1,0,new monster(
              monsterInfo.id,
              monsterInfo.name,
              monsterInfo.health,
              monsterInfo.mana,
              monsterInfo.exp,
              monsterInfo.maxHealth,
              monsterInfo.maxMana,
              monsterInfo.speed,
              monsterInfo.defense,
              monsterInfo.attack,
              monsterInfo.level,
              monsterInfo.type,
              attacks
            ));
          }
          else{
            self.db.monsters.push(new monster(
              monsterInfo.id,
              monsterInfo.name,
              monsterInfo.health,
              monsterInfo.mana,
              monsterInfo.exp,
              monsterInfo.maxHealth,
              monsterInfo.maxMana,
              monsterInfo.speed,
              monsterInfo.defense,
              monsterInfo.attack,
              monsterInfo.level,
              monsterInfo.type,
              attacks
            ));
            self.db.monsters[self.db.monsters.length - 1].kill();
          }
      });

      // Copy the six first monsters to the player bag
      this.bag.monsters = allMonsters.splice(0,6);

      // Align the pokemons at top
      this.bag.monsters.forEach(function(item,index) {
        item.align(142,0,index);
      });
    } else {
      var arr = [];
      player.bag.monsters.forEach(function(item, index) {
        arr.push(new monster(
          item.id,
          item.name,
          item.hp,
          item.mana,
          item.xp,
          item.maxHp,
          item.maxMana,
          item.speed,
          item.defense,
          item.damage,
          item.level,
          item.type,
          item.attacks
          ));
      });

      player.bag.monsters = arr.slice();
      player.bag.monsters.forEach(function(item,index) {
        item.align(142,0,index);
      });

      var dbarr = [];
      player.db.monsters.forEach(function(item, index) {
        var m = new monster(
          item.id,
          item.name,
          item.hp,
          item.mana,
          item.xp,
          item.maxHp,
          item.maxMana,
          item.speed,
          item.defense,
          item.damage,
          item.level,
          item.type,
          item.attacks
          );
          m.kill();
          dbarr.push(m);
      });

      player.db.monsters = dbarr.slice();

    }
  },

  alignMonstersTop: function() {
    // Align the pokemons at top
    player.bag.monsters.forEach(function(item,index) {
      item.align(142,0,index);
    });
  },

  moveBagMonster: function (fr, to){
        var self = this;
        var tmp = player.bag.monsters[to];
        player.bag.monsters[to] = player.bag.monsters[fr];
        player.bag.monsters[fr] = tmp;
        game.paused = false;
        self.alignMonstersTop()
        _.delay(function () {
          game.paused = true;
        },250);
    },

  moveDbMonster: function(fr, to){
    var self = this;

    player.bag.monsters[to].kill();
    self.db.monsters[fr].revive();

    var tmp = player.bag.monsters[to];
    player.bag.monsters.splice(to, 1, self.db.monsters[fr]);
    self.db.monsters.splice(fr, 1, tmp);

    // update dtabase
    db.updateMonster(tmp, true);
    db.updateMonster(player.bag.monsters[to]);

    game.paused = false;
      self.alignMonstersTop()
      _.delay(function () {
        game.paused = true;
    },250);
  }
};
