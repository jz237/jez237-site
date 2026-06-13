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
  if (booted) render(); // repaint immediately (rAF may be frozen in hidden windows)
}
var booted = false; // var: hoisted, safe to read inside resize() before init
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 220));
resize();

/* ================= level state ================= */
const TILE_CHARS = '.#XH-TE<>CB[]';
let grid = [];          // grid[r][c] = base tile char
let golds = [];         // [{c,r,taken}]
let powerups = [];      // [{c,r,kind,taken}]  kind 1..5
let exitCells = [];     // [{c,r}]
let exitRevealed = false;
let holes = new Map();  // 'c,r' -> {c,r,t}
let crumbles = new Map();// 'c,r' -> {t, gone}
let spawnPoint = {c: 1, r: 1};
let guardSpawns = [];   // [{c,r,kind}] kind: 'guard'|'scout'|'mason'
let player = null, guards = [];
let goldLeft = 0;

function key(c, r){ return c + ',' + r; }

function parseLevel(rows){
  if (!Array.isArray(rows) || rows.length !== ROWS)
    throw new Error('level must have ' + ROWS + ' rows, got ' + (rows && rows.length));
  grid = []; golds = []; powerups = []; exitCells = [];
  guardSpawns = []; holes = new Map(); crumbles = new Map();
  exitRevealed = false;
  for (let r = 0; r < ROWS; r++){
    const row = rows[r];
    if (row.length !== COLS)
      throw new Error('level row ' + r + ' must have ' + COLS + ' chars, got ' + row.length);
    const out = [];
    for (let c = 0; c < COLS; c++){
      let ch = row[c];
      if (ch === 'P'){ spawnPoint = {c, r}; ch = '.'; }
      else if (ch === 'G'){ guardSpawns.push({c, r, kind: 'guard'}); ch = '.'; }
      else if (ch === 'S'){ guardSpawns.push({c, r, kind: 'scout'}); ch = '.'; }
      else if (ch === 'M'){ guardSpawns.push({c, r, kind: 'mason'}); ch = '.'; }
      else if (ch === '$'){ golds.push({c, r, taken: false}); ch = '.'; }
      else if (ch >= '1' && ch <= '5'){ powerups.push({c, r, kind: +ch, taken: false}); ch = '.'; }
      else if (ch === 'E'){ exitCells.push({c, r}); }
      else if (!TILE_CHARS.includes(ch))
        throw new Error('level row ' + r + ' col ' + c + ': unknown tile "' + ch + '"');
      out.push(ch);
    }
    grid.push(out);
  }
  goldLeft = golds.length;
}

/* tile queries (entities + AI share these) */
function tileAt(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return 'X';
  return grid[r][c];
}
function isDug(c, r){ return holes.has(key(c, r)); }
function isCrumbleGone(c, r){ const s = crumbles.get(key(c, r)); return !!(s && s.gone); }
// solid for standing-on (support from below)
function isSupportTile(c, r){
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return !isDug(c, r);
  if (t === 'C') return !isCrumbleGone(c, r);
  return t === 'X' || t === 'H' || t === '<' || t === '>' || (t === 'E' && exitRevealed);
  // note: 'T' trapdoor intentionally gives NO support
}
// can an entity's body occupy this cell?
function canOccupy(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return isDug(c, r);
  if (t === 'C') return isCrumbleGone(c, r);
  if (t === 'X') return false;
  if (t === 'T') return true; // fall-through cell: enterable (you drop straight through)
  return true;
}
function isLadder(c, r){
  const t = tileAt(c, r);
  return t === 'H' || (t === 'E' && exitRevealed);
}
function isBar(c, r){ return tileAt(c, r) === '-'; }

/* ================= state machine + overlays ================= */
let state = 'title';   // title | playing | paused | over | how | levels | scores | win
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

/* ================= entities (placeholder until phase 2/4) ================= */
function makeActor(c, r, kind){
  return {
    kind,                       // 'player' | 'guard' | 'scout' | 'mason'
    x: c + 0.5, y: r + 0.5,     // tile-units, cell center
    dir: 1, vx: 0, vy: 0,
    state: 'fall',              // run|climb|bar|fall|stun|dead
    anim: 0,
  };
}

function loadLevelData(rows){
  parseLevel(rows);
  player = makeActor(spawnPoint.c, spawnPoint.r, 'player');
  guards = guardSpawns.map(g => makeActor(g.c, g.r, g.kind));
}

function loadCampaignLevel(i){
  levelIndex = Math.max(0, Math.min(LEVELS.campaign.length - 1, i | 0));
  loadLevelData(LEVELS.campaign[levelIndex]);
}

/* ================= flow ================= */
function startGame(m){
  mode = m || 'campaign';
  score = 0; lives = 3;
  loadCampaignLevel(0);
  gameTime = 0;
  state = 'playing';
  hideOverlays();
  AUDIO.ensure();
}
function pauseGame(){ if (state !== 'playing') return; state = 'paused'; showOnly('ovPause'); }
function resumeGame(){ if (state !== 'paused') return; state = 'playing'; hideOverlays(); }
function restartLevel(){ loadCampaignLevel(levelIndex); state = 'playing'; hideOverlays(); }
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
function px(v){ return v * TILE; } // tile-units -> logical px (x)
function py(v){ return v * TILE + HUD_H; }

function drawTile(img, c, r){ ctx.drawImage(img, c * TILE, r * TILE + HUD_H); }

function render(){
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  // cave backdrop
  const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, '#1c1526'); g.addColorStop(.6, '#150f1e'); g.addColorStop(1, '#0c0a12');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.save();
  if (shake > 0){
    const s = shake * shake * 9;
    ctx.translate((Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s);
  }

  if (grid.length){
    const T = ART.tiles;
    for (let r = 0; r < ROWS; r++){
      for (let c = 0; c < COLS; c++){
        const t = grid[r][c];
        if (t === '#' || t === 'T' || t === 'B' || t === 'C'){
          if (!isDug(c, r) && !isCrumbleGone(c, r)) drawTile(T.brick, c, r);
        }
        else if (t === 'X') drawTile(T.solid, c, r);
        else if (t === 'H') drawTile(T.ladder, c, r);
        else if (t === '-') drawTile(T.bar, c, r);
        else if (t === 'E' && exitRevealed) drawTile(T.ladder, c, r);
        else if (t === '<' || t === '>') drawTile(T.solid, c, r);
      }
    }
    // gold
    for (const gd of golds) if (!gd.taken) drawTile(T.gold, gd.c, gd.r);
    // entities (placeholder boxes until art pass)
    if (player){
      ctx.fillStyle = '#3fd2c7';
      ctx.fillRect(px(player.x) - 12, py(player.y) - 16, 24, 32);
    }
    ctx.fillStyle = '#ff4f6b';
    for (const gu of guards) ctx.fillRect(px(gu.x) - 12, py(gu.y) - 16, 24, 32);
  }
  ctx.restore();

  // HUD bar
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(0, 0, VIEW_W, HUD_H);
  ctx.fillStyle = '#ffd23f';
  ctx.font = '700 20px Consolas, monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE ' + String(score).padStart(6, '0'), 16, HUD_H / 2);
  ctx.textAlign = 'center';
  if (grid.length) ctx.fillText('GOLD ' + goldLeft, VIEW_W / 2, HUD_H / 2);
  ctx.textAlign = 'right';
  ctx.fillText('LIVES ' + lives, VIEW_W - 16, HUD_H / 2);
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
booted = true; render();

/* ================= debug hooks (headless testing) ================= */
window.__g = {
  get state(){ return state; },
  set state(s){ state = s; },
  get score(){ return score; },
  set score(v){ score = v; },
  get lives(){ return lives; },
  get level(){ return levelIndex; },
  get mode(){ return mode; },
  get player(){ return player; },
  get guards(){ return guards; },
  get golds(){ return golds; },
  get goldLeft(){ return goldLeft; },
  get holes(){ return [...holes.values()]; },
  get exitRevealed(){ return exitRevealed; },
  grid: () => grid.map(r => r.join('')),
  keys,
  start: startGame,
  step(n){ for (let i = 0; i < (n || 1); i++) update(TICK); render(); return true; },
  snap(){ render(); return true; },
  input(code, down){ keys[code] = !!down; },
  loadLevel(i){ loadCampaignLevel(i); state = 'playing'; hideOverlays(); return grid.length === ROWS; },
  seedDaily(seed){ /* phase 6 */ },
};
