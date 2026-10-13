import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {driftwood} from '../lib/Driftwood';
import {TailContacts} from '../lib/TailContacts';

const wood = driftwood(new THREE.MeshStandardMaterial(), (u, v) => 0.75 + 0.25 * Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 8));

test('the displaced wood and fractured end caps form closed, outward-facing solids', () => {
  for (const mesh of wood) {
    const p = mesh.geometry.getAttribute('position'), index = mesh.geometry.index!;
    const keys: string[] = [];
    for (let i = 0; i < p.count; i++) {
      const xyz = [p.getX(i), p.getY(i), p.getZ(i)];
      assert.ok(xyz.every(Number.isFinite), 'finite surface vertices');
      keys.push(xyz.map(x => Math.round(x * 1e7)).join(','));
    }
    const edges = new Map<string, {count: number; winding: number}>();
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    let volume = 0;
    for (let i = 0; i < index.count; i += 3) {
      const ids = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
      a.fromBufferAttribute(p, ids[0]); b.fromBufferAttribute(p, ids[1]); c.fromBufferAttribute(p, ids[2]);
      volume += a.dot(new THREE.Vector3().crossVectors(b, c)) / 6;
      for (let j = 0; j < 3; j++) {
        const from = keys[ids[j]], to = keys[ids[(j + 1) % 3]];
        assert.notEqual(from, to, 'no collapsed triangle edges');
        const forward = from < to, key = forward ? `${from}|${to}` : `${to}|${from}`;
        const edge = edges.get(key) ?? {count: 0, winding: 0};
        edge.count++; edge.winding += forward ? 1 : -1; edges.set(key, edge);
      }
    }
    for (const edge of edges.values()) {
      assert.equal(edge.count, 2, 'every edge is closed across shell, UV seam and cap');
      assert.equal(edge.winding, 0, 'adjacent faces wind in opposite directions');
    }
    assert.ok(volume > 1e-6, 'closed volume has outward-facing normals');
  }
});

test('tail contacts stop at the actual displaced wood sides and broken ends', () => {
  const contacts = new TailContacts(wood, () => 0), normal = new THREE.Vector3();
  const before = new THREE.Vector3(0.20, 0.171, 0.22), point = new THREE.Vector3(0.20, 0.171, 0.01);
  assert.ok(contacts.projectPoint(before, point, 0.006, normal), 'swept side contact detected');
  assert.ok(point.z > 0.125, 'joint stays on the approached side of the trunk');
  before.set(-0.120, 0.57, -0.108); point.set(-0.120, 0.490, -0.108); normal.set(0, 0, 0);
  assert.ok(contacts.projectPoint(before, point, 0.003, normal), 'broken end remains a solid contact');
  assert.ok(point.y > 0.50, 'closed end keeps the tail above the wood');
});
