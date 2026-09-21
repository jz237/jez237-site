import test from "node:test";
import assert from "node:assert/strict";
import { Vector3, Quaternion } from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { waveStrip, wavePose } from "../src/wave.mjs";
import { validateCourse, compileCourse } from "../src/course.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import {
  blankCourse,
  workshopObjects,
  moveWorkshopObject,
  rotateWorkshopObject,
  removeWorkshopObject,
} from "../src/workshop.mjs";
await initPhysics();
const config = {
  profile: "crest",
  amplitude: 2.2,
  period: 2.4,
  wavelength: 9.6,
  crestWidth: 3.6,
  crestPeak: 0.2,
  anchorLength: 0.8,
  segmentLength: 0.3,
};
const vertices = (p, t) => {
  const pose = wavePose(p, t),
    q = new Quaternion(
      pose.rotation.x,
      pose.rotation.y,
      pose.rotation.z,
      pose.rotation.w,
    ),
    pos = new Vector3(pose.position.x, pose.position.y, pose.position.z);
  return Array.from({ length: 8 }, (_, i) =>
    new Vector3(...pose.vertices.slice(i * 3, i * 3 + 3))
      .applyQuaternion(q)
      .add(pos),
  );
};
const rotate = (v, center, angle) =>
  new Vector3(
    center.x +
      (v.x - center.x) * Math.cos(angle) -
      (v.z - center.z) * Math.sin(angle),
    v.y,
    center.z +
      (v.x - center.x) * Math.sin(angle) +
      (v.z - center.z) * Math.cos(angle),
  );

test("a whole wave is one editor object and rigid edits preserve every animated seam and linked references", () => {
  const c = blankCourse(),
    wave = waveStrip(
      "course:wave",
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 3, z: 12 },
      4,
      config,
    );
  c.parts.push(
    ...wave,
    ...waveStrip("other", { x: 20, y: 0, z: 0 }, { x: 20, y: 0, z: 8 }, 3),
  );
  const others = structuredClone(
    c.parts.filter((p) => p.motion?.strip !== "course:wave"),
  );
  const objects = workshopObjects(c);
  assert.equal(objects.filter((o) => o.key === "wave:course:wave").length, 1);
  assert.equal(
    objects.filter((o) => o.key.startsWith("part:course:wave")).length,
    0,
  );
  const key = "wave:course:wave",
    center = objects.find((o) => o.key === key).value,
    before = structuredClone(wave),
    angle = Math.PI / 4;
  const point = { x: wave[0].x, y: wave[0].y, z: wave[0].z, part: wave[0].id };
  c.route = [
    point,
    {
      x: 0,
      y: 1,
      z: -1,
      waitFor: { part: wave[2].id, axis: "y", min: 1, max: 4 },
    },
  ];
  c.playerRoutes = [c.route];
  c.alternateRoutes = [{ id: "shared", route: c.route }];
  rotateWorkshopObject(c, key, angle);
  const delta = new Vector3(11, 2, -7);
  moveWorkshopObject(c, key, {
    x: center.x + 11,
    y: center.y + 2,
    z: center.z - 7,
  });
  for (const t of [0, 0.37, 1.29, 2.4])
    for (let i = 0; i < wave.length; i++) {
      const actual = vertices(wave[i], t),
        expected = vertices(before[i], t).map((v) =>
          rotate(v, center, angle).add(delta),
        );
      actual.forEach((v, j) => assert.ok(v.distanceTo(expected[j]) < 1e-5));
      if (i < wave.length - 1) {
        const next = vertices(wave[i + 1], t);
        for (const [a, b] of [
          [1, 0],
          [2, 3],
          [5, 4],
          [6, 7],
        ])
          assert.ok(actual[a].distanceTo(next[b]) < 1e-5);
      }
    }
  for (const axis of ["x", "y", "z"])
    assert.ok(
      Math.abs(point[axis] - wave[0][axis]) < 1e-10,
      "aliased routes move once",
    );
  assert.deepEqual(
    c.parts.filter((p) => p.motion?.strip !== "course:wave"),
    others,
  );
  const saved = validateCourse(JSON.parse(JSON.stringify(c)));
  assert.deepEqual(compileCourse(c).moving, compileCourse(saved).moving);
  for (const strip of ["", 17, " ".repeat(3), "x".repeat(101)]) {
    const bad = structuredClone(saved);
    bad.parts.find((p) => p.motion?.axis === "wave").motion.strip = strip;
    assert.throws(() => validateCourse(bad), /Invalid wave strip identifier/);
  }
  removeWorkshopObject(c, key);
  assert.deepEqual(c.parts, others);
  assert.equal(point.part, undefined);
  assert.equal(c.route[1].waitFor, undefined);
  validateCourse(c);
});

test("legacy individual wave panels rotate in the same direction as ordinary editor parts and remain valid", () => {
  const c = blankCourse(),
    panels = waveStrip("old", { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 8 }, 4);
  for (const p of panels) delete p.motion.strip;
  c.parts.push(...panels);
  const p = panels[4],
    before = structuredClone(p),
    angle = Math.PI / 4;
  rotateWorkshopObject(c, `part:${p.id}`, angle);
  validateCourse(c);
  assert.equal(p.angle, undefined);
  for (const t of [0, 0.5, 1.3])
    vertices(p, t).forEach((v, i) =>
      assert.ok(
        v.distanceTo(rotate(vertices(before, t)[i], before, angle)) < 1e-6,
      ),
    );
  rotateWorkshopObject(c, `part:${p.id}`, -angle);
  assert.deepEqual(p, before);
});

test("moved and rotated crest strips retain exact collider tops, physical lifting and deterministic restoration", () => {
  const c = blankCourse();
  c.goal.z = 50;
  c.parts.push(
    ...waveStrip(
      "wave",
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 12 },
      6,
      config,
    ),
  );
  rotateWorkshopObject(c, "wave:wave", Math.PI / 2);
  moveWorkshopObject(c, "wave:wave", { x: 12, y: 3, z: -5 });
  c.starts = [{ x: 12, y: 3.56, z: -5 }];
  const sim = new Simulation(validateCourse(JSON.parse(JSON.stringify(c))), {
    untimed: true,
  });
  let maxY = 0;
  for (let i = 0; i < 180; i++) {
    sim.step();
    maxY = Math.max(maxY, sim.players[0].current.position.y);
    if (i % 30 === 0)
      for (const m of sim.movers) {
        const col = sim.world.getRigidBody(m.handle).collider(0);
        const pos = m.current.position;
        const hit = col.castRay(
          new RAPIER.Ray(
            { x: pos.x, y: pos.y + 8, z: pos.z },
            { x: 0, y: -1, z: 0 },
          ),
          10,
          true,
        );
        assert.ok(Math.abs(hit - 8) < 1e-4);
      }
  }
  assert.ok(maxY > 5, "the edited physical wave lifts the marble");
  const snapshot = sim.snapshot();
  for (let i = 0; i < 180; i++) sim.step();
  const expected = structuredClone(sim.players);
  sim.restore(snapshot);
  for (let i = 0; i < 180; i++) sim.step();
  assert.deepEqual(sim.players, expected);
  sim.dispose();
});

test("moving starts, goals or unlinked hazards leaves unrelated demo waypoints in place", () => {
  const c = blankCourse();
  c.route = [
    { x: 1, y: 0, z: 2 },
    { x: 3, y: 0, z: 4 },
  ];
  c.zones = [{ kind: "hazard", x: 0, y: 0, z: 0, radius: 1 }];
  const before = structuredClone(c.route);
  for (const key of ["start:0", "goal:0", "zone:0"])
    moveWorkshopObject(c, key, { x: 10, y: 2, z: 20 });
  assert.deepEqual(c.route, before);
  validateCourse(c);
});
