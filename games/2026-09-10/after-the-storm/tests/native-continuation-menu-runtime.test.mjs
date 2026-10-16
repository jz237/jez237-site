import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeContinuationMenuFrame as step} from '../native-continuation-menu-runtime.js';
import {prepareNativeResultsMenuFrame as resultsStep} from '../native-results-menu-runtime.js';
import {createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const neutral={heldButtons:0,rawXNative:0,rawYNative:0},press=mask=>({...neutral,heldButtons:mask});
function fixture(){
 const race=createRace({physics:'native',mode:'time',course:getCourse('sunny-beach')}),state=race.nativeLaunch.snapshot();
 state.scene.gameStateAb24=50;state.scene.initLatch63c=1;state.scene.previousGameState634=100;
 let q;for(let i=0;i<17;i++){q=resultsStep(state,[neutral]);Object.assign(state,q.state);}
 q=resultsStep(state,[press(0x8000)]);Object.assign(state,q.state);
 while(q.view.active){q=resultsStep(state,[neutral]);Object.assign(state,q.state);}
 return {race,state};
}
function ready(state){let q;for(let i=0;i<13;i++){q=step(state,[neutral]);state=q.state;}assert.equal(q.view.phase,1);return state;}

test('results handoff slides to the original four choices and ignores player two controls',()=>{
 let {state}=fixture(),q=step(state,[neutral]);state=q.state;
 assert.deepEqual([q.draw.xA,q.draw.xB,q.view.xA,q.view.xB],[320,-169,300,-148]);
 for(let i=1;i<13;i++){q=step(state,[neutral]);state=q.state;}
 assert.deepEqual([q.view.phase,q.view.xA,q.view.xB,q.view.count],[1,76,76,4]);
 q=step(state,[neutral,press(0x8400)]);state=q.state;assert.equal(q.view.selection,0);assert.equal(q.view.exiting,false);
 q=step(state,[press(0x800)]);state=q.state;assert.equal(q.view.selection,3);
 state=step(state,[neutral]).state;q=step(state,[press(0x400)]);assert.equal(q.view.selection,0);
 assert.equal(q.operations.some(op=>op.kind==='presentationWordWrite'),false);
});

test('each choice reaches its exact destination only after twelve fade updates, preserving save ordering',()=>{
 for(const [selection,destination,target]of [[0,'retry',40],[1,'rider',10],[2,'course',20],[3,'title',2]]){
  let state=structuredClone(ready(fixture().state));state.continuationDataWords60f0[0]=selection;state.raceWords1f94[(0x2650-0x1f94)/4]=1;
  let q=step(state,[press(0x8000)]);state=q.state;
  assert.equal(q.view.exiting,true);assert.equal(q.handoff,null);assert.equal(q.view.fade.kind,5);assert.equal(state.scene.returnState630,target);
  for(let tick=1;tick<=12;tick++){
   q=step(state,[press(0x8400)]);state=q.state;
   assert.equal(q.view.selection,selection);
   if(tick<12)assert.equal(q.handoff,null);
  }
  assert.equal(q.handoff.destination,destination);assert.equal(q.view.fade.completion,1);
  const save=q.effects.findIndex(op=>op.consumer==='8007bea4'),handoff=q.effects.findIndex(op=>op.consumer===q.handoff.consumer);
  assert.ok(save>=0&&handoff>save);assert.equal(q.diagnostic.recordsPersisted,false);
  assert.equal(q.effects.find(op=>op.consumer==='800481e0').arguments[0].kind,'fadeMatrixTarget');
 }
});

test('30/60/144Hz schedules and options pauses produce the same menu/fade handoff',()=>{
 const original=fixture().state;let expected;
 for(const hz of [30,60,144]){
  let state=structuredClone(original),ticks=0,handoffs=0;const clock=createNativeNameMenuClock();
  const tick=()=>{const q=step(state,[ticks===14?press(0x8000):neutral]);state=q.state;ticks++;if(q.handoff){handoffs++;return false;}};
  for(let frame=0;frame<1000&&handoffs===0;frame++){
   if(frame===10){const before=structuredClone(state);clock.advance(30,false,tick);assert.deepEqual(state,before);}
   clock.advance(1/hz,true,tick);
  }
  assert.equal(ticks,27);assert.equal(handoffs,1);
  if(expected)assert.deepEqual(state,expected);else expected=state;
 }
});

test('launch owner rejects replay of the completed handoff and failures cannot partially commit',()=>{
 const {race,state}=fixture();
 const runtime=createNativeRaceLaunchRuntime({racers:race.racers,courseIndex:1,players:1,initialState:state});
 assert.equal(runtime.continuationMenuView().active,true);
 for(let i=0;i<13;i++)runtime.advanceContinuationMenu([neutral]);
 runtime.advanceContinuationMenu([press(0x8000)]);
 let q;for(let i=0;i<12;i++)q=runtime.advanceContinuationMenu([neutral]);
 assert.equal(q.handoff.destination,'retry');assert.equal(runtime.continuationMenuView().active,false);
 const done=runtime.snapshot();assert.throws(()=>runtime.advanceContinuationMenu([neutral]),/already handed off/);assert.deepEqual(runtime.snapshot(),done);
 const broken=structuredClone(ready(state));broken.continuationDataWords60f0[0]=99;const before=structuredClone(broken);
 assert.throws(()=>step(broken,[press(0x8000)]),/outside/);assert.deepEqual(broken,before);
 for(const raw of [[],null,[neutral,neutral,neutral]])assert.throws(()=>step(state,raw),RangeError);
});
