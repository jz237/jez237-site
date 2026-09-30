// Control panel: camera, sea, sky, water, image and sound. Dark glass, white chips, thin sliders.
import { clamp } from './math.js';
import { seaPreset, windDefaults } from './ocean.js';
import { skyState } from './astro.js';
import { WATER_TYPES } from './water-types.js';

const DEG = Math.PI / 180;

// Sea presets are whole sea states (classic 0-9 scale) expressed as the panel's own controls.
const SEA = { Glassy: 0.15, Calm: 1.8, Breeze: 3.3, Fresh: 4.6, Rough: 6.4, Storm: 8.7 };
const TIMES = { Sunrise: 5.8, Morning: 8.4, Noon: 12.2, Golden: 16.9, Sunset: 18.25, Dusk: 18.9, Night: 1.5 };
const WEATHER = {
  Clear: { cloud: 0.04, rain: 0, lightning: 0 },
  Fair: { cloud: 0.25, rain: 0, lightning: 0 },
  Cloudy: { cloud: 0.6, rain: 0, lightning: 0 },
  Overcast: { cloud: 0.95, rain: 0, lightning: 0 },
  Rain: { cloud: 0.95, rain: 0.6, lightning: 0 },
  Storm: { cloud: 1, rain: 0.9, lightning: 1 },
};
const QUALITY = { Auto: 'AUTO', Low: 'LOW', Medium: 'MED', High: 'HIGH' };
const MODES = { Tour: 'tour', 'Free fly': 'fly', Boat: 'boat', Dive: 'dive', 'Walk deck':'deck' };

export function initUI(app, rig) {
  const hud = document.getElementById('hud');
  const hint = document.getElementById('hint');
  const G = app.goal;
  const manual = { swell: false, chop: false, cloudWind: false };   // sliders the user has taken over from the wind

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const chipRow = (items, onPick) => {
    const row = el('div', 'chips'); const map = new Map();
    for (const name of items) {
      const b = el('button', 'chip', name); b.type = 'button';
      b.addEventListener('click', () => { onPick(name); sync(); });
      row.appendChild(b); map.set(name, b);
    }
    return { row, map };
  };
  const sliders = [];
  const slider = (label, min, max, step, get, set, fmt) => {
    const wrap = el('label', 'srow');
    const name = el('span', null, label);
    const input = el('input'); input.type = 'range'; input.min = min; input.max = max; input.step = step; input.setAttribute('aria-label', label);
    const out = el('output');
    wrap.append(name, input, out);
    let dragging = false;
    input.addEventListener('pointerdown', () => { dragging = true; });
    addEventListener('pointerup', () => { dragging = false; });
    input.addEventListener('input', () => { set(+input.value); paint(); sync(); });
    const paint = () => { const v = ((+input.value - min) / (max - min)) * 100; input.style.setProperty('--v', `${clamp(v, 0, 100)}%`); out.textContent = fmt(+input.value); };
    const s = { wrap, refresh() { if (!dragging && document.activeElement !== input) input.value = get(); paint(); } };
    sliders.push(s);
    return wrap;
  };
  const section = (title, ...nodes) => { const s = el('details', 'sec'); s.open = title === 'Camera'; s.appendChild(el('summary', null, title)); const content = el('div', 'section-content'); content.append(...nodes); s.appendChild(content); return s; };

  // ---- camera ----------------------------------------------------------------------------------------------------
  const cam = chipRow(Object.keys(MODES), n => rig.setMode(MODES[n]));
  const shot = chipRow(['Next shot'], () => rig.nextShot());
  const stations=chipRow(['Helm','Bow','Stern'],n=>{rig.setMode('deck');rig.deck.station(n);rig.syncDeckCamera();});
  stations.row.id='deck-stations';
  const board=document.getElementById('board'),pad=document.getElementById('walk-pad'),knob=pad.firstElementChild;
  board.addEventListener('click',()=>rig.setMode(rig.mode==='deck'?'fly':'deck'));
  let walkingPointer=null;
  const stopWalking=()=>{walkingPointer=null;rig.deck.stick=[0,0];knob.style.transform='translate(0,0)';};
  const steer=e=>{
    const r=pad.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/(r.width*.36),y=(e.clientY-r.top-r.height/2)/(r.height*.36),d=Math.max(1,Math.hypot(x,y));
    rig.deck.stick=[x/d,y/d];knob.style.transform=`translate(${x/d*25}px,${y/d*25}px)`;
  };
  pad.addEventListener('pointerdown',e=>{if(walkingPointer!==null)return;walkingPointer=e.pointerId;pad.setPointerCapture(e.pointerId);steer(e);e.preventDefault();});
  pad.addEventListener('pointermove',e=>{if(e.pointerId===walkingPointer)steer(e);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,e=>{if(e.pointerId===walkingPointer)stopWalking();});
  addEventListener('blur',stopWalking);

  // ---- sea -------------------------------------------------------------------------------------------------------
  const sea = chipRow(Object.keys(SEA), n => {
    Object.assign(G, seaPreset(SEA[n]), { hScale: 1, foam: 1 });
    manual.swell = manual.chop = manual.cloudWind = false;
  });
  const onWind = v => {
    G.wind = v;
    const d = windDefaults(v);
    if (!manual.swell) G.swell = d.swell;
    if (!manual.chop) G.chop = d.chop;
    if (!manual.cloudWind) G.cloudWind = 6 + 0.55 * v;
  };

  // ---- sky -------------------------------------------------------------------------------------------------------
  const times = chipRow(Object.keys(TIMES), n => { G.sunManual = false; G.tod = TIMES[n]; });
  const sunNow = () => skyState(app.state.tod);
  const takeSun = () => { if (!G.sunManual) { const s = sunNow(); G.sunManual = true; G.sunH = s.sunAlt; G.sunAz = s.sunAz; } };
  const weather = chipRow(Object.keys(WEATHER), n => Object.assign(G, WEATHER[n]));

  // ---- water -----------------------------------------------------------------------------------------------------
  const water = chipRow(Object.keys(WATER_TYPES), n => { G.water = n; });

  // ---- image & sound ---------------------------------------------------------------------------------------------
  const sound = chipRow(['Sound off', 'Sound on'], n => { app.sound.setOn(n === 'Sound on'); });
  const photo = chipRow(['Photo'], () => app.requestPhoto());
  const quality = chipRow(Object.keys(QUALITY), n => app.setQuality(QUALITY[n]));

  const fmtSigned = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1);
  hud.replaceChildren(
    section('Camera', cam.row, stations.row, shot.row),
    section('Sea',
      sea.row,
      slider('Wind', 0.3, 35, 0.1, () => G.wind, onWind, v => `${v.toFixed(1)} m/s`),
      slider('Swell', 0, 8, 0.1, () => G.swell, v => { G.swell = v; manual.swell = true; }, v => `${v.toFixed(1)} m`),
      slider('Direction', 0, 360, 1, () => ((G.windDir / DEG) % 360 + 360) % 360, v => { G.windDir = v * DEG; }, v => `${Math.round(v)}°`),
      slider('Choppiness', 0, 2, 0.05, () => G.chop, v => { G.chop = v; manual.chop = true; }, v => v.toFixed(2)),
      slider('Wave height', 0.2, 3, 0.05, () => G.hScale, v => { G.hScale = v; }, v => `×${v.toFixed(2)}`),
      slider('Foam', 0, 3, 0.05, () => G.foam, v => { G.foam = v; }, v => v.toFixed(2))),
    section('Sky',
      times.row,
      slider('Sun height', -45, 90, 1, () => (G.sunManual ? G.sunH : sunNow().sunAlt), v => { takeSun(); G.sunH = v; }, v => `${Math.round(v)}°`),
      slider('Sun bearing', 0, 360, 1, () => (G.sunManual ? G.sunAz : sunNow().sunAz), v => { takeSun(); G.sunAz = v; }, v => `${Math.round(v)}°`),
      weather.row,
      slider('Cloud cover', 0, 1, 0.01, () => G.cloud, v => { G.cloud = v; }, v => `${Math.round(v * 100)}%`),
      slider('Cloud wind', 0, 40, 0.5, () => G.cloudWind, v => { G.cloudWind = v; manual.cloudWind = true; }, v => `${v.toFixed(0)} m/s`)),
    section('Water',
      water.row,
      slider('Night glow', 0, 3, 0.1, () => G.glow, v => { G.glow = v; }, v => v.toFixed(1)),
      slider('Clarity', 0, 1, 0.01, () => G.clarity, v => { G.clarity = v; }, v => `${Math.round(v * 100)}%`)),
    section('Image & sound',
      sound.row, quality.row, photo.row,
      slider('Exposure', -3, 3, 0.1, () => G.ev, v => { G.ev = v; }, fmtSigned),
      slider('Glow', 0, 0.4, 0.01, () => G.bloom, v => { G.bloom = v; }, v => v.toFixed(2)),
      slider('Field of view', 30, 90, 1, () => G.fov, v => { G.fov = v; }, v => `${Math.round(v)}°`)),
  );

  // fold button sits outside the panel so the panel can be a plain scrolling column
  const fold = el('button', 'foldbtn', '×'); fold.type = 'button'; fold.title = 'Hide / show controls (H hides everything)'; fold.setAttribute('aria-label', 'Hide or show controls');
  document.body.appendChild(fold);
  fold.addEventListener('click', () => { hud.classList.toggle('folded'); fold.textContent = hud.classList.contains('folded') ? '☰' : '×'; fold.classList.toggle('closed', hud.classList.contains('folded')); });
  if (innerWidth < 640) { hud.classList.add('folded'); fold.textContent = '☰'; fold.classList.add('closed'); }

  // ---- state -> widgets ------------------------------------------------------------------------------------------
  const near = (a, b, t) => Math.abs(a - b) <= t;
  function sync() {
    const walking=rig.mode==='deck';document.body.classList.toggle('on-deck',walking);
    board.textContent=walking?'Take off':'Land';board.setAttribute('aria-label',walking?'Take off into free flight':'Land on the yacht and walk on deck');board.setAttribute('aria-pressed',String(walking));
    stations.row.hidden=!walking;
    if(!walking&&walkingPointer!==null)stopWalking();
    for (const s of sliders) s.refresh();
    for (const [n, b] of cam.map) b.classList.toggle('on', MODES[n] === rig.mode);
    for (const [n, b] of sea.map) {
      const p = seaPreset(SEA[n]);
      b.classList.toggle('on', near(G.wind, p.wind, 0.3) && near(G.swell, p.swell, 0.1) && near(G.chop, p.chop, 0.04) && near(G.hScale, 1, 0.02) && near(G.foam, 1, 0.02));
    }
    let bestT = null, bd = 0.7;
    if (!G.sunManual) for (const [n, h] of Object.entries(TIMES)) { const d = Math.abs(((G.tod - h + 36) % 24) - 12); if (d < bd) { bd = d; bestT = n; } }
    for (const [n, b] of times.map) b.classList.toggle('on', n === bestT);
    for (const [n, b] of weather.map) { const w = WEATHER[n]; b.classList.toggle('on', near(G.cloud, w.cloud, 0.03) && near(G.rain, w.rain, 0.03) && (G.lightning > 0) === (w.lightning > 0)); }
    for (const [n, b] of water.map) b.classList.toggle('on', n === G.water);
    for (const [n, b] of sound.map) b.classList.toggle('on', (n === 'Sound on') === app.sound.on);
    for (const [n, b] of quality.map) b.classList.toggle('on', QUALITY[n] === app.qualityMode);
  }
  rig.onChange = () => sync();
  sync();
  setInterval(sync, 300);

  // Fullscreen is visible independently of the folded controls.
  const full=document.getElementById('fullscreen');
  const syncFull=()=>{const on=!!(document.fullscreenElement||document.webkitFullscreenElement);full.textContent=on?'⛶ Exit fullscreen':'⛶ Fullscreen';full.setAttribute('aria-label',on?'Exit fullscreen':'Enter fullscreen');full.setAttribute('aria-pressed',String(on));};
  const toggleFull=async()=>{try{if(document.fullscreenElement||document.webkitFullscreenElement){await(document.exitFullscreen?.()??document.webkitExitFullscreen?.());}else{const target=document.documentElement;if(target.requestFullscreen)await target.requestFullscreen();else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();else throw Error('Fullscreen unavailable');}}catch{hint.textContent='Fullscreen is unavailable in this browser.';hint.style.opacity=1;}syncFull();};
  full.addEventListener('click',toggleFull);document.addEventListener('fullscreenchange',syncFull);document.addEventListener('webkitfullscreenchange',syncFull);syncFull();

  // ---- keyboard --------------------------------------------------------------------------------------------------
  addEventListener('keydown', e => {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.key !== 'h') return;
    const k = e.key.toLowerCase();
    if (k === 'h') { hud.classList.toggle('hidden'); fold.classList.toggle('gone'); document.body.classList.toggle('hide-hud'); hint.style.opacity = 0; }
    else if (k === 'p') app.requestPhoto();
    else if (k === 'n') rig.nextShot();
    else if (k === 'f') toggleFull();
    else if(k==='l'&&!e.repeat)rig.setMode(rig.mode==='deck'?'fly':'deck');
    else if (k >= '1' && k <= '5') rig.setMode(['tour', 'fly', 'boat', 'dive','deck'][+k - 1]);
  });

  const setHint = (text) => { hint.textContent = text; hint.style.opacity = 1; clearTimeout(setHint.t); setHint.t = setTimeout(() => { hint.style.opacity = 0; }, 9000); };
  const hintFor = m => ({
    tour: 'Slow tour · drag or press any key to fly · N cuts to the next shot',
    fly: 'Drag to look · W A S D move · Q E down / up · Shift fast · wheel speed · H hides the panel',
    boat: 'Drag to orbit the yacht · wheel zooms',
    dive: 'Drag to look around underwater · wheel zooms',
    deck: matchMedia('(pointer: coarse)').matches?'Left pad walks · drag the scene to look · Take off returns to flight':'Drag to look · W A S D walk · Shift brisk pace · L takes off · Helm / Bow / Stern jump to a viewpoint',
  })[m];
  setHint(hintFor(rig.mode));
  const prev = rig.onChange;
  rig.onChange = m => { prev && prev(m); setHint(hintFor(m)); };
  return { sync };
}
