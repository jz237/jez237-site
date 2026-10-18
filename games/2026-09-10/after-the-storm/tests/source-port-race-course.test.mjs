import test from 'node:test';
import assert from 'node:assert/strict';
import {nativePortRaceScene} from '../source-port-race-course.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeCourseObjectPresentation,captureNativeStuntWorld} from '../native-stunt-presentation.js';
import {createNativeRaceState} from '../native-race-state.js';
import {createRaceWater} from '../race-water.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createNativeGenericObjectWorld} from '../native-generic-object-world.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};
function make(difficulty=0,players=1){
 const base=nativePortRaceScene(getCourse('port',difficulty)),course={...base,...base.geometryForPlayers(players)},runtime=createNativeRaceCourseRuntime({course,difficulty,players});
 const storage=runtime.objectStartup.storage;
 let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  ...Object.fromEntries(['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','fixedSphereWordsB138','fixedSphereGridWords1ce8'].map(k=>[k,storage[k]])),
  scene:{...runtime.objectStartup.counts,courseIndex:5,mode620:players-1,players,activity624:-1,simulation648:0,ringStreak0cb4:0}});
 const display=createNativeCourseObjectPresentation({course,readState:()=>state});
 const adapter=createNativeRaceAdapter({position:{x:-110,y:0,z:20}}),water=createRaceWater({crafts:[{x:-110,y:0,z:20,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
 const objects=createNativeGenericObjectWorld({water,readRaceState:()=>state,commitRaceState:s=>state=s});
 const world=createNativeRaceWorld({adapters:[adapter],water,humanIndices:[0],craftContacts:false,afterFrame:(w,c)=>{
  objects.afterFrame(w,c);objects.updateTransforms(w,c,runtime.objectStartup.transformResources);
 }});
 return {course,runtime,display,objects,world,state:()=>state};
}

test('all Port class/player scenes match canonical ramp, solid, floating and marker selections',()=>{
 for(let d=0;d<4;d++)for(const players of [1,2]){
  const q=make(d,players),c=q.course,raw=q.state(),w=q.display.snapshot();
  assert.equal(w.rings.length,0);assert.equal(c.ramps.length,3);
  assert.equal(w.volumes.length,players===2&&d>0?16:15);assert.equal(w.floating?.length??0,players===1?12:0);
  assert.deepEqual(q.display.layout.volumes,c.nativeCourseLayout.volumes);
  assert.deepEqual(q.display.layout.floating??[],c.nativeCourseLayout.floating);
  assert.equal(c.sourceShores.reduce((n,g)=>n+g.sourceEdgeCount,0),players===1?117:109);
  // Display edges must follow the selected physical lines, including open
  // coastline endpoints; no closing segment is invented for that coast.
  for(const shore of c.sourceShores)shore.sourceLineIndices.forEach((index,i)=>{
   const p=q.runtime.staticContactGeometry.shore.lines[index],a=[p[0]*.025,p[1]*.025],b=[(p[0]+p[4]*p[6])*.025,(p[1]+p[5]*p[6])*.025];
   const x=shore.outline[i],y=shore.outline[(i+1)%shore.outline.length],near=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1])<.001;
   assert.ok(near(a,x)&&near(b,y)||near(a,y)&&near(b,x),`player${players}/line${index}`);
  });
  assert.equal(c.contactVolumes.volumes.length,q.runtime.objectStartup.counts.collisionPlaneCount0578);
  c.contactVolumes.volumes.forEach((v,i)=>{
   const p=raw.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(float);
   assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));// The serialized visual geometry normalizes signed zero; native storage retains exact bits.
   assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)].map(a=>a.map(n=>n===0?0:n)));assert.deepEqual(v.spans,p.slice(12,15).map(n=>n*.025));
  });
  assert.equal(c.rocks.length,players===1?51:33);
  c.rocks.forEach((v,i)=>{const p=raw.fixedSphereWordsB138.slice(i*6,i*6+6);assert.deepEqual([v.x,v.y,v.z,v.r],p.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,p[4]);});
  for(const n of c.sourceBuoyLayout.nodes.filter(n=>n.enabled)){const g=c.gates[c.sourceVisibleGateIndices[n.sourceRow]];assert.equal(g.bx,n.x);assert.equal(g.bz,n.z);}
  assert.deepEqual(c.dynamicObjectsForPlayers(players),[]);assert.equal(c.sourceFloor(0,0),null);
  for(const key of ['crossbars','harbour','mooredBoats','contactVolumesForRamps','shortcut'])assert.equal(c[key],undefined);
 }
});

test('Port meshes follow canonical object motion while display reads leave the simulation untouched',()=>{
 const q=make(2),initial=q.display.snapshot();
 for(let i=0;i<40;i++)stepNativeRaceWorld(q.world,.05,[{}]);
 const after=q.display.snapshot();assert.notDeepEqual(after.floating,initial.floating);
 assert.deepEqual(after.volumes,initial.volumes);
 const raw=q.state();for(let i=0;i<20;i++)q.display.snapshot();assert.equal(q.state(),raw);
 const copy=captureNativeStuntWorld(after);copy.floating[0].position[1]+=100;assert.deepEqual(q.display.snapshot(),after);
 assert.throws(()=>createNativeCourseObjectPresentation({course:{...q.course,sourceDynamicObjects:[]},readState:q.state}),/Every source floating/);
 const two=make(1,2);assert.throws(()=>createNativeCourseObjectPresentation({course:{...two.course,sourceSolidObjects:[]},readState:two.state}),/Every source solid/);
 assert.throws(()=>nativePortRaceScene(getCourse('port')).geometryForPlayers(3),/one or two/);
});

test('Port ordinary worker preserves full terrain resolution and player-selected shoreline geometry',async()=>{
 const scene=nativePortRaceScene(getCourse('port',2)),c={...scene,...scene.geometryForPlayers(2)};
 const worker=await import('../terrain-worker/native-race-scene.js'),workerCourses=await import('../terrain-worker/courses.js');
 const base=worker.nativeRaceScene(workerCourses.getCourse('port',2)),copied={...base,...base.geometryForPlayers(2)};
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 assert.equal(terrainIdentity(c).geometryPlayers,2);assert.equal(terrainIdentity(c).nativeSceneMode,'race');
 assert.notEqual(terrainKey(c),terrainKey(scene));assert.notEqual(terrainKey(c),terrainKey(nativeStuntScene(getCourse('port',2))));
 const a=sampleTerrain(c.renderGround),b=sampleTerrain(copied.renderGround);
 assert.equal(a.heights.length,361*361);assert.equal(a.depth.length,512*512*4);
 assert.deepEqual(a.heights,b.heights);assert.deepEqual(a.depth,b.depth);
});
