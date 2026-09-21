// A chamfered metal peg. The visible mesh and convex collider use these points.
export function pegGeometry(p) {
  const vertices = [],
    indices = [],
    roles = [],
    n = 24;
  for (const [y, scale] of [
    [-p.h, 0.87],
    [-p.h + 0.06, 1],
    [-0.06, 1],
    [0, 0.87],
  ])
    for (let i = 0; i < n; i++) {
      const a = (i * Math.PI * 2) / n;
      vertices.push(
        Math.cos(a) * p.w * 0.5 * scale,
        y,
        Math.sin(a) * p.d * 0.5 * scale,
      );
    }
  for (let ring = 0; ring < 3; ring++)
    for (let i = 0; i < n; i++) {
      const a = ring * n + i,
        b = ring * n + ((i + 1) % n);
      indices.push(a, a + n, b + n, a, b + n, b);
      roles.push("side", "side");
    }
  for (let i = 1; i < n - 1; i++) {
    indices.push(0, i, i + 1, 3 * n, 3 * n + i + 1, 3 * n + i);
    roles.push("side", "top");
  }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}

export function extensionAt(time, motion) {
  const t =
    (((time / motion.period + (motion.phase ?? 0) / (Math.PI * 2)) % 1) + 1) %
    1;
  const ease = (x) => x * x * (3 - 2 * x);
  if (t < 0.2) return 0;
  if (t < 0.32) return ease((t - 0.2) / 0.12);
  if (t < 0.58) return 1;
  if (t < 0.7) return 1 - ease((t - 0.58) / 0.12);
  return 0;
}
