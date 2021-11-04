document.body.addEventListener("click", clicked, true);

function clicked(event) {
  let clickX =
    ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 2;
  let clickY =
    ((event.clientY - window.innerHeight / 2) / window.innerHeight) * 2;
  console.log([clickX, clickY]);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1.0,
  wireframe: false,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const ambient = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambient);
camera.position.z = 3;

const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x -= 0.003;
  cube.rotation.y += 0.002;
  renderer.render(scene, camera);
};
animate();
