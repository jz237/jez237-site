import test from 'node:test';
import assert from 'node:assert/strict';
import {createTitleScene,advanceTitleScene,titleCameraFrame} from '../title-scene.js';

test('title exhibition travels a complete loop with finite camera framing and no disqualification',()=>{
 const state=createTitleScene(),memory={},camera={};
 const start={x:state.racers[0].x,z:state.racers[0].z};let ended=false,maxTravel=0;
 for(let i=0;i<5400&&!ended;i++){
  ended=advanceTitleScene(state,1/60,memory);
  const rider=state.racers[0],frame=titleCameraFrame(camera,rider,state.time,1/60,16/9);
  assert.ok(Object.values(frame.position).every(Number.isFinite));
  assert.ok(Object.values(frame.target).every(Number.isFinite));
  maxTravel=Math.max(maxTravel,Math.hypot(rider.x-start.x,rider.z-start.z));
 }
 assert.ok(ended,'attract loop must eventually restart');assert.ok(maxTravel>100,'rider actually tours the ocean');
 assert.equal(state.racers[0].dq,'');assert.equal(state.demoRun,true);assert.equal(state.titleScene,true);
 assert.equal(state.physics,'modern');assert.equal(state.seaState,'calm');
});

test('zero elapsed time holds title physics; a stalled tab cannot fast-forward the race',()=>{
 const state=createTitleScene(),memory={},before=structuredClone(state.racers[0]),time=state.time;
 advanceTitleScene(state,0,memory);assert.deepEqual(state.racers[0],before);assert.equal(state.time,time);
 advanceTitleScene(state,120,memory);assert.ok(state.time-time<=.101);
});

test('title camera keeps portrait subject centered and turns across the heading seam smoothly',()=>{
 const state=createTitleScene(),r=state.racers[0],memory={heading:Math.PI-.01};r.heading=-Math.PI+.01;
 const a=titleCameraFrame(memory,r,4,1/60,.5);
 assert.equal(a.target.x,r.x);assert.equal(a.target.z,r.z);
 assert.ok(Math.abs(memory.heading-Math.PI)<.02);
});
