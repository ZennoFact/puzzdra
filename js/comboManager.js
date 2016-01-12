function comboCheck(comboDrops, drops) {
  // 横方向へのドロップのつながりを確認。左側4列のみ判定
  for (var i = comboDrops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboDrops[0].length - 2; j++) {
       var comboData = checkDropTypeHorizontal(i, j, comboDrops, drops);
       j = comboData.j;
       comboDrops = comboData.comboDrops;
    }
  }
  console.log("checkDropTypeHorizontal End");
  // 縦方向へのドロップのつながりを確認。下4行のみを判定
  for (var i = comboDrops.length - 1; 1 < i; i--) {
    for (var j = 0; j < comboDrops[0].length - 1; j++) {
      comboDrops = checkDropTypeVertical(i, j, comboDrops, drops);
    }
  }
  console.log("checkDropTypeVertical End");
  var isSuccess = false;
  for (var i = 0; i < comboDrops.length; i++) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      if (comboDrops[i][j] !== 9) {
        isSuccess = true;
        break;
      }
    }
  }
  // コンボの結果を返す
  if ( isSuccess ) return comboDrops;
  else return false;
}

// 横方向のドロップのつながりを判定
function checkDropTypeHorizontal(i, j, comboDrops, drops) {
  var notCombo = false;
  if(drops[i][j].type === drops[i][j + 1].type && drops[i][j].type === drops[i][j + 2].type) {
    comboDrops[i][j] = comboDrops[i][j + 1] = comboDrops[i][j + 2] = drops[i][j].type;
    j += 2;
  } else {
    notCombo = true;
  }

  if(notCombo || drops[0].length - 2 < j) {
    var result = {
      "j": j,
      "comboDrops": comboDrops
    };
    return result;
  } else {
    return checkDropTypeHorizontal(i, j, comboDrops, drops);
  }
}

// 縦方向のドロップのつながりを計算
function checkDropTypeVertical(i, j, comboDrops, drops) {
  var notCombo = false;
  if(drops[i][j].type === drops[i - 1][j].type && drops[i][j].type === drops[i - 2][j].type) {
    comboDrops[i][j] = comboDrops[i - 1][j] = comboDrops[i - 2][j] = drops[i][j].type;
    i -= 2;
  } else {
    notCombo = true;
  }

  if(notCombo || i < 2) {
    return comboDrops;
  } else {
    return checkDropTypeHorizontal(i, j, comboDrops, drops);
  }
}

// どこのドロップがどのコンボなのかを対応させる。
// 実際のところはcomboDropsにオブジェクト突っ込めばこのメソッド使わなくても何とかなるような気はする。
function checkComboCount() {

}
