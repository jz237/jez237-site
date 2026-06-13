/* Pay Dirt — game.js
   Fixed-timestep sim, entities, guard AI, rendering, UI flow, scores, __g hooks. */
'use strict';

/* ================= constants ================= */
const COLS = 28, ROWS = 16, TILE = 36, HUD_H = 48;
const VIEW_W = COLS * TILE;            // 1008
const VIEW_H = ROWS * TILE + HUD_H;    // 624
const TICK = 1 / 60;

/* ================= canvas + letterbox (desktop pass) ================= */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let viewScale = 1, DPR = 1, canvasLeft = 0, canvasTop = 0;

function resize(){
  // Logical resolution is fixed at 1008x624; scale to fit the window, letterbox the rest.
  const vw = innerWidth, vh = innerHeight;
  viewScale = Math.min(vw / VIEW_W, vh / VIEW_H);
  const cssW = Math.round(VIEW_W * viewScale), cssH = Math.round(VIEW_H * viewScale);
  canvasLeft = Math.round((vw - cssW) / 2);
  canvasTop = Math.round((vh - cssH) / 2);
  DPR = Math.min(viewScale * (devicePixelRatio || 1), 2.5);
  canvas.width = Math.floor(VIEW_W * DPR); canvas.height = Math.floor(VIEW_H * DPR);
  canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
  canvas.style.left = canvasLeft + 'px'; canvas.style.top = canvasTop + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = false;
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 220));
resize();

/* ================= state machine + overlays ================= */
let state = 'title';   // title | playing | paused | over | how | levels | scores
let score = 0, lives = 3, levelIndex = 0, mode = 'campaign'; // campaign | daily
let gameTime = 0, shake = 0;

const $ = id => document.getElementById(id);
const OVERLAYS = ['ovTitle', 'ovHow', 'ovLevels', 'ovScores', 'ovPause', 'ovOver'];
function showOnly(id){
  for (const o of OVERLAYS) $(o).classList.toggle('show', o === id);
}
function hideOverlays(){ showOnly(null); }

/* ================= input (window-wide, std keyboard set) ================= */
const keys = {};
const PREVENT = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];

addEventListener('keydown', e => {
  if (PREVENT.includes(e.key)) e.preventDefault();
  const k = e.key;
  if (k === 'p' || k === 'P' || k === 'Escape'){
    if (state === 'playing') return pauseGame();
    if (state === 'paused') return resumeGame();
  }
  if (k === 'm' || k === 'M') return toggleMute();
  if (k === 'r' || k === 'R'){
    if (state === 'playing' || state === 'paused') return restartLevel();
  }
  if (state === 'playing'){ keys[e.code] = true; return; }
  if (state === 'paused' && k === 'Enter') return resumeGame();
  if (state === 'title' && (k === 'Enter' || k === ' ')){ AUDIO.ensure(); return startGame('campaign'); }
}, {passive: false});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; if (state === 'playing') pauseGame(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pauseGame(); });
document.addEventListener('contextmenu', e => { if (state === 'playing') e.preventDefault(); });
document.addEventListener('touchmove', e => { if (e.target.closest('button,.panel')) return; e.preventDefault(); }, {passive: false});
addEventListener('touchstart', () => document.body.classList.add('touch'), {once: true, passive: true});

/* ================= flow stubs (filled across phases) ================= */
function startGame(m){
  mode = m || 'campaign';
  score = 0; lives = 3; levelIndex = 0;
  state = 'playing';
  hideOverlays();
  AUDIO.ensure();
}
function pauseGame(){ if (state !== 'playing') return; state = 'paused'; showOnly('ovPause'); }
function resumeGame(){ if (state !== 'paused') return; state = 'playing'; hideOverlays(); }
function restartLevel(){ state = 'playing'; hideOverlays(); }
function quitToTitle(){ state = 'title'; showOnly('ovTitle'); }
function toggleMute(){
  AUDIO.ensure(); AUDIO.setMuted(!AUDIO.muted);
  const label = (AUDIO.muted ? '🔇 Muted' : '🔊 Sound');
  $('bMute').textContent = label; $('bPauseMute').textContent = label;
}

function bindButton(id, fn){
  const b = $(id);
  b.addEventListener('click', e => { e.preventDefault(); AUDIO.ensure(); fn(); });
}
bindButton('bPlay', () => startGame('campaign'));
bindButton('bDaily', () => startGame('daily'));
bindButton('bLevels', () => { state = 'levels'; showOnly('ovLevels'); });
bindButton('bHow', () => { state = 'how'; showOnly('ovHow'); });
bindButton('bScores', () => { state = 'scores'; showOnly('ovScores'); });
bindButton('bMute', toggleMute);
bindButton('bPauseMute', toggleMute);
bindButton('bHowBack', quitToTitle);
bindButton('bLevelsBack', quitToTitle);
bindButton('bScoresBack', quitToTitle);
bindButton('bResume', resumeGame);
bindButton('bRestartLvl', restartLevel);
bindButton('bQuit', quitToTitle);
bindButton('bAgain', () => startGame(mode));
bindButton('bOverMenu', quitToTitle);
bindButton('bSubmit', () => {});
bindButton('bLedgerCampaign', () => {});
bindButton('bLedgerDaily', () => {});

/* ================= sim ================= */
function update(dt){
  gameTime += dt;
  if (shake > 0) shake = Math.max(0, shake - dt * 3.2);
}

/* ================= render ================= */
function render(){
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  // cave backdrop
  const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, '#1c1526'); g.addColorStop(.6, '#150f1e'); g.addColorStop(1, '#0c0a12');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // HUD bar
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, VIEW_W, HUD_H);
  ctx.fillStyle = '#ffd23f';
  ctx.font = '700 20px Consolas, monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE ' + String(score).padStart(6, '0'), 16, HUD_H / 2);
  ctx.textAlign = 'right';
  ctx.fillText('LIVES ' + lives, VIEW_W - 16, HUD_H / 2);
  ctx.textAlign = 'center';
  if (state === 'playing'){
    ctx.fillStyle = '#9b8fa6';
    ctx.font = '600 16px Consolas, monospace';
    ctx.fillText('— claim under construction (phase 0) —', VIEW_W / 2, VIEW_H / 2);
  }
}

/* ================= fixed-timestep loop ================= */
let last = 0, acc = 0;
function frame(t){
  requestAnimationFrame(frame);
  const dt = Math.min((t - last) / 1000, .25); last = t;
  acc += dt;
  while (acc >= TICK){ if (state === 'playing') update(TICK); acc -= TICK; }
  render();
}
requestAnimationFrame(frame);

/* ================= debug hooks (headless testing) ================= */
window.__g = {
  get state(){ return state; },
  set state(s){ state = s; },
  get score(){ return score; },
  set score(v){ score = v; },
  get lives(){ return lives; },
  get level(){ return levelIndex; },
  get mode(){ return mode; },
  keys,
  start: startGame,
  step(n){ for (let i = 0; i < (n || 1); i++) update(TICK); render(); return true; },
  snap(){ render(); return true; },
  input(code, down){ keys[code] = !!down; },
  loadLevel(i){ levelIndex = i | 0; },
  seedDaily(seed){ /* phase 6 */ },
};
