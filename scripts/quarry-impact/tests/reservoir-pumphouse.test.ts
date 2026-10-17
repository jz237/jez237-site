import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createStadiumReservoirWorld} from '../src/stadium-reservoir-world';import {BRAMBLEBROOK,HOLLOWAY} from '../src/stadium-reservoir-courses';
test('pump house stays inside the former reserved footprint and clear of course, with bounded batches',()=>{
 const world=createStadiumReservoirWorld('bramblebrook-reservoir-v1'),root=world.root.getObjectByName('bramblebrook-pumphouse')!;assert.ok(root);assert.ok(root.children.length<=12);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=65.5&&b.max.x<=114.5&&b.min.z>=-172.5&&b.max.z<=-153.5);for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(BRAMBLEBROOK.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(BRAMBLEBROOK.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-90)>=24.5+p.radius||Math.abs(p.z+163)>=9.5+p.radius);
 assert.equal(world.root.userData.solidRecords,BRAMBLEBROOK.solids);world.dispose();
 const stadium=createStadiumReservoirWorld('holloway-stadium-v1');assert.equal(stadium.root.getObjectByName('bramblebrook-pumphouse'),undefined);assert.equal(stadium.root.userData.solidRecords,HOLLOWAY.solids);stadium.dispose();
});
test('pump-house geometry and transforms are finite and resources release exactly once',()=>{
 const world=createStadiumReservoirWorld('bramblebrook-reservoir-v1'),root=world.root.getObjectByName('bramblebrook-pumphouse')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>250);assert.ok(triangles<15000);console.log({pieces,triangles,batches:root.children.length});
});
