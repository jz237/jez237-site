import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeActorActionAnimation as prepare} from '../native-actor-action-animation.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-actor-action-animation.json.gz',import.meta.url))));
const waterFields=[0,1].map(pattern=>{const f=createNativeWaterField({datumNative:-100});for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768;return f;});
function setup(c){const actorWordsF060=[...e.baseActorWords],hudWords7788=[...e.baseHudWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;for(const [i,w]of c.input.hudOverrides)hudWords7788[i]=w;return {...c.input,actorWordsF060,hudWords7788,waterField:waterFields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords()};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('all original actor actions match ordered stores, water response and splash effects',()=>{
 const fieldsBefore=structuredClone(waterFields);assert.equal(e.cases.length,3228);assert.equal(e.instructions,1210055);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),before=[...input.actorWordsF060],q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'case '+i+' action '+c.input.sequence[0]);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);
  assert.deepEqual(input.actorWordsF060,before);assert.ok(Object.isFrozen(q.actorWordsF060));
 }
 assert.deepEqual(waterFields,fieldsBefore);
});
test('action counters, orientations and vertical motion carry across ninety successive frames',()=>{
 const histories=new Map();let carried=0;
 for(const c of e.cases.filter(c=>c.input.sequence[3]>1)){
  const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);
  if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);carried++;}
  histories.set(key,prepare(input));
 }
 assert.equal(carried,1800);
});
test('inactive actions ignore unused resources and late splash failure cannot alter the owner',()=>{
 const inactive=setup(e.cases.find(c=>c.input.sequence[0]===11));
 assert.deepEqual(prepare({...inactive,waterField:null,sineTableWords4350:null,hudWords7788:null}).operations,[]);
 const c=e.cases.find(c=>c.input.sequence[0]===15&&c.operations.some(o=>o.kind==='externalCall')),input=setup(c),before=[...input.actorWordsF060];
 assert.throws(()=>prepare({...input,hudWords7788:null}),/actual actor animation camera/);assert.deepEqual(input.actorWordsF060,before);
 const oscillating=setup(e.cases.find(c=>c.input.sequence[0]===18));
 assert.throws(()=>prepare({...oscillating,actorControlWords62c4:null}),/actual actor control/);
});
