import {TANK} from './Case';
import {Surface, SurfaceKind} from './Surface';
import {WATER_LEVEL} from './Ground';

/** Deepest water the dragon will wade through (metres). */
export const WADE_DEPTH = 0.021;

/**
 * Walkability grid for the lizard: cost from slope, water depth, rock, planting
 * and clearance from obstacles; A* search with a binary heap and line-of-sight
 * smoothing. Only the largest connected region is offered as a destination, so
 * the lizard never sets off for somewhere it cannot reach.
 */
export class Nav {
  readonly cell = 0.01;
  readonly nx: number;
  readonly nz: number;
  readonly x0 = -TANK.w / 2 + 0.005;
  readonly z0 = -TANK.d / 2 + 0.005;
  readonly cost: Float32Array; // Infinity = blocked
  readonly wet: Uint8Array; // 1 = shallow water
  readonly region: Int32Array; // connected component id (-1 blocked)
  mainRegion = 0;

  constructor(readonly surface: Surface, obstacles: {x: number; z: number; r: number}[]) {
    this.nx = Math.floor((TANK.w - 0.01) / this.cell) + 1;
    this.nz = Math.floor((TANK.d - 0.01) / this.cell) + 1;
    const N = this.nx * this.nz;
    this.cost = new Float32Array(N);
    this.wet = new Uint8Array(N);
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + i * this.cell, z = this.z0 + j * this.cell;
      // keep the body (≈ 4 cm wide) clear of the glass
      const margin = Math.min(x + TANK.w / 2, TANK.w / 2 - x, z + TANK.d / 2, TANK.d / 2 - z);
      let c = 1;
      if (margin < 0.032) c = Infinity;
      const kind = surface.kindAt(x, z);
      const y = surface.heightAt(x, z);
      if (kind === SurfaceKind.Water) {
        // Bearded dragons wade readily in the shallows, but not out of their depth.
        const depth = WATER_LEVEL - y;
        if (depth > WADE_DEPTH) c = Infinity;
        else {c += 2.5 + depth * 120; this.wet[j * this.nx + i] = 1;}
      }
      // slope from the height grid around the cell
      const e = 0.012;
      const hx = surface.heightAt(x + e, z) - surface.heightAt(x - e, z);
      const hz = surface.heightAt(x, z + e) - surface.heightAt(x, z - e);
      const slope = Math.hypot(hx, hz) / (2 * e);
      // the lizard clambers onto wood and rough stone readily, but not up steep soil
      const limit = kind === SurfaceKind.Wood ? 2.8 : kind === SurfaceKind.Rock ? 1.15 : 0.9;
      if (slope > limit) c = Infinity;
      else c += Math.min(slope, 1.5) * 3;
      if (kind === SurfaceKind.Rock) c = y > 0.24 ? Infinity : c + 2;
      for (const o of obstacles) {
        const d = Math.hypot(x - o.x, z - o.z);
        if (d < o.r) c += 3 * (1 - d / o.r);
      }
      this.cost[j * this.nx + i] = c;
    }
    // Clearance: prefer routes that keep the body away from walls and drops.
    const dist = this.distanceField();
    for (let k = 0; k < N; k++) {
      if (!Number.isFinite(this.cost[k])) continue;
      const d = dist[k];
      if (d < 3) this.cost[k] += (3 - d) * 1.2;
    }
    // Connected regions; the largest is where the lizard lives.
    this.region = new Int32Array(N).fill(-1);
    let id = 0, best = 0;
    for (let s = 0; s < N; s++) {
      if (this.region[s] >= 0 || !Number.isFinite(this.cost[s])) continue;
      const stack = [s];
      this.region[s] = id;
      let size = 0;
      while (stack.length) {
        const k = stack.pop()!;
        size++;
        const cx = k % this.nx, cz = (k - cx) / this.nx;
        for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
          const X = cx + dx, Z = cz + dz;
          if (X < 0 || Z < 0 || X >= this.nx || Z >= this.nz) continue;
          const kk = Z * this.nx + X;
          if (this.region[kk] < 0 && Number.isFinite(this.cost[kk])) {this.region[kk] = id; stack.push(kk);}
        }
      }
      if (size > best) {best = size; this.mainRegion = id;}
      id++;
    }
  }

  /** Chebyshev-ish distance (in cells) from every cell to the nearest blocked cell. */
  private distanceField() {
    const N = this.nx * this.nz;
    const d = new Float32Array(N);
    for (let k = 0; k < N; k++) d[k] = Number.isFinite(this.cost[k]) ? 1e6 : 0;
    const pass = (i0: number, i1: number, di: number, j0: number, j1: number, dj: number) => {
      for (let j = j0; j !== j1; j += dj) for (let i = i0; i !== i1; i += di) {
        const k = j * this.nx + i;
        if (d[k] === 0) continue;
        let m = d[k];
        const pi = i - di, pj = j - dj;
        if (pi >= 0 && pi < this.nx) m = Math.min(m, d[j * this.nx + pi] + 1);
        if (pj >= 0 && pj < this.nz) m = Math.min(m, d[pj * this.nx + i] + 1);
        if (pi >= 0 && pi < this.nx && pj >= 0 && pj < this.nz) m = Math.min(m, d[pj * this.nx + pi] + 1.414);
        d[k] = m;
      }
    };
    pass(0, this.nx, 1, 0, this.nz, 1);
    pass(this.nx - 1, -1, -1, this.nz - 1, -1, -1);
    pass(this.nx - 1, -1, -1, 0, this.nz, 1);
    pass(0, this.nx, 1, this.nz - 1, -1, -1);
    return d;
  }

  idx(x: number, z: number) {
    const i = Math.round((x - this.x0) / this.cell), j = Math.round((z - this.z0) / this.cell);
    if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) return -1;
    return j * this.nx + i;
  }
  walkable(x: number, z: number) {
    const k = this.idx(x, z);
    return k >= 0 && Number.isFinite(this.cost[k]);
  }
  /** Walkable and in the lizard's home region. */
  reachable(x: number, z: number) {
    const k = this.idx(x, z);
    return k >= 0 && this.region[k] === this.mainRegion;
  }
  /** Walkable dry ground (for crickets, which avoid the water). */
  dry(x: number, z: number) {
    const k = this.idx(x, z);
    return k >= 0 && Number.isFinite(this.cost[k]) && !this.wet[k];
  }
  isWet(x: number, z: number) {
    const k = this.idx(x, z);
    return k >= 0 && this.wet[k] === 1;
  }
  costAt(x: number, z: number) {
    const k = this.idx(x, z);
    return k >= 0 ? this.cost[k] : Infinity;
  }

  /** Nearest walkable point to (x, z), optionally restricted to one region. */
  nearestWalkable(x: number, z: number, region = -1): [number, number] | null {
    for (let r = 0; r < 40; r++) {
      let best: [number, number] | null = null, bd = Infinity;
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        const px = x + di * this.cell, pz = z + dj * this.cell;
        const k = this.idx(px, pz);
        if (k < 0 || !Number.isFinite(this.cost[k]) || (region >= 0 && this.region[k] !== region)) continue;
        const d = di * di + dj * dj;
        if (d < bd) {bd = d; best = [px, pz];}
      }
      if (best) return best;
    }
    return null;
  }

  lineClear(ax: number, az: number, bx: number, bz: number, maxCost = 2.3) {
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / (this.cell * 0.5)));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const k = this.idx(ax + (bx - ax) * t, az + (bz - az) * t);
      if (k < 0 || !Number.isFinite(this.cost[k]) || this.cost[k] > maxCost) return false;
    }
    return true;
  }

  /** A* path from a to b as a list of smoothed waypoints, or null. */
  path(ax: number, az: number, bx: number, bz: number): [number, number][] | null {
    const start = this.nearestWalkable(ax, az);
    if (!start) return null;
    const s = this.idx(start[0], start[1]);
    const goal = this.nearestWalkable(bx, bz, this.region[s]);
    if (!goal) return null;
    const g = this.idx(goal[0], goal[1]);
    const N = this.nx * this.nz;
    const gScore = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    gScore[s] = 0;
    const gx = g % this.nx, gz = Math.floor(g / this.nx);
    const h = (k: number) => Math.hypot((k % this.nx) - gx, Math.floor(k / this.nx) - gz);
    // binary heap of [f, k]
    const heapF: number[] = [], heapK: number[] = [];
    const push = (f: number, k: number) => {
      let i = heapF.length;
      heapF.push(f); heapK.push(k);
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heapF[p] <= f) break;
        heapF[i] = heapF[p]; heapK[i] = heapK[p];
        i = p;
      }
      heapF[i] = f; heapK[i] = k;
    };
    const pop = () => {
      const top = heapK[0];
      const lf = heapF.pop()!, lk = heapK.pop()!;
      if (heapF.length) {
        let i = 0;
        for (;;) {
          const l = i * 2 + 1, r = l + 1;
          let m = i, mf = lf;
          if (l < heapF.length && heapF[l] < mf) {m = l; mf = heapF[l];}
          if (r < heapF.length && heapF[r] < mf) {m = r; mf = heapF[r];}
          if (m === i) break;
          heapF[i] = heapF[m]; heapK[i] = heapK[m];
          i = m;
        }
        heapF[i] = lf; heapK[i] = lk;
      }
      return top;
    };
    push(h(s), s);
    const dirs = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    while (heapF.length) {
      const cur = pop();
      if (closed[cur]) continue;
      if (cur === g) break;
      closed[cur] = 1;
      const cx = cur % this.nx, cz = (cur - cx) / this.nx;
      for (const [dx, dz, w] of dirs) {
        const x = cx + dx, z = cz + dz;
        if (x < 0 || z < 0 || x >= this.nx || z >= this.nz) continue;
        const k = z * this.nx + x;
        if (closed[k] || !Number.isFinite(this.cost[k])) continue;
        // no cutting diagonally past a blocked corner
        if (dx && dz && (!Number.isFinite(this.cost[cz * this.nx + x]) || !Number.isFinite(this.cost[z * this.nx + cx]))) continue;
        const t = gScore[cur] + w * (this.cost[k] + this.cost[cur]) * 0.5;
        if (t < gScore[k]) {
          gScore[k] = t;
          came[k] = cur;
          push(t + h(k), k);
        }
      }
    }
    if (came[g] < 0 && g !== s) return null;
    const raw: [number, number][] = [];
    for (let k = g; k >= 0; k = came[k]) {
      raw.push([this.x0 + (k % this.nx) * this.cell, this.z0 + Math.floor(k / this.nx) * this.cell]);
      if (k === s) break;
    }
    raw.reverse();
    if (raw.length === 1) raw.push([raw[0][0], raw[0][1]]);
    // string-pull, but only across cheap ground so the route keeps to open space
    const out: [number, number][] = [raw[0]];
    let anchor = 0;
    for (let i = 2; i < raw.length; i++) {
      if (!this.lineClear(raw[anchor][0], raw[anchor][1], raw[i][0], raw[i][1])) {
        out.push(raw[i - 1]);
        anchor = i - 1;
      }
    }
    out.push(raw[raw.length - 1]);
    return out;
  }

  /** A random point in the lizard's home region, optionally within an area. */
  randomPoint(rnd: () => number, area?: {x0: number; x1: number; z0: number; z1: number}, dryOnly = true): [number, number] | null {
    for (let i = 0; i < 300; i++) {
      const x = area ? area.x0 + rnd() * (area.x1 - area.x0) : -TANK.w / 2 + rnd() * TANK.w;
      const z = area ? area.z0 + rnd() * (area.z1 - area.z0) : -TANK.d / 2 + rnd() * TANK.d;
      const k = this.idx(x, z);
      if (k >= 0 && this.region[k] === this.mainRegion && this.cost[k] < 3 && (!dryOnly || !this.wet[k])) return [x, z];
    }
    return null;
  }
}
