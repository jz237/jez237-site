import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MIRROR_HANG,mirrorDroop} from '../src/wreck-attachments';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('a hanging mirror droops by how loose it is and flaps harder with speed; a sound one stays put',()=>{
 assert.equal(mirrorDroop(0,3,20,1),0);assert.ok(Math.abs(mirrorDroop(1,0,0,1)-(MIRROR_HANG.droop+MIRROR_HANG.sway*Math.sin(1)))<1e-12);
 const swing=(speed:number)=>{const v=Array.from({length:200},(_,i)=>mirrorDroop(1,i*.02,speed,-1));return Math.max(...v)-Math.min(...v);};
 assert.ok(swing(25)>swing(0)*2,'flaps at speed');assert.ok(Number.isFinite(mirrorDroop(NaN,NaN,NaN,1)));
});
test('a knock beside the mirror leaves it hanging below its mount before it tears off',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const out:Record<string,unknown>={};let tested=0;
 for(const kind of ['sedan','wagon','compact','van'] as const){
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});
  const c=new Vehicle(0,kind,stockSetup(kind).paint,scene,world,{emit(){},mark(){},detach(){}} as never,stockSetup(kind),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   const mirror=c.wreckParts.assemblies.find(a=>a.name==='mirror-left');if(!mirror){out[kind]='no mirror';continue;}tested++;
   c.root.updateMatrixWorld(true);const box=()=>{c.root.updateMatrixWorld(true);const b=new T.Box3();for(const m of mirror.members)b.expandByObject(m.mesh);return b;};const centre=()=>box().getCenter(new T.Vector3());
   const inner0=box().max.x,before=centre(),hitAt=mirror.bounds.getCenter(new T.Vector3());
   c.wreckParts.hit(hitAt,new T.Vector3(1,0,0),MIRROR_HANG.start+MIRROR_HANG.span+1);c.wreckParts.pose(1/60,0);
   const after=centre(),inner1=box().max.x;out[kind]={loose:mirror.loose,drop:+(before.y-after.y).toFixed(3),inward:+(inner1-inner0).toFixed(3)};
   assert.ok(mirror.loose===1&&before.y-after.y>.05,`${kind}: the mirror hangs (${JSON.stringify(out[kind])})`);
   assert.ok(inner1-inner0<.02,`${kind}: it hangs outside the door skin, not into it (${JSON.stringify(out[kind])})`);
  }finally{c.dispose();world.free();}
 }
 console.log(JSON.stringify(out));assert.ok(tested>=2,'at least two cars have mirrors');
});
