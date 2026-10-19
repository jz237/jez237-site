import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeMenuCameraUpdate as prepare} from '../native-menu-camera-update.js';
import {createNativeRaceState,prepareNativeMenuCameraFrameUpdate,prepareNativeRaceStateOperations} from '../native-race-state.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-menu-camera-update.json',import.meta.url)));
for(const c of source.cases){c.input.hudWords7788=[...source.baseHudWords7788];for(const [i,w]of c.hudPatches)c.input.hudWords7788[i]=w;}
const digest=words=>{const bytes=Buffer.alloc(words.length*4);words.forEach((w,i)=>bytes.writeUInt32BE(w,i*4));return createHash('sha256').update(bytes).digest('hex');};
const hi=a=>(a-0x7788)/4;
test('canonical camera adapter retains unrelated owners and cannot be overridden by caller views',()=>{
 for(const {input,hudSha256,cameraEnvironmentBytesEaa4}of source.cases){
  const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0x34567890),hudWords7788:input.hudWords7788,
   cameraEnvironmentBytesEaa4:input.cameraEnvironmentBytesEaa4,scene:{main638:9,players:input.players}}),before=structuredClone(state);
  const q=prepareNativeMenuCameraFrameUpdate(state,{...input,players:8,main638:21,hudWords7788:[],cameraEnvironmentBytesEaa4:[]});
  assert.equal(digest(q.state.hudWords7788),hudSha256);assert.deepEqual(q.state.cameraEnvironmentBytesEaa4,cameraEnvironmentBytesEaa4);
  assert.deepEqual(q.state.raceWords1f94,before.raceWords1f94);assert.deepEqual(q.state.scene,before.scene);assert.deepEqual(state,before);
  assert.ok(q.effects.every(o=>o.kind==='cameraMatrixRequest'));assert.equal(q.effects.length,input.players);
  assert.throws(()=>prepareNativeRaceStateOperations(state,[{kind:'cameraEnvironmentWrite',byteOffset:0,width:1,value:0},
   {kind:'cameraEnvironmentWrite',byteOffset:1,width:4,value:0}]),/width/);assert.deepEqual(state,before);
 }
});
test('main9 camera frames match full original execution across rates, buffers and consecutive frames',()=>{
 assert.equal(source.caseCount,80);
 for(const c of source.cases){
  const before=structuredClone(c.input),q=prepare(c.input);
  assert.deepEqual(q.operations,c.operations,`variant${c.variant}/frame${c.frame}`);
  assert.equal(digest(q.hudWords7788),c.hudSha256);
  assert.deepEqual(q.cameraEnvironmentBytesEaa4,c.cameraEnvironmentBytesEaa4);
  assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.hudWords7788));
 }
});
test('selected environment byte and active graphics buffer preserve the other camera',()=>{
 const c=source.cases.find(c=>c.input.players===1&&c.variant===3&&c.input.bufferIndex===1),q=prepare(c.input);
 assert.deepEqual(q.cameraEnvironmentBytesEaa4,[197,0]);
 assert.deepEqual(q.operations.filter(o=>o.kind==='cameraMatrixRequest'),[{kind:'cameraMatrixRequest',bufferIndex:1,cameraIndex:0}]);
 assert.deepEqual(q.hudWords7788.slice(hi(0x7d8c),hi(0x7e98)),c.input.hudWords7788.slice(hi(0x7d8c),hi(0x7e98)));
});
test('unsupported modes and invalid later cameras cannot partly change retained inputs',()=>{
 const base=source.cases.find(c=>c.input.players===2).input;
 for(const main638 of [0,1,21])assert.throws(()=>prepare({...base,main638}),/main638/);
 assert.throws(()=>prepare({...base,bufferIndex:undefined}),/bufferIndex/);
 for(const offset of [0x7d8c,0x7f78]){
  const input=structuredClone(base);input.hudWords7788[hi(offset)]=2;
  const before=structuredClone(input);assert.throws(()=>prepare(input),/type1/);assert.deepEqual(input,before);
 }
 const input=structuredClone(base);input.hudWords7788[hi(0x7f78+0x78)]=0x7fc00000;
 const before=structuredClone(input);assert.throws(()=>prepare(input),/Nonfinite/);assert.deepEqual(input,before);
});
