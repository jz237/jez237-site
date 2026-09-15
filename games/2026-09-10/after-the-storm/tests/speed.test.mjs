import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,COVE} from '../race-core.js';
import {getCourse} from '../courses.js';

test('full-power launch retains its initial response and reaches the doubled speed envelope',()=>{
 // Initial launch remains near the existing calibration. The user-requested
 // doubled top end deliberately supersedes the old 95 km/h terminal envelope.
 const s=createRace({mode:'practice',course:getCourse('neon'),seaState:'calm'}),r=s.racers[0];
 Object.assign(s.course,{ground:()=>-10,rocks:[],ramps:[],crossbars:[],passage:null});
 r.x=0;r.z=0;r.heading=0;
 while(s.phase==='countdown')stepRace(s,{throttle:1,dampen:true},1/60);
 const observed=new Map([[18,16],[78,68],[138,95]]);
 for(let frame=1;frame<=600;frame++){
  stepRace(s,{throttle:1,dampen:true},1/60);
  if(observed.has(frame))assert.ok(Math.abs(r.speed*3.6-observed.get(frame))<4,`${frame/60}s: ${r.speed*3.6} km/h`);
 }
 assert.ok(r.speed*3.6>185&&r.speed*3.6<205,'full throttle must reach the doubled top end');
 const speed=r.speed;
 for(let frame=0;frame<120;frame++)stepRace(s,{throttle:0,dampen:true},1/60);
 assert.ok(r.speed<speed*.7,'releasing throttle must remove propulsion');
});

test('full throttle reaches 60 km/h promptly and sustains the higher speed across sea states',()=>{
 for(const seaState of ['calm','chop','storm']){
  const s=createRace({mode:'practice',seaState,course:{...COVE,ground:()=>-20,rocks:[],ramps:[],passage:null}});
  s.phase='running';const r=s.racers[0];r.x=0;r.z=0;r.heading=0;
  let time60=null,cruise=0;
  for(let i=0;i<1800;i++){
   stepRace(s,{throttle:1},1/60);
   assert.ok(Number.isFinite(r.speed)&&r.speed<70,seaState+' bounded speed');
   if(time60===null&&r.speed*3.6>=60)time60=s.time;
   if(i>=1200)cruise+=r.speed*3.6/600;
  }
  assert.ok(time60!==null&&time60<3.5,seaState+' acceleration');
  assert.ok(cruise>(seaState==='calm'?180:80),seaState+' sustained speed');
  const beforeBrake=r.speed;
  for(let i=0;i<120;i++)stepRace(s,{brake:true},1/60);
  assert.ok(r.speed<beforeBrake*.2,seaState+' controllable braking');
 }
});

// More available speed must not become a compulsory cruise speed.
test('part throttle can hold a lower cruise with the doubled top end available',()=>{
 const s=createRace({mode:'practice',seaState:'calm',course:{...COVE,ground:()=>-20,rocks:[],ramps:[],crossbars:[],passage:null}}),r=s.racers[0];s.phase='running';r.x=r.z=r.heading=0;
 for(let i=0;i<900;i++)stepRace(s,{throttle:.65,dampen:true},1/60);
 assert.ok(r.speed*3.6>65&&r.speed*3.6<100,'partial throttle remains a usable cruising range');
 for(let i=0;i<900;i++)stepRace(s,{throttle:1,dampen:true},1/60);
 assert.ok(r.speed*3.6>185,'the same craft can open its additional top end');
});
