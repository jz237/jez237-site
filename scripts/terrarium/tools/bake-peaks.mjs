// Bakes the two basalt peaks and the cascade ledges between them.
// Units: metres, tank coordinates (x across, y up from the case floor, z toward the viewer).
import { mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { MeshoptSimplifier } from 'meshoptimizer';
import { clamp, smin, smax, smoothstep, valueNoise3 } from './lizard/sdf.mjs';
import { meshSDF, projectToSurface, compact, gradient } from './lizard/mesher.mjs';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public', 'peaks');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const H = Number(args.h || 0.0022);
const TARGET = Number(args.tris || 150000);
const log = (...m) => console.log('[peaks]', ...m);

const hash = createHash('sha256');
for (const f of ['tools/bake-peaks.mjs', 'tools/lizard/sdf.mjs', 'tools/lizard/mesher.mjs']) hash.update(await readFile(path.join(root, f)));
hash.update(`${H}:${TARGET}`);
const digest = hash.digest('hex').slice(0, 16);
try {
  const existing = JSON.parse(await readFile(path.join(outDir, 'peaks.json'), 'utf8'));
  if (existing.source === digest && !args.force) { log('up to date', digest); process.exit(0); }
} catch {}

// --- noise --------------------------------------------------------------------
function fbm3(x, y, z, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * valueNoise3(x * f, y * f, z * f); a *= 0.5; f *= 2.07; }
  return s;
}
function ridged(x, y, z, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * (1 - Math.abs(valueNoise3(x * f + 11.3, y * f, z * f - 7.1))); a *= 0.5; f *= 2.13; }
  return s;
}

// --- shapes ------------------------------------------------------------------
// A leaning, tapering prism: axis from base b (y0) to apex a; cross-section
// half sizes shrink toward the apex; faceted by rotating planes.
function spire(base, apex, w0, d0, facets, twist, seed) {
  let s0 = Math.floor(seed * 1000) + 7;
  const rnd = () => ((s0 = (s0 * 16807) % 2147483647) / 2147483647);
  const chisel = [];
  for (let k = 0; k < 6; k++) {
    const a = rnd() * Math.PI * 2, tilt = (rnd() - 0.4) * 0.5;
    const nx = Math.cos(a), nz = Math.sin(a), l = Math.hypot(nx, tilt, nz);
    chisel.push([nx / l, tilt / l, nz / l, 0.96 + rnd() * 0.08, 0.3 + rnd() * 0.6]);
  }
  const ax = apex[0] - base[0], ay = apex[1] - base[1], az = apex[2] - base[2];
  const L = Math.hypot(ax, ay, az);
  const ux = ax / L, uy = ay / L, uz = az / L;
  const bbox = {
    min: [Math.min(base[0], apex[0]) - w0 - 0.03, Math.min(base[1], apex[1]) - 0.04, Math.min(base[2], apex[2]) - d0 - 0.03],
    max: [Math.max(base[0], apex[0]) + w0 + 0.03, Math.max(base[1], apex[1]) + 0.03, Math.max(base[2], apex[2]) + d0 + 0.03],
  };
  const f = (x, y, z) => {
    const px = x - base[0], py = y - base[1], pz = z - base[2];
    const t = px * ux + py * uy + pz * uz;
    const tt = clamp(t / L, 0, 1);
    // local cross-section coordinates
    const cx = px - ux * t, cy = py - uy * t, cz = pz - uz * t;
    const taper = Math.pow(1 - tt, 0.85) * 0.92 + 0.08 * (1 - tt);
    const w = w0 * taper + 0.004, d = d0 * taper + 0.004;
    let dd = -1e9;
    for (let k = 0; k < facets; k++) {
      const a = (k / facets) * Math.PI * 2 + twist * tt + seed;
      const nx = Math.cos(a), nz = Math.sin(a);
      const r = Math.abs(nx) * w + Math.abs(nz) * d;
      const jitter = 1 + 0.12 * Math.sin(seed * 7 + k * 2.3);
      dd = Math.max(dd, cx * nx + cz * nz - r * jitter);
    }
    // Chisel: extra fracture planes with a vertical tilt, set at random heights.
    for (let k = 0; k < chisel.length; k++) {
      const c = chisel[k];
      const r = (Math.abs(c[0]) * w + Math.abs(c[2]) * d) * c[3];
      const h = (tt - c[4]) * L;
      dd = Math.max(dd, cx * c[0] + cz * c[2] + h * c[1] - r);
    }
    const cap = Math.max(-t, t - L);
    return Math.max(dd, cap);
  };
  return { f, box: bbox };
}

function slab(cx, top, cz, hw, hd, thick, tilt = 0) {
  const f = (x, y, z) => {
    const ty = top + (x - cx) * tilt;
    const dx = Math.abs(x - cx) - hw, dz = Math.abs(z - cz) - hd;
    const dy = Math.abs(y - (ty - thick / 2)) - thick / 2;
    const out = Math.hypot(Math.max(dx, 0), Math.max(dy, 0), Math.max(dz, 0));
    return out + Math.min(Math.max(dx, dy, dz), 0) - 0.003;
  };
  return { f, box: { min: [cx - hw - 0.02, top - thick - 0.02, cz - hd - 0.02], max: [cx + hw + 0.02, top + 0.03, cz + hd + 0.02] } };
}
const inBox = (b, x, y, z, m) => x > b.min[0] - m && x < b.max[0] + m && y > b.min[1] - m && y < b.max[1] + m && z > b.min[2] - m && z < b.max[2] + m;

// Each massif is a cluster of leaning basalt columns of different heights.
const col = (bx, bz, ax, ay, az, w, d, facets, seed) => spire([bx, 0.05, bz], [ax, ay, az], w, d, facets, (seed % 3) * 0.4 - 0.4, seed);
const LEFT = [
  col(-0.13, -0.11, -0.12, 0.49, -0.135, 0.085, 0.075, 5, 1.1),
  col(-0.22, -0.13, -0.215, 0.4, -0.15, 0.06, 0.055, 6, 2.7),
  col(-0.045, -0.1, -0.05, 0.41, -0.115, 0.052, 0.05, 5, 4.2),
  col(-0.17, -0.06, -0.165, 0.31, -0.075, 0.055, 0.045, 5, 5.9),
  col(-0.275, -0.1, -0.285, 0.27, -0.11, 0.05, 0.045, 6, 6.6),
  col(-0.08, -0.05, -0.078, 0.28, -0.06, 0.05, 0.045, 5, 7.4),
  col(-0.13, -0.025, -0.135, 0.2, -0.035, 0.06, 0.04, 6, 8.1),
  col(-0.3, -0.16, -0.31, 0.33, -0.18, 0.05, 0.04, 5, 3.3),
];
const RIGHT = [
  col(0.2, -0.12, 0.195, 0.455, -0.14, 0.082, 0.072, 5, 7.3),
  col(0.29, -0.14, 0.3, 0.34, -0.16, 0.06, 0.055, 6, 8.8),
  col(0.11, -0.1, 0.105, 0.36, -0.12, 0.05, 0.048, 5, 9.6),
  col(0.25, -0.05, 0.255, 0.25, -0.065, 0.055, 0.042, 6, 10.9),
  col(0.155, -0.05, 0.16, 0.29, -0.065, 0.05, 0.045, 5, 11.7),
  col(0.34, -0.09, 0.35, 0.24, -0.1, 0.045, 0.04, 6, 12.2),
  col(0.21, -0.02, 0.205, 0.18, -0.03, 0.055, 0.035, 5, 13.5),
];
// Cascade: a cleft between the massifs with stepped, irregular ledges.
export const LEDGES = [
  { cx: 0.03, top: 0.385, cz: -0.12, hw: 0.04, hd: 0.035, thick: 0.05, tilt: -0.05 },
  { cx: 0.035, top: 0.305, cz: -0.08, hw: 0.045, hd: 0.035, thick: 0.07, tilt: 0.04 },
  { cx: 0.05, top: 0.22, cz: -0.04, hw: 0.05, hd: 0.035, thick: 0.08, tilt: -0.03 },
  { cx: 0.07, top: 0.155, cz: 0.0, hw: 0.055, hd: 0.035, thick: 0.08, tilt: 0.02 },
];
function ledgeShape(l, seed) {
  const f = (x, y, z) => {
    const dx = (x - l.cx) / l.hw, dz = (z - l.cz) / l.hd;
    const ty = l.top + (x - l.cx) * l.tilt;
    const dy = (y - (ty - l.thick * 0.5)) / (l.thick * 0.5);
    const k0 = Math.hypot(dx, dy, dz);
    const body = (k0 - 1) * Math.min(l.hw, l.hd, l.thick * 0.5);
    const n = (valueNoise3(x * 60 + seed, y * 60, z * 60) * 0.5 + valueNoise3(x * 140, y * 140 + seed, z * 140) * 0.25) * 0.006;
    return smax(body + n, y - ty, 0.006);
  };
  return { f, box: { min: [l.cx - l.hw - 0.02, l.top - l.thick - 0.02, l.cz - l.hd - 0.02], max: [l.cx + l.hw + 0.02, l.top + 0.03, l.cz + l.hd + 0.02] } };
}
const LEDGE_SHAPES = LEDGES.map((l, i) => ledgeShape(l, i * 3.7));
const BACKWALL = spire([0.03, 0.05, -0.175], [0.035, 0.47, -0.19], 0.085, 0.055, 6, 0.2, 12.4);

function massif(parts, x, y, z) {
  let d = 1e9;
  for (const p of parts) if (inBox(p.box, x, y, z, 0.03)) d = smin(d, p.f(x, y, z), 0.025);
  return d;
}

function rockDisplace(x, y, z) {
  // columnar basalt: vertical striations + ridged fracture + fine grain
  const cols = valueNoise3(x * 60, y * 5, z * 60) + valueNoise3(x * 130, y * 9, z * 130) * 0.5;
  const big = ridged(x * 9, y * 9, z * 9, 3);
  const frac = ridged(x * 32, y * 26, z * 32, 3);
  const grain = fbm3(x * 260, y * 260, z * 260, 2);
  // inclined strata that step the faces
  const sy = y + x * 0.25 + z * 0.15;
  const strata = 1 - Math.abs(Math.sin(sy * 120 + fbm3(x * 15, y * 15, z * 15, 2) * 4));
  // ridges stand proud (subtracting the ridged field) so edges read sharp
  return cols * 0.0022 - (big - 0.5) * 0.014 - (frac - 0.5) * 0.006 + (grain - 0.5) * 0.0008 - strata * strata * strata * 0.0016;
}

function sdf(x, y, z) {
  let d = Math.min(massif(LEFT, x, y, z), massif(RIGHT, x, y, z));
  if (inBox(BACKWALL.box, x, y, z, 0.03)) d = smin(d, BACKWALL.f(x, y, z), 0.03);
  for (const l of LEDGE_SHAPES) if (inBox(l.box, x, y, z, 0.03)) d = smin(d, l.f(x, y, z), 0.012);
  if (d > 0.03) return d;
  d += rockDisplace(x, y, z);
  // Bury the bases: nothing below the floor of the case.
  d = Math.max(d, 0.045 - y);
  return d;
}
const bounds = { min: [-0.38, 0.04, -0.23], max: [0.4, 0.52, 0.06] };

const t0 = performance.now();
const raw = meshSDF(sdf, bounds, H, { log, block: 8 });
log(`surface nets: ${raw.positions.length / 3} verts, ${raw.indices.length / 3} tris (${((performance.now() - t0) / 1000).toFixed(1)}s)`);
projectToSurface(sdf, raw.positions, 2, H);
await MeshoptSimplifier.ready;
const [simp, err] = MeshoptSimplifier.simplify(raw.indices, raw.positions, 3, Math.min(raw.indices.length, TARGET * 3), 0.0004, ['ErrorAbsolute']);
log(`simplified to ${simp.length / 3} tris, error ${(err * 1000).toFixed(2)} mm`);
const mesh = compact(raw.positions, simp);
const V = mesh.positions.length / 3;
const normals = new Float32Array(V * 3);
const ao = new Uint8Array(V);
for (let v = 0; v < V; v++) {
  const x = mesh.positions[v * 3], y = mesh.positions[v * 3 + 1], z = mesh.positions[v * 3 + 2];
  const n = gradient(sdf, x, y, z, 0.0012);
  normals.set(n, v * 3);
  let occ = 0, w = 1;
  for (const d of [0.004, 0.01, 0.02, 0.035, 0.055]) {
    occ += (w * Math.max(0, d - sdf(x + n[0] * d, y + n[1] * d, z + n[2] * d))) / d;
    w *= 0.6;
  }
  // the case floor and planting also shade the foot of the rock
  const foot = smoothstep(0.2, 0.07, y) * 0.35;
  ao[v] = Math.round(clamp(1 - occ * 0.5 - foot, 0.15, 1) * 255);
}
let flips = 0;
for (let t = 0; t < mesh.indices.length; t += 3) {
  const a = mesh.indices[t], b = mesh.indices[t + 1], c = mesh.indices[t + 2];
  const P = (i) => [mesh.positions[i * 3], mesh.positions[i * 3 + 1], mesh.positions[i * 3 + 2]];
  const A = P(a), Bv = P(b), C = P(c);
  const e1 = [Bv[0] - A[0], Bv[1] - A[1], Bv[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
  const fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const nn = [0, 1, 2].map((k) => normals[a * 3 + k] + normals[b * 3 + k] + normals[c * 3 + k]);
  if (fn[0] * nn[0] + fn[1] * nn[1] + fn[2] * nn[2] < 0) { mesh.indices[t + 1] = c; mesh.indices[t + 2] = b; flips++; }
}
log(`${V} verts, ${flips} re-wound`);
const nrm8 = new Int8Array(V * 4);
for (let v = 0; v < V; v++) for (let k = 0; k < 3; k++) nrm8[v * 4 + k] = Math.round(normals[v * 3 + k] * 127);
const chunks = [mesh.positions, nrm8, ao, mesh.indices];
const names = ['position', 'normal', 'ao', 'index'];
const offsets = {};
let off = 0;
chunks.forEach((c, i) => { offsets[names[i]] = off; off = Math.ceil((off + c.byteLength) / 4) * 4; });
const bin = Buffer.alloc(off);
chunks.forEach((c, i) => Buffer.from(c.buffer, c.byteOffset, c.byteLength).copy(bin, offsets[names[i]]));
const binHash = createHash('sha256').update(bin).digest('hex').slice(0, 12);
await mkdir(outDir, { recursive: true });
for (const f of await readdir(outDir)) if (/^peaks-.*\.bin$/.test(f)) await rm(path.join(outDir, f));
const json = { version: 1, source: digest, file: `peaks-${binHash}.bin`, vertexCount: V, indexCount: mesh.indices.length, offsets, ledges: LEDGES };
await writeFile(path.join(outDir, json.file), bin);
await writeFile(path.join(outDir, 'peaks.json'), JSON.stringify(json));
log(`wrote ${json.file} (${(bin.length / 1024).toFixed(0)} KB) in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
