import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {prepareWreckGeometry} from '../src/wreck-geometry';
import {scuffGeometry} from '../src/collision-scar-geometry';

test('paint transfers at the current surface of crushed, transformed bodywork',()=>{
 const root=new T.Group(),original=new T.PlaneGeometry(.4,.4,4,4),material=new T.MeshStandardMaterial();
 const panel=new T.Mesh(original,material);panel.name='panel_test';panel.position.set(2,0,1);panel.rotation.y=.4;root.add(panel);prepareWreckGeometry(root);
 try{
  const positions=panel.geometry.attributes.position,rest=panel.userData.wreckRest as T.BufferAttribute,to=panel.userData.wreckToModel as T.Matrix4,from=panel.userData.wreckFromModel as T.Matrix4;
  const point=new T.Vector3();
  for(let i=0;i<positions.count;i++){point.fromBufferAttribute(rest,i).add(new T.Vector3(0,0,-.8)).applyMatrix4(from);positions.setXYZ(i,point.x,point.y,point.z);}
  panel.geometry.computeBoundingBox();
  const center=12,contact=new T.Vector3().fromBufferAttribute(positions,center).applyMatrix4(to),paint=new T.Color(0xaa2244);
  assert.ok(scuffGeometry(panel,contact,new T.Vector3(0,0,-1),paint));
  const transfer=panel.geometry.attributes.transferPaint;
  assert.ok(transfer.getW(center)>.09,'fresh paint must appear where the crushed skin is touched');
  assert.ok(Math.abs(transfer.getX(center)-paint.r)<1e-6);
  assert.ok(panel.geometry.attributes.impactWear.getX(center)>.7);
  for(const v of positions.array)assert.ok(Number.isFinite(v));
 }finally{panel.geometry.dispose();original.dispose();material.dispose();}
});
