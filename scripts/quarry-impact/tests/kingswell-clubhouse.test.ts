import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createKingswellClubhouse} from '../src/kingswell-clubhouse';import {createParkDunesWorld} from '../src/park-dunes-world';import {KINGSWELL,COPPERFIELD} from '../src/park-dunes-courses';
test('clubhouse clears the track and fits the actual landscaped bank',()=>{
 const w=createParkDunesWorld('kingswell-park-v1'),a=createKingswellClubhouse(),hills=w.root.getObjectByName('kingswell-park-v1_surrounding_landscape')!;w.root.updateMatrixWorld(true);const ray=new T.Raycaster();
 for(let x=-31;x<=31;x+=1)for(let z=-223;z<=-199;z+=1){ray.set(new T.Vector3(x,100,z),new T.Vector3(0,-1,0));const h=ray.intersectObject(hills)[0];assert.ok(h);assert.ok(h.point.y>=1&&h.point.y<5,'Ground must intersect foundation below floor');}
 for(const b of a.root.userData.bounds as T.Box3[]){const c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3());assert.ok(KINGSWELL.distance(c.x,c.z)-Math.hypot(s.x,s.z)/2>24);}
 a.root.traverse(o=>{if(o instanceof T.Mesh){for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});a.dispose();w.dispose();
});
test('landmark and tree clearing are Kingswell-only and preserve collision records',()=>{
 for(const course of [KINGSWELL,COPPERFIELD]){const w=createParkDunesWorld(course.id as 'kingswell-park-v1'|'copperfield-dunes-v1');assert.equal(w.root.userData.solidRecords,course.solids);assert.equal(Boolean(w.root.getObjectByName('kingswell-clubhouse')),course===KINGSWELL);if(course===KINGSWELL){const placements=w.root.getObjectByName(course.id+'_scenery')!.userData.placements;assert.ok(!placements.some((p:any)=>p.kind==='tree'&&Math.abs(p.x)<33+p.radius&&Math.abs(p.z+211)<13+p.radius));}w.dispose();}
});
test('complete world disposes clubhouse and gable resources exactly once',()=>{
 const w=createParkDunesWorld('kingswell-park-v1'),gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();w.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});
