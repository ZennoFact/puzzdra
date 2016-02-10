<?php
if(empty($_POST)) exit();
$data = array(
  "name" => $_POST["name"],
  "score" => $_POST["score"],
  "combo" => $_POST["combo"]
);

$ranking = array();
//JSONファイル読み込み／書き込みモードで開く
$filename = 'ranking.json';
$handle = fopen($filename, 'r');
//JSONフォーマットから配列に変換して読み込み
$jsonData = json_decode(fread($handle, filesize($filename)));
fclose($handle);
//連想配列にキャスト
foreach ($jsonData as $value) {
  $ranking[] = (array)$value;
}
$recode = match_array($ranking, $data);
$handle = fopen($filename, 'w+');
fwrite($handle,json_encode($recode));
fclose($handle);
return true;

function match_array($array, $new_array) {
    $i = 0;
    foreach($array as $value){
        if($value['name'] == $new_array['name']) $point = $i;
        $i++;
    }
    if(isset($point)) {
        //名前がマッチするものがあれば、そのポインタの配列を新しい配列に差し替え
        if($array[$point]["score"] < $new_array["score"]) {
          $array[$point] = $new_array;
        }
    } else {
        //名前がマッチするものがなければ、末尾に追加
        $array[] = $new_array;
    }
    return $array;
}
 ?>
