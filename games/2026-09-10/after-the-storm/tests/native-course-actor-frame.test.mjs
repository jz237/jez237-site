import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeCourseActorFrame as prepare} from '../native-course-actor-frame.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-actor-frame.json.gz',import.meta.url))));
const b=new DataView(new ArrayBuffer(4)),bits=n=>{b.setFloat32(0,n);return b.getUint32(0);};
function digest(words){const out=Buffer.alloc(words.length*4);words.forEach((w,i)=>out.writeUInt32BE(w,i*4));return createHash('sha256').update(out).digest('hex');}
function input(c){const actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060};}
function observer(a,c){let i=0;return call=>{
 const expected=c.calls[i++];assert.equal(call.consumer,expected.consumer);assert.equal(call.actorIndex,expected.actorIndex);
 assert.equal(digest(call.actorWordsF060),expected.actorSHA256);assert.deepEqual(call.actorControlWords62c4,expected.actorControlWords62c4);
 assert.ok(Object.isFrozen(call.actorWordsF060));
 const op=(byteOffset,value)=>({kind:'presentationActorWrite',byteOffset,width:4,value});
 const operations=[op(0x801d0770-0x801cf060,bits(i))];
 if(a.courseIndex===4&&call.consumer==='800a5d70')operations.push(op(call.actorIndex*0xbc,1),op(call.actorIndex*0xbc+0xb8,0));
 return {operations};
};}
test('complete AD418 outer frame matches original writes, shared scratch and every motion boundary',()=>{
 assert.equal(evidence.cases.length,220);assert.equal(evidence.instructions,99852);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare({...a,consumeMotion:observer(a,c)}),label=`case ${i} course ${a.courseIndex}`;
  const mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  if(mismatch>=0)assert.deepEqual(q.operations[mismatch],c.operations[mismatch],`${label} operation ${mismatch}`);
  assert.equal(q.operations.length,c.operations.length,label);assert.equal(digest(q.actorWordsF060),c.actorSHA256,label);
  assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(q.calls,c.calls.map(({consumer,actorIndex})=>({consumer,actorIndex})));assert.deepEqual(a,before);
 }
});
test('course4 checks activity, updates submitted type10 and observes its resulting type before the second dispatch',()=>{
 const c=evidence.cases.find(c=>c.input.courseIndex===4&&c.input.activity624===-1),a=input(c),q=prepare({...a,consumeMotion:observer(a,c)});
 for(const call of q.calls.filter(c=>c.consumer==='800a5d70')){
  const at=q.calls.indexOf(call);assert.deepEqual(q.calls[at+1],{consumer:'800aaac8',actorIndex:call.actorIndex});
 }
 const held=prepare({...a,activity624:0});assert.deepEqual(held.calls,[]);assert.equal(held.actorControlWords62c4[0],(a.actorControlWords62c4[0]+1)>>>0);
});
test('missing or malformed motion consumers fail instead of presenting stationary actor motion',()=>{
 const a=input(evidence.cases[0]),before=structuredClone(a);assert.throws(()=>prepare(a),/Missing course motion/);
 assert.throws(()=>prepare({...a,consumeMotion:()=>null}),/motion result/);
 let i=0;assert.throws(()=>prepare({...a,consumeMotion:()=>({operations:[{kind:'presentationActorWrite',byteOffset:i++?1:0,width:4,value:1}]})}),/Misaligned/);
 assert.deepEqual(a,before);
});
