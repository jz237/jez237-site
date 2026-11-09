// Skyhold 2026 — game flow, menus, HUD (with the scanner strip), commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, C, H, BOSSES, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, TYPICAL_UP, START_LIVES, DIFFICULTY, POWERUPS, LIVERIES, CP_NAMES, WAVES, ENEMY } from './config.js?v=4';
import { makeWorld, step, stepGuest, drainEvents, wd, wp, settlersLeft, nodePos, CHAIN_T, chainMult } from './sim.js?v=4';
import { Autopilot } from './ai.js?v=4';
import { Renderer, pickQuality, CALM, LOOKS } from './render.js?v=4';
import { Audio } from './audio.js?v=4';
import { Input } from './input.js?v=4';
import { Scores, NO_POST } from './scores.js?v=4';
import { Recorder, Replay } from './replay.js?v=4';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=4';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'sh.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchFirst = matchMedia('(pointer:coarse)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', livery: 'sky', assist: touchFirst ? 'light' : 'off', scanner: 'on', retro: 'on' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('sh.medals.v1', []));
const best = load('sh.best.v1', {});
let reach = load('sh.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input();
const BOARDS = {};
function boardOf(mode, diff = 'normal') {
  const key = (mode === 'endless' ? 'skyhold-2026-endless' : 'skyhold-2026') + (diff === 'normal' ? '' : '-' + diff);
  return BOARDS[key] || (BOARDS[key] = new Scores(key));
}
const HS = boardOf('campaign');
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const ASSIST = { off: 0, light: 0.5, strong: 0.9 };
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), lastLife: false,
};
window.__sh = { G, R, A, I, REC, NET, settings, VERSION };

// ------------------------------------------------------------------ talking: rare on purpose
const VOICE_GAP = 26;
let lastLine = -99;
const nowS = () => performance.now() / 1000;
function say(name, o = {}) {
  if (settings.talk === 'off' || G.mode === 'demo' || G.mode === 'title') return;
  const t = nowS(), last = G.says.get(name) ?? -99;
  if (t - last < (o.cd ?? 0) || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__sh.lines ||= []).push([t, name]); }
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
  $('sel-sub').textContent = reach > 0 ? `Worlds 1 to ${reach + 1} open` : 'Clear world 1 to open more';
  $('demo-badge').classList.add('hidden');
  setHud(false);
  scenic(G.demoI % 5);
  A.playMusic('title');
}
function scenic(look) {
  // the title drifts round a world with lifters at work on the colony
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 7 + look, demo: true, lives: 9, noTut: true });
  W.players[0].alive = false; W.players[0].deadT = 1e9; W.lives = 99;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
  R.cx = W.sites[0] - 30;
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
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 500 * sector : 0, start: sector, newMedals: [], diff: settings.diff, continues: 0 };
  say('begin', { key: true, delay: 1 });
  beginSector(sector);
}
function beginSector(s, cp = 0, nova = null) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, cp: cp || +params.get('wave') || 0, nova: nova ?? undefined,
    demo: !!G.run.ai, diff: G.run.diff || 'normal', assist: G.run.ai ? 0 : assistOf(), noTut: s > 0 });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`WORLD ${s + 1}`, SECTORS[s].name + (W.cp ? ' · ' + CP_NAMES[W.cp] : ''), 3);
  if (s > 0 && !cp) say('s' + (s + 1), { key: true, delay: 1.4 });
}
const AI_SHOP = ['rapid', 'deflector', 'rack', 'reach', 'rapid', 'tractor', 'thrust', 'deflector', 'rapid', 'rack', 'reach', 'thrust', 'tractor'];
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0, continues: 0 };
  beginSector(+params.get('sector') || 0);
  caption('AI PLAYTHROUGH: THE AUTOPILOT DEFENDS ALL FIVE WORLDS. PRESS ESC OR PAUSE TO STOP', 6);
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
function startEndless() {
  G.run = { score: 0, lives: START_LIVES, up: {}, start: 0, newMedals: [], diff: settings.diff };
  G.mode = 'endless';
  enterPlay(makeWorld({ mode: 'endless', seed: newSeed(), diff: settings.diff, assist: assistOf(), lives: START_LIVES + DIFFICULTY[settings.diff].lives }));
  banner('ENDLESS ORBIT', 'HOLD THE SKY AS LONG AS YOU CAN', 3);
  say('endless', { key: true, delay: 1 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start at the third wave with a typical ship, so the demo shows a busy sky (and the carrier soon)
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, cp: s % 2 ? 3 : 2, up: { ...TYPICAL_UP[s], rapid: Math.max(1, TYPICAL_UP[s].rapid || 0) }, lives: 9, noTut: true });
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now();
  banner(`WORLD ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · THE AUTOPILOT GUARDS THE COLONY`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.lastLife = false; G.saidLift = false;
  if (!G.ai && G.autopilot) G.ai = new Autopilot(W.seed, 'demo');
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  REC.reset(); PREV = new WeakMap();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  const me = myPlayer(W);
  R.cx = me.x;
  R.updateCamera(0.016, { snap: true, me });
  A.playMusic(SECTORS[W.k].music);
  A.loop('thrust', 'thrust', 0.45); A.loop('lift', 'liftloop', 0.6); A.loop('boss', 'bossloop', 0.7);
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
  $('sector-name').textContent = W.mode === 'endless' ? 'ENDLESS ORBIT · ' + SECTORS[W.k].name + dl : `WORLD ${W.sector + 1} · ${SECTORS[W.sector].name}${dl}`;
  $('cpstrip').innerHTML = W.mode === 'endless' ? '' : CP_NAMES.map((n, i) => `<b>${i < WAVES ? i + 1 : '◆'}</b>`).join('');
}
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
const myPlayer = (W) => (G.mode === 'online' && !NET.host && W.players[1] ? W.players[1] : W.players[0]);
function updateHud(W) {
  setText('score', W.score.toLocaleString());
  const board = boardOf(W.mode, W.diff);
  setText('hiscore', Math.max(board.best(), W.score).toLocaleString());
  setText('hi-lbl', W.mode === 'endless' ? 'BEST ORBIT' : 'BEST');
  const me = myPlayer(W);
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - (me?.alive ? 1 : 0)))));
  setHTML('shield', me ? Array.from({ length: me.shield }, () => '<i class="on"></i>').join('') : '');
  if (me) {
    setText('bombs', String(me.nova)); $('bombs-w').classList.toggle('empty', me.nova === 0);
    setText('tb-bomb-n', String(me.nova)); $('tb-bomb').classList.toggle('empty', me.nova <= 0);
    const cool = me.blinkT > 0;
    $('blink-w').classList.toggle('cool', cool); $('tb-blink').classList.toggle('cool', cool);
  }
  const act = [];
  if (me) for (const k in me.pw) act.push([k, me.pw[k]]);
  setHTML('pw', act.map(([k, t]) => { const P = POWERUPS[k]; return `<span style="--c:#${P.color.toString(16).padStart(6, '0')}"><b>${P.glyph}</b>${P.name}<i style="width:${Math.min(100, (t / P.time) * 100).toFixed(0)}%"></i></span>`; }).join(''));
  // the kill chain
  const ca = W.t - W.chainT < CHAIN_T && W.chain >= 2;
  $('streak').classList.toggle('hidden', !ca);
  if (ca) {
    const m = chainMult(W.chain);
    setText('chain-n', m > 1 ? `×${m}` : `${W.chain}`); setText('chain-l', m > 1 ? `CHAIN · ${W.chain} IN A ROW` : 'IN A ROW');
    $('streak').classList.toggle('hot', m > 1);
    $('chain-bar').style.width = (100 * (1 - (W.t - W.chainT) / CHAIN_T)).toFixed(0) + '%';
  }
  // the colony
  const left = settlersLeft(W), N = W.settlers.length, up = W.settlers.filter((s) => s.st === 'held').length;
  setText('settlers', String(left));
  $('colony').classList.toggle('low', left > 0 && left <= Math.ceil(N / 3)); $('colony').classList.toggle('none', left === 0);
  setHTML('sdots', W.settlers.map((s) => `<i class="${s.st === 'dead' ? 'off' : s.st === 'held' ? 'up' : ''}"></i>`).join(''));
  void up;
  if (W.mode === 'endless') setText('timer', `WAVE ${W.waveN} · ${fmtT(W.fightT)}`);
  else {
    setText('timer', fmtT(W.secT));
    const kids = $('cpstrip').children;
    for (let i = 0; i < kids.length; i++) { const want = i < W.cp ? 'done' : i === W.cp ? 'now' : ''; if (kids[i].className !== want) kids[i].className = want; }
  }
  const B = W.boss;
  $('bossbar').classList.toggle('hidden', !B);
  if (B) {
    const D = BOSSES[B.key], hp = B.nodes.reduce((a, n) => a + Math.max(0, n.hp), 0), max = B.nodes.reduce((a, n) => a + n.max, 0), left2 = B.nodes.filter((n) => n.hp > 0).length;
    setText('boss-name', B.st === 'warp' ? `${D.name} · ARRIVING` : B.st === 'dying' ? `${D.name} · GOING DOWN` : `${D.name}${B.rage ? ' · ENRAGED' : ''} · ${left2} WEAK POINT${left2 === 1 ? '' : 'S'} LEFT`);
    $('bossbar').classList.add('awake');
    $('bossbar').querySelector('i').style.width = ((hp / Math.max(1, max)) * 100).toFixed(1) + '%';
  }
}
// the scanner: the whole planet as a strip, centred on your ship, with the bracket of what is on screen
function drawScanner(W) {
  const cv = $('scan');
  if (cv.classList.contains('hidden')) return;
  const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth || 300, h = cv.clientHeight || 50;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const g = cv.getContext('2d'), S = cv.width, T = cv.height;
  g.clearRect(0, 0, S, T);
  g.fillStyle = 'rgba(4,8,14,0.66)'; g.fillRect(0, 0, S, T);
  const me = myPlayer(W);
  const cx = me && me.alive ? me.x : R.cx;
  const X = (x) => S / 2 + (wd(x - cx) / C) * S, Y = (y) => T - 4 * dpr - (y / H) * (T - 9 * dpr);
  // the ground and the colony sites
  g.strokeStyle = 'rgba(141,255,138,0.35)'; g.lineWidth = 1 * dpr; g.beginPath(); g.moveTo(0, Y(0) + 1.5 * dpr); g.lineTo(S, Y(0) + 1.5 * dpr); g.stroke();
  g.fillStyle = 'rgba(141,255,138,0.18)';
  for (const s of W.sites) g.fillRect(X(s) - 4 * dpr, Y(0) - 1 * dpr, 8 * dpr, 3 * dpr);
  // what is on screen
  const half = halfView();
  g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1 * dpr;
  const bx0 = X(R.cx - half), bx1 = X(R.cx + half);
  g.beginPath(); g.moveTo(bx0 + 4 * dpr, 1); g.lineTo(bx0, 1); g.lineTo(bx0, T - 1); g.lineTo(bx0 + 4 * dpr, T - 1); g.moveTo(bx1 - 4 * dpr, 1); g.lineTo(bx1, 1); g.lineTo(bx1, T - 1); g.lineTo(bx1 - 4 * dpr, T - 1); g.stroke();
  const dot = (x, y, r, c) => { g.fillStyle = c; g.fillRect(X(x) - r, Y(y) - r, r * 2, r * 2); };
  for (const s of W.settlers) if (s.st !== 'dead') dot(s.x, Math.max(0.6, s.y), 1.3 * dpr, s.st === 'held' ? '#ff5a4a' : s.st === 'fall' ? '#ffffff' : '#8dff8a');
  const COL = { lifter: '#ffb347', husk: '#ff4a8a', sower: '#c98aff', hive: '#ff8a3a', stinger: '#ff6a6a', prowler: '#ff2a2a', mine: 'rgba(255,200,120,0.45)' };
  for (const e of W.enemies) if (e.hp > 0) dot(e.x, e.y, (e.type === 'mine' ? 0.8 : 1.6) * dpr, e.carry ? (Math.floor(R.time * 6) % 2 ? '#ff3a2a' : '#ffffff') : COL[e.type]);
  for (const q of W.pods) dot(q.x, q.y, 1.6 * dpr, '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'));
  const B = W.boss;
  if (B) { g.fillStyle = '#ff7a3a'; g.fillRect(X(B.x) - 6 * dpr, Y(B.y) - 2 * dpr, 12 * dpr, 4 * dpr); }
  for (const p of W.players) if (p.alive) { g.fillStyle = p === me ? '#ffffff' : '#ffb070'; const x = X(p.x), y = Y(p.y); g.beginPath(); g.moveTo(x + p.face * 4 * dpr, y); g.lineTo(x - p.face * 3 * dpr, y - 2.5 * dpr); g.lineTo(x - p.face * 3 * dpr, y + 2.5 * dpr); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(190,205,225,0.3)'; g.lineWidth = 1 * dpr; g.strokeRect(0.5, 0.5, S - 1, T - 1);
}
function halfView() { const c = R.camera, vf = c.fov * Math.PI / 180, needH = R.needH, D = Math.max((needH / 2) / Math.tan(vf / 2), 23 / (Math.tan(vf / 2) * c.aspect)); return D * Math.tan(vf / 2) * c.aspect; }

// banners, captions, popups, tutorial prompts
function banner(a, b, t = 2.2) {
  const el = $('banner');
  el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b || '';
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  G.bannerT = t;
}
function caption(text, t = 4) { const el = $('caption'); el.textContent = text; el.classList.remove('hidden'); G.capT = t; }
const PP = { x: 0, y: 0, z: 0 };
function popup(text, x, y, color, big) {
  R.project(x, y + 1.6, PP);
  if (PP.z > 1 || PP.x < 20 || PP.x > innerWidth - 20 || PP.y < 60 || PP.y > innerHeight - 20) return null;
  if ($('popups').childElementCount > 7) return null;
  const d = document.createElement('div');
  d.className = 'pop' + (big ? ' big' : ''); d.textContent = text; d.style.left = PP.x + 'px'; d.style.top = PP.y + 'px';
  if (color) d.style.color = color;
  $('popups').appendChild(d);
  setTimeout(() => d.remove(), 1200);
  return d;
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    fly: { key: '<kbd>←</kbd><kbd>→</kbd> (or <kbd>A</kbd><kbd>D</kbd>)', pad: 'the left stick', touch: 'your left thumb' },
    climb: { key: '<kbd>↑</kbd><kbd>↓</kbd> (or <kbd>W</kbd><kbd>S</kbd>)', pad: 'the left stick', touch: 'your left thumb (up and down)' },
    fire: { key: '<kbd>SPACE</kbd>', pad: '<kbd>A</kbd> or the right trigger', touch: 'the <kbd>FIRE</kbd> button' },
    nova: { key: '<kbd>SHIFT</kbd> (or <kbd>K</kbd>)', pad: '<kbd>B</kbd> or the left trigger', touch: 'the <kbd>NOVA</kbd> button' },
    blink: { key: '<kbd>H</kbd> (or <kbd>L</kbd>)', pad: '<kbd>Y</kbd> or a bumper', touch: 'the <kbd>BLINK</kbd> button' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  move: () => `Fly with ${keyName('fly')}: the ship turns to face the way you push. Climb and dive with ${keyName('climb')}. The planet is round: keep going and you come back round.`,
  fire: () => `Fire your beam with ${keyName('fire')}. A <b>LIFTER</b> is warping in: shoot it before it gets to the <b>SETTLERS</b> on the ground.`,
  scanner: () => `The <b>SCANNER</b> (top) shows the whole planet: settlers in green, lifters in amber. Fly to wherever the lifters are.`,
  grab: () => `A lifter is going down for a settler! Shoot it before its beam locks on, or it carries them up into the sky.`,
  falling: () => `A settler is falling! Fly into them to <b>CATCH</b> them (or, dropped low enough, they land safely by themselves).`,
  caught: () => `Got them! Now fly down close to the ground to <b>SET THEM DOWN</b> safely.`,
  nova: () => `Swamped? ${keyName('nova')} lets off a <b>NOVA</b>: every machine on screen is destroyed. You carry only a few.`,
  blink: () => `In trouble? ${keyName('blink')} <b>BLINKS</b> you far round the planet. It needs a few seconds to recharge.`,
};
function tutorial(key) { if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return; const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = 8; }

// ------------------------------------------------------------------ events from the simulation
const SCOL = { lifter: 0x9dff7a, husk: 0xff4a8a, sower: 0xc98aff, hive: 0xff8a3a, stinger: 0xff6a6a, prowler: 0xff3a3a, mine: 0xffb347 };
function handleEvents(list, W, live) {
  const me = myPlayer(W);
  const mine = (e) => me && e.pid === me.id;
  const fx = R.fx;
  const S = +settings.shake;
  const P = (x, y, z = 0.4) => R.at(x, y, z);
  const snd = (name, e, o = {}) => { const p = P(e.x, e.y); return A.play(name, { x: p.x, y: p.y, z: p.z, ...o }); };
  const pan = (x) => clamp(wd(x - R.cx) / 50, -1, 1);
  for (const e of list) {
    switch (e.k) {
      case 'fire': {
        if (e.drone) { snd('beam', e, { vol: 0.16, rate: 1.4, gap: 0.08 }); A.retro('beam', { vol: 0.2, rate: 1.5 }); break; }
        snd('beam', e, { vol: mine(e) ? 0.32 : 0.2, gap: 0.05, vary: 0.08 });
        A.retro('beam', { vol: mine(e) ? 0.55 : 0.3, pan: pan(e.x) });
        const p = P(e.x, e.y), v = R.vel(e.x, e.dir * 14, 0);
        fx.sparks(p.x, p.y, p.z, { n: 3, speed: 3, s: 0.35, life: 0.08, vx: v.x, vy: v.y, r: 1, g: 0.55, b: 0.4 });
        R.beamLight.position.copy(p); R.beamLight.intensity = 30;
        break;
      }
      case 'beamhit': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 8, speed: 7, s: 0.28, life: 0.35, r: 1, g: 0.6, b: 0.4 }); if (!e.dead) snd('beamhit', e, { vol: 0.45, gap: 0.04 }); break; }
      case 'hit': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 6, speed: 6 }); break; }
      case 'plink': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 5, speed: 5, s: 0.22, life: 0.25, r: 0.9, g: 0.85, b: 0.8 }); snd('beamhit', e, { vol: 0.25, rate: 0.6, gap: 0.08 }); break; }
      case 'kill': {
        const big = e.type === 'hive' || e.type === 'sower' || e.type === 'prowler';
        const v = R.vel(e.x, e.vx || 0, e.vy || 0);
        R.breakEnemy(e.id, { vx: v.x * 0.4, vy: v.y * 0.4, power: big ? 1.3 : 0.9, max: big ? 6 : 4 });
        const p = P(e.x, e.y);
        if (e.type === 'mine') { snd('pop', e, { vol: 0.4, rate: 1.3 }); fx.explode(p.x, p.y, p.z, 0.6, { color: 0xffb070 }); break; }
        snd(big ? 'boomM' : e.type === 'stinger' ? 'pop' : 'boomS', e, { vol: big ? 0.85 : 0.6, gap: 0.03 });
        A.retro(big ? 'boom' : 'pop', { vol: 0.5, pan: pan(e.x) });
        fx.explode(p.x, p.y, p.z, big ? 1.8 : 1.0, { metal: true, vx: v.x * 0.3, vy: v.y * 0.3, color: SCOL[e.type] === 0x9dff7a ? 0xffc070 : 0xff7a50, ringColor: SCOL[e.type] });
        if (big) { R.shock(e.x, e.y, 0.5); R.addTrauma(0.12 * S); if (live) rumble(0.25, 0.3, 110); }
        if (live && e.pid && e.score && G.mode !== 'demo') popup(`+${e.score}${chainMult(e.chain || 0) > 1 ? ' ×' + chainMult(e.chain) : ''}`, e.x, e.y, e.carry ? '#8dff8a' : chainMult(e.chain || 0) > 1 ? '#ffd27a' : null);
        if (live && e.pid && e.chain && e.chain % 4 === 0 && e.chain <= 12) { A.play('pickup', { vol: 0.5, rate: 1 + e.chain * 0.03, gap: 0.2 }); A.retro('life', { vol: 0.3 }); }
        if (live && e.carry && G.mode !== 'demo') caption('LIFTER DOWN: CATCH THE SETTLER', 2.2);
        break;
      }
      case 'warpin': snd('warpin', e, { vol: e.type === 'prowler' ? 0.8 : 0.4, gap: 0.12 }); A.retro('warp', { vol: 0.25, pan: pan(e.x) }); break;
      case 'grab': snd('grab', e, { vol: 0.8, gap: 0.2 }); A.retro('grab', { vol: 0.35, pan: pan(e.x) }); break;
      case 'lifted':
        snd('distress', e, { vol: 0.9, gap: 0.5 });
        if (live && G.mode !== 'demo') { if (!G.saidLift) { G.saidLift = true; say('lifted', { chance: 0.8 }); } caption('A SETTLER IS BEING LIFTED · SHOOT THE LIFTER', 2.6); }
        break;
      case 'fuse': {
        const p = P(e.x, e.y);
        snd('fuse', e, { vol: 1, gap: 0.2 });
        fx.explode(p.x, p.y, p.z, 1.6, { color: 0xff4a8a, ringColor: 0xff4a8a });
        R.shock(e.x, e.y, 0.7);
        if (live && G.mode !== 'demo') caption('A SETTLER WAS TAKEN · THAT LIFTER IS NOW A HUSK', 3);
        break;
      }
      case 'fall': snd('fall', e, { vol: 0.6, gap: 0.3 }); if (live && !e.safe && G.mode !== 'demo') popup('CATCH!', e.x, e.y, '#8dff8a', true); break;
      case 'catch': { const p = P(e.x, e.y); snd('catch', e, { vol: 0.9, gap: 0 }); A.retro('catch', { vol: 0.5 }); fx.sparks(p.x, p.y, p.z, { n: 16, speed: 4, r: 0.5, g: 1, b: 0.6 }); if (live) { popup(`+${e.score} CAUGHT`, e.x, e.y, '#8dff8a', true); if (mine(e)) rumble(0.2, 0.4, 120); } break; }
      case 'land': { const p = P(e.x, 0.3); snd('land', e, { vol: 0.9, gap: 0 }); A.retro('land', { vol: 0.5 }); fx.ring(p.x, p.y, p.z, 4, 0x8dff8a); fx.sparks(p.x, p.y, p.z, { n: 14, speed: 3, r: 0.5, g: 1, b: 0.6 }); R.cheer(e.id); if (live) popup(`+${e.score} SAFE`, e.x, 1, '#8dff8a', true); break; }
      case 'selfland': R.cheer(e.id); if (live && G.mode !== 'demo') popup('LANDED SAFELY', e.x, 1, '#c8ffc8'); break;
      case 'lost': { const p = P(e.x, Math.max(0.3, e.y)); snd('lost', e, { vol: 0.8, gap: 0.2 }); A.retro('lost', { vol: 0.4 }); fx.sparks(p.x, p.y, p.z, { n: 10, speed: 3, r: 1, g: 0.5, b: 0.4 }); if (live && e.why === 'fall' && G.mode !== 'demo') caption('A SETTLER FELL TOO FAR', 2.4); break; }
      case 'colonyfall':
        A.play('colonyfall', { vol: 1, gap: 0 }); A.play('alarm', { vol: 0.7, delay: 0.4, gap: 0 });
        R.flashScreen(0.3, 0xff3a2a); R.addTrauma(0.5 * S);
        if (live) { banner('THE COLONY HAS FALLEN', 'EVERY LIFTER LEFT IS NOW A HUSK', 3.4); say('colonyfall', { key: true, delay: 0.8 }); rumble(0.7, 0.7, 600); }
        break;
      case 'colony': if (live) banner('A NEW COLONY', 'THE SETTLERS ARE BACK', 2.6); break;
      case 'tell': snd('tell', e, { vol: 0.4, gap: 0.12 }); A.retro('tell', { vol: 0.15, pan: pan(e.x) }); break;
      case 'bolt': snd('bolt', e, { vol: e.from === 'carrier' ? 0.6 : 0.45, gap: 0.05 }); break;
      case 'boltground': { const p = P(e.x, 0.3); fx.sparks(p.x, p.y, p.z, { n: 5, speed: 4, r: 1, g: 0.4, b: 0.3, life: 0.3 }); fx.dust(p.x, p.y, p.z, { n: 2, s0: 0.4, s1: 1.6, life: 1.4, a: 0.3 }); break; }
      case 'shield': {
        snd('shieldhit', e, { vol: 0.9, gap: 0 });
        const v = R.views.p.get(e.pid); if (v) v.hurt = 1;
        const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 16, speed: 6, r: 0.5, g: 0.85, b: 1 });
        if (live) { if (mine(e)) { rumble(0.5, 0.6, 200); popup(e.left ? `SHIELD ${e.left} LEFT` : 'SHIELD GONE', e.x, e.y, '#9fd8ff'); } if (G.mode === 'demo') { R.frameShot([[e.x, e.y]], 1.0); slowmo(0.45, 0.5); } }
        break;
      }
      case 'death': {
        const v = R.vel(e.x, e.vx || 0, e.vy || 0);
        R.breakPlayer(e.pid, { power: 1.4, vx: v.x * 0.3, vy: v.y * 0.3 });
        snd('death', e, { vol: 1, gap: 0 }); A.retro('death', { vol: 0.5 });
        const p = P(e.x, e.y); fx.explode(p.x, p.y, p.z, 2.6, { metal: true, color: 0x9fd8ff, vx: v.x * 0.3, vy: v.y * 0.3 });
        R.flashScreen(0.3, 0xffc890); R.addTrauma(0.7 * S); R.shock(e.x, e.y, 1);
        if (live) {
          if (mine(e)) { rumble(1, 1, 520); slowmo(0.4, 0.6); }
          if (G.mode === 'demo') R.frameShot([[e.x, e.y]], 1.2);
          G.pendingClip = { n: W.n, kind: 'death' };
          if (W.lives === 1 && !G.lastLife) { G.lastLife = true; say('lastlife', { chance: 0.8, delay: 2.4 }); }
          const c = String(e.cause).replace('bolt:', '');
          caption(`SHOT DOWN BY ${String(e.cause).startsWith('bolt:') ? 'A ' + c.toUpperCase() + "'S BOLT" : c === 'beam' ? "THE CARRIER'S BEAM" : c === 'carrier' ? 'THE CHARGING CARRIER' : 'RAMMING A ' + c.toUpperCase()}`, 2.4);
        }
        break;
      }
      case 'spawn': { snd('spawn', e, { vol: 0.8 }); const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 6, 0x9fd8ff); R.shock(e.x, e.y, 0.6); fx.sparks(p.x, p.y, p.z, { n: 20, speed: 5, r: 0.5, g: 0.85, b: 1 }); break; }
      case 'nova': {
        A.play('nova', { vol: 1, gap: 0 }); A.retro('nova', { vol: 0.5 });
        const p = P(e.x, e.y);
        for (const r of [10, 22, 34]) fx.ring(p.x, p.y, p.z, r, 0xffd0a0);
        R.novaWave(e.x, e.y);
        fx.flash(p.x, p.y, p.z + 4, 120, 0xffc890, 0.6);
        R.flashScreen(0.5, 0xffe8c8); R.addTrauma(0.6 * S); R.shock(e.x, e.y, 2.2);
        if (live && mine(e)) rumble(0.8, 0.8, 400);
        break;
      }
      case 'empty': if (live && mine(e)) { A.play('uiback', { vol: 0.6, gap: 0.3 }); popup('NO NOVAS LEFT', e.x, e.y, '#ff8a80'); } break;
      case 'blink': { const p = P(e.x, e.y); snd('blink', e, { vol: 0.9, gap: 0 }); A.retro('blink', { vol: 0.45 }); fx.sparks(p.x, p.y, p.z, { n: 24, speed: 9, r: 0.6, g: 0.85, b: 1 }); fx.ring(p.x, p.y, p.z, 5, 0x8fd8ff); break; }
      case 'blinkin': { const p = P(e.x, e.y); A.play('blinkin', { vol: 0.8, delay: 0.05, gap: 0 }); fx.ring(p.x, p.y, p.z, 5, 0x8fd8ff); R.shock(e.x, e.y, 0.5); if (live && mine(e)) R.updateCamera(0.016, { snap: true, me: myPlayer(W) }); break; }
      case 'mine': snd('mine', e, { vol: 0.35, gap: 0.25 }); A.retro('mine', { vol: 0.15, pan: pan(e.x) }); break;
      case 'pop': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 6, speed: 3, r: 1, g: 0.7, b: 0.4, life: 0.3 }); break; }
      case 'hivepop': snd('hivepop', e, { vol: 0.9, gap: 0 }); snd('swarm', e, { vol: 0.7, delay: 0.2, gap: 0.5 }); A.retro('swarm', { vol: 0.3, pan: pan(e.x) }); if (live && G.mode !== 'demo') caption(`THE HIVE BURST · ${e.n} STINGERS`, 2); break;
      case 'prowler': if (live) { A.play('prowler', { vol: 0.8, gap: 0 }); if (G.mode !== 'demo') caption('A PROWLER IS HUNTING YOU · FINISH THE WAVE', 2.6); } break;
      case 'drop': { const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 2.5, POWERUPS[e.kind].color); fx.sparks(p.x, p.y, p.z, { n: 10, speed: 3, life: 0.6 }); break; }
      case 'pickup': {
        const Pw = POWERUPS[e.kind], p = P(e.x, e.y);
        A.play('pickup', { vol: 0.9, gap: 0 });
        fx.ring(p.x, p.y, p.z, 3.5, Pw.color); fx.sparks(p.x, p.y, p.z, { n: 24, speed: 5, life: 0.7 }); fx.flash(p.x, p.y, p.z, 14, Pw.color, 0.3);
        if (live) { popup(Pw.name, e.x, e.y, '#' + Pw.color.toString(16).padStart(6, '0'), true); if (mine(e)) rumble(0.2, 0.4, 120); }
        break;
      }
      case 'pwend': if (live && mine(e)) A.play('pwend', { vol: 0.5, gap: 0.2 }); break;
      case 'life': if (live) { A.play('life', { vol: 0.9, gap: 0 }); A.retro('life', { vol: 0.45 }); caption('+1 SHIP', 2.5); } break;
      case 'wave': if (live) { A.play('alarm', { vol: 0.35, gap: 0 }); banner(W.mode === 'endless' ? `WAVE ${e.n}` : `WAVE ${e.w + 1}`, W.mode === 'endless' ? SECTORS[W.k].name : `${SECTORS[W.sector].name} · ${W.R.lifters} LIFTERS`, 2.2); } break;
      case 'checkpoint': if (live) A.play('upgrade', { vol: 0.5, gap: 0 }); break;
      case 'waveclear': {
        A.play('waveclear', { vol: 0.8, gap: 0 });
        for (let i = 0; i < Math.min(12, e.alive); i++) A.play('tally', { vol: 0.5, delay: 0.5 + i * 0.09, gap: 0, rate: 1 + i * 0.03 });
        if (live) banner('WAVE CLEAR', e.alive ? `${e.alive} SETTLER${e.alive === 1 ? '' : 'S'} × ${e.mult * 100} · +${e.bonus.toLocaleString()}` : 'NO SETTLERS LEFT', 2.8);
        break;
      }
      case 'bosswarp': {
        A.play('alarm', { vol: 0.8, gap: 0 }); snd('bossroar', e, { vol: 1, delay: 0.6, gap: 0 });
        A.playMusic('boss', 1);
        R.flashScreen(0.25, 0xff7a4a); R.addTrauma(0.4 * S); R.shock(e.x, e.y, 1.8);
        if (live) { banner('WARNING', `${BOSSES[e.key].name} IS ARRIVING`, 2.8); say('boss', { key: true, delay: 0.8 }); rumble(0.8, 0.6, 600); if (G.mode === 'demo') { R.frameShot([[e.x, e.y]], 2.4); slowmo(0.6, 1.2); } }
        break;
      }
      case 'bosstell': snd('tell', e, { vol: 0.8, rate: 0.6, gap: 0.3 }); if (e.kind === 'sweep' || e.kind === 'rush') A.retro('alarm', { vol: 0.25 }); break;
      case 'bossatk':
        if (e.kind === 'sweep') snd('bossbeam', e, { vol: 1, gap: 0.3 });
        else if (e.kind === 'rush') { snd('bossroar', e, { vol: 0.9, rate: 1.3, gap: 0.3 }); R.addTrauma(0.3 * S); }
        else if (e.kind === 'drop') snd('warpin', e, { vol: 0.8, rate: 0.8, gap: 0.3 });
        break;
      case 'bossturn': break;
      case 'nodehit': { const p = P(e.x, e.y); snd('bosshit', e, { vol: 0.7, gap: 0.05 }); R.bossKick(e, 0.6); fx.sparks(p.x, p.y, p.z, { n: 14, speed: 8, r: 1, g: 0.75, b: 0.45 }); break; }
      case 'nodebreak': {
        const p = P(e.x, e.y);
        snd('nodebreak', e, { vol: 1, gap: 0 }); A.retro('boom', { vol: 0.5 });
        fx.explode(p.x, p.y, p.z, 2.4, { metal: true, color: 0xffb070 });
        R.bossKick(e, 2.2); R.shock(e.x, e.y, 1.2); R.addTrauma(0.35 * S); R.flashScreen(0.12, 0xffd0a0);
        if (live) { popup(`+${e.score} WEAK POINT DOWN`, e.x, e.y, '#ffd08a', true); rumble(0.5, 0.5, 220); }
        break;
      }
      case 'enrage':
        snd('bossroar', e, { vol: 1, rate: 0.85, gap: 0 }); A.play('alarm', { vol: 0.6, gap: 0 });
        R.flashScreen(0.2, 0xff3a2a); R.addTrauma(0.35 * S); R.shock(e.x, e.y, 1.4);
        if (live) { banner('ENRAGED', `${BOSSES[e.key].name} · IT ATTACKS FASTER`, 2.2); rumble(0.6, 0.5, 400); }
        break;
      case 'bump': if (live && mine(e)) { snd('shieldhit', e, { vol: 0.35, rate: 0.6, gap: 0.3 }); rumble(0.2, 0.2, 80); } break;
      case 'bossdying': snd('boomL', e, { vol: 1, gap: 0 }); slowmo(0.45, 1.4); R.addTrauma(0.6 * S); R.frameShot([[e.x, e.y]], 2.8); if (live) rumble(0.9, 0.9, 900); break;
      case 'cboom': { const p = P(e.x, e.y); snd('boomM', e, { vol: 0.8, gap: 0.08 }); fx.explode(p.x, p.y, p.z, 2.4, { metal: true }); R.addTrauma(0.2 * S); break; }
      case 'bosskill': {
        const p = P(e.x, e.y);
        if (R.bossV) R.breakView(R.bossV, { power: 2.2, max: 12 });
        snd('boomL', e, { vol: 1, rate: 0.8, gap: 0 }); A.retro('bigboom', { vol: 0.5 });
        fx.explode(p.x, p.y, p.z, 6, { metal: true, color: 0xffb070 }); fx.explode(p.x + 4, p.y - 1, p.z, 4, { metal: true }); fx.debris(p.x, p.y, p.z, { metal: true, n: 30, speed: 12, size: 0.6, trail: true });
        fx.ring(p.x, p.y, p.z, 30, 0xffd0a0);
        R.flashScreen(0.5, 0xffd8b0); R.addTrauma(0.9 * S); R.shock(e.x, e.y, 2.2);
        if (live) {
          G.pendingClip = { n: W.n, kind: 'boss' };
          popup('+' + e.bonus.toLocaleString(), e.x, e.y, null, true);
          say('bossdown', { key: true, delay: 1 });
          if (W.mode === 'campaign') A.sting('clear'); else setTimeout(() => { if (G.W === W) A.playMusic(SECTORS[W.k].music); }, 3500);
        }
        break;
      }
      case 'newworld': if (live) { banner('A NEW WORLD', SECTORS[e.look].name, 3); R.setLook(e.look); buildStrip(W); } break;
      case 'clear': if (live) { banner('WORLD CLEAR', `+${e.bonus.toLocaleString()} · ${fmtT(e.t)}`, 3); if (e.alive === W.settlers.length) say('saved', { key: true, delay: 3.2 }); } break;
      case 'tut': if (live) tutorial(e.key); break;
    }
  }
}
// sounds the renderer asks for (wreckage landing, distant thunder)
R.sfx = (name, o) => {
  if (name === 'debris') { A.play('debris', { x: o.x, y: o.y, z: o.z, vol: 0.35, gap: 0.12, vary: 0.2 }); return; }
  if (name === 'thunder') { A.play('boomL', { vol: 0.25, rate: 0.45, delay: 0.4 + Math.random() * 0.8, gap: 1.5 }); }
};
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a world / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'WORLD CLEAR' : 'SHOT DOWN', 'CO-OP'); return; }
  if (W.mode === 'endless') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'ORBIT LOST', `${W.waveN} WAVE${W.waveN === 1 ? '' : 'S'} · ${fmtT(W.fightT)}`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT, k = bestKey(W.diff, s);
    if (!best[k] || t < best[k]) { best[k] = t; store('sh.best.v1', best); }
    reach = Math.max(reach, Math.min(4, s + 1)); store('sh.reach.v1', reach);
    const got = [];
    const award = (id) => { if (W.diff !== 'easy' && !medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0 && !G.run.contSector) award(`s${s}clean`);
    if (W.stats.lost === 0 && !G.run.contSector) award(`s${s}guard`);
    if (t <= parTime(s) && !G.run.contSector) award(`s${s}par`);
    store('sh.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1; G.run.contSector = false;
    G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
    G.run.lastTime = t; G.run.got = got;
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'EVERY WORLD IS SAFE', 'ALL FIVE CARRIERS BROUGHT DOWN'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  G.contFrom = { sector: s, cp: W.cp, nova: W.cpNova[W.cp] };
  results(W, 'SHOT DOWN', `WORLD ${s + 1} · ${SECTORS[s].name} · ${CP_NAMES[W.cp]}`, true);
}
function playthroughNext(W) {
  const s = W.sector;
  if (W.result !== 'clear') {
    G.run.tries++;
    G.run.score = G.run.score0; G.run.lives = START_LIVES + 2;
    banner('RETRY', `THE AUTOPILOT TAKES ${SECTORS[s].name} AGAIN FROM ${CP_NAMES[W.cp]}`, 2.5);
    const cp = W.cp, nova = W.cpNova[W.cp];
    G.ptT = setTimeout(() => { if (G.mode === 'playthrough') beginSector(s, cp, nova); }, 1800);
    return;
  }
  G.run.score = W.score; G.run.lives = W.lives + 1;
  G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
  G.run.lastTime = W.secT;
  if (s >= SECTORS.length - 1) { G.run.got = []; results(W, 'AI PLAYTHROUGH COMPLETE', `ALL FIVE WORLDS · ${G.run.tries ? G.run.tries + (G.run.tries > 1 ? ' RETRIES' : ' RETRY') : 'NO RETRIES'}`); return; }
  const bought = aiShop();
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `WORLD ${s + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(W.secT)} · AUTOPILOT BOUGHT: ${bought.length ? bought.join(', ') : 'NOTHING YET (SAVING UP)'}`;
  $('next-sub').textContent = `World ${s + 2} · ${SECTORS[s + 1].name} · starts in a moment`;
  renderUpgrades();
  show('upgrades', false);
  for (const el of document.querySelectorAll('#upgrid .upg')) if (bought.includes(UPGRADES[el.dataset.up].name)) el.classList.add('sel');
  A.play('upgrade', { gap: 0, vol: 0.7 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'playthrough' && G.state === 'upgrade') beginSector(s + 1); }, 6000);
}
function upgrades(W) {
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `WORLD ${W.sector + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(G.run.lastTime)} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR SHIP'}`;
  $('next-sub').textContent = `World ${W.sector + 2} · ${SECTORS[W.sector + 1].name}`;
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
  if (W.mode === 'endless') st.push(['WAVES', W.waveN], ['TIME', fmtT(W.fightT)]);
  else st.push(['WORLD TIME', fmtT(W.secT)]);
  st.push(['LONGEST CHAIN', W.bestChain || 0], ['SETTLERS CAUGHT / SET DOWN', `${W.stats.caught} / ${W.stats.landed}`], ['SETTLERS LOST', W.stats.lost], ['LIFTERS / HUSKS DOWN', `${W.stats.lifters} / ${W.stats.husks}`], ['MACHINES DOWN', W.stats.kills], ['NOVAS USED', W.stats.novas], ['SHIPS LOST', W.stats.deaths]);
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · W${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The carrier going down' : 'The last hit, exactly as it happened';
  const cont = canContinue && G.mode === 'campaign';
  $('cont-btn').classList.toggle('hidden', !cont);
  if (cont) $('cont-sub').textContent = `Back in at ${CP_NAMES[G.contFrom.cp]} with ${START_LIVES} ships · your score goes back to the world's start`;
  const board = boardOf(W.mode, W.diff);
  G.board = board; G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'playthrough' && G.mode !== 'online' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, level: W.mode === 'endless' ? W.waveN : W.sector + 1 };
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
  beginSector(c.sector, c.cp, c.nova);
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
  R.cx = G.replay.W.players[0].x;
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
  $('pause-sub').textContent = G.W.mode === 'endless' ? `ENDLESS ORBIT · WAVE ${G.W.waveN}` : `WORLD ${G.W.sector + 1} · ${CP_NAMES[G.W.cp]}`;
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
  netStatus(`${peer.ini || 'A pilot'} is here.` + (NET.host ? ' Pick the world and start.' : ' Waiting for the host to start…'));
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
  const cfg = route === 'deep' ? { gm: 'endless', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] }, diff: settings.diff, cp: +params.get('wave') || 0 };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'endless' ? 'endless' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives: START_LIVES + 2 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives, noTut: true, diff: cfg.diff, assist: assistOf(), cp: cfg.cp || 0 });
  NET.bind(W);
  if (!NET.host) { W.players[1].assist = assistOf(); W.players[0].assist = 0; }
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  banner('CO-OP', cfg.gm === 'endless' ? 'ENDLESS ORBIT' : SECTORS[cfg.sector || 0].name, 3);
}
window.__sh.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'deep': A.play('uiok', { gap: 0 }); startEndless(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': buildLiveries(); show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'net-quick': NET.quick({ ini: HS.initials() }); break;
    case 'net-host': { const code = randomCode(4); $('room-code').textContent = code; $('room-wrap').classList.remove('hidden'); NET.connect(ROOM + code, 'host', { ini: HS.initials() }); break; }
    case 'net-join': { const code = cleanCode($('join-code').value); if (code.length !== 4) { netStatus('Type the 4-letter room code', 'error'); return; } NET.connect(ROOM + code, 'join', { ini: HS.initials() }); netStatus('Joining…'); break; }
    case 'net-go': hostStart(); break;
    case 'net-back': NET.close(); A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1); break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
    case 'continue': continueRun(); break;
    case 'resume': resume(); break;
    case 'pause': pause(); break;
    case 'quit': clearTimeout(G.ptT); toTitle(); break;
  }
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act], [data-up], [data-sector], [data-tab], [data-hd], .seg button');
  if (!t) return;
  A.unlock();
  if (t.dataset.act) act(t.dataset.act);
  else if (t.dataset.up) buy(t.dataset.up);
  else if (t.dataset.sector !== undefined) { if (!t.hasAttribute('disabled')) { A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sector); } }
  else if (t.dataset.tab) renderScores(t.dataset.tab === 'deep' ? 'endless' : t.dataset.tab);
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
  A.setRetro(settings.retro !== 'off');
  if (settings.talk === 'off') A.hush();
  applyCalm();
  if (G.state === 'play') { setHud(true); const me = G.W && myPlayer(G.W); if (me && G.mode !== 'demo' && G.mode !== 'playthrough') me.assist = assistOf(); }
}
applySettings();
function cycleIni(d) { const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const c = G.ini.chars[G.ini.i]; G.ini.chars[G.ini.i] = CH[(CH.indexOf(c) + d + CH.length) % CH.length]; renderIni(); A.play('uimove', { gap: 0 }); }
function buildSectors() {
  $('secgrid').innerHTML = SECTORS.map((s, i) => {
    const open = i <= reach;
    const m = MEDALS.filter((q) => q.sector === i).map((q) => (medals.has(q.id) ? '★' : '☆')).join('');
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>WORLD ${i + 1} · ${BOSSES[s.boss].name}</b><span>${s.name}</span><small>${open ? (best[bestKey(settings.diff, i)] ? 'BEST ' + fmtT(best[bestKey(settings.diff, i)]) + ' · ' + DL(settings.diff) : 'NOT CLEARED YET') : 'LOCKED'}</small><div class="md">${m}</div></button>`;
  }).join('');
}
function buildMedals() {
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} EARNED`;
  $('medlist').innerHTML = SECTORS.map((s, i) => `<h3>WORLD ${i + 1} · ${s.name}</h3><div class="medrow">${MEDALS.filter((m) => m.sector === i).map((m) => `<span class="medal ${medals.has(m.id) ? 'on' : ''}" title="${m.desc}">${medals.has(m.id) ? '🏅' : '○'} ${m.name} <small style="opacity:.7">· ${m.desc}</small></span>`).join('')}</div>`).join('');
}
async function renderScores(tab, diff = G.scoreDiff || settings.diff) {
  G.scoreTab = tab; G.scoreDiff = diff;
  for (const b of document.querySelectorAll('[data-tab]')) b.classList.toggle('primary', (b.dataset.tab === 'deep' ? 'endless' : b.dataset.tab) === tab);
  for (const b of document.querySelectorAll('[data-hd]')) b.classList.toggle('primary', b.dataset.hd === diff);
  const board = boardOf(tab, diff);
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${tab === 'endless' ? 'W' + (r.level || 0) : 'W' + (r.level || 1)}</td><td>${r.score.toLocaleString()}</td></tr>`;
  const L = board.local();
  $('hs-local').innerHTML = L.length ? L.map(row).join('') : '<tr><td></td><td>No scores yet</td></tr>';
  $('hs-global').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => `<div class="stat"><span>W${i + 1} · ${s.name}</span><b>${best[bestKey(diff, i)] ? fmtT(best[bestKey(diff, i)]) : '—'}</b></div>`).join('');
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
// what matters but is off screen gets a marker at the screen edge: a settler being lifted (red), one falling (green),
// the carrier (orange), power-up pods
const WM = [];
const PE = { x: 0, y: 0, z: 0 };
// co-op: a name tag over the other gunship
function wingTag(W) {
  const el = $('wingtag');
  const other = G.mode === 'online' ? W.players.find((p) => p !== myPlayer(W)) : null;
  if (!other || !other.alive) { el.classList.add('hidden'); return; }
  R.project(other.x, other.y + 2.2, PE);
  if (PE.z > 1 || PE.x < 0 || PE.x > innerWidth) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.textContent = (NET.peer && NET.peer.ini) || 'WINGMATE';
  el.style.transform = `translate(${PE.x.toFixed(0)}px, ${PE.y.toFixed(0)}px) translate(-50%, -100%)`;
}
function updateWarnings(W) {
  const box = $('warns');
  const list = [];
  const me = myPlayer(W);
  if (me && me.alive && G.mode !== 'demo') {
    for (const e of W.enemies) if (e.type === 'lifter' && e.hp > 0 && (e.st === 'lift' || e.st === 'grab')) list.push({ x: e.x, y: e.y, c: 'red big', icon: '!', d: Math.round(Math.abs(wd(e.x - me.x))) });
    for (const s of W.settlers) if (s.st === 'fall' && s.dropY > W.R.safeH) list.push({ x: s.x, y: s.y, c: 'green', icon: '▼' });
    const B = W.boss;
    if (B && B.st !== 'dying') list.push({ x: B.x, y: B.y, c: 'orange big', icon: '◆', d: Math.round(Math.abs(wd(B.x - me.x))) });
    for (const q of W.pods) list.push({ x: q.x, y: q.y, c: 'pw', col: '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'), icon: POWERUPS[q.kind].glyph });
  }
  let n = 0;
  const vw = innerWidth, vh = innerHeight, half = halfView(), top = vh < 500 ? 60 : 120, pad = 34;
  for (const q of list) {
    const dx = wd(q.x - R.cx);
    if (Math.abs(dx) < half * 0.94) continue;
    let d = WM[n];
    if (!d) { d = document.createElement('div'); box.appendChild(d); WM.push(d); }
    n++;
    const right = dx > 0;
    R.project(R.cx, q.y, PE);
    const x = right ? vw - pad : pad, y = clamp(PE.y, top, I.touchOn ? vh - 230 : vh - pad);
    d.className = 'wm ' + q.c;
    d.style.display = '';
    d.style.left = x + 'px'; d.style.top = y + 'px';
    if (q.col) d.style.setProperty('--c', q.col);
    const html = `<em style="transform:rotate(${right ? 0 : Math.PI}rad)"></em><b>${q.icon}</b>${q.d !== undefined ? `<small>${q.d} m</small>` : ''}`;
    if (d._h !== html) { d.innerHTML = html; d._h = html; }
  }
  for (let i = n; i < WM.length; i++) WM[i].style.display = 'none';
}

// ------------------------------------------------------------------ smooth motion between sim steps
let PREV = new WeakMap();
const movers = (W) => [...W.players, ...W.enemies, ...W.bolts, ...W.pods, ...W.settlers, ...(W.boss ? [W.boss] : [])];
function snapPrev(W) { for (const o of movers(W)) { let p = PREV.get(o); if (!p) PREV.set(o, (p = [0, 0])); p[0] = o.x; p[1] = o.y; } }
const SAVED = [];
function lerpIn(W, a) {
  SAVED.length = 0;
  for (const o of movers(W)) {
    const p = PREV.get(o); if (!p) continue;
    const dx = wd(o.x - p[0]), dy = o.y - p[1];
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) continue;
    SAVED.push(o, o.x, o.y);
    o.x = wp(p[0] + dx * a); o.y = p[1] + dy * a;
  }
}
function lerpOut() { for (let i = 0; i < SAVED.length; i += 3) { const o = SAVED[i]; o.x = SAVED[i + 1]; o.y = SAVED[i + 2]; } SAVED.length = 0; }

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
  R.updateCamera(dt, { me: me && me.alive && !menu ? me : null, cine: menu, shake: +settings.shake });
  if (draw) R.sync(cur, dt);
  if (interp) lerpOut();
  A.setListener(R.camera);
  loops(cur, menu);
  if (draw) R.render(dt, {});
  R.beamLight.intensity *= Math.exp(-dt * 30);
  if (G.state === 'play' || G.state === 'paused-online') { updateWarnings(cur); drawScanner(cur); wingTag(cur); } else $('wingtag').classList.add('hidden');
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
      else { const c = I.control(); me.input = G.state === 'play' ? c : { mx: 0, my: 0, fire: false, nova: false, blink: false }; }
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    snapPrev(W);
    if (guest) stepGuest(W, STEP); else step(W, STEP);
    const ev = drainEvents(W);
    if (online && NET.host) NET.hostEvents(ev);
    handleEvents(ev, W, true);
    G.acc -= STEP; n++;
    if (W.over) break;
  }
  if (n >= 12) G.acc = 0;
  if (online) { if (NET.host) NET.hostFrame(W, dt); else NET.guestFrame(W, dt); }
  captureClip(W);
  updateHud(W);
  if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 110) W.over = true; }
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
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  if (!W) return;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  if (W.over || W.phase === 'clear') scenic(R.lookI);
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 22)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// what to do right now: for the autopilot its goal (and what it is dodging), for a player the next objective
function objective(W, me) {
  if (!me || !me.alive) return 'COMING BACK IN';
  if (W.phase === 'intro') return 'GET READY';
  if (W.phase === 'break') return 'WAVE CLEAR · THE NEXT ONE IS COMING';
  if (W.phase === 'clear') return 'WORLD CLEAR';
  if (me.carry) return 'FLY LOW TO SET THE SETTLER DOWN';
  const fall = W.settlers.find((s) => s.st === 'fall' && s.dropY > W.R.safeH);
  const dir = (x) => (wd(x - me.x) > 0 ? '→' : '←') + ' ' + Math.round(Math.abs(wd(x - me.x))) + ' m';
  if (fall) return `A SETTLER IS FALLING · CATCH THEM ${dir(fall.x)}`;
  const lift = W.enemies.find((e) => e.type === 'lifter' && e.hp > 0 && (e.st === 'lift' || e.st === 'grab'));
  if (lift) return `A SETTLER IS BEING LIFTED · SHOOT THE LIFTER ${dir(lift.x)}`;
  const B = W.boss;
  if (B) { if (B.st === 'warp') return 'THE CARRIER IS ARRIVING · GET CLEAR'; const n = B.nodes.filter((q) => q.hp > 0).length; return `LINE UP WITH THE CARRIER'S GLOWING WEAK POINTS AND FIRE · ${n} LEFT`; }
  if (W.fallen) return 'THE COLONY HAS FALLEN · DESTROY EVERY MACHINE';
  const l = W.enemies.filter((e) => e.hp > 0 && (e.type === 'lifter' || e.type === 'husk')).length + (W.plan ? W.plan.left : 0);
  return `SHOOT THE LIFTERS BEFORE THEY REACH THE SETTLERS · ${l} TO GO`;
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
// the engine, the tractor hum of the nearest lifter at work, the carrier's drone, and the planet's own ambience
const AMB = ['amb_verdant', 'amb_dune', 'amb_frost', 'amb_cinder', 'amb_umbra'];
function loops(W, menu) {
  if (!A.ctx) return;
  const live = G.state === 'play' || G.state === 'replay' || G.state === 'paused-online';
  const me = myPlayer(W) || W.players[0];
  const at = (x, y) => R.at(x, y);
  if (live && me) { const p = at(me.x, me.y); A.setLoop('thrust', p.x, p.y, p.z, me.alive ? 0.3 + (me.thrust || 0) * 0.7 : 0, 0.85 + Math.min(0.4, Math.abs(me.vx) / F.vmax * 0.4)); }
  let lf = null, ld = 1e9;
  for (const e of W.enemies) if (e.type === 'lifter' && e.hp > 0 && (e.st === 'grab' || e.st === 'lift')) { const d = Math.abs(wd(e.x - R.cx)); if (d < ld) { ld = d; lf = e; } }
  if (live) { const p = lf ? at(lf.x, lf.y) : at(R.cx, 10); A.setLoop('lift', p.x, p.y, p.z, lf && ld < 90 ? 0.8 : 0, 1); }
  const B = W.boss;
  if (live) { const p = B ? at(B.x, B.y) : at(R.cx, 30); A.setLoop('boss', p.x, p.y, p.z, B && B.st !== 'warp' ? 0.9 : 0, B && B.atk && B.atk.kind === 'rush' ? 1.25 : 1); }
  const k = G.state === 'paused' ? 0.3 : 1;
  AMB.forEach((n, i) => { if (i === R.lookI) A.setBed(n, n, (menu ? 0.5 : 0.36) * k); else if (A.beds.has(n)) A.setBed(n, n, 0); });
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
  // the title world first, so the warm-up compiles exactly what the first frames draw
  scenic(0);
  try { await R.warmUpAsync(); } catch (e) { console.warn('warm-up', e); }
  if (G.fixed || params.has('test')) { try { await R.prepareAll(false); } catch (e) { console.warn('prepare', e); } }
  $('loading').style.opacity = '0';
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  boardOf('campaign', settings.diff).fresh(); boardOf('endless', settings.diff).fresh();
  if (!G.fixed && !params.has('test')) R.prepareAll(true);
  if (params.has('test')) { const m = await import('./tests.js?v=4'); m.runTests(window.__sh); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  else if (G.autopilot) { A.unlock(); if (params.has('endless')) startEndless(); else startCampaign(+params.get('sector') || 0); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__sh, {
  tick: (n = 1, dt = 1 / 60, draw = true) => { for (let i = 0; i < n; i++) tickFrame(dt, draw || i === n - 1); },
  startDemo, startCampaign, startEndless, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings, continueRun,
  noPost: NO_POST, LOOKS, nodePos, ENEMY,
  // tests / screenshots: world s from wave cp with the demo autopilot flying
  startAt: (s, cp = 0, ai = true) => { G.run = { score: 0, lives: 9, up: { ...TYPICAL_UP[s] }, salvage: 0, start: s, newMedals: [], diff: 'normal', continues: 0, ai }; beginSector(s, cp); if (ai) G.ai = new Autopilot(7, 'demo'); },
});
Object.defineProperty(window.__sh, 'W', { get: () => G.W });
boot();
