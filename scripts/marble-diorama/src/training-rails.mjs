// A closed, rounded rail. The same triangles are rendered and collide.
// Rise follows the supporting board, including the rounded ends.
export function railGeometry(p) {
  const vertices = [],
    indices = [],
    roles = [],
    rings = [];
  const radial = 24,
    caps = 8,
    radius = p.w / 2;
  const straight = (p.d - p.w) / 2;
  const cs = Math.cos(p.angle ?? 0),
    sn = Math.sin(p.angle ?? 0);
  function ring(z, r) {
    const ids = [],
      count = r < 1e-9 ? 1 : radial;
    for (let i = 0; i < count; i++) {
      const a = (i * 2 * Math.PI) / radial;
      const x = r * Math.cos(a);
      const y =
        -p.h / 2 +
        (r * Math.sin(a) * p.h) / p.w +
        (p.rise ?? 0) * (z / p.d + 0.5);
      ids.push(vertices.length / 3);
      vertices.push(x * cs - z * sn, y, x * sn + z * cs);
    }
    rings.push(ids);
  }
  for (let i = 0; i <= caps; i++) {
    const a = ((i / caps) * Math.PI) / 2;
    ring(-straight - radius * Math.cos(a), radius * Math.sin(a));
  }
  for (let i = 0; i <= caps; i++) {
    const a = ((i / caps) * Math.PI) / 2;
    ring(straight + radius * Math.sin(a), radius * Math.cos(a));
  }
  const tri = (a, b, c) => {
    indices.push(a, b, c);
    roles.push("top");
  };
  for (let j = 0; j < rings.length - 1; j++) {
    const a = rings[j],
      b = rings[j + 1];
    for (let i = 0; i < radial; i++) {
      const k = (i + 1) % radial;
      if (a.length === 1) tri(a[0], b[k], b[i]);
      else if (b.length === 1) tri(a[i], a[k], b[0]);
      else {
        tri(a[i], a[k], b[k]);
        tri(a[i], b[k], b[i]);
      }
    }
  }
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}

// Original actor windows, with integer actor-minus-player coordinates.
// These describe source rebound decisions, not extra invisible colliders.
export function trainingRailContact(type, dx, dz, vx, vz) {
  const alongX = [27, 28, 30].includes(type);
  if (![26, 27, 28, 29, 30, 31].includes(type)) return null;
  const long = alongX ? dx : dz,
    cross = alongX ? dz : dx;
  const v = alongX ? vx : vz;
  const wide = type === 30 || type === 31;
  const lo = wide ? -12 : -8,
    hi = type === 30 ? 94 : type === 31 ? 84 : 32;
  const near = wide ? -4 : 0,
    far = hi - 8;
  const crossLo = wide ? -14 : type === 28 || type === 29 ? -8 : -12;
  const crossHi = type === 28 || type === 29 ? 4 : 0;
  if (long <= lo || long >= hi || cross <= crossLo || cross >= crossHi)
    return null;
  const end = (long < near && v < 0) || (long > far && v > 0);
  return {
    reboundX: alongX ? end : true,
    reboundZ: alongX ? true : end,
    sound: 34,
  };
}
