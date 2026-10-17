import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createCoastForestWorld} from '../src/coast-forest-world';import {HAZELWOOD,SEABROOK} from '../src/coast-forest-courses';
test('forest lodge stays inside the reserved service clearing and clear of course, with bounded batches',()=>{
 const world=createCoastForestWorld('hazelwood-forest-v1'),root=world.root.getObjectByName('hazelwood-rally-lodge')!;assert.ok(root);assert.ok(root.children.length<=12);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=28&&b.max.x<=76&&b.min.z>=-169.1&&b.max.z<=-146.9);for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(HAZELWOOD.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(HAZELWOOD.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-52)>=24+p.radius||Math.abs(p.z+158)>=11.1+p.radius);
 assert.equal(world.root.userData.solidRecords,HAZELWOOD.solids);world.dispose();
 const stadium=createCoastForestWorld('seabrook-coast-v1');assert.equal(stadium.root.getObjectByName('hazelwood-rally-lodge'),undefined);assert.equal(stadium.root.userData.solidRecords,SEABROOK.solids);stadium.dispose();
});
test('forest-lodge geometry and transforms are finite and resources release exactly once',()=>{
 const world=createCoastForestWorld('hazelwood-forest-v1'),root=world.root.getObjectByName('hazelwood-rally-lodge')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const batches=root.children.length;const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>250);assert.ok(triangles<15000);console.log({pieces,triangles,batches});
});
