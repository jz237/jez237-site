import { ShapeUtils, Vector2, Vector3, CatmullRomCurve3 } from "three";

// Short quadratic fillets preserve the end points of shared joins and remove
// sharp corners from the same surface that both the renderer and Rapier use.
function roundedPath(points, closed, amount) {
  const result = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!closed && (i === 0 || i === points.length - 1)) {
      result.push(p);
      continue;
    }
    const a = points[(i - 1 + points.length) % points.length],
      b = points[(i + 1) % points.length],
      la = Math.hypot(p.x - a.x, p.z - a.z),
      lb = Math.hypot(b.x - p.x, b.z - p.z),
      distance = Math.min(amount, la * 0.22, lb * 0.22),
      ta = distance / la,
      tb = distance / lb;
    const blend = (a, b, t) => {
      const q = { ...p };
      for (const key of ["x", "y", "z", "bank", "width"])
        if (a[key] !== undefined && b[key] !== undefined)
          q[key] = a[key] + (b[key] - a[key]) * t;
      return q;
    };
    const entry = blend(p, a, ta),
      exit = blend(p, b, tb);
    for (let j = 0; j <= 6; j++) {
      const t = j / 6;
      result.push(blend(blend(entry, p, t), blend(p, exit, t), t));
    }
  }
  return result;
}

export function tubeGeometry(p) {
  const curve = new CatmullRomCurve3(
    p.path.map((v) => new Vector3(v.x, v.y, v.z)),
    false,
    "centripetal",
  );
  const count = Math.max(24, Math.ceil(curve.getLength() * 8)),
    rings = 24,
    r = p.radius ?? 1.4,
    thickness = p.thickness ?? 0.15;
  const frames = curve.computeFrenetFrames(count, false),
    b = builder(p.angle);
  const quad = (a, c, d, e) => b.quad(e, d, c, a);
  const at = (i, k, radius) => {
    const a = (k / rings) * Math.PI * 2,
      v = curve.getPointAt(i / count);
    v.addScaledVector(frames.normals[i], Math.cos(a) * radius).addScaledVector(
      frames.binormals[i],
      Math.sin(a) * radius,
    );
    return v.toArray();
  };
  for (let i = 0; i < count; i++)
    for (let k = 0; k < rings; k++) {
      quad(at(i, k, r), at(i, k + 1, r), at(i + 1, k + 1, r), at(i + 1, k, r));
      quad(
        at(i, k, r + thickness),
        at(i + 1, k, r + thickness),
        at(i + 1, k + 1, r + thickness),
        at(i, k + 1, r + thickness),
      );
    }
  for (let k = 0; k < rings; k++) {
    quad(
      at(0, k, r),
      at(0, k, r + thickness),
      at(0, k + 1, r + thickness),
      at(0, k + 1, r),
    );
    quad(
      at(count, k, r),
      at(count, k + 1, r),
      at(count, k + 1, r + thickness),
      at(count, k, r + thickness),
    );
  }
  return b.result();
}

// These generators return collision/render geometry together. They never apply
// a cosmetic displacement or create a second collision-only shape.
function builder(angle = 0) {
  const vertices = [],
    indices = [],
    roles = [],
    keys = new Map(),
    c = Math.cos(angle),
    s = Math.sin(angle);
  const vertex = ([x, y, z]) => {
    const v = [x * c - z * s, y, x * s + z * c],
      key = v.map((x) => x.toFixed(7)).join(",");
    if (keys.has(key)) return keys.get(key);
    const id = vertices.length / 3;
    keys.set(key, id);
    vertices.push(...v);
    return id;
  };
  const tri = (a, b, c, role = "top") => {
    indices.push(vertex(a), vertex(b), vertex(c));
    roles.push(role);
  };
  const quad = (a, b, c, d, role = "top") => {
    tri(a, b, c, role);
    tri(a, c, d, role);
  };
  return {
    tri,
    quad,
    result: () => ({
      vertices: new Float32Array(vertices),
      indices: new Uint32Array(indices),
      roles,
    }),
  };
}

export function ribbonGeometry(p) {
  const b = builder(p.angle),
    path = p.path,
    rows = [];
  // Mitred joins use the shared cross-section at both adjacent segments.
  // The author supplies corner points; straight spans are sampled at <= 0.5u.
  const normals = path.slice(0, -1).map((a, i) => {
    const next = path[i + 1],
      dx = next.x - a.x,
      dz = next.z - a.z,
      len = Math.hypot(dx, dz);
    if (len < 0.05)
      throw Error("Ribbon points must have distinct horizontal positions.");
    return { x: dz / len, z: -dx / len };
  });
  const cross = path.map((a, i) => {
    const n0 = normals[Math.max(0, i - 1)],
      n1 = normals[Math.min(normals.length - 1, i)];
    const nx = n0.x + n1.x,
      nz = n0.z + n1.z,
      len = Math.hypot(nx, nz);
    if (len < 0.2)
      throw Error("Ribbon cannot reverse at one point; use a turning arc.");
    const nxu = nx / len,
      nzu = nz / len,
      div = nxu * n1.x + nzu * n1.z;
    if (div < 0.3) throw Error("Ribbon bend is too sharp for a safe mitre.");
    return { x: nxu / div, z: nzu / div };
  });
  const originalCross = cross.map((v) => ({ ...v }));
  for (const [end, join] of Object.entries(p.joins ?? {}))
    if (join.cross) cross[Number(end)] = join.cross;
  const widthAt = (pnt) => pnt.width ?? p.width ?? 4;
  const bankAt = (pnt) => pnt.bank ?? p.bank ?? 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i],
      z = path[i + 1],
      steps = Math.ceil(Math.hypot(z.x - a.x, z.z - a.z) * 2);
    for (let j = 0; j < (i === path.length - 2 ? steps + 1 : steps); j++) {
      const t = j / steps;
      const length = Math.hypot(z.x - a.x, z.z - a.z);
      let heightT = t;
      // At multi-way forks the small central landing and incoming edges meet
      // on one plane. Ease back to the original grade outside that landing.
      for (const [end, join] of Object.entries(p.joins ?? {})) {
        if (!join.fork) continue;
        const start = Number(end) === 0;
        if (start ? i !== 0 : i !== path.length - 2) continue;
        const flat = Math.min(join.flat, length * 0.24),
          blend = Math.min(1, length * 0.16);
        const distance = (start ? t : 1 - t) * length;
        if (distance < flat + blend) {
          const u = Math.max(0, (distance - flat) / blend);
          const h =
            ((flat + blend) * (3 * u * u - 2 * u * u * u) +
              blend * (u * u * u - u * u)) /
            length;
          heightT = start ? h : 1 - h;
        }
      }
      const blendCross = (axis) => {
        let n =
          originalCross[i][axis] +
          (originalCross[i + 1][axis] - originalCross[i][axis]) * t;
        if (i === 0 && p.joins?.[0]?.cross)
          n +=
            (cross[0][axis] - originalCross[0][axis]) *
            Math.max(0, 1 - (t * length) / 1.5) ** 2;
        if (i === path.length - 2 && p.joins?.[path.length - 1]?.cross)
          n +=
            (cross[i + 1][axis] - originalCross[i + 1][axis]) *
            Math.max(0, 1 - ((1 - t) * length) / 1.5) ** 2;
        return n;
      };
      const blendSection = (key, base) => {
        if (i === 0 && p.joins?.[0]?.[key] !== undefined)
          base +=
            (p.joins[0][key] - (key === "width" ? widthAt(a) : bankAt(a))) *
            Math.max(0, 1 - (t * length) / 1.5) ** 2;
        if (
          i === path.length - 2 &&
          p.joins?.[path.length - 1]?.[key] !== undefined
        )
          base +=
            (p.joins[path.length - 1][key] -
              (key === "width" ? widthAt(z) : bankAt(z))) *
            Math.max(0, 1 - ((1 - t) * length) / 1.5) ** 2;
        return base;
      };
      rows.push({
        x: a.x + (z.x - a.x) * t,
        y: a.y + (z.y - a.y) * heightT,
        z: a.z + (z.z - a.z) * t,
        nx: blendCross("x"),
        nz: blendCross("z"),
        width: blendSection(
          "width",
          widthAt(a) + (widthAt(z) - widthAt(a)) * t,
        ),
        bank: blendSection("bank", bankAt(a) + (bankAt(z) - bankAt(a)) * t),
      });
    }
  }
  const bands = 16;
  const rawAt = (row, k) => {
    const q = (k / bands) * 2 - 1,
      r = rows[row];
    return [
      r.x + ((r.nx * r.width) / 2) * q,
      r.y + r.bank * q * q,
      r.z + ((r.nz * r.width) / 2) * q,
    ];
  };
  const at = (row, k) => {
    const original = rawAt(row, k);
    if (row < 3 || row >= rows.length - 3) return original;
    const amount = Math.pow(Math.abs((k / bands) * 2 - 1), 4),
      sum = [0, 0, 0];
    let weight = 0;
    for (let offset = -3; offset <= 3; offset++) {
      const p = rawAt(row + offset, k),
        w = 4 - Math.abs(offset);
      for (let axis = 0; axis < 3; axis++) sum[axis] += p[axis] * w;
      weight += w;
    }
    return original.map((v, axis) => v + (sum[axis] / weight - v) * amount);
  };
  for (let i = 0; i < rows.length - 1; i++)
    for (let k = 0; k < bands; k++)
      b.quad(at(i, k), at(i + 1, k), at(i + 1, k + 1), at(i, k + 1));
  const bottom = p.bottom ?? Math.min(...path.map((a) => a.y)) - (p.h ?? 1);
  for (let i = 0; i < rows.length - 1; i++)
    for (const side of [0, bands]) {
      const a = at(i, side),
        z = at(i + 1, side);
      if (side === 0)
        b.quad(z, a, [a[0], bottom, a[2]], [z[0], bottom, z[2]], "side");
      else b.quad(a, z, [z[0], bottom, z[2]], [a[0], bottom, a[2]], "side");
    }
  for (const i of [0, rows.length - 1])
    for (let k = 0; k < bands; k++) {
      if (p.joins?.[i === 0 ? 0 : path.length - 1]) continue;
      const a = at(i, k),
        z = at(i, k + 1);
      if (i === 0)
        b.quad(a, z, [z[0], bottom, z[2]], [a[0], bottom, a[2]], "side");
      else b.quad(z, a, [a[0], bottom, a[2]], [z[0], bottom, z[2]], "side");
    }
  for (let i = 0; i < rows.length - 1; i++) {
    const a = at(i, 0),
      z = at(i, bands),
      aa = at(i + 1, 0),
      zz = at(i + 1, bands);
    b.quad(
      [a[0], bottom, a[2]],
      [z[0], bottom, z[2]],
      [zz[0], bottom, zz[2]],
      [aa[0], bottom, aa[2]],
      "side",
    );
  }
  return b.result();
}

export function polygonGeometry(p) {
  const outline = roundedPath(p.outline, true, 0.8);
  const b = builder(p.angle),
    points = outline.map((a) => new Vector2(a.x, a.z)),
    tris = ShapeUtils.triangulateShape(points, []),
    bottom = -(p.h ?? 1);
  // Earcut's triangle orientation depends on outline winding: establish +Y.
  for (const ids of tris) {
    const a = outline[ids[0]],
      z = outline[ids[1]],
      c = outline[ids[2]],
      cross = (z.x - a.x) * (c.z - a.z) - (z.z - a.z) * (c.x - a.x);
    const v = [a, z, c].map((v) => [v.x, 0, v.z]);
    if (cross > 0) [v[1], v[2]] = [v[2], v[1]];
    b.tri(...v);
    b.tri(
      [v[0][0], bottom, v[0][2]],
      [v[2][0], bottom, v[2][2]],
      [v[1][0], bottom, v[1][2]],
      "side",
    );
  }
  const clockwise = ShapeUtils.isClockWise(points);
  for (let i = 0; i < points.length; i++) {
    const a = points[i],
      z = points[(i + 1) % points.length],
      v = [
        [a.x, 0, a.y],
        [z.x, 0, z.y],
        [z.x, bottom, z.y],
        [a.x, bottom, a.y],
      ];
    if (!clockwise) v.reverse();
    b.quad(...v, "side");
  }
  return b.result();
}

export function pyramidGeometry(p) {
  const rounded = builder(p.angle),
    segments = 40,
    radii = [1, 0.8, 0.6, 0.4, 0.25, 0.2, 0.15, 0.1, 0.05],
    rise = p.rise ?? 2;
  const ring = (r, k, y) => {
    const angle = -(k / segments) * Math.PI * 2,
      c = Math.cos(angle),
      s = Math.sin(angle);
    return [
      (p.w / 2) * Math.sign(c) * Math.sqrt(Math.abs(c)) * r,
      y,
      (p.d / 2) * Math.sign(s) * Math.sqrt(Math.abs(s)) * r,
    ];
  };
  const height = (r) => rise * (r >= 0.2 ? 1 - r : 0.9 - (r * r) / 0.4);
  for (let i = 0; i < radii.length - 1; i++)
    for (let k = 0; k < segments; k++)
      rounded.quad(
        ring(radii[i], k, height(radii[i])),
        ring(radii[i], k + 1, height(radii[i])),
        ring(radii[i + 1], k + 1, height(radii[i + 1])),
        ring(radii[i + 1], k, height(radii[i + 1])),
      );
  for (let k = 0; k < segments; k++) {
    rounded.tri(ring(0.05, k, height(0.05)), ring(0.05, k + 1, height(0.05)), [
      0,
      rise * 0.9,
      0,
    ]);
    rounded.quad(
      ring(1, k + 1, 0),
      ring(1, k, 0),
      ring(1, k, -(p.h ?? 0.8)),
      ring(1, k + 1, -(p.h ?? 0.8)),
      "side",
    );
    rounded.tri(
      ring(1, k + 1, -(p.h ?? 0.8)),
      ring(1, k, -(p.h ?? 0.8)),
      [0, -(p.h ?? 0.8), 0],
      "side",
    );
  }
  return rounded.result();
}
