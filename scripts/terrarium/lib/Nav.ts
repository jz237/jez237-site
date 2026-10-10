import {TANK} from './Case';
import {Surface, SurfaceKind} from './Surface';
import {poolDistance} from './Ground';

/**
 * Walkability grid for the lizard: cost from slope, water, rock and planting,
 * A* search and line-of-sight smoothing.
 */
export class Nav {
  readonly cell = 0.01;
  readonly nx: number;
  readonly nz: number;
  readonly x0 = -TANK.w / 2 + 0.005;
  readonly z0 = -TANK.d / 2 + 0.005;
  readonly cost: Float32Array; // Infinity = blocked

  constructor(readonly surface: Surface, obstacles: {x: number; z: number; r: number}[]) {
    this.nx = Math.floor((TANK.w - 0.01) / this.cell) + 1;
    this.nz = Math.floor((TANK.d - 0.01) / this.cell) + 1;
    this.cost = new Float32Array(this.nx * this.nz);
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + i * this.cell, z = this.z0 + j * this.cell;
      // keep the body (≈ 4 cm wide) clear of the glass
      const margin = Math.min(x + TANK.w / 2, TANK.w / 2 - x, z + TANK.d / 2, TANK.d / 2 - z);
      let c = 1;
      if (margin < 0.035) c = Infinity;
      const kind = surface.kindAt(x, z);
      if (kind === SurfaceKind.Water || poolDistance(x, z) < 0.02) c = Infinity;
      // slope from the height grid around the cell
      const e = 0.012;
      const hx = surface.heightAt(x + e, z) - surface.heightAt(x - e, z);
      const hz = surface.heightAt(x, z + e) - surface.heightAt(x, z - e);
      const slope = Math.hypot(hx, hz) / (2 * e);
      // the lizard clambers onto wood readily, but not up steep soil or rock
      if (slope > (kind === SurfaceKind.Wood ? 2.8 : 0.85)) c = Infinity;
      else c += Math.min(slope, 1.5) * 4;
      if (kind === SurfaceKind.Rock && surface.heightAt(x, z) > 0.2) c = Infinity;
      for (const o of obstacles) {
        const d = Math.hypot(x - o.x, z - o.z);
        if (d < o.r) c += 3 * (1 - d / o.r);
      }
      this.cost[j * this.nx + i] = c;
    }
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

  /** Nearest walkable point to (x, z). */
  nearestWalkable(x: number, z: number): [number, number] | null {
    for (let r = 0; r < 30; r++) {
      let best: [number, number] | null = null, bd = Infinity;
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        const px = x + di * this.cell, pz = z + dj * this.cell;
        if (this.walkable(px, pz)) {const d = di * di + dj * dj; if (d < bd) {bd = d; best = [px, pz];}}
      }
      if (best) return best;
    }
    return null;
  }

  private lineClear(ax: number, az: number, bx: number, bz: number) {
    const n = Math.ceil(Math.hypot(bx - ax, bz - az) / (this.cell * 0.5));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const k = this.idx(ax + (bx - ax) * t, az + (bz - az) * t);
      if (k < 0 || !Number.isFinite(this.cost[k]) || this.cost[k] > 2.5) return false;
    }
    return true;
  }

  /** A* path from a to b as a list of smoothed waypoints, or null. */
  path(ax: number, az: number, bx: number, bz: number): [number, number][] | null {
    const start = this.nearestWalkable(ax, az), goal = this.nearestWalkable(bx, bz);
    if (!start || !goal) return null;
    const s = this.idx(start[0], start[1]), g = this.idx(goal[0], goal[1]);
    const N = this.nx * this.nz;
    const gScore = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const open: number[] = [s];
    const fScore = new Float32Array(N).fill(Infinity);
    gScore[s] = 0;
    const gx = g % this.nx, gz = Math.floor(g / this.nx);
    const h = (k: number) => Math.hypot((k % this.nx) - gx, Math.floor(k / this.nx) - gz);
    fScore[s] = h(s);
    const dirs = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    let iterations = 0;
    while (open.length && iterations++ < 12000) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (fScore[open[i]] < fScore[open[bi]]) bi = i;
      const cur = open[bi];
      open.splice(bi, 1);
      if (cur === g) break;
      closed[cur] = 1;
      const cx = cur % this.nx, cz = Math.floor(cur / this.nx);
      for (const [dx, dz, w] of dirs) {
        const x = cx + dx, z = cz + dz;
        if (x < 0 || z < 0 || x >= this.nx || z >= this.nz) continue;
        const k = z * this.nx + x;
        if (closed[k] || !Number.isFinite(this.cost[k])) continue;
        const t = gScore[cur] + w * this.cost[k];
        if (t < gScore[k]) {
          if (gScore[k] === Infinity) open.push(k);
          gScore[k] = t;
          fScore[k] = t + h(k);
          came[k] = cur;
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
    // string-pull
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

  /** A random walkable point, optionally within a region. */
  randomPoint(rnd: () => number, region?: {x0: number; x1: number; z0: number; z1: number}): [number, number] | null {
    for (let i = 0; i < 200; i++) {
      const x = region ? region.x0 + rnd() * (region.x1 - region.x0) : -TANK.w / 2 + rnd() * TANK.w;
      const z = region ? region.z0 + rnd() * (region.z1 - region.z0) : -TANK.d / 2 + rnd() * TANK.d;
      const k = this.idx(x, z);
      if (k >= 0 && this.cost[k] < 2) return [x, z];
    }
    return null;
  }
}
