import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildVanAsset} from '../src/van-asset';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,cloneCar} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {verifyVanRevision} from './van-invariants';

test('aligned cargo-side rows remove the longitudinal normal wobble in the published intact van',async t=>{
 const bytes=gunzipSync(readFileSync(new URL('./fixtures/van-finish/public-models-van.glb.gz',import.meta.url)));
 const old=(await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'')).scene,newRoot=buildVanAsset();
 const measure=(root:T.Object3D)=>{
  const mesh=root.getObjectByName('panel_CargoSideVanL')as T.Mesh,p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;let wobble=0,count=0;
  for(let i=0;i<p.count;i++)if(p.getY(i)>.85&&p.getY(i)<1.105&&p.getZ(i)>-2.05&&p.getZ(i)<-.40&&n.getX(i)<-.65){wobble=Math.max(wobble,Math.abs(n.getZ(i)));count++;}
  assert.ok(count>20);return wobble;
 };
 const before=measure(old),after=measure(newRoot);t.diagnostic(JSON.stringify({beforeNormalZ:before,afterNormalZ:after}));
 assert.ok(before>.03,'The published mesh reproduces the unwanted highlight wobble');assert.ok(after<.0001,'A horizontal body curve must not acquire longitudinal normal variation');
 const p=(newRoot.getObjectByName('panel_CargoSideVanL')as T.Mesh).geometry.attributes.position,levels=new Set<number>();
 for(let i=0;i<p.count;i++)if(Math.abs(p.getY(i)-1.04)<1e-6)levels.add(+p.getZ(i).toFixed(5));
 assert.ok(levels.size>=18,'The shoulder row must remain horizontal through the arch region');
});

test('new stamped skins are closed, outward facing and joined to the adjoining body without open slots',()=>{
 const root=buildVanAsset(),key=(p:T.Vector3)=>p.toArray().map(x=>x.toFixed(6)).join(',');
 for(const name of ['panel_CargoSideVanL','panel_CargoBlankVanL','panel_CargoBlankVanR','panel_CargoDoorVanLStamping','panel_CargoDoorVanRStamping','panel_CabHeaderVan','panel_BodyDoorLVanHeader']){
  const mesh=root.getObjectByName(name)as T.Mesh,p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,edges=new Map<string,number>();
  for(let i=0;i<p.count;i+=3){
   const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2),face=b.clone().sub(a).cross(c.clone().sub(a));
   assert.ok(face.lengthSq()>1e-18,name+' has a collapsed triangle');
   const average=new T.Vector3().fromBufferAttribute(n,i).add(new T.Vector3().fromBufferAttribute(n,i+1)).add(new T.Vector3().fromBufferAttribute(n,i+2));
   assert.ok(face.dot(average)>0,name+' has inverted normals');
   for(let j=0;j<3;j++){const edge=[key(new T.Vector3().fromBufferAttribute(p,i+j)),key(new T.Vector3().fromBufferAttribute(p,i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  }
  assert.ok([...edges.values()].every(x=>x===2),name+' must form a closed solid');
 }
 for(const side of [-1,1])for(const z of [-2.1,-1.8,-1.35,-.9,-.4]){
  const panels=[root.getObjectByName('panel_CargoSideVan'+(side<0?'L':'R'))!,root.getObjectByName('panel_CargoBlankVan'+(side<0?'L':'R'))!];
  for(const y of [1.099,1.10,1.101]){const hit=new T.Raycaster(new T.Vector3(side*1.3,y,z),new T.Vector3(-side,0,0)).intersectObjects(panels)[0];assert.ok(hit&&Math.abs(hit.point.x)>.86,'No daylight slot at the upper/lower pressing joint');}
 }
});

test('the rendered van keeps its work-vehicle paint and new cab headers follow door damage and repair',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;
 GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|wheel-machining)\.glb$/.exec(String(url))![1]);
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const root=cloneCar('van',0x486552),m=(root.getObjectByName('panel_CargoBlankVanL')as T.Mesh).material as T.MeshPhysicalMaterial;
 assert.equal(m.color.getHex(),0x486552);assert.equal(m.metalness,.12);assert.equal(m.roughness,.36);assert.equal(m.clearcoat,.85);assert.equal(m.clearcoatRoughness,.18);
 const old=cloneCar('compact',0x486552),oldPaint=(old.getObjectByName('panel_BodyDoorL')as T.Mesh).material as T.MeshPhysicalMaterial;assert.equal(oldPaint.metalness,.48);assert.equal(oldPaint.roughness,.24);
 const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,'van',0x486552,new T.Scene(),world,{emit(){},mark(){},detach(mesh:T.Mesh){mesh.visible=false;}}as any);
 try{
  const header=car.model.getObjectByName('panel_BodyDoorLVanHeader')as T.Mesh,front=car.model.getObjectByName('panel_CabHeaderVan')as T.Mesh;
  const positions=Array.from(header.geometry.attributes.position.array),normals=Array.from(header.geometry.attributes.normal.array),matrix=header.matrix.toArray(),frontMatrix=front.matrix.toArray();
  const door=car.wreckParts.assemblies.find(a=>a.name==='door-left')!;assert.ok(door.members.some(m=>m.mesh===header));
  car.place(0,0,0);car.root.updateMatrixWorld(true);car.hit(new T.Vector3(-.9,1.2,.4).applyMatrix4(car.model.matrixWorld),new T.Vector3(1,0,0),32,.5,true);car.wreckParts.poseAt(1,0);
  assert.notDeepEqual(header.matrix.toArray(),matrix);assert.deepEqual(front.matrix.toArray(),frontMatrix);assert.notDeepEqual(Array.from(header.geometry.attributes.position.array),positions);
  car.repair();assert.deepEqual(header.matrix.toArray(),matrix);assert.deepEqual(Array.from(header.geometry.attributes.position.array),positions);assert.deepEqual(Array.from(header.geometry.attributes.normal.array),normals);
 }finally{car.dispose();world.free();}
});

test('the vehicle finish retains every preceding van and historic source hash',verifyVanRevision);
