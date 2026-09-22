import test from "node:test";
import assert from "node:assert/strict";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics, DemoController } from "../src/physics.mjs";
import { nativeBirdSolids } from "../src/native-bird-physics.mjs";
import { birdFragmentPose } from "../src/bird-capture.mjs";
await initPhysics();

test("bird bodies face their physical flight direction on rotated terrain", () => {
  const c = fixture();
  c.parts[0].angle = 0.4;
  const sim = new Simulation(c, { untimed: true });
  try {
    sim.players[0].status = "finished";
    sim.body(sim.players[0]).setEnabled(false);
    for (let i = 0; i < 200; i++) sim.step();
    const e = sim.enemies.find((e) => !e.hidden && !e.birdStopped);
    assert.ok(e);
    const q = e.current.rotation,
      v = sim.world.getRigidBody(e.handle).linvel();
    const speed = Math.hypot(v.x, v.z);
    assert.ok(speed > 0);
    assert.ok(Math.abs(2 * q.w * q.y - v.x / speed) < 1e-4);
    assert.ok(Math.abs(1 - 2 * q.y * q.y - v.z / speed) < 1e-4);
  } finally {
    sim.dispose();
  }
});

test("demo forecasts native birds from physical motion without legacy flight fields", () => {
  const c = fixture();
  c.route = [{ x: 7.5, y: 0.55, z: -8 }];
  const sim = new Simulation(c, { untimed: true }),
    demo = new DemoController();
  try {
    for (let i = 0; i < 200; i++) sim.step();
    assert.ok(sim.nativeBirds.slots.some((s) => s.loaded && s.mode === "fly"));
    const input = demo.input(sim);
    assert.ok(Number.isFinite(input.x) && Number.isFinite(input.z));
  } finally {
    sim.dispose();
  }
});

function fixture(contact = false) {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 20,
      d: 30,
      h: 2,
      cellSize: 1,
      cells: Array.from({ length: 600 }, (_, i) => [
        i % 20,
        Math.floor(i / 20),
        0,
        0,
        0,
        0,
      ]),
    },
    { id: "wall", kind: "wall", x: 0, y: 1, z: -10, w: 20, d: 1, h: 2 },
  ];
  c.starts = [contact ? { x: 7.5, y: 0.57, z: 10 } : { x: -9, y: 0.57, z: 14 }];
  c.goal = { x: -8, y: 0, z: -13 };
  c.route = [];
  c.checkpoints = [];
  c.zones = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 40,
    rowOrigin: 36,
    heightOrigin: 16344,
    heightScale: 0.125,
    initialScroll: 0,
    initialOffset: 432,
    scrollLimit: 944,
    reverse: true,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20 };
  c.birdSequence = true;
  c.enemies = Array.from({ length: 10 }, (_, i) => ({
    id: `bird-${i}`,
    kind: "bird",
    nativeBirdSlot: i,
    x: 0,
    y: 1,
    z: 0,
    radius: 0.75,
    roam: 1,
    speed: 1,
  }));
  return c;
}

test("native bird imports require a complete unique pool and compatible source clock", () => {
  validateCourse(fixture());
  for (const change of [
    (c) => c.enemies.pop(),
    (c) => (c.enemies[1].nativeBirdSlot = 0),
    (c) => (c.nativeCamera.reverse = false),
    (c) => delete c.birdSequence,
    (c) => delete c.nativeDynamics,
  ]) {
    const c = fixture();
    change(c);
    assert.throws(() => validateCourse(c));
  }
});

test("visible bird solids remain closed, change with the source cadence, and match convex contacts", () => {
  const def = fixture().enemies[0];
  const a = nativeBirdSolids(def, {
    mode: "fly",
    animation: "fly",
    frame: 0,
    counter: 0,
    divider: 4,
  });
  const b = nativeBirdSolids(def, {
    mode: "fly",
    animation: "fly",
    frame: 0,
    counter: 2,
    divider: 4,
  });
  assert.notDeepEqual(a[3].vertices, b[3].vertices);
  for (const solid of a) {
    const edges = new Map();
    for (let i = 0; i < solid.indices.length; i += 3)
      for (let j = 0; j < 3; j++) {
        const x = solid.indices[i + j],
          y = solid.indices[i + ((j + 1) % 3)];
        const key = [Math.min(x, y), Math.max(x, y)].join("/");
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    assert.ok([...edges.values()].every((n) => n === 2));
  }
});

test("birds travel continuously to actual wall contact and retire without crossing the wall", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  const events = [];
  let maximumStep = 0,
    wallStops = 0;
  try {
    sim.players[0].status = "finished";
    sim.body(sim.players[0]).setEnabled(false);
    for (let i = 0; i < 1100; i++) {
      events.push(...sim.step());
      for (const e of sim.enemies) {
        if (e.hidden || !e.birdGeneration) continue;
        const a = e.previous.position,
          b = e.current.position;
        maximumStep = Math.max(
          maximumStep,
          Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z),
        );
        if (e.birdStopped) {
          wallStops++;
          assert.ok(b.z > -9.51, `Bird penetrated wall: ${b.z}`);
        }
      }
    }
    assert.ok(wallStops > 0);
    assert.ok(maximumStep < 0.09, `step ${maximumStep}`);
    assert.ok(events.some((e) => e.type === "bird-wall"));
    assert.ok(events.some((e) => e.type === "bird-remove"));
  } finally {
    sim.dispose();
  }
});

test("real marble contact uses separate break/reform deadlines, one loss, and deterministic restore", () => {
  const sim = new Simulation(fixture(true), { untimed: true });
  try {
    for (let i = 0; i < 500 && !sim.players[0].birdCapture; i++) sim.step();
    const p = sim.players[0],
      c = p.birdCapture;
    assert.ok(c, "no physical bird hit");
    assert.equal(p.deaths, 0);
    assert.equal(p.status, "falling");
    assert.equal(sim.body(p).isEnabled(), false);
    assert.equal(c.endTick - c.releaseTick, 144);
    const snap = sim.snapshot(),
      events = [];
    while (sim.tick < c.endTick) {
      events.push(...sim.step());
    }
    assert.equal(sim.players[0].deaths, 1);
    assert.equal(sim.players[0].status, "racing");
    assert.equal(events.filter((e) => e.type === "bird-reform").length, 1);
    const finish = sim.snapshot();
    sim.restore(snap);
    const again = [];
    while (sim.tick < c.endTick) again.push(...sim.step());
    assert.deepEqual(again, events);
    assert.deepEqual(sim.snapshot(), finish);
    const first = birdFragmentPose(c, c.tick, 0);
    assert.deepEqual(first.position, c.origin);
    assert.equal(birdFragmentPose(c, c.endTick, 0).visible, false);
  } finally {
    sim.dispose();
  }
});
