import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createPortFarmWorld} from '../src/port-farm-world';import {DUNMERE,SALTMARSH} from '../src/port-farm-courses';
test('port warehouse stays inside the reserved service clearing and clear of course, with bounded batches',()=>{
 const world=createPortFarmWorld('saltmarsh-port-v1'),root=world.root.getObjectByName('saltmarsh-freight-depot')!;assert.ok(root);assert.ok(root.children.length<=12);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=35&&b.max.x<=88&&b.min.z>=-169&&b.max.z<=-147);for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(SALTMARSH.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(SALTMARSH.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-62)>=27+p.radius||Math.abs(p.z+158)>=11+p.radius);
 assert.equal(world.root.userData.solidRecords,SALTMARSH.solids);world.dispose();
 const stadium=createPortFarmWorld('dunmere-farm-v1');assert.equal(stadium.root.getObjectByName('saltmarsh-freight-depot'),undefined);assert.equal(stadium.root.userData.solidRecords,DUNMERE.solids);stadium.dispose();
});
test('port-warehouse geometry and transforms are finite and resources release exactly once',()=>{
 const world=createPortFarmWorld('saltmarsh-port-v1'),root=world.root.getObjectByName('saltmarsh-freight-depot')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const batches=root.children.length;const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>250);assert.ok(triangles<15000);console.log({pieces,triangles,batches});
});
