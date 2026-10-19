import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRaceMenuInitialization as entry} from '../native-race-menu-initialization.js';
import {prepareNativeRaceResultCPUDisplayUpdate as cpu,prepareNativeChampionshipScoreUpdate} from '../native-race-state.js';
import {stepNativeRaceWorld} from '../native-race-world.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeChampionshipStandingsMenuWords} from '../native-championship-standings-data.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-championship-result-entry.json',import.meta.url)));
const templates={slotTemplateWords6c50:Array(11).fill(0),fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
const create=()=>createRace({physics:'native',mode:'championship',course:getCourse('greyhaven')});
function frames(s,n,menu={}){
 const end=s.nativeHost.world.frames+n;
 for(let guard=0;s.nativeHost.world.frames<end;guard++){
  assert.ok(guard<n*10+10,'race stopped before the target');stepRace(s,{},1/60,{menuInputs:[menu]});
 }
}

test('championship results entry matches32 complete original callers and preserves avatar-indexed variants',()=>{
 for(const c of reference.cases){const before=structuredClone(c.input),q=entry(c.input,{consumer:'801ec0d4',avatarsA9b0:c.avatarsA9b0});
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(c.input,before);assert.equal(q.diagnostic.targetGameState,52);
 }
 assert.doesNotThrow(()=>entry({scene:{gameStateAb24:42,variant6f4:0}},{consumer:'801ec0d4'}));
 assert.throws(()=>entry({scene:{gameStateAb24:42,variant6f4:1,primaryHumanIndex:0}},{consumer:'801ec0d4'}),/avatar slots/);
});

test('result estimation runs before menu entry and late missing geometry cannot partially commit either',()=>{
 const s=create(),state=s.nativeLaunch.snapshot();state.scene.gameStateAb24=42;
 const hi=a=>(a-0x7788)/4,ii=a=>(a-0x9440)/4;
 state.hudWords7788[hi(0x8a14)]=1;state.i1Words9440[ii(0x9500)]=1;
 const before=structuredClone(state);
 assert.throws(()=>cpu(state,{...templates,expandMenus:true,expandEstimates:true}),/actual primary records/);
 assert.deepEqual(state,before);
 assert.throws(()=>cpu(state,{...templates,expandEstimates:1}),/boolean/);
 // Already estimated records are a genuine source latch: no geometry read.
 state.raceWords1f94[(0x1fd4-0x1f94)/4]=1;
 const q=cpu(state,{...templates,expandMenus:true,expandEstimates:true});
 assert.equal(q.menus[0].consumer,'801ec0d4');assert.equal(q.state.scene.gameStateAb24,52);assert.equal(q.state.scene.main638,9);
 assert.equal(q.effects.some(o=>o.consumer==='80077f5c'||o.consumer==='801ec0d4'),false);
 assert.deepEqual(q.menus[0].pendingConsumers,['80096960','800c6ad0']);
});

test('application finish and retirement reach original standings entry once, using completed rival bodies and current primary centers',()=>{
 for(const retired of [false,true]){
  const s=create();frames(s,130);
  if(retired)s.racers[0].dq='Prepared retirement';else s.racers[0].finishTime=3.75;
  frames(s,1);assert.equal(s.phase,'postrace');
  if(!retired){frames(s,s.nativeResult.delay);assert.equal(s.nativeResult.canContinue,true);frames(s,1,{continue:true});}
  let estimates=0;
  const advance=s.nativeLaunch.advanceResult;
  // The immutable runtime cannot be replaced; observe the actual committed
  // once-only latch across physical frames instead of mocking its estimator.
  let latch=s.nativeLaunch.snapshot().raceWords1f94[(0x1fd4-0x1f94)/4];
  for(let i=0;i<220&&s.phase!=='standings';i++){
   frames(s,1);const next=s.nativeLaunch.snapshot().raceWords1f94[(0x1fd4-0x1f94)/4];
   if(next!==latch)estimates++;latch=next;
  }
  assert.equal(s.phase,'standings');assert.equal(estimates,1);assert.equal(latch,1);
  assert.equal(s.nativeResult.exit.consumer,'801ec0d4');assert.equal(s.nativeResult.exit.gameState,52);assert.equal(s.nativeResult.exit.main,9);
  assert.deepEqual(s.nativeLaunch.snapshot().championshipMenuWords7a00,createNativeChampionshipStandingsMenuWords());
  const sourceViews=s.nativeLaunch.championshipStandingsSourceViews();
  assert.deepEqual(sourceViews.riderNamesB298,['YOU','YOU','YOU','YOU']);
  assert.deepEqual(sourceViews.avatarsA9b0,s.racers.map(r=>r.id));
  const before=s.nativeLaunch.snapshot(),water=s.raceWater,field=water.field,phase=field.phaseCounter;
  const at=s.nativeHost.world.frames,rollers=structuredClone(water.rollers);
  const audioBefore=s.nativeContactAudio.snapshot(),heights=field.heightQ.slice(),velocities=field.velocityQ.slice();
  assert.throws(()=>s.nativeLaunch.advanceChampionshipStandings(water,[],{menuCamera:{type1Template5a84:Array(30).fill(0)}}),/Degenerate/);
  assert.deepEqual(s.nativeLaunch.snapshot(),before);assert.equal(water.menuActive,false);
  assert.deepEqual(field.heightQ,heights);assert.deepEqual(field.velocityQ,velocities);
  const menuFrame=(controls={})=>{const target=s.nativeStandings.frames+1;let calls=0;
   for(let i=0;s.nativeStandings.frames<target;i++){assert.ok(i<5);stepRace(s,{},1/60,{menuInputs:()=>{calls++;return [controls];}});}
   assert.equal(calls,1,'poll the menu controller once per source frame');
  };
  menuFrame();
  assert.equal(s.nativeStandings.diagnostic.scoreInvocations,1);assert.equal(s.nativeStandings.draw.kind,'black');
  assert.equal(water.menuActive,true);assert.equal(field.parameters.radius,16);assert.equal(water.field,field);
  const afterScore=s.nativeLaunch.snapshot().profileWordsB330.slice(4,8);
  menuFrame();
  assert.equal(s.nativeStandings.diagnostic.scoreInvocations,0);assert.equal(s.nativeStandings.draw.layout.panel,'round');
  assert.equal(s.nativeStandings.draw.layout.commands.filter(c=>c.kind==='riderPreview').length,4);
  assert.equal(water.menuFrames,2);assert.equal(water.frames,at);assert.equal(water.rollerFrames,at);
  assert.equal(field.phaseCounter,phase);assert.deepEqual(water.rollers,rollers);
  assert.equal(water.cameras[0].fovDegrees,50);assert.equal(water.cameras[0].nearNative,10);assert.deepEqual(water.cameras[0].projectionOffset,[0,0]);
  assert.throws(()=>stepNativeRaceWorld(s.nativeHost.world,.05,[{},{},{},{}]),/menu owns water/);
  assert.equal(s.nativeHost.world.fault,null);assert.equal(s.finishWait,0);
  assert.ok(s.nativeLaunch.records().slice(1).every(r=>r.totalMs>r.lapMs&&r.totalMs<=599999));
  s.phase='paused';const paused=s.nativeLaunch.snapshot(),menuFrames=water.menuFrames;
  for(let i=0;i<4;i++)stepRace(s,{},1/30);
  assert.deepEqual(s.nativeLaunch.snapshot(),paused);assert.equal(water.menuFrames,menuFrames);
  s.phase='standings';menuFrame();
  assert.deepEqual(s.nativeLaunch.snapshot().profileWordsB330.slice(4,8),afterScore);
  assert.equal(s.nativeHost.world.frames,at);
  assert.deepEqual(s.nativeLaunch.snapshot().raceWords1f94,prepareNativeChampionshipScoreUpdate(before).state.raceWords1f94,
   'only the original scoring stage may change retained race records during standings');
  assert.deepEqual(advance().effects,[],'a completed handoff cannot estimate or enter a menu twice');
  for(let i=0;i<600&&s.phase==='standings';i++){
   const source=s.nativeLaunch.snapshot(),v=s.nativeStandings.view;
   const ready=v.phase===2&&source.scene.field644>=31||v.phase===5&&source.championshipMenuWords7a00[67]>=6;
   menuFrame({continue:ready});
  }
  assert.equal(s.phase,'results');assert.equal(s.nativeStandings.handoff.destination,retired?'gameover':'championship');
  const final=s.nativeLaunch.snapshot();assert.deepEqual(final.profileWordsB330.slice(4,8),afterScore);
  if(!retired){assert.equal(final.profileWordsB330[1],before.profileWordsB330[1]+1);assert.equal(final.scene.main638,8);}
  assert.equal(s.nativeHost.world.frames,at);assert.equal(water.menuFrames,s.nativeStandings.frames);
  const audioAfter=s.nativeContactAudio.snapshot();
  assert.equal(audioAfter.frame,audioBefore.frame+water.menuFrames);assert.equal(audioAfter.menuFrames,water.menuFrames);
  for(const key of ['packets','motion','riderWater'])assert.deepEqual(audioAfter[key],audioBefore[key]);
  const frozenFrames=water.menuFrames;stepRace(s,{continue:true},1/30);assert.equal(water.menuFrames,frozenFrames);
  assert.throws(()=>s.nativeLaunch.advanceChampionshipStandings(water,[]),/main9/);
 }
});
