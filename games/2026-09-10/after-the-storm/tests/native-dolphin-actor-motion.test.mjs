import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeDolphinActorMotion as prepare} from '../native-dolphin-actor-motion.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-actor-motion.json.gz',import.meta.url))));
const fields=[0,1].map(pattern=>{const f=createNativeWaterField({datumNative:-100});for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768;return f;});
function setup(c,evidence=e){const actorWordsF060=[...evidence.baseActorWords],hudWords7788=[...evidence.baseHudWords],courseWordsEe20=[...evidence.courseWordsEe20];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;for(const [i,w]of c.input.hudOverrides)hudWords7788[i]=w;for(const [i,w]of c.input.courseOverrides)courseWordsEe20[i]=w;return {...c.input,actorWordsF060,hudWords7788,courseWordsEe20,resourceWordsE73c:evidence.resourceWordsE73c,animationsByResourceIndex:evidence.animationsByResourceIndex,collisionGeometry:evidence.collisionGeometry,waterField:fields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}

test('both dolphin route searches consume secondaryB124 even when primaryB120 differs',()=>{
 const r=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-route-count.json.gz',import.meta.url))));
 const reference={baseActorWords:r.base,baseHudWords:r.hud,courseWordsEe20:r.course,resourceWordsE73c:r.resourceWords,animationsByResourceIndex:r.animations,collisionGeometry:r.geometry};
 assert.equal(r.cases.length,10);assert.equal(r.executed,39015);
 for(const c of r.cases){
  const input=setup(c,reference),q=prepare(input),label=`mode ${c.input.sequence[0]} secondary ${c.input.secondaryCount}`;
  assert.deepEqual(q.operations,c.operations,label);assert.equal(digest(q.actorWordsF060),c.actorSHA256,label);
  assert.deepEqual(prepare({...input,primaryCount:0}).operations,c.operations,label+' ignores unrelated primary count');
  assert.throws(()=>prepare({...input,secondaryCount:undefined}),/secondary count/);
 }
});
test('complete dolphin movement matches source pose, pursuit, formation, collision and effect ordering',()=>{
 assert.equal(e.cases.length,1186);assert.equal(e.instructions,1950824);
 const before=structuredClone(fields);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),pool=[...input.actorWordsF060],q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'dolphin case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'dolphin case '+i);
  assert.deepEqual(q.actorControlWords62d0,c.actorControlWords62d0);assert.deepEqual(input.actorWordsF060,pool);assert.ok(Object.isFrozen(q.operations));
 }
 assert.deepEqual(fields,before);
});
test('dolphin histories carry movement, role changes and auxiliary controls across successive frames',()=>{
 const histories=new Map();let carried=0;
 for(const c of e.cases.filter(c=>c.input.sequence[4]>1)){
  const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);assert.deepEqual(input.actorControlWords62d0,prior.actorControlWords62d0);carried++;}histories.set(key,prepare(input));
 }
 assert.equal(carried,540);
});
test('held dolphins still refresh original pose and sound packet without reading course or collision data',()=>{
 const c=e.cases.find(c=>c.input.state650===0),input=setup(c),q=prepare({...input,courseWordsEe20:null,collisionGeometry:null,activity624:undefined});
 assert.deepEqual(q.operations,c.operations);assert.ok(q.operations.some(o=>o.width===1));
 const active=setup(e.cases.find(c=>c.input.sequence[0]===5&&!c.input.sequence[2]&&c.input.sequence[3]===0)),before=structuredClone(active);
 assert.throws(()=>prepare({...active,collisionGeometry:null}),/count0578/);assert.deepEqual(active,before);
});
