import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePerchingBirdMotion as prepare} from '../native-perching-bird-motion.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-perching-bird-motion.json.gz',import.meta.url))));
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,buoyWordsEe20:e.buoyWordsEe20,objectWordsC940:e.objectWordsC940,sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('whole perching bird motion matches original stores, RNG and carried actor hashes',()=>{
 assert.equal(e.cases.length,480);assert.equal(e.instructions,78970);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);
  assert.equal(q.rngState4640,c.rngState4640);assert.deepEqual(input,before);assert.ok(Object.isFrozen(q.actorWordsF060));
 }
});
test('carried bird sequences retain prior positions, burst counters and shared RNG',()=>{
 const histories=new Map();let carried=0,random=0;
 for(const c of e.cases){const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);
  if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);assert.equal(input.rngState4640,prior.rngState4640);carried++;}
  const q=prepare(input);histories.set(key,q);random+=q.operations.filter(o=>o.kind==='sourceWordWrite').length;
 }
 assert.equal(carried,320);assert.ok(random>0);
});
test('held birds avoid unused target and sine data, while late failures do not mutate actor state',()=>{
 const held=setup(e.cases.find(c=>c.input.activity624===0)),before=structuredClone(held);
 assert.deepEqual(prepare({...held,courseIndex:null,sineTableWords4350:null}).operations,[]);assert.deepEqual(held,before);
 const active=setup(e.cases.find(c=>c.input.activity624===-1&&c.input.sequence[1]===8)),copy=structuredClone(active);
 assert.throws(()=>prepare({...active,sineTableWords4350:null}),/bird sine table/);assert.deepEqual(active,copy);
});
test('perches require the selected source owner and validate only the branch that is read',()=>{
 for(const mode620 of [0,4,11]){
  const c=e.cases.find(c=>c.input.courseIndex===1&&c.input.mode620===mode620&&c.input.sequence[1]===2&&c.input.activity624===-1);
  const input=setup(c),before=structuredClone(input),generic=mode620===11,required=generic?'objectWordsC940':'buoyWordsEe20',unused=generic?'buoyWordsEe20':'objectWordsC940';
  assert.deepEqual(prepare({...input,[unused]:null}).operations,c.operations);
  assert.throws(()=>prepare({...input,[required]:null}),new RegExp(required));assert.deepEqual(input,before);
 }
 const c=e.cases.find(c=>c.input.courseIndex===3&&c.input.sequence[1]===2&&c.input.activity624===-1),input=setup(c);
 assert.deepEqual(prepare({...input,mode620:null,objectWordsC940:null,buoyWordsEe20:null}).operations,c.operations);
});

