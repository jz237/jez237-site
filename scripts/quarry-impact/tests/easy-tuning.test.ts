import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS} from '../src/rules';
import {applyEasyTune,customSuspension,EASY_TUNE_KEYS} from '../src/easy-tuning';
import {stockSetup,normalizeSetup,readGarage,exportSetup,importSetup,GARAGE_KEY} from '../src/garage';
import {exportSave,readSave} from '../src/save-backup';
import {vehicleSpecification,createVehiclePhysics,stepVehiclePhysics,type PhysicsState} from '../src/vehicle-physics';
import {benchmarkKey} from '../src/setup-benchmark';
await R.init();

test('easy controls preserve paint, upgrades and unrelated advanced settings for every car without mutating the source',()=>{
 for(const kind of CAR_KINDS){
  const setup=stockSetup(kind);Object.assign(setup,{paint:0x3498af,trim:0x125532,engine:2,tires:1,armor:3});Object.assign(setup.tune,{compression:.4,rebound:-.2,rideHeight:.6,brakePressure:.7,steering:.35});const before=structuredClone(setup);
  for(const key of EASY_TUNE_KEYS){const next=applyEasyTune(setup,kind,key,-.5);assert.deepEqual(setup,before);assert.equal(next.tune[key],-.5);assert.deepEqual({...next,tune:undefined},{...setup,tune:undefined});
   for(const field of Object.keys(setup.tune)as (keyof typeof setup.tune)[])if(field!==key&&!(key==='suspension'&&['compression','rebound','rideHeight'].includes(field)))assert.equal(next.tune[field],setup.tune[field]);
   assert.equal(customSuspension(next),key!=='suspension');assert.notEqual(benchmarkKey(kind,next,'gravel'),benchmarkKey(kind,setup,'gravel'));
  }
 }
});
test('easy suspension deliberately returns separate spring adjustments to the linked preset, with neutral keeping stock identity',()=>{
 for(const kind of CAR_KINDS){const stock=stockSetup(kind);assert.deepEqual(applyEasyTune(stock,kind,'suspension',0),stock);const custom=normalizeSetup({...stock,tune:{...stock.tune,compression:1,rebound:1,rideHeight:1}},kind);assert.ok(customSuspension(custom));const reset=applyEasyTune(custom,kind,'suspension',0);assert.deepEqual(reset,stock);assert.ok(!customSuspension(reset));}
});
test('invalid easy inputs cannot poison a saved setup or target advanced-only fields',()=>{
 const setup=stockSetup('regent');for(const value of [NaN,Infinity,-Infinity])assert.deepEqual(applyEasyTune(setup,'regent','suspension',value),setup);
 assert.deepEqual(applyEasyTune(setup,'regent','paint' as any,.5),setup);
 assert.equal(applyEasyTune(setup,'regent','gearing',12).tune.gearing,1);assert.equal(applyEasyTune(setup,'regent','gearing',-12).tune.gearing,-1);
});
test('easy setups survive setup exchange, named presets and portable save round trips in the existing schema',async()=>{
 const garage=readGarage();for(const kind of CAR_KINDS){let s=stockSetup(kind);for(const [key,value]of [['suspension',-.5],['gearing',.35],['differential',.25],['brakeBias',.2]]as const)s=applyEasyTune(s,kind,key,value);assert.deepEqual(importSetup(exportSetup(kind,s),kind),s);garage.cars[kind].setup=s;garage.cars[kind].presets=[{name:'Gravel start',setup:s}];}
 const canonical=readGarage(JSON.stringify(garage));assert.deepEqual(canonical,garage);const backup=await readSave(await exportSave({getItem:key=>key===GARAGE_KEY?JSON.stringify(canonical):null}));assert.deepEqual(readGarage(backup.entries[GARAGE_KEY]),canonical);
});
test('easy suspension and brake balance reach actual wheel stiffness, damping, rest length and axle brake forces',()=>{
 for(const kind of CAR_KINDS){const values=[];
  for(const v of [-1,1]){const setup=applyEasyTune(applyEasyTune(stockSetup(kind),kind,'suspension',v),kind,'brakeBias',v),spec=vehicleSpecification(kind,setup),world=new R.World({x:0,y:-9.81,z:0}),car=createVehiclePhysics(R,world,kind,spec.mass);const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
   try{stepVehiclePhysics(car.body,car.controller,kind,spec,state,1/60);values.push({spring:car.controller.wheelSuspensionStiffness(0)!,compression:car.controller.wheelSuspensionCompression(0)!,rest:car.controller.wheelSuspensionRestLength(0)!,front:car.controller.wheelBrake(0)!,rear:car.controller.wheelBrake(2)!});}finally{world.removeVehicleController(car.controller);world.free();}}
  assert.ok(values[0].spring<values[1].spring,kind);assert.ok(values[0].compression<values[1].compression,kind);assert.ok(values[0].rest>values[1].rest,kind);assert.ok(values[0].front/values[0].rear<values[1].front/values[1].rear,kind);
 }
});
