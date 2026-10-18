import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DRAKE_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from '../source-drake-rows.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {nativeDrakeSupportGeometry} from '../native-drake-support.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-drake-primary.json',import.meta.url),'utf8'));
const course=difficulty=>({sourceWaterCourseIndex:4,reverse:difficulty===3,
 sourceRouteRowsByClass:rows,sourceMetadata:{nativeCourseIndex:4,nativeScale:.025,sourceNativeClassByDifficulty:[0,1,2,2]},
 sourceBuoyLayout:createSourceBuoyLayout({rows:rows[difficulty],courseIndex:4,scale:.025,reverse:difficulty===3})});

test('prepared Drake primary owners match 28210 original initialized words across four classes and both player counts',()=>{
 assert.equal(fixture.length,8);assert.deepEqual(rows.map(r=>r.length),[55,57,61,44]);
 for(const f of fixture){
  const runtime=createNativeRaceCourseRuntime({course:course(f.difficulty),difficulty:f.difficulty,players:f.players});
  assert.deepEqual(runtime.data.recordWordsBySourceRow,f.recordWordsBySourceRow);
  assert.equal(runtime.data.finishSourceRow,f.finishSourceRow);
  assert.equal(runtime.mode620,f.players===1?0:1);assert.equal(runtime.sourceDifficulty,[0,1,2,2][f.difficulty]);
  assert.equal(runtime.directionFlag1f90,Number(f.difficulty===3));
  assert.equal(runtime.staticContactGeometry.boxes.count0578,0);assert.equal(runtime.objectStartup.counts.collisionPlaneCount0578,0);
  assert.equal(runtime.objectStartup.counts.ringCountB134,0);
  assert.ok(runtime.objectStartup.objectKinds4c.every(k=>k===3||k===4));
  assert.equal(runtime.resetLayout.boundaryNativeXZ.length,runtime.objectStartup.counts.fixedSphereCountC938);
  for(const n of runtime.aiTargetTable.nodes){
   const q=runtime.data.nodes[n.sourceRow],words=runtime.data.recordWordsBySourceRow[n.sourceRow];
   assert.deepEqual(n.endpointPlusNativeXZ,q.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,q.endpointBNativeXZ);
   for(let rider=0;rider<4;rider++){
    assert.equal(n.nextByAvatar[rider],words[0xcc/4+rider]);assert.equal(n.previousByAvatar[rider],words[0xf4/4+rider]);
   }
  }
 }
});

test('Drake solo and versus reuse the complete immutable source shore/floor data',()=>{
 const solo=nativeDrakeSupportGeometry(),versus=nativeDrakeSupportGeometry({players:2}),stunt=nativeAdditionalStuntSupportGeometry({courseIndex:4});
 assert.equal(solo,versus);assert.equal(solo.floor,stunt.floor);assert.equal(solo.shore,stunt.shore);
 assert.equal(solo.floor.planes.length,22);assert.equal(solo.shore.lines.length-1,72);
 assert.throws(()=>solo.shore.lines[1].push(0),TypeError);
 assert.throws(()=>nativeDrakeSupportGeometry({players:3}),/one or two/);
 assert.throws(()=>rows[0][0].push(0),TypeError);
});

test('numeric preparation keeps ordinary live admission separate from the legacy illustration scene',()=>{
 assert.throws(()=>createNativeRaceCourseRuntime({course:getCourse('reed'),difficulty:0,players:1}),/source route rows/);
 for(const mode of ['time','versus'])assert.throws(()=>createRace({course:getCourse('reed'),physics:'native',mode}),/source-water/);
 assert.equal(createRace({course:getCourse('reed'),mode:'time'}).physics,'modern');
});
