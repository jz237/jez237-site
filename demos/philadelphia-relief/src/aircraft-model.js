/** Original generic aircraft silhouette, metres, glTF Y-up with nose along +X. */
export function aircraftGeometry() {
  const positions = [], colors = [], normals = [];
  function triangle(a, b, c, color) {
    const u = b.map((v, i) => v - a[i]), v = c.map((n, i) => n - a[i]);
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...n) || 1;
    for (const p of [a, b, c]) {
      positions.push(...p); colors.push(...color); normals.push(...n.map(x => x / length));
    }
  }
  const white = [.85, .92, .95], teal = [.13, .7, .76], dark = [.07, .18, .24];
  function tube(rings, z = 0, y = 0, color = white) {
    for (let r = 1; r < rings.length; r++) for (let i = 0; i < 12; i++) {
      const p = (ring, step) => [ring[0], y + Math.cos(step * Math.PI / 6) * ring[1],
        z + Math.sin(step * Math.PI / 6) * ring[1]];
      const a = p(rings[r - 1], i), b = p(rings[r], i), c = p(rings[r], i + 1);
      const d = p(rings[r - 1], i + 1);
      triangle(a, b, c, color); triangle(a, c, d, color);
    }
  }
  tube([[-20, .15], [-13, 1.5], [10, 1.8], [15, 1.3], [20, 0]]);
  for (const side of [-1, 1]) {
    triangle([5, 0, side], [-6, .3, side * 18], [-11, 0, side * 17], white);
    triangle([5, 0, side], [-11, 0, side * 17], [-7, 0, side], white);
    triangle([-12, 1, side], [-18, 1.7, side * 7], [-20, 1, side], teal);
    tube([[-5, 0], [-5, 1], [1, 1.15], [1, 0]], side * 6, -1.3, dark);
    triangle([12, 1.7, side * .4], [15, 1.2, side * .3], [13, 1.25, side * 1.1], dark);
  }
  triangle([-11, 1, 0], [-17, 8, 0], [-20, 1, 0], teal);
  return { positions, normals, colors };
}
