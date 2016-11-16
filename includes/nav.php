<?php

// Get all members and include them in the navbar.
$members = scandir($dir . "members");
unset($members[0]);
unset($members[1]);
$team = array_values($members);

?>

<nav id="sidebar-wrapper">
  <ul class="sidebar-nav">
    <a id="menu-close" href="#" class="btn btn-light btn-lg pull-right toggle"><i class="fa fa-times"></i></a>
    <li class='sidebar-brand'> <a href='#'>The pokémon remake</a></li>
    <li><a href="<?=$dir?>index.php"><i class="fa fa-gamepad fa-fw"></i>&nbsp; Play</a></li>
        <li><a href="#d1" data-toggle="collapse" data-parent="#MainMenu"><i class="fa fa-code fa-fw"></i>&nbsp; Developer Team</a> </li>
    <div class="collapse" id="d1">
      <?php
          $html = null;
          foreach ($team as $key) {
              if(is_dir($dir . "members" . '/' . $key)) {
                  $html .= "<li class='subItem'><a href='".$dir."members/".$key."' >".ucfirst($key)."</a></li>";
              }
          }
       ?>
       <?=$html?>
    </div>
    <li><a href="<?=$dir?>pages/gamedocument.php"><i class='fa fa-info fa-fw'></i>&nbsp; About</a></li>
    <li><a href="#"><i class='fa fa-male fa-fw'></i>&nbsp; Characters</a></li>
    <li><a href="#"><i class='fa fa-bug fa-fw'></i>&nbsp; Minions</a></li>
    <span class="divider"></span>
    <li><a href="https://trello.com/b/7YYoVdjr/spelprojekt"><i class="fa fa-trello fa-fw"></i>&nbsp; Trello</a></li>
  </ul>
</nav>


<div class="container colHeight">
  <div class="row">
    <div class="col-sm-5">
      <a id="menu-toggle" href="#" class="menu-Button toggle"><i class="fa fa-bars"></i></a>
    </div>
    <div class="col-sm-7">
      <span class="brand"><?=isset($title) ? $title : 'Pokemon'?></span>
    </div>
  </div>
</div>
