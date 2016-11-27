var db = {


  getItemsFromdb: function(){
    var token = bootState.getCookie('login');

    if(!token)
    {
      token = localStorage.getItem("token");
    }

    return $.ajax({
      url: "http://37.123.188.101:8000/api/character/items?token="+token
    });
  },

  addMonster: function(monster,slot){
    monster.slot = slot;
    monster.attacks[0] = monster.attacks[0] || {id:7};
    monster.attacks[1] = monster.attacks[1] || monster.attacks[0];
    monster.attacks[2] = monster.attacks[2] || monster.attacks[0];
    monster.attacks[3] = monster.attacks[3] || monster.attacks[0];
    var m = monster;
    console.log(monster,slot);
    var token = bootState.getCookie('login');

    if(!token)
    {
      token = localStorage.getItem("token");
    }
        $.ajax({
          url: "http://37.123.188.101:8000/api/CharactersMonster/addMonster?token="+token,
          method: 'POST',
          success: function(result) {
            m.id = result.id;
            if(player.db.monsters.indexOf(m) >= 0){
              console.log('Updated Id');
              player.db.monsters[player.db.monsters.indexOf(m)].id = m.id;
            }
            console.log(result);
          },
          data: {id: m.id, attack1: m.attacks[0].id, attack2: m.attacks[1].id, attack3: m.attacks[2].id, attack4: m.attacks[3].id, level: m.level, speed: m.speed, damage:m.damage, slot: m.slot, maxMana: m.maxMana, maxHp: m.maxHp, hp: m.hp, mana:m.mana,defense: m.defense}
        });
      },

  updateCharacterXY: function(newX, newY, newArea) {
    var token = bootState.getCookie('login');

    if(!token)
    {
      token = localStorage.getItem("token");
    }
        $.ajax({
          url: "http://37.123.188.101:8000/api/character/setPosition?token="+token,
          method: 'POST',
          success: function(result) {
            console.log(result);
          },
          data: {area: newArea,x: newX ,y: newY }
        });

  },

  updateItemAmounts: function(){
    var token = bootState.getCookie('login');

    if(!token)
    {
      token = localStorage.getItem("token");
    }
        $.ajax({
          url: "http://37.123.188.101:8000/api/character/itemAmounts?token="+token,
          method: 'POST',
          success: function(result) {
            console.log(result);
          },
          data: {i1:player.bag.items[0].amount , i2: player.bag.items[1].amount, i3: player.bag.items[2].amount, i4: player.bag.items[3].amount}
        });


  },

  updateMonster: function(monsterO, slot){
    var token = bootState.getCookie('login');
    var slotId = slot?0:player.bag.monsters.indexOf(monsterO)+1;
    console.log('slot id', slotId);


    if(!token)
    {
      token = localStorage.getItem("token");
    }

    $.when(monsterO,slot,
      $.ajax({
      url: "http://37.123.188.101:8000/api/monster/name/"+monsterO.name,
      })
    ).then(
      function(monsterO,slot,m){
        console.log(m);
        $.ajax({
          url: "http://37.123.188.101:8000/api/character/updateMonster?token="+token,
          method: 'POST',
          data: {monsterId: m[0][0].id,  attack1: monsterO.attacks[0].id, attack2: monsterO.attacks[1].id, attack3: monsterO.attacks[2].id, attack4: monsterO.attacks[3].id, speed: monsterO.speed, level: monsterO.level, hp: monsterO.hp, mana: monsterO.mana, attack: monsterO.damage, defense:monsterO.defense, maxMana: monsterO.maxMana, maxHp: monsterO.maxHp, xp: monsterO.xp, id: monsterO.id, slot: slotId}
        });
      }
    )
  },

  save: function(){
    var self = this;
    this.updateCharacterXY(player.phaser.body.position.x,player.phaser.body.position.y,explorationMode.worldInfo.id);
    this.updateItemAmounts();
    player.bag.monsters.forEach(function(monster,index){
      self.updateMonster(monster);
    });
  },
}
