import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
// Weightless and clear of the ground, the tyres touch nothing: only the yaw assist acts on a spinning car.
function spinAfter(slickGrip?:number[]){
 const w=new R.World({x:0,y:0,z:0});w.timestep=1/60;
 const spec=vehicleSpecification('coupe'),{body,controller}=createVehiclePhysics(R,w,'coupe',spec.mass),s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:15,slip:0,steering:0,surface:'asphalt',gear:3,rpm:3000,...(slickGrip?{slickGrip}:{}),input:{throttle:0,brake:0,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:20,z:0},true);body.setAngvel({x:0,y:1.5,z:0},true);
  for(let i=0;i<30;i++){stepVehiclePhysics(body,controller,'coupe',spec,s,1/60);w.step();}
  return body.angvel().y;}finally{w.free();}
}
test('rear tyres sliding (slickGrip below 1) leave a spinning car more of its spin; full grip is exactly as before',()=>{
 const before=spinAfter(),full=spinAfter([1,1,1,1]),sliding=spinAfter([1,1,.3,.3]),front=spinAfter([.3,.3,1,1]);
 assert.equal(full,before,'full grip changes nothing');assert.equal(front,before,'only the rear tyres count');
 assert.ok(before<1.2,`the assist checks a spin (${before})`);assert.ok(sliding>before+.1,`${sliding} > ${before}`);
});
