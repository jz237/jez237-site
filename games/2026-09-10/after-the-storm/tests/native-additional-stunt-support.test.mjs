import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeAdditionalStuntSupportGeometry as geometry} from '../native-additional-stunt-support.js';
import {queryNativeSupportFloor} from '../native-support-queries.js';
import {prepareNativeFloorContacts} from '../native-static-contacts.js';
import {prepareNativeShoreContacts} from '../native-shore-contacts.js';
import {prepareNativeRetirementSupportProbe as probe} from '../native-race-body-fields.js';
import {createNativeStuntCourseRuntime} from '../native-stunt-course-runtime.js';

const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-additional-stunt-support-reference.json',import.meta.url),'utf8'));
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};
const pointWords=s=>s.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k]))));
const normalWords=s=>['x','y','z'].map(k=>bits(s.normalNative[k]));

test('five remaining solo Stunt courses retain original collision selections and canonical box ownership',()=>{
 for(const [courseIndex,planes,lines]of [[0,100,55],[3,78,92],[4,22,72],[5,0,117],[6,16,78]]){
  const g=geometry({courseIndex}),runtime=createNativeStuntCourseRuntime({courseIndex});
  assert.equal(g.floor.planes.length,planes);assert.equal(g.shore.lines.length-1,lines);
  assert.equal(runtime.retirementGeometry.floor,g.floor);assert.equal(runtime.staticContactGeometry.shore,g.shore);
  assert.equal(runtime.staticContactGeometry.floor,g.floor);assert.equal(runtime.retirementGeometry.boxes,undefined);
  assert.equal(runtime.staticContactGeometry.boxes.count0578,runtime.objectStartup.counts.collisionPlaneCount0578);
  assert.deepEqual(runtime.staticContactGeometry.boxes.rows.flat().map(bits),runtime.objectStartup.storage.collisionPlaneWordsFd78.slice(0,runtime.staticContactGeometry.boxes.count0578*16));
  assert.throws(()=>g.shore.listBytes.push(0),TypeError);assert.throws(()=>g.floor.planes.push([]),TypeError);
 }
 for(const input of [{courseIndex:0,players:2},{courseIndex:3,players:0},{courseIndex:1},{courseIndex:9},{courseIndex:3.5},{}])assert.throws(()=>geometry(input),RangeError);
 const port=geometry({courseIndex:5}).floor;
 assert.equal(port.width3b4c,0);assert.equal(port.depth3b58,0);assert.equal(port.planes.length,0);
});

test('1143 floor queries match original binary32 penetration, normal and ordered stores',()=>{
 assert.equal(fixture.cases.length,1143);
 for(const [index,q]of fixture.cases.entries()){
  const r=queryNativeSupportFloor(q.point,geometry(q).floor),normalBits=r.normalNative?['x','y','z'].map(k=>bits(r.normalNative[k])):null;
  assert.deepEqual({penetrationBits:bits(r.penetrationNative),normalBits,outputStores:normalBits?.map((bits,component)=>({component,bits}))??[]},q.expected,`${index}/${q.courseIndex}/${q.label}`);
 }
});

test('1116 complete floor contact passes match all twelve original hull points and retained impacts',()=>{
 assert.equal(fixture.contacts.length,1116);
 for(const [index,q]of fixture.contacts.entries()){
  const {state}=prepareNativeFloorContacts(q.input,geometry(q).floor);
  assert.deepEqual({pointWords:pointWords(state),impactWords:[bits(state.boxImpactNative),bits(state.floorImpactNative)],normalWords:normalWords(state),markedBox:Number(state.markedBox)},q.expected,`${index}/${q.courseIndex}/${q.label}`);
 }
});

test('2682 complete shoreline passes match original point, impact and normal bits',()=>{
 assert.equal(fixture.shores.length,2682);
 for(const [index,q]of fixture.shores.entries()){
  const {state}=prepareNativeShoreContacts(q.input,geometry(q).shore);
  assert.deepEqual({pointWords:pointWords(state),impactWord:bits(state.shoreImpactNative),normalWords:normalWords(state)},q.expected,`${index}/${q.courseIndex}/${q.label}`);
 }
});

test('450 complete original retirement scans match floor support with explicitly empty prepared boxes',()=>{
 assert.equal(fixture.scans.length,450);
 for(const [index,q]of fixture.scans.entries()){
  assert.deepEqual(probe({...q.input,geometry:{floor:geometry(q).floor,boxes:{count0578:0,rows:[]}}}),q.expected,`${index}/${q.courseIndex}`);
 }
});
