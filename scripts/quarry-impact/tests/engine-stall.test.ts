import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {stalledByImpact,validEngineStall,advanceEngineRestart,starterRPM,stallHint,starterSamples} from '../src/engine-stall';
import {CAR_KINDS} from '../src/rules';
import {stockSetup} from '../src/garage';
import {createVehiclePhysics,vehicleSpecification,stepVehiclePhysics} from '../src/vehicle-physics';
import {Simulation} from '../multiplayer/simulation';
import {NEUTRAL,STEP,type Snapshot} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
await R.init();
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const humans=new Set(Array.from({length:24},(_,i)=>i));

test('only sufficiently heavy structural impacts stall engines; damage lowers the threshold without extending an existing stall',()=>{
 for(const condition of [0,.25,.5,.75,1]){
  const threshold=28-18*condition;
  for(const damage of [0,1.8,threshold-.001,-1,NaN,Infinity])assert.equal(stalledByImpact(0,50,condition,damage),0);
  near(stalledByImpact(0,50,condition,threshold)!,1+1.8*condition);
  assert.equal(stalledByImpact(.4,50,condition,90),.4);
 }
 assert.equal(stalledByImpact(0,50,undefined,28),1);
 assert.equal(stalledByImpact(undefined,50,1,90),undefined,'legacy recordings cannot invent a stall');
 assert.equal(stalledByImpact(2,0,1,90),0,'a wreck cannot restart');
 for(const value of [undefined,0,1,2.8,Math.fround(2.8)])assert.ok(validEngineStall(value));
 for(const value of [null,'1',-.1,2.81,NaN,Infinity])assert.equal(validEngineStall(value),false);
});

test('throttle and reverse restart in simulation time; neutral, braking and pauses preserve remaining crank time',()=>{
 for(const dt of [1/30,1/60,1/120])for(const throttle of [-1,1]){
  const state={health:80,engineStall:2.8,input:{throttle:0}};
  for(let i=0;i<60;i++)assert.equal(advanceEngineRestart(state,dt),false);
  near(state.engineStall,2.8);assert.equal(starterRPM(80,2.8,0),0);assert.match(stallHint(80,2.8,0),/HOLD THROTTLE/);
  state.input.throttle=throttle;let steps=0;while(!advanceEngineRestart(state,dt)&&steps++<500)assert.ok(starterRPM(80,state.engineStall,throttle)>=180);
  assert.ok(Math.abs((steps+1)*dt-2.8)<dt*1.01);assert.equal(state.engineStall,0);assert.equal(stallHint(80,0,throttle),'');
 }
 const s={health:10,engineStall:1,input:{throttle:1}};for(const dt of [0,-1,NaN,Infinity]){assert.equal(advanceEngineRestart(s,dt),false);assert.equal(s.engineStall,1);}
 advanceEngineRestart(s,.3);s.input.throttle=0;advanceEngineRestart(s,5);near(s.engineStall,.7);s.health=0;assert.equal(advanceEngineRestart(s,1),false);assert.equal(s.engineStall,0);
});

test('all eleven actual Rapier controllers retain brakes and steering while stalled, then regain damaged-engine drive',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),setup=stockSetup(kind);setup.armor=armor;
  const spec=vehicleSpecification(kind,setup),rig=createVehiclePhysics(R,world,kind,spec.mass,armor);
  const state={health:70,engineStall:1,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{...NEUTRAL,steer:.8,brake:.5}};
  const force=()=>[0,1,2,3].reduce((sum,i)=>sum+Math.abs(rig.controller.wheelEngineForce(i)!),0);
  try{
   rig.body.setTranslation({x:0,y:10,z:0},true);
   stepVehiclePhysics(rig.body,rig.controller,kind,spec,state,STEP,undefined,undefined,.5);
   assert.equal(force(),0);assert.equal(state.rpm,0);assert.ok(state.steering>0);assert.ok(rig.controller.wheelBrake(0)!>0);assert.equal(state.engineStall,1);
   state.input.throttle=1;state.input.brake=0;
   for(let i=0;i<58;i++){stepVehiclePhysics(rig.body,rig.controller,kind,spec,state,STEP,undefined,undefined,.5);assert.equal(force(),0);assert.ok(state.rpm>=180&&state.rpm<=260);}
   for(let i=0;i<3;i++)stepVehiclePhysics(rig.body,rig.controller,kind,spec,state,STEP,undefined,undefined,.5);
   assert.equal(state.engineStall,0);assert.ok(force()>spec.force*.6&&force()<spec.force*.8);assert.ok(state.rpm>850);
  }finally{world.removeVehicleController(rig.controller);world.free();}
 }
});

test('real server wall collisions stop the engine and human throttle restarts it; recovery preserves damage unless it repairs',()=>{
 for(const kind of ['marten','tern'] as const){
  const sim=new Simulation(R,'playground',Array(8).fill(kind));
  try{
   sim.phase='playing';sim.cars.slice(1).forEach(c=>c.body.setEnabled(false));sim.props.forEach(p=>p.body.setEnabled(false));sim.world.gravity={x:0,y:0,z:0};
   const car=sim.cars[0],side=kind==='marten'?-1:1;
   car.body.setTranslation({x:0,y:8,z:0},true);car.body.setRotation({x:0,y:0,z:0,w:1},true);car.body.setLinvel({x:0,y:0,z:side*40},true);Object.assign(car.state,{p:{...car.body.translation()},q:{...car.body.rotation()},v:{...car.body.linvel()}});
   sim.world.createCollider(R.ColliderDesc.cuboid(.4,.18,.1).setTranslation(0,8,side*5));
   for(let i=0;i<35;i++)sim.step(humans);
   assert.ok(car.state.health>0&&car.state.health<100,kind+' survives actual crash');assert.ok(car.state.engineStall!>0,kind+' stalled by actual collision '+JSON.stringify({health:car.state.health,engine:car.state.components?.engineDamage,hits:sim.damage.map(d=>d.damage)}));assert.equal(car.state.rpm,0);
   const saved={...sim.snapshot(true),members:[],ack:{}} as Snapshot;
   const wire=decodeSnapshotWire(encodeSnapshotWire(saved)) as Snapshot;assert.deepEqual(wire,saved);
   const restored=new Simulation(R,'playground');try{
    restored.restore(wire);near(restored.cars[0].state.engineStall!,car.state.engineStall!);
    const old=structuredClone(saved);delete old.cars[0].engineStall;restored.restore(old);assert.equal(restored.cars[0].state.engineStall,0,'legacy save cannot inherit prior stall');
   }finally{restored.dispose();}

   car.body.setTranslation({x:0,y:20,z:0},true);car.body.setLinvel({x:0,y:0,z:0},true);car.body.setAngvel({x:0,y:0,z:0},true);sim.setInput(0,{...NEUTRAL,throttle:1,brake:0});
   for(let i=0;i<180;i++)sim.step(humans);
   assert.equal(car.state.engineStall,0);assert.ok([0,1,2,3].some(i=>car.controller.wheelEngineForce(i)!>0));
   car.state.engineStall=2;assert.equal(sim.recover(0),true);assert.equal(car.state.engineStall,0);assert.equal(car.state.health,100);
  }finally{sim.dispose();}
 }
 const race=new Simulation(R,'race');try{race.phase='playing';race.cars[0].state.engineStall=2;assert.ok(race.recover(0));assert.equal(race.cars[0].state.engineStall,2);}finally{race.dispose();}
});

test('starter synthesis is bounded, deterministic and loopable at common output rates',()=>{
 for(const rate of [44100,48000]){const samples=starterSamples(rate);assert.equal(samples.length,rate/2);assert.deepEqual(samples,starterSamples(rate));assert.ok(samples.every(v=>Number.isFinite(v)&&Math.abs(v)<.6));assert.ok(Math.abs(samples.at(-1)!)<.06);assert.ok(samples.some(v=>Math.abs(v)>.2));}
});

test('modern online snapshot validation accepts finite stall state and rejects malformed restart counters',()=>{
 const sim=new Simulation(R,'playground');try{
  sim.cars[0].state.engineStall=1.5;const saved={...sim.snapshot(true),members:[],ack:{}} as Snapshot;assert.ok(validOnlineSnapshot(saved));
  for(const value of [-1,2.81,NaN,Infinity]){const bad=structuredClone(saved);bad.cars[0].engineStall=value;assert.equal(validOnlineSnapshot(bad),false);}
  delete saved.cars[0].engineStall;assert.ok(validOnlineSnapshot(saved));
 }finally{sim.dispose();}
});
