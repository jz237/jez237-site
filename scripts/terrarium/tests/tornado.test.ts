// The tornado's life cycle against real clouds and air (no rendering).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Clouds, type Cloud} from '../lib/Clouds';
import {WindField} from '../lib/WindField';
import {Tornado} from '../lib/Tornado';

function world() {
  const clouds = new Clouds(new THREE.Data3DTexture());
  const wind = new WindField();
  const light = {uLight: {value: new THREE.Color()}, uAmbient: {value: new THREE.Color()}, uFlash: {value: 0}, uRes: {value: new THREE.Vector2(1, 1)}};
  const tornado = new Tornado(() => 0.15, () => false, clouds.shared, light);
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(0, 0.45, 1.8);
  let time = 0;
  const run = (seconds: number) => {
    const dt = 1 / 30;
    for (let t = 0; t < seconds; t += dt) {
      time += dt;
      tornado.force(wind, dt);
      wind.update(dt, 1);
      clouds.update(dt, time, wind, 0.72, 1);
      tornado.update(dt, clouds, wind, camera);
    }
  };
  return {clouds, tornado, run};
}

test('under a calm sky, a tornado brews a storm and then comes down', () => {
  const {clouds, tornado, run} = world();
  assert.ok(clouds.storminess < 0.2, 'the sky starts calm');
  assert.equal(tornado.request(clouds), 'brewing');
  run(6);
  assert.ok(tornado.phase === 'forming' || tornado.phase === 'mature', `came down (${tornado.phase})`);
  assert.ok(tornado.cloud!.storm > 0.5);
});

test('called off while brewing, the storm settles instead of building on', () => {
  const {clouds, tornado, run} = world();
  tornado.request(clouds);
  const cloud = tornado.cloud as Cloud;
  const before = cloud.stormTarget;
  run(1.5);
  assert.equal(tornado.phase, 'brewing');
  tornado.dissipate();
  assert.equal(tornado.phase, 'idle');
  assert.ok(cloud.stormTarget <= before, 'the storm the brewing asked for is dropped');
  run(20);
  assert.ok(cloud.storm < 0.15, `the storm settled (storm ${cloud.storm.toFixed(2)})`);
  assert.equal(tornado.phase, 'idle');
});
