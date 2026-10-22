import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const drive=async(extended:boolean,setup:(c:Vehicle)=>void,seconds:number)=>{
 const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0).setFriction(1));
 const marks:number[]=[],emits:number[]=[];
 const fx={emit(_p:T.Vector3,_n:number,type:number){emits.push(type);},mark(){},detach(m:T.Mesh){m.visible=false;},evidence:{add(_p:T.Vector3,_y:number,_l:number,_s:number,kind:number){marks.push(kind);}}} as never;
 const c=new Vehicle(0,'sedan',stockSetup('sedan').paint,scene,world,fx,stockSetup('sedan'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
 try{
  c.extendedDamage=extended;c.place(0,0,0);c.render(1);
  for(let k=0;k<30;k++){c.preStep(1/60);world.step();c.postStep(1/60,k/60);}
  setup(c);
  for(let k=0;k<60*seconds;k++){c.preStep(1/60);world.step();c.postStep(1/60,.5+k/60);}
  return{drips:c.drips.slice(),oilSmoke:c.oilSmoke,gouges:marks.filter(k=>k===2).length,sparks:emits.filter(t=>t===1).length};
 }finally{c.dispose();world.free();}
};
test('an engine losing oil smokes out of the exhaust under throttle, offline only',async()=>{
 const leak=(c:Vehicle)=>{c.engineDamage=.9;c.input.throttle=1;};
 const on=await drive(true,leak,6),off=await drive(false,leak,6),coast=await drive(true,c=>{c.engineDamage=.9;c.input.throttle=0;},6);
 console.log(JSON.stringify({on,off,coast}));
 assert.ok(on.oilSmoke>=10&&off.oilSmoke===0&&coast.oilSmoke===0);
});
test('a tyre running on its rim on tarmac cuts grooves offline as well as sparking',async()=>{
 const flat=(c:Vehicle)=>{const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion);c.body.setLinvel({x:f.x*20,y:0,z:f.z*20},true);c.input.throttle=.6;if(c.tyreDamage)c.tyreDamage[0]=.98;};
 const on=await drive(true,flat,2),off=await drive(false,flat,2);console.log(JSON.stringify({on,off}));
 assert.ok(on.gouges>=3&&on.sparks>0,'grooves and sparks offline');
 assert.ok(off.gouges===0&&off.sparks>0,'online-style rims spark but leave no groove');
});
test('a crushed rear drops the exhaust: it drags and sparks at speed, offline only',async()=>{
 const {EXHAUST_DROP}=await import('../src/vehicle');
 const run=async(extended:boolean,rear:number)=>{let n=0;const r=await drive(extended,c=>{c.structuralDamage=[0,rear,0,0,0];const f=new T.Vector3(0,0,1).applyQuaternion(c.body.rotation() as T.Quaternion);c.body.setLinvel({x:f.x*15,y:0,z:f.z*15},true);c.input.throttle=.5;n=0;},2);return r;};
 const on=await run(true,EXHAUST_DROP+.1),intact=await run(true,0),off=await run(false,EXHAUST_DROP+.1);console.log(JSON.stringify({on,intact,off}));
 assert.ok(on.sparks>intact.sparks+3&&on.gouges>intact.gouges+3,'sparks and a scrape mark trail behind');
 assert.ok(off.gouges===0);
});
