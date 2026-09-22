import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { slinkyCoordinates } from "../src/native-slinky-physics.mjs";
import { nativeTransferIntent } from "../src/native-transfer.mjs";
import { physicalNativeTransfer } from "../src/native-transfer-physics.mjs";
import { tubeGeometry, tubeRadiusAt } from "../src/surface-geometry.mjs";
import { traversalPaths } from "../src/traversal-bonuses.mjs";
import RAPIER from "@dimforge/rapier3d-compat";
await initPhysics();

test("flattened outlet bells are closed meshes and their visible rim is the physical wall", () => {
  const c = fixture(),
    part = c.parts[1],
    geometry = tubeGeometry(part),
    edges = new Map();
  for (let i = 0; i < geometry.indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const a = geometry.indices[i + j],
        b = geometry.indices[i + ((j + 1) % 3)];
      const key = [Math.min(a, b), Math.max(a, b)].join(":");
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  assert.ok(
    [...edges.values()].every((n) => n === 2),
    "every wall edge is shared by two triangles",
  );
  const sim = new Simulation(c, { untimed: true });
  try {
    sim.step();
    for (const x of [-4.5, 1.5]) {
      const vertices = [];
      for (let i = 0; i < geometry.vertices.length; i += 3) {
        const v = geometry.vertices.slice(i, i + 3);
        if (Math.abs(v[2] + 5) < 1e-5 && Math.abs(v[0] - x) < 2)
          vertices.push(v);
      }
      assert.ok(vertices.length >= 48);
      assert.ok(
        Math.abs(Math.max(...vertices.map((v) => v[0])) - x - 1.65) < 1e-5,
      );
      assert.ok(
        Math.abs(Math.max(...vertices.map((v) => v[1])) - 8.9 - 1.15) < 1e-5,
      );
      for (const direction of [-1, 1]) {
        const ray = new RAPIER.Ray(
          { x, y: 8.9, z: -4.999 },
          { x: direction, y: 0, z: 0 },
        );
        const hit = sim.world.castRay(ray, 2, true);
        assert.ok(
          hit && Math.abs(hit.timeOfImpact - 1.5) < 0.005,
          "actual collider uses flattened 3-unit opening",
        );
      }
    }
    for (const path of traversalPaths(c))
      assert.equal(tubeRadiusAt(path, path.length, path.length), 1);
  } finally {
    sim.dispose();
  }
  for (const profile of [
    null,
    { width: 1, height: 2 },
    { width: 3, height: Infinity },
    { width: 17, height: 2 },
  ]) {
    const invalid = fixture();
    invalid.parts[1].fork.outletProfile = profile;
    assert.throws(() => validateCourse(invalid), /outlet profile/);
  }
  for (const scrollwork of [
    null,
    [
      {
        radius: 0.5,
        path: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 0 },
        ],
      },
    ],
    [
      {
        radius: 0.1,
        path: [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
        ],
      },
    ],
  ]) {
    const invalid = fixture();
    invalid.parts[1].fork.scrollwork = scrollwork;
    assert.throws(() => validateCourse(invalid), /scrollwork/);
  }
});

export function fixture() {
  const c = proofCourse();
  const cells = [];
  for (let col = 0; col < 20; col++)
    for (let row = 0; row < 20; row++) {
      if (col >= 7 && col <= 9 && row >= 7 && row <= 9)
        cells.push([col, row, 0, 0, 0, 0]);
      if (col >= 3 && col <= 13 && row <= 5) cells.push([col, row, 8, 8, 8, 8]);
    }
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 20,
      d: 20,
      h: 4,
      cellSize: 1,
      cells,
    },
    {
      id: "transfer",
      kind: "tube",
      x: 0,
      y: 0,
      z: 0,
      w: 1,
      h: 1,
      d: 1,
      material: "red",
      radius: 1.15,
      flare: { throat: 0.8, length: 1.2 },
      flowSpeed: 8,
      flowExitSpeed: 2,
      traversalBonus: 2000,
      nativeTransfer: true,
      path: [
        { x: -1.5, y: 0.7, z: -1.5 },
        { x: -1.5, y: 3.5, z: -1.5 },
        { x: -1.5, y: 8.9, z: -1.5 },
        { x: -4.5, y: 8.9, z: -1.5 },
        { x: -4.5, y: 8.9, z: -3.5 },
        { x: -4.5, y: 8.9, z: -5 },
      ],
      fork: {
        at: 2,
        outletProfile: { width: 3, height: 2 },
        scrollwork: [
          {
            radius: 0.08,
            path: [
              { x: -1.5, y: 6, z: -0.5 },
              { x: 0.2, y: 7, z: -0.4 },
              { x: 0.2, y: 9, z: -0.4 },
              { x: -0.5, y: 9.5, z: -0.4 },
              { x: -1, y: 9, z: -0.4 },
            ],
          },
        ],
        path: [
          { x: -1.5, y: 8.9, z: -1.5 },
          { x: 1.5, y: 8.9, z: -1.5 },
          { x: 1.5, y: 8.9, z: -3.5 },
          { x: 1.5, y: 8.9, z: -5 },
        ],
      },
    },
  ];
  c.starts = [{ x: -1.5, y: 0.551, z: -1.5 }];
  c.goal = { x: 8, y: 8, z: -9 };
  c.enemies = [];
  c.zones = [];
  c.checkpoints = [];
  c.route = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 80,
    rowOrigin: 81,
    heightOrigin: 16244,
    heightScale: 0.125,
    initialScroll: -16000,
    initialOffset: 600,
    scrollLimit: 944,
    reverse: true,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20 };
  return c;
}
for (const seed of [0, 4])
  test(`native physical lift chooses above the release threshold and replays (seed ${seed})`, () => {
    const c = fixture();
    validateCourse(c);
    const sim = new Simulation(c, { untimed: true, seed });
    try {
      const p = sim.players[0],
        b = sim.body(p),
        space = slinkyCoordinates(c);
      let chosen = false,
        maximumStep = 0,
        snapshot,
        bonus = 0;
      for (let tick = 0; tick < 1200 && !bonus; tick++) {
        const before = { ...b.translation() },
          source = space.source(before, 0.55),
          route = structuredClone(p.transferRoute);
        if (!chosen && !route && source.height < 16276) {
          const force = physicalNativeTransfer(
            sim,
            p,
            0,
            0.55,
            p.poweredTransfer,
          );
          assert.ok(
            force,
            JSON.stringify({ tick, source, before, camera: sim.nativeCamera }),
          );
          assert.equal(force.acceleration.y, 28.125);
        }
        const events = sim.step();
        maximumStep = Math.max(
          maximumStep,
          Math.hypot(
            b.translation().x - before.x,
            b.translation().y - before.y,
            b.translation().z - before.z,
          ),
        );
        if (p.transferRoute && !chosen) {
          chosen = true;
          assert.equal(
            nativeTransferIntent({ ...source, vy: 0 }).phase,
            "release",
          );
          snapshot = sim.snapshot();
        }
        bonus += events.filter((e) => e.type === "traversal-bonus").length;
      }
      assert.ok(chosen, "choice must occur in the upper inlet");
      assert.equal(bonus, 1);
      assert.equal(p.deaths, 0);
      assert.ok(maximumStep < 0.16);
      const expected = sim.snapshot(),
        target = sim.tick;
      sim.restore(snapshot);
      while (sim.tick < target) sim.step();
      assert.deepEqual(sim.players, expected.players);
    } finally {
      sim.dispose();
    }
  });
test("native release reads another player's current outlet position and never moves a body", () => {
  const c = fixture();
  c.starts.push({ x: -4.5, y: 8.551, z: -5 });
  const sim = new Simulation(c, { untimed: true, players: 2, seed: 0 });
  try {
    const p = sim.players[0],
      b = sim.body(p),
      space = slinkyCoordinates(c);
    const position = space.world(708, 716, 16277);
    position.y += 0.55;
    b.setTranslation(position, true);
    const before = { ...b.translation() },
      velocity = { ...b.linvel() };
    assert.ok(physicalNativeTransfer(sim, p, 0, 0.55, "transfer"));
    assert.equal(
      p.transferRoute.branch,
      1,
      "occupied first choice switches to the second horn",
    );
    assert.deepEqual({ ...b.translation() }, before);
    assert.deepEqual({ ...b.linvel() }, velocity);
    p.transferRoute = null;
    sim.players[1].status = "finished";
    physicalNativeTransfer(sim, p, 0, 0.55, "transfer");
    assert.equal(
      p.transferRoute.branch,
      0,
      "inactive player does not block an outlet",
    );
  } finally {
    sim.dispose();
  }
});
test("native transfer ignores unloaded inlet and positions outside the source cell", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    const p = sim.players[0];
    sim.nativeCamera.scroll = sim.course.nativeCamera.initialScroll;
    assert.equal(physicalNativeTransfer(sim, p, 0, 0.55, null), null);
    sim.nativeCamera.scroll += 600;
    sim.body(p).setTranslation({ x: -0.9, y: 0.7, z: -1.5 }, true);
    assert.equal(physicalNativeTransfer(sim, p, 0, 0.55, null), null);
    assert.equal(p.transferRoute, null);
  } finally {
    sim.dispose();
  }
});
test("native import requires a powered fork, original coordinate mapping and native gravity", () => {
  for (const change of [
    (c) => (c.nativeDynamics = null),
    (c) => (c.nativeCamera.reverse = false),
    (c) => (c.parts[1].nativeTransfer = "yes"),
    (c) => (c.parts[1].flowSpeed = undefined),
    (c) => (c.parts[1].fork.merge = true),
  ]) {
    const c = fixture();
    change(c);
    assert.throws(() => validateCourse(c));
  }
});
