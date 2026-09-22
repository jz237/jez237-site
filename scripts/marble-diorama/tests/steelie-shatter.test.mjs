import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { steelieBreakPose, steelieChipPose } from "../src/steelie-shatter.mjs";
import {
  steelieShatterGroup,
  updateSteelieShatter,
} from "../src/steelie-shatter-view.mjs";
import { AudioEngine } from "../src/audio.mjs";
import { effectSamples } from "../src/effects.mjs";

const capture = () => ({
  sourceTick: 10,
  origin: { x: 2, y: 3, z: 4 },
  rotation: { x: 0, y: 0.6, z: 0, w: 0.8 },
  radius: 0.7,
});
test("steelie fragments start assembled at the measured pose and follow the recovered visibility deadlines", () => {
  const c = capture(),
    material = new THREE.MeshStandardMaterial(),
    group = steelieShatterGroup(material);
  const e = {
    nativeSteelie: { loaded: true, breaking: true },
    steelieShatter: c,
  };
  try {
    updateSteelieShatter(group, e, 10);
    assert.deepEqual(group.position.toArray(), [2, 3, 4]);
    for (let i = 0; i < 8; i++) {
      assert.ok(group.children[i].position.length()<1e-6);
      assert.deepEqual(
        group.children[i].quaternion.toArray(),
        [0, 0.6, 0, 0.8],
      );
      assert.equal(group.children[i].scale.x, 0.7 / 0.55);
      for (let t = 0; t < 54; t += 0.5) {
        const pose = steelieBreakPose(c, 10 + t, i);
        assert.ok(pose.visible && pose.scale > 0);
        assert.ok(Object.values(pose.position).every(Number.isFinite));
      }
    }
    assert.equal(steelieChipPose(c, 27.999, 0).visible, false);
    assert.equal(steelieChipPose(c, 28, 0).visible, true);
    assert.equal(steelieBreakPose(c, 63.999, 0).visible, true);
    assert.equal(steelieBreakPose(c, 64, 0).visible, false);
    assert.equal(steelieChipPose(c, 71.999, 0).visible, true);
    assert.equal(steelieChipPose(c, 72, 0).visible, false);
    updateSteelieShatter(group, e, 40);
    const before = group.children.map((child) => ({
      position: child.position.toArray(),
      scale: child.scale.toArray(),
      visible: child.visible,
    }));
    updateSteelieShatter(group, e, 62);
    updateSteelieShatter(group, e, 40);
    assert.deepEqual(
      group.children.map((child) => ({
        position: child.position.toArray(),
        scale: child.scale.toArray(),
        visible: child.visible,
      })),
      before,
    );
    const vertex = new THREE.Vector3();
    for (let t = 18; t < 54; t += 2) {
      updateSteelieShatter(group, e, c.sourceTick + t);
      for (const mesh of group.children.slice(0, 8)) {
        const positions = mesh.geometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
          vertex
            .fromBufferAttribute(positions, j)
            .applyQuaternion(mesh.quaternion)
            .multiplyScalar(mesh.scale.x)
            .add(mesh.position);
          assert.ok(
            vertex.y >= -c.radius - 1e-6,
            "retiring chips stay above their landing plane",
          );
        }
      }
    }
    e.nativeSteelie.loaded = false;
    updateSteelieShatter(group, e, 40);
    assert.equal(group.visible, false);
  } finally {
    group.children.forEach((m) => m.geometry.dispose());
    material.dispose();
  }
});

test("steelie cracking and fragment bursts have separate, existing PCM effects and per-guard keys", () => {
  const audio = new AudioEngine(),
    calls = [];
  audio.effect = (kind, options) => calls.push({ kind, ...options });
  audio.event({ type: "steelie-shatter", enemy: "a" });
  audio.event({ type: "steelie-shatter-split", enemy: "a" });
  audio.event({ type: "steelie-shatter", enemy: "b" });
  assert.deepEqual(
    calls.map((c) => c.kind),
    ["crack", "scatter", "crack"],
  );
  assert.equal(new Set(calls.map((c) => c.key)).size, 3);
  for (const kind of ["crack", "scatter"]) {
    const samples = effectSamples(kind, 22050);
    assert.ok(samples?.length > 0);
    assert.ok(samples.every(Number.isFinite));
    assert.ok(samples.some((n) => Math.abs(n) > 0.001));
  }
});
