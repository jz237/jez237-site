import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeIceActorAudio as prepare} from '../native-ice-actor-audio.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-ice-actor-audio.json.gz',import.meta.url))));
function setup(c){const actorWordsF060=[...e.baseActorWords],hudWords7788=[...e.baseHudWords];for(const [i,w]of c.input.actorOverrides??[])actorWordsF060[i]=w;for(const [i,w]of c.input.hudOverrides??[])hudWords7788[i]=w;return {...c.input,actorWordsF060,hudWords7788};}
test('ice actor audio controls and full nearest scan match all original stores and commands',()=>{
 assert.equal(e.cases.length,438);assert.equal(e.instructions,16597);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(q.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(input,before);assert.ok(Object.isFrozen(q.operations));
 }
});
test('distance stop ordering retains both original requests and ignores unused data',()=>{
 const c=e.cases.find(c=>c.input.entry==='800a5c74'&&c.operations.length===6),input=setup(c),q=prepare(input);
 assert.equal(q.operations.filter(o=>o.kind==='sourceWordWrite').length,2);
 assert.deepEqual(q.operations.slice(0,3),q.operations.slice(3));
 assert.equal(prepare({entry:'800c1e0c',audioScene7c9c:0}).operations.length,3);
 assert.deepEqual(prepare({entry:'800c1da8',audioScene7c9c:5,audioMode:0}).operations,[]);
 const noActors=setup(e.cases.find(c=>c.input.entry==='800a5c74'&&c.input.actorOverrides.filter(([i,w])=>i%47===0&&i<30*47&&w===1).length===0));
 assert.equal(prepare({...noActors,hudWords7788:null}).operations.length,6);
});
test('selected camera validation cannot partially alter the caller or shared latch',()=>{
 const c=e.cases.find(c=>c.input.entry==='800a5c74'&&c.operations.some(o=>o.consumer==='800c538c')),input=setup(c),before=structuredClone(input);
 assert.throws(()=>prepare({...input,hudWords7788:null}),/actual ice actor camera/);assert.deepEqual(input,before);
});
