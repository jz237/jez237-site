import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeSpecialCourseActorMotion as prepare} from '../native-special-course-actor-motion.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-special-course-actor-motion.json.gz',import.meta.url))));
const fields=[0,1].map(pattern=>{const f=createNativeWaterField({datumNative:-100});for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768;return f;});
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060,hudWords7788:e.baseHudWords,routeWords:e.routeWords,waterField:fields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('special course wrappers match original audio, phase gates, route and animation ordering',()=>{
 const before=structuredClone(fields);assert.equal(e.cases.length,192);assert.equal(e.instructions,31546);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),pool=[...input.actorWordsF060],q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'special case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'special case '+i);
  assert.equal(q.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(input.actorWordsF060,pool);assert.ok(Object.isFrozen(q.operations));
 }
 assert.deepEqual(fields,before);
});
test('course5 audio continues while held, and course8 phase gates avoid unused inputs',()=>{
 const held=setup(e.cases.find(c=>c.input.entry==='800a93c8'&&c.input.activity624===0&&c.input.audioScene7c9c===5));
 const q=prepare({...held,routeWords:null,waterField:null});assert.ok(q.operations.some(o=>o.kind==='externalCall'));assert.equal(q.audioScene7c9c,5);
 const inactive=setup(e.cases.find(c=>c.input.entry==='800ab890'&&c.input.state650===0));
 assert.deepEqual(prepare({...inactive,activity624:undefined,audioContext:null,routeWords:null,waterField:null}).operations,[]);
});
test('failure after audio and preliminary animation writes leaves caller state intact',()=>{
 for(const entry of ['800a93c8','800ab890']){
  const input=setup(e.cases.find(c=>c.input.entry===entry&&c.input.state650===3&&c.input.activity624===-1&&c.input.actorOverrides.some(([i,w])=>i===c.input.actorIndex*47+2&&w===1))),before=structuredClone(input);
  assert.throws(()=>prepare({...input,routeWords:null}),/routeWords/);assert.deepEqual(input,before);
 }
});
