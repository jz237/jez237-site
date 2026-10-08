import test from 'node:test';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {stockSetup,normalizeSetup,readGarage,exportSetup,importSetup,GARAGE_KEY,type Setup} from '../src/garage';
import {exportSave,readSave} from '../src/save-backup';
import * as Physics from '../src/vehicle-physics';
import {simulateSetup,benchmarkKey} from '../src/setup-benchmark';
import {readChassisTuningPrevious} from './chassis-tuning-invariants';
import {copyOnlineSetup,effectiveOnlineSetup,sameOnlineSetup,validOnlineSetup} from '../src/online-setup';
import {Simulation} from '../multiplayer/simulation';
import {REPLAY_STRIDE,encodeReplay,decodeReplay,type ReplayDocument} from '../src/replay-data';
await R.init();
const before=readChassisTuningPrevious('src/vehicle-physics.ts').toString();
const compiled=await transform(before.replace(/from\s*['"]([^'"]+)['"]/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});
const prior=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
const fields=['compression','rebound','rideHeight','brakePressure'] as const;
function rig(kind:CarKind,setup:Setup,api:typeof Physics=Physics){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const spec=api.vehicleSpecification(kind,setup),car=api.createVehiclePhysics(R,world,kind,spec.mass,setup.armor);
 car.body.setTranslation({x:0,y:1.3,z:0},true);
 const state:Physics.PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
 const step=(damage?:number[])=>{api.stepVehiclePhysics(car.body,car.controller,kind,spec,state,1/60,damage);world.step();};
 return{world,car,state,step,free:()=>world.free()};
}
test('all twelve stock and existing tuned chassis retain exact prior physical trajectories',()=>{
 for(const kind of CAR_KINDS)for(const tuned of [false,true]){
  const setup=stockSetup(kind);if(tuned){setup.engine=2;setup.armor=1;setup.tires=2;Object.assign(setup.tune,{gearing:.5,suspension:-.4,brakeBias:.3,differential:.4,steering:.2});}
  assert.deepEqual(Physics.vehicleSpecification(kind,setup),prior.vehicleSpecification(kind,setup),kind);
  const a=rig(kind,setup,prior),b=rig(kind,setup);
  try{for(let i=0;i<720;i++){
   const input={throttle:i>=120&&i<480?1:i>=600?-.6:0,brake:i>=480&&i<600?1:0,steer:i>=240&&i<400?.18:0,handbrake:i>=400&&i<425};
   for(const r of [a,b]){r.state.input=input;r.step(i>=650?[.6,0,.3,0]:undefined);}
   assert.deepEqual(b.car.body.translation(),a.car.body.translation(),`${kind} tuned=${tuned} tick=${i}`);
   assert.deepEqual(b.car.body.rotation(),a.car.body.rotation());
  }}finally{a.free();b.free();}
 }
});
test('new adjustments normalize, retain old stock identity and survive presets, setup sharing and portable backups',async()=>{
 const garage=readGarage(),old=JSON.stringify(garage);
 assert.equal(JSON.stringify(readGarage(old)),old);
 for(const kind of CAR_KINDS){
  const stock=stockSetup(kind),zero=structuredClone(stock);for(const field of fields)zero.tune[field]=0;
  assert.deepEqual(normalizeSetup(zero,kind),stock);
  const setup=structuredClone(stock);Object.assign(setup.tune,{compression:-.35,rebound:.6,rideHeight:.8,brakePressure:.45});
  assert.deepEqual(importSetup(exportSetup(kind,setup),kind),normalizeSetup(setup,kind));
  for(const field of fields){const changed=structuredClone(stock);changed.tune[field]=.5;assert.notEqual(benchmarkKey(kind,changed,'asphalt'),benchmarkKey(kind,stock,'asphalt'));}
  garage.cars[kind].setup=setup;garage.cars[kind].presets=[{name:'Rough road',setup}];
  for(const field of fields){assert.equal(normalizeSetup({tune:{[field]:9}},kind).tune[field],1);assert.equal(normalizeSetup({tune:{[field]:-9}},kind).tune[field],-1);assert.equal(normalizeSetup({tune:{[field]:NaN}},kind).tune[field],undefined);}
 }
 const canonical=readGarage(JSON.stringify(garage));
 const backup=await readSave(await exportSave({getItem:key=>key===GARAGE_KEY?JSON.stringify(canonical):null}));
 assert.deepEqual(readGarage(backup.entries[GARAGE_KEY]),canonical);
});
test('replay exchange retains all four adjustments for every vehicle',()=>{
 for(const kind of CAR_KINDS){
  const setup=stockSetup(kind);Object.assign(setup.tune,{compression:-.35,rebound:.6,rideHeight:.8,brakePressure:.45});
  const frame=new Float32Array(REPLAY_STRIDE);frame[6]=1;frame[14]=100;for(let i=0;i<4;i++)frame[21+i*8]=1;
  const doc:ReplayDocument={meta:{version:1,mode:'race',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-08'},frames:[{time:0,values:frame}],events:[],limited:false};
  assert.deepEqual(decodeReplay(encodeReplay(doc)).meta.cars[0].setup,normalizeSetup(setup,kind));
 }
});
test('pending online authority validates, copies and restores adjustments while stock restrictions remove them',()=>{
 for(const kind of ['coupe','sedan','hatch'] as const){
  const setup=stockSetup(kind);Object.assign(setup.tune,{compression:-.35,rebound:.6,rideHeight:.8,brakePressure:.45});
  assert.ok(validOnlineSetup(setup));assert.ok(!sameOnlineSetup(setup,stockSetup(kind),kind));
  for(const field of fields)for(const value of [undefined,null,NaN,2,-2,'1'])assert.equal(validOnlineSetup({...setup,tune:{...setup.tune,[field]:value}}),false);
  const copied=copyOnlineSetup(setup);for(const key of fields)assert.equal(copied.tune[key],setup.tune[key]);
  const restricted=effectiveOnlineSetup(kind,setup,'stock');for(const field of fields)assert.equal(restricted.tune[field],undefined);
  const zero=stockSetup(kind);for(const field of fields)zero.tune[field]=0;assert.ok(sameOnlineSetup(zero,stockSetup(kind),kind));
  const sim=new Simulation(R,'playground',Array(8).fill(kind),8,[copied]),restored=new Simulation(R,'playground');
  try{restored.restore(sim.snapshot() as any);assert.deepEqual(restored.cars[0].specification,Physics.vehicleSpecification(kind,setup));assert.deepEqual(restored.cars[0].state.setup,copied);}
  finally{sim.dispose();restored.dispose();}
 }
});
test('foot-brake pressure changes actual stopping distance, with chassis-dependent tradeoffs on both surfaces',()=>{
 const results=[];
 for(const kind of CAR_KINDS)for(const surface of ['asphalt','gravel'] as const){
  const measures=[];
  for(const pressure of [-1,1]){const setup=stockSetup(kind);setup.tune.brakePressure=pressure;const run=simulateSetup(kind,setup,surface);let result=run.next();while(!result.done)result=run.next();measures.push(result.value);}
  assert.ok(measures[0].braking!==null&&measures[1].braking!==null,kind);
  // The light buggy has a longer asphalt stop at maximum pressure; the
  // comparison exposes that tradeoff instead of presenting pressure as an upgrade.
  if(kind==='buggy'&&surface==='asphalt')assert.ok(measures[1].braking!>measures[0].braking!&&measures[1].braking!<30);
  else assert.ok(measures[1].braking!<measures[0].braking!-1,JSON.stringify({kind,surface,measures}));
  assert.equal(measures[0].speed,measures[1].speed,'Brake setting does not add engine power');
  results.push({kind,surface,gentle:measures[0].braking,strong:measures[1].braking});
 }
 console.log('Braking measurements '+JSON.stringify(results));
});
test('ride height changes physical clearance and independent dampers change landing motion without changing springs',()=>{
 const results=[];
 for(const kind of CAR_KINDS){
  const runs=[];
  for(const patch of [{rideHeight:-1},{rideHeight:1},{compression:-1},{compression:1},{rebound:-1},{rebound:1}]){
   const setup=stockSetup(kind);Object.assign(setup.tune,patch);const r=rig(kind,setup);
   try{
    for(let i=0;i<300;i++)r.step();const y=r.car.body.translation().y,spring=r.car.controller.wheelSuspensionStiffness(0);
    r.car.body.setTranslation({x:0,y:y+.5,z:0},true);r.car.body.setLinvel({x:0,y:0,z:0},true);let motion=0,min=Infinity;
    for(let i=0;i<180;i++){r.step();motion+=r.car.body.linvel().y**2/60;min=Math.min(min,r.car.body.translation().y);}
    runs.push({patch,y,spring,motion,min,compression:r.car.controller.wheelSuspensionCompression(0)!,rebound:r.car.controller.wheelSuspensionRelaxation(0)!});assert.ok(Number.isFinite(motion)&&r.car.body.translation().y>0,kind);
   }finally{r.free();}
  }
  assert.ok(runs[1].y-runs[0].y>.09,JSON.stringify({kind,runs}));
  assert.equal(new Set(runs.map(r=>r.spring)).size,1,'The independent controls do not change spring stiffness');
  assert.ok(runs[3].compression>runs[2].compression&&runs[5].rebound>runs[4].rebound,kind+' actual dampers');
  assert.equal(runs[2].rebound,runs[3].rebound);assert.equal(runs[4].compression,runs[5].compression);
  assert.ok(runs[3].motion<runs[2].motion,kind+' compression reduces landing motion');
  assert.ok(runs[5].motion<runs[4].motion,kind+' rebound reduces landing motion');
  results.push({kind,runs});
 }
 console.log('Landing measurements '+JSON.stringify(results));
});
