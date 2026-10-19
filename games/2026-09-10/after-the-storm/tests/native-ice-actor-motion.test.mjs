import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeIceActorMotion as prepare} from '../native-ice-actor-motion.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-ice-actor-motion.json.gz',import.meta.url))));
function setup(c){
 const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;
 const waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
 waterField.heightQ.forEach((_,i)=>waterField.heightQ[i]=c.input.waterPattern?((i*7919+37)%20001)-10000:768);
 return {...c.input,actorWordsF060,routeWords:e.routeWords,waterField,sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS};
}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('complete ice actor motion matches original water, movement, RNG and audio instructions',()=>{
 assert.equal(e.cases.length,320);assert.equal(e.instructions,81416);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256,'case '+i);
  assert.equal(q.rngState4640,c.rngState4640);assert.equal(q.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(input,before);assert.ok(Object.isFrozen(q.operations));
 }
});
test('carried ice actor histories preserve shared latch and randomness through movement modes',()=>{
 const histories=new Map();let carried=0;const modes=new Set();
 for(const c of e.cases){const input=setup(c),key=c.input.sequence.join('/'),prior=histories.get(key);
  if(c.input.frame){assert.deepEqual(input.actorWordsF060,prior.actorWordsF060);assert.equal(input.rngState4640,prior.rngState4640);assert.equal(input.audioScene7c9c,prior.audioScene7c9c);carried++;modes.add(input.actorWordsF060[c.input.actorIndex*47+2]);}
  histories.set(key,prepare(input));
 }
 assert.equal(carried,240);for(const mode of [9,7,8])assert.ok(modes.has(mode));
});
test('held ice actors avoid route and water reads and group failure cannot commit partial writes',()=>{
 const held=setup(e.cases.find(c=>c.input.activity624===0));assert.deepEqual(prepare({...held,routeWords:null,waterField:null,audioMode:null}).operations,[]);
 const active=setup(e.cases.find(c=>c.input.sequence[0]===2&&c.input.sequence[1]===0&&c.input.frame===0)),before=structuredClone(active);
 assert.throws(()=>prepare({...active,routeWords:active.routeWords.slice(0,7)}),/route index/);assert.deepEqual(active,before);
 assert.throws(()=>prepare({...active,waterField:null}),/water field/);assert.deepEqual(active,before);
});
