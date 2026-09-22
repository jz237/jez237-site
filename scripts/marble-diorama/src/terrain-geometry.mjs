import {
  validateTerrainTunnels,
  terrainTunnelGeometry,
} from "./terrain-tunnels.mjs";

// A tile retains four independent heights. Neighbours share positions, but a
// cliff must keep both heights; averaging them would change the playable slope.
// Null denotes absent terrain, including half tiles along diagonal boundaries.
export function validateTerrain(p, finite) {
  const size = p.cellSize;
  if (
    p.motion ||
    p.presence ||
    (p.rise ?? 0) !== 0 ||
    (p.bank ?? 0) !== 0 ||
    (p.bevel ?? 0) !== 0 ||
    !finite(size) ||
    size < 0.1 ||
    !Array.isArray(p.cells) ||
    !p.cells.length ||
    p.cells.length > 10000 ||
    Math.abs(p.w / size - Math.round(p.w / size)) > 1e-6 ||
    Math.abs(p.d / size - Math.round(p.d / size)) > 1e-6
  )
    throw Error("Invalid terrain grid.");
  const occupied = new Set();
  for (const c of p.cells) {
    if (
      !Array.isArray(c) ||
      c.length !== 6 ||
      !Number.isInteger(c[0]) ||
      !Number.isInteger(c[1]) ||
      c[0] < 0 ||
      c[1] < 0 ||
      c[0] >= Math.round(p.w / size) ||
      c[1] >= Math.round(p.d / size) ||
      !c
        .slice(2)
        .every((h) => h === null || (finite(h) && h > -(p.h ?? 0.5))) ||
      c[2] === null ||
      c[5] === null ||
      (c[3] === null && c[4] === null)
    )
      throw Error("Invalid terrain cell.");
    const key = `${c[0]},${c[1]}`;
    if (occupied.has(key)) throw Error("Duplicate terrain cell.");
    occupied.add(key);
  }
  validateTerrainTunnels(p, finite);
}

export function terrainGeometry(p) {
  if (p.tunnels?.length) return terrainTunnelGeometry(p);
  const triangles = [],
    edges = new Map(),
    levels = new Map();
  const base = -(p.h ?? 0.5),
    size = p.cellSize;
  const horizontalKey = (v) => `${v[0].toFixed(7)},${v[2].toFixed(7)}`;
  const keyOfEdge = (a, b) =>
    [horizontalKey(a), horizontalKey(b)].sort().join("|");
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const remember = (v) => {
    const key = horizontalKey(v);
    if (!levels.has(key)) levels.set(key, new Set([base]));
    levels.get(key).add(v[1]);
  };
  const addTop = (vertices) => {
    const t = { vertices, edges: [] };
    for (let i = 0; i < 3; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % 3];
      const edge = { a, b, cut: null };
      const key = keyOfEdge(a, b);
      if (!edges.has(key)) edges.set(key, []);
      edges.get(key).push(edge);
      t.edges.push(edge);
      remember(a);
    }
    triangles.push(t);
  };
  for (const [x, z, h00, h10, h01, h11] of p.cells) {
    const at = (dx, dz, height) => [
      -p.w / 2 + (x + dx) * size,
      height,
      -p.d / 2 + (z + dz) * size,
    ];
    const a = at(0, 0, h00),
      b = at(1, 0, h10),
      c = at(0, 1, h01),
      d = at(1, 1, h11);
    if ([h00, h01, h11].every((h) => h !== null)) addTop([a, c, d]);
    if ([h00, h11, h10].every((h) => h !== null)) addTop([a, d, b]);
  }
  // Where two adjacent edge profiles cross, split both faces at the same
  // intersection. This preserves the original planes without a T junction.
  for (const adjacent of edges.values()) {
    if (adjacent.length !== 2) continue;
    const [a, b] = adjacent;
    const da = a.a[1] - b.b[1],
      db = a.b[1] - b.a[1];
    if (da * db < 0) {
      const cut = mix(a.a, a.b, da / (da - db));
      a.cut = b.cut = cut;
      remember(cut);
    }
  }

  const vertices = [],
    indices = [],
    roles = [],
    welded = new Map();
  const cs = Math.cos(p.angle ?? 0),
    sn = Math.sin(p.angle ?? 0);
  const put = ([x, y, z]) => {
    const v = [x * cs - z * sn, y, x * sn + z * cs];
    const key = v.map((n) => n.toFixed(7)).join(",");
    if (!welded.has(key)) {
      welded.set(key, vertices.length / 3);
      vertices.push(...v);
    }
    return welded.get(key);
  };
  const tri = (a, b, c, role) => {
    const u = b.map((n, i) => n - a[i]),
      v = c.map((n, i) => n - a[i]);
    const area = Math.hypot(
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    );
    if (area < 1e-10) return;
    indices.push(put(a), put(b), put(c));
    roles.push(role);
  };
  const polygon = (points, role) => {
    // An interior fan retains collinear boundary vertices on split wall edges.
    if (points.length === 3) return tri(...points, role);
    const center = [0, 1, 2].map(
      (i) => points.reduce((sum, v) => sum + v[i], 0) / points.length,
    );
    for (let i = 0; i < points.length; i++)
      tri(center, points[i], points[(i + 1) % points.length], role);
  };
  for (const t of triangles) {
    const points = t.edges.flatMap((e) => (e.cut ? [e.a, e.cut] : [e.a]));
    polygon(points, "top");
    polygon(points.map((v) => [v[0], base, v[2]]).reverse(), "side");
  }
  const wall = (a, b, lowA, lowB) => {
    const down = (v, low) =>
      [...(levels.get(horizontalKey(v)) ?? [])]
        .filter((y) => y < v[1] - 1e-9 && y > low + 1e-9)
        .sort((a, b) => b - a)
        .map((y) => [v[0], y, v[2]]);
    polygon(
      [
        a,
        ...down(a, lowA),
        [a[0], lowA, a[2]],
        [b[0], lowB, b[2]],
        ...down(b, lowB).reverse(),
        b,
      ],
      "side",
    );
  };
  for (const adjacent of edges.values()) {
    const [a, b] = adjacent;
    if (!b) {
      wall(a.a, a.b, base, base);
      continue;
    }
    const points = a.cut
      ? [
          0,
          Math.hypot(a.cut[0] - a.a[0], a.cut[2] - a.a[2]) /
            Math.hypot(a.b[0] - a.a[0], a.b[2] - a.a[2]),
          1,
        ]
      : [0, 1];
    for (let i = 1; i < points.length; i++) {
      const u = points[i - 1],
        v = points[i];
      const a0 = mix(a.a, a.b, u),
        a1 = mix(a.a, a.b, v);
      const b0 = mix(b.b, b.a, u),
        b1 = mix(b.b, b.a, v);
      const difference = a0[1] + a1[1] - (b0[1] + b1[1]);
      if (difference > 1e-9) wall(a0, a1, b0[1], b1[1]);
      else if (difference < -1e-9) wall(b1, b0, a1[1], a0[1]);
    }
  }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}
