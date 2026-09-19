/**
 * Compress the raw per-file GLBs from blender-export.py, and build manifest.json + descriptions.json for the studio.
 * Env: ANATOMY_SRC (Z-Anatomy checkout), ANATOMY_WORK (scratch with raw/*.glb and *-report.json).
 */
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup, prune, weld, quantize, reorder, meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder, MeshoptDecoder} from 'meshoptimizer';
import {readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SRC = process.env.ANATOMY_SRC || path.join(homedir(), '.cache/anatomy-studio/z-anatomy');
const WORK = process.env.ANATOMY_WORK || path.join(homedir(), '.cache/anatomy-studio/work');
const DEMO = path.resolve(HERE, '../../demos/anatomy-studio');
const RULES = JSON.parse(readFileSync(path.join(HERE, 'rules.json'), 'utf8'));
const NORM = JSON.parse(readFileSync(path.join(WORK, 'normalize.json'), 'utf8'));
const MAX_BYTES = 25 * 1024 * 1024;
mkdirSync(path.join(DEMO, 'assets'), {recursive: true});
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder});

// ---------------------------------------------------------------- descriptions index
const DESC_DIR = path.join(SRC, 'Resources/Descriptions/OriginalDescriptions');
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const descFiles = new Map();
for (const f of readdirSync(DESC_DIR)) if (f.endsWith('.txt')) descFiles.set(norm(f.slice(0, -4)), f.slice(0, -4));
const descCache = new Map();
function readDescription(key) {
  if (descCache.has(key)) return descCache.get(key);
  let text = readFileSync(path.join(DESC_DIR, `${key}.txt`), 'utf8').replace(/\r/g, '');
  const lines = text.split('\n').map(l => l.trim());
  while (lines.length && (!lines[0] || lines[0] === lines[0].toUpperCase())) lines.shift();   // blank + ALL-CAPS heading lines
  text = lines.filter(Boolean).join('\n\n').replace(/\(\s*,[^)]*\)/g, '').replace(/\[\d+\]/g, '').replace(/\s+([,.;])/g, '$1').replace(/ {2,}/g, ' ').trim();
  if (text.length > 900) { const cut = text.slice(0, 900); const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n')); text = end > 200 ? cut.slice(0, end + 1) : cut + '…'; }
  const out = text.length > 30 ? text : null;
  descCache.set(key, out); return out;
}
const QUALIFIER = /^(Inferior|Superior|Anterior|Posterior|Medial|Lateral|Septal|Middle|Deep|Superficial|Ascending|Descending|Transverse|Proximal|Distal|Upper|Lower|Internal|External|Common|Great|Greater|Lesser|Long|Short|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth)\s+/i;
function lookup(name) { const k = descFiles.get(norm(name)); return k && readDescription(k) ? k : null; }
function describe(p) {
  const tries = [];
  const add = (n, rule) => { if (n && n.trim()) tries.push([n.trim(), rule]); };
  const n0 = p.name;
  add(n0, 'exact');
  add(n0.replace(/\s*\([^)]*\)\s*$/, ''), 'parenthetical'); add(n0.replace(/^\(|\)$/g, ''), 'parenthetical');
  const noSide = n0.replace(/^(Left|Right)\s+/i, ''); add(noSide, 'side'); add(noSide.replace(/\s*\([^)]*\)\s*$/, ''), 'side');
  add(noSide.replace(QUALIFIER, ''), 'qualifier'); add(noSide.replace(QUALIFIER, '').replace(QUALIFIER, ''), 'qualifier');
  const of = noSide.match(/\bof\s+(?:the\s+)?(.+)$/i); if (of) { add(of[1].replace(/^(left|right)\s+/i, ''), 'of'); add(of[1].replace(/^(left|right)\s+/i, '').replace(/\s*\([^)]*\)\s*$/, ''), 'of'); }
  const v = n0.match(/^(?:Vertebra|Atlas|Axis)\s*\(?([CTL])\d+\)?$/i) || n0.match(/^Vertebra ([CTL])\d+$/);
  if (v) add({C: 'Cervical vertebrae', T: 'Thoracic vertebrae', L: 'Lumbar vertebrae'}[v[1].toUpperCase()], 'alias');
  if (/^(Intervertebral disc|Nucleus pulposus)/.test(n0)) { add('Intervertebral disc', 'alias'); add('Intervertebral symphysis', 'alias'); }
  if (/ (nodes?|node)$/i.test(n0)) add('Lymph node', 'alias');
  if (/tooth|incisor|canine|molar|premolar/i.test(n0)) add('Tooth', 'alias');
  if (/rib$/i.test(noSide.replace(QUALIFIER, ''))) add('Ribs', 'alias');
  if (/^Costal cartilage/.test(n0)) add('Costal cartilage', 'alias');
  if (/papillary muscle/i.test(n0)) add('Papillary muscle', 'alias');
  if (/leaflet/i.test(n0)) { add('Heart valve', 'alias'); }
  const ALIAS = {'Femoral region': 'Thigh', 'Gluteal region': 'Buttocks', 'Knee region': 'Knee', 'Leg region': 'Leg', 'Talocrural region': 'Ankle', 'Regions of digits of foot': 'Toe', 'Antebrachial region': 'Forearm', 'Brachial region': 'Arm', 'Carpal region': 'Wrist', 'Cubital region': 'Elbow', 'Brainstem nuclei': 'Brainstem', 'Cerebral sulci': 'Sulcus (neuroanatomy)', 'Autonomic ganglia': 'Autonomic ganglion', 'Central canal of spinal cord': 'Central canal', 'External and middle ear': 'Middle ear', 'Lacrimal apparatus': 'Lacrimal apparatus', 'Hemi-azygos vein': 'Hemiazygos vein', 'Accessory hemi-azygos vein': 'Accessory hemiazygos vein'};
  if (ALIAS[n0]) add(ALIAS[n0], 'alias');
  add(p.parent, 'parent'); for (const anc of (p.path || '').split(' / ').reverse()) add(anc, 'path');
  for (const [n, rule] of tries) { const k = lookup(n); if (k) return {key: k, rule}; }
  return {key: null, rule: 'none'};
}

// ---------------------------------------------------------------- regions (glTF frame: y up, +z anterior, +x subject left; skeleton height ~1.70 m)
export function region(c) {
  const y = c[1], x = Math.abs(c[0]);
  if (x > 0.18 && y > 0.55 && y < 1.42) return 'upper limb';
  if (y >= 1.52) return 'head'; if (y >= 1.42) return 'neck';
  if (y >= 1.10) return 'thorax'; if (y >= 0.95) return 'abdomen';
  if (y >= 0.76 && x <= 0.17) return 'pelvis';
  return 'lower limb';
}

// ---------------------------------------------------------------- process files
const fileIds = Object.keys(RULES.files);
const pieces = [], files = [], anchors = [];
for (const sys of Object.keys(RULES.systems)) { const p = path.join(WORK, `${sys}-anchors.json`); if (existsSync(p)) for (const a of JSON.parse(readFileSync(p, 'utf8'))) anchors.push({...a, system: sys}); }
let totalBytes = 0;
for (const fid of fileIds) {
  const raw = path.join(WORK, 'raw', `${fid}.glb`);
  if (!existsSync(raw)) { console.warn(`missing ${raw}`); continue; }
  const doc = await io.read(raw);
  const root = doc.getRoot(); const scene = root.getDefaultScene() || root.listScenes()[0];
  let index = 0, tris = 0;
  for (const node of root.listNodes()) {
    const x = node.getExtras(); const mesh = node.getMesh(); if (!mesh || !x.id) continue;
    let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity], t = 0;
    for (const prim of mesh.listPrimitives()) { const pos = prim.getAttribute('POSITION'); const mn = pos.getMin([]), mx = pos.getMax([]); for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], mn[i]); max[i] = Math.max(max[i], mx[i]); } t += (prim.getIndices()?.getCount() ?? pos.getCount()) / 3; }
    const tr = node.getTranslation(); const center = tr.map(v => +v.toFixed(4)); const size = max.map((v, i) => +(v - min[i]).toFixed(4));
    const piece = {id: x.id, name: x.name, system: x.system, file: fid, node: index++, parent: x.parent || null, path: x.path || '', side: x.side, region: region(center), center, size, triangles: t, merged: JSON.parse(x.merged || '[]')};
    if (x.schematic) { piece.schematic = true; piece.text = x.description; }
    const d = describe(piece); piece.descriptionKey = d.key; piece.descriptionRule = d.rule;
    pieces.push(piece); tris += t;
    node.setExtras({id: x.id});   // keep the GLB lean; the manifest carries the rest
  }
  // The skin is one welded surface split into pieces: a shared quantisation grid keeps their shared boundaries coincident.
  const qvol = fid === 'regions' ? 'scene' : 'mesh';
  await doc.transform(dedup(), prune(), weld({tolerance: 0}), quantize({quantizePosition: fid === 'regions' ? 16 : 14, quantizeNormal: 10, quantizationVolume: qvol}), reorder({encoder: MeshoptEncoder}), meshopt({encoder: MeshoptEncoder, level: 'medium'}));
  const out = path.join(DEMO, 'assets', `${fid}.glb`); await io.write(out, doc);
  const bytes = statSync(out).size; totalBytes += bytes;
  if (bytes >= MAX_BYTES) throw new Error(`${fid}.glb is ${bytes} bytes; Cloudflare Pages deploy skips files >= 25 MiB`);
  files.push({id: fid, path: `assets/${fid}.glb`, bytes, pieces: index, triangles: tris, system: RULES.files[fid].system, hero: !!RULES.files[fid].hero});
  console.log(`${fid.padEnd(9)} ${String(index).padStart(4)} pieces ${String(tris).padStart(8)} tris ${(bytes / 1048576).toFixed(2).padStart(6)} MB`);
}

const byId = new Map(pieces.map(p => [p.id, p]));
// ---------------------------------------------------------------- full-resolution tier (streamed when pieces are large on screen)
const hiDir = path.join(WORK, 'raw-hi'); mkdirSync(path.join(DEMO, 'assets', 'hi'), {recursive: true});
for (const f of files) {
  const raw = path.join(hiDir, `${f.id}.glb`); if (!existsSync(raw)) continue;
  const doc = await io.read(raw); const root = doc.getRoot(); let tris = 0, n = 0;
  for (const node of root.listNodes()) { const x = node.getExtras(); const mesh = node.getMesh(); if (!mesh || !x.id) continue; const piece = byId.get(x.id); if (!piece) continue;
    let t = 0; for (const prim of mesh.listPrimitives()) t += (prim.getIndices()?.getCount() ?? prim.getAttribute('POSITION').getCount()) / 3;
    const tr = node.getTranslation(); const d = tr.map((v, i) => +(v - piece.center[i]).toFixed(4)); if (d.some(v => Math.abs(v) > 0.0002)) piece.hiShift = d;
    piece.hiTriangles = t; tris += t; n++; node.setExtras({id: x.id}); }
  await doc.transform(dedup(), prune(), weld({tolerance: 0}), quantize({quantizePosition: f.id === 'regions' ? 16 : 14, quantizeNormal: 10, quantizationVolume: f.id === 'regions' ? 'scene' : 'mesh'}), reorder({encoder: MeshoptEncoder}), meshopt({encoder: MeshoptEncoder, level: 'medium'}));
  const out = path.join(DEMO, 'assets', 'hi', `${f.id}.glb`); await io.write(out, doc); const bytes = statSync(out).size;
  if (bytes >= MAX_BYTES) throw new Error(`hi/${f.id}.glb is ${bytes} bytes; over the 25 MiB Cloudflare Pages limit`);
  f.hi = {path: `assets/hi/${f.id}.glb`, bytes, pieces: n, triangles: tris}; totalBytes += bytes;
  console.log(`hi/${f.id.padEnd(9)} ${String(n).padStart(4)} pieces ${String(tris).padStart(8)} tris ${(bytes / 1048576).toFixed(2).padStart(6)} MB`);
}
// ---------------------------------------------------------------- envelope (radial extents per 12.5 cm band) and limb axes
const mean = arr => arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);
const limbAxis = {arm: {}, leg: {}};
for (const side of ['L', 'R']) {
  const arm = pieces.filter(p => p.file === 'skeletal' && p.side === side && /^(Humerus|Radius|Ulna)$/.test(p.name));
  const leg = pieces.filter(p => p.file === 'skeletal' && p.side === side && /^(Femur|Tibia|Fibula)$/.test(p.name));
  limbAxis.arm[side] = [+mean(arm.map(p => p.center[0])).toFixed(3), +mean(arm.map(p => p.center[2])).toFixed(3)];
  limbAxis.leg[side] = [+mean(leg.map(p => p.center[0])).toFixed(3), +mean(leg.map(p => p.center[2])).toFixed(3)];
}
const BAND = 0.125, bands = Math.ceil(1.8 / BAND);
const envelope = {band: BAND, trunk: new Array(bands).fill(0.05), arm: {L: new Array(bands).fill(0.03), R: new Array(bands).fill(0.03)}, leg: {L: new Array(bands).fill(0.05), R: new Array(bands).fill(0.05)}, limbAxis};
for (const p of pieces) {
  const b = Math.min(bands - 1, Math.max(0, Math.floor(p.center[1] / BAND))); const r = Math.max(p.size[0], p.size[2]) / 2;
  if (p.region === 'upper limb' && p.side !== 'M') { const a = limbAxis.arm[p.side]; envelope.arm[p.side][b] = Math.max(envelope.arm[p.side][b], Math.hypot(p.center[0] - a[0], p.center[2] - a[1]) + r * 0.5); }
  else if (p.region === 'lower limb' && p.side !== 'M') { const a = limbAxis.leg[p.side]; envelope.leg[p.side][b] = Math.max(envelope.leg[p.side][b], Math.hypot(p.center[0] - a[0], p.center[2] - a[1]) + r * 0.5); }
  else envelope.trunk[b] = Math.max(envelope.trunk[b], Math.hypot(p.center[0], p.center[2]) + r * 0.5);
}
for (const k of ['trunk']) envelope[k] = envelope[k].map(v => +v.toFixed(3));
for (const k of ['arm', 'leg']) for (const s of ['L', 'R']) envelope[k][s] = envelope[k][s].map(v => +v.toFixed(3));

// ---------------------------------------------------------------- assemblies + landmarks (optional until assemblies.js exists)
let assemblies = {}, landmarkNames = new Set(), bodyLandmarks = [];
const asmPath = path.join(DEMO, 'assemblies.js');
if (existsSync(asmPath)) {
  const mod = await import(pathToFileURL(asmPath).href + `?t=${Date.now()}`);
  for (const [id, a] of Object.entries(mod.assemblies)) {
    const members = pieces.filter(p => a.match(p) && !(a.exclude && a.exclude(p))).map(p => p.id);
    assemblies[id] = members; for (const l of a.landmarks || []) if (l.anchor) landmarkNames.add(l.anchor);
  }
  bodyLandmarks = mod.bodyLandmarks || []; for (const l of bodyLandmarks) if (l.anchor) landmarkNames.add(l.anchor);
}
const landmarks = anchors.filter(a => landmarkNames.has(a.name)).map(a => ({name: a.name, side: a.side, system: a.system, parent: a.parent, position: a.position}));

// ---------------------------------------------------------------- write outputs
const descriptions = {}; for (const p of pieces) if (p.descriptionKey) descriptions[p.descriptionKey] = readDescription(p.descriptionKey);
const ruleHist = {}, regionHist = {}; for (const p of pieces) { ruleHist[p.descriptionRule] = (ruleHist[p.descriptionRule] || 0) + 1; regionHist[p.region] = (regionHist[p.region] || 0) + 1; }
const stages = {core: ['skeletal', 'joints', 'visceral', 'heart', 'brain'], muscles: ['muscular'], detail: ['vessels', 'nerves', 'lymphoid', 'regions']};
const manifest = {
  version: 1, generated: new Date().toISOString().slice(0, 10),
  source: {name: 'Z-Anatomy', repo: 'https://github.com/LluisV/Z-Anatomy', branch: 'PC-Version', commit: existsSync(path.join(SRC, '.anatomy-commit')) ? readFileSync(path.join(SRC, '.anatomy-commit'), 'utf8').trim() : null, license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/'},
  height: NORM.height, frame: 'metres; y up; +z anterior; +x subject left; feet at y=0',
  files, stages, mobileDefault: 'core', envelope, landmarks, assemblies,
  stats: {pieces: pieces.length, triangles: pieces.reduce((a, p) => a + p.triangles, 0), hiTriangles: pieces.reduce((a, p) => a + (p.hiTriangles || p.triangles), 0), bytes: totalBytes, descriptionRules: ruleHist, regions: regionHist, descriptions: Object.keys(descriptions).length},
  pieces: pieces.map(({descriptionRule, ...p}) => p)
};
writeFileSync(path.join(DEMO, 'manifest.json'), JSON.stringify(manifest));
writeFileSync(path.join(DEMO, 'descriptions.json'), JSON.stringify(descriptions));
const strong = Object.entries(ruleHist).filter(([r]) => !['parent', 'path', 'none'].includes(r)).reduce((a, [, n]) => a + n, 0);
console.log(`\nTOTAL ${pieces.length} pieces, ${manifest.stats.triangles.toLocaleString()} triangles (full tier ${manifest.stats.hiTriangles.toLocaleString()}), ${(totalBytes / 1048576).toFixed(1)} MB compressed, ${Object.keys(descriptions).length} descriptions`);
console.log('description rules', ruleHist, `direct coverage ${(strong / pieces.length * 100).toFixed(1)}%`);
console.log('regions', regionHist); console.log('assemblies', Object.fromEntries(Object.entries(assemblies).map(([k, v]) => [k, v.length])), 'landmarks', landmarks.length);
console.log('manifest', (statSync(path.join(DEMO, 'manifest.json')).size / 1024).toFixed(0), 'KB; descriptions', (statSync(path.join(DEMO, 'descriptions.json')).size / 1024).toFixed(0), 'KB');
