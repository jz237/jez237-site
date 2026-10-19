import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationSpecialActor as prepare} from '../native-presentation-special-actor.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationSpecialActorUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-special-actor.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4,retained=(0x801d0678-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,animationsByIndex:structuredClone(evidence.animationsByIndex)};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q,start,n){const buffers=Array.from({length:n},()=>{const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));return b;});for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){const b=buffers[o.matrixIndex-start];if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return buffers.map(b=>Array.from({length:16},(_,i)=>b.readUInt32BE(i*4)));}

test('both special actor routines match original numeric writes and graphics-list order including surface transitions',()=>{
 assert.equal(evidence.cases.length,448);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'operations case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  assert.deepEqual(applied(q,a.actorWordsF060[count],a.drawType===12?1:7),c.matrixWords,'matrices case '+i);assert.deepEqual(a,before);
 }
});

test('type13 holds in-range frames and resets only active expired frames without advancing or changing animation',()=>{
 const a=input(evidence.cases.find(c=>c.input.drawType===13)),base=a.actorIndex*47;
 a.actorWordsF060[base+0x74/4]=1;
 for(const active of [-1,0])for(const frame of [-1,0,4,5,6]){
  a.activity624=active;a.actorWordsF060[base+0x78/4]=frame>>>0;
  const q=prepare(a),expected=active===-1&&frame>=5?0:frame;
  assert.equal(q.actorWordsF060[base+0x78/4],expected>>>0);assert.equal(q.actorWordsF060[base+0x74/4],1);
  const multiply=q.operations.find(o=>o.kind==='presentationActorRetainedMatrixMultiply');
  assert.deepEqual(multiply.matrixWords,a.actorWordsF060.slice(retained,retained+16));
  assert.equal(q.operations.at(-3).kind,'presentationActorRetainedMatrixMultiply');
  assert.equal(q.operations.at(-2).partOffset,16);assert.equal(q.operations.at(-1).kind,'presentationActorMatrixPop');
 }
});

test('canonical special draws retain actual matrix data and selectors and reject malformed effects atomically',()=>{
 for(const drawType of [12,13]){
  const c=evidence.cases.find(c=>c.input.drawType===drawType&&c.input.bufferIndex===1&&c.input.resourceIndex===3&&c.input.activity624===-1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
  state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;state.scene.activity624=-1;
  state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsE73c[drawType===12?14:15]=drawType===12?0xbeef0003:(3<<16)|0xbeef;
  const before=structuredClone(state),q=update(state,{...a,drawType:0,resourceIndex:0,bufferIndex:0,activity624:0,actorWordsF060:[],animationsByIndex:{},animationsByResourceIndex:{3:a.animationsByIndex}});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
  assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));assert.deepEqual(state,before);
  const surface=q.effects.find(o=>o.kind==='presentationActorSurface');assert.throws(()=>commit(state,[...q.operations,{...surface,preset:'unknown'}]));
  if(drawType===13){
   const multiply=q.effects.find(o=>o.kind==='presentationActorRetainedMatrixMultiply');
   for(const patch of [{matrixWords:[]},{matrixWords:Array(16).fill(-1)},{actorIndex:30},{bufferIndex:2}])assert.throws(()=>commit(state,[...q.operations,{...multiply,...patch}]));
   const missing=structuredClone(a.animationsByIndex);delete missing[q.diagnostic.animationIndex].tracks[16];
   assert.throws(()=>update(state,{...a,animationsByResourceIndex:{3:missing}}),/frame key/);
  }
  assert.deepEqual(state,before);
 }
});
