import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeRaceCourseRegions} from '../native-course-regions.js';
import {nativeRaceOutsideAllowedRegion} from '../native-race-boundary-warning.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createSourceSunsetCourse} from '../source-sunset-course.js';
import {createSourceBuoyLayout,sourceBuoyCourseRules} from '../source-buoy-progress.js';
import {polygonDistance} from '../classic-courses.js';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';

const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-sunset-regions.json',import.meta.url),'utf8'));
function prepared(difficulty){
 const source=createSourceSunsetCourse(polygonDistance),reverse=difficulty===3;
 return {...source,sourceWaterCourseIndex:2,reverse,
  sourceBuoyLayout:createSourceBuoyLayout({rows:source.sourceRouteRowsByClass[difficulty],courseIndex:2,reverse})};
}

test('Sunset course-out queries match original execution at 449 actual-table points including binary32 edge neighbours',()=>{
 const regions=nativeRaceCourseRegions(2);assert.equal(regions.allowedRegionsNative.length,11);assert.equal(regions.warningSuppressionRegionsNative.length,0);
 assert.equal(fixture.queries.length,449);
 for(const q of fixture.queries)assert.equal(nativeRaceOutsideAllowedRegion(q.positionNativeXZ,regions),q.outside,JSON.stringify(q.positionNativeXZ));
 assert.deepEqual(sourceBuoyCourseRules(2).regionsNative,fixture.progressRegionsNative);
 assert.notDeepEqual(regions.allowedRegionsNative,fixture.progressRegionsNative);
 assert.throws(()=>regions.allowedRegionsNative[0].push(0),TypeError);
 assert.throws(()=>nativeRaceCourseRegions(3),/No verified/);
});

test('prepared Sunset ordinary owners select their own course, 1200-unit slack, regions and linked primary/AI geometry',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const course=prepared(difficulty),runtime=createNativeRaceCourseRuntime({course,difficulty,players});
  assert.equal(runtime.courseIndex,2);assert.equal(runtime.sourceBuoyLayout.courseIndex,2);assert.equal(runtime.mode620,players===2?1:0);
  assert.equal(runtime.resetLayout.checkpointSlackNative,1200);assert.equal(runtime.sourceBuoyLayout.checkpointSlackNative,1200);
  assert.equal(runtime.directionFlag1f90,difficulty===3?1:0);assert.equal(runtime.sourceDifficulty,[0,1,2,2][difficulty]);
  assert.equal(runtime.resetLayout.boundaryNativeXZ.length,81);assert.deepEqual(runtime.resetLayout.objectKinds4c,[]);
  assert.deepEqual(runtime.allowedRegionsNative,course.sourceCourseOutRegions.allowedRegionsNative);
  for(const n of runtime.aiTargetTable.nodes){
   const row=runtime.data.nodes[n.sourceRow],words=runtime.data.recordWordsBySourceRow[n.sourceRow];
   assert.deepEqual(n.forwardXZ,row.forwardXZ);assert.deepEqual(n.endpointPlusNativeXZ,row.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,row.endpointBNativeXZ);
   assert.equal(runtime.sourceBuoyLayout.nodes[n.sourceRow].nextSourceRow,row.nextSourceRowA0);
   for(let avatar=0;avatar<4;avatar++){assert.equal(n.nextByAvatar[avatar],words[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],words[0xf4/4+avatar]);}
  }
 }
});

test('preparing Sunset data does not admit legacy map geometry or enable an unverified live native race',()=>{
 assert.throws(()=>createNativeRaceCourseRuntime({course:getCourse('amber'),difficulty:0,players:1}),/source route rows/);
 assert.throws(()=>createRace({course:prepared(0),mode:'time',physics:'native'}),/Sunny|native|source/i);
 const sunny=createNativeRaceCourseRuntime({course:getCourse('greyhaven'),difficulty:0,players:1});
 assert.equal(sunny.resetLayout.checkpointSlackNative,256);assert.equal(sunny.allowedRegionsNative.length,7);assert.equal(sunny.courseIndex,1);
});
