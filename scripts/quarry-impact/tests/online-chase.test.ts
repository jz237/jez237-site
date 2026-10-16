import test from 'node:test';
import assert from 'node:assert/strict';
import {ChaseRound,validChaseRules,type ChaseRules} from '../multiplayer/chase';
const rules:ChaseRules={version:1,runners:[3,0],duration:60};
const cars=(count=8)=>Array.from({length:count},(_,id)=>({id,health:100,finished:false,finishTime:0}));

test('8 and 24 player Chase keeps slot identities and puts all runners at the front',()=>{
 for(const capacity of [8,24] as const){
  const settings=structuredClone(rules),round=new ChaseRound(settings,capacity);settings.runners.push(1);
  assert.equal(round.session.role(1),'chaser');assert.equal(round.gridSlot(0),0);assert.equal(round.gridSlot(3),1);
  assert.equal(new Set(Array.from({length:capacity},(_,id)=>round.gridSlot(id))).size,capacity);
  for(let id=0;id<capacity;id++)assert.equal(round.canFinish(id),id===0||id===3);
  assert.throws(()=>round.gridSlot(capacity));
 }
});
test('malformed team selections cannot create a different or one-sided match',()=>{
 for(const value of [null,{}, {...rules,runners:[]},{...rules,runners:[0,0]},{...rules,runners:[8]},{...rules,runners:[.5]},{...rules,runners:Array.from({length:8},(_,i)=>i)},{...rules,duration:59},{...rules,duration:NaN},{...rules,extra:true}])assert.equal(validChaseRules(value,8),false);
 assert.equal(validChaseRules({...rules,runners:[23]},24),true);
});
test('disconnects retain their cars and teams; incomplete authority updates fail atomically',()=>{
 const round=new ChaseRound(rules,8),field=cars();round.update(field,10);const before=round.snapshot();
 assert.throws(()=>round.update(field.filter(c=>c.id!==3),11));assert.deepEqual(round.snapshot(),before);
 assert.throws(()=>round.update([...field.slice(1),field[1]],11));assert.deepEqual(round.snapshot(),before);
 const restored=ChaseRound.restore(rules,8,JSON.parse(JSON.stringify(before)),field,10);
 assert.deepEqual(restored.snapshot(),before);assert.equal(restored.session.role(3),'runner');
 field[3].health=0;restored.update(field,11);assert.equal(restored.session.result(3)?.outcome,'caught');assert.equal(restored.session.complete,false);
 field[0].finished=true;field[0].finishTime=12;restored.update(field,12);assert.equal(restored.session.winner,'runners');
 assert.ok(field.every(c=>restored.stopped(c.id)));
});
test('a saved escaped runner remains escaped after later damage while teammates continue',()=>{
 const round=new ChaseRound(rules,8),field=cars();field[0].finished=true;field[0].finishTime=9;round.update(field,10);
 field[0].health=0;round.update(field,12);
 const restored=ChaseRound.restore(rules,8,round.snapshot(),field,12);assert.equal(restored.session.result(0)?.outcome,'escaped');
 field[3].health=0;restored.update(field,13);assert.equal(restored.session.winner,'runners');
});
test('restoration rejects changed teams, clocks and outcomes inconsistent with saved physics',()=>{
 const round=new ChaseRound(rules,8),field=cars();round.update(field,10);const state=round.snapshot();
 assert.throws(()=>ChaseRound.restore({...rules,runners:[0,2]},8,state,field,10));
 assert.throws(()=>ChaseRound.restore(rules,8,state,field,11));
 for(const outcome of ['caught','escaped'] as const){const corrupt=structuredClone(state);corrupt.results[0]={id:0,outcome,time:9};assert.throws(()=>ChaseRound.restore(rules,8,corrupt,field,10));}
 const corrupt=structuredClone(state);corrupt.rules.members.pop();assert.throws(()=>ChaseRound.restore(rules,8,corrupt,field,10));
 field[0].health=0;assert.throws(()=>ChaseRound.restore(rules,8,state,field,10));
});
test('timeout catches remaining runners and restores a terminal team result',()=>{
 const round=new ChaseRound(rules,24),field=cars(24);round.update(field,60.01);
 assert.equal(round.session.winner,'chasers');assert.equal(round.canFinish(0),false);
 const saved=round.snapshot(),restored=ChaseRound.restore(rules,24,saved,field,60.01);
 saved.results[0].outcome='escaped';assert.equal(restored.session.winner,'chasers');
 assert.deepEqual(restored.snapshot(),round.snapshot());
});
