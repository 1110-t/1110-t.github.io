const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

const ALIVE = 1;
const DEAD = 0;

const cell = [];
// セルの大きさ
const cellSize = 10;

// 1列のセルの個数
const cols = Math.floor(canvas.width / cellSize);
// 1行のセルの個数
const rows = Math.floor(canvas.height / cellSize);

/**
 * 初期設定を行う関数です
 */
function initCells() {
  context.fillStyle = "rgb(60, 60, 60)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let col = 0; col < cols; col++) {
    cell[col] = [];
    // 各セルに0か1を代入する 100×100の配列に0か1を代入していく
    for (let row = 0; row < rows; row++) {
      cell[col][row] = Math.round(Math.random());
    }
  }
  draw();
}

/**
 * セルの描画を実行します
 */
function draw() {
  // ひとつずつのセルに対して処理を行う
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      drawCell(col, row);
    }
  }
}

/**
 * セルの描画設定です
 * @param x
 * @param y
 */
function drawCell(x, y) {
  // 状態を取得
  const state = cell[x][y];
  // もし生きていれば黒、死んでいたら白を設定する
  context.fillStyle = state === ALIVE ? "rgb(0,0,100)" : "rgb(255,255,255)";
  // 座標 x*cellsize, y*cellsize に正方形のサイズに色を付与する
  context.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
}

/**
 * 周囲9マスのセルのうち、生存しているセルの数を返す関数です
 * @param x
 * @param y
 */
function checkAround(x, y) {
  let count = 0;
  // -1 0 1
  for (let i = -1; i <= 1; i++) {
    // -1 0 1
    for (let j = -1; j <= 1; j++) {
      if (
        // (iが0ではないか、あるいはjが0ではない場合)かつ
        (i !== 0 || j !== 0) &&
        // 端っこの場合は無視する
        x + i > 0 &&
        x + i < cols &&
        // 端っこの場合は無視する
        y + j > 0 &&
        y + j < rows
      ) {
        // 周囲のセルの中の生存セルの値を合計していっている
        count += cell[x + i][y + j];
      }
    }
  }
  // 生存数を返す
  return count;
}

/**
 * セルの状態を更新する関数です
 */
function proceed() {
  // それぞれのセルの状態にアクセスする
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      // 周りの生存セルの数を取得
      const count = checkAround(col, row);
      const currentState = cell[col][row];
      // 次の状態を一旦
      let nextState = DEAD;
      // 生存時に周りに2体いるときは維持
      if (count === 2) {
        // 生存していたら、そのまま今の状態
        nextState = currentState ;
      }
      // 周りに3体いるときは誕生または維持
      if (count === 3) {
        // 生存状態に変更
        nextState = ALIVE;
      }
      // 0体か1体あるいは4体以上いる場合に死の状態
      cell[col][row] = nextState;
    }
  }
  draw();
}

initCells();
// 100ミリ秒ごとにproceed関数を実行
setInterval(proceed, 100);
