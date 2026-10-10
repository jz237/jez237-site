import * as THREE from 'three';
import {computeBoundsTree, acceleratedRaycast} from 'three-mesh-bvh';
import {TANK} from './Case';
import {WATER_LEVEL, groundHeight} from './Ground';

declare module 'three' {
  interface BufferGeometry {computeBoundsTree: typeof computeBoundsTree}
}
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export const enum SurfaceKind {Ground = 0, Rock = 1, Wood = 2, Water = 3}

/**
 * The top surface inside the case, sampled on a grid by casting rays down onto
 * the ground and hardscape. Used for planting and by the lizard's feet.
 */
export class Surface {
  readonly nx: number;
  readonly nz: number;
  readonly height: Float32Array;
  readonly normal: Float32Array;
  readonly kind: Uint8Array;
  readonly x0 = -TANK.w / 2 + 0.002;
  readonly z0 = -TANK.d / 2 + 0.002;
  readonly cell: number;
  private ray = new THREE.Raycaster();
  private meshes: {mesh: THREE.Mesh; kind: SurfaceKind}[];

  constructor(ground: THREE.Mesh, hard: {mesh: THREE.Mesh; kind: SurfaceKind}[], cell = 0.004) {
    this.cell = cell;
    this.nx = Math.floor((TANK.w - 0.004) / cell) + 1;
    this.nz = Math.floor((TANK.d - 0.004) / cell) + 1;
    this.height = new Float32Array(this.nx * this.nz);
    this.normal = new Float32Array(this.nx * this.nz * 3);
    this.kind = new Uint8Array(this.nx * this.nz);
    for (const h of hard) {
      h.mesh.updateMatrixWorld(true);
      if (!h.mesh.geometry.boundsTree) h.mesh.geometry.computeBoundsTree();
    }
    this.meshes = hard;
    (this.ray as any).firstHitOnly = true;
    const boxes = hard.map((h) => new THREE.Box3().setFromObject(h.mesh));
    const o = new THREE.Vector3(), down = new THREE.Vector3(0, -1, 0);
    const nm = new THREE.Matrix3();
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) {
      const x = this.x0 + i * cell, z = this.z0 + j * cell;
      const k = j * this.nx + i;
      let y = groundHeight(x, z);
      let kind = y < WATER_LEVEL ? SurfaceKind.Water : SurfaceKind.Ground;
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
      this.normal.set([n.x, n.y, n.z], k * 3);
      this.kind[k] = kind;
    }
    void ground;
  }

  private idx(x: number, z: number) {
    const i = Math.min(this.nx - 1, Math.max(0, Math.round((x - this.x0) / this.cell)));
    const j = Math.min(this.nz - 1, Math.max(0, Math.round((z - this.z0) / this.cell)));
    return j * this.nx + i;
  }

  /** Bilinear surface height. */
  heightAt(x: number, z: number) {
    const fx = Math.min(this.nx - 1.001, Math.max(0, (x - this.x0) / this.cell));
    const fz = Math.min(this.nz - 1.001, Math.max(0, (z - this.z0) / this.cell));
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
    const h = this.height, n = this.nx;
    const a = h[j * n + i], b = h[j * n + i + 1], c = h[(j + 1) * n + i], d = h[(j + 1) * n + i + 1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  normalAt(x: number, z: number, out = new THREE.Vector3()) {
    const k = this.idx(x, z) * 3;
    return out.set(this.normal[k], this.normal[k + 1], this.normal[k + 2]);
  }
  kindAt(x: number, z: number): SurfaceKind {return this.kind[this.idx(x, z)];}

  /** Precise downward ray against everything (for feet). */
  cast(x: number, z: number, fromY: number, out: {y: number; normal: THREE.Vector3}) {
    let best = groundHeight(x, z);
    const e = 0.0015;
    out.normal.set(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
    this.ray.set(new THREE.Vector3(x, fromY, z), new THREE.Vector3(0, -1, 0));
    this.ray.far = fromY - best + 0.001;
    for (const h of this.meshes) {
      const hit = this.ray.intersectObject(h.mesh, false)[0];
      if (hit && hit.point.y > best) {
        best = hit.point.y;
        out.normal.copy(hit.face!.normal).transformDirection(h.mesh.matrixWorld);
        if (out.normal.y < 0) out.normal.negate();
      }
    }
    this.ray.far = Infinity;
    out.y = best;
    return out;
  }

  /** Slope steepness (0 flat … 1 vertical) from the normal. */
  slopeAt(x: number, z: number) {return 1 - this.normalAt(x, z).y;}
}
