import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ROOF_DUCK,dashboardEye,dashboardComposition,roofDuckDrop,DASHBOARD_EYES} from '../src/driving-camera';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('the cab eye ducks straight down by the measured drop, capped; no drop leaves it where it was',()=>{
 assert.deepEqual(dashboardEye('wagon',0),[...DASHBOARD_EYES.wagon]);assert.deepEqual(dashboardEye('wagon',NaN),[...DASHBOARD_EYES.wagon]);
 const [x0,y0,z0]=DASHBOARD_EYES.wagon,[x,y,z]=dashboardEye('wagon',.2);assert.ok(x===x0&&z===z0&&Math.abs(y0-y-.2)<1e-12);
 assert.ok(Math.abs(y0-dashboardEye('wagon',9)[1]-ROOF_DUCK.max)<1e-12);
});
test('after the roof is beaten in, the ducked cab eye is still under the roof skin',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const results:Record<string,unknown>={};
 for(const kind of ['sedan','wagon','compact','alder','van'] as const){
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const c=new Vehicle(0,kind,stockSetup(kind).paint,scene,world,{emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as never,stockSetup(kind),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=true;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);
   const body=()=>[...c.panels,...c.glass];const roofClear=(drop:number)=>{const eye=dashboardComposition(kind,c.model,drop).position;c.model.updateMatrixWorld(true);
    const hits=new T.Raycaster(eye,new T.Vector3(0,1,0).applyQuaternion(c.root.quaternion),0,1.2).intersectObjects(body().filter(m=>m.visible),false);
    return hits.length?hits[0].distance:-1;};
   const before=roofClear(0),freshDrop=roofDuckDrop(kind,c.model,body());
   for(let i=0;i<14;i++){c.health=100;const top=new T.Vector3(0,1.6,0).applyMatrix4(c.root.matrixWorld);c.hit(top,new T.Vector3(0,-1,0),16,0,true);}
   c.model.updateMatrixWorld(true);const roof=c.structuralDamage?.[4]??0;
   const drop=roofDuckDrop(kind,c.model,body());results[kind]={before,freshDrop,roof,drop,ducked:roofClear(drop),straight:roofClear(0)};
  }finally{c.dispose();world.free();}
 }
 console.log(JSON.stringify(results));
 for(const [kind,r] of Object.entries(results) as [string,{before:number;freshDrop:number;roof:number;drop:number;ducked:number;straight:number}][]){
  if(r.before<0){assert.ok(r.drop===0&&r.freshDrop===0,`${kind}: open top, nothing to duck under`);continue;}
  assert.ok(r.freshDrop<.02,`${kind}: a sound roof barely moves the eye (${r.freshDrop})`);
  assert.ok(r.drop<ROOF_DUCK.max,`${kind}: ducks no more than it must (${r.drop})`);
  assert.ok(r.before>0,`${kind}: roof above the eye when new`);
  assert.ok(r.roof>.3,`${kind}: the roof was crushed (${r.roof})`);
  assert.ok(r.ducked>=ROOF_DUCK.margin*.8,`${kind}: still under the roof after ducking (${r.ducked})`);
 }
 assert.ok(Object.values(results).some(r=>(r as {straight:number}).straight<0),'without ducking at least one eye ends up above the crushed roof');
 {
 }
});
