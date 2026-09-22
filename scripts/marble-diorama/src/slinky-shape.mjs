// A new, articulated hollow body. The renderer and Rapier consume these same
// vertices and triangles; the open mouth is never replaced by a solid capsule.
const TAU = 2 * Math.PI;
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
const steps = 24,
  sides = 24;

export function slinkyWalkFraction(state) {
  return state.animation.startsWith("walk")
    ? (state.frame + state.counter / state.divider) / 8
    : 0;
}
export function slinkyWalkAxis(animation) {
  return animation.endsWith("NegX")
    ? { x: -1, z: 0 }
    : animation.endsWith("X")
      ? { x: 1, z: 0 }
      : animation.endsWith("NegZ")
        ? { x: 0, z: -1 }
        : { x: 0, z: 1 };
}

export function slinkySolids(radius, state, unit, heightUnit) {
  const walking = state.animation.startsWith("walk");
  const walk = slinkyWalkFraction(state);
  const axis = slinkyWalkAxis(state.animation);
  const height = 16 * heightUnit,
    stride = 8 * unit;
  const standing = [
    [0, 0],
    [0, height / 3],
    [0, (height * 2) / 3],
    [0, height],
  ];
  let points = standing,
    width = 1,
    throat = 0.64;
  if (walking) {
    const arch = [
      [0, 0],
      [0, height * 0.62],
      [stride * 0.5, height * 0.62],
      [stride, 0],
    ];
    const end = standing.map(([x, y]) => [x + stride, y]);
    const a = walk < 0.5 ? standing : arch,
      b = walk < 0.5 ? arch : end;
    const t = smooth(walk < 0.5 ? walk * 2 : walk * 2 - 1);
    points = a.map((p, i) => p.map((v, j) => mix(v, b[i][j], t)));
    points = points.map(([x, y]) => [x - stride * walk, y]);
    width = 1 - 0.3 * Math.sin(Math.PI * walk);
  } else {
    const f = state.frame + state.counter / state.divider;
    let squash = 0,
      lean = 0;
    if (state.animation === "idle")
      lean = Math.sin((f / 11) * TAU) * radius * 0.32;
    if (state.animation === "jump") {
      squash =
        f < 6
          ? smooth(f / 6) * 0.48
          : f < 17
            ? 0
            : smooth((f - 17) / 12) * 0.65;
      width = f > 17 ? 1 + smooth((f - 17) / 12) * 0.55 : 1;
      throat = f > 17 ? 0.86 : 0.64;
    } else if (state.animation === "capture" || state.animation === "miss") {
      const t = smooth(f / 15);
      squash = mix(0.65, 0, t);
      width = mix(1.55, 1, t);
      throat = mix(0.86, 0.64, t);
    } else if (state.animation.startsWith("recover")) {
      squash = smooth(f / 4) * 0.45;
      lean = smooth(f / 4) * radius * 0.6;
    }
    points = standing.map(([x, y], i) => [
      x + (lean * i) / 3,
      y * (1 - squash),
    ]);
  }
  const outer = [],
    inner = [];
  for (let ring = 0; ring <= steps; ring++) {
    const t = ring / steps,
      u = 1 - t;
    const center = [0, 1].map(
      (j) =>
        u ** 3 * points[0][j] +
        3 * u * u * t * points[1][j] +
        3 * u * t * t * points[2][j] +
        t ** 3 * points[3][j],
    );
    const tangent = [0, 1].map(
      (j) =>
        3 * u * u * (points[1][j] - points[0][j]) +
        6 * u * t * (points[2][j] - points[1][j]) +
        3 * t * t * (points[3][j] - points[2][j]),
    );
    const length = Math.hypot(...tangent) || 1;
    const nx = tangent[1] / length,
      ny = -tangent[0] / length;
    const rib = 0.94 + 0.06 * Math.cos(t * TAU * 8);
    for (let side = 0; side < sides; side++) {
      const a = (side / sides) * TAU;
      for (const [vertices, r] of [
        [outer, radius * width * rib],
        [inner, radius * width * throat],
      ]) {
        // Keep vertex correspondence in board coordinates when the next step
        // turns a corner. Rotating ring indices would shrink the interpolated
        // tube between otherwise identical standing poses.
        const radial = axis.x * Math.cos(a) + axis.z * Math.sin(a);
        const along = center[0] + radial * r * nx;
        const across = (-axis.z * Math.cos(a) + axis.x * Math.sin(a)) * r;
        vertices.push(
          axis.x * along - axis.z * across,
          center[1] + radial * r * ny,
          axis.z * along + axis.x * across,
        );
      }
    }
  }
  const vertices = new Float32Array([...outer, ...inner]);
  let bottom = Infinity;
  for (let i = 1; i < vertices.length; i += 3)
    bottom = Math.min(bottom, vertices[i]);
  for (let i = 1; i < vertices.length; i += 3) vertices[i] -= bottom;
  const body = [],
    lip = [],
    offset = outer.length / 3;
  const quad = (out, a, b, c, d) => out.push(a, b, c, a, c, d);
  for (let ring = 0; ring < steps; ring++) {
    const indices = ring >= steps - 2 ? lip : body;
    for (let i = 0; i < sides; i++) {
      const a = ring * sides + i,
        b = ring * sides + ((i + 1) % sides);
      quad(indices, a, a + sides, b + sides, b);
      quad(
        indices,
        a + offset,
        b + offset,
        b + sides + offset,
        a + sides + offset,
      );
    }
  }
  for (let i = 0; i < sides; i++) {
    const a = i,
      b = (i + 1) % sides;
    quad(body, a, b, b + offset, a + offset);
    const top = steps * sides;
    quad(lip, a + top + offset, b + top + offset, b + top, a + top);
  }
  return [
    { name: "body", color: "#279b16", indices: new Uint32Array(body) },
    { name: "mouth", color: "#dcd34b", indices: new Uint32Array(lip) },
  ].map((s) => ({ ...s, vertices, dynamic: true, trimesh: true }));
}

export function interpolateSlinkySolids(previous, current, alpha) {
  if (!previous || alpha >= 1) return current;
  return current.map((s, i) => ({
    ...s,
    vertices: s.vertices.map(
      (v, j) => previous[i].vertices[j] + (v - previous[i].vertices[j]) * alpha,
    ),
  }));
}
