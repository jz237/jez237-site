import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { aerialCourse, worldPoint } from "../src/campaign.mjs";

await initPhysics();

test("Aerial's two descending lips retain visible and collidable height discontinuities", () => {
  const sim = new Simulation(aerialCourse(), { untimed: true });
  sim.step(); // Refresh broad-phase queries.
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const meshes = sim.compiled.statics.map((g) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(g.vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(g.indices, 1));
    const mesh = new THREE.Mesh(geometry, material);
    mesh.updateMatrixWorld();
    return mesh;
  });
  const heights = [];
  for (const [l, d] of [
    [-9, 84.7],
    [-7.4, 86],
    [3.4, 93.5],
    [3, 96],
  ]) {
    const origin = worldPoint(l, 30, d);
    const hit = sim.world.castRay(
      new RAPIER.Ray(origin, { x: 0, y: -1, z: 0 }),
      40,
      true,
    );
    const ray = new THREE.Raycaster(
      new THREE.Vector3(origin.x, origin.y, origin.z),
      new THREE.Vector3(0, -1, 0),
    );
    const visual = ray.intersectObjects(meshes)[0];
    assert.ok(hit && visual, `receiving surface at ${l}, ${d}`);
    const height = origin.y - hit.timeOfImpact;
    assert.ok(
      Math.abs(height - visual.point.y) < 1e-4,
      "visible and physical tops agree",
    );
    heights.push(height);
  }
  assert.ok(heights[0] - heights[1] > 2.4, "peg-bed exit is a real drop");
  assert.ok(
    heights[2] - heights[3] > 2,
    "white descent begins below the upper ledge",
  );
  for (const mesh of meshes) mesh.geometry.dispose();
  material.dispose();
  sim.dispose();
});

for (const players of [1, 2])
  test(`Aerial ${players}-player ordinary-input routes land after both lower ledges and finish`, () => {
    const sim = new Simulation(aerialCourse(), { players, untimed: true });
    const drivers = sim.players.map(() => new DemoController());
    const landings = [];
    let airborne = 0;
    while (
      sim.tick < 13200 &&
      sim.players.some((p) => p.status !== "finished")
    ) {
      const before = sim.players.map((p) => ({ ...sim.body(p).translation() }));
      const inputs = drivers.map((driver, i) => driver.input(sim, i));
      for (let i = 0; i < players; i++) {
        assert.deepEqual(
          { ...sim.body(sim.players[i]).translation() },
          before[i],
        );
        assert.ok(Math.hypot(inputs[i].x, inputs[i].z) <= 1.000001);
      }
      const events = sim.step(inputs);
      airborne = Math.max(airborne, sim.players[0].impactAirTicks);
      for (const event of events)
        if (event.type === "stun" && event.player === 0) {
          const p = sim.players[0].current.position;
          landings.push({ d: (p.x + p.z) * Math.SQRT1_2, y: p.y, airborne });
          airborne = 0;
        }
    }
    assert.equal(landings.length, 2);
    assert.ok(landings[0].d > 85 && landings[0].d < 90);
    assert.ok(landings[0].y > 8.4 && landings[0].y < 8.7);
    assert.ok(landings[1].d > 94 && landings[1].d < 100);
    assert.ok(landings[1].y < 6.6);
    assert.ok(
      landings.every((p) => p.airborne >= 12),
      "each landing follows real unsupported motion",
    );
    for (const p of sim.players) {
      assert.equal(p.status, "finished");
      assert.equal(p.deaths, 0);
    }
    sim.dispose();
  });
