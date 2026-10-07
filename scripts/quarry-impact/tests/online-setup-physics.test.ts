import {createQuarryPhysics} from '../src/quarry-layout';
import {stockSetup} from '../src/garage';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {Simulation} from '../multiplayer/simulation';
import {STEP,type Snapshot} from '../multiplayer/protocol';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import {OnlineView} from '../src/online-view';
await R.init();
const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const humans=new Set([0,1,2,3,4,5,6,7]);
const envelope=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const near=(a:number,b:number,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
function browserContacts(world:R.World,queue:R.EventQueue,cars:Vehicle[],time:number,judge:ImpactAdjudicator,race=false){
 const contacts:(ImpactContact&{a?:Vehicle;b?:Vehicle;point1:T.Vector3;point2:T.Vector3;relative:T.Vector3})[]=[];
 queue.drainContactForceEvents(e=>{
  const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(world,cars,h1,h2);if((!a&&!b)||!judge.needsContact(key,time))return;
  const manifold=vehicleContactManifold(world,h1,h2),normal=new T.Vector3().copy(manifold?.normal??{x:0,y:0,z:0});
  const point1=new T.Vector3().copy(manifold?.point1??(a??b)!.current),point2=new T.Vector3().copy(manifold?.point2??(b??a)!.current);
  const va=a?.velocity??new T.Vector3(),vb=b?.velocity??new T.Vector3(),relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length(),impulse=e.totalForceMagnitude()*STEP;
  contacts.push({a,b,key,point1,point2,relative,closing,impulse,damageScale:Math.max(a&&a.health>0?a.specification.damageScale:0,b&&b.health>0?b.specification.damageScale:0)});
 });
 for(const {contact:{a,b,point1,point2,relative},damage} of judge.adjudicate(contacts,time,race?.45:1)){
  for(const [car,other,direction,point]of [[a,b,relative,point1],[b,a,relative.clone().negate(),point2]]as const)if(car){const health=car.health;car.hit(point,direction.clone().normalize(),damage,time,true);if(other)other.inflicted+=health-car.health;}
 }
}

test('online tuned and armored collisions match independent solo damage and subsequent handling for every car',()=>{
 for(const kind of ['coupe','sedan','hatch']as const)for(const mode of ['playground','race']as const){
  const setups=[0,1].map(i=>({...stockSetup(kind),engine:i?1:3,armor:i?1:3,tires:2,tune:{gearing:.65,suspension:-.4,steering:.3,brakeBias:-.5,differential:.7}}));
  // Build independent solo terrain directly: leftover disabled vehicles changed
  // collider handles/CCD traversal order without representing a real solo field.
  const authority=new Simulation(R,mode,Array(8).fill(kind),8,setups),terrain={world:new R.World({x:0,y:-9.81,z:0}),dispose(){this.world.free();}},queue=new R.EventQueue(true),scene=new T.Scene();terrain.world.timestep=STEP;createQuarryPhysics(R,terrain.world,false);const cars=[0,1].map(i=>new Vehicle(i,kind,0xffffff,scene,terrain.world,fx,setups[i]));
  cars.forEach((c,i)=>{assert.equal(c.body.handle,authority.cars[i].body.handle);assert.equal(c.collider.handle,authority.cars[i].collider.handle);});
  authority.cars.slice(2).forEach(c=>c.body.setEnabled(false));authority.phase='playing';const seen=new ImpactAdjudicator();
  cars.forEach((c,i)=>{c.place(i*.65,(i?1:-1)*4,i?Math.PI:0);c.body.setLinvel({x:0,y:0,z:i?-22:22},true);const a=authority.cars[i];a.body.setTranslation(c.body.translation(),true);a.body.setRotation(c.body.rotation(),true);a.body.setLinvel(c.body.linvel(),true);Object.assign(a.state,{p:{...c.body.translation()},q:{...c.body.rotation()},v:{...c.body.linvel()}});});
  try{
   for(let tick=1;tick<=150;tick++){
    for(const c of cars){c.input={throttle:tick>80?.45:0,steer:tick>100?.15:0,brake:0,handbrake:false};authority.setInput(c.id,c.input);c.preStep(STEP);}terrain.world.step(queue);cars.forEach(c=>c.postStep(STEP,tick*STEP));browserContacts(terrain.world,queue,cars,tick*STEP,seen,mode==='race');authority.step(humans);
    cars.forEach((c,i)=>{const a=authority.cars[i].state;near(c.health,a.health,.001);near(c.inflicted,a.inflicted,.001);assert.ok(c.current.distanceTo(new T.Vector3().copy(a.p))<.002,`${kind} ${mode} position tick ${tick}`);c.wreckParts.wheelDamage.forEach((d,j)=>near(d,a.components!.wheelDamage[j],.0001));c.wreckParts.wheelShift.forEach((v,j)=>{near(v.x,a.components!.wheelShift[j].x,.0001);near(v.z,a.components!.wheelShift[j].z,.0001);});c.tyreDamage!.forEach((d,j)=>near(d,a.components!.tyreDamage![j],.0001));});
   }
   assert.ok(authority.damage.length>=2);assert.ok(authority.cars.slice(0,2).every(c=>c.state.health<99));assert.ok(authority.cars.slice(0,2).some(c=>c.state.components!.wheelDamage.some(d=>d>.01)));
  }finally{cars.forEach(c=>c.dispose());queue.free();authority.dispose();terrain.dispose();}
 }
});


test('online renderer uses confirmed paint/specification and applies armored dent damage exactly once',()=>{
 const setup={...stockSetup('coupe'),engine:3,armor:3,paint:0x36aa88,trim:0xcccccc};
 const sim=new Simulation(R,'playground',[],8,[setup]),world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();let cars:Vehicle[]=[];
 const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}}as any,()=>cars,c=>cars=c);
 try{
  const s=envelope(sim),car=s.cars[0];car.health=80;car.dents=[{id:1,localPoint:{x:-.95,y:-.14,z:1.4},localDirection:{x:1,y:0,z:0},damage:20,repair:0}];view.receive(s);
  const rendered=cars.find(c=>c.id===0)!;assert.equal(rendered.paintColor.getHex(),setup.paint);assert.equal(rendered.specification.mass,sim.cars[0].specification.mass);near(rendered.lastDamage,20);assert.equal(rendered.health,80);
  const next=structuredClone(s);next.tick++;next.cars.forEach(c=>delete c.dents);view.receive(next);assert.equal(cars.find(c=>c.id===0),rendered,'unchanged setup must not rebuild the car every snapshot');
  const restart=structuredClone(next);restart.tick=0;restart.cars[0].setup={...setup,paint:0x8855aa,engine:0};restart.cars[0].health=100;view.receive(restart);assert.notEqual(cars.find(c=>c.id===0),rendered);assert.equal(cars.find(c=>c.id===0)!.paintColor.getHex(),0x8855aa);
 }finally{cars.forEach(c=>c.dispose());sim.dispose();world.free();}
});
