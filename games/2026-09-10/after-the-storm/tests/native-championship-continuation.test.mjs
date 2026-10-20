import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,beginNativeChampionshipEnding,fastForwardNativeEnding,prepareNativeCupWarmupSelection} from '../race-core.js';
import {getCourse,COURSES} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {prepareNativeChampionshipContinuation,prepareNativeChampionshipFlyover} from '../native-championship-continuation.js';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
const courseFor=index=>COURSES.find(c=>getCourse(c.id).sourceWaterCourseIndex===index).id;
const POINTS=[7,4,2,1];
const bank=i=>new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)));
const actors=banks=>({assets:Object.fromEntries(banks.map(i=>[i,bank(i)])),onDisplay(){}});

function raceToHandoff(s){
 const r=s.racers[0],pilot=createNativeRacePilot({course:s.course});
 for(let i=0;i<260*30&&s.phase!=='standings';i++)stepRace(s,()=>pilot.input(s,r),1/30);
 assert.equal(s.phase,'standings');
 const places=s.racers.map(q=>q.nativePlace);
 for(let frame=0;frame<3000&&s.phase==='standings';frame++)stepRace(s,{continue:frame%20<2},1/20);
 assert.equal(s.phase,'results');assert.equal(s.nativeStandings.handoff.destination,'championship');
 return places;
}

test('a native cup continues from the original standings into the next course with points carried',()=>{
 // Wildlife in both rounds: round 2 loads its banks into the storage round 1 retained.
 const first=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven',0),difficulty:0,rider:1,nativeCourseActors:actors([3,2])});
 const avatars=first.racers.map(r=>r.id),places1=raceToHandoff(first),finished=first.nativeLaunch.snapshot();
 assert.deepEqual(finished.profileWordsB330.slice(4,8),places1.map(p=>POINTS[p]));
 const before=structuredClone(finished),next=prepareNativeChampionshipContinuation(finished,{avatarsBySlot:avatars});
 assert.deepEqual(finished,before,'continuation leaves the finished round untouched');
 assert.equal(next.courseIndex,2);assert.equal(next.round,2);assert.equal(next.sourceDifficulty,0);assert.deepEqual(next.points,places1.map(p=>POINTS[p]));
 assert.throws(()=>prepareNativeChampionshipContinuation(finished,{avatarsBySlot:[0,0,1,2]}),/four championship avatars/);
 const id=courseFor(next.courseIndex);assert.equal(id,'amber');
 assert.throws(()=>createRace({mode:'championship',physics:'native',course:getCourse('reed',0),difficulty:0,rider:1,nativeChampionshipContinuation:next}),/continuation/);
 assert.ok(finished.resourceWordsE73c&&finished.effectWords0790,'round 1 retains actor and effect storage');
 const second=createRace({mode:'championship',physics:'native',course:getCourse(id,0),difficulty:0,rider:1,nativeChampionshipContinuation:next,nativeCourseActors:actors([0])});
 assert.equal(second.nativeLaunch.snapshot().actorWordsF060.filter((w,i)=>i%47===0&&w===6).length,3,'Sunset Bay dolphins');
 assert.deepEqual(second.racers.map(r=>r.id),avatars);
 // The unskipped main8 introduction runs Sunset Bay's original flyover script on a copy.
 const inputs={...second.nativeHost.introductionInputs(),actors:second.nativeHost.introductionActorInputs()},fly=prepareNativeChampionshipFlyover(finished,{avatarsBySlot:avatars,...inputs});
 assert.equal(fly.courseIndex,2);assert.ok(fly.frames.length>next.frames+100,'natural introduction outlasts the skipped one');
 assert.deepEqual(finished,before,'flyover leaves the finished round untouched');
 assert.ok(fly.frames.every(q=>[...q.eyeNative,...q.targetNative,...q.up].every(Number.isFinite)&&q.fovDegrees===60));
 const step=fly.frames.slice(1).map((q,i)=>Math.hypot(...q.eyeNative.map((v,j)=>v-fly.frames[i].eyeNative[j])));
 assert.equal(step.filter(d=>d>200).length,1,'one cut between the two Sunset Bay shots');assert.ok(step.some(d=>d>0&&d<200),'the camera moves within a shot');
 assert.deepEqual(prepareNativeChampionshipFlyover(finished,{avatarsBySlot:avatars,...inputs}),fly,'deterministic');
 // Main8 loads Sunset Bay's actors (AC184) and ADF90 draws its three dolphins every frame.
 assert.ok(fly.frames.every(q=>q.actors.presentation.draws.length===15));assert.deepEqual(second.nativeLaunch.snapshot().profileWordsB330.slice(4,8),next.points);
 const places2=raceToHandoff(second);
 assert.deepEqual(second.nativeLaunch.snapshot().profileWordsB330.slice(4,8),places1.map((p,i)=>POINTS[p]+POINTS[places2[i]]));
 const third=prepareNativeChampionshipContinuation(second.nativeLaunch.snapshot(),{avatarsBySlot:avatars});
 assert.equal(third.courseIndex,4);assert.equal(third.round,3);
});

// Prepared by chaining five pilot-driven Normal rounds through this runtime.
const finalRound=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-championship-final-round.json.gz',import.meta.url))));
test('a qualified final round enters the original ending state and completes the cup with final totals',()=>{
 const {id,continuation}=finalRound;assert.equal(id,'tempest');assert.equal(continuation.round,6);
 // A continued round loads Southern Island's own alternate-route count, so its wildlife starts.
 const wild=createRace({mode:'championship',physics:'native',course:getCourse(id,0),difficulty:0,rider:0,nativeChampionshipContinuation:continuation,nativeCourseActors:actors([1,3])});
 assert.equal(wild.nativeLaunch.snapshot().scene.secondaryCount,47);
 const s=createRace({mode:'championship',physics:'native',course:getCourse(id,0),difficulty:0,rider:0,nativeChampionshipContinuation:continuation}),r=s.racers[0],pilot=createNativeRacePilot({course:s.course});
 for(let i=0;i<220*30&&!['standings','results'].includes(s.phase);i++)stepRace(s,()=>pilot.input(s,r),1/30);
 assert.equal(s.phase,'results');assert.equal(s.nativeLaunch.snapshot().scene.gameStateAb24,45);
 const done=s.nativeChampionshipComplete,places=s.racers.map(q=>q.nativePlace);
 assert.deepEqual(done.places,places);assert.deepEqual(done.totals,continuation.points.map((p,i)=>p+POINTS[places[i]]));assert.equal(done.difficulty,0);
 // The original ending: final-round awards, ECB98 entry, the ceremony wait, the results scroll and its exit.
 beginNativeChampionshipEnding(s);const entered=s.nativeLaunch.snapshot();
 assert.equal(s.phase,'ending');assert.deepEqual([entered.scene.main638,entered.scene.gameStateAb24,entered.scene.courseIndex],[21,102,7]);
 assert.deepEqual(entered.profileWordsB330.slice(4,8),done.totals,'94ACC applies the final round once');
 assert.deepEqual(entered.profileWordsB330.slice(32,36),places.map(p=>POINTS[p]),'final round award slots');
 assert.equal(fastForwardNativeEnding(s),681,'the ceremony waits 680 frames before the first panel');
 const tokens=new Set();let readyAt=null;
 for(let f=0;f<3000&&s.phase==='ending';f++){
  const a=readyAt!==null&&f%2===0;stepRace(s,{},.05,{menuInputs:[{continue:a}]});
  for(const c of s.nativeEnding.draw?.ending?.commands??[])if(c.kind==='label')tokens.add(c.token);
  if(readyAt===null&&s.nativeEnding.view.ready)readyAt=f;
 }
 assert.equal(s.phase,'results');assert.ok(['records','title'].includes(s.nativeEnding.handoff.destination));
 assert.ok([...tokens].every(t=>t===0||t>=8&&t<=16||[31,32,38,49,58,87,98,99].includes(t)||t>=71&&t<=78||t>=93&&t<=96),[...tokens].join());
 assert.ok([10,11,12,13,15].every(t=>tokens.has(t)),'course rows name their courses');
 // The records exit opens the original championship initials (state100, main6), then the records browser.
 if(s.nativeEnding.handoff.destination==='records'){
  const L=s.nativeLaunch,before=L.recordSessionSnapshot(),neutral={heldButtons:0,rawXNative:0,rawYNative:0};
  assert.equal(L.championshipNameEntryView().active,true);let q,initials='';
  for(let f=0;f<1500;f++){q=L.advanceChampionshipNameEntry({...neutral,heldButtons:f>40&&f%20===0?0x8000:0});initials=q.view.initials||initials;if(q.handoff)break;}
  assert.equal(q.handoff.destination,'records-browser');assert.equal(initials,'AAA');
  assert.deepEqual([L.snapshot().scene.main638,L.snapshot().scene.gameStateAb24],[12,66]);
  assert.notDeepEqual(L.recordSessionSnapshot(),before,'initials commit the championship records');
 }
});

test('a fresh cup round enters through the original championship return and course introduction',()=>{
 const s=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven',1),difficulty:1,rider:2,nativeChampionshipIntroduction:true,nativeCourseActors:actors([3,2])});
 const g=s.nativeLaunch.snapshot();
 assert.deepEqual([g.scene.courseIndex,g.profileWordsB330[1],g.profileWordsB330[2]],[1,0,1]);assert.deepEqual(g.profileWordsB330.slice(4,8),[0,0,0,0]);
 assert.equal(s.nativeChampionshipSelection.scene.mode608,4);
 const fly=prepareNativeChampionshipFlyover(s.nativeChampionshipSelection,{avatarsBySlot:s.racers.map(r=>r.id),...s.nativeHost.introductionInputs(),actors:s.nativeHost.introductionActorInputs()});
 assert.equal(fly.courseIndex,1);assert.ok(fly.frames.length>100);
 // AC184 returns early in main8; Sunny Beach's introduction script spawns no actors.
 assert.ok(fly.frames.every(q=>q.actors.presentation.draws.length===0));
 assert.ok(new Set(fly.frames.map(q=>q.eyeNative.join())).size>10,'the camera flies');
 for(let i=0;i<300;i++)stepRace(s,{throttle:1},1/30);assert.equal(s.phase,'running');
 assert.throws(()=>createRace({mode:'time',physics:'native',course:getCourse('greyhaven',1),difficulty:1,nativeChampionshipIntroduction:true}),/fresh native championship/);
});

test('the Normal cup previews Dolphin Park through the original return before its warm-up',()=>{
 const selection=prepareNativeCupWarmupSelection({rider:1});
 assert.deepEqual([selection.scene.mode608,selection.profileWordsB330[0],selection.profileWordsB330[1],selection.profileWordsB330[2]],[4,0,0,0]);
 const p=createRace({mode:'practice',physics:'native',course:getCourse('practice'),rider:1,nativeCourseActors:actors([0,2])});
 const fly=prepareNativeChampionshipFlyover(selection,{avatarsBySlot:[1,0,2,3],...p.nativeHost.introductionInputs(),actors:p.nativeHost.introductionActorInputs()});
 assert.equal(fly.courseIndex,0);assert.ok(fly.frames.length>100);
 // AC184 spawns nothing in main8; the Dolphin Park script brings its own dolphin.
 assert.ok(fly.frames.filter(q=>q.actors.presentation.draws.length===5).length>fly.frames.length*.9,'one dolphin for nearly all frames');
 assert.ok(new Set(fly.frames.map(q=>q.eyeNative.join())).size>10,'the camera moves');
});
