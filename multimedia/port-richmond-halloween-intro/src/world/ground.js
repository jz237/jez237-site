// Exact ground height on the game's drawn street surfaces (asphalt, gutters, curbs, sidewalks, lots...):
// a uniform XZ grid of triangle indices over the ground meshes; groundY(x, z) returns the highest ground triangle
// under the point (so the curb top wins over the gutter beneath its lip). Built once at load, allocation-free queries.
import * as THREE from 'three';

export class GroundHeight {
  constructor(meshes, { cell = 1.0 } = {}) {
    const tris = [];
    const v = new THREE.Vector3();
    for (const mesh of meshes) {
      mesh.updateMatrixWorld(true);
      const g = mesh.geometry;
      const P = g.attributes.position;
      const I = g.index ? g.index.array : null;
      const n = I ? I.length : P.count;
      for (let k = 0; k < n; k += 3) {
        for (let j = 0; j < 3; j++) {
          v.fromBufferAttribute(P, I ? I[k + j] : k + j).applyMatrix4(mesh.matrixWorld);
          tris.push(v.x, v.y, v.z);
        }
      }
    }
    this.T = new Float32Array(tris);
    const nt = this.T.length / 9;
    let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
    for (let i = 0; i < nt; i++) {
      for (let j = 0; j < 3; j++) {
        const x = this.T[i * 9 + j * 3], z = this.T[i * 9 + j * 3 + 2];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (z < z0) z0 = z; if (z > z1) z1 = z;
      }
    }
    this.cell = cell;
    this.x0 = x0; this.z0 = z0;
    this.nx = Math.max(1, Math.ceil((x1 - x0) / cell) + 1);
    this.nz = Math.max(1, Math.ceil((z1 - z0) / cell) + 1);
    const counts = new Uint32Array(this.nx * this.nz + 1);
    const cellsOf = (i, cb) => {
      let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
      for (let j = 0; j < 3; j++) {
        const x = this.T[i * 9 + j * 3], z = this.T[i * 9 + j * 3 + 2];
        a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, z); d = Math.max(d, z);
      }
      const ia = Math.floor((a - x0) / cell), ib = Math.floor((b - x0) / cell);
      const ic = Math.floor((c - z0) / cell), id = Math.floor((d - z0) / cell);
      for (let ix = ia; ix <= ib; ix++) for (let iz = ic; iz <= id; iz++) cb(ix * this.nz + iz);
    };
    for (let i = 0; i < nt; i++) cellsOf(i, (c) => { counts[c + 1]++; });
    for (let c = 1; c < counts.length; c++) counts[c] += counts[c - 1];
    this.start = counts;
    this.list = new Uint32Array(counts[counts.length - 1]);
    const fill = new Uint32Array(this.nx * this.nz);
    for (let i = 0; i < nt; i++) cellsOf(i, (c) => { this.list[counts[c] + fill[c]++] = i; });
  }

  // height of the drawn ground at (x, z); fallback when outside every ground triangle
  y(x, z, fallback = NaN) {
    const ix = Math.floor((x - this.x0) / this.cell), iz = Math.floor((z - this.z0) / this.cell);
    if (ix < 0 || iz < 0 || ix >= this.nx || iz >= this.nz) return fallback;
    const c = ix * this.nz + iz;
    const T = this.T;
    let best = -Infinity;
    for (let k = this.start[c]; k < this.start[c + 1]; k++) {
      const o = this.list[k] * 9;
      const ax = T[o], ay = T[o + 1], az = T[o + 2];
      const bx = T[o + 3], by = T[o + 4], bz = T[o + 5];
      const cx = T[o + 6], cy = T[o + 7], cz = T[o + 8];
      const v0x = cx - ax, v0z = cz - az, v1x = bx - ax, v1z = bz - az, v2x = x - ax, v2z = z - az;
      const d00 = v0x * v0x + v0z * v0z, d01 = v0x * v1x + v0z * v1z, d11 = v1x * v1x + v1z * v1z;
      const d20 = v2x * v0x + v2z * v0z, d21 = v2x * v1x + v2z * v1z;
      const den = d00 * d11 - d01 * d01;
      if (Math.abs(den) < 1e-12) continue;
      const u = (d11 * d20 - d01 * d21) / den;
      const v = (d00 * d21 - d01 * d20) / den;
      if (u < -1e-5 || v < -1e-5 || u + v > 1 + 1e-5) continue;
      const yy = ay + u * (cy - ay) + v * (by - ay);
      if (yy > best) best = yy;
    }
    return best === -Infinity ? fallback : best;
  }
}
