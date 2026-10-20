import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
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
 const inputs=second.nativeHost.introductionInputs(),fly=prepareNativeChampionshipFlyover(finished,{avatarsBySlot:avatars,...inputs});
 assert.equal(fly.courseIndex,2);assert.ok(fly.frames.length>next.frames+100,'natural introduction outlasts the skipped one');
 assert.deepEqual(finished,before,'flyover leaves the finished round untouched');
 assert.ok(fly.frames.every(q=>[...q.eyeNative,...q.targetNative,...q.up].every(Number.isFinite)&&q.fovDegrees===60));
 const step=fly.frames.slice(1).map((q,i)=>Math.hypot(...q.eyeNative.map((v,j)=>v-fly.frames[i].eyeNative[j])));
 assert.equal(step.filter(d=>d>200).length,1,'one cut between the two Sunset Bay shots');assert.ok(step.some(d=>d>0&&d<200),'the camera moves within a shot');
 assert.deepEqual(prepareNativeChampionshipFlyover(finished,{avatarsBySlot:avatars,...inputs}),fly,'deterministic');assert.deepEqual(second.nativeLaunch.snapshot().profileWordsB330.slice(4,8),next.points);
 const places2=raceToHandoff(second);
 assert.deepEqual(second.nativeLaunch.snapshot().profileWordsB330.slice(4,8),places1.map((p,i)=>POINTS[p]+POINTS[places2[i]]));
 const third=prepareNativeChampionshipContinuation(second.nativeLaunch.snapshot(),{avatarsBySlot:avatars});
 assert.equal(third.courseIndex,4);assert.equal(third.round,3);
});

// Prepared by chaining five pilot-driven Normal rounds through this runtime.
const finalRound=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-championship-final-round.json.gz',import.meta.url))));
test('a qualified final round enters the original ending state and completes the cup with final totals',()=>{
 const {id,continuation}=finalRound;assert.equal(id,'tempest');assert.equal(continuation.round,6);
 const s=createRace({mode:'championship',physics:'native',course:getCourse(id,0),difficulty:0,rider:0,nativeChampionshipContinuation:continuation}),r=s.racers[0],pilot=createNativeRacePilot({course:s.course});
 for(let i=0;i<220*30&&!['standings','results'].includes(s.phase);i++)stepRace(s,()=>pilot.input(s,r),1/30);
 assert.equal(s.phase,'results');assert.equal(s.nativeLaunch.snapshot().scene.gameStateAb24,45);
 const done=s.nativeChampionshipComplete,places=s.racers.map(q=>q.nativePlace);
 assert.deepEqual(done.places,places);assert.deepEqual(done.totals,continuation.points.map((p,i)=>p+POINTS[places[i]]));assert.equal(done.difficulty,0);
});
