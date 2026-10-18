import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PORT_NATIVE_GEOMETRY as G} from '../source-port-course.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {nativePortSupportGeometry} from '../native-port-support.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {prepareNativeShoreContacts} from '../native-shore-contacts.js';
import {queryNativeSupportFloor} from '../native-support-queries.js';
import {getCourse} from '../courses.js';
import {prepareNativeAIContext} from '../native-ai-context.js';
const read=name=>JSON.parse(readFileSync(new URL('./fixtures/native-port-'+name+'.json',import.meta.url),'utf8'));
const course=difficulty=>({sourceWaterCourseIndex:5,reverse:difficulty===3,
 sourceRouteRowsByClass:G.racePrimaryByClass,sourceMetadata:{nativeCourseIndex:5,nativeScale:.025,sourceNativeClassByDifficulty:[0,1,2,2]},
 sourceBuoyLayout:createSourceBuoyLayout({rows:G.racePrimaryByClass[difficulty],courseIndex:5,scale:.025,reverse:difficulty===3})});
const runtime=(difficulty,players=1)=>createNativeRaceCourseRuntime({course:course(difficulty),difficulty,players});
const view=new DataView(new ArrayBuffer(4)),bits=n=>{view.setFloat32(0,n);return view.getUint32(0);};

test('Port primary initialization matches 24960 original words using the selected one/two-player data images',()=>{
 const cases=read('primary');assert.equal(cases.length,8);assert.deepEqual(G.racePrimaryByClass.map(q=>q.length),[45,46,46,55]);
 let words=0;
 for(const f of cases){
  const r=runtime(f.difficulty,f.players);
  assert.deepEqual(G.racePrimaryByClass[f.difficulty],f.rows);
  assert.deepEqual(r.data.recordWordsBySourceRow,f.recordWordsBySourceRow);
  words+=r.data.recordWordsBySourceRow.flat().length;
  assert.equal(r.data.finishSourceRow,f.finishSourceRow);assert.equal(r.mode620,f.players-1);
  assert.equal(r.sourceDifficulty,[0,1,2,2][f.difficulty]);assert.equal(r.directionFlag1f90,Number(f.difficulty!==3));
  assert.deepEqual(Object.keys(r.aiFamilies),f.players===1?['primary','secondary']:['primary']);
  for(const n of r.aiTargetTable.nodes){
   const data=r.data.nodes[n.sourceRow],w=r.data.recordWordsBySourceRow[n.sourceRow];
   assert.deepEqual(n.endpointPlusNativeXZ,data.endpointANativeXZ);assert.deepEqual(n.endpointMinusNativeXZ,data.endpointBNativeXZ);
   for(let avatar=0;avatar<4;avatar++){
    assert.equal(n.nextByAvatar[avatar],w[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],w[0xf4/4+avatar]);
   }
  }
 }
 assert.equal(words,24960);
});

test('Port startup preserves mode-selected objects, markers, ramp profiles and canonical box ownership',()=>{
 for(let difficulty=0;difficulty<4;difficulty++)for(const players of [1,2]){
  const r=runtime(difficulty,players),o=r.objectStartup;
  assert.equal(o.counts.ringCountB134,0);
  assert.equal(o.counts.fixedSphereCountC938,players===1?51:33);
  assert.equal(r.resetLayout.boundaryNativeXZ.length,o.counts.fixedSphereCountC938);
  assert.equal(o.objectKinds4c.filter(k=>k===1).length,3);
  assert.equal(o.objectKinds4c.filter(k=>k===9).length,players===1?12:0);
  assert.equal(o.objectKinds4c.filter(k=>k===6).length,Number(players===2&&difficulty>0));
  assert.equal(o.counts.collisionPlaneCount0578,(players===1?[17,15,17,17]:[17,16,18,18])[difficulty]);
  assert.equal(r.staticContactGeometry.boxes.count0578,o.counts.collisionPlaneCount0578);
  assert.deepEqual(r.staticContactGeometry.boxes.rows.flat().map(bits),o.storage.collisionPlaneWordsFd78.slice(0,o.counts.collisionPlaneCount0578*16));
  assert.equal(r.staticContactGeometry.shore,nativePortSupportGeometry({players}).shore);
  assert.equal(r.allowedRegionsNative.length,4);
 }
});

test('Port prepares 12480 original secondary words for its avatar-specific solo AI route',()=>{
 const cases=read('secondary');assert.equal(cases.length,4);let words=0;
 for(const f of cases){
  const r=runtime(f.difficulty),family=r.aiFamilies.secondary;
  assert.deepEqual(family.data.recordWordsBySourceRow,f.recordWordsBySourceRow);words+=family.data.recordWordsBySourceRow.flat().length;
  assert.equal(family.data.finishSourceRow,f.finishSourceRow);
  for(const n of family.targetTable.nodes){const w=family.data.recordWordsBySourceRow[n.sourceRow];
   for(let avatar=0;avatar<4;avatar++){assert.equal(n.nextByAvatar[avatar],w[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],w[0xf4/4+avatar]);}
  }
 }
 assert.equal(words,12480);
 const r=runtime(1),tables=Object.fromEntries(Object.entries(r.aiFamilies).map(([k,f])=>[k,f.targetTable]));
 const input={courseIndex:5,state638:1,mode620:0,difficulty:1,avatar:1,recordFamily:'primary',cityRouteFlag74:0,navigationSourceRow:12};
 assert.equal(prepareNativeAIContext(tables,input).table,tables.secondary);
 assert.equal(prepareNativeAIContext(tables,{...input,avatar:0}).table,tables.primary);
 assert.equal(prepareNativeAIContext(tables,{...input,difficulty:2}).table,tables.primary);
 assert.equal(prepareNativeAIContext(tables,{...input,mode620:1}).table,tables.primary);
});

test('Port support selects 117 or 109 shore segments and retains the disabled floor grid',()=>{
 const one=nativePortSupportGeometry(),two=nativePortSupportGeometry({players:2});
 assert.equal(one,nativeAdditionalStuntSupportGeometry({courseIndex:5}));assert.notEqual(one,two);
 assert.equal(one.shore.lines.length-1,117);assert.equal(two.shore.lines.length-1,109);
 for(const g of [one,two]){
  assert.equal(g.floor.width3b4c,0);assert.equal(g.floor.depth3b58,0);assert.equal(g.floor.planes.length,0);
  assert.equal(g.boxes,undefined);assert.throws(()=>g.shore.lines[1].push(0),TypeError);
 }
 assert.throws(()=>nativePortSupportGeometry({players:3}),RangeError);
 assert.throws(()=>createNativeRaceCourseRuntime({course:course(0),difficulty:0,players:1,objectLayout:'authored'}),/canonical/);
 assert.throws(()=>createNativeRaceCourseRuntime({course:getCourse('port'),difficulty:0,players:1}),/source route rows/);
});

test('436 complete two-player shore contacts match original point, velocity, impact and normal bits',()=>{
 const cases=read('two-player-support').shoreCases;assert.equal(cases.length,436);
 for(const [index,q]of cases.entries()){
  const {state}=prepareNativeShoreContacts(q.input,nativePortSupportGeometry({players:2}).shore);
  const pointWords=state.pointsNative.map(p=>['position','velocity'].flatMap(f=>['x','y','z'].map(k=>bits(p[f][k]))));
  const normalWords=['x','y','z'].map(k=>bits(state.normalNative[k]));
  assert.deepEqual({pointWords,impactWord:bits(state.shoreImpactNative),normalWords},q.expected,`${index}/line${q.line}`);
 }
});

test('45 two-player floor probes match the original disabled-grid result and normal stores',()=>{
 const cases=read('two-player-support').floorQueries;assert.equal(cases.length,45);
 for(const [index,q]of cases.entries()){
  const r=queryNativeSupportFloor(q.point,nativePortSupportGeometry({players:2}).floor);
  const normalBits=r.normalNative?['x','y','z'].map(k=>bits(r.normalNative[k])):null;
  assert.deepEqual({penetrationBits:bits(r.penetrationNative),normalBits,outputStores:normalBits?.map((bits,component)=>({component,bits}))??[]},q.expected,`${index}`);
 }
});
