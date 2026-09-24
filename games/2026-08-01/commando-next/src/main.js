// main.js — boot, menus, attract demo, fixed-step loop, test hooks.
import * as THREE from 'three';
import { Renderer } from './render.js';
import { World } from './world.js';
import { FX } from './fx.js';
import { HUD } from './hud.js';
import { Audio } from './audio.js';
import { Input } from './input.js';
import { Game } from './game.js';
import { Bot } from './bot.js';
import { AREA1 } from './level1.js';
import { Soldier } from './soldier.js';
import { truckGroup } from './models.js';

const qs = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const store = { get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

const coarse = matchMedia('(pointer: coarse)').matches;
let quality = qs.get('q') || store.get('commandoNext.quality', coarse ? 'low' : 'high');
const R = new Renderer($('gl'), quality);
const world = new World(AREA1, R.scene, quality);
const fx = new FX(R.scene, R.camera, (x, p) => world.h(x, p), quality);
const hud = new HUD();
const audio = new Audio();
const input = new Input($('gl'));
const game = new Game({ R, world, fx, hud, audio, area: AREA1 });
const bot = new Bot(game);

let mode = 'title';          // title | play | paused
let manual = qs.has('test'); // tests drive the clock themselves
let botOn = false;
$('quality-mode').textContent = quality.toUpperCase();

// ------------------------------------------------------------------ menus
function menuButtons(screen) { return [...$(screen).querySelectorAll('.menu button')]; }
let sel = 0;
function highlight(screen) { menuButtons(screen).forEach((b, i) => b.classList.toggle('sel', i === sel)); }
function menuAct(act) {
  audio.unlock();
  switch (act) {
    case 'start': startGame(); break;
    case 'controls': $('controls-help').classList.toggle('hidden'); break;
    case 'music': { const m = audio.toggleMusic(); $('music-mode').textContent = m === 'original' ? 'SID' : 'MODERN'; break; }
    case 'quality': {
      quality = quality === 'high' ? 'low' : 'high'; store.set('commandoNext.quality', quality);
      R.setQuality(quality); $('quality-mode').textContent = quality.toUpperCase(); break;
    }
    case 'resume': setPaused(false); break;
    case 'restart': setPaused(false); game.score = Math.max(0, game.score); game.startArea(); break;
    case 'quit': setPaused(false); toTitle(); break;
  }
}
for (const scr of ['title', 'pause']) {
  menuButtons(scr).forEach((b, i) => {
    b.addEventListener('click', () => { sel = i; highlight(scr); menuAct(b.dataset.act); });
    b.addEventListener('mouseenter', () => { sel = i; highlight(scr); });
  });
}
addEventListener('keydown', (e) => {
  const scr = mode === 'title' ? 'title' : mode === 'paused' ? 'pause' : null;
  if (!scr) return;
  const n = menuButtons(scr).length;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') { sel = (sel + 1) % n; highlight(scr); e.preventDefault(); }
  if (e.code === 'ArrowUp' || e.code === 'KeyW') { sel = (sel + n - 1) % n; highlight(scr); e.preventDefault(); }
  if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); menuAct(menuButtons(scr)[sel].dataset.act); }
  if (mode === 'paused' && (e.code === 'Escape' || e.code === 'KeyP')) setPaused(false);
});

function renderHiscores() { $('hiscores').innerHTML = `HI-SCORE <b>${String(game.hi).padStart(7, '0')}</b>`; }

function toTitle() {
  mode = 'title'; sel = 0; highlight('title');
  $('title').classList.remove('hidden'); $('pause').classList.add('hidden');
  hud.show(false); hud.hideBanner(); $('touch').classList.add('hidden');
  renderHiscores();
  botOn = true; input.forced = null;
  game.newGame({ demo: true });
  game.godMode = false;
  audio.stopMusic();
}
function startGame() {
  audio.unlock().then(() => audio.music('main'));
  mode = 'play'; botOn = false;
  $('title').classList.add('hidden');
  hud.show(true);
  if (input.touch.on || coarse) $('touch').classList.remove('hidden');
  game.newGame({ demo: false });
}
function setPaused(on) {
  if (on && mode === 'play') { mode = 'paused'; sel = 0; highlight('pause'); $('pause').classList.remove('hidden'); audio.suspend(); }
  else if (!on && mode === 'paused') { mode = 'play'; $('pause').classList.add('hidden'); audio.resume(); input.pressed.clear(); }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true); });

// ------------------------------------------------------------------ game events → presentation
function handleEvents() {
  for (const ev of game.events) {
    const live = mode !== 'title';
    switch (ev.type) {
      case 'intro': if (live) hud.banner(game.loop > 1 ? `AREA 1 — LOOP ${game.loop}` : 'AREA 1', AREA1.title, 2.4); break;
      case 'respawn': if (live) hud.toast('BACK IN THE FIGHT'); break;
      case 'finale': if (live) hud.toast('THE GATE IS OPENING', 2.2); break;
      case 'officer': if (live) hud.toast('OFFICER RUNNING — TAKE HIM DOWN', 2.4); break;
      case 'officer-escaped': if (live) hud.toast('THE OFFICER GOT AWAY'); break;
      case 'officer-down': if (live) hud.toast('OFFICER DOWN  +2000'); break;
      case 'gate-open': if (live) hud.toast('GATE CLEAR — GET INSIDE', 2.4); break;
      case 'extra-life': if (live) hud.toast('EXTRA LIFE'); break;
      case 'clear': if (live) { hud.banner('AREA CLEAR', `BONUS ${ev.bonus}\nPOWs RESCUED ${game.rescued}/${AREA1.pows.length}`, 5.5); audio.music('clear'); } break;
      case 'gameover': if (live) { hud.banner('GAME OVER', `SCORE ${game.score}`, 5); audio.music('gameover'); } break;
      case 'gameover-done': if (mode === 'title') game.newGame({ demo: true }); else toTitle(); break;
      case 'hurt': break;
    }
  }
  game.events.length = 0;
}

// ------------------------------------------------------------------ loop
const STEP = 1 / 60;
let acc = 0, last = performance.now(), t = 0;
let perf = { n: 0, sum: 0, checked: false };

function simStep() {
  let I;
  if (mode === 'paused') return;
  const raw = input.poll();
  if (mode === 'play' && raw.pause) { setPaused(true); return; }
  if (mode === 'title' || botOn) I = bot.intent(STEP);
  else I = raw;
  game.update(STEP, I);
  handleEvents();
}

function frame(dt) {
  t += dt;
  game.syncVisuals(dt);
  // camera follows the sim camera with a touch of interpolation
  R.focus.set(game.camX, 0, -game.camP);
  world.update(t);
  fx.update(dt);
  R.update(dt, t);
  const J = game.joe;
  R.grade.uniforms.uHurt.value = Math.max(J.hurtFlash > 0 ? J.hurtFlash * 0.8 : 0, J.alive && J.hp === 1 ? 0.25 + Math.sin(t * 5) * 0.1 : 0);
  hud.update(game, dt);
  R.render();
}

let frames = 0, worst = 0;
function loop(now) {
  requestAnimationFrame(loop);
  let dt = Math.min(0.1, (now - last) / 1000); last = now;
  frames++; worst = Math.max(worst, dt);
  if (manual) { return; }
  acc += dt;
  let n = 0;
  const t0 = performance.now();
  while (acc >= STEP && n < 5) { simStep(); acc -= STEP; n++; }
  if (n === 5) acc = 0;
  const t1 = performance.now();
  frame(dt);
  const t2 = performance.now();
  if (qs.has('prof') && (t2 - t0 > 30 || dt > 0.05)) console.log(`[slow] dt=${(dt * 1000) | 0} sim=${(t1 - t0).toFixed(1)} frame=${(t2 - t1).toFixed(1)} enemies=${game.enemies.length} corpses=${game.corpses.length}`);
  // one-time perf check: drop to LOW if the first seconds of play are heavy
  if (!perf.checked && mode !== 'paused') {
    perf.n++; perf.sum += dt;
    if (perf.n === 240) {
      perf.checked = true;
      const avg = perf.sum / perf.n;
      if (avg > 0.024 && quality === 'high' && !qs.get('q')) { quality = 'low'; R.setQuality('low'); $('quality-mode').textContent = 'LOW'; hud.toast('QUALITY SET TO LOW FOR SMOOTHNESS'); }
    }
  }
}

// ------------------------------------------------------------------ boot
// compile every shader up front so the first soldier, truck or blast doesn't hitch
{
  // (placed in view so their shadow-pass variants compile too)
  const warm = [], z0 = -AREA1.spawn.p - 4;
  ['joe', 'rifle', 'lobber', 'officer', 'pow'].forEach((k, i) => { const s = new Soldier(k); s.obj.position.set(-4 + i * 2, 0, z0); s.a.dead = i === 1 ? 0.5 : 0; s.pose(0.016); R.scene.add(s.obj); warm.push(s.obj); });
  const tr = truckGroup(); tr.position.set(6, 0, z0); R.scene.add(tr); warm.push(tr);
  const nade = new THREE.Mesh(game.nadeGeo, game.nadeMat); nade.position.set(0, 1, z0); R.scene.add(nade); warm.push(nade);
  for (const k of ['gren', 'med']) { const m = new THREE.Mesh(game.pickupGeo[k], game.pickupMat[k]); m.position.set(2, 0.3, z0); R.scene.add(m); warm.push(m); }
  fx.explosion(0, 0, z0, 3); fx.muzzle(0, 1, z0, 0, 1); fx.ring(0, z0, 0, 2, 1, [1, 0.2, 0.1]); fx.blob(0, z0, 0, 0.3); fx.dust(0, 0, z0, 3);
  fx.trList.push({ x: 0, p: -z0, y: 1, vx: 0, vp: 30 }, { x: 1, p: -z0, y: 1, vx: 0, vp: 30, enemy: true });
  fx.laser(0, 0, 3, z0, 2, 1, z0, 0.8);
  fx.update(0.016);
  R.focus.set(0, 0, -AREA1.spawn.p); R.update(0.016, 0);
  // the scene is drawn into the composer's render target (linear, no tone
  // mapping), so shaders must be compiled for that target, not the canvas
  const rt = R.composer.renderTarget1;
  R.r.setRenderTarget(rt);
  try { R.r.compile(R.scene, R.camera); } catch (e) {}
  R.r.setRenderTarget(null);
  R.render(); R.render();
  // one render of the whole level from far above with a level-sized shadow
  // frustum, so every shadow-pass shader variant is built now, not mid-fight
  const cam = R.camera, sc = R.sun.shadow.camera, mid = -AREA1.length / 2;
  const save = { l: sc.left, r: sc.right, t: sc.top, b: sc.bottom, far: cam.far };
  Object.assign(sc, { left: -60, right: 60, top: 160, bottom: -160, far: 400 }); sc.updateProjectionMatrix();
  R.sun.target.position.set(0, 0, mid); R.sun.position.set(R.sunDir.x * 150, R.sunDir.y * 150, mid + R.sunDir.z * 150);
  cam.far = 2000; cam.position.set(0, 700, mid + 1); cam.lookAt(0, 0, mid); cam.updateProjectionMatrix();
  R.r.setRenderTarget(rt); R.r.render(R.scene, cam); R.r.setRenderTarget(null);
  Object.assign(sc, { left: save.l, right: save.r, top: save.t, bottom: save.b, far: 140 }); sc.updateProjectionMatrix();
  cam.far = save.far; cam.updateProjectionMatrix();
  for (const o of warm) R.scene.remove(o);
  fx.clear();
}
$('loading').classList.add('hidden');
toTitle();
if (qs.has('play')) startGame();
requestAnimationFrame((n) => { last = n; loop(n); });

// ------------------------------------------------------------------ test hooks
window.__cmd = {
  game, R, world, fx, autopilot: bot,
  manual(on = true) { manual = on; },
  step(n = 1, render = true) { for (let i = 0; i < n; i++) simStep(); if (render) frame(STEP * n); return game.snapshot(); },
  // advance n sim steps, rendering every `every` steps (cheap long runs)
  run(n, every = 30) { for (let i = 0; i < n; i++) { simStep(); if (i % every === every - 1) frame(STEP * every); } frame(STEP); return game.snapshot(); },
  start(opts = {}) { startGame(); botOn = !!opts.bot; game.godMode = !!opts.god; return game.snapshot(); },
  bot(on = true) { botOn = on; },
  god(on = true) { game.godMode = on; },
  input(I) { input.forced = I; },
  state: () => game.snapshot(),
  mode: () => mode,
  warp(p, x = 0) {
    const J = game.joe; J.p = p; J.x = x; J.px = x; J.pp = p;
    game.camP = p + R.offJoe; game.prevCamP = game.camP;
    // skip the encounters we jumped past
    AREA1.encounters.forEach((e, i) => { if (e.at < game.viewTop() - 2) game.encDone.add(i); });
    return game.snapshot();
  },
  frames: (reset) => { const r = { frames, worst }; if (reset) { frames = 0; worst = 0; } return r; },
  info: () => ({ calls: R.r.info.render.calls, tris: R.r.info.render.triangles, geos: R.r.info.memory.geometries, tex: R.r.info.memory.textures, quality }),
};
