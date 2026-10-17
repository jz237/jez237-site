import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRiderWaterAudio} from '../native-audio-packet.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-rider-water-audio-reference.json',import.meta.url)));

test('rider water edges match108 original executions, including strict equality and lazy actor gates',()=>{
 for(const c of reference.cases)assert.deepEqual(prepareNativeRiderWaterAudio(c.previous,c.input),c.expected);
});
test('rider immersion preserves prior wet state while unrelated actors clear current wet state',()=>{
 const input={actorC54:23,point6b4Native:{x:0,y:-1,z:0},waterQueryNative:0};
 const first=prepareNativeRiderWaterAudio(0,input),held=prepareNativeRiderWaterAudio(first.bodyC86,input);
 assert.deepEqual(first,{bodyC84:0,bodyC86:1});assert.deepEqual(held,{bodyC84:1,bodyC86:1});
 assert.deepEqual(prepareNativeRiderWaterAudio(held.bodyC86,{actorC54:7}),{bodyC84:1,bodyC86:0});
 assert.deepEqual(prepareNativeRiderWaterAudio(1,{...input,point6b4Native:{x:0,y:0,z:0}}),{bodyC84:1,bodyC86:0});
});
test('reached physical queries require actual finite source inputs',()=>{
 for(const actorC54 of [5,23]){
  assert.throws(()=>prepareNativeRiderWaterAudio(0,{actorC54}));
  assert.throws(()=>prepareNativeRiderWaterAudio(0,{actorC54,point6b4Native:{x:0,y:0,z:0},waterQueryNative:NaN}));
 }
 assert.throws(()=>prepareNativeRiderWaterAudio(-1,{actorC54:22}));
});
