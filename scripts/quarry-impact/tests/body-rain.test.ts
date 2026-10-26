import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BODY_RAIN,topSpots,BodyRain,type RainCar} from '../src/body-rain';
// A car: a flat roof slab at 1.3 m over the back half and a steep windscreen ramping down to a flat bonnet at 0.8 m in front,
// on no layer as the draw batches leave the panels.
const car=()=>{const root=new T.Group(),mat=new T.MeshBasicMaterial({side:T.DoubleSide});
  const roof=new T.Mesh(new T.BoxGeometry(1.6,.05,2),mat);roof.position.set(0,1.3,-.8);
  const bonnet=new T.Mesh(new T.BoxGeometry(1.6,.05,1.2),mat);bonnet.position.set(0,.8,1.6);
  const screen=new T.Mesh(new T.PlaneGeometry(1.6,1).rotateX(-Math.PI/2+Math.atan2(.5,.8)),mat);screen.position.set(0,1.05,.6);screen.scale.set(1,1,1);
  for(const m of [roof,bonnet,screen]){m.layers.mask=0;root.add(m);}root.position.set(4,0,-3);root.rotation.y=.6;
  return {root,surfaces:[roof,bonnet,screen],centre:new T.Vector3(0,.8,.2),half:new T.Vector3(.85,.55,2.1)};};
test('the drops land only on the near-flat tops: roof and bonnet, not the windscreen',()=>{
  const {root,surfaces,centre,half}=car(),spots=topSpots(root,surfaces,centre,half);
  assert.ok(spots.length>10,'plenty of room');
  assert.ok(spots.every(s=>Math.abs(s.y-1.325)<.01||Math.abs(s.y-.825)<.01),'on the roof or the bonnet, nowhere between');
  assert.ok(spots.some(s=>s.y>1.3)&&spots.some(s=>s.y<.9),'both');
});
const rainCar=(root:T.Object3D,spots:{x:number;y:number;z:number}[]):RainCar=>({id:1,root,spots,spread:{x:.2,z:.2}});
test('splashes ride on their car, fewer in a lighter shower, none with no car near',()=>{
  const scene=new T.Scene(),rain=new BodyRain(scene,()=>.5),root=new T.Group();root.position.set(10,0,5);root.updateMatrixWorld(true);
  const c=rainCar(root,[{x:0,y:1.3,z:0}]);rain.update([c],1,1/60);
  assert.ok(rain.mesh.visible&&rain.splashing===BODY_RAIN.count,'all landing in a downpour');
  const offset=(rain.mesh.geometry as T.InstancedBufferGeometry).getAttribute('offset') as T.BufferAttribute;
  assert.ok(Math.abs(offset.getX(0)-10)<.2&&Math.abs(offset.getY(0)-(1.3+BODY_RAIN.lift))<1e-6,'on its top');
  root.position.x=30;root.updateMatrixWorld(true);rain.update([c],1,1/240);assert.ok(Math.abs(offset.getX(0)-30)<.2,'and moving with it');
  const light=new BodyRain(new T.Scene(),(()=>{let r=0;return()=>(r=(r*9301+49297)%233280)/233280;})());for(let i=0;i<120;i++)light.update([c],.3,1/60);
  assert.ok(light.splashing>BODY_RAIN.count*.1&&light.splashing<BODY_RAIN.count*.55,'a light shower lands fewer');
  rain.update([],1,1/60);assert.equal(rain.mesh.visible,false,'none near: put away');rain.reset();assert.equal(rain.splashing,0);
});
test('main splashes rain on the offline cars within reach of the camera in the rain',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("rainNear.length=0;if(eventLighting==='rain'&&!online?.active)for(const c of cars){if(!c.extendedDamage||c.root.position.distanceToSquared(camera.position)>BODY_RAIN.reach**2)continue;"),'offline, near the camera');
  assert.ok(main.includes('const spots=topSpots(c.root,[...c.panels,...c.glass],box.centre,box.half);')&&main.includes('bodyRain.update(rainNear,shower,'),'their tops found once, as hard as it rains');
  assert.ok(main.includes('sparkLight.reset();bodyRain.reset();'),'cleared between events');
});
