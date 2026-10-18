import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeTwilightRaceScene} from '../source-twilight-race-course.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeCourseObjectPresentation} from '../native-stunt-presentation.js';
import {createNativeRaceState} from '../native-race-state.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};
function make(difficulty=1,players=1){
 const base=nativeTwilightRaceScene(getCourse('neon',difficulty)),course={...base,...base.geometryForPlayers(players)},runtime=createNativeRaceCourseRuntime({course,difficulty,players});
 const storage=runtime.objectStartup.storage;
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  ...Object.fromEntries(['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','fixedSphereWordsB138','fixedSphereGridWords1ce8'].map(k=>[k,storage[k]])),
  scene:{...runtime.objectStartup.counts,courseIndex:6,mode620:players-1,players,activity624:-1,simulation648:0,ringStreak0cb4:0}});
 const display=createNativeCourseObjectPresentation({course,readState:()=>state});
 return {course,runtime,display,state};
}

test('Twilight ordinary scenes display every original ramp, finite plane, sphere and primary marker for both players',()=>{
 for(const d of [1,2,3])for(const players of [1,2]){
  const {course:c,runtime:r,display,state:raw}=make(d,players),w=display.snapshot();
  assert.equal(w.rings.length,0);assert.equal(c.ramps.length,4);assert.equal(w.volumes.length,4);
  assert.deepEqual(display.layout.volumes,c.nativeCourseLayout.volumes);
  assert.equal(c.sourceShores.reduce((n,g)=>n+g.sourceEdgeCount,0),78);
  for(const shore of c.sourceShores)shore.sourceLineIndices.forEach((index,i)=>{
   const p=r.staticContactGeometry.shore.lines[index],a=[p[0]*.025,p[1]*.025],b=[(p[0]+p[4]*p[6])*.025,(p[1]+p[5]*p[6])*.025];
   const x=shore.outline[i],y=shore.outline[(i+1)%shore.outline.length],near=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1])<.001;
   assert.ok(near(a,x)&&near(b,y)||near(a,y)&&near(b,x),`class${d}/player${players}/line${index}`);
  });
  assert.equal(c.contactVolumes.volumes.length,8);
  c.contactVolumes.volumes.forEach((v,i)=>{
   const p=raw.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(float);
   assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));
   assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)].map(a=>a.map(n=>n===0?0:n)));assert.deepEqual(v.spans,p.slice(12,15).map(n=>n*.025));
  });
  assert.equal(c.rocks.length,d===2?16:10);
  c.rocks.forEach((v,i)=>{const p=raw.fixedSphereWordsB138.slice(i*6,i*6+6);assert.deepEqual([v.x,v.y,v.z,v.r],p.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,p[4]);});
  for(const n of c.sourceBuoyLayout.nodes.filter(n=>n.enabled)){const g=c.gates[c.sourceVisibleGateIndices[n.sourceRow]];assert.equal(g.bx,n.x);assert.equal(g.bz,n.z);}
  assert.deepEqual(c.dynamicObjectsForPlayers(players),[]);
  for(const key of ['crossbars','harbour','mooredBoats','contactVolumesForRamps','shortcut','stuntLayout'])assert.equal(c[key],undefined);
 }
 assert.throws(()=>nativeTwilightRaceScene(getCourse('neon',0)),/no original Normal/);
 assert.throws(()=>make().course.geometryForPlayers(3),/one or two/);
});

test('Twilight ordinary worker preserves full terrain resolution and separates its Stunt selection',async()=>{
 const scene=nativeTwilightRaceScene(getCourse('neon',2)),c={...scene,...scene.geometryForPlayers(2)};
 const worker=await import('../terrain-worker/native-race-scene.js'),workerCourses=await import('../terrain-worker/courses.js');
 const base=worker.nativeRaceScene(workerCourses.getCourse('neon',2)),copied={...base,...base.geometryForPlayers(2)};
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 assert.equal(terrainIdentity(c).geometryPlayers,2);assert.equal(terrainIdentity(c).nativeSceneMode,'race');
 assert.notEqual(terrainKey(c),terrainKey(nativeStuntScene(getCourse('neon',2))));
 const a=sampleTerrain(c.renderGround),b=sampleTerrain(copied.renderGround);
 assert.equal(a.heights.length,361*361);assert.equal(a.depth.length,512*512*4);
 assert.deepEqual(a.heights,b.heights);assert.deepEqual(a.depth,b.depth);
});
