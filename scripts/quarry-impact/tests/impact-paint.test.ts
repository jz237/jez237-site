import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {prepareWreckGeometry} from '../src/wreck-geometry';
import {VehicleSurface} from '../src/vehicle-surface';

test('structural impact paint follows crushed skin through mesh transforms and stays local',()=>{
 const root=new T.Group(),original=new T.PlaneGeometry(3,3,6,6),material=new T.MeshStandardMaterial();
 const panel=new T.Mesh(original,material);panel.name='panel_test';panel.position.set(2,0,1);panel.rotation.y=.4;root.add(panel);prepareWreckGeometry(root);
 try{
  const positions=panel.geometry.attributes.position,rest=panel.userData.wreckRest as T.BufferAttribute,from=panel.userData.wreckFromModel as T.Matrix4,to=panel.userData.wreckToModel as T.Matrix4;
  const point=new T.Vector3();
  for(let i=0;i<positions.count;i++){point.fromBufferAttribute(rest,i).add(new T.Vector3(0,0,-.8)).applyMatrix4(from);positions.setXYZ(i,point.x,point.y,point.z);}
  const contact=new T.Vector3().fromBufferAttribute(positions,24).applyMatrix4(to),paint=new T.Color(0xaa2244),before=positions.array.slice();
  VehicleSurface.prototype.transfer.call({} as VehicleSurface,panel,contact,8,paint);
  const transfer=panel.geometry.attributes.transferPaint;
  assert.ok(transfer.getW(24)>.095,'impact paint reaches the current contact');
  assert.equal(transfer.getW(0),0,'remote bodywork stays clean');
  assert.ok(Math.abs(transfer.getX(24)-paint.r)<1e-6);
  assert.deepEqual(positions.array,before,'finish deposition does not move geometry');
  for(let i=0;i<100;i++)VehicleSurface.prototype.transfer.call({} as VehicleSurface,panel,contact,8,paint);
  assert.ok(transfer.getW(24)<=.800001);
 }finally{panel.geometry.dispose();original.dispose();material.dispose();}
});
