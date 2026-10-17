import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialNativeHullWetState,completeNativeHullWetState} from '../native-hull-wet-state.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {nativeHullAudioPrefix} from '../native-contact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-hull-wet-state-reference.json',import.meta.url)));

test('every twelve-point wet mask and both preceding flags match original completion instructions',()=>{
 for(const c of reference.cases){
  const flags=Array.from({length:12},(_,i)=>(0xa5a50000|(i<<1)|((c.mask>>>i)&1))>>>0);
  assert.deepEqual(completeNativeHullWetState(c.previous,flags),c.expected,`${c.mask}/${c.previous}`);
 }
 for(const c of reference.extra)assert.deepEqual(completeNativeHullWetState(c.previous,c.flags),c.expected);
});
test('startup aggregates and the first inactive completion preserve the original distinct phases',()=>{
 const a=createNativeRaceAdapter({sourceState:{simulationState:0}});
 assert.deepEqual(a.wetState,{wetCountC78:8,wetFlagC7c:1,landingC7e:0,takeoffC80:0,previousWetFlagC82:1});
 assert.deepEqual(a.water.wet,Array(12).fill(false));
 stepNativeRaceAdapter(a,.04,{});assert.equal(a.wetState.wetCountC78,8);
 stepNativeRaceAdapter(a,.01,{});
 assert.deepEqual(a.wetState,{wetCountC78:0,wetFlagC7c:0,landingC7e:0,takeoffC80:1,previousWetFlagC82:1});
 assert.equal(a.water.anyWet,false);assert.equal(a.water.wetCount,0);
 stepNativeRaceAdapter(a,.05,{});assert.equal(a.wetState.takeoffC80,0);
});
test('live completed frames separate count from flag and emit one landing edge per dry-to-wet transition',()=>{
 const a=createNativeRaceAdapter({sourceState:{simulationState:0}});stepNativeRaceAdapter(a,.05,{});
 a.water.wet[0]=a.water.wet[2]=true;
 stepNativeRaceAdapter(a,.05,{});
 assert.deepEqual(a.wetState,{wetCountC78:2,wetFlagC7c:1,landingC7e:1,takeoffC80:0,previousWetFlagC82:0});
 assert.equal(a.lastFrame.wetCount,2);assert.equal(a.lastFrame.anyWet,true);
 const input=()=>({frameSpeedNative:0,record2c8:0,bodyBfc:0,verticalFrameB7c:0,
  bodyC78:a.wetState.wetCountC78,wetFlagC7c:a.wetState.wetFlagC7c,landingC7e:a.wetState.landingC7e});
 assert.equal(nativeHullAudioPrefix(input())[3],20);
 const snapshot=nativeRaceSnapshot(a);assert.ok(Object.isFrozen(snapshot.source.wetState));
 stepNativeRaceAdapter(a,.05,{});
 assert.equal(a.wetState.landingC7e,0);assert.equal(nativeHullAudioPrefix(input())[3],1);
 assert.equal(snapshot.source.wetState.landingC7e,1);
 a.water.wet.fill(false);stepNativeRaceAdapter(a,.05,{});assert.equal(a.wetState.takeoffC80,1);
});
test('wet-state validation preserves inputs and rejects missing point flags',()=>{
 const flags=Array(12).fill(1),before=flags.slice(),state=completeNativeHullWetState(0,flags);
 assert.deepEqual(flags,before);assert.ok(Object.isFrozen(state));assert.notEqual(initialNativeHullWetState(),initialNativeHullWetState());
 for(const v of [-1,65536,.5,NaN])assert.throws(()=>completeNativeHullWetState(v,flags));
 for(const p of [Array(11).fill(0),Array(12).fill(true),Array(12).fill(-1),Array(12).fill(0x100000000)])
  assert.throws(()=>completeNativeHullWetState(1,p));
});
