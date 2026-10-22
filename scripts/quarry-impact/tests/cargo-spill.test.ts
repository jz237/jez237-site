import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CARGO,cargoSpills,lidKind} from '../src/door-swing';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('cargo spills only once the back stands wide open',()=>{
 assert.ok(!cargoSpills('cargo',CARGO.cargo.open-.01)&&cargoSpills('cargo',CARGO.cargo.open)&&!cargoSpills('drop',NaN));
 assert.ok(CARGO.cargo.load>CARGO.tailgate.load,'a van carries more than a boot');
});
test('a van with its barn doors flung open drops its crates out of the back, a pickup with its tailgate down loses its load; online-style loads stay aboard',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(kind:'van'|'hollins',extended:boolean)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
  const dropped:{y:number;behind:number;visible:boolean;size:number}[]=[];let car:Vehicle|undefined;
  const fx={emit(){},mark(){},detach(m:T.Mesh,v:T.Vector3){m.updateWorldMatrix(true,false);const p=m.getWorldPosition(new T.Vector3()).sub(car!.current);dropped.push({y:p.y,behind:-p.dot(car!.forward),visible:m.parent!==null,size:new T.Box3().setFromObject(m).getSize(new T.Vector3()).length()});void v;}};
  const c=new Vehicle(0,kind,stockSetup(kind).paint,scene,world,fx as never,stockSetup(kind),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');car=c;
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);
   for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
   for(const a of c.wreckParts.assemblies)if(lidKind(a.name))a.loose=.75;
   c.input.throttle=1;for(let k=0;k<60*6;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
   let leftovers=0;c.root.traverse(o=>{if(o.name==='cargo_spill')leftovers++;});
   return{spilled:c.cargoSpilled,dropped,leftovers};
  }finally{c.dispose();world.free();}
 };
 const van=await run('van',true),pickup=await run('hollins',true),offVan=await run('van',false);
 console.log(JSON.stringify({van:{...van,dropped:van.dropped.length},pickup:{...pickup,dropped:pickup.dropped.length},offVan:offVan.spilled,first:van.dropped[0]}));
 assert.ok(van.spilled>=2&&van.spilled<=CARGO.cargo.load&&van.dropped.length===van.spilled,'crates fall out of the van');
 assert.ok(van.dropped.every(d=>d.behind>1&&d.size>.5),'out of the back, crate-sized');
 assert.ok(pickup.spilled>=1&&pickup.spilled<=CARGO.drop.load,'the pickup loses its load');
 assert.ok(van.leftovers===0&&pickup.leftovers===0,'nothing left attached to the car');
 assert.equal(offVan.spilled,0,'online-style loads stay aboard');
});
