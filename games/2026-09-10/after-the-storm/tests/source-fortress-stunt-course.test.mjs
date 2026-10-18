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
function make(){
 const source=createSourceFortressStuntCourse(polygonDistance),runtime=createNativeStuntCourseRuntime({courseIndex:3});
 const course={...source,...source.stuntLayout,sourceWaterCourseIndex:3};
 course.contactVolumes=source.contactVolumesForRamps(course.ramps);
 const storage=runtime.objectStartup.storage;
 let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
  ...Object.fromEntries(['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','fixedSphereWordsB138','fixedSphereGridWords1ce8'].map(k=>[k,storage[k]])),
  scene:{...runtime.objectStartup.counts,courseIndex:3,mode620:11,players:1,activity624:-1,simulation648:0,ringStreak0cb4:0}});
 const display=createNativeStuntPresentation({course,readState:()=>state});
 const adapter=createNativeRaceAdapter({position:{x:-110,y:0,z:20}}),water=createRaceWater({crafts:[{x:-110,y:0,z:20,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
 const objects=createNativeGenericObjectWorld({water,readRaceState:()=>state,commitRaceState:s=>state=s});
 const world=createNativeRaceWorld({adapters:[adapter],water,humanIndices:[0],craftContacts:false,afterFrame:(w,c)=>{
  objects.afterFrame(w,c);objects.updateTransforms(w,c,runtime.objectStartup.transformResources);
 }});
 return {course,runtime,display,objects,world,state:()=>state,setFlag:v=>{const s=nativeRaceStateSnapshot(state);s.raceWords1f94[ri(0x1fc8)]=v;state=createNativeRaceState(s);}};
}

test('Fortress reconstructs all78 finite faces including22 vertical/downward faces without burying the overhangs',()=>{
 const c=createSourceFortressStuntCourse(polygonDistance),support=nativeAdditionalStuntSupportGeometry({courseIndex:3});
 let faces=0,nonfloor=0;
 for(const group of G.floors)for(let j=0;j<group.triangles.length;j++){
  const index=group.indices[j],p=support.floor.planes[index-1],tri=group.triangles[j];faces++;
  const surface=c.scenerySurfaces.find(q=>q.id===group.id);
  assert.deepEqual(surface.triangles[j],tri.map(v=>v.map(n=>n*.025)));
  for(const v of tri){const delta=p.slice(0,3).map((n,k)=>n-v[k]),dot=off=>p.slice(off,off+3).reduce((sum,n,k)=>sum+n*delta[k],0);
   assert.ok(Math.abs(dot(3))<1e-5);assert.ok(dot(6)>-1e-5&&dot(9)>-1e-5&&dot(12)>p[15]-1e-5&&dot(12)<1e-5);
  }
  if(group.normals[j][1]<=0)nonfloor++;
  const heightfield=c.staticSurfaces.find(q=>q.id===group.id);
  assert.equal(heightfield.sourcePlaneIndices.includes(index),group.normals[j][1]>0);
 }
 assert.equal(faces,78);assert.equal(nonfloor,22);
 assert.equal(c.scenerySurfaces.reduce((n,q)=>n+q.triangles.length,0),78);
 for(const [x,z] of [[-9,182],[14,169],[-35,194],[-63,194]]){
  assert.ok(c.sourceFloor(x,z)>2);assert.equal(c.renderGround(x,z),-8,'water remains beneath the separately rendered rock');
 }
 assert.ok(c.renderGround(-60,-50)>0,'authored central island is visible');
 assert.equal(c.renderGround(19.5,16),-8,'gate passage remains open water');
 assert.equal(c.sourceShores.reduce((n,q)=>n+q.sourceEdgeCount,0),92);
 assert.deepEqual(c.sourceShores.filter(q=>!q.sourceClosed).map(q=>q.outline.length),[42,27,5,5,2]);
 for(const shore of c.sourceShores)for(let j=0;j<shore.sourceLineIndices.length;j++){
  const raw=support.shore.lines[shore.sourceLineIndices[j]],a=shore.outline[j],b=shore.outline[(j+1)%shore.outline.length];
  const ends=[[raw[0],raw[1]],[raw[0]+raw[4]*raw[6],raw[1]+raw[5]*raw[6]]].map(p=>p.map(v=>v*.025));
  assert.ok(ends.some(p=>Math.hypot(p[0]-a[0],p[1]-a[1])<.001));assert.ok(ends.some(p=>Math.hypot(p[0]-b[0],p[1]-b[1])<.001));
 }
});

test('all15 rings,21 volumes,3 buoyant spheres and112 fixed spheres bind to the complete original Fortress owner',()=>{
 const q=make(),w=q.display.snapshot().world,raw=q.state();
 assert.equal(w.rings.length,15);assert.equal(w.volumes.length,21);assert.equal(w.floating.length,3);
 assert.equal(q.course.sourceSolidObjects.length,9);assert.equal(q.course.dynamicObjectsForPlayers(1).length,0);
 assert.equal(q.course.hazardsForPlayers(1).length,112);
 q.course.hazardsForPlayers(1).forEach((v,i)=>{
  const row=raw.fixedSphereWordsB138.slice(i*6,(i+1)*6);
  assert.deepEqual([v.x,v.y,v.z,v.r],row.slice(0,4).map(w=>float(w)*.025));assert.equal(v.runtimeTag,row[4]);
 });
 assert.deepEqual(q.course.checkpoints.map(v=>v.sourceRow),[3,6,9,0]);
 assert.deepEqual(q.course.checkpoints.map(v=>v.limit),[20,15,15,15]);
 assert.equal(new Set(w.volumes.map(v=>v.planeIndex)).size,21);
 for(const v of w.volumes){const p=raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(float);
  assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)]);
  assert.deepEqual(v.spans,p.slice(12,15).map(n=>n*.025));
  const positions=nativeStuntVolumePositions(v);assert.ok(positions.length>=108);
  for(let i=0;i<positions.length;i+=3)for(let axis=0;axis<3;axis++){
   const projection=v.axes[axis].reduce((sum,n,j)=>sum+n*(v.origin[j]-positions[i+j]),0);
   assert.ok(projection>=-.0002&&projection<=v.spans[axis]+.0002);
  }
 }
 for(const v of q.display.layout.floating){assert.equal(v.radius,1.25);assert.equal(v.runtimeKind,5);}
});

test('gate and floating meshes follow the canonical source update and preserve original plane axes',()=>{
 const q=make(),start=q.display.snapshot().world;
 for(let i=0;i<10;i++)stepNativeRaceWorld(q.world,.05,[{}]);
 const idle=q.display.snapshot().world,gate=idle.volumes.find(v=>v.sourceIndex===17);
 assert.deepEqual(gate.origin,start.volumes.find(v=>v.sourceIndex===17).origin,'unset source flag holds the gate');
 assert.notDeepEqual(idle.floating.map(v=>v.position),start.floating.map(v=>v.position));
 assert.notDeepEqual(idle.volumes.filter(v=>v.sourceIndex>17).map(v=>v.origin),start.volumes.filter(v=>v.sourceIndex>17).map(v=>v.origin));
 q.setFlag(1);for(let i=0;i<32;i++)stepNativeRaceWorld(q.world,.05,[{}]);
 const after=q.display.snapshot().world,raw=q.state();
 assert.ok(Math.abs(after.volumes.find(v=>v.sourceIndex===17).origin[1]-gate.origin[1]-4.8)<1e-6);
 for(const v of after.volumes){
  assert.deepEqual(v.axes,start.volumes.find(s=>s.id===v.id).axes);
  assert.deepEqual(v.spans,start.volumes.find(s=>s.id===v.id).spans);
  assert.deepEqual(v.origin,raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,v.planeIndex*16+3).map(w=>float(w)*.025));
 }
 for(const v of after.floating){const matrix=raw.objectWordsC940.slice(v.sourceIndex*49+29,v.sourceIndex*49+45).map(float);for(let j=12;j<15;j++)matrix[j]*=.025;
  assert.deepEqual(v.matrix,matrix);assert.deepEqual(v.position,matrix.slice(12,15));
 }
 const before=nativeRaceStateSnapshot(raw);for(let i=0;i<20;i++)captureNativeStuntWorld(q.display.snapshot().world);
 assert.deepEqual(nativeRaceStateSnapshot(q.state()),before);
 stepNativeRaceWorld(q.world,1,[{}],{active:false});assert.deepEqual(q.display.snapshot().world,after);
 const detached=captureNativeStuntWorld(after);detached.volumes[12].origin[1]=999;detached.floating[0].matrix[12]=999;
 assert.deepEqual(q.display.snapshot().world,after);
 stepNativeRaceWorld(q.world,.05,[{}]);assert.deepEqual(q.display.snapshot().world.volumes.find(v=>v.sourceIndex===17),after.volumes.find(v=>v.sourceIndex===17),'gate stops at the original threshold');
});

test('missing or mismatched physical objects reject display binding instead of silently creating ghost colliders',()=>{
 const q=make(),bind=course=>createNativeStuntPresentation({course,readState:q.state});
 assert.throws(()=>bind({...q.course,sourceSolidObjects:[]}),/Every source solid body/);
 assert.throws(()=>bind({...q.course,sourceDynamicObjects:[]}),/Every source floating body/);
 assert.throws(()=>bind({...q.course,sourceDynamicObjects:q.course.sourceDynamicObjects.map(v=>({...v,radius:.625}))}),/source center and radius/);
 assert.throws(()=>bind({...q.course,sourceSolidObjects:q.course.sourceSolidObjects.map(v=>({...v,x:v.x+1}))}),/source kind and center/);
 assert.throws(()=>bind({...q.course,contactVolumes:{volumes:q.course.contactVolumes.volumes.filter(v=>v.sourceObjectIndex!==17)}}),/original collision plane range/);
 const volumes=q.course.contactVolumes.volumes.map(v=>({...v,origin:[...v.origin]}));volumes[12].origin[0]+=1;
 assert.throws(()=>bind({...q.course,contactVolumes:{volumes}}),/selected source planes/);
});

test('Fortress native terrain preserves full resolution and leaves ordinary Free Ride unchanged',async()=>{
 const base=getCourse('citadel'),scene=nativeStuntScene(base),key=terrainKey(scene),modern=createRace({course:base,mode:'practice'});
 assert.notEqual(key,terrainKey(base));assert.equal(terrainIdentity(scene).nativeSceneCourseIndex,3);
 assert.equal(scene.sky,base.sky);assert.equal(scene.water,base.water);assert.equal(base.nativeSceneCourseIndex,undefined);
 assert.equal(modern.course.nativeSceneCourseIndex,undefined);assert.equal(modern.physics,'modern');
 assert.equal(TERRAIN_SEGMENTS,360);assert.equal(TERRAIN_MAP_SIZE,512);
 const expected=sampleTerrain(scene.renderGround),oldSelf=globalThis.self;let reply;
 try{globalThis.self={postMessage:data=>reply=data};await import('../terrain-worker/terrain-worker.js');globalThis.self.onmessage({data:{...terrainIdentity(scene),key}});}
 finally{if(oldSelf===undefined)delete globalThis.self;else globalThis.self=oldSelf;}
 assert.equal(reply.error,undefined);assert.equal(reply.key,key);assert.equal(reply.heights.length,361*361);assert.equal(reply.depth.length,512*512*4);
 assert.deepEqual(reply.heights,expected.heights);assert.deepEqual(reply.depth,expected.depth);
});
