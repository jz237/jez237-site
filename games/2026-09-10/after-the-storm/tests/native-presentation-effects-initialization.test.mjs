import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationEffectsInitialization as prepare} from '../native-presentation-effects-initialization.js';
import {structuredEffectBodies} from './helpers/native-effect-body-fields.mjs';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationEffectsInitializationUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-effects-initialization.json.gz',import.meta.url))));
function input(c){return {...c.input,effectWords0790:[...evidence.baseEffectWords],actorWordsF060:[...evidence.actorWordsF060],bodyWordsBySlot:structuredClone(evidence.bodyWordsBySlot),queryNative:()=>c.input.waterValue};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return hash(b);}
const hash=b=>createHash('sha256').update(b).digest('hex');
function graphics(ops){const buffers=[0,1].map(()=>Buffer.from(evidence.baseGraphicsBytes));for(const o of ops)if(o.kind==='presentationEffectVertexWrite'){const b=buffers[o.bufferIndex];if(o.width===1)b.writeUInt8(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return buffers;}

test('complete scene effect initializer matches original stores, course branches, queries and both retained graphics buffers',()=>{
 assert.equal(evidence.cases.length,48);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone({...a,queryNative:undefined}),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.effectWords0790),c.effectSHA256,'case '+i);
  assert.deepEqual(prepare(structuredEffectBodies(input(c))),q,'structured physical fields case '+i);
  assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.seed6f00,c.seed6f00);
  assert.deepEqual(q.diagnostic.queries,c.queries);assert.deepEqual(q.diagnostic.queryOffsets,c.queryOffsets);
  assert.deepEqual(graphics(q.operations).map(hash),c.graphicsSHA256);assert.deepEqual({...a,queryNative:undefined},before);
 }
});
test('Dolphin adds only its available extra actor, retains untouched entries and seeds a separate16-bit random stream',()=>{
 for(const c of evidence.cases){const a=input(c),q=prepare(a);assert.equal(q.diagnostic.effectCount,Math.min(4,c.input.racerCount+Number(c.input.courseIndex===0)));
  assert.equal(q.seed6f00,c.input.clockLow32&65535);assert.equal(q.operations.filter(o=>o.kind==='sourceHalfwordWrite').length,1);
  assert.ok(q.operations.every(o=>o.field!=='rngState4640'));
  if(q.diagnostic.effectCount<4){const at=(0x798+q.diagnostic.effectCount*0x1c74-0x790)/4;assert.deepEqual(q.effectWords0790.slice(at,at+0x1c74/4),a.effectWords0790.slice(at,at+0x1c74/4));}
 }
 const q=prepare(input(evidence.cases[0])),buffers=graphics(q.operations);
 for(const b of buffers){for(const p of [0x51c0,0x81c0]){assert.equal(b[p+15],evidence.baseGraphicsBytes[p+15]);assert.deepEqual(b.subarray(p,p+6),Buffer.from(evidence.baseGraphicsBytes.slice(p,p+6)));}assert.equal(b[0x8dc0+15],255);}
});
test('late invalid physical input cannot commit earlier resets, clock seed, water results or graphics requests',()=>{
 const a=input(evidence.cases.find(c=>c.input.courseIndex===1&&c.input.racerCount===4));a.bodyWordsBySlot[3][0xb78/4]=0x7fc00000;
 const before=structuredClone({...a,queryNative:undefined});assert.throws(()=>prepare(a),/Nonfinite/);assert.deepEqual({...a,queryNative:undefined},before);
 assert.throws(()=>prepare({...input(evidence.cases[0]),clockLow32:-1}),/clock/);
});

test('canonical initialization consumes retained course, participants and controls and returns validated vertex effects',()=>{
 for(const courseIndex of [0,3]){
  const c=evidence.cases.find(c=>c.input.courseIndex===courseIndex&&c.input.racerCount===2),a=input(c),state=structuredClone(createNativeRaceMemory({racers:Array.from({length:2},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex,players:1,mode620:4}));
  state.effectWords0790=a.effectWords0790;state.effectControlWords6d60=a.effectControlWords6d60;state.actorWordsF060=a.actorWordsF060;state.scene.seed6f00=123;
  const before=structuredClone(state),q=update(state,{...a,effectWords0790:null,effectControlWords6d60:null,actorWordsF060:null,courseIndex:11,racerCount:4});
  assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.state.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.state.scene.seed6f00,c.seed6f00);
  assert.deepEqual(update(state,structuredEffectBodies(a)),q,'canonical structured initialization');
  assert.deepEqual(graphics(q.effects).map(hash),c.graphicsSHA256);assert.ok(q.effects.every(o=>o.kind==='presentationEffectVertexWrite'));
  assert.equal(q.state.scene.rngState4640,state.scene.rngState4640);for(const key of ['raceWords1f94','hudWords7788','profileWordsB330','actorWordsF060'])assert.deepEqual(q.state[key],state[key]);assert.deepEqual(state,before);
  for(const bad of [{bufferIndex:2,byteOffset:0,width:2,value:1},{bufferIndex:0,byteOffset:0xb2f0,width:2,value:1},{bufferIndex:0,byteOffset:1,width:2,value:1},{bufferIndex:0,byteOffset:0,width:1,value:256}]){
   assert.throws(()=>commit(state,[{kind:'presentationEffectControlWrite',byteOffset:0,width:4,value:1},{kind:'presentationEffectVertexWrite',...bad}]));assert.deepEqual(state,before);
  }
 }
});
