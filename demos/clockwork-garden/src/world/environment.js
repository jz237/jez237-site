import * as THREE from 'three';

// Image-based lighting for the metals. We build small procedural "light
// rooms" (a graded sky dome with glowing greenhouse windows) and prefilter
// them with PMREM. One map per mood; shots pick the one that suits them.
//
// A photographed sky (materials/scans.js: an HDRI, stored as its structure
// within each band of elevation, 1 = the band's mean) gives the dome real
// detail: clouds, branches, glazing bars. The mood still sets the colour and
// the brightness of every band; the photo only says what lies within it.

const PHOTO = { tex: null, k: 1, chroma: 0.3, rot: 0, contrast: 1.3, windows: 0.35 };

export function setEnvPhoto(img, { k = 1, chroma = 0.3, rot = 0, contrast = 1.3, windows = 0.35 } = {}) {
  const t = new THREE.Texture(img);
  t.colorSpace = THREE.NoColorSpace;
  // (no mipmaps: the seam where the longitude wraps would pick a tiny one)
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearFilter;
  t.wrapS = THREE.RepeatWrapping;
  t.needsUpdate = true;
  Object.assign(PHOTO, { tex: t, k, chroma, rot, contrast, windows });
}
export const envPhoto = () => PHOTO.tex;

function envScene({ top, horizon, bottom, windows, windowColor, sun, sunColor, sunDir }) {
  const scene = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(50, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      defines: PHOTO.tex ? { CG_PHOTO: 1 } : {},
      uniforms: {
        top: { value: new THREE.Color(top) },
        horizon: { value: new THREE.Color(horizon) },
        bottom: { value: new THREE.Color(bottom) },
        sunDir: { value: sunDir.clone().normalize() },
        sunColor: { value: new THREE.Color(sunColor).multiplyScalar(sun) },
        photo: { value: PHOTO.tex },
        photoK: { value: new THREE.Vector4(PHOTO.k, PHOTO.chroma, PHOTO.rot, PHOTO.contrast) },
      },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 top, horizon, bottom, sunColor, sunDir; varying vec3 vDir;
        uniform sampler2D photo; uniform vec4 photoK;
        void main(){
          float y = vDir.y;
          vec3 c = y > 0.0 ? mix(horizon, top, pow(y, 0.6)) : mix(horizon, bottom, pow(-y, 0.45));
          #ifdef CG_PHOTO
          {
            vec3 d = normalize(vDir);
            vec2 uv = vec2(atan(d.z, d.x) * 0.15915494 + 0.5 + photoK.z, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5);
            vec3 p = pow(texture2D(photo, uv).rgb, vec3(2.2)) * 4.0;
            float l = dot(p, vec3(0.2126, 0.7152, 0.0722));
            c *= mix(1.0, pow(l, photoK.w), photoK.x) * mix(vec3(1.0), p / max(l, 1e-3), photoK.y);
          }
          #endif
          float s = max(dot(normalize(vDir), sunDir), 0.0);
          c += sunColor * (pow(s, 900.0) * 40.0 + pow(s, 12.0) * 0.6);
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  );
  scene.add(dome);
  // greenhouse panes: tall emissive rectangles around the horizon and a
  // bright arched roof strip – they give brass long, architectural highlights
  // (fainter under a photographed sky: it has glazing of its own)
  const winMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(windowColor).multiplyScalar(windows * (PHOTO.tex ? PHOTO.windows : 1)), side: THREE.DoubleSide });
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

// (each map keeps its target, so a rebuild can free it)
function bake(pmrem, mood) {
  const scene = envScene({ ...mood, sunDir: SUN_ENV });
  const rt = pmrem.fromScene(scene, 0.02);
  scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  rt.texture.userData.rt = rt;
  return rt.texture;
}

export function createEnvironments(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const maps = {};
  for (const [k, m] of Object.entries(MOODS)) maps[k] = bake(pmrem, m);
  pmrem.dispose();
  return maps;
}

// once the photographed sky has arrived: bake the film's maps (an object)
// or the ramp (an array) again in place; returns [old, new] pairs, for
// whoever holds the old ones, and frees them on the next call of `free`
export function rebakeEnvironments(renderer, maps) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const swaps = [];
  const ramp = Array.isArray(maps);
  for (const k of ramp ? maps.map((_, i) => i) : Object.keys(maps)) {
    const mood = ramp ? moodAt(maps.tods[k]) : MOODS[k];
    const old = maps[k];
    maps[k] = bake(pmrem, mood);
    swaps.push([old, maps[k]]);
  }
  pmrem.dispose();
  return { swaps, free: () => swaps.forEach(([o]) => o.userData.rt?.dispose()) };
}

// Interactive modes: environment maps along the time-of-day axis, keyed at
// midnight (0, the film's night), dusk (0.27, blue hour), dawn (0.5, the
// film's dawn) and golden hour (1, the film's gold), baked once at the hours
// in RAMP_TODS (the slider's stops are among them). The light-field patch
// blends the two maps either side of the hour (world/lightfield.js), so the
// hour slides without stepping.
const DUSK = { top: '#081630', horizon: '#33365a', bottom: '#040609', windows: 1.05, windowColor: '#7d93c4', sun: 0.08, sunColor: '#ffb27a' };
const KEYS = [[0, MOODS.night], [0.27, DUSK], [0.5, MOODS.dawn], [1, MOODS.gold]];
export const RAMP_TODS = [0, 0.135, 0.27, 0.385, 0.5, 0.62, 0.74, 0.86, 1];

export function moodAt(tod) {
  const col = (a, b, k) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();
  const mix = (a, b, k) => ({
    top: col(a.top, b.top, k), horizon: col(a.horizon, b.horizon, k), bottom: col(a.bottom, b.bottom, k),
    windows: a.windows + (b.windows - a.windows) * k, windowColor: col(a.windowColor, b.windowColor, k),
    sun: a.sun + (b.sun - a.sun) * k, sunColor: col(a.sunColor, b.sunColor, k),
  });
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [ta, a] = KEYS[i], [tb, b] = KEYS[i + 1];
    if (tod <= tb) return mix(a, b, Math.max(0, (tod - ta) / (tb - ta)));
  }
  return mix(MOODS.gold, MOODS.gold, 0);
}

export function createEnvironmentRamp(renderer, tods = RAMP_TODS) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const maps = [];
  for (const k of tods) maps.push(bake(pmrem, moodAt(k)));
  maps.tods = tods;
  pmrem.dispose();
  return maps;
}
