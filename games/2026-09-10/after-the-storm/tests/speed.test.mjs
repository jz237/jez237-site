import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,COVE} from '../race-core.js';
import {getCourse} from '../courses.js';

test('balanced full-power launch follows the observed original stunt acceleration envelope',()=>{
 // Source: source/city-launch-calibration.json. Isolated speed calibration,
 // not evidence for route geometry, original rider identity or course parity.
 const s=createRace({mode:'practice',course:getCourse('neon'),seaState:'calm'}),r=s.racers[0];
 Object.assign(s.course,{ground:()=>-10,rocks:[],ramps:[],crossbars:[],passage:null});
 r.x=0;r.z=0;r.heading=0;
 while(s.phase==='countdown')stepRace(s,{throttle:1,dampen:true},1/60);
 const observed=new Map([[18,16],[78,68],[138,95]]);
 for(let frame=1;frame<=600;frame++){
  stepRace(s,{throttle:1,dampen:true},1/60);
  if(observed.has(frame))assert.ok(Math.abs(r.speed*3.6-observed.get(frame))<4,`${frame/60}s: ${r.speed*3.6} km/h`);
 }
 assert.ok(r.speed*3.6>90&&r.speed*3.6<103,'launch response must settle near rated speed');
 const speed=r.speed;
 for(let frame=0;frame<120;frame++)stepRace(s,{throttle:0,dampen:true},1/60);
 assert.ok(r.speed<speed*.7,'releasing throttle must remove propulsion');
});

test('full throttle reaches 60 km/h promptly and sustains over 80 across sea states',()=>{
 for(const seaState of ['calm','chop','storm']){
  const s=createRace({mode:'practice',seaState,course:{...COVE,ground:()=>-20,rocks:[],ramps:[],passage:null}});
  s.phase='running';const r=s.racers[0];r.x=0;r.z=0;r.heading=0;
  let time60=null,cruise=0;
  for(let i=0;i<1800;i++){
   stepRace(s,{throttle:1},1/60);
   assert.ok(Number.isFinite(r.speed)&&r.speed<35,seaState+' bounded speed');
   if(time60===null&&r.speed*3.6>=60)time60=s.time;
   if(i>=1200)cruise+=r.speed*3.6/600;
  }
  assert.ok(time60!==null&&time60<3.5,seaState+' acceleration');
  assert.ok(cruise>80,seaState+' sustained speed');
  const beforeBrake=r.speed;
  for(let i=0;i<120;i++)stepRace(s,{brake:true},1/60);
  assert.ok(r.speed<beforeBrake*.2,seaState+' controllable braking');
 }
});
