
var loadState = {

  userInfoLoad:null,
  userInfo:null,
  areaInfo: null,
  monstersInfo: null,
  userItems: null,

  // init: function(user) { userInfoLoad = user; console.log(userInfoLoad); },

  init: function(charInfo, areaI, monsters, items) {userInfo = charInfo; areaInfo = areaI; monstersInfo = monsters; userItems= items;
    player.bag.items = userItems;
    },

  preload: function(){

    // Tilemaps
    game.load.tilemap('area52', 'assets/tilemaps/A1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Home', 'assets/tilemaps/Home.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Pokecenter', 'assets/tilemaps/Pokecenter.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Btown', 'assets/tilemaps/Btown.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Killerzone', 'assets/tilemaps/Killerzone.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Killerzonecave1', 'assets/tilemaps/Killerzonecave1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Killerzonecave2', 'assets/tilemaps/Killerzonecave2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Firstdecision', 'assets/tilemaps/Firstdecision.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Market', 'assets/tilemaps/Market.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Marketb', 'assets/tilemaps/Market.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Pokecenterb', 'assets/tilemaps/Pokecenter.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Cribmb', 'assets/tilemaps/Crib.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Cribma', 'assets/tilemaps/Crib.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Cribmd', 'assets/tilemaps/Crib.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Cribe', 'assets/tilemaps/Crib.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Cribt', 'assets/tilemaps/Crib.json', null, Phaser.Tilemap.TILED_JSON);


    // sound

    game.load.audio('background', ['assets/sound/Background.mp3', 'assets/sound/Background.ogg']);
    game.load.audio('combat', ['assets/sound/Combat.mp3', 'assets/sound/Combat.ogg']);



    // Spritesheets & images
    game.load.spritesheet('loadinggif', 'assets/img/loadingpng.png', 500,400);
    game.load.spritesheet('ash', 'assets/img/tobbeTest.png', 28,37);
    game.load.image('A1', 'assets/img/world.png');
    game.load.image('A2', 'assets/img/indoor.png');
    game.load.image('top', 'assets/img/top.png');

    // Atlases
    game.load.atlasJSONHash('hpbars', 'assets/atlas/hpbars.png', 'assets/atlas/hpbars.json');
    game.load.atlasJSONHash('pokemon_f', 'assets/atlas/pokemon_front.png', 'assets/atlas/pokemon_front.json');
    game.load.atlasJSONHash('pokemon_b', 'assets/atlas/pokemon_back.png', 'assets/atlas/pokemon_back.json');
    game.load.atlasJSONHash('battle', 'assets/atlas/battle.png', 'assets/atlas/battle.json');

    //Assets for pausemenu
    game.load.image('mi', 'assets/img/pmitem.png');
    game.load.image('arrow', 'assets/img/arrow.png');

  },

  create: function() {
    game.stage.backgroundColor = '#FFF';
    var loading = game.add.sprite(200, 200, 'loadinggif');
    loading.animations.add('load',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 15);
    loading.animations.play('load');
    loading.animations.currentAnim.onComplete.add(function () {
      	game.state.start('loadNewArea',true,false,
        userInfo,areaInfo,monstersInfo);
        }, this);

  }
}
