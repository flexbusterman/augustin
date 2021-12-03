const gui = new dat.GUI();
document.body.addEventListener("click", clicked, true);

function clicked(event) {
  let clickX =
    ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 2;
  let clickY =
    ((event.clientY - window.innerHeight / 2) / window.innerHeight) * 2;
  targets = originalPositions.map((item,i)=> {
    return item += Math.random() - 0.5 * 2
  })
  // timeline.to(meshObject.position.array, 1, { 0: targets[0], ease: Expo.easeOut });
  timeline.to(meshObject.position.array, 1, { 0: targets[0] });
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
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(20, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
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

// const plane = new THREE.Mesh(
// new THREE.PlaneGeometry(100, 100, 10, 10),
// new THREE.MeshStandardMaterial({
// color: 0xffffff,
// })
// );
// plane.castShadow = false;
// plane.receiveShadow = true;
// plane.rotation.x = -Math.PI / 2;
// plane.position.y = -0.5;
// scene.add(plane);

// gui.add(plane.position, "x", -5.0, 5.0, 0.1);
// gui.add(plane.position, "y", -5.0, 5.0, 0.1);
// gui.add(plane.position, "z", -5.0, 5.0, 0.1);

// buffergeometry test 1
// const geometry = new THREE.BufferGeometry();
// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
// const vertices = new Float32Array( [
// -1.0, -1.0,  1.0,
// 1.0, -1.0,  1.0,
// 1.0,  1.0,  1.0,

// 1.0,  1.0,  1.0,
// -1.0,  1.0,  1.0,
// -1.0, -1.0,  1.0
// ] );

// // itemSize = 3 because there are 3 values (components) per vertex
// geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// const mesh = new THREE.Mesh( geometry, material );

// const points = []
// points.push(new THREE.Vector3(-5, 0, 0))
// points.push(new THREE.Vector3(5, 0, 0))
// let geometry = new THREE.BufferGeometry().setFromPoints( points )
// let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }))
// scene.add(line)

// buffergeometry test 2
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
let geometry = new THREE.BufferGeometry();

// pyramid
let vectors = {
  a: new THREE.Vector3(1.0, 1.0, 1.0),
  b: new THREE.Vector3(-1.0, -1.0, 1.0),
  c: new THREE.Vector3(-1.0, 1.0, -1.0),
  d: new THREE.Vector3(1.0, -1.0, -1.0),
};

let points = [
  // new THREE.Vector3(-1, 1, -1), //c
  // new THREE.Vector3(-1, -1, 1), //b
  // new THREE.Vector3(1, 1, 1), //a
  vectors.c,
  vectors.b,
  vectors.a,

  // new THREE.Vector3(1, 1, 1), //a
  // new THREE.Vector3(1, -1, -1), //d
  // new THREE.Vector3(-1, 1, -1), //c
  vectors.a,
  vectors.d,
  vectors.c,

  // new THREE.Vector3(-1, -1, 1), //b
  // new THREE.Vector3(1, -1, -1), //d
  // new THREE.Vector3(1, 1, 1), //a
  vectors.b,
  vectors.d,
  vectors.a,

  // new THREE.Vector3(-1, 1, -1), //c
  // new THREE.Vector3(1, -1, -1), //d
  // new THREE.Vector3(-1, -1, 1), //b
  vectors.c,
  vectors.b,
  vectors.d,
];
//
//
// geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

geometry.setFromPoints(points);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// mesh.geometry.attributes.position.needsUpdate = true;

const meshObject = mesh.geometry.attributes;
const originalPositions = meshObject.position.array.slice()
let targets = originalPositions


// let x, y, z, index;
// x = y = z = index = 0;

// for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {

// positions[ index ++ ] = x;
// positions[ index ++ ] = y;
// positions[ index ++ ] = z;

// x += ( Math.random() - 0.5 ) * 30;
// y += ( Math.random() - 0.5 ) * 30;
// z += ( Math.random() - 0.5 ) * 30;

// }

// TODO: read
//https://threejs.org/docs/#manual/en/introduction/How-to-update-things

// const monolithGeometry = new THREE.BoxGeometry(0.5, 1, 0.2);
// const monolithMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0, wireframe: false, });
// const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
// scene.add(monolith);
// monolith.position.x = 2
// monolith.castShadow = true;

const ambient = new THREE.AmbientLight(0xffffff, 0.03); // soft white light
scene.add(ambient);

camera.position.z = 5;

let timeline = new TimelineMax();

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // for(i=0;i<meshObject.position.array.length;i++){
    // timeline.to(meshObject.position.array, 2, { 0: targets[i], ease: Expo.easeOut });
  // }
  // timeline.to(meshObject.position.array, 1, { 0: targets[0], ease: Expo.easeOut });
  mesh.geometry.attributes.position.needsUpdate = true; // required after the first render
};
animate();
