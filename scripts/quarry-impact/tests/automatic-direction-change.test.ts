import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';import {createVehicleDrive} from '../src/drivetrain/chassis';import {freshAutoGear,stepAutoGear} from '../src/drivetrain/gearing';
import {Simulation} from '../multiplayer/simulation';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
await R.init();
test('automatic direction change disconnects the old gear until near stopped',()=>{
 const gear=freshAutoGear();const forward=stepAutoGear(gear,12,4000,.34,-1,1/60);assert.equal(forward.clutch,0);assert.equal(forward.allowThrottle,false);assert.equal(gear.gear,1);
 assert.equal(stepAutoGear(gear,0,900,.34,-1,1/60).ratio,-12);
 assert.equal(stepAutoGear(gear,-5,1000,.34,1,1/60).clutch,0);assert.equal(gear.gear,-1);
 assert.equal(stepAutoGear(gear,0,900,.34,1,1/60).ratio,12);
});
test('real chassis stops and changes direction without a separate brake command',()=>{
 for(const hz of [30,60,120])for(const initial of [-1,1]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/hz;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
  const spec=vehicleSpecification('coupe'),{body,controller}=createVehiclePhysics(R,world,'coupe',spec.mass),drive=createVehicleDrive(body,controller,'coupe');
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  const step=()=>{drive.step(spec,state,1/hz);world.step();};
  try{
   body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<2*hz;i++)step();
   state.input.throttle=initial;for(let i=0;i<3*hz;i++)step();assert.ok(state.speed*initial>4);
   state.input.throttle=-initial;let switched=false;
   for(let i=0;i<8*hz;i++){const speed=state.speed,old=Math.sign(drive.gearbox.gear);step();if(Math.sign(drive.gearbox.gear)!==old){assert.ok(Math.abs(speed)<1,'no gear slam while moving fast');switched=true;}}
   assert.ok(switched);assert.ok(state.speed*-initial>4,`${hz}Hz ${initial}: ${state.speed}`);assert.equal(state.input.brake,0,'input remains owned by caller');
  }finally{world.free();}
 }
});
test('Holloway field finishes after reverse escapes instead of idling backward indefinitely',()=>{
 const s=new Simulation(R,'race',Array(8).fill('coupe'),8,[],{...DEFAULT_ONLINE_EVENT,course:'holloway-stadium-v1',laps:1},123,'angular-v1');
 try{s.phase='playing';for(let i=0;i<120*60&&s.phase==='playing';i++)s.step(new Set());assert.equal(s.phase,'result');assert.ok(s.cars.every(c=>c.state.finished));console.log(JSON.stringify({course:s.course.id,seconds:s.elapsed,penalties:s.cars.map(c=>c.state.penalty)}));}finally{s.dispose();}
});
