import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationActorReset as reset,prepareNativePresentationActorSubmission as submit,prepareNativeSunsetIntroductionActors as sunset} from '../native-presentation-actor-pool.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeIntroductionActorsUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-pool.json.gz',import.meta.url))));
function input(c){const pool=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides??[])pool[i]=w;return {...c.input,actorWordsF060:pool};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
test('pool reset, submission and complete Sunset producer match every original write and final owner hash',()=>{
 assert.equal(evidence.cases.length,162);
 for(const [i,c]of evidence.cases.entries()){
  const q=({reset,submit,sunset})[c.input.phase](input(c));assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4);
 }
});
test('reset retains unselected actor words, motion scratch and the shared frame counter',()=>{
 const a=input(evidence.cases[1]),before=structuredClone(a),q=reset(a);
 assert.deepEqual(a,before);assert.equal(q.actorControlWords62c4[0],a.actorControlWords62c4[0]);
 for(let i=0;i<30;i++){assert.equal(q.actorWordsF060[(i*0xbc+8)/4],a.actorWordsF060[(i*0xbc+8)/4]);assert.equal(q.actorWordsF060[(i*0xbc+0xb4)/4],a.actorWordsF060[(i*0xbc+0xb4)/4]);}
 assert.deepEqual(q.actorWordsF060.slice(30*47),a.actorWordsF060.slice(30*47));assert.ok(Object.isFrozen(q.actorWordsF060));
});
test('filling the last slot preserves the original count, and missing late input cannot partially submit',()=>{
 const c=evidence.cases.find(c=>c.input.phase==='submit'&&c.input.actorControlWords62c4[2]===29&&c.input.count===1),a=input(c),q=submit(a);
 assert.equal(q.actorControlWords62c4[2],29);assert.equal(q.actorWordsF060[(29*0xbc+0xb8)/4],1);
 const bad={...a,count:2,actorControlWords62c4:[55,7,28],sourceWords:a.sourceWords.slice(0,13)},before=structuredClone(bad);
 assert.throws(()=>submit(bad),/source row/);assert.deepEqual(bad,before);
});
test('all introduction actor boundaries are consumed into retained canonical storage without altering cup points',()=>{
 const c=evidence.cases.find(c=>c.input.phase==='sunset'),a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:2,players:1,mode620:4}));
 state.scene.main638=8;state.hudWords7788[(0x805c-0x7788)/4]=0x80223f7c+24;state.hudWords7788[(0x8060-0x7788)/4]=1;
 state.actorWordsF060=a.actorWordsF060;state.actorControlWords62c4=a.actorControlWords62c4;state.profileWordsB330.splice(4,4,7,4,2,1);
 const before=structuredClone(state),q=update(state,{...a,actorWordsF060:null,actorControlWords62c4:null,players:2,racerRecordWordsBySlot:null});
 assert.deepEqual(q.effects,[]);assert.equal(q.state.actorWordsF060[0],6);assert.deepEqual(q.state.actorControlWords62c4,[1,3,3]);
 assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(state,before);
 assert.ok(q.operations.every(o=>o.kind!=='externalCall'));assert.equal(q.diagnostic.actorsSubmitted,true);
 assert.throws(()=>update(state,{...a,selectedWaterVertexXZ:[]}),/water vertex/);assert.deepEqual(state,before);
 assert.throws(()=>commit(state,[{kind:'presentationActorWrite',byteOffset:1484*4,width:4,value:1}]),/offset/);assert.deepEqual(state,before);
});
