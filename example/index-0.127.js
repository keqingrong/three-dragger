var container, stats;
var camera, controls, scene, renderer;
var objects = [];
init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.add(new THREE.AmbientLight(0x505050));

  var light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  light.castShadow = true;
  light.shadow.camera.near = 1000;
  light.shadow.camera.far = 4000;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  scene.add(light);

  var geometry = new THREE.BoxGeometry(40, 40, 40);
  for (var i = 0; i < 200; i++) {
    var object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      })
    );
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600 - 300;
    object.position.z = Math.random() * 800 - 400;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.scale.z = Math.random() * 2 + 1;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    objects.push(object);
  }
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  var mouseDragger = new ThreeDragger([], camera, renderer.domElement);
  mouseDragger.on("dragstart", function (data) {
    console.log('dragstart');
  });
  mouseDragger.on("drag", function (data) {
    console.log('drag');
    const { target, position } = data;
    target.position.set(position.x, position.y, position.z);
  });
  mouseDragger.on("dragend", function (data) {
    console.log('dragend');
  });
  mouseDragger.update(objects);

  stats = new Stats();
  container.appendChild(stats.dom);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
