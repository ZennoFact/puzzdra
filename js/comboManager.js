function comboCheck(comboDrops, drops) {
  // 横方向へのドロップのつながりを確認。左側4列のみ判定
  for (var i = comboDrops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboDrops[0].length - 2; j++) {
       var comboData = checkDropTypeHorizontal(i, j, comboDrops, drops);
       j = comboData.j;
       comboDrops = comboData.comboDrops;
    }
  }
  // 縦方向へのドロップのつながりを確認。下4行のみを判定

  for (var i = comboDrops.length - 1; 1 < i; i--) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      comboDrops = checkDropTypeVertical(i, j, comboDrops, drops);
    }
  }
  var isSuccess = false;
  for (var i = 0; i < comboDrops.length; i++) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      if (comboDrops[i][j].type !== 9) {
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
    comboDrops[i][j].type = comboDrops[i][j + 1].type = comboDrops[i][j + 2].type = drops[i][j].type;
    j++;
  } else {
    notCombo = true;
  }

  if(notCombo || drops[0].length - 3 < j) {
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
    comboDrops[i][j].type = comboDrops[i - 1][j].type = comboDrops[i - 2][j].type = drops[i][j].type;
    i -= 2;
  } else {
    notCombo = true;
  }

  if(notCombo || i < 2) {
    return comboDrops;
  } else {
    return checkDropTypeVertical(i, j, comboDrops, drops);
  }
}

var comboCounter;
// どこのドロップがどのコンボなのかを対応させる。
function checkComboCount(comboDrops) {
  comboCounter = 1;
  for (var i = comboDrops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      if (comboDrops[i][j].type !== 9 && comboDrops[i][j].combo === 0) {
        // TODO: 判定
        if (j !== 0 && comboDrops[i][j].type === comboDrops[i][j - 1].type ) {
          comboDrops[i][j].combo = comboDrops[i][j - 1].combo;
          comboDrops = comboTrace(i, j, comboDrops, comboDrops[i][j].type);
        } else {
          comboDrops = comboTrace(i, j, comboDrops, comboDrops[i][j].type);
          comboCounter++;
        }
      }
    }
  }
  return {
    count: comboCounter,
    drops: comboDrops
  };
}
function comboTrace(i, j, drops, type) {
  drops[i][j].combo = comboCounter;
  if(0 <= j - 1 && drops[i][j - 1].type === type) {
    drops = comboTrace(i, j - 1, drops, type);
  }
  if(0 <= i - 1 && drops[i - 1][j].type === type) {
    drops = comboTrace(i - 1, j, drops, type);
  }
  return drops;
}
function comboTraceOnlyVertical(i, j, drops, type) {
  if(0 <= i - 1 && drops[i - 1][j].type === type) {
    drops[i - 1][j].combo = drops[i][j].combo;
    drops = comboTrace(i - 1, j, drops, type);
  }
  return drops;
}
