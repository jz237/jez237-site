/** Offline, deterministic engineering masks for the existing circuit.
 * No images are synthesized/re-encoded; no runtime world RNG or geometry changes.
 * Run: node tools/generate-circuit-surface.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mod = (x, n) => ((x % n) + n) % n;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

export function stationMetres(station, base) {
  const wraps = Math.floor(station / 360), cell = mod(station, 360);
  const i = Math.floor(cell), t = cell - i;
  return wraps * base.lengthMetres + base.rows[i].s * (1 - t) + base.rows[i + 1].s * t;
}

export function circuitCellAt(s, base) {
  s = mod(s, base.lengthMetres);
  let lo = 0, hi = base.cells.length;
  while (lo + 1 < hi) {
    const m = (lo + hi) >> 1;
    if (base.rows[m].s <= s) lo = m; else hi = m;
  }
  return base.cells[lo];
}

function periodicNoise(phase, frequency, seed) {
  const p = mod(phase, 1) * frequency, i = Math.floor(p), f = smooth(0, 1, p - i);
  const hash = k => { const n = Math.sin(mod(k, frequency) * 127.1 + seed * 311.7) * 43758.5453; return n - Math.floor(n); };
  return hash(i) * (1 - f) + hash(i + 1) * f;
}

function pointSegment(s, d, a, b) {
  const x = b[0] - a[0], y = b[1] - a[1];
  const t = clamp(((s - a[0]) * x + (d - a[1]) * y) / (x * x + y * y || 1));
  return { distance: Math.hypot(s - a[0] - t * x, d - a[1] - t * y), t };
}
function polygonDistance(s, d, polygon) {
  let inside = false, distance = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    distance = Math.min(distance, pointSegment(s, d, a, b).distance);
    if ((a[1] > d) !== (b[1] > d) && s < (b[0] - a[0]) * (d - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside ? -distance : distance;
}
function boundsOf(points, padding = 0) {
  return [Math.min(...points.map(p => p[0])) - padding, Math.min(...points.map(p => p[1])) - padding,
    Math.max(...points.map(p => p[0])) + padding, Math.max(...points.map(p => p[1])) + padding];
}
function bezier(points, t) {
  const u = 1 - t;
  return [0, 1].map(k => u ** 3 * points[0][k] + 3 * u * u * t * points[1][k] + 3 * u * t * t * points[2][k] + t ** 3 * points[3][k]);
}
function derivative(points, t) {
  const u = 1 - t;
  return [0, 1].map(k => 3 * u * u * (points[1][k] - points[0][k]) + 6 * u * t * (points[2][k] - points[1][k]) + 3 * t * t * (points[3][k] - points[2][k]));
}

/** Pure reusable rasterizer. Its only inputs are the authored spec and frozen road. */
export function generateCircuitSurface(spec, base) {
  const width = spec.width, height = spec.height, length = base.lengthMetres;
  if (width !== 2048 || height !== 128 || base.rows.length !== 361 || base.cells.length !== 360) throw new Error('Unexpected circuit mask/base dimensions');
  const [d0, d1] = spec.lateralBoundsMetres;
  const stepS = length / width, stepD = (d1 - d0) / height;
  const fields = Array.from({ length: 4 }, () => new Float32Array(width * height));
  const gate = new Float32Array(width), paved = new Uint8Array(width);
  const boundaries = base.cells.filter((cell, i) => {
    const previous = base.cells[mod(i - 1, 360)];
    return Boolean(cell.asphalt && !cell.authoredGravel) !== Boolean(previous.asphalt && !previous.authoredGravel);
  }).map(cell => cell.startMetres);
  const featureRecords = [];

  // The centre stays fully paved except at the two real material endpoints.
  // Periodic edge variation changes only the already narrow mineral margin.
  for (let x = 0; x < width; x++) {
    const s = (x + .5) * stepS, cell = circuitCellAt(s, base);
    if (!cell.asphalt || cell.authoredGravel) continue;
    paved[x] = 1;
    const distance = Math.min(...boundaries.map(b => Math.min(Math.abs(s - b), length - Math.abs(s - b))));
    gate[x] = smooth(0, spec.edge.materialEndFadeMetres, distance);
    for (let y = 0; y < height; y++) {
      const d = d0 + (y + .5) * stepD, side = d < 0 ? 3 : 19, e = spec.edge;
      const edge = e.baseHalfWidth + e.broadAmplitude * (periodicNoise(s / length, e.frequencies[0], side) * 2 - 1)
        + e.mediumAmplitude * (periodicNoise(s / length, e.frequencies[1], side + 1) * 2 - 1)
        + e.fineAmplitude * (periodicNoise(s / length, e.frequencies[2], side + 4) * 2 - 1);
      fields[0][y * width + x] = (1 - smooth(edge - e.featherInside, edge + e.featherOutside, Math.abs(d))) * gate[x];
    }
  }

  // Rasterization uses unwrapped coordinates, then wraps the destination texel.
  // A finite feature can cross s=0 without an artificial endpoint or mirror.
  function raster(bounds, callback) {
    const x0 = Math.floor(bounds[0] / stepS), x1 = Math.ceil(bounds[2] / stepS);
    const y0 = clamp(Math.floor((bounds[1] - d0) / stepD), 0, height - 1);
    const y1 = clamp(Math.ceil((bounds[3] - d0) / stepD), 0, height - 1);
    for (let y = y0; y <= y1; y++) for (let ix = x0; ix <= x1; ix++) {
      const x = mod(ix, width);
      if (!paved[x]) continue;
      callback((ix + .5) * stepS, d0 + (y + .5) * stepD, y * width + x, x);
    }
  }
  function polygon(feature, channel) {
    const anchor = stationMetres(feature.atSegment, base);
    const points = feature.polygon.map(([s, d]) => [s + anchor, d]);
    raster(boundsOf(points, feature.featherMetres), (s, d, i) => {
      const alpha = 1 - smooth(-feature.featherMetres, feature.featherMetres, polygonDistance(s, d, points));
      fields[channel][i] = Math.max(fields[channel][i], feature.strength * alpha);
    });
    featureRecords.push({ id: feature.id, channel, atSegment: feature.atSegment, anchorMetres: anchor, points,
      featherMetres: feature.featherMetres, strength: feature.strength });
  }
  for (const feature of spec.repairs) polygon(feature, 1);
  for (const feature of spec.gravelIncursions) polygon(feature, 3);

  for (const feature of spec.rubberPaths) {
    const anchor = stationMetres(feature.atSegment, base);
    const points = feature.points.map(([s, d]) => [s + anchor, d]);
    let pathLength = 0, previous = bezier(points, 0);
    for (let i = 1; i <= 100; i++) { const p = bezier(points, i / 100); pathLength += Math.hypot(p[0] - previous[0], p[1] - previous[1]); previous = p; }
    for (const [start, end] of feature.spans) for (const side of [-1, 1]) {
      const steps = Math.max(2, Math.ceil(pathLength * (end - start) / .23));
      let prior;
      for (let i = 0; i <= steps; i++) {
        const t = start + (end - start) * i / steps, p = bezier(points, t), v = derivative(points, t), n = Math.hypot(...v);
        const halfGauge = feature.gaugeMetres * .5 * side;
        const point = [p[0] - v[1] / n * halfGauge, p[1] + v[0] / n * halfGauge];
        const fadeLength = Math.min((end - start) * .2, .65 / pathLength);
        const fade = smooth(start, start + fadeLength, t) * (1 - smooth(end - fadeLength, end, t));
        const knots = feature.pressureKnots, at = t * (knots.length - 1), k = Math.floor(at);
        const pressure = knots[k] * (1 - (at - k)) + knots[Math.min(k + 1, knots.length - 1)] * (at - k);
        const halfWidth = feature.tireWidthMetres * .5 * (.78 + pressure * .27);
        if (prior) raster(boundsOf([prior.point, point], halfWidth + feature.featherMetres), (s, d, index) => {
          const q = pointSegment(s, d, prior.point, point);
          const contact = (1 - smooth(halfWidth * .78, halfWidth + feature.featherMetres, q.distance))
            * (prior.fade * (1 - q.t) + fade * q.t);
          fields[2][index] = Math.max(fields[2][index], contact * feature.strength * (.64 + pressure * .36) * (side < 0 ? .94 : 1));
        });
        prior = { point, fade };
      }
    }
    featureRecords.push({ id: feature.id, channel: 2, atSegment: feature.atSegment, anchorMetres: anchor,
      points, spans: feature.spans, gaugeMetres: feature.gaugeMetres, tireWidthMetres: feature.tireWidthMetres,
      approximateLengthMetres: pathLength, strength: feature.strength });
  }

  const data = new Uint8Array(width * height * 4);
  const stats = Array.from({ length: 4 }, () => ({ nonzeroTexels: 0, maximum: 0, weightedAreaSquareMetres: 0 }));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const index = y * width + x, d = d0 + (y + .5) * stepD;
    for (let c = 0; c < 4; c++) {
      let value = fields[c][index];
      if (c === 1 || c === 2) value *= fields[0][index];
      if (c === 3) value *= gate[x] * (1 - smooth(9.45, 9.85, Math.abs(d)));
      if (!paved[x]) value = 0;
      const byte = Math.round(clamp(value) * 255);
      data[index * 4 + c] = byte;
      stats[c].nonzeroTexels += Number(byte > 0); stats[c].maximum = Math.max(stats[c].maximum, byte);
      stats[c].weightedAreaSquareMetres += byte / 255 * stepS * stepD;
    }
  }
  return { data, stats, featureRecords, boundaries, stepMetres: [stepS, stepD] };
}

export function writeCircuitSurface(projectRoot = root) {
  const sourcePath = 'source/circuit-surface.json';
  const sourceBytes = fs.readFileSync(path.join(projectRoot, sourcePath)), spec = JSON.parse(sourceBytes);
  const baseBytes = fs.readFileSync(path.join(projectRoot, spec.base)), base = JSON.parse(baseBytes);
  const { data, ...evidence } = generateCircuitSurface(spec, base);
  const compressed = gzipSync(data, { level: 9 });
  fs.writeFileSync(path.join(projectRoot, spec.output), compressed);
  const manifest = { version: 1, generator: 'tools/generate-circuit-surface.mjs', source: sourcePath, sourceSha256: sha256(sourceBytes),
    base: spec.base, baseSha256: sha256(baseBytes), width: spec.width, height: spec.height,
    format: 'RGBA8 linear engineering weights; row-major, positive U along increasing arc; flipY false',
    channels: spec.channels, longitudinalPeriodMetres: base.lengthMetres, lateralBoundsMetres: spec.lateralBoundsMetres,
    textureSettings: { colorSpace: 'NoColorSpace', flipY: false, wrapS: 'RepeatWrapping', wrapT: 'ClampToEdgeWrapping',
      minFilter: 'LinearMipmapLinearFilter', magFilter: 'LinearFilter', generateMipmaps: true, anisotropy: 8 },
    output: spec.output, gzipBytes: compressed.length, gzipSha256: sha256(compressed), rawBytes: data.length, rawSha256: sha256(data),
    provenance: 'Original hand-authored circuit engineering data. No photographic pixels, geometry, collisions or runtime RNG are modified.',
    ...evidence };
  fs.writeFileSync(path.join(projectRoot, 'source/circuit-surface-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  return manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const m = writeCircuitSurface();
  console.log(JSON.stringify({ file: m.output, width: m.width, height: m.height, bytes: m.gzipBytes, sha256: m.gzipSha256,
    rawSha256: m.rawSha256, lengthMetres: m.longitudinalPeriodMetres, featureCount: m.featureRecords.length, stats: m.stats }, null, 2));
}
