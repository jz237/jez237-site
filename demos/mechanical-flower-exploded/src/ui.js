// DOM / SVG poster layer for "Mechanical Flower — Exploded View".
// Pure DOM, no frameworks, no network. All geometry is in reference-image pixels (1122 x 1402)
// and mounted with percentage positions so the poster scales uniformly.
//
// Exports:
//   initUI(api) -> { frame(state), insetRects(), select(id), relayout() }
//   api   = { setExplode(v), setBloom(v), setPlaying(bool), setTheme?(name), getState() }
//   state = { explode, bloom, anchors:{[id]:{x,y,visible}}, playing? }   (anchors in poster fractions)
// Events dispatched on window:  'flower:focus' {detail:{id|null}}
// Events listened on window:    'flower:ready'  (fades #loading)

import { POSTER, TITLE, TAGLINE, FOOTER, DIMENSIONS, BLOOM_STAGES, CALLOUTS, INSETS } from './spec.js';

const W = POSTER.w;
const H = POSTER.h;
const SVGNS = 'http://www.w3.org/2000/svg';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const f1 = (n) => (Math.round(n * 10) / 10).toString();

/* ------------------------------------------------------------------ layout tables */

// Reference positions. `ul` = y of the title underline, x = left edge of title/body text,
// lines = words per body line (matches the reference wrapping independent of font metrics),
// ts = title font scale (the reference title widths vary a little from callout to callout).
const CO_LAYOUT = {
  outerPetals: { x: 37, ul: 153, lines: [4, 3, 5, 3], ts: 1.025 },
  innerPetals: { x: 37, ul: 323, lines: [4, 3, 4, 2], ts: 1.05 },
  stamenCage: { x: 37, ul: 496, lines: [3, 5, 5], ts: 1.02 },
  filigreeRing: { x: 37, ul: 654, lines: [4, 3, 5], ts: 0.93 },
  leafPanel: { x: 37, ul: 935, lines: [3, 4, 3, 2], ts: 1.02 },
  core: { x: 738, ul: 552, lines: [4, 3, 4, 1] },
  driveGears: { x: 738, ul: 806, lines: [4, 3, 5] },
  braidedStem: { x: 714, ul: 910, lines: [4, 2, 4], ts: 0.935 },
  retentionCollar: { x: 713, ul: 1211, lines: [3, 3, 3], ts: 0.926 },
  stemSegment: { x: 713, ul: 1317, lines: [3, 4], ts: 0.92 },
};

// Inset windows (poster px). Boxes are the framed cards around them.
const INSET_LAYOUT = {
  core: { win: { x: 931, y: 222, w: 159, h: 140 }, box: { x: 918, y: 194, w: 184, h: 214 }, cap: [4, 3] },
  gear: { win: { x: 931, y: 455, w: 159, h: 140 }, box: { x: 918, y: 427.5, w: 184, h: 214 }, cap: [3, 3] },
  enamel: { win: { x: 931, y: 687, w: 159, h: 140 }, box: { x: 918, y: 660.5, w: 184, h: 211 }, cap: [2, 3] },
};

// Bloom-sequence lotus silhouettes: poster-px geometry, receptacle sits 26px above the ground line.
const STAGE_LAYOUT = {
  closed: {
    box: { x: 44, y: 1132, w: 56, h: 142 }, cx: 72, ground: 1252, gw: 24, axis: true, seed: 11,
    layers: [{ n: 5, span: 44, L: 48, W: 12 }, { n: 3, span: 20, L: 56, W: 11 }],
  },
  initiation: {
    box: { x: 110, y: 1132, w: 84, h: 142 }, cx: 151.5, ground: 1252, gw: 36, axis: true, seed: 23,
    layers: [{ n: 5, span: 84, L: 36, W: 14 }, { n: 5, span: 56, L: 52, W: 14 }, { n: 3, span: 16, L: 68, W: 12 }],
  },
  expansion: {
    box: { x: 202, y: 1132, w: 86, h: 142 }, cx: 245, ground: 1252, gw: 38, seed: 37,
    layers: [{ n: 6, span: 134, L: 42, W: 16, bend: 0.2 }, { n: 7, span: 88, L: 56, W: 15, bend: 0.08 }, { n: 5, span: 40, L: 70, W: 13 }, { n: 3, span: 10, L: 81, W: 11 }],
  },
  full: {
    box: { x: 298, y: 1132, w: 110, h: 142 }, cx: 353.5, ground: 1252, gw: 44, seed: 53,
    layers: [{ n: 8, span: 168, L: 50, W: 18, bend: 0.22 }, { n: 7, span: 116, L: 58, W: 16, bend: 0.1 }, { n: 7, span: 70, L: 70, W: 15 }, { n: 5, span: 34, L: 80, W: 13 }, { n: 3, span: 8, L: 89, W: 11 }],
  },
};

/* ------------------------------------------------------------------ tiny DOM helpers */

function h(tag, cls, text, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

function s(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

// Position an element in poster px, expressed as % of the poster box.
function place(el, x, y, w, hh) {
  el.style.left = `${(x / W) * 100}%`;
  el.style.top = `${(y / H) * 100}%`;
  if (w != null) el.style.width = `${(w / W) * 100}%`;
  if (hh != null) el.style.height = `${(hh / H) * 100}%`;
  return el;
}

// Fill `el` with one block span per line, wrapping by words-per-line counts.
function setLines(el, text, counts) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let i = 0;
  if (counts) {
    for (const c of counts) {
      if (i >= words.length) break;
      lines.push(words.slice(i, i + c).join(' '));
      i += c;
    }
  }
  if (i < words.length) {
    if (lines.length) lines[lines.length - 1] += ` ${words.slice(i).join(' ')}`;
    else lines.push(words.join(' '));
  }
  for (const l of lines) h('span', 'ln', l, el);
  return el;
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ line-art generators */

const chamfer = (x, y, w, hh, c = 4) =>
  `M${x + c},${y}H${x + w - c}L${x + w},${y + c}V${y + hh - c}L${x + w - c},${y + hh}H${x + c}L${x},${y + hh - c}V${y + c}Z`;

// Petal outline, tip optionally curled sideways by `b` px (quadratic in height).
function petalD(L, Wd, b = 0) {
  const P = (x, y) => `${f1(x + b * (y / L) * (y / L))},${f1(y)}`;
  return `M0,0C${P(-Wd * 1.1, -L * 0.22)} ${P(-Wd * 0.95, -L * 0.78)} ${P(0, -L)}` +
    `C${P(Wd * 0.95, -L * 0.78)} ${P(Wd * 1.1, -L * 0.22)} 0,0Z`;
}
function veinD(L, Wd, b = 0) {
  const P = (x, y) => `${f1(x + b * (y / L) * (y / L))},${f1(y)}`;
  return `M${P(0, -L * 0.1)}L${P(0, -L * 0.5)}L${P(0, -L * 0.9)}` +
    `M${P(0, -L * 0.3)}Q${P(-Wd * 0.35, -L * 0.45)} ${P(-Wd * 0.5, -L * 0.64)}` +
    `M${P(0, -L * 0.3)}Q${P(Wd * 0.35, -L * 0.45)} ${P(Wd * 0.5, -L * 0.64)}` +
    `M${P(0, -L * 0.52)}Q${P(-Wd * 0.22, -L * 0.62)} ${P(-Wd * 0.28, -L * 0.78)}` +
    `M${P(0, -L * 0.52)}Q${P(Wd * 0.22, -L * 0.62)} ${P(Wd * 0.28, -L * 0.78)}`;
}

// Layered lotus head with its receptacle at (0,0) of group `g`. Back-to-front painter's order.
// A layer is { n, span, L, W } (evenly fanned) or { angles:[deg...], L, W }; `bend` curls tips outward.
function drawLotus(g, layers, seed, classes = { p: 'lp', v: 'lv' }) {
  const rnd = mulberry32(seed);
  for (const ly of layers) {
    const items = [];
    const angles = ly.angles || Array.from({ length: ly.n }, (_, i) => (ly.n > 1 ? i / (ly.n - 1) - 0.5 : 0) * ly.span);
    for (const base of angles) {
      items.push({
        t: base / 90,
        a: base + (rnd() - 0.5) * 3,
        L: ly.L * (1 + (rnd() - 0.5) * 0.08),
        Wd: ly.W * (1 + (rnd() - 0.5) * 0.1),
      });
    }
    items.sort((p, q) => Math.abs(q.t) - Math.abs(p.t));
    for (const it of items) {
      const dx = Math.sin((it.a * Math.PI) / 180) * 3.2;
      const bend = (ly.bend || 0) * it.L * Math.sign(it.a);
      const pg = s('g', { transform: `translate(${f1(dx)},0) rotate(${f1(it.a)})` }, g);
      s('path', { class: classes.p, d: petalD(it.L, it.Wd, bend) }, pg);
      s('path', { class: classes.v, d: veinD(it.L, it.Wd, bend) }, pg);
    }
  }
}

function drawCalyx(g, stemLen, thin) {
  s('path', { class: 'lp', d: 'M-6,-3C-8,2 -7,8 -3,12L3,12C7,8 8,2 6,-3Z' }, g);
  s('path', { class: 'st', d: 'M-3.5,10C-8,10.5 -12,7.5 -12.5,2.5M3.5,10C8,10.5 12,7.5 12.5,2.5' }, g);
  s('path', { class: 'st', d: 'M-1.5,12L-1.5,' + stemLen + 'M1.5,12L1.5,' + stemLen }, g);
  const tick = (y) => s('path', { class: 'st', d: `M-2.6,${y}q2.6,1.7 5.2,0` }, g);
  tick(12 + (stemLen - 12) * 0.4);
  if (!thin) tick(12 + (stemLen - 12) * 0.78);
}

/* ------------------------------------------------------------------ main */

export function initUI(api) {
  const poster = document.getElementById('poster');
  const overlay = document.getElementById('overlay');
  if (!overlay || !poster) throw new Error('initUI: #poster / #overlay missing');
  overlay.textContent = '';

  const startState = (api.getState && api.getState()) || {};
  let playing = startState.playing !== false;
  let theme = startState.theme === 'studio' ? 'studio' : 'poster';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    playing = false;
    api.setPlaying(false);
  }

  const mqNarrow = window.matchMedia('(max-width: 760px)');

  /* -------------------- static art layer -------------------- */
  const art = s('svg', { class: 'layer', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, overlay);
  const defs = s('defs', null, art);
  let gradN = 0;
  // x1->x2 gradient from transparent to gold (or reverse)
  const fadeGrad = (x1, x2, both = false) => {
    const id = `fg${gradN++}`;
    const gr = s('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1, y1: 0, x2, y2: 0 }, defs);
    const stops = both
      ? [[0, 0], [0.25, 0.9], [0.75, 0.9], [1, 0]]
      : [[0, 0], [0.6, 0.85], [1, 1]];
    for (const [o, a] of stops) s('stop', { offset: o, 'stop-color': '#b08a55', 'stop-opacity': a }, gr);
    return `url(#${id})`;
  };
  const rule = (x1, x2, y, mode) => {
    // mode: 'in-right' => strong at x2 ; 'in-left' => strong at x1 ; 'both'
    const stroke = mode === 'both' ? fadeGrad(x1, x2, true) : mode === 'in-right' ? fadeGrad(x1, x2) : fadeGrad(x2, x1);
    s('path', { d: `M${x1},${y}H${x2}`, fill: 'none', stroke, 'stroke-width': 1, 'stroke-linecap': 'round' }, art);
  };
  const diamond = (cx, cy, r = 4) => {
    s('path', { class: 'gl', d: `M${cx - r},${cy}L${cx},${cy - r * 0.8}L${cx + r},${cy}L${cx},${cy + r * 0.8}Z` }, art);
    s('circle', { class: 'gfill', cx, cy, r: 0.9 }, art);
  };
  const flourish = (x, y, rot) => {
    const g = s('g', { transform: `translate(${x},${y}) rotate(${rot})` }, art);
    s('path', { class: 'gl', d: 'M1.5,1.5C-1,-3 -7.5,-4.5 -9,-1C-10.5,2.5 -5.5,5.5 -2.5,3.2C-1,2 0,1 1.5,1.5' }, g);
    s('path', { class: 'gl', d: 'M3,-0.5C5,-5.5 11,-8 13,-4.5C14.5,-1.5 10,0.5 7.5,-0.5' }, g);
    s('path', { class: 'gl', d: 'M1.5,1.5L1.5,8M3,-0.5L9,-0.5' }, g);
  };

  // --- poster frame: left / right / bottom rules, top rules fading toward the title ---
  const FL = 19.5;
  const FR = 1102.5;
  const FT = 19.5;
  const FB = 1381.5;
  s('path', { class: 'gl soft', d: `M${FL},${FT + 8}V${FB - 8}M${FR},${FT + 8}V${FB - 8}M${FL + 8},${FB}H${FR - 8}` }, art);
  rule(FL + 8, 198, FT, 'in-left');
  rule(896, FR - 8, FT, 'in-right');
  flourish(FL, FT, 0);
  flourish(FR, FT, 90);
  flourish(FR, FB, 180);
  flourish(FL, FB, 270);

  // --- title ornament rule + diamonds (reference y=49.5) ---
  rule(222, 414, 49.5, 'in-right');
  diamond(423, 49.5);
  diamond(664, 49.5);
  rule(672, 861, 49.5, 'in-left');

  // --- tagline box (top-right) ---
  s('path', { class: 'gl', d: chamfer(915, 43.5, 177, 109.5, 4) }, art);
  s('path', { class: 'gl soft thin', d: chamfer(918.5, 47, 170, 102.5, 3) }, art);
  rule(951, 1052, 96, 'both');
  rule(970, 996, 153, 'in-right');
  rule(1010, 1036, 153, 'in-left');
  diamond(1003, 153, 4.2);

  // --- inset frames ---
  for (const i of INSETS) {
    const L = INSET_LAYOUT[i.id];
    if (!L) continue;
    s('path', { class: 'gl', d: chamfer(L.box.x, L.box.y, L.box.w, L.box.h, 3) }, art);
    diamond(L.box.x + L.box.w / 2, L.box.y + L.box.h, 2.6);
  }

  // --- bloom sequence panel ---
  s('path', { class: 'gl', d: chamfer(30, 1099, 387, 191, 4) }, art);
  rule(49, 400, 1129, 'both');

  // --- footer ornament ---
  rule(187, 222, 1365, 'in-right');
  rule(240, 277, 1365, 'in-left');
  diamond(231, 1365, 4.4);

  // --- dimension panel sketch ---
  const dg = s('g', null, art);
  s('path', { class: 'guide', d: 'M918.5,1068V1332M1081.5,1300V1332M925,1068.5H1092M1012,1301.5H1086' }, dg);
  // leaves (behind stem)
  const leafL = s('g', null, dg);
  s('path', { class: 'sk fillp', d: 'M985,1236C970,1238 945,1228 924,1210C938,1197 960,1192 976,1206C984,1214 988,1226 985,1236Z' }, leafL);
  s('path', { class: 'sk faint', d: 'M927,1211C948,1214 970,1226 984,1235M941,1202C948,1210 956,1219 962,1224M953,1197C960,1204 967,1212 973,1219M946,1214C952,1224 962,1230 970,1233M964,1201C968,1208 974,1214 978,1222' }, leafL);
  const leafR = s('g', null, dg);
  s('path', { class: 'sk fillp', d: 'M1003,1268C999,1246 1020,1226 1046,1229C1057,1232 1063,1240 1064,1246C1050,1240 1031,1243 1020,1251C1012,1257 1007,1263 1003,1268Z' }, leafR);
  s('path', { class: 'sk faint', d: 'M1006,1260C1014,1244 1030,1233 1046,1232M1012,1262C1020,1250 1034,1242 1052,1241M1020,1244C1026,1238 1034,1234 1040,1233' }, leafR);
  // stem: outlined tube following a gentle S curve, slightly tapering
  const stemPath = 'M999,1161C1005,1188 996,1216 994,1250C993,1272 997,1288 999,1301';
  s('path', { d: stemPath, fill: 'none', stroke: '#6d655a', 'stroke-width': 16.6, 'stroke-linecap': 'butt' }, dg);
  s('path', { d: stemPath, fill: 'none', stroke: '#ece5d3', 'stroke-width': 15.2, 'stroke-linecap': 'butt' }, dg);
  s('path', { class: 'sk faint', d: 'M994,1166C1000,1190 991,1216 989,1250C988,1272 992,1288 994,1300M999,1166C1005,1190 996,1216 994,1250C993,1272 997,1288 999,1300M1004,1166C1010,1190 1001,1216 999,1250C998,1272 1002,1288 1004,1300' }, dg);
  for (const [nx, ny] of [[1004, 1176], [1002, 1204], [998, 1228], [995, 1255], [997, 1284]]) {
    s('path', { class: 'sk', d: `M${nx - 8},${ny}q8,4.4 16,0M${nx - 8},${ny + 3.2}q8,4.4 16,0` }, dg);
  }
  s('path', { class: 'sk faint', d: 'M1010,1163c4,-3 11,-1 8,4c-2,3 -7,1 -5,-3M988,1163c-4,-3 -11,-1 -8,4c2,3 7,1 5,-3' }, dg);
  // bloom (receptacle at 999,1156): wide, low outer petals, tall central dome
  const dBloom = s('g', { transform: 'translate(999,1157)' }, dg);
  drawLotus(dBloom, [
    { angles: [-82, -68, 68, 82], L: 54, W: 11 },
    { angles: [-62, -48, 48, 62], L: 78, W: 15, bend: 0.08 },
    { angles: [-42, -29, -16, 16, 29, 42], L: 74, W: 17, bend: 0.04 },
    { angles: [-28, -14, 0, 14, 28], L: 78, W: 17 },
    { angles: [-12, 0, 12], L: 86, W: 14 },
  ], 91, { p: 'sk fillp', v: 'sk faint' });
  // dimension arrows
  const arrowUp = (x, y) => s('path', { class: 'dimhead', d: `M${x},${y}l-2.7,7.5h5.4Z` }, dg);
  const arrowDown = (x, y) => s('path', { class: 'dimhead', d: `M${x},${y}l-2.7,-7.5h5.4Z` }, dg);
  const arrowLeft = (x, y) => s('path', { class: 'dimhead', d: `M${x},${y}l7.5,-2.7v5.4Z` }, dg);
  const arrowRight = (x, y) => s('path', { class: 'dimhead', d: `M${x},${y}l-7.5,-2.7v5.4Z` }, dg);
  s('path', { class: 'dim', d: 'M1079.5,1076V1177M1079.5,1208V1293' }, dg);
  arrowUp(1079.5, 1069);
  arrowDown(1079.5, 1300);
  s('path', { class: 'dim', d: 'M928,1318.5H967M1031,1318.5H1074' }, dg);
  arrowLeft(921, 1318.5);
  arrowRight(1081, 1318.5);
  s('path', { class: 'dim', d: 'M921.5,1306V1331M1081.5,1306V1331' }, dg);

  /* -------------------- text layer -------------------- */
  const title = h('h1', 'ov-abs ov-title', TITLE.main, overlay);
  place(title, 222, 7, 652);
  place(h('p', 'ov-abs ov-sub', TITLE.sub, overlay), 340, 38.5, 412);

  const tagHead = h('p', 'ov-abs ov-tag-head', null, overlay);
  setLines(tagHead, TAGLINE.head, [1, 2]);
  place(tagHead, 915, 55, 177);
  const tagBody = h('p', 'ov-abs ov-tag-body', null, overlay);
  setLines(tagBody, TAGLINE.body, [2, 3]);
  place(tagBody, 915, 101.5, 177);

  const footer = h('p', 'ov-abs ov-footer', null, overlay);
  setLines(footer, FOOTER, [2, 2]);
  place(footer, 70, 1311.5, 328);

  // inset titles / windows / captions
  const insetWin = {};
  for (const i of INSETS) {
    const L = INSET_LAYOUT[i.id];
    if (!L) continue;
    const t = h('p', 'ov-abs inset-title', i.title, overlay);
    place(t, L.win.x, L.box.y + 9.5);
    const win = h('div', 'inset-win', null, overlay);
    win.dataset.inset = i.id;
    place(win, L.win.x, L.win.y, L.win.w, L.win.h);
    insetWin[i.id] = win;
    const cap = h('p', 'ov-abs inset-cap', null, overlay);
    setLines(cap, i.caption, L.cap);
    place(cap, L.win.x, L.win.y + L.win.h + 6);
  }

  // bloom sequence labels + buttons
  place(h('p', 'ov-abs ov-bloom-title', 'BLOOM SEQUENCE (SECTION VIEW)', overlay), 49, 1108);

  const stageEls = [];
  for (const st of BLOOM_STAGES) {
    const L = STAGE_LAYOUT[st.id];
    if (!L) continue;
    const b = h('button', 'stage', null, overlay);
    b.type = 'button';
    b.dataset.stage = st.id;
    b.setAttribute('aria-label', `${st.label.charAt(0)}${st.label.slice(1).toLowerCase()} — set bloom`);
    b.setAttribute('aria-pressed', 'false');
    place(b, L.box.x, L.box.y, L.box.w, L.box.h);
    const svg = s('svg', { viewBox: `${L.box.x} ${L.box.y} ${L.box.w} ${L.box.h}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, b);
    s('path', { class: 'gr', d: `M${f1(L.cx - L.gw)},${L.ground}H${f1(L.cx + L.gw)}` }, svg);
    const g = s('g', { transform: `translate(${L.cx},${L.ground - 26})` }, svg);
    if (L.axis) {
      const top = Math.max(...L.layers.map((l) => l.L));
      s('path', { class: 'ax', d: `M0,${-top - 22}V${-top - 8}` }, g);
    }
    drawLotus(g, L.layers, L.seed);
    drawCalyx(g, 26, st.id === 'closed');
    s('ellipse', { class: 'st', cx: 0, cy: 25.5, rx: 3.4, ry: 1.1 }, g);
    const lab = h('span', 'bs-label', st.label, b);
    lab.style.top = `${((1258 - L.box.y) / L.box.h) * 100}%`;
    stageEls.push({ el: b, bloom: st.bloom, id: st.id });
  }

  // dimension labels
  const dimH = h('p', 'ov-abs ov-dim-label', DIMENSIONS.height, overlay);
  place(dimH, 1054, 1184, 48);
  dimH.style.textAlign = 'center';
  const dimW = h('p', 'ov-abs ov-dim-label', DIMENSIONS.width, overlay);
  place(dimW, 969, 1311, 60);
  dimW.style.textAlign = 'center';
  place(h('p', 'ov-abs ov-dim-caption', DIMENSIONS.caption, overlay), 883, 1337, 240);

  /* -------------------- callouts, dots, leaders -------------------- */
  const items = [];
  const byId = {};
  for (const c of CALLOUTS) {
    const L = CO_LAYOUT[c.id];
    if (!L) continue;
    const el = h('article', `callout ${c.side}`, null, overlay);
    el.tabIndex = 0;
    el.dataset.id = c.id;
    el.setAttribute('aria-label', c.title);
    const ttl = h('h3', 'co-title', c.title, el);
    const body = h('p', 'co-body', null, el);
    setLines(body, c.body, L.lines);
    place(el, L.x, L.ul - 26);
    if (L.ts) el.style.setProperty('--ts', L.ts);

    const dot = h('button', 'co-dot', null, overlay);
    dot.type = 'button';
    dot.dataset.id = c.id;
    dot.setAttribute('aria-label', c.title);
    dot.style.width = `${(64 / W) * 100}%`;
    dot.style.height = `${(64 / H) * 100}%`;

    const it = { c, el, ttl, dot, start: { x: L.x + 170, y: L.ul - 12.5 }, side: c.side, vis: 0, shown: false, sig: '' };
    items.push(it);
    byId[c.id] = it;
  }

  const leaders = s('svg', { class: 'layer', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, overlay);
  for (const it of items) {
    const g = s('g', { class: 'leader' }, leaders);
    g.style.display = 'none';
    it.g = g;
    it.solid = s('path', { class: 'solid' }, g);
    it.dash = s('path', { class: 'dash' }, g);
    it.end = s('circle', { class: 'end', r: 2.3 }, g);
  }
  // keep leaders above text but below the interactive buttons / dock
  overlay.appendChild(leaders);
  for (const it of items) overlay.appendChild(it.dot);

  /* -------------------- focus / selection model -------------------- */
  let hoverId = null;
  let selectedId = null;
  let effective = null;
  let lastPointerType = 'mouse';
  let readoutIndex = 0;

  const ro = {};
  function refreshHot() {
    const e = hoverId != null ? hoverId : selectedId;
    if (e === effective) return;
    effective = e;
    overlay.classList.toggle('has-hot', e != null);
    for (const it of items) {
      const on = it.c.id === e;
      it.el.classList.toggle('hot', on);
      it.dot.classList.toggle('hot', on);
      it.g.classList.toggle('hot', on);
    }
    window.dispatchEvent(new CustomEvent('flower:focus', { detail: { id: e } }));
  }
  function updateReadout() {
    const it = items[readoutIndex];
    if (!it || !ro.title) return;
    ro.title.textContent = it.c.title;
    ro.body.textContent = it.c.body;
    ro.count.textContent = `${readoutIndex + 1} / ${items.length}`;
  }
  function select(id, { toggle = false } = {}) {
    const idx = items.findIndex((it) => it.c.id === id);
    if (idx < 0) {
      selectedId = null;
      refreshHot();
      return;
    }
    readoutIndex = idx;
    updateReadout();
    selectedId = toggle && selectedId === id ? null : id;
    refreshHot();
  }
  function step(d) {
    const n = items.length;
    if (!n) return;
    select(items[(readoutIndex + d + n) % n].c.id);
  }

  for (const it of items) {
    const { el, dot } = it;
    el.addEventListener('pointerenter', (e) => {
      lastPointerType = e.pointerType || 'mouse';
      if (lastPointerType !== 'touch') { hoverId = it.c.id; readoutIndex = items.indexOf(it); updateReadout(); refreshHot(); }
    });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch' && hoverId === it.c.id) { hoverId = null; refreshHot(); }
    });
    el.addEventListener('focus', () => { hoverId = it.c.id; readoutIndex = items.indexOf(it); updateReadout(); refreshHot(); });
    el.addEventListener('blur', () => { if (hoverId === it.c.id) { hoverId = null; refreshHot(); } });
    el.addEventListener('pointerdown', (e) => { lastPointerType = e.pointerType || 'mouse'; });
    el.addEventListener('click', () => {
      if (lastPointerType === 'touch' || mqNarrow.matches) select(it.c.id, { toggle: true });
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        select(it.c.id, { toggle: true });
      }
    });
    dot.addEventListener('click', () => select(it.c.id, { toggle: true }));
  }

  /* -------------------- controls dock -------------------- */
  const dock = h('div', 'dock', null, overlay);
  dock.setAttribute('role', 'group');
  dock.setAttribute('aria-label', 'Flower controls');

  const playBtn = h('button', 'ctl-play', null, dock);
  playBtn.type = 'button';
  const iconPlay = s('svg', { class: 'i-play', viewBox: '0 0 10 10', 'aria-hidden': 'true' }, playBtn);
  s('path', { d: 'M2.2,1L9,5L2.2,9Z' }, iconPlay);
  const iconPause = s('svg', { class: 'i-pause', viewBox: '0 0 10 10', 'aria-hidden': 'true' }, playBtn);
  s('path', { d: 'M2,1H4V9H2ZM6,1H8V9H6Z' }, iconPause);

  const mkSlider = (labelText, aria, onInput) => {
    const lab = h('label', null, null, dock);
    h('span', null, labelText, lab);
    const inp = h('input', null, null, lab);
    inp.type = 'range';
    inp.min = '0';
    inp.max = '1';
    inp.step = '0.001';
    inp.value = '0';
    inp.setAttribute('aria-label', aria);
    inp.addEventListener('input', () => { onInput(parseFloat(inp.value)); paintSlider(inp); });
    return inp;
  };
  const paintSlider = (inp) => {
    inp.style.setProperty('--p', `${(parseFloat(inp.value) * 100).toFixed(1)}%`);
    inp.setAttribute('aria-valuetext', `${Math.round(parseFloat(inp.value) * 100)}%`);
  };
  const pauseForManual = () => { if (playing) setPlayingUI(false); };
  const exInput = mkSlider('Explode', 'Explode: 0 assembled, 1 exploded', (v) => { pauseForManual(); api.setExplode(v); });
  const blInput = mkSlider('Bloom', 'Bloom: 0 closed, 1 full bloom', (v) => { pauseForManual(); api.setBloom(v); });
  let dragEx = false;
  let dragBl = false;
  const dragHooks = (inp, set) => {
    inp.addEventListener('pointerdown', () => set(true));
    const up = () => set(false);
    inp.addEventListener('pointerup', up);
    inp.addEventListener('pointercancel', up);
    inp.addEventListener('blur', up);
  };
  dragHooks(exInput, (v) => { dragEx = v; });
  dragHooks(blInput, (v) => { dragBl = v; });

  let themeBtns = null;
  if (typeof api.setTheme === 'function') {
    h('span', 'sep', null, dock);
    const seg = h('div', 'seg', null, dock);
    seg.setAttribute('role', 'group');
    seg.setAttribute('aria-label', 'Display theme');
    themeBtns = {};
    for (const [name, label] of [['poster', 'Poster'], ['studio', 'Studio']]) {
      const b = h('button', null, label, seg);
      b.type = 'button';
      b.setAttribute('aria-label', `${label} theme`);
      b.addEventListener('click', (e) => {
        theme = name; paintTheme(); api.setTheme(name);
        if (e.detail) b.blur(); // pointer click: hand Space back to the global play toggle
      });
      themeBtns[name] = b;
    }
  }
  function paintTheme() {
    if (!themeBtns) return;
    for (const k in themeBtns) themeBtns[k].setAttribute('aria-pressed', String(k === theme));
  }

  function paintPlay() {
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-pressed', String(playing));
    playBtn.setAttribute('aria-label', playing ? 'Pause auto cycle' : 'Play auto cycle');
    playBtn.title = playing ? 'Pause (Space)' : 'Play (Space)';
  }
  function setPlayingUI(on) {
    playing = !!on;
    paintPlay();
    api.setPlaying(playing);
  }
  playBtn.addEventListener('click', () => setPlayingUI(!playing));
  paintPlay();
  paintTheme();

  for (const st of stageEls) {
    st.el.addEventListener('click', (e) => {
      pauseForManual();
      api.setBloom(st.bloom);
      if (e.detail) st.el.blur(); // pointer click: hand Space back to the global play toggle
    });
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const hint = h('div', 'hint', coarse ? 'drag to orbit · pinch to zoom' : 'drag to orbit · scroll to zoom', overlay);
  hint.setAttribute('aria-hidden', 'true');
  let hintTimer = 0;
  const startHintTimer = () => {
    if (hintTimer) return;
    hintTimer = setTimeout(() => hint.classList.add('gone'), 6000);
  };

  /* -------------------- narrow readout sheet -------------------- */
  const sheet = h('section', null, null, document.body);
  sheet.id = 'sheet';
  sheet.setAttribute('aria-label', 'Part readout');
  poster.insertAdjacentElement('afterend', sheet);
  const readout = h('div', null, null, sheet);
  readout.id = 'readout';
  readout.setAttribute('aria-live', 'polite');
  const prev = h('button', 'ro-btn', '‹', readout);
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous part');
  const roText = h('div', 'ro-text', null, readout);
  ro.title = h('h2', 'ro-title', null, roText);
  ro.body = h('p', 'ro-body', null, roText);
  ro.count = h('span', 'ro-count', null, roText);
  const next = h('button', 'ro-btn', '›', readout);
  next.type = 'button';
  next.setAttribute('aria-label', 'Next part');
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  updateReadout();

  function placeDock() {
    const target = mqNarrow.matches ? sheet : overlay;
    if (dock.parentNode !== target) target.appendChild(dock);
  }
  placeDock();
  if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', () => { placeDock(); relayout(); });

  /* -------------------- keyboard -------------------- */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (selectedId != null) { selectedId = null; refreshHot(); }
      return;
    }
    if (e.key !== ' ' && e.code !== 'Space') return;
    const t = e.target;
    const tag = t && t.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (t && t.classList && t.classList.contains('callout')) return;
    e.preventDefault();
    setPlayingUI(!playing);
  });

  /* -------------------- layout of leader starts -------------------- */
  function relayout() {
    const pr = poster.getBoundingClientRect();
    if (!pr.width || !pr.height) return;
    const kx = W / pr.width;
    const ky = H / pr.height;
    for (const it of items) {
      const r = it.ttl.getBoundingClientRect();
      if (!r.width) continue;
      const left = (r.left - pr.left) * kx;
      const right = (r.right - pr.left) * kx;
      const bottom = (r.bottom - pr.top) * ky;
      it.start = { x: it.side === 'left' ? right + 8 : left - 8, y: bottom - 13 };
      it.dot.style.left = `${(it.start.x / W) * 100}%`;
      it.dot.style.top = `${(it.start.y / H) * 100}%`;
      it.sig = '';
    }
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(relayout).observe(poster);
  window.addEventListener('resize', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();

  /* -------------------- loading -------------------- */
  const loading = document.getElementById('loading');
  const markReady = () => {
    if (loading) loading.classList.add('done');
    relayout();
    startHintTimer();
  };
  window.addEventListener('flower:ready', markReady, { once: true });
  if (window.__flowerReady) markReady();
  setTimeout(() => { if (loading && !loading.classList.contains('done')) markReady(); }, 30000);

  /* -------------------- per-frame update -------------------- */
  let lastFade = -1;
  let frames = 0;
  let nearest = -1;

  function leaderPath(it, ax, ay) {
    const dir = it.side === 'left' ? 1 : -1;
    const sx = it.start.x;
    const sy = it.start.y;
    const dx = (ax - sx) * dir;
    const dy = ay - sy;
    let ex;
    if (dx > 14) ex = sx + dir * Math.max(10, Math.min(dx - 4, dx - Math.abs(dy)));
    else ex = sx + dir * 10;
    const px = ex + (ax - ex) * 0.68;
    const py = sy + (ay - sy) * 0.68;
    return {
      solid: `M${f1(sx)},${f1(sy)}L${f1(ex)},${f1(sy)}L${f1(px)},${f1(py)}`,
      dash: `M${f1(px)},${f1(py)}L${f1(ax)},${f1(ay)}`,
    };
  }

  function frame(state) {
    if (!state) return;
    frames++;
    if (frames === 3 || frames === 30) relayout();
    const ex = clamp01(+state.explode || 0);
    const fade = smooth(0.35, 0.9, ex);
    if (fade !== lastFade) {
      lastFade = fade;
      overlay.style.setProperty('--fade', fade.toFixed(3));
      overlay.classList.toggle('co-off', fade < 0.03);
    }

    const anchors = state.anchors || {};
    for (const it of items) {
      const a = anchors[it.c.id];
      const want = a && a.visible !== false && fade > 0.01 ? 1 : 0;
      it.vis += (want - it.vis) * 0.3;
      if (Math.abs(want - it.vis) < 0.01) it.vis = want;
      if (it.vis <= 0) {
        if (it.shown) { it.g.style.display = 'none'; it.shown = false; }
        continue;
      }
      if (!it.shown) { it.g.style.display = ''; it.shown = true; }
      it.g.style.opacity = (fade * it.vis * (effective != null && effective !== it.c.id ? 0.45 : 1)).toFixed(3);
      if (a) {
        const ax = a.x * W;
        const ay = a.y * H;
        const sig = `${f1(ax)},${f1(ay)}`;
        if (sig !== it.sig) {
          it.sig = sig;
          const p = leaderPath(it, ax, ay);
          it.solid.setAttribute('d', p.solid);
          it.dash.setAttribute('d', p.dash);
          it.end.setAttribute('cx', f1(ax));
          it.end.setAttribute('cy', f1(ay));
        }
      }
    }

    // sliders follow state unless the user is dragging them
    const bl = clamp01(+state.bloom || 0);
    if (!dragEx && Math.abs(parseFloat(exInput.value) - ex) > 5e-4) { exInput.value = ex; paintSlider(exInput); }
    if (!dragBl && Math.abs(parseFloat(blInput.value) - bl) > 5e-4) { blInput.value = bl; paintSlider(blInput); }

    // highlight the bloom stage nearest to state.bloom
    let best = 0;
    let bd = 9;
    for (let i = 0; i < stageEls.length; i++) {
      const d = Math.abs(stageEls[i].bloom - bl);
      if (d < bd) { bd = d; best = i; }
    }
    if (best !== nearest) {
      nearest = best;
      stageEls.forEach((st, i) => {
        st.el.classList.toggle('on', i === best);
        st.el.setAttribute('aria-pressed', String(i === best));
      });
    }

    if (typeof state.playing === 'boolean' && state.playing !== playing) {
      playing = state.playing;
      paintPlay();
    }
  }

  const insetRects = () => {
    const out = {};
    for (const k in INSET_LAYOUT) {
      const r = INSET_LAYOUT[k].win;
      out[k] = { x: r.x / W, y: r.y / H, w: r.w / W, h: r.h / H };
    }
    return out;
  };

  paintSlider(exInput);
  paintSlider(blInput);

  return { frame, insetRects, select: (id) => select(id), relayout };
}
