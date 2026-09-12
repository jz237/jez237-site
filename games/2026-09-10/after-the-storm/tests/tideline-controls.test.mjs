import test from 'node:test';
import assert from 'node:assert/strict';
import {steeringAxis,touchHelm} from '../riding-controls.js';
import {chaseFrame} from '../chase-camera.js';
import {adaptiveQuality} from '../adaptive-quality.js';

test('steering is continuous, symmetric and precise from centre to full lock',()=>{
  assert.equal(steeringAxis(.079),0);assert.ok(steeringAxis(.081)<.001);
  let previous=0;for(let i=0;i<=100;i++){const x=i/100,y=steeringAxis(x);assert.ok(y>=previous);assert.equal(y,-steeringAxis(-x));previous=y;}
  assert.equal(steeringAxis(1),1);assert.equal(steeringAxis(-4),-1);assert.equal(steeringAxis(NaN),0);
  assert.ok(steeringAxis(.5)<.5);
});
test('auto throttle cuts immediately under braking, and inactive touch never drives',()=>{
  const input={throttle:0,steer:0,brake:false},touch={enabled:true,active:true,steer:.35,steering:true,autoThrottle:true};
  assert.equal(touchHelm(input,touch).throttle,1);assert.equal(touchHelm(input,touch).steer,.35);
  assert.equal(touchHelm({...input,brake:true},touch).throttle,0);
  assert.deepEqual(touchHelm(input,{...touch,active:false}),input);
  assert.deepEqual(touchHelm(input,{...touch,enabled:false}),input);
  assert.equal(touchHelm({...input,steer:-.4},{...touch,steering:false}).steer,-.4);
});
test('chase horizon filters short wave slaps and follows sustained sea level changes',()=>{
  const r={x:0,z:0,heading:0,vx:0,vz:24,hydro:{waterHeight:0,y:.1}},m={};
  chaseFrame(m,r,1/60);r.hydro.waterHeight=2;r.hydro.y=2.1;
  chaseFrame(m,r,1/60);assert.ok(m.water>0&&m.water<.1);
  for(let i=0;i<180;i++)chaseFrame(m,r,1/60);
  assert.ok(m.water>1.99);
});
test('high-speed camera survives steering reversals and the pi seam without whipping',()=>{
  const r={x:0,z:0,heading:Math.PI-.01,vx:0,vz:-25,hydro:{waterHeight:0,y:0}},m={};chaseFrame(m,r,0);
  for(let i=0;i<240;i++){const before=m.heading;r.heading=i%2?Math.PI-.02:-Math.PI+.02;const f=chaseFrame(m,r,1/60);assert.ok(Math.abs(Math.atan2(Math.sin(m.heading-before),Math.cos(m.heading-before)))<=1.65/60+1e-8);assert.ok(Object.values(f.position).every(Number.isFinite));}
  const before=structuredClone(m);chaseFrame(m,r,0);assert.deepEqual(m,before);
});
test('adaptive graphics tolerates startup, steps down under sustained load and recovers cautiously',()=>{
  const m={};assert.equal(adaptiveQuality(m,'high',15),'high');
  assert.equal(adaptiveQuality(m,'high',15),'medium');
  let q='medium';for(let i=0;i<10;i++)q=adaptiveQuality(m,q,60);assert.equal(q,'medium');
  for(let i=0;i<6;i++)q=adaptiveQuality(m,q,60);assert.equal(q,'high');
  assert.equal(adaptiveQuality({},'medium',NaN),'medium');
});
