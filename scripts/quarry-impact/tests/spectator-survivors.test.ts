import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {DemoDirector} from '../src/demo-director';
import type {Vehicle} from '../src/vehicle';
const car=(id:number,health=100,finished=false)=>{const root=new T.Group();root.position.set(id*2,1,0);return{id,health,finished,root,current:root.position,speed:0,kind:'wagon'} as Vehicle;};
test('cycling wraps in roster order and skips every wreck in either direction',()=>{
 const cars=[car(4),car(9,0),car(20,-3),car(27),car(61,0),car(80)],d=new DemoDirector();
 d.follow(4);
 for(const expected of [27,80,4]){d.cycleCar(cars);assert.equal(d.followed,expected);assert.equal(d.manual,true);}
 for(const expected of [80,27,4]){d.cycleCar(cars,-1);assert.equal(d.followed,expected);}
 d.follow(20);d.cycleCar(cars);assert.equal(d.followed,27);
 d.follow(20);d.cycleCar(cars,-1);assert.equal(d.followed,4);
});
test('disconnected subject starts at the corresponding end, finished survivors remain selectable',()=>{
 const cars=[car(3,0),car(7,100,true),car(15),car(18,0)],d=new DemoDirector();
 d.follow(999);d.cycleCar(cars);assert.equal(d.followed,7);
 d.follow(999);d.cycleCar(cars,-1);assert.equal(d.followed,15);
 cars[2].health=0;d.cycleCar(cars);assert.equal(d.followed,7);
 cars[2].health=100;d.cycleCar(cars);assert.equal(d.followed,15,'respawned car re-enters rotation');
});
test('empty or eliminated fields and invalid directions retain current selection',()=>{
 for(const cars of [[],[car(4,0),car(9,-2)]])for(const direction of [-1,1]){
  const d=new DemoDirector();d.follow(4);d.manual=false;d.cycleCar(cars,direction);assert.equal(d.followed,4);assert.equal(d.manual,false);
 }
 for(const direction of [0,NaN,Infinity]){const d=new DemoDirector();d.follow(4);d.cycleCar([car(4),car(9)],direction);assert.equal(d.followed,4);}
});
test('repeated cycling with one survivor never resets its moving camera',()=>{
 const cars=[car(0),car(1,0)],d=new DemoDirector(undefined,undefined,()=>0),control=new DemoDirector(undefined,undefined,()=>0);
 const camera=new T.PerspectiveCamera(),reference=new T.PerspectiveCamera();
 const orbit=()=>({target:new T.Vector3(),update(){}} as any),a=orbit(),b=orbit();
 d.select('chase');control.select('chase');d.follow(0);control.follow(0);
 for(let i=0;i<180;i++){
  cars[0].root.rotation.y=i/90;cars[0].root.position.z+=.1;
  if(i)d.cycleCar(cars,i%2?1:-1);
  d.update(cars,camera,a,1/60,true);control.update(cars,reference,b,1/60,true);
  assert.ok(camera.position.distanceTo(reference.position)<1e-9);
  assert.ok(camera.quaternion.angleTo(reference.quaternion)<1e-7);
 }
});
