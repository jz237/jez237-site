import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createNativeRaceState,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceObjectUpdate,prepareNativeRaceFixedSphereLoading,prepareNativeRaceFixedSphereInitialization,prepareNativeRaceStuntRingUpdate,nativeRaceStuntAwardsView} from '../native-race-state.js';
import {SUNNY_NATIVE_GEOMETRY} from '../source-sunny-course.js';
import {SUNSET_NATIVE_GEOMETRY} from '../source-sunset-course.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-stunt-object-resources-reference.json',import.meta.url)));
const sineTableWords4350=nativeSineTableWords();
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
function initialize(courseIndex,players){
 const resource=nativeStuntObjectResources({courseIndex,players});
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),
  collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  fixedSphereWordsB138:Array(1536).fill(0),fixedSphereGridWords1ce8:Array(166).fill(0),
  scene:{courseIndex,players,difficulty:2,mode620:11,objectCountFa40:0,ringCountB134:0,rampFilterOverride8254:0,forceStunt824c:0,
   main638:1,fixedSphereCountC938:0,reverseDab68:0,alternate8250:0,activity624:-1,primaryHumanIndex:0,ringNext0cb0:0,ringStreak0cb4:0}});
 const loaded=prepareNativeRaceObjectLoading(state,{rampRows:resource.rampRows,ringRows:resource.ringRows,genericRows:resource.genericRows});
 const fixed=prepareNativeRaceFixedSphereLoading(loaded.state,{fixedRows:resource.fixedRows,markerRows:resource.markerRows,hiddenRows:resource.hiddenRows});
 const initializedFixed=prepareNativeRaceFixedSphereInitialization(fixed.state);
 return prepareNativeRaceObjectInitialization(initializedFixed.state,{sineTableWords4350,planeTemplatesByAddress:resource.planeTemplatesByAddress,kind11DisplayListWords:resource.kind11DisplayListWords}).state;
}

test('all nine selected course layouts match original row loading and full initialization for both player counts',()=>{
 assert.equal(reference.checks.length,18);
 for(const c of reference.checks){
  const state=initialize(c.courseIndex,c.players),label=`course ${c.courseIndex}, players ${c.players}`;
  for(const key of ['objectCountFa40','ringCountB134','collisionPlaneCount0578','fixedSphereCountC938'])assert.equal(state.scene[key],c[key],`${label}: ${key}`);
  for(const [key,hash]of Object.entries(c.hashes))assert.equal(digest(state[key]),hash,`${label}: ${key}`);
  const resources=nativeStuntObjectResources(c),updated=prepareNativeRaceObjectUpdate(state,{sineTableWords4350,planeTemplatesByAddress:resources.planeTemplatesByAddress});
  for(const [key,hash]of Object.entries(c.postObjectUpdateHashes))assert.equal(digest(updated.state[key]),hash,`${label}: updated ${key}`);
 }
});

test('real course rings collect once at their loaded centers while initialized collision geometry remains intact',()=>{
 for(let courseIndex=0;courseIndex<9;courseIndex++){
  const initial=initialize(courseIndex,1),resource=nativeStuntObjectResources({courseIndex,players:1});
  const row=resource.ringRows.find(r=>r[4]===0);assert.ok(row,`course ${courseIndex} has its first ring`);
  const input={primaryBodyPositionNative:{x:row[0],y:row[1]-8,z:row[2]}};
  const collected=prepareNativeRaceStuntRingUpdate(initial,input);
  assert.equal(collected.diagnostic.collectedRows.length,1);
  assert.equal(nativeRaceStuntAwardsView(collected.state).slots[0].amount,50);
  assert.deepEqual(collected.state.collisionPlaneWordsFd78,initial.collisionPlaneWordsFd78);
  assert.deepEqual(collected.state.packedObjectMatrixWords0cd0,initial.packedObjectMatrixWords0cd0);
  assert.deepEqual(collected.state.fixedSphereWordsB138,initial.fixedSphereWordsB138);
  assert.deepEqual(collected.state.fixedSphereGridWords1ce8,initial.fixedSphereGridWords1ce8);
  const again=prepareNativeRaceStuntRingUpdate(collected.state,input);assert.deepEqual(again.diagnostic.collectedRows,[]);
 }
});

test('selected layouts agree with independently recovered Sunny and Sunset rows and remain immutable',()=>{
 for(const [courseIndex,geometry]of [[1,SUNNY_NATIVE_GEOMETRY],[2,SUNSET_NATIVE_GEOMETRY]]){
  const resource=nativeStuntObjectResources({courseIndex,players:1});
  assert.deepEqual(resource.rampRows,geometry.stuntRamps);assert.deepEqual(resource.ringRows,geometry.rings);
  assert.deepEqual(resource.fixedRows,geometry.stuntSpheres);assert.deepEqual(resource.markerRows,geometry.boundaryMarkers);assert.deepEqual(resource.hiddenRows,geometry.fixedXYZ);
  assert.throws(()=>resource.ringRows[0][0]=999,TypeError);
  assert.throws(()=>resource.planeTemplatesByAddress[0x800d6cf0][0]=0,TypeError);
 }
 for(const input of [{courseIndex:-1,players:1},{courseIndex:9,players:1},{courseIndex:1,players:0}])assert.throws(()=>nativeStuntObjectResources(input),/source course/);
});
