import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationActorRootMatrix as prepare} from '../native-presentation-actor-transform.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationActorRootMatrixUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-transform.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q){const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return Array.from({length:16},(_,i)=>b.readUInt32BE(i*4));}

test('root actor matrices match complete original execution, ordered packed stores and allocation on both buffers',()=>{
 assert.equal(evidence.cases.length,720);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.deepEqual(applied(q),c.matrixWords,'matrix case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  if(q.diagnostic.matrixComplete)assert.deepEqual(q.matrixWords,c.matrixWords);
  else assert.equal(q.matrixWords,null);
  assert.deepEqual(a,before);
 }
});

test('degenerate submitted basis retains untouched matrix words but still binds and advances the original allocation counter',()=>{
 const c=evidence.cases.find(c=>c.operations.length===2),a=input(c),q=prepare(a);
 assert.equal(q.diagnostic.matrixComplete,false);assert.deepEqual(applied(q),evidence.baseMatrixWords);
 assert.equal(q.actorWordsF060[count],a.actorWordsF060[count]+1);
 const partial=evidence.cases.find(c=>c.operations.length>2&&c.operations.length<18),p=prepare(input(partial));
 assert.equal(p.diagnostic.matrixComplete,false);assert.equal(p.operations.filter(o=>o.kind==='presentationActorMatrixWrite').length,4);
 assert.deepEqual(applied(p),partial.matrixWords);
});

test('root transforms reject invalid late numeric or target inputs without mutating retained actors',()=>{
 const a=input(evidence.cases[0]),before=structuredClone(a);
 assert.throws(()=>prepare({...a,sineTableWords4350:[]}),/4096/);assert.deepEqual(a,before);
 for(const value of [192,0xffffffff]){
  const bad=structuredClone(a);bad.actorWordsF060[count]=value;const saved=structuredClone(bad);
  assert.throws(()=>prepare(bad),/outside buffer/);assert.deepEqual(bad,saved);
 }
 const bad=structuredClone(a);bad.actorWordsF060[a.actorIndex*47+0xc/4]=0x7fc00000;const saved=structuredClone(bad);
 assert.throws(()=>prepare(bad),/Nonfinite/);assert.deepEqual(bad,saved);
});

test('canonical root transform uses the retained active graphics buffer and emits validated ordered matrix effects',()=>{
 const c=evidence.cases.find(c=>c.input.bufferIndex===1),a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
 state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;const before=structuredClone(state);
 const q=update(state,{...a,actorWordsF060:[],bufferIndex:0});
 assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
 assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));
 assert.deepEqual(q.state.graphicsCorners,state.graphicsCorners);assert.deepEqual(q.state.scene,state.scene);assert.deepEqual(state,before);
 const valid=q.effects.find(o=>o.kind==='presentationActorMatrixWrite');
 for(const patch of [{bufferIndex:2},{matrixIndex:192},{width:1},{byteOffset:65},{value:0x100000000}])assert.throws(()=>commit(state,[q.operations.at(-1),{...valid,...patch}]));
 assert.deepEqual(state,before);
});
