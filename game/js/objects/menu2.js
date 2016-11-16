var menu2 = function(xPos, yPos, vertical){
    var menus = [];
    var level = 0;
    var sel = [];
    var arrow = {};
    this.lock = 0;

    this.enable = function(){
        this.arrow.visible = true;
        console.log('enable');
        this.showMenu(level);
        lock = 0;
    };

    this.disable = function () {
        console.log(level);
        console.log('disable');
        this.arrow.visible = false;
        this.hideMenu(level);
        lock = 1;
    };

    this.start = function(){
        this.prep();
        this.enable();
        this.showMenu(0);
    };

    this.prep = function () {
        this.arrow = game.add.sprite(xPos + menus[0][0].x - 20, yPos, 'arrow');
        this.arrow.scale.setTo(0.50);
        this.arrow.visible = false;
    }
    //for debugging purposes
    this.get = function(){
        return menus;
    };


    function menuItem(text, x, lvl, parentLevel, func, extra){

        var e = extra || {show:false};
        this.text = text;
        this.func = func;
        this.parent = parentLevel;


        if(vertical){
            this.x = xPos;
            this.y = yPos + menus[lvl].length * 40;
        }
        else{
            this.x = xPos + x;
            this.y = yPos;
        }
        this.label = game.add.text((game.camera.x + xPos + this.x), (game.camera.y + yPos + this.y, text), {font: 'bold 16px Arial', fill: '#fff'});
        this.label.visible = false;

        if(e.show){
            e.text = game.add.text((game.camera.x + xPos + this.x), (game.camera.y + this.y + 20), e.text, {font: 'bold 9px Arial', fill: '#fff'});
            e.text.visible = false;
            this.e = e;
        }
    };


    this.addMenuItem = function(text, x, level, parentLevel, func, extra){
        if(menus[level] == undefined){
            for (var i = 0; i < level + 1; i++) {
                if(menus[i] == undefined){
                    sel.push(0);
                    menus.push([]);
                }
            }
        }

        var item = new menuItem(text, x, level, parentLevel, func, extra, parentLevel);
        menus[level].push(item);
    };

    this.showMenu = function(lvl){
        this.hideMenu(level);
        level = lvl;
        for (var i = 0; i < menus[level].length; i++) {
            var element = menus[level][i];
            if(vertical){
                element.background = game.add.graphics();
                element.background.beginFill(0x0000000, 1.0);
                element.background.drawRect(game.camera.x + element.x - 30, game.camera.y + element.y - 10, (this.getLengthOfMenu() * 10) + 40, 50);
            }

            element.label = game.add.text((game.camera.x + element.x), (game.camera.y + element.y), element.text, {font: 'bold 16px Arial', fill: '#fff'});
            element.label.visible = true;

            if(element.e){
              if(element.e.items){
                element.e.text.setText('Amount: ' + player.bag.items[element.e.myIndex].amount);
                element.e.text.visible = true;
              }
              else{
                element.e.text.setText('HP: ' + player.bag.monsters[element.e.myIndex].hp.toFixed(2) + '/' + player.bag.monsters[element.e.myIndex].maxHp.toFixed(2));
                element.e.text.visible = true;
              }
            }
        }
        this.setArrow();
    };

    this.hideMenu = function(level){
      for (var i = 0; i < menus[level].length; i++) {
          var element = menus[level][i];
          element.label.visible = false;

          if(vertical && element.background != undefined)
            element.background.kill();

          if(element.e){
              element.e.text.kill();
          }
      }
    };

    this.setArrow = function(){
        if(sel[level] < 0){
            sel[level] = menus[level].length - 1;
        }
        this.arrow.x = game.camera.x + menus[level][sel[level]].x - 20;
        this.arrow.y = game.camera.y + menus[level][sel[level]].y;
        this.arrow.visible = true;
        this.arrow.bringToTop();
    };

    this.arrowMinus = function(){
        if(lock == 0){
            sel[level] = (sel[level] - 1) % menus[level].length;
            this.setArrow();
        }
    };

    this.arrowPlus = function(){
        if(lock == 0){
            sel[level] = (sel[level] + 1) % menus[level].length;
            this.setArrow();
        }
    };

    this.executeSelected = function(){
        if(lock == 0){
            menus[level][sel[level]].func();
        }
    };

    this.goToParent = function(){
        if(menus[menus[level][sel[level]].parent] == undefined){
            this.showMenu(0);
            console.log('err: ' + menus[level][sel[level]].parent);
        }
        else{
            this.showMenu(menus[level][sel[level]].parent);
        }
    };

    this.clearLevel = function (lvl) {
        if(menus.length> 0 && menus[lvl] != undefined && menus[lvl].length > 0){
            if(level == lvl){
                this.showMenu(menus[lvl][0].parent);
            }
            sel[lvl] = 0;
            while(menus[lvl].length > 0){
                menus[lvl].splice(0, 1);
            }
        }
    };

    this.getSelectedIndex = function(){
        return [level, sel[level]];
    };

    this.moveItem = function (lvl, fr, to){
        var tmp = menus[lvl][to];
        menus[lvl][to] = menus[lvl][fr];
        menus[lvl][fr] = tmp;
    };

    this.getLengthOfMenu = function(){
        var tmp = 0;

        for (var i = 0; i < menus[level].length; i++) {
            var e = menus[level][i];
            if(e.text.length > tmp){
                tmp = e.text.length;
            }
        }
        return tmp;
    };
};
