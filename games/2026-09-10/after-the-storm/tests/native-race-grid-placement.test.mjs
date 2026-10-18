import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceGridPlacement as prepare,selectNativeRaceComputerProfile as computer} from '../native-race-grid-placement.js';

const node=(sourceRow=0,extra={})=>({sourceRow,centerNativeXZ:{x:100,z:200},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},classification98:0,...extra});
const base=(extra={})=>({main638:1,racerIndex:0,racerCount:4,courseIndex:1,mode620:1,primaryNodes:[node()],finishSourceRow:0,...extra});
const unused=()=>{throw new Error('unused source input was read');};
const xz=(x,z)=>({x,y:0,z});

test('single racer course0 and mode11 use distinct original fore offsets',()=>{
 assert.deepEqual(prepare(base({racerCount:1})).positionNative,xz(100,-312));
 assert.deepEqual(prepare(base({racerCount:1,courseIndex:0,mode620:4})).positionNative,xz(100,-824));
 assert.deepEqual(prepare(base({racerCount:1,courseIndex:0,mode620:11})).positionNative,xz(100,-312));
});

test('two-racer offsets follow selected primary and course0 slot spacing',()=>{
 for(const [slot,course,x,z]of [[0,1,104,-312],[1,1,200,-312],[0,0,104,-824],[1,0,200,-920]]){
  const input=base({racerCount:2,racerIndex:slot,courseIndex:course,primaryHumanIndex:1});Object.defineProperty(input,'mode620',{get:unused});
  const v=prepare(input);
  assert.deepEqual(v.positionNative,xz(x,z));
 }
});

test('race order and direction select stagger without changing the source row basis',()=>{
 const input=base({mode620:4,order26c0:[3,0,1,2],directionFlag1f90:0});
 const normal=[[56,-312],[216,-72],[88,-152],[184,-232]],reverse=[[144,-312],[-16,-72],[112,-152],[16,-232]];
 for(let i=0;i<4;i++){
  assert.deepEqual(prepare({...input,racerIndex:i}).positionNative,xz(...normal[i]));
  const v=prepare({...input,racerIndex:i,directionFlag1f90:-1});assert.deepEqual(v.positionNative,xz(...reverse[i]));
  assert.deepEqual(v.forwardNative,{x:0,y:0,z:1});assert.deepEqual(v.upNative,{x:0,y:1,z:0});
 }
});

test('main0 uses its own fore order and never reads mode/order selectors',()=>{
 for(const [racerIndex,x,z]of [[0,216,8],[3,88,-232]]){
  const input=base({main638:0,racerIndex});Object.defineProperties(input,{mode620:{get:unused},order26c0:{get:unused}});
  assert.deepEqual(prepare(input).positionNative,xz(x,z));
 }
});

test('course9 selected secondary reads secondary finish row even when human selectors alias',()=>{
 const input=base({racerCount:2,courseIndex:9,primaryHumanIndex:1,secondaryHumanIndex:1,
  secondaryNodes:[node(0,{centerNativeXZ:{x:900,z:1200},forwardXZ:{x:1,z:0},rightXZ:{x:0,z:-1}})]});
 const v=prepare({...input,racerIndex:1});assert.equal(v.diagnostic.family,'secondary');assert.deepEqual(v.positionNative,xz(388,1100));
 assert.deepEqual(prepare(input).positionNative,xz(104,-312));
});

test('main8 course1 reverses stagger order and always uses primary family',()=>{
 const expected=[[56,-312],[184,-232],[88,-152],[216,-72]],input=base({main638:8});
 for(let slot=0;slot<4;slot++){
  const v=prepare({...input,racerIndex:slot});assert.deepEqual(v.positionNative,xz(...expected[slot]));assert.equal(v.diagnostic.family,'primary');
 }
});

test('main8 scans the active primary prefix for its first classification match',()=>{
 const nodes=Array.from({length:6},(_,i)=>node(i,{centerNativeXZ:{x:i*100,z:i*200},classification98:i===4||i===5?12:0}));
 const v=prepare({main638:8,racerIndex:1,courseIndex:9,demoOffset5438:0,primaryCount:6,primaryNodes:nodes});
 assert.equal(v.diagnostic.sourceRow,4);assert.equal(v.diagnostic.branch,'main8-classification');assert.deepEqual(v.positionNative,xz(400,800));
 // It does not use finish row, selected secondary, lateral basis or later nodes.
 delete nodes[4].rightXZ;nodes[5]=null;
 assert.deepEqual(prepare({main638:8,racerIndex:1,courseIndex:9,demoOffset5438:0,primaryCount:6,primaryNodes:nodes}).positionNative,xz(400,800));
});

test('failed demo scan uses masked stored row even outside the active prefix',()=>{
 const primaryNodes=Array.from({length:4},(_,i)=>node(i,{centerNativeXZ:{x:i*10,z:i*20}}));
 for(const primaryCount of [-2147483648,-1,0,1]){
  const v=prepare({main638:8,racerIndex:3,courseIndex:0,demoOffset5438:2147483647,primaryCount,primaryNodes});
  assert.equal(v.diagnostic.sourceRow,2);assert.deepEqual(v.positionNative,xz(20,40));assert.equal(v.diagnostic.branch,'main8-fallback');
 }
});

test('main21 ending reads actual XYZ anchor and preserves unnormalized diagonal forward',()=>{
 const anchors=[{x:10,y:2,z:30},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:70,y:-1,z:-20}];
 for(const endingRank2c70 of [-2147483648,2,3,2147483647]){
  const v=prepare({main638:21,racerIndex:0,endingRank2c70,endingAnchorsNative:anchors,get courseIndex(){return unused();}});
  assert.deepEqual(v.positionNative,endingRank2c70<3?{x:2,y:2,z:30}:{x:62,y:-1,z:-20});
  assert.deepEqual(v.forwardNative,{x:1,y:0,z:endingRank2c70<3?0:-1});assert.equal(v.diagnostic.matrixEvaluated,false);
 }
});

test('source float32 grouping is preserved instead of flattened vector summation',()=>{
 const primaryNodes=[node(0,{centerNativeXZ:{x:1000,z:2000},forwardXZ:{x:.6,z:.8},rightXZ:{x:.8,z:-.6}})];
 const v=prepare(base({primaryNodes}));assert.deepEqual(v.positionNative,{x:785.6000366210938,y:0,z:1520.800048828125});
 assert.notEqual(v.positionNative.x,Math.fround(Math.fround(1000+Math.fround(Math.fround(.6)*-512))+Math.fround(116*Math.fround(.8))));
 const signed=[node(0,{centerNativeXZ:{x:-0,z:-0},forwardXZ:{x:-0,z:0},rightXZ:{x:0,z:-0}})];
 const q=prepare(base({primaryNodes:signed,racerCount:1,mode620:11}));assert.equal(Object.is(q.forwardNative.x,-0),true);
});

test('returned matrix call arguments are detached/frozen and cannot initialize physics',()=>{
 const input=base(),copy=structuredClone(input),v=prepare(input);assert.deepEqual(input,copy);
 input.primaryNodes[0].centerNativeXZ.x=999;assert.deepEqual(v.positionNative,xz(216,-312));
 assert.equal(v.matrixRecipe.consumer,'80048854');assert.equal(v.diagnostic.physicalInitialization,false);
 assert.equal(Object.isFrozen(v.matrixRecipe),true);assert.equal(Object.isFrozen(v.positionNative),true);
 assert.throws(()=>{v.forwardNative.z=9;},TypeError);
});

test('invalid active indices, missing actual geometry and sparse order words reject',()=>{
 assert.throws(()=>prepare(base({racerCount:2,racerIndex:2})),/racerIndex/);
 assert.throws(()=>prepare(base({primaryNodes:[node(1)]})),/source array order/);
 assert.throws(()=>prepare(base({primaryNodes:[node(0,{rightXZ:undefined})]})),/rightXZ/);
 assert.throws(()=>prepare(base({primaryNodes:[node(0,{forwardXZ:{x:Infinity,z:1}})]})),/finite float32/);
 assert.throws(()=>prepare(base({mode620:4,order26c0:[0,,2,3],directionFlag1f90:0})),/order26c0/);
 assert.throws(()=>prepare({main638:8,racerIndex:3,courseIndex:0,demoOffset5438:0,primaryCount:0,primaryNodes:[node()]}),/source row/);
 assert.throws(()=>prepare({main638:21,racerIndex:0,endingRank2c70:3,endingAnchorsNative:[{x:0,y:0,z:0}]}),/ending anchor/);
});

test('computer profile source main0/8 branches need no human identity or input origin',()=>{
 for(const main638 of [0,8])assert.equal(computer({main638,racerIndex:3}),true);
 const p={main638:1,racerIndex:0,primaryHumanIndex:0,field4964:0,simulation648:1};
 assert.equal(computer(p),false);assert.equal(computer({...p,simulation648:2}),true);assert.equal(computer({...p,field4964:65535}),true);
 assert.equal(computer({...p,main638:4,field4964:65535,get simulation648(){return unused();}}),false);
});

test('primary selection wins aliasing and secondary follows actual simulation/player word gates',()=>{
 const p={main638:1,racerIndex:0,primaryHumanIndex:0,secondaryHumanIndex:0,field4964:0,simulation648:1,players:1};
 assert.equal(computer(p),false);
 const secondary={main638:1,racerIndex:1,primaryHumanIndex:0,secondaryHumanIndex:1,simulation648:1,players:1};
 assert.equal(computer(secondary),true);assert.equal(computer({...secondary,players:2}),false);assert.equal(computer({...secondary,players:0}),false);
 assert.equal(computer({...secondary,simulation648:2,get players(){return unused();}}),true);
 assert.equal(computer({main638:1,racerIndex:2,primaryHumanIndex:0,secondaryHumanIndex:1}),true);
 assert.throws(()=>computer({...p,field4964:-1}),/field4964/);
 assert.throws(()=>computer({...secondary,simulation648:undefined}),/simulation648/);
});
