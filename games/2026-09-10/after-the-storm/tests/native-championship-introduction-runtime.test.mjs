import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeRaceScene} from '../native-race-scene.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativeChampionshipConfiguredLaunch,NATIVE_CHAMPIONSHIP_SETUP_DATA as data} from '../native-championship-setup.js';
import {prepareNativeMenuReturnUpdate} from '../native-race-state.js';
import {prepareNativeChampionshipIntroductionPhase as phase} from '../native-championship-introduction-runtime.js';
import {stepNativeAIRandom} from '../native-ai-initialization.js';
import {createNativeChampionshipIntroductionStorage} from '../native-championship-introduction-data.js';
const raw=JSON.parse(readFileSync(new URL('./fixtures/native-championship-introduction-control.json',import.meta.url)));
const update=JSON.parse(readFileSync(new URL('./fixtures/native-championship-selection-update.json',import.meta.url)));
const seed=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const views={...data,...update.sourceViews,waveRowsB308:data.waveRowsByClass,avatarsA9b0:[0,1,2,3],customRiderTraits:Array.from({length:4},()=>[5,5,5]),
 championshipCourseOrderAc14:data.courseOrderAc14,courseWaves:[20,20,20,40,10,30,20,25,25,0,15,15],otherAvatarsA9b4:[1,2,3]};
function initial(round=2){
 const s=structuredClone(seed);s.profileWordsB330[1]=round;s.profileWordsB330.splice(4,4,7,4,2,1);
 Object.assign(s.scene,{fortressD8240:0,fortressCourse3a10:7,championshipCountAa00:0});
 Object.assign(s,createNativeChampionshipIntroductionStorage());
 return prepareNativeMenuReturnUpdate(s,'championship',views).state;
}
test('fresh i3 owners match loaded ROM data and the loader-cleared BSS without sharing mutable storage',()=>{
 assert.equal(seed.scene.field3938,raw.provenance.displayEnable3938);
 const a=createNativeChampionshipIntroductionStorage(),b=createNativeChampionshipIntroductionStorage();
 assert.deepEqual(a.championshipIntroPanelWords6f64,raw.basePanel);assert.deepEqual(a.championshipSelectionWords6f84,raw.baseMenu);
 assert.deepEqual(a.championshipSelectionWords6f84.slice(39),[0,0,0,0]);
 a.championshipIntroPanelWords6f64[0]=9;a.championshipSelectionWords6f84[0]=9;
 assert.equal(b.championshipIntroPanelWords6f64[0],0);assert.equal(b.championshipSelectionWords6f84[0],0);
});
function step(s,pressed=0,v=views){const next=structuredClone(s);next.menuWordsE658[14]=(next.menuWordsE658[14]&0xffff0000)|pressed;return phase(next,v);}
test('first black frame clears the latch once, then timed panels enable same-frame skip without physical ticks',()=>{
 const s=initial(),points=s.profileWordsB330.slice(4,8),before=structuredClone(s),first=step(s,0x8000);
 assert.equal(first.draw.kind,'black');assert.equal(first.state.scene.initLatch63c,0);assert.equal(first.diagnostic.rngCalls,0);
 assert.deepEqual(first.state.profileWordsB330.slice(4,8),points);assert.deepEqual(s,before);
 let current=first.state,last;
 for(let frame=1;frame<=40;frame++){
  last=step(current,0x8000);
  assert.equal(last.diagnostic.rngCalls,1);assert.equal(last.state.scene.rngState4640,stepNativeAIRandom(current.scene.rngState4640).rngState);
  assert.equal(last.state.scene.gameStateAb24,frame===40?31:30);
  assert.deepEqual(last.state.profileWordsB330.slice(4,8),points);current=last.state;
 }
 assert.equal(last.state.scene.field644,20);assert.equal(last.state.championshipSelectionWords6f84[0],1);
 assert.equal(last.state.hudWords7788[(0x8a10-0x7788)/4]>>>16,5);
 assert.deepEqual(last.state.raceWords1f94,s.raceWords1f94);
 assert.ok(last.effects.some(o=>o.consumer==='800c37f4'&&o.arguments[0]===58));
});
test('normal first racing round runs the complete class-title sequence before enabling skip',()=>{
 let q=step(initial(1),0x8000);assert.deepEqual(q.state.profileWordsB330.slice(4,8),[0,0,0,0]);
 const stages=[];let frames=0;
 while(q.state.scene.gameStateAb24===30&&frames<160){q=step(q.state,0x8000);stages.push(q.draw.panelStage);frames++;}
 assert.equal(frames,109);assert.equal(stages.filter(x=>x===0).length,69);assert.equal(stages.filter(x=>x===1).length,40);
 assert.equal(q.state.scene.gameStateAb24,31);assert.equal(q.state.scene.field644,20);
});
test('automatic timeout and restart use the source counter and exactly the intended shared RNG calls',()=>{
 let q=step(initial());
 for(let i=0;i<180;i++){q=step(q.state);assert.equal(q.state.scene.gameStateAb24,30);}
 assert.equal(q.state.scene.field644,180);q=step(q.state);assert.equal(q.state.scene.gameStateAb24,31);
 const s=structuredClone(step(initial()).state);s.championshipSelectionWords6f84[1]=1;
 const restart=step(s),points=s.profileWordsB330.slice(4,8);
 assert.equal(restart.handoff.destination,'introduction');assert.equal(restart.diagnostic.rngCalls,0);
 // EB91C itself consumes one shared random value; the display's extra draw
 // must be skipped on this branch.
 assert.equal(restart.state.scene.rngState4640,stepNativeAIRandom(s.scene.rngState4640).rngState);
 assert.equal(restart.state.scene.initLatch63c,1);assert.equal(restart.state.scene.field644,1);
 assert.deepEqual(restart.state.profileWordsB330.slice(4,8),points);
});
test('exit fade configures the next course once and its prepared loader retains accumulated scores',()=>{
 let q=step(initial());for(let i=0;i<40;i++)q=step(q.state,0x8000);
 let frames=0,stopSound=0;
 while(!q.handoff&&frames<100){q=step(q.state);frames++;stopSound+=q.effects.filter(o=>o.consumer==='800c1f60'&&o.arguments[0]===7).length;}
 assert.equal(q.handoff?.destination,'race');assert.equal(stopSound,1);
 assert.equal(q.state.scene.main638,1);assert.equal(q.state.scene.mode620,4);
 const configuration=q.handoff.configuration,expectedPoints=configuration.state.profileWordsB330.slice(4,8);
 const runtime=createNativeRaceCourseRuntime({course:nativeRaceScene(getCourse('amber')),difficulty:0,players:1,raceMode:'championship'});
 assert.throws(()=>prepareNativeChampionshipConfiguredLaunch(configuration,{courseRuntime:runtime}),/effects/);
 const prepared=prepareNativeChampionshipConfiguredLaunch(configuration,{courseRuntime:runtime,configurationEffectsPending:q.handoff.configurationEffectsPending});
 assert.deepEqual(prepared.state.profileWordsB330.slice(4,8),expectedPoints);assert.deepEqual(expectedPoints,[7,4,2,1]);
 assert.equal(prepared.state.scene.rngState4640,configuration.state.scene.rngState4640);
 assert.equal(prepared.hullStarts.length,4);assert.ok(prepared.hullStarts.every(h=>h.grid.transform.complete));
 for(const consumer of ['80096960','8009684c','800c21f4']){
  assert.equal(q.effects.filter(o=>o.consumer===consumer).length,1);
  assert.equal(prepared.pendingEffects.filter(o=>o.consumer===consumer).length,0);
 }
});
test('display-disabled frames hold panels, and a late configuration error cannot commit countdown or fade',()=>{
 const s=structuredClone(step(initial()).state);s.scene.field3938=0;
 const before=structuredClone(s),q=step(s);assert.deepEqual(q.state.championshipIntroPanelWords6f64,s.championshipIntroPanelWords6f64);
 assert.deepEqual(s,before);
 const failing=structuredClone(q.state);failing.scene.gameStateAb24=31;failing.scene.field644=1;
 // End stage2 now: the fade writes its one-frame completion pulse before
 // post-display sees it and requests configuration.
 failing.hudWords7788[(0x8a10-0x7788)/4]=(4<<16)|2;
 failing.hudWords7788[(0x8a18-0x7788)/4]=0;failing.hudWords7788[(0x8a1c-0x7788)/4]=0;
 const copy=structuredClone(failing);
 assert.throws(()=>step(failing,0,{...views,avatarsA9b0:[]}),/avatar|Avatar/);assert.deepEqual(failing,copy);
});
