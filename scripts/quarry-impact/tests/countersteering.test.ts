import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {steeringSpeedScale} from '../src/countersteering';import {CAR_KINDS} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
test('countersteering relief is symmetric, smooth, bounded and absent during normal driving or reversing',()=>{
 for(const speed of [0,3,5,10,25,50])for(const lateral of [0,.1,1,3,6,15]){
  const normal=1/(1+speed*.016),scale=steeringSpeedScale(speed,lateral,1,-1);
  assert.ok(scale>=normal&&scale<=1);assert.equal(scale,steeringSpeedScale(speed,-lateral,-1,1));
  assert.equal(steeringSpeedScale(speed,lateral,-1,-1),normal);assert.equal(steeringSpeedScale(speed,lateral,0,-1),normal);
  assert.equal(steeringSpeedScale(-speed,lateral,1,-1),normal);
 }
 assert.equal(steeringSpeedScale(30,10,1,0),1/1.48);assert.equal(steeringSpeedScale(30,10,1,1),1/1.48);
 const values=Array.from({length:1001},(_,i)=>steeringSpeedScale(30,i*.01,1,-1));
 for(let i=1;i<values.length;i++){assert.ok(values[i]>=values[i-1]);assert.ok(values[i]-values[i-1]<.002);}
 assert.equal(steeringSpeedScale(30,0,1,-1),1/1.48);assert.equal(steeringSpeedScale(30,10,1,-1),1);
});
test('all chassis send additional corrective travel to actual front wheels with mirrored slide directions',()=>{
 for(const kind of CAR_KINDS)for(const side of [-1,1]){
  const world=new R.World({x:0,y:0,z:0}),spec=vehicleSpecification(kind),{body,controller}=createVehiclePhysics(R,world,kind,spec.mass);
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,brake:0,steer:side,handbrake:false,assists:{traction:0,stability:0}}};
  try{
   body.setLinvel({x:side*10,y:0,z:30},true);body.setAngvel({x:0,y:-side*1.2,z:0},true);stepVehiclePhysics(body,controller,kind,spec,state,1/60);const corrective=Math.abs(controller.wheelSteering(0)!);
   state.steering=0;state.input.steer=-side;stepVehiclePhysics(body,controller,kind,spec,state,1/60);const worsening=Math.abs(controller.wheelSteering(0)!);
   assert.ok(corrective>worsening*1.4,kind);assert.equal(controller.wheelSteering(0),controller.wheelSteering(1));assert.equal(controller.wheelSteering(2),0);
   state.steering=0;state.input.steer=0;stepVehiclePhysics(body,controller,kind,spec,state,1/60);assert.equal(state.steering,0,'no automatic correction');
  }finally{world.free();}
 }
});
