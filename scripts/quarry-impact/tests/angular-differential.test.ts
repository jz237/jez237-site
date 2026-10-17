import test from 'node:test';import assert from 'node:assert/strict';
import {axleTorques} from '../src/drivetrain/differential';import {stepWheel} from '../src/drivetrain/wheel';
test('coupling conserves angular momentum and dissipates energy with unequal wheel inertia',()=>{
 for(const direction of [-1,1])for(const setting of [-1,0,1])for(const dt of [1/30,1/60,1/120]){
  const w=[{omega:direction*60,angle:0},{omega:direction*5,angle:0}],inertia=[1,2],before=w.reduce((s,w,i)=>s+w.omega*inertia[i],0),energy=w.reduce((s,w,i)=>s+.5*w.omega*w.omega*inertia[i],0);
  const torques=axleTorques(w,[0,0],inertia,setting,dt);assert.ok(Math.abs(torques[0]+torques[1])<1e-9);
  const after=w.map((w,i)=>w.omega+torques[i]*dt/inertia[i]);
  assert.ok(Math.abs(after.reduce((s,v,i)=>s+v*inertia[i],0)-before)<1e-9);assert.ok(after.reduce((s,v,i)=>s+.5*v*v*inertia[i],0)<=energy+1e-9);
  if(setting===-1)assert.deepEqual(torques,[0,0]);else assert.ok(Math.abs(after[0]-after[1])<55);
 }
});
function splitContact(setting:number,hz:number){
 const w=[{omega:0,angle:0},{omega:0,angle:0}],dt=1/hz;let traction=0;
 for(let tick=0;tick<hz*2;tick++){
  const torques=axleTorques(w,[300,300],[1.5,1.5],setting,dt);
  for(let i=0;i<2;i++){
   const result=stepWheel(w[i],{dt,radius:.34,inertia:1.5,driveTorque:torques[i],brakeTorque:0,grounded:i===1,speed:0,inverseMass:0,normalLoad:i===1?4000:0,friction:1,lateralImpulse:0});
   if(i===1)traction+=result.impulse;
  }
 }
 return{traction,difference:Math.abs(w[0].omega-w[1].omega)};
}
test('locking transfers drive from an airborne wheel to a grounded wheel across timestep rates',()=>{
 for(const hz of [30,60,120]){
  const open=splitContact(-1,hz),medium=splitContact(0,hz),locked=splitContact(1,hz);
  console.log(JSON.stringify({hz,open,medium,locked}));
  assert.ok(locked.traction>open.traction*1.5);assert.ok(medium.traction>open.traction);
  assert.ok(locked.difference<open.difference*.1);assert.ok(medium.difference<open.difference);
 }
});
test('no coupling torque when both axle wheels already turn together',()=>{
 assert.deepEqual(axleTorques([{omega:10,angle:0},{omega:10,angle:0}],[300,300],[1.5,1.5],1,1/60),[300,300]);
});

import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';
import {createVehicleDrive} from '../src/drivetrain/chassis';
await R.init();
function actualAxle(kind:'coupe'|'tern'|'trail',setting:number){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 const left=world.createCollider(R.ColliderDesc.cuboid(100,.5,200).setTranslation(-100,-.5,0));world.createCollider(R.ColliderDesc.cuboid(100,.5,200).setTranslation(100,-.5,0));
 const spec=vehicleSpecification(kind);spec.differential=setting;
 const {body,controller}=createVehiclePhysics(R,world,kind,spec.mass),drive=createVehicleDrive(body,controller,kind);
 const state={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 try{
  body.setTranslation({x:0,y:1.2,z:0},true);for(let tick=0;tick<180;tick++){stepVehiclePhysics(body,controller,kind,spec,state,1/60);world.step();}
  body.setEnabledTranslations(false,false,false,true);body.setEnabledRotations(false,false,false,true);body.setLinvel({x:0,y:0,z:0},true);body.setAngvel({x:0,y:0,z:0},true);
  world.removeCollider(left,true);state.input.throttle=1;
  for(let tick=0;tick<180;tick++){drive.step(spec,state,1/60);world.step();}
  assert.deepEqual([0,1,2,3].map(i=>!!controller.wheelIsInContact(i)),[false,true,false,true]);
  const axle=kind==='coupe'?2:0;
  return Math.abs(drive.wheels[axle].omega-drive.wheels[axle+1].omega);
 }finally{world.free();}
}
test('garage lock reaches the driven axle of real FWD, RWD and AWD chassis',()=>{
 for(const kind of ['coupe','tern','trail']as const){const open=actualAxle(kind,-1),locked=actualAxle(kind,1);console.log(JSON.stringify({kind,open,locked}));assert.ok(locked<open*.5,kind+' lock controls unloaded-wheel spin');}
});
