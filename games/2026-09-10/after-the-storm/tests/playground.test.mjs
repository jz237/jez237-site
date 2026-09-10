import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {COURSES,getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
import {rampWaterOffset,ringHeight,applyRamp,stepStunt} from '../stunts.js';
import {WAVES,waterLevel,craftFields} from '../simulation.js';

test('long swells are 2.1 times taller and longer while small ripples retain their scale',()=>{
 for(const [i,w] of WAVES.entries()){
  assert.ok(Math.abs(w[3]/(.18*Math.pow(.73,i))-(i<4?2.1:1))<1e-10);
  assert.ok(Math.abs((.085*Math.pow(1.34,i))/w[2]-(i<4?2.1:1))<1e-10);
  assert.equal(w[4],Math.sqrt(9.81*w[2]));
 }
});
test('four free-ride ramps and their landing corridors are in navigable water in all venue classes',()=>{
 for(const c of COURSES)for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({course:getCourse(c.id,difficulty),mode:'practice'});
  assert.equal(s.course.ramps.length,4);assert.equal(s.course.rings.length,12);assert.equal(s.course.checkpoints.length,0);
  for(const r of s.course.ramps)for(const [along,across] of [[-7,-5],[-7,5],[7,-5],[7,5],[25,0]])
   assert.ok(s.course.ground(r.x+r.tx*along+r.tz*across,r.z+r.tz*along-r.tx*across)<-.5,c.id+'/'+difficulty+'/'+r.id);
 }
});
test('ordinary helm input launches, collects a ring and lands in every venue and sea state',()=>{
 for(const c of COURSES)for(const seaState of ['calm','chop','storm']){
  const s=createRace({course:getCourse(c.id),mode:'practice',seaState});s.phase='running';const r=s.racers[0];
  for(let i=0;i<2400&&!r.playgroundVerification?.done;i++)stepRace(s,verificationInput(s,r),1/60);
  assert.ok(r.playgroundVerification?.done,c.id+'/'+seaState);assert.ok(r.playgroundVerification.peak>2.5);
  assert.ok(r.stunt.rings>=1);assert.ok(r.stunt.score>=50);assert.equal(r.dq,'');
 }
});
test('free ride stays untimed and fresh starts reset stunt progress',()=>{
 const options={course:getCourse('practice'),mode:'practice'},s=createRace(options);s.phase='running';
 for(let i=0;i<7200;i++)stepRace(s,{},1/60);
 assert.equal(s.phase,'running');assert.equal(s.racers[0].dq,'');assert.equal(s.racers[0].stunt.remaining,38);
 const fresh=createRace(options);assert.equal(fresh.racers[0].stunt.score,0);assert.deepEqual(fresh.racers[0].stunt.ringStatus,[]);
});
test('rings can be collected again after their cooldown',()=>{
 const s=createRace({mode:'practice'}),r=s.racers[0],ring={x:0,z:0,y:1,tx:0,tz:1,radius:2,type:'water'},course={freeStunts:true,rings:[ring],checkpoints:[]};
 r.x=0;r.z=1;r.hydro.y=.15;r.raceTime=1;stepStunt(r.stunt,r,course,{},1/60,0,-1,.15);assert.equal(r.stunt.rings,1);
 r.raceTime=5;stepStunt(r.stunt,r,course,{},1/60,0,-1,.15);assert.equal(r.stunt.rings,1);
 r.raceTime=12;stepStunt(r.stunt,r,course,{},1/60,0,-1,.15);assert.equal(r.stunt.rings,2);assert.equal(r.stunt.score,150);
});
test('floating ramp contact and air rings share the rendered platform height through tide and swell',()=>{
 const s=createRace({mode:'practice'}),r=s.racers[0],ramp=s.course.ramps[0],ring=s.course.rings[0];craftFields.forEach(c=>c.power=0);
 for(const tide of [-1,0,1])for(const time of [0,7,19]){
  waterLevel.value=tide;r.x=ramp.x;r.z=ramp.z;r.vx=ramp.tx*16;r.vz=ramp.tz*16;r.speed=16;r.hydro.y=-10;
  const offset=rampWaterOffset(ramp,time,.95);applyRamp(r,[ramp],r.x-ramp.tx,r.z-ramp.tz,0,time,.95);
  assert.ok(Math.abs(r.hydro.y-(offset+ramp.height/2+.2))<1e-8);assert.ok(Math.abs(ringHeight(ring,s.course,time,.95)-(ring.y+offset))<1e-8);
 }
 waterLevel.value=0;
});
