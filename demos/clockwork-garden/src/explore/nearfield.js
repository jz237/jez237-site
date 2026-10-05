import * as THREE from 'three';
import { leafGrid, leafPoint, leafTriangles } from '../geometry/leaf.js';
import { partsCross, partBox, boxHit } from '../geometry/intersect.js';
import { swayMaterial, swayDepth } from '../world/wind.js';
import { enamel, withDither } from './upgrade.js';
import { enamelLeafTextures } from '../materials/textures.js';
import { groundHeight } from './bounds.js';
import { bloomRadius } from '../world/planting.js';
import { RNG } from '../core/rng.js';
import { L } from '../world/layout.js';

// Bee-scale planting for the interactive modes. The film's foliage was built
// for distant cameras (big flat blades, masses of overlapping leaves); at
// APX-9's scale it read as giant polygons and crowded the lens. Here every
// plant is grown again, leaf by leaf, from the same layout (flowers, masses,
// fern clumps, elephant ears, ivy vines), with smaller, varied, cupped
// enamel leaves on short stalks (one parametric leaf, geometry/leaf.js):
//   · each flower: a basal rosette and alternate leaves up its stem
//     (golden-angle phyllotaxis, smaller toward the bloom);
//   · elephant ears: clumps of heart-shaped leaves on long stalks;
//   · foliage masses and shrubs: shingled leaves over the same ellipsoid the
//     bee collides with (so what you see is what you bump into);
//   · elephant ears and tall canna blades along the path edges;
//   · fern clumps and the potted palms: fronds turned, lifted or sized to fit;
//   · the rose arch: leaves along its iron hoops;
//   · ground cover: small leaves low over the soil in the gaps;
//   · ivy: leaves along every vine, facing out from the iron.
// Nothing passes through anything: each leaf is tested before it is placed
// (its exact triangles against every part already placed, geometry/
// intersect.js; points against stems, the swept volume of every bloom's
// petals, iron, glass, lanterns, urns, roses, the soil and the curbs) and is
// turned, shrunk or dropped until it fits.
// Grown a few milliseconds a frame (step()), always in the same order, and
// shown once complete (until then the film's foliage stands in). Leaves live
// in 64-unit tiles (one draw each), switch to a coarser grid with distance,
// and sway with the garden's breeze and APX-9's wash (world/wind.js).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const UP = V(0, 1, 0);
const TILE = 64;
const GREENS = ['#86964a', '#648a53', '#4a7a5c', '#97a652', '#76863e', '#517e65', '#77873e', '#477a5d'];
const DEEP = ['#477a5d', '#3a6553', '#517e65', '#4a7a5c', '#5a7b45'];
const BRONZE = ['#b0803f', '#a8693a', '#c19a52', '#a7763c'];
const IVY = ['#5f7f40', '#6f8c46', '#4d6d3c', '#7e9a50', '#58783e'];
const COLUMNS = [];
for (const x of [-118, 168]) for (let i = 0; i < 8; i++) { const z = 150 - i * 150; if (z >= L.house.z1 + 5) COLUMNS.push([x, z]); }
// cast-iron column radius at height y (greenhouse.js: shaft 4 → 3.2, plinth 8 to y 10)
const shaftR = (y) => (y < 10.5 ? 8 : 4 - 0.8 * (y / (L.house.wall + 40)));
const SHRINK = { iron: 0.8, lantern: 0.8, chain: 0.4, lamp: 0.9, urn: 0.95, orb: 0.95, arch: 0.36, fountain: 0.97, armillary: 0.9, skep: 0.95, escapement: 0.9, crown: 0.9, lily: 0.85, blossom: 0.85, reed: 0.85, tree: 0.85, pod: 0.9, 'hero-stem': 0.85, 'hero-cup': 0.9, 'hero-petal': 0.9, bellstem: 0.8, palm: 1.0 };

// ---- exact placement test: geometry/intersect.js ---------------------------------------
class PartHash {
  constructor(cell = 8) { this.cell = cell; this.map = new Map(); this.stamp = 0; }
  _cells(b, fn) {
    const c = this.cell;
    for (let i = Math.floor(b[0] / c); i <= Math.floor(b[3] / c); i++)
      for (let j = Math.floor(b[1] / c); j <= Math.floor(b[4] / c); j++)
        for (let k = Math.floor(b[2] / c); k <= Math.floor(b[5] / c); k++) fn(((i + 400) * 2048 + (k + 1024)) * 512 + (j + 64));
  }
  add(p) { this._cells(p.box, (k) => { let l = this.map.get(k); if (!l) this.map.set(k, (l = [])); l.push(p); }); }
  remove(p) { this._cells(p.box, (k) => { const l = this.map.get(k); if (l) { const i = l.indexOf(p); if (i >= 0) l.splice(i, 1); } }); }
  hits(p) {
    const st = ++this.stamp;
    let hit = false;
    this._cells(p.box, (k) => {
      if (hit) return;
      const l = this.map.get(k);
      if (!l) return;
      for (const o of l) {
        if (o.stamp === st) continue;
        o.stamp = st;
        if (!boxHit(p.box, o.box)) continue;
        const tied = Math.hypot(p.pivot[0] - o.pivot[0], p.pivot[1] - o.pivot[1], p.pivot[2] - o.pivot[2]) < 1.6;
        if (partsCross(p, o, tied ? 0.2 : 0)) { hit = true; return; }
      }
    });
    return hit;
  }
}

// the fine leaf grid's triangle list (shared by every leaf part)
const NONE = {};
const IVY_OWN = { ivy: true };
const PALM_OWN = { ivy: true, palm: true }; // palm fronds: own crown, no flower checks needed above the beds
// points tested against the solids: along the midrib and out at the margins
const TESTS = [[0.25, 0], [0.45, -0.95], [0.45, 0.95], [0.6, 0], [0.75, -0.85], [0.75, 0.85], [0.88, 0], [1, 0]];
const GRID = (() => {
  const g = leafGrid('hi');
  const idx = g.index.array;
  const T = new Uint16Array(idx);
  const rows = g.attributes.position;
  const S = new Float32Array(idx.length / 3);
  for (let t = 0; t < S.length; t++) S[t] = Math.min(rows.getX(idx[t * 3]), rows.getX(idx[t * 3 + 1]), rows.getX(idx[t * 3 + 2]));
  const uv = []; for (let i = 0; i < rows.count; i++) uv.push([rows.getX(i), rows.getY(i)]);
  return { T, S, sv: uv };
})();

export class NearField {
  constructor({ world, bounds, quality, growth = null, bells = null, scenery = null, sync = false }) {
    this.world = world;
    this.bounds = bounds;
    this.low = quality.tier === 'low';
    this.group = new THREE.Group();
    this.group.name = 'nearfield';
    this.rng = new RNG('nearfield');
    this.hash = new PartHash(8);
    this.leaves = []; // { m: Float32Array(16), col, a, b, swing, ivy, L }
    this.nextId = 1;
    this.stats = { tried: 0, placed: 0, dropped: 0, ferns: 0, frondsDropped: 0, why: {} };
    this.growth = growth;
    this.bells = bells;
    this.lod0 = this.low ? 55 : 80;
    this.ready = false;
    this.onReady = null;
    this.stats.ms = 0;
    this._materials();
    this._gen = this._steps(world, scenery, quality);
    if (sync) this.finish();
  }

  // the planting is grown a few milliseconds a frame (always in the same
  // order, so the garden is the same every time) and shown once complete
  *_steps(world, scenery, quality) {
    const phase = function* (name, gen) {
      this._phaseName = name;
      const t = performance.now();
      let acc = 0, last = t;
      for (const _ of gen) { acc += performance.now() - last; yield; last = performance.now(); }
      acc += performance.now() - last;
      (this.stats.phases ??= {})[name] = Math.round(acc);
    }.bind(this);
    const t0 = performance.now();
    this._solids(world, scenery);
    (this.stats.phases ??= {}).solids = Math.round(performance.now() - t0);
    yield;
    yield* phase('palms', this._palms(world));
    yield* phase('stems', this._plants(world, 'stem'));
    yield* phase('ears', this._ears(world));
    yield* phase('ferns', this._ferns(world));
    yield* phase('rosettes', this._plants(world, 'rosette'));
    yield* phase('arch', this._arch(world));
    yield* phase('masses', this._masses(world, scenery));
    yield* phase('cover', this._cover(world));
    yield* phase('ivy', this._ivy(world));
    yield* phase('build', this._build(quality));
    this.stats.placed = this.leaves.length;
    this.ready = true;
    this.onReady?.(this);
  }
  step(ms = 4) {
    if (this.ready) return true;
    const t0 = performance.now();
    let t = t0;
    while (t - t0 < ms) {
      const done = this._gen.next().done;
      const now = performance.now();
      // (the longest single step, for spotting a phase that doesn't yield often enough)
      if (now - t > (this.stats.longestStep?.ms ?? 0)) this.stats.longestStep = { ms: Math.round((now - t) * 10) / 10, phase: this._phaseName || 'solids' };
      t = now;
      if (done) break;
    }
    const dt = performance.now() - t0;
    this.stats.ms += dt;
    this.stats.longestSlice = Math.max(this.stats.longestSlice || 0, dt);
    return this.ready;
  }
  finish() { while (!this.ready) this.step(1000); }

  // ---- solids -----------------------------------------------------------------------
  _solids(world, scenery) {
    const fl = world.flora;
    this.stems = fl.flowers.map((f, i) => ({ f, i, a: f.base.clone(), b: f.top.clone(), r: 0.5 * f.scale + 0.25, R: bloomRadius(f), reach: (1.25 + f.ty.len) * f.scale }));
    this.sgrid = new Map();
    for (const st of this.stems) { const k = Math.floor(st.a.x / 32) + ',' + Math.floor(st.a.z / 32); if (!this.sgrid.has(k)) this.sgrid.set(k, []); this.sgrid.get(k).push(st); }
    // grown glass blooms (they appear later in a session) and bellflowers
    this.extra = [];
    for (const b of this.growth?.blooms || []) this.extra.push({ a: b.base, b: b.top, r: 0.7, top: b.top, tr: 4.2 * b.scale });
    for (const p of this.bells?.plants || []) this.extra.push({ a: p.base, b: p.base.clone().add(V(0, p.H, 0)), r: 0.8, top: p.base.clone().add(V(0, p.H * 0.8, 0)), tr: p.H * 0.32 });
    this.masses = [
      ...world.foliage.bushSpots.filter((b) => !b.hidden),
      ...(fl.shrubSpots || []).filter((b) => !b.hidden),
      ...(scenery?.endMasses || []),
    ].map((b) => ({ b, cx: b.x, cy: b.y0 + b.h * 0.42, cz: b.z, rx: b.r * 0.92, ry: b.h * 0.5 }));
    this.mgrid = new Map();
    this.masses.forEach((m, i) => {
      for (let x = Math.floor((m.cx - m.rx) / 32); x <= Math.floor((m.cx + m.rx) / 32); x++) for (let z = Math.floor((m.cz - m.rx) / 32); z <= Math.floor((m.cz + m.rx) / 32); z++) {
        const k = x + ',' + z;
        if (!this.mgrid.has(k)) this.mgrid.set(k, []);
        this.mgrid.get(k).push(m);
      }
    });
    // roses on the masses (film geometry, kept)
    this.roses = [];
    for (const b of world.foliage.bushSpots) for (const r of b.roses || []) if (!b.hidden) this.roses.push({ p: r.p, r: 1.9 * r.sc });
    // one grid of everything a leaf must keep out of
    this.cells = new Map();
    const put = (item, x, z, rad) => {
      for (let i = Math.floor((x - rad) / 16); i <= Math.floor((x + rad) / 16); i++) for (let j = Math.floor((z - rad) / 16); j <= Math.floor((z + rad) / 16); j++) {
        const k = i * 4096 + j;
        let l = this.cells.get(k);
        if (!l) this.cells.set(k, (l = []));
        l.push(item);
      }
    };
    for (const st of this.stems) { put({ t: 0, st }, st.a.x, st.a.z, 1.5); const top = st.b; put({ t: 1, st }, top.x, top.z, st.reach + 1.5); }
    for (const e of this.extra) { put({ t: 2, e }, e.a.x, e.a.z, 1.5); put({ t: 3, e }, e.top.x, e.top.z, e.tr + 0.5); }
    for (const r of this.roses) put({ t: 4, r }, r.p.x, r.p.z, r.r + 0.5);
    for (const m of this.masses) put({ t: 5, m }, m.cx, m.cz, m.rx + 0.5);
  }

  _stemsNear(x, z, reach = 24) {
    const out = [];
    for (let i = Math.floor((x - reach) / 32); i <= Math.floor((x + reach) / 32); i++) for (let j = Math.floor((z - reach) / 32); j <= Math.floor((z + reach) / 32); j++) for (const st of this.sgrid.get(i + ',' + j) || []) out.push(st);
    return out;
  }

  // is point p inside something solid? own: the leaf's own stem / mass (skipped near the stalk)
  _blocked(p, own = NONE, s = 1) {
    const stem = own.stem, mass = own.mass, ivy = own.ivy && !own.palm, palm = own.palm;
    if (p.y < 5.6 && p.y < groundHeight(p.x, p.z) + 0.3) return 'ground';
    const n = this._n || (this._n = V());
    if (this.bounds._wallDist(p, n) < (ivy ? 1.6 : 0.4)) return 'wall';
    for (const [cx, cz] of COLUMNS) {
      const d = Math.hypot(p.x - cx, p.z - cz);
      if (d < shaftR(p.y) + (ivy ? 0.5 : 0.3)) return 'column';
    }
    let hit = false;
    this.bounds._near(p, 1.5, (c) => {
      if (hit) return;
      const k = SHRINK[c.tag];
      if (k === undefined) return;
      if ((ivy || palm) && (c.tag === 'palm' || c.tag === 'urn')) return;
      const r = c.type === 'ell' ? Math.min(c.rx, c.ry) : c.r;
      if (this.bounds._sdf(c, p, n) < -(1 - k) * r + 0.25) hit = c.tag;
    });
    if (hit) return hit;
    if (ivy) return false;
    const l = this.cells.get(Math.floor(p.x / 16) * 4096 + Math.floor(p.z / 16));
    if (!l) return false;
    for (const it of l) {
      if (it.t === 0) {
        // a flower stem (not its own, near the leaf's stalk)
        const st = it.st;
        if (st === stem && s < 0.35) continue;
        const abx = st.b.x - st.a.x, aby = st.b.y - st.a.y, abz = st.b.z - st.a.z;
        const t = Math.max(0, Math.min(1, ((p.x - st.a.x) * abx + (p.y - st.a.y) * aby + (p.z - st.a.z) * abz) / (abx * abx + aby * aby + abz * abz)));
        if (Math.hypot(p.x - st.a.x - abx * t, p.y - st.a.y - aby * t, p.z - st.a.z - abz * t) < st.r) return 'stem';
      } else if (it.t === 1) {
        // its bloom: everywhere the petals sweep between bud and wide open
        // (flora.js caps the opening just below horizontal)
        const st = it.st, top = st.b, f = st.f;
        const sc = f.scale, len = f.ty.len * sc + 1.2, ring = 1.2 * sc;
        const dr = Math.hypot(p.x - top.x, p.z - top.z) - ring, dy = p.y - top.y;
        if (dr < 0) { if (dy > -1.9 * sc - 0.6 && dy < len) return 'bloom'; }
        else if (dr * dr + dy * dy < len * len) {
          const ang = Math.atan2(dr, dy);
          if (ang > f.ty.closed - 0.2 && ang < 1.92) return 'bloom';
        }
      } else if (it.t === 2) {
        const e = it.e;
        if (p.y < e.b.y && Math.hypot(p.x - e.a.x, p.z - e.a.z) < e.r + 0.3) return 'extra';
      } else if (it.t === 3) {
        const e = it.e;
        if (Math.hypot(p.x - e.top.x, p.y - e.top.y, p.z - e.top.z) < e.tr) return 'extra';
      } else if (it.t === 4) {
        const r = it.r;
        if (Math.hypot(p.x - r.p.x, p.y - r.p.y, p.z - r.p.z) < r.r) return 'rose';
      } else {
        // foliage masses (other than its own: those are the leaves' business)
        const m = it.m;
        if (m === mass) continue;
        if (Math.hypot((p.x - m.cx) / (m.rx * 0.9), (p.y - m.cy) / (m.ry * 0.9), (p.z - m.cz) / (m.rx * 0.9)) < 1) return 'mass';
      }
    }
    return false;
  }

  // ---- one leaf ---------------------------------------------------------------------------------------
  // P attachment, D along the leaf, F upper face (⊥ D), length Lw, params a, b
  _frame(P, D, F, Lw) {
    const X = new THREE.Vector3().crossVectors(D, F).normalize();
    const Fz = new THREE.Vector3().crossVectors(X, D).normalize();
    const m = new THREE.Matrix4().makeBasis(X.multiplyScalar(Lw), D.clone().multiplyScalar(Lw), Fz.multiplyScalar(Lw));
    m.setPosition(P);
    return m;
  }

  // a palette of leaf shapes per kind (their local grids computed once): each
  // leaf picks one, so the garden keeps its variety without recomputing shapes
  _shape(kind, r, gen) {
    this.palette ??= {};
    let pal = this.palette[kind];
    if (!pal) {
      const q = new RNG('nf-shape-' + kind);
      pal = this.palette[kind] = [];
      for (let i = 0; i < 40; i++) { const [a, b] = gen(q); pal.push({ a, b, loc: this._local(a, b) }); }
    }
    return pal[Math.floor(r.float() * pal.length)];
  }

  // a leaf spec's local points: the fine grid, then the test points (computed
  // once per spec, reused for every turn and size tried)
  _local(a, b) {
    const n = GRID.sv.length;
    const out = new Float32Array((n + TESTS.length) * 3);
    const v = this._pv || (this._pv = V());
    GRID.sv.forEach(([sv, vv], i) => { leafPoint(a, b, sv, vv, v); out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z; });
    TESTS.forEach(([sv, vv], i) => { leafPoint(a, b, sv, vv, v); out[(n + i) * 3] = v.x; out[(n + i) * 3 + 1] = v.y; out[(n + i) * 3 + 2] = v.z; });
    return out;
  }

  // the leaf's world triangles on the fine grid
  _part(m, loc) {
    const n = GRID.sv.length;
    const P = new Float32Array(n * 3);
    const e = m.elements;
    for (let i = 0; i < n; i++) {
      const x = loc[i * 3], y = loc[i * 3 + 1], z = loc[i * 3 + 2];
      P[i * 3] = e[0] * x + e[4] * y + e[8] * z + e[12];
      P[i * 3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
      P[i * 3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
    }
    return { P, T: GRID.T, S: GRID.S, box: partBox(P), pivot: [e[12], e[13], e[14]], stamp: 0 };
  }

  // the test points in world space (reused vectors)
  _points(m, loc) {
    const n = GRID.sv.length, e = m.elements;
    const out = this._tp || (this._tp = TESTS.map(([s]) => [V(), s]));
    for (let i = 0; i < TESTS.length; i++) {
      const k = (n + i) * 3, x = loc[k], y = loc[k + 1], z = loc[k + 2];
      out[i][0].set(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
    }
    return out;
  }

  // try a leaf; on success it is placed and its triangles join the hash
  _try(P, D, F, Lw, a, b, col, own = {}, extra = {}, loc = this._local(a, b)) {
    this.stats.tried++;
    const m = this._frame(P, D, F, Lw);
    const why = (w) => { const k = (extra.kind || 'leaf') + ':' + w; this.stats.why[k] = (this.stats.why[k] || 0) + 1; return false; };
    const t0 = performance.now();
    for (const [p, s] of this._points(m, loc)) { const w = this._blocked(p, own, s); if (w) { this.stats.tBlock = (this.stats.tBlock || 0) + performance.now() - t0; return why(w); } }
    const t1 = performance.now();
    this.stats.tBlock = (this.stats.tBlock || 0) + t1 - t0;
    const id = this.nextId++;
    const part = this._part(m, loc);
    const t2 = performance.now();
    this.stats.tPart = (this.stats.tPart || 0) + t2 - t1;
    const crossed = this.hash.hits(part);
    this.stats.tCross = (this.stats.tCross || 0) + performance.now() - t2;
    if (crossed) return why('leaf');
    this.hash.add(part);
    // per-leaf sway: [amplitude, wash, phase (shared by a plant), flutter]
    const sw = extra.sway || [1, 1, this.rng.float()];
    this.leaves.push({ m: m.elements.slice(), col, a, b, swing: extra.swing ?? 0, ivy: !!extra.ivy, kind: extra.kind || 'leaf', id, s3: [sw[0], sw[1], sw[2] + this.rng.range(-0.04, 0.04), sw[3] ?? 1] });
    const k = extra.kind || 'leaf';
    this.stats.byKind ??= {};
    this.stats.byKind[k] = (this.stats.byKind[k] || 0) + 1;
    return true;
  }

  // try variations of a leaf: turned about its stalk, tilted, then smaller
  _fit(P, D, F, Lw, a, b, col, own, extra, turnAxis = UP, loc = this._local(a, b)) {
    const r = this.rng;
    const turns = [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2];
    for (const shrink of [1, 0.75]) {
      for (const tA of turns) {
        const q = new THREE.Quaternion().setFromAxisAngle(turnAxis, tA + r.range(-0.08, 0.08));
        const D2 = D.clone().applyQuaternion(q), F2 = F.clone().applyQuaternion(q);
        if (this._try(P, D2, F2, Lw * shrink, a, b, col, own, extra, loc)) return true;
      }
    }
    this.stats.dropped++;
    return false;
  }

  // ---- flowers: rosettes and leafy stems -----------------------------------------------------------
  *_plants(world, part) {
    const r = new RNG('nearfield-' + part);
    const S = this.low ? 1.18 : 1;
    for (const st of this.stems) {
      const f = st.f;
      const g = groundHeight(f.base.x, f.base.z);
      const h = f.top.y - f.base.y;
      // the plant's own colour and phase (the same in both passes)
      const pr = new RNG('nf-plant-' + st.i);
      const bronze = (f.ty.name === 'copperbloom' || f.ty.name === 'tulip') && pr.chance(0.35);
      const pal = bronze ? BRONZE : GREENS;
      const tint = new THREE.Color(pal[Math.floor(pr.float() * pal.length)]);
      const col = () => tint.clone().offsetHSL(r.range(-0.02, 0.02), r.range(-0.06, 0.06), r.range(-0.05, 0.05));
      const dir = f.dir.clone().normalize();
      const side0 = new THREE.Vector3(1, 0, 0).addScaledVector(dir, -dir.x).normalize();
      const radial = (phi) => side0.clone().applyAxisAngle(dir, phi);
      const own = { stem: st };
      const ph = pr.float(); // one phase per plant: its leaves sway together
      const sw = { stem: [0.9, 1, ph], rosette: [-0.8, 1, ph] }; // (negative: rooted at the soil)
      // basal rosette
      const nR = part === 'rosette' ? Math.round((this.low ? 4 : 5) + r.float() * 3) : 0;
      const phi0 = r.range(0, TAU);
      for (let k = 0; k < nR; k++) {
        const phi = phi0 + k * 2.39996 + r.range(-0.2, 0.2);
        const R = radial(phi);
        const alpha = r.range(0.85, 1.15); // from vertical
        const Dv = UP.clone().multiplyScalar(Math.cos(alpha)).addScaledVector(R, Math.sin(alpha)).normalize();
        const F = UP.clone().addScaledVector(Dv, -Dv.y).normalize();
        const P = f.base.clone().addScaledVector(R, 0.45 * f.scale).setY(Math.max(g, f.base.y) + 0.25);
        const Lw = r.range(6.2, 9.4) * Math.sqrt(f.scale) * S;
        const sh = this._shape('rosette', r, (q) => [[q.range(0.3, 0.44), q.range(0.3, 0.75), q.range(0.3, 0.55), q.range(0.7, 1.1)], [q.range(0.1, 0.2), q.range(0.0, 0.05), q.range(-0.2, 0.2), q.range(0.14, 0.24)]]);
        this._fit(P, Dv, F, Lw, sh.a, sh.b, col(), own, { kind: 'rosette', sway: sw.rosette }, UP, sh.loc);
      }
      if (part !== 'stem') { yield; continue; }
      // alternate leaves up the stem, smaller toward the bloom
      let y = Math.max(0, g - f.base.y) + 2.8;
      const yTop = h * 0.55;
      let k = 0;
      const phiS = r.range(0, TAU);
      while (y < yTop) {
        const t = y / h;
        const Lw = (7.2 - 3.2 * (y / yTop)) * r.range(0.85, 1.12) * Math.sqrt(f.scale) * S;
        const phi = phiS + k * 2.39996;
        const R = radial(phi);
        const P = f.base.clone().addScaledVector(dir, y).addScaledVector(R, (0.5 - 0.18 * t) * f.scale - 0.04);
        const alpha = r.range(0.75, 1.15) - 0.25 * t;
        const Dv = dir.clone().multiplyScalar(Math.cos(alpha)).addScaledVector(R, Math.sin(alpha)).normalize();
        const F = dir.clone().addScaledVector(Dv, -Dv.dot(dir)).normalize();
        const sh = this._shape('stem', r, (q) => [[q.range(0.26, 0.4), q.range(0.0, 0.45), q.range(0.3, 0.55), q.range(0.35, 0.8)], [q.range(0.1, 0.2), q.range(0.0, 0.05), q.range(-0.25, 0.25), q.range(0.08, 0.15)]]);
        this._fit(P, Dv, F, Lw, sh.a, sh.b, col(), own, { kind: 'stem', sway: sw.stem }, dir, sh.loc);
        y += Lw * 0.36 + r.range(0, 0.6);
        k++;
      }
      yield;
    }
  }

  // ---- elephant ears (heart-shaped, on long stalks) and tall canna blades ------------------------
  // the tall foliage along the path edges
  *_ears(world) {
    const r = this.rng;
    // a clump needs room: no stem close by, not inside a mass or a bloom
    const roomy = (x, z) => {
      for (const st of this._stemsNear(x, z, 12)) if (Math.hypot(st.a.x - x, st.a.z - z) < 8) return false;
      for (const y of [2, 6, 11]) if (this._blocked(V(x, groundHeight(x, z) + y, z))) return false;
      return true;
    };
    const ears = world.flora.ears || [];
    for (let ei = 0; ei < ears.length; ei++) {
      const ear0 = ears[ei];
      const ear = { ...ear0 };
      for (let rr = 0, ok = roomy(ear.x, ear.z); !ok && rr < 18; ) {
        rr += 3;
        for (let i = 0; i < 10 && !ok; i++) {
          const a = (i / 10) * TAU + rr;
          if (roomy(ear0.x + Math.cos(a) * rr, ear0.z + Math.sin(a) * rr)) { ear.x = ear0.x + Math.cos(a) * rr; ear.z = ear0.z + Math.sin(a) * rr; ok = true; }
        }
      }
      const canna = ei % 2 === 1;
      const n = this.low ? 3 : canna ? 5 : 4;
      const g = groundHeight(ear.x, ear.z);
      for (let k = 0; k < n; k++) {
        const yaw = ear.yaw + (k / n) * TAU + r.range(-0.3, 0.3);
        const R = V(Math.sin(yaw), 0, Math.cos(yaw));
        const el = canna ? r.range(1.12, 1.38) : r.range(0.95, 1.2); // elevation above horizontal
        const Dv = UP.clone().multiplyScalar(Math.sin(el)).addScaledVector(R, Math.cos(el)).normalize();
        const F = UP.clone().addScaledVector(Dv, -Dv.y).normalize();
        const P = V(ear.x + R.x * (canna ? 0.6 : 1.2), g + 0.2, ear.z + R.z * (canna ? 0.6 : 1.2));
        const Lw = canna ? r.range(18, 26) : r.range(14, 20);
        const sh = canna
          ? this._shape('canna', r, (q) => [[q.range(0.17, 0.24), q.range(0.0, 0.2), q.range(0.35, 0.55), q.range(0.45, 0.8)], [q.range(0.14, 0.2), q.range(0.03, 0.06), q.range(-0.3, 0.3), q.range(0.08, 0.14)]])
          : this._shape('ear', r, (q) => [[q.range(0.6, 0.78), q.range(0.85, 1.0), q.range(0.2, 0.35), q.range(0.8, 1.15)], [q.range(0.1, 0.16), q.range(0.02, 0.05), q.range(-0.15, 0.15), q.range(0.34, 0.44)]]);
        const a = sh.a, b = sh.b;
        const col = new THREE.Color((canna ? GREENS : DEEP)[Math.floor(r.float() * (canna ? GREENS : DEEP).length)]).offsetHSL(0, r.range(-0.05, 0.05), r.range(-0.04, 0.04));
        this._fit(P, Dv, F, Lw, a, b, col, {}, { kind: 'ear', sway: [-0.9, 1, ear.yaw / TAU] }, UP, sh.loc);
      }
      yield; // (a clump at a time)
    }
    yield;
  }

  // ---- ferns: the film's fronds, turned and tilted to fit between the plants --------------------------
  // a frond (flora.js) is a rachis with 17 pairs of leaflets; each leaflet is
  // tested triangle by triangle, so leaves may pass between leaflets
  *_ferns(world) {
    const fl = world.flora;
    this.fronds = [];
    // the frond's front faces (flora.js geometry; back faces carry a negative flutter weight)
    const g = fl.fernMesh.geometry, pos = g.attributes.position, W = g.attributes.aSwayW;
    const lp = [], lt = [], ls = [];
    for (let i = 0; i < pos.count; i += 3) {
      let back = false;
      for (let j = 0; j < 3; j++) { const y = W.getY(i + j); if (y < 0 || Object.is(y, -0)) back = true; }
      if (back) continue;
      const o = lp.length / 3;
      for (let j = 0; j < 3; j++) lp.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
      lt.push(o, o + 1, o + 2);
      ls.push(Math.min(1, Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i)) / 17));
    }
    const LT = new Uint32Array(lt), LS = new Float32Array(ls);
    // test points: rachis and leaflet tips
    const rachis = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 6, 3), V(0, 9, 9), V(0, 8, 15)]);
    const tips = [];
    for (let i = 1; i < 18; i++) {
      const k = i / 18, p = rachis.getPointAt(k), tg = rachis.getTangentAt(k), phi = Math.atan2(tg.z, tg.y) * 0.8, sc = 1 - k * 0.75;
      if (i % 2) tips.push(p.clone());
      for (const sd of [-1, 1]) for (const u of i % 2 ? [1] : [0.6]) tips.push(p.clone().add(V(0.932 * sd, 0.362 * Math.cos(phi), 0.362 * Math.sin(phi)).multiplyScalar(3.2 * sc * u)));
    }
    const q = new THREE.Quaternion(), qt = new THREE.Quaternion(), m = new THREE.Matrix4();
    const pw = V();
    for (const fs of fl.fernSpots || []) {
      if (fs.hidden) continue;
      const y = groundHeight(fs.x, fs.z) - 0.3;
      let any = false;
      for (const fr of fs.fronds) {
        yield;
        let ok = false;
        for (const [shrink, lift] of [[1, 0], [0.8, 0.3], [0.62, 0.5]]) {
          for (const turn of [0, 0.4, -0.4, 0.85, -0.85, 1.3]) {
            const yaw = fr.yaw + turn, sc = fr.sc * shrink;
            // lift: tilt the frond up about its own side axis (shorter reach)
            q.setFromAxisAngle(UP, yaw).multiply(qt.setFromAxisAngle(V(1, 0, 0), -lift));
            m.compose(V(fs.x, y, fs.z), q, V(sc, sc, sc));
            let bad = false;
            for (const t0 of tips) {
              const w0 = this._blocked(pw.copy(t0).applyMatrix4(m));
              if (w0) { bad = true; this.stats.why['fern:' + w0] = (this.stats.why['fern:' + w0] || 0) + 1; break; }
            }
            if (bad) continue;
            const P = new Float32Array(lp.length), e = m.elements;
            for (let i = 0; i < lp.length; i += 3) {
              const x = lp[i], yy = lp[i + 1], z = lp[i + 2];
              P[i] = e[0] * x + e[4] * yy + e[8] * z + e[12]; P[i + 1] = e[1] * x + e[5] * yy + e[9] * z + e[13]; P[i + 2] = e[2] * x + e[6] * yy + e[10] * z + e[14];
            }
            const part = { P, T: LT, S: LS, box: partBox(P), pivot: [fs.x, y, fs.z], stamp: 0 };
            if (this.hash.hits(part)) { this.stats.why['fern:leaf'] = (this.stats.why['fern:leaf'] || 0) + 1; continue; }
            this.hash.add(part);
            this.fronds.push(m.clone());
            ok = any = true;
            break;
          }
          if (ok) break;
        }
        if (!ok) this.stats.frondsDropped++;
      }
      if (any) this.stats.ferns++;
      yield;
    }
    this.fernSource = fl.fernMesh;
  }

  // front faces of a frond geometry (back faces carry a negative flutter weight)
  _frondLocal(g, L) {
    const pos = g.attributes.position, W = g.attributes.aSwayW;
    const lp = [], lt = [], ls = [];
    for (let i = 0; i < pos.count; i += 3) {
      let back = false;
      for (let j = 0; j < 3; j++) { const y = W.getY(i + j); if (y < 0 || Object.is(y, -0)) back = true; }
      if (back) continue;
      const o = lp.length / 3;
      for (let j = 0; j < 3; j++) lp.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
      lt.push(o, o + 1, o + 2);
      ls.push(Math.min(1, Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i)) / L));
    }
    return { lp, LT: new Uint32Array(lt), LS: new Float32Array(ls) };
  }

  // ---- palms: the film's fronds, turned or lifted where they would cut a bloom,
  // a mass, the glass or each other (the urn and crown stay where they are)
  *_palms(world) {
    const fo = world.foliage;
    this.palmFronds = [];
    if (!fo.palmFronds) return;
    const { lp, LT, LS } = this._frondLocal(fo.frondMesh.geometry, 30);
    // test points along the rachis and out to the leaflet tips (frond-local)
    const rachis = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 10, 6), V(0, 14, 16), V(0, 11, 26)]);
    const tips = [];
    for (let i = 2; i < 22; i += 2) {
      const k = i / 22, p = rachis.getPointAt(k), sc = 0.55 + Math.sin(Math.PI * k) * 0.6;
      tips.push(p.clone());
      // leaflets: leafGeometry length 7, rotated about z by ∓1.05 then x by 0.9 + 0.9k
      for (const sd of [-1, 1]) {
        const d = V(Math.sin(sd * 1.05), Math.cos(1.05), 0).applyAxisAngle(V(1, 0, 0), 0.9 + k * 0.9);
        tips.push(p.clone().addScaledVector(d, 7 * sc * 0.95));
      }
    }
    const q = new THREE.Quaternion(), m = new THREE.Matrix4(), e = new THREE.Euler(), pw = V();
    // one palm's fronds at a given size: alternate tiers so leaflets pass above
    // and below each other; each frond may turn or lift a little to fit
    const self = this;
    const tryPalm = function* (list, size, placed) {
      for (let idx = 0; idx < list.length; idx++) {
        const fr = list[idx];
        yield;
        const tier = idx % 2 ? 0.32 : -0.12;
        let placedOne = false;
        for (const [shrink, lift] of [[1, tier], [0.92, tier + 0.18], [0.92, tier - 0.15], [0.84, tier + 0.36]]) {
          for (const turn of [0, 0.2, -0.2, 0.4, -0.4]) {
            q.setFromEuler(e.set(fr.ex - lift, fr.ey + turn, fr.ez, 'YXZ'));
            const sc = fr.s * shrink * size;
            m.compose(V(fr.x, fr.y, fr.z), q, V(sc, sc, sc));
            let bad = false;
            for (const t0 of tips) { const w0 = self._blocked(pw.copy(t0).applyMatrix4(m), PALM_OWN); if (w0) { bad = true; self.stats.why['palm:' + w0] = (self.stats.why['palm:' + w0] || 0) + 1; break; } }
            if (bad) continue;
            const P = new Float32Array(lp.length), el = m.elements;
            for (let i = 0; i < lp.length; i += 3) {
              const x = lp[i], y = lp[i + 1], z = lp[i + 2];
              P[i] = el[0] * x + el[4] * y + el[8] * z + el[12]; P[i + 1] = el[1] * x + el[5] * y + el[9] * z + el[13]; P[i + 2] = el[2] * x + el[6] * y + el[10] * z + el[14];
            }
            const part = { P, T: LT, S: LS, box: partBox(P), pivot: [fr.x, fr.y, fr.z], stamp: 0 };
            if (self.hash.hits(part)) { self.stats.why['palm:leaf'] = (self.stats.why['palm:leaf'] || 0) + 1; continue; }
            self.hash.add(part);
            placed.push({ part, m: m.clone(), col: fr.col });
            placedOne = true;
            break;
          }
          if (placedOne) break;
        }
      }
    };
    // group the fronds by palm; take the largest size at which most of a crown fits
    const palms = new Map();
    for (const fr of fo.palmFronds) { const k = fr.x.toFixed(2) + ',' + fr.z.toFixed(2); if (!palms.has(k)) palms.set(k, []); palms.get(k).push(fr); }
    for (const list of palms.values()) {
      let best = null;
      for (const size of [1, 0.86, 0.74, 0.62]) {
        const got = [];
        yield* tryPalm(list, size, got);
        if (got.length >= Math.ceil(list.length * 0.8) || size === 0.62) { best = got; break; }
        for (const g of got) this.hash.remove(g.part);
      }
      for (const g of best) this.palmFronds.push({ m: g.m, col: g.col });
      this.stats.palmFrondsDropped = (this.stats.palmFrondsDropped || 0) + list.length - best.length;
    }
    this.palmSource = fo.frondMesh;
  }

  // ---- the rose arch: enamel leaves along its two iron hoops -----------------------------------
  *_arch(world) {
    const fl = world.flora, r = new RNG('nf-arch');
    if (!fl.archParts) return;
    const z0 = -250, x0 = L.pathX[0] - 6, x1 = L.pathX[1] + 6, xc = (x0 + x1) / 2, hw = (x1 - x0) / 2;
    const pts = [V(x0, 0, 0)];
    for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI; pts.push(V(xc - Math.cos(a) * hw, 70 + Math.sin(a) * hw * 0.9, 0)); }
    pts.push(V(x1, 0, 0));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.2);
    // the arch's roses (film geometry, kept) are solid to the leaves
    const roses = fl.archParts[0], rm = new THREE.Matrix4(), rp = V();
    for (let i = 0; i < roses.count; i++) { roses.getMatrixAt(i, rm); rp.setFromMatrixPosition(rm); this.extra.push({ a: rp.clone(), b: rp.clone(), r: 0, top: rp.clone(), tr: 2.6 * Math.cbrt(Math.abs(rm.determinant())) }); }
    for (const dz of [-6, 6]) {
      const n = this.low ? 70 : 110;
      for (let k = 0; k < n; k++) {
        const u = (k + r.float()) / n;
        const c = curve.getPointAt(u).add(V(0, 0, z0 + dz));
        if (c.y < 4) continue;
        const tg = curve.getTangentAt(u);
        // out from the tube, a little toward the path's centre line and up
        const side = V(0, 0, Math.sign(dz) * r.range(0.3, 1)).add(V(-tg.y, tg.x, 0).multiplyScalar(r.range(-1, 1)));
        side.normalize();
        const P = c.clone().addScaledVector(side, 1.5);
        const D = side.clone().multiplyScalar(0.8).addScaledVector(tg, r.range(-0.6, 0.6)).normalize();
        let F = V(0, 1, 0).addScaledVector(D, -D.y);
        if (F.lengthSq() < 0.01) F = V(0, 0, 1);
        F.normalize();
        const Lw = r.range(3.6, 5.2);
        const sh = this._shape('arch', r, (q) => [[q.range(0.32, 0.45), q.range(0.3, 0.7), q.range(0.25, 0.45), q.range(0.15, 0.4)], [q.range(0.08, 0.14), q.range(0.0, 0.04), q.range(-0.2, 0.2), q.range(0.1, 0.16)]]);
        const a = sh.a, b = sh.b;
        const col = new THREE.Color(DEEP[Math.floor(r.float() * DEEP.length)]).offsetHSL(0, 0, r.range(-0.03, 0.03));
        this._fit(P, D, F, Lw, a, b, col, NONE, { kind: 'arch', sway: [0.8, 1, (c.x * 0.02) % 1] }, side, sh.loc);
      }
      yield;
    }
  }

  // ---- masses: shingled leaves over the collider's ellipsoid --------------------------------------
  // a golden-angle lattice over the visible cap: every leaf points up the
  // slope and lifts outward at the same angle, so each one lies over the base
  // of the leaves above it (like scales) instead of crossing its neighbours
  *_masses(world, scenery) {
    const r = this.rng;
    const S = this.low ? 1.25 : 1;
    for (const M of this.masses) {
      const { cx, cy, cz, rx, ry } = M;
      const Lw0 = Math.min(8.5, Math.max(3.6, 2.6 + 0.3 * Math.sqrt(rx * ry))) * S;
      // the lattice: area of the cap above the ground, one leaf per (spacing)^2
      const yMin = Math.max(-1, (groundHeight(cx, cz) - cy) / ry);
      const area = 2 * Math.PI * rx * Math.max(rx, ry) * (1 - yMin) * 0.55;
      const d = Lw0 * 0.5;
      const n = Math.max(4, Math.round(area / (d * d)));
      const pal = M.b.wall ? DEEP : GREENS;
      const tint = new THREE.Color(pal[Math.floor(r.float() * pal.length)]).offsetHSL(0, 0.02, M.b.wall ? 0.03 : 0.06);
      // a mass's leaves sway together, gently (they are packed like scales), and
      // the wash only ruffles them: the bee is kept off them by the collider
      const msw = [0.6, 0.35, r.float(), 0.6];
      const others = (this.mgrid.get(Math.floor(cx / 32) + ',' + Math.floor(cz / 32)) || []).filter((o) => o !== M);
      const inOther = (p) => others.some((o) => Math.hypot((p.x - o.cx) / (o.rx * 0.9), (p.y - o.cy) / (o.ry * 0.9), (p.z - o.cz) / (o.rx * 0.9)) < 1);
      const az0 = r.range(0, TAU);
      for (let i = 0; i < n; i++) {
        if (i % 40 === 39) yield;
        // from the crown down to the soil, evenly over the cap
        const sy = 1 - (1 - yMin) * ((i + 0.5) / n);
        const cl = Math.sqrt(Math.max(0, 1 - sy * sy));
        const az = az0 + i * 2.39996 + r.range(-0.12, 0.12);
        const nrm0 = V(Math.cos(az) * cl, sy, Math.sin(az) * cl);
        const p = V(cx + nrm0.x * rx, cy + nrm0.y * ry, cz + nrm0.z * rx);
        if (p.y < groundHeight(p.x, p.z) + 0.6) continue;
        if (inOther(p) || this._blocked(p, { mass: M })) continue;
        const N = V(nrm0.x / rx, nrm0.y / ry, nrm0.z / rx).normalize();
        let T = UP.clone().addScaledVector(N, -N.y);
        if (T.lengthSq() < 0.02) T = V(Math.cos(az + 1.3), 0, Math.sin(az + 1.3));
        T.normalize();
        const beta = r.range(0.62, 0.8);
        const D0 = T.clone().multiplyScalar(Math.cos(beta)).addScaledVector(N, Math.sin(beta)).normalize().applyAxisAngle(N, r.range(-0.18, 0.18));
        const F = N.clone().addScaledVector(D0, -D0.dot(N)).normalize();
        const P = V(cx + (p.x - cx) * 0.84, cy + (p.y - cy) * 0.84, cz + (p.z - cz) * 0.84);
        const Lw = Lw0 * r.range(0.88, 1.1);
        const sh = this._shape('mass', r, (q) => [[q.range(0.34, 0.48), q.range(0.3, 0.8), q.range(0.12, 0.28), q.range(0.1, 0.3)], [q.range(0.06, 0.12), q.range(0.0, 0.035), q.range(-0.1, 0.1), q.range(0.05, 0.09)]]);
        const a = sh.a, b = sh.b;
        const col = tint.clone().offsetHSL(r.range(-0.02, 0.02), r.range(-0.07, 0.07), r.range(-0.06, 0.06));
        this._fitSoft(P, D0, F, Lw, a, b, col, { mass: M }, { kind: 'mass', sway: msw }, N, sh.loc);
      }
      yield;
    }
    // (the film's end masses are hidden once the bee-scale planting has dissolved in: explore.js)
    // a dark leafy core inside each mass: gaps between the leaves read as depth, not soil
    const core = new THREE.IcosahedronGeometry(1, 2);
    this.cores = new THREE.InstancedMesh(core, this.coreMat, this.masses.length);
    const c = new THREE.Color(), m4 = new THREE.Matrix4();
    this.masses.forEach((M, i) => {
      m4.compose(V(M.cx, M.cy, M.cz), new THREE.Quaternion(), V(M.rx * 0.78, M.ry * 0.78, M.rx * 0.78));
      this.cores.setMatrixAt(i, m4);
      this.cores.setColorAt(i, c.set(M.b.wall ? '#1e3226' : '#283d24').offsetHSL(0, 0, r.range(-0.02, 0.02)));
    });
    this.cores.castShadow = false;
    this.cores.receiveShadow = true;
    this.cores.computeBoundingSphere();
    this.group.add(this.cores);
  }

  // masses: fewer variations (a dense surface, so a miss is simply skipped)
  _fitSoft(P, D, F, Lw, a, b, col, own, extra, N, loc = this._local(a, b)) {
    for (const [tA, sh] of [[0, 1], [0.4, 1], [-0.4, 1], [0, 0.8]]) {
      const q = new THREE.Quaternion().setFromAxisAngle(N, tA);
      if (this._try(P, D.clone().applyQuaternion(q), F.clone().applyQuaternion(q), Lw * sh, a, b, col, own, extra, loc)) return true;
    }
    return false;
  }

  // ---- ground cover: small leaves low over the soil in the gaps left ----------------------------
  *_cover(world) {
    const r = new RNG('nf-cover');
    const H = L.house;
    const step = this.low ? 9 : 6.5;
    const OLIVE = ['#6b7a3a', '#5d7444', '#4f6c47', '#7a8a44', '#5a6b36'];
    for (let x = H.x0 + 14; x < H.x1 - 14; x += step) {
      let cells = 0;
      for (let z = H.z1 + 34; z < H.z0 - 22; z += step) {
        if (++cells % 5 === 0) yield;
        const px = x + r.range(-step * 0.45, step * 0.45), pz = z + r.range(-step * 0.45, step * 0.45);
        if (px > L.pathX[0] - 6 && px < L.pathX[1] + 6) continue;
        if (Math.hypot(px, pz) < 50) continue;
        const g = groundHeight(px, pz);
        if (this._blocked(V(px, g + 1.2, pz))) continue;
        const n = 2 + (r.float() < 0.4 ? 1 : 0);
        const yaw0 = r.range(0, TAU);
        const tint = new THREE.Color(OLIVE[Math.floor(r.float() * OLIVE.length)]);
        for (let k = 0; k < n; k++) {
          const yaw = yaw0 + (k / n) * TAU + r.range(-0.4, 0.4);
          const R = V(Math.sin(yaw), 0, Math.cos(yaw));
          const el = r.range(0.25, 0.5);
          const Dv = R.clone().multiplyScalar(Math.cos(el)).addScaledVector(UP, Math.sin(el)).normalize();
          const F = UP.clone().addScaledVector(Dv, -Dv.y).normalize();
          const P = V(px + R.x * 0.3, g + 0.35, pz + R.z * 0.3);
          const sh = this._shape('cover', r, (q) => [[q.range(0.38, 0.55), q.range(0.4, 0.95), q.range(0.2, 0.4), q.range(0.0, 0.25)], [q.range(0.06, 0.12), q.range(0.0, 0.04), q.range(-0.15, 0.15), q.range(0.1, 0.18)]]);
          const col = tint.clone().offsetHSL(r.range(-0.02, 0.02), r.range(-0.05, 0.05), r.range(-0.05, 0.05));
          this._fit(P, Dv, F, r.range(2.6, 4.2) * (this.low ? 1.2 : 1), sh.a, sh.b, col, NONE, { kind: 'cover', sway: [-0.7, 1, yaw0 / TAU] }, UP, sh.loc);
        }
      }
      yield;
    }
  }

  // ---- ivy along every vine ------------------------------------------------------------------------------
  *_ivy(world) {
    const r = this.rng;
    const S = this.low ? 1.25 : 1;
    for (const vn of world.foliage.vines || []) {
      const spacing = (vn.kind === 'column' ? 2.1 : 2.3) * S;
      const n = Math.round(vn.len / spacing);
      for (let k = 0; k < n; k++) {
        const u = (k + r.float()) / n;
        const c = vn.curve.getPointAt(Math.min(1, u));
        const tg = vn.curve.getTangentAt(Math.min(1, u));
        let P, D, F;
        const Lw = r.range(4.2, 6.4) * S;
        if (vn.around) {
          const [ax, az] = vn.around;
          const R = V(c.x - ax, 0, c.z - az).normalize();
          P = V(ax, c.y, az).addScaledVector(R, shaftR(c.y) + 0.4 + r.range(0, 0.3));
          const side = new THREE.Vector3().crossVectors(UP, R);
          D = R.clone().multiplyScalar(r.range(0.35, 0.8)).addScaledVector(UP, r.range(0.3, 0.9)).addScaledVector(side, r.range(-0.5, 0.5)).normalize();
          F = R.clone().addScaledVector(D, -D.dot(R)).normalize();
        } else {
          P = c.clone().add(V(r.range(-0.6, 0.6), r.range(-0.6, 0.6), r.range(-0.6, 0.6)));
          const az = r.range(0, TAU);
          const out = V(Math.cos(az), 0, Math.sin(az));
          D = out.clone().multiplyScalar(r.range(0.4, 0.9)).addScaledVector(UP, r.range(-0.8, 0.3)).addScaledVector(tg, r.range(-0.3, 0.3)).normalize();
          let Fv = out.clone().addScaledVector(D, -D.dot(out));
          if (Fv.lengthSq() < 0.01) Fv = UP.clone().addScaledVector(D, -D.y);
          F = Fv.normalize();
        }
        const sh = this._shape('ivy', r, (q) => [[q.range(0.72, 0.9), q.range(0.72, 0.98), q.range(0.15, 0.3), q.range(0.15, 0.4)], [q.range(0.08, 0.14), q.range(0.02, 0.06), q.range(-0.2, 0.2), q.range(0.22, 0.32)]]);
        const a = sh.a, b = sh.b;
        const col = new THREE.Color(IVY[Math.floor(r.float() * IVY.length)]).offsetHSL(r.range(-0.015, 0.015), r.range(-0.06, 0.06), r.range(-0.05, 0.05));
        const loc = sh.loc;
        const ex = { kind: 'ivy', ivy: true, swing: vn.swing(Math.min(1, u)), sway: [1, 1, (c.x * 0.013 + c.z * 0.011 + c.y * 0.007) % 1] };
        const ok = this._try(P, D, F, Lw, a, b, col, IVY_OWN, ex, loc)
          || this._try(P, D.clone().applyAxisAngle(tg, 1.2), F.clone().applyAxisAngle(tg, 1.2), Lw * 0.85, a, b, col, IVY_OWN, ex, loc);
        if (!ok) this.stats.dropped++;
      }
      yield;
    }
  }

  // ---- tiles ------------------------------------------------------------------------------------
  // the materials exist from the start, with a hidden one-leaf stand-in for
  // each, so their shaders compile with the rest at boot (no hitch at the swap)
  _materials() {
    const tex = enamelLeafTextures(this.low ? 256 : 512);
    const mk = (ivy) => {
      // (enamel() adds the near-lens fade, and the dissolve in when the planting is ready)
      const m = enamel(tex, { key: ivy ? 'nf-ivy' : 'nf-leaf', side: 1 });
      return swayMaterial(m, ivy ? 'ivy' : 'smallLeaf', { swing: ivy, leaf: true });
    };
    this.matLeaf = mk(false);
    this.matIvy = mk(true);
    this.coreMat = withDither(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, metalness: 0.2 }), 'nf-core', 1);
    const grids = { hi: leafGrid('hi'), lo: leafGrid('lo') };
    for (const g of Object.values(grids)) {
      g.boundingSphere = new THREE.Sphere(V(0, 0.42, 0), 1.2);
      g.boundingBox = new THREE.Box3(V(-1, -0.3, -0.7), V(1, 1.05, 0.7));
    }
    this.grids = grids;
    this.standIns = [false, true].map((ivy) => {
      const g = new THREE.BufferGeometry();
      for (const name of ['position', 'normal', 'uv', 'aSwayP', 'aSwayW']) g.setAttribute(name, grids.hi.attributes[name]);
      g.setIndex(grids.hi.index);
      g.setAttribute('aLeaf', new THREE.InstancedBufferAttribute(new Float32Array([0.4, 0.5, 0.3, 0.3]), 4));
      g.setAttribute('aLeaf2', new THREE.InstancedBufferAttribute(new Float32Array([0.1, 0, 0, 0.1]), 4));
      g.setAttribute('aLeaf3', new THREE.InstancedBufferAttribute(new Float32Array([1, 1, 0, 1]), 4));
      if (ivy) g.setAttribute('aSwing', new THREE.InstancedBufferAttribute(new Float32Array([0]), 1));
      const m = new THREE.InstancedMesh(g, ivy ? this.matIvy : this.matLeaf, 1);
      m.setMatrixAt(0, new THREE.Matrix4().makeTranslation(0, -60, 0));
      m.setColorAt(0, new THREE.Color('#000000'));
      m.frustumCulled = false;
      m.castShadow = !ivy;
      m.customDepthMaterial = swayDepth(ivy ? 'ivy' : 'smallLeaf', ivy, true);
      this.group.add(m);
      return m;
    });
    // and one for the masses' dark cores
    const cm = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), this.coreMat, 1);
    cm.setMatrixAt(0, new THREE.Matrix4().makeTranslation(0, -60, 0));
    cm.setColorAt(0, new THREE.Color('#000000'));
    cm.frustumCulled = false;
    this.group.add(cm);
    this.standIns.push(cm);
  }

  // (a tile at a time, so finishing the planting never stalls a frame; the
  // tiles join the scene together at the end)
  *_build(quality) {
    const grids = this.grids;
    const tiles = new Map();
    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];
      const k = (l.ivy ? 'i' : 'p') + Math.floor(l.m[12] / TILE) + ',' + Math.floor(l.m[14] / TILE);
      if (!tiles.has(k)) tiles.set(k, { ivy: l.ivy, list: [] });
      tiles.get(k).list.push(l);
      if (i % 4000 === 3999) yield;
    }
    yield;
    this.tiles = [];
    const col = new THREE.Color();
    for (const t of tiles.values()) {
      const n = t.list.length;
      const A = new Float32Array(n * 4), B = new Float32Array(n * 4), C = new Float32Array(n * 4), SW = new Float32Array(n);
      const mesh = new THREE.InstancedMesh(grids.lo, t.ivy ? this.matIvy : this.matLeaf, n);
      const c = V();
      t.list.forEach((l, i) => {
        mesh.instanceMatrix.array.set(l.m, i * 16);
        A.set(l.a, i * 4); B.set(l.b, i * 4); C.set(l.s3, i * 4); SW[i] = l.swing;
        mesh.setColorAt(i, col.copy(l.col));
        c.x += l.m[12]; c.y += l.m[13]; c.z += l.m[14];
      });
      c.multiplyScalar(1 / n);
      let rad = 0;
      for (const l of t.list) rad = Math.max(rad, Math.hypot(l.m[12] - c.x, l.m[13] - c.y, l.m[14] - c.z) + Math.hypot(l.m[4], l.m[5], l.m[6]) * 1.15);
      const geo = {};
      for (const lv of ['hi', 'lo']) {
        const g = new THREE.BufferGeometry();
        for (const name of ['position', 'normal', 'uv', 'aSwayP', 'aSwayW']) g.setAttribute(name, grids[lv].attributes[name]);
        g.setIndex(grids[lv].index);
        g.setAttribute('aLeaf', new THREE.InstancedBufferAttribute(A, 4));
        g.setAttribute('aLeaf2', new THREE.InstancedBufferAttribute(B, 4));
        g.setAttribute('aLeaf3', new THREE.InstancedBufferAttribute(C, 4));
        if (t.ivy) g.setAttribute('aSwing', new THREE.InstancedBufferAttribute(SW, 1));
        g.boundingSphere = grids[lv].boundingSphere;
        g.boundingBox = grids[lv].boundingBox;
        geo[lv] = g;
      }
      // share the instanced attributes between the two grids
      geo.lo.attributes.aLeaf = geo.hi.attributes.aLeaf;
      geo.lo.attributes.aLeaf2 = geo.hi.attributes.aLeaf2;
      geo.lo.attributes.aLeaf3 = geo.hi.attributes.aLeaf3;
      if (t.ivy) geo.lo.attributes.aSwing = geo.hi.attributes.aSwing;
      mesh.geometry = geo.lo;
      mesh.boundingSphere = new THREE.Sphere(c.clone(), rad + 2);
      mesh.castShadow = !t.ivy;
      mesh.receiveShadow = true;
      mesh.customDepthMaterial = swayDepth(t.ivy ? 'ivy' : 'smallLeaf', t.ivy, true);
      mesh.instanceMatrix.needsUpdate = true;
      this.tiles.push({ mesh, geo, c, rad, lod: 'lo' });
      yield;
    }
    // re-planted ferns
    const fm = this.fernSource;
    this.fernMesh = new THREE.InstancedMesh(fm.geometry, fm.material, Math.max(1, this.fronds.length));
    this.fronds.forEach((m, i) => this.fernMesh.setMatrixAt(i, m));
    this.fernMesh.count = this.fronds.length;
    this.fernMesh.castShadow = true;
    this.fernMesh.receiveShadow = true;
    this.fernMesh.customDepthMaterial = fm.customDepthMaterial;
    this.fernMesh.userData.sway = fm.userData.sway;
    this.fernMesh.computeBoundingSphere();
    yield;
    // re-planted palm fronds
    if (this.palmSource) {
      const pm = this.palmSource;
      this.palmMesh = new THREE.InstancedMesh(pm.geometry, pm.material, Math.max(1, this.palmFronds.length));
      this.palmFronds.forEach((f, i) => { this.palmMesh.setMatrixAt(i, f.m); this.palmMesh.setColorAt(i, f.col); });
      this.palmMesh.count = this.palmFronds.length;
      this.palmMesh.castShadow = true;
      this.palmMesh.receiveShadow = true;
      this.palmMesh.customDepthMaterial = pm.customDepthMaterial;
      this.palmMesh.userData.sway = pm.userData.sway;
      this.palmMesh.computeBoundingSphere();
    }
    yield;
    // everything joins the scene in the same step, as before
    for (const m of this.standIns) this.group.remove(m);
    for (const t of this.tiles) this.group.add(t.mesh);
    this.group.add(this.fernMesh);
    if (this.palmMesh) this.group.add(this.palmMesh);
  }

  // the explore materials (dithered) once the look upgrade exists
  setFernMaterial(m) { this.fernMesh.material = m; }
  setPalmMaterial(m) { if (this.palmMesh) this.palmMesh.material = m; }

  // per frame: the fine grid near the camera, the coarse one further out
  update(camera) {
    if (!this.ready) return;
    const cp = camera.position;
    for (const t of this.tiles) {
      const d = cp.distanceTo(t.c) - t.rad;
      const want = d < this.lod0 - (t.lod === 'hi' ? -8 : 8) ? 'hi' : 'lo';
      if (want !== t.lod) { t.lod = want; t.mesh.geometry = t.geo[want]; }
    }
  }

  // does a leaf (at rest) cross the line from a to b? The ends are left out
  // (within skipA of a: the camera pushes leaves aside; within skipB of b:
  // the subject's own stem leaves). For cutaway framing (cameras.js).
  sightBlocked(a, b, skipA = 3, skipB = 2) {
    if (!this.ready) return false;
    const d = V().subVectors(b, a);
    const L = d.length();
    if (L <= skipA + skipB) return false;
    d.multiplyScalar(1 / L);
    const p0 = a.clone().addScaledVector(d, skipA), len = L - skipA - skipB;
    const p1 = p0.clone().addScaledVector(d, len);
    const box = [Math.min(p0.x, p1.x), Math.min(p0.y, p1.y), Math.min(p0.z, p1.z), Math.max(p0.x, p1.x), Math.max(p0.y, p1.y), Math.max(p0.z, p1.z)];
    const st = ++this.hash.stamp;
    const e1 = V(), e2 = V(), h = V(), sv = V(), q = V(), A = V(), B = V(), C = V();
    let hit = false;
    this.hash._cells(box, (k) => {
      if (hit) return;
      for (const o of this.hash.map.get(k) || []) {
        if (o.stamp === st) continue;
        o.stamp = st;
        // the segment against the part's box (slabs), then its triangles
        const bx = o.box;
        let t0 = 0, t1 = len, out = false;
        for (let c = 0; c < 3 && !out; c++) {
          const o0 = p0.getComponent(c), dc = d.getComponent(c);
          if (Math.abs(dc) < 1e-9) { if (o0 < bx[c] || o0 > bx[c + 3]) out = true; continue; }
          let ta = (bx[c] - o0) / dc, tb = (bx[c + 3] - o0) / dc;
          if (ta > tb) { const t = ta; ta = tb; tb = t; }
          t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
          if (t0 > t1) out = true;
        }
        if (out || !o.P || !o.T) continue;
        const P = o.P, T = o.T;
        for (let i = 0; i < T.length; i += 3) {
          A.fromArray(P, T[i] * 3); B.fromArray(P, T[i + 1] * 3); C.fromArray(P, T[i + 2] * 3);
          e1.subVectors(B, A); e2.subVectors(C, A);
          h.crossVectors(d, e2);
          const det = e1.dot(h);
          if (Math.abs(det) < 1e-9) continue;
          const f = 1 / det;
          sv.subVectors(p0, A);
          const u = f * sv.dot(h);
          if (u < 0 || u > 1) continue;
          q.crossVectors(sv, e1);
          const v = f * d.dot(q);
          if (v < 0 || u + v > 1) continue;
          const t = f * e2.dot(q);
          if (t >= 0 && t <= len) { hit = true; return; }
        }
      }
    });
    return hit;
  }

  // every leaf and frond as world triangles (tools/overlapcheck.mjs)
  forEachPart(cb) {
    const m = new THREE.Matrix4();
    for (const l of this.leaves) {
      m.fromArray(l.m);
      const { P, tris } = leafTriangles(l.a, l.b, m, 'hi');
      const T = new Int32Array(tris.length * 3), S = new Float32Array(tris.length);
      tris.forEach((t, i) => { T[i * 3] = t[0]; T[i * 3 + 1] = t[1]; T[i * 3 + 2] = t[2]; S[i] = t[3]; });
      cb({ cat: 'leaf', kind: l.kind, P: new Float32Array(P), T, S, pivot: [l.m[12], l.m[13], l.m[14]], src: -l.id });
    }
    if (this.palmSource) {
      const { lp, LT, LS } = this._frondLocal(this.palmSource.geometry, 30);
      for (const f of this.palmFronds) {
        const P = new Float32Array(lp.length), el = f.m.elements;
        for (let i = 0; i < lp.length; i += 3) { const x = lp[i], y = lp[i + 1], z = lp[i + 2]; P[i] = el[0] * x + el[4] * y + el[8] * z + el[12]; P[i + 1] = el[1] * x + el[5] * y + el[9] * z + el[13]; P[i + 2] = el[2] * x + el[6] * y + el[10] * z + el[14]; }
        cb({ cat: 'frond', kind: 'palm', P, T: new Int32Array(LT), S: LS, pivot: [el[12], el[13], el[14]], src: -2e6 });
      }
    }
    const g = this.fernSource.geometry, pos = g.attributes.position, W = g.attributes.aSwayW;
    const v = V();
    this.fronds.forEach((fm, k) => {
      const P = [], T = [], S = [];
      for (let i = 0; i < pos.count; i += 3) {
        // front faces only (the back face has a negative flutter weight)
        let back = false;
        for (let j = 0; j < 3; j++) { const y = W.getY(i + j); if (y < 0 || Object.is(y, -0)) back = true; }
        if (back) continue;
        for (let j = 0; j < 3; j++) { v.fromBufferAttribute(pos, i + j).applyMatrix4(fm); P.push(v.x, v.y, v.z); }
        const b = P.length / 3 - 3;
        T.push(b, b + 1, b + 2);
        S.push(Math.min(1, Math.hypot(pos.getX(i), pos.getY(i), pos.getZ(i)) / 17));
      }
      cb({ cat: 'frond', kind: 'fern', P: new Float32Array(P), T: new Int32Array(T), S: new Float32Array(S), pivot: [fm.elements[12], fm.elements[13], fm.elements[14]], src: -1e6 - k });
    });
  }
}
