import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionFlock as flock} from '../native-introduction-flock.js';
import {prepareNativeIntroductionFlockUpdate as update} from '../native-race-state.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
const evidence=JSON.parse(readFileSync(new URL('./fixtures/native-introduction-flock.json',import.meta.url)));
const hi=a=>(a-0x7788)/4;
function input(c){const hud=[...evidence.baseHud];for(const[i,w]of c.input.hudOverrides)hud[i]=w;return {...c.input,hudWords7788:hud};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('whole flock initialization and movement match original ordered writes, shared RNG and complete HUD hashes',()=>{
 assert.equal(evidence.cases.length,524);
 for(const [i,c]of evidence.cases.entries()){
  const q=flock(input(c));assert.deepEqual(q.operations,c.operations,`case ${i}`);
  assert.equal(digest(q.hudWords7788),c.hudSHA256,`case ${i}`);
 }
});
test('flocks preserve other actors, use retained random state and return detached immutable storage',()=>{
 const c=evidence.cases.find(c=>c.input.phase==='initialize'&&c.input.actorStartIndex===2&&c.input.count===4),a=input(c),before=structuredClone(a),q=flock(a);
 assert.deepEqual(a,before);assert.ok(Object.isFrozen(q.hudWords7788));
 assert.equal(q.diagnostic.rngCalls,28);assert.equal(q.diagnostic.actorsSubmitted,false);
 assert.deepEqual(q.hudWords7788.slice(hi(0x8190),hi(0x8190+2*0x34)),a.hudWords7788.slice(hi(0x8190),hi(0x8190+2*0x34)));
 assert.deepEqual(q.hudWords7788.slice(hi(0x8190+6*0x34)),a.hudWords7788.slice(hi(0x8190+6*0x34)));
 const other=flock({...a,rngState4640:(a.rngState4640+1)>>>0});assert.notDeepEqual(q.hudWords7788,other.hudWords7788);
 const empty=flock({...a,count:0});assert.deepEqual(empty.operations,[]);assert.equal(empty.rngState4640,a.rngState4640);
});
test('late bad angle rejects after earlier actor work without changing caller HUD or RNG',()=>{
 const c=evidence.cases.find(c=>c.input.phase==='update'&&c.input.count===4),a=input(c);
 a.hudWords7788[hi(0x8128)]=0x7f7fffff;const before=structuredClone(a);
 assert.throws(()=>flock(a),/conversion range/);assert.deepEqual(a,before);
 assert.throws(()=>flock({...a,count:15}),/actor slice/);
 assert.throws(()=>flock({...a,angleAddress:0x8180}),/angle slice/);
});
test('canonical flock update shares HUD and RNG while retaining championship scores and physical owners',()=>{
 const a=input(evidence.cases[0]),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:1,players:1,mode620:4}));
 state.scene.main638=8;state.scene.rngState4640=a.rngState4640;state.hudWords7788=a.hudWords7788;
 const before=structuredClone(state),q=update(state,{...a,rngState4640:123,hudWords7788:null}),expected=flock(a);
 assert.deepEqual(q.state.hudWords7788,expected.hudWords7788);assert.equal(q.state.scene.rngState4640,expected.rngState4640);
 assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.effects,[]);
 assert.deepEqual(state,before);state.scene.main638=9;assert.throws(()=>update(state,a),/main8/);
});
