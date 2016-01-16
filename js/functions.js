// 画像ファイルのマニフェストを取得
function getImageManifest(basePath, folderName) {
  return [{
    "id": 0,
    "src": basePath + folderName + "/fire.png"
  }, {
    "id": 1,
    "src": basePath + folderName + "/water.png"
  }, {
    // どっち使ったらいいのかを決めなきゃね
    "id": 2,
    "src": basePath + folderName + "/tree.png"
  }, {
    "id": 3,
    "src": basePath + folderName + "/light.png"
  }, {
    "id": 4,
    "src": basePath + folderName + "/dark.png"
  }, {
    "id": 5,
    "src": basePath + folderName + "/cure.png"
  }, {
    "id": "bg-image",
    "src": basePath + "bg.png"
  }];
}
// 取得した画像リストのオブジェクトからドロップの画像のみを配列にして返却
function getDropImageArray(obj) {
  var array = [];
  for (var key in obj) {
    if(isFinite(key)) {
      array.push(obj[key]);
    }
  }
  return array;
}
