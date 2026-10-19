import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,vehicleSpecification,rotateVehicleVector} from '../src/vehicle-physics';
await R.init();
test('an upturned Cornet rests on its roof and cone sign instead of sinking the cone into the ground',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 try{
  world.createCollider(R.ColliderDesc.cuboid(40,.5,40).setTranslation(0,-.5,0));
  const spec=vehicleSpecification('cornet'),rig=createVehiclePhysics(R,world,'cornet',spec.mass);
  rig.body.setTranslation({x:0,y:3.2,z:0},true);rig.body.setRotation({x:0,y:0,z:1,w:0},true);
  let lowest=Infinity;
  for(let i=0;i<240;i++){world.step();const p=rig.body.translation(),tip=rotateVehicleVector({x:0,y:2.16,z:.62},rig.body.rotation());lowest=Math.min(lowest,p.y+tip.y);}
  assert.ok(lowest>-.08,`cone tip reached ${lowest.toFixed(3)} m`);
 }finally{world.free();}
});
