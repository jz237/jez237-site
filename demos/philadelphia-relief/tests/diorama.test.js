import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { dioramaAmount, displayExaggeration, edgeSamples, createDiorama } from '../src/diorama.js';
import { defaults } from '../src/schema.js';
import { createStore } from '../src/state.js';
import { encodeState, decodeState } from '../src/urlstate.js';

test('miniature exaggeration eases monotonically to the selected scale before street detail', () => {
  const state = defaults();
  let previous = state.exaggeration;
  for (let d = 200; d <= 150000; d += 100) {
    const value = displayExaggeration(state, d);
    assert.ok(value >= previous && value <= 15);
    if (d <= 9000) assert.equal(value, state.exaggeration);
    previous = value;
  }
  for (const d of [200, 9000, 150000]) {
    assert.equal(dioramaAmount(d, false), 0);
    assert.equal(displayExaggeration({ ...state, diorama: 0 }, d), state.exaggeration);
    assert.equal(displayExaggeration({ ...state, era: '1776' }, d), state.exaggeration);
    assert.equal(displayExaggeration({ ...state, compareMode: 'history' }, d), state.exaggeration);
    assert.equal(displayExaggeration({ ...state, layers: { ...state.layers, terrain: false } }, d), 0);
  }
});

test('cutaway walls follow the exact geographic perimeter without gaps', () => {
  const points = edgeSamples(94000, 95000, 64);
  assert.equal(points.length, 260);
  for (const p of points) {
    assert.ok(p.uv.every(value => value >= 0 && value <= 1));
    assert.equal(p.x, (p.uv[0] - .5) * 94000);
    assert.equal(p.z, (p.uv[1] - .5) * 95000);
    assert.ok(Math.abs(p.x) === 47000 || Math.abs(p.z) === 47500);
  }
  for (let side = 0; side < 4; side++) {
    const last = points[side * 65 + 64], next = points[((side + 1) % 4) * 65];
    assert.deepEqual(last.uv, next.uv);
  }
});

test('stage rebinds terrain after adaptive quality changes and disposes owned resources', () => {
  const uniforms = { uHeight: { value: new THREE.Texture() }, uExag: { value: 15 } };
  const stage = createDiorama(THREE, { terrain: { uniforms },
    projection: { widthM: 94000, heightM: 95000 }, imagery: null, sampleElevation: () => 12 });
  const wall = stage.group.children[0];
  assert.ok(wall.geometry.index.count > 0);
  const next = { uniforms: { uHeight: { value: new THREE.Texture() }, uExag: { value: 2 } } };
  stage.attachTerrain(next);
  assert.equal(wall.material.uniforms.uHeight, next.uniforms.uHeight);
  stage.update(0, 2, new THREE.Vector3(0, 1, 0), defaults(), { dist: 200 });
  assert.equal(wall.visible, false);
  stage.update(1, 15, new THREE.Vector3(0, 1, 0), defaults(), { dist: 140000 });
  assert.equal(wall.visible, true);
  let disposed = 0;
  stage.group.traverse(node => node.geometry?.addEventListener('dispose', () => disposed++));
  stage.dispose();
  assert.equal(disposed, 2);
});

test('classic presentation preference round trips without changing real map controls', () => {
  const state = createStore();
  state.set({ diorama: 0, exaggeration: 1, camDist: 200 });
  const roundTrip = createStore(decodeState(encodeState(state.get()))).get();
  assert.equal(roundTrip.diorama, 0);
  assert.equal(roundTrip.exaggeration, 1);
  assert.equal(roundTrip.camDist, 200);
});
