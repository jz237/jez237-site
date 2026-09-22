import test from "node:test";
import assert from "node:assert/strict";
import { proofCourse, validateCourse, motionAt } from "../src/course.mjs";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
import {
  createAerialHammers,
  advanceAerialHammers,
  hammerGeometry,
} from "../src/aerial-hammers.mjs";
await initPhysics();

function fixture() {
  const c = proofCourse();
  c.parts = [
    { id: "ground", kind: "floor", x: 0, y: 0, z: 0, w: 20, d: 20, h: 3 },
  ];
  for (let i = 0; i < 4; i++)
    c.parts.push({
      id: `hammer-${i}`,
      kind: "piston",
      profile: "hammer",
      x: i * 3 - 4,
      y: 0.02,
      z: 0,
      w: 2,
      d: 1,
      h: 0.5,
      material: "orange",
      motion: { axis: "hammer", amplitude: 0, period: 1 },
    });
  c.starts = [{ x: -5.4, y: RADIUS + 0.03, z: 0 }];
  c.goal = { x: 8, y: 0, z: 8 };
  c.checkpoints = [];
  c.route = [];
  c.hammerSequence = {
    parts: c.parts.slice(1).map((p) => p.id),
    rate: 20,
    pattern: 1,
    trigger: { ...c.starts[0], radius: 2 },
  };
  return c;
}

test("hammer definitions reject missing, duplicated and unrelated moving parts", () => {
  const c = fixture();
  validateCourse(c);
  for (const edit of [
    (c) => delete c.hammerSequence,
    (c) => (c.hammerSequence.parts[1] = "hammer-0"),
    (c) => (c.hammerSequence.parts[1] = "ground"),
    (c) => (c.hammerSequence.rate = 0),
    (c) => (c.hammerSequence.pattern = 4),
    (c) => (c.parts[1].motion.axis = "x"),
    (c) => {
      delete c.hammerSequence.trigger;
      c.hammerSequence.activationBand = [40, 64];
    },
  ]) {
    const bad = structuredClone(c);
    edit(bad);
    assert.throws(() => validateCourse(bad));
  }
});

test("camera entry waits for region 10, exits disable the group and re-entry resets it", () => {
  const c = fixture();
  delete c.hammerSequence.trigger;
  c.hammerSequence.activationBand = [40, 64];
  const state = createAerialHammers(c),
    players = [{ active: true, region: 9, position: c.starts[0] }];
  advanceAerialHammers(c, state, players, 0.05, { transitions: [[39, 40]] });
  assert.equal(state.sequence.loaded, true);
  assert.ok(state.sequence.actors.every((a) => a.status === "region"));
  players[0].region = 10;
  advanceAerialHammers(c, state, players, 0.06, { transitions: [] });
  assert.equal(state.pendingEntry, true);
  advanceAerialHammers(c, state, players, 0.1, { transitions: [] });
  assert.equal(state.sequence.actors[0].status, "animate");
  advanceAerialHammers(c, state, players, 0.2, { transitions: [] });
  assert.equal(state.sequence.actors[0].drawnImage, 31);
  advanceAerialHammers(c, state, players, 0.25, { transitions: [[64, 65]] });
  assert.equal(state.sequence.loaded, false);
  advanceAerialHammers(c, state, players, 0.3, { transitions: [[65, 64]] });
  assert.ok(state.sequence.actors.every((a) => a.status === "region"));
  players[0].region = 9;
  advanceAerialHammers(c, state, players, 0.35, { transitions: [] });
  players[0].region = 10;
  advanceAerialHammers(c, state, players, 0.4, { transitions: [] });
  assert.equal(state.sequence.actors[0].status, "animate");
});

test("closed mallet solids have outward faces and the narrow handle remains narrower than the head", () => {
  const p = fixture().parts[1],
    g = hammerGeometry(p);
  for (let component = 0; component < 2; component++) {
    let volume = 0;
    const edges = new Map();
    for (let i = component * 84; i < (component + 1) * 84; i += 3) {
      const [a, b, c] = g.indices.slice(i, i + 3),
        v = (j) => Array.from(g.vertices.slice(j * 3, j * 3 + 3));
      const [x, y, z] = v(a),
        [u, vv, w] = v(b),
        [r, s, t] = v(c);
      volume +=
        x * (vv * t - w * s) + y * (w * r - u * t) + z * (u * s - vv * r);
      for (const [a, b] of [
        [g.indices[i], g.indices[i + 1]],
        [g.indices[i + 1], g.indices[i + 2]],
        [g.indices[i + 2], g.indices[i]],
      ]) {
        const key = [Math.min(a, b), Math.max(a, b)].join();
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    assert.ok(volume > 0);
    assert.ok([...edges.values()].every((n) => n === 2));
  }
  assert.ok(Math.abs(g.vertices[2]) < p.d / 2);
  assert.equal(
    Math.min(...Array.from(g.vertices).filter((_, i) => i % 3 === 2)),
    -p.d / 2,
  );
});

test("moving mallet colliders strike a real resting marble and restore the same physical animation", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    assert.ok(
      sim.movers.every((m) => !sim.world.getRigidBody(m.handle).isEnabled()),
    );
    let speed = 0;
    for (let i = 0; i < 150; i++) {
      sim.step();
      const v = sim.body(sim.players[0]).linvel();
      speed = Math.max(speed, Math.hypot(v.x, v.z));
      for (let j = 0; j < 4; j++) {
        const m = sim.movers[j],
          actor = sim.aerialHammers.sequence.actors[j];
        const expected = motionAt(m.part, 0, actor);
        assert.equal(
          sim.world.getRigidBody(m.handle).isEnabled(),
          expected.visible,
        );
        for (const k of ["x", "y", "z", "w"])
          assert.ok(
            Math.abs(m.current.rotation[k] - expected.rotation[k]) < 1e-6,
          );
      }
    }
    assert.ok(speed > 0.25, `mallet did not push the marble: ${speed}`);
    const snapshot = sim.snapshot();
    for (let i = 0; i < 200; i++) sim.step();
    const expected = {
      players: structuredClone(sim.players),
      hammers: structuredClone(sim.aerialHammers),
    };
    sim.restore(snapshot);
    for (let i = 0; i < 200; i++) sim.step();
    assert.deepEqual(sim.players, expected.players);
    assert.deepEqual(sim.aerialHammers, expected.hammers);
  } finally {
    sim.dispose();
  }
});
