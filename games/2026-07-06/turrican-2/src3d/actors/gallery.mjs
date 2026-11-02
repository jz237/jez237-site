// Actor gallery / test bench. Bundle with esbuild (iife) and drive from Playwright via
// window.__gallery (scenario(name), step(dt), shot(), stats()).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createActorKit, ENEMY_SKIN_LIST, BOSS_KEYS, PICKUP_TYPES } from './index.mjs';
import { ENEMY_SKINS } from './enemies.mjs';
import TDataMod from '../../assets/data.js';
const TD = TDataMod.BOSSES ? TDataMod : (TDataMod.default || TDataMod);

const W = 1920, H = 1080;
const params = new URLSearchParams(location.search);
const quality = params.get('q') || 'high';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.style.margin = '0'; document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#2a3446');
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.5;
const hemi = new THREE.HemisphereLight('#bcd4ff', '#6b4a2a', 0.7); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffe0bd', 3.2); sun.position.set(-300, 600, 500); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.4;
const sc = sun.shadow.camera; sc.left = -500; sc.right = 500; sc.top = 400; sc.bottom = -400; sc.near = 10; sc.far = 2000;
scene.add(sun); scene.add(sun.target);
const rim = new THREE.DirectionalLight('#86a8ff', 1.1); rim.position.set(400, 200, -300); scene.add(rim);
const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(6000, 4000), new THREE.MeshStandardMaterial({ color: '#3b4558', roughness: 1 }));
backdrop.position.z = -260; backdrop.receiveShadow = true; scene.add(backdrop);
const groundMat = new THREE.MeshStandardMaterial({ color: '#7a5038', roughness: 0.9, metalness: 0 });

const camera = new THREE.PerspectiveCamera(22.62, W / H, 1, 5000);
function frame(cx, cy, viewH) {
  const d = (viewH / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.set(cx, cy, d); camera.lookAt(cx, cy, 0); camera.near = d * 0.2; camera.far = d * 4; camera.updateProjectionMatrix();
  sun.position.set(cx - 300, cy + 600, 500); sun.target.position.set(cx, cy, 0);
  const half = Math.max(viewH * 1.0, 60); sc.left = -half * 1.9; sc.right = half * 1.9; sc.top = half * 1.4; sc.bottom = -half * 1.4; sc.updateProjectionMatrix();
}
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.75, 0.45, 1.0); composer.addPass(bloom);
composer.addPass(new OutputPass());

const kit = createActorKit({ quality, renderer });
const world = new THREE.Group(); scene.add(world);
let items = [], time = 0, labels = [];
const S = { player: { x: 0, y: 0, w: 14, h: 30, vx: 0, vy: 0, facing: 1 }, freeze: 0, level: null, frame: 0 };

function ground(x0, x1, yTop, depth = 40) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 12, depth), groundMat);
  m.position.set((x0 + x1) / 2, yTop - 6, 0); m.receiveShadow = true; m.castShadow = true; world.add(m);
}
const CENTRE = new Set(['fighter', 'pickup']);
function place(it) {
  const e = it.ent;
  if (CENTRE.has(it.kind)) it.actor.root.position.set(e.x + e.w / 2, -(e.y + e.h / 2), 0);
  else it.actor.root.position.set(e.x + e.w / 2, -(e.y + e.h), 0);
}
// add an actor at world (X, Ybottom) (or centre for fighter/pickups)
function add(kind, arg, X, Y, ent, drive, preroll = 0) {
  let actor;
  if (kind === 'hero') actor = kit.hero(); else if (kind === 'fighter') actor = kit.fighter();
  else if (kind === 'enemy') actor = kit.enemy(ent); else if (kind === 'boss') actor = kit.boss(ent);
  else if (kind === 'pickup') actor = kit.pickup(arg); else actor = kit.mine();
  ent.x = X - ent.w / 2; ent.y = CENTRE.has(kind) ? -Y - ent.h / 2 : -Y - ent.h;
  const it = { kind, actor, ent, drive: drive || (() => {}), label: arg };
  world.add(actor.root); items.push(it); place(it);
  let t = 0; const dt = 1 / 60;
  for (let i = 0; i < Math.round(preroll * 60); i++) { t += dt; it.drive(ent, t, dt); actor.update(ent, S, dt, t); }
  it.t = t;
  return it;
}
function clear() { for (const it of items) { world.remove(it.actor.root); it.actor.dispose(); } items = []; while (world.children.length) world.remove(world.children[0]); time = 0; S.freeze = 0; }

const heroEnt = (o) => Object.assign({ w: 14, h: 30, vx: 0, vy: 0, facing: 1, onGround: true, crouch: false, morph: false, inWater: false, weapon: 'spread', weapons: { spread: 1, beam: 1, bounce: 1 }, beamActive: false, beam: null, aimDir: 0, cooldown: 0 }, o);
const ENEMY_CFG = {
  turret: { w: 20, h: 20, fireEvery: 1.6 }, walker: { w: 20, h: 22, speed: 55 }, flyer: { w: 22, h: 16, speed: 95, amp: 42, freq: 2.2 },
  hopper: { w: 22, h: 22 }, spawner: { w: 28, h: 28, spawnEvery: 2.4 }, drifter: { w: 16, h: 16 }, eel: { w: 30, h: 12, speed: 120, amp: 26, freq: 3 },
  spinner: { w: 18, h: 18, radius: 34, spin: 2.4 }, egg: { w: 18, h: 22, hatchDist: 90 }, hugger: { w: 14, h: 12 },
};
const BOSS_CFG = { warden: [64, 74, 0.75], maw: [72, 58, 0.7], gunship: [84, 66, 0.6], colossus: [72, 84, 0.7], queen: [70, 70, 0.8], machine: [86, 96, 0.65] };
function enemyEnt(skin, type) {
  type = type || ENEMY_SKINS[skin].type; const c = ENEMY_CFG[type];
  return { type, skin, cfg: c, w: c.w, h: c.h, vx: 0, vy: 0, t: Math.random() * 3, facing: -1, hitFlash: 0, fireT: c.fireEvery || 0, spawnT: c.spawnEvery || 0, alive: true, hp: 3, maxHp: 3 };
}
function enemyDrive(type) {
  return (e, t, dt) => {
    e.t += dt;
    if (type === 'walker') { e.vx = e.facing * 55; e.vy = 0; }
    if (type === 'turret') { e.fireT -= dt; if (e.fireT <= 0) e.fireT = 1.6; const p = S.player; e.aim = Math.atan2(p.y + 12 - e.y, p.x - e.x); }
    if (type === 'hopper' || type === 'hugger') { const cad = type === 'hugger' ? 0.65 : 1.2; const ph = e.t % cad; e.vy = ph < 0.42 * cad ? (-430 + ph / (0.42 * cad) * 860) : 0; e.vx = e.vy ? -70 : 0; }
    if (type === 'spawner') { e.spawnT -= dt; if (e.spawnT <= 0) e.spawnT = 2.4; }
  };
}
function bossEnt(key, o) {
  const [w, h, tele] = BOSS_CFG[key];
  return Object.assign({ key, w, h, cfg: TD.BOSSES[key], hp: 100, maxHp: 100, alive: true, awake: true, state: 'idle', stateT: 1, t: 0, open: false, vx: 0, vy: 0, hitFlash: 0, phase: 0, attack: null, attackT: 0, dying: false, deathT: 0 }, o);
}

const scenarios = {};
// gameplay-scale contact sheet, worlds 1-2 + hero states + pickups
scenarios['contact-a'] = () => {
  frame(320, -180, 360);
  S.player.x = 20; S.player.y = 150;
  const rows = [-110, -220, -330];
  for (const y of rows) ground(-40, 680, y);
  const r0 = [
    ['hero', 'idle', heroEnt({}), null, 0.4], ['hero', 'run', heroEnt({ vx: 205 }), (p) => { p.vx = 205; }, 0.6],
    ['hero', 'jump', heroEnt({ onGround: false, vy: -300 }), null, 0.3], ['hero', 'beam', heroEnt({ weapon: 'beam', beamActive: true, beam: { dx: 0.8, dy: -0.6 } }), null, 0.4],
    ['hero', 'crouch', heroEnt({ crouch: true, h: 22 }), null, 0.4], ['hero', 'morph', heroEnt({ morph: true, w: 16, h: 16, vx: 120 }), null, 0.5],
  ];
  r0.forEach((d, i) => add(d[0], d[1], 40 + i * 50, rows[0], d[2], d[3], d[4]));
  PICKUP_TYPES.forEach((p, i) => add('pickup', p, 360 + i * 46, rows[0] + 26, { w: 16, h: 16 }, null, 0.3 + i * 0.2));
  add('mine', 'mine', 640, rows[0], { w: 8, h: 8, life: 3 }, null, 0.2);
  const w1 = ['scarab', 'rockmite', 'cliffpod', 'wasp', 'windmine'], w2 = ['crab', 'eel', 'polyp', 'sentry', 'bubblemine'];
  const set = (list, y) => list.forEach((sk, i) => { if (!ENEMY_SKINS[sk]) return; const e = enemyEnt(sk); const fly = ['flyer', 'drifter', 'eel'].includes(e.type); add('enemy', sk, 50 + i * 125, y + (fly ? 22 : 0), e, enemyDrive(e.type), 0.5 + i * 0.13); });
  set(w1, rows[1]); set(w2, rows[2]);
};
scenarios['contact-b'] = () => {
  frame(320, -180, 360);
  S.player.x = 20; S.player.y = 150;
  const rows = [-110, -220, -330];
  for (const y of rows) ground(-40, 680, y);
  add('fighter', 'fighter', 50, rows[0] + 40, { w: 26, h: 14, vx: 60, vy: -80 }, null, 0.4);
  const w3 = ['walltur', 'interceptor', 'seeker'], w4 = ['statue', 'beltdrone', 'boltspin', 'arcdrone', 'armhub'], w5 = ['hugger', 'leaper', 'eggpod', 'acidmaw', 'hivenode'];
  const set = (list, y, x0, dx) => list.forEach((sk, i) => { if (!ENEMY_SKINS[sk]) return; const e = enemyEnt(sk); const fly = ['flyer', 'drifter', 'eel', 'spinner'].includes(e.type); add('enemy', sk, x0 + i * dx, y + (fly ? 22 : 0), e, enemyDrive(e.type), 0.5 + i * 0.13); });
  set(w3, rows[0], 170, 110);
  if (ENEMY_SKINS.shardling) { const e = enemyEnt('shardling', 'flyer'); e.skin = null; add('enemy', 'shardling', 560, rows[0] + 22, e, enemyDrive('flyer'), 0.4); }
  set(w4, rows[1], 50, 125); set(w5, rows[2], 50, 125);
};
// hero close-up / strips
scenarios['hero-close'] = () => { frame(0, 16, 40); ground(-60, 60, 0); add('hero', 'idle', 0, 0, heroEnt({}), null, 0.7); };
scenarios['hero-close-left'] = () => { frame(0, 16, 40); ground(-60, 60, 0); add('hero', 'run', 0, 0, heroEnt({ facing: -1, vx: -205 }), (p) => { p.vx = -205; }, 0.53); };
scenarios['hero-strip'] = () => {
  frame(78, 2, 104); ground(-40, 200, 22); ground(-40, 200, -32);
  const cyc = 62 / 205;
  for (let i = 0; i < 6; i++) add('hero', 'run' + i, i * 31, 22, heroEnt({ vx: 205 }), (p) => { p.vx = 205; }, 0.5 + (i / 6) * cyc).label = 'run';
  const row2 = [
    ['rise', heroEnt({ onGround: false, vy: -420 }), null], ['fall', heroEnt({ onGround: false, vy: 500 }), null],
    ['aimUp', heroEnt({ aimDir: -1, cooldown: 0.05 }), null], ['aimDown', heroEnt({ onGround: false, vy: 200, aimDir: 1 }), null],
    ['beamUp', heroEnt({ weapon: 'beam', beamActive: true, beam: { dx: 0.35, dy: -0.94 } }), null], ['crouch', heroEnt({ crouch: true, h: 22 }), null],
  ];
  row2.forEach((d, i) => add('hero', d[0], i * 31, -32, d[1], d[2], 0.6));
};
scenarios['hero-morph'] = () => {
  frame(60, 14, 50); ground(-40, 200, 0);
  const fr = [0, 0.04, 0.08, 0.11, 0.15, 0.5];
  fr.forEach((tm, i) => add('hero', 'm' + i, i * 24, 0, heroEnt({}), null, 0.3).label = tm);
  items.forEach((it, i) => { it.ent.morph = true; it.ent.w = 16; it.ent.h = 16; it.ent.y += 14; it.ent.vx = 150; const n = Math.round(fr[i] * 60); for (let k = 0; k < n; k++) it.actor.update(it.ent, S, 1 / 60, 0); it.ent.x = i * 24 - 8; place(it); it.frozenAnim = true; });
};
scenarios['hero-water'] = () => { frame(30, 16, 50); ground(-60, 120, 0); add('hero', 'swim', 0, 0, heroEnt({ inWater: true, onGround: false, vy: -40 }), null, 1.0); add('hero', 'wade', 40, 0, heroEnt({ inWater: true, vx: 140 }), (p) => { p.vx = 140; }, 0.8); items[1].ent.x = 40; place(items[1]); };
scenarios['fighter-close'] = () => { frame(0, 0, 30); add('fighter', 'f', 0, 0, { w: 26, h: 14, vx: 120, vy: -150 }, null, 0.5); };
const HOVER = { warden: 0, maw: 26, gunship: 40, colossus: 0, queen: 30, machine: 12 };
for (const [nm, keys] of [['bosses-a', ['warden', 'maw', 'gunship']], ['bosses-b', ['colossus', 'queen', 'machine']]]) scenarios[nm] = () => {
  frame(320, 150, 360); ground(-40, 700, 0);
  S.player.x = 30; S.player.y = -40;
  keys.forEach((k, i) => add('boss', k, 170 + i * 200, HOVER[k], bossEnt(k), (b, t, dt) => { b.t += dt; }, 0.6 + i * 0.3));
  const h = add('hero', 'hero', 30, 0, heroEnt({}), null, 0.5);
};
for (const k of BOSS_KEYS) {
  scenarios['boss-' + k] = () => {
    const [w, h] = BOSS_CFG[k]; frame(0, h * 0.55, h * 1.55); ground(-300, 300, 0);
    S.player.x = -200; S.player.y = -40;
    add('boss', k, 0, 0, bossEnt(k), (b, t, dt) => { b.t += dt; }, 0.5);
  };
  // state strip: idle / tele / attack / open / phase1 / phase2 / dying
  scenarios['bstrip-' + k] = () => {
    const [w, h] = BOSS_CFG[k];
    const sp = w * 1.25;
    frame(sp * 3, h * 0.62, Math.max(h * 1.5, sp * 7.2 / (W / H))); ground(-200, sp * 8, 0);
    S.player.x = -300; S.player.y = -40;
    const atk = { warden: 'shockwave', maw: 'dash', gunship: 'barrage', colossus: 'volley', queen: 'spawn', machine: 'beam' }[k];
    const st = [
      ['idle', {}], ['tele', { state: 'tele', stateT: 0.2 }], ['attack', { state: 'attack', attack: { kind: atk }, attackT: 0.3 }],
      ['open', { state: 'open', open: true, stateT: 1 }], ['phase1', { phase: 1, hp: 55 }], ['phase2', { phase: 2, hp: 20, state: 'open', open: true }], ['dying', { dying: true, deathT: 1.0, phase: 2 }],
    ];
    st.forEach((d, i) => add('boss', d[0], i * sp, 0, bossEnt(k, d[1]), (b, t, dt) => { b.t += dt; if (b.dying) b.deathT = Math.max(0.05, b.deathT - dt); }, 0.6));
  };
}
for (const sk of Object.keys(ENEMY_SKINS)) scenarios['enemy-' + sk] = () => {
  const e = enemyEnt(sk); frame(0, e.h * 0.6, e.h * 2.4); ground(-80, 80, 0); S.player.x = -60; S.player.y = -40;
  add('enemy', sk, 0, 0, e, enemyDrive(e.type), 0.7);
};
scenarios['enemy-grid'] = () => {
  const list = Object.keys(ENEMY_SKINS), cols = 6, cw = 46, rh = 40;
  frame(cw * 2.5, -rh * 1.5 + 6, 168);
  S.player.x = -400; S.player.y = 200;
  for (let r0 = 0; r0 < 4; r0++) ground(-30, cw * 6, -r0 * rh);
  list.forEach((sk, i) => { const e = enemyEnt(sk); if (sk === 'shardling') e.skin = null; const fly = ['flyer', 'drifter', 'eel', 'spinner'].includes(e.type);
    add('enemy', sk, (i % cols) * cw, -Math.floor(i / cols) * rh + (fly ? 6 : 0), e, enemyDrive(e.type), 0.5 + i * 0.07); });
};
scenarios['warden-open'] = () => { frame(5, 45, 50); ground(-300, 300, 0); S.player.x = -200; S.player.y = -40; add('boss', 'warden', 0, 0, bossEnt('warden', { state: 'open', open: true, stateT: 2 }), (b, t, dt) => { b.t += dt; }, 0.8); };
scenarios['gem-close'] = () => { frame(0, 0, 24); add('pickup', 'gem', 0, 0, { w: 16, h: 16 }, null, 0.4); };
scenarios['pickups-close'] = () => { frame(60, 0, 40); PICKUP_TYPES.forEach((p, i) => add('pickup', p, i * 22 + 5, 0, { w: 16, h: 16 }, null, 0.4)); add('mine', 'mine', 135, -8, { w: 8, h: 8, life: 3 }, null, 0.2); ground(120, 150, -8 + 3.5 - 0.01 + 0); };

function step(dt = 1 / 60) {
  time += dt; S.frame++;
  for (const it of items) {
    if (it.frozenAnim) continue;
    it.t += dt; it.drive(it.ent, it.t, dt); it.actor.update(it.ent, S, dt, it.t); place(it);
  }
}
function render() { composer.render(); }
function shot() { render(); return renderer.domElement.toDataURL('image/png'); }

// per-model budget stats: render one model alone (no shadows) and read renderer.info
function stats() {
  const out = {};
  const s2 = new THREE.Scene(); s2.environment = scene.environment; s2.add(new THREE.HemisphereLight('#fff', '#444', 1)); s2.add(new THREE.DirectionalLight('#fff', 2));
  const cam = new THREE.PerspectiveCamera(30, 1, 1, 5000); cam.position.set(0, 40, 400); cam.lookAt(0, 40, 0);
  const prevShadow = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false;
  const measure = (name, actor, ent) => {
    s2.add(actor.root); actor.update(ent, S, 1 / 60, 0);
    renderer.info.reset(); renderer.info.autoReset = false; renderer.render(s2, cam);
    out[name] = { calls: renderer.info.render.calls, tris: renderer.info.render.triangles };
    renderer.info.autoReset = true; s2.remove(actor.root); actor.dispose();
  };
  measure('hero', kit.hero(), heroEnt({}));
  measure('fighter', kit.fighter(), { w: 26, h: 14, vx: 0, vy: 0 });
  for (const sk of Object.keys(ENEMY_SKINS)) measure('enemy:' + sk, kit.enemy(enemyEnt(sk)), enemyEnt(sk));
  for (const k of BOSS_KEYS) measure('boss:' + k, kit.boss(bossEnt(k)), bossEnt(k));
  for (const p of PICKUP_TYPES) measure('pickup:' + p, kit.pickup(p), { w: 16, h: 16 });
  measure('mine', kit.mine(), { w: 8, h: 8, life: 3 });
  renderer.shadowMap.enabled = prevShadow;
  return out;
}
function warmTest() { const t0 = performance.now(); const n = kit.warm(renderer, scene, camera); return { n, ms: performance.now() - t0 }; }

window.__gallery = {
  ready: true, scenarios: Object.keys(scenarios), kit, scene, renderer, camera, frame, step, render, shot, stats, warmTest, S, items: () => items,
  scenario(name) { clear(); scenarios[name](); return items.length; },
  setFreeze(v) { S.freeze = v; }, setFlash(v) { for (const it of items) it.ent.hitFlash = v; },
  mutate(fn) { for (const it of items) fn(it.ent, it); },
};
