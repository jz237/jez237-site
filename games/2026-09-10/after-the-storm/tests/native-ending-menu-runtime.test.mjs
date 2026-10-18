import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeEndingMenuPhase as phase} from '../native-ending-menu-runtime.js';
import {prepareNativeRaceMenuInputAdvance} from '../native-race-state.js';
import {createNativeNameMenuClock} from '../native-name-menu-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const scroll=JSON.parse(readFileSync(new URL('./fixtures/native-ending-scroll.json',import.meta.url),'utf8')).sequence;
const presentation=JSON.parse(readFileSync(new URL('./fixtures/native-ending-presentation.json',import.meta.url),'utf8')).cases[0].input;
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x6d50)/4,neutral={heldButtons:0,rawXNative:0,rawYNative:0};
const views={...presentation,riderOrderEabb0:scroll.input.order,connectedMask4340:3};
function fixture(){
 const s=structuredClone(seed),c=scroll.input;
 Object.assign(s.scene,{mode608:4,main638:21,gameStateAb24:102,initLatch63c:1,primaryHumanIndex:0,reverseDab68:0});
 s.endingMenuWords6d50=[...c.ending];s.profileWordsB330[1]=c.round;s.profileWordsB330[2]=c.difficulty;
 c.courseAvatars.forEach((v,i)=>s.profileWordsB330[8+i*4]=v);
 presentation.points.forEach((v,i)=>s.profileWordsB330[4+i]=v);
 presentation.times.forEach((v,i)=>s.profileWordsB330[40+i]=v);
 for(let a=0x2660;a<0x26c0;a+=4)s.raceWords1f94[(a-0x1f94)/4]=0;
 s.raceWords1f94[(0x2c70-0x1f94)/4]=0;s.hudWords7788.fill(0);return s;
}
// Tests isolate the menu portion. Production must also advance the physical
// world between this input sample and phase; no synthetic world is admitted.
function step(s,held=0,second=0,v=views){
 const sample=prepareNativeRaceMenuInputAdvance(s,{rawControllers:[{...neutral,heldButtons:held},{...neutral,heldButtons:second}],
  controllerCount4344:2,connectedMask4340:3,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 return phase(sample.state,v);
}
function ready(){let q=step(fixture());while(!q.view.ready)q=step(q.state);return q.state;}

test('full panel schedule reaches original readiness and draws before same-frame controls',()=>{
 let state=fixture(),readyTick=null,cues=0;
 for(let tick=0;tick<=scroll.readyFrame;tick++){
  const q=step(state,0x8000);state=q.state;
  if(tick===0){assert.equal(q.draw.kind,'white');assert.equal(q.draw.ending,null);assert.equal(q.state.scene.initLatch63c,0);}
  else assert.equal(q.draw.kind,'scene');
  if(q.view.ready&&readyTick===null)readyTick=tick;
  cues+=q.effects.filter(o=>o.consumer==='800c489c').length;
  assert.equal(q.view.exiting,false);assert.equal(q.diagnostic.physicalWorldUpdated,false);
 }
 assert.equal(readyTick,scroll.readyFrame);assert.equal(cues,1);
 assert.equal(state.endingMenuWords6d50[ix(0x6df8)],1);
 let q=step(state,0x8000,0x1000);assert.equal(q.view.exiting,false);
 q=step(q.state);q=step(q.state,0x1000);
 assert.equal(q.draw.view.exiting,false);assert.equal(q.draw.view.fade.kind,0);
 assert.equal(q.view.exiting,true);assert.equal(q.view.fade.kind,3);assert.equal(q.handoff,null);
 assert.ok(q.draw.ending.commands.some(o=>o.kind==='riderPreview'));
});

test('title and each record flag wait24 fade ticks then initialize the original destination once',()=>{
 const base=ready();
 for(const flag of [null,0x6e74,0x6e78])for(const button of [0x8000,0x2000,0x1000]){
  const s=structuredClone(base);if(flag)s.endingMenuWords6d50[ix(flag)]=1;
  let q=step(s,button);
  assert.equal(q.state.scene.returnState630,flag?100:2);
  assert.equal(q.effects.some(o=>o.consumer==='800c1f60'),!flag);
  for(let tick=1;tick<=24;tick++){
   q=step(q.state,button);if(tick<24)assert.equal(q.handoff,null);
  }
  assert.equal(q.handoff.destination,flag?'records':'title');assert.equal(q.draw.view.fade.completion,1);
  assert.equal(q.state.scene.gameStateAb24,flag?100:2);assert.equal(q.view.active,false);
  assert.equal(q.diagnostic.targetInitializerExecuted,true);
  assert.equal(q.operations.some(o=>o.consumer===q.handoff.consumer),false);
  assert.equal(q.effects.some(o=>o.consumer===q.handoff.consumer),false);
  if(flag){
   assert.equal(q.state.scene.previousGameState634,103);assert.equal(q.state.scene.main638,6);
   assert.equal(q.view.fade.kind,7);assert.equal(q.view.fade.rgba[3],255);
   assert.equal(q.effects.some(o=>o.consumer==='80096960'),false);
   assert.ok(q.effects.some(o=>o.consumer==='800c21f4'&&o.arguments[0]===12));
  }else assert.deepEqual(q.state.deviceWords4308.slice(0,5),[0,0,0,0,0]);
  const before=structuredClone(q.state);assert.throws(()=>step(q.state),/Ending phase/);assert.deepEqual(q.state,before);
 }
});

test('holding confirm before readiness does not skip; automatic acceptance is exactly601 input ticks',()=>{
 let state=ready(),q;const initial=state.endingMenuWords6d50[ix(0x6df8)];
 for(let tick=initial+1;tick<=601;tick++){
  q=step(state,0,0xb000);state=q.state;
  assert.equal(q.view.inputTicks,tick);assert.equal(q.view.exiting,tick===601);
 }
 assert.equal(q.state.scene.returnState630,2);
});

test('render cadence and suspended menus retain identical tick timing and one handoff',()=>{
 const base=ready();let expected;
 for(const hz of [30,60,144]){
  let state=base,ticks=0,handoffs=0;const clock=createNativeNameMenuClock();
  for(let frame=0;frame<200&&!handoffs;frame++){
   if(frame===5)clock.advance(30,false,()=>assert.fail('Suspended menu advanced'));
   clock.advance(1/hz,true,()=>{const q=step(state,ticks===1?0x8000:0);state=q.state;ticks++;if(q.handoff){handoffs++;return false;}});
  }
  assert.equal(ticks,26);assert.equal(handoffs,1);
  if(expected)assert.deepEqual(state,expected);else expected=state;
 }
});

test('late layout and target failures are atomic and phase never changes physical race owners',()=>{
 const s=structuredClone(ready()),before=structuredClone(s);
 assert.throws(()=>step(s,0,0,{...views,riderNamesB298:[]}),/riderNames/);assert.deepEqual(s,before);
 let q=step(s,0x8000);for(let i=0;i<23;i++)q=step(q.state);
 const pending=structuredClone(q.state);
 assert.throws(()=>step(q.state,0,0,{...views,connectedMask4340:undefined}),/connected mask/);
 assert.deepEqual(q.state,pending);
 const next=step(s);assert.deepEqual(next.state.raceWords1f94,s.raceWords1f94);
 assert.deepEqual(next.state.profileWordsB330,s.profileWordsB330);assert.deepEqual(s,before);
 assert.ok(Object.isFrozen(next.draw.ending.commands));
});
