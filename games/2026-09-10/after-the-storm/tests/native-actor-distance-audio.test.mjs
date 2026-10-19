import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeActorDistanceAudio as prepare,prepareNativeActorSplashAudio as splash} from '../native-actor-distance-audio.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-actor-distance-audio.json.gz',import.meta.url))));
test('complete distance audio matches original latch, gain, pan and pitch command order',()=>{
 assert.equal(e.cases.length,441);assert.equal(e.instructions,18382);
 for(const [i,c]of e.cases.entries()){
  const before=structuredClone(c.input),q=prepare(c.input);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(q.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.operations));
 }
});

test('splash cues match original audibility gates, attenuation and signed pan bytes',()=>{
 const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-actor-splash-audio.json.gz',import.meta.url))));
 assert.equal(evidence.cases.length,162);assert.equal(evidence.instructions,2430);
 for(const [i,c]of evidence.cases.entries()){
  const before=structuredClone(c.input),q=splash(c.input);assert.deepEqual(q.operations,c.operations,'splash case '+i);assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.operations));
 }
 assert.deepEqual(splash({audioMode:0}).operations,[]);assert.deepEqual(splash({audioMode:7,distanceNative:128}).operations,[]);
 assert.throws(()=>splash({audioMode:7,distanceNative:127}),/pan word/);
});
test('inactive latch stops without reading audio context and active paths validate only consumed fields',()=>{
 assert.equal(prepare({audioScene7c9c:0}).operations.length,3);
 const single={audioScene7c9c:5,distanceNative:50,pitchInput:0,audioContext:{raceMode:0,rivalGate7de8:0}},q=prepare(single);
 assert.deepEqual(q.operations[0],q.operations[1]);
 assert.equal(prepare({...single,audioContext:{raceMode:1,flags7dec:[1,0]}}).operations[0].arguments[1],32);
 const before=structuredClone(single);assert.throws(()=>prepare({...single,pitchInput:undefined}),/pitch input/);assert.deepEqual(single,before);
});
