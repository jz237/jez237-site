import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeBodyTranslation as prepare} from '../native-body-translation.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-body-translation.json.gz',import.meta.url))));
const input=c=>{const bodyWords=[...evidence.baseBodyWords];for(const [i,w]of c.input.bodyOverrides)bodyWords[i]=w;return {bodyWords,deltaNative:c.input.deltaNative};};
const hash=words=>{const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');};

test('complete body translation matches every original store and retained body byte',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.bodyWordWrites,c.bodyWordWrites,'case '+i);assert.equal(hash(q.bodyWords),c.bodySHA256,'case '+i);assert.deepEqual(a,before);
 }
});

test('zero point index still moves point0 and history updates leave velocities and orientation untouched',()=>{
 const c=evidence.cases.find(c=>c.input.deltaNative.x===1&&c.input.bodyOverrides.some(([i,v])=>i===0x28/4&&v===0)),a=input(c),q=prepare(a);
 assert.ok(q.bodyWordWrites.some(w=>w.byteOffset===0x90));assert.ok(!q.bodyWordWrites.some(w=>w.byteOffset===0xb0));
 const touched=new Set(q.bodyWordWrites.map(w=>w.byteOffset/4));for(let i=0;i<a.bodyWords.length;i++)if(!touched.has(i))assert.equal(q.bodyWords[i],a.bodyWords[i]);
 assert.ok(!touched.has(0xb78/4));assert.ok(!touched.has(0x50/4));assert.ok(!touched.has(0x6c/4));assert.ok(Object.isFrozen(q.bodyWords));
});

test('late invalid history rejects the whole body transaction',()=>{
 const a=input(evidence.cases[0]);a.bodyWords[(0x1198+3*0x24+8)/4]=0x7fc00000;const before=structuredClone(a);
 assert.throws(()=>prepare(a),/Nonfinite/);assert.deepEqual(a,before);
 for(const count of [12,0xfffffffe]){const b=input(evidence.cases[0]);b.bodyWords[0x28/4]=count;assert.throws(()=>prepare(b),/last-point/);}
});
