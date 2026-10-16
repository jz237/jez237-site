import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {prepareNativeRaceResultCPUDisplayUpdate as cpu,prepareNativeRaceResultDisplayUpdate as full} from '../native-race-state.js';
const create=(mode='time')=>createRace({mode,physics:'native',course:getCourse('greyhaven')});
function frames(s,n,menu=[{}],hz=60){const end=s.nativeHost.world.frames+n;
 for(let guard=0;s.nativeHost.world.frames<end;guard++){
  assert.ok(guard<n*hz+10,'host stopped before target');stepRace(s,s.mode==='versus'?[{},{}]:{},Math.min(1/hz,(end*5-s.nativeHost.world.ticks)*.01-s.nativeHost.world.remainder),{menuInputs:menu});
 }
}
function finish(s){frames(s,130);s.racers[0].finishTime=3.75;frames(s,1);return s;}
const ii=a=>(a-0x9440)/4;

test('CPU result scheduling matches the full dispatcher writes without manufacturing a display address',()=>{
 const templates={slotTemplateWords6c50:Array(11).fill(0),fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
 const bases=[finish(create()).nativeLaunch.snapshot(),finish(create('versus')).nativeLaunch.snapshot()];
 for(const players of [1,2])for(const game of [41,42,44])for(const counter of [0,29,30,59,60,61,0x7fffffff]){
  const state=structuredClone(bases[players-1]);
  state.scene.gameStateAb24=game;state.scene.initLatch63c=1;state.i1Words9440[ii(0x96a4)]=counter;
  const a=cpu(state,templates),b=full(state,{...templates,expandTransitions:true,expandWidgets:true,
   externalReturns:{'8009328c':0x81050000,'801e5554':0x81050020}});
  const numeric=ops=>ops.filter(op=>op.kind!=='presentationWordWrite'&&!(op.kind==='externalCall'&&['8009328c','801e5554'].includes(op.consumer)));
  assert.deepEqual(a.state,b.state);assert.deepEqual(a.operations,numeric(b.operations));
 }
});

test('postrace keeps source world alive, freezes finish data, rejects early held Continue and stops once after fade',()=>{
 const s=finish(create()),w=s.nativeHost.world,at=w.frames,finishResult=structuredClone(s.result),initial=s.nativeResult.delay;
 assert.equal(s.phase,'postrace');assert.ok(initial>0);frames(s,initial,[{continue:true}]);
 assert.equal(s.nativeResult.canContinue,true,'an early press is not queued across the timer');
 assert.equal(s.nativeLaunch.snapshot().scene.initLatch63c,0);assert.equal(s.nativeResult.waitingFrames,1);
 assert.equal(w.frames,at+initial);assert.deepEqual(s.result,finishResult);assert.equal(s.racers[0].finishTime,3.75);
 assert.equal(w.adapters[0].lastControls.controlOrigin,'ai');
 s.phase='paused';const paused=s.nativeLaunch.snapshot(),f=w.frames;
 for(let i=0;i<10;i++)stepRace(s,{},1/60,{menuInputs:[{continue:false}]});
 assert.equal(w.frames,f);assert.deepEqual(s.nativeLaunch.snapshot(),paused);s.phase='postrace';
 frames(s,1,[{}]);frames(s,1,[{continue:true}]);assert.equal(s.nativeResult.canContinue,false);
 const fadeStart=w.frames;for(let i=0;i<100&&s.phase!=='results';i++)frames(s,1);
 assert.equal(s.phase,'results');assert.ok(w.frames>fadeStart);assert.equal(s.nativeResult.exit.consumer,'801ec9c8');
 const end=s.nativeLaunch.snapshot(),endFrames=w.frames;
 assert.equal(end.scene.previousGameState634,42);assert.equal(end.scene.gameStateAb24,100);assert.equal(end.scene.main638,6);
 assert.equal(end.scene.phase650,0);assert.equal(end.scene.players,1);assert.equal(end.scene.initLatch63c,1);
 assert.deepEqual(s.nativeResult.exit.pendingConsumers,['80096960','800c21f4']);
 assert.equal(s.nativeResult.exit.gameState,100);assert.equal(s.nativeResult.exit.main,6);
 for(let i=0;i<10;i++)stepRace(s,{},1/30);
 assert.deepEqual(s.nativeLaunch.snapshot(),end);assert.equal(w.frames,endFrames);assert.deepEqual(s.result,finishResult);
 const repeat=s.nativeLaunch.advanceResult();assert.deepEqual(repeat.effects,[]);assert.deepEqual(s.nativeLaunch.snapshot(),end);
});

test('retirement, two-player wins, and ties run their source delay before handing off the menu',()=>{
 for(const kind of ['retired','p1','tie','versus-retired']){
  const s=create(kind==='retired'?'time':'versus');frames(s,130);
  if(kind.includes('retired'))s.racers[0].dq='Prepared retirement';
  else{s.racers[0].finishTime=3.75;if(kind==='tie')s.racers[1].finishTime=3.75;}
  frames(s,1);const at=s.nativeHost.world.frames;assert.equal(s.phase,'postrace');
  for(let i=0;i<200&&s.phase!=='results';i++)frames(s,1);
  assert.equal(s.phase,'results',kind);assert.ok(s.nativeHost.world.frames-at>=60,kind);
  assert.equal(s.nativeResult.exit.consumer,kind==='retired'?'801ec830':'801ece50');
  const menu=s.nativeLaunch.snapshot().scene;
  assert.equal(menu.gameStateAb24,kind==='retired'?80:54);assert.equal(menu.main638,kind==='retired'?13:18);
  assert.equal(menu.players,1);assert.equal(menu.phase650,0);assert.equal(menu.initLatch63c,1);
  assert.deepEqual(s.nativeLaunch.snapshot().profileWordsB330.slice(48,50),kind==='p1'?[1,0]:kind==='versus-retired'?[0,1]:[0,0]);
 }
});

test('expanded retirement menu stays before the caller audio cleanup and late failure is atomic',()=>{
 const state=structuredClone(finish(create()).nativeLaunch.snapshot());state.scene.gameStateAb24=41;
 const completion=(0x8a14-0x7788)/4;state.hudWords7788[completion]=(state.hudWords7788[completion]&0xffff0000)|1;
 const before=structuredClone(state),templates={slotTemplateWords6c50:Array(11).fill(0),fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
 const q=cpu(state,{...templates,expandMenus:true});
 assert.equal(q.menus.length,1);assert.equal(q.menus[0].consumer,'801ec830');
 assert.equal(q.operations.some(o=>o.consumer==='801ec830'),false);
 assert.equal(q.operations.at(-1).consumer,'800ad3c4');
 const menuStart=q.operations.findIndex(o=>o.field==='previousGameState634');
 assert.ok(menuStart>=0);assert.ok(q.operations.findIndex(o=>o.consumer==='800c6ad0')>menuStart);
 assert.equal(q.state.scene.gameStateAb24,80);assert.deepEqual(state,before);
 assert.throws(()=>cpu(state,{...templates,expandMenus:1}),TypeError);
 assert.throws(()=>cpu(state,{...templates,expandMenus:true,slotTemplateWords6c50:Array(10).fill(0)}),/slotTemplate/);
 assert.deepEqual(state,before);
});

test('result delay and menu readiness depend on source frames at30/60/144Hz',()=>{
 const states=[];for(const hz of [30,60,144]){
  const s=finish(create());frames(s,s.nativeResult.delay+3,[{}],hz);states.push(s.nativeLaunch.snapshot());
  assert.equal(s.nativeResult.canContinue,true);assert.equal(s.nativeResult.waitingFrames,4);
 }
 for(const s of states.slice(1))assert.deepEqual(s,states[0]);
});

test('a naturally completed race survives the full unattended Continue timeout with source AI and twelve-point water contact',()=>{
 const s=create(),pilot=createNativeRacePilot({course:s.course}),w=s.nativeHost.world;
 let maxWet=0,postraceFrames=0,finished=null;
 const after=w.afterFrame;w.afterFrame=(...args)=>{
  const out=after(...args);
  if(s.phase==='postrace'){postraceFrames++;finished??=structuredClone(s.result);maxWet=Math.max(maxWet,w.adapters[0].water.wetCount);}
  return out;
 };
 for(let n=0;n<240*30&&s.phase!=='results';n++)stepRace(s,()=>pilot.input(s,s.racers[0]),1/30);
 assert.equal(s.phase,'results');assert.equal(s.racers[0].dq,'');assert.equal(s.racers[0].misses,0);
 assert.ok(maxWet>8&&maxWet<=12,'exercise the submerged upper hull points during AI coast');
 assert.ok(postraceFrames>=1300,'wait for the actual1200-frame Continue timeout after the body-specific delay');
 assert.equal(w.fault,null);assert.deepEqual(s.result,finished);assert.equal(s.nativeResult.exit.consumer,'801ec9c8');
 const words=s.nativeLaunch.snapshot().raceWords1f94;
 assert.ok(words.includes(0x594f5500),'the explicit fresh web profile supplies YOU initials at the source save boundary');
});
