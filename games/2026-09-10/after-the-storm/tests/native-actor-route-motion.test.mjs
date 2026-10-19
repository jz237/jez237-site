import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeActorRouteMotion as prepare} from '../native-actor-route-motion.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-actor-route-motion.json.gz',import.meta.url))));
const fields=[0,1].map(pattern=>{const f=createNativeWaterField({datumNative:-100});for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768;return f;});
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,hudWords7788:e.baseHudWords,routeWords:e.routeWords,waterField:fields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('complete route movement and animation match original link, speed, action and travel ordering',()=>{
 const before=structuredClone(fields);assert.equal(e.cases.length,1143);assert.equal(e.instructions,860686);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),pool=[...input.actorWordsF060],q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'route case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'route case '+i);
  assert.deepEqual(input.actorWordsF060,pool);assert.ok(Object.isFrozen(q.operations));
 }
 assert.deepEqual(fields,before);
});
test('route histories carry motion and animation together across loop and orbit paths',()=>{
 const histories=new Map();let carried=0;
 for(const c of e.cases.filter(c=>c.input.sequence[3]>1)){
  const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);carried++;}histories.set(key,prepare(input));
 }
 assert.equal(carried,810);
});
test('orbit mode avoids route rows while missing selected rows fail without partial writes',()=>{
 const orbit=setup(e.cases.find(c=>c.input.sequence[1]===-1));assert.deepEqual(prepare({...orbit,routeWords:null}).operations,prepare(orbit).operations);
 const active=setup(e.cases.find(c=>c.input.sequence[1]===7)),before=[...active.actorWordsF060];
 assert.throws(()=>prepare({...active,routeWords:e.routeWords.slice(0,7)}),/row index/);assert.deepEqual(active.actorWordsF060,before);
 assert.throws(()=>prepare({...active,waterField:null}),/water field/);assert.deepEqual(active.actorWordsF060,before);
});
