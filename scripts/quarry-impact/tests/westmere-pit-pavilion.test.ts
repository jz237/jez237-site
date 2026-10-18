import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRidgeClubWorld} from '../src/ridge-club-world';import {HARROWSTONE,WESTMERE} from '../src/ridge-club-courses';
test('Westmere pit pavilion stays inside the reserved service clearing, clear of the course, with bounded batches',()=>{
 const world=createRidgeClubWorld('westmere-club-v1'),root=world.root.getObjectByName('westmere-pit-pavilion')!;assert.ok(root);assert.ok(root.children.length<=24);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=26&&b.max.x<=98&&b.min.z>=-172&&b.max.z<=-148,JSON.stringify(b));for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(WESTMERE.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(WESTMERE.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-62)>=35+p.radius||Math.abs(p.z+160)>=11+p.radius);
 // The plain pit block and its shutters/control box are replaced, not drawn underneath.
 const old=new T.Matrix4().compose(new T.Vector3(62,2.75,-160),new T.Quaternion(),new T.Vector3(68,5.5,20));let hidden=true;
 scenery.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);if(m.elements.every((v,j)=>Math.abs(v-old.elements[j])<1e-4))hidden=false;}});assert.ok(hidden);
 assert.equal(world.root.userData.solidRecords,WESTMERE.solids);world.dispose();
 const ridge=createRidgeClubWorld('harrowstone-ridge-v1');assert.equal(ridge.root.getObjectByName('westmere-pit-pavilion'),undefined);assert.equal(ridge.root.userData.solidRecords,HARROWSTONE.solids);ridge.dispose();
});
test('Westmere pit pavilion geometry is finite and resources release exactly once',()=>{
 const world=createRidgeClubWorld('westmere-club-v1'),root=world.root.getObjectByName('westmere-pit-pavilion')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>350);assert.ok(triangles<20000);console.log({pieces,triangles});
});
test('Alderwick reuses the pit pavilion only where its own club-pits clearing exists',async()=>{
 const {createCountyWorld}=await import('../src/county-world');const {ALDERWICK_CROSS}=await import('../src/alderwick-cross-course');
 const world=createCountyWorld('alderwick-cross-v1'),root=world.root.getObjectByName('westmere-pit-pavilion'),scenery=world.root.getObjectByName(ALDERWICK_CROSS.id+'_scenery')!;
 assert.equal(!!root,scenery.userData.placements.some((p:any)=>p.kind==='club-pits'));
 if(root)for(const b of root.userData.bounds as T.Box3[])for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(ALDERWICK_CROSS.distance(x,z)>23);
 world.dispose();
});
