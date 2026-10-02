import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {transform} from 'esbuild';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {Simulation} from '../multiplayer/simulation';
import {Room} from '../multiplayer/room';
import {NEUTRAL,STEP,type Snapshot} from '../multiplayer/protocol';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {vehicleContact} from '../src/vehicle-contact';
import {freshComponents,applyComponentImpact,damageWheels,validComponents} from '../src/component-damage';
import anchors from '../src/vehicle-damage-anchors.json';
import {validOnlineSnapshot} from '../src/network-validation';
import {OnlineView} from '../src/online-view';
import {verifyOnlineDamageRevision} from './online-damage-invariants';
await R.init();
const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const humans=new Set([0,1,2,3,4,5,6,7]);
const envelope=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const near=(a:number,b:number,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
const before=gunzipSync(readFileSync(new URL('./fixtures/online-damage/src-wreck-attachments.ts.gz',import.meta.url))).toString();
const compiled=await transform(before.replace("from 'three'",`from '${import.meta.resolve('three')}'`),{loader:'ts',format:'esm',target:'es2022'});
const {WreckAttachments:PriorAttachments}=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));

test('authoritative corner anchors match real production models and retain frozen attachment damage behavior',()=>{
 for(const kind of ['coupe','sedan','hatch']as const){
  assert.equal(createHash('sha256').update(readFileSync(new URL('../public/models/'+kind+'.glb',import.meta.url))).digest('hex'),anchors[kind].sha256);
  const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,kind,0xffffff,new T.Scene(),world,fx);
  try{
   near(-car.model.position.y,anchors[kind].modelOffset);car.wheels.forEach((w,i)=>assert.deepEqual({...w.position},anchors[kind].wheels[i]));
   const old=new PriorAttachments(car.model,car.wheels,1),state=freshComponents();
   for(let i=0;i<120;i++){
    const point=new T.Vector3(Math.sin(i*.47)*1.4,.5+(i%4)*.37,Math.cos(i*.77)*2.1),direction=new T.Vector3(Math.cos(i),Math.sin(i*.3),Math.sin(i)).normalize(),damage=2+(i%19);
    old.hit(point,direction,damage);damageWheels(state.wheelDamage,state.wheelShift,anchors[kind].wheels,point,direction,damage);
    assert.deepEqual(state.wheelDamage,Array.from(old.wheelDamage));old.wheelShift.forEach((v:T.Vector3,j:number)=>{near(v.x,state.wheelShift[j].x);near(v.z,state.wheelShift[j].z);});
   }
   assert.ok(validComponents(state));
  }finally{car.dispose();world.free();}
 }
});

// Independent browser collision adjudication follows the solo contact pipeline.
// It does not call the authoritative server's damage handler.
function browserContacts(world:R.World,queue:R.EventQueue,cars:Vehicle[],time:number,judge:ImpactAdjudicator,race=false){
 const contacts:(ImpactContact&{a?:Vehicle;b?:Vehicle;point:T.Vector3;relative:T.Vector3})[]=[];
 queue.drainContactForceEvents(e=>{
  const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(world,cars,h1,h2);if((!a&&!b)||!judge.needsContact(key,time))return;
  const point=(a??b)!.current.clone(),normal=new T.Vector3();world.contactPair(world.getCollider(h1),world.getCollider(h2),m=>{if(m.numSolverContacts()){point.copy(m.solverContactPoint(0));normal.copy(m.normal());}});
  const va=a?.velocity??new T.Vector3(),vb=b?.velocity??new T.Vector3(),relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length(),impulse=e.totalForceMagnitude()*STEP;
  contacts.push({a,b,key,point,relative,closing,impulse,damageScale:Math.max(a&&a.health>0?a.specification.damageScale:0,b&&b.health>0?b.specification.damageScale:0)});
 });
 const decisions=judge.adjudicate(contacts,time,race?.45:1);
 for(const {contact:{a,b,point,relative},damage} of decisions){
  for(const [car,other,direction]of [[a,b,relative],[b,a,relative.clone().negate()]]as const)if(car){const health=car.health;car.hit(point,direction.clone().normalize(),damage,time,true);if(other)other.inflicted+=health-car.health;}
 }
 return decisions;
}

test('rendered Tern/Hatch and authority agree when a harmless bumper tap precedes the real crash',()=>{
 for(const kind of ['tern','hatch']as const){
  const authority=new Simulation(R,'playground',[kind,'buggy']),terrain=new Simulation(R,'playground'),queue=new R.EventQueue(true),scene=new T.Scene();
  const cars=[kind,'buggy' as const].map((k,i)=>new Vehicle(i,k,0xffffff,scene,terrain.world,fx)),judge=new ImpactAdjudicator();
  authority.phase='playing';authority.world.gravity=terrain.world.gravity={x:0,y:0,z:0};
  authority.cars.slice(2).forEach(c=>c.body.setEnabled(false));terrain.cars.forEach(c=>c.body.setEnabled(false));
  cars.forEach((car,i)=>{
   const p={x:0,y:10,z:i?6.17:0},q={x:0,y:i?1:0,z:0,w:i?0:1},v={x:0,y:0,z:i?-20:20};
   car.body.setTranslation(p,true);car.body.setRotation(q,true);car.body.setLinvel(v,true);car.postStep(STEP,0);car.impactEffects={glass:true,debris:true};
   const a=authority.cars[i];a.body.setTranslation(p,true);a.body.setRotation(q,true);a.body.setLinvel(v,true);Object.assign(a.state,{p,q,v,av:{x:0,y:0,z:0}});
  });
  const observed:{time:number;damage:number;feedback:boolean}[]=[];
  try{
   for(let tick=1;tick<=15;tick++){
    for(const car of cars){car.input={...NEUTRAL};car.preStep(STEP);authority.setInput(car.id,car.input);}
    terrain.world.step(queue);cars.forEach(c=>c.postStep(STEP,tick*STEP));
    for(const decision of browserContacts(terrain.world,queue,cars,tick*STEP,judge)){
     observed.push({time:tick*STEP,damage:decision.damage,feedback:decision.feedback});
     if(decision.feedback&&decision.damage===0)assert.ok(cars.every(c=>!c.impactEffects.glass&&!c.impactEffects.debris),'feedback-only contact clears stale visual flags');
    }
    authority.step(humans);
    cars.forEach((car,i)=>{
     const state=authority.cars[i].state;near(car.health,state.health,.001);near(car.inflicted,state.inflicted,.001);
     assert.ok(car.current.distanceTo(new T.Vector3().copy(state.p))<.002,`${kind} position tick ${tick}`);
     car.wreckParts.wheelDamage.forEach((d,j)=>near(d,state.components!.wheelDamage[j],.0001));
     car.wreckParts.wheelShift.forEach((v,j)=>{near(v.x,state.components!.wheelShift[j].x,.0001);near(v.z,state.components!.wheelShift[j].z,.0001);});
     near(car.engineDamage!,state.components!.engineDamage!,.0001);
    });
   }
   const tap=observed.find(e=>e.feedback&&e.damage===0)!,crash=observed.find(e=>e.damage>3)!;
   assert.ok(tap&&crash,kind+' fixture contains harmless feedback then structural damage');assert.ok(crash.time>tap.time&&crash.time-tap.time<.28);assert.equal(crash.feedback,false);
   assert.equal(observed.filter(e=>e.damage>0).length,1,'compound rails produce one damage decision');assert.equal(authority.damage.length,2);
   assert.ok(cars.every(c=>c.health<97));
  }finally{cars.forEach(c=>c.dispose());queue.free();authority.dispose();terrain.dispose();}
 }
});

test('real collisions and subsequent damaged-wheel driving match solo across all cars and race damage scaling',()=>{
 for(const kind of ['coupe','sedan','hatch']as const)for(const mode of ['playground','race']as const){
  const authority=new Simulation(R,mode,Array(8).fill(kind)),terrain=new Simulation(R,mode),queue=new R.EventQueue(true),scene=new T.Scene(),cars=[0,1].map(i=>new Vehicle(i,kind,0xffffff,scene,terrain.world,fx));
  authority.cars.slice(2).forEach(c=>c.body.setEnabled(false));terrain.cars.forEach(c=>c.body.setEnabled(false));authority.phase='playing';const seen=new ImpactAdjudicator();
  cars.forEach((c,i)=>{c.place(i*.65,(i?1:-1)*4,i?Math.PI:0);c.body.setLinvel({x:0,y:0,z:i?-22:22},true);const a=authority.cars[i];a.body.setTranslation(c.body.translation(),true);a.body.setRotation(c.body.rotation(),true);a.body.setLinvel(c.body.linvel(),true);Object.assign(a.state,{p:{...c.body.translation()},q:{...c.body.rotation()},v:{...c.body.linvel()}});});
  try{
   for(let tick=1;tick<=150;tick++){
    for(const c of cars){c.input={throttle:tick>80?.45:0,steer:tick>100?.15:0,brake:0,handbrake:false};authority.setInput(c.id,c.input);c.preStep(STEP);}terrain.world.step(queue);cars.forEach(c=>c.postStep(STEP,tick*STEP));browserContacts(terrain.world,queue,cars,tick*STEP,seen,mode==='race');authority.step(humans);
    cars.forEach((c,i)=>{const a=authority.cars[i].state;near(c.health,a.health,.001);near(c.inflicted,a.inflicted,.001);assert.ok(c.current.distanceTo(new T.Vector3().copy(a.p))<.002,`${kind} ${mode} position tick ${tick}`);c.wreckParts.wheelDamage.forEach((d,j)=>near(d,a.components!.wheelDamage[j],.0001));c.wreckParts.wheelShift.forEach((v,j)=>{near(v.x,a.components!.wheelShift[j].x,.0001);near(v.z,a.components!.wheelShift[j].z,.0001);});});
   }
   assert.ok(authority.damage.length>=2);assert.ok(authority.cars.slice(0,2).every(c=>c.state.health<99));assert.ok(authority.cars.slice(0,2).some(c=>c.state.components!.wheelDamage.some(d=>d>.01)));
  }finally{cars.forEach(c=>c.dispose());queue.free();authority.dispose();terrain.dispose();}
 }
});

test('slow overlapping contacts do not crush cars and component values remain bounded under repeated damage',()=>{
 const sim=new Simulation(R,'playground');sim.phase='playing';sim.cars.slice(2).forEach(c=>c.body.setEnabled(false));const a=sim.cars[0],b=sim.cars[1];
 try{
  let contacts=0;
  for(let tick=0;tick<90;tick++){
   for(const [c,z,speed]of [[a,-1.8,.3],[b,1.8,-.3]]as const){c.body.setTranslation({x:0,y:.75,z},true);c.body.setRotation({x:0,y:0,z:0,w:1},true);c.body.setLinvel({x:0,y:0,z:speed},true);c.body.setAngvel({x:0,y:0,z:0},true);Object.assign(c.state,{p:{x:0,y:.75,z},q:{x:0,y:0,z:0,w:1},v:{x:0,y:0,z:speed}});sim.setInput(c.state.id,{throttle:0,steer:0,brake:0,handbrake:false});}
   sim.step(humans);sim.world.contactPair(a.collider,b.collider,m=>contacts+=m.numContacts());
  }
  assert.ok(contacts>0,'the slow-contact fixture must actually touch');assert.equal(a.state.health,100);assert.equal(b.state.health,100);assert.deepEqual(a.state.components,freshComponents());assert.equal(sim.damage.length,0);
  const condition=freshComponents();for(let i=0;i<2000;i++)applyComponentImpact(condition,'coupe',{x:-.95,y:-.44,z:1.36},{x:1,y:0,z:-1},23);
  assert.ok(validComponents(condition));assert.equal(condition.wheelDamage[0],1);assert.equal(condition.wheelShift[0].x,.18);assert.equal(condition.wheelShift[0].z,-.24);assert.equal(condition.wheelDamage[3],0);
 }finally{sim.dispose();}
});

test('corner condition survives room persistence and old snapshots migrate from dents; recovery follows mode rules',()=>{
 const room=new Room('ABCDEF',R);room.sim.dispose();room.sim=new Simulation(R,'playground');room.sim.phase='playing';const c=room.sim.cars[0],point={x:-.95,y:-.14,z:1.4},direction={x:.8,y:0,z:-.6};
 applyComponentImpact(c.state.components!,'coupe',point,direction,23);c.state.health=77;c.state.dents=[{id:9,localPoint:point,localDirection:direction,damage:23,repair:0}];
 const saved=room.save(),restored=new Room('ABCDEF',R),legacy=new Room('ABCDEF',R);
 try{
  restored.restore(saved);assert.deepEqual(restored.sim.cars[0].state.components,c.state.components);
  const old=structuredClone(saved);old.snapshot.cars.forEach(c=>delete c.components);legacy.restore(old);assert.deepEqual(legacy.sim.cars[0].state.components,c.state.components);
  for(const s of [restored.sim,legacy.sim]){s.step(humans);assert.ok(s.cars[0].controller.wheelSuspensionStiffness(0)!<30);assert.equal(s.recover(0),true);assert.deepEqual(s.cars[0].state.components,freshComponents());assert.deepEqual(s.snapshot(true).cars[0].dents,[]);s.step(humans);assert.equal(s.cars[0].controller.wheelSuspensionStiffness(0),30);}
  const race=new Simulation(R,'race');try{race.phase='playing';race.cars[0].state.components=structuredClone(c.state.components);const condition=structuredClone(race.cars[0].state.components);assert.equal(race.recover(0),true);assert.deepEqual(race.cars[0].state.components,condition);assert.equal(race.cars[0].state.penalty,5);}finally{race.dispose();}
  saved.snapshot.cars[0].components!.wheelDamage[0]=0;assert.notEqual(c.state.components!.wheelDamage[0],0,'persistence does not alias live arrays');
 }finally{room.sim.dispose();restored.sim.dispose();legacy.sim.dispose();}
});

test('snapshot validation rejects malformed corner data and accepts legacy snapshots',()=>{
 const sim=new Simulation(R);try{const base=envelope(sim);assert.ok(validOnlineSnapshot(base));for(const bad of [null,{},freshComponents().wheelDamage,{wheelDamage:[1,2,3,4],wheelShift:freshComponents().wheelShift},{wheelDamage:[NaN,0,0,0],wheelShift:freshComponents().wheelShift},{wheelDamage:[0,0,0,0],wheelShift:[{x:1,y:0,z:0},...freshComponents().wheelShift.slice(1)]}]){const s=structuredClone(base);s.cars[0].components=bad as any;assert.equal(validOnlineSnapshot(s),false);}
 const old=structuredClone(base);old.cars.forEach(c=>delete c.components);assert.ok(validOnlineSnapshot(old));
 }finally{sim.dispose();}
});

test('online rendering uses authoritative corner condition even when visual impact packets were missed',()=>{
 const sim=new Simulation(R),world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();let cars:Vehicle[]=[];
 const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}}as any,()=>cars,c=>cars=c);
 try{
  const s=envelope(sim);delete s.cars[0].dents;applyComponentImpact(s.cars[0].components!,'coupe',{x:-.95,y:-.14,z:1.4},{x:.8,y:0,z:-.6},40);view.receive(s);
  const c=cars.find(c=>c.id===0)!;assert.deepEqual(Array.from(c.wreckParts.wheelDamage),s.cars[0].components!.wheelDamage);c.wreckParts.wheelsPose();near(c.wheels[0].position.x,anchors.coupe.wheels[0].x+s.cars[0].components!.wheelShift[0].x);
  const repaired=structuredClone(s);repaired.cars.forEach(c=>delete c.dents);repaired.tick++;repaired.cars[0].repair++;repaired.cars[0].components=freshComponents();view.receive(repaired);c.wreckParts.wheelsPose();assert.deepEqual(Array.from(c.wreckParts.wheelDamage),[0,0,0,0]);near(c.wheels[0].position.x,anchors.coupe.wheels[0].x);
 }finally{cars.forEach(c=>c.dispose());world.free();sim.dispose();}
});
test('online damage source changes retain exact preceding bytes',verifyOnlineDamageRevision);
