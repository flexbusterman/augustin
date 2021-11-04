Array.prototype.choose = function () {
  return this[Math.floor(Math.random() * this.length)];
};
String.prototype.coin = function () {
  return parseFloat(this) > Math.random();
};

function freq(noteNumber) {
  return Math.pow(2, (noteNumber - 69) / 12) * 440;
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
