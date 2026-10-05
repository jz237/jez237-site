import * as THREE from 'three';
import { groundHeight, HOUSE } from './bounds.js';

// Low routes for APX-9's autopilot: through the beds, between the stems, not
// over the canopy. A grid over the house floor marks, for three layers above
// the soil (6–14: low over the path and the gaps; 15–24: over the low
// shrubs, among the stems under most flower heads; 25–34: over the tall
// shrubs), where a bee can pass: every collider reaching into a layer
// (stems, bushes, ferns, palms, pots, lamps, columns, the hero props) blocks
// the cells within a bee's clearance of it; the leaves are not solids (the
// wing-wash parts them). Each cell keeps its lowest open layer. A* across the
// open cells prefers low layers and open lanes over squeezing past stems;
// the path is straightened where the way is clear, its height follows the
// layers (kept high enough near a shrub, then eased) with a gentle rise and
// fall. Built once, a few milliseconds a slice (step()).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const CELL = 3;
const LAYERS = [[6, 14], [15, 24], [25, 34]];
const MARGIN = 2.6; // a bee's clearance from a solid
const SQ2 = Math.SQRT2;

export class LowRoutes {
  constructor(bounds) {
    this.bounds = bounds;
    this.x0 = HOUSE.xMinLow + 6;
    this.z0 = HOUSE.zMin + 6;
    this.nx = Math.floor((HOUSE.xMaxLow - 6 - this.x0) / CELL) + 1;
    this.nz = Math.floor((HOUSE.zMax - 6 - this.z0) / CELL) + 1;
    const n = this.nx * this.nz;
    this.ground = new Float32Array(n);
    this.blocked = new Uint8Array(n); // no layer open
    this.layer = new Int8Array(n); // the lowest open layer
    this._blk = LAYERS.map(() => new Uint8Array(n));
    this.clear = new Uint8Array(n); // cells to the nearest blocked cell (capped)
    this.ready = false;
    this._gen = this._build();
  }

  idx(i, j) { return j * this.nx + i; }
  cx(i) { return this.x0 + i * CELL; }
  cz(j) { return this.z0 + j * CELL; }
  cell(p) { return [Math.round((p.x - this.x0) / CELL), Math.round((p.z - this.z0) / CELL)]; }

  step(ms = 3) {
    if (this.ready) return true;
    const t0 = performance.now();
    while (performance.now() - t0 < ms) if (this._gen.next().done) { this.ready = true; break; }
    return this.ready;
  }

  *_build() {
    const { nx, nz } = this;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) this.ground[this.idx(i, j)] = groundHeight(this.cx(i), this.cz(j));
    yield;
    const p = V(), nrm = V();
    let k = 0;
    for (const c of this.bounds.colliders) {
      let y0, y1;
      if (c.type === 'cap') { y0 = Math.min(c.a.y, c.b.y) - c.r; y1 = Math.max(c.a.y, c.b.y) + c.r; }
      else if (c.type === 'sph') { y0 = c.c.y - c.r; y1 = c.c.y + c.r; }
      else if (c.type === 'ell') { y0 = c.c.y - c.ry; y1 = c.c.y + c.ry; }
      else { y0 = c.y0; y1 = c.y1; }
      const [bx0, bx1, bz0, bz1] = c.box;
      const i0 = Math.max(0, Math.floor((bx0 - MARGIN - this.x0) / CELL)), i1 = Math.min(nx - 1, Math.ceil((bx1 + MARGIN - this.x0) / CELL));
      const j0 = Math.max(0, Math.floor((bz0 - MARGIN - this.z0) / CELL)), j1 = Math.min(nz - 1, Math.ceil((bz1 + MARGIN - this.z0) / CELL));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const id = this.idx(i, j);
        const g = this.ground[id];
        for (let L = 0; L < LAYERS.length; L++) {
          const blk = this._blk[L];
          if (blk[id]) continue;
          const [lo, hi] = LAYERS[L];
          if (y1 < g + lo - MARGIN || y0 > g + hi + MARGIN) continue;
          for (const h of [lo, (lo + hi) / 2, hi]) {
            p.set(this.cx(i), g + h, this.cz(j));
            if (this.bounds._sdf(c, p, nrm) < MARGIN) { blk[id] = 1; break; }
          }
        }
      }
      if (++k % 150 === 0) yield;
    }
    // the plinths and walls; each cell's lowest open layer
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const id = this.idx(i, j);
      p.set(this.cx(i), this.ground[id] + LAYERS[0][0], this.cz(j));
      const wall = this.bounds._wallDist(p, nrm) < MARGIN + 3;
      let L = 0;
      while (L < LAYERS.length && this._blk[L][id]) L++;
      this.layer[id] = wall || L === LAYERS.length ? -1 : L;
      this.blocked[id] = this.layer[id] < 0 ? 1 : 0;
    }
    this._blk = null;
    yield;
    // clearance: a breadth-first spread from the blocked cells (capped at 6)
    const q = [];
    for (let id = 0; id < nx * nz; id++) { if (this.blocked[id]) { this.clear[id] = 0; q.push(id); } else this.clear[id] = 6; }
    for (let h = 0; h < q.length; h++) {
      const id = q[h], i = id % nx, j = (id / nx) | 0, d = this.clear[id] + 1;
      if (d > 6) continue;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const a = i + di, b = j + dj;
        if (a < 0 || b < 0 || a >= nx || b >= nz) continue;
        const nid = this.idx(a, b);
        if (this.clear[nid] > d) { this.clear[nid] = d; q.push(nid); }
      }
    }
  }

  // the nearest free cell to p (within a few cells), or null
  _free(p) {
    const [ci, cj] = this.cell(p);
    let best = null, bd = Infinity;
    for (let r = 0; r <= 5 && !best; r++) {
      for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
        if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) continue;
        const id = this.idx(i, j);
        if (this.blocked[id] || this.clear[id] < 2) continue;
        const d = (i - ci) ** 2 + (j - cj) ** 2;
        if (d < bd) { bd = d; best = [i, j]; }
      }
    }
    return best;
  }

  // a weaving route from `from` to `to` (both in the house): an array of points
  // at bed height (the last one under `to`), or null if there is no good one
  find(from, to, { phase = 0 } = {}) {
    if (!this.ready) return null;
    const a = this._free(from), b = this._free(to);
    if (!a || !b) { this.why = 'no free cell'; return null; }
    const { nx, nz } = this;
    const start = this.idx(a[0], a[1]), goal = this.idx(b[0], b[1]);
    const g = new Float32Array(nx * nz).fill(Infinity);
    const came = new Int32Array(nx * nz).fill(-1);
    const heap = new Heap();
    const hfn = (id) => Math.hypot((id % nx) - b[0], ((id / nx) | 0) - b[1]);
    g[start] = 0;
    heap.push(start, hfn(start));
    let found = false, expanded = 0;
    while (heap.size && expanded < 60000) {
      const id = heap.pop();
      if (id === goal) { found = true; break; }
      expanded++;
      const i = id % nx, j = (id / nx) | 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const x = i + di, y = j + dj;
        if (x < 0 || y < 0 || x >= nx || y >= nz) continue;
        const nid = this.idx(x, y);
        if (this.blocked[nid]) continue;
        // no cutting corners past a blocked cell
        if (di && dj && (this.blocked[this.idx(i + di, j)] || this.blocked[this.idx(i, j + dj)])) continue;
        // open lanes are cheaper than squeezing past stems, low layers than high
        // ones, and staying at one height than climbing between layers
        const cost = (di && dj ? SQ2 : 1) * (1 + 2.2 / (this.clear[nid] + 0.5) + 0.3 * this.layer[nid]) + 0.6 * Math.abs(this.layer[nid] - this.layer[id]);
        const ng = g[id] + cost;
        // (weighted toward the goal: a little greedy, far fewer cells searched)
        if (ng < g[nid]) { g[nid] = ng; came[nid] = id; heap.push(nid, ng + hfn(nid) * 1.8); }
      }
    }
    if (!found) { this.why = expanded >= 60000 ? 'search limit' : 'no path'; return null; }
    const cells = [];
    for (let id = goal; id !== -1; id = came[id]) cells.push(id);
    cells.reverse();
    // a detour much longer than the straight line isn't worth it
    const straight = Math.hypot(to.x - from.x, to.z - from.z);
    if (cells.length * CELL > straight * 2.2 + 40) { this.why = 'detour'; return null; }
    // straighten where the way is clear
    const keep = [cells[0]];
    let k = 0;
    while (k < cells.length - 1) {
      let far = k + 1;
      for (let m = Math.min(cells.length - 1, k + 40); m > k + 1; m--) if (this._lane(cells[k], cells[m])) { far = m; break; }
      keep.push(cells[far]);
      k = far;
    }
    // points every ~6 units, each at the height of its cell's layer
    const pts = [];
    const P = (id) => V(this.cx(id % nx), 0, this.cz((id / nx) | 0));
    const layerAt = (p) => { const [i, j] = this.cell(p); const id = this.idx(Math.min(nx - 1, Math.max(0, i)), Math.min(nz - 1, Math.max(0, j))); return Math.max(0, this.layer[id]); };
    for (let s = 0; s < keep.length - 1; s++) {
      const p0 = P(keep[s]), p1 = P(keep[s + 1]);
      const L = p0.distanceTo(p1), n = Math.max(1, Math.round(L / 6));
      for (let u = s === 0 ? 1 : 0; u < n; u++) pts.push(p0.clone().lerp(p1, u / n));
    }
    pts.push(P(keep[keep.length - 1]));
    // heights: the layer's middle, held at the higher one for a point either
    // side of a change (so it clears the shrub it is coming off), then eased,
    // with a gentle rise and fall
    const raw = pts.map((p) => { const [lo, hi] = LAYERS[layerAt(p)]; return groundHeight(p.x, p.z) + (lo + hi) / 2; });
    const held = raw.map((_, i) => Math.max(...raw.slice(Math.max(0, i - 1), i + 2)));
    let dist = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = held[Math.max(0, i - 1)], b = held[i], c = held[Math.min(pts.length - 1, i + 1)];
      if (i) dist += pts[i].distanceTo(pts[i - 1]);
      pts[i].y = (a + 2 * b + c) / 4 + Math.sin(dist / 23 + phase) * 2;
    }
    return pts;
  }

  // a straight lane between two cells with room either side
  _lane(a, b) {
    const nx = this.nx;
    const ai = a % nx, aj = (a / nx) | 0, bi = b % nx, bj = (b / nx) | 0;
    const n = Math.ceil(Math.hypot(bi - ai, bj - aj) * 2);
    for (let s = 1; s < n; s++) {
      const i = Math.round(ai + ((bi - ai) * s) / n), j = Math.round(aj + ((bj - aj) * s) / n);
      if (this.clear[this.idx(i, j)] < 2) return false;
    }
    return true;
  }
}

// a binary min-heap of cell ids keyed by priority
class Heap {
  constructor() { this.ids = []; this.ks = []; }
  get size() { return this.ids.length; }
  push(id, k) {
    const I = this.ids, K = this.ks;
    let n = I.length;
    I.push(id); K.push(k);
    while (n > 0) { const p = (n - 1) >> 1; if (K[p] <= k) break; I[n] = I[p]; K[n] = K[p]; n = p; }
    I[n] = id; K[n] = k;
  }
  pop() {
    const I = this.ids, K = this.ks;
    const top = I[0], id = I.pop(), k = K.pop();
    const n = I.length;
    if (n) {
      let i = 0;
      for (;;) {
        let c = 2 * i + 1;
        if (c >= n) break;
        if (c + 1 < n && K[c + 1] < K[c]) c++;
        if (K[c] >= k) break;
        I[i] = I[c]; K[i] = K[c]; i = c;
      }
      I[i] = id; K[i] = k;
    }
    return top;
  }
}
