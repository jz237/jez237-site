import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRookvaleWorld} from '../src/rookvale-world';import {ROOKVALE_BARRIERS} from '../src/rookvale-course';
test('industrial district occupies four distinct perimeter zones without entering driving or terminal space',()=>{
 const world=createRookvaleWorld();try{
  assert.equal(world.root.userData.solidRecords,ROOKVALE_BARRIERS);const root=world.root.getObjectByName('rookvale_district')!;let draws=0,triangles=0;const zones=new Set<string>(),matrix=new T.Matrix4(),point=new T.Vector3();
  root.traverse(o=>{if(!(o instanceof T.Mesh))return;draws++;const positions=o.geometry.attributes.position;assert.ok(positions.array.every(Number.isFinite));triangles+=(o.geometry.index?.count??positions.count)/3*(o instanceof T.InstancedMesh?o.count:1);if(o instanceof T.InstancedMesh){assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);const x=matrix.elements[12],z=matrix.elements[14];zones.add(x< -230?'west':x>230?'east':z>200?'north':'south');for(let v=0;v<positions.count;v++){point.fromBufferAttribute(positions,v).applyMatrix4(matrix);assert.ok(Math.abs(point.x)>230||Math.abs(point.z)>210,'district behind existing terminal');assert.ok(point.y>=-.2,'supported above apron');assert.ok(Math.abs(point.x)<350&&Math.abs(point.z)<290,'on the continuous apron');}}}});
  assert.equal(zones.size,4);assert.equal(draws,4);assert.ok(triangles<65000,`${triangles} triangles`);
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
