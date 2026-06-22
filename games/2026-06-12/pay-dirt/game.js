/* Pay Dirt — game.js
   Fixed-timestep sim, entities, guard AI, rendering, UI flow, scores, __g hooks. */
'use strict';

/* ================= constants ================= */
const COLS = 28, ROWS = 16, TILE = 36, HUD_H = 72;
const VIEW_W = COLS * TILE;            // 1008
const VIEW_H = ROWS * TILE + HUD_H;    // 624
const TICK = 1 / 60;

/* ================= canvas + letterbox (desktop pass) ================= */
const canvas = document.getElementById('game');
const mainCtx = canvas.getContext('2d');
let ctx = mainCtx;
let viewScale = 1, DPR = 1, canvasLeft = 0, canvasTop = 0, screenW = VIEW_W, screenH = VIEW_H;
let mobileCamera = false;
function lowPowerRender(){
  return viewScale < 0.58;
}
function wantsMobileCamera(vw, vh){
  const coarse = matchMedia('(pointer: coarse)').matches ||
    /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent || '');
  return coarse && Math.min(vw, vh) <= 760 && Math.max(vw, vh) <= 980;
}

function resize(){
  // Logical resolution is fixed at 1008x624; scale to fit the window, letterbox the rest.
  // Guard against a 0-size viewport during load (hidden windows briefly report 0).
  const vw = innerWidth || VIEW_W, vh = innerHeight || VIEW_H;
  mobileCamera = wantsMobileCamera(vw, vh);
  if (mobileCamera){
    screenW = Math.max(320, Math.round(vw));
    screenH = Math.max(420, Math.round(vh));
    viewScale = 1;
  } else {
    screenW = VIEW_W;
    screenH = VIEW_H;
    viewScale = Math.min(vw / VIEW_W, vh / VIEW_H) || 1;
  }
  const cssW = mobileCamera ? vw : Math.round(VIEW_W * viewScale);
  const cssH = mobileCamera ? vh : Math.round(VIEW_H * viewScale);
  canvasLeft = mobileCamera ? 0 : Math.round((vw - cssW) / 2);
  canvasTop = mobileCamera ? 0 : Math.round((vh - cssH) / 2);
  const maxDpr = lowPowerRender() ? 1.35 : 2.5;
  DPR = Math.min((mobileCamera ? 1 : viewScale) * (devicePixelRatio || 1), maxDpr);
  canvas.width = Math.floor(screenW * DPR); canvas.height = Math.floor(screenH * DPR);
  canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
  canvas.style.left = canvasLeft + 'px'; canvas.style.top = canvasTop + 'px';
  mainCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  mainCtx.imageSmoothingEnabled = false;
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
let treasures = [];     // optional exploration finds: relic, bloom, map, oil
let exitCells = [];     // [{c,r}]
let exitRevealed = false;
let holes = new Map();  // 'c,r' -> {c,r,t}
let crumbles = new Map();// 'c,r' -> {t, gone}
let spawnPoint = {c: 1, r: 1};
let guardSpawns = [];   // [{c,r,kind}] kind: 'guard'|'scout'|'mason'
let player = null, guards = [];
let goldLeft = 0;
let blasted = new Set(); // cells permanently cleared by explosions
let fuses = [];          // [{c,r,t}] TNT crates about to blow
let comboN = 0, comboT = 0;
let discoveryCount = 0, discoveryTotal = 0, discoveryPulse = 0, oilLightT = 0;
let softlockCheckT = 0, softlockT = 0, softlockReason = '';
let special = null;
let specialNuggets = [];
let specialRocks = [];
let specialRockWarnings = [];

function key(c, r){ return c + ',' + r; }

function parseLevel(rows){
  if (!Array.isArray(rows) || rows.length !== ROWS)
    throw new Error('level must have ' + ROWS + ' rows, got ' + (rows && rows.length));
  grid = []; golds = []; powerups = []; treasures = []; exitCells = [];
  guardSpawns = []; holes = new Map(); crumbles = new Map();
  blasted = new Set(); fuses = [];
  comboN = 0; comboT = 0;
  softlockCheckT = 0; softlockT = 0; softlockReason = '';
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
      else if (ch >= '1' && ch <= '6'){ powerups.push({c, r, kind: +ch, taken: false}); ch = '.'; }
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
function isBottomDiggable(c, r){ return r === ROWS - 1 && tileAt(c, r) === 'X'; }
function isCrumbleGone(c, r){ const s = crumbles.get(key(c, r)); return !!(s && s.gone); }
function isBlasted(c, r){ return blasted.has(key(c, r)); }
// solid for standing-on (support from below)
function isSupportTile(c, r){
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return !isDug(c, r) && !isBlasted(c, r);
  if (t === 'C') return !isCrumbleGone(c, r) && !isBlasted(c, r);
  if (t === 'X') return !(isBottomDiggable(c, r) && (isDug(c, r) || isBlasted(c, r)));
  return t === 'H' || t === '<' || t === '>' || (t === 'E' && exitRevealed);
  // note: 'T' trapdoor intentionally gives NO support
}
// can an entity's body occupy this cell?
function canOccupy(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return isDug(c, r) || isBlasted(c, r);
  if (t === 'C') return isCrumbleGone(c, r) || isBlasted(c, r);
  if (t === 'X') return isBottomDiggable(c, r) && (isDug(c, r) || isBlasted(c, r));
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
let score = 0, lives = 4, levelIndex = 0, mode = 'campaign'; // campaign | daily | special
const START_LIVES = 4;
const MAX_LIVES = 7;
let gameTime = 0, shake = 0, hitStop = 0, flash = 0, deathFlash = 0;
let continueRun = null;
let banner = null;          // {text, sub, life}
let hint = null;            // {life} first-level control hint
let routeHint = null;       // {c, r, kind, label, life, manual}
let routeHintIdleT = 0, routeHintCheckT = 0, routeHintProgress = '', routeHintManualT = 0;
let wavePreview = null;     // Boom Rush pre-wave card
let runDustT = 0, digBuffer = 0, digBufDir = 0;
let titleRunner = null;     // attract-scene actor

/* ================= particles + floating text ================= */
let particles = [], popups = [], pickupTrails = [];
function spawnParticles(wx, wy, n, opt){
  opt = opt || {};
  for (let i = 0; i < n; i++){
    const a = (opt.ang != null ? opt.ang : rnd() * 6.283) + (rnd() - .5) * (opt.spread || 6.283);
    const sp = (opt.spd || 2) * (0.4 + rnd() * 0.8);
    particles.push({
      x: wx, y: wy,
      vx: Math.cos(a) * sp + (opt.vx || 0),
      vy: Math.sin(a) * sp + (opt.vy || 0),
      life: (opt.life || 0.5) * (0.6 + rnd() * 0.6), max: opt.life || 0.5,
      size: (opt.size || 3) * (0.6 + rnd() * 0.8),
      grav: opt.grav != null ? opt.grav : 14,
      color: Array.isArray(opt.color) ? opt.color[(rnd() * opt.color.length) | 0] : (opt.color || '#fff'),
      glow: !!opt.glow,
    });
  }
}
function updateParticles(dt){
  for (let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0){ particles.splice(i, 1); continue; }
    p.vy += p.grav * dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (let i = popups.length - 1; i >= 0; i--){
    const t = popups[i];
    t.life -= dt; t.y -= dt * 0.9;
    if (t.life <= 0) popups.splice(i, 1);
  }
  for (let i = pickupTrails.length - 1; i >= 0; i--){
    const tr = pickupTrails[i];
    tr.t += dt;
    if (tr.t >= tr.life) pickupTrails.splice(i, 1);
  }
}
function popup(wx, wy, text, color){ popups.push({x: wx, y: wy, text, color: color || '#ffd23f', life: 1.1}); }
function pickupTrail(wx, wy, color){
  for (let i = 0; i < 4; i++){
    pickupTrails.push({
      sx: px(wx) + (rnd() - .5) * 12,
      sy: py(wy) + (rnd() - .5) * 10,
      ex: 108 + i * 5,
      ey: 50 + Math.sin(i) * 2,
      t: -i * 0.045,
      life: .56 + i * .04,
      color: color || '#ffd23f',
      bend: 28 + rnd() * 26,
    });
  }
}
function drawPickupTrails(){
  if (!pickupTrails.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const tr of pickupTrails){
    const p = clamp(tr.t / tr.life, 0, 1);
    if (tr.t < 0 || p >= 1) continue;
    const ease = 1 - Math.pow(1 - p, 3);
    const x = tr.sx + (tr.ex - tr.sx) * ease;
    const y = tr.sy + (tr.ey - tr.sy) * ease - Math.sin(p * Math.PI) * tr.bend;
    const a = Math.sin(p * Math.PI);
    ctx.globalAlpha = a;
    drawGoldGem(x, y, 4.8 + a * 2, gameTime + p * 5);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

function isSpecialMode(){ return mode === 'special'; }

function resetSpecialState(){
  special = null;
  specialNuggets = [];
  specialRocks = [];
  specialRockWarnings = [];
}

function spawnSpecialNuggets(wx, wy, n, value){
  if (!isSpecialMode()) return;
  for (let i = 0; i < n; i++){
    const a = -Math.PI * .82 + (rnd() - .5) * 2.2;
    const sp = 2.6 + rnd() * 5.2;
    specialNuggets.push({
      x: wx + (rnd() - .5) * .3,
      y: wy + (rnd() - .5) * .25,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - rnd() * 1.2,
      value: value || 35,
      life: 10 + rnd() * 6,
      spin: rnd() * 6.28,
      r: .16 + rnd() * .08,
    });
  }
}

function triggerCaveIn(reason){
  if (!special || special.caveT != null || special.escapeT > 0) return;
  special.caveT = special.caveLimit || 46;
  special.rockT = .35;
  banner = {
    text: 'CAVE-IN!',
    sub: reason || 'THE CLAIM IS COMING DOWN',
    stats: [
      {label: 'ESCAPE', value: 'CART'},
      {label: 'TIMER', value: String(Math.ceil(special.caveLimit || 46))},
      {label: 'DRILL', value: 'SPACE'},
    ],
    life: 2.8,
  };
  flash = Math.max(flash, .4);
  shake = Math.max(shake, .75);
  AUDIO.sfx('warn');
}

function queueSpecialRockWarning(delay){
  if (!special) return;
  if (specialRockWarnings.length + specialRocks.length > 8) return;
  const c = 1 + ((rnd() * (COLS - 2)) | 0);
  const size = .22 + rnd() * .22;
  const x = c + .5 + (rnd() - .5) * .35;
  const dur = delay || .95;
  specialRockWarnings.push({
    c,
    x,
    t: dur,
    dur,
    size,
    rot: rnd() * Math.PI,
    spin: (rnd() - .5) * 6,
  });
  spawnParticles(c + .5, .25, 6, {color: ['#d3a15d', '#ffcf7a', '#8a6038'], spd: 1.9, life: .58, size: 2.8, grav: 9, glow: true});
}

function spawnSpecialRock(warning){
  if (!special) return;
  if (!warning) return queueSpecialRockWarning();
  specialRocks.push({
    x: warning.x,
    y: -0.6,
    vy: 4.5 + rnd() * 3.2,
    size: warning.size,
    rot: warning.rot,
    spin: warning.spin,
    life: 5,
  });
  spawnParticles(warning.x, .25, 10, {color: ['#4b3426', '#8a6038', '#d3a15d', '#ffcf7a'], spd: 2.4, life: .42, size: 2.8, grav: 10});
}

function specialCartReady(){ return !!(special && special.cartReady); }

const $ = id => document.getElementById(id);
const OVERLAYS = ['ovTitle', 'ovHow', 'ovLevels', 'ovScores', 'ovPause', 'ovStuck', 'ovOver'];
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
  if (state === 'stuck' && (k === 'Enter' || k === 'r' || k === 'R')) return restartLevel();
  if (state === 'over' && pendingEntry){
    if (/^[a-zA-Z]$/.test(k)){ setInitial(k); return; }
    if (k === 'Backspace'){ e.preventDefault(); moveCursor(-1); return; }
    if (k === 'ArrowLeft') return moveCursor(-1);
    if (k === 'ArrowRight') return moveCursor(1);
    if (k === 'ArrowUp') return cycleInitial(initCursor, 1);
    if (k === 'ArrowDown') return cycleInitial(initCursor, -1);
    if (k === 'Enter') return submitEntry();
    return;
  }
  if (state === 'over' && k === 'Enter'){ AUDIO.ensure(); return startGame(mode); }
  if (state === 'title' && (k === 'Enter' || k === ' ')){ AUDIO.ensure(); return startGame('campaign'); }
}, {passive: false});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; if (state === 'playing') pauseGame(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pauseGame(); });
document.addEventListener('contextmenu', e => { if (state === 'playing') e.preventDefault(); });
document.addEventListener('touchmove', e => { if (e.target.closest('button,.panel')) return; e.preventDefault(); }, {passive: false});
addEventListener('touchstart', () => document.body.classList.add('touch'), {once: true, passive: true});

/* ================= seeded rng (deterministic sim) ================= */
let rndState = 1;
function srand(seed){ rndState = (seed >>> 0) || 1; }
function rnd(){ rndState = (rndState * 1664525 + 1013904223) >>> 0; return rndState / 4294967296; }

/* ================= entities ================= */
function makeActor(c, r, kind){
  return {
    kind,                       // 'player' | 'guard' | 'scout' | 'mason'
    x: c + 0.5, y: r + 0.5,     // tile-units, cell center
    dir: 1,
    state: 'fall',              // idle|run|climb|bar|fall|stun|climbout|dead
    anim: 0, moved: false,
    repath: 0, wp: null, gold: null, dropT: 0,
    invuln: 0, stunT: 0, deadT: 0,
    jitter: 0.96 + rnd() * 0.08,
    lastC: c, lastR: r,
    digT: 0, squashT: 0,
    alertT: 0, alertCool: 0,
  };
}

/* ================= movement (shared by player + guards) ================= */
const RUN_SPEED = 5.4, CLIMB_SPEED = 4.5, FALL_SPEED = 9.5;
const CENTER_EPS = 0.01;
const LADDER_SUPPORT_X = 0.62;
const LADDER_TOUCH_X = 0.54;

function clamp(v, lo, hi){ return v < lo ? lo : v > hi ? hi : v; }

function nearestLadderColumn(a, r, dir = 0, radius){
  const base = Math.floor(a.x);
  const grab = radius == null ? (dir ? LADDER_TOUCH_X : LADDER_SUPPORT_X) : radius;
  let best = null, bestD = 99;
  for (let c = base - 1; c <= base + 1; c++){
    if (c < 0 || c >= COLS) continue;
    const ok = dir < 0
      ? (isLadder(c, r) || isLadder(c, r + 1) || (isLadder(c, r - 1) && canOccupy(c, r - 1)))
      : (isLadder(c, r) || isLadder(c, r + 1));
    if (!ok) continue;
    const d = Math.abs(a.x - (c + .5));
    if (d <= grab && d < bestD){ best = c; bestD = d; }
  }
  return best;
}

// can a body move horizontally into cell (c,r) travelling in dir (-1/+1)?
function canEnterHoriz(c, r, dir){
  if (!canOccupy(c, r)) return false;
  const t = tileAt(c, r);
  if (t === '[') return dir < 0;  // one-way: enter moving left only
  if (t === ']') return dir > 0;  // one-way: enter moving right only
  return true;
}

// is there a stunned guard in a hole at (c,r) to stand on? (filled in phase 4)
function guardSupportAt(c, r){
  for (const g of guards)
    if (g.state === 'stun' && Math.floor(g.x) === c && Math.floor(g.y) === r) return true;
  return false;
}

function hasSupport(a){
  const c = Math.floor(a.x), r = Math.floor(a.y);
  const lc = nearestLadderColumn(a, r);
  if (Math.abs(a.y - (r + .5)) > 0.05){
    // between rows: ladders hold you — including one your lower half still overlaps
    return (lc != null && (isLadder(lc, r) || (a.y > r + .5 && isLadder(lc, r + 1)))) ||
      isLadder(c, r) || (a.y > r + .5 && isLadder(c, r + 1));
  }
  return isSupportTile(c, r + 1) || (lc != null && isLadder(lc, r)) || isLadder(c, r) || isBar(c, r) || guardSupportAt(c, r + 1);
}

function tryMoveX(a, dx){
  if (!dx) return false;
  const r = Math.floor(a.y), c = Math.floor(a.x);
  const dir = Math.sign(dx);
  let nx = a.x + dx;
  if (!canEnterHoriz(c + dir, r, dir))
    nx = dir > 0 ? Math.min(nx, c + .5) : Math.max(nx, c + .5);
  nx = clamp(nx, .5, COLS - .5);
  const moved = Math.abs(nx - a.x) > 1e-6;
  a.x = nx;
  a.dir = dir;
  return moved;
}

function tryMoveY(a, dy, lockC){
  if (!dy) return false;
  const c = lockC == null ? Math.floor(a.x) : lockC;
  let r = Math.floor(a.y);
  let ny = a.y + dy;
  if (dy < 0){
    // rising: allow a small bottom-of-ladder grab when the ladder visually starts above you
    const ladderHere = isLadder(c, r);
    const ladderAbove = isLadder(c, r - 1) && a.y <= r + .53;
    if (!(ladderHere || ladderAbove) || !canOccupy(c, r - 1)) ny = Math.max(ny, r + .5);
    ny = Math.max(ny, .5);
  } else {
    if (!canOccupy(c, r + 1)) ny = Math.min(ny, r + .5);
    ny = Math.min(ny, ROWS - .5);
  }
  const moved = Math.abs(ny - a.y) > 1e-6;
  a.y = ny;
  return moved;
}

// One tick of motion for an actor given an input intent {left,right,up,down}.
function moveActor(a, dt, inp, spd){
  const run = RUN_SPEED * spd * dt, climb = CLIMB_SPEED * spd * dt;
  let c = Math.floor(a.x), r = Math.floor(a.y);

  if (a.state === 'fall'){
    // x eases to column center; no steering mid-air (classic)
    a.x += (c + .5 - a.x) * Math.min(1, dt * 16);
    a.y += FALL_SPEED * dt;
    const nr = Math.floor(a.y);
    if (a.y >= nr + .5){
      // Classic asymmetry: guards are caught BY a dug hole; the player falls through theirs.
      const caughtByHole = a.kind !== 'player' && isDug(c, nr);
      const landed = caughtByHole || isSupportTile(c, nr + 1) || guardSupportAt(c, nr + 1) ||
                     isLadder(c, nr) || isBar(c, nr);
      if (landed){
        a.y = nr + .5;
        a.state = isBar(c, nr) && !isSupportTile(c, nr + 1) && !isLadder(c, nr) ? 'bar' : 'idle';
        if (a.kind === 'player') onPlayerLand(a);
      }
    }
    if (a.y > ROWS - .5){ a.y = ROWS - .5; a.state = 'idle'; }
    a.anim += dt;
    return;
  }

  const dx = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
  const dyIn = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
  let movedX = false, movedY = false;

  // vertical intent first (ladder priority, classic feel)
  if (dyIn !== 0){
    const lc = nearestLadderColumn(a, r, dyIn);
    const climbC = lc == null ? c : lc;
    const onLad = isLadder(climbC, r), ladBelow = isLadder(climbC, r + 1), ladAbove = isLadder(climbC, r - 1);
    const onBar = isBar(c, r);
    if (dyIn > 0 && onBar && !onLad && !isSupportTile(c, r + 1)){
      a.state = 'fall'; a.y += 0.02; a.anim = 0; a.fellFrom = a.y; return; // drop from bar
    }
    const canClimb = dyIn < 0
      ? (onLad || (ladBelow && a.y > r + .5 + CENTER_EPS) || (ladAbove && a.y <= r + .53 && canOccupy(climbC, r - 1)))
      : (onLad || ladBelow);
    if (canClimb){
      a.x += (climbC + .5 - a.x) * Math.min(1, dt * 16);
      movedY = tryMoveY(a, dyIn * climb, climbC);
      if (movedY){
        a.x += (climbC + .5 - a.x) * Math.min(1, dt * 16); // hug the ladder
        a.state = 'climb';
      }
    }
  }

  if (!movedY && dx !== 0){
    // horizontal only when something holds you up
    if (hasSupport(a)){
      movedX = tryMoveX(a, dx * run);
      if (movedX){
        const rr = Math.floor(a.y);
        a.y += (rr + .5 - a.y) * Math.min(1, dt * 16); // settle to row center
      }
    }
  }

  // conveyor drift + crumble trigger (anything standing on these)
  c = Math.floor(a.x); r = Math.floor(a.y);
  if (Math.abs(a.y - (r + .5)) < 0.05){
    const below = tileAt(c, r + 1);
    if ((below === '<' || below === '>') && !movedY && !isLadder(c, r)){
      tryMoveX(a, (below === '<' ? -1 : 1) * 2.2 * dt);
      c = Math.floor(a.x);
    }
    if (below === 'C' && !isCrumbleGone(c, r + 1) && !isBlasted(c, r + 1)){
      const k = key(c, r + 1);
      if (!crumbles.has(k)) crumbles.set(k, {c, r: r + 1, t: 0, gone: false});
    }
  }

  // re-evaluate footing
  if (!hasSupport(a)){
    if (a.state !== 'fall') a.fellFrom = a.y;
    a.state = 'fall'; a.anim = 0;
    return;
  }
  const onBarNow = isBar(c, r) && !isSupportTile(c, r + 1) && !isLadder(c, r);
  if (onBarNow) a.state = 'bar';
  else if (movedY) a.state = 'climb';
  else if (movedX) a.state = 'run';
  else if (a.state !== 'climb' || !isLadder(c, r)) a.state = 'idle';
  a.moved = movedX || movedY;
  if (movedX || movedY) a.anim += dt; else a.anim = 0;
}

function onPlayerLand(a){
  if (a.fellFrom != null && a.fellFrom < a.y - 1.5){
    spawnParticles(a.x, a.y + .45, 6, {color: ['#7d5230', '#915e36', '#a06e42'], spd: 2.4, ang: -Math.PI / 2, spread: 2.2, life: .4, size: 3, grav: 26});
    shake = Math.max(shake, .12);
  }
  if (a.fellFrom != null && a.fellFrom < a.y - 1.0) a.squashT = 0.15;
  a.fellFrom = null;
  AUDIO.sfx('land');
}

/* ================= dig + holes ================= */
const DIG_TIME = 0.3, HOLE_LIFE = 5.4, HOLE_WARN = 1.1;
let prevDigL = false, prevDigR = false;
let prevDash = false;
let levelTime = 0;
let currentRows = null;   // source rows of the live level (for clean restarts)

function snapshotCollectedGold(){
  return new Set(golds.filter(gd => gd.taken).map(gd => key(gd.c, gd.r)));
}

function restoreCollectedGold(taken){
  if (!taken || !taken.size) return;
  for (const gd of golds){
    if (taken.has(key(gd.c, gd.r))){
      gd.taken = true;
      gd.held = null;
    }
  }
  goldLeft = golds.reduce((n, gd) => n + (gd.taken ? 0 : 1), 0);
  if (goldLeft <= 0){
    exitRevealed = true;
    if (special) special.cartReady = true;
  }
}

function chipDig(c, r, dir, heavy){
  const x = c + 0.5 - dir * 0.22, y = r + 0.2;
  AUDIO.sfx('chip');
  spawnParticles(x, y, heavy ? 10 : 5, {
    color: heavy ? ['#d3a15d', '#a06e42', '#6d4426'] : ['#b6814b', '#7d5230'],
    spd: heavy ? 4.1 : 2.4,
    ang: -Math.PI / 2 - dir * 0.35,
    spread: heavy ? 1.55 : 1.1,
    life: heavy ? .42 : .24,
    size: heavy ? 3.2 : 2.3,
    grav: heavy ? 28 : 24,
  });
}

function canDigTarget(tc, tr, baseR){
  const target = tileAt(tc, tr);
  if (!(target === '#' || isBottomDiggable(tc, tr)) || isDug(tc, tr) || isBlasted(tc, tr)) return false;
  const above = tileAt(tc, baseR);
  if (above === '#' && !isDug(tc, baseR) && !isBlasted(tc, baseR)) return false;
  if (above === 'X') return false;
  if (above === 'B' && !isBlasted(tc, baseR)) return false;
  if (above === 'C' && !isCrumbleGone(tc, baseR) && !isBlasted(tc, baseR)) return false;
  return true;
}

function beginDigAt(tc, tr, dir){
  player.dir = dir;
  if (player.tnt > 0 && (keys.ArrowDown || keys.KeyS)){
    // TNT charge: deliberate down+dig 3-wide excavation.
    player.tnt--;
    for (let k = -1; k <= 1; k++){
      const cc = tc + k;
      if ((tileAt(cc, tr) === '#' || isBottomDiggable(cc, tr)) && !isDug(cc, tr) && !isBlasted(cc, tr)) openHole(cc, tr);
    }
    shake = Math.max(shake, .5);
    return true;
  }
  player.digT = player.shovelT > 0 ? 0.05 : DIG_TIME;
  player.pendingDig = {c: tc, r: tr, dir, total: player.digT, fx: 0};
  chipDig(tc, tr, dir, player.shovelT > 0);
  shake = Math.max(shake, player.shovelT > 0 ? .16 : .08);
  return true;
}

function tryDig(dir, preferredTarget){
  if (!player || player.state === 'dead' || player.digT > 0) return false;
  if (!['idle', 'run', 'climb', 'bar'].includes(player.state)) return false;
  const c = Math.floor(player.x), r = Math.floor(player.y);
  if (Math.abs(player.y - (r + .5)) > 0.28) return false;
  if (Math.abs(player.y - (r + .5)) > 0.04) player.y += (r + .5 - player.y) * 0.45;
  const stableForDig = isSupportTile(c, r + 1) || isLadder(c, r) || isBar(c, r) ||
    guardSupportAt(c, r + 1) || hasSupport(player);
  if (!stableForDig) return false;
  const tr = r + 1;
  const candidates = [];
  const addCandidate = tc => {
    if (tc < 0 || tc >= COLS) return;
    if (!candidates.some(o => o.tc === tc)) candidates.push({tc});
  };
  if (preferredTarget && Math.abs(preferredTarget.r - tr) <= 1 &&
      preferredTarget.c !== c && Math.abs((preferredTarget.c + .5) - player.x) <= 1.85){
    addCandidate(preferredTarget.c);
  }
  addCandidate(c + dir);
  addCandidate(Math.floor(player.x + dir * 0.62));
  for (const cand of candidates){
    if (canDigTarget(cand.tc, tr, r)){
      const targetDir = cand.tc + .5 < player.x ? -1 : 1;
      return beginDigAt(cand.tc, tr, targetDir || dir);
    }
  }
  return false;
}

function openHole(c, r){
  holes.set(key(c, r), {c, r, t: 0});
  shake = Math.max(shake, .32);
  spawnParticles(c + .5, r + .46, 14, {color: ['#7d5230', '#532f1a', '#a06e42', '#d3a15d'], spd: 4.2, life: .54, size: 3.7, grav: 30});
  spawnParticles(c + .5, r + .34, 4, {color: '#ffcf73', spd: 2.5, life: .18, size: 2, grav: 10, glow: true});
  AUDIO.sfx('dig');
  // digging beside a TNT crate lights its fuse
  for (const [dc, dr] of [[-1, 0], [1, 0], [0, -1], [0, 1]]){
    const nc = c + dc, nr = r + dr;
    if (tileAt(nc, nr) === 'B' && !isBlasted(nc, nr) && !fuses.some(f => f.c === nc && f.r === nr))
      fuses.push({c: nc, r: nr, t: 0.5});
  }
}

function boom(c, r){
  blasted.add(key(c, r));
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){
    const nc = c + dc, nr = r + dr;
    const t = tileAt(nc, nr);
    if (t === '#' || t === 'C'){
      blasted.add(key(nc, nr));
      holes.delete(key(nc, nr));
    } else if (t === 'B' && !isBlasted(nc, nr) && !fuses.some(f => f.c === nc && f.r === nr)){
      fuses.push({c: nc, r: nr, t: 0.18}); // chain reaction
    }
  }
  spawnParticles(c + .5, r + .5, 26, {color: ['#ff5c33', '#ff9d2e', '#ffd23f', '#fff3b0'], spd: 7, life: .6, size: 5, grav: 8, glow: true});
  spawnParticles(c + .5, r + .5, 14, {color: ['#4a4452', '#2c2937'], spd: 4, life: .9, size: 4, grav: 6});
  spawnSpecialNuggets(c + .5, r + .35, 5 + ((rnd() * 4) | 0), 40);
  if (isSpecialMode()) triggerCaveIn('POWDER VEIN AWAKENED');
  flash = Math.max(flash, .5);
  hitStop = Math.max(hitStop, 0.06);
  AUDIO.sfx('boom');
  // blast kills
  const bx = c + .5, by = r + .5;
  if (player && player.state !== 'dead' &&
      Math.abs(player.x - bx) < 1.6 && Math.abs(player.y - by) < 1.6) killPlayer('blast');
  for (const g of guards){
    if (g.state !== 'dead' && Math.abs(g.x - bx) < 1.6 && Math.abs(g.y - by) < 1.6){
      if (g.gold){ g.gold.held = null; g.gold.c = Math.floor(g.x); g.gold.r = Math.max(0, Math.floor(g.y) - 1); g.gold = null; }
      g.state = 'dead'; g.deadT = 0; addScore(200);
    }
  }
  shake = Math.max(shake, .8);
}

function breakSpecialCell(c, r, forceBoom){
  const t = tileAt(c, r);
  if (t === '#' || t === 'C' || (t === 'X' && isBottomDiggable(c, r))){
    blasted.add(key(c, r));
    holes.delete(key(c, r));
    spawnParticles(c + .5, r + .48, 12, {color: ['#d3a15d', '#8a6038', '#4b2b18'], spd: 5.2, life: .58, size: 3.8, grav: 24});
    spawnSpecialNuggets(c + .5, r + .22, 2 + ((rnd() * 3) | 0), 25);
    return true;
  }
  if (t === 'B' && !isBlasted(c, r)){
    if (forceBoom || !fuses.some(f => f.c === c && f.r === r)) fuses.push({c, r, t: forceBoom ? 0.05 : 0.18});
    return true;
  }
  return false;
}

function startDrillDash(inp){
  if (!isSpecialMode() || !player || player.state === 'dead' || player.digT > 0) return false;
  if ((player.drillCd || 0) > 0 || player.drillT > 0) return false;
  const dir = inp.left && !inp.right ? -1 : inp.right && !inp.left ? 1 : (player.dir || 1);
  player.drillT = .24;
  player.drillDir = dir;
  player.drillCd = .72;
  player.invuln = Math.max(player.invuln || 0, .18);
  player.state = 'run';
  player.dir = dir;
  shake = Math.max(shake, .25);
  flash = Math.max(flash, .08);
  spawnParticles(player.x - dir * .28, player.y + .25, 16, {color: ['#ffd23f', '#ff9d2e', '#3fd2c7', '#fff3b0'], spd: 4.4, ang: dir > 0 ? Math.PI : 0, spread: 1.2, life: .45, size: 3, grav: 5, glow: true});
  AUDIO.sfx('power');
  return true;
}

function updateDrillDash(dt){
  if (!player || !player.drillT) return false;
  const dir = player.drillDir || player.dir || 1;
  player.drillT = Math.max(0, player.drillT - dt);
  const r = Math.floor(player.y);
  const front = Math.floor(player.x + dir * .68);
  breakSpecialCell(front, r, false);
  breakSpecialCell(front, r + 1, false);
  for (const gd of golds){
    if (!gd.taken && !gd.held && Math.abs((gd.c + .5) - player.x) < 1.05 && Math.abs((gd.r + .5) - player.y) < .95)
      collectGold(gd);
  }
  for (const g of guards){
    if (g.state !== 'dead' && Math.abs(g.x - player.x) < 1.1 && Math.abs(g.y - player.y) < .85){
      if (g.gold){ g.gold.held = null; g.gold.c = Math.floor(g.x); g.gold.r = Math.max(0, Math.floor(g.y) - 1); g.gold = null; }
      g.state = 'dead'; g.deadT = 0; addScore(250);
      popup(g.x, g.y - .5, 'DRILLED 250', '#ff9d2e');
      spawnParticles(g.x, g.y, 18, {color: ['#ff405a', '#ffd23f', '#fff'], spd: 5.6, life: .62, size: 3.8, grav: 8, glow: true});
    }
  }
  tryMoveX(player, dir * 13.5 * dt);
  player.y += (r + .5 - player.y) * Math.min(1, dt * 18);
  player.state = 'run';
  player.anim += dt * 2.4;
  if (rnd() < .85)
    spawnParticles(player.x - dir * .55, player.y + .34, 3, {color: ['#ffd23f', '#ff9d2e', '#3fd2c7'], spd: 2.8, ang: dir > 0 ? Math.PI : 0, spread: 1, life: .28, size: 2.5, grav: 4, glow: true});
  if (player.drillT <= 0){
    player.drillT = 0;
    shake = Math.max(shake, .18);
  }
  return true;
}

function updateFuses(dt){
  for (let i = fuses.length - 1; i >= 0; i--){
    fuses[i].t -= dt;
    if (fuses[i].t <= 0){
      const f = fuses.splice(i, 1)[0];
      boom(f.c, f.r);
    }
  }
}

function updateCrumbles(dt){
  for (const cr of crumbles.values()){
    if (cr.gone) continue;
    cr.t += dt;
    if (cr.t >= 0.55) cr.gone = true;
  }
}

function updateSpecialNuggets(dt){
  for (let i = specialNuggets.length - 1; i >= 0; i--){
    const n = specialNuggets[i];
    n.life -= dt;
    if (n.life <= 0){ specialNuggets.splice(i, 1); continue; }
    n.vy += 8.8 * dt;
    n.x += n.vx * dt;
    n.y += n.vy * dt;
    n.spin += dt * 8;
    if (n.x < .55){ n.x = .55; n.vx = Math.abs(n.vx) * .45; }
    if (n.x > COLS - .55){ n.x = COLS - .55; n.vx = -Math.abs(n.vx) * .45; }
    const c = Math.floor(n.x), r = Math.floor(n.y);
    if (n.vy > 0 && isSupportTile(c, r + 1) && n.y > r + .34){
      n.y = r + .34;
      n.vy *= -.34;
      n.vx *= .82;
      if (Math.abs(n.vy) < .8) n.vy = 0;
    }
    if (player && player.state !== 'dead' && Math.hypot(n.x - player.x, n.y - player.y) < .72){
      addScore(n.value);
      comboN++; comboT = 2.5;
      popup(n.x, n.y - .25, '+' + n.value, '#ffd23f');
      pickupTrail(n.x, n.y, '#ffd23f');
      spawnParticles(n.x, n.y, 7, {color: ['#ffd23f', '#fff3b0', '#ff9d2e'], spd: 2.8, life: .42, size: 2.5, grav: -1, glow: true});
      AUDIO.sfx(comboN > 2 ? 'goldhi' : 'gold');
      specialNuggets.splice(i, 1);
    }
  }
}

function updateSpecialRockWarnings(dt){
  for (let i = specialRockWarnings.length - 1; i >= 0; i--){
    const warning = specialRockWarnings[i];
    warning.t -= dt;
    if (warning.t <= 0){
      spawnSpecialRock(warning);
      specialRockWarnings.splice(i, 1);
    } else if (warning.t < .35 && rnd() < .45){
      spawnParticles(warning.x, .28, 1, {color: ['#ffcf7a', '#d3a15d'], spd: 1.7, life: .24, size: 2.2, grav: 8, glow: true});
    }
  }
}

function updateSpecialRocks(dt){
  for (let i = specialRocks.length - 1; i >= 0; i--){
    const rock = specialRocks[i];
    rock.life -= dt;
    rock.vy += 7.8 * dt;
    rock.y += rock.vy * dt;
    rock.rot += rock.spin * dt;
    const c = Math.floor(rock.x), r = Math.floor(rock.y);
    if (player && player.state !== 'dead' && Math.abs(rock.x - player.x) < .5 + rock.size && Math.abs(rock.y - player.y) < .55 + rock.size)
      killPlayer('crush');
    if (r >= 0 && r < ROWS && (isSupportTile(c, r) || isSupportTile(c, r + 1) || rock.y > ROWS - .4)){
      shake = Math.max(shake, .22);
      spawnParticles(rock.x, Math.min(ROWS - .35, rock.y), 13, {color: ['#4b3426', '#8a6038', '#d3a15d'], spd: 4.2, life: .55, size: 3.5, grav: 22});
      if (rnd() < .65) breakSpecialCell(c, r, false);
      specialRocks.splice(i, 1);
      continue;
    }
    if (rock.life <= 0 || rock.y > ROWS + 2) specialRocks.splice(i, 1);
  }
}

function updateSpecialSetpieces(dt){
  if (!special || !player || player.state === 'dead') return;
  const pc = Math.floor(player.x), pr = Math.floor(player.y);
  for (const plate of special.plates || []){
    if (!plate.used && pc === plate.c && pr === plate.r){
      plate.used = true;
      triggerCaveIn('PRESSURE PLATE TRIPPED');
      popup(plate.c + .5, plate.r - .15, 'PLATE!', '#ff9d2e');
      spawnParticles(plate.c + .5, plate.r + .4, 20, {color: ['#ff9d2e', '#ffd23f', '#4b3426'], spd: 5, life: .68, size: 3.5, grav: 16, glow: true});
      for (const [dc, dr] of [[-1, -6], [7, -6], [9, -2]]){
        const c = plate.c + dc, r = plate.r + dr;
        if (tileAt(c, r) === 'B' && !fuses.some(f => f.c === c && f.r === r)) fuses.push({c, r, t: .22});
      }
    }
  }
  for (const lava of special.lava || []){
    if (pr === lava.r - 1 && pc >= lava.c0 && pc <= lava.c1 && Math.abs(player.y - (pr + .5)) < .55)
      killPlayer('blast');
  }
  for (const vent of special.vents || []){
    vent.t -= dt;
    if (vent.t <= 0){
      vent.t = 2.4 + rnd() * 1.2;
      spawnParticles(vent.x, vent.y, 24, {color: ['#cffff5', '#71d7cc', '#fff3b0'], spd: 5.8, ang: -Math.PI / 2, spread: .75, life: .72, size: 4, grav: -9, glow: true});
      if (Math.abs(player.x - vent.x) < .75 && Math.abs(player.y - vent.y) < 1.35){
        player.y = Math.max(.55, player.y - .35);
        player.squashT = .18;
        shake = Math.max(shake, .18);
      }
      AUDIO.sfx('steam');
    }
  }
  for (const cr of special.crushers || []){
    cr.t = (cr.t + dt) % 2.6;
    const down = cr.t > 1.52 && cr.t < 2.02;
    if (down && Math.abs(player.x - (cr.c + .5)) < .58 && Math.abs(player.y - (cr.r + 1.25)) < 1.1)
      killPlayer('crush');
    if (down && rnd() < .35)
      spawnParticles(cr.c + .5, cr.r + 1.8, 2, {color: ['#d3a15d', '#8a6038'], spd: 2, life: .3, size: 2.5, grav: 22});
  }
  const w = special.worm;
  if (w){
    w.t += dt;
    if (!w.active){
      if (w.warnT > 0){
        w.warnT = Math.max(0, w.warnT - dt);
        if (rnd() < .28)
          spawnParticles(w.dir > 0 ? .6 : COLS - .6, w.y + .25, 1, {color: ['#ff9d2e', '#d3a15d'], spd: 2.2, life: .32, size: 3, grav: 8, glow: true});
        if (w.warnT <= 0){
          w.active = true;
          w.t = 0;
          AUDIO.sfx('boom');
        }
      } else {
        w.cooldown -= dt;
        if (special.caveT != null && w.cooldown <= 0){
          w.dir = rnd() < .5 ? 1 : -1;
          w.x = w.dir > 0 ? -2 : COLS + 2;
          w.y = 9.5 + ((rnd() * 4) | 0);
          w.warnT = 2.25;
          w.cooldown = 10 + rnd() * 5;
          banner = {text: 'DRILL WORM!', sub: 'WARNING LANE - CLIMB OR DROP', life: 2.0};
          AUDIO.sfx('warn');
        }
      }
    } else {
      w.x += w.dir * 5.2 * dt;
      const wc = Math.floor(w.x), wr = Math.floor(w.y);
      breakSpecialCell(wc, wr, false);
      breakSpecialCell(wc, wr + 1, false);
      spawnParticles(w.x - w.dir * .75, w.y + .35, 2, {color: ['#ff9d2e', '#d3a15d', '#4b3426'], spd: 3.8, ang: w.dir > 0 ? Math.PI : 0, spread: 1.1, life: .38, size: 3, grav: 12, glow: true});
      if (Math.abs(player.x - w.x) < .82 && Math.abs(player.y - w.y) < .72) killPlayer('crush');
      if (w.x < -3 || w.x > COLS + 3) w.active = false;
    }
  }
}

function updateSpecial(dt, inp){
  if (!special || !player) return;
  player.drillCd = Math.max(0, (player.drillCd || 0) - dt);
  if (special.drillHintT > 0) special.drillHintT = Math.max(0, special.drillHintT - dt);
  updateSpecialNuggets(dt);
  updateSpecialRockWarnings(dt);
  updateSpecialRocks(dt);
  updateSpecialSetpieces(dt);
  if (special.caveT == null && golds.length && goldLeft <= special.triggeredAtGold)
    triggerCaveIn('GREED WOKE THE MINE');
  if (special.caveT != null && special.escapeT <= 0){
    special.caveT = Math.max(0, special.caveT - dt);
    special.rockT -= dt;
    const limit = special.caveLimit || 46;
    const urgency = special.caveT < limit * .34 ? .38 : special.caveT < limit * .62 ? .58 : .86;
    if (special.rockT <= 0){
      special.rockT = urgency + rnd() * .45;
      spawnSpecialRock();
      if (special.caveT < 13 && rnd() < .55) spawnSpecialRock();
    }
    if (special.caveT <= 0 && player.state !== 'dead') killPlayer('crush');
  }
  if (special.cartReady && special.escapeT <= 0 && exitRevealed && player.state !== 'dead'){
    const d = Math.hypot(player.x - special.cart.x, player.y - special.cart.y);
    if (d < .95) startCartEscape();
  }
  if (special.escapeT > 0){
    special.escapeT -= dt;
    const escapeP = 1 - Math.max(0, special.escapeT) / special.escapeDur;
    const targetX = special.cart.x + (special.escapeDist || 4.5) + (special.final ? 1.8 : 0);
    player.x += (targetX - player.x) * Math.min(1, dt * (special.final ? 2.6 : 2.0));
    player.y += (special.cart.y - player.y) * Math.min(1, dt * 8);
    player.state = 'run';
    player.invuln = 1;
    shake = Math.max(shake, special.final ? .22 : .13);
    if (rnd() < (special.final ? .62 : .34)){
      spawnParticles(player.x - .75, player.y + .42, special.final ? 4 : 2, {color: ['#ffd23f', '#ff9d2e', '#8a6038', '#fff3b0'], spd: 4.4 + escapeP * 2.2, ang: Math.PI, spread: .95, life: .42, size: 2.8, grav: 12, glow: true});
    }
    if (special.final && rnd() < .25)
      spawnSpecialRock();
    if (special.escapeT <= 0) levelComplete();
  }
}

function specialEscapeInProgress(){
  return !!(isSpecialMode() && special && special.escapeT > 0);
}

function startCartEscape(){
  if (!special || special.escapeT > 0) return;
  special.escapeT = special.escapeDur;
  clearSoftlock();
  banner = {
    text: special.final ? 'FINAL HAUL!' : 'PAY DIRT!',
    sub: special.final ? 'RUN THE COLLAPSING RAIL' : 'MINE CART ESCAPE',
    life: special.final ? 2.2 : 1.5,
  };
  addScore(special.final ? 2000 : 900);
  flash = Math.max(flash, special.final ? .7 : .45);
  shake = Math.max(shake, special.final ? 1 : .6);
  spawnParticles(special.cart.x, special.cart.y, special.final ? 58 : 36, {color: ['#ffd23f', '#ff9d2e', '#3fd2c7', '#fff3b0'], spd: special.final ? 8.4 : 6.2, life: special.final ? 1.2 : .9, size: special.final ? 4.8 : 4, grav: 8, glow: true});
  AUDIO.sfx('win');
}

function updateHoles(dt){
  for (const h of [...holes.values()]){
    h.t += dt;
    if (!h.warned && h.t >= HOLE_LIFE - HOLE_WARN){
      h.warned = true;
      AUDIO.sfx('warn');
      spawnParticles(h.c + .5, h.r + .55, 8, {color: ['#ffcf73', '#a06e42', '#5b3922'], spd: 2.4, ang: -Math.PI / 2, spread: 2.2, life: .38, size: 2.8, grav: 20, glow: true});
    }
    if (h.t >= HOLE_LIFE){
      holes.delete(key(h.c, h.r));
      AUDIO.sfx('refill');
      spawnParticles(h.c + .5, h.r + .55, 12, {color: ['#5b3922', '#8a6038', '#c18a52'], spd: 2.8, ang: -Math.PI / 2, spread: 2.6, life: .36, size: 3.2, grav: 22});
      if (player && player.state !== 'dead' &&
          Math.floor(player.x) === h.c && Math.floor(player.y) === h.r)
        killPlayer('sealed');
      for (const g of guards)
        if (g.state !== 'dead' && Math.floor(g.x) === h.c && Math.floor(g.y) === h.r)
          sealGuard(g);
    }
  }
}

/* ================= guard AI ================= */
const GUARD_SPEED_SCALE = 0.8;
const GUARD_SPEED = { guard: 0.68 * GUARD_SPEED_SCALE, scout: 0.901 * GUARD_SPEED_SCALE, mason: 0.527 * GUARD_SPEED_SCALE };
const STUN_TIME = 3.2, GUARD_RESPAWN_T = 1.4;
const GUARD_META = {
  guard: {color: '#ff405a', glow: 'rgba(255,64,90,.24)', icon: '!', label: 'JUMPER'},
  scout: {color: '#ff9d2e', glow: 'rgba(255,157,46,.25)', icon: '»', label: 'SCOUT'},
  mason: {color: '#b07fff', glow: 'rgba(176,127,255,.25)', icon: '◆', label: 'MASON'},
};
const DEATH_TEXT = {
  caught: 'CAUGHT',
  sealed: 'SEALED IN',
  blast: 'BLASTED',
  guard: 'CAUGHT',
  fall: 'FELL',
  crush: 'CRUSHED',
  debug: 'DEBUG DROP',
};
function guardMeta(g){ return GUARD_META[g.kind] || GUARD_META.guard; }
function deathText(reason){ return DEATH_TEXT[reason] || 'CLAIM LOST'; }
function guardSpotted(g, dist){
  if (g.alertCool > 0 || g.state === 'dead' || g.state === 'stun') return;
  g.alertT = 0.9;
  g.alertCool = 2.4;
  AUDIO.sfx('alert');
}

/* Guard's-eye geometry: holes are PRETEND-FILLED so guards path straight into them
   (classic behaviour — they don't see traps). Crumbled/blasted tiles use real state. */
function gOccupy(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return isBlasted(c, r); // holes pretend-filled; blasts are real
  if (t === 'C') return isCrumbleGone(c, r) || isBlasted(c, r);
  if (t === 'X') return false;
  return true;
}
function gOccupyDir(c, r, dir){
  if (!gOccupy(c, r)) return false;
  const t = tileAt(c, r);
  if (t === '[') return dir < 0;
  if (t === ']') return dir > 0;
  return true;
}
function gSolidBelow(c, r){
  const t = tileAt(c, r + 1);
  if (r + 1 >= ROWS) return true;
  if (t === '#' || t === 'B') return !isBlasted(c, r + 1);
  if (t === 'C') return !isCrumbleGone(c, r + 1) && !isBlasted(c, r + 1);
  return t === 'X' || t === 'H' || t === '<' || t === '>' || (t === 'E' && exitRevealed);
}
function gSupported(c, r){ return gSolidBelow(c, r) || isLadder(c, r) || isBar(c, r); }
function landFrom(c, r){
  while (r < ROWS - 1 && !gSupported(c, r) && gOccupy(c, r + 1)) r++;
  return r;
}

function guardNeighbors(c, r){
  const out = [];
  if (!gSupported(c, r)){ // transient node: can only fall
    out.push([c, landFrom(c, r)]);
    return out;
  }
  for (const dir of [-1, 1]){
    const nc = c + dir;
    if (gOccupyDir(nc, r, dir)) out.push([nc, landFrom(nc, r)]);
  }
  if (isLadder(c, r) && gOccupy(c, r - 1)) out.push([c, r - 1]);
  if (gOccupy(c, r + 1) && (isLadder(c, r) || isLadder(c, r + 1))) out.push([c, r + 1]);
  if (isBar(c, r) && !gSolidBelow(c, r) && gOccupy(c, r + 1)) out.push([c, landFrom(c, r + 1)]); // drop from bar
  return out;
}

// BFS first-step toward the player; returns next waypoint cell or null
function guardPathStep(gc, gr, pc, pr){
  if (gc === pc && gr === pr) return null;
  const start = gr * COLS + gc, goal = pr * COLS + pc;
  const prev = new Int16Array(COLS * ROWS).fill(-1);
  prev[start] = start;
  const q = [start];
  let found = false;
  for (let qi = 0; qi < q.length; qi++){
    const n = q[qi];
    if (n === goal){ found = true; break; }
    const c = n % COLS, r = (n / COLS) | 0;
    for (const [nc, nr] of guardNeighbors(c, r)){
      const m = nr * COLS + nc;
      if (prev[m] === -1){ prev[m] = n; q.push(m); }
    }
  }
  if (!found) return null;
  let n = goal;
  while (prev[n] !== start) n = prev[n];
  return {c: n % COLS, r: (n / COLS) | 0};
}

function updateGuard(g, dt){
  if (g.alertT > 0) g.alertT = Math.max(0, g.alertT - dt);
  if (g.alertCool > 0) g.alertCool = Math.max(0, g.alertCool - dt);
  if (g.state === 'dead'){
    g.deadT += dt;
    if (g.deadT >= GUARD_RESPAWN_T) respawnGuard(g);
    return;
  }
  if (g.state === 'stun'){
    g.stunT += dt;
    g.anim += dt;
    const c = Math.floor(g.x), r = Math.floor(g.y);
    // struggle telegraph: dirt flecks fly faster as escape nears
    if (g.stunT > STUN_TIME - 1.0 && rnd() < 0.25)
      spawnParticles(g.x + (rnd() - .5) * .4, g.y, 1, {color: ['#7d5230', '#915e36'], spd: 2.5, ang: -Math.PI / 2, spread: 1.4, life: .35, size: 2.5, grav: 18});
    if (g.stunT >= STUN_TIME && isDug(c, r) && gOccupy(c, r - 1) && !isDug(c, r - 1)){
      g.state = 'climbout';
      spawnParticles(g.x, g.y, 5, {color: ['#7d5230'], spd: 2.5, life: .4, size: 3, grav: 14});
    }
    return;
  }
  if (g.state === 'climbout'){
    g.y -= CLIMB_SPEED * 0.7 * GUARD_SPEED_SCALE * dt;
    g.anim += dt;
    const r = Math.floor(g.y);
    if (g.y <= r + .5 && !isDug(Math.floor(g.x), r)){
      g.y = r + .5;
      g.state = 'idle';
      g.repath = 0;
    }
    return;
  }

  // landing in an open hole => trapped
  const c = Math.floor(g.x), r = Math.floor(g.y);
  if (g.state !== 'fall' && isDug(c, r)){
    trapGuard(g);
    return;
  }

  // re-plan
  g.repath -= dt;
  if (g.repath <= 0 && player && player.state !== 'dead'){
    g.repath = 0.35 + rnd() * 0.15;
    const wp = guardPathStep(c, r, Math.floor(player.x), Math.floor(player.y));
    const dist = Math.hypot(player.x - g.x, player.y - g.y);
    if (wp && dist < (g.kind === 'scout' ? 8.5 : 6.8)) guardSpotted(g, dist);
    g.wp = wp;
  }

  const inp = {left: false, right: false, up: false, down: false};
  const wp = g.wp;
  if (wp){
    if (wp.r < r) inp.up = true;
    else if (wp.r > r) inp.down = true;
    else if (wp.c < c) inp.left = true;
    else if (wp.c > c) inp.right = true;
    else { // inside waypoint cell: home to its center, then re-plan
      if (Math.abs(g.x - (wp.c + .5)) > 0.08) (g.x < wp.c + .5) ? inp.right = true : inp.left = true;
      else g.repath = 0;
    }
  } else if (player){
    // no path: pace toward the player's column
    if (Math.floor(player.x) < c) inp.left = true;
    else if (Math.floor(player.x) > c) inp.right = true;
  }

  const wasFalling = g.state === 'fall';
  moveActor(g, dt, inp, GUARD_SPEED[g.kind] * (g.jitter || 1));

  // landed inside an open hole?
  const nc = Math.floor(g.x), nr = Math.floor(g.y);
  if (g.state !== 'fall' && isDug(nc, nr)){ trapGuard(g); return; }
  if (wasFalling && g.state !== 'fall') g.repath = 0;

  // gold pickup / random drop
  if (g.kind !== 'scout'){
    const cellChanged = nc !== g.lastC || nr !== g.lastR;
    if (cellChanged && !g.gold){
      for (const gd of golds){
        if (!gd.taken && !gd.held && gd.c === nc && gd.r === nr && rnd() < 0.4){
          gd.held = g; g.gold = gd; g.dropT = 8 + rnd() * 10;
          break;
        }
      }
    }
    if (g.gold){
      g.dropT -= dt;
      if (g.dropT <= 0 && !isDug(nc, nr) && gSupported(nc, nr) && !golds.some(o => !o.taken && !o.held && o.c === nc && o.r === nr)){
        g.gold.c = nc; g.gold.r = nr; g.gold.held = null; g.gold = null;
      }
    }
  }
  g.lastC = nc; g.lastR = nr;

  // mason: re-seals holes he walks beside (not ones he's inside)
  if (g.kind === 'mason'){
    for (const h of holes.values()){
      if (h.t < HOLE_LIFE - HOLE_WARN - 0.1 &&
          Math.abs(h.c + .5 - g.x) < 1.6 && Math.abs(h.r + .5 - g.y) < 1.2 &&
          !(Math.floor(g.x) === h.c && Math.floor(g.y) === h.r))
        h.t = HOLE_LIFE - HOLE_WARN - 0.1;
    }
  }

  // catch the player
  if (player && player.state !== 'dead' && !playerCloaked()){
    if (Math.abs(g.x - player.x) < 0.55 && Math.abs(g.y - player.y) < 0.7) killPlayer('caught');
  }
}

function playerCloaked(){ return !!(player && player.cloakT > 0); }

/* ================= power-ups ================= */
const PKINDS = {
  1: {name: 'TNT',     color: '#ff5c33'},
  2: {name: 'BOOTS',   color: '#3fd2c7'},
  3: {name: 'CLOAK',   color: '#b07fff'},
  4: {name: 'MAGNET',  color: '#ffd23f'},
  5: {name: 'SHOVEL',  color: '#7fd24a'},
  6: {name: 'EXTRA LIFE', color: '#ff6b9d'},
};

const TKINDS = {
  relic: {name: 'RELIC', color: '#fff0b8', score: 250},
  bloom: {name: 'BLOOM', color: '#9ef0c8', score: 125},
  map:   {name: 'MAP',   color: '#d8bf86', score: 175},
  oil:   {name: 'OIL',   color: '#f1b34e', score: 100},
};

function applyPowerup(kind){
  const meta = PKINDS[kind] || PKINDS[1];
  if (kind === 1) player.tnt = Math.min(3, (player.tnt || 0) + 1);
  else if (kind === 2) player.speedT = 8;
  else if (kind === 3) player.cloakT = 6;
  else if (kind === 4) player.magnetT = 8;
  else if (kind === 5) player.shovelT = 10;
  else if (kind === 6){
    const gained = lives < MAX_LIVES;
    lives = Math.min(MAX_LIVES, lives + 1);
    addScore(gained ? 250 : 100);
    flash = Math.max(flash, .32);
    banner = {text: gained ? 'EXTRA LIFE' : 'HEART FULL', sub: gained ? '+1 HEART' : 'MAX LIVES', life: 1.55};
    spawnParticles(player.x, player.y - .2, 18, {color: ['#fff', meta.color, '#fff3b0'], spd: 4.2, life: .75, size: 3.5, grav: -5, glow: true});
    popup(player.x, player.y - .55, gained ? '+1 LIFE' : 'FULL', meta.color);
    AUDIO.sfx('power');
    return;
  }
  addScore(50);
  flash = Math.max(flash, .25);
  spawnParticles(player.x, player.y - .2, 12, {color: [ART.PAL ? '#fff' : '#fff', meta.color, '#fff3b0'], spd: 3.5, life: .6, size: 3, grav: -4, glow: true});
  popup(player.x, player.y - .5, meta.name, meta.color);
  AUDIO.sfx('power');
}

function updatePowerups(dt){
  player.speedT = Math.max(0, (player.speedT || 0) - dt);
  player.cloakT = Math.max(0, (player.cloakT || 0) - dt);
  player.magnetT = Math.max(0, (player.magnetT || 0) - dt);
  player.shovelT = Math.max(0, (player.shovelT || 0) - dt);
  oilLightT = Math.max(0, oilLightT - dt);
  const c = Math.floor(player.x), r = Math.floor(player.y);
  for (const pu of powerups){
    if (!pu.taken && pu.c === c && pu.r === r){
      pu.taken = true;
      applyPowerup(pu.kind);
    }
  }
  for (const tr of treasures){
    if (!tr.taken && tr.c === c && tr.r === r &&
        Math.abs(player.x - (tr.c + .5)) < .46 && Math.abs(player.y - (tr.r + .5)) < .48){
      collectTreasure(tr);
    }
  }
  // gold magnet: nearby gold leaps to you
  if (player.magnetT > 0){
    for (const gd of golds){
      if (gd.taken || gd.held) continue;
      if (Math.abs(gd.c + .5 - player.x) < 2.6 && Math.abs(gd.r + .5 - player.y) < 2.6)
        collectGold(gd);
    }
  }
}

function collectTreasure(tr){
  tr.taken = true;
  discoveryCount++;
  resetRouteHint();
  discoveryPulse = 1;
  const meta = TKINDS[tr.kind] || TKINDS.relic;
  let val = meta.score;
  if (tr.kind === 'oil') oilLightT = 9;
  if (tr.kind === 'map') player.magnetT = Math.max(player.magnetT || 0, 3.5);
  if (discoveryCount === discoveryTotal && discoveryTotal > 0){
    val += 650;
    flash = Math.max(flash, .28);
    banner = {text: 'CAVERN SURVEYED', sub: '+650 EXPLORER BONUS', life: 2.0};
  }
  addScore(val);
  spawnParticles(tr.c + .5, tr.r + .5, tr.kind === 'bloom' ? 18 : 12, {
    color: [meta.color, '#ffffff', tr.kind === 'relic' ? '#ffd86b' : '#71d7cc'],
    spd: tr.kind === 'bloom' ? 2.8 : 3.4,
    life: .65,
    size: tr.kind === 'map' ? 2.4 : 3,
    grav: tr.kind === 'bloom' ? -5 : -2,
    glow: true,
  });
  popup(tr.c + .5, tr.r + .2, meta.name + ' +' + val, meta.color);
  AUDIO.sfx(tr.kind === 'oil' ? 'power' : 'goldhi');
}

/* ================= combo ================= */
function comboMult(){ return Math.min(1 + 0.5 * Math.max(0, comboN - 1), 5); }

function collectGold(gd){
  gd.taken = true; goldLeft--;
  resetRouteHint();
  comboN++; comboT = 2.5;
  const val = Math.round(100 * comboMult());
  addScore(val);
  // juicy pickup burst: gold shards + a quick bright sparkle ring
  spawnParticles(gd.c + .5, gd.r + .5, 16, {color: ['#ffd23f', '#fff3b0', '#ff9d2e'], spd: 3.4, life: .55, size: 3, grav: -2, glow: true});
  spawnParticles(gd.c + .5, gd.r + .5, 7, {color: ['#ffffff'], spd: 5.5, life: .3, size: 2, grav: 0, glow: true});
  pickupTrail(gd.c + .5, gd.r + .5, '#ffd23f');
  popup(gd.c + .5, gd.r + .3, comboN > 1 ? val + ' ×' + comboMult().toFixed(1).replace('.0', '') : '' + val, comboN > 2 ? '#ff9d2e' : '#ffd23f');
  AUDIO.sfx(comboN > 2 ? 'goldhi' : 'gold');
  if (goldLeft <= 0) revealExit();
}

/* ================= prospector hunch / stuck help ================= */
function routeProgressKey(){
  return [
    mode,
    levelIndex,
    goldLeft,
    discoveryCount,
    exitRevealed ? 1 : 0,
    specialCartReady() ? 1 : 0,
  ].join('|');
}

function resetRouteHint(){
  routeHint = null;
  routeHintIdleT = 0;
  routeHintCheckT = 0;
  routeHintManualT = 0;
  routeHintProgress = routeProgressKey();
}

function routeHintTarget(){
  if (!player || !grid.length || player.state === 'dead') return null;
  const seen = reachableCellsFromPlayer();
  if (!exitRevealed){
    let best = null, bestD = Infinity;
    for (const gd of golds){
      if (gd.taken || gd.held) continue;
      if (!seen[gd.r * COLS + gd.c]) continue;
      const d = Math.abs(gd.c + .5 - player.x) + Math.abs(gd.r + .5 - player.y);
      if (d < bestD){ bestD = d; best = {c: gd.c, r: gd.r, kind: 'gold', label: 'NUGGET'}; }
    }
    return best;
  }
  if (isSpecialMode()){
    const cart = special && special.cart;
    if (!cart) return null;
    const c = Math.max(0, Math.min(COLS - 1, Math.floor(cart.x == null ? cart.c : cart.x)));
    const r = Math.max(0, Math.min(ROWS - 1, Math.floor(cart.y == null ? cart.r : cart.y)));
    return seen[r * COLS + c] ? {c, r, kind: 'cart', label: 'CART'} : null;
  }
  if (!exitCells.length) return null;
  const e = topExitCell();
  return seen[e.r * COLS + e.c] ? {c: e.c, r: e.r, kind: 'exit', label: 'EXIT'} : null;
}

function triggerRouteHint(manual){
  const target = routeHintTarget();
  if (!target) return null;
  routeHint = {...target, life: manual ? 6.0 : 4.8, manual: !!manual};
  if (manual) routeHintManualT = routeHint.life;
  popup(target.c + .5, target.r + .1, 'HUNCH: ' + target.label, target.kind === 'gold' ? '#ffd23f' : '#3fd2c7');
  spawnParticles(target.c + .5, target.r + .5, 10, {
    color: [target.kind === 'gold' ? '#ffd23f' : '#3fd2c7', '#fff3b0', '#ffffff'],
    spd: 2.6,
    life: .7,
    size: 2.6,
    grav: -3,
    glow: true,
  });
  return routeHint;
}

function updateRouteHint(dt){
  if (!player || player.state === 'dead' || state !== 'playing'){ resetRouteHint(); return; }
  const progress = routeProgressKey();
  if (progress !== routeHintProgress){
    resetRouteHint();
    routeHintProgress = progress;
    return;
  }
  routeHintIdleT += dt;
  routeHintCheckT -= dt;
  if (routeHint){
    routeHint.life -= dt;
    if (routeHint.life <= 0) routeHint = null;
  }
  if (routeHintManualT > 0) routeHintManualT = Math.max(0, routeHintManualT - dt);
  if (routeHintCheckT > 0 || routeHint) return;
  routeHintCheckT = 1.0;
  if (routeHintIdleT >= 24 || routeHintManualT > 0) triggerRouteHint(routeHintManualT > 0);
}

function drawRouteHint(){
  if (!routeHint || routeHint.life <= 0) return;
  const a = Math.min(1, routeHint.life / 1.2);
  const wx = routeHint.c + .5, wy = routeHint.r + .5;
  const sx = px(wx), sy = py(wy);
  const col = routeHint.kind === 'gold' ? '#ffd23f' : '#3fd2c7';
  const pulse = 0.5 + 0.5 * Math.sin(gameTime * 7);
  ctx.save();
  ctx.globalAlpha = 0.42 * a;
  glow(wx, wy, 42 + pulse * 10, hexA(col, .65), 1);
  ctx.globalAlpha = 0.78 * a;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(sx, sy, 18 + pulse * 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(8,10,18,.72)';
  roundRect(sx - 34, sy - 39, 68, 17, 5);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.font = '900 10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(routeHint.label, sx, sy - 30);
  ctx.restore();
}

function drawDeathCue(){
  if (!player || player.state !== 'dead') return;
  const p = clamp(player.deadT / 0.9, 0, 1);
  const a = Math.min(1, p * 7) * Math.min(1, (1 - p) * 5 + .25);
  const left = Math.max(0, lives - 1);
  const msg = deathText(player.deathReason);
  const sub = left > 0
    ? left + ' ' + (left === 1 ? 'LIFE' : 'LIVES') + ' LEFT'
    : 'NO LIVES LEFT';
  const y = VIEW_H * .46;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(8,5,14,.68)';
  roundRect(VIEW_W / 2 - 154, y - 35, 308, 70, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,107,90,.82)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ff6b5a';
  ctx.font = '900 27px system-ui, sans-serif';
  ctx.fillText(msg, VIEW_W / 2, y - 9);
  ctx.fillStyle = left > 0 ? '#ffd86b' : '#ff8fa0';
  ctx.font = '900 13px system-ui, sans-serif';
  ctx.fillText(sub, VIEW_W / 2, y + 20);
  ctx.restore();
}

function boomHazardLabel(cfg, levelNumber){
  const hazards = [];
  if (cfg.worm) hazards.push('DRILL WORM');
  if (cfg.crushers && cfg.crushers.length) hazards.push('CRUSHERS');
  if (cfg.lava && cfg.lava.length) hazards.push('LAVA');
  if (cfg.vents && cfg.vents.length) hazards.push('VENTS');
  if (cfg.plates && cfg.plates.length) hazards.push('PRESSURE PLATE');
  if (levelNumber >= 12) hazards.push('MASONS');
  else if (levelNumber >= 7) hazards.push('SCOUTS');
  else if (levelNumber >= 5) hazards.push('TNT VEINS');
  else hazards.push('CART ROUTE');
  return hazards.slice(0, 2).join(' + ');
}

function boomGoalLabel(cfg){
  if (cfg.final) return 'FULL RIDE-OUT';
  return 'RIDE TO CART';
}

function makeWavePreview(level, cfg, brief){
  const n = levelIndex + 1;
  const total = LEVELS.special.levels?.length || 1;
  return {
    title: 'BOOM RUSH ' + n + '/' + total,
    hazard: boomHazardLabel(cfg || {}, n),
    goal: boomGoalLabel(cfg || {}),
    brief: brief || 'DRILL, BLAST, LOOT, RIDE OUT',
    life: 4.2,
  };
}

function drawWavePreview(){
  if (!wavePreview || wavePreview.life <= 0) return;
  const fadeIn = Math.min(1, (4.2 - wavePreview.life) * 5);
  const fadeOut = Math.min(1, wavePreview.life / .7);
  const a = Math.min(fadeIn, fadeOut);
  const w = 410, h = 74;
  const x = VIEW_W / 2 - w / 2, y = HUD_H + 10;
  const fitText = (text, maxW) => {
    text = String(text || '');
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 4 && ctx.measureText(text + '...').width > maxW) text = text.slice(0, -1);
    return text + '...';
  };
  ctx.save();
  ctx.globalAlpha = a;
  roundRect(x, y, w, h, 8);
  ctx.fillStyle = 'rgba(8,10,18,.76)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,63,.58)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ffd86b';
  ctx.font = '900 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(wavePreview.title, x + 18, y + 18);
  ctx.fillStyle = '#ff9d2e';
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillText(fitText('HAZARD  ' + wavePreview.hazard, 190), x + 18, y + 43);
  ctx.fillStyle = '#3fd2c7';
  ctx.textAlign = 'right';
  ctx.fillText(fitText('GOAL  ' + wavePreview.goal, 155), x + w - 18, y + 43);
  ctx.fillStyle = 'rgba(235,229,214,.78)';
  ctx.font = '700 10px system-ui, sans-serif';
  ctx.fillText(fitText(wavePreview.brief.toUpperCase(), w - 36), x + w - 18, y + 61);
  ctx.restore();
}

function lastNuggetCueTargets(){
  if (goldLeft <= 0 || goldLeft > 2) return [];
  return golds
    .filter(gd => !gd.taken && !gd.held)
    .map(gd => ({c: gd.c, r: gd.r}));
}

function drawLastNuggetCue(cx0, cy0, phase){
  const pulse = 0.5 + 0.5 * Math.sin(gameTime * 5.6 + phase);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.34 + pulse * 0.26;
  ctx.strokeStyle = '#fff3b0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx0, cy0, 22 + pulse * 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.45 + pulse * 0.38;
  ctx.strokeStyle = '#ffd23f';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(cx0 - 18, cy0);
  ctx.lineTo(cx0 - 8, cy0);
  ctx.moveTo(cx0 + 8, cy0);
  ctx.lineTo(cx0 + 18, cy0);
  ctx.moveTo(cx0, cy0 - 18);
  ctx.lineTo(cx0, cy0 - 8);
  ctx.moveTo(cx0, cy0 + 8);
  ctx.lineTo(cx0, cy0 + 18);
  ctx.stroke();
  ctx.restore();
}

function trapGuard(g){
  g.state = 'stun'; g.stunT = 0; g.anim = 0;
  addScore(150);
  shake = Math.max(shake, .2); hitStop = Math.max(hitStop, .05);
  popup(g.x, g.y - .4, '150', '#ff9d2e');
  spawnParticles(g.x, g.y, 8, {color: ['#7d5230', '#532f1a'], spd: 3, life: .5, size: 3, grav: 24});
  AUDIO.sfx('trap');
  if (g.gold){ // gold pops out above the hole
    const c = Math.floor(g.x), r = Math.floor(g.y);
    g.gold.c = c; g.gold.r = Math.max(0, r - 1);
    g.gold.held = null; g.gold = null;
  }
}

function respawnGuard(g){
  if (player && player.state !== 'dead' && player.y < 3.25){
    g.deadT = GUARD_RESPAWN_T - 0.35;
    return;
  }
  const cols = [];
  for (let c = 0; c < COLS; c++){
    if (!gOccupy(c, 0)) continue;
    if (player && player.state !== 'dead'){
      const dx = Math.abs(player.x - (c + .5));
      const minDx = player.y < 5 ? 10 : 6;
      if (dx < minDx) continue;
    }
    cols.push(c);
  }
  if (!cols.length){
    g.deadT = GUARD_RESPAWN_T - 0.35;
    return;
  }
  const c = cols[(rnd() * cols.length) | 0];
  g.x = c + .5; g.y = 0.5;
  g.state = 'fall'; g.anim = 0; g.wp = null; g.repath = 0;
  g.invuln = 1.2;
  g.alertT = 0; g.alertCool = 1.2;
}

function sealGuard(g){
  if (g.gold){
    const c = Math.floor(g.x), r = Math.floor(g.y);
    g.gold.c = c; g.gold.r = Math.max(0, r - 1);
    g.gold.held = null; g.gold = null;
  }
  g.state = 'dead'; g.deadT = 0;
  addScore(300);
  shake = Math.max(shake, .35);
  popup(g.x, g.y - .4, '300', '#ff9d2e');
  spawnParticles(g.x, g.y, 12, {color: ['#7d5230', '#532f1a', '#915e36'], spd: 3.5, life: .6, size: 3.5, grav: 26});
  AUDIO.sfx('seal');
}

function addScore(n){ score += n; }

/* ================= gold + exit + win/lose ================= */
function revealExit(){
  exitRevealed = true;
  if (special){
    special.cartReady = true;
    triggerCaveIn('HAUL SECURED');
    spawnParticles(special.cart.x, special.cart.y, 26, {color: ['#3fd2c7', '#ffd23f', '#fff3b0'], spd: 4.8, life: .8, size: 3.5, grav: -2, glow: true});
    popup(special.cart.x, special.cart.y - .7, 'CART READY', '#3fd2c7');
  }
  shake = Math.max(shake, .3); flash = Math.max(flash, .35);
  for (const e of exitCells) spawnParticles(e.c + .5, e.r + .5, 5, {color: ['#3fd2c7', '#9ff7ec'], spd: 2.5, life: .8, size: 3, grav: -3, glow: true});
  AUDIO.sfx('reveal');
}

function checkGold(){
  const c = Math.floor(player.x), r = Math.floor(player.y);
  for (const gd of golds){
    if (gd.taken || gd.held) continue;
    if (gd.c === c && gd.r === r &&
        Math.abs(player.x - (gd.c + .5)) < .4 && Math.abs(player.y - (gd.r + .5)) < .4)
      collectGold(gd);
  }
}

function checkWin(){
  if (special){
    if (specialCartReady() && Math.hypot(player.x - special.cart.x, player.y - special.cart.y) < .95)
      startCartEscape();
    return;
  }
  if (!exitRevealed) return;
  const c = Math.floor(player.x);
  if (player.y <= 0.55 && isLadder(c, 0)) levelComplete();
}

function reachableCellsFromPlayer(){
  if (!player) return new Uint8Array(COLS * ROWS);
  const seen = new Uint8Array(COLS * ROWS);
  const q = [];
  const add = (c, r) => {
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
    const n = r * COLS + c;
    if (!seen[n]){ seen[n] = 1; q.push(n); }
  };
  const solidBelow = (c, r) => r + 1 >= ROWS || isSupportTile(c, r + 1);
  const supported = (c, r) => solidBelow(c, r) || isLadder(c, r) || isBar(c, r) || guardSupportAt(c, r + 1);
  const fallTo = (c, r) => {
    let rr = r;
    while (rr < ROWS - 1 && !supported(c, rr) && canOccupy(c, rr + 1)) rr++;
    return rr;
  };
  const diggableFrom = (c, r, dir) => {
    const tc = c + dir, tr = r + 1;
    const target = tileAt(tc, tr);
    if (!(target === '#' || isBottomDiggable(tc, tr)) || isDug(tc, tr) || isBlasted(tc, tr)) return false;
    const above = tileAt(tc, r);
    if (above === '#' && !isDug(tc, r) && !isBlasted(tc, r)) return false;
    if (above === 'X') return false;
    if (above === 'B' && !isBlasted(tc, r)) return false;
    if (above === 'C' && !isCrumbleGone(tc, r) && !isBlasted(tc, r)) return false;
    return true;
  };
  add(Math.floor(player.x), Math.floor(player.y));
  for (let qi = 0; qi < q.length; qi++){
    const n = q[qi], c = n % COLS, r = (n / COLS) | 0;
    if (!supported(c, r)){ add(c, fallTo(c, r)); continue; }
    for (const dir of [-1, 1]){
      const nc = c + dir;
      if (canEnterHoriz(nc, r, dir)) add(nc, fallTo(nc, r));
    }
    if (isLadder(c, r) && canOccupy(c, r - 1)) add(c, r - 1);
    if (canOccupy(c, r + 1) && (isLadder(c, r) || isLadder(c, r + 1))) add(c, r + 1);
    if (isBar(c, r) && canOccupy(c, r + 1) && !solidBelow(c, r)) add(c, fallTo(c, r + 1));
    if (solidBelow(c, r) && r + 1 < ROWS){
      for (const dir of [-1, 1]){
        if (diggableFrom(c, r, dir)) add(c + dir, fallTo(c + dir, r + 1));
      }
    }
    if (tileAt(c, r + 1) === 'C' && !isCrumbleGone(c, r + 1) && !isBlasted(c, r + 1))
      add(c, fallTo(c, r + 1));
  }
  return seen;
}

function currentNoWayOutReason(){
  if (!player || player.state === 'dead' || player.state === 'fall' || player.digT > 0) return '';
  if (specialEscapeInProgress()) return '';
  // Dig holes are temporary. A route blocked by open holes may reopen a few
  // seconds later, so only judge true softlocks after the board has settled.
  if (holes.size || fuses.length) return '';
  if (golds.some(gd => !gd.taken && gd.held)) return '';
  const seen = reachableCellsFromPlayer();
  if (!exitRevealed){
    for (const gd of golds){
      if (!gd.taken && !gd.held && !seen[gd.r * COLS + gd.c])
        return 'A remaining nugget is cut off from your current route.';
    }
    return '';
  }
  if (isSpecialMode()){
    const cart = special && special.cart;
    if (!cart) return 'The mine cart is missing.';
    const cc = Math.max(0, Math.min(COLS - 1, Math.floor(cart.x == null ? cart.c : cart.x)));
    const cr = Math.max(0, Math.min(ROWS - 1, Math.floor(cart.y == null ? cart.r : cart.y)));
    return seen[cr * COLS + cc] ? '' : 'The mine cart cannot be reached from here.';
  }
  if (!exitCells.length) return 'The exit ladder is missing.';
  for (const e of exitCells){
    if (e.r === 0 && seen[e.r * COLS + e.c]) return '';
  }
  return 'The exit ladder cannot be reached from here.';
}

function clearSoftlock(){
  softlockCheckT = 0;
  softlockT = 0;
  softlockReason = '';
}

function showSoftlock(reason){
  state = 'stuck';
  softlockReason = reason || 'This claim cannot be completed from here.';
  for (const k in keys) keys[k] = false;
  $('stuckReason').textContent = softlockReason;
  showOnly('ovStuck');
  AUDIO.sfx('warn');
}

function updateSoftlockDetector(dt){
  if (specialEscapeInProgress()){ clearSoftlock(); return; }
  if (levelTime < 2.0){ clearSoftlock(); return; }
  softlockCheckT -= dt;
  if (softlockCheckT > 0) return;
  softlockCheckT = 0.45;
  const reason = currentNoWayOutReason();
  if (!reason){ softlockT = 0; softlockReason = ''; return; }
  if (reason !== softlockReason){ softlockReason = reason; softlockT = 0; }
  softlockT += softlockCheckT;
  if (softlockT >= 1.8) showSoftlock(reason);
}

let campaignDone = [];
try { campaignDone = JSON.parse(localStorage.getItem('paydirt-done') || '[]'); } catch (e) {}
function markLevelDone(i){
  if (!campaignDone.includes(i)){
    campaignDone.push(i);
    try { localStorage.setItem('paydirt-done', JSON.stringify(campaignDone)); } catch (e) {}
  }
}

function levelComplete(){
  const bonus = 1000 + Math.max(0, 600 - (levelTime | 0) * 10);
  addScore(bonus);
  if (player) popup(player.x, player.y - 1, '+' + bonus + ' CLEAR', '#3fd2c7');
  if (mode === 'special'){
    const levels = LEVELS.special.levels || [LEVELS.special];
    if (levelIndex + 1 < levels.length){
      AUDIO.sfx('win');
      loadSpecialLevel(levelIndex + 1);
    } else {
      endGame(true);
    }
  } else if (mode === 'campaign'){
    markLevelDone(levelIndex);
    if (levelIndex + 1 < LEVELS.campaign.length){
      AUDIO.sfx('win');
      loadCampaignLevel(levelIndex + 1);
    } else {
      endGame(true);
    }
  } else {
    endGame(true);
  }
}

function killPlayer(reason){
  if (!player || player.state === 'dead') return;
  player.state = 'dead';
  player.deadT = 0;
  player.deathReason = reason;
  banner = null;
  hint = null;
  routeHint = null;
  shake = Math.max(shake, .6); flash = Math.max(flash, .4); hitStop = Math.max(hitStop, .08);
  deathFlash = 1;
  spawnParticles(player.x, player.y, 24, {color: ['#3fd2c7', '#ffd23f', '#ff4f6b', '#fff'], spd: 5.5, life: .8, size: 4, grav: 10, glow: true});
  spawnParticles(player.x, player.y + .38, 22, {color: ['#5b3820', '#8a6038', '#c09253', '#2d1b14'], spd: 3.8, life: .75, size: 4.2, grav: 18});
  popup(player.x, player.y - .9, deathText(reason), '#ff6b5a');
  AUDIO.sfx('die');
}

function respawnOrGameOver(){
  lives--;
  if (lives > 0){
    reloadCurrentLevel({preserveGold: true});
    banner = {text: 'BACK IN THE MINE', sub: lives + ' ' + (lives === 1 ? 'LIFE' : 'LIVES') + ' LEFT', life: 1.55};
  } else endGame(false);
}

function reloadCurrentLevel(opts){
  const takenGold = opts && opts.preserveGold ? snapshotCollectedGold() : null;
  if (currentRows){
    loadLevelData(currentRows);
    restoreCollectedGold(takenGold);
  }
  levelTime = 0;
}

function endGame(won){
  state = 'over';
  continueRun = won ? null : {
    mode,
    levelIndex,
    score,
    dailyDate,
    rows: currentRows ? currentRows.slice() : null,
  };
  AUDIO.sfx(won ? 'win' : 'die');
  AUDIO.stopMusic();
  $('overTitle').textContent = won ? 'CLAIM CLEARED!' : 'CLAIM LOST';
  $('overStats').innerHTML =
    '<div>HAUL<br><b>' + score + '</b></div>' +
    (mode === 'daily' ? '<div>MODE<br><b>DAILY</b></div>' :
      mode === 'special' ? '<div>MODE<br><b>BOOM</b></div>' :
      '<div>CLAIM<br><b>' + (levelIndex + 1) + '</b></div>');
  const cb = $('bContinue');
  if (cb){
    cb.style.display = continueRun ? '' : 'none';
    cb.textContent = mode === 'special'
      ? 'Continue Boom ' + (levelIndex + 1)
      : mode === 'daily'
        ? 'Continue Daily'
        : 'Continue Claim ' + (levelIndex + 1);
  }
  beginEntry();
  showOnly('ovOver');
}

function continueLastLevel(){
  if (!continueRun) return startGame(mode);
  mode = continueRun.mode;
  levelIndex = continueRun.levelIndex | 0;
  score = continueRun.score | 0;
  lives = START_LIVES;
  dailyDate = continueRun.dailyDate || null;
  if (mode === 'special') loadSpecialLevel(levelIndex);
  else if (mode === 'daily' && continueRun.rows) loadLevelData(continueRun.rows);
  else loadCampaignLevel(levelIndex);
  continueRun = null;
  gameTime = 0;
  state = 'playing';
  banner = {text: 'CONTINUE', sub: 'FRESH LIVES - SAME CLAIM', life: 1.9};
  hideOverlays();
  AUDIO.ensure(); AUDIO.startMusic();
}

/* ================= high-score entry UI ================= */
let pendingEntry = null, initials = ['A', 'A', 'A'], initCursor = 0;
function beginEntry(){
  pendingEntry = score > 0 ? {score, mode, date: dailyDate} : null;
  initCursor = 0;
  try {
    const saved = (localStorage.getItem('paydirt-initials') || 'AAA').toUpperCase();
    initials = [saved[0] || 'A', saved[1] || 'A', saved[2] || 'A'];
  } catch (e) { initials = ['A', 'A', 'A']; }
  $('entryWrap').style.display = pendingEntry ? '' : 'none';
  renderInitials();
  $('overBoard').innerHTML = '';
  if (pendingEntry) refreshBoardInto('overBoard'); else refreshBoardInto('overBoard');
}
function renderInitials(){
  const spans = $('initials').children;
  for (let i = 0; i < 3; i++){
    spans[i].textContent = initials[i];
    spans[i].classList.toggle('cur', i === initCursor);
  }
}
function cycleInitial(i, dir){
  const code = initials[i].charCodeAt(0) - 65;
  initials[i] = String.fromCharCode(65 + ((code + dir + 26) % 26));
  renderInitials();
}
function moveCursor(d){ initCursor = (initCursor + d + 3) % 3; renderInitials(); }
function setInitial(ch){ initials[initCursor] = ch.toUpperCase(); if (initCursor < 2) initCursor++; renderInitials(); AUDIO.sfx('tick'); }
function submitEntry(){
  if (!pendingEntry) return;
  const name = initials.join('');
  try { localStorage.setItem('paydirt-initials', name); } catch (e) {}
  if (typeof Scores !== 'undefined') Scores.submit(name, pendingEntry.score, pendingEntry.mode, pendingEntry.date);
  pendingEntry = null;
  $('entryWrap').style.display = 'none';
  AUDIO.sfx('ui');
  setTimeout(() => refreshBoardInto('overBoard'), 350);
}

let ledgerView = 'campaign';
function refreshBoardInto(id, forceMode){
  if (forceMode) ledgerView = forceMode;
  else if (id === 'overBoard') ledgerView = (mode === 'daily' ? 'daily' : mode === 'special' ? 'special' : 'campaign');
  Scores.render(id, ledgerView);
}
function refreshTitleBoard(){ Scores.render('titleBoard', 'campaign'); }

/* ================= global scores ================= */
const Scores = {
  BASE: 'https://game-scores.jez237.workers.dev/scores/',
  cache: {},          // ns -> array | 'offline'
  last: null,         // {name, score, ns} of the most recent submit, for highlight
  // The scores worker only persists initials/score/ts (it drops `extra`), so the
  // Daily Dig date is encoded into the namespace instead — one board per UTC day.
  nsFor(view, date){
    if (view === 'special') return 'pay-dirt-boom-rush';
    if (view !== 'daily') return 'pay-dirt';
    return 'pay-dirt-daily-' + (date || dailyDate || LEVELS.dailyDateUTC());
  },
  url(ns){ return this.BASE + ns; },
  async fetchBoard(ns){
    try {
      const r = await fetch(this.url(ns), {cache: 'no-store'});
      const d = await r.json();
      const arr = (Array.isArray(d) ? d : (d.scores || []))
        .map(s => ({
          name: String(s.initials || s.name || '???').slice(0, 3).toUpperCase(),
          score: s.score | 0,
          extra: String(s.extra || ''),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      this.cache[ns] = arr;
    } catch (e) { this.cache[ns] = 'offline'; }
    return this.cache[ns];
  },
  async submit(name, score, mode, date){
    const ns = this.nsFor(mode === 'daily' ? 'daily' : mode === 'special' ? 'special' : 'campaign', date);
    this.last = {name, score, ns};
    try {
      await fetch(this.url(ns), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({initials: name, score}),
      });
      delete this.cache[ns]; // force refresh
    } catch (e) {}
  },
  rowsHTML(board, ns){
    if (board === 'offline') return '<div class="tiny">the ledger is unreachable — score kept locally</div>';
    if (!board) return '<div class="tiny">reading the ledger…</div>';
    if (!board.length) return '<div class="tiny">no claims filed yet — stake the first</div>';
    return board.map((s, i) => {
      const me = this.last && this.last.ns === ns && s.name === this.last.name && s.score === this.last.score;
      const rank = String(i + 1).padStart(2, ' ');
      const sc = String(s.score).padStart(7, ' ');
      return '<div class="' + (me ? 'me' : '') + '">' + rank + '.  ' + s.name + '  ' + sc + '</div>';
    }).join('');
  },
  render(id, view){
    const el = document.getElementById(id);
    if (!el) return;
    const ns = this.nsFor(view);
    const head = view === 'daily'
      ? '<div class="tiny" style="color:var(--teal)">DAILY DIG · ' + (dailyDate || LEVELS.dailyDateUTC()) + '</div>'
      : view === 'special'
        ? '<div class="tiny" style="color:var(--gold)">BOOM RUSH SPECIAL</div>'
        : '';
    const paint = (board) => { el.innerHTML = head + this.rowsHTML(board, ns); };
    if (this.cache[ns]) paint(this.cache[ns]);
    else { paint(null); this.fetchBoard(ns).then(b => paint(b)); }
  },
};

/* ================= how-to + level select ================= */
function buildHowTo(){
  $('howBody').innerHTML =
    '<p><b>Goal:</b> collect every nugget, then escape by the ladder or mine cart.</p>' +
    '<p><b>Move:</b> <span class="k">←</span><span class="k">→</span> run · <span class="k">↑</span><span class="k">↓</span> climb. On phone, drag where you want to go.</p>' +
    '<p><b>Dig:</b> <span class="k">Z</span> left · <span class="k">X</span> right. Drop traps under claim-jumpers, then move before the hole seals.</p>' +
    '<p><b>Watch out:</b> jumpers chase you, scouts are fast, masons repair holes, and carried gold must be knocked loose.</p>' +
    '<p><b>Find:</b> TNT, boots, cloak, magnet, shovel, oil, maps, and heart tokens.</p>' +
    '<p><b>Boom Rush:</b> drill dash with <span class="k">Space</span>/<span class="k">Shift</span>, grab the haul, and reach the cart before the cave wins.</p>' +
    '<p><span class="k">P</span> pause · <span class="k">M</span> mute · <span class="k">R</span> restart.</p>';
}

function buildLevelSelect(){
  const grid = $('lvlGrid');
  grid.innerHTML = '';
  const hintEl = $('lvlHint');
  const maxDone = campaignDone.length ? Math.max(...campaignDone) : -1;
  const unlockTo = Math.min(LEVELS.campaign.length - 1, maxDone + 1);
  const setHint = i => {
    if (!hintEl) return;
    const name = LEVELS.names[i] || ('Claim ' + (i + 1));
    const brief = LEVELS.briefs && LEVELS.briefs[i] ? LEVELS.briefs[i] : 'clear a claim to unlock the next';
    hintEl.textContent = 'Claim ' + (i + 1) + ': ' + name + ' — ' + brief;
  };
  if (hintEl) hintEl.textContent = 'clear a claim to unlock the next';
  for (let i = 0; i < LEVELS.campaign.length; i++){
    const b = document.createElement('button');
    const done = campaignDone.includes(i);
    const locked = i > unlockTo;
    b.textContent = locked ? '🔒' : (i + 1);
    b.title = (LEVELS.names[i] || ('Claim ' + (i + 1))) + (LEVELS.briefs && LEVELS.briefs[i] ? ' — ' + LEVELS.briefs[i] : '');
    if (locked) b.classList.add('locked');
    if (done) b.classList.add('done');
    b.addEventListener('pointerenter', () => setHint(i));
    b.addEventListener('focus', () => setHint(i));
    if (!locked) b.addEventListener('click', e => { e.preventDefault(); AUDIO.ensure(); AUDIO.sfx('ui'); startCampaignAt(i); });
    grid.appendChild(b);
  }
}

/* ================= touch controls ================= */
function initTouch(){
	  const map = { tLeft: 'ArrowLeft', tRight: 'ArrowRight', tUp: 'ArrowUp', tDown: 'ArrowDown', tDigL: 'KeyZ', tDigR: 'KeyX' };
	  for (const id in map){
	    const el = $(id), code = map[id];
	    const on = e => { e.preventDefault(); e.stopPropagation(); keys[code] = true; el.classList.add('on'); document.body.classList.add('touch'); AUDIO.ensure(); };
	    const off = e => { e.preventDefault(); e.stopPropagation(); keys[code] = false; el.classList.remove('on'); };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointerleave', off);
    el.addEventListener('pointercancel', off);
  }
  // clickable initials (touch-friendly entry)
  const spans = $('initials').children;
  for (let i = 0; i < 3; i++)
    spans[i].addEventListener('click', () => { initCursor = i; cycleInitial(i, 1); });
  initTouchGestures();
}

function clearTouchMoveKeys(){
  keys.ArrowLeft = keys.ArrowRight = keys.ArrowUp = keys.ArrowDown = false;
}
const touchPulseTimers = {};
function pulseTouchKey(code, ms){
  clearTimeout(touchPulseTimers[code]);
  keys[code] = true;
  touchPulseTimers[code] = setTimeout(() => { keys[code] = false; }, ms || 180);
}
function clientToGameScreen(clientX, clientY){
  const rect = canvas.getBoundingClientRect();
  const sx = rect.width ? (clientX - rect.left) / rect.width * screenW : clientX;
  const sy = rect.height ? (clientY - rect.top) / rect.height * screenH : clientY;
  return {x: sx, y: sy};
}
function screenToWorldPoint(p){
  if (mobileCamera && mobileView){
    return {
      x: mobileView.x + (p.x / screenW) * mobileView.w,
      y: mobileView.y + ((p.y - mobileView.hudH) / mobileView.playH) * mobileView.h,
    };
  }
  return {x: p.x, y: p.y};
}
function ladderTapTarget(clientX, clientY){
  if (state !== 'playing' || !player || !grid.length) return null;
  const p = clientToGameScreen(clientX, clientY);
  const hudH = mobileCamera ? mobileHudHeight() : HUD_H;
  if (p.y < hudH + 12) return null;
  const w = screenToWorldPoint(p);
  const c0 = Math.floor(w.x / TILE);
  const r0 = Math.floor((w.y - HUD_H) / TILE);
  let best = null, bestD = Infinity;
  for (let dr = -1; dr <= 1; dr++){
    for (let dc = -1; dc <= 1; dc++){
      const c = c0 + dc, r = r0 + dr;
      if (!isLadder(c, r)) continue;
      const sx = mobileCamera && mobileView ? (px(c + .5) - mobileView.x) / mobileView.w * screenW : px(c + .5);
      const sy = mobileCamera && mobileView ? mobileView.hudH + (py(r + .5) - mobileView.y) / mobileView.h * mobileView.playH : py(r + .5);
      const d = Math.hypot(sx - p.x, sy - p.y);
      if (d < bestD){ bestD = d; best = {c, r}; }
    }
  }
  return bestD <= 64 ? best : null;
}
function playerScreenX(){
  if (!player) return screenW / 2;
  if (mobileCamera && mobileView){
    return (px(player.x) - mobileView.x) / mobileView.w * screenW;
  }
  return px(player.x);
}
function handleTouchLadder(clientX, clientY){
  const lad = ladderTapTarget(clientX, clientY);
  if (!lad) return false;
  AUDIO.ensure();
  const targetX = lad.c + .5;
  if (Math.abs(player.x - targetX) > LADDER_TOUCH_X) return false;
  const p = clientToGameScreen(clientX, clientY);
  const w = screenToWorldPoint(p);
  const tapY = (w.y - HUD_H) / TILE;
  const dir = Math.abs(tapY - player.y) > 0.2
    ? (tapY < player.y ? -1 : 1)
    : (lad.r + .5 < player.y ? -1 : 1);
  pulseTouchKey(dir < 0 ? 'ArrowUp' : 'ArrowDown', 260);
  return true;
}
function handleTouchDig(clientX, clientY){
  if (state !== 'playing' || !player) return false;
  const p = clientToGameScreen(clientX, clientY);
  const hudH = mobileCamera ? mobileHudHeight() : HUD_H;
  if (p.y < hudH + 24) return false;
  AUDIO.ensure();
  const w = screenToWorldPoint(p);
  const target = {
    c: Math.floor(w.x / TILE),
    r: Math.floor((w.y - HUD_H) / TILE),
  };
  const dir = p.x < playerScreenX() ? -1 : 1;
  if (!tryDig(dir, target)) pulseTouchKey(dir < 0 ? 'KeyZ' : 'KeyX', 240);
  return true;
}
function initTouchGestures(){
  const gesture = {id: null, sx: 0, sy: 0, x: 0, y: 0, t: 0, moved: false};
  const touchTap = {id: null, sx: 0, sy: 0, t: 0, moved: false};
  const touches = new Map();
  const pinch = {active: false, startDist: 1, startZoom: 1, changed: false};
  let lastTapAction = 0;
  const setMove = (dx, dy) => {
    clearTouchMoveKeys();
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax > 18 && ax >= ay * 0.72) keys[dx < 0 ? 'ArrowLeft' : 'ArrowRight'] = true;
    if (ay > 22 && ay > ax * 0.62) keys[dy < 0 ? 'ArrowUp' : 'ArrowDown'] = true;
  };
  const pinchDistance = () => {
    const pts = [...touches.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };
  const beginPinch = () => {
    pinch.active = true;
    pinch.changed = false;
    pinch.startDist = Math.max(1, pinchDistance());
    pinch.startZoom = mobileZoomAdjust;
    gesture.id = null;
    clearTouchMoveKeys();
  };
  const updatePinch = () => {
    if (!pinch.active) return;
    const d = pinchDistance();
    if (d <= 0) return;
    mobileZoomAdjust = clamp(pinch.startZoom * (d / pinch.startDist), 0.68, 1.45);
    pinch.changed = true;
  };
  const reset = () => {
    gesture.id = null;
    clearTouchMoveKeys();
  };
  const runTapAction = (clientX, clientY) => {
    const now = performance.now();
    if (now - lastTapAction < 140) return true;
    lastTapAction = now;
    clearTouchMoveKeys();
    if (!handleTouchLadder(clientX, clientY)) handleTouchDig(clientX, clientY);
    return true;
  };
  canvas.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || e.target.closest('button,.panel')) return;
    if (state !== 'playing') return;
    e.preventDefault();
    document.body.classList.add('touch');
    AUDIO.ensure();
    touches.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (mobileCamera && touches.size >= 2){
      beginPinch();
      return;
    }
    gesture.id = e.pointerId; gesture.sx = gesture.x = e.clientX; gesture.sy = gesture.y = e.clientY;
    gesture.t = performance.now(); gesture.moved = false;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  });
  canvas.addEventListener('pointermove', e => {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (pinch.active){
      e.preventDefault();
      updatePinch();
      return;
    }
    if (e.pointerId !== gesture.id) return;
    e.preventDefault();
    gesture.x = e.clientX; gesture.y = e.clientY;
    const dx = gesture.x - gesture.sx, dy = gesture.y - gesture.sy;
    if (Math.hypot(dx, dy) > 13) gesture.moved = true;
    if (gesture.moved) setMove(dx, dy);
  });
  const finish = e => {
    touches.delete(e.pointerId);
    if (pinch.active){
      e.preventDefault();
      if (touches.size < 2) pinch.active = false;
      if (pinch.changed) { reset(); return; }
    }
    if (e.pointerId !== gesture.id) return;
    e.preventDefault();
    const elapsed = performance.now() - gesture.t;
    const dist = Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy);
    if (elapsed < 280 && dist < 16){
      runTapAction(e.clientX, e.clientY);
      gesture.id = null;
    } else {
      reset();
    }
  };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', e => { touches.delete(e.pointerId); reset(); pinch.active = false; });
  canvas.addEventListener('lostpointercapture', e => { touches.delete(e.pointerId); reset(); if (touches.size < 2) pinch.active = false; });
  canvas.addEventListener('touchstart', e => {
    if (state !== 'playing' || e.touches.length !== 1) return;
    const t = e.changedTouches[0];
    touchTap.id = t.identifier;
    touchTap.sx = t.clientX;
    touchTap.sy = t.clientY;
    touchTap.t = performance.now();
    touchTap.moved = false;
    document.body.classList.add('touch');
  }, {passive: true});
  canvas.addEventListener('touchmove', e => {
    if (touchTap.id == null) return;
    for (const t of e.changedTouches){
      if (t.identifier !== touchTap.id) continue;
      if (Math.hypot(t.clientX - touchTap.sx, t.clientY - touchTap.sy) > 16) touchTap.moved = true;
      break;
    }
  }, {passive: true});
  canvas.addEventListener('touchend', e => {
    if (touchTap.id == null) return;
    for (const t of e.changedTouches){
      if (t.identifier !== touchTap.id) continue;
      const elapsed = performance.now() - touchTap.t;
      const dist = Math.hypot(t.clientX - touchTap.sx, t.clientY - touchTap.sy);
      touchTap.id = null;
      if (!touchTap.moved && elapsed < 320 && dist < 18) runTapAction(t.clientX, t.clientY);
      break;
    }
  }, {passive: true});
  canvas.addEventListener('touchcancel', () => { touchTap.id = null; }, {passive: true});
}

function playerInput(){
  const inp = {
    left: keys.ArrowLeft || keys.KeyA,
    right: keys.ArrowRight || keys.KeyD,
    up: keys.ArrowUp || keys.KeyW,
    down: keys.ArrowDown || keys.KeyS,
    digL: keys.KeyZ || keys.Comma,
    digR: keys.KeyX || keys.Period,
    dash: keys.Space || keys.ShiftLeft || keys.ShiftRight,
  };
  return inp;
}

function shouldSeedExtraLife(){
  if (mode === 'daily'){
    return Math.abs(LEVELS.hashStr('life:' + (dailyDate || LEVELS.dailyDateUTC()))) % 4 === 0;
  }
  if (mode === 'special') return levelIndex > 0 && levelIndex % 4 === 2;
  return levelIndex > 0 && levelIndex % 5 === 3;
}

function seedExtraLife(candidates, occ){
  if (!shouldSeedExtraLife()) return;
  const choices = candidates.filter(spot => {
    if (occ.has(key(spot.c, spot.r))) return false;
    if (Math.abs(spot.c - spawnPoint.c) + Math.abs(spot.r - spawnPoint.r) < 5) return false;
    if (exitCells.some(e => Math.abs(e.c - spot.c) + Math.abs(e.r - spot.r) < 4)) return false;
    return true;
  });
  if (!choices.length) return;
  const seed = Math.abs(LEVELS.hashStr(mode + ':life:' + levelIndex + ':' + (dailyDate || 'campaign')));
  const spot = choices[seed % choices.length];
  powerups.push({c: spot.c, r: spot.r, kind: 6, taken: false});
  occ.add(key(spot.c, spot.r));
}

function seedTreasures(){
  treasures = [];
  const rr = ART.rng(8603 + levelIndex * 211 + (mode === 'daily' ? 991 : 0));
  const occ = new Set();
  for (const gd of golds) occ.add(key(gd.c, gd.r));
  for (const pu of powerups) occ.add(key(pu.c, pu.r));
  for (const gs of guardSpawns) occ.add(key(gs.c, gs.r));
  occ.add(key(spawnPoint.c, spawnPoint.r));
  for (const e of exitCells) occ.add(key(e.c, e.r));
  const candidates = [];
  for (let r = 1; r < ROWS - 1; r++){
    for (let c = 1; c < COLS - 1; c++){
      if (occ.has(key(c, r))) continue;
      const t = tileAt(c, r);
      if (t !== '.' && t !== '-' && t !== 'H' && t !== '<' && t !== '>') continue;
      const supported = isSupportTile(c, r + 1) || isLadder(c, r) || isBar(c, r);
      if (!supported) continue;
      const nearGold = golds.some(g => Math.abs(g.c - c) + Math.abs(g.r - r) <= 2);
      const edgeOrNook = c < 4 || c > COLS - 5 || r < 3 || r > ROWS - 4 || tileAt(c - 1, r) === 'X' || tileAt(c + 1, r) === 'X';
      const weight = (nearGold ? 1 : 2) + (edgeOrNook ? 2 : 0) + (tileAt(c, r) === 'H' ? 1 : 0);
      candidates.push({c, r, weight});
    }
  }
  candidates.sort((a, b) => (b.weight + rr() * .2) - (a.weight + rr() * .2));
  seedExtraLife(candidates, occ);
  const kinds = ['relic', 'bloom', 'map', 'oil'];
  const want = Math.min(5 + Math.min(levelIndex, 3), Math.max(2, candidates.length));
  for (const spot of candidates){
    if (treasures.length >= want) break;
    if (occ.has(key(spot.c, spot.r))) continue;
    if (treasures.some(t => Math.abs(t.c - spot.c) + Math.abs(t.r - spot.r) < 3)) continue;
    treasures.push({c: spot.c, r: spot.r, kind: kinds[treasures.length % kinds.length], taken: false});
  }
  discoveryCount = 0;
  discoveryTotal = treasures.length;
  discoveryPulse = 0;
  oilLightT = 0;
}
function claimThreatLabel(){
  const counts = {guard: 0, scout: 0, mason: 0};
  for (const g of guardSpawns) counts[g.kind || 'guard']++;
  const parts = [];
  if (counts.scout) parts.push(counts.scout + ' scout' + (counts.scout > 1 ? 's' : ''));
  if (counts.mason) parts.push(counts.mason + ' mason' + (counts.mason > 1 ? 's' : ''));
  if (counts.guard) parts.push(counts.guard + ' jumper' + (counts.guard > 1 ? 's' : ''));
  return parts.length ? parts.join(' / ') : 'quiet claim';
}

function loadLevelData(rows){
  currentRows = rows;
  resetSpecialState();
  const specialLevel = isSpecialMode() && LEVELS.special.levels
    ? LEVELS.special.levels[levelIndex]
    : null;
  const specialCfg = specialLevel && specialLevel.config ? specialLevel.config : {};
  srand(rows.join('').length * 2654435761 + rows[0].charCodeAt(0));
  parseLevel(rows);
  seedTreasures();
  player = makeActor(spawnPoint.c, spawnPoint.r, 'player');
  guards = guardSpawns.map(g => makeActor(g.c, g.r, g.kind));
  if (isSpecialMode()){
    player.tnt = specialCfg.tnt == null ? 4 : specialCfg.tnt;
    player.speedT = specialCfg.speed == null ? 6 : specialCfg.speed;
    player.shovelT = specialCfg.shovel == null ? 8 : specialCfg.shovel;
    player.drillCd = 0;
    const cart = specialCfg.cart || {c: 25, r: 14, x: 25.5, y: 14.5};
    special = {
      caveT: null,
      caveLimit: specialCfg.caveTime || 46,
      rockT: 0,
      cart: {c: cart.c, r: cart.r, x: cart.x == null ? cart.c + .5 : cart.x, y: cart.y == null ? cart.r + .5 : cart.y},
      cartReady: false,
      escapeT: 0,
      escapeDur: specialCfg.escapeDur || 1.45,
      escapeDist: specialCfg.escapeDist || 4.5,
      final: !!specialCfg.final,
      drillHintT: 8,
      triggeredAtGold: Math.ceil(golds.length * (specialCfg.triggerPct || .52)),
      plates: (specialCfg.plates || []).map(p => ({...p})),
      vents: (specialCfg.vents || []).map(v => ({...v})),
      lava: (specialCfg.lava || []).map(l => ({...l})),
      crushers: (specialCfg.crushers || []).map(c => ({...c})),
      worm: specialCfg.worm ? {...specialCfg.worm} : null,
    };
  }
  levelTime = 0;
  particles = []; popups = [];
  shake = 0; hitStop = 0; flash = 0; deathFlash = 0;
  digBuffer = 0; runDustT = 0; prevDash = false;
  resetRouteHint();
  mobileLeadX = 0; mobileLeadY = 0;
  selectPainterlyBackdrop();
  buildBackdrop();
  computeDecor();
  // intro banner
  const stats = [
    {label: 'GOLD', value: golds.length},
    {label: 'FINDS', value: discoveryTotal},
    {label: 'THREAT', value: claimThreatLabel().toUpperCase()},
  ];
  if (mode === 'special'){
    wavePreview = makeWavePreview(specialLevel, specialCfg, specialLevel?.brief);
    banner = {text: 'BOOM RUSH ' + (levelIndex + 1) + '/' + (LEVELS.special.levels?.length || 1), sub: (specialLevel?.brief || 'DRILL, BLAST, LOOT, RIDE OUT').toUpperCase(), stats, life: 2.0};
  } else if (mode === 'daily'){
    wavePreview = null;
    banner = {text: 'DAILY DIG', sub: dailyDate || LEVELS.dailyDateUTC(), stats, life: 2.4};
  } else {
    wavePreview = null;
    banner = {text: 'CLAIM ' + (levelIndex + 1), sub: (LEVELS.names[levelIndex] || '').toUpperCase(), brief: LEVELS.briefs && LEVELS.briefs[levelIndex], stats, life: 2.4};
  }
  hint = null;
  if (mode === 'special'){
    hint = {
      life: 9,
      text: (specialLevel?.brief || 'SPACE / SHIFT drill dash   Z / X dig   DOWN + dig spends TNT   escape by cart'),
    };
  } else if (mode === 'campaign'){
    const brief = LEVELS.briefs && LEVELS.briefs[levelIndex];
    hint = {
      life: levelIndex === 0 ? 7 : 4.8,
      text: levelIndex === 0 ? '◀ ▶ run   ↑ ↓ ladders   Z / X  dig left / right' : brief,
    };
  }
}

function loadCampaignLevel(i){
  levelIndex = Math.max(0, Math.min(LEVELS.campaign.length - 1, i | 0));
  loadLevelData(LEVELS.campaign[levelIndex]);
}

function loadSpecialLevel(i){
  const levels = LEVELS.special.levels || [{rows: LEVELS.special.rows}];
  levelIndex = Math.max(0, Math.min(levels.length - 1, i | 0));
  loadLevelData(levels[levelIndex].rows);
}

/* ================= flow ================= */
let dailyDate = null;

function startGame(m){
  continueRun = null;
  mode = m || 'campaign';
  score = 0; lives = START_LIVES;
  if (mode === 'special'){
    dailyDate = null;
    loadSpecialLevel(0);
  } else if (mode === 'daily'){
    const d = LEVELS.generateDaily();
    dailyDate = d.date;
    levelIndex = 0;
    loadLevelData(d.rows);
  } else {
    loadCampaignLevel(0);
  }
  gameTime = 0;
  state = 'playing';
  hideOverlays();
  AUDIO.ensure(); AUDIO.startMusic();
}

function startCampaignAt(i){
  continueRun = null;
  mode = 'campaign';
  score = 0; lives = START_LIVES;
  loadCampaignLevel(i);
  gameTime = 0;
  state = 'playing';
  hideOverlays();
  AUDIO.ensure(); AUDIO.startMusic();
}
function pauseGame(){ if (state !== 'playing') return; state = 'paused'; showOnly('ovPause'); }
function resumeGame(){ if (state !== 'paused') return; state = 'playing'; hideOverlays(); }
function restartLevel(){ reloadCurrentLevel(); state = 'playing'; hideOverlays(); }
function quitToTitle(){ state = 'title'; AUDIO.stopMusic(); showOnly('ovTitle'); refreshTitleBoard(); }
function toggleMute(){
  AUDIO.ensure(); AUDIO.setMuted(!AUDIO.muted);
  const label = (AUDIO.muted ? '🔇 Muted' : '🔊 Sound');
  $('bMute').textContent = label; $('bPauseMute').textContent = label;
}
function syncVolumeSliders(){
  const music = Math.round(AUDIO.musicVolume * 100);
  const sfx = Math.round(AUDIO.sfxVolume * 100);
  for (const id of ['musicVol', 'pauseMusicVol']) if ($(id)) $(id).value = music;
  for (const id of ['sfxVol', 'pauseSfxVol']) if ($(id)) $(id).value = sfx;
}
function bindVolumeSlider(id, kind){
  const el = $(id);
  if (!el) return;
  el.addEventListener('pointerdown', e => { e.stopPropagation(); AUDIO.ensure(); });
  el.addEventListener('input', e => {
    e.stopPropagation();
    const v = Number(el.value) / 100;
    if (kind === 'music') AUDIO.setMusicVolume(v);
    else AUDIO.setSfxVolume(v);
    syncVolumeSliders();
  });
}
function initVolumeControls(){
  bindVolumeSlider('musicVol', 'music');
  bindVolumeSlider('pauseMusicVol', 'music');
  bindVolumeSlider('sfxVol', 'sfx');
  bindVolumeSlider('pauseSfxVol', 'sfx');
  syncVolumeSliders();
}

function bindButton(id, fn){
  const b = $(id);
  let lastFire = 0;
  const fire = e => {
    e.preventDefault();
    e.stopPropagation();
    const now = performance.now();
    if (now - lastFire < 260) return;
    lastFire = now;
    AUDIO.ensure();
    AUDIO.sfx('ui');
    fn();
  };
  b.addEventListener('pointerup', fire);
  b.addEventListener('click', fire);
}
bindButton('bPlay', () => startGame('campaign'));
bindButton('bSpecial', () => startGame('special'));
bindButton('bDaily', () => startGame('daily'));
bindButton('bLevels', () => { state = 'levels'; buildLevelSelect(); showOnly('ovLevels'); });
bindButton('bHow', () => { state = 'how'; showOnly('ovHow'); });
bindButton('bScores', () => { state = 'scores'; showOnly('ovScores'); refreshBoardInto('scoreBoard'); });
bindButton('bMute', toggleMute);
bindButton('bPauseMute', toggleMute);
bindButton('bHowBack', quitToTitle);
bindButton('bLevelsBack', quitToTitle);
bindButton('bScoresBack', quitToTitle);
bindButton('bResume', resumeGame);
bindButton('bRestartLvl', restartLevel);
bindButton('bStuckRestart', restartLevel);
bindButton('bStuckMenu', quitToTitle);
bindButton('bQuit', quitToTitle);
bindButton('bContinue', continueLastLevel);
bindButton('bAgain', () => startGame(mode));
bindButton('bOverMenu', quitToTitle);
bindButton('bSubmit', submitEntry);
bindButton('bLedgerCampaign', () => refreshBoardInto('scoreBoard', 'campaign'));
bindButton('bLedgerDaily', () => refreshBoardInto('scoreBoard', 'daily'));

buildHowTo();
initTouch();
initVolumeControls();
refreshTitleBoard();

/* ================= sim ================= */
function update(dt){
  gameTime += dt;
  if (shake > 0) shake = Math.max(0, shake - dt * 3.2);
  if (flash > 0) flash = Math.max(0, flash - dt * 2.4);
  if (deathFlash > 0) deathFlash = Math.max(0, deathFlash - dt * 1.6);
  if (discoveryPulse > 0) discoveryPulse = Math.max(0, discoveryPulse - dt * 1.8);
  if (banner){ banner.life -= dt; if (banner.life <= 0) banner = null; }
  if (hint){ hint.life -= dt; if (hint.life <= 0) hint = null; }
  if (wavePreview){ wavePreview.life -= dt; if (wavePreview.life <= 0) wavePreview = null; }
  updateParticles(dt);
  if (!player) return;
  // hit-pause: freeze entity sim for a few frames on big impacts (deterministic under step)
  if (hitStop > 0){ hitStop = Math.max(0, hitStop - dt); return; }
  levelTime += dt;
  if (player.squashT > 0) player.squashT = Math.max(0, player.squashT - dt);

  if (player.state === 'dead'){
    player.deadT += dt;
    if (player.deadT > 0.9) respawnOrGameOver();
    updateHoles(dt);
    return;
  }

  const inp = playerInput();
  if (isSpecialMode() && inp.dash && !prevDash) startDrillDash(inp);
  prevDash = !!inp.dash;
  // Dig attempts every tick the button is held (classic): tap = one dig, hold = repeats
  // as the cooldown frees, and a held button digs the instant you land. tryDig() self-gates.
  if (inp.digL) tryDig(-1);
  else if (inp.digR) tryDig(1);
  prevDigL = !!inp.digL; prevDigR = !!inp.digR;

  if (player.digT > 0){
    player.digT -= dt;
    if (player.pendingDig){
      const total = Math.max(0.01, player.pendingDig.total || DIG_TIME);
      const progress = clamp(1 - player.digT / total, 0, 1);
      if (progress >= 0.38 && player.pendingDig.fx < 1){
        chipDig(player.pendingDig.c, player.pendingDig.r, player.pendingDig.dir || player.dir, false);
        player.pendingDig.fx = 1;
      }
      if (progress >= 0.72 && player.pendingDig.fx < 2){
        chipDig(player.pendingDig.c, player.pendingDig.r, player.pendingDig.dir || player.dir, true);
        player.pendingDig.fx = 2;
        shake = Math.max(shake, .14);
      }
    }
    if (player.digT <= 0 && player.pendingDig){
      openHole(player.pendingDig.c, player.pendingDig.r);
      player.pendingDig = null;
    }
  } else {
    if (!updateDrillDash(dt)) moveActor(player, dt, inp, player.speedT > 0 ? 1.45 : 1);
    // running dust puffs + footstep ticks
    if (player.state === 'run'){
      runDustT -= dt;
      if (runDustT <= 0){ runDustT = 0.16; spawnParticles(player.x - player.dir * 0.2, player.y + 0.42, 1, {color: ['#6b4326', '#8a6038'], spd: 0.8, ang: -1.8, spread: 1, life: 0.3, size: 2.5, grav: 12}); AUDIO.sfx('step'); }
    } else if (player.state === 'climb'){
      runDustT -= dt;
      if (runDustT <= 0){ runDustT = 0.2; AUDIO.sfx('rung'); }
    }
  }

  for (const g of guards){
    if (g.invuln > 0) g.invuln -= dt;
    updateGuard(g, dt);
  }

  updateHoles(dt);
  updateFuses(dt);
  updateCrumbles(dt);
  if (isSpecialMode()) updateSpecial(dt, inp);
  if (comboT > 0){ comboT -= dt; if (comboT <= 0) comboN = 0; }
  if (player.state !== 'dead'){
    updatePowerups(dt);
    checkGold();
    checkWin();
    updateRouteHint(dt);
    if (state === 'playing') updateSoftlockDetector(dt);
  }
}

/* ================= render ================= */
function px(v){ return v * TILE; }                 // tile-units -> logical px (x)
function py(v){ return v * TILE + HUD_H; }          // tile-units -> logical px (y)
function drawTile(img, c, r){ ctx.drawImage(img, c * TILE, r * TILE + HUD_H); }

/* parallax cave backdrop, baked per level */
let bg = null, bloomCv = null, bloomCx = null;
const PAINTERLY_BACKDROPS = [
  'assets/painterly-cavern-bg-01.png',
  'assets/painterly-cavern-bg-02.png',
  'assets/painterly-cavern-bg-03.png',
  'assets/painterly-cavern-bg-04.png',
  'assets/painterly-cavern-bg-05.png',
  'assets/painterly-cavern-bg-06.png',
  'assets/painterly-cavern-bg-07.png',
];
const painterlyPlate = new Image();
let painterlyPlateReady = false, painterlyPlateSrc = '';
painterlyPlate.onload = () => { painterlyPlateReady = true; bg = null; if (booted) render(); };

function levelVisualChapter(){
  if (mode === 'daily') return Math.abs(LEVELS.hashStr(dailyDate || LEVELS.dailyDateUTC())) % PAINTERLY_BACKDROPS.length;
  return Math.max(0, Math.floor(levelIndex / 2));
}

function painterlyBackdropIndex(){
  if (mode === 'special') return (levelVisualChapter() + 4) % PAINTERLY_BACKDROPS.length;
  if (mode === 'campaign') return Math.min(PAINTERLY_BACKDROPS.length - 1, Math.floor(levelIndex / 2));
  return levelVisualChapter();
}
function selectPainterlyBackdrop(){
  const src = PAINTERLY_BACKDROPS[painterlyBackdropIndex()] || PAINTERLY_BACKDROPS[0];
  if (src === painterlyPlateSrc) return;
  painterlyPlateReady = false;
  painterlyPlateSrc = src;
  bg = null;
  painterlyPlate.src = src;
}
painterlyPlateSrc = PAINTERLY_BACKDROPS[0];
painterlyPlate.src = painterlyPlateSrc;

function drawCoverImage(x, img, dx, dy, dw, dh){
  if (!img || !img.naturalWidth || !img.naturalHeight) return;
  const s = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
  const sw = dw / s, sh = dh / s;
  const sx = (img.naturalWidth - sw) / 2, sy = (img.naturalHeight - sh) / 2;
  x.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function buildBackdrop(){
  bg = ART.cv(VIEW_W, VIEW_H);
  const x = ART.cx(bg), r = ART.rng(1234 + levelIndex * 97 + (mode === 'daily' ? 555 : 0));
  const W = VIEW_W, H = VIEW_H;
  const lift = (cx2, cy, rad, col, a) => {
    const rg = x.createRadialGradient(cx2, cy, 0, cx2, cy, rad);
    rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
    x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = a;
    x.fillStyle = rg; x.fillRect(cx2 - rad, cy - rad, rad * 2, rad * 2); x.restore();
  };

  // 1) generated painterly direction plate, dimmed into a playable background
  if (painterlyPlateReady){
    x.save();
    x.filter = 'saturate(1.36) contrast(1.1)';
    drawCoverImage(x, painterlyPlate, 0, HUD_H, W, H - HUD_H);
    x.filter = 'none';
    x.globalCompositeOperation = 'multiply';
    x.fillStyle = 'rgba(5,7,15,.14)';
    x.fillRect(0, HUD_H, W, H - HUD_H);
    x.globalCompositeOperation = 'source-over';
    x.restore();
  }

  // 2) deep cave gradient, pushed toward a painted gouache plate
  let g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, painterlyPlateReady ? 'rgba(35,49,74,.22)' : '#23314a');
  g.addColorStop(.45, painterlyPlateReady ? 'rgba(24,26,43,.2)' : '#181a2b');
  g.addColorStop(1, painterlyPlateReady ? 'rgba(9,10,18,.38)' : '#090a12');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.globalAlpha = painterlyPlateReady ? .055 : .18;
  for (let i = 0; i < (painterlyPlateReady ? 70 : 180); i++){
    const px0 = r() * W, py0 = r() * H, ww = 28 + r() * 110, hh = 2 + r() * 10;
    x.save();
    x.translate(px0, py0); x.rotate((r() - .5) * .55);
    x.fillStyle = r() < .5 ? '#36506a' : '#6b5742';
    x.beginPath(); x.ellipse(0, 0, ww, hh, 0, 0, 7); x.fill();
    x.restore();
  }
  x.globalAlpha = 1;

  // 3) distant cavern light (far openings glowing cold blue)
  lift(W * 0.5, H * 0.30, H * 0.62, 'rgba(58,116,158,.5)', 1);
  lift(W * 0.17, H * 0.24, H * 0.34, 'rgba(44,92,134,.4)', 1);
  lift(W * 0.84, H * 0.40, H * 0.34, 'rgba(50,84,124,.34)', 1);

  // 4) waterfalls drifting through the far light
  for (let i = 0; i < 3; i++){
    const wx = W * (0.28 + 0.46 * r()), ww = 16 + r() * 26;
    const wg = x.createLinearGradient(0, 30, 0, H * 0.72);
    wg.addColorStop(0, 'rgba(160,205,235,0)'); wg.addColorStop(.35, 'rgba(150,200,230,.16)'); wg.addColorStop(1, 'rgba(120,170,210,.03)');
    x.fillStyle = wg; x.fillRect(wx, 30, ww, H * 0.64);
    x.fillStyle = 'rgba(190,225,245,.08)'; x.fillRect(wx + ww * 0.3, 30, ww * 0.25, H * 0.6);
  }

  // 5) far rock-wall silhouettes (humps, lower so the light reads as depth behind)
  x.fillStyle = painterlyPlateReady ? 'rgba(18,22,38,.28)' : 'rgba(38,44,72,.62)';
  for (let i = 0; i < (painterlyPlateReady ? 3 : 6); i++){ const cx2 = r() * W, w = 150 + r() * 230, h = 90 + r() * 150; x.beginPath(); x.ellipse(cx2, H - 20 + r() * 80, w, h, 0, Math.PI, 0); x.fill(); }

  // 6) glowing crystal clusters (more, bigger, brighter — a signature of the look)
  for (let i = 0; i < 9; i++){
    const cx2 = 40 + r() * (W - 80), cy = H * 0.38 + r() * H * 0.46, teal = r() < 0.55;
    const col = teal ? '#3fd2c7' : '#9a6cff', glo = teal ? 'rgba(63,210,199,' : 'rgba(154,108,255,';
    const scale = 0.8 + r() * 0.9;
    lift(cx2, cy, 60 * scale, glo + (painterlyPlateReady ? '.22)' : '.45)'), 1);
    lift(cx2, cy, 26 * scale, glo + (painterlyPlateReady ? '.24)' : '.4)'), 1);
    const n = 4 + (r() * 3 | 0);
    for (let k = 0; k < n; k++){
      const dx = (r() - .5) * 34 * scale, dh = (15 + r() * 26) * scale, dw = (4 + r() * 6) * scale;
      x.globalAlpha = painterlyPlateReady ? .34 : .58; x.fillStyle = col;
      x.beginPath(); x.moveTo(cx2 + dx, cy - dh); x.lineTo(cx2 + dx + dw, cy); x.lineTo(cx2 + dx, cy + dh * 0.4); x.lineTo(cx2 + dx - dw, cy); x.closePath(); x.fill();
      x.globalAlpha = painterlyPlateReady ? .55 : .85; x.fillStyle = teal ? '#bafff5' : '#e0ccff'; x.fillRect(cx2 + dx - 1, (cy - dh * 0.55) | 0, 2, (dh * 0.5) | 0); // bright facet edge
      x.globalAlpha = .9; x.fillStyle = '#fff'; x.fillRect((cx2 + dx) | 0, (cy - dh * 0.35) | 0, 1, 2);                                   // glint
    }
    x.globalAlpha = 1;
  }

  // 7) stalactites (top) + stalagmites (bottom)
  x.fillStyle = 'rgba(34,30,54,.85)';
  for (let i = 0; i < 16; i++){ const sx = r() * W, w = 14 + r() * 30, h = 44 + r() * 150; x.beginPath(); x.moveTo(sx - w / 2, 0); x.lineTo(sx + w / 2, 0); x.lineTo(sx, h); x.closePath(); x.fill(); }
  for (let i = 0; i < 9; i++){ const sx = r() * W, w = 22 + r() * 40, h = 40 + r() * 120; x.beginPath(); x.moveTo(sx - w / 2, H); x.lineTo(sx + w / 2, H); x.lineTo(sx, H - h); x.closePath(); x.fill(); }

  // 8) hanging vines
  for (let i = 0; i < 9; i++){
    const vx = r() * W, vl = 50 + r() * 150;
    x.strokeStyle = 'rgba(46,74,44,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(vx, 0);
    for (let y = 0; y < vl; y += 8) x.lineTo(vx + Math.sin(y * 0.18 + i) * 5, y);
    x.stroke();
    x.fillStyle = 'rgba(64,104,54,.55)';
    for (let y = 14; y < vl; y += 18){ const lx = vx + Math.sin(y * 0.18 + i) * 5; x.beginPath(); x.ellipse(lx + 3, y, 4, 2, 0.5, 0, 7); x.fill(); }
  }

  // 9) god-ray light shafts (subtle, additive)
  x.save(); x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++){ const rx = W * 0.28 + i * W * 0.14 + r() * 30; x.globalAlpha = 0.035 + 0.025 * r(); x.fillStyle = '#9fc0e6'; x.beginPath(); x.moveTo(rx, 0); x.lineTo(rx + 55, 0); x.lineTo(rx + 150, H); x.lineTo(rx + 60, H); x.closePath(); x.fill(); }
  x.restore();

  // 10) faint floating specks baked into depth
  for (let i = 0; i < 40; i++){ x.globalAlpha = .08 + r() * .18; x.fillStyle = r() < .5 ? '#8fb0d0' : '#d0b070'; x.fillRect(r() * W | 0, r() * H | 0, 1, 1); }
  x.globalAlpha = 1;

  // 11) warm hand-painted wash near playable ledges
  x.save(); x.globalCompositeOperation = 'soft-light'; x.globalAlpha = painterlyPlateReady ? .14 : .32;
  for (let i = 0; i < (painterlyPlateReady ? 18 : 44); i++){
    const cx2 = r() * W, cy = HUD_H + r() * (H - HUD_H), ww = 40 + r() * 170, hh = 5 + r() * 22;
    x.translate(cx2, cy); x.rotate((r() - .5) * .8);
    x.fillStyle = r() < .55 ? '#d69a55' : '#72b9b2';
    x.beginPath(); x.ellipse(0, 0, ww, hh, 0, 0, 7); x.fill();
    x.setTransform(1, 0, 0, 1, 0, 0);
  }
  x.restore();

  // per-level mood tint so claims don't all look identical
  const hues = ['rgba(60,90,150,', 'rgba(96,72,150,', 'rgba(48,116,124,', 'rgba(120,84,58,', 'rgba(72,108,90,'];
  const h = hues[(mode === 'daily' ? 2 : levelVisualChapter()) % hues.length];
  x.save(); x.globalCompositeOperation = 'overlay'; x.fillStyle = h + '0.16)'; x.fillRect(0, 0, W, H); x.restore();
}

/* ================= decorative set-dressing (deterministic per level) ================= */
let decor = [];
function computeDecor(){
  decor = [];
  const rr = ART.rng(4242 + levelIndex * 131 + levelVisualChapter() * 503 + (mode === 'daily' ? 777 : 0));
  const isBlk = (c, r) => { const t = tileAt(c, r); return t === '#' || t === 'X' || t === 'B' || t === 'C'; };
  const occ = new Set();
  for (const g of golds) occ.add(g.c + ',' + g.r);
  for (const p of powerups) occ.add(p.c + ',' + p.r);
  let torches = 0, plants = 0, vines = 0, lastTorchC = -9;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
    if (!isBlk(c, r)) continue;
    const aboveAir = !isBlk(c, r - 1) && tileAt(c, r - 1) !== 'H' && tileAt(c, r - 1) !== 'E' && tileAt(c, r - 1) !== '-';
    if (aboveAir && plants < 11 && !occ.has(c + ',' + (r - 1)) && rr() < 0.22){ decor.push({type: 'plant', c, r, k: (rr() * 3) | 0, s: rr()}); plants++; }
    if (!isBlk(c, r + 1) && tileAt(c, r + 1) !== 'H' && vines < 7 && rr() < 0.13){ decor.push({type: 'vine', c, r, len: 14 + rr() * 22, s: rr()}); vines++; }
    // standing brazier on a platform END (top exposed + a side open), spaced out
    if (aboveAir && torches < 5 && c - lastTorchC >= 4 && !occ.has(c + ',' + (r - 1))){
      const endL = tileAt(c - 1, r) === '.', endR = tileAt(c + 1, r) === '.';
      if ((endL || endR) && rr() < 0.6){ decor.push({type: 'torch', c, r}); torches++; lastTorchC = c; }
    }
  }
}

function drawPlant(d){
  const bx = d.c * TILE, by = d.r * TILE + HUD_H;
  if (d.k === 0){ // grass tuft
    ctx.strokeStyle = '#5f9a40'; ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(bx + 18 + i * 3, by); ctx.quadraticCurveTo(bx + 18 + i * 3 + i, by - 9, bx + 18 + i * 4, by - 13); ctx.stroke(); }
  } else if (d.k === 1){ // mushroom
    ctx.fillStyle = '#caa05a'; ctx.fillRect(bx + 16, by - 5, 3, 5);
    ctx.fillStyle = '#d6533f'; ctx.beginPath(); ctx.ellipse(bx + 17, by - 6, 6, 4, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#ffd2b0'; ctx.fillRect(bx + 14, by - 7, 1, 1); ctx.fillRect(bx + 20, by - 6, 1, 1);
  } else { // flowering bush
    ctx.fillStyle = '#3f7a34'; ctx.beginPath(); ctx.ellipse(bx + 18, by - 4, 7, 4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(bx + 16, by - 6, 2, 2); ctx.fillStyle = '#ff7ba8'; ctx.fillRect(bx + 20, by - 5, 2, 2);
  }
}
function drawVine(d){
  const topx = d.c * TILE + 6 + d.s * 24, topy = (d.r + 1) * TILE + HUD_H;
  ctx.strokeStyle = '#3f6a2e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(topx, topy);
  for (let y = 0; y <= d.len; y += 6){ const sway = Math.sin(gameTime * 1.4 + y * 0.2 + d.c) * 2 * (y / d.len); ctx.lineTo(topx + sway, topy + y); }
  ctx.stroke();
  ctx.fillStyle = '#4f8a3a';
  for (let y = 9; y < d.len; y += 10){ const sway = Math.sin(gameTime * 1.4 + y * 0.2 + d.c) * 2 * (y / d.len); ctx.beginPath(); ctx.ellipse(topx + sway + 2, topy + y, 3, 2, 0.6, 0, 7); ctx.fill(); }
}
function drawTorch(d){
  const bx = d.c * TILE + 18, by = d.r * TILE + HUD_H;   // top-centre of the ledge cell
  // wooden post + iron cup
  ctx.fillStyle = '#3a2a16'; ctx.fillRect(bx - 2, by - 15, 4, 15);
  ctx.fillStyle = '#241a0e'; ctx.fillRect(bx - 2, by - 15, 1, 15);
  ctx.fillStyle = '#5a4326'; ctx.fillRect(bx - 4, by - 18, 8, 4);
  ctx.fillStyle = '#6e5430'; ctx.fillRect(bx - 4, by - 18, 8, 1);
  // flame (additive, flickering)
  const fx = bx, fy = by - 22, fl = 0.7 + 0.3 * Math.sin(gameTime * 14 + d.c * 3) + 0.1 * Math.sin(gameTime * 31 + d.c);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,120,30,.8)'; ctx.beginPath(); ctx.ellipse(fx, fy, 5 * fl, 10 * fl, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,205,70,.95)'; ctx.beginPath(); ctx.ellipse(fx, fy + 2, 3 * fl, 6.5 * fl, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,250,210,1)'; ctx.beginPath(); ctx.ellipse(fx, fy + 3, 1.5, 3.5 * fl, 0, 0, 7); ctx.fill();
  // rising embers
  for (let i = 0; i < 3; i++){
    const t = (clock * 0.7 + i * 0.37 + d.c * 0.11) % 1;
    const ey = fy - t * 30, ex = fx + Math.sin((t + i) * 9) * 4;
    ctx.globalAlpha = (1 - t) * 0.8; ctx.fillStyle = i % 2 ? '#ffd27a' : '#ff8a3a';
    ctx.fillRect(ex, ey, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
function drawDecor(){
  for (const d of decor){
    if (d.type === 'vine') drawVine(d);
    else if (d.type === 'plant') drawPlant(d);
    else if (d.type === 'torch') drawTorch(d);
  }
}
function topExitCell(){ let e = exitCells[0]; for (const c2 of exitCells) if (c2.r < e.r) e = c2; return e; }
function drawPortal(){
  if (!exitRevealed || !exitCells.length) return;
  const e = topExitCell(); const cx2 = e.c * TILE + 18, cy = e.r * TILE + HUD_H + 18;
  const a = 0.55 + 0.3 * Math.sin(gameTime * 4);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // bright core
  glow(e.c + .5, e.r + .5, 26, 'rgba(120,255,235,' + (a * .5) + ')', 1);
  // rotating swirl arcs
  ctx.strokeStyle = 'rgba(160,255,240,' + a + ')'; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++){ const r2 = 5 + i * 3.5, sp = gameTime * (2 + i * 0.6); ctx.beginPath(); ctx.arc(cx2, cy, r2, sp + i * 1.6, sp + i * 1.6 + 2.6); ctx.stroke(); }
  // orbiting sparks
  for (let i = 0; i < 5; i++){ const ang = gameTime * 2.4 + i * 1.257, r2 = 13 + Math.sin(gameTime * 3 + i) * 3; ctx.fillStyle = 'rgba(200,255,248,.9)'; ctx.fillRect(cx2 + Math.cos(ang) * r2 - 1, cy + Math.sin(ang) * r2 - 1, 2, 2); }
  ctx.restore();
}

/* one animation-state -> sprite pose */
function poseFor(a){
  if (a.digT > 0) return 'dig';
  switch (a.state){
    case 'run': return 'run';
    case 'climb': case 'climbout': return 'climb';
    case 'bar': return 'bar';
    case 'fall': return 'fall';
    case 'stun': return 'stun';
    case 'dead': return 'fall';
    default: return 'idle';
  }
}

const painterlyMiner = new Image();
let painterlyMinerReady = false;
painterlyMiner.onload = () => { painterlyMinerReady = true; if (booted) render(); };
painterlyMiner.src = 'assets/vibe-court-miner-sheet.png';
const painterlyMinerClimb = new Image();
let painterlyMinerClimbReady = false;
painterlyMinerClimb.onload = () => { painterlyMinerClimbReady = true; if (booted) render(); };
painterlyMinerClimb.src = 'assets/vibe-court-miner-climb-back.png';
const vibeMinerRun = new Image();
let vibeMinerRunReady = false;
vibeMinerRun.onload = () => { vibeMinerRunReady = true; if (booted) render(); };
vibeMinerRun.src = 'assets/vibe-court-miner-run-side-strip.png';
const vibeMinerDig = new Image();
let vibeMinerDigReady = false;
vibeMinerDig.onload = () => { vibeMinerDigReady = true; if (booted) render(); };
vibeMinerDig.src = 'assets/vibe-court-miner-dig-side-strip.png';
const vibeMinerClimbHang = new Image();
let vibeMinerClimbHangReady = false;
vibeMinerClimbHang.onload = () => { vibeMinerClimbHangReady = true; if (booted) render(); };
vibeMinerClimbHang.src = 'assets/vibe-court-miner-climb-hang-strip.png';
const MINER_SHEET = {
  cols: 4, rows: 2,
  cells: {
    idle: 0, run0: 1, run1: 2, climb: 3,
    digLeft: 4, digRight: 5, carry: 6, stun: 7,
  },
};
const VIBE_MINER_RUN = { cols: 4 };
const VIBE_MINER_DIG = { cols: 4 };
const VIBE_MINER_CLIMB_HANG = { cols: 4, climbStart: 0, hangStart: 2 };
const enemySpriteSrcs = {
  guard: 'assets/enemy-guard-gpt-v1.png',
  scout: 'assets/enemy-scout-gpt-v1.png',
  mason: 'assets/enemy-mason-gpt-v1.png',
};
const enemySprites = {};
for (const [kind, src] of Object.entries(enemySpriteSrcs)){
  const img = new Image();
  img.onload = () => { img.ready = true; if (booted) render(); };
  img.src = src;
  enemySprites[kind] = img;
}
const ENEMY_ANIM_SHEET = {
  src: 'assets/enemy-animation-sheet-gpt-v4.png',
  cols: 8,
  rows: 3,
  row: {guard: 0, scout: 1, mason: 2},
};
const enemyAnimSheet = new Image();
let enemyAnimSheetReady = false;
enemyAnimSheet.onload = () => { enemyAnimSheetReady = true; if (booted) render(); };
enemyAnimSheet.src = ENEMY_ANIM_SHEET.src;
function minerFrameIndex(a, pose, fi){
  if (pose === 'dig') return a.dir < 0 ? MINER_SHEET.cells.digLeft : MINER_SHEET.cells.digRight;
  if (a.gold) return MINER_SHEET.cells.carry;
  if (pose === 'run') return fi % 2 ? MINER_SHEET.cells.run1 : MINER_SHEET.cells.run0;
  if (pose === 'climb') return MINER_SHEET.cells.idle;
  if (pose === 'fall' || pose === 'stun') return MINER_SHEET.cells.stun;
  return MINER_SHEET.cells.idle;
}
function drawGeneratedMinerBar(a, fi, cx2, footY){
  const h = 74, w = 48;
  const top = footY - h;
  const swing = Math.sin(a.anim * 12);
  const reach = Math.floor(a.anim * 8) & 1;
  const faceDir = a.dir || 1;
  const handY = top + 8;
  const shoulderY = top + 26;
  const hipY = top + 49;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.translate(cx2, 0);
  if (faceDir < 0) ctx.scale(-1, 1);

  // small contact shadows on the brass bar so the grip reads clearly
  ctx.strokeStyle = 'rgba(16,10,6,.55)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-15, handY - 1);
  ctx.lineTo(-6, handY - 1);
  ctx.moveTo(6, handY - 1);
  ctx.lineTo(15, handY - 1);
  ctx.stroke();

  // arms: overhead, hand-over-hand instead of a walking silhouette
  ctx.strokeStyle = '#12302c';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-8, shoulderY);
  ctx.quadraticCurveTo(-15 - reach * 2, top + 18, -14, handY);
  ctx.moveTo(8, shoulderY);
  ctx.quadraticCurveTo(15 + reach * 2, top + 18, 14, handY);
  ctx.stroke();
  ctx.strokeStyle = '#46b3a8';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-8, shoulderY);
  ctx.quadraticCurveTo(-15 - reach * 2, top + 18, -14, handY);
  ctx.moveTo(8, shoulderY);
  ctx.quadraticCurveTo(15 + reach * 2, top + 18, 14, handY);
  ctx.stroke();
  ctx.fillStyle = '#e8b07a';
  ctx.beginPath();
  ctx.ellipse(-14, handY - 1, 5.5, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(14, handY - 1, 5.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // torso and head hang below the bar with a little body swing
  ctx.translate(swing * 1.5, 0);
  const bodyGrad = ctx.createLinearGradient(0, shoulderY, 0, hipY);
  bodyGrad.addColorStop(0, '#46b3a8');
  bodyGrad.addColorStop(1, '#1d5f59');
  ctx.fillStyle = '#0b0712';
  roundRect(-15, shoulderY - 2, 30, 29, 10);
  ctx.fill();
  ctx.fillStyle = bodyGrad;
  roundRect(-13, shoulderY, 26, 25, 9);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(-8, shoulderY + 3, 16, 2);
  ctx.fillStyle = '#13302c';
  ctx.fillRect(0, shoulderY + 5, 2, 18);

  ctx.fillStyle = '#e8b07a';
  roundRect(-10, top + 17, 20, 15, 7);
  ctx.fill();
  ctx.fillStyle = 'rgba(80,40,18,.55)';
  ctx.fillRect(-9, top + 18, 18, 3);
  ctx.fillStyle = '#ffb02e';
  roundRect(-14, top + 9, 28, 8, 5);
  ctx.fill();
  ctx.fillStyle = '#ffd676';
  ctx.fillRect(-12, top + 10, 24, 2);
  ctx.fillStyle = '#ffb02e';
  ctx.fillRect(-18, top + 16, 36, 3);
  ctx.fillStyle = '#10202a';
  ctx.fillRect(2, top + 24, 3, 3);
  ctx.fillStyle = '#5b351b';
  ctx.fillRect(-7, top + 28, 15, 3);

  // dangling legs, slightly bicycling as he moves along the pipe
  const l1 = swing * 4;
  const l2 = -swing * 4;
  ctx.strokeStyle = '#26405a';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-7, hipY);
  ctx.quadraticCurveTo(-10 + l1, hipY + 12, -8 + l1, footY - 9);
  ctx.moveTo(7, hipY);
  ctx.quadraticCurveTo(11 + l2, hipY + 12, 9 + l2, footY - 9);
  ctx.stroke();
  ctx.strokeStyle = '#161f2e';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-8 + l1, footY - 9);
  ctx.lineTo(-16 + l1, footY - 6);
  ctx.moveTo(9 + l2, footY - 9);
  ctx.lineTo(17 + l2, footY - 6);
  ctx.stroke();

  ctx.restore();
  return {w, h};
}
function drawGeneratedMiner(a, pose, fi, cx2, footY){
  if ((pose === 'climb' || pose === 'bar') && vibeMinerClimbHangReady && vibeMinerClimbHang.naturalWidth){
    const cellW = vibeMinerClimbHang.naturalWidth / VIBE_MINER_CLIMB_HANG.cols;
    const cellH = vibeMinerClimbHang.naturalHeight;
    const start = pose === 'bar' ? VIBE_MINER_CLIMB_HANG.hangStart : VIBE_MINER_CLIMB_HANG.climbStart;
    const idx = start + (fi % 2);
    const sx = idx * cellW;
    const h = pose === 'bar' ? 76 : 80;
    const w = h * (cellW / cellH);
    const bob = pose === 'climb' ? Math.sin(a.anim * 16) * 2 : Math.sin(a.anim * 10) * 1.5;
    ctx.translate(cx2 + (pose === 'climb' ? ((fi % 2) ? 1.2 : -1.2) : 0), footY - h + bob);
    if (pose === 'bar' && a.dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(vibeMinerClimbHang, sx, 0, cellW, cellH, -w * 0.5, 0, w, h);
    return {w, h};
  }
  if (pose === 'bar') return drawGeneratedMinerBar(a, fi, cx2, footY);
  if (pose === 'dig' && vibeMinerDigReady && vibeMinerDig.naturalWidth){
    const cellW = vibeMinerDig.naturalWidth / VIBE_MINER_DIG.cols;
    const cellH = vibeMinerDig.naturalHeight;
    const total = Math.max(0.01, a.pendingDig?.total || DIG_TIME);
    const progress = clamp(1 - a.digT / total, 0, 0.999);
    const idx = Math.floor(progress * VIBE_MINER_DIG.cols);
    const sx = idx * cellW;
    const h = 76;
    const w = h * (cellW / cellH);
    const dir = a.pendingDig?.dir || a.dir || 1;
    ctx.translate(cx2, footY - h + 2);
    if (dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(vibeMinerDig, sx, 0, cellW, cellH, -w * 0.5, 0, w, h);
    return {w, h};
  }
  if (pose === 'run' && vibeMinerRunReady && vibeMinerRun.naturalWidth){
    const cellW = vibeMinerRun.naturalWidth / VIBE_MINER_RUN.cols;
    const cellH = vibeMinerRun.naturalHeight;
    const sx = (fi % VIBE_MINER_RUN.cols) * cellW;
    const h = 70;
    const w = h * (cellW / cellH);
    ctx.translate(cx2, footY - h + 2);
    if (a.dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(vibeMinerRun, sx, 0, cellW, cellH, -w * 0.5, 0, w, h);
    return {w, h};
  }
  const cellW = painterlyMiner.naturalWidth / MINER_SHEET.cols;
  const cellH = painterlyMiner.naturalHeight / MINER_SHEET.rows;
  const idx = minerFrameIndex(a, pose, fi);
  const sx = (idx % MINER_SHEET.cols) * cellW;
  const sy = Math.floor(idx / MINER_SHEET.cols) * cellH;
  const h = pose === 'climb' ? 78 : 74;
  const w = h * (cellW / cellH);
  const climbPhase = pose === 'climb' ? Math.floor(a.anim * 8) & 1 : 0;
  const climbBob = pose === 'climb' ? Math.sin(a.anim * 16) * 3 : 0;
  const climbLean = pose === 'climb' ? (climbPhase ? .035 : -.035) : 0;
  ctx.translate(cx2 + (pose === 'climb' ? (climbPhase ? 1.5 : -1.5) : 0), footY - h + climbBob);
  if (pose === 'climb') ctx.rotate(climbLean);
  if (a.dir < 0) ctx.scale(-1, 1);
  if (pose === 'climb' && painterlyMinerClimbReady && painterlyMinerClimb.naturalWidth)
    ctx.drawImage(painterlyMinerClimb, -w * 0.5, 0, w, h);
  else
    ctx.drawImage(painterlyMiner, sx, sy, cellW, cellH, -w * 0.5, 0, w, h);
  return {w, h};
}
function drawDigStroke(a, cx2, footY){
  if (!a.pendingDig || a.digT <= 0) return;
  const total = Math.max(0.01, a.pendingDig.total || DIG_TIME);
  const p = clamp(1 - a.digT / total, 0, 1);
  const dir = a.pendingDig.dir || a.dir || 1;
  const tx = px(a.pendingDig.c + 0.5), ty = py(a.pendingDig.r + 0.32);
  const ease = p < 0.82
    ? 0.5 - Math.cos((p / 0.82) * Math.PI) * 0.5
    : 1 - (1 - p) * 0.16;
  const backswing = -2.05, impact = 0.78;
  const baseAngle = backswing + (impact - backswing) * ease;
  const angle = dir > 0 ? baseAngle : Math.PI - baseAngle;
  const pivotX = cx2 + dir * 7;
  const pivotY = footY - 41 + Math.sin(p * Math.PI) * 3;
  const len = 49;
  const tailLen = 13;
  const headX = pivotX + Math.cos(angle) * len;
  const headY = pivotY + Math.sin(angle) * len;
  const tailX = pivotX - Math.cos(angle) * tailLen;
  const tailY = pivotY - Math.sin(angle) * tailLen;
  const gripX = pivotX + Math.cos(angle) * 13;
  const gripY = pivotY + Math.sin(angle) * 13;
  const impactA = clamp((p - 0.72) / 0.28, 0, 1);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = 'rgba(18,12,8,.82)';
  ctx.lineWidth = 7.2;
  ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY); ctx.stroke();
  ctx.strokeStyle = '#c98b43';
  ctx.lineWidth = 4.2;
  ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(headX, headY); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,226,150,.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(gripX, gripY); ctx.lineTo(headX - Math.cos(angle) * 11, headY - Math.sin(angle) * 11); ctx.stroke();

  ctx.fillStyle = 'rgba(20,12,8,.82)';
  ctx.beginPath(); ctx.arc(pivotX - dir * 2, pivotY + 1, 4.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f0c46f';
  ctx.beginPath(); ctx.arc(gripX, gripY, 3.8, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(angle + Math.PI * 0.5);
  ctx.strokeStyle = 'rgba(18,22,24,.75)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-17, 1);
  ctx.quadraticCurveTo(-8, -8, 1, -1);
  ctx.quadraticCurveTo(10, 8, 18, 0);
  ctx.stroke();
  ctx.strokeStyle = '#dbe2df';
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(-17, 1);
  ctx.quadraticCurveTo(-8, -8, 1, -1);
  ctx.quadraticCurveTo(10, 8, 18, 0);
  ctx.stroke();
  ctx.fillStyle = '#f8fff3';
  ctx.fillRect(-3, -4, 6, 8);
  ctx.restore();

  if (impactA > 0){
    ctx.globalAlpha = impactA;
    ctx.strokeStyle = '#ffe09a';
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(tx - 10 * dir, ty + 6);
    ctx.lineTo(tx - 2 * dir, ty + 1);
    ctx.lineTo(tx + 7 * dir, ty + 8);
    ctx.stroke();
    ctx.fillStyle = '#fff3b0';
    for (let i = 0; i < 4; i++){
      const sx = tx + dir * (2 + i * 4) + Math.sin(gameTime * 15 + i) * 2;
      const sy = ty + 2 + i % 2 * 4;
      ctx.fillRect(sx, sy, 2, 2);
    }
  }
  ctx.restore();
}
function actorBodyMotion(a, pose){
  if (a.kind !== 'player') return {rot: 0, sx: 1, sy: 1, ox: 0, oy: 0};
  if (a.state === 'dead'){
    const p = clamp(a.deadT / 0.9, 0, 1);
    return {
      rot: (a.dir || 1) * (0.38 + p * 0.9),
      sx: 1 + Math.sin(p * Math.PI) * 0.08,
      sy: 1 - Math.sin(p * Math.PI) * 0.05,
      ox: (a.dir || 1) * p * 7,
      oy: -Math.sin(p * Math.PI) * 9 + p * 12,
    };
  }
  if (pose === 'dig'){
    const total = Math.max(0.01, a.pendingDig && a.pendingDig.total || DIG_TIME);
    const p = clamp(1 - a.digT / total, 0, 1);
    const brace = Math.sin(p * Math.PI);
    return {rot: (a.dir || 1) * (-0.11 - brace * 0.07), sx: 1 + brace * 0.08, sy: 1 - brace * 0.06, ox: -(a.dir || 1) * (2 + brace * 4), oy: brace * 2};
  }
  if (pose === 'run'){
    const bob = Math.sin(a.anim * 18);
    return {rot: (a.dir || 1) * 0.055, sx: 1, sy: 1, ox: 0, oy: bob > 0 ? -1.5 : 0};
  }
  if (pose === 'bar') return {rot: Math.sin(a.anim * 10) * 0.025, sx: 1, sy: 1, ox: Math.sin(a.anim * 12) * 1.2, oy: 0};
  if (pose === 'climb') return {rot: Math.sin(a.anim * 8) * 0.035, sx: 1, sy: 1, ox: Math.sin(a.anim * 8) * 1.5, oy: 0};
  if (pose === 'fall') return {rot: (a.dir || 1) * 0.12, sx: 0.98, sy: 1.03, ox: 0, oy: 0};
  if (a.gold) return {rot: Math.sin(a.anim * 5) * 0.035, sx: 1.03, sy: .98, ox: 0, oy: 1};
  return {rot: 0, sx: 1, sy: 1, ox: 0, oy: 0};
}
function drawGuardAccents(a, cx2, footY, h, w){
  const meta = guardMeta(a);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'source-over';

  if (a.kind === 'scout'){
    ctx.fillStyle = meta.color;
    ctx.beginPath();
    ctx.moveTo(cx2 - 10, footY - h * .8);
    ctx.lineTo(cx2 + 10, footY - h * .8);
    ctx.lineTo(cx2 + 17, footY - h * .7);
    ctx.lineTo(cx2 - 17, footY - h * .7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d7fffb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx2 - 18, footY - h * .66);
    ctx.lineTo(cx2 - 6, footY - h * .66);
    ctx.moveTo(cx2 + 6, footY - h * .66);
    ctx.lineTo(cx2 + 18, footY - h * .66);
    ctx.stroke();
  } else if (a.kind === 'mason'){
    ctx.fillStyle = '#b89a62';
    ctx.fillRect(cx2 - 21, footY - h * .64, 12, 8);
    ctx.fillRect(cx2 + 9, footY - h * .64, 12, 8);
    ctx.fillStyle = '#d8c08a';
    ctx.fillRect(cx2 + 12, footY - h * .44, 9, 4);
    ctx.fillRect(cx2 + 18, footY - h * .44, 4, 15);
  } else {
    ctx.strokeStyle = '#ff8fa0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx2 - 14, footY - h * .78);
    ctx.lineTo(cx2 + 14, footY - h * .78);
    ctx.stroke();
    ctx.fillStyle = meta.color;
    ctx.beginPath();
    ctx.moveTo(cx2, footY - h * .9);
    ctx.lineTo(cx2 - 7, footY - h * .79);
    ctx.lineTo(cx2 + 7, footY - h * .79);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
function generatedEnemyImage(kind){
  const img = enemySprites[kind];
  return img && img.ready && img.naturalWidth && img.naturalHeight ? img : null;
}
function generatedEnemyFrame(a, pose, fi){
  const row = ENEMY_ANIM_SHEET.row[a.kind];
  if (enemyAnimSheetReady && Number.isFinite(row)){
    const col = pose === 'run'
      ? fi % 4
      : (pose === 'climb' ? 4 + (fi % 2) : (pose === 'bar' ? 6 + (fi % 2) : -1));
    if (col >= 0){
      const sw = enemyAnimSheet.naturalWidth / ENEMY_ANIM_SHEET.cols;
      const sh = enemyAnimSheet.naturalHeight / ENEMY_ANIM_SHEET.rows;
      return {
        img: enemyAnimSheet,
        sx: col * sw,
        sy: row * sh,
        sw,
        sh,
        sheet: true
      };
    }
  }
  const img = generatedEnemyImage(a.kind);
  return img ? {img, sx: 0, sy: 0, sw: img.naturalWidth, sh: img.naturalHeight, sheet: false} : null;
}
function generatedEnemyHeight(a, pose){
  if (pose === 'bar') return a.kind === 'mason' ? 64 : 60;
  if (a.kind === 'scout') return 66;
  if (a.kind === 'mason') return 74;
  return 70;
}
function generatedEnemyMotion(a, pose, sheetFrame){
  const t = a.anim || gameTime;
  const dir = a.dir || 1;
  if (sheetFrame && (pose === 'run' || pose === 'climb' || pose === 'bar'))
    return {rot: 0, sx: 1, sy: 1, ox: 0, oy: 0};
  if (pose === 'run'){
    const step = Math.sin(t * 10);
    const stride = Math.sin(t * 5);
    const force = Math.abs(step);
    return {
      rot: dir * (0.018 + stride * 0.008),
      sx: 1 + force * 0.012,
      sy: 1 - force * 0.01,
      ox: dir * stride * 0.45,
      oy: Math.max(0, step) * -1.0
    };
  }
  if (pose === 'climb'){
    return {
      rot: Math.sin(t * 5) * 0.01,
      sx: 1,
      sy: 1,
      ox: Math.sin(t * 6) * 0.35,
      oy: Math.sin(t * 7) * 0.45
    };
  }
  if (pose === 'bar'){
    return {
      rot: Math.sin(t * 3) * 0.006,
      sx: 1,
      sy: 1,
      ox: Math.sin(t * 4) * 0.2,
      oy: 0
    };
  }
  if (pose === 'fall') return {rot: dir * 0.08, sx: 0.98, sy: 1.03, ox: 0, oy: 1};
  if (pose === 'stun') return {rot: Math.sin(t * 8) * 0.018, sx: 1.02, sy: 0.98, ox: 0, oy: 1};
  const breathe = 0.01 + Math.sin(t * 3) * 0.006;
  return {rot: 0, sx: 1 + breathe, sy: 1 - breathe, ox: 0, oy: 0};
}
function drawGeneratedEnemy(a, sprite, cx2, footY, h, w, pose){
  const motion = generatedEnemyMotion(a, pose, sprite.sheet);
  ctx.save();
  ctx.translate(cx2 + motion.ox, footY + motion.oy);
  if (a.dir < 0) ctx.scale(-1, 1);
  ctx.rotate(motion.rot);
  ctx.scale(motion.sx, motion.sy);
  ctx.drawImage(sprite.img, sprite.sx, sprite.sy, sprite.sw, sprite.sh, -w * .5, -h, w, h);
  ctx.restore();
}
function drawActor(a){
  const set = ART.frames[a.kind] || ART.frames.guard;
  const pose = poseFor(a);
  const frames = set[pose] || set.idle;
  const rate = pose === 'run' ? 14 : (pose === 'climb' ? 9 : (pose === 'bar' ? 8 : 4));
  const fi = a.moved || pose === 'idle' || pose === 'fall' || pose === 'stun'
    ? Math.floor(a.anim * rate) % frames.length : 0;
  const enemyFi = a.moved || pose === 'idle' || pose === 'fall' || pose === 'stun'
    ? Math.floor(a.anim * (pose === 'run' ? 8 : (pose === 'climb' ? 5 : 4))) : 0;
  const img = frames[fi] || frames[0];
  const generatedPlayer = a.kind === 'player' && painterlyMinerReady && painterlyMiner.naturalWidth;
  const generatedRunPlayer = generatedPlayer && pose === 'run' && vibeMinerRunReady && vibeMinerRun.naturalWidth;
  const generatedDigPlayer = generatedPlayer && pose === 'dig' && vibeMinerDigReady && vibeMinerDig.naturalWidth;
  const generatedClimbHangPlayer = generatedPlayer && (pose === 'climb' || pose === 'bar') &&
    vibeMinerClimbHangReady && vibeMinerClimbHang.naturalWidth;
  const generatedEnemy = a.kind !== 'player' ? generatedEnemyFrame(a, pose, enemyFi) : null;
  const generatedRatio = generatedRunPlayer
    ? ((vibeMinerRun.naturalWidth / VIBE_MINER_RUN.cols) / vibeMinerRun.naturalHeight)
    : (generatedDigPlayer
      ? ((vibeMinerDig.naturalWidth / VIBE_MINER_DIG.cols) / vibeMinerDig.naturalHeight)
      : (generatedClimbHangPlayer
        ? ((vibeMinerClimbHang.naturalWidth / VIBE_MINER_CLIMB_HANG.cols) / vibeMinerClimbHang.naturalHeight)
        : ((painterlyMiner.naturalWidth / MINER_SHEET.cols) / (painterlyMiner.naturalHeight / MINER_SHEET.rows))));
  const enemyRatio = generatedEnemy ? generatedEnemy.sw / generatedEnemy.sh : 1;
  const h = generatedPlayer
    ? (generatedClimbHangPlayer ? (pose === 'bar' ? 76 : 80) : (generatedRunPlayer ? 70 : (generatedDigPlayer ? 76 : 74)))
    : generatedEnemy ? generatedEnemyHeight(a, pose)
    : (a.kind === 'player' ? 64 : 58);
  const w = generatedPlayer ? h * generatedRatio : generatedEnemy ? h * enemyRatio : h * ART.FW / ART.FH;
  const cx2 = px(a.x);
  let footY = py(a.y) + TILE * 0.5;
  if (pose === 'bar') footY = py(Math.floor(a.y)) + 72;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const aura = ctx.createRadialGradient(cx2, footY - h * .46, 0, cx2, footY - h * .46, h * .58);
  aura.addColorStop(0, a.kind === 'player' ? 'rgba(255,205,125,.2)' : 'rgba(255,70,80,.16)');
  aura.addColorStop(.5, a.kind === 'player' ? 'rgba(255,170,80,.1)' : 'rgba(255,70,80,.08)');
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(cx2, footY - h * .46, w * .62, h * .58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = .34;
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.beginPath();
  ctx.ellipse(cx2, footY - 2, w * .42, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = true;            // smooth the hi-res sprite downscale (less blocky)
  ctx.filter = painterlyPlateReady ? 'saturate(1.12) contrast(1.03)' : 'none';
  if (a.kind === 'player' && a.cloakT > 0) ctx.globalAlpha = 0.45 + 0.2 * Math.sin(gameTime * 12);
  if (a.state === 'dead'){ ctx.globalAlpha = Math.max(0, 1 - a.deadT); footY -= a.deadT * 10; }
  if (a.state === 'stun'){ ctx.globalAlpha = a.kind === 'player' ? 0.6 + 0.2 * Math.sin(gameTime * 16) : 0.74; }
  if (a.invuln > 0 && Math.floor(gameTime * 16) % 2) ctx.globalAlpha *= 0.4;
  // landing squash-and-stretch (juice)
  if (a.squashT > 0){ const s = a.squashT / 0.15; ctx.translate(cx2, footY); ctx.scale(1 + 0.18 * s, 1 - 0.22 * s); ctx.translate(-cx2, -footY); }
  const motion = actorBodyMotion(a, pose);
  if (motion.rot || motion.sx !== 1 || motion.sy !== 1 || motion.ox || motion.oy){
    ctx.translate(cx2 + motion.ox, footY + motion.oy);
    ctx.rotate(motion.rot);
    ctx.scale(motion.sx, motion.sy);
    ctx.translate(-cx2, -footY);
  }
  if (generatedPlayer) drawGeneratedMiner(a, pose, fi, cx2, footY);
  else if (generatedEnemy) drawGeneratedEnemy(a, generatedEnemy, cx2, footY, h, w, pose);
  else {
    ctx.translate(cx2, footY - h);
    if (a.dir < 0){ ctx.translate(w, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, 0, 0, w, h);
  }
  ctx.restore();
  if (a.kind === 'player' && !(generatedPlayer && pose === 'dig' && vibeMinerDigReady && vibeMinerDig.naturalWidth)) drawDigStroke(a, cx2, footY);
  if (a.kind !== 'player' && a.state !== 'dead'){
    const meta = guardMeta(a);
    if (!generatedEnemy) drawGuardAccents(a, cx2, footY, h, w);
    if (a.alertT > 0){
      const p = a.alertT / 0.9;
      const ay = footY - h - 12 - (1 - p) * 7;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = Math.min(1, p * 1.8);
      ctx.strokeStyle = 'rgba(8,5,14,.88)';
      ctx.lineWidth = 4;
      ctx.font = '900 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('!', cx2, ay);
      ctx.fillStyle = meta.color;
      ctx.fillText('!', cx2, ay);
      ctx.globalAlpha = Math.min(.7, p);
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx2 - 9, ay - 7); ctx.lineTo(cx2 - 15, ay - 13);
      ctx.moveTo(cx2 + 9, ay - 7); ctx.lineTo(cx2 + 15, ay - 13);
      ctx.stroke();
      ctx.restore();
    }
  }
  // carried gold — show which guard pocketed your nugget
  if (a.gold){
    drawGoldGem(cx2, footY - h * 0.62, 8.5, gameTime + a.x);
  }
}

/* additive radial glow — cached per color sprite, scaled on draw (cheaper than per-call gradients) */
const glowCache = {};
const glowCacheKeys = [];
const MAX_GLOW_CACHE = 96;
function glowCacheKey(color){
  const m = /^rgba\((.*),\s*([0-9.]+)\)$/.exec(color);
  if (!m) return color;
  const a = Math.max(0, Math.min(1, parseFloat(m[2])));
  return 'rgba(' + m[1] + ',' + (Math.round(a * 20) / 20).toFixed(2) + ')';
}
function glowSprite(color){
  const key = glowCacheKey(color);
  if (glowCache[key]) return glowCache[key];
  const S = 64, c = ART.cv(S, S), x = ART.cx(c);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, key); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  glowCache[key] = c;
  glowCacheKeys.push(key);
  while (glowCacheKeys.length > MAX_GLOW_CACHE) delete glowCache[glowCacheKeys.shift()];
  return c;
}
function glow(wx, wy, radius, color, alpha){
  const x = px(wx), y = py(wy);
  ctx.globalAlpha = alpha;
  ctx.drawImage(glowSprite(color), x - radius, y - radius, radius * 2, radius * 2);
  ctx.globalAlpha = 1;
}

function renderTitle(){
  if (!bg) buildBackdrop();
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.drawImage(bg, 0, 0);
  // drifting embers
  for (let i = 0; i < 26; i++){
    const ex = (i * 211 + clock * (10 + i % 6 * 4)) % VIEW_W;
    const ey = VIEW_H - ((i * 97 + clock * (18 + i % 5 * 7)) % (VIEW_H + 80)) + 40;
    const a = 0.25 + 0.25 * Math.sin(clock * 2 + i);
    ctx.globalCompositeOperation = 'lighter';
    glow(ex / TILE, (ey - HUD_H) / TILE, 8, 'rgba(255,150,60,' + a + ')', 1);
    ctx.globalCompositeOperation = 'source-over';
  }
  // flickering torches flanking the lower ledge
  for (const txc of [2.4, COLS - 2.4]){
    const fl = 0.7 + 0.3 * Math.sin(clock * 13 + txc);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glow(txc, ROWS - 2.0, 70 * fl, 'rgba(255,150,50,.5)', 1); ctx.restore();
    const bx = txc * TILE, by = (ROWS - 1) * TILE + HUD_H;
    ctx.fillStyle = '#3a2a16'; ctx.fillRect(bx - 2, by - 22, 4, 22);
    ctx.fillStyle = '#5a4326'; ctx.fillRect(bx - 4, by - 25, 8, 4);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,120,30,.85)'; ctx.beginPath(); ctx.ellipse(bx, by - 30, 5 * fl, 10 * fl, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,210,1)'; ctx.beginPath(); ctx.ellipse(bx, by - 28, 1.6, 4 * fl, 0, 0, 7); ctx.fill();
    ctx.restore();
  }
  // a prospector pacing the lower ledge
  const span = VIEW_W - 4 * TILE;
  const phase = (clock * 0.18) % 2;
  const tx = (phase < 1 ? phase : 2 - phase);
  const rx = (2 * TILE + tx * span) / TILE;
  titleRunner = titleRunner || makeActor(2, ROWS - 2, 'player');
  titleRunner.x = rx; titleRunner.y = ROWS - 1.5;
  titleRunner.state = 'run'; titleRunner.moved = true; titleRunner.anim = clock;
  titleRunner.dir = phase < 1 ? 1 : -1;
  // warm lantern pool under the runner
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glow(rx, ROWS - 1.6, 100, 'rgba(255,205,130,.45)', 1);
  glow(rx, ROWS - 1.7, 40, 'rgba(255,235,180,.4)', 1);
  ctx.restore();
  drawActor(titleRunner);
  // a few sparkles of gold scattered
  for (let i = 0; i < 5; i++){
    const gx = (3 + i * 5.3) , gy = ROWS - 1.5;
    ctx.globalCompositeOperation = 'lighter';
    glow(gx, gy, 16, 'rgba(255,200,60,' + (0.3 + 0.2 * Math.sin(clock * 3 + i * 2)) + ')', 1);
    ctx.globalCompositeOperation = 'source-over';
  }
  // vignette
  const vg = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * .3, VIEW_W / 2, VIEW_H / 2, VIEW_H * .8);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

// does this cell render as a solid block?
function rendersSolid(c, r){
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return !isBlasted(c, r);
  if (t === 'C') return !isCrumbleGone(c, r) && !isBlasted(c, r);
  if (t === 'T') return true;
  return t === 'X' && !(isBottomDiggable(c, r) && (isDug(c, r) || isBlasted(c, r)));
}
function coveredAbove(c, r){ return rendersSolid(c, r - 1); }

// cached soft contact-shadow strip drawn into the air cell beneath a platform (grounds ledges)
let underShadowImg = null;
function underShadow(){
  if (underShadowImg) return underShadowImg;
  const h = 22, c = ART.cv(TILE, h), x = ART.cx(c);
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, TILE, h);
  underShadowImg = c; return c;
}
// subtle deterministic per-cell shade so tiled stone doesn't read as flat repetition
function tileVary(c, r){
  const x = c * TILE, y = r * TILE + HUD_H;
  const v = (c * 13 + r * 7) % 5;
  if (v === 0){ ctx.fillStyle = 'rgba(255,248,230,.05)'; ctx.fillRect(x, y, TILE, TILE); }
  else if (v === 1 || v === 2){ ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(x, y, TILE, TILE); }

  // Paint over the obvious grid stamp with asymmetric bevels, chips, and moss.
  const n = (c * 928371 + r * 689287 + levelIndex * 971) >>> 0;
  ctx.save();
  ctx.lineCap = 'round';
  if ((n & 3) === 0){
    ctx.strokeStyle = 'rgba(255,221,142,.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 4 + (n % 7));
    ctx.quadraticCurveTo(x + 15, y + 1, x + 31, y + 5 + ((n >> 3) % 5));
    ctx.stroke();
  }
  if ((n & 7) === 5){
    ctx.strokeStyle = 'rgba(20,12,8,.42)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 7 + ((n >> 4) % 8), y + 10);
    ctx.lineTo(x + 15 + ((n >> 7) % 5), y + 19);
    ctx.lineTo(x + 11 + ((n >> 10) % 12), y + 30);
    ctx.stroke();
  }
  if (!rendersSolid(c, r - 1)){
    const moss = ((n >> 5) % 10);
    ctx.fillStyle = 'rgba(134,185,82,.55)';
    ctx.fillRect(x, y, TILE, 2);
    for (let i = 0; i < 4; i++){
      const mx = x + ((n >> (i * 4)) % 32);
      const len = 3 + ((n >> (i * 5 + 2)) % 7);
      ctx.fillStyle = i % 2 ? 'rgba(83,137,55,.65)' : 'rgba(154,214,93,.58)';
      ctx.fillRect(mx, y + 2, 2, len + (moss > 6 ? 3 : 0));
    }
  }
  if ((n & 15) === 9){
    ctx.fillStyle = 'rgba(255,238,170,.45)';
    ctx.fillRect(x + 8 + ((n >> 6) % 18), y + 8 + ((n >> 11) % 14), 2, 2);
  }
  ctx.restore();
}

function painterlyTileWash(c, r, kind){
  if (!painterlyPlateReady || !painterlyPlate.naturalWidth) return;
  const x = c * TILE, y = r * TILE + HUD_H;
  const nw = painterlyPlate.naturalWidth, nh = painterlyPlate.naturalHeight;
  const seed = (c * 110351 + r * 91753 + levelIndex * 211 + (kind === 'wall' ? 503 : 0)) >>> 0;
  const sw = Math.min(180, nw), sh = Math.min(180, nh);
  const sx = (seed % Math.max(1, nw - sw));
  const sy = (((seed >>> 8) + (kind === 'wall' ? nh * 0.38 : nh * 0.58)) % Math.max(1, nh - sh));
  ctx.save();
  ctx.beginPath();
  const radius = !rendersSolid(c, r - 1) ? 6 : 2;
  if (ctx.roundRect) ctx.roundRect(x + 1, y + 1, TILE - 2, TILE - 2, radius);
  else ctx.rect(x + 1, y + 1, TILE - 2, TILE - 2);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = kind === 'wall' ? .52 : .6;
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(painterlyPlate, sx, sy, sw, sh, x - 3, y - 3, TILE + 6, TILE + 6);
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = .38;
  ctx.fillStyle = kind === 'wall' ? '#5f7ea0' : '#d39a56';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.restore();

  if (!rendersSolid(c, r - 1)){
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y, 0, y + 12);
    g.addColorStop(0, kind === 'wall' ? 'rgba(160,220,210,.22)' : 'rgba(255,210,120,.24)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x + 1, y, TILE - 2, 13);
    ctx.restore();
  }
}

function drawPainterlySolid(base, c, r, kind){
  ctx.save();
  ctx.globalAlpha = painterlyPlateReady ? .82 : 1;
  drawTile(base, c, r);
  ctx.restore();
  painterlyTileWash(c, r, kind);
  tileVary(c, r);
}

function platformKindAt(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null;
  const t = tileAt(c, r);
  if (t === '#') return !isBlasted(c, r) ? 'earth' : null;
  if (t === 'X') return 'wall';
  return null;
}

function runHasOpenTop(c0, c1, r){
  for (let c = c0; c <= c1; c++) if (!platformKindAt(c, r - 1)) return true;
  return false;
}

function drawOrganicPlatformRun(c0, c1, r, kind){
  const x0 = c0 * TILE, y0 = r * TILE + HUD_H, w = (c1 - c0 + 1) * TILE, h = TILE;
  const openTop = runHasOpenTop(c0, c1, r);
  const seed = (c0 * 73856093 ^ c1 * 19349663 ^ r * 83492791 ^ levelIndex * 2654435761) >>> 0;
  const wob = (i) => (((seed >>> ((i % 6) * 5)) & 7) - 3);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0 + (openTop ? 7 + wob(0) : 1));
  const steps = Math.max(2, Math.ceil(w / 34));
  for (let i = 1; i <= steps; i++){
    const px0 = x0 + (w * i) / steps;
    const py0 = y0 + (openTop ? 4 + wob(i) : 1);
    const cx0 = x0 + (w * (i - .5)) / steps;
    ctx.quadraticCurveTo(cx0, y0 + (openTop ? wob(i + 2) : 1), px0, py0);
  }
  ctx.lineTo(x0 + w, y0 + h + 2);
  ctx.lineTo(x0, y0 + h + 2);
  ctx.closePath();
  ctx.clip();

  if (painterlyPlateReady && painterlyPlate.naturalWidth && !lowPowerRender()){
    const nw = painterlyPlate.naturalWidth, nh = painterlyPlate.naturalHeight;
    const sw = Math.min(nw, Math.max(260, w * 2.2)), sh = Math.min(nh, 220);
    const sx = (seed % Math.max(1, nw - sw));
    const sy = (((seed >>> 9) + (kind === 'wall' ? nh * .32 : nh * .55)) % Math.max(1, nh - sh));
    ctx.imageSmoothingEnabled = true;
    ctx.filter = kind === 'wall' ? 'saturate(1.12) contrast(1.08)' : 'saturate(1.28) contrast(1.08)';
    ctx.drawImage(painterlyPlate, sx, sy, sw, sh, x0 - 8, y0 - 8, w + 16, h + 16);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = kind === 'wall' ? .24 : .12;
    ctx.fillStyle = kind === 'wall' ? '#102036' : '#41200d';
    ctx.fillRect(x0, y0, w, h + 2);
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = .5;
    const wash = ctx.createLinearGradient(0, y0, 0, y0 + h);
    wash.addColorStop(0, kind === 'wall' ? '#6fa0bc' : '#ffb765');
    wash.addColorStop(1, kind === 'wall' ? '#203451' : '#5b2f19');
    ctx.fillStyle = wash;
    ctx.fillRect(x0, y0, w, h);
  } else {
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h);
    g.addColorStop(0, kind === 'wall' ? '#59687d' : '#a27645');
    g.addColorStop(1, kind === 'wall' ? '#20283c' : '#4a2b17');
    ctx.fillStyle = g;
    ctx.fillRect(x0, y0, w, h);
  }
  ctx.restore();

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = kind === 'wall' ? 'rgba(174,225,222,.28)' : 'rgba(255,221,142,.32)';
  ctx.lineWidth = openTop ? 3 : 1.5;
  ctx.beginPath();
  ctx.moveTo(x0 + 2, y0 + (openTop ? 7 + wob(0) : 2));
  for (let i = 1; i <= steps; i++){
    const px0 = x0 + (w * i) / steps - 2;
    const py0 = y0 + (openTop ? 4 + wob(i) : 2);
    const cx0 = x0 + (w * (i - .5)) / steps;
    ctx.quadraticCurveTo(cx0, y0 + (openTop ? wob(i + 2) : 2), px0, py0);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(8,6,12,.42)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0 + 1, y0 + h - 3);
  ctx.lineTo(x0 + w - 1, y0 + h - 3);
  ctx.stroke();
  if (openTop){
    const mossG = ctx.createLinearGradient(0, y0 - 1, 0, y0 + 12);
    mossG.addColorStop(0, 'rgba(181,235,92,.9)');
    mossG.addColorStop(.35, 'rgba(80,148,58,.72)');
    mossG.addColorStop(1, 'rgba(36,72,36,0)');
    ctx.fillStyle = mossG;
    ctx.fillRect(x0, y0 - 1, w, 14);
    ctx.fillStyle = 'rgba(184,236,94,.78)';
    for (let i = 0; i < Math.max(4, w / 18); i++){
      const px0 = x0 + ((seed >>> ((i % 8) * 3)) % Math.max(1, w));
      const len = 5 + ((seed >>> ((i % 5) * 4)) & 9);
      ctx.fillRect(px0, y0 + 3, 2, len);
    }
  }
  ctx.restore();
}

function drawPainterlyPlatforms(){
  for (let r = 0; r < ROWS; r++){
    let c = 0;
    while (c < COLS){
      const kind = platformKindAt(c, r);
      if (!kind){ c++; continue; }
      let c1 = c;
      while (c1 + 1 < COLS && platformKindAt(c1 + 1, r) === kind) c1++;
      drawOrganicPlatformRun(c, c1, r, kind);
      c = c1 + 1;
    }
  }
}

function ladderVisibleAt(c, r){
  const t = tileAt(c, r);
  return t === 'H' || (t === 'E' && exitRevealed);
}

function drawPainterlyLadderRun(c, r0, r1){
  const x = c * TILE, y = r0 * TILE + HUD_H, h = (r1 - r0 + 1) * TILE;
  const exit = tileAt(c, r0) === 'E';
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const rail = exit ? '#39d8ce' : '#9b6a34';
  const railDk = exit ? '#0d5d58' : '#3c2714';
  const railHi = exit ? '#bafff5' : '#e7b66a';
  for (const ox of [10, 26]){
    ctx.strokeStyle = railDk; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x + ox, y - 3); ctx.lineTo(x + ox + Math.sin(c + r0) * 1.5, y + h + 3); ctx.stroke();
    ctx.strokeStyle = rail; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(x + ox, y - 4); ctx.lineTo(x + ox + Math.sin(c + r0) * 1.5, y + h + 4); ctx.stroke();
    ctx.strokeStyle = railHi; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(x + ox - 1.4, y); ctx.lineTo(x + ox - .5, y + h); ctx.stroke();
  }
  for (let yy = y + 7; yy < y + h; yy += 12){
    ctx.strokeStyle = railDk; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x + 10, yy); ctx.quadraticCurveTo(x + 18, yy + Math.sin(yy * .2) * 1.5, x + 26, yy); ctx.stroke();
    ctx.strokeStyle = rail; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(x + 10, yy); ctx.quadraticCurveTo(x + 18, yy + Math.sin(yy * .2) * 1.5, x + 26, yy); ctx.stroke();
  }
  if (exit){
    ctx.globalCompositeOperation = 'lighter';
    for (let yy = y + 4; yy < y + h; yy += 26) glow((x + 18) / TILE, (yy - HUD_H) / TILE, 18, 'rgba(80,230,210,.28)', 1);
  }
  ctx.restore();
}

function drawPainterlyLadders(){
  for (let c = 0; c < COLS; c++){
    let r = 0;
    while (r < ROWS){
      if (!ladderVisibleAt(c, r)){ r++; continue; }
      let r1 = r;
      while (r1 + 1 < ROWS && ladderVisibleAt(c, r1 + 1)) r1++;
      drawPainterlyLadderRun(c, r, r1);
      r = r1 + 1;
    }
  }
}

function tileGradient(c, r, top, bottom){
  const y = r * TILE + HUD_H;
  const g = ctx.createLinearGradient(0, y, 0, y + TILE);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
}
function drawPainterlyCrate(c, r){
  const x = c * TILE, y = r * TILE + HUD_H;
  ctx.save();
  ctx.fillStyle = tileGradient(c, r, '#8a5a2f', '#432413');
  roundRect(x + 4, y + 4, TILE - 8, TILE - 8, 5); ctx.fill();
  ctx.strokeStyle = 'rgba(255,205,120,.34)';
  ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(180,48,36,.82)';
  roundRect(x + 6, y + 13, TILE - 12, 10, 3); ctx.fill();
  ctx.strokeStyle = 'rgba(55,26,12,.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 7, y + 8); ctx.lineTo(x + TILE - 7, y + TILE - 8);
  ctx.moveTo(x + TILE - 7, y + 8); ctx.lineTo(x + 7, y + TILE - 8);
  ctx.stroke();
  ctx.fillStyle = '#ffe18b';
  ctx.font = '900 8px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('TNT', x + TILE / 2, y + 18);
  ctx.restore();
}
function drawPainterlyCrumble(c, r){
  const x = c * TILE, y = r * TILE + HUD_H;
  ctx.save();
  ctx.fillStyle = tileGradient(c, r, '#b38a5b', '#56311e');
  roundRect(x + 2, y + 2, TILE - 4, TILE - 4, 4); ctx.fill();
  if (painterlyPlateReady && painterlyPlate.naturalWidth && !lowPowerRender()){
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = .42;
    const sx = ((c * 91 + r * 37) % (painterlyPlate.naturalWidth - 180));
    const sy = ((r * 113 + c * 19) % (painterlyPlate.naturalHeight - 140));
    ctx.drawImage(painterlyPlate, sx, sy, 180, 140, x, y, TILE, TILE);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = 'rgba(32,16,8,.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 8); ctx.lineTo(x + 15, y + 17); ctx.lineTo(x + 10, y + 29);
  ctx.moveTo(x + 22, y + 5); ctx.lineTo(x + 25, y + 17); ctx.lineTo(x + 31, y + 28);
  ctx.moveTo(x + 8, y + 23); ctx.lineTo(x + 22, y + 20);
  ctx.stroke();
  ctx.restore();
}
function drawPainterlyBar(c, r){
  const x = c * TILE, y = r * TILE + HUD_H + 7;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(52,38,18,.72)';
  ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x + TILE + 2, y); ctx.stroke();
  const g = ctx.createLinearGradient(0, y - 5, 0, y + 5);
  g.addColorStop(0, '#ffe39a'); g.addColorStop(.45, '#c89a45'); g.addColorStop(1, '#624719');
  ctx.strokeStyle = g;
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 2, y - 1); ctx.lineTo(x + TILE + 2, y - 1); ctx.stroke();
  ctx.fillStyle = 'rgba(255,238,170,.55)';
  for (const bx of [x + 5, x + TILE - 5]) ctx.fillRect(bx - 1, y - 4, 2, 2);
  ctx.restore();
}
function drawPainterlyBelt(c, r, dir){
  const x = c * TILE, y = r * TILE + HUD_H;
  ctx.save();
  ctx.fillStyle = tileGradient(c, r, '#5b586a', '#252331');
  roundRect(x + 1, y + 4, TILE - 2, TILE - 9, 5); ctx.fill();
  ctx.strokeStyle = 'rgba(180,210,220,.22)';
  ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(12,10,16,.45)';
  ctx.fillRect(x + 3, y + TILE - 10, TILE - 6, 4);
  const phase = (gameTime * 20 * dir) % 12;
  for (let k = -1; k <= 3; k++){
    const cx0 = x + ((k * 12 + phase + 18) % 48) - 4;
    const cy0 = y + 15;
    ctx.fillStyle = 'rgba(210,220,225,.45)';
    ctx.beginPath(); ctx.ellipse(cx0, cy0, 3.2, 3.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe36d';
    ctx.beginPath();
    if (dir > 0){ ctx.moveTo(cx0 - 2, cy0 - 6); ctx.lineTo(cx0 + 5, cy0); ctx.lineTo(cx0 - 2, cy0 + 6); }
    else { ctx.moveTo(cx0 + 2, cy0 - 6); ctx.lineTo(cx0 - 5, cy0); ctx.lineTo(cx0 + 2, cy0 + 6); }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawPowerupToken(cx, cy, kind, s){
  const meta = PKINDS[kind] || PKINDS[1];
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.beginPath(); ctx.ellipse(0, s * .8, s * .78, s * .18, 0, 0, Math.PI * 2); ctx.fill();
  const g = ctx.createRadialGradient(-s * .25, -s * .35, 1, 0, 0, s);
  g.addColorStop(0, '#fff8ce'); g.addColorStop(.4, meta.color); g.addColorStop(1, '#19121c');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = hexA(meta.color, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = '#08050e'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (kind === 1){ ctx.moveTo(-5, 4); ctx.lineTo(0, -6); ctx.lineTo(5, 4); ctx.moveTo(-4, 1); ctx.lineTo(4, 1); }
  else if (kind === 2){ ctx.moveTo(-7, 2); ctx.lineTo(-1, 2); ctx.lineTo(1, 6); ctx.moveTo(2, 0); ctx.lineTo(8, 2); ctx.lineTo(8, 6); }
  else if (kind === 3){ ctx.arc(1, 0, 6, Math.PI * .35, Math.PI * 1.65); ctx.moveTo(1, -6); ctx.quadraticCurveTo(6, 0, 1, 6); }
  else if (kind === 4){ ctx.arc(0, 0, 7, Math.PI * .12, Math.PI * .88, true); ctx.moveTo(-6, 3); ctx.lineTo(-6, 7); ctx.moveTo(6, 3); ctx.lineTo(6, 7); }
  else if (kind === 6){
    ctx.moveTo(0, 7);
    ctx.bezierCurveTo(-9, 0, -8, -8, -2, -6);
    ctx.bezierCurveTo(0, -5, 0, -3, 0, -3);
    ctx.bezierCurveTo(0, -3, 0, -5, 2, -6);
    ctx.bezierCurveTo(8, -8, 9, 0, 0, 7);
  }
  else { ctx.moveTo(-6, 6); ctx.lineTo(5, -5); ctx.moveTo(1, -8); ctx.lineTo(8, -1); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,245,.72)'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();
}

function shakeOffset(){
  if (shake <= 0) return {x: 0, y: 0};
  const amp = shake * shake * (mobileCamera ? 3.2 : 7.5);
  return {
    x: Math.sin(clock * 83.0) * amp + Math.sin(clock * 41.0 + 1.7) * amp * 0.35,
    y: Math.cos(clock * 79.0 + 0.6) * amp * 0.72,
  };
}

function renderWorldFrame(includeHUD){
  if (state === 'title'){ renderTitle(); return; }
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  if (bg) ctx.drawImage(bg, 0, 0); else { ctx.fillStyle = '#0b0812'; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }

  // drifting dust motes (depth)
  ctx.fillStyle = 'rgba(255,233,170,.18)';
  for (let i = 0; i < 18; i++){
    const mx = (i * 137.5 + gameTime * (8 + i % 5 * 3)) % VIEW_W;
    const my = (i * 89.3 + Math.sin(gameTime * 0.5 + i) * 20 + 60 + i * 18) % VIEW_H;
    ctx.fillRect(mx, my, 2, 2);
  }

  // animated atmosphere: breathing god-ray shafts + slow drifting mist (adds life to the static backdrop)
  if (grid.length){
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++){
      const baseX = VIEW_W * (0.22 + i * 0.18);
      const drift = Math.sin(clock * 0.15 + i * 1.7) * 40;
      const a = 0.05 + 0.04 * (0.5 + 0.5 * Math.sin(clock * 0.6 + i * 2));
      ctx.globalAlpha = a; ctx.fillStyle = '#acc8ec';
      const rx = baseX + drift;
      ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx + 60, 0); ctx.lineTo(rx + 150, VIEW_H); ctx.lineTo(rx + 70, VIEW_H); ctx.closePath(); ctx.fill();
    }
	    // far waterfall shimmer — scrolling streaks at the sides
	    ctx.globalCompositeOperation = 'lighter';
	    for (const wx of [VIEW_W * 0.13, VIEW_W * 0.87]){
	      for (let i = 0; i < 7; i++){
	        const yy = ((i * 64 + clock * 130) % (VIEW_H * 0.62)) + 30;
	        const sway = Math.sin(clock * 1.8 + i * 1.9) * 5;
	        const len = 26 + (i % 3) * 10;
	        ctx.globalAlpha = 0.055 + 0.028 * Math.sin(clock * 4 + i);
	        ctx.strokeStyle = '#d9f2ff';
	        ctx.lineWidth = 1.4 + (i % 2) * 0.8;
	        ctx.lineCap = 'round';
	        ctx.beginPath();
	        ctx.moveTo(wx + sway, yy);
	        ctx.bezierCurveTo(wx + sway + 4, yy + len * .3, wx + sway - 3, yy + len * .68, wx + sway + 1, yy + len);
	        ctx.stroke();
	        ctx.globalAlpha *= 0.45;
	        ctx.beginPath();
	        ctx.moveTo(wx + sway + 8, yy + 9);
	        ctx.bezierCurveTo(wx + sway + 11, yy + 18, wx + sway + 6, yy + 28, wx + sway + 9, yy + len + 6);
	        ctx.stroke();
	      }
	    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // drifting mist blobs
    for (let i = 0; i < 3; i++){
      const mx = ((i * 420 + clock * (10 + i * 4)) % (VIEW_W + 300)) - 150;
      const my = VIEW_H * (0.5 + 0.18 * Math.sin(clock * 0.2 + i));
      glow(mx / TILE, (my - HUD_H) / TILE, 150, 'rgba(120,150,200,0.05)', 1);
    }
    // drifting fireflies (slow glowing motes that wander the cave)
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 13; i++){
      const fx = (i * 173.1 + Math.sin(clock * 0.3 + i * 1.3) * 60 + clock * (5 + i % 4 * 2)) % VIEW_W;
      const fy = HUD_H + 30 + ((i * 91.7 + Math.sin(clock * 0.5 + i) * 40) % (VIEW_H - HUD_H - 60));
      const a = 0.18 + 0.18 * (0.5 + 0.5 * Math.sin(clock * 2.2 + i * 2));
      const warm = i % 3 === 0;
      glow(fx / TILE, (fy - HUD_H) / TILE, 7, warm ? 'rgba(255,210,120,' + a + ')' : 'rgba(120,230,210,' + a + ')', 1);
      ctx.globalAlpha = a + 0.2; ctx.fillStyle = warm ? '#fff0c8' : '#cffff5'; ctx.fillRect(fx | 0, fy | 0, 1, 1);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  ctx.save();
  if (shake > 0){
    const s = shakeOffset();
    ctx.translate(s.x, s.y);
  }

  if (grid.length){
    const T = ART.tiles;
    // contact shadows: ground every platform by darkening the air cell beneath it
    for (let r = 0; r < ROWS - 1; r++) for (let c = 0; c < COLS; c++)
      if (rendersSolid(c, r) && !rendersSolid(c, r + 1)) ctx.drawImage(underShadow(), c * TILE, (r + 1) * TILE + HUD_H);
    drawPainterlyPlatforms();
    drawPainterlyLadders();
    for (let r = 0; r < ROWS; r++){
      for (let c = 0; c < COLS; c++){
        const t = grid[r][c];
        const dug = isDug(c, r), blast = isBlasted(c, r);
	        if (t === '#' || t === 'T' || t === 'B' || t === 'C' || isBottomDiggable(c, r)){
	          if (blast){ drawPit(c, r, .9); continue; }
	          if (dug){
	            const h = holes.get(key(c, r));
	            drawPit(c, r, 1, h);
	            continue;
	          }
	          if (t === 'X') continue;
	          if (t === 'C' && isCrumbleGone(c, r)){ continue; }
          if (t === 'B') drawPainterlyCrate(c, r);
          else if (t === 'C'){
            const cr = crumbles.get(key(c, r));
            drawPainterlyCrumble(c, r);
            if (cr){ ctx.globalAlpha = 0.3 + 0.3 * Math.sin(gameTime * 20); ctx.fillStyle = '#1a0e06';
              ctx.fillRect(c * TILE + 2, r * TILE + HUD_H + 2, TILE - 4, TILE - 4); ctx.globalAlpha = 1; }
          }
          else continue;
        }
        else if (t === 'X') continue;
        else if (t === 'H') continue;
        else if (t === '-') drawPainterlyBar(c, r);
        else if (t === 'E' && exitRevealed) continue;
        else if (t === '<' || t === '>') drawPainterlyBelt(c, r, t === '>' ? 1 : -1);
        else if (t === '[' || t === ']'){
          ctx.globalAlpha = 0.5 + 0.15 * Math.sin(gameTime * 4 + c);
          ctx.fillStyle = '#3fd2c7';
          ctx.fillRect(c * TILE + TILE / 2 - 2, r * TILE + HUD_H + 2, 4, TILE - 4);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#9ff7ec';
          const gx = c * TILE + TILE / 2, gy = r * TILE + HUD_H + TILE / 2;
          ctx.beginPath();
          if (t === '['){ ctx.moveTo(gx - 5, gy); ctx.lineTo(gx + 5, gy - 7); ctx.lineTo(gx + 5, gy + 7); }
          else { ctx.moveTo(gx + 5, gy); ctx.lineTo(gx - 5, gy - 7); ctx.lineTo(gx - 5, gy + 7); }
          ctx.fill();
        }
      }
    }

    // decorative set-dressing (behind gold/entities) + glowing exit portal
    drawDecor();
    drawPortal();
    drawSpecialSetpieces();
    drawMineCart();

    // power-ups: icon + bob + halo
    for (const pu of powerups){
      if (pu.taken) continue;
      const bobv = Math.sin(gameTime * 3 + pu.c) * 3;
      const meta = PKINDS[pu.kind] || PKINDS[1];
      glow(pu.c + .5, pu.r + .5 + bobv / TILE, 26, hexA(meta.color, .5), .6);
      drawPowerupToken(pu.c * TILE + TILE / 2, pu.r * TILE + HUD_H + TILE / 2 + bobv, pu.kind, 13);
    }
    for (const tr of treasures){
      if (tr.taken) continue;
      const meta = TKINDS[tr.kind] || TKINDS.relic;
      const bobv = Math.sin(gameTime * 2.2 + tr.c * .8 + tr.r) * 2.6;
      const pulse = 0.46 + 0.18 * Math.sin(gameTime * 3.5 + tr.c);
      glow(tr.c + .5, tr.r + .5 + bobv / TILE, tr.kind === 'relic' ? 30 : 23, hexA(meta.color, pulse), .7);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = .96;
      ctx.drawImage(ART.TREASURES[tr.kind] || ART.TREASURES.relic, tr.c * TILE + 3, tr.r * TILE + HUD_H + 3 + bobv, 30, 30);
      ctx.restore();
    }
    drawRouteHint();
    // lit fuses
    for (const f of fuses){
      const a = 0.5 + 0.5 * Math.sin(f.t * 50);
      glow(f.c + .5, f.r + .5, 22, 'rgba(255,150,40,.7)', a * .8);
      ctx.globalAlpha = a; ctx.fillStyle = '#fff3b0';
      ctx.fillRect(f.c * TILE + 14, f.r * TILE + HUD_H + 14, 8, 8); ctx.globalAlpha = 1;
    }
    // dig-in-progress
    if (player && player.digT > 0 && player.pendingDig){
      const total = Math.max(0.01, player.pendingDig.total || DIG_TIME);
      const p = clamp(1 - player.digT / total, 0, 1);
      const x = player.pendingDig.c * TILE, y = player.pendingDig.r * TILE + HUD_H;
      ctx.globalAlpha = .22 + p * .5;
      ctx.fillStyle = '#2b1710';
      ctx.fillRect(x + 6 + p * 5, y + 12, 14 + p * 8, 3);
      ctx.fillRect(x + 14, y + 21, 12 + p * 10, 3);
      ctx.fillRect(x + 20 - p * 4, y + 8, 3, 22);
      ctx.globalAlpha = .26 + p * .34;
      ctx.fillStyle = '#d3a15d';
      ctx.fillRect(x + 6, y + 5, TILE - 12, 3);
      ctx.globalAlpha = 1;
    }
    // gold — gentle float bob + breathing pulse + drifting twinkle
    for (const gd of golds){
      if (gd.taken || gd.held) continue;
      const ph = gameTime * 2 + gd.c * 0.9 + gd.r * 1.4;
      const bob = Math.sin(ph) * 2.2;
      const s = 1 + Math.sin(ph * 1.3) * 0.06;
      const cx0 = gd.c * TILE + 18, cy0 = gd.r * TILE + HUD_H + 18 + bob;
      if (goldLeft > 0 && goldLeft <= 2) drawLastNuggetCue(cx0, cy0, ph);
      drawGoldGem(cx0, cy0, 15 * s, ph);
      const tw = Math.sin(ph * 1.7);
      if (tw > 0.5){
        ctx.globalAlpha = (tw - 0.5) / 0.5;
        ctx.fillStyle = '#fff';
        const sx = cx0 + Math.cos(ph * 1.1) * 5 - 1, sy = cy0 + Math.sin(ph * 1.4) * 4 - 5;
        ctx.fillRect(sx, sy, 2, 2);
        ctx.globalAlpha = 1;
      }
    }
    drawSpecialNuggets();
    drawSpecialRockWarnings();

    // entities — guards behind player
    for (const gu of guards) if (gu.state !== 'dead' || gu.deadT < 1) drawActor(gu);
    if (player) drawActor(player);
    drawSpecialRocks();

    // particles
    for (const p of particles){
      const a = Math.max(0, Math.min(1, p.life / p.max));
      if (p.glow) glow(p.x, p.y, p.size * 3, hexA(p.color, .8), a * .5);
      ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.fillRect(px(p.x) - p.size / 2, py(p.y) - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    if (includeHUD) drawPickupTrails();

    // floating score popups (with a quick scale-pop)
    ctx.font = '900 16px Consolas, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const t of popups){
      const age = 1.1 - t.life, sc = 1 + 0.5 * Math.max(0, 1 - age * 6);
      ctx.globalAlpha = Math.max(0, Math.min(1, t.life));
      ctx.save(); ctx.translate(px(t.x), py(t.y)); ctx.scale(sc, sc);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillText(t.text, 1, 1);
      ctx.fillStyle = t.color; ctx.fillText(t.text, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();

  /* ---------- lighting overlay ---------- */
  if (grid.length){
    ctx.save();
    // cinematic vignette (stronger at edges/corners) — frames the action without crushing the centre
    const vg = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2 + 20, VIEW_H * .48, VIEW_W / 2, VIEW_H / 2, VIEW_H * 1.0);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(.7, 'rgba(6,4,12,.12)'); vg.addColorStop(1, 'rgba(4,3,10,.42)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // warm-key / cool-shadow colour grade for depth
    ctx.save(); ctx.globalCompositeOperation = 'soft-light';
    const gr = ctx.createLinearGradient(0, HUD_H, 0, VIEW_H);
    gr.addColorStop(0, 'rgba(255,176,90,.28)'); gr.addColorStop(.55, 'rgba(120,110,150,.05)'); gr.addColorStop(1, 'rgba(40,80,150,.34)');
    ctx.fillStyle = gr; ctx.fillRect(0, HUD_H, VIEW_W, VIEW_H - HUD_H);
    ctx.restore();
    // additive lights — soft warm POOL on the ground around the player (keeps the sprite the focal point)
    ctx.globalCompositeOperation = 'lighter';
    if (player && player.state !== 'dead'){
      glow(player.x, player.y + .25, 116, 'rgba(255,198,120,.18)', 1);
      if (player.cloakT > 0) glow(player.x, player.y - .15, 54, 'rgba(176,127,255,.5)', 0.4 + 0.25 * Math.sin(gameTime * 10));
      if (player.magnetT > 0) glow(player.x, player.y - .15, 96, 'rgba(255,210,63,.2)', 0.35 + 0.15 * Math.sin(gameTime * 6));
      if (oilLightT > 0) glow(player.x, player.y + .1, 168, 'rgba(255,191,90,.18)', 0.6 + 0.18 * Math.sin(gameTime * 5));
    }
    for (const gd of golds) if (!gd.taken && !gd.held) glow(gd.c + .5, gd.r + .5, 26, 'rgba(255,200,60,.3)', 1);
    for (const n of specialNuggets) glow(n.x, n.y, 22, 'rgba(255,205,70,.28)', 1);
    for (const tr of treasures) if (!tr.taken){ const meta = TKINDS[tr.kind] || TKINDS.relic; glow(tr.c + .5, tr.r + .5, 20, hexA(meta.color, .18), 1); }
    if (special){
      glow(special.cart.x, special.cart.y, special.cartReady ? 78 : 36, 'rgba(255,190,64,' + (special.cartReady ? .24 : .08) + ')', 1);
      for (const lava of special.lava || []) for (let c = lava.c0; c <= lava.c1; c++) glow(c + .5, lava.r + .5, 36, 'rgba(255,82,26,.25)', 1);
      for (const vent of special.vents || []) glow(vent.x, vent.y - .3, 32, 'rgba(180,255,240,.18)', 1);
      for (const plate of special.plates || []) if (!plate.used) glow(plate.c + .5, plate.r + .72, 28, 'rgba(63,210,199,.18)', 1);
      for (const cr of special.crushers || []) glow(cr.c + .5, cr.r + 1.2, 26, 'rgba(255,157,46,.1)', 1);
      if (special.worm?.active) glow(special.worm.x, special.worm.y, 72, 'rgba(255,95,28,.28)', 1);
    }
    if (exitRevealed){ const pulse = 0.35 + 0.2 * Math.sin(gameTime * 5); for (const e of exitCells) glow(e.c + .5, e.r + .5, 38, 'rgba(63,210,199,' + pulse + ')', 1); }
    for (const h of holes.values()) glow(h.c + .5, h.r + .6, 20, 'rgba(255,90,40,.22)', 1);
    // torch pools
    for (const d of decor) if (d.type === 'torch'){ const fl = 0.85 + 0.15 * Math.sin(gameTime * 14 + d.c * 3); glow(d.c + .5, d.r - 0.5, 58 * fl, 'rgba(255,150,50,.5)', 1); }
    // exit portal aura
    if (exitRevealed && exitCells.length){ const e = topExitCell(); glow(e.c + .5, e.r + .5, 44, 'rgba(80,230,210,' + (0.4 + 0.2 * Math.sin(gameTime * 4)) + ')', 1); }
    // faint danger underglow so guard type reads at a glance
    for (const gu of guards) if (gu.state !== 'dead') glow(gu.x, gu.y + .15, 26, gu.state === 'stun' ? 'rgba(255,255,255,.08)' : guardMeta(gu).glow, 1);
    for (const p of particles) if (p.glow) glow(p.x, p.y, p.size * 3.5, hexA(p.color, .6), 1);
    ctx.restore();

    // bloom — downscale + blur the scene and add it back so bright things glow (painterly haze)
    if (!lowPowerRender()){
      const bw = VIEW_W >> 1, bh = VIEW_H >> 1;
      if (!bloomCv){ bloomCv = ART.cv(bw, bh); bloomCx = bloomCv.getContext('2d'); }
      bloomCx.setTransform(1, 0, 0, 1, 0, 0);
      bloomCx.clearRect(0, 0, bw, bh);
      bloomCx.filter = 'blur(2.5px) saturate(1.7)';   // richer, more saturated glow
      const srcCanvas = ctx.canvas || canvas;
      bloomCx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, bw, bh);
      bloomCx.filter = 'none';
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.28;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bloomCv, 0, 0, VIEW_W, VIEW_H);
      ctx.restore();
    }
  }

  // hit flash
  if (flash > 0){ ctx.fillStyle = 'rgba(255,245,210,' + (flash * (mobileCamera ? .28 : .5)) + ')'; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
  // death red vignette
  if (deathFlash > 0){
    const dv = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * .2, VIEW_W / 2, VIEW_H / 2, VIEW_H * .75);
    dv.addColorStop(0, 'rgba(0,0,0,0)'); dv.addColorStop(1, 'rgba(180,20,40,' + (deathFlash * .5) + ')');
    ctx.fillStyle = dv; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  drawDeathCue();
  // combo escalation tint
  if (comboN >= 3){
    const ct = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * .35, VIEW_W / 2, VIEW_H / 2, VIEW_H * .8);
    const a = Math.min(.28, (comboN - 2) * 0.06) * (0.7 + 0.3 * Math.sin(gameTime * 8));
    ct.addColorStop(0, 'rgba(0,0,0,0)'); ct.addColorStop(1, 'rgba(255,140,40,' + a + ')');
    ctx.fillStyle = ct; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  if (special && special.caveT != null){
    const panic = clamp(1 - special.caveT / (special.caveLimit || 46), 0, 1);
    const pulse = 0.5 + 0.5 * Math.sin(gameTime * (5 + panic * 10));
    const cg = ctx.createRadialGradient(VIEW_W / 2, VIEW_H * .42, VIEW_H * .2, VIEW_W / 2, VIEW_H / 2, VIEW_H * .85);
    cg.addColorStop(0, 'rgba(0,0,0,0)');
    cg.addColorStop(1, 'rgba(210,60,24,' + ((.08 + panic * .2) * pulse) + ')');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  // foreground framing layer (near, dark — frames the scene without covering the action)
  if (grid.length) drawForeground();

  // pause scrim
  if (state === 'paused'){ ctx.fillStyle = 'rgba(8,5,14,.55)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }

  drawWavePreview();

  // intro banner
  if (banner){
    const a = Math.min(1, banner.life) * Math.min(1, (2.4 - banner.life) * 4);
    ctx.globalAlpha = Math.max(0, a);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 40px Consolas, monospace';
    ctx.fillText(banner.text, VIEW_W / 2, VIEW_H / 2 - 18);
    if (banner.sub){ ctx.fillStyle = '#d8cfe4'; ctx.font = '600 18px Consolas, monospace'; ctx.fillText(banner.sub, VIEW_W / 2, VIEW_H / 2 + 16); }
    if (banner.stats && banner.stats.length){
      ctx.font = '900 10px system-ui, sans-serif';
      const chipY = VIEW_H / 2 + 43;
      const widths = banner.stats.map(s => Math.max(64, Math.min(158, ctx.measureText(s.label + ' ' + s.value).width + 22)));
      const gap = 7, totalW = widths.reduce((sum, w) => sum + w, 0) + gap * (widths.length - 1);
      let bx = VIEW_W / 2 - totalW / 2;
      for (let i = 0; i < banner.stats.length; i++){
        const s = banner.stats[i], w = widths[i];
        roundRect(bx, chipY - 9, w, 18, 5);
        ctx.fillStyle = 'rgba(8,10,18,.74)';
        ctx.fill();
        ctx.strokeStyle = i === 2 ? 'rgba(255,64,90,.46)' : 'rgba(255,210,63,.36)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = i === 2 ? '#ff8fa0' : '#ffd86b';
        ctx.fillText(s.label + ' ' + s.value, bx + w / 2, chipY + 1);
        bx += w + gap;
      }
    }
    if (banner.brief){ ctx.fillStyle = '#ffe98a'; ctx.font = '700 14px system-ui, sans-serif'; ctx.fillText(banner.brief, VIEW_W / 2, VIEW_H / 2 + 72); }
    ctx.globalAlpha = 1;
  }

  // compact claim hint
  if (hint && !banner){
    ctx.globalAlpha = Math.min(1, hint.life / 1.5) * 0.85;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const text = hint.text || '';
    ctx.font = '700 16px Consolas, monospace';
    const w = Math.min(620, Math.max(360, ctx.measureText(text).width + 44));
    ctx.fillStyle = '#0c0a12cc'; ctx.fillRect(VIEW_W / 2 - w / 2, VIEW_H - 70, w, 34);
    ctx.fillStyle = '#ffe98a'; ctx.font = '700 16px Consolas, monospace';
    ctx.fillText(text, VIEW_W / 2, VIEW_H - 53);
    ctx.globalAlpha = 1;
  }

  // exit arrow when revealed and far from the player
  if (exitRevealed && player && exitCells.length){
    const e = exitCells[0];
    if (Math.abs(e.c - player.x) > 6 || Math.abs(e.r - player.y) > 4){
      const ang = Math.atan2((e.r + .5) - player.y, (e.c + .5) - player.x);
      const ax = px(player.x) + Math.cos(ang) * 40, ay = py(player.y) + Math.sin(ang) * 40;
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang);
      ctx.fillStyle = 'rgba(63,210,199,' + (0.6 + 0.3 * Math.sin(gameTime * 6)) + ')';
      ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-6, -7); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  if (includeHUD) drawHUD();
}

let worldCv = null, worldCx = null;
let camX = 0, camY = HUD_H;
let mobileView = null;
let mobileZoomAdjust = 1;
let mobileLeadX = 0, mobileLeadY = 0;
function ensureWorldCanvas(){
  if (worldCv) return;
  worldCv = document.createElement('canvas');
  worldCv.width = VIEW_W;
  worldCv.height = VIEW_H;
  worldCx = worldCv.getContext('2d');
  worldCx.imageSmoothingEnabled = false;
}
function mobileHudHeight(){ return Math.max(86, Math.min(104, Math.round(screenH * 0.12))); }
function mobileCameraScale(){
  const portrait = screenH >= screenW;
  const base = portrait ? 1.18 : 1.36;
  return Math.max(0.82, Math.min(1.95, (base + (screenW < 380 ? 0.04 : 0)) * mobileZoomAdjust));
}
function mobileCameraLead(srcW, srcH){
  if (!player || state !== 'playing') return {x: 0, y: 0};
  const moveIntent = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
  const climbIntent = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);
  let leadX = moveIntent * srcW * 0.08;
  let leadY = climbIntent * srcH * 0.07;

  let nearest = null, best = Infinity;
  for (const gu of guards){
    if (gu.state === 'dead' || gu.state === 'stun') continue;
    const dx = gu.x - player.x, dy = gu.y - player.y;
    const dist = Math.hypot(dx, dy);
    const pressure = dist + Math.abs(dy) * 0.45 - (gu.kind === 'scout' ? 1.2 : 0) - (gu.kind === 'mason' ? 0.4 : 0);
    if (pressure < best){ best = pressure; nearest = {gu, dx, dy, dist}; }
  }
  if (nearest && nearest.dist < 9){
    const urgency = Math.max(0, 1 - nearest.dist / 9);
    leadX += Math.sign(nearest.dx) * srcW * (0.04 + urgency * 0.07);
    if (Math.abs(nearest.dy) > 1.25) leadY += Math.sign(nearest.dy) * srcH * (0.025 + urgency * 0.05);
  }
  return {
    x: Math.max(-srcW * 0.28, Math.min(srcW * 0.28, leadX)),
    y: Math.max(-srcH * 0.18, Math.min(srcH * 0.18, leadY)),
  };
}
function updateMobileCamera(playH, zoom){
  const srcW = Math.min(VIEW_W, screenW / zoom);
  const srcH = Math.min(VIEW_H - HUD_H, playH / zoom);
  const rawLead = mobileCameraLead(srcW, srcH);
  const leadFollow = state === 'playing' ? 0.055 : 0.14;
  mobileLeadX += (rawLead.x - mobileLeadX) * leadFollow;
  mobileLeadY += (rawLead.y - mobileLeadY) * leadFollow;
  const lead = {x: mobileLeadX, y: mobileLeadY};
  const targetX = player ? px(player.x) - srcW * 0.5 + lead.x : (VIEW_W - srcW) * 0.5;
  const targetY = player ? py(player.y) - srcH * 0.56 + lead.y : HUD_H;
  const nextX = clamp(targetX, 0, VIEW_W - srcW);
  const nextY = clamp(targetY, HUD_H, VIEW_H - srcH);
  const follow = state === 'playing' ? 0.12 : 0.26;
  camX += (nextX - camX) * follow;
  camY += (nextY - camY) * follow;
  camX = clamp(camX, 0, VIEW_W - srcW);
  camY = clamp(camY, HUD_H, VIEW_H - srcH);
  return {x: camX, y: camY, w: srcW, h: srcH};
}
function drawMobileHUD(){
  const h = mobileHudHeight();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(18,16,26,.98)');
  g.addColorStop(.62, 'rgba(8,14,24,.92)');
  g.addColorStop(1, 'rgba(6,8,14,.84)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, screenW, h);
  ctx.fillStyle = 'rgba(255,210,63,.46)';
  ctx.fillRect(0, h - 3, screenW, 2);
  ctx.textBaseline = 'middle';

  const total = golds.length || 0, got = total - goldLeft;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd86b';
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillText('HAUL', 14, 18);
  drawGemIcon(22, 46, 8, '#ffd23f');
  ctx.fillStyle = '#fff1af';
  ctx.font = '900 18px system-ui, sans-serif';
  ctx.fillText(got + '/' + total, 36, 47);
  for (let i = 0, n = Math.min(lives, MAX_LIVES); i < n; i++) drawHeart(94 + i * 20, 45, 16, true);

  ctx.textAlign = 'center';
	  ctx.fillStyle = 'rgba(255,216,107,.9)';
	  ctx.font = '900 11px system-ui, sans-serif';
	  ctx.fillText('SCORE', screenW / 2, 18);
	  ctx.fillStyle = '#fff';
	  ctx.font = '900 21px system-ui, sans-serif';
	  ctx.fillText(String(score).padStart(6, '0'), screenW / 2, 43);

  const tt = Math.max(0, levelTime | 0), mm = String((tt / 60) | 0).padStart(2, '0'), ss = String(tt % 60).padStart(2, '0');
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(216,207,228,.72)';
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillText(special && special.caveT != null ? 'CAVE-IN' : mode === 'daily' ? 'DAILY' : 'TIME', screenW - 14, 18);
	  ctx.fillStyle = '#f6f0ff';
	  ctx.font = '900 20px system-ui, sans-serif';
	  ctx.fillText(special && special.caveT != null ? Math.ceil(special.caveT) + 's' : mm + ':' + ss, screenW - 14, 47);

	  if (grid.length){
	    const compact = screenW < 360;
	    const chips = [
	      {label: compact ? 'F' : 'FINDS', value: discoveryCount + '/' + discoveryTotal, col: '#9ef0c8', done: discoveryTotal && discoveryCount >= discoveryTotal},
	      {label: isSpecialMode() ? 'CART' : 'EXIT', value: isSpecialMode() ? (specialCartReady() ? 'READY' : 'LOCKED') : (exitRevealed ? 'OPEN' : 'LOCKED'), col: '#3fd2c7', done: exitRevealed},
	    ];
	    const gap = 6, chipW = compact ? 70 : 82, totalW = chipW * chips.length + gap;
	    let x = screenW / 2 - totalW / 2, y = h - 15;
	    ctx.font = '900 9px system-ui, sans-serif';
	    ctx.textAlign = 'left';
	    for (const chip of chips){
	      roundRect(x, y - 7, chipW, 14, 4);
	      ctx.fillStyle = 'rgba(8,10,18,.58)';
	      ctx.fill();
	      ctx.strokeStyle = chip.done ? chip.col : 'rgba(255,214,110,.28)';
	      ctx.lineWidth = 1;
	      ctx.stroke();
	      ctx.fillStyle = '#f5eddd';
	      ctx.fillText(chip.label, x + 7, y + 1);
	      ctx.fillStyle = chip.col;
	      ctx.textAlign = 'right';
	      ctx.fillText(chip.value, x + chipW - 6, y + 1);
	      ctx.textAlign = 'left';
	      x += chipW + gap;
	    }
	  }
	}
function worldToMobileScreen(wx, wy){
  if (!mobileView) return {x: px(wx), y: py(wy)};
  return {
    x: (px(wx) - mobileView.x) / mobileView.w * screenW,
    y: mobileView.hudH + (py(wy) - mobileView.y) / mobileView.h * mobileView.playH,
  };
}
function mobileRadarDot(x, y, color, r){
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  ctx.beginPath(); ctx.arc(x + 1, y + 1, r + 1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function drawMobileRadar(){
  if (!grid.length || !mobileView) return;
  const w = Math.min(116, Math.max(92, screenW * 0.3));
  const h = Math.round(w * ((VIEW_H - HUD_H) / VIEW_W));
  const x = screenW - w - 10, y = mobileView.hudH + 10;
  ctx.save();
  ctx.fillStyle = 'rgba(6,8,14,.58)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255,216,107,.38)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);

  const sx = w / VIEW_W, sy = h / (VIEW_H - HUD_H);
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(x + mobileView.x * sx, y + (mobileView.y - HUD_H) * sy, mobileView.w * sx, mobileView.h * sy);
  ctx.strokeStyle = 'rgba(255,255,255,.5)';
  ctx.strokeRect(x + mobileView.x * sx, y + (mobileView.y - HUD_H) * sy, mobileView.w * sx, mobileView.h * sy);

  for (const gd of golds) if (!gd.taken && !gd.held) mobileRadarDot(x + (gd.c + .5) * TILE * sx, y + (gd.r + .5) * TILE * sy, '#ffd23f', 2);
  for (const tr of treasures) if (!tr.taken) mobileRadarDot(x + (tr.c + .5) * TILE * sx, y + (tr.r + .5) * TILE * sy, '#43e0d4', 1.8);
  for (const gu of guards) if (gu.state !== 'dead') mobileRadarDot(x + px(gu.x) * sx, y + (py(gu.y) - HUD_H) * sy, guardMeta(gu).color, gu.kind === 'scout' ? 3 : 2.5);
  if (player) mobileRadarDot(x + px(player.x) * sx, y + (py(player.y) - HUD_H) * sy, '#ffffff', 2.4);
  ctx.restore();
}
function drawMobileAwareness(){
  if (!mobileView || state !== 'playing') return;
  const items = [];
  for (const gu of guards) if (gu.state !== 'dead') {
    const meta = guardMeta(gu);
    items.push({x: gu.x, y: gu.y, color: meta.color, icon: meta.icon, label: meta.label, kind: 'guard', priority: 0});
  }
  for (const gd of golds) if (!gd.taken && !gd.held) items.push({x: gd.c + .5, y: gd.r + .5, color: '#ffd23f', kind: 'gold', priority: 1});
  for (const tr of treasures) if (!tr.taken) items.push({x: tr.c + .5, y: tr.r + .5, color: '#43e0d4', kind: 'treasure', priority: 2});
  const shown = [];
  for (const item of items){
    const p = worldToMobileScreen(item.x, item.y);
    const on = p.x >= 12 && p.x <= screenW - 12 && p.y >= mobileView.hudH + 12 && p.y <= screenH - 12;
    if (on) continue;
    const cx = clamp(p.x, 16, screenW - 16);
    const cy = clamp(p.y, mobileView.hudH + 18, screenH - 18);
    const dist = player ? Math.hypot(item.x - player.x, item.y - player.y) : 0;
    shown.push({...item, cx, cy, dist});
  }
  shown.sort((a, b) => a.priority - b.priority || a.dist - b.dist);
  ctx.save();
  ctx.globalAlpha = .92;
  for (const item of shown.slice(0, 10)){
    ctx.fillStyle = 'rgba(5,7,12,.68)';
    ctx.beginPath(); ctx.arc(item.cx, item.cy, item.kind === 'guard' ? 9 : 7, 0, Math.PI * 2); ctx.fill();
    if (item.kind === 'guard'){
      ctx.fillStyle = item.color;
      ctx.beginPath(); ctx.moveTo(item.cx, item.cy - 7); ctx.lineTo(item.cx + 7, item.cy + 6); ctx.lineTo(item.cx - 7, item.cy + 6); ctx.closePath(); ctx.fill();
      if (item.dist < 4.5){
        ctx.strokeStyle = 'rgba(255,255,255,.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(item.cx, item.cy, 12 + Math.sin(gameTime * 8) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#08050e';
      ctx.font = '900 9px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon, item.cx, item.cy + 1);
      if (item.dist < 6){
        const labelY = item.cy + (item.cy < mobileView.hudH + 42 ? 18 : -16);
        ctx.fillStyle = 'rgba(5,7,12,.72)';
        ctx.fillRect(item.cx - 25, labelY - 7, 50, 13);
        ctx.fillStyle = item.color;
        ctx.font = '900 8px system-ui, sans-serif';
        ctx.fillText(item.label, item.cx, labelY);
      }
    } else if (item.kind === 'gold') {
      drawGemIcon(item.cx, item.cy, 6, item.color);
    } else {
      ctx.fillStyle = item.color;
      ctx.fillRect(item.cx - 4, item.cy - 4, 8, 8);
    }
  }
  ctx.restore();
}
function renderMobileCamera(){
  ensureWorldCanvas();
  const oldCtx = ctx;
  ctx = worldCx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  renderWorldFrame(false);
  ctx = oldCtx;

  ctx.clearRect(0, 0, screenW, screenH);
  ctx.imageSmoothingEnabled = true;
  if (state === 'title'){
    const cover = Math.max(screenW / VIEW_W, screenH / VIEW_H);
    const dw = VIEW_W * cover, dh = VIEW_H * cover;
    ctx.drawImage(worldCv, (screenW - dw) / 2, (screenH - dh) / 2, dw, dh);
    return;
  }

  const hudH = mobileHudHeight();
  const playH = Math.max(1, screenH - hudH);
  const zoom = mobileCameraScale();
  const cam = updateMobileCamera(playH, zoom);
  mobileView = {x: cam.x, y: cam.y, w: cam.w, h: cam.h, hudH, playH};
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, hudH, screenW, playH);
  ctx.clip();
  ctx.drawImage(worldCv, cam.x, cam.y, cam.w, cam.h, 0, hudH, screenW, playH);
  ctx.restore();

  if (state === 'paused'){
    ctx.fillStyle = 'rgba(8,5,14,.38)';
    ctx.fillRect(0, hudH, screenW, playH);
  }
  drawMobileRadar();
  drawMobileAwareness();
  drawMobileHUD();
}
function render(){
  ctx = mainCtx;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (mobileCamera) renderMobileCamera();
  else renderWorldFrame(true);
}

/* ================= QA Mine (debug-only polish loop checks) ================= */
function canvasHealth(){
  render();
  const w = canvas.width | 0, h = canvas.height | 0;
  if (!w || !h) return {ok: false, why: 'canvas has zero size', w, h, nonzero: 0, samples: 0};
  let data;
  try { data = mainCtx.getImageData(0, 0, w, h).data; }
  catch (e) { return {ok: false, why: 'canvas read failed: ' + e.message, w, h, nonzero: 0, samples: 0}; }
  let nonzero = 0, samples = 0;
  const stride = Math.max(4, Math.floor(data.length / 24000) & ~3);
  for (let i = 0; i < data.length; i += stride){
    samples++;
    if (data[i] || data[i + 1] || data[i + 2] || data[i + 3]) nonzero++;
  }
  const ratio = samples ? nonzero / samples : 0;
  return {ok: ratio > 0.05, why: ratio > 0.05 ? '' : 'canvas appears blank', w, h, nonzero, samples, ratio};
}

function qaMine(options){
  const opts = options || {};
  const startT = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const result = {
    ok: true,
    version: document.querySelector('.version')?.textContent || '',
    dailyDates: opts.dailyDates || [LEVELS.dailyDateUTC()],
    totals: {passed: 0, failed: 0},
    cases: [],
  };
  const mark = (group, name, details) => {
    const d = details || {};
    const ok = d.ok !== false;
    result.cases.push({group, name, ok, ...d});
    result.totals[ok ? 'passed' : 'failed']++;
    if (!ok) result.ok = false;
  };
  const runCase = (group, name, setup, solver) => {
    try {
      setup();
      state = 'playing';
      hideOverlays();
      clearSoftlock();
      if (!grid.length || !player) throw new Error('level did not load');
      stepWorldForQa();
      const solved = solver ? solver() : {ok: true};
      const renderCheck = canvasHealth();
      const wayOut = currentNoWayOutReason();
      const details = {
        ok: !!solved.ok && renderCheck.ok && !wayOut,
        solver: solved,
        render: renderCheck,
        noWayOut: wayOut,
        mode,
        levelIndex,
        golds: golds.length,
        goldLeft,
        powerups: powerups.length,
        discoveries: discoveryTotal,
      };
      if (isSpecialMode()) details.cart = special && special.cart ? {c: special.cart.c, r: special.cart.r, ready: !!special.cartReady} : null;
      mark(group, name, details);
    } catch (e) {
      mark(group, name, {ok: false, error: e && e.stack ? e.stack : String(e)});
    }
  };
  const campaignCount = LEVELS.campaign.length;
  for (let i = 0; i < campaignCount; i++){
    runCase('campaign', 'Claim ' + (i + 1), () => { mode = 'campaign'; loadCampaignLevel(i); }, () => LEVELS.solvable(LEVELS.campaign[i]));
  }
  for (const date of result.dailyDates){
    runCase('daily', date, () => {
      const d = LEVELS.generateDaily(date);
      mode = 'daily'; dailyDate = d.date; levelIndex = 0; loadLevelData(d.rows);
    }, () => LEVELS.solvable(currentRows));
  }
  const specialLevels = LEVELS.special.levels || [{rows: LEVELS.special.rows, config: LEVELS.special.config || {}}];
  for (let i = 0; i < specialLevels.length; i++){
    runCase('boom', 'Boom Rush ' + (i + 1), () => { mode = 'special'; dailyDate = null; loadSpecialLevel(i); }, () => LEVELS.specialSolvable(specialLevels[i]));
  }
  state = 'title';
  showOnly('ovTitle');
  refreshTitleBoard();
  result.elapsedMs = Math.round(((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startT) * 10) / 10;
  return result;
}

function stepWorldForQa(){
  for (let i = 0; i < 8; i++){
    if (state === 'playing') update(TICK);
  }
  render();
}

function drawPit(c, r, dark, h){
  const x = c * TILE, y = r * TILE + HUD_H;
  const warn = h ? Math.max(0, (h.t - (HOLE_LIFE - HOLE_WARN)) / HOLE_WARN) : 0;
  const n = (c * 73856093 ^ r * 19349663 ^ levelIndex * 83492791) >>> 0;
  const topL = 3 + (n & 3), topR = TILE - 3 - ((n >> 3) & 3);
  const botR = TILE - 2 - ((n >> 6) & 3), botL = 2 + ((n >> 9) & 3);
  const midL = 1 + ((n >> 12) & 3), midR = TILE - 1 - ((n >> 15) & 3);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + topL, y + 5);
  ctx.quadraticCurveTo(x + TILE * .28, y - 1, x + TILE * .5, y + 3 + ((n >> 18) & 3));
  ctx.quadraticCurveTo(x + TILE * .76, y + 1, x + topR, y + 6);
  ctx.lineTo(x + midR, y + TILE * .55);
  ctx.quadraticCurveTo(x + botR, y + TILE - 2, x + TILE * .52, y + TILE - 1);
  ctx.quadraticCurveTo(x + TILE * .2, y + TILE - 3, x + botL, y + TILE * .72);
  ctx.lineTo(x + midL, y + TILE * .32);
  ctx.closePath();
  const pit = ctx.createLinearGradient(x, y, x, y + TILE);
  pit.addColorStop(0, 'rgba(35,22,17,' + (0.94 * dark) + ')');
  pit.addColorStop(0.45, 'rgba(11,8,12,' + (0.96 * dark) + ')');
  pit.addColorStop(1, 'rgba(0,0,0,' + dark + ')');
  ctx.fillStyle = pit;
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(18,10,6,' + (0.58 * dark) + ')';
  ctx.stroke();
  ctx.strokeStyle = 'rgba(214,151,82,' + (0.32 * dark) + ')';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + topL + 3, y + 7);
  ctx.quadraticCurveTo(x + TILE * .42, y + 2, x + topR - 4, y + 8);
  ctx.stroke();

  ctx.fillStyle = 'rgba(0,0,0,' + (0.34 * dark) + ')';
  ctx.beginPath();
  ctx.ellipse(x + TILE * .5, y + TILE * .62, TILE * .32, TILE * .2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(196,134,75,' + (0.42 * dark) + ')';
  for (let i = 0; i < 5; i++){
    const rx = x + 5 + ((n >> (i * 5)) % 27);
    const ry = y + 4 + ((n >> (i * 4 + 2)) % 27);
    ctx.fillRect(rx, ry, 2 + (i & 1), 1 + (i % 3 === 0 ? 2 : 1));
  }

  if (warn > 0){
    const tremble = Math.sin(h.t * 34) * 1.2;
    const pulse = 0.55 + 0.45 * Math.sin(gameTime * (12 + warn * 10));
    ctx.globalAlpha = Math.min(.72, warn * (.5 + pulse * .35));
    ctx.strokeStyle = 'rgba(255,190,70,.78)';
    ctx.lineWidth = 1.2 + warn * 2;
    ctx.beginPath();
    ctx.moveTo(x + topL + tremble, y + 7);
    ctx.quadraticCurveTo(x + TILE * .5, y + 1 - warn * 2, x + topR - tremble, y + 8);
    ctx.stroke();
    ctx.fillStyle = '#7d5230';
    const m = 5 + warn * 10;
    ctx.fillRect(x + 4 + tremble, y + TILE - m, TILE - 8, m * .5);
    ctx.fillRect(x + 8 - tremble, y + 5 + warn * 2, TILE - 16, 3 + warn * 2);
    ctx.fillStyle = 'rgba(255,210,105,.8)';
    for (let i = 0; i < 3; i++){
      const rx = x + 9 + ((n >> (i * 6 + 3)) % 18) + tremble * (i - 1);
      ctx.fillRect(rx, y + 6 + i * 7 + pulse * 2, 3, 2);
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function hexA(hex, a){
  // #rrggbb -> rgba()
  if (hex[0] !== '#') return hex;
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

// near foreground framing: soft top/bottom inner shadow + dark drooping foliage in the top corners
function drawForeground(){
  let g = ctx.createLinearGradient(0, HUD_H, 0, HUD_H + 55);
  g.addColorStop(0, 'rgba(4,3,10,.5)'); g.addColorStop(1, 'rgba(4,3,10,0)');
  ctx.fillStyle = g; ctx.fillRect(0, HUD_H, VIEW_W, 55);
  g = ctx.createLinearGradient(0, VIEW_H - 64, 0, VIEW_H);
  g.addColorStop(0, 'rgba(4,3,10,0)'); g.addColorStop(1, 'rgba(4,3,10,.5)');
  ctx.fillStyle = g; ctx.fillRect(0, VIEW_H - 64, VIEW_W, 64);
  // drooping leaf clusters in the two top corners
  const cluster = (ox, dir) => {
    ctx.fillStyle = 'rgba(10,20,12,.92)';
    for (let i = 0; i < 9; i++){
      const ang = dir * (0.15 + i * 0.16), len = 26 + (i % 3) * 20;
      const lx = ox + Math.cos(ang) * len * dir, ly = HUD_H + 2 + Math.sin(ang) * len + (i % 2) * 6;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang * dir); ctx.beginPath(); ctx.ellipse(0, 0, 20, 8, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = 'rgba(10,20,12,.92)'; ctx.fillRect(ox - 6 * dir, HUD_H, 12, 26);
  };
  // don't let foliage hide the revealed exit (exits live in a top corner)
  const exC = exitRevealed && exitCells.length ? exitCells[0].c : -1;
  if (!(exC >= 0 && exC < COLS / 2)) cluster(8, 1);
  if (!(exC >= COLS / 2)) cluster(VIEW_W - 8, -1);
}

function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawHeart(cx, cy, s, filled){
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 18, s / 18);
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-2, -3, -10, -3, -10, 3.5);
  ctx.bezierCurveTo(-10, 9, -2, 13, 0, 16);
  ctx.bezierCurveTo(2, 13, 10, 9, 10, 3.5);
  ctx.bezierCurveTo(10, -3, 2, -3, 0, 5);
  ctx.closePath();
  if (filled){ ctx.fillStyle = '#ff4f6b'; ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-4, 1, 2.4, 1.6, -0.5, 0, 7); ctx.fill(); }
  else { ctx.strokeStyle = 'rgba(255,120,140,.45)'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}
function drawGemIcon(cx, cy, s, col){
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s * .8, cy - s * .2); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s * .8, cy - s * .2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(cx - s * .3, cy - s * .5, s * .3, 2);
}
function drawGoldGem(cx, cy, s, phase){
  const shimmer = 0.5 + 0.5 * Math.sin((phase || 0) * 2.4);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin((phase || 0) * 0.7) * 0.08);
  ctx.globalCompositeOperation = 'lighter';
  const glowG = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.55);
  glowG.addColorStop(0, 'rgba(255,232,118,.38)');
  glowG.addColorStop(1, 'rgba(255,190,32,0)');
  ctx.fillStyle = glowG;
  ctx.beginPath(); ctx.arc(0, 0, s * 1.55, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle = 'rgba(0,0,0,.34)';
  ctx.beginPath(); ctx.ellipse(0, s * .82, s * .74, s * .18, 0, 0, Math.PI * 2); ctx.fill();

  const pts = [
    [0, -s], [s * .72, -s * .42], [s * .86, s * .18],
    [s * .18, s * .95], [-s * .58, s * .55], [-s * .82, -s * .25],
  ];
  ctx.strokeStyle = 'rgba(82,47,7,.72)';
  ctx.lineWidth = Math.max(1, s * .09);
  ctx.fillStyle = '#d99716';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  const facet = (poly, color) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath(); ctx.fill();
  };
  facet([[0, -s], [s * .72, -s * .42], [s * .12, -s * .15], [-s * .16, -s * .32]], '#fff0a4');
  facet([[-s * .82, -s * .25], [-s * .16, -s * .32], [0, s * .16], [-s * .58, s * .55]], '#f0b42d');
  facet([[s * .72, -s * .42], [s * .86, s * .18], [s * .18, s * .95], [0, s * .16], [s * .12, -s * .15]], '#c77410');
  facet([[-s * .58, s * .55], [0, s * .16], [s * .18, s * .95]], '#8f510b');
  facet([[-s * .16, -s * .32], [s * .12, -s * .15], [0, s * .16]], '#ffd84e');

  ctx.strokeStyle = 'rgba(255,255,230,.62)';
  ctx.lineWidth = Math.max(1, s * .07);
  ctx.beginPath();
  ctx.moveTo(-s * .34, -s * .2); ctx.lineTo(-s * .05, -s * .48);
  ctx.moveTo(s * .18, -s * .58); ctx.lineTo(s * .42, -s * .42);
  ctx.stroke();
  if (shimmer > .72){
    ctx.globalAlpha = (shimmer - .72) / .28;
    ctx.strokeStyle = '#fffbe8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s * .5, -s * .72); ctx.lineTo(s * .5, -s * .34);
    ctx.moveTo(s * .31, -s * .53); ctx.lineTo(s * .69, -s * .53);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawSpecialNuggets(){
  if (!specialNuggets.length) return;
  for (const n of specialNuggets){
    const a = clamp(n.life / 10, .18, 1);
    ctx.globalAlpha = a;
    drawGoldGem(px(n.x), py(n.y), 7 + n.r * 14, n.spin + gameTime);
  }
  ctx.globalAlpha = 1;
}

function drawSpecialRockWarnings(){
  if (!specialRockWarnings.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const w of specialRockWarnings){
    const p = clamp(1 - w.t / w.dur, 0, 1);
    const pulse = .5 + .5 * Math.sin(gameTime * 28 + w.c);
    const x = px(w.x), top = HUD_H + 3;
    const colX = px(w.c + .5);
    ctx.globalAlpha = .18 + p * .32;
    const lane = ctx.createLinearGradient(0, HUD_H, 0, HUD_H + TILE * 4.8);
    lane.addColorStop(0, 'rgba(255,207,122,.55)');
    lane.addColorStop(.45, 'rgba(211,161,93,.18)');
    lane.addColorStop(1, 'rgba(211,161,93,0)');
    ctx.fillStyle = lane;
    ctx.fillRect(colX - TILE * .42, HUD_H, TILE * .84, TILE * 4.8);

    ctx.globalAlpha = .55 + pulse * .35;
    ctx.strokeStyle = '#ffcf7a';
    ctx.lineWidth = 2.5 + p * 1.4;
    ctx.beginPath();
    ctx.moveTo(x - 17, top + 6);
    ctx.lineTo(x - 8, top + 1 + pulse * 2);
    ctx.lineTo(x + 1, top + 7);
    ctx.lineTo(x + 12, top + 2);
    ctx.lineTo(x + 21, top + 8);
    ctx.stroke();

    ctx.globalAlpha = .72 + pulse * .2;
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.moveTo(x, top + 12);
    ctx.lineTo(x - 9, top + 30);
    ctx.lineTo(x + 9, top + 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#8a6038';
    ctx.fillRect(x - 1.5, top + 17, 3, 8);
    ctx.fillRect(x - 1.5, top + 27, 3, 3);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

function drawSpecialRocks(){
  if (!specialRocks.length) return;
  ctx.save();
  for (const rock of specialRocks){
    const x = px(rock.x), y = py(rock.y), s = rock.size * TILE;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rock.rot);
    const g = ctx.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, '#c99557');
    g.addColorStop(.42, '#70503a');
    g.addColorStop(1, '#21150f');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-s * .8, -s * .35);
    ctx.lineTo(-s * .1, -s * .9);
    ctx.lineTo(s * .75, -s * .52);
    ctx.lineTo(s * .88, s * .24);
    ctx.lineTo(s * .16, s * .82);
    ctx.lineTo(-s * .7, s * .58);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,150,.28)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,235,180,.18)';
    ctx.fillRect(-s * .32, -s * .52, s * .38, 2);
    ctx.restore();
  }
  ctx.restore();
}

function drawMineCart(){
  if (!special) return;
  const ready = special.cartReady || exitRevealed;
  const escape = special.escapeT > 0 ? 1 - special.escapeT / special.escapeDur : 0;
  const baseX = special.cart.x + escape * (special.escapeDist || 4.5);
  const baseY = special.cart.y;
  const x = px(baseX), y = py(baseY) + 4 + Math.sin(gameTime * 18) * escape * 2;
  const glowA = ready ? .34 + .18 * Math.sin(gameTime * 7) : .1;
  glow(baseX, baseY, ready ? 64 : 34, 'rgba(255,190,64,' + glowA + ')', 1);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 34, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  const body = ctx.createLinearGradient(0, -18, 0, 14);
  body.addColorStop(0, ready ? '#d9a457' : '#7d6040');
  body.addColorStop(.45, '#5c3b24');
  body.addColorStop(1, '#1b1410');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-34, -10);
  ctx.lineTo(34, -10);
  ctx.lineTo(25, 12);
  ctx.lineTo(-24, 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ready ? 'rgba(255,235,160,.78)' : 'rgba(220,170,95,.32)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = ready ? '#ffd23f' : '#8a6038';
  for (let i = -2; i <= 2; i++) drawGoldGem(i * 9, -15 - Math.abs(i) * 2 + Math.sin(gameTime * 5 + i) * 1.5, 6, gameTime + i);
  ctx.fillStyle = '#111';
  for (const wx of [-21, 21]){
    ctx.beginPath(); ctx.arc(wx, 15, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ready ? '#ff9d2e' : '#54402e';
    ctx.beginPath(); ctx.arc(wx, 15, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
  }
  if (ready){
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(63,210,199,.76)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -6, 42 + Math.sin(gameTime * 6) * 4, -.4, Math.PI + .5); ctx.stroke();
    if (escape > 0){
      ctx.strokeStyle = 'rgba(255,210,63,.72)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-62, 21);
      ctx.lineTo(64, 21 + Math.sin(gameTime * 32) * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,157,46,.7)';
      for (let i = 0; i < 7; i++){
        const sx = -54 + i * 18 - escape * 22;
        ctx.fillRect(sx, 23 + Math.sin(gameTime * 18 + i) * 2, 9, 2);
      }
    }
    ctx.fillStyle = '#fff3b0';
    ctx.font = '900 10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RIDE OUT', 0, -32);
  }
  ctx.restore();
}

function drawSpecialSetpieces(){
  if (!special) return;
  ctx.save();
  for (const lava of special.lava || []){
    const x = lava.c0 * TILE, y = lava.r * TILE + HUD_H;
    const w = (lava.c1 - lava.c0 + 1) * TILE;
    const g = ctx.createLinearGradient(0, y, 0, y + TILE);
    g.addColorStop(0, 'rgba(255,210,63,.42)');
    g.addColorStop(.35, 'rgba(255,93,30,.85)');
    g.addColorStop(1, 'rgba(80,12,4,.92)');
    ctx.fillStyle = g;
    roundRect(x + 4, y + 8, w - 8, TILE - 12, 9);
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++){
      const bx = x + 8 + ((i * 31 + gameTime * 46) % Math.max(1, w - 16));
      const by = y + 18 + Math.sin(gameTime * 5 + i) * 5;
      glow(bx / TILE, (by - HUD_H) / TILE, 18, 'rgba(255,95,28,.45)', 1);
      ctx.fillStyle = '#fff3b0';
      ctx.globalAlpha = .35 + .35 * Math.sin(gameTime * 8 + i);
      ctx.fillRect(bx, by, 3, 3);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  for (const plate of special.plates || []){
    const x = plate.c * TILE + 8, y = plate.r * TILE + HUD_H + 25;
    ctx.fillStyle = plate.used ? 'rgba(255,157,46,.45)' : 'rgba(63,210,199,.72)';
    ctx.strokeStyle = plate.used ? 'rgba(255,216,107,.5)' : 'rgba(207,255,245,.9)';
    roundRect(x, y, TILE - 16, 8, 4);
    ctx.fill();
    ctx.stroke();
    if (!plate.used) glow(plate.c + .5, plate.r + .75, 25, 'rgba(63,210,199,.25)', 1);
  }
  for (const vent of special.vents || []){
    const x = px(vent.x), y = py(vent.y);
    ctx.fillStyle = '#22170f';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,216,107,.55)';
    ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i++){
      ctx.beginPath();
      ctx.moveTo(x + i * 7, y + 2);
      ctx.lineTo(x + i * 7 + Math.sin(gameTime * 6 + i) * 4, y - 18 - Math.max(0, 2.4 - vent.t) * 5);
      ctx.stroke();
    }
  }
  for (const cr of special.crushers || []){
    const p = cr.t > 1.52 && cr.t < 2.02 ? 1 : cr.t < 1.52 ? cr.t / 1.52 : Math.max(0, 1 - (cr.t - 2.02) / .58);
    const x = cr.c * TILE + 18, y = cr.r * TILE + HUD_H;
    ctx.strokeStyle = '#4b3426';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, y - 38); ctx.lineTo(x, y + p * 48); ctx.stroke();
    const headY = y + p * 48;
    const g = ctx.createLinearGradient(x - 18, headY - 8, x + 18, headY + 18);
    g.addColorStop(0, '#d3a15d'); g.addColorStop(.5, '#70503a'); g.addColorStop(1, '#21150f');
    ctx.fillStyle = g;
    roundRect(x - 18, headY, 36, 18, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,150,.42)';
    ctx.stroke();
  }
  const w = special.worm;
  if (w && !w.active && w.warnT > 0){
    const y = py(w.y);
    const pulse = 0.45 + 0.35 * Math.sin(gameTime * 18);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,93,48,' + pulse + ')';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VIEW_W, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,243,176,.9)';
    ctx.font = '900 11px system-ui, sans-serif';
    ctx.textAlign = w.dir > 0 ? 'left' : 'right';
    ctx.fillText('DRILL WORM INCOMING', w.dir > 0 ? 16 : VIEW_W - 16, y - 12);
    ctx.restore();
  }
  if (w && w.active){
    ctx.save();
    ctx.translate(px(w.x), py(w.y));
    if (w.dir < 0) ctx.scale(-1, 1);
    for (let i = 0; i < 7; i++){
      const bx = -i * 14;
      const by = Math.sin(gameTime * 12 + i) * 4;
      const seg = ctx.createLinearGradient(bx - 11, by - 11, bx + 11, by + 11);
      seg.addColorStop(0, '#ffb84a');
      seg.addColorStop(.5, '#9b4a25');
      seg.addColorStop(1, '#2a120b');
      ctx.fillStyle = seg;
      ctx.beginPath();
      ctx.ellipse(bx, by, 16 - i * .8, 11 - i * .45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,230,150,.28)';
      ctx.stroke();
    }
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.moveTo(20, 0); ctx.lineTo(0, -14); ctx.lineTo(4, 0); ctx.lineTo(0, 14); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#130905';
    ctx.beginPath(); ctx.arc(3, -5, 2.5, 0, Math.PI * 2); ctx.arc(3, 5, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawHotbar(){
  if (!player) return;
  const slots = [];
  if (player.tnt > 0) slots.push({icon: ART.PUPS[1], badge: '×' + player.tnt, col: '#ff5c33', ratio: 1});
  if (player.speedT > 0) slots.push({icon: ART.PUPS[2], col: '#3fd2c7', ratio: player.speedT / 8});
  if (player.cloakT > 0) slots.push({icon: ART.PUPS[3], col: '#b07fff', ratio: player.cloakT / 6});
  if (player.magnetT > 0) slots.push({icon: ART.PUPS[4], col: '#ffd23f', ratio: player.magnetT / 8});
  if (player.shovelT > 0) slots.push({icon: ART.PUPS[5], col: '#7fd24a', ratio: player.shovelT / 10});
  if (!slots.length) return;
  const sw = 44, gap = 8, totalW = slots.length * sw + (slots.length - 1) * gap;
  let sx = (VIEW_W - totalW) / 2; const sy = VIEW_H - sw - 12;
  for (const s of slots){
    roundRect(sx, sy, sw, sw, 8); ctx.fillStyle = 'rgba(14,10,20,.82)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = s.col; ctx.stroke();
    ctx.drawImage(s.icon, sx + 10, sy + 7, 24, 24);
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(sx + 6, sy + sw - 9, sw - 12, 4);
    ctx.fillStyle = s.col; ctx.fillRect(sx + 6, sy + sw - 9, (sw - 12) * Math.min(1, s.ratio), 4);
    if (s.badge){ ctx.fillStyle = '#fff'; ctx.font = '800 12px Consolas, monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic'; ctx.fillText(s.badge, sx + sw - 5, sy + 15); }
    sx += sw + gap;
  }
}

function panelBox(x, y, w, h, title){
  ctx.save();
  roundRect(x, y, w, h, 10);
  ctx.fillStyle = 'rgba(8,10,18,.78)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255,214,110,.55)';
  ctx.stroke();
  const shine = ctx.createLinearGradient(x, y, x, y + h);
  shine.addColorStop(0, 'rgba(255,230,150,.13)');
  shine.addColorStop(.45, 'rgba(70,190,220,.04)');
  shine.addColorStop(1, 'rgba(0,0,0,.2)');
  roundRect(x + 1, y + 1, w - 2, h - 2, 9);
  ctx.fillStyle = shine;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,214,110,.85)';
  ctx.fillRect(x + 11, y + 8, 22, 2);
  ctx.fillRect(x + w - 33, y + 8, 22, 2);
  if (title){
    ctx.font = '900 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffd86b';
    ctx.fillText(title, x + 14, y + 24);
  }
  ctx.restore();
}

function drawPlayerPortrait(x, y){
  panelBox(x, y, 74, 62, '');
  ctx.save();
  ctx.beginPath();
  roundRect(x + 8, y + 8, 50, 46, 8);
  ctx.clip();
  const pg = ctx.createLinearGradient(x, y, x, y + 60);
  pg.addColorStop(0, '#193d53');
  pg.addColorStop(1, '#0d1424');
  ctx.fillStyle = pg;
  ctx.fillRect(x + 8, y + 8, 50, 46);
  ctx.globalCompositeOperation = 'lighter';
  glow((x + 35) / TILE, (y + 35 - HUD_H) / TILE, 34, 'rgba(255,190,95,.35)', 1);
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  if (painterlyMinerReady && painterlyMiner.naturalWidth){
    const cellW = painterlyMiner.naturalWidth / MINER_SHEET.cols;
    const cellH = painterlyMiner.naturalHeight / MINER_SHEET.rows;
    ctx.drawImage(painterlyMiner, 0, 0, cellW, cellH, x + 2, y + 2, 64, 52);
  } else {
    ctx.drawImage(ART.frames.player.idle[0], x + 16, y + 6, 35, 50);
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,216,107,.75)';
  ctx.lineWidth = 2;
  roundRect(x + 8, y + 8, 50, 46, 8);
  ctx.stroke();
}

function objectiveRows(){
  const total = golds.length, got = total - goldLeft;
  const exitLabel = isSpecialMode() ? 'CART' : 'EXIT';
  const exitValue = isSpecialMode()
    ? (specialCartReady() ? 'READY' : 'LOCKED')
    : (exitRevealed ? 'OPEN' : 'LOCKED');
  return [
    {label: 'GOLD', value: got + '/' + total, done: goldLeft <= 0, col: '#ffd23f'},
    {label: 'FINDS', value: discoveryCount + '/' + discoveryTotal, done: discoveryTotal && discoveryCount >= discoveryTotal, col: '#9ef0c8'},
    {label: exitLabel, value: exitValue, done: exitRevealed, col: '#3fd2c7'},
  ];
}
function drawObjectiveStrip(){
  if (!grid.length) return;
  const rows = objectiveRows();
  const widths = [96, 104, 118], gap = 8;
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  let x = (VIEW_W - totalW) / 2, y = HUD_H - 20;
  ctx.save();
  ctx.font = '900 10px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < rows.length; i++){
    const it = rows[i], w = widths[i];
    roundRect(x, y, w, 15, 5);
    ctx.fillStyle = 'rgba(8,10,18,.58)';
    ctx.fill();
    ctx.strokeStyle = it.done ? it.col : 'rgba(255,214,110,.32)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = it.done ? it.col : 'rgba(220,230,245,.72)';
    ctx.beginPath(); ctx.arc(x + 9, y + 7.5, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5eddd';
    ctx.textAlign = 'left';
    ctx.fillText(it.label, x + 17, y + 8);
    ctx.fillStyle = it.col;
    ctx.textAlign = 'right';
    ctx.fillText(it.value, x + w - 7, y + 8);
    x += w + gap;
  }
  ctx.restore();
}

function drawMiniMapPanel(){
  if (!grid.length) return;
  const w = 166, h = 88, x = VIEW_W - w - 14, y = HUD_H + 16;
  panelBox(x, y, w, h, 'CLAIM MAP');
  const mx = x + 13, my = y + 32, mw = w - 26, mh = h - 44;
  ctx.fillStyle = 'rgba(5,18,32,.72)';
  roundRect(mx, my, mw, mh, 5);
  ctx.fill();
  const sx = mw / COLS, sy = mh / ROWS;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
    const t = grid[r][c];
    if (t === '.' || t === 'T') continue;
    ctx.fillStyle = (t === 'H' || t === 'E') ? 'rgba(255,190,80,.75)' :
      (t === '-' ? 'rgba(135,230,220,.65)' : 'rgba(64,172,220,.7)');
    ctx.fillRect(mx + c * sx, my + r * sy, Math.max(1, sx), Math.max(1, sy));
  }
  for (const gd of golds) if (!gd.taken && !gd.held){
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(mx + gd.c * sx - 1, my + gd.r * sy - 1, 3, 3);
  }
  if (player){
    ctx.fillStyle = '#ff9d2e';
    ctx.fillRect(mx + player.x * sx - 2, my + player.y * sy - 2, 4, 4);
  }
  if (exitCells.length){
    const e = topExitCell();
    ctx.fillStyle = exitRevealed ? '#3fd2c7' : 'rgba(63,210,199,.35)';
    ctx.fillRect(mx + e.c * sx - 2, my + e.r * sy - 2, 4, 4);
  }
}

function drawHUD(){
  // framed top panel
  const g = ctx.createLinearGradient(0, 0, 0, HUD_H);
  g.addColorStop(0, 'rgba(18,16,26,.96)'); g.addColorStop(.52, 'rgba(8,14,24,.88)'); g.addColorStop(1, 'rgba(6,8,14,.76)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW_W, HUD_H);
  ctx.fillStyle = 'rgba(255,210,63,.46)'; ctx.fillRect(0, HUD_H - 3, VIEW_W, 2);
  ctx.fillStyle = 'rgba(255,210,63,.1)'; ctx.fillRect(0, 0, VIEW_W, 1);
  const cy = HUD_H / 2;
  ctx.textBaseline = 'middle';

  // lives as hearts
  drawPlayerPortrait(10, 5);
  let hx = 94;
  for (let i = 0, n = Math.min(lives, MAX_LIVES); i < n; i++){ drawHeart(hx + 8, 23, 18, true); hx += 24; }
  hx = 96;

  // gold counter with gem icon
  if (grid.length){
    const total = golds.length, got = total - goldLeft;
    drawGemIcon(hx + 9, 50, 8, '#ffd23f');
    ctx.fillStyle = '#ffe98a'; ctx.font = '900 16px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(got + '/' + total, hx + 22, 51);
    if (discoveryTotal){
      hx += 82;
      const pulse = discoveryPulse > 0 ? 1 + discoveryPulse * .28 : 1;
      ctx.save(); ctx.translate(hx + 9, 50); ctx.scale(pulse, pulse);
      ctx.fillStyle = '#9ef0c8'; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(7, 0); ctx.lineTo(0, 8); ctx.lineTo(-7, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-2, -5, 2, 5);
      ctx.restore();
      ctx.fillStyle = '#d9f7ee'; ctx.font = '900 16px system-ui, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(discoveryCount + '/' + discoveryTotal, hx + 22, 51);
    }
  }

  // centre score
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,216,107,.9)'; ctx.font = '900 11px system-ui, sans-serif'; ctx.fillText('SCORE', VIEW_W / 2, 13);
  ctx.fillStyle = '#fff'; ctx.font = '900 26px system-ui, sans-serif'; ctx.fillText(String(score).padStart(6, '0'), VIEW_W / 2, 36);
  drawObjectiveStrip();

  // right: time / daily, escape flag
  ctx.textAlign = 'right';
  const tt = Math.max(0, levelTime | 0), mm = String((tt / 60) | 0).padStart(2, '0'), ss = String(tt % 60).padStart(2, '0');
  ctx.fillStyle = 'rgba(216,207,228,.66)'; ctx.font = '900 12px system-ui, sans-serif'; ctx.fillText(mode === 'daily' ? ('DAILY ' + (dailyDate || '')) : 'TIME', VIEW_W - 18, 18);
  ctx.fillStyle = '#f6f0ff'; ctx.font = '900 24px system-ui, sans-serif'; ctx.fillText(mm + ':' + ss, VIEW_W - 18, 48);

  // escape indicator when exit open
  if (grid.length && exitRevealed){
    ctx.textAlign = 'center'; ctx.fillStyle = '#3fd2c7'; ctx.font = '900 13px system-ui, sans-serif';
    ctx.fillText('▲ ESCAPE', VIEW_W / 2 - 120, cy + 1);
  }
  // combo badge
  if (comboN > 1){
    ctx.textAlign = 'center'; ctx.fillStyle = '#ff9d2e'; ctx.font = '900 13px system-ui, sans-serif';
    ctx.fillText('COMBO ×' + comboMult().toFixed(1).replace('.0', ''), VIEW_W / 2 + 120, cy + 1);
  }
  if (oilLightT > 0){
    ctx.textAlign = 'center'; ctx.fillStyle = '#f1b34e'; ctx.font = '900 12px system-ui, sans-serif';
    ctx.fillText('LANTERN +' + Math.ceil(oilLightT), VIEW_W / 2 + 230, cy + 1);
  }
  if (special){
    ctx.textAlign = 'center';
    const cave = special.caveT == null ? 'DORMANT' : Math.ceil(special.caveT) + 's';
    const danger = special.caveT != null && special.caveT < 16;
    ctx.fillStyle = danger ? '#ff6b5a' : '#ff9d2e';
    ctx.font = '900 12px system-ui, sans-serif';
    ctx.fillText('CAVE-IN ' + cave, VIEW_W / 2 + 320, cy + 1);
    const drillReady = !player || (player.drillCd || 0) <= 0;
    ctx.fillStyle = drillReady ? '#3fd2c7' : 'rgba(216,207,228,.78)';
    ctx.fillText(drillReady ? 'DRILL READY' : 'DRILL ' + Math.ceil((player.drillCd || 0) * 10) / 10, VIEW_W / 2 - 235, cy + 1);
  }
  drawHotbar();
  drawMiniMapPanel();
}

/* ================= fixed-timestep loop ================= */
let last = 0, acc = 0, clock = 0;
function frame(t){
  requestAnimationFrame(frame);
  document.body.classList.toggle('playing', state === 'playing');
  if (canvas.width === 0 || canvas.height === 0) resize(); // recover from a 0-size boot
  const dt = Math.min((t - last) / 1000, .25); last = t;
  clock += dt;  // purely-visual clock; advances even when the sim is paused (title/menus)
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
  get treasures(){ return treasures; },
  get discoveries(){ return {count: discoveryCount, total: discoveryTotal, oilLightT}; },
  get goldLeft(){ return goldLeft; },
  get holes(){ return [...holes.values()]; },
  get exitRevealed(){ return exitRevealed; },
  grid: () => grid.map(r => r.join('')),
  keys,
  start: startGame,
  step(n){ for (let i = 0; i < (n || 1); i++) if (state === 'playing') update(TICK); render(); return true; },
  snap(){ render(); return true; },
  input(code, down){ keys[code] = !!down; },
  loadLevel(i){ mode = 'campaign'; loadCampaignLevel(i); state = 'playing'; hideOverlays(); return grid.length === ROWS; },
  loadSpecial(i){ mode = 'special'; loadSpecialLevel(i); state = 'playing'; hideOverlays(); return grid.length === ROWS; },
  dig(dir){ return tryDig(dir < 0 ? -1 : 1); },
  kill(){ killPlayer('debug'); },
  give(kind){ applyPowerup(kind); },
  get powerups(){ return powerups; },
  get fuses(){ return fuses; },
  get blasted(){ return [...blasted]; },
  get special(){ return special ? {...special, nuggets: specialNuggets.length, rocks: specialRocks.length, rockWarnings: specialRockWarnings.length} : null; },
  get combo(){ return {n: comboN, t: comboT, mult: comboMult()}; },
  boom(c, r){ boom(c, r); },
  get levelTime(){ return levelTime; },
  get dailyDate(){ return dailyDate; },
  get backdrop(){ return painterlyPlateSrc; },
  get glowCacheSize(){ return glowCacheKeys.length; },
  noWayOut(){ return currentNoWayOutReason(); },
  showNoWayOut(reason){ showSoftlock(reason || currentNoWayOutReason() || 'This claim cannot be completed from here.'); return state; },
  hunch(){ return triggerRouteHint(true); },
  get hunchState(){ return routeHint ? {...routeHint} : null; },
  get wavePreview(){ return wavePreview ? {...wavePreview} : null; },
  get lastNuggetCue(){ return lastNuggetCueTargets(); },
  get mobileZoom(){ return mobileZoomAdjust; },
  get mobileView(){ return mobileView ? {...mobileView} : null; },
  set mobileZoom(v){ mobileZoomAdjust = clamp(Number(v) || 1, 0.68, 1.45); },
  seedDaily(dateStr){
    const d = LEVELS.generateDaily(dateStr);
    mode = 'daily'; dailyDate = d.date; score = 0; lives = START_LIVES;
    loadLevelData(d.rows);
    state = 'playing'; hideOverlays();
    return {date: d.date, attempt: d.attempt};
  },
  solvable(rows){ return LEVELS.solvable(rows || currentRows); },
  specialSolvable(i){ const levels = LEVELS.special.levels || [LEVELS.special]; return LEVELS.specialSolvable(levels[i == null ? levelIndex : i]); },
  qaMine,
  startAt: startCampaignAt,
  startSpecial(){ startGame('special'); return {mode, state, golds: golds.length, special: !!special}; },
  scores: () => Scores,
};

if (new URLSearchParams(location.search).has('autoplay')){
  setTimeout(() => { try { startGame('campaign'); } catch (e) { console.error(e); } }, 80);
}
