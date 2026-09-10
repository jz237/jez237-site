import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,COVE} from '../race-core.js';

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
