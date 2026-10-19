import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeCourseAnimationRelocation as prepare} from '../native-course-animation-relocation.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-animation-relocation.json.gz',import.meta.url))));
const digest=words=>{const bytes=Buffer.alloc(words.length*4);words.forEach((w,i)=>bytes.writeUInt32BE(w,i*4));return createHash('sha256').update(bytes).digest('hex');};
test('all seven course animation parsers match original pointer stores, aliases and address resolution',()=>{
 assert.equal(e.cases.length,42);assert.equal(e.instructions,13211);
 for(const [i,c]of e.cases.entries()){
  const before=structuredClone(c.input),q=prepare(c.input);
  assert.deepEqual(q.operations,c.operations,'relocation case '+i);assert.equal(q.animationTableAddress,c.animationTableAddress);
  assert.equal(digest(q.loadedAssetWords),c.sha256);assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.loadedAssetWords));
 }
});
test('late malformed descriptors and static banks cannot partially change loaded resources',()=>{
 const input=structuredClone(e.cases[0].input),table=(e.cases[0].animationTableAddress-input.baseAddress)/4;
 input.loadedAssetWords[table+7]=0x08fffffc;const before=structuredClone(input);
 assert.throws(()=>prepare(input),/outside loaded span/);assert.deepEqual(input,before);
 assert.throws(()=>prepare({...input,bankIndex:5}),/animated course bank/);
 assert.throws(()=>prepare({...input,bankIndex:7}),/animated course bank/);
});
