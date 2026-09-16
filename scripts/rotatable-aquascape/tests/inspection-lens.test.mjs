import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {frameInspectionLens} from '../lib/InspectionLens.ts';

test('high resolution lens renders the exact off-center magnified region without moving the main camera',()=>{
 for(const aspect of [.55,2.4])for(const center of [new T.Vector2(.5,.5),new T.Vector2(.2,.7)]){
  const source=new T.PerspectiveCamera(45,aspect,.1,100);source.position.set(3,4,12);source.lookAt(0,2,0);source.updateMatrixWorld();
  const original=source.projectionMatrix.clone(),camera=new T.PerspectiveCamera(),radius=new T.Vector2(.08,.13),zoom=2.4;
  frameInspectionLens(source,camera,center,radius,zoom);
  for(const [x,y] of [[0,0],[-1,-1],[1,1],[.6,-.3]]){
   const world=new T.Vector3(2*(center.x+x*radius.x/zoom)-1,2*(center.y+y*radius.y/zoom)-1,.5).unproject(source);
   const actual=world.project(camera);assert.ok(Math.abs(actual.x-x)<1e-10&&Math.abs(actual.y-y)<1e-10);
  }
  assert.deepEqual(source.projectionMatrix,original);assert.deepEqual(camera.matrixWorld,source.matrixWorld);
 }
});
