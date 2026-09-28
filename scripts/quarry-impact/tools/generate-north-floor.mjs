/** Offline material-weight rasterizer. No image synthesis, downloads or runtime RNG. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), u = smooth(0, 1, x - ix), v = smooth(0, 1, z - iz);
  const h = (a, b) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
  return (h(ix, iz) * (1 - u) + h(ix + 1, iz) * u) * (1 - v)
    + (h(ix, iz + 1) * (1 - u) + h(ix + 1, iz + 1) * u) * v;
}
export function ellipseDistance(x, z, ellipse, margin = 0) {
  const dx = x - ellipse.x, dz = z - ellipse.z, c = Math.cos(ellipse.yaw), s = Math.sin(ellipse.yaw);
  return Math.hypot((dx * c + dz * s) / (ellipse.majorRadius + margin), (-dx * s + dz * c) / (ellipse.minorRadius + margin));
}

/** Each sample is generated at its texel centre, matching the GPU's UV lookup. */
export function sampleNorthFloor(x, z, spec, placements, crest = { points: [] }) {
  const small = noise(x * .43 + 11, z * .43 - 8), medium = noise(x * .105, z * .105), broad = noise(x * .034 - 7, z * .034 + 9);
  const irregular = (medium - .5) * .20 + (small - .5) * .045;
  let coverage = 0, organic = 0;
  for (const stand of placements.stands) {
    const distance = ellipseDistance(x, z, stand);
    coverage = Math.max(coverage, 1 - smooth(.72, 1.0, ellipseDistance(x, z, stand, spec.coverageMargin) + irregular * .5));
    organic = Math.max(organic, (1 - smooth(...spec.organicEdge, distance + irregular)) * (stand.groundWeight ?? 1));
  }
  // Actual root locations anchor the litter, even when a crown crosses a stand's
  // nominal boundary. Fine roots and low branches share these seated patches.
  for (const tree of [...placements.trees, ...(placements.mediumTrees ?? []), ...(placements.understory ?? [])]) {
    const radius = Math.max(2.4, tree.height * (tree.width ?? 1) * .28);
    const d = Math.hypot(x - tree.x, z - tree.z) / radius;
    organic = Math.max(organic, (1 - smooth(.25, 1.35, d + irregular)) * .94);
    coverage = Math.max(coverage, 1 - smooth(.9, 1.6, d));
  }
  let opening = 0;
  for (const gap of placements.openings ?? []) {
    opening = Math.max(opening, (1 - smooth(.5, 1.0, ellipseDistance(x, z, gap))) * (gap.strength ?? 1));
  }
  organic = clamp(organic * (1 - opening) * (.82 + broad * .24));
  let crestDistance = Infinity, crestOuter = false;
  for (let i = 1; i < crest.points.length; i++) {
    const a = crest.points[i - 1], b = crest.points[i], dx = b[0] - a[0], dz = b[2] - a[2];
    const t = clamp(((x - a[0]) * dx + (z - a[2]) * dz) / (dx * dx + dz * dz));
    const px = a[0] + t * dx, pz = a[2] + t * dz;
    const distance = Math.hypot(x - px, z - pz);
    if (distance < crestDistance) {
      crestDistance = distance;
      // The original rim occludes terrain about two metres below it. A wider
      // outward deposit must reach the first visible forest-side ground; the
      // inward rock treatment remains narrow. This changes no surface heights.
      crestOuter = (x - px) * px / (1.08 * 1.08) + (z - pz) * pz >= 0;
    }
  }
  const crestWidth = (spec.crest?.halfWidth ?? 6) + (medium - .5) * 3 + (small - .5) * 1.2;
  const crestFull = crestOuter ? (spec.crest?.outerFullWidth ?? 12) : 1.6;
  const crestFade = crestOuter ? (spec.crest?.outerFadeWidth ?? 18) + (medium - .5) * 3 + (small - .5) * 1.2 : crestWidth;
  const crestMineral = 1 - smooth(crestFull, crestFade, crestDistance);
  coverage = Math.max(coverage, crestMineral);
  organic *= 1 - crestMineral;
  // Keep an exact neutral texel border so clamp-to-edge never paints the rest
  // of the quarry. Material coverage remains authored rather than radial.
  const [x0, z0, x1, z1] = spec.bounds;
  coverage *= smooth(0, 2, Math.min(x - x0, x1 - x, z - z0, z1 - z));
  return [clamp(coverage), organic, crestMineral, clamp(.28 + broad * .45 + small * .27)];
}

export function rasterNorthFloor(spec, placements, crest = { points: [] }) {
  const [width, height] = spec.size, [x0, z0, x1, z1] = spec.bounds;
  const bytes = Buffer.alloc(width * height * 4);
  for (let iz = 0; iz < height; iz++) for (let ix = 0; ix < width; ix++) {
    const p = sampleNorthFloor(x0 + (ix + .5) / width * (x1 - x0), z0 + (iz + .5) / height * (z1 - z0), spec, placements, crest);
    const offset = (iz * width + ix) * 4;
    if (Math.round(p[0] * 255) === 0 || ix === 0 || iz === 0 || ix === width - 1 || iz === height - 1) continue;
    for (let c = 0; c < 4; c++) bytes[offset + c] = Math.round(p[c] * 255);
  }
  return bytes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sourcePath = 'source/north-forest-floor.json';
  const source = fs.readFileSync(path.join(root, sourcePath)), spec = JSON.parse(source);
  const placementBytes = fs.readFileSync(path.join(root, spec.placements)), placements = JSON.parse(placementBytes);
  const crestBytes = fs.readFileSync(path.join(root, spec.crest.source)), crest = JSON.parse(crestBytes);
  const bytes = rasterNorthFloor(spec, placements, crest), compressed = gzipSync(bytes, { level: 9 });
  const file = 'assets/north-forest-floor.rgba.gz';
  fs.writeFileSync(path.join(root, 'public', file), compressed);
  const manifest = { version: 1, generator: 'tools/generate-north-floor.mjs', source: sourcePath,
    sourceSha256: hash(source), placements: spec.placements, placementsSha256: hash(placementBytes),
    crest: spec.crest.source, crestSha256: hash(crestBytes),
    file, bytes: compressed.length, sha256: hash(compressed), decodedBytes: bytes.length, decodedSha256: hash(bytes),
    size: spec.size, bounds: spec.bounds, channels: spec.channels,
    attribution: 'Original authored material weights. Photographic sources and CC0 licenses are recorded in assets/manifest.json.',
    runtimeFiles: [{ file, bytes: compressed.length, sha256: hash(compressed) },
      ...(spec.photographs ?? []).map(file => {
        const photo = fs.readFileSync(path.join(root, 'public', file));
        return { file, bytes: photo.length, sha256: hash(photo) };
      })] };
  fs.writeFileSync(path.join(root, 'source/north-forest-floor-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify(manifest));
}
