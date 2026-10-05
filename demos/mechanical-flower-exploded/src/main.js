import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildAssembly, makeCamera, poseCamera } from './assembly.js';
import { createBackdrop } from './backdrop.js';
import { initUI } from './ui.js';
import { CAMERA } from './layout.js';
import { POSTER } from './spec.js';
import { clamp01, easeInOut } from './geo.js';
const smooth01 = (x) => { const c = clamp01(x); return c * c * (3 - 2 * c); };

const poster = document.getElementById('poster');
const canvas = document.getElementById('stage');
const params = new URLSearchParams(location.search);
const maxDpr = +(params.get('dpr') || 2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.autoClear = true;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.6;

const key = new THREE.DirectionalLight(0xfff0dc, 1.3);
key.position.set(-22, 40, 60);
const fill = new THREE.DirectionalLight(0xcfe0ff, 0.5);
fill.position.set(30, 10, 40);
scene.add(key, fill);

const camera = makeCamera();
const backdrop = createBackdrop();
scene.add(backdrop.mesh);

const asm = buildAssembly(camera);
scene.add(asm.root);

const composer = new EffectComposer(
  renderer,
  new THREE.WebGLRenderTarget(POSTER.w, POSTER.h, { type: THREE.HalfFloatType, samples: 4 }),
);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(POSTER.w, POSTER.h), 0.18, 0.45, 0.95);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const controls = new OrbitControls(camera, canvas);
controls.target.set(...CAMERA.target);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minPolarAngle = 0.25 * Math.PI;
controls.maxPolarAngle = 0.62 * Math.PI;
controls.minAzimuthAngle = -0.9;
controls.maxAzimuthAngle = 0.9;
controls.update();

// ---- framing: pulled-in 3/4 view when assembled, full poster view when exploded ----
const D2R = Math.PI / 180;
const FRAME_ASM = { target: new THREE.Vector3(1.0, -4.6, 0), dist: 70, elev: 29 };
const FRAME_EXP = { target: new THREE.Vector3(...CAMERA.target), dist: CAMERA.dist, elev: CAMERA.elevDeg };
const frameFor = (e) => {
  const s = e * e * (3 - 2 * e);
  return {
    target: FRAME_ASM.target.clone().lerp(FRAME_EXP.target, s),
    dist: FRAME_ASM.dist + (FRAME_EXP.dist - FRAME_ASM.dist) * s,
    elev: FRAME_ASM.elev + (FRAME_EXP.elev - FRAME_ASM.elev) * s,
  };
};
let base = frameFor(1);
const sph = new THREE.Spherical();
const off = new THREE.Vector3();
function followFraming(e) {
  const nf = frameFor(e);
  off.copy(camera.position).sub(controls.target);
  sph.setFromVector3(off);
  const zoom = sph.radius / base.dist;
  const phiDelta = sph.phi - (Math.PI / 2 - base.elev * D2R);
  sph.radius = nf.dist * zoom;
  sph.phi = Math.PI / 2 - nf.elev * D2R + phiDelta;
  controls.target.copy(nf.target);
  camera.position.copy(nf.target).add(off.setFromSpherical(sph));
  controls.minDistance = nf.dist * 0.45;
  controls.maxDistance = nf.dist * 1.45;
  base = nf;
}
function snapFraming(e) {
  const nf = frameFor(e);
  poseCamera(camera, { target: [nf.target.x, nf.target.y, nf.target.z], dist: nf.dist, elev: nf.elev });
  controls.target.copy(nf.target);
  controls.minDistance = nf.dist * 0.45;
  controls.maxDistance = nf.dist * 1.45;
  base = nf;
}

// ---- timeline ----
const CYCLE = 28;
const timeline = (c) => {
  const seg = (t0, t1) => easeInOut(clamp01((c - t0) / (t1 - t0)));
  let e = 1;
  let b = 1;
  if (c < 4) { e = 1; b = 1; }
  else if (c < 7) { b = 1 - seg(4, 7); }
  else if (c < 11) { b = 0; e = 1 - seg(7, 11); }
  else if (c < 12) { b = 0; e = 0; }
  else if (c < 16) { e = 0; b = seg(12, 16); }
  else if (c < 18) { e = 0; b = 1; }
  else if (c < 22) { b = 1; e = seg(18, 22); }
  return { e, b };
};
const nearestCycleTime = (e, b) => {
  let best = 0;
  let bd = Infinity;
  for (let c = 0; c < CYCLE; c += 0.05) {
    const s = timeline(c);
    const d = (s.e - e) ** 2 + (s.b - b) ** 2 + (c > 22 ? 0.0004 : 0);
    if (d < bd) { bd = d; best = c; }
  }
  return best;
};

const S = { e: 1, b: 1, cycle: 0, time: 0, playing: true, theme: 'poster', frozen: false, dirty: true };

const api = {
  setExplode: (v) => { S.e = clamp01(v); },
  setBloom: (v) => { S.b = clamp01(v); },
  setPlaying: (on) => {
    on = !!on;
    if (on && !S.playing) S.cycle = nearestCycleTime(S.e, S.b);
    S.playing = on;
  },
  setTheme: (name) => setTheme(name),
  getState: () => ({ explode: S.e, bloom: S.b, playing: S.playing, theme: S.theme }),
};
const ui = initUI(api);

function setTheme(name) {
  S.theme = name === 'studio' ? 'studio' : 'poster';
  poster.dataset.theme = S.theme;
}
// the paper darkens to the charcoal studio as the flower assembles, like the reference photo
function applyTone(e) {
  const t = S.theme === 'studio' ? 1 : 1 - smooth01((e - 0.12) / 0.55);
  backdrop.setMix(t);
  const dark = t > 0.5 ? 'dark' : 'light';
  if (poster.dataset.tone !== dark) poster.dataset.tone = dark;
}

// ---- sizing ----
let cssW = 0;
let cssH = 0;
function resize() {
  const r = poster.getBoundingClientRect();
  const w = Math.max(2, Math.round(r.width));
  const h = Math.max(2, Math.round(r.height));
  if (w === cssW && h === cssH) return;
  cssW = w;
  cssH = h;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  composer.setPixelRatio(dpr);
  composer.setSize(w, h);
  ui.relayout();
}
new ResizeObserver(resize).observe(poster);
resize();

// ---- insets ----
const insetCam = new THREE.PerspectiveCamera(35, 159 / 140, 0.1, 200);
const INSET_BG = { core: 0x15110e, gear: 0x15110e, enamel: 0x15110e };
const _clear = new THREE.Color();
function renderInsets() {
  const rects = ui.insetRects();
  const names = Object.keys(rects);
  const saved = asm.root.children.map((c) => c.visible);
  const bd = backdrop.mesh.visible;
  const prevAuto = renderer.autoClear;
  const prevClear = renderer.getClearColor(_clear).getHex();
  const prevAlpha = renderer.getClearAlpha();
  backdrop.mesh.visible = false;
  renderer.autoClear = false;
  renderer.setScissorTest(true);
  for (const name of names) {
    const rc = rects[name];
    const keep = new Set(asm.insetKeep(name));
    asm.root.children.forEach((c) => { c.visible = keep.has(c); });
    const pose = asm.insetPose(name);
    insetCam.fov = pose.fov;
    insetCam.aspect = rc.w / rc.h;
    insetCam.position.copy(pose.pos);
    insetCam.up.copy(pose.up);
    insetCam.lookAt(pose.target);
    insetCam.updateProjectionMatrix();
    insetCam.updateMatrixWorld(true);
    const x = Math.round(rc.x * cssW);
    const w = Math.round(rc.w * cssW);
    const h = Math.round(rc.h * cssH);
    const y = Math.round(cssH - (rc.y + rc.h) * cssH);
    renderer.setViewport(x, y, w, h);
    renderer.setScissor(x, y, w, h);
    renderer.setClearColor(INSET_BG[name] ?? 0x15110e, 1);
    renderer.clear(true, true, false);
    renderer.render(scene, insetCam);
  }
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, cssW, cssH);
  renderer.setClearColor(prevClear, prevAlpha);
  renderer.autoClear = prevAuto;
  backdrop.mesh.visible = bd;
  asm.root.children.forEach((c, i) => { c.visible = saved[i]; });
}

// ---- frame ----
function drawFrame(follow = true) {
  applyTone(S.e);
  asm.update(S.e, S.b, S.time);
  if (follow) followFraming(S.e);
  controls.update();
  camera.updateMatrixWorld(true);
  composer.render();
  renderInsets();
  ui.frame({ explode: S.e, bloom: S.b, anchors: asm.projectAnchors(camera), playing: S.playing });
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!S.frozen) {
    S.time += dt;
    if (S.playing) {
      S.cycle = (S.cycle + dt) % CYCLE;
      const s = timeline(S.cycle);
      S.e = s.e;
      S.b = s.b;
    }
  }
  drawFrame();
  if (!window.__flowerReady) {
    window.__flowerReady = true;
    window.dispatchEvent(new Event('flower:ready'));
  }
  requestAnimationFrame(loop);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) S.playing = false;
canvas.addEventListener('dblclick', () => {
  snapFraming(S.e);
  controls.update();
});

// ---- capture / debug API ----
window.__flower = {
  renderAt({ explode = 1, bloom = 1, time = 0, theme, view = 'poster' } = {}) {
    S.frozen = true;
    S.playing = false;
    S.e = explode;
    S.b = bloom;
    S.time = time;
    if (theme) setTheme(theme);
    let follow = false;
    if (view === 'poster') {
      snapFraming(explode);
    } else if (view === 'wide') {
      poseCamera(camera);
      controls.target.set(...CAMERA.target);
    } else if (view && view.pos) {
      camera.position.set(...view.pos);
      controls.target.set(...view.target);
      camera.fov = view.fov ?? CAMERA.fov;
      camera.updateProjectionMatrix();
    }
    controls.update();
    drawFrame(follow);
  },
  setExplode: api.setExplode,
  setBloom: api.setBloom,
  setPlaying: api.setPlaying,
  setTheme,
  screenAnchors: () => asm.projectAnchors(camera),
  screwPixels: () => {
    camera.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    return asm.screws.specs.map((s) => {
      s.owner.localToWorld(v.copy(s.local)).addScaledVector(s.axis, s.pull).project(camera);
      return [Math.round((v.x + 1) / 2 * cssW), Math.round((1 - v.y) / 2 * cssH)];
    });
  },
  stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geos: renderer.info.memory.geometries, tex: renderer.info.memory.textures }),
  size: () => ({ cssW, cssH, dpr: renderer.getPixelRatio() }),
};

requestAnimationFrame(loop);
