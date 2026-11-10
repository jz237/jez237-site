// Swarmbreak — game flow, menus, HUD, commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, WAVES, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, TYPICAL_UP, START_LIVES, BOSSES, DIFFICULTY, DIFF_KEYS, POWERUPS, STREAK, streakMul, SUITS } from './config.js?v=13';
import { makeWorld, step, drainEvents, waveLabel, isBossWave, angDiff } from './sim.js?v=13';
import { Autopilot } from './ai.js?v=13';
import { Renderer, pickQuality, CALM } from './render.js?v=13';
import { Audio } from './audio.js?v=13';
import { Input } from './input.js?v=13';
import { Scores, NO_POST } from './scores.js?v=13';
import { Recorder, Replay } from './replay.js?v=13';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=13';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'sb.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', view: 'close', suit: 'cobalt', assist: 'light' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('sb.medals.v1', []));
const best = load('sb.best.v1', {});
let reach = load('sb.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input(R.camera);
// high-score boards: one per difficulty for the campaign and for Last Stand (Normal keeps the original names)
const BOARDS = {};
// DAILY CHALLENGE: the same seeded sector for everyone today (UTC), on Hard, with a board per day
const today = () => new Date().toISOString().slice(0, 10);
function dailyCfg(day = today()) {
  let h = 2166136261;
  for (const c of 'swarmbreak:' + day) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  const seed = h >>> 1, sector = seed % 5;
  return { day, seed, sector, diff: 'hard', up: { ...TYPICAL_UP[sector] } };
}
function boardOf(mode, diff = 'normal') {
  if (mode === 'daily') { const key = 'swarmbreak-daily-' + today().replace(/-/g, ''); return BOARDS[key] || (BOARDS[key] = new Scores(key)); }
  const key = (mode === 'stand' ? 'swarmbreak-laststand' : 'swarmbreak') + (diff === 'normal' ? '' : '-' + diff);
  return BOARDS[key] || (BOARDS[key] = new Scores(key));
}
const HS = boardOf('campaign');
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
// best sector times are kept per difficulty too
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), lastLife: false, stepPh: {},
};
window.__sb = { G, R, A, I, NET, REC, settings, VERSION };

// ------------------------------------------------------------------ talking: rare on purpose
// KEY lines (run start, sector start, boss, boss down, sector clear, game over, new record) always get
// through, one voice at a time; colour lines wait VOICE_GAP seconds after the last line and roll a chance.
const VOICE_GAP = 26;
let lastLine = -99;
const nowS = () => performance.now() / 1000;
function say(name, o = {}) {
  if (settings.talk === 'off' || G.mode === 'demo' || G.mode === 'title') return;
  const t = nowS(), last = G.says.get(name) ?? -99;
  if (t - last < (o.cd ?? 0) || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__sb.lines ||= []).push([t, name]); }
}
function rumble(strong, weak, ms) { if (settings.rumble === 'off' || G.mode === 'demo' || G.mode === 'playthrough' || G.mode === 'title') return; I.rumble(strong, weak, ms); }

// ------------------------------------------------------------------ screens
const SCREENS = ['title', 'sectors', 'upgrades', 'results', 'scores', 'medals', 'options', 'help', 'online', 'pause'];
function show(id, push = true) {
  if (push && G.screen && G.screen !== id) G.back.push(G.screen);
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id);
  G.screen = id;
  if (id) { const first = $(id).querySelector('.mbtn.primary, .mbtn, .sec:not([disabled]), .upg'); setSel(first); }
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
  // the title shows a sector with a few machines prowling and survivors milling about
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 7 + look, wave: 2, demo: true, lives: 9 });
  W.players[0].alive = false; W.players[0].deadT = -1e9;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  A.stopLoops();
  G.replay = null; G.ai = null; G.timeScale = 1; A.setRate(1); R.shot = null;
  for (const id of ['letterbox', 'bossbar', 'tut', 'banner', 'caption']) $(id).classList.add('hidden');
  for (const d of WM) d.style.display = 'none';
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
function startCampaign(sector = 0) {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 400 * sector : 0, start: sector, newMedals: [], diff: settings.diff };
  say('begin', { key: true, delay: 0.8 });
  beginSector(sector);
}
function beginSector(s) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, wave: +params.get('wave') || 0, demo: !!G.run.ai, diff: G.run.diff || 'normal' });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 3);
  if (s > 0) say('s' + (s + 1), { key: true, delay: 1.2 });
}
// AI PLAYTHROUGH: the demo autopilot plays the whole campaign, picks its own upgrades between sectors
// and retries a sector if it runs out of Wardens. Nothing it does counts for scores or medals.
const AI_SHOP = ['rapid', 'armor', 'spread', 'pulse', 'rapid', 'servos', 'spread', 'armor', 'tractor', 'rapid', 'pulse', 'servos'];
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0 };
  beginSector(+params.get('sector') || 0);
  caption('AI PLAYTHROUGH: THE AUTOPILOT PLAYS ALL FIVE SECTORS. PRESS ESC OR PAUSE TO STOP', 6);
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
function startDaily() {
  const c = dailyCfg();
  G.run = { score: 0, lives: START_LIVES, up: c.up, salvage: 0, start: c.sector, newMedals: [], diff: c.diff, daily: c.day };
  const W = makeWorld({ mode: 'campaign', sector: c.sector, seed: c.seed, up: c.up, lives: START_LIVES, diff: c.diff, noTut: true });
  G.run.sector = c.sector; G.run.score0 = 0;
  G.mode = 'daily';
  enterPlay(W);
  banner('DAILY CHALLENGE', `${c.day} · SECTOR ${c.sector + 1} · ${SECTORS[c.sector].name} · HARD`, 3.2);
}
function startStand() {
  G.run = { score: 0, lives: START_LIVES, up: {}, start: 0, newMedals: [], diff: settings.diff };
  G.mode = 'stand';
  enterPlay(makeWorld({ mode: 'stand', seed: newSeed(), diff: settings.diff }));
  banner('LAST STAND', 'HOW LONG CAN YOU HOLD', 3);
  say('stand', { key: true, delay: 0.8 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start a few waves in so the boss shows up within the minute, with upgrades fitted to show them off
  const up = { ...TYPICAL_UP[s], rapid: Math.max(1, TYPICAL_UP[s].rapid || 0), spread: Math.max(1, TYPICAL_UP[s].spread || 0), pulse: Math.max(1, TYPICAL_UP[s].pulse || 0) };
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, wave: WAVES - 2, up, lives: 9 });
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now();
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · FITTED: ${UP_KEYS.filter((k) => up[k]).map((k) => UPGRADES[k].name).join(', ')}`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.lastLife = false;
  if (!G.ai && G.autopilot && G.mode !== 'online') G.ai = new Autopilot(W.seed, 'demo');
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  REC.reset();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  R.updateCamera(0.016, { snap: true });
  A.playMusic(W.mode === 'stand' ? SECTORS[W.k].music : SECTORS[W.sector].music);
  A.loop('crawl', 'crawl', 0.5); A.loop('brute', 'brute', 0.55); A.loop('dart', 'dart', 0.45); A.loop('arc', 'arc', 0.5);
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
  if (!on) $('bossbar').classList.add('hidden');
}
function buildStrip(W) {
  const el = $('wavestrip');
  const dl = W.diff !== 'normal' ? ' · ' + DL(W.diff) : '';
  if (W.mode === 'stand') { el.innerHTML = ''; $('sector-name').textContent = 'LAST STAND' + dl; return; }
  el.innerHTML = Array.from({ length: WAVES }, (_, i) => `<b>${i + 1}</b>`).join('') + '<b class="boss">☠</b>';
  $('sector-name').textContent = `SECTOR ${W.sector + 1} · ${SECTORS[W.sector].name}${dl}`;
}
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
const myPlayer = (W) => (G.mode === 'online' && !NET.host ? W.players[1] : W.players[0]);
function updateHud(W) {
  setText('score', W.score.toLocaleString());
  const board = boardOf(W.mode, W.diff);
  setText('hiscore', Math.max(board.best(), W.score).toLocaleString());
  setText('hi-lbl', W.mode === 'stand' ? 'BEST STAND' : 'BEST');
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - (myPlayer(W)?.alive ? 1 : 0)))));
  const me = myPlayer(W);
  const maxSh = (W.R ? W.R.shield : 0) + (W.up.armor || 0), maxPu = (W.R ? W.R.pulse : 0) + (W.up.pulse || 0);
  setHTML('shield', maxSh > 0 ? Array.from({ length: maxSh }, (_, i) => `<i class="${me && i < me.shield ? 'on' : ''}"></i>`).join('') : '');
  setHTML('pulses', Array.from({ length: Math.max(maxPu, me ? me.pulses : 0) }, (_, i) => `<i class="${me && i < me.pulses ? 'on' : ''}"></i>`).join(''));
  $('tb-pulse').classList.toggle('empty', !me || me.pulses <= 0);
  // active power-ups with a draining bar
  const act = [];
  if (me) for (const k in me.pw) act.push([k, me.pw[k]]);
  if (W.warp > 0) act.push(['warp', W.warp]);
  setHTML('pw', act.map(([k, t]) => { const P = POWERUPS[k]; return `<span style="--c:#${P.color.toString(16).padStart(6, '0')}"><b>${P.glyph}</b>${P.name}<i style="width:${Math.min(100, (t / P.time) * 100).toFixed(0)}%"></i></span>`; }).join(''));
  if (W.mode === 'stand') setText('timer', `${waveLabel(W)} · ${fmtT(W.fightT)}`);
  else {
    setText('timer', `${waveLabel(W)} · ${fmtT(W.secT)}`);
    const kids = $('wavestrip').children;
    for (let i = 0; i < kids.length; i++) {
      const cls = i < W.wave ? 'done' : i === W.wave ? 'now' : '';
      const want = (i === kids.length - 1 ? 'boss ' : '') + cls;
      if (kids[i].className !== want) kids[i].className = want;
    }
  }
  setText('chain', W.chain > 1 ? `RESCUE CHAIN ×${W.chain}` : `SURVIVORS ${W.survivors.length + W.enemies.filter((e) => e.hidden).length}`);
  const sk = W.streak, sm = streakMul(sk.n);
  $('streak').classList.toggle('hidden', sk.n < 2);
  if (sk.n >= 2) { setText('streak-n', `${sk.n} STREAK`); setText('streak-m', `×${sm}`); $('streak').querySelector('i').style.width = Math.max(0, (sk.t / STREAK.gap) * 100).toFixed(0) + '%'; $('streak').classList.toggle('hot', sm >= 2.5); }
  const b = W.boss;
  $('bossbar').classList.toggle('hidden', !b || b.state === 'in');
  if (b) {
    setText('boss-name', BOSSES[b.key].name + (b.orbs.some((o) => o.hp > 0) ? ' · SHIELDED: BREAK THE ORBS' : b.state === 'stun' ? ' · STUNNED' : ''));
    $('bossbar').querySelector('i').style.width = Math.max(0, (b.hp / b.max) * 100).toFixed(1) + '%';
  }
}

// banners, captions, popups, tutorial prompts
function banner(a, b, t = 2.2) {
  const el = $('banner');
  el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b || '';
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  G.bannerT = t;
}
function caption(text, t = 4) { const el = $('caption'); el.textContent = text; el.classList.remove('hidden'); G.capT = t; }
const P = { x: 0, y: 0, z: 0 };
function popup(text, x, z, color, big) {
  R.project(x, 2.2, z, P);
  const d = document.createElement('div');
  d.className = 'pop' + (big ? ' big' : ''); d.textContent = text; d.style.left = P.x + 'px'; d.style.top = P.y + 'px';
  if (color) d.style.color = color;
  $('popups').appendChild(d);
  setTimeout(() => d.remove(), 1200);
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    move: { key: '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', pad: 'the left stick', touch: 'your left thumb' },
    aim: { key: 'the <kbd>ARROW KEYS</kbd> (or aim with the mouse and hold the left button)', pad: 'the right stick', touch: 'your right thumb' },
    pulse: { key: '<kbd>SPACE</kbd>', pad: '<kbd>A</kbd> or a bumper', touch: 'the <kbd>PULSE</kbd> button' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  move: () => `Run with ${keyName('move')}. Reach the <b>SURVIVORS</b> (green beacons) to bring them in: each one in a row is worth more. Your shield takes one hit each wave.`,
  aim: () => `Training drones. Aim and fire with ${keyName('aim')}: you can run one way and <b>SHOOT ANOTHER</b>.`,
  leaper: () => `A <b>LEAPER</b>. When it crouches, an orange circle shows where it will land. Be somewhere else.`,
  bulwark: () => `A <b>BULWARK</b>. Its shield stops shots from the front: get round its side, use a PULSE or a rail lance, or keep firing until the shield breaks.`,
  mimic: () => `A <b>MIMIC</b>. Some "survivors" are machines in disguise: watch for a beacon that glints red.`,
  haz_surge: () => `<b>POWER SURGE</b>. When a lane of floor glows blue, step off it: the current runs right along it.`,
  haz_spill: () => `<b>MOLTEN SPILL</b>. Orange circles on the floor fill with molten metal for a few seconds. Keep out.`,
  haz_laser: () => `<b>LASER GATES</b>. Two red lanes light up either side of you, then fire. Stand between them or clear both.`,
  haz_storm: () => `<b>LIGHTNING</b>. Pale circles mark where lightning will strike, and one lands where you are heading.`,
  streak: () => `Scrap machines quickly to build a <b>STREAK</b>: every 6 in a row adds +0.5 to the points multiplier, up to ×4. Getting hit ends it.`,
  pickup: () => `A <b>SUPPLY POD</b>. Run over power-ups to grab them: triple beams, rail lances, a wingman drone and more. They don't wait long.`,
  pulse: () => `Crowded? ${keyName('pulse')} fires a <b>PULSE</b>: it scraps small machines and bolts around you. A few charges every wave.`,
  spitter: () => `A <b>SPITTER</b>. It shows a pink aim line before it fires: step out of the line.`,
  brute: () => `A <b>HAULER</b>. Heavy armour, and it crushes survivors: keep shooting, and get the people out of its way.`,
  hive: () => `A <b>HIVE</b>. It glows purple before it releases darts: break it early.`,
  pylon: () => `<b>PYLONS</b>. Some are wired: when the gap between two crackles, an arc is coming. Shoot one to cut it.`,
  splitter: () => `A <b>SPLITTER</b>. Break it and it bursts into two fast shards.`,
};
function tutorial(key) { if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return; const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = 6.5; }

// ------------------------------------------------------------------ events from the simulation
const BOOM = { bulwark: 2.2, leaper: 1.3, mimic: 1.3, crawler: 1, dart: 0.6, shard: 0.7, spitter: 1.4, splitter: 1.2, brute: 2.2, hive: 2.0, pylon: 1.0, dummy: 0.8 };
function handleEvents(list, W, live) {
  const me = myPlayer(W);
  const mine = (e) => me && e.pid === me.id;
  const fx = R.fx;
  for (const e of list) {
    switch (e.k) {
      case 'fire': {
        A.play('gun', { x: e.x, y: 1.3, z: e.z, vol: mine(e) ? 0.32 : 0.22, gap: 0.04, vary: 0.1 });
        const v = R.views.p.get(e.pid); if (v) v.flash = 1;
        fx.glow(e.x + Math.cos(e.a) * 0.9, e.z + Math.sin(e.a) * 0.9, 2.1, R.look.shot, 0.1, 0.55);
        fx.sparks(e.x, 1.3, e.z, { n: 2, speed: 3, s: 0.2, life: 0.1, vx: Math.cos(e.a) * 6, vz: Math.sin(e.a) * 6, r: 0.6, g: 0.9, b: 1 });
        break;
      }
      case 'hit': A.play(e.type === 'brute' || e.type === 'hive' ? 'clang' : 'hit', { x: e.x, y: 1, z: e.z, vol: 0.5, gap: 0.03 }); fx.sparks(e.x, 1.1, e.z, { n: 6, speed: 5 }); fx.glow(e.x, e.z, 1.7, 0xffc890, 0.16, 0.7); break;
      case 'wallhit': if (Math.random() < 0.25) fx.sparks(e.x, 0.8, e.z, { n: 2, speed: 3, life: 0.2 }); break;
      case 'deflect': A.play('clang', { x: e.x, y: 1, z: e.z, vol: 0.35, gap: 0.08, rate: 1.4 }); fx.sparks(e.x, 1.5, e.z, { n: 5, speed: 6, r: 0.6, g: 0.8, b: 1 }); break;
      case 'kill': {
        R.breakEnemy(e.id, { vx: Math.cos(e.a || 0) * 2, vz: Math.sin(e.a || 0) * 2, power: e.type === 'brute' || e.type === 'bulwark' || e.type === 'hive' ? 1.2 : 1 });
        const s = BOOM[e.type] || 1;
        A.play(s >= 2 ? 'boomM' : s >= 1.2 ? 'boomS' : 'pop', { x: e.x, y: 1, z: e.z, vol: s >= 2 ? 0.9 : 0.6, gap: 0.03 });
        if (s >= 1.2) A.play('debris', { x: e.x, y: 0, z: e.z, vol: 0.3, delay: 0.2, gap: 0.2 });
        fx.explode(e.x, 0.9, e.z, s, { metal: true, rock: false, color: e.type === 'hive' ? 0xc070ff : e.type === 'pylon' ? 0x6fe8ff : undefined });
        if (s >= 2) { R.shock(e.x, e.z, 0.6); R.addTrauma(0.18 * +settings.shake); if (live) rumble(0.3, 0.3, 120); }
        if (live && G.mode !== 'demo' && e.type !== 'dummy' && s >= 2) popup(`+${e.score}`, e.x, e.z);
        break;
      }
      case 'scrap': fx.sparks(e.x, 0.8, e.z, { n: 6, speed: 3, r: 0.6, g: 0.9, b: 1 }); fx.dust(e.x, 0.1, e.z, { n: 3, s0: 0.4, s1: 1.4, life: 1.2, a: 0.3 }); A.play('scrap', { x: e.x, y: 0.5, z: e.z, vol: 0.4, gap: 0.1 }); break;
      case 'rescue': {
        const top = e.chain >= 5;
        A.play(top ? 'rescue5' : 'rescue', { x: e.x, y: 1, z: e.z, vol: 0.85, rate: 1 + Math.min(4, e.chain - 1) * 0.06, gap: 0 });
        fx.ring(e.x, 0, e.z, 2.5, 0x7dff9a); fx.glow(e.x, e.z, 3.2, 0x7dff9a, 0.55, 1);
        fx.sparks(e.x, 1.4, e.z, { n: 14, speed: 3, vy: 2, r: 0.5, g: 1, b: 0.6, life: 0.8 });
        if (live) { popup(`+${e.bonus}`, e.x, e.z, '#8dff8a', e.chain > 2); if (e.chain === 5) say('chain', { cd: 90, chance: 0.6, delay: 0.4 }); }
        break;
      }
      case 'lost': A.play('lost', { x: e.x, y: 1, z: e.z, vol: 0.7 }); fx.sparks(e.x, 1, e.z, { n: 10, speed: 4, r: 1, g: 0.3, b: 0.2 }); if (live) popup('SURVIVOR LOST', e.x, e.z, '#ff8a80'); break;
      case 'pulse': {
        A.play('pulse', { x: e.x, y: 1, z: e.z, vol: 1, gap: 0 });
        fx.ring(e.x, 0, e.z, F.pulseR * 1.05, 0xb48aff); fx.ring(e.x, 0, e.z, F.pulseR * 0.6, 0xe0d0ff);
        fx.sparks(e.x, 1, e.z, { n: 40, speed: 14, r: 0.75, g: 0.6, b: 1, life: 0.5 });
        R.shock(e.x, e.z, 1.3); R.flashScreen(0.18, 0xc8b0ff); R.addTrauma(0.3 * +settings.shake);
        fx.flash(e.x, 1, e.z, 40, 0xb48aff, 0.4); fx.glow(e.x, e.z, F.pulseR * 1.2, 0xb48aff, 0.5, 1.4);
        R.pulse(e.x, e.z, 0xb48aff, F.pulseR * 2.4, 0.6, 2.4);
        if (live && mine(e)) rumble(0.6, 0.8, 260);
        break;
      }
      case 'shield': {
        A.play('shieldhit', { x: e.x, y: 1, z: e.z, vol: 0.9, gap: 0 });
        const v = R.views.p.get(e.pid); if (v) v.hurt = 1;
        fx.sparks(e.x, 1.2, e.z, { n: 16, speed: 6, r: 0.6, g: 0.85, b: 1 }); fx.glow(e.x, e.z, 4, 0x9fd8ff, 0.4, 1.2); R.stripFlash(0x6fc8ff, 0.8);
        if (live) {
          if (mine(e)) { rumble(0.5, 0.6, 200); popup(e.left ? `SHIELD ${e.left} LEFT` : 'SHIELD GONE', e.x, e.z, '#9fd8ff'); }
          if (G.mode === 'demo') { R.frameShot([[e.x, e.z], [e.fx, e.fz]], 1.0); slowmo(0.4, 0.55); }
        }
        break;
      }
      case 'death': {
        R.breakPlayer(e.pid, { power: 1.3 });
        A.play('death', { x: e.x, y: 1, z: e.z, vol: 1, gap: 0 });
        fx.explode(e.x, 1, e.z, 2.6, { metal: true, rock: false, color: 0x8fd8ff });
        fx.debris(e.x, 1, e.z, { metal: true, n: 14, speed: 7, size: 0.3, trail: true });
        R.flashScreen(0.3, 0xffc890); R.addTrauma(0.7 * +settings.shake); R.shock(e.x, e.z, 1); R.pulse(e.x, e.z, 0xff5a3a, 34, 1.3, 2); R.stripFlash(0xff3a2a, 1.4);
        if (live) {
          if (mine(e)) { rumble(1, 1, 520); slowmo(0.4, 0.6); }
          if (G.mode === 'demo') R.frameShot([[e.x, e.z], [e.fx ?? e.x, e.fz ?? e.z]], 1.2);
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'death' };
          if (W.lives === 1 && !G.lastLife) { G.lastLife = true; say('lastlife', { chance: 0.8, delay: 2.4 }); }
          caption(`HIT BY ${({ bolt: 'A BOLT', arc: 'AN ARC', ring: 'A STOMP', pool: 'MOLTEN METAL', beam: 'THE BEAM', boss: 'THE BOSS', orb: 'A SHIELD ORB', surge: 'A POWER SURGE', spill: 'MOLTEN METAL', laser: 'A LASER GATE', storm: 'LIGHTNING' })[e.cause] || 'A ' + String(e.cause).toUpperCase()}`, 2.2);
        }
        break;
      }
      case 'spawn': A.play('spawn', { x: e.x, y: 1, z: e.z, vol: 0.8 }); R.pulse(e.x, e.z, 0x9fd8ff, F.clearR * 1.6, 0.7, 2); fx.ring(e.x, 0, e.z, F.clearR, 0x9fd8ff); R.shock(e.x, e.z, 0.8); fx.sparks(e.x, 1, e.z, { n: 20, speed: 5, r: 0.6, g: 0.9, b: 1 }); break;
      // (no extra warning chirp: the glowing gate and its hum are the warning)
      case 'portal': A.play('portal', { x: e.x, y: 1, z: e.z, vol: e.type === 'dummy' ? 0.4 : 0.55, gap: 0.15 }); break;
      case 'enter': A.play('enter', { x: e.x, y: 1, z: e.z, vol: 0.6, gap: 0.08 }); fx.glow(e.x, e.z, 2.6 + Math.min(6, e.n || 1) * 0.35, 0xff5a3a, 0.45, 1.1); fx.ring(e.x, 0, e.z, 2.2, 0xff6a4a); fx.sparks(e.x, 1, e.z, { n: 10, speed: 4, r: 1, g: 0.4, b: 0.3 }); break;
      case 'aim': A.play('spitcharge', { x: e.x, y: 1, z: e.z, vol: 0.4, gap: 0.12 }); break;
      case 'surgetell': A.play('crawl', { vol: 1, rate: 0.7, gap: 1 }); A.play('alarm', { vol: 0.3, rate: 1.2, gap: 1 }); if (live && !W.demo) caption('THE SWARM IS GATHERING', 1.4); break;
      case 'surgego': A.play('crawl', { vol: 1, rate: 1.15, gap: 1 }); R.addTrauma(0.12); if (me) R.pulse(me.x, me.z, 0xff3a2a, 2, 0.8, 1.6, 24); break;
      case 'bolt': A.play('spitfire', { x: e.x, y: 1, z: e.z, vol: 0.5, gap: 0.05 }); break;
      case 'hivetell': A.play('hivetell', { x: e.x, y: 1, z: e.z, vol: 0.45, gap: 0.5 }); break;
      case 'dart': A.play('hivespawn', { x: e.x, y: 1, z: e.z, vol: 0.4, gap: 0.2 }); break;
      case 'dartpop': fx.sparks(e.x, 0.9, e.z, { n: 6, speed: 3, r: 0.8, g: 0.5, b: 1 }); break;
      case 'arctell': break;
      case 'arcon': A.play('arcon', { x: e.x, y: 1.5, z: e.z, vol: 0.6, gap: 0.2 }); break;
      case 'wave':
        if (live) {
          if (e.boss) banner('WARNING', `${BOSSES[W.boss ? W.boss.key : (W.mode === 'campaign' ? SECTORS[W.sector].boss : 'foreman')].name} IS COMING`, 2.6);
          else banner(e.label, W.mode === 'stand' ? (W.k !== R.lookI ? SECTORS[W.k].name : 'HOLD THE LINE') : `${W.R.count + Math.round(W.R.horde || 0)} MACHINES · ${W.survivors.length} SURVIVORS`, 2);
          A.play('wave', { vol: 0.7, gap: 0 });
          R.pulse(me ? me.x : 0, me ? me.z : 0, e.boss ? 0xff3a2a : R.look.accent, 46, 1.5, 1.5);
          if (W.mode === 'campaign' && W.wave === 2 && !e.boss) say('halfway', { chance: 0.4, delay: 1.2 });
        }
        break;
      case 'waveclear':
        A.play('waveclear', { vol: 0.85, gap: 0 });
        R.pulse(me ? me.x : 0, me ? me.z : 0, 0x7dff9a, 46, 1.1, 2); R.stripFlash(0x9dffb4, 1.3);
        if (live && G.mode !== 'online' && !CALM.on) slowmo(0.4, 0.28);
        if (live) { banner(`${e.label} CLEAR`, `+${e.bonus.toLocaleString()}${e.evac ? ` · ${e.evac} SURVIVOR${e.evac > 1 ? 'S' : ''} WALKED OUT` : ''}`, 1.8); }
        break;
      case 'tut': if (live) tutorial(e.key); break;
      case 'block': A.play('block', { x: e.x, y: 1, z: e.z, vol: 0.45, gap: 0.06 }); R.fx.sparks(e.x, 1.1, e.z, { n: 5, speed: 6, r: 0.6, g: 0.9, b: 1, life: 0.25 }); break;
      case 'shieldbreak': A.play('boomS', { x: e.x, y: 1, z: e.z, vol: 0.8, gap: 0 }); R.fx.debris(e.x, 1, e.z, { metal: true, n: 12, speed: 6, size: 0.3 }); R.fx.sparks(e.x, 1, e.z, { n: 20, speed: 7, r: 0.6, g: 0.9, b: 1 }); if (live) popup('SHIELD BROKEN', e.x, e.z, '#9fe8ff'); break;
      case 'leaptell': A.play('spitcharge', { x: e.x, y: 0.6, z: e.z, vol: 0.45, rate: 0.6, gap: 0.2 }); break;
      case 'leap': A.play('leap', { x: e.x, y: 1, z: e.z, vol: 0.7, gap: 0.08 }); R.fx.dust(e.x, 0.1, e.z, { n: 6, s0: 0.4, s1: 1.4, life: 1.2, a: 0.35 }); break;
      case 'leapland': A.play('stomp', { x: e.x, y: 0, z: e.z, vol: 0.55, rate: 1.5, gap: 0.08 }); R.fx.ring(e.x, 0, e.z, e.r * 1.6, 0xffa020); R.fx.dust(e.x, 0.1, e.z, { n: 12, s0: 0.6, s1: 2, life: 1.6, spread: 1.2, jit: 2.5, a: 0.4 }); R.shock(e.x, e.z, 0.5); R.addTrauma(0.12 * +settings.shake); break;
      case 'reveal': A.play('reveal', { x: e.x, y: 1.2, z: e.z, vol: 0.9, gap: 0 }); R.fx.sparks(e.x, 1.2, e.z, { n: 16, speed: 5, r: 1, g: 0.3, b: 0.2 }); R.fx.debris(e.x, 1, e.z, { n: 6, speed: 4, size: 0.12 }); if (live) popup('MIMIC!', e.x, e.z, '#ff5a4a', true); break;
      case 'streak': if (live && e.mul === 1.5 && !G.tutStreak) { G.tutStreak = 1; tutorial('streak'); }
        if (e.mul >= 2) { R.pulse(e.x, e.z, 0xffb347, 9 + e.mul * 3, 0.55, 0.9 + e.mul * 0.25); if (e.mul >= 3) R.stripFlash(0xffc24a, 0.5 + e.mul * 0.12); }
        if (live) { A.play('upgrade', { vol: 0.5, rate: 0.8 + e.mul * 0.04, gap: 0 }); if (e.mul >= 2) popup(`×${e.mul} STREAK`, e.x, e.z, '#ffb347', true); if (e.mul >= 3) rumble(0.2, 0.3, 90); }
        break;
      case 'streakend': if (live && e.why === 'hit') caption(`STREAK BROKEN · ${e.n} IN A ROW`, 1.6); break;
      case 'hazwarn': if (live) A.play('hazwarn', { vol: 0.45, gap: 0.5 }); break;
      case 'hazard':
        if (e.style === 'surge') { A.play('surge', { x: e.x, y: 0.5, z: e.z, vol: 0.9, gap: 0.1 }); R.flashScreen(0.08, 0x9fe8ff); }
        else if (e.style === 'laser') A.play('laser', { x: e.x, y: 1, z: e.z, vol: 0.75, gap: 0.1 });
        else if (e.style === 'storm') { A.play('thunder', { x: e.x, y: 3, z: e.z, vol: 0.9, gap: 0.08 }); R.fx.flash(e.x, 3, e.z, 60, 0xc8d4ff, 0.25); R.fx.sparks(e.x, 0.3, e.z, { n: 18, speed: 7, r: 0.7, g: 0.8, b: 1 }); R.fx.ring(e.x, 0, e.z, 3, 0xa8b8ff); R.addTrauma(0.15 * +settings.shake); R.shock(e.x, e.z, 0.6); }
        break;
      case 'drop': A.play('drop', { x: e.x, y: 1, z: e.z, vol: 0.6, gap: 0.1 }); R.fx.ring(e.x, 0, e.z, 2, POWERUPS[e.kind].color); R.fx.sparks(e.x, 1, e.z, { n: 10, speed: 3, vy: 2, life: 0.6 }); break;
      case 'pickup': {
        const P = POWERUPS[e.kind];
        A.play(e.kind === 'warp' ? 'warp' : 'pickup', { x: e.x, y: 1, z: e.z, vol: 0.9, gap: 0 });
        R.fx.ring(e.x, 0, e.z, 3, P.color); R.fx.sparks(e.x, 1.2, e.z, { n: 24, speed: 5, vy: 2, life: 0.7 }); R.fx.flash(e.x, 1, e.z, 14, P.color, 0.3); R.fx.glow(e.x, e.z, 4.5, P.color, 0.6, 1.3); R.pulse(e.x, e.z, P.color, 12, 0.5, 1.3);
        if (live) { popup(P.name, e.x, e.z, '#' + P.color.toString(16).padStart(6, '0'), true); if (mine(e)) rumble(0.2, 0.4, 120); }
        break;
      }
      case 'pwend': if (live && mine(e)) A.play('pwend', { vol: 0.5, gap: 0.2 }); break;
      case 'pickgone': R.fx.sparks(e.x, 1, e.z, { n: 8, speed: 2, life: 0.4 }); break;
      case 'dfire': A.play('gun', { x: e.x, y: 1.8, z: e.z, vol: 0.14, gap: 0.05, rate: 1.5 }); break;
      case 'bosswarn': A.play('alarm', { vol: 0.7, gap: 0 }); break;
      case 'bossin':
        A.play('bossroar', { vol: 0.9, delay: 0.8, gap: 0 });
        A.playMusic('boss', 1);
        if (live) say('boss', { key: true, delay: 0.5 });
        break;
      case 'bosstell': {
        const loud = e.kind === 'charge' || e.kind === 'stomp' || e.kind === 'sweep';
        A.play(loud ? 'bosscharge' : 'spitcharge', { x: e.x, y: 2, z: e.z, vol: loud ? 0.7 : 0.5, gap: 0.3, rate: loud ? 1 : 0.7 });
        if (live && G.mode === 'demo') caption(`${BOSSES[e.key].name} · ${({ stomp: 'STOMP: GET OUT OF THE RING', charge: 'CHARGE: LEAVE THE LANE', fan: 'BOLT FAN', spiral: 'SPIRAL OF BOLTS', pools: 'MOLTEN POOLS', sweep: 'SWEEPING BEAM', summon: 'CALLING THE SWARM' })[e.kind]}`, 2);
        break;
      }
      case 'bosshit': A.play('bosshit', { x: e.x, y: 2, z: e.z, vol: 0.5, gap: 0.05 }); fx.sparks(e.x, 2, e.z, { n: 6, speed: 5 }); break;
      case 'orbdown': A.play('boomS', { x: e.x, y: 1.6, z: e.z, vol: 0.9, gap: 0 }); fx.explode(e.x, 1.6, e.z, 1.4, { metal: true, rock: false, color: 0x3fb8ff }); if (live) caption(e.left ? `SHIELD ORB DOWN · ${e.left} LEFT` : 'SHIELD DOWN · HIT THE CORE', 2); break;
      case 'stomp': A.play('stomp', { x: e.x, y: 0, z: e.z, vol: 1, gap: 0 }); fx.ring(e.x, 0, e.z, e.r, 0xff7a4a); R.shock(e.x, e.z, 1.4); R.addTrauma(0.45 * +settings.shake); fx.dust(e.x, 0.1, e.z, { n: 24, s0: 1, s1: 4, life: 3, spread: e.r, jit: 4, a: 0.4 }); if (live) rumble(0.7, 0.5, 300); break;
      case 'bossfire': A.play('spitfire', { x: e.x, y: 2, z: e.z, vol: 0.7, rate: 0.75, gap: 0.08 }); break;
      case 'charge': A.play('bossroar', { x: e.x, y: 1, z: e.z, vol: 0.7, rate: 1.3, gap: 0 }); break;
      case 'slam': A.play('slam', { x: e.x, y: 1, z: e.z, vol: 1, gap: 0 }); R.addTrauma(0.5 * +settings.shake); R.shock(e.x, e.z, 1); fx.sparks(e.x, 1, e.z, { n: 30, speed: 8 }); fx.dust(e.x, 0.2, e.z, { n: 16, s0: 1, s1: 3.5, life: 3, jit: 3, a: 0.45 }); if (live) caption('STUNNED · HIT IT NOW FOR DOUBLE DAMAGE', 2); break;
      case 'beam': A.play('beam', { x: e.x, y: 2, z: e.z, vol: 0.9, gap: 0 }); break;
      case 'hazard': if (e.kind === 'pool') { A.play('molten', { x: e.x, y: 0, z: e.z, vol: 0.6, gap: 0.1 }); fx.fire(e.x, 0.2, e.z, { n: 8, sp: e.r * 1.4, s: 1.2 }); } break;
      case 'bossphase': A.play('bossroar', { vol: 1, gap: 0 }); R.addTrauma(0.3 * +settings.shake); if (live) caption(`${BOSSES[e.key].name} IS ANGRY`, 2.5); break;
      case 'bossdying': A.play('boomL', { x: e.x, y: 2, z: e.z, vol: 1, gap: 0 }); slowmo(0.4, 1.2); R.addTrauma(0.5 * +settings.shake); R.frameShot([[e.x, e.z]], 2.2); if (live) rumble(0.8, 0.8, 700); break;
      case 'bosskill':
        R.breakBoss();
        A.play('boomL', { x: e.x, y: 2, z: e.z, vol: 1, rate: 0.85, gap: 0 });
        fx.explode(e.x, 2, e.z, 4, { metal: true }); fx.explode(e.x + 1.5, 3, e.z, 3, { metal: true, rock: false }); fx.debris(e.x, 2, e.z, { metal: true, n: 30, speed: 10, size: 0.5, trail: true });
        R.flashScreen(0.4, 0xffd0a0); R.addTrauma(0.8 * +settings.shake); R.shock(e.x, e.z, 2); R.pulse(e.x, e.z, 0xffd27a, 50, 1.6, 2.6);
        if (live) {
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'boss' };
          popup('+' + e.bonus.toLocaleString(), e.x, e.z, null, true);
          say('bossdown', { key: true, delay: 0.8 });
          if (W.mode === 'campaign') A.sting('clear'); else setTimeout(() => { if (G.W === W) A.playMusic(SECTORS[W.k].music); }, 2500);
        }
        break;
      case 'life': if (live) { A.play('life', { vol: 0.9, gap: 0 }); caption('+1 WARDEN', 2.5); } break;
      case 'over': break;
    }
  }
}
// AIM ASSIST (sticks and arrow keys, never the mouse): bend the aim toward the best machine inside a
// narrow cone, with lead. LIGHT pulls most of the way, STRONG locks on.
function assistAim(W, p, I) {
  if (!I.fire || I.src === 'mouse' || I.src === 'none' || settings.assist === 'off' || !(I.ax || I.az)) return;
  const strong = settings.assist === 'strong', cone = strong ? 0.5 : 0.3, pull = strong ? 1 : 0.65;
  const a0 = Math.atan2(I.az, I.ax);
  let best = null, bs = 1e9;
  const consider = (x, z, vx, vz, r) => {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d > 16 || d < 0.3) return;
    const da = Math.abs(angDiff(a0, Math.atan2(z - p.z, x - p.x)));
    if (da > cone + Math.atan(r / d)) return;
    const sc = da * 8 + d * 0.12;
    if (sc < bs) { bs = sc; best = { x, z, vx, vz, d }; }
  };
  for (const e of W.enemies) if (e.hp > 0 && !e.hidden && e.lp !== 2 && e.born <= 0.2 && e.type !== 'dummy') consider(e.x, e.z, e.vx, e.vz, e.r);
  const B = W.boss;
  if (B && B.state !== 'in' && B.state !== 'dying') { const orbs = B.orbs.filter((o) => o.hp > 0); if (orbs.length) for (const o of orbs) consider(o.x, o.z, 0, 0, 0.6); else consider(B.x, B.z, 0, 0, B.r); }
  if (!best) return;
  const tt = best.d / F.shotV, aim = Math.atan2(best.z + best.vz * tt - p.z, best.x + best.vx * tt - p.x);
  const a = a0 + angDiff(a0, aim) * pull;
  I.ax = Math.cos(a); I.az = Math.sin(a);
}
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'OVERRUN', 'CO-OP'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (G.mode === 'daily') { A.sting(W.result === 'clear' ? 'clear' : 'over'); say(W.result === 'clear' ? 'bossdown' : 'gameover', { key: true, delay: 1 }); results(W, W.result === 'clear' ? 'DAILY CLEARED' : 'DAILY OVER', `${G.run.daily} · SECTOR ${W.sector + 1} · ${waveLabel(W)}`); return; }
  if (W.mode === 'stand') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'THE LINE BROKE', `${waveLabel(W)} · HELD ${fmtT(W.fightT)}`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT, k = bestKey(W.diff, s);
    if (!best[k] || t < best[k]) { best[k] = t; store('sb.best.v1', best); }
    reach = Math.max(reach, Math.min(4, s + 1)); store('sb.reach.v1', reach);
    const got = [];
    // medals count on Normal and harder
    const award = (id) => { if (W.diff !== 'easy' && !medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0) award(`s${s}clean`);
    if (W.stats.surv > 0 && W.stats.rescued / W.stats.surv >= 0.9) award(`s${s}save`);
    if (t <= parTime(s)) award(`s${s}par`);
    store('sb.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1;
    G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
    G.run.lastTime = t; G.run.got = got;
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'THE CITY IS YOURS', 'ALL FIVE SECTORS CLEARED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  results(W, 'OVERRUN', `SECTOR ${s + 1} · ${SECTORS[s].name} · ${waveLabel(W)}`);
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
  $('up-sub').textContent = `RANK ${rankOf(W).g} · ${fmtT(G.run.lastTime)} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR SUIT'}`;
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
// a letter grade for the run: rescues count most, then Wardens kept, the best streak and accuracy
function rankOf(W) {
  const s = W.stats, resc = s.surv ? s.rescued / s.surv : 1, acc = s.shots ? Math.min(1, s.hits / s.shots) : 0;
  const pts = 35 * resc + 30 * Math.max(0, 1 - s.deaths / 4) + 20 * Math.min(1, (s.bestStreak || 0) / 36) + 15 * Math.min(1, acc / 0.5);
  const g = pts >= 88 ? 'S' : pts >= 74 ? 'A' : pts >= 60 ? 'B' : pts >= 45 ? 'C' : 'D';
  return { g, pts: Math.round(pts), acc };
}
const RANK_COL = { S: '#ffd23f', A: '#7dff9a', B: '#8fe4ff', C: '#d7a6ff', D: '#ff8a80' };
function results(W, title, sub) {
  G.state = 'results'; setHud(false);
  $('res-title').textContent = title; $('res-sub').textContent = sub + ' · ' + DL(W.diff);
  const rk = rankOf(W);
  $('res-rank').innerHTML = `<i style="color:${RANK_COL[rk.g]};border-color:${RANK_COL[rk.g]}">${rk.g}</i><span>RANK<b>${rk.pts} / 100</b></span>`;
  const st = [['SCORE', W.score.toLocaleString()]];
  if (W.mode === 'stand') st.push(['WAVES HELD', W.waveN], ['TIME', fmtT(W.fightT)]);
  else st.push(['SECTOR TIME', fmtT(W.secT)]);
  st.push(['BEST STREAK', `${W.stats.bestStreak || 0} (×${streakMul(W.stats.bestStreak || 0)})`]);
  st.push(['MACHINES SCRAPPED', W.stats.kills], ['SURVIVORS RESCUED', `${W.stats.rescued} / ${W.stats.surv}`], ['ACCURACY', Math.round(rk.acc * 100) + '%'], ['WARDENS LOST', W.stats.deaths]);
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · S${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The boss going down' : 'The last hit, exactly as it happened';
  const board = boardOf(G.mode === 'daily' ? 'daily' : W.mode, W.diff);
  G.board = board; G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, level: W.mode === 'stand' ? W.waveN : W.sector + 1 };
    $('ini-wrap').classList.remove('hidden');
    renderIni();
  }
  show('results', false);
}
function renderIni() { const b = $('ini').children; for (let i = 0; i < 3; i++) { b[i].textContent = G.ini.chars[i]; b[i].className = i === G.ini.i ? 'cur' : ''; } }
async function finishResults() {
  if (G.ini) { const q = G.ini; G.ini = null; await G.board.submit(q.chars.join(''), q.score, q.level); }
  toTitle();
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
  $('pause-sub').textContent = G.W.mode === 'stand' ? `LAST STAND · ${waveLabel(G.W)}` : `SECTOR ${G.W.sector + 1} · ${waveLabel(G.W)}`;
  $('pause-replay').classList.toggle('hidden', !G.clip);
  show('pause', false);
}
function resume() { if (G.state === 'paused' || G.state === 'paused-online') { G.state = 'play'; A.muffle(false); hideScreens(); } }

// ------------------------------------------------------------------ online co-op
function netStatus(text, kind) {
  const el = $('net-status');
  if (text === 'waiting') { el.textContent = 'Waiting for your partner to join…'; el.className = ''; return; }
  el.textContent = text; el.className = kind === 'error' ? 'error' : '';
}
function netJoined(peer) {
  A.play('uiok', { gap: 0 });
  netStatus(`${peer.ini || 'A Warden'} is here.` + (NET.host ? ' Pick the route and start.' : ' Waiting for the host to start…'));
  $('net-go').classList.toggle('hidden', !NET.host);
  if (NET.host) setSel($('net-go'));
  say('partner', { key: true });
}
function netLeft(why) {
  if (G.mode === 'online' && G.state !== 'results') { caption(why === 'lost' ? 'CONNECTION LOST' : 'YOUR PARTNER LEFT', 4); setTimeout(() => { if (G.mode === 'online') toTitle(); }, 2500); }
  else netStatus(why === 'lost' ? 'Connection lost' : 'Your partner left', 'error');
}
function hostStart() {
  const route = settings.netRoute;
  const cfg = route === 'ls' ? { gm: 'stand', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] }, diff: settings.diff };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'stand' ? 'stand' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives: START_LIVES + 1 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives, noTut: true, diff: cfg.diff });
  NET.bind(W);
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  banner('CO-OP', cfg.gm === 'stand' ? 'LAST STAND' : SECTORS[cfg.sector || 0].name, 3);
}
window.__sb.online = { hostStart, startOnline };
window.__sb.scenic = scenic;   // (captures: show a sector on the title)

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'stand': A.play('uiok', { gap: 0 }); startStand(); break;
    case 'daily': A.play('uiok', { gap: 0 }); startDaily(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': buildSuits(); show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1); break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
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
// suits unlock with medals
function suitOf(key) { const s = SUITS.find((q) => q.key === key) || SUITS[0]; return medals.size >= s.medals ? s : SUITS[0]; }
function buildSuits() {
  $('suits').innerHTML = SUITS.map((s) => { const open = medals.size >= s.medals; return `<button data-v="${s.key}" ${open ? '' : 'disabled'} style="--sc:#${s.color.toString(16).padStart(6, '0')}">${open ? '' : '🔒'}${s.name}${open ? '' : ' · ' + s.medals}</button>`; }).join('');
}
function applySettings() {
  { const s = suitOf(settings.suit); if (!R.suit || R.suit.color !== s.color) { R.suit = { color: s.color, accent: s.accent }; for (const v of R.views.p.values()) R.scene.remove(v.g); R.views.p.clear(); } }
  R.view = settings.view === 'full' ? 'full' : 'close';
  if ($('diff-desc')) $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  if (G.state === 'title') $('title-best').textContent = `BEST ${Math.max(boardOf('campaign', settings.diff).best(), 0).toLocaleString()} · ${DL(settings.diff)}`;
  A.vol.music = settings.music / 100 * 0.8; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100; A.applyVolumes();
  if (settings.talk === 'off') A.hush();
  applyCalm();
  if (G.state === 'play') setHud(true);
}
applySettings();
function cycleIni(d) { const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const c = G.ini.chars[G.ini.i]; G.ini.chars[G.ini.i] = C[(C.indexOf(c) + d + C.length) % C.length]; renderIni(); A.play('uimove', { gap: 0 }); }
function buildSectors() {
  $('secgrid').innerHTML = SECTORS.map((s, i) => {
    const open = i <= reach;
    const m = MEDALS.filter((q) => q.sector === i).map((q) => (medals.has(q.id) ? '★' : '☆')).join('');
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>SECTOR ${i + 1} · ${BOSSES[s.boss].name}</b><span>${s.name}</span><small>${open ? (best[bestKey(settings.diff, i)] ? 'BEST ' + fmtT(best[bestKey(settings.diff, i)]) + ' · ' + DL(settings.diff) : 'NOT CLEARED YET') : 'LOCKED'}</small><div class="md">${m}</div></button>`;
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
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${tab === 'stand' ? 'W' + (r.level || 0) : 'S' + (r.level || 1)}</td><td>${r.score.toLocaleString()}</td></tr>`;
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
  if (G.ini && G.screen === 'results') {
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
// touch stick visuals
I.stickUI = (side, s) => {
  const el = $('stick-' + side);
  if (!s) { el.classList.remove('on'); return; }
  el.classList.add('on');
  el.style.left = s.sx + 'px'; el.style.top = s.sy + 'px';
  const k = el.firstElementChild, dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy), m = Math.min(l, 52) / (l || 1);
  k.style.transform = `translate(${dx * m}px, ${dy * m}px)`;
};

// ------------------------------------------------------------------ edge markers
// anything that matters but is off screen (the CLOSE camera shows part of the arena) gets a marker at
// the screen edge: red for gates about to open, pink for a spitter aiming, orange for the boss, the
// power-up's colour for pods
const WM = [];
const PE = { x: 0, y: 0, z: 0 };
// the swarm surge: a red glow at the screen's edges that throbs while it gathers and holds while it rushes
let surgeShown = -1;
function surgeGlow(W) {
  const k = W.surgeTell > 0 ? 0.35 + 0.35 * Math.abs(Math.sin(W.t * 9)) : W.surgeOn > 0 ? Math.min(1, W.surgeOn / 0.8) * 0.6 : 0;
  const o = Math.round(k * (CALM.on ? 0.5 : 1) * 40) / 40;
  if (o !== surgeShown) { surgeShown = o; $('surgeglow').style.opacity = o; }
}
function updateWarnings(W) {
  const box = $('warns');
  const list = [];
  const me = myPlayer(W);
  if (me && me.alive && R.view === 'close' && G.mode !== 'demo') {
    for (const P of W.portals) if (P.types[0] !== 'pylon') list.push({ x: P.x, z: P.z, c: 'red', icon: '!', f: Math.min(1, P.t / P.T) });
    for (const e of W.enemies) if (e.type === 'spitter' && e.aimT > 0) list.push({ x: e.x, z: e.z, c: 'pink', icon: '⌖', f: 1 });
    for (const e of W.enemies) if (e.type === 'hive') list.push({ x: e.x, z: e.z, c: 'violet', icon: '⬢', f: 1 });
    if (W.boss && W.boss.state !== 'dying') list.push({ x: W.boss.x, z: W.boss.z, c: 'orange', icon: '☠', f: 1 });
    for (const q of W.pickups || []) list.push({ x: q.x, z: q.z, c: 'pw', col: '#' + POWERUPS[q.kind].color.toString(16).padStart(6, '0'), icon: POWERUPS[q.kind].glyph, f: q.life / 13 });
    for (const s of W.survivors) list.push({ x: s.x, z: s.z, c: 'green', icon: '✚', f: 1, minor: 1 });
    for (const e of W.enemies) if (e.hidden) list.push({ x: e.x, z: e.z, c: 'green', icon: '✚', f: 1, minor: 1 });   // mimics look the same off screen too
  }
  let n = 0;
  const vw = innerWidth, vh = innerHeight, top = 110, pad = 30;
  for (const q of list) {
    R.project(q.x, 1, q.z, PE);
    const on = PE.z < 1 && PE.x > pad && PE.x < vw - pad && PE.y > top && PE.y < vh - pad;
    if (on) continue;
    let d = WM[n];
    if (!d) { d = document.createElement('div'); box.appendChild(d); WM.push(d); }
    n++;
    // clamp the direction from the screen centre to the edge
    let dx = PE.x - vw / 2, dy = PE.y - vh / 2;
    if (PE.z > 1) { dx = -dx; dy = -dy; }
    const k = Math.min((vw / 2 - pad) / Math.max(1, Math.abs(dx)), (vh / 2 - pad - 40) / Math.max(1, Math.abs(dy)));
    const x = vw / 2 + dx * k, y = Math.max(top, vh / 2 + dy * k);
    d.className = 'wm ' + q.c + (q.minor ? ' minor' : '');
    d.style.display = '';
    d.style.left = x + 'px'; d.style.top = y + 'px';
    if (q.col) d.style.setProperty('--c', q.col);
    const html = `<em style="transform:rotate(${Math.atan2(dy, dx)}rad)"></em><b>${q.icon}</b>`;
    if (d._h !== html) { d.innerHTML = html; d._h = html; }
  }
  for (let i = n; i < WM.length; i++) WM[i].style.display = 'none';
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
function tickFrame(dt) {
  I.pollPads();
  perf(dt);
  if (G.slowT > 0) { G.slowT -= dt; if (G.slowT <= 0) { G.timeScale = 1; A.setRate(1); } }
  if (G.state === 'play' || G.state === 'paused-online') playStep(dt);
  else if (G.state === 'replay') replayStep(dt);
  else if (G.state === 'title' || (G.scenic && G.W === G.scenic)) scenicStep(dt);
  const cur = G.state === 'replay' && G.replay ? G.replay.W : G.W;
  if (!cur) return;
  if (cur.k !== R.lookI) R.setLook(cur.k);
  R.sync(cur, dt);
  const me = myPlayer(cur);
  const menu = G.state === 'title' || ['sectors', 'online', 'scores', 'medals', 'options', 'help'].includes(G.screen) && G.mode === 'title';
  R.updateCamera(dt, { me: me && me.alive ? me : null, cine: menu, shake: +settings.shake });
  A.setListener(R.camera);
  if (G.state === 'play' || G.state === 'paused-online' || G.state === 'replay') loops(cur, dt);
  R.render(dt, { warp: cur.warp > 0 && G.state !== 'title' });
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
      else { me.input = G.state === 'play' ? I.control(me.x, me.z) : { mx: 0, mz: 0, ax: 0, az: 0, fire: false, pulse: false }; assistAim(W, me, me.input); }
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (guest) ev = ev.filter((e) => e.pid === 2 && ['fire', 'shield', 'death', 'pulse'].includes(e.k));
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
  surgeGlow(W);
  if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 95) W.over = true; }
  if (G.mode === 'demo' || G.mode === 'playthrough') demoCaptions(W, dt);
  if (W.over && (G.state === 'play' || G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => onWorldOver(W), G.mode === 'demo' ? 1500 : 1300); }
}
function replayStep(dt) {
  const Rp = G.replay;
  const near = Math.abs(Rp.toKey) < 0.7;
  A.setRate(near ? 0.7 : 1);
  const ev = Rp.advance(dt * (near ? 0.35 : 1));
  handleEvents(ev, Rp.W, false);
  // follow the Warden in the replay, closer than the game view
  const p = Rp.W.players[0];
  if (p && !R.shot) R.frameShot([[p.x, p.z]], 0.2);
  else if (p && R.shot) { R.shot.pts = [[p.alive ? p.x : R.shot.pts[0][0], p.alive ? p.z : R.shot.pts[0][1]]]; R.shot.t = 0.3; }
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  if (!W) return;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  if (W.phase === 'clear' || W.over) scenic(R.lookI);
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 20)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// what the autopilot is up to, now and then
function demoCaptions(W, dt) {
  G.capCool = (G.capCool || 0) - dt;
  if (G.capCool > 0 || !G.ai) return;
  const d = G.ai.debug, me = W.players[0];
  let text = null;
  if (W.boss && W.boss.state !== 'in') text = W.boss.orbs.some((o) => o.hp > 0) ? `AUTOPILOT · breaking ${BOSSES[W.boss.key].name}'s shield orbs first` : `AUTOPILOT · keeping ${BOSSES[W.boss.key].name} at arm's length, firing into the core`;
  else if (d.mode === 'rescue') text = `AUTOPILOT · going for a survivor ${d.surv.toFixed(0)} m away${W.chain ? ` (chain ×${W.chain})` : ''}`;
  else if (d.mode === 'evade') text = 'AUTOPILOT · slipping out of a crowd';
  else if (d.crowd >= 3 && me.pulses) text = 'AUTOPILOT · surrounded: PULSE ready';
  if (text) { caption(text, 2.6); G.capCool = 6.5; }
}
// machine hums: the nearest crawler crowd, hauler, dart and live arc
function loops(W, dt) {
  const me = myPlayer(W) || W.players[0];
  let cr = 0, cx = 0, cz = 0, br = null, bd = 1e9, da = null, dd = 1e9, arc = null;
  for (const e of W.enemies) {
    if (e.hp <= 0) continue;
    const d = Math.hypot(e.x - me.x, e.z - me.z);
    if (e.type === 'crawler' || e.type === 'shard') { if (d < 12) { cr++; cx += e.x; cz += e.z; } }
    else if (e.type === 'brute' && d < bd) { bd = d; br = e; }
    else if (e.type === 'dart' && d < dd) { dd = d; da = e; }
    else if (e.type === 'pylon' && e.arc === 2) arc = e;
  }
  A.setLoop('crawl', cr ? cx / cr : 0, 0.5, cr ? cz / cr : 0, Math.min(1, cr * 0.18), 1);
  A.setLoop('brute', br ? br.x : 0, 1, br ? br.z : 0, br ? 0.9 : 0, 1);
  A.setLoop('dart', da ? da.x : 0, 1, da ? da.z : 0, da ? 0.8 : 0, da ? 1 + Math.max(0, 6 - dd) * 0.04 : 1);
  A.setLoop('arc', arc ? arc.x : 0, 1.5, arc ? arc.z : 0, arc ? 0.8 : 0, 1);
  // servo footsteps
  for (const p of W.players) {
    if (!p.alive) continue;
    const ph = Math.floor(p.walk * 2.1 / Math.PI);
    if (G.stepPh[p.id] !== undefined && ph !== G.stepPh[p.id] && Math.hypot(p.vx, p.vz) > 1) A.play('step', { x: p.x, y: 0, z: p.z, vol: 0.22, gap: 0.12, vary: 0.15 });
    G.stepPh[p.id] = ph;
  }
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
  // every change rebuilds the render buffers (a hitch of its own), so change rarely: two slow windows in a
  // row to drop, four fast ones to recover, and never more than once every 8 seconds. Ignore windows
  // spoiled by a background tab or a single stall.
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
  boardOf('campaign', settings.diff).fresh(); boardOf('stand', settings.diff).fresh();
  if (params.has('test')) { const m = await import('./tests.js?v=13'); m.runTests(window.__sb); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (G.autopilot) { A.unlock(); if (params.has('stand')) startStand(); else startCampaign(+params.get('sector') || 0); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__sb, {
  tick: (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) tickFrame(dt); },
  startDemo, startCampaign, startStand, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings,
  get W() { return G.W; }, noPost: NO_POST, isBossWave, startDaily, dailyCfg,
});
boot();
