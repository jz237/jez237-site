import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {surfaceGrip,type DrivingSurface} from '../src/driving-surface';
import {limitTractionForce} from '../src/driving-assists';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
test('mud reaches the real tyre controller and traction assists while existing surfaces retain their coefficients',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),spec=vehicleSpecification('coupe'),car=createVehiclePhysics(R,world,'coupe',spec.mass);
 world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));car.body.setTranslation({x:0,y:.85,z:0},true);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 try{for(const [surface,coefficient]of [['asphalt',3.2],['gravel',2.4],['mud',1.9]]as const){
  state.surface=surface;stepVehiclePhysics(car.body,car.controller,'coupe',spec,state,1/60);world.step();
  assert.equal(surfaceGrip(surface),coefficient);assert.ok(Math.abs(car.controller.wheelFrictionSlip(0)!-coefficient*spec.grip)<1e-5);
  assert.equal(limitTractionForce(10000,1,true,1000,0,surface,1),coefficient*1000);
  assert.equal(limitTractionForce(10000,1,false,1000,0,surface,1),0);
 }}finally{world.removeVehicleController(car.controller);world.free();}
});
