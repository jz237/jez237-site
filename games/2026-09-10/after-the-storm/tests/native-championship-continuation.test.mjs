import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse,COURSES} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {prepareNativeChampionshipContinuation} from '../native-championship-continuation.js';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
const courseFor=index=>COURSES.find(c=>getCourse(c.id).sourceWaterCourseIndex===index).id;
const POINTS=[7,4,2,1];

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
 const first=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven',0),difficulty:0,rider:1});
 const avatars=first.racers.map(r=>r.id),places1=raceToHandoff(first),finished=first.nativeLaunch.snapshot();
 assert.deepEqual(finished.profileWordsB330.slice(4,8),places1.map(p=>POINTS[p]));
 const before=structuredClone(finished),next=prepareNativeChampionshipContinuation(finished,{avatarsBySlot:avatars});
 assert.deepEqual(finished,before,'continuation leaves the finished round untouched');
 assert.equal(next.courseIndex,2);assert.equal(next.round,2);assert.equal(next.sourceDifficulty,0);assert.deepEqual(next.points,places1.map(p=>POINTS[p]));
 assert.throws(()=>prepareNativeChampionshipContinuation(finished,{avatarsBySlot:[0,0,1,2]}),/four championship avatars/);
 const id=courseFor(next.courseIndex);assert.equal(id,'amber');
 assert.throws(()=>createRace({mode:'championship',physics:'native',course:getCourse('reed',0),difficulty:0,rider:1,nativeChampionshipContinuation:next}),/continuation/);
 const second=createRace({mode:'championship',physics:'native',course:getCourse(id,0),difficulty:0,rider:1,nativeChampionshipContinuation:next});
 assert.deepEqual(second.racers.map(r=>r.id),avatars);assert.deepEqual(second.nativeLaunch.snapshot().profileWordsB330.slice(4,8),next.points);
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
