import { partGeometry } from "./course.mjs";

// Extend the existing rounded wall footprints to the display plinth. These
// display foundations live below the authored collider; track physics stays exact.
export function foundationGeometry(part, baseY) {
  if (
    part.motion ||
    part.presence ||
    ["wall", "pyramid", "tube"].includes(part.kind)
  )
    return null;
  const source = partGeometry(part),
    vertices = [],
    indices = [],
    roles = [];
  const at = (i) => Array.from(source.vertices.slice(i * 3, i * 3 + 3));
  const key = (v) => `${v[0].toFixed(5)},${v[2].toFixed(5)}`;
  const lowest = new Map();
  for (let i = 0; i < source.vertices.length / 3; i++) {
    const v = at(i);
    lowest.set(key(v), Math.min(lowest.get(key(v)) ?? Infinity, v[1]));
  }
  const seen = new Set();
  for (let t = 0; t < source.roles.length; t++) {
    if (source.roles[t] === "top") continue;
    const tri = Array.from(source.indices.slice(t * 3, t * 3 + 3), at);
    // A vertical wall has zero projected triangle area in the XZ plane.
    const [a, b, c] = tri;
    const area = (b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0]);
    if (Math.abs(area) > 1e-6) continue;
    for (let j = 0; j < 3; j++) {
      const a = tri[j],
        b = tri[(j + 1) % 3];
      if (
        key(a) === key(b) ||
        Math.abs(a[1] - lowest.get(key(a))) > 1e-5 ||
        Math.abs(b[1] - lowest.get(key(b))) > 1e-5
      )
        continue;
      const edge = [key(a), key(b)].sort().join("|");
      if (seen.has(edge)) continue;
      seen.add(edge);
      const world = (v) => [v[0] + part.x, v[1] + part.y, v[2] + part.z];
      const u = world(a),
        v = world(b);
      if (Math.max(u[1], v[1]) <= baseY + 0.001) continue;
      const start = vertices.length / 3;
      vertices.push(...u, ...v, v[0], baseY, v[2], u[0], baseY, u[2]);
      indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
      roles.push("side", "side");
    }
  }
  return indices.length
    ? {
        vertices: new Float32Array(vertices),
        indices: new Uint32Array(indices),
        roles,
      }
    : null;
}
