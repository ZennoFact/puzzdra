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
  scoreData = [],
  ROW = 5,
  COL = 6,
  DROP_SIZE = 105,
  WIDTH, // パズル画面の幅
  HEIGHT, // パズル画面の高さ
  folder,
  dropImages = [],
  bgImage,
  drag = false,
  dropDeletable = false,
  hasGravity = false,
  isLoop = false,
  timerStart = false,
  timeLimmit = -1,
  operateTime,
  deleteTime,
  fallTime,
  operatingEndMusicIndex = 4,
  mmSound,
  ddSound,
  isOperable; // ドロップを操作可能かどうか
// ドロップ移動時に関係する変数群
var cueDrop, cueData = {},
  　timeBar, 　limmitBar;

// 画像データの取得処理（開始前にデータロードを実行する）
function preload(folderName) {
  var queue = new createjs.LoadQueue(false);
  queue.setMaxConnections(2);
  var basePath = "./assets/drop_image/";
  var manifest = getImageManifest(basePath, folderName);
  // 取得したマニフェストをもとにファイルの読み込み
  queue.loadManifest(manifest, false);
  queue.load();
  // 全ファイルの読み込みが完了した際の処理を登録
  queue.addEventListener("complete", function(event) {
    var result = event.target._loadedResults;
    dropImages = getDropImageArray(result);
    // ゲームの初期化へ
    init();
  });
}
// ドロップの生成を呼び出す
function createDrop(i, j) {
  var type = Math.floor(Math.random() * 6);
  return new Drop(dropImages[type], i, j, type, DROP_SIZE);
}

// 初期化（initialize）処理
function init() {
  canvas = $("#canvas")[0];
  WIDTH = canvas.width = COL * DROP_SIZE;
  HEIGHT = canvas.height = ROW * DROP_SIZE;
  stage = new createjs.Stage(canvas);
  stage.addChild(new createjs.Bitmap(bgImage));

  createjs.Touch.enable(stage);
  stage.mouseMoveOutside = true;

  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      drops[i][j] = createDrop(i, j);
      stage.addChild(drops[i][j]);
      if (drag) {
        setDragEventForDrop(drops[i][j]);
      }
    }
  }
  // 初期化完了，描画(ゲーム)の開始
  render();
}

// 描画
function render() {
  if (timerStart) {
    timeLimmit--;
    var x = cueData.x;
    var y = cueData.y;
    timeBar.set({
      x: x,
      y: y - 30
    });
    // 操作時間の経過に合わせて幅だけ倍率を変更していく
    limmitBar.setTransform(0, 0, timeLimmit / operateTime, 1);
    // 設定しておいたフィルターをもとに，バーの色を変更する
    if (operateTime < 0.3) {
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
    drops[cueData.drop.row][cueData.drop.col] = cueData.drop;
    if (timerStart && timeLimmit <= 0) {
      endDrag(cueData.drop);
      sounds[4].play();
    }
  }
  // CreateJSの更新
  stage.update();
  // TODO: tickを使うべきかの判断
  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame(render);
}

// ドロップ操作関係の処理
function startDrag(event) {
  var instance = event.target;
  instance.alpha = 0.5;
  instance.addEventListener("pressmove", dragging);
  instance.addEventListener("pressup", stopDrag);

  cueDrop = new CueDrop(instance.image, instance.row, instance.col, instance.type, DROP_SIZE, event.stageX, event.stageY);
  stage.addChild(cueDrop);

  // TODO: ここの処理，まとめられるはず
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

function dragging(event) {
  var instance = event.target;
  var x = event.stageX;
  var y = event.stageY;
  if (instance.exchengeCheck(x, y)) {
    var newRow = instance.getExchengeRow(y);
    var newCol = instance.getExchengeCol(x);
    // ドロップの入れ替え作業
    mmSound.stop();
    if (!timerStart) {
      timeLimmit = operateTime;
      timerStart = true;
    }
    mmSound.play();
    // TODO: 描画を先頭にもってくる方法はこれしかないのか？
    // stage.addChildAt(drops[instance.row][instance.col], 30);
    // stage.addChildAt(drops[newRow][newCol], 30);
    drops[instance.row][instance.col] = instance.exchenge(drops[newRow][newCol], instance.row, instance.col);

    instance.row = newRow;
    instance.col = newCol;
  }

  cueDrop.move(x, y);
  cueData.drop = instance;
  cueData.x = x;
  cueData.y = y;
  // ステージ外のマウスポインタの座標の取得は，rawXとrawYで取得します
  if (event.rawX < 0 || canvas.width < event.rawX || event.rawY < 0 || canvas.height < event.rawY) {
    endDrag(instance);
    sounds[operatingEndMusicIndex].play();
  }
}

function stopDrag(event) {
  var instance = event.target;
  endDrag(instance);
}

// TODO: 高速に動かしすぎると，画面外に出たときにアニメーションがついていかない。
var comboDrops,
  comboCount,
  deleteDropCount = 0,
  fallenDropCount = 0;

function endDrag(drop) {
  timerStart = false;
  comboCount = 0;


  drop.removeEventListener("pressmove", dragging);
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
  scoreData = [];

  deleteAndFallenDrops();

  console.log("end of 1 step");
}

// 落ちコンが途切れるまで呼び出され続ける関数
function deleteAndFallenDrops() {
  console.log("Start: deleteAndFallenDrops");
  // ドラッグを不可に設定
  if (drops[0][0].hasEventListener("mousedown")) {
    removeDragEventAllDrops(drops);
  }

  // 各フェーズごとのデータのマッピング用配列をディープコピー
  comboDrops = $.extend(true, [], DEFAULT_COMBO_DROPS);
  comboDrops = comboCheck(comboDrops, drops);

  // コンボが成立していなければ，ドラッグ処理を追加してコンボ用のループを終了
  if (!comboDrops) {
    setDragEventAllDrops(drops);
    console.log("End of 1 play.");
    return;
  }
  var phaseCombo;
  // コンボ情報をもとにドロップを消去する処理へ
  if (dropDeletable) {
    var data = checkComboCount(comboDrops, scoreData, comboCount);
    comboData = data.drops;
    comboCount = data.count;
    scoreData = data.scoreData;
    comboAction(data.phaseCombo);

    // 本来続けていきたい処理
    // deleteDrop();
    // dropDeleteCompleted()；
  }



  console.log("End: deleteAndFallenDrops");
}

function comboAction(phaseCombo) {
  console.log("Start: comboAction");

  deleteDropCount = 0;
  comboData.forEach(function(array) {
    array.forEach(function(data) {
      if (data.type !== 9) {
        deleteDropCount++;
      }
    });
  });
  // ドロップ削除のアニメーション
  var timeline = new createjs.Timeline();
  // TODO: assEventlistenerで追加できるイベントは？ここ，タイムライン全体の完了を取得したい
  // timeline.addEventListener('complete', deleteDrop)
  var index = comboCount - phaseCombo;
  console.log(index + "=>" + comboCount);
  while (index < comboCount) {
    comboData.forEach(function(array, i) {
      array.forEach(function(data, j) {
        // console.log("[" + data.combo + ":" + (index + 1) + "]");
        if (data.combo === index + 1) {
          // console.log("[" + i + "," + j + "]");
          document.getElementById("score").innerHTML = scoreData[index].score;
          document.getElementById("combo").innerHTML = scoreData[index].combo;
          // var tween = createjs.Tween.get(drops[i][j], {
          //     loop: false
          //   })
          //   .wait(250 * index)
          //   .to({
          //     alpha: 0.0
          //   }, deleteTime);
          // tween.call(function () {
          //   timeline.removeTween(tween);
          //    console.log(timeline._tweens.length);
          //    if (timeline._tweens.length === 0) {
          //      deleteDrop();
          //    }
          // });
          // timeline.addTween(tween);
          timeline.addTween(createjs.Tween.get(drops[i][j], {
              loop: false
            })
            .wait(250 * index)
            .to({
              alpha: 0.0
            }, deleteTime)
            .call(function() {
              deleteDrop();
            }));
        }
      });
    });
    index++;
  }
  timeline.addLabel("start", 0);
  timeline.gotoAndPlay("start");
  console.log("End: comboAction");

}

function deleteDrop() {
  // TODO: IEだと，音声の読み込みが間に合わず，エラーになる可能性あり
  ddSound.stop();
  ddSound.play();

  // タイムライン完了時のみ削除作業を開始
  deleteDropCount--;
  if (deleteDropCount === 0) {
    console.log("Start: deleteDrop");

    comboData.forEach(function(array, i) {
      array.forEach(function(data, j) {
        if (data.type !== 9) {
          stage.removeChild(drops[i][j]);
          drops[i][j] = null;
        }
      });
    });
    if (hasGravity) {
      fallDrops();
    }
    console.log("End: deleteDrop");
  }
}

function fallDrops() {
  console.log("Start: fallDrops");
  // 配列のディープコピーを作成
  var tempData = $.extend(true, [], drops);
  tempData.forEach(function(array, i) {
    array.forEach(function(data, j) {
      if (data === null) {
        // fallenDropCount++;
        // console.log("FallenDropCount" + fallenDropCount);

        var existFallDrop = existUpperDrop(tempData, i - 1, j);
        if (existFallDrop) {
          tempData[i][j] = tempData[existFallDrop.i][j];
          tempData[existFallDrop.i][j] = null;
          tempData[i][j].row = i;
        }
      }
    });
  });
  // TODO: コンボ後のドロップ落下処理
  var timeline = new createjs.Timeline();
  for (var i = drops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < drops[0].length; j++) {
      if (drops[i][j] === null) {
        var existFallDrop = existUpperDrop(drops, i - 1, j);
        if (existFallDrop) {
          drops[i][j] = drops[existFallDrop.i][j];
          drops[existFallDrop.i][j] = null;
          drops[i][j].row = i;
        } else {
          drops[i][j] = createDrop(i, j);
          stage.addChild(drops[i][j]);
        }

        fallenDropCount++;
        console.log("FallenDropCount" + fallenDropCount);

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

  console.log("End: fallDrops");
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
  fallenDropCount--;
  if (fallenDropCount === 0) {
    if (isLoop) {
      console.log("!dropDeleteCompleted!");
      deleteDropCount = 0;
      fallenDropCount = 0;
      deleteAndFallenDrops();
    }
  }
}
