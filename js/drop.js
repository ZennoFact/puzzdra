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
Drop.prototype.movedCheck = function (x, y) {
  if (x < this.col * this.size || (this.col + 1) * this.size < x ||
      y < this.row * this.size || (this.row + 1) * this.size < y) {
        return true;
  }
  return false;
};
Drop.prototype.movementX = function(col) {
  if(this.x < col * this.size) return this.col - 1;
  else if(col * this.size < this.x) return this.col + 1;
  else return this.col;
};
Drop.prototype.movementY = function(row) {
  if(this.y < row * this.size) return this.row - 1;
  else if(row * this.size < this.y) return this.row + 1;
  else return this.row;
};
// TODO: ユーザーが操作しているドロップのあった場所への移動処理
Drop.prototype.moved = function (drop, row, col) {
  console.log("moved");
  drop.x = this.col * this.size;
  drop.y = this.row * this.size;
  drop.row = this.row;
  drop.col = this.col;
  this.row = row;
  this.col = col;
  console.log(drop.col+":"+drop.row + ", " + this.col+":"+this.row);
};
