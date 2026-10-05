import * as THREE from 'three';
import { L } from '../world/layout.js';
import { archPoint } from '../world/greenhouse.js';
import { noise1 } from '../core/rng.js';
import { clamp } from '../core/ease.js';

// The glasshouse as a flight volume: an analytic ground (beds, path, curbs,
// the fine hero patch), walls and the vault, plus a few thousand simple
// collider shapes (capsules, spheres, ellipsoids, upright cylinders) for the
// columns, plants and props, held in a spatial hash. Contacts are soft: a
// cushion pushes the bee away before it touches, then a firm floor stops it.
// Also lists every landable bloom.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const H = L.house;
const CELL = 24;

export const HOUSE = {
  xMinLow: H.x0 + 9, xMaxLow: H.x1 - 9, // inner faces of the stone plinths
  xMin: H.x0 + 2, xMax: H.x1 - 2, // glass, above the plinth
  plinthTop: 68,
  zMin: H.z1 + 3, zMax: H.z0 - 3,
};

function bedHeight(x, z, x0, x1, z0, z1) {
  const edge = Math.min(Math.abs(x - x0), Math.abs(x - x1), Math.abs(z - z0), Math.abs(z - z1));
  const mound = clamp(edge / 25) * 3.5;
  const y = mound + noise1(x * 0.05, 1) * 1.6 + noise1(z * 0.043, 2) * 1.6 + noise1((x + z) * 0.21, 3) * 0.35;
  const kh = clamp((Math.hypot(x, z) - 42) / 26);
  return (y - 2) * kh + -0.6 * (1 - kh);
}
const BEDS = [
  [H.x0 + 10, L.pathX[0] - 4, H.z0 - 20, H.z1 + 30],
  [L.pathX[1] + 4, H.x1 - 10, H.z0 - 20, H.z1 + 30],
];

export function groundHeight(x, z) {
  let g = -2.5;
  for (const [x0, x1, z0, z1] of BEDS) {
    if (x >= x0 && x <= x1 && z <= z0 && z >= z1) g = Math.max(g, bedHeight(x, z, x0, x1, z0, z1));
  }
  if (Math.abs(x) < 55 && Math.abs(z) < 55) {
    const r = Math.hypot(x, z);
    const fade = clamp(1 - (r - 40) / 15);
    g = Math.max(g, (noise1(x * 0.35, 7) * 0.25 + noise1(z * 0.31, 8) * 0.25 + noise1((x - z) * 0.9, 9) * 0.08) * fade - 0.05 - (1 - fade) * 1.5);
  }
  if (x > L.pathX[0] - 4.5 && x < L.pathX[1] + 4.5 && z < H.z0 - 10 && z > H.z1 + 10) {
    const curb = x < L.pathX[0] + 0.5 || x > L.pathX[1] - 0.5;
    g = Math.max(g, curb ? 4.5 : 0.3);
  }
  return g;
}

export function ceilingAt(x) {
  return archPoint(clamp(x, H.x0, H.x1), H);
}

export class Bounds {
  constructor(world) {
    this.world = world;
    this.colliders = [];
    this.grid = new Map();
    this.landables = [];
    this._stamp = 0;
    this._build();
  }

  // ---- collider shapes ------------------------------------------------------
  cap(a, b, r, tag) { return this._add({ type: 'cap', a: a.clone(), b: b.clone(), r, tag }); }
  sph(c, r, tag) { return this._add({ type: 'sph', c: c.clone(), r, tag }); }
  ell(c, rx, ry, tag) { return this._add({ type: 'ell', c: c.clone(), rx, ry, tag }); }
  cyl(x, z, r, y0, y1, tag) { return this._add({ type: 'cyl', c: V(x, (y0 + y1) / 2, z), r, y0, y1, tag }); }
  chain(points, r, tag) { for (let i = 0; i < points.length - 1; i++) this.cap(points[i], points[i + 1], r, tag); }

  _add(c) {
    let x0, x1, z0, z1;
    if (c.type === 'cap') { x0 = Math.min(c.a.x, c.b.x) - c.r; x1 = Math.max(c.a.x, c.b.x) + c.r; z0 = Math.min(c.a.z, c.b.z) - c.r; z1 = Math.max(c.a.z, c.b.z) + c.r; }
    else { const r = c.type === 'ell' ? c.rx : c.r; x0 = c.c.x - r; x1 = c.c.x + r; z0 = c.c.z - r; z1 = c.c.z + r; }
    c.box = [x0, x1, z0, z1];
    c.stamp = 0;
    this.colliders.push(c);
    for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) {
      for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) {
        const k = i * 4096 + j;
        let l = this.grid.get(k);
        if (!l) this.grid.set(k, (l = []));
        l.push(c);
      }
    }
    return c;
  }

  // signed distance from p to a collider's surface, with the outward normal
  _sdf(c, p, n) {
    if (c.type === 'sph') {
      n.subVectors(p, c.c);
      const l = n.length() || 1e-6;
      n.multiplyScalar(1 / l);
      return l - c.r;
    }
    if (c.type === 'cap') {
      const ab = this._ab || (this._ab = V());
      ab.subVectors(c.b, c.a);
      const k = clamp(n.subVectors(p, c.a).dot(ab) / Math.max(1e-6, ab.lengthSq()));
      n.subVectors(p, c.a).addScaledVector(ab, -k);
      const l = n.length() || 1e-6;
      n.multiplyScalar(1 / l);
      return l - c.r;
    }
    if (c.type === 'ell') {
      // ellipsoid distance bound: k0 (k0 - 1) / k1
      const px = p.x - c.c.x, py = p.y - c.c.y, pz = p.z - c.c.z;
      const rx2 = c.rx * c.rx, ry2 = c.ry * c.ry;
      const k0 = Math.sqrt((px * px + pz * pz) / rx2 + (py * py) / ry2) || 1e-6;
      const gx = px / rx2, gy = py / ry2, gz = pz / rx2;
      const k1 = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1e-6;
      n.set(gx, gy, gz).multiplyScalar(1 / k1);
      return (k0 * (k0 - 1)) / k1;
    }
    // upright cylinder
    const hx = p.x - c.c.x, hz = p.z - c.c.z;
    const rl = Math.hypot(hx, hz) || 1e-6;
    const dx = rl - c.r;
    const dy = Math.max(c.y0 - p.y, p.y - c.y1);
    if (dx < 0 && dy < 0) {
      if (dx > dy) { n.set(hx / rl, 0, hz / rl); return dx; }
      n.set(0, p.y > c.c.y ? 1 : -1, 0);
      return dy;
    }
    const ox = Math.max(dx, 0), oy = Math.max(dy, 0);
    const l = Math.hypot(ox, oy) || 1e-6;
    n.set((hx / rl) * (ox / l), (p.y > c.c.y ? 1 : -1) * (oy / l), (hz / rl) * (ox / l)).normalize();
    return l;
  }

  // visit colliders whose cells overlap p ± reach
  _near(p, reach, fn) {
    const stamp = ++this._stamp;
    for (let i = Math.floor((p.x - reach) / CELL); i <= Math.floor((p.x + reach) / CELL); i++) {
      for (let j = Math.floor((p.z - reach) / CELL); j <= Math.floor((p.z + reach) / CELL); j++) {
        const l = this.grid.get(i * 4096 + j);
        if (!l) continue;
        for (const c of l) {
          if (c.stamp === stamp) continue;
          c.stamp = stamp;
          if (p.x + reach < c.box[0] || p.x - reach > c.box[1] || p.z + reach < c.box[2] || p.z - reach > c.box[3]) continue;
          fn(c);
        }
      }
    }
  }

  // smallest clearance from p to any solid (colliders, ground, walls, vault)
  clearance(p, out = null, skip = null) {
    let best = Infinity;
    const n = this._n || (this._n = V());
    this._near(p, 8, (c) => {
      if (skip && skip.has(c)) return;
      const d = this._sdf(c, p, n);
      if (d < best) { best = d; if (out) out.copy(n); }
    });
    const g = p.y - groundHeight(p.x, p.z);
    if (g < best) { best = g; if (out) out.set(0, 1, 0); }
    const walls = this._wallDist(p, n);
    if (walls < best) { best = walls; if (out) out.copy(n); }
    return best;
  }

  _wallDist(p, n) {
    const xMin = p.y < HOUSE.plinthTop + 2 ? HOUSE.xMinLow : HOUSE.xMin;
    const xMax = p.y < HOUSE.plinthTop + 2 ? HOUSE.xMaxLow : HOUSE.xMax;
    let d = p.x - xMin; n.set(1, 0, 0);
    if (xMax - p.x < d) { d = xMax - p.x; n.set(-1, 0, 0); }
    if (p.z - HOUSE.zMin < d) { d = p.z - HOUSE.zMin; n.set(0, 0, 1); }
    if (HOUSE.zMax - p.z < d) { d = HOUSE.zMax - p.z; n.set(0, 0, -1); }
    const ceil = ceilingAt(p.x) - 7;
    if (ceil - p.y < d) { d = ceil - p.y; n.set(0, -1, 0); }
    return d;
  }

  // Soft contact for a moving sphere: a cushion accelerates it away inside
  // `cushion`, then position is corrected and the inward velocity removed.
  // Returns the deepest contact { d, normal } or null.
  collide(pos, vel, radius, dt, { cushion = 1.4, stiffness = 60, ignore = null } = {}) {
    const n = this._cn || (this._cn = V());
    let deepest = null;
    const apply = (d, nx, ny, nz, tag) => {
      const gap = d - radius;
      if (gap >= cushion) return;
      const k = 1 - Math.max(0, gap) / cushion;
      // cushion: gentle spring, stronger as the gap closes
      const push = stiffness * k * k * dt;
      vel.x += nx * push; vel.y += ny * push; vel.z += nz * push;
      if (gap < 0) {
        // firm: move out and drop the inward part of the velocity (slide)
        pos.x -= nx * gap; pos.y -= ny * gap; pos.z -= nz * gap;
        const vn = vel.x * nx + vel.y * ny + vel.z * nz;
        if (vn < 0) { vel.x -= nx * vn * 1.15; vel.y -= ny * vn * 1.15; vel.z -= nz * vn * 1.15; }
      }
      if (!deepest || gap < deepest.gap) deepest = { gap, normal: V(nx, ny, nz), tag };
    };
    this._near(pos, radius + cushion + 2, (c) => {
      if (c.tag === 'cup' || (ignore && c.tag && ignore(c.tag))) return;
      const d = this._sdf(c, pos, n);
      if (d - radius < cushion) apply(d, n.x, n.y, n.z, c.tag);
    });
    const g = groundHeight(pos.x, pos.z);
    apply(pos.y - g, 0, 1, 0, 'ground');
    const wn = this._wn || (this._wn = V());
    const wd = this._wallDist(pos, wn);
    apply(wd, wn.x, wn.y, wn.z, 'wall');
    return deepest;
  }

  // keep a point (the camera) out of solids without dynamics
  pushOut(p, radius) {
    const n = V();
    for (let it = 0; it < 3; it++) {
      let moved = false;
      this._near(p, radius + 2, (c) => {
        const d = this._sdf(c, p, n);
        if (d < radius) { p.addScaledVector(n, radius - d); moved = true; }
      });
      const g = groundHeight(p.x, p.z) + radius;
      if (p.y < g) { p.y = g; moved = true; }
      const wd = this._wallDist(p, n);
      if (wd < radius) { p.addScaledVector(n, radius - wd); moved = true; }
      if (!moved) break;
    }
    return p;
  }

  // a spring arm: the furthest point from `from` toward `to` that keeps
  // `radius` of clearance (so the camera never sits inside a bush)
  sweep(from, to, radius, step = 0.6) {
    const dir = V().subVectors(to, from);
    const len = dir.length();
    if (len < 1e-4) return to.clone();
    dir.multiplyScalar(1 / len);
    // solids the subject itself is inside (its bloom's cup) don't stop the arm
    const skip = new Set();
    const n = V();
    this._near(from, radius + 2, (c) => { if (this._sdf(c, from, n) < radius) skip.add(c); });
    const p = V();
    let last = 0, hit = -1;
    for (let s = Math.min(1.5, len); s <= len + 1e-6; s += step) {
      p.copy(from).addScaledVector(dir, s);
      if (this.clearance(p, null, skip) < radius) { hit = s; break; }
      last = s;
    }
    // refine the stop between the last clear sample and the blocked one, so
    // the arm's length changes smoothly as things move instead of in steps
    if (hit > 0 && last > 0) {
      let lo = last, hi = hit;
      for (let i = 0; i < 5; i++) {
        const m = (lo + hi) / 2;
        p.copy(from).addScaledVector(dir, m);
        if (this.clearance(p, null, skip) < radius) hi = m; else lo = m;
      }
      last = lo;
    } else if (hit < 0) last = len; // clear all the way (the last step may fall short of the end)
    return from.clone().addScaledVector(dir, Math.max(Math.min(1.5, len), last));
  }

  // nearest landable bloom to p within `maxDist`
  nearestLandable(p, maxDist = 30) {
    let best = null, bd = maxDist * maxDist;
    for (const l of this.landables) {
      if (l.enabled === false || l.blocked) continue;
      const dx = l.spot.x - p.x, dy = (l.spot.y - p.y) * 0.6, dz = l.spot.z - p.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bd) { bd = d; best = l; }
    }
    return best;
  }

  addLandable(l) {
    l.id = this.landables.length;
    this.landables.push(l);
    return l;
  }

  // ---- build from the world --------------------------------------------------
  _build() {
    const w = this.world;
    // columns (iron with ivy) and their bases
    for (const x of [-118, 168]) {
      for (let i = 0; i < 8; i++) {
        const z = 150 - i * 150;
        if (z < H.z1 + 5) continue;
        this.cap(V(x, -5, z), V(x, ceilingAt(x), z), 6.5, 'column');
        this.sph(V(x, ceilingAt(x) - 22, z), 15, 'column');
        this.cyl(x, z, 9, -3, 11, 'column');
      }
    }
    // eave braces at every rib
    for (let z = H.z0; z >= H.z1; z -= 95) {
      for (const side of [-1, 1]) {
        const bx = side < 0 ? H.x0 : H.x1;
        const pts = [];
        for (let k = 0; k <= 4; k++) {
          const a = (k / 4) * Math.PI * 0.5;
          pts.push(V(bx - side * (1 - Math.cos(a)) * 60, H.wall - 70 + Math.sin(a) * 70, z));
        }
        this.chain(pts, 3.5, 'iron');
      }
    }
    // the hero flower: stem, cup and a ring round the petal bowl (open above)
    const fl = w.flower;
    fl.group.updateMatrixWorld(true);
    const stemPts = [];
    for (let i = 0; i <= 8; i++) stemPts.push(fl.group.localToWorld(fl.stemCurve.getPointAt((i / 8) * 0.92)));
    this.chain(stemPts, 1.4, 'hero-stem');
    const head = fl.head.getWorldPosition(V());
    this.ell(V(head.x, head.y - 4.5, head.z), 6.2, 4.2, 'hero-cup');
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      this.sph(V(head.x + Math.cos(a) * 7.6, head.y + 2.4, head.z + Math.sin(a) * 7.6), 2.6, 'hero-petal');
    }
    this.ell(V(head.x, head.y + 2.6, head.z), 9.6, 4.2, 'cup');
    const C = w.creatures;
    this.addLandable({ kind: 'hero', name: 'the great porcelain bloom', spot: C.land.clone(), face: fl.coreWorld().sub(C.land).setY(0).normalize(), radius: 4.5, cupR: 10, pollen: 0.4, ref: fl });
    // flora: stems, flower heads and their landing bosses
    const R0 = { tulip: 10, lily: 13, rose: 7.5, copperbloom: 9 };
    const NAMES = { tulip: 'a brass tulip', lily: 'a porcelain lily', rose: 'a porcelain rose', copperbloom: 'a copper aster' };
    w.flora.flowers.forEach((f, i) => {
      const R = R0[f.ty.name] * f.scale;
      this.cap(f.base, f.top.clone().addScaledVector(f.dir, -1.5), 0.7 * f.scale + 0.2, 'stem');
      this.ell(f.top.clone().add(V(0, -0.15 * R, 0)), 0.42 * R, 0.3 * R, 'bloom');
      // the open cup of petals: the camera keeps out of it, the bee may enter
      this.ell(f.top.clone().add(V(0, 0.2 * R, 0)), 0.85 * R, 0.4 * R, 'cup');
      const spot = f.top.clone().add(V(0, 0.55 * f.scale + 1.35, 0));
      f.landing = this.addLandable({ kind: 'flora', name: NAMES[f.ty.name], spot, radius: Math.max(3, 0.32 * R), cupR: R, pollen: 0.2, ref: f, index: i });
    });
    // foliage masses, shrubs and ferns
    // (masses sit on the soil: world/planting.js)
    for (const b of [...w.foliage.bushSpots, ...(w.flora.shrubSpots || [])]) if (!b.hidden) this.ell(V(b.x, (b.y0 ?? -1) + b.h * 0.42, b.z), b.r * 0.92, b.h * 0.5, 'bush');
    for (const f of w.flora.fernSpots || []) if (!f.hidden) this.ell(V(f.x, groundHeight(f.x, f.z) + 3, f.z), 8, 6, 'fern');
    for (const p of w.foliage.palmSpots || []) {
      this.cyl(p.x, p.z, 9.4 * p.sc, -2, 15.5 * p.sc, 'urn');
      this.ell(V(p.x, 19 * p.sc, p.z), 19 * p.sc, 9 * p.sc, 'palm');
    }
    // hanging lanterns and their chains
    for (const l of w.foliage.lanterns) {
      this.sph(l.p.clone().add(V(0, 0.5 * l.sc, 0)), 3.6 * l.sc, 'lantern');
      this.cap(l.p.clone().add(V(0, 8 * l.sc, 0)), V(l.p.x, ceilingAt(l.p.x), l.p.z), 0.7, 'chain');
    }
    // path lamps
    for (const core of w.garden.lamps) {
      const p = core.position;
      this.cap(V(p.x, -1, p.z), V(p.x, p.y - 5, p.z), 1.3, 'lamp');
      this.sph(p, 5.6, 'lamp');
    }
    // seed lanterns (glass orbs on stalks)
    // (their rest pose: the stalks nod a little in the wind)
    for (const o of w.flora.orbs) {
      this.sph(o.base, 1.7 * o.sc + 0.2, 'orb');
      o.pos = o.base.clone();
    }
    // rose arch over the path
    {
      const z = -250, x0 = L.pathX[0] - 6, x1 = L.pathX[1] + 6, xc = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      for (const dz of [-6, 0, 6]) {
        const pts = [V(x0, -1, z + dz)];
        for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; pts.push(V(xc - Math.cos(a) * hw, 70 + Math.sin(a) * hw * 0.9, z + dz)); }
        pts.push(V(x1, -1, z + dz));
        this.chain(pts, 4.2, 'arch');
      }
    }
    // fountain: basin, column and the armillary's glowing core
    {
      const xc = (L.pathX[0] + L.pathX[1]) / 2, z = -560;
      this.cyl(xc, z, 50, -3, 11, 'fountain');
      this.cap(V(xc, 0, z), V(xc, 61, z), 7.5, 'fountain');
      this.sph(V(xc, 86, z), 7, 'armillary');
    }
    // the skep (its door is a trigger, handled by the interactions)
    {
      const s = w.skep.group.position;
      this.cyl(s.x, s.z, 7, -2, 4.2, 'skep');
      this.ell(V(s.x, 7.6, s.z), 6.0, 5.6, 'skep');
    }
    // escapement, root crown, roots are low; lily, blossom, reed, tree, pods
    this.ell(V(L.escapement.x, 0.9, L.escapement.z), 4.8, 1.6, 'escapement');
    this.sph(V(-1.0, 2.0, 1.6), 3.4, 'crown');
    {
      const lily = w.lily;
      lily.group.updateMatrixWorld(true);
      const pts = lily.stemPts(0.9).map((p) => lily.group.localToWorld(p.clone()));
      this.chain(pts, 1.0, 'lily');
      const bloom = lily.bloom.getWorldPosition(V());
      this.sph(bloom, 2.6, 'lily');
      const axis = V(0, 1, 0).applyQuaternion(lily.bloom.getWorldQuaternion(new THREE.Quaternion()));
      this.addLandable({ kind: 'lily', name: 'the porcelain lily', spot: bloom.clone().addScaledVector(axis, 2.2).add(V(0, 1.4, 0)), radius: 3, pollen: 0.25, ref: lily });
    }
    {
      const bl = w.blossom;
      bl.group.updateMatrixWorld(true);
      const bell = bl.bell.getWorldPosition(V());
      this.chain([bl.group.localToWorld(V(0, 0, 0)), bl.group.localToWorld(V(-0.4, 10.8, 0.3)), bl.group.localToWorld(V(0.8, 21.6, 1.2)), bell], 1.0, 'blossom');
      this.sph(bl.bell.localToWorld(V(0, 2.2, 0)), 3.0, 'blossom');
      this.addLandable({ kind: 'blossom', name: 'the glass blossom', spot: bl.mouthWorld().add(V(0, 1.3, 0)), radius: 3, pollen: 0.25, ref: bl });
    }
    {
      const reed = w.reed;
      reed.group.updateMatrixWorld(true);
      const pts = [];
      for (let i = 0; i <= 5; i++) pts.push(reed.group.localToWorld(reed.curve.getPointAt(i / 5)));
      this.chain(pts, 1.0, 'reed');
    }
    {
      const tr = L.songbirdTree;
      this.cap(V(tr.x, -1, tr.z), V(tr.x, 40, tr.z), 3.2, 'tree');
      const perch = w.tree.perchCurve;
      const pts = [];
      for (let i = 0; i <= 4; i++) pts.push(w.tree.group.localToWorld(perch.getPointAt(i / 4)));
      this.chain(pts, 1.6, 'tree');
    }
    for (const p of w.pods.pods) this.sph(p.pos, 1.7, 'pod');
    this._flagBlocked();
  }

  // Blooms buried in a shrub, palm, column or orb (planting added around
  // them) can't be reached: the bee would press against the solid forever.
  // Flag them so the autopilot never picks them and the player isn't offered
  // them. Petal cups and bloom heads don't count (the bee lands in those).
  _flagBlocked() {
    const n = V();
    const clear = (q) => {
      let best = this._wallDist(q, n);
      this._near(q, 8, (c) => {
        if (c.tag === 'cup' || c.tag === 'bloom' || c.tag === 'hero-cup' || c.tag === 'hero-petal') return;
        best = Math.min(best, this._sdf(c, q, n));
      });
      return best;
    };
    for (const l of this.landables) {
      const above = clear(l.spot.clone().add(V(0, 4.5, 0)));
      const at = clear(l.spot);
      l.blocked = above < 0.6 || at < -1.0;
    }
  }
}
