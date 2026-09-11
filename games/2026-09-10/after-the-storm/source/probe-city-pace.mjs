// Ordinary-control diagnostic; reports failures instead of granting progress.
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
const runs=[];
for(const outer of [false,true]){
 const s=createRace({mode:'stunt',course:getCourse('neon')}),r=s.racers[0];
 s.verifyStuntOuter=outer;
 const events=[];let rings=0,checkpoint=0,firstRamp=false;
 const sample=kind=>({kind,seconds:+s.time.toFixed(3),speedKmh:+(r.speed*3.6).toFixed(2),x:+r.x.toFixed(2),z:+r.z.toFixed(2),target:r.authoredStuntDriver?.index,rings:r.stunt.rings,checkpoint:r.stunt.nextCheckpoint});
 for(let frame=0;frame<12000&&s.phase!=='results';frame++){
  stepRace(s,verificationInput(s,r),1/60);
  if(r.hydro.onRamp&&!firstRamp){firstRamp=true;events.push(sample('first ramp contact'));}
  if(r.stunt.rings!==rings){rings=r.stunt.rings;events.push(sample('ring'));}
  if(r.stunt.nextCheckpoint!==checkpoint){checkpoint=r.stunt.nextCheckpoint;events.push(sample('checkpoint'));}
 }
 runs.push({branch:outer?'outer':'inner',events,end:sample('end'),phase:s.phase,dq:r.dq,ringStatus:r.stunt.ringStatus});
}
console.log(JSON.stringify(runs,null,2));
