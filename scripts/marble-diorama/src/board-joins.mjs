import polygonClipping from "polygon-clipping";
import { ShapeUtils, Vector2 } from "three";
// Resolve shared ribbon ends before compiling either render or collision meshes.
// Work in world space so rotated/custom pieces receive the same joins.
export function joinedBoardParts(parts) {
  const result = parts.map((p) =>
    p.kind === "ribbon" && !p.motion ? { ...p, joins: {} } : p,
  );
  const groups = new Map();
  for (const p of result) {
    if (p.kind !== "ribbon" || p.motion) continue;
    const c = Math.cos(p.angle ?? 0),
      s = Math.sin(p.angle ?? 0);
    for (const end of [0, p.path.length - 1]) {
      const a = p.path[end],
        b = p.path[end === 0 ? 1 : end - 1];
      const x = p.x + a.x * c - a.z * s,
        y = p.y + a.y,
        z = p.z + a.x * s + a.z * c;
      const key = [x, y, z].map((n) => n.toFixed(4)).join(",");
      const dx = (b.x - a.x) * c - (b.z - a.z) * s,
        dz = (b.x - a.x) * s + (b.z - a.z) * c,
        len = Math.hypot(dx, dz);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({
        p,
        end,
        x,
        y,
        z,
        dx: dx / len,
        dz: dz / len,
        width: a.width ?? p.width ?? 4,
        bank: a.bank ?? p.bank ?? 0,
      });
    }
  }
  for (const ends of groups.values()) {
    if (ends.length < 2) continue;
    if (ends.length === 2) {
      const [a, b] = ends;
      // A shared mitre closes the triangular crack left by independent caps.
      let nx = a.dz - b.dz,
        nz = -a.dx + b.dx,
        len = Math.hypot(nx, nz);
      if (len < 0.5) continue;
      nx /= len;
      nz /= len;
      const divisor = Math.abs(nx * a.dz - nz * a.dx);
      if (divisor < 0.45) continue;
      const width = Math.min(a.width, b.width);
      for (const e of ends) {
        const sign = e.end === 0 ? 1 : -1,
          c = Math.cos(e.p.angle ?? 0),
          s = Math.sin(e.p.angle ?? 0);
        let ex = nx,
          ez = nz;
        if (ex * e.dz - ez * e.dx < 0) {
          ex = -ex;
          ez = -ez;
        }
        e.p.joins[e.end] = {
          cross: {
            x: ((ex * c + ez * s) * sign) / divisor,
            z: ((-ex * s + ez * c) * sign) / divisor,
          },
          width,
          bank: Math.min(a.bank, b.bank),
          flat: 0.9,
        };
      }
    } else {
      // A small rounded landing closes multi-way forks. All incoming ribbons
      // meet its plane before descending, eliminating intersecting wedge tips.
      const a = ends[0],
        radius = Math.max(...ends.map((e) => e.width)) / 2;
      for (const e of ends)
        e.p.joins[e.end] = { flat: radius, fork: true, bank: 0 };
      result.push({
        id: `join-${a.p.id}-${a.end}`,
        kind: "polygon",
        x: a.x,
        y: a.y,
        z: a.z,
        w: radius * 2,
        d: radius * 2,
        h: a.y + 3,
        material: a.p.material ?? "stone",
        angle: 0,
        outline: Array.from({ length: 40 }, (_, i) => ({
          x: Math.cos((i * Math.PI) / 20) * radius,
          z: Math.sin((i * Math.PI) / 20) * radius,
        })),
      });
    }
  }
  return result;
}

// Union level top faces into a single sheet, removing overlapping coplanar
// triangles (depth flicker / dark seams). Holes remain holes, and the resulting
// triangles are shared by the renderer and physics.
export function mergeLevelTops(group) {
  const levels = new Map(),
    keep = [];
  for (const face of group.faces.values()) {
    const pts = face.t.map((id) => group.vertices.slice(id * 3, id * 3 + 3));
    if (
      face.role !== "top" ||
      Math.max(...pts.map((v) => v[1])) - Math.min(...pts.map((v) => v[1])) >
        1e-7
    ) {
      keep.push(face);
      continue;
    }
    const y = pts[0][1],
      key = y.toFixed(6);
    if (!levels.has(key)) levels.set(key, { y, polygons: [] });
    const ring = pts.map((v) => [
      Math.round(v[0] * 1e6) / 1e6,
      Math.round(v[2] * 1e6) / 1e6,
    ]);
    const area =
      (ring[1][0] - ring[0][0]) * (ring[2][1] - ring[0][1]) -
      (ring[1][1] - ring[0][1]) * (ring[2][0] - ring[0][0]);
    if (Math.abs(area) > 1e-10) levels.get(key).polygons.push([ring]);
  }
  const vertex = (x, y, z) => {
    const key = [x, y, z].map((n) => n.toFixed(6)).join(",");
    if (!group.keys.has(key)) {
      group.keys.set(key, group.vertices.length / 3);
      group.vertices.push(x, y, z);
    }
    return group.keys.get(key);
  };
  for (const { y, polygons } of levels.values()) {
    if (!polygons.length) continue;
    const merged = polygonClipping.union(polygons);
    for (const polygon of merged) {
      const rings = polygon.map((r) =>
        r.slice(0, -1).map((v) => new Vector2(...v)),
      );
      const points = rings.flat(),
        tris = ShapeUtils.triangulateShape(rings[0], rings.slice(1));
      for (const ids of tris) {
        const [a, b, c] = ids.map((i) => points[i]);
        if ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0)
          [ids[1], ids[2]] = [ids[2], ids[1]];
        keep.push({
          t: ids.map((i) => vertex(points[i].x, y, points[i].y)),
          role: "top",
        });
      }
    }
  }
  return keep;
}
