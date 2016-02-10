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

var inputs = Array.prototype.slice.call(document.getElementsByClassName('input'));
inputs.forEach(function(elem) {
  elem.addEventListener('dblclick', showTextField, false);
});

function showTextField(e) {
  var item = e.target;
  item.classList.add('none');
  var input = document.createElement('input');
  input.setAttribute("type", "text");
  var regex = /Step\.\d/;
  if (regex.test(item.innerHTML)) {　　
    input.value = "";
  } else {　　
    input.value = item.innerHTML;
  }
  var parent = item.parentNode;
  input.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && input.value !== "") {
      // TODO: バリデーションチェックする
      // var classes = item.getAttribute("class").split();
      // console.log(classes);
      // if (classes[0] === "setting" && !isNumber(input.value)) {
      //   return;
      // }
      parent.firstChild.innerHTML = input.value;
      parent.firstChild.classList.remove("none")
      parent.removeChild(e.target);
      inputs.forEach(function(elem) {
        // elem.addEventListener('mouseover', showTextField, false);
        elem.addEventListener('dblclick', showTextField, false);
      });
      inputStringCheck();
    }
  });
  parent.appendChild(input);
  input.focus();
  inputs.filter(function(elem) {
    return elem !== item;
  }).forEach(function(elem) {
    elem.removeEventListener('dblclick', showTextField, false);
  });
}

function inputStringCheck() {
  document.getElementById('step1').classList.remove('ok');
  document.getElementById('step2').classList.remove('ok');
  document.getElementById('step3').classList.remove('ok');
  document.getElementById('step4').classList.remove('ok');
  document.getElementById('step5').classList.remove('ok');
  if (document.getElementById('step1').innerHTML.replace(/\s+/g, "") === 'preload(folder);') {
    document.getElementById('step1').classList.add('ok');
  } else if (document.getElementById('step1').innerHTML === "Step.1") {
    document.getElementById('step1').innerHTML = "Step.1";
    document.getElementById('step1').classList.remove('ok');
  }
  if (document.getElementById('step2').innerHTML.replace(/\s+/g, "") === 'drag=true;') {
    document.getElementById('step2').classList.add('ok');
  } else if (document.getElementById('step2').innerHTML === "Step.2") {
    document.getElementById('step2').innerHTML = "Step.2";
    document.getElementById('step2').classList.remove('ok');
  }
  if (document.getElementById('step3').innerHTML.replace(/\s+/g, "") === 'canDelete();') {
    document.getElementById('step3').classList.add('ok');
  } else if (document.getElementById('step3').innerHTML === "Step.3") {
    document.getElementById('step3').innerHTML = "Step.3";
    document.getElementById('step3').classList.remove('ok');
  }
  if (document.getElementById('step4').innerHTML.replace(/\s+/g, "") === 'gravity();') {
    document.getElementById('step4').classList.add('ok');
  } else if (document.getElementById('step4').innerHTML === "Step.4") {
    document.getElementById('step4').innerHTML = "Step.4";
    document.getElementById('step4').classList.remove('ok');
  }
  if (document.getElementById('step5').innerHTML.replace(/\s+/g, "") === 'isLoop=true;') {
    document.getElementById('step5').classList.add('ok');
  } else if (document.getElementById('step5').innerHTML === "Step.5") {
    document.getElementById('step5').innerHTML = "Step.5";
    document.getElementById('step5').classList.remove('ok');
  }
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

function postScore(userName, score, combo) {
  $.ajax({
    type: 'POST',
    url: "./update.php",
    data: {
      name: userName,
      score: score,
      combo: combo
    },
    success: function () {
        console.log("post success");
    },
    error: function (data) {
        console.log("error");
        console.log(data);
    }
  });
}
