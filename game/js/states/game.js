var explorationMode={

  // Objects
  music: {},
  map: {},
  layer: {},
  grass: {},
  cursors: {},
  // player: {},
  worldInfo: {},
  groupInteracts: {},

  // Arrays
  signs: [],
  starterMonsters: [],
  shortcuts: [],
  portalGroup: [],
  itemsGroup: [],
  healGroup: [],
  playerDbGroup: [],

  // Settings
  modulo: 2,
  grassTile: 5,
  groundTile: 225,
  sandTile: 228,
  bridgeTile: 135,

  userPos:null,
  userInfo:null,
  areaInfo: null,
  monstersInfo: null,
  m: {},
  mDb: {},



  addOnlinePlayer: function(otherplayer){

    //check if player already exsists
    for(var i = 0; i < this.groupInteracts.children.length; i++)
    {
      if(this.groupInteracts.children[i].id == otherplayer.id){
        return;
      }
    }

    //log.debug("Added multiplayer player",otherplayer.id);
    var newPlayer = this.groupInteracts.create(otherplayer.x, otherplayer.y, 'ash', false, true);
    newPlayer.anchor.set(0.5,0.5);
    newPlayer.id = otherplayer.id;
    newPlayer.direction = otherplayer.direction;

    newPlayer.animations.add('left', [player.faceLeft,10,player.faceLeft,11], 10, true);
    newPlayer.animations.add('right', [player.faceRight,3,player.faceRight,5], 10, true);
    newPlayer.animations.add('up', [7,6,8], 10, true);
    newPlayer.animations.add('down', [1,0,2], 10, true);

  },

  init: function(user, mapInfo, monstersInfo, items) {
      this.userInfo = user;
      explorationMode.worldInfo = mapInfo || {imageName:'A1', areaName: 'area52', id: 1};

      // Sort objects in the itemsArray
      items.forEach(function(child){
        if(child.type.toLowerCase() === 'portal') {
          explorationMode.portalGroup.push(child);
        } else if(child.type.toLowerCase() === 'sign') {
          explorationMode.signs.push(child);
        } else if(child.type.toLowerCase() === 'shortcut') {
          explorationMode.shortcuts.push(child);
        } else if(child.type.toLowerCase()==='starterpokemon'){
          explorationMode.starterMonsters.push(child);
        } else if(child.type.toLowerCase()==='playerdb'){
          explorationMode.playerDbGroup.push(child);
        }else if(child.type.toLowerCase()==='heal'){
          explorationMode.healGroup.push(child);
        }else {
          explorationMode.itemsGroup.push(child);
        }
      });
    },

  pauseGame: function () {
    game.paused = true;
    keys.initMenu(this.m);
    this.m.enable();
    this.m.showMenu(0);
  },

  unPauseGame: function(){
    game.paused = false;
    this.m.hideMenu(0);
    this.m.disable();
    keys.initKeys();

  },

  listMonsters: function(index, extra){
    this.m.clearLevel(index);
    for (var i = 0; i < player.bag.monsters.length; i++) {
      var e = player.bag.monsters[i];
      if(index == 1){
        this.m.addMenuItem(e.name, 0, index, (index - 1), function () {
          explorationMode.listMonsters(2, explorationMode.m.getSelectedIndex());
          explorationMode.m.showMenu(2);
        });
      }
      else{
        this.m.addMenuItem(e.name, 0, index, index - 1, function () {
          player.moveBagMonster(extra[1], explorationMode.m.getSelectedIndex()[1]);
          explorationMode.m.showMenu(0);
        });
      }
    }

    explorationMode.m.showMenu(index);
  },

  DbMonsterMenu: function () {
    this.mDb = {};
    this.mDb = new menu2(380, 200, true);
    this.mDb.addMenuItem('Resume', 0, 0, 0, function () {
      explorationMode.mDb.hideMenu(0);
      game.paused = false;
      explorationMode.mDb.disable();

      keys.initKeys();
    });
    if(player.db.monsters.length > 0) {
      explorationMode.mDb.addMenuItem('Change Monsters', 0, 0, 0, function () {
          explorationMode.listDbMonsters();
      });
    }
    this.mDb.prep();
    this.mDb.enable();
    keys.initMenu(explorationMode.mDb);
  },

  listDbMonsters: function(){
    explorationMode.mDb.clearLevel(1);
    for (var i = 0; i < player.db.monsters.length; i++) {
      var e = player.db.monsters[i];
      explorationMode.mDb.addMenuItem(e.name, 0, 1, 0, function () {
        explorationMode.listDbMonstersNext(explorationMode.mDb.getSelectedIndex());
        explorationMode.mDb.showMenu(2);
      });
    }

    explorationMode.mDb.showMenu(1);
  },

  listDbMonstersNext: function (extra) {
    explorationMode.mDb.clearLevel(2);
    for (var i = 0; i < player.bag.monsters.length; i++) {
      var e = player.bag.monsters[i];
      explorationMode.mDb.addMenuItem(e.name, 0, 2, 0, function () {
        var t = explorationMode.mDb.getSelectedIndex()[1];
        player.moveDbMonster(extra[1], explorationMode.mDb.getSelectedIndex()[1]);
        explorationMode.mDb.showMenu(0);
      });
    }
  },

  create: function() {
      keys.initKeys();

      music = game.add.audio('background');
      music.play();

      game.physics.startSystem(Phaser.Physics.ARCADE);

      map = game.add.tilemap(explorationMode.worldInfo.areaName);
      map.addTilesetImage('world', explorationMode.worldInfo.imageName);

      // Layers
      (this.grass = map.createLayer('Background')).resizeWorld();
      map.createLayer('Behind-blocks');
      layer = map.createLayer('Blocks');
      map.setCollisionBetween(0,8000);

      game.stage.backgroundColor = '#000';
      this.groupInteracts = game.add.group();


      // var c =  groupInteracts.create(game.world.centerX, game.world.centerY+50, 'ash', false, true);
      // var cc =  groupInteracts.create(game.world.centerX, game.world.centerY, 'ash', false, true);

      game.add.image(0,0,'top').fixedToCamera = true;

      // Initaliaze the player
      player.init(userInfo.x,userInfo.y, monstersInfo);
      player.name = userInfo.name;

      this.m = new menu2(380, 200, true);

      this.m.addMenuItem('Resume', 0, 0, 0, function () {
        explorationMode.unPauseGame();
      });
      this.m.addMenuItem('Save', 0, 0, 0, function () {
        db.save();
      });
      this.m.addMenuItem('Order monsters', 0, 0, 0, function () {
        explorationMode.listMonsters(1);
      });
      // this.m.addMenuItem('Change monsters', 0, 0, 0, function(){
      //   explorationMode.listDbMonsters();
      // });
      this.m.prep();

      //this should be called last in the create function
      //tell the server that you are ready
      //send the player object to the server

      socket.emit('start',{
        x: player.phaser.x,
        y: player.phaser.y,
        frame: player.phaser.direction,
        room: explorationMode.worldInfo.id
      });

  },

  // Checks if we ran into a portal, if true starts a state with the new map.
  checkPortal: function(){
    if((item = player.findTile(layer)) !== undefined) {
      explorationMode.portalGroup.forEach(function(child) {
        if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
          game.paused = true;
          socket.emit('leave_room');
          $.ajax({

            url: "http://localhost:8000/api/area/id/"+child.tpAreaId,
            success: function(newArea) {

              // Set the new values
              userInfo.x = child.tpX;
              userInfo.y = child.tpY;
              userInfo.areaId = child.tpAreaId;

              game.state.start('loadNewArea',true,false,userInfo,newArea[0]);

              game.paused = false;
            }
          });
        };
      })
    };
  },

  // This method clear resources when switching state
  shutdown: function() {
    game.paused = false;
    // Clear up the state
    music.stop();
    this.signs = [];
    this.shortcuts = [];
    this.itemsGroup = [];
    this.portalGroup = [];
    this.healGroup = [];
    this.playerDbGroup = [];
    this.mDb = {};
    // player.bag.monsters = [];
    console.log("Shutdown explorationMode, cleaing up reasources.");
  },

  update: function() {
      //  Collide the player and walls
      game.physics.arcade.collide(player.phaser,layer, this.checkPortal);

      //game.physics.arcade.collide(player.phaser, this.groupInteracts);

      // Controll if we moving on grass
      this.randomEncounter();
      player.move();

  },

  randomEncounter: function(){

    //Grassencounter
    if(Math.random()<0.0075 && this.hitGrass()){
      var monsterTypes = "Grass,Poison,Bug,Flying";
      $.when(this.getCharactersByType(monsterTypes)).then(this.getMonsterAttacks);
    }

    //Groundencounter  psychic, Fighting
    if(Math.random()<0.0075 && this.hitGround()){
      var monsterTypes = "Psychic,Fighting,Ground,Fire";
      $.when(this.getCharactersByType(monsterTypes)).then(this.getMonsterAttacks);
    }

    //Sandencounter Normal, Flying, electric
    if(Math.random()<0.0075 && this.hitSand()){
      var monsterTypes = "Normal,Flying,Electric,Fire";
      $.when(this.getCharactersByType(monsterTypes)).then(this.getMonsterAttacks);
    }

    if(Math.random()<0.0075 && this.hitBridge()){
      var monsterTypes = "Water";
      $.when(this.getCharactersByType(monsterTypes)).then(this.getMonsterAttacks);
    }
  },

  getCharactersByType: function(types){
    game.paused = true;
    return $.ajax({
      url: "http://localhost:8000/api/monster/type/" + types
    });
  },

  getMonsterAttacks: function(monsters) {
    var monster = _.sample(monsters);
    $.when(monster,explorationMode.getMonsterAttacksById(monster)).then(explorationMode.getAttacksById);
  },

  getMonsterAttacksById: function(monster) {
    return $.ajax({
      url: "http://localhost:8000/api/monster/" + JSON.stringify([monster.id]) + "/attacks"
    });
  },

  getAttacksById: function(monster, attacks) {
    monster.level = _.random(explorationMode.worldInfo.monsterMinLevel,explorationMode.worldInfo.monsterMaxLevel);
    arr = [];
    attacks[0].forEach(function(item, index){
      if(item.LevelRequirement <= monster.level) {
        arr.push(item.AttackId);
      }
    })

    if(arr.length > 0) {
      var attackIds = JSON.stringify(arr);

      $.ajax({
        url: "http://localhost:8000/api/attack/" + attackIds,
        success: function(result){
          var attacks = _.sampleSize(result,4);
          explorationMode.startRandomEncounter(monster,attacks);
        }
      });
    } else {
      game.paused = false;
      return false;
    }

  },


  startRandomEncounter: function(m, attacks){
    if(player.bag.monsters.length > 0) {
      var extra = Math.pow(1.05,(m.level-m.evolvedAt));
      game.paused = false;
      game.state.start('combat',true,false, explorationMode.worldInfo,
      false, {active:false},
      new monster(
        0,
        m.name,
        m.health+extra,
        m.mana+extra,
        0,
        m.health+extra,
        m.mana+extra,
        m.speed+extra,
        m.defense+extra,
        m.attack+extra,
        m.level,
        m.type,
        attacks
        )
      );
    } else {
      game.paused = true;
    }
  },

  hitSand: function(sprite, tile){
    if(this.getRayTile(-13,0,this.grass,this.sandTile) && this.getRayTile(0,15,this.grass,this.sandTile) && this.getRayTile(13,0,this.grass,this.sandTile) &&
    ((player.phaser.body.velocity.x > 0 || player.phaser.body.velocity.x < 0) || (player.phaser.body.velocity.y > 0 || player.phaser.body.velocity.y < 0))
    ) {
      return true;
    }

    return false;
  },

  hitGround: function(sprite, tile){
    if(this.getRayTile(-13,0,this.grass,this.groundTile) && this.getRayTile(0,15,this.grass,this.groundTile) && this.getRayTile(13,0,this.grass,this.groundTile) &&
    ((player.phaser.body.velocity.x > 0 || player.phaser.body.velocity.x < 0) || (player.phaser.body.velocity.y > 0 || player.phaser.body.velocity.y < 0))
    ) {
      return true;
    }

    return false;
  },

  // Check if player walks on grass
  hitGrass: function(sprite, tile) {

    if(this.getRayTile(-13,0,this.grass,this.grassTile) && this.getRayTile(0,15,this.grass,this.grassTile) && this.getRayTile(13,0,this.grass,this.grassTile) &&
    ((player.phaser.body.velocity.x > 0 || player.phaser.body.velocity.x < 0) || (player.phaser.body.velocity.y > 0 || player.phaser.body.velocity.y < 0))
    ) {
      return true;
    }

    return false;
  },

  hitBridge: function(sprite, tile) {

    if(this.getRayTile(-13,0,this.grass,this.bridgeTile) && this.getRayTile(0,15,this.grass,this.bridgeTile) && this.getRayTile(13,0,this.grass,this.bridgeTile) &&
    ((player.phaser.body.velocity.x > 0 || player.phaser.body.velocity.x < 0) || (player.phaser.body.velocity.y > 0 || player.phaser.body.velocity.y < 0))
    ) {
      return true;
    }

    return false;
  },

  checkItemCollision: function() {
    var self = this;
    if((item = player.findTile(layer)) !== undefined) {
      if(
        !this.checkHeal(item) &&
        !this.checkPlayerdb(item) &&
        !this.checkItems(item) &&
        !this.checkSigns(item) &&
        !this.checkStarterMonster(item)
        ) {
          self.checkOnlinePlayer();
      }
    } else {
      self.checkOnlinePlayer();
    };
  },

  checkOnlinePlayer: function(){
      var line = {};
      var lineLength = 30;

      if(player.phaser.frame >= 0 && player.phaser.frame <= 2)
      {
        line = new Phaser.Line(player.phaser.x,player.phaser.y,player.phaser.x,player.phaser.y + lineLength);
      }
      else if(player.phaser.frame >= 3 && player.phaser.frame <= 5)
      {
        line = new Phaser.Line(player.phaser.x,player.phaser.y,player.phaser.x + lineLength,player.phaser.y);
      }
      else if(player.phaser.frame >= 6 && player.phaser.frame <= 8)
      {
        line = new Phaser.Line(player.phaser.x,player.phaser.y,player.phaser.x,player.phaser.y - lineLength);
      }
      else if(player.phaser.frame >= 9 && player.phaser.frame <= 12)
      {
        line = new Phaser.Line(player.phaser.x,player.phaser.y,player.phaser.x - lineLength ,player.phaser.y);
      }


      var result = explorationMode.getRayCastSprites(
          line, 10, explorationMode.groupInteracts);

      if(result.length >= 1 && player.bag.monsters.length > 0)
      {
        socket.emit('interact',{id:result[0].id,name:player.name});
      }
  },

  checkItems: function(item) {
    var hit = false;
    this.itemsGroup.forEach(function(child) {
      if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
        hit = true;
        // Do stuff with certain items
        if(item.index == 7){
          player.bag.items[3].amount++; // Adds one Pokeball in your bag.
        }
        game.paused = true;
        var textBox = explorationMode.addText(child.text)

        keys.addKeyOnce(keys.enter,function() {
          map.removeTile(child.xPos,child.yPos,layer);
          explorationMode.removeText(textBox);
          game.paused = false;
        });
      }
    });
    return hit;
  },

  // Check if item is an sign. If true, display the signs text.
  checkSigns: function(item) {
    var hit = false;
    this.signs.forEach(function(child) {
      if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
        // Do stuff with certain items
        hit = true;
        game.paused = true;
        var textBox = explorationMode.addText(child.text)

        // Add a Temporarly key
        keys.addKeyOnce(keys.enter,function() {
          explorationMode.removeText(textBox);
          game.paused = false;
        });
      }
    });
    return hit;
  },

  // Check if item is a healitem in the pokecenter.
  checkHeal: function(item) {
    var hit = false;
    this.healGroup.forEach(function(child) {
      if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
        hit = true;
        // Do stuff with certain items
        game.paused = true;
        var textBox = explorationMode.addText(child.text)
        player.healAll();
        // Add a Temporarly key
        keys.addKeyOnce(keys.enter,function() {
          explorationMode.removeText(textBox);
          game.paused = false;
        });
      }
    });
    return hit;
  },

  // Check if item is the monsterdb controller in the pokecenter.
  checkPlayerdb: function(item) {
    var hit = false;
    this.playerDbGroup.forEach(function(child) {
      if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
        hit = true;
        // Do stuff with certain items
        game.paused = true;
        explorationMode.DbMonsterMenu();
        // Add a Temporarly key
        explorationMode.mDb.showMenu(0);
      }
    });
    return hit;
  },

  checkStarterMonster: function(item){
    var hit = false;
    this.starterMonsters.forEach(function(child){
      if(child.index == item.index && child.xPos == item.x && child.yPos == item.y) {
        var hit = true;
        // Do stuff with certain items
        game.paused = true;
        var textBox = explorationMode.addText(child.text)

        keys.addKeyOnce(keys.enter,function() {
          var newMonster;
          var monsterId = 0;

          if(child.index==506)
          {
            //pikachu
             var attacks = [{id:7},{id:7},{id:7},{id:7}];
             newMonster = new monster(25, "Pikachu", 35, 65, 0, 35, 65, 90, 45, 50, 5, "Electric", attacks);
             player.bag.monsters.push(newMonster);
          }
          else if(child.index==409){
            //Charmander
            var attacks = [{id:43},{id:43},{id:43},{id:43}];
            newMonster = new monster(4,"Charmander", 40, 70, 0, 40, 70, 37, 45, 55, 5, "Fire", attacks);
            player.bag.monsters.push(newMonster);
          }
          else if(child.index==349){
            //Bulba
            var attacks = [{id:7},{id:7},{id:7},{id:7}];
            newMonster = new monster(1,"Bulbasaur", 45, 60, 0, 45, 60, 45, 60, 40, 5, "Grass", attacks);
            player.bag.monsters.push(newMonster);
          }
          else if(child.index==469){
            //Squirtle
            var attacks = [{id:7},{id:7},{id:7},{id:7}];
            newMonster = new monster(7,"Squirtle", 43, 55, 0, 43, 55, 90, 65, 35, 5, "Water", attacks);
            player.bag.monsters.push(newMonster);
          }

          player.bag.items[0].amount = 500;
          player.bag.items[1].amount = 5;
          player.bag.items[2].amount = 5;
          player.bag.items[3].amount = 5;

          // Update our character
          db.updateItemAmounts();
          db.addMonster(newMonster, 1);
          db.updateCharacterXY(100,200,1);

          map.removeTile(child.xPos,child.yPos,layer);
          explorationMode.removeText(textBox);
          game.paused = true;

          // Change this to bootstate!
          // Refresh with short delay so our monster loads our attacks
          _.delay(function(){
            game.state.start('bootState',true,true);
            game.paused = false;
          },1000);

        });


        // This is more for the shortcuts
        keys.addKeyOnce(keys.back,function () {
          explorationMode.removeText(textBox);
          game.paused = false;
        });
      }

    });
    return hit;
  },

  // Add a textbox at the bottom of the screen
  addText: function(text) {
    var bar = game.add.graphics();
    bar.beginFill(0x0000000,1.0);
    bar.drawRect(game.camera.x, game.camera.y+game.height-102,game.width, 102);
    bar.beginFill(0xffffff, 1.0);
    bar.drawRect(game.camera.x+2, game.camera.y+game.height-100,game.width-4, 98);

    var style = { font: "bold 16px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    text = game.add.text(game.camera.x, game.camera.y+game.height-100 , text, style);
    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    text.setTextBounds(0, 0, game.width, 100);

    return textBox = {background : bar, text : text};
  },

  // Removes a textbox
  removeText: function(textBox) {
    textBox.background.destroy();
    textBox.text.destroy();
  },

  getRayTile: function(x,y,lay, tileIndex, dude) {
    // Defaults
    var x = x || 1;
    var y = y || 1;
    var lay = lay || layer;
    var tileIndex = tileIndex || false;
    var dude = dude || player.phaser;

    // Ray
    var line = new Phaser.Line(dude.position.x, dude.position.y, dude.position.x+(x), dude.position.y+y);
    var obj = lay.getRayCastTiles(line);
    var index = obj[obj.length-1].index

    if(tileIndex != false) {
      return (index == tileIndex);
    } else {
      if(x < 0 || y < 0) {
        return obj[0];
      } else {
        return obj[obj.length-1];
      }
    }


  },

  getRayCastSprites: function(line, stepRate, spriteGroup)  {
    if(!(spriteGroup.children.length > 0))
    {
      return [];
    }

    var coords = line.coordinatesOnLine(stepRate);
    var results = [];
    var sprites = spriteGroup.children;

    for (var i = 0; i < sprites.length; i++)
    {
        for (var t = 0; t < coords.length; t++)
        {
            var sprite = sprites[i];
            var coord = coords[t];
            if ((coord[0] > (sprite.x -sprite.width/2)) && (coord[0] < (sprite.x + sprite.width/2))
            && (coord[1] > (sprite.y - sprite.height/2) && (coord[1] < (sprite.y + sprite.height/2))))
            {
                results.push(sprite);
                break;
            }
        }
    }
      return results;
  },

  render: function() {
    // game.debug.bodyInfo(player.phaser, 64, 504);
    // game.debug.bodyInfo(player.phaser2, 300,300);
    game.debug.spriteBounds(player.phaser, 'pink', false);
    game.debug.body(player.phaser, 'red', false);
    // game.debug.geom(line, 'red');
    // game.debug.body(player.phaser2, 'red', false);
    // game.debug.spriteBounds(group, 'pink', false);
  },
}
