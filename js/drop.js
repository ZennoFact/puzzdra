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
// TODO: ユーザーが操作しているドロップのあった場所への移動処理
Drop.prototype.exchenge = function(drop, row, col) {
  // 新しい，ドロップの居場所を設定
  // var drop = new Drop(drop.image, row, col, drop.type, drop.size)
  drop.row = row;
  drop.col = col;
  drop.x = col * this.size;
  drop.y = row * this.size;
  return drop;
};
Drop.prototype.move = function (x, y) {
  // this.row = parseInt(y / this.size);
  // this.col = parseInt(x / this.size);
  this.x = x - this.size / 2;
  this.y = y - this.size / 2;
};
