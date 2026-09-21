import { motionAt } from "./course.mjs";
// Low, changing acid solids. Both the visible surface and Rapier's sensor use
// these closed surface triangles. The restrained deformation follows the changing oval /
// lobed silhouettes in the Amiga 109–114s reference, not a copied sprite.
const TAU = Math.PI * 2,
  SEGMENTS = 40,
  FRAMES = 64,
  PERIOD = 0.64;
const cache = new Map();
export function acidShape(zone, time) {
  const phase =
    (((time / PERIOD + (zone.wobblePhase ?? zone.motion?.phase ?? 0) / TAU) %
      1) +
      1) %
    1;
  const frame = Math.floor(phase * FRAMES),
    key = `${zone.radius}/${frame}`;
  if (cache.has(key)) return cache.get(key);
  if (cache.size >= 1024) cache.delete(cache.keys().next().value);
  const t = (frame / FRAMES) * TAU,
    vertices = [],
    indices = [];
  const sx = 1 + 0.045 * Math.sin(t),
    sz = 1 - 0.045 * Math.sin(t);
  // Lobes and indentations remain in the collision surface; filling a convex
  // hull would kill marbles in visibly empty notches.
  for (const [scale, y] of [
    [0.96, 0],
    [1, 0.035],
    [0.91, 0.095],
    [0.55, 0.125],
  ])
    for (let i = 0; i < SEGMENTS; i++) {
      const a = (i / SEGMENTS) * TAU;
      const r =
        zone.radius *
        scale *
        (1 + 0.12 * Math.sin(3 * a + t) + 0.04 * Math.cos(5 * a - 2 * t));
      vertices.push(Math.cos(a) * r * sx, y, Math.sin(a) * r * sz);
    }
  vertices.push(0, 0.135, 0, 0, 0, 0);
  const top = 4 * SEGMENTS,
    bottom = top + 1;
  for (let i = 0; i < SEGMENTS; i++) {
    const next = (i + 1) % SEGMENTS;
    indices.push(bottom, i, next, top, 3 * SEGMENTS + next, 3 * SEGMENTS + i);
    for (let ring = 0; ring < 3; ring++) {
      const a = ring * SEGMENTS + i,
        b = ring * SEGMENTS + next;
      indices.push(a, a + SEGMENTS, b + SEGMENTS, a, b + SEGMENTS, b);
    }
  }
  const shape = {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
  cache.set(key, shape);
  return shape;
}

export function acidPositionAt(zone, time) {
  if (!zone.patrol)
    return zone.motion
      ? motionAt(zone, time).position
      : { x: zone.x, y: zone.y, z: zone.z };
  const { points, speed, phase = 0 } = zone.patrol;
  const lengths = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    return Math.hypot(q.x - p.x, q.z - p.z);
  });
  const total = lengths.reduce((a, b) => a + b, 0);
  let distance = ((((time + phase) * speed) % total) + total) % total;
  for (let i = 0; i < points.length; i++) {
    if (distance <= lengths[i] || i === points.length - 1) {
      const p = points[i],
        q = points[(i + 1) % points.length],
        a = distance / lengths[i];
      return { x: p.x + (q.x - p.x) * a, y: zone.y, z: p.z + (q.z - p.z) * a };
    }
    distance -= lengths[i];
  }
}
