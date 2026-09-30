// Compact monochrome control panel.
import { clamp } from './math.js';

const PRESETS = {
  GLASS: { sea: 0.15, cloud: 0.10, rain: 0, lightning: 0, tod: 7.6 },
  CALM: { sea: 1.8, cloud: 0.25, rain: 0, lightning: 0, tod: 10.4 },
  FRESH: { sea: 4.2, cloud: 0.42, rain: 0, lightning: 0, tod: 15.4 },
  ROUGH: { sea: 6.4, cloud: 0.78, rain: 0.18, lightning: 0, tod: 17.0 },
  STORM: { sea: 8.7, cloud: 1.0, rain: 0.85, lightning: 1, tod: 18.2 },
};
const TIMES = { DAWN: 5.9, NOON: 12.2, DUSK: 18.5, NIGHT: 23.4 };
const fmtTime = h => { const t = ((h % 24) + 24) % 24; const hh = Math.floor(t), mm = Math.floor((t - hh) * 60); return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; };

export function initUI(app, rig) {
  const hud = document.getElementById('hud');
  const hint = document.getElementById('hint');
  const G = app.goal;
  hud.innerHTML = `
    <div class="bar"><b>OPEN SEA</b><span id="readout"></span><button id="fold" title="Fold panel (H hides everything)" aria-label="Fold panel">–</button></div>
    <div id="body">
      <div class="seg" id="modes" role="group" aria-label="Camera">${['TOUR', 'FLY', 'BOAT', 'DIVE'].map(m => `<button data-m="${m.toLowerCase()}">${m}</button>`).join('')}</div>
      <div class="seg" id="presets" role="group" aria-label="Presets">${Object.keys(PRESETS).map(p => `<button data-p="${p}">${p}</button>`).join('')}</div>
      <label class="row">SEA<input id="seaState" type="range" min="0" max="9" step="0.05" aria-label="Sea state"><output id="seaO"></output></label>
      <label class="row">TIME<input id="tod" type="range" min="0" max="24" step="0.05" aria-label="Time of day"><output id="todO"></output></label>
      <div class="seg" id="times" role="group" aria-label="Time presets">${Object.keys(TIMES).map(p => `<button data-t="${p}">${p}</button>`).join('')}</div>
      <label class="row">CLOUD<input id="cloud" type="range" min="0" max="1" step="0.01" aria-label="Cloud cover"><output id="cloudO"></output></label>
      <label class="row">RAIN<input id="rain" type="range" min="0" max="1" step="0.01" aria-label="Rain"><output id="rainO"></output></label>
      <div class="row tog"><button id="light" aria-pressed="false">LIGHTNING</button><button id="quality">AUTO</button><button id="photo" title="Save a PNG (P)">PHOTO</button></div>
    </div>`;
  const $ = id => document.getElementById(id);
  const paint = el => { const min = +el.min, max = +el.max; el.style.setProperty('--v', `${((+el.value - min) / (max - min)) * 100}%`); };
  const sliders = { sea: $('seaState'), tod: $('tod'), cloud: $('cloud'), rain: $('rain') };
  const outs = { sea: v => (+v).toFixed(1), tod: fmtTime, cloud: v => Math.round(v * 100) + '%', rain: v => Math.round(v * 100) + '%' };
  for (const [k, el] of Object.entries(sliders)) {
    el.value = G[k];
    el.addEventListener('input', () => { G[k] = +el.value; app.instant[k] = k === 'tod'; paint(el); $(k + 'O').textContent = outs[k](el.value); });
  }
  $('light').addEventListener('click', () => { G.lightning = G.lightning > 0 ? 0 : 1; });
  const qs = ['AUTO', 'LOW', 'MED', 'HIGH'];
  $('quality').addEventListener('click', () => { app.setQuality(qs[(qs.indexOf(app.qualityMode) + 1) % qs.length]); });
  $('photo').addEventListener('click', () => app.requestPhoto());
  $('fold').addEventListener('click', () => { hud.classList.toggle('folded'); $('fold').textContent = hud.classList.contains('folded') ? '+' : '–'; });
  $('modes').addEventListener('click', e => { const b = e.target.closest('button'); if (b) rig.setMode(b.dataset.m); });
  $('presets').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    Object.assign(G, PRESETS[b.dataset.p]); app.instant.tod = false;
    sync();
  });
  $('times').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { G.tod = TIMES[b.dataset.t]; app.instant.tod = false; sync(); } });
  rig.onChange = () => sync();
  if (innerWidth < 560) { hud.classList.add('folded'); $('fold').textContent = '+'; }

  function sync() {
    for (const [k, el] of Object.entries(sliders)) { el.value = G[k]; paint(el); $(k + 'O').textContent = outs[k](G[k]); }
    $('light').classList.toggle('on', G.lightning > 0); $('light').setAttribute('aria-pressed', G.lightning > 0);
    $('quality').textContent = app.qualityMode;
    for (const b of $('modes').children) b.classList.toggle('on', b.dataset.m === rig.mode);
    let best = null, bd = 1e9;
    for (const [n, p] of Object.entries(PRESETS)) { const d = Math.abs(p.sea - G.sea) + Math.abs(p.cloud - G.cloud) + Math.abs(p.rain - G.rain); if (d < bd) { bd = d; best = n; } }
    for (const b of $('presets').children) b.classList.toggle('on', b.dataset.p === best && bd < 0.35);
  }
  sync();

  // live readout: significant wave height and wind
  setInterval(() => {
    const s = app.sim.cur;
    $('readout').textContent = `Hs ${s.hs < 10 ? s.hs.toFixed(1) : Math.round(s.hs)} m · ${Math.round(s.U)} m/s`;
    if (!app.goalDirty) return;
  }, 500);

  // keyboard shortcuts
  addEventListener('keydown', e => {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.key !== 'h') return;
    const k = e.key.toLowerCase();
    if (k === 'h') { hud.classList.toggle('hidden'); document.body.classList.toggle('hide-hud'); hint.style.opacity = 0; }
    else if (k === 'p') app.requestPhoto();
    else if (k === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); }
    else if (k >= '1' && k <= '4') rig.setMode(['tour', 'fly', 'boat', 'dive'][+k - 1]);
  });

  const setHint = (text) => { hint.textContent = text; hint.style.opacity = 1; clearTimeout(setHint.t); setHint.t = setTimeout(() => { hint.style.opacity = 0; }, 9000); };
  const hintFor = m => ({
    tour: 'Slow tour · drag or press any key to fly',
    fly: 'Drag to look · W A S D move · Q E down / up · Shift fast · wheel speed · H hides the panel',
    boat: 'Drag to orbit the yacht · wheel zooms',
    dive: 'Drag to look around underwater · wheel zooms',
  })[m];
  setHint(hintFor(rig.mode));
  const prev = rig.onChange;
  rig.onChange = m => { prev && prev(m); setHint(hintFor(m)); };
  return { sync };
}
