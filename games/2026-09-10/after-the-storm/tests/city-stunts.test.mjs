import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace} from '../race-core.js';
import {verificationInput} from '../race-verification.js';

test('Twilight stunt navigation stays in the water around both quay corners',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({mode:'stunt',course:getCourse('neon',difficulty)});
  for(const p of s.course.route)assert.ok(s.course.ground(p.x,p.z)<-.4,JSON.stringify(p));
 }
});

test('Twilight opening branches collect their separate rings through ordinary controls',()=>{
 // This checks the opening only. Outer checkpoint timing and the shared final
 // rings remain unresolved; this is deliberately not a course-completion claim.
 for(const outer of [false,true]){
  const s=createRace({mode:'stunt',course:getCourse('neon')}),r=s.racers[0];
  s.verifyStuntOuter=outer;
  const wanted=outer?[6,7,8]:[0,1,2,3,4,5],other=outer?[0,1,2,3,4,5]:[6,7,8];
  for(let i=0;i<2400&&!wanted.every(j=>r.stunt.ringStatus[j]==='hit')&&s.phase!=='results';i++)stepRace(s,verificationInput(s,r),1/60);
  for(const j of wanted)assert.equal(r.stunt.ringStatus[j],'hit',`branch ${outer?'outer':'inner'} ring ${j}`);
  for(const j of other)assert.equal(r.stunt.ringStatus[j],undefined);
  assert.equal(r.stunt.crashes,0);
  if(!outer)assert.equal(r.stunt.completedTricks.dive,true);
 }
});


test('Twilight finish metal floats stop a surface hull and survive course conversion',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({mode:'stunt',course:getCourse('neon',difficulty)});
  assert.equal(s.course.rocks.length,4);
  assert.ok(s.course.rocks.every(o=>o.type==='ball'&&o.spiked));
 }
 for(let j=0;j<4;j++){
  const s=createRace({mode:'stunt',course:getCourse('neon')}),r=s.racers[0],o=s.course.rocks[j];
  // Isolated contact fixture, not a course-progress verifier.
  s.phase='running';r.x=o.x-5;r.z=o.z;r.heading=Math.PI/2;r.vx=8;r.vz=0;r.speed=8;
  let impact=false;
  for(let i=0;i<90;i++){stepRace(s,{throttle:.4},1/60);impact ||=r.collision>0;}
  assert.ok(impact,`float ${j} must collide`);
  assert.ok(r.x<o.x-o.r,'surface hull must not pass through the float');
 }
});


test('Twilight inner route clears all fourteen selected rings and four checkpoints',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({mode:'stunt',course:getCourse('neon',difficulty)}),r=s.racers[0];
  for(let i=0;i<10000&&s.phase!=='results';i++)stepRace(s,verificationInput(s,r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.dq,'');
  assert.equal(r.stunt.rings,14);assert.equal(r.stunt.nextCheckpoint,4);
  assert.equal(r.stunt.crashes,0);assert.ok(r.stunt.completedTricks.dive);
  for(const [i,ring] of s.course.rings.entries())assert.equal(r.stunt.ringStatus[i],ring.branch==='outer'?undefined:'hit');
 }
});

test('Twilight branch drivers target the real object crossing directions',()=>{
 const s=createRace({mode:'stunt',course:getCourse('neon')}),c=s.course;
 for(const list of [c.stuntLayout.verificationTargets,c.stuntLayout.outerVerificationTargets]){
  for(const target of list){
   if(target.kind==='waypoint')continue;
   const objects=target.kind==='checkpoint'?c.checkpoints:target.kind==='ramp'?c.ramps:c.rings;
   const object=objects.find(o=>o.x===target.x&&o.z===target.z);
   assert.ok(object);assert.equal(target.tx,object.tx);assert.equal(target.tz,object.tz);
  }
 }
});
