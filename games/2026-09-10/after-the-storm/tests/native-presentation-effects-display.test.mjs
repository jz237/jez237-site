import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationEffectsDisplay as prepare} from '../native-presentation-effects-display.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationEffectsDisplayUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-effects-display.json.gz',import.meta.url))));
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {...structuredClone(c.input),effectWords0790};}
const hash=b=>createHash('sha256').update(b).digest('hex');
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return hash(b);}

test('whole original effect display matches all semantic command groups and ordered retained stores',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a),mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  assert.equal(mismatch,-1,JSON.stringify({case:i,index:mismatch,actual:q.operations[mismatch],expected:c.operations[mismatch]}));assert.equal(q.operations.length,c.operations.length,'operation count case '+i);
  assert.equal(digest(q.effectWords0790),c.effectSHA256);assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.matrixCountE950,c.matrixCountE950);assert.equal(q.graphicsPointerE94c,c.graphicsPointerE94c);
  assert.deepEqual(q.diagnostic.clockOffsets,c.clockOffsets);assert.equal(q.diagnostic.nativeCommandBytes,c.nativeCommandBytes);
  const buffers=[0,1].map(()=>Buffer.from(evidence.baseGraphicsBytes));for(const o of q.operations)if(o.kind==='presentationSceneMatrixWrite')buffers[o.bufferIndex].writeUInt16BE(o.value,0x4140+o.matrixIndex*64+o.byteOffset);
  assert.deepEqual(buffers.map(b=>hash(b.subarray(0x4140))),c.matrixRegionSHA256);assert.deepEqual(a,before);
 }
});

test('shared droplets preserve every five-triangle batch and its remainder in draw order',()=>{
 for(const c of evidence.cases.slice(108)){
  const a=input(c),q=prepare(a),ops=q.operations.slice(q.operations.findIndex(o=>o.kind==='presentationEffectTexture'&&o.family==='droplet')+1),expected=a.effectWords0790[(0x798+0x1c24-0x790)/4];
  const vertices=ops.filter(o=>o.kind==='presentationEffectVertices'),triangles=ops.filter(o=>o.kind==='presentationEffectPrimitive');
  assert.equal(triangles.length,expected);assert.equal(vertices.reduce((n,o)=>n+o.vertexCount,0),expected*3);
  for(const [i,o]of vertices.entries()){assert.equal(o.byteOffset,0x81c0+i*240);assert.equal(o.vertexCount,Math.min(5,expected-i*5)*3);}
 }
});

test('late invalid particle counts and exhausted display prefix cannot expose partial owner updates',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.input.effectOverrides.some(([i,w])=>i===0&&w===4)&&c.nativeCommandBytes>3000),a=input(c);
 a.effectWords0790[(0x798+a.primaryHumanIndex*0x1c74+0x1c24-0x790)/4]=65;const before=structuredClone(a);
 assert.throws(()=>prepare(a),/shared triangle count/);assert.deepEqual(a,before);
 const full=input(c);full.graphicsPointerE94c=0x80198368+full.bufferIndex*0xb2f0+0x3800;const retained=structuredClone(full);
 assert.throws(()=>prepare(full),/prefix capacity/);assert.deepEqual(full,retained);
});

test('canonical display consumes actual pointer and camera owners, leaving physics, RNG and particle ages intact',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.nativeCommandBytes>3000),a=input(c),state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:1,mode620:4}));
 for(const k of ['effectWords0790','effectControlWords6d60','hudWords7788'])state[k]=a[k];
 for(const k of ['fieldAb2c','main638','primaryHumanIndex','displayCamera3930','displayCamera3934','matrixCountE950'])state.scene[k]=a[k];
 state.scene.graphicsPointerE948=(0x80198368+a.bufferIndex*0xb2f0)|0;state.scene.graphicsPointerE94c=a.graphicsPointerE94c|0;state.scene.ambientD4b00=a.frameCounter;state.graphicsCorners.renderBufferIndex=a.bufferIndex^1;
 const before=structuredClone(state),q=update(state,{...a,bufferIndex:a.bufferIndex^1,effectWords0790:null,effectControlWords6d60:null,hudWords7788:null,main638:0,players:2,matrixCountE950:0,graphicsPointerE94c:0});
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.state.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.state.scene.matrixCountE950,c.matrixCountE950);assert.equal(q.state.scene.graphicsPointerE94c>>>0,c.graphicsPointerE94c);
 assert.deepEqual({...q.state.scene,matrixCountE950:state.scene.matrixCountE950,graphicsPointerE94c:state.scene.graphicsPointerE94c},state.scene);
 for(const k of Object.keys(state))if(!['effectWords0790','effectControlWords6d60','scene'].includes(k))assert.deepEqual(q.state[k],state[k]);
 assert.deepEqual(q.state.effectWords0790.slice(0,(0x7b38-0x790)/4),state.effectWords0790.slice(0,(0x7b38-0x790)/4));assert.deepEqual(state,before);
 assert.deepEqual(q.effects,q.operations.filter(o=>!['presentationEffectWrite','presentationEffectControlWrite','sourceWordWrite'].includes(o.kind)));
 for(const bad of [
  {kind:'presentationEffectListBegin',bufferIndex:0,byteOffset:1},{kind:'presentationEffectPipeline',mode:'unknown'},
  {kind:'presentationEffectTexture',family:'splash',textureFrame:7},{kind:'presentationEffectVertices',bufferIndex:0,byteOffset:0,vertexCount:17},
  {kind:'presentationEffectPrimitive',indices:[0,1,16]}
 ]){assert.throws(()=>commit(state,[{kind:'sourceWordWrite',field:'matrixCountE950',value:1},bad]));assert.deepEqual(state,before);}
});
