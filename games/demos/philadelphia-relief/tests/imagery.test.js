import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { LAYERS, defaults } from '../src/schema.js';
import { PRESETS, presetPatch } from '../src/presets.js';
import { ASSETS, assess, MODE } from '../src/degraded.js';
import { createStore } from '../src/state.js';
import { decodeState, encodeState } from '../src/urlstate.js';

const dataUrl = new URL('../data/', import.meta.url);
const imagery = JSON.parse(await readFile(new URL('imagery.json', dataUrl), 'utf8'));
const terrain = JSON.parse(await readFile(new URL('terrain.json', dataUrl), 'utf8'));
const bytes = await readFile(new URL('imagery.webp', dataUrl));

test('aerial imagery asset', async (t) => {
  await t.test('is the exact terrain footprint in a north-up geographic projection', () => {
    assert.deepEqual(imagery.bounds, terrain.bounds);
    assert.equal(imagery.projection, 'EPSG:4326');
    assert.equal(imagery.width, 4096);
    assert.equal(imagery.height, 4096);
    assert.equal(imagery.format, 'webp');
  });

  await t.test('matches its manifest and stays within the startup budget', () => {
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.equal(bytes.length, imagery.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), imagery.sha256);
    assert.ok(bytes.length < 5.5 * 1024 * 1024,
      `imagery payload ${(bytes.length / 1024 / 1024).toFixed(2)} MiB exceeds budget`);
  });

  await t.test('has public-domain provenance and visible credit text', () => {
    assert.match(imagery.source.name, /USGS Imagery Only/);
    assert.match(imagery.source.license, /public domain/i);
    assert.match(imagery.source.credit, /USGS The National Map/);
  });
});

test('aerial mode state', async (t) => {
  await t.test('opens with imagery and without synthetic 3D buildings', () => {
    assert.equal(LAYERS.imagery.def, true);
    assert.equal(LAYERS.structures.def, false);
    assert.equal(defaults().layers.imagery, true);
    assert.equal(defaults().layers.structures, false);
    for (const preset of PRESETS) {
      const layers = presetPatch(preset.id).layers;
      assert.equal(layers.imagery, true, `${preset.id} imagery`);
      assert.equal(layers.structures, false, `${preset.id} structures`);
    }
  });

  await t.test('degrades to relief if only the optional imagery is missing', () => {
    const allOk = Object.fromEntries(ASSETS.map((asset) => [asset.id, true]));
    const status = assess({ ...allOk, imagery: false });
    assert.equal(status.mode, MODE.PARTIAL);
    assert.ok(status.disableLayers.includes('imagery'));
  });

  await t.test('both surface choices survive a shared URL', () => {
    const store = createStore();
    store.set({ layers: { imagery: false, structures: true } });
    const hash = encodeState(store.get());
    assert.match(hash, /(?:^|&)Li=0(?:&|$)/);
    assert.match(hash, /(?:^|&)Lx=1(?:&|$)/);
    const restored = createStore(decodeState(`#${hash}`));
    assert.equal(restored.get().layers.imagery, false);
    assert.equal(restored.get().layers.structures, true);
  });
});
