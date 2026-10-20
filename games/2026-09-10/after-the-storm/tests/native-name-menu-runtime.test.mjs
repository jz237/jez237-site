import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameMenuFrame as step,nativeNameMenuView,createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4,neutral={heldButtons:0,rawXNative:0,rawYNative:0};
function fixture(){
 const race=createRace({physics:'native',mode:'time',course:getCourse('sunny-beach')});
 const state=race.nativeLaunch.snapshot();state.scene.gameStateAb24=100;state.scene.initLatch63c=1;
 state.raceWords1f94[ri(0x2664)]=1;state.raceWords1f94[ri(0x2694)]=1;
 return {race,state};
}
test('live fresh memory supplies name owners and the full original introduction runs once',()=>{
 let {state}=fixture();const retained=structuredClone(state);let q;
 for(let i=0;i<31;i++){q=step(state,neutral);state=q.state;assert.equal(state.scene.initLatch63c,0);assert.equal(q.matrices.length,16);}
 assert.equal(nativeNameMenuView(state).phase,1);assert.equal(state.nameEntryWords61c4[7],0);
 assert.equal(retained.scene.initLatch63c,1);assert.equal(retained.scene.freshNameAb6c,1);
 assert.equal(q.operations.some(op=>op.kind==='presentationWordWrite'),false,'browser does not invent display-list addresses');
});
test('physical edges enter three letters, seek END, update records and leave the menu exactly once',()=>{
 let {state}=fixture(),q;const tick=(heldButtons=0)=>{q=step(state,{...neutral,heldButtons});state=q.state;return q;};
 for(let i=0;i<31;i++)tick();
 for(let letter=1;letter<=3;letter++){
  tick(0x8000);assert.equal(q.view.phase,4);
  for(let i=0;i<16;i++)tick(0x8000);
  assert.equal(q.view.initials,'A'.repeat(letter));
  tick();
 }
 for(let i=0;i<200&&!(q.view.phase===1&&q.view.labels[q.view.selected]==='END');i++)tick();
 assert.equal(q.view.labels[q.view.selected],'END');assert.equal(q.view.phase,1);
 tick(0x8000);
 for(let i=0;i<50&&q.view.active;i++)tick();
 assert.equal(q.view.active,false);assert.equal(state.scene.gameStateAb24,50);assert.equal(state.scene.field700,0x41414100);
 assert.equal(state.raceWords1f94[ri(0x1ff0+60+16)],0x41414100);assert.equal(state.raceWords1f94[ri(0x22c0+20+16)],0x41414100);
 assert.equal(q.diagnostic.recordsPersisted,false);assert.equal(q.effects.some(e=>['801e2c14','800ca210','801ec20c'].includes(e.consumer)),false);
 assert.throws(()=>tick(),/state100/);
});
test('blank exit restores profile initials before name copy and short names retain trailing destination bytes',()=>{
 for(const [name,previous,expected]of [[0,0,0x4d2e5600],[0x41000000,0x12345678,0x41005678],[0x41420000,0x12345678,0x41420078]]){
  const {state}=fixture();state.scene.initLatch63c=0;state.scene.field700=previous;state.nameEntryWords61c4[1]=5;state.hudWords7788[hi(0x88e8)]=name;
  const q=step(state,neutral);assert.equal(q.state.scene.field700,expected);assert.equal(q.state.scene.gameStateAb24,50);
 }
});
test('invalid exit cannot partially sample controls, clear latch or update records',()=>{
 const {state}=fixture();state.scene.initLatch63c=0;state.nameEntryWords61c4[1]=5;state.hudWords7788[hi(0x88e8)]=0x41424344;
 const before=structuredClone(state);assert.throws(()=>step(state,neutral),/terminate/);assert.deepEqual(state,before);
});
test('menu clock agrees across refresh rates, freezes hidden time and stops on completion',()=>{
 const run=hz=>{const clock=createNativeNameMenuClock();let count=0;for(let i=0;i<hz*4;i++)clock.advance(1/hz,true,()=>{count++;});return count;};
 for(const hz of [30,60,144])assert.equal(run(hz),80);
 const clock=createNativeNameMenuClock();let count=0;clock.advance(.04,true,()=>count++);clock.advance(10,false,()=>{throw Error('hidden input');});
 clock.advance(.01,true,()=>count++);assert.equal(count,0);clock.advance(.24,true,()=>{count++;return false;});assert.equal(count,1);
 clock.advance(.01,true,()=>count++);assert.equal(count,1);
});
