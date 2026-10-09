import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createCourseScenery} from '../src/course-scenery';
import {createCoastForestWorld} from '../src/coast-forest-world';
import {SEABROOK,HAZELWOOD} from '../src/coast-forest-courses';
for(const [course,theme]of [[SEABROOK,'coast'],[HAZELWOOD,'forest']]as const){
 test(course.name+' scenery clears racing/recovery space and supplies distinct landmarks',()=>{
  const art=createCourseScenery(course,theme);try{
   const placements=art.root.userData.placements;
   for(const p of placements){if(p.halfWidth!==undefined){for(const x of [-p.halfWidth,0,p.halfWidth])for(const z of [-p.halfDepth,0,p.halfDepth])assert.ok(course.distance(p.x+x,p.z+z)>=23,p.kind);}else{assert.ok(course.distance(p.x,p.z)>=23+p.radius,p.kind);if(theme==='coast')assert.ok(p.z+p.radius<=172,'trees and rocks stay on the headland');}}
   for(const kind of ['building','grandstand','canopy','service-truck'])assert.ok(placements.some((p:any)=>p.kind===kind),kind);
   assert.ok(art.root.getObjectByName(course.id+'_surrounding_landscape'));
   if(theme==='coast'){const sea=art.root.getObjectByName(course.id+'_sea') as T.Mesh;assert.ok(sea);assert.ok(sea.position.y<course.height(0,180));}else{assert.ok(placements.filter((p:any)=>p.kind==='tree').length>200);assert.ok(placements.some((p:any)=>p.kind==='log-pile'));}
   assert.ok(art.root.children.length<=34,'bounded draw batches');
  }finally{art.dispose();}
 });
 test(course.name+' integrated scenery keeps collision records and frees resources once',()=>{
  const solids=JSON.stringify(course.solids),samples=JSON.stringify(course.samples),world=createCoastForestWorld(course.id as 'seabrook-coast-v1'|'hazelwood-forest-v1');
  assert.equal(world.root.userData.solidRecords,course.solids);assert.equal(JSON.stringify(course.solids),solids);assert.equal(JSON.stringify(course.samples),samples);
  const resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();world.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}if(o instanceof T.InstancedMesh)resources.add(o);});let count=0;for(const r of resources)r.addEventListener('dispose',()=>count++);world.dispose();world.dispose();assert.equal(count,resources.size);
 });
}
