// Walkability grid over the terrarium floor and A* routes across it.
//
// Each cell stores a cost (Infinity = blocked). Steep rock, open water, tree trunks, the hut and
// the glass walls block; gentle slopes and the lake shallows cost more than open meadow. Routes
// are string-pulled (line-of-sight shortcuts) so animals walk smooth diagonals, not grid steps.

export class NavGrid {
  constructor(ctx, { cell = 0.1, margin = 0.35, obstacles = [] } = {}) {
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
        const wet = Math.max(T.lakeMask(x, z), T.riverMask(x, z));
        this.water[k] = wet;
        let c = 1 + s * 6;
        if (s > 0.85) c = Infinity; // cliffs and peaks
        if (wet > 0.5) c += 6; // wading is slow; deep water is cut below per species
        if (cabin && Math.hypot(x - cabin.x, z - cabin.z) < (cabin.padRadius || 0.75) + 0.1) c = Infinity;
        this.base[k] = c;
      }
    }
    // planted trunks (tree ferns, cycads)
    for (const o of obstacles) this._stamp(o.x, o.z, o.r + 0.04, Infinity);
    // trees: block the trunk, add cost under the crown
    for (const t of trees) {
      const r = Math.max(0.06, t.radius * 0.35);
      this._stamp(t.x, t.z, r + 0.05, Infinity);
      this._stamp(t.x, t.z, t.radius * 0.9, 5);
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
  layer({ clearance = 0.1, maxWater = 0.85, maxSlope = 0.7 } = {}) {
    const n = this.nx * this.nz;
    const cost = new Float32Array(n);
    const rad = Math.ceil(clearance / this.cell);
    for (let k = 0; k < n; k++) {
      let c = this.base[k];
      if (this.water[k] > maxWater || this.slope[k] > maxSlope) c = Infinity;
      cost[k] = c;
    }
    if (rad <= 0) return new NavLayer(this, cost);
    const out = new Float32Array(cost);
    for (let j = 0; j < this.nz; j++)
      for (let i = 0; i < this.nx; i++) {
        if (cost[j * this.nx + i] !== Infinity) continue;
        for (let dj = -rad; dj <= rad; dj++)
          for (let di = -rad; di <= rad; di++) {
            if (di * di + dj * dj > rad * rad) continue;
            const ii = i + di, jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= this.nx || jj >= this.nz) continue;
            out[jj * this.nx + ii] = Infinity;
          }
      }
    return new NavLayer(this, out);
  }
}

class NavLayer {
  constructor(grid, cost) {
    this.g = grid;
    this.cost = cost;
    this.open = [];
    for (let k = 0; k < cost.length; k++) if (cost[k] < Infinity) this.open.push(k);
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
    const s = this.cellOf(ax, az), t = this.cellOf(bx, bz);
    if (this.cost[t] === Infinity) return null;
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
