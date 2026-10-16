import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain,gridPool} from '../src/grid-rules';import {ONLINE_CARS,validOnlineCar} from '../src/online-roster';
await R.init();
test('Kite has distinct hot-hatch calibration and drives only front wheels, including with the handbrake',()=>{
 const w=new R.World({x:0,y:-9.81,z:0});w.timestep=1/60;w.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('kite'),{body,controller}=createVehiclePhysics(R,w,'kite',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 const step=()=>{stepVehiclePhysics(body,controller,'kite',spec,s,1/60);w.step();};
 try{body.setTranslation({x:0,y:1,z:0},true);for(let i=0;i<120;i++)step();s.input.throttle=1;step();assert.ok(controller.wheelEngineForce(0)!>0&&controller.wheelEngineForce(1)!>0);assert.equal(controller.wheelEngineForce(2),0);assert.equal(controller.wheelEngineForce(3),0);
 s.input.handbrake=true;step();assert.ok(controller.wheelEngineForce(0)!>0);assert.ok(controller.wheelBrake(2)!>0);
 assert.equal(vehicleDrivetrain('kite'),'FWD');assert.deepEqual(gridPool('kite','fwd'),['tern','kite']);assert.ok(spec.speedLimit>vehicleSpecification('tern').speedLimit);assert.ok(spec.mass>vehicleSpecification('tern').mass);
 }finally{w.free();}
});
test('base online roster remains fourteen while the protocol recognizes Kite',()=>{assert.equal(ONLINE_CARS.length,14);assert.equal(validOnlineCar('kite'),true);assert.equal(validOnlineCar('trail'),true);});
