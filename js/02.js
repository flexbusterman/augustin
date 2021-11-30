const gui = new dat.GUI();
document.body.addEventListener("click", clicked, true);

function clicked(event) {
  let clickX =
    ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 2;
  let clickY =
    ((event.clientY - window.innerHeight / 2) / window.innerHeight) * 2;
  // plane.position.set(0,0,0)
  // plane.rotation
  // console.log(directionalLight);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// THREE.BasicShadowMap
// THREE.PCFShadowMap
// THREE.PCFSoftShadowMap
// THREE.VSMShadowMap
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.type = THREE.PCFShadowMap

document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(20, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500.0;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 20, 0);
controls.update();

// const planeGeometry = new THREE.PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
// width — Width along the X axis. Default is 1.  height — Height along the Y axis. Default is 1.  widthSegments — Optional. Default is 1.  heightSegments — Optional. Default is 1.

// const planeGeometry = new THREE.PlaneGeometry();
// const planeMaterial = new THREE.MeshStandardMaterial({
// color: 0xffffff,
// roughness: 1.0,
// wireframe: false,
// });

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 10, 10),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
  })
);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane);

gui.add(plane.position, "x", -1.0, 1.0);
gui.add(plane.position, "y", -1.0, 1.0);
gui.add(plane.position, "z", -1.0, 1.0);

// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.set(-Math.PI * 0.5, 0, 0);
// plane.position.set(0, -0.5, 0);
// plane.scale.set(10, 10, 1);
// scene.add(plane);

// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
// const pointlight = new THREE.PointLight(0xffffff, 2.0, 2, 1.0);
// pointlight.position.set(1,0.5,1)
// scene.add(pointlight);

const monolithGeometry = new THREE.BoxGeometry(0.5, 1, 0.2);
const monolithMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1.0,
  wireframe: false,
});
const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
// gui.add(monolith.position, 'x', -1.0, 1.0)
// gui.add(monolith.position, 'y', -1.0, 1.0)
// gui.add(monolith.position, 'z', -1.0, 1.0)
scene.add(monolith);
monolith.castShadow = true;

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.position.set(0.7, 0.5, 1.0);
// gui.add(directionalLight.position, "x", -1.0, 1.0, 0.1);
// gui.add(directionalLight.position, "y", -1.0, 1.0, 0.1);
// gui.add(directionalLight.position, "z", -1.0, 1.0, 0.1);
// gui.add(directionalLight.rotation, 'x', -1.0, 1.0)
// gui.add(directionalLight.rotation, 'y', -1.0, 1.0)
// gui.add(directionalLight.rotation, 'z', -1.0, 1.0)
// directionalLight.target = monolith;

const ambient = new THREE.AmbientLight(0xffffff, 0.01); // soft white light
scene.add(ambient);

camera.position.z = 3;

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
