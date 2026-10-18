import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRecordsMenuPhase as phase} from '../native-records-menu-runtime.js';
import {prepareNativeRaceMenuInputAdvance,prepareNativeRaceMenuInitializationUpdate,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {prepareNativeRaceMenuInitialization} from '../native-race-menu-initialization.js';
import {createNativeRecordsMenuWords,NATIVE_RECORDS_MENU_DATA} from '../native-records-menu-data.js';
import {createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const presentation=JSON.parse(readFileSync(new URL('./fixtures/native-records-presentation.json',import.meta.url),'utf8'));
const entry=JSON.parse(readFileSync(new URL('./fixtures/native-records-return-entry.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x80c0)/4,hi=a=>(a-0x7788)/4,neutral={heldButtons:0,rawXNative:0,rawYNative:0};
const views={...presentation.sourceViews,transformWord821c:0x3f000000,connectedMask4340:1};
function fixture(){
 const s=structuredClone(seed);Object.assign(s.scene,{gameStateAb24:66,main638:12,initLatch63c:1,previousGameState634:60,fieldAb2c:17,fieldAa08:0,fieldE5134:255});
 s.recordsBrowserWords80c0=[...presentation.baseRecords];s.recordsBrowserWords80c0[ix(0x80ec)]=10;s.recordsBrowserWords80c0[ix(0x810c)]=10;
 s.raceWords1f94=[...presentation.raceWords1f94];s.hudWords7788.fill(0);return s;
}
function step(s,held=0,v=views){
 const q=prepareNativeRaceMenuInputAdvance(s,{rawControllers:[{...neutral,heldButtons:held}],controllerCount4344:1,connectedMask4340:1,
  controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 return phase(q.state,v);
}
test('menu60 initializer matches original ordered writes and calls without changing players or simulation',()=>{
 for(const c of entry.cases)assert.deepEqual(prepareNativeRaceMenuInitialization({scene:{gameStateAb24:c.previous}},{consumer:'801ec304'}).operations,c.operations);
 const s=fixture(),before=structuredClone(s),q=prepareNativeRaceMenuInitializationUpdate(s,{consumer:'801ec304'},
  {fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)});
 assert.equal(q.state.scene.gameStateAb24,60);assert.equal(q.state.scene.main638,7);assert.equal(q.state.scene.fieldE5134,0);
 for(const k of ['players','simulation648','phase650','field64c'])assert.equal(q.state.scene[k],s.scene[k]);
 assert.equal(q.state.hudWords7788[hi(0x7c80)],s.hudWords7788[hi(0x7c80)]);
 assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'800c21f4',arguments:[9,0]}]);assert.deepEqual(s,before);
 assert.throws(()=>prepareNativeRaceStateOperations(s,[{kind:'sourceByteWrite',field:'fieldE5134',value:256}]),/byte/);
 assert.throws(()=>prepareNativeRaceStateOperations(s,[{kind:'sourceWordWrite',field:'fieldE5134',value:0}]),/word/);
 assert.throws(()=>prepareNativeRaceStateOperations(s,[{kind:'sourceByteWrite',field:'players',value:0}]),/byte/);
});
test('first entry clears black and suppresses input; following draw precedes category changes',()=>{
 const s=fixture();let q=step(s,0x8000);
 assert.deepEqual(entry.firstClear,{rgba:[0,0,0,255],targets:3,rectangle:[0,0,319,239]});
 assert.equal(q.draw.kind,'black');assert.equal(q.draw.records,null);assert.equal(q.state.scene.initLatch63c,0);
 assert.equal(q.state.scene.fieldAb2c,17);assert.equal(q.view.stage,0);
 q=step(q.state);q=step(q.state,0x100);
 assert.equal(q.draw.kind,'records');assert.deepEqual(q.draw.records.commands[0],{kind:'clip',x1:8,y1:20,x2:311,y2:219});
 assert.equal(q.draw.view.category,0);assert.equal(q.view.category,1);assert.equal(q.state.scene.fieldAb2c,0);
 assert.equal(q.draw.records.commands.some(c=>c.kind==='riderPreview'),false);
});
test('ordinary controller edges navigate overview, course slides, record types and back',()=>{
 let q=step(fixture());q=step(q.state,0x8000);assert.equal(q.view.stage,1);assert.equal(q.view.cursor,1);
 q=step(q.state);q=step(q.state,0x8000);assert.equal(q.view.sliding,true);assert.equal(q.draw.view.sliding,false);
 for(let tick=1;tick<=11;tick++){
  q=step(q.state,tick===1?0x4000:0);
  assert.equal(q.view.sliding,tick<11);
  assert.equal(q.riderPresentation.filter(c=>c.kind==='riderViewport').length,8);
 }
 assert.equal(q.view.course,views.courseOrderAad8[1]);assert.equal(q.view.recordType,1);
 assert.equal(q.draw.records.panelSlots.length,1);
 q=step(q.state,0x100);assert.equal(q.view.sliding,true);assert.equal(q.draw.view.recordType,1);
 for(let i=0;i<11;i++)q=step(q.state);
 assert.equal(q.view.recordType,2);assert.equal(q.draw.records.commands.filter(c=>c.kind==='score').length,3);
 q=step(q.state,0x400);for(let i=0;i<8;i++)q=step(q.state);
 assert.equal(q.view.course,views.courseOrderAad8[2]);assert.equal(q.view.sliding,false);
 q=step(q.state,0x4000);for(let i=0;i<11;i++)q=step(q.state);
 assert.equal(q.view.course,10);assert.equal(q.view.category,1);assert.equal(q.view.stage,1);
});
test('post-name reverse entry and all three exits wait for the original fade and enter once',()=>{
 for(const destination of [2,60,80]){
  const s=fixture();if(destination!==60){s.scene.previousGameState634=101;s.scene.reverseDab68=1;s.scene.fieldAa08=destination===2?1:0;}
  let q=step(s);if(destination!==60){assert.equal(q.view.postRace,true);assert.equal(q.view.recordType,3);}
  q=step(q.state,destination===60?0x4000:0x8000);
  assert.equal(q.state.scene.returnState630,destination);assert.equal(q.view.exiting,true);assert.equal(q.draw.view.exiting,false);
  let ticks=0;while(!q.handoff&&ticks<100){
   q=step(q.state);const original=entry.exitFade[ticks];ticks++;
   assert.deepEqual({kind:q.draw.view.fade.kind,stage:q.draw.view.fade.stage,completion:q.draw.view.fade.completion,alpha:q.draw.view.fade.rgba[3]},
    {kind:original.kind,stage:original.stage,completion:original.completion,alpha:original.alpha});
  }
  // One start tick, six rate4 alpha ticks (counter0..5), one completion tick.
  assert.equal(ticks,8);assert.equal(q.handoff.returnState,destination);assert.equal(q.draw.view.fade.completion,1);
  assert.equal(q.state.scene.gameStateAb24,destination);assert.equal(q.view.active,false);
  assert.equal(q.operations.some(c=>c.consumer===q.handoff.consumer),false);assert.equal(q.effects.some(c=>c.consumer===q.handoff.consumer),false);
  assert.throws(()=>step(q.state),/Records phase/);
 }
});
test('record data and physical state survive navigation; late draw/initializer errors are atomic',()=>{
 let q=step(fixture());const s=q.state,before=structuredClone(s);
 assert.throws(()=>step(s,0, {...views,courseOrderAad8:[]}),/courseOrder/);assert.deepEqual(s,before);
 q=step(s,0x4000);for(let i=0;i<7;i++)q=step(q.state);
 const pending=structuredClone(q.state);
 assert.throws(()=>step(q.state,0,{...views,slotTemplateWords6c50:[]}),/slot/);assert.deepEqual(q.state,pending);
 const done=step(q.state);assert.deepEqual(done.state.raceWords1f94,s.raceWords1f94);
 assert.deepEqual(done.state.profileWordsB330,s.profileWordsB330);assert.equal(done.diagnostic.physicalWorldUpdated,false);
 assert.ok(Object.isFrozen(done.draw.records.commands));
});
test('20Hz phase timing agrees at30/60/144Hz and discards suspended elapsed time',()=>{
 let expected;
 for(const hz of [30,60,144]){
  let state=fixture(),ticks=0,handoffs=0;const clock=createNativeNameMenuClock();
  for(let frame=0;frame<600&&!handoffs;frame++){
   if(frame===5)clock.advance(20,false,()=>assert.fail('Suspended menu advanced'));
   clock.advance(1/hz,true,()=>{const q=step(state,ticks===1?0x4000:0);state=q.state;ticks++;if(q.handoff){handoffs++;return false;}});
  }
  assert.equal(handoffs,1);assert.equal(ticks,10);if(expected)assert.deepEqual(state,expected);else expected=state;
 }
});
test('fresh overlay metadata enters the real course order and remains retained across slide ticks',()=>{
 const s=fixture();s.recordsBrowserWords80c0=createNativeRecordsMenuWords();let q=step(s,0,{});
 q=step(q.state,0x8000,{});q=step(q.state,0,{});q=step(q.state,0x8000,{});
 assert.equal(q.view.sliding,true);assert.equal(q.state.recordsBrowserWords80c0[ix(0x80fc)],NATIVE_RECORDS_MENU_DATA.courseOrderAad8[1]);
 for(let i=0;i<11;i++)q=step(q.state,0,{});
 assert.equal(q.view.course,1);assert.equal(q.view.stage,1);assert.equal(q.view.sliding,false);
 assert.equal(q.draw.records.commands.find(c=>c.kind==='label').token,9);
 const another=createNativeRecordsMenuWords();another[ix(0x81a4)]=1;
 assert.equal(createNativeRecordsMenuWords()[ix(0x81a4)],0);assert.equal(q.state.recordsBrowserWords80c0[ix(0x81a4)],0);
});
