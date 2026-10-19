import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeTransientDisplay as prepare} from '../native-transient-display.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeTransientDisplayUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-transient-display.json.gz',import.meta.url))));
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {...structuredClone(c.input),effectWords0790};}
const hash=b=>createHash('sha256').update(b).digest('hex'),off=a=>(a-0x790)/4;
function graphics(operations){
 const buffers=[0,1].map(()=>Buffer.from(evidence.baseGraphicsBytes));
 for(const o of operations)if(o.kind==='presentationSceneMatrixWrite')buffers[o.bufferIndex].writeUInt16BE(o.value,0x4140+o.matrixIndex*64+o.byteOffset);
 return buffers;
}

test('whole original transient display matches matrix stores, allocator order and verified semantic draw commands',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'operations case '+i);assert.deepEqual(graphics(q.operations).map(hash),c.graphicsSHA256,'graphics case '+i);
  assert.equal(q.matrixCountE950,c.matrixCountE950);assert.equal(q.diagnostic.nativeCommandBytes,c.commandBytes);assert.deepEqual(a,before);
 }
});

test('coincident camera retains the facing matrix but still binds it, advances allocation and writes scale',()=>{
 const c=evidence.cases.find(c=>c.operations.filter(o=>o.kind==='presentationTransientDraw').length===8),a=input(c),q=prepare(a);
 assert.deepEqual(q.diagnostic.incompleteSlots,[1,5]);
 for(const slot of [1,5]){
  const matrixIndex=a.matrixCountE950+slot*2;
  assert.equal(q.operations.some(o=>o.kind==='presentationSceneMatrixWrite'&&o.matrixIndex===matrixIndex),false);
  assert.ok(q.operations.some(o=>o.kind==='presentationSceneMatrixBind'&&o.matrixIndex===matrixIndex&&o.mode==='load'));
  assert.equal(q.operations.filter(o=>o.kind==='presentationSceneMatrixWrite'&&o.matrixIndex===matrixIndex+1).length,32);
 }
 assert.deepEqual(q.operations.filter(o=>o.kind==='presentationTransientDraw').map(o=>o.textureFrame),[0,0,1,2,3,4,5,6]);
});

test('empty effects avoid camera records and allocation writes; late packing and capacity failures are atomic',()=>{
 const empty=input(evidence.cases.find(c=>c.commandBytes===32));delete empty.hudWords7788;empty.matrixCountE950=0x7fffffff;
 const q=prepare(empty);assert.deepEqual(q.operations,[{kind:'presentationTransientMaterial',rgba:[120,18,254,255]}]);assert.equal(q.matrixCountE950,empty.matrixCountE950);
 const a=input(evidence.cases.find(c=>c.commandBytes===672));a.effectWords0790[off(0x7a18+7*24+20)]=0x7f7fffff;const before=structuredClone(a);
 assert.throws(()=>prepare(a),/matrix/);assert.deepEqual(a,before);
 const capacity=input(evidence.cases.find(c=>c.commandBytes===672));capacity.matrixCountE950=450;const retained=structuredClone(capacity);
 assert.throws(()=>prepare(capacity),/buffer offset|binding offset/);assert.deepEqual(capacity,retained);
});

test('canonical display updates only the shared matrix allocator and returns validated renderer requests',()=>{
 const c=evidence.cases.find(c=>c.commandBytes===672),a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4}));
 for(const k of ['effectWords0790','effectControlWords6d60','hudWords7788'])state[k]=a[k];
 for(const k of ['fieldAb2c','displayCamera3930','displayCamera3934','matrixCountE950'])state.scene[k]=a[k];state.scene.graphicsPointerE948=(0x80198368+a.bufferIndex*0xb2f0)|0;state.graphicsCorners.renderBufferIndex=a.bufferIndex^1;
 const before=structuredClone(state),q=update(state);assert.equal(q.state.scene.matrixCountE950,c.matrixCountE950);
 assert.deepEqual({...q.state,scene:state.scene},state);assert.deepEqual({...q.state.scene,matrixCountE950:a.matrixCountE950},state.scene);
 assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='sourceWordWrite'));assert.deepEqual(graphics(q.effects).map(hash),c.graphicsSHA256);assert.deepEqual(state,before);
 for(const bad of [
  {kind:'presentationSceneMatrixWrite',bufferIndex:0,matrixIndex:0,byteOffset:1,width:2,value:0},
  {kind:'presentationSceneMatrixBind',bufferIndex:0,matrixIndex:454,mode:'load'},
  {kind:'presentationSceneMatrixBind',bufferIndex:0,matrixIndex:0,mode:'unknown'},
  {kind:'presentationTransientMaterial',rgba:[0,0,256,255]},
  {kind:'presentationTransientDraw',slot:0,textureFrame:7}
 ]){assert.throws(()=>commit(state,[{kind:'sourceWordWrite',field:'matrixCountE950',value:12},bad]));assert.deepEqual(state,before);}
});
