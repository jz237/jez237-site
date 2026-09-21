import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createCanopyCulling } from '../src/canopy-culling.js';

function camera(x = 0) {
  const c = new THREE.PerspectiveCamera(50, 1.5, .1, 10000);
  c.position.set(x, 150, 300); c.lookAt(x, 30, 0); c.updateMatrixWorld(); return c;
}
test('canopy culling preserves original instances, restores them after a pan, and skips idle uploads', () => {
  const geometry = new THREE.InstancedBufferGeometry();
  const positions = [0, 20, 0, 9000, 10, 0, 10, 25, 10], sizes = [7, 12, 5];
  const culling = createCanopyCulling(THREE, geometry, positions, sizes, 100);
  const c = camera(); culling.update(c, 1, 1);
  assert.equal(geometry.instanceCount, 2);
  assert.deepEqual([...geometry.attributes.aTree.array.slice(0, 6)], [0, 20, 0, 10, 25, 10]);
  assert.deepEqual([...geometry.attributes.aSize.array.slice(0, 2)], [7, 5]);
  const version = geometry.attributes.aTree.version;
  for (let i = 0; i < 60; i++) culling.update(c, 1, 1);
  assert.equal(geometry.attributes.aTree.version, version);
  culling.update(camera(9000), 1, 1);
  assert.equal(geometry.instanceCount, 1);
  assert.deepEqual([...geometry.attributes.aTree.array.slice(0, 3)], [9000, 10, 0]);
  culling.update(c, 1, 1); assert.equal(geometry.instanceCount, 2);
  assert.deepEqual(positions, [0, 20, 0, 9000, 10, 0, 10, 25, 10]);
});
test('crown bounds retain every visible shader vertex across relief scales and camera angles', () => {
  const positions = [], sizes = [];
  for (let x = -1000; x <= 1000; x += 100) for (let z = -1000; z <= 1000; z += 100) {
    positions.push(x, (x + z) / 20, z); sizes.push(7 + ((x + 1000) / 100) % 6);
  }
  const g = new THREE.InstancedBufferGeometry();
  const culling = createCanopyCulling(THREE, g, positions, sizes, 100);
  const sphere = new THREE.SphereGeometry(1, 7, 5).attributes.position;
  const p = new THREE.Vector3();
  for (const exag of [0, 1, 15, 80]) for (const amount of [.045, 1]) {
    for (const angle of [0, 1, 2, 3]) {
      const c = camera(); c.position.set(Math.sin(angle) * 1100, 600, Math.cos(angle) * 1100);
      c.lookAt(0, 0, 0); c.updateMatrixWorld(); culling.update(c, exag, amount);
      const retained = new Set();
      for (let i = 0; i < g.instanceCount; i++) {
        retained.add(`${g.attributes.aTree.getX(i)}:${g.attributes.aTree.getZ(i)}`);
      }
      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i], seed = (size * .317) % 1;
        for (let v = 0; v < sphere.count; v++) {
          p.fromBufferAttribute(sphere, v);
          const lobes = 1 + .12 * Math.sin(p.x * 9 + seed * 12) * Math.sin(p.z * 7 - p.y * 6);
          p.multiplyScalar(lobes * size * amount);
          p.multiply(new THREE.Vector3(.85 + seed * .15, 1.05 + seed * .55, 1 - seed * .18));
          p.x += positions[i * 3]; p.y += size * .9 * amount + positions[i * 3 + 1] * exag;
          p.z += positions[i * 3 + 2]; p.project(c);
          if (Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && Math.abs(p.z) <= 1) {
            assert.ok(retained.has(`${positions[i * 3]}:${positions[i * 3 + 2]}`)); break;
          }
        }
      }
    }
  }
});
