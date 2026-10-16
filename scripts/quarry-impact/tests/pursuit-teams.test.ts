import test from 'node:test';import assert from 'node:assert/strict';
import {teamPursuitRules,pursuitGridOrder,pursuitTeamWon,pursuitRecordSuffix,pursuitTeamTitle} from '../src/pursuit-teams';
import {PursuitSession,soloPursuitRules} from '../src/pursuit';
import {readEventOptions,DEFAULT_EVENT} from '../src/event-rules';
import {PursuitTargeting} from '../src/pursuit-targeting';
const alive=(id:number)=>({id,health:100,finished:false,finishTime:0});
test('every supported field can play either team, with runners leading a unique grid',()=>{
 for(let field=2;field<=24;field++)for(const role of ['runner','chaser']as const)for(let count=1;count<field;count++){
  const ids=Array.from({length:field},(_,i)=>i),rules=teamPursuitRules(ids,0,role,count),s=new PursuitSession(rules),order=pursuitGridOrder(rules);
  assert.equal(s.role(0),role);assert.equal(rules.members.filter(m=>m.role==='runner').length,count);
  assert.deepEqual([...order].sort((a,b)=>a-b),ids);assert.ok(order.slice(0,count).every(id=>s.role(id)==='runner'));
 }
 assert.deepEqual(teamPursuitRules([0,1,2],0),soloPursuitRules([0,1,2],0));
 for(const ids of [[0],[0,0],[1,2]])assert.throws(()=>teamPursuitRules(ids,0));
});
test('saved team setup clamps count to field without altering legacy defaults',()=>{
 assert.deepEqual(readEventOptions(),DEFAULT_EVENT);
 for(const count of [0,-4,NaN,Infinity,100,1,4]){
  const c=readEventOptions(JSON.stringify({...DEFAULT_EVENT,field:4,pursuit:true,pursuitRole:'chaser',pursuitRunners:count}));
  assert.equal(c.pursuitRole,'chaser');assert.ok(c.pursuitRunners!>=1&&c.pursuitRunners!<4);assert.deepEqual(readEventOptions(JSON.stringify(c)),c);
 }
 assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,pursuitRole:'bogus'})).pursuitRole,undefined);
});
test('a player chaser targets opposing runners; terminal runners drop out and team awards use the player role',()=>{
 const s=new PursuitSession(teamPursuitRules([0,1,2,3],0,'chaser',2,60)),ai=new PursuitTargeting();
 const cars=[0,1,2,3].map(id=>({...alive(id),x:0,z:id*10,vx:0,vz:0}));
 assert.equal(ai.intent(s,cars[0],cars,0,()=>true).target,1);
 s.update([{...alive(1),finished:true,finishTime:10},alive(2)],10);
 assert.equal(s.complete,false);assert.equal(ai.intent(s,cars[0],cars,12,()=>true).target,2);
 s.update([{...alive(2),health:0}],20);
 assert.equal(pursuitTeamWon(s,0),false);assert.equal(pursuitTeamWon(s,2),true);
 assert.match(pursuitTeamTitle(s,0),/TEAM DEFEAT/);assert.equal(pursuitRecordSuffix(s,0),':chaser:2');
 const caught=new PursuitSession(teamPursuitRules([0,1,2],0,'chaser',2,60));caught.update([alive(1),alive(2)],60);
 assert.equal(pursuitTeamWon(caught,0),true);assert.match(pursuitTeamTitle(caught,0),/TEAM VICTORY/);
 assert.equal(pursuitRecordSuffix(new PursuitSession(soloPursuitRules([0,1],0)),0),'');
});
