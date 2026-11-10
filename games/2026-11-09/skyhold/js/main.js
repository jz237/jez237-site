// Skyhold 2026 — game flow, menus, HUD (with the scanner strip), commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, C, H, BOSSES, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, TYPICAL_UP, START_LIVES, DIFFICULTY, POWERUPS, LIVERIES, CP_NAMES, WAVES, ENEMY, SHIPS, SHIP_KEYS, RIVALS, MASTERY, mastLevel, SPECIALS } from './config.js?v=23';
import { makeWorld, step, stepGuest, drainEvents, wd, wp, settlersLeft, nodePos, CHAIN_T, chainMult, beamRange } from './sim.js?v=23';
import { Autopilot } from './ai.js?v=23';
import { Renderer, pickQuality, CALM, LOOKS, PW, PH } from './render.js?v=23';
import { Audio } from './audio.js?v=23';
import { Input } from './input.js?v=23';
import { Scores, NO_POST } from './scores.js?v=23';
import { Recorder, Replay } from './replay.js?v=23';
import { Online, ROOM, QUICK, QUICK_R, randomCode, cleanCode } from './online.js?v=23';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'sh.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchFirst = matchMedia('(pointer:coarse)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', livery: 'sky', assist: touchFirst ? 'light' : 'off', scanner: 'on', retro: 'on', cab: 'on', camera: 'side', layers: 'on', cine: 'on', aiWorld: '0', aiWave: '0', aiFeat: 'all', autofire: 'auto', ship: 'warden', netMode: 'coop' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('sh.medals.v1', []));
const mastery = load('sh.mastery.v1', {});   // machines each gunship has shot down
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
const SCREENS = ['title', 'aiwatch', 'sectors', 'upgrades', 'results', 'scores', 'medals', 'options', 'help', 'online', 'pause'];
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
  syncHangar();
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
    demo: !!G.run.ai, diff: G.run.diff || 'normal', assist: G.run.ai ? 0 : assistOf(), noTut: s > 0, ship: G.run.ai ? 'warden' : shipOf(settings.ship), mast: G.run.ai ? 0 : mastOf(shipOf(settings.ship)), feat: G.run.ai ? G.run.feat : undefined });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  R.colonyGrow = G.run.saved || 0;
  enterPlay(W);
  banner(`WORLD ${s + 1}`, SECTORS[s].name + (W.cp ? ' · ' + CP_NAMES[W.cp] : ''), 3);
  if (s > 0 && !cp && (G.run.saved || 0) >= 6) caption(`THE COLONY HAS GROWN · ${G.run.saved} SETTLERS SAVED SO FAR`, 3);
  if (s > 0 && !cp) say('s' + (s + 1), { key: true, delay: 1.4 });
}
const AI_SHOP = ['rapid', 'deflector', 'rack', 'reach', 'rapid', 'tractor', 'thrust', 'deflector', 'rapid', 'rack', 'reach', 'thrust', 'tractor'];
// AI PLAYTHROUGH from any world and wave (the menu's picker, or ?sector= / ?wave=); a later start gets the upgrades a
// pilot would typically have by then, and the autopilot plays on through every world after it
function startPlaythrough(s = +params.get('sector') || 0, cp = 0) {
  s = Math.max(0, Math.min(4, s | 0)); cp = Math.max(0, Math.min(4, cp | 0));
  const feat = MACHINES[settings.aiFeat] ? settings.aiFeat : null;
  G.run = { score: 0, lives: START_LIVES + 2, up: s ? { ...TYPICAL_UP[s] } : {}, salvage: 0, start: s, newMedals: [], ai: true, tries: 0, continues: 0, feat };
  beginSector(s, cp);
  caption(feat ? `AI PLAYTHROUGH · FEATURING ${MACHINES[feat][0]}: ${MACHINES[feat][1]} PRESS ESC OR PAUSE TO STOP` : `AI PLAYTHROUGH FROM WORLD ${s + 1}${cp ? ' · ' + (cp === 4 ? 'THE CARRIER' : 'WAVE ' + (cp + 1)) : ''}. PRESS ESC OR PAUSE TO STOP`, 7);
}
const AI_SEES = ['lifters, prowlers, a sower, a whirler ring, and hive pods crossing in a POD INTERSECTION',
  'adds hive pods, a husk and scorchers', 'adds husks, coils with their sparks, and maws',
  'brings every machine: more of the coils, maws, scorchers and whirler rings', 'everything at full tilt, with the last carrier'];
function aiWatchDesc() { const el = $('aiwatch-desc'); if (!el) return; const f = MACHINES[settings.aiFeat]; el.textContent = `WORLD ${(+settings.aiWorld || 0) + 1} · ${SECTORS[+settings.aiWorld || 0].name}: ${AI_SEES[+settings.aiWorld || 0]}.` + (f ? ` Every wave also brings extra ${f[0]}S: ${f[1]}` : ''); }
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
  enterPlay(makeWorld({ mode: 'endless', seed: newSeed(), diff: settings.diff, assist: assistOf(), lives: START_LIVES + DIFFICULTY[settings.diff].lives, ship: shipOf(settings.ship), mast: mastOf(shipOf(settings.ship)) }));
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
  REC.reset(); PREV = new WeakMap(); R.clearScars();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  const me = myPlayer(W);
  R.cx = me.x;
  R.updateCamera(0.016, { snap: true, me, chase: chaseOn() });
  A.playMusic(SECTORS[W.k].music);
  A.loop('thrust', 'thrust', 0.85); A.loop('lift', 'liftloop', 0.6); A.loop('boss', 'bossloop', 0.7); A.loop('cabthrust', 'cab_thrust', 0.8, 'cab');
  if (G.mode !== 'demo') A.cab('start');
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
  if (W.rivals) { const me = myPlayer(W), ot = W.players.find((q) => q !== me); setText('score', ((me && me.score) || 0).toLocaleString()); setText('rival-line', `RIVAL ${((ot && ot.score) || 0).toLocaleString()} · WAVE ${Math.min(RIVALS.waves, W.wave + 1)} OF ${RIVALS.waves}`); }
  else setText('score', W.score.toLocaleString());
  $('rival-line').classList.toggle('hidden', !W.rivals);
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
  // the HYPER meter
  { const mp = myPlayer(W), hy = mp && mp.hyper > 0; $('hyperbar').classList.toggle('on', !!hy); $('hyper-fill').style.width = (hy ? (mp.hyper / 8) * 100 : (mp ? mp.hyperK || 0 : 0) * 100).toFixed(0) + '%'; R.hyperK = (R.hyperK || 0) + ((hy ? 1 : 0) - (R.hyperK || 0)) * 0.08; }
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
    setText('boss-name', B.st === 'warp' ? `${D.name} · ARRIVING` : B.st === 'dying' ? `${D.name} · GOING DOWN` : B.st === 'shed' ? `${D.name} · ARMOUR DOWN` : B.phase === 2 ? `${D.name}${B.rage ? ' · ENRAGED' : ''} · CORE · ${left2} LEFT` : `${D.name}${B.rage ? ' · ENRAGED' : ''} · ${left2} WEAK POINT${left2 === 1 ? '' : 'S'} LEFT · THEN THE CORE`);
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
  const ek = W.event && W.event.kind, jam = ek === 'sandstorm' || ek === 'flare', blind = ek === 'eclipse';
  if (jam) { for (let k = 0; k < 90; k++) { g.fillStyle = `rgba(255,${ek === 'flare' ? 255 : 190},${ek === 'flare' ? 255 : 120},${(Math.random() * 0.5).toFixed(2)})`; g.fillRect(Math.random() * S, Math.random() * T, 3 * dpr, 1.5 * dpr); } }
  const dot = (x, y, r, c) => { if (jam && Math.random() < 0.7) return; if (blind && Math.abs(wd(x - cx)) > 110) return; g.fillStyle = c; g.fillRect(X(x) - r, Y(y) - r, r * 2, r * 2); };
  for (const s of W.settlers) if (s.st !== 'dead') dot(s.x, Math.max(0.6, s.y), 1.3 * dpr, s.st === 'held' ? '#ff5a4a' : s.st === 'fall' ? '#ffffff' : '#8dff8a');
  const COL = { lifter: '#ffb347', husk: '#ff4a8a', sower: '#c98aff', hive: '#ff8a3a', stinger: '#ff6a6a', prowler: '#ff2a2a', skimmer: '#5ef0ff', meteor: '#ffd27a', mine: 'rgba(255,200,120,0.45)', whirler: '#6af0e0', coil: '#b07aff', spark: '#e0c0ff', scorcher: '#ff7a2a', maw: '#ff4060' };
  if (W.gate) { const gx = X(W.gate.x), gy = Y(W.gate.y); g.strokeStyle = 'rgba(150,230,255,0.9)'; g.lineWidth = 1.2 * dpr; g.beginPath(); g.ellipse(gx, gy, 3 * dpr, 5 * dpr, 0, 0, Math.PI * 2); g.stroke(); }
  for (const e of W.enemies) if (e.hp > 0) dot(e.x, e.y, (e.type === 'mine' ? 0.8 : 1.6) * dpr, e.carry ? (Math.floor(R.time * 6) % 2 ? '#ff3a2a' : '#ffffff') : COL[e.type]);
  for (const q of W.pods) dot(q.x, q.y, 1.6 * dpr, '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'));
  const B = W.boss;
  if (B) { g.fillStyle = '#ff7a3a'; g.fillRect(X(B.x) - 6 * dpr, Y(B.y) - 2 * dpr, 12 * dpr, 4 * dpr); }
  for (const p of W.players) if (p.alive) { g.fillStyle = p === me ? '#ffffff' : '#ffb070'; const x = X(p.x), y = Y(p.y); g.beginPath(); g.moveTo(x + p.face * 4 * dpr, y); g.lineTo(x - p.face * 3 * dpr, y - 2.5 * dpr); g.lineTo(x - p.face * 3 * dpr, y + 2.5 * dpr); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(190,205,225,0.3)'; g.lineWidth = 1 * dpr; g.strokeRect(0.5, 0.5, S - 1, T - 1);
}
function halfView() { const c = R.camera, vf = 40 * Math.PI / 180, needH = R.needH, D = Math.max((needH / 2) / Math.tan(vf / 2), 23 / (Math.tan(vf / 2) * c.aspect)); return D * Math.tan(vf / 2) * c.aspect; }

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
// the cabinet sound for each machine's wreck (Options: CABINET SOUNDS) and its pitch
const CABK = { husk: 'mutant', sower: 'bomber', hive: 'pod', stinger: 'swarmer', coil: 'pod', spark: 'swarmer', scorcher: 'bomber', maw: 'mutant' }, CABR = { prowler: 0.8, skimmer: 1.25, meteor: 0.7, mine: 1.4, whirler: 1.35, coil: 0.75, spark: 1.4, scorcher: 1.15, maw: 0.7 };
const HOSTILE_T = new Set(['lifter', 'husk', 'sower', 'hive', 'stinger', 'prowler', 'whirler', 'coil', 'spark', 'scorcher', 'maw']);
const SCOL = { whirler: 0x6af0e0, coil: 0xb07aff, spark: 0xe0c0ff, scorcher: 0xff7a2a, maw: 0xff4060, lifter: 0x9dff7a, husk: 0xff4a8a, sower: 0xc98aff, hive: 0xff8a3a, stinger: 0xff6a6a, prowler: 0xff3a3a, skimmer: 0x5ef0ff, meteor: 0xffa040, mine: 0xffb347 };
function handleEvents(list, W, live) {
  const me = myPlayer(W);
  const mine = (e) => me && e.pid === me.id;
  const fx = R.fx;
  const S = +settings.shake;
  const P = (x, y, z = 0.4) => R.at(x, y, z);
  // your own ship's sounds play close to the listener (full volume, still panned); everything else sits in the world
  // (an event without a height, like a lava vent, sounds from the ground)
  const snd = (name, e, o = {}) => { let p = P(e.x ?? R.cx, e.y ?? 1); if (mine(e)) p = nearMe(p); return A.play(name, { x: p.x, y: p.y, z: p.z, ...o }); };
  const pan = (x) => (R.chaseK > 0.5 ? 0 : clamp(wd(x - R.cx) / 50, -1, 1));
  const cab = (name, e, o = {}) => A.cab(name, { pan: e ? pan(e.x) : 0, ...o });
  const seen = (e) => Math.abs(wd(e.x - R.cx)) < 70;
  for (const e of list) {
    switch (e.k) {
      case 'fire': {
        if (e.drone) { snd('beam', e, { vol: 0.16, rate: 1.4, gap: 0.08 }); A.retro('beam', { vol: 0.2, rate: 1.5 }); break; }
        if (e.ship === 'hornet') { snd('bolt', e, { vol: mine(e) ? 0.45 : 0.25, rate: 1.5, gap: 0.06, vary: 0.15 }); A.retro('beam', { vol: 0.25, rate: 0.7, pan: pan(e.x) }); if (mine(e)) cab('fire', e, { rate: 1.3, gap: 0.08, vol: 0.5 }); break; }
        if (e.ship === 'breaker') { snd('boomS', e, { vol: mine(e) ? 0.55 : 0.3, rate: 1.4, gap: 0.08 }); snd('beam', e, { vol: mine(e) ? 0.4 : 0.2, rate: 0.6, gap: 0.05 }); A.retro('beam', { vol: 0.45, rate: 0.55, pan: pan(e.x) }); if (mine(e)) cab('fire', e, { rate: 0.7, vol: 0.6 }); R.addTrauma(mine(e) ? 0.08 * S : 0); break; }
        snd('beam', e, { vol: mine(e) ? 0.42 : 0.2, gap: 0.05, vary: 0.08 });
        A.retro('beam', { vol: mine(e) ? 0.55 : 0.3, pan: pan(e.x) });
        if (mine(e)) cab('fire', e, { gap: 0.06, vol: 0.55 });
        const p = P(e.x, e.y), v = R.vel(e.x, e.dir * 14, 0);
        fx.sparks(p.x, p.y, p.z, { n: 3, speed: 3, s: 0.35, life: 0.08, vx: v.x, vy: v.y, r: 1, g: 0.55, b: 0.4 });
        R.beamLight.position.copy(p); R.beamLight.intensity = 30;
        break;
      }
      case 'beamhit': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 8, speed: 7, s: 0.28, life: 0.35, r: 1, g: 0.6, b: 0.4 }); if (!e.dead) snd('beamhit', e, { vol: 0.45, gap: 0.04 }); break; }
      case 'arc': { R.lightning(e.pts); A.play('bolt', { vol: 0.35, rate: 2, gap: 0.05, vary: 0.2 }); A.retro('beam', { vol: 0.25, rate: 2 }); for (const q of e.pts.slice(1)) { const p = P(q[0], q[1]); fx.sparks(p.x, p.y, p.z, { n: 8, speed: 6, r: 0.7, g: 0.9, b: 1, life: 0.35 }); } break; }
      case 'mhit': { const p = P(e.x, e.y); fx.explode(p.x, p.y, p.z, 0.6, { color: 0xffb070, ring: false }); snd('boomS', e, { vol: 0.3, rate: 1.3, gap: 0.04, vary: 0.2 }); break; }
      case 'shockwave': { const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 4.5, 0xffc070); if (e.small) break; R.shock(e.x, e.y, 0.7); snd('boomM', e, { vol: 0.5, rate: 1.4, gap: 0.08 }); A.cab('bomber', { rate: 1.3 }); break; }
      case 'crosswarn': if (live && G.mode !== 'demo') { caption('POD INTERSECTION · TWO SHIELDED HIVE PODS ARE CLOSING · HIT ONE WHILE THEY ARE LOCKED', 3.4); A.play('alarm', { vol: 0.35, gap: 0 }); } break;
      case 'podlink': { const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 6, 0xffb040); snd('tell', e, { vol: 0.6, rate: 1.5, gap: 0.2 }); A.cab('pod', { rate: 0.8 }); if (live && G.mode !== 'demo') popup('LINKED · HIT ONE!', e.x, e.y + 2, '#ffd27a', true); break; }
      case 'intersection': {
        const p = P(e.x, e.y);
        fx.ring(p.x, p.y, p.z, 12, 0xffd27a); fx.ring(p.x, p.y, p.z, 22, 0xffa040); fx.flash(p.x, p.y, p.z, 40, 0xffc070, 0.5);
        R.shock(e.x, e.y, 1.6); R.addTrauma(0.35 * S); R.flashScreen(0.18, 0xffd0a0);
        snd('boomL', e, { vol: 0.9, rate: 1.1, gap: 0 }); A.play('medal', { vol: 0.6, gap: 0 }); A.cab('extra', { rate: 0.9 });
        if (live) { if (e.bonus) popup(`POD INTERSECTION +${e.bonus.toLocaleString()}`, e.x, e.y, '#ffd27a', true); if (mine(e)) rumble(0.6, 0.6, 300); }
        break;
      }
      case 'whirldive': snd('tell', e, { vol: 0.45, rate: 1.9, gap: 0.3 }); break;
      case 'coilspark': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 18, speed: 7, r: 0.8, g: 0.6, b: 1, life: 0.4 }); snd('warpin', e, { vol: 0.35, rate: 2.2, gap: 0.2 }); A.cab('swarmer', { rate: 0.8 }); break; }
      case 'brand': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 12, speed: 5, r: 1, g: 0.55, b: 0.2, life: 0.4 }); snd('boomS', e, { vol: 0.4, rate: 0.7, gap: 0.2 }); break; }
      case 'mawdash': snd('bossroar', e, { vol: 0.5, rate: 2.1, gap: 0.3 }); break;
      case 'gate': {
        R.gateFlash(); snd('warpin', e, { vol: 0.8, rate: 0.7, gap: 0.3 });
        if (live && mine(e) && !e.warp && G.mode !== 'demo') caption('THE SKYGATE HUMS · NO SETTLER NEEDS YOU RIGHT NOW', 2);
        break;
      }
      case 'gatein': {
        const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 7, 0x96e6ff); fx.sparks(p.x, p.y, p.z, { n: 30, speed: 10, r: 0.6, g: 0.9, b: 1, life: 0.6 }); R.shock(e.x, e.y, 1);
        A.play('blinkin', { vol: 0.9, gap: 0 }); A.cab('hyperspace', { rate: 0.85 });
        if (live && mine(e)) { R.flashScreen(0.35, 0x96e6ff); R.updateCamera(0.016, { snap: true, me: myPlayer(W), chase: chaseOn() }); if (G.mode !== 'demo') caption(e.why === 'lift' ? 'SKYGATE · A LIFTER HAS A SETTLER · SHOOT IT DOWN' : e.why === 'fall' ? 'SKYGATE · A SETTLER IS FALLING · CATCH THEM' : 'SKYGATE · A LIFTER IS GOING DOWN FOR A SETTLER', 2.4); }
        break;
      }
      case 'mfizz': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 4, speed: 3, life: 0.25 }); break; }
      case 'stolen': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 18, speed: 6, r: 1, g: 0.85, b: 0.4, life: 0.5 }); A.play('shieldhit', { vol: 0.6, rate: 1.3, gap: 0.1 }); if (live) { const me = myPlayer(W); if (me && e.pid === me.id) caption('YOUR RIVAL KNOCKED YOUR SETTLER LOOSE · CATCH IT AGAIN', 2.2); else if (me && e.by === me.id) popup(`STOLEN! +${RIVALS.steal}`, e.x, e.y, '#ffd27a', true); } break; }
      case 'rivalend': A.play('waveclear', { vol: 1, gap: 0 }); break;
      case 'hit': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 6, speed: 6 }); if (W.enemies.some((q) => q.id === e.id && q.type === 'hive')) { R.chipHive(e.id, 2); snd('debris', e, { vol: 0.5, rate: 1.4, gap: 0.05 }); fx.sparks(p.x, p.y, p.z, { n: 14, speed: 8, r: 1, g: 0.6, b: 0.25, life: 0.5 }); } break; }
      case 'plink': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 5, speed: 5, s: 0.22, life: 0.25, r: 0.9, g: 0.85, b: 0.8 }); snd('beamhit', e, { vol: 0.25, rate: 0.6, gap: 0.08 }); break; }
      case 'kill': {
        if (live && mine(e) && e.score && e.type !== 'skimmer' && e.type !== 'mine' && e.type !== 'meteor' && me && !G.ai && G.mode !== 'demo' && G.mode !== 'playthrough' && SHIPS[me.ship]) addMastery(me.ship);
        const big = e.type === 'hive' || e.type === 'sower' || e.type === 'prowler' || e.type === 'coil' || e.type === 'maw';
        const v = R.vel(e.x, e.vx || 0, e.vy || 0);
        R.breakEnemy(e.id, { vx: v.x * 0.4, vy: v.y * 0.4, power: big ? 1.3 : 0.9, max: big ? 6 : 4, keep: e.type === 'skimmer' || e.type === 'mine' || e.type === 'meteor' ? 0 : big ? 3 : 1 });
        // the wreck comes down and scorches the ground below (bigger when it was blown up low)
        if (live && e.type !== 'skimmer' && e.type !== 'mine') R.scar(e.x + (e.vx || 0) * 0.4, 0, (big ? 3 : 1.8) * (e.y < 7 ? 1.25 : 1));
        const p = P(e.x, e.y);
        if (seen(e)) cab(CABK[e.type] || 'explosion', e, { rate: CABR[e.type] || 1 });
        if (e.type === 'mine') { snd('pop', e, { vol: 0.4, rate: 1.3 }); fx.explode(p.x, p.y, p.z, 0.6, { color: 0xffb070 }); break; }
        if (e.type === 'skimmer') {
          snd('pop', e, { vol: 0.5, rate: 1.25, gap: 0.04, vary: 0.25 }); A.retro('pop', { vol: 0.35, pan: pan(e.x) });
          fx.explode(p.x, p.y, p.z, 0.8, { vx: v.x * 0.3, vy: v.y * 0.3, color: 0x7af6ff, ringColor: 0x5ef0ff });
          fx.sparks(p.x, p.y, p.z, { n: 14, speed: 9, r: 0.5, g: 0.95, b: 1, life: 0.5 });
          R.shock(e.x, e.y, 0.25);
          if (live && e.pid && e.score && G.mode !== 'demo') popup(`+${e.score}${chainMult(e.chain || 0) > 1 ? ' ×' + chainMult(e.chain) : ''}`, e.x, e.y, chainMult(e.chain || 0) > 1 ? '#ffd27a' : '#8af8ff');
          if (live && e.pid && e.chain && e.chain % 4 === 0 && e.chain <= 12) { A.play('pickup', { vol: 0.5, rate: 1 + e.chain * 0.03, gap: 0.2 }); A.retro('life', { vol: 0.3 }); }
          break;
        }
        snd(big ? 'boomM' : e.type === 'stinger' ? 'pop' : 'boomS', e, { vol: big ? 0.85 : 0.6, gap: 0.03 });
        A.retro(big ? 'boom' : 'pop', { vol: 0.5, pan: pan(e.x) });
        R.shock(e.x, e.y, big ? 0.8 : 0.4); fx.sparks(p.x, p.y, p.z, { n: big ? 40 : 22, speed: big ? 16 : 12, life: 0.7 });
        if ((e.chain || 0) >= 4) fx.ring(p.x, p.y, p.z, 5 + Math.min(12, e.chain) * 0.5, 0xffd27a);
        fx.explode(p.x, p.y, p.z, big ? 2.6 : 1.5, { metal: true, vx: v.x * 0.3, vy: v.y * 0.3, color: SCOL[e.type] === 0x9dff7a ? 0xffc070 : 0xff7a50, ringColor: SCOL[e.type] });
        if (big) { R.shock(e.x, e.y, 0.5); R.addTrauma(0.12 * S); if (live) rumble(0.25, 0.3, 110); }
        if (live && e.pid && e.score && G.mode !== 'demo') popup(`+${e.score}${chainMult(e.chain || 0) > 1 ? ' ×' + chainMult(e.chain) : ''}`, e.x, e.y, e.carry ? '#8dff8a' : chainMult(e.chain || 0) > 1 ? '#ffd27a' : null);
        if (live && e.pid && e.chain && e.chain % 4 === 0 && e.chain <= 12) { A.play('pickup', { vol: 0.5, rate: 1 + e.chain * 0.03, gap: 0.2 }); A.retro('life', { vol: 0.3 }); }
        if (live && e.carry && G.mode !== 'demo') caption('LIFTER DOWN: CATCH THE SETTLER', 2.2);
        break;
      }
      case 'warpin': snd('warpin', e, { vol: e.type === 'prowler' ? 0.8 : 0.4, gap: 0.12 }); A.retro('warp', { vol: 0.25, pan: pan(e.x) }); break;
      case 'grab': snd('grab', e, { vol: 0.8, gap: 0.2 }); A.retro('grab', { vol: 0.35, pan: pan(e.x) }); cab('abduct', e); break;
      case 'lifted':
        snd('distress', e, { vol: 0.9, gap: 0.5 });
        if (live && G.mode !== 'demo') { if (!G.saidLift) { G.saidLift = true; say('lifted', { chance: 0.8 }); } caption('A SETTLER IS BEING LIFTED · SHOOT THE LIFTER', 2.6); }
        break;
      case 'fuse': {
        const p = P(e.x, e.y);
        snd('fuse', e, { vol: 1, gap: 0.2 }); cab('mutant', e, { rate: 0.8 });
        fx.explode(p.x, p.y, p.z, 1.6, { color: 0xff4a8a, ringColor: 0xff4a8a });
        R.shock(e.x, e.y, 0.7);
        if (live && G.mode !== 'demo') caption('A SETTLER WAS TAKEN · THAT LIFTER IS NOW A HUSK', 3);
        break;
      }
      case 'fall': snd('fall', e, { vol: 0.6, gap: 0.3 }); if (!e.safe) cab('fall', e); if (live && !e.safe && G.mode !== 'demo') popup('CATCH!', e.x, e.y, '#8dff8a', true); break;
      case 'catch': { const p = P(e.x, e.y); snd('catch', e, { vol: 0.9, gap: 0 }); A.retro('catch', { vol: 0.5 }); cab('catch', e); fx.sparks(p.x, p.y, p.z, { n: 16, speed: 4, r: 0.5, g: 1, b: 0.6 }); if (live) { popup(`+${e.score} CAUGHT`, e.x, e.y, '#8dff8a', true); if (mine(e)) rumble(0.2, 0.4, 120); } break; }
      case 'land': { const p = P(e.x, 0.3); snd('land', e, { vol: 0.9, gap: 0 }); A.retro('land', { vol: 0.5 }); cab('delivery', e); fx.ring(p.x, p.y, p.z, 4, 0x8dff8a); fx.sparks(p.x, p.y, p.z, { n: 14, speed: 3, r: 0.5, g: 1, b: 0.6 }); R.cheer(e.id); if (live) popup(`+${e.score} SAFE`, e.x, 1, '#8dff8a', true); break; }
      case 'selfland': R.cheer(e.id); if (live && G.mode !== 'demo') popup('LANDED SAFELY', e.x, 1, '#c8ffc8'); break;
      case 'lost': { R.siteDamage(e.x); const p = P(e.x, Math.max(0.3, e.y)); snd('lost', e, { vol: 0.8, gap: 0.2 }); A.retro('lost', { vol: 0.4 }); fx.sparks(p.x, p.y, p.z, { n: 10, speed: 3, r: 1, g: 0.5, b: 0.4 }); if (live && e.why === 'fall' && G.mode !== 'demo') caption('A SETTLER FELL TOO FAR', 2.4); break; }
      case 'colonyfall':
        R.kick(1);
        R.shatter(R.cx); A.play('boomL', { vol: 1, rate: 0.55, gap: 0 }); A.play('boomL', { vol: 0.8, rate: 0.7, delay: 0.5, gap: 0 }); slowmo(0.4, 1.6);
        A.play('colonyfall', { vol: 1, gap: 0 }); A.cab('planet'); A.play('alarm', { vol: 0.7, delay: 0.4, gap: 0 });
        R.flashScreen(0.3, 0xff3a2a); R.addTrauma(0.5 * S);
        if (live) { banner('THE PLANET IS LOST', 'FIGHT ON IN SPACE · EVERY LIFTER IS NOW A HUSK', 3.6); say('colonyfall', { key: true, delay: 0.8 }); rumble(0.7, 0.7, 600); }
        break;
      case 'colony': if (live) { banner('THE PLANET RETURNS', 'A NEW COLONY · THE SETTLERS ARE BACK', 2.8); R.flashScreen(0.6, 0xffffff); } break;
      case 'tell': snd('tell', e, { vol: 0.4, gap: 0.12 }); A.retro('tell', { vol: 0.15, pan: pan(e.x) }); break;
      case 'bolt': snd('bolt', e, { vol: e.from === 'carrier' ? 0.6 : 0.45, gap: 0.05 }); break;
      case 'boltground': { if (live && Math.random() < 0.3) R.scar(e.x, 0, 0.55, -0.4); const p = P(e.x, 0.3); fx.sparks(p.x, p.y, p.z, { n: 5, speed: 4, r: 1, g: 0.4, b: 0.3, life: 0.3 }); fx.dust(p.x, p.y, p.z, { n: 2, s0: 0.4, s1: 1.6, life: 1.4, a: 0.3 }); break; }
      case 'shield': {
        if (live && mine(e)) { R.hurt(1); hitDir(e); }
        snd('shieldhit', e, { vol: 0.9, gap: 0 });
        const v = R.views.p.get(e.pid); if (v) v.hurt = 1;
        const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 16, speed: 6, r: 0.5, g: 0.85, b: 1 });
        if (live) { if (mine(e)) { rumble(0.5, 0.6, 200); popup(e.left ? `SHIELD ${e.left} LEFT` : 'SHIELD GONE', e.x, e.y, '#9fd8ff'); } if (G.mode === 'demo') { R.frameShot([[e.x, e.y]], 1.0); slowmo(0.45, 0.5); } }
        break;
      }
      case 'death': {
        if (live && mine(e)) R.hurt(1.5);
        const v = R.vel(e.x, e.vx || 0, e.vy || 0);
        R.breakPlayer(e.pid, { power: 1.4, vx: v.x * 0.3, vy: v.y * 0.3, keep: 2 });
        if (live && e.y < 8) R.scar(e.x, 0, 2.4);
        snd('death', e, { vol: 1, gap: 0 }); A.retro('death', { vol: 0.5 }); if (mine(e)) cab('death', e); else cab('explosion', e, { rate: 0.7 });
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
        if (mine(e) || !live) R.kick(0.8);
        A.play('nova', { vol: 1, gap: 0 }); A.retro('nova', { vol: 0.5 }); cab('bomb', e);
        const p = P(e.x, e.y);
        for (const r of [10, 22, 34]) fx.ring(p.x, p.y, p.z, r, 0xffd0a0);
        R.novaWave(e.x, e.y);
        fx.flash(p.x, p.y, p.z + 4, 120, 0xffc890, 0.6);
        R.flashScreen(0.5, 0xffe8c8); R.addTrauma(0.6 * S); R.shock(e.x, e.y, 2.2);
        if (live && mine(e)) rumble(0.8, 0.8, 400);
        break;
      }
      case 'empty': if (live && mine(e)) { A.play('uiback', { vol: 0.6, gap: 0.3 }); popup('NO NOVAS LEFT', e.x, e.y, '#ff8a80'); } break;
      case 'blink': { const p = P(e.x, e.y); snd('blink', e, { vol: 0.9, gap: 0 }); A.retro('blink', { vol: 0.45 }); cab('hyperspace', e); fx.sparks(p.x, p.y, p.z, { n: 24, speed: 9, r: 0.6, g: 0.85, b: 1 }); fx.ring(p.x, p.y, p.z, 5, 0x8fd8ff); break; }
      case 'blinkin': { const p = P(e.x, e.y); A.play('blinkin', { vol: 0.8, delay: 0.05, gap: 0 }); fx.ring(p.x, p.y, p.z, 5, 0x8fd8ff); R.shock(e.x, e.y, 0.5); if (live && mine(e)) R.updateCamera(0.016, { snap: true, me: myPlayer(W), chase: chaseOn() }); break; }
      case 'mine': snd('mine', e, { vol: 0.35, gap: 0.25 }); A.retro('mine', { vol: 0.15, pan: pan(e.x) }); break;
      case 'pop': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 6, speed: 3, r: 1, g: 0.7, b: 0.4, life: 0.3 }); break; }
      case 'hivepop': { const p = P(e.x, e.y); fx.sparks(p.x, p.y, p.z, { n: 40, speed: 12, r: 1, g: 0.62, b: 0.25, life: 0.6 }); fx.ring(p.x, p.y, p.z, 4, 0xffa040); R.shock(e.x, e.y, 0.7); }
        if (live && (G.mode === 'demo' || G.mode === 'playthrough')) { R.frameShot([[e.x, e.y]], 1.7); slowmo(0.5, 1.1); }
        snd('hivepop', e, { vol: 0.9, gap: 0 }); snd('swarm', e, { vol: 0.7, delay: 0.2, gap: 0.5 }); A.retro('swarm', { vol: 0.3, pan: pan(e.x) }); cab('pod', e); if (live && G.mode !== 'demo') caption(`THE HIVE BURST · ${e.n} STINGERS`, 2); break;
      case 'prowler': if (live) { A.play('prowler', { vol: 0.8, gap: 0 }); if (G.mode !== 'demo') caption('A PROWLER IS HUNTING YOU · FINISH THE WAVE', 2.6); } break;
      case 'drop': { const p = P(e.x, e.y); fx.ring(p.x, p.y, p.z, 2.5, POWERUPS[e.kind].color); fx.sparks(p.x, p.y, p.z, { n: 10, speed: 3, life: 0.6 }); break; }
      case 'pickup': {
        const Pw = POWERUPS[e.kind], p = P(e.x, e.y);
        A.play('pickup', { vol: 0.9, gap: 0 }); cab('credit', e);
        fx.ring(p.x, p.y, p.z, 3.5, Pw.color); fx.sparks(p.x, p.y, p.z, { n: 24, speed: 5, life: 0.7 }); fx.flash(p.x, p.y, p.z, 14, Pw.color, 0.3);
        if (live) { popup(Pw.name, e.x, e.y, '#' + Pw.color.toString(16).padStart(6, '0'), true); if (mine(e)) rumble(0.2, 0.4, 120); }
        break;
      }
      case 'pwend': if (live && mine(e)) A.play('pwend', { vol: 0.5, gap: 0.2 }); break;
      case 'life': if (live) { A.play('life', { vol: 0.9, gap: 0 }); A.retro('life', { vol: 0.45 }); A.cab('extra'); caption('+1 SHIP', 2.5); } break;
      case 'wave': if (live && e.special) {
        const S = SPECIALS.find((q) => q.key === e.special) || SPECIALS[0];
        A.play('alarm', { vol: 0.8, gap: 0 }); A.play('bossroar', { vol: 0.5, rate: 1.5, delay: 0.3, gap: 0 }); A.cab('start', { rate: 1.2 });
        R.flashScreen(0.22, 0xff7a4a); R.addTrauma(0.3 * +settings.shake); R.kick(0.7);
        banner(S.name, `SPECIAL WAVE · ${e.total} FIGHTERS · NO LIFTERS · DESTROY THEM ALL`, 3.4);
        rumble(0.6, 0.5, 400);
        break;
      }
      if (live) { A.play('alarm', { vol: 0.35, gap: 0 }); banner(W.mode === 'endless' ? `WAVE ${e.n}` : `WAVE ${e.w + 1}`, W.mode === 'endless' ? SECTORS[W.k].name : `${SECTORS[W.sector].name} · ${W.R.lifters} LIFTERS`, 2.2); } break;
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
        snd('nodebreak', e, { vol: 1, gap: 0 }); A.retro('boom', { vol: 0.5 }); cab('bomber', e, { rate: 0.8 });
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
      case 'cboom': { if (live && !e.small) R.scar(e.x + (Math.random() - 0.5) * 10, 0, 3); const p = P(e.x, e.y); snd('boomM', e, { vol: e.small ? 0.6 : 0.8, gap: 0.08 }); fx.explode(p.x, p.y, p.z, e.small ? 1.8 : 3, { metal: true }); R.addTrauma((e.small ? 0.12 : 0.25) * S); R.shock(e.x, e.y, 0.6); break; }
      case 'bossshed': {
        const p = P(e.x, e.y);
        snd('boomL', e, { vol: 1, rate: 0.9, gap: 0 }); snd('bossroar', e, { vol: 1, rate: 0.75, delay: 0.3, gap: 0 }); A.retro('bigboom', { vol: 0.5 }); cab('bomb', e, { rate: 0.85 });
        for (let k = 0; k < 5; k++) fx.explode(p.x + (Math.random() - 0.5) * 16, p.y + (Math.random() - 0.5) * 5, p.z, 3.2, { metal: true, color: 0xffb070 });
        fx.debris(p.x, p.y, p.z, { metal: true, n: 40, speed: 14, size: 0.8, trail: true });
        fx.ring(p.x, p.y, p.z, 26, 0xffa060);
        R.flashScreen(0.45, 0xffd0a0); R.addTrauma(0.8 * S); R.shock(e.x, e.y, 2);
        if (live) { banner('ARMOUR DOWN', `${BOSSES[e.key].name} · ITS CORE IS OPENING`, 2.4); rumble(0.9, 0.8, 700); slowmo(0.5, 1); }
        break;
      }
      case 'bossphase2':
        snd('bossroar', e, { vol: 1, rate: 1.1, gap: 0 }); A.play('alarm', { vol: 0.6, gap: 0 }); R.flashScreen(0.2, 0xff3a5a); R.shock(e.x, e.y, 1.6);
        if (live) caption('THE CORE IS EXPOSED · HIT THE GLOWING HEART AND VENTS', 3);
        break;
      case 'hyper':
        if (mine(e)) R.kick(0.9);
        A.play('upgrade', { vol: 1, gap: 0 }); A.play('nova', { vol: 0.5, rate: 1.4, gap: 0 }); A.retro('life', { vol: 0.5 }); cab('extra', e, { rate: 1.25 });
        R.flashScreen(0.35, 0xffffff); R.shock(e.x, e.y, 1.6); R.addTrauma(0.3 * S);
        if (live && mine(e)) { banner('HYPER', 'EVERYTHING ELSE SLOWS · RAM THEM · DOUBLE POINTS', 1.8); rumble(0.6, 0.6, 400); }
        break;
      case 'hyperend': if (live && mine(e)) { A.play('pwend', { vol: 0.8, gap: 0 }); caption('HYPER OVER', 1.2); } break;
      case 'event': {
        const T = { meteors: ['METEOR SHOWER', 'SHOOT THE ROCKS BEFORE THEY HIT THE COLONY'], sandstorm: ['SANDSTORM', 'THE WIND PUSHES YOU · THE SCANNER IS JAMMED'], flare: ['SOLAR FLARE', 'THE MACHINES ARE STUNNED · THE SCANNER IS SCRAMBLED'], eruption: ['ERUPTION', 'SHOOT THE LAVA BOMBS BEFORE THEY LAND'], eclipse: ['ECLIPSE', 'THE SKY GOES DARK · THE SCANNER ONLY SEES CLOSE'] }[e.kind];
        A.play('alarm', { vol: 0.45, gap: 0 });
        if (e.kind === 'flare') { R.flashScreen(0.85, 0xffffff); R.addTrauma(0.4 * S); A.play('boomL', { vol: 0.7, rate: 0.5, gap: 0 }); }
        if (e.kind === 'eclipse') A.play('bossroar', { vol: 0.5, rate: 0.6, gap: 0 });
        if (live && T) banner(T[0], T[1], 2.6);
        break;
      }
      case 'impact': { if (live) R.scar(e.x, e.lava ? 2 : 1, e.lava ? 2.8 : 4); const p = P(e.x, 0.4); snd('boomM', e, { vol: 0.8, gap: 0.05 }); if (seen(e)) cab('explosion', e, { rate: 0.6 }); fx.explode(p.x, p.y, p.z, 2.2, { rock: true, color: e.lava ? 0xff7a30 : 0xffa060 }); R.shock(e.x, 0.4, 0.7); R.addTrauma(0.18 * S); break; }
      case 'vent': { if (live && Math.random() < 0.5) R.scar(e.x, 2, 1.6); const p = P(e.x, 0.6); fx.fire(p.x, p.y, p.z, { n: 10, s: 1.4, sp: 1.2, jit: 4, life: 0.8 }); snd('boomS', e, { vol: 0.5, rate: 0.7, gap: 0.1 }); break; }
      case 'bosskill': {
        R.kick(1.2);
        const p = P(e.x, e.y);
        if (R.bossV) R.breakView(R.bossV, { power: 2.2, max: 12, keep: 6 });
        if (live) { R.scar(e.x, 1, 6, 3); R.scar(e.x - 9, 1, 4); R.scar(e.x + 10, 1, 4.5); }
        snd('boomL', e, { vol: 1, rate: 0.8, gap: 0 }); A.retro('bigboom', { vol: 0.5 }); cab('bomb', e, { rate: 0.7 });
        fx.explode(p.x, p.y, p.z, 6, { metal: true, color: 0xffb070 }); fx.explode(p.x + 4, p.y - 1, p.z, 4, { metal: true }); fx.debris(p.x, p.y, p.z, { metal: true, n: 30, speed: 12, size: 0.6, trail: true });
        fx.ring(p.x, p.y, p.z, 30, 0xffd0a0); fx.ring(p.x, p.y, p.z, 60, 0xffffff);
        for (let k = 0; k < 26; k++) { const q = P(e.x + (Math.random() - 0.5) * 70, e.y + 6 + Math.random() * 14); fx.debris(q.x, q.y, q.z, { metal: true, n: 2, speed: 3, size: 0.5 + Math.random() * 0.6, trail: true }); }
        R.flashScreen(0.9, 0xffffff); R.addTrauma(1 * S); R.shock(e.x, e.y, 3); slowmo(0.35, 1.8);
        if (live) {
          G.pendingClip = { n: W.n, kind: 'boss' };
          popup('+' + e.bonus.toLocaleString(), e.x, e.y, null, true);
          say('bossdown', { key: true, delay: 1 });
          if (W.mode === 'campaign') A.sting('clear'); else setTimeout(() => { if (G.W === W) A.playMusic(SECTORS[W.k].music); }, 3500);
        }
        break;
      }
      case 'newworld': if (live) { banner('A NEW WORLD', SECTORS[e.look].name, 3); R.clearScars(); R.setLook(e.look); buildStrip(W); } break;
      case 'clear': if (G.run) G.run.saved = (G.run.saved || 0) + e.alive; if (live) { banner('WORLD CLEAR', `+${e.bonus.toLocaleString()} · ${fmtT(e.t)}`, 3); if (e.alive === W.settlers.length) say('saved', { key: true, delay: 3.2 }); } break;
      case 'tut': if (live) tutorial(e.key); break;
    }
  }
}
// sounds the renderer asks for (wreckage landing, distant thunder)
R.sfx = (name, o) => {
  if (name === 'debris') { A.play('debris', { x: o.x, y: o.y, z: o.z, vol: 0.35, gap: 0.12, vary: 0.2 }); return; }
  if (name === 'thunder') { A.play('boomL', { vol: 0.25, rate: 0.45, delay: 0.4 + Math.random() * 0.8, gap: 1.5 }); }
};
// AUTO-FIRE (Options; on by default on touch screens): fire whenever a machine or a carrier's weak point is lined up
// ahead within reach. The decision becomes part of the recorded input, so replays stay exact.
const autoFireOn = () => settings.autofire === 'on' || (settings.autofire === 'auto' && I.lastKind === 'touch');
function lined(W, p) {
  if (!p || !p.alive) return false;
  const range = beamRange(W) * 0.95, band = F.beamH + (p.assist || 0) * 2.2;
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0) continue;
    const d = wd(e.x - p.x) * p.face;
    if (d > 1 && d < range && Math.abs(e.y - p.y) < ENEMY[e.type].r + band) return true;
  }
  const B = W.boss;
  if (B && B.st === 'fight') for (let i = 0; i < B.nodes.length; i++) {
    if (B.nodes[i].hp <= 0) continue;
    const [nx, ny] = nodePos(B, i), d = wd(nx - p.x) * p.face;
    if (d > 1 && d < range && Math.abs(ny - p.y) < 1.15 + band) return true;
  }
  return false;
}
// a point on the line from the camera to p, close enough that the sound plays at full volume
function nearMe(p) { const c = R.camera.position, dx = p.x - c.x, dy = p.y - c.y, dz = p.z - c.z, l = Math.hypot(dx, dy, dz) || 1, k = Math.min(1, 18 / l); return { x: c.x + dx * k, y: c.y + dy * k, z: c.z + dz * k }; }
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a world / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (G.mode === 'online' && W.rivals) {
    const me = myPlayer(W), other = W.players.find((q) => q !== me), a = me ? me.score || 0 : 0, b = other ? other.score || 0 : 0;
    W.score = a;
    results(W, a > b ? 'YOU WIN' : a < b ? 'YOUR RIVAL WINS' : 'A DRAW', `RIVALS · YOU ${a.toLocaleString()} · RIVAL ${b.toLocaleString()}`);
    return;
  }
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
    if (got.length) { A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 }); A.cab('credit'); }
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
  $('pause-photo').classList.toggle('hidden', G.mode === 'online');
  if (G.mode === 'online') { show('pause'); $('pause-sub').textContent = 'ONLINE · THE FIGHT KEEPS GOING'; G.state = 'paused-online'; return; }
  G.state = 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.W.mode === 'endless' ? `ENDLESS ORBIT · WAVE ${G.W.waveN}` : `WORLD ${G.W.sector + 1} · ${CP_NAMES[G.W.cp]}`;
  $('pause-replay').classList.toggle('hidden', !G.clip);
  show('pause', false);
}
function resume() { if (G.photo) { G.photo = false; R.photo = null; $('photobar').classList.add('hidden'); setHud(true); } if (G.state === 'paused' || G.state === 'paused-online') { G.state = 'play'; A.muffle(false); hideScreens(); } }

// ------------------------------------------------------------------ online co-op
function netStatus(text, kind) {
  const el = $('net-status');
  if (text === 'waiting') { el.textContent = 'Waiting for your wingmate to join…'; el.className = ''; return; }
  el.textContent = text; el.className = kind === 'error' ? 'error' : '';
}
function syncNetMode() { const rv = settings.netMode === 'rivals'; setText('net-title', rv ? 'ONLINE RIVALS' : 'ONLINE CO-OP'); setText('net-sub', rv ? `TWO GUNSHIPS · ONE PLANET · ${RIVALS.waves} WAVES · MOST POINTS WINS · SHOOT A RIVAL'S CATCH TO STEAL IT` : 'TWO GUNSHIPS · ONE COLONY · SHARED SHIPS · THE HOST PICKS THE WORLD'); }
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
  const rv = settings.netMode === 'rivals', r0 = route === 'deep' && rv ? '0' : route;
  const cfg = r0 === 'deep' ? { gm: 'endless', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +r0, seed: newSeed(), up: { ...TYPICAL_UP[+r0] }, diff: settings.diff, cp: rv ? 0 : +params.get('wave') || 0, rivals: rv };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'endless' ? 'endless' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, rivals: !!cfg.rivals, lives: cfg.rivals ? 99 : START_LIVES + 2 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives, noTut: true, diff: cfg.diff, assist: assistOf(), cp: cfg.cp || 0, [NET.host ? 'ship' : 'ship2']: shipOf(settings.ship), [NET.host ? 'mast' : 'mast2']: mastOf(shipOf(settings.ship)) });
  NET.bind(W);
  if (!NET.host) { W.players[1].assist = assistOf(); W.players[0].assist = 0; }
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  if (cfg.rivals) { banner('RIVALS', `${SECTORS[cfg.sector || 0].name} · SAVE MORE SETTLERS THAN YOUR RIVAL`, 3.2); caption('SHOOT YOUR RIVAL WHILE THEY CARRY A SETTLER TO KNOCK IT LOOSE', 5); }
  else banner('CO-OP', cfg.gm === 'endless' ? 'ENDLESS ORBIT' : SECTORS[cfg.sector || 0].name, 3);
}
window.__sh.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); A.cab('credit'); startCampaign(0); break;
    case 'deep': A.play('uiok', { gap: 0 }); A.cab('credit'); startEndless(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); A.cab('credit'); startPlaythrough(+settings.aiWorld || 0, +settings.aiWave || 0); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'aiwatch': A.play('uiok', { gap: 0 }); show('aiwatch'); syncSegs(); aiWatchDesc(); break;
    case 'online': show('online'); syncNetMode(); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': buildLiveries(); buildShips(); show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'net-quick': NET.quick({ ini: HS.initials() }, settings.netMode === 'rivals' ? QUICK_R : QUICK); break;
    case 'net-host': { const code = randomCode(4); $('room-code').textContent = code; $('room-wrap').classList.remove('hidden'); NET.connect(ROOM + (settings.netMode === 'rivals' ? 'R' : '') + code, 'host', { ini: HS.initials() }); break; }
    case 'net-join': { const code = cleanCode($('join-code').value); if (code.length !== 4) { netStatus('Type the 4-letter room code', 'error'); return; } NET.connect(ROOM + (settings.netMode === 'rivals' ? 'R' : '') + code, 'join', { ini: HS.initials() }); netStatus('Joining…'); break; }
    case 'net-go': hostStart(); break;
    case 'net-back': NET.close(); A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1); break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
    case 'continue': continueRun(); break;
    case 'resume': resume(); break;
    case 'photo': A.play('uiok', { gap: 0 }); enterPhoto(); break;
    case 'photosave': photoSave(); break;
    case 'photoback': A.play('uiback', { gap: 0 }); exitPhoto(); break;
    case 'photoin': if (R.photo) R.photo.dolly = clamp(R.photo.dolly * 0.85, 0.3, 1.6); break;
    case 'photoout': if (R.photo) R.photo.dolly = clamp(R.photo.dolly * 1.18, 0.3, 1.6); break;
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
const UNLOCK_ALL = params.has('unlockall');
const mastOf = (k) => (UNLOCK_ALL ? 2 : mastLevel(mastery[k] || 0));
// one more machine down with gunship k: a new mastery level shows at once and applies from the next world
function addMastery(k) {
  const before = mastLevel(mastery[k] || 0);
  mastery[k] = (mastery[k] || 0) + 1;
  const now = mastLevel(mastery[k]);
  if (now > before) {
    const P = MASTERY.perks[k][now - 1];
    store('sh.mastery.v1', mastery);
    A.play('medal', { vol: 0.9, gap: 0 }); A.cab('credit');
    banner(`${SHIPS[k].name} MASTERY ${now === 1 ? 'I' : 'II'}`, `${P.name}: ${P.desc.toUpperCase()} · FROM THE NEXT WORLD`, 3.2);
  } else if (mastery[k] % 20 === 0) store('sh.mastery.v1', mastery);
}
function shipDesc(k) {
  const n = mastery[k] || 0, lv = mastOf(k), P = MASTERY.perks[k];
  const perks = P.map((q, i) => `<span class="${lv > i ? 'got' : ''}">${lv > i ? '✓' : '🔒'} ${q.name}: ${q.desc}${lv > i ? '' : ` (at ${MASTERY.at[i]})`}</span>`).join('');
  return `${SHIPS[k].desc}<span class="mast">MASTERY ${lv}/2 · ${n.toLocaleString()} MACHINES DOWN${perks}</span>`;
}
function shipOf(key) { const s = SHIPS[key] ? key : 'warden'; return UNLOCK_ALL || medals.size >= SHIPS[s].medals ? s : 'warden'; }
function buildShips() {
  $('ships').innerHTML = SHIP_KEYS.map((k) => { const s = SHIPS[k], open = UNLOCK_ALL || medals.size >= s.medals; return `<button data-v="${k}" ${open ? '' : 'disabled'}>${open ? '' : '🔒'}${s.name}${open ? '' : ' · ' + s.medals}</button>`; }).join('');
  $('ship-desc').innerHTML = shipDesc(shipOf(settings.ship));
}
// ------------------------------------------------------------------ the title screen's gunships and enemy
// Every gunship and its name, each drawn with its real model in the pilot's livery (drawn again only when the livery
// changes); locked ships are dimmed with the medals they need. Under them THE ENEMY: every machine and every carrier by
// name, drawn once, a few at a time after the title shows. Right of the title card, or inside it when narrow.
const HANGAR = { livery: '', enemy: null, narrow: matchMedia('(max-width: 739px)') };
// the machines in about the order a campaign brings them (names as the NEW MACHINE card gives them, the description
// as a tooltip); a mine or a meteor is not a machine of its own
const ROSTER = ['lifter', 'husk', 'sower', 'hive', 'stinger', 'prowler', 'skimmer', 'whirler', 'coil', 'spark', 'scorcher', 'maw'];
const ROSTER_NAME = { skimmer: 'SKIMMER', whirler: 'WHIRLER' };
function placeHangar() {
  const h = $('title-side'), title = $('title'), card = title.querySelector('.card');
  if (HANGAR.narrow.matches) { if (h.parentElement !== card) card.insertBefore(h, card.querySelector('.foot')); }
  else if (h.parentElement !== title) title.appendChild(h);
}
const putPic = (c, img) => c.getContext('2d', { willReadFrequently: true }).putImageData(img, 0, 0);
function buildEnemy() {
  const esc = (t) => t.replace(/"/g, '&quot;');
  $('en-count').textContent = `${ROSTER.length} MACHINES · ${SECTORS.length} CARRIERS`;
  $('en-machines').innerHTML = ROSTER.map((k) => `<div class="en" data-type="${k}" title="${esc(MACHINES[k][1])}"><canvas width="${PW}" height="${PH}"></canvas><b>${ROSTER_NAME[k] || MACHINES[k][0]}</b></div>`).join('');
  $('en-carriers').innerHTML = SECTORS.map((s, i) => `<div class="en" data-boss="${s.boss}" title="${esc(s.name)}"><canvas width="${PW}" height="${PH}"></canvas><b>${BOSSES[s.boss].name}</b><small>WORLD ${i + 1}</small></div>`).join('');
  // one picture a step, so the title keeps drawing while they come in (and none while a game is on)
  HANGAR.enemy = (async () => {
    const jobs = [...[...$('en-machines').children].map((el) => [el, () => R.machinePictures([el.dataset.type])[0]]),
      ...[...$('en-carriers').children].map((el) => [el, () => R.carrierPictures([el.dataset.boss])[0]])];
    for (const [el, pic] of jobs) {
      do await new Promise((res) => setTimeout(res, G.state === 'title' ? 0 : 400)); while (G.state !== 'title');
      try { putPic(el.querySelector('canvas'), pic()); } catch (e) { console.warn('enemy picture', el.dataset.type || el.dataset.boss, e); }
    }
  })();
}
HANGAR.narrow.addEventListener('change', placeHangar);
function syncHangar() {
  placeHangar();
  const grid = $('gs-grid');
  if (!grid.children.length) grid.innerHTML = SHIP_KEYS.map((k) => `<div class="gs" data-ship="${k}"><canvas width="${PW}" height="${PH}"></canvas><i class="hidden">🔒 <span>${SHIPS[k].medals}</span><em> MEDALS</em></i><b>${SHIPS[k].name}</b><small>${SHIPS[k].role}</small></div>`).join('');
  let open = 0;
  for (const el of grid.children) {
    const s = SHIPS[el.dataset.ship], ok = UNLOCK_ALL || medals.size >= s.medals;
    open += ok ? 1 : 0;
    el.classList.toggle('locked', !ok);
    el.querySelector('i').classList.toggle('hidden', ok);
  }
  $('gs-sub').textContent = open > 1 ? 'PICK ONE IN OPTIONS' : 'MEDALS UNLOCK THE REST';
  if (!HANGAR.enemy) buildEnemy();
  const L = liveryOf(settings.livery);
  if (HANGAR.livery === L.key) return;
  HANGAR.livery = L.key;
  try {
    const pics = R.portraits(SHIP_KEYS, L);
    // drawn once and kept: CPU-backed canvases (cheap to read back for the self-test)
    [...grid.children].forEach((el, i) => putPic(el.querySelector('canvas'), pics[i]));
  } catch (e) { console.warn('hangar', e); }
}
function liveryOf(key) { const s = LIVERIES.find((q) => q.key === key) || LIVERIES[0]; return medals.size >= s.medals ? s : LIVERIES[0]; }
function buildLiveries() {
  $('liveries').innerHTML = LIVERIES.map((s) => { const open = medals.size >= s.medals; return `<button data-v="${s.key}" ${open ? '' : 'disabled'} style="--sc:#${s.color.toString(16).padStart(6, '0')}">${open ? '' : '🔒'}${s.name}${open ? '' : ' · ' + s.medals}</button>`; }).join('');
}
function applySettings() {
  { const s = liveryOf(settings.livery); if (R.livery.key !== s.key) R.setLivery(s); }
  if ($('ship-desc')) $('ship-desc').innerHTML = shipDesc(shipOf(settings.ship));
  if (G.screen === 'aiwatch') aiWatchDesc();   // (not at start-up: the machine list is defined further down)
  if ($('net-title')) syncNetMode();
  if ($('diff-desc')) $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  if (G.state === 'title') { $('title-best').textContent = `BEST ${Math.max(boardOf('campaign', settings.diff).best(), 0).toLocaleString()} · ${DL(settings.diff)}`; syncHangar(); }
  A.vol.music = settings.music / 100 * 0.8; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100; A.applyVolumes();
  A.setRetro(settings.retro !== 'off'); A.setCab(settings.cab !== 'off'); A.setLayersOn(settings.layers !== 'off'); R.cine = settings.cine !== 'off';
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
I.on('pause', () => { if (G.photo) exitPhoto(); else if (G.state === 'play') pause(); else if (G.state === 'paused' || G.state === 'paused-online') resume(); else if (G.state === 'replay') endReplay(); else if (G.screen && G.screen !== 'title') act('back'); });
I.on('confirm', () => { if (G.screen && selEl) selEl.click(); });
I.on('back', () => { if (G.screen && G.screen !== 'title' && G.screen !== 'results' && G.screen !== 'upgrades') act('back'); });
I.on('key', (k, e) => {
  A.unlock();
  if (G.photo) { if (k === 'Enter' || k === 'Space' || k === 'NumpadEnter') photoSave(); return; }
  if (k === 'KeyC' && (G.state === 'play' || G.state === 'paused') && !G.ini && G.mode !== 'demo' && G.mode !== 'playthrough') { toggleCamera(); return; }
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
const MACHINES = {
  lifter: ['LIFTER', 'Comes down for your settlers and carries them up. If it reaches the top it fuses with its captive.'],
  husk: ['HUSK', 'A lifter fused with a settler it carried off: fast, vicious, and it hunts you.'],
  sower: ['SOWER', 'Drifts high and sows floating mines behind it.'],
  hive: ['HIVE POD', 'Shoot it and it breaks apart: every hit knocks a plate off, then it splits open into a swarm of stingers.'],
  stinger: ['STINGER', 'Small and fast: bursts out of a hive pod and swarms you.'],
  prowler: ['PROWLER', 'Comes for a pilot who takes too long over a wave. Finish the wave.'],
  skimmer: ['SKIMMER FLOCK', 'Harmless. Shoot the whole flock for points and a long chain.'],
  meteor: ['METEOR', 'A falling rock: shoot it before it hits the colony.'],
  whirler: ['WHIRLER RING', 'Six small dogfighters spinning in a ring: it shadows you, then the whole ring dives at you.'],
  coil: ['COIL', 'A slow generator that keeps letting out sparks. Destroy it first.'],
  spark: ['SPARK', 'A small, fast mote from a coil: it zigzags in to ram you and burns out after a while.'],
  scorcher: ['SCORCHER', 'Hops about you and throws firebrands that curve after you for a moment. Keep moving.'],
  maw: ['MAW', 'A jawed hunter: when its jaws open, it is about to dash in and bite. Get out of its line.'],
};
const seenM = new Set(load('sh.seen.v1', []));
function meetMachines(W) {
  if (G.mode === 'demo' || G.mode === 'playthrough' || G.ai || G.capT > 0.4 || G.bannerT > 0) return;
  const half = halfView() * 0.9;
  if (W.gate && !seenM.has('gate') && Math.abs(wd(W.gate.x - R.cx)) < half) { seenM.add('gate'); store('sh.seen.v1', [...seenM]); caption('THE SKYGATE · Fly through it and it throws you to wherever a settler needs you most.', 4.4); return; }
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0 || seenM.has(e.type) || !MACHINES[e.type] || Math.abs(wd(e.x - R.cx)) > half) continue;
    seenM.add(e.type); store('sh.seen.v1', [...seenM]);
    const [n, d] = MACHINES[e.type];
    caption(`NEW MACHINE · ${n}: ${d}`, 4.2);
    if (e.type !== 'lifter' && e.type !== 'skimmer') { R.frameShot([[e.x, e.y]], 1.0); slowmo(0.55, 0.8); }
    return;
  }
}
// where the hit came from: a red arc round the ship on the side the shot or machine came from
function hitDir(e) {
  const el = $('hitdir'); if (!el) return;
  R.project(e.x, e.y, PE); const px = PE.x, py = PE.y;
  R.project(e.fx ?? e.x, e.fy ?? e.y, PE);
  const a = Math.atan2(PE.y - py, PE.x - px);
  el.style.left = px + 'px'; el.style.top = py + 'px'; el.style.transform = `translate(-50%, -50%) rotate(${(a + Math.PI / 2).toFixed(3)}rad)`;
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
}
// PHOTO MODE (from the pause menu): the HUD goes, the paused view can be orbited, tilted, zoomed and slid, and saved
function enterPhoto() {
  if (G.state !== 'paused') return;
  G.photo = true; R.photo = { yaw: 0, pitch: 0, dolly: 1, pan: 0 };
  hideScreens(); setHud(false); $('photobar').classList.remove('hidden');
}
function exitPhoto() {
  if (!G.photo) return;
  G.photo = false; R.photo = null; $('photobar').classList.add('hidden');
  setHud(true); show('pause', false);
}
function photoTick(dt) {
  const Q = R.photo, K = I.keys; if (!Q) return;
  const d = (a, b) => ((K.has(a[0]) || K.has(a[1])) ? 1 : 0) - ((K.has(b[0]) || K.has(b[1])) ? 1 : 0);
  Q.yaw = clamp(Q.yaw + d(['ArrowLeft', 'ArrowLeft'], ['ArrowRight', 'ArrowRight']) * dt * 0.9, -1.25, 1.25);
  Q.pitch = clamp(Q.pitch + d(['ArrowDown', 'ArrowDown'], ['ArrowUp', 'ArrowUp']) * dt * 0.6, -0.5, 0.2);
  Q.dolly = clamp(Q.dolly * (1 + d(['KeyS', 'Minus'], ['KeyW', 'Equal']) * dt * 0.9), 0.3, 1.6);
  Q.pan = clamp(Q.pan + d(['KeyD', 'KeyD'], ['KeyA', 'KeyA']) * dt * 22, -60, 60);
}
function photoSave() {
  if (!G.photo) return;
  R.render(0, {});   // draw, then read the canvas in the same task (the drawing buffer is not kept between frames)
  R.r.domElement.toBlob((b) => {
    if (!b) return;
    const a = document.createElement('a'), d = new Date(), z = (n) => String(n).padStart(2, '0');
    a.href = URL.createObjectURL(b); a.download = `skyhold-${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}.png`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    A.play('uiok', { gap: 0 });
    const f = $('photobar'); f.classList.remove('snap'); void f.offsetWidth; f.classList.add('snap');
  }, 'image/png');
}
{
  // drag to orbit and tilt, wheel to zoom
  let drag = null;
  addEventListener('pointerdown', (e) => { if (G.photo && !(e.target.closest && e.target.closest('#photobar'))) drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointermove', (e) => { if (!G.photo || !drag || !R.photo) return; const Q = R.photo; Q.yaw = clamp(Q.yaw - (e.clientX - drag.x) * 0.004, -1.25, 1.25); Q.pitch = clamp(Q.pitch - (e.clientY - drag.y) * 0.003, -0.5, 0.2); drag = { x: e.clientX, y: e.clientY }; });
  addEventListener('pointerup', () => { drag = null; });
  addEventListener('wheel', (e) => { if (G.photo && R.photo) R.photo.dolly = clamp(R.photo.dolly * (1 + Math.sign(e.deltaY) * 0.08), 0.3, 1.6); }, { passive: true });
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
  if (R.chaseK > 0.5 && me && me.alive) {
    // machines close behind you get one marker of their own
    let behind = 0;
    for (const e of W.enemies) if (e.hp > 0 && e.born <= 0 && HOSTILE_T.has(e.type) && wd(e.x - me.x) * me.face < 0 && Math.abs(wd(e.x - me.x)) < 32) behind++;
    if (behind) list.push({ x: wp(me.x - me.face * 20), y: me.y, c: 'red', icon: '▼', d: undefined, label: behind + ' BEHIND', back: true });
    let nb = 0, nt = 0;
    const bottom = I.touchOn ? vh - 210 : vh - pad;
    for (const q of list) {
      const back = q.back || wd(q.x - me.x) * me.face < 0;
      R.project(q.x, q.y, PE);
      if (!back && PE.z < 1 && PE.x > pad && PE.x < vw - pad && PE.y > top && PE.y < vh - pad) continue;
      let d = WM[n];
      if (!d) { d = document.createElement('div'); box.appendChild(d); WM.push(d); }
      n++;
      const i = back ? nb++ : nt++, x = vw / 2 + Math.ceil(i / 2) * 56 * (i % 2 ? 1 : -1), y = back ? bottom : top;
      d.className = 'wm ' + q.c; d.style.display = '';
      d.style.left = clamp(x, pad, vw - pad) + 'px'; d.style.top = y + 'px';
      if (q.col) d.style.setProperty('--c', q.col);
      const html = `<em style="transform:rotate(${back ? Math.PI / 2 : -Math.PI / 2}rad)"></em><b>${q.icon}</b>${q.label ? `<small>${q.label}</small>` : q.d !== undefined ? `<small>${q.d} m</small>` : ''}`;
      if (d._h !== html) { d.innerHTML = html; d._h = html; }
    }
    for (let i = n; i < WM.length; i++) WM[i].style.display = 'none';
    return;
  }
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
  const menu = G.state === 'title' || (['aiwatch', 'sectors', 'online', 'scores', 'medals', 'options', 'help'].includes(G.screen) && G.mode === 'title');
  R.updateCamera(dt, { me: me && me.alive && !menu ? me : null, cine: menu, shake: +settings.shake, chase: !menu && chaseOn() });
  R.W = cur;

  R.danger = G.state === 'play' && me && me.alive && me.shield === 0 && cur.lives <= 1 && G.mode !== 'demo' && G.mode !== 'playthrough' && !cur.rivals;
  if (G.photo) photoTick(dt);
  if (draw) R.sync(cur, dt);
  if (interp) lerpOut();
  A.setListener(R.camera);
  loops(cur, menu, dt);
  if (draw) R.render(dt, {});
  R.beamLight.intensity *= Math.exp(-dt * 30);
  R.podLinks(cur);
  if (G.state === 'play' || G.state === 'paused-online') { updateWarnings(cur); drawScanner(cur); wingTag(cur); meetMachines(cur); } else $('wingtag').classList.add('hidden');
  if (G.bannerT > 0) { G.bannerT -= dt; if (G.bannerT <= 0) $('banner').classList.add('hidden'); }
  if (G.tutT > 0) { G.tutT -= dt; if (G.tutT <= 0) $('tut').classList.add('hidden'); }
  if (G.capT > 0) { G.capT -= dt; if (G.capT <= 0) $('caption').classList.add('hidden'); }
}
// CHASE camera: with the view behind the ship, right / forward flies on the way you face and left turns you about.
// The direction is fixed when the push starts, so holding left turns once and then flies on. The mapped input is what
// the world records, so replays stay exact.
// ?chase lets the demo autopilot fly under the chase camera too (for checks and screenshots)
const CHASE_ALL = params.has('chase');
const chaseOn = () => settings.camera === 'chase' && (CHASE_ALL || (G.mode !== 'demo' && G.mode !== 'playthrough' && !G.ai));
function chaseMx(mx, me) {
  if (!chaseOn() || !me) { G.chS = 0; return mx; }
  const s = Math.sign(mx);
  if (!s) { G.chS = 0; return 0; }
  if (s !== G.chS) { G.chS = s; G.chL = s > 0 ? me.face : -me.face; }
  return Math.abs(mx) * G.chL;
}
function toggleCamera() {
  settings.camera = settings.camera === 'chase' ? 'side' : 'chase'; saveSettings(); syncSegs(); G.chS = 0;
  if (G.state === 'play') caption(settings.camera === 'chase' ? 'CHASE CAMERA · RIGHT FLIES ON · LEFT TURNS ABOUT · C TO SWITCH' : 'SIDE CAMERA · C TO SWITCH', 2.4);
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
      else { const c = I.control(); c.mx = chaseMx(c.mx, me); if (G.state === 'play' && !c.fire && autoFireOn() && lined(W, me)) c.fire = true; me.input = G.state === 'play' ? c : { mx: 0, my: 0, fire: false, nova: false, blink: false }; }
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
  if (W.special && W.phase === 'fight') { const S = SPECIALS.find((q) => q.key === W.special.key); return `${S ? S.name : 'SPECIAL WAVE'} · ${W.special.left} OF ${W.special.total} FIGHTERS LEFT`; }
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
// MUSIC LAYERS: how hot the fight is right now (machines close to you, machines on the planet, a carrier, a planet
// event, HYPER), eased in quickly and out slowly. The drums come in first, the lead pulse when it is fierce.
function heatOf(W, me) {
  if (!me) return 0;
  let near = 0, total = 0;
  for (const e of W.enemies) {
    if (e.hp <= 0 || !HOSTILE_T.has(e.type)) continue;
    total++;
    const d = Math.abs(wd(e.x - me.x));
    if (d < 45) near += 1; else if (d < 90) near += 0.45;
  }
  let h = Math.min(1, near / 6) * 0.75 + Math.min(1, total / 16) * 0.3;
  const B = W.boss;
  if (B && B.st !== 'gone' && B.st !== 'warp') h = Math.max(h, Math.abs(wd(B.x - me.x)) < 110 ? 0.72 : 0.5, B.phase === 2 || B.rage ? 0.9 : 0);
  if (W.event && W.event.t < W.event.T) h = Math.max(h, 0.55);
  if (W.special && W.phase === 'fight') h = Math.max(h, 0.8);
  if (me.hyper > 0) h = 1;
  return Math.min(1, h);
}
function loops(W, menu, dt = 1 / 60) {
  if (!A.ctx) return;
  const live = G.state === 'play' || G.state === 'replay' || G.state === 'paused-online';
  const me = myPlayer(W) || W.players[0];
  const at = (x, y) => R.at(x, y);
  if (live && me) { const p = nearMe(at(me.x, me.y)), sp = Math.min(1, Math.abs(me.vx) / F.vmax); A.setLoop('thrust', p.x, p.y, p.z, me.alive ? 0.32 + (me.thrust || 0) * 0.55 + sp * 0.25 : 0, 0.78 + sp * 0.5 + (me.thrust || 0) * 0.08); A.setLoop('cabthrust', p.x, p.y, p.z, me.alive && (me.thrust || 0) > 0.05 ? 1 : 0, 1); }
  let lf = null, ld = 1e9;
  for (const e of W.enemies) if (e.type === 'lifter' && e.hp > 0 && (e.st === 'grab' || e.st === 'lift')) { const d = Math.abs(wd(e.x - R.cx)); if (d < ld) { ld = d; lf = e; } }
  if (live) { const p = lf ? at(lf.x, lf.y) : at(R.cx, 10); A.setLoop('lift', p.x, p.y, p.z, lf && ld < 90 ? 0.8 : 0, 1); }
  const B = W.boss;
  if (live) { const p = B ? at(B.x, B.y) : at(R.cx, 30); A.setLoop('boss', p.x, p.y, p.z, B && B.st !== 'warp' ? 0.9 : 0, B && B.atk && B.atk.kind === 'rush' ? 1.25 : 1); }
  {
    const live2 = G.state === 'play' || G.state === 'replay' || G.state === 'paused-online';
    const h = live2 && !menu ? heatOf(W, myPlayer(W) || W.players[0]) : 0;
    G.heat = (G.heat || 0) + (h - (G.heat || 0)) * (1 - Math.exp(-dt * (h > (G.heat || 0) ? 1.4 : 0.3)));
    const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    A.setLayers(ss(0.16, 0.42, G.heat), ss(0.6, 0.85, G.heat));
  }
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
  if (params.has('test')) { const m = await import('./tests.js?v=23'); m.runTests(window.__sh); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  else if (G.autopilot) { A.unlock(); if (params.has('endless')) startEndless(); else startCampaign(+params.get('sector') || 0); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__sh, {
  tick: (n = 1, dt = 1 / 60, draw = true) => { for (let i = 0; i < n; i++) tickFrame(dt, draw || i === n - 1); },
  startDemo, startCampaign, startEndless, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings, continueRun,
  noPost: NO_POST, LOOKS, nodePos, ENEMY, enemyDrawn: () => HANGAR.enemy || Promise.resolve(),
  // tests / screenshots: world s from wave cp with the demo autopilot flying
  startAt: (s, cp = 0, ai = true) => { G.run = { score: 0, lives: 9, up: { ...TYPICAL_UP[s] }, salvage: 0, start: s, newMedals: [], diff: 'normal', continues: 0, ai }; beginSector(s, cp); if (ai) G.ai = new Autopilot(7, 'demo'); },
});
Object.defineProperty(window.__sh, 'W', { get: () => G.W });
boot();
