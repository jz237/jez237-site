// The cave itself. The tile map is turned into a 3D density field — rock tiles are solid from deep behind the play
// plane out to a ragged front face near the camera; open tiles are hollow down to a back wall that recedes further
// in big chambers — and the surface is extracted with naive surface nets in 16x16-tile chunks. Floors stay exactly
// where the physics has them (no noise near the play plane on upward faces); walls, ceilings and the depths get
// layered noise so the rock reads as rock. Every vertex carries ambient occlusion, a biome colour and material
// weights (gold vein, wetness, glow, rubble/cracks) that the triplanar rock shader uses.
// Breaking a tile re-meshes only the chunks around it (a few ms).
import * as THREE from '../vendor/three.module.min.js';
import { T } from './config.js?v=16';

export const S = 0.5;                  // sample spacing (m)
export const Z0 = -15, Z1 = 5;         // depth range (camera side is +z)
const NZ = Math.round((Z1 - Z0) / S) + 1;
export const CH = 16;                  // chunk size in tiles

// 3D value noise (deterministic per level)
// how each depth's rock is sculpted when fine detail is on (variants pick their own in render.js VARIANTS shape.style)
const STYLES = ['strata', 'scallop', 'facet', 'flow', 'columns'];
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hashK = (k, n) => { let h = Math.imul(k ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(n + 7, 0xc2b2ae35); h ^= h >>> 15; h = Math.imul(h, 0x27d4eb2d); h ^= h >>> 13; return (h >>> 0) / 4294967296; };
function noise3(seed) {
  const p = new Uint8Array(512); let s = seed >>> 0 || 1;
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  const g = new Float32Array(256); for (let i = 0; i < 256; i++) { s = (s * 1664525 + 1013904223) >>> 0; g[i] = s / 4294967296; }
  const h = (x, y, z) => g[p[p[p[x & 255] + (y & 255)] + (z & 255)]];
  return (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    let fx = x - xi, fy = y - yi, fz = z - zi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
    const a = h(xi, yi, zi), b = h(xi + 1, yi, zi), c = h(xi, yi + 1, zi), d = h(xi + 1, yi + 1, zi);
    const e = h(xi, yi, zi + 1), f = h(xi + 1, yi, zi + 1), gg = h(xi, yi + 1, zi + 1), hh = h(xi + 1, yi + 1, zi + 1);
    const x1 = a + (b - a) * fx, x2 = c + (d - c) * fx, x3 = e + (f - e) * fx, x4 = gg + (hh - gg) * fx;
    const y1 = x1 + (x2 - x1) * fy, y2 = x3 + (x4 - x3) * fy;
    return y1 + (y2 - y1) * fz;
  };
}

// which tiles are part of the rock mesh (doors, crumbling slabs, planks, ladders, water and lava are separate)
const MESHED = new Uint8Array(16);
for (const k of [T.ROCK, T.SOFT, T.HARD, T.VEIN, T.GEMV, T.FOSSIL]) MESHED[k] = 1;

export class Cave {
  constructor(M, look, mat, opts = {}) {
    this.M = M; this.look = look; this.mat = mat;
    // fine: split every triangle in four and sculpt the walls in the level's style (high quality only)
    this.fine = !!opts.fine;
    this.style = (look.shape && look.shape.style) || STYLES[M.biome % 5];
    this.n3 = noise3((M.seed * 31 + M.depth * 7 + M.level) >>> 0);
    this.group = new THREE.Group();
    this.chunks = new Map();
    // sample grid in x/y covers the map plus a margin of solid rock
    this.mx = 3;
    // a deeper margin under the map: the exit shaft runs on down through it, so the lift sinks out of sight
    this.my = 12;
    this.nx = Math.round((M.w + this.mx * 2) / S) + 1;
    this.ny = Math.round((M.h + this.mx + this.my) / S) + 1;
    const sh = look.shape || {};
    this.back = sh.back || 1; this.jag = sh.jag || 1; this.cols = sh.cols || 0; this.colR = sh.colR || 0.75; this.sk = (M.seed * 13 + M.level * 101) | 0;
    this.buildColumns();
    const cw = Math.ceil(M.w / CH), chh = Math.ceil(M.h / CH);
    this.cw = cw; this.chh = chh;
    for (let cy = -1; cy <= chh; cy++) for (let cx = -1; cx <= cw; cx++) this.buildChunk(cx, cy);
  }
  tile(x, y) {
    const M = this.M;
    if (x < 0 || x >= M.w) return T.ROCK;
    if (y < 0) return (M.exit && (x === Math.floor(M.exit.x) - 1 || x === Math.floor(M.exit.x))) ? T.AIR : T.ROCK;   // the shaft the lift goes down
    if (y >= M.h) return (M.start && (x === Math.floor(M.start.x) - 1 || x === Math.floor(M.start.x))) ? T.AIR : T.ROCK;   // the shaft up to daylight
    return M.tiles[y * M.w + x];
  }
  solid(x, y) { return MESHED[this.tile(x, y)] ? 1 : 0; }

  // per-column (x, y) values: smoothed solidity, front face depth, back wall depth
  buildColumns() {
    const { nx, ny, M } = this, m = this.mx, my = this.my;
    const N = nx * ny;
    this.sol = new Float32Array(N); this.zf = new Float32Array(N); this.zb = new Float32Array(N);
    // distance (tiles) from each open tile to the nearest rock, for the back wall depth
    const W = M.w, H = M.h, dist = new Float32Array(W * H).fill(99);
    const q = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (this.solid(x, y) || this.tile(x, y) === T.DOOR) { dist[y * W + x] = 0; q.push(x, y); }
    for (let h = 0; h < q.length; h += 2) {
      const x = q[h], y = q[h + 1], d = dist[y * W + x];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const i = yy * W + xx; if (dist[i] > d + 1) { dist[i] = d + 1; q.push(xx, yy); } }
    }
    this.dist = dist;
    const n3 = this.n3;
    this.pockets = (M.finds || []).filter((f) => f.kind === 'wonder' && f.room).map((f) => [f.room[0] + 1.5, f.room[1] + 3, f.room[0] + 14.5, f.room[1] + 11]);
    const raw = new Float32Array(N);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = -m + i * S + 0.25, y = -my + j * S + 0.25;
      // bilinear over tile centres
      const fx = x - 0.5, fy = y - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
      const a = this.solid(x0, y0), b = this.solid(x0 + 1, y0), c = this.solid(x0, y0 + 1), d = this.solid(x0 + 1, y0 + 1);
      raw[j * nx + i] = a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
    }
    // one gentle blur rounds the corners without moving flat floors
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      let s = 0, w = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = Math.min(nx - 1, Math.max(0, i + di)), jj = Math.min(ny - 1, Math.max(0, j + dj)); const k = (di === 0 && dj === 0) ? 2 : 1; s += raw[jj * nx + ii] * k; w += k; }
      this.sol[j * nx + i] = s / w;
    }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = -m + i * S, y = -my + j * S;
      const tx = Math.floor(x), ty = Math.floor(y);
      const dd = (tx >= 0 && ty >= 0 && tx < W && ty < H) ? dist[ty * W + tx] : 0;
      const k = j * nx + i;
      this.zf[k] = 2.3 + n3(x * 0.13, y * 0.13, 1.5) * 1.6 + n3(x * 0.5, y * 0.5, 9.1) * 0.4;
      this.zb[k] = -(1.9 + (Math.min(dd, 8) * 0.62 + n3(x * 0.09 + 3, y * 0.09, 4.2) * 2.6) * this.back + n3(x * 0.4 * this.jag, y * 0.4 * this.jag, 7.7) * 0.6 * this.jag);
      // a wonder's room opens into a great hollow behind it
      for (const pk of this.pockets) {
        const ex = Math.max(pk[0] - x, 0, x - pk[2]), ey = Math.max(pk[1] - y, 0, y - pk[3]);
        const f = Math.max(0, 1 - Math.hypot(ex, ey) / 2.5);
        if (f > 0) this.zb[k] -= 7.5 * f * f * (3 - 2 * f);
      }
    }
  }
  col(arr, x, y) {
    const fx = (x + this.mx) / S, fy = (y + this.my) / S;
    const i = Math.max(0, Math.min(this.nx - 2, Math.floor(fx))), j = Math.max(0, Math.min(this.ny - 2, Math.floor(fy)));
    const tx = Math.min(1, Math.max(0, fx - i)), ty = Math.min(1, Math.max(0, fy - j)), n = this.nx;
    const a = arr[j * n + i], b = arr[j * n + i + 1], c = arr[(j + 1) * n + i], d = arr[(j + 1) * n + i + 1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  }
  // density at a world point (> 0 is rock)
  density(x, y, z) {
    const sv = (this.col(this.sol, x, y) - 0.5) * 4;
    const zf = this.col(this.zf, x, y), zb = this.col(this.zb, x, y);
    let d = Math.max(Math.min(sv, zf - z), zb - z);
    // pillared halls: stone columns stand floor to ceiling behind the play plane
    if (this.cols && z < -2.3) {
      const sp = 7, ci = Math.round(x / sp);
      for (let k = ci - 1; k <= ci + 1; k++) {
        const h1 = hashK(k + this.sk, 1);
        if (h1 > this.cols) continue;
        const cx = k * sp + (hashK(k + this.sk, 2) - 0.5) * 2.5, cz = -3.7 - hashK(k + this.sk, 3) * 2.2;
        const r = this.colR * (0.8 + hashK(k + this.sk, 4) * 0.45) * (1 + 0.1 * Math.sin(y * 1.1 + k * 2.3));
        d = Math.max(d, (r - Math.hypot(x - cx, z - cz)) * 2.2);
      }
    }
    const az = Math.abs(z);
    if (az > 1.1) { const w = Math.min(1, (az - 1.1) / 1.9); d += (this.n3(x * 0.42, y * 0.42, z * 0.42) - 0.5) * 1.5 * w + (this.n3(x * 1.3, y * 1.3, z * 1.3) - 0.5) * 0.45 * w; }
    return d;
  }

  chunkKey(cx, cy) { return cx + ',' + cy; }
  // rebuild the chunks that can see tile (tx, ty)
  rebuildAround(tx, ty) {
    const seen = new Set();
    for (const dx of [-2, 2, 0]) for (const dy of [-2, 2, 0]) {
      const cx = Math.floor((tx + dx) / CH), cy = Math.floor((ty + dy) / CH), k = this.chunkKey(cx, cy);
      if (seen.has(k)) continue; seen.add(k);
      this.buildColumnsLocal(tx, ty);
      this.buildChunk(cx, cy);
    }
  }
  buildColumnsLocal(tx, ty) {
    // refresh the solidity samples around a changed tile (rubble gone: the hole opens)
    const { nx, ny, M } = this, m = this.mx;
    const i0 = Math.max(0, Math.floor((tx - 2 + m) / S)), i1 = Math.min(nx - 1, Math.ceil((tx + 3 + m) / S));
    const my = this.my;
    const j0 = Math.max(0, Math.floor((ty - 2 + my) / S)), j1 = Math.min(ny - 1, Math.ceil((ty + 3 + my) / S));
    const raw = (i, j) => {
      const x = -m + i * S + 0.25, y = -my + j * S + 0.25, fx = x - 0.5, fy = y - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), ax = fx - x0, ay = fy - y0;
      const a = this.solid(x0, y0), b = this.solid(x0 + 1, y0), c = this.solid(x0, y0 + 1), d = this.solid(x0 + 1, y0 + 1);
      return a + (b - a) * ax + (c - a) * ay + (a - b - c + d) * ax * ay;
    };
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      let s = 0, w = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = Math.min(nx - 1, Math.max(0, i + di)), jj = Math.min(ny - 1, Math.max(0, j + dj)); const k = (di === 0 && dj === 0) ? 2 : 1; s += raw(ii, jj) * k; w += k; }
      this.sol[j * nx + i] = s / w;
    }
  }

  buildChunk(cx, cy) {
    const key = this.chunkKey(cx, cy);
    const old = this.chunks.get(key);
    if (old) { this.group.remove(old); old.geometry.dispose(); this.chunks.delete(key); }
    const geo = this.mesh(cx * CH, cy * CH, CH);
    if (!geo) return;
    const mesh = new THREE.Mesh(geo, this.mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    this.group.add(mesh);
    this.chunks.set(key, mesh);
  }

  // naive surface nets over the samples of a chunk (tiles [tx0, tx0+n) x [ty0, ty0+n), plus the margin chunks)
  mesh(tx0, ty0, n) {
    const m = this.mx;
    // sample index range (one extra each side so edge quads are complete)
    const i0 = Math.max(0, Math.round((tx0 + m) / S) - 1), i1 = Math.min(this.nx - 1, Math.round((tx0 + n + m) / S) + 1);
    const my = this.my;
    const j0 = Math.max(0, Math.round((ty0 + my) / S) - 1), j1 = Math.min(this.ny - 1, Math.round((ty0 + n + my) / S) + 1);
    if (i1 - i0 < 2 || j1 - j0 < 2) return null;
    const NX = i1 - i0 + 1, NY = j1 - j0 + 1;
    const D = new Float32Array(NX * NY * NZ);
    let any = false, allIn = true;
    for (let k = 0; k < NZ; k++) for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const v = this.density(-m + (i0 + i) * S, -my + (j0 + j) * S, Z0 + k * S);
      D[(k * NY + j) * NX + i] = v;
      if (v > 0) any = true; else allIn = false;
    }
    if (!any || allIn) return null;
    const at = (i, j, k) => D[(k * NY + j) * NX + i];
    // vertices: one per cell with a sign change
    const vid = new Int32Array(NX * NY * NZ).fill(-1);
    const pos = [];
    const cornerOff = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
    const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const cv = new Float32Array(8);
    for (let k = 0; k < NZ - 1; k++) for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
      let mask = 0;
      for (let c = 0; c < 8; c++) { const o = cornerOff[c]; const v = at(i + o[0], j + o[1], k + o[2]); cv[c] = v; if (v > 0) mask |= 1 << c; }
      if (mask === 0 || mask === 255) continue;
      let sx = 0, sy = 0, sz = 0, cnt = 0;
      for (const [a, b] of edges) {
        const va = cv[a], vb = cv[b];
        if ((va > 0) === (vb > 0)) continue;
        const t = va / (va - vb), oa = cornerOff[a], ob = cornerOff[b];
        sx += oa[0] + (ob[0] - oa[0]) * t; sy += oa[1] + (ob[1] - oa[1]) * t; sz += oa[2] + (ob[2] - oa[2]) * t; cnt++;
      }
      vid[(k * NY + j) * NX + i] = pos.length / 3;
      pos.push(-m + (i0 + i + sx / cnt) * S, -my + (j0 + j + sy / cnt) * S, Z0 + (k + sz / cnt) * S);
    }
    // faces: for each sample edge with a sign change, a quad of the four cells around it. Only edges whose
    // lower corner lies inside this chunk's tile range are emitted, so chunks never double up.
    const idx = [];
    const inI = (i) => { const x = -m + (i0 + i) * S; return x >= tx0 && x < tx0 + n; };
    const inJ = (j) => { const y = -my + (j0 + j) * S; return y >= ty0 && y < ty0 + n; };
    const cell = (i, j, k) => (i < 0 || j < 0 || k < 0 || i >= NX - 1 || j >= NY - 1 || k >= NZ - 1) ? -1 : vid[(k * NY + j) * NX + i];
    const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (!flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d); };
    for (let k = 1; k < NZ - 1; k++) for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
      if (!(inI(i) && inJ(j))) continue;
      const v0 = at(i, j, k) > 0;
      if (i < NX - 1 && v0 !== (at(i + 1, j, k) > 0)) quad(cell(i, j - 1, k - 1), cell(i, j, k - 1), cell(i, j, k), cell(i, j - 1, k), v0);
      if (j < NY - 1 && v0 !== (at(i, j + 1, k) > 0)) quad(cell(i - 1, j, k - 1), cell(i - 1, j, k), cell(i, j, k), cell(i, j, k - 1), v0);
      if (k < NZ - 1 && v0 !== (at(i, j, k + 1) > 0)) quad(cell(i - 1, j - 1, k), cell(i, j - 1, k), cell(i, j, k), cell(i - 1, j, k), v0);
    }
    if (!idx.length) return null;
    // compact to the used vertices
    const used = new Int32Array(pos.length / 3).fill(-1);
    const P = [];
    for (let q = 0; q < idx.length; q++) { const v = idx[q]; if (used[v] < 0) { used[v] = P.length / 3; P.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]); } idx[q] = used[v]; }
    const nv = P.length / 3;
    const position = new Float32Array(P);
    // area-weighted normals
    const nrm = new Float32Array(nv * 3);
    for (let q = 0; q < idx.length; q += 3) {
      const a = idx[q] * 3, b = idx[q + 1] * 3, c = idx[q + 2] * 3;
      const ux = position[b] - position[a], uy = position[b + 1] - position[a + 1], uz = position[b + 2] - position[a + 2];
      const vx = position[c] - position[a], vy = position[c + 1] - position[a + 1], vz = position[c + 2] - position[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const o of [a, b, c]) { nrm[o] += nx; nrm[o + 1] += ny; nrm[o + 2] += nz; }
    }
    for (let v = 0; v < nv; v++) { const o = v * 3, l = Math.hypot(nrm[o], nrm[o + 1], nrm[o + 2]) || 1; nrm[o] /= l; nrm[o + 1] /= l; nrm[o + 2] /= l; }
    // displace walls/ceilings/depths into the rock (never floors, never into the play space)
    const n3 = this.n3;
    for (let v = 0; v < nv; v++) {
      const o = v * 3;
      const d = this.coarse(position[o], position[o + 1], position[o + 2], nrm[o + 1]);
      if (!d) continue;
      position[o] -= nrm[o] * d; position[o + 1] -= nrm[o + 1] * d; position[o + 2] -= nrm[o + 2] * d;
    }
    // colours, AO and material weights
    const L = this.look;
    const col = new Float32Array(nv * 3), mat = new Float32Array(nv * 4), code = new Float32Array(nv);
    const base = L.rock, alt = L.rock2, front = L.front;
    for (let v = 0; v < nv; v++) {
      const o = v * 3, x = position[o], y = position[o + 1], z = position[o + 2];
      const nx = nrm[o], ny = nrm[o + 1], nz = nrm[o + 2];
      // ambient occlusion: how much rock is around the point a little way out along the normal
      let occ = 0, tot = 0;
      for (const [r, wgt] of [[0.7, 1], [1.6, 0.8], [3.0, 0.6]]) {
        const px = x + nx * r, py = y + ny * r, pz = z + nz * r;
        for (const [ox, oy, oz] of [[0, 0, 0], [r * 0.6, 0, 0], [-r * 0.6, 0, 0], [0, r * 0.6, 0], [0, -r * 0.6, 0], [0, 0, r * 0.6]]) {
          if (this.density(px + ox, py + oy, pz + oz) > 0) occ += wgt; tot += wgt;
        }
      }
      const ao = Math.pow(1 - occ / tot, 1.3) * 0.82 + 0.18;
      // the tile this surface belongs to
      const tx = Math.floor(x - nx * 0.45), ty = Math.floor(y - ny * 0.45), t = this.tile(tx, ty);
      // colour: biome rock, low-frequency variation, strata by height, depth fade
      const var1 = n3(x * 0.11 + 11, y * 0.11, z * 0.11), var2 = n3(x * 0.37, y * 0.37 + 5, z * 0.37);
      const strata = 0.5 + 0.5 * Math.sin(y * 1.7 + var1 * 4.5);
      let r = base[0] + (alt[0] - base[0]) * var1, g = base[1] + (alt[1] - base[1]) * var1, b = base[2] + (alt[2] - base[2]) * var1;
      const sk = 0.86 + strata * 0.16 + (var2 - 0.5) * 0.2;
      r *= sk; g *= sk; b *= sk;
      // faces toward the camera beyond the play plane are the cut-away "front" of the mountain: a little darker
      if (z > 1.6 && nz > 0.4) { const f = Math.min(1, (z - 1.6) / 1.5) * 0.45; r += (front[0] - r) * f; g += (front[1] - g) * f; b += (front[2] - b) * f; }
      // deep back walls fade toward the fog
      const deep = Math.min(1, Math.max(0, (-z - 3) / 8));
      r *= 1 - deep * 0.35; g *= 1 - deep * 0.35; b *= 1 - deep * 0.3;
      let gold = 0, wet = L.wet || 0, glow = 0, loose = 0;
      // gold veins: near VEIN tiles; a whisper of it anywhere in the copper workings
      const near = (k, rad) => { for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) if (this.tile(tx + dx, ty + dy) === k) return 1 - (Math.abs(dx) + Math.abs(dy)) / (rad * 2 + 1); return 0; };
      if (t === T.VEIN) gold = 1; else gold = near(T.VEIN, 1) * 0.55 + (L.goldDust || 0) * (var2 > 0.8 ? 1 : 0);
      if (t === T.SOFT) { loose = 1; r = r * 0.8 + L.rubble[0] * 0.5; g = g * 0.8 + L.rubble[1] * 0.5; b = b * 0.8 + L.rubble[2] * 0.5; }
      if (t === T.HARD) { loose = 2; r *= 0.7; g *= 0.68; b *= 0.66; }
      if (t === T.FOSSIL) { r = r * 0.6 + 0.35; g = g * 0.6 + 0.31; b = b * 0.6 + 0.25; }
      if (t === T.GEMV) { const gc = L.gemTint || [0.5, 0.3, 0.7]; r = r * 0.6 + gc[0] * 0.3; g = g * 0.6 + gc[1] * 0.3; b = b * 0.6 + gc[2] * 0.3; }
      // wet near water and under drips
      const wn = near(T.WATER, 2);
      wet = Math.min(1, wet + wn * 0.9 + (ny < -0.5 ? 0.15 : 0));
      // moss on upward faces (grotto/drowned), lava-glow seams (ember), crystal glints (geode)
      let moss = 0;
      if (L.moss && ny > 0.35) moss = Math.min(1, (ny - 0.35) * 2) * (var2 > 0.35 ? 1 : 0.3) * L.moss;
      if (L.cracks) glow = (n3(x * 0.8 + 3, y * 0.8, z * 0.8) > 0.7 ? 1 : 0) * L.cracks * (z < 1.5 ? 1 : 0.4);
      if (L.mossGlow) glow = Math.max(glow, moss * L.mossGlow);
      if (t === T.HARD) glow = Math.max(glow, 0.0);
      col[o] = r * ao; col[o + 1] = g * ao; col[o + 2] = b * ao;
      const q4 = v * 4;
      mat[q4] = gold; mat[q4 + 1] = wet; mat[q4 + 2] = glow; mat[q4 + 3] = moss;
      code[v] = loose;   // 1 loose rubble, 2 a boulder that needs dynamite
    }
    let G = { position, nrm, col, mat, code, idx };
    if (this.fine) G = this.refine(G);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(G.position, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(G.nrm, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(G.col, 3));
    geo.setAttribute('aMat', new THREE.BufferAttribute(G.mat, 4));
    geo.setAttribute('aCode', new THREE.BufferAttribute(G.code, 1));
    geo.setIndex(G.position.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(G.idx, 1) : new THREE.Uint16BufferAttribute(G.idx, 1));
    geo.computeBoundingSphere(); geo.computeBoundingBox();
    return geo;
  }

  // the coarse wobble every wall gets (into the rock, never floors in the play lane)
  coarse(x, y, z, ny) {
    const up = Math.max(0, ny);
    if (up > 0.6 && Math.abs(z) < 2.2) return 0;
    const amp = (Math.abs(z) < 1.8 ? 0.14 : 0.42 * this.jag) * (1 - up * 0.7), jf = 0.9 * Math.sqrt(this.jag), n3 = this.n3;
    return (n3(x * jf, y * jf, z * jf) * 0.7 + n3(x * 2.6 * jf, y * 2.6 * jf, z * 2.6 * jf) * 0.3) * amp;
  }
  // fine sculpting: how far (m) to push a surface point into the rock, by the level's style. Pure function of the
  // world position and normal, so neighbouring chunks agree along their seams. Floors in the play lane stay flat.
  sculpt(x, y, z, nx, ny, nz) {
    const up = Math.max(0, ny), az = Math.abs(z);
    if (up > 0.6 && az < 2.2) return 0;
    const n3 = this.n3, wall = 1 - sstep(0.45, 0.8, Math.abs(ny));
    let d = (n3(x * 4.2 + 3, y * 4.2, z * 4.2) - 0.5) * 0.1 + (n3(x * 9.5, y * 9.5 + 7, z * 9.5) - 0.5) * 0.04;
    switch (this.style) {
      case 'strata': {
        // sedimentary layers: grooves along the bedding planes, each bed standing out a little differently
        const t = y * 2.3 + (n3(x * 0.22 + 5, y * 0.22, z * 0.22) - 0.5) * 2.4, f = t - Math.floor(t);
        const groove = 1 - sstep(0.0, 0.16, f) * (1 - sstep(0.8, 1.0, f));
        d += (groove * 0.13 + (hashK(Math.floor(t), 9) - 0.5) * 0.1) * wall;
        break;
      }
      case 'flow': {
        // flowstone: vertical flutes on walls and roofs, as if poured
        const r = Math.pow(0.5 + 0.5 * Math.sin(x * 6.3 + z * 4.7 + (n3(x * 0.4, y * 0.12, z * 0.4) - 0.5) * 8), 3);
        d += r * 0.13 * (1 - sstep(0.2, 0.7, ny));
        break;
      }
      case 'columns': {
        // columnar jointing: vertical columns with grooves between them and stepped faces
        const u = Math.abs(nz) >= Math.abs(nx) ? x : z, c = u * 1.4 + (n3(x * 0.1, 0, z * 0.1) - 0.5) * 0.6, cf = c - Math.floor(c);
        const groove = 1 - sstep(0.0, 0.13, Math.min(cf, 1 - cf));
        d += (groove * 0.16 + (hashK(Math.floor(c), 4) - 0.5) * 0.14) * wall;
        break;
      }
      case 'facet': {
        // crystalline: sharp creases where the rock fractured into planes
        const f = n3(x * 1.2 + 2, y * 1.2, z * 1.2) * 4.2, g = n3(x * 2.7, y * 2.7 + 3, z * 2.7) * 3.1;
        d += (Math.abs(f - Math.floor(f) - 0.5) * 0.2 + Math.abs(g - Math.floor(g) - 0.5) * 0.08) * (1 - up * 0.6);
        break;
      }
      default: {
        // scallops: dish-shaped hollows dissolved by old water
        const px = (x + z * 0.6) * 2.1, py = y * 2.1, cx = Math.floor(px), cy = Math.floor(py);
        let f1 = 9;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          const ox = cx + i + 0.15 + hashK(cx + i + (cy + j) * 7919, 1) * 0.7, oy = cy + j + 0.15 + hashK(cx + i + (cy + j) * 7919, 2) * 0.7;
          f1 = Math.min(f1, Math.hypot(px - ox, (py - oy) * 1.3));
        }
        d += sstep(0.62, 0.05, f1) * 0.11 * (1 - up * 0.7);
      }
    }
    return d * 1.35 * (az < 1.8 ? 0.35 : 1) * (1 - up * 0.6);
  }
  // split every triangle in four (shared edge midpoints, attributes interpolated), sculpt, and relight the normals
  refine(G) {
    const { position, nrm, col, mat, code, idx } = G;
    const nv = position.length / 3;
    const mid = new Map();
    const P = Array.from(position), N = Array.from(nrm), C = Array.from(col), A = Array.from(mat), K = Array.from(code);
    const midpoint = (a, b) => {
      const key = a < b ? a * 4194304 + b : b * 4194304 + a;
      let m = mid.get(key);
      if (m !== undefined) return m;
      m = P.length / 3;
      for (let k = 0; k < 3; k++) { P.push((P[a * 3 + k] + P[b * 3 + k]) * 0.5); N.push(N[a * 3 + k] + N[b * 3 + k]); C.push((C[a * 3 + k] + C[b * 3 + k]) * 0.5); }
      for (let k = 0; k < 4; k++) A.push((A[a * 4 + k] + A[b * 4 + k]) * 0.5);
      K.push((K[a] + K[b]) * 0.5);
      mid.set(key, m);
      return m;
    };
    const I = [];
    for (let q = 0; q < idx.length; q += 3) {
      const a = idx[q], b = idx[q + 1], c = idx[q + 2];
      const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
      I.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
    }
    const n = P.length / 3;
    const pos = new Float32Array(P), nr = new Float32Array(N);
    for (let v = 0; v < n; v++) {
      const o = v * 3, l = Math.hypot(nr[o], nr[o + 1], nr[o + 2]) || 1;
      const nx = nr[o] / l, ny = nr[o + 1] / l, nz = nr[o + 2] / l;
      const d = this.sculpt(pos[o], pos[o + 1], pos[o + 2], nx, ny, nz);
      pos[o] -= nx * d; pos[o + 1] -= ny * d; pos[o + 2] -= nz * d;
    }
    // normals again, from the sculpted surface
    const nn = new Float32Array(n * 3);
    for (let q = 0; q < I.length; q += 3) {
      const a = I[q] * 3, b = I[q + 1] * 3, c = I[q + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      const x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx;
      nn[a] += x; nn[a + 1] += y; nn[a + 2] += z; nn[b] += x; nn[b + 1] += y; nn[b + 2] += z; nn[c] += x; nn[c + 1] += y; nn[c + 2] += z;
    }
    // blend with the coarse normal so chunk seams (where a vertex only sees one side's faces) stay soft
    for (let v = 0; v < n; v++) {
      const o = v * 3, l = Math.hypot(nn[o], nn[o + 1], nn[o + 2]) || 1, lc = Math.hypot(nr[o], nr[o + 1], nr[o + 2]) || 1;
      let x = nn[o] / l * 0.8 + nr[o] / lc * 0.2, y = nn[o + 1] / l * 0.8 + nr[o + 1] / lc * 0.2, z = nn[o + 2] / l * 0.8 + nr[o + 2] / lc * 0.2;
      const k = Math.hypot(x, y, z) || 1; nn[o] = x / k; nn[o + 1] = y / k; nn[o + 2] = z / k;
    }
    return { position: pos, nrm: nn, col: new Float32Array(C), mat: new Float32Array(A), code: new Float32Array(K), idx: I };
  }
  // where the rock surface really is in front of (x, y): back = the back wall of an open cell, else the cut face
  // (both faces look toward the camera: +z normal)
  // March the density field from in front of the wall back to where the rock starts (the walls carry a 3D wobble
  // of up to a metre on top of zb/zf), then add the same displacement the mesh gets.
  surfaceZ(x, y, back) {
    const z0 = back ? this.col(this.zb, x, y) : this.col(this.zf, x, y);
    let a = Math.min(Z1 - 0.1, z0 + 1.8), b = a, hit = false;
    for (let k = 0; k < 40; k++) { b = a - 0.15; if (this.density(x, y, b) > 0) { hit = true; break; } a = b; }
    if (!hit) return z0;
    for (let k = 0; k < 7; k++) { const m = (a + b) / 2; if (this.density(x, y, m) > 0) b = m; else a = m; }
    const zs = (a + b) / 2;
    let d = this.coarse(x, y, zs, 0);
    if (this.fine) d += this.sculpt(x, y, zs - d, 0, 0, 1);
    return zs - d;
  }
}

// ------------------------------------------------------------------ the rock material (triplanar detail)
export function rockMaterial(tex, look) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.0 });
  const U = {
    tAlb: { value: tex.alb }, tNrm: { value: tex.nrm }, uScale: { value: 0.32 }, uBump: { value: 1.25 }, uTime: { value: 0 },
    uGold: { value: new THREE.Color(1.0, 0.68, 0.22) }, uGlow: { value: new THREE.Color().fromArray(look.glow || [1, 0.4, 0.1]) },
    uMoss: { value: new THREE.Color().fromArray(look.mossCol || [0.1, 0.3, 0.2]) }, uRubble: { value: new THREE.Color().fromArray(look.rubble || [0.5, 0.45, 0.4]) }, uCaus: { value: new THREE.Color(0, 0, 0) }, uSpark: { value: new THREE.Color(0, 0, 0) }, uStrata: { value: 0 }, uLampP: { value: new THREE.Vector3(0, -999, 0) },
    uCrust: { value: new THREE.Color(1, 1, 1) }, uCrustA: { value: 0 }, uStain: { value: new THREE.Color(0, 0, 0) }, uStainA: { value: 0 }, uRoughK: { value: 1 },
  };
  mat.userData.U = U;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aMat; attribute float aCode; varying vec4 vMat; varying float vCode; varying vec3 vWPos; varying vec3 vWNrm;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMat = aMat; vCode = aCode; vWPos = (modelMatrix * vec4(position, 1.0)).xyz; vWNrm = normalize(mat3(modelMatrix) * normal);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform sampler2D tAlb; uniform sampler2D tNrm; uniform float uScale; uniform float uBump; uniform float uTime;
uniform vec3 uGold; uniform vec3 uGlow; uniform vec3 uMoss; uniform vec3 uRubble; uniform vec3 uCaus; uniform vec3 uSpark; uniform vec3 uLampP; uniform float uStrata;
uniform vec3 uCrust; uniform float uCrustA; uniform vec3 uStain; uniform float uStainA; uniform float uRoughK;
// light thrown off moving water: thin bright ripple lines
float caustic(vec2 p, float t) {
  vec2 i = p; float c = 1.0;
  for (int n = 0; n < 3; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / max(0.001, length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005))));
  }
  c /= 3.0; c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}
varying vec4 vMat; varying float vCode; varying vec3 vWPos; varying vec3 vWNrm;
float h13(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
// jittered round stones in a plane: x = distance / radius (< 1 inside), y = the stone's random id, zw = direction from its centre
vec4 stoneCells(vec2 p) {
  vec2 c = floor(p), f = fract(p);
  float best = 9.0, id = 0.0; vec2 dir = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    float h = h13(vec3(c + g, 7.0));
    vec2 o = vec2(h, h13(vec3(c + g, 13.0))) * 0.7 + 0.15;
    float hr = h13(vec3(c + g, 21.0));
    float r = hr < 0.4 ? 0.001 : 0.1 + 0.42 * (hr - 0.4) / 0.6;   // many cells hold no stone at all
    vec2 dv = (f - g - o) / r * vec2(1.0, 1.0 + 0.5 * h);
    float d = length(dv);
    if (d < best) { best = d; id = h; dir = dv; }
  }
  return vec4(best, id, dir);
}
vec3 gTW; vec4 gAlb; vec3 gNW;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
{
  vec3 N = normalize(vWNrm);
  vec3 w = pow(abs(N), vec3(4.0)); w /= (w.x + w.y + w.z);
  vec2 uvX = vWPos.zy * uScale, uvY = vWPos.xz * uScale, uvZ = vWPos.xy * uScale;
  // a second, larger scale breaks up the tiling
  vec4 aX = texture2D(tAlb, uvX), aY = texture2D(tAlb, uvY), aZ = texture2D(tAlb, uvZ);
  vec4 bZ = texture2D(tAlb, uvZ * 0.27 + 0.31);
  gAlb = aX * w.x + aY * w.y + aZ * w.z;
  gAlb.rgb *= mix(0.85, 1.15, bZ.g);
  // a finer grain on top, so the rock stays crisp close up
  float fa = texture2D(tAlb, uvX * 2.9 + 0.13).r * w.x + texture2D(tAlb, uvY * 2.9 + 0.29).r * w.y + texture2D(tAlb, uvZ * 2.9 + 0.53).r * w.z;
  gAlb.rgb *= mix(0.84, 1.16, fa);
  vec3 tX = texture2D(tNrm, uvX).xyz * 2.0 - 1.0, tY = texture2D(tNrm, uvY).xyz * 2.0 - 1.0, tZ = texture2D(tNrm, uvZ).xyz * 2.0 - 1.0;
  tX.xy *= uBump; tY.xy *= uBump; tZ.xy *= uBump;
  vec3 fX = texture2D(tNrm, uvX * 3.3 + 0.21).xyz * 2.0 - 1.0, fY = texture2D(tNrm, uvY * 3.3 + 0.47).xyz * 2.0 - 1.0, fZ = texture2D(tNrm, uvZ * 3.3 + 0.73).xyz * 2.0 - 1.0;
  tX.xy += fX.xy * uBump * 0.6; tY.xy += fY.xy * uBump * 0.6; tZ.xy += fZ.xy * uBump * 0.6;
  // whiteout blend into world space
  tX = vec3(tX.xy + N.zy, abs(tX.z) * N.x);
  tY = vec3(tY.xy + N.xz, abs(tY.z) * N.y);
  tZ = vec3(tZ.xy + N.xy, abs(tZ.z) * N.z);
  gNW = normalize(tX.zyx * w.x + tY.xzy * w.y + tZ.xyz * w.z);
  float wet = vMat.y;
  float moss = vMat.w;
  float code = vCode;
  vec3 c = diffuseColor.rgb * gAlb.rgb * 1.55;
  c = mix(c, uMoss * (0.6 + gAlb.g * 0.6), moss * smoothstep(0.3, 0.6, gAlb.g + moss * 0.3));
  c *= 1.0 - smoothstep(1.5, 1.9, code) * 0.25 * (1.0 - smoothstep(0.2, 0.6, gAlb.g));
  c *= 1.0 - wet * 0.35;
  // sediment: soft horizontal bands that wander a little, lighter and darker layers of stone
  float sb = sin(vWPos.y * 1.6 + gAlb.r * 2.2 + sin(vWPos.x * 0.13 + vWPos.z * 0.2) * 1.8) * 0.6 + sin(vWPos.y * 4.3 + gAlb.g * 3.0 + sin(vWPos.x * 0.31) * 1.2) * 0.4;
  c *= 1.0 + sb * 0.14 * uStrata * (1.0 - moss);
  // the cut face of the mountain shows stones bedded in its layers; floors are gravelly; walls carry fine cracks
  float frF = smoothstep(0.35, 0.7, N.z) * smoothstep(1.0, 1.6, vWPos.z);
  float flF = smoothstep(0.6, 0.9, N.y) * (1.0 - frF) * (1.0 - moss * 0.7);
  if (frF > 0.01) {
    vec4 st = stoneCells(vWPos.xy * 1.7 + vec2(0.0, sin(vWPos.x * 0.37) * 0.6));
    vec4 s2 = stoneCells(vWPos.xy * 4.3 + 17.0);
    if (s2.x < st.x * 1.6 && st.x > 1.0) st = s2;
    float inside = smoothstep(1.0, 0.82, st.x), rim = smoothstep(0.72, 0.98, st.x) * smoothstep(1.2, 1.0, st.x);
    c = mix(c, c * (0.75 + st.y * 0.6), inside * frF);
    c *= 1.0 - rim * 0.4 * frF;
    c *= 1.0 + sb * 0.2 * frF;
    gNW = normalize(gNW + vec3(st.z, st.w, 0.0) * inside * 0.9 * frF);
  }
  if (flF > 0.01) {
    vec4 st = stoneCells(vWPos.xz * 3.6);
    float inside = smoothstep(1.0, 0.8, st.x), rim = smoothstep(0.72, 0.98, st.x) * smoothstep(1.2, 1.0, st.x);
    c = mix(c, c * (0.78 + st.y * 0.55), inside * flF * 0.85);
    c *= 1.0 - rim * 0.38 * flF;
    gNW = normalize(gNW + vec3(st.z, 0.0, st.w) * inside * 0.7 * flF);
  }
  {
    float sideW = (1.0 - smoothstep(0.5, 0.85, abs(N.y))) * (1.0 - frF);
    float ck = texture2D(tAlb, vec2(vWPos.x * 0.21 + vWPos.z * 0.17, vWPos.y * 0.19) + 0.61).b;
    c *= 1.0 - smoothstep(0.03, 0.0, abs(ck - 0.5)) * sideW * 0.5;
  }
  // mineral stains washed down the walls (rust, verdigris, salt, sulfur): long vertical streaks
  if (uStainA > 0.0) {
    float side = 1.0 - smoothstep(0.3, 0.8, abs(N.y));
    float sn = texture2D(tAlb, vec2(vWPos.x * 0.47 + vWPos.z * 0.31, vWPos.y * 0.028)).r;
    float sm = texture2D(tAlb, vec2(vWPos.x * 0.11 + 0.5 + vWPos.z * 0.07, vWPos.y * 0.045)).g;
    float st = smoothstep(0.53, 0.68, sn + (sm - 0.5) * 0.6) * side * uStainA;
    c = mix(c, uStain * (0.65 + 0.6 * gAlb.g), st * (1.0 - moss));
  }
  // a crust settled on every ledge (salt, frost, sulfur bloom, copper patina)
  if (uCrustA > 0.0) {
    float upf = smoothstep(0.2, 0.75, N.y);
    float cn = texture2D(tAlb, vWPos.xz * 0.19 + 0.37).g;
    float cr = smoothstep(0.35, 0.7, upf * (0.75 + cn * 0.6)) * uCrustA;
    c = mix(c, uCrust * (0.78 + 0.32 * gAlb.g), cr);
  }
  diffuseColor.rgb = c;
}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(gNW, 0.0)).xyz);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = clamp(mix(0.97, 0.5, 1.0 - gAlb.a) , 0.3, 1.0);
roughnessFactor = mix(roughnessFactor, 0.16, vMat.y) * uRoughK;`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
{
  // gold: veins that wander through the rock and bright flecks in them
  float g = vMat.x;
  if (g > 0.01) {
    vec3 p = vWPos * 2.3;
    float vein = smoothstep(0.62, 0.8, 1.0 - abs(sin(p.x * 1.1 + p.y * 1.7 + gAlb.r * 6.0 + sin(p.z * 1.3) * 2.0)));
    float fleck = step(0.86, h13(floor(vWPos * 22.0)));
    float m = clamp(g * (vein * 0.85 + fleck * 0.9), 0.0, 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, uGold * (0.55 + 0.45 * gAlb.g), m);
    metalnessFactor = mix(metalnessFactor, 0.7, m);   // fully metallic flecks read black: there is no environment to reflect
    roughnessFactor = mix(roughnessFactor, 0.24, m);
  }
}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  float gl = vMat.z;
  if (gl > 0.01) {
    float pat = smoothstep(0.42, 0.18, gAlb.a) * (0.6 + 0.4 * sin(uTime * 1.3 + vWPos.x * 0.7 + vWPos.y * 0.9));
    totalEmissiveRadiance += uGlow * gl * pat * 2.2;
  }
  float code = vCode;
  // wet rock near water catches rippling light
  float wt = vMat.y;
  if (wt > 0.05 && uCaus.r + uCaus.g + uCaus.b > 0.001) {
    float ca = caustic(vWPos.xy * 0.9 - 250.0 + vWPos.z * 0.3, uTime * 0.55);
    float patchy = smoothstep(0.25, 0.95, (0.5 + 0.5 * sin(vWPos.x * 0.23 + 1.3 + sin(vWPos.y * 0.11)) * sin(vWPos.y * 0.29 + uTime * 0.07)) * (0.6 + 0.4 * gAlb.g));
    totalEmissiveRadiance += uCaus * ca * smoothstep(0.05, 0.6, wt) * patchy * smoothstep(0.4, -0.6, vWPos.z);
  }
  // mineral flecks that glitter as the lamp passes over them
  float lampNear = smoothstep(9.0, 2.5, distance(vWPos, uLampP)) * smoothstep(0.5, -0.3, vWPos.z);
  if (lampNear > 0.0 && uSpark.r + uSpark.g + uSpark.b > 0.001) {
    vec3 sc = vWPos * 24.0;
    float hh = h13(floor(sc));
    if (hh > 0.93) {
      float d = 1.0 - smoothstep(0.06, 0.28, length(fract(sc) - 0.5));
      float tw = pow(0.5 + 0.5 * sin(uTime * (1.2 + hh * 30.0) + hh * 600.0 + vViewPosition.x * 1.7 + vViewPosition.y * 1.3), 6.0);
      totalEmissiveRadiance += uSpark * d * tw * lampNear * 7.0;
    }
  }
  // gold flecks in a vein twinkle under the lamp
  if (vMat.x > 0.01 && lampNear > 0.0) {
    vec3 gc = vWPos * 22.0;
    float gh = h13(floor(gc));
    if (gh > 0.86) {
      float gd = 1.0 - smoothstep(0.1, 0.4, length(fract(gc) - 0.5));
      float gt = pow(0.5 + 0.5 * sin(uTime * (2.0 + gh * 9.0) + gh * 300.0 + vViewPosition.x * 2.1), 8.0);
      totalEmissiveRadiance += uGold * gd * gt * lampNear * vMat.x * 3.5;
    }
  }
  // a boulder that needs dynamite shows hot little cracks; loose rubble catches the light a touch
  if (code > 1.5) { float cr = smoothstep(0.86, 0.97, 1.0 - abs(sin(vWPos.x * 3.1 + vWPos.y * 2.3 + gAlb.r * 9.0))); totalEmissiveRadiance += vec3(1.0, 0.3, 0.05) * cr * smoothstep(1.5, 1.9, code) * (0.6 + 0.4 * sin(uTime * 2.4)) * 0.38; }
}`);
  };
  mat.customProgramCacheKey = () => 'gd-rock-9';
  return mat;
}
