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


// どこのドロップがどのコンボなのかを対応させる。
var comboCounter;
function checkComboCount(comboDrop, score, comboCount) {
  comboCounter = comboCount;
  var phaseCombo = 0;
  var dropCount = 0;
  for (var i = comboDrops.length - 1; 0 <= i; i--) {
    for (var j = 0; j < comboDrops[0].length; j++) {
      if (comboDrops[i][j].type !== 9 && comboDrops[i][j].combo === 0) {
        // TODO: 判定
        comboCounter++;
        phaseCombo++;
        if (j === 0) {
          dropCount = comboTraceTopRightDown(i, j, comboDrops, comboDrops[i][j].type, i, j);
        } else {
          dropCount = comboTraceLeftTopRight(i, j, comboDrops, comboDrops[i][j].type, i, j);
        }
        score.push({
          score: parseInt(dropCount * 100 * (1 + comboCounter / 10 )),
          combo: comboCounter
        });
        dropCount = 0;
      }
    }
  }
  console.log("PhaseCombo: " + phaseCombo);
  console.log("ComboCounter: " + comboCounter);
  // TODO: ドロップの削除をスムーズにするためにはphasecomboが必要なはず。まだ使ってないけど
  return {
    drops: comboDrops,
    count: comboCounter,
    scoreData: score,
    phaseCombo: phaseCombo
  };
}

function comboTraceDownLeftTop(i, j, drops, type, prevI, prevJ) {
  count = 0;
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    drops[i][j].combo = comboCounter;
    traceDown(i, j, drops, type, prevI, prevJ);
    traceLeft(i, j, drops, type, prevI, prevJ);
    traceTop(i, j, drops, type, prevI, prevJ);
    count++;
  }
  return count;
}
function comboTraceLeftTopRight(i, j, drops, type, prevI, prevJ) {
  count = 0;
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    drops[i][j].combo = comboCounter;
    traceLeft(i, j, drops, type, prevI, prevJ);
    traceTop(i, j, drops, type, prevI, prevJ);
    traceRight(i, j, drops, type, prevI, prevJ);
    count++;
  }
  return count;
}
function comboTraceTopRightDown(i, j, drops, type, prevI, prevJ) {
  count = 0;
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    drops[i][j].combo = comboCounter;
    traceTop(i, j, drops, type, prevI, prevJ);
    traceRight(i, j, drops, type, prevI, prevJ);
    traceDown(i, j, drops, type, prevI, prevJ);
    count++;
  }
  return count;
}
function comboTraceRightDownLeft(i, j, drops, type, prevI, prevJ) {
  count = 0;
  if (drops[i][j].type === (drops[prevI][prevJ]).type) {
    drops[i][j].combo = comboCounter;
    traceRight(i, j, drops, type, prevI, prevJ);
    traceDown(i, j, drops, type, prevI, prevJ);
    traceLeft(i, j, drops, type, prevI, prevJ);
    count++;
  }
  return count;
}
function traceLeft(i, j, drops, type, prevI, prevJ) {
  if (0 <= j - 1 && drops[i][j - 1].combo === 0) {
    comboTraceDownLeftTop(i, j - 1, drops, type, i, j);
  }
}
function traceTop(i, j, drops, type, prevI, prevJ) {
  if (0 <= i - 1 && drops[i - 1][j].combo === 0) {
    comboTraceLeftTopRight(i - 1, j, drops, type, i, j);
  }
}
function traceRight(i, j, drops, type, prevI, prevJ) {
  if (j + 1 < drops[0].length && drops[i][j + 1].combo === 0) {
    comboTraceTopRightDown(i, j + 1, drops, type, i, j);

  }
}
function traceDown(i, j, drops, type, prevI, prevJ) {
  if (i + 1 < drops.length && drops[i + 1][i].combo === 0) {
    comboTraceRightDownLeft(i + 1, j, drops, type, i, j);
  }
}
