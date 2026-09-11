// Diagnostic only: deep-water acceleration, not course-completion evidence.
// Run from any directory: node source/probe-launch.mjs
import {createRace,stepRace,RIDERS} from '../race-core.js';
import {getCourse} from '../courses.js';
import assert from 'node:assert/strict';

const sampleFrames=[18,78,138,180,300,600];
const results=[];
for(let rider=0;rider<RIDERS.length;rider++){
 for(const launch of ['held-through-countdown','pressed-at-go']){
  const state=createRace({mode:'practice',rider,course:getCourse('neon'),seaState:'calm'});
  const r=state.racers[0],c=state.course;
  c.ground=()=>-10;c.rocks=[];c.ramps=[];c.crossbars=[];c.passage=null;
  c.boundary=[[-2000,-2000],[2000,-2000],[2000,2000],[-2000,2000]];
  r.x=0;r.z=0;r.heading=0;
  while(state.phase==='countdown')stepRace(state,{throttle:launch==='held-through-countdown'?1:0,dampen:true},1/60);
  const samples=[];
  let distance=0;
  for(let frame=1;frame<=600;frame++){
   const x=r.x,z=r.z;
   stepRace(state,{throttle:1,dampen:true},1/60);
   assert.equal(r.dq,'','Deep-water diagnostic must remain active');
   assert.ok(Number.isFinite(r.speed)&&Number.isFinite(r.x)&&Number.isFinite(r.z));
   distance+=Math.hypot(r.x-x,r.z-z);
   if(sampleFrames.includes(frame))samples.push({seconds:frame/60,speedKmh:+(r.speed*3.6).toFixed(3),distanceMetres:+distance.toFixed(3)});
  }
  results.push({rider:RIDERS[rider].name,launch,rocketStarted:!!r.rocketStarted,samples});
 }
}
console.log(JSON.stringify({fixture:'Isolated calm deep water; full throttle; default tuning; all riders. No course progress claim.',results},null,2));
