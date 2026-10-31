import assert from 'node:assert/strict';
import {createParticleTransport,detailedServicePose,serviceStage} from '../../demos/roller-studio/transport.js';
import {createWebShape} from '../../demos/roller-studio/web-shape.js';
const flow=createParticleTransport(1),s={time:0,waterPhase:0,travel:0,services:0,remaining:.8};
flow.update(s,9,()=>6,0);s.time=10;s.waterPhase=10;flow.update(s,9,()=>6,0);assert.equal(flow.particles[0].phase,'captured');assert.equal(flow.particles[0].distance,6);
s.time=11;s.waterPhase=11;flow.update(s,9,()=>6,0);assert.equal(flow.particles[0].distance,6,'captured particles cannot move just because water flows');
s.travel=1;s.time=12;flow.update(s,9,()=>6,2);assert.equal(flow.particles[0].distance,7);s.travel=3.1;s.time=13;flow.update(s,9,()=>6,6);assert.equal(flow.particles[0].phase,'wound');assert.equal(flow.snapshot().exported,1);const anchor=flow.particles[0].angle;s.time=14;flow.update(s,9,()=>6,6);assert.equal(flow.particles[0].angle,anchor);
flow.update({time:0,waterPhase:0,travel:0,services:0,remaining:.82},9,()=>6,0);assert.equal(flow.particles[0].phase,'water');assert.equal(flow.snapshot().exported,0);
flow.update({time:20,waterPhase:20,travel:0,services:0,remaining:.82},9,()=>6,0,0);assert.equal(flow.particles[0].progress,0,'zero solids must not introduce new particles');
flow.update({time:30,waterPhase:30,travel:0,services:0,remaining:.82},9,()=>6,0,100);flow.update({time:31,waterPhase:31,travel:4,services:0,remaining:.7},9,()=>6,7,100);flow.update({time:32,waterPhase:32,travel:8,services:0,remaining:.6},9,()=>6,20,100,0);assert.equal(flow.particles[0].phase,'wound','the featured particle stays identified after export');
assert.deepEqual([0,.2,.55,.7,.95].map(serviceStage),[0,1,2,3,4]);assert(detailedServicePose(.3).lift>.8);assert.equal(detailedServicePose(.45).visible,false);assert(detailedServicePose(.8).thread>0);assert.equal(detailedServicePose(-1).clip,0);
const snap={clean:.6,dirty:.35,travel:1},loose=createWebShape(snap,0),taut=createWebShape(snap,1);assert(loose.slack>taut.slack);assert(loose.sample(0).p.distanceTo(taut.sample(0).p)<1e-9);assert(loose.sample(loose.length).p.distanceTo(taut.sample(taut.length).p)<1e-9);
for(let d=0;d<taut.length;d+=.05){const p=taut.sample(d).p;for(const x of [-1.21,1.21])if(p.y<1.6&&Math.abs(p.x-x)<.3)assert(Math.hypot(p.x-x,p.y-1.4)>.196,'fabric must wrap outside guide surface');}
console.log('PASS: capture identity, web-bound transport, winding, reset, five service phases, supported web and tension.');
