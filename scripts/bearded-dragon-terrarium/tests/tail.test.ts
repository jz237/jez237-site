import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {TailContacts} from '../lib/TailContacts';
import {TailDynamics} from '../lib/TailDynamics';
import {archGeometry} from '../lib/DesertDetails';

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const lengths = Array.from({length: 11}, (_, i) => i === 10 ? .013 : .026);
const radii = [.019, .015, .010, .008, .006, .0045, .0035, .0027, .0018, .0010, .0006];

test('an unsupported tail hangs under gravity without snapping down to the floor', () => {
  const tail = new TailDynamics(lengths, radii, new TailContacts([], () => 0));
  const root = v(0, .35, 0), back = v(1, 0, 0);
  tail.reset(root, back);
  const initial = tail.points.at(-1)!.y;
  let largestStep = 0, previous = initial;
  for (let i = 0; i < 180; i++) {
    tail.update(1 / 60, root, back, 0);
    const y = tail.points.at(-1)!.y;
    largestStep = Math.max(largestStep, Math.abs(y - previous)); previous = y;
  }
  const tip = tail.points.at(-1)!;
  assert.ok(tip.y < root.y - .10, 'the free end sags');
  assert.ok(tip.y > .06, 'the floor cannot pull an out-of-reach tail down');
  assert.ok(largestStep < .015, `smooth gravity motion (${largestStep} m/frame)`);
  let a = root, largestError = 0;
  tail.points.forEach((p, i) => {
    largestError = Math.max(largestError, Math.abs(a.distanceTo(p) - lengths[i])); a = p;
    assert.ok(p.toArray().every(Number.isFinite));
  });
  assert.ok(largestError < .002, `tail segments retain length (${largestError} m error)`);
});

test('the underside of overhead wood does not attract a nearby tail', () => {
  const wood = new THREE.Mesh(new THREE.BoxGeometry(.3, .04, .12));
  wood.position.y = .16;
  const collision = new TailContacts([wood], () => 0);
  const point = v(0, .115, 0), old = point.clone(), normal = new THREE.Vector3();
  assert.equal(collision.projectPoint(old, point, .01, normal), false);
  assert.ok(point.equals(old), 'a separated point is left free');
  const tail = new TailDynamics(lengths, radii, collision), root = v(-.15, .10, 0);
  tail.reset(root, v(1, 0, 0));
  for (let i = 0; i < 120; i++) tail.update(1 / 60, root, v(1, 0, 0), 0);
  assert.ok(tail.points.every(p => p.y < .125), 'gravity carries the tail away from the underside');
});

test('a moving tail joint cannot tunnel through the side of a branch', () => {
  const wood = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .2, 48));
  wood.rotation.z = Math.PI / 2; wood.position.y = .15;
  const collision = new TailContacts([wood], () => 0);
  const old = v(0, .15, .10), point = v(0, .15, -.10), normal = new THREE.Vector3();
  assert.equal(collision.projectPoint(old, point, .008, normal), true);
  assert.ok(point.z >= .038, `remains on the approached side (${point.z})`);
  assert.ok(Math.abs(point.y - .15) < .003, 'side contact does not lift the tail onto the branch');
});

test('wood contact checks the tail between joints, including its thickness', () => {
  const wood = new THREE.Mesh(new THREE.SphereGeometry(.03, 64, 32));
  wood.position.y = .15;
  const collision = new TailContacts([wood], () => 0);
  const a = v(-.04, .184, 0), b = v(.04, .184, 0), na = new THREE.Vector3(), nb = new THREE.Vector3();
  assert.equal(collision.projectPoint(a.clone(), a, .005, na), false);
  assert.equal(collision.projectPoint(b.clone(), b, .005, nb), false);
  assert.equal(collision.projectSegment(a, b, .005, .005, false, na, nb), true);
  const axis = new THREE.Line3(a, b), closest = axis.closestPointToPoint(v(0, .15, 0), true, new THREE.Vector3());
  assert.ok(closest.distanceTo(v(0, .15, 0)) >= .0354, 'the capsule clears the wood even with both joints outside it');
});

test('a tail slides over a ledge and falls freely beyond its edge', () => {
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(.12, .04, .15));
  ledge.position.set(-.07, .14, 0); // top .16, right edge -.01
  const tail = new TailDynamics(lengths, radii, new TailContacts([ledge], () => 0));
  const root = v(-.045, .21, 0), back = v(1, 0, 0);
  tail.reset(root, back);
  let largestError = 0;
  for (let i = 0; i < 240; i++) {
    root.x += .00015;
    tail.update(1 / 60, root, back, 0);
    let a = root;
    tail.points.forEach((p, k) => {
      largestError = Math.max(largestError, Math.abs(a.distanceTo(p) - lengths[k])); a = p;
      assert.ok(p.y >= radii[k], 'tail stays above the sand');
      const inside = p.x > -.13 && p.x < -.01 && p.y > .12 && p.y < .16 && Math.abs(p.z) < .075;
      assert.equal(inside, false, 'tail remains outside the solid ledge');
    });
  }
  assert.ok(tail.points.at(-1)!.y < .02, 'the unsupported tip settles onto the sand');
  assert.ok(tail.points[0].y > .17, 'the thick base remains attached to the raised hips');
  assert.ok(largestError < .004, `contact does not stretch the tail (${largestError} m error)`);
});

test('a confined half-turn bends around the shelter without climbing its roof or stretching', () => {
  const hide = new THREE.Mesh(archGeometry(.36, .155, .19, .105, .24, 12));
  hide.position.z = -.16;
  const tail = new TailDynamics(lengths, radii, new TailContacts([hide], () => 0));
  const root = v(0, .028, -.055), back = v(0, 0, 1);
  tail.reset(root, back);
  for (let i = 1; i <= 240; i++) {
    const yaw = Math.PI / 2 + Math.PI * i / 240;
    back.set(Math.cos(yaw), 0, Math.sin(yaw));
    tail.update(1 / 60, root, back, 0);
  }
  for (let i = 0; i < 240; i++) tail.update(1 / 60, root, back, 0);
  let a = root, largestError = 0;
  tail.points.forEach((p, i) => {
    largestError = Math.max(largestError, Math.abs(a.distanceTo(p) - lengths[i])); a = p;
    assert.ok(p.y < .05, `tail settles beneath the chamber ceiling (joint ${i}, y=${p.y})`);
    assert.ok(Math.abs(p.z) < .291, 'tail remains inside the glass');
  });
  assert.ok(largestError < .004, `confined turn retains tail length (${largestError} m error)`);
});

test('a rock base on the sand ejects an overlapping joint sideways instead of below the floor', () => {
  const rock = new THREE.Mesh(new THREE.BoxGeometry(.04, .08, .1)); rock.position.y = .04;
  const collision = new TailContacts([rock], () => 0), p = v(.005, .004, 0), normal = v(0, 0, 0);
  collision.projectPoint(p.clone(), p, .004, normal);
  assert.ok(Math.abs(p.x) >= .024 || Math.abs(p.z) >= .054 || p.y >= .084, 'joint exits the solid');
  assert.ok(p.y >= .004, 'the selected exit respects the sand');
});

test('a segment crossing a thin wall is resolved even when neither joint is inside it', () => {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(.012, .05, .1)); wall.position.y = .025;
  const collision = new TailContacts([wall], () => 0), a = v(-.02, .006, 0), b = v(.02, .006, 0);
  for (let i = 0; i < 16; i++) collision.projectSegment(a, b, .003, .003, false, v(0, 0, 0), v(0, 0, 0));
  for (let i = 0; i <= 30; i++) {
    const p = a.clone().lerp(b, i / 30);
    assert.ok(!(Math.abs(p.x) < .006 && p.y < .05 && Math.abs(p.z) < .05), 'the entire segment exits the wall');
  }
});
