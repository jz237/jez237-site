import assert from 'node:assert/strict';
import {createSimulation,defaults,cupServicePose,SERVICE_THRESHOLD} from '../../demos/skimmer-studio/simulation.js';
function run(s,p,seconds,check=()=>{}){for(let i=0;i<seconds*20;i++)check(s.step(.05,p));return s.snapshot(p);}
const auto=createSimulation();const full=run(auto,defaults,900,s=>{assert(s.cup<=SERVICE_THRESHOLD);assert(!s.spilling);});assert(full.serviceCount>=3);
const flood={...defaults,outlet:100,depth:85};const fast=createSimulation();const r=run(fast,flood,120,s=>{assert(!s.spilling);assert(s.cup<=SERVICE_THRESHOLD);});assert(r.serviceCount>=3);
const manual=createSimulation();run(manual,{...flood,autoCare:false},30);assert(manual.snapshot().spilling);manual.serviceCup();run(manual,{...flood,autoCare:false},4.2);assert.equal(manual.snapshot().cup,0);run(manual,{...flood,autoCare:false},4);assert.equal(manual.snapshot().serviceCount,1);
const off=createSimulation();off.serviceCup();run(off,{...defaults,pump:false},12);assert.equal(off.snapshot({...defaults,pump:false}).regime,'Stopped');assert.equal(off.snapshot().serviceCount,1);
const paused=createSimulation();paused.serviceCup();run(paused,defaults,2.5);const before=paused.snapshot();paused.step(0,defaults);assert.deepEqual(paused.snapshot(),before);
assert(cupServicePose(.4).lift>.7);assert(!cupServicePose(.5).visible);assert(cupServicePose(.4).x<0&&cupServicePose(.6).x>0);assert.equal(cupServicePose(0).lift,0);assert.equal(cupServicePose(1).lift,0);
console.log(JSON.stringify({passed:true,defaultCycles:full.serviceCount,floodCycles:r.serviceCount,manualOverflow:true,animatedService:true,pause:true,powerPreferencePreserved:true}));
