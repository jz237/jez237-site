import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';import {createRace,stepRace,adjudicateGate} from '../race-core.js';import {verificationInput} from '../race-verification.js';
test('Sunset finish spans the mapped line without moving the starting lane',()=>{
 for(let d=0;d<4;d++){const c=getCourse('amber',d),g=c.gates[0];assert.equal(g.x,33.75);assert.equal(g.z,18.75);const ends=[g.spanMin,g.spanMax].map(v=>g.x-g.tz*v).sort((a,b)=>a-b);assert.deepEqual(ends,[3.75,131.25]);assert.equal(c.finishBypass,d===3?0:3);}
});
test('the extended finish charges skipped buoys and disqualifies at five misses',()=>{
 for(const prior of [0,1,2]){const s=createRace({course:getCourse('amber')}),r=s.racers[0];s.time=240;s.phase='running';r.lap=3;r.next=s.course.gates.length-3;r.misses=prior;r.power=5;r.x=123.75;r.z=18;
  assert.equal(adjudicateGate(s,r,123.75,20),true);assert.equal(r.misses,prior+3);assert.equal(r.power,0);
  assert.equal(r.dq,prior===2?'Five missed buoys':'');assert.equal(r.finishTime,prior===2?null:240);
 }
});
test('finish bypass cannot skip the main circuit, extend beyond the line, or run backward',()=>{
 for(const variant of ['early','outside','backwards']){const s=createRace({course:getCourse('amber')}),r=s.racers[0];s.time=240;s.phase='running';r.lap=3;r.next=variant==='early'?1:s.course.gates.length-3;const next=r.next,x=variant==='outside'?150:123.75;r.x=x;r.z=variant==='backwards'?20:18;
  assert.equal(adjudicateGate(s,r,x,variant==='backwards'?18:20),false);assert.equal(r.next,next);assert.equal(r.misses,0);assert.equal(r.finishTime,null);
 }
});
test('all forward classes drive the final-lap hairpin shortcut and finish with three real misses',()=>{
 for(let difficulty=0;difficulty<3;difficulty++){const s=createRace({course:getCourse('amber',difficulty),difficulty}),r=s.racers[0];s.verifySunsetShortcut=true;let entered=false,maxOut=0,cutHits=0;
  for(let i=0;i<36000&&s.phase!=='results';i++){stepRace(s,verificationInput(s,r),1/60);if(r.sunsetShortcut){entered=true;maxOut=Math.max(maxOut,r.out);cutHits+=r.collision>0;}else assert.equal(r.misses,0);}
  assert.ok(entered);assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.lap,4);assert.equal(r.misses,3);assert.equal(r.passed,s.course.gates.length*3);assert.ok(r.finishTime>0);assert.ok(maxOut>1&&maxOut<5);assert.equal(cutHits,0);
 }
});
