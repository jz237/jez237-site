import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationArticulatedActor as prepare} from '../native-presentation-articulated-actor.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationArticulatedActorUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-three-part-actor.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,animationsByIndex:structuredClone(evidence.animationsByIndex)};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q,start){const buffers=Array.from({length:4},()=>{const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));return b;});for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){const b=buffers[o.matrixIndex-start];if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return buffers.map(b=>Array.from({length:16},(_,i)=>b.readUInt32BE(i*4)));}

test('all four three-part draws match original execution, slot-dependent scales and alternate material',()=>{
 assert.equal(evidence.cases.length,448);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'operations case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  assert.deepEqual(applied(q,a.actorWordsF060[count]),c.matrixWords,'matrices case '+i);
  assert.equal(q.diagnostic.animationIndex,a.drawType===8?1:0);
  assert.equal(q.actorWordsF060[a.actorIndex*47+0x74/4],0x76543210);assert.deepEqual(a,before);
 }
});

test('canonical three-part draw uses type plus variant and the correct signed resource halfword',()=>{
 for(const drawType of [7,8,9,10]){
  const c=evidence.cases.find(c=>c.input.drawType===drawType&&c.input.bufferIndex===1&&c.input.resourceIndex===3&&c.input.activity624===-1&&input(c).actorWordsF060[c.input.actorIndex*47+1]===1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
  state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;state.scene.activity624=-1;
  state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsE73c[drawType===10?13:12]=(3<<16)|0xbeef;
  const before=structuredClone(state),q=update(state,{...a,drawType:0,resourceIndex:0,bufferIndex:0,activity624:0,actorWordsF060:[],animationsByIndex:{},animationsByResourceIndex:{3:a.animationsByIndex}});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
  assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));assert.deepEqual(state,before);
  const bad=structuredClone(state);bad.resourceWordsE73c[drawType===10?13:12]=0xffff0000;const saved=structuredClone(bad);
  assert.throws(()=>update(bad,{...a,animationsByResourceIndex:{[-1]:a.animationsByIndex}}),/resource index/);assert.deepEqual(bad,saved);
 }
});

test('three-part draw failure after earlier matrices preserves retained frame and allocation',()=>{
 const a=input(evidence.cases[0]);delete a.animationsByIndex[0].tracks[16];const before=structuredClone(a);
 assert.throws(()=>prepare(a),/frame key/);assert.deepEqual(a,before);
});
