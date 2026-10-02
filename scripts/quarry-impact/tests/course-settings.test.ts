import test from 'node:test';
import assert from 'node:assert/strict';
import {readEventOptions,DEFAULT_EVENT} from '../src/event-rules';
import {readDemoOptions,DEFAULT_DEMO,nextDemoMode} from '../src/demo-session';
import {resolveCourseId} from '../src/course-id';

test('pre-course and malformed saves preserve exact historical defaults with no new serialized field',()=>{
 for(const read of [readEventOptions,readDemoOptions]){
  const expected=read===readEventOptions?DEFAULT_EVENT:DEFAULT_DEMO;
  for(const json of [null,undefined,'not JSON','null','{}','{"version":2}',JSON.stringify(expected)])assert.deepEqual(read(json),expected);
  assert.equal(Object.hasOwn(read(JSON.stringify(expected)),'course'),false);
 }
});
test('known race preferences survive storage without changing an incompatible selected format',()=>{
 for(const course of ['quarry-v1','ironfield-figure-eight-v1']as const){
  for(const race of ['laps','ordered','free','random']as const){
   const saved={...DEFAULT_EVENT,course,race,direction:'opposing' as const,field:24,laps:6};
   assert.deepEqual(readEventOptions(JSON.stringify(saved)),saved);assert.equal(resolveCourseId(saved.course),course);
  }
  const demo={...DEFAULT_DEMO,course,lineup:'selected' as const,setups:'garage' as const,loop:'alternate' as const,camera:'trackside' as const};
  assert.deepEqual(readDemoOptions(JSON.stringify(demo)),demo);
 }
});
test('invalid saved course preferences fall back without discarding the rest of the event or demo',()=>{
 for(const course of ['',0,null,{},'https://example.com/track','ironfield-figure-eight-v2','__proto__']){
  const event={...DEFAULT_EVENT,race:'free' as const,laps:7,field:11};
  const demo={...DEFAULT_DEMO,camera:'drone' as const,duration:90};
  const a=readEventOptions(JSON.stringify({...event,course})),b=readDemoOptions(JSON.stringify({...demo,course}));
  assert.deepEqual(a,event);assert.deepEqual(b,demo);assert.equal(resolveCourseId(a.course),'quarry-v1');assert.equal(resolveCourseId(b.course),'quarry-v1');
 }
});
test('demo alternation does not mutate either saved race preference',()=>{
 const event=readEventOptions(JSON.stringify({...DEFAULT_EVENT,course:'quarry-v1'}));
 const demo=readDemoOptions(JSON.stringify({...DEFAULT_DEMO,course:'ironfield-figure-eight-v1'}));
 const before=JSON.stringify({event,demo});let mode:'race'|'derby'='race';
 mode=nextDemoMode(mode,demo.loop)!;assert.equal(mode,'derby');mode=nextDemoMode(mode,demo.loop)!;assert.equal(mode,'race');assert.equal(JSON.stringify({event,demo}),before);
});
