import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {VehicleDrawBatch} from '../src/vehicle-draw-batch';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {withWreckBatch} from '../src/wreck-batch';

function equivalent(batch:VehicleDrawBatch){
 batch.sync();batch.source.updateWorldMatrix(true,true);
 for(const b of batch.batches)for(const p of b.parts){
  const matrix=new T.Matrix4().copy(batch.source.matrixWorld).invert().multiply(p.mesh.matrixWorld),normal=new T.Matrix3().getNormalMatrix(matrix);
  for(const [name,a]of Object.entries(p.mesh.geometry.attributes)){
   const copied=b.mesh.geometry.getAttribute(name);
   if(name==='position'||name==='normal'){
    for(let i=0;i<a.count;i++){
     const expected=new T.Vector3().fromBufferAttribute(a,i);if(name==='position')expected.applyMatrix4(matrix);else expected.applyNormalMatrix(normal);
     assert.ok(expected.distanceTo(new T.Vector3().fromBufferAttribute(copied,p.start+i))<1e-5,`${p.mesh.name}/${name}`);
    }
   }else assert.deepEqual(Array.from(copied.array).slice(p.start*a.itemSize,(p.start+a.count)*a.itemSize),Array.from(a.array),`${p.mesh.name}/${name}`);
  }
 }
}
test('all eleven real cars preserve damaged buffers, moving panels, visibility and repair in render batches',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;
 GLTFLoader.prototype.loadAsync=async url=>{const m=/\/([^/]+)\.glb$/.exec(String(url));assert.ok(m);return loadCarWithoutImages(m[1]);};
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),counts=[];
 try{for(const kind of CAR_KINDS){
  const car=new Vehicle(0,kind,0xa03d21,scene,world,{emit(){},mark(){},detach(){}}as any);
  car.place(5,-3,.7);const batch=new VehicleDrawBatch(car.root);
  try{
   const parts=batch.batches.flatMap(b=>b.parts);assert.ok(parts.length>0,kind);
   counts.push({kind,panels:parts.length,batches:batch.batches.length});equivalent(batch);
   const front=new T.Vector3(5,.8,-3).add(new T.Vector3(0,0,DEFINITIONS[kind].halfLength).applyQuaternion(car.root.quaternion));
   withWreckBatch(()=>{car.scar(front,new T.Vector3(0,0,-1),new T.Color(0x0000ff));car.hit(front,new T.Vector3(0,0,-1),40,1,true,new T.Color(0x0000ff));});
   car.wreckParts.pose(.2,12);equivalent(batch);
   const first=batch.batches[0],part=first.parts[0];part.mesh.visible=false;batch.sync();assert.equal(part.visible,false);
   part.mesh.visible=true;part.mesh.position.x+=.25;equivalent(batch);
   car.repair();equivalent(batch);assert.equal(part.visible,true);
   const sourceGeometry=part.mesh.geometry,sourceMaterial=part.mesh.material;let sourceDisposed=false;sourceGeometry.addEventListener('dispose',()=>sourceDisposed=true);
   batch.dispose();batch.dispose();assert.equal(part.mesh.layers.mask,part.layers);assert.equal(sourceDisposed,false);assert.equal(part.mesh.material,sourceMaterial);
  }finally{batch.dispose();car.dispose();}
 }assert.equal(scene.children.length,0);console.log(JSON.stringify(counts));}finally{world.free();}
});

test('render proxies follow car visibility, mirrored panels, changed attributes and buffer disposal',()=>{
 const source=new T.Group(),scene=new T.Scene();scene.add(source);
 const material=new T.MeshStandardMaterial(),parent=new T.Group();source.add(parent);
 const a=new T.Mesh(new T.BoxGeometry(),material),b=new T.Mesh(new T.BoxGeometry(),material);
 a.geometry.clearGroups();b.geometry.clearGroups();a.name=b.name='panel_test';a.scale.x=-1;b.position.x=2;parent.add(a,b);
 const batch=new VehicleDrawBatch(source);assert.equal(batch.batches.length,1);const group=batch.batches[0],part=group.parts[0];
 equivalent(batch);assert.equal(batch.root.parent,source);assert.equal(part.mirrored,true);
 const indices=group.mesh.geometry.index!;assert.equal(indices.getX(part.indexStart+1),part.indices[2]);
 parent.visible=false;batch.sync();assert.equal(part.visible,false);assert.ok(Array.from(indices.array).slice(part.indexStart,part.indexStart+part.indices.length).every(i=>i===part.start));
 parent.visible=true;batch.sync();assert.equal(part.visible,true);
 const attribute=a.geometry.getAttribute('position').clone();attribute.setXYZ(0,2,3,4);a.geometry.setAttribute('position',attribute);a.geometry.computeBoundingSphere();equivalent(batch);
 source.visible=false;assert.equal(group.mesh.parent?.parent,source);
 let disposed=0;group.mesh.geometry.addEventListener('dispose',()=>disposed++);batch.dispose();batch.dispose();assert.equal(disposed,1);assert.equal(a.layers.mask,1);assert.equal(batch.root.parent,null);
});
