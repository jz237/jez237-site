import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {ringHeight} from '../stunts.js';
import {waterLevel} from '../simulation.js';

test('Southern Stunt selects ten fixed rings, two source ramps and four native timed checkpoints',()=>{
 for(const difficulty of [0,1,2,3]){
  const s=createRace({mode:'stunt',course:getCourse('tempest',difficulty),difficulty}),c=s.course;
  assert.equal(c.rings.length,10);assert.equal(c.ramps.length,2);assert.equal(c.contactVolumes.volumes.length,23);
  assert.deepEqual(c.checkpoints.map(q=>q.limit),[20,15,20,15]);assert.equal(s.racers[0].stunt.remaining,20);
  assert.deepEqual(c.ramps.map(q=>q.nativeRow),[[-592,3592,0,0,33],[-1185,-3695,0,0,308]]);
  assert.equal(c.rocks.length,28);assert.equal(c.stuntLayout.driver,'source-layout');
  for(const datum of [0,-2.5,-3.75]){waterLevel.value=datum;assert.deepEqual(c.rings.map(q=>ringHeight(q,c,100,.8)),[0,0,0,1.5,1.5,1.5,1.5,1.5,1.5,1.5]);}
 }
 waterLevel.value=0;
});
test('ordinary helm crosses all Southern hoops and checkpoints within the original allowances',()=>{
 const s=createRace({mode:'stunt',course:getCourse('tempest'),seaState:'course',waveSeed:17}),r=s.racers[0],crossings=[];let old=0;
 const geometry=JSON.stringify({rings:s.course.rings,checkpoints:s.course.checkpoints,volumes:s.course.contactVolumes.volumes.map(q=>[q.origin,q.axes,q.spans]),shores:s.course.sourceShores});
 for(let i=0;i<6000&&s.phase!=='results';i++){
  stepRace(s,aiInput(s,r),1/60);
  if(r.stunt.nextCheckpoint>old){crossings.push(s.time-(crossings.reduce((a,b)=>a+b,0)));old=r.stunt.nextCheckpoint;}
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.rings,10);assert.equal(r.stunt.chain,10);
 assert.ok(r.stunt.ringStatus.every(q=>q==='hit'));assert.equal(r.stunt.nextCheckpoint,4);assert.equal(r.stunt.crashes,0);assert.equal(r.stunt.overtime,0);
 assert.equal(s.courseDatum.value,0);assert.ok(s.time<60);assert.equal(crossings.length,4);
 crossings.forEach((elapsed,i)=>assert.ok(elapsed<=[20,15,20,15][i],`${i}: ${elapsed}`));
 assert.equal(JSON.stringify({rings:s.course.rings,checkpoints:s.course.checkpoints,volumes:s.course.contactVolumes.volumes.map(q=>[q.origin,q.axes,q.spans]),shores:s.course.sourceShores}),geometry);
});
