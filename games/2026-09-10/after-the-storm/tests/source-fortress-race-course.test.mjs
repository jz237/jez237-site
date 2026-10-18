import {nativeFortressRaceScene} from '../source-fortress-course.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeCourseObjectPresentation} from '../native-stunt-presentation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceFortressStuntCourse} from '../source-fortress-stunt-course.js';
import {FORTRESS_STUNT_GEOMETRY as G} from '../source-fortress-stunt-data.js';
import {polygonDistance} from '../classic-courses.js';
import {createNativeStuntCourseRuntime} from '../native-stunt-course-runtime.js';
import {nativeAdditionalStuntSupportGeometry} from '../native-additional-stunt-support.js';
import {createNativeStuntPresentation,captureNativeStuntWorld,nativeStuntVolumePositions} from '../native-stunt-presentation.js';
import {createNativeRaceState,nativeRaceStateSnapshot} from '../native-race-state.js';
import {createRaceWater} from '../race-water.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createNativeGenericObjectWorld} from '../native-generic-object-world.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {nativeStuntScene} from '../native-stunt-scene.js';
import {terrainIdentity,terrainKey,sampleTerrain,TERRAIN_SEGMENTS,TERRAIN_MAP_SIZE} from '../terrain-data.js';
const dv=new DataView(new ArrayBuffer(4)),float=w=>{dv.setUint32(0,w);return dv.getFloat32(0);};
const ri=a=>(a-0x1f94)/4;
function make(difficulty=0,players=1){
 const course=nativeFortressRaceScene(getCourse('citadel',difficulty)),runtime=createNativeRaceCourseRuntime({course,difficulty,players});
 const storage=runtime.objectStartup.storage;
 let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  ...Object.fromEntries(['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','fixedSphereWordsB138','fixedSphereGridWords1ce8'].map(k=>[k,storage[k]])),
  scene:{...runtime.objectStartup.counts,courseIndex:3,mode620:players-1,players,activity624:-1,simulation648:0,ringStreak0cb4:0}});
 const display=createNativeCourseObjectPresentation({course,readState:()=>state});
 const adapter=createNativeRaceAdapter({position:{x:-110,y:0,z:20}}),water=createRaceWater({crafts:[{x:-110,y:0,z:20,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
 const objects=createNativeGenericObjectWorld({water,readRaceState:()=>state,commitRaceState:s=>state=s});
 const world=createNativeRaceWorld({adapters:[adapter],water,humanIndices:[0],craftContacts:false,afterFrame:(w,c)=>{
  objects.afterFrame(w,c);objects.updateTransforms(w,c,runtime.objectStartup.transformResources);
 }});
 return {course,runtime,display,objects,world,state:()=>state,setFlag:v=>{const s=nativeRaceStateSnapshot(state);s.raceWords1f94[ri(0x1fc8)]=v;state=createNativeRaceState(s);}};
}

test('ordinary Fortress binds all selected canonical solids and spheres for every class and player count',()=>{
 for(let d=0;d<4;d++)for(const players of [1,2]){
  const q=make(d,players),c=q.course,raw=q.state(),w=q.display.snapshot();
  assert.equal(w.rings.length,0);assert.equal(c.ramps.length,0);assert.equal(w.volumes.length,[1,4,9,9][d]);assert.equal(w.floating.length,3);
  assert.deepEqual(q.display.layout,c.nativeCourseLayout);
  assert.equal(c.scenerySurfaces.reduce((n,g)=>n+g.triangles.length,0),78);
  assert.equal(c.sourceShores.reduce((n,g)=>n+g.sourceEdgeCount,0),92);
  assert.equal(c.renderGround(19.5,16),-8);
  assert.equal(c.crossbars,undefined);assert.equal(c.fortWalls,undefined);assert.equal(c.shortcut,undefined);
  for(const v of w.volumes){const p=raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(float);
   assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)]);assert.deepEqual(v.spans,p.slice(12,15).map(n=>n*.025));
  }
  c.hazardsForPlayers(players).forEach((v,i)=>{const p=raw.fixedSphereWordsB138.slice(i*6,i*6+6);assert.deepEqual([v.x,v.y,v.z,v.r],p.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,p[4]);});
  for(const n of c.sourceBuoyLayout.nodes.filter(n=>n.enabled)){const g=c.gates[c.sourceVisibleGateIndices[n.sourceRow]];assert.equal(g.bx,n.x);assert.equal(g.bz,n.z);}
 }
});

test('ordinary Fortress display follows canonical gate and floating motion without advancing or writing it',()=>{
 const q=make(2),before=q.state(),initial=q.display.snapshot();assert.deepEqual(q.state(),before);
 for(let i=0;i<10;i++)stepNativeRaceWorld(q.world,.05,[{}]);
 const idle=q.display.snapshot();assert.deepEqual(idle.volumes[0].origin,initial.volumes[0].origin);
 assert.notDeepEqual(idle.floating,initial.floating);assert.notDeepEqual(idle.volumes.slice(1),initial.volumes.slice(1));
 q.setFlag(1);for(let i=0;i<32;i++)stepNativeRaceWorld(q.world,.05,[{}]);
 const after=q.display.snapshot();assert.ok(Math.abs(after.volumes[0].origin[1]-idle.volumes[0].origin[1]-4.8)<1e-6);
 after.volumes.forEach((v,i)=>{assert.deepEqual(v.axes,initial.volumes[i].axes);assert.deepEqual(v.spans,initial.volumes[i].spans);});
 const copy=captureNativeStuntWorld(after);copy.volumes[0].origin[1]+=100;assert.deepEqual(q.display.snapshot(),after);
 const missing={...q.course,sourceSolidObjects:[]};assert.throws(()=>createNativeCourseObjectPresentation({course:missing,readState:make(2).state}),/Every source solid/);
});

test('ordinary Fortress preserves the high-resolution terrain and reproduces it in its separate worker scene',async()=>{
 const c=nativeFortressRaceScene(getCourse('citadel',2));
 const worker=await import('../terrain-worker/native-race-scene.js');
 const workerCourses=await import('../terrain-worker/courses.js');
 const copied=worker.nativeRaceScene(workerCourses.getCourse('citadel',2));
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 assert.deepEqual(terrainIdentity(c),{id:'citadel',difficulty:2,nativeSceneCourseIndex:3,nativeSceneMode:'race'});
 assert.notEqual(terrainKey(c),terrainKey(nativeStuntScene(getCourse('citadel',2))));
 assert.notEqual(terrainKey(c),terrainKey(getCourse('citadel',2)));
 const a=sampleTerrain(c.renderGround),b=sampleTerrain(copied.renderGround);
 assert.deepEqual(a.heights,b.heights);assert.deepEqual(a.depth,b.depth);
});
