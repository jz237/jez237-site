// Plasma Pong: Battle Edition — game flow, controls, scoring, commentary and the frame loop.
import * as THREE from '../vendor/three.module.min.js';
import { F, VERSION, PILOTS, HUMAN, HUMAN2, ARENAS, LADDER, DIFFICULTY, POWERUPS } from './config.js?v=1';
import { makeWorld, step, drainEvents, STEP, paddlesOf } from './sim.js?v=1';
import { AIPilot } from './ai.js?v=1';
import { predictToPlane } from './predict.js?v=1';
import { Renderer, pickQuality } from './render.js?v=1';
import { Director } from './director.js?v=1';
import { Audio } from './audio.js?v=1';
import { Input } from './input.js?v=1';
import { UI, $, hex } from './ui.js?v=1';
import { Scores } from './scores.js?v=1';

// ------------------------------------------------------------------ settings
const SKEY = 'ppb.settings.v1';
const settings = { music: 55, sfx: 90, voice: 100, quality: 'auto', camera: 'auto', shake: '1', tactical: 'demo' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* ignore */ } };
const params = new URLSearchParams(location.search);

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const D = new Director(R.camera);
const A = new Audio('./');
const I = new Input(R.camera);
const U = new UI();
const HS = new Scores('plasma-pong-battle');
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
window.__ppb = { G, R, D, A, I, settings };

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
  if (c.kind === 'human') return { name: c.human.name, title: c.human.title, color: c.human.color, human: true };
  return { name: c.persona.name, title: c.persona.title, color: c.persona.color, persona: c.persona };
}
const fmtT = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function camMode() {
  if (settings.camera !== 'auto') return settings.camera;
  if (G.mode === 'versus') return innerWidth > innerHeight ? 'side' : 'top';
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
  const W = makeWorld({ arena: cfg.arena, seed: (Math.random() * 1e9) | 0, boss, coreHP, serveDir: cfg.serveDir || (Math.random() < 0.5 ? 1 : -1) });
  G.W = W; G.ai = {}; G.aiList = []; G.humans = []; G.cfg = cfg;
  for (const s of [1, -1]) {
    const c = cfg.sides[s];
    const p = paddlesOf(W, s)[0];
    if (c.kind === 'human') G.humans.push({ p, who: c.who, kbT: -9 });
    else { const ai = new AIPilot(W, p, c.persona, cfg.diffAI || DIFFICULTY.normal.ai); G.ai[s] = ai; G.aiList.push(ai); }
  }
  G.sides = { 1: sideInfo(cfg.sides[1]), '-1': sideInfo(cfg.sides[-1]) };
  R.setWorld(W, G.sides);
  U.buildHud(G.sides, W);
  G.matchT = 0; G.acc = 0; G.hitstop = 0; G.rallyCalled = false; G.minHP = { 1: 99, '-1': 99 };
  G.scope = { 1: null, '-1': null };
  D.slow = 1; D.slowT = 0; D.forceShot = null; D.breach = null;
  A.setRate(1);
  applyVolumes();
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
  if (!G.W || G.W.over || G.cfg.sides[1].kind === 'human' || G.cfg.sides[-1].kind === 'human') randomAIMatch(false);
  G.mode = 'attract';
  G.simOn = true;
  G.paused = false;
  U.setHud(false);
  setDemoUI(false);
  applyVolumes();
}

// ------------------------------------------------------------------ screens / flow
function goTitle() {
  clearTimers();
  G.state = 'title';
  G.idleT = 0;
  startAttract();
  U.hideBanner();
  U.show('title');
  $('touch').classList.add('hidden');
  A.muffle(false);
  A.playMusic('title');
  menuSel(0);
}

function startCampaign(diff) {
  G.mode = 'campaign';
  G.diff = diff;
  G.stage = params.has('stage') ? Math.max(0, Math.min(4, +params.get('stage') - 1)) : 0;
  G.score = 0;
  G.continues = 3;
  stageIntro();
}

function stageIntro() {
  clearTimers();
  const pilot = PILOTS[LADDER[G.stage]];
  G.mode = 'campaign';
  G.menuCam = false;
  startMatch({ arena: G.stage, diffAI: DIFFICULTY[G.diff].ai, sides: { 1: { kind: 'human', human: HUMAN, who: 'solo' }, '-1': { kind: 'ai', persona: pilot } } });
  D.setMode(camMode());
  G.simOn = false;
  G.state = 'vs';
  fillVs(G.sides[1], G.sides[-1], `STAGE ${G.stage + 1} / 5 · <b>${ARENAS[G.stage].name}</b>`, HUMAN.blurb || 'You. A paddle. A plasma cannon. A very bad idea.', pilot.blurb);
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
    G.state = 'play';
    G.simOn = true;
  });
}

function startVersus() {
  G.mode = 'versus';
  G.wins = { 1: 0, '-1': 0 };
  G.round = 1;
  G.vsArenas = shuffle([0, 1, 2, 3]);
  versusRound();
}

function versusRound() {
  clearTimers();
  G.mode = 'versus';
  G.menuCam = false;
  const arena = G.vsArenas[(G.round - 1) % 4];
  startMatch({ arena, sides: { 1: { kind: 'human', human: HUMAN, who: 'p1' }, '-1': { kind: 'human', human: HUMAN2, who: 'p2' } } });
  A.playMusic(ARENAS[arena].music);
  if (G.round === 1) {
    G.state = 'vs';
    fillVs(G.sides[1], G.sides[-1], `BEST OF THREE · <b>${ARENAS[arena].name}</b>`, 'Mouse · WASD · F fire · E overdrive · pad 1 · lower touch', 'Arrows · Enter fire · . overdrive · pad 2 · upper touch');
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
  $('cap-l').classList.toggle('hidden', !on);
  $('cap-r').classList.toggle('hidden', !on);
  if (!on) $('tip').classList.add('hidden');
}

function showTouch() {
  const t = I.isTouch && (G.mode === 'campaign' || G.mode === 'versus');
  $('touch').classList.toggle('hidden', !t);
  $('t-fire').classList.toggle('hidden', G.mode !== 'campaign');
  $('t-od').classList.toggle('hidden', G.mode !== 'campaign');
}

function updateMid() {
  $('arena-name').textContent = G.W ? G.W.arena.name : '';
  const sc = $('score');
  if (G.mode === 'campaign') { $('stage-line').textContent = `STAGE ${G.stage + 1} / 5 · ${DIFFICULTY[G.diff].label}`; sc.classList.remove('hidden'); sc.textContent = G.score.toLocaleString(); }
  else if (G.mode === 'versus') { $('stage-line').textContent = `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`; sc.classList.add('hidden'); }
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
  G.state = 'ko';
  const winner = e.winner;
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
    after(4.6, () => (won ? stageResults() : continueScreen()));
  } else if (G.mode === 'versus') {
    G.wins[winner]++;
    const match = G.wins[winner] >= 2;
    after(1.3, () => ann(winner === 1 ? 'p1wins' : 'p2wins', 0, { queue: true }));
    if (comeback) after(2.6, () => ann('comeback', 0, { queue: true }));
    U.showBanner(`PLAYER ${winner === 1 ? 1 : 2} WINS`, match ? 'THE MATCH' : `ROUND ${G.round} · ${G.wins[1]} – ${G.wins[-1]}`, hex(G.sides[winner].color), 3.6);
    if (match) { after(2, () => A.sting('victory')); after(4.6, () => versusResults(winner)); }
    else after(4.6, () => { G.round++; versusRound(); });
  } else if (G.mode === 'demo') {
    after(1.2, () => pilotSay(winner, 'win', 1));
    if (comeback) after(1.3, () => ann('comeback', 0, { queue: true }));
    U.showBanner(`${G.sides[winner].name} WINS`, comeback ? 'WHAT A COMEBACK' : 'DEMO', hex(G.sides[winner].color), 4);
    after(5.2, () => { if (G.mode === 'demo') startDemo(); });
  }
}

function stageResults() {
  const W = G.W, st = W.stats[1];
  const coreLeft = W.cores[1].hp, perfect = coreLeft === W.cores[1].max;
  const timeBonus = Math.max(0, Math.round(180 - G.matchT)) * 10;
  const bonus = { stage: 1000 * (G.stage + 1), core: coreLeft * 300, perfect: perfect ? 3000 : 0, time: timeBonus };
  const mul = DIFFICULTY[G.diff].scoreMul;
  const add = Math.round((bonus.stage + bonus.core + bonus.perfect + bonus.time) * mul);
  G.score += add;
  const rows = [
    ['RETURNS', st.hits], ['SMASHES', st.smashes], ['CURVES', st.curves], ['STUNS', st.stuns], ['CELLS BROKEN', st.cells],
    ['CORE HITS', st.coreHits], ['POWER-UPS', st.pickups], ['LONGEST RALLY', W.maxRally], ['TIME', fmtT(G.matchT)],
    ['STAGE BONUS', '+' + bonus.stage], ['CORE INTACT', '+' + bonus.core], ['PERFECT', perfect ? '+3000' : '—'], ['TIME BONUS', '+' + bonus.time],
  ];
  $('res-title').textContent = G.stage === 4 ? 'THE MONOLITH FALLS' : `STAGE ${G.stage + 1} CLEAR`;
  $('res-stats').innerHTML = rows.map(([a, b]) => `<span>${a}</span><span>${b}</span>`).join('') + (mul !== 1 ? `<span>DIFFICULTY</span><span>×${mul}</span>` : '');
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
    rows.push([`P${s === 1 ? 1 : 2} RETURNS / SMASHES`, `${st.hits} / ${st.smashes}`], [`P${s === 1 ? 1 : 2} STUNS / CELLS`, `${st.stuns} / ${st.cells}`]);
  }
  $('res-title').textContent = `PLAYER ${winner === 1 ? 1 : 2} WINS`;
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
  await HS.submit(INI.chars.join(''), G.score, G.stage + 1);
  await HS.fetchGlobal();
  showScores(true, INI.chars.join(''));
}

function showScores(fromRun = false, me = null) {
  G.state = fromRun ? 'scores-end' : 'scores';
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
    };
  }
}

// ------------------------------------------------------------------ menus (mouse, keys, pad)
let backTo = 'title';
function menuSel(i) {
  const btns = visibleButtons();
  btns.forEach((b, k) => b.classList.toggle('sel', k === i));
  G.menuI = i;
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
  if (diff) return startCampaign(diff);
  switch (act) {
    case 'campaign': G.state = 'difficulty'; U.show('difficulty'); menuSel(1); break;
    case 'versus': startVersus(); break;
    case 'demo': startDemo(); break;
    case 'howto': case 'options': case 'scores': openSub(act); break;
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

$('t-fire').addEventListener('pointerdown', (e) => { e.preventDefault(); fire(1); });
$('t-od').addEventListener('pointerdown', (e) => { e.preventDefault(); overdrive(1); });
$('t-pause').addEventListener('pointerdown', (e) => { e.preventDefault(); pause(); });

function pause() {
  if (G.state !== 'play' && G.state !== 'countdown') return;
  if (G.mode === 'demo' || G.mode === 'attract') return;
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
addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

function fire(who) {
  if (G.state !== 'play' || G.paused) return;
  if (G.mode === 'campaign') who = 1;
  for (const h of G.humans) if (h.p.side === who) h.p.input.fire = true;
}
function overdrive(who) {
  if (G.state !== 'play' || G.paused) return;
  if (G.mode === 'campaign') who = 1;
  for (const h of G.humans) if (h.p.side === who) h.p.input.od = true;
}

I.on('fire', (who, src) => { if (G.mode === 'campaign' || G.mode === 'versus') { if (src === 'mouse' && G.mode === 'versus') who = 1; fire(who); } });
I.on('od', (who) => overdrive(who));
I.on('pause', () => {
  if (G.state === 'pause') return resume();
  if (['howto', 'options', 'scores', 'difficulty', 'scores-end'].includes(G.state)) return back();
  pause();
});
I.on('any', () => {
  G.idleT = 0;
  if (G.state === 'boot') return enterTitle();
  if (G.mode === 'demo' && G.state !== 'title') { goTitle(); }
});
I.on('key', (k, e) => {
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
  const menuStates = ['title', 'difficulty', 'pause', 'results', 'cont', 'howto', 'options', 'scores', 'scores-end'];
  if (!menuStates.includes(G.state)) return;
  const btns = visibleButtons();
  if (!btns.length) return;
  if (k === 'ArrowDown' || k === 'KeyS' || k === 'ArrowRight') { menuSel((G.menuI + 1) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'ArrowUp' || k === 'KeyW' || k === 'ArrowLeft') { menuSel((G.menuI - 1 + btns.length) % btns.length); A.play('uimove', { vol: 0.4, gap: 0 }); }
  if (k === 'Enter' || k === 'Space' || k === 'NumpadEnter') { const b = btns[G.menuI]; if (b) b.click(); }
});
// gamepad A acts as Enter in menus
I.on('fire', (who, src) => {
  if (src !== 'pad') return;
  const menuStates = ['title', 'difficulty', 'pause', 'results', 'cont', 'howto', 'options', 'scores', 'scores-end'];
  if (menuStates.includes(G.state)) { const b = visibleButtons()[G.menuI]; if (b) b.click(); }
  if (G.state === 'initials') saveIni();
});
I.assign = (t) => {
  if (G.mode !== 'versus' || !G.W) return 1;
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

// ------------------------------------------------------------------ boot
function bootProgress() {
  const total = 47 + 50 + 31;
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
}

// ------------------------------------------------------------------ frame loop
let last = performance.now();
const look = { bloom: 1.5, exposure: 1, desat: 0, fade: 0, chroma: 0, tint: new THREE.Vector3(1, 1, 1) };
function tick(dt) {
  I.pollPads(G.mode === 'versus');
  for (const t of G.timers.slice()) {
    if (G.paused) break;
    t.t -= dt;
    if (t.t <= 0) { G.timers.splice(G.timers.indexOf(t), 1); t.fn(); }
  }
  const W = G.W;
  let scale = G.simOn && !G.paused ? D.slow : 0;
  if (G.hitstop > 0) { G.hitstop -= dt; scale *= 0.1; }
  if (G.simOn && !G.paused) A.setRate(1 - (1 - Math.min(1, D.slow)) * 0.55);
  const sdt = dt * scale;
  if (W) {
    G.acc += sdt;
    let n = 0;
    while (G.acc >= STEP && n < 16) {
      controls(W, STEP);
      step(W, STEP);
      handleEvents(drainEvents(W));
      G.acc -= STEP;
      n++;
    }
    if (n >= 16) G.acc = 0;
    if (G.state === 'play') G.matchT += sdt;
  }
  // the scope power-up: show the human every incoming path
  G.scopeT -= dt;
  if (W && G.scopeT <= 0) {
    G.scopeT = 0.08;
    for (const h of G.humans) {
      const s = h.p.side;
      G.scope[s] = null;
      if (W.fx[s].scope <= 0) continue;
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
  if (G.mode === 'campaign' && W) $('t-od').classList.toggle('ready', W.meter[1].od >= 100 && W.meter[1].odTime <= 0);
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
if (params.has('demo')) { G.bootReady = true; }
requestAnimationFrame(frame);
// test hooks
window.__ppb.tick = (dt, n = 1) => { for (let i = 0; i < n; i++) tick(dt); };
window.__ppb.startDemo = startDemo;
window.__ppb.startCampaign = startCampaign;
window.__ppb.startVersus = startVersus;
window.__ppb.goTitle = goTitle;
window.__ppb.enterTitle = enterTitle;
window.__ppb.shot = async (name, q = 0.85) => {
  tick(1 / 60);
  const url = $('gl').toDataURL('image/jpeg', q);
  await fetch('/shot?name=' + name, { method: 'POST', body: url });
  return url.length;
};
