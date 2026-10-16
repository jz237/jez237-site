import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';
import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
import {COURSE_NAMES,type CourseId} from '../src/course-id';
await R.init();
// Isolate route navigation from pursuit tactics. The runner receives only AI
// controls; no checkpoint injection, recovery, or movement correction is used.
for(const course of Object.keys(COURSE_NAMES) as CourseId[])for(const direction of ['forward','reverse'] as const){
 test(`Chase runner traverses ${course} ${direction} without resets`,()=>{
  const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,course,direction,laps:1,chase:{version:1,runners:[0],duration:180}});
  try{
   for(const c of s.cars.slice(1)){c.state.health=0;c.body.setTranslation({x:1000+c.state.id*10,y:2,z:1000},true);}
   s.phase='playing';
   for(let i=0;i<10801&&s.phase!=='result';i++)s.step(new Set());
   const runner=s.cars[0].state;
   assert.equal(s.event!.chase!.session.result(0)?.outcome,'escaped');
   assert.ok(s.elapsed<180);assert.equal(runner.passed,24);
   assert.equal(runner.repair,0);assert.equal(runner.penalty,0);
   assert.ok(runner.health>0);assert.equal(s.phase,'result');
  }finally{s.dispose();}
 });
}
for(const course of ['cinderbank-oval-v1','ironfield-figure-eight-v1','redbank-jump-v1','granite-pass-v1'] as CourseId[])for(const direction of ['forward','reverse'] as const){
 test(`eight-car Chase resolves without resets on ${course} ${direction}`,()=>{
  const s=new Simulation(R,'race',[],8,[],{...DEFAULT_ONLINE_EVENT,course,direction,laps:1,chase:{version:1,runners:[0],duration:180}});
  try{
   s.phase='playing';
   for(let i=0;i<10801&&s.phase!=='result';i++)s.step(new Set());
   const result=s.event!.chase!.session.result(0)!;
   assert.equal(s.phase,'result');assert.ok(s.cars[0].state.passed>0);
   if(result.outcome==='escaped'){assert.equal(s.cars[0].state.passed,24);assert.ok(s.elapsed<180);}
   else{assert.equal(result.outcome,'caught');assert.ok(s.cars[0].state.health===0||s.elapsed>=180);}
   assert.ok(s.cars.every(c=>Object.values(c.state.p).every(Number.isFinite)));
   assert.ok(s.cars.every(c=>c.state.repair===0&&c.state.penalty===0));
  }finally{s.dispose();}
 });
}
