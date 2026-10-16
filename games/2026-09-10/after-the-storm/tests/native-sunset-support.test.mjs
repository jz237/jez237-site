import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeSunsetRetirementGeometry as geometry} from '../native-sunset-support.js';
import {queryNativeSupportFloor,queryNativeSupportBoxes} from '../native-support-queries.js';
import {prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createSourceSunsetCourse} from '../source-sunset-course.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {polygonDistance} from '../classic-courses.js';

const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-sunset-support.json',import.meta.url),'utf8'));
const selections={ordinary1:geometry(),ordinary2:geometry({players:2}),stunt1:geometry({mode:'stunt'})};
const view=new DataView(new ArrayBuffer(4));
const bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};
function prepared(difficulty){
 const source=createSourceSunsetCourse(polygonDistance),reverse=difficulty===3;
 return {...source,sourceWaterCourseIndex:2,reverse,
  sourceBuoyLayout:createSourceBuoyLayout({rows:source.sourceRouteRowsByClass[difficulty],courseIndex:2,reverse})};
}

test('Sunset support preserves original player selection, ramp-first ordering and immutable floor records',()=>{
 const {ordinary1:one,ordinary2:two,stunt1:stunt}=selections;
 assert.equal(one.floor,two.floor);assert.equal(one.floor,stunt.floor);
 assert.equal(one.floor.planes.length,32);assert.equal(one.floor.cellHalfwords.length,168);assert.equal(one.floor.listHalfwords.length,189);
 assert.deepEqual([one.boxes.count0578,two.boxes.count0578,stunt.boxes.count0578],[8,6,14]);
 assert.deepEqual(one.boxes.rows.slice(0,6),two.boxes.rows);
 assert.deepEqual(one.boxes.rows.slice(-2),stunt.boxes.rows.slice(-2));
 assert.throws(()=>one.floor.planes[0].push(0),TypeError);
 assert.throws(()=>one.boxes.rows[0][0]=0,TypeError);
 for(const input of [{players:0},{players:3},{players:2,mode:'stunt'},{mode:'time'}])assert.throws(()=>geometry(input),RangeError);
});

test('916 Sunset floor and box queries match original execution down to binary32 normal signs',()=>{
 assert.equal(fixture.cases.length,916);
 for(const [index,q]of fixture.cases.entries()){
  const g=selections[q.geometry],result=q.scope==='floor'?queryNativeSupportFloor(q.point,g.floor):queryNativeSupportBoxes(q.point,g.boxes);
  const normalBits=result.normalNative?['x','y','z'].map(k=>bits(result.normalNative[k])):null;
  assert.deepEqual({penetrationBits:bits(result.penetrationNative),normalBits},
   {penetrationBits:q.expected.penetrationBits,normalBits:q.expected.normalBits},`${index}: ${q.geometry} ${q.label}`);
  assert.deepEqual(normalBits?.map((b,component)=>({component,bits:b}))??[],q.expected.outputStores);
 }
});

test('216 complete Sunset retirement scans match original queries and distinguish single-player piers',()=>{
 assert.equal(fixture.scans.length,216);
 for(const [index,q]of fixture.scans.entries())assert.deepEqual(probe({...q.input,geometry:selections[q.geometry]}),q.expected,`${index}: ${q.label}`);
 const piers=fixture.scans.filter(q=>q.label==='player-selected-pier');
 assert.deepEqual(piers.map(q=>q.expected.supported),[true,false,true,false]);
});

test('prepared ordinary Sunset owners select course support across classes and use it for retirement results',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const course=prepared(difficulty),courseRuntime=createNativeRaceCourseRuntime({course,difficulty,players});
  assert.equal(courseRuntime.retirementGeometry,selections[`ordinary${players}`]);
 }
 const course=prepared(0),courseRuntime=createNativeRaceCourseRuntime({course,difficulty:0,players:1});
 const args={course,courseRuntime,courseIndex:2,players:1};
 const first=createNativeRaceLaunchRuntime({...args,racers:[{id:0,lap:0,grid:0,power:0,misses:0}]}),initialState=structuredClone(first.snapshot());
 initialState.scene.simulation648=3;
 const racers=[{id:0}],owner=createNativeRaceLaunchRuntime({...args,racers,initialState});
 racers[0].dq='Prepared source retirement';
 for(const supported of [true,false]){
  const q=fixture.scans.find(q=>q.geometry==='ordinary1'&&q.expected.supported===supported);
  const result=owner.resultCodeFor(0,{...q.input,bodyResultCodes16c8:[-1]});
  assert.deepEqual(result.operations.filter(o=>o.kind==='supportProbeQuery'),q.expected.operations);
  assert.deepEqual(result.operations.filter(o=>o.kind==='bodyResultCodeWrite'),[{kind:'bodyResultCodeWrite',racerIndex:0,value:supported?4:5}]);
 }
});
