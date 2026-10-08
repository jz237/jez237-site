import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {prepareWreckGeometry,repairWreckGeometry,dentGeometry} from '../src/wreck-geometry';
import {scuffGeometry} from '../src/collision-scar-geometry';import {markCollision} from '../src/collision-scars';
import {constructionResponse} from '../src/vehicle-construction';
import type {VehicleSurface} from '../src/vehicle-surface';
const finish={transfer(){throw Error('Scuff finish must share the vertex pass');}}as unknown as VehicleSurface;
function skin(transform=false){
 const root=new T.Group(),mesh=new T.Mesh(new T.PlaneGeometry(2,2,24,24),new T.MeshStandardMaterial());mesh.name='panel_skin';
 if(transform){const transform=new T.Matrix4().makeRotationY(.4).setPosition(.2,.1,.3);mesh.geometry.applyMatrix4(transform.clone().invert());mesh.applyMatrix4(transform);}
 root.add(mesh);prepareWreckGeometry(root);return{root,mesh,dispose(){mesh.geometry.dispose();(mesh.material as T.Material).dispose();}};
}
test('shallow contacts deform actual bodywork, leave paint and primer, and respect rest displacement bounds after repeated rubbing',()=>{
 const rig=skin(),{mesh}=rig;try{
  for(let i=0;i<120;i++)assert.ok(markCollision([mesh],new T.Vector3(0,0,-.03*i),new T.Vector3(0,0,-1),finish,new T.Color(0x885522)));
  const p=mesh.geometry.attributes.position,rest=mesh.userData.wreckRest as T.BufferAttribute,wear=mesh.geometry.attributes.impactWear,paint=mesh.geometry.attributes.transferPaint;
  let displaced=0,exposed=0,painted=0;const v=new T.Vector3(),r=new T.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);r.fromBufferAttribute(rest,i);assert.ok(v.toArray().every(Number.isFinite));assert.ok(v.distanceTo(r)<=constructionResponse(r.x,r.y,r.z,1).budget+1e-6);displaced=Math.max(displaced,v.distanceTo(r));exposed=Math.max(exposed,wear.getX(i));painted=Math.max(painted,paint.getW(i));}
  assert.ok(displaced>.03);assert.ok(exposed>.5);assert.ok(painted>.1);repairWreckGeometry(mesh);assert.deepEqual(Array.from(p.array),Array.from(mesh.userData.original));assert.ok(Array.from(wear.array).every(v=>v===0));assert.ok(Array.from(paint.array).every(v=>v===0));
 }finally{rig.dispose();}
});
test('a common model-space compression stays continuous across export transforms and keeps structural crash deformation available',()=>{
 const a=skin(),b=skin(true),contact=new T.Vector3(0,0,0),axis=new T.Vector3(0,0,-1);try{
  for(let i=0;i<8;i++){assert.ok(scuffGeometry(a.mesh,contact,axis));assert.ok(scuffGeometry(b.mesh,contact,axis));}
  const v=new T.Vector3(),w=new T.Vector3();for(let i=0;i<a.mesh.geometry.attributes.position.count;i++){v.fromBufferAttribute(a.mesh.geometry.attributes.position,i);w.fromBufferAttribute(b.mesh.geometry.attributes.position,i).applyMatrix4(b.mesh.userData.wreckToModel);assert.ok(v.distanceTo(w)<2e-6);}
  const before=new Float32Array(a.mesh.geometry.attributes.position.array);assert.ok(dentGeometry(a.mesh,contact,axis,20)>0);assert.notDeepEqual(a.mesh.geometry.attributes.position.array,before);
 }finally{a.dispose();b.dispose();}
});
test('nearest visible skin receives the mark when the collider lies outside it; hidden bodywork and engines are excluded',()=>{
 const rig=skin();try{assert.ok(markCollision([rig.mesh],new T.Vector3(4,3,7),new T.Vector3(),finish));rig.root.visible=false;assert.equal(markCollision([rig.mesh],new T.Vector3(),new T.Vector3(),finish),false);rig.root.visible=true;rig.mesh.userData.constructionRole='engine';assert.equal(markCollision([rig.mesh],new T.Vector3(),new T.Vector3(),finish),false);}finally{rig.dispose();}
});
