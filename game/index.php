<?php
// Controll where we are.
$path_parts = pathinfo($_SERVER['PHP_SELF']);
$dir = '../';
$idir = null;
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet/less" type="text/css" href="../style/style.less">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../style/simple-sidebar.css">
    <style media="screen">
      canvas {
        display: block;
        margin: 0 auto;
      }
    </style>

    <!-- libs -->
    <script src="<?=$idir?>js/libs/jquery-1.12.3.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.js"></script>
    <script src="https://cdn.jsdelivr.net/lodash/4.11.2/lodash.min.js"></script>
    <script src="<?=$dir?>js/less.min.js"></script>
    <script src="<?=$dir?>js/modernizr.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/log4javascript/1.4.9/log4javascript.js"></script>

    <!-- log4javascript-->
    <script type="text/javascript">
    	var log = log4javascript.getDefaultLogger();
    </script>


    <!-- Phaser  -->
    <script src="<?=$idir?>js/libs/phaser.min.js" type="text/javascript"></script>

    <!-- States  -->
    <script src="<?=$idir?>js/states/boot.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/states/load.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/states/loadNewArea.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/states/game.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/states/combat.js" type="text/javascript"></script>

    <!-- Objects  -->
    <script src="<?=$idir?>js/objects/bars.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/keys.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/monsters.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/player.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/menu.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/menu2.js" type="text/javascript"></script>
    <script src="<?=$idir?>js/objects/db.js" type="text/javascript"></script>

    <!-- Server -->
    <script src="<?=$idir?>js/server/client-to-server.js" type="text/javascript"></script>

    <!-- The statehandler -->
    <script src="<?=$idir?>js/states/statehandler.js" type="text/javascript"></script>

    <title>Pokemon</title>
  </head>
  <body>
    <?php $path=__DIR__;include(__DIR__ .  '../../includes/nav.php'); ?>
    <?php $path=__DIR__; include(__DIR__ . '../../includes/footer.php'); ?>
