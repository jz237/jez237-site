import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLASS_POP} from '../src/vehicle';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
await R.init();
// Boolean assertions only around Three.js objects.
test('screen and plate names are recognised',()=>{
 for(const n of ['glass_BodyWindshield','glass_Windshield','glass_FrontVan','glass_Front'])assert.ok(GLASS_POP.front.test(n),n);
 for(const n of ['glass_BodyRearwindow','glass_Rear','glass_TailgateRear'])assert.ok(GLASS_POP.rear.test(n),n);
 assert.ok(!GLASS_POP.front.test('glass_BodyDoorL')&&!GLASS_POP.rear.test('glass_QuarterR'));
 assert.ok(GLASS_POP.plate.test('panel_RearPlate')&&!GLASS_POP.plate.test('panel_RearPlateRecess'));
});
test('a smashed-in front pops the windscreen out whole and knocks the plate off; light knocks do not; online-style cars keep them',async()=>{
 const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([\w-]+)\.glb$/.exec(String(url))![1] as never);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 const run=async(extended:boolean,hits:number,damage:number)=>{
  const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0});world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const gone:string[]=[];
  const c=new Vehicle(0,'wagon',stockSetup('wagon').paint,scene,world,{emit(){},mark(){},detach(m:T.Mesh){gone.push(m.name);m.visible=false;}} as never,stockSetup('wagon'),{height:()=>0,surface:()=>'asphalt'} as never,'angular-v1');
  try{
   c.extendedDamage=extended;c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);
   for(let i=0;i<hits;i++){c.health=100;const at=new T.Vector3(0,.9,2.1).applyMatrix4(c.root.matrixWorld);c.hit(at,new T.Vector3(0,-.2,-1).normalize().applyQuaternion(c.root.quaternion),damage,i*.5);}
   return{front:c.structuralDamage?.[0]??0,screens:gone.filter(n=>GLASS_POP.front.test(n)),plates:gone.filter(n=>GLASS_POP.plate.test(n)),pops:c.glassPops,lost:c.platesLost};
  }finally{c.dispose();world.free();}
 };
 const heavy=await run(true,14,16),light=await run(true,1,6),off=await run(false,14,16);console.log(JSON.stringify({heavy,light,off}));
 assert.ok(heavy.front>=GLASS_POP.crush&&heavy.screens.length===1&&heavy.pops===1,'the windscreen pops out once');
 assert.ok(heavy.plates.length>=1&&heavy.lost===heavy.plates.length,'the front plate comes off');
 assert.ok(light.pops===0&&light.lost===0,'light knocks leave them');
 assert.ok(off.pops===0&&off.lost===0&&!off.screens.length,'online-style cars keep them');
});
