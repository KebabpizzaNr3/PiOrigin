var loadNewArea = {
  Info:null,
  //
  // init: function(userInfo, mapInfo) {
  //   uInfo = userInfo;
  //   mInfo = mapInfo;
  // },
  userInfo:null,
  areaInfo: null,
  monstersInfo: null,

  init: function(charInfo, areaI, monsters) {userInfo = charInfo; areaInfo = areaI; monstersInfo = monsters;
    },

  create: function() {
    $.ajax({
      url: "http://mordin.asuscomm.com:8000/api/area/items/"+userInfo.areaId,
      success: function(items) {
        game.input.keyboard.start();
        game.state.start('explorationMode',true,false,
        userInfo,areaInfo,monstersInfo,items);
        console.log("Start new explorationMode");
      }
    });

  }
}
