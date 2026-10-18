import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeStuntRecordMenuInitialization as initialize,prepareNativeStuntRecordMenuInput as input,prepareNativeStuntRecordMenuDisplay as display} from '../native-stunt-record-menu.js';
import {prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
import {prepareNativeStuntRecordMenuFrame as frame} from '../native-stunt-record-menu-runtime.js';
import {prepareNativeContinuationMenuFrame as continuation} from '../native-continuation-menu-runtime.js';
import {prepareNativeStuntResultsMenuFrame as results} from '../native-stunt-results-menu-runtime.js';
import {prepareNativeNameMenuFrame as names,createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {nativeStuntRecordView as records} from '../native-stunt-record-view.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4,neutral={heldButtons:0,rawXNative:0,rawYNative:0},press=mask=>({...neutral,heldButtons:mask});
function fixture(rank=0){
 const s=createRace({physics:'native',mode:'stunt',course:getCourse('sunny-beach')}).nativeLaunch.snapshot();
 s.scene.gameStateAb24=56;s.scene.initLatch63c=1;s.scene.previousGameState634=42;s.raceWords1f94[ri(0x2928)]=rank;
 let q=results(s,[neutral]);q=results(q.state,[press(0x8000)]);
 for(let i=0;i<18;i++)q=results(q.state,[neutral]);
 if(rank){
  // Exercise original blank-name fallback and its record/menu exit. The full
  // physical letter-wheel path is covered in native-stunt-results-menu.test.
  const next=structuredClone(q.state);next.nameEntryWords61c4[1]=5;next.scene.initLatch63c=0;next.hudWords7788[hi(0x88e8)]=0;
  q=names(next,neutral);
 }
 assert.equal(q.state.scene.gameStateAb24,57);return q.state;
}
function ready(s){let q;for(let i=0;i<17;i++){q=frame(s,[neutral]);s=q.state;}assert.equal(q.view.phase,2);return s;}

test('Stunt records match original initialization, complete input and display caller outcomes',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-record-menu-reference.json',import.meta.url)));
 assert.equal(ref.provenance.cases,3534);
 for(const c of ref.cases){
  let s={...c.value,raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0)};
  s.hudWords7788.splice(hi(0x88f0),4,...c.value.recordMenuWords88f0);
  const q=c.scope==='input'?input(s):c.scope==='initialize'?initialize(s):display(s,ref.sourceViews),operations=[];
  for(const op of q.operations){const batch=c.expandInput&&op.consumer==='801e355c'?input(s).operations:[op];operations.push(...batch);s=apply(s,batch).state;}
  assert.deepEqual(operations,c.operations);if(c.scope==='display')assert.equal(q.displayListHead,c.displayListHead);
  assert.deepEqual(s.hudWords7788.slice(hi(0x88f0),hi(0x8900)),c.finalWords);assert.deepEqual(s.scene,c.finalScene);
 }
});

test('record rows use each course and exact rank highlight, tuning, initials and unranked current run',()=>{
 const s=structuredClone(fixture());
 for(let course=0;course<12;course++)for(let i=0;i<3;i++)s.raceWords1f94.splice(ri(0x26e8+course*48+i*16),4,course*10000+(3-i)*1000,i,i%2,0x41424300+i*0x1000000);
 s.raceWords1f94[ri(0x26d0)]=999;s.scene.metadataCb32c=1;
 for(let course=0;course<12;course++)for(let rank=0;rank<=3;rank++){
  s.scene.courseIndex=course;s.raceWords1f94[ri(0x2928)]=rank;const book=records(s,{ridersBySlot:[3]});
  assert.equal(book.rows.length,rank?3:4);
  for(let i=0;i<3;i++)assert.deepEqual(book.rows[i],{kind:'rank',rank:i+1,score:course*10000+(3-i)*1000,rider:i,tuned:!!(i%2),
   initials:['ABC','BBC','CBC'][i],offset:i%2?'xB':'xA',highlight:rank===i+1?(rank===1?'record':'current'):'none'});
  if(!rank)assert.deepEqual(book.rows[3],{kind:'current',score:999,rider:3,tuned:true,initials:'',offset:'xB',highlight:'current'});
 }
});

test('all48 course/rank row selections match the complete original3698 drawing body',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-record-draw-reference.json',import.meta.url)));
 assert.equal(ref.cases.length,48);
 for(const c of ref.cases){
  const s={raceWords1f94:Array(1693).fill(0),scene:{courseIndex:c.course,primaryHumanIndex:0,metadataCb32c:c.currentTuned}};
  s.raceWords1f94[ri(0x2928)]=c.rank;s.raceWords1f94[ri(0x26d0)]=c.currentScore;
  c.rows.forEach((row,i)=>s.raceWords1f94.splice(ri(0x26e8+c.course*48+i*16),4,...row));
  const rows=records(s,{ridersBySlot:[c.currentRider]}).rows;
  assert.deepEqual(rows.map(r=>r.score),c.scores);assert.deepEqual(rows.map(r=>r.rider),c.riders);
  assert.deepEqual(rows.map(r=>({none:0,record:4,current:6})[r.highlight]),c.colors);
  assert.deepEqual(rows.map(r=>r.tuned),c.tuneFormats.map(v=>[0x8022638c,0x8022639c].includes(v)));
  assert.deepEqual(rows.slice(0,3).map(r=>r.initials),c.namePointers.map(a=>{const word=s.raceWords1f94[ri(a&65535)];return String.fromCharCode(word>>>24,word>>>16&255,word>>>8&255);}));
 }
});

test('entry plays its source cue once, waits at slide equality, and ignores player2 confirmation',()=>{
 let s=fixture(),q=frame(s,[press(0x8000),neutral]);s=q.state;
 assert.deepEqual([q.draw.phase,q.draw.xA,q.draw.xB,q.view.phase,q.view.xA,q.view.xB],[0,320,-264,1,320,-280]);
 assert.equal(q.effects.filter(e=>e.consumer==='800c37f4').length,1);assert.equal(s.scene.initLatch63c,0);
 for(let i=0;i<15;i++){q=frame(s,[neutral]);s=q.state;assert.equal(q.effects.some(e=>e.consumer==='800c37f4'),false);}
 assert.equal(q.view.phase,1);assert.equal(q.view.xA,20);q=frame(s,[neutral]);s=q.state;assert.equal(q.view.phase,2);
 q=frame(s,[neutral,press(0xb000)]);assert.equal(q.view.phase,2);
 q=frame(q.state,[press(0x8000),neutral]);assert.equal(q.draw.phase,2);assert.equal(q.view.phase,3);
});

test('qualified and unqualified records enter all four continuation destinations after source fade with Stunt-only save ordering',()=>{
 for(const rank of [0,1,2,3])for(const [selection,destination,target]of [[0,'retry',40],[1,'rider',10],[2,'course',20],[3,'title',2]]){
  let s=ready(fixture(rank)),q=frame(s,[press(0x8000)]);s=q.state;
  for(let i=0;i<18;i++){q=frame(s,[neutral]);s=q.state;}
  assert.equal(s.scene.gameStateAb24,80);assert.equal(s.scene.previousGameState634,57);assert.equal(q.view.active,false);
  for(let i=0;i<13;i++){q=continuation(s,[neutral]);s=q.state;}
  assert.equal(q.view.count,4);assert.equal(q.view.phase,1);
  for(let i=0;i<selection;i++){s=continuation(s,[press(0x400)]).state;s=continuation(s,[neutral]).state;}
  q=continuation(s,[press(0x8000)]);s=q.state;assert.equal(q.handoff,null);assert.equal(s.scene.returnState630,target);
  for(let tick=1;tick<=12;tick++){q=continuation(s,[neutral]);s=q.state;if(tick<12)assert.equal(q.handoff,null);}
  assert.equal(q.handoff.destination,destination);assert.equal(q.diagnostic.recordsPersisted,false);
  const save=q.operations.findIndex(op=>op.consumer==='8007c0b8');assert.equal(save>=0,rank!==0);
  assert.equal(q.effects.some(op=>['8007bea4','8007c204'].includes(op.consumer)),false);
  if(rank){const targetIndex=destination==='retry'?q.operations.findIndex(op=>op.consumer===q.handoff.consumer):q.operations.findIndex(op=>op.kind==='sourceWordWrite'&&op.field==='gameStateAb24'&&op.value===target);assert.ok(targetIndex>save);}
  if(destination==='rider')assert.equal(q.handoff.selectedRider,0);
 }
});

test('record timing is refresh-rate independent and options pauses discard elapsed menu time',()=>{
 const initial=fixture();let expected;
 for(const hz of [30,60,144]){
  let s=initial,ticks=0;const clock=createNativeNameMenuClock();
  for(let i=0;i<hz*5&&s.scene.gameStateAb24===57;i++){
   if(i===10){const before=s;clock.advance(30,false,()=>{throw Error('Paused menu advanced');});assert.equal(s,before);}
   clock.advance(1/hz,true,()=>{s=frame(s,[ticks===18?press(0x8000):neutral]).state;ticks++;if(s.scene.gameStateAb24!==57)return false;});
  }
  assert.equal(ticks,37);if(expected)assert.deepEqual(s,expected);else expected=s;
 }
});

test('late invalid drawing data is atomic and fresh runtime keeps the record menu inactive',()=>{
 const s=fixture(),before=structuredClone(s);
 assert.throws(()=>display(s,{externalReturns:{'8008fb74':0x81000000,'800949b8':3}}),/aligned/);assert.deepEqual(s,before);
 assert.throws(()=>frame(s,[]),RangeError);
 const runtime=createRace({physics:'native',mode:'stunt',course:getCourse('sunny-beach')}).nativeLaunch;
 assert.equal(runtime.stuntRecordMenuView().active,false);assert.throws(()=>runtime.advanceStuntRecordMenu([neutral]),/state57/);
});
