import test from 'node:test';
import assert from 'node:assert/strict';
import {tideLevel,obstaclePosition,floatingPose} from '../course-environment.js';
import {wave,waterLevel,createState} from '../simulation.js';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {createHydro,stepHydro} from '../hydrodynamics.js';

test('ebb changes navigable depth smoothly without a step at lap boundaries',()=>{
 const c=getCourse('tempest'),bottom=c.ground(101,72);
 assert.ok(tideLevel(c,0)-bottom>.4);
 assert.ok(tideLevel(c,160)<bottom);
 let previous=tideLevel(c,0);
 for(let t=1;t<=220;t++){const level=tideLevel(c,t);assert.ok(level<=previous);assert.ok(previous-level<.016);previous=level;}
 assert.equal(tideLevel(getCourse('reed'),160),0);
});
test('hull settles on the changing wave datum and restarting restores high water',()=>{
 const c=getCourse('tempest'),s=createRace({course:c}),h=createHydro(),craft={x:0,z:0,heading:0};
 for(let i=0;i<10000;i++){
  const t=i/60;waterLevel.value=tideLevel(c,t);
  stepHydro(h,craft,t,1/60,()=>waterLevel.value);
 }
 assert.ok(Math.abs(h.y-(tideLevel(c,10000/60)+.025))<.001);
 const old=wave(12,8,3);waterLevel.value+=1.4;assert.ok(Math.abs(wave(12,8,3)-old-1.4)<1e-10);
 createRace({course:c});assert.equal(waterLevel.value,.35);
 createState();assert.equal(waterLevel.value,0);
});
test('the same reef can be crossed at high water but stops a hull at low water',()=>{
 function crossing(time){const s=createRace({mode:'practice',course:getCourse('tempest')});s.phase='running';s.time=time;const r=s.racers[0];r.x=101;r.z=72;r.vz=3;stepRace(s,{},1/60);return r;}
 assert.equal(crossing(0).collision,0);
 assert.ok(crossing(160).collision>0);
});
test('drifting ice collision follows its rendered location',()=>{
 const c=getCourse('glacier'),q=c.rocks[0],p=obstaclePosition(q,95),s=createRace({mode:'practice',course:c});
 assert.ok(Math.hypot(p.x-q.x,p.z-q.z)>.5);
 assert.ok(Math.hypot(p.x-q.x,p.z-q.z)<3.1);
 s.phase='running';s.time=95;const r=s.racers[0];r.x=p.x;r.z=p.z;r.vz=3;
 stepRace(s,{},1/60);assert.ok(r.collision>0);
});
test('floating props use actual wave slope and height in any heading',()=>{
 const surface=(x,z)=>2+x*.12-z*.18;
 for(const heading of [0,.8,2.5]){const p=floatingPose(5,7,0,surface,1.4,heading);
  assert.ok(Math.abs(p.y-surface(5,7))<1e-12);
  assert.ok(Math.abs(p.pitch+Math.atan(.12*Math.sin(heading)-.18*Math.cos(heading)))<1e-12);
  assert.ok(Math.abs(p.roll-Math.atan(.12*Math.cos(heading)+.18*Math.sin(heading)))<1e-12);
 }
});
