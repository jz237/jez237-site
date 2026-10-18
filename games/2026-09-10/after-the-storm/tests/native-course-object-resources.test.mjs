import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {nativeCourseObjectResources} from '../native-course-object-resources.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createNativeRaceState,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceFixedSphereLoading,prepareNativeRaceFixedSphereInitialization} from '../native-race-state.js';
import {SUNNY_NATIVE_GEOMETRY} from '../source-sunny-course.js';
import {SUNSET_NATIVE_GEOMETRY} from '../source-sunset-course.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-course-object-resources-reference.json',import.meta.url)));
const sineTableWords4350=nativeSineTableWords();
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
function initialize(c){
 const {courseIndex,players,mode620,difficulty,reverseDab68}=c,r=nativeCourseObjectResources(c);
 let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),
  collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),fixedSphereWordsB138:Array(1536).fill(0),fixedSphereGridWords1ce8:Array(166).fill(0),
  scene:{courseIndex,players,mode620,difficulty,reverseDab68,objectCountFa40:0,ringCountB134:0,rampFilterOverride8254:0,forceStunt824c:0,main638:1,fixedSphereCountC938:0,alternate8250:0}});
 state=prepareNativeRaceObjectLoading(state,{rampRows:r.rampRows,ringRows:r.ringRows,genericRows:r.genericRows}).state;
 state=prepareNativeRaceFixedSphereLoading(state,{fixedRows:r.fixedRows,markerRows:r.markerRows,hiddenRows:r.hiddenRows}).state;
 state=prepareNativeRaceFixedSphereInitialization(state).state;
 return prepareNativeRaceObjectInitialization(state,{sineTableWords4350,planeTemplatesByAddress:r.planeTemplatesByAddress,kind11DisplayListWords:r.kind11DisplayListWords}).state;
}

test('all nine ordinary layouts match108 original load/initialization cases across players, difficulty and reverse',()=>{
 assert.equal(reference.checks.length,108);assert.equal(reference.selectorChecks.length,324);
 for(const c of reference.checks){
  const state=initialize(c),label=`course${c.courseIndex}, players${c.players}, difficulty${c.difficulty}, reverse${c.reverseDab68}`;
  for(const key of ['objectCountFa40','ringCountB134','collisionPlaneCount0578','fixedSphereCountC938'])assert.equal(state.scene[key],c[key],`${label}: ${key}`);
  for(const [key,hash]of Object.entries(c.hashes))assert.equal(digest(state[key]),hash,`${label}: ${key}`);
  assert.equal(state.scene.ringCountB134,0);
  assert.ok(Array.from({length:state.scene.objectCountFa40},(_,i)=>state.objectWordsC940[i*49+0x4c/4]).every(k=>k!==8));
 }
});

test('ordinary tables agree with independently recovered Sunny/Sunset geometry and retain shared Stunt resources',()=>{
 for(const [courseIndex,geometry]of [[1,SUNNY_NATIVE_GEOMETRY],[2,SUNSET_NATIVE_GEOMETRY]]){
  const r=nativeCourseObjectResources({courseIndex,players:1,mode620:0});
  assert.deepEqual(r.rampRows,geometry.ordinaryRamps);assert.deepEqual(r.fixedRows,geometry.ordinarySpheres);
  assert.deepEqual(r.markerRows,geometry.boundaryMarkers);assert.deepEqual(r.hiddenRows,geometry.fixedXYZ);
 }
 for(let courseIndex=0;courseIndex<9;courseIndex++)for(const players of [1,2]){
  const r=nativeCourseObjectResources({courseIndex,players,mode620:0}),stunt=nativeStuntObjectResources({courseIndex,players});
  assert.deepEqual(nativeCourseObjectResources({courseIndex,players,mode620:1}),r);
  assert.deepEqual(nativeCourseObjectResources({courseIndex,players,mode620:11}),stunt);
  for(const key of ['genericRows','markerRows','hiddenRows','planeTemplatesByAddress','kind11DisplayListWords'])assert.strictEqual(r[key],stunt[key]);
  assert.deepEqual(r.ringRows,[]);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.rampRows));assert.ok(Object.isFrozen(r.fixedRows));
 }
 for(const c of [{courseIndex:9,players:1,mode620:0},{courseIndex:1,players:3,mode620:0},{courseIndex:1,players:1,mode620:8}])assert.throws(()=>nativeCourseObjectResources(c),RangeError);
});
