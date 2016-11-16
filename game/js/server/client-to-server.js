//var socket = io('10.22.15.109:9058');
var socket = io('localhost:9058');
var yourId;

socket.on('connection',function(data){
  //console.log(data);
  //log.debug("Connected:",data);
  //save your id on the server
  yourId = data;
});

socket.on('spawn',function(player){
  explorationMode.addOnlinePlayer(player);
});

socket.on('player-left',function(id){
  //log.debug("Player left", id);
  var tmpArray = explorationMode.groupInteracts.children;

  for(var i = 0; i < tmpArray.length; i++)
  {
    if(tmpArray[i].id == id)
    {
      //remove the player from the array
      tmpArray[i].kill();
      tmpArray.splice(i,1);
      break;
    }
  }
});

socket.on('moving', function(player){
  var tmpArray = explorationMode.groupInteracts.children;

  for(var i = 0; i < tmpArray.length; i++)
  {
    if(tmpArray[i].id == player.id)
    {
      tmpArray[i].x = player.x;
      tmpArray[i].y = player.y;
      tmpArray[i].frame = player.frame;
      break;
    }

  }

});

socket.on('interact_response', function(roomId){
  console.log( "you should join room '"+ roomId +"' for battle");
  socket.emit('leave_room');
  game.state.start('combat',true,false, explorationMode.worldInfo,true,true,false,roomId);
});

socket.on('interact_request',function(otherplayer){
  var response = {};
  var playerString = "Do you want to start a battle against " + otherplayer.name +"?";

  if(player.bag.monsters.length < 1) {
    response.res = false;
    response.id = otherplayer.id;
    socket.emit('interact_response',response);
  } else {

    //add some options for the player
    game.paused = true;
    var textBox = explorationMode.addText(playerString);

    // var yesKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
    // var noKey = game.input.keyboard.addKey(Phaser.Keyboard.N);

    // Yes key
    keys.addKeyOnce(
      keys.enter,
      function() {
        response.res = true;
        explorationMode.removeText(textBox);
        game.paused = false;
        response.id = otherplayer.id;
        socket.emit('interact_response',response);
      }
    );

    keys.addKeyOnce(
      keys.back,
      function() {
        response.res = false;
        explorationMode.removeText(textBox);
        game.paused = false;
        response.id = otherplayer.id;
        socket.emit('interact_response',response);
      }
    );
  }
});

socket.on('enter_battle',function(obj){
  console.log(obj);

  //call initEnemy in combat.js to add enemy player
  combat.trainer = obj;
  combat.initEnemy();

  //combat.initEnemy(obj);
});

socket.on('battle_player_turn',function(currentPlayer){

  //disable keybord if its not your turn
  console.log(currentPlayer +'='+yourId);

  if(currentPlayer == yourId)
  {

      game.input.keyboard.start();
      combat.myTurn = true;
      game.paused = false;
    _.delay(function(){
      combat.menu.enable();
    },2500)
  }
  else
  {
    game.input.keyboard.stop();
    combat.myTurn = false;
  }

});

socket.on('take_damage',function(obj){
  var damage = obj.damage;
  console.log(combat.menu);
  combat.menu.disable();
  combat.myTurn = false;

  console.log(combat.menu);

  var hp = player.bag.monsters[combat.monsterIndex].hp;
  player.bag.monsters[combat.monsterIndex].setHp(hp-damage);

  _.delay(function() {
      // Add a delay before show the text
      var text = combat.addText('with attack ' +obj.attack.name + " and dealing " + damage.toFixed(2) + " damage.");
    _.delay(function(){
        combat.removeText(text);
        // combat.menu.enable();
        //game.paused = false;
    },2000);
  },500);


});

socket.on('opponent_take_damage',function(damage){
  //your opponent took damage now you need to update
  var hp = combat.trainer.monster.hp;
  combat.trainer.monster.setHp(hp-damage);

});

socket.on('opponent_changed_monster_battle',function(monsterObj){
  _.delay(function(){
    combat.menu.enable();
  },2000);
  console.log('opponent changed monster');
  console.log(monsterObj);

  //set the new monster to your opponents monster
  combat.switchTrainerMonster(monsterObj);
  // combat.trainer.monster = monsterObj;
  //
  // combat.initEnemy();
});

socket.on('opponent_healed',function(amount){
  var hp = combat.trainer.monster.hp;
  combat.trainer.monster.setHp((hp+amount));
});

socket.on('other-player-left',function(){
  //if the other player left you should leave
  console.log('other player left');
    _.delay(function(){
      combat.menu.disable();
      socket.emit('leave_battle');
      game.state.start('loadNewArea',true,false,{x:player.phaser.x,y:player.phaser.y,areaId:combat.previousWorld.id},combat.previousWorld);

    },3000);
  });

socket.on('pokemon-fainted',function(){
  var lost = true;
  var m = player.bag.monsters;
  for (var i = 0; i < m.length; i++) {
    if(m[i].alive) {
      combat.playerOne.pokeballs[i].loadTexture('battle', 'pokeball.png');
      lost = false;
      break;
    } else {
      combat.playerOne.pokeballs[i].loadTexture('battle', 'pokeball_gray.png');
    }
  }

  if(!lost)
  {
    //player.bag.monsters[combat.monsterIndex].alive = false;
    combat.hideMonster(combat.monsterIndex);
    combat.reviveFirstMonster();

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
  else
  {
    //combat.menu.disable();
    _.delay(function(){
      combat.menu.disable();
      socket.emit('leave_battle');
      player.healAll();
      game.state.start('loadNewArea',true,false,{x:420,y:533,name:player.name,areaId:0},{id: 0, description: "This is the Pokecenter", areaName: "Pokecenter", imageName: "A2", monsterMaxLevel: 0, monsterMinLevel: 0,serverId:1});

    },3000);
  }
});

socket.on('opponent-pokemon-fainted',function(){
  combat.trainer.alive--;
  combat.trainer.dead++;

  for(var i = 0; i < combat.trainer.alive; i++) {
    combat.trainer.pokeballs[i].loadTexture('battle','pokeball.png');
  };

  for (var i = 0; i < combat.trainer.dead; i++) {
    combat.trainer.pokeballs[combat.trainer.alive+i].loadTexture('battle', 'pokeball_gray.png');
  };

  // Jinx this works
  if(combat.trainer.alive <= 0) {
    player.bag.items[0].amount += 500;
  }
});
