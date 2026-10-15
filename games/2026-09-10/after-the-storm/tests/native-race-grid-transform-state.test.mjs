import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 nativeRaceGridTransformView} from '../native-race-state.js';
const ri=a=>(a-0x1f94)/4;
function fixture(scene={}){
 const raceWords1f94=Array(1693).fill(0);[0,3,1,2].forEach((v,i)=>raceWords1f94[ri(0x26c0)+i]=v);
 return createNativeRaceState({raceWords1f94,hudWords7788:Array(1442).fill(0x81234567),scene:{
  main638:1,mode620:4,courseIndex:1,racerCount:4,primaryHumanIndex:0,secondaryHumanIndex:1,
  finishSourceRow:0,directionFlag1f90:0,...scene}});
}
const node=(extra={})=>({sourceRow:0,centerNativeXZ:{x:1000,z:2000},
 forwardXZ:{x:.6,z:.8},rightXZ:{x:.8,z:-.6},...extra});

test('canonical grid order reaches the packed physical decoder without retaining another matrix owner',()=>{
 const state=fixture(),before=nativeRaceStateSnapshot(state),primaryNodes=[node()],input={racerIndex:0,primaryNodes};
 const result=nativeRaceGridTransformView(state,input);
 assert.equal(result.transform.complete,true);
 assert.deepEqual(result.placement.positionNative,{x:929.6000366210938,y:0,z:1712.800048828125});
 assert.deepEqual(result.decoded.positionNative,result.placement.positionNative);
 assert.deepEqual(result.decoded.frameNative,{right:{x:.79998779296875,y:0,z:-.5999908447265625},
  up:{x:0,y:1,z:0},forward:{x:.5999908447265625,y:0,z:.79998779296875}});
 assert.notDeepEqual(result.decoded.floatWords,result.transform.floatWords,'physical view includes16.16 quantization');
 const changed=prepareNativeRaceStateOperations(state,[{kind:'raceWordWrite',wordIndex:ri(0x26c0),value:3}]).state;
 const alternate=nativeRaceGridTransformView(changed,input);
 assert.notDeepEqual(alternate.decoded.positionNative,result.decoded.positionNative);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
 primaryNodes[0].centerNativeXZ.x=0;assert.equal(result.placement.positionNative.x,929.6000366210938);
 assert.ok(Object.isFrozen(result.decoded.frameNative.forward));assert.ok(Object.isFrozen(result.transform.matrixWords));
 assert.equal(Object.hasOwn(result,'state'),false);
});

test('course9 selected secondary uses its actual row basis for both grid and decoded orientation',()=>{
 const state=fixture({courseIndex:9,racerCount:2}),before=nativeRaceStateSnapshot(state),
  primaryNodes=[node()],secondaryNodes=[node({centerNativeXZ:{x:900,z:1200},forwardXZ:{x:1,z:0},rightXZ:{x:0,z:-1}})];
 const result=nativeRaceGridTransformView(state,{racerIndex:1,primaryNodes,secondaryNodes});
 assert.equal(result.placement.diagnostic.family,'secondary');
 assert.deepEqual(result.decoded.positionNative,{x:388,y:0,z:1196});
 assert.deepEqual(result.decoded.frameNative,{right:{x:0,y:0,z:-1},up:{x:0,y:1,z:0},forward:{x:1,y:0,z:0}});
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('training record threshold selects the diagonal constructor before fixed-point decoding',()=>{
 const state=fixture({main638:21}),training=prepareNativeRaceStateOperations(state,[
  {kind:'recordWordWrite',racerIndex:3,wordIndex:0x338/4,value:3}]).state;
 const result=nativeRaceGridTransformView(training,{racerIndex:3,
  trainingAnchorsNative:[{x:10,y:2,z:30},null,null,{x:70,y:-1,z:-20}]});
 assert.deepEqual(result.placement.forwardNative,{x:1,y:0,z:-1});
 assert.deepEqual(result.decoded.positionNative,{x:62,y:-1,z:-20});
 assert.deepEqual(result.decoded.frameNative.forward,{x:.70709228515625,y:0,z:-.70709228515625});
 assert.deepEqual(result.decoded.frameNative.right,{x:-.70709228515625,y:0,z:-.70709228515625});
 assert.equal(result.placement.diagnostic.physicalInitialization,false);
});

test('incomplete source constructors retain partial scratch writes and cannot fabricate a decoded destination',()=>{
 const state=fixture({racerCount:1}),before=nativeRaceStateSnapshot(state);
 const zero=nativeRaceGridTransformView(state,{racerIndex:0,primaryNodes:[node({forwardXZ:{x:0,z:0}})]});
 assert.equal(zero.transform.diagnostic.stage,'zero-forward');assert.deepEqual(zero.transform.operations,[]);
 assert.equal(zero.transform.matrixWords,null);assert.equal(zero.decoded,null);
 const underflow=nativeRaceGridTransformView(state,{racerIndex:0,primaryNodes:[node({forwardXZ:{x:1e-20,z:0}})]});
 assert.equal(underflow.transform.diagnostic.stage,'zero-up');
 assert.deepEqual(underflow.transform.operations.map(o=>o.wordIndex),[8,9,10,0,1,2]);
 assert.equal(underflow.decoded,null);assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('late unsupported matrix packing leaves canonical owners and supplied geometry untouched',()=>{
 const state=fixture({racerCount:1}),before=nativeRaceStateSnapshot(state),
  input={racerIndex:0,primaryNodes:[node({centerNativeXZ:{x:32768,z:0},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0}})]},saved=structuredClone(input);
 assert.throws(()=>nativeRaceGridTransformView(state,input),/signed32 matrix conversion/);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);assert.deepEqual(input,saved);
});
