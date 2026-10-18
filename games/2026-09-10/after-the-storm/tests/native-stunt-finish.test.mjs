import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStuntFinishUpdate,
 prepareNativeRaceStuntRacerUpdate,prepareNativeRaceStuntRecords,prepareNativeRaceStuntAwardDisplay,
 nativeRaceStuntAwardsView} from '../native-race-state.js';
import {createNativePrimaryCourseData} from '../native-primary-initialization.js';
import {createNativePrimaryScratchLayout} from '../native-primary-scratch-context.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-finish-reference.json',import.meta.url)));
const racerReference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-racer-reference.json',import.meta.url)));
const ri=a=>(a-0x1f94)/4;

test('finish, lap flags, provisional result and mastery match the original tail across every case',()=>{
 for(const c of reference.cases){
  const words=Array(1693).fill(0);for(const q of c.initial)words[q.wordIndex]=q.value;
  const initial=createNativeRaceState({raceWords1f94:words,hudWords7788:Array(1442).fill(0),scene:{...c.globals,activity624:-1,mode620:11}});
  const before=nativeRaceStateSnapshot(initial),out=prepareNativeRaceStuntFinishUpdate(initial,c.input),expected=[...words];
  for(const q of c.expected.changes)expected[q.wordIndex]=q.value;
  assert.deepEqual(out.state.raceWords1f94,expected);assert.deepEqual(out.effects,c.expected.effects);
  assert.deepEqual(out.state.hudWords7788,before.hudWords7788);assert.deepEqual(out.state.scene,before.scene);
  assert.deepEqual(nativeRaceStateSnapshot(initial),before);
 }
});

function runFixture(){
 const data=createNativePrimaryCourseData({rows:[[0,0,3,0],[0,1000,2,0]],courseIndex:0,mode620:11});
 const raceWords1f94=Array(1693).fill(0);raceWords1f94[ri(0x2938)]=1;
 raceWords1f94[ri(0x2954)]=0xffffffff;raceWords1f94[ri(0x2958)]=1;
 raceWords1f94[ri(0x2bfc)]=1000;raceWords1f94[ri(0x2ab0)]=1500;raceWords1f94[ri(0x2ad4)]=1500;
 [1000,500,100].forEach((v,i)=>raceWords1f94[ri(0x26e8)+i*4]=v);
 return {nodes:data.nodes,state:createNativeRaceState({raceWords1f94,hudWords7788:Array(1442).fill(0),scene:{activity624:-1,mode620:11,main638:1,
  courseIndex:0,finishSourceRow:0,configuredLaps728:1,noFinish8178:0,primaryCount:2,state600:0,unlockAb60:0,ringCountB134:0,
  primaryHumanIndex:0,secondaryHumanIndex:1,players:1,event628:0,clockStopped817c:0,ambientD4b00:0,
  gameStateAb24:40,metadataD9b0:2,metadataCb32c:3}})};
}
function frameInput(nodes,move=0){return {nodes,racerIndex:0,move,bodyPositionNative:{x:0,y:0,z:10},
 primaryScratchLayout:createNativePrimaryScratchLayout({nodes,regionsNative:[[-10000,10000,-10000,10000]],
  weedCentersNativeXZ:Array.from({length:6},()=>({x:50000,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[0,1,0,1],cityRegionNative:[0,1,0,1]}),
 priorBodyPointNativeXZ:{x:0,z:-10},speedB90Native:10,checkpointSecondsByIndex:[30,30,30,30]};}

test('combined racer update matches complete original783AC and ordered queue calls',()=>{
 for(const [index,c]of racerReference.cases.entries()){
  const words=Array(1693).fill(0),hud=Array(1442).fill(0);
  for(const q of c.initial)words[q.wordIndex]=q.value;
  const state=createNativeRaceState({raceWords1f94:words,hudWords7788:hud,scene:c.globals});
  const before=nativeRaceStateSnapshot(state),expected=[...words],expectedHud=[...hud];
  for(const q of c.expected.raceChanges)expected[q.wordIndex]=q.value;
  for(const q of c.expected.hudChanges)expectedHud[q.wordIndex]=q.value;
  const out=prepareNativeRaceStuntRacerUpdate(state,{...frameInput(racerReference.nodes),...c.input});
  assert.deepEqual(out.state.raceWords1f94,expected,`race case${index}`);
  assert.deepEqual(out.state.hudWords7788,expectedHud,`HUD case${index}`);
  assert.deepEqual(out.effects,c.expected.effects,`effects case${index}`);
  assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});

test('racer scratch context commits nearest-node and region writes before an early retirement',()=>{
 const f=runFixture(),s=nativeRaceStateSnapshot(f.state);
 s.scene.courseIndex=5;s.scene.event628=1;
 const input={...frameInput(f.nodes),move:undefined,nodes:undefined,bodyPositionNative:{x:0,y:0,z:1000}};
 input.primaryScratchLayout=createNativePrimaryScratchLayout({nodes:f.nodes,regionsNative:[[-10000,10000,-10000,10000]],
  weedCentersNativeXZ:Array.from({length:6},()=>({x:50000,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[-100,100,900,1100],cityRegionNative:[0,1,0,1]});
 const state=createNativeRaceState(s),before=nativeRaceStateSnapshot(state),out=prepareNativeRaceStuntRacerUpdate(state,input);
 assert.equal(out.state.raceWords1f94[ri(0x2c48)],1);assert.equal(out.state.raceWords1f94[ri(0x2c54)],1);
 assert.equal(out.diagnostic.prelude.earlyReturn,true);
 assert.deepEqual(out.effects,[{kind:'courseRegionEnterCue',arguments:[]}]);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('full racer invocation settles a finish and final records wait for the actual delayed queue drain',()=>{
 const f=runFixture();let state=f.state;
 const first=prepareNativeRaceStuntRacerUpdate(state,frameInput(f.nodes,2));state=first.state;
 assert.equal(first.diagnostic.finish.finished,true);assert.equal(state.raceWords1f94[ri(0x2c2c)],1);
 assert.equal(state.raceWords1f94[ri(0x2aa0)],25);assert.equal(state.raceWords1f94[ri(0x2ad4)],1500);
 assert.equal(state.raceWords1f94[ri(0x39cc)],500);assert.equal(state.raceWords1f94[ri(0x39d0)],20);
 assert.equal(first.diagnostic.finish.provisionalPlace,2);
 assert.deepEqual(first.effects,[{kind:'externalCall',consumer:'800c1f60',arguments:[6]},{kind:'externalCall',consumer:'800c21f4',arguments:[6,1]}]);
 assert.equal(nativeRaceStuntAwardsView(state).totals.total,0);assert.equal(nativeRaceStuntAwardsView(state).slots[0].amount,45);
 assert.equal(prepareNativeRaceStuntRecords(state).applied,false);
 state=prepareNativeRaceStuntAwardDisplay(state).state;
 let recorded=null;
 for(let frame=2;frame<=45;frame++){
  const out=prepareNativeRaceStuntRacerUpdate(state,frameInput(f.nodes));state=out.state;
  assert.deepEqual(out.effects,[],'finished rider must not emit finish cues again');
  const result=prepareNativeRaceStuntRecords(state);state=result.state;
  if(result.applied){assert.equal(recorded,null);recorded=frame;}
  state=prepareNativeRaceStuntAwardDisplay(state).state;
 }
 assert.equal(recorded,44);assert.equal(nativeRaceStuntAwardsView(state).totals.total,545);
 assert.deepEqual(state.raceWords1f94.slice(ri(0x26e8)+4,ri(0x26e8)+8),[545,2,3,0]);
 assert.equal(state.raceWords1f94[ri(0x39cc)],0);assert.equal(state.raceWords1f94[ri(0x39d0)],0);
});

test('prelude early returns skip move, checkpoint and mastery while a normal no-crossing frame still checks mastery',()=>{
 const f=runFixture(),s=nativeRaceStateSnapshot(f.state);
 for(const a of [0x39e8,0x39ec,0x39f0,0x39f4,0x39f8,0x39fc,0x3a00,0x3a04])s.raceWords1f94[ri(a)]=1;
 s.scene.event628=1;
 const retired=prepareNativeRaceStuntRacerUpdate(createNativeRaceState(s),{...frameInput(f.nodes),move:undefined,nodes:undefined});
 assert.equal(retired.diagnostic.prelude.earlyReturn,true);assert.equal(retired.state.raceWords1f94[ri(0x2930)],0);
 assert.equal(retired.diagnostic.checkpoint,undefined);
 s.scene.event628=0;
 const normal=prepareNativeRaceStuntRacerUpdate(createNativeRaceState(s),{...frameInput(f.nodes),bodyPositionNative:{x:0,y:0,z:-10}});
 assert.equal(normal.diagnostic.checkpoint.crossed,false);assert.equal(normal.state.raceWords1f94[ri(0x2930)],1);
});
