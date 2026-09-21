import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { acidPositionAt } from "../src/acid.mjs";
import { ACID_RECOVERY_TICKS } from "../src/acid-capture.mjs";
import { acidDeathGroup, updateAcidDeath } from "../src/acid-death-view.mjs";
import { AudioEngine } from "../src/audio.mjs";
await initPhysics();
function fixture(options = {}) {
  const c = blankCourse();
  c.starts = [
    { x: 0, y: 0.55, z: 0 },
    { x: -3, y: 0.55, z: -3 },
  ];
  c.rules = { respawn: "last-safe" };
  c.zones = [
    {
      kind: "acid",
      x: 0,
      y: 0,
      z: 0,
      radius: 1.2,
      patrol: {
        points: [
          { x: 0, z: 0 },
          { x: 2, z: 0 },
          { x: 2, z: 2 },
          { x: 0, z: 2 },
        ],
        speed: 1,
      },
    },
  ];
  const sim = new Simulation(c, { players: 2, untimed: true, ...options });
  sim.players[0].safePosition = { x: -3, y: 0.55, z: 0 };
  const events = sim.step();
  assert.deepEqual(
    events.filter((e) => e.type === "fall"),
    [{ type: "fall", player: 0, cause: "acid" }],
  );
  return sim;
}
test("acid contact dissolves only the captured player and restores the saved destination on the simulation clock", () => {
  const sim = fixture(),
    p = sim.players[0];
  assert.equal(p.status, "falling");
  assert.equal(p.respawnTick - sim.tick, ACID_RECOVERY_TICKS);
  assert.equal(sim.body(p).isEnabled(), false);
  assert.equal(sim.players[1].status, "racing");
  const destination = { ...p.acidCapture.destination };
  for (let i = 0; i < 130; i++) sim.step();
  const snap = sim.snapshot();
  const finish = () => {
    const events = [];
    while (sim.tick < 301)
      events.push(...sim.step([{ x: 1, z: 1, turbo: true }]));
    const p = sim.players[0];
    assert.equal(p.status, "racing");
    assert.equal(p.acidCapture, null);
    assert.equal(p.deaths, 1);
    assert.equal(events.filter((e) => e.type === "respawn").length, 1);
    assert.ok(
      Math.hypot(
        ...["x", "y", "z"].map((k) => p.current.position[k] - destination[k]),
      ) < 0.001,
    );
    assert.equal(sim.players[1].deaths, 0);
    return structuredClone(sim.players);
  };
  const first = finish();
  sim.restore(snap);
  assert.deepEqual(finish(), first);
  sim.dispose();
});
test("acid dissolution rides the moving pool, stays above its surface, and reassembles solid sectors without a final rotation jump", () => {
  const sim = fixture(),
    p = sim.players[0],
    capture = p.acidCapture,
    zone = sim.course.zones[0];
  capture.rotation = { x: 0, y: Math.sin(0.4), z: 0, w: Math.cos(0.4) };
  const marble = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 24),
    new THREE.MeshStandardMaterial({ map: new THREE.Texture() }),
  );
  const group = acidDeathGroup(marble, 0);
  const at = (age) => {
    const time = capture.tick / 120 + age;
    updateAcidDeath(group, p, zone, time, sim.preset.machineSpeed);
    return group.children.map((m) => ({
      visible: m.visible,
      position: m.position.toArray(),
    }));
  };
  const start = at(0),
    mid = at(0.6);
  assert.notDeepEqual(start, mid);
  assert.equal(group.children[0].material.map, marble.material.map);
  let lastTop = Infinity;
  for (let age = 0; age < 1; age += 0.04) {
    at(age);
    const shell = group.children[0],
      verts = shell.geometry.attributes.position;
    const pool = acidPositionAt(
      zone,
      (capture.tick / 120 + age) * sim.preset.machineSpeed,
    );
    let top = -Infinity;
    for (let i = 0; i < verts.count; i++) {
      const y = verts.getY(i) + shell.position.y;
      assert.ok(
        y >= pool.y + 0.125 - 1e-7,
        "no intact sphere or cap hangs below the pool",
      );
      top = Math.max(top, y);
    }
    assert.ok(top <= lastTop + 1e-7);
    lastTop = top;
    assert.ok(Math.abs(shell.position.x - (pool.x + capture.offset.x)) < 1e-8);
  }
  at(1.1);
  assert.equal(group.children[0].visible, false);
  assert.ok(group.children[1].children.every((m) => !m.visible));
  const returned = at(1.8);
  assert.deepEqual(at(1.8), returned, "pause cannot advance the effect");
  at(2.5 - 1e-6);
  for (const m of group.children[1].children) {
    assert.ok(
      m.position.distanceTo(
        new THREE.Vector3(...Object.values(capture.destination)),
      ) < 1e-5,
    );
    assert.ok(m.quaternion.angleTo(new THREE.Quaternion()) < 1e-5);
    assert.ok(m.scale.distanceTo(new THREE.Vector3(1, 1, 1)) < 1e-8);
  }
  p.status = "timeout";
  at(1.8);
  assert.equal(group.visible, false);
  group.traverse((m) => m.geometry?.dispose());
  marble.geometry.dispose();
  marble.material.map.dispose();
  marble.material.dispose();
  group.children[0].material.dispose();
  sim.dispose();
});
test("acid recovery consumes the independent clock and timeout suppresses respawn", () => {
  const sim = fixture({ untimed: false });
  sim.players[0].time = 0.2;
  for (let i = 0; i < 310; i++) sim.step();
  assert.equal(sim.players[0].status, "timeout");
  assert.equal(sim.players[0].deaths, 1);
  assert.equal(sim.body(sim.players[0]).isEnabled(), false);
  assert.equal(sim.players[1].status, "racing");
  sim.dispose();
});
test("acid capture uses its bubbling cue instead of the generic breaking cue", () => {
  const calls = [];
  const audio = Object.create(AudioEngine.prototype);
  audio.effect = (...args) => calls.push(args);
  audio.event({ type: "fall", cause: "acid", player: 1 });
  assert.deepEqual(calls, [["acid", { key: "acid-capture:1" }]]);
});

test("reassembled fragments preserve the original whole-marble texture coordinates", () => {
  const marble = new THREE.Mesh(
    new THREE.SphereGeometry(0.55),
    new THREE.MeshStandardMaterial(),
  );
  const group = acidDeathGroup(marble, 0);
  for (const fragment of group.children[1].children) {
    const p = fragment.geometry.attributes.position,
      uv = fragment.geometry.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i);
      if (Math.abs(v.length() - 0.55) > 1e-5 || Math.abs(v.y) > 0.5499)
        continue;
      const phi = 2 * Math.PI * uv.getX(i),
        theta = Math.PI * (1 - uv.getY(i));
      const expected = new THREE.Vector3(
        -0.55 * Math.cos(phi) * Math.sin(theta),
        0.55 * Math.cos(theta),
        0.55 * Math.sin(phi) * Math.sin(theta),
      );
      assert.ok(
        v.distanceTo(expected) < 1e-6,
        "sector UV must address its portion of the complete sphere",
      );
    }
  }
  group.traverse((m) => m.geometry?.dispose());
  group.children[0].material.dispose();
  marble.geometry.dispose();
  marble.material.dispose();
});
