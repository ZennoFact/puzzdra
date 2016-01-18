$(document).on('contextmenu', function(e) {
  return false;
});

var sounds = [];
var queue = new createjs.LoadQueue(true);
queue.installPlugin(createjs.Sound);

//読み込むファイルを記述（複数可能）
var manifest = [{
  id: "mm1",
  src: "./assets/sounds/mousemove1.mp3"
}, {
  id: "mm2",
  src: "./assets/sounds/mousemove2.mp3"
}, {
  id: "dd1",
  src: "./assets/sounds/dropdelete1.mp3"
}, {
  id: "dd2",
  src: "./assets/sounds/dropdelete2.mp3"
}, {
  id: "fi1",
  src: "./assets/sounds/finish1.mp3"
}];
queue.loadManifest(manifest, true);

//manifestで指定したファイルが１つ読み込まれるごとに実行される
queue.addEventListener('fileload', handleFileLoad);

function handleFileLoad(event) {
  sounds.push(createjs.Sound.createInstance(event.item.id));
}
