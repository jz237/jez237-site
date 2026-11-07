// Gold Digger: the game shell. Fixed-step simulation (sim.js) + renderer (render.js), level flow, the general store,
// the journal of discoveries, tips, cinematics, the attract demo, the AI playthrough, scores and menus.
import { VERSION, STEP, T, BIOMES, LEVELS, DEPTHS, UPGRADES, TYPICAL_UP, DIFFICULTY, MEDALS, RELICS, FOSSILS, WONDERS, NOTES, CREATURES, RANKS, START, STRATA, REWARDS, MAX_PERKS } from './config.js?v=13';
import { makeWorld, step, drainEvents, cloneWorld, carryOut } from './sim.js?v=13';
import { hash, findName } from './levelgen.js?v=13';
import { Autopilot } from './ai.js?v=13';
import { Renderer, pickQuality, LOOKS } from './render.js?v=13';
import { CALM } from './fx.js?v=13';
import { Audio } from './audio.js?v=13';
import { Input } from './input.js?v=13';
import { Scores, NO_POST } from './scores.js?v=13';
import { Recorder, Replay } from './replay.js?v=13';

const Q = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const store = { get(k, d) { try { const v = localStorage.getItem('gd.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem('gd.' + k, JSON.stringify(v)); } catch { /* private mode */ } } };
const FIXED = Q.has('fixed');

// ------------------------------------------------------------------ settings and saves
const settings = Object.assign({ music: 55, sfx: 85, voice: 90, talk: 'on', flash: 'full', shake: '1', tips: 'on', rumble: 'on', touch: 'auto', quality: 'auto', diff: 'normal' }, store.get('settings', {}));
const saveSettings = () => store.set('settings', settings);
const journal = Object.assign({ relic: [], fossil: [], wonder: [], note: [], creature: [], secret: 0, endless: [], cache: [] }, store.get('journal', {}));
const saveJournal = () => { store.set('journal', journal); if (typeof checkUnlocks === 'function') checkUnlocks(); };
let medals = store.get('medals', []);
let reached = store.get('reached', 0);
let bests = store.get('bests', {});
let tipsSeen = store.get('tips', {});
let unlocks = store.get('unlocks', []);
const loadout = Object.assign({ lamp: null, pick: null, perks: [] }, store.get('loadout', {}));
const rewardOf = (k) => REWARDS.find((r) => r.key === k);
function applyLoadout() {
  const lamp = loadout.lamp && unlocks.includes(loadout.lamp) ? rewardOf(loadout.lamp) : null;
  const pick = loadout.pick && unlocks.includes(loadout.pick) ? rewardOf(loadout.pick) : null;
  loadout.perks = loadout.perks.filter((k) => unlocks.includes(k)).slice(0, MAX_PERKS);
  R.setLoadout({ lampCol: lamp ? lamp.col : null, pickMat: pick ? pick.mat : null, keen: loadout.perks.includes('keeneye') });
  store.set('loadout', loadout);
}
// anything newly earned is announced (in play) and kept
function checkUnlocks(quiet) {
  const fresh = [];
  for (const r of REWARDS) { if (unlocks.includes(r.key)) continue; const [h, n] = r.need(journal); if (h >= n) { unlocks.push(r.key); fresh.push(r); } }
  if (!fresh.length) return;
  store.set('unlocks', unlocks);
  if (quiet) return;
  const r = fresh[0];
  setTimeout(() => { popBanner('UNLOCKED', r.name + (fresh.length > 1 ? ` +${fresh.length - 1} MORE` : '') + ' · SEE THE LOCKER'); A.play('medal', { vol: 0.9 }); }, 1800);
}
const discoveries = () => journal.relic.length + journal.fossil.length + journal.wonder.length + journal.note.length + journal.creature.length + Math.min(journal.secret, 30) + journal.endless.length + (journal.cache || []).length;
const rankName = () => { let r = RANKS[0][1]; for (const [n, name] of RANKS) if (discoveries() >= n) r = name; return r; };

// ------------------------------------------------------------------ setup
const q = pickQuality(settings.quality === 'auto' ? null : settings.quality);
const canvas = $('gl');
const R = new Renderer(canvas, q);
const A = new Audio('./');
const I = new Input();
const rec = new Recorder();
const boards = {};
const board = (endless, diff) => { const k = 'gold-digger' + (endless ? '-endless' : '') + (diff === 'normal' ? '' : '-' + diff); return boards[k] || (boards[k] = new Scores(k)); };
const G = { state: 'boot', screen: 'title', mode: 'title', W: null, run: null, acc: 0, slow: 1, slowT: 0, replay: null, clip: null, idleT: 0, demoT: 0, ap: null, paused: false, tipT: 0, findT: 0, transT: 0, levelT: 0, newMedals: [] };
window.__gd = { G, R, A, I, VERSION, settings, journal };

function applySettings() {
  A.vol.music = settings.music / 100; A.vol.sfx = settings.sfx / 100; A.vol.voice = settings.voice / 100; A.applyVolumes();
  CALM.on = settings.flash === 'reduced';
  R.view.shake = +settings.shake;
  const touch = settings.touch === 'on' || (settings.touch === 'auto' && I.isTouch);
  I.touchOn = touch;
  document.querySelectorAll('[data-opt]').forEach((seg) => { const k = seg.dataset.opt; seg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', String(settings[k]) === b.dataset.v)); });
  document.querySelectorAll('[data-set]').forEach((r) => { r.value = settings[r.dataset.set]; });
  $('diff-desc').textContent = (DIFFICULTY[settings.diff] || DIFFICULTY.normal).desc;
}
function resize() { R.resize(innerWidth, innerHeight); }
addEventListener('resize', resize);
resize();

// ------------------------------------------------------------------ screens
const SCREENS = ['title', 'depths', 'shop', 'results', 'journal', 'map', 'scores', 'medals', 'options', 'help', 'pause', 'museum', 'locker'];
let screenStack = [];
function show(name, push = false) {
  if (push && G.screen) screenStack.push(G.screen); else if (!push) screenStack = [];
  G.screen = name;
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== name);
  document.body.classList.toggle('paused', name === 'pause');
  if (name === 'title') refreshTitle();
  if (name === 'journal') { drawJournal(); $('j-museum').classList.toggle('hidden', G.state !== 'title'); }
  if (name === 'map') drawMap();
  if (name === 'scores') drawScores();
  if (name === 'medals') drawMedals();
  if (name === 'locker') drawLocker();
  if (name === 'depths') drawDepths();
  firstSel();
}
function back() {
  A.play('uiback', { vol: 0.5 });
  if (G.state === 'museum' && G.screen === 'locker') { G.lockerFromMuseum = false; show('museum'); drawMuseum(); return; }
  if (G.state === 'museum') { toTitle(); return; }
  const prev = screenStack.pop();
  if (prev) { G.screen = null; show(prev, false); screenStack = screenStack; return; }
  show(G.state === 'paused' ? 'pause' : 'title');
}
function firstSel() {
  const scr = $(G.screen); if (!scr) return;
  document.querySelectorAll('.mbtn.sel, .upg.sel, .sec.sel').forEach((e) => e.classList.remove('sel'));
  if (I.lastKind !== 'pad' && I.lastKind !== 'key') return;
  const b = scr.querySelector('.mbtn.primary:not(.hidden), .mbtn:not(.hidden), .upg, .sec:not([disabled])');
  if (b) b.classList.add('sel');
}
function refreshTitle() {
  $('ver').textContent = VERSION;
  $('j-sub').textContent = `${discoveries()} discoveries`;
  $('med-sub').textContent = `${medals.length} / ${MEDALS.length}`;
  $('lk-sub').textContent = `${unlocks.length} / ${REWARDS.length} unlocked`;
  $('rank').textContent = rankName();
  $('title-best').textContent = 'BEST ' + (board(false, settings.diff).best() || 0).toLocaleString();
  applySettings();
}

// ------------------------------------------------------------------ runs and levels
const randSeed = () => (Q.has('seed') ? +Q.get('seed') : (Date.now() ^ (Math.random() * 1e9)) >>> 0);
function startCampaign(depth = 0, o = {}) {
  A.unlock();
  const up = { ...(TYPICAL_UP[depth] || {}) };
  const run = { mode: o.mode || 'campaign', diff: o.diff || settings.diff, depth, level: o.level || 0, endlessN: 0, seed: o.seed ?? randSeed(), purse: o.purse || 0, up, carry: { up },
    auto: o.auto || null, startDepth: depth, medals: [], noHitLevel: true, finds: 0, gold: 0 };
  if (depth > 0) { const D = DIFFICULTY[run.diff]; run.carry.dyn = START.dyn + 2 * (up.satchel || 0); run.carry.flares = START.flares + 2 * (up.pouch || 0); }
  G.run = run; G.mode = run.mode;
  loadLevel();
}
function startEndless(o = {}) {
  A.unlock();
  const run = { mode: 'endless', diff: o.diff || settings.diff, depth: 0, level: 0, endlessN: o.n || 0, seed: o.seed ?? randSeed(), purse: 0, up: {}, carry: { up: {} }, auto: o.auto || null, medals: [], finds: 0, gold: 0 };
  G.run = run; G.mode = 'endless';
  loadLevel();
}
function levelSeed(run) { return hash(run.seed, run.depth, run.level, run.endlessN) >>> 0; }
function loadLevel() {
  const run = G.run;
  run.carry.up = run.up;
  run.carry.perks = run.auto ? [] : loadout.perks.slice();
  const W = makeWorld({ seed: levelSeed(run), mode: run.mode === 'endless' ? 'endless' : 'campaign', diff: run.diff, depth: run.depth, level: run.level, endlessN: run.endlessN, carry: run.carry });
  G.W = W; G.state = 'play'; G.paused = false; G.acc = 0; G.levelT = 0; G.slow = 1; G.slowT = 0; G.replay = null; G.clip = null;
  rec.reset();
  R.load(W);
  G.ap = run.auto ? new Autopilot(run.auto, levelSeed(run) & 0xffff) : null;
  $('tut').classList.add('hidden'); $('find').classList.add('hidden'); $('caption').classList.add('hidden'); G.findT = 0; I.taps.clear();
  show(null);
  for (const s of SCREENS) $(s).classList.add('hidden');
  G.screen = null;
  $('hud').classList.remove('hidden');
  $('bossbar').classList.toggle('hidden', !W.boss);
  if (W.boss) $('boss-name').textContent = BIOMES[W.depth].bossName;
  const B = BIOMES[W.biome];
  const dname = W.endless ? `${STRATA[Math.floor(W.endlessN / 3) % STRATA.length]} ${B.name.split(' ').pop()}` : B.name;
  $('depth-name').textContent = dname;
  $('level-name').textContent = W.endless ? `THE ENDLESS DEEP · LEVEL ${W.endlessN + 1}` : W.boss ? `DEPTH ${W.depth + 1} · THE GUARDIAN` : `DEPTH ${W.depth + 1} · LEVEL ${W.level + 1}`;
  const hi = board(W.endless, run.diff).best();
  $('hiscore').textContent = hi.toLocaleString();
  descendCard(dname, W.boss ? BIOMES[W.depth].bossName : W.endless ? `LEVEL ${W.endlessN + 1}` : `LEVEL ${W.level + 1} OF ${LEVELS}`, W.boss ? 'Something is waiting at the bottom of the shaft.' : B.sub.charAt(0) + B.sub.slice(1).toLowerCase());
  // music and the old prospector (rarely)
  A.playMusic(W.endless ? 'deep' : B.music);
  if (A.ctx) A.setBed('amb', B.amb, 0.32);
  if (!run.auto || run.mode === 'playthrough') {
    if (!W.endless && W.level === 0 && !W.boss) say(W.depth === 0 ? 'v_begin' : 'v_d' + (W.depth + 1), 2.5);
    if (W.endless && run.endlessN === 0) say('v_deep', 2.5);
  }
  if (!W.endless && !run.auto) { reached = Math.max(reached, W.depth); store.set('reached', reached); }
  run.levelHits = W.stats.hits;
  touchUI();
  G.tipT = 0;
}
function descendCard(a, b, c) {
  const d = $('descend');
  d.querySelector('.d1').textContent = a; d.querySelector('.d2').textContent = b; d.querySelector('.d3').textContent = c;
  d.classList.remove('hidden'); d.style.opacity = 1; d.style.transition = 'none';
  clearTimeout(G.descTimer);
  G.descTimer = setTimeout(() => { d.style.transition = 'opacity 1.2s'; d.style.opacity = 0; setTimeout(() => d.classList.add('hidden'), 1300); }, FIXED ? 10 : 2600);
}
function say(name, delay = 0) { if (settings.talk !== 'on' || !A.ctx) return; A.say(name, { delay }); }

function levelDone() {
  const W = G.W, run = G.run;
  G.state = 'between';
  // bests and medals
  const key = `${run.diff}:${W.endless ? 'e' + W.endlessN : W.depth + '.' + W.level}`;
  const b = bests[key] || {}; if (!b.t || W.t < b.t) b.t = Math.round(W.t * 10) / 10; if (!b.s || W.score > b.s) b.s = W.score; bests[key] = b; store.set('bests', bests);
  if (!run.auto) {
    if (W.stats.hits === run.levelHits && !W.boss) award('nohit');
    if (W.M.totalGold && W.stats.goldGot >= W.M.totalGold) award('allgold');
    if ((W.stats.seenPct || 0) >= 0.95) award('explorer');
    if (W.boss) award(['first-depth', 'glow', 'geode', 'drowned', 'heart'][W.depth]);
    if (W.endless && W.endlessN + 1 >= 10) award('endless10');
  }
  run.carry = carryOut(W);
  run.carry.up = run.up;
  if (W.endless) {
    run.endlessN++;
    if (run.endlessN % 3 === 0) openShop('A TRADING POST', 'EVEN DOWN HERE SOMEBODY SELLS LAMP OIL');
    else transition();
    return;
  }
  if (W.boss) {
    if (W.depth >= DEPTHS - 1) { victory(); return; }
    run.depth++; run.level = 0;
    openShop('THE GENERAL STORE', `${BIOMES[run.depth - 1].bossName} IS DOWN · SPEND YOUR GOLD BEFORE ${BIOMES[run.depth].name}`);
    return;
  }
  run.level++;
  transition();
}
function transition() {
  $('fade').classList.add('on');
  setTimeout(() => { loadLevel(); setTimeout(() => $('fade').classList.remove('on'), 60); }, FIXED ? 0 : 650);
}

// ------------------------------------------------------------------ the store
let shopSel = 0, shopAuto = null;
function openShop(title, sub) {
  G.state = 'shop';
  $('shop-title').textContent = title; $('shop-sub').textContent = sub;
  $('next-sub').textContent = G.run.mode === 'endless' ? `On to level ${G.run.endlessN + 1}` : `Down to ${BIOMES[G.run.depth].name}`;
  $('shop-replay').classList.toggle('hidden', !G.clip);
  show('shop'); drawShop();
  A.playMusic('title');
  if (G.run.auto) {
    // the autopilot buys in a sensible order, then rolls on
    const order = ['lamp', 'heart', 'boots', 'pick', 'satchel', 'helmet', 'pouch', 'lamp', 'heart', 'pick', 'boots', 'lamp'];
    let n = 0;
    for (const k of order) { const u = UPGRADES.find((x) => x.key === k); const lv = G.run.up[k] || 0; if (lv < u.max && G.run.purse >= u.cost[lv]) { buy(k, true); n++; } }
    drawShop();
    shopAuto = setTimeout(() => { if (G.state === 'shop') nextFromShop(); }, FIXED ? 10 : 5000);
  }
}
function drawShop() {
  $('purse-n').textContent = G.run.purse.toLocaleString();
  const g = $('upgrid'); g.innerHTML = '';
  for (const u of UPGRADES) {
    const lv = G.run.up[u.key] || 0, max = lv >= u.max, cost = max ? 0 : u.cost[lv];
    const el = document.createElement('button');
    el.className = 'upg' + (max ? ' max' : G.run.purse < cost ? ' poor' : '') + (G.run.bought && G.run.bought.includes(u.key) ? ' pick' : '');
    el.style.setProperty('--uc', u.col);
    el.innerHTML = `<i>${u.icon}</i><b>${u.name}</b><span class="lvl">${Array.from({ length: u.max }, (_, i) => `<em class="${i < lv ? 'on' : ''}"></em>`).join('')}</span><small>${max ? 'Fully upgraded' : u.desc[lv]}</small><span class="cost">${max ? 'MAXED' : cost.toLocaleString() + ' GOLD' + (G.run.purse < cost ? ` · NEED ${(cost - G.run.purse).toLocaleString()} MORE` : '')}</span>`;
    el.onclick = () => buy(u.key);
    g.appendChild(el);
  }
}
function buy(k, quiet) {
  const u = UPGRADES.find((x) => x.key === k), lv = G.run.up[k] || 0;
  if (lv >= u.max) return;
  const cost = u.cost[lv];
  if (G.run.purse < cost) { if (!quiet) A.play('uiback', { vol: 0.5 }); return; }
  G.run.purse -= cost; G.run.up = { ...G.run.up, [k]: lv + 1 };
  (G.run.bought ||= []).push(k);
  const c = G.run.carry;
  if (k === 'satchel') c.dyn = (c.dyn || 0) + 2;
  if (k === 'pouch') c.flares = (c.flares || 0) + 2;
  if (k === 'heart') c.hp = (c.hp || 3) + 1;
  if (k === 'lamp') c.oil = 999;
  A.play('upgrade', { vol: 0.8 });
  if (!quiet) drawShop();
}
function nextFromShop() { clearTimeout(shopAuto); G.run.bought = []; G.run.carry.oil = 999; transition(); }

// ------------------------------------------------------------------ results
let ini = ['A', 'A', 'A'], iniPos = 0, iniOpen = false;
function gameOver() {
  G.state = 'results';
  showResults(false);
}
function victory() {
  G.state = 'results'; G.run.won = true;
  say('v_champion', 1);
  showResults(true);
}
function showResults(won) {
  const W = G.W, run = G.run;
  A.stopLoops();
  if (!won) { A.sting('over'); say('v_gameover', 1.2); } else A.sting('clear');
  $('res-title').textContent = won ? 'THE HEART OF THE MOUNTAIN' : 'THE MOUNTAIN WINS';
  $('res-sub').textContent = won ? 'YOU REACHED THE BOTTOM OF THE WORLD' : (W.players[0].cause ? 'TAKEN BY ' + W.players[0].cause.toUpperCase() : '');
  const st = [['SCORE', W.score.toLocaleString()], ['REACHED', W.endless ? `LEVEL ${W.endlessN + 1}` : `DEPTH ${W.depth + 1}${W.boss ? ' GUARDIAN' : ' · LEVEL ' + (W.level + 1)}`], ['DISCOVERIES', String(run.finds || 0)], ['RANK', rankName()]];
  $('res-stats').innerHTML = st.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  if (W.score >= 100000) award('rich');
  $('res-medals').innerHTML = G.newMedals.map((k) => { const m = MEDALS.find((x) => x[0] === k); return m ? `<span class="medal on new">★ ${m[1]}</span>` : ''; }).join('');
  G.newMedals = [];
  const B = board(W.endless, run.diff);
  iniOpen = !run.auto && B.qualifies(W.score);   // tests and ?noscores still ask; Scores.submit never posts for them
  $('ini-wrap').classList.toggle('hidden', !iniOpen);
  $('ini-saved').classList.add('hidden');
  ini = B.initials().split(''); iniPos = 0; drawIni();
  $('res-cont').classList.toggle('hidden', won || !!run.auto);
  show('results');
  if (!run.auto && W.score > (B.best() || 0) && W.score > 5000) say('v_newrecord', won ? 5 : 3);
}
function drawIni() { const bs = $('ini').querySelectorAll('b'); bs.forEach((b, i) => { b.textContent = ini[i]; b.classList.toggle('cur', i === iniPos); }); }
async function submitIni() {
  if (!iniOpen) return;
  iniOpen = false;
  const W = G.W, run = G.run, B = board(W.endless, run.diff);
  const extra = W.endless ? `LEVEL ${W.endlessN + 1}` : `D${W.depth + 1}${W.boss ? ' BOSS' : ' L' + (W.level + 1)}`;
  await B.submit(ini.join(''), W.score, W.endless ? W.endlessN + 1 : W.depth + 1, { extra, local: run.auto || G.mode === 'demo' });
  $('ini-wrap').classList.add('hidden');
  const s = $('ini-saved'); s.textContent = 'SAVED · ' + ini.join(''); s.classList.remove('hidden');
  A.play('uiok');
}
function continueRun() {
  const run = G.run;
  run.carry = { up: run.up };
  G.W.score = 0;
  loadLevel();
}
function award(k) {
  if (!k || medals.includes(k)) return;
  medals.push(k); store.set('medals', medals); G.newMedals.push(k);
  const m = MEDALS.find((x) => x[0] === k);
  if (m) { popBanner('MEDAL', m[1]); A.play('medal'); }
}

// ------------------------------------------------------------------ the locker (collection rewards)
function drawLocker() {
  const sec = (kind, title, def) => {
    const list = REWARDS.filter((r) => r.kind === kind);
    const eq = kind === 'perk' ? loadout.perks : [loadout[kind]];
    let h = `<h3>${title}</h3><div class="lgrid">`;
    if (def) h += `<button class="lock-it${!loadout[kind] ? ' on' : ''}" data-eq="${kind}:"><b>${def[0]}</b><small>${def[1]}</small><em>${!loadout[kind] ? 'EQUIPPED' : 'TAP TO EQUIP'}</em></button>`;
    for (const r of list) {
      const got = unlocks.includes(r.key), [hv, n] = r.need(journal), on = eq.includes(r.key);
      const sw = r.col ? `<i style="background:#${r.col.toString(16).padStart(6, '0')}"></i>` : r.mat ? `<i style="background:#${r.mat.color.toString(16).padStart(6, '0')}"></i>` : '';
      h += got ? `<button class="lock-it${on ? ' on' : ''}" data-eq="${kind}:${r.key}">${sw}<b>${r.name}</b><small>${r.desc || r.how}</small><em>${on ? 'EQUIPPED' : kind === 'perk' ? 'TAP TO EQUIP' : 'TAP TO EQUIP'}</em></button>`
        : `<div class="lock-it locked">${sw}<b>${r.name}</b><small>${r.desc ? r.desc + ' · ' : ''}${r.how}</small><em>${Math.min(hv, n)} / ${n}</em><span class="bar"><s style="width:${Math.min(100, hv / n * 100)}%"></s></span></div>`;
    }
    return h + '</div>';
  };
  $('lk-sum').textContent = `${unlocks.length} OF ${REWARDS.length} UNLOCKED · PERKS ${loadout.perks.length} / ${MAX_PERKS}`;
  $('lk-body').innerHTML = sec('lamp', 'LAMP COLOUR', ['MINER\'S AMBER', 'The old warm flame']) + sec('pick', 'PICK', ['STEEL PICK', 'Plain and honest']) + sec('perk', `PERKS · EQUIP UP TO ${MAX_PERKS}`);
}
function equip(kind, key) {
  if (kind === 'perk') {
    const i = loadout.perks.indexOf(key);
    if (i >= 0) loadout.perks.splice(i, 1);
    else { if (loadout.perks.length >= MAX_PERKS) loadout.perks.shift(); loadout.perks.push(key); }
  } else loadout[kind] = key || null;
  A.play(kind === 'perk' ? 'uiok' : 'upgrade', { vol: 0.6 });
  applyLoadout(); drawLocker();
}

// ------------------------------------------------------------------ the relic museum
function openMuseum() {
  if (G.state !== 'title') return;   // never from the pause menu: that would end the run
  A.unlock();
  G.state = 'museum'; G.mode = 'title'; G.museumSel = Math.min(5, reached);
  $('hud').classList.add('hidden'); $('demo-badge').classList.add('hidden');
  R.loadMuseum(journal, BIOMES);
  show('museum'); drawMuseum();
  setTimeout(drawMuseum, 0);
  A.playMusic('title');
}
function museumGo(d) { G.museumSel = (G.museumSel + d + 6) % 6; A.play('uimove', { vol: 0.5 }); drawMuseum(); }
function drawMuseum() {
  const Mu = R.museum; if (!Mu) return;
  const A2 = Mu.alcoves[G.museumSel];
  const have = A2.slots.filter((s) => s.found).length;
  const total = journal.relic.length + journal.endless.filter((e) => e.kind === 'relic').length;
  $('mus-name').textContent = A2.name;
  $('mus-sub').textContent = G.museumSel < 5 ? `DEPTH ${G.museumSel + 1} · ${have} OF 3 RELICS` : `THE LAST THREE RELICS FROM THE ENDLESS DEEP`;
  $('mus-total').textContent = `${total} RELIC${total === 1 ? '' : 'S'} · ${journal.fossil.length} FOSSILS · ${journal.cache.length} CACHES · ${unlocks.length}/${REWARDS.length} REWARDS`;
  $('mus-list').innerHTML = A2.slots.map((s) => {
    if (s.id < 0) return `<div class="jent locked"><b>EMPTY PLINTH</b><small>Dig deeper into the Endless Deep.</small></div>`;
    const [n, t] = findName('relic', s.id);
    return s.found ? `<div class="jent"><b>${n}</b><small>${t}</small></div>` : `<div class="jent locked"><b>? ? ?</b><small>Still somewhere in ${A2.name.toLowerCase()}. Look for a sealed vault.</small></div>`;
  }).join('');
}

// ------------------------------------------------------------------ journal, map, scores, medals, depths
let jTab = 'relic';
function drawJournal() {
  $('jsum').innerHTML = `RANK <b>${rankName()}</b> · <b>${discoveries()}</b> DISCOVERIES · <b>${journal.secret}</b> SECRET ROOMS OPENED · <b>${journal.cache.length}</b> CACHES DUG UP`;
  document.querySelectorAll('#jtabs button').forEach((b) => b.classList.toggle('on', b.dataset.jt === jTab));
  const g = $('jgrid'); let h = '';
  const ent = (on, name, text, tag) => `<div class="jent${on ? '' : ' locked'}"><em>${tag}</em><b>${on ? name : '? ? ?'}</b><small>${on ? text : 'Not found yet.'}</small></div>`;
  if (jTab === 'relic') RELICS.forEach(([n, t], i) => { h += ent(journal.relic.includes(i), n, t, `DEPTH ${Math.floor(i / 3) + 1}`); });
  if (jTab === 'fossil') FOSSILS.forEach(([n, t], i) => { h += ent(journal.fossil.includes(i), n, t, `DEPTH ${Math.floor(i / 2) + 1}`); });
  if (jTab === 'wonder') WONDERS.forEach(([n, t], i) => { h += ent(journal.wonder.includes(i), n, t, `DEPTH ${Math.floor(i / 2) + 1}`); });
  if (jTab === 'note') NOTES.forEach((t, i) => { h += ent(journal.note.includes(i), `NOTE ${i + 1}`, t, `DEPTH ${Math.floor(i / 2) + 1}`); });
  if (jTab === 'creature') Object.entries(CREATURES).forEach(([k, [n, t]]) => { h += ent(journal.creature.includes(k), n, t, 'BESTIARY'); });
  if (jTab === 'endless') { h += journal.endless.length ? journal.endless.slice().reverse().map((e) => ent(true, e.name, e.text, e.kind.toUpperCase())).join('') : '<p>Finds from the Endless Deep are recorded here. Every stratum has its own relics and wonders.</p>'; }
  g.innerHTML = h;
}
function drawMap() {
  const W = G.W; if (!W) return;
  const M = W.M, cv = $('mapcv');
  const s = Math.max(4, Math.min(12, Math.floor(Math.min(innerWidth * 0.85 / M.w, innerHeight * 0.55 / M.h))));
  cv.width = M.w * s; cv.height = M.h * s;
  const c = cv.getContext('2d');
  c.fillStyle = '#050403'; c.fillRect(0, 0, cv.width, cv.height);
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) {
    const i = y * M.w + x; if (!M.seen[i]) continue;
    const t = M.tiles[i];
    c.fillStyle = t === T.AIR || t === T.SPIKES ? '#3a2f24' : t === T.WATER ? '#1f5a78' : t === T.LAVA ? '#b03010' : t === T.LADDER || t === T.ROPE ? '#8a6a3a' : t === T.PLANK ? '#6a4a2a' : t === T.VEIN ? '#c89a30' : '#141210';
    c.fillRect(x * s, (M.h - 1 - y) * s, s, s);
  }
  const dot = (x, y, col, r = 1) => { c.fillStyle = col; c.beginPath(); c.arc(x * s, (M.h - y) * s, s * r, 0, 7); c.fill(); };
  for (const cp of W.camps) if (M.seen[Math.floor(cp.y) * M.w + Math.floor(cp.x)]) dot(cp.x, cp.y + 0.5, '#ff9a3a', 0.8);
  for (const f of W.finds) if (!f.got && f.kind !== 'cache' && M.seen[Math.floor(f.y) * M.w + Math.floor(f.x)]) dot(f.x, f.y + 0.5, '#c08aff', 0.7);
  const cache = W.mapFound && W.finds.find((f) => f.kind === 'cache' && !f.got);
  if (cache) { c.strokeStyle = '#ff4a30'; c.lineWidth = Math.max(2, s * 0.4); const X = cache.x * s, Y = (M.h - cache.y - 1) * s, r = s * 1.3; c.beginPath(); c.moveTo(X - r, Y - r); c.lineTo(X + r, Y + r); c.moveTo(X + r, Y - r); c.lineTo(X - r, Y + r); c.stroke(); }
  if (M.exit && M.seen[M.exit.y * M.w + Math.floor(M.exit.x)]) dot(M.exit.x, M.exit.y + 0.5, '#7dff9a', 1);
  const P = W.players[0]; dot(P.x, P.y + 0.8, '#ffd27a', 1.1);
  const pct = W.openCells ? Math.round(W.stats.seen / W.openCells * 100) : 0;
  $('map-title').textContent = $('depth-name').textContent;
  $('map-sub').textContent = `${$('level-name').textContent} · ${pct}% EXPLORED · ${W.found.filter((f) => f.kind !== 'creature').length} FINDS`;
}
let hsTab = 'campaign', hsDiff = null;
async function drawScores() {
  hsDiff = hsDiff || settings.diff;
  document.querySelectorAll('#scores [data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === hsTab));
  document.querySelectorAll('#hs-diff button').forEach((b) => b.classList.toggle('on', b.dataset.hd === hsDiff));
  const B = board(hsTab === 'endless', hsDiff);
  const rows = (list) => (list && list.length ? list : []).map((r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td class="ex">${r.extra || ''}</td><td>${r.score.toLocaleString()}</td></tr>`).join('') || '<tr><td></td><td>—</td><td></td><td></td></tr>';
  $('hs-local').innerHTML = rows(B.local());
  $('hs-global').innerHTML = '<tr><td></td><td>LOADING…</td><td></td><td></td></tr>';
  $('besttimes').innerHTML = BIOMES.map((b, d) => `${b.name}: ` + [0, 1, 2, 3].map((l) => { const x = bests[`${hsDiff}:${d}.${l}`]; return x ? `${l === 3 ? 'G' : 'L' + (l + 1)} ${fmtT(x.t)}` : ''; }).filter(Boolean).join(' · ')).join('<br>');
  const g = await B.fresh();
  if (G.screen === 'scores') $('hs-global').innerHTML = g ? rows(g) : '<tr><td></td><td>OFFLINE</td><td></td><td></td></tr>';
}
function drawMedals() {
  $('med-count').textContent = `${medals.length} OF ${MEDALS.length} · MEDALS COUNT ON NORMAL AND HARDER`;
  $('medlist').innerHTML = MEDALS.map(([k, n, d]) => `<span class="medal${medals.includes(k) ? ' on' : ''}" title="${d}">${medals.includes(k) ? '★' : '☆'} ${n}<br><small style="font-family:Barlow;letter-spacing:0">${d}</small></span>`).join('');
}
function drawDepths() {
  const g = $('secgrid'); g.innerHTML = '';
  BIOMES.forEach((b, d) => {
    const el = document.createElement('button');
    el.className = 'sec'; if (d > reached) el.setAttribute('disabled', '');
    el.innerHTML = `<b>DEPTH ${d + 1}</b><span>${b.name}</span><small>${d > reached ? 'Not reached yet' : b.sub.toLowerCase()}</small>`;
    el.onclick = () => { if (d <= reached) { A.play('uiok'); startCampaign(d); } };
    g.appendChild(el);
  });
}
const fmtT = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// ------------------------------------------------------------------ events -> sound, effects, HUD, journal
const SND = { step: ['step', 0.32, 0.18], land: ['land', 0.5], jump: ['jump', 0.35], climb: ['climb', 0.35, 0.15], swing: ['swing', 0.45], pick: ['pick', 0.7], ore: ['ore', 0.8], clink: ['pick', 0.5, 0, 1.35],
  throw: ['throw', 0.6], place: ['throw', 0.5], flare: ['flare', 0.8], gold: ['gold', 0.7], gem: ['gem', 0.8], chest: ['chest', 0.9], oil: ['oil', 0.8], heart: ['heart', 0.8], key: ['key', 0.9], tool: ['gold', 0.55, 0, 0.75],
  hurt: ['hurt', 0.9], helmet: ['pick', 0.8, 0, 0.7], death: ['death', 0.9], splash: ['splash', 0.8], batwake: ['bat', 0.35], bat: ['bat', 0.6], hitflesh: ['hitflesh', 0.7], stomp: ['hitflesh', 0.6],
  shadeform: ['shade', 0.55], dispel: ['shadefade', 0.8], ripple: ['swim', 0.4, 0, 0.7], eel: ['eel', 0.8], crack: ['crack', 0.7], stalhit: ['stalfall', 0.85], geywarn: ['geyserwarn', 0.6], geyser: ['geyser', 0.8],
  crumble: ['crumble', 0.8], creak: ['crack', 0.4, 0, 1.3], door: ['door', 0.9], camp: ['checkpoint', 0.9], cageland: ['liftstop', 0.7], cagego: ['lift', 0.7], burn: ['burn', 0.9], secret: ['discover', 0.6],
  rumble: ['rumble', 0.8], burrow: ['burrow', 0.8], slam: ['slam', 0.9], screech: ['screech', 0.7], wings: ['wings', 0.8], beamcharge: ['beam', 0.8], surge: ['surge', 0.8], magma: ['magma', 0.8], spit: ['eel', 0.7, 0, 0.8],
  bossroar: ['bossroar', 0.9], bosshit: ['bosshit', 0.9], bossstun: ['shatter', 0.7], bossdie: ['bossdie', 1], life: ['life', 0.8], projhit: ['splash', 0.5, 0, 1.2], bonk: ['land', 0.3, 0, 1.4], flareout: [null] };
function onEvent(e) {
  const W = G.W, P = W.players[0];
  const live = !G.replay;
  R.event(e, W);
  const s = SND[e.k];
  if (s && s[0] && A.ctx) A.play(s[0], { x: e.x, y: e.y, z: 0, vol: s[1], vary: s[2] ?? 0.08, rate: s[3] ?? 1 });
  if (!A.ctx) return;
  switch (e.k) {
    case 'break': A.play(e.t === T.VEIN ? 'ore' : 'rockbreak', { x: e.x, y: e.y, vol: 0.8 }); if (e.t === T.VEIN) A.play('gold', { x: e.x, y: e.y, vol: 0.6, delay: 0.15 }); break;
    case 'throw': if (e.what === 'dyn') A.play('fuse', { x: e.x, y: e.y, vol: 0.55 }); break;
    case 'place': A.play('fuse', { x: e.x, y: e.y, vol: 0.55 }); break;
    case 'blast': A.play('boom', { x: e.x, y: e.y, vol: 1 }); A.play('debris', { x: e.x, y: e.y, vol: 0.6, delay: 0.25 }); if (live) I.rumble(0.9, 0.6, 380); break;
    case 'kill': A.play(e.what === 'bat' ? 'batdie' : e.what === 'crawler' ? 'crawldie' : 'hitflesh', { x: e.x, y: e.y, vol: 0.7 }); break;
    case 'hurt': if (live) I.rumble(0.6, 0.5, 220); break;
    case 'chest': A.play('bigloot', { x: e.x, y: e.y, vol: 0.8, delay: 0.3 }); break;
    case 'clear': A.stopLoops(); if (!W.boss) A.overlay('clear', 0.7); break;
    case 'lowoil': A.play('lamp', { vol: 0.6 }); if (!G.run?.auto) say('v_lowoil'); break;
    case 'bosswake': A.playMusic('boss', 0.6); A.play('bossroar', { x: e.x, y: e.y, vol: 1 }); if (!G.run?.auto) say('v_boss', 1.6); R.cinematic(e.x, e.y + 2, 26, 2.6); break;
    case 'bossdie': A.stopMusic(2); setTimeout(() => A.sting('clear'), FIXED ? 0 : 2500); if (!G.run?.auto || G.run.mode === 'playthrough') say('v_bossdown', 3); slowmo(0.3, 2.2); R.cinematic(e.x, e.y + 1, 18, 4); break;
    case 'gameover': break;
  }
  // HUD, journal, cinematics (not in replays)
  if (!live) return;
  if (e.k === 'gold' || e.k === 'gem' || e.k === 'chest') { G.run.purse += e.v || 0; G.run.gold += e.v || 0; popWorld(e.x, e.y + 0.6, '+' + (e.v || 0), e.k === 'gem' ? 'c' : 'g'); flyCoin(e.x, e.y + 0.3, e.k === 'gem'); }
  if (e.k === 'kill') popWorld(e.x, e.y + 0.6, 'KO', '');
  if (e.k === 'hurt') { popWorld(e.x, e.y + 1.4, '-' + e.n, 'r'); G.run.noHitLevel = false; }
  if (e.k === 'life') popBanner('EXTRA LIFE', '');
  if (e.k === 'death') { G.clip = rec.clip(e.n, 3.4, 1.4); caption('TAKEN BY ' + (e.cause || 'THE DARK').toUpperCase(), true); slowmo(0.35, 0.9); if (W.lives === 0 && !G.run.auto) say('v_lastlife', 2.6); }
  if (e.k === 'bossdie') G.clip = rec.clip(e.n, 3.6, 2.4);
  if (e.k === 'secret') { journal.secret++; saveJournal(); popBanner('SECRET ROOM', 'THE WALL GIVES WAY'); if (journal.secret >= 10) award('secrets10'); }
  if (e.k === 'camp') caption('CAMP LIT · YOUR PLACE IS SAVED');
  if (e.k === 'tocamp') { caption('BACK TO CAMP'); R.cam.cine = null; }
  if (e.k === 'key') caption('A KEY · IT OPENS A LOCKED GATE IN THIS LEVEL');
  if (e.k === 'door') caption('THE GATE SWINGS OPEN');
  if (e.k === 'find') onFind(e);
}
function onFind(e) {
  const W = G.W, run = G.run;
  let isNew = false;
  if (e.kind === 'creature') { if (!journal.creature.includes(e.id)) { journal.creature.push(e.id); isNew = true; saveJournal(); const c = CREATURES[e.id]; if (c && !run.auto) caption('NEW IN THE BESTIARY · ' + c[0]); } return; }
  run.finds = (run.finds || 0) + 1;
  if (e.id >= 100) { if (!journal.endless.find((x) => x.kind === e.kind && x.id === e.id)) { journal.endless.push({ kind: e.kind, id: e.id, name: e.name, text: e.text }); isNew = true; } }
  else if (journal[e.kind] && !journal[e.kind].includes(e.id)) { journal[e.kind].push(e.id); isNew = true; }
  if (e.kind === 'map') isNew = false;
  saveJournal();
  if (journal.relic.length >= 3) award('relics3'); if (journal.relic.length >= 15) award('relics15'); if (journal.wonder.length >= 5) award('wonders'); if (journal.fossil.length >= 5) award('fossils');
  const kindName = { relic: 'RELIC', fossil: 'FOSSIL', wonder: 'WONDER', note: "THE OLD PROSPECTOR'S NOTE", map: 'TREASURE MAP', cache: 'BURIED CACHE' }[e.kind];
  if (e.kind === 'map') { caption('X MARKS THE SPOT · CHECK YOUR MAP'); }
  if (e.kind === 'cache' && journal.cache.length >= 5) award('caches5');
  const f = $('find');
  f.className = e.kind === 'note' ? 'note' : '';
  f.querySelector('.k').textContent = (isNew ? 'NEW ' : '') + kindName + ' FOUND';
  f.querySelector('.n').textContent = e.kind === 'note' ? 'Scrawled in pencil:' : e.name;
  f.querySelector('.t').textContent = e.text;
  f.querySelector('.p').textContent = '+' + (e.pts || 0).toLocaleString() + (isNew ? ' · ADDED TO YOUR JOURNAL' : '');
  f.classList.remove('hidden');
  G.findT = e.kind === 'note' ? 7 : 4.5;
  A.play(e.kind === 'note' ? 'journal' : e.kind === 'fossil' ? 'fossil' : 'relic', { vol: 0.9 });
  if (e.kind !== 'note') A.overlay('discover', 0.85);
  // the prospector remarks on a relic or a wonder once per run at most, and only on one you have never found
  // (wonders sit near the start of most levels, so an every-time line repeated at the top of every level)
  const talk = (isNew || run.mode === 'playthrough') && (!run.auto || run.mode === 'playthrough');
  if (e.kind === 'relic') { if (talk && !run.saidRelic) { run.saidRelic = true; say('v_relic', 1.2); } R.cinematic(e.x, e.y + 1.2, 8.5, 3.2); slowmo(0.45, 1.4); }
  if (e.kind === 'wonder') {
    if (talk && !run.saidWonder) { run.saidWonder = true; say('v_wonder', 0.8); }
    // the camera tour of the room is for a wonder you are seeing for the first time
    if (isNew || run.mode === 'playthrough') { const room = W.finds.find((x) => x.kind === 'wonder'); R.cinematic((room && room.room ? room.room[0] + 8 : e.x), e.y + 4, 24, 5); slowmo(0.6, 2.5); }
  }
  if (e.kind === 'fossil' || e.kind === 'cache') { R.cinematic(e.x, e.y + 0.8, 9, 2.5); }
}
function slowmo(s, dur) { G.slow = s; G.slowT = dur; if (A.ctx) A.setRate(Math.max(0.6, s)); }
let popN = 0;
function popWorld(x, y, text, cls) {
  if (popN > 14) return;
  const [sx, sy, vis] = R.toScreen(x, y);
  if (!vis) return;
  const d = document.createElement('div'); d.className = 'pop ' + (cls || ''); d.textContent = text; d.style.left = sx + 'px'; d.style.top = sy + 'px';
  $('popups').appendChild(d); popN++;
  setTimeout(() => { d.remove(); popN--; }, 1200);
}
function popBanner(a, b) {
  const el = $('banner'); el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b;
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  clearTimeout(G.bannerT); G.bannerT = setTimeout(() => el.classList.add('hidden'), 2200);
}
function caption(t, death) { const c = $('caption'); c.textContent = t; c.className = death ? 'dc' : ''; c.classList.remove('hidden'); clearTimeout(G.capT); G.capT = setTimeout(() => c.classList.add('hidden'), 3200); }
// a coin (or gem) flies from the pickup to the gold counter
let flyN = 0;
function flyCoin(x, y, gem) {
  if (flyN > 10 || !document.body.animate) return;
  const [sx, sy, vis] = R.toScreen(x, y); if (!vis) return;
  const box = $('popups').getBoundingClientRect(), t = $('score').getBoundingClientRect();
  const tx = t.left - box.left + Math.min(40, t.width * 0.5), ty = t.top - box.top + t.height / 2;
  const mx = (sx + tx) / 2 + (Math.random() - 0.5) * 140, my = Math.min(sy, ty) - 50 - Math.random() * 70;
  const d = document.createElement('div'); d.className = 'coinfly' + (gem ? ' gem' : ''); $('popups').appendChild(d); flyN++;
  const a = d.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(0.5)`, opacity: 0.3 },
    { transform: `translate(${mx}px, ${my}px) scale(1.15)`, opacity: 1, offset: 0.42 },
    { transform: `translate(${tx}px, ${ty}px) scale(0.55)`, opacity: 0.85 },
  ], { duration: 640 + Math.random() * 140, easing: 'cubic-bezier(.4,0,.65,1)' });
  const done = () => { if (!d.isConnected) return; d.remove(); flyN--; bump(); };
  a.onfinish = done; setTimeout(done, 1200);
}
function bump() { const s = $('score'); s.classList.add('bump'); clearTimeout(G.bumpT); G.bumpT = setTimeout(() => s.classList.remove('bump'), 160); }

// ------------------------------------------------------------------ tips (first time you meet each thing)
const KEYN = () => I.lastKind === 'pad' ? { jump: 'A', pick: 'X', dyn: 'B', flare: 'Y', up: '↑', map: 'VIEW' } : I.lastKind === 'touch' ? { jump: 'JUMP', pick: 'PICK', dyn: 'TNT', flare: 'FLARE', up: 'drag ↑', map: '▦' } : { jump: 'SPACE', pick: 'J', dyn: 'L', flare: 'F', up: 'W / ↑', map: 'M' };
function tip(key, html, cond = true) {
  if (!cond || tipsSeen[key] || settings.tips !== 'on' || G.run?.auto) return false;
  if (performance.now() - (G.tipAt || -1e9) < (FIXED ? 0 : 4500)) return true;   // let the last tip be read first
  G.tipAt = performance.now();
  tipsSeen[key] = 1; store.set('tips', tipsSeen);
  const t = $('tut'); t.innerHTML = html; t.classList.remove('hidden');
  clearTimeout(G.tutT); G.tutT = setTimeout(() => t.classList.add('hidden'), 6500);
  return true;
}
function tips(W) {
  if (G.state !== 'play' || G.mode === 'demo') return;
  G.tipT += 1 / 10;
  const P = W.players[0], M = W.M, k = KEYN();
  const near = (kind, r) => { const cx = Math.floor(P.x), cy = Math.floor(P.y); for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) if (x >= 0 && y >= 0 && x < M.w && y < M.h && M.tiles[y * M.w + x] === kind) return true; return false; };
  if (P.inCage) return;
  tip('move', `Move with <kbd>A</kbd> <kbd>D</kbd>, jump with <kbd>${k.jump}</kbd>. Find the <b>lift down</b> at the bottom of the level.`, I.lastKind !== 'touch' || true)
  || tip('ladder', `Hold <kbd>${k.up}</kbd> on a ladder to climb. Ladders always catch a fall.`, near(T.LADDER, 2))
  || tip('soft', `Loose rubble: swing your <b>PICK</b> <kbd>${k.pick}</kbd> to clear it.`, near(T.SOFT, 2))
  || tip('hard', `A cracked boulder. Throw <b>DYNAMITE</b> <kbd>${k.dyn}</kbd> at it — then <b>run</b>, it hurts you too.`, near(T.HARD, 3))
  || tip('vein', `Gold glints in the rock: chip it out with the <b>PICK</b>.`, near(T.VEIN, 2))
  || tip('bat', `Bats! Swing the <b>PICK</b>, or throw a <b>FLARE</b> <kbd>${k.flare}</kbd> — they hate the light.`, W.bats.some((b) => b.st !== 'hang' && b.st !== 'dead' && Math.hypot(b.x - P.x, b.y - P.y) < 7))
  || tip('water', `Water breaks a fall. Swim up with <kbd>${k.up}</kbd> and jump out at the edge.`, near(T.WATER, 2))
  || tip('camp', `A <b>campfire</b>: light it to rest once (hearts and lamp refilled) and save your place.`, W.camps.some((c) => Math.hypot(c.x - P.x, c.y - P.y) < 5))
  || tip('oil', `Your lamp is burning low. Pick up <b>oil cans</b> to keep the dark away.`, P.oil < P.oilMax * 0.4)
  || tip('shade', `A <b>pale shade</b> comes for the dark. A <b>FLARE</b> melts it away.`, W.shades.some((s) => !s.dead))
  || tip('fossil', `Something is set in the rock here... dig it out with the <b>PICK</b>.`, W.finds.some((f) => f.kind === 'fossil' && !f.got && Math.hypot(f.x - P.x, f.y - P.y) < 4))
  || tip('key', `A key opens a locked gate somewhere in this level.`, P.keys.length > 0)
  || tip('xmap', `A <b>treasure map</b>! Find the red <b>X</b>, stand on it and swing your <b>PICK</b> down (<kbd>↓</kbd> + <kbd>${k.pick}</kbd>).`, !!W.mapFound)
  || tip('map', `Press <kbd>${k.map}</kbd> for the map of everywhere your lamp has been.`, G.levelT > 50);
}

// ------------------------------------------------------------------ HUD
let hudN = 0;
function hud(W) {
  const P = W.players[0];
  $('score').textContent = W.score.toLocaleString();
  const h = $('hearts');
  const want = P.maxHp + P.helmet;
  if (h.children.length !== want) { h.innerHTML = ''; for (let i = 0; i < want; i++) h.appendChild(document.createElement('i')); }
  [...h.children].forEach((el, i) => { el.className = i < P.maxHp ? (i < P.hp ? '' : 'off') : 'helm'; });
  $('lives').innerHTML = `×<b>${W.lives}</b>`;
  const oil = P.oil / P.oilMax;
  $('oil').querySelector('.bar i').style.width = Math.round(oil * 100) + '%';
  $('oil').classList.toggle('low', oil < 0.22);
  $('oil').querySelector('.lamp').classList.toggle('dim', oil <= 0);
  $('dyn').textContent = P.dyn; $('flr').textContent = P.flares;
  $('keyw').classList.toggle('hidden', !P.keys.length); $('keys').textContent = P.keys.length;
  $('timer').textContent = fmtT(W.t);
  const tot = { relic: 0, fossil: 0, wonder: 0, note: 0, cache: 0 }, got = { relic: 0, fossil: 0, wonder: 0, note: 0, cache: 0 };
  for (const f of W.finds) { if (!(f.kind in tot)) continue; tot[f.kind]++; if (f.got) got[f.kind]++; }
  const sym = { relic: '◆', fossil: '❂', wonder: '✧', note: '✎', cache: '✕' };
  $('finds').innerHTML = Object.keys(tot).filter((k) => tot[k]).map((k) => `<span class="${got[k] >= tot[k] ? 'all' : ''}">${sym[k]} <b>${got[k]}/${tot[k]}</b></span>`).join('') + (W.isBoss ? '' : ` <span>SEEN <b>${W.openCells ? Math.round(W.stats.seen / W.openCells * 100) : 0}%</b></span>`);
  if (W.boss) $('bossbar').querySelector('.bar i').style.width = Math.max(0, W.boss.hp / W.boss.maxHp * 100) + '%';
  if (++hudN % 3 === 0) drawMini(W);
}
function drawMini(W) {
  const cv = $('mini'), c = cv.getContext('2d'), M = W.M, P = W.players[0];
  const s = 2, vw = cv.width / s, vh = cv.height / s;
  const x0 = Math.floor(P.x - vw / 2), y0 = Math.floor(P.y - vh / 2);
  c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(0, 0, cv.width, cv.height);
  for (let yy = 0; yy < vh; yy++) for (let xx = 0; xx < vw; xx++) {
    const x = x0 + xx, y = y0 + yy;
    if (x < 0 || y < 0 || x >= M.w || y >= M.h) continue;
    const i = y * M.w + x; if (!M.seen[i]) continue;
    const t = M.tiles[i];
    if (t === T.ROCK) continue;
    c.fillStyle = t === T.WATER ? '#1f5a78' : t === T.LAVA ? '#b03010' : t === T.LADDER ? '#8a6a3a' : t === T.VEIN ? '#c89a30' : (t === T.SOFT || t === T.HARD) ? '#5a4a3a' : '#3a2f24';
    c.fillRect(xx * s, (vh - 1 - yy) * s, s, s);
  }
  const pt = (x, y, col) => { const sx = (x - x0) * s, sy = (vh - (y - y0)) * s; if (sx < 0 || sy < 0 || sx > cv.width || sy > cv.height) return; c.fillStyle = col; c.fillRect(sx - 2, sy - 2, 4, 4); };
  if (M.exit && M.seen[M.exit.y * M.w + Math.floor(M.exit.x)]) pt(M.exit.x, M.exit.y + 0.5, '#7dff9a');
  for (const f of W.finds) if (!f.got && f.kind !== 'cache' && M.seen[Math.floor(f.y) * M.w + Math.floor(f.x)]) pt(f.x, f.y + 0.5, '#c08aff');
  const cache = W.mapFound && W.finds.find((f) => f.kind === 'cache' && !f.got);
  if (cache) { const sx = (cache.x - x0) * s, sy = (vh - (cache.y + 1 - y0)) * s; c.strokeStyle = '#ff4a30'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx - 4, sy - 4); c.lineTo(sx + 4, sy + 4); c.moveTo(sx + 4, sy - 4); c.lineTo(sx - 4, sy + 4); c.stroke(); }
  pt(P.x, P.y + 0.8, '#ffd27a');
}
function touchUI() {
  const on = I.touchOn && G.state === 'play' && G.mode !== 'demo' && !(G.run && G.run.auto);
  $('touch').classList.toggle('hidden', !on);
  $('tb-pause').classList.toggle('hidden', !(G.state === 'play' && G.mode !== 'demo'));
  $('tb-map').classList.toggle('hidden', !(G.state === 'play' && G.mode !== 'demo' && !G.W?.isBoss));
}
let musX = null;
addEventListener('pointerdown', (e) => { if (G.state === 'museum' && !e.target.closest('button, .card')) musX = e.clientX; });
addEventListener('pointerup', (e) => { if (G.state === 'museum' && musX !== null) { const dx = e.clientX - musX; if (Math.abs(dx) > 40) museumGo(dx < 0 ? 1 : -1); } musX = null; });
I.stickUI = (s) => { const el = $('stick'); if (!s) { el.classList.remove('on'); return; } el.classList.add('on'); el.style.left = s.sx + 'px'; el.style.top = s.sy + 'px'; const i = el.querySelector('i'); i.style.transform = `translate(${s.x - s.sx}px, ${s.y - s.sy}px)`; };

// ------------------------------------------------------------------ demo (attract) and AI playthrough
const DEMO_LEVELS = [[0, 1], [1, 0], [2, 1], [0, 3], [3, 0], [1, 3], [4, 1], [2, 3], [3, 2], [4, 0]];
let demoI = Math.floor(Math.random() * DEMO_LEVELS.length);
function startDemo() {
  const [d, l] = DEMO_LEVELS[demoI++ % DEMO_LEVELS.length];
  A.unlock();
  startCampaign(d, { level: l, mode: 'demo', auto: 'demo', diff: 'normal', seed: (Date.now() & 0xffff) + demoI });
  G.mode = 'demo'; G.demoT = 0;
  $('demo-badge').classList.remove('hidden');
  touchUI();
}
function endDemo() {
  $('demo-badge').classList.add('hidden');
  toTitle();
}
function toTitle() {
  A.hush(); A.stopLoops();
  G.state = 'title'; G.mode = 'title'; G.run = null; G.replay = null;
  $('hud').classList.add('hidden'); $('bossbar').classList.add('hidden'); $('demo-badge').classList.add('hidden'); $('letterbox').classList.add('hidden'); $('find').classList.add('hidden'); $('tut').classList.add('hidden');
  // a quiet scene behind the title: the copper workings in lamp light
  const W = makeWorld({ seed: 1234, mode: 'campaign', diff: 'normal', depth: 0, level: 0 });
  W.cage.state = 'landed'; W.players[0].inCage = false; W.players[0].y = W.M.start.y;
  G.W = W; R.load(W);
  G.idleT = 0;
  show('title');
  A.playMusic('title');
  touchUI();
}

// ------------------------------------------------------------------ the loop
function tick(dt) {
  I.pollPads();
  const W = G.W;
  if (!W) return;
  const playing = G.state === 'play' && !G.paused;
  // slow motion
  if (G.slowT > 0) { G.slowT -= dt; if (G.slowT <= 0) { G.slow = 1; if (A.ctx) A.setRate(1); } }
  if (G.state === 'museum') { R.museumFrame(dt, G.museumSel); return; }
  if (G.replay) {
    const evs = G.replay.advance(dt * 0.6);
    for (const e of evs) { R.event(e, G.replay.W); if (SND[e.k] && SND[e.k][0] && A.ctx) A.play(SND[e.k][0], { x: e.x, y: e.y, vol: SND[e.k][1] * 0.8 }); }
    R.frame(G.replay.W, dt, {});
    if (G.replay.done) endReplay();
    return;
  }
  if (playing) {
    G.acc += dt * G.slow;
    let n = 0;
    while (G.acc >= STEP && n < 12) {
      const P = W.players[0];
      if (G.ap) P.input = G.ap.control(W); else P.input = I.control();
      if (G.campPress > 0) { P.input.camp = G.campPress === 2; G.campPress--; }
      rec.tick(W); rec.input(W);
      step(W, STEP);
      for (const e of drainEvents(W)) onEvent(e);
      G.acc -= STEP; n++;
      if (W.clear || W.over) break;
    }
    if (n >= 12) G.acc = 0;
    G.levelT += dt;
    if (W.clear && W.clearT > (W.isBoss ? 0.3 : 0.2) && G.state === 'play') { if (G.mode === 'demo') endDemoLevel(); else levelDone(); }
    if (W.over && G.state === 'play') {
      if (G.mode === 'demo') endDemoLevel();
      else if (G.run.mode === 'playthrough') { G.state = 'between'; setTimeout(() => { G.run.carry = { up: G.run.up }; loadLevel(); }, FIXED ? 0 : 2500); }
      else { G.state = 'between'; setTimeout(gameOver, FIXED ? 0 : 2200); }
    }
    if (G.mode === 'demo') { G.demoT += dt; if (G.demoT > 70) endDemoLevel(); }
    if (G.findT > 0) { G.findT -= dt; if (G.findT <= 0) $('find').classList.add('hidden'); }
    if (Math.floor(G.levelT * 10) !== Math.floor((G.levelT - dt) * 10)) tips(W);
    hud(W);
    if (A.ctx) {
      A.setListener(R.camera);
      const fl = W.flares.find((f) => !f.dead);
      if (fl) { A.loop('flare', 'flareloop', 0.4); A.setLoop('flare', fl.x, fl.y, 0, 1); } else A.setLoop('flare', 0, 0, 0, 0);
    }
  } else if (G.state === 'title') {
    G.idleT += dt;
    if (G.idleT > 14 && G.screen === 'title' && !Q.has('test')) startDemo();
  }
  // draw the world as it is NOW (the tick may have just started a new level, e.g. the demo into a guardian lair)
  const Wn = G.W;
  const titleCam = G.state === 'title' ? { x: Wn.M.start.x + 3, y: Wn.M.start.y + 1.5, d: 12 } : null;
  R.frame(Wn, dt, { title: titleCam, desat: G.state === 'results' ? 0.4 : 0 });
}
function endDemoLevel() {
  G.state = 'between';
  $('fade').classList.add('on');
  setTimeout(() => { $('fade').classList.remove('on'); if (G.mode === 'demo') { if (demoI % 3 === 0) endDemo(); else startDemo(); } }, FIXED ? 0 : 700);
}
function startReplay() {
  if (!G.clip) return;
  const c = G.clip;
  G.replay = new Replay(cloneWorld(c.snap), c.inputs, c.keyN, c.endN);
  G.prevScreen = G.screen;
  for (const s of SCREENS) $(s).classList.add('hidden');
  $('letterbox').classList.remove('hidden');
  R.load(G.replay.W);
  A.play('rewind', { vol: 0.6 });
}
function endReplay() {
  G.replay = null;
  $('letterbox').classList.add('hidden');
  R.load(G.W);
  show(G.prevScreen || 'title');
}

let last = performance.now();
function raf(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!FIXED) tick(dt);
  requestAnimationFrame(raf);
}

// ------------------------------------------------------------------ UI wiring
function act(a, el) {
  A.unlock();
  if (a !== 'back') A.play('uiok', { vol: 0.5 });
  switch (a) {
    case 'campaign': startCampaign(0); break;
    case 'depths': show('depths', true); break;
    case 'endless': startEndless(); break;
    case 'playthrough': startCampaign(0, { mode: 'playthrough', auto: 'demo' }); break;
    case 'journal': show('journal', true); break;
    case 'museum': openMuseum(); break;
    case 'locker': if (G.state === 'museum') { G.lockerFromMuseum = true; } show('locker', G.state !== 'museum'); break;
    case 'mus-prev': museumGo(-1); break;
    case 'mus-next': museumGo(1); break;
    case 'scores': show('scores', true); break;
    case 'medals': show('medals', true); break;
    case 'options': show('options', true); break;
    case 'help': show('help', true); break;
    case 'back': back(); break;
    case 'next': nextFromShop(); break;
    case 'replay': startReplay(); break;
    case 'continue': continueRun(); break;
    case 'done': toTitle(); break;
    case 'resume': resume(); break;
    case 'map': if (G.W && !G.W.isBoss) { if (G.state === 'play') pause(); show('map', true); } break;
    case 'quit': toTitle(); break;
    case 'camp': resume(); G.campPress = 2; break;
    case 'reload': location.reload(); break;
  }
}
function pause() { if (G.state !== 'play' || G.mode === 'demo') return; G.state = 'paused'; G.paused = true; $('pause-sub').textContent = $('depth-name').textContent + ' · ' + $('level-name').textContent; $('pause-replay').classList.toggle('hidden', !G.clip); $('pause-camp').classList.toggle('hidden', !!G.W.boss); A.muffle(true); show('pause'); }
function resume() { if (G.state !== 'paused') return; G.state = 'play'; G.paused = false; I.taps.clear(); A.muffle(false); for (const s of SCREENS) $(s).classList.add('hidden'); G.screen = null; document.body.classList.remove('paused'); }
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (b) { act(b.dataset.act, b); return; }
  const o = e.target.closest('[data-opt] button');
  if (o) { const k = o.parentElement.dataset.opt; settings[k] = o.dataset.v; saveSettings(); applySettings(); A.play('uimove', { vol: 0.5 }); if (k === 'quality') $('q-reload').classList.remove('hidden'); if (k === 'touch') touchUI(); return; }
  const jt = e.target.closest('[data-jt]'); if (jt) { jTab = jt.dataset.jt; drawJournal(); A.play('journal', { vol: 0.5 }); return; }
  const eqb = e.target.closest('[data-eq]'); if (eqb) { const [kind, key] = eqb.dataset.eq.split(':'); equip(kind, key); return; }
  const tb = e.target.closest('[data-tab]'); if (tb) { hsTab = tb.dataset.tab; drawScores(); return; }
  const hd = e.target.closest('[data-hd]'); if (hd) { hsDiff = hd.dataset.hd; drawScores(); return; }
  const ib = e.target.closest('[data-ini]'); if (ib) { const i = +ib.dataset.ini, d = +ib.dataset.d; ini[i] = String.fromCharCode(((ini[i].charCodeAt(0) - 65 + d + 26) % 26) + 65); iniPos = i; drawIni(); return; }
});
document.addEventListener('input', (e) => { const r = e.target.closest('[data-set]'); if (r) { settings[r.dataset.set] = +r.value; saveSettings(); applySettings(); } });
I.on('tap', (k) => { if (k === 'pause') { if (G.state === 'play') pause(); else if (G.state === 'paused') resume(); } if (k === 'map') act('map'); });
I.on('pause', () => { if (G.state === 'museum') { if (G.screen === 'locker') back(); else toTitle(); return; } if (G.replay) { endReplay(); return; } if (G.state === 'play') pause(); else if (G.state === 'paused' && G.screen === 'pause') resume(); else if (G.screen && G.screen !== 'title' && G.screen !== 'results' && G.screen !== 'shop') back(); });
I.on('map', () => { if (G.state === 'play' && G.mode !== 'demo') act('map'); else if (G.screen === 'map') back(); });
I.on('any', () => { G.idleT = 0; if (G.mode === 'demo') endDemo(); });
I.on('back', () => { if (G.screen && !['title', 'results', 'shop'].includes(G.screen)) back(); });
// keyboard / pad menu navigation
function menuItems() { const scr = G.screen && $(G.screen); if (!scr) return []; return [...scr.querySelectorAll('.mbtn:not(.hidden):not([disabled]), .upg, .sec:not([disabled])')].filter((b) => b.offsetParent); }
I.on('key', (k, e) => {
  if (G.screen === 'results' && iniOpen) {
    if (e && /^Key[A-Z]$/.test(k)) { ini[iniPos] = k.slice(3); iniPos = Math.min(2, iniPos + 1); drawIni(); return; }
    if (k === 'ArrowUp' || k === 'ArrowDown') { const d = k === 'ArrowUp' ? 1 : -1; ini[iniPos] = String.fromCharCode(((ini[iniPos].charCodeAt(0) - 65 + d + 26) % 26) + 65); drawIni(); return; }
    if (k === 'ArrowLeft') { iniPos = Math.max(0, iniPos - 1); drawIni(); return; }
    if (k === 'ArrowRight') { iniPos = Math.min(2, iniPos + 1); drawIni(); return; }
    if (k === 'Enter' || k === 'Space') { submitIni(); return; }
    if (k === 'Backspace') { iniPos = Math.max(0, iniPos - 1); drawIni(); return; }
  }
  if (!G.screen || G.state === 'play') return;
  if (G.screen === 'locker' && (k === 'Escape' || k === 'Backspace')) { back(); return; }
  if (G.screen === 'museum') { if (k === 'ArrowLeft' || k === 'KeyA') museumGo(-1); else if (k === 'ArrowRight' || k === 'KeyD') museumGo(1); else if (k === 'Escape' || k === 'Backspace' || k === 'Enter') toTitle(); return; }
  const items = menuItems(); if (!items.length) return;
  let i = items.findIndex((b) => b.classList.contains('sel'));
  if (k === 'ArrowDown' || k === 'ArrowRight') i = (i + 1) % items.length;
  else if (k === 'ArrowUp' || k === 'ArrowLeft') i = (i - 1 + items.length) % items.length;
  else if (k === 'Enter' || k === 'Space') { if (i >= 0) items[i].click(); return; }
  else return;
  items.forEach((b) => b.classList.remove('sel')); items[i].classList.add('sel'); items[i].scrollIntoView({ block: 'nearest' }); A.play('uimove', { vol: 0.35 });
});
I.on('confirm', () => { const items = menuItems(); const s = items.find((b) => b.classList.contains('sel')); if (s) s.click(); else if (G.screen === 'results' && iniOpen) submitIni(); });

// ------------------------------------------------------------------ boot
async function boot() {
  await R.loadDigger();
  applySettings();
  toTitle();
  checkUnlocks(true); applyLoadout();
  $('loading').style.opacity = 0; setTimeout(() => $('loading').remove(), 700);
  if (Q.has('test')) { const T2 = await import('./tests.js?v=13'); T2.run({ G, R, startCampaign, startEndless, toTitle, tick, makeWorld, step }); return; }
  if (Q.has('autoplay')) startCampaign(+(Q.get('depth') || 0), { mode: 'autoplay', auto: 'demo', level: +(Q.get('level') || 0) });
  if (Q.has('playthrough')) startCampaign(+(Q.get('depth') || 0), { mode: 'playthrough', auto: 'demo', level: +(Q.get('level') || 0) });
  requestAnimationFrame(raf);
}
// test hooks: tick(n) runs n frames at dt (drawing the last), plus helpers to start things
Object.assign(window.__gd, {
  unlocks: () => unlocks, loadout, checkUnlocks, applyLoadout, equip,
  tick(n = 1, dt = 1 / 60, draw = true) { for (let i = 0; i < n; i++) { const d = draw || i === n - 1; if (!d) { const R0 = R.frame; R.frame = () => {}; tick(dt); R.frame = R0; } else tick(dt); } },
  startCampaign, startEndless, toTitle, startDemo, pause, resume, act, show,
  auto(p = 'human') { if (G.run) { G.run.auto = p; G.ap = new Autopilot(p, 7); } },
});
Object.defineProperty(window.__gd, 'W', { get: () => G.W });
boot();
