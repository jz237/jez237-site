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
import { T } from './config.js?v=18';
import { bake } from './decor.js?v=18';

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
  const pack = (g) => { g.computeVertexNormals(); const q = g.toNonIndexed(), pos = q.attributes.position.array; let lo = 9, hi = -9; for (let i = 1; i < pos.length; i += 3) { lo = Math.min(lo, pos[i]); hi = Math.max(hi, pos[i]); } return { pos, nrm: q.attributes.normal.array, minY: lo, maxY: hi }; };
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

// ------------------------------------------------------------------ wall marks (one canvas atlas, 4 x 4 cells)
// 0 chalk tally  1 chalk arrow  2 chalk cross  3 miner's mark  4 soot  5 wet streak  6 ochre hand  7 ochre dots
// 8 carved spiral  9 carved sun  10 claw scratches  11 pick marks  12 mineral bloom  13 moss patch  14 lichen  15 rust bloom
let ATLAS = null, MARKMAT = null;
function atlas() {
  if (ATLAS) return ATLAS;
  const N = 128, cv = document.createElement('canvas'); cv.width = cv.height = N * 4;
  const g = cv.getContext('2d'), r = rng(911);
  const cell = (i, f) => { g.save(); g.translate((i % 4) * N, Math.floor(i / 4) * N); g.beginPath(); g.rect(0, 0, N, N); g.clip(); f(); g.restore(); };
  const chalk = (pts, w = 10) => { g.strokeStyle = 'rgba(236,230,214,0.95)'; g.lineCap = 'round'; for (let pass = 0; pass < 3; pass++) { g.lineWidth = w * (1 - pass * 0.25); g.globalAlpha = 0.6 + pass * 0.15; g.beginPath(); pts.forEach(([x, y], k) => { const jx = x + (r() - 0.5) * 2.5, jy = y + (r() - 0.5) * 2.5; k ? g.lineTo(jx, jy) : g.moveTo(jx, jy); }); g.stroke(); } g.globalAlpha = 1; };
  const blob = (x, y, rad, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
  const groove = (pts, w = 11) => { g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(10,8,6,0.85)'; g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.strokeStyle = 'rgba(255,240,220,0.18)'; g.lineWidth = w * 0.35; g.beginPath(); pts.forEach(([x, y], k) => (k ? g.lineTo(x + 2, y + 2) : g.moveTo(x + 2, y + 2))); g.stroke(); };
  cell(0, () => { for (let k = 0; k < 4; k++) chalk([[30 + k * 18, 30], [32 + k * 18, 98]]); chalk([[18, 80], [110, 44]]); });
  cell(1, () => { chalk([[20, 64], [104, 64]]); chalk([[80, 40], [106, 64], [80, 88]]); });
  cell(2, () => { chalk([[30, 30], [98, 98]], 12); chalk([[98, 30], [30, 98]], 12); });
  cell(3, () => { g.lineWidth = 5; chalk([[64, 20], [64, 108]]); chalk([[24, 60], [104, 60]]); const pts = []; for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; pts.push([64 + Math.cos(a) * 30, 60 + Math.sin(a) * 30]); } chalk(pts, 8); });
  cell(4, () => { for (let k = 0; k < 6; k++) blob(64 + (r() - 0.5) * 30, 70 - k * 9, 40 - k * 3, 'rgba(8,6,5,A)', 0.55); });
  cell(5, () => { const gr = g.createLinearGradient(0, 0, 0, N); gr.addColorStop(0, 'rgba(0,0,0,0.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; for (let k = 0; k < 4; k++) { const x = 40 + r() * 48, w = 6 + r() * 14; g.beginPath(); g.moveTo(x - w, 0); g.quadraticCurveTo(x + (r() - 0.5) * 20, N * 0.6, x + (r() - 0.5) * 6, N); g.quadraticCurveTo(x + w, N * 0.5, x + w, 0); g.fill(); } });
  cell(6, () => { blob(64, 66, 60, 'rgba(150,52,30,A)', 0.8); for (let k = 0; k < 70; k++) blob(64 + (r() - 0.5) * 90, 66 + (r() - 0.5) * 90, 9, 'rgba(160,58,32,A)', 0.35); g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'black'; g.beginPath(); g.ellipse(64, 82, 21, 25, 0, 0, Math.PI * 2); g.fill(); for (const [a, l] of [[-0.95, 30], [-0.3, 42], [-0.05, 46], [0.2, 43], [0.45, 34]]) { g.save(); g.translate(64 + Math.sin(a) * 18, 70); g.rotate(a); g.beginPath(); g.ellipse(0, -l / 2, 6.5, l / 2, 0, 0, Math.PI * 2); g.fill(); g.restore(); } g.globalCompositeOperation = 'source-over'; });
  cell(7, () => { for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(${140 + r() * 40},${50 + r() * 20},28,0.7)`; g.beginPath(); g.arc(24 + (k % 5) * 20, 34 + Math.floor(k / 5) * 26 + (r() - 0.5) * 6, 5 + r() * 3, 0, Math.PI * 2); g.fill(); } });
  cell(8, () => { const pts = []; for (let k = 0; k < 120; k++) { const a = k * 0.16, rr = 3 + k * 0.42; pts.push([64 + Math.cos(a) * rr, 64 + Math.sin(a) * rr]); } groove(pts, 5); });
  cell(9, () => { const pts = []; for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; pts.push([64 + Math.cos(a) * 20, 64 + Math.sin(a) * 20]); } groove(pts, 5); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; groove([[64 + Math.cos(a) * 28, 64 + Math.sin(a) * 28], [64 + Math.cos(a) * 46, 64 + Math.sin(a) * 46]], 4); } });
  cell(10, () => { for (let k = 0; k < 3; k++) groove([[30 + k * 18, 20], [50 + k * 18, 70], [58 + k * 18, 108]], 4 - k * 0.5); });
  cell(11, () => { for (let k = 0; k < 9; k++) { const x = 20 + r() * 88, y = 20 + r() * 88, a = -0.6 + (r() - 0.5) * 0.5; groove([[x, y], [x + Math.cos(a) * 18, y + Math.sin(a) * 18]], 3.5); } });
  cell(12, () => { for (let k = 0; k < 22; k++) { const a = r() * Math.PI * 2, l = 10 + r() * 40; g.strokeStyle = 'rgba(240,236,228,0.7)'; g.lineWidth = 1.5 + r() * 2; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.cos(a) * l, 64 + Math.sin(a) * l); g.stroke(); } blob(64, 64, 26, 'rgba(240,236,228,A)', 0.6); });
  cell(13, () => { for (let k = 0; k < 60; k++) blob(64 + (r() - 0.5) * 80, 64 + (r() - 0.5) * 60, 8 + r() * 12, `rgba(${40 + r() * 30},${80 + r() * 40},${30 + r() * 20},A)`, 0.35); });
  cell(14, () => { for (let k = 0; k < 10; k++) { const x = 20 + r() * 88, y = 20 + r() * 88, rad = 5 + r() * 12; g.strokeStyle = 'rgba(210,170,60,0.75)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.stroke(); blob(x, y, rad, 'rgba(200,150,50,A)', 0.4); } });
  cell(15, () => { for (let k = 0; k < 30; k++) blob(64 + (r() - 0.5) * 70, 50 + r() * 50, 6 + r() * 14, `rgba(${150 + r() * 50},${60 + r() * 30},20,A)`, 0.4); });
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  ATLAS = tex;
  MARKMAT = new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, roughness: 0.92, metalness: 0 });
  MARKMAT.name = 'gd-marks';
  return ATLAS;
}
// which marks each set paints on its walls: [cell, weight, size min, size max]
const MARKS = {
  workings: [[0, 3, 0.92, 1.38], [1, 3, 0.92, 1.38], [2, 2, 0.8, 1.15], [3, 2, 0.92, 1.38], [4, 2, 1.84, 2.99], [5, 3, 1.38, 2.76], [11, 3, 1.15, 2.07]],
  rust: [[15, 4, 1.15, 2.53], [4, 3, 1.84, 2.99], [5, 3, 1.38, 2.76], [2, 2, 0.8, 1.15], [11, 2, 1.15, 2.07], [0, 1, 0.92, 1.38]],
  patina: [[5, 4, 1.38, 2.99], [13, 3, 1.38, 2.53], [12, 2, 1.15, 2.07], [0, 1, 0.92, 1.38], [11, 1, 1.15, 2.07]],
  garden: [[13, 4, 1.38, 2.76], [14, 3, 0.92, 1.84], [5, 2, 1.38, 2.76], [10, 1, 1.15, 1.84]],
  bluecap: [[13, 3, 1.38, 2.53], [14, 2, 0.92, 1.84], [5, 3, 1.38, 2.76], [10, 1, 1.15, 1.84]],
  roots: [[6, 3, 0.8, 1.15], [7, 3, 0.92, 1.61], [13, 3, 1.38, 2.76], [14, 2, 0.92, 1.84], [10, 1, 1.15, 1.84]],
  amethyst: [[12, 4, 0.92, 2.07], [10, 2, 1.15, 1.84], [5, 2, 1.38, 2.53]],
  frost: [[12, 5, 0.92, 2.3], [5, 2, 1.38, 2.53], [10, 1, 1.15, 1.84]],
  rose: [[12, 3, 0.92, 2.07], [7, 2, 0.92, 1.61], [6, 1, 0.8, 1.15], [10, 1, 1.15, 1.84]],
  streets: [[8, 4, 1.15, 2.07], [9, 3, 1.15, 2.07], [13, 3, 1.38, 2.76], [5, 2, 1.38, 2.76], [6, 1, 0.8, 1.15]],
  salt: [[8, 3, 1.15, 2.07], [9, 3, 1.15, 2.07], [12, 4, 1.15, 2.3], [5, 2, 1.38, 2.76]],
  tide: [[8, 3, 1.15, 2.07], [13, 4, 1.38, 2.99], [5, 3, 1.38, 2.99], [9, 1, 1.15, 2.07]],
  basalt: [[4, 4, 1.84, 3.22], [10, 2, 1.15, 2.07], [12, 1, 0.92, 1.84]],
  obsidian: [[4, 3, 1.84, 3.22], [10, 3, 1.15, 2.07], [12, 1, 0.92, 1.84]],
  sulfur: [[12, 4, 1.15, 2.3], [4, 3, 1.84, 2.99], [15, 2, 1.15, 2.3]],
};
// what grows out of / is bedded in the cut face of the mountain: [model, args(r), weight, scale min, max, mode]
// mode 'out' points the model's +y at the camera, 'flat' keeps it (built facing +z)
const FACE = {
  workings: [['beamEnd', (r) => [Math.floor(r * 3)], 3, 0.8, 1.2, 'flat'], ['pipeStub', (r) => [Math.floor(r * 3)], 1, 0.8, 1.1, 'flat']],
  rust: [['pipeStub', (r) => [Math.floor(r * 3)], 3, 0.8, 1.3, 'flat'], ['gear', () => [], 1, 0.6, 1.0, 'flat'], ['beamEnd', (r) => [Math.floor(r * 3)], 1, 0.8, 1.1, 'flat']],
  patina: [['crystal', () => [1, 0x2fbf8a], 2, 0.25, 0.5, 'out'], ['crystal', () => [1, 0x2f6fd0], 1, 0.25, 0.45, 'out'], ['beamEnd', (r) => [Math.floor(r * 3)], 1, 0.8, 1.1, 'flat']],
  garden: [['shelf', () => [], 3, 0.6, 1.1, 'flat'], ['minicaps', () => [0x40fff0, 0x3a6f78], 2, 1, 1.6, 'out']],
  bluecap: [['shelf', () => [], 2, 0.6, 1.0, 'flat'], ['minicaps', () => [0x6a9cff, 0x1e2c66], 3, 1, 1.6, 'out']],
  roots: [['shelf', () => [], 3, 0.6, 1.2, 'flat']],
  amethyst: [['crystal', (r) => [1, [0x9a5cff, 0xd9c8ff, 0xff7ad0][Math.floor(r * 3)]], 1, 0.3, 0.7, 'out']],
  frost: [['crystal', (r) => [1, [0xcfeeff, 0xffffff, 0x9fd8ff][Math.floor(r * 3)]], 1, 0.3, 0.7, 'out']],
  rose: [['crystal', (r) => [1, [0xff8fb0, 0xffc24a, 0xffd6e0][Math.floor(r * 3)]], 1, 0.3, 0.7, 'out']],
  streets: [['block', (r) => [Math.floor(r * 3)], 3, 0.7, 1.2, 'flat'], ['drum', () => [], 1, 0.7, 1.0, 'flat']],
  salt: [['saltCubes', (r) => [1 + Math.floor(r * 5)], 3, 0.4, 0.8, 'out'], ['block', (r) => [Math.floor(r * 3)], 1, 0.7, 1.1, 'flat']],
  tide: [['shells', (r) => [Math.floor(r * 3)], 2, 1, 1.5, 'out'], ['anemone', () => [0x40f0d0], 2, 1, 1.6, 'out'], ['anemone', () => [0xff70c0], 1, 1, 1.4, 'out']],
  basalt: [['coal', (r) => [Math.floor(r * 3)], 3, 0.8, 1.4, 'out'], ['crystal', () => [1, 0x3a1d2a], 1, 0.3, 0.6, 'out']],
  obsidian: [['crystal', (r) => [1, [0x3a1d4a, 0x251530, 0x5a1a40][Math.floor(r * 3)]], 3, 0.3, 0.8, 'out'], ['coal', (r) => [Math.floor(r * 3)], 1, 0.8, 1.2, 'out']],
  sulfur: [['crystal', (r) => [1, [0xffd23a, 0xe8b020][Math.floor(r * 2)]], 3, 0.3, 0.6, 'out'], ['coal', (r) => [Math.floor(r * 3)], 1, 0.8, 1.2, 'out']],
};
const FLUSH = new Set(['beamEnd', 'pipeStub', 'block', 'drum', 'gear']);
const _fb = new THREE.Box3();
const FIREFLY = { garden: [0.3, 1, 0.8], bluecap: [0.5, 0.7, 1], roots: [1, 0.85, 0.4], tide: [0.3, 1, 0.9], patina: [0.4, 1, 0.75] };


export function buildDetail(M, look, W, K) {
  const { make, obj, q, cave, rockMat } = K;
  const dens = q.decor;
  const R = rng((M.seed * 131 + M.depth * 17 + M.level * 7 + 5) >>> 0);
  const P = protos();
  const set = look.set || SETS[M.biome % 5];
  const at = (x, y) => (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x];
  const rock = (x, y) => at(x, y) === T.ROCK;
  const air = (x, y) => at(x, y) === T.AIR;
  // where the rock really is behind / in front of a point (memoised on a half-metre grid)
  const memo = new Map();
  const surf = (x, y, back) => { const k = (Math.round(x * 2) * 4096 + Math.round(y * 2)) * 2 + (back ? 1 : 0); let v = memo.get(k); if (v === undefined) { v = cave.surfaceZ(Math.round(x * 2) / 2, Math.round(y * 2) / 2, back); memo.set(k, v); } return v; };
  const zb = (x, y) => surf(x, y, true), zf = (x, y) => surf(x, y, false);
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
  // everything stands on the DRAWN floor / hangs from the DRAWN roof (behind and in front of the lane they dip and rise):
  // gnd = the lowest floor under a footprint of radius r at tile row cy, rof = the highest roof over one (null: no rock)
  const gnd = (x, cy, z, r) => cave.floorUnder(x, cy + 0.5, z, r, r * 0.8, 1.2);
  const rof = (x, cy, z, r) => cave.roofOver(x, cy + 0.5, z, r, r, 1.3);
  // a rock piece resting on the floor, `bury` of its height sunk in; a cone hanging from the roof, its root in the rock
  const sit = (batch, pr, x, cy, z, sx, sy, sz, bury, ry, rx, rz, c, o) => {
    const g = gnd(x, cy, z, Math.max(sx, sz) * 0.75);
    if (g === null) return false;
    place(batch, pr, x, g - pr.minY * sy - bury * sy, z, sx, sy, sz, ry, rx, rz, c, o);
    if (globalThis.__gdAudit) globalThis.__gdAudit.push(["floor", x, g - bury * sy, z, Math.max(sx, sz) * 0.75, "rock"]);
    return true;
  };
  const hang = (batch, pr, x, cy, z, sx, sy, sz, c, o) => {
    const r = rof(x, cy, z, sx * 0.5);
    if (r === null) return false;
    place(batch, pr, x, r + 0.04 - pr.maxY * sy, z, sx, sy, sz, undefined, 0, 0, c, o);
    if (globalThis.__gdAudit) globalThis.__gdAudit.push(["roof", x, r + 0.04, z, sx * 0.5, "drip"]);
    return true;
  };
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
      const sy = s * (0.5 + R() * 0.35), pr = pick(s < 0.07 ? P.peb : P.lump);
      sit(small, pr, x, cy, z, s * (0.8 + R() * 0.5), sy, s * (0.8 + R() * 0.5), 0.15, R() * 6.28, 0, 0, rockCol(0.45), { glow: ember() });
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
      const a = R() * 6.28, d = R() * 0.45, s = (0.07 + R() * 0.17) * (1.3 - d), sy = s * (0.6 + R() * 0.3), sx = s * (0.9 + R() * 0.4);
      sit(small, pick(P.lump), x0 + Math.cos(a) * d * 1.4, cy, z0 + Math.sin(a) * d * 0.6, sx, sy, s, 0.12, R() * 6.28, R() * 0.4, R() * 0.4, rockCol(0.6), { glow: ember() });
    }
  }
  // ---- boulders resting against the back walls
  for (const [cx, cy] of floors) {
    if (R() > 0.2 * dens) continue;
    const r = 0.28 + Math.pow(R(), 1.5) * 0.7, x = cx + R(), w = zb(x, cy + 0.6);
    const z = w + r * 0.45;
    if (z + r * 0.95 > -0.55) continue;
    sit(large, pick(r > 0.55 ? P.big : P.lump), x, cy, z, r * (1 + R() * 0.6), r * (0.6 + R() * 0.45), r * (0.8 + R() * 0.3), 0.14, R() * 6.28, 0, 0, rockCol(0.15), { glow: ember(), gold: set === 'workings' && R() < 0.08 ? 0.5 : 0 });
  }
  // ---- a few big stones in the foreground, low enough never to hide the digger
  for (const [cx, cy] of floors) {
    if (R() > 0.08 * dens || !clear(cx, cy, 3)) continue;
    const r = 0.22 + R() * 0.3, x = cx + R(), z = frontZ(x, cy, r);
    if (z === null) continue;
    sit(large, pick(P.lump), x, cy, z, r * (1.1 + R() * 0.6), r * (0.5 + R() * 0.3), r, 0.14, R() * 6.28, 0, 0, rockCol(0.1), { glow: ember() });
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
      hang(small, pick(P.drip), x, cy, z, rad * 2, len, rad * 2, rockCol(0.1), { wet: 0.25 });
    }
  }
  for (const [cx, cy] of floors) {
    if (R() > 0.17 * dens) continue;
    const h = 0.15 + Math.pow(R(), 1.5) * 0.9, x = cx + R(), z = backZ(x, cy, h * 0.3);
    if (z === null) continue;
    sit(small, pick(P.mite), x, cy, z, h * 0.5, h, h * 0.5, 0.06, R() * 6.28, 0, 0, rockCol(0.05), { wet: 0.15 });
  }
  // ---- fringes along the front lips: drips under the roof edges, stones along the floor edges
  for (const [cx, cy] of ceils) {
    if (R() > 0.6 * dens) continue;
    const x = cx + R(), zl = cave.surfaceZ(x, cy + 1.3, false);
    if (zl < 1.8) continue;
    const len = 0.08 + Math.pow(R(), 1.8) * 0.4, rad = len * (0.25 + R() * 0.15);
    hang(small, pick(P.drip), x, cy, zl - 0.25 - R() * 0.45, rad * 2, len, rad * 2, rockCol(0.1), { wet: 0.25 });
  }
  const lipSpots = [];
  for (const [cx, cy] of floors) {
    if (R() > 0.45 * dens) continue;
    const x = cx + R(), zl = cave.surfaceZ(x, cy - 0.3, false);
    if (zl < 1.8 || zl > 4.4) continue;
    const z = zl - 0.25 - R() * 0.4;
    if (R() < 0.45) { lipSpots.push([x, cy, z]); continue; }
    const s = 0.05 + R() * 0.13;
    sit(small, pick(P.lump), x, cy, z, s * 1.2, s * 0.6, s, 0.15, R() * 6.28, 0, 0, rockCol(0.4), { glow: ember() });
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
      if (!cave.settle(g, 'floor', 0.025)) continue;
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
        const top = cave.roofY(x, cy + 0.5, z, 1.3);
        if (top === null) continue;
        list.push([x, top + 0.05, z, Math.min(d * 0.7, 0.3 + Math.pow(R(), 1.4) * 1.8)]);
      }
    }
    if (list.length) statics.push(obj(make('strands', list, gr[0], gr[1], M.seed + 3)));
  }
  // ---- the cut face of the mountain: things bedded in it, roots threading through it
  const pickW = (list) => { let tot = 0; for (const e of list) tot += e[2]; let k = R() * tot; for (const e of list) { k -= e[2]; if (k <= 0) return e; } return list[0]; };
  const EMBED = { beamEnd: 0.2, pipeStub: 0.2, block: 0.3, drum: 0.32, gear: 0.03, shelf: 0.03 };
  const inner = [];
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) if (rock(x, y) && rock(x - 1, y) && rock(x + 1, y) && rock(x, y - 1) && rock(x, y + 1)) inner.push([x, y]);
  const face = FACE[set];
  if (face && inner.length) {
    const n = Math.min(170, Math.round(inner.length * 0.05 * dens));
    for (let i = 0; i < n; i++) {
      const [cx, cy] = pick(inner), x = cx + R(), y = cy + R(), z = cave.surfaceZ(x, y, false);
      if (z < 1.6 || z > 4.6) continue;
      const [name, args, , s0, s1, mode] = pickW(face), sc = s0 + R() * (s1 - s0);
      const g = obj(make(name, ...args(R())));
      g.scale.multiplyScalar(sc);
      if (mode === 'out') g.rotation.set(Math.PI / 2 + (R() - 0.5) * 0.6, R() * 6.28, (R() - 0.5) * 0.4);
      else g.rotation.set((R() - 0.5) * 0.15, (R() - 0.5) * 0.25, (R() - 0.5) * 0.5);
      g.position.set(x, y, z - (EMBED[name] ?? 0.04) * sc);
      if (FLUSH.has(name)) {
        // a beam end or a block shows only its end, flush with the face: set where the face is furthest back over it,
        // 5 cm proud, so no box sides stand out of the rock (from a raised camera they read as floating cubes)
        g.updateMatrixWorld(true);
        const bb = _fb.setFromObject(g);
        const zs = [[bb.min.x, bb.min.y], [bb.max.x, bb.min.y], [bb.min.x, bb.max.y], [bb.max.x, bb.max.y], [x, y]].map(([px, py]) => cave.surfaceZ(px, py, false));
        const zmin = Math.min(...zs);
        if (zmin < 1.6) continue;
        g.position.z += zmin + 0.05 - bb.max.z;
      }
      statics.push(g);
    }
  }
  if (set === 'roots' && inner.length) for (let i = 0; i < Math.round(12 * dens); i++) {
    const [cx, cy] = pick(inner), len = 3 + R() * 5, pts = [];
    for (let k = 0; k <= 5; k++) { const x = cx + (k / 5 - 0.5) * len, y = cy + Math.sin(k * 1.3 + i) * 0.5 + (R() - 0.5) * 0.4; pts.push([x, y, cave.surfaceZ(x, y, false) - 0.05]); }
    if (pts.some((q) => q[2] < 1.6)) continue;
    statics.push(obj(make('bigRoot', pts, 0.06 + R() * 0.09, 100 + i)));
  }
  // growth along the floor lips
  const LIP = { garden: ['minicaps', () => [0x40fff0, 0x3a6f78]], bluecap: ['minicaps', () => [0x6a9cff, 0x1e2c66]], roots: ['minicaps', () => [0xffb040, 0x6a4020]], tide: ['shells', (r) => [Math.floor(r * 3)]], patina: ['minicaps', () => [0x60ffc0, 0x2a4a40]],
    amethyst: ['crystal', (r) => [0.2 + r * 0.15, 0xd9c8ff]], frost: ['crystal', (r) => [0.2 + r * 0.15, 0xcfeeff]], rose: ['crystal', (r) => [0.2 + r * 0.15, 0xff8fb0]], basalt: ['coal', (r) => [Math.floor(r * 3)]], sulfur: ['crystal', (r) => [0.18 + r * 0.12, 0xffd23a]],
    workings: ['bucket', () => []], rust: ['gear', () => []], streets: ['urn', (r) => [Math.floor(r * 3)]], salt: ['saltCubes', (r) => [1 + Math.floor(r * 5)]], obsidian: ['crystal', (r) => [0.2 + r * 0.2, 0x3a1d4a]] };
  if (LIP[set]) for (const [x, y, z] of lipSpots) {
    if (R() < 0.35) continue;
    const [nm, ar] = LIP[set], g = obj(make(nm, ...ar(R())));
    const sc = nm === 'saltCubes' ? 0.4 + R() * 0.3 : nm === 'gear' ? 0.5 : 0.7 + R() * 0.5;
    g.scale.multiplyScalar(sc); g.position.set(x, y - 0.02, z); g.rotation.y = R() * 6.28;
    if (nm === 'gear') { g.rotation.set(-Math.PI / 2, 0, R() * 6.28); g.position.y = y + 0.05; }
    if (cave.settle(g, 'floor', nm === 'gear' ? 0.01 : 0.025)) statics.push(g);
  }
  // ---- marks on the walls: chalk, soot, ochre, carvings, stains, moss and mineral blooms (flat cards on flat stretches)
  const mk = MARKS[set];
  let nMarks = 0;
  if (mk && typeof document !== 'undefined') {
    atlas();
    const pos = [], uv = [], nrm = [], ind = [];
    const want = Math.round(Math.min(170, opens.length * 0.045) * dens);
    for (let tries = 0; nMarks < want && tries < want * 16; tries++) {
      const [cx, cy] = pick(opens);
      if (!clear(cx, cy, 2)) continue;
      const x = cx + R(), y = cy + 0.3 + R() * 0.9;
      const e = pickW(mk), cellI = e[0], size = e[2] + R() * (e[3] - e[2]), h = size / 2;
      const zs = [cave.surfaceZ(x, y, true), cave.surfaceZ(x - h * 0.9, y, true), cave.surfaceZ(x + h * 0.9, y, true), cave.surfaceZ(x, y - h * 0.9, true), cave.surfaceZ(x, y + h * 0.9, true)];
      const zmax = Math.max(...zs), zmin = Math.min(...zs);
      if (zmax > -1.1 || zmin < -7 || zmax - zmin > 0.4) continue;
      const zc = zmax + 0.05, a = (R() - 0.5) * (cellI === 5 ? 0.12 : 0.6), ca = Math.cos(a), sa = Math.sin(a);
      const u0 = (cellI % 4) / 4, v0 = 1 - (Math.floor(cellI / 4) + 1) / 4, base = pos.length / 3;
      for (const [qx, qy, uu, vv] of [[-h, -h, 0, 0], [h, -h, 1, 0], [h, h, 1, 1], [-h, h, 0, 1]]) {
        pos.push(x + qx * ca - qy * sa, y + qx * sa + qy * ca, zc); nrm.push(0, 0, 1); uv.push(u0 + (uu * 0.96 + 0.02) / 4, v0 + (vv * 0.96 + 0.02) / 4);
      }
      ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
      nMarks++;
    }
    if (ind.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(ind); g.computeBoundingSphere();
      const m = new THREE.Mesh(g, MARKMAT); m.renderOrder = 1; m.matrixAutoUpdate = false; m.receiveShadow = true;
      group.add(m);
    }
  }
  if (globalThis.__gdAudit) for (const g of statics) for (const f of g.userData.feet || []) globalThis.__gdAudit.push([...f, 0, 'prop:' + (g.userData.kind || '?')]);
  if (statics.length) group.add(bake(statics, { shadow: false }));
  // moths round the lanterns, fireflies in the green and watery levels
  const fire = FIREFLY[set];
  const update = (t, dt, P, fx, emitters) => {
    if (!P || !fx) return;
    if (emitters) for (const e of emitters) {
      if (!e.flick || e.int > 6.5 || Math.abs(e.x - P.x) > 14 || Math.abs(e.y - P.y) > 9 || Math.random() > dt * 2.2) continue;
      fx.glintP.add({ x: e.x + (Math.random() - 0.5) * 0.6, y: e.y + (Math.random() - 0.5) * 0.5, z: e.z + 0.2 + (Math.random() - 0.5) * 0.5, vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 0.9, vz: (Math.random() - 0.5) * 0.6,
        s0: 0.05, s1: 0.04, max: 0.8 + Math.random() * 0.6, a: 0.8, r: 1, g: 0.92, b: 0.78, drag: 0.4, grav: 0, fade: 0.2 });
    }
    if (fire && Math.random() < dt * 3.5) {
      fx.glintP.add({ x: P.x + (Math.random() - 0.5) * 16, y: P.y + Math.random() * 5 - 0.5, z: -0.6 - Math.random() * 2.2, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.4) * 0.25, vz: 0,
        s0: 0.08, s1: 0.03, max: 2.5 + Math.random() * 2, a: 0.9, r: fire[0], g: fire[1], b: fire[2], drag: 0, grav: -0.01, fade: 0.6 });
    }
  };
  return { group, update, info: { set, rockTris: ((small.pos.length + large.pos.length) / 9) | 0, clutter: statics.length, marks: nMarks } };
}
