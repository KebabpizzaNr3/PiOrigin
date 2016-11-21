
<nav id="sidebar-wrapper">
  <ul class="sidebar-nav">
    <a id="menu-close" href="#" class="btn btn-light btn-lg pull-right toggle"><i class="fa fa-times"></i></a>
    <li class='sidebar-brand'> <a href='#'>Menu</a></li>
    <li><a href="<?=$dir?>game/index.php"><i class="fa fa-gamepad fa-fw"></i>&nbsp; Play the pokémon game</a></li>
    <li><a href="<?=$dir?>pages/About.php"><i class='fa fa-info fa-fw'></i>&nbsp; About</a></li>
    <span class="divider"></span>
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
