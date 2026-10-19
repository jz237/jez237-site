import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationWingAnimation as prepare} from '../native-presentation-wing-animation.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationWingAnimationUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-wing-animation.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,animation:structuredClone(evidence.animation)};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q,start){const buffers=Array.from({length:8},()=>{const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));return b;});for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){const b=buffers[o.matrixIndex-start];if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return buffers.map(b=>Array.from({length:16},(_,i)=>b.readUInt32BE(i*4)));}

test('seven-part bird draw matches whole original execution, ordered effects and all retained matrices',()=>{
 assert.equal(evidence.cases.length,448);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'operations case '+i);
  assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  assert.deepEqual(applied(q,a.actorWordsF060[count]),c.matrixWords,'matrices case '+i);
  assert.equal(q.actorWordsF060[count],a.actorWordsF060[count]+8);assert.deepEqual(a,before);
 }
});

test('bird frame advance includes submitted actors and preserves signed wrap and inactive holds',()=>{
 for(const submitted of [0,1])for(const activity of [-1,0]){
  const a=input(evidence.cases[0]),base=a.actorIndex*47;
  a.actorWordsF060[base+0xb8/4]=submitted;a.actorWordsF060[base+0x78/4]=0x7fffffff;a.activity624=activity;
  const q=prepare(a);assert.equal(q.actorWordsF060[base+0x78/4],activity===-1?(-3>>>0):0x7fffffff);
  assert.equal(q.diagnostic.frame,activity===-1?-3:2);
 }
});

test('late missing track data and matrix exhaustion leave the original pool untouched',()=>{
 const a=input(evidence.cases[0]);delete a.animation.tracks[8];let before=structuredClone(a);
 assert.throws(()=>prepare(a),/frame key/);assert.deepEqual(a,before);
 const b=input(evidence.cases[0]);b.actorWordsF060[count]=185;before=structuredClone(b);
 assert.throws(()=>prepare(b),/allocation/);assert.deepEqual(b,before);
});

test('canonical bird draw selects retained resource, activity and buffer and validates semantic effects atomically',()=>{
 for(const drawType of [1,3]){
 const c=evidence.cases.find(c=>c.input.drawType===drawType&&c.input.bufferIndex===1&&c.input.resourceIndex===3&&c.input.activity624===-1),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
 state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;state.scene.activity624=-1;
 state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsE73c[14]=(3<<16)|0xbeef;state.resourceWordsE73c[12]=0xbeef0003;const before=structuredClone(state);
 const q=update(state,{...a,drawType:0,actorWordsF060:[],bufferIndex:0,activity624:0,resourceIndex:0,animation:{},animationResourcesByIndex:{3:a.animation}});
 assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
 assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));
 assert.deepEqual(q.state.resourceWordsE73c,state.resourceWordsE73c);assert.deepEqual(q.state.scene,state.scene);assert.deepEqual(state,before);
 assert.throws(()=>update(state,{...a,animationResourcesByIndex:{0:a.animation}}),/frame count/);
 for(const [kind,patches]of [
  ['presentationActorMaterial',[{preset:'unknown'}]],
  ['presentationActorPartDraw',[{bufferIndex:2},{actorIndex:30},{resourceIndex:-1},{partOffset:4}]],
  ['presentationActorPartBind',[{matrixIndex:192},{parentMatrixIndex:192},{actorIndex:30}]],
  ['presentationActorMatrixPop',[{bufferIndex:2}]]
 ]){
  const valid=q.effects.find(o=>o.kind===kind);
  for(const patch of patches)assert.throws(()=>commit(state,[q.operations[0],{...valid,...patch}]));
 }
 assert.deepEqual(state,before);
 }
});
