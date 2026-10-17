import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeSouthernRetirementGeometry as geometry,SOUTHERN_NATIVE_SHORE_GEOMETRY as shore} from '../native-southern-support.js';
import {queryNativeSupportFloor,queryNativeSupportBoxes} from '../native-support-queries.js';
import {prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
import {prepareNativeShoreContacts} from '../native-shore-contacts.js';
import {prepareNativeFloorContacts,prepareNativeBoxContacts} from '../native-static-contacts.js';
import {nativeRaceCourseRegions} from '../native-course-regions.js';
import {nativeRaceOutsideAllowedRegion} from '../native-race-boundary-warning.js';
import {nativeRaceShoreGeometry} from '../native-shore-geometry.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';

const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-southern-support.json',import.meta.url),'utf8'));
const selections={ordinary1:geometry(),ordinary2:geometry({players:2}),stunt1:geometry({mode:'stunt'})};
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};
const pointWords=s=>s.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k]))));
const normalWords=s=>['x','y','z'].map(k=>bits(s.normalNative[k]));

test('Southern geometry retains305 floor planes,59 shores and ramp-first17 fixed ship volumes',()=>{
 const {ordinary1:one,ordinary2:two,stunt1:stunt}=selections;
 assert.equal(one,two);assert.equal(one.floor,stunt.floor);
 assert.deepEqual([one.floor.planes.length,one.floor.cellHalfwords.length,one.floor.listHalfwords.length],[305,544,1089]);
 assert.deepEqual([one.boxes.count0578,two.boxes.count0578,stunt.boxes.count0578],[20,20,23]);
 assert.deepEqual(one.boxes.rows.slice(-17),stunt.boxes.rows.slice(-17));
 assert.equal(shore.lines.length-1,59);
 for(const players of [1,2])assert.equal(nativeRaceShoreGeometry({courseIndex:7,players}),shore);
 assert.throws(()=>one.floor.planes[0].push(0),TypeError);assert.throws(()=>shore.listBytes.push(0),TypeError);
 for(const input of [{players:0},{players:3},{players:2,mode:'stunt'},{mode:'time'}])assert.throws(()=>geometry(input),RangeError);
});

test('3226 Southern floor/box queries match original binary32 results and normal stores',()=>{
 assert.equal(fixture.cases.length,3226);
 for(const [index,q]of fixture.cases.entries()){
  const g=selections[q.geometry],result=q.scope==='floor'?queryNativeSupportFloor(q.point,g.floor):queryNativeSupportBoxes(q.point,g.boxes);
  const normalBits=result.normalNative?['x','y','z'].map(k=>bits(result.normalNative[k])):null;
  assert.deepEqual({penetrationBits:bits(result.penetrationNative),normalBits},{penetrationBits:q.expected.penetrationBits,normalBits:q.expected.normalBits},`${index}: ${q.label}`);
  assert.deepEqual(normalBits?.map((b,component)=>({component,bits:b}))??[],q.expected.outputStores);
 }
});

test('1409 Southern complete retirement scans match original queries and support decisions',()=>{
 assert.equal(fixture.scans.length,1409);
 for(const [index,q]of fixture.scans.entries())assert.deepEqual(probe({...q.input,geometry:selections[q.geometry]}),q.expected,`${index}: ${q.label}`);
});

test('380 Southern complete shoreline passes preserve every original point, impact and normal bit',()=>{
 assert.equal(fixture.shore.cases.length,380);
 for(const [index,q]of fixture.shore.cases.entries()){
  const {state}=prepareNativeShoreContacts(q.input,shore);
  assert.deepEqual({pointWords:pointWords(state),impactWord:bits(state.shoreImpactNative),normalWords:normalWords(state)},q.expected,`${index}: ${q.label}`);
 }
});

test('Southern course-out query matches1249 original positions at all28 region boundaries',()=>{
 const regions=nativeRaceCourseRegions(7);assert.equal(regions.allowedRegionsNative.length,28);assert.equal(regions.warningSuppressionRegionsNative.length,0);
 assert.equal(fixture.regions.cases.length,1249);
 for(const q of fixture.regions.cases)assert.equal(nativeRaceOutsideAllowedRegion(q.positionNativeXZ,regions),q.outside,JSON.stringify(q.positionNativeXZ));
});

test('prepared Southern runtime selects shared original geometry across classes and player counts',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const course=getCourse('tempest',difficulty),runtime=createNativeRaceCourseRuntime({course,difficulty,players});
  assert.equal(runtime.courseIndex,7);assert.equal(runtime.sourceBuoyLayout.courseIndex,7);
  assert.equal(runtime.sourceDifficulty,[0,1,2,2][difficulty]);
  assert.equal(runtime.retirementGeometry,selections[`ordinary${players}`]);
  assert.equal(runtime.staticContactGeometry.floor,runtime.retirementGeometry.floor);assert.equal(runtime.staticContactGeometry.boxes,runtime.retirementGeometry.boxes);
  assert.equal(runtime.staticContactGeometry.shore,shore);assert.equal(runtime.resetLayout.boundaryNativeXZ.length,79);
  for(const n of runtime.aiTargetTable.nodes){
   const row=runtime.data.nodes[n.sourceRow];assert.deepEqual(n.endpointPlusNativeXZ,row.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,row.endpointBNativeXZ);
   assert.equal(runtime.sourceBuoyLayout.nodes[n.sourceRow].nextSourceRow,row.nextSourceRowA0);
  }
 }
 // Southern's subsequent verified tide integration opened ordinary admission.
 const state=createRace({course:getCourse('tempest'),physics:'native',mode:'time'});
 assert.ok(state.nativeHost);assert.equal(state.nativeHost.world.water.field.datumNative,0);
});

test('Southern original retirement support reaches the canonical dry/wet result-code owner',()=>{
 const course=getCourse('tempest'),courseRuntime=createNativeRaceCourseRuntime({course,difficulty:0,players:1});
 const args={course,courseRuntime,courseIndex:7,players:1};
 const first=createNativeRaceLaunchRuntime({...args,racers:[{id:0,lap:0,grid:0,power:0,misses:0}]}),initialState=structuredClone(first.snapshot());
 initialState.scene.simulation648=3;
 const racers=[{id:0}],owner=createNativeRaceLaunchRuntime({...args,racers,initialState});racers[0].dq='Prepared source retirement';
 for(const supported of [true,false]){
  const q=fixture.scans.find(q=>q.geometry==='ordinary1'&&q.expected.supported===supported);assert.ok(q);
  const result=owner.resultCodeFor(0,{...q.input,bodyResultCodes16c8:[-1]});
  assert.deepEqual(result.operations.filter(o=>o.kind==='supportProbeQuery'),q.expected.operations);
  assert.deepEqual(result.operations.filter(o=>o.kind==='bodyResultCodeWrite'),[{kind:'bodyResultCodeWrite',racerIndex:0,value:supported?4:5}]);
 }
});

test('1472 Southern full floor/box contact passes match original positions, velocities and impacts',()=>{
 const staticFixture=JSON.parse(readFileSync(new URL('./fixtures/native-southern-static.json',import.meta.url),'utf8'));
 assert.equal(staticFixture.cases.length,1472);
 for(const [index,q]of staticFixture.cases.entries()){
  const g=selections[q.geometry],{state}=(q.phase==='floor'?prepareNativeFloorContacts:prepareNativeBoxContacts)(q.input,g[q.phase]);
  assert.deepEqual({pointWords:pointWords(state),impactWords:[bits(state.boxImpactNative),bits(state.floorImpactNative)],normalWords:normalWords(state),markedBox:Number(state.markedBox)},q.expected,`${index}: ${q.phase} ${q.label}`);
 }
});
