import test from 'node:test';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,vehicleChassisHalfExtents,vehicleSuspensionRestLength,vehicleSuspensionTravel,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
import {vehicleContact} from '../src/vehicle-contact';
import {readBuggyPrevious} from './buggy-invariants';
import {withHistoricalHandbrakePolicy} from './historical-handbrake-policy';
await R.init();
const dt=1/60;
const close=(actual:number,expected:number,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
const state=():PhysicsState=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}});
function rig(gravity=-9.81,ground=true){const world=new R.World({x:0,y:gravity,z:0});world.timestep=dt;if(ground)world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=vehicleSpecification('buggy'),car=createVehiclePhysics(R,world,'buggy',spec.mass),s=state();car.body.setTranslation({x:0,y:.89,z:0},true);return{world,spec,...car,s,step(){stepVehiclePhysics(car.body,car.controller,'buggy',spec,s,dt,undefined,undefined,0);world.step();},dispose(){world.removeVehicleController(car.controller);world.free();}};}

test('buggy wheel contacts, long travel and actual rear-biased mass match the vehicle contract',()=>{
 const r=rig(0,false);
 try{
  close(r.body.mass(),760,.001);close(r.body.localCom().z,-.20);close(r.body.localCom().y,-.08);
  close(vehicleSuspensionRestLength('buggy'),.44);close(vehicleSuspensionTravel('buggy'),.32);
  for(let i=0;i<4;i++){
   const p=r.controller.wheelChassisConnectionPointCs(i)!;close(p.x,(i%2?1:-1)*.85);close(p.y,-.12);close(p.z,(i<2?1:-1)*1.2);
   close(r.controller.wheelRadius(i)!, .38);close(r.controller.wheelSuspensionRestLength(i)!, .44);close(r.controller.wheelMaxSuspensionTravel(i)!, .32);
  }
  r.step();for(let i=0;i<4;i++)close(r.controller.wheelSuspensionRestLength(i)!, .44);
  const tuned=vehicleSpecification('buggy',{engine:0,tires:0,armor:0,tune:{gearing:0,suspension:.6,steering:0,brakeBias:0,differential:0}});
  stepVehiclePhysics(r.body,r.controller,'buggy',tuned,r.s,dt,new Float32Array([.8,0,0,0]),undefined,0);
  assert.ok(r.controller.wheelSuspensionRestLength(0)!<r.controller.wheelSuspensionRestLength(1)!);
  close(r.controller.wheelSuspensionRestLength(1)!, .44-.6*.035);
  assert.ok(r.controller.wheelSuspensionRestLength(0)!>.3,'damaged long-travel corner retains usable droop');
 }finally{r.dispose();}
});

test('the physical cockpit is open between cage tubes and a falling rigid box reaches its shallow floor',()=>{
 const r=rig(-9.81,false);r.body.setTranslation({x:0,y:1,z:0},true);r.body.setBodyType(R.RigidBodyType.Fixed,true);
 try{
  r.world.step();
  const rayHeight=(x:number,z:number)=>{const hit=r.world.castRay(new R.Ray({x,y:4,z},{x:0,y:-1,z:0}),6,true)!;assert.ok(hit);return 4-hit.timeOfImpact;};
  close(rayHeight(0,-.15),1-.96+.42+.013,.0001);
  close(rayHeight(0,-.63),1-.96+1.694+.026,.001);
  close(rayHeight(0,.17),1-.96+1.612+.026,.001);
  assert.ok(rayHeight(0,-.15)<rayHeight(0,-.63)-1.1,'no invisible roof fills the cockpit');
  const box=r.world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,2.8,-.15));r.world.createCollider(R.ColliderDesc.cuboid(.07,.08,.07).setDensity(200),box);
  for(let tick=0;tick<180;tick++)r.world.step();
  close(box.translation().y,1-.96+.42+.013+.08,.012);
  assert.ok(Math.abs(box.translation().x)<.10,'box passed through the open center');
  r.world.removeRigidBody(box);
  for(const health of [65,20,100]){r.collider.setHalfExtents(vehicleChassisHalfExtents('buggy',health));r.world.step();close(r.collider.halfExtents().y,.013);close(rayHeight(0,-.15),1-.96+.42+.013,.0001);}
 }finally{r.dispose();}
});

test('actual impacts reach narrow roll-cage pieces and all cage pieces share one car-pair cooldown',()=>{
 const r=rig(0,false);r.body.setTranslation({x:0,y:0,z:0},true);r.body.setBodyType(R.RigidBodyType.Fixed,true);
 const queue=new R.EventQueue(true),vehicle={...r,kind:'buggy'};
 // Strike the sloping roof-side rail. Neither the floor nor the returned main
 // crossbar occupies this location, so a generic two-collider lookup would miss it.
 const missile=r.world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(-3,.60,-.25).setCcdEnabled(true));
 const projectile=r.world.createCollider(R.ColliderDesc.cuboid(.12,.08,.12).setDensity(12000).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS),missile);missile.setLinvel({x:16,y:0,z:0},true);
 let extraCageContacts=0;
 try{
  for(let tick=0;tick<40;tick++){r.world.step(queue);queue.drainContactForceEvents(event=>{const h1=event.collider1(),h2=event.collider2(),contact=vehicleContact(r.world,[vehicle],h1,h2);if(!contact.a&&!contact.b)return;assert.equal(contact.a??contact.b,vehicle);const carHandle=h1===projectile.handle?h2:h1;if(carHandle!==r.collider.handle&&carHandle!==r.roof.handle)extraCageContacts++;});}
  assert.ok(extraCageContacts>0,'the actual narrow cage must stop the projectile and report its owning buggy');
  assert.ok(missile.linvel().x<8,'cage collision removes most incoming projectile speed');
  const other=createVehiclePhysics(R,r.world,'buggy',760),opponent={...other,kind:'buggy'},keys=new Set<string>();
  for(let i=0;i<r.body.numColliders();i++)for(let j=0;j<other.body.numColliders();j++){const c=vehicleContact(r.world,[vehicle,opponent],r.body.collider(i).handle,other.body.collider(j).handle);assert.equal(c.a,vehicle);assert.equal(c.b,opponent);keys.add(c.key);}
  assert.equal(keys.size,1,'many cage pieces do not multiply one crash');r.world.removeVehicleController(other.controller);
 }finally{queue.free();r.dispose();}
});

test('buggy rear wheels accelerate, steer, brake and reverse while front wheels remain undriven',()=>{
 const r=rig();
 try{
  for(let tick=0;tick<660;tick++){r.s.input.throttle=tick<60?0:1;r.step();}
  assert.ok(r.s.speed>27&&r.s.speed<45,`speed ${r.s.speed}`);
  assert.equal(Math.abs(r.controller.wheelEngineForce(0)!),0);assert.equal(Math.abs(r.controller.wheelEngineForce(1)!),0);assert.ok(r.controller.wheelEngineForce(2)!>0&&r.controller.wheelEngineForce(3)!>0);
  r.s.input.throttle=.25;r.s.input.steer=.13;const before={...r.body.translation()};
  for(let tick=0;tick<90;tick++)r.step();
  assert.ok(Math.abs(r.body.translation().x-before.x)>3,'front steering turns the moving rear-drive buggy');
  assert.ok(rotateVehicleVector({x:0,y:1,z:0},r.body.rotation()).y>.75,'ordinary steering remains upright');
  r.s.input.throttle=0;r.s.input.steer=0;r.s.input.brake=1;for(let tick=0;tick<360;tick++)r.step();assert.ok(Math.abs(r.s.speed)<1);
  r.s.input.brake=0;r.s.input.throttle=-.7;for(let tick=0;tick<150;tick++)r.step();assert.ok(r.s.speed< -3);assert.equal(r.s.gear,0);
  assert.ok(r.controller.wheelEngineForce(2)!<0);assert.equal(Math.abs(r.controller.wheelEngineForce(0)!),0);
  r.s.input.handbrake=true;r.step();assert.equal(r.controller.wheelBrake(0),0);assert.ok(r.controller.wheelBrake(2)!>=100);
 }finally{r.dispose();}
});

test('long-travel buggy crosses alternating wheel bumps without rollover or losing its line',()=>{
 const r=rig();
 for(let i=0;i<10;i++){
  const x0=i%2?-.15:-3,x1=i%2?3:.15,z=9+i*8;
  const points=Float32Array.from([[x0,0,-2],[x1,0,-2],[x0,.18,0],[x1,.18,0],[x0,0,2],[x1,0,2],[x0,-.02,0],[x1,-.02,0]].flat());
  r.world.createCollider(R.ColliderDesc.convexHull(points)!.setTranslation(0,0,z).setFriction(.6));
 }
 let lowestUp=1,highestY=0,contactSteps=0,shortest=Infinity,longest=0;
 try{
  for(let tick=0;tick<660;tick++){
   r.s.input.throttle=tick<60?0:.65;r.step();if(tick<60)continue;
   lowestUp=Math.min(lowestUp,rotateVehicleVector({x:0,y:1,z:0},r.body.rotation()).y);highestY=Math.max(highestY,r.body.translation().y);
   if([0,1,2,3].some(i=>r.controller.wheelIsInContact(i)))contactSteps++;
   for(let i=0;i<4;i++){const length=r.controller.wheelSuspensionLength(i)!;shortest=Math.min(shortest,length);longest=Math.max(longest,length);}
  }
  assert.ok(r.body.translation().z>90,'crossed all ten bumps');assert.ok(Math.abs(r.body.translation().x)<6,`lateral travel ${r.body.translation().x}`);
  assert.ok(lowestUp>.70,`minimum up ${lowestUp}`);assert.ok(highestY<1.65,`height ${highestY}`);assert.ok(contactSteps>540,`grounded steps ${contactSteps}/600`);
  assert.ok(longest-shortest>.12,`actual suspension motion ${longest-shortest}`);
 }finally{r.dispose();}
});

test('exported cage, bonnet and bumpers meet the physical collision surfaces without filling the cockpit',async()=>{
 const root=(await loadCarWithoutImages('buggy')).scene,r=rig(0,false);r.body.setTranslation({x:0,y:0,z:0},true);r.body.setBodyType(R.RigidBodyType.Fixed,true);r.world.step();
 const meshes:T.Mesh[]=[];root.traverse(o=>{if(o instanceof T.Mesh)meshes.push(o);});
 const compare=(origin:T.Vector3,direction:T.Vector3,pattern:RegExp,tolerance:number)=>{
  const visible=new T.Raycaster(origin,direction).intersectObjects(meshes.filter(m=>pattern.test(m.name)))[0];assert.ok(visible,'actual exported surface must exist for '+pattern);
  const physical=r.world.castRay(new R.Ray({x:origin.x,y:origin.y-.96,z:origin.z},direction),6,true);assert.ok(physical,'physical surface must exist for '+pattern);
  close(physical.timeOfImpact,visible.distance,tolerance);
 };
 try{
  compare(new T.Vector3(0,3,-.15),new T.Vector3(0,-1,0),/Ravine_floor/,.001);
  for(const [x,z]of [[0,-.63],[0,.17],[-.58,-.20],[.58,-.20]])compare(new T.Vector3(x,3,z),new T.Vector3(0,-1,0),/Cage/,.015);
  for(const [x,z]of [[0,1],[.54,.9],[-.54,.9],[0,1.5]])compare(new T.Vector3(x,3,z),new T.Vector3(0,-1,0),/hoodRavine/,.025);
  compare(new T.Vector3(0,.49,3),new T.Vector3(0,0,-1),/bumper_frontRavine/,.015);
  compare(new T.Vector3(0,.58,-3),new T.Vector3(0,0,1),/bumper_rearRavine/,.015);
  const crankcase=meshes.find(m=>/engine_crankcase_Ravine/.test(m.name));assert.ok(crankcase);
  const core=new T.Box3().setFromObject(crankcase),engine=r.body.collider(Array.from({length:r.body.numColliders()},(_,i)=>i).find(i=>Math.abs(r.body.collider(i).translation().z+1.27)<1e-6)!);
  assert.ok(engine,'rear engine has a physical collision volume');
  for(const point of [core.min,core.max])assert.ok(engine.containsPoint({x:point.x,y:point.y-.96,z:point.z}),'exposed engine core sits inside rear collision volume');
  assert.equal(r.body.numColliders(),39,'bounded compound collision cost');
 }finally{r.dispose();}
});

const previousSource=readBuggyPrevious('src/vehicle-physics.ts').toString().replace(/from '([^']+)'/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`);
const previous=await import('data:text/javascript;base64,'+Buffer.from((await transform(previousSource,{loader:'ts',format:'esm',target:'es2022'})).code).toString('base64'));
// Apply only the later reviewed rear handbrake policy to the frozen reference;
// all original trajectory inputs and exact state comparisons remain intact.
const previousStep=(...args:Parameters<typeof stepVehiclePhysics>)=>withHistoricalHandbrakePolicy(args[1],args[2],args[4].input.handbrake,()=>previous.stepVehiclePhysics(...args));
test('all ten preceding vehicles keep exact physics trajectories under current handbrake policy with tuned, damaged and legacy engine states',()=>{
 const kinds=CAR_KINDS.filter(kind=>kind!=='buggy');assert.equal(kinds.length,10);
 for(const kind of kinds)for(const tuned of [false,true]){
  const setup={engine:tuned?2:0,tires:tuned?2:0,armor:tuned?1:0,tune:{gearing:tuned?.4:0,suspension:tuned?-.4:0,steering:tuned?.3:0,brakeBias:tuned?-.2:0,differential:tuned?.6:0}};
  const runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previousStep,spec:previous.vehicleSpecification}].map(api=>{const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const spec=api.spec(kind,setup),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};});
  assert.deepEqual(runs[0].spec,runs[1].spec);
  try{
   for(let tick=0;tick<600;tick++){
    for(const r of runs){r.s.input={throttle:tick<60?0:tick<270?1:tick<330?0:tick<450?-.7:.6,steer:tick>=180&&tick<270?.13:tick>=450?-.11:0,brake:tick>=270&&tick<330?1:0,handbrake:tick>=230&&tick<245};if(tick===360){r.s.health=67;r.s.damageRight=12;}
     r.api.step(r.body,r.controller,kind,r.spec,r.s,dt,tick>=360?new Float32Array([0,.45,0,.7]):undefined,tick>=360?[{x:0,y:0,z:0},{x:.08,y:0,z:-.12},{x:0,y:0,z:0},{x:0,y:0,z:0}]:undefined,tick<450?undefined:.42);r.world.step();
    }
    assert.deepEqual(runs[0].body.translation(),runs[1].body.translation(),`${kind} tuned=${tuned} tick=${tick}`);
    assert.deepEqual(runs[0].body.rotation(),runs[1].body.rotation());assert.deepEqual(runs[0].s,runs[1].s);
   }
  }finally{for(const r of runs){r.world.removeVehicleController(r.controller);r.world.free();}}
 }
});
