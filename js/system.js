$(document).on('contextmenu', function(e){
  return false;
});

var sounds = [];
var queue = new createjs.LoadQueue(true);
queue.installPlugin(createjs.Sound);

//読み込むファイルを記述（複数可能）
var manifest = [
  {id:"mm1",src:"./assets/sounds/mousemove1.mp3"},
  {id:"mm2",src:"./assets/sounds/mousemove2.mp3"},
  {id:"dd1",src:"./assets/sounds/dropdelete1.mp3"},
  {id:"dd2",src:"./assets/sounds/dropdelete2.mp3"},
  {id:"fi1",src:"./assets/sounds/finish1.mp3"}];
queue.loadManifest(manifest,true);

//manifestで指定したファイルが１つ読み込まれるごとに実行される
queue.addEventListener('fileload',handleFileLoad);
function handleFileLoad(event){
    sounds.push(createjs.Sound.createInstance(event.item.id));
}

var inputs = Array.prototype.slice.call(document.getElementsByClassName('input'));
inputs.forEach(function(elem) {
  elem.addEventListener('dblclick', showTextField, false);
});

function showTextField(e) {
  var item = e.target;
  item.classList.add('none');
  var input =document.createElement('input');
  input.setAttribute("type", "text");
  var regex = /Step\.\d/;
  if (regex.test(item.innerHTML)) {
　　input.value = "";
  } else {
　　input.value = item.innerHTML;
  }
  var parent = item.parentNode;
  input.addEventListener("keydown", function(e){
    if(e.keyCode === 13 && input.value !== "") {
      parent.firstChild.innerHTML = input.value;
      parent.firstChild.classList.remove("none")
      parent.removeChild(e.target);
      inputs.forEach(function(elem) {
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
  } else if(document.getElementById('step1').innerHTML === "Step.1") {
    document.getElementById('step1').innerHTML = "Step.1";
    document.getElementById('step1').classList.remove('ok');
  }
  if (document.getElementById('step2').innerHTML.replace(/\s+/g, "") === 'drag=true;') {
    document.getElementById('step2').classList.add('ok');
  } else if(document.getElementById('step2').innerHTML === "Step.2") {
    document.getElementById('step2').innerHTML = "Step.2";
    document.getElementById('step2').classList.remove('ok');
  }
  if (document.getElementById('step3').innerHTML.replace(/\s+/g, "") === 'canDelete();') {
    document.getElementById('step3').classList.add('ok');
  } else if(document.getElementById('step3').innerHTML === "Step.3") {
    document.getElementById('step3').innerHTML = "Step.3";
    document.getElementById('step3').classList.remove('ok');
  }
  if (document.getElementById('step4').innerHTML.replace(/\s+/g, "") === 'gravity();') {
    document.getElementById('step4').classList.add('ok');
  } else if(document.getElementById('step4').innerHTML === "Step.4") {
    document.getElementById('step4').innerHTML = "Step.4";
    document.getElementById('step4').classList.remove('ok');
  }
  if (document.getElementById('step5').innerHTML.replace(/\s+/g, "") === 'isLoop=true;') {
    document.getElementById('step5').classList.add('ok');
  } else if(document.getElementById('step5').innerHTML === "Step.5") {
    document.getElementById('step5').innerHTML = "Step.5";
    document.getElementById('step5').classList.remove('ok');
  }
}
