// UNDERSTORM 2026 — game shell: loop, menus, HUD, saves, ghosts, scores.
import { W, H, DT, DIFFS, CORE_NAMES, CHARGE, P, VERSION, clamp } from './config.js';
import { STAGES, ACTS } from './stages.js';
import { Sim } from './sim.js';
import { Renderer } from './render.js';
import { Sound } from './audio.js';
import { Input, ACTIONS, LABELS } from './input.js';
import { Scores } from './scores.js';
import { botInput } from './bot.js';

const $ = (id) => document.getElementById(id);
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } } };
const set = Object.assign({ quality: 'auto', mus: 60, sfx: 80, flash: false, shake: false, ghost: true, auto: true, binds: null, diff: 'normal' }, store.get('understorm_settings', {}));
const prog = Object.assign({ max: 0 }, store.get('understorm_progress', {}));
const save = () => store.set('understorm_settings', set), saveProg = () => store.set('understorm_progress', prog);

const box = $('box'), mobile = matchMedia('(pointer: coarse)').matches;
let qual = P.get('q') || (set.quality === 'auto' ? (mobile ? 'med' : 'high') : set.quality);
const R = new Renderer($('gl'), qual), A = new Sound(), I = new Input(box), S = new Sim(STAGES);
const boards = { easy: new Scores('understorm-2026-easy'), normal: new Scores('understorm-2026-normal'), hard: new Scores('understorm-2026-hard') };
I.loadBinds(set.binds); A.mv = set.mus / 100; A.sv = set.sfx / 100;
const applyOpt = () => { R.opt.flash = set.flash ? 0.25 : 1; R.opt.shake = set.shake ? 0.2 : 1; A.setVol(set.mus / 100, set.sfx / 100); S.auto = set.auto; };

let mode = 'menu', demo = true, run = null, mem = {}, acc = 0, last = performance.now(), ff = +(P.get('ff') || 1), useBot = P.has('bot'), titleT = 0, screen = null, prevScreen = null, ema = 16, slow = 0, demoT = 0;
let ghost = null, rec = [], bannerT = 0, msgT = 0, fadeTo = 1, quiet = false, vision = true, lastIntent = '';

let lw = 0, lh = 0;
function layout() {
  const ww = innerWidth, wh = innerHeight; lw = ww; lh = wh; let w = ww, h = Math.round((ww * 9) / 16); if (h > wh) { h = wh; w = Math.round((wh * 16) / 9); }
  box.style.width = w + 'px'; box.style.height = h + 'px'; box.style.fontSize = h / 100 + 'px'; R.resize(w, h); I.unit = w / W;
}
addEventListener('resize', layout); layout();

// ---------------------------------------------------------------- screens
const SCREENS = ['title', 's-diff', 's-select', 's-scores', 's-options', 's-help', 's-pause', 's-over'];
function show(id, keepPrev) {
  if (!keepPrev) prevScreen = screen; screen = id; for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id);
  if (id) { const b = $(id).querySelector('button:not([disabled]):not(.hidden)'); if (b && !I.touch) b.focus({ preventScroll: true }); }
}
function nav(inp) {
  if (!screen) return; const el = $(screen), list = [...el.querySelectorAll('button:not([disabled]), input')].filter((b) => b.offsetParent !== null); if (!list.length) return;
  let i = list.indexOf(document.activeElement);
  if (inp.menu === 'down' || inp.menu === 'up') { i = i < 0 ? 0 : (i + (inp.menu === 'down' ? 1 : -1) + list.length) % list.length; list[i].focus({ preventScroll: true }); A.sfx('ui'); }
  else if ((inp.menu === 'left' || inp.menu === 'right') && i >= 0) { const b = list[i]; if (b.type === 'range') { b.value = +b.value + (inp.menu === 'right' ? 5 : -5); b.dispatchEvent(new Event('input')); } else { const j = (i + (inp.menu === 'right' ? 1 : -1) + list.length) % list.length; list[j].focus({ preventScroll: true }); } }
  if (inp.ok && I.pad && I.padPrev[0] && i >= 0 && list[i].tagName === 'BUTTON') list[i].click();
  if (inp.back) { const b = el.querySelector('[data-back]'); if (b) b.click(); else if (screen === 's-pause') resume(); }
}
function banner(b0, b1, b2, secs = 3, warn) { $('b0').textContent = b0 || ''; $('b1').textContent = b1 || ''; $('b2').textContent = b2 || ''; const el = $('banner'); el.classList.toggle('warn', !!warn); el.classList.add('on'); bannerT = secs; }
function message(t, secs = 3.2) { const el = $('msg'); el.textContent = t; el.classList.add('on'); msgT = secs; }
function pop(x, y, text, cls) { const d = document.createElement('div'); d.className = 'pop' + (cls ? ' ' + cls : ''); d.textContent = text; d.style.left = (x / W) * 100 + '%'; d.style.top = (1 - y / H) * 100 + '%'; $('popups').appendChild(d); setTimeout(() => d.remove(), 1150); }

// ---------------------------------------------------------------- flow
function startDemo() {
  demo = true; mode = 'menu'; mem = {}; demoT = 0; const pick = [0, 2, 4, 6, 8, 3][(Math.random() * 6) | 0];
  S.newGame({ stage: Math.min(pick, Math.max(prog.max, 2)), god: true, practice: 'stage', loadout: { core: 1 + ((Math.random() * 3) | 0), lvl: 2, motes: 1 }, seed: (Math.random() * 1e9) | 0 });
  $('hud').classList.add('hidden'); $('demo').classList.toggle('hidden', false); $('credits').classList.add('hidden'); $('touch').classList.add('hidden'); refreshTitle(); show('title'); $('banner').classList.remove('on');
  A.music(0, 1, 104, 'stage'); titleT = 0;
}
function startGame(o) {
  A.init(); A.sfx('ok'); demo = false; mode = 'play'; mem = {}; run = o; acc = 0; show(null); $('demo').classList.add('hidden'); $('hud').classList.remove('hidden'); $('touch').classList.toggle('hidden', !I.touch); $('credits').classList.add('hidden');
  const sight = o.diff === 'sight';
  S.newGame({ diff: sight ? 'normal' : o.diff, sight, god: P.has('god'), stage: o.stage || 0, cp: o.cp || 0, practice: o.practice || null, loadout: o.loadout || null, auto: o.ai ? true : set.auto, endless: !!o.ai });
  useBot = !!o.ai || P.has('bot'); ff = +(P.get('ff') || 1); $('aibar').classList.toggle('hidden', !o.ai); $('ai-spd-s').textContent = 'x' + ff; if (o.ai) $('touch').classList.add('hidden');
  if (o.loop) S.loop = o.loop;
}
function pause() { if (mode !== 'play') return; mode = 'pause'; show('s-pause'); A.suspend(true); }
function resume() { if (mode !== 'pause') return; mode = 'play'; show(null); A.suspend(false); last = performance.now(); }
function quit() { A.suspend(false); useBot = P.has('bot'); ff = +(P.get('ff') || 1); $('aibar').classList.add('hidden'); startDemo(); }
function takeOver() { if (!run || !run.ai || mode !== 'play') return; run.ai = false; run.took = true; useBot = false; ff = 1; S.auto = set.auto; $('aibar').classList.add('hidden'); $('touch').classList.toggle('hidden', !I.touch); hud.lives = -99; message('YOU HAVE THE STICK', 2.4); A.sfx('ok'); }
function aiSpeed() { ff = ff >= 4 ? 1 : ff * 2; $('ai-spd-s').textContent = 'x' + ff; }
function aiVision() { vision = !vision; $('ai-vis-s').textContent = vision ? 'ON' : 'OFF'; }
function aiNext() { if (run && run.ai && mode === 'play' && S.si < 11) { S.startStage(S.si + 1, 0); } }
function gameOver() {
  mode = 'over'; $('aibar').classList.add('hidden'); const arcade = run && !run.practice && run.diff !== 'sight' && !useBot && !run.ai && !run.took, b = arcade ? boards[run.diff] : null;
  $('ov-t').textContent = S.won ? 'THE STORM BREAKS' : 'SHIP LOST'; $('ov-s').innerHTML = `Score <b>${S.score.toLocaleString()}</b> &nbsp; Stage <b>${S.si + 1}</b>${S.loop > 1 ? ' &nbsp; Loop <b>' + S.loop + '</b>' : ''} &nbsp; Best chain <b>x${S.maxChain}</b>`;
  const q = b && b.qualifies(S.score); $('ov-entry').classList.toggle('hidden', !q); if (q) { $('initials').value = b.initials(); }
  $('ov-retry').classList.toggle('hidden', !!(run && run.practice) || S.won); show('s-over'); if (q && !I.touch) $('initials').focus();
}
function fx() {
  for (const f of S.fx) {
    if (f.k === 'stage') { R.loadStage(S.st); if (!demo) { A.music(S.si, S.st.act, S.st.bpm, 'stage'); if (S.si > prog.max && run && !run.practice && !run.ai) { prog.max = S.si; saveProg(); } ghost = set.ghost && run ? store.get(`understorm_ghost_${run.diff}_${S.si}`, null) : null; rec = []; $('stname').textContent = `${S.loop > 1 ? 'LOOP ' + S.loop + ' · ' : ''}STAGE ${S.si + 1} · ${S.st.name}`; } continue; }
    if (quiet) { if (f.k === 'over') gameOver(); else if (f.k === 'ending') ending(); continue; } R.event(f, S); if (demo) continue; A.event(f);
    switch (f.k) {
      case 'msg': if (f.text) banner(`ACT ${['', 'I', 'II', 'III'][S.st.act]} · ${ACTS[S.st.act]}`, f.sub, f.text, 3.6); else message(f.sub); break;
      case 'boss': banner('WARNING', f.name, 'SOMETHING LARGE AHEAD', 3, true); A.music(S.si, S.st.act, S.st.bpm, 'boss'); break;
      case 'bossgone': if (S.t < S.st.endT - 3) A.music(S.si, S.st.act, S.st.bpm * 1.15, 'boss'); I.rumble(1, 1, 700); break;
      case 'clear': banner(f.flawless ? 'FLAWLESS' : '', 'STAGE CLEAR', `BONUS ${f.bonus.toLocaleString()}`, 3); saveGhost(); break;
      case 'cp': message('CHECKPOINT', 1.4); break;
      case 'pts': pop(f.x, f.y + 0.8, f.n.toLocaleString()); break; case 'chain': pop(f.x, f.y + 1.6, 'x' + f.n, 't'); break;
      case 'life': message('EXTRA SHIP', 2); break; case 'panic': message('THE HERD PANICS  −1000', 2); break;
      case 'die': I.rumble(1, 1, 500); break; case 'release': if (f.n === 3) I.rumble(0.7, 0.4, 350); break; case 'strike': I.rumble(0.4, 0.8, 150); break;
      case 'lock': message('LANCE OVERHEATED', 1.2); break;
      case 'over': gameOver(); break;
      case 'practiceDone': setTimeout(quit, 2600); break;
      case 'ending': ending(); break;
    }
  }
  S.fx.length = 0;
}
function saveGhost() { if (!run || run.practice || run.ai || !set.ghost) return; const sc = S.score - S.stageScore0, key = `understorm_ghost_${run.diff}_${S.si}`, old = store.get(key, null); if (!old || sc > old.s) store.set(key, { s: sc, d: rec }); }
function ending() {
  mode = 'ending'; $('aibar').classList.add('hidden'); if (S.si + 1 > prog.max && !(run && run.ai)) { prog.max = 11; saveProg(); }
  $('cr-text').innerHTML = `The eye closes behind you and the sky is only sky.<br>Final score <b style="color:var(--amber)">${S.score.toLocaleString()}</b> &nbsp;·&nbsp; ${S.deaths} ship${S.deaths === 1 ? '' : 's'} lost &nbsp;·&nbsp; best chain x${S.maxChain}<br><br>UNDERSTORM 2026 — an original game for the GameMaster Arcade.<br>Design, code, models and score generated in the browser. No samples, no borrowed art.`;
  $('credits').classList.remove('hidden'); $('hud').classList.add('hidden'); A.sfx('clear');
}

// ---------------------------------------------------------------- menus
function refreshTitle() {
  const act = prog.max >= 8 ? 3 : prog.max >= 4 ? 2 : 0; $('m-cont').classList.toggle('hidden', !act); if (act) $('m-cont-s').textContent = `From Act ${['', 'I', 'II', 'III'][act]} · ${ACTS[act]} · Stage ${act === 3 ? 9 : 5}`; $('ver').textContent = 'v' + VERSION;
}
function buildSelect() {
  const g = $('grid'); g.innerHTML = '';
  STAGES.forEach((st, i) => { const ok = i <= prog.max || P.has('all'); const b = document.createElement('button'); b.className = 'btn'; b.disabled = !ok; b.innerHTML = `<em>STAGE ${i + 1}</em>${ok ? st.name : '— — —'}`; b.onclick = () => startGame({ diff: set.diff === 'sight' ? 'normal' : set.diff, stage: i, practice: 'stage', loadout: i ? { core: 1 + (i % 3), lvl: 2 } : null }); g.appendChild(b);
    if (st.bossName) { const c = document.createElement('button'); c.className = 'btn'; c.disabled = !ok; c.innerHTML = `<em>BOSS ${i + 1}</em>${ok ? 'FIGHT' : '— — —'}`; c.onclick = () => startGame({ diff: set.diff === 'sight' ? 'normal' : set.diff, stage: i, cp: st.cps.findIndex((t) => Math.abs(t - st.ev.find((e) => e.k === 'boss').t + 1.5) < 0.01), practice: 'boss', loadout: { core: 1 + (i % 3), lvl: 2, motes: 1 } }); g.appendChild(c); } else { const c = document.createElement('button'); c.className = 'btn'; c.disabled = true; c.innerHTML = '<em>NO BOSS</em>—'; g.appendChild(c); } });
}
let tab = 'normal';
async function buildScores() {
  $('sc-tabs').innerHTML = ''; for (const k of ['easy', 'normal', 'hard']) { const b = document.createElement('button'); b.className = 'btn sm' + (k === tab ? ' on' : ''); b.textContent = DIFFS[k].name; b.onclick = () => { tab = k; buildScores(); }; $('sc-tabs').appendChild(b); }
  const rows = (a) => (a && a.length ? a.map((r, i) => `<tr><td>${i + 1}</td><td>${String(r.initials || '???').slice(0, 3)}</td><td>${r.level ? 'ST ' + r.level : ''}</td><td>${(+r.score).toLocaleString()}</td></tr>`).join('') : '<tr><td>No scores yet</td><td></td></tr>');
  $('sc-local').innerHTML = rows(boards[tab].local()); $('sc-global').innerHTML = '<tr><td>Loading…</td><td></td></tr>'; const t = tab, g = await boards[t].fetchGlobal(); if (t === tab) $('sc-global').innerHTML = g ? rows(g) : '<tr><td>Offline</td><td></td></tr>';
}
function buildOptions() {
  const q = $('o-q'); q.innerHTML = ''; for (const k of ['auto', 'low', 'med', 'high']) { const b = document.createElement('button'); b.className = 'btn sm' + (set.quality === k ? ' on' : ''); b.textContent = k.toUpperCase(); b.onclick = () => { set.quality = k; save(); if (k !== 'auto') { qual = k; R.setQuality(k); } buildOptions(); }; q.appendChild(b); }
  const tg = (id, key) => { const b = $(id); b.textContent = set[key] ? 'ON' : 'OFF'; b.classList.toggle('on', !!set[key]); b.onclick = () => { set[key] = !set[key]; save(); applyOpt(); buildOptions(); }; };
  tg('o-flash', 'flash'); tg('o-shake', 'shake'); tg('o-ghost', 'ghost'); tg('o-auto', 'auto');
  $('o-mus').value = set.mus; $('o-sfx').value = set.sfx; $('o-mus').oninput = (e) => { set.mus = +e.target.value; save(); applyOpt(); }; $('o-sfx').oninput = (e) => { set.sfx = +e.target.value; save(); applyOpt(); A.sfx('ui'); };
  const k = $('o-keys'); k.innerHTML = ''; for (const a of ACTIONS) { const row = document.createElement('div'); row.className = 'row'; row.style.marginTop = '.35em'; row.innerHTML = `<span>${LABELS[a]}</span>`; const b = document.createElement('button'); b.className = 'btn sm'; b.textContent = I.binds[a].map((c) => c.replace(/^Key|^Arrow/, '')).join(' / '); b.onclick = () => { b.textContent = 'PRESS A KEY'; I.capture = (code) => { if (code !== 'Escape') { I.binds[a] = [code]; set.binds = I.binds; save(); } buildOptions(); }; }; row.appendChild(b); k.appendChild(row); }
  $('o-reset').onclick = () => { I.resetBinds(); set.binds = null; save(); buildOptions(); };
}
document.querySelectorAll('[data-back]').forEach((b) => (b.onclick = () => { A.sfx('ui'); show(mode === 'pause' ? 's-pause' : 'title'); }));
$('m-start').onclick = () => { A.init(); show('s-diff'); };
$('m-cont').onclick = () => { A.init(); const act = prog.max >= 8 ? 3 : 2; startGame({ diff: set.diff, stage: act === 3 ? 8 : 4, loadout: { core: 1, lvl: 1 } }); };
$('m-select').onclick = () => { A.init(); buildSelect(); show('s-select'); };
$('m-scores').onclick = () => { A.init(); buildScores(); show('s-scores'); };
$('m-options').onclick = () => { A.init(); buildOptions(); show('s-options'); };
$('m-help').onclick = () => { A.init(); show('s-help'); };
$('m-ai').onclick = () => startGame({ diff: 'normal', stage: 0, ai: true });
$('ai-take').onclick = takeOver; $('ai-vis').onclick = aiVision; $('ai-spd').onclick = aiSpeed; $('ai-next').onclick = aiNext;
I.onKey = (e) => { if (!run || !run.ai || mode !== 'play' || e.repeat) return; if (e.code === 'Enter' || e.code === 'NumpadEnter') takeOver(); else if (e.code === 'KeyV') aiVision(); else if (e.code === 'KeyF') aiSpeed(); else if (e.code === 'KeyN') aiNext(); };
document.querySelectorAll('[data-diff]').forEach((b) => (b.onclick = () => { set.diff = b.dataset.diff; save(); startGame({ diff: set.diff, stage: 0 }); }));
$('p-resume').onclick = resume; $('p-quit').onclick = quit; $('p-options').onclick = () => { buildOptions(); show('s-options'); };
$('p-restart').onclick = () => { S.restore(false); S.fx.push({ k: 'respawn' }); resume(); };
$('ov-quit').onclick = quit; $('cr-quit').onclick = () => { const arcade = run && !run.practice && run.diff !== 'sight' && !useBot && !run.ai && !run.took; $('credits').classList.add('hidden'); if (arcade && boards[run.diff].qualifies(S.score)) gameOver(); else quit(); };
$('ov-retry').onclick = () => startGame({ diff: run.diff, stage: S.si, loadout: { core: 1, lvl: 1 }, loop: S.loop });
$('ov-submit').onclick = async () => { const b = boards[run.diff]; $('ov-entry').classList.add('hidden'); await b.submit($('initials').value, S.score, S.si + 1 + (S.loop - 1) * 12); tab = run.diff; };
$('cr-loop').onclick = () => { $('credits').classList.add('hidden'); $('hud').classList.remove('hidden'); mode = 'play'; S.nextLoop(); };
const tb = (id, dn, up) => { const b = $(id); b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('down'); dn(); }); const u = () => { b.classList.remove('down'); if (up) up(); }; b.addEventListener('pointerup', u); b.addEventListener('pointercancel', u); b.addEventListener('pointerleave', u); };
tb('t-fire', () => (I.tf = true), () => (I.tf = false)); tb('t-anchor', () => (I.ta = true)); tb('t-up', () => (I.tu = true)); tb('t-dn', () => (I.td = true)); tb('t-pause', pause);
I.onTouch = () => { if (mode === 'play') $('touch').classList.remove('hidden'); };
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
addEventListener('pointerdown', () => A.init(), { once: true }); addEventListener('keydown', () => A.init(), { once: true });

// ---------------------------------------------------------------- HUD
const hud = { score: -1, lives: -1, core: '', ex: '', sp: -1, boss: null };
function drawHud() {
  const p = S.p;
  if (S.score !== hud.score) { hud.score = S.score; $('score').textContent = S.score.toLocaleString(); }
  if (run && run.ai) { const it = mem.intent || ''; if (it !== lastIntent) { lastIntent = it; $('ai-intent').textContent = it; } }
  const lv = run && run.ai ? -10 - S.deaths : S.sight ? -2 : run && (run.practice || run.took) ? -3 : S.lives; if (lv !== hud.lives) { hud.lives = lv; $('lives').innerHTML = lv <= -10 ? `<span>AI PILOT · ${-10 - lv} LOST</span>` : lv === -2 ? '<span>SIGHTSEER</span>' : lv === -3 ? '<span>PRACTICE</span>' : lv > 5 ? `<i></i><span>x${lv}</span>` : '<i></i>'.repeat(Math.max(0, lv)) + (p.shield > 0 ? '<span>+SHIELD</span>' : ''); }
  const core = S.a.st ? `${CORE_NAMES[p.core]} <b>${'I'.repeat(p.lvl)}</b>` : '—'; if (core !== hud.core) { hud.core = core; $('core').innerHTML = core; }
  const ex = [p.motes ? 'MOTES ' + p.motes : '', p.seek ? 'SEEKERS' : ''].filter(Boolean).join(' · '); if (ex !== hud.ex) { hud.ex = ex; $('extras').textContent = ex; }
  if (p.sp !== hud.sp) { hud.sp = p.sp; [...$('speed').querySelectorAll('i')].forEach((el, i) => el.classList.toggle('on', i <= p.sp)); }
  const g = $('gfill'); g.style.width = clamp(p.beamT > 0 ? 100 : (p.charge / CHARGE[2]) * 100, 0, 100) + '%'; g.classList.toggle('t3', p.tier === 3 || p.beamT > 0);
  $('hfill').style.width = clamp(p.heat * 100, 0, 100) + '%'; $('heat').classList.toggle('lock', p.lock);
  const ch = $('chain'); if (S.chain > 1) { ch.textContent = `TETHER CHAIN x${S.chain}`; ch.classList.add('on'); } else ch.classList.remove('on');
  const b = S.boss && S.boss.t > 60 ? S.boss : null; if (b !== hud.boss) { hud.boss = b; $('bossbar').classList.toggle('hidden', !b); if (b) $('bossname').textContent = b.name; } if (b) $('bosshp').style.width = clamp((b.hp / b.max) * 100, 0, 100) + '%';
}

// ---------------------------------------------------------------- loop
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000; last = now; const dt = Math.min(0.1, raw), inp = I.poll();
  if (innerWidth !== lw || innerHeight !== lh) layout();
  if (mode === 'play') {
    if (inp.pause) pause(); else {
      if (run && run.ai && I.pad && inp.ok) takeOver();
      acc += dt * ff; let n = 0; const max = 5 * ff;
      while (acc >= DT && n < max) { const i2 = useBot ? botInput(S, mem) : n === 0 ? inp : { ...inp, dx: 0, dy: 0, anchor: false, spUp: false, spDn: false }; S.step(i2); acc -= DT; n++; if (!S.boss && S.p.alive) { const gi = Math.floor(S.t * 15) * 2; rec[gi] = Math.round(S.p.x * 20); rec[gi + 1] = Math.round(S.p.y * 20); } fx(); if (mode !== 'play') break; }
      if (n === max) acc = 0;
    }
  } else if (mode === 'menu' || mode === 'over' || mode === 'ending') {
    if (mode === 'menu') { demoT += dt; S.step(botInput(S, mem)); fx(); if (S.over || demoT > 55) { S.fx.length = 0; fadeTo = 0; if (R.fade < 0.03) { const sc = screen; startDemo(); show(sc); fadeTo = 1; } } }
    nav(inp);
  } else nav(inp);
  if (bannerT > 0 && (bannerT -= dt) <= 0) $('banner').classList.remove('on'); if (msgT > 0 && (msgT -= dt) <= 0) $('msg').classList.remove('on');
  R.fade += (fadeTo - R.fade) * Math.min(1, dt * 5);
  const gi = Math.floor(S.t * 15) * 2, gh = !demo && ghost && !S.boss && ghost.d[gi] != null ? [ghost.d[gi] / 20, ghost.d[gi + 1] / 20] : null;
  R.frame(S, mode === 'pause' ? 0 : dt, { ghost: gh, ai: run && run.ai && vision && !demo && mode === 'play' ? mem : null, onThunder: () => { if (!demo) A.sfx('thunder', 1); } });
  if (demo) { titleT += dt; A.tick(titleT, 3, 0); } else if (mode === 'play') { const p = S.p, inten = S.boss || p.tier >= 2 || S.chain >= 3 ? 3 : S.en.length >= 4 || S.t > S.st.endT * 0.5 ? 2 : 1; A.tick(S.gt, inten, p.alive ? clamp(p.charge / CHARGE[2], 0, 1) : 0); } else A.tick(0, 0, 0);
  if (!demo) drawHud();
  // auto quality: step down if the frame rate will not hold
  if (set.quality === 'auto' && !P.get('q') && mode !== 'pause' && !document.hidden) { if (raw < 0.1) ema += (raw * 1000 - ema) * 0.03; if (ema > 21.5) slow += dt; else slow = Math.max(0, slow - dt * 2); if (slow > 2.5 && qual !== 'low') { qual = qual === 'high' ? 'med' : 'low'; R.setQuality(qual); slow = 0; ema = 16; } }
}

applyOpt(); startDemo();
if (P.has('stage')) startGame({ diff: P.get('diff') || 'normal', stage: clamp(+P.get('stage') - 1, 0, 11), cp: +(P.get('cp') || 0), practice: 'stage', loadout: { core: +(P.get('core') || 1), lvl: 2, motes: 1 } });
window.__us = { S, R, A, I, set, prog, start: startGame, get mode() { return mode; }, get qual() { return qual; }, get ema() { return ema; }, ff(n) { ff = n; }, bot(on) { useBot = on; }, skip(sec) { const si = S.si; quiet = true; for (let i = 0; i < sec * 60 && mode === 'play' && S.si === si; i++) { S.step(botInput(S, mem)); fx(); } quiet = false; return S.t; } };
requestAnimationFrame(frame);
