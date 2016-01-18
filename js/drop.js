function Drop(image, row, col, type, size) {
  this.image = image;
  this.x = col * size;
  this.y = row * size;
  this.row = row;
  this.col = col;
  this.type = type;
  this.size = size;
}

// 継承の仕方。まず，宣言してあるメソッドのプロトタイプを指定
// そのままではコンストラクタが継承元のものとなってしまうので，それを変更
Drop.prototype = new createjs.Bitmap();
Drop.prototype.constructor = Drop;

// ドロップの交換が行われるかの判定
Drop.prototype.exchengeCheck = function(x, y) {
  if (x < this.col * this.size || (this.col + 1) * this.size < x ||
    y < this.row * this.size || (this.row + 1) * this.size < y) {
    return true;
  }
  return false;
};
Drop.prototype.getExchengeCol = function(x) {
  if (x < this.col * this.size) return this.col - 1;
  else if ((this.col + 1) * this.size < x) return this.col + 1;
  else return this.col;
};
Drop.prototype.getExchengeRow = function(y) {
  if (y < this.row * this.size) return this.row - 1;
  else if ((this.row + 1) * this.size < y) return this.row + 1;
  else return this.row;
};
createjs.MotionGuidePlugin.install();
Drop.prototype.exchenge = function(drop, row, col) {
  // ドロップ入れ替えアニメーションのための座標決定
  var thisX = this.col * this.size;
  var thisY = this.row * this.size;
  var dropX = drop.col * drop.size;
  var dropY = drop.row * drop.size;
  var tempX = thisX - dropX;
  var tempY = thisY - dropY;
  var centerX, centerY, centerX2, centerY2;
  var halfSize = this.size / 2;
  if(thisY === dropY) {
    centerX = centerX2 = (centerX < centerX2) ? thisX + halfSize : dropX + halfSize;
    centerY = thisY - this.size;
    centerY2 = thisY + this.size;
  } else {
    centerX = thisX - this.size;
    centerX2 = thisX + this.size;
    centerY = centerY2 = (centerY < centerY2) ? thisY + halfSize : dropY + halfSize;
  }

  // 入れ替えのアニメーション
  var timeline = new createjs.Timeline();
  timeline.addTween(createjs.Tween.get(this, { loop: false })
    .to({guide: {path:[thisX,thisY, centerX,centerY, dropX,dropY], start: 0, end: 1, orient: false},rotation:0}, 120));
    timeline.addTween(createjs.Tween.get(drop, { loop: false })
    .to({guide: {path:[thisX,thisY, centerX2,centerY2, dropX,dropY], start: 1, end:0, orient: false},rotation:0}, 120));
  timeline.addLabel("start", 0);
  timeline.gotoAndPlay("start");


  // 新しい，ドロップの配置を設定
  var tempDrop = drop;
  drop.row = row;
  drop.col = col;
  this.row = tempDrop.row;
  this.col = tempDrop.col;

  return drop;
};
Drop.prototype.move = function (x, y) {
  this.x = x - this.size / 2;
  this.y = y - this.size / 2;
};
