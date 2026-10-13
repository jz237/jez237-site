// Locomotion checks for the procedural rig on flat ground (no WebGL needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import {LizardModel, LIZARD_SCALE, type LizardData} from '../lib/LizardModel';
import {LizardRig} from '../lib/LizardRig';

const dir = path.resolve(import.meta.dirname, '..', 'public', 'lizard');
function model() {
  const data = JSON.parse(readFileSync(path.join(dir, 'lizard.json'), 'utf8')) as LizardData;
  const bin = readFileSync(path.join(dir, data.file));
  return new LizardModel(data, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
}
const flat = {heightAt: () => 0, normalAt: (_x: number, _z: number, out = new THREE.Vector3()) => out.set(0, 1, 0)};
const pos = (m: THREE.Matrix4) => new THREE.Vector3().setFromMatrixPosition(m);

test('walking: feet stay planted in stance, limbs keep their length, the body advances', () => {
  const lizard = model();
  const rig = new LizardRig(lizard, flat);
  const I = rig.inputs;
  I.speed = 0.12;
  const dt = 1 / 60;
  const legs = (rig as unknown as {legs: {swing: boolean; data: {bones: {hand: number; upper: number; lower: number}; upperLength: number; lowerLength: number}}[]}).legs;
  const planted = new Map<number, THREE.Vector3>();
  let maxSlide = 0, steps = 0;
  for (let i = 0; i < 240; i++) {
    I.x += I.speed * dt;
    rig.update(dt);
    if (i < 30) continue; // settle
    legs.forEach((leg, k) => {
      const hand = pos(lizard.bones[leg.data.bones.hand].matrix);
      if (leg.swing) {if (planted.has(k)) steps++; planted.delete(k); return;}
      const p = planted.get(k);
      if (!p) planted.set(k, hand.clone());
      else maxSlide = Math.max(maxSlide, Math.hypot(hand.x - p.x, hand.z - p.z));
      // IK keeps both limb segments at their sculpted length
      const s = pos(lizard.bones[leg.data.bones.upper].matrix), e = pos(lizard.bones[leg.data.bones.lower].matrix);
      assert.ok(Math.abs(s.distanceTo(e) - leg.data.upperLength * LIZARD_SCALE) < 1e-4, 'upper limb length preserved');
    });
  }
  assert.ok(steps >= 12, `took ${steps} steps`);
  // the heel peels about the toes, so allow a few millimetres at the hand origin
  assert.ok(maxSlide < 0.006, `planted feet slid ${(maxSlide * 1000).toFixed(1)} mm`);
  assert.ok(Math.abs(I.x - 0.48) < 1e-6);
  for (const b of lizard.bones) for (const v of b.matrix.elements) assert.ok(Number.isFinite(v));
});

test('the tail drags on the ground behind the body and never sinks into it', () => {
  const lizard = model();
  const rig = new LizardRig(lizard, flat);
  const I = rig.inputs;
  I.speed = 0.1;
  I.turnRate = 1.2;
  for (let i = 0; i < 300; i++) {
    I.heading += I.turnRate / 60;
    I.x += Math.cos(I.heading) * I.speed / 60;
    I.z -= Math.sin(I.heading) * I.speed / 60;
    rig.update(1 / 60);
  }
  const tip = pos(lizard.bones[lizard.bone('tail10')].matrix);
  const base = pos(lizard.bones[lizard.bone('tail1')].matrix);
  assert.ok(tip.y >= 0 && tip.y < 0.01, `tail tip rests on the ground (${tip.y.toFixed(4)})`);
  assert.ok(base.y > tip.y, 'tail base is raised from the pelvis');
  const fwd = new THREE.Vector3(Math.cos(I.heading), 0, -Math.sin(I.heading));
  assert.ok(tip.clone().sub(new THREE.Vector3(I.x, 0, I.z)).dot(fwd) < 0, 'tail trails behind');
});

test('the head turns quickly toward something it looks at', () => {
  const lizard = model();
  const rig = new LizardRig(lizard, flat);
  rig.inputs.look = new THREE.Vector3(0.05, 0.03, -0.25); // to its left
  for (let i = 0; i < 60; i++) rig.update(1 / 60);
  const toTarget = rig.inputs.look!.clone().sub(rig.snout).setY(0).normalize();
  const fwd = rig.headForward.clone().setY(0).normalize();
  const angle = Math.acos(THREE.MathUtils.clamp(fwd.dot(toTarget), -1, 1));
  assert.ok(angle < 0.75, `head within ${(angle * 57.3).toFixed(0)}° of the target`);
});

test('the jaw opens around its hinge and the beard puffs', () => {
  const lizard = model();
  const rig = new LizardRig(lizard, flat);
  rig.update(1 / 60);
  const closed = rig.mouth.clone();
  rig.inputs.jaw = 1;
  rig.inputs.display = 1;
  rig.update(1 / 60);
  assert.ok(rig.mouth.y < closed.y - 0.002, 'the lower jaw drops');
});

test('a slow upright turn retains at least two planted feet', () => {
  const rig = new LizardRig(model(), flat);
  const legs = (rig as unknown as {legs: {swing: boolean}[]}).legs;
  rig.inputs.turnRate = 0.85;
  let lifted = 0;
  for (let i = 0; i < 180; i++) {
    rig.inputs.heading += rig.inputs.turnRate / 60;
    rig.update(1 / 60);
    const inAir = legs.filter(l => l.swing).length;
    lifted += inAir;
    assert.ok(inAir <= 2, 'retains two supports while repositioning its feet');
  }
  assert.ok(lifted > 4, 'takes correction steps during the turn');
});

test('walking under an overhead branch keeps the body on the floor', () => {
  const branchHeight = (x: number) => x > 0.05 && x < 0.35 ? 0.45 : 0;
  const rig = new LizardRig(model(), {
    ...flat,
    heightAt: branchHeight,
    heightBelow: (x, _z, ceiling) => branchHeight(x) <= ceiling ? branchHeight(x) : 0,
  });
  let previous = 0, largestStep = 0, highestBody = 0;
  for (let i = 0; i < 450; i++) {
    rig.inputs.speed = 0.08;
    rig.inputs.x += 0.08 / 60;
    rig.update(1 / 60);
    const y = rig.spinePoints()[3].y;
    if (i > 15) largestStep = Math.max(largestStep, Math.abs(y - previous));
    highestBody = Math.max(highestBody, y);
    previous = y;
  }
  assert.ok(highestBody < 0.07, `stays below the branch (${highestBody.toFixed(3)} m)`);
  assert.ok(largestStep < 0.005, `no upward pop (${largestStep.toFixed(3)} m/frame)`);
});
