$(function () {
  var scoreData = [];
  var colors = ['#ff9999', '#99ff99', '#9999ff', '#cc6666', '#66cc66', '#6666cc'];

  getScore();

  function getScore() {
    $.ajax({
      type: 'POST',
      url: './read.php',
      data: {
        type: 'view',
        prev: JSON.stringify(scoreData)
      },
      success: function (result) {
          // console.log("post success");
          // console.log(JSON.stringify(scoreData));
          // console.log(result);
          var prevData = scoreData;
          scoreData = JSON.parse(result);
          if(prevData.length === 0) {
            scoreData.forEach(function(elem){
              createRecode(elem);
            });
          }
          else {
            if(prevData.length < scoreData.length) {
              for (var i = prevData.length; i < scoreData.length; i++) {
                createRecode(scoreData[i]);
              }
            }
            for (var i = 0; i < prevData.length; i++) {
              if(prevData[i].score !== scoreData[i].score || prevData[i].combo !== scoreData[i].combo) {
                console.log("updateRecode");
                updateRecode(i);
              }
            }
          }
          getScore();
      },
      error: function (data) {
          console.log("error");
          console.log(data);
      }
    });
  }

  function createRecode(elem) {
    var $jqObj = $('<div class="recode">' +
                      '<p class="score">' + elem.score + '</p>' +
                      '<p class="combo">' + elem.combo + ' combo!</p>' +
                      '<p class="name">' + elem.name + '</p>' +
                      '</div>');
    var rnd = Math.floor(Math.random() * 6);
    $jqObj.css("background", colors[rnd]);
    $(".main").append($jqObj);
  }
  function updateRecode(index) {
    console.log($('.score'));
    $('.score')[index].innerHTML = scoreData[index].score;
    $('.combo')[index].innerHTML = scoreData[index].combo + " combo!";
  }
});
