import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
for(const id of process.argv.slice(2).length?process.argv.slice(2):['port','citadel']){
 const s=createRace({mode:'stunt',course:getCourse(id)}),r=s.racers[0],events=[];
 const status=[];let onRamp=false,landing=0,target=-1;
 for(let frame=0;frame<12000&&s.phase!=='results';frame++){
  stepRace(s,verificationInput(s,r),1/60);
  if(target!==r.authoredStuntDriver?.index){target=r.authoredStuntDriver?.index;events.push({kind:'target',target,time:s.time,x:r.x,z:r.z,speed:r.speed,heading:r.heading});}
  if(r.hydro.onRamp&&!onRamp){const q=s.course.ramps.reduce((a,b)=>Math.hypot(r.x-a.x,r.z-a.z)<Math.hypot(r.x-b.x,r.z-b.z)?a:b);events.push({kind:'ramp',id:q.id,time:s.time,heading:r.heading,desiredHeading:Math.atan2(q.tx,q.tz),yaw:r.yawVelocity,speed:r.speed,x:r.x,z:r.z});}
  if(r.hydro.landingId>landing){landing=r.hydro.landingId;events.push({kind:'landing',time:s.time,x:r.x,z:r.z,speed:r.speed,target:r.authoredStuntDriver?.index});}
  onRamp=r.hydro.onRamp;
  s.course.rings.forEach((q,i)=>{
   if(r.stunt.ringStatus[i]===status[i])return;
   status[i]=r.stunt.ringStatus[i];
   const dx=r.x-q.x,dz=r.z-q.z;
   events.push({ring:i,status:status[i],time:+s.time.toFixed(3),speed:+r.speed.toFixed(2),lateral:+(-dx*q.tz+dz*q.tx).toFixed(2),heightAboveWater:+(r.hydro.y-r.hydro.waterHeight).toFixed(2),airborne:r.hydro.airborne,target:r.authoredStuntDriver?.index});
  });
 }
 console.log(JSON.stringify({course:id,time:s.time,dq:r.dq,rings:r.stunt.rings,events},null,2));
}
