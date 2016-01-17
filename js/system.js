// $(document).on('contextmenu', function(e){
//   return false;
// });

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
  var parent = item.parentNode;
  input.addEventListener("keydown", function(e){
    if(e.keyCode === 13 && input.value !== "") {
      console.log(parent.firstChild);
      parent.firstChild.innerHTML = input.value;
      parent.firstChild.classList.remove("none")
      parent.removeChild(e.target);
      inputs.forEach(function(elem) {
        elem.addEventListener('dblclick', showTextField, false);
      });
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
