/**
 * The control studio, preset list, search and dialogs.
 *
 * Every widget is generated from schema.js rather than written out in HTML, so
 * adding a control is a one-line change in one file and the UI, the URL
 * serialiser and the tests all pick it up together.
 */

import { CONTROLS, LAYERS, GROUPS } from './schema.js?v=philly-2026090612';
import { WEATHER_PRESETS, dayLabel, clockLabel } from './solar.js?v=philly-2026090612';
import { getEra } from './eras.js?v=philly-2026090612';
import { PRESETS, QUICK_JUMPS } from './presets.js?v=philly-2026090612';
import { TOURS } from './tours.js?v=philly-2026090612';
import { ERAS } from './eras.js?v=philly-2026090612';
import { getTheme, THEME_IDS } from './themes.js?v=philly-2026090612';

const ENUM_LABELS = {
  theme: (v) => getTheme(v).label,
  quality: (v) => ({ auto: 'Auto', performance: 'Performance', balanced: 'Balanced',
    cinematic: 'Cinematic' }[v] || v),
  contourInterval: (v) => `${v} m`,
  floodMode: (v) => ({ fema: 'FEMA flood zones', slr: 'Sea level rise' }[v] || v),
  timeMode: (v) => ({ manual: 'Sliders', clock: 'Clock' }[v] || v),
  weather: (v) => WEATHER_PRESETS[v]?.label || v,
  era: (v) => getEra(v).label,
  imageryDetail: (v) => ({ data: 'Data Saver', standard: 'Standard',
    maximum: 'Maximum Detail' }[v] || v),
  compareMode: (v) => ({ off: 'Off', aerial: 'Aerial / relief',
    history: 'Present / selected era', flood: 'Normal / flood' }[v] || v),
};
const RANGE_LABELS = { dayOfYear: dayLabel, clockHour: clockLabel };

// A control's readout can carry a live note ("Auto · Balanced"); the
// note survives store syncs because formatValue folds it in.
const valueNotes = new Map();
const noteRefreshers = [];

/** Format a control's current value for its readout. */
export function formatValue(id, value) {
  const spec = CONTROLS[id];
  if (!spec) return String(value);
  const step = spec.step ?? 1;
  const digits = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  const base = spec.kind === 'enum'
    ? (ENUM_LABELS[id] || String)(value)
    : RANGE_LABELS[id] ? RANGE_LABELS[id](Number(value))
      : `${Number(value).toFixed(digits)}${spec.unit || ''}`;
  const note = valueNotes.get(id);
  return note ? `${base} · ${note}` : base;
}

/** The plain label of an enum option, never carrying a live note. */
export function enumLabel(id, value) {
  return (ENUM_LABELS[id] || String)(value);
}

/** Attach (or clear, with '') a live note to a control's readout. */
export function setValueNote(id, note) {
  valueNotes.set(id, note || '');
  for (const refresh of noteRefreshers) refresh(id);
}

export function buildControls(store, host) {
  const inputs = new Map();

  for (const group of GROUPS) {
    const entries = Object.entries(CONTROLS)
      .filter(([, c]) => c.group === group.id && c.ui !== false);
    if (!entries.length) continue;

    const section = el('details', 'control-group control-section');
    section.open = group.id === 'scene';
    section.appendChild(el('summary', 'group-head', group.label));

    for (const [id, spec] of entries) {
      const wrap = el('div', 'control');
      const labelRow = el('div', 'control-label');
      const name = el('label', null, spec.label);
      name.htmlFor = `ctl-${id}`;
      const value = el('span', 'control-value', formatValue(id, store.value(id)));
      labelRow.append(name, value);
      wrap.appendChild(labelRow);
      wrap.dataset.control = id;

      if (spec.kind === 'enum') {
        const seg = el('div', 'seg');
        seg.setAttribute('role', 'group');
        seg.setAttribute('aria-label', spec.label);
        const buttons = new Map();
        for (const option of spec.values) {
          const b = el('button', null, (ENUM_LABELS[id] || String)(option));
          b.type = 'button';
          b.setAttribute('aria-pressed', String(store.value(id) === option));
          b.addEventListener('click', () => store.set({ [id]: option }, { source: 'ui' }));
          buttons.set(option, b);
          seg.appendChild(b);
        }
        // The label row already names the group; the segment carries the id so
        // the label's `for` still lands somewhere focusable.
        seg.id = `ctl-${id}`;
        wrap.appendChild(seg);
        inputs.set(id, { kind: 'enum', buttons, value });
      } else {
        const input = document.createElement('input');
        input.type = 'range';
        input.id = `ctl-${id}`;
        input.min = String(spec.min);
        input.max = String(spec.max);
        input.step = String(spec.step ?? 1);
        input.value = String(store.value(id));
        input.setAttribute('aria-describedby', `ctl-${id}-val`);
        value.id = `ctl-${id}-val`;
        input.addEventListener('input', () => {
          store.set({ [id]: Number(input.value) }, { source: 'ui' });
        });
        wrap.appendChild(input);
        inputs.set(id, { kind: 'range', input, value });
        paintRange(input, spec);
      }

      if (spec.hint) wrap.appendChild(el('p', 'control-hint', spec.hint));
      section.appendChild(wrap);
    }
    host.appendChild(section);
  }

  function sync(state) {
    for (const [id, entry] of inputs) {
      const v = state[id];
      entry.value.textContent = formatValue(id, v);
      if (entry.kind === 'range') {
        if (document.activeElement !== entry.input) entry.input.value = String(v);
        paintRange(entry.input, CONTROLS[id]);
      } else {
        for (const [option, button] of entry.buttons) {
          button.setAttribute('aria-pressed', String(option === v));
        }
      }
    }
  }

  sync(store.get());
  noteRefreshers.push((id) => {
    const entry = inputs.get(id);
    if (entry) entry.value.textContent = formatValue(id, store.value(id));
  });

  return { sync };
}

/** Paint the filled portion of a range track (Chromium needs the variable). */
function paintRange(input, spec) {
  const pct = ((Number(input.value) - spec.min) / (spec.max - spec.min)) * 100;
  input.style.setProperty('--fill', `${Math.max(0, Math.min(100, pct))}%`);
}

export function buildLayerToggles(store, host) {
  const buttons = new Map();
  for (const [id, spec] of Object.entries(LAYERS)) {
    const b = el('button', 'layer-toggle');
    b.type = 'button';
    b.appendChild(el('span', 'dot'));
    b.appendChild(el('span', null, spec.label));
    b.setAttribute('aria-pressed', String(store.isLayerOn(id)));
    b.addEventListener('click', () => {
      if (b.disabled) return;
      store.set({ layers: { [id]: !store.isLayerOn(id) } }, { source: 'ui' });
    });
    buttons.set(id, b);
    host.appendChild(b);
  }

  return {
    sync(state) {
      for (const [id, b] of buttons) b.setAttribute('aria-pressed', String(!!state.layers[id]));
    },
    /** Grey out a layer whose data never arrived, and say why on hover. */
    disable(ids, reason) {
      for (const id of ids) {
        const b = buttons.get(id);
        if (!b) continue;
        b.disabled = true;
        b.title = reason;
      }
    },
  };
}

export function buildPresets(host, onSelect) {
  const cards = new Map();
  PRESETS.forEach((preset, i) => {
    const b = el('button', 'preset-card');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    // A baked preview of the shot (assets/previews, made by tools/previews.mjs).
    const thumb = document.createElement('img');
    thumb.className = 'p-thumb';
    thumb.src = `assets/previews/${preset.id}.jpg`;
    thumb.alt = '';
    thumb.width = 64;
    thumb.height = 34;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    const text = el('span', 'p-text');
    const index = el('span', 'p-index', String(i + 1));
    const name = el('span', 'p-name', preset.name);
    text.append(index, name);
    b.append(thumb, text);
    b.title = preset.blurb;
    b.addEventListener('click', () => onSelect(preset.id));
    cards.set(preset.id, b);
    host.appendChild(b);
  });
  return {
    sync(state) {
      for (const [id, b] of cards) b.setAttribute('aria-pressed', String(id === state.preset));
    },
  };
}

export function buildQuickJumps(host, onSelect, group = 'places') {
  for (const jump of QUICK_JUMPS) {
    if ((jump.group || 'places') !== group) continue;
    const b = el('button', 'chip', jump.name);
    b.type = 'button';
    b.addEventListener('click', () => onSelect(jump));
    host.appendChild(b);
  }
}

/**
 * Type-ahead over presets, curated jumps, landmarks and OSM place names.
 *
 * Ranking is deliberately simple and predictable: exact, then prefix, then
 * word-prefix, then substring, tie-broken by the entry's own importance. A
 * fuzzy matcher would surface stranger results without being more useful over
 * a list this size.
 */
export function createSearch(options) {
  const { input, results, entries, onSelect } = options;
  let matches = [];
  let active = -1;

  function norm(s) {
    // Strip combining marks so "Bryn Mawr" matches regardless of how the
    // query was typed or pasted.
    return String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  function score(entry, q) {
    const name = norm(entry.name);
    if (name === q) return 0;
    if (name.startsWith(q)) return 1;
    if (name.split(/[\s\-/]+/).some((w) => w.startsWith(q))) return 2;
    if (name.includes(q)) return 3;
    return Infinity;
  }

  function render() {
    results.innerHTML = '';
    if (!matches.length) {
      const empty = el('li', 'search-empty', 'Nothing matches that name.');
      empty.setAttribute('role', 'presentation');
      results.appendChild(empty);
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      return;
    }
    let lastGroup = null;
    matches.forEach((entry, i) => {
      // Results are grouped under a category heading in rank order.
      const group = entry.group || entry.kindLabel;
      if (group !== lastGroup) {
        const head = el('li', 'search-group', group);
        head.setAttribute('role', 'presentation');
        results.appendChild(head);
        lastGroup = group;
      }
      const li = el('li');
      li.setAttribute('role', 'option');
      li.id = `search-opt-${i}`;
      li.setAttribute('aria-selected', String(i === active));
      li.append(el('span', null, entry.name), el('span', 'r-kind', entry.kindLabel));
      li.addEventListener('mousedown', (event) => {
        event.preventDefault();     // keep focus so blur does not close first
        choose(i);
      });
      results.appendChild(li);
    });
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', active >= 0 ? `search-opt-${active}` : '');
  }

  function close() {
    results.hidden = true;
    results.innerHTML = '';
    active = -1;
    matches = [];
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function choose(i) {
    const entry = matches[i];
    if (!entry) return;
    input.value = '';
    close();
    input.blur();
    onSelect(entry);
  }

  function update() {
    const q = norm(input.value.trim());
    if (q.length < 1) {
      close();
      return;
    }
    // "bridge:" or "tour:" style prefixes narrow to a category.
    const colon = q.indexOf(':');
    const filter = colon > 0 ? q.slice(0, colon).trim() : '';
    const term = colon > 0 ? q.slice(colon + 1).trim() : q;
    const pool = filter
      ? entries.filter((e) => norm(e.group || e.kindLabel).startsWith(filter)
        || norm(e.kindLabel).startsWith(filter))
      : entries;
    const ranked = pool
      .map((entry) => ({ entry, s: term ? score(entry, term) : 1 }))
      .filter((m) => m.s !== Infinity)
      .sort((a, b) => (a.s - b.s)
        || (a.entry.priority - b.entry.priority)
        || a.entry.name.length - b.entry.name.length)
      .slice(0, 12)
      .map((m) => m.entry);
    // Keep rank order but gather each category's hits together.
    const order = [];
    for (const e of ranked) {
      const g = e.group || e.kindLabel;
      if (!order.includes(g)) order.push(g);
    }
    matches = order.flatMap((g) => ranked.filter((e) => (e.group || e.kindLabel) === g));
    active = matches.length ? 0 : -1;
    render();
  }

  // A blur schedules the close a beat later so a click on a result lands
  // first; typing again within that beat must cancel it, or the results a
  // fast typist just asked for are wiped from under the Enter key.
  let blurTimer = 0;
  input.addEventListener('input', () => { clearTimeout(blurTimer); update(); });
  input.addEventListener('focus', () => { clearTimeout(blurTimer); if (input.value.trim()) update(); });
  input.addEventListener('blur', () => { blurTimer = setTimeout(close, 120); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!matches.length) return;
      active = (active + (event.key === 'ArrowDown' ? 1 : matches.length - 1)) % matches.length;
      render();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(active >= 0 ? active : 0);
    } else if (event.key === 'Escape') {
      input.value = '';
      close();
      input.blur();
    }
    event.stopPropagation();     // do not let map shortcuts fire while typing
  });

  return { close };
}

/**
 * Build the search index. Curated entries outrank OSM place nodes so
 * "Valley Forge" lands on the authored shot rather than a nearby hamlet.
 */
export function buildSearchIndex(placesGeojson, landmarksDoc, extras = {}) {
  const entries = [];
  const cards = extras.cards || {};

  for (const preset of PRESETS) {
    entries.push({
      name: preset.name, kind: 'preset', kindLabel: 'Scene', group: 'Scenes',
      presetId: preset.id, priority: 0,
    });
  }
  for (const tour of Object.values(TOURS || {})) {
    entries.push({
      name: tour.name, kind: 'tour', kindLabel: 'Tour', group: 'Tours',
      tourId: tour.id, priority: 0.5,
    });
  }
  for (const era of ERAS) {
    if (era.id === 'present') continue;
    entries.push({
      name: `${era.label} (historical view)`, kind: 'era', kindLabel: 'Era', group: 'Eras',
      eraId: era.id, priority: 0.7,
    });
  }
  entries.push({ name: 'FEMA flood zones', kind: 'flood', kindLabel: 'Layer', group: 'Layers',
    floodMode: 'fema', priority: 0.8 });
  entries.push({ name: 'Sea level rise', kind: 'flood', kindLabel: 'Layer', group: 'Layers',
    floodMode: 'slr', priority: 0.8 });
  for (const jump of QUICK_JUMPS) {
    const bridge = jump.group === 'structures';
    entries.push({
      name: jump.name, kind: 'jump', kindLabel: bridge ? 'Bridge' : 'Place',
      group: bridge ? 'Bridges & structures' : 'Places',
      jump, lon: jump.lon, lat: jump.lat, priority: 1,
    });
  }
  const seen = new Set(entries.map((e) => e.name.toLowerCase()));

  for (const l of landmarksDoc?.landmarks || []) {
    if (seen.has(l.n.toLowerCase())) continue;
    seen.add(l.n.toLowerCase());
    const category = cards[l.n]?.category;
    entries.push({
      name: l.n, kind: 'landmark', kindLabel: category || 'Landmark', group: 'Landmarks',
      lon: l.lon, lat: l.lat, note: l.d, viewPreset: l.viewPreset, priority: 2 + (l.r ?? 2) * 0.1,
      card: !!cards[l.n],
    });
  }
  for (const feature of placesGeojson?.features || []) {
    const p = feature.properties || {};
    if (!p.n || seen.has(p.n.toLowerCase())) continue;
    seen.add(p.n.toLowerCase());
    const [lon, lat] = feature.geometry?.coordinates || [];
    entries.push({
      name: p.n, kind: 'place', kindLabel: labelForPlaceKind(p.k), group: 'Places',
      lon, lat, priority: 4 + (p.rank ?? 3) * 0.1,
    });
  }
  return entries;
}

function labelForPlaceKind(kind) {
  return {
    city: 'City', borough: 'Borough', town: 'Town', village: 'Village',
    suburb: 'Suburb', neighbourhood: 'Neighborhood',
  }[kind] || 'Place';
}

/**
 * Modal plumbing: focus goes into the dialog on open and returns to whatever
 * opened it on close, and Tab is kept inside while it is up.
 */
export function createDialogs(ids) {
  const dialogs = new Map();
  let openId = null;
  let restoreTo = null;

  for (const id of ids) {
    const node = document.getElementById(id);
    if (node) dialogs.set(id, node);
  }

  function focusables(node) {
    return [...node.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((el2) => !el2.disabled && el2.offsetParent !== null);
  }

  function open(id) {
    const node = dialogs.get(id);
    if (!node) return;
    if (openId) close();
    restoreTo = document.activeElement;
    node.hidden = false;
    openId = id;
    const first = focusables(node)[0];
    if (first) first.focus();
  }

  function close() {
    if (!openId) return;
    const node = dialogs.get(openId);
    if (node) node.hidden = true;
    openId = null;
    if (restoreTo && restoreTo.focus) restoreTo.focus();
    restoreTo = null;
  }

  document.addEventListener('keydown', (event) => {
    if (!openId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      const node = dialogs.get(openId);
      const items = focusables(node);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }, true);

  for (const [, node] of dialogs) {
    node.addEventListener('click', (event) => {
      if (event.target === node) close();     // click the scrim
    });
    node.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', close);
    });
  }

  return { open, close, get openId() { return openId; } };
}

/**
 * The landmark information card: a non-modal panel that names its sources.
 * `cards` is the cards document (name -> card); `onFly(name)` flies the camera;
 * `onChange(name|null)` reports what is open so the map can highlight it.
 */
export function createCard(options) {
  const { cards, onFly, onChange } = options;
  const node = document.getElementById('card');
  if (!node) return { open() { return false; }, close() {}, get openName() { return null; } };
  const title = node.querySelector('#cardTitle');
  const kind = node.querySelector('#cardKind');
  const facts = node.querySelector('#cardFacts');
  const text = node.querySelector('#cardText');
  const sources = node.querySelector('#cardSources');
  const note = node.querySelector('#cardNote');
  const fly = node.querySelector('#cardFly');
  let openName = null;
  let openRecord = null;
  let restoreTo = null;

  function render(name, card, { focus = true } = {}) {
    if (!card) return false;
    if (!openName) restoreTo = document.activeElement;
    openName = name;
    openRecord = card;
    kind.textContent = card.category || 'Landmark';
    title.textContent = name;
    facts.replaceChildren(...card.facts.flatMap(([label, value]) => [
      el('dt', null, label), el('dd', null, value)]));
    text.textContent = card.text;
    sources.replaceChildren(...card.sources.flatMap(([label, url], i) => {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = label;
      return i ? [document.createTextNode(' · '), a] : [a];
    }));
    note.textContent = card.note || (card.model ? 'Schematic model' : 'Real footprint');
    fly.textContent = card.building ? 'Zoom to roof' : 'Fly here';
    node.hidden = false;
    // Toasts share the bottom edge on phones; tell the stylesheet how tall
    // the card is so they can sit above it.
    document.body.classList.add('card-open');
    document.body.style.setProperty('--card-h', `${node.offsetHeight}px`);
    if (focus) fly.focus();
    if (onChange) onChange(name, card);
    return true;
  }

  function open(name, options = {}) {
    return render(name, cards?.[name], options);
  }

  function openCustom(name, card, options = {}) {
    return render(name, card, options);
  }

  function close() {
    if (!openName) return;
    openName = null;
    openRecord = null;
    node.hidden = true;
    document.body.classList.remove('card-open');
    document.body.style.removeProperty('--card-h');
    if (restoreTo && restoreTo.focus && document.contains(restoreTo)) restoreTo.focus();
    restoreTo = null;
    if (onChange) onChange(null);
  }

  node.querySelector('#cardClose').addEventListener('click', close);
  fly.addEventListener('click', () => {
    if (openName && onFly) onFly(openName, openRecord);
  });

  return { open, openCustom, close, get openName() { return openName; } };
}

/** The era banner: what this historical view can and cannot show, with sources. */
export function renderEraBanner(node, era, onPresent) {
  if (!node) return;
  if (!era || era.id === 'present') {
    node.hidden = true;
    node.replaceChildren();
    return;
  }
  const head = el('div', 'era-head');
  head.append(el('strong', null, era.label), el('span', 'era-tag', 'historical view'));
  const note = el('p', 'era-note', era.note);
  const sources = el('p', 'era-sources');
  sources.append(document.createTextNode('Sources: '));
  era.sources.forEach(([label, url], i) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = label;
    if (i) sources.append(document.createTextNode(' · '));
    sources.append(a);
  });
  const back = el('button', 'text-btn era-back', 'Back to the present');
  back.type = 'button';
  back.addEventListener('click', () => onPresent && onPresent());
  node.replaceChildren(head, note, sources, back);
  node.hidden = false;
}

/** Render (or hide) the flood legend under the layer toggles. */
export function renderFloodLegend(node, legend) {
  if (!node) return;
  if (!legend) {
    node.hidden = true;
    node.replaceChildren();
    return;
  }
  const rows = legend.rows.map((row) => {
    const r = el('div', 'legend-row');
    const swatch = el('span', 'legend-swatch');
    swatch.style.background = row.color;
    r.append(swatch, el('span', null, row.label));
    return r;
  });
  const source = el('p', 'legend-source');
  source.append(document.createTextNode(`${legend.source} · `));
  const link = document.createElement('a');
  link.href = legend.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'source';
  source.appendChild(link);
  node.replaceChildren(el('div', 'legend-title', legend.title), ...rows, source,
    el('p', 'legend-caveat', legend.caveat));
  node.hidden = false;
}

/** Apply a theme's UI colours to the document. */
export function applyThemeChrome(themeId) {
  const theme = getTheme(THEME_IDS.includes(themeId) ? themeId : 'dusk');
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.ui.bg);
  root.style.setProperty('--panel', theme.ui.panel);
  root.style.setProperty('--panel-blur', hexWithAlpha(theme.ui.panel, 0.74));
  root.style.setProperty('--accent', theme.ui.accent);
  root.style.setProperty('--text', theme.ui.text);
  root.style.setProperty('--muted', hexWithAlpha(theme.ui.text, 0.62));
  root.style.setProperty('--line', hexWithAlpha(theme.ui.text, 0.14));
  root.style.setProperty('--line-strong', hexWithAlpha(theme.ui.text, 0.28));
  root.style.setProperty('--label-ink', theme.ink);
  root.style.setProperty('--label-muted', theme.inkMuted);
  root.style.setProperty('--label-halo', theme.halo);
  root.style.setProperty('--label-accent', theme.ui.accent);
  document.body.dataset.theme = themeId;
}

function hexWithAlpha(hex, alpha) {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

let toastTimer = 0;
export function toast(message) {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
