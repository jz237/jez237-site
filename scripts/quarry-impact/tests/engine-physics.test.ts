import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {isRearEngineKind} from '../src/classic-vehicle-specs';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
import {accumulateEngineDamage,enginePowerFactor,engineDamageLevel,engineStatus} from '../src/engine-condition';
import {applyComponentImpact,freshComponents,validComponents} from '../src/component-damage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,vehicleChassisHalfExtents} from '../src/vehicle-physics';
import {Simulation} from '../multiplayer/simulation';
import {STEP,NEUTRAL,type Snapshot} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {vehicleContact} from '../src/vehicle-contact';
await R.init();
const humans=new Set(Array.from({length:24},(_,i)=>i));
const close=(a:number,b:number,epsilon=1e-6)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
const snapshot=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const enginePoint=(kind:CarKind)=>({x:0,y:0,z:(isRearEngineKind(kind)?-1:1)*DEFINITIONS[kind].halfLength*.8});

test('mechanical hits follow every authored engine compartment rather than total body health',()=>{
 for(const kind of CAR_KINDS){
  const p=enginePoint(kind),direct=accumulateEngineDamage(0,kind,p,40);
  assert.ok(direct>.60,kind+' direct engine hit');
  assert.equal(accumulateEngineDamage(0,kind,{...p,z:-p.z},40),0,kind+' opposite compartment');
  assert.equal(accumulateEngineDamage(0,kind,{x:0,y:0,z:0},40),0,kind+' cabin');
  assert.equal(accumulateEngineDamage(0,kind,{...p,y:.9},40),0,kind+' above the engine bay');
  const side=accumulateEngineDamage(0,kind,{...p,x:DEFINITIONS[kind].halfWidth},40);
  assert.ok(side>0&&side<direct*.35,kind+' outer wing protects the engine');
  assert.equal(accumulateEngineDamage(0,kind,{...p,z:p.z*3},40),0,kind+' remote contact');
 }
});

test('engine condition applies structural damage once, remains bounded, and ignores harmless contacts',()=>{
 const point=enginePoint('marten'),direction={x:0,y:0,z:1},stock=freshComponents(),armored=freshComponents(),spec=vehicleSpecification('marten',{engine:0,tires:0,armor:3,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}});
 applyComponentImpact(stock,'marten',point,direction,40);applyComponentImpact(armored,'marten',point,direction,40*spec.damageScale);
 close(stock.engineDamage!,accumulateEngineDamage(0,'marten',point,40));
 close(armored.engineDamage!,accumulateEngineDamage(0,'marten',point,40*spec.damageScale));assert.ok(armored.engineDamage!<stock.engineDamage!);
 for(const damage of [0,1.8,-1,NaN,Infinity])assert.equal(accumulateEngineDamage(.3,'marten',point,damage),.3);
 assert.equal(accumulateEngineDamage(.3,'marten',{...point,x:NaN},20),.3);
 for(let i=0;i<20;i++)applyComponentImpact(stock,'marten',point,direction,40);
 assert.equal(stock.engineDamage,1);assert.ok(validComponents(stock));
 for(const engineDamage of [-.1,1.01,NaN,Infinity,'0',null])assert.equal(validComponents({...freshComponents(),engineDamage}),false);
 const legacy=freshComponents();delete legacy.engineDamage;assert.ok(validComponents(legacy));
});

test('known engine condition drives truthful status while old authorities retain their exact health response',()=>{
 for(const health of [0,1,39,40,70,100]){
  close(enginePowerFactor(health),health>0?.45+.55*health/100:0);
  close(engineDamageLevel(health),health>0?Math.max(0,(40-health)/40):1);
 }
 assert.equal(engineStatus(100,0),'ENGINE OK');assert.equal(engineStatus(30,0),'ENGINE OK');
 assert.equal(engineStatus(90,.3),'ENGINE DAMAGED');assert.equal(engineStatus(90,.7),'ENGINE POWER LOW');
 assert.equal(engineStatus(0,0),'ENGINE OFF');assert.equal(engineStatus(30),'ENGINE DAMAGED');
 assert.equal(enginePowerFactor(1,0),1);close(enginePowerFactor(100,1),.30);assert.equal(enginePowerFactor(0,0),0);
});

function acceleration(kind:CarKind,engineDamage:number|undefined){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=STEP;
 world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const spec=vehicleSpecification(kind),rig=createVehiclePhysics(R,world,kind,spec.mass);
 const state={health:60,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{...NEUTRAL,brake:0}};
 rig.body.setTranslation({x:0,y:.9,z:0},true);
 try{
  for(let tick=0;tick<420;tick++){state.input.throttle=tick<60?0:1;stepVehiclePhysics(rig.body,rig.controller,kind,spec,state,STEP,undefined,undefined,engineDamage);world.step();}
  return {speed:state.speed,distance:rig.body.translation().z,force:Array.from({length:4},(_,i)=>rig.controller.wheelEngineForce(i)!).reduce((a,b)=>a+b,0)};
 }finally{world.removeVehicleController(rig.controller);world.free();}
}
test('real Rapier acceleration distinguishes engine hits from equal-health luggage damage on every available vehicle',()=>{
 for(const kind of CAR_KINDS){
  const p=enginePoint(kind),damaged=accumulateEngineDamage(0,kind,p,40),luggage=accumulateEngineDamage(0,kind,{...p,z:-p.z},40);
  // Hold wheel condition and total structural health equal to isolate powertrain loss.
  const engine=acceleration(kind,damaged),body=acceleration(kind,luggage);
  assert.ok(body.speed-engine.speed>3,`${kind}: engine ${engine.speed}, luggage ${body.speed}`);
  assert.ok(body.distance-engine.distance>8,`${kind}: engine travel ${engine.distance}, luggage ${body.distance}`);
  assert.ok(engine.speed>5,kind+' power loss is not a stall');
 }
});

test('authoritative engine state survives binary snapshots and reconstructs old saves without discarding wheel condition',()=>{
 const sim=new Simulation(R,'playground',Array(8).fill('coupe')),restored=new Simulation(R,'playground'),legacy=new Simulation(R,'playground');
 try{
  sim.phase='playing';const car=sim.cars[0],point=enginePoint('coupe'),direction={x:0,y:0,z:1};
  applyComponentImpact(car.state.components!,'coupe',point,direction,40);car.state.health=60;
  car.state.components!.wheelDamage=[.13,.27,.41,.63];car.state.components!.wheelShift[3]={x:.08,y:0,z:-.11};
  car.state.dents=[{id:1,localPoint:point,localDirection:direction,damage:40,repair:0},{id:2,localPoint:point,localDirection:direction,damage:60,repair:-1}];
  const saved=snapshot(sim),wire=decodeSnapshotWire(encodeSnapshotWire(saved)) as Snapshot;assert.deepEqual(wire,saved);assert.ok(validOnlineSnapshot(wire));
  restored.restore(wire);assert.deepEqual(restored.cars[0].state.components,car.state.components);
  const old=structuredClone(saved);for(const c of old.cars)delete c.components!.engineDamage;assert.ok(validOnlineSnapshot(old));
  legacy.restore(old);assert.deepEqual(legacy.cars[0].state.components,car.state.components,'migrate only engine damage, retaining newer wheel information');
  assert.equal(old.cars[0].components!.engineDamage,undefined,'restoring cannot mutate saved input');
  const damaged=structuredClone(car.state.components);
  for(const s of [restored,legacy]){s.cars.slice(1).forEach(c=>c.body.setEnabled(false));s.setInput(0,{...NEUTRAL,throttle:1});s.step(humans);assert.ok(s.cars[0].controller.wheelEngineForce(2)!>0);assert.equal(s.recover(0),true);assert.deepEqual(s.cars[0].state.components,freshComponents());}
  const race=new Simulation(R,'race',Array(8).fill('coupe'));try{race.phase='playing';race.cars[0].state.components=damaged;assert.equal(race.recover(0),true);assert.deepEqual(race.cars[0].state.components,damaged,'race recovery preserves engine damage');}finally{race.dispose();}
  for(const bad of [-1,1.01,NaN]){const invalid=structuredClone(saved);invalid.cars[0].components!.engineDamage=bad;assert.equal(validOnlineSnapshot(invalid),false);}
 }finally{sim.dispose();restored.dispose();legacy.dispose();}
});

test('incomplete legacy damage history keeps the old power response until a genuine repair',()=>{
 const source=new Simulation(R,'playground'),restored=new Simulation(R,'playground');
 try{
  source.phase='playing';source.cars[0].state.health=35;const saved=snapshot(source),point=enginePoint('coupe'),direction={x:0,y:0,z:-1};
  let epoch=0;
  for(const missingComponents of [false,true])for(const history of [undefined,[],[{id:1,localPoint:point,localDirection:direction,damage:10,repair:0}]]){
   const old=structuredClone(saved);old.elapsed=epoch++*6;old.cars[0].dents=history;
   if(missingComponents)delete old.cars[0].components;else{delete old.cars[0].components!.engineDamage;old.cars[0].components!.wheelDamage=[.1,.2,.3,.4];}
   restored.restore(old);const state=restored.cars[0].state;assert.equal(state.components!.engineDamage,undefined);
   if(!missingComponents)assert.deepEqual(state.components!.wheelDamage,[.1,.2,.3,.4]);
   close(enginePowerFactor(state.health,state.components!.engineDamage),.45+.55*.35);
   applyComponentImpact(state.components!,'coupe',point,direction,10);assert.equal(state.components!.engineDamage,undefined,'later hits cannot make truncated history complete');
   assert.equal(restored.recover(0),true);assert.equal(state.components!.engineDamage,0);
  }
 }finally{source.dispose();restored.dispose();}
});

function isolate(sim:Simulation){sim.phase='playing';sim.cars.slice(1).forEach(c=>c.body.setEnabled(false));sim.props.forEach(p=>p.body.setEnabled(false));sim.world.gravity={x:0,y:0,z:0};}
function placeForWall(sim:Simulation,zSpeed:number){const c=sim.cars[0];c.body.setTranslation({x:0,y:8,z:0},true);c.body.setRotation({x:0,y:0,z:0,w:1},true);c.body.setLinvel({x:0,y:0,z:zSpeed},true);c.body.setAngvel({x:0,y:0,z:0},true);Object.assign(c.state,{p:{...c.body.translation()},q:{...c.body.rotation()},v:{...c.body.linvel()}});}

test('server real front and rear collisions injure opposite powertrains in the Marten and Tern',()=>{
 for(const kind of ['marten','tern'] as const)for(const side of [-1,1]){
  const sim=new Simulation(R,'playground',Array(8).fill(kind));isolate(sim);placeForWall(sim,side*22);
  sim.world.createCollider(R.ColliderDesc.cuboid(.4,.18,.1).setTranslation(0,8,side*5));
  try{
   for(let i=0;i<35;i++)sim.step(humans);
   const c=sim.cars[0];assert.ok(c.state.health<99,`${kind} ${side} physically struck wall`);
   const correct=(isRearEngineKind(kind)?-1:1)===side;
   assert.ok(correct?c.state.components!.engineDamage!>.1:c.state.components!.engineDamage===0,`${kind} ${side}: engine ${c.state.components!.engineDamage}`);
  }finally{sim.dispose();}
 }
});

test('authoritative utility compound shell contacts damage the car once per body-pair cooldown',()=>{
 const sim=new Simulation(R,'playground',Array(8).fill('utility'));isolate(sim);placeForWall(sim,22);
 // At this height the thin floor cannot touch: only the added front shell reaches the wall.
 const wall=sim.world.createCollider(R.ColliderDesc.cuboid(2,.10,.1).setTranslation(0,8.13,5));
 try{
  let shellContacts=0;
  for(let i=0;i<30;i++){sim.step(humans);for(let j=0;j<sim.cars[0].body.numColliders();j++){const collider=sim.cars[0].body.collider(j);if(collider.handle===sim.cars[0].collider.handle||collider.handle===sim.cars[0].roof.handle)continue;sim.world.contactPair(collider,wall,m=>shellContacts+=m.numContacts());}}
  const c=sim.cars[0],hits=sim.damage.filter(d=>d.car===0&&!d.scar);assert.ok(shellContacts>0,'must touch an additional utility shell collider');assert.ok(c.state.health<100&&hits.length>0,'shell impulses must reach server health');
  assert.ok(c.state.components!.engineDamage!>0,'shell impact reaches front engine');
  for(let i=1;i<hits.length;i++)assert.ok((hits[i].tick-hits[i-1].tick)*STEP>=.28,'one contact episode must not multiply damage');
  const other=sim.cars[1],keys=new Set<string>();
  for(let i=0;i<c.body.numColliders();i++)for(let j=0;j<other.body.numColliders();j++){const contact=vehicleContact(sim.world,sim.cars,c.body.collider(i).handle,other.body.collider(j).handle);assert.equal(contact.a,c);assert.equal(contact.b,other);keys.add(contact.key);}
  assert.equal(keys.size,1,'all utility shell pairs share the same cooldown');
 }finally{sim.dispose();}
});

test('utility cargo floor remains shallow after server damage, restore and repair',()=>{
 const sim=new Simulation(R,'playground',Array(8).fill('utility'));isolate(sim);placeForWall(sim,0);
 const c=sim.cars[0];c.body.setBodyType(R.RigidBodyType.Fixed,true);
 const assertOpen=()=>{const extents=c.collider.halfExtents();close(extents.y,.065);const expected=vehicleChassisHalfExtents('utility',c.state.components?.structure?100:c.state.health);close(extents.x,expected.x);close(extents.z,expected.z);sim.world.step();const y=c.body.translation().y,hit=c.collider.castRay(new R.Ray({x:0,y:y+3,z:-1.9},{x:0,y:-1,z:0}),5,true);close(3-hit,-.185,.00001);};
 try{
  assertOpen();c.state.health=63;const saved=snapshot(sim);sim.restore(saved);assertOpen();
  const dropped=sim.world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,9,-1.9)),box=sim.world.createCollider(R.ColliderDesc.cuboid(.2,.2,.2).setDensity(100),dropped);sim.world.gravity={x:0,y:-9.81,z:0};
  for(let i=0;i<180;i++)sim.world.step();close(dropped.translation().y,c.body.translation().y-.185+.2,.015);sim.world.removeRigidBody(dropped);void box;
  assert.equal(sim.recover(0),true);assertOpen();assert.equal(c.state.health,100);
 }finally{sim.dispose();}
});

test('simultaneous physical utility shell pairs produce one damage event per car',()=>{
 const sim=new Simulation(R,'playground',Array(8).fill('utility'));isolate(sim);sim.cars[1].body.setEnabled(true);
 const a=sim.cars[0],b=sim.cars[1];b.body.setBodyType(R.RigidBodyType.Fixed,true);
 for(const [car,x,speed] of [[a,-5,22],[b,0,0]] as const){car.body.setTranslation({x,y:8,z:0},true);car.body.setRotation({x:0,y:0,z:0,w:1},true);car.body.setLinvel({x:speed,y:0,z:0},true);Object.assign(car.state,{p:{...car.body.translation()},q:{...car.body.rotation()},v:{...car.body.linvel()}});}
 const pairs=new Set<string>(),drain=sim.queue.drainContactForceEvents.bind(sim.queue);
 sim.queue.drainContactForceEvents=consumer=>drain(event=>{const h1=event.collider1(),h2=event.collider2(),contact=vehicleContact(sim.world,sim.cars,h1,h2);if(contact.a&&contact.b)pairs.add(Math.min(h1,h2)+':'+Math.max(h1,h2));consumer(event);});
 try{
  for(let i=0;i<30;i++)sim.step(humans);
  assert.ok(pairs.size>=2,`must generate multiple real compound contact pairs, got ${pairs.size}`);
  assert.ok(a.state.health<100&&b.state.health<100,'both sides of the crash receive damage');
  for(const id of [0,1]){const hits=sim.damage.filter(hit=>hit.car===id&&!hit.scar);assert.ok(hits.length>0);for(let i=1;i<hits.length;i++)assert.ok((hits[i].tick-hits[i-1].tick)*STEP>=.28,'simultaneous shell pairs share one cooldown');}
 }finally{sim.dispose();}
});
