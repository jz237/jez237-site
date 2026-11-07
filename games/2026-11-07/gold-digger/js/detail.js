// Detail: the small stuff that makes a cave read as real, baked into a handful of meshes per level.
//  - rock: pebbles, rubble piles, boulders against the back walls, ledges on the walls, little stalactites and
//    stalagmites, all drawn with the cave's OWN rock material (same shader program, so crusts, stains, moss, wet
//    and the lamp glitter all carry over and nothing new compiles);
//  - clutter: dozens of small props suited to the level's set (models.js), baked like decor.js does;
//  - growth: hanging strands (moss, rootlets, weed) from the roofs.
// Everything sits on or hangs from plain ROCK, which nothing in the game can break, so no detail is ever left
// floating when a wall is dug or blasted away. Presentation only: the sim never sees any of it.
import * as THREE from '../vendor/three.module.min.js';
import { mergeVertices } from '../vendor/BufferGeometryUtils.js';
import { T } from './config.js?v=15';
import { bake } from './decor.js?v=15';

function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (x, y, z) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a, b, t) => a + (b - a) * t;
  return l(l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
    l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v), w);
}

// ------------------------------------------------------------------ rock prototypes (built once)
// noisy lumps at three detail levels with a flattened base, and drip cones hanging down / standing up
let PROTO = null;
function protos() {
  if (PROTO) return PROTO;
  const pack = (g) => { g.computeVertexNormals(); const q = g.toNonIndexed(); return { pos: q.attributes.position.array, nrm: q.attributes.normal.array }; };
  const lump = (detail, seed, amp) => {
    const g = mergeVertices(new THREE.IcosahedronGeometry(1, detail).deleteAttribute('uv').deleteAttribute('normal'));
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      const k = 1 + ((vnoise(v.x * 1.6 + seed * 7.1, v.y * 1.6, v.z * 1.6) - 0.5) * 2 * amp + (vnoise(v.x * 4 + seed, v.y * 4, v.z * 4 + seed) - 0.5) * amp * 0.5);
      v.multiplyScalar(k);
      if (v.y < -0.35) v.y = -0.35 + (v.y + 0.35) * 0.25;   // a flat base so it sits
      p.setXYZ(i, v.x, v.y, v.z);
    }
    return pack(g);
  };
  const cone = (seed, up) => {
    const pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(Math.max(0.0, (0.5 * Math.pow(1 - t, 1.6) + 0.03 * (1 - t)) * (1 + (hash(i, seed, 3) - 0.5) * 0.3)), up ? t : -t)); }
    if (!up) pts.reverse();
    const g = mergeVertices(new THREE.LatheGeometry(pts, 9).deleteAttribute('uv').deleteAttribute('normal'));
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + (vnoise(v.x * 6 + seed, v.y * 3, v.z * 6) - 0.5) * 0.35; p.setXYZ(i, v.x * k, v.y, v.z * k); }
    return pack(g);
  };
  PROTO = {
    peb: [0, 1, 2].map((s) => lump(0, s + 1, 0.25)),
    lump: [0, 1, 2, 3].map((s) => lump(1, s + 11, 0.3)),
    big: [0, 1].map((s) => lump(2, s + 21, 0.32)),
    drip: [0, 1].map((s) => cone(s + 31, false)),
    mite: [0, 1].map((s) => cone(s + 41, true)),
  };
  return PROTO;
}

// a batch of rock pieces in world space with the attributes the cave's rock shader reads
class RockBatch {
  constructor(L) { this.L = L; this.pos = []; this.nrm = []; this.col = []; this.mat = []; this.code = []; }
  add(pr, m, c, o = {}) {
    const L = this.L, P = pr.pos, N = pr.nrm, n = P.length / 3;
    const nm = new THREE.Matrix3().getNormalMatrix(m), v = new THREE.Vector3(), nn = new THREE.Vector3();
    const wet = Math.min(1, (L.wet || 0) + (o.wet || 0)), moss = L.moss || 0, glow = o.glow || 0, gold = o.gold || 0, dark = o.dark ?? 1;
    for (let i = 0; i < n; i++) {
      v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(m);
      nn.set(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]).applyMatrix3(nm).normalize();
      const sh = (0.4 + 0.6 * Math.min(1, Math.max(0, nn.y * 0.5 + 0.55))) * dark;
      this.pos.push(v.x, v.y, v.z); this.nrm.push(nn.x, nn.y, nn.z);
      this.col.push(c[0] * sh, c[1] * sh, c[2] * sh);
      this.mat.push(gold, wet, glow, moss && nn.y > 0.35 ? Math.min(1, (nn.y - 0.35) * 2) * moss : 0);
      this.code.push(0);
    }
  }
  mesh(mat, shadow) {
    if (!this.pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.mat, 4));
    g.setAttribute('aCode', new THREE.Float32BufferAttribute(this.code, 1));
    g.computeBoundingSphere();
    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = shadow; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
    return mesh;
  }
}

// ------------------------------------------------------------------ what each level's set scatters
// [model, args(r), count, scale min, scale max, where]  where: 'back' (behind the play lane), 'any', 'lean' (against the back wall)
const CRYS = (cols) => (r) => [1, cols[Math.floor(r * cols.length)]];
const CLUTTER = {
  workings: [['crate', (r) => [Math.floor(r * 3)], 10, 0.9, 1.15, 'back'], ['barrel', () => [0], 6, 0.9, 1.1, 'back'], ['sack', (r) => [Math.floor(r * 2)], 8, 0.9, 1.2, 'back'], ['planks', () => [], 4, 0.9, 1.1, 'back'],
    ['bucket', () => [], 6, 0.9, 1.2, 'any'], ['shovel', () => [], 5, 1, 1, 'lean'], ['ropeCoil', () => [], 5, 0.9, 1.1, 'any'], ['oreHeap', () => [0xe6b24c], 8, 0.9, 1.4, 'any'], ['bones', (r) => [Math.floor(r * 3)], 2, 1, 1, 'any']],
  rust: [['barrel', () => [1], 10, 0.9, 1.1, 'back'], ['crate', (r) => [Math.floor(r * 3)], 5, 0.9, 1.1, 'back'], ['gear', () => [], 7, 0.7, 1.2, 'lean'], ['bucket', () => [], 5, 0.9, 1.2, 'any'],
    ['oreHeap', () => [0xc8703a], 7, 0.9, 1.4, 'any'], ['shovel', () => [], 3, 1, 1, 'lean'], ['bones', (r) => [Math.floor(r * 3)], 3, 1, 1, 'any']],
  patina: [['oreHeap', () => [0x3fbf8a], 9, 0.9, 1.5, 'any'], ['crystal', CRYS([0x2fbf8a, 0x2f6fd0, 0x48d6b0]), 14, 0.18, 0.4, 'any'], ['minicaps', () => [0x60ffc0, 0x2a4a40], 8, 0.8, 1.3, 'any'],
    ['bucket', () => [], 4, 0.9, 1.2, 'any'], ['crate', (r) => [Math.floor(r * 3)], 4, 0.9, 1.1, 'back'], ['planks', () => [], 3, 0.9, 1.1, 'back']],
  garden: [['minicaps', () => [0x40fff0, 0x3a6f78], 22, 0.8, 1.5, 'any'], ['fern', () => [0x2f5a3a], 18, 0.7, 1.3, 'any'], ['mushroom', (r) => [0.3 + r * 0.25], 8, 1, 1, 'any']],
  bluecap: [['minicaps', () => [0x6a9cff, 0x1e2c66], 24, 0.8, 1.5, 'any'], ['fern', () => [0x2a3a5a], 10, 0.7, 1.2, 'any'], ['tallcap', (r) => [0.3 + r * 0.2], 8, 1, 1, 'any']],
  roots: [['fern', () => [0x4a6a2a], 24, 0.7, 1.4, 'any'], ['minicaps', () => [0xffb040, 0x6a4020], 14, 0.8, 1.4, 'any'], ['bones', (r) => [Math.floor(r * 3)], 3, 1, 1, 'any']],
  amethyst: [['crystal', CRYS([0x9a5cff, 0xd9c8ff, 0xff7ad0, 0x7fd2ff]), 34, 0.15, 0.45, 'any']],
  frost: [['crystal', CRYS([0xcfeeff, 0xffffff, 0x9fd8ff]), 34, 0.15, 0.45, 'any']],
  rose: [['crystal', CRYS([0xff8fb0, 0xffc24a, 0xffd6e0]), 30, 0.15, 0.45, 'any'], ['oreHeap', () => [0xff9ac0], 5, 0.9, 1.3, 'any']],
  streets: [['urn', (r) => [Math.floor(r * 3)], 10, 0.8, 1.3, 'any'], ['block', (r) => [Math.floor(r * 3)], 10, 0.7, 1.3, 'back'], ['drum', () => [], 5, 0.8, 1.1, 'back'], ['shells', (r) => [Math.floor(r * 3)], 5, 1, 1.3, 'any'], ['bones', (r) => [Math.floor(r * 3)], 3, 1, 1, 'any']],
  salt: [['saltCubes', (r) => [1 + Math.floor(r * 5)], 18, 0.35, 0.7, 'any'], ['block', (r) => [Math.floor(r * 3)], 8, 0.7, 1.2, 'back'], ['urn', (r) => [Math.floor(r * 3)], 5, 0.8, 1.2, 'any'], ['drum', () => [], 3, 0.8, 1.1, 'back']],
  tide: [['shells', (r) => [Math.floor(r * 3)], 14, 1, 1.4, 'any'], ['anemone', () => [0x40f0d0], 10, 0.9, 1.6, 'any'], ['anemone', () => [0xff70c0], 6, 0.9, 1.4, 'any'], ['urn', (r) => [Math.floor(r * 3)], 4, 0.8, 1.2, 'any']],
  basalt: [['coal', (r) => [Math.floor(r * 3)], 14, 0.7, 1.4, 'any'], ['crystal', CRYS([0x3a1d2a, 0x2a1a1a]), 10, 0.2, 0.45, 'any'], ['bones', (r) => [Math.floor(r * 3)], 2, 1, 1, 'any']],
  obsidian: [['crystal', CRYS([0x3a1d4a, 0x251530, 0x5a1a40]), 26, 0.2, 0.55, 'any'], ['coal', (r) => [Math.floor(r * 3)], 8, 0.7, 1.3, 'any']],
  sulfur: [['crystal', CRYS([0xffd23a, 0xe8b020]), 22, 0.15, 0.4, 'any'], ['coal', (r) => [Math.floor(r * 3)], 6, 0.7, 1.2, 'any'], ['bones', (r) => [Math.floor(r * 3)], 2, 1, 1, 'any']],
};
// hanging strands: colour, glowing tip colour (0 = none), how many per roof cell
const GROWTH = {
  garden: [0x3a5a2a, 0x40fff0, 0.5], bluecap: [0x2a3a6a, 0x6a9cff, 0.45], roots: [0x6a4a30, 0, 0.6], tide: [0x2a4a3a, 0x40f0d0, 0.55],
  streets: [0x3a4a2a, 0, 0.3], patina: [0x2a4a3a, 0, 0.25],
};
const SETS = ['workings', 'garden', 'amethyst', 'streets', 'basalt'];

export function buildDetail(M, look, W, K) {
  const { make, obj, q, cave, rockMat } = K;
  const dens = q.decor;
  const R = rng((M.seed * 131 + M.depth * 17 + M.level * 7 + 5) >>> 0);
  const P = protos();
  const set = look.set || SETS[M.biome % 5];
  const at = (x, y) => (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x];
  const rock = (x, y) => at(x, y) === T.ROCK;
  const air = (x, y) => at(x, y) === T.AIR;
  const zb = (x, y) => cave.col(cave.zb, x, y), zf = (x, y) => cave.col(cave.zf, x, y);
  const keep = [[M.start.x, M.start.y]].concat(M.exit ? [[M.exit.x, M.exit.y]] : []).concat((M.camps || []).map((c) => [c.x, c.y]));
  const clear = (x, y, d) => !keep.some(([kx, ky]) => Math.abs(kx - x) < d && Math.abs(ky - y) < d);
  const floors = [], ceils = [], opens = [];
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) {
    if (!air(x, y)) continue;
    opens.push([x, y]);
    if (rock(x, y - 1)) floors.push([x, y]);
    if (rock(x, y + 1)) ceils.push([x, y]);
  }
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rockCol = (rub = 0) => { const c = mix(look.rock, look.rock2, R()); const k = 0.85 + R() * 0.3; return mix(c, look.rubble, rub).map((v) => v * k); };
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), eu = new THREE.Euler(), pv = new THREE.Vector3(), sv = new THREE.Vector3();
  const place = (batch, pr, x, y, z, sx, sy, sz, ry = R() * 6.28, rx = 0, rz = 0, c = rockCol(), o) => {
    m4.compose(pv.set(x, y, z), qt.setFromEuler(eu.set(rx, ry, rz)), sv.set(sx, sy, sz));
    batch.add(pr, m4, c, o);
  };
  const pick = (a) => a[Math.floor(R() * a.length)];
  const small = new RockBatch(look), large = new RockBatch(look);
  const cracks = look.cracks || 0;
  const ember = () => (cracks && R() < 0.25 ? cracks * 0.8 : 0);
  // backZ: a spot on the floor behind the play lane, in front of the back wall (null if the wall is too close)
  const backZ = (x, y, r) => { const w = zb(x, y + 0.5); const lo = w + r * 0.6, hi = -0.55 - r; return lo < hi ? lo + R() * (hi - lo) : null; };
  const frontZ = (x, y, r) => { const f = zf(x, y + 0.5); const lo = 0.6 + r, hi = Math.min(1.9, f - 0.4 - r); return lo < hi ? lo + R() * (hi - lo) : null; };

  // ---- pebbles and stones on every rock floor (the tiniest may lie in the play lane)
  for (const [cx, cy] of floors) {
    const n = Math.floor((2 + R() * 5) * dens);
    for (let k = 0; k < n; k++) {
      const s = 0.03 + Math.pow(R(), 2.0) * 0.2, x = cx + R();
      let z;
      if (s < 0.06 && R() < 0.35) z = (R() - 0.5) * 0.7;
      else z = R() < 0.6 ? backZ(x, cy, s) : frontZ(x, cy, s);
      if (z === null) continue;
      const sy = s * (0.5 + R() * 0.35);
      place(small, pick(s < 0.07 ? P.peb : P.lump), x, cy + sy * 0.3, z, s * (0.8 + R() * 0.5), sy, s * (0.8 + R() * 0.5), undefined, 0, 0, rockCol(0.45), { glow: ember() });
    }
  }
  // ---- rubble piles: little heaps of broken rock, back and front
  const nPiles = Math.round(floors.length / 6 * dens);
  for (let i = 0; i < nPiles; i++) {
    const [cx, cy] = pick(floors);
    if (!clear(cx, cy, 2.5)) continue;
    const front = R() < 0.3, x0 = cx + R(), z0 = front ? frontZ(x0, cy, 0.4) : backZ(x0, cy, 0.4);
    if (z0 === null) continue;
    const n = 5 + Math.floor(R() * 6);
    for (let k = 0; k < n; k++) {
      const a = R() * 6.28, d = R() * 0.45, s = 0.07 + R() * 0.17;
      place(small, pick(P.lump), x0 + Math.cos(a) * d * 1.4, cy + s * 0.25 + (0.45 - d) * 0.35, z0 + Math.sin(a) * d * 0.6, s * (0.9 + R() * 0.4), s * (0.6 + R() * 0.3), s, undefined, R() * 0.4, R() * 0.4, rockCol(0.6), { glow: ember() });
    }
  }
  // ---- boulders resting against the back walls
  for (const [cx, cy] of floors) {
    if (R() > 0.2 * dens) continue;
    const r = 0.28 + Math.pow(R(), 1.5) * 0.7, x = cx + R(), w = zb(x, cy + 0.6);
    const z = w + r * 0.45;
    if (z + r * 0.95 > -0.55) continue;
    place(large, pick(r > 0.55 ? P.big : P.lump), x, cy + r * 0.25, z, r * (1 + R() * 0.6), r * (0.6 + R() * 0.45), r * (0.8 + R() * 0.3), undefined, 0, 0, rockCol(0.15), { glow: ember(), gold: set === 'workings' && R() < 0.08 ? 0.5 : 0 });
  }
  // ---- a few big stones in the foreground, low enough never to hide the digger
  for (const [cx, cy] of floors) {
    if (R() > 0.08 * dens || !clear(cx, cy, 3)) continue;
    const r = 0.22 + R() * 0.3, x = cx + R(), z = frontZ(x, cy, r);
    if (z === null) continue;
    place(large, pick(P.lump), x, cy + r * 0.2, z, r * (1.1 + R() * 0.6), r * (0.5 + R() * 0.3), r, undefined, 0, 0, rockCol(0.1), { glow: ember() });
  }
  // ---- outcrops: chunks of rock standing out of the back walls, set deep enough to look grown in
  const nOut = Math.round(opens.length * 0.09 * dens);
  for (let i = 0; i < nOut; i++) {
    const [cx, cy] = pick(opens);
    // only where the room meets its floor or roof: an outcrop in mid-wall or by a side wall reads as a floating lump
    let edge = false; for (const dy of [-1, 1]) for (let dx = -1; dx <= 1; dx++) if (rock(cx + dx, cy + dy)) edge = true;
    if (!edge) continue;
    const x = cx + R(), y = cy + R(), w = zb(x, y);
    if (w > -1.45) continue;
    const r = 0.25 + Math.pow(R(), 1.3) * 0.7;
    place(large, pick(r > 0.5 ? P.big : P.lump), x, y, w - r * 0.4, r * (0.8 + R() * 0.8), r * (0.5 + R() * 0.5), r * (0.7 + R() * 0.3), R() * 6.28, (R() - 0.5) * 0.6, (R() - 0.5) * 0.6, rockCol(0.05), { glow: ember() });
  }
  // ---- little stalactites and soda straws on every rock roof, stalagmites growing up at the back
  for (const [cx, cy] of ceils) {
    if (R() > 0.8 * dens) continue;
    const n = 2 + Math.floor(R() * 4);
    for (let k = 0; k < n; k++) {
      const len = 0.1 + Math.pow(R(), 1.6) * 0.65, straw = R() < 0.3, x = cx + R();
      const rad = straw ? 0.035 + R() * 0.02 : len * (0.22 + R() * 0.18);
      let z = R() < 0.65 ? zb(x, cy + 0.9) + 0.25 + R() * 1.4 : 0.5 + R() * 1.2;
      if (len > 0.2 && Math.abs(z) < 0.5) z = z < 0 ? -0.5 : 0.5;
      if (z < zb(x, cy + 0.9) + 0.15) continue;
      place(small, pick(P.drip), x, cy + 1.04, z, rad * 2, len, rad * 2, undefined, 0, 0, rockCol(0.1), { wet: 0.25 });
    }
  }
  for (const [cx, cy] of floors) {
    if (R() > 0.17 * dens) continue;
    const h = 0.15 + Math.pow(R(), 1.5) * 0.9, x = cx + R(), z = backZ(x, cy, h * 0.3);
    if (z === null) continue;
    place(small, pick(P.mite), x, cy - 0.04, z, h * 0.5, h, h * 0.5, undefined, 0, 0, rockCol(0.05), { wet: 0.15 });
  }
  const group = new THREE.Group();
  const mS = small.mesh(rockMat, false), mL = large.mesh(rockMat, true);
  if (mS) group.add(mS); if (mL) group.add(mL);

  // ---- clutter: the level's small props, baked
  const statics = [];
  const fl = floors.filter(([x, y]) => clear(x, y, 3.5));
  for (let i = fl.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [fl[i], fl[j]] = [fl[j], fl[i]]; }
  let fi = 0;
  const used = [];
  for (const [name, args, count, s0, s1, where] of CLUTTER[set] || []) {
    const n = Math.round(count * 1.7 * dens);
    for (let k = 0; k < n && fi < fl.length; fi++) {
      const [cx, cy] = fl[fi];
      if (used.some(([ux, uy]) => Math.abs(ux - cx) < 1.5 && uy === cy)) continue;
      const s = s0 + R() * (s1 - s0), x = cx + 0.2 + R() * 0.6;
      let z = where === 'lean' ? zb(x, cy + 0.8) + 0.3 : (where === 'back' || R() < 0.7) ? backZ(x, cy, 0.35 * s) : frontZ(x, cy, 0.35 * s);
      if (z === null || (where === 'lean' && z > -0.9)) continue;
      const g = obj(make(name, ...args(R())));
      g.scale.multiplyScalar(s); g.position.set(x, cy - 0.02, z); g.rotation.y = R() * 6.28;
      if (where === 'lean') { g.rotation.set(-0.28, (R() - 0.5) * 0.6, (R() - 0.5) * 0.3); g.position.y = cy; }
      statics.push(g); used.push([cx, cy]); k++;
    }
  }
  // ---- hanging growth from the roofs
  const gr = GROWTH[set];
  if (gr) {
    const list = [];
    for (const [cx, cy] of ceils) {
      if (R() > Math.min(0.95, gr[2] * 1.4) * dens) continue;
      const n = 1 + Math.floor(R() * 3);
      for (let k = 0; k < n; k++) {
        const x = cx + R(), w = zb(x, cy + 0.9);
        let z = w + 0.2 + R() * 1.6;
        if (Math.abs(z) < 0.45) z = -0.45;
        if (z < w + 0.15) continue;
        let d = 0; while (d < 6 && air(cx, cy - d)) d++;
        list.push([x, cy + 1.05, z, Math.min(d * 0.7, 0.3 + Math.pow(R(), 1.4) * 1.8)]);
      }
    }
    if (list.length) statics.push(obj(make('strands', list, gr[0], gr[1], M.seed + 3)));
  }
  if (statics.length) group.add(bake(statics, { shadow: false }));
  return { group, info: { set, rockTris: ((small.pos.length + large.pos.length) / 9) | 0, clutter: statics.length } };
}
