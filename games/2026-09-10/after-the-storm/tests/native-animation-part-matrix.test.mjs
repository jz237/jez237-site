import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeAnimationPartMatrix as prepare} from '../native-widget-transform.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-animation-part-matrix.json.gz',import.meta.url))));
test('animation part matrices match full original execution and preserve partial destination writes',()=>{
 assert.equal(evidence.cases.length,185);
 for(const [i,c]of evidence.cases.entries()){
  const before=structuredClone(c.input),q=prepare(c.input),words=[...evidence.baseMatrixWords];
  assert.deepEqual(q.operations,c.operations,'case '+i);for(const o of q.operations)words[o.wordIndex]=o.value;
  assert.deepEqual(words,c.matrixWords,'case '+i);assert.equal(q.complete,c.operations.length===16);
  assert.deepEqual(q.matrixWords,q.complete?c.matrixWords:null);assert.deepEqual(c.input,before);
 }
});
test('degenerate animation parts do not invent translation and malformed late inputs are atomic',()=>{
 const q=prepare({forwardUnits:{x:0,y:0,z:0},upUnits:{x:0,y:1,z:0},scale:1});assert.equal(q.operations.length,4);assert.equal(q.complete,false);
 const a=structuredClone(evidence.cases[0].input);a.positionNative.z=NaN;const before=structuredClone(a);assert.throws(()=>prepare(a),/Invalid/);assert.deepEqual(a,before);
});
