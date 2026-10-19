import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {selectNativePresentationAnimationRoot as select} from '../native-presentation-animation-root.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-animation-root.json.gz',import.meta.url))));
test('animation root lookup matches original resource, track and signed key selection',()=>{
 assert.equal(e.cases.length,144);assert.equal(e.instructions,6894);const before=structuredClone(e);
 for(const [i,c]of e.cases.entries()){
  const q=select({...e,...c}),pointer=(0x81000000+q.resourceIndex*0x10000+q.animationIndex*0x1000+q.transformIndex*12)>>>0;
  assert.equal(pointer,c.pointer,'root case '+i);assert.equal(q.frame,c.frame);assert.ok(Object.isFrozen(q));
 }
 assert.deepEqual(e,before);
});
test('root lookup never substitutes modulo frames or static actor roots',()=>{
 assert.throws(()=>select({...e,actorType:6,animationIndex:8,frame:0}),/transform key/);
 assert.throws(()=>select({...e,actorType:6,animationIndex:0,frame:9}),/transform key/);
 assert.throws(()=>select({...e,actorType:2,animationIndex:0,frame:0}),/no animation root/);
});
