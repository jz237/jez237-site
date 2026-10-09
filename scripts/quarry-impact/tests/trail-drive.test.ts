import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,vehicleSuspensionTravel,vehicleSuspensionRestLength,type PhysicsState} from '../src/vehicle-physics';
import {vehicleDrivetrain} from '../src/grid-rules';
await R.init();
test('Trail drives all four wheels, retains front drive under handbrake, and disconnects all engine braking with clutch or neutral',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));const spec=vehicleSpecification('trail'),{body,controller}=createVehiclePhysics(R,world,'trail',spec.mass);
 const s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 const step=()=>{stepVehiclePhysics(body,controller,'trail',spec,s,1/60);world.step();},forces=()=>[0,1,2,3].map(i=>controller.wheelEngineForce(i)!),brakes=()=>[0,1,2,3].map(i=>controller.wheelBrake(i)!);
 try{assert.equal(vehicleDrivetrain('trail'),'AWD');assert.equal(vehicleSuspensionTravel('trail'),.28);assert.equal(vehicleSuspensionRestLength('trail'),.40);body.setTranslation({x:0,y:1.3,z:0},true);for(let i=0;i<120;i++)step();s.input.throttle=1;step();assert.ok(forces().every(f=>f>0));assert.ok(Math.abs(forces()[0]-forces()[2])<1e-6);
 s.input.handbrake=true;step();assert.ok(forces()[0]>0&&forces()[1]>0);assert.deepEqual(forces().slice(2),[0,0]);assert.ok(brakes()[2]>=100&&brakes()[3]>=100);
 s.input={throttle:0,brake:0,steer:0,handbrake:false,transmission:{mode:'clutch',up:false,down:false,clutch:0}};s.gear=2;body.setLinvel({x:0,y:0,z:20},true);step();assert.ok(brakes().every(b=>b>0));s.input.transmission!.clutch=1;step();assert.deepEqual(brakes(),[0,0,0,0]);s.input.transmission!.clutch=0;s.gear=-1;step();assert.deepEqual(brakes(),[0,0,0,0]);
 }finally{world.free();}
});
