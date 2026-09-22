import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { slinkyCoordinates } from "../src/native-slinky-physics.mjs";
import { nativeTransferIntent } from "../src/native-transfer.mjs";
import { physicalNativeTransfer } from "../src/native-transfer-physics.mjs";
await initPhysics();

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
  ]) {
    const c = fixture();
    change(c);
    assert.throws(() => validateCourse(c));
  }
});
