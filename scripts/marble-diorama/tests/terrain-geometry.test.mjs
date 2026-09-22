import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { terrainGeometry } from "../src/terrain-geometry.mjs";
import { compileCourse, validateCourse, proofCourse } from "../src/course.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
import { initPhysics, Simulation, RADIUS } from "../src/physics.mjs";
await initPhysics();

const part = (cells, options = {}) => ({
  id: "terrain",
  kind: "terrain",
  x: 0,
  y: 0,
  z: 0,
  w: 4,
  d: 4,
  h: 3,
  cellSize: 4,
  cells,
  ...options,
});
const course = (p) => ({
  ...proofCourse(),
  id: "terrain-proof",
  parts: [p],
  starts: [{ x: 0, y: 8, z: 0 }],
  checkpoints: [],
  route: [],
  goal: { x: 0, y: 0, z: 40 },
});
const close = (a, b, message) =>
  assert.ok(Math.abs(a - b) < 1e-5, `${message}: ${a} != ${b}`);
function closed(g) {
  const counts = new Map();
  for (let t = 0; t < g.indices.length; t += 3) {
    const vs = Array.from(g.indices.slice(t, t + 3));
    for (let i = 0; i < 3; i++) {
      const a = vs[i],
        b = vs[(i + 1) % 3],
        key = [a, b].sort((x, y) => x - y).join(",");
      const entry = counts.get(key) ?? { n: 0, orientation: 0 };
      entry.n++;
      entry.orientation += a < b ? 1 : -1;
      counts.set(key, entry);
    }
  }
  for (const [edge, entry] of counts) {
    assert.equal(entry.n, 2, `closed edge ${edge}`);
    assert.equal(entry.orientation, 0, `opposite winding ${edge}`);
  }
}
function probe(p) {
  const s = new Simulation(course(p), { untimed: true });
  s.step();
  return {
    s,
    ray: (origin, dir) =>
      s.world.castRayAndGetNormal(
        new RAPIER.Ray(origin, dir),
        100,
        false,
        RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
      ),
  };
}

test("terrain keeps the original diagonal planes in the rendered and physical mesh", () => {
  const p = part([[0, 0, 0, 2, 4, 2]], { angle: 0.43, x: 2, y: 3, z: -1 });
  const c = compileCourse(course(p)),
    g = c.statics[0],
    rendered = surfaceGeometry(g);
  const { s, ray } = probe(p);
  try {
    // Two distinct analytic planes, meeting along local x == z.
    for (const [x, z, height] of [
      [-1, 1, 2.5],
      [1, -1, 1.5],
      [0, 0, 1],
    ]) {
      const wx = p.x + x * Math.cos(p.angle) - z * Math.sin(p.angle);
      const wz = p.z + x * Math.sin(p.angle) + z * Math.cos(p.angle);
      const hit = ray({ x: wx, y: 20, z: wz }, { x: 0, y: -1, z: 0 });
      assert.ok(hit);
      close(20 - hit.timeOfImpact, p.y + height, "original plane height");
    }
    for (let i = 0; i < rendered.attributes.position.count; i++) {
      const expected = g.indices[i];
      for (let axis = 0; axis < 3; axis++)
        close(
          rendered.attributes.position.array[i * 3 + axis],
          g.vertices[expected * 3 + axis],
          "shared visible corner",
        );
    }
    closed(terrainGeometry(p));
  } finally {
    rendered.dispose();
    s.dispose();
  }
});

test("adjacent terrain faces preserve a cliff and remove buried internal walls", () => {
  const p = part(
    [
      [0, 0, 2, 2, 2, 2],
      [1, 0, 0, 0, 0, 0],
    ],
    { w: 8 },
  );
  closed(terrainGeometry(p));
  const { s, ray } = probe(p);
  try {
    const upper = ray({ x: -2, y: 10, z: 0 }, { x: 0, y: -1, z: 0 });
    const lower = ray({ x: 2, y: 10, z: 0 }, { x: 0, y: -1, z: 0 });
    close(10 - upper.timeOfImpact, 2, "upper ledge");
    close(10 - lower.timeOfImpact, 0, "lower ledge");
    const wall = ray({ x: 2, y: 1, z: 0 }, { x: -1, y: 0, z: 0 });
    close(wall.timeOfImpact, 2, "exposed cliff");
    assert.ok(wall.normal.x > 0.99);
    const buried = ray({ x: 2, y: -1, z: 0 }, { x: -1, y: 0, z: 0 });
    close(buried.timeOfImpact, 6, "no wall inside the solid board");
  } finally {
    s.dispose();
  }
});

test("crossing cliff profiles meet without open edges or averaged slopes", () => {
  const p = part(
    [
      [0, 0, 2, 2, 0, 0],
      [1, 0, 0, 0, 2, 2],
    ],
    { w: 8 },
  );
  const g = terrainGeometry(p);
  closed(g);
  assert.ok(Array.from(g.vertices).every(Number.isFinite));
  const { s, ray } = probe(p);
  try {
    for (const z of [-1, 1]) {
      const from = z < 0 ? 2 : -2,
        direction = z < 0 ? -1 : 1;
      const wall = ray({ x: from, y: 1, z }, { x: direction, y: 0, z: 0 });
      close(wall.timeOfImpact, 2, "cliff switches side at the crossing");
    }
  } finally {
    s.dispose();
  }
});

test("missing tiles and half tiles remain open from above and below", () => {
  const p = part(
    [
      [0, 0, 0, 0, 0, 0],
      [2, 0, 0, null, 0, 0],
    ],
    { w: 12 },
  );
  closed(terrainGeometry(p));
  const { s, ray } = probe(p);
  try {
    assert.equal(
      ray({ x: 0, y: 10, z: 0 }, { x: 0, y: -1, z: 0 }),
      null,
      "missing middle tile",
    );
    assert.equal(
      ray({ x: 5, y: 10, z: -1 }, { x: 0, y: -1, z: 0 }),
      null,
      "absent diagonal half",
    );
    assert.equal(
      ray({ x: 5, y: -10, z: -1 }, { x: 0, y: 1, z: 0 }),
      null,
      "no bottom spanning the hole",
    );
    const below = ray({ x: 3, y: -10, z: 1 }, { x: 0, y: 1, z: 0 });
    close(below.timeOfImpact, 7, "closed underside of existing terrain");
    assert.ok(below.normal.y < -0.99);
  } finally {
    s.dispose();
  }
});

test("a physical marble crosses welded terrain cells without seam impacts", () => {
  const p = part(
    Array.from({ length: 10 }, (_, i) => [0, i, 0, 0, 0, 0]),
    { w: 4, d: 40 },
  );
  const c = course(p);
  assert.equal(
    compileCourse(c).statics.reduce(
      (n, g) => n + g.roles.filter((role) => role === "top").length,
      0,
    ),
    20,
    "the compiler preserves each original diagonal instead of merging flat tops",
  );
  c.starts = [{ x: 0, y: RADIUS, z: -18 }];
  const s = new Simulation(c, { untimed: true });
  let highest = 0;
  try {
    for (let i = 0; i < 1800; i++) {
      s.step([{ x: 0, z: 0.5 }]);
      const pos = s.body(s.players[0]).translation();
      highest = Math.max(highest, Math.abs(pos.y - RADIUS));
      if (pos.z > 14) break;
    }
    assert.ok(
      s.body(s.players[0]).translation().z > 14,
      "crosses eight tile joins",
    );
    assert.ok(highest < RADIUS * 0.01, `contact gap ${highest}`);
    assert.equal(s.players[0].deaths, 0);
  } finally {
    s.dispose();
  }
});

test("terrain import rejects overlapping, out-of-bounds, buried and excessive cells", () => {
  const valid = course(part([[0, 0, 0, 0, 0, 0]]));
  assert.deepEqual(validateCourse(JSON.parse(JSON.stringify(valid))), valid);
  for (const field of ["rise", "bank", "bevel"])
    assert.throws(
      () =>
        validateCourse(course(part([[0, 0, 0, 0, 0, 0]], { [field]: 0.1 }))),
      /terrain/,
    );
  for (const cells of [
    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
    [[1, 0, 0, 0, 0, 0]],
    [[0, 0, 0, -3, 0, 0]],
    [[0, 0, null, 0, 0, 0]],
    [[0, 0, 0, null, null, 0]],
    [[0, 0, NaN, 0, 0, 0]],
  ])
    assert.throws(() => validateCourse(course(part(cells))), /terrain/);
  assert.throws(
    () =>
      validateCourse(
        course(
          part([[0, 0, 0, 0, 0, 0]], {
            motion: { axis: "y", amplitude: 1, period: 2 },
          }),
        ),
      ),
    /terrain/,
  );
  const excessive = Array.from({ length: 5000 }, (_, i) => [
    i % 50,
    Math.floor(i / 50),
    0,
    0,
    0,
    0,
  ]);
  assert.throws(
    () =>
      validateCourse(course(part(excessive, { w: 50, d: 100, cellSize: 1 }))),
    /150,000-vertex/,
  );
});
