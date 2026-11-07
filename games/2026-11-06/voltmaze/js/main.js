// Berserk 2026 — game flow, menus, HUD, minimap, the facility AI's (rare) voice, the demo director
// and the frame loop.
import { VERSION, SECTORS, STEP, F, ROOM, RAMP, UPGRADES, UP_KEYS, UP_COST, SALVAGE, MEDALS, parTime, TYPICAL_UP, START_LIVES, BOSSES, DIFFICULTY, DIFF_KEYS, POWERUPS, ENEMY, empMax, SEEKER, SUITS } from './config.js?v=10';
import { makeWorld, step, drainEvents, roomLabel, routeSide, angDiff, SIDES, DELTA, wallDist, cloneWorld } from './sim.js?v=10';
import { Autopilot } from './ai.js?v=10';
import { Renderer, pickQuality, CALM, LOOKS } from './render.js?v=10';
import { Audio } from './audio.js?v=10';
import { Input } from './input.js?v=10';
import { Scores, NO_POST } from './scores.js?v=10';
import { Recorder, Replay } from './replay.js?v=10';
import { Online, ROOM as NET_ROOM, randomCode, cleanCode } from './online.js?v=10';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const { cols: GC, rows: GR } = ROOM;

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'vm.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0', diff: 'normal', assist: 'light', cam: 'auto', suit: 'slate' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
if (!DIFFICULTY[settings.diff]) settings.diff = 'normal';
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('vm.medals.v1', []));
const best = load('vm.best.v1', {});
const bestSc = load('vm.bestsc.v1', {});   // best score earned inside each sector, per difficulty
const bestRank = load('vm.rank.v1', {});   // best sector RANK (S/A/B/C), per difficulty
let reach = load('vm.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input(R.camera);
// global boards: one per mode and difficulty
const BOARDS = {};
const boardKey = (mode, diff = 'normal') => 'voltmaze-2026' + (mode === 'endless' ? '-endless' : '') + (diff === 'normal' ? '' : '-' + diff);
function boardOf(mode, diff = 'normal') { const k = boardKey(mode, diff); return BOARDS[k] || (BOARDS[k] = new Scores(k)); }
const HS = boardOf('campaign');
const DL = (d) => (DIFFICULTY[d] || DIFFICULTY.normal).label;
const bestKey = (diff, i) => (diff === 'normal' ? 's' + i : diff + ':s' + i);
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, screen: null, back: [], ini: null, scenic: null, hudCache: {}, tutT: 0, bannerT: 0, capT: 0, frameT: [],
  autopilot: params.has('autoplay'), fixed: params.has('fixed'), stepPh: {}, scoreTab: 'campaign', scoreDiff: null, titleTab: 'campaign', titleDiff: null,
};
window.__vm = { G, R, A, I, NET, REC, settings, VERSION };

// ------------------------------------------------------------------ the facility AI: rare on purpose
// KEY lines (run start, sector arrival, boss, boss down, sector clear, game over, new record) always get
// through, one at a time; colour lines wait VOICE_GAP seconds after the last line and roll a chance.
const VOICE_GAP = 26;
let lastLine = -99;
const nowS = () => performance.now() / 1000;
const says = new Map();
function say(name, o = {}) {
  if (settings.talk === 'off' || G.mode === 'demo' || G.mode === 'title') return;
  const t = nowS(), last = says.get(name) ?? -99;
  if (t - last < (o.cd ?? 0) || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { says.set(name, t); lastLine = t; (window.__vm.lines ||= []).push([t, name]); }
}
function rumble(strong, weak, ms) { if (settings.rumble === 'off' || G.mode === 'demo' || G.mode === 'playthrough' || G.mode === 'title') return; I.rumble(strong, weak, ms); }

// ------------------------------------------------------------------ r3: service record (lifetime stats on this device)
// Your own runs only: campaign, endless and co-op as the host. The attract demo, ?autoplay, the AI PLAYTHROUGH, a
// co-op guest and the ?test page never count. Read from the sim's events (presentation only, never fed back).
const RKEY = 'vm.record.v1';
const SR = { time: 0, runs: {}, kills: {}, bosses: {}, rooms: 0, sectors: 0, floors: 0, deaths: {}, best: {}, emps: 0, dashes: 0, pickups: 0 };
(() => { const s = load(RKEY, null); if (s && typeof s === 'object') for (const k in SR) if (s[k] !== null && typeof s[k] === typeof SR[k]) SR[k] = s[k]; })();
let srDirty = false, srSavedT = 0;
const srCounts = () => !params.has('test') && !G.autopilot && (((G.mode === 'campaign' || G.mode === 'endless') && !!G.run && !G.run.ai && !(G.W && G.W.demo)) || (G.mode === 'online' && !!NET.host));
function srAdd(o, k, n = 1) { if (o === SR) SR[k] += n; else o[k] = (o[k] || 0) + n; srDirty = true; }
function srSave(force) { if (!srDirty || (!force && performance.now() - srSavedT < 5000)) return; srDirty = false; srSavedT = performance.now(); store(RKEY, SR); }
function srEvents(list, W) {
  const me = (myPlayer(W) || {}).id;
  for (const e of list) {
    if (e.k === 'kill') { if (e.by !== 'expire' && ENEMY[e.type]) srAdd(SR.kills, e.type); }
    else if (e.k === 'bossdown') srAdd(SR.bosses, e.key);
    else if (e.k === 'roomclear') srAdd(SR, 'rooms');
    else if (e.k === 'liftup') srAdd(SR, W.mode === 'endless' ? 'floors' : 'sectors');
    else if (e.pid !== undefined && e.pid === me) {
      if (e.k === 'death') srAdd(SR.deaths, e.cause || 'wall');
      else if (e.k === 'emp') srAdd(SR, 'emps'); else if (e.k === 'dash') srAdd(SR, 'dashes'); else if (e.k === 'pickup') srAdd(SR, 'pickups');
    }
  }
}
// best score per mode (campaign / endless / co-op) and difficulty, at the end of every counted world
function srBest(W) { const k = (G.mode === 'online' ? 'coop' : W.mode) + ':' + (W.diff || 'normal'); if (W.score > (SR.best[k] || 0)) { SR.best[k] = W.score; srDirty = true; } srSave(true); }
const fmtH = (t) => { const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = Math.floor(t % 60); return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(s).padStart(2, '0')}s`; };
const sumOf = (o) => Object.values(o).reduce((a, b) => a + (+b || 0), 0);
function buildRecord() {
  srSave(true);
  const n = (v) => (v || 0).toLocaleString();
  const row = (a, b, tot) => `<div class="rs${tot ? ' tot' : ''}"><span>${a}</span><b>${b}</b></div>`;
  const sec = (h, body) => `<div class="rsec" tabindex="-1"><h3>${h}</h3>${body}</div>`;
  const deaths = Object.entries(SR.deaths).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const modes = [['campaign', 'CAMPAIGN'], ['endless', 'ENDLESS'], ['coop', 'CO-OP']];
  const bestT = `<table class="rbest"><tr><th></th>${modes.map(([, l]) => `<th>${l}</th>`).join('')}</tr>${DIFF_KEYS.map((d) => `<tr><td>${DL(d)}</td>${modes.map(([m]) => `<td>${SR.best[m + ':' + d] ? n(SR.best[m + ':' + d]) : '—'}</td>`).join('')}</tr>`).join('')}</table>`;
  const open = SUITS.filter(suitOpen).length, next = SUITS.find((S) => !suitOpen(S));
  $('rec-grid').innerHTML = [
    sec('ON DUTY', row('TOTAL PLAY TIME', fmtH(SR.time), 1) + row('CAMPAIGN RUNS', n(SR.runs.campaign)) + row('ENDLESS RUNS', n(SR.runs.endless)) + row('CO-OP RUNS HOSTED', n(SR.runs.coop)) + row('ROOMS CLEARED', n(SR.rooms)) + row('SECTORS CLEARED', n(SR.sectors)) + row('ENDLESS FLOORS', n(SR.floors)) + row('EMPS · DASHES · PICKUPS', `${n(SR.emps)} · ${n(SR.dashes)} · ${n(SR.pickups)}`)),
    sec('ROBOTS DESTROYED', row('ALL CLASSES', n(sumOf(SR.kills)), 1) + Object.keys(ENEMY).map((k) => row(ENEMY[k].name, n(SR.kills[k]))).join('')),
    sec('BOSSES FELLED', row('ALL BOSSES', n(sumOf(SR.bosses)), 1) + Object.keys(BOSSES).map((k) => row(BOSSES[k].name, n(SR.bosses[k]))).join('')),
    sec('LIVES LOST', row('ALL CAUSES', n(sumOf(SR.deaths)), 1) + (deaths.length ? deaths.map(([c, v]) => row(CAUSE[c] || String(c).toUpperCase(), n(v))).join('') : row('NONE YET', '—'))),
    sec('BEST SCORES', bestT),
    sec('MEDALS', row('EARNED', `${medals.size} / ${MEDALS.length}`, 1) + SECTORS.map((s, i) => row(`S${i + 1} · ${s.name}`, MEDALS.filter((q) => q.sector === i).map((q) => `<em class="st${medals.has(q.id) ? ' on' : ''}" title="${q.name}">★</em>`).join(''))).join('') + row('SUITS UNLOCKED', `${open} / ${SUITS.length}`) + (next ? row(`NEXT: ${next.name}`, `${next.medals} MEDALS`) : '')),
  ].join('');
}
function showRecord() {
  buildRecord(); show('record');
  setSel($('rec-grid').querySelector('.rsec'));
  $('record').querySelector('.card').scrollTop = 0;
}

// ------------------------------------------------------------------ r3: suit colourways (SUITS in config.js), unlocked by medals
const suitOpen = (S) => medals.size >= S.medals;
function suitNow() { const S = SUITS.find((q) => q.key === settings.suit); return S && suitOpen(S) ? S : SUITS[0]; }
const hexOf = (c) => '#' + c.toString(16).padStart(6, '0');
// a locked suit's button is disabled: no click, and keyboard / pad navigation skips it
function buildSuits() {
  $('suit-seg').innerHTML = SUITS.map((S) => `<button data-v="${S.key}" style="--a:${hexOf(S.color)};--b:${hexOf(S.accent)}"${suitOpen(S) ? '' : ' disabled'} aria-label="${S.name}${suitOpen(S) ? '' : ' (locked: ' + S.medals + ' medals)'}"><i></i>${S.name}</button>`).join('');
  const locked = SUITS.filter((S) => !suitOpen(S));
  $('suit-note').textContent = locked.length ? `${medals.size} ${medals.size === 1 ? 'MEDAL' : 'MEDALS'} EARNED · ${locked.map((S) => `${S.name} AT ${S.medals}`).join(' · ')}` : 'EVERY SUIT UNLOCKED';
  syncSegs();
}

// ------------------------------------------------------------------ screens
const SCREENS = ['title', 'sectors', 'upgrades', 'results', 'scores', 'medals', 'options', 'help', 'online', 'pause', 'record'];
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
function setSel(el) { if (selEl) selEl.classList.remove('sel'); selEl = el; if (el) { el.classList.add('sel'); try { if (I.lastKind !== 'touch') el.scrollIntoView({ block: 'nearest' }); } catch (e) { /* keyboard/pad focus below the fold on short phones */ } } }
function navigate(dir) {
  if (!G.screen) return;
  const items = [...$(G.screen).querySelectorAll('.mbtn:not(.hidden):not([disabled]), .sec:not([disabled]), .upg, .seg button:not([disabled]), .rsec, [data-tab], [data-hd], [data-tt], [data-td]')].filter((e) => e.offsetParent);
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
// the title's BEST line: the campaign and endless boards at the chosen difficulty
function titleBest() { const d = settings.diff, f = (m) => Math.max(boardOf(m, d).best(), 0).toLocaleString(); return `BEST ${f('campaign')} · ENDLESS ${f('endless')} · ${DL(d)}`; }
function toTitle() {
  NET.close(); stopPlay(); clearPopups(); G.popW = null;
  clearTimeout(G.ptT);
  G.state = 'title'; G.mode = 'title'; G.idleT = 0;
  hideScreens(); show('title', false);
  $('ver').textContent = VERSION;
  $('title-best').textContent = titleBest();
  $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  syncSegs();
  $('med-sub').textContent = `${medals.size} / ${MEDALS.length}`;
  srSave(true); $('rec-sub').textContent = `${fmtH(SR.time)} on duty · ${sumOf(SR.kills).toLocaleString()} robots destroyed`;
  $('sel-sub').textContent = reach > 0 ? `Sectors 1 to ${reach + 1} open` : 'Clear sector 1 to open more';
  $('demo-badge').classList.add('hidden');
  setHud(false);
  scenic(G.demoI % 5);
  renderTitleBoard(G.titleTab, G.titleDiff || settings.diff);
  A.playMusic('title');
}
function scenic(look) {
  // the title shows a room of the sector with its robots on patrol
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 11 + look, room: 2, demo: true, lives: 9 });
  W.players[0].alive = false; W.players[0].deadT = -1e9;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  A.stopLoops();
  G.replay = null; G.ai = null; G.timeScale = 1; A.setRate(1); R.shot = null;
  for (const id of ['letterbox', 'bossbar', 'tut', 'banner', 'caption']) $(id).classList.add('hidden');
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
function startCampaign(sector = 0) {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 400 * sector : 0, start: sector, newMedals: [], diff: settings.diff };
  say('begin', { key: true, delay: 0.8 });
  beginSector(sector);
  if (G.srOn) srAdd(SR.runs, 'campaign');
}
function beginSector(s) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, room: +params.get('room') || 0, boss: params.has('boss'), demo: !!G.run.ai, diff: G.run.diff || 'normal', noGrace: s > 0 || !!G.run.ai });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 3);
  if (s > 0) say('s' + (s + 1), { key: true, delay: 1.2 });
}
// AI PLAYTHROUGH: the demo autopilot plays the whole campaign, picks its own upgrades between sectors
// and retries a sector if it runs out of lives. Nothing it does counts for scores or medals.
const AI_SHOP = ['weapon', 'plate', 'dash', 'weapon', 'emp', 'jammer', 'plate', 'weapon', 'dash', 'emp', 'jammer'];
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0, diff: 'normal' };
  beginSector(+params.get('sector') || 0);
  caption('AI PLAYTHROUGH: THE AUTOPILOT PLAYS ALL FIVE SECTORS. PRESS ESC OR PAUSE TO STOP', 6);
}
function aiShop() {
  const got = [];
  got.by = {};
  for (const k of AI_SHOP) {
    const lv = G.run.up[k] || 0;
    if (lv >= UPGRADES[k].max || G.run.salvage < UP_COST[lv]) continue;
    G.run.salvage -= UP_COST[lv]; G.run.up[k] = lv + 1; got.push(UPGRADES[k].name); got.by[k] = (got.by[k] || 0) + 1;
  }
  return got;
}
function startEndless() {
  G.run = { score: 0, lives: START_LIVES + DIFFICULTY[settings.diff].lives, up: {}, start: 0, newMedals: [], diff: settings.diff };
  G.mode = 'endless';
  enterPlay(makeWorld({ mode: 'endless', seed: newSeed(), diff: settings.diff }));
  if (G.srOn) srAdd(SR.runs, 'endless');
  banner('ENDLESS FACILITY', 'FLOOR 1 · HOW DEEP CAN YOU GET', 3);
  say('begin', { key: true, delay: 0.8 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start a couple of rooms short of the lift so the boss turns up within the minute, with upgrades fitted to show them off
  const up = { ...TYPICAL_UP[s], weapon: Math.max(1, TYPICAL_UP[s].weapon || 0), dash: Math.max(1, TYPICAL_UP[s].dash || 0), emp: Math.max(1, TYPICAL_UP[s].emp || 0) };
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, room: Math.max(0, RAMP[s].rooms - 2), up, lives: 9 });
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now(); G.capCool = 5.5;   // let the FITTED caption stay up before the autopilot's own lines
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · FITTED: ${UP_KEYS.filter((k) => up[k]).map((k) => UPGRADES[k].name).join(', ')}`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null;
  if (!G.ai && G.autopilot && G.mode !== 'online') G.ai = new Autopilot(W.seed, params.get('ai') === 'human' ? 'human' : 'demo');
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  REC.reset();
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  R.updateCamera(0.016, { snap: true });
  A.playMusic(W.room.boss ? 'boss' : SECTORS[W.k].music);
  A.loop('servo', 'servo', 0.4); A.loop('seeker', 'seeker', 0.6); A.loop('hum', 'hum', 0.25);
  G.idleT = 0; G.hudCache = {};
  G.srOn = srCounts();   // r3: does this world count for the service record
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
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const fmtM = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
const myPlayer = (W) => (G.mode === 'online' && !NET.host ? W.players[1] : W.players[0]);
// boss label: always one line; shrink the type until it fits the screen (phones)
function fitBossLabel() {
  const el = $('boss-name');
  el.style.fontSize = ''; el.style.letterSpacing = '';
  const max = el.closest('.mid') ? Math.max(200, Math.min(420, innerWidth - 470)) : Math.min(innerWidth - 20, 640);
  let fs = parseFloat(getComputedStyle(el).fontSize) || 11, ls = 0.3;
  for (let i = 0; i < 12 && el.offsetWidth > max; i++) { ls = Math.max(0.06, ls - 0.06); if (ls <= 0.06) fs = Math.max(7, fs - 0.5); el.style.letterSpacing = ls + 'em'; el.style.fontSize = fs + 'px'; }
}
addEventListener('resize', () => { if (G.hudCache && G.hudCache['boss-name']) fitBossLabel(); });
// r3: on a landscape phone the boss plate sits in the HUD's centre panel (index.html), so the top of the room stays clear
const bossMQ = matchMedia('(max-height: 500px)');
function placeBossbar() {
  const bb = $('bossbar'), mid = document.querySelector('#hud .mid'), inHud = bossMQ.matches;
  if ((bb.parentElement === mid) === inHud) return;
  if (inHud) mid.appendChild(bb); else $('popups').before(bb);
  if (G.hudCache && G.hudCache['boss-name']) fitBossLabel();
}
placeBossbar();
addEventListener('resize', placeBossbar);
// score popups belong to one room of one world: drop them when either changes
function clearPopups() { const box = $('popups'); if (box) box.replaceChildren(); }
function updateHud(W) {
  const pk = W.room ? W.room.key : '';
  if (G.popW !== W || G.popRoom !== pk) { G.popW = W; G.popRoom = pk; clearPopups(); }
  // online guest: the host's tab went to the background (its browser stops drawing it, so it stops sending)
  const hostGone = G.mode === 'online' && !NET.host && G.state === 'play' && NET.lastSnap > 0 && performance.now() - NET.lastSnap > 1500;
  if (hostGone && !G.hostWait) { G.hostWait = true; caption('HOST PAUSED · THEIR GAME IS IN THE BACKGROUND · WAITING…', 1e9); }
  else if (!hostGone && G.hostWait) { G.hostWait = false; G.capT = Math.min(G.capT, 0.01); }
  else if (!hostGone && G.mode === 'online' && !NET.host && NET.hostAway && G.capT <= 0.2) caption("THE HOST'S TAB IS IN THE BACKGROUND · THE FACILITY KEEPS RUNNING", 1);
  setText('score', W.score.toLocaleString());
  const board = boardOf(W.mode, W.diff);
  setText('hiscore', Math.max(board.best(), W.score).toLocaleString());
  const me = myPlayer(W);
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - (me && me.alive ? 1 : 0)))));
  const pips = [];
  if (me) { for (let i = 0; i < me.shield; i++) pips.push('<i class="os"></i>'); for (let i = 0; i < (W.up.plate || 0); i++) pips.push(`<i class="pl ${i < me.plate ? 'on' : ''}"></i>`); }
  setHTML('shield', pips.join(''));
  const em = me ? Math.max(me.emp, empMax(W.up)) : 0;
  setHTML('emps', Array.from({ length: em }, (_, i) => `<i class="${me && i < me.emp ? 'on' : ''}"></i>`).join(''));
  $('tb-emp').classList.toggle('empty', !me || me.emp <= 0);
  $('tb-dash').classList.toggle('hidden', !W.up.dash);
  const act = [];
  if (me) for (const k in me.pw) act.push([k, me.pw[k]]);
  setHTML('pw', act.map(([k, t]) => { const P = POWERUPS[k]; return `<span style="--c:#${P.color.toString(16).padStart(6, '0')}"><b>${P.glyph}</b>${P.name}<i style="width:${Math.min(100, (t / P.time) * 100).toFixed(0)}%"></i></span>`; }).join(''));
  const dl = W.diff !== 'normal' ? ' · ' + DL(W.diff) : '';
  setText('sector-name', W.mode === 'endless' ? `ENDLESS · FLOOR ${W.floor + 1} · ${SECTORS[W.k].name}${dl}` : `SECTOR ${W.sector + 1} · ${SECTORS[W.sector].name}${dl}`);
  // r3: the sector par next to the sector clock (campaign), both amber once you are past it
  const par = W.mode === 'campaign' ? parTime(W.sector) : 0, over = par > 0 && W.secT > par;
  if (par) setHTML('timer', `${roomLabel(W)} · <span class="clk">${fmtT(W.secT)}</span> <span class="par">/ PAR ${fmtM(par)}</span>`);
  else setText('timer', `${roomLabel(W)} · ${fmtT(W.secT)}`);
  if (G.hudCache.parOver !== over) { G.hudCache.parOver = over; $('timer').classList.toggle('over', over); }
  // the Seeker's clock
  const room = W.room, delay = W.R.seek + 4 * (W.up.jammer || 0);
  const f = room.boss ? 0 : Math.min(1, room.t / delay);
  $('seekbar').classList.toggle('hidden', room.boss || !!W.seeker === false && f < 0.45);
  $('seekbar').classList.toggle('hot', !!W.seeker || f > 0.85);
  $('seekbar').querySelector('i').style.width = (W.seeker ? 100 : f * 100).toFixed(0) + '%';
  setText('seek-lbl', W.seeker ? 'SEEKER IN THE ROOM · MOVE ON' : f > 0.85 ? 'SEEKER INBOUND' : 'SEEKER');
  setText('roomstat', room.boss ? '' : room.cleared ? 'ROOM CLEAR' : `ROBOTS ${W.robots.filter((e) => e.type !== 'drone').length} / ${room.total}`);
  const b = W.boss;
  $('bossbar').classList.toggle('hidden', !b || b.state === 'in');
  if (b) {
    const heads = b.heads.filter((h) => h.hp > 0).length;
    const bn = BOSSES[b.key].name + (heads ? ` · ${heads} HEADS LEFT` : b.stun > 0 ? ' · VENTS OPEN · 2X DAMAGE' : b.plates ? ' · SHOOT BETWEEN PLATES' : '');
    if (G.hudCache['boss-name'] !== bn) { setText('boss-name', bn); fitBossLabel(); }
    $('bossbar').querySelector('i').style.width = Math.max(0, (b.hp / b.max) * 100).toFixed(1) + '%';
    bossTrail(Math.max(0, (b.hp / b.max) * 100));
  }
  drawMap(W);
}
// the sector map: rooms you have been in, rooms you have seen through a door, the lift, where you are
const mapC = $('minimap'), mapX = mapC.getContext('2d');
// the boss bar's damage trail: a pale chunk that holds for a moment after each hit, then drains to the new level (CSS transition with a delay)
function bossTrail(pct) {
  const bar = $('bossbar').querySelector('.bar');
  if (!bar) return;
  let t = bar.querySelector('.trail');
  if (!t) { t = document.createElement('b'); t.className = 'trail'; bar.appendChild(t); t._p = -1; }
  if (Math.abs(pct - t._p) < 0.05) return;
  t.style.transition = pct > t._p ? 'none' : ''; // a fresh boss (or a heal) fills at once; damage drains
  t.style.width = pct.toFixed(1) + '%'; t._p = pct;
}
// a boss hit: a white-hot flash at the impact (particles only; the boss and robot materials are untouched) and a flash on the bar
function bossHitFx(e) {
  R.fx.sparks(e.x, 1.6, e.z, { n: e.crit ? 10 : 6, speed: 3, s: 0.42, life: 0.22, r: 1, g: 1, b: 0.92, vy: 1 });
  R.fx.fire(e.x, 1.6, e.z, { n: e.crit ? 3 : 1, s: e.crit ? 0.9 : 0.6, sp: 0.4, life: 0.22 });
  const i = $('bossbar').querySelector('.bar i');
  if (i && i.animate && !CALM.on) i.animate([{ filter: 'brightness(2.4) saturate(.6)' }, { filter: 'none' }], { duration: e.crit ? 260 : 170, easing: 'ease-out' });
}
// LIFT ONLINE after a boss kill waits until the wreck has burned out (~1.4 s) instead of covering the death
function liftBanner(W) {
  if (!(W.room && W.room.boss)) { banner('LIFT ONLINE', 'STEP ON THE PAD', 2.6); return; }
  // a pause (or a hidden online tab) inside that window holds the banner until play resumes instead of dropping it
  const rm = W.room;
  const later = () => {
    if (G.W !== W || W.room !== rm || W.phase === 'liftup') return;
    if (G.state === 'play') banner('LIFT ONLINE', 'STEP ON THE PAD', 2.6);
    else if (G.state === 'paused' || G.state === 'paused-online') setTimeout(later, 300);
  };
  setTimeout(later, 1400);
}
function drawMap(W) {
  const G2 = W.grid, rm = W.room;
  // portrait phones turn the camera 90° (west at the top, north on the right): the map turns with it
  const tall = R.portrait;
  const key = rm.key + ':' + (rm.cleared ? 1 : 0) + ':' + G2.seen.join('') + (tall ? ':t' : '');
  if (G.mapKey === key && !(Math.floor(performance.now() / 400) % 2 !== G.mapBlink)) return;
  G.mapKey = key; G.mapBlink = Math.floor(performance.now() / 400) % 2;
  const w = 250, h = 200, cw = w / GC, ch = h / GR, x = mapX;
  if (mapC.classList.contains('tall') !== tall) { mapC.classList.toggle('tall', tall); mapC.width = tall ? h : w; mapC.height = tall ? w : h; }
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.clearRect(0, 0, mapC.width, mapC.height);
  // draw in map space (east right, south down); portrait maps (u, v) to (h - v, u)
  if (tall) x.setTransform(0, 1, -1, 0, h, 0);
  const P = (u, v) => (tall ? [h - v, u] : [u, v]);
  for (let j = 0; j < GR; j++) for (let i = 0; i < GC; i++) {
    const s = G2.seen[j * GC + i];
    const px = i * cw + 3, py = j * ch + 3, pw = cw - 6, ph = ch - 6;
    if (s === 2) { x.fillStyle = 'rgba(127,216,255,0.28)'; x.fillRect(px, py, pw, ph); }
    if (s >= 1) { x.strokeStyle = s === 2 ? 'rgba(127,216,255,0.8)' : 'rgba(127,216,255,0.35)'; x.lineWidth = 1.5; x.strokeRect(px, py, pw, ph); }
    else { x.fillStyle = 'rgba(255,255,255,0.05)'; x.fillRect(px, py, pw, ph); }
    if (s === 2) for (const sd of SIDES) {
      const ni = i + DELTA[sd][0], nj = j + DELTA[sd][1];
      if (ni < 0 || nj < 0 || ni >= GC || nj >= GR) continue;
      const open = sd === 'e' ? G2.h[j * (GC - 1) + i] : sd === 'w' ? G2.h[j * (GC - 1) + i - 1] : sd === 's' ? G2.v[j * GC + i] : G2.v[(j - 1) * GC + i];
      if (!open) continue;
      x.fillStyle = 'rgba(127,216,255,0.9)';
      if (sd === 'e') x.fillRect(px + pw - 1, py + ph / 2 - 3, 4, 6); if (sd === 'w') x.fillRect(px - 3, py + ph / 2 - 3, 4, 6);
      if (sd === 's') x.fillRect(px + pw / 2 - 3, py + ph - 1, 6, 4); if (sd === 'n') x.fillRect(px + pw / 2 - 3, py - 3, 6, 4);
    }
  }
  // the next door on the way to the lift
  const sd = routeSide(W);
  if (sd) { const cx = rm.rx * cw + cw / 2, cy = rm.ry * ch + ch / 2; x.strokeStyle = '#5dff8a'; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + DELTA[sd][0] * cw * 0.45, cy + DELTA[sd][1] * ch * 0.45); x.stroke(); }
  // markers stay upright on screen
  x.setTransform(1, 0, 0, 1, 0, 0);
  // the lift
  const [lx, ly] = P(G2.lx * cw + cw / 2, G2.ly * ch + ch / 2);
  x.fillStyle = '#ffb347'; x.beginPath(); x.moveTo(lx, ly - 7); x.lineTo(lx + 7, ly + 5); x.lineTo(lx - 7, ly + 5); x.closePath(); x.fill();
  // you
  if (G.mapBlink || W.room.boss) { const [ux, uy] = P(rm.rx * cw + cw / 2, rm.ry * ch + ch / 2); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(ux, uy, 4.5, 0, 7); x.fill(); }
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
  if (G.state !== 'play') return;
  R.project(x, 2.0, z, P);
  const d = document.createElement('div');
  const box = $('popups');
  // Identical big callouts at the same moment (e.g. two boss heads down together) stack instead of overlapping.
  let stack = 0;
  if (big) for (const o of box.children) if (o.classList.contains('big') && o.dataset.t === text) stack++;
  d.className = 'pop' + (big ? ' big' : ''); d.dataset.t = text; d.textContent = text;
  d.style.left = P.x + 'px'; d.style.top = (P.y + stack * 40) + 'px';
  if (color) d.style.color = color;
  box.appendChild(d);
  setTimeout(() => d.remove(), 1200);
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    move: { key: '<kbd>ARROWS</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', pad: 'the left stick', touch: 'your left thumb' },
    fire: { key: 'hold <kbd>SPACE</kbd> to plant your feet and fire the way you point (or aim with the mouse and click)', pad: 'the right stick (or hold <kbd>A</kbd> and point)', touch: 'your right thumb' },
    emp: { key: '<kbd>E</kbd>', pad: '<kbd>X</kbd>', touch: 'the <kbd>EMP</kbd> button' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  move: () => `Run with ${keyName('move')}; fire with ${keyName('fire')}.`,
  fire: () => `Robots power up a moment after you walk in. A <b>RED GLINT</b> means a shot is on its way: step out of the line.`,
  walls: () => `Every wall is <b>ELECTRIFIED</b>, for robots too. Lure them into walls, into each other, into their friends' fire.`,
  exit: () => `Room clear. <b>GREEN</b> door lights lead on; the <b>LIFT</b> is marked on your map. The door behind you stays sealed.`,
  seeker: () => `Linger and the <b>SEEKER</b> comes for you. Nothing stops it: move on to the next room.`,
  patroller: () => `A <b>PATROLLER</b>: it sweeps its lane until it spots you, then hunts.`,
  twin: () => `<b>TWIN UNITS</b> move as a pair. Break one and the other goes into a rage.`,
  marksman: () => `A <b>MARKSMAN</b> keeps its distance and aims where you will be. Change direction when its glint locks.`,
  ripper: () => `A <b>RIPPER</b> crouches, then lunges in a straight line. Put a wall in its way.`,
  aegis: () => `An <b>AEGIS</b> blocks shots from the front: get round its side.`,
  mortar: () => `A <b>MORTAR</b> lobs mines over the walls: an orange ring shows where. Shoot a mine to set it off near robots.`,
  reinf: () => `Security sends <b>REINFORCEMENTS</b> while a room is live: a red flare marks where each one warps in. Clear the room or move on.`,
};
// one-time prompts for EMP, power-ups and dash (presentation only: no sim grace; once per browser, vm.tut.v1)
const tutOnce = load('vm.tut.v1', {});
const OB = {
  emp: () => `You carry <b>EMP</b> charges: press ${keyName('emp')} to wipe out every robot and bolt near you. A charge comes back every third room cleared.`,
  dash: () => `<b>DASH JETS</b> fitted: while running, press ${{ key: '<kbd>SHIFT</kbd>', pad: '<kbd>LB</kbd> / <kbd>RB</kbd>', touch: 'the <kbd>DASH</kbd> button' }[I.lastKind] || '<kbd>SHIFT</kbd>'} to dash through bolts.`,
  pu: () => `A <b>POWER-UP</b> dropped where that robot fell: run over it to grab it before it fades.`,
};
function onboard(W, what) {
  if ((G.mode !== 'campaign' && G.mode !== 'endless') || W.demo || G.tutT > 0) return;
  const p = W.players[0];
  const key = what === 'drop' ? 'pu' : (W.up.dash > 0 && !tutOnce.dash) ? 'dash' : (p && p.emp > 0 && W.stats.rooms >= 2 && !tutOnce.emp) ? 'emp' : null;
  if (!key || tutOnce[key]) return;
  tutOnce[key] = 1; store('vm.tut.v1', tutOnce);
  const el = $('tut'); el.innerHTML = OB[key](); el.classList.remove('hidden'); G.tutT = 5.5;
}
function tutorial(key) {
  if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return;
  // the reinforcement hint once a session (every new world would otherwise repeat it each sector)
  if (key === 'reinf') { G.tutSeen = G.tutSeen || {}; if (G.tutSeen[key]) return; G.tutSeen[key] = 1; }
  const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = ['move', 'fire', 'walls'].includes(key) ? 3.3 : 5.5;
}

// ------------------------------------------------------------------ events from the simulation
const BOOM = { sentry: 1, patroller: 1, marksman: 1.1, aegis: 1.5, mortar: 1.5, ripper: 0.9, twin: 0.8, drone: 0.6 };
function handleEvents(list, W, live) {
  const L = R.look;
  for (const e of list) {
    const pos = e.x !== undefined ? { x: e.x, y: 1, z: e.z } : {};
    switch (e.k) {
      case 'roomenter':
        R.arrive(e.side); A.play('door', { vol: 0.7 });
        if (e.boss) { A.playMusic('boss'); }
        else if (e.first && W.mode === 'endless' && W.floor > 0) { R.setLook(W.k); A.playMusic(SECTORS[W.k].music); }
        G.hudCache = {};
        if (live) onboard(W, 'room');
        break;
      case 'roomexit': if (!e.cleared && live && W.room.total > 0) caption('MOVING ON', 1.2); break;
      case 'roomclear': if (live) { popup(`ROOM CLEAR +${e.bonus}`, W.players[0].x, W.players[0].z, '#5dff8a', true); A.play('roomclear', { vol: 0.8 }); } break;
      case 'fire': A.play('gun', { ...pos, vol: 0.55, gap: 0.04 }); R.muzzle(e.pid); if (live && e.pid === (myPlayer(W) || {}).id) rumble(0.1, 0.2, 40); break;
      case 'rfire': A.play('zap', { ...pos, vol: 0.6, gap: 0.03 }); R.fx.flash(e.x + Math.cos(e.a) * 0.6, 1.0, e.z + Math.sin(e.a) * 0.6, 3, L.bolt, 0.1); break;
      case 'aim': A.play('charge', { ...pos, vol: 0.35, gap: 0.08 }); break;
      case 'crouch': A.play('crouch', { ...pos, vol: 0.6 }); break;
      case 'lunge': A.play('lunge', { ...pos, vol: 0.7 }); break;
      case 'shotwall': R.spark(e.x, e.z, false); A.play('shotwall', { ...pos, vol: 0.35, gap: 0.05 }); break;
      case 'ricochet': R.spark(e.x, e.z, false); A.play('ricochet', { ...pos, vol: 0.5, gap: 0.04 }); break;
      case 'boltwall': R.spark(e.x, e.z, false); A.play('boltwall', { ...pos, vol: 0.3, gap: 0.05 }); break;
      case 'brush': if (Math.random() < 0.6) R.spark(e.x, e.z, false); A.play('crackle', { ...pos, vol: 0.35, gap: 0.09 }); break;
      case 'zapwall': R.spark(e.x, e.z, true); A.play('electro', { ...pos, vol: 0.9, gap: 0.04 }); break;
      case 'kill': {
        const k = BOOM[e.type] || 1;
        R.breakRobot(e.id, { k });
        if (e.by !== 'expire') { R.fx.explode(e.x, 0.8, e.z, k, { metal: true, color: L.flash, rock: false, smoke: 0.45 }); R.shake(0.12 * k); A.play(k > 1.2 ? 'boomM' : 'boomS', { ...pos, vol: 0.8, gap: 0.03 }); A.play('debris', { ...pos, vol: 0.4, gap: 0.08 }); }
        else R.fx.sparks(e.x, 1.2, e.z, { n: 8 });
        if (live && e.pts) popup(`${e.pts}${e.by === 'wall' || e.by === 'crash' || e.by === 'bolt' || e.by === 'mine' ? ' LURED' : ''}`, e.x, e.z, e.by === 'shot' || e.by === 'emp' ? null : '#7fd8ff');
        break;
      }
      case 'rhit': R.fx.sparks(e.x, 1, e.z, { n: 8 }); A.play('block', { ...pos, vol: 0.4, gap: 0.05 }); break;
      case 'block': R.fx.sparks(e.x, 1, e.z, { n: 6, r: 1, g: 0.9, b: 0.5 }); A.play('block', { ...pos, vol: 0.45, gap: 0.05 }); break;
      case 'death': {
        R.fx.explode(e.x, 1, e.z, 1.2, { color: 0x9fe8ff, rock: false }); R.spark(e.x, e.z, true); R.shake(0.7); R.flashScreen(0.5, 0x9fe8ff);
        A.play('death', { ...pos, vol: 1, gap: 0 });
        if (live) {
          const mine = e.pid === (myPlayer(W) || {}).id;
          if (mine) rumble(1, 0.8, 380);
          if (G.mode !== 'online') { G.pendingClip = { n: W.n, kind: 'death' }; if (window.__vm.onKey) window.__vm.onKey(W, 'death'); }
          // the demo frames the infiltrator and whatever got it (the shooter, the Seeker, the boss, the wall)
          if (G.mode === 'demo' || G.mode === 'playthrough') { R.frameShot([[e.x, e.z], [e.cx ?? e.x, e.cz ?? e.z]], 1.2); slowmo(0.35, 0.9, 'death:' + e.cause); }
          caption(CAUSE[e.cause] || 'DOWN', 2.2);
          if (W.lives === 1) say('lastlife', { key: true, delay: 1.0 });
        }
        break;
      }
      case 'respawn': A.play('respawn', { ...pos, vol: 0.8 }); R.fx.ring(e.x, 0, e.z, 2, 0x9fe8ff); break;
      case 'shield': A.play('shield', { ...pos, vol: 0.9 }); R.fx.ring(e.x, 0, e.z, 2.2, 0x6dffb0); R.flashScreen(0.2, 0x6dffb0); if (live) rumble(0.5, 0.4, 160); break;
      case 'plate': A.play('plate', { ...pos, vol: 0.9 }); R.fx.sparks(e.x, 1.2, e.z, { n: 14 }); if (live) { popup('PLATE', e.x, e.z, '#5fd0ff'); rumble(0.4, 0.3, 120); } break;
      case 'emp': R.emp(e.x, e.z, F.empR); R.shock(e.x, e.z, 1.2); R.fx.ring(e.x, 0, e.z, F.empR * 0.8, 0x8fb4ff); R.fx.flash(e.x, 2.5, e.z, 9, 0x8fb4ff, 0.45); R.flashScreen(0.25, 0x8fb4ff); R.fx.sparks(e.x, 1, e.z, { n: 30, speed: 10, r: 0.6, g: 0.75, b: 1 }); R.shake(0.35); A.play('emp', { ...pos, vol: 1, gap: 0 }); if (live) { rumble(0.7, 0.7, 260); demoNote('AUTOPILOT · EMP: every robot and bolt nearby wiped out'); } break;
      case 'dash': A.play('dash', { ...pos, vol: 0.6 }); R.fx.dust(e.x, 0.1, e.z, { n: 6, s0: 0.4, s1: 1.4, life: 0.8, a: 0.3 }); if (live) demoNote('AUTOPILOT · DASH JETS: slipping through the bolts'); break;
      case 'pickup': A.play('pickup', { ...pos, vol: 0.9 }); if (live) { popup(POWERUPS[e.kind].name, e.x, e.z, '#' + POWERUPS[e.kind].color.toString(16).padStart(6, '0'), true); demoNote(`AUTOPILOT · grabbed ${POWERUPS[e.kind].name}`); } break;
      case 'pwend': A.play('pwend', { vol: 0.5 }); break;
      case 'drop': A.play('drop', { ...pos, vol: 0.6 }); if (live) onboard(W, 'drop'); break;
      case 'mortar': A.play('mortar', { ...pos, vol: 0.7 }); break;
      case 'mineland': A.play('mineland', { ...pos, vol: 0.5 }); R.fx.dust(e.x, 0.1, e.z, { n: 3, s0: 0.3, s1: 1, life: 0.8, a: 0.3 }); break;
      case 'minebeep': A.play('beep', { ...pos, vol: 0.6, gap: 0.05 }); break;
      case 'mineboom': R.fx.explode(e.x, 0.4, e.z, 1.4, { color: 0xff8a3a }); R.shake(0.3); A.play('mineboom', { ...pos, vol: 0.9 }); break;
      case 'seekerwarn': A.play('seekwarn', { vol: 0.7 }); if (live) { caption('SEEKER INBOUND · MOVE ON', 2.5); say('seeker', { chance: 0.5, cd: 90 }); } break;
      case 'seeker': A.play('seekin', { ...pos, vol: 1 }); R.shock(e.x, e.z, 1); R.fx.ring(e.x, 0, e.z, 3, 0xff3a2a); R.flashScreen(0.15, 0xff3a2a); break;
      case 'seekerhit': R.fx.sparks(e.x, 1.4, e.z, { n: 6, r: 1, g: 0.4, b: 0.3 }); A.play('block', { ...pos, vol: 0.3, gap: 0.06 }); break;
      case 'spot': A.play('charge', { ...pos, vol: 0.25, gap: 0.2 }); break;
      case 'rage': A.play('charge', { ...pos, vol: 0.6 }); R.fx.ring(e.x, 0, e.z, 1.5, 0x7dfff0); break;
      case 'bossin': {
        const D = BOSSES[e.key];
        banner(D.name, W.mode === 'endless' ? `FLOOR ${W.floor + 1} · LIFT GUARD` : `SECTOR ${W.sector + 1} · LIFT GUARD`, 3);
        A.play('bossroar', { ...pos, vol: 1, gap: 0 }); R.frameShot([[e.x, e.z]], 2.0, 10); R.shake(0.4);
        say('boss', { key: true, delay: 1.2 });
        break;
      }
      case 'bossatk': A.play(e.kind === 'charge' ? 'bosscharge' : e.kind === 'sweep' ? 'beam' : e.kind === 'stomp' || e.kind === 'slam' ? 'bosscharge' : 'charge', { ...pos, vol: 0.75, gap: 0.1 }); break;
      case 'bossfire': A.play('zap', { ...pos, vol: e.soft ? 0.35 : 0.75, gap: 0.05 }); break;
      case 'stomp': case 'slam': A.play(e.k, { ...pos, vol: 1 }); R.shake(0.5); R.shock(e.x, e.z, 0.8); R.quake(e.x, e.z, e.k === 'stomp' ? 1 : 0.8); R.fx.dust(e.x, 0.2, e.z, { n: 16, s0: 1, s1: 3, life: 2, a: 0.4, jit: 4 }); if (live) rumble(0.6, 0.5, 220); break;
      case 'bosscrash': A.play('slam', { ...pos, vol: 1 }); R.shake(0.6); R.fx.sparks(e.x, 1.5, e.z, { n: 30, speed: 8 }); if (live) caption('IT HIT THE PILLAR · STUNNED · DOUBLE DAMAGE', 2); break;
      case 'vents': if (live) caption('VENTS OPEN · DOUBLE DAMAGE', 1.4); break;
      case 'bosshit': R.fx.sparks(e.x, 1.6, e.z, { n: e.crit ? 10 : 5, speed: 5 }); bossHitFx(e); A.play('bosshit', { ...pos, vol: 0.45, gap: 0.05 }); break;
      case 'headhit': R.fx.sparks(e.x, 1.9, e.z, { n: 5 }); A.play('bosshit', { ...pos, vol: 0.4, gap: 0.05 }); break;
      case 'headdown': R.fx.explode(e.x, 1.9, e.z, 1.4, { metal: true }); R.shake(0.3); A.play('boomM', { ...pos, vol: 0.9 }); if (live) popup('HEAD DOWN', e.x, e.z, '#ffb347', true); break;
      case 'bossphase': A.play('bossroar', { ...pos, vol: 0.9 }); R.shake(0.45); R.flashScreen(0.25, 0xffb347); if (live) caption(`${BOSSES[e.key].name} · PHASE ${e.phase + 1}`, 2.2); break;
      case 'bossdown':
        R.bossWreck(e.x, e.z); R.fx.explode(e.x, 2, e.z, 3, { metal: true }); setTimeout(() => R.fx.explode(e.x + 1, 2.5, e.z - 0.5, 2.4, { metal: true }), 350); setTimeout(() => R.fx.explode(e.x - 1, 1.5, e.z + 0.6, 2.6, { metal: true }), 700);
        R.shake(1); R.flashScreen(0.6, 0xffe0b0); A.play('boomL', { ...pos, vol: 1, gap: 0 });
        if (live) { R.frameShot([[e.x, e.z]], 2.2); slowmo(0.3, 1.5, 'bossdown'); rumble(1, 1, 600); say('bossdown', { key: true, delay: 1.4 }); if (G.mode !== 'online') { G.pendingClip = { n: W.n, kind: 'boss' }; if (window.__vm.onKey) window.__vm.onKey(W, 'boss'); } }
        break;
      case 'lift': A.play('lift', { vol: 0.9 }); if (live) { liftBanner(W); } break;
      case 'liftup': A.play('liftup', { vol: 1 }); if (live) banner(W.mode === 'endless' ? 'GOING DOWN' : 'SECTOR CLEAR', W.mode === 'endless' ? `FLOOR ${W.floor + 2}` : SECTORS[W.sector].name, 2.4); break;
      case 'floor': R.setLook(W.k); A.playMusic(SECTORS[W.k].music); if (live) banner(`FLOOR ${e.floor + 1}`, SECTORS[W.k].name, 2.6); break;
      case 'upgrade': if (live) caption(`FLOOR BONUS · ${UPGRADES[e.up].name} ${e.lv}`, 3); A.play('upgrade', { vol: 0.7 }); break;
      case 'life': A.play('life', { vol: 0.9 }); if (live) popup('+1 LIFE', W.players[0].x, W.players[0].z, '#5dff8a', true); break;
      case 'summon': case 'drones': A.play('door', { ...pos, vol: 0.6 }); break;
      case 'warpin': A.play('warp', { ...pos, vol: 0.55, gap: 0.08 }); R.fx.ring(e.x, 0, e.z, 1.6, 0xff6a4a); R.fx.flash(e.x, 1.4, e.z, 4, 0xff7a5a, 0.35); R.fx.sparks(e.x, 1.2, e.z, { n: 12, speed: 5, r: 1, g: 0.5, b: 0.35 }); break;
      case 'tut': if (live) tutorial(e.key); break;
      case 'zone': {
        R.zoneFx(e);
        const snd = e.style === 'storm' ? 'thunder' : e.style === 'frost' ? 'frost' : e.style === 'molten' || e.style === 'pools' ? 'molten' : 'electro';
        A.play(snd, { ...pos, vol: e.style === 'storm' ? 0.85 : 0.6, gap: 0.07 });
        if (e.style === 'storm') R.shake(0.12);
        break;
      }
    }
  }
}
const CAUSE = { wall: 'ELECTRIFIED WALL', bolt: 'SHOT DOWN', robot: 'CAUGHT BY A ROBOT', seeker: 'THE SEEKER CAUGHT YOU', mine: 'MINE', boss: 'CRUSHED', beam: 'CUT BY THE BEAM', stomp: 'SHOCKWAVE', slam: 'SLAMMED', molten: 'MOLTEN METAL', frost: 'FROZEN', plasma: 'PLASMA', storm: 'LIGHTNING', shock: 'SHOCKED', data: 'DATA BURN' };
function assistAim(W, p, In) {
  if (!In.fire || In.src === 'mouse' || In.src === 'none' || settings.assist === 'off') return;
  const a0 = In.plant ? (In.mx || In.mz ? Math.atan2(In.mz, In.mx) : p.aim) : In.ax || In.az ? Math.atan2(In.az, In.ax) : p.aim;
  const strong = settings.assist === 'strong', cone = strong ? 0.42 : 0.24, pull = strong ? 1 : 0.6;
  let best = null, bs = 1e9;
  const consider = (x, z, vx, vz, r) => {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d > 18 || d < 0.3) return;
    const da = Math.abs(angDiff(a0, Math.atan2(z - p.z, x - p.x)));
    if (da > cone + Math.atan(r / d)) return;
    const sc = da * 8 + d * 0.12;
    if (sc < bs) { bs = sc; best = { x, z, vx, vz, d }; }
  };
  for (const e of W.robots) if (e.hp > 0 && e.boot < 0.3) consider(e.x, e.z, e.vx, e.vz, e.r);
  const B = W.boss;
  if (B && B.state === 'fight') { const h = B.heads.filter((q) => q.hp > 0); if (h.length) for (const q of h) consider(q.x, q.z, 0, 0, 0.6); else consider(B.x, B.z, 0, 0, B.r); }
  if (!best) return;
  const tt = best.d / F.shotV, aim = Math.atan2(best.z + best.vz * tt - p.z, best.x + best.vx * tt - p.x);
  const a = a0 + angDiff(a0, aim) * pull;
  if (In.plant) { In.mx = Math.cos(a); In.mz = Math.sin(a); } else { In.ax = Math.cos(a); In.az = Math.sin(a); }
}
// slow motion only on heavy moments (a death in the demo / AI playthrough, a boss going down); the log lets the checks see why
function slowmo(scale, t, why) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); (G.slowLog ||= []).push({ why, mode: G.mode, t: G.W ? +G.W.t.toFixed(2) : 0, shot: R.shot ? R.shot.pts.length : 0 }); if (G.slowLog.length > 50) G.slowLog.shift(); }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  runTally(W);
  if (G.srOn) srBest(W);
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'CONTAINED', 'CO-OP'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (W.mode === 'endless') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'CONTAINED', `ENDLESS FACILITY · FLOOR ${W.floor + 1} · ${W.depth} ROOMS`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT, k = bestKey(W.diff, s);
    if (!best[k] || t < best[k]) { best[k] = t; store('vm.best.v1', best); }
    const sc = W.score - G.run.score0;
    G.run.newBest = { time: best[k] === t, score: !bestSc[k] || sc > bestSc[k] };
    if (G.run.newBest.score) { bestSc[k] = sc; store('vm.bestsc.v1', bestSc); }
    G.run.secScore = sc;
    reach = Math.max(reach, Math.min(4, s + 1)); store('vm.reach.v1', reach);
    const got = [];
    const award = (id) => { if (W.diff !== 'easy' && !medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0) award(`s${s}clean`);
    if (W.stats.skipped === 0) award(`s${s}sweep`);
    if (t <= parTime(s)) award(`s${s}par`);
    store('vm.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6, gap: 0 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1;
    G.run.salvage += Math.floor((W.score - G.run.score0) / SALVAGE);
    G.run.lastTime = t; G.run.got = got;
    G.run.rank = sectorRank(W);
    if (!bestRank[k] || RANKS.indexOf(G.run.rank) < RANKS.indexOf(bestRank[k])) { bestRank[k] = G.run.rank; store('vm.rank.v1', bestRank); }
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'FACILITY BREACHED', 'ALL FIVE SECTORS CLEARED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  results(W, 'CONTAINED', `SECTOR ${s + 1} · ${SECTORS[s].name} · ${roomLabel(W)}`);
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
  G.run.salvage += Math.floor((W.score - G.run.score0) / SALVAGE);
  G.run.lastTime = W.secT;
  if (s >= SECTORS.length - 1) {
    G.run.got = [];
    results(W, 'AI PLAYTHROUGH COMPLETE', `ALL FIVE SECTORS · ${G.run.tries ? G.run.tries + (G.run.tries > 1 ? ' RETRIES' : ' RETRY') : 'NO RETRIES'}`);
    return;
  }
  const bought = aiShop();
  G.run.picks = bought.by;
  G.state = 'upgrade'; setHud(false);
  $('up-title').textContent = `SECTOR ${s + 1} CLEAR`;
  $('up-why').classList.add('hidden');
  $('up-sub').textContent = `${fmtT(W.secT)} · AUTOPILOT BOUGHT: ${bought.length ? bought.join(', ') : 'NOTHING YET (SAVING UP)'}`;
  $('up-replay').classList.toggle('hidden', !G.clip);
  $('next-sub').textContent = `Sector ${s + 2} · ${SECTORS[s + 1].name} · starts in a moment`;
  $('bank-sub').textContent = 'Stop watching: back to the title';
  renderUpgrades();
  show('upgrades', false);
  A.play('upgrade', { gap: 0, vol: 0.7 });
  clearTimeout(G.ptT);
  G.ptT = setTimeout(() => { if (G.mode === 'playthrough' && G.state === 'upgrade') beginSector(s + 1); }, 6000);
}
function upgrades(W) {
  G.state = 'upgrade'; setHud(false);
  G.run.picks = null;
  $('up-title').innerHTML = `SECTOR ${W.sector + 1} CLEAR <span class="rank r${G.run.rank}" title="${rankWhy(W)}">RANK ${G.run.rank}</span>`;
  $('up-why').innerHTML = rankLine(W); $('up-why').classList.remove('hidden');
  const nb = G.run.newBest || {}, rec = [nb.time && 'BEST TIME', nb.score && 'BEST SECTOR SCORE'].filter(Boolean).join(' + ');
  $('up-sub').textContent = `${fmtT(G.run.lastTime)} · ${G.run.secScore.toLocaleString()} PTS${rec ? ' · NEW ' + rec : ''} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR SUIT'}`;
  $('up-replay').classList.toggle('hidden', !G.clip);
  $('next-sub').textContent = `Sector ${W.sector + 2} · ${SECTORS[W.sector + 1].name}`;
  $('bank-sub').textContent = 'Save your score to the boards and stop';
  renderUpgrades();
  show('upgrades', false);
  A.playMusic('title');
  say('clear', { key: true, delay: 1.5 });
}
function renderUpgrades() {
  $('salv').textContent = G.run.salvage.toLocaleString();
  $('upgrid').innerHTML = UP_KEYS.map((k) => {
    const U = UPGRADES[k], lv = G.run.up[k] || 0, max = lv >= U.max, cost = UP_COST[lv];
    const poor = !max && G.run.salvage < cost, pick = G.run.picks && G.run.picks[k];
    return `<button class="upg ${max ? 'max' : ''} ${poor ? 'poor' : ''} ${pick ? 'pick' : ''}" data-up="${k}" style="--uc:${U.color}">${pick ? `<em class="aitag">AUTOPILOT PICK${pick > 1 ? ' ×' + pick : ''}</em>` : ''}<i>${U.icon}</i><b>${U.name}</b><span class="lvl">${Array.from({ length: U.max }, (_, i) => `<em class="${i < lv ? 'on' : ''}"></em>`).join('')}</span><small>${U.desc}</small><span class="cost">${max ? 'FITTED' : cost + ' SALVAGE'}</span></button>`;
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
// sector RANK from the cleared sector's own stats (presentation only): no deaths, par time and no skipped rooms each count
const RANKS = ['S', 'A', 'B', 'C'];
function sectorRank(W) {
  const d = W.stats.deaths, t = W.secT, par = parTime(W.sector);
  const p = (d === 0 ? 2 : d <= 1 ? 1 : 0) + (t <= par ? 2 : t <= par * 1.3 ? 1 : 0) + (W.stats.skipped === 0 ? 1 : 0);
  return p >= 5 ? 'S' : p >= 3 ? 'A' : p >= 1 ? 'B' : 'C';
}
// r3: the same three counts, each marked by what it earned (green: full marks, white: some, red: none)
function rankLine(W) {
  const d = W.stats.deaths, t = W.secT, par = parTime(W.sector), sk = W.stats.skipped;
  const m = (pts, txt) => `<span class="${pts === 2 ? 'ok' : pts === 1 ? '' : 'no'}">${txt}</span>`;
  return `${m(d === 0 ? 2 : d <= 1 ? 1 : 0, `${d} ${d === 1 ? 'LIFE' : 'LIVES'} LOST`)} · ${m(t <= par ? 2 : t <= par * 1.3 ? 1 : 0, `${fmtT(t)} / PAR ${fmtM(par)}`)} · ${m(sk === 0 ? 2 : 0, `${sk} ${sk === 1 ? 'ROOM' : 'ROOMS'} SKIPPED`)}`;
}
function rankWhy(W) { return `${W.stats.deaths} lives lost · ${fmtT(W.secT)} (par ${fmtT(parTime(W.sector))}) · ${W.stats.skipped} rooms skipped`; }
// run totals: every campaign / AI playthrough sector builds a fresh world, so the run's stats add up here (once per world)
function runTally(W) {
  if (!G.run || W.mode !== 'campaign' || (G.mode !== 'campaign' && G.mode !== 'playthrough') || G.run.tallied === W) return;
  G.run.tallied = W;
  const t = G.run.tot ||= { n: 0, secs: 0, kills: 0, lured: 0, cleared: 0, rooms: 0, deaths: 0, clears: 0, first: W.sector, last: W.sector };
  t.n++; t.secs += W.secT; t.kills += W.stats.kills; t.lured += W.stats.lured; t.cleared += W.stats.cleared; t.rooms += W.stats.rooms; t.deaths += W.stats.deaths;
  if (W.result === 'clear') t.clears++;
  t.first = Math.min(t.first, W.sector); t.last = Math.max(t.last, W.sector);
}
// the results score counts up to its value (the text always ends on the exact score)
function tallyScore(el, score) {
  clearInterval(G.tallyI);
  if (!el || score <= 0) return;
  const t0 = performance.now(), dur = 900;
  el.textContent = '0';
  G.tallyI = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / dur);
    el.textContent = Math.round(score * (1 - (1 - k) ** 3)).toLocaleString();
    if (k >= 1) clearInterval(G.tallyI);
  }, 40);
}
function runTotals(W) { const t = G.run && G.run.tot; return t && G.run.tallied === W && t.n > 1 ? t : null; }
function results(W, title, sub) {
  G.state = 'results'; setHud(false);
  $('res-title').textContent = title; $('res-sub').textContent = sub + ' · ' + DL(W.diff);
  const st = [['SCORE', W.score.toLocaleString()]];
  const tot = runTotals(W);
  if (tot) st.push(['RUN TIME', `${fmtT(tot.secs)} <small>S${tot.first + 1}-S${tot.last + 1} · ${tot.clears} CLEARED</small>`], ['ROBOTS DESTROYED', tot.kills], ['LURED INTO WALLS AND FIRE', tot.lured], ['ROOMS CLEARED', `${tot.cleared} / ${tot.rooms}`], ['LIVES LOST', tot.deaths]);
  else {
  if (W.mode === 'endless') st.push(['DEEPEST FLOOR', W.floor + 1], ['ROOMS', W.depth]);
  else st.push(['SECTOR TIME', fmtT(W.secT)]);
  st.push(['ROBOTS DESTROYED', W.stats.kills], ['LURED INTO WALLS AND FIRE', W.stats.lured], ['ROOMS CLEARED', `${W.stats.cleared} / ${W.stats.rooms}`], ['LIVES LOST', W.stats.deaths]);
  }
  $('res-stats').innerHTML = st.map(([a, b], i) => i ? `<div class="stat tally" style="animation-delay:${(0.35 + i * 0.12).toFixed(2)}s"><span>${a}</span><b>${b}</b></div>` : `<div class="stat hero"><span>${a}</span><b>${b}</b></div>`).join('');
  tallyScore($('res-stats').querySelector('.hero b'), W.score);
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => { const m = MEDALS.find((q) => q.id === id); return `<span class="medal on new">🏅 ${m.name} · S${m.sector + 1}</span>`; }).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The boss going down' : 'The last hit, exactly as it happened';
  const board = boardOf(W.mode, W.diff);
  G.board = board; G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && G.mode !== 'demo' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    G.ini = { chars: board.initials().split(''), i: 0, score: W.score, extra: W.mode === 'endless' ? `F${W.floor + 1} R${W.depth}` : `S${W.sector + 1}${W.result === 'clear' && W.sector === 4 ? ' CLEAR' : ''}` };
    $('ini-wrap').classList.remove('hidden');
    renderIni();
  }
  show('results', false);
}
function renderIni() { const b = $('ini').querySelectorAll('b'); for (let i = 0; i < 3; i++) { b[i].textContent = G.ini.chars[i]; b[i].className = i === G.ini.i ? 'cur' : ''; } }
async function finishResults() {
  if (G.ini) { const q = G.ini; G.ini = null; await G.board.submit(q.chars.join(''), q.score, q.extra); }
  toTitle();
}

// ------------------------------------------------------------------ instant replay
function captureClip(W) {
  const p = G.pendingClip;
  if (!p || (W.n < p.n + Math.round(1.6 / STEP) && !W.over)) return;
  G.pendingClip = null;
  const c = REC.clip(p.n);
  if (c) { c.kind = p.kind; G.clip = c; }
}
function playReplay() {
  if (!G.clip) return;
  G.afterReplay = { screen: G.screen, state: G.state };
  hideScreens();
  G.replay = new Replay(cloneWorld(G.clip.snap), G.clip.inputs, G.clip.keyN, G.clip.endN);
  G.state = 'replay';
  $('letterbox').classList.remove('hidden');
  setHud(false);
  A.play('rewind', { gap: 0 });
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
  if (G.mode === 'online') { show('pause'); $('pause-sub').textContent = 'ONLINE · THE FACILITY KEEPS RUNNING'; G.state = 'paused-online'; return; }
  G.state = 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.W.mode === 'endless' ? `ENDLESS · FLOOR ${G.W.floor + 1} · ${roomLabel(G.W)}` : `SECTOR ${G.W.sector + 1} · ${roomLabel(G.W)}`;
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
  netStatus(`${peer.ini || 'An agent'} is here.` + (NET.host ? ' Pick the route and start.' : ' Waiting for the host to start…'));
  $('net-go').classList.toggle('hidden', !NET.host);
  if (NET.host) setSel($('net-go'));
  say('partner', { key: true });
}
function netLeft(why) {
  if (G.mode === 'online' && G.state !== 'results') { caption(why === 'lost' ? 'CONNECTION LOST' : 'YOUR PARTNER LEFT', 4); setTimeout(() => { if (G.mode === 'online') toTitle(); }, 2500); }
  else netStatus(why === 'lost' ? 'Connection lost' : 'Your partner left', 'error');
}
function hostStart(extra) {
  const route = settings.netRoute;
  const cfg = route === 'ef' ? { gm: 'endless', seed: newSeed(), diff: settings.diff } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] }, diff: settings.diff };
  if (extra) Object.assign(cfg, extra);   // the online check starts at the lift room ({ boss: true }) or a few rooms in ({ room: 3 })
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'endless' ? 'endless' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives: (cfg.lives | 0) || START_LIVES + 1 + (DIFFICULTY[cfg.diff] || DIFFICULTY.normal).lives, noTut: true, noGrace: true, diff: cfg.diff, room: cfg.room | 0, boss: !!cfg.boss });
  NET.bind(W);
  enterPlay(W);
  if (G.srOn) srAdd(SR.runs, 'coop');
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  banner('CO-OP', cfg.gm === 'endless' ? 'ENDLESS FACILITY' : SECTORS[cfg.sector || 0].name, 3);
  if (document.hidden && !G.fixed) bgTicks(true);
}
window.__vm.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'endless': A.play('uiok', { gap: 0 }); startEndless(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': buildSuits(); show('options'); syncSegs(); break;
    case 'help': show('help'); break;
    case 'record': showRecord(); break;
    case 'back': A.play('uiback', { gap: 0 }); goBack(); break;
    case 'next': A.play('uiok', { gap: 0 }); clearTimeout(G.ptT); beginSector(G.run.sector + 1); break;
    // stop at the shop: a campaign banks its score (results + initials), the AI PLAYTHROUGH just leaves
    case 'bank': A.play('uiback', { gap: 0 }); clearTimeout(G.ptT); if (G.mode === 'playthrough' || !G.W) toTitle(); else results(G.W, 'RUN ENDED', `SECTOR ${G.W.sector + 1} CLEARED · SCORE BANKED`); break;
    case 'replay': playReplay(); break;
    case 'done': finishResults(); break;
    case 'resume': resume(); break;
    case 'pause': pause(); break;
    case 'quit': clearTimeout(G.ptT); toTitle(); break;
    case 'net-quick': NET.quick({ ini: HS.initials() }); break;
    case 'net-host': { const code = randomCode(4); $('room-code').textContent = code; $('room-wrap').classList.remove('hidden'); NET.connect(NET_ROOM + code, 'host', { ini: HS.initials() }); break; }
    case 'net-join': { const code = cleanCode($('join-code').value); if (code.length !== 4) { netStatus('Type the 4-letter room code', 'error'); return; } NET.connect(NET_ROOM + code, 'join', { ini: HS.initials() }); netStatus('Joining…'); break; }
    case 'net-go': hostStart(); break;
    case 'net-back': NET.close(); goBack(); break;
  }
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act], [data-up], [data-sector], [data-tab], [data-hd], [data-tt], [data-td], .seg button');
  if (!t || t.matches('.seg button[disabled]')) return;
  A.unlock();
  if (t.dataset.act) act(t.dataset.act);
  else if (t.dataset.up) buy(t.dataset.up);
  else if (t.dataset.sector !== undefined) { if (!t.hasAttribute('disabled')) { A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sector); } }
  else if (t.dataset.tab) renderScores(t.dataset.tab);
  else if (t.dataset.hd) renderScores(G.scoreTab || 'campaign', t.dataset.hd);
  else if (t.dataset.tt) renderTitleBoard(t.dataset.tt, G.titleDiff || settings.diff);
  else if (t.dataset.td) renderTitleBoard(G.titleTab, t.dataset.td);
  else if (t.parentElement.dataset.opt) { settings[t.parentElement.dataset.opt] = t.dataset.v; saveSettings(); applySettings(); syncSegs(); A.play('uimove', { gap: 0 }); if (t.parentElement.dataset.opt === 'diff' && G.state === 'title') renderTitleBoard(G.titleTab, settings.diff); }
});
// touch: ▲ / ▼ under each letter step it either way; tapping a letter selects it (tap again: next letter)
$('ini').addEventListener('click', (e) => {
  if (!G.ini) return;
  const a = e.target.closest('[data-ini]');
  if (a) { G.ini.i = +a.dataset.ini; cycleIni(+a.dataset.d); return; }
  const b = e.target.closest('b'); if (!b) return;
  const i = [...$('ini').querySelectorAll('b')].indexOf(b); if (G.ini.i === i) cycleIni(1); G.ini.i = i; renderIni();
});
for (const inp of document.querySelectorAll('[data-set]')) {
  inp.value = settings[inp.dataset.set];
  inp.addEventListener('input', () => { settings[inp.dataset.set] = +inp.value; saveSettings(); applySettings(); });
}
buildSuits();
function syncSegs() { for (const s of document.querySelectorAll('.seg')) for (const b of s.children) b.classList.toggle('on', String(settings[s.dataset.opt]) === b.dataset.v); }
function applySettings() {
  if ($('diff-desc')) $('diff-desc').textContent = DIFFICULTY[settings.diff].desc;
  if (G.state === 'title') $('title-best').textContent = titleBest();
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
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>SECTOR ${i + 1} · ${BOSSES[s.boss].name}</b><span>${s.name}</span><small>${open ? (best[bestKey(settings.diff, i)] ? 'BEST ' + fmtT(best[bestKey(settings.diff, i)]) + ' · ' + (bestSc[bestKey(settings.diff, i)] || 0).toLocaleString() + ' PTS' + (bestRank[bestKey(settings.diff, i)] ? ' · RANK ' + bestRank[bestKey(settings.diff, i)] : '') + ' · ' + DL(settings.diff) : 'NOT CLEARED YET') : 'LOCKED'}</small><div class="md">${m}</div></button>`;
  }).join('');
}
function buildMedals() {
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} EARNED`;
  $('medlist').innerHTML = SECTORS.map((s, i) => `<h3>SECTOR ${i + 1} · ${s.name}</h3><div class="medrow">${MEDALS.filter((m) => m.sector === i).map((m) => `<span class="medal ${medals.has(m.id) ? 'on' : ''}" title="${m.desc}">${medals.has(m.id) ? '🏅' : '○'} ${m.name} <small style="opacity:.7">· ${m.desc}</small></span>`).join('')}</div>`).join('');
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rowHTML = (r, i) => `<tr><td>${i + 1}</td><td>${esc(r.initials)}</td><td>${esc(r.extra || (r.level ? 'S' + r.level : ''))}</td><td>${Number(r.score).toLocaleString()}</td></tr>`;
async function renderScores(tab, diff = G.scoreDiff || settings.diff) {
  G.scoreTab = tab; G.scoreDiff = diff;
  for (const b of document.querySelectorAll('[data-tab]')) b.classList.toggle('primary', b.dataset.tab === tab);
  for (const b of document.querySelectorAll('[data-hd]')) b.classList.toggle('primary', b.dataset.hd === diff);
  const board = boardOf(tab, diff);
  const L = board.local();
  $('hs-local').innerHTML = L.length ? L.map(rowHTML).join('') : '<tr><td></td><td>No scores yet</td></tr>';
  $('hs-global').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => { const k = bestKey(diff, i); return `<div class="stat"><span>S${i + 1} · ${s.name}</span><b>${best[k] ? fmtT(best[k]) : '—'}<small> · ${bestSc[k] ? bestSc[k].toLocaleString() + ' PTS' : '—'}</small></b></div>`; }).join('');
  const g = await board.fresh();
  if (G.scoreTab !== tab || G.scoreDiff !== diff) return;
  $('hs-global').innerHTML = g && g.length ? g.map(rowHTML).join('') : `<tr><td></td><td>${g ? 'No scores yet' : 'Offline'}</td></tr>`;
}
// the world board on the title screen, with tabs per mode and difficulty (the local table when offline)
async function renderTitleBoard(tab = 'campaign', diff = settings.diff) {
  G.titleTab = tab; G.titleDiff = diff;
  for (const b of document.querySelectorAll('[data-tt]')) b.classList.toggle('on', b.dataset.tt === tab);
  for (const b of document.querySelectorAll('[data-td]')) b.classList.toggle('on', b.dataset.td === diff);
  const board = boardOf(tab, diff);
  $('tb-list').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('tb-head').textContent = 'WORLD TOP 10';
  const g = await board.fresh();
  if (G.titleTab !== tab || G.titleDiff !== diff) return;
  if (g && g.length) { $('tb-list').innerHTML = g.map(rowHTML).join(''); return; }
  const L = board.local();
  $('tb-head').textContent = g ? 'WORLD TOP 10' : 'OFFLINE · THIS DEVICE';
  $('tb-list').innerHTML = (g ? [] : L).length ? L.map(rowHTML).join('') : `<tr><td></td><td>${g ? 'No scores yet: be the first' : 'No scores yet'}</td></tr>`;
}

// keyboard / pad in menus and in play
I.on('any', () => { G.idleT = 0; if (G.mode === 'demo' && (G.state === 'play' || G.state === 'ended') && performance.now() - G.demoStartT > 600) { A.unlock(); toTitle(); } });
// Escape / P / pad Start never leave the results (initials entry) or the shop: that would throw away the score or the run
const KEEP = (s) => s === 'results' || s === 'upgrades';
I.on('pause', () => { if (G.state === 'replay') { endReplay(); return; } if (G.screen === 'upgrades' && G.mode === 'playthrough') { act('bank'); return; } if (G.ini || KEEP(G.screen)) return; if (G.state === 'play') pause(); else if (G.state === 'paused' || G.state === 'paused-online') resume(); else if (G.screen && G.screen !== 'title') act('back'); });
I.on('confirm', () => { if (G.screen && selEl) selEl.click(); });
I.on('back', () => { if (G.screen && G.screen !== 'title' && !KEEP(G.screen)) act('back'); });
I.on('key', (k, e) => {
  A.unlock();
  if (G.state === 'replay' && (k === 'Enter' || k === 'Space')) { endReplay(); return; }   // Escape / P end it through 'pause'
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
  else if (k === 'Backspace' && G.screen !== 'title' && !KEEP(G.screen)) act('back');
});
document.addEventListener('pointerdown', () => A.unlock(), { capture: true });
addEventListener('pagehide', () => srSave(true));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && G.state === 'play') pause();
  if (document.hidden) srSave(true);
  bgTicks(document.hidden && G.mode === 'online' && !G.fixed);
  // nothing to hear from a tab nobody is looking at (the co-op facility keeps running in it)
  if (A.master && A.ctx) A.master.gain.setTargetAtTime(document.hidden ? 0 : A.vol.master, A.ctx.currentTime, 0.05);
});
// ------------------------------------------------------------------ online: the facility keeps running in a hidden tab
// requestAnimationFrame stops in a background tab, so a host whose tab was hidden froze the run and the guest got
// no snapshots. A dedicated worker (js/tick.js: worker timers are not throttled) ticks 40 times a second while an
// online tab is hidden and the same playStep() runs on it: the same fixed-step step(), snapshots (host) and inputs
// (guest) keep flowing, nothing is rendered or heard, the hidden player's suit gets no input (paused-online).
// Online play is never recorded and step() is untouched, so replays stay bit exact. Snapshots carry 'aw' (host
// away) so the guest can say so; if snapshots stop anyway (an old browser, a frozen tab) the guest says HOST PAUSED.
let bgWorker = null;
function bgTicks(on) {
  if (on && !bgWorker) {
    try { bgWorker = new Worker(new URL('./tick.js?v=10', import.meta.url)); bgWorker.onmessage = bgTick; } catch (e) { bgWorker = null; console.warn('background tick', e); return; }
  }
  if (bgWorker) bgWorker.postMessage(on ? 25 : 0);
}
function bgTick() {
  if (!document.hidden || G.fixed) return;
  const now = performance.now(), dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  G.bgTicks = (G.bgTicks || 0) + 1;
  if (G.slowT > 0) { G.slowT -= dt; if (G.slowT <= 0) { G.timeScale = 1; A.setRate(1); } }
  if (G.mode !== 'online' || (G.state !== 'play' && G.state !== 'paused-online')) return;
  G.hiddenRun = true;
  try { playStep(dt); } finally { G.hiddenRun = false; }
}
I.stickUI = (side, s) => {
  const el = $('stick-' + side);
  if (!s) { el.classList.remove('on'); return; }
  el.classList.add('on');
  el.style.left = s.sx + 'px'; el.style.top = s.sy + 'px';
  const k = el.firstElementChild, dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy), m = Math.min(l, 52) / (l || 1);
  k.style.transform = `translate(${dx * m}px, ${dy * m}px)`;
};

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
  // r3: your suit colourway on your infiltrator (online co-op keeps the fixed host / guest colours on both pages)
  if (R.setSuit) R.setSuit(1, G.mode === 'online' ? SUITS[0] : suitNow(), SUITS[0]);
  const me = myPlayer(cur);
  const menu = G.state === 'title' || ['sectors', 'online', 'scores', 'medals', 'options', 'help', 'record'].includes(G.screen) && G.mode === 'title';
  R.updateCamera(dt, { me: me && me.alive ? me : null, cine: menu, shake: +settings.shake, W: cur, auto: settings.cam !== 'room' && G.state !== 'replay' });
  A.setListener(R.camera);
  if (G.state === 'play' || G.state === 'paused-online' || G.state === 'replay') loops(cur, dt);
  R.render(dt, { fade: cur.phase === 'transit' ? Math.min(1, (0.55 - cur.phaseT) / 0.4) : 0 });
  // on a small screen a banner gets out of the way as soon as a robot takes aim
  if (G.bannerT > 0.3 && G.state === 'play' && G.W && (innerWidth < 900 || innerHeight < 560) && G.W.robots.some((e) => e.aimT > 0)) G.bannerT = 0.3;
  if (G.bannerT > 0) { G.bannerT -= dt; if (G.bannerT <= 0) $('banner').classList.add('hidden'); }
  if (G.tutT > 0 && G.state !== 'paused') { G.tutT -= dt; if (G.tutT <= 0) $('tut').classList.add('hidden'); }
  if (G.capT > 0 && G.state !== 'paused') { G.capT -= dt; if (G.capT <= 0) $('caption').classList.add('hidden'); }
  srSave();
}
function playStep(dt) {
  const W = G.W;
  G.acc += dt * G.timeScale;
  if (G.srOn && G.state === 'play') { SR.time += dt; srDirty = true; }
  let n = 0;
  const online = G.mode === 'online', guest = online && !NET.host;
  const live = !G.hiddenRun;
  if (guest) handleEvents(NET.guestSync(W), W, live);
  while (G.acc >= STEP && n < 12) {
    if (!online) REC.tick(W);
    const me = myPlayer(W);
    if (me) {
      if (G.ai) me.input = G.ai.control(W, me);
      else { me.input = G.state === 'play' ? I.control(me.x, me.z) : { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false }; assistAim(W, me, me.input); }
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    step(W, STEP);
    let ev = drainEvents(W);
    if (guest) ev = ev.filter((e) => (e.pid === 2 && ['fire', 'shield', 'death', 'emp', 'plate', 'dash', 'brush'].includes(e.k)) || e.k === 'roomenter');
    if (online && NET.host) NET.hostEvents(ev);
    handleEvents(ev, W, live);
    if (G.srOn) srEvents(ev, W);
    G.acc -= STEP; n++;
    if (W.over) break;
  }
  if (n >= 12) G.acc = 0;
  if (online) { if (NET.host) NET.hostFrame(W, dt); else NET.guestFrame(W, dt); }
  captureClip(W);
  if (!G.hiddenRun) updateHud(W);
  if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 95) W.over = true; }
  if (G.mode === 'demo' || G.mode === 'playthrough') demoCaptions(W, dt);
  // (a key that ends the demo, or quitting, replaces G.W meanwhile: then this world's ending no longer counts)
  if (W.over && (G.state === 'play' || G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => { if (G.W === W && G.state === 'ended') onWorldOver(W); }, G.mode === 'demo' ? 1500 : 1300); }
}
function replayStep(dt) {
  const Rp = G.replay;
  const near = Math.abs(Rp.toKey) < 0.7;
  A.setRate(near ? 0.7 : 1);
  const ev = Rp.advance(dt * (near ? 0.35 : 1));
  handleEvents(ev, Rp.W, false);
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
  for (const e of W.robots) { e.vx = 0; e.vz = 0; }   // the patrol below moves them, not the sim's coasting
  while (G.acc >= STEP && n < 8) { step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  scenicPatrol(W, dt);
  if (W.room.cleared || W.over || W.room.t > 40) scenic(R.lookI);
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 12)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// the title room's robots patrol, turn at walls and now and then fire at a wall (an aim glint, then a spark where
// it lands). Presentation only: the scenic world is never recorded or sent and this uses Math.random, not the
// world's RNG; with no live infiltrator the sim leaves its robots standing.
function scenicPatrol(W, dt) {
  const walls = W.room.walls, r0 = 0.15;
  const blocked = (x, z, r) => Math.abs(x) > ROOM.RW - r || Math.abs(z) > ROOM.RH - r || walls.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r);
  for (const e of W.robots) {
    if (e.hp <= 0 || e.boot > 0 || e.fly) continue;
    const r = (e.r || 0.5) + r0;
    if (e.scT === undefined) { e.scT = 0.5 + Math.random() * 2.5; e.scFire = 2 + Math.random() * 7; e.scV = (ENEMY[e.type].v || 1.5) * (0.45 + Math.random() * 0.2); e.scA = e.a || Math.random() * 6.28; }
    if (e.aimT > 0) {
      e.aimT -= dt;
      if (e.aimT <= 0) {
        e.aimT = 0;
        const c = Math.cos(e.aimA), sn = Math.sin(e.aimA);
        let d = 0.8;
        while (d < 26 && !blocked(e.x + c * d, e.z + sn * d, 0)) d += 0.2;
        R.spark(e.x + c * d, e.z + sn * d, false);
        R.fx.flash(e.x + c * 0.6, 1, e.z + sn * 0.6, 3, 0xff6a3a, 0.15);
      }
      continue;
    }
    e.scT -= dt; e.scFire -= dt;
    if (e.scT <= 0) { e.scA = (e.a || 0) + (Math.random() - 0.5) * 2.6; e.scT = 2 + Math.random() * 3; }
    e.a = (e.a || 0) + Math.max(-dt * 2.2, Math.min(dt * 2.2, angDiff(e.a || 0, e.scA)));
    const v = e.scV, nx = e.x + Math.cos(e.a) * v * dt, nz = e.z + Math.sin(e.a) * v * dt;
    // robots that bump into each other blow up (sim robotContacts): keep clear of the others too
    const crowd = W.robots.some((o) => o !== e && o.hp > 0 && !o.fly && Math.hypot(nx - o.x, nz - o.z) < r + (o.r || 0.5) + 0.35 && Math.hypot(nx - o.x, nz - o.z) < Math.hypot(e.x - o.x, e.z - o.z));
    if (crowd || blocked(nx, nz, r)) { e.scA = e.a + Math.PI * (0.6 + Math.random() * 0.8); e.scT = 1.5 + Math.random() * 2; e.vx = e.vz = 0; }
    else { e.x = nx; e.z = nz; e.vx = Math.cos(e.a) * v; e.vz = Math.sin(e.a) * v; }
    if (e.scFire <= 0) {
      e.scFire = 5 + Math.random() * 7;
      if (e.type !== 'mortar' && e.type !== 'ripper') { e.aimA = e.a; e.aimT = e.aimTot = 0.8; e.burstN = 1; e.vx = e.vz = 0; }
    }
  }
}
// the demo / AI playthrough points out an upgrade or power-up in use (sparingly, after the FITTED caption)
function demoNote(text) { if ((G.mode !== 'demo' && G.mode !== 'playthrough') || (G.capCool || 0) > 2) return; caption(text, 2.4); G.capCool = 5; }
// what the autopilot is up to, now and then
function demoCaptions(W, dt) {
  G.capCool = (G.capCool || 0) - dt;
  if (G.capCool > 0 || !G.ai) return;
  const d = G.ai.debug;
  let text = null;
  if (W.boss && W.boss.state === 'fight') text = W.boss.heads.some((h) => h.hp > 0) ? `AUTOPILOT · taking out ${BOSSES[W.boss.key].name}'s heads first` : `AUTOPILOT · keeping ${BOSSES[W.boss.key].name} at range, reading its tells`;
  else if (d.mode === 'exit') text = W.room.cleared ? 'AUTOPILOT · room clear, heading for the lift' : 'AUTOPILOT · moving on before the Seeker arrives';
  else if (d.mode === 'hunt') text = 'AUTOPILOT · lining up a shot round the wall';
  else if (W.stats.lured > (G.luredSeen || 0)) { text = 'AUTOPILOT · let the robots walk into the wall'; G.luredSeen = W.stats.lured; }
  if (text) { caption(text, 2.6); G.capCool = 6.5; }
}
// robot servos, the Seeker's hum, the electrified walls' buzz
function loops(W, dt) {
  const me = myPlayer(W) || W.players[0];
  let rb = null, rd = 1e9;
  for (const e of W.robots) { if (e.hp <= 0 || !e.moving) continue; const d = Math.hypot(e.x - me.x, e.z - me.z); if (d < rd) { rd = d; rb = e; } }
  A.setLoop('servo', rb ? rb.x : 0, 0.5, rb ? rb.z : 0, rb ? Math.min(1, 6 / Math.max(3, rd)) : 0, 1);
  const S = W.seeker;
  A.setLoop('seeker', S ? S.x : 0, 1.5, S ? S.z : 0, S ? 1 : 0, S ? 1 + Math.min(0.3, W.seekerN * 0.05) : 1);
  let wd = 1e9, wx = 0, wz = 0;
  if (W.room) for (const w of W.room.walls) { const d = wallDist(me.x, me.z, w); if (d < wd) { wd = d; wx = Math.max(w[0], Math.min(w[2], me.x)); wz = Math.max(w[1], Math.min(w[3], me.z)); } }
  A.setLoop('hum', wx, 0.6, wz, me.alive ? Math.max(0, 1 - wd / 3) : 0, 1);
  for (const p of W.players) {
    if (!p.alive) continue;
    const ph = Math.floor(p.walk * 1.2);
    if (G.stepPh[p.id] !== undefined && ph !== G.stepPh[p.id] && Math.hypot(p.vx, p.vz) > 1) A.play('step', { x: p.x, y: 0, z: p.z, vol: 0.2, gap: 0.12, vary: 0.15 });
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
  const now = performance.now();
  G.perfSlow = p75 > 1 / 48 && p75 < 0.25 ? (G.perfSlow || 0) + 1 : 0;
  G.perfFast = p75 < 1 / 75 ? (G.perfFast || 0) + 1 : 0;
  if (now - (G.perfT || 0) < 8000) return;
  if (G.perfSlow >= 2 && R.scale > 0.6) { R.setScale(Math.max(0.6, R.scale - 0.1)); G.perfT = now; G.perfSlow = 0; }
  else if (G.perfFast >= 4 && R.scale < 1) { R.setScale(Math.min(1, R.scale + 0.1)); G.perfT = now; G.perfFast = 0; }
}

// ------------------------------------------------------------------ boot
async function boot() {
  try { await R.warmUp(); } catch (e) { console.warn('warm-up', e); }
  // the other sectors' floors and lighting maps are made after the title is up; a test page has them all before its
  // title (the checks count shader programs and textures from there)
  if (G.fixed || params.has('test')) { try { await R.prepareAll(false); } catch (e) { console.warn('prepare', e); } }
  else R.prepareAll(true).catch((e) => console.warn('prepare', e));
  $('loading').style.opacity = '0';
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  if (params.has('test')) { const m = await import('./tests.js?v=10'); m.runTests(window.__vm); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (G.autopilot) { A.unlock(); if (params.has('endless')) startEndless(); else startCampaign(+params.get('sector') || 0); }
  else if (params.has('room') && !params.has('sector') && isNaN(+params.get('room'))) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  else if (params.has('play')) { A.unlock(); startCampaign(+params.get('sector') || 0); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__vm, {
  tick: (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) tickFrame(dt); },
  startDemo, startCampaign, startEndless, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings,
  noPost: NO_POST, boardKey, LOOKS, DIFF_KEYS, record: SR, SUITS, suitNow,
});
Object.defineProperty(window.__vm, 'W', { get: () => G.W, configurable: true });
boot();
