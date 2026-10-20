import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';

const physicalProgress=r=>[r.x,r.z,r.vx,r.vz,r.speed,r.heading,r.next,r.passed,r.lap,r.misses];

test('source helm clears Reverse solo through the falling tide using controls alone',()=>{
 const s=createRace({mode:'time',course:getCourse('tempest',3),difficulty:3}),r=s.racers[0];
 for(let tick=0;tick<24000&&s.phase!=='results';tick++){
  const before=physicalProgress(r),input=aiInput(s,r);
  assert.deepEqual(physicalProgress(r),before,'choosing controls must not move the craft or award progress');
  stepRace(s,input,1/60);
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.misses,0);
 assert.equal(r.lap,4);assert.equal(r.passed,3*s.course.gates.length);assert.equal(s.courseDatum.value,-3.75);
});

test('source helm retains the boosted rider2 Normal championship win',()=>{
 const s=createRace({mode:'championship',course:getCourse('tempest'),difficulty:0,rider:2}),r=s.racers[0];
 for(let tick=0;tick<24000&&s.phase!=='results';tick++){
  // A +0.1 boost now loses by 0.5 s on the venue water; +0.15 wins by about 4 s.
  const input=aiInput(s,r);input.throttle=Math.min(1,input.throttle+.15);input.dampen=true;
  stepRace(s,input,1/60);
 }
 assert.equal(s.phase,'results');assert.equal(s.result.position,1);assert.equal(r.dq,'');assert.equal(r.misses,0);
 assert.equal(r.lap,4);assert.equal(r.passed,3*s.course.gates.length);assert.equal(s.courseDatum.value,-3.75);
});
