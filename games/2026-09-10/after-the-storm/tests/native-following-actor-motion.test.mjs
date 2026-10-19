import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeFollowingActorMotion as prepare} from '../native-following-actor-motion.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-following-actor-motion.json.gz',import.meta.url))));
const fields=[0,1].map(pattern=>{const f=createNativeWaterField({datumNative:-100});for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768;return f;});
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,hudWords7788:e.baseHudWords,routeWords:e.routeWords,waterField:fields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('mirrored and formation followers match complete original movement and action sequences',()=>{
 const before=structuredClone(fields);assert.equal(e.cases.length,1686);assert.equal(e.instructions,1015512);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),pool=[...input.actorWordsF060],q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'following case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'following case '+i);
  assert.deepEqual(input.actorWordsF060,pool);assert.ok(Object.isFrozen(q.operations));
 }
 assert.deepEqual(fields,before);
});
test('following histories carry across route, final-lap transition and formation updates',()=>{
 const histories=new Map();let carried=0;
 for(const c of e.cases.filter(c=>c.input.sequence[4]>1)){
  const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);carried++;}histories.set(key,prepare(input));
 }
 assert.equal(carried,720);
});
test('following gates and mirror mode avoid unused resources while late failures are atomic',()=>{
 const c=e.cases.find(c=>c.input.entry==='800a9130'&&c.input.sequence[1]===12&&c.input.state650===3&&c.input.activity624===-1),input=setup(c);
 assert.deepEqual(prepare({...input,routeWords:null,waterField:null,sineTableWords4350:null,angleTableWords6f08:null}).operations,c.operations);
 assert.deepEqual(prepare({...input,state650:0,activity624:null}).operations,[]);
 const active=setup(e.cases.find(c=>c.input.entry==='800a9130'&&c.input.sequence[1]===1)),before=structuredClone(active);
 assert.throws(()=>prepare({...active,configuredLaps728:null}),/configured laps/);assert.deepEqual(active,before);
});
