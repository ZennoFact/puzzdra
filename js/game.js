var canvas, // 画面にものを表示する部分。絵を描くときにキャンバスを使用するでしょ？そのキャンバス
  stage, // CreateJS独自のもの。ものを設置するのは舞台。だから舞台上に部品を置いておきます
  dropImageFolderName, // ドロップの画像が入っているフォルダの名前を指定します
  drops = [ // ドロップの配置を記憶しておく二次元配列5*6
    [],
    [],
    [],
    [],
    [],
  ],
  ROW = 5,
  COL = 6,
  DROP_SIZE = 105,
  WIDTH, // パズル画面の幅
  HEIGHT, // パズル画面の高さ
  dropImages = [],
  mouseEventOn,
  isOperable; // ドロップを操作可能かどうか

// プログラム内で読み込む画像データなどをここで手元に置いておくことにします。「あらかじめ」やることをまとめるよ命令です
function preload(folderName) {
  var queue = new createjs.LoadQueue(false);
  queue.setMaxConnections(2);

  var basePath = "./assets/drop_image/";
  // どの画像をどんな名前で管理するかを決定するよ。「id」は「識別子」，誰ともかぶることのない，独自の番号（名前）。「src」は「source（源）」の略
  var manifest = [{
    "id": "fire",
    "src": basePath + folderName + "/fire.png"
  }, {
    "id": "water",
    "src": basePath + folderName + "/water.png"
  }, {
    // どっち使ったらいいのかを決めなきゃね
    "id": "tree",
    "src": basePath + folderName + "/tree.png"
  }, {
    "id": "light",
    "src": basePath + folderName + "/light.png"
  }, {
    "id": "dark",
    "src": basePath + folderName + "/dark.png"
  }, {
    "id": "cure",
    "src": basePath + folderName + "/cure.png"
  }];
  // 指定したリスト（マニフェスト）に従って画像を読み込むよー
  queue.loadManifest(manifest, false);
  queue.load();
  // 読み込みが完了したら「handleComplete」って命令を起動するよ
  queue.addEventListener("complete", handleComplete);

}

// 読み込みが完了したよ，万歳。取得した情報は「event」という名前で取得することにします
function handleComplete(event) {
  // 読み込み完了に伴い，その結果を保存します
  var result = event.target._loadedResults;
  // 決めてあった箱に画像データを入れていくよ。
  // プログラムで「=」は，左辺のものに右辺のものを入れます意味です。イコールじゃないから要注意
  dropImages[0] = result["fire"];
  dropImages[1] = result["water"];
  dropImages[2] = result["tree"];
  dropImages[3] = result["light"];
  dropImages[4] = result["dark"];
  dropImages[5] = result["cure"];

  // よし，事前情報は集まった。いざ，このプログラムの初期化を初期化するよ
  init();
}

// 初期化（initialize）するための命令です。必要な情報を箱に詰め込んでいきます
function init() {
  canvas = $("#canvas")[0];
  WIDTH = COL * DROP_SIZE;
  HEIGHT = ROW * DROP_SIZE;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // さあ，いよいよ僕らの舞台を作成するよ。「canvas」を使って舞台を作って保存！
  stage = new createjs.Stage(canvas);

  stage.enableDOMEvents(true);
  // 今回の「舞台」を「タッチ（クリック）」「可能」にします
  createjs.Touch.enable(stage);
  // ステージの外でもマウスムーブを取得するよ
  stage.mouseMoveOutside = true;

  // ドロップの生成をします
  initDrops();

  // ドロップの準備ができたので，描画を開始
  render();
}

function initDrops() {
  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      // var type = Math.floor(Math.random() * 6);
      var type = combo10[i][j];
      var drop = new Drop(dropImages[type], i, j, type, DROP_SIZE);

      // ドラッグ可能にするための処理
      if (mouseEventOn) {
        drop.addEventListener("mousedown", startDrag);
      }

      // 舞台に画面を「備品として追加」するよ
      drops[i][j] = drop;
      stage.addChild(drops[i][j]);
    }
  }
}

// 描画
function render() {
  // CreateJSの更新
  stage.update();
  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame(render);
}

var cueDrop;
// ドラッグアンドドロップ関係の処理
function startDrag(event) {
  var instance = event.target;
  instance.alpha = 0.5;
  instance.addEventListener("pressmove", drag);
  instance.addEventListener("pressup", stopDrag);
  cueDrop = new Drop(instance.image, instance.row, instance.col, instance.type, DROP_SIZE)
    // サイズの拡大
  cueDrop.scaleX = cueDrop.scaleY = 1.1;
  cueDrop.x = event.stageX - cueDrop.size / 2;
  cueDrop.y = event.stageY - cueDrop.size / 2;
  cueDrop.alpha = 0.7;
  stage.addChild(cueDrop);
}

function drag(event) {
  var instance = event.target;
  var x = event.stageX;
  var y = event.stageY;

  if (instance.exchengeCheck(x, y)) {
    var newRow = instance.getExchengeRow(y);
    var newCol = instance.getExchengeCol(x);
    // console.log("[new]" + newRow + ":" + newCol);
    // console.log("[old]" + instance.row + ":" + instance.col);
    // ドロップの入れ替え作業
    // TODO: Uncaught TypeError: Cannot read property '2' of undefined 2回目のドロップ移動にて発生
    stage.addChildAt(drops[instance.row][instance.col], 30);
    stage.addChildAt(drops[newRow][newCol], 30);
    drops[instance.row][instance.col] = instance.exchenge(drops[newRow][newCol], instance.row, instance.col);

    instance.row = newRow;
    instance.col = newCol;
  }

  cueDrop.move(x, y);
  drops[instance.row][instance.col] = instance;

  // ステージ外のマウスポインタの座標の取得は，rawXとrawYで取得します
  if (event.rawX < 0 || canvas.width < event.rawX || event.rawY < 0 || canvas.height < event.rawY) endDrag(instance);
}

function stopDrag(event) {
  var instance = event.target;
  endDrag(instance);
}

// TODO: 操作時間の設定
// TODO: 高速に動かしすぎると，画面買いに出たときにアニメーションがついていかない。
var comboDrops,
  deleteDropCount = 0;
function endDrag(drop) {
  drop.removeEventListener("pressmove", drag);
  drop.removeEventListener("pressup", stopDrag);
  // ドラッグを解除すると，ドロップが既定の位置に並ぶように
  var col = drop.col;
  var row = drop.row;
  if (5 < col) col = 5;
  if (4 < row) row = 4;
  drop.x = col * drop.size;
  drop.y = row * drop.size;
  drop.alpha = 1.0;
  stage.removeChild(cueDrop);


  // TODO: 以下の処理をコンボが途切れるまで継続。この間，ドラッグ操作無効化

  // コンボ情報を返す処理
  comboDrops = [ // ドロップの配置を記憶しておく二次元配列5*6　
    [9, 9, 9, 9, 9, 9], // ここには，{comboCount, dropType}の配列を仕込めればコンボの処理は簡単になるのでは？
    [9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9],
  ];
  // while (comboData = comboCheck(comboDrops, drops)) {
  comboData = comboCheck(comboDrops, drops);
  // コンボ情報をもとにドロップを消去
  // 一旦，コンボを考えずに頑張る
  comboAction();

  // }
  console.log("end of 1 step");
}

function comboAction() {
  // TODO: コンボの実際の処理　今はコンボを考えずに，一気に消す
  for (var i = comboData.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboData[0].length; j++) {
      if (comboData[i][j] !== 9) {
        deleteDropCount++;
      }
    }
  }
  // ドロップ削除のアニメーション
  var timeline = new createjs.Timeline();
  // TODO: assEventlistenerで追加できるイベントは？
  // timeline.addEventListener('complete', deleteDrop)
  for (var i = comboData.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboData[0].length; j++) {
      if (comboData[i][j] !== 9) {
        timeline.addTween(createjs.Tween.get(drops[i][j], {
            loop: false
          })
          .to({
            alpha: 0.0
          }, 300)
          // TODO: ここ，タイムライン全体の完了を取得したい
          .call(deleteDrop));
      }
    }
  }
  timeline.addLabel("start", 0);
  timeline.gotoAndPlay("start");
}

function deleteDrop() {
  // タイムライン完了時のみ削除作業を開始
  deleteDropCount--;
  if (deleteDropCount === 0) {
    for (var i = 0; i < comboData.length; i++) {
      for (var j = 0; j < comboData[0].length; j++) {
        if (comboData[i][j] !== 9) {
          stage.removeChild(drops[i][j]);
          drops[i][j] = null;
        }
      }
    }
    console.log("Drop deleted");
    fallDrops();
  }
}

function fallDrops() {
  console.log("start drops fall");
console.log(drops);
  // TODO: コンボ後のドロップ落下処理
  var timeline = new createjs.Timeline();
  for (var i = comboData.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboData[0].length; j++) {
      var fallDrop;
      if (drops[i][j] === null) {
        var existFallDrop = existUpperDrop(drops, i - 1, j);
        if (existFallDrop) {
          drops[i][j] = drops[existFallDrop.i][j];
          drops[existFallDrop.i][j] = null;
          drops[i][j].row = i;
        } else {
          var type = Math.floor(Math.random() * 6);
          var drop = new Drop(dropImages[type], i, j, type, DROP_SIZE);
          drop.y -= HEIGHT;
          // ドラッグ可能にするための処理
          if (mouseEventOn) {
            drop.addEventListener("mousedown", startDrag);
          }
          drops[i][j] = drop;
          stage.addChild(drops[i][j]);
        }

        timeline.addTween(createjs.Tween.get(drops[i][j], {
            loop: false
          })
          .to({
            y: drops[i][j].row * drops[i][j].size
          }, 250));
      }
    }
  }
  timeline.addLabel("start", 0);
  timeline.gotoAndPlay("start");
}

function existUpperDrop(drops, i, j) {
  if (i < 0) {
    return false;
  } else if (drops[i][j] === null) {
    return existUpperDrop(drops, i - 1, j);
  } else {
    return {
      i: i
    };
  }
}
