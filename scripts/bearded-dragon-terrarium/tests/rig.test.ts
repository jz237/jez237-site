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
  I.clearance = 1.15; // walking preset plus the brain's 0.2 cm motion lift
  I.chestLift = 0.15;
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
      const wrist = new THREE.Vector3(0, 0.35, 0).applyMatrix4(lizard.bones[leg.data.bones.hand].matrix);
      assert.ok(Math.abs(e.distanceTo(wrist) - leg.data.lowerLength * LIZARD_SCALE) < 1e-4, 'lower limb length preserved');
      assert.ok(s.distanceTo(wrist) < (leg.data.upperLength + leg.data.lowerLength) * LIZARD_SCALE * 0.97, 'stance limb remains bent');
      assert.ok(hand.y >= 0.0018, 'heel peel raises the hand above its sole');
    });
  }
  assert.ok(steps >= 12, `took ${steps} steps`);
  // the heel peels about the toes, so allow a few millimetres at the hand origin
  assert.ok(maxSlide < 0.006, `planted feet slid ${(maxSlide * 1000).toFixed(1)} mm`);
  assert.ok(Math.abs(I.x - 0.48) < 1e-6);
  for (const b of lizard.bones) for (const v of b.matrix.elements) assert.ok(Number.isFinite(v));
});

function bellySamples(speed: number, clearance: number, chestLift: number) {
  const lizard = model(), rig = new LizardRig(lizard, flat);
  Object.assign(rig.inputs, {x: -0.4, speed, clearance, chestLift});
  const a = lizard.mesh.geometry.getAttribute('position'), ids: number[] = [];
  for (let i = 0; i < a.count; i++) {
    if (a.getX(i) > 2.2 && a.getX(i) < 6.8 && a.getY(i) < 1.4 && Math.abs(a.getZ(i)) < 1.1) ids.push(i);
  }
  assert.ok(ids.length > 100, 'samples the visible belly skin');
  const v = new THREE.Vector3(), samples: number[] = [];
  for (let i = 0; i < 240; i++) {
    rig.inputs.x += speed / 60;
    rig.update(1 / 60);
    lizard.root.updateMatrixWorld(true);
    if (i < 60) continue;
    let lowest = Infinity;
    for (const id of ids) {
      v.fromBufferAttribute(a, id);
      lizard.mesh.applyBoneTransform(id, v);
      lowest = Math.min(lowest, v.applyMatrix4(lizard.mesh.matrixWorld).y);
    }
    samples.push(lowest);
  }
  samples.sort((a, b) => a - b);
  return {lowest: samples[0], median: samples[Math.floor(samples.length / 2)]};
}

test('walking visibly lifts the skinned belly above the resting crouch', () => {
  const rest = bellySamples(0, 0.12, 0.45);
  for (const speed of [0.075, 0.12]) {
    const walk = bellySamples(speed, 1.15, 0.15);
    assert.ok(rest.median < 0.004, 'resting posture stays low');
    assert.ok(walk.median > rest.median + 0.009, `visible lift at ${speed} m/s`);
    assert.ok(walk.lowest > 0.008 && walk.median < 0.026, 'walk clears the floor while retaining a sprawl');
  }
});

test('footfall cadence follows speed and hind feet retain longer stance', () => {
  type TestLeg = {front: boolean; swing: boolean; planted: THREE.Vector3};
  const periods: number[] = [];
  for (const speed of [0.025, 0.075, 0.30]) {
    const rig = new LizardRig(model(), flat);
    Object.assign(rig.inputs, {x: -0.5, speed, clearance: 1.15, chestLift: 0.15});
    const legs = (rig as unknown as {legs: TestLeg[]}).legs;
    const downs: number[][] = legs.map(() => []);
    let time = 0, frontStance = 0, hindStance = 0, frames = 0;
    rig.onFootDown = p => downs[legs.findIndex(leg => leg.planted === p)].push(time);
    const duration = speed > 0.2 ? 2.8 : 5;
    for (let i = 0; i < duration * 60; i++) {
      time += 1 / 60;
      rig.inputs.x += speed / 60;
      rig.update(1 / 60);
      assert.ok(legs.filter(leg => !leg.swing).length >= 2, 'never lifts three supports');
      if (time < 1) continue;
      frames++;
      for (const leg of legs) if (!leg.swing) {if (leg.front) frontStance++; else hindStance++;}
    }
    const intervals = downs.flatMap(times => times.slice(2).map((t, i) => t - times[i + 1]));
    intervals.sort((a, b) => a - b);
    assert.ok(intervals.length >= 4, 'observed repeated full strides');
    const median = intervals[Math.floor(intervals.length / 2)];
    assert.ok(intervals.every(t => Math.abs(t - median) < median * 0.2), 'steady movement produces complete strides without extra shuffles');
    periods.push(median);
    assert.ok(hindStance / (frames * 2) > frontStance / (frames * 2) + 0.04, 'hind feet stay down longer');
    if (speed === 0.30) {
      assert.ok(Math.abs(frontStance / (frames * 2) - 0.63) < 0.055, 'forefoot stance matches the measured walking range');
      assert.ok(Math.abs(hindStance / (frames * 2) - 0.74) < 0.055, 'hindfoot stance matches the measured walking range');
    }
  }
  assert.ok(periods[0] > periods[1] * 1.4 && periods[1] > periods[2] * 2, 'steps speed up with forward travel');
});

test('stopping completes the last steps and rests without marching in place', () => {
  const rig = new LizardRig(model(), flat);
  Object.assign(rig.inputs, {x: -0.3, speed: 0.075, clearance: 1.15, chestLift: 0.15});
  for (let i = 0; i < 120; i++) {rig.inputs.x += rig.inputs.speed / 60; rig.update(1 / 60);}
  Object.assign(rig.inputs, {speed: 0, clearance: 0.12, chestLift: 0.45});
  const phase = rig.phase;
  for (let i = 0; i < 90; i++) rig.update(1 / 60);
  let extraSteps = 0;
  rig.onFootDown = () => extraSteps++;
  for (let i = 0; i < 120; i++) rig.update(1 / 60);
  assert.equal(rig.phase, phase, 'stride clock stops with the body');
  assert.equal(extraSteps, 0, 'no repeated stepping after settling');
  assert.equal((rig as unknown as {legs: {swing: boolean}[]}).legs.some(leg => leg.swing), false, 'all four feet planted');
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
