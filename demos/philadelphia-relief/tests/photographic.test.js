import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults } from '../src/schema.js';
import { createStore } from '../src/state.js';
import { encodeState, decodeState } from '../src/urlstate.js';
import { photoAllowed, photoWanted, photoCamera, photoReady, photoTileReady } from '../src/photo-policy.js';
import { PRESET_EXCLUDED } from '../src/presets.js';

test('aircraft horizon handoff accepts neighborhood tiles but rejects country-scale geometry', () => {
  assert.equal(photoTileReady(64.01), false, 'ordinary close-up readiness stays unchanged');
  assert.equal(photoTileReady(64.01, 500), true);
  assert.equal(photoTileReady(128.4, 500), true, 'provider errors are not exact powers of two');
  assert.equal(photoTileReady(256, 500), false);
  assert.equal(photoTileReady(1024.2, 14000), true, 'high aircraft need wider initial coverage');
  assert.equal(photoTileReady(4096, 14000), false);
  assert.equal(photoTileReady(Infinity, 500), false);
  assert.equal(photoReady(0, 500, true), false, 'many coarse horizon tiles cannot trigger handoff');
});

test('photographic handoff rejects a loaded coarse fallback and sparse initial detail', () => {
  assert.equal(photoReady(0, 50, true), false);
  assert.equal(photoReady(1, 20, false), false);
  assert.equal(photoReady(1, 20, true), false);
  assert.equal(photoReady(8, 30, false), true);
  assert.equal(photoReady(1, 1, true), true);
});

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
