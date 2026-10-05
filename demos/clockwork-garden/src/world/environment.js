import * as THREE from 'three';

// Image-based lighting for the metals. We build small procedural "light
// rooms" (a graded sky dome with glowing greenhouse windows) and prefilter
// them with PMREM. One map per mood; shots pick the one that suits them.

function envScene({ top, horizon, bottom, windows, windowColor, sun, sunColor, sunDir }) {
  const scene = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(50, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(top) },
        horizon: { value: new THREE.Color(horizon) },
        bottom: { value: new THREE.Color(bottom) },
        sunDir: { value: sunDir.clone().normalize() },
        sunColor: { value: new THREE.Color(sunColor).multiplyScalar(sun) },
      },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 top, horizon, bottom, sunColor, sunDir; varying vec3 vDir;
        void main(){
          float y = vDir.y;
          vec3 c = y > 0.0 ? mix(horizon, top, pow(y, 0.6)) : mix(horizon, bottom, pow(-y, 0.45));
          float s = max(dot(normalize(vDir), sunDir), 0.0);
          c += sunColor * (pow(s, 900.0) * 40.0 + pow(s, 12.0) * 0.6);
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  );
  scene.add(dome);
  // greenhouse panes: tall emissive rectangles around the horizon and a
  // bright arched roof strip – they give brass long, architectural highlights
  const winMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(windowColor).multiplyScalar(windows), side: THREE.DoubleSide });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.PlaneGeometry(9, 20), winMat);
    w.position.set(Math.cos(a) * 40, 6, Math.sin(a) * 40);
    w.lookAt(0, 6, 0);
    scene.add(w);
  }
  for (let i = 0; i < 7; i++) {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(80, 3), winMat);
    strip.position.set(0, 38, -30 + i * 10);
    strip.rotation.x = Math.PI / 2;
    scene.add(strip);
  }
  return scene;
}

const SUN_ENV = new THREE.Vector3(-0.35, 0.62, -0.6);
const MOODS = {
  night: { top: '#040c0f', horizon: '#173a3e', bottom: '#030605', windows: 1.3, windowColor: '#86b7b6', sun: 0.0, sunColor: '#9ec7c6' },
  dawn: { top: '#0e2a30', horizon: '#6a5a44', bottom: '#0b0d0a', windows: 0.9, windowColor: '#d9b27a', sun: 0.6, sunColor: '#ffcf8a' },
  gold: { top: '#3b5a5c', horizon: '#e1b577', bottom: '#1a150d', windows: 2.2, windowColor: '#ffdcaa', sun: 2.5, sunColor: '#ffd9a0' },
};

export function createEnvironments(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const maps = {};
  for (const [k, m] of Object.entries(MOODS)) {
    maps[k] = pmrem.fromScene(envScene({ ...m, sunDir: SUN_ENV }), 0.02).texture;
  }
  pmrem.dispose();
  return maps;
}

// Interactive modes: environment maps along the night → dawn → gold axis
// (k = 0, 0.5, 1 match the film's three moods), baked once and picked by
// the time-of-day control.
export function createEnvironmentRamp(renderer, steps = 9) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const col = (a, b, k) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();
  const mix = (a, b, k) => ({
    top: col(a.top, b.top, k), horizon: col(a.horizon, b.horizon, k), bottom: col(a.bottom, b.bottom, k),
    windows: a.windows + (b.windows - a.windows) * k, windowColor: col(a.windowColor, b.windowColor, k),
    sun: a.sun + (b.sun - a.sun) * k, sunColor: col(a.sunColor, b.sunColor, k),
  });
  const maps = [];
  for (let i = 0; i < steps; i++) {
    const k = i / (steps - 1);
    const m = k <= 0.5 ? mix(MOODS.night, MOODS.dawn, k * 2) : mix(MOODS.dawn, MOODS.gold, k * 2 - 1);
    const scene = envScene({ ...m, sunDir: SUN_ENV });
    maps.push(pmrem.fromScene(scene, 0.02).texture);
    scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  }
  pmrem.dispose();
  return maps;
}
