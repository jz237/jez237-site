import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {transform} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup,type Setup} from '../src/garage';
import {DEFINITIONS,type CarKind} from '../src/rules';
import {Simulation} from '../multiplayer/simulation';
import {verifyPhysicsSyncRevision} from './physics-sync-invariants';
await R.init();
// Compile the immutable preceding Vehicle implementation, changing only module
// locations. This detects a shared-kernel bug that comparing its two callers cannot.
const before=gunzipSync(readFileSync(new URL('./fixtures/physics-sync/src-vehicle.ts.gz',import.meta.url))).toString();
const compiled=await transform(before.replace(/from '([^']+)'/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});
const {Vehicle:PriorVehicle}=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
for(const kind of ['coupe','sedan','hatch']as const){const d=DEFINITIONS[kind],model=new T.Group();for(const [name,x,z]of [['FL',-1,1],['FR',1,1],['RL',-1,-1],['RR',1,-1]]as const){const wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set(x*(d.halfWidth-.04),.5,z*d.wheelbase/2);model.add(wheel);}templates.set(kind,model);}
function rig(Constructor:typeof Vehicle,kind:CarKind,setup:Setup){const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const car=new Constructor(0,kind,0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any,setup);car.place(0,0,0);return{world,car,dispose(){car.dispose();world.free();}};}
test('shared physics preserves legacy health-based solo behavior for all cars, tunes, damaged wheels and variable steps',()=>{
 for(const kind of ['coupe','sedan','hatch']as const)for(const tuned of [false,true]){
  const setup=stockSetup(kind);if(tuned){setup.engine=2;setup.tires=3;setup.armor=1;Object.assign(setup.tune,{gearing:.65,suspension:-.4,steering:.3,brakeBias:-.5,differential:.7});}
  const old=rig(PriorVehicle,kind,setup),fresh=rig(Vehicle,kind,setup);
  // The frozen fixture injects total health and bent-wheel damage without
  // engine or tyre condition. Keep both absent, as in an old save: a present
  // intact tyre array intentionally enables the new model's rim-safe radius.
  // Real component impacts and that radius correction are tested separately.
  fresh.car.engineDamage=undefined;fresh.car.tyreDamage=undefined;
  try{for(let i=0;i<900;i++){
   const dt=i%2?1/120:1/60,input={throttle:i<120?0:i<500?1:i<700?-.6:.4,steer:i>=200&&i<380?.2:i>=740?-.25:0,brake:i>=500&&i<550?1:0,handbrake:i>=420&&i<450};
   for(const r of [old,fresh]){if(i===600){r.car.health=72;r.car.damageLeft=12;r.car.wreckParts.wheelDamage[0]=.65;r.car.wreckParts.wheelShift[0].set(.07,0,-.1);}r.world.timestep=dt;r.car.input=input;r.car.preStep(dt);r.world.step();r.car.postStep(dt,i/60);}
   assert.ok(old.car.current.distanceTo(fresh.car.current)<.00001,`${kind} tuned=${tuned} tick=${i}`);assert.ok(old.car.currentQ.toArray().every((v,j)=>Math.abs(v-fresh.car.currentQ.toArray()[j])<.00001),`quaternion ${kind} tuned=${tuned} tick=${i}`);assert.equal(old.car.gear,fresh.car.gear);assert.ok(Math.abs(old.car.rpm-fresh.car.rpm)<.0001);
  }}finally{old.dispose();fresh.dispose();}
 }
});
test('all three authoritative cars match browser driving through throttle, steering, handbrake and reverse',()=>{
 // Keep this handling replay inside the clear quarry floor; impact adjudication is tested separately.
 for(const kind of ['coupe','sedan','hatch']as const){const sim=new Simulation(R,'playground',Array(8).fill(kind)),ref=new Simulation(R,'playground');for(const c of sim.cars.slice(1))c.body.setEnabled(false);for(const c of ref.cars)c.body.setEnabled(false);
  const car=new Vehicle(0,kind,0xffffff,new T.Scene(),ref.world,{emit(){},mark(){},detach(){}} as any);car.place(0,0,0);const remote=sim.cars[0];remote.body.setTranslation(car.body.translation(),true);remote.body.setRotation(car.body.rotation(),true);Object.assign(remote.state,{p:{...car.body.translation()},q:{...car.body.rotation()}});sim.phase='playing';
  try{for(let i=0;i<600;i++){const controls={throttle:i<100?0:i<240?1:i>450?-.6:0,steer:i>=180&&i<230?.15:0,brake:i>=240&&i<450?1:0,handbrake:i>=220&&i<240};car.input=controls;car.preStep(1/60);ref.world.step();car.postStep(1/60,i/60);sim.setInput(0,controls);sim.step(new Set([0,1,2,3,4,5,6,7]));assert.ok(car.current.distanceTo(new T.Vector3().copy(remote.body.translation()))<.0001,`${kind} tick ${i}: ${JSON.stringify({local:car.current,remote:remote.body.translation(),health:remote.state.health,damage:sim.damage,localHealth:car.health})}`);}}
  finally{car.dispose();sim.dispose();ref.dispose();}
 }
});
test('shared physics changes retain exact preceding source bytes',verifyPhysicsSyncRevision);
