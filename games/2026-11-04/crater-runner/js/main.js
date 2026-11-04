// Crater Runner — game flow, menus, HUD, commentary, demo director and the frame loop.
import { VERSION, SECTORS, STEP, F, UPGRADES, UP_KEYS, UP_COST, MEDALS, parTime, TYPICAL_UP, START_LIVES } from './config.js?v=2';
import { makeWorld, step, drainEvents, cpLetter, segCount } from './sim.js?v=2';
import { Autopilot } from './ai.js?v=2';
import { Renderer, pickQuality, CALM } from './render.js?v=2';
import { Audio } from './audio.js?v=2';
import { Input } from './input.js?v=2';
import { Scores, NO_POST } from './scores.js?v=2';
import { Recorder, Replay } from './replay.js?v=2';
import { Online, ROOM, randomCode, cleanCode } from './online.js?v=2';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ------------------------------------------------------------------ settings + saved progress
const SKEY = 'cr.settings.v1';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const settings = { music: 50, sfx: 90, voice: 100, talk: 'on', flash: reduceMotion ? 'reduced' : 'full', shake: '1', rumble: 'on', touch: 'auto', quality: 'auto', netRoute: '0' };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch { /* defaults */ }
const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch { /* private mode */ } };
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const medals = new Set(load('cr.medals.v1', []));
const best = load('cr.best.v1', {});
let reach = load('cr.reach.v1', 0);
const applyCalm = () => { CALM.on = settings.flash === 'reduced'; };
applyCalm();

const quality = pickQuality(params.get('q') || (settings.quality !== 'auto' ? settings.quality : null));
const R = new Renderer($('gl'), quality);
const A = new Audio('./');
const I = new Input();
const HS = new Scores('crater-runner');
const HSL = new Scores('crater-runner-longhaul');
const REC = new Recorder();
const NET = new Online({ status: netStatus, joined: netJoined, start: (cfg) => startOnline(cfg), left: netLeft, chat: () => {} },
  { relay: params.get('relay') || undefined, lag: +params.get('netlag') || 0 });

const G = {
  state: 'boot', mode: 'title', W: null, ai: null, acc: 0, timeScale: 1, slowT: 0, idleT: 0, run: null, clip: null, pendingClip: null, replay: null,
  afterReplay: null, demoI: 0, demoT: 0, says: new Map(), screen: null, back: [], ini: null, scenic: null, fade: 0, lastKey: 0, frameT: [], capT: 0,
  hudCache: {}, tutT: 0, bannerT: 0, lookFade: 0, autopilot: params.has('autoplay'), fixed: params.has('fixed'), lastLife: false, warnQ: 0,
};
window.__cr = { G, R, A, I, NET, REC, settings, VERSION };

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
  if (A.say('v_' + name, { priority: !!o.key, delay: o.delay })) { G.says.set(name, t); lastLine = t; (window.__cr.lines ||= []).push([t, name]); }
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
  const items = [...$(G.screen).querySelectorAll('.mbtn:not(.hidden):not([disabled]), .sec:not([disabled]), .upg, .seg button, [data-tab]')].filter((e) => e.offsetParent);
  if (!items.length) return;
  let i = items.indexOf(selEl);
  if (i < 0) i = 0; else {
    // spatial: nearest item in the pressed direction
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
  G.state = 'title'; G.mode = 'title'; G.idleT = 0;
  hideScreens(); show('title', false);
  $('ver').textContent = VERSION;
  $('title-best').textContent = `BEST ${Math.max(HS.best(), 0).toLocaleString()}`;
  $('med-sub').textContent = `${medals.size} / ${MEDALS.length}`;
  $('sel-sub').textContent = reach > 0 ? `Sectors 1 to ${reach + 1} open` : 'Clear sector 1 to open more';
  $('demo-badge').classList.add('hidden');
  setHud(false);
  scenic(G.demoI % 5);
  A.playMusic('title');
}
function scenic(look) {
  const W = makeWorld({ mode: 'campaign', sector: look, seed: 3, demo: true, lives: 9 });
  W.pending = []; W.segGen = 999; W.safeT = 1e9;
  G.scenic = W; G.W = W; G.ai = null;
  R.setLook(look);
  R.updateCamera(0.016, { x: W.rovers[0].x, y: W.rovers[0].y, vx: 6 }, { snap: true, cine: true });
}

// ------------------------------------------------------------------ starting play
function stopPlay() {
  A.stopLoops();
  G.replay = null; G.ai = null; G.timeScale = 1; A.setRate(1);
  $('letterbox').classList.add('hidden'); $('bossbar').classList.add('hidden'); $('tut').classList.add('hidden'); $('banner').classList.add('hidden'); $('caption').classList.add('hidden');
  $('warns').innerHTML = ''; WM.length = 0;
}
function newSeed() { return params.has('seed') ? +params.get('seed') : (Math.random() * 1e9) | 0; }
function startCampaign(sector = 0) {
  G.run = { score: 0, lives: START_LIVES, up: sector ? { ...TYPICAL_UP[sector] } : {}, salvage: sector ? 400 * sector : 0, start: sector, newMedals: [] };
  say('begin', { key: true, delay: 0.6 });
  beginSector(sector);
}
function beginSector(s) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed: newSeed(), up: G.run.up, lives: G.run.lives, score: G.run.score, cp: +params.get('cp') || 0, demo: !!G.run.ai });
  G.run.sector = s; G.run.score0 = G.run.score;
  G.mode = G.run.ai ? 'playthrough' : 'campaign';
  enterPlay(W);
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 3);
  if (s > 0) say('s' + (s + 1), { key: true, delay: 1 });
}
// AI PLAYTHROUGH: the demo autopilot drives the whole campaign, picks its own upgrades between
// sectors and retries a sector if it ever runs out of rovers. Nothing it does counts for scores or medals.
const AI_SHOP = ['cannon', 'shield', 'flak', 'springs', 'cannon', 'radar', 'shield', 'cannon', 'flak', 'springs'];
function startPlaythrough() {
  G.run = { score: 0, lives: START_LIVES + 2, up: {}, salvage: 0, start: 0, newMedals: [], ai: true, tries: 0 };
  beginSector(+params.get('sector') || 0);
  caption('AI PLAYTHROUGH: THE AUTOPILOT DRIVES ALL FIVE SECTORS. PRESS ESC OR PAUSE TO STOP', 6);
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
function startLongHaul() {
  G.run = { score: 0, lives: START_LIVES, up: {}, start: 0, newMedals: [] };
  G.mode = 'longhaul';
  enterPlay(makeWorld({ mode: 'longhaul', seed: newSeed() }));
  banner('LONG HAUL', 'HOW FAR CAN YOU GO', 3);
  say('longhaul', { key: true, delay: 0.8 });
}
function startDemo() {
  const s = G.demoI++ % 5;
  const seed = newSeed();
  // start a few checkpoints in so the boss shows up within the minute, with upgrades fitted to show them off
  const up = { ...TYPICAL_UP[s], flak: Math.max(1, TYPICAL_UP[s].flak || 0), cannon: Math.max(1, TYPICAL_UP[s].cannon || 0) };
  const W = makeWorld({ mode: 'campaign', sector: s, seed, demo: true, cp: Math.max(0, SECTORS[s].cps.length - 2), up, lives: 9 });
  G.mode = 'demo';
  enterPlay(W);
  G.ai = new Autopilot(seed, 'demo');
  G.demoT = 0; G.demoStartT = performance.now();
  banner(`SECTOR ${s + 1}`, SECTORS[s].name, 2.5);
  caption(`DEMO · ${SECTORS[s].name} · UPGRADES FITTED: ${UP_KEYS.filter((k) => up[k]).map((k) => UPGRADES[k].name).join(', ')}`, 5);
}
function enterPlay(W) {
  stopPlay();
  G.W = W; G.state = 'play'; G.acc = 0; G.clip = null; G.pendingClip = null; G.lastLife = false;
  if (!G.ai && G.autopilot && G.mode !== 'online') G.ai = new Autopilot(W.seed, 'demo');
  REC.reset();
  if (G.mode === 'playthrough') G.ai = new Autopilot(W.seed, 'demo');
  hideScreens();
  setHud(true);
  const watch = G.mode === 'demo' || G.mode === 'playthrough';
  $('demo-badge').classList.toggle('hidden', !watch);
  $('demo-badge').innerHTML = G.mode === 'playthrough' ? '<span>AI PLAYTHROUGH</span> · ESC TO STOP' : '<span>DEMO</span> · PRESS ANY KEY';
  R.setLook(W.k);
  const r = W.rovers[0];
  R.updateCamera(0.016, { x: r.x, y: r.y, vx: r.vx }, { snap: true });
  A.playMusic(W.mode === 'longhaul' ? SECTORS[W.k].music : SECTORS[W.sector].music);
  for (const rv of W.rovers) { A.loop('engine' + rv.id, 'engine', rv.id === 1 ? 0.55 : 0.4); A.loop('tyres' + rv.id, 'tyres', 0.45); }
  A.loop('flyer', 'flyer', 0.5); A.loop('drone', 'drone', 0.45); A.loop('tank', 'tankmove', 0.5);
  buildStrip(W);
  G.idleT = 0;
}

// ------------------------------------------------------------------ HUD
function setHud(on) {
  $('hud').classList.toggle('hidden', !on);
  const touch = settings.touch === 'on' || (settings.touch === 'auto' && I.isTouch);
  $('touch').classList.toggle('hidden', !on || !touch || G.mode === 'demo' || G.mode === 'playthrough');
  $('tb-pause').classList.toggle('hidden', !on || G.mode === 'demo');
  if (!on) { $('bossbar').classList.add('hidden'); $('warns').innerHTML = ''; WM.length = 0; }
}
function buildStrip(W) {
  const el = $('cpstrip');
  if (W.mode === 'longhaul') { el.innerHTML = ''; $('sector-name').textContent = 'LONG HAUL'; return; }
  const cps = SECTORS[W.sector].cps;
  el.innerHTML = [...cps].map((c) => `<b>${c}</b>`).join('') + '<b class="boss">☠</b>';
  $('sector-name').textContent = `SECTOR ${W.sector + 1} · ${SECTORS[W.sector].name}`;
}
const fmtT = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
function setText(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).textContent = v; } }
function setHTML(id, v) { if (G.hudCache[id] !== v) { G.hudCache[id] = v; $(id).innerHTML = v; } }
function updateHud(W) {
  setText('score', W.score.toLocaleString());
  const board = W.mode === 'longhaul' ? HSL : HS;
  setText('hiscore', Math.max(board.best(), W.score).toLocaleString());
  setText('hi-lbl', W.mode === 'longhaul' ? 'BEST HAUL' : 'BEST');
  setHTML('lives', '<i></i>'.repeat(Math.min(8, Math.max(0, W.lives - 1))));
  const me = myRover(W);
  const maxSh = (W.R ? W.R.shield : 0) + (W.up.shield || 0);
  setHTML('shield', maxSh > 0 ? Array.from({ length: maxSh }, (_, i) => `<i class="${me && i < me.shield ? 'on' : ''}"></i>`).join('') : '');
  if (W.mode === 'longhaul') {
    setText('timer', `${Math.round(me ? me.x : 0).toLocaleString()} m · ${cpLetter(W, W.seg)} · ${fmtT(W.driveT)}`);
  } else {
    setText('timer', fmtT(W.secT));
    const kids = $('cpstrip').children;
    for (let i = 0; i < kids.length; i++) {
      const cls = i < W.seg ? 'done' : i === W.seg ? 'now' : '';
      const want = (i === kids.length - 1 ? 'boss ' : '') + cls;
      if (kids[i].className !== want) kids[i].className = want;
    }
  }
  const x0 = W.cpX[W.seg], x1 = W.cpX[W.seg + 1];
  const f = me && x1 > x0 ? Math.max(0, Math.min(1, (me.x - x0) / (x1 - x0))) : W.boss ? 1 : 0;
  $('cpbar').firstElementChild.style.width = (f * 100).toFixed(1) + '%';
  if (me) setText('speed-lbl', me.input.th < -0.3 ? '◀ SLOW' : me.input.th > 0.3 ? 'FAST ▶' : `${(me.vx * 3.6).toFixed(0)} KM/H`);
  const b = W.boss;
  $('bossbar').classList.toggle('hidden', !b || b.state === 'in');
  if (b) { setText('boss-name', (W.mode === 'longhaul' ? '' : '') + bossName(b.key)); $('bossbar').querySelector('i').style.width = Math.max(0, (b.hp / b.max) * 100).toFixed(1) + '%'; }
}
const bossName = (k) => ({ warden: 'GREY WARDEN', crawler: 'BASALT CRAWLER', lancer: 'RIME LANCER', excavator: 'THE EXCAVATOR', carrier: 'NIGHT CARRIER' }[k] || 'BOSS');
const myRover = (W) => (G.mode === 'online' && !NET.host ? W.rovers[1] : W.rovers[0]);

// edge markers for threats that are signalled but not on screen yet (red = ground, blue = air)
const WM = [];
const ICON = { crater: '◡', boulder: '⬤', wall: '▮', mine: '✱', tank: '▬', shell: '•', flyer: '▼', drone: '◆', bomb: '⬇' };
const P = { x: 0, y: 0, z: 0 };
function updateWarnings(W) {
  const me = myRover(W);
  const box = $('warns');
  const list = [];
  if (me && me.alive) {
    const warn = W.R.warn + (W.up.radar ? 0.4 : 0);
    const add = (e, type, x, y, air) => {
      if (!e.sig || x < me.x - 1) return;
      const tta = air ? 1 : (x - me.x - F.halfLen) / Math.max(1, me.vx);
      list.push({ id: e.id, type, x, y, air, tta, age: W.t - (e.sigT ?? W.t) });
    };
    for (const c of W.craters) if (c.kill && !c.bomb) add(c, 'crater', c.x - c.r, 0.3);
    for (const r of W.rocks) add(r, r.kind, r.x, r.top);
    for (const m of W.mines) add(m, 'mine', m.x, 0.4);
    for (const t of W.tanks) add(t, 'tank', t.x, 1.2);
    for (const s of W.shells) add(s, 'shell', s.x, s.y);
    for (const f of W.flyers) add(f, 'flyer', f.x, f.y, true);
    for (const d of W.drones) add(d, 'drone', d.x, d.y, true);
    list.sort((a, b) => a.tta - b.tta);
    list.length = Math.min(list.length, 7);
    for (const q of list) q.warn = warn;
  }
  while (WM.length < list.length) { const d = document.createElement('div'); box.appendChild(d); WM.push(d); }
  WM.forEach((d, i) => {
    const q = list[i];
    if (!q) { d.style.display = 'none'; return; }
    R.project(q.x, (q.air ? 0 : R.heightAt(q.x, 0)) + q.y, 0, P);
    const vw = innerWidth, vh = innerHeight;
    const off = P.x > vw - 30 || P.y < 60 || P.z > 1;
    d.style.display = '';
    if (off) {
      const x = Math.min(vw - 34, Math.max(34, P.x)), y = Math.min(vh - 90, Math.max(q.air ? 96 : 110, P.y));
      const f = q.air ? 1 : Math.max(0, Math.min(1, q.tta / q.warn));
      const html = `${ICON[q.type] || '!'}<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" stroke-dasharray="${(f * 150.8).toFixed(1)} 200"/></svg>`;
      if (d._h !== html) { d.innerHTML = html; d._h = html; }
      d.className = 'wm' + (q.air ? ' air' : '') + (!q.air && q.tta < 0.8 ? ' near' : '');
      d.style.left = x + 'px'; d.style.top = y + 'px';
    } else if (q.age < 1.8 && W.R.warn > 1.2) {
      // on screen: a bobbing "!" over it for the first moments (early sectors)
      if (d._h !== '!') { d.innerHTML = '!'; d._h = '!'; }
      d.className = 'ws';
      d.style.left = P.x + 'px'; d.style.top = (P.y - 18) + 'px';
    } else d.style.display = 'none';
  });
}

// banners, captions, popups, tutorial prompts
function banner(a, b, t = 2.2) {
  const el = $('banner');
  el.querySelector('.b1').textContent = a; el.querySelector('.b2').textContent = b || '';
  el.classList.remove('hidden', 'go'); void el.offsetWidth; el.classList.add('go');
  G.bannerT = t;
}
function caption(text, t = 4) { const el = $('caption'); el.textContent = text; el.classList.remove('hidden'); G.capT = t; }
function popup(text, x, y, color) {
  R.project(x, y, 0, P);
  const d = document.createElement('div');
  d.className = 'pop'; d.textContent = text; d.style.left = P.x + 'px'; d.style.top = P.y + 'px';
  if (color) d.style.color = color;
  $('popups').appendChild(d);
  setTimeout(() => d.remove(), 1200);
}
function keyName(what) {
  const k = I.lastKind;
  const m = {
    jump: { key: '<kbd>SPACE</kbd> / <kbd>↑</kbd>', pad: '<kbd>A</kbd>', touch: '<kbd>JUMP</kbd>' },
    fire: { key: '<kbd>X</kbd> / <kbd>J</kbd>', pad: '<kbd>X</kbd> / <kbd>RB</kbd>', touch: '<kbd>FIRE</kbd>' },
    speed: { key: '<kbd>←</kbd> <kbd>→</kbd> (or <kbd>A</kbd> <kbd>D</kbd>)', pad: 'the left stick', touch: '<kbd>SLOW</kbd> / <kbd>FAST</kbd>' },
  };
  return m[what][k] || m[what].key;
}
const TUT = {
  jump: () => `A crater ahead. Press ${keyName('jump')} to <b>JUMP</b> it, and hold it longer to jump higher.`,
  fire: () => `A boulder. ${keyName('fire')} <b>FIRES FORWARD</b>: blast it, or jump over it.`,
  up: () => `An attacker overhead. The same ${keyName('fire')} also <b>FIRES STRAIGHT UP</b>. Hit it as it passes over you.`,
  speed: () => `Use ${keyName('speed')} to <b>SLOW DOWN</b> or <b>SPEED UP</b>. Faster carries a jump further.`,
};
function tutorial(key) { if (G.mode === 'demo' || G.mode === 'playthrough' || !TUT[key]) return; const el = $('tut'); el.innerHTML = TUT[key](); el.classList.remove('hidden'); G.tutT = key === 'speed' ? 6 : 5.5; }

// ------------------------------------------------------------------ events from the simulation
function handleEvents(list, W, live) {
  const me = myRover(W);
  const near = (x) => (me ? Math.abs(x - me.x) : 0);
  for (const e of list) {
    switch (e.k) {
      case 'jump': A.play('jump', { x: e.x, y: e.y + 0.5, vol: 0.55 }); R.fx.dust(e.x - 1, e.y, 0, { n: 5, vx: -2, vy: 0.6, up: 0.8, jit: 1.6, s0: 0.4, s1: 1.6, life: 1.6, a: 0.35, grav: 1.2 }); if (live && e.rid === me?.id) rumble(0, 0.2, 50); break;
      case 'land': {
        const k = Math.min(1, e.imp / 6);
        A.play(k > 0.45 ? 'land' : 'landsoft', { x: e.x, y: e.y, vol: 0.3 + k * 0.6 });
        R.fx.dust(e.x, e.y, 0, { n: Math.round(3 + k * 10), vx: 0, vy: 0.5, up: 0.8 + k, jit: 2.2 + k * 2, s0: 0.5, s1: 1.8 + k * 1.6, life: 2 + k, a: 0.35 + k * 0.15, grav: 0.5, spread: 3 });
        if (k > 0.5) { R.addTrauma(0.12 * k * +settings.shake); if (live) rumble(0.35 * k, 0.4 * k, 110); }
        break;
      }
      case 'fire': {
        A.play('cannon', { x: e.x + 2, y: e.y + 1, vol: 0.42, gap: 0.05 });
        A.play('flak', { x: e.x, y: e.y + 2, vol: 0.3, gap: 0.05, delay: 0.02 });
        const v = R.views.rover.get(e.rid);
        if (v) { v.rec = 1; v.recU = 1; }
        const r = W.rovers.find((q) => q.id === e.rid);
        if (r) { R.fx.sparks(r.x + 2.3, r.y + 0.95 + MDR + r.p * 2, 0, { n: 4, speed: 4, s: 0.25, life: 0.15, vx: r.vx + 8 }); R.fx.sparks(r.x + 0.2, r.y + 2.3 + MDR, 0, { n: 3, speed: 3, s: 0.22, life: 0.12, vy: 6 }); }
        break;
      }
      case 'hit': A.play(e.what === 'tank' ? 'shellhit' : 'rockhit', { x: e.x, y: e.y, vol: 0.6 }); R.fx.sparks(e.x, e.y, 0, { n: 6, speed: 5, vx: -3 }); R.fx.dust(e.x, e.y, 0, { n: 2, s0: 0.3, s1: 1.2, life: 1.2, a: 0.3, jit: 1 }); break;
      case 'rock': {
        const wall = e.kind === 'wall';
        A.play(wall ? 'wallbreak' : 'rockcrack', { x: e.x, y: e.y, vol: wall ? 0.9 : 0.75 });
        R.fx.debris(e.x, e.y, 0, { n: wall ? 26 : e.big ? 16 : 10, speed: wall ? 6 : 5, size: wall ? 0.3 : 0.2, vx: e.by === 'shot' ? 2 : -2 });
        R.fx.dust(e.x, e.y - 0.3, 0, { n: wall ? 18 : 10, s0: 0.8, s1: wall ? 4 : 2.8, life: 4.5, vy: 0.5, up: 1.2, jit: 2.5, a: 0.5, drag: 0.8, grav: 0.03, spread: 1.4 });
        R.fx.flash(e.x, e.y, 0, 6, 0xffd8a8, 0.2);
        if (live && e.by === 'shot') popup(`+${wall ? 250 : e.big ? 200 : 100}`, e.x, e.y + 1.4);
        if (e.by === 'rammed') R.addTrauma(0.3 * +settings.shake);
        break;
      }
      case 'boom': {
        const s = e.size || 1;
        const metal = e.what !== 'bomb' && e.what !== 'shell';
        A.play(s > 1.7 ? 'boomM' : 'boomS', { x: e.x, y: e.y, vol: 0.85 });
        if (metal) A.play('debris', { x: e.x, y: e.y, vol: 0.35, delay: 0.25 });
        R.fx.explode(e.x, e.y, 0, s, { metal, vx: e.vx ? e.vx * 0.5 : 0, rock: e.y - R.heightAt(e.x, 0) < 2 });
        R.addTrauma((0.1 + 0.1 * s) * +settings.shake * (near(e.x) < 15 ? 1 : 0.4));
        if (live && e.kill) popup(`+${{ tank: 300, flyer: 200, drone: 250, bomb: 50, shell: 50 }[e.what] || 50}`, e.x, e.y + 1, e.what === 'flyer' || e.what === 'drone' ? '#9fd8ff' : null);
        break;
      }
      case 'mine': A.play('mineboom', { x: e.x, y: e.y, vol: 1 }); R.fx.explode(e.x, e.y + 0.3, 0, 1.6, { metal: false }); break;
      case 'crash': {
        A.play('crash', { x: e.x, y: e.y, vol: 1 });
        R.fx.explode(e.x, e.y, 0, 2.4, { metal: true, vx: (e.vx || 0) * 0.4 });
        R.fx.debris(e.x, e.y, 0, { metal: true, n: 14, speed: 7, size: 0.35, vx: (e.vx || 0) * 0.5, trail: true });
        R.flashScreen(0.35, 0xffc890);
        R.addTrauma(0.75 * +settings.shake);
        if (live) {
          if (e.rid === me?.id) { rumble(1, 1, 520); slowmo(0.4, 0.7); }
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'death' };
          if (W.lives === 1 && !G.lastLife) { G.lastLife = true; say('lastlife', { chance: 0.8, delay: 2.6 }); }
        }
        break;
      }
      case 'shield': A.play('shieldhit', { x: e.x, y: e.y, vol: 0.9 }); R.fx.ring(e.x, R.heightAt(e.x, 0), 0, 4, 0x9fd8ff); R.fx.sparks(e.x, e.y, 0, { n: 14, speed: 6, r: 0.6, g: 0.85, b: 1 }); if (live) { rumble(0.5, 0.6, 200); popup(e.left ? `SHIELD ${e.left} LEFT` : 'SHIELD GONE', e.x, e.y + 2, '#9fd8ff'); } break;
      case 'saved': A.play('shieldhit', { x: e.x, vol: 0.6 }); R.fx.ring(e.x, R.heightAt(e.x, 0), 0, 3, 0x9fd8ff); if (live) popup('SAFE · KEEP GOING', e.x, 3, '#9fd8ff'); break;
      case 'cp':
        A.play('checkpoint', { vol: 0.8 });
        if (live) {
          banner(`CHECKPOINT ${e.letter}`, e.bonus ? `+${e.bonus} TIME BONUS` : '', 1.8);
          if (W.mode === 'campaign' && e.i === Math.ceil(segCount(W) / 2)) say('halfway', { chance: 0.5, delay: 1 });
          if (W.mode === 'longhaul' && R.lookI !== W.k) G.lookFade = 1;
        }
        break;
      case 'restart': if (live) { banner(`RESTART · ${e.letter}`, `${W.lives} ROVER${W.lives === 1 ? '' : 'S'} LEFT`, 2); R.rebuildGround(true); const r = W.rovers[0]; R.updateCamera(0.016, { x: r.x, y: r.y, vx: r.vx }, { snap: true }); } break;
      case 'spawn': A.play('spawn', { x: e.x, vol: 0.7 }); R.fx.ring(e.x, R.heightAt(e.x, 0), 0, 3, 0x9fd8ff); break;
      case 'bombdrop': A.play('bomb', { x: e.x, y: e.y, vol: 0.55, gap: 0.12 }); break;
      case 'bombland': A.play('bombhit', { x: e.x, y: e.y, vol: e.crater ? 1 : 0.7 }); R.fx.explode(e.x, e.y + 0.3, 0, e.crater ? 1.8 : 1.1, { metal: false }); R.addTrauma(0.2 * +settings.shake); break;
      case 'shell': A.play('tankfire', { x: e.x, y: e.y, vol: e.boss ? 0.9 : 0.7 }); R.fx.sparks(e.x - 0.4, e.y, 0, { n: 6, speed: 4, vx: -6 }); R.fx.dust(e.x, e.y, 0, { n: 3, s0: 0.4, s1: 1.5, life: 1.5, a: 0.35, vx: -1 }); break;
      case 'mortar': A.play('tankfire', { x: e.x, y: e.y, vol: 0.9, rate: 0.8 }); break;
      case 'throw': A.play('rockcrack', { x: e.x, y: 1, vol: 0.6, rate: 0.8 }); break;
      case 'puff': R.fx.dust(e.x, e.y, 0, { n: 2, s0: 0.3, s1: 1, life: 1.2, a: 0.25, jit: 1 }); break;
      case 'warn':
        if (live && G.mode !== 'demo') {
          if (e.type === 'drone') A.play('alarm', { vol: 0.35, gap: 2 });
          else if (e.air || W.R.warn > 1.6) A.play('warn', { vol: e.air ? 0.5 : 0.28, gap: 0.6 });
        }
        break;
      case 'tut': if (live) tutorial(e.key); break;
      case 'bossin':
        A.play('alarm', { vol: 0.8, gap: 0 }); A.play('bossroar', { vol: 0.8, delay: 1.2 });
        A.playMusic('boss', 1);
        if (live) { banner('WARNING', bossName(e.key), 3); say('boss', { key: true, delay: 0.4 }); }
        break;
      case 'bosshit': A.play('bosshit', { x: e.x, y: e.y, vol: 0.55, gap: 0.04 }); R.fx.sparks(e.x, e.y, 0, { n: 7, speed: 5 }); break;
      case 'bossphase': A.play('bossroar', { vol: 1 }); R.addTrauma(0.3 * +settings.shake); if (live) caption(`${bossName(e.key)} IS ANGRY`, 2.5); break;
      case 'bosssalvo': A.play('bosscharge', { x: e.x, y: e.y, vol: 0.4, gap: 1 }); break;
      case 'bossdying': A.play('boomL', { x: e.x, y: e.y, vol: 1 }); slowmo(0.35, 1.6); R.addTrauma(0.5 * +settings.shake); if (live) rumble(0.8, 0.8, 700); break;
      case 'bosskill':
        A.play('boomL', { x: e.x, y: e.y, vol: 1, rate: 0.85 });
        R.fx.explode(e.x, e.y, 0, 4, { metal: true }); R.fx.explode(e.x + 2, e.y + 1, 0, 3, { metal: true }); R.fx.debris(e.x, e.y, 0, { metal: true, n: 30, speed: 9, size: 0.5, trail: true });
        R.flashScreen(0.4, 0xffd0a0); R.addTrauma(0.8 * +settings.shake);
        if (live) {
          if (G.mode !== 'online') G.pendingClip = { n: W.n, kind: 'boss' };
          popup('+' + (5000 + (W.mode === 'longhaul' ? 0 : W.sector * 1000)), e.x, e.y + 2);
          say('bossdown', { key: true, delay: 0.8 });
          if (W.mode !== 'longhaul') A.sting('clear');
          else setTimeout(() => A.playMusic(SECTORS[W.k].music), 2500);
        }
        break;
      case 'life': if (live) { A.play('upgrade', { vol: 0.8 }); caption('+1 ROVER', 2.5); } break;
      case 'over': break;
    }
  }
}
const MDR = 0; // muzzle height offset (the body sits on the wheel line)
function slowmo(scale, t) { G.timeScale = scale; G.slowT = t; A.setRate(Math.max(0.6, scale + 0.2)); }

// ------------------------------------------------------------------ the end of a sector / run
function onWorldOver(W) {
  if (G.mode === 'demo') { if (G.demoI % 2 === 0) toTitle(); else startDemo(); return; }
  A.stopLoops();
  if (G.mode === 'online') { results(W, W.result === 'clear' ? 'SECTOR CLEAR' : 'SIGNAL LOST', 'CO-OP DRIVE'); return; }
  if (G.mode === 'playthrough') { playthroughNext(W); return; }
  if (W.mode === 'longhaul') { A.sting('over'); say('gameover', { key: true, delay: 1 }); results(W, 'END OF THE ROAD', `${Math.round(W.rovers[0].x).toLocaleString()} M · ${cpLetter(W, W.seg)}`); return; }
  const s = W.sector;
  if (W.result === 'clear') {
    const t = W.secT;
    const k = 's' + s;
    if (!best[k] || t < best[k]) { best[k] = t; store('cr.best.v1', best); }
    reach = Math.max(reach, Math.min(4, s + 1)); store('cr.reach.v1', reach);
    const got = [];
    const award = (id) => { if (!medals.has(id)) { medals.add(id); got.push(id); } };
    if (W.stats.deaths === 0) award(`s${s}clean`);
    if (W.stats.air >= 3 && W.stats.airKills / W.stats.air >= 0.8) award(`s${s}aim`);
    if (t <= parTime(s)) award(`s${s}par`);
    store('cr.medals.v1', [...medals]);
    if (got.length) A.play('medal', { vol: 0.9, delay: 0.6 });
    G.run.newMedals.push(...got);
    G.run.score = W.score; G.run.lives = W.lives + 1;
    G.run.salvage += Math.floor((W.score - G.run.score0) / 10);
    G.run.lastTime = t; G.run.lastStats = W.stats; G.run.got = got;
    if (s >= SECTORS.length - 1) { say('champion', { key: true, delay: 2.5 }); results(W, 'ACROSS THE MOON', 'ALL FIVE SECTORS CLEARED'); }
    else upgrades(W);
    return;
  }
  A.sting('over');
  say('gameover', { key: true, delay: 1 });
  results(W, 'GAME OVER', `SECTOR ${s + 1} · ${SECTORS[s].name} · CHECKPOINT ${cpLetter(W, W.seg)}`);
}
function playthroughNext(W) {
  const s = W.sector;
  if (W.result !== 'clear') {
    // out of rovers: the AI takes the sector again from the start
    G.run.tries++;
    G.run.score = G.run.score0; G.run.lives = START_LIVES + 2;
    banner('RETRY', `THE AUTOPILOT TRIES ${SECTORS[s].name} AGAIN`, 2.5);
    setTimeout(() => { if (G.mode === 'playthrough') beginSector(s); }, 1800);
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
  $('up-sub').textContent = `${fmtT(G.run.lastTime)} · ${G.run.got.length ? 'MEDAL: ' + G.run.got.map((id) => MEDALS.find((m) => m.id === id).name).join(', ') : 'SPEND SALVAGE ON YOUR ROVER'}`;
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
function results(W, title, sub) {
  G.state = 'results'; setHud(false);
  $('res-title').textContent = title; $('res-sub').textContent = sub;
  const stats = [['SCORE', W.score.toLocaleString()]];
  if (W.mode === 'longhaul') stats.push(['DISTANCE', Math.round(W.rovers[0].x).toLocaleString() + ' m'], ['DRIVE TIME', fmtT(W.driveT)]);
  else stats.push(['SECTOR TIME', fmtT(W.secT)]);
  stats.push(['ATTACKERS DOWNED', `${W.stats.airKills} / ${W.stats.air}`], ['JUMPS', W.stats.jumps], ['ROVERS LOST', W.stats.deaths]);
  $('res-stats').innerHTML = stats.map(([a, b]) => `<div class="stat"><span>${a}</span><b>${b}</b></div>`).join('');
  const got = G.run ? G.run.newMedals : [];
  $('res-medals').innerHTML = got.map((id) => `<span class="medal on new">🏅 ${MEDALS.find((m) => m.id === id).name} · S${MEDALS.find((m) => m.id === id).sector + 1}</span>`).join('');
  $('res-btns').querySelector('[data-act="replay"]').classList.toggle('hidden', !G.clip);
  $('rep-sub').textContent = G.clip && G.clip.kind === 'boss' ? 'The boss going down' : 'The last crash, exactly as it happened';
  const board = W.mode === 'longhaul' ? HSL : HS;
  G.board = board;
  G.ini = null;
  $('ini-wrap').classList.add('hidden');
  if (G.mode !== 'online' && G.mode !== 'playthrough' && board.qualifies(W.score)) {
    if (W.score > board.best()) say('newrecord', { key: true, delay: 3.5 });
    const ini = board.initials();
    G.ini = { chars: ini.split(''), i: 0, score: W.score, level: W.mode === 'longhaul' ? Math.round(W.rovers[0].x) : W.sector + 1 };
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
  if (!p || W.n < p.n + Math.round(1.4 / STEP)) return;
  G.pendingClip = null;
  const c = REC.clip ? REC.clip(p.n) : null;
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
  R.rebuildGround(true);
  const r = G.replay.W.rovers[0];
  R.updateCamera(0.016, { x: r.x, y: r.y, vx: r.vx }, { snap: true });
}
function endReplay() {
  G.replay = null;
  $('letterbox').classList.add('hidden');
  A.setRate(1);
  const a = G.afterReplay || { state: 'title' };
  G.state = a.state;
  if (G.W) { R.W = G.W; R.rebuildGround(true); }
  if (a.screen) show(a.screen, false); else toTitle();
}

// ------------------------------------------------------------------ pause
function pause() {
  if (G.state !== 'play' || G.mode === 'demo') return;
  if (G.mode === 'online') { show('pause'); $('pause-sub').textContent = 'ONLINE · THE DRIVE KEEPS GOING'; G.state = 'paused-online'; return; }
  G.state = 'paused';
  A.muffle(true);
  $('pause-sub').textContent = G.W.mode === 'longhaul' ? 'LONG HAUL' : `SECTOR ${G.W.sector + 1} · CHECKPOINT ${cpLetter(G.W, G.W.seg)}`;
  $('pause-replay').classList.toggle('hidden', !G.clip);
  show('pause', false);
}
function resume() { if (G.state === 'paused' || G.state === 'paused-online') { G.state = 'play'; A.muffle(false); hideScreens(); } }

// ------------------------------------------------------------------ online co-op
function netStatus(text, kind) {
  const el = $('net-status');
  if (text === 'waiting') { el.textContent = 'Waiting for your co-driver to join…'; el.className = ''; return; }
  el.textContent = text; el.className = kind === 'error' ? 'error' : '';
}
function netJoined(peer) {
  A.play('uiok', { gap: 0 });
  netStatus(`${peer.ini || 'A driver'} is here.` + (NET.host ? ' Pick the route and start.' : ' Waiting for the host to start…'));
  $('net-go').classList.toggle('hidden', !NET.host);
  if (NET.host) setSel($('net-go'));
  say('partner', { key: true });
}
function netLeft(why) {
  if (G.mode === 'online' && G.state !== 'results') { caption(why === 'lost' ? 'CONNECTION LOST' : 'YOUR CO-DRIVER LEFT', 4); setTimeout(() => { if (G.mode === 'online') toTitle(); }, 2500); }
  else netStatus(why === 'lost' ? 'Connection lost' : 'Your co-driver left', 'error');
}
function hostStart() {
  const route = settings.netRoute;
  const cfg = route === 'lh' ? { gm: 'longhaul', seed: newSeed() } : { gm: 'campaign', sector: +route, seed: newSeed(), up: { ...TYPICAL_UP[+route] } };
  NET.sendStart(cfg);
  startOnline(cfg);
}
function startOnline(cfg) {
  G.mode = 'online';
  G.run = { score: 0, lives: START_LIVES + 1, up: cfg.up || {}, newMedals: [] };
  const W = makeWorld({ mode: cfg.gm === 'longhaul' ? 'longhaul' : 'campaign', sector: cfg.sector || 0, seed: cfg.seed, up: cfg.up || {}, coop: true, lives: START_LIVES + 1, demo: true });
  NET.bind(W);
  enterPlay(W);
  G.ai = G.autopilot ? new Autopilot(cfg.seed + (NET.host ? 0 : 1), 'demo') : null;
  banner('CO-OP', cfg.gm === 'longhaul' ? 'LONG HAUL' : SECTORS[cfg.sector || 0].name, 3);
}
window.__cr.online = { hostStart, startOnline };

// ------------------------------------------------------------------ menus wiring
function act(a, el) {
  A.unlock();
  switch (a) {
    case 'campaign': A.play('uiok', { gap: 0 }); startCampaign(0); break;
    case 'longhaul': A.play('uiok', { gap: 0 }); startLongHaul(); break;
    case 'playthrough': A.play('uiok', { gap: 0 }); startPlaythrough(); break;
    case 'sectors': buildSectors(); show('sectors'); break;
    case 'online': show('online'); netStatus(''); $('room-wrap').classList.add('hidden'); $('net-go').classList.add('hidden'); syncSegs(); break;
    case 'scores': show('scores'); renderScores(G.scoreTab || 'campaign'); break;
    case 'medals': buildMedals(); show('medals'); break;
    case 'options': show('options'); syncSegs(); break;
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
  void el;
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act], [data-up], [data-sector], [data-tab], .seg button');
  if (!t) return;
  A.unlock();
  if (t.dataset.act) act(t.dataset.act, t);
  else if (t.dataset.up) buy(t.dataset.up);
  else if (t.dataset.sector !== undefined) { if (!t.hasAttribute('disabled')) { A.play('uiok', { gap: 0 }); startCampaign(+t.dataset.sector); } }
  else if (t.dataset.tab) renderScores(t.dataset.tab);
  else if (t.parentElement.dataset.opt) { settings[t.parentElement.dataset.opt] = t.dataset.v; saveSettings(); applySettings(); syncSegs(); A.play('uimove', { gap: 0 }); }
});
$('ini').addEventListener('click', (e) => { const b = e.target.closest('b'); if (!b || !G.ini) return; const i = [...$('ini').children].indexOf(b); if (G.ini.i === i) { cycleIni(1); } G.ini.i = i; renderIni(); });
for (const inp of document.querySelectorAll('[data-set]')) {
  inp.value = settings[inp.dataset.set];
  inp.addEventListener('input', () => { settings[inp.dataset.set] = +inp.value; saveSettings(); applySettings(); });
}
function syncSegs() { for (const s of document.querySelectorAll('.seg')) for (const b of s.children) b.classList.toggle('on', String(settings[s.dataset.opt]) === b.dataset.v); }
function applySettings() {
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
    return `<button class="sec" data-sector="${i}" ${open ? '' : 'disabled'}><b>SECTOR ${i + 1} · ${s.cps[0]}–${s.cps[s.cps.length - 1]}</b><span>${s.name}</span><small>${open ? (best['s' + i] ? 'BEST ' + fmtT(best['s' + i]) : 'NOT CLEARED YET') : 'LOCKED'}</small><div class="md">${m}</div></button>`;
  }).join('');
}
function buildMedals() {
  $('med-count').textContent = `${medals.size} OF ${MEDALS.length} EARNED`;
  $('medlist').innerHTML = SECTORS.map((s, i) => `<h3>SECTOR ${i + 1} · ${s.name}</h3><div class="medrow">${MEDALS.filter((m) => m.sector === i).map((m) => `<span class="medal ${medals.has(m.id) ? 'on' : ''}" title="${m.desc}">${medals.has(m.id) ? '🏅' : '○'} ${m.name} <small style="opacity:.7">· ${m.desc}</small></span>`).join('')}</div>`).join('');
}
async function renderScores(tab) {
  G.scoreTab = tab;
  for (const b of document.querySelectorAll('[data-tab]')) b.classList.toggle('primary', b.dataset.tab === tab);
  const board = tab === 'longhaul' ? HSL : HS;
  const row = (r, i) => `<tr><td>${i + 1}</td><td>${r.initials}</td><td>${tab === 'longhaul' ? (r.level || 0).toLocaleString() + ' m' : 'S' + (r.level || 1)}</td><td>${r.score.toLocaleString()}</td></tr>`;
  const L = board.local();
  $('hs-local').innerHTML = L.length ? L.map(row).join('') : '<tr><td></td><td>No scores yet</td></tr>';
  $('hs-global').innerHTML = '<tr><td></td><td>Loading…</td></tr>';
  $('besttimes').innerHTML = SECTORS.map((s, i) => `<div class="stat"><span>S${i + 1} · ${s.name}</span><b>${best['s' + i] ? fmtT(best['s' + i]) : '—'}</b></div>`).join('');
  const g = await board.fresh();
  if (G.scoreTab !== tab) return;
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

// ------------------------------------------------------------------ the frame
let lastT = performance.now();
let prevLook = -1;
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
  const W = G.state === 'replay' && G.replay ? G.replay.W : G.W;
  if (!W) return;
  if (G.state === 'play') playStep(dt);
  else if (G.state === 'paused-online') playStep(dt);
  else if (G.state === 'replay') replayStep(dt);
  else if (G.state === 'title' || (G.scenic && G.W === G.scenic)) scenicStep(dt);
  const cur = G.state === 'replay' && G.replay ? G.replay.W : G.W;
  if (!cur) return;
  R.sync(cur, dt);
  const me = G.state === 'title' ? cur.rovers[0] : myRover(cur);
  const focus = me && me.alive ? me : cur.rovers.find((r) => r.alive) || me;
  const bossAir = cur.boss && cur.boss.kind !== 'ground' && cur.boss.state !== 'in';
  const air = cur.flyers.length > 0 || cur.drones.some((d) => d.y - (focus ? focus.y : 0) > 4);
  if (focus) R.updateCamera(dt, { x: focus.x, y: focus.y, vx: focus.vx || 6 }, { bossAir, air, shake: +settings.shake, cine: G.state === 'title' || G.screen === 'title' || G.screen === 'sectors' || G.screen === 'online' || G.screen === 'scores' || G.screen === 'medals' || G.screen === 'options' || G.screen === 'help' && G.mode === 'title' });
  A.setListener(R.camera);
  if (G.state === 'play' || G.state === 'paused-online' || G.state === 'replay') loops(cur);
  // long haul: change the look through a short fade
  if (G.lookFade > 0) { G.lookFade -= dt * 1.6; if (G.lookFade < 0.5 && cur.k !== R.lookI) R.setLook(cur.k); }
  else if (cur.k !== R.lookI && G.state !== 'title') R.setLook(cur.k);
  const fade = G.lookFade > 0 ? 1 - Math.abs(G.lookFade - 0.5) * 2 : 0;
  R.render(dt, { fade });
  if (G.bannerT > 0) { G.bannerT -= dt; if (G.bannerT <= 0) $('banner').classList.add('hidden'); }
  if (G.tutT > 0) { G.tutT -= dt; if (G.tutT <= 0) $('tut').classList.add('hidden'); }
  if (G.capT > 0) { G.capT -= dt; if (G.capT <= 0) $('caption').classList.add('hidden'); }
  void prevLook;
}
function playStep(dt) {
  const W = G.W;
  G.acc += dt * G.timeScale;
  let n = 0;
  const online = G.mode === 'online';
  const guest = online && !NET.host;
  if (online && guest) handleEvents(NET.guestSync(W), W, true);
  while (G.acc >= STEP && n < 12) {
    if (!online) REC.tick(W);
    const me = myRover(W);
    if (me) {
      if (G.ai) me.input = G.ai.control(W, me);
      else me.input = G.state === 'play' ? I.control() : { th: 0, jump: false, fire: false };
    }
    if (online && NET.host) NET.hostTick(W);
    if (!online) REC.input(W);
    step(W, STEP);
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
  updateWarnings(W);
  if (G.mode === 'demo') {
    G.demoT += dt;
    if (G.demoT > 95) { W.over = true; }
  }
  if (G.mode === 'demo' || G.mode === 'playthrough') demoCaptions(W, dt);
  if (W.over && G.state === 'play' || (W.over && G.state === 'paused-online')) { G.state = 'ended'; setTimeout(() => onWorldOver(W), G.mode === 'demo' ? 1500 : 1200); }
}
function replayStep(dt) {
  const Rp = G.replay;
  // slow motion around the key moment
  const near = Math.abs(Rp.toKey) < 0.7;
  const rs = near ? 0.35 : 1;
  A.setRate(near ? 0.7 : 1);
  handleEvents(Rp.advance(dt * rs), Rp.W, false);
  if (Rp.done) endReplay();
}
function scenicStep(dt) {
  const W = G.scenic;
  if (!W) return;
  G.acc += dt;
  let n = 0;
  while (G.acc >= STEP && n < 8) { const r = W.rovers[0]; r.input = { th: -0.6, jump: false, fire: false }; step(W, STEP); drainEvents(W); G.acc -= STEP; n++; }
  if (G.state === 'title' && G.screen === 'title') {
    G.idleT += dt;
    if (G.idleT > (params.has('demo') ? 1 : 22)) { G.demoStartT = performance.now(); startDemo(); }
  }
}
// what the autopilot is up to, now and then
function demoCaptions(W, dt) {
  G.capCool = (G.capCool || 0) - dt;
  if (G.capCool > 0 || !G.ai) return;
  const p = G.ai.debug.plan, me = W.rovers[0];
  let text = null;
  if (W.boss && W.boss.state === 'fight') text = W.boss.kind === 'ground' ? `AUTOPILOT · forward cannon on ${bossName(W.boss.key)}, jumping its shells` : `AUTOPILOT · anti-air on ${bossName(W.boss.key)}'s belly, dodging the salvo`;
  else if (p && !p.pressed && p.xt - me.x < 14) text = `AUTOPILOT · take-off in ${Math.max(0, (p.xt - me.x) / me.vx).toFixed(1)} s, ${p.hold > 0.25 ? 'full hold' : p.hold > 0 ? 'half hold' : 'short hop'}`;
  else if (W.flyers.length) text = 'AUTOPILOT · tracking attackers overhead';
  if (text) { caption(text, 2.6); G.capCool = 6; }
}
// engine + tyre loops on each rover, hums on the nearest attacker / drone / tank
function loops(W) {
  for (const r of W.rovers) {
    const on = r.alive ? 1 : 0;
    A.setLoop('engine' + r.id, r.x, r.y + 1, r.z, on * (0.6 + Math.abs(r.input.th) * 0.3), 0.75 + r.vx / 22 + (r.input.th > 0.3 ? 0.08 : 0));
    A.setLoop('tyres' + r.id, r.x, r.y, r.z, on * (r.air ? 0 : 0.35 + r.vx / 20), 0.8 + r.vx / 30);
  }
  const me = myRover(W) || W.rovers[0];
  const nearest = (list) => { let b = null, d = 1e9; for (const e of list) { const q = Math.abs(e.x - me.x); if (q < d) { d = q; b = e; } } return b; };
  const f = nearest(W.flyers), d = nearest(W.drones), t = nearest(W.tanks);
  const bf = W.boss && W.boss.kind !== 'ground' ? W.boss : null;
  const fl = bf || f;
  A.setLoop('flyer', fl ? fl.x : 0, fl ? fl.y : 0, 0, fl ? (bf ? 1 : 0.8) : 0, bf ? 0.7 : 1);
  A.setLoop('drone', d ? d.x : 0, d ? d.y : 0, 0, d ? 0.8 : 0, d ? 1 + Math.max(0, 8 - Math.abs(d.x - me.x)) * 0.03 : 1);
  const gb = W.boss && W.boss.kind === 'ground' ? W.boss : null;
  const tk = gb || t;
  A.setLoop('tank', tk ? tk.x : 0, 1, 0, tk ? (gb ? 1 : 0.6) : 0, gb ? 0.7 : 1);
}

// dynamic resolution: drop the render scale when frames run long, recover when there is headroom
function perf(dt) {
  if (G.fixed) return;
  const T = G.frameT;
  T.push(dt);
  if (T.length < 90) return;
  const s = [...T].sort((a, b) => a - b), p75 = s[Math.floor(s.length * 0.75)];
  T.length = 0;
  if (p75 > 1 / 50 && R.scale > 0.6) R.setScale(Math.max(0.6, R.scale - 0.1));
  else if (p75 < 1 / 75 && R.scale < 1) R.setScale(Math.min(1, R.scale + 0.05));
}

// ------------------------------------------------------------------ boot
async function boot() {
  try { R.warmUp(); } catch (e) { console.warn('warm-up', e); }
  $('loading').style.opacity = '0';
  setTimeout(() => $('loading').remove(), 700);
  toTitle();
  HS.fresh(); HSL.fresh();
  if (params.has('test')) { const m = await import('./tests.js?v=2'); m.runTests(window.__cr); }
  else if (params.has('playthrough')) { A.unlock(); startPlaythrough(); }
  else if (G.autopilot) { A.unlock(); if (params.has('longhaul')) startLongHaul(); else startCampaign(+params.get('sector') || 0); }
  else if (params.has('room')) { act('online'); $('join-code').value = cleanCode(params.get('room')); }
  if (!G.fixed) requestAnimationFrame(frame);
}
// test hooks
Object.assign(window.__cr, {
  tick: (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) tickFrame(dt); },
  startDemo, startCampaign, startLongHaul, startPlaythrough, toTitle, playReplay, pause, resume, act, buy, settingsApply: applySettings,
  get W() { return G.W; }, noPost: NO_POST,
});
boot();
