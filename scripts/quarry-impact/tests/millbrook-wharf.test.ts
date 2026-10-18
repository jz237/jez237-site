import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createCanalPassWorld} from '../src/canal-pass-world';import {MILLBROOK,GRANITE_PASS} from '../src/canal-pass-courses';
test('Millbrook wharf replaces both plain sheds inside their clearings, clear of the course and canal route',()=>{
 const world=createCanalPassWorld('millbrook-canal-v1'),root=world.root.getObjectByName('millbrook-wharf')!;assert.ok(root);assert.ok(root.children.length<=20);
 for(const b of root.userData.bounds as T.Box3[]){const west=b.max.x<0;assert.ok(west?b.min.x>=-102&&b.max.x<=-52:b.min.x>=40&&b.max.x<=90,JSON.stringify(b));assert.ok(b.min.z>=-167&&b.max.z<=-145.5,JSON.stringify(b));for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(MILLBROOK.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(MILLBROOK.id+'_scenery')!;let hidden=true;
 for(const [x,h]of [[-77,7],[65,6]]){const y=MILLBROOK.height(x,-158),old=new T.Matrix4().compose(new T.Vector3(x,y+h/2,-158),new T.Quaternion(),new T.Vector3(48,h,16));scenery.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);if(m.elements.every((v,j)=>Math.abs(v-old.elements[j])<1e-4))hidden=false;}});}
 assert.ok(hidden,'plain sheds are not drawn underneath');assert.equal(world.root.userData.solidRecords,MILLBROOK.solids);world.dispose();
 const pass=createCanalPassWorld('granite-pass-v1');assert.equal(pass.root.getObjectByName('millbrook-wharf'),undefined);assert.equal(pass.root.userData.solidRecords,GRANITE_PASS.solids);pass.dispose();
});
test('Millbrook wharf geometry is finite and resources release exactly once',()=>{
 const world=createCanalPassWorld('millbrook-canal-v1'),root=world.root.getObjectByName('millbrook-wharf')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>300);assert.ok(triangles<25000);console.log({pieces,triangles});
});
