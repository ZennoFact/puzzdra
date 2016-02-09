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
          <p>プログラムの変更箇所は，ダブルクリックで編集可能になります。</p>
          <p>変更完了後は，RUNボタンを押してプログラムを起動してください。</p>
          <div class="editorbox" unselectable="on">
            <p>
              <span class="comment">// Step.Extra システム設定</span></span>
              <br>
              <span class="comment">// 終了後，自由に変更を加えてください</span></span>
              <br> folder = "sample<span><span class="input setting">1</span></span>"; <span class="comment">// 1 or 2</span>
              <br> mmSound = sounds[<span><span class="input setting">0</span></span>]; <span class="comment">// 0 or 1</span>
              <br> ddSound = sounds[<span><span class="input setting">2</span></span>]; <span class="comment">// 2 or 3</span>
              <br> operateTime = <span><span class="input setting">400</span></span>; <span class="comment">// 操作時間（フレーム）</span>
              <br> deleteTime = <span><span class="input setting">300</span></span>; <span class="comment">// 消滅時間（ミリ秒）</span>
              <br> fallTime = <span><span class="input setting">250</span></span>; <span class="comment">// 落下時間（ミリ秒）</span>
              <br>
              <span class="comment">// システム設定ここまで</span>
              <hr>
              <span class="comment">// Step.1 ドロップを読み込みます。</span>
              <br>
              <span class="comment">//「preload(folder);」と入力してください。</span>
              <br>
              <!-- <span><span id="step1" class="input">Step.1</span></span><br> -->
              <span><span id="step1" class="input">preload(folder);</span></span>
              <br>
              <br>
              <span class="comment">// Step.2 ドロップをドラッグできるようにします。</span>
              <br>
              <span class="comment">// 「drag = true;」と入力してください。</span>
              <br>
              <!-- <span><span id="step2" class="input">Step.2</span></span><br> -->
              <span><span id="step2" class="input">drag = true;</span></span>
              <br>
              <br>
              <span class="comment">// Step.3 ドロップが消えるようにします</span>
              <br>
              <span class="comment">// 「canDelete();」と入力してください。</span>
              <br>
              <!-- <span><span id="step3" class="input">Step.3</span></span><br> -->
              <span><span id="step3" class="input">canDelete();</span></span>
              <br>
              <br>
              <span class="comment">// Step.4 ドロップが落ちるようにします。</span>
              <br>
              <span class="comment">// 「gravity();」と入力してください。</span>
              <br>
              <!-- <span><span id="step4" class="input">Step.4</span></span><br> -->
              <span><span id="step4" class="input">gravity();</span></span>
              <br>
              <br>
              <span class="comment">// Step.5 ドロップが落ちた後，つながっていたら消えるようにします。</span>
              <br>
              <span class="comment">// 「isLoop = true;」と入力してください。</span>
              <br>
              <!-- <span><span id="step5" class="input">Step.5</span></span><br> -->
              <span><span id="step5" class="input">isLoop = true;</span></span>
              <br>
            </p>
          </div>
        </section>
        <section id="game-area">
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
        <!-- contenteditable=true の確認。下のエディタでは使用してみる。うまくいけば上も改修 -->
        <footer>
          <div>
            <p>&copy 2016 ZennoFact.</p>
          </div>
        </footer>
        </div>
      </div>
      <script src="./js/lib/jquery-2.1.3.min.js"></script>
      <script src="./js/lib/easeljs-0.8.2.min.js"></script>
      <script src="./js/lib/preloadjs-0.6.2.min.js"></script>
      <script src="./js/lib/tweenjs-0.6.2.min.js"></script>
      <script src="./js/lib/soundjs-0.6.2.min.js"></script>
      <script src="./js/cheat.js"></script>
      <script src="./js/system.js"></script>
      <!-- <script src="./js/drop.js"></script>
      <script src="./js/comboManager.js"></script>
      <script src="./js/game.js"></script> -->
      <script>


        changeTab('tab1', 'tabBtn1');

        $('button').click(function() {
          var gameData = Array.prototype.slice.call(document.getElementsByClassName('input'));
          var inputs = [];
          gameData.forEach(function(elem) {
            inputs.push(elem.innerHTML);
          });

          if (inputs[6].replace(/\s+/g, "") !== 'preload(folder);') {
            inputs[6] = "";
          }
          if (inputs[7].replace(/\s+/g, "") !== 'drag=true;') {
            inputs[7] = "drag = false;";
          }
          if (inputs[8].replace(/\s+/g, "") !== 'canDelete();') {
            inputs[8] = "";
          }
          if (inputs[9].replace(/\s+/g, "") !== 'gravity();') {
            inputs[9] = "";
          }
          if (inputs[10].replace(/\s+/g, "") !== 'isLoop=true;') {
            inputs[10] = "isLoop = false;";
          }

          folder = 'sample' + inputs[0];
          mmSound = sounds[parseInt(inputs[1])];
          ddSound = sounds[parseInt(inputs[2])];
          operateTime = parseInt(inputs[3]);
          deleteTime = parseInt(inputs[4]);
          fallTime = parseInt(inputs[5]);

          var tabs = $(".tab");
          console.log(tabs);

          $('#code').html('<script>stageClear();' +
            tabs[1].innerText +
            tabs[2].innerText +
            tabs[0].innerText +
            inputs[6].replace(/\s+/g, "") +
            inputs[7].replace(/\s+/g, "") +
            inputs[8].replace(/\s+/g, "") +
            inputs[9].replace(/\s+/g, "") +
            inputs[10].replace(/\s+/g, "") + '<\/script>');
        });
      </script>
</body>

</html>
