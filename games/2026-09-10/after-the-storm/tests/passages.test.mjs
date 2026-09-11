import test from 'node:test';import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {passageOpening,passageCollision,passageCamera,passageTarget,passagePoint} from '../course-passages.js';
import {verificationInput} from '../race-verification.js';
function position(p,t,lateral=0){const q=passagePoint(p.structurePath||p.path,t);return {x:q.x+q.tz*lateral,z:q.z-q.tx*lateral};}
test('the gate blocks the hull until raised; side walls and roof remain solid',()=>{
 const p=getCourse('citadel',1).passage,g=position(p,.36),wall=position(p,.55,p.width+.55),roof=position(p,.55);
 assert.equal(passageCollision(p,g.x,0,g.z,40),true);
 assert.equal(passageCollision(p,g.x,0,g.z,70,60),false);
 assert.equal(passageCollision(p,wall.x,0,wall.z,70,60),true);
 assert.equal(passageCollision(p,roof.x,p.clearance,roof.z,70,60),true);
 assert.equal(passageCollision(p,roof.x,0,roof.z,70,60),false);
 assert.equal(passageOpening(p,61,60),1/3);
 assert.equal(passageOpening(getCourse('citadel',0).passage,70,60),0);
});
test('higher-class harbour passage is open from the start with a navigable floor',()=>{
 for(const d of [1,2,3]){const c=getCourse('port',d),p=c.passage;assert.equal(passageOpening(p,0),1);
  for(let t=.1;t<.91;t+=.05){const q=position(p,t);assert.ok(c.ground(q.x,q.z)<-3);assert.equal(passageCollision(p,q.x,0,q.z,0),false);}
 }
 assert.equal(passageOpening(getCourse('port',0).passage,70),0);
});
test('shortcut checkpoint planes remain ordered in Expert and Reverse',()=>{
 for(const id of ['citadel','port'])for(const difficulty of [1,2,3]){
  const c=getCourse(id,difficulty),s=createRace({course:c}),p=c.passage;s.time=80;s.passageOpenedAt=60;
  const samples=Array.from({length:1001},(_,i)=>passagePoint(p.path,i/1000));let previous=-Infinity;
  for(const next of p.indices){const g=passageTarget(s,{next}),distance=samples.reduce((best,q,i)=>Math.hypot(q.x-g.x,q.z-g.z)<Math.hypot(samples[best].x-g.x,samples[best].z-g.z)?i:best,0);assert.ok(distance>previous);previous=distance;}
 }
});
test('fortress race actually takes the outer first lap and traverses the open sluice later',()=>{
 for(const difficulty of [1,2,3]){const s=createRace({course:getCourse('citadel',difficulty),difficulty}),r=s.racers[0],p=s.course.passage,visits=[0,0,0,0];
  for(let i=0;i<22000&&s.phase!=='results';i++){stepRace(s,aiInput(s,r),1/60);const q=passagePoint(p.path,.6);if(Math.hypot(r.x-q.x,r.z-q.z)<p.width-1)visits[Math.min(3,r.lap)]++;}
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(visits[1],0);assert.ok(visits[2]>0);assert.ok(visits[3]>0);assert.ok(Number.isFinite(s.passageOpenedAt));
  assert.equal(createRace({course:getCourse('citadel',difficulty)}).passageOpenedAt,Infinity);
 }
});
test('the outer route remains an honest optional route after the shortcut opens',()=>{
 for(const id of ['citadel','port']){const s=createRace({course:getCourse(id,2),difficulty:2}),r=s.racers[0],outer={...s.course,passage:null};
  for(let i=0;i<22000&&s.phase!=='results';i++)stepRace(s,aiInput({...s,course:outer},r),1/60);
  assert.equal(s.phase,'results');assert.equal(r.misses,0);assert.equal(r.passed,s.course.gates.length*3);
 }
});
test('stunt guidance keeps all four mandatory checkpoints in every passage venue and class',()=>{
 for(const id of ['citadel','port'])for(let difficulty=0;difficulty<4;difficulty++){
  const s=createRace({mode:'stunt',course:getCourse(id,difficulty),difficulty}),r=s.racers[0];
  for(let i=0;i<14000&&s.phase!=='results';i++)stepRace(s,verificationInput(s,r),1/60);
  assert.equal(s.phase,'results',id+'/'+difficulty);assert.equal(r.dq,'',id+'/'+difficulty);assert.equal(r.stunt.nextCheckpoint,4);
 }
});
test('chase-camera sight lines stop before solid walls and overhead concrete',()=>{
 for(const id of ['citadel','port']){const p=getCourse(id,1).passage,q=position(p,.55),target={...q,y:1.3};
  const roof=passageCamera(p,target,{...q,y:7},80,50);assert.ok(roof.y<p.clearance-.2);
  const side=passageCamera(p,target,{...position(p,.55,p.width+5),y:2},80,50);assert.ok(Math.hypot(side.x-q.x,side.z-q.z)<p.width+(p.continuous?4:0));
  const wanted={...position(p,.58),y:2};assert.deepEqual(passageCamera(p,target,wanted,80,50),wanted);
 }
});
