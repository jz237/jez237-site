import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';
import {DEFAULT_ONLINE_EVENT,OnlineEvent,copyOnlineEventRules,validOnlineEventRules,validOnlineEventState,type OnlineEventRules} from '../src/online-events';
import {courseRoute,courseGridSlot} from '../src/race-course';
import {NEUTRAL,type Snapshot} from '../multiplayer/protocol';
await R.init();
const rules=(runners=[3,0]):OnlineEventRules=>({...DEFAULT_ONLINE_EVENT,laps:1,chase:{version:1,runners,duration:60}});
const humans=new Set(Array.from({length:24},(_,id)=>id));
const saved=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
function gate(s:Simulation,id:number){const c=s.cars[id],point=courseRoute(s.course,'forward')[c.state.nextCheckpoint];c.body.setTranslation({x:point.x,y:s.course.height(point.x,point.z)+.9,z:point.z},true);c.body.setLinvel({x:0,y:0,z:0},true);s.setInput(id,{...NEUTRAL});s.step(humans);}

test('Chase rules clone teams, reject incompatible races and restore matching event state',()=>{
 const r=rules(),copy=copyOnlineEventRules(r);r.chase!.runners.push(4);assert.deepEqual(copy.chase!.runners,[3,0]);
 for(const patch of [{race:'ordered'},{direction:'opposing'},{raceDuration:120},{chase:{version:1,runners:[],duration:60}}])assert.equal(validOnlineEventRules({...copy,...patch}),false);
 assert.throws(()=>new OnlineEvent('derby',copy,1,8));assert.throws(()=>new OnlineEvent('race',rules([23]),1,8));
 const event=new OnlineEvent('race',copy,1,8),state=event.snapshot(8);assert.ok(validOnlineEventState(state,'race',8));
 assert.equal(validOnlineEventState({...state,chase:undefined},'race',8),false);
 assert.equal(validOnlineEventState(state,'derby',8),false);
 const restored=new OnlineEvent('race',copy,1,8);restored.restore(JSON.parse(JSON.stringify(state)),8);assert.deepEqual(restored.snapshot(8),state);
 assert.throws(()=>new OnlineEvent('race',rules([1]),1,8).restore(state,8));
});
test('real physics grids preserve identities, only runners escape, and recovery cannot repair Chase cars',()=>{
 for(const capacity of [8,24] as const){const s=new Simulation(R,'race',[],capacity,[],rules());try{
  assert.equal(s.cars[3].state.id,3);const expected=courseGridSlot(s.course,1,'forward');assert.ok(Math.hypot(s.cars[3].state.p.x-expected.x,s.cars[3].state.p.z-expected.z)<1e-5);
  s.phase='playing';s.cars[0].state.health=40;const repair=s.cars[0].state.repair;assert.equal(s.recover(0),false);assert.equal(s.cars[0].state.health,40);assert.equal(s.cars[0].state.repair,repair);
  for(let i=0;i<25;i++)gate(s,1);assert.equal(s.cars[1].state.finished,false);assert.equal(s.phase,'playing');
  for(let i=0;i<25&&!s.cars[0].state.finished;i++)gate(s,0);assert.equal(s.cars[0].state.finished,true);assert.equal(s.event!.chase!.session.result(0)?.outcome,'escaped');assert.equal(s.phase,'playing');
  s.cars[3].state.health=0;s.step(humans);assert.equal(s.phase,'result');assert.equal(s.event!.chase!.session.winner,'runners');
  const state=saved(s),restored=new Simulation(R,'race',[],capacity);try{restored.restore(state);assert.deepEqual(restored.event!.chase!.snapshot(),s.event!.chase!.snapshot());assert.equal(restored.phase,'result');}finally{restored.dispose();}
 }finally{s.dispose();}}
});
test('server rejects contradictory saves before changing the live simulation and ends at the Chase deadline',()=>{
 const s=new Simulation(R,'race',[],8,[],rules()),restored=new Simulation(R,'derby');try{
  s.phase='playing';s.step(humans);const state=saved(s),corrupt=structuredClone(state);corrupt.event!.chase!.results[0].outcome='escaped';
  assert.throws(()=>restored.restore(corrupt));assert.equal(restored.mode,'derby');
  restored.restore(state);assert.equal(restored.mode,'race');assert.deepEqual(restored.event!.chase!.snapshot(),s.event!.chase!.snapshot());
  s.elapsed=59.999;s.step(humans);assert.equal(s.phase,'result');assert.equal(s.event!.chase!.session.winner,'chasers');
 }finally{s.dispose();restored.dispose();}
});
test('disconnected drivers receive finite Chase AI controls in a running Rapier world',()=>{
 const s=new Simulation(R,'race',[],8,[],rules([0]));try{s.phase='playing';for(let i=0;i<180;i++)s.step(new Set());
  assert.ok(s.elapsed>2);for(const c of s.cars){for(const key of ['throttle','steer','brake'] as const)assert.ok(Number.isFinite(c.state.input[key]));assert.ok(Number.isFinite(c.state.p.x));}
  assert.equal(s.event!.chase!.session.role(0),'runner');assert.equal(s.event!.chase!.session.role(1),'chaser');
 }finally{s.dispose();}
});
test('Chase results rank the winning team ahead of opposing progress',()=>{
 const s=new Simulation(R,'race',[],8,[],rules([0]));try{s.phase='playing';s.cars[0].state.passed=200;s.cars[0].state.health=0;s.step(humans);assert.equal(s.event!.chase!.session.winner,'chasers');assert.equal(s.ranking().at(-1),0);}finally{s.dispose();}
});
