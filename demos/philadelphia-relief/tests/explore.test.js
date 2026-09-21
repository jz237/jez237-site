import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from '../vendor/three.module.min.js';
import { observerView, SPOTTERS, exhibitBounds, insideExhibit } from '../src/explore-math.js';
import { createExhibit } from '../src/exhibit.js';
import { createCameraRig } from '../src/camera.js';
import { createStore } from '../src/state.js';
import { createProjection } from '../src/geo.js';
import { detailedLandmarks, DETAIL_NOTES } from '../src/landmark-detail.js';
import { buildLandmarkModels, validateModels } from '../src/landmark-models.js';

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const projection = createProjection(json('../data/terrain.json'));
test('spotter remains fixed while the observed aircraft changes direction and height', () => {
  const station = SPOTTERS[0];
  const a = observerView(station, { lon: station.lon, lat: station.lat + .01, height: 200 }, 10);
  const b = observerView(station, { lon: station.lon + .01, lat: station.lat, height: 200 }, 10);
  assert.equal(a.lon, b.lon); assert.equal(a.lat, b.lat); assert.equal(a.height, 18);
  assert.equal(a.heading, 0); assert.equal(b.heading, 90); assert.ok(a.pitch > 0);
  assert.equal(observerView(station, { height: NaN }, 10), null);
});
test('exhibits retain geographic bounds and clamp at the data edge', () => {
  const b = exhibitBounds(-75.1, 40, 1000, projection);
  assert.ok(Math.abs((b.east - b.west) * projection.metersPerDegLon - 1000) < 1e-6);
  assert.ok(insideExhibit({ lon: -75.1, lat: 40 }, b));
  assert.ok(!insideExhibit({ lon: -74, lat: 40 }, b));
  const edge = exhibitBounds(projection.bounds.west, projection.bounds.north, 5000, projection);
  assert.equal(edge.west, projection.bounds.west); assert.equal(edge.north, projection.bounds.north);
});
test('stationary ground camera becomes idle, uses eye clearance and returns to orbit', () => {
  const dom = new EventTarget(); dom.clientHeight = 800;
  const rig = createCameraRig(THREE, { store: createStore(), dom, projection,
    sampleElevation: () => 20, getExaggeration: () => 1 });
  rig.update(1, { snap: true }); const orbit = rig.camera.position.clone();
  const view = { lon: -75.1, lat: 40, height: 22, clearance: 1.7, heading: 90, pitch: 0 };
  assert.ok(rig.update(1, { snap: true, flightView: view }).changed);
  rig.setAspect(1); assert.equal(rig.camera.position.y, 22); assert.equal(rig.camera.near, .3);
  const revision = rig.revision;
  assert.equal(rig.update(1, { snap: true, flightView: { ...view } }).changed, false);
  assert.equal(rig.revision, revision);
  rig.update(1, { snap: true }); assert.ok(rig.camera.position.distanceTo(orbit) < 1e-6);
  rig.dispose();
});
test('exhibit owns only two base meshes and restores material hooks without leaked geometry', () => {
  const scene = new THREE.Scene(), material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material); scene.add(mesh);
  const before = material.onBeforeCompile, cache = material.customProgramCacheKey;
  let clips, disposed = 0;
  const exhibit = createExhibit(THREE, { scene, projection, sampleElevation: () => 10,
    photographic: { setExhibit: b => { clips = b; }, aircraftViewer: null } });
  const b = exhibitBounds(-75.1, 40, 1000, projection); exhibit.set(b);
  assert.deepEqual(clips, b); assert.notEqual(material.onBeforeCompile, before);
  const base = scene.getObjectByName('Neighborhood exhibit base'); assert.equal(base.children.length, 2);
  base.children.forEach(m => m.geometry.addEventListener('dispose', () => disposed++));
  const shader = { uniforms: {}, vertexShader: 'void main(){gl_Position=vec4(0.);}',
    fragmentShader: 'void main(){gl_FragColor=vec4(1.);}' };
  material.onBeforeCompile(shader, {});
  assert.match(shader.fragmentShader, /discard/); assert.match(shader.vertexShader, /exhibitInverseVP/);
  exhibit.clear(); assert.equal(disposed, 2); assert.equal(clips, null);
  assert.equal(material.onBeforeCompile, before); assert.equal(material.customProgramCacheKey, cache);
  assert.equal(base.children.length, 0); exhibit.dispose(); assert.equal(scene.children.length, 1);
});
test('architectural studies preserve sources and stay within a small geometry budget', () => {
  const doc = json('../data/landmark-models.json'), original = JSON.stringify(doc);
  const landmarks = json('../data/landmarks.json').landmarks;
  const anchors = new Map(landmarks.map(p => [p.n, p]));
  const context = { anchors, toWorld: (lon, lat) => [projection.lonToX(lon), projection.latToZ(lat)],
    groundAt: () => 10 };
  const base = buildLandmarkModels(doc, context);
  for (const id of Object.keys(DETAIL_NOTES)) {
    const detailed = detailedLandmarks(doc, id);
    assert.deepEqual(validateModels(detailed, new Set(anchors.keys())), []);
    const packed = buildLandmarkModels(detailed, context);
    assert.ok(packed.vertexCount > base.vertexCount);
    assert.ok(packed.indexCount - base.indexCount < 10000, 'small addition to one existing draw call');
    assert.ok([...packed.position].every(Number.isFinite));
    assert.equal(packed.models.length, base.models.length);
  }
  assert.equal(JSON.stringify(doc), original, 'default models stay untouched');
});
