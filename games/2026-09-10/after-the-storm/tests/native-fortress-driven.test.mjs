import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';

for(let difficulty=0;difficulty<4;difficulty++)test(`Fortress class${difficulty}: ordinary inputs complete three canonical laps`,()=>{
 const s=createRace({course:getCourse('citadel',difficulty),difficulty,mode:'time',physics:'native',waveSeed:17}),r=s.racers[0];
 const pilot=createNativeRacePilot({course:s.course}),layout=JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors});
 for(let frame=0;frame<7500&&r.finishTime===null&&!r.dq;frame++)stepRace(s,()=>pilot.input(s,r),.05);
 assert.equal(r.dq,'');assert.ok(r.finishTime>100&&r.finishTime<200);assert.equal(r.lap,3);assert.equal(r.lapTimes.length,3);
 assert.ok(r.misses<5);assert.equal(s.nativeLaunch.records()[0].finished,true);
 assert.equal(JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors}),layout);
 const native=s.nativeLaunch.snapshot();assert.equal(native.raceWords1f94[(0x1fc8-0x1f94)/4],Number(difficulty>0));assert.equal(s.nativeCourseWorld.volumes[0].origin[1],difficulty===0?-1.5:132*.025);assert.equal(s.nativePreview,true);
});
