var combat = {

    music: {},
    playerOne: {},
    myTurn: true,
    pokeballs: [],
    level: 0,
    sel: [0, 0, 0, 0],
    monsterIndex: -1,

    menu: {},
    previousWorld:null,
    t: null,
    battleRoomId: {},

    // Enemy Variables
    online: false,
    trainer: {},
    npcMonster: null,

    init: function(pWorld, online, trainer,npcMonster,battleRoomId){
        this.online = online;
        this.trainer = trainer || {active: false};
        this.npcMonster = npcMonster;
        this.previousWorld = pWorld;

        //used by the server to keep track of which room you are in;
        this.battleRoomId = battleRoomId || 'battleId';

        // Initalize player one monsters
        player.initBag();
        player.bag.monsters.forEach(function(item) {
          item.text.updateFont({ font: "bold 20px Arial"})
          item.text.fill = "000";
          item.lvlText = game.add.text(660, 460 , 'LVL ' + item.level, {font: 'bold 22px Arial', fill: '#000'});
          item.initBattle({x:170,y:565},{x:490,y:445},{x:490,y:450},{x:490,y:485},false);
          item.kill();
          item.lvlText.kill(); // this is not a original item
        });
        this.menu = new menu2(0, 593, false);
    },

    createData: function(){
        var self = this;

        // Default menu
        this.menu.addMenuItem('Fight', 100, 0, 0, function () {
            combat.menu.showMenu(self.monsterIndex+5);
        });

        this.menu.addMenuItem('Items', 200, 0, 0, function () {
            combat.menu.showMenu(2);
        });

        this.menu.addMenuItem('Monster', 300, 0, 0, function () {
            combat.menu.showMenu(3);
        });

        if(!self.trainer.active && !self.online) {
        this.menu.addMenuItem('Run', 430, 0, 0, function () {
              game.state.start('loadNewArea',true,false,{x:player.phaser.x,y:player.phaser.y,name:player.name,areaId:combat.previousWorld.id},combat.previousWorld);
          });
        }

        // The attacks of our first monster
        player.bag.monsters.forEach(function(m, index) {
          m.attacks.forEach(function (attack, i) {
            self.menu.addMenuItem(attack.name, 100+(120*i), index+5, 0, function () {
                game.paused = true;
                self.menu.disable();
                if(combat.online) {
                  // SERVER CODE, HERE TOBBIEJ
                  if(player.bag.monsters[self.monsterIndex].mana >= attack.manaCost)
                  {
                    var damage = self.performeAttack(player.bag.monsters[self.monsterIndex],combat.trainer.monster,attack);

                    socket.emit('attack_battle',{
                      damage: damage,
                      attack: attack
                    });

                    var text = self.addText(player.bag.monsters[self.monsterIndex].name + " attacking with attack "+ attack.name + " dealing " + damage.toFixed(2) + " damage.");
                    _.delay(function() {
                      self.removeText(text);
                      _.delay(function() {
                        // Adds delay between attacks
                        self.menu.showMenu(0);

                        self.myTurn = false; // Disable inputs
                        game.paused = false;
                      },500)
                    },2000)
                    var mana = player.bag.monsters[self.monsterIndex].mana;
                    player.bag.monsters[self.monsterIndex].setMana(mana-attack.manaCost);
                  }
                  else {
                    combat.menu.disable();
                    player.bag.monsters[combat.monsterIndex].setMana(player.bag.monsters[combat.monsterIndex].mana+player.bag.monsters[combat.monsterIndex].maxMana/5);
                    socket.emit('change_turn');
                    var text = self.addText("Out of mana, regen it.");
                    _.delay(function() {
                      self.removeText(text);
                      self.menu.showMenu(0);
                    },2000);

                    game.paused = false;
                  }

                } else if (self.trainer.active) {

                } else {
                  if(player.bag.monsters[self.monsterIndex].mana >= attack.manaCost) {
                    var dmg = self.performeAttack(player.bag.monsters[self.monsterIndex],self.npcMonster,attack);
                    var text = self.addText(player.bag.monsters[self.monsterIndex].name + " attacking with attack "+ attack.name + " dealing " + dmg.toFixed(2) + " damage.");
                    _.delay(function() {
                      self.removeText(text);
                      _.delay(function() {
                        // Adds delay between attacks
                        self.menu.showMenu(0);
                        self.myTurn = false; // Disable inputs
                        game.paused = false;
                      },500)
                    },2000)
                    var mana = player.bag.monsters[self.monsterIndex].mana;
                    player.bag.monsters[self.monsterIndex].setMana(mana-attack.manaCost);
                    self.npcMonster.setHp(self.npcMonster.hp-dmg);
                  }
                  else
                  {
                    console.log('offline not enough mana for attack');
                    self.menu.enable();
                    game.paused = false;
                  }
              }
                // self.menu.showMenu(0);
            });
          });
        });


        // Add items from our bag.
        this.menu.addMenuItem('Healthpack', 100, 2, 0, function () {
          if(player.bag.items[1].amount>0){
            player.bag.monsters[self.monsterIndex].setHp(player.bag.monsters[self.monsterIndex].hp+=(player.bag.monsters[self.monsterIndex].maxHp/4));
            socket.emit('health_pack_used',(player.bag.monsters[self.monsterIndex].maxHp/4));
            self.menu.showMenu(0);
            self.myTurn = false;
            player.bag.items[1].amount--;
          }
        },{show:true, text:'Amount: ' + player.bag.items[1].amount, myIndex: 1, items: true});

        this.menu.addMenuItem('Manapack', 250, 2, 0, function () {
          if(player.bag.items[2].amount>0){
            player.bag.monsters[self.monsterIndex].setMana(player.bag.monsters[self.monsterIndex].mana+=(player.bag.monsters[self.monsterIndex].maxMana/4));
            self.menu.showMenu(0);
            self.myTurn = false;
            player.bag.items[2].amount--;
          }
        }, {show:true, text:'Amount: ' + player.bag.items[2].amount, myIndex: 2, items: true});

        if(!combat.online && !this.trainer.active) {
          this.menu.addMenuItem('Pokeball', 400, 2, 0, function () {
            if(player.bag.items[3].amount>0){
              player.bag.items[3].amount--;
              game.paused = true;
              self.menu.disable();
              var text = self.addText('Trying to catch ' + self.npcMonster.name);
              var procent = self.npcMonster.hp/self.npcMonster.maxHp;
              _.delay(function() {
                if(Math.random() > procent) {
                  self.removeText(text);
                  var text2 = self.addText('Success! You catched ' + self.npcMonster.name);
                  _.delay(function() {
                    self.removeText(text2);
                    game.state.start('loadNewArea',true,false,{x:player.phaser.x,y:player.phaser.y,name:player.name,areaId:combat.previousWorld.id},combat.previousWorld);
                    self.menu.showMenu(0);
                    game.paused = false;
                    self.myTurn = false;
                  },1000);
                  self.addMonsterToPlayer();
                } else {
                  self.removeText(text);
                  var text2 = self.addText('Failure, ' + self.npcMonster.name + ' escaped...');
                  _.delay(function() {
                    self.removeText(text2);
                    self.menu.showMenu(0);
                    game.paused = false;
                    self.myTurn = false;
                  },1000);
                }
              },1000);
            }
          }, {show:true, text:'Amount: ' + player.bag.items[3].amount, myIndex: 3, items: true});
        }

        // Add monsters to menu.
        player.bag.monsters.forEach(function(monster, index){
            var hp = monster.hp.toFixed(2);
            var maxHp = monster.hp.toFixed(2);
            var space = player.bag.monsters.length < 6 ? 100 : 20;
            self.menu.addMenuItem(monster.name, space+(120*index), 3, 0, function () {
              if(monster.alive && index != self.monsterIndex) {
                game.paused = true;
                self.menu.disable();
                self.hideMonster(self.monsterIndex);
                var text = self.addText('Come back ' + player.bag.monsters[self.monsterIndex].name);
                _.delay(function(){
                  self.removeText(text);
                  var text2 = self.addText('Go ' + monster.name);
                  _.delay(function(){
                    self.removeText(text2);
                    self.reviveMonster(index);
                    self.menu.showMenu(0);

                    if(combat.online)
                    {
                      var monsterObj = {
                        name: player.bag.monsters[combat.monsterIndex].name,
                        hp: player.bag.monsters[combat.monsterIndex].hp,
                        maxHp : player.bag.monsters[combat.monsterIndex].maxHp,
                        level: player.bag.monsters[combat.monsterIndex].level,
                        defense: player.bag.monsters[combat.monsterIndex].defense,
                        type: player.bag.monsters[combat.monsterIndex].type
                      };
                      console.log('change pokemon online');
                      // Send something to socket.io, my turn is over.
                      socket.emit('change_monster_battle',monsterObj);
                    }
                    else {
                      game.paused = false;
                      self.myTurn = false;
                    }
                  },1500);

                },1500);
              }
                // Send something to socket.io, my turn is over.

            }, {show:true, text:'HP: ' +hp + '/' + maxHp, myIndex: index});
        });

        this.menu.start();
    },

    create: function() {

        var background = game.add.image(0, 0, 'battle', 'battle_background.png');
        background.smoothed = false
        background.scale.x = 896/800;
        background.scale.y = 640/600;

        music = game.add.audio('combat');
        music.play();

        // Initaliaze the keys for combat
        keys.initKeys(true);

        this.initSelf();
        this.createData();



        if(combat.online) {
          // Do server stuff
          var monsterObj = {
            name: player.bag.monsters[this.monsterIndex].name,
            hp: player.bag.monsters[this.monsterIndex].hp,
            maxHp : player.bag.monsters[this.monsterIndex].maxHp,
            level: player.bag.monsters[this.monsterIndex].level,
            defense: player.bag.monsters[this.monsterIndex].defense,
            type: player.bag.monsters[this.monsterIndex].type
          };

          var numAlive = 0;
          var numDead = 0;
          var m = player.bag.monsters;
          for (var i = 0; i < m.length; i++) {
            if(m[i].alive) {
              numAlive++;
            }
            else {
              numDead++;
            }
          }

          //start/join a battleRoom
          socket.emit('start_battle',{
            battleId: combat.battleRoomId,
            monster: monsterObj,
            alive: numAlive,
            dead: numDead,
            playerName: player.name
          });
        } else
        {
          // Init enemy
          this.initEnemy();
        }

    },

    shutdown: function() {
      console.log('End combatmode, clear up resources');
      this.playerOne = {};
      this.myTurn = true;
      game.paused = false;
      game.input.keyboard.start();
      this.monsterIndex = -1;
      music.stop();
    },

    update: function() {
      var self = this;
      if(self.online)
      {
        return;
      }

      if(!this.myTurn) {
        // lock the keyboard
        game.paused = true;
        game.input.keyboard.stop();

        // SHOW INFOTEXT
        this.menu.disable(); // Disable the menu

        if(this.npcMonster.alive) {
          var text =  this.addText(self.npcMonster.name + " attacking...");
        } else {
          var text =  this.addText(self.npcMonster.name + " fainted, you won");
        }
        _.delay(function() {
          self.removeText(text);
          self.enemyAttack();
        },2000);

      } else {
        // self.menu.enable();
        // Easy variables
        var m = player.bag.monsters;
        var mFirst = m[this.monsterIndex];
        var lost = true;

        for (var i = 0; i < m.length; i++) {
          if(m[i].alive) {
            lost = false;
            break;
          }
        }

        if(lost) {
          console.log('lost');
          player.healAll();
          game.state.start('loadNewArea',true,false,{x:420,y:533,name:player.name,areaId:0},{id: 0, description: "This is the Pokecenter", areaName: "Pokecenter", imageName: "A2", monsterMaxLevel: 0, monsterMinLevel: 0,serverId:1});
          // SWITCH STATE
        } else if (!mFirst.alive) {
          // Force Switch Pokemon
          this.playerOne.pokeballs[this.monsterIndex].loadTexture('battle', 'pokeball_gray.png');
          game.paused = true;
          self.menu.disable();
          self.hideMonster(self.monsterIndex);
          var text = self.addText(player.bag.monsters[self.monsterIndex].name + ' fainted...');
          _.delay(function(){
            self.removeText(text);
            self.reviveFirstMonster();
            var text2 = self.addText('Go ' + player.bag.monsters[self.monsterIndex].name);
            _.delay(function(){
              self.removeText(text2);
              game.paused = false;
              self.myTurn = false;
            },1500);
          },1500);
        } else {

        }
        // Unlock it
        game.input.keyboard.start();
      }

    },

    initSelf: function() {
      // Variables
      this.playerOne.pokeballs = [];

      // Status background
      this.playerOne.infoBackground = game.add.image(420, 400, 'battle', 'infoBackground_self.png'); // Self
      game.add.image(700,592, 'battle', 'pokeball_background.png');
      for (var i = 0; i < player.bag.monsters.length; i++) {
        if(player.bag.monsters[i].alive) {
          this.playerOne.pokeballs.push(game.add.image(826-(i*23),598, 'battle', 'pokeball.png'));
        } else {
          this.playerOne.pokeballs.push(game.add.image(826-(i*23),598, 'battle', 'pokeball_gray.png'));
        }
      }

      // Text label & avatar
      this.playerOne.avatar = game.add.sprite(855, 585, 'ash').frame = 1;
      this.playerOne.nameLabel = game.add.text(710,578, player.name, {font: 'bold 11px Arial', fill:'#fff'});

      this.reviveFirstMonster();

    },

    initEnemy: function() {

      // Init common stuff
      this.trainer.infoBackground = game.add.image(250,130, 'battle', 'infoBackground_enemy.png');

      if(this.online || this.trainer.active) {
        this.initTrainer();
      } else {
        this.initMonster();
      }
    },

    initTrainer: function() {
      // About the trainer
      this.trainer.avatar = game.add.sprite(25, 15, 'ash').frame = 1;
      this.trainer.nameLabel = game.add.text(70,11, this.trainer.name, {font: 'bold 11px Arial', fill:'#fff'} );

      // Show number of monsters
      this.trainer.pokeballs = [];
      game.add.image(60,25, 'battle', 'pokeball_background.png');
      for (var i = 0; i < this.trainer.alive; i++) {
          this.trainer.pokeballs.push(game.add.image(70+(i*23),31, 'battle', 'pokeball.png'));
      }
      for (var i = this.trainer.alive; i < this.trainer.alive+this.trainer.dead; i++) {
        this.trainer.pokeballs.push(game.add.image(70+(i*23),31, 'battle', 'pokeball_gray.png'));
      }

      // Trainers current monster
      this.trainer.monster = new monster(
          0,
          this.trainer.monster.name,
          this.trainer.monster.hp,
          0,0,
          this.trainer.monster.maxHp,
          0,0,
          this.trainer.monster.defense,
          0,
          this.trainer.monster.level,
          this.trainer.monster.type,
          [],
          true  // Set bars to battleLength
      );
      this.setMonsterAttributes(this.trainer.monster);
    },

    switchTrainerMonster: function(m) {
      this.trainer.monster.image.loadTexture('pokemon_f', m.name);
      this.trainer.monster.alive = true;
      this.trainer.monster.hp = m.hp;
      this.trainer.monster.maxHp = m.maxHp;
      this.trainer.monster.level = m.level;
      this.trainer.monster.text.setText(m.name);
      this.trainer.monster.lvlLabel.setText("LVL: " + m.level);
      this.trainer.monster.type = m.type;
      this.trainer.monster.defense = m.defense;
      this.trainer.monster.setHp(m.hp);
      this.trainer.monster.hpBar.show();

      //quickfix, should be replaced
      this.trainer.monster.hpBar.first.bringToTop();
      this.trainer.monster.hpBar.middle.bringToTop();
      this.trainer.monster.hpBar.last.bringToTop();
    },

    initMonster: function() {
      this.npcMonster = new monster(
        0, // Id can be 0
        this.npcMonster.name,
        this.npcMonster.hp,
        this.npcMonster.mana,
        0, // Xp Starts at 0
        this.npcMonster.maxHp,
        this.npcMonster.maxMana,
        this.npcMonster.speed,
        this.npcMonster.defense,
        this.npcMonster.damage,
        this.npcMonster.level,
        this.npcMonster.type,
        this.npcMonster.attacks,
        true  // Set bars to battleLength
      );

      // Set the monster to catchAble
      this.npcMonster.catchAble = true;
      this.setMonsterAttributes(this.npcMonster);
    },

    enemyAttack() {
      var self = this;
      if(this.trainer.active) {
        // If Monser dead -> Switch, If bag < 1 -> WIN
        // ELSE Attack
      } else {
        if(this.npcMonster.hp <= 0) {
          // GIVE STATS
          game.paused = false;
          this.giveStats();

          game.state.start('loadNewArea',true,false,{x:player.phaser.x,y:player.phaser.y,name:player.name,areaId:combat.previousWorld.id},combat.previousWorld);
          // self.myTurn = true;
          // game.paused = false;

        } else {
          var attackIndex = _.random(0,self.npcMonster.attacks.length-1)

          npcDmg = self.performeAttack(self.npcMonster,player.bag.monsters[self.monsterIndex],self.npcMonster.attacks[attackIndex]);
          _.delay(function() {
              // Add a delay before show the text
              var text = self.addText('with attack ' + self.npcMonster.attacks[attackIndex].name + " and dealing " + npcDmg.toFixed(2) + " damage.");
            _.delay(function(){
              self.removeText(text);
              self.myTurn = true;
              game.paused = false;
              self.menu.enable();
            },2000);
          },500);
          var myHp = player.bag.monsters[self.monsterIndex].hp;
          player.bag.monsters[self.monsterIndex].setHp(myHp-npcDmg);
          // Force pokemon switch

        }
      }

    },

    setMonsterAttributes: function(m) {
      // Hide the manaBar
      m.manaBar.hide();
      // Scale the image
      m.image.scale.setTo(1.5);
      // Finaly Align the pokemon and its attributes

      m.hpBar.tiles = 24.5;
      var flying = ['Zubat','Pidgeotto','Pidgeot', 'Golbat', 'Fearow', 'Butterfree', 'Beedrill','Venomoth', 'Geodude'];
      if(flying.indexOf(m.name) > -1) {
        m.align(630,255,0,{x:265,y:190},{x:0,y:0},{x:265,y:155},true,true);
      } else {
        m.align(630,300,0,{x:265,y:190},{x:0,y:0},{x:265,y:155},true,true);
      }

      m.text.anchor.y = 0;
      m.text.setStyle({font: 'bold 20px Arial', fill:'#000'});
      m.lvlLabel = game.add.text(417, 190 , 'LVL: ' + m.level, {font: 'bold 12px Arial', fill:'#000'});
    },

    reviveFirstMonster: function() {
      var self = this;
      for (var i = 0; i < player.bag.monsters.length; i++) {
          if(player.bag.monsters[i].alive) {
            self.reviveMonster(i);
            break;
          }
      }
    },

    reviveMonster: function(index) {
      var self = this;
      var i = index || 0;
      this.menu.clearLevel(1);

      player.bag.monsters[index].attacks.forEach (function(attack, index){
        self.menu.addMenuItem(attack.name, 100+(120*index), 1, 0, function () {

          self.myTurn = false; // Disable inputs
          if(combat.online) {
            // SERVER CODE, HERE TOBBIEJ
            //get the damage
            // var damage = self.performeAttack(player.bag.monsters[self.monsterIndex],combat.trainer.monster,attack);
            //
            //
            // socket.emit('attack_battle',{
            //   damage: damage,
            //   attack: attack
            // });
          } else if (self.trainer.active) {

          } else {
            var dmg = self.performeAttack(player.bag.monsters[self.monsterIndex],self.npcMonster,attack);
            self.npcMonster.setHp(self.npcMonster.hp-dmg);
          }

          self.menu.showMenu(0,player);
        });
      });

      if(index != self.monsterIndex) {
        player.bag.monsters[i].revive();
        player.bag.monsters[i].lvlText.revive();
        player.bag.monsters[i].lvlText.bringToTop();
        self.monsterIndex = i;
      }
    },

    hideMonster: function(index) {
      var i = index || 0;
      var self = this;
      if(index == self.monsterIndex) {
        player.bag.monsters[i].kill();
        player.bag.monsters[i].lvlText.kill();
      }
    },

    giveStats: function() {
      game.paused = true;
      // Variables
      var self = this;
      var m = player.bag.monsters[self.monsterIndex];
      var opponent = self.trainer.active ? self.trainer.monster : self.npcMonster;

      // Give monster xp
      m.giveXp(opponent.level);

    },

    addMonsterToPlayer: function() {
      var self = this;
      game.paused = true;
      $.when(
         $.ajax({
            url: "http://mordin.asuscomm.com:8000/api/monster/name/"+self.npcMonster.name
          })
      ).then(
            function(mo) {
              var m = mo[0];
              var nm = new monster(
                  m.id,
                  self.npcMonster.name,
                  self.npcMonster.hp,
                  self.npcMonster.mana,
                  0, // Xp Starts at 0
                  self.npcMonster.maxHp,
                  self.npcMonster.maxMana,
                  self.npcMonster.speed,
                  self.npcMonster.defense,
                  self.npcMonster.damage,
                  self.npcMonster.level,
                  self.npcMonster.type,
                  self.npcMonster.attacks
                );
              nm.kill();
              if(player.bag.monsters.length < 6) {
                player.bag.monsters.push(nm)
                db.addMonster(nm,player.bag.monsters.length);
              }
              else {
                player.db.monsters.push(nm);
                db.addMonster(nm,0);
              }
            }
        );
    },

    addText: function(text) {
        var bar = game.add.graphics();
        bar.beginFill(0x0000000,0.0);
        bar.drawRect(game.camera.x, game.camera.y+game.height-50,game.width, 50);
        bar.beginFill(0xffffff, 0.0);
        bar.drawRect(game.camera.x+2, game.camera.y+game.height-48,game.width-4, 48);

        var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };

        var text = game.add.text(game.camera.x+50, game.camera.y+game.height-60 , text, style);
        text.setTextBounds(0, 0, game.width, 50);

        return textBox = {background : bar, text : text};
    },

    removeText: function(textBox) {
        textBox.background.destroy();
        textBox.text.destroy();
    },

    // Calculate damage
    performeAttack: function(attacker, deffender, attack){
      var crit = _.random(1,3,true);
      return crit*((attack.power*this.attackTypeMatch(attacker.type, attack.type)*this.effecktivity(attack.type, deffender.type)*attacker.damage*(1/2))/deffender.defense);
    },

    attackTypeMatch: function(attackerType, attackType)  {
      if(attackerType==attackType)
        {
          return 3/2;
        }
      return 1;
    },

    effecktivity: function(attackType, defenderType)  {
      if(attackType=='normal' && defenderType=='Ground')
        {return 1/2;}
      else if(attackType=='Fire' && (defenderType=='Fire' || defenderType=='Water' || defenderType=='Ground'))
        {return 1/2;}
      else if(attackType=='Fire' && (defenderType=='Grass'||defenderType=='Bug'))
        {return 2;}
      else if(attackType=='Water' && (defenderType=='Fire' || defenderType=='Ground'))
        {return 2;}
      else if(attackType=='Water' && (defenderType=='Water' || defenderType=='Grass'))
        {return 1/2;}
      else if(attackType=='Electric' && (defenderType=='Flying' || defenderType=='Water'))
        {return 2;}
      else if(attackType=='Electric' && (defenderType=='Electric' || defenderType=='Grass' || defenderType=='Ground'))
        {return 1/2;}
      else if(attackType=='Grass' && (defenderType=='Fire' || defenderType=='Grass' || defenderType=='Poison' ||defenderType=='Flying' || defenderType=='Bug'))
        {return 1/2;}
      else if(attackType=='Grass' && (defenderType=='Water' || defenderType=='Ground'))
        {return 2;}
      else if(attackType=='Fighting' && (defenderType=='Normal' || defenderType=='Ground'))
        {return 2;}
      else if(attackType=='Fighting' && (defenderType=='Poison' || defenderType=='Flying' || defenderType=='Pshycic' || defenderType=='Bug'))
        {return 1/2;}
      else if(attackType=='Poison' && (defenderType=='Grass' || defenderType=='Bug'))
        {return 2;}
      else if(attackType=='Poison' && (defenderType=='Poison' || defenderType=='Ground'))
        {return 1/2;}
      else if(attackType=='Ground' && (defenderType=='Fire' || defenderType=='Electric' || defenderType=='Poison'))
        {return 2;}
      else if(attackType=='Ground' && (defenderType=='Grass' || defenderType=='Bug'))
        {return 1/2;}
      else if(attackType=='Flying' && (defenderType=='Electric' || defenderType=='Ground'))
        {return 1/2;}
      else if(attackType=='Flying' && (defenderType=='Grass' || defenderType=='Fighting'|| defenderType=='Bug'))
        {return 2;}
      else if(attackType=='Pshycic' && (defenderType=='Poison' || defenderType=='Fighting'))
        {return 2;}
      else if(attackType=='Pshycic' && (defenderType=='Pshycic'))
        {return 1/2;}
      else if(attackType=='Bug' && (defenderType=='Fire' || defenderType=='Fighting'|| defenderType=='Flying'))
        {return 1/2;}
      else if(attackType=='Bug' && (defenderType=='Grass' || defenderType=='Poison'|| defenderType=='Pshycic'))
        {return 2;}
      return 1;
    },
}
