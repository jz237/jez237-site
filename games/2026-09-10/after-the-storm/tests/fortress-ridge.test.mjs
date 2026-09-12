import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace} from '../race-core.js';import {verificationInput} from '../race-verification.js';
test('a timed wave carries the hull across the northern Fortress ridge without impacts or phantom buoy misses',()=>{
 // Recalibrated for the current acceleration: the supporting crest arrives
 // after roughly six seconds at the holding point, not the old 4.5-second trough.
 for(const ridgeWait of [5.9,6,6.1]){const c=getCourse('citadel'),s=createRace({course:c}),r=s.racers[0];s.verifyFortressRidge=true;s.ridgeWait=ridgeWait;let ridgeFrames=0,hits=0,clearance=Infinity;
 for(let i=0;i<36000&&s.phase!=='results';i++){
  stepRace(s,verificationInput(s,r),1/60);
  if(r.fortressRidge&&!r.fortressRidge.done){hits+=r.collision>0;const bed=c.ground(r.x,r.z);if(bed>0){ridgeFrames++;clearance=Math.min(clearance,r.hydro.y-.2-bed);}}
  if(ridgeWait!==6&&r.fortressRidge?.done)break;
 }
 assert.ok(r.fortressRidge?.done);assert.ok(ridgeFrames>20);assert.ok(clearance>.15);assert.equal(hits,0);assert.equal(r.misses,0);assert.equal(r.dq,'');
 if(ridgeWait===6){assert.equal(s.phase,'results');assert.equal(r.passed,c.gates.length*3);}
 }
});

test('the same straight approach hits solid stone when it arrives without a supporting crest',()=>{
 const c=getCourse('citadel'),s=createRace({course:c}),r=s.racers[0];s.verifyFortressRidge=true;s.ridgeWait=0;let impact=false;
 for(let i=0;i<1500;i++){stepRace(s,verificationInput(s,r),1/60);if(r.collision&&r.z/.8+300<146){impact=true;break;}}
 assert.ok(impact);assert.ok(!r.fortressRidge.done);assert.equal(r.misses,0);
});
