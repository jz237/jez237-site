import test from "node:test";
import assert from "node:assert/strict";
import { Vector3, Quaternion } from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { proofCourse, compileCourse, validateCourse } from "../src/course.mjs";
import { intermediateWaveCorners } from "../src/intermediate-wave-state.mjs";
import {
  terrainTrianglePose,
  terrainRegionAfter,
  interpolateTerrainTriangle,
} from "../src/animated-terrain.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
import {
  Simulation,
  initPhysics,
  RADIUS,
  FixedClock,
} from "../src/physics.mjs";
await initPhysics();

function fixture() {
  const rows = intermediateWaveCorners(),
    cellSize = 1.1,
    scale = 0.1375;
  const at = (x, z, c) => {
    const col = x - 1,
      row = z - 1;
    if (col < 0 || col > 4 || row < 0 || row > 21) return 0;
    const h = rows[row][col === 0 ? 0 : col === 4 ? 2 : 1][c];
    return h === null ? null : h * scale;
  };
  const cells = [];
  for (let z = 0; z < 23; z++)
    for (let x = 0; x < 6; x++) {
      const h = [
        at(x, z, 2),
        at(x + 1, z, 1),
        at(x, z + 1, 3),
        at(x + 1, z + 1, 0),
      ];
      if (h[0] !== null && h[3] !== null && (h[1] !== null || h[2] !== null))
        cells.push([x, z, ...h]);
    }
  return {
    ...proofCourse(),
    id: "native-wave-test",
    parts: [
      {
        id: "native-wave",
        kind: "terrain",
        x: 0,
        y: 0,
        z: 0,
        w: 6 * cellSize,
        d: 23 * cellSize,
        h: 3,
        cellSize,
        cells,
        animation: {
          type: "intermediate-wave",
          column: 1,
          row: 1,
          base: 0,
          scale,
          rate: 20,
          gates: [],
          initialRegions: [9, 9],
        },
      },
    ],
    starts: [
      { x: 0, y: RADIUS, z: -8.8 },
      { x: 1, y: RADIUS, z: -8.8 },
    ],
    checkpoints: [],
    route: [],
    goal: { x: 0, y: 0, z: 100 },
  };
}
const worldVertices = (pose) => {
  const q = new Quaternion(
    pose.rotation.x,
    pose.rotation.y,
    pose.rotation.z,
    pose.rotation.w,
  );
  return Array.from({ length: pose.vertices.length / 3 }, (_, i) =>
    new Vector3(...pose.vertices.slice(i * 3, i * 3 + 3))
      .applyQuaternion(q)
      .add(new Vector3(...Object.values(pose.position))),
  );
};
const close = (a, b, message) =>
  assert.ok(Math.abs(a - b) < 1e-5, `${message}: ${a} vs ${b}`);

test("animated terrain keeps original triangles and fixed undersides through all wave frames", () => {
  const course = fixture(),
    part = course.parts[0];
  part.angle = 0.43;
  part.x = 2;
  part.y = 3;
  part.z = -4;
  const compiled = compileCourse(course);
  assert.ok(compiled.moving.length > 40);
  const cs = Math.cos(part.angle),
    sn = Math.sin(part.angle);
  for (let frame = 0; frame <= 90; frame++) {
    const rows = intermediateWaveCorners([frame]);
    for (const g of compiled.moving) {
      const pose = terrainTrianglePose(g.part, rows),
        world = worldVertices(pose);
      const count = g.part.terrainTriangle.length;
      for (let i = 0; i < count; i++) {
        const v = g.part.terrainTriangle[i],
          ref = v.ref;
        const height = ref
          ? rows[ref[0]][ref[1]][ref[2]] * part.animation.scale
          : v.y;
        close(world[i].x, part.x + v.x * cs - v.z * sn, "visible x");
        close(world[i].y, part.y + height, "visible height");
        close(world[i].z, part.z + v.x * sn + v.z * cs, "visible z");
        close(world[i + count].x, world[i].x, "fixed underside footprint x");
        close(world[i + count].z, world[i].z, "fixed underside footprint z");
        close(world[i + count].y, part.y - part.h, "closed underside level");
      }
    }
  }
  for (const g of compiled.moving.slice(0, 10)) {
    const geometry = surfaceGeometry(g);
    assert.equal(geometry.attributes.position.count, g.indices.length);
    for (let i = 0; i < g.indices.length; i++)
      for (let j = 0; j < 3; j++)
        close(
          geometry.attributes.position.array[i * 3 + j],
          g.vertices[g.indices[i] * 3 + j],
          "mutable render order",
        );
    geometry.dispose();
  }
});

test("native region gates change on leaving their tile span and honor source order", () => {
  const gates = [
    { axis: "z", constant: 3, start: 1, end: 4, low: 8, high: 9 },
    { axis: "x", constant: 4, start: 3, end: 8, low: 9, high: 10 },
  ];
  assert.equal(
    terrainRegionAfter(gates, { x: 2, z: 2 }, { x: 2, z: 3 }, 8),
    8,
    "entering gate does not change region",
  );
  assert.equal(terrainRegionAfter(gates, { x: 2, z: 3 }, { x: 2, z: 4 }, 8), 9);
  assert.equal(terrainRegionAfter(gates, { x: 2, z: 3 }, { x: 2, z: 2 }, 9), 8);
  assert.equal(
    terrainRegionAfter(gates, { x: 2, z: 2 }, { x: 2, z: 4 }, 8),
    8,
    "does not invent a swept crossing",
  );
  assert.equal(
    terrainRegionAfter(gates, { x: 4, z: 3 }, { x: 5, z: 3 }, 8),
    8,
    "first applicable gate wins even if unchanged",
  );
  assert.equal(
    terrainRegionAfter(gates, { x: 4, z: 4 }, { x: 5, z: 4 }, 9),
    10,
  );
});

test("a native crest physically lifts a marble and resumes the same motion after restore", () => {
  const s = new Simulation(fixture(), { untimed: true });
  let maximum = 0,
    snapshot,
    expected;
  try {
    for (let tick = 0; tick < 360; tick++) {
      s.step();
      maximum = Math.max(maximum, s.body(s.players[0]).translation().y);
      if (tick === 179) snapshot = s.snapshot();
    }
    assert.ok(maximum > RADIUS + 1, `physical lift ${maximum}`);
    expected = s.snapshot();
    s.restore(snapshot);
    for (let i = 0; i < 180; i++) s.step();
    assert.deepEqual(
      s.terrainAnimations,
      expected.terrainAnimations,
      "native scheduling and regions restored",
    );
    assert.deepEqual(
      s.players,
      expected.players,
      "subsequent physical outcome restored",
    );
    assert.ok(
      s.movers.every((m) =>
        Array.from(m.current.vertices).every(Number.isFinite),
      ),
    );
  } finally {
    s.dispose();
  }
});

test("native moving collider tops agree with their visible triangles during deformation", (t) => {
  const s = new Simulation(fixture(), { untimed: true });
  let maximumError = 0,
    checked = 0;
  try {
    for (let tick = 0; tick < 180; tick++) {
      s.step();
      if (tick % 7) continue;
      for (const m of s.movers) {
        const vertices = worldVertices(m.current);
        const center = vertices
          .slice(0, 3)
          .reduce((v, p) => v.add(p), new Vector3())
          .multiplyScalar(1 / 3);
        const hit = s.world.castRayAndGetNormal(
          new RAPIER.Ray(
            { x: center.x, y: 20, z: center.z },
            { x: 0, y: -1, z: 0 },
          ),
          40,
          false,
          RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
        );
        assert.ok(hit);
        maximumError = Math.max(
          maximumError,
          Math.abs(20 - hit.timeOfImpact - center.y),
        );
        checked++;
        if (Math.abs(20 - hit.timeOfImpact - center.y) >= RADIUS * 0.001)
          t.diagnostic(
            JSON.stringify({
              heights: m.current.terrainHeights,
              rest: m.part.terrainTriangle.map((v) => v.y),
            }),
          );
        assert.ok(
          Math.abs(20 - hit.timeOfImpact - center.y) < RADIUS * 0.001,
          `collider matches ${m.part.id} at ${tick}: ray=${20 - hit.timeOfImpact}, visible=${center.y}, body=${s.world.getRigidBody(m.handle).translation().y}, enabled=${s.world.getRigidBody(m.handle).isEnabled()}`,
        );
      }
    }
    t.diagnostic(
      `${checked} moving triangle probes; maximum height error ${maximumError}`,
    );
  } finally {
    s.dispose();
  }
});

test("animated terrain validates rest heights, native rate, gates and JSON round trips", () => {
  const c = fixture();
  assert.deepEqual(validateCourse(JSON.parse(JSON.stringify(c))), c);
  for (const change of [
    (a) => (a.rate = 0),
    (a) => (a.rate = 121),
    (a) => (a.scale = -1),
    (a) => (a.initialRegions = [9]),
    (a) =>
      (a.gates = [
        { axis: "q", constant: 0, start: 1, end: 4, low: 0, high: 9 },
      ]),
  ]) {
    const bad = structuredClone(c);
    change(bad.parts[0].animation);
    assert.throws(() => validateCourse(bad), /terrain/);
  }
  const bad = structuredClone(c);
  bad.parts[0].cells.find((c) => c[0] === 2 && c[1] === 2)[2] += 1;
  assert.throws(() => validateCourse(bad), /resting corner/);
});

test("a marble rolls across inactive native triangles without catching their seams", (t) => {
  const course = fixture();
  course.parts[0].animation.initialRegions = [0, 0];
  const s = new Simulation(course, { untimed: true });
  let error = 0;
  try {
    for (let i = 0; i < 1500; i++) {
      s.step([{ x: 0, z: 0.5 }]);
      const pos = s.body(s.players[0]).translation();
      error = Math.max(error, Math.abs(pos.y - RADIUS));
      if (pos.z > 9) break;
    }
    assert.ok(
      s.body(s.players[0]).translation().z > 9,
      "crosses the native lane",
    );
    assert.ok(error < RADIUS * 0.01, `contact error ${error}`);
    assert.equal(s.players[0].deaths, 0);
    t.diagnostic(`Maximum settled contact error ${error}`);
  } finally {
    s.dispose();
  }
});

test("render interpolation preserves shared world corners between changing panels", () => {
  const compiled = compileCourse(fixture());
  for (const [from, to] of [
    [7, 8],
    [8, 9],
    [46, 47],
    [83, 84],
  ]) {
    const a = intermediateWaveCorners([from]),
      b = intermediateWaveCorners([to]);
    for (const alpha of [0.2, 0.5, 0.8])
      for (const g of compiled.moving) {
        const previous = terrainTrianglePose(g.part, a),
          current = terrainTrianglePose(g.part, b);
        const pose = interpolateTerrainTriangle(
          g.part,
          previous,
          current,
          alpha,
        );
        const world = worldVertices(pose),
          old = worldVertices(previous),
          next = worldVertices(current);
        for (let i = 0; i < world.length; i++)
          for (const axis of ["x", "y", "z"])
            close(
              world[i][axis],
              old[i][axis] + (next[i][axis] - old[i][axis]) * alpha,
              "shared interpolated corner",
            );
      }
  }
});

test("native wave scheduling and physical outcomes agree at 30, 60 and 120 rendering fps", () => {
  const outcomes = [];
  for (const fps of [30, 60, 120]) {
    const s = new Simulation(fixture(), { untimed: true }),
      clock = new FixedClock(() => s.step([{ x: 0, z: 0.2 }]));
    try {
      for (let i = 0; i < fps * 4; i++) clock.advance(1 / fps);
      outcomes.push({
        tick: s.tick,
        players: s.players,
        terrain: s.terrainAnimations,
      });
    } finally {
      s.dispose();
    }
  }
  assert.deepEqual(outcomes[1], outcomes[0]);
  assert.deepEqual(outcomes[2], outcomes[0]);
});
