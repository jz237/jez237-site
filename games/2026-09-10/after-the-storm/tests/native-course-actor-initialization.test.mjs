import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeCourseActorInitialization as prepare} from '../native-presentation-actor-pool.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeCourseActorInitializationUpdate as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-actor-initialization.json.gz',import.meta.url))));
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,sineTableWords4350:evidence.sineTableWords4350};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('all course actor startup branches match original ordered stores, RNG and retained pool',()=>{
 assert.equal(evidence.cases.length,156);assert.equal(evidence.instructions,294448);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a),label=`case ${i} course ${a.courseIndex} main ${a.main638}`;
  const mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  if(mismatch>=0)assert.deepEqual(q.operations[mismatch],c.operations[mismatch],`${label} operation ${mismatch}`);
  assert.equal(q.operations.length,c.operations.length,label);assert.equal(digest(q.actorWordsF060),c.actorSHA256,label);
  for(const k of ['actorControlWords62c4','actorControlWords62d0','rngState4640','audioScene7c9c'])assert.deepEqual(q[k],c[k],`${label} ${k}`);
  assert.deepEqual(a,before,label);
 }
});
test('Dolphin startup owns its extra wake actor and honors unlock counts without fabricating extra motion',()=>{
 for(const c of evidence.cases.filter(c=>c.input.courseIndex===0&&c.input.players===1&&![8,21].includes(c.input.main638))){
  const a=input(c),q=prepare(a);assert.equal(q.actorWordsF060[0],6);
  for(let i=1;i<4;i++)assert.equal(q.actorWordsF060[i*47],i<=(a.actorControlWords62d0[1]|0)?6:0);
  assert.deepEqual(q.actorControlWords62d0,[0,a.actorControlWords62d0[1]]);
  if(a.main638===0){assert.equal(q.rngState4640,a.rngState4640);assert.equal(q.actorWordsF060[4*47],0);}
  assert.ok(Object.isFrozen(q.actorWordsF060));assert.ok(Object.isFrozen(q.actorControlWords62d0));
 }
});
test('late missing course input cannot mutate startup; bypass branches do not require unused geometry',()=>{
 const c=evidence.cases.find(c=>c.input.courseIndex===0&&c.input.main638===1),a=input(c);
 for(const bad of [{...a,firstCourseNodeWords:null},{...a,actorControlWords62d0:[1]},{...a,courseIndex:1,sineTableWords4350:[]}]){
  const before=structuredClone(bad);assert.throws(()=>prepare(bad));assert.deepEqual(bad,before);
 }
 for(const main638 of [8,21])assert.doesNotThrow(()=>prepare({...a,main638,firstCourseNodeWords:null,sineTableWords4350:null}));
 assert.deepEqual(prepare({...a,players:2,firstCourseNodeWords:null,sineTableWords4350:null}).actorControlWords62c4.slice(1),[0,0]);
});
test('canonical startup uses retained course, profile, records and shared RNG; audio stays an ordered effect',()=>{
 for(const c of evidence.cases.filter(c=>c.input.courseIndex>=0&&c.input.courseIndex<9)){
  const a=input(c),s=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:a.courseIndex,players:a.players,mode620:a.mode620}));
  Object.assign(s.scene,{main638:a.main638,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex,reverseDab68:a.reverseAB68&65535,rngState4640:a.rngState4640,audioScene7c9c:a.audioScene7c9c});
  for(const k of ['actorWordsF060','actorControlWords62c4','actorControlWords62d0'])s[k]=[...a[k]];
  s.profileWordsB330[4]=a.profileB340;
  for(let slot=0;slot<4;slot++)for(const [i,o]of [0,4,0xc,0x2f4].entries())s.raceWords1f94[(0x2938+slot*0x378+o-0x1f94)/4]=a.racerRecordWordsBySlot[slot][i];
  const before=structuredClone(s),q=update(s,{...a,courseIndex:99,mode620:99,main638:99,profileB340:99,reverseAB68:99,rngState4640:99,audioScene7c9c:999,actorWordsF060:null,actorControlWords62c4:null,actorControlWords62d0:null,players:99,primaryHumanIndex:99,secondaryHumanIndex:99,racerRecordWordsBySlot:null});
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);
  for(const k of ['actorControlWords62c4','actorControlWords62d0'])assert.deepEqual(q.state[k],c[k]);
  for(const k of ['rngState4640','audioScene7c9c'])assert.equal(q.state.scene[k],c[k]);
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  for(const k of ['raceWords1f94','hudWords7788','profileWordsB330'])assert.deepEqual(q.state[k],s[k]);
  assert.deepEqual(s,before);
 }
});
test('auxiliary and byte actor stores reject invalid batches atomically and preserve adjacent bytes',()=>{
 const s=createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4}),before=structuredClone(s);
 const first={kind:'presentationActorWrite',byteOffset:0,width:4,value:0xaabbccdd};
 for(const bad of [{kind:'presentationActorAuxControlWrite',byteOffset:8,width:4,value:1},{kind:'presentationActorAuxControlWrite',byteOffset:0,width:1,value:1},{kind:'presentationActorWrite',byteOffset:0,width:1,value:256}]){
  assert.throws(()=>commit(s,[first,bad]));assert.deepEqual(s,before);
 }
 const q=commit(s,[first,{kind:'presentationActorWrite',byteOffset:1,width:1,value:0x12},{kind:'presentationActorWrite',byteOffset:2,width:2,value:0x3456}]);
 assert.equal(q.state.actorWordsF060[0],0xaa123456);assert.deepEqual(s,before);
});
