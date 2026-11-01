import * as THREE from 'three';
import { TIERS, detectTier } from './quality.js?v=5';
import { Particles } from './particles.js?v=5';
import { Lights } from './lights.js?v=5';
import { Smoke } from './smoke.js?v=5';
import { World } from './world.js?v=5';
import { Post } from './post.js?v=5';
import { Fireworks } from './fireworks.js?v=5';
import { Show } from './show.js?v=5';
import { AudioEngine } from './audio.js?v=5';
import { CameraRig, Director } from './camera.js?v=5';
import { CAMERAS } from './site.js?v=5';
import { SHELL_NAMES } from './shells.js?v=5';
import { Crowd } from './crowd.js?v=5';
import { Workshop } from './workshop.js?v=5';

const Q = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const canvas = $('gl');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true, preserveDrawingBuffer: Q.has('capture') });
  if (!renderer.capabilities.isWebGL2) throw new Error('no webgl2');
} catch (e) {
  $('fail').style.display = 'flex';
  throw e;
}
renderer.autoClear = false;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const tierKey = detectTier(renderer.getContext());
const tier = { ...TIERS[tierKey], key: tierKey };

const camera = new THREE.PerspectiveCamera(46, 1, 0.5, 16000);
camera.layers.enable(1);
camera.layers.enable(2);
const reflCam = new THREE.PerspectiveCamera(46, 1, 0.5, 16000);

const lights = new Lights();
const particles = new Particles(tier);
const smoke = new Smoke(tier, lights, particles.uniforms.uWind);
const world = new World(tier, lights, renderer);
const crowd = new Crowd(tier, world, lights);
const post = new Post(renderer, tier, lights);
post.bloomK = 0.42;
const audio = new AudioEngine('./audio/');
const wind = [2.2, 0, -0.7];
const fw = new Fireworks({ particles, smoke, lights, audio, tier, wind });
const show = new Show(fw, world, audio);
const rig = new CameraRig(camera);
const director = new Director(rig, fw, $('fade'), world);

// one scene: sky, far world and fireworks on layer 0 (seen in the water too),
// the near bank and the people on layer 1 (main view only)
const scene = new THREE.Scene();
const skyMesh = world.sky.children[0];
skyMesh.renderOrder = -1000;
scene.add(skyMesh);
for (const o of [...world.far.children]) scene.add(o);
for (const o of [...world.near.children]) { o.traverse(c => c.layers.set(1)); scene.add(o); }
crowd.group.traverse(c => c.layers.set(1));
scene.add(crowd.group);
particles.uniforms.uGain.value = 400;
const fxGroup = particles.scene;
scene.add(fxGroup);

// ------------------------------------------------------------------ state
const state = {
  t: Q.has('t') ? 0 : 0,
  scale: 1,
  slow: false,
  long: false,
  paused: Q.has('pause'),
  shell: 'random',
  renderScale: 1,
  lastCaption: -10,
  frames: 0, fpsT: 0, fps: 0, ms: 0,
  hintUntil: 9,
};

const camIndex = Math.max(0, CAMERAS.findIndex(c => c.id === Q.get('cam')));
rig.set(camIndex, true);
if (Q.has('cam')) director.on = false;
rig.update(0, innerWidth / innerHeight);
// a new programme every visit (pin one with ?seed=), announced by caption
show.seed = Number(Q.get('seed')) || 1 + Math.floor(Math.random() * 999999);
function caption(small, text, ms = 3800) {
  const el = $('caption');
  el.innerHTML = `<small>${small}</small>${text}`;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}
show.onProgram = (s) => {
  if (workshop && workshop.on) return;
  state.lastCaption = state.t + 2;
  caption(`Programme ${s.number} · ${s.theme.name}`, `on ${s.weather.name}`, 5200);
};
let workshop = null;
show.begin(0, show.seed);

workshop = new Workshop({
  fw, world, smoke, rig, camera, getTime: () => state.t,
  onToggle: (on) => {
    document.body.classList.toggle('ws', on);
    if (show.on === on) show.setOn(!on, state.t);
    $('autoBtn').classList.toggle('on', show.on);
    picker.classList.remove('show');
    $('shellBtn').classList.remove('on');
    labels();
    layout();
  },
});

fw.onBreak = (info) => {
  workshop.noteBreak(info);
  if (info.inches >= 4 && state.t - state.lastCaption > 1.3 && info.caption) {
    state.lastCaption = state.t;
    caption(`${info.inches}-inch shell`, info.caption);
  }
  if (info.manual && info.inches >= 8 && Math.random() < 0.7) audio.crowd(Math.random() < 0.5 ? 'ooh' : 'wow', info.t + 0.4, 0.8);
};

// ------------------------------------------------------------------ sizing
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, tier.dpr) * state.renderScale;
  const w = Math.max(2, Math.floor(innerWidth * dpr)), h = Math.max(2, Math.floor(innerHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    renderer.setSize(w, h, false);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  post.setSize(w, h);
}
function layout() {
  document.documentElement.style.setProperty('--barH', $('bar').getBoundingClientRect().height + 'px');
}
addEventListener('resize', () => { resize(); labels(); layout(); });
resize();
layout();
setTimeout(() => { if (innerWidth <= 760) $('title').classList.add('faded'); }, 12000);

// ------------------------------------------------------------------ passes
const tmpV = new THREE.Vector3();
function setFxPass(cam, w, h) {
  const focal = world.setPass(cam, w, h);
  particles.uniforms.uFocal.value = focal;
  particles.uniforms.uRes.value.set(w, h);
}

function updateReflCam() {
  reflCam.fov = camera.fov; reflCam.aspect = camera.aspect; reflCam.near = camera.near; reflCam.far = camera.far;
  reflCam.position.set(camera.position.x, -camera.position.y, camera.position.z);
  const f = tmpV.set(0, 0, -1).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  reflCam.up.set(up.x, -up.y, up.z);
  reflCam.lookAt(camera.position.x + f.x, -(camera.position.y + f.y), camera.position.z + f.z);
  reflCam.updateProjectionMatrix();
  reflCam.updateMatrixWorld(true);
  reflCam.layers.set(0);
}

function render(dt) {
  const w = canvas.width, h = canvas.height;
  if (innerWidth < 4 || innerHeight < 4) return;
  // mirrored pass for the water
  updateReflCam();
  const R = post.refl;
  setFxPass(reflCam, R.width, R.height);
  smoke.uniforms.uSoft.value = 0;
  renderer.setRenderTarget(R);
  renderer.setClearColor(0x000000, 1);
  renderer.clear();
  for (const g of particles.groups) if (g.sparks) g.sparks.visible = tier.sparksInReflection;
  renderer.render(scene, reflCam);
  renderer.render(smoke.scene, reflCam);
  for (const g of particles.groups) if (g.sparks) g.sparks.visible = true;
  world.waterU.uRefl.value = R.texture;
  world.waterU.uReflVP.value.multiplyMatrices(reflCam.projectionMatrix, reflCam.matrixWorldInverse);

  // main view
  setFxPass(camera, w, h);
  crowd.setScreen(post.scene2.texture);
  renderer.setRenderTarget(post.hdr);
  renderer.clear();
  renderer.render(scene, camera);

  // smoke at reduced resolution, softened against the scene depth
  const S = post.smoke;
  smoke.uniforms.uSoft.value = 25;
  smoke.uniforms.uDepth.value = post.hdr.depthTexture;
  smoke.uniforms.uTarget.value.set(S.width, S.height);
  smoke.uniforms.uNF.value.set(camera.near, camera.far);
  renderer.setRenderTarget(S);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  if (!Q.has('nosmoke')) renderer.render(smoke.scene, camera);
  renderer.setClearColor(0x000000, 1);

  post.composite(camera, !Q.has('nosmoke'));
  post.finish(state.t, dt);
}

// ------------------------------------------------------------------ loop
function step(dt) {
  const sdt = state.paused ? 0 : dt * state.scale;
  state.t += sdt;
  const t = state.t;
  const W = show.weather || { wind: 2.2, clouds: 1, haze: 1e-4 };
  let wx = W.wind * (0.85 + 0.25 * Math.sin(t * 0.011 + 1)), wz = -W.wind * 0.3 + 0.5 * Math.sin(t * 0.017);
  const ease = Math.min(1, dt * 0.12);
  world.skyU.uClouds.value += (W.clouds - world.skyU.uClouds.value) * ease;
  lights.uniforms.uHaze.value += (W.haze - lights.uniforms.uHaze.value) * ease;
  if (workshop.on) { const w = workshop.wind(); wx = w * 0.94 + Math.min(w, 1.5) * 0.15 * Math.sin(t * 0.6); wz = -w * 0.34; }
  // ease toward it so drifting smoke and falling stars never jump
  const k = Math.min(1, sdt * 0.25);
  wind[0] += Math.max(-k, Math.min(k, wx - wind[0]));
  wind[2] += Math.max(-k, Math.min(k, wz - wind[2]));
  particles.uniforms.uWind.value.set(wind[0], wind[1], wind[2]);
  show.update(t);
  fw.update(t);
  particles.update(t);
  smoke.update(t);
  lights.update(t);
  world.update(t, camera);
  crowd.update(t);
  workshop.update(t);
  director.update(t, show.actKey(t), show.on && !workshop.on);
  $('act').textContent = workshop.on ? 'Workshop' : show.on ? `${show.act(t)} · ${show.theme.name}` : 'Free launch';
}

let last = performance.now();
let acc = 0, accN = 0;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (window.__manual) return;
  rig.update(dt, innerWidth / innerHeight);
  audio.frame(state.t, state.paused ? 0 : state.scale, camera.position.toArray(), rig.right.toArray());
  step(dt);
  render(dt);
  perf(dt, now);
}

function perf(dt, now) {
  state.frames++;
  acc += dt; accN++;
  if (now - state.fpsT > 1000) {
    state.fps = state.frames * 1000 / (now - state.fpsT);
    state.fpsT = now;
    state.frames = 0;
    const avg = acc / accN;
    acc = 0; accN = 0;
    // resolution scaler: hold the frame rate, then sharpen when there is room
    if (!Q.has('fixed')) {
      const old = state.renderScale;
      if (avg > 1 / 50) state.renderScale = Math.max(0.5, state.renderScale * 0.88);
      else if (avg < 1 / 58 && state.renderScale < 1) state.renderScale = Math.min(1, state.renderScale * 1.04);
      if (Math.abs(old - state.renderScale) > 0.01) resize();
    }
    if (Q.has('stats')) {
      $('stats').style.display = 'block';
      $('stats').textContent = `${state.fps.toFixed(0)} fps  ${(avg * 1000).toFixed(1)} ms\ntier ${tier.name}  scale ${state.renderScale.toFixed(2)}  ${canvas.width}x${canvas.height}\nstars ${particles.liveStars}  groups ${particles.groups.length}\nlights ${lights.uniforms.uLN.value}/${lights.list.length}  t ${state.t.toFixed(1)}`;
    }
  }
  if (state.t > state.hintUntil) $('hint').classList.add('hide');
}

// ------------------------------------------------------------------ input
const pointers = new Map();
let drag = null, pinch = null;
canvas.addEventListener('pointerdown', (e) => {
  audioUnlock();
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false };
  else if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); drag = null; }
});
canvas.addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    rig.zoomBy(d / pinch);
    takeCamera();
    pinch = d;
    return;
  }
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 7) drag.moved = true;
  if (drag.moved) {
    takeCamera();
    const k = camera.fov * Math.PI / 180 / innerHeight;
    rig.look(dx * k, dy * k);
  }
  drag.x = e.clientX; drag.y = e.clientY;
});
const endPointer = (e) => {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (drag && !drag.moved && performance.now() - drag.t < 600 && e.type === 'pointerup') tapLaunch(e.clientX, e.clientY);
  drag = null;
};
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('wheel', (e) => { e.preventDefault(); takeCamera(); rig.zoomBy(Math.exp(-e.deltaY * 0.0012)); }, { passive: false });

function tapLaunch(x, y) {
  const ndcX = x / innerWidth * 2 - 1, ndcY = -(y / innerHeight) * 2 + 1;
  const target = rig.aimAt(ndcX, ndcY);
  if (!target) return;
  if (workshop.on) workshop.tap(target);
  else launchChoice(target);
}

const MANUAL = ['peony', 'chrysanthemum', 'pistil', 'dahlia', 'ghost', 'confetti', 'glittertips', 'willow', 'kamuro', 'diadem', 'brocade', 'palm', 'horsetail', 'leaves', 'snowfall', 'ring', 'saturn', 'crossette', 'strobe', 'crackle', 'glitter', 'spider', 'salute', 'multibreak', 'heart', 'smiley', 'starshape', 'butterfly', 'flower', 'spiral', 'clover', 'crescent', 'rings', 'cube'];
function launchChoice(target) {
  const t = state.t;
  let kind = state.shell;
  if (kind === 'random') kind = MANUAL[Math.floor(Math.random() * MANUAL.length)];
  const barge = fw.nearestBarge(target ? target[0] : -45);
  if (kind === 'fan') return fw.fan({ t, barge, n: 9, spread: 0.6, kind: Math.random() < 0.5 ? 'gold' : 'silver' });
  if (kind === 'mine') return fw.mine({ t, barge });
  if (kind === 'waterfall') return fw.waterfall({ t0: t, t1: t + 25, gold: Math.random() < 0.3 }, world);
  const alt = target ? target[1] : 200;
  const inches = Math.max(3, Math.min(12, Math.round(alt / 32)));
  fw.launchShell({ t, type: kind, inches, barge, target, manual: true });
}

addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  audioUnlock();
  const k = e.key.toLowerCase();
  if (k >= '1' && k <= '5') { takeCamera(); setView(Number(k) - 1); }
  else if (k === 'c') $('camBtn').click();
  else if (k === ' ') { e.preventDefault(); if (workshop.on) workshop.fire(); else launchChoice(null); }
  else if (k === 'w') $('labBtn').click();
  else if (k === 'f') $('finaleBtn').click();
  else if (k === 'l') $('longBtn').click();
  else if (k === 's') $('slowBtn').click();
  else if (k === 'm') $('soundBtn').click();
  else if (k === 'p') state.paused = !state.paused;
});

// ------------------------------------------------------------------ UI
const LABELS = {};
function setLabel(id, long, short = long) { LABELS[id] = [long, short]; $(id).textContent = innerWidth <= 760 ? short : long; }
function labels() { for (const id in LABELS) $(id).textContent = innerWidth <= 760 ? LABELS[id][1] : LABELS[id][0]; }
function setView(i) {
  rig.set(i);
  setLabel('viewBtn', 'View: ' + rig.preset.name, rig.preset.name);
}
$('viewBtn').onclick = () => { takeCamera(); setView(rig.index + 1); };
// Auto camera follows the show until the viewer drags, zooms or picks a view.
function camLabel() {
  setLabel('camBtn', director.on ? 'Auto camera' : 'Auto camera: Off', director.on ? 'Auto cam' : 'Cam off');
  $('camBtn').classList.toggle('on', director.on);
}
function takeCamera() {
  if (!director.on) return;
  director.setOn(false);
  camLabel();
}
$('camBtn').onclick = () => { director.setOn(!director.on); camLabel(); };
director.onCut = () => setLabel('viewBtn', 'View: ' + rig.preset.name, rig.preset.name);
$('autoBtn').onclick = () => {
  show.setOn(!show.on, state.t);
  $('autoBtn').classList.toggle('on', show.on);
  setLabel('autoBtn', show.on ? 'Auto show' : 'Show paused', show.on ? 'Auto' : 'Paused');
};
$('finaleBtn').onclick = () => {
  if (!show.on) $('autoBtn').click();
  show.finale(state.t);
};
$('slowBtn').onclick = () => {
  state.slow = !state.slow;
  state.scale = state.slow ? 0.28 : 1;
  $('slowBtn').classList.toggle('on', state.slow);
};
$('longBtn').onclick = () => {
  state.long = !state.long;
  particles.setLongExposure(state.long);
  particles.uniforms.uTrail.value = state.long ? 1.6 : 0.085;
  $('longBtn').classList.toggle('on', state.long);
};
$('soundBtn').onclick = () => {
  audio.setEnabled(!audio.enabled);
  $('soundBtn').classList.toggle('on', audio.enabled);
  setLabel('soundBtn', audio.enabled ? 'Sound: On' : 'Sound: Off', audio.enabled ? 'Sound' : 'Muted');
};
$('photoBtn').onclick = () => {
  render(0);
  canvas.toBlob((b) => {
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `harbour-nocturne-${Math.round(state.t)}s.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
};
$('labBtn').onclick = () => {
  workshop.setOn(!workshop.on);
  setLabel('labBtn', workshop.on ? 'Back to the show' : 'Workshop', workshop.on ? 'Show' : 'Workshop');
  $('labBtn').classList.toggle('on', workshop.on);
};

// Full screen. Inside the two-demo page, the frame itself goes full screen so
// the tab bar gets out of the way; on its own the page goes full screen.
function fsCtx() {
  try { if (window.frameElement && window.top.document) return { doc: window.top.document, el: window.frameElement }; } catch (e) { /* cross-origin */ }
  return { doc: document, el: document.documentElement };
}
const fsOn = (doc) => !!(doc.fullscreenElement || doc.webkitFullscreenElement);
async function toggleFs() {
  const { doc, el } = fsCtx();
  try {
    if (fsOn(doc)) await (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
    else await (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' });
  } catch (e) {
    try { if (fsOn(document)) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (e2) { /* not allowed here */ }
  }
}
function fsLabel() {
  const on = fsOn(fsCtx().doc) || fsOn(document);
  setLabel('fsBtn', on ? 'Exit full screen' : 'Full screen', on ? 'Exit full' : 'Full screen');
  $('fsBtn').classList.toggle('on', on);
}
{
  const { doc, el } = fsCtx();
  const ok = !!(el.requestFullscreen || el.webkitRequestFullscreen) && (doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
  if (!ok) $('fsBtn').remove();
  else {
    $('fsBtn').onclick = toggleFs;
    for (const d of new Set([doc, document])) { d.addEventListener('fullscreenchange', fsLabel); d.addEventListener('webkitfullscreenchange', fsLabel); }
    fsLabel();
  }
}
setLabel('autoBtn', 'Auto show', 'Auto');
setLabel('viewBtn', 'View: ' + rig.preset.name, rig.preset.name);
setLabel('shellBtn', 'Shell: Random', 'Random');
setLabel('slowBtn', 'Slow motion', 'Slow-mo');
setLabel('longBtn', 'Long exposure', 'Long exp.');
setLabel('soundBtn', 'Sound: On', 'Sound');
setLabel('labBtn', 'Workshop', 'Workshop');
camLabel();
layout();

const picker = $('picker');
const addPick = (id, label) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.dataset.id = id;
  b.onclick = () => {
    state.shell = id;
    setLabel('shellBtn', 'Shell: ' + label, label);
    picker.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    picker.classList.remove('show');
    $('shellBtn').classList.remove('on');
  };
  picker.appendChild(b);
  return b;
};
const lbl = (t) => { const d = document.createElement('div'); d.className = 'lbl'; d.textContent = t; picker.appendChild(d); };
lbl('Tap the sky to fire');
addPick('random', 'Random').classList.add('on');
MANUAL.forEach(id => addPick(id, SHELL_NAMES[id]));
lbl('From the barges and bridge');
addPick('fan', 'Comet fan');
addPick('mine', 'Mine');
addPick('waterfall', 'Waterfall');
$('shellBtn').onclick = () => { picker.classList.toggle('show'); $('shellBtn').classList.toggle('on', picker.classList.contains('show')); };

function audioUnlock() {
  audio.unlock();
  setTimeout(() => $('soundHint').classList.toggle('hide', audio.running || !audio.enabled), 300);
}
audio.init().then(() => {
  setTimeout(() => { if (!audio.running && audio.enabled) $('soundHint').classList.remove('hide'); }, 1500);
});

// ------------------------------------------------------------------ test hooks
function seek(t) {
  audio.muteUntil = t;
  while (state.t < t) {
    const d = Math.min(0.25, t - state.t);
    state.t += d;
    show.update(state.t); fw.update(state.t); particles.update(state.t);
  }
  step(0);
}
if (Q.has('t')) seek(Number(Q.get('t')));
if (Q.has('workshop')) $('labBtn').click();
window.__fw = {
  THREE, renderer, scene, camera, rig, director, post, particles, smoke, lights, world, fw, show, state, audio, crowd, tier, workshop,
  seek,
  // Advance the show by dt seconds and draw one frame (works with the page hidden).
  tick(dt = 1 / 60) { window.__manual = true; rig.update(dt, innerWidth / innerHeight); step(dt); render(dt); },
  view: setView,
};
requestAnimationFrame(frame);
