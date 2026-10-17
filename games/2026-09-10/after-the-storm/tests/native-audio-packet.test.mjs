import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeHullAudioPacket,prepareNativeAudioLateralMotion} from '../native-audio-packet.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-audio-packet-reference.json',import.meta.url)));

test('81 original lateral-motion executions preserve the singular-frame retained value',()=>{
 for(const c of reference.lateralCases)assert.equal(prepareNativeAudioLateralMotion(c.previous,c.input),c.expected);
 const input={velocity50Native:{x:4,z:3},right84Native:{x:1,y:0,z:0}};
 assert.equal(prepareNativeAudioLateralMotion(9,input),4);
 assert.equal(prepareNativeAudioLateralMotion(9,{...input,right84Native:{x:0,y:1,z:0}}),9);
 assert.throws(()=>prepareNativeAudioLateralMotion(NaN,input));
});

test('complete audio packet matches150 original52480 executions and the actual water-query arguments',()=>{
 for(const c of reference.cases){
  const original=structuredClone(c.input),previous=[...c.previous];
  assert.deepEqual(prepareNativeHullAudioPacket(c.input,c.previous),c.expected);
  assert.deepEqual(c.input,original);assert.deepEqual(c.previous,previous);
 }
});

test('producer preserves consumer cooldowns, prior speed and unacknowledged events across real successive packets',()=>{
 const c=structuredClone(reference.cases[0].input),old=Array.from({length:32},(_,i)=>i*7);
 Object.assign(c,{actorC54:7,animationC58:58,body1608:0});
 const first=prepareNativeHullAudioPacket(c,old).packet;assert.equal(first[28],1);
 c.animationC58=59;const second=prepareNativeHullAudioPacket(c,first).packet;
 assert.equal(second[28],1);
 for(const i of [5,6,7,8,9,10,11,12,13,22,23,26,29,30,31])assert.equal(second[i],old[i]);
 second[28]=0;assert.equal(prepareNativeHullAudioPacket(c,second).packet[28],0);
});

test('exact actor-frame gates and rider-water edge remain separate from hull wet state',()=>{
 const c=structuredClone(reference.cases[0].input),p=Array(32).fill(0);
 Object.assign(c,{body1608:0,bodyC84:0,bodyC86:1,wetFlagC7c:0,landingC7e:0});
 for(const [actor,frame,mode,event]of [[7,55,2,0],[7,56,0,0],[7,58,0,1],[7,59,0,0],[23,0,2,0],[24,0,1,0],[22,0,0,0]]){
  const r=prepareNativeHullAudioPacket({...c,actorC54:actor,animationC58:frame},p).packet;
  assert.equal(r[21],mode);assert.equal(r[28],event);assert.equal(r[24],1);assert.equal(r[3],0);
 }
 assert.equal(prepareNativeHullAudioPacket({...c,bodyC86:65535},p).packet[24],0);
 assert.equal(prepareNativeHullAudioPacket({...c,bodyC84:1},p).packet[24],0);
 assert.equal(prepareNativeHullAudioPacket({...c,body1608:1,actorC54:22},p).packet[21],2);
});

test('missing source fields or invalid retained storage reject instead of inventing state',()=>{
 const c=reference.cases[0].input,p=Array(32).fill(0);
 for(const k of ['buttonsB56','actorC54','animationC58','bodyC84','bodyC86','body1608','record12c','place4','riderB68','rider1c5c','rider1c60','waterQueryNative','point90Native'])
  assert.throws(()=>prepareNativeHullAudioPacket({...c,[k]:undefined},p));
 assert.throws(()=>prepareNativeHullAudioPacket(c,p.slice(1)));
 assert.throws(()=>prepareNativeHullAudioPacket(c,[256,...p.slice(1)]));
 assert.throws(()=>prepareNativeHullAudioPacket({...c,pointD0Native:{x:Infinity,y:0,z:0}},p));
});
