// Sini 2026 — game flow, menus, HUD (with the scanner), commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, CONSTRUCTS, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, TYPICAL_UP, START_LIVES, DIFFICULTY, POWERUPS, LIVERIES, CP_NAMES, C_KEYS } from './config.js?v=3';
import { makeWorld, step, drainEvents, wd, isAwake, canStrike, strikeHP, coreOpen } from './sim.js?v=3';
import { Autopilot } from './ai.js?v=3';
import { Renderer, pickQuality, CALM } from './render.js?v=3';
import { Audio } from './audio.js?v=3';
import { Input } from './input.js?v=3';
import { Scores, NO_POST } from './scores.js?v=3';
import { Recorder, Replay } from './replay.js?v=3';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=3';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'sn.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', livery: 'cobalt', assist: 'light', scanner: 'on' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('sn.medals.v1', []));
const best = load('sn.best.v1', {});
let reach = load('sn.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input(R.camera);
const BOARDS = {};
function boardOf(mode, diff = 'normal') {
  const key = (mode === 'deep' ? 'sini-2026-deep' : 'sini-2026') + (diff === 'normal' ? '' : '-' + diff);
  return BOARDS[key] || (BOARDS[key] = new Scores(key));
}
const HS = boardOf('campaign');
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });
const ASSIST = { off: 0, light: 0.07, strong: 0.13 };

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), lastLife: false,
};
window.__sn = { G, R, A, I, NET, REC, settings, VERSION };

// ------------------------------------------------------------------ talking: rare on purpose
// KEY lines (run start, sector start, construct awake / down, sector clear, game over, new record) always get
// through, one voice at a time; colour lines wait VOICE_GAP seconds after the last line and roll a chance.
const VOICE_GAP = 26;
let lastLine = -99;
const nowS = () => performance.now() / 1000;
function say(name, o = {}) {
  if (settings.talk === 'off' || G.mode === 'demo' || G.mode === 'title') return;
  const t = nowS(), last = G.says.get(name) ?? -99;
  if (t - last < (o.cd ?? 0) || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__sn.lines ||= []).push([t, name]); }
}
function rumble(strong, weak, ms) { if (settings.rumble === 'off' || G.mode === 'demo' || G.mode === 'playthrough' || G.mode === 'title') return; I.rumble(strong, weak, ms); }

// ------------------------------------------------------------------ screens
const SCREENS = ['title', 'sectors', 'upgrades', 'results', 'scores', 'medals', 'options', 'help', 'online', 'pause'];
function show(id, push = true) {
  if (push && G.screen && G.screen !== id) G.back.push(G.screen);
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id);
  G.screen = id;
  if (id) { const first = $(id).querySelector('.mbtn.primary:not(.hidden), .mbtn:not(.hidden), .sec:not([disabled]), .upg'); setSel(first); }
}
function hideScreens() { for (const s of SCREENS) $(s).classList.add('hidden'); G.screen = null; G.back = []; }
function goBack() {
  const prev = G.back.pop();
  if (prev) show(prev, false); else if (G.state === 'paused') show('pause', false); else toTitle();
}
let selEl = null;
function setSel(el) { if (selEl) selEl.classList.remove('sel'); selEl = el; if (el) el.classList.add('sel'); }
function navigate(dir) {
  if (!G.screen) return;
  const items = [...$(G.screen).querySelectorAll('.mbtn:not(.hidden):not([disabled]), .sec:not([disabled]), .upg, .seg button, [data-tab], [data-hd]')].filter((e) => e.offsetParent);
  if (!items.length) return;
  let i = items.indexOf(selEl);
  if (i < 0) i = 0; else {
    const r0 = selEl.getBoundingClientRect(), cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
    let bestI = -1, bestD = 1e9;
    items.forEach((e, j) => {
      if (j === i) return;
      const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, dx = x - cx, dy = y - cy;
      const ok = dir === 'ArrowDown' ? dy > 4 : dir === 'ArrowUp' ? dy < -4 : dir === 'ArrowRight' ? dx > 4 : dx < -4;
      if (!ok) return;
      const d = (dir === 'ArrowDown' || dir === 'ArrowUp') ? Math.abs(dy) + Math.abs(dx) * 2 : Math.abs(dx) + Math.abs(dy) * 2;
      if (d < bestD) { bestD = d; bestI = j; }
    });
    if (bestI >= 0) i = bestI;
  }
  setSel(items[i]);
  items[i].scrollIntoView({ block: 'nearest' });
  A.play('uimove', { gap: 0, vol: 0.5 });
}

// ------------------------------------------------------------------ title + scenic background
function toTitle() {
  NET.close(); stopPlay();
  clearTimeout(G.ptT);
  G.state = 'title'; G.mode = 'title'; G.idleT = 0;
  hideScreens(); show('title', false);
  $('ver').textContent = VERSION;
  $('title-best').textContent = `BEST ${Math.max(boardOf('campaign', settings.diff).best(), 0).toLocaleString()} · ${DL(settings.diff)}`;
  $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  syncSegs();
  $('med-sub').textContent = `${medals.size} / ${MEDALS.length}`;
  $('sel-sub').textContent = reach > 0 ? `Sectors 1 to ${reach + 1} open` : 'Clear sector 1 to open more';
  $('demo-badge').classList.add('hidden');
  setHud(false);
  scenic(G.demoI % 5);
  A.playMusic('title');
}
function scenic(look) {
  // the title drifts over a sector's field with machines at work round a half-built construct
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 7 + look, demo: true, lives: 9, cp: 1, noTut: true });
  W.players[0].alive = false; W.players[0].deadT = -1e9;
  W.phase = 'play'; W.regenT = 0;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
  R.cx = W.C.x + 30; R.cz = W.C.z + 20;
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  A.stopLoops();
  G.replay = null; G.ai = null; G.timeScale = 1; A.setRate(1); R.shot = null;
  for (const id of ['letterbox', 'bossbar', 'tut', 'banner', 'caption', 'intent', 'objective']) $(id).classList.add('hidden');
  for (const d of WM) d.style.display = 'none';
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
const assistOf = () => ASSIST[settings.assist] || 0;
function startCampaign(sector = 0) {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 500 * sector : 0, start: sector, newMedals: [], diff: settings.diff, continues: 0, bombs: null };
  say('begin', { key: true, delay: 1 });
  beginSector(sector);
}
function beginSector(s, cp = 0, bombs = null) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, cp: cp || +params.get('cp') || 0, bombs: bombs ?? undefined,
    demo: !!G.run.ai, diff: G.run.diff || 'normal', assist: G.run.ai ? 0 : assistOf(), noTut: s > 0 });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`SECTOR ${s + 1}`, SECTORS[s].name + (cp ? ' · ' + CP_NAMES[cp] : ''), 3);
  if (s > 0 && !cp) say('s' + (s + 1), { key: true, delay: 1.4 });
}
// AI PLAYTHROUGH: the demo autopilot plays the whole campaign, picks its own upgrades between sectors and
// retries from the checkpoint if it runs out of ships. Nothing it does counts for scores or medals.
const AI_SHOP = ['rapid', 'deflector', 'rack', 'twin', 'rapid', 'magnet', 'thrust', 'twin', 'deflector', 'rapid', 'rack', 'magnet', 'thrust'];
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0, continues: 0 };
  beginSector(+params.get('sector') || 0);
  caption('AI PLAYTHROUGH: THE AUTOPILOT FLIES ALL FIVE SECTORS. PRESS ESC OR PAUSE TO STOP', 6);
}
function aiShop() {
  const got = [];
  for (const k of AI_SHOP) {
    const lv = G.run.up[k] || 0;
    if (lv >= UPGRADES[k].max || G.run.salvage < UP_COST[lv]) continue;
    G.run.salvage -= UP_COST[lv]; G.run.up[k] = lv + 1; got.push(UPGRADES[k].name);
  }
  return got;
}
function startDeep() {
  G.run = { score: 0, lives: START_LIVES, up: {}, start: 0, newMedals: [], diff: settings.diff };
  G.mode = 'deep';
  enterPlay(makeWorld({ mode: 'deep', seed: newSeed(), diff: settings.diff, assist: assistOf(), lives: START_LIVES + DIFFICULTY[settings.diff].lives }));
  banner('DEEP FIELD', 'HOW MANY CAN YOU BRING DOWN', 3);
  say('deep', { key: true, delay: 1 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start at the half-built checkpoint with a full rack, so the construct wakes within the minute
  const up = { ...TYPICAL_UP[s], rapid: Math.max(1, TYPICAL_UP[s].rapid || 0) };
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, cp: 1, up, lives: 9, bombs: 10, noTut: true });
  W.C.pieces = W.C.N - 2;
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now();
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · ${CONSTRUCTS[W.C.key].name} IS NEARLY BUILT`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.lastLife = false; G.saidHalf = false; G.saidEmpty = false;
  if (!G.ai && G.autopilot && G.mode !== 'online') G.ai = new Autopilot(W.seed, 'demo');
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  REC.reset(); PREV = new WeakMap();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  const me = myPlayer(W);
  R.cx = me.x; R.cz = me.z;
  R.updateCamera(0.016, { snap: true, me });
  A.playMusic(SECTORS[W.k].music);
  A.loop('thrust', 'thrust', 0.5); A.loop('gather', 'gather', 0.45); A.loop('reaver', 'reaver', 0.5); A.loop('construct', 'construct', 0.75); A.loop('hunt', 'hunt', 0.8);
  buildStrip(W);
  G.idleT = 0;
}

// ------------------------------------------------------------------ HUD
function setHud(on) {
  $('hud').classList.toggle('hidden', !on);
  const touch = settings.touch === 'on' || (settings.touch === 'auto' && I.isTouch);
  const showTouch = on && touch && G.mode !== 'demo' && G.mode !== 'playthrough';
  $('touch').classList.toggle('hidden', !showTouch);
  I.touchOn = showTouch;
  $('tb-pause').classList.toggle('hidden', !on || G.mode === 'demo');
  $('scan').classList.toggle('hidden', !on || settings.scanner === 'off');
  if (!on) for (const id of ['bossbar', 'intent', 'objective']) $(id).classList.add('hidden');
}
function buildStrip(W) {
  const dl = W.diff !== 'normal' ? ' · ' + DL(W.diff) : '';
  $('sector-name').textContent = W.mode === 'deep' ? 'DEEP FIELD' + dl : `SECTOR ${W.sector + 1} · ${SECTORS[W.sector].name}${dl}`;
  $('cpstrip').innerHTML = W.mode === 'deep' ? '' : CP_NAMES.map((n) => `<b>${n}</b>`).join('');
}
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
const myPlayer = (W) => (G.mode === 'online' && !NET.host ? W.players[1] : W.players[0]);
function updateHud(W) {
  setText('score', W.score.toLocaleString());
  const board = boardOf(W.mode, W.diff);
  setText('hiscore', Math.max(board.best(), W.score).toLocaleString());
  setText('hi-lbl', W.mode === 'deep' ? 'BEST DEEP FIELD' : 'BEST');
  const me = myPlayer(W);
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - (me?.alive ? 1 : 0)))));
  setHTML('shield', me ? Array.from({ length: me.shield }, () => '<i class="on"></i>').join('') : '');
  if (me) { setText('bombs', String(me.bombs)); $('bombs-w').classList.toggle('empty', me.bombs === 0); $('bombs-w').classList.toggle('full', me.bombs >= F.maxBombs); }
  $('tb-bomb').classList.toggle('empty', !me || me.bombs <= 0);
  const cw = W.C && isAwake(W.C) && W.C.st !== 'dying', go = !!(cw && coreOpen(W.C) && me && me.bombs > 0), hold = !!(cw && !coreOpen(W.C));
  for (const id of ['bombs-w', 'tb-bomb']) { $(id).classList.toggle('go', go); $(id).classList.toggle('hold', hold); }
  if (me) setText('tb-bomb-n', String(me.bombs));
  const act = [];
  if (me) for (const k in me.pw) act.push([k, me.pw[k]]);
  setHTML('pw', act.map(([k, t]) => { const P = POWERUPS[k]; return `<span style="--c:#${P.color.toString(16).padStart(6, '0')}"><b>${P.glyph}</b>${P.name}<i style="width:${Math.min(100, (t / P.time) * 100).toFixed(0)}%"></i></span>`; }).join(''));
  const C = W.C;
  if (W.mode === 'deep') setText('timer', `CONSTRUCTS DOWN ${W.waveN} · ${fmtT(W.fightT)}`);
  else {
    setText('timer', fmtT(W.secT));
    const kids = $('cpstrip').children;
    for (let i = 0; i < kids.length; i++) { const want = i < W.cp ? 'done' : i === W.cp ? 'now' : ''; if (kids[i].className !== want) kids[i].className = want; }
  }
  // the construct: build progress while it is being fitted, armour once it is awake
  const awake = C && isAwake(C);
  $('bossbar').classList.toggle('hidden', !C || C.st === 'gone');
  if (C && C.st !== 'gone') {
    const nm = CONSTRUCTS[C.key].name;
    if (awake || C.st === 'dying') {
      const st = C.st === 'dying' ? 'BREAKING UP' : C.st === 'wake' ? 'WAKING · ARMOURED' : coreOpen(C) ? 'CORE OPEN' : 'CORE SHUT';
      setText('boss-name', `${nm} · ${st} · ${Math.max(0, C.hp)} CHARGE${C.hp === 1 ? '' : 'S'} TO GO`);
      $('bossbar').classList.toggle('open', coreOpen(C));
      $('bossbar').classList.add('awake');
      $('bossbar').querySelector('i').style.width = Math.max(0, (C.hp / C.max) * 100).toFixed(1) + '%';
    } else {
      setText('boss-name', `${nm} · BEING BUILT · ${C.pieces} / ${C.N} PLATES${canStrike(W) ? ' · CAN BE WOKEN EARLY' : ''}`);
      $('bossbar').classList.remove('open');
      $('bossbar').classList.remove('awake');
      $('bossbar').querySelector('i').style.width = ((C.pieces / C.N) * 100).toFixed(1) + '%';
    }
  }
}
// the scanner: the whole neighbourhood round the ship, the way the field wraps
const SC = { r: 120 };
function drawScanner(W) {
  const cv = $('scan');
  if (cv.classList.contains('hidden')) return;
  const dpr = Math.min(2, devicePixelRatio || 1), size = cv.clientWidth || 160;
  if (cv.width !== Math.round(size * dpr)) { cv.width = cv.height = Math.round(size * dpr); }
  const g = cv.getContext('2d'), S = cv.width, h = S / 2, k = h / SC.r;
  g.clearRect(0, 0, S, S);
  g.save();
  g.beginPath(); g.arc(h, h, h - 1, 0, 7); g.clip();
  g.fillStyle = 'rgba(4,8,12,0.72)'; g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(160,200,230,0.14)'; g.lineWidth = 1 * dpr;
  for (const rr of [0.33, 0.66]) { g.beginPath(); g.arc(h, h, h * rr, 0, 7); g.stroke(); }
  const me = myPlayer(W);
  const cx = me ? me.x : R.cx, cz = me ? me.z : R.cz;
  const P = (x, z) => [h + wd(x - cx) * k, h + wd(z - cz) * k];
  const dot = (x, z, r, c) => { const [px, py] = P(x, z); if ((px - h) ** 2 + (py - h) ** 2 > (h + r) ** 2) return; g.fillStyle = c; g.beginPath(); g.arc(px, py, r, 0, 7); g.fill(); };
  for (const q of W.rocks) dot(q.x, q.z, Math.max(1.4, q.r * k) * 1, q.ore > 0 ? 'rgba(170,160,150,0.55)' : 'rgba(110,105,100,0.4)');
  for (const c of W.crystals) if (!c.held) dot(c.x, c.z, 1.6 * dpr, '#52ffd8');
  for (const q of W.pods) dot(q.x, q.z, 2.4 * dpr, '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'));
  for (const e of W.enemies) dot(e.x, e.z, (e.type === 'reaver' ? 2.4 : 1.9) * dpr, e.type === 'reaver' ? (e.tell > 0 ? '#ffffff' : '#ff4a4a') : (e.carry ? '#ffe08a' : '#d8a040'));
  const C = W.C;
  if (C && C.st !== 'gone') {
    let [px, py] = P(C.x, C.z);
    const dx = px - h, dy = py - h, dl = Math.hypot(dx, dy), lim = h - 6 * dpr;
    if (dl > lim) { px = h + dx / dl * lim; py = h + dy / dl * lim; }
    const awake = isAwake(C);
    g.fillStyle = awake ? '#ff5a3a' : '#ffb347';
    g.beginPath(); g.arc(px, py, 4.5 * dpr, 0, 7); g.fill();
    g.strokeStyle = awake ? '#ff5a3a' : '#ffb347'; g.lineWidth = 2 * dpr;
    g.beginPath(); g.arc(px, py, 7.5 * dpr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (awake ? C.hp / C.max : C.pieces / C.N)); g.stroke();
  }
  for (const p of W.players) {
    if (!p.alive) continue;
    const [px, py] = P(p.x, p.z);
    g.save(); g.translate(px, py); g.rotate(p.a);
    g.fillStyle = p === me ? '#ffffff' : '#ffb070';
    g.beginPath(); g.moveTo(5 * dpr, 0); g.lineTo(-3.5 * dpr, 3 * dpr); g.lineTo(-2 * dpr, 0); g.lineTo(-3.5 * dpr, -3 * dpr); g.closePath(); g.fill();
    g.restore();
  }
  g.restore();
  g.strokeStyle = 'rgba(190,205,225,0.35)'; g.lineWidth = 1.5 * dpr; g.beginPath(); g.arc(h, h, h - 1, 0, 7); g.stroke();
}

// banners, captions, popups, tutorial prompts
function banner(a, b, t = 2.2) {
  const el = $('banner');
  el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b || '';
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  G.bannerT = t;
}
function caption(text, t = 4) { const el = $('caption'); el.textContent = text; el.classList.remove('hidden'); G.capT = t; }
const PP = { x: 0, y: 0, z: 0 };
function popup(text, x, z, color, big) {
  R.project(x, 1.5, z, PP);
  if (PP.z > 1 || PP.x < 20 || PP.x > innerWidth - 20 || PP.y < 90 || PP.y > innerHeight - 20) return;
  if ($('popups').childElementCount > 6) return;
  const d = document.createElement('div');
  d.className = 'pop' + (big ? ' big' : ''); d.textContent = text; d.style.left = PP.x + 'px'; d.style.top = PP.y + 'px';
  if (color) d.style.color = color;
  $('popups').appendChild(d);
  setTimeout(() => d.remove(), 1200);
  return d;
}
// one core label at a time, just above the construct
function corePop(text, C, color, big) {
  if (G.corePop) G.corePop.remove();
  G.corePop = popup(text, C.x, C.z - (C.R || 6) - 2.5, color, big) || null;
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    steer: { key: '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the <kbd>ARROW KEYS</kbd> (or point with the mouse)', pad: 'the left stick', touch: 'your left thumb' },
    fire: { key: '<kbd>SPACE</kbd> (or the left mouse button)', pad: '<kbd>A</kbd> or the right trigger', touch: 'the <kbd>FIRE</kbd> button' },
    bomb: { key: '<kbd>SHIFT</kbd> or <kbd>B</kbd> (or the right mouse button)', pad: '<kbd>B</kbd>, <kbd>X</kbd> or a bumper', touch: 'the <kbd>CHARGE</kbd> button' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  steer: () => `Steer with ${keyName('steer')}: the ship turns toward the way you push and carries its speed when you let go.`,
  shoot: () => `Fire with ${keyName('fire')}. Shoot the big <b>ASTEROID</b> ahead: the green glints are <b>CRYSTALS</b>, and hits knock them loose.`,
  collect: () => `A crystal! Fly through it to scoop it up. Every crystal becomes a <b>NOVA CHARGE</b> in your rack (up to ${F.maxBombs}).`,
  gather: () => `Keep mining. The scanner (top right) shows rocks, crystals, machines and the <b>CONSTRUCT</b> (orange).`,
  gath: () => `A <b>GATHERER</b>. It steals free crystals and flies them to the construct, which grows a plate for each one. Shoot it to make it drop what it carries.`,
  reaver: () => `A <b>REAVER</b>. It shoots back: when its nose glows red and a red line points at you, a shot is coming. Move off the line.`,
  bomb: () => `${keyName('bomb')} launches a <b>NOVA CHARGE</b>. Charges home in on the construct: on a half-built one they knock plates off, but you will need them when it wakes.`,
  half: () => `The construct is <b>HALF BUILT</b> (checkpoint). Now a charge that hits it <b>WAKES IT EARLY</b>, with less armour (${G.W ? strikeHP(G.W) : 4} charges instead of ${G.W ? G.W.R.kill : 5}). Strike when your rack is ready, or it wakes at full strength when finished.`,
  wake: () => `<b>IT'S AWAKE.</b> Its <b>CORE</b> opens and shuts. Charges only hurt it while the core is <b>OPEN</b> (green ring round it) and bounce off while it is shut (red). Never let it touch you.`,
  pull: () => `A red ring means its <b>TRACTOR PULL</b> is coming: fly straight away from it until the pull stops.`,
};
function tutorial(key) { if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return; const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = key === 'gather' ? 6 : 8; }

// ------------------------------------------------------------------ events from the simulation
function handleEvents(list, W, live) {
  const me = myPlayer(W);
  const mine = (e) => me && e.pid === me.id;
  const fx = R.fx;
  const X = (x) => R.X(x), Z = (z) => R.Z(z);
  const S = +settings.shake;
  for (const e of list) {
    switch (e.k) {
      case 'fire': {
        A.play('gun', { x: X(e.x), y: 0, z: Z(e.z), vol: mine(e) ? 0.3 : 0.2, gap: 0.04, vary: 0.1 });
        fx.sparks(X(e.x), 0.3, Z(e.z), { n: 2, speed: 3, s: 0.35, life: 0.08, vx: Math.cos(e.a) * 10, vz: Math.sin(e.a) * 10, r: 1, g: 0.85, b: 0.5 });
        break;
      }
      case 'hitrock': A.play('hitrock', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.35, gap: 0.05, vary: 0.2 }); fx.sparks(X(e.x), 0.4, Z(e.z), { n: 4, speed: 5, s: 0.25, life: 0.3, r: 1, g: 0.8, b: 0.55 }); if (Math.random() < 0.5) fx.dust(X(e.x), 0.3, Z(e.z), { n: 1, s0: 0.4, s1: 1.4, life: 1.2, a: 0.3, jit: 1.5, vx: Math.cos(e.a) * 2, vz: Math.sin(e.a) * 2 }); break;
      case 'chip': A.play('chip', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.6, gap: 0.05 }); fx.sparks(X(e.x), 0.4, Z(e.z), { n: 10, speed: 5, s: 0.3, life: 0.5, r: 0.4, g: 1, b: 0.85 }); fx.debris(X(e.x), 0.3, Z(e.z), { n: 4, speed: 4, size: 0.18 }); break;
      case 'collect': {
        A.play('collect', { x: X(e.x), y: 0, z: Z(e.z), vol: mine(e) ? 0.75 : 0.45, gap: 0.03 });
        if (!e.full) A.play('bombarm', { vol: mine(e) ? 0.45 : 0.2, delay: 0.12, gap: 0.05 });
        fx.sparks(X(e.x), 0.4, Z(e.z), { n: 12, speed: 4, s: 0.35, life: 0.45, r: 0.4, g: 1, b: 0.85 });
        if (live && mine(e)) { if (e.full && !G.fullT) { popup('RACK FULL', e.x, e.z, '#7dffe0'); G.fullT = 1; setTimeout(() => { G.fullT = 0; }, 4000); } bump('bombs-w'); }
        break;
      }
      case 'grab': fx.sparks(X(e.x), 0, Z(e.z), { n: 5, speed: 2, s: 0.25, life: 0.3, r: 0.4, g: 1, b: 0.85 }); break;
      case 'fade': fx.sparks(X(e.x), 0.2, Z(e.z), { n: 4, speed: 1.5, s: 0.2, life: 0.4, r: 0.4, g: 1, b: 0.85 }); break;
      case 'deliver': fx.sparks(X(e.x), 0, Z(e.z), { n: 10, speed: 3, s: 0.3, life: 0.5, r: 0.4, g: 1, b: 0.85 }); break;
      case 'build': {
        A.play('build', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, gap: 0.1 });
        fx.sparks(X(e.x), 2, Z(e.z), { n: 22, speed: 7, s: 0.3, life: 0.7, r: 1, g: 0.75, b: 0.35 });
        if (live && e.pieces === e.N - 2 && W.mode !== 'deep') caption('THE CONSTRUCT IS NEARLY COMPLETE', 2.5);
        break;
      }
      case 'knock': {
        A.play('knock', { x: X(e.cx), y: 0, z: Z(e.cz), vol: 1, gap: 0 });
        A.play('bombhit', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.7, gap: 0 });
        fx.explode(X(e.x), 0.5, Z(e.z), 2.2, { metal: true, color: 0xb890ff, ringColor: 0xc8b0ff });
        R.shock(e.x, e.z, 0.8); R.addTrauma(0.25 * S); R.flashScreen(0.08, 0xc8b0ff);
        if (live) { popup(e.lost ? `-${e.lost} PLATES` : 'PLATES HOLD', e.cx, e.cz, '#c8b0ff', true); if (mine(e)) rumble(0.4, 0.4, 160); }
        break;
      }
      case 'warpin': A.play('warpin', { x: X(e.x), y: 0, z: Z(e.z), vol: e.type === 'reaver' ? 0.7 : 0.45, gap: 0.1 }); fx.ring(X(e.x), 0, Z(e.z), 3, e.type === 'reaver' ? 0xff5a4a : 0xffc04a); break;
      case 'hit': A.play('hit', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.45, gap: 0.03 }); fx.sparks(X(e.x), 0.4, Z(e.z), { n: 6, speed: 6 }); break;
      case 'kill': {
        R.breakEnemy(e.id, { vx: e.vx, vz: e.vz, power: e.type === 'reaver' ? 1.2 : 0.9 });
        const big = e.type === 'reaver';
        A.play(big ? 'boomM' : 'pop', { x: X(e.x), y: 0, z: Z(e.z), vol: big ? 0.85 : 0.65, gap: 0.03 });
        if (big) A.play('debris', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.35, delay: 0.15, gap: 0.2 });
        fx.explode(X(e.x), 0.3, Z(e.z), big ? 1.8 : 1.0, { metal: true, vx: e.vx, vz: e.vz, color: big ? 0xff7050 : 0xffc070 });
        if (big) { R.shock(e.x, e.z, 0.5); R.addTrauma(0.12 * S); if (live) rumble(0.25, 0.3, 110); }
        if (live && e.pid && G.mode !== 'demo') popup(`+${e.score}`, e.x, e.z, e.carry ? '#7dffe0' : null);
        break;
      }
      case 'tell': A.play('tell', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.55, gap: 0.12 }); break;
      case 'bolt': A.play('bolt', { x: X(e.x), y: 0, z: Z(e.z), vol: e.ab ? 0.35 : 0.55, gap: 0.05, rate: e.ab ? 1.3 : 1 }); break;
      case 'boltrock': fx.sparks(X(e.x), 0.3, Z(e.z), { n: 5, speed: 4, r: 1, g: 0.3, b: 0.3, life: 0.3 }); break;
      case 'mine': if (Math.random() < 0.6) A.play('tell', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.18, rate: 1.6, gap: 0.3 }); fx.sparks(X(e.rx), 0.5, Z(e.rz), { n: 3, speed: 3, life: 0.3, r: 1, g: 0.5, b: 0.25 }); break;
      case 'plink': fx.sparks(X(e.x), 0.4, Z(e.z), { n: 3, speed: 4, life: 0.2, r: 1, g: 0.8, b: 0.5 }); A.play('hit', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.2, gap: 0.08, rate: 0.7 }); break;
      case 'rockbreak': A.play('rockbreak', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, gap: 0.1 }); fx.debris(X(e.x), 0, Z(e.z), { n: 16, speed: 5, size: 0.4 + e.r * 0.08, life: 4 }); fx.dust(X(e.x), 0, Z(e.z), { n: 10, s0: 1.5, s1: e.r * 1.4, life: 3.5, a: 0.4, jit: 3, k: 0.7, spread: e.r }); R.addTrauma(0.08 * S); break;
      case 'bomb': A.play('bomb', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.85, gap: 0.05 }); fx.fire(X(e.x), 0.3, Z(e.z), { n: 6, s: 0.8, sp: 0.4, jit: 2 }); if (live && mine(e)) rumble(0.25, 0.4, 90); break;
      case 'bombpop': A.play('bombpop', { x: X(e.x), y: 0, z: Z(e.z), vol: e.why === 'fuel' ? 0.4 : 0.8, gap: 0.05 }); fx.explode(X(e.x), 0.4, Z(e.z), e.why === 'fuel' ? 0.8 : 1.4, { color: 0xb890ff, ringColor: 0xc8b0ff }); if (live && e.why === 'shot') popup('CHARGE SHOT DOWN', e.x, e.z, '#ff8a80'); break;
      case 'bombhit': {
        A.play('bombhit', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, gap: 0 });
        A.play('knock', { x: X(e.cx), y: 0, z: Z(e.cz), vol: 0.9, delay: 0.08, gap: 0 });
        fx.explode(X(e.x), 0.8, Z(e.z), 3.2, { metal: true, color: 0xc8a0ff, ringColor: 0xd8c0ff });
        if (R.cView) R.cView.hit = 1;
        R.shock(e.x, e.z, 1.2); R.addTrauma(0.4 * S); R.flashScreen(0.14, 0xd8c0ff);
        if (live) { popup(e.hp > 0 ? `${e.hp} TO GO` : 'CRITICAL', e.cx, e.cz, '#d8c0ff', true); rumble(0.6, 0.5, 220); }
        if (G.mode === 'demo' && e.hp === 1) caption('AUTOPILOT · ONE MORE CHARGE', 2);
        break;
      }
      case 'shield': {
        A.play('shieldhit', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, gap: 0 });
        const v = R.views.p.get(e.pid); if (v) v.hurt = 1;
        fx.sparks(X(e.x), 0.4, Z(e.z), { n: 16, speed: 6, r: 0.5, g: 0.85, b: 1 });
        if (live) {
          if (mine(e)) { rumble(0.5, 0.6, 200); popup(e.left ? `SHIELD ${e.left} LEFT` : 'SHIELD GONE', e.x, e.z, '#9fd8ff'); }
          if (G.mode === 'demo') { R.frameShot([[e.x, e.z], [e.fx, e.fz]], 1.0); slowmo(0.4, 0.55); }
        }
        break;
      }
      case 'death': {
        R.breakPlayer(e.pid, { power: 1.3, vx: e.vx, vz: e.vz });
        A.play('death', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, gap: 0 });
        fx.explode(X(e.x), 0.5, Z(e.z), 2.6, { metal: true, color: 0x9fd8ff, vx: e.vx * 0.3, vz: e.vz * 0.3 });
        R.flashScreen(0.3, 0xffc890); R.addTrauma(0.7 * S); R.shock(e.x, e.z, 1);
        if (live) {
          if (mine(e)) { rumble(1, 1, 520); slowmo(0.4, 0.6); }
          if (G.mode === 'demo') R.frameShot([[e.x, e.z], [e.fx ?? e.x, e.fz ?? e.z]], 1.2);
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'death' };
          if (W.lives === 1 && !G.lastLife) { G.lastLife = true; say('lastlife', { chance: 0.8, delay: 2.4 }); }
          caption(`LOST TO ${({ bolt: 'A REAVER BOLT', ram: 'A REAVER RAMMING YOU', construct: 'THE CONSTRUCT' })[e.cause] || String(e.cause).toUpperCase()}`, 2.2);
        }
        break;
      }
      case 'eat': A.play('eat', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, gap: 0 }); break;
      case 'spawn': A.play('spawn', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8 }); fx.ring(X(e.x), 0, Z(e.z), 6, 0x9fd8ff); R.shock(e.x, e.z, 0.7); fx.sparks(X(e.x), 0.3, Z(e.z), { n: 20, speed: 5, r: 0.5, g: 0.85, b: 1 }); break;
      case 'bump': if (live && mine(e)) { A.play('hitrock', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.5, rate: 0.6, gap: 0.2 }); rumble(0.2, 0.2, 80); } fx.dust(X(e.x), 0, Z(e.z), { n: 3, s0: 0.5, s1: 1.6, life: 1.4, a: 0.3 }); break;
      case 'checkpoint':
        if (live) {
          A.play('upgrade', { vol: 0.6, gap: 0 });
          if (e.cp === 1) { banner('CHECKPOINT', 'THE CONSTRUCT IS HALF BUILT', 2.2); if (!G.saidHalf) { G.saidHalf = true; say('half', { chance: 0.85, delay: 0.5 }); } }
        }
        break;
      case 'wake': {
        A.play('alarm', { vol: 0.8, gap: 0 });
        A.play('awake', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, delay: 0.3, gap: 0 });
        A.playMusic('boss', 1);
        R.flashScreen(0.25, 0xff7a4a); R.addTrauma(0.5 * S); R.shock(e.x, e.z, 1.8);
        fx.ring(X(e.x), 0, Z(e.z), 22, 0xff6a3a); fx.ring(X(e.x), 0, Z(e.z), 12, 0xffb347);
        if (live) {
          banner('WARNING', `${CONSTRUCTS[e.key].name} IS AWAKE`, 2.8);
          say('boss', { key: true, delay: 0.6 });
          rumble(0.8, 0.6, 600);
          if (G.mode === 'demo') { R.frameShot([[e.x, e.z]], 2.2); slowmo(0.5, 1.2); }
        }
        break;
      }
      case 'hunt': A.play('roar', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, gap: 0 }); break;
      case 'pulltell': A.play('roar', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.7, rate: 1.15, gap: 0.5 }); if (live && G.mode === 'demo') caption('TRACTOR PULL COMING · THE AUTOPILOT RUNS', 2); break;
      case 'pull': A.play('tractor', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, gap: 0 }); R.addTrauma(0.15 * S); break;
      case 'ltell': A.play('roar', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, rate: 1.35, gap: 0.3 }); break;
      case 'lunge': A.play('tractor', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, rate: 1.4, gap: 0 }); R.addTrauma(0.3 * S); break;
      case 'summon': A.play('warpin', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, rate: 0.8, gap: 0 }); if (live) caption(`IT CALLED IN ${e.n} REAVER${e.n > 1 ? 'S' : ''}`, 2); break;
      case 'repair': A.play('build', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, gap: 0.2 }); if (live) popup('REPAIRED', e.x, e.z, '#ffb347'); break;
      case 'cboom': A.play('boomM', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, gap: 0.08 }); fx.explode(X(e.x), 1, Z(e.z), 2.4, { metal: true }); R.addTrauma(0.2 * S); R.throwPlates(1, { power: 2 }); break;
      case 'cdying': A.play('boomL', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, gap: 0 }); slowmo(0.4, 1.4); R.addTrauma(0.6 * S); R.frameShot([[e.x, e.z]], 2.6); if (live) rumble(0.9, 0.9, 900); break;
      case 'ckill':
        R.breakConstruct();
        A.play('boomL', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, rate: 0.8, gap: 0 });
        fx.explode(X(e.x), 1, Z(e.z), 6, { metal: true, rock: true, color: 0xffb070 }); fx.explode(X(e.x) + 3, 1, Z(e.z) - 2, 4, { metal: true }); fx.debris(X(e.x), 1, Z(e.z), { metal: true, n: 30, speed: 12, size: 0.6, trail: true });
        fx.ring(X(e.x), 0, Z(e.z), 30, 0xffd0a0);
        R.flashScreen(0.5, 0xffd8b0); R.addTrauma(0.9 * S); R.shock(e.x, e.z, 2.2);
        if (live) {
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'boss' };
          popup('+' + e.bonus.toLocaleString(), e.x, e.z, null, true);
          say('bossdown', { key: true, delay: 1 });
          if (W.mode === 'campaign') A.sting('clear'); else setTimeout(() => { if (G.W === W) A.playMusic(SECTORS[W.k].music); }, 3500);
        }
        break;
      case 'newsite': if (live) { banner(`CONSTRUCT ${W.waveN + 1}`, `${SECTORS[e.look].name} · ${CONSTRUCTS[e.key].name}`, 3); R.setLook(e.look); } break;
      case 'clear': if (live) banner('SECTOR CLEAR', `+${e.bonus.toLocaleString()} · ${fmtT(e.t)}`, 3); break;
      case 'tut': if (live) tutorial(e.key); break;
      case 'strike':
        A.play('bombhit', { x: X(e.x), y: 0, z: Z(e.z), vol: 1, gap: 0 });
        fx.explode(X(e.x), 0.8, Z(e.z), 3, { metal: true, color: 0xc8a0ff, ringColor: 0x52ffd8 });
        if (R.cView) R.cView.hit = 1;
        R.shock(e.x, e.z, 1.2); R.addTrauma(0.4 * S);
        if (live) banner('EARLY STRIKE', `IT WAKES HALF BUILT · ${e.hp} CHARGES INTO ITS OPEN CORE`, 2.6);
        break;
      case 'deflect':
        A.play('hit', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, rate: 0.55, gap: 0.05 }); A.play('bombpop', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.6, gap: 0.05 });
        fx.sparks(X(e.x), 0.8, Z(e.z), { n: 20, speed: 9, r: 1, g: 0.5, b: 0.4 }); fx.ring(X(e.x), 0, Z(e.z), 3, 0xff6a4a);
        if (live && mine(e) && !G.deflT) { popup(e.waking ? 'ARMOURED WHILE IT WAKES' : 'BOUNCED OFF · CORE SHUT', e.cx, e.cz, '#ff8a80', true); G.deflT = 1; setTimeout(() => { G.deflT = 0; }, 1500); }
        break;
      case 'coreopen': A.play('tell', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.8, rate: 0.6, gap: 0.3 }); fx.ring(X(e.x), 0, Z(e.z), 9, 0x7dff9a); if (live && W.C) corePop('CORE OPEN', W.C, '#8dff8a', true); break;
      case 'coreshut': A.play('build', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, rate: 1.2, gap: 0.3 }); if (live && W.C) corePop('CORE SHUT', W.C, '#ff8a80'); break;
      case 'empty': if (live && mine(e)) { A.play('uiback', { vol: 0.6, gap: 0.3 }); popup('NO CHARGES · MINE CRYSTALS', me.x, me.z, '#ff8a80'); if (isAwake(W.C) && !G.saidEmpty) { G.saidEmpty = true; say('empty', { chance: 0.7 }); } } break;
      case 'drop': fx.ring(X(e.x), 0, Z(e.z), 2.5, POWERUPS[e.kind].color); fx.sparks(X(e.x), 0.5, Z(e.z), { n: 10, speed: 3, life: 0.6 }); break;
      case 'pickup': {
        const P = POWERUPS[e.kind];
        A.play('pickup', { x: X(e.x), y: 0, z: Z(e.z), vol: 0.9, gap: 0 });
        fx.ring(X(e.x), 0, Z(e.z), 3.5, P.color); fx.sparks(X(e.x), 0.5, Z(e.z), { n: 24, speed: 5, life: 0.7 }); fx.flash(X(e.x), 1, Z(e.z), 14, P.color, 0.3);
        if (live) { popup(P.name, e.x, e.z, '#' + P.color.toString(16).padStart(6, '0'), true); if (mine(e)) rumble(0.2, 0.4, 120); }
        break;
      }
      case 'pwend': if (live && mine(e)) A.play('pwend', { vol: 0.5, gap: 0.2 }); break;
      case 'life': if (live) { A.play('life', { vol: 0.9, gap: 0 }); caption('+1 SHIP', 2.5); } break;
    }
  }
}
function bump(id) { const el = $(id); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'SHOT DOWN', 'CO-OP'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (W.mode === 'deep') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'DEEP FIELD OVER', `${W.waveN} CONSTRUCT${W.waveN === 1 ? '' : 'S'} DOWN · ${fmtT(W.fightT)}`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT, k = bestKey(W.diff, s);
    if (!best[k] || t < best[k]) { best[k] = t; store('sn.best.v1', best); }
    reach = Math.max(reach, Math.min(4, s + 1)); store('sn.reach.v1', reach);
    const got = [];
    const award = (id) => { if (W.diff !== 'easy' && !medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0 && !G.run.contSector) award(`s${s}clean`);
    if (W.stats.bombsAtWake >= (W.stats.wakeHP || 99) + (W.stats.early ? 1 : 0)) award(`s${s}ready`);
    if (t <= parTime(s) && !G.run.contSector) award(`s${s}par`);
    store('sn.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1; G.run.contSector = false;
    G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
    G.run.lastTime = t; G.run.got = got;
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'THE BELT IS FREE', 'ALL FIVE CONSTRUCTS DESTROYED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  G.contFrom = { sector: s, cp: W.cp, bombs: W.cpBombs[W.cp] };
  results(W, 'SHOT DOWN', `SECTOR ${s + 1} · ${SECTORS[s].name} · ${CP_NAMES[W.cp]}`, true);
}
function playthroughNext(W) {
  const s = W.sector;
  if (W.result !== 'clear') {
    G.run.tries++;
    G.run.score = G.run.score0; G.run.lives = START_LIVES + 2;
    banner('RETRY', `THE AUTOPILOT TAKES ${SECTORS[s].name} AGAIN FROM ${CP_NAMES[W.cp]}`, 2.5);
    const cp = W.cp, bombs = W.cpBombs[W.cp];
    G.ptT = setTimeout(() => { if (G.mode === 'playthrough') beginSector(s, cp, bombs); }, 1800);
    return;
  }
  G.run.score = W.score; G.run.lives = W.lives + 1;
  G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
  G.run.lastTime = W.secT;
  if (s >= SECTORS.length - 1) {
    G.run.got = [];
    results(W, 'AI PLAYTHROUGH COMPLETE', `ALL FIVE SECTORS · ${G.run.tries ? G.run.tries + (G.run.tries > 1 ? ' RETRIES' : ' RETRY') : 'NO RETRIES'}`);
    return;
  }
  const bought = aiShop();
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${s + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(W.secT)} · AUTOPILOT BOUGHT: ${bought.length ? bought.join(', ') : 'NOTHING YET (SAVING UP)'}`;
  $('next-sub').textContent = `Sector ${s + 2} · ${SECTORS[s + 1].name} · starts in a moment`;
  renderUpgrades();
  show('upgrades', false);
  for (const el of document.querySelectorAll('#upgrid .upg')) if (bought.includes(UPGRADES[el.dataset.up].name)) el.classList.add('sel');
  A.play('upgrade', { gap: 0, vol: 0.7 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'playthrough' && G.state === 'upgrade') beginSector(s + 1); }, 6000);
}
function upgrades(W) {
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${W.sector + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(G.run.lastTime)} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR SHIP'}`;
  $('next-sub').textContent = `Sector ${W.sector + 2} · ${SECTORS[W.sector + 1].name}`;
  renderUpgrades();
  show('upgrades', false);
  A.playMusic('title');
  say('clear', { key: true, delay: 1.5 });
}
function renderUpgrades() {
  $('salv').textContent = G.run.salvage.toLocaleString();
  $('upgrid').innerHTML = UP_KEYS.map((k) => {
    const U = UPGRADES[k], lv = G.run.up[k] || 0, max = lv >= U.max, cost = UP_COST[lv];
    const poor = !max && G.run.salvage < cost;
    return `<button class="upg ${max ? 'max' : ''} ${poor ? 'poor' : ''}" data-up="${k}" style="--uc:${U.color}"><i>${U.icon}</i><b>${U.name}</b><span class="lvl">${Array.from({ length: U.max }, (_, i) => `<em class="${i < lv ? 'on' : ''}"></em>`).join('')}</span><small>${U.desc}</small><span class="cost">${max ? 'FITTED' : cost + ' SALVAGE'}</span></button>`;
  }).join('');
}
function buy(k) {
  if (G.mode === 'playthrough') return;
  const U = UPGRADES[k], lv = G.run.up[k] || 0;
  if (lv >= U.max) return;
  const cost = UP_COST[lv];
  if (G.run.salvage < cost) { A.play('uiback', { gap: 0 }); return; }
  G.run.salvage -= cost; G.run.up[k] = lv + 1;
  A.play('upgrade', { gap: 0 });
  const sel = selEl && selEl.dataset.up;
  renderUpgrades();
  if (sel) setSel(document.querySelector(`[data-up="${sel}"]`));
}
function results(W, title, sub, canContinue = false) {
  G.state = 'results'; setHud(false);
  $('res-title').textContent = title; $('res-sub').textContent = sub + ' · ' + DL(W.diff);
  const st = [['SCORE', W.score.toLocaleString()]];
  if (W.mode === 'deep') st.push(['CONSTRUCTS DOWN', W.waveN], ['TIME', fmtT(W.fightT)]);
  else st.push(['SECTOR TIME', fmtT(W.secT)]);
  st.push(['CRYSTALS SCOOPED', W.stats.crystals], ['CHARGES LAUNCHED', `${W.stats.bombs} (${W.stats.bombHits} HIT)`], ['GATHERERS / REAVERS DOWN', `${W.stats.gath} / ${W.stats.reav}`], ['SHIPS LOST', W.stats.deaths]);
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · S${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The construct going down' : 'The last hit, exactly as it happened';
  const cont = canContinue && G.mode === 'campaign';
  $('cont-btn').classList.toggle('hidden', !cont);
  if (cont) $('cont-sub').textContent = `Back in at ${CP_NAMES[G.contFrom.cp]} with ${START_LIVES} ships · your score goes back to the sector start`;
  const board = boardOf(W.mode, W.diff);
  G.board = board; G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, level: W.mode === 'deep' ? W.waveN : W.sector + 1 };
    $('ini-wrap').classList.remove('hidden');
    renderIni();
  }
  show('results', false);
  if (cont) setSel($('cont-btn'));
}
function renderIni() { const b = $('ini').children; for (let i = 0; i < 3; i++) { b[i].textContent = G.ini.chars[i]; b[i].className = i === G.ini.i ? 'cur' : ''; } }
async function finishResults() {
  if (G.ini) { const q = G.ini; G.ini = null; await G.board.submit(q.chars.join(''), q.score, q.level); }
  toTitle();
}
function continueRun() {
  const c = G.contFrom; if (!c || !G.run) return;
  G.ini = null;
  G.run.continues++; G.run.contSector = true;
  G.run.score = G.run.score0; G.run.lives = START_LIVES + DIFFICULTY[G.run.diff || 'normal'].lives;
  A.play('uiok', { gap: 0 });
  beginSector(c.sector, c.cp, c.bombs);
}

// ------------------------------------------------------------------ instant replay
function captureClip(W) {
  const p = G.pendingClip;
  if (!p || W.n < p.n + Math.round(1.6 / STEP)) return;
  G.pendingClip = null;
  const c = REC.clip(p.n);
  if (c) { c.kind = p.kind; G.clip = c; }
}
function playReplay() {
  if (!G.clip) return;
  G.afterReplay = { screen: G.screen, state: G.state };
  hideScreens();
  G.replay = new Replay(structuredClone(G.clip.snap), G.clip.inputs, G.clip.keyN, G.clip.endN);
  G.state = 'replay';
  $('letterbox').classList.remove('hidden');
  setHud(false);
  A.play('rewind', { gap: 0 });
  say('replay', { cd: 60, chance: 0.6 });
  R.setLook(G.replay.W.k);
  const p = G.replay.W.players[0];
  R.cx = p.x; R.cz = p.z;
}
function endReplay() {
  G.replay = null; R.shot = null;
  $('letterbox').classList.add('hidden');
  A.setRate(1);
  const a = G.afterReplay || { state: 'title' };
  G.state = a.state;
  if (a.screen) show(a.screen, false); else toTitle();
}

// ------------------------------------------------------------------ pause
function pause() {
  if (G.state !== 'play' || G.mode === 'demo') return;
  if (G.mode === 'playthrough') { toTitle(); return; }
  if (G.mode === 'online') { show('pause'); $('pause-sub').textContent = 'ONLINE · THE FIGHT KEEPS GOING'; G.state = 'paused-online'; return; }
  G.state = 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.W.mode === 'deep' ? `DEEP FIELD · ${G.W.waveN} DOWN` : `SECTOR ${G.W.sector + 1} · ${CP_NAMES[G.W.cp]}`;
  $('pause-replay').classList.toggle('hidden', !G.clip);
  show('pause', false);
}
function resume() { if (G.state === 'paused' || G.state === 'paused-online') { G.state = 'play'; A.muffle(false); hideScreens(); } }

// ------------------------------------------------------------------ online co-op
function netStatus(text, kind) {
  const el = $('net-status');
  if (text === 'waiting') { el.textContent = 'Waiting for your wingmate to join…'; el.className = ''; return; }
  el.textContent = text; el.className = kind === 'error' ? 'error' : '';
}
function netJoined(peer) {
  A.play('uiok', { gap: 0 });
  netStatus(`${peer.ini || 'A pilot'} is here.` + (NET.host ? ' Pick the route and start.' : ' Waiting for the host to start…'));
  $('net-go').classList.toggle('hidden', !NET.host);
  if (NET.host) setSel($('net-go'));
  say('partner', { key: true });
}
function netLeft(why) {
  if (G.mode === 'online' && G.state !== 'results') { caption(why === 'lost' ? 'CONNECTION LOST' : 'YOUR WINGMATE LEFT', 4); setTimeout(() => { if (G.mode === 'online') toTitle(); }, 2500); }
  else netStatus(why === 'lost' ? 'Connection lost' : 'Your wingmate left', 'error');
}
function hostStart() {
  const route = settings.netRoute;
  const cfg = route === 'deep' ? { gm: 'deep', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] }, diff: settings.diff };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'deep' ? 'deep' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives: START_LIVES + 1 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives, noTut: true, diff: cfg.diff });
  NET.bind(W);
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  banner('CO-OP', cfg.gm === 'deep' ? 'DEEP FIELD' : SECTORS[cfg.sector || 0].name, 3);
}
window.__sn.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'deep': A.play('uiok', { gap: 0 }); startDeep(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': buildLiveries(); show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1); break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
    case 'continue': continueRun(); break;
    case 'resume': resume(); break;
    case 'pause': pause(); break;
    case 'quit': clearTimeout(G.ptT); toTitle(); break;
    case 'net-quick': NET.quick({ ini: HS.initials() }); break;
    case 'net-host': { const code = randomCode(4); $('room-code').textContent = code; $('room-wrap').classList.remove('hidden'); NET.connect(ROOM + code, 'host', { ini: HS.initials() }); break; }
    case 'net-join': { const code = cleanCode($('join-code').value); if (code.length !== 4) { netStatus('Type the 4-letter room code', 'error'); return; } NET.connect(ROOM + code, 'join', { ini: HS.initials() }); netStatus('Joining…'); break; }
    case 'net-go': hostStart(); break;
    case 'net-back': NET.close(); goBack(); break;
  }
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act], [data-up], [data-sector], [data-tab], [data-hd], .seg button');
  if (!t) return;
  A.unlock();
  if (t.dataset.act) act(t.dataset.act);
  else if (t.dataset.up) buy(t.dataset.up);
  else if (t.dataset.sector !== undefined) { if (!t.hasAttribute('disabled')) { A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sector); } }
  else if (t.dataset.tab) renderScores(t.dataset.tab);
  else if (t.dataset.hd) renderScores(G.scoreTab || 'campaign', t.dataset.hd);
  else if (t.parentElement.dataset.opt) { settings[t.parentElement.dataset.opt] = t.dataset.v; saveSettings(); applySettings(); syncSegs(); A.play('uimove', { gap: 0 }); }
});
$('ini').addEventListener('click', (e) => { const b = e.target.closest('b'); if (!b || !G.ini) return; const i = [...$('ini').children].indexOf(b); if (G.ini.i === i) cycleIni(1); G.ini.i = i; renderIni(); });
for (const inp of document.querySelectorAll('[data-set]')) {
  inp.value = settings[inp.dataset.set];
  inp.addEventListener('input', () => { settings[inp.dataset.set] = +inp.value; saveSettings(); applySettings(); });
}
function syncSegs() { for (const s of document.querySelectorAll('.seg')) for (const b of s.children) b.classList.toggle('on', String(settings[s.dataset.opt]) === b.dataset.v); }
function liveryOf(key) { const s = LIVERIES.find((q) => q.key === key) || LIVERIES[0]; return medals.size >= s.medals ? s : LIVERIES[0]; }
function buildLiveries() {
  $('liveries').innerHTML = LIVERIES.map((s) => { const open = medals.size >= s.medals; return `<button data-v="${s.key}" ${open ? '' : 'disabled'} style="--sc:#${s.color.toString(16).padStart(6, '0')}">${open ? '' : '🔒'}${s.name}${open ? '' : ' · ' + s.medals}</button>`; }).join('');
}
function applySettings() {
  { const s = liveryOf(settings.livery); if (R.livery.key !== s.key) R.setLivery(s); }
  if ($('diff-desc')) $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  if (G.state === 'title') $('title-best').textContent = `BEST ${Math.max(boardOf('campaign', settings.diff).best(), 0).toLocaleString()} · ${DL(settings.diff)}`;
  A.vol.music = settings.music / 100 * 0.8; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100; A.applyVolumes();
  if (settings.talk === 'off') A.hush();
  applyCalm();
  if (G.state === 'play') { setHud(true); const me = G.W && myPlayer(G.W); if (me && me.id === 1 && G.mode !== 'demo' && G.mode !== 'playthrough') me.assist = assistOf(); }
}
applySettings();
function cycleIni(d) { const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const c = G.ini.chars[G.ini.i]; G.ini.chars[G.ini.i] = C[(C.indexOf(c) + d + C.length) % C.length]; renderIni(); A.play('uimove', { gap: 0 }); }
function buildSectors() {
  $('secgrid').innerHTML = SECTORS.map((s, i) => {
    const open = i <= reach;
    const m = MEDALS.filter((q) => q.sector === i).map((q) => (medals.has(q.id) ? '★' : '☆')).join('');
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>SECTOR ${i + 1} · ${CONSTRUCTS[s.boss].name}</b><span>${s.name}</span><small>${open ? (best[bestKey(settings.diff, i)] ? 'BEST ' + fmtT(best[bestKey(settings.diff, i)]) + ' · ' + DL(settings.diff) : 'NOT CLEARED YET') : 'LOCKED'}</small><div class="md">${m}</div></button>`;
  }).join('');
}
function buildMedals() {
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} EARNED`;
  $('medlist').innerHTML = SECTORS.map((s, i) => `<h3>SECTOR ${i + 1} · ${s.name}</h3><div class="medrow">${MEDALS.filter((m) => m.sector === i).map((m) => `<span class="medal ${medals.has(m.id) ? 'on' : ''}" title="${m.desc}">${medals.has(m.id) ? '🏅' : '○'} ${m.name} <small style="opacity:.7">· ${m.desc}</small></span>`).join('')}</div>`).join('');
}
async function renderScores(tab, diff = G.scoreDiff || settings.diff) {
  G.scoreTab = tab; G.scoreDiff = diff;
  for (const b of document.querySelectorAll('[data-tab]')) b.classList.toggle('primary', b.dataset.tab === tab);
  for (const b of document.querySelectorAll('[data-hd]')) b.classList.toggle('primary', b.dataset.hd === diff);
  const board = boardOf(tab, diff);
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${tab === 'deep' ? '×' + (r.level || 0) : 'S' + (r.level || 1)}</td><td>${r.score.toLocaleString()}</td></tr>`;
  const L = board.local();
  $('hs-local').innerHTML = L.length ? L.map(row).join('') : '<tr><td></td><td>No scores yet</td></tr>';
  $('hs-global').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => `<div class="stat"><span>S${i + 1} · ${s.name}</span><b>${best[bestKey(diff, i)] ? fmtT(best[bestKey(diff, i)]) : '—'}</b></div>`).join('');
  const g = await board.fresh();
  if (G.scoreTab !== tab || G.scoreDiff !== diff) return;
  $('hs-global').innerHTML = g && g.length ? g.map(row).join('') : `<tr><td></td><td>${g ? 'No scores yet' : 'Offline'}</td></tr>`;
}

// keyboard / pad in menus and in play
I.on('any', () => { G.idleT = 0; if (G.mode === 'demo' && G.state === 'play' && performance.now() - G.demoStartT > 600) { A.unlock(); toTitle(); } });
I.on('pause', () => { if (G.state === 'play') pause(); else if (G.state === 'paused' || G.state === 'paused-online') resume(); else if (G.state === 'replay') endReplay(); else if (G.screen && G.screen !== 'title') act('back'); });
I.on('confirm', () => { if (G.screen && selEl) selEl.click(); });
I.on('back', () => { if (G.screen && G.screen !== 'title' && G.screen !== 'results' && G.screen !== 'upgrades') act('back'); });
I.on('key', (k, e) => {
  A.unlock();
  if (G.state === 'replay' && (k === 'Enter' || k === 'Space' || k === 'Escape')) { endReplay(); return; }
  if (G.ini && G.screen === 'results' && (!selEl || selEl.id !== 'cont-btn' || /^Key[A-Z]$/.test(k))) {
    if (/^Key[A-Z]$/.test(k) || /^Digit[0-9]$/.test(k)) { G.ini.chars[G.ini.i] = k.slice(-1); G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); A.play('uimove', { gap: 0 }); return; }
    if (k === 'ArrowUp') { cycleIni(1); return; } if (k === 'ArrowDown') { cycleIni(-1); return; }
    if (k === 'ArrowLeft') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return; } if (k === 'ArrowRight') { G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); return; }
    if (k === 'Backspace') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return; }
    if (k === 'Enter' || k === 'NumpadEnter') { finishResults(); return; }
    return;
  }
  if (!G.screen) return;
  if (e && e.target && e.target.tagName === 'INPUT' && k !== 'Enter') return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) navigate(k);
  else if ((k === 'Enter' || k === 'NumpadEnter' || k === 'Space') && selEl) { if (e) e.preventDefault(); selEl.click(); }
  else if (k === 'Backspace' && G.screen !== 'title') act('back');
});
document.addEventListener('pointerdown', () => A.unlock(), { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play') pause(); });
I.stickUI = (s) => {
  const el = $('stick');
  if (!s) { el.classList.remove('on'); return; }
  el.classList.add('on');
  el.style.left = s.sx + 'px'; el.style.top = s.sy + 'px';
  const k = el.firstElementChild, dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy), m = Math.min(l, 52) / (l || 1);
  k.style.transform = `translate(${dx * m}px, ${dy * m}px)`;
};

// ------------------------------------------------------------------ edge markers
// what matters but is off screen gets a marker at the screen edge: the construct (always, with its range),
// a reaver whose emitter is lit, and power-up pods
const WM = [];
const PE = { x: 0, y: 0, z: 0 };
function updateWarnings(W) {
  const box = $('warns');
  const list = [];
  const me = myPlayer(W);
  if (me && me.alive && G.mode !== 'demo') {
    const C = W.C;
    if (C && C.st !== 'gone') list.push({ x: C.x, z: C.z, c: isAwake(C) ? 'red big' : 'orange big', icon: '⬢', d: Math.round(Math.hypot(wd(C.x - me.x), wd(C.z - me.z))) });
    for (const e of W.enemies) if (e.type === 'reaver' && e.tell > 0) list.push({ x: e.x, z: e.z, c: 'red', icon: '!' });
    for (const q of W.pods) list.push({ x: q.x, z: q.z, c: 'pw', col: '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'), icon: POWERUPS[q.kind].glyph });
  }
  let n = 0;
  const vw = innerWidth, vh = innerHeight, top = innerWidth < 720 ? 120 : 150, pad = 34;
  for (const q of list) {
    R.project(q.x, 0, q.z, PE);
    const on = PE.z < 1 && PE.x > pad && PE.x < vw - pad && PE.y > top && PE.y < vh - pad;
    if (on) continue;
    let d = WM[n];
    if (!d) { d = document.createElement('div'); box.appendChild(d); WM.push(d); }
    n++;
    let dx = PE.x - vw / 2, dy = PE.y - vh / 2;
    if (PE.z > 1) { dx = -dx; dy = -dy; }
    const k = Math.min((vw / 2 - pad) / Math.max(1, Math.abs(dx)), (vh / 2 - pad - 40) / Math.max(1, Math.abs(dy)));
    // on touch screens keep markers above the FIRE / CHARGE buttons
    // (and on the right edge above the pause button, which sits 154-194 px up)
    const x = vw / 2 + dx * k, y = Math.min(I.touchOn ? (x > vw - 110 ? vh - 232 : vh - 170) : vh, Math.max(top, vh / 2 + dy * k));
    d.className = 'wm ' + q.c;
    d.style.display = '';
    d.style.left = x + 'px'; d.style.top = y + 'px';
    if (q.col) d.style.setProperty('--c', q.col);
    const html = `<em style="transform:rotate(${Math.atan2(dy, dx)}rad)"></em><b>${q.icon}</b>${q.d !== undefined ? `<small>${q.d} m</small>` : ''}`;
    if (d._h !== html) { d.innerHTML = html; d._h = html; }
  }
  for (let i = n; i < WM.length; i++) WM[i].style.display = 'none';
}

// ------------------------------------------------------------------ smooth motion between sim steps
// The sim runs at 120 Hz; frames land between steps. Remember where every moving thing was before the last
// step and draw it part way to where it is now (wrap-aware), then put the world back exactly as it was.
let PREV = new WeakMap();
const movers = (W) => [...W.players, ...W.enemies, ...W.bombs, ...W.shots, ...W.bolts, ...(W.C ? [W.C] : [])];
function snapPrev(W) { for (const o of movers(W)) { let p = PREV.get(o); if (!p) PREV.set(o, (p = [0, 0, 0])); p[0] = o.x; p[1] = o.z; p[2] = o.a ?? 0; } }
const SAVED = [];
function lerpIn(W, a) {
  SAVED.length = 0;
  for (const o of movers(W)) {
    const p = PREV.get(o); if (!p) continue;
    const dx = wd(o.x - p[0]), dz = wd(o.z - p[1]);
    if (Math.abs(dx) > 6 || Math.abs(dz) > 6) continue;
    SAVED.push(o, o.x, o.z, o.a);
    o.x = p[0] + dx * a; o.z = p[1] + dz * a;
    if (o.a !== undefined) { let da = (o.a - p[2]) % (Math.PI * 2); if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; o.a = p[2] + da * a; }
  }
}
function lerpOut() { for (let i = 0; i < SAVED.length; i += 4) { const o = SAVED[i]; o.x = SAVED[i + 1]; o.z = SAVED[i + 2]; if (SAVED[i + 3] !== undefined) o.a = SAVED[i + 3]; } SAVED.length = 0; }

// ------------------------------------------------------------------ the frame
let lastT = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  if (G.fixed) dt = 1 / 60;
  tickFrame(dt);
}
function tickFrame(dt, draw = true) {
  I.pollPads();
  perf(dt);
  if (G.slowT > 0) { G.slowT -= dt; if (G.slowT <= 0) { G.timeScale = 1; A.setRate(1); } }
  if (G.state === 'play' || G.state === 'paused-online') playStep(dt);
  else if (G.state === 'replay') replayStep(dt);
  else if (G.state === 'title' || (G.scenic && G.W === G.scenic)) { scenicStep(dt); R.setIntent(null); }
  const cur = G.state === 'replay' && G.replay ? G.replay.W : G.W;
  if (!cur) return;
  if (cur.k !== R.lookI) R.setLook(cur.k);
  const interp = (G.state === 'play' || G.state === 'replay') && G.mode !== 'online' && !G.fixed;
  if (interp) lerpIn(cur, Math.min(1, (G.state === 'replay' ? G.replay.acc : G.acc) / STEP));
  const me = myPlayer(cur);
  const menu = G.state === 'title' || (['sectors', 'online', 'scores', 'medals', 'options', 'help'].includes(G.screen) && G.mode === 'title');
  R.updateCamera(dt, { me: me && me.alive && !menu ? me : null, C: cur.C, cine: menu, shake: +settings.shake });
  if (draw) R.sync(cur, dt);
  if (interp) lerpOut();
  A.setListener(R.camera);
  if (G.state === 'play' || G.state === 'paused-online' || G.state === 'replay') loops(cur, dt);
  if (draw) R.render(dt, {});
  if (G.state === 'play' || G.state === 'paused-online') { updateWarnings(cur); drawScanner(cur); }
  if (G.bannerT > 0) { G.bannerT -= dt; if (G.bannerT <= 0) $('banner').classList.add('hidden'); }
  if (G.tutT > 0) { G.tutT -= dt; if (G.tutT <= 0) $('tut').classList.add('hidden'); }
  if (G.capT > 0) { G.capT -= dt; if (G.capT <= 0) $('caption').classList.add('hidden'); }
}
function playStep(dt) {
  const W = G.W;
  G.acc += dt * G.timeScale;
  let n = 0;
  const online = G.mode === 'online', guest = online && !NET.host;
  if (guest) handleEvents(NET.guestSync(W), W, true);
  while (G.acc >= STEP && n < 12) {
    if (!online) REC.tick(W);
    const me = myPlayer(W);
    if (me) {
      if (G.ai) me.input = G.ai.control(W, me);
      else me.input = G.state === 'play' ? I.control(R.X(me.x), R.Z(me.z)) : { mx: 0, mz: 0, fire: false, bomb: false };
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    snapPrev(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (guest) ev = ev.filter((e) => e.pid === 2 && ['fire', 'bomb', 'shield', 'death', 'collect', 'empty', 'bump'].includes(e.k));
    if (online && NET.host) NET.hostEvents(ev);
    handleEvents(ev, W, true);
    G.acc -= STEP; n++;
    if (W.over) break;
  }
  if (n >= 12) G.acc = 0;
  if (online) { if (NET.host) NET.hostFrame(W, dt); else NET.guestFrame(W, dt); }
  captureClip(W);
  updateHud(W);
  if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 100) W.over = true; }
  guidance(W);
  if (W.over && (G.state === 'play' || G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => onWorldOver(W), G.mode === 'demo' ? 1500 : 1300); }
}
function replayStep(dt) {
  const Rp = G.replay;
  const near = Math.abs(Rp.toKey) < 0.7;
  A.setRate(near ? 0.7 : 1);
  snapPrev(Rp.W);
  const ev = Rp.advance(dt * (near ? 0.35 : 1));
  handleEvents(ev, Rp.W, false);
  const p = Rp.W.players[0];
  if (p) R.frameShot([[p.x, p.z]], 0.3);
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  if (!W) return;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  if (W.over || W.C.st !== 'build') scenic(R.lookI);
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 20)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// what to do right now: for the autopilot its goal (and what it is dodging), for a player the next objective
function objective(W, me) {
  const C = W.C;
  if (!me || !me.alive) return 'WARPING BACK IN';
  if (!C || C.st === 'gone') return W.mode === 'deep' ? 'A NEW CONSTRUCT IS ON ITS WAY' : 'SECTOR CLEAR';
  if (C.st === 'dying') return 'IT IS BREAKING UP: KEEP CLEAR';
  if (isAwake(C)) {
    if (C.st === 'wake') return 'KEEP YOUR DISTANCE · IT IS ARMOURED UNTIL ITS CORE OPENS';
    if (me.bombs < C.hp) return me.bombs <= 0 ? 'OUT OF CHARGES · MINE CRYSTALS AWAY FROM IT' : `${C.hp - me.bombs} CHARGE${C.hp - me.bombs === 1 ? '' : 'S'} SHORT · MINE CRYSTALS BETWEEN OPENINGS`;
    return coreOpen(C) ? 'GREEN RING · LAUNCH CHARGES NOW' : `RED RING · DODGE · IT OPENS IN ${Math.max(0, C.cycT).toFixed(1)} s`;
  }
  const hp = strikeHP(W), need = hp + 1, half = Math.ceil(C.N / 2);
  if (canStrike(W)) return me.bombs >= need ? `READY · LAUNCH A CHARGE AT IT TO WAKE IT EARLY` : `HALF BUILT · ${need - me.bombs} MORE CHARGE${need - me.bombs === 1 ? '' : 'S'} TO STRIKE EARLY`;
  return `MINE CRYSTALS · SHOOT CARRIERS · STRIKE AT HALF BUILT (${C.pieces}/${half})`;
}
function guidance(W) {
  const me = myPlayer(W);
  const watch = G.ai && (G.mode === 'demo' || G.mode === 'playthrough' || G.autopilot);
  $('intent').classList.toggle('hidden', !watch);
  $('objective').classList.toggle('hidden', !!watch || G.mode === 'title');
  if (watch) {
    const d = G.ai.debug;
    setText('intent-t', d.intent || '');
    setText('intent-d', d.dodge ? '⚠ ' + d.dodge : '');
    R.setIntent(d.target, me);
  } else {
    R.setIntent(null);
    setText('objective', objective(W, me));
  }
}
// engine, drone, reaver and construct hums
function loops(W, dt) {
  const me = myPlayer(W) || W.players[0];
  const X = (x) => R.X(x), Z = (z) => R.Z(z);
  A.setLoop('thrust', X(me.x), 0, Z(me.z), me.alive ? 0.25 + (me.thrust || 0) * 0.75 : 0, 0.85 + (me.thrust || 0) * 0.35);
  let g = null, gd = 1e9, rv = null, rd = 1e9;
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0) continue;
    const d = Math.hypot(wd(e.x - me.x), wd(e.z - me.z));
    if (e.type === 'gath' && d < gd) { gd = d; g = e; } else if (e.type === 'reaver' && d < rd) { rd = d; rv = e; }
  }
  A.setLoop('gather', g ? X(g.x) : 0, 0, g ? Z(g.z) : 0, g && gd < 50 ? 0.7 : 0, 1);
  A.setLoop('reaver', rv ? X(rv.x) : 0, 0, rv ? Z(rv.z) : 0, rv && rd < 60 ? 0.85 : 0, rv ? 1 + Math.min(0.3, Math.hypot(rv.vx, rv.vz) / 40) : 1);
  const C = W.C, aw = C && isAwake(C);
  A.setLoop('construct', C ? X(C.x) : 0, 0, C ? Z(C.z) : 0, C && C.st === 'build' ? 0.9 : 0, 1);
  A.setLoop('hunt', C ? X(C.x) : 0, 0, C ? Z(C.z) : 0, aw ? 1 : 0, C && C.st === 'pull' ? 0.8 : C && C.st === 'lunge' ? 1.3 : 1);
  void dt;
}

// dynamic resolution: drop the render scale when frames run long, recover when there is headroom
function perf(dt) {
  if (G.fixed) return;
  const T = G.frameT;
  T.push(dt);
  if (T.length < 90) return;
  const s = [...T].sort((a, b) => a - b), p75 = s[Math.floor(s.length * 0.75)];
  T.length = 0;
  const now = performance.now();
  G.perfSlow = p75 > 1 / 48 && p75 < 0.25 ? (G.perfSlow || 0) + 1 : 0;
  G.perfFast = p75 < 1 / 75 ? (G.perfFast || 0) + 1 : 0;
  if (now - (G.perfT || 0) < 8000) return;
  if (G.perfSlow >= 2 && R.scale > 0.6) { R.setScale(Math.max(0.6, R.scale - 0.1)); G.perfT = now; G.perfSlow = 0; }
  else if (G.perfFast >= 4 && R.scale < 1) { R.setScale(Math.min(1, R.scale + 0.1)); G.perfT = now; G.perfFast = 0; }
}

// ------------------------------------------------------------------ boot
async function boot() {
  try { R.warmUp(); } catch (e) { console.warn('warm-up', e); }
  $('loading').style.opacity = '0';
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  boardOf('campaign', settings.diff).fresh(); boardOf('deep', settings.diff).fresh();
  if (params.has('test')) { const m = await import('./tests.js?v=3'); m.runTests(window.__sn); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (G.autopilot) { A.unlock(); if (params.has('deep')) startDeep(); else startCampaign(+params.get('sector') || 0); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__sn, {
  tick: (n = 1, dt = 1 / 60, draw = true) => { for (let i = 0; i < n; i++) tickFrame(dt, draw || i === n - 1); },
  startDemo, startCampaign, startDeep, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings, continueRun,
  get W() { return G.W; }, noPost: NO_POST, C_KEYS,
});
boot();
