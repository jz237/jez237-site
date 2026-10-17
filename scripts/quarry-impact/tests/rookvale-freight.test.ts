import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRookvaleFreight} from '../src/rookvale-freight';
import {createRookvaleWorld} from '../src/rookvale-world';import {ROOKVALE_BARRIERS} from '../src/rookvale-course';
test('freight consists stay beyond containing walls with bounded rendering and disposal',()=>{
 const freight=createRookvaleFreight(),matrix=new T.Matrix4(),point=new T.Vector3();let triangles=0,parts=0,disposed=0;
 assert.equal(freight.root.children.length,2);
 for(const object of freight.root.children){const mesh=object as T.InstancedMesh,p=mesh.geometry.attributes.position;parts+=mesh.count;triangles+=(mesh.geometry.index?.count??p.count)/3*mesh.count;mesh.geometry.addEventListener('dispose',()=>disposed++);
 for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);for(let j=0;j<p.count;j++){point.fromBufferAttribute(p,j).applyMatrix4(matrix);assert.ok(point.toArray().every(Number.isFinite));assert.ok(Math.abs(point.x)>214,'outside the walls and recovery area');assert.ok(point.y>=.15&&point.y<6.1);assert.ok(Math.abs(point.z)<138);assert.ok(mesh.boundingBox!.containsPoint(point));}}}
 assert.ok(parts>700);assert.ok(triangles<40000,`${triangles} triangles`);freight.dispose();freight.dispose();assert.equal(disposed,2);assert.equal(freight.root.children.length,0);
 const world=createRookvaleWorld();assert.ok(world.root.getObjectByName('rookvale_freight'));assert.equal(world.root.userData.solidRecords,ROOKVALE_BARRIERS);world.dispose();assert.equal(world.root.children.length,0);
});
