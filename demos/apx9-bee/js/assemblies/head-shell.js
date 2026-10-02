// APX-9 head-shell: yellow armour plates, black under-shell halves, vent louvres, crown heat sink, sensor housing and hub.
// Layout (plate outlines) lives in head-layout.js, plate geometry in head-plates.js, the sensor window cartridge in head-sensor.js.
import * as THREE from 'three';
import { box } from '../geo.js';
import { layers, plate, panel, rib, placeAt } from './head-plates.js';
import { OCC_SLOTS, CHEEK_SLOTS, FIN_WINDOW, plateFrame } from './head-layout.js';
import { buildSensor } from './head-sensor.js';
import { buildRuff } from './head-ruff.js';
import { D2R, mergeAll } from './head-util.js';

/** radial layer stack under the plates (mm relative to the nominal head surface): plates occupy -0.31..-0.05 (+ raised panel),
 *  baffles -0.37..-0.32, liner shell LINER_TOP-0.14..LINER_TOP with ribs up to -0.31 */
const LINER_TOP = -0.39;

const PLATE_DEFS = [
  { id: 'crown-plate', name: 'Crown Plate', ex: [0.5, 4.2, 0],
    info: 'Curved yellow crown armour over the skull roof with a heat-sink window, ocellus cut-outs and a raised, bolted centre panel.' },
  { id: 'face-plate', name: 'Face Plate', ex: [4.2, -0.5, 0],
    info: 'Central face armour that frames the sensor housing window; layered yellow panels with black pin-striping and dome-head bolts.' },
  { id: 'clypeus-plate', name: 'Clypeus Plate', ex: [2.0, -3.9, 0],
    info: 'Angular lower-face plate above the labrum; bevelled yellow shell with a raised panel and a row of retaining bolts.' },
  { id: 'occipital-plate', name: 'Occipital Plate', ex: [-4.5, 0.3, 0],
    info: 'Rear armour ring around the neck socket, cut with two concentric arc vents that exhaust heat from the neural processor.' },
  { id: 'brow-plate-r', name: 'Right Brow Plate', ex: [3.0, 1.6, 1.1], mirror: true, opts: { panel: { inset: 0.22 }, bolts: { depth: 0.42, pitch: 0.9, r: 0.085 } },
    info: 'Right brow plate between the forehead and the orbital rim; the antenna bore is cut through its upper edge.' },
  { id: 'cheek-plate-r', name: 'Right Cheek Plate', ex: [-0.5, -3.6, 2.4], mirror: true, opts: { stripe: { holes: false } },
    info: 'Right cheek armour arc following the orbital rim, with five cooling slots that expose the louvres behind.' },
];

export function buildShell(ctx, shell) {
  const { M, ex, bee } = ctx;
  const made = {};

  /* ------------------------------------------------------------------ yellow plates */
  for (const d of PLATE_DEFS) {
    const L = layers(d.id, d.opts || {});
    const p = shell.part(d.id, { name: d.name, info: d.info, tag: 'shell', explode: ex(d.ex, 'mid') });
    p.add(L.yellow, M.yellow);
    p.add(L.black, M.black);
    p.add(L.steel, M.steel);
    made[d.id] = p;
  }

  /* ------------------------------------------------------------------ black under-shell (right half; the left half is its mirror) */
  made['under-shell-r'] = buildLiner(ctx, shell);

  /* ------------------------------------------------------------------ vents and heat sink */
  buildVentSlats(ctx, shell);
  buildFins(ctx, shell);

  /* ------------------------------------------------------------------ sensor housing + hub */
  buildSensor(ctx, shell);

  /* ------------------------------------------------------------------ fur ruff around the neck socket */
  buildRuff(ctx, shell);

  /* ------------------------------------------------------------------ left-hand copies */
  for (const d of PLATE_DEFS) if (d.mirror) bee.mirror(made[d.id], { parent: shell });
  bee.mirror(made['under-shell-r'], { parent: shell });
}

/* ==================================================================================================== liner */
function buildLiner(ctx, shell) {
  const { M, ex } = ctx;
  const P = plate('liner-r');
  const fr = P.fr;
  const part = shell.part('under-shell-r', {
    name: 'Right Under-Shell', tag: 'shell', explode: ex([0, 0.2, 2.0], 'mid'),
    info: 'Right half of the black carbon liner under the yellow plates; stiffening ribs, mounting bosses and the fastener seats for the armour.',
  });
  // carbon base shell
  part.add(panel(fr, P.loops, { thickness: 0.14, top: LINER_TOP, bevel: 0.03, maxEdge: 0.8 }), M.carbon);
  // raised stiffener grid in dark gunmetal: concentric rings and radial ribs
  const ribs = [];
  const ring = (r, a0, a1) => {
    const n = Math.max(8, Math.round(Math.abs(a1 - a0) * D2R * r / 0.12));
    return Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * D2R; return [r * Math.cos(a), r * Math.sin(a)]; });
  };
  const keep = P.f;
  const clip = (pts, margin = 0.12) => {            // split a polyline where it leaves the liner outline
    const out = []; let cur = [];
    for (const q of pts) {
      if (keep(q[0], q[1]) < -margin) cur.push(q); else { if (cur.length > 1) out.push(cur); cur = []; }
    }
    if (cur.length > 1) out.push(cur);
    return out;
  };
  for (const r of [1.6, 2.7, 3.8, 4.8]) for (const seg of clip(ring(r, 0, 360))) ribs.push(rib(fr, seg, { w: 0.1, h: 0.075, lift: LINER_TOP - 0.005 }));
  for (let k = 0; k < 12; k++) {
    const a = k * 30 * D2R;
    const line = Array.from({ length: 41 }, (_, i) => { const r = 0.9 + i * 0.1; return [r * Math.cos(a), r * Math.sin(a)]; });
    for (const seg of clip(line)) ribs.push(rib(fr, seg, { w: 0.08, h: 0.07, lift: LINER_TOP - 0.005 }));
  }
  part.add(mergeAll(ribs), M.gunmetalDark);
  return part;
}

/* ==================================================================================================== vent slats */
function buildVentSlats(ctx, shell) {
  const { M, ex } = ctx;
  const part = shell.part('vent-slats', {
    name: 'Vent Slats', tag: 'shell', explode: ex([0, -2.4, 0], 'mid'),
    info: 'Gunmetal louvre blades seated behind the cheek and occipital vents; they throw heat away from the neural processor.',
  });
  const blades = [];
  const bladeGeo = box(1, 1, 1, 0.01);
  const put = (list, fr, x, y, lift, spin, sx, sy, sz, tilt = 0, flipZ = false) => {
    const m = placeAt(fr, x, y, lift, 'z', spin);
    const s = new THREE.Matrix4().compose(new THREE.Vector3(0, 0, 0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), tilt), new THREE.Vector3(sx, sy, sz));
    const g = bladeGeo.clone();
    g.applyMatrix4(s);
    g.applyMatrix4(m);
    if (flipZ) { g.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1)); flipWinding(g); }
    list.push(g);
  };
  // cheek vents: one tilted blade per slot (both cheeks)
  const cf = plateFrame('cheek-plate-r');
  for (const flip of [false, true]) {
    for (const s of CHEEK_SLOTS) {
      const cx = (s.a[0] + s.b[0]) / 2, cy = s.a[1], len = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
      put(blades, cf, cx, cy, -0.17, 0, len, s.w - 0.03, 0.025, 0.5, flip);
    }
  }
  // occipital vents: vertical fins across each arc slot
  const of = plateFrame('occipital-plate');
  for (const s of OCC_SLOTS) {
    const arcLen = s.r * (s.a1 - s.a0) * D2R;
    const n = Math.floor(arcLen / 0.3);
    for (let i = 0; i <= n; i++) {
      const a = (s.a0 + (s.a1 - s.a0) * (i / n)) * D2R;
      put(blades, of, s.c[0] + s.r * Math.cos(a), s.c[1] + s.r * Math.sin(a), -0.17, a, s.w - 0.03, 0.03, 0.2);
    }
  }
  part.add(mergeAll(blades), M.brushed);
  return part;
}
function flipWinding(g) {
  const idx = g.index;
  if (idx) { const a = idx.array; for (let i = 0; i < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; } idx.needsUpdate = true; }
  else { const p = g.attributes; for (const k of Object.keys(p)) { const at = p[k]; const s = at.itemSize; for (let i = 0; i < at.count; i += 3) for (let c = 0; c < s; c++) { const t = at.array[(i + 1) * s + c]; at.array[(i + 1) * s + c] = at.array[(i + 2) * s + c]; at.array[(i + 2) * s + c] = t; } } }
}

/* ==================================================================================================== heat sink */
function buildFins(ctx, shell) {
  const { M, ex } = ctx;
  const part = shell.part('thermal-fins', {
    name: 'Thermal Fins', tag: 'shell', explode: ex([0.4, 6.4, 0], 'mid'),
    info: 'Finned heat-sink block set into the crown plate window; it draws heat from the neural processor through the roof of the skull.',
  });
  const fr = plateFrame('crown-plate');
  const W = FIN_WINDOW;
  const at = (x, y, lift) => placeAt(fr, W.cx + x, W.cy + y, lift, 'z');
  const base = [], fins = [];
  const bx = box(1, 1, 1, 0.01);
  const sc = (g, sx, sy, sz) => { const c = g.clone(); c.scale(sx, sy, sz); return c; };
  const place = (g, m) => { const c = g.clone(); c.applyMatrix4(m); return c; };
  // base plate and frame rail
  base.push(place(sc(bx, W.hw * 2 - 0.06, W.hh * 2 - 0.06, 0.12), at(0, 0, -0.2)));
  // fins run along plate y (bee X)
  const nF = 7, pitch = (W.hw * 2 - 0.22) / (nF - 1);
  for (let i = 0; i < nF; i++) fins.push(place(sc(bx, 0.05, W.hh * 2 - 0.12, 0.36), at(-W.hw + 0.11 + i * pitch, 0, 0.04)));
  // cross strap
  base.push(place(sc(bx, W.hw * 2 - 0.08, 0.09, 0.07), at(0, 0.04, 0.2)));
  part.add(mergeAll(base), M.steel);
  part.add(mergeAll(fins), M.brushed);
  return part;
}
