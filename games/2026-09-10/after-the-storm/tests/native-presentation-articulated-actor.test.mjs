import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationArticulatedActor as prepare} from '../native-presentation-articulated-actor.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationArticulatedActorUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-articulated-actor.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,animationsByIndex:structuredClone(evidence.animationsByIndex)};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q,start){const buffers=Array.from({length:6},()=>{const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));return b;});for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){const b=buffers[o.matrixIndex-start];if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return buffers.map(b=>Array.from({length:16},(_,i)=>b.readUInt32BE(i*4)));}

test('five-part actors match both whole original draws, including all animation resets and retained matrices',()=>{
 assert.equal(evidence.cases.length,672);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'operations case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  assert.deepEqual(applied(q,a.actorWordsF060[count]),c.matrixWords,'matrices case '+i);assert.deepEqual(a,before);
 }
});

test('animation resets use the previously selected descriptor and preserve different submitted-frame rules',()=>{
 for(const drawType of [5,6])for(const submitted of [0,1]){
  const a=input(evidence.cases[0]),base=a.actorIndex*47;a.drawType=drawType;a.activity624=-1;
  a.actorWordsF060[base]=drawType;a.actorWordsF060[base+1]=0;a.actorWordsF060[base+0x74/4]=1;
  a.actorWordsF060[base+0x78/4]=4;a.actorWordsF060[base+0xb8/4]=submitted;
  const q=prepare(a),advances=drawType===5||submitted===0;
  assert.equal(q.actorWordsF060[base+0x74/4],advances?0:1);assert.equal(q.diagnostic.animationIndex,1);
  assert.equal(q.diagnostic.frameCount,5);assert.equal(q.diagnostic.frame,advances?0:4);
 }
});

test('missing late track cannot commit animation reset or partial allocation',()=>{
 const a=input(evidence.cases[0]),base=a.actorIndex*47;a.drawType=5;a.activity624=-1;a.actorWordsF060[base+0x74/4]=1;a.actorWordsF060[base+0x78/4]=4;
 delete a.animationsByIndex[1].tracks[8];const before=structuredClone(a);
 assert.throws(()=>prepare(a),/frame key/);assert.deepEqual(a,before);
});

test('canonical articulated drawing consumes retained selectors and course rules without caller overrides',()=>{
 for(const drawType of [5,6]){
  const c=evidence.cases.find(c=>c.input.drawType===drawType&&c.input.bufferIndex===1&&c.input.resourceIndex===3&&c.input.activity624===-1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:a.courseIndex,players:1,mode620:4}));
  state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;state.scene.activity624=-1;state.scene.championshipCountAa00=a.championshipCountAa00;
  state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsE73c[11]=drawType===5?0xbeef0003:(3<<16)|0xbeef;
  const before=structuredClone(state),q=update(state,{...a,drawType:0,resourceIndex:0,bufferIndex:0,activity624:0,courseIndex:11,championshipCountAa00:-32768,actorWordsF060:[],animationsByIndex:{},animationsByResourceIndex:{3:a.animationsByIndex}});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
  assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));assert.deepEqual(state,before);
  assert.throws(()=>update(state,{...a,animationsByResourceIndex:{0:a.animationsByIndex}}),/frame count/);assert.deepEqual(state,before);
 }
});
