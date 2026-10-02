// Rear stabilizer: four louvred cowl panels (black body, yellow trim, white barcode labels, corner screws) and the
// orchestration of the other stabilizer modules. Panels are armorPanels laid on the cowl surface of tail-common.js:
// plate x = arclength aft from the a = 9 rim, plate y = arclength around the panel's centre azimuth.
import { M, ex, V3, paint, armorPanel } from '../kit.js';
import { skSurface, sectorHalf, sOfA, SK_A1, sweepFrames, rrect, hexBolt, placeM, mergeList } from './tail-common.js';
import { buildRing } from './tail-ring.js';
import { buildGimbal } from './tail-gimbal.js';
import { buildSys } from './tail-sys.js';

const X0 = sOfA(9.36);            // front edge of the panels (just behind the mount ring)
const X1 = sOfA(SK_A1) - 0.02;    // aft edge
const TH = 0.14;                  // panel thickness; the outer face is flush with the cowl surface
const WHITE = paint('#ecebe4', { rough: 0.55, coat: 0.2 });
WHITE.name = 'barcode label';

const DEFS = [
  { id: 'louvered-panel-1', name: 'Dorsal Louvre Panel', phi: 0, half: 26, big: false, n: 8, side: 1, off: [-1.2, 3.0, 0], what: 'dorsal' },
  { id: 'louvered-panel-2', name: 'Starboard Louvre Panel', phi: 90, half: 36, big: true, n: 12, side: 1, off: [-3.0, 0, 3.4], what: 'starboard' },
  { id: 'louvered-panel-3', name: 'Ventral Louvre Panel', phi: 180, half: 26, big: false, n: 8, side: -1, off: [-1.2, -3.0, 0], what: 'ventral' },
  { id: 'louvered-panel-4', name: 'Port Louvre Panel', phi: 270, half: 36, big: true, n: 12, side: -1, off: [-3.0, 0, -3.4], what: 'port' },
];

/** Annular-sector outline in plate coordinates, inset by f (front), s (sides), b (aft); CCW. */
function sectorPts(half, { f = 0, s = 0, b = 0, rf = 0, rb = 0, n = 6 } = {}) {
  const xa = X0 + f, xb = X1 - b;
  const bot = [], top = [];
  for (let i = 0; i <= n; i++) {
    const x = xa + ((xb - xa) * i) / n;
    const w = sectorHalf(x, half) - s;
    const r = i === 0 ? rf : i === n ? rb : 0;
    bot.push([x, -w, r]);
    top.push([x, w, r]);
  }
  return [...bot, ...top.reverse()];
}

function slat(surf, f, xa, xb, wh, prof, lift, n = 9) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = xa + ((xb - xa) * i) / n;
    const s = surf(x, f * wh(x));
    pts.push({ p: s.p.clone().addScaledVector(s.n, lift), n: s.n.clone() });
  }
  const frames = pts.map((q, i) => ({ p: q.p, n: q.n, t: pts[Math.min(n, i + 1)].p.clone().sub(pts[Math.max(0, i - 1)].p).normalize() }));
  return sweepFrames(frames, prof, { creaseDeg: 50 });
}

function rib(surf, x, wh, prof, lift, n = 14) {
  const frames = [];
  const w = wh(x) + 0.05;
  for (let i = 0; i <= n; i++) {
    const s = surf(x, -w + (2 * w * i) / n);
    frames.push({ p: s.p.clone().addScaledVector(s.n, lift), n: s.n.clone(), t: V3() });
  }
  for (let i = 0; i <= n; i++) frames[i].t.copy(frames[Math.min(n, i + 1)].p).sub(frames[Math.max(0, i - 1)].p).normalize();
  return sweepFrames(frames, prof, { creaseDeg: 50 });
}

/** White label with black bars (the bars are a black plate with white-showing slits). */
function label(surf, x0, x1, y0, y1, seed) {
  const white = armorPanel({ shape: [[x0, y0, 0.02], [x1, y0, 0.02], [x1, y1, 0.02], [x0, y1, 0.02]], surface: surf, thickness: 0.016, bevel: 0.004, lift: -0.004, maxEdge: 0.3, uvScale: 1 });
  // bars: alternate widths from a small deterministic pattern
  const pat = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2];
  const unit = 0.011;
  const ya = y0 + 0.07, xa = x0 + 0.05, xb = x1 - 0.05;
  const holes = [];
  let y = ya, k = seed % 7;
  while (true) {
    const gap = pat[k++ % pat.length] * unit, bar = pat[k++ % pat.length] * unit;
    if (y + bar + gap > y1 - 0.07) break;
    holes.push([[xa, y, 0], [xb, y, 0], [xb, y + gap, 0], [xa, y + gap, 0]]);
    y += gap + bar;
  }
  const outline = [[xa - 0.02, ya - 0.015, 0.01], [xb + 0.02, ya - 0.015, 0.01], [xb + 0.02, y + 0.01, 0.01], [xa - 0.02, y + 0.01, 0.01]];
  const bars = armorPanel({ shape: outline, holes, surface: surf, thickness: 0.01, bevel: 0.002, bevelSegments: 1, lift: 0.01, maxEdge: 0.4, uvScale: 1, steps: 2 });
  return { white, bars };
}

function buildPanel(stab, d) {
  const part = stab.part(d.id, {
    name: d.name, tag: 'shell',
    info: `Curved ${d.big ? 'large' : 'small'} ${d.what} cowl panel: black louvred window in a yellow-trimmed frame with a barcode label and corner screws; fans out when the stabilizer opens.`,
    specs: {
      Material: 'Gloss black anodised aluminium, yellow powder-coat trim',
      Mass: d.big ? '0.035 g' : '0.02 g', Function: 'Shields the thruster bay and vents exhaust through the louvres',
      Dimensions: `${d.big ? '3.9' : '2.8'} mm wide at the rim, 2.4 mm long`,
    },
    explode: ex(d.off, 'mid', null, 'local'),
  });
  const surf = skSurface(d.phi);
  const half = d.half;
  const band = d.big ? 0.34 : 0.28;
  const wf = 0.17 + band, ws = 0.055 + 0.15, wb = 0.055 + 0.14;

  const outer = sectorPts(half, { rf: 0.16, rb: 0.12 });
  const rimHole = sectorPts(half, { f: 0.17, s: 0.055, b: 0.055, rf: 0.07, rb: 0.07 });
  const win = sectorPts(half, { f: wf, s: ws, b: wb, rf: 0.05, rb: 0.05 });
  part.add(armorPanel({ shape: outer, holes: [rimHole], surface: surf, thickness: TH + 0.012, bevel: 0.024, bevelSegments: 3, lift: -TH, maxEdge: 0.24, uvScale: 0.6 }), M.yellow);
  part.add(armorPanel({ shape: rimHole, holes: [win], surface: surf, thickness: TH, bevel: 0.032, bevelSegments: 3, lift: -TH, maxEdge: 0.22, uvScale: 0.6 }), M.black);

  // louvre slats (slanted vanes that converge towards the aft end like radial spokes) and a cross rib
  const wh = (x) => sectorHalf(x, half) - ws;
  const xa = X0 + wf - 0.04, xb = X1 - wb + 0.04;
  const prof = [[-0.075, 0], [-0.05, 0], [0.075, 0.1], [0.05, 0.1]];
  const slats = [];
  for (let i = 0; i < d.n; i++) slats.push(slat(surf, -1 + (2 * i + 1) / d.n, xa, xb, wh, prof, -TH + 0.01));
  slats.push(rib(surf, (xa + xb) / 2 + 0.05, wh, rrect(0.05, 0.11, 0.012), -TH + 0.065));
  part.add(mergeList(slats), M.black);

  // barcode label on the front black band
  const lx0 = X0 + 0.17 + 0.05, lx1 = X0 + wf - 0.05;
  const y0 = d.side * (d.big ? 0.3 : 0.2), y1 = d.side * (d.big ? 1.25 : 0.95);
  const lab = label(surf, lx0, lx1, Math.min(y0, y1), Math.max(y0, y1), d.n);
  part.add(lab.white, WHITE);
  part.add(lab.bars, M.black);

  // screws: black on the yellow front corners, yellow on the black frame aft and mid-side
  const bolt = hexBolt(0.05, 0.05, 10);
  const place = (x, y, s = 1) => { const q = surf(x, y); return placeM(q.p.clone().addScaledVector(q.n, 0.008), q.n, 0, s); };
  const fx = X0 + 0.09, ax = X1 - 0.125;
  part.addMany(bolt, M.black, [place(fx, sectorHalf(fx, half) - 0.14), place(fx, -(sectorHalf(fx, half) - 0.14))]);
  const yel = [place(ax, sectorHalf(ax, half) - 0.13), place(ax, -(sectorHalf(ax, half) - 0.13))];
  if (d.big) { const mx = (X0 + X1) / 2 + 0.2; yel.push(place(mx, sectorHalf(mx, half) - 0.13), place(mx, -(sectorHalf(mx, half) - 0.13))); }
  part.addMany(bolt, M.yellow, yel);
  return part;
}

export function buildStabilizer(stab) {
  for (const d of DEFS) buildPanel(stab, d);
  buildRing(stab);
  buildGimbal(stab);
  buildSys(stab);
}
