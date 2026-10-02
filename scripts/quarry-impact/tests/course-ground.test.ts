import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle,type VehicleGround} from '../src/vehicle';
import {Effects} from '../src/effects';
import {DemoDirector,type DemoCamera} from '../src/demo-director';
import {CAR_KINDS,DEFINITIONS,surfaceAt} from '../src/rules';
import {landscapeHeight} from '../src/quarry-layout';
import {IRONFIELD} from '../src/ironfield-course';
import {captureReplayFrame} from '../src/replay-scene';

await R.init();
const originalLoad=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
// Rapier also reads window.performance when a DOM shim is present.
const windowBefore=Object.getOwnPropertyDescriptor(globalThis,'window');Object.defineProperty(globalThis,'window',{configurable:true,value:{innerHeight:720,performance:globalThis.performance}});
after(()=>{if(windowBefore)Object.defineProperty(globalThis,'window',windowBefore);else delete (globalThis as any).window;});
const dt=1/60,quarry:VehicleGround={height:landscapeHeight,surface:surfaceAt},quiet={emit(){},mark(){},detach(){},evidence:{add(){}}} as any;
const near=(a:number,b:number,epsilon=1e-6)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
const body=(car:Vehicle)=>({p:{...car.body.translation()},q:{...car.body.rotation()},v:{...car.body.linvel()},w:{...car.body.angvel()},surface:car.surface,health:car.health,engine:car.engineDamage,tyres:car.tyreDamage,wheels:Array.from(car.wreckParts.wheelDamage),shift:car.wreckParts.wheelShift.map(v=>v.toArray())});
function releaseFx(fx:Effects){fx.reset();for(const mesh of [fx.points,fx.marks,fx.evidence.mesh]){mesh.removeFromParent();mesh.geometry.dispose();for(const m of (Array.isArray(mesh.material)?mesh.material:[mesh.material])as T.MeshBasicMaterial[]){m.map?.dispose();m.dispose();}}}

test('all eleven actual vehicles retain exact placement, dynamics, damage and recovery with omitted versus explicit Quarry samplers',()=>{
 for(const kind of CAR_KINDS){
  const worlds=[new R.World({x:0,y:-9.81,z:0}),new R.World({x:0,y:-9.81,z:0})],cars=worlds.map((world,i)=>new Vehicle(0,kind,DEFINITIONS[kind].color,new T.Scene(),world,quiet,undefined,i?quarry:undefined));
  try{
   for(const [x,z]of [[0,0],[77.8,64],[-55,-55]]){cars.forEach(c=>c.place(x,z,.4));assert.deepEqual(body(cars[0]),body(cars[1]),kind+' original placement');near(cars[0].current.y,landscapeHeight(x,z)+.89);}
   worlds.forEach(w=>{w.timestep=dt;w.createCollider(R.ColliderDesc.cuboid(250,.5,250).setTranslation(0,-.5,0));});cars.forEach(c=>c.place(0,0,0));
   for(let step=0;step<180;step++){
    for(const c of cars){
     if(step===65){c.root.updateMatrixWorld(true);c.hit(new T.Vector3(.45,-.15,1.7).applyQuaternion(c.currentQ).add(c.current),new T.Vector3(0,0,-1).applyQuaternion(c.currentQ),12,step*dt,true);}
     if(step===130)c.place(1,1,.2,true);
     c.input={throttle:step<30?0:step<100?.8:step<130?-.5:.6,steer:step>70?.23:0,brake:step>=100&&step<120?.4:0,handbrake:step>=120&&step<130};c.preStep(dt);
    }
    worlds.forEach(w=>w.step());cars.forEach(c=>{c.postStep(dt,step*dt);c.render(1);});
    assert.deepEqual(body(cars[0]),body(cars[1]),`${kind} tick${step}`);assert.deepEqual(captureReplayFrame([cars[0]],[],[0],1),captureReplayFrame([cars[1]],[],[0],1),kind+' visual/contact state');
   }
  }finally{cars.forEach(c=>c.dispose());worlds.forEach(w=>w.free());}
 }
});

test('Ironfield uses its actual road contacts for surface, wet tread and skid decals instead of Quarry terrain',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),owned=IRONFIELD.buildPhysics(R,world),fx=new Effects(scene,world,IRONFIELD.height),car=new Vehicle(0,'tern',DEFINITIONS.tern.color,scene,world,fx,undefined,IRONFIELD),road=IRONFIELD.point(0);
 try{
  assert.equal(surfaceAt(road.x,road.z),'gravel');assert.ok(Math.abs(landscapeHeight(road.x,road.z))>.3,'Fixture distinguishes the two ground maps');
  car.place(road.x,road.z,Math.PI/2);near(car.current.y,.89);world.timestep=dt;
  for(let i=0;i<120;i++){car.preStep(dt);world.step();car.postStep(dt,i*dt);car.render(1);}
  assert.equal(car.surface,'asphalt');assert.equal([0,1,2,3].filter(i=>car.controller.wheelIsInContact(i)).length,4);assert.equal(car.waters.length,0);assert.equal(car.arenaSurface,undefined);
  car.body.setLinvel({x:8,y:0,z:0},true);car.input={throttle:.6,steer:0,brake:0,handbrake:true};car.surfaceFinish.water.fill(.8);car.preStep(dt);world.step();car.postStep(dt,3);car.render(1);
  assert.ok(fx.evidence.stats.wet>=4,'Actual wet tyre contacts leave traces on Ironfield, despite the different Quarry height');assert.ok(fx.markCursor>=4,'Asphalt contact selects real skid marks');
  const matrix=new T.Matrix4();for(let i=0;i<fx.markCursor;i++){fx.marks.getMatrixAt(i,matrix);near(matrix.elements[13],.035,1e-5);}for(let i=0;i<fx.evidence.stats.count;i++){fx.evidence.mesh.getMatrixAt(i,matrix);near(matrix.elements[13],.012,1e-5);}
  const marks=fx.markCursor;car.place(135,-70,0);car.input={throttle:0,steer:0,brake:0,handbrake:false};for(let i=0;i<120;i++){car.preStep(dt);world.step();car.postStep(dt,4+i*dt);}
  assert.equal(car.surface,'gravel');assert.ok([0,1,2,3].some(i=>car.controller.wheelIsInContact(i)));car.body.setLinvel({x:4,y:0,z:8},true);car.input.handbrake=true;car.preStep(dt);world.step();car.postStep(dt,8);
  assert.equal(fx.markCursor,marks,'Off-road gravel cannot create an asphalt skid');assert.ok(fx.particles.some(p=>p.life>0&&p.type===0),'Actual gravel contacts emit dust');assert.ok(Array.from(fx.evidence.data).some((value,i)=>i%4===0&&value===1),'Gravel contact leaves displaced dirt');
 }finally{car.dispose();releaseFx(fx);for(const handle of owned){const b=world.getRigidBody(handle);if(b)world.removeRigidBody(b);}assert.equal(world.bodies.len(),0);world.free();}
});

test('impact dust uses the venue height and the optional Effects sampler preserves the original Quarry result',()=>{
 const world=new R.World({x:0,y:0,z:0}),effects=[new Effects(new T.Scene(),world),new Effects(new T.Scene(),world,landscapeHeight),new Effects(new T.Scene(),world,IRONFIELD.height)],p=IRONFIELD.point(0),at=new T.Vector3(p.x,.4,p.z),random=Math.random;
 try{
  Math.random=()=>.5;for(const fx of effects)fx.impact(at,new T.Vector3(1,0,0),20);
  const particles=(fx:Effects)=>fx.particles.filter(p=>p.life>0).map(p=>({...p,p:p.p.toArray(),v:p.v.toArray()}));assert.deepEqual(particles(effects[0]),particles(effects[1]));
  const dust=effects.map(fx=>fx.particles.filter(p=>p.life>0&&p.type===0));assert.ok(dust.every(p=>p.length>0));for(const p of dust[2])near(p.p.y,.25);for(const p of dust[0])near(p.p.y,landscapeHeight(at.x,at.z)+.25);
 }finally{Math.random=random;effects.forEach(releaseFx);world.free();}
});

const cameraRig=()=>({camera:new T.PerspectiveCamera(52,16/9,.1,850),orbit:{target:new T.Vector3(),update(){}} as any});
const horizon=(camera:T.Camera)=>Math.abs(new T.Vector3(1,0,0).applyQuaternion(camera.quaternion).y);
test('all demo views retain exact Quarry poses when the original height sampler is explicit',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'tern',DEFINITIONS.tern.color,new T.Scene(),world,quiet);
 try{for(const view of ['director','drone','chase','hood','overview','trackside','orbit'] as DemoCamera[]){
  const directors=[new DemoDirector(),new DemoDirector(undefined,undefined,landscapeHeight)],rigs=[cameraRig(),cameraRig()];directors.forEach(d=>d.select(view));
  for(let step=0;step<150;step++){const x=60+step*.03,z=50+Math.sin(step*.03)*3;car.root.position.set(x,landscapeHeight(x,z)+.85,z);car.root.rotation.y=step*.017;car.speed=12;
   directors.forEach((d,i)=>d.update([car],rigs[i].camera,rigs[i].orbit,dt,true));assert.deepEqual(rigs[0].camera.position.toArray(),rigs[1].camera.position.toArray(),view);assert.deepEqual(rigs[0].camera.quaternion.toArray(),rigs[1].camera.quaternion.toArray(),view);assert.deepEqual(rigs[0].orbit.target.toArray(),rigs[1].orbit.target.toArray());assert.equal(directors[0].followed,directors[1].followed);
  }
 }}finally{car.dispose();world.free();}
});

test('Ironfield camera terrain, obstructed recovery and low-frame-rate updates preserve the existing horizon and angular bounds',()=>{
 const world=new R.World({x:0,y:0,z:0}),car=new Vehicle(0,'tern',DEFINITIONS.tern.color,new T.Scene(),world,quiet,undefined,IRONFIELD),road=IRONFIELD.point(0);
 try{
  for(const view of ['director','drone','chase'] as DemoCamera[]){let queries=0;const terrain=(x:number,z:number)=>{assert.ok(Number.isFinite(x)&&Number.isFinite(z));queries++;return IRONFIELD.height(x,z);};
   const director=new DemoDirector(undefined,(_from,to)=>to.y<9?1:null,terrain),{camera,orbit}=cameraRig();director.select(view);car.place(road.x,road.z,0);car.speed=8;
   for(let i=0;i<300;i++){if(i===100){car.place(road.x-50,road.z-40,Math.PI);car.root.rotation.z=.5;}const rotation=camera.quaternion.clone();director.update([car],camera,orbit,.05,true);
    if(i)assert.ok(rotation.angleTo(camera.quaternion)<=.05*Math.PI/6+1e-6,'Course sampling cannot bypass30degrees/second');assert.ok(horizon(camera)<1e-10);assert.ok(camera.position.y>=.65);assert.ok(camera.position.toArray().every(Number.isFinite));assert.equal(director.followed,0);
   }
   assert.ok(queries>300,'Sightline, avoidance and final terrain checks use the supplied sampler');assert.ok(orbit.target.distanceTo(car.root.position)<1.3,'Recovery reaches the same car instead of freezing');
  }
  car.place(road.x,road.z,0);const flat=new DemoDirector(undefined,undefined,IRONFIELD.height),legacy=new DemoDirector(),a=cameraRig(),b=cameraRig();flat.select('trackside');legacy.select('trackside');flat.update([car],a.camera,a.orbit,dt,true);legacy.update([car],b.camera,b.orbit,dt,true);assert.notEqual(a.camera.position.y,b.camera.position.y,'Trackside anchor cannot use the old Quarry terrain');
 }finally{car.dispose();world.free();}
});
