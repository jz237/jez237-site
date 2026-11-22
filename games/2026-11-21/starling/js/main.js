// STARLING 2026 — game shell: loop, input, menus, HUD, scores.
import { Sim, bot, W, H, DT, clamp } from './sim.js?v=130';
import { Renderer } from './render.js?v=130';
import { Sound } from './audio.js?v=130';
import { Scores } from './scores.js?v=130';

const VERSION = '1.3.0', $ = (id) => document.getElementById(id), P = new URLSearchParams(location.search);
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } } };
const set = Object.assign({ sound: true, auto: true, flash: false }, store.get('starling_settings', {})), save = () => store.set('starling_settings', set);
const R = new Renderer($('gl')), A = new Sound(), S = new Sim(), board = new Scores('starling-2026');
let mode = 'menu', demo = true, ai = false, mem = {}, acc = 0, last = performance.now(), screen = null, bannerT = 0, scale = 1, ema = 16, slow = 0, lw = 0, lh = 0, ff = +(P.get('ff') || 1);
const keys = new Set(), edge = new Set(); let tdx = 0, ptr = null, lx = 0, touch = false, tBeam = false, padPrev = [];

function layout() { lw = innerWidth; lh = innerHeight; R.resize(lw, lh, scale); S.xr = clamp(R.visX - 1.3, 8.2, 22); document.documentElement.style.setProperty('--u', Math.min(lw, lh) / 100 + 'px'); }
addEventListener('resize', layout); layout();
const unit = () => lh / (2 * R.camD * Math.tan(15 * Math.PI / 180)); // pixels per world unit on the play plane

// ---------------------------------------------------------------- input
addEventListener('keydown', (e) => { if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault(); if (!e.repeat) { keys.add(e.code); edge.add(e.code); } A.init(); });
addEventListener('keyup', (e) => keys.delete(e.code)); addEventListener('blur', () => keys.clear());
addEventListener('pointerdown', (e) => { A.init(); if (e.pointerType === 'mouse') return; touch = true; if (mode === 'play') $('touch').classList.remove('hidden'); if (e.target && e.target.closest && e.target.closest('button,.card,input')) return; if (ptr === null) { ptr = e.pointerId; lx = e.clientX; } });
addEventListener('pointermove', (e) => { if (e.pointerId !== ptr) return; tdx += (e.clientX - lx) / unit(); lx = e.clientX; });
const pup = (e) => { if (e.pointerId === ptr) ptr = null; }; addEventListener('pointerup', pup); addEventListener('pointercancel', pup);
function poll() {
  const o = { x: 0, dx: tdx * 1.15, fire: false, auto: set.auto || touch, beam: false, pause: false, ok: false, back: false, menu: null }; tdx = 0;
  if (keys.has('ArrowLeft') || keys.has('KeyA')) o.x -= 1; if (keys.has('ArrowRight') || keys.has('KeyD')) o.x += 1; o.fire = keys.has('Space') || keys.has('KeyZ') || keys.has('ArrowUp');
  o.beam = edge.has('KeyX') || edge.has('ShiftLeft') || edge.has('ShiftRight') || edge.has('ArrowDown') || tBeam; tBeam = false; o.pause = edge.has('Escape') || edge.has('KeyP');
  if (edge.has('ArrowUp') || edge.has('KeyW')) o.menu = 'up'; if (edge.has('ArrowDown') || edge.has('KeyS')) o.menu = 'down'; o.back = edge.has('Escape') || edge.has('Backspace');
  const pads = navigator.getGamepads ? navigator.getGamepads() : []; let g = null; for (const q of pads) if (q && q.connected) { g = q; break; }
  if (g) { const b = (i) => !!(g.buttons[i] && g.buttons[i].pressed), e = (i) => b(i) && !padPrev[i], ax = g.axes[0] || 0; if (Math.abs(ax) > 0.2) o.x += ax; if (b(14)) o.x -= 1; if (b(15)) o.x += 1; if (b(0) || b(7)) o.fire = true; if (e(2) || e(1) || e(5)) o.beam = true; if (e(9)) o.pause = true; if (e(12)) o.menu = 'up'; if (e(13)) o.menu = 'down'; if (e(0)) o.ok = true; if (e(1)) o.back = true; padPrev = g.buttons.map((q) => q.pressed); }
  edge.clear(); return o;
}

// ---------------------------------------------------------------- screens
const SCREENS = ['title', 's-help', 's-scores', 's-pause', 's-over'];
function show(id) { screen = id; for (const s of SCREENS) $(s).classList.toggle('hidden', s !== id); if (id && !touch) { const b = $(id).querySelector('button'); if (b) b.focus({ preventScroll: true }); } }
function nav(inp) { if (!screen) return; const list = [...$(screen).querySelectorAll('button, input')].filter((b) => b.offsetParent !== null); if (!list.length) return; let i = list.indexOf(document.activeElement);
  if (inp.menu) { i = i < 0 ? 0 : (i + (inp.menu === 'down' ? 1 : -1) + list.length) % list.length; list[i].focus({ preventScroll: true }); A.sfx('ui'); }
  if (inp.ok && i >= 0 && list[i].tagName === 'BUTTON') list[i].click(); if (inp.back) { const b = $(screen).querySelector('[data-back]'); if (b) b.click(); else if (screen === 's-pause') resume(); } }
function banner(a, b, secs = 2.4) { $('b1').textContent = a || ''; $('b2').textContent = b || ''; $('banner').classList.add('on'); bannerT = secs; }
function pop(x, y, text) { const v = R.uv(x, y), d = document.createElement('div'); d.className = 'pop'; d.textContent = text; d.style.left = v[0] * 100 + '%'; d.style.top = (1 - v[1]) * 100 + '%'; $('popups').appendChild(d); setTimeout(() => d.remove(), 1050); }
function opts() { const t = (id, key, label) => { const b = $(id); b.textContent = `${label} ${set[key] ? 'ON' : 'OFF'}`; b.classList.toggle('on', !!set[key]); b.onclick = () => { set[key] = !set[key]; save(); apply(); opts(); A.sfx('ui'); }; }; t('o-sound', 'sound', 'SOUND'); t('o-auto', 'auto', 'AUTO-FIRE'); t('o-flash', 'flash', 'LESS FLASH');
  const tb = $('o-test'); tb.textContent = 'SOUND TEST'; tb.onclick = () => { const n = SOUNDS[soundI++ % SOUNDS.length]; tb.textContent = 'TEST: ' + n.toUpperCase(); A.init(); A.sfx(n); }; } // each press plays the next effect and names it
const SOUNDS = ['shot', 'hit', 'boom', 'bigboom', 'die', 'ember', 'beam', 'stoop', 'wave', 'clear', 'life']; let soundI = 0;
function apply() { R.opt.flash = set.flash ? 0.25 : 1; A.setOn(set.sound); }

// ---------------------------------------------------------------- flow
function startDemo() { A.track('dusk'); demo = true; ai = false; mode = 'menu'; mem = {}; S.newGame({ seed: (Math.random() * 1e9) | 0, wave: 1 + ((Math.random() * 4) | 0) }); $('hud').classList.add('hidden'); $('touch').classList.add('hidden'); $('demo').textContent = 'DEMONSTRATION'; $('demo').classList.remove('hidden'); $('banner').classList.remove('on'); $('ver').textContent = 'v' + VERSION; opts(); show('title'); }
function startGame(o = {}) { A.init(); A.sfx('ui'); demo = false; ai = !!o.ai; mode = 'play'; mem = {}; acc = 0; show(null); $('hud').classList.remove('hidden'); $('touch').classList.toggle('hidden', !touch || ai); $('demo').classList.toggle('hidden', !ai); $('demo').textContent = 'AI PILOT · ESC FOR TITLE'; S.newGame({ seed: (Date.now() & 0xfffffff) || 7, wave: +(P.get('wave') || 1), god: P.has('god') }); hud.score = -1; $('hi').textContent = board.best().toLocaleString(); }
function pause() { if (mode !== 'play') return; if (ai) { startDemo(); return; } mode = 'pause'; show('s-pause'); A.pause(true); }
function resume() { if (mode !== 'pause') return; mode = 'play'; show(null); A.pause(false); last = performance.now(); }
function gameOver() {
  if (ai) { startGame({ ai: true }); return; } mode = 'over'; const acc2 = S.shotsFired ? Math.round((S.hitsLanded / S.shotsFired) * 100) : 0;
  $('ov-s').innerHTML = `Score <b>${S.score.toLocaleString()}</b> &nbsp; Wave <b>${S.wave}</b> &nbsp; Accuracy <b>${acc2}%</b>`; const q = !P.has('bot') && board.qualifies(S.score); $('ov-entry').classList.toggle('hidden', !q); if (q) $('initials').value = board.initials(); show('s-over'); if (q && !touch) $('initials').focus();
}
function fx() {
  for (const f of S.fx) { R.event(f); if (demo) continue; A.event(f);
    switch (f.k) {
      case 'wave': A.track(f.kind === 'roost' ? 'roost' : 'dusk'); $('wave').textContent = 'WAVE ' + f.n; banner(f.kind === 'roost' ? 'THE ROOST' : f.kind === 'flight' ? 'PASSING FLIGHT' : 'WAVE ' + f.n, f.kind === 'roost' ? 'IT SHEDS BIRDS AS IT BURNS' : f.kind === 'flight' ? 'THEY WILL NOT SHOOT. DO NOT MISS ONE.' : f.n === 1 ? 'HOLD THE LIGHTHOUSE' : ''); break;
      case 'clear': if (f.kind === 'flight') banner(f.perfect ? 'PERFECT' : f.hit + ' OF 40', 'BONUS ' + f.bonus.toLocaleString()); else if (f.kind === 'roost') banner('ROOST DOWN', 'BONUS ' + f.bonus.toLocaleString()); break;
      case 'pts': pop(f.x, f.y + 0.8, f.n.toLocaleString()); break; case 'life': banner('', 'EXTRA SHIP', 1.6); break;
      case 'over': gameOver(); break;
    } }
  S.fx.length = 0;
}
document.querySelectorAll('[data-back]').forEach((b) => (b.onclick = () => { A.sfx('ui'); show('title'); }));
$('m-play').onclick = () => startGame(); $('m-ai').onclick = () => startGame({ ai: true }); $('m-help').onclick = () => { A.init(); show('s-help'); };
$('m-scores').onclick = async () => { A.init(); const rows = (a) => (a && a.length ? a.map((r, i) => `<tr><td>${i + 1}</td><td>${String(r.initials || '???').slice(0, 3)}</td><td>${r.level ? 'W' + r.level : ''}</td><td>${(+r.score).toLocaleString()}</td></tr>`).join('') : '<tr><td>No scores yet</td><td></td></tr>'); $('sc-local').innerHTML = rows(board.local()); $('sc-global').innerHTML = '<tr><td>Loading…</td><td></td></tr>'; show('s-scores'); const g = await board.fetchGlobal(); $('sc-global').innerHTML = g ? rows(g) : '<tr><td>Offline</td><td></td></tr>'; };
$('p-resume').onclick = resume; $('p-quit').onclick = () => { A.pause(false); startDemo(); }; $('ov-quit').onclick = startDemo; $('ov-again').onclick = () => startGame();
$('ov-submit').onclick = async () => { $('ov-entry').classList.add('hidden'); await board.submit($('initials').value, S.score, S.wave); };
const tb = (id, fn) => $(id).addEventListener('pointerdown', (e) => { e.preventDefault(); fn(); }); tb('t-beam', () => (tBeam = true)); tb('t-pause', pause);
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

// ---------------------------------------------------------------- HUD
const hud = { score: -1, lives: -1 };
function drawHud() {
  if (S.score !== hud.score) { hud.score = S.score; $('score').textContent = S.score.toLocaleString(); if (S.score > board.best()) $('hi').textContent = S.score.toLocaleString(); }
  if (S.lives !== hud.lives) { hud.lives = S.lives; $('lives').innerHTML = S.lives > 5 ? `<i></i><span>x${S.lives}</span>` : '<i></i>'.repeat(Math.max(0, S.lives)); }
  const p = S.p; $('beamfill').style.width = (p.beamT > 0 ? (p.beamT / 150) * 100 : (1 - p.beamCd / 600) * 100) + '%'; $('beamlbl').classList.toggle('ready', p.beamCd <= 0); $('beamlbl').textContent = p.beamCd <= 0 ? 'BEAM READY' : 'BEAM';
  const tw = p.twin > 0; $('twinbar').style.visibility = $('twinlbl').style.visibility = tw ? 'visible' : 'hidden'; if (tw) $('twinfill').style.width = (p.twin / 960) * 100 + '%';
  const ch = $('chain'), cm = Math.min(5, 1 + Math.floor((S.chain - 1) / 3)); if (S.chain >= 4 && cm > 1) { ch.textContent = 'CHAIN x' + cm; ch.classList.add('on'); } else ch.classList.remove('on');
}

// ---------------------------------------------------------------- loop
function frame(now) {
  requestAnimationFrame(frame); const raw = (now - last) / 1000; last = now; const dt = Math.min(0.1, raw), inp = poll(); if (innerWidth !== lw || innerHeight !== lh) layout();
  if (mode === 'play') { if (inp.pause) pause(); else { acc += dt * ff; let n = 0; while (acc >= DT && n < 5 * ff) { const i2 = ai || P.has('bot') ? bot(S, mem) : n === 0 ? inp : { ...inp, dx: 0, beam: false }; S.step(i2); acc -= DT; n++; fx(); if (mode !== 'play') break; } if (n >= 5 * ff) acc = 0; } }
  else if (mode === 'menu') { S.step(bot(S, mem)); fx(); if (S.over) S.newGame({ seed: (Math.random() * 1e9) | 0 }); nav(inp); } else nav(inp);
  if (bannerT > 0 && (bannerT -= dt) <= 0) $('banner').classList.remove('on');
  R.frame(S, mode === 'pause' ? 0 : dt); const total = Math.max(1, S.waveTotal || 1); A.tick(mode === 'pause' ? 0 : dt, clamp(1 - S.foes.length / total, 0, 1), mode === 'play'); if (!demo) drawHud();
  if (mode !== 'pause' && !document.hidden && raw < 0.1) { ema += (raw * 1000 - ema) * 0.03; if (ema > 21.5) slow += dt; else slow = Math.max(0, slow - dt * 2); if (slow > 2.5 && scale > 0.6) { scale = scale > 0.8 ? 0.75 : 0.55; slow = 0; ema = 16; layout(); } }
}
apply(); startDemo(); if (P.has('wave') || P.has('bot')) startGame({ ai: P.has('bot') });
window.__sl = { S, R, A, set, start: startGame, get mode() { return mode; }, ff(n) { ff = n; }, skip(sec) { for (let i = 0; i < sec * 60 && !S.over; i++) { S.step(bot(S, mem)); for (const f of S.fx) if (f.k === 'wave') $('wave').textContent = 'WAVE ' + f.n; S.fx.length = 0; } return S.wave; } };
requestAnimationFrame(frame);
