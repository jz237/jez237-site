import test from 'node:test';import assert from 'node:assert/strict';
import {CombatScoreboard,eventDerbyOrder} from '../src/event-rules';
import {DERBY_FORMATS,readDerbyFormat,derbyEndReason,derbyRecordPrefix,derbyWreckStatus} from '../src/derby-policy';
test('legacy options retain their scoring and respawn semantics',()=>{
 assert.equal(readDerbyFormat(undefined),'survival');assert.equal(readDerbyFormat('score'),'score');assert.equal(readDerbyFormat('score-no-respawn'),'score-no-respawn');assert.equal(readDerbyFormat('invalid'),'survival');
 assert.deepEqual(Object.values(DERBY_FORMATS).map(x=>[x.scored,x.respawns]),[[false,false],[true,true],[true,false]]);
});
test('wrecked top scorer wins score elimination rather than the last survivor',()=>{
 const board=new CombatScoreboard(),cars=[{id:0,health:0,inflicted:100},{id:1,health:10,inflicted:0},{id:2,health:0,inflicted:90}];
 board.hit(0,2,100,0,10);board.hit(2,0,100,10,11);board.hit(1,0,10,0,12);
 assert.equal(eventDerbyOrder(cars,DERBY_FORMATS['score-no-respawn'].scored,board)[0].id,0);
 assert.equal(eventDerbyOrder(cars,false,board)[0].id,1);
 assert.equal(derbyEndReason('score-no-respawn',cars,12,300),'elimination');
 assert.equal(derbyEndReason('score',cars,12,300),null);
});
test('time, simultaneous destruction and surviving opponents finish predictably',()=>{
 const field=[{health:0},{health:60},{health:70}];
 assert.equal(derbyEndReason('score-no-respawn',field,29,30),null);
 assert.equal(derbyEndReason('score-no-respawn',field,30,30),'time');
 assert.equal(derbyEndReason('score-no-respawn',[{health:0},{health:0}],20,30),'elimination');
 assert.equal(derbyEndReason('score-no-respawn',[],20,30),null);
 assert.equal(derbyEndReason('score-no-respawn',field,NaN,30),null);
});
test('record categories and wreck messaging keep respawning modes separate',()=>{
 assert.notEqual(derbyRecordPrefix('score'),derbyRecordPrefix('score-no-respawn'));
 assert.equal(derbyRecordPrefix('score'),'score-derby-v2');
 assert.equal(derbyWreckStatus('score-no-respawn',14,10),'WRECKED · WATCHING REMAINING DRIVERS');
 assert.equal(derbyWreckStatus('score',14,10),'WRECKED · RESPAWN IN 4s');
});

import {readEventOptions,DEFAULT_EVENT} from '../src/event-rules';
import {readDemoOptions,DEFAULT_DEMO} from '../src/demo-session';
import {validOnlineEventRules,DEFAULT_ONLINE_EVENT} from '../src/online-events';
import {stockSetup} from '../src/garage';
import {encodeReplay,decodeReplay,REPLAY_STRIDE,type ReplayDocument} from '../src/replay-data';
import {defaultReplayName} from '../src/replay-library';
test('solo and demo saves retain all three derby choices through reload',()=>{
 for(const derby of ['survival','score','score-no-respawn'] as const){
  const event={...DEFAULT_EVENT,derby};assert.deepEqual(readEventOptions(JSON.stringify(event)),event);
  const demo={...DEFAULT_DEMO,derby};assert.deepEqual(readDemoOptions(JSON.stringify(demo)),demo);
 }
 assert.equal(readEventOptions().derby,'survival');assert.equal(readDemoOptions().derby,undefined);
 assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,derby:'invalid'})).derby,'survival');
 assert.equal(readDemoOptions(JSON.stringify({...DEFAULT_DEMO,derby:'invalid'})).derby,undefined);
 assert.equal(validOnlineEventRules({...DEFAULT_ONLINE_EVENT,derby:'score-no-respawn'}),true,'network schema supports the explicitly negotiated variant');
 assert.equal(validOnlineEventRules({...DEFAULT_ONLINE_EVENT,derby:'score'}),true);
});
const replay=():ReplayDocument=>{
 const values=new Float32Array(REPLAY_STRIDE);values[6]=1;values[14]=100;for(let j=0;j<4;j++)values[15+j*8+6]=1;
 return {meta:{version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-15'},frames:[{time:0,values}],events:[],limited:false};
};
test('replay format preserves derby identity without altering legacy files',()=>{
 const legacy=replay();assert.deepEqual(decodeReplay(encodeReplay(legacy)),legacy);
 const doc=replay();doc.meta.derbyFormat='score-no-respawn';const loaded=decodeReplay(encodeReplay(doc));assert.deepEqual(loaded,doc);
 assert.match(defaultReplayName(loaded),/Score derby · no respawns/);
 for(const derbyFormat of ['invalid','toString','__proto__'])assert.throws(()=>decodeReplay(encodeReplay({...doc,meta:{...doc.meta,derbyFormat} as any})));
 assert.throws(()=>decodeReplay(encodeReplay({...doc,meta:{...doc.meta,mode:'race'}})));
});
