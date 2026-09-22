import test from "node:test";
import assert from "node:assert/strict";
import {
  createPaddleSequence,
  stepPaddleSequence,
  sourcePaddleLaunch,
  createAerialPaddle,
  advanceAerialPaddle,
  queuePaddleContact,
  paddlePose,
  paddleLaunchVelocity,
} from "../src/aerial-paddle.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
await initPhysics();

function fixture() {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 20,
      d: 20,
      h: 3,
      cellSize: 1,
      cells: Array.from({ length: 400 }, (_, i) => [
        i % 20,
        Math.floor(i / 20),
        0,
        0,
        0,
        0,
      ]),
    },
    {
      id: "paddle",
      kind: "spring",
      profile: "flipper",
      x: 0,
      y: 0.02,
      z: 0,
      w: 2.2,
      d: 2.4,
      h: 0.2,
      material: "red",
      motion: { axis: "native-paddle", amplitude: 1.5, period: 1 },
    },
  ];
  c.starts = [
    { x: 0, y: RADIUS + 0.045, z: 0.1 },
    { x: 6, y: RADIUS + 0.02, z: 5 },
  ];
  c.goal = { x: 9, y: 0, z: 9 };
  c.zones = [];
  c.checkpoints = [];
  c.route = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 0,
    rowOrigin: 0,
    heightOrigin: 16276,
    heightScale: 0.125,
    initialScroll: -16276,
    initialOffset: 0,
    scrollLimit: 824,
    reverse: false,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20 };
  c.paddleSequence = { part: "paddle", rate: 20, activationBand: [0, 34] };
  return c;
}

test("paddle follows original 15-wait, four-frame raise, ten-wait and five-frame return", () => {
  const s = createPaddleSequence();
  stepPaddleSequence(s, { load: true, player: 1 });
  assert.equal(s.image, 22);
  assert.equal(s.counter, 15);
  for (let i = 0; i < 14; i++) {
    stepPaddleSequence(s, { player: 0 });
    assert.equal(s.phase, "delay");
  }
  stepPaddleSequence(s);
  assert.equal(s.phase, "raise");
  assert.equal(s.launched, true);
  assert.equal(s.player, 1);
  for (const image of [22, 23, 24, 26]) {
    stepPaddleSequence(s);
    assert.equal(s.image, image);
  }
  for (let i = 0; i < 9; i++) {
    stepPaddleSequence(s);
    assert.equal(s.image, 26);
    assert.equal(s.phase, "hold");
  }
  stepPaddleSequence(s);
  assert.equal(s.image, 25);
  assert.equal(s.phase, "lower");
  for (const image of [24, 23, 22, 21, 22]) {
    stepPaddleSequence(s);
    assert.equal(s.image, image);
  }
  assert.equal(s.phase, "idle");
  stepPaddleSequence(s, { player: 0 });
  assert.equal(s.counter, 15);
  assert.equal(s.player, 0);
  stepPaddleSequence(s, { unload: true });
  assert.equal(s.loaded, false);
  stepPaddleSequence(s, { load: true });
  assert.equal(s.phase, "idle");
  assert.equal(s.image, 22);
});

test("source launch samples retain original fixed-point bounds and direction", () => {
  const low = sourcePaddleLaunch(0, 0),
    high = sourcePaddleLaunch(8191, 40959);
  assert.deepEqual(low.position, { x: 504, z: 560, height: 16273 });
  assert.equal(low.velocity.x, -0.0625);
  assert.equal(high.velocity.x, 4095 / 65536);
  assert.equal(low.velocity.z, -2.3125);
  assert.equal(high.velocity.z, -192511 / 65536);
  assert.equal(low.velocity.up, 10);
  assert.equal(low.delay, 15);
  assert.throws(() => sourcePaddleLaunch(8192, 0));
  assert.throws(() => sourcePaddleLaunch(0, -1));
});

test("native paddle validation rejects unrelated parts, timers and invalid bands", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.paddleSequence,
    (c) => delete c.nativeCamera,
    (c) => (c.paddleSequence.part = "ground"),
    (c) => (c.paddleSequence.rate = 0),
    (c) => (c.paddleSequence.activationBand = [34, 20]),
    (c) => (c.parts[1].presence = { period: 10, on: 5 }),
    (c) => (c.parts[1].profile = "peg"),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("camera loading and contact queue claim one marble and survive fractional native updates", () => {
  const c = fixture(),
    s = createAerialPaddle(c);
  assert.equal(queuePaddleContact(s, 0), false);
  advanceAerialPaddle(c, s, 0.05, { transitions: [[-2, 0]] });
  assert.equal(queuePaddleContact(s, 1), true);
  assert.equal(queuePaddleContact(s, 0), false);
  advanceAerialPaddle(c, s, 0.075, { transitions: [] });
  assert.equal(s.pendingPlayer, 1);
  advanceAerialPaddle(c, s, 0.1, { transitions: [] });
  assert.equal(s.sequence.phase, "delay");
  assert.equal(
    advanceAerialPaddle(c, s, 0.85, { transitions: [] }).launched,
    1,
  );
  assert.equal(
    advanceAerialPaddle(c, s, 0.851, { transitions: [] }).launched,
    null,
  );
  const pose = advanceAerialPaddle(c, s, 0.9, { transitions: [[34, 35]] }).pose;
  assert.equal(pose.visible, false);
  assert.equal(queuePaddleContact(s, 0), false);
});

test("native cup launches with a physical spring impulse, cues once, and restores the same flight", () => {
  const sim = new Simulation(fixture(), { players: 2, untimed: true });
  try {
    while (sim.tick < 120 && sim.aerialPaddle.sequence.phase !== "delay")
      sim.step();
    assert.equal(sim.aerialPaddle.sequence.phase, "delay");
    const snapshot = sim.snapshot();
    const run = () => {
      let maxY = 0,
        minZ = 0,
        cues = 0;
      for (let i = 0; i < 190; i++) {
        const events = sim.step();
        cues += events.filter((e) => e.type === "spring").length;
        if (events.some((e) => e.type === "spring")) {
          const wanted = paddleLaunchVelocity(
            sim.course,
            sim.course.parts[1],
            sim.aerialPaddle,
          );
          const actual = sim.body(sim.players[0]).linvel();
          assert.ok(Math.abs(wanted.x - actual.x) < 0.001);
          assert.ok(Math.abs(wanted.z - actual.z) < 0.001);
          assert.ok(
            Math.abs(wanted.y - sim.nativeDynamics.gravity / 120 - actual.y) <
              0.001,
          );
        }
        const pos = sim.body(sim.players[0]).translation();
        maxY = Math.max(maxY, pos.y);
        minZ = Math.min(minZ, pos.z);
        const m = sim.movers.find((m) => m.part.id === "paddle"),
          body = sim.world.getRigidBody(m.handle);
        assert.equal(body.collider(0).isSensor(), false);
        assert.ok(Math.abs(body.translation().y - m.current.position.y) < 1e-5);
      }
      return {
        maxY,
        minZ,
        cues,
        players: structuredClone(sim.players),
        state: structuredClone(sim.aerialPaddle),
      };
    };
    const result = run();
    assert.equal(result.cues, 1);
    assert.ok(result.maxY > 1.5, `height ${result.maxY}`);
    assert.ok(result.minZ < -0.5, `forward ${result.minZ}`);
    assert.equal(sim.players[1].deaths, 0);
    sim.restore(snapshot);
    assert.deepEqual(run(), result);
  } finally {
    sim.dispose();
  }
});

test("a queued paddle cannot apply a remote launch after the marble leaves its cup", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    while (sim.tick < 120 && sim.aerialPaddle.sequence.phase !== "delay")
      sim.step();
    assert.equal(sim.aerialPaddle.sequence.phase, "delay");
    const b = sim.body(sim.players[0]);
    b.setTranslation({ x: 4, y: RADIUS + 0.02, z: 4 }, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    let max = 0;
    for (let i = 0; i < 140; i++) {
      sim.step();
      max = Math.max(max, b.translation().y);
    }
    assert.ok(max < RADIUS + 0.03, `remote height ${max}`);
  } finally {
    sim.dispose();
  }
});

test("paddle interpolation uses a continuous common pose and respects rotated mounting", () => {
  const c = fixture(),
    p = c.parts[1],
    s = { loaded: true, image: 24, previousImage: 23 };
  const half = paddlePose(p, s, 0.5),
    next = paddlePose(p, s, 0.50001);
  assert.ok(Math.abs(half.position.y - next.position.y) < 0.00002);
  p.angle = Math.PI / 2;
  const rotated = paddlePose(p, s, 0.5);
  assert.ok(Math.abs(half.position.y - rotated.position.y) < 1e-12);
  assert.ok(Math.abs(half.position.z + rotated.position.x) < 1e-12);
});
