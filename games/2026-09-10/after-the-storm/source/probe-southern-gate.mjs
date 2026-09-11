import {createRace,stepRace,gateCoordinates} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
const s=createRace({course:getCourse('tempest',1),difficulty:1}),r=s.racers[0];s.verifyPierDive=true;
const samples=[];
for(let frame=0;frame<36000&&s.phase!=='results';frame++){
 const next=r.next,input=verificationInput(s,r);
 stepRace(s,input,1/60);
 if(r.lap===3&&next===4&&(frame%15===0||r.next!==next))samples.push({time:s.time,x:r.x,z:r.z,speed:r.speed,heading:r.heading,yaw:r.yawVelocity,vx:r.vx,vz:r.vz,gate:gateCoordinates(s.course.gates[4],r.x,r.z),input,misses:r.misses});
}
console.log(JSON.stringify({gate:s.course.gates[4],samples},null,2));
