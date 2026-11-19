import assert from 'node:assert/strict';
import test from 'node:test';
import { Matrix3 } from 'three';
import { FilterBubbles } from './src/lowPower/filterBubbles.mjs';
import { BowlResolution } from './src/lowPower/resolution.mjs';
import { Slosh } from './src/lowPower/slosh.mjs';

test('released bubbles carry momentum across a reversal and pop at the advected position', () => {
  const stream = new FilterBubbles({at: [-.2,-.1,0], radius: .006, rate: 9});
  const rotation = new Matrix3(), hits = [];
  let current = .34;
  const surface = {
    currentAt(x,y,z,bed,flow) { flow[0] = current; flow[1] = flow[2] = 0; },
    heightAt() { return .24; },
    disturbAtSurface(x,y,z) { hits.push([x,y,z]); },
  };
  const tick = () => stream.update(1/60, rotation, surface, () => -.6);
  for (let i=0; i<24; i++) tick();
  const first = stream.drops[0], before = first.position.x;
  assert.ok(before > -.15);
  rotation.set(-1,0,0, 0,1,0, 0,0,-1);
  current = -.34;
  tick();
  assert.ok(first.position.x > before && first.position.x < 0);
  for (let i=0; i<12; i++) tick();
  assert.ok(first.velocity.x < 0);
  assert.ok(stream.drops.some(d => d.radius && d.position.x > .17));
  for (let i=0; i<160; i++) tick();
  assert.ok(stream.mesh.count > 0 && stream.mesh.count <= 16);
  assert.ok(hits.some(([x,y]) => x < .10 && y === .24));
  surface.heightAt = () => -.2;
  for (let i=0; i<60; i++) tick();
  assert.equal(stream.mesh.count,0);
});

test('a bubble starts at the rigid tube and reaches full glass refraction before popping', () => {
  const stream = new FilterBubbles({at: [-.2,-.1,0], radius: .006, rate: .01});
  const water = new Slosh(), rotation = new Matrix3(), weights = [];
  for (let i = 0; i < 120; i++) {
    stream.update(1/60, rotation, water, () => -.6);
    if (stream.mesh.count) weights.push(stream.mesh.geometry.getAttribute('lensWeight').getX(0));
  }
  assert.equal(weights[0], 0);
  assert.ok(weights.some(w => w > .25 && w < .75));
  assert.ok(weights.every((w,i) => i === 0 || w >= weights[i-1]));
  assert.equal(weights.at(-1), 1);
  assert.equal(stream.mesh.count, 0);
});

test('a dimple on a tilted surface travels out from its contact point', () => {
  const water = new Slosh();
  for (let i=0; i<90; i++) water.step(1/30,[3,-24,0],[0,0,0]);
  const control = new Slosh();
  for (let i=0; i<90; i++) control.step(1/30,[3,-24,0],[0,0,0]);
  const x=.22, z=.12;
  water.disturbAtSurface(x,water.heightAt(x,z),z,.105,-.9);
  let near = 0, far = 0;
  for (let i=0; i<25; i++) {
    water.step(1/60,[3,-24,0],[0,0,0]);
    control.step(1/60,[3,-24,0],[0,0,0]);
    near=Math.min(near,water.heightAt(x,z)-control.heightAt(x,z));
    far=Math.max(far,Math.abs(water.heightAt(x+.17,z)-control.heightAt(x+.17,z)));
  }
  assert.ok(near < -.005 && far > .001);
});

test('resolution steps back up after a slowdown, backs off failed probes and ignores isolated stalls', () => {
  const q = new BowlResolution();
  const run = (frames, interval) => {
    for (let i=0; i<frames; i++) q.sample(interval, q.pixels, 1280*800);
  };
  run(1,4000); run(60,1000/30);
  assert.equal(q.pixels,720000);
  run(30,50);
  const low = q.pixels;
  assert.equal(low,504000);
  run(150,1000/30); q.resetTiming(); run(160,1000/30);
  assert.equal(q.pixels,low);
  run(50,1000/30);
  assert.equal(q.pixels,Math.ceil(low*1.2));
  run(30,39);
  assert.equal(q.pixels,low);
  run(300,1000/30);
  assert.equal(q.pixels,low);
  run(1200,1000/30);
  assert.equal(q.pixels,720000);
  run(500,60);
  assert.equal(q.pixels,180000);
});
