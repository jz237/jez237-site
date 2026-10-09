import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {addCourseGroundDetail,addCourseRockDetail,courseSurfaceMask,COURSE_MASK_SIZE} from '../src/course-materials';
import {createParkDunesWorld} from '../src/park-dunes-world';import {createCanalPassWorld} from '../src/canal-pass-world';import {createStadiumReservoirWorld} from '../src/stadium-reservoir-world';import {createCoastForestWorld} from '../src/coast-forest-world';import {createPortFarmWorld} from '../src/port-farm-world';import {createRidgeClubWorld} from '../src/ridge-club-world';import {createCountyWorld} from '../src/county-world';import {createWillowbankWorld} from '../src/willowbank-world';import {createSableWorld} from '../src/sable-world';import {createElmsworthWorld} from '../src/elmsworth-world';
import {getRaceCourse} from '../src/race-course';import type {CourseId} from '../src/course-id';
const worlds:[CourseId,()=>{root:T.Group;dispose():void}][]=[
 ...(['kingswell-park-v1','copperfield-dunes-v1']as const).map(id=>[id,()=>createParkDunesWorld(id)]as [CourseId,()=>ReturnType<typeof createParkDunesWorld>]),
 ...(['millbrook-canal-v1','granite-pass-v1']as const).map(id=>[id,()=>createCanalPassWorld(id)]as [CourseId,()=>ReturnType<typeof createCanalPassWorld>]),
 ...(['holloway-stadium-v1','bramblebrook-reservoir-v1']as const).map(id=>[id,()=>createStadiumReservoirWorld(id)]as [CourseId,()=>ReturnType<typeof createStadiumReservoirWorld>]),
 ...(['seabrook-coast-v1','hazelwood-forest-v1']as const).map(id=>[id,()=>createCoastForestWorld(id)]as [CourseId,()=>ReturnType<typeof createCoastForestWorld>]),
 ...(['saltmarsh-port-v1','dunmere-farm-v1']as const).map(id=>[id,()=>createPortFarmWorld(id)]as [CourseId,()=>ReturnType<typeof createPortFarmWorld>]),
 ...(['westmere-club-v1','harrowstone-ridge-v1']as const).map(id=>[id,()=>createRidgeClubWorld(id)]as [CourseId,()=>ReturnType<typeof createRidgeClubWorld>]),
 ...(['dockside-loop-v1','fairground-scramble-v1']as const).map(id=>[id,()=>createCountyWorld(id)]as [CourseId,()=>ReturnType<typeof createCountyWorld>]),
 ['willowbank-heath-v1',createWillowbankWorld],['sable-canyon-v1',createSableWorld],['elmsworth-speedway-v1',createElmsworthWorld],
];
for(const[id,create]of worlds)test(id+' photographic detail leaves terrain/physics exact and disposes on scene changes',()=>{
 const course=getRaceCourse(id) as any,before=JSON.stringify({samples:course.samples,solids:course.solids,checkpoints:course.checkpoints}),art=create();try{
  const ground=art.root.getObjectByName(id+'_ground')as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;assert.ok(ground);assert.ok(ground.material.normalMap);assert.equal(ground.material.customProgramCacheKey(),'course-photo-ground-v1');
  const position=ground.geometry.getAttribute('position');for(let i=0;i<position.count;i+=193)assert.ok(Math.abs(position.getY(i)-course.height(position.getX(i),position.getZ(i)))<1e-5);
  assert.equal(JSON.stringify({samples:course.samples,solids:course.solids,checkpoints:course.checkpoints}),before);let disposal=0;ground.material.normalMap!.addEventListener('dispose',()=>disposal++);art.dispose();art.dispose();assert.equal(disposal,1);
 }finally{art.dispose();}
});
test('mask distinguishes asphalt, loose road and off-road without swapping canal hemispheres',()=>{
 const course=getRaceCourse('millbrook-canal-v1')as any,mask=courseSurfaceMask(course),[w,h]=COURSE_MASK_SIZE;
 const at=(x:number,z:number)=>{const col=Math.max(0,Math.min(w-1,Math.floor((x/course.terrain.spanX+.5)*w))),row=Math.max(0,Math.min(h-1,Math.floor((.5-z/course.terrain.spanZ)*h)));return mask.slice((row*w+col)*4,(row*w+col)*4+4);};
 for(const p of course.samples){const v=at(p.x,p.z);assert.ok(v[1]>240,'road centre');if(p.z<30)assert.ok(v[0]>240,'southern asphalt');if(p.z>40)assert.equal(v[0],0,'northern gravel');}assert.equal(at(0,0)[1],0,'canal infield is not racing road');
});
test('owned material textures release once and retain the authored atlas',()=>{
 const material=new T.MeshStandardMaterial(),atlas=new T.Texture();material.map=atlas;let atlasDisposed=0;atlas.addEventListener('dispose',()=>atlasDisposed++);
 const ground=addCourseGroundDetail(material,getRaceCourse('kingswell-park-v1')as any),stone=addCourseRockDetail(new T.MeshStandardMaterial());let disposed=0;for(const t of [...ground.textures,...stone.textures])t.addEventListener('dispose',()=>disposed++);assert.equal(ground.textures.length,7);ground.dispose();ground.dispose();stone.dispose();stone.dispose();assert.equal(disposed,8);assert.equal(atlasDisposed,0);assert.equal(material.map,atlas);material.dispose();atlas.dispose();
});
