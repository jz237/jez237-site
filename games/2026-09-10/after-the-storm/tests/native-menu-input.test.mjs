import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeDeviceSample,prepareNativeMenuInput,prepareNativeDeviceReset} from '../native-menu-input.js';
import {createNativeRaceState,prepareNativeRaceMenuInputAdvance,nativeRaceMenuInputView,prepareNativeRaceResultStageUpdate,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
const raw=(heldButtons=0,rawXNative=0,rawYNative=0)=>({heldButtons,rawXNative,rawYNative});
const input={connectedMask4340:3,controllerCount4344:2,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:40,thresholdYb401:40};
const state=()=>createNativeRaceState({scene:{players:1,mode608:0,gameStateAb24:42,courseIndex:1},raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),i1Words9440:Array(168).fill(0),menuWordsE658:Array(21).fill(0),deviceWords4308:Array(10).fill(0)});
const step=(s,a=raw(),b=raw(),extra={})=>prepareNativeRaceMenuInputAdvance(s,{...input,rawControllers:[a,b],...extra});

test('title device reset clears all fields only on connected ports, preserving menu history and byte neighbors',()=>{
 const start=structuredClone(state());start.deviceWords4308=Array.from({length:10},(_,i)=>0x80ff0123+i);start.menuWordsE658.fill(0xffffffff);
 const before=structuredClone(start),q=prepareNativeDeviceReset({connectedMask4340:0xaa}),next=prepareNativeRaceStateOperations(start,q.operations).state;
 const readByte=(s,i)=>(s.deviceWords4308[i>>>2]>>>(24-(i&3)*8))&255;
 for(let i=0;i<40;i++)assert.equal(readByte(next,i),[1,3].includes(Math.floor(i/10))?0:readByte(before,i));
 assert.deepEqual(q.operations.map(o=>[o.byteOffset,o.width]),[[19,1],[16,2],[14,2],[12,2],[10,2],[18,1],[39,1],[36,2],[34,2],[32,2],[30,2],[38,1]]);
 assert.deepEqual(next.menuWordsE658,before.menuWordsE658);assert.deepEqual(start,before);assert.ok(Object.isFrozen(q.operations));
 assert.deepEqual(prepareNativeDeviceReset({connectedMask4340:0xf0}).operations,[]);
 for(const mask of [-1,256,1.5,undefined])assert.throws(()=>prepareNativeDeviceReset({connectedMask4340:mask}),RangeError);
});
test('physical held edges retain prior and released buttons while disconnected devices stay untouched',()=>{
 const records=Array.from({length:4},()=>Array(10).fill(0));records[0][0]=0x80;records[2].fill(0xa5);
 const before=structuredClone(records),r=prepareNativeDeviceSample({deviceBytes4308:records,connectedMask4340:1,rawControllers:[raw(0x1000,-70,70)]});
 assert.deepEqual(r.deviceBytes4308[0],[0x10,0,0x10,0,0x80,0,0x80,0,186,70]);
 assert.deepEqual(r.deviceBytes4308[2],before[2]);assert.deepEqual(records,before);
 assert.deepEqual(r.operations.map(o=>o.byteOffset),[6,2,4,0,8,9]);
});
test('independent menu input merges player two after its directional update without merging its axes',()=>{
 const start=state(),r=step(start,raw(0x8000,0,0),raw(0x1000,40,-40)),p1=nativeRaceMenuInputView(r.state),p2=nativeRaceMenuInputView(r.state,1),both=nativeRaceMenuInputView(r.state,2);
 assert.equal(p1.pressedButtons,0x8000);assert.equal(p2.pressedButtons,0x1500);
 assert.equal(both.pressedButtons,0x9500);assert.equal(both.rawXNative,0);assert.equal(both.rawYNative,0);
 const held=step(r.state,raw(0x8000),raw(0x1000,40,-40));
 assert.equal(nativeRaceMenuInputView(held.state,1).pressedButtons,0);
 assert.equal(nativeRaceMenuInputView(held.state,1).heldButtons,0x1500);
 assert.equal(nativeRaceMenuInputView(held.state,2).heldButtons,0x9500);
 assert.equal(nativeRaceMenuInputView(held.state,1).horizontalHoldFrames,1);
 assert.deepEqual(start.menuWordsE658,Array(21).fill(0));
});
test('one controller mirrors both players; no-controller neutral input preserves source copy and hold-counter behavior',()=>{
 let s=step(state(),raw(0x2000,50,-50),raw(),{connectedMask4340:1,controllerCount4344:1}).state;
 assert.deepEqual(nativeRaceMenuInputView(s),nativeRaceMenuInputView(s,1));
 s=step(s,raw(0x2000,50,-50),raw(),{connectedMask4340:1,controllerCount4344:1}).state;
 assert.equal(nativeRaceMenuInputView(s).horizontalHoldFrames,1);
 s=step(s,raw(),raw(),{connectedMask4340:0,controllerCount4344:0}).state;
 assert.equal(nativeRaceMenuInputView(s).heldButtons,0);assert.equal(nativeRaceMenuInputView(s).horizontalHoldFrames,1);
 s=step(s,raw(0,-50),raw(),{connectedMask4340:1,controllerCount4344:1}).state;
 assert.equal(nativeRaceMenuInputView(s).pressedButtons,0x200);assert.equal(nativeRaceMenuInputView(s).horizontalHoldFrames,0);
});
test('signed hold counters wrap and threshold equality enters a direction once',()=>{
 let s=step(state(),raw(0,40,40)).state;s=structuredClone(s);s.menuWordsE658[5]=0x7fffffff;s.menuWordsE658[6]=0xffffffff;
 s=step(s,raw(0,40,40)).state;const v=nativeRaceMenuInputView(s);
 assert.equal(v.horizontalHoldFrames,-2147483648);assert.equal(v.verticalHoldFrames,0);assert.equal(v.pressedButtons,0);assert.equal(v.heldButtons,0x900);
});
test('source results consume the first menu pressed halfword after the delay and cannot retain a duplicate scene owner',()=>{
 let s=state();s=structuredClone(s);s.i1Words9440[(0x9504-0x9440)/4]=1;
 s=step(s,raw(0x1000)).state;
 const r=prepareNativeRaceResultStageUpdate(s,'802c6550',{expandTransitions:true,fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]});
 assert.equal(r.state.i1Words9440[(0x9500-0x9440)/4],1);
 assert.equal(Object.hasOwn(r.state.scene,'pressed65a'),false);
 assert.equal(nativeRaceMenuInputView(r.state).pressedButtons,0x1000);
 assert.throws(()=>createNativeRaceState({...s,scene:{...s.scene,pressed65a:0}}),/overlaps/);
});
test('malformed reached input rejects the entire frame; unused physical ports need no fabricated sample',()=>{
 const s=state(),before=structuredClone(s);
 assert.throws(()=>step(s,raw(0x8000),raw(0,128)),/raw X/);assert.deepEqual(s,before);
 assert.throws(()=>step(s,raw(),raw(),{controllerPorts4330:[0,9]}),/controller port/);assert.deepEqual(s,before);
 const r=prepareNativeDeviceSample({deviceBytes4308:Array.from({length:4},()=>Array(10).fill(0)),connectedMask4340:0});assert.deepEqual(r.operations,[]);
 assert.throws(()=>prepareNativeMenuInput({menuWordsE658:Array(21).fill(0),controllerCount4344:0,thresholdXb400:40,thresholdYb401:40,neutralBytesAb10:[]}),/10 bytes/);
});

test('live menu sampling is once per source frame across refresh rates and browser pause preserves both owners',()=>{
 function run(hz){
  const s=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}),sampled=[];
  const menuInputs=(time,frame)=>{sampled.push(frame);return [{continue:frame>=3&&frame<6,steer:frame>=8?.5:0}];};
  for(let i=0;i<hz;i++)stepNativeRaceHost(s.nativeHost,1/hz,[{}],{menuInputs});
  assert.deepEqual(sampled,Array.from({length:20},(_,i)=>i));
  const saved=s.nativeLaunch.snapshot();s.phase='paused';stepRace(s,{continue:true},.03);
  assert.deepEqual(s.nativeLaunch.snapshot(),saved);
  stepNativeRaceHost(s.nativeHost,.5,[{}],{active:false,menuInputs:()=>{throw Error('paused host sampled a menu');}});
  assert.deepEqual(s.nativeLaunch.snapshot(),saved);
  assert.equal(s.nativeLaunch.menuInputView().heldButtons,0x200,'original35 threshold includes equality after browser axis mapping');
  return {menu:saved.menuWordsE658,device:saved.deviceWords4308};
 }
 assert.deepEqual(run(30),run(60));assert.deepEqual(run(60),run(144));
});
