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
  return mobileCamera || viewScale < 0.78 || matchMedia('(pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
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

function key(c, r){ return c + ',' + r; }

function parseLevel(rows){
  if (!Array.isArray(rows) || rows.length !== ROWS)
    throw new Error('level must have ' + ROWS + ' rows, got ' + (rows && rows.length));
  grid = []; golds = []; powerups = []; treasures = []; exitCells = [];
  guardSpawns = []; holes = new Map(); crumbles = new Map();
  blasted = new Set(); fuses = [];
  comboN = 0; comboT = 0;
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
function isBlasted(c, r){ return blasted.has(key(c, r)); }
// solid for standing-on (support from below)
function isSupportTile(c, r){
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return !isDug(c, r) && !isBlasted(c, r);
  if (t === 'C') return !isCrumbleGone(c, r) && !isBlasted(c, r);
  return t === 'X' || t === 'H' || t === '<' || t === '>' || (t === 'E' && exitRevealed);
  // note: 'T' trapdoor intentionally gives NO support
}
// can an entity's body occupy this cell?
function canOccupy(c, r){
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
  const t = tileAt(c, r);
  if (t === '#' || t === 'B') return isDug(c, r) || isBlasted(c, r);
  if (t === 'C') return isCrumbleGone(c, r) || isBlasted(c, r);
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
let gameTime = 0, shake = 0, hitStop = 0, flash = 0, deathFlash = 0;
let banner = null;          // {text, sub, life}
let hint = null;            // {life} first-level control hint
let runDustT = 0, digBuffer = 0, digBufDir = 0;
let titleRunner = null;     // attract-scene actor

/* ================= particles + floating text ================= */
let particles = [], popups = [];
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
}
function popup(wx, wy, text, color){ popups.push({x: wx, y: wy, text, color: color || '#ffd23f', life: 1.1}); }

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
  };
}

/* ================= movement (shared by player + guards) ================= */
const RUN_SPEED = 5.4, CLIMB_SPEED = 4.5, FALL_SPEED = 9.5;
const CENTER_EPS = 0.01;
const LADDER_GRAB_X = 0.62;

function clamp(v, lo, hi){ return v < lo ? lo : v > hi ? hi : v; }

function nearestLadderColumn(a, r){
  const base = Math.floor(a.x);
  let best = null, bestD = 99;
  for (let c = base - 1; c <= base + 1; c++){
    if (c < 0 || c >= COLS) continue;
    if (!isLadder(c, r) && !isLadder(c, r + 1)) continue;
    const d = Math.abs(a.x - (c + .5));
    if (d <= LADDER_GRAB_X && d < bestD){ best = c; bestD = d; }
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
    // rising: clamp at current cell center unless this cell is ladder with occupiable above
    if (!isLadder(c, r) || !canOccupy(c, r - 1)) ny = Math.max(ny, r + .5);
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
    const lc = nearestLadderColumn(a, r);
    const climbC = lc == null ? c : lc;
    const onLad = isLadder(climbC, r), ladBelow = isLadder(climbC, r + 1);
    const onBar = isBar(c, r);
    if (dyIn > 0 && onBar && !onLad && !isSupportTile(c, r + 1)){
      a.state = 'fall'; a.y += 0.02; a.anim = 0; a.fellFrom = a.y; return; // drop from bar
    }
    const canClimb = dyIn < 0
      ? (onLad || (ladBelow && a.y > r + .5 + CENTER_EPS))
      : (onLad || ladBelow);
    if (canClimb){
      a.x += (climbC + .5 - a.x) * Math.min(1, dt * 22);
      movedY = tryMoveY(a, dyIn * climb, climbC);
      if (movedY){
        a.x += (climbC + .5 - a.x) * Math.min(1, dt * 22); // hug the ladder
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
let levelTime = 0;
let currentRows = null;   // source rows of the live level (for clean restarts)

function tryDig(dir){
  if (!player || player.state === 'dead' || player.digT > 0) return false;
  if (player.state !== 'idle' && player.state !== 'run') return false;
  const c = Math.floor(player.x), r = Math.floor(player.y);
  if (Math.abs(player.y - (r + .5)) > 0.1) return false;
  if (!isSupportTile(c, r + 1) && !guardSupportAt(c, r + 1)) return false;
  const tc = c + dir, tr = r + 1;
  if (tileAt(tc, tr) !== '#' || isDug(tc, tr) || isBlasted(tc, tr)) return false;
  const above = tileAt(tc, r);
  if (above === '#' && !isDug(tc, r) && !isBlasted(tc, r)) return false;
  if (above === 'X') return false;
  if (above === 'B' && !isBlasted(tc, r)) return false;
  if (above === 'C' && !isCrumbleGone(tc, r) && !isBlasted(tc, r)) return false;
  player.dir = dir;
  if (player.tnt > 0){
    // TNT charge: instant 3-wide excavation
    player.tnt--;
    for (let k = -1; k <= 1; k++){
      const cc = tc + k;
      if (tileAt(cc, tr) === '#' && !isDug(cc, tr) && !isBlasted(cc, tr)) openHole(cc, tr);
    }
    shake = Math.max(shake, .5);
    return true;
  }
  player.digT = player.shovelT > 0 ? 0.05 : DIG_TIME;
  player.pendingDig = {c: tc, r: tr};
  return true;
}

function openHole(c, r){
  holes.set(key(c, r), {c, r, t: 0});
  shake = Math.max(shake, .25);
  spawnParticles(c + .5, r + .5, 10, {color: ['#7d5230', '#532f1a', '#a06e42'], spd: 3.5, life: .5, size: 3.5, grav: 30});
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

function updateHoles(dt){
  for (const h of [...holes.values()]){
    h.t += dt;
    if (h.t >= HOLE_LIFE){
      holes.delete(key(h.c, h.r));
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
const GUARD_SPEED = { guard: 0.8, scout: 1.06, mason: 0.62 };
const STUN_TIME = 3.2, GUARD_RESPAWN_T = 1.4;

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
    g.y -= CLIMB_SPEED * 0.7 * dt;
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
};

const TKINDS = {
  relic: {name: 'RELIC', color: '#fff0b8', score: 250},
  bloom: {name: 'BLOOM', color: '#9ef0c8', score: 125},
  map:   {name: 'MAP',   color: '#d8bf86', score: 175},
  oil:   {name: 'OIL',   color: '#f1b34e', score: 100},
};

function applyPowerup(kind){
  if (kind === 1) player.tnt = Math.min(3, (player.tnt || 0) + 1);
  else if (kind === 2) player.speedT = 8;
  else if (kind === 3) player.cloakT = 6;
  else if (kind === 4) player.magnetT = 8;
  else if (kind === 5) player.shovelT = 10;
  addScore(50);
  flash = Math.max(flash, .25);
  spawnParticles(player.x, player.y - .2, 12, {color: [ART.PAL ? '#fff' : '#fff', PKINDS[kind].color, '#fff3b0'], spd: 3.5, life: .6, size: 3, grav: -4, glow: true});
  popup(player.x, player.y - .5, PKINDS[kind].name, PKINDS[kind].color);
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
  comboN++; comboT = 2.5;
  const val = Math.round(100 * comboMult());
  addScore(val);
  // juicy pickup burst: gold shards + a quick bright sparkle ring
  spawnParticles(gd.c + .5, gd.r + .5, 16, {color: ['#ffd23f', '#fff3b0', '#ff9d2e'], spd: 3.4, life: .55, size: 3, grav: -2, glow: true});
  spawnParticles(gd.c + .5, gd.r + .5, 7, {color: ['#ffffff'], spd: 5.5, life: .3, size: 2, grav: 0, glow: true});
  popup(gd.c + .5, gd.r + .3, comboN > 1 ? val + ' ×' + comboMult().toFixed(1).replace('.0', '') : '' + val, comboN > 2 ? '#ff9d2e' : '#ffd23f');
  AUDIO.sfx(comboN > 2 ? 'goldhi' : 'gold');
  if (goldLeft <= 0) revealExit();
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
  const cols = [];
  for (let c = 0; c < COLS; c++)
    if (gOccupy(c, 0) && !(player && Math.abs(player.x - (c + .5)) < 3)) cols.push(c);
  const c = cols.length ? cols[(rnd() * cols.length) | 0] : (rnd() * COLS) | 0;
  g.x = c + .5; g.y = 0.5;
  g.state = 'fall'; g.anim = 0; g.wp = null; g.repath = 0;
  g.invuln = 1.2;
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
  if (!exitRevealed) return;
  const c = Math.floor(player.x);
  if (player.y <= 0.55 && isLadder(c, 0)) levelComplete();
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
  if (mode === 'campaign'){
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
  shake = Math.max(shake, .6); flash = Math.max(flash, .4); hitStop = Math.max(hitStop, .08);
  deathFlash = 1;
  spawnParticles(player.x, player.y, 24, {color: ['#3fd2c7', '#ffd23f', '#ff4f6b', '#fff'], spd: 5.5, life: .8, size: 4, grav: 10, glow: true});
  AUDIO.sfx('die');
}

function respawnOrGameOver(){
  lives--;
  if (lives > 0) reloadCurrentLevel();
  else endGame(false);
}

function reloadCurrentLevel(){
  if (currentRows) loadLevelData(currentRows);
  levelTime = 0;
}

function endGame(won){
  state = 'over';
  AUDIO.sfx(won ? 'win' : 'die');
  AUDIO.stopMusic();
  $('overTitle').textContent = won ? 'CLAIM CLEARED!' : 'CLAIM LOST';
  $('overStats').innerHTML =
    '<div>HAUL<br><b>' + score + '</b></div>' +
    (mode === 'campaign' ? '<div>CLAIM<br><b>' + (levelIndex + 1) + '</b></div>' : '<div>MODE<br><b>DAILY</b></div>');
  beginEntry();
  showOnly('ovOver');
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
  else if (id === 'overBoard') ledgerView = (mode === 'daily' ? 'daily' : 'campaign');
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
    const ns = this.nsFor(mode === 'daily' ? 'daily' : 'campaign', date);
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
    const head = view === 'daily' ? '<div class="tiny" style="color:var(--teal)">DAILY DIG · ' + (dailyDate || LEVELS.dailyDateUTC()) + '</div>' : '';
    const paint = (board) => { el.innerHTML = head + this.rowsHTML(board, ns); };
    if (this.cache[ns]) paint(this.cache[ns]);
    else { paint(null); this.fetchBoard(ns).then(b => paint(b)); }
  },
};

/* ================= how-to + level select ================= */
function buildHowTo(){
  $('howBody').innerHTML =
    '<p><b>Goal:</b> grab every <b>nugget</b>, then climb the revealed <b>exit ladder</b> off the top — without getting caught.</p>' +
    '<p><b>Explore:</b> relics, cave blooms, survey maps, and lantern oil are tucked into side paths. Find them all for a <b>cavern survey</b> bonus.</p>' +
    '<p><b>Move</b> <span class="k">←</span><span class="k">→</span> or <span class="k">A</span><span class="k">D</span> · ' +
    '<b>climb</b> <span class="k">↑</span><span class="k">↓</span> / <span class="k">W</span><span class="k">S</span> · hang &amp; cross bars.</p>' +
    '<p><b>Dig</b> a trap to the lower-left <span class="k">Z</span> or lower-right <span class="k">X</span> ' +
    '(also <span class="k">,</span> <span class="k">.</span>). Holes seal shut — a guard caught inside is trapped, then lost.</p>' +
    '<p><b>Jumpers</b> chase you and pocket gold. <b>Scouts</b> are quick; <b>masons</b> re-seal your holes.</p>' +
    '<p><b>Pick-ups:</b> <span style="color:#ff5c33">TNT</span> blasts 3 wide · ' +
    '<span style="color:#3fd2c7">Boots</span> speed · <span style="color:#b07fff">Cloak</span> phase through guards · ' +
    '<span style="color:#ffd23f">Magnet</span> grabs gold · <span style="color:#7fd24a">Shovel</span> instant digs.</p>' +
    '<p><b>Lantern oil</b> briefly widens the painted light pool; maps briefly boost magnet pull. Chain nuggets fast for a <b>combo multiplier</b>.</p>' +
    '<p><span class="k">P</span> pause · <span class="k">M</span> mute · <span class="k">R</span> restart.</p>';
}

function buildLevelSelect(){
  const grid = $('lvlGrid');
  grid.innerHTML = '';
  const maxDone = campaignDone.length ? Math.max(...campaignDone) : -1;
  const unlockTo = Math.min(LEVELS.campaign.length - 1, maxDone + 1);
  for (let i = 0; i < LEVELS.campaign.length; i++){
    const b = document.createElement('button');
    const done = campaignDone.includes(i);
    const locked = i > unlockTo;
    b.textContent = locked ? '🔒' : (i + 1);
    b.title = LEVELS.names[i] || ('Claim ' + (i + 1));
    if (locked) b.classList.add('locked');
    if (done) b.classList.add('done');
    if (!locked) b.addEventListener('click', e => { e.preventDefault(); AUDIO.ensure(); AUDIO.sfx('ui'); startCampaignAt(i); });
    grid.appendChild(b);
  }
}

/* ================= touch controls ================= */
function initTouch(){
  const map = { tLeft: 'ArrowLeft', tRight: 'ArrowRight', tUp: 'ArrowUp', tDown: 'ArrowDown', tDigL: 'KeyZ', tDigR: 'KeyX' };
  for (const id in map){
    const el = $(id), code = map[id];
    const on = e => { e.preventDefault(); keys[code] = true; el.classList.add('on'); AUDIO.ensure(); };
    const off = e => { e.preventDefault(); keys[code] = false; el.classList.remove('on'); };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointerleave', off);
    el.addEventListener('pointercancel', off);
  }
  // clickable initials (touch-friendly entry)
  const spans = $('initials').children;
  for (let i = 0; i < 3; i++)
    spans[i].addEventListener('click', () => { initCursor = i; cycleInitial(i, 1); });
}

function playerInput(){
  return {
    left: keys.ArrowLeft || keys.KeyA,
    right: keys.ArrowRight || keys.KeyD,
    up: keys.ArrowUp || keys.KeyW,
    down: keys.ArrowDown || keys.KeyS,
    digL: keys.KeyZ || keys.Comma,
    digR: keys.KeyX || keys.Period,
  };
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
  const kinds = ['relic', 'bloom', 'map', 'oil'];
  const want = Math.min(5 + Math.min(levelIndex, 3), Math.max(2, candidates.length));
  for (const spot of candidates){
    if (treasures.length >= want) break;
    if (treasures.some(t => Math.abs(t.c - spot.c) + Math.abs(t.r - spot.r) < 3)) continue;
    treasures.push({c: spot.c, r: spot.r, kind: kinds[treasures.length % kinds.length], taken: false});
  }
  discoveryCount = 0;
  discoveryTotal = treasures.length;
  discoveryPulse = 0;
  oilLightT = 0;
}

function loadLevelData(rows){
  currentRows = rows;
  srand(rows.join('').length * 2654435761 + rows[0].charCodeAt(0));
  parseLevel(rows);
  seedTreasures();
  player = makeActor(spawnPoint.c, spawnPoint.r, 'player');
  guards = guardSpawns.map(g => makeActor(g.c, g.r, g.kind));
  levelTime = 0;
  particles = []; popups = [];
  shake = 0; hitStop = 0; flash = 0; deathFlash = 0;
  digBuffer = 0; runDustT = 0;
  buildBackdrop();
  computeDecor();
  // intro banner
  if (mode === 'daily') banner = {text: 'DAILY DIG', sub: dailyDate || LEVELS.dailyDateUTC(), life: 2.4};
  else banner = {text: 'CLAIM ' + (levelIndex + 1), sub: (LEVELS.names[levelIndex] || '').toUpperCase(), life: 2.4};
  // first-claim onboarding hint
  hint = (mode === 'campaign' && levelIndex === 0) ? {life: 7} : null;
}

function loadCampaignLevel(i){
  levelIndex = Math.max(0, Math.min(LEVELS.campaign.length - 1, i | 0));
  loadLevelData(LEVELS.campaign[levelIndex]);
}

/* ================= flow ================= */
let dailyDate = null;

function startGame(m){
  mode = m || 'campaign';
  score = 0; lives = 3;
  if (mode === 'daily'){
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
  mode = 'campaign';
  score = 0; lives = 3;
  loadCampaignLevel(i);
  gameTime = 0;
  state = 'playing';
  hideOverlays();
  AUDIO.ensure(); AUDIO.startMusic();
}
function pauseGame(){ if (state !== 'playing') return; state = 'paused'; showOnly('ovPause'); }
function resumeGame(){ if (state !== 'paused') return; state = 'playing'; hideOverlays(); }
function restartLevel(){ loadCampaignLevel(levelIndex); state = 'playing'; hideOverlays(); }
function quitToTitle(){ state = 'title'; AUDIO.stopMusic(); showOnly('ovTitle'); refreshTitleBoard(); }
function toggleMute(){
  AUDIO.ensure(); AUDIO.setMuted(!AUDIO.muted);
  const label = (AUDIO.muted ? '🔇 Muted' : '🔊 Sound');
  $('bMute').textContent = label; $('bPauseMute').textContent = label;
}

function bindButton(id, fn){
  const b = $(id);
  b.addEventListener('click', e => { e.preventDefault(); AUDIO.ensure(); AUDIO.sfx('ui'); fn(); });
}
bindButton('bPlay', () => startGame('campaign'));
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
bindButton('bQuit', quitToTitle);
bindButton('bAgain', () => startGame(mode));
bindButton('bOverMenu', quitToTitle);
bindButton('bSubmit', submitEntry);
bindButton('bLedgerCampaign', () => refreshBoardInto('scoreBoard', 'campaign'));
bindButton('bLedgerDaily', () => refreshBoardInto('scoreBoard', 'daily'));

buildHowTo();
initTouch();
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
  // Dig attempts every tick the button is held (classic): tap = one dig, hold = repeats
  // as the cooldown frees, and a held button digs the instant you land. tryDig() self-gates.
  if (inp.digL) tryDig(-1);
  else if (inp.digR) tryDig(1);
  prevDigL = !!inp.digL; prevDigR = !!inp.digR;

  if (player.digT > 0){
    player.digT -= dt;
    if (player.digT <= 0 && player.pendingDig){
      openHole(player.pendingDig.c, player.pendingDig.r);
      player.pendingDig = null;
    }
  } else {
    moveActor(player, dt, inp, player.speedT > 0 ? 1.45 : 1);
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
  if (comboT > 0){ comboT -= dt; if (comboT <= 0) comboN = 0; }
  if (player.state !== 'dead'){
    updatePowerups(dt);
    checkGold();
    checkWin();
  }
}

/* ================= render ================= */
function px(v){ return v * TILE; }                 // tile-units -> logical px (x)
function py(v){ return v * TILE + HUD_H; }          // tile-units -> logical px (y)
function drawTile(img, c, r){ ctx.drawImage(img, c * TILE, r * TILE + HUD_H); }

/* parallax cave backdrop, baked per level */
let bg = null, bloomCv = null, bloomCx = null;
const painterlyPlate = new Image();
let painterlyPlateReady = false;
painterlyPlate.onload = () => { painterlyPlateReady = true; bg = null; if (booted) render(); };
painterlyPlate.src = 'assets/painterly-cavern-runtime-v2.png';

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
  const h = hues[(mode === 'daily' ? 2 : levelIndex) % hues.length];
  x.save(); x.globalCompositeOperation = 'overlay'; x.fillStyle = h + '0.16)'; x.fillRect(0, 0, W, H); x.restore();
}

/* ================= decorative set-dressing (deterministic per level) ================= */
let decor = [];
function computeDecor(){
  decor = [];
  const rr = ART.rng(4242 + levelIndex * 131 + (mode === 'daily' ? 777 : 0));
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
function drawActor(a){
  const set = ART.frames[a.kind] || ART.frames.guard;
  const pose = poseFor(a);
  const frames = set[pose] || set.idle;
  const rate = pose === 'run' ? 14 : (pose === 'climb' ? 9 : 4);
  const fi = a.moved || pose === 'idle' || pose === 'fall' || pose === 'stun'
    ? Math.floor(a.anim * rate) % frames.length : 0;
  const img = frames[fi] || frames[0];
  const h = a.kind === 'player' ? 64 : 58;
  const w = h * ART.FW / ART.FH;       // larger + downscaled from hi-res source
  const cx2 = px(a.x);
  let footY = py(a.y) + TILE * 0.5;
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
  if (a.state === 'stun'){ ctx.globalAlpha = 0.6 + 0.2 * Math.sin(gameTime * 16); }
  if (a.invuln > 0 && Math.floor(gameTime * 16) % 2) ctx.globalAlpha *= 0.4;
  // landing squash-and-stretch (juice)
  if (a.squashT > 0){ const s = a.squashT / 0.15; ctx.translate(cx2, footY); ctx.scale(1 + 0.18 * s, 1 - 0.22 * s); ctx.translate(-cx2, -footY); }
  ctx.translate(cx2, footY - h);
  if (a.dir < 0){ ctx.translate(w, 0); ctx.scale(-1, 1); }
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();
  // carried gold — show which guard pocketed your nugget
  if (a.gold){
    ctx.drawImage(ART.tiles.gold, cx2 - 9, footY - h * 0.62 - 9, 18, 18);
  }
}

/* additive radial glow — cached per color sprite, scaled on draw (cheaper than per-call gradients) */
const glowCache = {};
function glowSprite(color){
  if (glowCache[color]) return glowCache[color];
  const S = 64, c = ART.cv(S, S), x = ART.cx(c);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  glowCache[color] = c; return c;
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
  if (t === '#' || t === 'B') return !isDug(c, r) && !isBlasted(c, r);
  if (t === 'C') return !isCrumbleGone(c, r) && !isBlasted(c, r);
  if (t === 'T') return true;
  return t === 'X';
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
  if (t === '#') return (!isDug(c, r) && !isBlasted(c, r)) ? 'earth' : null;
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
        ctx.globalAlpha = 0.07 + 0.03 * Math.sin(clock * 4 + i);
        ctx.fillStyle = '#cfe6f6'; ctx.fillRect(wx, yy, 9, 22);
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
        if (t === '#' || t === 'T' || t === 'B' || t === 'C'){
          if (blast){ drawPit(c, r, .9); continue; }
          if (dug){
            drawPit(c, r, 1);
            const h = holes.get(key(c, r));
            if (h && h.t > HOLE_LIFE - HOLE_WARN){
              const u = (h.t - (HOLE_LIFE - HOLE_WARN)) / HOLE_WARN;
              ctx.globalAlpha = .3 + .7 * u * (0.6 + 0.4 * Math.sin(h.t * 24));
              drawTile(T.brick, c, r); ctx.globalAlpha = 1;
            }
            continue;
          }
          if (t === 'C' && isCrumbleGone(c, r)){ continue; }
          if (t === 'B') drawTile(T.crate, c, r);
          else if (t === 'C'){
            const cr = crumbles.get(key(c, r));
            drawTile(T.crumble, c, r);
            if (cr){ ctx.globalAlpha = 0.3 + 0.3 * Math.sin(gameTime * 20); ctx.fillStyle = '#1a0e06';
              ctx.fillRect(c * TILE + 2, r * TILE + HUD_H + 2, TILE - 4, TILE - 4); ctx.globalAlpha = 1; }
          }
          else continue;
        }
        else if (t === 'X') continue;
        else if (t === 'H') continue;
        else if (t === '-') drawTile(T.bar, c, r);
        else if (t === 'E' && exitRevealed) continue;
        else if (t === '<' || t === '>'){
          drawTile(t === '<' ? T.beltL : T.beltR, c, r);
          ctx.fillStyle = '#ffd23f';
          const phase = (gameTime * 18 * (t === '<' ? -1 : 1)) % 12;
          for (let k = -1; k <= 2; k++){
            const ax = c * TILE + ((k * 12 + phase + 12) % 12) + 4, ay = r * TILE + HUD_H + 6;
            ctx.beginPath();
            if (t === '>'){ ctx.moveTo(ax, ay); ctx.lineTo(ax + 5, ay + 3); ctx.lineTo(ax, ay + 6); }
            else { ctx.moveTo(ax + 5, ay); ctx.lineTo(ax, ay + 3); ctx.lineTo(ax + 5, ay + 6); }
            ctx.fill();
          }
        }
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

    // power-ups: icon + bob + halo
    for (const pu of powerups){
      if (pu.taken) continue;
      const bobv = Math.sin(gameTime * 3 + pu.c) * 3;
      glow(pu.c + .5, pu.r + .5 + bobv / TILE, 26, hexA(PKINDS[pu.kind].color, .5), .6);
      ctx.drawImage(ART.PUPS[pu.kind], pu.c * TILE + 6, pu.r * TILE + HUD_H + 6 + bobv);
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
    // lit fuses
    for (const f of fuses){
      const a = 0.5 + 0.5 * Math.sin(f.t * 50);
      glow(f.c + .5, f.r + .5, 22, 'rgba(255,150,40,.7)', a * .8);
      ctx.globalAlpha = a; ctx.fillStyle = '#fff3b0';
      ctx.fillRect(f.c * TILE + 14, f.r * TILE + HUD_H + 14, 8, 8); ctx.globalAlpha = 1;
    }
    // dig-in-progress
    if (player && player.digT > 0 && player.pendingDig){
      ctx.globalAlpha = Math.max(0, player.digT / DIG_TIME);
      drawTile(T.brick, player.pendingDig.c, player.pendingDig.r); ctx.globalAlpha = 1;
    }
    // gold — gentle float bob + breathing pulse + drifting twinkle
    for (const gd of golds){
      if (gd.taken || gd.held) continue;
      const ph = gameTime * 2 + gd.c * 0.9 + gd.r * 1.4;
      const bob = Math.sin(ph) * 2.2;
      const s = 1 + Math.sin(ph * 1.3) * 0.06;
      const cx0 = gd.c * TILE + 18, cy0 = gd.r * TILE + HUD_H + 18 + bob;
      const w = 36 * s;
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(T.gold, cx0 - w / 2, cy0 - w / 2, w, w);
      ctx.restore();
      const tw = Math.sin(ph * 1.7);
      if (tw > 0.5){
        ctx.globalAlpha = (tw - 0.5) / 0.5;
        ctx.fillStyle = '#fff';
        const sx = cx0 + Math.cos(ph * 1.1) * 5 - 1, sy = cy0 + Math.sin(ph * 1.4) * 4 - 5;
        ctx.fillRect(sx, sy, 2, 2);
        ctx.globalAlpha = 1;
      }
    }

    // entities — guards behind player
    for (const gu of guards) if (gu.state !== 'dead' || gu.deadT < 1) drawActor(gu);
    if (player) drawActor(player);

    // particles
    for (const p of particles){
      const a = Math.max(0, Math.min(1, p.life / p.max));
      if (p.glow) glow(p.x, p.y, p.size * 3, hexA(p.color, .8), a * .5);
      ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.fillRect(px(p.x) - p.size / 2, py(p.y) - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;

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
    for (const tr of treasures) if (!tr.taken){ const meta = TKINDS[tr.kind] || TKINDS.relic; glow(tr.c + .5, tr.r + .5, 20, hexA(meta.color, .18), 1); }
    if (exitRevealed){ const pulse = 0.35 + 0.2 * Math.sin(gameTime * 5); for (const e of exitCells) glow(e.c + .5, e.r + .5, 38, 'rgba(63,210,199,' + pulse + ')', 1); }
    for (const h of holes.values()) glow(h.c + .5, h.r + .6, 20, 'rgba(255,90,40,.22)', 1);
    // torch pools
    for (const d of decor) if (d.type === 'torch'){ const fl = 0.85 + 0.15 * Math.sin(gameTime * 14 + d.c * 3); glow(d.c + .5, d.r - 0.5, 58 * fl, 'rgba(255,150,50,.5)', 1); }
    // exit portal aura
    if (exitRevealed && exitCells.length){ const e = topExitCell(); glow(e.c + .5, e.r + .5, 44, 'rgba(80,230,210,' + (0.4 + 0.2 * Math.sin(gameTime * 4)) + ')', 1); }
    // faint danger underglow so guards read at a glance
    for (const gu of guards) if (gu.state !== 'dead') glow(gu.x, gu.y + .15, 26, 'rgba(255,60,80,' + (gu.state === 'stun' ? .1 : .22) + ')', 1);
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
  // combo escalation tint
  if (comboN >= 3){
    const ct = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * .35, VIEW_W / 2, VIEW_H / 2, VIEW_H * .8);
    const a = Math.min(.28, (comboN - 2) * 0.06) * (0.7 + 0.3 * Math.sin(gameTime * 8));
    ct.addColorStop(0, 'rgba(0,0,0,0)'); ct.addColorStop(1, 'rgba(255,140,40,' + a + ')');
    ctx.fillStyle = ct; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  // foreground framing layer (near, dark — frames the scene without covering the action)
  if (grid.length) drawForeground();

  // pause scrim
  if (state === 'paused'){ ctx.fillStyle = 'rgba(8,5,14,.55)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }

  // intro banner
  if (banner){
    const a = Math.min(1, banner.life) * Math.min(1, (2.4 - banner.life) * 4);
    ctx.globalAlpha = Math.max(0, a);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 40px Consolas, monospace';
    ctx.fillText(banner.text, VIEW_W / 2, VIEW_H / 2 - 18);
    if (banner.sub){ ctx.fillStyle = '#d8cfe4'; ctx.font = '600 18px Consolas, monospace'; ctx.fillText(banner.sub, VIEW_W / 2, VIEW_H / 2 + 16); }
    ctx.globalAlpha = 1;
  }

  // first-claim onboarding hint
  if (hint && !banner){
    ctx.globalAlpha = Math.min(1, hint.life / 1.5) * 0.85;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0c0a12cc'; ctx.fillRect(VIEW_W / 2 - 235, VIEW_H - 70, 470, 34);
    ctx.fillStyle = '#ffe98a'; ctx.font = '700 16px Consolas, monospace';
    ctx.fillText('◀ ▶ run   ↑ ↓ ladders   Z / X  dig left / right', VIEW_W / 2, VIEW_H - 53);
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
function ensureWorldCanvas(){
  if (worldCv) return;
  worldCv = document.createElement('canvas');
  worldCv.width = VIEW_W;
  worldCv.height = VIEW_H;
  worldCx = worldCv.getContext('2d');
  worldCx.imageSmoothingEnabled = false;
}
function mobileHudHeight(){ return Math.max(74, Math.min(92, Math.round(screenH * 0.1))); }
function mobileCameraScale(){
  const portrait = screenH >= screenW;
  const base = portrait ? 1.36 : 1.55;
  return Math.max(1.18, Math.min(1.7, base + (screenW < 380 ? 0.08 : 0)));
}
function updateMobileCamera(playH, zoom){
  const srcW = Math.min(VIEW_W, screenW / zoom);
  const srcH = Math.min(VIEW_H - HUD_H, playH / zoom);
  const targetX = player ? px(player.x) - srcW * 0.5 : (VIEW_W - srcW) * 0.5;
  const targetY = player ? py(player.y) - srcH * 0.56 : HUD_H;
  const nextX = clamp(targetX, 0, VIEW_W - srcW);
  const nextY = clamp(targetY, HUD_H, VIEW_H - srcH);
  const follow = state === 'playing' ? 0.18 : 0.32;
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
  for (let i = 0, n = Math.min(lives, 4); i < n; i++) drawHeart(94 + i * 22, 45, 17, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,216,107,.9)';
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillText('SCORE', screenW / 2, 18);
  ctx.fillStyle = '#fff';
  ctx.font = '900 23px system-ui, sans-serif';
  ctx.fillText(String(score).padStart(6, '0'), screenW / 2, 47);

  const tt = Math.max(0, levelTime | 0), mm = String((tt / 60) | 0).padStart(2, '0'), ss = String(tt % 60).padStart(2, '0');
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(216,207,228,.72)';
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillText(mode === 'daily' ? 'DAILY' : 'TIME', screenW - 14, 18);
  ctx.fillStyle = '#f6f0ff';
  ctx.font = '900 20px system-ui, sans-serif';
  ctx.fillText(mm + ':' + ss, screenW - 14, 47);
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
  drawMobileHUD();
}
function render(){
  ctx = mainCtx;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (mobileCamera) renderMobileCamera();
  else renderWorldFrame(true);
}

function drawPit(c, r, dark){
  const x = c * TILE, y = r * TILE + HUD_H;
  ctx.fillStyle = 'rgba(6,4,10,' + (0.82 * dark) + ')';
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.fillRect(x, y, TILE, 5);            // top inner shadow
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
  ctx.drawImage(ART.frames.player.idle[0], x + 16, y + 6, 35, 50);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,216,107,.75)';
  ctx.lineWidth = 2;
  roundRect(x + 8, y + 8, 50, 46, 8);
  ctx.stroke();
}

function drawObjectivePanel(){
  if (!grid.length) return;
  const x = 14, y = HUD_H + 16, w = 174, h = 112;
  panelBox(x, y, w, h, 'OBJECTIVES');
  const total = golds.length, got = total - goldLeft;
  const rows = [
    {label: 'Gold vein', value: got + '/' + total, done: goldLeft <= 0, col: '#ffd23f'},
    {label: 'Hidden finds', value: discoveryCount + '/' + discoveryTotal, done: discoveryTotal && discoveryCount >= discoveryTotal, col: '#9ef0c8'},
    {label: 'Reach exit', value: exitRevealed ? 'open' : 'locked', done: exitRevealed, col: '#3fd2c7'},
  ];
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < rows.length; i++){
    const ry = y + 43 + i * 23, it = rows[i];
    ctx.strokeStyle = it.done ? it.col : 'rgba(220,230,245,.55)';
    ctx.lineWidth = 1.5;
    roundRect(x + 14, ry - 8, 14, 14, 3);
    ctx.stroke();
    if (it.done){
      ctx.fillStyle = it.col;
      ctx.fillRect(x + 17, ry - 3, 8, 4);
    }
    ctx.fillStyle = '#f5eddd';
    ctx.textAlign = 'left';
    ctx.fillText(it.label, x + 37, ry + 1);
    ctx.fillStyle = it.col;
    ctx.textAlign = 'right';
    ctx.fillText(it.value, x + w - 14, ry + 1);
  }
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
  for (let i = 0, n = Math.min(lives, 6); i < n; i++){ drawHeart(hx + 8, 23, 18, true); hx += 24; }
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
  ctx.fillStyle = 'rgba(255,216,107,.9)'; ctx.font = '900 12px system-ui, sans-serif'; ctx.fillText('SCORE', VIEW_W / 2, 18);
  ctx.fillStyle = '#fff'; ctx.font = '900 30px system-ui, sans-serif'; ctx.fillText(String(score).padStart(6, '0'), VIEW_W / 2, 47);

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

  drawHotbar();
  drawObjectivePanel();
  drawMiniMapPanel();
}

/* ================= fixed-timestep loop ================= */
let last = 0, acc = 0, clock = 0;
function frame(t){
  requestAnimationFrame(frame);
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
  dig(dir){ return tryDig(dir < 0 ? -1 : 1); },
  kill(){ killPlayer('debug'); },
  give(kind){ applyPowerup(kind); },
  get powerups(){ return powerups; },
  get fuses(){ return fuses; },
  get blasted(){ return [...blasted]; },
  get combo(){ return {n: comboN, t: comboT, mult: comboMult()}; },
  boom(c, r){ boom(c, r); },
  get levelTime(){ return levelTime; },
  get dailyDate(){ return dailyDate; },
  seedDaily(dateStr){
    const d = LEVELS.generateDaily(dateStr);
    mode = 'daily'; dailyDate = d.date; score = 0; lives = 3;
    loadLevelData(d.rows);
    state = 'playing'; hideOverlays();
    return {date: d.date, attempt: d.attempt};
  },
  solvable(rows){ return LEVELS.solvable(rows || currentRows); },
  startAt: startCampaignAt,
  scores: () => Scores,
};

if (new URLSearchParams(location.search).has('autoplay')){
  setTimeout(() => { try { startGame('campaign'); } catch (e) { console.error(e); } }, 80);
}
