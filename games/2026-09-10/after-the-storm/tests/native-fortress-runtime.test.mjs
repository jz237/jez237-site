import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FORTRESS_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from '../source-fortress-rows.js';
import {FORTRESS_NATIVE_SECONDARY_ROWS_BY_CLASS as secondary} from '../source-fortress-ai-routes.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {nativeFortressSupportGeometry} from '../native-fortress-support.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const fixtures=name=>JSON.parse(readFileSync(new URL('./fixtures/native-fortress-'+name+'.json',import.meta.url),'utf8'));
const course=difficulty=>({sourceWaterCourseIndex:3,reverse:difficulty===3,
 sourceRouteRowsByClass:rows,sourceMetadata:{nativeCourseIndex:3,nativeScale:.025,sourceNativeClassByDifficulty:[0,1,2,2]},
 sourceBuoyLayout:createSourceBuoyLayout({rows:rows[difficulty],courseIndex:3,scale:.025,reverse:difficulty===3})});
const runtime=(difficulty,players=1)=>createNativeRaceCourseRuntime({course:course(difficulty),difficulty,players});

test('Fortress primary preparation matches 25090 original initialized words for all classes and player counts',()=>{
 const cases=fixtures('primary');assert.equal(cases.length,8);assert.deepEqual(rows.map(r=>r.length),[55,54,54,30]);
 for(const f of cases){
  const r=runtime(f.difficulty,f.players);
  assert.deepEqual(r.data.recordWordsBySourceRow,f.recordWordsBySourceRow);
  assert.equal(r.data.finishSourceRow,f.finishSourceRow);assert.equal(r.mode620,f.players-1);
  assert.equal(r.sourceDifficulty,[0,1,2,2][f.difficulty]);assert.equal(r.directionFlag1f90,Number(f.difficulty!==3));
  assert.deepEqual(r.warningSuppressionRegionsNative,[[-2600,800,-100,3600],[600,1900,-200,1500]]);
  assert.equal(r.allowedRegionsNative.length,19);
  assert.equal(r.objectStartup.counts.ringCountB134,0);assert.equal(r.resetLayout.boundaryNativeXZ.length,112);
  assert.equal(r.objectStartup.counts.objectCountFa40,[4,7,12,12][f.difficulty]);
  assert.equal(r.staticContactGeometry.boxes.count0578,[1,4,9,9][f.difficulty]);
  const bits=new DataView(new ArrayBuffer(4));
  const expected=r.objectStartup.storage.collisionPlaneWordsFd78.slice(0,r.staticContactGeometry.boxes.count0578*16);
  assert.deepEqual(r.staticContactGeometry.boxes.rows.flat().map(v=>{bits.setFloat32(0,v);return bits.getUint32(0);}),expected);
  assert.equal(r.objectStartup.objectKinds4c[0],2);assert.equal(r.objectStartup.objectKinds4c.filter(k=>k===5).length,3);
 }
});

test('solo Fortress secondary families retain 12545 original initialized words and avatar navigation links',()=>{
 const cases=fixtures('secondary');assert.equal(cases.length,4);
 for(const f of cases){
  const r=runtime(f.difficulty),family=r.aiFamilies.secondary;
  assert.deepEqual(family.data.recordWordsBySourceRow,f.recordWordsBySourceRow);
  assert.equal(family.data.finishSourceRow,f.finishSourceRow);
  assert.equal(secondary[f.difficulty].length,rows[f.difficulty].length);
  for(const table of [r.aiTargetTable,family.targetTable])for(const n of table.nodes){
   const data=table===r.aiTargetTable?r.data:family.data,w=data.recordWordsBySourceRow[n.sourceRow];
   assert.deepEqual(n.endpointPlusNativeXZ,data.nodes[n.sourceRow].endpointANativeXZ);
   for(let avatar=0;avatar<4;avatar++){
    assert.equal(n.nextByAvatar[avatar],w[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],w[0xf4/4+avatar]);
   }
  }
  assert.deepEqual(Object.keys(runtime(f.difficulty,2).aiFamilies),['primary']);
  assert.throws(()=>secondary[f.difficulty][0].push(1),TypeError);
 }
});

test('Fortress preparation shares verified finite support but does not enable the old illustration scene',()=>{
 const one=nativeFortressSupportGeometry(),two=nativeFortressSupportGeometry({players:2}),stunt=nativeAdditionalStuntSupportGeometry({courseIndex:3});
 assert.equal(one,two);assert.equal(one.floor,stunt.floor);assert.equal(one.shore,stunt.shore);
 assert.equal(one.floor.planes.length,78);assert.equal(one.shore.lines.length-1,92);
 assert.throws(()=>one.shore.lines[1].push(0),TypeError);
 assert.throws(()=>nativeFortressSupportGeometry({players:3}),/one or two/);
 assert.throws(()=>createNativeRaceCourseRuntime({course:course(0),difficulty:0,players:1,objectLayout:'authored'}),/canonical/);
 assert.throws(()=>createNativeRaceCourseRuntime({course:getCourse('citadel'),difficulty:0,players:1}),/source route rows/);
 for(const mode of ['time','versus'])assert.equal(createRace({course:getCourse('citadel'),physics:'native',mode}).course.nativeSceneMode,'race');
 assert.equal(createRace({course:getCourse('citadel'),mode:'time'}).physics,'modern');
});
