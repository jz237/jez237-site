import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { trainingRailContact } from "../src/training-rails.mjs";
import { nativeCourse } from "../src/native-campaign.mjs";
import { validateCourse, partGeometry } from "../src/course.mjs";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { nativeSteelieTerrainHeight } from "../src/native-steelie-physics.mjs";
await initPhysics();

test("original training rails distinguish side contacts, endpoint approach and strict windows", () => {
  assert.deepEqual(trainingRailContact(27, 12, -6, 0, 0), {
    reboundX: false,
    reboundZ: true,
    sound: 34,
  });
  assert.deepEqual(trainingRailContact(26, -6, 12, 0, 0), {
    reboundX: true,
    reboundZ: false,
    sound: 34,
  });
  assert.deepEqual(trainingRailContact(27, -1, -6, -1, 0), {
    reboundX: true,
    reboundZ: true,
    sound: 34,
  });
  assert.equal(trainingRailContact(27, -1, -6, 1, 0).reboundX, false);
  assert.equal(trainingRailContact(27, 25, -6, 1, 0).reboundX, true);
  for (const [t, dx, dz] of [
    [26, 0, 12],
    [27, 32, -6],
    [28, 12, 4],
    [29, -8, 12],
    [30, 94, -7],
    [31, -7, 84],
  ])
    assert.equal(trainingRailContact(t, dx, dz, 1, 1), null);
  assert.equal(trainingRailContact(30, 87, -7, 1, 0).reboundX, true);
  assert.equal(trainingRailContact(31, -7, 77, 0, 1).reboundZ, true);
});

test("ten native rails use closed outward rounded solids and survive course serialization", () => {
  const c = nativeCourse("practice"),
    rails = c.parts.filter((p) => p.profile === "rail");
  assert.equal(rails.length, 10);
  for (const p of rails) {
    const g = partGeometry(p),
      edges = new Map();
    let volume = 0;
    assert.equal(g.vertices.length / 3, 386);
    for (let i = 0; i < g.indices.length; i += 3) {
      const [a, b, d] = Array.from(g.indices.slice(i, i + 3), (n) =>
        Array.from(g.vertices.slice(n * 3, n * 3 + 3)),
      );
      volume +=
        (a[0] * (b[1] * d[2] - b[2] * d[1]) +
          a[1] * (b[2] * d[0] - b[0] * d[2]) +
          a[2] * (b[0] * d[1] - b[1] * d[0])) /
        6;
      for (let j = 0; j < 3; j++) {
        const a = g.indices[i + j],
          b = g.indices[i + ((j + 1) % 3)],
          key = [a, b].sort((a, b) => a - b).join();
        const e = edges.get(key) ?? [0, 0];
        e[0]++;
        e[1] += a < b ? 1 : -1;
        edges.set(key, e);
      }
    }
    assert.ok(volume > 0);
    assert.ok(
      [...edges.values()].every(
        ([count, winding]) => count === 2 && winding === 0,
      ),
    );
  }
  validateCourse(JSON.parse(JSON.stringify(c)));
  rails[0].motion = { axis: "y", period: 2, amplitude: 1 };
  assert.throws(() => validateCourse(c), /Invalid mechanism profile/);
  delete rails[0].motion;
  rails[0].d = rails[0].w;
  assert.throws(() => validateCourse(c), /Invalid mechanism profile/);
});

test("rendered native rail skin is the physical contact boundary from both sides", () => {
  const sim = new Simulation(nativeCourse("practice"), { untimed: true });
  try {
    for (const p of sim.course.parts.filter((p) => p.profile === "rail")) {
      const cs = Math.cos(p.angle ?? 0),
        sn = Math.sin(p.angle ?? 0);
      for (const side of [-1, 1]) {
        const ray = new RAPIER.Ray(
          {
            x: p.x + cs * side * 2,
            y: p.y - p.h / 2 + (p.rise ?? 0) / 2,
            z: p.z + sn * side * 2,
          },
          { x: -cs * side, y: 0, z: -sn * side },
        );
        // The red static group consists of the shared rail triangles.
        const index = sim.compiled.statics.findIndex(
          (g) => g.material === "red",
        );
        const hit = sim.world
          .getCollider(sim.staticColliderHandles[index])
          .castRay(ray, 4, true);
        assert.ok(
          hit >= 0 && Math.abs(hit - (2 - p.w / 2)) < 0.001,
          `${p.id}: ${hit}`,
        );
      }
    }
  } finally {
    sim.dispose();
  }
});

test("normal steering contacts a native training rail continuously and restores mid-approach", () => {
  const c = nativeCourse("practice"),
    p = c.parts.find((p) => p.id === "practice-rail-0");
  const probe = new Simulation(c, { untimed: true });
  const start = { x: p.x - 2, z: p.z, y: 0 };
  start.y = nativeSteelieTerrainHeight(probe, start) + 0.55;
  probe.dispose();
  c.starts = [start, { ...start, z: start.z + 1.5 }];
  c.route = [{ x: p.x, y: start.y - 0.55, z: p.z, speed: 2, radius: 0.2 }];
  delete c.playerRoutes;
  const sim = new Simulation(c, { untimed: true }),
    driver = new DemoController();
  let restored;
  try {
    let prior = { ...sim.body(sim.players[0]).translation() },
      contact = false;
    for (let i = 0; i < 360 && !contact; i++) {
      const input = driver.input(sim);
      assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
      sim.step([input]);
      const pos = sim.body(sim.players[0]).translation();
      assert.ok(
        Math.hypot(pos.x - prior.x, pos.y - prior.y, pos.z - prior.z) < 0.15,
      );
      const index = sim.compiled.statics.findIndex((g) => g.material === "red");
      sim.world.contactPair(
        sim.world.getCollider(sim.players[0].collider),
        sim.world.getCollider(sim.staticColliderHandles[index]),
        (m) => {
          for (let j = 0; j < m.numContacts(); j++)
            contact ||= m.contactDist(j) <= 0.0055;
        },
      );
      if (i === 40) {
        restored = new Simulation(c, { untimed: true });
        restored.restore(sim.snapshot());
      } else if (i > 40) restored.step([input]);
      prior = { ...pos };
    }
    assert.equal(sim.players[0].deaths, 0);
    assert.ok(contact, "marble makes real contact with the red rail collider");
    assert.deepEqual(
      restored.body(restored.players[0]).translation(),
      sim.body(sim.players[0]).translation(),
    );
  } finally {
    sim.dispose();
    restored?.dispose();
  }
});
