import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {DOLPHIN_SECONDARY_ROWS} from '../source-dolphin-secondary-rows.js';
import {createNativePrimaryCourseData} from '../native-primary-initialization.js';
import {nativeDolphinPracticeScene} from '../source-dolphin-practice-course.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeStuntCourseRuntime} from '../native-stunt-course-runtime.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeRaceStateOperations} from '../native-race-state.js';
import {getCourse} from '../courses.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-secondary-route.json.gz',import.meta.url))));
const racers=[{id:0,lap:0,grid:0,power:0,misses:0}];

test('all64 secondary dolphin rows and initialized words match original loading and735EC',()=>{
 assert.deepEqual(DOLPHIN_SECONDARY_ROWS,evidence.rows);assert.equal(DOLPHIN_SECONDARY_ROWS.length,64);
 assert.equal(evidence.cases.reduce((n,c)=>n+c.sourceCounter,0),50042);
 for(const c of evidence.cases){
  const input={rows:DOLPHIN_SECONDARY_ROWS,courseIndex:0,mode620:0,initialRecordWordsBySourceRow:c.initialRecordWordsBySourceRow},before=structuredClone(input);
  const q=createNativePrimaryCourseData(input);
  assert.deepEqual(q.recordWordsBySourceRow,c.recordWordsBySourceRow);assert.equal(q.finishSourceRow,c.finishSourceRow);
  assert.deepEqual(input,before);
 }
});

test('Practice keeps separate60/64 course families and canonical counts without changing computer routes',()=>{
 const runtime=createNativeRaceCourseRuntime({course:nativeDolphinPracticeScene(getCourse('practice')),difficulty:0,players:1});
 assert.equal(runtime.courseActorRoutes.primary,runtime.data);assert.equal(runtime.data.nodes.length,60);
 assert.equal(runtime.courseActorRoutes.secondary.nodes.length,64);assert.equal(runtime.courseActorRoutes.tertiary,null);
 assert.deepEqual(Object.keys(runtime.aiFamilies),['primary']);
 const state=createNativeRaceMemory({racers,courseIndex:0,players:1,mode620:0,courseRuntime:runtime});
 assert.equal(state.scene.primaryCount,60);assert.equal(state.scene.secondaryCount,64);
 const changed=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'secondaryCount',value:3}]).state;
 assert.equal(changed.scene.primaryCount,60);assert.equal(changed.scene.secondaryCount,3);assert.equal(state.scene.secondaryCount,64);
 assert.throws(()=>prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'secondaryCount',value:65}]),/secondaryCount/);
});

test('Stunt selects no secondary family and does not borrow the Practice dolphin path',()=>{
 for(let courseIndex=0;courseIndex<9;courseIndex++){
  const runtime=createNativeStuntCourseRuntime({courseIndex});
  assert.equal(runtime.courseActorRoutes.primary,runtime.data);assert.equal(runtime.courseActorRoutes.secondary,null);assert.equal(runtime.courseActorRoutes.tertiary,null);
  const state=createNativeRaceMemory({racers,courseIndex,players:1,mode620:11,courseRuntime:runtime});
  assert.equal(state.scene.secondaryCount,0);assert.equal(state.scene.primaryCount,runtime.data.nodes.length);
 }
});
