// Grid-aligned underpasses retain a floor, roof and closed side walls. These
// are actual solid intervals, used by both the visible mesh and its collider.
export function validateTerrainTunnels(p, finite) {
  if (p.tunnels === undefined) return;
  if (!Array.isArray(p.tunnels) || !p.tunnels.length || p.tunnels.length > 8)
    throw Error("Invalid terrain tunnels.");
  const used = new Set();
  const cells = new Map(p.cells.map((c) => [`${c[0]},${c[1]}`, c]));
  for (const t of p.tunnels) {
    if (
      !t ||
      ![t.columns, t.rows].every(
        (r, i) =>
          Array.isArray(r) &&
          r.length === 2 &&
          r.every(Number.isInteger) &&
          r[0] >= 0 &&
          r[1] > r[0] &&
          r[1] <= Math.round((i ? p.d : p.w) / p.cellSize),
      ) ||
      !finite(t.floor) ||
      !finite(t.ceiling) ||
      t.floor <= -(p.h ?? 0.5) ||
      t.ceiling - t.floor < 0.1
    )
      throw Error("Invalid terrain tunnel bounds.");
    for (let x = t.columns[0]; x < t.columns[1]; x++)
      for (let z = t.rows[0]; z < t.rows[1]; z++) {
        const key = `${x},${z}`,
          c = cells.get(key);
        if (
          used.has(key) ||
          !c ||
          c.slice(2).some((h) => h === null || h <= t.ceiling)
        )
          throw Error(
            "Terrain tunnels need separate complete cells with a solid roof.",
          );
        used.add(key);
      }
  }
}

export function terrainTunnelGeometry(p) {
  const base = -(p.h ?? 0.5),
    size = p.cellSize;
  const faces = [],
    edges = new Map(),
    levels = new Map();
  const key = (v) => `${v[0].toFixed(7)},${v[2].toFixed(7)}`;
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const remember = (v) => {
    if (!levels.has(key(v))) levels.set(key(v), new Set());
    levels.get(key(v)).add(v[1]);
  };
  function column(top, intervals) {
    const face = { intervals, edges: [] };
    for (let i = 0; i < 3; i++) {
      const a = top[i],
        b = top[(i + 1) % 3];
      const edge = { a, b, intervals, cuts: [0, 1] };
      const k = [key(a), key(b)].sort().join("|");
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k).push(edge);
      face.edges.push(edge);
      for (const [low, high] of intervals)
        for (const y of [low, high ?? a[1]]) remember([a[0], y, a[2]]);
    }
    faces.push(face);
  }
  for (const [x, z, h00, h10, h01, h11] of p.cells) {
    const tunnel = p.tunnels.find(
      (t) =>
        x >= t.columns[0] &&
        x < t.columns[1] &&
        z >= t.rows[0] &&
        z < t.rows[1],
    );
    const intervals = tunnel
      ? [
          [base, tunnel.floor],
          [tunnel.ceiling, null],
        ]
      : [[base, null]];
    const at = (dx, dz, h) => [
      -p.w / 2 + (x + dx) * size,
      h,
      -p.d / 2 + (z + dz) * size,
    ];
    const a = at(0, 0, h00),
      b = at(1, 0, h10),
      c = at(0, 1, h01),
      d = at(1, 1, h11);
    if (h01 !== null) column([a, c, d], intervals);
    if (h10 !== null) column([a, d, b], intervals);
  }
  const profiles = (e, reverse = false) =>
    e.intervals.flatMap(([lo, hi]) => [
      [lo, lo],
      hi === null ? (reverse ? [e.b[1], e.a[1]] : [e.a[1], e.b[1]]) : [hi, hi],
    ]);
  const value = (line, t) => line[0] + (line[1] - line[0]) * t;
  // Split wherever an adjacent roof crosses a tunnel floor/ceiling or roof.
  for (const pair of edges.values()) {
    const [a, b] = pair,
      lines = [...profiles(a), ...(b ? profiles(b, true) : [])];
    const cuts = new Set([0, 1]);
    for (let i = 0; i < lines.length; i++)
      for (let j = i + 1; j < lines.length; j++) {
        const d0 = lines[i][0] - lines[j][0],
          d1 = lines[i][1] - lines[j][1];
        if (d0 * d1 < 0) cuts.add(d0 / (d0 - d1));
      }
    a.cuts = [...cuts].sort((x, y) => x - y);
    if (b) b.cuts = a.cuts.map((t) => 1 - t).reverse();
    for (const t of a.cuts) {
      const v = mix(a.a, a.b, t);
      for (const line of lines) remember([v[0], value(line, t), v[2]]);
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
    const k = v.map((n) => n.toFixed(7)).join(",");
    if (!welded.has(k)) {
      welded.set(k, vertices.length / 3);
      vertices.push(...v);
    }
    return welded.get(k);
  };
  function tri(a, b, c, role) {
    const u = b.map((n, i) => n - a[i]),
      v = c.map((n, i) => n - a[i]);
    if (
      Math.hypot(
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
      ) < 1e-10
    )
      return;
    indices.push(put(a), put(b), put(c));
    roles.push(role);
  }
  function polygon(points, role) {
    if (points.length === 3) return tri(...points, role);
    const center = [0, 1, 2].map(
      (i) => points.reduce((s, v) => s + v[i], 0) / points.length,
    );
    for (let i = 0; i < points.length; i++)
      tri(center, points[i], points[(i + 1) % points.length], role);
  }
  for (const face of faces) {
    const boundary = face.edges.flatMap((e) =>
      e.cuts.slice(0, -1).map((t) => mix(e.a, e.b, t)),
    );
    for (const [lo, hi] of face.intervals) {
      polygon(
        boundary.map((v) => [v[0], hi ?? v[1], v[2]]),
        hi === null ? "top" : "side",
      );
      polygon(boundary.map((v) => [v[0], lo, v[2]]).reverse(), "side");
    }
  }
  const inside = (lines, y, t) =>
    lines.some(
      (line, i) =>
        i % 2 === 0 && y > value(line, t) && y < value(lines[i + 1], t),
    );
  for (const [a, b] of edges.values()) {
    const aa = profiles(a),
      bb = b ? profiles(b, true) : [];
    for (let i = 1; i < a.cuts.length; i++) {
      const t0 = a.cuts[i - 1],
        t1 = a.cuts[i],
        mid = (t0 + t1) / 2;
      const sorted = [...aa, ...bb].sort(
        (u, v) => value(u, mid) - value(v, mid),
      );
      for (let j = 1; j < sorted.length; j++) {
        const lo = sorted[j - 1],
          hi = sorted[j],
          y = (value(lo, mid) + value(hi, mid)) / 2;
        if (value(hi, mid) - value(lo, mid) < 1e-9) continue;
        const inA = inside(aa, y, mid),
          inB = inside(bb, y, mid);
        if (inA === inB) continue;
        const v0 = mix(a.a, a.b, t0),
          v1 = mix(a.a, a.b, t1);
        const vertical = (v, t) =>
          [...(levels.get(key(v)) ?? [])]
            .filter((h) => h > value(lo, t) + 1e-9 && h < value(hi, t) - 1e-9)
            .sort((u, v) => v - u)
            .map((h) => [v[0], h, v[2]]);
        const points = [
          [v0[0], value(hi, t0), v0[2]],
          ...vertical(v0, t0),
          [v0[0], value(lo, t0), v0[2]],
          [v1[0], value(lo, t1), v1[2]],
          ...vertical(v1, t1).reverse(),
          [v1[0], value(hi, t1), v1[2]],
        ];
        polygon(inA ? points : points.reverse(), "side");
      }
    }
  }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}
