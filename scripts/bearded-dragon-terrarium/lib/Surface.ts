import * as THREE from 'three';
import {computeBoundsTree, acceleratedRaycast} from 'three-mesh-bvh';
import {TANK} from './Case';
import {poolDistance, groundHeight, MAX_GROUND_HEIGHT, CAVE} from './Ground';
import {TailContacts} from './TailContacts';

declare module 'three' {
  interface BufferGeometry {computeBoundsTree: typeof computeBoundsTree}
}
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export const enum SurfaceKind {Ground = 0, Rock = 1, Wood = 2, Water = 3, Cave = 4}

/**
 * The surfaces inside the case, sampled on a grid by casting rays onto the
 * ground and hardscape. `height` is the floor something can stand on (under a
 * rock roof, the cave floor); `top` is what the sky sees (rain, clouds, the
 * camera). Used for planting, by the lizard's feet and by the weather.
 */
export class Surface {
  readonly tailContacts: TailContacts;
  readonly nx: number;
  readonly nz: number;
  readonly height: Float32Array;
  readonly top: Float32Array;
  /** 1 under a roof of rock (the cave), else 0. */
  readonly roof: Uint8Array;
  readonly normal: Float32Array;
  readonly kind: Uint8Array;
  readonly x0 = -TANK.w / 2 + 0.002;
  readonly z0 = -TANK.d / 2 + 0.002;
  readonly cell: number;
  private ray = new THREE.Raycaster();
  private upward = new THREE.Raycaster();
  private sight = new THREE.Raycaster();
  private meshes: {mesh: THREE.Mesh; kind: SurfaceKind; box: THREE.Box3; normalMatrix: THREE.Matrix3}[];

  constructor(ground: THREE.Mesh, hard: {mesh: THREE.Mesh; kind: SurfaceKind}[], cell = 0.004) {
    this.cell = cell;
    this.nx = Math.floor((TANK.w - 0.004) / cell) + 1;
    this.nz = Math.floor((TANK.d - 0.004) / cell) + 1;
    this.height = new Float32Array(this.nx * this.nz);
    this.top = new Float32Array(this.nx * this.nz);
    this.roof = new Uint8Array(this.nx * this.nz);
    this.normal = new Float32Array(this.nx * this.nz * 3);
    this.kind = new Uint8Array(this.nx * this.nz);
    for (const h of hard) {
      h.mesh.updateMatrixWorld(true);
      if (!h.mesh.geometry.boundsTree) h.mesh.geometry.computeBoundsTree();
    }
    this.meshes = hard.map(h=>({...h,box:new THREE.Box3().setFromObject(h.mesh),normalMatrix:new THREE.Matrix3().getNormalMatrix(h.mesh.matrixWorld)}));
    (this.ray as any).firstHitOnly = true;
    const boxes = hard.map((h) => new THREE.Box3().setFromObject(h.mesh));
    const o = new THREE.Vector3(), down = new THREE.Vector3(0, -1, 0);
    const nm = new THREE.Matrix3();
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + i * cell, z = this.z0 + j * cell;
      const k = j * this.nx + i;
      let y = groundHeight(x, z);
      let kind = poolDistance(x, z) < 0 ? SurfaceKind.Water : SurfaceKind.Ground;
      const e = 0.002;
      let n = new THREE.Vector3(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
      for (let m = 0; m < hard.length; m++) {
        const b = boxes[m];
        if (x < b.min.x || x > b.max.x || z < b.min.z || z > b.max.z || b.max.y < y) continue;
        o.set(x, b.max.y + 0.01, z);
        this.ray.set(o, down);
        const hit = this.ray.intersectObject(hard[m].mesh, false)[0];
        if (hit && hit.point.y > y) {
          y = hit.point.y;
          kind = hard[m].kind;
          nm.getNormalMatrix(hard[m].mesh.matrixWorld);
          n = hit.face!.normal.clone().applyMatrix3(nm).normalize();
          if (n.y < 0) n.negate();
        }
      }
      this.height[k] = y;
      this.top[k] = y;
      this.normal.set([n.x, n.y, n.z], k * 3);
      this.kind[k] = kind;
    }
    this.findCave();
    this.tailContacts = new TailContacts(hard.map(h => h.mesh), groundHeight, MAX_GROUND_HEIGHT);
    void ground;
  }

  /**
   * Under the cave's roof a ray from above meets the rock, not the floor. Where
   * a ray cast up from just above the ground meets a ceiling with room beneath
   * it, the floor is the ground and the cell is sheltered.
   */
  private findCave() {
    const up = new THREE.Vector3(0, 1, 0), o = new THREE.Vector3();
    const x0 = CAVE.x - CAVE.rx - 0.03, x1 = CAVE.x + CAVE.rx + 0.03;
    const z0 = CAVE.z - CAVE.rz - 0.03, z1 = CAVE.mouth.z + CAVE.mouth.rz + 0.03;
    const e = 0.002;
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + i * this.cell, z = this.z0 + j * this.cell;
      // Keep the warm ledge as a top surface; only the cool hide is entered below.
      if (x < x0 || x > x1 || z < z0 || z > z1) continue;
      const g = groundHeight(x, z);
      o.set(x, g + 0.004, z);
      this.ray.set(o, up);
      this.ray.far = 0.19;
      let ceiling = Infinity;
      for (const h of this.meshes) {
        // only rock makes a cave roof: the log's end overhangs the ground nearby,
        // but nothing can walk under it
        if (h.kind === SurfaceKind.Wood) continue;
        const hit = this.ray.intersectObject(h.mesh, false)[0];
        if (hit && hit.point.y < ceiling) ceiling = hit.point.y;
      }
      this.ray.far = Infinity;
      if (!Number.isFinite(ceiling)) continue;
      const k = j * this.nx + i;
      this.roof[k] = 1;
      // too low to crawl under: leave it as rock
      if (ceiling - g < 0.026) continue;
      this.height[k] = g;
      this.kind[k] = SurfaceKind.Cave;
      const n = new THREE.Vector3(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
      this.normal.set([n.x, n.y, n.z], k * 3);
    }
  }

  private idx(x: number, z: number) {
    const i = Math.min(this.nx - 1, Math.max(0, Math.round((x - this.x0) / this.cell)));
    const j = Math.min(this.nz - 1, Math.max(0, Math.round((z - this.z0) / this.cell)));
    return j * this.nx + i;
  }

  private bilinear(h: Float32Array, x: number, z: number) {
    const fx = Math.min(this.nx - 1.001, Math.max(0, (x - this.x0) / this.cell));
    const fz = Math.min(this.nz - 1.001, Math.max(0, (z - this.z0) / this.cell));
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
    const n = this.nx;
    const a = h[j * n + i], b = h[j * n + i + 1], c = h[(j + 1) * n + i], d = h[(j + 1) * n + i + 1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  /** Bilinear floor height (what feet stand on). */
  heightAt(x: number, z: number) {return this.bilinear(this.height, x, z);}
  /** Support below the animal: overhead branches are ceilings, not a floor. */
  heightBelow(x: number, z: number, ceiling: number) {
    const floor=this.heightAt(x,z);
    if(floor<=ceiling || this.kindAt(x,z)===SurfaceKind.Cave)return floor;
    return this.cast(x,z,ceiling,{y:0,normal:new THREE.Vector3()}).y;
  }
  /** Bilinear height of the uppermost surface (what rain lands on). */
  topAt(x: number, z: number) {return this.bilinear(this.top, x, z);}
  /** True under the cave's roof. */
  roofed(x: number, z: number) {return this.roof[this.idx(x, z)] === 1;}
  normalAt(x: number, z: number, out = new THREE.Vector3()) {
    const k = this.idx(x, z) * 3;
    return out.set(this.normal[k], this.normal[k + 1], this.normal[k + 2]);
  }
  kindAt(x: number, z: number): SurfaceKind {return this.kind[this.idx(x, z)];}

  /** Actual foothold below the rig's reach, without height-grid interpolation. */
  supportAt(x: number, z: number, fromY: number, out: {y: number; normal: THREE.Vector3}) {
    return this.cast(x, z, fromY, out);
  }

  /** Precise downward ray against everything (for feet). */
  cast(x: number, z: number, fromY: number, out: {y: number; normal: THREE.Vector3}) {
    let best = groundHeight(x, z);
    const e = 0.0015;
    out.normal.set(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
    this.ray.set(new THREE.Vector3(x, fromY, z), new THREE.Vector3(0, -1, 0));
    this.ray.far = fromY - best + 0.001;
    for (const h of this.meshes) {
      if(x<h.box.min.x || x>h.box.max.x || z<h.box.min.z || z>h.box.max.z || h.box.max.y<best)continue;
      let hit: THREE.Intersection | undefined = this.ray.intersectObject(h.mesh, false)[0];
      // Back faces are the underside of a branch, not a surface a foot can stand
      // on. If the query starts inside a solid, return its actual upper face so
      // the reach/clearance checks reject the overlapping pose.
      const outward = (candidate:THREE.Intersection)=>candidate.face!.normal.clone().applyNormalMatrix(h.normalMatrix);
      if(hit && outward(hit).y <= .05) {
        this.upward.set(new THREE.Vector3(x,fromY,z),new THREE.Vector3(0,1,0));
        const exit=this.upward.intersectObject(h.mesh,false)[0];
        hit=exit && outward(exit).y>.05 ? exit : undefined;
      }
      if (hit && hit.point.y > best) {
        best = hit.point.y;
        out.normal.copy(outward(hit)).normalize();
      }
    }
    this.ray.far = Infinity;
    out.y = best;
    return out;
  }

  /** Slope steepness (0 flat … 1 vertical) from the normal. */
  slopeAt(x: number, z: number) {return 1 - this.normalAt(x, z).y;}

  /** Sight uses the same visible stone/wood meshes as contact, not navigation cells. */
  visibleFrom(eye:THREE.Vector3,target:THREE.Vector3) {
    const delta=target.clone().sub(eye),distance=delta.length();
    if(distance<.006)return true;
    this.sight.set(eye,delta.divideScalar(distance));this.sight.near=.002;this.sight.far=distance-.003;
    return !this.meshes.some(h=>this.sight.ray.intersectsBox(h.box)&&this.sight.intersectObject(h.mesh,false).length>0);
  }
}
