import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {iceSurfaceAt} from '../ice-surfaces.js';
test('the native western channel stays open before the eastern northern shelf',()=>{
 const c=getCourse('glacier',2),scale=.025;
 // Independently queried native grid: opposing shores at X=-260 have
 // Z=-4417.20423/-4150.00014, leaving a 267.20409-unit water channel.
 const x=-260*scale,z=-4283.60218*scale;
 for(const dx of [-.6,0,.6])for(const dz of [-1.5,0,1.5]){
  assert.equal(iceSurfaceAt(c,x+dx,z+dz),null);assert.ok(c.ground(x+dx,z+dz)<-.8,'open-water clearance around the hull');
 }
 assert.equal(iceSurfaceAt(c,-2885*scale,-4368*scale),null,'western source guide is in water');
 const eastern=iceSurfaceAt(c,3404*scale,-4468*scale);
 assert.equal(eastern?.heightAt(3404*scale,-4468*scale),30*scale,'eastern source guide is on the measured shelf');
});
test('all four classes finish three laps using ordinary helm physics and source gate adjudication',()=>{
 for(const difficulty of [0,1,2,3]){
  const state=createRace({mode:'time',course:getCourse('glacier',difficulty),difficulty}),racer=state.racers[0];
  for(let i=0;i<24000&&state.phase!=='results';i++){
   const input=aiInput(state,racer);
   assert.ok((input.throttle??0)>=0&&(input.throttle??0)<=1&&Math.abs(input.steer??0)<=1,'ordinary bounded controller input');
   stepRace(state,input,1/60);
  }
  const context=JSON.stringify({difficulty,phase:state.phase,time:state.time,next:racer.next,passed:racer.passed,misses:racer.misses,x:racer.x,z:racer.z,dq:racer.dq});
  assert.equal(state.phase,'results',context);assert.equal(racer.dq,'',context);assert.equal(racer.misses,0,context);
  assert.equal(racer.passed,51,context);assert.equal(racer.lapTimes.length,3,context);assert.ok(racer.finishTime>0&&racer.finishTime<400,context);
 }
});
