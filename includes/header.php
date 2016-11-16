<?php
// Controll where we are.
$path_parts = pathinfo($_SERVER['PHP_SELF']);
$url = explode('/',$path_parts['dirname']);
$urlTest = end($url);

// Backtrack folders
$dir = strtolower($urlTest) == 'pages' || strtolower($urlTest) == 'game'  ? "../" : null;
$styleDir = $dir . "style/";
if(is_null($dir)) {
    array_pop($url);
    $url = end($url);
    $dir = strtolower($url) == 'members' ? "../../" : null;
    if($dir == "../../") {
      $styleDir = null;
    }
}
?>

<!-- Start of HTML  -->
<!doctype html>
<html lang='en' class='no-js'>
<head>
<meta charset='utf-8' />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?=isset($title) ? $title . ' | Pallettown' : 'Pallettown'?></title>
<?php if(file_exists($styleDir.'style.less')) : ?>
<link rel="stylesheet/less" type="text/css" href="<?=$styleDir?>style.less">
<?php else : ?>
<link rel="stylesheet/less" type="text/css" href="<?=$dir?>style/style.less">
<?php endif; ?>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="<?=$dir?>style/simple-sidebar.css">
<script src="<?=$dir?>js/less.min.js"></script>
<script src="<?=$dir?>js/modernizr.js"></script>
</head>
<body>


<?php include(__DIR__ .  '/nav.php'); ?>
