import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeBodyBoundaryDrift as prepare,nativeBodyBoundaryDriftView as view} from '../native-body-boundary-drift.js';
import {prepareNativeWaterSceneSetup} from '../native-water-scene-initialization.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-body-boundary-drift.json.gz',import.meta.url))));
const bits=v=>{const b=Buffer.alloc(4);b.writeFloatBE(v);return b.readUInt32BE();};

test('world-wrap drift matches original prefix stores for all slots and both boundary branches',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const before=structuredClone(c.input),q=prepare(c.input);assert.deepEqual(q.bodyWordWrites,c.bodyWordWrites,'case '+i);
  assert.deepEqual([bits(q.driftNative.x),bits(q.driftNative.z)],c.bodyWordWrites.map(w=>w.value));assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.bodyWordWrites[0]));
 }
});

test('water view uses its six actual fields, preserves strict edges and signed zero',()=>{
 const state={setupWords:Object.fromEntries([10,-10,-0,20,-20,41].map((v,i)=>[0x8c+i*4,bits(v)])),raceWords1f94:Array(1693).fill(0x7fc00000)},before=structuredClone(state);
 assert.deepEqual(view(state,{x:-10,z:20}).driftNative,{x:0,z:0});assert.equal(bits(view(state,{x:-11,z:0}).driftNative.x),0x80000000);assert.equal(bits(view(state,{x:11,z:0}).driftNative.x),0);
 assert.deepEqual(view(state,{x:0,z:21}).driftNative,{x:0,z:-41});assert.deepEqual(state,before);
});

test('missing or invalid actual fields cannot manufacture neutral boundary corrections',()=>{
 const input=structuredClone(evidence.cases[0].input),before=structuredClone(input);
 assert.throws(()=>prepare({...input,boundsWords24ac:input.boundsWords24ac.slice(0,5)}),/six/);
 for(const bad of [NaN,Infinity,1e100])assert.throws(()=>prepare({...input,positionNativeXZ:{x:0,z:bad}}),/body4c/);
 for(const bad of [-1,0x100000000,0x7fc00000]){const a=[...input.boundsWords24ac];a[5]=bad;assert.throws(()=>prepare({...input,boundsWords24ac:a}));}
 assert.throws(()=>view({raceWords1f94:Array(1693).fill(0)},input.positionNativeXZ),/water setup/);assert.deepEqual(input,before);
});

test('original water initialization provides the actual wrapping periods independently of race records',()=>{
 for(const variant of [0,1,2]){
  const scene=prepareNativeWaterSceneSetup({variant,players:1,datumNative:0,amplitudeNative:20});
  assert.deepEqual(view(scene,{x:0,z:0}).driftNative,{x:0,z:0});
  assert.equal(view(scene,{x:-24577,z:0}).driftNative.x,49152);assert.equal(view(scene,{x:24576,z:0}).driftNative.x,-49152);
 }
});
