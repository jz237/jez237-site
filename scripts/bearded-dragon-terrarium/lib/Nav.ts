import {TANK} from './Case';
import {Surface, SurfaceKind} from './Surface';
import {WATER_LEVEL, groundHeight} from './Ground';

/** Deepest water the dragon will wade through (metres). */
export const WADE_DEPTH = 0.021;
const STEP_ROUTE:[number,number][]=[[-.40,.055],[-.31,.09],[-.20,.13],[-.08,.17],[.075,.23]];
function stepCentreZ(x:number){
  let z=STEP_ROUTE[0][1];
  for(let i=1;i<STEP_ROUTE.length;i++)if(x>=STEP_ROUTE[i-1][0]){
    const t=Math.min(1,Math.max(0,(x-STEP_ROUTE[i-1][0])/(STEP_ROUTE[i][0]-STEP_ROUTE[i-1][0])));
    z=STEP_ROUTE[i-1][1]+(STEP_ROUTE[i][1]-STEP_ROUTE[i-1][1])*t;
  }
  return z;
}

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
      // Reserve room for the head's swept arc as the animal turns; the tail can bend.
      let c = 1;
      if (Math.min(x+TANK.w/2,TANK.w/2-x,z+TANK.d/2)<.142 || TANK.d/2-z<.085) c=Infinity;
      const kind = surface.kindAt(x, z);
      const y = surface.heightAt(x, z);
      if (kind === SurfaceKind.Water) {
        // Bearded dragons wade readily in the shallows, but not out of their depth.
        const depth = WATER_LEVEL - y;
        if (depth > WADE_DEPTH) c = Infinity;
        else {c += 2.5 + depth * 120; this.wet[j * this.nx + i] = 1;}
      }
      // slope from the height grid around the cell (the soil at the foot of the
      // log is judged by the soil, not by the log rising beside it)
      const e = 0.012;
      const h = (xx: number, zz: number) => kind !== SurfaceKind.Wood && surface.kindAt(xx, zz) === SurfaceKind.Wood ? groundHeight(xx, zz) : surface.heightAt(xx, zz);
      const hx = h(x + e, z) - h(x - e, z);
      const hz = h(x, z + e) - h(x, z - e);
      const slope = Math.hypot(hx, hz) / (2 * e);
      // the lizard clambers up the sides of the log and onto rough stone readily,
      // but not up steep soil
      const limit = kind === SurfaceKind.Wood ? 1.7 : kind === SurfaceKind.Rock ? 2.4 : 0.9;
      if (slope > limit) c = Infinity;
      else c += Math.min(slope, 1.5) * 3;
      if (kind === SurfaceKind.Rock) c = y > 0.335 ? Infinity : c + 2;
      if (kind === SurfaceKind.Wood && y > 0.25) c = Infinity;
      // The strip beside the front face of the warm steps is narrower than a
      // complete stance. Include the forward reach of the forefoot before
      // entering the crossing; a clear root alone left toes at the stone edge.
      if(kind===SurfaceKind.Ground && x>-.38 && x<.01 && z>.28 && z<.355)c=Infinity;
      // The sides of the warm ramp can support a point, but leave one
      // flank down on sand while the other reaches across a tall rock edge.
      // Reserve the broad step corridor for the trunk; feet can still use
      // neighbouring patches through the independent contact controller.
      // The lower rear edge also traps a sideways hunting stance; narrow its
      // centre corridor before the animal can put its hind feet below that lip.
      if(kind===SurfaceKind.Rock&&y>.11&&x>-.38&&x<-.105&&z>stepCentreZ(x)+.025)c=Infinity;
      if(kind===SurfaceKind.Rock&&x>-.12&&x<.025&&z<stepCentreZ(x)-.035)c=Infinity;
      // Route the trunk around tall faces before the rig has to shove it away.
      // Low risers and the sides of a climbable log remain available footholds.
      for (let a = 0; a < 8 && Number.isFinite(c); a++) {
        const angle = a * Math.PI / 4, px = x + Math.cos(angle) * .034, pz = z + Math.sin(angle) * .034;
        const rise = surface.heightAt(px, pz) - y;
        const limit = surface.kindAt(px, pz) === SurfaceKind.Wood ? .12 : .075;
        if (rise > limit) c = Infinity;
      }
      // A ground route must clear the whole stance around the end of a log.
      // A centre line can fit underneath while a thigh still strikes its side.
      if(kind===SurfaceKind.Ground)for(let a=0;a<24&&Number.isFinite(c);a++){
        const angle=a*Math.PI/12,px=x+Math.cos(angle)*.105,pz=z+Math.sin(angle)*.105;
        if(surface.kindAt(px,pz)===SurfaceKind.Wood && surface.heightAt(px,pz)>y+.03)c=Infinity;
      }
      // The sand in front of the steps is a walking corridor. Keep the whole
      // sprawling stance away from their sides instead of scraping along them.
      if(kind===SurfaceKind.Ground)for(let a=0;a<8;a++){
        const angle=a*Math.PI/4,px=x+Math.cos(angle)*.09,pz=z+Math.sin(angle)*.09;
        if(surface.heightAt(px,pz)>y+.03)c+=2;
      }
      for (const o of obstacles) {
        const d = Math.hypot(x - o.x, z - o.z);
        if (d < o.r * 1.3) c += 6 * (1 - d / (o.r * 1.3));
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
          // Connected regions use the same corner clearance as A* routes.
          if (dx && dz && (!Number.isFinite(this.cost[cz * this.nx + X]) || !Number.isFinite(this.cost[Z * this.nx + cx]))) continue;
          const kk = Z * this.nx + X;
          if (!this.canTraverse(this.x0 + cx * this.cell, this.z0 + cz * this.cell, this.x0 + X * this.cell, this.z0 + Z * this.cell)) continue;
          if (!this.canTraverse(this.x0 + X * this.cell, this.z0 + Z * this.cell, this.x0 + cx * this.cell, this.z0 + cz * this.cell)) continue;
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
  /** A foothold-sized step is climbable; a tall ledge requires another route. */
  canTraverse(ax: number, az: number, bx: number, bz: number) {
    const rise = this.surface.heightAt(bx, bz) - this.surface.heightAt(ax, az);
    return rise <= .036 && rise >= -.040;
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

  /** A route can be traversable for a point yet fail for the full animal.
   * Remember that approach so replanning does not repeat the same failed step. */
  avoidApproach(x: number, z: number, heading: number) {
    const cx=x+Math.cos(heading)*.045, cz=z-Math.sin(heading)*.045;
    for(let j=0;j<this.nz;j++)for(let i=0;i<this.nx;i++){
      const px=this.x0+i*this.cell,pz=this.z0+j*this.cell;
      const k=j*this.nx+i;
      if(Math.hypot(px-cx,pz-cz)<.027 && Math.hypot(px-x,pz-z)>.025 && Number.isFinite(this.cost[k]))this.cost[k]=Math.max(this.cost[k],50);
    }
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
    let previous=-1;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const k = this.idx(ax + (bx - ax) * t, az + (bz - az) * t);
      if (k < 0 || !Number.isFinite(this.cost[k]) || this.cost[k] > maxCost) return false;
      if(previous>=0){
        const px=previous%this.nx,pz=Math.floor(previous/this.nx),x=k%this.nx,z=Math.floor(k/this.nx);
        // Match A*'s corner rule. Point samples can otherwise jump diagonally
        // across a blocked cell between samples and approve an impossible aim.
        if(x!==px && z!==pz && (!Number.isFinite(this.cost[pz*this.nx+x]) || !Number.isFinite(this.cost[z*this.nx+px])))return false;
      }
      if (i > 0 && !this.canTraverse(ax + (bx - ax) * (i - 1) / n, az + (bz - az) * (i - 1) / n, ax + (bx - ax) * t, az + (bz - az) * t)) return false;
      previous=k;
    }
    return true;
  }

  /** A* path from a to b as a list of smoothed waypoints, or null. */
  path(ax: number, az: number, bx: number, bz: number): [number, number][] | null {
    // The wide stone steps are the usable connection between the warm ledge
    // and the sand. The nearby fork of driftwood has a narrower, obstructed exit.
    // These gateways are checked by the same A* and contact controller as every
    // other route; no position is snapped to a waypoint.
    const highA=ax<.05 && this.surface.heightAt(ax,az)>.11;
    const highB=bx<-.22 && this.surface.heightAt(bx,bz)>.20;
    const lowA=this.surface.heightAt(ax,az)<.12,lowB=this.surface.heightAt(bx,bz)<.12;
    const stair=STEP_ROUTE;
    const gates:[number,number][] = highA&&lowB ? stair.filter(([x])=>ax<x-.012) : [];
    if(highB && (ax>bx+.04 || lowA)){
      const fromSide=highA&&az>stepCentreZ(ax)+.035;
      const entry=stair.reduce((a,b)=>Math.hypot(a[0]-ax,a[1]-az)<Math.hypot(b[0]-ax,b[1]-az)?a:b);
      // Leave room to turn the whole animal before the first rising step.
      // A side approach straight to its toe puts the turnaround on the lip.
      if(lowA&&ax<.04)gates.push([.16,.34]);
      for(const gate of [...stair].reverse()){
        // Stop adding ascent gateways at the requested ledge. Continuing to
        // the far end and doubling back creates an unnecessary tight pivot
        // during a prey approach partway up the steps.
        // A root beside the steps is not already established on their route.
        // Join the nearest lower entry before ascending, rather than cutting
        // diagonally across the tall side with one forefoot still on sand.
        // Any approach from the sand joins the low entrance first. A nearby
        // root beside the ramp still cannot take a full stance across its
        // tall side, even when the point-height grid offers a diagonal path.
        const needed=fromSide?gate[0]<=entry[0]+.012:ax>gate[0]+.012 || lowA;
        if(gate[0]>=bx-.012&&needed)gates.push(gate);
      }
    }
    // Cross the sand in front of the steps with the feet on the same level.
    // A centre-only shortest route otherwise straddles the step's vertical side.
    if(lowA&&lowB&&ax>-.08&&bx<-.38)gates.push([-.04,.365],[-.38,.365]);
    if(lowA&&lowB&&ax<-.38&&bx>-.08)gates.push([-.38,.365],[-.04,.365]);
    if(lowA&&highB&&ax<-.38)gates.unshift([-.38,.365],[-.04,.365]);
    const caveA=Math.abs(ax-.475)<.11 && az<.11 && this.surface.heightAt(ax,az)<.12;
    const caveB=Math.abs(bx-.475)<.11 && bz<.11 && this.surface.heightAt(bx,bz)<.12;
    if(caveA&&!caveB)gates.unshift([.485,.28]);
    if(caveB&&!caveA)gates.push([.485,.28]);
    if(ax>.45&&ax<.52&&az>=.11&&az<.23&&bx<.45)gates.unshift([.36,.29]);
    if(gates.length){
      const points:[number,number][]=[[ax,az],...gates,[bx,bz]], route:[number,number][]=[];
      for(let i=1;i<points.length;i++){
        const part=this.directPath(...points[i-1],...points[i]);if(!part)return null;
        route.push(...(i===1?part:part.slice(1)));
      }
      return this.connectStart(route,ax,az);
    }
    const route=this.directPath(ax,az,bx,bz);
    return route ? this.connectStart(route,ax,az) : null;
  }

  private connectStart(route:[number,number][],ax:number,az:number){
    // Preserve the connector from the real position to its grid cell only
    // when skipping it would cut an occupied corner. Internal gateways are
    // already connected grid points and must not introduce a backwards step.
    if(route.length>1 && !this.lineClear(ax,az,...route[1],Infinity))route.unshift([ax,az]);
    else route[0]=[ax,az];
    return route;
  }

  private directPath(ax: number, az: number, bx: number, bz: number): [number, number][] | null {
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
        if (!this.canTraverse(this.x0 + cx * this.cell, this.z0 + cz * this.cell, this.x0 + x * this.cell, this.z0 + z * this.cell)) continue;
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
