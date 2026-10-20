import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeGlacierRetirementGeometry as geometry,GLACIER_NATIVE_SHORE_GEOMETRY as shore} from '../native-glacier-support.js';
import {queryNativeSupportFloor,queryNativeSupportBoxes} from '../native-support-queries.js';
import {prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
import {prepareNativeShoreContacts} from '../native-shore-contacts.js';
import {prepareNativeFloorContacts} from '../native-static-contacts.js';
import {nativeRaceCourseRegions} from '../native-course-regions.js';
import {nativeRaceOutsideAllowedRegion} from '../native-race-boundary-warning.js';
import {nativeRaceShoreGeometry} from '../native-shore-geometry.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativePrimaryCourseData} from '../native-primary-initialization.js';
import {GLACIER_NATIVE_ROUTE_ROWS_BY_CLASS as rows} from '../source-glacier-rows.js';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';

const read=name=>JSON.parse(readFileSync(new URL('./fixtures/'+name+'.json',import.meta.url),'utf8'));
const fixture=read('native-glacier-support');
const selections={ordinary1:geometry(),ordinary2:geometry({players:2}),stunt1:geometry({mode:'stunt'})};
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};
const pointWords=s=>s.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k]))));
const normalWords=s=>['x','y','z'].map(k=>bits(s.normalNative[k]));

test('Glacier retains165 planes,127 shores and the original empty box list for all selections',()=>{
 const {ordinary1:one,ordinary2:two,stunt1:stunt}=selections;
 assert.equal(one,two);assert.equal(one,stunt);
 assert.deepEqual([one.floor.planes.length,one.floor.cellHalfwords.length,one.floor.listHalfwords.length],[165,2496,843]);
 assert.deepEqual(one.boxes,{count0578:0,rows:[]});assert.equal(shore.lines.length-1,127);
 for(const players of [1,2])assert.equal(nativeRaceShoreGeometry({courseIndex:8,players}),shore);
 assert.throws(()=>one.floor.planes[0].push(0),TypeError);assert.throws(()=>shore.listBytes.push(0),TypeError);
 for(const input of [{players:0},{players:3},{players:2,mode:'stunt'},{mode:'time'}])assert.throws(()=>geometry(input),RangeError);
});

test('834 Glacier support queries match original binary32 results and ordered normal stores',()=>{
 assert.equal(fixture.cases.length,834);
 for(const [index,q]of fixture.cases.entries()){
  const g=selections[q.geometry],result=q.scope==='floor'?queryNativeSupportFloor(q.point,g.floor):queryNativeSupportBoxes(q.point,g.boxes);
  const normalBits=result.normalNative?['x','y','z'].map(k=>bits(result.normalNative[k])):null;
  assert.deepEqual({penetrationBits:bits(result.penetrationNative),normalBits},{penetrationBits:q.expected.penetrationBits,normalBits:q.expected.normalBits},`${index}: ${q.label}`);
  assert.deepEqual(normalBits?.map((b,component)=>({component,bits:b}))??[],q.expected.outputStores);
 }
});

test('660 Glacier complete retirement scans match original queries and support decisions',()=>{
 assert.equal(fixture.scans.length,660);
 for(const [index,q]of fixture.scans.entries())assert.deepEqual(probe({...q.input,geometry:selections[q.geometry]}),q.expected,`${index}: ${q.label}`);
});

test('832 Glacier shoreline passes preserve every original point, impact and normal bit',()=>{
 assert.equal(fixture.shore.cases.length,832);
 for(const [index,q]of fixture.shore.cases.entries()){
  const {state}=prepareNativeShoreContacts(q.input,shore);
  assert.deepEqual({pointWords:pointWords(state),impactWord:bits(state.shoreImpactNative),normalWords:normalWords(state)},q.expected,`${index}: ${q.label}`);
 }
});

test('Glacier course-out query matches676 original positions at all16 region boundaries',()=>{
 const regions=nativeRaceCourseRegions(8);assert.equal(regions.allowedRegionsNative.length,16);assert.equal(regions.warningSuppressionRegionsNative.length,0);
 assert.equal(fixture.regions.cases.length,676);
 for(const q of fixture.regions.cases)assert.equal(nativeRaceOutsideAllowedRegion(q.positionNativeXZ,regions),q.outside,JSON.stringify(q.positionNativeXZ));
});

test('all29250 initialized Glacier route words match the original in all classes and player modes',()=>{
 const f=read('native-glacier-initialization');let words=0;
 assert.equal(f.cases.length,8);assert.deepEqual(rows.map(r=>r.length),[59,59,59,48]);
 for(const q of f.cases){
  const data=createNativePrimaryCourseData({rows:rows[q.difficulty],courseIndex:8,mode620:q.mode620});
  assert.equal(data.finishSourceRow,q.finishSourceRow);assert.deepEqual(data.recordWordsBySourceRow,q.recordWordsBySourceRow);
  words+=data.recordWordsBySourceRow.length*65;
 }
 assert.equal(words,29250);
});

test('Glacier native runtime shares source geometry and route graphs without changing modern admission',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const course=getCourse('glacier',difficulty),runtime=createNativeRaceCourseRuntime({course,difficulty,players});
  assert.equal(course.sourceBuoyLayout,undefined,'preparation must not change the live modern judge');
  assert.equal(course.sourceRouteRowsByClass,undefined,'preparation must not change modern water forcing');
  assert.notEqual(runtime.courseView,course);
  assert.equal(runtime.courseView.sourceBuoyLayout,runtime.sourceBuoyLayout);
  assert.equal(runtime.courseView.sourceRouteRowsByClass,rows);
  assert.equal(runtime.courseView.sourceMetadata.nativeScale,.025);
  for(const n of runtime.sourceBuoyLayout.nodes.filter(n=>n.enabled)){
   const index=runtime.courseView.sourceVisibleGateIndices[n.sourceRow],g=course.gates[index];
   assert.ok(g,'every source colored buoy and finish has a visible marker');
   if(n.classification!==3){assert.ok(Math.abs(g.bx-n.x)<1e-6);assert.ok(Math.abs(g.bz-n.z)<1e-6);}
  }
  assert.equal(runtime.courseIndex,8);assert.equal(runtime.sourceBuoyLayout.courseIndex,8);
  assert.equal(runtime.sourceDifficulty,[0,1,2,2][difficulty]);assert.equal(runtime.retirementGeometry,selections[`ordinary${players}`]);
  assert.equal(runtime.staticContactGeometry.shore,shore);// Reset bounds cover every initialized original fixed record (C938), hidden rows included.
  assert.equal(runtime.resetLayout.boundaryNativeXZ.length,runtime.objectStartup.counts.fixedSphereCountC938);assert.ok(runtime.objectStartup.counts.fixedSphereCountC938>=79);
  assert.equal(runtime.staticContactGeometry.floor,runtime.retirementGeometry.floor);
  for(const n of runtime.aiTargetTable.nodes){
   const row=runtime.data.nodes[n.sourceRow];assert.deepEqual(n.endpointPlusNativeXZ,row.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,row.endpointBNativeXZ);
   assert.equal(runtime.sourceBuoyLayout.nodes[n.sourceRow].nextSourceRow,row.nextSourceRowA0);
  }
  const race=createRace({course,difficulty,physics:'native',seaState:'course',mode:players===1?'time':'versus'});
  assert.equal(race.nativeLaunch.snapshot().scene.courseIndex,8);
  assert.deepEqual(race.course.sourceVisibleGateIndices,runtime.courseView.sourceVisibleGateIndices);
 }
});

test('660 Glacier full floor contact passes match original positions, velocities and impacts',()=>{
 const f=read('native-glacier-static');assert.equal(f.cases.length,660);
 for(const [index,q]of f.cases.entries()){
  const {state}=prepareNativeFloorContacts(q.input,selections[q.geometry].floor);
  assert.deepEqual({pointWords:pointWords(state),impactWords:[bits(state.boxImpactNative),bits(state.floorImpactNative)],normalWords:normalWords(state),markedBox:Number(state.markedBox)},q.expected,`${index}: ${q.label}`);
 }
});
