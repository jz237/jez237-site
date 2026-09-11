import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
for(const route of process.argv[2]?[process.argv[2]]:['Dive','Surface'])for(let difficulty=0;difficulty<3;difficulty++){
 const s=createRace({course:getCourse('tempest',difficulty),difficulty}),r=s.racers[0];s['verifyPier'+route]=true;
 let stage=-1,lap=0,contact=false,rampRecorded=false,misses=0;const events=[];
 for(let frame=0;frame<36000&&s.phase!=='results';frame++){
  const next=r.next,input=verificationInput(s,r);stepRace(s,input,1/60);
  if(r.misses>misses){misses=r.misses;events.push({kind:'miss',time:s.time,lap:r.lap,gate:next,stage:r.pierDiveStage??r.pierSurface?.stage,x:r.x,z:r.z,speed:r.speed});}
  if(r.hydro.onRamp&&!rampRecorded){rampRecorded=true;events.push({kind:'ramp contact',time:s.time,x:r.x,z:r.z,heading:r.heading,yaw:r.yawVelocity,vx:r.vx,vz:r.vz,speed:r.speed});}
  const current=route==='Dive'?r.pierDiveStage:r.pierSurface?.stage;
  if(current!==undefined&&(stage!==current||lap!==r.lap||r.collision>0&&!contact)){
   events.push({time:s.time,lap:r.lap,stage:current,x:r.x,z:r.z,speed:r.speed,y:r.hydro.y,water:r.hydro.waterHeight,dive:r.hydro.diveRemaining,collision:r.collision,onRamp:r.hydro.onRamp,input});
   stage=current;lap=r.lap;
  }
  contact=r.collision>0;
  if(process.argv.includes('--approach')&&(route==='Dive'&&r.pierDiveStage>=2||route==='Surface'&&r.pierSurface?.stage>=4))break;
 }
 console.log(JSON.stringify({route,difficulty,phase:s.phase,misses:r.misses,dq:r.dq,events:events.slice(0,20)},null,2));
}
