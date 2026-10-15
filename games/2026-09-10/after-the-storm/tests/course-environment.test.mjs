import test from 'node:test';
import assert from 'node:assert/strict';
import {tideLevel,obstaclePosition,floatingPose} from '../course-environment.js';
import {wave,waterLevel,createState} from '../simulation.js';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {createHydro,stepHydro} from '../hydrodynamics.js';

test('source Southern tide starts at zero and elapsed time alone does not lower it',()=>{
 const c=getCourse('tempest');for(const t of [0,20,160,600])assert.equal(tideLevel(c,t),0);
 const s=createRace({mode:'time',course:c}),r=s.racers[0];s.phase='running';s.time=160;
 for(let i=0;i<60;i++)stepRace(s,{},1/60);
 assert.equal(s.courseDatum.value,0);assert.equal(r.lap,1);
 assert.equal(tideLevel(getCourse('reed'),160),0);
});
test('hull settles on a shared changing datum and restarting restores source initial water',()=>{
 const c=getCourse('tempest'),h=createHydro(),craft={x:0,z:0,heading:0};
 for(let i=0;i<10000;i++){
  const t=i/60;waterLevel.value=-Math.min(3.75,t*.05);
  stepHydro(h,craft,t,1/60,()=>waterLevel.value);
 }
 assert.ok(Math.abs(h.y-(waterLevel.value+.025))<.001);
 const old=wave(12,8,3);waterLevel.value+=1.4;assert.ok(Math.abs(wave(12,8,3)-old-1.4)<1e-10);
 createRace({course:c});assert.equal(waterLevel.value,0);
 createState();assert.equal(waterLevel.value,0);
});
test('fixed Glacier spheres retain their world XYZ and race collision through changing water and time',()=>{
 const c=getCourse('glacier'),q=c.rocks.find(q=>q.breakable),position={x:q.x,z:q.z},height=q.y;
 assert.equal(q.fixed,true);
 for(const level of [-1.4,0,1.4])for(const time of [0,95,220]){
  waterLevel.value=level;assert.deepEqual(obstaclePosition(q,time),position);assert.equal(q.y,height);
 }
 const s=createRace({mode:'time',seaState:'calm',course:c});s.phase='running';s.time=95;
 const r=s.racers[0];Object.assign(r,{x:q.x,z:q.z-2.2,heading:0,vx:0,vz:3,speed:3});
 Object.assign(r.hydro,{initialized:true,y:q.y,vy:0});
 stepRace(s,{},1/60);assert.ok(r.collision>0);assert.deepEqual(obstaclePosition(q,s.time),position);assert.equal(q.y,height);
});
test('floating props use actual wave slope and height in any heading',()=>{
 const surface=(x,z)=>2+x*.12-z*.18;
 for(const heading of [0,.8,2.5]){const p=floatingPose(5,7,0,surface,1.4,heading);
  assert.ok(Math.abs(p.y-surface(5,7))<1e-12);
  assert.ok(Math.abs(p.pitch+Math.atan(.12*Math.sin(heading)-.18*Math.cos(heading)))<1e-12);
  assert.ok(Math.abs(p.roll-Math.atan(.12*Math.cos(heading)+.18*Math.sin(heading)))<1e-12);
 }
});
