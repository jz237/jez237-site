import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {VehicleDrawBatch} from '../src/vehicle-draw-batch';

function check(batch:VehicleDrawBatch,tolerance=1e-5){
 batch.sync();
 for(const group of batch.batches)for(const part of group.parts){
  const matrix=new T.Matrix4();
  for(const node of part.parents)matrix.multiply(node.matrix);
  const normal=new T.Matrix3().getNormalMatrix(matrix);
  for(const name of ['position','normal']){
   const source=part.mesh.geometry.getAttribute(name),target=group.mesh.geometry.getAttribute(name);
   for(let i=0;i<source.count;i++){
    const expected=new T.Vector3().fromBufferAttribute(source,i);
    if(name==='position')expected.applyMatrix4(matrix);else expected.applyNormalMatrix(normal);
    assert.ok(expected.distanceTo(new T.Vector3().fromBufferAttribute(target,part.start+i))<tolerance,name);
   }
  }
 }
}
function fixture(normalized=false){
 const source=new T.Group(),a=new T.Group(),b=new T.Group(),material=new T.MeshStandardMaterial();
 source.position.set(30,2,-12);source.add(a);a.add(b);
 a.rotation.set(.2,.4,-.1);a.scale.set(-1.2,.8,1.3);b.rotation.set(.1,-.3,.2);
 for(let i=0;i<3;i++){
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute([0,0,0,.2,0,0,0,.2,0],3));
  geometry.setAttribute('normal',normalized?new T.Int16BufferAttribute([0,0,32767,0,0,32767,0,0,32767],3,true):new T.Float32BufferAttribute([0,0,1,0,0,1,0,0,1],3));
  const mesh=new T.Mesh(geometry,material);mesh.name='panel_test_'+i;mesh.position.x=i/10;b.add(mesh);
 }
 return {source,a,b,batch:new VehicleDrawBatch(source)};
}
test('shared moving ancestors preserve transformed damage, normals and mirrored winding',()=>{
 const {a,b,batch}=fixture();
 try{
  assert.equal(batch.batches.length,1);check(batch);
  a.position.set(1,2,3);a.rotation.y+=.7;b.scale.set(1,.4,2);check(batch);
  const part=batch.batches[0].parts[1],position=part.mesh.geometry.getAttribute('position');
  position.setXYZ(1,.6,-.1,.3);position.needsUpdate=true;check(batch);
  assert.ok(batch.batches[0].parts.every(p=>p.mirrored));
  a.scale.x=1.2;check(batch);assert.ok(batch.batches[0].parts.every(p=>!p.mirrored));
  const version=batch.batches[0].mesh.geometry.getAttribute('position').version;
  batch.sync();assert.equal(batch.batches[0].mesh.geometry.getAttribute('position').version,version);
 }finally{batch.dispose();}
});
test('normalized normals retain their generic conversion path',()=>{
 const {a,batch}=fixture(true);
 try{check(batch,1e-4);a.rotation.x+=.8;check(batch,1e-4);}finally{batch.dispose();}
});
test('non-affine position matrices retain perspective division',()=>{
 const {a,batch}=fixture();
 try{a.matrixAutoUpdate=false;a.matrix.elements[3]=.07;a.matrix.elements[7]=.03;check(batch);}finally{batch.dispose();}
});
