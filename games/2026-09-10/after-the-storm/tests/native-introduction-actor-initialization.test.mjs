import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionActorInitialization as prepare} from '../native-presentation-actor-pool.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeIntroductionActorInitializationUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-introduction-actor-initialization.json.gz',import.meta.url))));
const off=a=>(a+0x10000-0xf060)/4;
function input(c){const pool=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)pool[i]=w;return {...c.input,actorWordsF060:pool};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}

test('complete introduction actor initialization matches original execution, including retained counters and packed halfword order',()=>{
 assert.equal(evidence.cases.length,128);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);
  assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(a,before);
 }
});
test('initialization preserves allocation counts, warm maxima and untouched actor fields while installing the original Z reversal',()=>{
 const a=input(evidence.cases.find(c=>c.input.actorControlWords62c4[0]===0xffffffff)),q=prepare(a);
 assert.deepEqual(q.actorControlWords62c4,[0,19,30]);
 for(let i=0;i<30;i++)for(const o of [8,0x4c,0xb0,0xb4])assert.equal(q.actorWordsF060[(i*0xbc+o)/4],a.actorWordsF060[(i*0xbc+o)/4]);
 assert.deepEqual(q.actorWordsF060.slice(off(0x678),off(0x6b8)),[0x10000,0,1,0,0,0xffff0000,0,1,0,0,0,0,0,0,0,0]);
 for(const c of evidence.cases){const a=input(c),q=prepare(a);for(const at of [0x724,0x728])assert.equal(q.actorWordsF060[off(at)],c.input.actorOverrides[0][1]===0xbf800000?0:a.actorWordsF060[off(at)]);}
 assert.ok(Object.isFrozen(q.actorWordsF060));
});
test('canonical initializer reads retained selection and records, preserves cup data and rejects malformed halfword writes atomically',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.input.primaryHumanIndex===3&&c.input.secondaryHumanIndex===2),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:2,players:1,mode620:4}));
 Object.assign(state.scene,{main638:8,primaryHumanIndex:3,secondaryHumanIndex:2});state.actorWordsF060=a.actorWordsF060;state.actorControlWords62c4=a.actorControlWords62c4;
 state.profileWordsB330.splice(4,4,7,4,2,1);
 for(let slot=0;slot<4;slot++)for(const [i,o]of [0,4,0xc,0x2f4].entries())state.raceWords1f94[(0x2938+slot*0x378+o-0x1f94)/4]=a.racerRecordWordsBySlot[slot][i];
 const before=structuredClone(state),q=update(state,{...a,main638:1,players:2,primaryHumanIndex:0,secondaryHumanIndex:1,actorWordsF060:null,actorControlWords62c4:null,racerRecordWordsBySlot:null});
 assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(q.effects,[]);
 assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(state,before);
 const first={kind:'presentationActorWrite',byteOffset:0,width:4,value:42};
 for(const bad of [{byteOffset:1,width:2,value:1},{byteOffset:1484*4,width:2,value:1},{byteOffset:0,width:2,value:65536},{byteOffset:0,width:1,value:256},{byteOffset:0,width:3,value:1}]){
  assert.throws(()=>commit(state,[first,{kind:'presentationActorWrite',...bad}]));assert.deepEqual(state,before);
 }
});
test('missing late source vertices cannot commit startup and unrelated scene initialization is rejected',()=>{
 const a=input(evidence.cases.find(c=>c.input.players===2)),bad={...a,selectedWaterVertexXZ:[a.selectedWaterVertexXZ[0]]},before=structuredClone(bad);
 assert.throws(()=>prepare(bad),/water vertex/);assert.deepEqual(bad,before);
 assert.throws(()=>prepare({...a,main638:1}),/main8/);
});
