import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareNativeObjectTransform,prepareNativeObjectVectorTransform} from '../native-object-transform.js';
import {nativeSineTableWords} from '../native-math-tables.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-object-transform-reference.json',import.meta.url)));
const sineTableWords4350=nativeSineTableWords();

test('object matrices, descending packing and collision transforms match every original instruction fixture',()=>{
 for(const c of reference.cases){
  const actual=c.scope==='matrix'?prepareNativeObjectTransform({...c.input,sineTableWords4350}):prepareNativeObjectVectorTransform(c.input);
  assert.deepEqual(actual,c.expected,`${c.scope}: ${JSON.stringify(c.input)}`);
 }
});

test('degree indexing truncates toward zero across negative half steps and wraps full turns',()=>{
 const step=360/4096,positionNative={x:0,y:0,z:0};
 const out=prepareNativeObjectTransform({anglesDegrees:{x:-step*.75,y:step*.75,z:360+step*.75},positionNative,sineTableWords4350});
 assert.deepEqual(out.diagnostic.sineIndices,[0,0,0]);
 const negative=prepareNativeObjectTransform({anglesDegrees:{x:-step*1.25,y:0,z:0},positionNative,sineTableWords4350});
 assert.equal(negative.diagnostic.sineIndices[0],4095);
});

test('collision directions ignore translation while positions consume it in native units',()=>{
 const transformed=prepareNativeObjectTransform({anglesDegrees:{x:0,y:0,z:0},positionNative:{x:100,y:200,z:300},sineTableWords4350});
 const q={floatWords:transformed.floatWords,vectorNative:{x:1,y:2,z:3}};
 assert.deepEqual(prepareNativeObjectVectorTransform({...q,directionOnly:false}).vectorNative,{x:101,y:202,z:303});
 assert.deepEqual(prepareNativeObjectVectorTransform({...q,directionOnly:true}).vectorNative,{x:1,y:2,z:3});
 assert.throws(()=>prepareNativeObjectTransform({anglesDegrees:{x:Infinity,y:0,z:0},positionNative:{x:0,y:0,z:0},sineTableWords4350}),/Invalid/);
 assert.throws(()=>prepareNativeObjectTransform({anglesDegrees:{x:0,y:0,z:0},positionNative:{x:32768,y:0,z:0},sineTableWords4350}),/conversion/);
});
