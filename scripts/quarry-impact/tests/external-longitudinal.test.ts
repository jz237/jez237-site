import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
test('external contact mode disables legacy propulsion and brakes while retaining suspension setup',()=>{
 for(const external of [false,true])for(const braking of [false,true]){
 const world=new R.World({x:0,y:-9.81,z:0}),spec=vehicleSpecification('coupe'),car=createVehiclePhysics(R,world,'coupe',spec.mass);
 world.createCollider(R.ColliderDesc.cuboid(50,.5,50).setTranslation(0,-.5,0));car.body.setTranslation({x:0,y:.8,z:0},true);world.step();
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:braking?0:1,brake:braking?1:0,steer:.2,handbrake:false}};
 try{stepVehiclePhysics(car.body,car.controller,'coupe',spec,state,1/60,undefined,undefined,0,[0,0,0,0],external);
 const force=[0,1,2,3].reduce((s,i)=>s+Math.abs(car.controller.wheelEngineForce(i)??0),0),brake=[0,1,2,3].reduce((s,i)=>s+(car.controller.wheelBrake(i)??0),0);
 if(external){assert.equal(force,0);assert.equal(brake,0);}else if(braking)assert.ok(brake>0);else assert.ok(force>0);
 assert.ok(car.controller.wheelSteering(0)!>0);assert.ok(car.controller.wheelMaxSuspensionForce(0)!>0);
 }finally{world.free();}
 }
});
