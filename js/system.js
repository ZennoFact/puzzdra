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
// ドロップの配置を記憶しておく二次元配列5*6　
var DEFAULT_COMBO_DROPS = [
  [{
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }],
  [{
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }],
  [{
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }],
  [{
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }],
  [{
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }, {
    combo: 0,
    type: 9
  }]
];

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

// 正解一覧
var answers = [
    'preload(folder);',
    'drag=true;',
    'canDelete();',
    'gravity();',
    'isLoop=true;',
    'saveData();',
    'loadData();',
    'update.php'
];

function inputCheck(i, text) {
  if (6 < i && answers[i - 7] === text.replace(/\s+/g, "")) {
    return true;
  }
  return false;
}

function isNumber(str) {
  if (str.match(/[^0-9]/g)) {
    return false;
  }
  return true;
}
function setDragEventAllDrops(drops) {
  drops.forEach(function(array) {
    array.forEach(function(drop) {
      setDragEventForDrop(drop);
    });
  });
}
function removeDragEventAllDrops(drops) {
  drops.forEach(function(array) {
    array.forEach(function(drop) {
      drop.removeEventListener("mousedown", startDrag);
    });
  });
}

// 授業として成立させるための処理たち
function stageClear() {
  if (stage) {
    stage.removeAllChildren();
  }
}
function setDragEventForDrop(drop) {
  // ドラッグ可能にするための処理
  drop.addEventListener("mousedown", startDrag);
}
function canDelete() {
  dropDeletable = true;
}
function gravity() {
  hasGravity = true;
}

//  エディタ関連の処理
function changeTab(tabName, btnName) {
   // 全部消す
   document.getElementById('tab1').style.display = 'none';
   document.getElementById('tab2').style.display = 'none';
   document.getElementById('tab3').style.display = 'none';
   document.getElementById('tabBtn1').style.backgroundColor = '#646464';
   document.getElementById('tabBtn2').style.backgroundColor = '#646464';
   document.getElementById('tabBtn3').style.backgroundColor = '#646464';
   // 指定箇所のみ表示
   document.getElementById(tabName).style.display = 'block';
   document.getElementById(btnName).style.backgroundColor = '#464646';
}

function saveData() {
  var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
  gameData.forEach(function(elem, i) {
    localStorage.setItem(i.toString(), elem.value);
  });
}

function loadData() {
  var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
  gameData.forEach(function(elem, i) {
    elem.value = localStorage.getItem(i.toString());
  });
}

function postScore(userName, score, combo) {
  if ( document.getElementsByTagName('input')[14].value !== 'update.php') return false;
  $.ajax({
    type: 'POST',
    url: 'http://www.kcg.ac.jp/mogi/pd/update.php',
    //url: './update.php',
    data: {
      name: userName,
      score: score,
      combo: combo
    }
  }).then(
      function(data) {
        console.log("post success");
      },
      function(data) {
        console.log("error");
        console.log(data);
      }
  );
}
