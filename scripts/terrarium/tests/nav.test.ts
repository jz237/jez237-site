// Walkability and paths around the pool.
import test from 'node:test';
import assert from 'node:assert/strict';
import {Ground, poolDistance, WATER_LEVEL, groundHeight} from '../lib/Ground';
import {Surface} from '../lib/Surface';
import {Nav} from '../lib/Nav';

const ground = new Ground();
const surface = new Surface(ground.mesh, []);
const nav = new Nav(surface, []);

test('the pool is not walkable and the shore is', () => {
  assert.equal(nav.walkable(0.3, 0.12), false);
  assert.ok(groundHeight(0.3, 0.12) < WATER_LEVEL);
  assert.ok(nav.walkable(-0.3, 0.05));
});

test('paths go around the water and stay clear of the glass', () => {
  const p = nav.path(-0.45, 0.15, 0.48, -0.15);
  assert.ok(p && p.length >= 2, 'a route exists');
  for (let i = 1; i < p!.length; i++) {
    const [ax, az] = p![i - 1], [bx, bz] = p![i];
    for (let t = 0; t <= 1; t += 0.05) {
      const x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      assert.ok(poolDistance(x, z) > 0, 'route stays out of the pool');
      assert.ok(Math.abs(x) < 0.6 - 0.03 && Math.abs(z) < 0.25 - 0.03, 'route keeps off the glass');
    }
  }
});
