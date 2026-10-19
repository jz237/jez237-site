import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeCourseBirdMotion as prepare} from '../native-course-bird-motion.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-bird-motion.json.gz',import.meta.url))));
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('whole course bird motion matches original stores, RNG and carried actor hashes',()=>{
 assert.equal(e.cases.length,588);assert.equal(e.instructions,149198);
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
 assert.equal(carried,480);assert.ok(random>0);
});
test('held birds avoid unused target and sine data, while late failures do not mutate actor state',()=>{
 const held=setup(e.cases.find(c=>c.input.activity624===0)),before=structuredClone(held);
 assert.deepEqual(prepare({...held,courseIndex:null,sineTableWords4350:null}).operations,[]);assert.deepEqual(held,before);
 const active=setup(e.cases.find(c=>c.input.activity624===-1&&c.input.sequence[1]===1)),copy=structuredClone(active);
 assert.throws(()=>prepare({...active,sineTableWords4350:null}),/bird sine table/);assert.deepEqual(active,copy);
});
