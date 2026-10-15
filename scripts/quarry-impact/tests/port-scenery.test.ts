import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createCourseScenery} from '../src/course-scenery';
import {createPortFarmWorld} from '../src/port-farm-world';
import {SALTMARSH} from '../src/port-farm-courses';
for(const [course,theme]of [[SALTMARSH,'port']]as const){
 test(course.name+' scenery clears racing/recovery space and supplies distinct landmarks',()=>{
  const art=createCourseScenery(course,theme);try{
   const placements=art.root.userData.placements;
   for(const p of placements){if(p.halfWidth!==undefined){for(const x of [-p.halfWidth,0,p.halfWidth])for(const z of [-p.halfDepth,0,p.halfDepth])assert.ok(course.distance(p.x+x,p.z+z)>=23,p.kind);}else{assert.ok(course.distance(p.x,p.z)>=23+p.radius,p.kind);}}
   for(const kind of ['building','grandstand','canopy','service-truck'])assert.ok(placements.some((p:any)=>p.kind===kind),kind);
   assert.ok(art.root.getObjectByName(course.id+'_surrounding_landscape'));
   for(const kind of ['container-stack','dock-crane','cargo-ship','fuel-tank'])assert.ok(placements.some((p:any)=>p.kind===kind),kind);
   assert.ok(art.root.children.length<=36,'bounded draw batches');
  }finally{art.dispose();}
 });
 test(course.name+' integrated scenery keeps collision records and frees resources once',()=>{
  const solids=JSON.stringify(course.solids),samples=JSON.stringify(course.samples),world=createPortFarmWorld('saltmarsh-port-v1');
  assert.equal(world.root.userData.solidRecords,course.solids);assert.equal(JSON.stringify(course.solids),solids);assert.equal(JSON.stringify(course.samples),samples);
  const resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();world.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}if(o instanceof T.InstancedMesh)resources.add(o);});let count=0;for(const r of resources)r.addEventListener('dispose',()=>count++);world.dispose();world.dispose();assert.equal(count,resources.size);
 });
}
