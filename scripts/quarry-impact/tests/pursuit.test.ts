import test from 'node:test';import assert from 'node:assert/strict';
import {PursuitSession,soloPursuitRules,validPursuitRules,validPursuitSnapshot} from '../src/pursuit';
import {PursuitTargeting,type PursuitPosition} from '../src/pursuit-targeting';
const alive=(id:number)=>({id,health:100,finished:false,finishTime:0});
const pos=(id:number,x:number,z=0):PursuitPosition=>({id,x,z,vx:10,vz:0,health:100});
test('solo assigns exactly the human runner, validates the field and freezes its own rules',()=>{
 const rules=soloPursuitRules([0,1,2],1,60),s=new PursuitSession(rules);rules.members[1].role='chaser';assert.equal(s.role(1),'runner');assert.equal(s.role(0),'chaser');
 for(const ids of [[1],[1,1],[0,2],Array.from({length:25},(_,i)=>i)])assert.throws(()=>soloPursuitRules(ids,1));
 assert.equal(validPursuitRules({...rules,duration:NaN}),false);
});
test('runner must finish alive; catching and escaping are terminal and cannot be undone by recovery',()=>{
 const s=new PursuitSession(soloPursuitRules([0,1],0,60));s.update([alive(0),{...alive(1),finished:true,finishTime:3}],3);assert.equal(s.complete,false);
 s.update([{...alive(0),finished:true,finishTime:20}],20);assert.equal(s.winner,'runners');s.update([{...alive(0),health:0}],22);assert.equal(s.result(0)?.outcome,'escaped');
 const caught=new PursuitSession(soloPursuitRules([0,1],0,60));caught.update([{...alive(0),health:0,finished:true,finishTime:10}],10);assert.equal(caught.winner,'chasers');caught.update([alive(0)],12);assert.equal(caught.result(0)?.outcome,'caught');
});
test('deadline, missing cars and exhausted pursuers do not invent an escape or premature capture',()=>{
 const s=new PursuitSession(soloPursuitRules([0,1],0,60));s.update([{...alive(1),health:0}],12);assert.equal(s.complete,false);s.update([],61);assert.equal(s.winner,'chasers');assert.equal(s.elapsed,60);
 const crossing=new PursuitSession(soloPursuitRules([0,1],0,60));crossing.update([{...alive(0),finished:true,finishTime:59.9}],60.01);assert.equal(crossing.winner,'runners');
 assert.throws(()=>crossing.update([],NaN));
});
test('team outcomes wait for all runners and round-trip without sharing mutable state',()=>{
 const s=new PursuitSession({version:1,duration:60,members:[{id:0,role:'runner'},{id:1,role:'runner'},{id:2,role:'chaser'}]});
 s.update([{...alive(0),finished:true,finishTime:10},alive(1)],10);assert.equal(s.winner,null);
 const snapshot=s.snapshot();assert.ok(validPursuitSnapshot(snapshot));const restored=PursuitSession.restore(snapshot);snapshot.results[0].outcome='caught';assert.equal(restored.result(0)?.outcome,'escaped');
 restored.update([{...alive(1),health:0}],20);assert.equal(restored.winner,'runners');assert.throws(()=>restored.update([],19));
 for(const corrupt of [{...snapshot,results:[]},{...snapshot,elapsed:-1},{...snapshot,results:[snapshot.results[0],snapshot.results[0]]}])assert.equal(validPursuitSnapshot(corrupt),false);
});
test('pursuers never target teammates, hold a runner briefly, and lead nearby clear-corridor attacks',()=>{
 const s=new PursuitSession({version:1,duration:60,members:[{id:0,role:'runner'},{id:1,role:'runner'},{id:2,role:'chaser'},{id:3,role:'chaser'}]}),ai=new PursuitTargeting(),car=pos(2,0),a=pos(0,15),b=pos(1,20),friend=pos(3,1);
 assert.equal(ai.intent(s,a,[a,b,car],0,()=>true).kind,'escape');let intent=ai.intent(s,car,[friend,b,a,car],0,()=>true);assert.equal(intent.target,0);assert.equal(intent.kind,'intercept');assert.ok(intent.point!.x>a.x);
 b.x=2;assert.equal(ai.intent(s,car,[a,b,friend],.5,()=>true).target,0);assert.equal(ai.intent(s,car,[a,b,friend],2,()=>true).target,1);
 s.update([{...alive(1),health:0},alive(0)],2);assert.equal(ai.intent(s,car,[a,b,friend],2.1,()=>true).target,0);
 assert.equal(ai.intent(s,car,[a,b,friend],2.2,()=>false).kind,'route');a.x=100;assert.equal(ai.intent(s,car,[a,b,friend],2.3,()=>true).kind,'route');
 s.update([{...alive(0),health:0}],3);assert.equal(ai.intent(s,car,[a,b,friend],3,()=>true).kind,'stop');
});
