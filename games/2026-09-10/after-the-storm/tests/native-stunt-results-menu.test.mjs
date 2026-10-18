import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeStuntResultsMenuInput as input,prepareNativeStuntResultsMenuInitialization as initialize,prepareNativeStuntResultsMenuDisplay as display} from '../native-stunt-results-menu.js';
import {prepareNativeStuntResultsMenuDisplayUpdate as displayUpdate,prepareNativeRaceStateOperations as apply,prepareNativeRaceMenuInitializationUpdate as enter} from '../native-race-state.js';
import {prepareNativeRaceMenuInitialization} from '../native-race-menu-initialization.js';
import {prepareNativeStuntResultsMenuFrame as frame} from '../native-stunt-results-menu-runtime.js';
import {prepareNativeNameMenuFrame as nameFrame} from '../native-name-menu-runtime.js';
import {captureNativeRecordSession} from '../native-record-session.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const neutral={heldButtons:0,rawXNative:0,rawYNative:0},press={...neutral,heldButtons:0x8000};
const rankIndex=(0x2928-0x1f94)/4;
function fixture(rank=0){
 const s=createRace({physics:'native',mode:'stunt',course:getCourse('sunny-beach')}).nativeLaunch.snapshot();
 s.raceWords1f94[rankIndex]=rank;s.scene.gameStateAb24=56;s.scene.initLatch63c=1;
 s.scene.previousGameState634=42;return s;
}

test('Stunt results control preserves ordered original instruction outcomes and graphics heads',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-results-control-reference.json',import.meta.url)));
 assert.equal(ref.provenance.completePrivateCases,9315);
 for(const c of ref.cases){
  const s={...c.value,raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};s.raceWords1f94[rankIndex]=c.value.recordRank??0;
  const q=c.scope==='input'?input(s):c.scope==='initialize'?initialize(s):c.expandInput?displayUpdate(s,ref.sourceViews,{expandInput:true}):display(s,ref.sourceViews);
  assert.deepEqual(q.operations,c.operations);
  if(c.scope==='display')assert.equal(q.displayListHead,c.displayListHead);
  const next=apply(s,q.operations).state;
  assert.deepEqual(next.stuntResultsMenuWords5d80,c.finalWords);assert.deepEqual(next.scene,c.finalScene);
 }
});

test('Stunt next-screen initializer matches all105 original executions without inventing resource or audio calls',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-result-return-reference.json',import.meta.url)));
 assert.equal(ref.cases.length,105);
 for(const c of ref.cases)assert.deepEqual(prepareNativeRaceMenuInitialization(c.value,c.input).operations,c.operations);
 const q=enter(fixture(),{consumer:'801ed004'});
 assert.equal(q.state.scene.gameStateAb24,57);assert.equal(q.state.scene.main638,23);
 assert.deepEqual(q.effects,[]);assert.equal(q.state.scene.previousGameState634,56);
});

test('first display consumes a held edge and shows the canonical score breakdown before controls',()=>{
 let s=fixture();for(const [address,score]of [[0x26d0,1234],[0x26d4,234],[0x26d8,400],[0x26dc,600]])s.raceWords1f94[(address-0x1f94)/4]=score;
 s.scene.fieldAb2c=9;
 let q=frame(s,[press]);s=q.state;
 assert.deepEqual(q.draw.totals,{total:1234,time:234,ring:400,trick:600});
 assert.equal(q.view.phase,2);assert.equal(q.state.scene.fieldAb2c,9);
 assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'800c6ad0',arguments:[0]}]);
 q=frame(s,[press]);assert.equal(q.view.phase,2);assert.equal(q.state.scene.fieldAb2c,0);
 s=frame(q.state,[neutral]).state;q=frame(s,[press]);
 assert.equal(q.draw.phase,2);assert.equal(q.view.phase,3);
 assert.equal(q.effects.filter(o=>o.consumer==='800c37f4').length,1);
});

test('only player1 confirms;15 slide ticks and3 delay ticks enter names only for qualifying Stunt ranks',()=>{
 for(const rank of [0,1,2,3]){
  let s=frame(fixture(rank),[neutral,neutral]).state;
  let q=frame(s,[neutral,press]);assert.equal(q.view.phase,2);
  q=frame(q.state,[press,neutral]);assert.equal(q.view.phase,3);s=q.state;
  for(let i=0;i<15;i++){q=frame(s,[neutral,neutral]);s=q.state;}
  assert.equal(q.view.phase,7);assert.equal(q.view.xA,320);assert.equal(q.view.xB,-280);assert.equal(q.view.delay,0);
  for(let i=0;i<3;i++){q=frame(s,[neutral]);s=q.state;}
  assert.equal(q.view.active,false);assert.equal(s.scene.gameStateAb24,rank?100:57);
  assert.equal(s.scene.previousGameState634,56);assert.equal(s.scene.main638,rank?6:23);
  assert.equal(q.diagnostic.nextMenuLoopExecuted,false);
  assert.throws(()=>frame(s,[neutral]),/state56/);
 }
});

test('invalid widths and late source inputs fail atomically; inactive phases still write the complementary offset',()=>{
 const s=fixture(),before=structuredClone(s);
 assert.throws(()=>apply(s,[{kind:'stuntResultsMenuWrite',byteOffset:0,width:2,value:1}]),RangeError);
 assert.throws(()=>displayUpdate(s,{displayListHead:0x81000000,externalReturns:{'80093c44':3}},{expandInput:true}),/aligned/);
 assert.throws(()=>frame(s,[]),RangeError);assert.deepEqual(s,before);
 for(const phase of [4,5,6,8,0xffffffff])assert.deepEqual(input({stuntResultsMenuWords5d80:[phase,0,100,0]}).operations,
  [{kind:'stuntResultsMenuWrite',byteOffset:12,width:4,value:(40-100)>>>0}]);
});

test('fresh runtime keeps both results overlays independent and rejects premature advancement',()=>{
 const runtime=createRace({physics:'native',mode:'stunt',course:getCourse('sunny-beach')}).nativeLaunch;
 const s=runtime.snapshot();assert.deepEqual(s.stuntResultsMenuWords5d80,[0,0,0,0]);assert.deepEqual(s.resultsMenuWords6d30,[0,0,0,0]);
 assert.equal(runtime.stuntResultsMenuView().active,false);assert.throws(()=>runtime.advanceStuntResultsMenu([neutral]),/state56/);
 assert.deepEqual(runtime.snapshot(),s);
});

test('Stunt names use the physical letter wheel and update only the selected score record before state57',()=>{
 for(const rank of [1,2,3]){
  let s=frame(fixture(rank),[neutral]).state,q;
  s=frame(s,[press]).state;
  for(let i=0;i<18;i++)s=frame(s,[neutral]).state;
  assert.equal(s.scene.gameStateAb24,100);
  const old=s.raceWords1f94.slice(),tick=(heldButtons=0)=>{q=nameFrame(s,{...neutral,heldButtons});s=q.state;};
  for(let i=0;i<31;i++)tick();
  for(let letter=1;letter<=3;letter++){
   tick(0x8000);for(let i=0;i<16;i++)tick(0x8000);tick();
   assert.equal(q.view.initials,'A'.repeat(letter));
  }
  for(let i=0;i<200&&!(q.view.phase===1&&q.view.labels[q.view.selected]==='END');i++)tick();
  assert.equal(q.view.labels[q.view.selected],'END');tick(0x8000);
  for(let i=0;i<50&&q.view.active;i++)tick();
  assert.equal(q.view.active,false);assert.equal(s.scene.gameStateAb24,57);assert.equal(s.scene.previousGameState634,100);
  const address=0x26e8+s.scene.courseIndex*48+rank*16-4,index=(address-0x1f94)/4;
  assert.equal(s.raceWords1f94[index],0x41414100);assert.equal(s.raceWords1f94[index+1]>>>24,0);
  for(let i=0;i<old.length;i++)if(i!==index&&i!==index+1)assert.equal(s.raceWords1f94[i],old[i],`unchanged word ${i}`);
  assert.equal(s.scene.field700,0x41414100);
  assert.equal(q.effects.some(e=>['801e2c14','800ca210','801ed004'].includes(e.consumer)),false);
  const retry=createRace({physics:'native',mode:'stunt',course:getCourse('sunny-beach'),nativeRecordSession:captureNativeRecordSession(s)}).nativeLaunch.snapshot();
  assert.equal(retry.raceWords1f94[index],0x41414100);assert.equal(retry.raceWords1f94[rankIndex],0);
  assert.equal(retry.raceWords1f94[(0x26d0-0x1f94)/4],0);assert.deepEqual(retry.stuntResultsMenuWords5d80,[0,0,0,0]);
 }
});
