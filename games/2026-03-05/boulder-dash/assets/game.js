// Emerald Mine II remake — game shell: state machine, input, audio, rendering, screens.
// Engine (engine.js) is headless; this file owns everything user-facing.
'use strict';

const VERSION = 'v1.2.5';
const ASSET_Q = '?v=' + VERSION;   // cache-buster: same-named assets change between versions
const STEP_MS = 160;                 // authentic cave cycle (6.25 Hz)
const LB_URL = 'https://game-scores.jez237.workers.dev/scores/emerald-mine-2';
const MAX_LEVEL = 80;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let DPR = 1, VW = 0, VH = 0;

// ─── save / options ───
const SAVE_KEY = 'em2_save_v1';
const defaultKeys = () => ({
  p1: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', fire: 'Space' },
  p2: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', fire: 'ShiftLeft' },
});
let save = { h1: 0, hT: 0, best: {}, scores: [], opts: { sfx: 0.8, mus: 0.6, crt: false, zoom: 1, keys: defaultKeys() } };
try {
  const s = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (s && s.opts) { save = s; if (!save.opts.keys) save.opts.keys = defaultKeys(); }
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

// ─── audio ───
const AC = window.AudioContext || window.webkitAudioContext;
let ac = null, sfxGain = null, musGain = null;
const buffers = {}, loops = {};   // loops: name -> {src, gain, last}
let manifest = null, musicBuf = null, musicSrc = null, audioReady = false;
async function initAudio() {
  if (ac) return;
  ac = new AC();
  sfxGain = ac.createGain(); sfxGain.gain.value = save.opts.sfx; sfxGain.connect(ac.destination);
  musGain = ac.createGain(); musGain.gain.value = save.opts.mus; musGain.connect(ac.destination);
  try {
    manifest = await (await fetch('assets/sfx/manifest.json' + ASSET_Q)).json();
    const names = Object.keys(manifest.sfx);
    await Promise.all(names.map(async n => {
      try {
        const ab = await (await fetch('assets/sfx/' + manifest.sfx[n].file + ASSET_Q)).arrayBuffer();
        buffers[n] = await ac.decodeAudioData(ab);
      } catch (e) {}
    }));
    try {
      const ab = await (await fetch('assets/sfx/' + (manifest.music?.title || 'title-music.mp3') + ASSET_Q)).arrayBuffer();
      musicBuf = await ac.decodeAudioData(ab);
    } catch (e) {}
  } catch (e) { manifest = { sfx: {} }; }
  audioReady = true;
  if (state === 'title') startMusic();
}
function synthTone(freq, dur, type, vol, slide) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type || 'square'; o.frequency.value = freq;
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), ac.currentTime + dur);
  g.gain.value = (vol || 0.2) * 0.9; g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g); g.connect(sfxGain); o.start(); o.stop(ac.currentTime + dur + 0.02);
}
function synthNoise(dur, vol, freq) {
  if (!ac) return;
  const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ac.createBufferSource(); src.buffer = buf;
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 900; f.Q.value = 0.7;
  const g = ac.createGain(); g.gain.value = vol || 0.3;
  src.connect(f); f.connect(g); g.connect(sfxGain); src.start();
}
// glassy gem tones matched to the measured originals (research/audio.md):
// collect = ring swelling 2.6->2.85kHz peaking ~170ms then stopping (~250ms);
// gem landing = pure steady ~2.7kHz "tiiing" fading over ~0.3s
function synthGlass(fStart, fEnd, dur, peakAt, vol) {
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const [mult, v] of [[1, 1], [2, 0.18]]) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(fStart * mult, t0);
    o.frequency.linearRampToValueAtTime(fEnd * mult, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol * v), t0 + peakAt);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(sfxGain); o.start(t0); o.stop(t0 + dur + 0.02);
  }
}
const SYNTH = {
  space: () => synthTone(150, 0.05, 'triangle', 0.07),
  dirt: () => synthNoise(0.09, 0.5, 1400),
  collect: () => synthGlass(2600, 2850, 0.25, 0.17, 0.4),
  diamond: () => synthGlass(2700, 2700, 0.31, 0.015, 0.32),
  press: () => { synthTone(1700, 0.09, 'square', 0.2); setTimeout(() => synthTone(2100, 0.09, 'square', 0.2), 90); },
  tick: () => synthTone(890, 0.02, 'square', 0.3),
  time: () => synthTone(2100, 0.2, 'square', 0.35),
  exit_open: () => { synthTone(660, 0.1, 'sine', 0.25); setTimeout(() => synthTone(990, 0.14, 'sine', 0.25), 80); },
  blip: () => synthTone(880, 0.05, 'square', 0.15),
  blip2: () => synthTone(1320, 0.06, 'square', 0.15),
};
const LOOP_SOUNDS = new Set(['wonder', 'wheel', 'bug', 'tank', 'eater', 'alien']);
// sfx are the original digitized Amiga samples; SYNTH entries remain as fallbacks only
function playSfx(name) {
  if (!audioReady || !ac) return;
  if (SYNTH[name] && !buffers[name]) { SYNTH[name](); return; }
  const buf = buffers[name]; if (!buf) return;
  const meta = manifest.sfx[name] || {};
  if (LOOP_SOUNDS.has(name)) {
    let L = loops[name];
    if (!L) {
      const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
      const g = ac.createGain(); g.gain.value = meta.gain ?? 0.3;
      src.connect(g); g.connect(sfxGain); src.start();
      L = loops[name] = { src, g };
    }
    L.last = performance.now();
    return;
  }
  const src = ac.createBufferSource(); src.buffer = buf;
  const g = ac.createGain(); g.gain.value = meta.gain ?? 0.7;
  src.connect(g); g.connect(sfxGain); src.start();
}
function reapLoops(now) {
  for (const n of Object.keys(loops)) {
    if (now - loops[n].last > 400) { try { loops[n].src.stop(); } catch (e) {} delete loops[n]; }
  }
}
function stopAllLoops() { for (const n of Object.keys(loops)) { try { loops[n].src.stop(); } catch (e) {} delete loops[n]; } }
function startMusic() {
  if (!audioReady || !musicBuf || musicSrc) return;
  musicSrc = ac.createBufferSource(); musicSrc.buffer = musicBuf; musicSrc.loop = true;
  musicSrc.connect(musGain); musicSrc.start();
}
function stopMusic() { if (musicSrc) { try { musicSrc.stop(); } catch (e) {} musicSrc = null; } }

// ─── images ───
const IMG = {};
for (const n of ['title-art', 'cave-bg']) { const im = new Image(); im.src = 'assets/img/' + n + '.jpg' + ASSET_Q; IMG[n] = im; }

// ─── atlas ───
let TILE = 40;                       // on-screen tile px (zoomable)
const ART = 64;                      // atlas art resolution
const atlas = new Atlas(ART);
function tileSprite(name, variant, frame, active, glyph) {
  const key = `${name}:${variant}:${frame}:${active ? 1 : 0}:${glyph || ''}`;
  return atlas.get(key, (c, S) => makePainterFor(name, glyph)(variant, frame, active)(c, S));
}

// ─── input ───
const keysDown = new Set();
let latch = [{ dx: 0, dy: 0, fire: false }, { dx: 0, dy: 0, fire: false }];
let escDownAt = 0, escHoldShown = 0;
let remapTarget = null;              // {p, act} while capturing a key in options
window.addEventListener('keydown', e => {
  if (remapTarget) {
    if (e.code !== 'Escape') {
      save.opts.keys[remapTarget.p][remapTarget.act] = e.code; persist();
    }
    remapTarget = null; e.preventDefault(); return;
  }
  keysDown.add(e.code);
  if (state === 'playing' && !paused) latchTap(e.code);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  handleKeyUI(e);
});
window.addEventListener('keyup', e => {
  keysDown.delete(e.code);
  if (e.code === 'Escape') {
    if (state === 'playing' && escDownAt && performance.now() - escDownAt < 700) togglePause();
    escDownAt = 0;
  }
});
window.addEventListener('blur', () => { keysDown.clear(); escDownAt = 0; if (state === 'playing' && !paused) togglePause(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopAllLoops(); if (state === 'playing' && !paused) togglePause(); }
});

// Live-held input, OR a latched tap that started+ended between two engine ticks
// (latch is written by the keydown handler so sub-160ms taps still register).
function takeInput(pi) {
  const K = save.opts.keys[pi === 0 ? 'p1' : 'p2'];
  const t = touchState.dir && pi === 0 ? touchState.dir : null;
  const dx = (keysDown.has(K.right) ? 1 : 0) - (keysDown.has(K.left) ? 1 : 0) || (t ? t.dx : 0);
  const dy = (keysDown.has(K.down) ? 1 : 0) - (keysDown.has(K.up) ? 1 : 0) || (t ? t.dy : 0);
  const fire = keysDown.has(K.fire) || (pi === 0 && touchState.fire);
  const l = latch[pi]; latch[pi] = { dx: 0, dy: 0, fire: false };
  // component-wise merge: live input wins per component, latched taps fill the gaps
  return { dx: dx || l.dx, dy: dy || l.dy, fire: fire || l.fire };
}
function latchTap(code) {
  for (let pi = 0; pi < (mode === 'team' ? 2 : 1); pi++) {
    const K = save.opts.keys[pi === 0 ? 'p1' : 'p2'];
    if (code === K.left) latch[pi].dx = -1;
    else if (code === K.right) latch[pi].dx = 1;
    else if (code === K.up) latch[pi].dy = -1;
    else if (code === K.down) latch[pi].dy = 1;
    else if (code === K.fire) latch[pi].fire = true;
  }
}

// touch: drag-anywhere joystick + fire button
const touchState = { dir: null, fire: false, id: null, sx: 0, sy: 0, pinch: 0 };
let uiHot = [];                      // clickable regions this frame
function hit(x, y) { for (const h of uiHot) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; return null; }
canvas.addEventListener('pointerdown', e => {
  initAudio(); if (ac && ac.state === 'suspended') ac.resume();
  const x = e.clientX, y = e.clientY;
  const h = hit(x, y);
  if (h) { h.cb(); SYNTH.blip && audioReady && SYNTH.blip(); return; }
  if (state === 'playing' && e.pointerType !== 'mouse') {
    if (touchState.id === null) { touchState.id = e.pointerId; touchState.sx = x; touchState.sy = y; }
  } else if (state === 'playing') {
    touchState.id = e.pointerId; touchState.sx = x; touchState.sy = y; // mouse drag-move too
  }
});
canvas.addEventListener('pointermove', e => {
  if (e.pointerId !== touchState.id) return;
  const dx = e.clientX - touchState.sx, dy = e.clientY - touchState.sy;
  const dead = 22;
  if (Math.abs(dx) > dead || Math.abs(dy) > dead) {
    touchState.dir = Math.abs(dx) > Math.abs(dy)
      ? { dx: Math.sign(dx), dy: 0 } : { dx: 0, dy: Math.sign(dy) };
  }
});
const joyRelease = e => {
  if (e.pointerId === touchState.id) { touchState.id = null; touchState.dir = null; }
  if (pinchPts.has(e.pointerId)) { pinchPts.delete(e.pointerId); pinchDist = 0; persist(); }
};
window.addEventListener('pointerup', joyRelease);
window.addEventListener('pointercancel', joyRelease);
// pinch zoom
const pinchPts = new Map();
let pinchDist = 0;
canvas.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') pinchPts.set(e.pointerId, [e.clientX, e.clientY]); });
canvas.addEventListener('pointermove', e => {
  if (!pinchPts.has(e.pointerId)) return;
  pinchPts.set(e.pointerId, [e.clientX, e.clientY]);
  if (pinchPts.size === 2 && state === 'playing') {
    const [a, b] = [...pinchPts.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (pinchDist > 0) {
      save.opts.zoom = Math.min(1.8, Math.max(0.55, save.opts.zoom * (d / pinchDist)));
      touchState.dir = null; // two fingers = zoom, not walk
    }
    pinchDist = d;
  }
});
canvas.addEventListener('wheel', e => {
  if (state !== 'playing') return;
  e.preventDefault();
  save.opts.zoom = Math.min(1.8, Math.max(0.55, save.opts.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
  persist();
}, { passive: false });

// ─── view / camera ───
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  VW = window.innerWidth; VH = window.innerHeight;
  canvas.width = VW * DPR; canvas.height = VH * DPR;
  canvas.style.width = VW + 'px'; canvas.style.height = VH + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize); resize();

const cam = { x: 0, y: 0, shake: 0, follow: 0 };  // follow: 0=p1 1=p2 2=midpoint
function camTarget() {
  if (!eng) return { x: 0, y: 0 };
  const ps = eng.players.filter(p => p.alive && !p.home);
  const pick = (i) => eng.players[Math.min(i, eng.players.length - 1)];
  let fx, fy;
  if (mode === 'team' && cam.follow === 2 && ps.length > 1) {
    fx = (ps[0].x + ps[1].x) / 2; fy = (ps[0].y + ps[1].y) / 2;
  } else {
    const p = mode === 'team' && cam.follow === 1 ? pick(1) : (ps[0] || eng.players[0]);
    fx = p.x; fy = p.y;
  }
  return { x: fx, y: fy };
}

// ─── particles ───
let parts = [];
function spawnParts(x, y, col, n, spd) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * (spd || 60);
    parts.push({ x: x + 0.5, y: y + 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 0.5 + Math.random() * 0.4, col });
  }
  if (parts.length > 400) parts.splice(0, parts.length - 400);
}

// ─── game state ───
let state = 'title';                 // title | levels | options | scores | intro | playing | clear | gameover | hsentry
let paused = false;
let mode = 'single';                 // single | team
let eng = null, level = 0, lives = 3, runScore = 0, nextLifeAt = 2000;
let finaleCave = false;   // cave with no exits (teamwork file 101, "THE END")
let awaitStart = true;    // cave physics hold until the player's first input
let lastStep = 0, stepAcc = 0;
let menuIdx = 0, levelPage = 0, optIdx = 0;
let flashMsg = null, flashUntil = 0;
let hsInitials = 'AAA', hsPos = 0;
let globalScores = null, globalFetchedAt = 0;
let clearStats = null, statusFlash = 0;
let touchControls = ('ontouchstart' in window);

function flash(msg, ms) { flashMsg = msg; flashUntil = performance.now() + (ms || 1800); }

function caveFileFor(lv, m) { return m === 'team' ? (lv % 4 === 0 ? 81 + lv / 4 : lv) : lv; }
function handicap() { return mode === 'team' ? save.hT : save.h1; }
function unlockedMax() { return save.opts.tester ? MAX_LEVEL : handicap(); }
function anyGameInput() {
  if (touchState.dir || touchState.fire) return true;
  for (const P of [save.opts.keys.p1, mode === 'team' ? save.opts.keys.p2 : null]) {
    if (!P) continue;
    if (keysDown.has(P.up) || keysDown.has(P.down) || keysDown.has(P.left) ||
        keysDown.has(P.right) || keysDown.has(P.fire)) return true;
  }
  return latch.some(l => l.dx || l.dy || l.fire);
}

function startLevel(lv) {
  const file = caveFileFor(lv, mode);
  const bytes = Uint8Array.from(atob(EM2_CAVE_B64[file]), c => c.charCodeAt(0));
  const cave = parseCave(bytes, { EM_RAW_TO_NAME, EM_RAW_GLYPH, EM_V4_CANON, EM_EATER_TO_NAME });
  eng = new EMEngine(cave, { players: mode === 'team' ? 2 : 1, seed: (Date.now() & 0xffffffff) >>> 0 });
  level = lv;
  finaleCave = !cave.grid.some(e => e === EL.exit_closed || e === EL.exit_open);
  awaitStart = true;
  state = 'intro'; paused = false; escDownAt = 0;
  latch = [{ dx: 0, dy: 0, fire: false }, { dx: 0, dy: 0, fire: false }];
  stepAcc = 0; lastStep = performance.now();
  parts = []; cam.shake = 0;
  cam.follow = mode === 'team' ? 2 : 0;
  const t = camTarget(); cam.x = t.x; cam.y = t.y;
  stopMusic(); stopAllLoops();
}
function startRun(lv) {
  lives = 3; runScore = 0; nextLifeAt = 2000;
  startLevel(lv);
}
function backToTitle() { state = 'title'; menuIdx = 0; eng = null; paused = false; escDownAt = 0; stopAllLoops(); startMusic(); }

function onLevelEnd() {
  if (eng.status === 'solved') {
    runScore += eng.score;
    while (runScore >= nextLifeAt) { lives++; nextLifeAt += 2000; playSfx('extralife'); flash('EXTRA LIFE!'); }
    const hk = mode === 'team' ? 'hT' : 'h1';
    if (level + 1 > save[hk]) save[hk] = Math.min(level + 1, MAX_LEVEL);
    const bk = mode + level;
    if (!save.best[bk] || eng.score > save.best[bk]) save.best[bk] = eng.score;
    persist();
    clearStats = { score: eng.score, bonus: eng.bonus, timeLeft: eng.timeLeft, level };
    state = 'clear';
  } else if (finaleCave) {
    // "THE END" cave has no exit by design — surviving it IS the completion
    runScore += eng.score;
    clearStats = { score: eng.score, bonus: 0, timeLeft: 0, level };
    state = 'clear';
  } else {
    lives--;
    if (lives > 0) { flash('LIFE LOST — ' + lives + ' LEFT'); startLevel(level); }
    else {
      state = 'gameover';
      stopAllLoops();
      if (qualifiesLocal(runScore)) { state = 'hsentry'; hsInitials = 'AAA'; hsPos = 0; }
    }
  }
}

// high scores
function qualifiesLocal(sc) { return sc > 0 && (save.scores.length < 10 || sc > save.scores[save.scores.length - 1].score); }
function addLocalScore(initials, sc, lv) {
  save.scores.push({ initials, score: sc, level: lv, id: Date.now() });
  save.scores.sort((a, b) => b.score - a.score); save.scores = save.scores.slice(0, 10); persist();
}
async function fetchGlobal() {
  if (globalScores && performance.now() - globalFetchedAt < 30000) return;
  try {
    const r = await fetch(LB_URL, { signal: AbortSignal.timeout(5000) });
    globalScores = (await r.json()).slice(0, 10); globalFetchedAt = performance.now();
  } catch (e) { globalScores = globalScores || []; }
}
async function postGlobal(initials, sc, lv) {
  try {
    await fetch(LB_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score: sc, level: lv }) });
    globalFetchedAt = 0; fetchGlobal();
  } catch (e) {}
}

// ─── engine stepping ───
function gameTick() {
  const inputs = [takeInput(0), mode === 'team' ? takeInput(1) : {}];
  // hold-ESC / touch restart => blow up (costs a life via death flow)
  if (escDownAt && performance.now() - escDownAt > 800) { eng.abort(); escDownAt = 0; flash('RESTARTING…'); }
  eng.step(inputs[0], inputs[1]);
  processEngineEvents();
  if (eng.status !== 'playing' && state === 'playing') {
    state = 'ending';
    endingAt = performance.now() + (eng.status === 'solved' ? 400 : 1000);
  }
}
let endingAt = 0;
const GLOBAL_SND = new Set(['time', 'exit_open', 'die', 'exit']);  // never viewport-gated
function processEngineEvents() {
  const vis = visibleRect();
  const seen = new Set();
  for (const s of eng.sounds) {
    if (seen.has(s.s)) continue;
    const sx = (s.i % GW) - 1, sy = ((s.i / GW) | 0) - 1;
    if (!GLOBAL_SND.has(s.s) &&
        (sx < vis.x0 - 2 || sx > vis.x1 + 2 || sy < vis.y0 - 2 || sy > vis.y1 + 2)) continue;
    seen.add(s.s);
    playSfx(s.s);
    if (s.s === 'boom') { cam.shake = Math.min(10, cam.shake + 6); spawnParts(sx, sy, '#ff8833', 10, 90); }
    if (s.s === 'collect') spawnParts(sx, sy, '#55dd55', 6, 50);
    if (s.s === 'dirt') spawnParts(sx, sy, '#bb5522', 4, 35);
    if (s.s === 'crack') spawnParts(sx, sy, '#e8d9b8', 5, 45);
    if (s.s === 'acid') spawnParts(sx, sy, '#ff6600', 5, 55);
  }
}

// ─── rendering ───
function visibleRect() {
  TILE = Math.round(40 * save.opts.zoom);
  const tw = VW / TILE, th = VH / TILE;
  return {
    x0: Math.floor(cam.x - tw / 2) - 1, x1: Math.ceil(cam.x + tw / 2) + 1,
    y0: Math.floor(cam.y - th / 2) - 1, y1: Math.ceil(cam.y + th / 2) + 1,
  };
}
function worldToScreen(wx, wy) {
  return [VW / 2 + (wx - cam.x) * TILE + (Math.random() - 0.5) * cam.shake,
          VH / 2 + (wy - cam.y) * TILE + (Math.random() - 0.5) * cam.shake];
}

function drawPlayfield(now) {
  const interp = Math.min(1, (now - lastStep) / STEP_MS);
  const frame = Math.floor(now / 110) % 8;
  // camera
  const t = camTarget();
  cam.x += (t.x + 0.5 - cam.x) * 0.12; cam.y += (t.y + 0.5 - cam.y) * 0.12;
  // clamp camera to cave bounds; if the whole cave fits on screen, center it
  const tw = VW / TILE / 2, th = VH / TILE / 2;
  if (tw - 1 >= CW - tw + 1) cam.x = CW / 2;
  else cam.x = Math.max(Math.min(cam.x, CW - tw + 1), tw - 1);
  if (th - 1 >= CH - th + 2) cam.y = CH / 2;
  else cam.y = Math.max(Math.min(cam.y, CH - th + 2), th - 1);
  if (cam.shake > 0) cam.shake *= 0.88;

  // backdrop
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  if (IMG['cave-bg'].complete) {
    ctx.globalAlpha = 0.35;
    ctx.drawImage(IMG['cave-bg'], -((cam.x * 6) % 100), -((cam.y * 6) % 60), VW + 120, VH + 80);
    ctx.globalAlpha = 1;
  }

  const vis = visibleRect();
  const movedTo = new Set(); for (const m of eng.moves) movedTo.add(m.t);
  const wwActive = eng.wonderwallActive && eng.wonderwallTime > 0;

  for (let y = Math.max(0, vis.y0); y <= Math.min(CH - 1, vis.y1); y++) {
    for (let x = Math.max(0, vis.x0); x <= Math.min(CW - 1, vis.x1); x++) {
      const i = IDX(x, y), e = eng.grid[i];
      if (movedTo.has(i)) continue;
      const name = EL_NAMES[e];
      if (name === 'blank' || name === 'player' || name === 'vanish' || name === 'claimed' || name === 'fake_blank') continue;
      const variant = (x * 7 + y * 13) % 4;
      const active = name === 'wonderwall' ? wwActive : (name === 'wheel' ? eng.wheelCnt > 0 : false);
      const glyph = name === 'letter' ? eng.glyphs[i] : undefined;
      const [sx, sy] = worldToScreen(x, y);
      ctx.drawImage(tileSprite(name, variant, frame, active, glyph), sx, sy, TILE + 0.5, TILE + 0.5);
    }
  }
  // movers (interpolated)
  for (const m of eng.moves) {
    const fx = (m.f % GW) - 1, fy = ((m.f / GW) | 0) - 1;
    const tx = (m.t % GW) - 1, ty = ((m.t / GW) | 0) - 1;
    const wx = fx + (tx - fx) * interp, wy = fy + (ty - fy) * interp;
    const [sx, sy] = worldToScreen(wx, wy);
    if (m.el === EL.player) {
      drawPlayer(m.pl, sx, sy, true, now);
    } else {
      const name = EL_NAMES[m.el];
      ctx.drawImage(tileSprite(name, 0, frame, false), sx, sy, TILE + 0.5, TILE + 0.5);
    }
  }
  // idle players
  for (const p of eng.players) {
    if (!p.alive || p.home) continue;
    if (eng.moves.some(m => m.pl === p)) continue;
    if (eng.grid[p.idx] !== EL.player && !(eng.grid[p.idx] >= EL.dyn1 && eng.grid[p.idx] <= EL.dyn4)) continue;
    const [sx, sy] = worldToScreen(p.x, p.y);
    drawPlayer(p, sx, sy, false, now);
  }
  // particles
  const dt = 1 / 60;
  parts = parts.filter(pt => (pt.life -= dt) > 0);
  for (const pt of parts) {
    pt.x += pt.vx * dt / TILE; pt.y += pt.vy * dt / TILE; pt.vy += 240 * dt;
    const [sx, sy] = worldToScreen(pt.x, pt.y);
    ctx.globalAlpha = Math.min(1, pt.life * 2);
    ctx.fillStyle = pt.col; ctx.fillRect(sx, sy, Math.max(2, TILE / 14), Math.max(2, TILE / 14));
  }
  ctx.globalAlpha = 1;
}
function drawPlayer(p, sx, sy, walking, now) {
  const pi = eng.players.indexOf(p);
  const walk = walking ? Math.floor(now / 90) % 2 : 0;
  const key = `pl:${pi}:${p.face}:${walk}:${p.acting ? 1 : 0}`;
  const spr = atlas.get(key, (c, S) => P.playerSpr(p.face, walk, pi === 1, p.acting)(c, S));
  ctx.drawImage(spr, sx, sy, TILE + 0.5, TILE + 0.5);
}

// HUD
function drawHUD(now) {
  const h = Math.max(34, Math.min(48, VH * 0.055));
  ctx.fillStyle = 'rgba(0,0,0,.82)'; ctx.fillRect(0, VH - h, VW, h);
  ctx.strokeStyle = '#0a0'; ctx.lineWidth = 1; ctx.strokeRect(-1, VH - h, VW + 2, h + 2);
  const fs = Math.floor(h * 0.52);
  ctx.font = `700 ${fs}px 'Courier New', monospace`;
  ctx.textBaseline = 'middle'; const ty = VH - h / 2;
  ctx.textAlign = 'left'; ctx.fillStyle = '#00aa00';
  const timeStr = eng.timed ? String(eng.timeLeft).padStart(3, '0') : String(eng.timeElapsed).padStart(3, '0');
  const warn = eng.timed && eng.timeLeft <= 30 && Math.floor(now / 400) % 2 === 0;
  ctx.fillStyle = warn ? '#ff3333' : '#00aa00';
  ctx.fillText('TIME:' + timeStr, 12, ty);
  ctx.fillStyle = '#00aa00';
  ctx.fillText('SCORE:' + String(eng.score).padStart(4, '0'), 12 + fs * 6.2, ty);
  const gemFlash = eng.gemsNeeded === 0 && Math.floor(now / 350) % 2 === 0;
  ctx.fillStyle = gemFlash ? '#55dd55' : '#00aa00';
  ctx.fillText('EMERALDS:' + String(eng.gemsNeeded).padStart(3, '0'), 12 + fs * 12.4, ty);
  // right side: lives, dynamite, keys
  ctx.textAlign = 'right';
  let rx = VW - 12;
  ctx.fillStyle = '#ff5555';
  ctx.fillText('♥'.repeat(Math.min(lives, 5)), rx, ty); rx -= fs * (Math.min(lives, 5) * 0.62 + 0.8);
  const KEYC = ['#ff3333', '#eecc22', '#33cc44', '#3366ff'];
  for (let pi = eng.players.length - 1; pi >= 0; pi--) {
    const p = eng.players[pi];
    for (let k = 3; k >= 0; k--) {
      if (p.keys & (1 << k)) { ctx.fillStyle = KEYC[k]; ctx.fillText('⚿', rx, ty); rx -= fs * 0.9; }
    }
    if (p.dynamite > 0) { ctx.fillStyle = '#ff2222'; ctx.fillText('▮' + p.dynamite, rx, ty); rx -= fs * 2.0; }
    if (mode === 'team' && (p.dynamite > 0 || p.keys)) {
      ctx.fillStyle = pi === 1 ? '#ff8888' : '#88ff88';
      ctx.fillText('P' + (pi + 1), rx, ty); rx -= fs * 1.6;
    }
  }
  // status line
  let status = null;
  if (mode === 'team' && eng.players.some(p => !p.alive)) status = Math.floor(now / 500) % 2 ? 'FORGET IT' : null;
  else if (finaleCave) status = 'THE END';
  else if (eng.gemsNeeded === 0 && eng.status === 'playing') status = 'FIND THE EXIT';
  if (status) {
    ctx.textAlign = 'center'; ctx.fillStyle = '#55dd55';
    ctx.font = `700 ${fs * 0.9}px 'Courier New', monospace`;
    ctx.fillText(status, VW / 2, VH - h - fs * 0.8);
  }
  // touch buttons
  if (touchControls && state === 'playing') {
    uiBtn(VW - 64, 10, 54, 44, '⏸', () => togglePause());
    uiBtn(VW - 126, 10, 54, 44, '↻', () => { eng.abort(); flash('RESTARTING…'); });
    // fire button
    const fb = { x: VW - 86, y: VH - h - 96, w: 76, h: 76 };
    ctx.fillStyle = touchState.fire ? 'rgba(255,80,80,.5)' : 'rgba(255,80,80,.25)';
    ctx.beginPath(); ctx.arc(fb.x + fb.w / 2, fb.y + fb.h / 2, fb.w / 2, 0, 7); ctx.fill();
    ctx.strokeStyle = '#ff5555'; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '700 15px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('FIRE', fb.x + fb.w / 2, fb.y + fb.h / 2);
    uiHot.push({ ...fb, cb: () => {}, isFire: true });
  }
}

// generic UI button (canvas)
function uiBtn(x, y, w, h, label, cb, style) {
  ctx.fillStyle = style?.bg || 'rgba(20,40,20,.8)';
  rr(ctx, x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = style?.border || '#0a0'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = style?.fg || '#55dd55';
  ctx.font = style?.font || `700 ${Math.floor(h * 0.45)}px 'Courier New', monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  uiHot.push({ x, y, w, h, cb });
}

// fire button press tracking (pointer over the fire circle) — track its pointerId
let firePointerId = null;
canvas.addEventListener('pointerdown', e => {
  const h = uiHot.find(r => r.isFire && e.clientX >= r.x && e.clientX <= r.x + r.w && e.clientY >= r.y && e.clientY <= r.y + r.h);
  if (h) { touchState.fire = true; firePointerId = e.pointerId; }
});
const fireRelease = e => {
  if (firePointerId === null || e.pointerId === firePointerId) { touchState.fire = false; firePointerId = null; }
};
window.addEventListener('pointerup', fireRelease);
window.addEventListener('pointercancel', fireRelease);

// ─── screens ───
function text(str, x, y, size, col, align, font) {
  ctx.font = `700 ${size}px ${font || "'Courier New', monospace"}`;
  ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.fillText(str, x, y);
}
function text3d(str, x, y, size, col) {
  ctx.font = `900 ${size}px 'Courier New', monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#001133'; ctx.fillText(str, x + size / 12, y + size / 12);
  ctx.fillStyle = col; ctx.fillText(str, x, y);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillText(str, x - size / 26, y - size / 26);
}

function drawTitle(now) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  if (IMG['title-art'].complete) {
    const im = IMG['title-art'], ar = im.width / im.height, war = VW / VH;
    let dw = VW, dh = VW / ar; if (dh < VH) { dh = VH; dw = VH * ar; }
    ctx.globalAlpha = 0.85;
    ctx.drawImage(im, (VW - dw) / 2, (VH - dh) / 2, dw, dh);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, VW, VH);
  }
  const cy = VH * 0.16;
  text3d('EMERALD MINE II', VW / 2, cy, Math.min(64, VW / 10), '#0ca');
  text('© 1988 KINGSOFT — BROWSER REMASTER ' + VERSION, VW / 2, cy + Math.min(64, VW / 10) * 0.75, 13, '#7a7');
  const items = [
    ['MODE: ' + (mode === 'single' ? '1 PLAYER' : 'TEAMWORK (2P)'), () => { mode = mode === 'single' ? 'team' : 'single'; }],
    ['START — LEVEL ' + Math.min(handicap(), MAX_LEVEL), () => startRun(Math.min(handicap(), MAX_LEVEL))],
    ['LEVEL SELECT', () => { state = 'levels'; levelPage = Math.floor(Math.min(handicap(), MAX_LEVEL) / 20); }],
    ['HIGH SCORES', () => { state = 'scores'; fetchGlobal(); }],
    ['HOW TO PLAY', () => { state = 'help'; }],
    ['OPTIONS', () => { state = 'options'; optIdx = 0; }],
  ];
  const iy = VH * 0.42, ih = Math.min(52, VH * 0.075);
  items.forEach(([label, cb], i) => {
    const sel = i === menuIdx;
    const w = Math.min(430, VW * 0.85);
    uiBtn(VW / 2 - w / 2, iy + i * (ih + 8), w, ih, label, cb, {
      bg: sel ? 'rgba(0,80,40,.85)' : 'rgba(0,25,15,.75)',
      border: sel ? '#5f5' : '#0a0',
      fg: sel ? '#aaffaa' : '#55dd55',
    });
  });
  text('HANDICAP ' + handicap() + '   ARROWS + ENTER — OR TAP', VW / 2, iy + items.length * (ih + 8) + 18, 12, '#697');
  if (mode === 'team') text('P1: ARROWS+SPACE   P2: WASD+SHIFT — BOTH MUST EXIT (DIFFERENT DOORS)', VW / 2, VH - 22, 12, '#7a7');
  titleMenuItems = items;
}
let titleMenuItems = [];

function drawLevels() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  drawBg();
  text3d('SELECT LEVEL', VW / 2, 50, 34, '#0ca');
  text((mode === 'single' ? '1 PLAYER' : 'TEAMWORK') + ' — REACHED ' + handicap() +
    (save.opts.tester ? '  ·  ALL LEVELS' : ''), VW / 2, 86, 14, save.opts.tester ? '#ffcc44' : '#7a7');
  const per = 20, pages = Math.ceil((MAX_LEVEL + 1) / per);
  const cols = 5, rows = 4;
  const bw = Math.min(96, (VW - 60) / cols - 10), bh = 46;
  const gx = VW / 2 - (cols * (bw + 10)) / 2;
  const gy = Math.max(120, (VH - rows * (bh + 10)) / 2 - 40);
  for (let i = 0; i < per; i++) {
    const lv = levelPage * per + i; if (lv > MAX_LEVEL) break;
    const cx = gx + (i % cols) * (bw + 10), cyy = gy + Math.floor(i / cols) * (bh + 10);
    const unlocked = lv <= unlockedMax();
    const isTW4 = mode === 'team' && lv % 4 === 0;
    uiBtn(cx, cyy, bw, bh, String(lv) + (isTW4 ? '•' : ''), () => { if (unlocked) startRun(lv); }, {
      bg: unlocked ? 'rgba(0,60,30,.85)' : 'rgba(30,30,30,.7)',
      border: unlocked ? '#0a0' : '#444',
      fg: unlocked ? '#55dd55' : '#555',
    });
  }
  if (levelPage > 0) uiBtn(gx - 56, gy + 60, 44, 60, '<', () => levelPage--);
  if (levelPage < pages - 1) uiBtn(gx + cols * (bw + 10) + 8, gy + 60, 44, 60, '>', () => levelPage++);
  if (mode === 'team') text('• = DEDICATED TEAMWORK CAVE', VW / 2, gy + rows * (bh + 10) + 16, 12, '#7a7');
  uiBtn(VW / 2 - 90, VH - 74, 180, 46, 'BACK', () => backToTitle());
}

function drawBg() {
  if (IMG['cave-bg'].complete) {
    ctx.globalAlpha = 0.5; ctx.drawImage(IMG['cave-bg'], 0, 0, VW, VH); ctx.globalAlpha = 1;
  }
}

const OPT_ROWS = () => [
  ['SFX VOLUME', () => Math.round(save.opts.sfx * 100) + '%', d => { save.opts.sfx = Math.min(1, Math.max(0, save.opts.sfx + d * 0.1)); if (sfxGain) sfxGain.gain.value = save.opts.sfx; }],
  ['MUSIC VOLUME', () => Math.round(save.opts.mus * 100) + '%', d => { save.opts.mus = Math.min(1, Math.max(0, save.opts.mus + d * 0.1)); if (musGain) musGain.gain.value = save.opts.mus; }],
  ['CRT FILTER', () => save.opts.crt ? 'ON' : 'OFF', () => { save.opts.crt = !save.opts.crt; }],
  ['ZOOM', () => Math.round(save.opts.zoom * 100) + '%', d => { save.opts.zoom = Math.min(1.8, Math.max(0.55, save.opts.zoom + d * 0.1)); }],
  ['P1 UP', () => keyName('p1', 'up'), () => { remapTarget = { p: 'p1', act: 'up' }; }],
  ['P1 DOWN', () => keyName('p1', 'down'), () => { remapTarget = { p: 'p1', act: 'down' }; }],
  ['P1 LEFT', () => keyName('p1', 'left'), () => { remapTarget = { p: 'p1', act: 'left' }; }],
  ['P1 RIGHT', () => keyName('p1', 'right'), () => { remapTarget = { p: 'p1', act: 'right' }; }],
  ['P1 FIRE', () => keyName('p1', 'fire'), () => { remapTarget = { p: 'p1', act: 'fire' }; }],
  ['P2 UP', () => keyName('p2', 'up'), () => { remapTarget = { p: 'p2', act: 'up' }; }],
  ['P2 DOWN', () => keyName('p2', 'down'), () => { remapTarget = { p: 'p2', act: 'down' }; }],
  ['P2 LEFT', () => keyName('p2', 'left'), () => { remapTarget = { p: 'p2', act: 'left' }; }],
  ['P2 RIGHT', () => keyName('p2', 'right'), () => { remapTarget = { p: 'p2', act: 'right' }; }],
  ['P2 FIRE', () => keyName('p2', 'fire'), () => { remapTarget = { p: 'p2', act: 'fire' }; }],
  ['ALL LEVELS (PASS:1234)', () => save.opts.tester ? 'ON' : 'OFF', () => {
    if (save.opts.tester) { save.opts.tester = false; flash('ALL-LEVELS UNLOCK OFF'); return; }
    const p = window.prompt('Enter password:') || '';
    if (p.trim() === '1234') { save.opts.tester = true; flash('ALL LEVELS UNLOCKED'); }
    else if (p) flash('WRONG PASSWORD');
  }],
  ['RESET PROGRESS', () => '', () => { if (confirm('Reset all progress and scores?')) { save.h1 = 0; save.hT = 0; save.best = {}; save.scores = []; save.opts.tester = false; persist(); } }],
];
function keyName(p, act) {
  const k = save.opts.keys[p][act];
  return remapTarget && remapTarget.p === p && remapTarget.act === act ? 'PRESS KEY…' : k.replace('Key', '').replace('Arrow', '').replace('Left', 'L').replace('Right', 'R').toUpperCase();
}
function drawOptions() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); drawBg();
  text3d('OPTIONS', VW / 2, 44, 32, '#0ca');
  const rows = OPT_ROWS();
  const rh = Math.min(34, (VH - 160) / rows.length);
  rows.forEach(([label, val, act], i) => {
    const y = 86 + i * rh, sel = i === optIdx;
    ctx.fillStyle = sel ? 'rgba(0,70,35,.7)' : 'transparent';
    if (sel) { rr(ctx, VW / 2 - 240, y - rh / 2 + 2, 480, rh - 3, 6); ctx.fill(); }
    text(label, VW / 2 - 220, y, Math.floor(rh * 0.52), sel ? '#aaffaa' : '#55dd55', 'left');
    text(val(), VW / 2 + 220, y, Math.floor(rh * 0.52), sel ? '#aaffaa' : '#99bbff', 'right');
    uiHot.push({ x: VW / 2 - 240, y: y - rh / 2, w: 480, h: rh, cb: () => { optIdx = i; act(1); persist(); } });
  });
  uiBtn(VW / 2 - 90, VH - 60, 180, 44, 'BACK', () => { persist(); backToTitle(); });
  text('ENTER/CLICK = CHANGE   ←/→ = ADJUST', VW / 2, VH - 88, 12, '#7a7');
}

const HELP_LINES = [
  ['GOAL', 'Collect emeralds (diamonds count as 3) until the counter hits 0, then reach the flashing exit before time runs out.'],
  ['MOVE', 'Arrow keys (P2: WASD) or drag anywhere on touch. The cave starts on your first move.'],
  ['FIRE', 'Hold FIRE + a direction to grab an adjacent tile without moving. Hold FIRE standing still to plant dynamite — then RUN.'],
  ['STONES', 'Stones fall and roll; gems roll off walls too. A falling stone kills — a resting one never will. Push stones sideways.'],
  ['ENEMIES', 'Drop stones on them: bugs burst into gems, tanks into nothing, eaters into surprises. Bugs and tanks kill on touch — even adjacent. Aliens hunt you: press the wheel to distract them.'],
  ['CAVE', 'Amoeba grows and drips; bugs/tanks touching it explode. The magic wall transmutes falling stones→emeralds→diamonds→stones, once. Acid dissolves everything. Keys open matching doors.'],
  ['RESTART', 'Stuck? Press R or hold ESC to blow up and retry the level (costs a life). 3 lives per run, extra life every 2000 points.'],
  ['TEAMWORK', '2 players, one keyboard. Each player must leave by a DIFFERENT exit. F1/F2/F3 switch the camera.'],
];
function drawHelp() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); drawBg();
  text3d('HOW TO PLAY', VW / 2, 44, 32, '#0ca');
  const w = Math.min(760, VW - 40);
  const x0 = VW / 2 - w / 2, labW = Math.min(110, w * 0.16);
  const fs = Math.max(11, Math.min(15, VH / 46));
  let y = 86;
  ctx.textBaseline = 'top';
  for (const [label, body] of HELP_LINES) {
    ctx.font = `700 ${fs}px 'Courier New', monospace`;
    ctx.textAlign = 'left'; ctx.fillStyle = '#ffcc44';
    ctx.fillText(label, x0, y);
    ctx.fillStyle = '#8fdd8f';
    // word-wrap body
    const words = body.split(' ');
    let line = '', ly = y;
    for (const wd of words) {
      const trial = line ? line + ' ' + wd : wd;
      if (ctx.measureText(trial).width > w - labW - 10) {
        ctx.fillText(line, x0 + labW, ly); ly += fs + 4; line = wd;
      } else line = trial;
    }
    ctx.fillText(line, x0 + labW, ly);
    y = ly + fs + 12;
  }
  ctx.textBaseline = 'middle';
  uiBtn(VW / 2 - 90, Math.min(VH - 60, y + 16), 180, 44, 'BACK', () => backToTitle());
}

function drawScores(now) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  // copper bars homage
  for (let i = 0; i < 12; i++) {
    const hue = (i * 30 + now / 20) % 360;
    ctx.fillStyle = `hsla(${hue},80%,35%,.25)`;
    ctx.fillRect(0, i * VH / 12, VW, VH / 24);
  }
  text3d('HIGH SCORES', VW / 2, 46, 34, '#0ca');
  const colW = Math.min(380, VW * 0.44);
  const lx = VW / 2 - colW - 10, gx2 = VW / 2 + 10;
  text('LOCAL', lx + colW / 2, 92, 18, '#55dd55');
  text('GLOBAL', gx2 + colW / 2, 92, 18, '#99bbff');
  const fs = Math.min(17, VH / 34);
  for (let i = 0; i < 10; i++) {
    const y = 120 + i * (fs + 9);
    const L = save.scores[i];
    text(L ? `${i + 1}. ${L.initials}  L${L.level}  ${L.score}` : `${i + 1}. ---`, lx + 10, y, fs, '#55dd55', 'left');
    const G = globalScores && globalScores[i];
    text(G ? `${i + 1}. ${G.initials}  L${G.level ?? '?'}  ${G.score}` : `${i + 1}. ${globalScores ? '---' : '…'}`, gx2 + 10, y, fs, '#99bbff', 'left');
  }
  uiBtn(VW / 2 - 90, VH - 64, 180, 46, 'BACK', () => backToTitle());
}

function drawIntro(now) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); drawBg();
  const file = caveFileFor(level, mode);
  text3d('LEVEL ' + level, VW / 2, VH * 0.3, 52, '#0ca');
  if (mode === 'team' && level % 4 === 0) text('DEDICATED TEAMWORK CAVE', VW / 2, VH * 0.3 + 42, 14, '#99bbff');
  const c = eng.cave;
  text('EMERALDS NEEDED: ' + c.gemsNeeded, VW / 2, VH * 0.46, 20, '#55dd55');
  text(c.timeSeconds ? 'TIME: ' + c.timeSeconds + 's' : 'NO TIME LIMIT', VW / 2, VH * 0.46 + 30, 20, '#55dd55');
  const bk = mode + level;
  if (save.best[bk]) text('BEST: ' + save.best[bk], VW / 2, VH * 0.46 + 60, 16, '#99bbff');
  text('LIVES: ' + '♥'.repeat(Math.min(lives, 8)), VW / 2, VH * 0.46 + 92, 18, '#ff5555');
  if (level === 0 && file === 0) text('TIP: THAT DYNAMITE IS LIT. RUN.', VW / 2, VH * 0.66, 15, '#ffcc44');
  if (level === 73 && mode === 'single') text('GEM QUOTA PATCHED — THE 1988 RELEASE SHIPPED THIS CAVE UNSOLVABLE', VW / 2, VH * 0.66, 13, '#ffcc44');
  const blink = Math.floor(now / 450) % 2 === 0;
  if (blink) text(touchControls ? 'TAP TO START' : 'PRESS ENTER / SPACE', VW / 2, VH * 0.78, 18, '#aaffaa');
  uiHot.push({ x: 0, y: 0, w: VW, h: VH, cb: () => { state = 'playing'; lastStep = performance.now(); } });
}

function drawClear(now) {
  drawPlayfield(now); drawHUD(now);
  ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillRect(0, 0, VW, VH);
  text3d('LEVEL ' + clearStats.level + ' CLEAR!', VW / 2, VH * 0.3, 44, '#0ca');
  text('SCORE: ' + clearStats.score, VW / 2, VH * 0.46, 22, '#55dd55');
  if (clearStats.bonus) text('TIME BONUS: +' + clearStats.bonus + '  (' + clearStats.timeLeft + 's LEFT)', VW / 2, VH * 0.46 + 32, 16, '#99bbff');
  text('RUN TOTAL: ' + runScore, VW / 2, VH * 0.46 + 64, 18, '#aaffaa');
  const nxt = clearStats.level + 1;
  if (nxt <= MAX_LEVEL) {
    uiBtn(VW / 2 - 150, VH * 0.68, 300, 52, 'NEXT — LEVEL ' + nxt, () => startLevel(nxt));
  } else {
    text3d('YOU BEAT EMERALD MINE II!', VW / 2, VH * 0.62, 30, '#ffcc44');
  }
  uiBtn(VW / 2 - 110, VH * 0.68 + 64, 220, 44, 'MENU', () => finishRun());
}
function finishRun() {
  if (qualifiesLocal(runScore)) { state = 'hsentry'; hsInitials = 'AAA'; hsPos = 0; }
  else backToTitle();
}

function drawGameOver(now) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); drawBg();
  text3d('GAME OVER', VW / 2, VH * 0.35, 52, '#c33');
  text('SCORE: ' + runScore + '   LEVEL ' + level, VW / 2, VH * 0.5, 22, '#55dd55');
  uiBtn(VW / 2 - 130, VH * 0.62, 260, 50, 'TRY AGAIN', () => startRun(level));
  uiBtn(VW / 2 - 110, VH * 0.62 + 62, 220, 44, 'MENU', () => backToTitle());
}

function drawHsEntry(now) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); drawBg();
  text3d('NEW HIGH SCORE!', VW / 2, VH * 0.28, 38, '#ffcc44');
  text(String(runScore), VW / 2, VH * 0.38, 30, '#55dd55');
  const fs = 56;
  for (let i = 0; i < 3; i++) {
    const x = VW / 2 + (i - 1) * fs * 1.3;
    const sel = i === hsPos && Math.floor(now / 300) % 2 === 0;
    text(hsInitials[i], x, VH * 0.52, fs, sel ? '#aaffaa' : '#55dd55');
    ctx.strokeStyle = i === hsPos ? '#5f5' : '#0a0';
    ctx.strokeRect(x - fs * 0.5, VH * 0.52 - fs * 0.55, fs, fs * 1.1);
    uiHot.push({ x: x - fs * 0.5, y: VH * 0.52 - fs * 0.55 - 30, w: fs, h: 30, cb: () => bumpInitial(i, 1) });
    uiHot.push({ x: x - fs * 0.5, y: VH * 0.52 + fs * 0.55, w: fs, h: 30, cb: () => bumpInitial(i, -1) });
  }
  text('TYPE INITIALS — ENTER TO SAVE', VW / 2, VH * 0.68, 14, '#7a7');
  uiBtn(VW / 2 - 110, VH * 0.74, 220, 48, 'SAVE', () => commitHs());
}
function bumpInitial(i, d) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
  const cur = A.indexOf(hsInitials[i]);
  const nx = (cur + d + A.length) % A.length;
  hsInitials = hsInitials.slice(0, i) + A[nx] + hsInitials.slice(i + 1);
}
function commitHs() {
  addLocalScore(hsInitials, runScore, level);
  postGlobal(hsInitials, runScore, level);
  state = 'scores'; fetchGlobal();
}

function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(0, 0, VW, VH);
  text3d('PAUSED', VW / 2, VH * 0.3, 44, '#0ca');
  uiBtn(VW / 2 - 130, VH * 0.44, 260, 50, 'RESUME', () => togglePause());
  uiBtn(VW / 2 - 130, VH * 0.44 + 62, 260, 50, 'RESTART LEVEL (-1 ♥)', () => { togglePause(); eng.abort(); });
  uiBtn(VW / 2 - 130, VH * 0.44 + 124, 260, 50, 'QUIT TO MENU', () => backToTitle());
}
function togglePause() {
  if (state !== 'playing' && !paused) return;
  paused = !paused;
  if (paused) stopAllLoops();
  else lastStep = performance.now();
}

// ESC hold indicator
function drawEscHold(now) {
  if (!escDownAt || state !== 'playing' || paused) return;
  const t = Math.min(1, (now - escDownAt) / 800);
  if (t < 0.15) return;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; rr(ctx, VW / 2 - 120, 24, 240, 40, 8); ctx.fill();
  ctx.fillStyle = '#333'; rr(ctx, VW / 2 - 104, 40, 208, 10, 5); ctx.fill();
  ctx.fillStyle = '#ff5555'; rr(ctx, VW / 2 - 104, 40, 208 * t, 10, 5); ctx.fill();
  text('HOLD ESC TO RESTART', VW / 2, 34, 12, '#ffaaaa');
}

// CRT overlay
let crtCanvas = null;
function drawCRT() {
  if (!save.opts.crt) return;
  if (!crtCanvas || crtCanvas.height !== VH * 2) {
    crtCanvas = document.createElement('canvas'); crtCanvas.width = 4; crtCanvas.height = VH * 2;
    const c2 = crtCanvas.getContext('2d');
    for (let y = 0; y < VH * 2; y += 3) { c2.fillStyle = 'rgba(0,0,0,.22)'; c2.fillRect(0, y, 4, 1); }
  }
  ctx.drawImage(crtCanvas, 0, 0, VW, VH);
  const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH / 3, VW / 2, VH / 2, VH);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.4)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
}

// ─── keyboard UI navigation ───
function handleKeyUI(e) {
  const code = e.code;
  // OS auto-repeat must never drive state transitions (held ESC from a restart
  // would repeat into the next screen and silently abandon the run)
  if (e.repeat && (code === 'Escape' || code === 'Enter' || code === 'Space')) return;
  if (state === 'playing') {
    if (code === 'Escape') { if (!escDownAt) escDownAt = performance.now(); }
    if (code === 'KeyP') togglePause();
    if (code === 'KeyR') { eng.abort(); flash('RESTARTING…'); }
    if (code === 'KeyM') backToTitle();
    if (mode === 'team') {
      if (code === 'F1') { cam.follow = 0; e.preventDefault(); }
      if (code === 'F2') { cam.follow = 1; e.preventDefault(); }
      if (code === 'F3') { cam.follow = 2; e.preventDefault(); }
    }
    return;
  }
  if (paused) { if (code === 'Escape' || code === 'KeyP') togglePause(); return; }
  if (state === 'title') {
    if (code === 'ArrowUp') { menuIdx = (menuIdx + titleMenuItems.length - 1) % titleMenuItems.length; SYNTH.blip && audioReady && SYNTH.blip(); }
    if (code === 'ArrowDown') { menuIdx = (menuIdx + 1) % titleMenuItems.length; SYNTH.blip && audioReady && SYNTH.blip(); }
    if (code === 'Enter' || code === 'Space') { initAudio(); titleMenuItems[menuIdx] && titleMenuItems[menuIdx][1](); }
    if (code === 'ArrowLeft' || code === 'ArrowRight') { if (menuIdx === 0) titleMenuItems[0][1](); }
  } else if (state === 'levels') {
    if (code === 'Escape') backToTitle();
    if (code === 'ArrowLeft') levelPage = Math.max(0, levelPage - 1);
    if (code === 'ArrowRight') levelPage = Math.min(4, levelPage + 1);
    if (/^(Digit|Numpad)\d$/.test(code)) {
      const lv = levelPage * 20 + (+code.slice(-1));
      if (lv <= MAX_LEVEL && lv <= unlockedMax()) startRun(lv);
    }
  } else if (state === 'options') {
    const rows = OPT_ROWS();
    if (code === 'ArrowUp') optIdx = (optIdx + rows.length - 1) % rows.length;
    if (code === 'ArrowDown') optIdx = (optIdx + 1) % rows.length;
    if (code === 'ArrowLeft') { rows[optIdx][2](-1); persist(); }
    if (code === 'ArrowRight') { rows[optIdx][2](1); persist(); }
    if (code === 'Enter') { rows[optIdx][2](1); persist(); }
    if (code === 'Escape') { persist(); backToTitle(); }
  } else if (state === 'help') {
    if (code === 'Escape' || code === 'Enter') backToTitle();
  } else if (state === 'scores' || state === 'gameover') {
    if (code === 'Escape') backToTitle();
    if (state === 'gameover' && (code === 'Enter' || code === 'Space')) startRun(level);
  } else if (state === 'intro') {
    if (code === 'Enter' || code === 'Space') { state = 'playing'; lastStep = performance.now(); }
    if (code === 'Escape') backToTitle();
  } else if (state === 'clear') {
    if (code === 'Enter' || code === 'Space') {
      const nxt = clearStats.level + 1;
      if (nxt <= MAX_LEVEL) startLevel(nxt); else finishRun();
    }
  } else if (state === 'hsentry') {
    if (/^Key[A-Z]$/.test(code) && hsPos < 3) {
      hsInitials = hsInitials.slice(0, hsPos) + code[3] + hsInitials.slice(hsPos + 1);
      hsPos = Math.min(2, hsPos + 1);
    }
    if (code === 'ArrowUp') bumpInitial(hsPos, 1);
    if (code === 'ArrowDown') bumpInitial(hsPos, -1);
    if (code === 'ArrowLeft') hsPos = Math.max(0, hsPos - 1);
    if (code === 'ArrowRight') hsPos = Math.min(2, hsPos + 1);
    if (code === 'Backspace') hsPos = Math.max(0, hsPos - 1);
    if (code === 'Enter') commitHs();
  }
}

// ─── main loop ───
function frame(now) {
  requestAnimationFrame(frame);
  uiHot = [];
  if ((state === 'playing' || state === 'ending') && !paused) {
    if (state === 'playing' && awaitStart) {
      stepAcc = 0;
      if (anyGameInput()) { awaitStart = false; lastStep = now; }
    } else {
      stepAcc += Math.min(100, now - (frame.last || now));
      while (stepAcc >= STEP_MS) {
        stepAcc -= STEP_MS; lastStep = now;
        if (state === 'playing') gameTick();
        else { eng.step({}, {}); processEngineEvents(); }  // explosions animate WITH sound
      }
    }
    if (state === 'ending' && now > endingAt) onLevelEnd();
  }
  frame.last = now;
  reapLoops(now);

  switch (state) {
    case 'title': drawTitle(now); break;
    case 'levels': drawLevels(); break;
    case 'help': drawHelp(); break;
    case 'options': drawOptions(); break;
    case 'scores': drawScores(now); break;
    case 'intro': drawIntro(now); break;
    case 'playing': case 'ending':
      drawPlayfield(now); drawHUD(now); drawEscHold(now);
      if (state === 'playing' && awaitStart && !paused && Math.floor(now / 400) % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,.65)'; rr(ctx, VW / 2 - 150, VH * 0.18, 300, 44, 10); ctx.fill();
        text(touchControls ? 'DRAG TO START' : 'MOVE TO START', VW / 2, VH * 0.18 + 22, 18, '#aaffaa');
      }
      if (paused) drawPause();
      break;
    case 'clear': drawClear(now); break;
    case 'gameover': drawGameOver(now); break;
    case 'hsentry': drawHsEntry(now); break;
  }
  if (flashMsg && now < flashUntil) {
    ctx.fillStyle = 'rgba(0,0,0,.7)'; rr(ctx, VW / 2 - 170, VH * 0.12, 340, 44, 10); ctx.fill();
    text(flashMsg, VW / 2, VH * 0.12 + 22, 17, '#ffcc44');
  }
  drawCRT();
}
requestAnimationFrame(frame);

// preload atlas for common tiles in idle time
setTimeout(() => {
  for (const n of ['dirt', 'steel', 'wall', 'roundwall', 'stone', 'emerald', 'diamond', 'sand']) {
    for (let v = 0; v < 4; v++) for (let f = 0; f < 8; f++) tileSprite(n, v, f, false);
  }
}, 400);
