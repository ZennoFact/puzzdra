<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Hands-on learning program. | kcg.edu</title>
  <link rel="stylesheet" href="./css/style.css">
</head>

<body>
  <header>
    <div class="header-box">
      <h2>京都コンピュータ学院体験授業 <small>vol.1 パズルゲーム編</small></h2>
    </div>
  </header>
  <div class="wrapper">
    <div class="container">
      <div class="main clearfix">
        <section id="editor-area">
          <p>プログラムの変更箇所は，ダブルクリックで編集可能になります。<br>
          変更完了後は，RUNボタンを押してプログラムを起動してください。</p>
          <div class="editorbox" unselectable="on">
            <p>
              <span class="comment">// Step.Extra システム設定</span></span>
              <br>
              <span class="comment">// 終了後，自由に変更を加えてください</span></span>
              <br> userName <span class="reserved">=</span> <span class="string">"</span><input type="text" class="input setting" value="YourName"/><span class="string">"</span><span class="reserved">;</span> <span class="comment">// 名前を入れてね</span>
              <br> folder <span class="reserved">=</span> <span class="string">"</span>sample<input type="text" class="input setting" value="1"><span class="string">"</span><span class="reserved">;</span> <span class="comment">// 1 - 5</span>
              <br> mmSound <span class="reserved">=</span> sounds[<input type="text" class="input setting" value="0">]<span class="reserved">;</span> <span class="comment">// 0 or 1</span>
              <br> ddSound <span class="reserved">=</span> sounds[<input type="text" class="input setting" value="2">]<span class="reserved">;</span> <span class="comment">// 2 or 3</span>
              <br> operateTime <span class="reserved">=</span> <input type="text" class="input setting" value="400"><span class="reserved">;</span> <span class="comment">// 操作時間（フレーム）</span>
              <br> deleteTime <span class="reserved">=</span> <input type="text" class="input setting" value="300"><span class="reserved">;</span> <span class="comment">// 消滅時間（ミリ秒）</span>
              <br> fallTime <span class="reserved">=</span> <input type="text" class="input setting" value="250"><span class="reserved">;</span> <span class="comment">// 落下時間（ミリ秒）</span>
              <br>
              <span class="comment">// システム設定ここまで</span>
              <hr>
              <span class="comment">// Step.1 ドロップを読み込みます。</span><br>
              <!-- <span class="comment">//「preload(folder);」と入力してください。</span><br> -->
              <input type="text" id="step1" class="input" value="Step.1"><br>
              <br>
              <span class="comment">// Step.2 ドロップをドラッグできるようにします。</span><br>
              <!-- <span class="comment">// 「drag = true;」と入力してください。</span><br> -->
              <input type="text" id="step2" class="input" value="Step.2"><br>
              <br>
              <span class="comment">// Step.3 ドロップが消えるようにします</span><br>
              <!-- <span class="comment">// 「canDelete();」と入力してください。</span><br> -->
              <input type="text" id="step3" class="input" value="Step.3"><br>
              <br>
              <span class="comment">// Step.4 ドロップが落ちるようにします。</span><br>
              <!-- <span class="comment">// 「gravity();」と入力してください。</span><br> -->
              <input type="text" id="step4" class="input" value="Step.4"><br>
              <br>
              <span class="comment">// Step.5 ドロップが落ちた後，つながっていたら消えるようにします。</span><br>
              <!-- <span class="comment">// 「isLoop = true;」と入力してください。</span><br> -->
              <input type="text" id="step5" class="input" value="Step.5"><br>
              <br>
              <span class="comment">// 内部のゲーム設定ここまで</span>
              <hr>
              <span class="comment">// プログラムの保存</span><br>
              <span class="comment">// Sub.1 データの保存をします。</span><br>
              <input type="text" id="step6" class="input warning" value="Sub.1"><br>
              <br>
              <span class="comment">// Sub.2 データを読み込めるか確認します。</span><br>
              <input type="text" id="step7" class="input warning" value="Sub.2"><br>
              <br>
              <hr>
              <span class="comment">// データをサーバに送信する</span><br>
              <span class="comment">// Sub.3 通信先を設定する</span><br>
              <input type="text" id="step8" class="input warning" value="Sub.3"><br>
              <br>
            </p>
          </div>
        </section>
        <section id="game-area">
          <div>
          <div>
            <div id="game-header clearfix">
              <div class="box">
                <button class="btn-run">RUN!!</button>
              </div>
              <div class="box">
                <p class="score-string">Score:<span id="score">0</span> Combo:<span id="combo">0</span></p>
              </div>
              <div>
                <canvas id="canvas" width="630" height="525"></canvas>
              </div>
        </section>
        </div>
        <div class="btn-code">⚠ code ⚠</div>
        <div class="tabbox">
          <p class="tabs">
            <a id="tabBtn1" href="#tab1" onclick="changeTab('tab1','tabBtn1'); return false;">game.js</a>
            <a id="tabBtn2" href="#tab2" onclick="changeTab('tab2','tabBtn2'); return false;">drop.js</a>
            <a id="tabBtn3" href="#tab3" onclick="changeTab('tab3','tabBtn3'); return false;">comboManager.js</a>
          </p>
          <div id="tab1" class="tab" contenteditable="true">
            <p>
              <?php
                $fileName = "./js/game.js";
                $file = fopen($fileName, "r");

                while (!feof($file)) {
                  $str = fgets($file);
                  print "<div>" . str_replace(" ", "&nbsp;", $str) . "</div>";
                }

                fclose($file);
              ?>
            </p>
          </div>
          <div id="tab2" class="tab" contenteditable="true">
            <p>
              <?php
              $fileName = "./js/drop.js";
              $file = fopen($fileName, "r");

              while (!feof($file)) {
                $str = fgets($file);
                print "<div>" . str_replace(" ", "&nbsp;", $str) . "</div>";
              }

              fclose($file);
              ?>
            </p>
          </div>
          <div id="tab3" class="tab" contenteditable="true">
            <p>
              <?php
              $fileName = "./js/comboManager.js";
              $file = fopen($fileName, "r");

              while (!feof($file)) {
                $str = fgets($file);
                print "<div>" . str_replace(" ", "&nbsp;", $str) . "</div>";
              }

              fclose($file);
              ?>
            </p>
          </div>
        </div>

        <div id="code">
        </div>

        <footer>
          <div>
            <p>&copy 2016 ZennoFact.</p>
          </div>
        </footer>
        </div>
      </div>
      <script src="./js/lib/jquery-1.12.0.min.js"></script>
      <script src="./js/lib/easeljs-0.8.2.min.js"></script>
      <script src="./js/lib/preloadjs-0.6.2.min.js"></script>
      <script src="./js/lib/tweenjs-0.6.2.min.js"></script>
      <script src="./js/lib/soundjs-0.6.2.min.js"></script>
      <script src="./js/cheat.js"></script>
      <script src="./js/system.js"></script>
      <script src="./js/drop.js"></script>
      <script src="./js/comboManager.js"></script>
      <script src="./js/game.js"></script>
      <script>
        changeTab('tab1', 'tabBtn1');
        document.getElementsByTagName('button')[0].addEventListener('click', function(){
          var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
          var inputs = [];
          gameData.forEach(function(elem) {
            inputs.push(elem.value);
          });
          answers.forEach(function(elem, i) {
            if (inputs[i + 7].replace(/\s+/g, "") !== elem) {
              inputs[i + 7] = "";
            }
          });

          userName = inputs[0];
          folder = 'sample' + inputs[1];
          mmSound = sounds[parseInt(inputs[2])];
          ddSound = sounds[parseInt(inputs[3])];
          operateTime = parseInt(inputs[4]);
          deleteTime = parseInt(inputs[5]);
          fallTime = parseInt(inputs[6]);

          var tabs = $(".tab");
          $('#code').html('<script>stageClear();' +
            tabs[1].innerText +
            tabs[2].innerText +
            tabs[0].innerText +
            inputs[7].replace(/\s+/g, "") +
            inputs[8].replace(/\s+/g, "") +
            inputs[9].replace(/\s+/g, "") +
            inputs[10].replace(/\s+/g, "") +
            inputs[11].replace(/\s+/g, "") +
            inputs[12].replace(/\s+/g, "") +
            inputs[13].replace(/\s+/g, "") + '<\/script>');
        });

        var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
        gameData.forEach(function(elem, i) {
          elem.addEventListener("keyup", function(e) {
            var isSuccess = inputCheck(i, elem.value);
            if (isSuccess) elem.classList.add('ok');
            else elem.classList.remove('ok');
          });
        });

        if (localStorage.getItem('13') == 'loadData();') {
          loadData();
          var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
          gameData.forEach(function(elem, i) {
            var isSuccess = inputCheck(i, elem.value);
            if (isSuccess) elem.classList.add('ok');
            else elem.classList.remove('ok');
          });
        }

      </script>
</body>

</html>
