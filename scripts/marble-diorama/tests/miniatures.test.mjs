import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { actorShapes } from "../src/actor-shapes.mjs";
import { actorMesh, updateActorMesh } from "../src/actor-view.mjs";
import { validateCourse, part } from "../src/course.mjs";
import { sillyCourse } from "../src/silly.mjs";
await initPhysics();
const forms = ["steelie", "muncher", "acid"];
function fixture(form) {
  const c = blankCourse();
  c.parts = [part("floor", 0, 0, 24, 24)];
  c.starts = [{ x: 0, y: 0.55, z: 4 }];
  c.goal.z = 10;
  c.enemies = [
    {
      id: "mini",
      kind: "mini",
      form,
      x: 0,
      y: 0.24,
      z: 0,
      radius: 0.22,
      roam: 2,
      speed: 0.65,
    },
  ];
  return c;
}
test("Silly has three small steelies, three curling munchers and three acid puddles", () => {
  const c = validateCourse(sillyCourse());
  for (const form of forms)
    assert.equal(
      c.enemies.filter((e) => e.kind === "mini" && e.form === form).length,
      3,
    );
  const imported = validateCourse(JSON.parse(JSON.stringify(c)));
  assert.deepEqual(imported.enemies, c.enemies);
  imported.enemies[0].form = "bird";
  assert.throws(() => validateCourse(imported), /miniature form/);
});
test("miniature solids remain supported, animate with their colliders and replay exactly", () => {
  for (const form of forms) {
    const sim = new Simulation(fixture(form), { untimed: true });
    const e = sim.enemies[0];
    for (let i = 0; i < 60; i++) sim.step();
    assert.ok(
      Math.abs(e.current.position.y - 0.22) < 0.0022,
      `${form} rests on its visible underside`,
    );
    assert.ok(Math.abs(sim.world.getRigidBody(e.handle).mass() - 0.12) < 1e-5);
    const initial = actorShapes(e.def, 0);
    if (initial) {
      const solids = actorShapes(e.def, sim.tick / 120),
        mesh = actorMesh(initial);
      updateActorMesh(mesh, solids);
      assert.notDeepEqual(
        solids.map((s) => s.vertices),
        initial.map((s) => s.vertices),
      );
      for (let j = 0; j < solids.length; j++) {
        const s = solids[j],
          collider = sim.world.getCollider(e.colliders[j]);
        assert.deepEqual(
          mesh.children[j].geometry.attributes.position.array,
          s.vertices,
        );
        const actual = collider.vertices();
        if (s.trimesh) {
          assert.deepEqual(actual, s.vertices);
          assert.deepEqual(collider.indices(), s.indices);
        } else
          for (let k = 0; k < actual.length; k += 3)
            assert.ok(
              Array.from(
                { length: s.vertices.length / 3 },
                (_, i) => i * 3,
              ).some(
                (i) =>
                  Math.hypot(
                    ...[0, 1, 2].map((a) => actual[k + a] - s.vertices[i + a]),
                  ) < 1e-6,
              ),
            );
      }
      mesh.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
    }
    const snap = sim.snapshot();
    for (let i = 0; i < 80; i++) sim.step();
    const expected = structuredClone(sim.enemies[0].current);
    sim.restore(snap);
    for (let i = 0; i < 80; i++) sim.step();
    assert.deepEqual(sim.enemies[0].current, expected);
    sim.dispose();
  }
});
test("each miniature form pays only on real contact and remains harmless after collection", () => {
  for (const form of forms) {
    const c = fixture(form);
    c.starts = [{ x: 0, y: 0.55, z: 1.5 }];
    const sim = new Simulation(c, { untimed: true });
    const events = [];
    for (let i = 0; i < 240; i++) events.push(...sim.step([{ x: 0, z: -1 }]));
    assert.equal(events.filter((e) => e.type === "collect").length, 1, form);
    assert.equal(sim.enemies[0].collected, true, form);
    assert.equal(
      sim.world.getRigidBody(sim.enemies[0].handle).isEnabled(),
      false,
    );
    assert.equal(sim.players[0].deaths, 0);
    assert.equal(sim.players[0].time, c.time + 3);
    sim.dispose();
  }
});
