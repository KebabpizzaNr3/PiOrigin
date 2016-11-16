var bootState = {

  getCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  },

  create: function () {
      // Initalize the keyboard
      keys.defineKeys();

      var token = this.getCookie('login');

      if(!token)
      {
        token = localStorage.getItem("token");
      }

      $.ajax({
        url: "http://mordin.asuscomm.com:8000/api/user?token="+token,
        success: function(result) {
          if(result.success === false) {
              window.location.replace("login.php");
          } else {
          $.ajax({
            url: "http://mordin.asuscomm.com:8000/api/character?token="+token,
            success: function(resultC) {

              $.when(resultC,bootState.getArea(resultC.areaId), bootState.getMonsters(token)).then(bootState.startState);
            }
          });
        };
        }
      });
    },

  getArea: function(id) {
    return $.ajax({
      url: "http://mordin.asuscomm.com:8000/api/area/id/"+id
    });
  },

  getMonsters: function(token) {
  return $.ajax({
      url: "http://mordin.asuscomm.com:8000/api/character/monsters?token="+token,
    });
  },


  startState: function(charInfo, areaI, monsters) {
    var areaInfo = areaI[0][0],
            // Monsters is stored in an array
        monsterInfo = monsters[0];
    $.when(db.getItemsFromdb(), areaInfo, monsterInfo, charInfo).then(function(ajaxObj, areaInfo, monsterInfo, charInfo){
      var items = ajaxObj[0];
      game.state.start('loadState',true,true,charInfo,areaInfo,monsterInfo,items);
    });

    //game.state.start('loadState',true,true,{xPos:data.X,yPos:data.Y, areaId:data.AreaId, Image: resultA[0].ImageName, Name: resultA[0].Name});
    //game.state.start('loadState',true,true,{xPos:resultC.X,yPos:resultC.Y, areaId:resultC.AreaId, Image: resultA[0].ImageName, Name: resultA[0].Name});
  }

}
