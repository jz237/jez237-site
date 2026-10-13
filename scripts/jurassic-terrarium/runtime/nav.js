// Walkability grid over the terrarium floor and A* routes across it.
//
// Each cell stores a cost (Infinity = blocked). Steep rock, open water, tree trunks, the hut and
// the glass walls block; gentle slopes and the lake shallows cost more than open meadow. Routes
// are string-pulled (line-of-sight shortcuts) so animals walk smooth diagonals, not grid steps.

// Where the stream is forded: two shallow runs between the cascades (about shin deep), and wherever the
// footpath crosses water or the steep stream banks (the stepping stones). The footpath is kept clear of
// trees, so it is the guaranteed corridor between the two halves of the case.
let fordCache = null;
export function fords(T) {
  if (fordCache) return fordCache;
  const list = [{ x: -0.68, z: -0.42, r: 0.32 }, { x: 0.02, z: 0.3, r: 0.32 }];
  for (const line of window.__jtPathLines || [])
    for (let i = 0; i < line.length - 1; i++) {
      const [ax, az] = line[i], [bx, bz] = line[i + 1], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.08));
      for (let k = 0; k <= n; k++) {
        const x = ax + ((bx - ax) * k) / n, z = az + ((bz - az) * k) / n;
        if (Math.max(T.lakeMask(x, z), T.riverMask(x, z)) < 0.05 && T.slope(x, z) < 0.28) continue;
        if (list.some((f) => Math.hypot(f.x - x, f.z - z) < 0.12)) continue;
        list.push({ x, z, r: 0.3, trail: true });
      }
    }
  return (fordCache = list);
}
const inFord = (list, x, z) => list.some((f) => Math.hypot(x - f.x, z - f.z) < f.r);

export class NavGrid {
  constructor(ctx, { cell = 0.1, margin = 0.35, obstacles = [], rects = [], trunks = [], fords = [] } = {}) {
    this.trunks = trunks;
    this.fords = fords;
    this.inFord = new Uint8Array(0);
    const box = ctx.box;
    this.ctx = ctx;
    this.cell = cell;
    this.minX = -box.halfW + margin;
    this.minZ = -box.halfD + margin;
    this.nx = Math.floor((2 * (box.halfW - margin)) / cell);
    this.nz = Math.floor((2 * (box.halfD - margin)) / cell);
    this.base = new Float32Array(this.nx * this.nz);
    this.height = new Float32Array(this.nx * this.nz);
    this.slope = new Float32Array(this.nx * this.nz);
    this.water = new Float32Array(this.nx * this.nz);
    this.lake = new Float32Array(this.nx * this.nz);
    const T = ctx.terrain;
    const S = T.shape;
    const trees = ctx.modules.vegetation?.trees || [];
    const cabin = S.CABIN;
    for (let j = 0; j < this.nz; j++) {
      for (let i = 0; i < this.nx; i++) {
        const x = this.minX + (i + 0.5) * cell;
        const z = this.minZ + (j + 0.5) * cell;
        const k = j * this.nx + i;
        const h = T.height(x, z);
        const s = T.slope(x, z);
        this.height[k] = h;
        this.slope[k] = s;
        const lake = T.lakeMask(x, z), river = T.riverMask(x, z);
        const wet = Math.max(lake, river);
        this.water[k] = wet;
        this.lake[k] = lake;
        let c = 1 + s * 6;
        if (s > 0.85) c = Infinity; // cliffs and peaks
        if (wet > 0.5) c += 6; // wading is slow; the deep lake is banned per species (below)
        // the stream is crossed only at its fords, never walked along: wading down the channel and over the
        // cascades buried the legs in the falls
        if (river > 0.45 && lake < 0.2 && !inFord(fords, x, z)) c = Infinity;
        if (cabin && Math.hypot(x - cabin.x, z - cabin.z) < (cabin.padRadius || 0.75) + 0.1) c = Infinity;
        this.base[k] = c;
      }
    }
    // rectangles: rock masses block, hollows inside them open up again (applied in order)
    for (const r of rects) {
      for (let j = 0; j < this.nz; j++)
        for (let i = 0; i < this.nx; i++) {
          const x = this.minX + (i + 0.5) * cell, z = this.minZ + (j + 0.5) * cell;
          if (x < r.x0 || x > r.x1 || z < r.z0 || z > r.z1) continue;
          const k = j * this.nx + i;
          this.base[k] = r.block ? Infinity : 1;
          if (!r.block) this.slope[k] = Math.min(this.slope[k], 0.1);
        }
    }
    // planted trunks (tree ferns, cycads)
    for (const o of obstacles) this._stamp(o.x, o.z, o.r, Infinity);
    // trees: block only the trunk, add cost under the crown; shrubs are pushed through
    for (const t of trees) {
      if (t.kind === 'bush' || t.height < 0.45) {
        this._stamp(t.x, t.z, t.radius * 0.8, 2);
        continue;
      }
      this._stamp(t.x, t.z, 0.05, Infinity);
      this._stamp(t.x, t.z, t.radius * 0.9, 4);
    }
  }

  _stamp(x, z, r, add) {
    const c = this.cell;
    const i0 = Math.max(0, Math.floor((x - r - this.minX) / c));
    const i1 = Math.min(this.nx - 1, Math.floor((x + r - this.minX) / c));
    const j0 = Math.max(0, Math.floor((z - r - this.minZ) / c));
    const j1 = Math.min(this.nz - 1, Math.floor((z + r - this.minZ) / c));
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const cx = this.minX + (i + 0.5) * c;
        const cz = this.minZ + (j + 0.5) * c;
        if (Math.hypot(cx - x, cz - z) <= r) this.base[j * this.nx + i] += add;
      }
  }

  // A per-species view: bigger animals need clearance from blocked cells; deep water may be banned.
  // blockRects: extra no-go rectangles for this species only (the den is open to its owner alone)
  // bodyR: half the body's width; every trunk is kept that far off its bark, so dense groves are closed
  layer({ clearance = 0.1, maxWater = 0.85, maxSlope = 0.7, blockRects = [], bodyR = 0.1 } = {}) {
    const n = this.nx * this.nz;
    const cost = new Float32Array(n);
    const rad = Math.ceil(clearance / this.cell);
    if (this.inFord.length !== n) {
      this.inFord = new Uint8Array(n);
      for (let k = 0; k < n; k++)
        this.inFord[k] = inFord(this.fords, this.minX + ((k % this.nx) + 0.5) * this.cell, this.minZ + (Math.floor(k / this.nx) + 0.5) * this.cell) ? 1 : 0;
    }
    for (let k = 0; k < n; k++) {
      let c = this.base[k];
      // at a ford the shallows and the stepped banks are allowed (the animal picks its way across)
      if (!this.inFord[k] && (this.lake[k] > maxWater || this.slope[k] > maxSlope)) c = Infinity;
      cost[k] = c;
    }
    for (const r of blockRects)
      for (let j = 0; j < this.nz; j++)
        for (let i = 0; i < this.nx; i++) {
          const x = this.minX + (i + 0.5) * this.cell, z = this.minZ + (j + 0.5) * this.cell;
          if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) cost[j * this.nx + i] = Infinity;
        }
    const trunk = (arr) => {
      // a little more than the body guard needs, so a planned route never brushes a trunk
      for (const t of this.trunks) this._stampInto(arr, t.x, t.z, t.r + bodyR + (t.kind === 'stand' ? 0 : 0.04));
      return arr;
    };
    if (rad <= 0) return new NavLayer(this, trunk(cost));
    const out = new Float32Array(cost);
    for (let j = 0; j < this.nz; j++)
      for (let i = 0; i < this.nx; i++) {
        if (cost[j * this.nx + i] !== Infinity) continue;
        for (let dj = -rad; dj <= rad; dj++)
          for (let di = -rad; di <= rad; di++) {
            if (di * di + dj * dj > rad * rad) continue;
            const ii = i + di, jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= this.nx || jj >= this.nz) continue;
            if (!this.inFord[jj * this.nx + ii]) out[jj * this.nx + ii] = Infinity; // a ford's crossing stays open
          }
      }
    return new NavLayer(this, trunk(out));
  }

  _stampInto(arr, x, z, r) {
    const c = this.cell;
    const i0 = Math.max(0, Math.floor((x - r - this.minX) / c)), i1 = Math.min(this.nx - 1, Math.floor((x + r - this.minX) / c));
    const j0 = Math.max(0, Math.floor((z - r - this.minZ) / c)), j1 = Math.min(this.nz - 1, Math.floor((z + r - this.minZ) / c));
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++)
        if (Math.hypot(this.minX + (i + 0.5) * c - x, this.minZ + (j + 0.5) * c - z) <= r) arr[j * this.nx + i] = Infinity;
  }
}

class NavLayer {
  constructor(grid, cost) {
    this.g = grid;
    this.cost = cost;
    // the biggest connected region: spawns and wander targets come from it, so nobody is stranded
    const g = grid, n = cost.length, comp = new Int32Array(n).fill(-1);
    let best = -1, bestSize = 0, id = 0;
    for (let k0 = 0; k0 < n; k0++) {
      if (cost[k0] === Infinity || comp[k0] >= 0) continue;
      let size = 0;
      const st = [k0];
      comp[k0] = id;
      while (st.length) {
        const k = st.pop();
        size++;
        const i = k % g.nx, j = (k / g.nx) | 0;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ii = i + di, jj = j + dj;
          if (ii < 0 || jj < 0 || ii >= g.nx || jj >= g.nz) continue;
          const kk = jj * g.nx + ii;
          if (comp[kk] < 0 && cost[kk] < Infinity) {
            comp[kk] = id;
            st.push(kk);
          }
        }
      }
      if (size > bestSize) (bestSize = size), (best = id);
      id++;
    }
    this.comp = comp;
    this.main = best;
    this.open = [];
    for (let k = 0; k < n; k++) if (comp[k] === best) this.open.push(k);
  }
  cellOf(x, z) {
    const g = this.g;
    const i = Math.max(0, Math.min(g.nx - 1, Math.floor((x - g.minX) / g.cell)));
    const j = Math.max(0, Math.min(g.nz - 1, Math.floor((z - g.minZ) / g.cell)));
    return j * g.nx + i;
  }
  centre(k) {
    const g = this.g;
    return { x: g.minX + ((k % g.nx) + 0.5) * g.cell, z: g.minZ + (Math.floor(k / g.nx) + 0.5) * g.cell };
  }
  walkable(x, z) {
    return this.cost[this.cellOf(x, z)] < Infinity;
  }
  randomOpen(rand = Math.random, pred = null) {
    for (let tries = 0; tries < 200; tries++) {
      const k = this.open[Math.floor(rand() * this.open.length)];
      const c = this.centre(k);
      if (!pred || pred(c.x, c.z, k)) return c;
    }
    return this.centre(this.open[Math.floor(rand() * this.open.length)]);
  }
  nearestOpen(x, z) {
    let k = this.cellOf(x, z);
    if (this.cost[k] < Infinity) return this.centre(k);
    let best = null, bd = Infinity;
    for (const o of this.open) {
      const c = this.centre(o);
      const d = (c.x - x) ** 2 + (c.z - z) ** 2;
      if (d < bd) (bd = d), (best = c);
    }
    return best;
  }
  lineClear(ax, az, bx, bz) {
    const d = Math.hypot(bx - ax, bz - az);
    const n = Math.ceil(d / (this.g.cell * 0.5));
    for (let s = 1; s < n; s++) {
      const t = s / n;
      if (!(this.cost[this.cellOf(ax + (bx - ax) * t, az + (bz - az) * t)] < 4)) return false;
    }
    return true;
  }
  // A* with an octile heuristic; returns [{x,z}...] or null.
  path(ax, az, bx, bz, maxIter = 40000) {
    const g = this.g, nx = g.nx, nz = g.nz;
    // an animal standing in a blocked cell (pushed into a grove, or spawned there) starts from the
    // nearest open one; an unreachable goal snaps to the nearest open cell too
    let s = this.cellOf(ax, az), t = this.cellOf(bx, bz);
    if (this.cost[s] === Infinity) {
      const c = this.nearestOpen(ax, az);
      if (!c) return null;
      s = this.cellOf(c.x, c.z);
    }
    if (this.cost[t] === Infinity) {
      const c = this.nearestOpen(bx, bz);
      if (!c) return null;
      t = this.cellOf(c.x, c.z);
      (bx = c.x), (bz = c.z);
    }
    const n = nx * nz;
    const gs = new Float32Array(n).fill(Infinity);
    const from = new Int32Array(n).fill(-1);
    const closed = new Uint8Array(n);
    const heap = new MinHeap();
    const tx = t % nx, tz = Math.floor(t / nx);
    const h = (k) => {
      const dx = Math.abs((k % nx) - tx), dz = Math.abs(Math.floor(k / nx) - tz);
      return dx + dz + (Math.SQRT2 - 2) * Math.min(dx, dz);
    };
    gs[s] = 0;
    heap.push(s, h(s));
    let it = 0;
    while (heap.size && it++ < maxIter) {
      const k = heap.pop();
      if (k === t) break;
      if (closed[k]) continue;
      closed[k] = 1;
      const i = k % nx, j = Math.floor(k / nx);
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          if (!di && !dj) continue;
          const ii = i + di, jj = j + dj;
          if (ii < 0 || jj < 0 || ii >= nx || jj >= nz) continue;
          const kk = jj * nx + ii;
          const c = this.cost[kk];
          if (c === Infinity || closed[kk]) continue;
          if (di && dj && (this.cost[j * nx + ii] === Infinity || this.cost[jj * nx + i] === Infinity)) continue;
          const ng = gs[k] + c * (di && dj ? Math.SQRT2 : 1);
          if (ng < gs[kk]) {
            gs[kk] = ng;
            from[kk] = k;
            heap.push(kk, ng + h(kk));
          }
        }
    }
    if (from[t] < 0 && s !== t) return null;
    const cells = [];
    for (let k = t; k >= 0 && k !== s; k = from[k]) cells.push(k);
    cells.reverse();
    const pts = [{ x: ax, z: az }, ...cells.map((k) => this.centre(k))];
    pts[pts.length - 1] = { x: bx, z: bz };
    // string pulling
    const out = [pts[0]];
    let a = 0;
    while (a < pts.length - 1) {
      let b = pts.length - 1;
      while (b > a + 1 && !this.lineClear(pts[a].x, pts[a].z, pts[b].x, pts[b].z)) b--;
      out.push(pts[b]);
      a = b;
    }
    return out;
  }
}

class MinHeap {
  constructor() {
    this.k = [];
    this.p = [];
  }
  get size() {
    return this.k.length;
  }
  push(k, p) {
    const K = this.k, P = this.p;
    let i = K.length;
    K.push(k);
    P.push(p);
    while (i > 0) {
      const q = (i - 1) >> 1;
      if (P[q] <= p) break;
      K[i] = K[q];
      P[i] = P[q];
      i = q;
    }
    K[i] = k;
    P[i] = p;
  }
  pop() {
    const K = this.k, P = this.p;
    const top = K[0];
    const k = K.pop(), p = P.pop();
    if (K.length) {
      let i = 0;
      const n = K.length;
      for (;;) {
        let c = 2 * i + 1;
        if (c >= n) break;
        if (c + 1 < n && P[c + 1] < P[c]) c++;
        if (P[c] >= p) break;
        K[i] = K[c];
        P[i] = P[c];
        i = c;
      }
      K[i] = k;
      P[i] = p;
    }
    return top;
  }
}
