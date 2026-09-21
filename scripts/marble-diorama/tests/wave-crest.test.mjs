import test from "node:test";
import assert from "node:assert/strict";
import { Vector3, Quaternion } from "three";
import { waveHeight, wavePose, waveStrip } from "../src/wave.mjs";
import { intermediateCourse } from "../src/campaign.mjs";
import { validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
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
const worldTop = (p, t, index) => {
  const pose = wavePose(p, t);
  return new Vector3(...pose.vertices.slice(index * 3, index * 3 + 3))
    .applyQuaternion(
      new Quaternion(
        pose.rotation.x,
        pose.rotation.y,
        pose.rotation.z,
        pose.rotation.w,
      ),
    )
    .add(new Vector3(pose.position.x, pose.position.y, pose.position.z));
};
test("Intermediate crests travel the full continuous strip with flat intervals and no negative troughs", () => {
  const c = intermediateCourse(),
    panels = c.parts.filter((p) => p.motion?.axis === "wave"),
    m = panels[0].motion;
  assert.ok(panels.length > 40);
  assert.ok(panels.every((p) => p.motion.profile === "crest"));
  for (let t = 0; t < 4.8; t += 0.1) {
    assert.equal(waveHeight(m, 0, t), 0);
    assert.equal(waveHeight(m, m.total, t), 0);
    let flat = 0;
    for (let s = 0; s < m.total; s += 0.1) {
      const h = waveHeight(m, s, t);
      assert.ok(h >= 0 && h <= 2.200001);
      if (h === 0) flat++;
    }
    assert.ok(
      flat > 50,
      "long flat spaces separate the traveling raised crests",
    );
    for (let i = 0; i < panels.length - 1; i++) {
      assert.ok(
        worldTop(panels[i], t, 1).distanceTo(worldTop(panels[i + 1], t, 0)) <
          1e-6,
      );
      assert.ok(
        worldTop(panels[i], t, 2).distanceTo(worldTop(panels[i + 1], t, 3)) <
          1e-6,
      );
      assert.ok(
        worldTop(panels[i], t, 5).distanceTo(worldTop(panels[i + 1], t, 4)) <
          1e-6,
      );
      assert.ok(
        worldTop(panels[i], t, 6).distanceTo(worldTop(panels[i + 1], t, 7)) <
          1e-6,
      );
    }
  }
  for (let s = 2; s < 12; s += 0.1) {
    assert.ok(
      Math.abs(waveHeight(m, s, 0) - waveHeight(m, s + 2, 0.5)) < 1e-10,
    );
    assert.ok(Math.abs(waveHeight(m, s, 0) - waveHeight(m, s, 2.4)) < 1e-10);
  }
  validateCourse(JSON.parse(JSON.stringify(c)));
  for (const change of [
    { profile: "fake" },
    { crestWidth: 0 },
    { crestWidth: 10 },
    { crestPeak: 0 },
    { crestPeak: 1 },
    { anchorLength: 0 },
    { anchorLength: 99 },
    { amplitude: -1 },
  ]) {
    const bad = structuredClone(c);
    Object.assign(
      bad.parts.find((p) => p.motion?.axis === "wave").motion,
      change,
    );
    assert.throws(() => validateCourse(bad), /Invalid wave crest/);
  }
});
test("a passing crest lifts a marble physically and restores its contact outcome from a snapshot", () => {
  const c = blankCourse();
  c.goal.z = 50;
  c.parts = waveStrip(
    "crest",
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 20 },
    6,
    config,
  );
  c.starts = [{ x: 0, y: 0.56, z: 6 }];
  const sim = new Simulation(c, { untimed: true });
  let height = 0;
  for (let i = 0; i < 180; i++) {
    sim.step();
    height = Math.max(height, sim.players[0].current.position.y);
  }
  assert.ok(height > 2, "kinematic crest lifts the real sphere");
  const snap = sim.snapshot();
  for (let i = 0; i < 180; i++) sim.step();
  const expected = structuredClone(sim.players);
  sim.restore(snap);
  for (let i = 0; i < 180; i++) sim.step();
  assert.deepEqual(sim.players, expected);
  sim.dispose();
});
