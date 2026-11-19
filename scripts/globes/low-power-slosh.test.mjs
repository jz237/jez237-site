import assert from 'node:assert/strict';
import test from 'node:test';
import { Vector3 } from 'three';
import { Slosh, SURFACE_RADIUS, WATER_LEVEL } from './src/lowPower/slosh.mjs';
import { GLASS_INNER } from './src/render/scape/mesh.mjs';

test('a shove raises one wall, the wave overshoots, then the film settles level', () => {
  for (const hz of [15, 30, 60]) {
    const water = new Slosh();
    for (let i = 0; i < hz / 2; i++) water.step(1 / hz, [7, -24, 0], [0, 0, 0]);
    assert.ok(water.heightAt(0.8, 0) - water.heightAt(-0.8, 0) > 0.25);
    let minimum = 1;
    for (let i = 0; i < 8 * hz; i++) {
      water.step(1 / hz, [0, -24, 0], [0, 0, 0]);
      minimum = Math.min(minimum, water.sx);
    }
    assert.ok(minimum < -0.05);
    assert.ok(Math.abs(water.heightAt(0.8, 0) - WATER_LEVEL) < 0.001);
  }
});

test('surface sampling meets the drawn waterline on the sphere during repeated hard tilts', () => {
  const water = new Slosh();
  for (let i = 0; i < 200; i++) {
    water.step(1 / 30, [24 * Math.sin(i / 8), -24, 24 * Math.cos(i / 8)], [1, 0, -1]);
    const a = i * 0.21;
    const rim = new Vector3(SURFACE_RADIUS * Math.cos(a), WATER_LEVEL, SURFACE_RADIUS * Math.sin(a)).applyQuaternion(water.rotation);
    assert.ok(Math.abs(rim.length() - GLASS_INNER) < 1e-10);
    assert.ok(Math.abs(rim.y - water.heightAt(rim.x, rim.z)) < 1e-8);
    assert.ok(Math.hypot(water.sx, water.sz) <= 0.371);
  }
});
