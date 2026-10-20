import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {crushGeometry,prepareWreckGeometry,CRUSH} from '../src/wreck-geometry';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
const slab=()=>{const g=new T.BoxGeometry(2,1.4,4.4,4,4,8);g.translate(0,.7,0);const m=new T.Mesh(g,new T.MeshStandardMaterial());m.name='panel_slab';const root=new T.Group();root.add(m);prepareWreckGeometry(root);return m;};
const frame={x:1,z:2.2,top:1.4};
test('front crush shortens the nose most at the tip and leaves the rear and cabin alone',()=>{
 const m=slab(),p=m.geometry.attributes.position,before=p.clone();crushGeometry(m,[1,0,0,0,0],frame);
 let tip=0,rear=0,cabin=0;for(let i=0;i<p.count;i++){const dz=p.getZ(i)-before.getZ(i),z=before.getZ(i);if(z>2.19)tip=Math.min(tip,dz);if(z< -1)rear=Math.max(rear,Math.abs(dz));if(Math.abs(z)<.5)cabin=Math.max(cabin,Math.abs(dz));}
 assert.ok(tip< -CRUSH.end*.95&&tip>=-CRUSH.end-1e-6,'the tip moves back by the full crush');assert.ok(rear===0&&cabin===0,'rear and cabin untouched');
 assert.ok(!crushGeometry(m,[0,0,0,0,0],frame),'no change, no work');
});
test('side crush bows the flank in at the middle and roof crush lowers only the roof; offsets stay bounded',()=>{
 const m=slab(),p=m.geometry.attributes.position,before=p.clone();crushGeometry(m,[0,0,1,0,1],frame);
 let mid=0,end=0,roof=0,floor=0;for(let i=0;i<p.count;i++){const x=before.getX(i),y=before.getY(i),z=before.getZ(i),dx=p.getX(i)-x,dy=p.getY(i)-y;
  if(x< -.99&&Math.abs(z)<.1)mid=Math.max(mid,dx);if(x< -.99&&Math.abs(z)>2.19)end=Math.max(end,dx);if(y>1.39)roof=Math.min(roof,dy);if(y<.01)floor=Math.max(floor,Math.abs(dy));}
 assert.ok(mid>CRUSH.side*.9&&end<.02,'bowed in at the middle, not at the ends');assert.ok(roof< -CRUSH.roof*.9&&floor===0,'roof down, floor untouched');
 for(let k=0;k<20;k++)crushGeometry(m,[1,1,1,1,1],frame);
 let worst=0;for(let i=0;i<p.count;i++)worst=Math.max(worst,Math.hypot(p.getX(i)-before.getX(i),p.getY(i)-before.getY(i),p.getZ(i)-before.getZ(i)));assert.ok(worst<=CRUSH.limit+1e-6,'bounded');
});
test('only extended-damage cars crush as a whole; repair restores the body',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const length=async(extended:boolean)=>{const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never;
  const car=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),undefined,'angular-v1');
  try{car.extendedDamage=extended;car.place(0,0,0);car.render(1);car.root.updateMatrixWorld(true);
   const nose=()=>{let z=-9;for(const m of car.panels){if(!m.visible)continue;const toModel=m.userData.wreckToModel as T.Matrix4,p=m.geometry.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i+=7){v.fromBufferAttribute(p,i).applyMatrix4(toModel);if(Math.abs(v.x)<.3&&v.y>.3&&v.y<.9)z=Math.max(z,v.z);}}return z;};
   const start=nose();const at=new T.Vector3(0,.7,2.4).applyMatrix4(car.root.matrixWorld);
   for(let i=0;i<10;i++){car.health=100;car.hit(at,new T.Vector3(0,0,-1).applyQuaternion(car.root.quaternion),14,0,true);}
   const crushed=nose();car.repair();const repaired=nose();return{start,crushed,repaired};}finally{car.dispose();world.free();}};
 const off=await length(false),on=await length(true);console.log(JSON.stringify({off,on}));
 assert.ok(on.start-on.crushed>off.start-off.crushed+.15,'the extended car loses noticeably more length');
 assert.ok(Math.abs(on.repaired-on.start)<1e-3,'repair restores it');
});
