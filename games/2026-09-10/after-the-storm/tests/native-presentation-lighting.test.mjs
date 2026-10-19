import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativePresentationLighting as prepare} from '../native-presentation-lighting.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationLightingUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-lighting.json.gz',import.meta.url))));
function input(c){const courseDisplayWordsB058=[...evidence.baseDisplayWords];for(const [i,w]of c.input.displayOverrides)courseDisplayWordsB058[i]=w;return {...c.input,courseDisplayWordsB058};}
function applied(q){const buffers=[[...evidence.baseLightBytes],[...evidence.baseLightBytes]];for(const o of q.operations)if(o.kind==='presentationLightByteWrite')buffers[o.bufferIndex][o.lightIndex*48+o.viewIndex*24+o.byteOffset]=o.value;return buffers;}

test('whole lighting and fog setup matches original ordered byte writes, course branches and integer coefficients',()=>{
 assert.equal(evidence.cases.length,252);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.deepEqual(applied(q),c.lightBuffers,'retained bytes case '+i);assert.deepEqual(a,before);
 }
});

test('lighting retains padding and selects distinct directional lights for ordinary and special courses',()=>{
 const a=input(evidence.cases[0]);
 for(const [courseIndex,active,expected]of [[0,0,[[1,8],[1,0]]],[6,0,[[0,8],[1,0]]],[6,1,[[0,8],[1,8],[1,0]]]]){
  const q=prepare({...a,courseIndex,aiLightActive78:active}),buffers=applied(q);
  assert.deepEqual(q.operations.filter(o=>o.kind==='presentationLightBind').map(o=>[o.lightIndex,o.byteOffset]),expected);
  for(let light=0;light<2;light++)for(let v=0;v<2;v++)for(let i=20;i<24;i++)assert.equal(buffers[a.bufferIndex][light*48+v*24+i],evidence.baseLightBytes[light*48+v*24+i]);
 }
});

test('fog traps and invalid late direction data cannot change caller display data',()=>{
 const a=input(evidence.cases[0]),base=a.viewIndex*68;
 a.courseDisplayWordsB058[base+0x78/4]=100;a.courseDisplayWordsB058[base+0x7c/4]=100;let before=structuredClone(a);
 assert.throws(()=>prepare(a),/division/);assert.deepEqual(a,before);
 a.courseDisplayWordsB058[base+0x78/4]=0x8001f4;a.courseDisplayWordsB058[base+0x7c/4]=0x8001f3;before=structuredClone(a);
 assert.throws(()=>prepare(a),/division/);assert.deepEqual(a,before);
 a.courseDisplayWordsB058[base+0x104/4]=0x7fc00000;before=structuredClone(a);assert.throws(()=>prepare(a),/direction/);assert.deepEqual(a,before);
});

test('canonical lighting uses retained display-view selector, active buffer and AI context',()=>{
 for(const courseIndex of [0,6])for(const viewIndex of [0,1]){
  const c=evidence.cases.find(c=>c.input.courseIndex===courseIndex&&c.input.viewIndex===viewIndex&&c.input.bufferIndex===1&&c.input.aiLightActive78===1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex,players:1,mode620:4}));
  state.courseDisplayWordsB058=a.courseDisplayWordsB058;state.graphicsCorners.renderBufferIndex=1;state.scene.fieldAb2c=viewIndex;state.scene.displayCamera3930=viewIndex^1;
  state.scene.aiContextPointer3c58=0xdeadbeef|0;state.aiWords3c60[(viewIndex*0xe8+0x78)/4]=1;
  const before=structuredClone(state),q=update(state,{bufferIndex:0,viewIndex:viewIndex^1,courseIndex:7,aiLightActive78:0});
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='sourceWordWrite'));
  assert.equal(q.state.scene.aiContextPointer3c58>>>0,c.aiPointer);assert.deepEqual(q.state.aiWords3c60,state.aiWords3c60);assert.deepEqual(state,before);
  const invalid=[{...q.effects[0],value:256},{...q.effects[0],byteOffset:24},{kind:'presentationLightCount',count:3},{kind:'presentationFogColor',rgba:[0,0,0,256]},{kind:'presentationFogFactors',packedWord:-1}];
  for(const op of invalid)assert.throws(()=>commit(state,[...q.operations,op]));assert.deepEqual(state,before);
 }
});
