import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { LAYERS, defaults } from '../src/schema.js';
import { PRESETS, presetPatch } from '../src/presets.js';
import { ASSETS, assess, MODE } from '../src/degraded.js';
import { createStore } from '../src/state.js';
import { decodeState, encodeState } from '../src/urlstate.js';
import {
  DETAIL_DISTANCE_M, ULTRA_DISTANCE_M, ROOFTOP_DISTANCE_M,
  createImageryDetail, detailCellFor, detailImageSize,
  detailResolutionM, detailUrl, imageryTierFor, imageryFocus, neighbourCells,
} from '../src/imagery-detail.js';
import { detailRequest, imagerySources, imageryState, onRequestGet } from '../../../../functions/games/demos/philadelphia-relief/detail-imagery.js';

const dataUrl = new URL('../data/', import.meta.url);
const imagery = JSON.parse(await readFile(new URL('imagery.json', dataUrl), 'utf8'));
const terrain = JSON.parse(await readFile(new URL('terrain.json', dataUrl), 'utf8'));
const bytes = await readFile(new URL('imagery.webp', dataUrl));

test('aerial imagery asset', async (t) => {
  await t.test('is the exact terrain footprint in a north-up geographic projection', () => {
    assert.deepEqual(imagery.bounds, terrain.bounds);
    assert.equal(imagery.projection, 'EPSG:4326');
    assert.equal(imagery.width, 4096);
    assert.equal(imagery.height, 3165);
    const b = imagery.bounds;
    assert.ok(Math.abs(imagery.width / imagery.height - (b.east - b.west) / (b.north - b.south)) < 0.0002);
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
  await t.test('opens with aerial detail without block buildings', () => {
    assert.equal(LAYERS.imagery.def, true);
    assert.equal(LAYERS.structures.def, false);
    assert.equal(defaults().layers.imagery, true);
    assert.equal(defaults().layers.structures, false);
    for (const preset of PRESETS) {
      const layers = presetPatch(preset.id).layers;
      assert.equal(layers.imagery, ['skyline', 'architecture', 'hidden-reef', 'bauder-signs', 'ben-franklin-bridge'].includes(preset.id), `${preset.id} imagery`);
      assert.equal(layers.structures, preset.id === 'architecture', `${preset.id} structures`);
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

test('building-resolution imagery', async (t) => {
  const region = terrain.bounds;
  const projection = terrain.projection;

  await t.test('uses an overlapping close-range cell around Center City', () => {
    const cell = detailCellFor(-75.1652, 39.9526, region);
    assert.ok(cell.bounds.west < -75.1652 && cell.bounds.east > -75.1652);
    assert.ok(cell.bounds.south < 39.9526 && cell.bounds.north > 39.9526);
    assert.ok(cell.bounds.west >= region.west && cell.bounds.east <= region.east);
    assert.ok(cell.bounds.south >= region.south && cell.bounds.north <= region.north);
    assert.ok(detailResolutionM(cell, 4096, projection) < 2.7);
    assert.ok(detailResolutionM(cell, 2048, projection) < 5.3);
    assert.match(detailUrl(cell, 4096), /^detail-imagery\?tier=detail&lon=/);
    assert.equal(DETAIL_DISTANCE_M, 16000);
  });

  await t.test('adds a source-resolution ultra cell only below the block threshold', () => {
    const cell = detailCellFor(-75.1652, 39.9526, region, 'ultra');
    assert.equal(cell.tier, 'ultra');
    assert.ok(detailResolutionM(cell, 4096, projection) < 0.9);
    assert.ok(detailResolutionM(cell, 2048, projection) < 1.8);
    assert.equal(imageryTierFor(ULTRA_DISTANCE_M, 'standard'), 'ultra');
    assert.equal(imageryTierFor(ULTRA_DISTANCE_M, 'data'), 'detail');
    assert.equal(imageryTierFor(DETAIL_DISTANCE_M + 1, 'maximum'), null);
    assert.ok(neighbourCells(cell, region).length >= 2);
  });

  await t.test('uses a tightly bounded roof cell for the final camera descent', () => {
    const cell = detailCellFor(-75.1652, 39.9526, region, 'rooftop');
    assert.equal(cell.tier, 'rooftop');
    assert.ok(cell.bounds.west < -75.1652 && cell.bounds.east > -75.1652);
    assert.ok(detailResolutionM(cell, 4096, projection) < 0.34);
    assert.ok(detailResolutionM(cell, 2048, projection) < 0.67);
    assert.equal(imageryTierFor(ROOFTOP_DISTANCE_M, 'standard'), 'rooftop');
    assert.equal(imageryTierFor(ROOFTOP_DISTANCE_M, 'maximum'), 'rooftop');
    assert.equal(imageryTierFor(ROOFTOP_DISTANCE_M, 'data'), 'detail');
    assert.equal(imageryTierFor(ROOFTOP_DISTANCE_M + 1, 'standard'), 'ultra');
    assert.ok(neighbourCells(cell, region).length >= 2);
  });

  await t.test('chooses a memory-safe phone texture and full desktop texture', () => {
    assert.equal(detailImageSize(390, 3, 'balanced'), 2048);
    assert.equal(detailImageSize(1440, 1.5, 'balanced'), 4096);
    assert.equal(detailImageSize(1920, 2, 'performance'), 2048);
    assert.equal(detailImageSize(390, 3, 'balanced', 'maximum', 'ultra'), 4096);
    assert.equal(detailImageSize(1440, 1, 'cinematic', 'standard', 'ultra'), 2048);
    assert.equal(detailImageSize(1440, 1, 'balanced', 'standard', 'rooftop'), 4096);
    assert.equal(detailImageSize(390, 3, 'balanced', 'standard', 'rooftop'), 2048);
  });

  await t.test('the edge function accepts only bounded map cells and three sizes', () => {
    const valid = detailRequest(new URLSearchParams({
      tier: 'ultra', lon: '-75.1652', lat: '39.9526', size: '4096',
    }));
    assert.ok(valid);
    assert.equal(valid.tier, 'ultra');
    assert.equal(valid.size, 4096);
    assert.ok(valid.bounds.west >= region.west && valid.bounds.east <= region.east);
    const rooftop = detailRequest(new URLSearchParams({
      tier: 'rooftop', lon: '-75.1652', lat: '39.9526', size: '4096',
    }));
    assert.ok(rooftop);
    assert.equal(rooftop.tier, 'rooftop');
    assert.ok(detailResolutionM(rooftop, 4096, projection) < 0.34);
    assert.equal(detailRequest(new URLSearchParams({
      lon: '-77', lat: '39.95', size: '4096',
    })), null);
    assert.equal(detailRequest(new URLSearchParams({
      lon: '-75.16', lat: '39.95', size: '8192',
    })), null);
    assert.equal(detailRequest(new URLSearchParams({
      tier: 'planet', lon: '-75.16', lat: '39.95', size: '4096',
    })), null);
  });
});


test('imagery requests preserve geographic proportions without expanding latitude', () => {
  for (const tier of ['detail', 'ultra', 'rooftop', 'inspection']) {
    const request = detailRequest(new URLSearchParams({
      tier, lon: '-75.1655', lat: '39.9505', size: '4096',
    }));
    const b = request.bounds;
    assert.ok(Math.abs(request.size / request.height - (b.east - b.west) / (b.north - b.south)) < 1e-8);
  }
});


test('close inspection retains geographic alignment and local coverage selection', () => {
  for (const [lon, lat, expected] of [[-75.1652, 39.9526, 'City of Philadelphia'],
    [-74.8827, 40.1368, 'Pennsylvania PEMA'], [-75.05, 39.9, 'New Jersey'], [-75.4, 40.09, 'Pennsylvania PEMA'],
    [-75.55, 39.745, 'Delaware FirstMap'], [-75.796, 39.705, 'Maryland iMAP']]) {
    const request = detailRequest(new URLSearchParams({ tier: 'inspection',
      lon: String(lon), lat: String(lat), size: '4096' }));
    const client = detailCellFor(lon, lat, terrain.bounds, 'inspection');
    assert.deepEqual(request.bounds, client.bounds);
    assert.ok(detailResolutionM(client, 4096, terrain.projection) < 0.17);
    assert.ok(imagerySources(request)[0].name.startsWith(expected));
  }
  assert.equal(imageryTierFor(200, 'maximum'), 'inspection');
  assert.equal(imageryTierFor(400, 'standard'), 'inspection');
  assert.equal(imageryTierFor(401, 'standard'), 'rooftop');
  assert.equal(imageryTierFor(200, 'data'), 'detail');
  assert.equal(imagerySources({ tier: 'detail', bounds: { west: -75.25, east: -75.16,
    south: 39.94, north: 39.96 } }).length, 1, 'cross-boundary cells use complete regional coverage');
});

test('local source outage falls back with honest credit and a short cache', async () => {
  const oldFetch = globalThis.fetch;
  const oldCaches = globalThis.caches;
  const calls = [];
  globalThis.caches = { default: { match: async () => null, put: async () => {} } };
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return calls.length === 1 ? new Response('unavailable', { status: 503 })
      : new Response('jpeg', { headers: { 'Content-Type': 'image/jpeg' } });
  };
  try {
    const response = await onRequestGet({
      request: new Request('https://example.com/detail-imagery?tier=inspection&lon=-75.1652&lat=39.9526&size=2048',
        { headers: { referer: 'https://example.com/' } }), waitUntil() {},
    });
    assert.equal(response.status, 200);
    assert.equal(calls.length, 2);
    assert.match(calls[0], /PhiladelphiaImagery2024/);
    assert.match(calls[1], /PEMAImagery2021_2023/);
    assert.equal(response.headers.get('X-Imagery-Source'), 'Pennsylvania PEMA 2021-2023 / PASDA');
    assert.equal(response.headers.get('Cache-Control'), 'public, max-age=300');
  } finally {
    globalThis.fetch = oldFetch;
    globalThis.caches = oldCaches;
  }
});


test('source routing follows the Delaware River rather than rectangular districts', () => {
  assert.equal(imageryState(-75.1652, 39.9526), 'PA');
  assert.equal(imageryState(-75.119, 39.944), 'NJ');
  assert.equal(imageryState(-74.8827, 40.1368), 'PA');
  assert.equal(imageryState(-74.7429, 40.2171), 'NJ');
  assert.equal(imageryState(-75.55, 39.745), 'DE');
});

test('visible imagery previews, refines, and cancels obsolete requests', async () => {
  const requests = [];
  const shown = [];
  const terrainStub = { setDetailActive() {}, setDetailImagery(image) { shown.push(image); } };
  const api = createImageryDetail({ terrain: terrainStub, region: terrain.bounds,
    projection: terrain.projection,
    loadImage(url, signal) {
      return new Promise((resolve) => requests.push({ url, signal, resolve }));
    },
  });
  const pose = { lon: -75.1652, lat: 39.9526, dist: 200 };
  const consider = (p = pose) => api.consider(p, true, 1440, 1, 'balanced', 'maximum');
  consider({ ...pose, dist: 50000 });
  assert.equal(requests.length, 0, 'no remote image at regional zoom');
  consider(); consider();
  assert.match(requests[0].url, /size=1024/);
  requests[0].resolve({ image: 'preview', source: 'test' });
  await Promise.resolve();
  assert.deepEqual(shown, ['preview']);
  consider(); consider();
  assert.match(requests[1].url, /size=4096/);
  assert.equal(api.stats().refining, true);
  consider({ ...pose, lon: -75.4 });
  assert.equal(requests[1].signal.aborted, true, 'moving cancels old refinement');
  requests[1].resolve({ image: 'stale', source: 'test' });
  await Promise.resolve();
  assert.deepEqual(shown, ['preview'], 'late obsolete responses cannot replace current image');
  consider({ ...pose, lon: -75.4 });
  assert.equal(requests.length, 3);
  consider({ ...pose, dist: 50000 });
  assert.equal(requests[2].signal.aborted, true, 'zooming out stops close-detail downloads');
  api.dispose();
});


test('dragging across grid boundaries retains useful pending imagery', async () => {
  const requests = [];
  const api = createImageryDetail({ terrain: { setDetailActive() {}, setDetailImagery() {} },
    region: terrain.bounds, projection: terrain.projection,
    loadImage(url, signal) {
      return new Promise((resolve) => requests.push({ url, signal, resolve }));
    },
  });
  const pose = { lon: -75.1652, lat: 39.9526, dist: 250 };
  const consider = (lon) => api.consider({ ...pose, lon }, true, 1440, 1, 'balanced', 'maximum');
  consider(pose.lon); consider(pose.lon);
  for (const lon of [-75.1648, -75.1644, -75.1640]) consider(lon);
  assert.equal(requests.length, 1, 'moving through several grid cells keeps the same useful download');
  assert.equal(requests[0].signal.aborted, false);
  requests[0].resolve({ image: 'sharp preview', source: 'test' });
  await Promise.resolve();
  assert.equal(api.stats().size, 1024, 'a quick preview becomes visible even after panning');
  consider(-75.1640); consider(-75.1640);
  assert.match(requests[1].url, /size=4096/);
  assert.equal(api.stats().refining, true);
  api.dispose();
});


test('tilted South Philadelphia view selects detail for the visible foreground', () => {
  const pose = { lon: -75.1677, lat: 39.9278, dist: 4907, bearing: 0.8, pitch: 73.7, fov: 40 };
  const focus = imageryFocus(pose, terrain.projection);
  assert.equal(imageryTierFor(pose.dist), 'detail');
  assert.equal(imageryTierFor(focus.dist), 'ultra');
  assert.ok(focus.lat < pose.lat - 0.01, 'imagery follows the closer foreground');
  assert.ok(focus.lat > pose.lat - 0.03);
  const topDown = { ...pose, pitch: 0 };
  assert.equal(imageryFocus(topDown, terrain.projection), topDown);
  const east = imageryFocus({ ...pose, bearing: 90 }, terrain.projection);
  assert.ok(east.lon < pose.lon);
  assert.ok(Math.abs(east.lat - pose.lat) < 1e-9);
});


test('first detail leaves the backdrop visible and refinement keeps the neighbour', async () => {
  const THREE = await import('../vendor/three.module.min.js');
  const { createTerrain } = await import('../src/terrain.js');
  const map = createTerrain(THREE, { meta: { ...terrain, width: 2, height: 2 },
    grid: new Float32Array(4), macro: new Float32Array(4), quality: 'performance' });
  const a = detailCellFor(-75.1677, 39.9278, terrain.bounds, 'inspection');
  const b = detailCellFor(-75.1640, 39.9278, terrain.bounds, 'inspection');
  const preview = { width: 1024, height: 768 };
  map.setDetailImagery(preview, a.bounds, terrain.bounds);
  assert.deepEqual(map.uniforms.uImageryDetailPrevBounds.value.toArray(), [0, 0, 0, 0]);
  const firstBounds = map.uniforms.uImageryDetailBounds.value.toArray();
  map.setDetailImagery(preview, b.bounds, terrain.bounds);
  const previous = map.uniforms.uImageryDetailPrev.value;
  map.setDetailImagery({ width: 4096, height: 3072 }, b.bounds, terrain.bounds);
  assert.equal(map.uniforms.uImageryDetailPrev.value, previous);
  assert.deepEqual(map.uniforms.uImageryDetailPrevBounds.value.toArray(), firstBounds);
  map.dispose();
});
