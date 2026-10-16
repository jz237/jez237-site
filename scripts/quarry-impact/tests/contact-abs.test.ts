import test from 'node:test';import assert from 'node:assert/strict';import {CAR_KINDS} from '../src/rules';
import R from '@dimforge/rapier3d-compat';import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';import {wheelContactMotion} from '../src/wheel-contact-motion';
await R.init();
test('ABS speed gating follows each tyre on spins and moving ground across every chassis',()=>{
for(const kind of CAR_KINDS)for(const scenario of ['yaw','moving-ground','stopped']){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 const ground=world.createRigidBody(R.RigidBodyDesc.kinematicVelocityBased());world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0),ground);
 const spec=vehicleSpecification(kind),{body,controller}=createVehiclePhysics(R,world,kind,spec.mass);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<180;i++){body.wakeUp();stepVehiclePhysics(body,controller,kind,spec,state,1/60);world.step();}
 body.setRotation({x:0,y:0,z:0,w:1},true);body.setLinvel({x:0,y:0,z:scenario==='moving-ground'?10:0},true);body.setAngvel({x:0,y:scenario==='yaw'?5:0,z:0},true);ground.setLinvel({x:0,y:0,z:scenario==='moving-ground'?10:0},true);
 // Isolate speed gating under a known lightly loaded contact.
 controller.wheelSuspensionForce=()=>1000;controller.wheelSideImpulse=()=>0;
 state.input.brake=1;state.input.assists={traction:0,stability:0,abs:1};
 stepVehiclePhysics(body,controller,kind,spec,state,1/60);
 for(let i=0;i<4;i++){const motion=wheelContactMotion(body,controller,i,{x:0,y:0,z:1},{x:1,y:0,z:0});const brake=controller.wheelBrake(i)!;assert.ok(controller.wheelIsInContact(i),kind+' loaded contact');if(scenario==='yaw'){assert.ok(Math.abs(motion.longitudinal)>2,kind);assert.ok(brake<90,kind+' rotating tyre gets pressure relief');}else{assert.ok(Math.abs(motion.longitudinal)<.05,kind+' relative contact stays near rest');assert.equal(brake,90,kind+' stationary relative tyre keeps stopping pressure');}}
 world.free();
}

});
