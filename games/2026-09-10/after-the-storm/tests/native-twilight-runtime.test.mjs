import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TWILIGHT_NATIVE_GEOMETRY as G} from '../source-twilight-course.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {nativeTwilightSupportGeometry} from '../native-twilight-support.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {prepareNativeAIContext} from '../native-ai-context.js';
const read=name=>JSON.parse(readFileSync(new URL('./fixtures/native-twilight-'+name+'.json',import.meta.url),'utf8'));
const course=difficulty=>({sourceWaterCourseIndex:6,reverse:difficulty===3,
 sourceRouteRowsByClass:G.racePrimaryByClass,sourceMetadata:{nativeCourseIndex:6,nativeScale:.025,sourceNativeClassByDifficulty:[0,1,2,2]},
 sourceBuoyLayout:createSourceBuoyLayout({rows:G.racePrimaryByClass[difficulty],courseIndex:6,scale:.025,reverse:difficulty===3})});
const runtime=(difficulty,players=1)=>createNativeRaceCourseRuntime({course:course(difficulty),difficulty,players});

test('Twilight primary initialization matches 15860 original words in all three source classes and both player counts',()=>{
 const cases=read('primary');assert.equal(cases.length,6);assert.deepEqual(G.racePrimaryByClass.map(q=>q.length),[0,38,41,43]);
 let words=0;
 for(const f of cases){
  const r=runtime(f.difficulty,f.players);
  assert.deepEqual(G.racePrimaryByClass[f.difficulty],f.rows);assert.deepEqual(r.data.recordWordsBySourceRow,f.recordWordsBySourceRow);
  words+=r.data.recordWordsBySourceRow.flat().length;
  assert.equal(r.data.finishSourceRow,f.finishSourceRow);assert.equal(r.mode620,f.players-1);
  assert.equal(r.sourceDifficulty,Math.min(f.difficulty,2));assert.equal(r.directionFlag1f90,Number(f.difficulty===3));
  assert.equal(r.objectStartup.counts.objectCountFa40,4);assert.equal(r.objectStartup.counts.ringCountB134,0);
  assert.equal(r.objectStartup.counts.fixedSphereCountC938,f.difficulty===2?16:10);
  assert.equal(r.resetLayout.boundaryNativeXZ.length,f.difficulty===2?16:10);
  assert.deepEqual(r.objectStartup.objectKinds4c,[1,1,1,1]);assert.equal(r.staticContactGeometry.boxes.count0578,8);
  const v=new DataView(new ArrayBuffer(4));
  assert.deepEqual(r.staticContactGeometry.boxes.rows.flat().map(n=>{v.setFloat32(0,n);return v.getUint32(0);}),r.objectStartup.storage.collisionPlaneWordsFd78.slice(0,8*16));
 }
 assert.equal(words,15860);
});

test('Twilight prepares 7930 original secondary words for its independent solo AI context selector',()=>{
 const cases=read('secondary');assert.equal(cases.length,3);let words=0;
 for(const f of cases){
  const r=runtime(f.difficulty),family=r.aiFamilies.secondary;
  assert.deepEqual(family.data.recordWordsBySourceRow,f.recordWordsBySourceRow);words+=family.data.recordWordsBySourceRow.flat().length;
  assert.equal(family.data.finishSourceRow,f.finishSourceRow);
  for(const data of Object.values(r.aiFamilies))for(const n of data.targetTable.nodes){
   const w=data.data.recordWordsBySourceRow[n.sourceRow];
   for(let avatar=0;avatar<4;avatar++){assert.equal(n.nextByAvatar[avatar],w[0xcc/4+avatar]);assert.equal(n.previousByAvatar[avatar],w[0xf4/4+avatar]);}
  }
  assert.deepEqual(Object.keys(runtime(f.difficulty,2).aiFamilies),['primary']);
 }
 assert.equal(words,7930);
 const r=runtime(2),tables=Object.fromEntries(Object.entries(r.aiFamilies).map(([k,f])=>[k,f.targetTable]));
 const input={courseIndex:6,state638:1,mode620:0,reverse:false,avatar:0,recordFamily:'primary',cityRouteFlag74:0,
  cityVariant98c8:2,finished2c2c:0,navigationSourceRow:10,positionNative:{x:0,y:0,z:-1200}};
 assert.equal(prepareNativeAIContext(tables,input).table,tables.secondary);
 assert.equal(prepareNativeAIContext(tables,{...input,positionNative:{x:0,y:0,z:0}}).table,tables.primary);
 assert.equal(prepareNativeAIContext(tables,{...input,mode620:1}).table,tables.primary);
});

test('Twilight shares its verified 16 finite floor faces and 78 shore lines without inventing a Normal route',()=>{
 const one=nativeTwilightSupportGeometry(),two=nativeTwilightSupportGeometry({players:2}),stunt=nativeAdditionalStuntSupportGeometry({courseIndex:6});
 assert.equal(one,two);assert.equal(one.floor,stunt.floor);assert.equal(one.shore,stunt.shore);
 assert.equal(one.floor.planes.length,16);assert.equal(one.shore.lines.length-1,78);assert.equal(one.boxes,undefined);
 assert.throws(()=>one.shore.lines[1].push(0),TypeError);
 assert.throws(()=>nativeTwilightSupportGeometry({players:3}),RangeError);
 assert.throws(()=>createNativeRaceCourseRuntime({course:{sourceWaterCourseIndex:6},difficulty:0,players:1}),/no original Normal/);
 assert.throws(()=>createNativeRaceCourseRuntime({course:course(1),difficulty:1,players:1,objectLayout:'authored'}),/canonical/);
});
