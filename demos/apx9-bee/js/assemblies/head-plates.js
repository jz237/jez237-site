// APX-9 head: armour-plate geometry from the SDF recipes of head-layout.js.
//   plate(name)         -> traced outline loops (cached) in plate coordinates
//   layers(name, opts)  -> { yellow, black, steel, gold } geometries: stepped base + raised panel, pin-stripes, fasteners
//   ribbon()/resample() -> thin strips and equal-spacing points along an outline (engraved lines, bolt rows)
import * as THREE from 'three';
import { armorPanel, mergeGeometries } from '../geo.js';
import { trace, sampleGrid, traceGrid, shapesFrom, loopArea, polygon } from './head-sdf.js';
import { PLATES, plateFrame } from './head-layout.js';
import { boltField, headNormal } from './head-util.js';

const cache = new Map();

/**
 * Traced plate: { fr, f, loops, bb, grid } (loops in plate coordinates, outer CCW, holes CW). A coarse pass finds the
 * outline; a fine grid over its bounding box is sampled once and reused for every inset (stripes, raised panel, bolts).
 */
export function plate(name, f2 = null) {
  const key = name + (f2 ? '*' : '');
  let c = cache.get(key);
  if (c) return c;
  const def = PLATES[name];
  const fr = plateFrame(name);
  const f = f2 || def.make(fr);
  const b = def.box;
  let loops = trace(f, b[0], b[1], b[2], b[3], def.step || 0.05, { skip: 1.6 });
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const l of loops) for (const q of l) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
  const bb = [x0 - 0.15, y0 - 0.15, x1 + 0.15, y1 + 0.15];
  let grid = null;
  if (def.fine !== false) {
    const step = def.fineStep || 0.03;
    grid = sampleGrid(f, bb[0], bb[1], bb[2], bb[3], step);
    loops = traceGrid(grid, 0);
    // morphological opening: slivers thinner than 2r and needle-sharp convex corners make the bevelled extrusion fold over
    // itself, so the outline is eroded by r and dilated back (every convex corner ends up with radius r).
    const r = def.open === undefined ? 0.1 : def.open;
    if (r > 0) {
      const er = traceGrid(grid, r, { minArea: 0.01 });
      if (er.length) {
        const outers = er.filter((l) => loopArea(l) > 0).map((l) => polygon(l, 1.5));
        const holes = er.filter((l) => loopArea(l) < 0).map((l) => polygon(l, 1.5));
        const fo = (x, y) => {
          let a = 1e9;
          for (const o of outers) { const v = o(x, y); if (v < a) a = v; }
          for (const h of holes) { const v = -h(x, y); if (v > a) a = v; }
          return a - r;
        };
        grid = sampleGrid(fo, bb[0], bb[1], bb[2], bb[3], step);
        loops = traceGrid(grid, 0);
      }
    }
  }
  c = { fr, f, loops, box: b, bb, grid, def };
  cache.set(key, c);
  return c;
}

/** loops of the region f(x, y) < -depth (the outline inset by `depth`) */
export function inset(P, depth, opts = {}) {
  if (P.grid) return traceGrid(P.grid, depth, { minArea: 0.02, ...opts });
  const f = P.f;
  const g = (x, y) => f(x, y) + depth;
  const b = P.bb || P.box;
  return trace(g, b[0], b[1], b[2], b[3], 0.04, { minArea: 0.02, ...opts });
}

/** armour panel (extruded, bevelled, bent onto the head ellipsoid) from loops; outer face sits at `top` mm above the nominal surface */
export function panel(fr, loops, { thickness = 0.26, top = 0, bevel = 0.07, maxEdge = 0.5, crease = 38 } = {}) {
  const shapes = shapesFrom(loops);
  const gs = [];
  for (const sh of shapes) {
    gs.push(armorPanel({ shape: sh, surface: fr.surface, thickness, bevel, bevelSegments: 2, lift: top - thickness, maxEdge, creaseDeg: crease, uvScale: 0.12 }));
  }
  if (!gs.length) return null;
  return gs.length === 1 ? gs[0] : mergeGeometries(gs, false);
}

/** points at equal arc-length spacing along a closed loop (plate coordinates). */
export function resample(loop, pitch, offset = 0.5) {
  const n = loop.length;
  const out = [];
  let acc = pitch * offset;
  for (let i = 0; i < n; i++) {
    const A = loop[i], B = loop[(i + 1) % n];
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) continue;
    let t = acc;
    while (t <= len) {
      out.push([A[0] + dx / len * t, A[1] + dy / len * t, dx / len, dy / len]);
      t += pitch;
    }
    acc = t - len;
  }
  return out;
}

/** thin strip of width w along a plate-space polyline, laid on the head surface at `lift` mm. */
export function ribbon(fr, pts, { w = 0.07, lift = 0, closed = true } = {}) {
  const n = pts.length;
  if (n < 2) return null;
  const pos = [], nor = [], uv = [], idx = [];
  let s = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    if (!closed && i === 0) { tx = pts[1][0] - pts[0][0]; ty = pts[1][1] - pts[0][1]; }
    if (!closed && i === n - 1) { tx = pts[n - 1][0] - pts[n - 2][0]; ty = pts[n - 1][1] - pts[n - 2][1]; }
    const l = Math.hypot(tx, ty) || 1;
    const mx = -ty / l * w / 2, my = tx / l * w / 2;
    for (const sg of [-1, 1]) {
      const p = fr.point(pts[i][0] + sg * mx, pts[i][1] + sg * my);
      const nn = headNormal(p);
      pos.push(p[0] + nn[0] * lift, p[1] + nn[1] * lift, p[2] + nn[2] * lift);
      nor.push(nn[0], nn[1], nn[2]);
      uv.push(s, sg < 0 ? 0 : 1);
    }
    if (i < n - 1) s += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  }
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = 2 * i, b = 2 * ((i + 1) % n);
    idx.push(a, b + 1, a + 1, a, b, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/**
 * Raised rib: rectangular cross-section strip (width w, height h, base at `lift`) along a plate-space polyline.
 * Flat-shaded faces (separate vertices for top and sides) so it catches light like a machined bead.
 */
export function rib(fr, pts, { w = 0.1, h = 0.06, lift = 0, closed = false } = {}) {
  const n = pts.length;
  if (n < 2) return null;
  const pos = [], nor = [], idx = [];
  const prof = [];   // per sample: 6 vertices [BL, TL, TL2, TR2, TR, BR] with normals
  for (let i = 0; i < n; i++) {
    const a = closed ? pts[(i - 1 + n) % n] : pts[Math.max(i - 1, 0)];
    const b = closed ? pts[(i + 1) % n] : pts[Math.min(i + 1, n - 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    const mx = -ty / l, my = tx / l;
    const pL = fr.point(pts[i][0] + mx * w / 2, pts[i][1] + my * w / 2);
    const pR = fr.point(pts[i][0] - mx * w / 2, pts[i][1] - my * w / 2);
    const nL = headNormal(pL), nR = headNormal(pR);
    const sideL = [pL[0] - pR[0], pL[1] - pR[1], pL[2] - pR[2]];
    const sl = Math.hypot(...sideL) || 1;
    const dL = [sideL[0] / sl, sideL[1] / sl, sideL[2] / sl];
    const up = (p, nn, z) => [p[0] + nn[0] * z, p[1] + nn[1] * z, p[2] + nn[2] * z];
    const nC = [(nL[0] + nR[0]) / 2, (nL[1] + nR[1]) / 2, (nL[2] + nR[2]) / 2];
    prof.push([
      [up(pL, nL, lift), dL], [up(pL, nL, lift + h), dL],
      [up(pL, nL, lift + h), nC], [up(pR, nR, lift + h), nC],
      [up(pR, nR, lift + h), [-dL[0], -dL[1], -dL[2]]], [up(pR, nR, lift), [-dL[0], -dL[1], -dL[2]]],
    ]);
  }
  const uv = [];
  for (const pr of prof) for (const [p, nn] of pr) { pos.push(p[0], p[1], p[2]); nor.push(nn[0], nn[1], nn[2]); uv.push(p[0] * 1.5 + p[2] * 0.7, p[1] * 1.5 + p[2] * 0.3); }
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = 6 * i, b = 6 * ((i + 1) % n);
    // left side (BL=0, TL=1)
    idx.push(a, b + 1, b, a, a + 1, b + 1);
    // top (TL2=2, TR2=3)
    idx.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2);
    // right side (TR=4, BR=5)
    idx.push(a + 4, a + 5, b + 5, a + 4, b + 5, b + 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/**
 * Matrix4 placing local geometry at plate point (x, y), lifted `lift` mm along the surface normal.
 * mode 'z': local +Z = normal, +X = plate x, +Y = plate y (boxes, plates, lenses);
 * mode 'y': local +Y = normal, +X = plate x (cylinders, screws, revolved parts). spin (rad) turns it about the normal.
 */
export function placeAt(fr, x, y, lift = 0, mode = 'z', spin = 0) {
  const { p, n, tx, ty } = fr.frameAt(x, y);
  const c = Math.cos(spin), s = Math.sin(spin);
  const ax = [tx[0] * c + ty[0] * s, tx[1] * c + ty[1] * s, tx[2] * c + ty[2] * s];
  const ay = [-tx[0] * s + ty[0] * c, -tx[1] * s + ty[1] * c, -tx[2] * s + ty[2] * c];
  const m = new THREE.Matrix4();
  const P = new THREE.Vector3(p[0] + n[0] * lift, p[1] + n[1] * lift, p[2] + n[2] * lift);
  if (mode === 'z') m.makeBasis(new THREE.Vector3(...ax), new THREE.Vector3(...ay), new THREE.Vector3(...n));
  else m.makeBasis(new THREE.Vector3(...ax), new THREE.Vector3(...n), new THREE.Vector3(-ay[0], -ay[1], -ay[2]));
  m.setPosition(P);
  return m;
}

/** one flat layer: SDF region -> loops -> armour panel at `top` mm above the nominal surface */
export function layer(fr, f, box, { top = 0, thickness = 0.2, bevel = 0.05, step = 0.03, maxEdge = 0.4, minArea = 0.004 } = {}) {
  const loops = trace(f, box[0], box[1], box[2], box[3], step, { minArea });
  if (!loops.length) return null;
  return panel(fr, loops, { thickness, top, bevel, maxEdge });
}

const merge = (list) => {
  const l = list.filter(Boolean);
  if (!l.length) return null;
  return l.length === 1 ? l[0] : mergeGeometries(l, false);
};

/**
 * Full plate layer set.
 * opts: base {thickness, top}, panel {inset, thickness, bevel} | false, stripe {depth, w} | false,
 *       bolts {depth, pitch, r, kind, on:'panel'|'base', skip(x,y)} | false
 * returns { yellow, black, steel }  (any may be null) plus loops
 */
export function layers(name, opts = {}) {
  const P = plate(name, opts.f2);
  const { fr, loops } = P;
  const o = {
    base: { thickness: 0.26, top: -0.05, bevel: 0.075, ...(opts.base || {}) },
    panel: opts.panel === false ? false : { inset: 0.3, thickness: 0.11, bevel: 0.045, ...(opts.panel || {}) },
    stripe: opts.stripe === false ? false : { depth: 0.15, w: 0.05, ...(opts.stripe || {}) },
    bolts: opts.bolts === false ? false : { depth: 0.55, pitch: 1.2, r: 0.1, kind: 'dome', on: 'panel', ...(opts.bolts || {}) },
  };
  const yellow = [], black = [], steel = [];
  yellow.push(panel(fr, loops, o.base));
  const baseTop = o.base.top;
  let panelLoops = null;
  if (o.panel) {
    panelLoops = inset(P, o.panel.inset);
    if (panelLoops.length && panelLoops.some((l) => loopArea(l) > 0.1)) {
      yellow.push(panel(fr, panelLoops, { thickness: o.panel.thickness + 0.01, top: baseTop + o.panel.thickness, bevel: o.panel.bevel, maxEdge: o.base.maxEdge || 0.5 }));
    } else panelLoops = null;
  }
  const topZ = panelLoops ? baseTop + o.panel.thickness : baseTop;
  if (o.stripe) {
    const sl = inset(P, o.stripe.depth, { minArea: 0.05 });
    for (const l of sl) { if (o.stripe.holes === false && loopArea(l) < 0) continue; black.push(ribbon(fr, l, { w: o.stripe.w, lift: baseTop + 0.012 })); }
  }
  if (o.bolts) {
    const b = o.bolts;
    const onPanel = b.on === 'panel' && panelLoops;
    const bl = inset(P, b.depth, { minArea: 0.1 });
    const items = [];
    for (const l of bl) {
      if (loopArea(l) < 0) continue;      // holes: no bolts around windows
      for (const [x, y] of resample(l, b.pitch, 0.5)) {
        if (b.skip && b.skip(x, y)) continue;
        const p = fr.point(x, y), n = headNormal(p);
        const z = onPanel ? topZ : baseTop;
        items.push({ p: [p[0] + n[0] * z, p[1] + n[1] * z, p[2] + n[2] * z], n });
      }
    }
    steel.push(items.length ? boltField(items, { kind: b.kind, r: b.r }) : null);
  }
  return { yellow: merge(yellow), black: merge(black), steel: merge(steel), loops, P };
}
