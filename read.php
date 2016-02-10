<?php
set_time_limit(1200);
if(empty($_POST)) exit();
function getData()
{
  //JSONファイル読み込み／書き込みモードで開く
  $filename = 'ranking.json';
  $handle = fopen($filename, 'r');
  //JSONフォーマットから配列に変換して読み込み
  $jsonData = fread($handle, 8192);
  // $jsonData = fread($handle, filesize($filename));
  fclose($handle);
  return $jsonData;
}

$prevData = $_POST["prev"];
do {
    $tempData = getData();
    sleep(5);
} while ($tempData == $prevData);
header('Content-type: application/json; charset=utf-8');
echo json_encode($tempData);
 ?>
