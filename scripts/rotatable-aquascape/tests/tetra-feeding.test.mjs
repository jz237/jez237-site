import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createTetraSwim,advanceTetraSwim} from '../lib/TetraSwimming.ts';
import {FEEDING_MAX_SPEED,FEEDING_MAX_PITCH,FEEDING_TURN_RATE} from '../lib/TetraFeeding.ts';
import {createFishBrain,thinkFish} from '../lib/FishBrain.ts';
import {separateFish} from '../lib/FishCollisions.ts';
import {sweepHardscape} from '../lib/SweptFishContacts.ts';
const senses={food:[],neighbors:[],daylight:1,depthBounds:[-.26,1.26]};
test('feeding darts are fast, then brake, capture with the mouth and pause with active fins',()=>{
 for(const dt of [1/60,1/20,.1]){
  const s=createTetraSwim(991);Object.assign(s,{x:800,y:300,z:.3});let peak=0,ate=false,paused=false;const phases=new Set();
  for(let frame=0;frame<20/dt;frame++){
   const food=ate?[]:[{id:42,x:1040,y:280+frame*dt*3,z:.72}],yaw=s.yaw+s.depthHeading;
   advanceTetraSwim(s,dt,false,false,{...senses,food});phases.add(s.feedingPhase);peak=Math.max(peak,s.speed);
   assert.ok(s.speed<=FEEDING_MAX_SPEED);assert.ok(Math.abs(s.pitch)<=FEEDING_MAX_PITCH);
   const turn=Math.atan2(Math.sin(s.yaw+s.depthHeading-yaw),Math.cos(s.yaw+s.depthHeading-yaw));assert.ok(Math.abs(turn)<=FEEDING_TURN_RATE*dt+.026);
   if(s.brain.consumedFood!==null){assert.equal(s.brain.consumedFood,42);assert.equal(ate,false);ate=true;s.brain.consumedFood=null;}
   if(ate&&s.feedingPhase==='pause'&&s.speed<5&&s.pectoralEffort>.6)paused=true;
  }
  assert.ok(peak>130,`peak ${peak} at dt ${dt}`);assert.ok(ate);assert.ok(paused);assert.ok(phases.has('braking')&&phases.has('pursuit')&&phases.has('coast'));assert.equal(s.feedingPhase,'search');
 }
});
test('a nearby flake behind the head is not swallowed through the body',()=>{
 const s=createTetraSwim();s.x=1000;s.y=300;s.z=.5;
 advanceTetraSwim(s,1/60,false,false,{...senses,food:[{id:1,x:987,y:300,z:.5}]});assert.equal(s.brain.consumedFood,null);
 const b=createFishBrain();thinkFish(b,1/60,1000,300,20,{...senses,mouth:{x:1018,y:300,z:.5},food:[{id:2,x:1020,y:300,z:.5}]},.5);assert.equal(b.consumedFood,2);
});
test('fish keep live targets, notice loss, and avoid another fish’s closer morsel',()=>{
 const a={id:1,x:1040,y:300,z:.5},b={id:2,x:1060,y:300,z:.6},brain=createFishBrain();
 const selected=thinkFish(brain,1/60,1000,300,15,{...senses,food:[a,b],neighbors:[{id:5,x:1030,y:300,z:.5,foodTarget:1}]},.5).target;
 assert.equal(selected.id,2);
 assert.equal(thinkFish(brain,1/60,1000,300,15,{...senses,food:[a,b]},.5).target.id,2);
 assert.equal(thinkFish(brain,1/60,1000,300,15,{...senses,food:[a]},.5).target.id,1);
 // A blocked target is eventually abandoned for another real particle.
 let changed=false;for(let i=0;i<200;i++){thinkFish(brain,1/60,1000,300,0,{...senses,food:[a,b]},.5);changed ||= brain.intent.target?.id===2;}assert.ok(changed);
});
test('sixteen feeding fish take different morsels without overlap or duplicate consumption',()=>{
 const fish=Array.from({length:16},(_,i)=>{const s=createTetraSwim(237+i*7919);Object.assign(s,{x:860+i%4*65,y:310+Math.floor(i/4)*33,z:.28+i%3*.19});s.brain.seed=723+i*3571;return s;});
 let food=Array.from({length:12},(_,i)=>({id:i,x:890+(i%4)*60,y:230,z:.35+Math.floor(i/4)*.23}));const eaten=new Set(),eaters=new Set(),peaks=Array(16).fill(0),biteTimes=[];
 for(let frame=0;frame<45*30;frame++){
  const snapshot=fish.map((s,id)=>({id,x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,vz:s.vz,foodTarget:s.feedingTarget,radius:25}));
  fish.forEach((s,id)=>{
   advanceTetraSwim(s,1/30,false,false,{...senses,food,neighbors:snapshot.filter(n=>n.id!==id)});peaks[id]=Math.max(peaks[id],s.speed);
   if(s.brain.consumedFood!==null){const target=s.brain.consumedFood;assert.ok(food.some(f=>f.id===target));assert.ok(!eaten.has(target));eaten.add(target);eaters.add(id);biteTimes.push(frame/30);food=food.filter(f=>f.id!==target);s.brain.consumedFood=null;}
  });
  const bodies=fish.map((s,id)=>({id,x:s.x,y:s.y,z:s.z,radius:25}));separateFish(bodies,[-.4,1.4]);bodies.forEach((b,i)=>Object.assign(fish[i],{x:b.x,y:b.y,z:b.z}));
  for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)assert.ok(Math.hypot(fish[i].x-fish[j].x,fish[i].y-fish[j].y,(fish[i].z-fish[j].z)*180)>=49.95,`frame ${frame} pair ${i}/${j}: ${Math.hypot(fish[i].x-fish[j].x,fish[i].y-fish[j].y,(fish[i].z-fish[j].z)*180)}`);
  food.forEach(f=>f.y+=5/30);
 }
 assert.ok(eaten.size>=8,`${eaten.size} morsels eaten`);assert.ok(eaters.size>=4,`${eaters.size} individual fish ate`);assert.ok(Math.max(...peaks)>130);assert.ok(Math.max(...peaks)-Math.min(...peaks)>60);assert.ok(new Set(biteTimes).size>5);
});
test('swept contact stops a fast fish crossing a thin branch and permits safe escape',()=>{
 const obstacle={center:new T.Vector3(),radius:.04},from=new T.Vector3(-1,0,0),to=new T.Vector3(1,0,0);
 sweepHardscape(from,to,[obstacle]);assert.ok(to.x<-.27&&to.x>-.271);
 const clear=new T.Vector3(1,.5,0);sweepHardscape(new T.Vector3(-1,.5,0),clear,[obstacle]);assert.equal(clear.x,1);
 const escape=new T.Vector3(1,0,0);sweepHardscape(new T.Vector3(.1,0,0),escape,[obstacle]);assert.equal(escape.x,1);
});
