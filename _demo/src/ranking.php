<?php
header("access-control-allow-origin: *");
if (isset($_GET['show_php'])) { die(highlight_file(__FILE__,1)); } 
$json = $_GET['q'];
$old_json = file_get_contents('ranking.json');
$myfile = fopen("ranking.json", "w");

$a1 = json_decode($json,true);
$a2 = json_decode($old_json,true);

$res = array_merge_recursive($a1,$a2);
$resJson = json_encode($res);
echo $resJson;
fwrite($myfile, $resJson);
fclose($myfile);
?>