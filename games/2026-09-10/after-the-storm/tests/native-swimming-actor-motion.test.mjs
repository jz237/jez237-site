import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeSwimmingActorMotion as prepare} from '../native-swimming-actor-motion.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeSwimmingActorMotionUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-swimming-actor-motion.json.gz',import.meta.url))));
function input(c){const actorWordsF060=[...evidence.baseActorWords],hudWords7788=[...evidence.baseHudWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;for(const [i,w]of c.input.hudOverrides)hudWords7788[i]=w;return {...c.input,actorWordsF060,hudWords7788,sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('complete swimmer motion matches every original write, shared random state and carried-frame hash',()=>{
 assert.equal(evidence.cases.length,376);assert.equal(evidence.instructions,138828);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a),label=`case ${i} ${a.sequence} frame ${a.frame}`;
  const mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  if(mismatch>=0)assert.deepEqual(q.operations[mismatch],c.operations[mismatch],`${label} operation ${mismatch}`);
  assert.equal(q.operations.length,c.operations.length,label);assert.equal(digest(q.actorWordsF060),c.actorSHA256,label);assert.equal(q.rngState4640,c.rngState4640,label);assert.deepEqual(a,before);
 }
});
test('carried motion retains positions and velocities, while relocation alone consumes two RNG draws',()=>{
 let carried=0,relocated=0;
 for(let i=0;i<evidence.cases.length;i++){
  const c=evidence.cases[i],a=input(c),q=prepare(a),random=q.operations.filter(o=>o.kind==='sourceWordWrite');
  assert.ok([0,2].includes(random.length));if(random.length)relocated++;
  if(c.input.frame>0){const previous=evidence.cases[i-1],p=prepare(input(previous));assert.equal(digest(a.actorWordsF060),digest(p.actorWordsF060));assert.equal(a.rngState4640,p.rngState4640);carried++;}
 }
 assert.equal(carried,248);assert.ok(relocated>0);
});
test('held or unsupported modes preserve all state and orbit avoids unused camera/range inputs',()=>{
 for(const c of evidence.cases.filter(c=>c.input.activity624===0||c.input.sequence[1]===0)){
  const a=input(c),q=prepare({...a,hudWords7788:null,waterRangeWords2428:null,sineTableWords4350:null});assert.deepEqual(q.actorWordsF060,a.actorWordsF060);assert.equal(q.rngState4640,a.rngState4640);assert.deepEqual(q.operations,[]);
 }
 const a=input(evidence.cases.find(c=>c.input.activity624===-1&&c.input.sequence[1]===11)),q=prepare({...a,hudWords7788:null,waterRangeWords2428:null});
 assert.equal(q.operations.length,4);assert.equal(q.rngState4640,a.rngState4640);assert.ok(Object.isFrozen(q.actorWordsF060));
});
test('invalid late water or relocation inputs cannot partially update caller state',()=>{
 const a=input(evidence.cases.find(c=>c.operations.some(o=>o.kind==='sourceWordWrite')));
 for(const bad of [{...a,waterRangeWords2428:null},{...a,radius4720:NaN},{...a,sineTableWords4350:[]}]){
  const before=structuredClone(bad);assert.throws(()=>prepare(bad));assert.deepEqual(bad,before);
 }
});
test('canonical swimmer motion reads one retained actor, camera and shared RNG owner',()=>{
 for(const c of evidence.cases.filter(c=>c.input.frame===0)){
  const a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],players:1,courseIndex:1,mode620:4}));
  Object.assign(state.scene,{displayCamera3930:a.cameraIndex,activity624:a.activity624,rngState4640:a.rngState4640});
  state.actorWordsF060=a.actorWordsF060;state.hudWords7788=a.hudWords7788;
  const before=structuredClone(state),q=update(state,{...a,actorWordsF060:null,hudWords7788:null,cameraIndex:99,activity624:99,rngState4640:99});
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.effects,[]);
  for(const k of ['hudWords7788','raceWords1f94','actorControlWords62c4','actorControlWords62d0','profileWordsB330'])assert.deepEqual(q.state[k],state[k]);
  assert.deepEqual(state,before);
 }
});
