// Plasma Pong: Battle Edition — game flow, controls, scoring, commentary and the frame loop.
import * as THREE from '../vendor/three.module.min.js';
import { F, VERSION, PILOTS, HUMAN, HUMAN2, ARENAS, LADDER, DIFFICULTY, POWERUPS, PERKS, ROSTER, SHADOW, TWISTS } from './config.js?v=4';
import { makeWorld, step, drainEvents, STEP, paddlesOf } from './sim.js?v=4';
import { AIPilot } from './ai.js?v=4';
import { predictToPlane } from './predict.js?v=4';
import { Renderer, pickQuality } from './render.js?v=4';
import { Director } from './director.js?v=4';
import { Audio } from './audio.js?v=4';
import { Input } from './input.js?v=4';
import { UI, $, hex } from './ui.js?v=4';
import { Scores } from './scores.js?v=4';
import { CALM } from './views.js?v=4';
import { Recorder } from './replay.js?v=4';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=4';

// ------------------------------------------------------------------ settings
const SKEY = 'ppb.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 55, sfx: 90, voice: 100, quality: 'auto', camera: 'auto', shake: '1', tactical: 'demo', flash: reduceMotion ? 'reduced' : 'full', replay: 'on', twists: {}, vsOpp: 'human', pilot: 'p1', pilot2: 'p1' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* ignore */ } };
const params = new URLSearchParams(location.search);
// reduced flashing: strobes become pulses, flashes and shockwaves are toned down
function applyCalm() { CALM.on = settings.flash === 'reduced'; document.body.classList.toggle('calm', CALM.on); }
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const D = new Director(R.camera);
const A = new Audio('./');
const I = new Input(R.camera);
const U = new UI();
const HS = new Scores('plasma-pong-battle');
const REC = new Recorder();
const NET = new Online({ status: onStatus, joined: onJoined, start: (cfg) => onlineRound(cfg), left: onLeft, chat: onChat },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });
const TIPS = [
  'Move INTO the ball as it arrives to SMASH it',
  'Sweep sideways as you hit to CURVE the ball',
  'Shoot a power-up orb with a plasma bolt to claim it',
  'A bolt that hits the rival paddle STUNS it',
  'Aim for the GAPS — a ball through a gap hits the core',
  'Overdrive charges faster while your core is hurt',
  'The dotted lines are each AI\'s forecast and planned shot',
  'Shooting a ball nudges it — and makes it yours',
];

const G = {
  state: 'boot', mode: 'attract', W: null, ai: {}, aiList: [], humans: [], sides: null, cfg: null,
  stage: 0, diff: 'normal', score: 0, continues: 3, matchT: 0, round: 1, wins: { 1: 0, '-1': 0 }, vsArenas: [],
  idleT: 0, tipT: 0, tipI: 0, acc: 0, hitstop: 0, paused: false, simOn: false, timers: [], says: new Map(),
  autopilot: params.has('autoplay'), scopeT: 0, scope: { 1: null, '-1': null }, rallyCalled: false, minHP: { 1: 99, '-1': 99 }, fade: 0, menuCam: true,
};
window.__ppb = { G, R, D, A, I, settings, REC, NET };

// ------------------------------------------------------------------ helpers
const now = () => performance.now() / 1000;
function after(t, fn) { G.timers.push({ t, fn }); }
function clearTimers() { G.timers = []; }
function say(name, cd = 0, o = {}) {
  if (G.mode === 'attract') return;
  const t = now(), last = G.says.get(name) ?? -99;
  if (t - last < cd) return;
  G.says.set(name, t);
  A.say(name, o);
}
const ann = (n, cd, o) => say('ann_' + n, cd, o);
function pilotSay(side, line, chance = 1, o = { queue: true }) {
  const info = G.sides && G.sides[side];
  if (!info || !info.persona || Math.random() > chance) return;
  say(`${info.persona.key}_${line}`, 4, o);
}
function sideInfo(c) {
  if (c.human) return { name: c.human.name, title: c.human.title, color: c.human.color, human: true, pilot: c.human.pilot };
  return { name: c.persona.name, title: c.persona.title, color: c.persona.color, persona: c.persona };
}
// one human against the machine (or against someone online): the solo controls apply
const solo = () => G.mode === 'campaign' || G.mode === 'online' || (G.mode === 'versus' && !!(G.vs && G.vs.cpu));
const soloSide = () => (G.mode === 'online' ? NET.side || 1 : 1);

// ------------------------------------------------------------------ pilots you can fly
const UKEY = 'ppb.unlocks.v1';
const unlocks = new Set();
try { for (const k of JSON.parse(localStorage.getItem(UKEY) || '[]')) if (PERKS[k]) unlocks.add(k); } catch { /* none yet */ }
const isOpen = (k) => k === 'p1' || unlocks.has(k);
function unlock(k) {
  if (!PERKS[k] || k === 'p1' || unlocks.has(k)) return false;
  unlocks.add(k);
  try { localStorage.setItem(UKEY, JSON.stringify([...unlocks])); } catch { /* private mode */ }
  return true;
}
const lockHint = (k) => (k === 'monolith' ? 'FINISH THE CAMPAIGN' : `BEAT ${PILOTS[k].name} IN THE CAMPAIGN`);
// a human side flying pilot `key` (slot 2 gives the Challenger player two's colours)
function humanPilot(key, slot = 1, title) {
  const base = slot === 2 ? HUMAN2 : HUMAN;
  if (!PILOTS[key]) return { ...base, pilot: 'p1', title: title || base.title, blurb: `${PERKS.p1.name} — ${PERKS.p1.desc}` };
  const P = PILOTS[key], k = PERKS[key];
  return { key, pilot: key, name: P.name, title: title || `PLAYER ${slot} · ${k.name}`, color: P.color, accent: P.accent, blurb: `${k.name} — ${k.desc}` };
}
// the AI version of a rival; meeting your own pilot in a mirror match gets the shadow colours
function rivalPersona(key, vsPilot) {
  const P = PILOTS[key];
  return vsPilot === key ? { ...P, name: 'SHADOW ' + P.name, color: SHADOW[key] } : P;
}
const fmtT = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function camMode() {
  if (settings.camera !== 'auto') return settings.camera;
  if (G.mode === 'versus' && !solo()) return innerWidth > innerHeight ? 'side' : 'top';
  // very wide screens (phones held sideways) get the court laid out across the screen
  return innerWidth / innerHeight > 1.9 ? 'side' : 'arena';
}
function applyVolumes() {
  A.vol.music = settings.music / 100;
  A.vol.sfx = (settings.sfx / 100) * (G.mode === 'attract' ? 0.25 : 1);
  A.vol.voice = settings.voice / 100;
  A.applyVolumes();
}

// ------------------------------------------------------------------ matches
function startMatch(cfg) {
  const boss = cfg.sides[-1].persona && cfg.sides[-1].persona.boss ? -1 : 0;
  // the final stand: the challenger's core matches the Monolith's
  const coreHP = boss ? { 1: F.bossCoreHP } : undefined;
  const perks = {};
  for (const s of [1, -1]) { const h = cfg.sides[s].human; if (h && PERKS[h.pilot]) perks[s] = PERKS[h.pilot]; }
  const W = makeWorld({ arena: cfg.arena, seed: cfg.seed ?? ((Math.random() * 1e9) | 0), boss, coreHP, perks, twists: cfg.twists, serveDir: cfg.serveDir || (Math.random() < 0.5 ? 1 : -1) });
  G.W = W; G.ai = {}; G.aiList = []; G.humans = []; G.cfg = cfg;
  for (const s of [1, -1]) {
    const c = cfg.sides[s];
    const p = paddlesOf(W, s)[0];
    if (c.human && c.human.pilot === 'monolith') p.look = 'boss';
    if (c.kind === 'human') G.humans.push({ p, who: c.who, kbT: -9 });
    else if (c.kind === 'ai') { const ai = new AIPilot(W, p, c.persona, cfg.diffAI || DIFFICULTY.normal.ai); G.ai[s] = ai; G.aiList.push(ai); }
  }
  G.sides = { 1: sideInfo(cfg.sides[1]), '-1': sideInfo(cfg.sides[-1]) };
  R.setWorld(W, G.sides);
  U.buildHud(G.sides, W);
  G.matchT = 0; G.acc = 0; G.hitstop = 0; G.rallyCalled = false; G.minHP = { 1: 99, '-1': 99 };
  G.scope = { 1: null, '-1': null };
  D.slow = 1; D.slowT = 0; D.forceShot = null; D.breach = null;
  A.setRate(1);
  applyVolumes();
  REC.reset();
}

function randomAIMatch(demo) {
  const pool = shuffle(['volt', 'nyx', 'krank', 'seraph']);
  const bossFight = Math.random() < (demo ? 0.2 : 0.15);
  const a = PILOTS[pool[0]], b = bossFight ? PILOTS.monolith : PILOTS[pool[1]];
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
// the world top five on the title screen
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

// arcade attract: the global board drops in between demo rallies
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
  D.flip = false;
  setFlip(false);
  $('res-quit').classList.add('hidden');
  G.state = 'title';
  renderWorld();
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
  stageIntro();
}

function stageIntro() {
  clearTimers();
  const me = G.p1Pilot || 'p1';
  const pilot = rivalPersona(LADDER[G.stage], me);
  const you = humanPilot(me, 1, me === 'p1' ? 'CHALLENGER' : `YOU · ${PERKS[me].name}`);
  G.mode = 'campaign';
  G.menuCam = false;
  startMatch({ arena: G.stage, diffAI: DIFFICULTY[G.diff].ai, sides: { 1: { kind: 'human', human: you, who: 'solo' }, '-1': { kind: 'ai', persona: pilot } } });
  D.setMode(camMode());
  G.simOn = false;
  G.state = 'vs';
  fillVs(G.sides[1], G.sides[-1], `STAGE ${G.stage + 1} / 5 · <b>${ARENAS[G.stage].name}</b>`, me === 'p1' ? 'You. A paddle. A plasma cannon. A very bad idea.' : you.blurb, pilot.blurb);
  U.show('vs');
  U.setHud(false);
  A.playMusic(ARENAS[G.stage].music);
  if (pilot.boss) { A.play('alarm', { vol: 0.7, gap: 0 }); ann('boss', 0, { priority: true }); }
  else if (G.stage === 0) ann('challenger', 0, { priority: true });
  else A.play('whoosh', { vol: 0.8 });
  after(pilot.boss ? 3.1 : 1.9, () => pilotSay(-1, 'intro', 1, { priority: true }));
  after(pilot.boss ? 7.4 : 5.2, () => countdown());
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
  const r = G.mode === 'campaign' ? G.stage : G.round - 1;
  const last = G.mode === 'campaign' ? G.stage === 4 : false;
  const label = G.mode === 'campaign' ? `STAGE ${G.stage + 1}` : `ROUND ${G.round}`;
  U.showBanner(label, G.W.arena.name, hex(G.W.arena.grid), 1.3);
  ann(last ? 'final' : `round${Math.min(4, r + 1)}`, 0, { priority: true });
  const steps = [['3', 'three'], ['2', 'two'], ['1', 'one']];
  steps.forEach(([t, v], i) => after(1.5 + i * 0.75, () => { U.showBanner(t, '', '#ffffff', 0.7); A.play('beep', { vary: 0, gap: 0 }); ann(v, 0, { priority: true }); }));
  after(1.5 + 3 * 0.75, () => {
    U.showBanner('FIGHT!', '', '#ffd23f', 0.9);
    A.play('go', { gap: 0 });
    ann('fight', 0, { priority: true });
    if (G.state === 'pause') G.pausedState = 'play';
    else G.state = 'play';
    G.simOn = true;
  });
}

// p2 = null: a CPU rival flies the far side
function startVersus(p1 = 'p1', p2 = 'p1') {
  G.mode = 'versus';
  G.wins = { 1: 0, '-1': 0 };
  G.round = 1;
  G.vsArenas = shuffle([0, 1, 2, 3]);
  G.vs = { p1, p2, cpu: p2 === null ? shuffle(['volt', 'nyx', 'krank', 'seraph'])[0] : null, twists: { ...(settings.twists || {}) } };
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
    const keysA = V.cpu ? (I.isTouch ? 'Drag to move · tap to fire' : 'Mouse or WASD · F fire · E overdrive') : 'Mouse · WASD · F fire · E overdrive · pad 1 · lower touch';
    fillVs(G.sides[1], G.sides[-1], line, `${a.blurb}<br>${keysA}`, V.cpu ? G.sides[-1].persona.blurb : `${b.human.blurb}<br>Arrows · Enter fire · . overdrive · pad 2 · upper touch`);
    U.show('vs');
    U.setHud(false);
    G.simOn = false;
    ann('challenger', 0, { priority: true });
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
  D.setMode('side');
  D.shot = null;
  $('touch').classList.add('hidden');
  A.playMusic(G.W.arena.music);
  U.showBanner(`${G.sides[1].name} VS ${G.sides[-1].name}`, `DEMO · ${G.W.arena.name}`, hex(G.W.arena.grid), 2.2);
  ann('demo', 0, { priority: true });
  after(1.6, () => pilotSay(1, 'intro', 0.6));
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
  $('t-fire').classList.toggle('hidden', !solo());
  $('t-od').classList.toggle('hidden', !solo());
}

function updateMid() {
  $('arena-name').textContent = G.W ? G.W.arena.name : '';
  const sc = $('score');
  if (G.mode === 'campaign') { $('stage-line').textContent = `STAGE ${G.stage + 1} / 5 · ${DIFFICULTY[G.diff].label}`; sc.classList.remove('hidden'); sc.textContent = G.score.toLocaleString(); }
  else if (G.mode === 'versus') { $('stage-line').textContent = `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`; sc.classList.add('hidden'); }
  else if (G.mode === 'online') { const me = soloSide(); $('stage-line').textContent = `ONLINE · ROUND ${G.round} · ${G.wins[me]} – ${G.wins[-me]}`; sc.classList.add('hidden'); }
  else { $('stage-line').textContent = 'AI vs AI · DEMO'; sc.classList.add('hidden'); }
}

function addScore(n, x, z, label) {
  if (G.mode !== 'campaign') return;
  const v = Math.round(n * DIFFICULTY[G.diff].scoreMul);
  G.score += v;
  const sc = $('score');
  sc.textContent = G.score.toLocaleString();
  sc.classList.add('bump');
  setTimeout(() => sc.classList.remove('bump'), 120);
  if (label && x !== undefined) { const p = R.project(x, 1.2, z); U.pop(p.x, p.y + 26, `+${v}`, '#ffd23f', 'small'); }
}

// ------------------------------------------------------------------ KO + results
function onKO(e) {
  const W = G.W;
  // online play never pauses: a menu opened mid-round closes at the KO
  if (G.mode === 'online' && ['pause', 'options', 'howto'].includes(U.current)) U.hideScreens();
  G.state = 'ko';
  const winner = e.winner;
  // what the instant replay needs: the tick of the KO, the core that fell, the ball that did it
  const info = { n: W.n, side: e.side, ball: G.lastCore ? G.lastCore.id : -1, x: e.x, koT: W.t };
  D.slowMo(0.22, 2.3);
  D.forceShot = { kind: 'ko', side: e.side };
  D.addTrauma(1);
  A.play('ko', { gap: 0, noSlow: true });
  A.play('coreboom', { gap: 0, x: 0, noSlow: true });
  after(1.3, () => A.play('cheer', { gap: 0, noSlow: true }));
  if (G.mode === 'attract') { after(3.5, () => { if (G.mode === 'attract') { randomAIMatch(false); G.mode = 'attract'; applyVolumes(); } }); return; }
  ann('ko', 0, { priority: true });
  const comeback = G.minHP[winner] <= 1;
  if (G.mode === 'campaign') {
    const won = winner === 1;
    after(1.3, () => { if (won) { ann(comeback ? 'comeback' : W.cores[1].hp === W.cores[1].max ? 'perfect' : 'victory', 0, { queue: true }); } else ann('defeat', 0, { queue: true }); });
    after(2.6, () => pilotSay(-1, won ? 'lose' : 'win', 1, { queue: true }));
    after(2.0, () => A.sting(won ? 'victory' : 'defeat'));
    U.showBanner(won ? 'K.O.!' : 'CORE LOST', won ? `${G.sides[-1].name} IS DOWN` : `${G.sides[-1].name} WINS`, won ? '#2ff5ff' : '#ff3040', 3.6);
    after(3.4, () => withReplay(info, () => (won ? stageResults() : continueScreen())));
  } else if (G.mode === 'versus') {
    G.wins[winner]++;
    const match = G.wins[winner] >= 2;
    const cpu = G.vs && G.vs.cpu;
    after(1.3, () => ann(cpu ? (winner === 1 ? 'victory' : 'defeat') : winner === 1 ? 'p1wins' : 'p2wins', 0, { queue: true }));
    if (comeback) after(2.6, () => ann('comeback', 0, { queue: true }));
    if (cpu) after(2.6, () => pilotSay(-1, winner === 1 ? 'lose' : 'win', 1, { queue: true }));
    U.showBanner(`${vsName(winner)} WINS`, match ? 'THE MATCH' : `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`, hex(G.sides[winner].color), 3.6);
    if (match) { after(2, () => A.sting(cpu && winner === -1 ? 'defeat' : 'victory')); after(3.4, () => withReplay(info, () => versusResults(winner))); }
    else after(4.6, () => { G.round++; versusRound(); });
  } else if (G.mode === 'online') {
    G.wins[winner]++;
    const me = soloSide(), won = winner === me;
    const match = G.wins[winner] >= 2;
    after(1.3, () => ann(won ? 'victory' : 'defeat', 0, { queue: true }));
    if (comeback) after(2.6, () => ann('comeback', 0, { queue: true }));
    U.showBanner(won ? 'YOU WIN' : `${G.sides[winner].name} WINS`, match ? 'THE MATCH' : `ROUND ${G.round} · ${G.wins[me]} – ${G.wins[-me]}`, hex(G.sides[winner].color), 3.6);
    if (match) { after(2, () => A.sting(won ? 'victory' : 'defeat')); after(4.6, () => onlineResults(winner)); }
    else if (me === 1) after(4.6, () => { if (G.mode === 'online') { G.round++; onlineNextRound(); } });
  } else if (G.mode === 'demo') {
    after(1.2, () => pilotSay(winner, 'win', 1));
    if (comeback) after(1.3, () => ann('comeback', 0, { queue: true }));
    U.showBanner(`${G.sides[winner].name} WINS`, comeback ? 'WHAT A COMEBACK' : 'DEMO', hex(G.sides[winner].color), 4);
    after(3.6, () => withReplay(info, () => { if (G.mode === 'demo') startDemo(); }));
  }
}
const vsName = (s) => (s === 1 ? 'PLAYER 1' : G.vs && G.vs.cpu ? G.sides[-1].name : 'PLAYER 2');

function stageResults() {
  const W = G.W, st = W.stats[1];
  const coreLeft = W.cores[1].hp, perfect = coreLeft === W.cores[1].max;
  const timeBonus = Math.max(0, Math.round(180 - G.matchT)) * 10;
  const bonus = { stage: 1000 * (G.stage + 1), core: coreLeft * 300, perfect: perfect ? 3000 : 0, time: timeBonus };
  const mul = DIFFICULTY[G.diff].scoreMul;
  const add = Math.round((bonus.stage + bonus.core + bonus.perfect + bonus.time) * mul);
  const beaten = LADDER[G.stage];
  const fresh = unlock(beaten);
  G.score += add;
  const rows = [
    ['RETURNS', st.hits], ['SMASHES', st.smashes], ['CURVES', st.curves], ['STUNS', st.stuns], ['CELLS BROKEN', st.cells],
    ['CORE HITS', st.coreHits], ['POWER-UPS', st.pickups], ['LONGEST RALLY', W.maxRally], ['TIME', fmtT(G.matchT)],
    ['STAGE BONUS', '+' + bonus.stage], ['CORE INTACT', '+' + bonus.core], ['PERFECT', perfect ? '+3000' : '—'], ['TIME BONUS', '+' + bonus.time],
  ];
  $('res-title').textContent = G.stage === 4 ? 'THE MONOLITH FALLS' : `STAGE ${G.stage + 1} CLEAR`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('') + (mul !== 1 ? `<span>DIFFICULTY</span><span>×${mul}</span>` : '')
    + (fresh ? `<span class="unl">🔓 NEW PILOT</span><span class="unl">${PILOTS[beaten].name} · ${PERKS[beaten].name}</span>` : '');
  if (fresh) after(0.9, () => ann('unlocked', 0, { priority: true }));
  $('res-total').textContent = G.score.toLocaleString();
  $('res-next').textContent = G.stage === 4 ? 'CHAMPION →' : 'NEXT STAGE →';
  G.state = 'results';
  G.resultsNext = () => {
    if (G.stage === 4) champion();
    else { G.stage++; stageIntro(); }
  };
  U.show('results');
  menuSel(0);
}

function champion() {
  clearTimers();
  G.state = 'champion';
  U.hideScreens();
  U.showBanner('CHAMPION', `FINAL SCORE ${G.score.toLocaleString()}`, '#ffd23f', 5);
  ann('champion', 0, { priority: true });
  A.sting('victory');
  after(5, () => endRun());
}

function versusResults(winner) {
  const W = G.W;
  const rows = [];
  for (const s of [1, -1]) {
    const st = W.stats[s];
    const n = s === 1 ? 'P1' : G.vs && G.vs.cpu ? G.sides[-1].name : 'P2';
    rows.push([`${n} RETURNS / SMASHES`, `${st.hits} / ${st.smashes}`], [`${n} STUNS / CELLS`, `${st.stuns} / ${st.cells}`]);
  }
  $('res-title').textContent = `${vsName(winner)} WINS`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('');
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
  ann('continue', 0, { priority: true });
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
  ann('gameover', 0, { priority: true });
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
  // where did that land?
  const g = HS.global || [];
  const gi = g.findIndex((r) => r.initials === e.initials && Math.floor(r.score) === e.score);
  const li = HS.local().findIndex((r) => r.initials === e.initials && r.score === e.score && r.ts === e.ts);
  const rank = $('hs-rank');
  rank.textContent = gi >= 0 ? `🌐 GLOBAL RANK #${gi + 1}` : HS.global === null ? 'SAVED · GLOBAL BOARD OFFLINE' : li >= 0 ? `🏠 #${li + 1} ON THIS DEVICE` : 'SAVED';
  rank.classList.remove('hidden');
  if (gi === 0) ann('champion', 0, { priority: true });
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
    ? [['DRAG', 'move your paddle (push up to lunge / smash)'], ['TAP', 'fire a plasma bolt'], ['FIRE / OVERDRIVE', 'on-screen buttons'], ['VERSUS', 'each player drags on their own half']]
    : [['MOUSE', 'move (push forward to lunge / smash)'], ['W A S D / ARROWS', 'move (screen directions)'], ['CLICK · SPACE · F', 'fire a plasma bolt / release a caught ball'], ['RIGHT-CLICK · E · Q', 'overdrive'], ['P / ESC', 'pause'], ['GAMEPAD', 'stick moves · A fire · B overdrive'], ['VERSUS P2', 'arrows · Enter fire · . overdrive · pad 2'], ['DEMO', 'T toggles the AI overlay']];
  $('keys').innerHTML = keys.map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join('');
  $('pilotlist').innerHTML = ROSTER.map((k) => {
    const name = k === 'p1' ? 'CHALLENGER' : PILOTS[k].name, c = k === 'p1' ? HUMAN.color : PILOTS[k].color;
    return `<div class="pu" style="--fc:${hex(c)}"><i>${isOpen(k) ? '◆' : '🔒'}</i><div><b>${name} · ${PERKS[k].name}</b><span>${isOpen(k) ? PERKS[k].desc : lockHint(k).toLowerCase().replace(/^./, (m) => m.toUpperCase())}</span></div></div>`;
  }).join('');
  $('pugrid').innerHTML = Object.values(POWERUPS).map((p) => `<div class="pu" style="--fc:${hex(p.color)}"><i>${p.glyph}</i><div><b>${p.name}</b><span>${p.desc}</span></div></div>`).join('');
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
      if (k === 'camera' && G.mode !== 'demo') D.setMode(camMode());
      if (k === 'flash') applyCalm();
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
    case 'howto': case 'options': case 'scores': openSub(act); break;
    case 'back': back(); break;
    case 'resume': resume(); break;
    case 'quit': G.paused = false; A.muffle(false); goTitle(); break;
    case 'skip': stopReplay(); break;
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

$('t-fire').addEventListener('pointerdown', (e) => { e.preventDefault(); fire(1); });
$('t-od').addEventListener('pointerdown', (e) => { e.preventDefault(); overdrive(1); });
$('t-pause').addEventListener('pointerdown', (e) => { e.preventDefault(); pause(); });

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

function fire(who) {
  if (G.state !== 'play' || G.paused) return;
  if (solo()) who = soloSide();
  if (G.mode === 'online' && NET.side === -1) NET.fireN++;
  for (const h of G.humans) if (h.p.side === who) h.p.input.fire = true;
}
function overdrive(who) {
  if (G.state !== 'play' || G.paused) return;
  if (solo()) who = soloSide();
  if (G.mode === 'online' && NET.side === -1) NET.odN++;
  for (const h of G.humans) if (h.p.side === who) h.p.input.od = true;
}

I.on('fire', (who, src) => { if (G.mode === 'campaign' || G.mode === 'versus' || G.mode === 'online') { if (src === 'mouse' && G.mode === 'versus') who = 1; fire(who); } });
I.on('od', (who) => overdrive(who));
I.on('pause', () => {
  if (G.state === 'pause') return resume();
  if (['howto', 'options', 'scores', 'difficulty', 'scores-end', 'pilot', 'vsetup', 'online', 'online-wait', 'online-join'].includes(G.state)) return back();
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
  // typing a room code
  if (e && e.target && e.target.tagName === 'INPUT') { if (k === 'Enter' || k === 'NumpadEnter') joinFromInput(); return; }
  if (k === 'KeyT' && G.mode === 'demo') { settings.tactical = settings.tactical === 'never' ? 'demo' : 'never'; saveSettings(); }
  if (k === 'KeyC' && (G.state === 'play') && G.mode !== 'demo') {
    const order = ['arena', 'side', 'top'];
    settings.camera = order[(order.indexOf(camMode()) + 1) % 3];
    saveSettings();
    D.setMode(camMode());
    U.showBanner('', `CAMERA · ${settings.camera.toUpperCase()}`, '#ffffff', 0.8);
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
  // menu navigation
  if (!MENU_STATES.includes(G.state)) return;
  const btns = visibleButtons();
  if (!btns.length) return;
  if (k === 'ArrowDown' || k === 'KeyS' || k === 'ArrowRight') { menuSel((G.menuI + 1) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'ArrowUp' || k === 'KeyW' || k === 'ArrowLeft') { menuSel((G.menuI - 1 + btns.length) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'Enter' || k === 'Space' || k === 'NumpadEnter') { const b = btns[G.menuI]; if (b) b.click(); }
});
// gamepad A acts as Enter in menus
I.on('fire', (who, src) => {
  if (src !== 'pad') return;
  if (MENU_STATES.includes(G.state)) { const b = visibleButtons()[G.menuI]; if (b) b.click(); }
  if (G.state === 'initials') saveIni();
});
const MENU_STATES = ['title', 'difficulty', 'pause', 'results', 'cont', 'howto', 'options', 'scores', 'scores-end', 'pilot', 'vsetup', 'online', 'online-wait', 'online-join'];
I.assign = (t) => {
  if (G.mode === 'online') return soloSide();
  if (G.mode !== 'versus' || !G.W || solo()) return 1;
  // the finger belongs to whichever paddle is nearer on screen
  let best = 1, bd = 1e9;
  for (const h of G.humans) {
    const p = R.project(h.p.x, 0.3, h.p.z);
    const d = Math.hypot(p.x - t.sx, p.y - t.sy);
    if (d < bd) { bd = d; best = h.p.side; }
  }
  return best;
};

// ------------------------------------------------------------------ human control
const camR = new THREE.Vector3(), camF = new THREE.Vector3();
function humanControl(h) {
  const p = h.p, inp = p.input;
  const [ax, ay] = I.axes(h.who);
  if (ax || ay) {
    camR.set(1, 0, 0).applyQuaternion(R.camera.quaternion); camR.y = 0; camR.normalize();
    camF.set(0, 0, -1).applyQuaternion(R.camera.quaternion); camF.y = 0; camF.normalize();
    inp.mode = 'vel';
    inp.vx = camR.x * ax + camF.x * ay;
    inp.vz = camR.z * ax + camF.z * ay;
    p.maxSpeed = 15; p.accel = 170;
    h.kbT = now();
    return;
  }
  for (const t of I.touches.values()) {
    if (t.player !== p.side) continue;
    if (!t.start) { t.start = I.worldAt(t.sx, t.sy); t.base = { x: p.x, z: p.z }; }
    const w = I.worldAt(t.x, t.y);
    if (!w || !t.start) continue;
    inp.mode = 'target';
    inp.tx = t.base.x + (w.x - t.start.x) * 1.3;
    inp.tz = t.base.z + (w.z - t.start.z) * 1.1;
    p.maxSpeed = 34; p.accel = 520; p.gain = 30;
    return;
  }
  const mouseOk = h.who !== 'p2' && I.mouse.active && I.mouse.t / 1000 > h.kbT;
  if (mouseOk) {
    const w = I.worldAt(I.mouse.x, I.mouse.y);
    if (w) {
      inp.mode = 'target'; inp.tx = w.x; inp.tz = w.z;
      p.maxSpeed = 34; p.accel = 520; p.gain = 30;
      return;
    }
  }
  inp.mode = 'vel'; inp.vx = 0; inp.vz = 0;
}

function controls(W, dt) {
  // a paddle without a pilot (the Monolith's second half) inherits its side's persona
  for (const p of W.paddles) {
    if (G.humans.some((h) => h.p === p) || G.aiList.some((a) => a.p === p)) continue;
    const owner = G.aiList.find((a) => a.side === p.side);
    if (owner) { const ai = new AIPilot(W, p, PILOTS.monolith, G.cfg.diffAI || DIFFICULTY.normal.ai); G.aiList.push(ai); }
  }
  for (const h of G.humans) {
    if (G.autopilot) { if (!h.bot || h.bot.p !== h.p) h.bot = new AIPilot(W, h.p, PILOTS.seraph, DIFFICULTY.normal.ai); h.bot.update(W, dt); }
    else humanControl(h);
  }
  for (const ai of G.aiList) ai.update(W, dt);
}

// ------------------------------------------------------------------ events: sound, voice, score, camera
function handleEvents(list) {
  const W = G.W;
  const attract = G.mode === 'attract';
  for (const e of list) {
    R.event(e, W);
    switch (e.k) {
      case 'hit': {
        A.play(['hit1', 'hit2', 'hit3'][(Math.random() * 3) | 0], { x: e.x, z: e.z, vol: 0.75 + Math.min(0.35, e.speed / 70) });
        if (e.smash > 0) {
          A.play('smash', { x: e.x, vol: 0.5 + Math.min(0.5, e.smash / 13) });
          D.addTrauma(0.22 + e.smash * 0.015);
          G.hitstop = Math.max(G.hitstop, 0.05);
          if (!attract) {
            const p = R.project(e.x, 1.2, e.z);
            U.pop(p.x, p.y, e.smash >= 9 ? 'SUPER SMASH!' : 'SMASH!', '#ffd23f', e.smash >= 9 ? 'big' : '');
            if (e.smash >= 9) ann('supersmash', 7);
            else if (Math.random() < 0.3) ann('smash', 9);
          }
          if (G.humans.some((h) => h.p.side === e.side)) addScore(25);
        }
        if (Math.abs(e.spin) > 4 && !attract) { const p = R.project(e.x, 0.9, e.z); U.pop(p.x, p.y + 30, 'CURVE', '#9affff', 'small'); }
        if (e.doused && !attract) { const p = R.project(e.x, 1, e.z); U.pop(p.x, p.y, 'DOUSED', '#ff8a1a', 'small'); }
        if (G.humans.some((h) => h.p.side === e.side)) addScore(10 + (Math.abs(e.spin) > 4 ? 15 : 0));
        if (W.rally >= 16 && !G.rallyCalled) { G.rallyCalled = true; ann('rally', 20); }
        break;
      }
      case 'wall': A.play(Math.random() < 0.5 ? 'wall1' : 'wall2', { x: e.x, z: e.z, vol: 0.4 }); break;
      case 'slider': A.play('wall2', { x: e.x, vol: 0.45 }); break;
      case 'graze': A.play('wall1', { x: e.x, vol: 0.35 }); break;
      case 'cell': {
        if (e.hp <= 0) {
          A.play('shatter', { x: e.x, z: e.z });
          D.addTrauma(0.3);
          if (!attract) {
            const p = R.project(e.x, 1.4, e.z);
            U.pop(p.x, p.y, e.pierce ? 'NOVA PIERCE' : 'SHIELD DOWN', hex(G.sides[e.side].color));
            ann('shielddown', 14);
          }
          if (e.side === -1) addScore(100, e.x, e.z, true);
        } else { A.play('crack', { x: e.x, z: e.z, vol: 0.8 }); if (e.side === -1) addScore(30); }
        G.rallyCalled = false;
        break;
      }
      case 'core': {
        G.lastCore = e;
        A.play('corehit', { x: e.x, gap: 0 });
        D.addTrauma(0.65);
        G.hitstop = Math.max(G.hitstop, 0.09);
        G.minHP[e.side] = Math.min(G.minHP[e.side], e.hp);
        G.rallyCalled = false;
        if (e.hp > 0) {
          D.slowMo(0.35, 0.55);
          A.play(Math.random() < 0.6 ? 'cheer' : 'ooh', { vol: 0.5, gap: 1 });
          if (!attract) {
            const p = R.project(e.x, 1.6, e.z);
            U.pop(p.x, p.y, e.dmg > 1 ? 'DOUBLE BREACH!' : 'CORE BREACH!', '#ff4060', 'big');
            if (e.hp === 1) ann('matchpoint', 0, { priority: true });
            else if (e.hp <= 2) ann('critical', 0, { priority: true });
            else ann('breach', 0, { priority: true });
            // the pilots react
            if (G.sides[e.side].persona) pilotSay(e.side, 'hurt', 0.55);
            else if (G.sides[-e.side] && G.sides[-e.side].persona) pilotSay(-e.side, 'score', 0.6);
          }
          if (G.humans.some((h) => h.p.side === e.side && G.mode === 'campaign')) U.hurt();
        }
        if (e.side === -1) addScore(500 + (e.dmg > 1 ? 250 : 0), e.x, e.z, true);
        break;
      }
      case 'ko': onKO(e); break;
      case 'bolt': A.play(e.from === 'paddle' ? (Math.random() < 0.5 ? 'fire1' : 'fire2') : 'fire2', { x: e.x, z: e.z, vol: e.from === 'paddle' ? 0.55 : 0.32, gap: 0.02 }); break;
      case 'stun': {
        A.play('stun', { x: e.x, z: e.z });
        if (!attract) {
          const p = R.project(e.x, 1.2, e.z);
          U.pop(p.x, p.y, 'STUNNED', '#9ad8ff');
          if (G.humans.some((h) => h.p.side === e.side)) { ann('stunned', 12); pilotSay(-e.side, 'taunt', 0.35); }
        }
        if (e.by === 1) addScore(40);
        break;
      }
      case 'deflect': A.play('barrier', { x: e.x, vol: 0.35 }); break;
      case 'boltball': A.play('arc', { x: e.x, vol: 0.45 }); break;
      case 'boltcell': A.play('boltcell', { x: e.x, vol: 0.45 }); if (e.side === -1) addScore(10); break;
      case 'boltbolt': A.play('arc', { x: e.x, vol: 0.5 }); break;
      case 'orb': A.play('puspawn', { x: e.x, vol: 0.5 }); break;
      case 'pu': {
        const def = POWERUPS[e.kind];
        A.play('pucollect', { x: e.x, gap: 0 });
        A.play(def.sfx, { x: e.x, vol: 0.8, gap: 0, delay: 0.08 });
        if (!attract) { U.toast(e.side, e.kind); ann(def.voice, 0, { priority: true }); }
        if (e.side === 1) addScore(50);
        break;
      }
      case 'serve': A.play('serve', { vol: 0.6 }); break;
      case 'od': A.play('overdrive', { gap: 0 }); D.addTrauma(0.3); if (!attract) ann('overdrive', 0, { priority: true }); break;
      case 'bump': A.play('bumper', { x: e.x, vol: 0.7 }); break;
      case 'portal': A.play('portal', { x: e.x, vol: 0.7 }); break;
      case 'barrier': A.play('barrier', { x: e.x, vol: e.bolt ? 0.3 : 0.6 }); if (!e.bolt && !attract) ann('denied', 15); break;
      case 'lightning': A.play('storm', { x: e.x, delay: e.delay || 0, gap: 0, vol: 0.8 }); D.addTrauma(0.15); break;
      case 'catch': A.play('magnet', { x: e.x }); break;
      case 'release': A.play('smash', { x: e.x, vol: 0.8 }); break;
      case 'dronekill': A.play('shatter', { x: e.x, vol: 0.5 }); break;
      case 'lasercharge': A.play('bosslaser', { x: e.x, vol: 0.9, gap: 0 }); break;
      case 'laser': A.play('arc', { x: e.x, vol: 0.8 }); D.addTrauma(0.35); if (e.hit === 'paddle' && !attract) { const p = R.project(e.x, 1.2, e.z); U.pop(p.x, p.y, 'STUNNED', '#ff6050'); } break;
      case 'phase2': {
        A.play('alarm', { gap: 0 });
        D.addTrauma(0.6);
        if (!attract) { U.showBanner('PHASE 2', 'THE MONOLITH SPLITS', '#ff2a3a', 2); pilotSay(-1, 'phase2', 1, { priority: true }); }
        break;
      }
    }
  }
}


// ------------------------------------------------------------------ pilot select
let pickCb = null, pickOpts = {};
// skip the picker while only the Challenger is open
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
    const name = k === 'p1' ? 'CHALLENGER' : PILOTS[k].name;
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

// ------------------------------------------------------------------ versus setup
function openVersus() {
  G.state = 'vsetup';
  renderVsetup();
  U.show('vsetup');
  menuSel(visibleButtons().length - 1);
}
function renderVsetup() {
  const tw = settings.twists || {}, cpu = settings.vsOpp === 'cpu';
  $('vs-opp').innerHTML = `<button class="mbtn tog ${cpu ? '' : 'on'}" data-opp="human">PLAYER 2<small>SAME SCREEN</small></button>`
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
const RSND = { wall: 'wall1', bolt: 'fire1', stun: 'stun', pu: 'pucollect', bump: 'bumper', portal: 'portal', barrier: 'barrier', serve: 'serve', boltball: 'arc', boltcell: 'boltcell', od: 'overdrive', laser: 'arc', lasercharge: 'bosslaser', lightning: 'storm', release: 'smash', catch: 'magnet', phase2: 'alarm', slider: 'wall2' };
function withReplay(info, then) {
  if (settings.replay === 'off' || !startReplay(info, then)) then();
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
  D.slow = 1; D.slowT = 0; D.trauma = 0; D.rp = false;
  A.play('rewind', { gap: 0, noSlow: true, vol: 0.8 });
  ann('replay', 0, { priority: true });
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
// one frame of the replay; false once it has finished (the game carries on this frame)
function replayFrame(dt) {
  const r = G.replay, rp = r.rp;
  const toKO = rp.toKO;
  // half speed into the last moments, a crawl through the hit itself, then the blast
  const speed = toKO > 0.7 ? 0.55 : toKO > -0.3 ? 0.2 : 0.5;
  A.setRate(1 - (1 - speed) * 0.55);
  replayEvents(rp.advance(dt * speed), rp.W);
  if (rp.done) { stopReplay(); return false; }
  D.update(dt, { W: rp.W, replay: r.info, shake: +settings.shake });
  R.sync(rp.W, dt * speed, { tactical: false, ai: {}, scope: {}, beat: 0 });
  look.desat = 0.16; look.chroma = 0;
  R.render(dt, look);
  perf(dt);
  return true;
}
function replayEvents(list, W) {
  for (const e of list) {
    R.event(e, W);
    if (e.k === 'hit') {
      A.play(['hit1', 'hit2', 'hit3'][(Math.random() * 3) | 0], { x: e.x, vol: 0.75 });
      if (e.smash > 0) { A.play('smash', { x: e.x, vol: 0.7 }); D.addTrauma(0.2); }
    } else if (e.k === 'cell') { A.play(e.hp <= 0 ? 'shatter' : 'crack', { x: e.x }); D.addTrauma(e.hp <= 0 ? 0.3 : 0.1); }
    else if (e.k === 'core') { A.play('corehit', { x: e.x, gap: 0 }); D.addTrauma(0.65); }
    else if (e.k === 'ko') { A.play('ko', { gap: 0, noSlow: true }); A.play('coreboom', { gap: 0, noSlow: true }); D.addTrauma(1); }
    else if (RSND[e.k]) A.play(RSND[e.k], { x: e.x, vol: 0.5 });
  }
}

// ------------------------------------------------------------------ online
// saved initials (from a high score) name you online; none saved = P1 / P2
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
  st.textContent = msg || 'Battle a rival anywhere in the world. Best of three.';
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
    if (navigator.share && I.isTouch) await navigator.share({ title: 'Plasma Pong: Battle Edition', text: `Battle me online! Room ${G.onCode}`, url });
    else { await navigator.clipboard.writeText(url); btn.textContent = 'COPIED!'; setTimeout(() => (btn.textContent = 'COPY INVITE LINK'), 1600); }
  } catch { btn.textContent = url; }
}
// hooks from the connection
function onStatus(text, kind) {
  if (!['online', 'online-wait', 'online-join'].includes(G.state)) return;
  if (kind === 'error') return showOnline(text);
  if (text !== 'waiting') $('on-wait').textContent = text;
}
function onJoined(peer) {
  if (G.state !== 'online-wait') return;
  A.play('uiok', { gap: 0 });
  ann('found', 0, { priority: true });
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
  ann(reason === 'left' ? 'victory' : 'lost', 0, { priority: true });
  after(3.2, () => goTitle());
}
function onChat(msg) {
  if (msg.k === 'again') { G.peerAgain = true; maybeRematch(); }
}
// host: a fresh best of three
function onlineMatch() {
  G.wins = { 1: 0, '-1': 0 };
  G.round = 1;
  G.vsArenas = shuffle([0, 1, 2, 3]);
  onlineNextRound();
}
function onlineNextRound() {
  if (!NET.peer) return;
  const cfg = { r: G.round, ar: G.vsArenas[(G.round - 1) % 4], sd: (Math.random() * 1e9) | 0, dir: Math.random() < 0.5 ? 1 : -1,
    w: [G.wins[1], G.wins[-1]], p1: G.onPilot || 'p1', p2: NET.peer.pilot, n1: myIni(), n2: NET.peer.ini };
  NET.raw({ type: 'start', ...cfg });
  onlineRound(cfg);
}
// both ends: set up a round from the host's start message
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
  startMatch({ arena, seed: cfg.sd | 0, serveDir: cfg.dir === -1 ? -1 : 1, sides });
  NET.bind(G.W);
  D.flip = me === -1;
  setFlip(me === -1);
  $('res-quit').classList.add('hidden');
  A.playMusic(ARENAS[arena].music);
  if (G.round === 1) {
    G.state = 'vs';
    fillVs(G.sides[me], G.sides[-me], `ONLINE · BEST OF THREE · <b>${ARENAS[arena].name}</b>`, sides[me].human.blurb, sides[-me].human.blurb);
    U.show('vs');
    U.setHud(false);
    G.simOn = false;
    ann('online', 0, { priority: true });
    after(3.4, () => countdown());
  } else countdown();
}
function onlineResults(winner) {
  const W = G.W, me = soloSide();
  const rows = [];
  for (const s of [me, -me]) {
    const st = W.stats[s], n = G.sides[s].name;
    rows.push([`${n} RETURNS / SMASHES`, `${st.hits} / ${st.smashes}`], [`${n} STUNS / CELLS`, `${st.stuns} / ${st.cells}`]);
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
  if (NET.side === 1) onlineMatch(); // the guest waits for the host's start
}
// the guest hears nothing from the host for a while
function waitingForHost() {
  const stale = NET.stale && G.state === 'play';
  if (stale && !G.staleShown) { G.staleShown = true; U.showBanner('WAITING FOR YOUR RIVAL', 'THE HOST HAS PAUSED OR LOST CONNECTION', '#ffd23f', 0); }
  else if (!stale && G.staleShown) { G.staleShown = false; U.hideBanner(); }
}
// the online guest flies the far paddle: their own panel goes on the left
function setFlip(on) {
  $('hud').classList.toggle('flip', on);
  $('toasts').classList.toggle('flip', on);
  $('hud-1').classList.toggle('left', !on); $('hud-1').classList.toggle('right', on);
  $('hud--1').classList.toggle('right', !on); $('hud--1').classList.toggle('left', on);
}

// ------------------------------------------------------------------ boot
function bootProgress() {
  const total = 48 + 56 + 31;
  const n = A.buf.size;
  $('loadfill').style.width = Math.min(100, (n / total) * 100) + '%';
  return n / total;
}
function enterTitle() {
  if (G.state !== 'boot') return;
  A.unlock();
  A.ctx && A.ctx.resume && A.ctx.resume();
  G.state = 'title';
  say('ann_title', 0, { priority: true });
  setTimeout(() => say('ann_battle', 0, { queue: true }), 900);
  goTitle();
  // an invite link (?room=CODE) goes straight to that room
  const code = cleanCode(params.get('room'));
  if (code.length === 4) {
    history.replaceState(null, '', location.pathname);
    G.onPilot = isOpen(settings.pilot) ? settings.pilot : 'p1';
    onlineJoin(code);
  }
}

// ------------------------------------------------------------------ frame loop
let last = performance.now();
const look = { bloom: 1.5, exposure: 1, desat: 0, fade: 0, chroma: 0, tint: new THREE.Vector3(1, 1, 1) };
function tick(dt) {
  I.pollPads(G.mode === 'versus' && !solo());
  for (const t of G.timers.slice()) {
    if (G.paused) break;
    t.t -= dt;
    if (t.t <= 0) { G.timers.splice(G.timers.indexOf(t), 1); t.fn(); }
  }
  if (G.replay && replayFrame(dt)) return;
  const W = G.W;
  let scale = G.simOn && !G.paused ? D.slow : 0;
  if (G.hitstop > 0) { G.hitstop -= dt; scale *= 0.1; }
  if (G.simOn && !G.paused) A.setRate(1 - (1 - Math.min(1, D.slow)) * 0.55);
  const sdt = dt * scale;
  if (W) {
    const online = G.mode === 'online' && NET.W === W;
    const host = online && NET.side === 1, guest = online && NET.side === -1;
    const rec = settings.replay !== 'off' && (G.mode === 'campaign' || G.mode === 'versus' || G.mode === 'demo');
    // the guest first takes in the host's newest snapshot
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
      if (guest) handleEvents(NET.guestLocal(W, ev));
      else { if (host) NET.hostEvents(ev); handleEvents(ev); }
      G.acc -= STEP;
      n++;
    }
    if (n >= 16) G.acc = 0;
    if (G.state === 'play') G.matchT += sdt;
    if (host) NET.hostFrame(W, dt);
    if (guest) { NET.guestFrame(W, dt); waitingForHost(); }
  }
  // the scope power-up: show the human every incoming path
  G.scopeT -= dt;
  if (W && G.scopeT <= 0) {
    G.scopeT = 0.08;
    for (const h of G.humans) {
      const s = h.p.side;
      G.scope[s] = null;
      if (W.fx[s].scope <= 0 && !W.perk[s].sight) continue;
      const b = W.balls.find((q) => !q.caught && q.vz * s > 0);
      if (b) { const pr = predictToPlane(W, b, s * (F.cellZ - 0.6), 3, true); if (pr) G.scope[s] = pr.path; }
    }
  }
  const demoCam = G.mode === 'demo' || G.state === 'ko';
  if (D.forceShot && G.state === 'ko') { D.shot = { ...D.forceShot, dur: 99, fresh: !D.shot || D.shot.kind !== 'ko' }; D.shotT = 0; D.breach = { until: Infinity }; }
  D.update(dt, { W, demo: demoCam && !G.menuCam && W, menu: G.menuCam, shake: +settings.shake });
  if (W) {
    const tactical = settings.tactical === 'always' ? !!Object.keys(G.ai).length && G.mode !== 'attract' : settings.tactical === 'demo' ? G.mode === 'demo' : false;
    R.sync(W, sdt || (G.paused ? 0 : dt * 0.2), { tactical, ai: G.ai, scope: G.scope, beat: 0 });
  }
  look.desat = G.paused ? 0.65 : (1 - D.slow) * 0.35;
  look.chroma = (1 - D.slow) * 0.004;
  R.render(dt, look);
  if (W && !U.hud.classList.contains('hidden')) U.updateHud(W);
  updateCaptions(dt);
  if (G.state === 'boot') {
    const p = bootProgress();
    if (p > 0.35 && !G.bootReady) { G.bootReady = true; $('press').textContent = I.isTouch ? 'TAP TO START' : 'CLICK OR PRESS ANY KEY'; }
  }
  if (G.state === 'title') {
    G.idleT += dt;
    if (G.idleT > 28) startDemo();
  }
  // touch overdrive button state
  if (solo() && W) { const m = W.meter[soloSide()]; $('t-od').classList.toggle('ready', m.od >= 100 && m.odTime <= 0); }
  // dynamic resolution
  perf(dt);
}

function updateCaptions(dt) {
  if (G.mode !== 'demo' || !G.W) return;
  const W = G.W;
  for (const [s, id] of [[1, 'cap-l'], [-1, 'cap-r']]) {
    const ai = G.ai[s];
    const el = $(id);
    if (!ai) { el.classList.add('hidden'); continue; }
    const fresh = W.t - ai.captionT < 2.6 && ai.caption;
    el.style.opacity = fresh ? 1 : 0.25;
    const txt = `${ai.name} ▸ <b>${ai.caption || 'READING THE PLAY'}</b>`;
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

addEventListener('resize', () => {
  R.resize();
  D.fitCache = {};
  if (G.mode !== 'demo' && G.mode !== 'attract' && settings.camera === 'auto' && D.mode !== camMode()) D.setMode(camMode());
});
document.querySelectorAll('.vtxt').forEach((e) => (e.textContent = `PLASMA PONG · BATTLE EDITION ${VERSION}`));
$('ver').textContent = VERSION;

// iOS only lets audio start from certain gestures; nudge the context on every kind
for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) {
  addEventListener(ev, () => { if (A.ctx && A.ctx.state !== 'running') A.ctx.resume(); }, { passive: true });
}

// boot: the arena plays itself behind the logo while sounds load
A.unlock();
randomAIMatch(false);
G.mode = 'attract';
G.simOn = true;
G.state = 'boot';
U.show('boot');
// ?demo opens straight into the demo; the first tap only switches the sound on
if (params.has('demo')) { G.demoBoot = true; startDemo(); }
requestAnimationFrame(frame);
// test hooks
window.__ppb.tick = (dt, n = 1) => { for (let i = 0; i < n; i++) tick(dt); };
window.__ppb.startDemo = startDemo;
window.__ppb.startCampaign = startCampaign;
window.__ppb.startVersus = startVersus;
window.__ppb.goTitle = goTitle;
window.__ppb.enterTitle = enterTitle;
window.__ppb.endRun = endRun;
window.__ppb.unlock = unlock;
window.__ppb.startReplay = startReplay;
window.__ppb.choosePilot = choosePilot;
window.__ppb.openVersus = openVersus;
window.__ppb.online = { openOnline, showOnline, onlineQuick, onlineHost, onlineJoin, setPilot: (k) => { G.onPilot = k; } };
window.__ppb.shot = async (name, q = 0.85) => {
  tick(1 / 60);
  const url = $('gl').toDataURL('image/jpeg', q);
  await fetch('/shot?name=' + name, { method: 'POST', body: url });
  return url.length;
};
