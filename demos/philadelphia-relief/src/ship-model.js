// Original generic vessel, metres, Y-up with bow along +X. Not an identification model.
export function shipGeometry() {
  const positions = [], normals = [], colors = [];
  function tri(a, b, c, color) {
    const u = b.map((v, i) => v - a[i]), v = c.map((n, i) => n - a[i]);
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...n) || 1;
    for (const p of [a, b, c]) {
      positions.push(...p); normals.push(...n.map(x => x / length)); colors.push(...color);
    }
  }
  const hull = [[-24, 0, -7], [16, 0, -7], [28, 0, 0], [16, 0, 7], [-24, 0, 7]];
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    tri([0, 4, 0], [a[0], 4, a[2]], [b[0], 4, b[2]], [.17, .48, .5]);
    tri(a, b, [b[0], 4, b[2]], [.05, .15, .2]);
    tri(a, [b[0], 4, b[2]], [a[0], 4, a[2]], [.05, .15, .2]);
  }
  function box(x, y, z, w, h, d, color) {
    const points = [[x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
      [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d]];
    for (const [a, b, c, e] of [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
      [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]) {
      tri(points[a], points[b], points[c], color); tri(points[a], points[c], points[e], color);
    }
  }
  box(-20, 4, -5, 12, 7, 10, [.9, .93, .85]);
  box(-19, 9, -5.2, 10, 1.5, 10.4, [.1, .32, .42]);
  box(-15, 11, -1, 3, 6, 2, [.95, .62, .22]);
  for (let x = -4; x < 15; x += 8) box(x, 4, -5, 7, 4, 10, [.76, .39, .21]);
  return { positions, normals, colors };
}
