import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createWrenfordWindpump} from '../src/wrenford-windpump';import {WRENFORD} from '../src/wrenford-course';import {freezeSceneryTransforms} from '../src/render-work';
test('animated landmark stays outside the physical oval and uses bounded shared batches',()=>{
 const art=createWrenfordWindpump();freezeSceneryTransforms(art.root);let draws=0,triangles=0;const matrix=new T.Matrix4(),p=new T.Vector3();
 try{
  for(const time of [0,10,20,30,40]){art.update(time);art.root.updateWorldMatrix(true,true);art.root.traverse(o=>{
   if(!(o instanceof T.Mesh))return;if(time===0){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);}
   const positions=o.geometry.attributes.position;
   for(let i=0;i<(o instanceof T.InstancedMesh?o.count:1);i++){
    if(o instanceof T.InstancedMesh){o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld);}else matrix.copy(o.matrixWorld);
    for(let v=0;v<positions.count;v++){p.fromBufferAttribute(positions,v).applyMatrix4(matrix);assert.ok(WRENFORD.distance(p.x,p.z)>20,`landmark intrudes near road at ${p.x},${p.z}`);assert.ok(Number.isFinite(p.y));}
   }
  });}
  assert.ok(draws<=12,`${draws} draw calls`);assert.ok(triangles<15000,`${triangles} triangles`);
  const rotor=art.root.getObjectByName('wrenford_windpump_rotor')as T.InstancedMesh;art.update(0);const first=Array.from(rotor.instanceMatrix.array);art.update(10);assert.notDeepEqual(Array.from(rotor.instanceMatrix.array),first);art.update(0);assert.deepEqual(Array.from(rotor.instanceMatrix.array),first);
  console.log(JSON.stringify({draws,triangles}));
 }finally{art.dispose();art.dispose();assert.equal(art.root.children.length,0);}
});
