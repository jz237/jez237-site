import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeShoreContacts} from '../native-shore-contacts.js';
import {nativeRaceShoreGeometry} from '../native-shore-geometry.js';
import {createNativeStaticContactBridge} from '../native-static-contact-bridge.js';
import {createSourceNativeContacts} from '../source-native-contacts.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeImpactState,recordNativeImpact,nativeImpactSnapshot} from '../native-impact-state.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-shore-contacts.json',import.meta.url),'utf8'));
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};

test('1148 complete shoreline passes match original execution for every point, impact and normal bit',()=>{
 assert.equal(fixture.cases.length,1148);
 for(const [index,q]of fixture.cases.entries()){
  const {state}=prepareNativeShoreContacts(q.input,fixture.geometries[q.geometry]);
  assert.deepEqual({pointWords:state.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k])))),
   impactWord:bits(state.shoreImpactNative),normalWords:['x','y','z'].map(k=>bits(state.normalNative[k]))},q.expected,`${index}: ${q.geometry} ${q.label}`);
 }
});

test('public shore records preserve player selection, zero-index sentinel and exact oracle geometry',()=>{
 const sunny=nativeRaceShoreGeometry({courseIndex:1}),one=nativeRaceShoreGeometry({courseIndex:2}),two=nativeRaceShoreGeometry({courseIndex:2,players:2});
 assert.equal(sunny,nativeRaceShoreGeometry({courseIndex:1,players:2}));
 assert.deepEqual([sunny.lines.length-1,one.lines.length-1,two.lines.length-1],[49,63,47]);
 for(const [key,g]of [['sunny',sunny],['sunset1',one],['sunset2',two]])assert.deepEqual(g,fixture.geometries[key]);
 assert.throws(()=>one.lines[1][0]=0,TypeError);assert.throws(()=>two.cellHalfwords.push(0),TypeError);
 for(const args of [{},{courseIndex:3},{courseIndex:1,players:0}])assert.throws(()=>nativeRaceShoreGeometry(args),RangeError);
});

test('shore response preserves all vertical bits, retained stronger impact and input owners',()=>{
 const q=fixture.cases.find(q=>q.label==='intersecting-lines-all-points'&&q.input.pointsNative[0].position.x===-8&&q.input.pointsNative[0].position.z===-8&&q.input.shoreImpactNative===9);
 const before=structuredClone(q.input),out=prepareNativeShoreContacts(q.input,fixture.geometries[q.geometry]);
 assert.ok(out.contacts.length>=2);assert.deepEqual(q.input,before);assert.equal(out.state.shoreImpactNative,9);assert.deepEqual(out.state.normalNative,before.normalNative);
 for(let i=0;i<12;i++)for(const f of ['position','velocity'])assert.equal(bits(out.state.pointsNative[i][f].y),bits(before.pointsNative[i][f].y));
 assert.ok(Object.isFrozen(out.state.pointsNative[0].position));assert.ok(Object.isFrozen(out.contacts));
});

test('shore bridge commits horizontal response and ordered impacts without rounding world vertical values',()=>{
 const q=fixture.cases.find(q=>q.label==='intersecting-lines-all-points'&&q.input.pointsNative[0].position.x===-8&&q.input.pointsNative[0].position.z===-8&&q.input.shoreImpactNative===0);
 const scale=.025,geometry={shore:fixture.geometries.synthetic,floor:{},boxes:{count0578:0}},bridge=createNativeStaticContactBridge({geometry,scale});
 const hull={scale,ticks:0,points:q.input.pointsNative.map(p=>({position:{x:p.position.x*scale,y:1/3,z:p.position.z*scale},velocity:{x:p.velocity.x*scale/.01,y:1/7,z:p.velocity.z*scale/.01}}))};
 const impacts=createNativeImpactState(),calls=[],before=structuredClone(hull);
 const report=bridge.shore(hull,{contactWindow:{shoreImpactNative:0},recordImpact:q=>{calls.push(q);recordNativeImpact(impacts,q);}});
 const expected=prepareNativeShoreContacts(q.input,geometry.shore);
 assert.equal(calls.length,expected.contacts.length);assert.ok(calls.length>=2);
 for(let i=0;i<12;i++){
  for(const k of ['x','z']){
   assert.equal(hull.points[i].position[k],expected.state.pointsNative[i].position[k]*scale);
   assert.equal(hull.points[i].velocity[k],expected.state.pointsNative[i].velocity[k]*scale/.01);
  }
  assert.equal(hull.points[i].position.y,before.points[i].position.y);assert.equal(hull.points[i].velocity.y,before.points[i].velocity.y);
 }
 const snapshot=nativeImpactSnapshot(impacts);
 assert.equal(report.shoreImpactNative,expected.state.shoreImpactNative);assert.equal(snapshot.shoreImpactNative,report.shoreImpactNative);
 assert.deepEqual(snapshot.normal,expected.state.normalNative);
 assert.deepEqual(bridge.diagnostics(hull).shore,expected.contacts);
});

test('real adapter uses original shore selection with fixed-step cadence and preserves other phase ownership',()=>{
 const geometry={shore:fixture.geometries.synthetic,floor:{originX3b44:0,width3b4c:0},boxes:{count0578:0}};
 function run(hz){
  const hooks=createSourceNativeContacts({},{staticGeometry:geometry});let hits=0;
  const a=createNativeRaceAdapter({surface:()=>-100,position:{x:-.05,y:.17,z:-.5},velocity:{x:-1,y:0,z:-1},
   contacts:{...hooks,shore:(h,c)=>{const result=hooks.shore(h,c);hits+=hooks.numericStaticDiagnostics(h).shore.length;return result;}}});
  for(let i=0;i<hz/2;i++)stepNativeRaceAdapter(a,1/hz,{});
  assert.ok(hits>0);assert.equal(a.hull.ticks,50);return {snapshot:nativeRaceSnapshot(a),hits};
 }
 assert.deepEqual(run(50),run(100));
 assert.throws(()=>createSourceNativeContacts({},{staticGeometry:geometry,candidateSelectors:{shore:()=>[]}}),/owns/);
 assert.throws(()=>prepareNativeShoreContacts({pointsNative:[]},{}),/twelve/);
});
