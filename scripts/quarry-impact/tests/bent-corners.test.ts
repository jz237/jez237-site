import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {LEAN,cornerLean,leanLift} from '../src/bent-corners';
await R.init();const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const ground={height:()=>0,surface:()=>'gravel' as const};
const fx={emit(){},mark(){},detach(){}}as any;
test('a corner leans from its first real knock to the full lean by the time derby wheels are torn off, top out on either side',()=>{
  for(const d of [0,LEAN.onset,-1,Number.NaN])assert.equal(Math.abs(cornerLean(d,-1)),0);
  assert.ok(Math.abs(cornerLean(LEAN.full,-1)-LEAN.max)<1e-12);assert.ok(Math.abs(cornerLean(1,1)+LEAN.max)<1e-12);
  let last=0;for(let d=0;d<=1;d+=.02){const l=cornerLean(d,-1);assert.ok(l>=last-1e-12);last=l;assert.equal(cornerLean(d,1),-l);}
  assert.ok(cornerLean(.2,-1)>.12,'a typical derby corner visibly leans');assert.ok(LEAN.max<=.35,'bent, not folded flat');
});
test('a leaning wheel is lifted just enough to keep its tread on the road',()=>{
  assert.equal(leanLift(0,.33,.11),0);assert.equal(leanLift(Number.NaN,.33,.11),0);
  const lift=leanLift(LEAN.max,.33,.11);assert.ok(lift>.005&&lift<.03,`${lift}`);assert.equal(leanLift(-LEAN.max,.33,.11),lift);
  // The tread's low edge, swung by the lean about the wheel centre, then lifted, sits back at the old contact height.
  const a=LEAN.max,low=-(.33*Math.cos(a)+.11*Math.sin(a))+lift;assert.ok(Math.abs(low+.33)<1e-9);
});
function fixture(extended:boolean){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(300,.5,300).setTranslation(0,-.5,0));
  const scene=new T.Scene(),setup=stockSetup('coupe'),car=new Vehicle(0,'coupe',setup.paint,scene,world,fx,setup,ground,'angular-v1');car.extendedDamage=extended;car.place(0,0,0);
  let time=0;const step=(n=1)=>{for(let i=0;i<n;i++){car.preStep(1/60);world.step();car.postStep(1/60,time+=1/60);car.render(1);}};
  step(60);return{car,step,close(){car.dispose();world.free();}};
}
/** How far (rad) wheel i's top leans out of the car, in the car's own frame. */
function topOut(car:Vehicle,i:number){
  car.root.updateMatrixWorld(true);const w=car.wheels[i]!,q=new T.Quaternion(),axle=new T.Vector3(1,0,0).applyQuaternion(w.getWorldQuaternion(q)).applyQuaternion(car.root.quaternion.clone().invert());
  const out=Math.sign(car.root.worldToLocal(w.getWorldPosition(new T.Vector3())).x);return Math.asin(axle.y)*-out*Math.sign(axle.x);
}
test('the actual Vehicle leans a knocked wheel top-out on its bent upright offline, and never online',()=>{
  for(const extended of [true,false]){
    const f=fixture(extended),c=f.car;
    try{
      const rest=[0,1].map(i=>topOut(c,i));
      c.wreckParts.wheelDamage[0]=c.wreckParts.wheelDamage[1]=.16;c.render(1);
      const bent=[0,1].map(i=>topOut(c,i)),expected=Math.abs(cornerLean(.16,-1));
      for(const i of [0,1])assert.ok(extended?Math.abs(bent[i]-rest[i]-expected)<.02:Math.abs(bent[i]-rest[i])<1e-9,`${extended} wheel ${i}: ${rest[i]} → ${bent[i]} (lean ${expected})`);
    }finally{f.close();}
  }
});
