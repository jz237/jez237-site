import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createWillowbankWorld} from '../src/willowbank-world';import {WILLOWBANK} from '../src/willowbank-course';
test('Willowbank paddock stays inside the reserved service clearing, clear of the course, with bounded batches',()=>{
 const world=createWillowbankWorld(),root=world.root.getObjectByName('willowbank-heath-paddock')!;assert.ok(root);assert.ok(root.children.length<=20);
 for(const b of root.userData.bounds as T.Box3[]){assert.ok(b.min.x>=42&&b.max.x<=88&&b.min.z>=-170&&b.max.z<=-149.9,JSON.stringify(b));for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z])assert.ok(WILLOWBANK.distance(x,z)>23);}
 const scenery=world.root.getObjectByName(WILLOWBANK.id+'_scenery')!;for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))assert.ok(Math.abs(p.x-65)>=23+p.radius||Math.abs(p.z+160)>=10+p.radius);
 // The plain timber service block is replaced, not drawn underneath.
 const y=WILLOWBANK.height(65,-160),old=new T.Matrix4().compose(new T.Vector3(65,y+2.5,-160),new T.Quaternion(),new T.Vector3(44,5,18));let hidden=true;
 scenery.traverse(o=>{if(o instanceof T.InstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);if(m.elements.every((v,j)=>Math.abs(v-old.elements[j])<1e-4))hidden=false;}});assert.ok(hidden);
 assert.equal(world.root.userData.solidRecords,WILLOWBANK.solids);world.dispose();
});
test('Willowbank paddock geometry is finite and resources release exactly once',()=>{
 const world=createWillowbankWorld(),root=world.root.getObjectByName('willowbank-heath-paddock')!,resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();let pieces=0,triangles=0;
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh){resources.add(o);pieces+=o.count;triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*o.count;for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}}});
 const counts=new Map<object,number>();resources.forEach(r=>{counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));});world.dispose();world.dispose();for(const n of counts.values())assert.equal(n,1);assert.ok(pieces>200);assert.ok(triangles<20000);console.log({pieces,triangles});
});
