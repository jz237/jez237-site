import test from 'node:test';
import assert from 'node:assert/strict';
import {SPEED_FEEL,speedFov,smoothAccel,roadBuzz} from '../src/speed-feel';
test('the chase view widens with speed and kicks wider under hard acceleration, both capped',()=>{
 assert.equal(speedFov(60,0,0),60);assert.ok(speedFov(60,30,0)>speedFov(60,15,0));assert.ok(speedFov(60,30,0)>60+5,'more than the old +5 deg at 30 m/s');
 assert.equal(speedFov(60,200,0),60+SPEED_FEEL.fovMax);assert.ok(speedFov(60,10,5)>speedFov(60,10,0));assert.equal(speedFov(60,10,-8),speedFov(60,10,0),'braking does not kick');
 assert.equal(speedFov(60,0,99),60+SPEED_FEEL.kickMax);assert.equal(speedFov(60,NaN,NaN),60);
});
test('acceleration is smoothed from the change in speed',()=>{
 let a=0;for(let i=0;i<120;i++)a=smoothAccel(a,i*5/60+5/60,i*5/60,1/60);assert.ok(Math.abs(a-5)<.05,`settles at 5 m/s2 (${a})`);
 assert.equal(smoothAccel(2,10,9,0),2);assert.equal(smoothAccel(NaN,1,1,.1),0);
});
test('the road buzz starts at speed and tops out',()=>{
 assert.equal(roadBuzz(10),0);assert.ok(roadBuzz(30)>roadBuzz(20));assert.equal(roadBuzz(90),SPEED_FEEL.buzz);
});
