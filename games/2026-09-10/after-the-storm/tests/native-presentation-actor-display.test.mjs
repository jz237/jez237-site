import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationActorDisplay as prepare} from '../native-presentation-actor-display.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationActorDisplayUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-display.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,hudWords7788:[...evidence.baseHudWords],courseDisplayWordsB058:[...evidence.baseDisplayWords],resourceWordsE73c:[...evidence.resourceWordsE73c],animationsByResourceIndex:Object.fromEntries(Array.from({length:8},(_,i)=>[i,structuredClone(evidence.animationsByIndex)]))};}
const digest=b=>createHash('sha256').update(b).digest('hex');
function wordBytes(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return b;}
function applied(q){const matrices=Array.from({length:2},()=>wordBytes(Array.from({length:192},()=>evidence.baseMatrixWords).flat())),lights=Array.from({length:2},()=>[...evidence.baseLightBytes]);for(const o of q.operations){if(o.kind==='presentationActorMatrixWrite'){const b=matrices[o.bufferIndex],at=o.matrixIndex*64+o.byteOffset;if(o.width===4)b.writeUInt32BE(o.value,at);else b.writeUInt16BE(o.value,at);}else if(o.kind==='presentationLightByteWrite')lights[o.bufferIndex][o.lightIndex*48+o.viewIndex*24+o.byteOffset]=o.value;}return {matrixSHA256:matrices.map(digest),lightBuffers:lights};}

test('whole actor display matches original lighting, bounds, capacity, visibility, every draw and retirement',()=>{
 assert.equal(evidence.cases.length,96);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'operations case '+i);
  assert.equal(digest(wordBytes(q.actorWordsF060)),c.actorSHA256,'pool case '+i);assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4,'control case '+i);
  assert.deepEqual(applied(q),{matrixSHA256:c.matrixSHA256,lightBuffers:c.lightBuffers},'graphics case '+i);assert.deepEqual(a,before);
 }
});

test('capacity is checked before culling and retirement still runs after an early exit',()=>{
 const a=input(evidence.cases.find(c=>c.input.scenario===2)),q=prepare(a);
 assert.equal(q.diagnostic.stoppedAt,23);assert.equal(q.diagnostic.matricesUsed,184);assert.equal(q.diagnostic.drawn.length,23);
 assert.equal(q.actorControlWords62c4[2],a.actorControlWords62c4[1]);
 for(let i=a.actorControlWords62c4[1];i<30;i++)assert.equal(q.actorWordsF060[i*47],0);
 const zero=input(evidence.cases.find(c=>c.input.scenario===3));delete zero.resourceWordsE73c;delete zero.animationsByResourceIndex;
 const empty=prepare(zero);assert.equal(empty.diagnostic.drawn.length,0);assert.equal(empty.actorWordsF060[count],0);
});

test('canonical display derives every retained selector and commits late retirement with earlier animation and lighting',()=>{
 for(const courseIndex of [0,6]){
  const c=evidence.cases.find(c=>c.input.scenario===0&&c.input.courseIndex===courseIndex&&c.input.bufferIndex===1&&c.input.viewIndex===1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex,players:1,mode620:4}));
  state.actorWordsF060=a.actorWordsF060;state.actorControlWords62c4=a.actorControlWords62c4;state.hudWords7788=a.hudWords7788;state.courseDisplayWordsB058=a.courseDisplayWordsB058;state.resourceWordsE73c=a.resourceWordsE73c;
  state.graphicsCorners.renderBufferIndex=a.bufferIndex;Object.assign(state.scene,{fieldAb2c:a.viewIndex,displayCamera3930:a.cameraIndex,activity624:a.activity624,championshipCountAa00:20,actorDisplayPhase62c0:a.actorDisplayPhase62c0});
  state.aiWords3c60[(a.viewIndex*0xe8+0x78)/4]=a.aiLightActive78;const before=structuredClone(state);
  const q=update(state,{...a,bufferIndex:0,viewIndex:0,cameraIndex:a.cameraIndex^1,courseIndex:11,activity624:0,actorDisplayPhase62c0:77,actorWordsF060:[],actorControlWords62c4:[],resourceWordsE73c:[],hudWords7788:[],courseDisplayWordsB058:[]});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(wordBytes(q.state.actorWordsF060)),c.actorSHA256);assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);
  assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(state,before);
  const missing=structuredClone(a.animationsByResourceIndex);delete missing[7];
  assert.throws(()=>update(state,{animationsByResourceIndex:missing}),/frame count/);assert.deepEqual(state,before);
 }
});

test('fresh memory retains the original initial actor display phase',()=>{
 const state=createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4});assert.equal(state.scene.actorDisplayPhase62c0,0);
});
