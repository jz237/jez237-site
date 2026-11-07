// Lancewing 2026 - game flow: title (version, difficulty, global boards), campaign, endless, local and online
// co-op, upgrades, results with initials, instant replay, pause, options, attract demo and AI playthrough.
import { VERSION, SECTORS, STEP, F, WAVES, UPGRADES, UP_KEYS, UP_COST, SALVAGE_DIV, MEDALS, parTime, TYPICAL_UP, START_LIVES, BOSSES, DIFFICULTY, DIFF_KEYS, POWERUPS, ENEMY } from './config.js?v=10';
import { makeWorld, step, drainEvents, waveLabel, isBossWave, dX, applyClaim, cloneWorld } from './sim.js?v=10';
import { Autopilot } from './ai.js?v=10';
import { Renderer, pickQuality, CALM } from './render.js?v=10';
import { Audio } from './audio.js?v=10';
import { Input } from './input.js?v=10';
import { Scores, NO_POST, posted } from './scores.js?v=10';
import { Recorder, Replay } from './replay.js?v=10';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=10';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'lw.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* private mode */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('lw.medals.v1', []));
const best = load('lw.best.v1', {});      // best sector time per difficulty + sector (solo, from wave 1)
const bestSc = load('lw.bestsc.v1', {});  // best sector score (the points earned inside that sector)
let reach = load('lw.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const bootQuality = settings.quality;
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input();
const BOARDS = {};
function boardOf(mode, diff = 'normal') {
  const key = 'lancewing-2026' + (mode === 'endless' ? '-endless' : '') + (diff === 'normal' ? '' : '-' + diff);
  return BOARDS[key] || (BOARDS[key] = new Scores(key));
}
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, ai2: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, scenicAI: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), boardTab: 'campaign', scoreTab: 'campaign',
};
window.__lw = { G, R, A, I, NET, REC, settings, VERSION };

// ------------------------------------------------------------------ talking: rare on purpose
// KEY lines (run start, boss, boss down, sector clear, game over, new record) always get through, one voice
// at a time; colour lines wait VOICE_GAP seconds after the last line and roll a chance.
const VOICE_GAP = 26;
let lastLine = -99;
const nowS = () => performance.now() / 1000;
function say(name, o = {}) {
  if (settings.talk === 'off' || G.mode === 'demo' || G.mode === 'title') return;
  const t = nowS(), last = G.says.get(name) ?? -99;
  if (t - last < (o.cd ?? 0) || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__lw.lines ||= []).push([t, name]); }
}
function rumble(strong, weak, ms, pid = 0) { if (settings.rumble === 'off' || G.mode === 'demo' || G.mode === 'playthrough' || G.mode === 'title') return; I.rumble(strong, weak, ms, G.W && G.W.coop && I.pads().length > 1 ? pid - 1 : -1); }

// ------------------------------------------------------------------ screens
const SCREENS = ['title', 'sectors', 'upgrades', 'results', 'scores', 'medals', 'options', 'help', 'online', 'pause'];
function show(id, push = true) {
  if (G.screen && push) G.back.push(G.screen);
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id);
  G.screen = id;
  setSel(I.lastKind === 'key' || I.lastKind === 'pad' ? firstSel(id) : null);
}
// the button a keyboard / gamepad lands on: the visible primary one, else the first visible one (DOM order)
function firstSel(id) {
  const vis = (e) => !!e.offsetParent && !e.classList.contains('hidden') && !e.disabled;
  const all = [...$(id).querySelectorAll('.mbtn, .sec, .upg')].filter(vis);
  return all.find((e) => e.classList.contains('primary')) || all[0] || null;
}
function hideScreens() { for (const s of SCREENS) $(s).classList.add('hidden'); G.screen = null; G.back = []; }
function goBack() {
  if (G.screen === 'online') { NET.close(); }
  const b = G.back.pop();
  if (b) show(b, false); else if (G.state === 'paused') show('pause', false); else toTitle();
}
let selEl = null;
function setSel(el) { if (selEl) selEl.classList.remove('sel'); selEl = el; if (el) el.classList.add('sel'); }
function navigate(dir) {
  if (!G.screen) return;
  const items = [...$(G.screen).querySelectorAll('.mbtn:not(.hidden):not([disabled]), .sec:not([disabled]), .upg, .seg button')].filter((e) => e.offsetParent);
  if (!items.length) return;
  if (!selEl || !items.includes(selEl)) { setSel(items[0]); return; }
  const r0 = selEl.getBoundingClientRect(), cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
  let best = null, bs = 1e9;
  for (const e of items) {
    if (e === selEl) continue;
    const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, dx = x - cx, dy = y - cy;
    const ok = dir === 'ArrowUp' ? dy < -4 : dir === 'ArrowDown' ? dy > 4 : dir === 'ArrowLeft' ? dx < -4 : dx > 4;
    if (!ok) continue;
    const s = dir === 'ArrowUp' || dir === 'ArrowDown' ? Math.abs(dy) + Math.abs(dx) * 2 : Math.abs(dx) + Math.abs(dy) * 2;
    if (s < bs) { bs = s; best = e; }
  }
  if (best) { setSel(best); best.scrollIntoView({ block: 'nearest' }); A.play('uimove', { gap: 0.03, vol: 0.5 }); }
}

// ------------------------------------------------------------------ title + scenic background
function toTitle() {
  stopPlay();
  G.state = 'title'; G.mode = 'title'; G.idleT = 0;
  setHud(false);
  $('demo-badge').classList.add('hidden');
  $('ver').textContent = VERSION;
  $('title-best').textContent = 'BEST ' + boardOf('campaign', settings.diff).best().toLocaleString();
  $('med-sub').textContent = `${medals.size} / ${MEDALS.length}`;
  syncSegs();
  $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  show('title', false);
  G.back = [];
  scenic();
  A.playMusic('title');
  renderTitleBoard();
}
let scenicN = 0;
function scenic() {
  const W = makeWorld({ mode: 'endless', seed: 7 + (Math.random() * 1000 | 0), demo: true });
  W.lives = 99;
  G.scenic = W; G.W = W; G.scenicAI = new Autopilot(3, 'demo');
  R.setLook(scenicN++ === 0 ? 0 : Math.floor(Math.random() * 5));   // the first title shows the Sunset Ruins
  W.k = R.lookI;
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  clearTimeout(G.ptT);
  A.hush();
  G.ai = G.ai2 = null; G.replay = null; G.slowT = 0; G.timeScale = 1; A.setRate(1);
  R.fx.clear();
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
function startCampaign(sector = 0, o = {}) {
  G.mode = o.coop ? 'coop' : G.autopilot ? 'autoplay' : 'campaign';
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: 0, newMedals: [], tries: 0, diff: settings.diff, coop: !!o.coop, score0: 0, auto: G.autopilot };
  beginSector(sector, o.wave ?? (+params.get('wave') || 0));
}
function beginSector(s, wave = 0) {
  G.run.score0 = G.run.score; G.run.sector = s;
  const W = makeWorld({ mode: 'campaign', sector: s, wave, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, diff: G.run.diff, coop: G.run.coop, demo: G.mode === 'playthrough' });
  enterPlay(W);
  if (G.mode === 'autoplay' || G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  if (G.mode === 'playthrough' && W.coop) G.ai2 = new Autopilot(W.seed + 1, 'demo');
  banner(SECTORS[s].name, `SECTOR ${s + 1} · ${waveLabel(W)} · ${DL(W.diff)}`, 2.6);
  A.playMusic(SECTORS[s].music);
  say(s === 0 ? 'begin' : 's' + (s + 1), { key: true, delay: 0.8 });
}
const AI_SHOP = ['wing', 'armor', 'magnet', 'reach', 'wing', 'glide', 'armor', 'wing', 'reach', 'magnet'];
function startPlaythrough() {
  G.mode = 'playthrough';
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, newMedals: [], tries: 0, diff: 'normal', coop: false, score0: 0, auto: true };
  beginSector(+params.get('sector') || 0, +params.get('wave') || 0);
}
function aiShop() {
  const got = [];
  G.run.picks = {};
  for (const k of AI_SHOP) { const lv = G.run.up[k] || 0; if (lv >= UPGRADES[k].max || G.run.salvage < UP_COST[lv]) continue; G.run.salvage -= UP_COST[lv]; G.run.up[k] = lv + 1; G.run.picks[k] = (G.run.picks[k] || 0) + 1; got.push(UPGRADES[k].name); }
  return got;
}
function startEndless(o = {}) {
  G.mode = o.coop ? 'coop' : 'endless';
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: {}, salvage: 0, newMedals: [], diff: settings.diff, coop: !!o.coop, score0: 0, auto: G.autopilot };
  const W = makeWorld({ mode: 'endless', seed: newSeed(), diff: settings.diff, coop: !!o.coop });
  enterPlay(W);
  if (G.autopilot) G.ai = new Autopilot(W.seed, 'demo');
  banner('ENDLESS SKIES', `${DL(W.diff)} · HOW LONG CAN YOU HOLD THE RING?`, 2.6);
  A.playMusic('s1');
  say('begin', { key: true, delay: 0.8 });
}
// the attract demo: shows a sector, a boss fight, upgrades, then hands back to the title
const DEMO = [[0, 0], [1, 4], [2, 1], [3, 4], [4, 2], [0, 4], [2, 4], [4, 4]];
function startDemo(up) {
  const [s, w] = DEMO[G.demoI % DEMO.length];
  G.demoI++;
  G.mode = 'demo'; G.demoT = 0;
  G.run = { score: 0, lives: 9, up: up || { ...TYPICAL_UP[Math.min(4, s + 1)] }, salvage: 0, newMedals: [], diff: 'normal', coop: false, score0: 0, auto: true };
  const W = makeWorld({ mode: 'campaign', sector: s, wave: w, seed: newSeed(), up: G.run.up, lives: 9, demo: true });
  enterPlay(W);
  G.ai = new Autopilot(W.seed, 'demo');
  $('demo-badge').classList.remove('hidden');
  const ups = Object.entries(G.run.up).map(([k, v]) => UPGRADES[k].name + (v > 1 ? ' ' + v : '')).join(' · ');
  banner(w >= WAVES ? BOSSES[SECTORS[s].boss].name : SECTORS[s].name, `DEMO · ${ups || 'NO UPGRADES'}`, 3);
  A.playMusic(w >= WAVES ? 'boss' : SECTORS[s].music);
}
// the attract demo's shop: between a sector and the boss fight the autopilot spends its salvage (picks lit up)
function demoShop() {
  const [s] = DEMO[G.demoI % DEMO.length];
  stopPlay();
  G.mode = 'demo'; G.state = 'upgrade'; setHud(false);
  G.run.up = { ...TYPICAL_UP[s] }; G.run.salvage = 1500 + 450 * s;
  const bought = aiShop();
  $('up-title').textContent = 'DEMO · THE SHOP BETWEEN SECTORS';
  $('up-sub').textContent = `THE AUTOPILOT FITS ${bought.length ? bought.join(', ') : 'NOTHING (SAVING UP)'} BEFORE ${BOSSES[SECTORS[s].boss].name}`;
  $('next-sub').textContent = `Sector ${s + 1} · ${SECTORS[s].name} · starts in a moment`;
  renderUpgrades(G.run.picks);
  $('up-replay').classList.add('hidden');
  show('upgrades', false);
  $('demo-badge').classList.remove('hidden');
  A.play('upgrade', { gap: 0, vol: 0.6 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'demo' && G.state === 'upgrade') startDemo(G.run.up); }, 4800);
}
function enterPlay(W) {
  stopPlay();
  G.scenic = null; G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.hudCache = {}; G.lastWave = -1;
  REC.reset();
  hideScreens();
  $('popups').textContent = ''; POPS.length = 0;   // score popups belong to the scene they came from
  R.setLook(W.k);
  R.updateCamera(0, { focus: W.players, snap: true });
  setHud(true);
  buildStrip(W);
  $('demo-badge').classList.toggle('hidden', G.mode !== 'demo' && G.mode !== 'playthrough');
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? `<span>AI PLAYTHROUGH</span> · ${I.lastKind === 'touch' ? 'TAP ❚❚ TO STOP' : I.lastKind === 'pad' ? 'START TO STOP' : 'ESC TO STOP'}` : `<span>DEMO</span> · ${I.lastKind === 'touch' ? 'TAP' : 'PRESS ANY KEY'}`;
  A.unlock();
}

// ------------------------------------------------------------------ HUD
function setHud(on) {
  $('hud').classList.toggle('hidden', !on);
  const touch = on && settings.touch !== 'off' && (settings.touch === 'on' || I.isTouch) && G.mode !== 'demo' && G.mode !== 'playthrough';
  $('touch').classList.toggle('hidden', !touch);
  I.touchOn = touch;
  $('tb-pause').classList.toggle('hidden', !on || G.mode === 'demo');
  if (!on) { $('bossbar').classList.add('hidden'); $('tut').classList.add('hidden'); $('banner').classList.add('hidden'); $('caption').classList.add('hidden'); $('warns').innerHTML = ''; WM.length = 0; }
}
function buildStrip(W) {
  if (W.mode !== 'campaign') { $('wavestrip').innerHTML = ''; return; }
  $('wavestrip').innerHTML = Array.from({ length: WAVES }, (_, i) => `<b>${i + 1}</b>`).join('') + '<b class="boss">☠</b>';
}
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
const myPlayer = (W) => (G.mode === 'online' && !NET.host ? W.players[1] : W.players[0]);
function updateHud(W) {
  setText('score', W.score.toLocaleString());
  setHTML('lives', '<i></i>'.repeat(Math.min(8, W.lives)) + (W.lives > 8 ? `<span>+${W.lives - 8}</span>` : ''));
  const me = myPlayer(W);
  setHTML('armor', '<i class="on"></i>'.repeat(Math.max(0, me.armor)) + (me.pw.shield ? '<i class="aegis"></i>' : ''));
  setHTML('pw', Object.entries(me.pw).map(([k, t]) => `<span style="--c:#${POWERUPS[k].color.toString(16).padStart(6, '0')}"><b>${POWERUPS[k].glyph}</b>${POWERUPS[k].name}<i style="width:${Math.max(0, Math.min(100, (t / POWERUPS[k].time) * 100))}%"></i></span>`).join('') + (W.slow > 0 ? `<span style="--c:#d7a6ff"><b>⧗</b>STILL AIR<i style="width:${(W.slow / POWERUPS.slow.time) * 100}%"></i></span>` : ''));
  const sname = W.mode === 'campaign' ? `SECTOR ${W.sector + 1} · ${SECTORS[W.sector].name}` : `ENDLESS SKIES · ${SECTORS[W.k].name}`;
  setText('sector-name', sname);
  if (W.mode === 'campaign') {
    const kids = $('wavestrip').children;
    for (let i = 0; i <= WAVES; i++) { const c = i < W.wave ? 'done' : i === W.wave ? 'now' : ''; const cls = (i === WAVES ? 'boss ' : '') + c; if (kids[i] && kids[i].className !== cls) kids[i].className = cls; }
  }
  const kindTxt = { corerush: 'CORE RUSH', survival: 'HOLD THE SKY', crumble: 'CRUMBLING LEDGES', team: 'TEAM WAVE' }[W.kind];
  const timeTxt = W.kind === 'survival' || W.kind === 'corerush' ? `${Math.max(0, W.specT - W.waveT).toFixed(1)} s LEFT` : W.mode === 'campaign' ? fmtT(W.secT) : fmtT(W.fightT);
  setText('timer', `${waveLabel(W)}${kindTxt ? ' · ' + kindTxt : ''} · ${timeTxt}`);
  setText('chain', W.chain > 1 ? `CORE CHAIN ×${W.chain}` : W.kind === 'corerush' ? `CORES ${W.rushGot} / ${W.rushN}` : '');
  const hs = boardOf(W.mode, W.diff).best();
  setText('hiscore', Math.max(hs, W.score).toLocaleString());
  const B = W.boss;
  $('bossbar').classList.toggle('hidden', !B);
  if (B) { setText('boss-name', BOSSES[B.key].name + (B.phases > 2 ? ` · PHASE ${B.phase}` : '')); const w = Math.max(0, (B.hp / B.max) * 100).toFixed(1) + '%'; if (G.hudCache.bw !== w) { G.hudCache.bw = w; $('bossbar').querySelector('i').style.width = w; } }
}
function banner(a, b, t = 2.2) {
  const el = $('banner');
  el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b || '';
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  G.bannerT = t;
}
function caption(text, t = 4) { const el = $('caption'); el.textContent = text; el.classList.remove('hidden', 'dc'); G.capT = t; }
const PP = { x: 0, y: 0, z: 0 };
const POPS = [];   // recent popups: a new one that would land on top of another stacks above it
function popup(text, x, y, color, big) {
  R.project(x, y, PP);
  if (PP.z > 1 || PP.x < -50 || PP.x > innerWidth + 50) return;
  const now = performance.now(), floor = R.portrait ? 132 : 104;
  let top = Math.max(PP.y, floor);
  for (let i = POPS.length - 1; i >= 0; i--) if (now - POPS[i].t > 650) POPS.splice(i, 1);
  for (let k = 0; k < 5; k++) { const q = POPS.find((o) => Math.abs(o.x - PP.x) < 80 && Math.abs(o.y - top) < 24); if (!q) break; top = q.y + (q.y - 26 < floor ? 26 : -26); }
  POPS.push({ t: now, x: PP.x, y: top });
  const el = document.createElement('div');
  el.className = 'pop' + (big ? ' big' : '');
  el.textContent = text; el.style.left = Math.max(44, Math.min(innerWidth - 44, PP.x)) + 'px'; el.style.top = top + 'px';   // kept on screen (portrait phones clipped them at the edge)
  if (color) el.style.color = color;
  $('popups').appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
function keyName(what) {
  const touch = I.lastKind === 'touch', pad = I.lastKind === 'pad';
  if (what === 'flap') return touch ? 'Tap <b>FLAP</b>' : pad ? 'Press <kbd>A</kbd>' : 'Press <kbd>W</kbd>, <kbd>↑</kbd> or <kbd>SPACE</kbd>';
  if (what === 'steer') return touch ? 'drag on the left' : pad ? 'the <b>left stick</b>' : '<kbd>A</kbd> <kbd>D</kbd> or <kbd>←</kbd> <kbd>→</kbd>';
  return '';
}
// local co-op: who uses what (input.js: two pads = one each; one pad = rider 2; else the keyboard is split)
function coopKeys() {
  const n = I.pads().length;
  if (n >= 2) return 'BOTH RIDERS: <b>left stick</b> steers, <kbd>A</kbd> beats your wings';
  if (n === 1) return 'RIDER 1: <kbd>A</kbd> <kbd>D</kbd> steer, <kbd>W</kbd> flaps · RIDER 2: the gamepad (<b>left stick</b> + <kbd>A</kbd>)';
  return 'RIDER 1: <kbd>A</kbd> <kbd>D</kbd> steer, <kbd>W</kbd> flaps · RIDER 2: <kbd>←</kbd> <kbd>→</kbd> steer, <kbd>↑</kbd> flaps';
}
const TUT = {
  controls: () => G.W && G.W.coop && G.mode !== 'online' ? `${coopKeys()} · tap fast to climb, hold for a steady beat · <b>the higher lance wins</b>: come down on riders from above`
    : `${keyName('flap')} to beat your wings (tap fast to climb, hold for a steady beat) · steer with ${keyName('steer')} · <b>the higher lance wins</b>: come down on riders from above`,
  cores: () => 'An unhorsed rider drops an <b>EMBER CORE</b>. Grab it for chained points before it re-ignites into a stronger rider.',
  spout: () => 'A glowing ring on the sea means a <b>SPOUT</b> is about to erupt. Keep clear of it.',
  bolt: () => 'A red band from the sky marks the spire\'s <b>LIGHTNING</b>. Get out from under it.',
  hunter: () => 'A <b>STORMHUNTER</b> is coming! Only a head-on lance into its eye brings it down: meet it level, facing it.',
  rush: () => '<b>CORE RUSH</b>: cores are raining down. Collect as many as you can!',
  survival: () => '<b>HOLD THE SKY</b>: stay alive until the timer runs out.',
  crumble: () => 'Cracked ledges are about to <b>fall</b>. Don\'t be standing on them.',
  team: () => '<b>TEAM WAVE</b>: twin riders. A big bonus if neither of you falls.',
  lancer: () => '<b>LANCERS</b> hunt you and climb for the higher lance.',
  reaver: () => '<b>REAVERS</b> climb high and dive. Some pull out of the dive to bait you.',
  shieldbearer: () => '<b>SHIELDBEARERS</b> block from the front: come down on them from well above, or from behind.',
  twinblade: () => '<b>TWINBLADES</b> come in pairs: one high, one low.',
  stormcaller: () => '<b>STORMCALLERS</b> cast lightning along a marked line. Move off it, then strike.',
};
// each tip once per visit (the sim raises them again in every sector and after a continue); co-op has its own controls tip
const tipsSeen = new Set();
function tutorial(key, t = 7) {
  if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return;
  const id = key === 'controls' && G.W && G.W.coop ? 'controls-coop' : key;
  if (tipsSeen.has(id)) return;
  tipsSeen.add(id);
  const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden', 'up'); G.tutT = t; G.tutFlip = 0;
  placeTut(G.W, true);
}
// the tip never sits over your own rider: it moves to the top (below the HUD) when the rider is behind it, and back
function placeTut(W, now = false) {
  const el = $('tut');
  if (!W || el.classList.contains('hidden')) return;
  const me = myPlayer(W);
  if (!me) return;
  R.project(me.x, me.y + 0.8, PE);
  if (PE.z > 1) return;
  const r = el.getBoundingClientRect();
  const over = PE.x > r.left - 60 && PE.x < r.right + 60 && PE.y > r.top - 90 && PE.y < r.bottom + 60;
  const t = performance.now();
  if (over && (now || t - G.tutFlip > 700)) { el.classList.toggle('up'); G.tutFlip = t; }
}

// ------------------------------------------------------------------ events from the simulation
const BOOM = { skirmisher: 'boomS', lancer: 'boomS', reaver: 'boomM', shieldbearer: 'boomM', twinblade: 'boomS', stormcaller: 'boomM' };
function handleEvents(list, W, live) {
  for (const e of list) {
    R.onEvent(e, W);
    const pos = e.x !== undefined ? toPos(e.x, e.y || 0) : null;
    if (e.k === 'death' && live) deathCaption(W, e);
    switch (e.k) {
      case 'flap': if (e.pid) A.play('flap', { ...pos, vol: 0.42, gap: 0.06, vary: 0.18 }); break;
      case 'land': if (e.pl && e.v > 3) A.play('land', { ...pos, vol: Math.min(0.6, 0.15 + e.v * 0.04), gap: 0.12 }); break;
      case 'bonk': if (e.pl) A.play('land', { ...pos, vol: 0.35, rate: 1.25, gap: 0.2 }); break;
      case 'clang': A.play(e.block ? 'block' : 'clang', { ...pos, vol: e.soft ? 0.4 : 0.85, gap: 0.05 }); if (!e.soft && e.pid) rumble(0.5, 0.3, 120, e.pid); break;
      case 'unhorse': A.play('unhorse', { ...pos, vol: 0.9 }); A.play(BOOM[e.type] || 'boomS', { ...pos, vol: 0.7, delay: 0.05 }); A.play('core', { ...pos, vol: 0.45, delay: 0.25, gap: 0.1 }); if (e.pts) popup('+' + e.pts, e.x, e.y + 2.5, null, e.elite); if (e.pid) rumble(0.6, 0.5, 160, e.pid); break;
      case 'death': A.play('death', { ...pos, vol: 1 }); if (live) { rumble(1, 1, 400, e.pid); queueClip(W, 'death'); if (W.lives === 1) say('lastlife', { key: true, delay: 1 }); } break;
      case 'armor': A.play('shieldhit', { ...pos, vol: 0.9 }); rumble(0.7, 0.4, 200, e.pid); break;
      case 'collect': A.play(e.chain >= 4 ? 'chain' : 'collect', { ...pos, vol: 0.8, rate: 1 + Math.min(6, e.chain) * 0.05, gap: 0.06 }); popup((e.air ? 'AIR CATCH +' : '+') + e.pts, e.x, e.y + 1.5, '#ffb347', e.chain >= 4); break;
      case 'corebounce': A.play('land', { ...pos, vol: 0.18, rate: 1.7, gap: 0.12 }); break;
      case 'coresink': A.play('splash', { ...pos, vol: 0.3, rate: 1.5, gap: 0.2 }); break;
      case 'hatch': A.play('hatch', { ...pos, vol: 0.7 }); break;
      case 'reform': A.play('form', { ...pos, vol: 0.6 }); break;
      case 'form': A.play('form', { ...pos, vol: 0.4, gap: 0.25 }); break;
      case 'summon': A.play('form', { ...pos, vol: 0.6, rate: 0.8 }); break;
      case 'portal': break;
      case 'splash': A.play('splash', { ...pos, vol: e.big ? 1 : 0.55, rate: e.big ? 1 : 1.2, gap: 0.1 }); break;
      case 'drown': A.play('splash', { ...pos, vol: 0.45, rate: 1.15, gap: 0.15 }); break;
      case 'flee': A.play('gust', { ...pos, vol: 0.25, rate: 1.5, gap: 0.3 }); break;
      case 'spoutwarn': A.play('spoutwarn', { ...pos, vol: 0.55, gap: 0.3 }); break;
      case 'spout': A.play('spout', { ...pos, vol: 0.9, gap: 0.1 }); break;
      case 'boltwarn': A.play('boltwarn', { ...pos, vol: 0.6, gap: 0.3 }); break;
      case 'bolt': A.play('thunder', { ...pos, vol: 1 }); break;
      case 'arcwarn': A.play('boltwarn', { ...pos, vol: 0.35, gap: 0.3, rate: 1.5 }); break;
      case 'arc': A.play('arcon', { ...pos, vol: 0.75, gap: 0.08 }); break;
      case 'crack': A.play('crack', { ...pos, vol: 0.7, gap: 0.15 }); break;
      case 'crumble': A.play('crumble', { ...pos, vol: 0.85 }); break;
      case 'rebuild': break;
      case 'drop': A.play('drop', { ...pos, vol: 0.6 }); break;
      case 'pickup': A.play('pickup', { ...pos, vol: 0.9 }); caption(`${POWERUPS[e.kind].name} · ${POWERUPS[e.kind].desc}`, 2.8); if (e.kind === 'slow') A.play('slowmo', { vol: 0.7 }); break;
      case 'pwend': A.play('pwend', { vol: 0.5 }); break;
      case 'life': A.play('life', { vol: 0.9 }); banner('EXTRA LIFE', '', 1.4); break;
      case 'hunterwarn': A.play('alarm', { vol: 0.8 }); caption('STORMHUNTER INBOUND · MEET IT HEAD-ON', 3); break;
      case 'hunter': A.play('hunter', { ...pos, vol: 0.9 }); break;
      case 'hunterdown': A.play('boomL', { ...pos, vol: 1 }); A.play('shatter', { ...pos, vol: 0.6, delay: 0.1 }); popup('STORMHUNTER +' + e.pts, e.x, e.y + 2, '#ff6a40', true); if (live) slowmo(0.35, 0.9, [[e.x, e.y]]); say('hunter', { chance: 0.6 }); break;
      case 'tut': if (live) tutorial(e.key, e.key === 'controls' ? 10 : 7); break;
      case 'intro': if (live) tutorial(e.type, 6); break;
      case 'wave': if (live && !e.first) { const kt = { corerush: 'CORE RUSH', survival: 'HOLD THE SKY', crumble: 'CRUMBLING LEDGES', team: 'TEAM WAVE', boss: 'BOSS' }[e.kind]; if (e.kind !== 'boss') banner(waveLabel(W), kt || SECTORS[W.k].name, 1.8); A.play('wave', { vol: 0.75 }); } if (W.mode !== 'campaign' && live && e.kind !== 'boss') A.playMusic(SECTORS[W.k].music); break;
      case 'waveclear': A.play('waveclear', { vol: 0.8 }); banner(e.why === 'rush' ? `${e.got} / ${e.of} CORES` : e.why === 'survive' ? 'HELD THE SKY' : 'WAVE CLEAR', `+${e.pts.toLocaleString()}${e.clean ? ' · FLAWLESS' : ''}`, 2); if (live && W.mode === 'campaign' && W.wave === WAVES - 1) say('halfway', { chance: 0.4 }); break;
      case 'boss': A.play('bossroar', { vol: 1 }); banner(BOSSES[e.key].name, 'STRIKE ITS WEAK POINTS FROM ABOVE', 3); A.playMusic('boss'); say('boss', { key: true, delay: 1.2 }); if (live) R.frameShot([[e.x, 12]], 1.6); break;
      case 'bossatk': if (e.kind === 'gust' || e.kind === 'breach' || e.kind === 'slam' || e.kind === 'beam') A.play('boltwarn', { vol: 0.45, gap: 0.5, rate: 0.75 }); else if (e.kind === 'blast') A.play('blast', { vol: 0.4, gap: 0.5, rate: 0.7 }); break;   // the Colossus winds up its furnace
      case 'bosshit': A.play('bosshit', { ...pos, vol: 1 }); popup('+' + e.pts, e.x, e.y + 1.5); rumble(0.8, 0.6, 180, e.pid); break;
      case 'wpdown': A.play('shatter', { ...pos, vol: 0.9 }); A.play('boomM', { ...pos, vol: 1, delay: 0.06 }); if (live) slowmo(0.4, 0.7, [[e.x, e.y]]); break;
      case 'bossphase': A.play('bossroar', { vol: 1, rate: 0.9 }); banner(`PHASE ${e.phase}`, BOSSES[e.key].name, 1.6); break;
      case 'bossdown': A.play('bossroar', { vol: 0.9, rate: 0.7 }); A.play('boomL', { vol: 1, delay: 0.2 }); A.play('boomL', { vol: 1, delay: 0.75, rate: 0.85 }); if (live) { slowmo(0.3, 1.4, [[e.x, e.y]]); queueClip(W, 'boss'); say('bossdown', { key: true, delay: 1.4 }); rumble(1, 1, 700); } break;
      case 'shards': A.play('gust', { ...pos, vol: 0.5, rate: 1.8 }); A.play('shatter', { ...pos, vol: 0.3, rate: 1.4, delay: 0.05 }); break;
      case 'orbs': A.play('beam', { ...pos, vol: 0.4, rate: 1.5 }); break;
      case 'orbpop': A.play('shatter', { ...pos, vol: 0.35, rate: 1.3, gap: 0.1 }); break;
      case 'shatter': A.play('shatter', { ...pos, vol: 0.25, rate: e.kind === 'blob' ? 0.7 : 1.4, gap: 0.12 }); break;
      case 'beam': if (W.boss && W.boss.key === 'colossus') A.play('blast', { ...pos, vol: 1 }); else A.play('beam', { ...pos, vol: 0.85 }); break;
      case 'slam': A.play('slam', { ...pos, vol: 1 }); rumble(0.8, 0.8, 300); break;
      case 'gust': A.play('gust', { ...pos, vol: 0.9 }); break;
      case 'dropfall': A.play(W.boss && W.boss.key === 'leviathan' ? 'shatter' : 'molten', { ...pos, vol: 0.45, gap: 0.12, rate: W.boss && W.boss.key === 'leviathan' ? 1.3 : 1 }); break;
      case 'breach': A.play('breach', { ...pos, vol: 1 }); A.play('bossroar', { ...pos, vol: 0.6, delay: 0.35, rate: 0.8 }); break;
      case 'spawn': A.play('spawn', { ...pos, vol: 0.8 }); break;
      case 'skid': A.play('skid', { ...pos, vol: 0.35, gap: 0.2 }); break;
      case 'over': break;
      default: break;
    }
    feelEvent(e, W, live);
  }
}
const toPos = (x, y) => { const th = x / F.R; return { x: Math.sin(th) * F.R, y, z: Math.cos(th) * F.R }; };
function slowmo(scale, t, pts) { if (G.mode === 'title') return; G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); if (pts && (G.mode === 'demo' || G.mode === 'playthrough')) R.frameShot(pts, t + 0.4); }
// hit-stop: the presentation loop holds the sim for a few frames (no steps are taken, so the tick sequence and the recorded
// inputs are exactly what they would be without it). Never online (the host keeps its cadence) or on the title.
function hitStop(t) { if (G.mode === 'online' || G.mode === 'title' || G.state !== 'play') return; G.stopT = Math.max(G.stopT || 0, t); }
// game feel on top of handleEvents' cases (kept out of their lines): hit-stop on your own unhorse, a boss hit and a weak point
// breaking, and the boss reveal shot that follows the boss itself (it replaces the fixed 12 m frame the 'boss' case set)
function feelEvent(e, W, live) {
  if (!live) return;
  if (e.k === 'unhorse') { if (e.pid) hitStop(0.055); }
  else if (e.k === 'bosshit') hitStop(0.06);
  else if (e.k === 'wpdown') hitStop(0.07);
  else if (e.k === 'boss') bossReveal(W, e);
}
// the sim reads a flap as a press EDGE, so a tap pressed and released inside a hit-stop would never reach a step: latch it
// while the sim is held and hand it to the first step after (it is recorded like any input, replays stay exact)
const stopFlap = new Set();
function holdSim(dt) {
  if (stopFlap.size && stopFlap.W !== G.W) stopFlap.clear();   // never carried into another run
  if (!(G.stopT > 0)) return;
  if (G.state === 'play') {
    G.W.players.forEach((p, i) => { if (!((i === 0 && G.ai) || (i === 1 && G.ai2)) && I.control(p.id, G.W.coop).flap) { stopFlap.add(p.id); stopFlap.W = G.W; } });
    G.acc -= dt * G.timeScale;
  }
  G.stopT -= dt;
}
{ const ctl = I.control.bind(I); I.control = (pid = 1, coop = false) => { const o = ctl(pid, coop); if (stopFlap.size && !(G.stopT > 0) && stopFlap.W === G.W && stopFlap.delete(pid)) o.flap = true; return o; }; }
// boss reveal: the shot follows the boss itself (its live x / height) while it rises into view, not a fixed 12 m
function bossReveal(W, e) {
  const B = W.boss;
  if (!B) { R.frameShot([[e.x, 12]], 1.6); return; }
  const lift = { leviathan: 2.5, colossus: 6 }[B.key] || 1;
  const pt = { get 0() { return (W.boss || B).x; }, get 1() { return Math.min(21, Math.max(5, (W.boss || B).y + lift)); } };
  R.frameShot([pt], 2);
}
function queueClip(W, kind) { if (G.mode === 'online') return; G.pendingClip = { n: W.n, kind, at: W.n + Math.round(1.6 / STEP) }; }
function captureClip(W) { const q = G.pendingClip; if (q && W.n >= q.at) { const c = REC.clip(q.n); if (c) { c.kind = q.kind; G.clip = c; } G.pendingClip = null; } }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else demoShop(); return; }
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'UNHORSED', 'ONLINE CO-OP'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (W.mode === 'endless') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'THE RING FALLS', `${waveLabel(W)} · HELD ${fmtT(W.fightT)}`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT, k = bestKey(W.diff, s), sc = W.score - G.run.score0;
    const real = (G.mode === 'campaign' || G.mode === 'coop') && !G.run.auto;   // never for an autopilot-flown run
    G.run.newBest = [];
    // sector bests: solo runs flown from the sector's first wave
    if (real && !W.coop && !W.wave0) {
      if (!best[k] || t < best[k]) { best[k] = t; store('lw.best.v1', best); G.run.newBest.push('TIME'); }
      if (!bestSc[k] || sc > bestSc[k]) { bestSc[k] = sc; store('lw.bestsc.v1', bestSc); G.run.newBest.push('SCORE'); }
    }
    if (real) { reach = Math.max(reach, Math.min(4, s + 1)); store('lw.reach.v1', reach); }
    const got = [];
    // medals count on Normal and harder, for a sector flown from its first wave
    const award = (id) => { if (real && W.diff !== 'easy' && !W.wave0 && !medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0) award(`s${s}clean`);
    if (W.secHatched === 0) award(`s${s}core`);
    if (t <= parTime(s)) award(`s${s}par`);
    store('lw.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.salvage += Math.floor((W.score - G.run.score0) / SALVAGE_DIV);
    G.run.score = W.score; G.run.lives = W.lives + 1;
    G.run.lastTime = t; G.run.got = got;
    if (s >= SECTORS.length - 1) { A.sting('clear'); say('champion', { key: true, delay: 2.5 }); results(W, 'MASTER OF THE RING', 'ALL FIVE SECTORS CLEARED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  results(W, 'UNHORSED', `SECTOR ${s + 1} · ${SECTORS[s].name} · ${waveLabel(W)}`);
}
function playthroughNext(W) {
  const s = W.sector;
  if (W.result !== 'clear') {
    G.run.tries++;
    G.run.score = G.run.score0; G.run.lives = START_LIVES + 2;
    banner('RETRY', `THE AUTOPILOT TAKES ${SECTORS[s].name} AGAIN`, 2.5);
    G.ptT = setTimeout(() => { if (G.mode === 'playthrough') beginSector(s); }, 1800);
    return;
  }
  G.run.salvage += Math.floor((W.score - G.run.score0) / SALVAGE_DIV);
  G.run.score = W.score; G.run.lives = W.lives + 1; G.run.lastTime = W.secT;
  if (s >= SECTORS.length - 1) { G.run.got = []; results(W, 'AI PLAYTHROUGH COMPLETE', `ALL FIVE SECTORS · ${G.run.tries ? G.run.tries + (G.run.tries > 1 ? ' RETRIES' : ' RETRY') : 'NO RETRIES'}`); return; }
  const bought = aiShop();
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${s + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(W.secT)} · AUTOPILOT BOUGHT: ${bought.length ? bought.join(', ') : 'NOTHING YET (SAVING UP)'}`;
  $('next-sub').textContent = `Sector ${s + 2} · ${SECTORS[s + 1].name} · starts in a moment`;
  renderUpgrades(G.run.picks);
  $('up-replay').classList.toggle('hidden', !G.clip);
  show('upgrades', false);
  A.play('upgrade', { gap: 0, vol: 0.7 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'playthrough' && G.state === 'upgrade') beginSector(s + 1); }, 6000);
}
function upgrades(W) {
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${W.sector + 1} CLEAR`;
  const nb = G.run.newBest && G.run.newBest.length ? ` · NEW BEST ${G.run.newBest.join(' + ')}` : '';
  $('up-sub').textContent = `${fmtT(G.run.lastTime)}${nb} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR SKYRAY'}`;
  $('next-sub').textContent = `Sector ${W.sector + 2} · ${SECTORS[W.sector + 1].name}`;
  G.run.picks = null;
  renderUpgrades();
  $('up-replay').classList.toggle('hidden', !G.clip);
  show('upgrades', false);
  A.sting('clear');
  clearTimeout(G.musT); G.musT = setTimeout(() => { if (G.state === 'upgrade') A.playMusic('title'); }, 9500);
  say('clear', { key: true, delay: 1.5 });
}
function renderUpgrades(picks) {
  $('salv').textContent = G.run.salvage.toLocaleString();
  $('upgrid').innerHTML = UP_KEYS.map((k) => {
    const U = UPGRADES[k], lv = G.run.up[k] || 0, max = lv >= U.max, cost = UP_COST[lv];
    const poor = !max && G.run.salvage < cost, pick = picks && picks[k];
    return `<button class="upg ${max ? 'max' : ''} ${poor && !pick ? 'poor' : ''} ${pick ? 'pick' : ''}" data-up="${k}" style="--uc:${U.color}"><i>${U.icon}</i><b>${U.name}</b><span class="lvl">${Array.from({ length: U.max }, (_, i) => `<em class="${i < lv ? 'on' : ''}"></em>`).join('')}</span><small>${U.desc}</small><span class="cost">${pick ? 'AUTOPILOT PICK' + (pick > 1 ? ' ×' + pick : '') : max ? 'FITTED' : cost + ' SALVAGE' + (poor ? ` · NEED ${(cost - G.run.salvage).toLocaleString()} MORE` : '')}</span></button>`;
  }).join('');
}
function buy(k) {
  if (G.mode === 'playthrough' || G.mode === 'demo') return;
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
function results(W, title, sub) {
  G.state = 'results'; setHud(false);
  G.lastW = W;
  $('res-title').textContent = title; $('res-sub').textContent = sub + ' · ' + DL(W.diff);
  const st = [['SCORE', W.score.toLocaleString()]];
  if (W.mode === 'endless') st.push(['WAVES HELD', W.waveN], ['TIME', fmtT(W.fightT)]);
  else st.push(['SECTOR TIME', fmtT(W.secT)]);
  st.push(['RIDERS UNHORSED', W.stats.kills], ['EMBER CORES', `${W.stats.cores}${W.stats.bestChain > 1 ? ` (best chain ×${W.stats.bestChain})` : ''}`], ['STORMHUNTERS', W.stats.hunters], ['LIVES LOST', W.stats.deaths]);
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('') + causeRow(W);
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · S${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The boss going down' : 'The last hit, exactly as it happened';
  // continue from the checkpoint (the wave you fell on): a fresh credit, score back to zero
  const canCont = W.mode === 'campaign' && W.result === 'over' && G.mode !== 'online' && G.mode !== 'playthrough';
  $('res-cont').classList.toggle('hidden', !canCont);
  if (canCont) $('cont-sub').textContent = `Sector ${W.sector + 1} · ${waveLabel(W)} · full lives, score from zero`;
  // a campaign game over: carrying on is the main choice; ending the run is the quiet one beside the replay
  $('res-done').classList.toggle('primary', !canCont);
  $('done-lbl').textContent = canCont ? 'END RUN' : 'TITLE';
  $('done-sub').textContent = canCont ? 'Save the score, back to the title' : 'Back to the title';
  $('res-btns').classList.toggle('two', !!G.clip);
  const board = boardOf(W.mode, W.diff);
  G.board = board; G.ini = null; G.resT = performance.now();
  $('ini-wrap').classList.add('hidden'); $('ini-saved').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && G.mode !== 'demo' && !(G.run && G.run.auto) && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    const extra = (W.mode === 'endless' ? `WAVE ${W.waveN + 1}` : W.result === 'clear' && W.sector >= SECTORS.length - 1 ? 'ALL CLEAR' : `S${W.sector + 1} ${waveLabel(W)}`) + (W.coop ? ' CO-OP' : '');
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, level: W.mode === 'endless' ? W.waveN + 1 : W.sector + 1, extra, edited: false };
    $('ini-hint').innerHTML = I.lastKind === 'pad' ? '▲ ▼ letter · ◀ ▶ move · <b>A</b> saves' : I.lastKind === 'touch' ? 'Tap ▲ ▼ · any button below saves' : 'Type letters, or ↑ ↓ ← → · <b>ENTER</b> saves';
    $('ini-wrap').classList.remove('hidden');
    renderIni();
  }
  show('results', false);
}
function renderIni() { const b = $('ini').children; for (let i = 0; i < 3; i++) { b[i].textContent = G.ini.chars[i]; b[i].className = i === G.ini.i ? 'cur' : ''; } }
async function submitIni() {
  if (!G.ini) return;
  const q = G.ini, board = G.board;
  G.ini = null; $('ini-wrap').classList.add('hidden');
  const el = $('ini-saved'); el.textContent = `SCORE SAVED · ${q.chars.join('')}`; el.classList.remove('hidden');
  const e = await board.submit(q.chars.join(''), q.score, q.level, { extra: q.extra, local: G.run && G.run.auto });
  G.lastEntry = e && e.ts;
}
// confirm on the results screen (gamepad A / START, ENTER, SPACE): while the initials are open it edits / saves them
// (a player who changed a letter steps to the next one first, arcade style), then the primary button takes over.
// Input in the first moments is ignored: the flap button may still be held or mashed when the run ends.
const resGuard = (ms = 900) => G.screen === 'results' && performance.now() - (G.resT || 0) < ms;
function resultsConfirm() {
  if (G.screen !== 'results' || resGuard()) return true;
  if (!G.ini) return false;
  if (G.ini.edited && G.ini.i < 2) { G.ini.i++; renderIni(); A.play('uimove', { gap: 0 }); return true; }
  A.play('uiok', { gap: 0 });
  submitIni();
  setSel(firstSel('results'));
  return true;
}
async function finishResults() { await submitIni(); toTitle(); }
async function continueRun() {
  await submitIni();
  const W = G.lastW;
  G.run.score = 0; G.run.lives = START_LIVES + DIFFICULTY[W.diff].lives; G.run.score0 = 0;
  const mode = G.mode;
  beginSector(W.sector, Math.min(W.wave, WAVES));
  G.mode = mode;
}

// ------------------------------------------------------------------ instant replay
function playReplay() {
  if (!G.clip) return;
  const c = G.clip;
  G.afterReplay = G.screen; G.prevState = G.state;
  hideScreens(); setHud(false);
  G.replay = new Replay(cloneWorld(c.snap), c.inputs, c.keyN, c.endN);
  G.state = 'replay';
  $('letterbox').classList.remove('hidden');
  A.play('rewind', { vol: 0.8, gap: 0 });
}
function endReplay() {
  $('letterbox').classList.add('hidden');
  G.replay = null; R.shot = null;
  G.state = G.prevState || 'results';
  A.setRate(1);
  if (G.afterReplay) show(G.afterReplay, false); else toTitle();
}

// ------------------------------------------------------------------ pause
function pause() {
  if (G.state !== 'play') return;
  if (G.mode === 'demo' || G.mode === 'playthrough') { clearTimeout(G.ptT); toTitle(); return; }   // the badge says ESC / START / ❚❚ TO STOP
  G.state = G.mode === 'online' ? 'paused-online' : 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.mode === 'online' ? 'THE ARENA KEEPS GOING ONLINE' : `${G.W.mode === 'campaign' ? 'SECTOR ' + (G.W.sector + 1) + ' · ' : ''}${waveLabel(G.W)}`;
  $('pause-replay').classList.toggle('hidden', !G.clip);
  show('pause', false);
}
function resume() { if (G.state === 'paused' || G.state === 'paused-online') { G.state = 'play'; A.muffle(false); hideScreens(); } }

// ------------------------------------------------------------------ online co-op
function netStatus(text, kind) {
  const el = $('net-status');
  el.className = kind === 'error' ? 'error' : '';
  el.textContent = text === 'waiting' ? 'Waiting for a wingmate to join…' : text;
}
function netJoined(peer) {
  netStatus(`${peer.ini || 'A wingmate'} joined!${NET.host ? ' Press START when ready.' : ' Waiting for the host to start…'}`, 'info');
  $('net-go').classList.toggle('hidden', !NET.host);
  A.play('uiok', { gap: 0 });
}
function netLeft(why) {
  if (G.mode === 'online' && G.state !== 'results') { banner(why === 'lost' ? 'CONNECTION LOST' : 'YOUR WINGMATE LEFT', 'BACK TO THE TITLE', 2.5); setTimeout(() => { if (G.mode === 'online') toTitle(); }, 2600); }
  else if (G.screen === 'online') { netStatus(why === 'lost' ? 'Connection lost' : 'Your wingmate left', 'error'); $('net-go').classList.add('hidden'); }
}
function hostStart() {
  if (!NET.host || !NET.peer) return;
  const cfg = { route: settings.netRoute, seed: newSeed(), diff: settings.diff, wave: Math.max(0, Math.min(WAVES, +params.get('wave') || 0)) };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  const endless = cfg.route === 'es';
  G.run = { score: 0, lives: START_LIVES + 1, up: {}, salvage: 0, newMedals: [], diff: DIFFICULTY[cfg.diff] ? cfg.diff : 'normal', coop: true, score0: 0 };
  const s = endless ? 0 : Math.max(0, Math.min(SECTORS.length - 1, +cfg.route || 0));
  const W = makeWorld({ mode: endless ? 'endless' : 'campaign', sector: s, wave: endless ? 0 : Math.max(0, Math.min(WAVES, +cfg.wave || 0)), seed: +cfg.seed || 1, coop: true, up: endless ? {} : { ...TYPICAL_UP[s] }, lives: START_LIVES + 1, diff: DIFFICULTY[cfg.diff] ? cfg.diff : 'normal' });
  NET.bind(W);
  enterPlay(W);
  banner(endless ? 'ENDLESS SKIES' : SECTORS[s].name, `ONLINE CO-OP · YOU ARE ${NET.host ? 'RIDER 1 (HOST)' : 'RIDER 2'}`, 2.6);
  A.playMusic(endless ? 's1' : SECTORS[s].music);
  say('partner', { key: true, delay: 1 });
}

// The host's tab goes to the background: requestAnimationFrame stops there, so the arena would freeze for the guest.
// A dedicated Worker's timer (not throttled like rAF / main-thread timers) keeps the host's game running without
// drawing, snapshots keep flowing and the autopilot flies rider 1 until the tab is back (the guest is told).
// If the whole page is frozen anyway (a phone switching apps), the guest holds still under HOST PAUSED (hostWait).
let bgTick = null;
function hostAway(hidden) {
  const on = hidden && G.mode === 'online' && NET.host && !G.fixed && (G.state === 'play' || G.state === 'paused-online');
  if (on && !bgTick) {
    try {
      bgTick = new Worker(URL.createObjectURL(new Blob(['setInterval(() => postMessage(0), 1000 / 30);'], { type: 'text/javascript' })));
      bgTick.onmessage = () => { if (!document.hidden || G.mode !== 'online') return; const now = performance.now(), dt = Math.min(0.1, (now - lastT) / 1000); lastT = now; if (G.state === 'play' || G.state === 'paused-online') playStep(dt); };
    } catch { bgTick = null; }
    if (bgTick) { G.awayAI = new Autopilot(G.W.seed, 'demo'); NET.away = true; A.muffle(true); }
  } else if (!on && bgTick) {
    bgTick.terminate(); bgTick = null; G.awayAI = null; NET.away = false; lastT = performance.now();
    if (G.state === 'play') A.muffle(false);
  }
}
document.addEventListener('visibilitychange', () => hostAway(document.hidden));
// guest: no snapshot for 2 s = the host's page is not running; RIDER 1 AWAY = its tab is in the background (autopilot)
function hostWait(W) {
  const held = !!NET.lastSnap && performance.now() - NET.lastSnap > 2000 && !W.over;
  if (held) caption('HOST PAUSED · WAITING FOR RIDER 1 TO COME BACK', 0.6);
  else if (NET.hostAway && !(G.capT > 0.3)) caption('RIDER 1 IS AWAY · THE AUTOPILOT FLIES FOR THEM', 1.2);
  return held;
}

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'endless': A.play('uiok', { gap: 0 }); startEndless(); break;
    case 'coop': A.play('uiok', { gap: 0 }); startCampaign(0, { coop: true }); banner('LOCAL CO-OP', 'RIDER 1: A D + W · RIDER 2: ← → + ↑ (OR TWO GAMEPADS)', 3.5); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'scores': renderScores(G.boardTab || 'campaign', settings.diff); show('scores'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': show('options'); break;
    case 'help': show('help'); break;
    case 'online': $('net-status').textContent = ''; $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); show('online'); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next':
      if (G.mode === 'demo') { clearTimeout(G.ptT); startDemo(G.run.up); }
      else if (G.mode === 'playthrough') { clearTimeout(G.ptT); if (G.state === 'upgrade') beginSector(G.run.sector + 1); }
      else beginSector(G.run.sector + 1);
      break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
    case 'continue': continueRun(); break;
    case 'resume': resume(); break;
    case 'quit': if (G.mode === 'online') NET.close(); hostAway(false); toTitle(); break;
    case 'pause': pause(); break;
    case 'net-quick': NET.quick({ ini: boardOf('campaign').initials() }); break;
    case 'net-host': { const code = randomCode(4); $('room-code').textContent = code; $('room-wrap').classList.remove('hidden'); NET.connect(ROOM + code, 'host', { ini: boardOf('campaign').initials() }); netStatus('Opening a room…', 'wait'); break; }
    case 'net-join': { const code = cleanCode($('join-code').value); if (code.length < 4) { netStatus('Type the 4-letter room code', 'error'); break; } NET.connect(ROOM + code, 'join', { ini: boardOf('campaign').initials() }); netStatus('Joining…', 'wait'); break; }
    case 'net-go': hostStart(); break;
    case 'net-back': NET.close(); goBack(); break;
    case 'reload': location.reload(); break;
    default: break;
  }
}
function syncSegs() { for (const s of document.querySelectorAll('.seg')) for (const b of s.children) b.classList.toggle('on', String(settings[s.dataset.opt]) === b.dataset.v); }
function applySettings() {
  A.vol.music = settings.music / 100 * 0.8; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100;
  A.applyVolumes();
  applyCalm();
  for (const el of document.querySelectorAll('[data-set]')) el.value = settings[el.dataset.set];
  syncSegs();
  if (G.state === 'play') setHud(true);
}
function cycleIni(d) { const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const c = G.ini.chars[G.ini.i]; G.ini.chars[G.ini.i] = C[(C.indexOf(c) + d + C.length) % C.length]; G.ini.edited = true; renderIni(); A.play('uimove', { gap: 0 }); }
function buildSectors() {
  $('secgrid').innerHTML = SECTORS.map((s, i) => {
    const md = MEDALS.filter((m) => m.sector === i).map((m) => (medals.has(m.id) ? '★' : '☆')).join('');
    const b = best[bestKey(settings.diff, i)], bs = bestSc[bestKey(settings.diff, i)];
    return `<button class="sec" data-sec="${i}" ${i > reach && !params.has('unlock') ? 'disabled' : ''}><b>SECTOR ${i + 1}</b><span>${s.name}</span><small>${BOSSES[s.boss].name}</small><small class="bests">${b ? 'BEST ' + fmtT(b) + ' · ' + bs.toLocaleString() : 'NO CLEAR YET'} · ${DL(settings.diff)}</small><div class="md">${md}</div></button>`;
  }).join('');
}
function buildMedals() {
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} · EARNED ON NORMAL OR HARDER`;
  $('medlist').innerHTML = SECTORS.map((s, i) => `<h3>SECTOR ${i + 1} · ${s.name}</h3><div class="medrow">${MEDALS.filter((m) => m.sector === i).map((m) => `<span class="medal ${medals.has(m.id) ? 'on' : ''}" title="${m.desc}">${m.name}<br><small>${m.desc}</small></span>`).join('')}</div>`).join('');
}
const clean = (v, n) => String(v || '').toUpperCase().replace(/[^A-Z0-9 -]/g, '').slice(0, n);
const rows = (list, mine) => (list && list.length ? list.map((r, i) => `<tr class="${mine && r.ts === mine ? 'me' : ''}"><td>${i + 1}</td><td>${clean(r.initials, 3) || '???'}</td><td class="ex">${clean(typeof r.extra === 'string' ? r.extra : '', 14)}</td><td>${Math.max(0, Math.floor(+r.score || 0)).toLocaleString()}</td></tr>`).join('') : '<tr><td></td><td>NO SCORES YET</td><td></td><td></td></tr>');
async function renderScores(tab = 'campaign', diff = G.scoreDiff || settings.diff) {
  G.scoreTab = tab; G.scoreDiff = diff;
  for (const b of document.querySelectorAll('#scores .tab')) b.classList.toggle('on', b.dataset.tab === tab);
  for (const b of document.querySelectorAll('#scores [data-hd]')) b.classList.toggle('on', b.dataset.hd === diff);
  const board = boardOf(tab, diff);
  $('hs-local').innerHTML = rows(board.local(), G.lastEntry);
  $('hs-global').innerHTML = '<tr><td></td><td>LOADING…</td><td></td><td></td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => { const k = bestKey(diff, i); return `<div class="stat"><span>S${i + 1} ${s.name}</span><b>${best[k] ? fmtT(best[k]) + ' · ' + (bestSc[k] || 0).toLocaleString() : '-'}</b></div>`; }).join('');
  const g = await board.fresh(15000);
  if (G.scoreTab === tab && G.scoreDiff === diff) $('hs-global').innerHTML = g ? rows(g) : '<tr><td></td><td>OFFLINE</td><td></td><td></td></tr>';
}
// the compact world board on the title screen
async function renderTitleBoard(tab = G.boardTab) {
  G.boardTab = tab;
  for (const b of document.querySelectorAll('#tboard .tab')) b.classList.toggle('on', b.dataset.btab === tab);
  const board = boardOf(tab, settings.diff);
  $('tb-diff').textContent = DL(settings.diff);
  const g = await board.fresh(30000);
  if (G.boardTab !== tab) return;
  const list = (g || board.local()).slice(0, 5);
  $('tb-rows').innerHTML = rows(list);
  $('tb-src').textContent = g ? 'WORLD' : 'THIS DEVICE (OFFLINE)';
  // phones: a compact top 3 inside the title card (tap = HIGH SCORES with every board)
  $('tbm-diff').textContent = DL(settings.diff); $('tbm-src').textContent = (tab === 'endless' ? 'ENDLESS' : 'CAMPAIGN') + (g ? '' : ' · OFFLINE');
  $('tbm-rows').innerHTML = list.length ? list.slice(0, 3).map((r, i) => `<span><i>${i + 1}</i>${clean(r.initials, 3) || '???'}<em>${Math.max(0, Math.floor(+r.score || 0)).toLocaleString()}</em></span>`).join('') : '<span>NO SCORES YET · BE THE FIRST</span>';
}

// ------------------------------------------------------------------ edge markers for threats off screen
const WM = [];
const PE = { x: 0, y: 0, z: 0 };
function updateWarnings(W) {
  const list = [];
  const me = myPlayer(W);
  for (const r of W.riders) list.push([r.x, r.y + 1, r.y > me.y + 1.5 ? 'red' : 'orange', ENEMY[r.type].name[0]]);
  if (W.hunter && W.hunter.st !== 'leave') list.push([W.hunter.x, W.hunter.y, 'red big', '◆']);
  for (const c of W.cores) if (!c.rush) list.push([c.x, c.y, 'amber minor', '◈']);
  for (const h of W.haz) if ((h.k === 'spout' || h.k === 'bolt') && h.t < h.T) list.push([h.x, h.k === 'spout' ? 1 : 20, 'violet', '!']);
  if (W.players[1] && W.coop) { const o = W.players[G.mode === 'online' && !NET.host ? 0 : 1]; if (o.alive) list.push([o.x, o.y + 1, 'green', '2']); }
  let n = 0;
  const m = 26;
  for (const [x, y, cls, txt] of list) {
    R.project(x, y, PE);
    const off = PE.z > 1 || PE.x < m || PE.x > innerWidth - m || PE.y < m + 60 || PE.y > innerHeight - m;
    if (!off) continue;
    let el = WM[n];
    if (!el) { el = document.createElement('div'); $('warns').appendChild(el); WM.push(el); }
    const side = dX(me.x, x) >= 0 ? 1 : -1;
    const px = PE.z > 1 || PE.x < m || PE.x > innerWidth - m ? (side > 0 ? innerWidth - m : m) : PE.x;
    const py = Math.max(m + 70, Math.min(innerHeight - m - 40, PE.y));
    el.className = 'wm ' + cls; el.textContent = txt; el.style.left = px + 'px'; el.style.top = py + 'px'; el.style.display = '';
    el.style.setProperty('--r', side > 0 ? '0deg' : '180deg');
    n++;
    if (n >= 10) break;
  }
  for (let i = n; i < WM.length; i++) WM[i].style.display = 'none';
}

// ------------------------------------------------------------------ round 2 UI: death causes, duel cues, pause state
// [short label for the results row, caption at the moment of death, tip on the results card]
const HAZ_TIP = 'Every hazard is telegraphed: a violet ! or a glowing line marks it before it strikes. Clear that spot early.';
const CAUSE = {
  sea: ['THE SEA', 'FELL INTO THE SEA', 'Flap before you sink: the sea takes you the moment you drop below the low ledges.'],
  lance: ['LANCES', 'UNHORSED', 'The higher lance tip wins and a level one just clangs. Climb above a rider before you meet it (green ▲ over a rider = you win).'],
  hunter: ['STORMHUNTER', 'RAMMED BY THE STORMHUNTER', 'Meet the Stormhunter head-on and a little higher, or keep out of its line.'],
  boss: ['BOSS', 'CRUSHED BY THE BOSS', 'Strike the weak points from above and keep clear of the body between attacks.'],
  shard: ['SHARDS', 'HIT BY CRYSTAL SHARDS', 'Shards fly in a fan along the glowing line: dodge sideways out of it, not along it.'],
  orb: ['ORBS', 'CAUGHT BY AN ORB', 'Pop orbs with your lance from above, or outrun them until they fade.'],
  blob: ['MOLTEN DROPS', 'HIT BY MOLTEN DROPS', HAZ_TIP], ice: ['FALLING ICE', 'HIT BY FALLING ICE', HAZ_TIP],
  spout: ['SPOUTS', 'CAUGHT IN A SPOUT', HAZ_TIP], bolt: ['LIGHTNING', 'STRUCK BY LIGHTNING', HAZ_TIP], arc: ['STORM ARCS', 'CAUGHT IN A STORM ARC', HAZ_TIP],
  beam: ['BEAMS', 'CAUGHT IN A BEAM', HAZ_TIP], slam: ['SLAMS', 'CRUSHED BY A SLAM', HAZ_TIP], gust: ['GUSTS', 'THROWN BY A GUST', HAZ_TIP], breach: ['BREACHES', 'CAUGHT IN A BREACH', HAZ_TIP],
};
const causeOf = (c) => CAUSE[c] || [String(c || 'hit').toUpperCase(), 'HIT BY ' + String(c || 'a hazard').toUpperCase(), HAZ_TIP];
function deathCaption(W, e) {
  if (G.mode === 'demo' || G.mode === 'playthrough') return;
  if (G.mode === 'online' && e.pid !== myPlayer(W).id) return;
  const C = causeOf(e.cause);
  let txt = e.cause === 'lance' ? `UNHORSED BY A ${e.by && ENEMY[e.by] ? ENEMY[e.by].name : 'RIDER'} · ITS LANCE WAS HIGHER` : C[1];
  if (W.coop && G.mode !== 'online') txt = `P${e.pid} · ` + txt;
  caption(txt, 3.2);
  $('caption').classList.add('dc');
}
// the results card: what took your lives, and one tip for the biggest cause
function causeRow(W) {
  const c = W.stats && W.stats.cause;
  if (!c || !W.stats.deaths) return '';
  const list = Object.entries(c).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  if (!list.length) return '';
  const row = list.map(([k, n]) => `${causeOf(k)[0]} ${n}`).join(' · ');
  return `<div class="stat lw-cause"><span>LIVES LOST TO</span><b>${row}</b></div><div class="lw-ctip">${causeOf(list[0][0])[2]}</div>`;
}
// duel cue: over the (up to 4) nearest riders, is your lance tip higher? ▲ win, = clang, ▼ lose; a shield when a shieldbearer faces you
const DM = [];
const DUEL_R2 = 8 * 8;
// mirrors sim.js lanceBonus (read-only copy, kept here so this block adds no second sim.js?v= import line)
const lanceBonus = (W, p) => 0.12 * (W.up.reach || 0) + (p.pw && p.pw.lance ? 0.35 : 0);
let duelBox = null;
function duelMarks(W) {
  if (!duelBox) { duelBox = document.createElement('div'); duelBox.id = 'duels'; $('ui').insertBefore(duelBox, $('warns')); }
  const me = myPlayer(W);
  let n = 0;
  if (me && me.alive && G.state === 'play' && G.mode !== 'demo' && G.mode !== 'playthrough') {
    const near = [];
    for (const r of W.riders) {
      if (!r.alive) continue;
      const dx = dX(me.x, r.x), dy = r.y - me.y, d2 = dx * dx + dy * dy;
      if (d2 < DUEL_R2) near.push([d2, r, dx]);
    }
    near.sort((a, b) => a[0] - b[0]);
    const lb = lanceBonus(W, me);
    for (const [, r, dx] of near) {
      if (n >= 4) break;
      R.project(r.x, r.y + 2.7, PE);
      if (PE.z > 1 || PE.x < 0 || PE.x > innerWidth || PE.y < 0 || PE.y > innerHeight) continue;
      const s = Math.sign(dx || me.face);
      const front = r.type === 'shieldbearer' && r.face === -s;
      const d = me.y + lb - r.y, need = front ? ENEMY.shieldbearer.margin : F.dead;
      const cls = d > need ? 'win' : d < -F.dead ? 'lose' : 'even';
      let el = DM[n];
      if (!el) { el = document.createElement('div'); duelBox.appendChild(el); DM.push(el); }
      const key = cls + (front ? 's' : '');
      if (el.dataset.k !== key) { el.dataset.k = key; el.className = 'dm ' + cls; el.innerHTML = (front ? '<i class="sh"></i>' : '') + (cls === 'win' ? '▲' : cls === 'lose' ? '▼' : '='); }
      el.style.transform = `translate(${PE.x.toFixed(1)}px, ${PE.y.toFixed(1)}px) translate(-50%, -100%)`;
      el.style.display = '';
      n++;
    }
  }
  for (let i = n; i < DM.length; i++) if (DM[i].style.display !== 'none') DM[i].style.display = 'none';
}
// body classes for the overlay CSS: paused (dims the scene, hides tips / markers / touch controls) and live play
let uiPaused = null, uiLive = null;
function uiState() {
  const p = G.state === 'paused' || G.state === 'paused-online', l = G.state === 'play' || G.state === 'paused-online';
  if (p !== uiPaused) { uiPaused = p; document.body.classList.toggle('lw-paused', p); }
  if (l !== uiLive) { uiLive = l; document.body.classList.toggle('lw-live', l); }
}

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
  uiState();
  perf(dt);
  if (G.slowT > 0) { G.slowT -= dt; if (G.slowT <= 0) { G.timeScale = 1; A.setRate(1); } }
  if (G.state === 'play' || G.state === 'paused-online') playStep(dt);
  else if (G.state === 'replay') replayStep(dt);
  else if (G.scenic && G.W === G.scenic) scenicStep(dt);
  const cur = G.state === 'replay' && G.replay ? G.replay.W : G.W;
  if (!cur) return;
  if (draw) {   // draw = false: the test hook runs the game without rendering
    if (cur.k !== R.lookI) R.setLook(cur.k);
    R.sync(cur, dt);
    const menu = G.state === 'title' || (G.mode === 'title' && G.screen);
    const focus = cur.players.filter((p) => p.alive);
    // a boss close by joins the shot (landscape only: a portrait screen is too narrow to frame both)
    const B = cur.boss;
    if (B && B.st === 'fight' && focus.length === 1 && !R.portrait && Math.abs(dX(focus[0].x, B.x)) < 14 && B.y > -2) focus.push({ x: B.x, y: Math.min(Math.max(B.y, 5), 18) });
    R.updateCamera(dt, { focus: G.mode === 'online' ? [myPlayer(cur)] : focus.length ? focus : cur.players, cine: menu, shake: +settings.shake });
    A.setListener(R.camera);
    ambience(cur, menu);
    R.render(dt, { slow: cur.slow > 0 && G.state !== 'title' });
    if (G.tutT > 0 && G.state === 'play') placeTut(cur);
  }
  if (G.bannerT > 0) { G.bannerT -= dt; if (G.bannerT <= 0) $('banner').classList.add('hidden'); }
  if (G.tutT > 0) { G.tutT -= dt; if (G.tutT <= 0) $('tut').classList.add('hidden'); }
  if (G.capT > 0) { G.capT -= dt; if (G.capT <= 0) $('caption').classList.add('hidden'); }
}
// ambient beds: storm wind (louder up high), surf (louder near the sea), the rush of a fast dive, the Stormhunter's engine
function ambience(W, menu) {
  if (!A.ctx) return;
  const p = W.players.find((q) => q.alive) || W.players[0];
  const live = G.state === 'play' || G.state === 'replay' || G.state === 'paused-online';
  const k = G.state === 'paused' ? 0.25 : 1;
  const y = p ? p.y : 12, spd = p ? Math.hypot(p.vx, p.vy) : 0;
  A.setBed('wind', 'wind', (0.16 + Math.min(1, y / F.H) * 0.16 + (menu ? 0.06 : 0)) * k, 0.92 + Math.min(1, y / F.H) * 0.16);
  A.setBed('surf', 'surf', (menu ? 0.16 : 0.08 + Math.max(0, 1 - y / 10) * 0.22) * k);
  A.setBed('rush', 'rush', live && p && p.alive ? Math.max(0, Math.min(1, (spd - 9) / 9)) * 0.32 * k : 0, 0.85 + Math.min(0.4, spd / 40));
  const h = W.hunter;
  if (h && live) { A.loop('hunter', 'hunterloop', 0.55); const q = toPos(h.x, h.y); A.setLoop('hunter', q.x, q.y, q.z, 1, 1 + Math.min(0.3, Math.abs(h.vx) / 40)); }
  else if (A.loops.has('hunter')) { A.setLoop('hunter', 0, 0, 0, 0); if (!h) { const L = A.loops.get('hunter'); try { L.src.stop(A.ctx.currentTime + 0.5); } catch { /* stopped */ } A.loops.delete('hunter'); } }
}
function playStep(dt) {
  const W = G.W;
  holdSim(dt);   // hit-stop: hold the sim (presentation only)
  G.acc += dt * G.timeScale;
  let n = 0;
  const online = G.mode === 'online', guest = online && !NET.host;
  if (guest) handleEvents(NET.guestSync(W), W, true);
  if (guest && hostWait(W)) { G.acc = 0; NET.guestFrame(W, dt); updateHud(W); return; }   // the host's page is frozen: hold still until it is back
  while (G.acc >= STEP && n < 12) {
    if (!online) REC.tick(W);
    const ctl = G.state === 'play';
    if (online) { const me = myPlayer(W); me.input = G.ai ? G.ai.control(W, me) : G.awayAI ? G.awayAI.control(W, me) : ctl ? I.control(1, false) : { mx: 0, flap: false }; }
    else W.players.forEach((p, i) => {
      if (i === 0 && G.ai) p.input = G.ai.control(W, p);
      else if (i === 1 && G.ai2) p.input = G.ai2.control(W, p);
      else p.input = ctl ? I.control(p.id, W.coop) : { mx: 0, flap: false };
    });
    if (online && NET.host) NET.hostTick(W, applyClaim);
    if (!online) REC.input(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (guest) ev = ev.filter((e) => e.pid === 2 && ['flap', 'death', 'splash', 'land'].includes(e.k));
    if (online && NET.host) NET.hostEvents(ev);
    handleEvents(ev, W, true);
    G.acc -= STEP; n++;
    if (W.over) break;
  }
  if (n >= 12) G.acc = 0;
  if (online) { if (NET.host) NET.hostFrame(W, dt); else NET.guestFrame(W, dt); }
  captureClip(W);
  updateHud(W);
  updateWarnings(W);
  duelMarks(W);
  if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 95) W.over = true; }
  if (G.mode === 'demo' || G.mode === 'playthrough') demoCaptions(W);
  if (W.over && (G.state === 'play' || G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => { if (G.W === W && G.state === 'ended') onWorldOver(W); }, G.mode === 'demo' ? 1500 : 1300); }
}
function replayStep(dt) {
  const Rp = G.replay;
  const near = Math.abs(Rp.toKey) < 0.7;
  A.setRate(near ? 0.7 : 1);
  const ev = Rp.advance(dt * (near ? 0.35 : 1));
  handleEvents(ev, Rp.W, false);
  const p = Rp.W.players[0];
  if (p) R.frameShot([[p.x, p.y]], 0.3);
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { const p = W.players[0]; p.input = G.scenicAI.control(W, p); step(W, STEP); for (const e of drainEvents(W)) R.onEvent(e, W); W.lives = 99; G.acc -= STEP; n++; }
  if (W.over) scenic();
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 12)) startDemo();
  }
}
// what the autopilot is up to, now and then
function demoCaptions(W) {
  const now = performance.now() / 1000;
  if ((G.capCool || 0) > now || !G.ai) return;
  const d = G.ai.debug;
  let text = null;
  if (W.boss && W.boss.st === 'fight') text = `AUTOPILOT · going for ${BOSSES[W.boss.key].name}'s weak point from above`;
  else if (d.why && d.why.startsWith('duel')) text = `AUTOPILOT · climbing above a ${d.why.slice(5)} for the higher lance`;
  else if (d.why === 'ember core') text = `AUTOPILOT · grabbing an ember core before it re-ignites${W.chain ? ` (chain ×${W.chain})` : ''}`;
  else if (d.why === 'hunter head-on') text = 'AUTOPILOT · lining up head-on with the Stormhunter';
  if (text) { caption(text, 2.6); G.capCool = now + 7; }
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

// ------------------------------------------------------------------ input wiring
I.on('any', () => {
  A.unlock();
  G.idleT = 0;
  if (G.mode === 'demo' && (G.state === 'play' || G.state === 'upgrade' || G.state === 'ended')) { G.eatClick = performance.now() + 450; toTitle(); }
});
I.on('pause', (src) => {
  if (G.mode === 'playthrough' && G.state !== 'replay') { toTitle(); return; }   // the badge: ESC / START TO STOP
  if (G.state === 'play') pause();
  else if ((G.state === 'paused' || G.state === 'paused-online') && G.screen && G.screen !== 'pause') act('back');   // Esc in OPTIONS goes back to PAUSE
  else if (G.state === 'paused' || G.state === 'paused-online') resume();
  else if (G.state === 'replay') endReplay();
  else if (G.screen === 'results') { if (src === 'pad' && !resultsConfirm() && selEl) selEl.click(); }   // START on the results = A
  else if (G.screen && G.screen !== 'title') act('back');
});
const eaten = () => G.eatClick && performance.now() < G.eatClick;   // input that just stopped the demo
I.on('confirm', () => { if (!G.screen || eaten() || resultsConfirm()) return; if (selEl) selEl.click(); });
I.on('tap', (a) => { if (a === 'pause' && G.state === 'play') pause(); });   // the click that may follow is a no-op
I.on('back', () => {
  if (G.ini && G.screen === 'results') { if (G.ini.i > 0) { G.ini.i--; renderIni(); A.play('uimove', { gap: 0 }); } return; }
  if (G.screen && G.screen !== 'title' && G.screen !== 'results') act('back');
});
I.on('key', (k, e) => {
  if (G.ini && G.screen === 'results') {
    if (resGuard(450)) return;
    if (e && /^Key[A-Z]$|^Digit[0-9]$/.test(k)) { G.ini.chars[G.ini.i] = k.slice(-1); G.ini.edited = true; G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); A.play('uimove', { gap: 0 }); return; }
    if (k === 'ArrowUp') { cycleIni(1); return; } if (k === 'ArrowDown') { cycleIni(-1); return; }
    if (k === 'ArrowLeft') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return; } if (k === 'ArrowRight') { G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); return; }
    if (k === 'Backspace') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return; }
    if (k === 'Enter' || k === 'NumpadEnter' || k === 'Space') { if (e) e.preventDefault(); if (!resGuard()) { A.play('uiok', { gap: 0 }); submitIni(); setSel(firstSel('results')); } return; }
  }
  if (!G.screen || eaten()) return;
  if (resGuard() && (k === 'Enter' || k === 'Space')) return;
  if (k.startsWith('Arrow')) navigate(k);
  else if ((k === 'Enter' || k === 'Space') && selEl) { if (e) e.preventDefault(); selEl.click(); }
});
document.addEventListener('click', (e) => {
  if (eaten()) return;   // the tap that stopped the demo
  const t = e.target.closest('[data-act], [data-opt] button, .sec, .upg, [data-tab], [data-hd], [data-btab], #ini b, [data-ini]');
  if (!t) return;
  A.unlock();
  if (t.dataset.act) { act(t.dataset.act); return; }
  if (t.parentElement && t.parentElement.dataset.opt) {
    const k = t.parentElement.dataset.opt; settings[k] = t.dataset.v; saveSettings(); applySettings(); A.play('uimove', { gap: 0 });
    if (k === 'quality') $('q-reload').classList.toggle('hidden', settings.quality === bootQuality || G.state !== 'title');
    if (k === 'diff') { $('diff-desc').textContent = DIFFICULTY[settings.diff].desc; $('title-best').textContent = 'BEST ' + boardOf('campaign', settings.diff).best().toLocaleString(); renderTitleBoard(); }
    return;
  }
  if (t.classList.contains('sec')) { G.run = null; A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sec); return; }
  if (t.classList.contains('upg')) { buy(t.dataset.up); return; }
  if (t.dataset.tab) { renderScores(t.dataset.tab); return; }
  if (t.dataset.hd) { renderScores(G.scoreTab, t.dataset.hd); return; }
  if (t.dataset.btab) { renderTitleBoard(t.dataset.btab); return; }
  if (t.parentElement && t.parentElement.id === 'ini' && G.ini) { G.ini.i = [...t.parentElement.children].indexOf(t); cycleIni(1); }
  if (t.dataset.ini && G.ini) { G.ini.i = +t.dataset.ini; cycleIni(+t.dataset.d); }
});
for (const el of document.querySelectorAll('[data-set]')) el.addEventListener('input', () => { settings[el.dataset.set] = +el.value; saveSettings(); applySettings(); });
I.stickUI = (s) => {
  const el = $('stick');
  if (!s) { el.classList.remove('on'); return; }
  el.classList.add('on'); el.style.left = s.sx + 'px'; el.style.top = s.sy + 'px';
  el.querySelector('i').style.transform = `translateX(${Math.max(-56, Math.min(56, s.x - s.sx))}px)`;
};

// ------------------------------------------------------------------ boot
async function boot() {
  try { R.warmUp(); } catch (e) { console.warn('warm-up', e); }
  applySettings();
  $('loading').style.opacity = '0';
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  if (params.has('test')) { const m = await import('./tests.js?v=10'); m.runTests(window.__lw); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (params.has('endless') && G.autopilot) { A.unlock(); startEndless(); }
  else if (G.autopilot) { A.unlock(); startCampaign(+params.get('sector') || 0); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  if (!G.fixed) requestAnimationFrame(frame);
}
Object.assign(window.__lw, {
  tick: (n = 1, dt = 1 / 60, draw = true) => { for (let i = 0; i < n; i++) tickFrame(dt, draw || i === n - 1); },
  startDemo, startCampaign, startEndless, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings,
  noPost: NO_POST, isBossWave,
  auto: (profile = 'demo') => { if (G.W) { G.ai = new Autopilot(G.W.seed + (G.mode === 'online' && !NET.host ? 1 : 0), profile); if (G.run) G.run.auto = true; } },
  posted, bests: () => ({ best, bestSc, reach, medals: [...medals] }), demoShop, hostAway,
  boardNames: () => DIFF_KEYS.flatMap((d) => ['campaign', 'endless'].map((m) => boardOf(m, d).game)),
});
Object.defineProperty(window.__lw, 'W', { get: () => G.W });
boot();
