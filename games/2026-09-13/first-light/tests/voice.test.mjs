import test from 'node:test';import assert from 'node:assert/strict';
import {RAY,PRIORITY,allClips,lineFile} from '../voice-lines.js';
import {createVoiceState,pickVariant,decide} from '../voice.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('every event Ray can say has at least three distinct short lines and a priority',()=>{
 const events=Object.keys(RAY);assert.ok(events.length>=24);
 for(const ev of events){const pool=RAY[ev];assert.ok(pool.length>=3,ev+' has '+pool.length);assert.equal(new Set(pool).size,pool.length,ev+' duplicates');for(const l of pool)assert.ok(l.length>3&&l.length<=60,ev+': '+l);assert.ok(PRIORITY[ev]>0,ev+' priority');}
 assert.equal(allClips().length,events.reduce((n,e)=>n+RAY[e].length,0));assert.equal(lineFile('bite',0),'assets/voice/bite-1.mp3');
});
test('no line repeats back to back, and the pick is uniform enough',()=>{
 const r=rng(3);const pool=RAY.hooked;let last=-1;const seen=new Array(pool.length).fill(0);
 for(let i=0;i<400;i++){const n=pickVariant(pool,last,r);assert.notEqual(n,last);assert.ok(n>=0&&n<pool.length);seen[n]++;last=n;}
 for(const c of seen)assert.ok(c>50,'variant used: '+seen);
 assert.equal(pickVariant(['only'],0,r),0);assert.equal(pickVariant([],-1,r),-1);
});
test('one line at a time: a lower priority waits, a higher one interrupts, and chatter is rate-limited',()=>{
 const s=createVoiceState();
 const a=decide(s,'bite',10);assert.ok(a&&a.event==='bite');
 assert.equal(decide(s,'slack',10.5),null,'slack outranked by a bite still playing');
 const b=decide(s,'hooked',11);assert.ok(b,'a hookup interrupts');
 assert.equal(decide(s,'bite',11.5),null,'bite inside its own gap and outranked');
 const c=decide(s,'landed_trophy',11.8);assert.ok(c&&c.priority>b.priority);
 assert.equal(decide(s,'nothing_like_this',20),null);
 const s2=createVoiceState();assert.ok(decide(s2,'slack',0));assert.equal(decide(s2,'slack',3),null,'slack waits six seconds');assert.ok(decide(s2,'slack',6.5));
 const s3=createVoiceState();const first=decide(s3,'hooked',0);const second=decide(s3,'hooked',5);assert.notEqual(first.n,second.n,'no immediate repeat of the same line');
});
