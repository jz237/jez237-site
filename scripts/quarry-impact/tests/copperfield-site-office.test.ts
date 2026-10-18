import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createParkDunesWorld} from '../src/park-dunes-world';import {COPPERFIELD,KINGSWELL} from '../src/park-dunes-courses';
test('Copperfield site office stays inside the reserved service clearing, clear of the course, with bounded batches',()=>{
 const world=createParkDunesWorld('copperfield-dunes-v1'),root=world.root.getObjectByName('copperfield-site-office')!;assert.ok(root);assert.ok(root.children.length<=24);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=51&&b.max.x<=89&&b.min.z>=-167&&b.max.z<=-148.5,JSON.stringify(b));for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(COPPERFIELD.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(COPPERFIELD.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-70)>=18+p.radius||Math.abs(p.z+158)>=8+p.radius);
 // The plain timber service block is replaced, not drawn underneath.
 const y=COPPERFIELD.height(70,-158),old=new T.Matrix4().compose(new T.Vector3(70,y+2.25,-158),new T.Quaternion(),new T.Vector3(34,4.5,14));let hidden=true;
 scenery.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);if(m.elements.every((v,j)=>Math.abs(v-old.elements[j])<1e-4))hidden=false;}});assert.ok(hidden);
 assert.equal(world.root.userData.solidRecords,COPPERFIELD.solids);world.dispose();
 const park=createParkDunesWorld('kingswell-park-v1');assert.equal(park.root.getObjectByName('copperfield-site-office'),undefined);assert.equal(park.root.userData.solidRecords,KINGSWELL.solids);park.dispose();
});
test('Copperfield site office geometry is finite and resources release exactly once',()=>{
 const world=createParkDunesWorld('copperfield-dunes-v1'),root=world.root.getObjectByName('copperfield-site-office')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>200);assert.ok(triangles<20000);console.log({pieces,triangles});
});
