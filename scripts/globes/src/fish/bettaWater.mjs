// Anatomical probes, in Atelier units: six trunk samples, back/tail, ahead,
// and both flanks. Unlike an axis-aligned line these rotate with the specimen.
export const BETTA_PROBES = [
  [-1.4, 0, 0], [-1, 0, 0], [-0.5, 0, 0], [0, 0, 0], [0.5, 0, 0], [1, 0, 0],
  [-0.3, 0.5, 0], [0.5, 0.5, 0], [2, -0.15, 0],
  [-1.9, 0, 0], [-2.3, 0, 0], [-1.7, 0.6, 0], [-1.7, -0.5, 0],
  [-0.4, 0, 0.6], [-0.4, 0, -0.6], [0, 1.2, 0],
];
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const limit = (v, max) => { const l = Math.hypot(...v); return l > max ? v.map(x => x * max / l) : v; };

export function readBettaWater(sense, points, env) {
  const result = { flow: [0, 0, 0], angular: [0, 0, 0], submerged: 1, airAbove: 0,
    sand: env.sandLevel, centroid: [0, (env.sandLevel + env.level) / 2, 0] };
  if (!sense) return result;
  result.centroid = [...sense.centroid];
  const wet = [], center = [0, 0, 0], mean = [0, 0, 0];
  let bodyWet = 0, bed = -Infinity;
  for (let i = 0; i < 16; i++) {
    const n = i * 4, density = sense.probes[n + 3];
    if (i < 6) {
      if (density >= env.iso) bodyWet++;
      if (Number.isFinite(sense.sand[i])) bed = Math.max(bed, sense.sand[i]);
    }
    if (i === 6 || i === 7 || i === 15) result.airAbove = Math.max(result.airAbove, clamp(1 - density / env.iso, 0, 1) * (i === 15 ? 0.6 : 1));
    if (density < env.iso || ![0, 1, 2].every(k => Number.isFinite(sense.probes[n + k]))) continue;
    wet.push(i);
    for (let k = 0; k < 3; k++) { center[k] += points[n + k]; mean[k] += sense.probes[n + k]; }
  }
  result.submerged = bodyWet / 6;
  if (Number.isFinite(bed)) result.sand = bed;
  if (!wet.length) return result;
  for (let k = 0; k < 3; k++) { center[k] /= wet.length; mean[k] /= wet.length; }
  result.flow = limit(mean, 3); // same units as the solver, not a tiny visual offset
  // Least-squares rigid rotation of the sampled flow: I*w = sum(r x du).
  // Uniform currents translate without invented spin; opposite shear can turn
  // the fish even when the mean velocity is zero.
  let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, x = 0, y = 0, z = 0;
  for (const i of wet) {
    const n = i * 4, rx = points[n] - center[0], ry = points[n + 1] - center[1], rz = points[n + 2] - center[2];
    const ux = sense.probes[n] - mean[0], uy = sense.probes[n + 1] - mean[1], uz = sense.probes[n + 2] - mean[2];
    a += ry * ry + rz * rz; b -= rx * ry; c -= rx * rz;
    d += rx * rx + rz * rz; e -= ry * rz; f += rx * rx + ry * ry;
    x += ry * uz - rz * uy; y += rz * ux - rx * uz; z += rx * uy - ry * ux;
  }
  const det = a * (d * f - e * e) - b * (b * f - c * e) + c * (b * e - c * d);
  if (Math.abs(det) > 1e-12) result.angular = limit([
    ((d * f - e * e) * x + (c * e - b * f) * y + (b * e - c * d) * z) / det,
    ((c * e - b * f) * x + (a * f - c * c) * y + (b * c - a * e) * z) / det,
    ((b * e - c * d) * x + (b * c - a * e) * y + (a * d - b * b) * z) / det,
  ], 5);
  return result;
}
