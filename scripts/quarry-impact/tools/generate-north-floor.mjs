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

/** Fit litter to the actual new root envelope, then overlap the accepted front
 * stand. This uses private placement data only; no world RNG or terrain edits. */
export function mergeNorthBackdropFloor(spec, foreground, backdrop) {
  if (!backdrop) return { placements: foreground, extension: { stands: [], allowedFootprints: [] } };
  const stands = [], allowedFootprints = [];
  const radius = tree => Math.max(2.4, tree.height * (tree.width ?? 1) * .28);
  for (const group of backdrop.stands) {
    const roots = backdrop.trees.filter(tree => tree.stand === group.id);
    if (!roots.length) continue;
    const cx = roots.reduce((sum, tree) => sum + tree.x, 0) / roots.length;
    const cz = roots.reduce((sum, tree) => sum + tree.z, 0) / roots.length;
    const length = Math.hypot(cx, cz), nx = cx / length, nz = cz / length;
    // Tangent is the major axis; the second axis points outward from the quarry.
    const tx = nz, tz = -nx;
    let t0 = Infinity, t1 = -Infinity, r0 = Infinity, r1 = -Infinity;
    for (const tree of roots) {
      const crown = radius(tree), tangent = tree.x * tx + tree.z * tz, radial = tree.x * nx + tree.z * nz;
      t0 = Math.min(t0, tangent - crown); t1 = Math.max(t1, tangent + crown);
      r0 = Math.min(r0, radial - crown); r1 = Math.max(r1, radial + crown);
    }
    const front = foreground.stands.find(stand => stand.id === group.id);
    if (front) {
      // The new ellipse starts inside existing litter, so it connects rather
      // than forming a row of isolated dark discs around the background trees.
      r0 = Math.min(r0, front.x * nx + front.z * nz + front.minorRadius * .45);
    }
    const tangent = (t0 + t1) / 2, radial = (r0 + r1) / 2;
    const stand = { id: 'backdrop-floor-' + group.id, x: tangent * tx + radial * nx,
      z: tangent * tz + radial * nz, yaw: Math.atan2(tz, tx),
      majorRadius: Math.max(8, (t1 - t0) / 2), minorRadius: Math.max(8, (r1 - r0) / 2),
      groundWeight: .96, rootCount: roots.length, sourceStand: group.id };
    stands.push(stand);
    // Independent preservation tests can use this explicit conservative support
    // envelope. Existing noise bounds are ±.1225 (organic), ±.06125 (coverage).
    allowedFootprints.push({ id: stand.id, x: stand.x, z: stand.z, yaw: stand.yaw,
      majorRadius: Math.max((stand.majorRadius + spec.coverageMargin) * 1.06125, stand.majorRadius * 1.1425),
      minorRadius: Math.max((stand.minorRadius + spec.coverageMargin) * 1.06125, stand.minorRadius * 1.1425) });
  }
  for (const tree of backdrop.trees) {
    const support = radius(tree) * 1.6;
    allowedFootprints.push({ id: 'backdrop-root-' + tree.id, x: tree.x, z: tree.z,
      yaw: 0, majorRadius: support, minorRadius: support });
  }
  return { placements: { ...foreground, stands: [...foreground.stands, ...stands],
      trees: [...foreground.trees, ...backdrop.trees] },
    extension: { method: 'Six tangent ellipses from actual root/crown envelopes, overlapping matching foreground stands; unchanged mineral crest and opening fields',
      addedRoots: backdrop.trees.length, stands, allowedFootprints } };
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
  const placementBytes = fs.readFileSync(path.join(root, spec.placements)), foreground = JSON.parse(placementBytes);
  const backdropBytes = spec.backdropPlacements ? fs.readFileSync(path.join(root, spec.backdropPlacements)) : null;
  const { placements, extension } = mergeNorthBackdropFloor(spec, foreground, backdropBytes ? JSON.parse(backdropBytes) : null);
  const crestBytes = fs.readFileSync(path.join(root, spec.crest.source)), crest = JSON.parse(crestBytes);
  const bytes = rasterNorthFloor(spec, placements, crest), compressed = gzipSync(bytes, { level: 9 });
  const file = 'assets/north-forest-floor.rgba.gz';
  fs.writeFileSync(path.join(root, 'public', file), compressed);
  const manifest = { version: 1, generator: 'tools/generate-north-floor.mjs', source: sourcePath,
    sourceSha256: hash(source), placements: spec.placements, placementsSha256: hash(placementBytes),
    ...(backdropBytes ? { backdropPlacements: spec.backdropPlacements, backdropPlacementsSha256: hash(backdropBytes), extension } : {}),
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
