import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeResultsMenuFrame as step} from '../native-results-menu-runtime.js';
import {prepareNativeNameMenuFrame as nameStep} from '../native-name-menu-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const neutral={heldButtons:0,rawXNative:0,rawYNative:0},press={...neutral,heldButtons:0x8000};
function fixture(){const race=createRace({physics:'native',mode:'time',course:getCourse('sunny-beach')}),state=race.nativeLaunch.snapshot();
 state.scene.gameStateAb24=50;state.scene.initLatch63c=1;state.scene.previousGameState634=100;return {race,state};}

test('original name exit enters the results slide and either physical controller can confirm',()=>{
 for(const controller of [0,1]){
  let {state}=fixture();state.scene.gameStateAb24=100;state.scene.initLatch63c=0;state.nameEntryWords61c4[1]=5;
  const hi=a=>(a-0x7788)/4;state.hudWords7788[hi(0x88e8)]=0x41424300;
  state=nameStep(state,neutral).state;assert.equal(state.scene.previousGameState634,100);
  let q;for(let i=0;i<17;i++){q=step(state,[neutral,neutral]);state=q.state;}
  assert.equal(q.view.phase,2);assert.equal(q.view.xA,20);assert.equal(q.view.xB,20);
  q=step(state,controller===0?[press,neutral]:[neutral,press]);state=q.state;
  assert.equal(q.draw.phase,2);assert.equal(q.view.phase,3);assert.equal(q.effects.filter(o=>o.consumer==='800c37f4').length,1);
  let ticks=0;while(q.view.active&&ticks++<30){q=step(state,[press,press]);state=q.state;}
  assert.equal(ticks,18);assert.equal(state.scene.gameStateAb24,80);assert.equal(state.scene.previousGameState634,50);
  assert.equal(q.diagnostic.nextMenuLoopExecuted,false);assert.equal(q.operations.some(o=>o.kind==='presentationWordWrite'),false);
  assert.throws(()=>step(state,[neutral]),/state50/);
 }
});

test('ordinary first display ignores its sampled confirmation until a fresh physical edge',()=>{
 let {state}=fixture();state.scene.previousGameState634=42;state.scene.fieldAb2c=8;
 let q=step(state,[press]);state=q.state;assert.equal(q.diagnostic.firstEntry,true);assert.equal(q.view.phase,2);assert.equal(state.scene.fieldAb2c,8);
 q=step(state,[press]);state=q.state;assert.equal(q.view.phase,2);assert.equal(state.scene.fieldAb2c,0);
 state=step(state,[neutral]).state;q=step(state,[press]);assert.equal(q.view.phase,3);
});

test('invalid state rejects the whole frame without sampling or clearing the original owner',()=>{
 const {state}=fixture();state.resultsMenuWords6d30=[4,0,0,2];state.scene.initLatch63c=0;
 delete state.scene.previousGameState634;state.scene.courseIndex=99;const before=structuredClone(state);
 assert.throws(()=>step(state,[press]),RangeError);assert.deepEqual(state,before);
 for(const raw of [[],[neutral,neutral,neutral],null])assert.throws(()=>step(fixture().state,raw),RangeError);
});

test('fresh runtime allocates a distinct results owner and exposes inactive views until handoff',()=>{
 const {race}=fixture(),runtime=race.nativeLaunch,state=runtime.snapshot();assert.deepEqual(state.resultsMenuWords6d30,[0,0,0,0]);
 assert.equal(runtime.resultsMenuView().active,false);assert.throws(()=>runtime.advanceResultsMenu([neutral]),/state50/);
 assert.deepEqual(runtime.snapshot(),state);
});
