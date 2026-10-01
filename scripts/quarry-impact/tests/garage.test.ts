import {verifyGarageRevision} from './garage-invariants.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import { templates } from '../src/assets.ts';
import { Vehicle } from '../src/vehicle.ts';
import { axleDrive, exportSetup, importSetup, normalizeSetup, readGarage, setupPhysics, stockSetup, type Setup } from '../src/garage.ts';
await R.init();
const model = new T.Group();
for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}
for(const kind of ['coupe','sedan','hatch'] as const)templates.set(kind,model);
const fx={emit(){},mark(){},detach(){}} as any;

test('corrupt, old, partial and hostile saves cannot inject invalid physics or HTML',()=>{
  for(const data of [null,'null','[]','broken','{"version":99,"cars":{}}'])assert.deepEqual(readGarage(data),readGarage());
  const setup=normalizeSetup({paint:-7,trim:Infinity,engine:42,tires:'3',armor:NaN,tune:{gearing:Infinity,suspension:-8}},'coupe');
  assert.equal(setup.paint,0);assert.equal(setup.trim,0x202529);assert.equal(setup.engine,3);assert.equal(setup.tires,0);
  assert.equal(setup.tune.gearing,0);assert.equal(setup.tune.suspension,-1);
  const garage=readGarage(JSON.stringify({version:1,cars:{coupe:{setup,presets:Array.from({length:40},()=>({name:'a'.repeat(80),setup}))}}}));
  assert.equal(garage.cars.coupe.presets.length,8);assert.equal(garage.cars.coupe.presets[0].name.length,32);
  assert.deepEqual(garage.cars.sedan.setup,stockSetup('sedan'));
});
test('setup exchange preserves values and rejects foreign cars, versions and oversized data',()=>{
  const setup=stockSetup('hatch');setup.engine=2;setup.paint=0xf06020;setup.tune.gearing=.65;
  assert.deepEqual(importSetup(exportSetup('hatch',setup),'hatch'),setup);
  assert.throws(()=>importSetup(exportSetup('hatch',setup),'coupe'),/matching car/);
  for(const value of ['{}','null','[]','invalid',JSON.stringify({format:'quarry-impact-setup',version:2,car:'hatch'})])assert.throws(()=>importSetup(value,'hatch'));
  assert.throws(()=>importSetup(' '.repeat(65537),'hatch'),/too large/);
});
test('stock specifications preserve base handling and upgrades expose meaningful tradeoffs',()=>{
  const stock=setupPhysics('coupe',stockSetup('coupe'));
  assert.equal(stock.mass,1480);assert.equal(stock.force,11300);assert.equal(stock.spring,1);assert.equal(stock.damageScale,1);
  const tuned=stockSetup('coupe');tuned.engine=3;tuned.armor=3;tuned.tune.gearing=1;
  const spec=setupPhysics('coupe',tuned);
  assert.ok(spec.mass>stock.mass);assert.ok(spec.force>stock.force);assert.ok(spec.speedLimit<stock.speedLimit);assert.ok(spec.damageScale<stock.damageScale);
  assert.deepEqual(axleDrive(-1,true,false),[.09999999999999998,.09999999999999998]);
  assert.deepEqual(axleDrive(1,true,false),[.9,.09999999999999998]);
  assert.deepEqual(axleDrive(1,true,true),[.5,.5]);
});
function rig(setup?:Setup) {
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
  const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,fx,setup);car.place(0,0,0);
  const step=(n:number)=>{for(let i=0;i<n;i++){car.preStep(1/60);world.step();car.postStep(1/60,i/60);}};
  step(120);
  return {car,step,dispose(){car.dispose();world.free();}};
}
test('real Rapier cars accelerate faster with an engine upgrade and carry armor mass',()=>{
  const speeds=[];
  for(const level of [0,3]){
    const setup=stockSetup('coupe');setup.engine=level;
    const r=rig(setup);r.car.input={throttle:1,brake:0,steer:0,handbrake:false};r.step(180);speeds.push(r.car.speed);r.dispose();
  }
  assert.ok(speeds[1]>speeds[0]*1.12,JSON.stringify(speeds));
  const armor=stockSetup('coupe');armor.armor=3;const r=rig(armor);
  assert.ok(Math.abs(r.car.body.mass()-1765)<.01);
  r.car.hit(new T.Vector3(0,1,2),new T.Vector3(0,0,-1),25,1);
  assert.ok(r.car.health>83 && r.car.health<85);
  r.dispose();
});
test('actual suspension, tire grip, axle brakes and steering respond and survive repair',()=>{
  const setup=stockSetup('coupe');setup.tires=3;setup.tune.suspension=1;setup.tune.brakeBias=1;setup.tune.steering=1;
  const r=rig(setup);r.car.input={throttle:0,brake:1,steer:1,handbrake:false};r.step(60);
  assert.ok(r.car.controller.wheelBrake(0)!>r.car.controller.wheelBrake(2)!);
  assert.ok(r.car.controller.wheelSuspensionStiffness(0)!>39);
  assert.ok(r.car.controller.wheelFrictionSlip(0)!>2.7);
  assert.ok(r.car.controller.wheelSteering(0)!>.6);
  r.car.repair();r.step(1);
  assert.ok(r.car.controller.wheelSuspensionStiffness(0)!>39);
  assert.equal(r.car.setup.engine,0);r.dispose();
});
test('explicit stock setup retains the same trajectory as the legacy constructor',()=>{
  const values=[];
  for(const setup of [undefined,stockSetup('coupe')]){
    const r=rig(setup);r.car.input={throttle:1,brake:0,steer:.2,handbrake:false};r.step(180);values.push(r.car.current.clone());r.dispose();
  }
  assert.ok(values[0].distanceTo(values[1])<.001);
});

test('garage changes retain exact recoverable baseline bytes for historical release audits', verifyGarageRevision);
