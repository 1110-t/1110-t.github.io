let ctx = "";

let makeBoids = function(ctx,x,y){
    ctx.beginPath () ;
    ctx.arc(x, y, 1, 0 , Math.PI*2, false ) ;
    ctx.stroke() ;
};

let canvas = document.getElementById('canvas');
let boids = [];
let average = {vx:0,vy:0};

if (canvas.getContext) {
    // boidsを作成する
    for (let index = 0; index < 100; index++) {
      let boid = {};
      let x = Math.floor( Math.random() * 500 );
      let y = Math.floor( Math.random() * 500 );
      boid.x = x;
      boid.y = y;
      boid.vx = 0;
      boid.vy = 0;
      boids.push(boid);
    };
    // コンテキストを取得する
    ctx = canvas.getContext('2d');
    boids.forEach(boid => {
        makeBoids(ctx,boid.x,boid.y);
    });
};

let cohesion = function(index) {
    let center = {x: 0, y: 0};
    let boidLength = boids.length;

    //鳥たちの中心位置を求める
    for( let i = 0; i < boidLength; i++ ) {
      if( i === index ) {
        continue;
      }
      center.x += boids[i].x;
      center.y += boids[i].y;
    }
    center.x /= boidLength - 1;
    center.y /= boidLength - 1;
    //中心位置に向かうためのベクトルを算出
    boids[index].vx += ((center.x - boids[index].x)/100);
    boids[index].vy += ((center.y - boids[index].y)/100);
}

let direction = function(dir,v){
    if(dir > 500 && v > 0){
      return -1;
    } else if(dir < 0 && v < 0){
      return -1;
    } else {
      return 1;
    };
};

let separation = function(index) {
    let boidLength = boids.length;
    for( let i = 0; i < boidLength; i++ ) {
      if( i === index ) {
        continue;
      }
      //鳥同士の距離を測る
      let distance = getDistance( boids[i], boids[index] );
  
      //鳥同士が10px以内に位置する場合はベクトルを調整する
      if( distance < 20 ) {
        boids[index].vx -= ((boids[i].x - boids[index].x)*0.1);
        boids[index].vy -= ((boids[i].y - boids[index].y)*0.1);
      }
    }
}

let alignment = function(index) {
    let average = {vx: 0, vy: 0};
    let boidLength = boids.length;
  
    //全体の平均ベクトルを算出する
    for( let i = 0; i < boidLength; i++ ) {
      if( i === index ) {
        continue;
      }
      average.vx += boids[i].vx;
      average.vy += boids[i].vy;
    }
    average.vx /= boidLength - 1;
    average.vy /= boidLength - 1;
  
    //平均ベクトルに近づくように自分のベクトルを調整する
    boids[index].vx += ((average.vx - boids[index].vx)/2*0.2);
    boids[index].vy += ((average.vy - boids[index].vy)/2*0.2);
  }

let getDistance = function(a,b){
    let distance = Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
    return distance;
}

let main = function() {
    speed = 4;
    ctx.clearRect(0, 0, 500, 500);
    for (let index = 0; index < boids.length; index++) {
        alignment(index);
        cohesion(index);
        separation(index);
        dir_x = direction(boids[index].x + boids[index].vx,boids[index].vx);
        dir_y = direction(boids[index].y + boids[index].vy,boids[index].vy);
        let movement = Math.sqrt(boids[index].vx**2 + boids[index].vy**2);
        while(movement > speed){
          boids[index].vx = (boids[index].vx / movement) * 4;
          boids[index].vy = (boids[index].vy / movement) * 4;
          movement = Math.sqrt(boids[index].vx**2 + boids[index].vy**2);
        };
        boids[index].y += ((boids[index].vy)*dir_y);
        boids[index].x += ((boids[index].vx)*dir_x);
        makeBoids(ctx,boids[index].x,boids[index].y);
    }
    window.requestAnimationFrame(main);
};

window.requestAnimationFrame(main);