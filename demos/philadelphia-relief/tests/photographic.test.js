import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults } from '../src/schema.js';
import { createStore } from '../src/state.js';
import { encodeState, decodeState } from '../src/urlstate.js';
import { photoAllowed, photoWanted, photoCamera } from '../src/photo-policy.js';
import { PRESET_EXCLUDED } from '../src/presets.js';

test('close-up switch has hysteresis and returns to the wide miniature', () => {
  const state = defaults();
  assert.equal(photoWanted(state, 132000), false);
  assert.equal(photoWanted(state, 6400), true);
  assert.equal(photoWanted(state, 8000, true), true);
  assert.equal(photoWanted(state, 8000, false), false);
  assert.equal(photoWanted(state, 10000, true), false);
});
test('explicit modes and factual map layers take precedence over automatic switching', () => {
  const state = defaults();
  assert.equal(photoWanted({ ...state, photoMode: 'relief' }, 200), false);
  assert.equal(photoWanted({ ...state, photoMode: 'photo' }, 90000), true);
  for (const patch of [{ era: '1776' }, { compareMode: 'aerial' },
    { layers: { ...state.layers, flood: true } }, { layers: { ...state.layers, contours: true } },
    { layers: { ...state.layers, imagery: false } }]) {
    assert.equal(photoAllowed({ ...state, ...patch }), false);
    assert.equal(photoWanted({ ...state, ...patch, photoMode: 'photo' }, 200), false);
  }
});
test('camera mapping preserves vertical field of view and cardinal orientations', () => {
  for (const aspect of [.5, 1, 2]) {
    const mapped = photoCamera({ fov: 40, pitch: 0, bearing: 90, dist: 1000 }, aspect);
    const vertical = aspect > 1 ? 2 * Math.atan(Math.tan(mapped.fov / 2) / aspect) : mapped.fov;
    assert.ok(Math.abs(vertical - 40 * Math.PI / 180) < 1e-10);
    assert.equal(mapped.pitch, -Math.PI / 2);
    assert.equal(mapped.heading, Math.PI / 2);
    assert.equal(mapped.range, 1000);
  }
  assert.equal(photoCamera({ fov: 40, pitch: 60, bearing: 0, dist: 200 }, 1).pitch,
    -30 * Math.PI / 180);
});
test('view choice survives shared URLs and presets preserve it', () => {
  const store = createStore({ photoMode: 'relief' });
  assert.equal(decodeState(encodeState(store.get())).photoMode, 'relief');
  assert.ok(PRESET_EXCLUDED.has('photoMode'));
  store.set({ photoMode: 'untrusted-value' });
  assert.equal(store.value('photoMode'), 'relief');
});
