let s;
const bigBang = (jsonDatas) => {
  jsonDatas.forEach(jsonData => {
    s = new Star(jsonData);
    Star.planets.push(s);
  });
};

fetch("./data/stars.json")
  .then(response => {
    return response.json();
  }
).then(
  jsonDatas => {
    console.log(jsonDatas);
    bigBang(jsonDatas);
    s.makeStar();
    Star.planets.forEach(star => {
      scene.scene.add(star.instance);
    });
    Star.load = 1;
  }
);

class Star {
  static planets = [];
  static load = 0;
  constructor(jsonData){
    this.name = jsonData.name; // 名前
    this.coording = jsonData.coording; // 座標
    this.scale = jsonData.scale; // 大きさ
    this.surface = jsonData.surface; // テクスチャ
    this.rotate = 0;
    this.rotateSpeed = jsonData.rotateSpeed;
    this.rotateDistance = jsonData.rotateDistance;
    this.depend = jsonData.depend;
    this.spin = jsonData.spin;
  };
  makeStar(){
    let stars = [];
    Star.planets.forEach(planet => {
      const geo = new THREE.SphereGeometry(planet.scale,30,30);
      const mat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture(planet.surface) } );
      const mesh = new THREE.Mesh(geo,mat);
      mesh.position.x = planet.coording[0];
      mesh.position.y = planet.coording[1];
      mesh.position.z = planet.coording[2];
      planet.instance = mesh;
    });
    return stars;
  };
};

class Scene{
  renderer;
  scene;
  camera;
  cameraLotation = "";
  cameraStop = 0;
  startMouse = 0;
  constructor(world){
    this.world = document.querySelector("#"+world);
  };
  render(){
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.world
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    const directionalLight = new THREE.PointLight(0xFFFFFF,1,0,0);
    directionalLight.position.set(0, 0, 0);
    this.scene.add(directionalLight);
  };
  cameras(){
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,1,10000);
    this.camera.position.set(0, 0, +5000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  };
  display(){
    // 星の移動
    if(Star.load){
      for (var i = 1; i < Star.planets.length; i++) {
        let s = Star.planets[i];
        s.rotate += s.rotateSpeed*0.002;
        s.instance.position.x = Math.sin(s.rotate)*s.rotateDistance + Star.planets[s.depend].instance.position.x;
        s.instance.position.z = Math.cos(s.rotate)*s.rotateDistance + Star.planets[s.depend].instance.position.z;
        s.instance.rotation.y += s.spin*0.05;
      };
    };
    // カメラ
    let vector = new THREE.Vector3();
    let camera = scene.camera;
    // 向き
    if(scene.cameraLotation == "l"){
      // 左回転 現在のカメラの向いている方向に +0.1
      camera.rotation.y = camera.rotation.y + 0.015;
    } else if(scene.cameraLotation == "r"){
      // 右回転 現在のカメラの向いている方向に -0.1
      camera.rotation.y = camera.rotation.y - 0.015;
    };
    let cameraDirection = camera.getWorldDirection( vector );
    // 移動
    camera.position.x = camera.position.x + cameraDirection.x*1;
    camera.position.y = camera.position.y + cameraDirection.y*1;
    camera.position.z = camera.position.z + cameraDirection.z*1;
    scene.renderer.render(scene.scene, scene.camera);
    requestAnimationFrame(scene.display);
  };
};

let scene = new Scene('space');
scene.render();
scene.cameras();
scene.display();

// イベントリスナーズ
scene.world.addEventListener("mousedown",function(e){
  scene.cameraStop = 1;
  scene.startMouse = e.offsetX;
});
scene.world.addEventListener("mouseup",function(e){
  scene.cameraStop = 0;
  scene.cameraLotation = "";
});
scene.world.addEventListener("mousemove",function(e){
  if(scene.cameraStop){
    if(e.offsetX > scene.startMouse){
      scene.cameraLotation = "r";
    } else {
      scene.cameraLotation = "l";
    };
  };
});

scene.world.addEventListener("touchstart",function(e){
  scene.startMouse = commonTouch(e,this);
  scene.cameraStop = 1;
});

scene.world.addEventListener("touchend",function(e){
  scene.cameraLotation = "";
  scene.cameraStop = 0;
});

scene.world.addEventListener("touchmove",function(e){
  let x = commonTouch(e,this);
  if(scene.cameraStop){
    if(x > scene.startMouse){
      scene.cameraLotation = "r";
    } else {
      scene.cameraLotation = "l";
    };
  };
});

let commonTouch = (e,ele) => {
  let touchObject = e.changedTouches[0] ;
	let touchX = touchObject.pageX ;
	let touchY = touchObject.pageY ;

	// 要素の位置を取得
	let clientRect = ele.getBoundingClientRect() ;
  let positionX = clientRect.left + window.pageXOffset ;
	let positionY = clientRect.top + window.pageYOffset ;

	// 要素内におけるタッチ位置を計算
	let tempX = touchX - positionX;
  let tempY = touchY - positionY;
  return tempX;
};
