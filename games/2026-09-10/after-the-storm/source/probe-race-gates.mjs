import {createRace,stepRace,aiInput} from '../race-core.js';
import {getCourse} from '../courses.js';
for(const id of process.argv.slice(2).length?process.argv.slice(2):['reed'])for(let difficulty=0;difficulty<4;difficulty++){
 const s=createRace({course:getCourse(id,difficulty),difficulty}),r=s.racers[0],events=[];let misses=0,contact=false;
 for(let frame=0;frame<36000&&s.phase!=='results';frame++){
  const next=r.next,lap=r.lap,input=aiInput(s,r);
  stepRace(s,input,1/60);
  if(r.misses>misses||r.collision>0&&!contact){events.push({time:s.time,lap,gate:next,misses:r.misses,collision:r.collision,x:r.x,z:r.z,speed:r.speed,input});misses=r.misses;}
  contact=r.collision>0;
 }
 console.log(JSON.stringify({course:id,difficulty,time:s.time,phase:s.phase,dq:r.dq,passed:r.passed,misses:r.misses,events:events.slice(0,12)},null,2));
}
