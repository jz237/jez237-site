import test from 'node:test';
import assert from 'node:assert/strict';
import {createOriginalEffectPoll,originalEffectPitch} from '../original-effect-poll.js';
const cmd=(consumer,lane,n,v=80)=>({consumer,arguments:[lane,n,v]});
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
 for(const a of [[0x04000000,0x3f800000],[0x01000200,0x3f800000],[0x04000500,0x7fc00000],[0x04000500,0xbf800000]]){
  const c={consumer:'c538c',arguments:a};assert.equal(originalEffectPitch(c),null);assert.equal(p.submit(c),false);
 }
});
