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
  bgImage,
  mouseEventOn = false,
  dropIsDelete = false,
  dropIsFallen = false,
  isLoop = false,
  timerStart = false,
  timeLimmit = -1,
  operateTime,
  deleteTime,
  fallTime,
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
  }, {
    "id": "bg-image",
    "src": basePath + "bg.png"
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
  bgImage = result["bg-image"];

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
  var bg = new createjs.Bitmap(bgImage);
  stage.addChild(bg);

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
      var type = Math.floor(Math.random() * 6);
      // var type = combo10[i][j];
      var drop = new Drop(dropImages[type], i, j, type, DROP_SIZE);

      // ドラッグ可能にするための処理
      if (mouseEventOn) {
        setDragEventForDrop(drop);
        // drop.addEventListener("mousedown", startDrag);
      }

      // 舞台に画面を「備品として追加」するよ
      drops[i][j] = drop;
      stage.addChild(drops[i][j]);
    }
  }
}

// 描画
function render() {
  if (timerStart) {
    timeLimmit--;
    // TODO: このやり方は違うらしい
    // limmitBar.setTransform(limmitBar.x, limmitBar.y, 96 * timeLimmit / operateTime, 96);
    // limmitBar.setTransform(0, 0, temp, 96);
  }
  // CreateJSの更新
  stage.update();
  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame(render);
}

var cueDrop,
  timeBar,
  limmitBar;
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

  // 時間関係の処理
  timeBar = new createjs.Shape();
  timeBar.graphics.beginFill("#ffffff").drawRect(0, 0, 100, 30);
  timeBar.set({
    x: event.stageX,
    y: event.stageY - 30
  });
  limmitBar = new createjs.Shape();
  limmitBar.graphics.beginFill("#0099dd").drawRect(0, 0, 96, 26);
  limmitBar.cache(0, 0, 96, 26);
  limmitBar.set({
    x: event.stageX + 2,
    y: event.stageY - 28
  });
  stage.addChild(timeBar);
  stage.addChild(limmitBar);
}

function drag(event) {
  var instance = event.target;
  var x = event.stageX;
  var y = event.stageY;
  if (instance.exchengeCheck(x, y)) {
    var newRow = instance.getExchengeRow(y);
    var newCol = instance.getExchengeCol(x);
    // ドロップの入れ替え作業
    mmSound.stop();
    if(!timerStart) {
      timeLimmit = operateTime;
      timerStart = true;
    }
    mmSound.play();
    stage.addChildAt(drops[instance.row][instance.col], 30);
    stage.addChildAt(drops[newRow][newCol], 30);
    drops[instance.row][instance.col] = instance.exchenge(drops[newRow][newCol], instance.row, instance.col);

    instance.row = newRow;
    instance.col = newCol;
  }

  cueDrop.move(x, y);
  // timeBarの位置をマウスに追従させる
  timeBar.set({
    x: x,
    y: y - 30
  });
  // 操作時間の経過に合わせて幅だけ倍率を変更していく
  limmitBar.setTransform(0, 0, timeLimmit / operateTime, 1);
  // 設定しておいたフィルターをもとに，バーの色を変更する
  if (timerStart && timeLimmit / operateTime < 0.3) {
    limmitBar.filters = [
      // TODO: タイマーの色を設定できるようにしてあげよう
      new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0, 0)
    ];
    limmitBar.updateCache();
  }
  limmitBar.set({
    x: x + 2,
    y: y - 28
  });
  drops[instance.row][instance.col] = instance;
  if (timerStart && timeLimmit < 0) {
    endDrag(instance);
    sounds[4].play();
  }
  // ステージ外のマウスポインタの座標の取得は，rawXとrawYで取得します
  if (event.rawX < 0 || canvas.width < event.rawX || event.rawY < 0 || canvas.height < event.rawY) {
    endDrag(instance);
    sounds[4].play();
  }
}

function stopDrag(event) {
  var instance = event.target;
  endDrag(instance);
}

// TODO: 操作時間の設定
// TODO: 高速に動かしすぎると，画面買いに出たときにアニメーションがついていかない。
var comboDrops,
  comboCount,
  deleteDropCount = 0,
  fallenDropCount = 0;

function endDrag(drop) {
  timerStart = false;
  comboCount = 0;

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
  stage.removeChild(timeBar);
  stage.removeChild(limmitBar);

  deleteAndFallenDrops();

  console.log("end of 1 step");
}
// 落ち込んが途切れるまで呼び出され続ける関数
function deleteAndFallenDrops() {
  // TODO: 以下の処理をコンボが途切れるまで継続。この間，ドラッグ操作無効化
  console.log("Start Delete & Fallen");

  // ドラッグを不可に設定
  if(drops[0][0].hasEventListener("mousedown")) {
    for (var i = drops.length - 1; 0 <= i; i--) {
      for (var j = 0; j < drops[0].length; j++) {
        drops[i][j].removeEventListener("mousedown", startDrag);
      }
    }
  }

  // コンボ情報を返す処理
  comboDrops = [ // ドロップの配置を記憶しておく二次元配列5*6　
    [{combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}],
    [{combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}],
    [{combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}],
    [{combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}],
    [{combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}, {combo: 0, type: 9}]
  ];
  comboData = comboCheck(comboDrops, drops);
  if (!comboData) {
    // ドラッグイベントの復活
    for (var i = drops.length - 1; 0 <= i; i--) {
      for (var j = 0; j < drops[0].length; j++) {
        setDragEventForDrop(drops[i][j]);
      }
    }
    return;
  }
  // コンボ情報をもとにドロップを消去
  // TODO: 一旦，コンボを考えずに頑張る
  if (dropIsDelete) {
    var data = checkComboCount(comboData);
    comboData = data.drops;
    comboCount = data.count;
    comboAction();
  }
}

function comboAction() {
  // TODO: コンボの実際の処理　今はコンボを考えずに，一気に消す
  for (var i = comboData.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboData[0].length; j++) {
      if (comboData[i][j].type !== 9) {
        deleteDropCount++;
      }
    }
  }
  // ドロップ削除のアニメーション
  var timeline = new createjs.Timeline();
  // TODO: assEventlistenerで追加できるイベントは？
  // timeline.addEventListener('complete', deleteDrop)
  var index = 1;
  while (index <= comboCount) {
    for (var i = comboData.length - 1; 0 <= i; i--) {
      for (var j = 0; j < comboData[0].length; j++) {
        if (comboData[i][j].combo === index ) {
          if (j === 5) {
          }
          timeline.addTween(createjs.Tween.get(drops[i][j], {
            loop: false
          })
          .wait(250 * index)
          .to({
            alpha: 0.0
          }, deleteTime)
          // TODO: ここ，タイムライン全体の完了を取得したい
          .call(deleteDrop));
        }
      }
    }
    index++;
  }
  timeline.addLabel("start", 0);
  timeline.gotoAndPlay("start");
}

function deleteDrop() {
  ddSound.stop();
  ddSound.play();

  // タイムライン完了時のみ削除作業を開始
  deleteDropCount--;
  if (deleteDropCount === 0) {
    for (var i = 0; i < comboData.length; i++) {
      for (var j = 0; j < comboData[0].length; j++) {
        if (comboData[i][j].type !== 9) {
          stage.removeChild(drops[i][j]);
          drops[i][j] = null;
        }
      }
    }
    if (dropIsFallen) {
      fallDrops();
    }
  }
}

function fallDrops() {
  var tempData = $.extend(true, [], drops);
  for (var i = tempData.length - 1; 0 <= i; i--) {
    for (var j = 0; j < tempData[0].length; j++) {
      if (tempData[i][j] === null) {
        fallenDropCount++;
        var existFallDrop = existUpperDrop(tempData, i - 1, j);
        if (existFallDrop) {
          tempData[i][j] = tempData[existFallDrop.i][j];
          tempData[existFallDrop.i][j] = null;
          tempData[i][j].row = i;
        }
      }
    }
  }

  // TODO: コンボ後のドロップ落下処理
  // 配列のディープコピーを作成
  var timeline = new createjs.Timeline();
  for (var i = drops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < drops[0].length; j++) {
      if (drops[i][j] === null) {
        fallenDropCount--;
        var existFallDrop = existUpperDrop(drops, i - 1, j);
        if (existFallDrop) {
          drops[i][j] = drops[existFallDrop.i][j];
          drops[existFallDrop.i][j] = null;
          drops[i][j].row = i;
        } else {
          var type = Math.floor(Math.random() * 6);
          var drop = new Drop(dropImages[type], i, j, type, DROP_SIZE);
          drop.y -= HEIGHT;

          drops[i][j] = drop;
          stage.addChild(drops[i][j]);
        }

        timeline.addTween(createjs.Tween.get(drops[i][j], {
            loop: false
          })
          .to({
            y: drops[i][j].row * drops[i][j].size
          }, fallTime, createjs.Ease.quartOut)
          .call(dropDeleteCompleted));
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

function dropDeleteCompleted() {
  if (fallenDropCount === 0) {
    if(isLoop) {
      deleteAndFallenDrops();
    }
  }
}

function stageClear() {
  if (stage) {
      stage.removeAllChildren();
  }
}
function setDragEventForDrop(drop) {
  // ドラッグ可能にするための処理
  drop.addEventListener("mousedown", startDrag);
}
