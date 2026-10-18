import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';

for(const difficulty of [1,2,3])test(`Twilight class${difficulty}: ordinary inputs complete three canonical laps`,()=>{
 const s=createRace({course:getCourse('neon',difficulty),difficulty,mode:'time',physics:'native',waveSeed:17}),r=s.racers[0];
 const pilot=createNativeRacePilot({course:s.course}),layout=JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors});
 for(let frame=0;frame<7500&&r.finishTime===null&&!r.dq;frame++)stepRace(s,()=>pilot.input(s,r),.05);
 assert.equal(r.dq,'');assert.ok(r.finishTime>100&&r.finishTime<220);assert.equal(r.lap,3);assert.equal(r.lapTimes.length,3);
 assert.ok(r.misses<5);assert.equal(s.nativeLaunch.records()[0].finished,true);
 assert.equal(JSON.stringify({rows:s.course.sourceRouteRowsByClass,anchors:s.course.anchors}),layout);
 assert.equal(s.nativeCourseWorld.volumes.length,4);assert.equal(s.nativeCourseWorld.rings.length,0);assert.equal(s.nativePreview,true);
});

test('Twilight two-player Hard keeps two physical records and finishes by ordinary controls',()=>{
 const s=createRace({course:getCourse('neon',1),difficulty:1,mode:'versus',physics:'native',waveSeed:17});
 const pilots=s.racers.map(()=>createNativeRacePilot({course:s.course}));
 for(let frame=0;frame<7500&&!s.racers.some(r=>r.finishTime!==null||r.dq);frame++)
  stepRace(s,s.racers.map((r,i)=>()=>pilots[i].input(s,r)),.05);
 assert.equal(s.nativeLaunch.records().length,2);assert.ok(s.racers.some(r=>r.finishTime>100&&r.finishTime<220));
 for(const r of s.racers){assert.equal(r.dq,'');assert.ok(r.lap>=2);assert.ok(r.misses<5);}
 assert.equal(s.course.sourceCollisionPlayerCount,2);assert.equal(s.nativeCourseWorld.volumes.length,4);
});
