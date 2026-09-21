import test from 'node:test';
import assert from 'node:assert/strict';
import { flightView, viewDelay } from '../src/flight-view.js';
import * as THREE from '../vendor/three.module.min.js';
import { createCameraRig } from '../src/camera.js';
import { createStore } from '../src/state.js';
import { createProjection } from '../src/geo.js';
import { readFileSync } from 'node:fs';

const aircraft = { lon: -75.25, lat: 39.87, height: 550, track: 90, observedAt: 10000 };
test('onboard perspectives preserve factual location and height without changing the report', () => {
  const original = { ...aircraft };
  for (const [mode, heading] of [['forward', 90], ['left', 0], ['right', 180]]) {
    const view = flightView(aircraft, mode);
    assert.equal(view.lon, aircraft.lon); assert.equal(view.lat, aircraft.lat);
    assert.equal(view.height, aircraft.height); assert.equal(view.heading, heading);
    assert.ok(view.pitch < 0);
  }
  assert.deepEqual(aircraft, original);
});
test('chase position stays behind the aircraft for all cardinal headings', () => {
  for (const track of [0, 90, 180, 270]) {
    const view = flightView({ ...aircraft, track }, 'chase');
    const east = (view.lon - aircraft.lon) * 111320 * Math.cos(aircraft.lat * Math.PI / 180);
    const north = (view.lat - aircraft.lat) * 111320;
    assert.ok(Math.abs(Math.hypot(east, north) - 300) < 1e-6);
    assert.ok(east * Math.sin(track * Math.PI / 180) + north * Math.cos(track * Math.PI / 180) < -299);
    assert.equal(view.height, aircraft.height + 100);
  }
});
test('missing heading never invents a northward flight, and terrain clearance leaves reports unchanged', () => {
  assert.equal(flightView({ ...aircraft, track: null }, 'forward'), null);
  assert.equal(flightView({ ...aircraft, height: NaN }, 'forward'), null);
  assert.equal(flightView(aircraft, 'invalid'), null);
  assert.equal(flightView(aircraft, 'forward', 600).height, 635);
  assert.equal(aircraft.height, 550);
  assert.equal(viewDelay(aircraft, 35000), 25);
  assert.equal(viewDelay(aircraft, 0), 0);
});

test('relief rig uses aircraft eye and compass direction, then restores its orbit after ride ends', () => {
  const meta = JSON.parse(readFileSync(new URL('../data/terrain.json', import.meta.url)));
  const projection = createProjection(meta);
  const dom = new EventTarget(); dom.clientHeight = 800;
  const rig = createCameraRig(THREE, { store: createStore(), dom, projection,
    sampleElevation: () => 100, getExaggeration: () => 2 });
  rig.update(1, { snap: true }); const orbit = rig.camera.position.clone();
  const view = flightView(aircraft, 'forward', 100);
  rig.update(1, { snap: true, flightView: view });
  assert.equal(rig.camera.position.x, projection.lonToX(aircraft.lon));
  assert.equal(rig.camera.position.y, 650, 'eye follows the same terrain exaggeration as aircraft');
  const direction = rig.camera.getWorldDirection(new THREE.Vector3());
  assert.ok(direction.x > .99, 'eastbound camera points east');
  assert.ok(direction.y < 0 && Math.abs(direction.z) < 1e-6);
  assert.equal(rig.update(1, { snap: true }).changed, true);
  assert.ok(rig.camera.position.distanceTo(orbit) < 1e-6);
  rig.dispose();
});
