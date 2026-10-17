import test from 'node:test';import assert from 'node:assert/strict';
import {assistedWheelStep} from '../src/drivetrain/assists';import {stepWheel,type WheelStep} from '../src/drivetrain/wheel';
const base:WheelStep={dt:1/60,radius:.34,inertia:1.5,driveTorque:3000,brakeTorque:0,grounded:true,speed:10,inverseMass:1/1500,normalLoad:4000,friction:.3,lateralImpulse:0};
test('traction assistance reduces real predicted tread slip forwards and backwards, with a partial level',()=>{
 for(const direction of [-1,1]){
  const p={...base,speed:base.speed*direction,driveTorque:base.driveTorque*direction},w={omega:p.speed/p.radius,angle:0};
  const off=assistedWheelStep(w,p,0,0,0),half=assistedWheelStep(w,p,.5,0,0),full=assistedWheelStep(w,p,1,0,0);
  assert.equal(off,p);assert.ok(Math.abs(full.driveTorque)<Math.abs(half.driveTorque)&&Math.abs(half.driveTorque)<Math.abs(off.driveTorque));
  const a=stepWheel({...w},off),b=stepWheel({...w},full);assert.ok(Math.abs(b.slip)<Math.abs(a.slip)*.3);assert.ok(Math.abs(b.slip)<=2.301);
  assert.deepEqual(w,{omega:p.speed/p.radius,angle:0},'prediction never changes live state');
  assert.equal(full.friction,p.friction);assert.equal(full.brakeTorque,p.brakeTorque);
 }
});
test('ABS releases only service brake to avoid lock; low speed and handbrake remain available',()=>{
 for(const direction of [-1,1]){
  const p={...base,speed:20*direction,driveTorque:0,brakeTorque:8000},w={omega:p.speed/p.radius,angle:0};
  const off=stepWheel({...w},p),controlled=assistedWheelStep(w,p,0,1,8000),on=stepWheel({...w},controlled);
  assert.equal(off.omega,0);assert.ok(Math.abs(on.omega)>40);assert.ok(Math.abs(on.slip)<=3.801);assert.ok(controlled.brakeTorque>0&&controlled.brakeTorque<8000);
  assert.equal(assistedWheelStep(w,p,1,1,8000,true),p);
  const low={...p,speed:.5*direction};assert.equal(assistedWheelStep(w,low,0,1,8000).brakeTorque,8000);
 }
});
test('airborne traction cuts demand without inventing a contact or erasing existing spin',()=>{
 const p={...base,grounded:false},w={omega:60,angle:3},a=assistedWheelStep(w,p,1,0,0);
 assert.equal(a.driveTorque,0);assert.equal(a.grounded,false);assert.deepEqual(w,{omega:60,angle:3});
 const coast={...base,driveTorque:-100};assert.equal(assistedWheelStep(w,coast,1,0,0).driveTorque,-100,'engine braking remains');
});

import R from '@dimforge/rapier3d-compat';import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';import {createVehicleDrive} from '../src/drivetrain/chassis';
await R.init();
function actual(assisted:boolean,braking:boolean){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(300,.5,300).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('coupe'),{body,controller}=createVehiclePhysics(R,world,'coupe',spec.mass),drive=createVehicleDrive(body,controller,'coupe');
 const state={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel' as const,gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false,assists:{traction:assisted?1 as const:0 as const,abs:assisted?1 as const:0 as const,stability:1 as const}}};
 try{
  body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<180;i++){stepVehiclePhysics(body,controller,'coupe',spec,state,1/60);world.step();}
  if(braking){body.setLinvel({x:0,y:0,z:20},true);drive.reset(20);state.input.brake=1;}else state.input.throttle=1;
  let slip=0;
  for(let i=0;i<60;i++){const result=drive.step(spec,state,1/60);world.step();slip+=Math.abs(result.slips[braking?0:2]);}
  return{slip,speed:state.speed};
 }finally{world.free();}
}
test('saved assist levels reach actual chassis acceleration and braking',()=>{
 const launchOff=actual(false,false),launchOn=actual(true,false),brakeOff=actual(false,true),brakeOn=actual(true,true);console.log(JSON.stringify({launchOff,launchOn,brakeOff,brakeOn}));
 assert.ok(launchOn.slip<launchOff.slip*.5);assert.ok(launchOn.speed>1,'traction control retains usable acceleration');
 assert.ok(brakeOn.slip<brakeOff.slip*.5);assert.ok(brakeOn.speed<19,'ABS retains braking');
});
