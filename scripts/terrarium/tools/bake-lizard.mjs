// Bakes the procedural lizard into a compact skinned mesh for the browser.
// node tools/bake-lizard.mjs [--h=0.045] [--tris=110000]
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { MeshoptSimplifier } from 'meshoptimizer';
import { sdf, surfaceInfo, bones, limbs, bounds, EYE, meta, profile } from './lizard/anatomy.mjs';
import { meshSDF, projectToSurface, compact, gradient } from './lizard/mesher.mjs';
import { spikeSeeds } from './lizard/spikes.mjs';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public', 'lizard');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const H = Number(args.h || 0.04);
const TARGET_TRIS = Number(args.tris || 110000);
const log = (...m) => console.log('[lizard]', ...m);

// Skip the bake when the sculpt sources have not changed.
const sourceHash = createHash('sha256');
for (const f of ['tools/bake-lizard.mjs', 'tools/lizard/anatomy.mjs', 'tools/lizard/sdf.mjs', 'tools/lizard/mesher.mjs', 'tools/lizard/spikes.mjs'])
  sourceHash.update(await readFile(path.join(root, f)));
sourceHash.update(`${H}:${TARGET_TRIS}`);
const digest = sourceHash.digest('hex').slice(0, 16);
try {
  const existing = JSON.parse(await readFile(path.join(outDir, 'lizard.json'), 'utf8'));
  if (existing.source === digest && !args.force) { log('up to date', digest); process.exit(0); }
} catch {}

const t0 = performance.now();
const raw = meshSDF(sdf, bounds, H, { log });
log(`surface nets: ${raw.positions.length / 3} verts, ${raw.indices.length / 3} tris (${((performance.now() - t0) / 1000).toFixed(1)}s)`);
projectToSurface(sdf, raw.positions, 3, H);

await MeshoptSimplifier.ready;
const [simplified, err] = MeshoptSimplifier.simplify(raw.indices, raw.positions, 3, Math.min(raw.indices.length, TARGET_TRIS * 3), 0.006, ['ErrorAbsolute']);
log(`simplified to ${simplified.length / 3} tris, error ${err.toFixed(4)} cm`);
const mesh = compact(raw.positions, simplified);
const V = mesh.positions.length / 3;

// Normals from the exact field; flip any triangle wound against it.
const normals = new Float32Array(V * 3);
for (let v = 0; v < V; v++) {
  const g = gradient(sdf, mesh.positions[v * 3], mesh.positions[v * 3 + 1], mesh.positions[v * 3 + 2], 0.006);
  normals.set(g, v * 3);
}
let flipped = 0;
for (let t = 0; t < mesh.indices.length; t += 3) {
  const [a, b, c] = [mesh.indices[t], mesh.indices[t + 1], mesh.indices[t + 2]];
  const p = (i) => [mesh.positions[i * 3], mesh.positions[i * 3 + 1], mesh.positions[i * 3 + 2]];
  const A = p(a), Bp = p(b), C = p(c);
  const e1 = [Bp[0] - A[0], Bp[1] - A[1], Bp[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
  const fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const avg = [0, 1, 2].map((k) => normals[a * 3 + k] + normals[b * 3 + k] + normals[c * 3 + k]);
  if (fn[0] * avg[0] + fn[1] * avg[1] + fn[2] * avg[2] < 0) { mesh.indices[t + 1] = c; mesh.indices[t + 2] = b; flipped++; }
}
log(`normals done, ${flipped} triangles re-wound`);

// Ambient occlusion from the distance field (creases, toes, eye sockets).
function occlusion(x, y, z, n) {
  let occ = 0, w = 1;
  for (const d of [0.05, 0.12, 0.22, 0.36, 0.55, 0.8]) {
    const s = sdf(x + n[0] * d, y + n[1] * d, z + n[2] * d);
    occ += (w * Math.max(0, d - s)) / d;
    w *= 0.62;
  }
  // Ground contact darkening is applied at runtime; this is self-occlusion only.
  return Math.max(0.18, Math.min(1, 1 - occ * 0.55));
}

const out = { pos: [], nrm: [], ji: [], jw: [], aux: [], idx: Array.from(mesh.indices) };
const pushVertex = (p, n, info, ao, spikeT) => {
  out.pos.push(p[0], p[1], p[2]);
  out.nrm.push(n[0], n[1], n[2]);
  const w = info.weights;
  const qi = [0, 0, 0, 0], qw = [0, 0, 0, 0];
  let sum = 0;
  for (let k = 0; k < Math.min(4, w.length); k++) { qi[k] = w[k][0]; qw[k] = Math.round(w[k][1] * 255); sum += qw[k]; }
  qw[0] += 255 - sum;
  out.ji.push(...qi);
  out.jw.push(...qw);
  out.aux.push(Math.round(ao * 255), Math.round(info.claw * 255), Math.round(info.mouth * 255), Math.round(spikeT * 255));
};
for (let v = 0; v < V; v++) {
  const p = [mesh.positions[v * 3], mesh.positions[v * 3 + 1], mesh.positions[v * 3 + 2]];
  const n = [normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]];
  pushVertex(p, n, surfaceInfo(...p), occlusion(...p, n), 0);
}
log(`skin weights + AO done (${((performance.now() - t0) / 1000).toFixed(1)}s)`);

// Spines and tubercles: small cones rooted in the surface.
const seeds = spikeSeeds();
let spikeCount = 0;
for (const s of seeds) {
  let p = [...s.p];
  for (let it = 0; it < 6; it++) {
    const d = sdf(...p);
    const g = gradient(sdf, ...p);
    p = [p[0] - g[0] * d, p[1] - g[1] * d, p[2] - g[2] * d];
  }
  if (Math.abs(sdf(...p)) > 0.02) continue;
  const n = gradient(sdf, ...p);
  const tl = Math.hypot(...s.tilt) || 1;
  let axis = [n[0] * 0.7 + (s.tilt[0] / tl) * 0.55, n[1] * 0.7 + (s.tilt[1] / tl) * 0.55, n[2] * 0.7 + (s.tilt[2] / tl) * 0.55];
  const al = Math.hypot(...axis);
  axis = axis.map((a) => a / al);
  const info = surfaceInfo(...p);
  const ao = occlusion(...p, n);
  const ref = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let u = [axis[1] * ref[2] - axis[2] * ref[1], axis[2] * ref[0] - axis[0] * ref[2], axis[0] * ref[1] - axis[1] * ref[0]];
  const ul = Math.hypot(...u);
  u = u.map((a) => a / ul);
  const w = [axis[1] * u[2] - axis[2] * u[1], axis[2] * u[0] - axis[0] * u[2], axis[0] * u[1] - axis[1] * u[0]];
  const dome = s.kind === 'tubercle';
  const rings = dome ? [0, 0.4, 0.75, 0.95] : [0, 0.3, 0.62, 0.88];
  const SEG = 8;
  const base = out.pos.length / 3;
  const sink = Math.min(0.04, s.r * 0.6);
  for (const t of rings) {
    const r = dome ? s.r * Math.sqrt(Math.max(0, 1 - t * t)) : s.r * Math.pow(1 - t, 1.15);
    // spines curve slightly back toward the tail as they rise
    const bend = dome ? 0 : t * t * s.h * 0.18;
    const c = [p[0] - n[0] * sink + axis[0] * s.h * t - bend, p[1] - n[1] * sink + axis[1] * s.h * t, p[2] - n[2] * sink + axis[2] * s.h * t];
    for (let k = 0; k < SEG; k++) {
      const a = (k / SEG) * Math.PI * 2;
      const rad = [u[0] * Math.cos(a) + w[0] * Math.sin(a), u[1] * Math.cos(a) + w[1] * Math.sin(a), u[2] * Math.cos(a) + w[2] * Math.sin(a)];
      const slope = dome ? (t * s.h) / Math.max(s.r, 1e-3) : s.r / s.h;
      const nn = [rad[0] + axis[0] * slope, rad[1] + axis[1] * slope, rad[2] + axis[2] * slope];
      const nl = Math.hypot(...nn);
      pushVertex([c[0] + rad[0] * r, c[1] + rad[1] * r, c[2] + rad[2] * r], nn.map((q) => q / nl), info, ao * (0.85 + 0.15 * t), Math.max(t, 0.02));
    }
  }
  const tipBend = dome ? 0 : s.h * 0.18;
  const tip = [p[0] - n[0] * sink + axis[0] * s.h - tipBend, p[1] - n[1] * sink + axis[1] * s.h, p[2] - n[2] * sink + axis[2] * s.h];
  pushVertex(tip, axis, info, ao, 1);
  const tipIndex = base + rings.length * SEG;
  for (let r = 0; r < rings.length - 1; r++) for (let k = 0; k < SEG; k++) {
    const a = base + r * SEG + k, b = base + r * SEG + ((k + 1) % SEG);
    const c = a + SEG, d = b + SEG;
    out.idx.push(a, b, d, a, d, c);
  }
  for (let k = 0; k < SEG; k++) out.idx.push(base + (rings.length - 1) * SEG + k, base + (rings.length - 1) * SEG + ((k + 1) % SEG), tipIndex);
  spikeCount++;
}
log(`${spikeCount}/${seeds.length} spines placed`);

// Spike winding: make sure it agrees with the outward normals we computed.
const VC = out.pos.length / 3;
const IC = out.idx.length;
log(`final: ${VC} verts, ${IC / 3} tris`);

const posArr = new Float32Array(out.pos);
const nrmArr = new Int8Array(VC * 4);
for (let v = 0; v < VC; v++) for (let k = 0; k < 3; k++) nrmArr[v * 4 + k] = Math.round(out.nrm[v * 3 + k] * 127);
const jiArr = new Uint8Array(out.ji), jwArr = new Uint8Array(out.jw), auxArr = new Uint8Array(out.aux);
const idxArr = new Uint32Array(out.idx);
// Spike winding check against stored normals.
let spikeFix = 0;
for (let t = mesh.indices.length; t < idxArr.length; t += 3) {
  const a = idxArr[t], b = idxArr[t + 1], c = idxArr[t + 2];
  const P = (i) => [posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]];
  const A = P(a), Bp = P(b), C = P(c);
  const e1 = [Bp[0] - A[0], Bp[1] - A[1], Bp[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
  const fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const nn = [0, 1, 2].map((k) => out.nrm[a * 3 + k] + out.nrm[b * 3 + k] + out.nrm[c * 3 + k]);
  if (fn[0] * nn[0] + fn[1] * nn[1] + fn[2] * nn[2] < 0) { idxArr[t + 1] = c; idxArr[t + 2] = b; spikeFix++; }
}
log(`spike triangles re-wound: ${spikeFix}`);

const chunks = [posArr, nrmArr, jiArr, jwArr, auxArr, idxArr];
const offsets = {};
let offset = 0;
const names = ['position', 'normal', 'skinIndex', 'skinWeight', 'aux', 'index'];
chunks.forEach((c, i) => { offsets[names[i]] = offset; offset += c.byteLength; offset = Math.ceil(offset / 4) * 4; });
const bin = Buffer.alloc(offset);
chunks.forEach((c, i) => Buffer.from(c.buffer, c.byteOffset, c.byteLength).copy(bin, offsets[names[i]]));
const binHash = createHash('sha256').update(bin).digest('hex').slice(0, 12);

const r4 = (v) => Math.round(v * 1e4) / 1e4;
const json = {
  version: 1,
  source: digest,
  units: 'cm',
  file: `lizard-${binHash}.bin`,
  vertexCount: VC,
  indexCount: IC,
  bodyIndexCount: mesh.indices.length,
  offsets,
  bones: bones.map((b) => ({ name: b.name, origin: b.origin.map(r4), axes: b.axes.map((a) => a.map(r4)) })),
  limbs: limbs.map((l) => ({
    kind: l.kind, side: l.side, bones: l.bones,
    root: l.root.map(r4), mid: l.mid.map(r4), wrist: l.wrist.map(r4), palm: l.palm.map(r4), forward: l.forward.map(r4),
    upperLength: r4(l.upperLength), lowerLength: r4(l.lowerLength), plane: l.plane.map(r4),
    digits: l.digits.map((d) => ({ base: d.base.map(r4), dir: d.dir.map(r4), length: r4(d.length), tip: d.tip.map(r4) })),
  })),
  eye: { radius: EYE.radius, centre: EYE.centre.map(r4), axis: EYE.axis.map(r4) },
  hingeX: meta.hingeX,
  mouth: [12.4, 11.95, 11.4, 10.8, 10.0].map((x) => [x, r4(meta.mouthAt(x))]),
  spine: meta.spine.map((s) => ({ name: s.name, x: s.x, y: r4(s.y) })),
  profile: Array.from({ length: 62 }, (_, i) => { const x = -17.2 + i * 0.5; const p = profile(x); return [r4(x), r4(p.w), r4(p.ht), r4(p.hb), r4(p.cy)]; }),
};
await mkdir(outDir, { recursive: true });
const { readdir, rm } = await import('node:fs/promises');
for (const f of await readdir(outDir)) if (/^lizard-.*\.bin$/.test(f)) await rm(path.join(outDir, f));
await writeFile(path.join(outDir, json.file), bin);
await writeFile(path.join(outDir, 'lizard.json'), JSON.stringify(json));
log(`wrote ${json.file} (${(bin.length / 1024).toFixed(0)} KB) in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
