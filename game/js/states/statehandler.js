var game = new Phaser.Game(14*64, 10*64, Phaser.AUTO, 'phaser-example');



game.state.add('bootState', bootState);
game.state.add('explorationMode', explorationMode);
game.state.add('loadState', loadState);
game.state.add('loadNewArea', loadNewArea);
game.state.add('combat', combat);
//game.state.add('BattleMode', BattleMode);


// var mon = new monster('Pikachu', 80, 80, 100, 100, 10, 0, 0, 4, att);
// var mon2 = new monster('Squirtle', 80, 80, 100, 100, 10, 0, 0, 4, att);
// var att = [];
game.state.start('bootState', true, false);//, mon, mon2
