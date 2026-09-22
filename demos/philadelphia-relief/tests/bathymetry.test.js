import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from '../vendor/three.module.min.js';
import { bathymetryUniforms, sampleRiverbed } from '../src/bathymetry-shader.js';
import { createBathymetry } from '../src/bathymetry.js';
import { createStore } from '../src/state.js';

const meta = { version: 1, bounds: { west: -76, east: -75, north: 40, south: 39 },
  width: 2, height: 2, probes: [], surveyDateRange: ['2009-01-01', '2026-09-01'] };
const pixels = new Uint8ClampedArray([5, 45, 255, 255, 0, 0, 0, 255,
  0, 37, 255, 255, 0, 0, 0, 255]);
test('sample decoding preserves datum elevation, small depths, gaps and geographic edges', () => {
  assert.equal(sampleRiverbed(pixels, meta, -75.9, 39.9), -13.25);
  assert.equal(sampleRiverbed(pixels, meta, -75.9, 39.1), -.37);
  assert.equal(sampleRiverbed(pixels, meta, -75.1, 39.9), null);
  for (const [lon,lat] of [[-76.01,39.5],[-75,39.5],[-75.5,39],[-75.5,40.01]]) {
    assert.equal(sampleRiverbed(pixels, meta, lon, lat), null);
  }
  assert.equal(sampleRiverbed(null, null, -75.5, 39.5), null);
});

function harness(t, fetcher, restored = false) {
  const originals = Object.fromEntries(['document','window','fetch','createImageBitmap']
    .map(k => [k, globalThis[k]]));
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, { checked: false, hidden: true, textContent: '', value: '6' });
    return elements.get(id);
  };
  globalThis.document = { body: { classList: { toggle() {} } }, getElementById: get,
    querySelectorAll: () => [], createElement: () => ({ getContext: () => ({
      drawImage() {}, getImageData: () => ({ data: pixels }),
    }) }) };
  globalThis.window = { matchMedia: () => ({ matches: false }) };
  globalThis.fetch = fetcher;
  globalThis.createImageBitmap = async () => ({ width: 2, height: 2, close() {} });
  const terrain = { uniforms: { ...bathymetryUniforms(THREE),
    uHeight: { value: new THREE.Texture() }, uRegionSize: { value: new THREE.Vector2(1,1) } } };
  const water = [{ material: { uniforms: {} } }];
  const store = createStore();
  get('bathymetryToggle').checked = restored;
  const layer = createBathymetry(THREE, { terrain, water, store,
    projection: { bounds: meta.bounds }, motion: {}, getPose: () => ({ lon: -75.9, lat: 39.9 }),
    clearArchive() {}, invalidate() {} });
  t.after(() => { layer.dispose(); Object.assign(globalThis, originals); });
  const toggle = on => { get('bathymetryToggle').checked = on; get('bathymetryToggle').onchange(); };
  return { get, layer, toggle, terrain, water, store };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const response = url => Promise.resolve({ ok: true, json: async () => meta, blob: async () => url });

test('a browser-restored riverbed checkbox activates its layer after startup', async t => {
  const h = harness(t, response, true); await flush();
  assert.equal(h.layer.active,true); assert.equal(h.layer.stats().loaded,true);
  assert.equal(h.get('bathymetryOptions').hidden,false);
});
test('optional layer does not fetch until enabled; releases memory and restores terrain on disable', async t => {
  let requests = 0;
  const h = harness(t, url => { requests++; return response(url); });
  assert.equal(requests,0); assert.equal(h.layer.stats().bytes,0);
  h.toggle(true); await flush(); h.layer.update();
  assert.equal(requests,2); assert.equal(h.layer.stats().loaded,true);
  assert.equal(h.terrain.uniforms.uBathOn.value,1);
  assert.equal(h.water[0].material.uniforms.uBathOn,h.terrain.uniforms.uBathOn);
  assert.match(h.get('bathymetryReading').textContent,/13.3 m below NAVD88/);
  const tex = h.terrain.uniforms.uBathymetry.value;
  let disposed = false; tex.addEventListener('dispose', () => { disposed = true; });
  h.toggle(false);
  assert.equal(disposed,true); assert.equal(h.layer.stats().bytes,0);
  assert.equal(h.terrain.uniforms.uBathOn.value,0);
  assert.equal(h.get('bathymetryLegend').hidden,true);
  h.toggle(true); await flush();
  assert.equal(h.layer.stats().loaded,true); assert.equal(requests,4);
});
test('late downloads cannot reactivate a disabled layer', async t => {
  const pending = [];
  const h = harness(t, url => new Promise(resolve => pending.push(() => resolve(response(url)))));
  h.toggle(true); h.toggle(false);
  pending.forEach(resolve => resolve()); await flush();
  assert.equal(h.layer.stats().loaded,false); assert.equal(h.layer.stats().bytes,0);
  assert.equal(h.terrain.uniforms.uBathOn.value,0);
});
test('failed data can be retried; quality rebuilds preserve shared uniforms; historical mode disables it', async t => {
  let fail = true;
  const h = harness(t, url => fail ? Promise.reject(new Error('offline')) : response(url));
  h.toggle(true); await flush();
  assert.equal(h.layer.stats().loaded,false); assert.equal(h.get('bathymetryRetry').hidden,false);
  fail = false; h.get('bathymetryRetry').onclick(); await flush();
  const next = { uniforms: { ...bathymetryUniforms(THREE), uHeight: { value: new THREE.Texture() },
    uRegionSize: { value: new THREE.Vector2(1,1) } } };
  h.layer.setTerrain(next);
  assert.equal(next.uniforms.uBathOn.value,1);
  assert.equal(next.uniforms.uBathymetry.value,h.terrain.uniforms.uBathymetry.value);
  h.get('bathymetryScale').value = '1'; h.get('bathymetryScale').oninput({ target: { value:'1' } });
  assert.equal(next.uniforms.uBathScale.value,1);
  h.store.set({ era: '1776' });
  assert.equal(h.layer.active,false); assert.equal(next.uniforms.uBathOn.value,0);
});
test('bundled source manifest records true survey contributors and known river/land probes', () => {
  const doc = JSON.parse(readFileSync(new URL('../data/bathymetry/manifest.json',import.meta.url)));
  const source = JSON.parse(readFileSync(new URL('../data/bathymetry/sources.json',import.meta.url)));
  assert.equal(doc.datum,'NAVD88'); assert.equal(doc.width,4096); assert.equal(doc.height,3072);
  assert.ok(doc.validSamples > 100000); assert.equal(source.tiles.length,doc.sourceTiles);
  for (const tile of source.tiles) {
    assert.match(tile.url,/^https:\/\/noaa-ocs-nationalbathymetry-pds\.s3\.amazonaws\.com\//);
    for (const survey of tile.surveys) {
      assert.notEqual(survey.value,'0'); assert.equal(survey.bathy_coverage,'1');
    }
  }
  assert.equal(doc.probes[0].elevationM,-13.25); assert.equal(doc.probes[1].elevationM,-9.93);
  assert.equal(doc.probes[2].elevationM,null); assert.equal(doc.probes[3].elevationM,null);
});
