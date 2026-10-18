import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';

for(let difficulty=0;difficulty<4;difficulty++)test(`Drake class${difficulty}: ordinary inputs complete three canonical laps`,()=>{
 const s=createRace({course:getCourse('reed',difficulty),difficulty,mode:'time',physics:'native',waveSeed:17}),r=s.racers[0];
 const pilot=createNativeRacePilot({course:s.course}),layout=JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors});
 for(let frame=0;frame<7500&&r.finishTime===null&&!r.dq;frame++)stepRace(s,()=>pilot.input(s,r),.05);
 assert.equal(r.dq,'');assert.ok(r.finishTime>100&&r.finishTime<170);assert.equal(r.lap,3);assert.equal(r.lapTimes.length,3);
 assert.equal(r.misses,difficulty===3?1:0);assert.equal(s.nativeLaunch.records()[0].finished,true);
 assert.equal(JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors}),layout);
 assert.ok(s.nativeCourseWorld.decorations.every(q=>q.visible));assert.equal(s.nativePreview,true);
});
