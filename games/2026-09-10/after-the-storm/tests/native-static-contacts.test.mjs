import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeFloorContacts,prepareNativeBoxContacts} from '../native-static-contacts.js';
import {createNativeStaticContactBridge} from '../native-static-contact-bridge.js';
import {createNativeImpactState,recordNativeImpact,nativeImpactSnapshot} from '../native-impact-state.js';
import {createSourceNativeContacts} from '../source-native-contacts.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-static-contacts.json',import.meta.url),'utf8'));
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};
const run=q=>(q.phase==='floor'?prepareNativeFloorContacts:prepareNativeBoxContacts)(q.input,fixture.geometries[q.geometry]);

test('complete floor and box passes match540 original executions for every point, impact, normal and marker bit',()=>{
 assert.equal(fixture.cases.length,540);
 for(const [index,q]of fixture.cases.entries()){
  const {state}=run(q);
  assert.deepEqual({pointWords:state.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k])))),
   impactWords:[bits(state.boxImpactNative),bits(state.floorImpactNative)],normalWords:['x','y','z'].map(k=>bits(state.normalNative[k])),markedBox:Number(state.markedBox)},q.expected,`${index}: ${q.phase} ${q.geometry} ${q.label}`);
 }
});

test('contact passes preserve input owners and return immutable prepared state and diagnostics',()=>{
 for(const phase of ['floor','boxes']){
  const q=fixture.cases.find(q=>q.phase===phase),before=structuredClone(q),geometryBefore=structuredClone(fixture.geometries[q.geometry]);
  const result=run(q);assert.deepEqual(q,before);assert.deepEqual(fixture.geometries[q.geometry],geometryBefore);
  assert.ok(Object.isFrozen(result.state.pointsNative[0].position));assert.ok(Object.isFrozen(result.contacts));
  assert.throws(()=>result.state.pointsNative[0].position.x=123,TypeError);
  assert.throws(()=>prepareNativeFloorContacts({...q.input,pointsNative:[]},{}),/twelve/);
  assert.throws(()=>prepareNativeBoxContacts({...q.input,markedBox:1},{count0578:0}),/markedBox/);
 }
});

test('box projection preserves outgoing response and marked flag without inventing positive impact',()=>{
 const q=fixture.cases.find(q=>q.phase==='boxes'&&q.label==='all-points-retained-impact'&&q.input.boxImpactNative===0&&q.input.pointsNative[0].velocity.x>0);
 const {state,contacts}=run(q);assert.ok(contacts.some(c=>c.incomingNative<0));assert.equal(state.boxImpactNative,0);assert.equal(state.markedBox,true);
});

test('world bridge commits original contact results once and reports ordered impacts to the existing owner',()=>{
 const scale=.025;
 for(const phase of ['floor','boxes']){
  const q=fixture.cases.find(q=>q.phase===phase&&q.label==='all-points-retained-impact'&&q.input.pointsNative[0].velocity.x===-2&&q.input.floorImpactNative===0);
  const geometry={floor:fixture.geometries.syntheticFloor,boxes:fixture.geometries.syntheticBoxes};
  const bridge=createNativeStaticContactBridge({geometry,scale}),impacts=createNativeImpactState();
  const hull={scale,ticks:0,points:q.input.pointsNative.map(p=>Object.fromEntries(['position','velocity'].map(f=>
   [f,Object.fromEntries(['x','y','z'].map(k=>[k,p[f][k]*scale/(f==='velocity'?.01:1)]))])))};
  const prior={floorImpactNative:0,boxImpactNative:0,markedBox:false},calls=[];
  const result=bridge[phase](hull,{contactWindow:prior,recordImpact:hit=>{calls.push(hit);recordNativeImpact(impacts,hit);}}),expected=run(q);
  assert.equal(calls.length,expected.contacts.length);assert.ok(calls.length>0);
  for(let i=0;i<12;i++)for(const k of ['x','y','z']){
   assert.equal(hull.points[i].position[k],expected.state.pointsNative[i].position[k]*scale);
   assert.equal(hull.points[i].velocity[k],expected.state.pointsNative[i].velocity[k]*scale/.01);
  }
  const snapshot=nativeImpactSnapshot(impacts),field=phase==='floor'?'floorImpactNative':'boxImpactNative';
  assert.equal(result[field],expected.state[field]);assert.equal(snapshot[field],expected.state[field]);
  assert.deepEqual(snapshot.normal,expected.state.normalNative);
  assert.equal(snapshot.markedBox,expected.state.markedBox);
  assert.deepEqual(prior,{floorImpactNative:0,boxImpactNative:0,markedBox:false},'adapter merges returned report');
  assert.equal(bridge.diagnostics(hull)[phase].length,calls.length);
 }
});

test('world bridge leaves an untouched hull exact and cannot run without its canonical impact callback',()=>{
 const bridge=createNativeStaticContactBridge({geometry:{floor:fixture.geometries.syntheticFloor,boxes:{count0578:0}},scale:.025});
 const hull={scale:.025,ticks:0,points:Array.from({length:12},()=>({position:{x:111.123456789,y:999,z:44},velocity:{x:1/3,y:1/7,z:1/11}}))},before=structuredClone(hull);
 const context={contactWindow:{floorImpactNative:0,boxImpactNative:0,markedBox:false},recordImpact:()=>assert.fail('unexpected contact')};
 bridge.floor(hull,context);bridge.boxes(hull,context);assert.deepEqual(hull,before);
 assert.throws(()=>bridge.floor(hull,{contactWindow:context.contactWindow}),/impact callback/);
});

test('real adapter consumes numeric floor contacts and preserves fixed-step history across render rates',()=>{
 const geometry={floor:fixture.geometries.syntheticFloor,boxes:{count0578:0}},runAt=hz=>{
  const hooks=createSourceNativeContacts({},{staticGeometry:geometry});let contacts=0;
  const adapter=createNativeRaceAdapter({surface:()=>-100,position:{x:-.5,y:.17,z:-.5},
   contacts:{...hooks,floor:(h,c)=>{const report=hooks.floor(h,c);contacts+=hooks.numericStaticDiagnostics(h).floor.length;return report;}}});
  for(let i=0;i<hz/2;i++)stepNativeRaceAdapter(adapter,1/hz,{});
  assert.ok(contacts>0);assert.equal(adapter.hull.ticks,50);
  assert.equal(adapter.lastFrame.contacts.floorImpactNative,adapter.lastFrame.impacts.floorImpactNative);
  return {snapshot:nativeRaceSnapshot(adapter),contacts};
 };
 assert.deepEqual(runAt(50),runAt(100));
 assert.throws(()=>createSourceNativeContacts({},{staticGeometry:geometry,candidateSelectors:{floor:()=>[]}}),/owns/);
});
