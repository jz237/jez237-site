// Asteroids 2026 — game flow, controls, scoring, commentary and the frame loop.
import * as THREE from '../vendor/three.module.min.js';
import { F, VERSION, PILOTS, HUMAN, HUMAN2, ARENAS, LADDER, DIFFICULTY, POWERUPS, PERKS, ROSTER, SHADOW, TWISTS, ROCK_KINDS, UPGRADES, UP_KEYS, UP_COST, MEDALS } from './config.js?v=2';
import { makeWorld, step, drainEvents, STEP, shipOf } from './sim.js?v=2';
import { AIPilot } from './ai.js?v=2';
import { Renderer, pickQuality, CALM } from './render.js?v=2';
import { Director } from './director.js?v=2';
import { Audio } from './audio.js?v=2';
import { Input } from './input.js?v=2';
import { UI, $, hex } from './ui.js?v=2';
import { Scores } from './scores.js?v=2';
import { Recorder } from './replay.js?v=2';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=2';

// ------------------------------------------------------------------ settings
const SKEY = 'a26.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 55, sfx: 90, voice: 100, quality: 'auto', camera: 'auto', shake: '1', tactical: 'demo', flash: reduceMotion ? 'reduced' : 'full', replay: 'on', talk: 'on', rumble: 'on', twists: {}, vsOpp: 'human', pilot: 'p1', pilot2: 'p1' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* ignore */ } };
const params = new URLSearchParams(location.search);
function applyCalm() { CALM.on = settings.flash === 'reduced'; document.body.classList.toggle('calm', CALM.on); }
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const D = new Director(R.camera);
const A = new Audio('./');
const I = new Input(R.camera);
const U = new UI();
const HS = new Scores('asteroids-2026');
const REC = new Recorder();
const NET = new Online({ status: onStatus, joined: onJoined, start: (cfg) => onlineRound(cfg), left: onLeft, chat: onChat },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });
const TIPS = [
  'Shoot a rock and its pieces fly the way your shot went: aim the SHARDS at your rival',
  'Glowing shards belong to whoever broke them, and they hit twice as hard',
  'BOOST makes you untouchable for a moment: dash through a shot',
  'Shoot a power-up to claim it from across the belt',
  'Red-veined rocks explode: break them near your rival, not near you',
  'Gold rocks always drop a power-up, and they try to run away',
  'Overdrive fills as you break rocks and take hits: fire faster, ram rocks to dust',
  'The lines are each AI pilot\'s plan: its aim, its course and the threats it sees',
];

const G = {
  state: 'boot', mode: 'attract', W: null, ai: {}, aiList: [], humans: [], sides: null, cfg: null,
  stage: 0, diff: 'normal', score: 0, continues: 3, matchT: 0, round: 1, wins: { 1: 0, '-1': 0 }, vsArenas: [],
  idleT: 0, tipT: 0, tipI: 0, acc: 0, hitstop: 0, paused: false, simOn: false, timers: [], says: new Map(),
  autopilot: params.has('autoplay'), fade: 0, menuCam: true, ko: null, stageStats: null, closeT: 0,
  ore: 0, up: {}, ch: null, newMedals: [],
};
window.__a26 = { G, R, D, A, I, settings, REC, NET };

// ------------------------------------------------------------------ helpers
const now = () => performance.now() / 1000;
function after(t, fn) { G.timers.push({ t, fn }); }
function clearTimers() { G.timers = []; }
// Talking is rare on purpose. Key lines (match start/result, boss, unlocks) always get through, one voice at
// a time; everything else is colour that waits VOICE_GAP seconds after the last line and rolls its chance.
const VOICE_GAP = 24;
const KEY = { key: true, priority: true };
let lastLine = -99;
function say(name, cd = 0, o = {}) {
  if (G.mode === 'attract' || settings.talk === 'off') return;
  const t = now(), last = G.says.get(name) ?? -99;
  if (t - last < cd || Math.random() > (o.chance ?? 1)) return;
  if (!o.key && t - lastLine < VOICE_GAP) return;
  G.says.set(name, t);
  lastLine = t;
  A.say(name, o);
}
const ann = (n, cd, o) => say('ann_' + n, cd, o);
function pilotSay(side, line, o = {}) {
  const info = G.sides && G.sides[side];
  if (!info || !info.persona || settings.talk === 'off') return;
  const t = now();
  const before = lastLine;
  say(`${info.persona.key}_${line}`, o.cd ?? 60, { queue: true, ...o });
  if (lastLine !== before && lastLine === t) A.play('radio', { vol: 0.35, gap: 0 });
}
function sideInfo(c) {
  if (c.human) return { name: c.human.name, title: c.human.title, color: c.human.color, accent: c.human.accent, look: c.human.look, human: true, pilot: c.human.pilot };
  return { name: c.persona.name, title: c.persona.title, color: c.persona.color, accent: c.persona.accent, look: c.persona.look, persona: c.persona };
}
const solo = () => G.mode === 'campaign' || G.mode === 'online' || (G.mode === 'versus' && !!(G.vs && G.vs.cpu));
const soloSide = () => (G.mode === 'online' ? NET.side || 1 : 1);
const isHuman = (side) => G.humans.some((h) => h.s.side === side);

// ------------------------------------------------------------------ pilots you can fly
const UKEY = 'a26.unlocks.v1';
const unlocks = new Set();
try { for (const k of JSON.parse(localStorage.getItem(UKEY) || '[]')) if (PERKS[k]) unlocks.add(k); } catch { /* none yet */ }
const isOpen = (k) => k === 'p1' || unlocks.has(k);
function unlock(k) {
  if (!PERKS[k] || k === 'p1' || unlocks.has(k)) return false;
  unlocks.add(k);
  try { localStorage.setItem(UKEY, JSON.stringify([...unlocks])); } catch { /* private mode */ }
  return true;
}
const lockHint = (k) => (k === 'maw' ? 'FINISH THE CAMPAIGN' : `BEAT ${PILOTS[k].name} IN THE CAMPAIGN`);

// ------------------------------------------------------------------ medals (three challenges per sector)
const MKEY = 'a26.medals.v1';
const medals = new Set();
try { for (const k of JSON.parse(localStorage.getItem(MKEY) || '[]')) if (MEDALS.some((m) => m.id === k)) medals.add(k); } catch { /* none yet */ }
function award(id) {
  if (G.mode !== 'campaign' || medals.has(id)) return;
  const m = MEDALS.find((q) => q.id === id);
  if (!m) return;
  medals.add(id);
  try { localStorage.setItem(MKEY, JSON.stringify([...medals])); } catch { /* private mode */ }
  G.newMedals.push(m);
  const el = $('medal-toast');
  el.innerHTML = `<i>🏅</i><div><small>MEDAL EARNED · ${ARENAS[m.sector].name}</small><b>${m.name}</b><span>${m.desc}</span></div>`;
  el.classList.remove('hidden', 'go');
  void el.offsetWidth;
  el.classList.add('go');
  clearTimeout(G.medalT);
  G.medalT = setTimeout(() => el.classList.add('hidden'), 4200);
  A.play('gold', { gap: 0, vol: 0.7, noSlow: true });
}
function renderMedalPanel() {
  const n = medals.size;
  $('medalpanel').innerHTML = `<h4>🏅 MEDALS <b>${n} / ${MEDALS.length}</b></h4><div class="mgrid">${ARENAS.map((A2, s) => `<div class="mrow"><span>${A2.name}</span>${MEDALS.filter((m) => m.sector === s).map((m) => `<i class="${medals.has(m.id) ? 'on' : ''}" title="${m.name}"></i>`).join('')}</div>`).join('')}</div>`;
  const b = document.querySelector('[data-act="medals"]');
  if (b) b.innerHTML = `MEDALS <small>${n} / ${MEDALS.length}</small>`;
}
function buildMedals() {
  $('medlist').innerHTML = ARENAS.map((A2, s) => `<h3>SECTOR ${s + 1} · ${A2.name}</h3><div class="pugrid">${MEDALS.filter((m) => m.sector === s).map((m) => {
    const on = medals.has(m.id);
    return `<div class="pu medal ${on ? 'on' : ''}" style="--fc:${on ? '#ffd23f' : '#3a4460'}"><i>${on ? '🏅' : '○'}</i><div><b>${m.name}</b><span>${m.desc}</span></div></div>`;
  }).join('')}</div>`).join('');
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} EARNED`;
}
// challenge counters for the sector being flown
const newChallenge = () => ({ gold: 0, shards: 0, snipes: 0, struck: 0, swallowed: 0, gates: 0, dodges: 0 });

// ------------------------------------------------------------------ rumble: gamepads shake, phones buzz
function rumble(side, strong, weak, ms) {
  if (settings.rumble === 'off' || G.mode === 'demo' || G.mode === 'attract' || !isHuman(side)) return;
  const pads = I.pads();
  const two = G.mode === 'versus' && !solo();
  const list = two ? [pads[side === 1 ? 0 : 1]] : pads.slice(0, 1);
  for (const g of list) {
    const act = g && g.vibrationActuator;
    if (act && act.playEffect) act.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => {});
  }
  if (I.isTouch && !two && navigator.vibrate) { try { navigator.vibrate(Math.round(ms * 0.6)); } catch { /* not allowed */ } }
}
function humanPilot(key, slot = 1, title) {
  const base = slot === 2 ? HUMAN2 : HUMAN;
  if (!PILOTS[key]) return { ...base, pilot: 'p1', title: title || base.title, blurb: `${PERKS.p1.name} — ${PERKS.p1.desc}` };
  const P = PILOTS[key], k = PERKS[key];
  return { key, pilot: key, name: P.name, title: title || `PLAYER ${slot} · ${k.name}`, color: P.color, accent: P.accent, look: P.look, blurb: `${k.name} — ${k.desc}` };
}
function rivalPersona(key, vsPilot) {
  const P = PILOTS[key];
  return vsPilot === key ? { ...P, name: 'SHADOW ' + P.name, color: SHADOW[key] } : P;
}
const fmtT = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const camMode = () => settings.camera;
function applyVolumes() {
  A.vol.music = settings.music / 100;
  A.vol.sfx = (settings.sfx / 100) * (G.mode === 'attract' ? 0.25 : 1);
  A.vol.voice = settings.voice / 100;
  A.applyVolumes();
}

// ------------------------------------------------------------------ matches
function startMatch(cfg) {
  const boss = !!(cfg.sides[-1].persona && cfg.sides[-1].persona.boss);
  const perks = {}, looks = {}, hull = {};
  for (const s of [1, -1]) {
    const c = cfg.sides[s];
    const h = c.human;
    if (h && PERKS[h.pilot]) perks[s] = PERKS[h.pilot];
    looks[s] = h ? h.look : c.persona.look;
  }
  if (boss) hull[1] = F.bossHull;
  const W = makeWorld({ arena: cfg.arena, seed: cfg.seed ?? ((Math.random() * 1e9) | 0), boss, perks, looks, hull, twists: cfg.twists, diffBoss: cfg.diffBoss ?? 1, up: cfg.up });
  G.W = W; G.ai = {}; G.aiList = []; G.humans = []; G.cfg = cfg; G.ko = null;
  for (const s of [1, -1]) {
    const c = cfg.sides[s];
    const ship = shipOf(W, s);
    if (!ship) continue;
    ship.name = sideInfo(c).name;
    if (c.kind === 'human') G.humans.push({ s: ship, who: c.who });
    else if (c.kind === 'ai') { const ai = new AIPilot(W, ship, c.persona, cfg.diffAI || DIFFICULTY.normal.ai); G.ai[s] = ai; G.aiList.push(ai); }
  }
  G.sides = { 1: sideInfo(cfg.sides[1]), '-1': sideInfo(cfg.sides[-1]) };
  R.setWorld(W, G.sides);
  U.buildHud(G.sides, W);
  G.matchT = 0; G.acc = 0; G.hitstop = 0;
  D.slow = 1; D.slowT = 0; D.impact = null; D.shot = null;
  A.setRate(1);
  applyVolumes();
  REC.reset();
}

function randomAIMatch(demo) {
  const pool = shuffle(['razor', 'lyra', 'grit', 'cipher']);
  const bossFight = Math.random() < (demo ? 0.18 : 0.12);
  const a = PILOTS[pool[0]], b = bossFight ? PILOTS.maw : PILOTS[pool[1]];
  const arena = bossFight ? 4 : Math.floor(Math.random() * 4);
  const diffAI = demo ? DIFFICULTY.hard.ai : DIFFICULTY.normal.ai;
  startMatch({ arena, diffAI, sides: { 1: { kind: 'ai', persona: a }, '-1': { kind: 'ai', persona: b } } });
}

function startAttract() {
  G.mode = 'attract';
  G.menuCam = true;
  if (!G.W || G.W.over || G.cfg.sides[1].kind !== 'ai' || G.cfg.sides[-1].kind !== 'ai') randomAIMatch(false);
  G.mode = 'attract';
  G.simOn = true;
  G.paused = false;
  U.setHud(false);
  setDemoUI(false);
  applyVolumes();
}

// ------------------------------------------------------------------ screens / flow
const esc = (v) => String(v ?? '').replace(/[^A-Z0-9]/gi, '');
function boardRows(rows, n) {
  return rows.slice(0, n).map((r, i) => `<tr><td>${i + 1}.</td><td>${esc(r.initials)}</td><td>${Math.floor(r.score).toLocaleString()}</td></tr>`).join('');
}
async function renderWorld() {
  const g = await HS.fresh();
  const rows = g ? g.slice(0, 5).map((r, i) => `<li><b>${i + 1}.</b><span>${esc(r.initials)}</span><em>${Math.floor(r.score).toLocaleString()}</em></li>`).join('') : '';
  $('world').innerHTML = `<h4>🌐 WORLD TOP 5</h4><ol>${rows || `<li class="note">${g === null ? 'Global board offline' : 'No scores yet — be the first!'}</li>`}</ol>`;
}
$('world').addEventListener('click', () => { if (G.state === 'title') { A.play('uiok', { gap: 0 }); openSub('scores'); } });
$('medalpanel').addEventListener('click', () => { if (G.state === 'title') { A.play('uiok', { gap: 0 }); openSub('medals'); } });

async function showAttractBoard() {
  const g = await HS.fresh(120000);
  if (G.mode !== 'demo') return;
  $('ab-rows').innerHTML = g && g.length ? boardRows(g, 10) : `<tr><td colspan="3" style="color:#7a8cb8">${g === null ? 'Global board offline' : 'No scores yet — be the first!'}</td></tr>`;
  $('attract-board').classList.remove('hidden');
  clearTimeout(G.abTimer);
  G.abTimer = setTimeout(() => $('attract-board').classList.add('hidden'), 7000);
}

function goTitle() {
  clearTimers();
  stopReplay(false);
  NET.close();
  NET.reset();
  $('res-quit').classList.add('hidden');
  backTo = 'title';
  G.state = 'title';
  renderWorld();
  renderMedalPanel();
  G.idleT = 0;
  startAttract();
  U.hideBanner();
  U.show('title');
  $('touch').classList.add('hidden');
  A.muffle(false);
  A.playMusic('title');
  menuSel(0);
}

function startCampaign(diff, pilot = 'p1') {
  G.mode = 'campaign';
  G.diff = diff;
  G.p1Pilot = isOpen(pilot) ? pilot : 'p1';
  G.stage = params.has('stage') ? Math.max(0, Math.min(4, +params.get('stage') - 1)) : 0;
  G.score = 0;
  G.continues = 3;
  G.ore = 0;
  G.up = {};
  stageIntro();
}

const roundsToWin = () => (G.mode === 'campaign' && G.stage === 4 ? 1 : 2);
function campaignMatch() {
  const me = G.p1Pilot || 'p1';
  const pilot = rivalPersona(LADDER[G.stage], me);
  const you = humanPilot(me, 1, me === 'p1' ? 'CHALLENGER' : `YOU · ${PERKS[me].name}`);
  startMatch({ arena: G.stage, diffAI: DIFFICULTY[G.diff].ai, diffBoss: DIFFICULTY[G.diff].boss, up: { 1: G.up }, sides: { 1: { kind: 'human', human: you, who: 'solo' }, '-1': { kind: 'ai', persona: pilot } } });
  return { pilot, you, me };
}
function newStageStats() { return { rocks: 0, hits: 0, shards: 0, pickups: 0, dodges: 0, taken: 0, gold: 0, eyes: 0, time: 0 }; }

function stageIntro() {
  clearTimers();
  G.mode = 'campaign';
  G.menuCam = false;
  G.round = 1;
  G.wins = { 1: 0, '-1': 0 };
  G.stageStats = newStageStats();
  G.ch = newChallenge();
  G.newMedals = [];
  const { pilot, you, me } = campaignMatch();
  D.setMode(camMode());
  G.simOn = false;
  G.state = 'vs';
  const fmt = pilot.boss ? 'THE FINAL STAND' : 'BEST OF THREE';
  fillVs(G.sides[1], G.sides[-1], `SECTOR ${G.stage + 1} / 5 · <b>${ARENAS[G.stage].name}</b> · ${fmt}`, (me === 'p1' ? 'A fast ship, a hot cannon and a belt full of rocks.' : you.blurb) + upLine(), pilot.blurb);
  U.show('vs');
  U.setHud(false);
  A.playMusic(ARENAS[G.stage].music);
  if (pilot.boss) { A.play('alarm', { vol: 0.7, gap: 0 }); after(0.4, () => A.play('bossroar', { vol: 0.8, gap: 0 })); ann('boss', 0, KEY); }
  else if (G.stage === 0) ann('challenger', 300, KEY);
  else A.play('whoosh', { vol: 0.8 });
  after(pilot.boss ? 3.1 : 1.9, () => pilotSay(-1, 'intro', { ...KEY, cd: 300 }));
  after(pilot.boss ? 7.4 : 5.4, () => countdown());
}

function fillVs(a, b, arenaLine, blurbA, blurbB) {
  const card = (el, s, blurb) => {
    el.style.setProperty('--pc', hex(s.color));
    el.innerHTML = `<div class="pn">${s.name}</div><div class="pt">${s.title}</div><div class="pb">${blurb || ''}</div>`;
  };
  card($('vs-1'), a, blurbA);
  card($('vs--1'), b, blurbB);
  $('vs-arena').innerHTML = arenaLine;
}

function countdown() {
  clearTimers();
  G.state = 'countdown';
  U.hideScreens();
  U.setHud(true);
  setDemoUI(false);
  D.setMode(camMode());
  updateMid();
  showTouch();
  const label = G.mode === 'campaign' ? (G.stage === 4 ? 'THE MAW' : `SECTOR ${G.stage + 1}`) : `ROUND ${G.round}`;
  U.showBanner(G.mode === 'campaign' && G.stage < 4 && G.round > 1 ? `ROUND ${G.round}` : label, G.W.arena.name, hex(G.W.arena.grid), 1.3);
  if (G.round === 3) ann('final', 0, KEY);
  ['3', '2', '1'].forEach((t, i) => after(1.5 + i * 0.7, () => { U.showBanner(t, '', '#ffffff', 0.65); A.play('beep', { vary: 0, gap: 0 }); }));
  after(1.5 + 3 * 0.7, () => {
    U.showBanner('ENGAGE!', '', '#ffd23f', 0.9);
    A.play('go', { gap: 0 });
    ann('engage', 0, { priority: true });
    if (G.state === 'pause') G.pausedState = 'play';
    else G.state = 'play';
    G.simOn = true;
  });
  G.simOn = false;
}

// p2 = null: a CPU rival flies the other ship
function startVersus(p1 = 'p1', p2 = 'p1') {
  G.mode = 'versus';
  G.wins = { 1: 0, '-1': 0 };
  G.round = 1;
  G.vsArenas = shuffle([0, 1, 2, 3]);
  G.vs = { p1, p2, cpu: p2 === null ? shuffle(['razor', 'lyra', 'grit', 'cipher'])[0] : null, twists: { ...(settings.twists || {}) } };
  versusRound();
}
const twistNames = (tw) => Object.keys(TWISTS).filter((k) => tw && tw[k]).map((k) => TWISTS[k].name);

function versusRound() {
  clearTimers();
  G.mode = 'versus';
  G.menuCam = false;
  const arena = G.vsArenas[(G.round - 1) % 4];
  const V = G.vs || { p1: 'p1', p2: 'p1', cpu: null, twists: {} };
  const a = humanPilot(V.p1, 1, 'PLAYER 1');
  const b = V.cpu ? { kind: 'ai', persona: rivalPersona(V.cpu, V.p1) } : { kind: 'human', human: humanPilot(V.p2, 2, 'PLAYER 2'), who: 'p2' };
  if (!V.cpu && V.p2 === V.p1 && V.p1 !== 'p1') b.human = { ...b.human, color: SHADOW[V.p1] };
  startMatch({ arena, twists: V.twists, diffAI: DIFFICULTY.normal.ai, sides: { 1: { kind: 'human', human: a, who: V.cpu ? 'solo' : 'p1' }, '-1': b } });
  A.playMusic(ARENAS[arena].music);
  if (G.round === 1) {
    G.state = 'vs';
    const tw = twistNames(V.twists);
    const line = `BEST OF THREE · <b>${ARENAS[arena].name}</b>${tw.length ? `<br><span class="twl">${tw.join(' · ')}</span>` : ''}`;
    const keysA = V.cpu ? (I.isTouch ? 'Stick to fly · FIRE · BOOST' : 'Mouse or WASD · click / Space fire · Shift boost · E overdrive') : 'A D turn · W thrust · F fire · Left Shift boost · E overdrive · pad 1';
    fillVs(G.sides[1], G.sides[-1], line, `${a.blurb}<br>${keysA}`, V.cpu ? G.sides[-1].persona.blurb : `${b.human.blurb}<br>Arrows · Enter fire · Right Shift boost · . overdrive · pad 2`);
    U.show('vs');
    U.setHud(false);
    G.simOn = false;
    ann('challenger', 0, KEY);
    after(3.6, () => countdown());
  } else countdown();
}

function startDemo() {
  clearTimers();
  G.mode = 'demo';
  G.menuCam = false;
  randomAIMatch(true);
  G.mode = 'demo';
  applyVolumes();
  G.state = 'play';
  G.simOn = true;
  U.hideScreens();
  U.setHud(true);
  setDemoUI(true);
  updateMid();
  D.shot = null;
  $('touch').classList.add('hidden');
  A.playMusic(G.W.arena.music);
  U.showBanner(`${G.sides[1].name} VS ${G.sides[-1].name}`, `DEMO · ${G.W.arena.name}`, hex(G.W.arena.grid), 2.2);
  ann('demo', Infinity, KEY);
  after(1.6, () => pilotSay(1, 'intro', { chance: 0.5 }));
  G.tipT = 4;
}

function setDemoUI(on) {
  $('demo-badge').classList.toggle('hidden', !on);
  if (!on) { clearTimeout(G.abTimer); $('attract-board').classList.add('hidden'); }
  G.boardT = 22;
  $('cap-l').classList.toggle('hidden', !on);
  $('cap-r').classList.toggle('hidden', !on);
  if (!on) $('tip').classList.add('hidden');
}

function showTouch() {
  const t = I.isTouch && (G.mode === 'campaign' || G.mode === 'versus' || G.mode === 'online');
  $('touch').classList.toggle('hidden', !t);
}

function updateMid() {
  $('ore').classList.add('hidden');
  $('arena-name').textContent = G.W ? G.W.arena.name : '';
  const sc = $('score');
  if (G.mode === 'campaign') {
    $('stage-line').textContent = G.stage === 4 ? `THE FINAL STAND · ${DIFFICULTY[G.diff].label}` : `SECTOR ${G.stage + 1} / 5 · ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`;
    sc.classList.remove('hidden'); sc.textContent = G.score.toLocaleString();
    $('ore').classList.remove('hidden'); $('ore').textContent = `◆ ${G.ore} ORE`;
  } else if (G.mode === 'versus') { $('stage-line').textContent = `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`; sc.classList.add('hidden'); }
  else if (G.mode === 'online') { const me = soloSide(); $('stage-line').textContent = `ONLINE · ROUND ${G.round} · ${G.wins[me]} – ${G.wins[-me]}`; sc.classList.add('hidden'); }
  else { $('stage-line').textContent = 'AI vs AI · DEMO'; sc.classList.add('hidden'); }
}

function addOre(n) {
  if (G.mode !== 'campaign' || (G.state !== 'play' && G.state !== 'ko')) return;
  G.ore += n;
  $('ore').textContent = `◆ ${G.ore} ORE`;
}
const upLine = () => {
  const l = UP_KEYS.filter((k) => G.up[k]).map((k) => `${UPGRADES[k].name} ${'I'.repeat(G.up[k])}`);
  return l.length ? `<br><span class="twl">${l.join(' · ')}</span>` : '';
};
function addScore(n, x, z, label, force) {
  if (G.mode !== 'campaign' || (G.state !== 'play' && !force)) return;
  const v = Math.round(n * DIFFICULTY[G.diff].scoreMul);
  G.score += v;
  const sc = $('score');
  sc.textContent = G.score.toLocaleString();
  sc.classList.add('bump');
  setTimeout(() => sc.classList.remove('bump'), 120);
  if (label && x !== undefined) { const p = R.project(x, 1.2, z); U.pop(p.x, p.y + 22, typeof label === 'string' ? `${label} +${v}` : `+${v}`, '#ffd23f', 'small'); }
}

// ------------------------------------------------------------------ knockouts + results
function foldStats() {
  if (!G.stageStats || !G.W) return;
  const st = G.W.stats[1], S = G.stageStats;
  S.rocks += st.rocks; S.hits += st.hits; S.shards += st.shards; S.pickups += st.pickups; S.dodges += st.dodges; S.taken += st.taken; S.gold += st.gold; S.eyes += st.eyes; S.time += G.matchT;
}

function onKO(e) {
  const W = G.W;
  if (G.mode === 'online' && ['pause', 'options', 'howto'].includes(U.current)) U.hideScreens();
  if (G.state === 'ko') return;
  G.state = 'ko';
  const winner = e.winner;
  G.ko = { x: e.x, z: e.z, side: e.side };
  const info = { n: W.n, side: e.side, x: e.x, z: e.z };
  D.slowMo(0.22, 2.4);
  D.addTrauma(1);
  if (G.mode !== 'campaign') { rumble(e.side, 1, 1, 700); rumble(winner, 0.4, 0.6, 400); }
  A.play('ko', { gap: 0, noSlow: true });
  A.play('shipboom', { gap: 0, x: e.x, noSlow: true });
  if (G.mode === 'attract') { after(3.5, () => { if (G.mode === 'attract') { randomAIMatch(false); G.mode = 'attract'; applyVolumes(); } }); return; }
  const loserShip = shipOf(W, winner);
  const flawless = loserShip && loserShip.hp === loserShip.max;
  const comeback = loserShip && loserShip.hp <= 1;
  if (G.mode === 'campaign') {
    const won = winner === 1;
    G.wins[winner]++;
    foldStats();
    const match = G.wins[winner] >= roundsToWin();
    if (won) {
      addScore(1500 + (flawless ? 1500 : 0), e.x, e.z, flawless ? 'FLAWLESS' : 'KO', true);
      G.ore += 10;
      if (flawless && G.stage < 4) award(`s${G.stage + 1}flaw`);
      if (match) {
        const C = G.ch || newChallenge(), S = G.stageStats;
        if (G.stage === 0 && G.wins[-1] === 0) award('s1sweep');
        if (G.stage === 1 && C.struck === 0) award('s2storm');
        if (G.stage === 2 && C.swallowed === 0) award('s3escape');
        if (G.stage === 4 && S.time < 120) award('s5fast');
        if (G.stage === 4 && S.taken <= 3) award('s5clean');
      }
    }
    if (match) {
      after(1.3, () => ann(!won ? 'defeat' : comeback ? 'comeback' : flawless ? 'perfect' : 'victory', 0, KEY));
      after(2.6, () => pilotSay(-1, won ? 'lose' : 'win', { key: true, chance: 0.35 }));
      after(2.0, () => A.sting(won ? 'victory' : 'defeat'));
    }
    const boss = G.stage === 4;
    U.showBanner(won ? (boss ? 'THE MAW FALLS' : 'K.O.!') : 'SHIP DOWN', match ? (won ? (boss ? 'THE BELT IS SAFE' : `${G.sides[-1].name} IS DOWN`) : `${G.sides[-1].name} WINS`) : `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`, won ? '#39f3ff' : '#ff3040', 3.6);
    if (match) after(3.4, () => withReplay(info, () => (won ? stageResults() : continueScreen())));
    else after(4.4, () => withReplay(info, () => { G.round++; campaignMatch(); countdown(); }, true));
    rumble(1, won ? 0.4 : 1, won ? 0.6 : 1, won ? 400 : 700);
  } else if (G.mode === 'versus') {
    G.wins[winner]++;
    const match = G.wins[winner] >= 2;
    const cpu = G.vs && G.vs.cpu;
    if (match) after(1.3, () => ann(cpu ? (winner === 1 ? 'victory' : 'defeat') : winner === 1 ? 'p1wins' : 'p2wins', 0, KEY));
    if (comeback) after(2.6, () => ann('comeback', 0, { queue: true, chance: 0.5 }));
    if (cpu && match) after(2.6, () => pilotSay(-1, winner === 1 ? 'lose' : 'win', { key: true, chance: 0.35 }));
    U.showBanner(`${vsName(winner)} WINS`, match ? 'THE MATCH' : `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`, hex(G.sides[winner].color), 3.6);
    if (match) { after(2, () => A.sting(cpu && winner === -1 ? 'defeat' : 'victory')); after(3.4, () => withReplay(info, () => versusResults(winner))); }
    else after(4.6, () => { G.round++; versusRound(); });
  } else if (G.mode === 'online') {
    G.wins[winner]++;
    const me = soloSide(), won = winner === me;
    const match = G.wins[winner] >= 2;
    if (match) after(1.3, () => ann(won ? 'victory' : 'defeat', 0, KEY));
    if (comeback) after(2.6, () => ann('comeback', 0, { queue: true, chance: 0.5 }));
    U.showBanner(won ? 'YOU WIN' : `${G.sides[winner].name} WINS`, match ? 'THE MATCH' : `ROUND ${G.round} · ${G.wins[me]} – ${G.wins[-me]}`, hex(G.sides[winner].color), 3.6);
    if (match) { after(2, () => A.sting(won ? 'victory' : 'defeat')); after(4.6, () => onlineResults(winner)); }
    else if (me === 1) after(4.6, () => { if (G.mode === 'online') { G.round++; onlineNextRound(); } });
  } else if (G.mode === 'demo') {
    after(1.2, () => pilotSay(winner, 'win', { chance: 0.5 }));
    if (comeback) after(1.3, () => ann('comeback', 0, { queue: true, chance: 0.5 }));
    U.showBanner(`${G.sides[winner].name} WINS`, comeback ? 'WHAT A COMEBACK' : 'DEMO', hex(G.sides[winner].color), 4);
    after(3.6, () => withReplay(info, () => { if (G.mode === 'demo') startDemo(); }));
  }
}
const vsName = (s) => (s === 1 ? 'PLAYER 1' : G.vs && G.vs.cpu ? G.sides[-1].name : 'PLAYER 2');

function stageResults() {
  const S = G.stageStats || newStageStats(), W = G.W;
  const ship = shipOf(W, 1);
  const hullLeft = ship ? ship.hp : 0, perfect = S.taken === 0;
  const timeBonus = Math.max(0, Math.round(200 - S.time)) * 10;
  const bonus = { stage: 2000 * (G.stage + 1), hull: hullLeft * 250, perfect: perfect ? 5000 : 0, time: timeBonus };
  const mul = DIFFICULTY[G.diff].scoreMul;
  const add = Math.round((bonus.stage + bonus.hull + bonus.perfect + bonus.time) * mul);
  const beaten = LADDER[G.stage];
  const fresh = unlock(beaten);
  G.score += add;
  const rows = [
    ['ROCKS BROKEN', S.rocks], ['GOLD ROCKS', S.gold], ['HITS ON TARGET', S.hits], ['SHARD STRIKES', S.shards], ['POWER-UPS', S.pickups], ['CLOSE CALLS', S.dodges],
    ...(G.stage === 4 ? [['EYES DESTROYED', S.eyes]] : []), ['HULL LOST', S.taken], ['TIME', fmtT(S.time)],
    ['SECTOR BONUS', '+' + bonus.stage], ['HULL LEFT', '+' + bonus.hull], ['UNTOUCHED', perfect ? '+5000' : '—'], ['TIME BONUS', '+' + bonus.time],
  ];
  $('res-title').textContent = G.stage === 4 ? 'THE MAW FALLS' : `SECTOR ${G.stage + 1} CLEAR`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('') + (mul !== 1 ? `<span>DIFFICULTY</span><span>×${mul}</span>` : '')
    + (fresh ? `<span class="unl">🔓 NEW PILOT</span><span class="unl">${PILOTS[beaten].name} · ${PERKS[beaten].name}</span>` : '')
    + G.newMedals.map((m) => `<span class="unl">🏅 MEDAL</span><span class="unl">${m.name}</span>`).join('')
    + (G.stage < 4 ? `<span>ORE IN THE HOLD</span><span>◆ ${G.ore}</span>` : '');
  G.newMedals = [];
  if (fresh) after(0.9, () => ann('unlocked', 0, KEY));
  else after(0.6, () => ann('stageclear', 0, { key: true, chance: 0.5 }));
  $('res-total').textContent = G.score.toLocaleString();
  $('res-next').textContent = G.stage === 4 ? 'CHAMPION →' : 'HANGAR →';
  G.state = 'results';
  G.resultsNext = () => {
    if (G.stage === 4) champion();
    else openHangar();
  };
  U.show('results');
  menuSel(0);
}

function champion() {
  clearTimers();
  G.state = 'champion';
  U.hideScreens();
  U.showBanner('CHAMPION', `FINAL SCORE ${G.score.toLocaleString()}`, '#ffd23f', 5);
  ann('champion', 0, KEY);
  A.sting('victory');
  after(5, () => endRun());
}

function versusResults(winner) {
  const W = G.W;
  const rows = [];
  for (const s of [1, -1]) {
    const st = W.stats[s];
    const n = s === 1 ? 'P1' : G.vs && G.vs.cpu ? G.sides[-1].name : 'P2';
    rows.push([`${n} HITS / SHARD STRIKES`, `${st.hits} / ${st.shards}`], [`${n} ROCKS / POWER-UPS`, `${st.rocks} / ${st.pickups}`]);
  }
  $('res-title').textContent = `${vsName(winner)} WINS`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('') + '<span style="grid-column:1/-1;color:#7a8cb8;font-size:9px">STATS FROM THE FINAL ROUND</span>';
  $('res-total').textContent = `${G.wins[1]} – ${G.wins[-1]}`;
  $('res-next').textContent = 'TITLE →';
  G.state = 'results';
  G.resultsNext = () => goTitle();
  U.show('results');
  menuSel(0);
}

function continueScreen() {
  if (G.continues <= 0) return gameOver();
  G.state = 'cont';
  U.show('cont');
  ann('continue', 0, KEY);
  let n = 9;
  $('cont-n').textContent = n;
  $('cont-sub').textContent = `${G.continues} CREDIT${G.continues > 1 ? 'S' : ''} LEFT · SCORE HALVES`;
  const tick = () => {
    if (G.state !== 'cont') return;
    n--;
    if (n < 0) return gameOver();
    $('cont-n').textContent = n;
    A.play('beep', { vol: 0.5, gap: 0 });
    after(1, tick);
  };
  after(1, tick);
  menuSel(0);
}

function gameOver() {
  clearTimers();
  G.state = 'gameover';
  U.hideScreens();
  U.showBanner('GAME OVER', `SCORE ${G.score.toLocaleString()}`, '#ff3040', 3.5);
  ann('gameover', 0, KEY);
  A.sting('defeat');
  after(3.6, () => endRun());
}

async function endRun() {
  U.hideBanner();
  await HS.fetchGlobal();
  if (HS.qualifies(G.score)) initialsEntry();
  else showScores(true);
}

// ------------------------------------------------------------------ initials + scores
const INI = { chars: ['A', 'A', 'A'], i: 0 };
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function initialsEntry() {
  G.state = 'initials';
  INI.chars = HS.initials().padEnd(3, 'A').split('').slice(0, 3);
  INI.i = 0;
  $('ini-score').textContent = G.score.toLocaleString();
  renderIni();
  U.show('initials');
  ann('newrecord', 0, KEY);
}
function renderIni() {
  $('ini').innerHTML = INI.chars.map((c, i) => `<div class="ini ${i === INI.i ? 'sel' : ''}" data-i="${i}"><button data-up="${i}">▲</button><div class="ch">${c}</div><button data-dn="${i}">▼</button></div>`).join('');
}
function bumpIni(i, d) {
  const k = ALPHA.indexOf(INI.chars[i]);
  INI.chars[i] = ALPHA[(k + d + ALPHA.length) % ALPHA.length];
  INI.i = i;
  renderIni();
  A.play('uimove', { vol: 0.5, gap: 0 });
}
$('ini').addEventListener('click', (e) => {
  const up = e.target.dataset.up, dn = e.target.dataset.dn;
  if (up !== undefined) bumpIni(+up, 1);
  if (dn !== undefined) bumpIni(+dn, -1);
});
async function saveIni() {
  if (G.state !== 'initials') return;
  G.state = 'saving';
  A.play('uiok', { gap: 0 });
  const e = await HS.submit(INI.chars.join(''), G.score, G.stage + 1);
  await HS.fetchGlobal();
  showScores(true, INI.chars.join(''));
  const g = HS.global || [];
  const gi = g.findIndex((r) => r.initials === e.initials && Math.floor(r.score) === e.score);
  const li = HS.local().findIndex((r) => r.initials === e.initials && r.score === e.score && r.ts === e.ts);
  const rank = $('hs-rank');
  rank.textContent = gi >= 0 ? `🌐 GLOBAL RANK #${gi + 1}` : HS.global === null ? 'SAVED · GLOBAL BOARD OFFLINE' : li >= 0 ? `🏠 #${li + 1} ON THIS DEVICE` : 'SAVED';
  rank.classList.remove('hidden');
  if (gi === 0) ann('champion', 0, KEY);
}

function showScores(fromRun = false, me = null) {
  G.state = fromRun ? 'scores-end' : 'scores';
  $('hs-rank').classList.add('hidden');
  const fill = (el, rows) => {
    el.innerHTML = rows && rows.length
      ? rows.slice(0, 10).map((r, i) => `<tr class="${me && r.initials === me && r.score === G.score ? 'me' : ''}"><td>${i + 1}.</td><td>${String(r.initials).replace(/[^A-Z0-9]/gi, '')}</td><td>${Math.floor(r.score).toLocaleString()}</td></tr>`).join('')
      : `<tr><td colspan="3" style="color:#7a8cb8">${rows === null ? 'Global board offline' : 'No scores yet — be the first!'}</td></tr>`;
  };
  fill($('hs-local'), HS.local());
  fill($('hs-global'), HS.global);
  if (!fromRun) HS.fetchGlobal().then((g) => fill($('hs-global'), g));
  U.show('scores');
  menuSel(0);
}

// ------------------------------------------------------------------ how to / options
function buildHowto() {
  const keys = I.isTouch
    ? [['LEFT STICK', 'drag anywhere on the left to point and fly'], ['FIRE', 'hold to shoot'], ['BOOST', 'dash: untouchable for a moment'], ['OVERDRIVE', 'when the bar is full']]
    : [['MOUSE', 'the ship turns to the cursor · click to fire · right button thrusts'], ['A D / ← →', 'turn'], ['W / ↑', 'thrust · S / ↓ brakes'], ['SPACE · F', 'fire (hold)'], ['SHIFT · X', 'boost (dash)'], ['E · Q', 'overdrive'], ['P / ESC', 'pause · C camera'], ['GAMEPAD', 'stick points and thrusts · A fire · B boost · X overdrive · RT throttle'], ['VERSUS', 'P1: A D W, F fire, Left Shift, E · P2: arrows, Enter, Right Shift, . · or two pads'], ['DEMO', 'T toggles the AI overlay']];
  $('keys').innerHTML = keys.map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join('');
  $('pilotlist').innerHTML = ROSTER.map((k) => {
    const name = k === 'p1' ? 'ACE' : PILOTS[k].name, c = k === 'p1' ? HUMAN.color : PILOTS[k].color;
    return `<div class="pu" style="--fc:${hex(c)}"><i>${isOpen(k) ? '◆' : '🔒'}</i><div><b>${name} · ${PERKS[k].name}</b><span>${isOpen(k) ? PERKS[k].desc : lockHint(k).toLowerCase().replace(/^./, (m) => m.toUpperCase())}</span></div></div>`;
  }).join('');
  $('pugrid').innerHTML = Object.values(POWERUPS).map((p) => `<div class="pu" style="--fc:${hex(p.color)}"><i>${p.glyph}</i><div><b>${p.name}</b><span>${p.desc}</span></div></div>`).join('');
  $('rockgrid').innerHTML = [['stone', 'ROCK', 'Breaks in two, then two again'], ['ice', 'ICE', 'Splits into three'], ['gold', 'GOLD', 'Always drops a power-up · worth ×5 · shy'], ['crystal', 'CRYSTAL', 'Charged: arcs between crystals hurt'], ['volatile', 'VOLATILE', 'Explodes when broken: hurts everyone near'], ['comet', 'COMET', 'Fast and fiery, in showers along a lane']]
    .map(([k, n, d]) => `<div class="pu" style="--fc:${hex(ROCK_KINDS[k].glow || ROCK_KINDS[k].color)}"><i style="color:${hex(ROCK_KINDS[k].color)}">●</i><div><b>${n}</b><span>${d}</span></div></div>`).join('');
}
function buildOptions() {
  for (const r of document.querySelectorAll('[data-vol]')) {
    const k = r.dataset.vol;
    r.value = settings[k];
    r.nextElementSibling.textContent = settings[k];
    r.oninput = () => { settings[k] = +r.value; r.nextElementSibling.textContent = r.value; saveSettings(); applyVolumes(); };
  }
  for (const seg of document.querySelectorAll('[data-opt]')) {
    const k = seg.dataset.opt;
    const sync = () => seg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === String(settings[k])));
    sync();
    seg.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      settings[k] = b.dataset.v;
      saveSettings();
      sync();
      A.play('uimove', { gap: 0 });
      if (k === 'camera') D.setMode(camMode());
      if (k === 'flash') applyCalm();
      if (k === 'talk' && b.dataset.v === 'off') A.hush();
    };
  }
}

// ------------------------------------------------------------------ menus (mouse, keys, pad)
let backTo = 'title';
function menuSel(i) {
  const btns = visibleButtons();
  btns.forEach((b, k) => b.classList.toggle('sel', k === i));
  G.menuI = i;
  if (G.state === 'pilot') pilotDesc(btns[i]);
}
function visibleButtons() {
  const scr = document.querySelector('.screen:not(.hidden)');
  if (!scr) return [];
  return [...scr.querySelectorAll('button.mbtn')].filter((b) => !b.classList.contains('row2') && b.offsetParent !== null);
}
function openSub(id) {
  backTo = G.state;
  G.prevScreen = U.current;
  G.state = id;
  if (id === 'howto') buildHowto();
  if (id === 'options') buildOptions();
  if (id === 'medals') buildMedals();
  if (id === 'scores') return showScores(false);
  U.show(id);
  menuSel(0);
}
function back() {
  A.play('uiback', { gap: 0 });
  if (G.state === 'online-wait' || G.state === 'online-join') { NET.close(); return showOnline(); }
  if (G.state === 'scores-end') return goTitle();
  if (backTo === 'pause') { G.state = 'pause'; U.show('pause'); menuSel(0); return; }
  goTitle();
}

document.getElementById('ui').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  A.unlock();
  const act = b.dataset.act, diff = b.dataset.diff;
  if (act || diff) A.play('uiok', { gap: 0 });
  if (diff) return pickThen('CAMPAIGN · YOUR PILOT', (k) => startCampaign(diff, k), { def: settings.pilot });
  if (b.dataset.pilot) return pickPilot(b.dataset.pilot);
  if (b.dataset.up) return buyUpgrade(b.dataset.up);
  if (b.dataset.opp) { settings.vsOpp = b.dataset.opp; saveSettings(); A.play('uimove', { gap: 0 }); return renderVsetup(); }
  if (b.dataset.tw) { const tw = settings.twists || (settings.twists = {}); tw[b.dataset.tw] = !tw[b.dataset.tw]; saveSettings(); A.play('uimove', { gap: 0 }); return renderVsetup(); }
  switch (act) {
    case 'campaign': G.state = 'difficulty'; U.show('difficulty'); menuSel(1); break;
    case 'versus': openVersus(); break;
    case 'vsgo': vsGo(); break;
    case 'online': openOnline(); break;
    case 'on-quick': onlineQuick(); break;
    case 'on-host': onlineHost(); break;
    case 'on-join': showJoin(); break;
    case 'on-joingo': joinFromInput(); break;
    case 'on-cancel': NET.close(); showOnline(); break;
    case 'on-copy': copyInvite(b); break;
    case 'demo': startDemo(); break;
    case 'howto': case 'options': case 'scores': case 'medals': openSub(act); break;
    case 'launch': if (G.state === 'hangar') { G.stage++; stageIntro(); } break;
    case 'back': back(); break;
    case 'resume': resume(); break;
    case 'quit': G.paused = false; A.muffle(false); goTitle(); break;
    case 'next': if (G.resultsNext) G.resultsNext(); break;
    case 'yes': if (G.state === 'cont') { G.continues--; G.score = Math.floor(G.score / 2); stageIntro(); } break;
    case 'no': if (G.state === 'cont') gameOver(); break;
    case 'save': saveIni(); break;
  }
});
document.getElementById('ui').addEventListener('pointerover', (e) => {
  const b = e.target.closest && e.target.closest('button.mbtn');
  if (!b) return;
  const i = visibleButtons().indexOf(b);
  if (i >= 0 && i !== G.menuI) { menuSel(i); A.play('uimove', { vol: 0.35, gap: 0.05 }); }
});

// touch buttons: fire is held, boost and overdrive are taps
const holdBtn = (id, on, off) => {
  const el = $(id);
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); on(); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, () => off && off());
};
holdBtn('t-fire', () => { I.held.fire = true; }, () => { I.held.fire = false; });
holdBtn('t-dash', () => dash(1));
holdBtn('t-od', () => overdrive(1));
holdBtn('t-pause', () => pause());

function pause() {
  if (G.state !== 'play' && G.state !== 'countdown') return;
  if (G.mode === 'demo' || G.mode === 'attract') return;
  if (G.mode === 'online') { G.pausedState = G.state; G.state = 'pause'; U.show('pause'); menuSel(0); return; }
  G.paused = true;
  G.pausedState = G.state;
  G.state = 'pause';
  U.show('pause');
  A.muffle(true);
  menuSel(0);
}
function resume() {
  if (G.state !== 'pause' && !(G.state === 'options' || G.state === 'howto')) return;
  G.paused = false;
  G.state = G.pausedState || 'play';
  U.hideScreens();
  A.muffle(false);
}
addEventListener('visibilitychange', () => { if (document.hidden && G.mode !== 'online') pause(); });

function dash(who) {
  if (G.state !== 'play' || G.paused) return;
  if (solo()) who = soloSide();
  for (const h of G.humans) if (h.s.side === who) h.s.input.dash = true;
}
function overdrive(who) {
  if (G.state !== 'play' || G.paused) return;
  if (solo()) who = soloSide();
  if (G.mode === 'online' && NET.side === -1) NET.odN++;
  for (const h of G.humans) if (h.s.side === who) h.s.input.od = true;
}

I.on('dash', (who) => dash(who));
I.on('od', (who) => overdrive(who));
I.on('pause', () => {
  if (G.state === 'pause') return resume();
  if (['howto', 'options', 'scores', 'medals', 'difficulty', 'scores-end', 'pilot', 'vsetup', 'online', 'online-wait', 'online-join'].includes(G.state)) return back();
  pause();
});
I.on('any', () => {
  G.idleT = 0;
  if (G.replay) { if (G.mode === 'demo') goTitle(); else stopReplay(); return; }
  if (G.demoBoot) { G.demoBoot = false; A.unlock(); A.ctx && A.ctx.resume(); A.musicName = null; A.playMusic(G.W.arena.music); return; }
  if (G.state === 'boot') return enterTitle();
  if (G.mode === 'demo' && G.state !== 'title') { goTitle(); }
});
I.on('key', (k, e) => {
  if (e && e.target && e.target.tagName === 'INPUT') { if (k === 'Enter' || k === 'NumpadEnter') joinFromInput(); return; }
  if (k === 'KeyT' && G.mode === 'demo') { settings.tactical = settings.tactical === 'never' ? 'demo' : 'never'; saveSettings(); }
  if (k === 'KeyC' && G.state === 'play' && G.mode !== 'demo') {
    const order = ['auto', 'top', 'low'];
    settings.camera = order[(order.indexOf(camMode()) + 1) % 3];
    saveSettings();
    D.setMode(camMode());
    U.showBanner('', `CAMERA · ${{ auto: 'TILTED', top: 'TOP DOWN', low: 'LOW ANGLE' }[settings.camera]}`, '#ffffff', 0.8);
  }
  if (G.state === 'initials') {
    if (/^Key[A-Z]$/.test(k) || /^Digit[0-9]$/.test(k)) { INI.chars[INI.i] = k.slice(-1); INI.i = Math.min(2, INI.i + 1); renderIni(); A.play('uimove', { gap: 0 }); }
    else if (k === 'ArrowUp') bumpIni(INI.i, 1);
    else if (k === 'ArrowDown') bumpIni(INI.i, -1);
    else if (k === 'ArrowLeft') { INI.i = Math.max(0, INI.i - 1); renderIni(); }
    else if (k === 'ArrowRight') { INI.i = Math.min(2, INI.i + 1); renderIni(); }
    else if (k === 'Backspace') { INI.i = Math.max(0, INI.i - 1); renderIni(); }
    else if (k === 'Enter' || k === 'NumpadEnter') saveIni();
    return;
  }
  if (!MENU_STATES.includes(G.state)) return;
  const btns = visibleButtons();
  if (!btns.length) return;
  if (k === 'ArrowDown' || k === 'KeyS' || k === 'ArrowRight') { menuSel((G.menuI + 1) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'ArrowUp' || k === 'KeyW' || k === 'ArrowLeft') { menuSel((G.menuI - 1 + btns.length) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'Enter' || k === 'Space' || k === 'NumpadEnter') { const b = btns[G.menuI]; if (b) b.click(); }
});
I.on('fire', (who, src) => {
  if (src !== 'pad') return;
  if (MENU_STATES.includes(G.state)) { const b = visibleButtons()[G.menuI]; if (b) b.click(); }
  if (G.state === 'initials') saveIni();
});
const MENU_STATES = ['title', 'difficulty', 'pause', 'results', 'cont', 'howto', 'options', 'scores', 'medals', 'hangar', 'scores-end', 'pilot', 'vsetup', 'online', 'online-wait', 'online-join'];

// ------------------------------------------------------------------ control
function controls(W, dt) {
  const playing = G.state === 'play' && !G.paused;
  for (const h of G.humans) {
    const inp = h.s.input;
    if (G.autopilot) {
      if (!h.bot || h.bot.ship !== h.s) h.bot = new AIPilot(W, h.s, PILOTS.cipher, DIFFICULTY.normal.ai);
      h.bot.update(W, dt);
      continue;
    }
    if (!playing) { inp.fire = false; inp.thrust = 0; inp.turn = 0; continue; }
    const c = I.control(h.who, h.s);
    inp.turn = c.turn; inp.aim = c.aim; inp.thrust = c.thrust; inp.fire = c.fire;
  }
  for (const ai of G.aiList) {
    if (G.state === 'countdown' || G.state === 'vs') { ai.ship.input.fire = false; ai.ship.input.thrust = 0; continue; }
    ai.update(W, dt);
  }
}

// ------------------------------------------------------------------ events: sound, voice, score, camera
const ROCK_PTS = [0, 100, 50, 20, 10];
function handleEvents(list) {
  const W = G.W;
  const attract = G.mode === 'attract';
  for (const e of list) {
    R.event(e, W);
    switch (e.k) {
      case 'fire': {
        const human = isHuman(e.side);
        const vol = (human ? 0.42 : 0.3) * (e.kind === 'drone' ? 0.5 : 1);
        if (e.kind === 'rail') A.play('rail', { x: e.x, vol: 0.55 });
        else if (e.kind === 'missile') A.play('missile', { x: e.x, vol: 0.4, gap: 0.05 });
        else A.play(e.side === 1 ? 'shot1' : 'shot2', { x: e.x, vol, gap: 0.03 });
        break;
      }
      case 'rock': {
        const big = e.size >= 3;
        A.play(e.size >= 3 ? 'boom_big' : e.size === 2 ? 'boom_mid' : 'boom_small', { x: e.x, vol: 0.45 + e.size * 0.12, gap: 0.04 });
        if (e.kind === 'crystal') A.play('crystal', { x: e.x, vol: 0.55 });
        else if (e.kind === 'ice') A.play('ice', { x: e.x, vol: 0.45, gap: 0.05 });
        else if (e.kind === 'gold') { A.play('gold', { x: e.x, vol: 0.8, gap: 0 }); if (!attract && e.side) { const p = R.project(e.x, 1, e.z); U.pop(p.x, p.y, 'GOLD!', '#ffd23f'); } }
        D.addTrauma(big ? 0.12 : 0.04);
        if (e.side === 1) {
          addScore(ROCK_PTS[e.size] * (ROCK_KINDS[e.kind] ? ROCK_KINDS[e.kind].score : 1), e.x, e.z, e.kind === 'gold' ? 'GOLD' : e.size >= 3);
          addOre([0, 1, 2, 3, 4][e.size] + (e.kind === 'gold' ? 12 : 0));
          if (e.kind === 'gold' && G.ch && G.mode === 'campaign') { G.ch.gold++; if (G.stage === 0 && G.ch.gold >= 3) award('s1gold'); }
        }
        break;
      }
      case 'chip': A.play('rockhit', { x: e.x, vol: 0.35, gap: 0.03 }); break;
      case 'hit': {
        const human = isHuman(e.side);
        A.play('hullhit', { x: e.x, vol: 0.75, gap: 0 });
        D.addTrauma(human ? 0.45 : 0.25);
        G.hitstop = Math.max(G.hitstop, e.dmg >= 2 ? 0.07 : 0.035);
        if (!attract) {
          const p = R.project(e.x, 1.2, e.z);
          const label = e.src === 'shard' ? 'SHARD STRIKE!' : e.src === 'ram' ? 'RAMMED!' : e.src === 'beam' ? 'SEARED!' : e.src === 'storm' ? 'STRUCK!' : e.src === 'hole' ? 'SPAGHETTIFIED!' : e.dmg >= 2 ? 'CRITICAL HIT' : 'HIT';
          U.pop(p.x, p.y, label, e.src === 'shard' ? '#ffd23f' : '#ff5060', e.dmg >= 2 || e.src === 'shard' ? 'big' : '');
          if (e.src === 'shard') ann('shardstrike', 40, { chance: 0.35 });
          if (e.hp > 0 && e.hp <= 2 && human) ann('critical', 60, { chance: 0.5 });
          if (G.sides[e.side] && G.sides[e.side].persona) pilotSay(e.side, 'hurt', { chance: 0.3 });
          else if (e.by && G.sides[e.by] && G.sides[e.by].persona) pilotSay(e.by, e.src === 'shard' ? 'taunt' : 'score', { chance: 0.3 });
        }
        if (human && G.mode !== 'demo') U.hurt();
        rumble(e.side, 0.7 + 0.15 * e.dmg, 0.6, 160 + 70 * e.dmg);
        if (e.by === 1 && e.side === -1) {
          addScore(e.src === 'shard' ? 300 : e.src === 'ram' ? 200 : 150, e.x, e.z, e.src === 'shard');
          addOre(e.src === 'shard' ? 5 : 2);
          if (e.src === 'shard' && G.ch && G.mode === 'campaign' && G.state === 'play') { G.ch.shards++; if (G.stage === 1 && G.ch.shards >= 3) award('s2shard'); }
        }
        if (e.side === 1 && G.ch && G.mode === 'campaign') {
          if (e.src === 'storm' || e.src === 'arc') G.ch.struck++;
          if (e.src === 'hole') G.ch.swallowed++;
        }
        break;
      }
      case 'shield': A.play('shieldhit', { x: e.x, vol: 0.8, gap: 0 }); rumble(e.side, 0.3, 0.6, 110); break;
      case 'dodge': {
        if (!attract && isHuman(e.side) && now() - G.closeT > 1.2) { G.closeT = now(); const p = R.project(e.x, 1, e.z); U.pop(p.x, p.y - 20, 'CLOSE CALL', '#9affff', 'small'); addScore(25); }
        if (e.side === 1 && G.ch && G.mode === 'campaign' && G.state === 'play') { G.ch.dodges++; if (G.stage === 3 && G.ch.dodges >= 5) award('s4dare'); }
        break;
      }
      case 'bump': A.play('bump', { x: e.x, vol: 0.25 + (e.k2 || 0) * 0.5, gap: 0.08 }); if (e.side && (e.k2 || 0) > 0.3) rumble(e.side, 0.25 * e.k2, 0.35, 70); break;
      case 'boom': if (!e.small) { A.play('boom_big', { x: e.x, vol: 0.9, gap: 0 }); A.play('mineboom', { x: e.x, vol: 0.5, gap: 0 }); D.addTrauma(0.35); } else A.play('boom_small', { x: e.x, vol: 0.5 }); break;
      case 'mineboom': A.play('mineboom', { x: e.x, vol: 0.8, gap: 0 }); D.addTrauma(0.3); break;
      case 'ko': onKO(e); break;
      case 'orb': A.play('puspawn', { x: e.x, vol: 0.45 }); break;
      case 'pu': {
        const def = POWERUPS[e.kind];
        A.play('pucollect', { x: e.x, gap: 0 });
        A.play(def.sfx, { x: e.x, vol: 0.7, gap: 0, delay: 0.08 });
        if (!attract) {
          U.toast(e.side, e.kind);
          if (e.snipe) { const p = R.project(e.x, 1, e.z); U.pop(p.x, p.y, 'SNIPED!', '#ffffff', 'small'); }
          ann(def.voice, 60, { chance: 0.2 });
        }
        if (e.side === 1) addScore(50);
        rumble(e.side, 0, 0.35, 60);
        if (e.snipe && e.side === 1 && G.ch && G.mode === 'campaign' && G.state === 'play') { G.ch.snipes++; if (G.stage === 2 && G.ch.snipes >= 3) award('s3snipe'); }
        break;
      }
      case 'dash': A.play('dash', { x: e.x, vol: isHuman(e.side) ? 0.6 : 0.4, gap: 0 }); rumble(e.side, 0.1, 0.45, 90); break;
      case 'od': A.play('overdrive', { gap: 0 }); D.addTrauma(0.3); rumble(e.side, 0.5, 0.7, 320); if (!attract) ann('overdrive', 60, { chance: 0.2 }); break;
      case 'wave': A.play('wave', { vol: 0.5, gap: 0 }); if (!attract) ann('wave', 90, { chance: 0.15 }); break;
      case 'strikewarn': A.play('beep', { x: e.x, vol: 0.25, gap: 0 }); break;
      case 'strike': A.play('storm', { x: e.x, gap: 0, vol: 0.85 }); D.addTrauma(0.25); if (!attract) ann('storm', 120, { chance: 0.12 }); break;
      case 'cometwarn': A.play('alarm', { vol: 0.25, gap: 0 }); break;
      case 'comet': A.play('comet', { x: e.x, vol: 0.8, gap: 0 }); if (!attract) ann('comet', 120, { chance: 0.15 }); break;
      case 'portal': A.play('portal', { x: e.x, vol: 0.55 }); if (e.ship === 1 && G.ch && G.mode === 'campaign' && G.state === 'play') { G.ch.gates++; if (G.stage === 3 && G.ch.gates >= 6) award('s4gate'); } break;
      case 'eat': A.play(e.ship ? 'well' : 'boom_small', { x: e.x, vol: e.ship ? 0.7 : 0.25, gap: 0.1 }); break;
      case 'nova': A.play('nova', { x: e.x, gap: 0 }); D.addTrauma(0.6); break;
      case 'well': A.play('well', { x: e.x, vol: 0.7 }); break;
      case 'mine': A.play('mine', { x: e.x, vol: 0.6 }); break;
      case 'heal': A.play('repair', { x: e.x, vol: 0.5 }); break;
      case 'arc': A.play('storm', { x: e.x, vol: 0.35, gap: 0.2 }); break;
      case 'bossfire': A.play('shot2', { x: e.x, vol: e.ring ? 0.6 : 0.3, gap: 0.05, rate: 0.7 }); break;
      case 'bosshit': A.play('rockhit', { x: e.x, vol: 0.4, gap: 0.03, rate: 0.8 }); if (e.part === 'core') addScore(25); else addScore(10); break;
      case 'bossblock': A.play('rockhit', { x: e.x, vol: 0.18, gap: 0.08, rate: 0.6 }); break;
      case 'beamcharge': A.play('bosscharge', { x: e.x, vol: 0.8, gap: 0 }); break;
      case 'beam': A.play('bossbeam', { x: e.x, vol: 0.9, gap: 0 }); D.addTrauma(0.4); break;
      case 'spit': A.play('bossroar', { x: e.x, vol: 0.45, gap: 3 }); break;
      case 'eyedown': {
        A.play('boom_big', { x: e.x, gap: 0 }); A.play('bossroar', { x: e.x, vol: 0.7, gap: 0 });
        D.addTrauma(0.6);
        if (!attract) { const p = R.project(e.x, 1.4, e.z); U.pop(p.x, p.y, e.left ? `EYE DOWN · ${e.left} LEFT` : 'ALL EYES DOWN', '#ffd23f', 'big'); }
        addScore(1000, e.x, e.z);
        addOre(15);
        break;
      }
      case 'phase2': {
        A.play('alarm', { gap: 0 }); A.play('bossroar', { gap: 0 });
        D.addTrauma(0.8);
        D.slowMo(0.3, 1.2);
        if (!attract) { U.showBanner('PHASE 2', 'THE CORE IS EXPOSED', '#ff2a48', 2.2); pilotSay(-1, 'phase2', KEY); }
        addScore(2000, e.x, e.z);
        addOre(20);
        if (G.mode === 'campaign' && G.stage === 4 && G.matchT < 60) award('s5eyes');
        break;
      }
    }
  }
}

// ------------------------------------------------------------------ pilot select
let pickCb = null, pickOpts = {};
function pickThen(label, cb, opts = {}) {
  if (!unlocks.size) return cb('p1');
  choosePilot(label, cb, opts);
}
function choosePilot(label, cb, opts = {}) {
  pickCb = cb; pickOpts = opts;
  G.state = 'pilot';
  $('pilot-for').textContent = label;
  $('pgrid').innerHTML = ROSTER.map((k) => {
    const open = isOpen(k);
    const c = k === 'p1' ? (opts.slot === 2 ? HUMAN2.color : HUMAN.color) : PILOTS[k].color;
    const name = k === 'p1' ? 'ACE' : PILOTS[k].name;
    return `<button class="mbtn pick ${open ? '' : 'locked'}" data-pilot="${k}" style="--pc:${hex(c)}"><b>${name}</b><small>${open ? PERKS[k].name : '🔒 LOCKED'}</small></button>`;
  }).join('');
  U.show('pilot');
  const want = ROSTER.indexOf(isOpen(opts.def) ? opts.def : 'p1');
  menuSel(Math.max(0, want));
  if (!G.saidPilot) { G.saidPilot = true; ann('pilot', 0, { priority: true }); }
}
function pilotDesc(b) {
  const k = b && b.dataset.pilot;
  const el = $('pdesc');
  if (!k) { el.innerHTML = '&nbsp;'; return; }
  el.innerHTML = isOpen(k) ? `<b>${PERKS[k].name}</b> — ${PERKS[k].desc}` : `<b>LOCKED</b> — ${lockHint(k)} to fly this pilot.`;
}
function pickPilot(k) {
  if (!isOpen(k) || !pickCb) { A.play('uiback', { gap: 0 }); return; }
  if (pickOpts.slot === 2) settings.pilot2 = k; else settings.pilot = k;
  saveSettings();
  const cb = pickCb;
  pickCb = null;
  cb(k);
}

// ------------------------------------------------------------------ the hangar (between campaign sectors)
function openHangar() {
  clearTimers();
  G.state = 'hangar';
  renderHangar();
  U.show('hangar');
  const btns = visibleButtons();
  const first = btns.findIndex((b) => b.dataset.up && !b.classList.contains('poor') && !b.classList.contains('max'));
  menuSel(first >= 0 ? first : btns.length - 1);
}
function renderHangar() {
  $('hg-ore').textContent = G.ore;
  $('hg-next').textContent = G.stage + 1 === 4 ? 'LAUNCH → THE MAW' : `LAUNCH → SECTOR ${G.stage + 2}`;
  $('upgrid').innerHTML = UP_KEYS.map((k) => {
    const D2 = UPGRADES[k], lv = G.up[k] || 0, max = lv >= 3, cost = UP_COST[lv], can = !max && G.ore >= cost;
    return `<button class="mbtn upg ${max ? 'max' : can ? '' : 'poor'}" data-up="${k}" style="--uc:${hex(D2.color)}"><i>${D2.glyph}</i><b>${D2.name}</b>`
      + `<span class="lvl">${[0, 1, 2].map((i) => `<em class="${i < lv ? 'on' : ''}"></em>`).join('')}</span>`
      + `<small>${max ? 'FULLY UPGRADED' : D2.lv[lv]}</small><span class="cost">${max ? 'MAX' : '◆ ' + cost}</span></button>`;
  }).join('');
}
function buyUpgrade(k) {
  if (G.state !== 'hangar') return;
  const lv = G.up[k] || 0;
  if (lv >= 3 || G.ore < UP_COST[lv]) {
    A.play('uiback', { gap: 0 });
    const o = $('hg-orebox');
    o.classList.remove('short'); void o.offsetWidth; o.classList.add('short');
    return;
  }
  G.ore -= UP_COST[lv];
  G.up[k] = lv + 1;
  A.play('repair', { gap: 0, vol: 0.7 });
  const i = G.menuI;
  renderHangar();
  menuSel(i);
}
// tests: spend the ore on the cheapest upgrades, then launch
function hangarAuto() {
  if (G.state !== 'hangar') return;
  for (;;) {
    const k = UP_KEYS.filter((q) => (G.up[q] || 0) < 3 && G.ore >= UP_COST[G.up[q] || 0]).sort((a, b) => (G.up[a] || 0) - (G.up[b] || 0))[0];
    if (!k) break;
    buyUpgrade(k);
  }
  G.stage++;
  stageIntro();
}

// ------------------------------------------------------------------ versus setup
function openVersus() {
  G.state = 'vsetup';
  renderVsetup();
  U.show('vsetup');
  menuSel(visibleButtons().length - 1);
}
function renderVsetup() {
  const tw = settings.twists || {}, cpu = settings.vsOpp === 'cpu';
  $('vs-opp').innerHTML = `<button class="mbtn tog ${cpu ? '' : 'on'}" data-opp="human">PLAYER 2<small>SAME SCREEN · KEYS OR PADS</small></button>`
    + `<button class="mbtn tog ${cpu ? 'on' : ''}" data-opp="cpu">CPU RIVAL<small>A RANDOM PILOT</small></button>`;
  $('twgrid').innerHTML = Object.entries(TWISTS).map(([k, t]) => `<button class="mbtn tw ${tw[k] ? 'on' : ''}" data-tw="${k}"><b>${t.name}</b><small>${t.desc}</small></button>`).join('');
  if (G.state === 'vsetup') menuSel(Math.min(G.menuI || 0, visibleButtons().length - 1));
}
function vsGo() {
  const cpu = settings.vsOpp === 'cpu';
  pickThen('PLAYER 1 · YOUR PILOT', (a) => {
    if (cpu) return startVersus(a, null);
    pickThen('PLAYER 2 · YOUR PILOT', (b) => startVersus(a, b), { slot: 2, def: settings.pilot2 });
  }, { def: settings.pilot });
}

// ------------------------------------------------------------------ instant replay
const RSND = { fire: 'shot1', chip: 'rockhit', shield: 'shieldhit', dash: 'dash', bump: 'bump', pu: 'pucollect', portal: 'portal', od: 'overdrive', strike: 'storm', mineboom: 'mineboom', beam: 'bossbeam', beamcharge: 'bosscharge', eyedown: 'boom_big', phase2: 'alarm', comet: 'comet' };
function withReplay(info, then, mid = false) {
  // between rounds only the decisive knockout of a match gets a replay; mid-match rounds skip it
  if (mid || settings.replay === 'off' || !startReplay(info, then)) then();
}
function startReplay(info, then = () => {}) {
  const rp = REC.replay(info.n);
  if (!rp) return false;
  G.replay = { rp, info, then };
  G.state = 'replay';
  U.hideBanner();
  U.setHud(false);
  for (const id of ['demo-badge', 'cap-l', 'cap-r', 'tip', 'attract-board', 'touch']) $(id).classList.add('hidden');
  $('replay').classList.remove('hidden');
  $('popups').innerHTML = '';
  for (const s2 of [1, -1]) $('toast-' + s2).innerHTML = '';
  R.setWorld(rp.W, G.sides);
  D.slow = 1; D.slowT = 0; D.trauma = 0; D.snap = true;
  A.play('rewind', { gap: 0, noSlow: true, vol: 0.8 });
  ann('replay', Infinity, { key: true, queue: true });
  return true;
}
function stopReplay(run = true) {
  const r = G.replay;
  if (!r) return;
  G.replay = null;
  $('replay').classList.add('hidden');
  D.endReplay();
  A.setRate(1);
  if (G.W) R.setWorld(G.W, G.sides);
  if (run) r.then();
}
function replayFrame(dt) {
  const r = G.replay, rp = r.rp;
  const toKO = rp.toKO;
  const speed = toKO > 0.6 ? 0.65 : toKO > -0.25 ? 0.25 : 0.5;
  A.setRate(1 - (1 - speed) * 0.55);
  replayEvents(rp.advance(dt * speed), rp.W);
  if (rp.done) { stopReplay(); return false; }
  D.update(dt, { W: rp.W, replay: r.info, shake: +settings.shake });
  R.sync(rp.W, dt * speed, { tactical: false, ai: {} });
  look.desat = 0.16; look.chroma = 0;
  R.render(dt, look);
  perf(dt);
  return true;
}
function replayEvents(list, W) {
  for (const e of list) {
    R.event(e, W);
    if (e.k === 'rock') A.play(e.size >= 3 ? 'boom_big' : e.size === 2 ? 'boom_mid' : 'boom_small', { x: e.x, vol: 0.5 });
    else if (e.k === 'hit') { A.play('hullhit', { x: e.x, gap: 0 }); D.addTrauma(0.4); }
    else if (e.k === 'boom') { A.play('boom_big', { x: e.x, gap: 0 }); D.addTrauma(0.35); }
    else if (e.k === 'ko') { A.play('ko', { gap: 0, noSlow: true }); A.play('shipboom', { gap: 0, noSlow: true }); D.addTrauma(1); }
    else if (RSND[e.k]) A.play(RSND[e.k], { x: e.x, vol: 0.4, gap: 0.04 });
  }
}

// ------------------------------------------------------------------ online
const myIni = () => { try { return esc(localStorage.getItem('jez237_initials')).slice(0, 4); } catch { return ''; } };
const onMe = () => ({ ini: myIni(), pilot: G.onPilot || 'p1' });
function openOnline() {
  pickThen('ONLINE · YOUR PILOT', (k) => { G.onPilot = k; showOnline(); }, { def: settings.pilot });
}
function showOnline(msg) {
  NET.close();
  NET.reset();
  G.state = 'online';
  const st = $('on-status');
  st.textContent = msg || 'Duel a rival anywhere in the world. Best of three.';
  st.classList.toggle('err', !!msg);
  $('on-menu').classList.remove('hidden');
  $('on-room').classList.add('hidden');
  $('on-join').classList.add('hidden');
  U.show('online');
  menuSel(0);
}
function lobbyUI(text, code) {
  G.state = 'online-wait';
  $('on-status').classList.remove('err');
  $('on-status').textContent = code ? 'Send a friend this code or the invite link.' : 'Best of three against a player anywhere in the world.';
  $('on-menu').classList.add('hidden');
  $('on-join').classList.add('hidden');
  $('on-room').classList.remove('hidden');
  $('on-codewrap').classList.toggle('hidden', !code);
  $('on-code').textContent = code || '';
  $('on-copy').textContent = navigator.share && I.isTouch ? 'SHARE INVITE' : 'COPY INVITE LINK';
  $('on-wait').textContent = text;
  U.show('online');
  menuSel(0);
}
function onlineQuick() { lobbyUI('Searching for a rival…'); NET.quick(onMe()); }
function onlineHost() {
  const code = randomCode(4);
  G.onCode = code;
  lobbyUI('Waiting for your rival to join…', code);
  NET.connect(ROOM + code, 'host', onMe());
}
function onlineJoin(code) {
  if (!G.onPilot) G.onPilot = isOpen(settings.pilot) ? settings.pilot : 'p1';
  lobbyUI(`Joining room ${code}…`);
  NET.connect(ROOM + code, 'join', onMe());
}
function showJoin() {
  G.state = 'online-join';
  $('on-menu').classList.add('hidden');
  $('on-join').classList.remove('hidden');
  const inp = $('join-code');
  inp.value = '';
  menuSel(0);
  setTimeout(() => inp.focus(), 30);
}
function joinFromInput() {
  const code = cleanCode($('join-code').value);
  if (code.length !== 4) { A.play('uiback', { gap: 0 }); $('join-code').focus(); return; }
  $('join-code').blur();
  A.play('uiok', { gap: 0 });
  onlineJoin(code);
}
async function copyInvite(btn) {
  const url = `${location.origin}${location.pathname}?room=${G.onCode}`;
  try {
    if (navigator.share && I.isTouch) await navigator.share({ title: 'Asteroids 2026', text: `Duel me online! Room ${G.onCode}`, url });
    else { await navigator.clipboard.writeText(url); btn.textContent = 'COPIED!'; setTimeout(() => (btn.textContent = 'COPY INVITE LINK'), 1600); }
  } catch { btn.textContent = url; }
}
function onStatus(text, kind) {
  if (!['online', 'online-wait', 'online-join'].includes(G.state)) return;
  if (kind === 'error') return showOnline(text);
  if (text !== 'waiting') $('on-wait').textContent = text;
}
function onJoined(peer) {
  if (G.state !== 'online-wait') return;
  A.play('uiok', { gap: 0 });
  ann('found', 0, KEY);
  $('on-wait').textContent = `${peer.ini || 'Your rival'} is here! Get ready…`;
  $('on-codewrap').classList.add('hidden');
  if (NET.side === 1) after(1.4, () => { if (NET.peer) onlineMatch(); });
}
function onLeft(reason) {
  if (G.mode !== 'online') {
    if (['online', 'online-wait', 'online-join'].includes(G.state)) showOnline(reason === 'left' ? 'Your rival left' : 'Lost the connection to the online server');
    return;
  }
  NET.close(true);
  clearTimers();
  G.simOn = false;
  G.mode = 'online-over';
  U.hideScreens();
  U.showBanner(reason === 'left' ? 'RIVAL LEFT' : 'CONNECTION LOST', 'BACK TO THE TITLE', '#ff3040', 3);
  ann(reason === 'left' ? 'victory' : 'lost', 0, KEY);
  after(3.2, () => goTitle());
}
function onChat(msg) {
  if (msg.k === 'again') { G.peerAgain = true; maybeRematch(); }
}
function onlineMatch() {
  G.wins = { 1: 0, '-1': 0 };
  G.round = 1;
  G.vsArenas = shuffle([0, 1, 2, 3]);
  onlineNextRound();
}
function onlineNextRound() {
  if (!NET.peer) return;
  const cfg = { r: G.round, ar: G.vsArenas[(G.round - 1) % 4], sd: (Math.random() * 1e9) | 0,
    w: [G.wins[1], G.wins[-1]], p1: G.onPilot || 'p1', p2: NET.peer.pilot, n1: myIni(), n2: NET.peer.ini };
  NET.raw({ type: 'start', ...cfg });
  onlineRound(cfg);
}
function onlineRound(cfg) {
  if (G.mode === 'online-over') return;
  clearTimers();
  G.mode = 'online';
  G.menuCam = false;
  G.round = cfg.r | 0 || 1;
  G.wins = { 1: (cfg.w && cfg.w[0]) | 0, '-1': (cfg.w && cfg.w[1]) | 0 };
  G.meAgain = false; G.peerAgain = false;
  const me = NET.side;
  const pk = { 1: PILOTS[cfg.p1] ? cfg.p1 : 'p1', '-1': PILOTS[cfg.p2] ? cfg.p2 : 'p1' };
  const nm = { 1: esc(cfg.n1).slice(0, 4) || 'P1', '-1': esc(cfg.n2).slice(0, 4) || 'P2' };
  const sides = {};
  for (const s of [1, -1]) {
    const h = humanPilot(pk[s], s === 1 ? 1 : 2, s === me ? `${nm[s]} · YOU` : `${nm[s]} · ONLINE`);
    if (pk[s] === 'p1') h.name = nm[s];
    sides[s] = s === me ? { kind: 'human', human: h, who: 'solo' } : { kind: 'remote', human: h };
  }
  if (pk[1] === pk[-1] && pk[1] !== 'p1') sides[-1].human = { ...sides[-1].human, color: SHADOW[pk[1]] };
  const arena = ((cfg.ar | 0) % 4 + 4) % 4;
  startMatch({ arena, seed: cfg.sd | 0, sides });
  NET.bind(G.W);
  $('res-quit').classList.add('hidden');
  A.playMusic(ARENAS[arena].music);
  if (G.round === 1) {
    G.state = 'vs';
    fillVs(G.sides[me], G.sides[-me], `ONLINE · BEST OF THREE · <b>${ARENAS[arena].name}</b>`, sides[me].human.blurb, sides[-me].human.blurb);
    U.show('vs');
    U.setHud(false);
    G.simOn = false;
    ann('online', 0, KEY);
    after(3.4, () => countdown());
  } else countdown();
}
function onlineResults(winner) {
  const W = G.W, me = soloSide();
  const rows = [];
  for (const s of [me, -me]) {
    const st = W.stats[s], n = G.sides[s].name;
    rows.push([`${n} HITS / SHARD STRIKES`, `${st.hits} / ${st.shards}`], [`${n} ROCKS / POWER-UPS`, `${st.rocks} / ${st.pickups}`]);
  }
  $('res-title').textContent = winner === me ? 'YOU WIN THE MATCH' : `${G.sides[winner].name} WINS THE MATCH`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('');
  $('res-total').textContent = `${G.wins[me]} – ${G.wins[-me]}`;
  $('res-next').textContent = 'REMATCH';
  $('res-quit').classList.remove('hidden');
  G.state = 'results';
  G.resultsNext = () => {
    if (G.meAgain) return;
    G.meAgain = true;
    NET.chat({ k: 'again' });
    $('res-next').textContent = 'WAITING FOR YOUR RIVAL…';
    maybeRematch();
  };
  U.show('results');
  menuSel(0);
}
function maybeRematch() {
  if (G.mode !== 'online' || !G.meAgain || !G.peerAgain) return;
  if (NET.side === 1) onlineMatch();
}
function waitingForHost() {
  const stale = NET.stale && G.state === 'play';
  if (stale && !G.staleShown) { G.staleShown = true; U.showBanner('WAITING FOR YOUR RIVAL', 'THE HOST HAS PAUSED OR LOST CONNECTION', '#ffd23f', 0); }
  else if (!stale && G.staleShown) { G.staleShown = false; U.hideBanner(); }
}

// ------------------------------------------------------------------ boot
function bootProgress() {
  const total = 48 + 44 + 31;
  const n = A.buf.size;
  $('loadfill').style.width = Math.min(100, (n / total) * 100) + '%';
  return n / total;
}
function enterTitle() {
  if (G.state !== 'boot') return;
  A.unlock();
  A.ctx && A.ctx.resume && A.ctx.resume();
  G.state = 'title';
  say('ann_title', 0, KEY);
  goTitle();
  const code = cleanCode(params.get('room'));
  if (code.length === 4) {
    history.replaceState(null, '', location.pathname);
    G.onPilot = isOpen(settings.pilot) ? settings.pilot : 'p1';
    onlineJoin(code);
  }
}

// ------------------------------------------------------------------ engine hum
const hums = new Map();
function engineHum() {
  const W = G.W;
  if (!A.ctx || !W) return;
  const want = new Map();
  for (const s of W.ships) {
    if (!s.alive || G.paused || G.replay) continue;
    const k = Math.max(0, s.thrustK) + (s.dashT > 0 ? 1 : 0);
    want.set(s.side, (isHuman(s.side) ? 0.28 : 0.14) * k * (G.mode === 'attract' ? 0.3 : 1));
  }
  for (const side of [1, -1]) {
    const v = want.get(side) || 0;
    let h = hums.get(side);
    if (!h && v > 0.01 && A.buf.has('thrust')) { h = A.loop('thrust', 0); if (h) hums.set(side, h); }
    if (h) h.gain.gain.setTargetAtTime(v, A.ctx.currentTime, 0.08);
  }
}

// ------------------------------------------------------------------ frame loop
let last = performance.now();
const look = { bloom: 1.25, exposure: 1, desat: 0, fade: 0, chroma: 0, tint: new THREE.Vector3(1, 1, 1) };
function tick(dt) {
  I.pollPads(G.mode === 'versus' && !solo());
  for (const t of G.timers.slice()) {
    if (G.paused) break;
    t.t -= dt;
    if (t.t <= 0) { G.timers.splice(G.timers.indexOf(t), 1); t.fn(); }
  }
  if (G.replay && replayFrame(dt)) { engineHum(); return; }
  const W = G.W;
  let scale = G.simOn && !G.paused ? D.slow : 0;
  if (G.hitstop > 0) { G.hitstop -= dt; scale *= 0.12; }
  if (G.simOn && !G.paused) A.setRate(1 - (1 - Math.min(1, D.slow)) * 0.55);
  const sdt = dt * scale;
  if (W) {
    const online = G.mode === 'online' && NET.W === W;
    const host = online && NET.side === 1, guest = online && NET.side === -1;
    const rec = settings.replay !== 'off' && (G.mode === 'campaign' || G.mode === 'versus' || G.mode === 'demo') && G.simOn;
    if (guest) handleEvents(NET.guestSync(W));
    G.acc += sdt;
    let n = 0;
    while (G.acc >= STEP && n < 16) {
      if (host) NET.hostTick(W);
      if (rec) REC.tick(W);
      controls(W, STEP);
      if (rec) REC.input(W);
      step(W, STEP);
      const ev = drainEvents(W);
      if (host) NET.hostEvents(ev);
      handleEvents(ev);
      G.acc -= STEP;
      n++;
    }
    if (n >= 16) G.acc = 0;
    if (G.state === 'play') G.matchT += sdt;
    if (host) NET.hostFrame(W, dt);
    if (guest) { NET.guestFrame(W, dt); waitingForHost(); }
  }
  const demoCam = G.mode === 'demo' && G.state !== 'ko';
  D.update(dt, { W, demo: demoCam && !G.menuCam && W, menu: G.menuCam, ko: G.state === 'ko' && G.ko, me: G.humans.length === 1 ? G.humans[0].s.side : 0, shake: +settings.shake });
  if (W) {
    const tactical = settings.tactical === 'always' ? !!Object.keys(G.ai).length && G.mode !== 'attract' : settings.tactical === 'demo' ? G.mode === 'demo' : false;
    R.sync(W, sdt || (G.paused ? 0 : dt * 0.2), { tactical, ai: G.ai });
  }
  look.desat = G.paused ? 0.65 : (1 - D.slow) * 0.35;
  look.chroma = (1 - D.slow) * 0.004;
  R.render(dt, look);
  if (W && !U.hud.classList.contains('hidden')) U.updateHud(W);
  updateCaptions(dt);
  updateStick();
  engineHum();
  if (G.state === 'boot') {
    const p = bootProgress();
    if (p > 0.35 && !G.bootReady) { G.bootReady = true; $('press').textContent = I.isTouch ? 'TAP TO START' : 'CLICK OR PRESS ANY KEY'; }
  }
  if (G.state === 'title') {
    G.idleT += dt;
    if (G.idleT > 28) startDemo();
  }
  if (solo() && W) { const s = shipOf(W, soloSide()); if (s) { $('t-od').classList.toggle('ready', s.od >= F.odMax && s.odTime <= 0); $('t-dash').classList.toggle('ready', s.dashCD <= 0); } }
  perf(dt);
}

// the floating touch stick
function updateStick() {
  const el = $('stick');
  const st = I.stick;
  const on = !!st && !$('touch').classList.contains('hidden');
  el.classList.toggle('hidden', !on);
  if (!on) return;
  el.style.left = st.sx + 'px';
  el.style.top = st.sy + 'px';
  const dx = st.x - st.sx, dy = st.y - st.sy, l = Math.hypot(dx, dy), m = Math.min(l, 56);
  el.firstElementChild.style.transform = `translate(${l ? (dx / l) * m : 0}px, ${l ? (dy / l) * m : 0}px)`;
}

function updateCaptions(dt) {
  if (G.mode !== 'demo' || !G.W) return;
  const W = G.W;
  for (const [s, id] of [[1, 'cap-l'], [-1, 'cap-r']]) {
    const ai = G.ai[s];
    const el = $(id);
    if (!ai) { el.classList.add('hidden'); continue; }
    el.classList.remove('hidden');
    const fresh = W.t - ai.captionT < 2.6 && ai.caption;
    el.style.opacity = fresh ? 1 : 0.3;
    const txt = `${ai.name} ▸ <b>${ai.caption || 'READING THE BELT'}</b>`;
    if (el._t !== txt) { el._t = txt; el.innerHTML = txt; }
  }
  G.boardT -= dt;
  if (G.boardT <= 0) { G.boardT = 45; showAttractBoard(); }
  G.tipT -= dt;
  if (G.tipT <= 0) {
    G.tipT = 9;
    const tip = $('tip');
    tip.textContent = 'TIP · ' + TIPS[G.tipI++ % TIPS.length];
    tip.classList.remove('hidden');
    tip.style.opacity = 1;
    setTimeout(() => { tip.style.opacity = 0; }, 6500);
  }
}

let perfAcc = 0, perfN = 0, perfT = 0;
function perf(dt) {
  if (params.has('fixed')) return;
  perfAcc += dt; perfN++; perfT += dt;
  if (perfT < 2) return;
  const avg = perfAcc / perfN;
  perfAcc = 0; perfN = 0; perfT = 0;
  if (avg > 1 / 45 && R.scale > 0.55) { R.scale = Math.max(0.55, R.scale - 0.1); R.resize(); }
  else if (avg < 1 / 58 && R.scale < 1) { R.scale = Math.min(1, R.scale + 0.05); R.resize(); }
}

function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  tick(dt);
}

addEventListener('resize', () => { R.resize(); D.fitCache = {}; });
document.querySelectorAll('.vtxt').forEach((e) => (e.textContent = `ASTEROIDS 2026 ${VERSION}`));
$('ver').textContent = VERSION;
for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) {
  addEventListener(ev, () => { if (A.ctx && A.ctx.state !== 'running') A.ctx.resume(); }, { passive: true });
}

// boot: the belt plays itself behind the logo while sounds load
A.unlock();
randomAIMatch(false);
G.mode = 'attract';
G.simOn = true;
G.state = 'boot';
U.show('boot');
if (params.has('demo')) { G.demoBoot = true; startDemo(); }
requestAnimationFrame(frame);
// test hooks
Object.assign(window.__a26, {
  tick: (dt, n = 1) => { for (let i = 0; i < n; i++) tick(dt); },
  startDemo, startCampaign, startVersus, goTitle, enterTitle, endRun, unlock, startReplay, choosePilot, openVersus, hangarAuto, award, medals,
  online: { openOnline, showOnline, onlineQuick, onlineHost, onlineJoin, setPilot: (k) => { G.onPilot = k; } },
});
