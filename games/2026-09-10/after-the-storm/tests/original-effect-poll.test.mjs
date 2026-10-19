import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createOriginalEffectPoll,originalEffectPitch,originalEffectSpatial} from '../original-effect-poll.js';
const cmd=(consumer,lane,n,v=80)=>({consumer,arguments:[lane,n,v]});

test('expanded dolphin IO writes use last note and velocity, with spatial controls before its shared contact layer',()=>{
 const p=createOriginalEffectPoll(),raw=(port,value)=>({consumer:'c53d4',arguments:[port,value]});
 const gain={consumer:'c538c',arguments:[0x01000500,0x3f000000]},pan=raw(0x03000500,32);
 p.submit(raw(0x06000505,127));p.submit(raw(0x06000500,8));p.submit(raw(0x06000500,9));
 p.submit(cmd('c0044',5,1));p.submit(gain);p.submit(pan);p.submit(raw(0x06000505,80));
 assert.deepEqual(p.poll(),[gain,pan,cmd('bffec',5,9,80)]);
 assert.deepEqual(p.poll(),[cmd('c0044',5,1)]);assert.deepEqual(p.poll(),[]);
 p.submit(raw(0x06000500,10));p.submit(cmd('bffec',5,11,61));assert.deepEqual(p.poll(),[cmd('bffec',5,11,61)]);
 p.submit(raw(0x06000500,10));assert.deepEqual(p.poll(),[cmd('bffec',5,10,61)]);
 p.submit(gain);p.submit(raw(0x06000500,8));p.clear();assert.deepEqual(p.poll(),[]);
 for(const c of [raw(0x03000500,128),raw(0x03000500,-1),raw(0x03000400,64),{consumer:'c538c',arguments:[0x01000500,0x7fc00000]},
  {consumer:'c538c',arguments:[0x01000500,0xbf800000]},{consumer:'c538c',arguments:[0x01000500,0x40000000]}]){
  assert.equal(originalEffectSpatial(c),null);assert.equal(p.submit(c),false);
 }
});
test('source IO latches retain the latest write, prioritize contact, and defer spray independently for each human',()=>{
 const p=createOriginalEffectPoll(),water=cmd('c0044',2,1),latest=cmd('c0044',2,9,61),hit=cmd('bffec',2,11),impact=cmd('bffec',2,53);
 for(const c of [water,hit,latest,impact])assert.equal(p.submit(c),true);
 const right=cmd('c0044',5,17,90);p.submit(right);
 assert.deepEqual(p.poll(),[impact,right]);assert.deepEqual(p.poll(),[latest]);assert.deepEqual(p.poll(),[]);
 p.submit(water);water.arguments[1]=99;assert.equal(p.snapshot()[0].spray.arguments[1],1);
 const copy=p.snapshot();copy[0].spray.arguments[1]=55;assert.equal(p.snapshot()[0].spray.arguments[1],1);
 for(let i=0;i<10000;i++)p.submit(cmd('c0044',2,i%4*4+1));
 assert.equal(p.poll().length,1,'suspended presentation cannot build an IO backlog');
 p.submit(latest);p.clear();assert.deepEqual(p.poll(),[]);
});
test('retained channel pitch is applied before either note layer, with unrelated engine controls excluded',()=>{
 const p=createOriginalEffectPoll(),pitch={consumer:'c538c',arguments:[0x04000200,0x3fc00000]},hit=cmd('bffec',2,11);
 assert.deepEqual(originalEffectPitch(pitch),{lane:2,rate:1.5});p.submit(hit);p.submit(pitch);
 assert.deepEqual(p.poll(),[pitch,hit]);assert.deepEqual(p.poll(),[]);
 for(const a of [[0x04000000,0x3f800000],[0x01000000,0x3f800000],[0x04000500,0x7fc00000],[0x04000500,0xbf800000]]){
  const c={consumer:'c538c',arguments:a};assert.equal(originalEffectPitch(c),null);assert.equal(p.submit(c),false);
 }
});

test('192 original rider dispatch executions resolve the solo/versus ports and all16 samples',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-rider-voice-reference.json',import.meta.url)));
 assert.equal(fixture.cases.length,192);
 for(const c of fixture.cases){
  const p=createOriginalEffectPoll(),command={consumer:'c317c',arguments:[c.channel,c.note]};
  assert.equal(p.submit(command,c.raceMode),c.channel<2);
  assert.deepEqual(p.poll(),c.expected.filter(x=>x.arguments[0]>>>24===6));
 }
});

test('rider IO0 takes priority over IO1 while P2 always gets its own layer; pause clears all ports',()=>{
 const p=createOriginalEffectPoll(),submit=(player,note,mode)=>p.submit({consumer:'c317c',arguments:[player,note]},mode);
 submit(0,1,1);submit(0,4,0);submit(1,9,1);submit(1,15,1);
 const notes=p.poll();assert.deepEqual(notes.map(c=>c.arguments),[[0x06000a00,4],[0x06000a02,15]]);
 assert.deepEqual(p.poll().map(c=>c.arguments),[[0x06000a01,1]]);assert.deepEqual(p.poll(),[]);
 submit(0,3,1);const copy=p.riderSnapshot();copy[1].arguments[1]=99;assert.equal(p.riderSnapshot()[1].arguments[1],3);
 p.clear();assert.deepEqual(p.poll(),[]);assert.deepEqual(p.riderSnapshot(),[null,null,null]);
});
