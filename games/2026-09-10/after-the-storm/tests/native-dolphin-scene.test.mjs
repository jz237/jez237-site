import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeCourseActorHost} from '../native-course-actor-host.js';
import {nativeSineTableWords} from '../native-math-tables.js';
const assets=Object.fromEntries([0,2].map(i=>[i,new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)))]));
const make=onDisplay=>createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay}});

test('live Dolphin startup precedes AI and complete actors advance once per shared50ms frame',()=>{
 const displays=[],s=make((p,r)=>displays.push({p,r})),h=s.nativeHost;
 assert.equal(h.world.frames,0);assert.equal(displays.length,0);assert.equal(s.raceWater.frames,0);
 assert.equal(h.actorStartup.state.actorControlWords62c4[0],1);assert.equal(h.actorStartup.state.actorControlWords62c4[1],12);
 assert.equal(h.actorStartup.state.scene.secondaryCount,64);assert.equal(h.actorStartup.state.scene.primaryCount,60);
 assert.equal(h.actorStartup.state.resourceWordsE73c[0x9c/4],0);assert.equal(h.actorStartup.state.resourceWordsE73c[0xa4/4],2);
 assert.notEqual(h.actorStartup.state.scene.rngState4640,h.aiInitialization.rngState);
 assert.equal(s.nativeLaunch.snapshot().scene.rngState4640,h.aiInitialization.rngState);
 for(let i=0;i<180;i++)stepRace(s,{throttle:1},1/60);
 assert.equal(h.world.frames,60);assert.equal(displays.length,60);assert.equal(s.raceWater.frames,60);
 assert.equal(s.nativeLaunch.snapshot().actorControlWords62c4[0],61);
 assert.ok(displays.every(d=>d.r[0x9c/4]===0&&d.p.draws.some(a=>a.actorIndex===0&&a.resourceIndex===0)));
 assert.notDeepEqual(displays[0].p.draws,displays.at(-1).p.draws);
 assert.ok(h.lastCourseActors.operations.some(o=>o.kind==='presentationActorWrite'));
 const state=s.nativeLaunch.snapshot(),ticks=h.world.ticks,presentation=h.courseActors.presentation();s.phase='paused';
 for(let i=0;i<60;i++)stepRace(s,{throttle:1},1/60);
 assert.equal(displays.length,60);assert.equal(h.world.ticks,ticks);assert.deepEqual(s.nativeLaunch.snapshot(),state);assert.equal(h.courseActors.presentation(),presentation);
});

test('live dolphin state and accepted presentations are identical at30/60/144Hz and restart',()=>{
 const results=[];
 for(const hz of [30,60,144]){
  let draws=0,last;const s=make(p=>{draws++;last=p;});
  for(let i=0;i<hz*2;i++)stepRace(s,{throttle:1,steer:.2},1/hz);
  results.push({draws,state:s.nativeLaunch.snapshot(),last});
 }
 assert.equal(results[0].draws,40);assert.deepEqual(results[1],results[0]);assert.deepEqual(results[2],results[0]);
 const a=make(()=>{}),b=make(()=>{});assert.deepEqual(a.nativeLaunch.snapshot(),b.nativeLaunch.snapshot());
});

test('fresh web actor resources and display setup commit only after every startup dependency succeeds',()=>{
 let state=createRace({mode:'practice',physics:'native',course:getCourse('practice')}).nativeLaunch.snapshot(),commits=0;
 const before=state,host=createNativeCourseActorHost({readRaceState:()=>state,commitRaceState:q=>{state=q;commits++;},worldScale:.025,
  buffers:{matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0)),lightBuffers:Array.from({length:2},()=>Array(96).fill(0))}});
 const segmentWordsE6b0=Array(16).fill(0);segmentWordsE6b0[8]=0x316800;
 const input={bodyPoseWordsBySlot:[Array(6).fill(0)],selectedWaterVertexXZ:[[0,0],[0,0]],firstCourseNodeWords:[0,0,0],sineTableWords4350:nativeSineTableWords()};
 assert.throws(()=>host.initialize(input,{assets:{0:assets[0]},segmentWordsE6b0},{freshWebScene:true,waterExtent2498:768}),/asset length/);
 assert.equal(state,before);assert.equal(commits,0);assert.equal(state.resourceWordsE73c,undefined);
 assert.throws(()=>host.initialize({...input,firstCourseNodeWords:null},{assets,segmentWordsE6b0},{freshWebScene:true,waterExtent2498:768}),/first course node/);
 assert.equal(state,before);assert.equal(commits,0);
 host.initialize(input,{assets,segmentWordsE6b0},{freshWebScene:true,waterExtent2498:768});
 assert.equal(commits,1);assert.equal(state.courseDisplayWordsB058.length,136);assert.equal(state.scene.championshipCountAa00,0);
});

test('unprepared modes and restored memories cannot silently opt into fresh Dolphin allocation',()=>{
 assert.throws(()=>createRace({mode:'practice',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay(){}}}),/fresh solo native Practice/);
 const initial=make(()=>{}).nativeLaunch.snapshot();
 assert.throws(()=>createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeInitialRaceState:initial,nativeCourseActors:{assets,onDisplay(){}}}),/fresh solo native Practice/);
});
