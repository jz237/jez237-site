import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {HEADLIGHT_AIM,headlightAim,attachCarLights} from '../src/car-lights';
test('a crushed front swings the light pool toward the crushed corner and shortens it; a sound front aims straight',()=>{
 assert.deepEqual(headlightAim(0,0,0),{yaw:0,reach:1});
 const r=headlightAim(.8,0,.3),l=headlightAim(.8,.3,0);
 assert.ok(r.yaw>0&&l.yaw<0&&Math.abs(r.yaw+l.yaw)<1e-12&&Math.abs(r.reach-(1-HEADLIGHT_AIM.short*.8))<1e-12);
 assert.ok(Math.abs(headlightAim(1,0,1).yaw)<=HEADLIGHT_AIM.yaw*2&&Number.isFinite(headlightAim(NaN,NaN,NaN).yaw));
});
test('the car lights accept an aim without breaking when there is no DOM',()=>{
 const root=new T.Group(),lamp=new T.Mesh(new T.BoxGeometry(.2,.1,.05),new T.MeshStandardMaterial({name:'Headlight'}));lamp.position.set(.5,.6,2);root.add(lamp);
 const lights=attachCarLights(root,2.2);lights.aim(.3,.6);lights.aim(NaN,NaN);lights.set(true,false);assert.equal(lights.head,1);lights.dispose();
});
