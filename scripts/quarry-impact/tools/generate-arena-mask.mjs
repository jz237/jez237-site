/** Offline engineering-data rasterizer, not an image or texture generator.
 * Run: node tools/generate-arena-mask.mjs
 * No RNG, world mutations, purchased input, downloads or rendering process.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const authoredPath = 'source/arena-floor-mask.json';
const authoredBytes = read(authoredPath);
const spec = JSON.parse(authoredBytes);
const baseBytes = read(spec.base);
const base = JSON.parse(baseBytes);
const size = spec.size, [minX, minZ, maxX, maxZ] = spec.bounds;
const step = (maxX - minX) / size;
const channels = Array.from({ length: 4 }, () => new Float32Array(size * size));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

function raster(bounds, callback) {
  const x0 = clamp(Math.floor((bounds[0] - minX) / step), 0, size - 1);
  const z0 = clamp(Math.floor((bounds[1] - minZ) / step), 0, size - 1);
  const x1 = clamp(Math.ceil((bounds[2] - minX) / step), 0, size - 1);
  const z1 = clamp(Math.ceil((bounds[3] - minZ) / step), 0, size - 1);
  for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
    callback(minX + (ix + .5) * step, minZ + (iz + .5) * step, iz * size + ix);
  }
}

function pointSegment(x, z, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1));
  return { distance: Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz), t };
}

/** Negative inside; measured against the actual piecewise-linear contour. */
function signedDistance(x, z, polygon) {
  let inside = false, distance = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    distance = Math.min(distance, pointSegment(x, z, a, b).distance);
    if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside ? -distance : distance;
}

function boundsOf(polygon, padding) {
  return [Math.min(...polygon.map(p => p[0])) - padding, Math.min(...polygon.map(p => p[1])) - padding,
    Math.max(...polygon.map(p => p[0])) + padding, Math.max(...polygon.map(p => p[1])) + padding];
}

function paintPolygon(polygon, feather, weights) {
  raster(boundsOf(polygon, feather), (x, z, index) => {
    // A short transition is deliberately tied to each authored boundary. The
    // photographic normal/albedo layers provide the sub-metre material detail.
    const opacity = 1 - smooth(-feather, feather, signedDistance(x, z, polygon));
    weights.forEach((weight, channel) => {
      channels[channel][index] = Math.max(channels[channel][index], weight * opacity);
    });
  });
}

for (const area of spec.compactedAreas ?? []) {
  paintPolygon(area.polygon, area.feather, [area.compaction, area.fines, 0, 0]);
}
for (const island of spec.deposits) {
  const centre = [0, 1].map(axis => island.polygon.reduce((sum, p) => sum + p[axis], 0) / island.polygon.length);
  const expanded = island.polygon.map(p => p.map((v, axis) => centre[axis] + (v - centre[axis]) * (spec.depositExpansion ?? 1)));
  paintPolygon(expanded, island.feather, [.03, .08, island.strength, 0]);
  // Small disconnected lobes continue selected displaced banks rather than
  // producing thirteen equally isolated material decals. Locations follow
  // each hand-authored polygon and are not a random scatter field.
  if (spec.depositExpansion > 1) for (const [j, radius] of [[1, .69], [Math.floor(expanded.length * .62), .41]]) {
    const tip = expanded[j], vx = tip[0] - centre[0], vz = tip[1] - centre[1], length = Math.hypot(vx, vz);
    const x = tip[0] + vx / length * (radius + .28), z = tip[1] + vz / length * (radius + .28);
    const polygon = [[-1,-.3],[-.3,-.8],[.6,-.7],[1,.1],[.4,.8],[-.5,.6]].map(p => [x + p[0] * radius, z + p[1] * radius]);
    paintPolygon(polygon, .18, [.02, .04, island.strength * .73, 0]);
  }
}
for (const fan of spec.fans) paintPolygon(fan.polygon, fan.feather, [fan.compaction, fan.fines, fan.loose, 0]);

function bezier(points, t) {
  const s = 1 - t;
  return [0, 1].map(axis => s ** 3 * points[0][axis] + 3 * s * s * t * points[1][axis]
    + 3 * s * t * t * points[2][axis] + t ** 3 * points[3][axis]);
}
function derivative(points, t) {
  const s = 1 - t;
  return [0, 1].map(axis => 3 * s * s * (points[1][axis] - points[0][axis])
    + 6 * s * t * (points[2][axis] - points[1][axis]) + 3 * t * t * (points[3][axis] - points[2][axis]));
}

const pathStats = [];
for (const [featureIndex, feature] of spec.paths.entries()) {
  let approximateLength = 0, previous = bezier(feature.points, 0);
  for (let i = 1; i <= 100; i++) {
    const p = bezier(feature.points, i / 100);
    approximateLength += Math.hypot(p[0] - previous[0], p[1] - previous[1]); previous = p;
  }
  for (const [start, end] of feature.spans) {
    const steps = Math.ceil(approximateLength * (end - start) / .115);
    for (const side of [-1, 1]) {
      let prior;
      for (let i = 0; i <= steps; i++) {
        const t = start + (end - start) * i / steps;
        const p = bezier(feature.points, t), d = derivative(feature.points, t), length = Math.hypot(...d);
        const gauge = feature.gauge / 2 * side;
        const point = [p[0] - d[1] / length * gauge, p[1] + d[0] / length * gauge];
        const endFade = smooth(start, start + Math.min(.026, (end - start) * .15), t)
          * (1 - smooth(end - Math.min(.037, (end - start) * .19), end, t));
        if (prior) {
          const profile = spec.contactProfiles?.[(featureIndex + (side < 0 ? 1 : 0)) % spec.contactProfiles.length];
          const profileAt = (t * approximateLength / (.68 + featureIndex * .077) + (side < 0 ? .47 : 0)) % (profile?.length - 1 || 1);
          const knot = Math.floor(profileAt), fraction = smooth(0, 1, profileAt - knot);
          const pressure = profile ? profile[knot] * (1 - fraction) + profile[Math.min(knot + 1, profile.length - 1)] * fraction : 1;
          const halfWidth = feature.width * .5 * (.75 + pressure * .4);
          const outside = halfWidth + .16;
          raster(boundsOf([prior.point, point], outside), (x, z, index) => {
            const q = pointSegment(x, z, prior.point, point);
            const fade = prior.fade * (1 - q.t) + endFade * q.t;
            const contact = (1 - smooth(halfWidth * .72, outside, q.distance)) * fade;
            const strength = feature.strength * (side < 0 ? .91 : 1) * (spec.pathPeakScale ?? 1) * (.54 + pressure * .46);
            channels[0][index] = Math.max(channels[0][index], contact * strength);
            channels[1][index] = Math.max(channels[1][index], contact * strength * .44);
            // A displaced granular lip, not a black outline or raised mesh.
            const lip = smooth(halfWidth, halfWidth + .05, q.distance)
              * (1 - smooth(halfWidth + .07, outside, q.distance)) * fade;
            channels[2][index] = Math.max(channels[2][index], lip * strength * .24);
          });
        }
        prior = { point, fade: endFade };
      }
    }
  }
  pathStats.push({ id: feature.id, approximateLength, pairedPasses: feature.spans.length, tireWidth: feature.width });
}

const wetStats = [];
for (const puddle of base.puddles.filter(p => p.kind === 'water')) {
  const polygon = puddle.rings.at(-1).points.map(p => [p[0], p[2]]);
  const cx = puddle.matrix[12], cz = puddle.matrix[14], config = spec.wetMargins;
  const tongue = spec.sedimentTongues?.find(t => t.puddle === puddle.id);
  raster(boundsOf(polygon, Math.max(config.maximumWidth, tongue?.reach ?? 0)), (x, z, index) => {
    const distance = signedDistance(x, z, polygon);
    const angle = Math.atan2(z - cz, x - cx);
    // Directional sediment reach around each measured shoreline, without
    // periodic concentric contours or any unrelated global noise field.
    const lobe = clamp(.5 + .31 * Math.sin(angle * 3 + puddle.id * .83)
      + .19 * Math.sin(angle * 7 - puddle.id * 1.71));
    const width = config.minimumWidth + (config.maximumWidth - config.minimumWidth) * lobe;
    const wetness = distance <= 0
      ? config.atShore + (config.inside - config.atShore) * smooth(0, config.interiorTransition, -distance)
      : config.atShore * (1 - smooth(0, width, distance));
    channels[3][index] = Math.max(channels[3][index], wetness);
    channels[1][index] = Math.max(channels[1][index], wetness * .86);
    if (tongue && distance > 0) {
      const direction = Math.max(0, Math.cos(angle - tongue.direction)) ** 5;
      const reach = .34 + (tongue.reach - .34) * direction;
      const sediment = .42 * (1 - smooth(0, reach, distance));
      channels[1][index] = Math.max(channels[1][index], sediment);
    }
  });
  wetStats.push({ id: puddle.id, centre: [cx, cz], contourSamples: polygon.length,
    maximumExteriorReach: config.maximumWidth, fineSedimentTongueReach: tongue?.reach ?? 0 });
}

const output = Buffer.alloc(size * size * 4);
const stats = spec.channels.map(name => ({ name, max: 0, sum: 0, pixelsAbove20: 0, pixelsAbove50: 0 }));
let arenaPixels = 0;
for (let iz = 0; iz < size; iz++) for (let ix = 0; ix < size; ix++) {
  const index = iz * size + ix;
  const radius = Math.hypot(minX + (ix + .5) * step, minZ + (iz + .5) * step);
  const edge = 1 - smooth(...spec.edgeFade, radius);
  if (radius < 45) arenaPixels++;
  // Sediment buries loose gravel in damp margins; a compacted tire pass also
  // clears some loose aggregate without changing its underlying location.
  channels[2][index] *= (1 - channels[3][index] * .95) * (1 - channels[0][index] * .64);
  for (let channel = 0; channel < 4; channel++) {
    const value = Math.round(clamp(channels[channel][index] * edge) * 255);
    output[index * 4 + channel] = value;
    stats[channel].max = Math.max(stats[channel].max, value / 255);
    stats[channel].sum += value / 255;
    if (value > 51) stats[channel].pixelsAbove20++;
    if (value > 127) stats[channel].pixelsAbove50++;
  }
}

const assetPath = 'public/assets/arena-floor-mask.rgba.gz';
const compressed = zlib.gzipSync(output, { level: 9 });
fs.writeFileSync(path.join(root, assetPath), compressed);

// Tiny standalone PNG writer used only to inspect authored data. These are
// scientific channel previews in outputs/, never photographic runtime assets.
function png(bytes) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0;
  });
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]); let crc = 0xffffffff;
    for (const byte of body) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    const head = Buffer.alloc(4), tail = Buffer.alloc(4); head.writeUInt32BE(data.length); tail.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([head, body, tail]);
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(size); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc((size * 4 + 1) * size);
  for (let z = 0; z < size; z++) bytes.copy(rows, z * (size * 4 + 1) + 1, z * size * 4, (z + 1) * size * 4);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}
const previewDirectory = path.join(root, 'outputs/arena-mask');
fs.mkdirSync(previewDirectory, { recursive: true });
for (let channel = 0; channel < 4; channel++) {
  const grey = Buffer.alloc(output.length);
  for (let i = 0; i < size * size; i++) {
    grey[i * 4] = grey[i * 4 + 1] = grey[i * 4 + 2] = output[i * 4 + channel]; grey[i * 4 + 3] = 255;
  }
  fs.writeFileSync(path.join(previewDirectory, `${spec.channels[channel]}.png`), png(grey));
}
const composite = Buffer.alloc(output.length);
for (let i = 0; i < size * size; i++) {
  const c = output[i * 4] / 255, f = output[i * 4 + 1] / 255, g = output[i * 4 + 2] / 255, w = output[i * 4 + 3] / 255;
  composite[i * 4] = clamp(31 + c * 175 + f * 100, 0, 255);
  composite[i * 4 + 1] = clamp(31 + g * 210 + f * 85, 0, 255);
  composite[i * 4 + 2] = clamp(31 + w * 224 + c * 100, 0, 255);
  composite[i * 4 + 3] = 255;
}
fs.writeFileSync(path.join(previewDirectory, 'authored-layout.png'), png(composite));

const manifest = {
  version: 1, generator: 'tools/generate-arena-mask.mjs', reproduction: 'node tools/generate-arena-mask.mjs',
  provenance: 'Original engineering material-mask data authored for Quarry Impact. No source photograph, AI generation, purchased input or world RNG.',
  authored: { path: authoredPath, bytes: authoredBytes.length, sha256: hash(authoredBytes) },
  frozenWorld: { path: spec.base, bytes: baseBytes.length, sha256: hash(baseBytes) },
  asset: { path: assetPath, bytes: compressed.length, sha256: hash(compressed) },
  decoded: { bytes: output.length, sha256: hash(output) },
  texture: { width: size, height: size, format: 'RGBA8 linear', bounds: spec.bounds,
    channels: spec.channels, rowZeroWorldZ: minZ, flipY: false, texelSizeMetres: step,
    sampleUV: '(worldXZ + vec2(48.0)) / 96.0', edgeFade: spec.edgeFade,
    gpuBytesWithMipmaps: (size * size * 4 * 4 - 4) / 3 },
  geometryAndPhysicsChanges: 'None. Existing arena, water/wet geometry and all collider inputs remain untouched.',
  features: { paths: pathStats, compactedWorkingAreas: spec.compactedAreas?.length ?? 0,
    fans: spec.fans.length, looseIslands: spec.deposits.length,
    looseOutliers: spec.depositExpansion > 1 ? spec.deposits.length * 2 : 0, waterContours: wetStats },
  channelStatistics: stats.map(s => ({ name: s.name, max: s.max, arenaMean: s.sum / arenaPixels,
    arenaCoverageAbove20: s.pixelsAbove20 / arenaPixels, arenaCoverageAbove50: s.pixelsAbove50 / arenaPixels }))
};
fs.writeFileSync(path.join(root, 'source/arena-floor-mask-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ asset: manifest.asset, decoded: manifest.decoded, texture: manifest.texture,
  features: { paths: pathStats.length, finitePairedPasses: pathStats.reduce((n, p) => n + p.pairedPasses, 0), fans: spec.fans.length, deposits: spec.deposits.length },
  channels: manifest.channelStatistics }, null, 2));
