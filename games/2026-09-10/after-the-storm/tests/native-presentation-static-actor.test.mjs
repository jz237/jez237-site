import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationStaticActor as prepare} from '../native-presentation-static-actor.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationStaticActorUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-static-actor.json.gz',import.meta.url))));
const count=(0x801d06b8-0x801cf060)/4;
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060};}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');};
function applied(q){const b=Buffer.alloc(64);evidence.baseMatrixWords.forEach((w,i)=>b.writeUInt32BE(w,i*4));for(const o of q.operations)if(o.kind==='presentationActorMatrixWrite'){if(o.width===4)b.writeUInt32BE(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}return Array.from({length:16},(_,i)=>b.readUInt32BE(i*4));}

test('static draws match both complete original routines including partial matrices and unchanged animation',()=>{
 assert.equal(evidence.cases.length,192);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.deepEqual(applied(q),c.matrixWords,'matrix case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'pool case '+i);
  assert.equal(q.actorWordsF060[a.actorIndex*47+0x78/4],a.actorWordsF060[a.actorIndex*47+0x78/4]);
  assert.equal(q.actorWordsF060[count],a.actorWordsF060[count]+1);assert.deepEqual(a,before);
 }
});

test('canonical static draw consumes type plus variant, selected resource and active buffer without caller overrides',()=>{
 for(const drawType of [2,4]){
  const c=evidence.cases.find(c=>c.input.drawType===drawType&&c.input.bufferIndex===1&&c.input.resourceIndex===3&&input(c).actorWordsF060[c.input.actorIndex*47+1]===1),a=input(c);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
  state.actorWordsF060=a.actorWordsF060;state.graphicsCorners.renderBufferIndex=1;
  state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsE73c[14]=(3<<16)|0xbeef;state.resourceWordsE73c[12]=0xbeef0003;
  const before=structuredClone(state),q=update(state,{...a,drawType:0,resourceIndex:0,bufferIndex:0,actorWordsF060:[]});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
  assert.deepEqual(q.effects,c.operations.filter(o=>o.kind!=='presentationActorWrite'));assert.deepEqual(state,before);
  const bad=structuredClone(state);bad.resourceWordsE73c[drawType===2?14:12]=0xffffffff;const saved=structuredClone(bad);
  assert.throws(()=>update(bad,a),/resource index/);assert.deepEqual(bad,saved);
 }
});
