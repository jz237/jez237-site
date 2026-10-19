import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {prepareNativeRaceMenuInputAdvance,prepareNativeRaceMenuInitializationUpdate as entry} from '../native-race-state.js';
import {prepareNativeRaceMenuInitialization as rawEntry} from '../native-race-menu-initialization.js';
import {prepareNativeChampionshipStandingsPhase as phase,prepareNativeChampionshipStandingsSceneEntry as sceneEntry,nativeChampionshipStandingsView} from '../native-championship-standings-runtime.js';
import {NATIVE_CHAMPIONSHIP_SETUP_DATA as data} from '../native-championship-setup.js';
import {createNativeNameMenuClock} from '../native-name-menu-runtime.js';
const seed=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const templates={fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
const views={championshipCourseOrderAc14:data.courseOrderAc14,courseWaves:[20,20,20,40,10,30,20,25,25,0,15,15],
 otherAvatarsA9b4:[1,2,3],avatarsA9b0:[0,1,2,3],connectedMask4340:3,
 riderNamesB298:['RIDER ZERO','RIDER ONE','RIDER TWO','RIDER THREE'],digitWidths6d70:[4,5,6,7,8,9,10,11,12,13],
 requiredPointsAbbc:[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]]};
const neutral={heldButtons:0,rawXNative:0,rawYNative:0};
function fixture({difficulty=0,round=1,points=0,dq=0,reverse=0}={}){
 const s=structuredClone(seed);
 Object.assign(s.scene,{mode608:4,gameStateAb24:42,variant6f4:0,primaryHumanIndex:0,reverseDab68:reverse,
  fortressD8240:0,fortressCourse3a10:7,championshipCountAa00:0,trainingSelectionDa9f8:0,titlePairSelectionA9fc:0});
 s.profileWordsB330[1]=round;s.profileWordsB330[2]=difficulty;s.profileWordsB330.splice(4,4,points,0,0,0);
 for(let slot=0;slot<4;slot++){const base=(0x2938-0x1f94)/4+slot*222;s.raceWords1f94[base+1]=slot;s.raceWords1f94[base+187]=slot===0?dq:0;}
 s.championshipMenuWords7a00=Array(68).fill(0);s.championshipMenuWords7a00[0]=320<<16;s.championshipMenuWords7a00.splice(11,3,6,6,7);
 s.championshipMenuWords7a00.splice(6,5,80,81,82,83,84);
 return entry(s,{consumer:'801ec0d4'},templates).state;
}
function step(s,held=0,second=0,v=views){
 const sampled=prepareNativeRaceMenuInputAdvance(s,{rawControllers:[{...neutral,heldButtons:held},{...neutral,heldButtons:second}],
  controllerCount4344:2,connectedMask4340:3,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:35,thresholdYb401:35});
 return phase(sampled.state,v);
}
function until(s,predicate,held=0){for(let i=0;i<1000;i++){const q=step(s,held);if(predicate(q))return q;s=q.state;}throw Error('Standings phase did not reach expected stage');}
function confirmBoth(initial){
 let q=until(initial,q=>q.view.phase===2&&q.state.scene.field644>=31);q=step(q.state,0x8000);
 assert.equal(q.draw.view.phase,2);assert.equal(q.view.phase,3);
 q=until(q.state,q=>q.view.phase===5&&q.state.championshipMenuWords7a00[67]>=6);
 q=step(q.state,0x1000);assert.equal(q.draw.view.phase,5);assert.equal(q.view.phase,6);return q;
}

test('scene setup retains the scoring latch and later52 or exiting53 frames do not reseed water',()=>{
 const initial=fixture(),before=structuredClone(initial),q=sceneEntry(initial);
 assert.deepEqual(q.diagnostic.initializers,['8004f9e0','8008e4b0','801dda24']);
 assert.equal(q.waterScene.datumNative,0);assert.equal(q.state.scene.initLatch63c,1);assert.deepEqual(initial,before);
 const first=phase(q.state,views);assert.equal(first.diagnostic.scoreInvocations,1);
 for(const state of [first.state,{...initial,scene:{...initial.scene,gameStateAb24:53}}]){
  const skipped=sceneEntry(state,{courseRows9964:null,menuCamera:{type1Template5a84:null}});
  assert.deepEqual(skipped.state,state);assert.equal(skipped.waterScene,null);assert.deepEqual(skipped.effects,[]);
 }
});
test('late camera failure cannot commit earlier water RNG or course-display changes',()=>{
 const initial=fixture(),before=structuredClone(initial);
 assert.throws(()=>sceneEntry(initial,{menuCamera:{type1Template5a84:Array(30).fill(0)}}),/Degenerate/);
 assert.deepEqual(initial,before);
 assert.throws(()=>sceneEntry({...initial,scene:{...initial.scene,main638:1}}),/main9/);
});
test('game-over entry matches seven complete original callers without changing race or rendering phases',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-championship-gameover-entry.json',import.meta.url)));
 for(const c of ref.cases)assert.deepEqual(rawEntry({scene:{gameStateAb24:c.previous}},{consumer:'801ec944'}).operations,c.operations);
 const s=fixture(),q=entry(s,{consumer:'801ec944'});
 assert.equal(q.state.scene.gameStateAb24,90);assert.equal(q.state.scene.main638,15);
 for(const key of ['players','simulation648','phase650','field64c'])assert.equal(q.state.scene[key],s.scene[key]);
 assert.deepEqual(q.state.hudWords7788,s.hudWords7788);
 assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'800c21f4',arguments:[5,0]}]);
});
test('first display awards exactly once and holding confirm cannot skip a later ready panel',()=>{
 const initial=fixture();let q=step(initial,0x8000),awards=q.diagnostic.scoreInvocations;
 assert.equal(q.draw.kind,'black');assert.equal(q.state.scene.initLatch63c,0);assert.equal(q.view.phase,0);
 assert.equal(q.draw.layout,null);
 assert.deepEqual(q.view.totals,[7,4,2,1]);assert.equal(q.effects.filter(o=>o.consumer==='800c21f4').length,1);
 assert.equal(q.diagnostic.graphicsExecuted,false);assert.equal(q.presentation[0].consumer,'802c5850');
 for(let i=0;i<120;i++){q=step(q.state,0x8000,0xb000);awards+=q.diagnostic.scoreInvocations;}
 assert.equal(q.view.phase,2);assert.equal(awards,1);assert.deepEqual(q.view.totals,[7,4,2,1]);
 q=step(q.state);q=step(q.state,0x8000);assert.equal(q.view.phase,3);assert.equal(q.draw.view.phase,2);
 assert.equal(q.draw.layout.panel,'round');
 const row=q.draw.layout.commands.find(c=>c.kind==='panel'&&c.y===71);
 assert.equal(row.x,q.draw.view.xRound+8);
 q=step(q.state);assert.notEqual(q.draw.view.xRound,q.view.xRound);
 assert.equal(q.draw.layout.commands.find(c=>c.kind==='panel'&&c.y===71).x,q.draw.view.xRound+8);
 assert.deepEqual(initial.profileWordsB330.slice(4,8),[0,0,0,0]);
});

test('visible Continue readiness matches the next original input-stage acceptance boundary',()=>{
 const base=step(fixture()).state;
 for(const [stage,counter]of [[2,29],[2,30],[5,4],[5,5]]){
  const s=structuredClone(base);s.scene.field640=stage;
  if(stage===2)s.scene.field644=counter;else s.championshipMenuWords7a00[67]=counter;
  const ready=nativeChampionshipStandingsView(s).canConfirm,q=step(s,0x1000);
  assert.equal(ready,q.view.phase===stage+1);
  s.scene.gameStateAb24=53;assert.equal(nativeChampionshipStandingsView(s).canConfirm,false);
 }
});
test('next-round handoff advances retained profile and progress only after the exit fade',()=>{
 for(const reverse of [0,1]){
  let q=confirmBoth(fixture({reverse}));const points=[...q.view.totals];
  q=until(q.state,q=>q.view.exiting);assert.equal(q.state.profileWordsB330[1],1);assert.equal(q.handoff,null);
  q=until(q.state,q=>q.handoff!==null);
  assert.equal(q.handoff.destination,'championship');assert.equal(q.state.profileWordsB330[1],2);
  assert.equal(q.state.profileWordsB330[0],2);assert.equal(q.state.scene.courseIndex,2);assert.equal(q.state.scene.main638,8);
  assert.equal(q.state.saveWordsB280[reverse?5:2],2);assert.deepEqual(q.state.profileWordsB330.slice(4,8),points);
  assert.equal(q.effects.at(-1).consumer,'8007c494');assert.ok(q.effects.some(o=>o.kind==='bodyTuneWordWrite'));
  assert.equal(q.operations.some(o=>o.consumer==='801eb91c'),false);assert.equal(q.view.active,false);
  assert.throws(()=>step(q.state),/standings phase/);
 }
});
test('final qualification reaches the original ending; failure reaches game over after its slide',()=>{
 for(const failed of [false,true]){
  let q=confirmBoth(fixture(failed?{dq:1}:{difficulty:2,round:7,points:30}));
  q=until(q.state,q=>q.handoff!==null);
  assert.equal(q.handoff.destination,failed?'gameover':'ending');assert.equal(q.state.scene.gameStateAb24,failed?90:102);
  assert.equal(q.state.scene.main638,failed?15:21);assert.equal(q.effects.at(-1).consumer,'8007c494');
  assert.equal(q.operations.some(o=>o.consumer===q.handoff.consumer),false);
  if(!failed){assert.equal(q.state.saveWordsB280[0]>>>24&12,12);assert.equal(q.state.profileWordsB330[1],7);}
  else assert.equal(q.draw.view.xRound,320,'last slide coordinate is clamped during controls after drawing');
 }
});
test('late missing next-round data cannot commit round, saved progress or prior fade changes',()=>{
 let q=confirmBoth(fixture());q=until(q.state,q=>q.view.exiting);
 let s=q.state,rejected=false;
 for(let i=0;i<200;i++){
  const before=structuredClone(s);
  try{q=phase(s,{...views,otherAvatarsA9b4:undefined});}
  catch(e){assert.match(e.message,/otherAvatars/);assert.deepEqual(s,before);assert.equal(s.profileWordsB330[1],1);rejected=true;break;}
  assert.equal(q.handoff,null);s=q.state;
 }
 assert.equal(rejected,true,'the actual fade must reach the invalid initializer');
});
test('standings exit runs at20Hz regardless of rendering cadence and ignores suspended time',()=>{
 const base=confirmBoth(fixture()).state;let expected,expectedTicks;
 for(const hz of [30,60,144]){
  const clock=createNativeNameMenuClock();let state=base,ticks=0,handoffs=0,awards=0;
  for(let frame=0;frame<1200&&!handoffs;frame++){
   if(frame===5)clock.advance(30,false,()=>assert.fail('Suspended standings advanced'));
   clock.advance(1/hz,true,()=>{const q=step(state);state=q.state;ticks++;awards+=q.diagnostic.scoreInvocations;if(q.handoff){handoffs++;return false;}});
  }
  assert.equal(handoffs,1);assert.equal(awards,0);assert.equal(state.profileWordsB330[1],2);
  if(expected){assert.deepEqual(state,expected);assert.equal(ticks,expectedTicks);}else{expected=state;expectedTicks=ticks;}
 }
});
