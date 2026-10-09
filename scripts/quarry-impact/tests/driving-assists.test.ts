import test from 'node:test';import assert from 'node:assert/strict';
import {transform} from 'esbuild';import R from '@dimforge/rapier3d-compat';
import * as Physics from '../src/vehicle-physics';
import {CAR_KINDS,type CarKind} from '../src/rules';import {stockSetup} from '../src/garage';
import {defaultControls,readControls,drivingInput,CONTROLS_KEY} from '../src/driving-controls';
import {DEFAULT_ASSISTS,validDrivingAssists,limitTractionForce,type AssistLevel} from '../src/driving-assists';
import {exportSave,readSave,restoreSave} from '../src/save-backup';
import {readDrivingAssistsPrevious} from './driving-assists-invariants';
await R.init();const dt=1/60;
const before=readDrivingAssistsPrevious('src/vehicle-physics.ts').toString();
const compiled=await transform(before.replace(/from\s*['"]([^'"]+)['"]/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});
const prior=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
function rig(kind:CarKind,api:typeof Physics=Physics){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const setup=stockSetup(kind);setup.engine=3;const spec=api.vehicleSpecification(kind,setup),car=api.createVehiclePhysics(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:1.3,z:0},true);
 const state:Physics.PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 return{world,car,state,step(){api.stepVehiclePhysics(car.body,car.controller,kind,spec,state,dt);world.step();},free(){world.free();}};
}
test('every chassis keeps its exact pre-assist trajectory when preferences are absent or at defaults',()=>{
 // The pre-assist fixture predates the Regent and Trail chassis.
 for(const kind of CAR_KINDS.filter(k=>k!=='regent'&&k!=='trail')){const a=rig(kind,prior),b=rig(kind),c=rig(kind);try{
  for(let i=0;i<540;i++){const input={throttle:i>=120&&i<400?1:i>=480?-.6:0,brake:i>=400&&i<480?1:0,steer:i>=240&&i<380?.3:0,handbrake:i>=360&&i<385};
   a.state.input=input;b.state.input=input;c.state.input={...input,assists:{...DEFAULT_ASSISTS}};
   for(const r of [a,b,c])r.step();for(const r of [b,c]){assert.deepEqual(r.car.body.translation(),a.car.body.translation(),kind+' tick '+i);assert.deepEqual(r.car.body.rotation(),a.car.body.rotation());}
  }
 }finally{a.free();b.free();c.free();}}
});
test('traction levels reduce actual driven-wheel force during a sideways slide on every chassis, without changing steering or adding power',()=>{
 for(const kind of CAR_KINDS){const rows=[];for(const level of [0,.5,1]as const){const r=rig(kind);try{
  for(let i=0;i<180;i++)r.step();r.car.body.setLinvel({x:14,y:0,z:12},true);r.state.input={throttle:1,steer:0,brake:0,handbrake:false,assists:{traction:level,stability:1}};r.step();
  rows.push({force:Array.from({length:4},(_,i)=>r.car.controller.wheelEngineForce(i)??0).reduce((a,b)=>a+b,0),steer:r.state.steering});
 }finally{r.free();}}
 assert.ok(rows[0].force>rows[1].force&&rows[1].force>rows[2].force,JSON.stringify({kind,rows}));assert.ok(rows[2].force>=0);assert.equal(rows[0].steer,rows[2].steer);
 }
});
test('stability levels produce ordered physical yaw recovery after a disturbance across all twelve vehicles',()=>{
 for(const kind of CAR_KINDS){const yaw=[];for(const level of [0,.5,1]as const){const r=rig(kind);try{
  for(let i=0;i<180;i++)r.step();r.car.body.setLinvel({x:0,y:0,z:20},true);r.car.body.setAngvel({x:0,y:1.8,z:0},true);r.state.input.assists={traction:0,stability:level};let integrated=0;
  for(let i=0;i<180;i++){r.step();integrated+=Math.abs(r.car.body.angvel().y)*dt;}yaw.push(integrated);
 }finally{r.free();}}assert.ok(yaw[0]>yaw[1]&&yaw[1]>yaw[2],JSON.stringify({kind,yaw}));}
});
test('traction only removes demand, retains reverse sign, and handles unloaded wheels and available grip',()=>{
 for(const force of [-12000,0,12000])for(const level of [0,.5,1]as const)for(const contact of [false,true]){
  const result=limitTractionForce(force,level,contact,3500,8,'gravel',.8);assert.ok(Math.abs(result)<=Math.abs(force));assert.ok(result===0||Math.sign(result)===Math.sign(force));
  if(!contact&&level===1)assert.equal(result,0);if(level===0)assert.equal(result,force);
 }
 assert.equal(limitTractionForce(200,1,true,3500,0,'asphalt',1),200);
});
test('handbrake remains deliberate and traction settings cannot release its rear-wheel braking',()=>{
 for(const kind of ['coupe','tern']as const){const rows=[];for(const level of [0,1]as const){const r=rig(kind);try{for(let i=0;i<180;i++)r.step();r.car.body.setLinvel({x:14,y:0,z:12},true);r.state.input={throttle:1,steer:0,brake:0,handbrake:true,assists:{traction:level,stability:1}};r.step();rows.push(Array.from({length:4},(_,i)=>[r.car.controller.wheelEngineForce(i),r.car.controller.wheelBrake(i)]));}finally{r.free();}}assert.deepEqual(rows[1],rows[0]);}
});
test('saved levels round-trip, default/legacy bytes stay stable, malformed levels are rejected and all input modes use the selection',async()=>{
 const old=defaultControls();assert.deepEqual(readControls(JSON.stringify(old)),old);
 for(const traction of [0,.5,1]as const)for(const stability of [0,.5,1]as const){const config={...old,assists:{traction,stability}},read=readControls(JSON.stringify(config));assert.deepEqual(read.assists??DEFAULT_ASSISTS,config.assists);
  for(const mode of ['automatic','manual','clutch']as const){read.transmission=mode;const input=drivingInput(read,new Set(['KeyW']),[],0);assert.deepEqual(input.assists??DEFAULT_ASSISTS,config.assists);assert.equal(drivingInput(read,new Set(['KeyW']),[],0,true,false).assists,undefined);}
  const values=new Map([[CONTROLS_KEY,JSON.stringify(read)]]),storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}};
  const backup=await readSave(await exportSave(storage));values.clear();await restoreSave(storage,backup);assert.deepEqual(readControls(values.get(CONTROLS_KEY)).assists??DEFAULT_ASSISTS,config.assists);
 }
 for(const invalid of [null,[],{}, {traction:1,stability:1,unexpected:true},{traction:2,stability:1},{traction:NaN,stability:1},{traction:'1',stability:0},{traction:1,stability:-1}]){assert.equal(validDrivingAssists(invalid),false);assert.equal(readControls(JSON.stringify({...old,assists:invalid})).assists,undefined);}
});
