import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationEffectInputs as prepare} from '../native-presentation-effects.js';
import {structuredEffectBodies} from './helpers/native-effect-body-fields.mjs';
import {prepareNativeSprayPhysicalInputs} from '../native-spray-levels.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationEffectInputsUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-effect-inputs.json.gz',import.meta.url))));
const off=a=>(a-0x790)/4,b=new DataView(new ArrayBuffer(4));
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
function input(c){
 const pool=[...evidence.baseEffectWords],actors=[...evidence.baseActorWords],body=Array(1478).fill(0);
 for(const [i,w]of c.input.effectOverrides)pool[i]=w;for(const [i,w]of c.input.actorOverrides)actors[i]=w;for(const [i,w]of c.input.bodyOverrides)body[i]=w;
 const bodies=[];bodies[c.input.racerIndex]=body;let q=0;
 return {...c.input,effectWords0790:pool,actorWordsF060:actors,bodyWordsBySlot:bodies,queryNative:()=>c.input.waterValues[q++]};
}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}

test('all physical and extra-actor wake inputs match original ordered writes, query boundaries and retained effect hashes',()=>{
 assert.equal(evidence.cases.length,160);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone({...a,queryNative:undefined}),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.effectWords0790),c.effectSHA256,'case '+i);
  assert.deepEqual(q.diagnostic.queries,c.queries,'case '+i);assert.deepEqual(q.diagnostic.queryOffsets,c.queryOffsets,'case '+i);
  assert.deepEqual(prepare(structuredEffectBodies(input(c))),q,'structured source fields case '+i);
  assert.deepEqual({...a,queryNative:undefined},before);
 }
});
test('physical scalar audio consumers agree with the complete retained routine when querying the same source plane',()=>{
 for(const c of evidence.cases.filter(c=>c.input.racerCount===4)){
  const a=input(c),q=prepare({...a,queryNative:()=>7}),body=a.bodyWordsBySlot[a.racerIndex],vec=o=>Object.fromEntries(['x','y','z'].map((k,i)=>[k,number(body[(o+i*4)/4])]));
  const scalar=prepareNativeSprayPhysicalInputs({positionNative:vec(0x44),frameDisplacementNative:vec(0xb78),forwardNative:vec(0x6c),rightNative:vec(0x84),
   referenceVelocityNative:vec(0x1618),tickDisplacementNative:vec(0x50),floorImpactNative:number(body[0xc4c/4]),waterQueryNative:7,
   courseIndex:a.effectWords0790[off(0x7a14)]?0:3,alternate16cc:body[0x16cc/4]>>>16});
  for(const [key,address]of [['position',0x79bc],['velocity',0x79c8],['forward',0x79e0]])for(const [i,axis]of ['x','y','z'].entries())assert.equal(number(q.effectWords0790[off(address+i*4)]),scalar[key][axis]);
  for(const [key,address]of [['speed',0x79d4],['lateral',0x79d8],['referenceMotion',0x79dc],['water',0x7a00]])assert.equal(number(q.effectWords0790[off(address)]),scalar[key]);
 }
});
test('late failed water query preserves all caller storage and extra actors need no physical body input',()=>{
 const c=evidence.cases.find(c=>c.queries.length===2),a=input(c),before=structuredClone({...a,queryNative:undefined});let calls=0;
 assert.throws(()=>prepare({...a,queryNative:()=>++calls===1?100:NaN}),/Nonfinite/);assert.equal(calls,2);assert.deepEqual({...a,queryNative:undefined},before);
 const extra=evidence.cases.find(c=>c.input.racerCount===c.input.racerIndex),x=input(extra);delete x.bodyWordsBySlot;
 assert.equal(digest(prepare(x).effectWords0790),extra.effectSHA256);
});

test('canonical effect inputs own actual actor/effect storage and racer count without touching physics, scores or RNG',()=>{
 const c=evidence.cases.find(c=>c.input.racerCount===3&&c.input.racerIndex===3),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:3},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:1,mode620:4}));
 state.effectWords0790=a.effectWords0790;state.actorWordsF060=a.actorWordsF060;const before=structuredClone(state);
 const q=update(state,{...a,racerCount:4,effectWords0790:null,actorWordsF060:null,bodyWordsBySlot:null});
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.effects,[]);
 for(const key of ['raceWords1f94','hudWords7788','profileWordsB330','actorWordsF060','scene'])assert.deepEqual(q.state[key],state[key]);
 assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.effectWords0790));
 const first={kind:'presentationEffectWrite',byteOffset:0,width:4,value:1};
 for(const bad of [{byteOffset:1,width:4,value:1},{byteOffset:7415*4,width:4,value:1},{byteOffset:0,width:4,value:-1},{byteOffset:0,width:2,value:1}]){
  assert.throws(()=>commit(state,[first,{kind:'presentationEffectWrite',...bad}]));assert.deepEqual(state,before);
 }
});
