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

  // ドロップの生成をします
  initDrops();

  // ドロップの準備ができたので，描画を開始
  render();
}

function initDrops() {
  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      var type = Math.floor(Math.random() * 6);
      var drop = new Drop(dropImages[type], i, j, type, DROP_SIZE);

      // ドラッグ可能にするための処理
      if(mouseEventOn) {
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

// ドラッグアンドドロップ関係の処理
function startDrag(event) {
  var instance = event.target;
  instance.addEventListener("pressmove", drag);
  instance.addEventListener("pressup", stopDrag);
}
function drag(event) {
  var instance = event.target;
  var x = event.stageX;
  var y = event.stageY;

  // TODO: 切り替えをするここから
  if(instance.movedCheck(x, y)) {
    var row = instance.movementY(row);
    var col = instance.movementX(col);
    console.log(row +"*"+ col);
    instance.moved(drops[row][col], row, col);
  }

  instance.x = event.stageX - DROP_SIZE / 2;
  instance.y = event.stageY - DROP_SIZE / 2;
}
function stopDrag(event) {
  var instance = event.target;
  instance.removeEventListener("pressmove", drag);
  instance.removeEventListener("pressup", stopDrag);
}
