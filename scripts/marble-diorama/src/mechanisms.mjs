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

// A shallow circular cup and its hinge stem. Keep the depression in both the
// rendered mesh and the trimesh collider; a convex hull would fill the cup.
export function flipperGeometry(p) {
  const vertices = [],
    indices = [],
    roles = [],
    n = 48;
  const radius = p.w / 2,
    center = p.d / 2 - radius;
  const cs = Math.cos(p.angle ?? 0),
    sn = Math.sin(p.angle ?? 0);
  const put = (x, y, z) => {
    vertices.push(x * cs - z * sn, y, x * sn + z * cs);
    return vertices.length / 3 - 1;
  };
  const triangle = (a, b, c, role = "top") => {
    indices.push(a, b, c);
    roles.push(role);
  };
  // Radial rings go from the recessed center over a rounded rim to underside.
  for (const [r, y] of [
    [0, 0],
    [0.35, 0.025],
    [0.7, 0.1],
    [0.93, 0.22],
    [1, 0.2],
    [1, 0.1],
    [0.93, -0.12],
    [0, -0.16],
  ])
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n;
      put(Math.cos(a) * radius * r, y, center + Math.sin(a) * radius * r);
    }
  for (let ring = 0; ring < 7; ring++)
    for (let i = 0; i < n; i++) {
      const a = ring * n + i,
        b = ring * n + ((i + 1) % n);
      triangle(a, b + n, a + n);
      triangle(a, b, b + n);
    }
  const start = vertices.length / 3;
  for (const y of [-0.16, -0.04])
    for (const [x, z] of [
      [-0.2, -p.d / 2],
      [0.2, -p.d / 2],
      [0.2, center],
      [-0.2, center],
    ])
      put(x, y, z);
  for (const [a, b, c] of [
    [0, 1, 2],
    [0, 2, 3],
    [4, 6, 5],
    [4, 7, 6],
    [0, 4, 5],
    [0, 5, 1],
    [1, 5, 6],
    [1, 6, 2],
    [2, 6, 7],
    [2, 7, 3],
    [3, 7, 4],
    [3, 4, 0],
  ])
    triangle(start + a, start + b, start + c);
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}

export function flipperLift(time, motion) {
  const t = time - (motion.delay ?? 0.5);
  if (t <= 0 || t >= motion.period) return 0;
  const rise = motion.period * 0.6,
    hold = motion.period * 0.8;
  if (t < rise) return Math.sin(((t / rise) * Math.PI) / 2);
  if (t < hold) return 1;
  return 0.5 + 0.5 * Math.cos(((t - hold) / (motion.period - hold)) * Math.PI);
}

// Rounded, open intake frame. Four perimeter loops preserve the opening.
export function vacuumGeometry(p) {
  const vertices = [],
    indices = [],
    roles = [],
    n = 48;
  const cs = Math.cos(p.angle ?? 0),
    sn = Math.sin(p.angle ?? 0);
  for (const [x, inset] of [
    [-p.w / 2, 0],
    [-p.w / 2 - 0.025, 0.25],
    [p.w / 2, 0.25],
    [p.w / 2, 0],
  ]) {
    const hz = p.d / 2 - inset,
      hy = p.h / 2 - inset,
      r = Math.min(0.28, hy * 0.4);
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n,
        ca = Math.cos(a),
        sa = Math.sin(a);
      const z = Math.sign(ca) * (hz - r) + ca * r,
        y = p.h / 2 + Math.sign(sa) * (hy - r) + sa * r;
      vertices.push(x * cs - z * sn, y, x * sn + z * cs);
    }
  }
  for (let ring = 0; ring < 4; ring++)
    for (let i = 0; i < n; i++) {
      const a = ring * n + i,
        b = ring * n + ((i + 1) % n),
        c = ((ring + 1) % 4) * n + ((i + 1) % n),
        d = ((ring + 1) % 4) * n + i;
      indices.push(a, b, c, a, c, d);
      roles.push("top", "top");
    }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}
