// Player settings: defaults, persistence, applying them to the engine,
// renderer and audio, and the DOM panel that edits them.
import { VIEW_FX } from './engine.js';

const KEY = 'voxel-engine.settings.v1';
export const SCENES = ['Town', 'Firing range', 'Demolition yard', 'High-rise', 'Gorge bridges', 'The works', 'Castle keep', 'New York'];
// A scene that wants its own sun: [azimuth, elevation] for
// renderer.setSun. New York's stands in line with Broadway, behind the
// player at the start, high enough to shine between the ties of the el:
// their shadows stripe the roadway.
export const SCENE_SUN = { 'New York': [Math.PI / 2 + 0.12, 1.0] };
const DEFAULTS = { sens: 1, touchSens: 1, invertY: false, fov: 75, scale: 1, quality: 'auto', volume: 0.8, shake: 1, bob: true };
const RANGE = { sens: [0.2, 3], touchSens: [0.3, 3], fov: [60, 110], scale: [0.4, 1], volume: [0, 1], shake: [0, 1.5] };
const QUALITIES = ['auto', 'low', 'medium', 'high'];
const FORMAT = {
  sens: (v) => v.toFixed(2) + 'x',
  touchSens: (v) => v.toFixed(2) + 'x',
  fov: (v) => v.toFixed(0) + '°',
  scale: (v) => Math.round(v * 100) + '%',
  volume: (v) => (v > 0 ? Math.round(v * 100) + '%' : 'off'),
  shake: (v) => (v > 0 ? Math.round(v * 100) + '%' : 'off'),
};

// Stored settings are untrusted (old versions, hand edits): keep only known
// keys with values of the right type and range.
function sanitize(raw) {
  const s = { ...DEFAULTS };
  if (!raw || typeof raw !== 'object') return s;
  for (const k of Object.keys(RANGE)) {
    const v = Number(raw[k]);
    if (raw[k] != null && Number.isFinite(v)) s[k] = Math.min(RANGE[k][1], Math.max(RANGE[k][0], v));
  }
  if (typeof raw.invertY === 'boolean') s.invertY = raw.invertY;
  if (typeof raw.bob === 'boolean') s.bob = raw.bob;
  if (QUALITIES.includes(raw.quality)) s.quality = raw.quality;
  return s;
}

function load() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return sanitize(null);
  }
}

export function createSettings(ctx) {
  const { sim, renderer, params } = ctx;
  const s = load();
  // A scene number past the table is the town, as it is for the engine
  // (so the pickers never grow a chip per number of a hostile link).
  const asked = Number(params.get('scene') || 0) | 0;
  const scene = asked >= 0 && asked < SCENES.length ? asked : 0;
  // What the renderer chose for itself, to return to when the user picks Auto.
  const bootQuality = typeof renderer.quality === 'string' ? renderer.quality : null;
  let appliedQuality = 'auto';
  let appliedVolume = -1;
  let audioChecked = false;
  const controls = [];
  const rows = {};

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      // Private browsing or a sandboxed frame: settings last for the session.
    }
  }

  // ctx.audio is created after the game, so volume is pushed from here on
  // every frame until it sticks (two compares when nothing changed).
  function sync() {
    const a = ctx.audio;
    if (!a) return;
    if (!audioChecked) {
      audioChecked = true;
      // No dead controls: a silent build has no volume slider.
      if (!a.setVolume && rows.volume) rows.volume.hidden = true;
    }
    if (s.volume !== appliedVolume && a.setVolume) {
      a.setVolume(s.volume);
      appliedVolume = s.volume;
    }
  }

  function apply() {
    // (?push=measured: the player's measured push, a rule being judged; off
    // without it. Through the same command as the camera's options, so that
    // a replay of the session plays it too.)
    const push = params.get('push') === 'measured' ? VIEW_FX.MEASURED_PUSH || 0 : 0;
    // (?overhead=side: a piece that lies lower than the head is a side;
    // judged the same way.)
    const overhead = params.get('overhead') === 'side' ? VIEW_FX.LOW_OVERHEAD || 0 : 0;
    // (?sides=near: a side stood a little clear of still stops the speed
    // that would carry them into it; judged the same way.)
    const sides = params.get('sides') === 'near' ? VIEW_FX.NEAR_SIDES || 0 : 0;
    // (?climb=through: a way up that is begun is taken to its end.)
    const climb = params.get('climb') === 'through' ? VIEW_FX.WAY_UP || 0 : 0;
    sim.command('playerConfig', (s.bob ? VIEW_FX.ALL : 0) | push | overhead | sides | climb, s.fov);
    // An explicit ?scale= or ?quality= in the URL (benchmarks, the harness)
    // wins over the stored setting.
    if (!params.has('scale')) renderer.renderScale = s.scale;
    if (renderer.setQuality && !params.has('quality') && s.quality !== appliedQuality) {
      const q = s.quality === 'auto' ? bootQuality : s.quality;
      if (q) renderer.setQuality(q);
      appliedQuality = s.quality;
    }
    sync();
  }

  function refresh() {
    for (const c of controls) c();
  }

  function bind(root) {
    for (const el of root.querySelectorAll('[data-set]')) {
      const key = el.dataset.set;
      // A control alone under its heading hides together with the heading.
      rows[key] = el.closest('[data-group]') || el.closest('.row');
      if (el.type === 'range') {
        const out = el.parentElement.querySelector('output');
        const show = () => {
          el.value = s[key];
          out.textContent = FORMAT[key](s[key]);
        };
        el.addEventListener('input', () => {
          s[key] = Number(el.value);
          out.textContent = FORMAT[key](s[key]);
          apply();
        });
        el.addEventListener('change', save);
        if (key === 'scale' && params.has('scale')) el.disabled = true;
        controls.push(show);
      } else if (el.type === 'checkbox') {
        el.addEventListener('change', () => {
          s[key] = el.checked;
          apply();
          save();
        });
        controls.push(() => { el.checked = s[key]; });
      } else {
        const buttons = [...el.querySelectorAll('button')];
        for (const b of buttons) {
          if (params.has(key)) b.disabled = true;
          b.addEventListener('click', () => {
            s[key] = b.dataset.v;
            refresh();
            apply();
            save();
          });
        }
        controls.push(() => {
          for (const b of buttons) b.classList.toggle('on', b.dataset.v === s[key]);
        });
      }
    }
    const reset = root.querySelector('#reset');
    if (reset) {
      reset.addEventListener('click', () => {
        Object.assign(s, DEFAULTS);
        refresh();
        apply();
        save();
      });
    }
    if (!renderer.setQuality) rows.quality.hidden = true;
    refresh();
  }

  // Scene chips reload the page on the picked scene. The choice travels in
  // session storage, not the query string (main.js reads it back), so it
  // also works on hosts that hand the page no query; a ?scene= left over
  // from a link is dropped so it does not overrule the pick.
  function scenePicker(box) {
    for (let i = 0; i < SCENES.length; i++) {
      const b = document.createElement('button');
      b.textContent = SCENES[i];
      b.classList.toggle('on', i === scene);
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (i === scene) return;
        try { sessionStorage.setItem('vx.scene', String(i)); } catch (e) { /* falls back to the query below */ }
        const p = new URLSearchParams(location.search);
        // An objective is one of the scene it was linked with.
        p.delete('objective');
        let stored = null;
        try { stored = sessionStorage.getItem('vx.scene'); } catch (e) { /* no storage */ }
        if (stored === String(i)) p.delete('scene');
        else p.set('scene', String(i));
        const q = p.toString();
        if (q === location.search.replace(/^\?/, '')) location.reload();
        else location.search = q;
      });
      box.appendChild(b);
    }
  }

  for (const box of document.querySelectorAll('[data-scenes]')) scenePicker(box);
  apply();
  return { values: s, scene, apply, sync, bind, save };
}
