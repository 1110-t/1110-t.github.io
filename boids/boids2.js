const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const boids = [];

const radius = 20;

/**
 * (x0, y0)と(x1, y1)の距離を返す関数です
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
function dist(x0, y0, x1, y1) {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
}

class Biont {
  constructor(x, y, vx, vy, id) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.id = id;

    this.v1 = { x: 0, y: 0 };
    this.v2 = { x: 0, y: 0 };
    this.v3 = { x: 0, y: 0 };

    this.dir_x = 1;
    this.dir_y = 1;
  }
  update() {
    const MAX_SPEED = 4;
    this.vx += 0.001 * this.v1.x + 0.8 * this.v2.x + 0.1 * this.v3.x;
    this.vy += 0.001 * this.v1.y + 0.8 * this.v2.y + 0.1 * this.v3.y;

    const movement = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (movement > MAX_SPEED) {
      this.vx = (this.vx / movement) * MAX_SPEED;
      this.vy = (this.vy / movement) * MAX_SPEED;
    }
    // this.dir_x = this.direction(this.x + this.vx,this.vx,this.dir_x);
    // this.dir_y = this.direction(this.y + this.vy,this.vy,this.dir_y);
    this.x += (this.vx*this.dir_x);
    this.y += (this.vy*this.dir_y);
  }
  draw() {
    this.v1 = { x: 0, y: 0 };
    this.v2 = { x: 0, y: 0 };
    this.v3 = { x: 0, y: 0 };

    this.getToCenterVector();
    this.getAvoidanceVector();
    this.getAverageVelocityVector();
    this.update();
    context.beginPath();
    context.strokeStyle = "#000000";
    context.lineWidth = 2
    context.arc(this.x, this.y, radius / 2, 0, 2 * Math.PI);
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.vx * 3, this.y + this.vy * 3);
    context.stroke();
  }
  /**
   * 集団の中心に向かって移動します
   */
  getToCenterVector() {
    // 他の個体の座標の平均をgetToCenterVectorに代入します
    const center = { x: 0, y: 0 };
    boids.filter(biont => this.id !== biont.id).forEach(biont => {
      center.x += biont.x;
      center.y += biont.y;
    });
    center.x /= boids.length - 1;
    center.y /= boids.length - 1;

    this.v1.x = center.x - this.x;
    this.v1.y = center.y - this.y;
  }
  /**
   * DIST_THRESHOLD内に仲間がいると避けます
   */
  getAvoidanceVector() {
    const DIST_THRESHOLD = radius;
    boids.filter(
      biont => dist(this.x, this.y, biont.x, biont.y) < DIST_THRESHOLD
    ).forEach(biont => {
      this.v2.x -= biont.x - this.x;
      this.v2.y -= biont.y - this.y;
    });
  }
  /**
   * 集団の速度の平均に近づけます
   */
  getAverageVelocityVector() {
    // avgVに各個体の速度の平均を代入します
    const avgV = { x: 0, y: 0 };
    boids.filter(biont => this.id !== biont.id).forEach(biont => {
      avgV.x += biont.vx;
      avgV.y += biont.vy;
    });
    avgV.x /= boids.length - 1;
    avgV.y /= boids.length - 1;
    this.v3.x = avgV.x - this.vx;
    this.v3.y = avgV.y - this.vy;
  }
}

for (let i = 0; i < 50; i++) {
  boids.push(
    new Biont(Math.floor( Math.random() * 500 ), Math.floor( Math.random() * 500 ), 2, i)
  );
}

function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  boids.forEach(biont => {
    biont.draw();
  });
  window.requestAnimationFrame(loop);
}

loop()