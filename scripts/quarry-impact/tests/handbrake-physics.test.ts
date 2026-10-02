import test from 'node:test';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import * as current from '../src/vehicle-physics';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {readHandbrakePrevious} from './handbrake-playability-invariants';
await R.init();
const dt=1/60;
type API=Pick<typeof current,'createVehiclePhysics'|'vehicleSpecification'|'stepVehiclePhysics'>;
const neutral=()=>({throttle:0,steer:0,brake:0,handbrake:false});
function rig(kind:CarKind,api:API=current,damaged=false,tuned=false){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;
 world.createCollider(R.ColliderDesc.cuboid(250,.5,250).setTranslation(0,-.5,0).setFriction(.85));
 const tuning={engine:tuned?2:0,tires:tuned?2:0,armor:tuned?3:0,tune:{gearing:tuned?.35:0,suspension:tuned?-.25:0,steering:tuned?.2:0,brakeBias:tuned?-.2:0,differential:tuned?.5:0}};
 const spec=api.vehicleSpecification(kind,tuning),car=api.createVehiclePhysics(R,world,kind,spec.mass,tuning.armor);car.body.setTranslation({x:0,y:.89,z:0},true);
 const state:current.PhysicsState={health:damaged?70:100,damageLeft:damaged?12:0,damageRight:damaged?8:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:neutral()};
 const damage=damaged?[.32,.1,.46,.2]:[0,0,0,0],shift=damaged?[{x:.04,y:0,z:-.03},{x:0,y:0,z:0},{x:-.02,y:0,z:.02},{x:0,y:0,z:0}]:Array.from({length:4},()=>({x:0,y:0,z:0})),tyres=damaged?[.25,0,1,.4]:[0,0,0,0],engine=damaged?.55:0;
 const step=(input=state.input,delta=dt)=>{state.input={...input};world.timestep=delta;api.stepVehiclePhysics(car.body,car.controller,kind,spec,state,delta,damage,shift,engine,tyres);world.step();};
 const corners=()=>Array.from({length:4},(_,i)=>({force:car.controller.wheelEngineForce(i),brake:car.controller.wheelBrake(i),grip:car.controller.wheelFrictionSlip(i),radius:car.controller.wheelRadius(i),rest:car.controller.wheelSuspensionRestLength(i),axle:car.controller.wheelAxleCs(i),point:car.controller.wheelChassisConnectionPointCs(i)}));
 const sample=()=>({p:{...car.body.translation()},q:{...car.body.rotation()},v:{...car.body.linvel()},w:{...car.body.angvel()},state:{...state,input:{...state.input}},corners:corners()});
 for(let i=0;i<90;i++)step(neutral());
 return{...car,world,state,spec,damage,shift,tyres,engine,step,corners,sample,dispose(){world.removeVehicleController(car.controller);world.free();}};
}
const speed=(r:ReturnType<typeof rig>)=>{const v=r.body.linvel(),f=current.rotateVehicleVector({x:0,y:0,z:1},r.body.rotation());return v.x*f.x+v.y*f.y+v.z*f.z;};

// Uses the real contact solver, not only the existence of a rear brake setting.
// The counterfactual suppresses rear braking but retains identical handbrake
// friction and input, detecting the original nonzero-engine-force bypass.
test('held-throttle handbrake produces real rear braking in RWD and AWD cars',()=>{
 for(const kind of ['coupe','hatch','muscle']as const){
  const braking=rig(kind),noRearBrake=rig(kind);let phase=false;
  const original=noRearBrake.controller.setWheelBrake.bind(noRearBrake.controller);
  noRearBrake.controller.setWheelBrake=(i,value)=>original(i,phase&&i>1?0:value);
  try{
   for(let i=0;i<180;i++)for(const r of [braking,noRearBrake])r.step({...neutral(),throttle:1});
   assert.deepEqual(braking.sample(),noRearBrake.sample(),'Same normally accelerated launch');const initial=speed(braking);assert.ok(initial>15);
   phase=true;
   for(let i=0;i<90;i++)for(const r of [braking,noRearBrake])r.step({...neutral(),throttle:1,handbrake:true});
   const actual=speed(braking),without=speed(noRearBrake);
   assert.ok(actual<without-4,`${kind}: commanded handbrake must physically slow ${actual} versus ${without}`);
   assert.ok(actual<initial-3,`${kind}: held throttle must not defeat rear braking`);
   const wheels=braking.corners();assert.ok(wheels.slice(2).every(w=>w.force===0&&w.brake===100));
   if(kind==='hatch')assert.ok(wheels.slice(0,2).every(w=>w.force!>0&&w.brake===0),'AWD front drive remains active');
   else assert.ok(wheels.slice(0,2).every(w=>w.force===0));
  }finally{braking.dispose();noRearBrake.dispose();}
 }
});

test('releasing the handbrake restores rear drive in forward and reverse without a latched brake',()=>{
 for(const kind of ['coupe','muscle']as const)for(const direction of [1,-.6]){
  const r=rig(kind);
  try{
   for(let i=0;i<180;i++)r.step({...neutral(),throttle:direction});const launch=speed(r);assert.ok(Math.sign(launch)===Math.sign(direction)&&Math.abs(launch)>10);
   for(let i=0;i<60;i++)r.step({...neutral(),throttle:direction,handbrake:true});const held=speed(r);
   assert.ok(Math.abs(held)<Math.abs(launch)-3);assert.ok(r.corners().slice(2).every(w=>w.force===0&&w.brake===100));
   r.step({...neutral(),throttle:direction});assert.ok(r.corners().slice(2).every(w=>Math.sign(w.force!)===Math.sign(direction)&&w.brake===0),'Release restores the requested drive direction immediately');
   for(let i=0;i<60;i++)r.step({...neutral(),throttle:direction});assert.ok(Math.abs(speed(r))>Math.abs(held)+3,'Normal acceleration resumes');
  }finally{r.dispose();}
 }
});

test('handbrake preserves independent damaged-wheel, flat-tyre and engine conditions through release',()=>{
 for(const kind of ['coupe','hatch','tern']as const){const r=rig(kind,current,true,true);
  try{
   const condition=JSON.stringify({damage:r.damage,shift:r.shift,tyres:r.tyres,engine:r.engine,health:r.state.health});
   r.step({...neutral(),throttle:.6});const before=r.corners();
   r.step({...neutral(),throttle:.6,handbrake:true});const held=r.corners();
   assert.deepEqual(held.map(w=>w.radius),before.map(w=>w.radius));assert.deepEqual(held.map(w=>w.point),before.map(w=>w.point));
   const withoutSpeedDrag=(w:ReturnType<typeof r.corners>[number])=>{const {brake,...fixed}=w;return fixed;};
   assert.deepEqual(held.slice(0,2).map(withoutSpeedDrag),before.slice(0,2).map(withoutSpeedDrag),'Front drive, alignment and grip are untouched');
   assert.ok(held.slice(2).every(w=>w.force===0&&w.brake!>=100));
   r.step({...neutral(),throttle:.6});const released=r.corners();
   assert.deepEqual(released.map(withoutSpeedDrag),before.map(withoutSpeedDrag),'Release restores the same condition-dependent wheel configuration');
   assert.ok(released.slice(2).every(w=>w.brake!<100),'Only the existing speed-dependent bent-wheel drag remains');
   assert.equal(JSON.stringify({damage:r.damage,shift:r.shift,tyres:r.tyres,engine:r.engine,health:r.state.health}),condition);
  }finally{r.dispose();}
 }
});

let predecessor:Promise<API>|undefined;
function oldKernel(){return predecessor??=(async()=>{
 // This is the frozen predecessor module, not a rewritten copy of the current
 // implementation. Its unchanged imported helpers are protected by the leaf.
 const before=readHandbrakePrevious('src/vehicle-physics.ts').toString();
 const relocated=before.replace(/from '([^']+)'/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`);
 const compiled=await transform(relocated,{loader:'ts',format:'esm',target:'es2022'});
 return await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'))as API;
})();}

test('ordinary no-handbrake driving remains exact against the unchanged predecessor for every kind and condition',async()=>{
 const old=await oldKernel();
 for(const kind of CAR_KINDS)for(const altered of [false,true]){
  const a=rig(kind,old,altered,altered),b=rig(kind,current,altered,altered);
  try{for(let tick=0;tick<360;tick++){
   const input={throttle:tick<140?.85:tick<230?0:tick<300?-.6:.7,steer:tick>=70&&tick<140?.2:tick>=300?-.15:0,brake:tick>=140&&tick<230?1:0,handbrake:false},delta=tick%2?1/120:dt;
   a.step(input,delta);b.step(input,delta);assert.deepEqual(b.sample(),a.sample(),`${kind}, altered=${altered}, tick=${tick}`);
  }}finally{a.dispose();b.dispose();}
 }
});

test('front-drive Tern retains exact handbrake handling against the unchanged predecessor',async()=>{
 const old=await oldKernel();
 for(const altered of [false,true]){const a=rig('tern',old,altered,altered),b=rig('tern',current,altered,altered);
  try{for(let tick=0;tick<420;tick++){
   const input={throttle:tick<220?.9:tick<280?0:-.6,steer:tick>=180&&tick<220?.4:0,brake:tick>=220&&tick<280?1:0,handbrake:tick>=180&&tick<220||tick>=340&&tick<380};
   a.step(input);b.step(input);assert.deepEqual(b.sample(),a.sample(),`Tern altered=${altered} tick=${tick}`);
  }}finally{a.dispose();b.dispose();}
 }
});
