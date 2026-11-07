// Rimstorm 2026 — game flow, menus, HUD, commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, WEBS, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, AIM_MEDAL, TYPICAL_UP, START_LIVES, BOSSES, DIFFICULTY, DIFF_KEYS, POWERUPS, ENEMY, AI_SHOP, SALVAGE_MEDAL, salvageFor } from './config.js?v=5';
import { makeWorld, step, drainEvents, webLabel, isBossWeb, bossKey, cloneWorld } from './sim.js?v=5';
import { Autopilot } from './ai.js?v=5';
import { Renderer, pickQuality, CALM } from './render.js?v=5';
import { Audio } from './audio.js?v=5';
import { Input } from './input.js?v=5';
import { Scores, NO_POST } from './scores.js?v=5';
import { Recorder, Replay, worldSig } from './replay.js?v=5';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=5';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'rs.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', sens: '1' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
if (!DIFFICULTY[settings.diff]) settings.diff = 'normal';
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('rs.medals.v1', []));
const best = load('rs.best.v1', {});
const bestSc = load('rs.bestsc.v1', {});
let reach = load('rs.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input();
// global high-score boards: one per mode and difficulty
const BOARDS = {};
function boardOf(mode, diff = 'normal') {
  const key = 'rimstorm-2026' + (mode === 'endless' ? '-endless' : '') + (diff === 'normal' ? '' : '-' + diff);
  return BOARDS[key] || (BOARDS[key] = new Scores(key));
}
const HS = boardOf('campaign');
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), lastLife: false, boardTab: 'campaign', boardDiff: null,
};
window.__rs = { G, R, A, I, NET, REC, settings, VERSION };

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
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__rs.lines ||= []).push([t, name]); }
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
  // leaving the results some other way than FINISH / CONTINUE still keeps a qualifying score
  if (G.ini && G.screen === 'results') postScore();
  NET.close(); stopPlay();
  clearTimeout(G.ptT);
  G.state = 'title'; G.mode = 'title'; G.idleT = 0;
  I.playing = false; I.releaseLock();
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
  titleBoard(G.boardTab, G.boardDiff || settings.diff);
}
function scenic(look) {
  // the title shows a sector's web with a few enemies climbing
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 7 + look, web: 1, demo: true, lives: 99 });
  W.players[0].alive = false; W.players[0].deadT = -1e9;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
}
// the global board on the title screen, with tabs per mode and difficulty
async function titleBoard(tab, diff) {
  G.boardTab = tab; G.boardDiff = diff;
  for (const b of document.querySelectorAll('[data-tb]')) b.classList.toggle('on', b.dataset.tb === tab);
  for (const b of document.querySelectorAll('[data-td]')) b.classList.toggle('on', b.dataset.td === diff);
  const board = boardOf(tab, diff), el = $('tboard');
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${r.score.toLocaleString()}</td></tr>`;
  const L = board.local();
  el.innerHTML = '<tr><td></td><td>Loading the world board…</td></tr>';
  const g = await board.fresh();
  if (G.boardTab !== tab || G.boardDiff !== diff) return;
  if (g && g.length) el.innerHTML = g.slice(0, 6).map(row).join('');
  else if (L.length) el.innerHTML = `<tr><td></td><td colspan="2">${g ? 'No world scores yet' : 'Offline'} · this device:</td></tr>` + L.slice(0, 5).map(row).join('');
  else el.innerHTML = `<tr><td></td><td colspan="2">${g ? 'No scores yet: be the first' : 'Offline'}</td></tr>`;
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  A.stopLoops();
  G.replay = null; G.ai = null; G.timeScale = 1; A.setRate(1); R.shot = null;
  for (const id of ['letterbox', 'bossbar', 'tut', 'banner', 'caption']) $(id).classList.add('hidden');
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
function startCampaign(sector = 0, web = +params.get('web') || 0) {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 500 * sector : 0, start: sector, newMedals: [], diff: settings.diff, continues: 0 };
  say('begin', { key: true, delay: 0.8 });
  beginSector(sector, web);
}
function beginSector(s, web = 0, score = G.run.score) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score, web, demo: !!G.run.ai, diff: G.run.diff || 'normal' });
  G.run.sector = s; G.run.score0 = score; G.run.full = web === 0;
  G.run.check = { web, score };
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`SECTOR ${s + 1}`, `${SECTORS[s].name} · ${SECTORS[s].place.toUpperCase()}`, 3);
  if (s > 0) say('s' + (s + 1), { key: true, delay: 1.2 });
}
// AI PLAYTHROUGH: the demo autopilot plays the whole campaign, picks its own upgrades between sectors
// and retries a sector if it runs out of Rimrunners. Nothing it does counts for scores or medals.
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0, diff: 'normal' };
  beginSector(+params.get('sector') || 0, +params.get('web') || 0);
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
function startEndless() {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: {}, start: 0, newMedals: [], diff: settings.diff };
  G.mode = 'endless';
  enterPlay(makeWorld({ mode: 'endless', seed: newSeed(), diff: settings.diff }));
  banner('ENDLESS DESCENT', 'HOW DEEP CAN YOU GO', 3);
  say('endless', { key: true, delay: 0.8 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start late in the sector so the boss shows up within the minute, with upgrades fitted to show them off
  const up = { ...TYPICAL_UP[s], rate: Math.max(1, TYPICAL_UP[s].rate || 0), barrel: Math.max(1, TYPICAL_UP[s].barrel || 0), droid: 1 };
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, web: WEBS - 1, up, lives: 9 });
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now();
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · FITTED: ${UP_KEYS.filter((k) => up[k]).map((k) => UPGRADES[k].name).join(', ')}`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.lastLife = false; G.hintT = 0;
  if (!G.ai && G.autopilot && G.mode !== 'online') G.ai = new Autopilot(W.seed, 'demo');
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  I.playing = !G.ai;
  REC.reset();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  R.sync(W, 0.016);
  R.updateCamera(0.016, { W, snap: true });
  A.playMusic(SECTORS[W.k].music);
  A.loop('crackle', 'crackle', 0.4);
  buildStrip(W);
  G.idleT = 0;
  // know the world board before the run ends, so the initials entry only shows for a real top-10 score
  if (G.mode === 'campaign' || G.mode === 'endless') boardOf(W.mode, W.diff).fresh();
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
  const el = $('webstrip');
  const dl = W.diff !== 'normal' ? ' · ' + DL(W.diff) : '';
  if (W.mode === 'endless') { el.innerHTML = ''; $('sector-name').textContent = 'ENDLESS DESCENT' + dl; return; }
  el.innerHTML = Array.from({ length: WEBS }, (_, i) => `<b>${i + 1}</b>`).join('') + '<b class="boss">☠</b>';
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
  setText('hi-lbl', W.mode === 'endless' ? 'BEST DESCENT' : 'BEST');
  const me = myPlayer(W);
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - (me?.alive ? 1 : 0)))));
  setHTML('purges', me ? `<i class="full ${me.purges > 0 ? 'on' : ''}"></i>` + Array.from({ length: 1 + (W.up.purge || 0) }, (_, i) => `<i class="${i < me.partials ? 'on' : ''}"></i>`).join('') : '');
  setHTML('plates', me && (W.up.plate || 0) ? Array.from({ length: W.up.plate || 0 }, (_, i) => `<i class="${i < me.plate ? 'on' : ''}"></i>`).join('') : '');
  setText('hops', me && me.hops ? `HOP ×${me.hops}` : '');
  $('tb-purge').classList.toggle('empty', !me || (me.purges <= 0 && me.partials <= 0));
  $('tb-hop').classList.toggle('empty', !me || me.hops <= 0);
  const act = [];
  if (me) for (const k in me.pw) act.push([k, me.pw[k]]);
  const dr = W.droids.find((q) => me && q.pid === me.id);
  if (dr) act.push(['droid', dr.t]);
  setHTML('pw', act.map(([k, t]) => { const P = POWERUPS[k]; const T = P.time || F.droidT; return `<span style="--c:#${P.color.toString(16).padStart(6, '0')}"><b>${P.glyph}</b>${P.name}<i style="width:${Math.min(100, (t / T) * 100).toFixed(0)}%"></i></span>`; }).join(''));
  if (W.mode === 'endless') setText('timer', `${webLabel(W)} · ${fmtT(W.fightT)}`);
  else {
    setText('timer', `${webLabel(W)} · ${fmtT(W.secT)}`);
    const kids = $('webstrip').children;
    for (let i = 0; i < kids.length; i++) {
      const cls = i < W.web ? 'done' : i === W.web ? 'now' : '';
      const want = (i === kids.length - 1 ? 'boss ' : '') + cls;
      if (kids[i].className !== want) kids[i].className = want;
    }
  }
  const left = W.spawnQ.length + W.enemies.length;
  setText('chain', W.phase === 'dive' ? 'DIVE' : isBossWeb(W) ? '' : `${left} TO CLEAR`);
  const b = W.boss;
  $('bossbar').classList.toggle('hidden', !b || b.state === 'in');
  if (b) {
    let extra = '';
    if (b.heads.length && b.heads.some((h) => h.hp > 0)) extra = ` · HEADS ${b.heads.filter((h) => h.hp > 0).length}`;
    else if (b.segs && b.segs.some((x) => x > 0)) extra = ' · SHOOT THROUGH THE GAPS';
    else if (b.eye) extra = b.eye.open ? ' · THE EYE IS OPEN' : ' · WAIT FOR THE EYE';
    setText('boss-name', BOSSES[b.key].name + (b.phase > 1 ? ` · PHASE ${b.phase}` : '') + extra);
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
function popup(text, lane, d, color, big) {
  R.projectLane(lane, d, P, 1.6);
  if (P.z > 1) return;
  const el = document.createElement('div');
  el.className = 'pop' + (big ? ' big' : ''); el.textContent = text; el.style.left = P.x + 'px'; el.style.top = P.y + 'px';
  if (color) el.style.color = color;
  const box = $('popups');
  while (box.children.length >= 4) box.firstChild.remove();
  box.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    move: { key: '<kbd>A</kbd> <kbd>D</kbd> or <kbd>←</kbd> <kbd>→</kbd> (or move the mouse)', pad: 'the left stick', touch: 'a thumb dragged left and right' },
    fire: { key: '<kbd>SPACE</kbd> or the left button', pad: '<kbd>A</kbd> or <kbd>RT</kbd>', touch: 'your thumb on the screen (it fires while it is down)' },
    purge: { key: '<kbd>X</kbd> or the right button', pad: '<kbd>B</kbd> or <kbd>LB</kbd>', touch: 'the <kbd>PURGE</kbd> button' },
    hop: { key: '<kbd>W</kbd> or <kbd>↑</kbd>', pad: '<kbd>X</kbd> or <kbd>RB</kbd>', touch: 'the <kbd>HOP</kbd> button' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  controls: () => `Slide along the rim with ${keyName('move')} and fire down your lane with ${keyName('fire')}. Enemies climb toward you from the far end. <b>PURGE</b> (${keyName('purge')}) wipes the web once per web.`,
  rim: () => `An enemy reached the <b>RIM</b>: it hunts you along the edge. When your lane flares <b>RED</b> it is about to <b>POUNCE</b> onto you: slide away or get into its lane and shoot it first.`,
  dive: () => `<b>DIVE!</b> You fly down the tube to the next web. Crystal <b>SPINES</b> left in a lane will wreck you: shoot them away or slide out of their lane.`,
  lancer: () => `A <b>LANCER</b>. Its lance glows, then it fires a slow bolt up its lane: shoot the bolt down or slide aside.`,
  spinewright: () => `A <b>SPINEWRIGHT</b> lays a crystal spine as it climbs. Chip it down before the dive, or remember which lane it is in.`,
  mite: () => `An <b>ARC MITE</b> crackles along the lane borders: you can only hit it as it crosses into a lane. Twin shot hits the borders too.`,
  shocker: () => `A <b>SHOCKER</b>. When a lane glows blue it is about to be electrified: get out of it.`,
  mirror: () => `A <b>MIRROR</b> sends your first shot back up the lane: shoot the reflection down too.`,
  pickup: () => `A <b>POD</b>! It floats up its lane: be in that lane when it reaches the rim to catch it.`,
  hop: () => `<b>HOP</b> with ${keyName('hop')}: jump clear of the rim over a grab, a bolt or a strike.`,
};
// each tip shows ONCE: the seen ones are kept on this device (rs.tips.v1), so a new sector, a new run or a
// checkpoint CONTINUE (each one a fresh world) never brings them back over the play area. The control hint
// (10 s) shows once per visit at the start of sector 1. HARD and NIGHTMARE show no enemy tips at all.
const tipsSeen = new Set(load('rs.tips.v1', []));
const tipsNow = new Set();
function tutorial(key, t = 6.5) {
  if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return;
  if (key === 'controls') { if (tipsNow.has(key)) return; tipsNow.add(key); }
  else {
    const W = G.W;
    if (tipsSeen.has(key) || (W && (W.diff === 'hard' || W.diff === 'nightmare'))) return;
    tipsSeen.add(key); store('rs.tips.v1', [...tipsSeen]);
  }
  const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = t;
}

// ------------------------------------------------------------------ events from the simulation
const CAUSE = { grab: 'GRABBED AT THE RIM', bolt: 'HIT BY A BOLT', reflect: 'HIT BY YOUR OWN REFLECTED SHOT', arc: 'ZAPPED BY AN ARC MITE', shock: 'ELECTRIFIED LANE', sweep: 'CAUGHT IN THE SWEEP', lunge: 'THE HYDRA LUNGED', flare: 'FURNACE FLARE', beam: 'PRISM BEAM', pull: 'PULLED INTO THE STRIKE', spine: 'CRASHED INTO A SPINE', crush: 'CRUSHED BY THE SINGULARITY' };
function handleEvents(list, W, live) {
  const me = myPlayer(W);
  const mine = (e) => me && e.pid === me.id;
  const at = (lane, d, lift = 0.6) => { const w = R.worldAt(lane, d, lift); return { x: w.x, y: w.y, z: w.z }; };
  for (const e of list) {
    R.onEvent(e, W);
    switch (e.k) {
      case 'fire': {
        A.play('fire', { ...at(e.lane, e.d), vol: mine(e) ? 0.3 : 0.2, gap: 0.05, vary: 0.1 });
        const v = R.views.p.get(e.pid); if (v) v.recoil = 1;
        break;
      }
      case 'hit': A.play('hit', { ...at(e.lane, e.d), vol: 0.5, gap: 0.03 }); break;
      case 'kill': {
        const big = e.type === 'lancer' || e.type === 'shocker' || e.type === 'spinewright' || e.type === 'mirror';
        A.play(big ? 'boomM' : 'boomS', { ...at(e.lane, e.d), vol: big ? 0.85 : 0.6, gap: 0.03 });
        if (big) A.play('debris', { ...at(e.lane, e.d), vol: 0.3, delay: 0.2, gap: 0.2 });
        if (live && G.mode !== 'demo' && (e.rim || (big && e.d < 0.45))) popup(`+${e.pts}`, e.lane, e.d, e.rim ? '#ffd27a' : null);
        if (live && mine(e) && e.rim) rumble(0.25, 0.3, 90);
        break;
      }
      case 'reflect': A.play('reflect', { ...at(e.lane, e.d), vol: 0.7, gap: 0.05 }); if (live) popup('REFLECTED!', e.lane, e.d, '#ff5ad0'); break;
      case 'boltpop': A.play('boltpop', { ...at(e.lane, e.d), vol: 0.4, gap: 0.04 }); break;
      case 'bolt': A.play('bolt', { ...at(e.lane, e.d), vol: 0.45, gap: 0.06 }); break;
      case 'charge': A.play('charge', { ...at(e.lane, e.d), vol: 0.35, gap: 0.15 }); break;
      case 'tell': A.play('tell', { ...at(e.lane, 0.3), vol: 0.32, gap: 0.35 }); break;
      case 'zap': A.play(e.kind === 'flare' ? 'flare' : e.kind === 'beam' ? 'beam' : e.kind === 'sweep' ? 'sweep' : 'zap', { ...at(e.lane, 0.2), vol: 0.65, gap: 0.08 }); if (e.kind === 'lunge') A.play('lunge', { ...at(e.lane, 0.3), vol: 0.9, gap: 0.1 }); break;
      case 'crackle': A.play('zap', { ...at(e.lane, 0), vol: 0.35, gap: 0.3, rate: 1.4 }); break;
      case 'rim': A.play('rim', { ...at(e.lane, 0), vol: 0.35, gap: 0.25 }); break;
      case 'split': A.play('split', { ...at(e.lane, e.d), vol: 0.5, gap: 0.08 }); break;
      case 'emerge': A.play('emerge', { ...at(e.lane, 1), vol: 0.3, gap: 0.25 }); break;
      case 'spine': A.play('chip', { ...at(e.lane, e.d), vol: 0.4, gap: 0.2, rate: 0.7 }); break;
      case 'chip': A.play('chip', { ...at(e.lane, e.d), vol: e.gone ? 0.5 : 0.25, gap: 0.05, rate: e.gone ? 1.2 : 1.6 }); break;
      case 'grab': A.play('grab', { ...at(e.lane, 0), vol: 0.9, gap: 0 }); break;
      case 'arc': A.play('zap', { ...at(e.lane, 0), vol: 0.9, gap: 0 }); break;
      case 'death': {
        A.play('death', { ...at(e.lane, e.d), vol: 1, gap: 0 });
        if (live) {
          if (mine(e)) { rumble(1, 1, 520); slowmo(0.4, 0.6); caption(CAUSE[e.cause] || 'LOST A RIMRUNNER', 2.4); }
          if (G.mode === 'demo') { R.frameShot(e.lane, Math.max(0.05, e.d), 1.2); slowmo(0.35, 0.8); }
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'death', lane: e.lane, cause: e.cause, sig: worldSig(W) };
          if (W.lives === 1 && !G.lastLife) { G.lastLife = true; say('lastlife', { chance: 0.8, delay: 2.4 }); }
        }
        break;
      }
      case 'plate': A.play('plate', { ...at(e.lane, 0), vol: 0.9, gap: 0 }); if (live && mine(e)) { rumble(0.5, 0.6, 200); popup('PLATE SOAKED IT', e.lane, 0.05, '#9fd8ff'); } break;
      case 'spawn': A.play('spawn', { ...at(e.lane, 0), vol: 0.7 }); break;
      case 'purge': A.play('purge', { ...at(e.lane, 0.2), vol: 1, gap: 0, rate: e.full ? 1 : 1.25 }); if (live) {
          rumble(0.7, 0.8, 300);
          // the demo slows down only for a purge that really clears a crowd, framed on the Rimrunner that fired it
          if (G.mode === 'demo' && list.filter((q) => q.k === 'kill' && q.by === 'purge').length >= 4) { R.frameShot(e.lane, 0.25, 0.9); slowmo(0.5, 0.6); }
        }
        break;
      case 'hop': A.play('hop', { ...at(e.lane, 0), vol: 0.7, gap: 0.1 }); break;
      case 'dodge': A.play('dodge', { vol: 0.5, gap: 0.1 }); if (live && mine(e) && me) popup('DODGED', me.lane, 0.05, '#d6a6ff'); break;
      case 'pod': A.play('pod', { ...at(e.lane, e.d), vol: 0.5, gap: 0.1 }); if (live) tutorial('pickup', 5); break;
      case 'pickup': {
        const Pw = POWERUPS[e.kind];
        A.play('pickup', { ...at(e.lane, 0), vol: 0.9, gap: 0 });
        if (live) { popup(Pw.name, e.lane, 0.05, '#' + Pw.color.toString(16).padStart(6, '0'), true); if (mine(e)) rumble(0.2, 0.4, 120); if (e.kind === 'hop' && mine(e)) tutorial('hop', 5); }
        break;
      }
      case 'pwend': if (live && mine(e)) A.play('pwend', { vol: 0.5, gap: 0.2 }); break;
      case 'web':
        if (live) {
          if (e.boss) banner('WARNING', `${BOSSES[bossKey(W)].name} IS RISING`, 2.6);
          else banner(e.label, (W.mode === 'endless' ? `${W.R.count} CLIMBERS · ${SECTORS[W.k].name}` : `${SECTORS[W.sector].name} · ${W.R.count} CLIMBERS`) + (W.def && W.def.rot ? ' · THE WEB TURNS' : '') + (W.def && W.def.breathe ? ' · THE WEB BREATHES' : ''), 1.8);
          A.play('web', { vol: 0.7, gap: 0 });
          if (G.run && W.mode === 'campaign') G.run.check = { web: W.web, score: W.score };
        }
        break;
      case 'webclear': A.play('webclear', { vol: 0.85, gap: 0 }); if (live) banner(`${webLabel(W)} CLEAR`, `+${e.bonus.toLocaleString()}${e.spines ? ` · ${e.spines} SPINE${e.spines > 1 ? 'S' : ''} AHEAD` : ' · CLEAN DIVE AHEAD'}`, 1.8); break;
      case 'dive': A.play('dive', { vol: 0.8, gap: 0 }); break;
      case 'diveclean': if (live) caption(`CLEAN DIVE +${e.pts}`, 1.6); break;
      case 'tut': if (live) tutorial(e.key, e.key === 'controls' ? 10 : 6.5); break;
      case 'bosswarn': A.play('alarm', { vol: 0.7, gap: 0 }); break;
      case 'bossin':
        A.play('bossin', { vol: 0.9, delay: 0.6, gap: 0 });
        A.playMusic('boss', 1);
        if (live) say('boss', { key: true, delay: 0.5 });
        break;
      case 'bossfight': if (live && G.mode === 'demo') caption(`DEMO · ${BOSSES[e.key].name}: the autopilot hunts the openings`, 3); break;
      case 'bosshit': A.play('bosshit', { vol: 0.4, gap: 0.05 }); break;
      case 'clank': case 'refract': A.play('clank', { vol: 0.3, gap: 0.06 }); break;
      case 'seg': A.play('boomS', { vol: 0.7, gap: 0.05 }); if (live) rumble(0.2, 0.2, 80); break;
      case 'headdown': A.play('boomM', { vol: 0.9, gap: 0 }); if (live) caption('A HEAD IS DOWN', 1.5); break;
      case 'regrow': if (live) caption('THE HEADS GROW BACK', 1.8); break;
      case 'eyeopen': A.play('reflect', { vol: 0.5, gap: 0.2, rate: 0.7 }); break;
      case 'phase': A.play('phase', { vol: 1, gap: 0 }); R.trauma = Math.min(1, R.trauma + 0.3); if (live) caption(`${BOSSES[e.key].name} · PHASE ${e.phase}`, 2.5); break;
      case 'pull': A.play('pull', { vol: 0.8, gap: 0 }); if (live) caption('GRAVITY PULL: FIGHT IT', 2); break;
      case 'crush': A.play('crush', { vol: 1, gap: 0 }); if (live) rumble(1, 1, 500); break;
      case 'bosskill':
        A.play('boomL', { vol: 1, rate: 0.85, gap: 0 });
        slowmo(0.35, 1.3);
        R.frameShot(0, e.d, 2.2);
        if (live) {
          rumble(0.8, 0.8, 700);
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'boss', sig: worldSig(W) };
          banner(`${BOSSES[e.key].name} DESTROYED`, `+${e.pts.toLocaleString()}`, 2.6);
          say('bossdown', { key: true, delay: 0.8 });
          if (W.mode === 'campaign') A.sting('clear'); else setTimeout(() => { if (G.W === W) A.playMusic(SECTORS[W.k].music); }, 2500);
        }
        break;
      case 'life': if (live) { A.play('life', { vol: 0.9, gap: 0 }); caption('+1 RIMRUNNER', 2.5); } break;
      case 'over': break;
    }
  }
}
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops(); I.releaseLock();
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'THE WEB FELL', 'CO-OP'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (W.mode === 'endless') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'DESCENT OVER', `${webLabel(W)} · ${fmtT(W.fightT)} DOWN THE TUBES`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    // per-sector bests count only for a sector played from its first web
    const t = W.secT, k = bestKey(W.diff, s), pts = W.score - G.run.score0;
    if (G.run.full && (!best[k] || t < best[k])) { best[k] = t; store('rs.best.v1', best); }
    if (G.run.full && (!bestSc[k] || pts > bestSc[k])) { bestSc[k] = pts; store('rs.bestsc.v1', bestSc); }
    reach = Math.max(reach, Math.min(4, s + 1)); store('rs.reach.v1', reach);
    const got = [];
    const award = (id) => { if (W.diff !== 'easy' && !medals.has(id) && !G.run.continues && G.run.full) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0) award(`s${s}clean`);
    if (W.stats.shots > 30 && W.stats.hits / W.stats.shots >= AIM_MEDAL) award(`s${s}aim`);
    if (t <= parTime(s)) award(`s${s}par`);
    store('rs.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1;
    G.run.earned = salvageFor(W.score - G.run.score0, got.length);
    G.run.salvage += G.run.earned;
    G.run.lastTime = t; G.run.got = got;
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'THE STORM IS BROKEN', 'ALL FIVE SECTORS CLEARED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  results(W, 'RIMRUNNER LOST', `SECTOR ${s + 1} · ${SECTORS[s].name} · ${webLabel(W)}`);
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
  G.run.earned = salvageFor(W.score - G.run.score0, 0);
  G.run.salvage += G.run.earned;
  G.run.lastTime = W.secT;
  if (s >= SECTORS.length - 1) {
    G.run.got = [];
    results(W, 'AI PLAYTHROUGH COMPLETE', `ALL FIVE SECTORS · ${G.run.tries ? G.run.tries + (G.run.tries > 1 ? ' RETRIES' : ' RETRY') : 'NO RETRIES'}`);
    return;
  }
  const bought = aiShop();
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${s + 1} CLEAR`;
  $('up-sub').textContent = `${fmtT(W.secT)} · +${G.run.earned.toLocaleString()} SALVAGE · AUTOPILOT BOUGHT: ${bought.length ? bought.join(', ') : 'NOTHING YET (SAVING UP)'}`;
  $('next-sub').textContent = `Sector ${s + 2} · ${SECTORS[s + 1].name} · starts in a moment`;
  renderUpgrades();
  show('upgrades', false);
  shopReplayBtn();
  // the autopilot's picks light up in the shop
  for (const el of document.querySelectorAll('#upgrid .upg')) if (bought.includes(UPGRADES[el.dataset.up].name)) el.classList.add('pick');
  A.play('upgrade', { gap: 0, vol: 0.7 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'playthrough' && G.state === 'upgrade') beginSector(s + 1, 0); }, 6000);
}
function upgrades(W) {
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${W.sector + 1} CLEAR`;
  const k = bestKey(W.diff, W.sector);
  const pb = G.run.full && best[k] === G.run.lastTime ? ' · NEW BEST TIME' : '';
  $('up-sub').textContent = `${fmtT(G.run.lastTime)}${pb} · +${G.run.earned.toLocaleString()} SALVAGE${G.run.got.length ? ' · MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') + ` (+${SALVAGE_MEDAL} EACH)` : ''}`;
  $('next-sub').textContent = `Sector ${W.sector + 2} · ${SECTORS[W.sector + 1].name}`;
  renderUpgrades();
  show('upgrades', false);
  shopReplayBtn();
  A.playMusic('title');
  say('clear', { key: true, delay: 1.5 });
}
function shopReplayBtn() {
  const btn = $('upgrades').querySelector('[data-act="replay"]');
  btn.classList.toggle('hidden', !G.clip);
  btn.querySelector('small').textContent = G.clip && G.clip.kind === 'boss' ? 'Watch the boss go down' : 'The last hit, exactly as it happened';
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
function results(W, title, sub) {
  G.state = 'results'; setHud(false);
  $('res-title').textContent = title; $('res-sub').textContent = sub + ' · ' + DL(W.diff);
  const st = [['SCORE', W.score.toLocaleString()]];
  if (W.mode === 'endless') st.push(['WEBS CLEARED', W.webN], ['TIME', fmtT(W.fightT)]);
  else st.push(['SECTOR TIME', fmtT(W.secT)]);
  st.push(['ENEMIES DESTROYED', W.stats.kills], ['ACCURACY', `${Math.round((100 * W.stats.hits) / Math.max(1, W.stats.shots))}%`], ['RIMRUNNERS LOST', W.stats.deaths], ['PURGES USED', W.stats.purges]);
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · S${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The boss going down' : 'The last hit, exactly as it happened';
  // checkpoint: carry on from the start of the web you fell on (the score goes back to that web's start)
  // online: the host can take the pair on to the next sector (or try the same one again)
  const netNext = G.mode === 'online' && NET.host && !!NET.peer;
  $('res-net').classList.toggle('hidden', !netNext);
  if (netNext) {
    const nx = netNextCfg(W);
    $('res-net').firstChild.textContent = nx.label;
    $('net-next-sub').textContent = nx.sub;
  }
  if (G.mode === 'online' && !NET.host) $('res-sub').textContent += NET.peer ? ' · WAITING FOR THE HOST' : '';
  const canCont = W.mode === 'campaign' && W.result !== 'clear' && G.mode === 'campaign' && G.run && G.run.check;
  $('res-cont').classList.toggle('hidden', !canCont);
  if (canCont) $('cont-sub').textContent = `${W.web >= WEBS ? 'The boss' : 'Web ' + (G.run.check.web + 1)} of sector ${W.sector + 1} with ${START_LIVES} Rimrunners, score back to ${G.run.check.score.toLocaleString()}`;
  const board = boardOf(W.mode, W.diff);
  G.board = board; G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    const level = W.mode === 'endless' ? W.webN : W.sector + 1;
    const extra = W.mode === 'endless' ? `W${W.webN}` : `S${W.sector + 1}${W.web >= WEBS ? 'B' : 'W' + (W.web + 1)}${W.result === 'clear' && W.sector === 4 ? ' DONE' : ''}${G.run && G.run.continues ? ' C' + G.run.continues : ''}`;
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, level, extra };
    $('ini-wrap').classList.remove('hidden');
    renderIni();
  }
  show('results', false);
}
function renderIni() { const b = $('ini').children; for (let i = 0; i < 3; i++) { b[i].textContent = G.ini.chars[i]; b[i].className = i === G.ini.i ? 'cur' : ''; } }
async function postScore() { if (G.ini) { const q = G.ini; G.ini = null; $('ini-wrap').classList.add('hidden'); await G.board.submit(q.chars.join(''), q.score, q.level, q.extra); } }
async function finishResults() { await postScore(); toTitle(); }
async function continueRun() {
  const W = G.W;
  await postScore();
  G.run.continues = (G.run.continues || 0) + 1;
  G.run.lives = START_LIVES + DIFFICULTY[G.run.diff].lives;
  A.play('uiok', { gap: 0 });
  beginSector(W.sector, G.run.check.web, G.run.check.score);
}

// ------------------------------------------------------------------ instant replay
function captureClip(W) {
  const p = G.pendingClip;
  if (!p || W.n < p.n + Math.round(1.6 / STEP)) return;
  G.pendingClip = null;
  const c = REC.clip(p.n);
  if (c) { c.kind = p.kind; c.sig = p.sig; G.clip = c; }
}
function playReplay() {
  if (!G.clip) return;
  G.afterReplay = { screen: G.screen, state: G.state };
  hideScreens();
  G.replay = new Replay(cloneWorld(G.clip.snap), G.clip.inputs, G.clip.keyN, G.clip.endN);
  // the replay re-runs the sim from a saved world: at the key tick it must equal the live world bit for bit
  G.replayExact = null;
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
  I.releaseLock();
  if (G.mode === 'online') { show('pause'); $('pause-sub').textContent = 'ONLINE · THE WEB KEEPS GOING'; G.state = 'paused-online'; return; }
  G.state = 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.W.mode === 'endless' ? `ENDLESS DESCENT · ${webLabel(G.W)}` : `SECTOR ${G.W.sector + 1} · ${webLabel(G.W)}`;
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
  netStatus(`${peer.ini || 'A Rimrunner'} is here.` + (NET.host ? ' Pick the route and start.' : ' Waiting for the host to start…'));
  $('net-go').classList.toggle('hidden', !NET.host);
  if (NET.host) setSel($('net-go'));
  say('partner', { key: true });
}
function netLeft(why) {
  const msg = why === 'lost' ? 'CONNECTION LOST' : 'YOUR PARTNER LEFT';
  if (G.mode === 'online' && G.state === 'results') { $('res-net').classList.add('hidden'); $('res-sub').textContent = `${msg} · ${DL(G.W.diff)}`; return; }
  // mid-sector: the run ends on the results screen (score, time, stats) instead of dropping to the title
  if (G.mode === 'online') {
    caption(msg, 4);
    const W = G.W;
    setTimeout(() => {
      if (G.mode !== 'online' || G.W !== W || !W) return;
      if (G.state === 'play' || G.state === 'paused-online') { G.state = 'ended'; A.stopLoops(); I.releaseLock(); results(W, msg, 'CO-OP · THE RUN ENDS HERE'); }
      else if (G.state !== 'results' && G.state !== 'ended') toTitle();
    }, 2500);
  }
  else { netStatus(why === 'lost' ? 'Connection lost' : 'Your partner left', 'error'); $('net-go').classList.add('hidden'); }
}
function hostStart() {
  const route = settings.netRoute;
  const cfg = route === 'en' ? { gm: 'endless', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] }, diff: settings.diff };
  NET.sendStart(cfg);
  startOnline(cfg);
}
// after a co-op sector: on to the next one (score and lives carried), or the same sector / descent again
function netNextCfg(W) {
  const diff = W.diff || 'normal';
  if (W.mode === 'endless') return { label: 'DESCEND AGAIN', sub: 'A fresh ENDLESS DESCENT for both of you', cfg: { gm: 'endless', seed: newSeed(), diff } };
  if (W.result === 'clear' && W.sector < SECTORS.length - 1) {
    const s = W.sector + 1;
    return { label: 'NEXT SECTOR', sub: `Sector ${s + 1} · ${SECTORS[s].name} · score and Rimrunners carried`, cfg: { gm: 'campaign', sector: s, seed: newSeed(), up: { ...TYPICAL_UP[s] }, diff, score: W.score, lives: W.lives + 1 } };
  }
  const s = W.result === 'clear' ? 0 : W.sector;
  return { label: W.result === 'clear' ? 'PLAY AGAIN' : 'RETRY THE SECTOR', sub: `Sector ${s + 1} · ${SECTORS[s].name} from its first web`, cfg: { gm: 'campaign', sector: s, seed: newSeed(), up: { ...TYPICAL_UP[s] }, diff } };
}
function netNext() {
  if (G.mode !== 'online' || !NET.host || !NET.peer || !G.W) return;
  const { cfg } = netNextCfg(G.W);
  A.play('uiok', { gap: 0 });
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const lives = cfg.lives > 0 ? Math.min(12, cfg.lives | 0) : START_LIVES + 1 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives;
  const W = makeWorld({ mode: cfg.gm === 'endless' ? 'endless' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives, score: Math.max(0, +cfg.score || 0), noTut: true, diff: cfg.diff });
  NET.bind(W);
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  I.playing = !G.ai;
  banner('CO-OP', cfg.gm === 'endless' ? 'ENDLESS DESCENT' : SECTORS[cfg.sector || 0].name, 3);
}
window.__rs.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(+params.get('sector') || 0); break;
    case 'endless': A.play('uiok', { gap: 0 }); startEndless(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1, 0); break;
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
    case 'net-next': netNext(); break;
    case 'net-back': NET.close(); goBack(); break;
  }
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act], [data-up], [data-sector], [data-tab], [data-hd], [data-tb], [data-td], .seg button');
  if (!t) return;
  A.unlock();
  if (t.dataset.act) act(t.dataset.act);
  else if (t.dataset.up) buy(t.dataset.up);
  else if (t.dataset.sector !== undefined) { if (!t.hasAttribute('disabled')) { A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sector, 0); } }
  else if (t.dataset.tab) renderScores(t.dataset.tab);
  else if (t.dataset.hd) renderScores(G.scoreTab || 'campaign', t.dataset.hd);
  else if (t.dataset.tb) titleBoard(t.dataset.tb, G.boardDiff || settings.diff);
  else if (t.dataset.td) titleBoard(G.boardTab, t.dataset.td);
  else if (t.parentElement.dataset.opt) { settings[t.parentElement.dataset.opt] = t.dataset.v; saveSettings(); applySettings(); syncSegs(); A.play('uimove', { gap: 0 }); if (t.parentElement.dataset.opt === 'diff' && G.state === 'title') titleBoard(G.boardTab, settings.diff); }
});
$('ini').addEventListener('click', (e) => { const b = e.target.closest('b'); if (!b || !G.ini) return; const i = [...$('ini').children].indexOf(b); if (G.ini.i === i) cycleIni(1); G.ini.i = i; renderIni(); });
for (const inp of document.querySelectorAll('[data-set]')) {
  inp.value = settings[inp.dataset.set];
  inp.addEventListener('input', () => { settings[inp.dataset.set] = +inp.value; saveSettings(); applySettings(); });
}
function syncSegs() { for (const s of document.querySelectorAll('.seg')) for (const b of s.children) b.classList.toggle('on', String(settings[s.dataset.opt]) === b.dataset.v); }
function applySettings() {
  if ($('diff-desc')) $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  if (G.state === 'title') $('title-best').textContent = `BEST ${Math.max(boardOf('campaign', settings.diff).best(), 0).toLocaleString()} · ${DL(settings.diff)}`;
  A.vol.music = settings.music / 100 * 0.8; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100; A.applyVolumes();
  if (settings.talk === 'off') A.hush();
  I.sens = +settings.sens || 1;
  applyCalm();
  if (G.state === 'play') setHud(true);
}
applySettings();
function cycleIni(d) { const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const c = G.ini.chars[G.ini.i]; G.ini.chars[G.ini.i] = C[(C.indexOf(c) + d + C.length) % C.length]; renderIni(); A.play('uimove', { gap: 0 }); }
function buildSectors() {
  $('secgrid').innerHTML = SECTORS.map((s, i) => {
    const open = i <= reach;
    const m = MEDALS.filter((q) => q.sector === i).map((q) => (medals.has(q.id) ? '★' : '☆')).join('');
    const k = bestKey(settings.diff, i);
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>SECTOR ${i + 1} · ${BOSSES[s.boss].name}</b><span>${s.name}</span><small>${open ? (best[k] ? `BEST ${fmtT(best[k])} · ${(bestSc[k] || 0).toLocaleString()} PTS · ${DL(settings.diff)}` : 'NOT CLEARED YET · ' + DL(settings.diff)) : 'LOCKED'}</small><div class="md">${m}</div></button>`;
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
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${tab === 'endless' ? 'W' + (r.level || 0) : 'S' + (r.level || 1)}</td><td>${r.score.toLocaleString()}</td></tr>`;
  const L = board.local();
  $('hs-local').innerHTML = L.length ? L.map(row).join('') : '<tr><td></td><td>No scores yet</td></tr>';
  $('hs-global').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => { const k = bestKey(diff, i); return `<div class="stat"><span>S${i + 1} · ${s.name}</span><b>${best[k] ? `${fmtT(best[k])} · ${(bestSc[k] || 0).toLocaleString()}` : '—'}</b></div>`; }).join('');
  const g = await board.fresh();
  if (G.scoreTab !== tab || G.scoreDiff !== diff) return;
  $('hs-global').innerHTML = g && g.length ? g.map(row).join('') : `<tr><td></td><td>${g ? 'No scores yet' : 'Offline'}</td></tr>`;
}

// keyboard / pad in menus and in play
I.on('any', () => { G.idleT = 0; if (G.mode === 'demo' && G.state === 'play' && performance.now() - G.demoStartT > 600) { A.unlock(); toTitle(); } });
// ESC / P / START never leave a run's results or the shop between sectors (a P in your initials, or a stray
// ESC, used to throw the score or the whole run away): only the buttons on those screens move on. The
// AI PLAYTHROUGH is the exception: ESC stops watching it anywhere.
const RUN_SCREENS = ['results', 'upgrades'];
const holdsRun = () => RUN_SCREENS.includes(G.screen) && G.mode !== 'playthrough';
I.on('pause', () => { if (G.state === 'play') pause(); else if (G.state === 'paused' || G.state === 'paused-online') resume(); else if (G.state === 'replay') endReplay(); else if (holdsRun()) return; else if (G.screen && G.screen !== 'title') act('back'); });
I.on('unlock', () => { if (G.state === 'play' && G.mode !== 'demo' && G.mode !== 'playthrough' && !G.fixed) pause(); });
I.on('confirm', () => { if (G.screen && selEl) selEl.click(); });
I.on('back', () => { if (G.screen && G.screen !== 'title' && G.screen !== 'results' && G.screen !== 'upgrades') act('back'); });
I.on('key', (k, e) => {
  A.unlock();
  // returning true means "used": Input then sends no pause for this key (a P typed into the initials stays a letter)
  if (G.state === 'replay' && (k === 'Enter' || k === 'Space' || k === 'Escape')) { endReplay(); return true; }
  if (G.ini && G.screen === 'results') {
    if (/^Key[A-Z]$/.test(k) || /^Digit[0-9]$/.test(k)) { G.ini.chars[G.ini.i] = k.slice(-1); G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); A.play('uimove', { gap: 0 }); return true; }
    if (k === 'ArrowUp') { cycleIni(1); return true; } if (k === 'ArrowDown') { cycleIni(-1); return true; }
    if (k === 'ArrowLeft') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return true; } if (k === 'ArrowRight') { G.ini.i = Math.min(2, G.ini.i + 1); renderIni(); return true; }
    if (k === 'Backspace') { G.ini.i = Math.max(0, G.ini.i - 1); renderIni(); return true; }
    if (k === 'Enter' || k === 'NumpadEnter') { finishResults(); return true; }
    return true;
  }
  if (!G.screen) return;
  if (e && e.target && e.target.tagName === 'INPUT' && k !== 'Enter') return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) navigate(k);
  else if ((k === 'Enter' || k === 'NumpadEnter' || k === 'Space') && selEl) { if (e) e.preventDefault(); selEl.click(); }
  else if (k === 'Backspace' && G.screen !== 'title' && !holdsRun()) act('back');
});
document.addEventListener('pointerdown', () => A.unlock(), { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play') pause(); });
// the touch drag marker
I.touchUI = (x, y, on) => { const el = $('drag'); if (!on) { el.classList.remove('on'); return; } el.classList.add('on'); el.style.left = x + 'px'; el.style.top = y + 'px'; };

// ------------------------------------------------------------------ edge warnings
// strikes and bolts in lanes next to yours get a marker at the bottom of the screen, left or right
function updateWarnings(W) {
  const me = myPlayer(W), el = $('warns');
  if (!me || !me.alive || G.mode === 'demo' || W.phase !== 'fight') { setHTML('warns', ''); return; }
  // one marker per side (the nearest strike, with a count), so a sweep never stacks markers on top of each other
  const side = { l: null, r: null };
  for (const z of W.zaps) {
    const d = laneDistW(W, me.lane, z.lane);
    if (Math.abs(d) > 3 || d === 0) continue;
    const k = d < 0 ? 'l' : 'r', q = side[k] || (side[k] = { n: 0, d: 9, live: false });
    q.n++; q.d = Math.min(q.d, Math.abs(d)); q.live = q.live || z.t >= 0;
  }
  const out = [];
  for (const k of ['l', 'r']) { const q = side[k]; if (q) out.push(`<b class="${k} ${q.live ? 'live' : ''}" style="--k:${q.d}">${k === 'l' ? '◀' : '▶'} STRIKE${q.n > 1 ? ' ×' + q.n : ''}</b>`); }
  setHTML('warns', out.join(''));
  void el;
}
function laneDistW(W, a, b) { let d = b - a; if (W.closed) { const n = W.nl; d = ((d % n) + n) % n; if (d > n / 2) d -= n; } return d; }

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
  const menu = G.state === 'title' || (['sectors', 'online', 'scores', 'medals', 'options', 'help'].includes(G.screen) && G.mode === 'title');
  R.updateCamera(dt, { W: cur, me: me && (me.alive || me.drag) ? me : null, cine: menu, shake: +settings.shake });
  A.setListener(R.camera);
  if (G.state === 'play' || G.state === 'paused-online' || G.state === 'replay') loops(cur, dt);
  R.render(dt, { dive: cur.phase === 'dive' && !menu, diveK: cur.phase === 'dive' && !menu ? Math.max(0, cur.diveT / cur.diveDur - 0.75) * 2 : 0 });
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
      else me.input = G.state === 'play' ? I.control() : { mx: 0, dx: 0, fire: false, purge: false, hop: false };
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (guest) ev = ev.filter((e) => e.pid === 2 && e.k === 'fire');
    if (online && NET.host) NET.hostEvents(ev);
    handleEvents(ev, W, true);
    G.acc -= STEP; n++;
    if (W.over) break;
  }
  if (n >= 12) G.acc = 0;
  if (online) {
    if (NET.host) NET.hostFrame(W, dt); else NET.guestFrame(W, dt);
    // a host whose tab went to the background stops its web: say so instead of freezing silently
    if (!NET.host && NET.stale && G.capT <= 0.2) caption('WAITING FOR THE HOST…', 1);
  }
  captureClip(W);
  updateHud(W);
  updateWarnings(W);
  if (G.mode === 'demo' || G.mode === 'playthrough') demoCaptions(W, dt);
  // the attract demo hands over after 100 s without touching the world (nothing outside step() changes W)
  const demoDone = G.mode === 'demo' && (G.demoT += dt) > 100;
  if ((W.over || demoDone) && (G.state === 'play' || G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => onWorldOver(W), G.mode === 'demo' ? 1500 : 1300); }
}
function replayStep(dt) {
  const Rp = G.replay;
  const near = Math.abs(Rp.toKey) < 0.7;
  A.setRate(near ? 0.7 : 1);
  const ev = Rp.advance(dt * (near ? 0.35 : 1), (W) => { if (W.n === G.clip.keyN && G.clip.sig) G.replayExact = worldSig(W) === G.clip.sig; });
  handleEvents(ev, Rp.W, false);
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  if (!W) return;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  if (W.phase !== 'fight' && W.phase !== 'intro' || W.over) scenic(R.lookI);
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 12)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// what the autopilot is up to, now and then
function demoCaptions(W, dt) {
  G.capCool = (G.capCool || 0) - dt;
  if (G.capCool > 0 || !G.ai) return;
  const d = G.ai.debug, me = W.players[0];
  let text = null;
  if (W.boss && W.boss.state === 'fight') {
    const B = W.boss;
    text = B.heads.some((h) => h.hp > 0) ? `AUTOPILOT · taking ${BOSSES[B.key].name}'s heads one by one` : B.segs && B.segs.some((x) => x > 0) ? `AUTOPILOT · riding the gaps in ${BOSSES[B.key].name}'s armour` : B.eye ? 'AUTOPILOT · waiting for the eye to open' : `AUTOPILOT · pouring fire into ${BOSSES[B.key].name}`;
  } else if (d.mode === 'dive') text = 'AUTOPILOT · threading between the spines';
  else if (d.mode === 'evade') text = 'AUTOPILOT · slipping out of a lane that is about to light up';
  else if (me && me.purges && W.enemies.filter((e) => e.d < 0.25).length >= 3) text = 'AUTOPILOT · the rim is crowded: PURGE ready';
  if (text) { caption(text, 2.6); G.capCool = 6.5; }
}
// the arc mites' crackle follows the nearest one
function loops(W, dt) {
  const me = myPlayer(W) || W.players[0];
  let best = null, bd = 1e9;
  for (const e of W.enemies) if (e.type === 'mite' && e.hp > 0) { const d = Math.abs(laneDistW(W, me.pos, e.lane)) + e.d * 6; if (d < bd) { bd = d; best = e; } }
  if (best) { const w = R.worldAt(best.lane, best.d, 0.6); A.setLoop('crackle', w.x, w.y, w.z, Math.max(0, 0.9 - bd * 0.08), 1 + (best.rim ? 0.15 : 0)); }
  else A.setLoop('crackle', 0, 0, 0, 0, 1);
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
  // row to drop, four fast ones to recover, and never more than once every 8 seconds
  const now = performance.now();
  G.perfSlow = p75 > 1 / 48 && p75 < 0.25 ? (G.perfSlow || 0) + 1 : 0;
  G.perfFast = p75 < 1 / 75 ? (G.perfFast || 0) + 1 : 0;
  if (now - (G.perfT || 0) < 8000) return;
  if (G.perfSlow >= 2 && R.scale > 0.6) { R.setScale(Math.max(0.6, R.scale - 0.1)); G.perfT = now; G.perfSlow = 0; }
  else if (G.perfFast >= 4 && R.scale < 1) { R.setScale(Math.min(1, R.scale + 0.1)); G.perfT = now; G.perfFast = 0; }
}

// the title's world board: its own card on the right on a wide screen, inside the menu card on a narrow one
function placeBoard() {
  const tb = document.querySelector('.tboard'), side = $('tbcard'), card = document.querySelector('#title .card:not(.tbcard)');
  if (!tb || !side || !card) return;
  // wide desktop, or a phone held sideways (short and wide): the board goes in its own card on the right
  const wide = (innerWidth >= 1000 && innerHeight >= 520) || (innerHeight < 520 && innerWidth >= 640 && innerWidth > innerHeight * 1.4);
  if (wide && tb.parentNode !== side) side.appendChild(tb);
  else if (!wide && tb.parentNode !== card) card.insertBefore(tb, card.querySelector('.foot'));
  side.classList.toggle('hidden', !wide);
}
addEventListener('resize', placeBoard);
placeBoard();

// ------------------------------------------------------------------ boot
async function boot() {
  try { R.warmUp(); } catch (e) { console.warn('warm-up', e); }
  $('loading').style.opacity = '0'; $('loading').classList.add('gone'); // fading out: taps go through at once
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  if (params.has('test')) { const m = await import('./tests.js?v=5'); m.runTests(window.__rs); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (G.autopilot) { A.unlock(); if (params.has('endless')) startEndless(); else startCampaign(+params.get('sector') || 0); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__rs, {
  tick: (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) tickFrame(dt); },
  startDemo, startCampaign, startEndless, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings,
  noPost: NO_POST, isBossWeb, ENEMY, boardOf, Scores, worldSig, medals, best, bestSc, CALM, quality,
});
Object.defineProperty(window.__rs, 'W', { get: () => G.W, enumerable: true });
boot();
