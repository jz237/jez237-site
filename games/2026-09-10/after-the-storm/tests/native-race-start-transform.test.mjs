import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceStartTransform,decodeNativeRaceStartTransform} from '../native-race-start-transform.js';
const view=new DataView(new ArrayBuffer(4));
const bits=v=>{view.setFloat32(0,v,false);return view.getUint32(0,false);};
const float=v=>{view.setUint32(0,v,false);return view.getFloat32(0,false);};
const input=()=>({forwardNative:{x:0,y:0,z:1},upNative:{x:0,y:1,z:0},positionNative:{x:0,y:0,z:0}});
function packedFromSigned(values){
 const bytes=new DataView(new ArrayBuffer(64));
 values.forEach((v,i)=>{bytes.setUint16(i*2,v>>>16,false);bytes.setUint16(32+i*2,v&65535,false);});
 return Array.from({length:16},(_,i)=>bytes.getUint32(i*4,false));
}

test('identity uses native right/up/forward/translation rows and actual split16.16 layout',()=>{
 const result=prepareNativeRaceStartTransform(input());
 assert.equal(result.complete,true);assert.equal(result.diagnostic.stage,'complete');
 assert.deepEqual(result.floatWords,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1].map(bits));
 assert.deepEqual(result.matrixWords,[0x00010000,0,1,0,0,0x00010000,0,1,0,0,0,0,0,0,0,0]);
 assert.equal(result.operations.length,48);
});

test('constructor preserves source scratch ordering and descending high/low halfword pairs',()=>{
 const result=prepareNativeRaceStartTransform(input());
 assert.deepEqual(result.operations.slice(0,16).map(v=>v.wordIndex),[8,9,10,0,1,2,4,5,6,12,13,3,7,11,15,14]);
 assert.deepEqual(result.operations.slice(16).map(v=>v.byteOffset),Array.from({length:16},(_,i)=>[30-i*2,62-i*2]).flat());
 assert.ok(result.operations.slice(16).every(v=>v.kind==='matrixHalfwordWrite'&&v.width===2));
});

test('translation stays native and negative fractions occupy separate signed integer halves',()=>{
 const q=input();q.positionNative={x:12.5,y:-7.25,z:3.125};const result=prepareNativeRaceStartTransform(q),decoded=decodeNativeRaceStartTransform(result);
 assert.equal(result.matrixWords[6],0x000cfff8);assert.equal(result.matrixWords[7],0x00030001);
 assert.equal(result.matrixWords[14],0x8000c000);assert.equal(result.matrixWords[15],0x20000000);
 assert.deepEqual(decoded.positionNative,q.positionNative);assert.deepEqual(decoded.frameNative,{right:{x:1,y:0,z:0},up:{x:0,y:1,z:0},forward:{x:0,y:0,z:1}});
});

test('nonunit forward and oblique up produce source orthogonal axes without a caller normalization',()=>{
 const q=input();q.forwardNative={x:2,y:3,z:4};q.upNative={x:1,y:2,z:3};const result=prepareNativeRaceStartTransform(q),f=result.floatWords.map(float);
 const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),right=f.slice(0,3),up=f.slice(4,7),forward=f.slice(8,11);
 for(const axis of[right,up,forward])assert.ok(Math.abs(dot(axis,axis)-1)<3e-7);
 assert.ok(Math.abs(dot(right,up))<1e-7);assert.ok(Math.abs(dot(up,forward))<1e-7);assert.ok(Math.abs(dot(right,forward))<1e-7);
 assert.ok(right[0]<0&&right[1]>0&&right[2]<0);assert.ok(up[0]<0&&up[1]<0&&up[2]>0);
 assert.ok(decodeNativeRaceStartTransform(result).floatWords.some((v,i)=>v!==result.floatWords[i]),'physical decoder sees the quantized matrix');
});

test('quarter turn maps the existing hull frame axes with forward+X and right-Z',()=>{
 const q=input();q.forwardNative={x:3,y:0,z:0};const decoded=decodeNativeRaceStartTransform(prepareNativeRaceStartTransform(q));
 assert.deepEqual(decoded.frameNative,{right:{x:0,y:0,z:-1},up:{x:0,y:1,z:0},forward:{x:1,y:0,z:0}});
});

test('zero forward preserves the untouched destination and does not demand unread vectors',()=>{
 const result=prepareNativeRaceStartTransform({forwardNative:{x:0,y:-0,z:0}});
 assert.deepEqual(result,{complete:false,floatWords:null,matrixWords:null,operations:[],diagnostic:{stage:'zero-forward'}});
 const small=prepareNativeRaceStartTransform({forwardNative:{x:1e-30,y:0,z:0}});
 assert.equal(small.diagnostic.stage,'zero-forward');assert.deepEqual(small.operations,[]);
});

test('parallel up leaves only the three normalized forward scratch writes and no packed output',()=>{
 const result=prepareNativeRaceStartTransform({forwardNative:{x:0,y:0,z:2},upNative:{x:0,y:0,z:-3}});
 assert.equal(result.diagnostic.stage,'zero-right');assert.equal(result.complete,false);
 assert.equal(result.floatWords,null);assert.equal(result.matrixWords,null);
 assert.deepEqual(result.operations,[{kind:'scratchFloatWrite',wordIndex:8,value:0},{kind:'scratchFloatWrite',wordIndex:9,value:0},
  {kind:'scratchFloatWrite',wordIndex:10,value:bits(1)}]);
});

test('source second cross can underflow after both prior axes wrote; no fallback up is fabricated',()=>{
 const result=prepareNativeRaceStartTransform({forwardNative:{x:1e-20,y:0,z:0},upNative:{x:0,y:1,z:0}});
 assert.equal(result.diagnostic.stage,'zero-up');assert.equal(result.complete,false);assert.equal(result.matrixWords,null);
 assert.deepEqual(result.operations.map(v=>v.wordIndex),[8,9,10,0,1,2]);
});

test('packing truncates toward zero and loses signed zero only at the fixed conversion',()=>{
 const q=input();q.positionNative={x:1/131072,y:-1/131072,z:-0};const result=prepareNativeRaceStartTransform(q),decoded=decodeNativeRaceStartTransform(result);
 assert.equal(result.floatWords[14],0x80000000);assert.equal(decoded.floatWords[14],0);
 assert.deepEqual(decoded.positionNative,{x:0,y:0,z:0});
});

test('signed fixed-point translation boundary is bounded without wrapping positive32768',()=>{
 const q=input();q.positionNative={x:-32768,y:32767.998046875,z:0};const decoded=decodeNativeRaceStartTransform(prepareNativeRaceStartTransform(q));
 assert.equal(decoded.positionNative.x,-32768);assert.equal(decoded.positionNative.y,32767.998046875);
 q.positionNative.x=32768;assert.throws(()=>prepareNativeRaceStartTransform(q),/signed32 matrix conversion/);
});

test('decoder performs signed32 to binary32 before dividing, including ties and extreme halfwords',()=>{
 const signed=[2147483647,-2147483648,16777217,16777219,-1,-65537,65535,65536,0,1,2,3,4,5,6,7],
  result=decodeNativeRaceStartTransform({matrixWords:packedFromSigned(signed)}),values=result.floatWords.map(float);
 assert.equal(values[0],32768);assert.equal(values[1],-32768);assert.equal(values[2],256);assert.equal(values[3],256.00006103515625);
 assert.equal(values[4],-1/65536);assert.equal(values[5],-65537/65536);assert.equal(values[6],65535/65536);
 assert.deepEqual(result.operations.map(v=>v.wordIndex),Array.from({length:16},(_,i)=>15-i));
});

test('decoder retains arbitrary rows without silently normalizing or asserting an affine matrix',()=>{
 const values=Array(16).fill(8192),result=decodeNativeRaceStartTransform({matrixWords:packedFromSigned(values)});
 assert.deepEqual(result.frameNative,{right:{x:.125,y:.125,z:.125},up:{x:.125,y:.125,z:.125},forward:{x:.125,y:.125,z:.125}});
 assert.deepEqual(result.positionNative,{x:.125,y:.125,z:.125});assert.ok(result.floatWords.every(v=>v===bits(.125)));
});

test('both APIs are detached and frozen and reject unsupported arithmetic without mutating inputs',()=>{
 const q=input(),saved=structuredClone(q),result=prepareNativeRaceStartTransform(q),packed=[...result.matrixWords],decoded=decodeNativeRaceStartTransform({matrixWords:packed});
 assert.deepEqual(q,saved);packed[0]=0;assert.equal(decoded.frameNative.right.x,1);
 assert.ok(Object.isFrozen(result.operations[0]));assert.ok(Object.isFrozen(result.floatWords));assert.ok(Object.isFrozen(decoded.frameNative.right));
 assert.throws(()=>{result.matrixWords[0]=0;},TypeError);
 for(const bad of[NaN,Infinity,1e40])assert.throws(()=>prepareNativeRaceStartTransform({...q,forwardNative:{x:bad,y:0,z:1}}),/finite float32/);
 assert.throws(()=>prepareNativeRaceStartTransform({...q,forwardNative:{x:1e30,y:0,z:1}}),/finite float32/);
 assert.deepEqual(q,saved);
});

test('decoder rejects sparse, wrong-sized, noninteger and out-of-range raw word arrays',()=>{
 for(const matrixWords of[Array(16),Array(15).fill(0),Array(17).fill(0),Array(16).fill(-1),Array(16).fill(.5),Array(16).fill(0x100000000)])
  assert.throws(()=>decodeNativeRaceStartTransform({matrixWords}),/matrix word|unsigned words/);
});
