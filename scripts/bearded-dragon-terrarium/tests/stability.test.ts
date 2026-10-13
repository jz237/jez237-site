import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import {LizardModel, type LizardData} from '../lib/LizardModel';
import {LizardRig} from '../lib/LizardRig';
import {Nav} from '../lib/Nav';
import type {Surface} from '../lib/Surface';
import {TailDynamics} from '../lib/TailDynamics';
import {TailContacts} from '../lib/TailContacts';
import {LizardBrain} from '../lib/LizardBrain';

const dir = path.resolve(import.meta.dirname, '..', 'public', 'lizard');
function model() {
  const data = JSON.parse(readFileSync(path.join(dir, 'lizard.json'), 'utf8')) as LizardData;
  const bin = readFileSync(path.join(dir, data.file));
  return new LizardModel(data, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
}
const flat = {heightAt: () => 0, normalAt: (_x: number, _z: number, out = new THREE.Vector3()) => out.set(0, 1, 0)};
const rotation = (m: THREE.Matrix4) => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m));
type PoseAccess = {tailPts: THREE.Vector3[]; solveSpine(dt: number): void; commit(): void};

test('a vertical hanging tail keeps its cross-section orientation across small bends', () => {
  const lizard = model(), rig = new LizardRig(lizard, flat);
  rig.inputs.breath = 0; rig.update(1 / 60);
  const pose = rig as unknown as PoseAccess, root = rig.spinePoints()[5].clone();
  const render = (lean: number) => {
    pose.tailPts.forEach((p, i) => p.set(root.x - .04 + lean * Math.max(0, i - 2), root.y - i * .023, root.z));
    pose.commit();
    return Array.from({length: 10}, (_, i) => rotation(lizard.bones[lizard.bone(`tail${i + 1}`)].matrix));
  };
  const a = render(-.00001), b = render(.00001);
  for (let i = 4; i < 10; i++) assert.ok(a[i].angleTo(b[i]) < .02, `no axial flip at vertical joint ${i}`);
});

test('a deflected tail cannot rotate the pelvis or reposition the hind legs', () => {
  const lizard = model(), rig = new LizardRig(lizard, flat);
  rig.inputs.breath = 0; rig.update(1 / 60);
  const pose = rig as unknown as PoseAccess;
  const bones = [lizard.bone('pelvis'), ...lizard.data.limbs.filter(l => l.kind === 'hind').flatMap(l => [l.bones.upper, l.bones.lower])];
  pose.solveSpine(1 / 60); pose.commit();
  const before = bones.map(i => lizard.bones[i].matrix.clone());
  pose.tailPts[0].add(new THREE.Vector3(.012, -.02, .009));
  pose.solveSpine(1 / 60); pose.commit();
  bones.forEach((bi, i) => {
    assert.ok(rotation(before[i]).angleTo(rotation(lizard.bones[bi].matrix)) < .00001, `tail contact cannot drive ${lizard.data.bones[bi].name}`);
    assert.ok(new THREE.Vector3().setFromMatrixPosition(before[i]).distanceTo(new THREE.Vector3().setFromMatrixPosition(lizard.bones[bi].matrix)) < .000001);
  });
});

test('a hind knee crosses its IK pole direction without snapping around', () => {
  const lizard = model(), rig = new LizardRig(lizard, flat);
  rig.inputs.breath = 0; rig.update(1 / 60);
  type Knee = {data: LizardData['limbs'][number]; front: boolean; side: number; planted: THREE.Vector3; wristAbove: number; reach: number};
  const leg = (rig as unknown as {legs: Knee[]}).legs.find(l => !l.front)!;
  const shoulder = new THREE.Vector3().setFromMatrixPosition(lizard.bones[leg.data.bones.upper].matrix);
  const pole = new THREE.Vector3(.022, .045, leg.side * .045);
  let previous: THREE.Quaternion | undefined;
  for (let i = -40; i <= 40; i++) {
    const direction = pole.clone().add(new THREE.Vector3(i * .000003, 0, 0)).normalize();
    leg.planted.copy(shoulder).addScaledVector(direction, leg.reach * .75);
    leg.planted.y -= (.12 + leg.wristAbove) * .016;
    (rig as unknown as PoseAccess).commit();
    const current = rotation(lizard.bones[leg.data.bones.upper].matrix);
    if (previous) assert.ok(previous.angleTo(current) < .08, 'no pole singularity flip');
    previous = current;
  }
});

test('a stepping foot lands on the real ledge surface rather than an interpolated edge', () => {
  const lizard = model();
  const support = (x: number) => x < 0 ? .02 : 0;
  const rig = new LizardRig(lizard, {
    ...flat,
    heightAt: x => x < -.002 ? .02 : x > .002 ? 0 : (.002 - x) * 5,
    supportAt: (x, _z, _ceiling, out) => {out.y = support(x); out.normal.set(0, 1, 0); return out;},
  });
  const limb = lizard.data.limbs.find(l => l.kind === 'front')!;
  rig.inputs.x = .001 - (limb.wrist[0] + limb.forward[0] * .05 - rig.rootX) * .016;
  rig.inputs.clearance = .95; rig.reset();
  const leg = (rig as unknown as {legs: {front: boolean; planted: THREE.Vector3}[]}).legs.find(l => l.front)!;
  assert.ok(Math.abs(leg.planted.y - support(leg.planted.x)) < .00001, 'foothold belongs to a visible surface');
});

test('a hind foot approaches its landing orientation while still in flight', () => {
  const lizard = model(), landingNormal = new THREE.Vector3(.6, .7, .3).normalize();
  const rig = new LizardRig(lizard, {...flat, normalAt: (_x, _z, out = new THREE.Vector3()) => out.copy(landingNormal)});
  rig.inputs.breath = 0; rig.update(1 / 60);
  type Foot = {front: boolean; swing: boolean; swingT: number; from: THREE.Vector3; to: THREE.Vector3; planted: THREE.Vector3; normal: THREE.Vector3; fromYaw: number; toYaw: number; plantedYaw: number; stepTop: number; data: LizardData['limbs'][number]};
  const leg = (rig as unknown as {legs: Foot[]}).legs.find(l => !l.front)!;
  leg.from.copy(leg.planted); leg.to.copy(leg.planted); leg.stepTop = 0;
  leg.fromYaw = leg.toYaw = leg.plantedYaw; leg.normal.set(0, 1, 0);
  leg.swing = true; leg.swingT = .98;
  (rig as unknown as PoseAccess).commit();
  const flying = rotation(lizard.bones[leg.data.bones.hand].matrix);
  leg.swing = false; leg.normal.copy(landingNormal);
  (rig as unknown as PoseAccess).commit();
  assert.ok(flying.angleTo(rotation(lizard.bones[leg.data.bones.hand].matrix)) < .08, 'the final frame cannot snap the whole foot to a new normal');
});

test('routing retains small climbing steps and rejects a tall ledge between walkable cells', () => {
  const surface = (rise: number) => ({
    ...flat, heightAt: (x: number) => x >= .25 ? rise : 0,
    kindAt: () => 1,
  }) as unknown as Surface;
  const small = new Nav(surface(.02), []), tall = new Nav(surface(.055), []);
  assert.ok(small.lineClear(-.2, 0, .5, 0, Infinity), 'low steps remain usable');
  assert.ok(tall.walkable(.245, 0) && tall.walkable(.255, 0), 'the two surfaces are individually walkable');
  assert.equal(tall.lineClear(-.2, 0, .5, 0, Infinity), false, 'smoothing cannot shortcut a drop');
  assert.equal(tall.reachable(.5, 0), false, 'connected-region search cannot bridge the ledge');
});

test('a foot gripping a steep face does not spin when its forward direction meets the surface normal', () => {
  const lizard = model(), rig = new LizardRig(lizard, flat);
  rig.inputs.breath = 0; rig.update(1 / 60);
  const leg = (rig as unknown as {legs: {front: boolean; normal: THREE.Vector3; data: LizardData['limbs'][number]}[]}).legs.find(l => !l.front)!;
  const yaw = Math.atan2(-leg.data.forward[2], leg.data.forward[0]);
  leg.normal.set(Math.cos(yaw), .0001, -Math.sin(yaw) - .001).normalize();
  for (let i = 0; i < 60; i++) (rig as unknown as PoseAccess).commit();
  let previous: THREE.Quaternion | undefined;
  for (let i = -50; i <= 50; i++) {
    leg.normal.set(Math.cos(yaw), .0001, -Math.sin(yaw) + i * .00002).normalize();
    (rig as unknown as PoseAccess).commit();
    const current = rotation(lizard.bones[leg.data.bones.hand].matrix);
    if (previous) assert.ok(previous.angleTo(current) < .15, 'no hand-frame pole flip');
    previous = current;
  }
});

test('a resting tail on a ledge stays settled when render frame times vary', () => {
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(.12, .04, .15));
  ledge.position.set(-.07, .14, 0);
  const lengths = Array.from({length: 11}, (_, i) => i === 10 ? .013 : .026);
  const radii = [.019, .015, .010, .008, .006, .0045, .0035, .0027, .0018, .0010, .0006];
  const tail = new TailDynamics(lengths, radii, new TailContacts([ledge], () => 0));
  const root = new THREE.Vector3(-.045, .21, 0), back = new THREE.Vector3(1, 0, 0);
  tail.reset(root, back);
  for (let i = 0; i < 600; i++) tail.update(1 / 60, root, back, 0);
  let largest = 0, previous = tail.points.map(p => p.clone());
  for (let i = 0; i < 360; i++) {
    tail.update([.009, .023, .014, .018, .011, .021][i % 6], root, back, 0);
    tail.points.forEach((p, k) => largest = Math.max(largest, p.distanceTo(previous[k])));
    previous = tail.points.map(p => p.clone());
  }
  assert.ok(largest < .00015, `no timing-induced tremor (${largest} m/frame)`);
});

test('route following keeps an obstructed corner instead of cutting ahead into the obstacle', () => {
  const inputs = {x: .03, z: .20, heading: 0, look: null};
  const lineClear = (ax: number, az: number, bx: number, bz: number) => {
    for (let i = 0; i <= 40; i++) {
      const x = ax + (bx - ax) * i / 40, z = az + (bz - az) * i / 40;
      if (x < .04 && z > .207) return false;
    }
    return true;
  };
  const brain = Object.assign(Object.create(LizardBrain.prototype), {
    rig: {inputs}, surface: {heightAt: () => 0}, nav: {lineClear, isWet: () => false},
    path: [[.01, .20], [.045, .195], [.045, .275], [.085, .28]], pathI: 1, goal: [.085, .28],
    blockedT: 0, stallT: 0, pushedT: 0, pauseT: 0, leadT: 0, nearT: 0, nearBest: Infinity,
    mode: 'travel', hurry: true, cruise: .075, speed: .075, burstLeft: 1,
    tmp2: [0, 0], lookPoint: new THREE.Vector3(),
  });
  brain.travel(1 / 60);
  assert.equal(brain.pathI, 1, 'retain the corner until the next segment is visible');
  assert.ok(lineClear(inputs.x, inputs.z, brain.tmp2[0], brain.tmp2[1]), 'steering aim remains in the usable corridor');
});
