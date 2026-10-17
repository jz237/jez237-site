import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickWorld} from '../src/fenwick-world';import {fenwickLandscapeHeight} from '../src/fenwick-landscape';import {FENWICK_COURSES} from '../src/fenwick-course';
for(const course of FENWICK_COURSES)test(`${course.id} surrounding terrain covers edges and grounds trees without changing physics`,()=>{
 const world=createFenwickWorld(course.id);try{
  assert.equal(world.root.userData.solidRecords,course.solids);const root=world.root.getObjectByName('fenwick_landscape')!,ground=root.getObjectByName('fenwick_outer_land') as T.Mesh;root.updateMatrixWorld(true);
  const ray=new T.Raycaster();const hit=(x:number,z:number)=>{ray.set(new T.Vector3(x,200,z),new T.Vector3(0,-1,0));return ray.intersectObject(ground,false)[0];};
  assert.equal(hit(0,0),undefined,'interior stays empty');
  for(const [x,z]of [[219,0],[-219,0],[0,179],[0,-181],[300,315],[-343,287],[899,799]]){const h=hit(x,z);assert.ok(h,`coverage ${x},${z}`);assert.ok(Math.abs(h.point.y-fenwickLandscapeHeight(x,z))<.00001);}
  for(const [x,z]of [[219,179],[-219,-179],[219,-179],[-219,179],[221,0],[0,181]]){assert.ok(Math.abs(hit(x,z)!.point.y+.04)<.00001,'flat recessed overlap');}
  assert.ok(root.userData.treePlaces.length>400);
  for(const p of root.userData.treePlaces){assert.ok(Math.abs(p.x)-p.radius*1.7>=240||Math.abs(p.z)-p.radius*1.7>=200);assert.ok(!(p.z< -180&&p.z> -310&&Math.abs(p.x)<35));assert.ok(!(p.z>180&&p.z<260&&Math.abs(p.x)<40));}
  for(const p of root.userData.treePlaces.filter((_:unknown,i:number)=>i%23===0))assert.ok(Math.abs(hit(p.x,p.z)!.point.y-p.y)<.00001,'roots match triangle height');
  let draws=0,triangles=0;root.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));if(o instanceof T.InstancedMesh){assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));}}});assert.equal(draws,3);assert.ok(triangles<220000,`${triangles} triangles`);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
