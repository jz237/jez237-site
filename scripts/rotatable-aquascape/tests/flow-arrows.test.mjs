import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {placeFlowArrow} from '../../living-aquascape/lib/aquarium/FlowArrow.ts';

test('flow arrows face forward along curved paths, vertical turns and both endpoints',()=>{
 const curve=new T.CatmullRomCurve3([[0,0,0],[0,2,0],[1,3,1],[2,2,0],[2,0,0]].map(p=>new T.Vector3(...p)));
 const arrow=new T.Object3D();
 for(let i=0;i<=100;i++){
  const t=i/100;placeFlowArrow(arrow,curve,t);
  assert.ok(arrow.position.distanceTo(curve.getPointAt(t))<1e-9);
  assert.ok(new T.Vector3(0,1,0).applyQuaternion(arrow.quaternion).dot(curve.getTangentAt(t))>.9999);
 }
});
test('composite filter paths and repeated paused poses retain finite forward headings',()=>{
 const curve=new T.CurvePath();curve.add(new T.LineCurve3(new T.Vector3(),new T.Vector3(0,-2,0)));curve.add(new T.LineCurve3(new T.Vector3(0,-2,0),new T.Vector3(2,-2,0)));
 const arrow=new T.Object3D();
 for(const t of [0,.25,.499,.5,.501,.75,1]){
  placeFlowArrow(arrow,curve,t);const first=arrow.quaternion.clone();placeFlowArrow(arrow,curve,t);
  assert.deepEqual(arrow.quaternion.toArray(),first.toArray());
  assert.ok(new T.Vector3(0,1,0).applyQuaternion(first).dot(curve.getTangentAt(t))>.9999);
 }
});
