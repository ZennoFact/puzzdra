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
