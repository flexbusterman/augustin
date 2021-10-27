Array.prototype.choose = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const notes = [
  [16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01],
  [17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
  [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
  [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
  [20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
  [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
  [23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96],
  [24.5, 49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96],
  [25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44],
  [27.5, 55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0],
  [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
  [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07],
];
const degrees = [0, 2, 3, 5, 7, 9, 10];
const debug = false;
let pointLights = [];
let vibrato = {
  value: 0,
  amp: 2,
  direction: "up",
};
let freq = 1;
// let clock = new THREE.Clock();

window.addEventListener("resize", onWindowResize, false);
document.body.addEventListener("click", clicked, true);
// attackTime attackLevel decayTime decayLevel releaseTime releaseLevel
let env = new p5.Envelope(0.005, 0.2, 0.1, 0.2, 4.0, 0);
let triOsc = new p5.Oscillator("triangle");
let reverb = new p5.Reverb();
let polySynth = new p5.PolySynth();
// connect soundFile to reverb, process w/
// 3 second reverbTime, decayRate of 2%
reverb.process(triOsc, 3, 2);
reverb.process(polySynth, 4, 2);
reverb.drywet(1);
// polySynth.setADSR(0.005, 0.2, 0.1, 0.2, 1.0, 0)
function playChord() {
  let dur = 5;
  let time = 0;
  let vel = 0.005;
  polySynth.play(notes[degrees.choose()][[3]], vel, 0, dur);
  polySynth.play(notes[degrees.choose()][[3, 4].choose()], vel, 0, dur);
  polySynth.play(notes[degrees.choose()][[4, 5].choose()], vel, 0, dur);
}
setInterval(function () {
  playChord();
}, 5000);

// setInterval(function () {
// if([1,2,3].choose() == 1){
// polySynth.noteAttack()
// }
// }, 100);

setInterval(function () {
  if ([1, 2, 3, 4 ].choose() == 1) {
    // console.log(Math.random());
    polySynth.output.gain.value = Math.random()
  }
}, 50);

playChord();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function clicked(event) {
  let clickX =
    ((event.clientX - window.innerWidth / 2) / window.innerWidth) * 2;
  let clickY =
    ((event.clientY - window.innerHeight / 2) / window.innerHeight) * 2;
  triOsc.start();
  let octave = [2, 3, 4].choose();
  freq = notes[degrees.choose()][octave];
  env.setExp(true);
  env.play(triOsc);
  triOsc.freq(freq + vibrato.value);
  createLight(clickX, clickY);
  console.log(polySynth);
}

function createLight(x, y) {
  // console.log(x,y)
  // PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
  let light = new THREE.PointLight(0xffffff, 2.0, 2, 1.0);
  pointLights.push(light);
  pointLights[pointLights.length - 1].position.set(x, y - y * 2, 1);
  pointLights[pointLights.length - 1].intensity = 2.0;
  scene.add(pointLights[pointLights.length - 1]);
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
const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const cube = new THREE.Mesh(geometry, material);
// const ambientLight = new THREE.AmbientLight(0x040404); // soft white light
// const pointLight = new THREE.PointLight(0xffffff, 2, 50);
// pointLight.position.set(10, 10, 10);
// scene.add(ambientLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);
scene.add(cube);

camera.position.z = 3;

const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.002;
  cube.rotation.y += 0.003;
  renderer.render(scene, camera);
  pointLights.forEach(function (item, index, object) {
    item.intensity = item.intensity * 0.98 - 0.005;
    if (item.intensity <= 0.001) {
      scene.remove(item);
      object.splice(index, 1);
      // console.log("popped " + index)
    }
  });

  if (vibrato.direction == "up") {
    vibrato.value < vibrato.amp
      ? vibrato.value++
      : (vibrato.direction = "down");
  } else {
    vibrato.value > vibrato.amp - vibrato.amp * 2
      ? vibrato.value--
      : (vibrato.direction = "up");
  }

  triOsc.freq(freq + vibrato.value);
};
animate();

// Debug
if (debug == true) {
  const gui = new dat.GUI();
  gui.add(pointLight.position, "x", -5, 5, 0.1);
  gui.add(pointLight.position, "y", -5, 5, 0.1);
  gui.add(pointLight.position, "z", -5, 5, 0.1);
}
