import {transform} from 'esbuild';import {readAbsPrevious} from './abs-invariants';
import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';import * as Physics from '../src/vehicle-physics';
import {CAR_KINDS,type CarKind} from '../src/rules';import {stockSetup} from '../src/garage';
import {defaultControls,readControls,drivingInput,CONTROLS_KEY} from '../src/driving-controls';
import {limitBrakeImpulse,validDrivingAssists} from '../src/driving-assists';
import {exportSave,readSave,restoreSave} from '../src/save-backup';
await R.init();const dt=1/60;
const before=readAbsPrevious('src/vehicle-physics.ts').toString();
const compiled=await transform(before.replace(/from\s*['"]([^'"]+)['"]/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});
const prior=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
function rig(kind:CarKind,api:typeof Physics=Physics){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const setup=stockSetup(kind);setup.tune.brakePressure=1;const spec=api.vehicleSpecification(kind,setup),car=api.createVehiclePhysics(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:1.3,z:0},true);
 const state:Physics.PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 return{world,car,state,step(){api.stepVehiclePhysics(car.body,car.controller,kind,spec,state,dt);world.step();},free(){world.free();}};
}

test('ABS levels ease actual wheel brake pressure under limited grip on every chassis',()=>{
 for(const kind of CAR_KINDS){const rows=[];for(const abs of [0,.5,1]as const){const r=rig(kind);try{
  for(let i=0;i<180;i++)r.step();r.car.body.setLinvel({x:12,y:0,z:22},true);r.state.input={throttle:0,steer:.5,brake:1,handbrake:false,assists:{traction:0,stability:0,abs}};
  let pressure=0;for(let i=0;i<40;i++){r.step();for(let w=0;w<4;w++)pressure+=r.car.controller.wheelBrake(w)??0;}
  rows.push(pressure);assert.ok(r.state.speed<22,'Braking decelerates '+kind);assert.ok(Number.isFinite(r.car.body.translation().x));
 }finally{r.free();}}assert.ok(rows[0]>rows[1]&&rows[1]>rows[2],JSON.stringify({kind,rows}));}
});
test('ABS does not release a deliberate rear handbrake, dead-car brakes or low-speed stopping',()=>{
 for(const kind of CAR_KINDS)for(const scenario of ['handbrake','stopped','dead']as const){const values=[];for(const abs of [0,1]as const){const r=rig(kind);try{
  for(let i=0;i<180;i++)r.step();r.car.body.setLinvel({x:12,y:0,z:scenario==='stopped'?0:22},true);if(scenario==='dead')r.state.health=0;
  r.state.input={throttle:0,steer:0,brake:1,handbrake:scenario==='handbrake',assists:{traction:0,stability:1,abs}};r.step();values.push(Array.from({length:4},(_,i)=>r.car.controller.wheelBrake(i)));
 }finally{r.free();}}assert.deepEqual(scenario==='handbrake'?values[1].slice(2):values[1],scenario==='handbrake'?values[0].slice(2):values[0],kind+' '+scenario);}
});
test('brake assistance is bounded, timestep-aware, supports reverse and never invents grip',()=>{
 for(const speed of [-20,20])for(const contact of [false,true])for(const dt of [1/120,1/60,1/30]){
  const off=limitBrakeImpulse(150,0,contact,1000,1,10,speed,dt),half=limitBrakeImpulse(150,.5,contact,1000,1,10,speed,dt),full=limitBrakeImpulse(150,1,contact,1000,1,10,speed,dt);
  assert.equal(off,150);assert.ok(full>=0&&full<=half&&half<=off);if(!contact)assert.equal(full,0);
 }
 assert.equal(limitBrakeImpulse(5,1,true,6000,3.2,0,20,1/60),5);
 assert.equal(limitBrakeImpulse(150,1,true,0,1,0,1,1/60),150);
});
test('ABS settings survive reload and backup in all control modes without changing legacy defaults',async()=>{
 const old=defaultControls();assert.deepEqual(readControls(JSON.stringify(old)),old);
 for(const abs of [0,.5,1]as const)for(const mode of ['automatic','manual','clutch']as const){
  const config={...old,transmission:mode,assists:{traction:0 as const,stability:1 as const,abs}},read=readControls(JSON.stringify(config));assert.equal(read.assists?.abs??0,abs);
  assert.equal(drivingInput(read,new Set(['KeyS']),[],20).assists?.abs??0,abs);
  assert.equal(drivingInput(read,new Set(['KeyS']),[],20,true,false).assists,undefined);
  const values=new Map([[CONTROLS_KEY,JSON.stringify(read)]]),storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}};
  const backup=await readSave(await exportSave(storage));values.clear();await restoreSave(storage,backup);assert.equal(readControls(values.get(CONTROLS_KEY)).assists?.abs??0,abs);
 }
 for(const abs of [null,-1,2,'1',NaN])assert.equal(validDrivingAssists({traction:0,stability:1,abs}),false);
});
test('every chassis keeps its exact pre-ABS trajectory when preferences are absent or at defaults',()=>{
 for(const kind of CAR_KINDS){const a=rig(kind,prior),b=rig(kind),c=rig(kind);try{
  for(let i=0;i<540;i++){const input={throttle:i>=120&&i<400?1:i>=480?-.6:0,brake:i>=400&&i<480?1:0,steer:i>=240&&i<380?.3:0,handbrake:i>=360&&i<385};
   a.state.input=input;b.state.input=input;c.state.input={...input,assists:{traction:0,stability:1,abs:0}};
   for(const r of [a,b,c])r.step();for(const r of [b,c]){assert.deepEqual(r.car.body.translation(),a.car.body.translation(),kind+' tick '+i);assert.deepEqual(r.car.body.rotation(),a.car.body.rotation());}
  }
 }finally{a.free();b.free();c.free();}}
});
