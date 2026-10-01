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
import {structuralDamage} from '../src/bodywork-response';
import {OnlineView} from '../src/online-view';
await R.init();
const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const humans=new Set([0,1,2,3,4,5,6,7]);
const envelope=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const near=(a:number,b:number,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
function browserContacts(world:R.World,queue:R.EventQueue,cars:Vehicle[],time:number,seen:Map<string,number>,race=false){
 queue.drainContactForceEvents(e=>{
  const h1=e.collider1(),h2=e.collider2(),key=Math.min(h1,h2)+':'+Math.max(h1,h2);if(time-(seen.get(key)??-100)<.28)return;
  const a=cars.find(c=>c.collider.handle===h1||c.roof.handle===h1),b=cars.find(c=>c.collider.handle===h2||c.roof.handle===h2);if(!a&&!b)return;
  const point=(a??b)!.current.clone(),normal=new T.Vector3();world.contactPair(world.getCollider(h1),world.getCollider(h2),m=>{if(m.numSolverContacts()){point.copy(m.solverContactPoint(0));normal.copy(m.normal());}});
  const va=a?.velocity??new T.Vector3(),vb=b?.velocity??new T.Vector3(),relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length(),impulse=e.totalForceMagnitude()*STEP;
  if(closing<.65||impulse<1500)return;seen.set(key,time);const damage=structuralDamage(impulse,closing)*(race?.45:1);
  for(const [car,other,direction]of [[a,b,relative],[b,a,relative.clone().negate()]]as const)if(car){const health=car.health;car.hit(point,direction.clone().normalize(),damage,time,true);if(other)other.inflicted+=health-car.health;}
 });
}

test('online tuned and armored collisions match independent solo damage and subsequent handling for every car',()=>{
 for(const kind of ['coupe','sedan','hatch']as const)for(const mode of ['playground','race']as const){
  const setups=[0,1].map(i=>({...stockSetup(kind),engine:i?1:3,armor:i?1:3,tires:2,tune:{gearing:.65,suspension:-.4,steering:.3,brakeBias:-.5,differential:.7}}));
  const authority=new Simulation(R,mode,Array(8).fill(kind),8,setups),terrain=new Simulation(R,mode),queue=new R.EventQueue(true),scene=new T.Scene(),cars=[0,1].map(i=>new Vehicle(i,kind,0xffffff,scene,terrain.world,fx,setups[i]));
  authority.cars.slice(2).forEach(c=>c.body.setEnabled(false));terrain.cars.forEach(c=>c.body.setEnabled(false));authority.phase='playing';const seen=new Map<string,number>();
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
