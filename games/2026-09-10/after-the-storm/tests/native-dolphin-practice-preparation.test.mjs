import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeDolphinPracticeScene} from '../source-dolphin-practice-course.js';
import {DOLPHIN_PRACTICE_ROWS} from '../source-dolphin-practice-rows.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceState} from '../native-race-state.js';
import {createNativeCourseObjectPresentation} from '../native-stunt-presentation.js';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';
import {createSourceDolphinStuntCourse} from '../source-dolphin-stunt-course.js';
import {polygonDistance} from '../classic-courses.js';
import {terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const scene=()=>nativeDolphinPracticeScene(getCourse('practice'));
const prepare=c=>createNativeRaceCourseRuntime({course:c,difficulty:0,players:1});
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};

test('solo Dolphin ordinary primary preparation matches all3900 original initialized words',()=>{
 const f=JSON.parse(readFileSync(new URL('./fixtures/native-dolphin-practice-primary.json',import.meta.url),'utf8'));
 const c=scene(),r=prepare(c);assert.deepEqual(DOLPHIN_PRACTICE_ROWS,f.rows);
 assert.deepEqual(r.data.recordWordsBySourceRow,f.recordWordsBySourceRow);assert.equal(r.data.nodes.length,60);
 assert.equal(r.data.finishSourceRow,f.finishSourceRow);assert.equal(r.mode620,0);assert.equal(r.sourceDifficulty,0);
 assert.deepEqual(c.gates.map(n=>[n.sourceRow,n.classification]),[[0,3]]);assert.equal(c.gates[0].width,370*.025);
 assert.equal(r.staticContactGeometry.floor.planes.length,100);assert.equal(r.staticContactGeometry.shore.lines.length-1,55);
 assert.deepEqual(r.allowedRegionsNative,[[-30000,30000,-30000,30000]]);assert.deepEqual(r.warningSuppressionRegionsNative,[]);
 assert.throws(()=>DOLPHIN_PRACTICE_ROWS[0].push(0),TypeError);
});

test('Practice contains exactly two original jumps and205 fixed spheres, without Stunt rings or collision planes',()=>{
 const c=scene(),r=prepare(c),storage=r.objectStartup.storage;
 assert.deepEqual(r.objectStartup.counts,{objectCountFa40:14,ringCountB134:0,fixedSphereCountC938:205,collisionPlaneCount0578:12});
 assert.deepEqual(r.objectStartup.objectKinds4c,[1,1,...Array(12).fill(11)]);assert.equal(c.ramps.length,2);assert.deepEqual(c.rings,[]);
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  ...Object.fromEntries(['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','fixedSphereWordsB138','fixedSphereGridWords1ce8'].map(k=>[k,storage[k]])),
  scene:{...r.objectStartup.counts,courseIndex:0,mode620:0,players:1,activity624:-1,simulation648:3}});
 const display=createNativeCourseObjectPresentation({course:c,readState:()=>state});
 assert.deepEqual(display.layout.volumes,c.nativeCourseLayout.volumes);assert.equal(display.snapshot().volumes.length,12);
 c.contactVolumes.volumes.forEach((v,i)=>{
  const p=storage.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(float);
  assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));
  assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)].map(a=>a.map(n=>n===0?0:n)));assert.deepEqual(v.spans,p.slice(12,15).map(n=>n*.025));
 });
 assert.equal(c.rocks.length,205);c.rocks.forEach((v,i)=>{
  const p=storage.fixedSphereWordsB138.slice(i*6,i*6+6);assert.deepEqual([v.x,v.y,v.z,v.r],p.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,p[4]);
 });
 assert.equal(c.sourceDecorations.length,12);
 c.sourceDecorations.forEach((v,i)=>assert.deepEqual([v.x,v.y,v.z],storage.objectWordsC940.slice((i+2)*49,(i+2)*49+3).map(w=>float(w)*.025)));
 for(const key of ['crossbars','stuntLayout','contactVolumesForRamps'])assert.equal(c[key],undefined);
});

test('Practice preparation preserves full shared shore and terrain detail while rejecting unverified selections',()=>{
 const c=scene(),r=prepare(c),stunt=createSourceDolphinStuntCourse(polygonDistance);
 assert.deepEqual(c.sourceShores,stunt.sourceShores);assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 for(const shore of c.sourceShores)shore.sourceLineIndices.forEach((index,i)=>{
  const p=r.staticContactGeometry.shore.lines[index],a=[p[0]*.025,p[1]*.025],b=[(p[0]+p[4]*p[6])*.025,(p[1]+p[5]*p[6])*.025];
  const x=shore.outline[i],y=shore.outline[(i+1)%shore.outline.length],near=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1])<.001;
  assert.ok(near(a,x)&&near(b,y)||near(a,y)&&near(b,x));
 });
 const terrain=sampleTerrain(c.renderGround);assert.equal(terrain.heights.length,361*361);assert.equal(terrain.depth.length,512*512*4);
 assert.notEqual(terrainKey(c),terrainKey(getCourse('practice')));
 assert.throws(()=>c.geometryForPlayers(2),/solo/);
 assert.throws(()=>nativeDolphinPracticeScene(getCourse('practice',1)),/forward Normal/);
 for(const patch of [{players:2},{difficulty:1},{course:{...c,reverse:true}},{course:{...c,nativeSceneMode:'race'}}])
  assert.throws(()=>createNativeRaceCourseRuntime({course:c,difficulty:0,players:1,...patch}),/solo forward Normal/);
 assert.throws(()=>createNativeRaceCourseRuntime({course:c,difficulty:0,players:1,objectLayout:'authored'}),/canonical/);
 for(const patch of [{mode:'versus'},{difficulty:1},{seaState:'surf'},{course:getCourse('greyhaven')}])
  assert.throws(()=>createRace({course:getCourse('practice'),mode:'practice',physics:'native',...patch}),/verified course/);
});
