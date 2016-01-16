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
  if (isSuccess) return comboDrops;
  else return false;
}

// 横方向のドロップのつながりを判定
function checkDropTypeHorizontal(i, j, comboDrops, drops) {
  var notCombo = false;
  if (drops[i][j].type === drops[i][j + 1].type && drops[i][j].type === drops[i][j + 2].type) {
    comboDrops[i][j].type = comboDrops[i][j + 1].type = comboDrops[i][j + 2].type = drops[i][j].type;
    j++;
  } else {
    notCombo = true;
  }

  if (notCombo || drops[0].length - 3 < j) {
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
  if (drops[i][j].type === drops[i - 1][j].type && drops[i][j].type === drops[i - 2][j].type) {
    comboDrops[i][j].type = comboDrops[i - 1][j].type = comboDrops[i - 2][j].type = drops[i][j].type;
    i -= 2;
  } else {
    notCombo = true;
  }

  if (notCombo || i < 2) {
    return comboDrops;
  } else {
    return checkDropTypeVertical(i, j, comboDrops, drops);
  }
}

var comboCounter;
// どこのドロップがどのコンボなのかを対応させる。
function checkComboCount(comboDrops) {
  comboCounter = 0;
  var phaseCombo = 0;
  for (var i = comboDrops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      if (comboDrops[i][j].type !== 9 && comboDrops[i][j].combo === 0) {
        console.log("[" + i + "," + j + "]判定スタート");
        // TODO: 判定
        comboCounter++;
        phaseCombo++;
        if (j === 0) {
          comboDrops[i][j].combo = comboTraceTopRightDown(i, j, comboDrops, comboDrops[i][j].type, i, j);
        } else {
          comboDrops[i][j].combo = comboTraceLeftTopRight(i, j, comboDrops, comboDrops[i][j].type, i, j);
        }
        console.log("判定終了");
      }
    }
  }
  // TODO: ドロップの削除をスムーズにするためにはphasecomboが必要なはず。まだ使ってないけど
  return {
    drops: comboDrops,
    count: comboCounter,
    phaseCombo: phaseCombo
  };
}

function comboTraceDownLeftTop(i, j, drops, type, prevI, prevJ) {
  console.log("DownLeftTop"+"["+i+","+j+"]");
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    traceDown(i, j, drops, type, prevI, prevJ);
    traceLeft(i, j, drops, type, prevI, prevJ);
    traceTop(i, j, drops, type, prevI, prevJ);
  }
  return comboCounter;
}
function comboTraceLeftTopRight(i, j, drops, type, prevI, prevJ) {
  console.log("LeftTopRight"+"["+i+","+j+"]");
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    traceLeft(i, j, drops, type, prevI, prevJ);
    traceTop(i, j, drops, type, prevI, prevJ);
    traceRight(i, j, drops, type, prevI, prevJ);
  }
  return comboCounter;
}
function comboTraceTopRightDown(i, j, drops, type, prevI, prevJ) {
  console.log("TopRightDown"+"["+i+","+j+"]");
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
      traceTop(i, j, drops, type, prevI, prevJ);
      traceRight(i, j, drops, type, prevI, prevJ);
      traceDown(i, j, drops, type, prevI, prevJ);
  }
  return comboCounter;
}
function comboTraceRightDownLeft(i, j, drops, type, prevI, prevJ) {
  console.log("RightDownLeft"+"["+i+","+j+"]");
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    traceRight(i, j, drops, type, prevI, prevJ);
    traceDown(i, j, drops, type, prevI, prevJ);
    traceLeft(i, j, drops, type, prevI, prevJ);
  }
  return comboCounter;
}
function traceLeft(i, j, drops, type, prevI, prevJ) {
  if (0 <= j - 1 && drops[i][j - 1].combo === 0) {
    drops[i][j].combo = comboTraceDownLeftTop(i, j - 1, drops, type, i, j);
  }
}
function traceTop(i, j, drops, type, prevI, prevJ) {
  if (0 <= i - 1 && drops[i - 1][i].combo === 0) {
    drops[i][j].combo = comboTraceLeftTopRight(i - 1, j, drops, type, i, j);
  }
}
function traceRight(i, j, drops, type, prevI, prevJ) {
  if (j + 1 < drops[0].length && drops[i][j + 1].combo === 0) {
    drops[i][j].combo = comboTraceTopRightDown(i, j + 1, drops, type, i, j);
  }
}
function traceDown(i, j, drops, type, prevI, prevJ) {
  if (i + 1 < drops.length && drops[i + 1][i].combo === 0) {
    drops[i][j].combo = comboTraceRightDownLeft(i + 1, j, drops, type, i, j);
  }
}
