import { acidShape } from "./acid.mjs";
// Articulated solids used by both Rapier and Three. Time is simulation time,
// so pausing, replaying and changing render cadence cannot change a hazard.
// The Amiga's 100.0–101.2s muncher curl and 238.0–239.3s bird wing poses inform
// these reconstructions; the original AI and exact sprite timing remain open.
const TAU = Math.PI * 2;
const shapeCache = new Map();
const miniAcidCache = new WeakMap();
export const MUNCHER_HALF_HEIGHT = 0.25;

function ellipsoid(name, color, center, radii, roll = 0, pitch = 0) {
  const vertices = [],
    indices = [];
  const put = (x, y, z) => {
    const py = y * Math.cos(pitch) - z * Math.sin(pitch);
    const pz = y * Math.sin(pitch) + z * Math.cos(pitch);
    vertices.push(
      center[0] + x * Math.cos(roll) - py * Math.sin(roll),
      center[1] + x * Math.sin(roll) + py * Math.cos(roll),
      center[2] + pz,
    );
  };
  const rings = 8,
    segments = 16;
  put(0, radii[1], 0);
  for (let j = 1; j < rings; j++) {
    const a = (Math.PI * j) / rings;
    for (let i = 0; i < segments; i++) {
      const b = (TAU * i) / segments;
      put(
        radii[0] * Math.sin(a) * Math.cos(b),
        radii[1] * Math.cos(a),
        radii[2] * Math.sin(a) * Math.sin(b),
      );
    }
  }
  const bottom = vertices.length / 3;
  put(0, -radii[1], 0);
  for (let i = 0; i < segments; i++) {
    const n = (i + 1) % segments;
    indices.push(0, 1 + n, 1 + i);
    for (let j = 0; j < rings - 2; j++) {
      const a = 1 + j * segments + i,
        b = 1 + j * segments + n;
      indices.push(a, b, b + segments, a, b + segments, a + segments);
    }
    const a = 1 + (rings - 2) * segments;
    indices.push(bottom, a + i, a + n);
  }
  return {
    name,
    color,
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
}

export function actorShapes(def, time) {
  const kind = def.kind === "mini" ? (def.form ?? "steelie") : def.kind;
  if (def.kind === "mini" && kind === "acid") {
    const source = acidShape(
      { radius: def.radius, wobblePhase: def.phase ?? 0 },
      time,
    );
    // Acid uses its complete concave mesh, including the empty notches.
    if (!miniAcidCache.has(source)) {
      const vertices = source.vertices.slice();
      for (let i = 1; i < vertices.length; i += 3) vertices[i] -= def.radius;
      miniAcidCache.set(source, [
        {
          name: "acid",
          color: "#39b51b",
          vertices,
          indices: source.indices,
          dynamic: true,
          trimesh: true,
        },
      ]);
    }
    return miniAcidCache.get(source);
  }
  if (!["bird", "muncher"].includes(kind)) return null;
  const period = def.kind === "bird" ? 1 / 3.2 : 0.6;
  const phase = (((time / period + (def.phase ?? 0)) % 1) + 1) % 1;
  const frame = Math.floor(phase * 48);
  const key = `${def.kind}/${def.form ?? ""}/${def.radius}/${frame}`;
  if (!shapeCache.has(key)) {
    if (shapeCache.size >= 512)
      shapeCache.delete(shapeCache.keys().next().value);
    const solids = buildActorShapes(def, (frame / 48) * period);
    for (const solid of solids)
      solid.dynamic =
        def.kind === "bird" ? solid.name === "wing" : solid.name !== "foot";
    shapeCache.set(key, solids);
  }
  return shapeCache.get(key);
}

function buildActorShapes(def, time) {
  const r = def.radius,
    phase = 0;
  if (def.kind === "bird") {
    const flap = Math.sin(TAU * (time * 3.2 + phase)),
      angle = flap * 0.72;
    return [
      ellipsoid("body", "#8134be", [0, 0, 0], [r * 0.24, r * 0.25, r * 0.65]),
      ellipsoid(
        "head",
        "#a45ee1",
        [0, r * 0.12, r * 0.48],
        [r * 0.22, r * 0.22, r * 0.25],
      ),
      ellipsoid(
        "beak",
        "#e3b746",
        [0, r * 0.05, r * 0.76],
        [r * 0.09, r * 0.09, r * 0.25],
      ),
      ...[-1, 1].map((sign) =>
        ellipsoid(
          "wing",
          "#963bda",
          [
            sign * r * 0.56 * Math.cos(angle),
            r * 0.56 * Math.sin(angle),
            -r * 0.05,
          ],
          [r * 0.55, r * 0.065, r * 0.36],
          sign * angle,
        ),
      ),
      ellipsoid(
        "tail",
        "#6323a6",
        [0, 0, -r * 0.63],
        [r * 0.26, r * 0.07, r * 0.3],
      ),
    ];
  }
  if (
    def.kind === "muncher" ||
    (def.kind === "mini" && def.form === "muncher")
  ) {
    // Feet retain their supporting footprint while the upper body curls.
    const curl = (1 - Math.cos(TAU * (time / 0.6 + phase))) / 2;
    const base = -r - (def.kind === "mini" ? 0 : MUNCHER_HALF_HEIGHT);
    return [
      ellipsoid(
        "foot",
        "#249812",
        [0, base + r * 0.3, 0],
        [r * 0.76, r * 0.3, r * 0.73],
      ),
      ellipsoid(
        "body",
        "#32bd15",
        [0, base + r * (0.82 - 0.2 * curl), r * 0.12 * curl],
        [r * 0.65, r * (0.62 - 0.18 * curl), r * 0.62],
        0,
        curl * 0.35,
      ),
      ellipsoid(
        "head",
        "#50d720",
        [0, base + r * (1.72 - 0.95 * curl), r * 0.48 * curl],
        [r * 0.6, r * 0.48, r * 0.57],
        0,
        curl * 0.75,
      ),
      ellipsoid(
        "mouth",
        "#ecc52b",
        [0, base + r * (1.78 - 0.98 * curl), r * (0.48 * curl + 0.49)],
        [r * 0.44, r * (0.07 + 0.07 * curl), r * 0.075],
      ),
    ];
  }
  return null;
}
