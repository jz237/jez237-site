import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickGarages} from '../src/fenwick-garages';import {FENWICK_COURSES} from '../src/fenwick-course';import {createFenwickWorld} from '../src/fenwick-world';
test('garage materials tile at metre scale, roofs have closed gables, and all geometry stays behind both courses',()=>{
 const art=createFenwickGarages(),matrix=new T.Matrix4(),point=new T.Vector3();let draws=0;
 art.root.traverse(o=>{if(!(o instanceof T.InstancedMesh))return;draws++;assert.ok(o.instanceMatrix.array.every(Number.isFinite));const pos=o.geometry.attributes.position;for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);for(let j=0;j<pos.count;j++){point.fromBufferAttribute(pos,j).applyMatrix4(matrix);assert.ok(point.y>=0&&point.z>129&&point.z<151&&Math.abs(point.x)<143);for(const course of FENWICK_COURSES)assert.ok(course.distance(point.x,point.z)>28);}}});assert.equal(draws,4);
 const walls=art.root.getObjectByName('fenwick_garage_cladding') as T.InstancedMesh<T.BoxGeometry,T.MeshStandardMaterial>;
 assert.ok(Math.max(...walls.geometry.attributes.uv.array)>7,'42m wall does not stretch a single photograph');assert.ok(walls.material.map&&walls.material.normalMap&&walls.material.roughnessMap);
 const roofs=art.root.getObjectByName('fenwick_garage_roofs') as T.InstancedMesh;assert.equal(roofs.count,8);roofs.getMatrixAt(0,matrix);assert.notEqual(matrix.elements[6],0,'roof slope');
 const ends=art.root.getObjectByName('fenwick_garage_gables') as T.InstancedMesh;assert.equal(ends.count,4);assert.equal(ends.geometry.attributes.position.count,6);assert.equal(ends.geometry.attributes.normal.getX(0),-1);assert.equal(ends.geometry.attributes.normal.getX(3),1);
 let released=0;art.textures.forEach(t=>t.addEventListener('dispose',()=>released++));art.dispose();art.dispose();assert.equal(released,6);assert.equal(art.root.children.length,0);
});
for(const course of FENWICK_COURSES)test(`${course.id}: garage upgrade keeps the course and scene lifecycle intact`,()=>{const before=JSON.stringify(course.solids),world=createFenwickWorld(course.id);assert.ok(world.root.getObjectByName('fenwick_garages'));assert.equal(world.root.userData.solidRecords,course.solids);assert.equal(JSON.stringify(course.solids),before);world.dispose();world.dispose();assert.equal(world.root.children.length,0);});
