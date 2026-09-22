import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  finishSlinkyCapture,
  slinkyCapturePose,
  slinkyReformPose,
} from "../src/slinky-capture.mjs";
import {
  slinkyCaptureGroup,
  updateSlinkyCapture,
} from "../src/slinky-capture-view.mjs";
import { AudioEngine } from "../src/audio.mjs";
const capture = () => ({
  tick: 100,
  releaseTick: 250,
  endTick: 340,
  enemy: "slinky",
  released: false,
  origin: { x: 1, y: 2, z: 3 },
  destination: { x: 8, y: 0.55, z: 9 },
  rotation: { x: 0, y: 0.6, z: 0, w: 0.8 },
});

test("swallow stays at the actual contact and sectors assemble at the exact respawn pose", () => {
  const c = capture();
  const marble = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 24),
    new THREE.MeshStandardMaterial(),
  );
  const group = slinkyCaptureGroup(marble),
    p = { status: "falling", slinkyCapture: c };
  updateSlinkyCapture(group, p, c.tick);
  assert.deepEqual(group.children[0].position.toArray(), [1, 2, 3]);
  assert.deepEqual(group.children[0].quaternion.toArray(), [0, 0.6, 0, 0.8]);
  assert.equal(group.children[0].scale.x, 1);
  const mid = slinkyCapturePose(c, c.tick + 15);
  assert.equal(mid.scale, 0.5);
  assert.deepEqual(mid.position, c.origin);
  updateSlinkyCapture(group, p, c.releaseTick - 1);
  assert.equal(group.children[0].visible, false);
  for (let i = 0; i < 8; i++) {
    const pose = slinkyReformPose(c, c.endTick - 1e-4, i);
    assert.ok(pose.visible);
    assert.ok(
      Math.hypot(
        pose.position.x - 8,
        pose.position.y - 0.55,
        pose.position.z - 9,
      ) < 1e-8,
    );
    assert.ok(pose.rotation.every((v) => Math.abs(v) < 1e-8));
    assert.equal(pose.scale, 1);
  }
  updateSlinkyCapture(group, p, c.releaseTick + 45);
  assert.equal(group.children[1].children.filter((m) => m.visible).length, 8);
  p.status = "timeout";
  updateSlinkyCapture(group, p, c.releaseTick + 60);
  assert.equal(group.visible, false);
  p.status = "racing";
  p.slinkyCapture = null;
  updateSlinkyCapture(group, p, c.endTick);
  assert.equal(group.visible, false);
  group.traverse((o) => {
    o.geometry?.dispose();
  });
  marble.geometry.dispose();
  marble.material.dispose();
});

test("release records one loss only at its deadline and independent players retain separate captures", () => {
  const p = { deaths: 0, slinkyCapture: capture() },
    rival = { deaths: 3, slinkyCapture: null };
  const sim = { tick: 249, players: [p, rival], events: [] };
  finishSlinkyCapture(sim, p);
  finishSlinkyCapture(sim, rival);
  assert.equal(p.deaths, 0);
  sim.tick = 250;
  finishSlinkyCapture(sim, p);
  finishSlinkyCapture(sim, p);
  assert.equal(p.deaths, 1);
  assert.equal(rival.deaths, 3);
  assert.deepEqual(sim.events, [
    { type: "slinky-release", enemy: "slinky", player: 0 },
  ]);
});

test("capture, release and actual bump have distinct effects keys for paired play", () => {
  const audio = new AudioEngine(),
    calls = [];
  audio.effect = (kind, options) => calls.push({ kind, ...options });
  audio.event({ type: "slinky-capture", player: 0 });
  audio.event({ type: "slinky-capture", player: 1 });
  audio.event({ type: "slinky-release", player: 0 });
  audio.event({ type: "slinky-bump", enemy: "a" });
  assert.deepEqual(
    calls.map((c) => c.kind),
    ["swallow", "swallow", "reform", "muncher"],
  );
  assert.equal(new Set(calls.map((c) => c.key)).size, 4);
});
