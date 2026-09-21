import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { waveStrip } from "../src/wave.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
import { actorShapes } from "../src/actor-shapes.mjs";
import { actorMesh, updateActorMesh } from "../src/actor-view.mjs";
import { aerialCourse } from "../src/aerial.mjs";
import { ultimateCourse } from "../src/ultimate.mjs";
import { DemoController } from "../src/physics.mjs";
import { partGeometry, motionAt, validateCourse } from "../src/course.mjs";
await initPhysics();

test("Ultimate reaches either bridge with one launcher, without visiting the other landing island", () => {
  for (const right of [false, true]) {
    const c = ultimateCourse();
    if (right) c.route = c.alternateRoutes[0].route;
    const sim = new Simulation(c, { untimed: true }),
      demo = new DemoController();
    const launches = [];
    let bridge = false,
      landing = false,
      opposite = false,
      movingArm = false;
    while (sim.tick < 4800 && !bridge) {
      for (const e of sim.step([demo.input(sim)]))
        if (e.type === "spring") launches.push(e.part);
      const p = sim.players[0],
        v = p.current.position;
      const l = (v.x - v.z) * Math.SQRT1_2,
        d = (v.x + v.z) * Math.SQRT1_2;
      if (p.grounded && d > 25.5 && d < 34.5) {
        if (right ? l > 10 : l < 2) landing = true;
        if (right ? l < 2 : l > 10) opposite = true;
      }
      bridge = p.grounded && d > 45 && d < 58;
      movingArm ||= sim.movers.some(
        (m) =>
          m.part.kind === "spring" && Math.abs(m.current.rotation.x) > 0.02,
      );
    }
    assert.equal(bridge, true);
    assert.equal(landing, true);
    assert.equal(opposite, false);
    assert.equal(movingArm, true);
    assert.deepEqual(launches, [right ? "catapult-right" : "catapult-left"]);
    assert.equal(sim.players[0].deaths, 0);
    sim.dispose();
  }
});

test("stepping a wave retains changing render vertices matching the live collider, including after restore", () => {
  const c = blankCourse();
  c.parts = waveStrip("wave", { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 8 }, 4);
  const sim = new Simulation(c, { untimed: true });
  const initial = Array.from(sim.movers[3].current.vertices);
  for (let i = 0; i < 70; i++) sim.step();
  const snap = sim.snapshot();
  const check = () => {
    for (let i = 0; i < sim.movers.length; i++) {
      const m = sim.movers[i],
        data = sim.compiled.moving[i];
      assert.equal(m.previous.vertices.length, 24);
      assert.equal(m.current.vertices.length, 24);
      const collider = sim.world.getRigidBody(m.handle).collider(0);
      const actual = Array.from(collider.vertices());
      for (let v = 0; v < actual.length; v += 3)
        assert.ok(
          Array.from({ length: 8 }, (_, j) => j * 3).some(
            (j) =>
              Math.hypot(
                ...actual
                  .slice(v, v + 3)
                  .map((n, k) => n - m.current.vertices[j + k]),
              ) < 1e-6,
          ),
        );
      const geometry = surfaceGeometry(data);
      // This is the same compiler-index mapping used by the view.
      for (let j = 0; j < data.indices.length; j++)
        for (let k = 0; k < 3; k++)
          geometry.attributes.position.array[j * 3 + k] =
            m.current.vertices[data.indices[j] * 3 + k];
      assert.ok(
        Array.from(geometry.attributes.position.array).every(Number.isFinite),
      );
      geometry.dispose();
    }
  };
  check();
  assert.notDeepEqual(Array.from(sim.movers[3].current.vertices), initial);
  for (let i = 0; i < 20; i++) sim.step();
  sim.restore(snap);
  check();
  sim.dispose();
});

test("bird wings and muncher curl change the same articulated solids used for rendering and contacts", () => {
  for (const kind of ["bird", "muncher"]) {
    const def = { kind, radius: 0.65 };
    const a = actorShapes(def, 0),
      b = actorShapes(def, 0.15);
    assert.notDeepEqual(a, b);
    const original = structuredClone(a);
    const mesh = actorMesh(a);
    updateActorMesh(mesh, b);
    b.forEach((solid, i) =>
      assert.deepEqual(
        mesh.children[i].geometry.attributes.position.array,
        solid.vertices,
      ),
    );
    assert.deepEqual(
      actorShapes(def, 0),
      a,
      "seeking back restores the exact pose",
    );
    // All triangles face outward relative to their convex part's centroid.
    for (const solid of b) {
      const v = solid.vertices,
        center = [0, 1, 2].map((k) => {
          let sum = 0;
          for (let i = k; i < v.length; i += 3) sum += v[i];
          return sum / (v.length / 3);
        });
      for (let i = 0; i < solid.indices.length; i += 3) {
        const [a, b, c] = Array.from(solid.indices.slice(i, i + 3), (j) =>
          Array.from(v.slice(j * 3, j * 3 + 3)),
        );
        const u = b.map((n, j) => n - a[j]),
          w = c.map((n, j) => n - a[j]);
        const n = [
          u[1] * w[2] - u[2] * w[1],
          u[2] * w[0] - u[0] * w[2],
          u[0] * w[1] - u[1] * w[0],
        ];
        assert.ok(
          n.reduce((s, n, j) => s + n * (a[j] - center[j]), 0) > 0,
          `${kind}/${solid.name} winding`,
        );
      }
    }
    mesh.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
  }
});

test("animated enemy collisions and poses reproduce after snapshot restore", () => {
  const c = blankCourse();
  c.goal.z = 30;
  c.enemies = [
    {
      id: "m",
      kind: "muncher",
      x: 2,
      y: 0.9,
      z: 0,
      radius: 0.65,
      roam: 4,
      speed: 0.6,
    },
  ];
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 85; i++) sim.step();
  const snap = sim.snapshot();
  for (let i = 0; i < 100; i++) sim.step();
  const expected = structuredClone({
    players: sim.players,
    enemies: sim.enemies,
  });
  sim.restore(snap);
  for (let i = 0; i < 100; i++) sim.step();
  assert.deepEqual({ players: sim.players, enemies: sim.enemies }, expected);
  sim.dispose();
});

test("Aerial peg banks retract flush, extend from below and use round shared hulls", () => {
  const c = aerialCourse();
  validateCourse(c);
  const pegs = c.parts.filter((p) => p.profile === "peg");
  assert.equal(pegs.length, 9);
  for (const p of pegs) {
    const base = motionAt(
      p,
      (-(p.motion.phase ?? 0) * p.motion.period) / (Math.PI * 2),
    );
    const up = motionAt(
      p,
      (-(p.motion.phase ?? 0) * p.motion.period) / (Math.PI * 2) +
        p.motion.period * 0.45,
    );
    assert.ok(Math.abs(base.position.y - p.y) < 1e-6);
    assert.ok(Math.abs(up.position.y - base.position.y - 1.75) < 1e-6);
    const { vertices: v } = partGeometry(p);
    assert.ok(Math.max(...Array.from(v).filter((_, i) => i % 3 === 1)) === 0);
    assert.ok(
      new Set(
        Array.from(v)
          .filter((_, i) => i % 3 === 0)
          .map((n) => n.toFixed(4)),
      ).size > 10,
    );
  }
});
