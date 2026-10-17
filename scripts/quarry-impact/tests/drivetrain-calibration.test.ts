import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS} from '../src/rules';
import {createDriveCalibration} from '../src/drivetrain/calibration';
import {createVehicleDrive} from '../src/drivetrain/chassis';
import {stepAutoGear,freshAutoGear,manualDriveGear} from '../src/drivetrain/gearing';
import {createVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
const tuning=(engine=0,gearing=0)=>({engine,tires:0,armor:0,tune:{gearing,suspension:0,steering:0,brakeBias:0,differential:0}});
await R.init();
test('every authored car has finite calibration; upgrades add torque and shorter gearing does not invent engine power',()=>{
 const torques=new Set<number>();
 for(const kind of CAR_KINDS){
  const calibrate=createDriveCalibration(kind),stock=calibrate(vehicleSpecification(kind)),upgrade=calibrate(vehicleSpecification(kind,tuning(3))),short=calibrate(vehicleSpecification(kind,tuning(0,1))),long=calibrate(vehicleSpecification(kind,tuning(0,-1)));
  torques.add(stock.engine.peakTorque);assert.ok(stock.engine.peakTorque>50&&stock.ratioScale>0);
  assert.ok(upgrade.engine.peakTorque>stock.engine.peakTorque*1.3);
  assert.ok(Math.abs(short.engine.peakTorque-stock.engine.peakTorque)<1e-8);assert.ok(Math.abs(long.engine.peakTorque-stock.engine.peakTorque)<1e-8);
  assert.ok(short.ratioScale>stock.ratioScale&&long.ratioScale<stock.ratioScale);
  assert.ok(upgrade.engine.clutchTorque>stock.engine.clutchTorque);
 }
 assert.ok(torques.size>8,'authored roster does not share one engine');
});
test('manual and automatic use the same final drive, including road-RPM shift decisions',()=>{
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:16,slip:0,surface:'asphalt',gear:1,rpm:5500,input:{throttle:1,brake:0,steer:0,handbrake:false}};
 const short=freshAutoGear(),long=freshAutoGear();
 const a=stepAutoGear(short,16,5500,.34,1,1/60,1.22),b=stepAutoGear(long,16,5500,.34,1,1/60,.78);
 assert.equal(short.pending,2);assert.equal(long.pending,null);
 assert.equal(manualDriveGear(state,1.22).ratio,a.ratio);assert.ok(a.ratio>b.ratio);
});
function run(engine:number,gearing:number){
 const kind='coupe',spec=vehicleSpecification(kind,tuning(engine,gearing)),world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(2000,.5,2000).setTranslation(0,-.5,0));
 const {body,controller}=createVehiclePhysics(R,world,kind,spec.mass),drive=createVehicleDrive(body,controller,kind);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:1,steer:0,handbrake:false}};
 try{body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<180;i++){drive.step(spec,state,1/60);world.step();}
 state.input.throttle=1;state.input.brake=0;let atTen=0;
 for(let i=0;i<2400;i++){drive.step(spec,state,1/60);world.step();if(i===599)atTen=state.speed;assert.ok(Number.isFinite(state.rpm)&&Math.abs(state.rpm)<7500);}
 return{atTen,speed:state.speed,gear:state.gear};
 }finally{world.free();}
}
test('real chassis engine upgrade improves acceleration and final drive changes automatic gear selection',()=>{
 const stock=run(0,0),upgrade=run(3,0),short=run(3,1),long=run(3,-1);
 console.log(JSON.stringify({stock,upgrade,short,long}));
 assert.ok(upgrade.atTen>stock.atTen+1,'upgraded car accelerates faster despite added engine mass');
 assert.ok(short.gear>long.gear,'short final drive reaches higher numbered gears at similar road speed');
 assert.ok(Math.abs(short.speed-long.speed)>.5,'final-drive choice changes the powered equilibrium rather than a cosmetic gear label');
 assert.ok(short.speed>25&&long.speed>35);
});
