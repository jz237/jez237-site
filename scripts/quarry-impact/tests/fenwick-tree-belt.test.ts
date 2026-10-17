import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickTreeBelt} from '../src/fenwick-tree-belt';
test('cutout trees retain rooted bounds, two perpendicular cards and release textures exactly once',()=>{
 const places=Array.from({length:16},(_,i)=>({x:i*30,y:i*.7,z:i*-20,radius:3.5+i*.1,height:9+i*.5}));const belt=createFenwickTreeBelt(places);let triangles=0,disposed=0;
 for(const o of belt.root.children){const m=o as T.InstancedMesh,mat=m.material as T.MeshBasicMaterial;assert.equal(mat.alphaTest,.45);assert.equal(mat.transparent,false);assert.equal(mat.side,T.DoubleSide);assert.equal(mat.map!.colorSpace,T.SRGBColorSpace);for(const resource of [m,m.geometry,mat,mat.map!])resource.addEventListener('dispose',()=>disposed++);
  const selected=places.filter((_,i)=>m.name.endsWith('spruce')?i%4===0:i%4!==0),matrix=new T.Matrix4(),point=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3();
  assert.equal(m.count,selected.length*2);triangles+=m.count*2;
  selected.forEach((p,i)=>{for(let side=0;side<2;side++){m.getMatrixAt(i*2+side,matrix);const positions=m.geometry.attributes.position;for(let v=0;v<positions.count;v++){point.fromBufferAttribute(positions,v).applyMatrix4(matrix);assert.ok(Math.abs(point.y-p.y)<.00001||Math.abs(point.y-p.y-p.height)<.00001);assert.ok(Math.hypot(point.x-p.x,point.z-p.z)<=p.radius*1.41);}
   (side?b:a).setFromMatrixColumn(matrix,0).normalize();}assert.ok(Math.abs(a.dot(b))<.000001);});
 }
 assert.equal(triangles,places.length*4);belt.dispose();belt.dispose();assert.equal(disposed,8);assert.equal(belt.root.children.length,0);
});
