import test from 'node:test';
import assert from 'node:assert/strict';
import {StartReadiness,START_READY_TIMEOUT_MS,validStartReadiness} from '../multiplayer/start-readiness';

test('every original driver must finish loading before countdown release',()=>{
 for(const count of [1,8,24]){
  const ids=Array.from({length:count},(_,i)=>i),barrier=new StartReadiness('round-1',ids);
  for(const id of ids.slice(0,-1))assert.equal(barrier.acknowledge(id,'round-1'),true);
  assert.equal(barrier.waiting,true);assert.equal(barrier.acknowledge(ids[count-1],'round-1'),true);
  assert.equal(barrier.waiting,false);assert.deepEqual(barrier.snapshot().pending,[]);
 }
});
test('stale, foreign and duplicate acknowledgments never release another driver',()=>{
 const barrier=new StartReadiness('round-2',[0,2]);
 for(const [id,round]of [[0,'round-1'],[1,'round-2'],[24,'round-2'],[NaN,'round-2']]as const)assert.equal(barrier.acknowledge(id,round),false);
 assert.equal(barrier.acknowledge(0,'round-2'),true);assert.equal(barrier.acknowledge(0,'round-2'),false);
 assert.deepEqual(barrier.snapshot().pending,[2]);assert.equal(barrier.waiting,true);
});
test('bounded waiting releases stalled clients without restarting the timer',()=>{
 const barrier=new StartReadiness('round-3',[0,1]);barrier.acknowledge(0,'round-3');
 assert.equal(barrier.advance(START_READY_TIMEOUT_MS-1,new Set([0,1,2])),true);
 assert.equal(barrier.snapshot().remainingMs,1);
 const restored=StartReadiness.restore(JSON.parse(JSON.stringify(barrier.snapshot())));
 assert.equal(restored.advance(1,new Set([0,1,2])),false);
 assert.equal(restored.acknowledge(1,'round-3'),false);assert.deepEqual(restored.snapshot().pending,[]);
});
test('disconnects release seats and late arrivals cannot extend the barrier',()=>{
 const barrier=new StartReadiness('round-4',[0,1]);
 assert.equal(barrier.advance(0,new Set([0,2])),true);assert.deepEqual(barrier.snapshot().pending,[0]);
 assert.equal(barrier.acknowledge(2,'round-4'),false);
 assert.equal(barrier.advance(0,new Set([1,2])),false);
 assert.equal(barrier.advance(0,new Set([0,1,2])),false);
 assert.equal(new StartReadiness('empty',[]).waiting,false);
});
test('save/restore is defensive and never replenishes elapsed waiting time',()=>{
 const participants=[0,1],barrier=new StartReadiness('persisted',participants);participants.push(2);
 barrier.advance(4250,new Set([0,1]));barrier.acknowledge(1,'persisted');
 const saved=barrier.snapshot(),restored=StartReadiness.restore(saved);saved.pending.push(3);saved.remainingMs=30000;
 assert.deepEqual(restored.snapshot(),{round:'persisted',pending:[0],remainingMs:25750});
 const exposed=restored.snapshot();exposed.pending.length=0;assert.equal(restored.waiting,true);
 for(const invalid of [null,{}, {round:'x',pending:[0,0],remainingMs:1},{round:'x',pending:[24],remainingMs:1},{round:'x',pending:[-1],remainingMs:1},{round:'x',pending:[.5],remainingMs:1},{round:'',pending:[],remainingMs:1},{round:'a'.repeat(65),pending:[],remainingMs:1},{round:'x',pending:[],remainingMs:NaN},{round:'x',pending:[],remainingMs:Infinity},{round:'x',pending:[],remainingMs:30001},{round:'x',pending:[],remainingMs:-1}]){
  assert.equal(validStartReadiness(invalid),false);assert.throws(()=>StartReadiness.restore(invalid));
 }
 for(const dt of [-1,NaN,Infinity])assert.throws(()=>restored.advance(dt,new Set([0])));
});
