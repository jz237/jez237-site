// The room the betta's fins keep round the driftwood and the rocks. A piece's solid obstacles are
// cores, a little inside its bark or its stone (the body is held off them); its fins, which lie on a
// thing rather than press into it, need its whole surface: capsules along the same axes, shorter
// (FIN_SPLIT long at the most), each wide enough (`fin`) to hold every vertex of the full-detail mesh
// nearest it, and its core, so that no fin laid on them goes into the wood or the stone anywhere,
// bulge, knot or fillet included. They carry no room for the route or the body (r and solid 0): only
// the fins meet them (bettaSpecimen.mjs, fin-dynamics.js through the fins state's solids; the swim's
// finGap). Measured once on the pieces as made at full detail (finCapsulesFrom, by
// tools/fin-room.mjs) and kept here, so they are the same at any detail and cost nothing to build;
// betta-fin-room.test.mjs holds every vertex of both details inside them.

/** The longest a fin capsule is (units), and the clearance it keeps beyond the farthest vertex. */
export const FIN_SPLIT = 0.05, FIN_MARGIN = 0.002;

/** A piece's fin capsules from its solid obstacles and its mesh's vertices (positions, xyz), those
 *  under the sand (below `floor`) left out: lying on the sand, its fins are held by the sand. */
export function finCapsulesFrom(obstacles, positions, floor = -Infinity) {
  const caps = [];
  for (const o of obstacles) {
    if (!(o.solid > 0)) continue;
    const ab = o.b.map((x, k) => x - o.a[k]), n = Math.max(1, Math.ceil(Math.hypot(...ab) / FIN_SPLIT));
    for (let k = 0; k < n; k++) caps.push({ a: o.a.map((x, c) => x + (ab[c] * k) / n), b: o.a.map((x, c) => x + (ab[c] * (k + 1)) / n), core: o.solid, reach: o.solid });
  }
  const along = (p, c) => {
    const ab = c.b.map((x, k) => x - c.a[k]), l2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
    const t = Math.max(0, Math.min(1, ((p[0] - c.a[0]) * ab[0] + (p[1] - c.a[1]) * ab[1] + (p[2] - c.a[2]) * ab[2]) / l2));
    return Math.hypot(p[0] - c.a[0] - ab[0] * t, p[1] - c.a[1] - ab[1] * t, p[2] - c.a[2] - ab[2] * t);
  };
  for (let v = 0; v < positions.length; v += 3) {
    const p = [positions[v], positions[v + 1], positions[v + 2]];
    if (p[1] < floor) continue;
    // (Each vertex belongs to the capsule whose core it is nearest the outside of.)
    let best = null, gap = Infinity, reach = 0;
    for (const c of caps) {
      const d = along(p, c);
      if (d - c.core < gap) { gap = d - c.core; best = c; reach = d; }
    }
    if (best) best.reach = Math.max(best.reach, reach);
  }
  const r3 = (x) => Math.round(x * 1000) / 1000;
  return caps.map((c) => ({ a: c.a.map(r3), b: c.b.map(r3), r: 0, solid: 0, fin: Math.ceil((c.reach + FIN_MARGIN) * 1000) / 1000 }));
}

/** The fin capsules measured for each piece: [ax, ay, az, bx, by, bz, fin] (filled in by tools/fin-room.mjs). */
export const FIN_ROOM = {
  wood: [
    [-0.505, -0.601, -0.054, -0.493, -0.57, -0.056, 0.11],
    [-0.493, -0.57, -0.056, -0.481, -0.538, -0.058, 0.118],
    [-0.481, -0.538, -0.058, -0.469, -0.507, -0.06, 0.108],
    [-0.469, -0.507, -0.06, -0.448, -0.481, -0.06, 0.124],
    [-0.448, -0.481, -0.06, -0.426, -0.456, -0.061, 0.112],
    [-0.426, -0.456, -0.061, -0.405, -0.43, -0.061, 0.112],
    [-0.405, -0.43, -0.061, -0.375, -0.415, -0.057, 0.123],
    [-0.375, -0.415, -0.057, -0.346, -0.399, -0.054, 0.12],
    [-0.346, -0.399, -0.054, -0.316, -0.384, -0.05, 0.122],
    [-0.316, -0.384, -0.05, -0.287, -0.376, -0.065, 0.084],
    [-0.287, -0.376, -0.065, -0.259, -0.367, -0.08, 0.084],
    [-0.259, -0.367, -0.08, -0.23, -0.359, -0.095, 0.098],
    [-0.23, -0.359, -0.095, -0.199, -0.352, -0.106, 0.08],
    [-0.199, -0.352, -0.106, -0.168, -0.344, -0.117, 0.082],
    [-0.168, -0.344, -0.117, -0.137, -0.337, -0.128, 0.079],
    [-0.137, -0.337, -0.128, -0.105, -0.327, -0.133, 0.099],
    [-0.105, -0.327, -0.133, -0.073, -0.318, -0.139, 0.1],
    [-0.073, -0.318, -0.139, -0.041, -0.308, -0.144, 0.104],
    [-0.041, -0.308, -0.144, -0.009, -0.299, -0.149, 0.105],
    [-0.009, -0.299, -0.149, 0.023, -0.289, -0.155, 0.118],
    [0.023, -0.289, -0.155, 0.055, -0.28, -0.16, 0.114],
    [0.055, -0.28, -0.16, 0.089, -0.277, -0.159, 0.088],
    [0.089, -0.277, -0.159, 0.122, -0.274, -0.159, 0.1],
    [0.122, -0.274, -0.159, 0.156, -0.271, -0.158, 0.099],
    [0.156, -0.271, -0.158, 0.204, -0.283, -0.162, 0.108],
    [0.204, -0.283, -0.162, 0.252, -0.296, -0.166, 0.098],
    [0.252, -0.296, -0.166, 0.294, -0.323, -0.168, 0.108],
    [0.294, -0.323, -0.168, 0.335, -0.351, -0.171, 0.112],
    [0.335, -0.351, -0.171, 0.357, -0.374, -0.161, 0.133],
    [0.357, -0.374, -0.161, 0.38, -0.396, -0.15, 0.14],
    [0.38, -0.396, -0.15, 0.402, -0.419, -0.14, 0.14],
    [0.402, -0.419, -0.14, 0.421, -0.447, -0.141, 0.096],
    [0.421, -0.447, -0.141, 0.439, -0.476, -0.141, 0.096],
    [0.439, -0.476, -0.141, 0.458, -0.504, -0.142, 0.096],
    [0.458, -0.504, -0.142, 0.469, -0.536, -0.141, 0.15],
    [0.469, -0.536, -0.141, 0.48, -0.567, -0.14, 0.125],
    [0.48, -0.567, -0.14, 0.491, -0.599, -0.139, 0.122],
    [0.491, -0.599, -0.139, 0.494, -0.633, -0.137, 0.119],
    [0.494, -0.633, -0.137, 0.498, -0.666, -0.136, 0.119],
    [0.498, -0.666, -0.136, 0.501, -0.7, -0.134, 0.119],
    [0.117, -0.272, -0.161, 0.127, -0.246, -0.187, 0.057],
    [0.127, -0.246, -0.187, 0.137, -0.219, -0.212, 0.074],
    [0.137, -0.219, -0.212, 0.147, -0.193, -0.238, 0.075],
    [0.147, -0.193, -0.238, 0.164, -0.161, -0.25, 0.072],
    [0.164, -0.161, -0.25, 0.181, -0.129, -0.263, 0.062],
    [0.181, -0.129, -0.263, 0.198, -0.097, -0.275, 0.078],
    [0.198, -0.097, -0.275, 0.218, -0.065, -0.28, 0.07],
    [0.218, -0.065, -0.28, 0.239, -0.033, -0.286, 0.055],
    [0.239, -0.033, -0.286, 0.259, -0.001, -0.291, 0.051],
    [-0.313, -0.383, -0.051, -0.311, -0.425, -0.031, 0.058],
    [-0.311, -0.425, -0.031, -0.309, -0.467, -0.012, 0.058],
    [-0.309, -0.467, -0.012, -0.301, -0.501, 0.019, 0.074],
    [-0.301, -0.501, 0.019, -0.294, -0.534, 0.05, 0.072],
    [-0.294, -0.534, 0.05, -0.296, -0.573, 0.075, 0.072],
    [-0.296, -0.573, 0.075, -0.298, -0.613, 0.099, 0.063],
  ],
  rocks: [
    [-0.442, -0.548, 0.333, -0.4, -0.548, 0.32, 0.114],
    [-0.4, -0.548, 0.32, -0.358, -0.548, 0.307, 0.114],
    [0.158, -0.59, 0.233, 0.182, -0.59, 0.247, 0.085],
    [0.395, -0.583, 0.057, 0.421, -0.583, 0.025, 0.065],
    [0.614, -0.59, 0.118, 0.626, -0.59, 0.122, 0.049],
  ],
};

/** A piece's fin capsules, as obstacles ({ a, b, r: 0, solid: 0, fin }). */
export function finRoom(name) {
  return (FIN_ROOM[name] ?? []).map((c) => ({ a: c.slice(0, 3), b: c.slice(3, 6), r: 0, solid: 0, fin: c[6] }));
}
