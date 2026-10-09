import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createCourseScenery,type SceneryTheme} from '../src/course-scenery';
import {KINGSWELL,COPPERFIELD} from '../src/park-dunes-courses';
import {MILLBROOK,GRANITE_PASS} from '../src/canal-pass-courses';
for(const [course,theme]of [[KINGSWELL,'park'],[COPPERFIELD,'dunes'],[MILLBROOK,'canal'],[GRANITE_PASS,'pass']]as const){
 test(course.name+' scenery protects driving/recovery corridors and includes the venue paddock',()=>{
  const art=createCourseScenery(course,theme);try{
   const placements=art.root.userData.placements;
   for(const p of placements){if(p.halfWidth!==undefined){for(const x of [-p.halfWidth,0,p.halfWidth])for(const z of [-p.halfDepth,0,p.halfDepth])assert.ok(course.distance(p.x+x,p.z+z)>=23,p.kind);}else assert.ok(course.distance(p.x,p.z)>=23+p.radius,p.kind);}
   assert.ok(placements.some((p:any)=>p.kind==='building'),'clubhouse/service buildings are not rejected by clearance');assert.ok(placements.some((p:any)=>p.kind==='grandstand'),'spectator stand');assert.ok(placements.some((p:any)=>p.kind==='canopy'),'paddock shelters');
   if(theme==='canal')for(const p of placements)assert.ok(Math.abs(p.x)>=78+p.radius||p.z<=-23-p.radius||p.z>=15+p.radius,'canal navigation kept open');
   const meshes=art.root.children.filter(o=>o instanceof T.Mesh) as T.Mesh[];
   assert.ok(meshes.length<=32,'bounded scenery draw batches');let triangles=0;for(const m of meshes)triangles+=(m.geometry.index?.count??m.geometry.getAttribute('position').count)/3*(m instanceof T.InstancedMesh?m.count:1);assert.ok(triangles<260000,'bounded scenery triangle cost');
   assert.ok(art.root.getObjectByName(course.id+'_surrounding_landscape'));assert.ok(placements.length>70); 
  }finally{art.dispose();}
 });
 test(course.name+' scenery is deterministic and releases GPU resources exactly once',()=>{
  const a=createCourseScenery(course,theme),b=createCourseScenery(course,theme);try{assert.deepEqual(a.root.userData.placements,b.root.userData.placements);const res=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();a.root.traverse(o=>{if(o instanceof T.Mesh){res.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])res.add(m);}if(o instanceof T.InstancedMesh)res.add(o);});let released=0;for(const r of res)r.addEventListener('dispose',()=>released++);a.dispose();a.dispose();assert.equal(released,res.size);assert.equal(a.root.children.length,0);}finally{a.dispose();b.dispose();}
 });
}
