import test from "node:test";
import assert from "node:assert/strict";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { nativeMiniatureSolids } from "../src/native-miniature-physics.mjs";
import { actorMesh, updateActorMesh } from "../src/actor-view.mjs";
import { Vector3, Quaternion } from "three";
await initPhysics();

test("spent steelies flatten toward the floor after arbitrary rolling rotations", () => {
  const q = new Quaternion().setFromAxisAngle(
    new Vector3(1, 2, 3).normalize(),
    1.3,
  );
  const solid = nativeMiniatureSolids(
    { form: "steelie", radius: 0.22 },
    { mode: 2, animation: "steelieSpent", frame: 0, counter: 0 },
    q,
  )[0];
  const heights = [];
  for (let i = 0; i < solid.vertices.length; i += 3)
    heights.push(
      new Vector3(...solid.vertices.slice(i, i + 3)).applyQuaternion(q).y,
    );
  assert.ok(Math.min(...heights) >= -0.220001);
  assert.ok(Math.max(...heights) < -0.12);
});

test("all forms can sustain walking motion against friction under native gravity", () => {
  for (const slot of [0, 3, 6]) {
    const sim = start();
    try {
      sim.nativeMiniatures.tick = 100000;
      for (const other of sim.enemies)
        if (other.def.nativeMiniatureSlot !== slot)
          sim.nativeMiniatures.slots[other.def.nativeMiniatureSlot].loaded =
            false;
      const e = sim.enemies[slot],
        initial = { ...e.current.position };
      e.miniatureTarget = {
        ...initial,
        z: initial.z + (initial.z < 0 ? 1.5 : -1.5),
      };
      e.miniatureSpeed = 1;
      for (let i = 0; i < 300; i++) sim.step();
      assert.ok(
        Math.abs(e.current.position.z - initial.z) > 1.2,
        `${e.def.form} must walk, not merely twitch`,
      );
    } finally {
      sim.dispose();
    }
  }
});

function fixture(wall = false) {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 16,
      d: 16,
      h: 2,
      cellSize: 1,
      cells: Array.from({ length: 256 }, (_, i) => [
        i % 16,
        Math.floor(i / 16),
        0,
        0,
        0,
        0,
      ]),
    },
  ];
  if (wall)
    c.parts.push({
      id: "wall",
      kind: "wall",
      x: 0,
      y: 1,
      z: 0,
      w: 0.5,
      d: 16,
      h: 2,
    });
  c.starts = [{ x: -7, y: 0.57, z: -7 }];
  c.goal = { x: -7, y: 0, z: 7 };
  c.route = [];
  c.checkpoints = [];
  c.zones = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 89,
    rowOrigin: 90,
    heightOrigin: 16238,
    heightScale: 0.125,
    initialScroll: 0,
    initialOffset: 896,
    scrollLimit: 944,
    reverse: true,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20 };
  c.navigation = {
    type: "terrain-gates",
    partId: "ground",
    initialRegions: [1, 1],
    gates: [],
  };
  c.miniatureSequence = true;
  c.enemies = Array.from({ length: 9 }, (_, i) => ({
    id: `mini-${i}`,
    kind: "mini",
    form: i < 3 ? "steelie" : i < 6 ? "acid" : "muncher",
    nativeMiniatureSlot: i,
    x: 0,
    y: 0.22,
    z: 0,
    radius: 0.22,
    roam: 1,
    speed: 1,
  }));
  return c;
}
function start(c = fixture()) {
  const sim = new Simulation(c, { untimed: true });
  sim.players[0].status = "finished";
  sim.body(sim.players[0]).setEnabled(false);
  sim.nativeCamera.initialTransition = [57, 56];
  sim.step();
  return sim;
}

test("native miniature import validates all nine unique forms and compatible clocks", () => {
  validateCourse(fixture());
  for (const mutate of [
    (c) => c.enemies.pop(),
    (c) => (c.enemies[1].nativeMiniatureSlot = 0),
    (c) => (c.enemies[0].form = "acid"),
    (c) => delete c.nativeDynamics,
    (c) => delete c.navigation,
    (c) => delete c.miniatureSequence,
  ]) {
    const c = fixture();
    mutate(c);
    assert.throws(() => validateCourse(c), /native miniature/);
  }
});

test("native miniatures move continuously on real floors with shared rendered and contact geometry", () => {
  const sim = start();
  try {
    assert.equal(sim.enemies.filter((e) => !e.hidden).length, 9);
    const initial = sim.enemies.map((e) => ({ ...e.current.position }));
    let maxStep = 0;
    for (let i = 0; i < 720; i++) {
      sim.step();
      for (const e of sim.enemies) {
        const a = e.previous.position,
          b = e.current.position;
        maxStep = Math.max(
          maxStep,
          Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z),
        );
        assert.ok(
          Math.abs(b.y - e.def.radius) < 0.015,
          `${e.def.form} remains supported: ${b.y}`,
        );
      }
    }
    assert.ok(maxStep < 0.09, `continuous step ${maxStep}`);
    assert.ok(
      sim.enemies.every(
        (e, i) =>
          Math.hypot(
            e.current.position.x - initial[i].x,
            e.current.position.z - initial[i].z,
          ) > 0.01,
      ),
    );
    for (const e of sim.enemies) {
      const mesh = actorMesh(nativeMiniatureSolids(e.def));
      updateActorMesh(mesh, e.current.solids);
      e.current.solids.forEach((solid, i) => {
        const collider = sim.world.getCollider(e.colliders[i]);
        assert.deepEqual(collider.shape.vertices, solid.vertices);
        assert.deepEqual(
          mesh.children[i].geometry.attributes.position.array,
          solid.vertices,
        );
        assert.ok(collider.isEnabled());
      });
      mesh.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
    }
  } finally {
    sim.dispose();
  }
});

test("a movement intent into a visible wall stops at physical contact", () => {
  const sim = start(fixture(true));
  try {
    const e = sim.enemies.find((e) => !e.hidden && e.current.position.x < -0.6);
    assert.ok(e);
    sim.nativeMiniatures.tick = 100000;
    e.miniatureTarget = { x: 6, y: 0, z: e.current.position.z };
    e.miniatureSpeed = 2;
    const initial = e.current.position.x;
    for (let i = 0; i < 900; i++) {
      sim.step();
      assert.ok(
        e.current.position.x < -0.24,
        `cannot cross visible wall ${e.current.position.x}`,
      );
    }
    assert.ok(e.current.position.x > initial + 0.1);
    assert.ok(Math.abs(e.current.position.y - e.def.radius) < 0.02);
  } finally {
    sim.dispose();
  }
});

test("actual contact pays once for every form and leaves a visible harmless spent shape", () => {
  for (const slot of [0, 3, 6]) {
    const sim = start();
    try {
      const e = sim.enemies[slot],
        p = sim.players[0],
        body = sim.body(p),
        pos = e.current.position;
      sim.nativeMiniatures.tick = 100000;
      e.miniatureSpeed = 0;
      body.setTranslation({ x: pos.x, y: 0.55, z: pos.z + 0.7 }, true);
      body.setEnabled(true);
      p.status = "racing";
      const initialTime = p.time,
        initialScore = p.score;
      const events = [];
      for (let i = 0; i < 180; i++) events.push(...sim.step([{ x: 0, z: -1 }]));
      assert.equal(
        events.filter((x) => x.type === "collect" && x.enemy === e.def.id)
          .length,
        1,
        e.def.form,
      );
      assert.ok(p.time >= initialTime + 3);
      assert.ok(p.score >= initialScore + 500);
      assert.equal(sim.nativeMiniatures.slots[slot].mode, 2);
      assert.equal(e.hidden, false);
      assert.equal(e.collected, true);
      assert.ok(
        e.colliders.every((h) => !sim.world.getCollider(h).isEnabled()),
      );
      assert.ok(sim.world.getRigidBody(e.handle).isEnabled());
      assert.equal(p.deaths, 0);
      p.status = "finished";
      body.setEnabled(false);
      sim.nativeMiniatures.tick = Math.floor(sim.tick / 6);
      const spentPosition = { ...e.current.position };
      for (let i = 0; i < 90; i++) sim.step();
      assert.deepEqual(e.current.position, spentPosition);
      assert.ok(sim.nativeMiniatures.slots[slot].animation.endsWith("Spent"));
      sim.nativeCamera.initialTransition = [29, 28];
      sim.step();
      assert.ok(sim.enemies.every((other) => other.hidden));
      sim.nativeCamera.initialTransition = [28, 29];
      sim.step();
      assert.equal(e.collected, false);
      assert.equal(e.hidden, false);
      assert.equal(e.miniatureGeneration, 2);
      assert.ok(e.colliders.every((h) => sim.world.getCollider(h).isEnabled()));
      assert.ok(sim.world.getRigidBody(e.handle).isDynamic());
    } finally {
      sim.dispose();
    }
  }
});

test("miniature fleeing uses the recorded region even at the same room position", () => {
  const c = fixture();
  c.navigation.initialRegions = [0, 0];
  const sim = new Simulation(c, { untimed: true });
  try {
    sim.nativeCamera.initialTransition = [57, 56];
    for (let i = 0; i < 30; i++) sim.step();
    assert.ok(sim.players[0].grounded);
    assert.ok(sim.nativeMiniatures.slots.every((s) => s.mode === 0));
    sim.players[0].navigation.region = 1;
    for (let i = 0; i < 6; i++) sim.step();
    assert.ok(sim.nativeMiniatures.slots.every((s) => s.mode === 1));
    sim.players[0].navigation.region = 0;
    for (let i = 0; i < 6; i++) sim.step();
    assert.ok(sim.nativeMiniatures.slots.every((s) => s.mode === 0));
  } finally {
    sim.dispose();
  }
});

test("native miniature physics continues exactly after restoring the controller and bodies", () => {
  const sim = start();
  try {
    for (let i = 0; i < 180; i++) sim.step();
    const snap = sim.snapshot();
    for (let i = 0; i < 200; i++) sim.step();
    const expected = {
      state: structuredClone(sim.nativeMiniatures),
      enemies: structuredClone(sim.enemies),
    };
    sim.restore(snap);
    for (let i = 0; i < 200; i++) sim.step();
    assert.deepEqual(sim.nativeMiniatures, expected.state);
    assert.deepEqual(sim.enemies, expected.enemies);
  } finally {
    sim.dispose();
  }
});
