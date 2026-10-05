import * as THREE from 'three';
import { L } from './layout.js';
import { groundHeight } from '../explore/bounds.js';
import { leafGeometry } from '../geometry/shapes.js';

// Planting that never passes through anything. The far-field planting was
// scattered for distant film cameras; at bee scale it showed blooms buried in
// shrubs and palms, flower stems running up through foliage masses, masses
// poking through the plinth and glass, and leaves dipping into the soil. This
// pass runs once the flora and foliage are built and only post-processes
// their placements (deterministically, without drawing random numbers, so
// nothing else in the garden moves):
//   1. blooms whose stem or cup is inside iron, an urn, a palm crown, a lamp
//      or the fountain move to the nearest clear spot (with their leaves);
//   2. foliage masses and shrubs step aside from every stem and bloom, the
//      columns, urns, lamps, path and walls (shrinking a little if they must),
//      and sit on the soil instead of half-buried; their roses go with them;
//   3. seed lanterns and fern clumps keep clear of stems, blooms and masses;
//   4. leaves on the plants are lifted clear of the soil and the curbs.
// Returns counts for the log.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const H = L.house;
const R0 = { tulip: 10, lily: 13, rose: 7.5, copperbloom: 9 };
const COLUMNS = [];
for (const x of [-118, 168]) for (let i = 0; i < 8; i++) { const z = 150 - i * 150; if (z >= H.z1 + 5) COLUMNS.push([x, z]); }
const FOUNTAIN = [(L.pathX[0] + L.pathX[1]) / 2, -560, 52];

export function bloomRadius(f) { return R0[f.ty.name] * f.scale; }

// ---- fixed solids (column + ivy, urns, palm crowns, lamps, fountain) -------------------
function solidDist(p, w, { palms = true } = {}) {
  let d = Infinity;
  for (const [cx, cz] of COLUMNS) {
    const r = p.y < 12 ? 9 : 9.5; // shaft and its ivy, base plinth
    d = Math.min(d, Math.hypot(p.x - cx, p.z - cz) - r);
  }
  for (const pl of w.foliage.palmSpots || []) {
    const sc = pl.sc;
    const dh = Math.hypot(p.x - pl.x, p.z - pl.z);
    if (p.y < 16 * sc) d = Math.min(d, dh - 9.6 * sc);
    if (palms) {
      // crown: an ellipsoid a little larger than the bee's collider
      const ex = dh / (22 * sc), ey = (p.y - 20 * sc) / (11 * sc);
      d = Math.min(d, (Math.hypot(ex, ey) - 1) * 9 * sc);
    }
  }
  for (const core of w.garden.lamps) {
    const c = core.position;
    d = Math.min(d, Math.hypot(p.x - c.x, p.y - c.y, p.z - c.z) - 6.5, Math.hypot(p.x - c.x, p.z - c.z) - 2);
  }
  if (p.y < 14) d = Math.min(d, Math.hypot(p.x - FOUNTAIN[0], p.z - FOUNTAIN[1]) - FOUNTAIN[2]);
  // the promenade's arch uprights (with their climbing roses) and the globe bollards
  if (p.y < L.arches.spring + 6) for (const z of L.arches.zs) for (const x of [L.arches.x0, L.arches.x1]) d = Math.min(d, Math.hypot(p.x - x, p.z - z) - 4.6);
  if (p.y < 26) for (const b of w.promenade?.bollards || []) d = Math.min(d, Math.hypot(p.x - b.base.x, p.z - b.base.z) - 3.2);
  return d;
}

function inBed(x, z, margin = 0) {
  const r = Math.hypot(x, z);
  if (r < 46 + margin) return false;
  if (x > L.pathX[0] - 9 - margin && x < L.pathX[1] + 9 + margin) return false;
  if (x < H.x0 + 22 + margin || x > H.x1 - 22 - margin) return false;
  if (z > H.z0 - 25 - margin || z < H.z1 + 40 + margin) return false;
  if (Math.hypot(x - L.songbirdTree.x, z - L.songbirdTree.z) < 22 + margin) return false;
  // the closing camera's sightline to the hero flower (as flora keeps it)
  const bx = 60, bz = 120;
  const tt = Math.min(1, Math.max(0, (x * bx + z * bz) / (bx * bx + bz * bz)));
  if (Math.hypot(x - tt * bx, z - tt * bz) < 20 + tt * 10 + margin) return false;
  return true;
}

// sample points of a flower: stem and cup
function flowerPoints(f, base) {
  const top = base.clone().addScaledVector(f.dir, f.top.distanceTo(f.base));
  const R = bloomRadius(f);
  const pts = [];
  const h = top.y - base.y;
  for (let y = 3; y < h; y += 3) pts.push([base.clone().lerp(top, y / h), 0.5 * f.scale + 0.6]);
  pts.push([top.clone(), 1.0]);
  pts.push([top.clone().add(V(0, 0.2 * R, 0)), 1.0]);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; pts.push([top.clone().add(V(Math.cos(a) * 0.8 * R, 0.15 * R, Math.sin(a) * 0.8 * R)), 0.6]); }
  pts.push([top.clone().add(V(0, 0.55 * f.scale + 1.35 + 4.5, 0)), 1.2]);
  return pts;
}

export function resolvePlanting(w) {
  const fl = w.flora, fo = w.foliage;
  const stats = { flowersMoved: 0, flowersStuck: 0, massesMoved: 0, massesShrunk: 0, massesHidden: 0, orbsMoved: 0, fernsMoved: 0, fernsHidden: 0, leavesLifted: 0 };
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = V();

  // ---- 1. blooms out of iron, urns, palm crowns, lamps and the fountain ----------------
  const flowers = fl.flowers;
  // (two exact shortcuts, same answers: a flower whose stem and cup can't come
  // within a solid's reach skips the per-point test, and the spacing test
  // looks only at flowers in nearby grid cells)
  const solids2D = [
    ...COLUMNS.map(([x, z]) => [x, z, 9.5]),
    ...(w.foliage.palmSpots || []).map((pl) => [pl.x, pl.z, Math.max(9.6, 22) * pl.sc + 3]),
    ...w.garden.lamps.map((c) => [c.position.x, c.position.z, 6.5]),
    [FOUNTAIN[0], FOUNTAIN[1], FOUNTAIN[2]],
    ...L.arches.zs.flatMap((z) => [[L.arches.x0, z, 4.6], [L.arches.x1, z, 4.6]]),
    ...(w.promenade?.bollards || []).map((b) => [b.base.x, b.base.z, 3.2]),
  ];
  const nearSolid = (f, base) => {
    const reach = Math.hypot(f.dir.x, f.dir.z) * f.top.distanceTo(f.base) + 0.8 * bloomRadius(f) + Math.max(1.2, 0.5 * f.scale + 0.6) + 0.01;
    return solids2D.some(([x, z, r]) => Math.hypot(base.x - x, base.z - z) <= reach + r);
  };
  const bad = (f, base) => nearSolid(f, base) && flowerPoints(f, base).some(([p, m]) => solidDist(p, w) < m);
  const FG = 32, fgrid = new Map();
  const fkey = (x, z) => Math.floor(x / FG) * 4096 + Math.floor(z / FG);
  for (const f of flowers) { const k = fkey(f.base.x, f.base.z); if (!fgrid.has(k)) fgrid.set(k, []); fgrid.get(k).push(f); }
  const Rmax = Math.max(...flowers.map(bloomRadius));
  const clearOfOthers = (f, base) => {
    const R = bloomRadius(f), top = f.top.y;
    const Q = Math.max(11, 0.9 * (R + Rmax)) + 0.01;
    for (let i = Math.floor((base.x - Q) / FG); i <= Math.floor((base.x + Q) / FG); i++) for (let j = Math.floor((base.z - Q) / FG); j <= Math.floor((base.z + Q) / FG); j++) {
      for (const o of fgrid.get(i * 4096 + j) || []) {
        if (o === f) continue;
        const d = Math.hypot(o.base.x - base.x, o.base.z - base.z);
        if (d < 11) return false;
        const Ro = bloomRadius(o);
        if (Math.abs(o.top.y - top) < 0.45 * (R + Ro) && d < 0.9 * (R + Ro)) return false;
      }
    }
    return true;
  };
  for (const f of flowers) {
    if (!bad(f, f.base)) continue;
    let found = null;
    for (let r = 4; r <= 60 && !found; r += 4) {
      for (let k = 0; k < 16 && !found; k++) {
        const a = (k / 16) * Math.PI * 2 + r * 0.37;
        const c = V(f.base.x + Math.cos(a) * r, 0, f.base.z + Math.sin(a) * r);
        if (!inBed(c.x, c.z) || !clearOfOthers(f, c) || bad(f, c)) continue;
        found = c;
      }
    }
    if (!found) { stats.flowersStuck++; continue; }
    const d = found.clone().sub(f.base);
    const k0 = fkey(f.base.x, f.base.z);
    f.base.add(d);
    f.top.add(d);
    { const l = fgrid.get(k0); l.splice(l.indexOf(f), 1); const k1 = fkey(f.base.x, f.base.z); if (!fgrid.has(k1)) fgrid.set(k1, []); fgrid.get(k1).push(f); }
    f.moved = d;
    stats.flowersMoved++;
  }

  // ---- 2. masses and shrubs step aside -----------------------------------------------------------
  const stems = flowers.map((f) => ({ a: f.base, b: f.top, r: 0.5 * f.scale + 0.8, R: bloomRadius(f), f }));
  // a coarse grid of stems for the neighbourhood queries below
  const SG = 32, sgrid = new Map();
  for (const st of stems) { const k = Math.floor(st.a.x / SG) + ',' + Math.floor(st.a.z / SG); if (!sgrid.has(k)) sgrid.set(k, []); sgrid.get(k).push(st); }
  const stemsNear = (x, z, reach) => {
    const out = [];
    for (let i = Math.floor((x - reach) / SG); i <= Math.floor((x + reach) / SG); i++) for (let j = Math.floor((z - reach) / SG); j <= Math.floor((z + reach) / SG); j++) for (const st of sgrid.get(i + ',' + j) || []) out.push(st);
    return out;
  };
  const masses = [
    ...fo.bushSpots.map((b) => ({ b, kind: 'bush' })),
    ...(fl.shrubSpots || []).map((b) => ({ b, kind: 'shrub' })),
  ];
  const ell = (b) => ({ cx: b.x, cy: b.y0 + b.h * 0.42, cz: b.z, rx: b.r * 0.92 + 1.2, ry: b.h * 0.5 + 0.8 });
  // inside test against a (slightly grown) mass ellipsoid
  const inside = (E, p, m = 0) => Math.hypot((p.x - E.cx) / (E.rx + m), (p.y - E.cy) / (E.ry + m), (p.z - E.cz) / (E.rx + m)) < 1;
  const P1 = V(); // (scratch: the same arithmetic without an allocation per test point)
  const massOk = (b) => {
    const E = ell(b);
    if (!inBed(b.x, b.z, -8) && !b.wall) return false;
    if (Math.hypot(b.x, b.z) - E.rx < 40) return false;
    // walls and path curbs
    if (b.x - E.rx < H.x0 + 10 || b.x + E.rx > H.x1 - 10) return false;
    if (b.x + E.rx > L.pathX[0] - 5 && b.x - E.rx < L.pathX[1] + 5) return false;
    if (b.z + E.rx > H.z0 - 4 || b.z - E.rx < H.z1 + 4) return false;
    // stems (and their blooms)
    for (const st of stemsNear(b.x, b.z, E.rx + 20)) {
      if (Math.hypot(st.a.x - b.x, st.a.z - b.z) > E.rx + st.R + 2) continue;
      for (let k = 0; k <= 1.0001; k += 0.08) {
        if (inside(E, P1.copy(st.a).lerp(st.b, k), st.r)) return false;
      }
      const top = st.b;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        if (inside(E, P1.set(top.x + Math.cos(a) * 0.8 * st.R, top.y + 0.1 * st.R, top.z + Math.sin(a) * 0.8 * st.R), 0.5)) return false;
      }
      if (inside(E, top, st.R * 0.45)) return false;
    }
    // fixed solids round its waist and crown
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      if (solidDist(P1.set(b.x + Math.cos(a) * E.rx, E.cy, b.z + Math.sin(a) * E.rx), w, { palms: false }) < 0.5) return false;
    }
    if (solidDist(V(b.x, E.cy + E.ry, b.z), w, { palms: false }) < 0.5) return false;
    // under a palm's fronds a mass must stay below the crown
    for (const pl of w.foliage.palmSpots || []) {
      const dh = Math.hypot(b.x - pl.x, b.z - pl.z);
      if (dh < 20 * pl.sc + E.rx && b.y0 + b.h > 13 * pl.sc) return false;
    }
    return true;
  };
  for (const m of masses) {
    const b = m.b;
    b.y0 = groundHeight(b.x, b.z) - 1;
    if (massOk(b)) continue;
    const x0 = b.x, z0 = b.z;
    const scale0 = [b.r, b.h, b.sx, b.sy, b.sz];
    let ok = false;
    for (let shrink = 0; shrink < 4 && !ok; shrink++) {
      const k = Math.pow(0.84, shrink);
      b.r = scale0[0] * k; b.h = scale0[1] * k; b.sx = scale0[2] * k; b.sy = scale0[3] * k; b.sz = scale0[4] * k;
      for (let r = 0; r <= 22 && !ok; r += 2) {
        for (let i = 0; i < (r ? 14 : 1) && !ok; i++) {
          const a = (i / 14) * Math.PI * 2 + r * 0.31;
          b.x = x0 + Math.cos(a) * r;
          b.z = z0 + Math.sin(a) * r;
          b.y0 = groundHeight(b.x, b.z) - 1;
          if (massOk(b)) { ok = true; if (r) stats.massesMoved++; if (shrink) stats.massesShrunk++; }
        }
      }
    }
    if (!ok) { b.x = x0; b.z = z0; b.hidden = true; b.r = b.h = b.sx = b.sy = b.sz = 0; stats.massesHidden++; }
  }
  // write the masses back (and their roses)
  for (const b of fo.bushSpots) {
    q.setFromEuler(e.set(0, b.yaw, 0));
    m4.compose(V(b.x, b.y0, b.z), q, s.set(b.sx, b.sy, b.sz));
    fo.domeMesh.setMatrixAt(b.k, m4);
    for (const r of b.roses || []) {
      const p = V(b.x + Math.sin(r.a) * Math.sin(r.el) * b.r, b.y0 + 1 + b.h * (0.35 + 0.6 * Math.cos(r.el)), b.z + Math.cos(r.a) * Math.sin(r.el) * b.r);
      r.p.copy(p);
      q.setFromEuler(e.set(r.ex, r.a, r.ez, 'YXZ'));
      m4.compose(p, q, s.setScalar(b.hidden ? 0 : r.sc));
      fo.roseMesh.setMatrixAt(r.i, m4);
    }
  }
  fo.domeMesh.instanceMatrix.needsUpdate = true;
  fo.roseMesh.instanceMatrix.needsUpdate = true;
  fo.domeMesh.computeBoundingSphere();
  fo.roseMesh.computeBoundingSphere();
  for (const b of fl.shrubSpots || []) {
    q.setFromEuler(e.set(0, b.yaw, 0));
    m4.compose(V(b.x, b.y0, b.z), q, s.set(b.sx, b.sy, b.sz));
    fl.shrubMeshes[b.li].setMatrixAt(b.k, m4);
  }
  for (const im of fl.shrubMeshes) { im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); }

  // ---- 3. seed lanterns and fern clumps ---------------------------------------------------------
  const massEll = masses.filter((m) => !m.b.hidden).map((m) => ell(m.b));
  const nearMass = (p, margin) => massEll.some((E) => Math.abs(p.x - E.cx) < E.rx + margin + 1 && Math.abs(p.z - E.cz) < E.rx + margin + 1 && inside(E, p, margin));
  const orbOk = (p, r) => {
    if (!inBed(p.x, p.z, -6)) return false;
    if (solidDist(p, w) < r + 0.5) return false;
    if (nearMass(p, r + 0.4)) return false;
    for (const st of stemsNear(p.x, p.z, 24)) {
      const dh = Math.hypot(st.a.x - p.x, st.a.z - p.z);
      if (dh > st.R + 6) continue;
      if (dh < st.r + r + 0.8) return false;
      // inside the bloom's cup
      if (Math.abs(p.y - st.b.y) < 0.5 * st.R + r && Math.hypot(st.b.x - p.x, st.b.z - p.z) < 0.95 * st.R + r) return false;
    }
    return true;
  };
  for (const o of fl.orbs) {
    const r = 1.6 * o.sc;
    if (orbOk(o.base, r)) continue;
    const p0 = o.base.clone();
    let ok = false;
    for (let rr = 2; rr <= 20 && !ok; rr += 2) {
      for (let i = 0; i < 12 && !ok; i++) {
        const a = (i / 12) * Math.PI * 2 + rr;
        const p = V(p0.x + Math.cos(a) * rr, p0.y, p0.z + Math.sin(a) * rr);
        if (orbOk(p, r)) { o.base.copy(p); ok = true; stats.orbsMoved++; }
      }
    }
  }
  const fernOk = (x, z) => {
    if (!inBed(x, z, -6)) return false;
    for (const st of stemsNear(x, z, 8)) if (Math.hypot(st.a.x - x, st.a.z - z) < 7) return false;
    if (nearMass(V(x, groundHeight(x, z) + 3, z), 3)) return false;
    if (solidDist(V(x, 4, z), w, { palms: false }) < 6) return false;
    return true;
  };
  for (const fs of fl.fernSpots || []) {
    let ok = fernOk(fs.x, fs.z);
    const x0 = fs.x, z0 = fs.z;
    for (let rr = 2; rr <= 16 && !ok; rr += 2) {
      for (let i = 0; i < 12 && !ok; i++) {
        const a = (i / 12) * Math.PI * 2 + rr * 0.7;
        if (fernOk(x0 + Math.cos(a) * rr, z0 + Math.sin(a) * rr)) { fs.x = x0 + Math.cos(a) * rr; fs.z = z0 + Math.sin(a) * rr; ok = true; stats.fernsMoved++; }
      }
    }
    if (!ok) { fs.hidden = true; stats.fernsHidden++; }
    const y = groundHeight(fs.x, fs.z) - 0.3;
    for (const fr of fs.fronds) {
      q.setFromEuler(e.set(0, fr.yaw, 0));
      m4.compose(V(fs.x, y, fs.z), q, s.setScalar(fs.hidden ? 0 : fr.sc));
      fl.fernMesh.setMatrixAt(fr.i, m4);
    }
  }
  fl.fernMesh.instanceMatrix.needsUpdate = true;
  fl.fernMesh.computeBoundingSphere();

  // ---- 4. leaves on the plants clear of the soil --------------------------------------------------
  // the midrib of the far-field leaf (flora.js: length 7, width 2.6, fold 0.5, arch 0.8)
  const mid = leafGeometry({ length: 7, width: 2.6, fold: 0.5, arch: 0.8, segU: 10, segV: 1, thickness: 0.05 }).midrib;
  const lowest = (pos, pitch, yaw, sc) => {
    q.setFromEuler(e.set(pitch, yaw, 0, 'YXZ'));
    let worst = Infinity;
    for (let i = 2; i < mid.length; i++) {
      const p = mid[i].clone().multiplyScalar(sc).applyQuaternion(q).add(pos);
      // a little width either side of the midrib
      worst = Math.min(worst, p.y - 1.1 * sc * 0.2 - groundHeight(p.x, p.z));
    }
    return worst;
  };
  const fit = (pos, l) => {
    let pitch = l.pitch, n = 0;
    while (lowest(pos, pitch, l.yaw, l.sc) < 0.3 && pitch > 0.12 && n < 20) { pitch -= 0.06; n++; }
    if (n) stats.leavesLifted++;
    q.setFromEuler(e.set(pitch, l.yaw, 0, 'YXZ'));
    return m4.compose(pos, q, s.setScalar(l.sc));
  };
  for (const f of flowers) {
    const g = groundHeight(f.base.x, f.base.z);
    for (const l of f.leaves || []) {
      const pos = l.base ? V(f.base.x, g + 0.15 + (l.y / 6) * 4, f.base.z) : f.base.clone().lerp(f.top, l.hk);
      fl.leafMeshes[l.li].setMatrixAt(l.idx, fit(pos, l));
    }
    for (const l of f.stemLeaves || []) fo.stemLeafMesh.setMatrixAt(l.idx, fit(f.base.clone().lerp(f.top, l.hk), l));
  }
  for (const ear of fl.ears || []) {
    const pos = V(ear.x, groundHeight(ear.x, ear.z) + 0.1 + ear.y * 0.5, ear.z);
    fl.leafMeshes[ear.li].setMatrixAt(ear.idx, fit(pos, ear));
  }
  for (const im of [...fl.leafMeshes, fo.stemLeafMesh]) { im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); }
  return stats;
}
