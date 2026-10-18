import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeChampionshipNameMenuPhase as phase,createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {prepareNativeRaceMenuInputAdvance,prepareNativeRaceMenuInitializationUpdate} from '../native-race-state.js';
import {prepareNativeNameEntryPostDisplay} from '../native-name-entry.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4,neutral={heldButtons:0,rawXNative:0,rawYNative:0};
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const views={championshipCourseRowsAc14:Array.from({length:3},()=>[0,1,2,3,4,5,6,7]),
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
function fixture(reverse=0){
 const s=structuredClone(seed);Object.assign(s.scene,{mode608:4,gameStateAb24:103,reverseDab68:reverse,freshNameAb6c:1});
 s.profileWordsB330[1]=2;s.profileWordsB330[2]=0;s.hudWords7788.fill(0);
 for(let a=0x2660;a<0x26c0;a+=4)s.raceWords1f94[ri(a)]=0;
 s.raceWords1f94[ri(0x2660)]=1;s.raceWords1f94[ri(0x2664)]=2;s.raceWords1f94[ri(0x2698)]=1;
 return prepareNativeRaceMenuInitializationUpdate(s,{consumer:'801ec9c8'},views).state;
}
// This deliberately isolates numeric menu behavior. The production host still
// owes main6 scene updates between sampling and the phase.
function step(s,held=0,second=0,v=views){
 const q=prepareNativeRaceMenuInputAdvance(s,{rawControllers:[{...neutral,heldButtons:held},{...neutral,heldButtons:second}],
  controllerCount4344:2,connectedMask4340:3,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),
  thresholdXb400:s.scene.gameStateAb24===100?50:35,thresholdYb401:35});
 return phase(q.state,v);
}
function ready(reverse=0){let q=step(fixture(reverse));for(let i=1;i<31;i++)q=step(q.state);assert.equal(q.view.phase,1);return q.state;}
function exitReady(reverse=0){
 const s=structuredClone(ready(reverse));s.nameEntryWords61c4[1]=5;s.hudWords7788[hi(0x88e8)]=0x41424300;return step(s);
}

test('ending return fades from white, initializes once and accepts letters before immediate championship exit',()=>{
 let q=step(fixture()),state=q.state;assert.equal(q.draw.view.fade.kind,7);assert.equal(q.draw.view.fade.rgba[3],255);
 assert.equal(state.scene.initLatch63c,0);assert.equal(q.draw.matrices.length,16);
 for(let i=1;i<31;i++){q=step(state);state=q.state;}
 assert.equal(q.view.phase,1);assert.equal(q.view.fade.kind,0);
 q=step(state,0,0x8000);state=q.state;assert.equal(q.view.phase,1);
 for(let letter=1;letter<=3;letter++){
  q=step(state,0x8000);state=q.state;assert.equal(q.draw.view.phase,1);assert.equal(q.view.phase,4);
  for(let i=0;i<16;i++){q=step(state,0x8000);state=q.state;}
  assert.equal(q.view.initials,'A'.repeat(letter));q=step(state);state=q.state;
 }
 for(let i=0;i<200&&!(q.view.phase===1&&q.view.labels[q.view.selected]==='END');i++){q=step(state);state=q.state;}
 assert.equal(q.view.labels[q.view.selected],'END');q=step(state,0x8000);state=q.state;
 for(let i=1;i<=16;i++){
  q=step(state);state=q.state;assert.equal(q.view.exiting,i===16);
 }
 assert.equal(q.draw.view.exiting,false);assert.equal(q.draw.view.phase,5);
 assert.equal(q.view.fade.kind,1);assert.equal(q.state.scene.returnState630,66);assert.equal(q.state.scene.field700,0x41414100);
 assert.equal(q.handoff,null);assert.equal(q.operations.some(o=>['801e2530','801e2c14','800ca210','801e2b8c'].includes(o.consumer)),false);
 const record=q.operations.findIndex(o=>o.kind==='raceByteWrite'),name=q.operations.findIndex(o=>o.field==='field700'),exit=q.operations.findIndex(o=>o.field==='gameStateAb24'&&o.value===101);
 assert.ok(record>=0&&name>record&&exit>name);
 for(const address of [0x1ff0+16,0x1ff0+60+36,0x22c0+40+16])assert.equal(state.raceWords1f94[ri(address)],0x41414100);
});

test('38 delayed fade ticks precede ordered normal/reverse saves and exactly one records-browser initializer',()=>{
 for(const reverse of [0,65535]){
  let q=exitReady(reverse);const saved=structuredClone(q.state.raceWords1f94);
  for(let tick=1;tick<=38;tick++){
   q=step(q.state,0xb000,0xb000);
   assert.equal(q.effects.filter(o=>['8007bea4','8007c204'].includes(o.consumer)).length,tick===38?3:0);
   if(tick<38){assert.equal(q.handoff,null);assert.equal(q.state.scene.gameStateAb24,101);}
  }
  assert.equal(q.draw.view.fade.completion,1);assert.equal(q.handoff.destination,'records-browser');assert.equal(q.view.active,false);
  assert.equal(q.state.scene.gameStateAb24,66);assert.equal(q.state.scene.main638,12);assert.equal(q.state.scene.previousGameState634,101);
  assert.equal(q.view.fade.kind,2);assert.equal(q.state.scene.initLatch63c,1);
  const saves=q.effects.filter(o=>['8007bea4','8007c204'].includes(o.consumer));
  assert.deepEqual(saves.map(o=>[o.consumer,...o.arguments]),[0,1,2].map(c=>[reverse?'8007c204':'8007bea4',c]));
  const lastSave=q.operations.findLastIndex(o=>o.consumer===saves[0].consumer),entry=q.operations.findIndex(o=>o.field==='gameStateAb24'&&o.value===66);
  assert.ok(entry>lastSave);assert.equal(q.effects.some(o=>o.consumer==='801ec500'),false);
  assert.equal(q.diagnostic.recordsPersisted,false);assert.deepEqual(q.state.raceWords1f94,saved);
  assert.throws(()=>step(q.state),/Championship name phase/);
 }
});

test('warm-up qualification differs from saving and repeated rounds remain repeated storage requests',()=>{
 const s=structuredClone(fixture());s.profileWordsB330[1]=0;s.raceWords1f94[ri(0x2664)]=0;s.raceWords1f94[ri(0x2698)]=0;
 const q=step(s);assert.equal(q.state.nameEntryWords61c4[(0x61f8-0x61c4)/4],0);
 const done=structuredClone(q.state);done.scene.gameStateAb24=101;done.hudWords7788[hi(0x8a14)]=1;
 assert.deepEqual(prepareNativeNameEntryPostDisplay(done,views).operations.map(o=>[o.consumer,...o.arguments]),[['8007bea4',0],['801ec500']]);
 done.profileWordsB330[1]=2;const repeated={...views,championshipCourseRowsAc14:Array.from({length:3},()=>Array(8).fill(0))};
 assert.deepEqual(prepareNativeNameEntryPostDisplay(done,repeated).operations.map(o=>o.consumer),['8007bea4','8007bea4','8007bea4','801ec500']);
});

test('blank initials restore the profile before record writes and preserve the fifth null byte',()=>{
 const s=structuredClone(ready());s.nameEntryWords61c4[1]=5;s.hudWords7788[hi(0x88e8)]=0;s.scene.metadataD9b0=0;
 s.saveWordsB280[6]=0x58495a00;s.raceWords1f94[ri(0x1ff0+20)]=0xaabbccdd;
 const q=step(s);assert.equal(q.state.scene.field700,0x58495a00);assert.equal(q.state.scene.freshNameAb6c,1);
 assert.equal(q.state.raceWords1f94[ri(0x1ff0+16)],0x58495a00);assert.equal(q.state.raceWords1f94[ri(0x1ff0+20)],0x00bbccdd);
});

test('paused and30/60/144Hz schedules keep identical canonical outro and a single handoff',()=>{
 const initial=exitReady().state;let expected;
 for(const hz of [30,60,144]){
  let state=initial,ticks=0,handoffs=0;const clock=createNativeNameMenuClock();
  for(let frame=0;frame<400&&!handoffs;frame++){
   if(frame===5)clock.advance(30,false,()=>assert.fail('Suspended phase advanced'));
   clock.advance(1/hz,true,()=>{const q=step(state);state=q.state;ticks++;if(q.handoff){handoffs++;return false;}});
  }
  assert.equal(ticks,38);assert.equal(handoffs,1);if(expected)assert.deepEqual(state,expected);else expected=state;
 }
});

test('late record and records-browser failures leave all supplied owners unchanged',()=>{
 const s=structuredClone(ready());s.nameEntryWords61c4[1]=5;s.hudWords7788[hi(0x88e8)]=0x41424300;s.raceWords1f94[ri(0x2664)]=4;
 const before=structuredClone(s);assert.throws(()=>step(s),/record rank/);assert.deepEqual(s,before);
 let q=exitReady();for(let i=0;i<37;i++)q=step(q.state);
 const pending=structuredClone(q.state);assert.throws(()=>step(q.state,0,0,{...views,slotTemplateWords6c50:[]}),/slotTemplate/);assert.deepEqual(q.state,pending);
 assert.ok(Object.isFrozen(q.draw.matrices));assert.equal(q.diagnostic.sceneUpdated,false);
});
