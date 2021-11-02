Array.prototype.choose = function () {
  return this[Math.floor(Math.random() * this.length)];
};
String.prototype.coin = function () {
  return parseFloat(this) > Math.random();
};

function freq(noteNumber) {
  return Math.pow(2, (noteNumber - 69) / 12) * 440;
}

let root = 60 % 12;
const degrees = [0, 2, 3, 5, 7, 9, 10];
const debug = false;
let pointLights = [];
let vibrato = {
  value: 0,
  amp: 2,
  direction: "up",
};
let bassFreq = 1;
let noteCount = 0;

let sequence = {
  notes: [
    // degreeindex, adding (i.e. octave)
    [0, 12],
    [6, 0],
    [5, 0],
    [3, 0],
    [1, 0],
    [4, 0],
    [0, 12],
    [3, 12],
    [4, 12],
    [4, 12],
    [6, 12],
    [0, 24],
  ],
  count: 100,
  next: function () {
    // this.count >= this.notes.length ? (this.count = 1) : this.count++;
    // return this.notes[this.count - 1]
    this.count++;
    return (
      degrees[this.notes[this.count - 1][0]] + this.notes[this.count - 1][1]
    );
  },
};
// let clock = new THREE.Clock();

window.addEventListener("resize", onWindowResize, false);
document.body.addEventListener("click", clicked, true);
// document.body.requestFullscreen();
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
  polySynth.play(
    freq(degrees.choose() + root + [4].choose() * 12),
    vel,
    0,
    dur
  );
  polySynth.play(
    freq(degrees.choose() + root + [4, 5].choose() * 12),
    vel * 0.8,
    0,
    dur
  );
  polySynth.play(
    freq(degrees.choose() + root + [5, 6].choose() * 12),
    vel * 0.75,
    0,
    dur
  );
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
  if ("0.25".coin()) {
    polySynth.output.gainTarget = Math.random();
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

  if (sequence.count < sequence.notes.length) {
    bassFreq = freq(sequence.next() + 36);
    ambient.intensity = 0.015;
  } else {
    bassFreq = freq((root % 12) + [36, 48].choose() + degrees.choose());
    ambient.intensity = 0;
    // chance to initialize bass sequence
    if ("0.1".coin()) {
      sequence.count = 0;
    }
  }
  // console.log(bassFreq);
  // bassFreq = freq(sequence.next() + root + octave);
  env.setExp(true);
  let bassAmp = Math.log(500 / bassFreq) / 30 + 0.05;
  env.set(0.005, bassAmp, 0.1, bassAmp, 4.0, 0);
  env.play(triOsc);
  triOsc.freq(bassFreq + vibrato.value);
  createLight(clickX, clickY);
}

function createLight(x, y) {
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
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1.0,
  wireframe: false,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const ambient = new THREE.AmbientLight(0xffffff, 0.0); // soft white light
scene.add(ambient);
camera.position.z = 3;

const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x -= 0.003;
  cube.rotation.y += 0.002;
  renderer.render(scene, camera);
  pointLights.forEach(function (item, index, object) {
    item.intensity = item.intensity * 0.99 - 0.002;
    if (item.intensity <= 0.001) {
      scene.remove(item);
      object.splice(index, 1);
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

  polySynth.output.gain.value > polySynth.output.gainTarget
    ? (polySynth.output.gain.value -= 0.01)
    : (polySynth.output.gain.value += 0.01);
  triOsc.freq(bassFreq + vibrato.value);
};
animate();

// Debug
if (debug == true) {
  const gui = new dat.GUI();
  gui.add(pointLight.position, "x", -5, 5, 0.1);
  gui.add(pointLight.position, "y", -5, 5, 0.1);
  gui.add(pointLight.position, "z", -5, 5, 0.1);
}
