import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {CINDERBANK,CINDERBANK_SOLIDS,CINDERBANK_BARRIERS} from '../src/cinderbank-course';
import {createCinderbankWorld} from '../src/cinderbank-world';
import {courseGridSlot,courseRoute,courseRecoverySlot,getRaceCourse} from '../src/race-course';
import {COURSE_NAMES} from '../src/course-id';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
import {stockSetup} from '../src/garage';
import {checkRoute,directionForCar} from '../src/event-rules';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {drivingObstacleClearance} from '../src/driving-probe';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
await R.init();
const dt=1/60,near=(a:number,b:number,e=1e-5)=>assert.ok(Math.abs(a-b)<=e,`${a} differs from ${b}`);
const state=():PhysicsState=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}});

test('Cinderbank has tangent-continuous equal-distance lanes, distinct grip and bounded ordered checkpoints',()=>{
 assert.equal(CINDERBANK.name,COURSE_NAMES['cinderbank-oval-v1']);assert.equal(getRaceCourse(CINDERBANK.id),CINDERBANK);
 near(CINDERBANK.length,240+116*Math.PI,0);assert.deepEqual(CINDERBANK.point(0),{x:0,z:-58});assert.deepEqual(CINDERBANK.point(1),CINDERBANK.point(0));assert.deepEqual(CINDERBANK.point(-.25),CINDERBANK.point(.75));
 assert.equal(CINDERBANK.checkpoints.length,24);assert.equal(CINDERBANK.halfWidth,12);
 for(let i=0;i<384;i++){const p=CINDERBANK.point(i/384),q=CINDERBANK.point((i+1)/384);near(CINDERBANK.distance(p.x,p.z),0);near(Math.hypot(q.x-p.x,q.z-p.z),CINDERBANK.length/384,.0001);assert.equal(CINDERBANK.height(p.x,p.z),0);assert.equal(CINDERBANK.outside(p.x,0,p.z),false);}
 for(const s of [60,60+58*Math.PI,180+58*Math.PI,180+116*Math.PI]){const t=s/CINDERBANK.length,a=CINDERBANK.point(t-.000001),b=CINDERBANK.point(t),c=CINDERBANK.point(t+.000001),u=new T.Vector2(b.x-a.x,b.z-a.z).normalize(),v=new T.Vector2(c.x-b.x,c.z-b.z).normalize();assert.ok(u.dot(v)>.999999,'straight and bend tangents join smoothly');}
 for(const x of [-50,0,50])for(const z of [-58,58])assert.equal(CINDERBANK.surface(x,z),'asphalt');
 for(const [x,z]of [[118,0],[-118,0],[0,0],[0,75]])assert.equal(CINDERBANK.surface(x,z),'gravel');
 for(let i=0;i<24;i++){const a=CINDERBANK.checkpoints[i],b=CINDERBANK.checkpoints[(i+1)%24];assert.ok(Math.hypot(b.x-a.x,b.z-a.z)>24,'consecutive12m gate areas cannot overlap');assert.equal(checkRoute(CINDERBANK.checkpoints,0,0,i,Infinity).passed,false,'infield shortcut cannot trigger gates');}
 assert.equal(CINDERBANK.outside(160,0,105),false);assert.equal(CINDERBANK.outside(160.01,0,0),true);assert.equal(CINDERBANK.outside(0,-8.01,0),true);
 for(const barrier of CINDERBANK_BARRIERS)assert.ok(CINDERBANK.distance(barrier.x,barrier.z)>14.9,'barrier centre is well beyond the12m lane');
});

test('visible barrier instances and ground grip match owned physical solids, with repeatable resource disposal',()=>{
 const artwork=createCinderbankWorld(),world=new R.World({x:0,y:0,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed());world.createCollider(R.ColliderDesc.ball(.1),sentinel);
 const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>(),instances:T.InstancedMesh[]=[],matrices:T.Matrix4[]=[];
 artwork.root.traverse(o=>{assert.equal(o.matrixAutoUpdate,false);if(o instanceof T.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}if(o instanceof T.InstancedMesh){instances.push(o);for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}}});
 let disposed=0;for(const resource of [...geometries,...materials,...textures,...instances])resource.addEventListener('dispose',()=>disposed++);
 try{
  const owned=CINDERBANK.buildPhysics(R,world);assert.equal(owned.length,CINDERBANK_SOLIDS.length+1);assert.equal(world.bodies.len(),owned.length+1);assert.equal(world.colliders.len(),owned.length+1);world.step();
  const floor=world.getRigidBody(owned[0])!.collider(0);assert.deepEqual({...floor.halfExtents()},{x:165,y:.5,z:110});near(floor.translation().y,-.5);
  CINDERBANK_SOLIDS.forEach((solid,i)=>{const body=world.getRigidBody(owned[i+1])!,c=body.collider(0);near(body.translation().x,solid.x);near(body.translation().y,solid.y);near(body.translation().z,solid.z);near(body.rotation().y,Math.sin(solid.yaw/2));near(body.rotation().w,Math.cos(solid.yaw/2));const h=c.halfExtents();near(h.x,solid.half[0]);near(h.y,solid.half[1]);near(h.z,solid.half[2]);const expected=new T.Matrix4().compose(new T.Vector3(solid.x,solid.y,solid.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),solid.yaw),new T.Vector3(...solid.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,j)=>Math.abs(v-expected.elements[j])<1e-5)),'actual rendered instance matches '+solid.id);});
  const {width,height,spanX,spanZ,road}=artwork.groundCoverage;
  for(const [x,z]of [[0,-58],[-45,58],[118,0],[-118,0],[0,0],[0,76]]){const col=Math.floor((x+spanX/2)/spanX*width),row=Math.floor((spanZ/2-z)/spanZ*height);assert.equal(road[(row*width+col)*4+3]>0,CINDERBANK.surface(x,z)==='asphalt');}
  for(const handle of owned)world.removeRigidBody(world.getRigidBody(handle)!);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);assert.equal(world.getRigidBody(sentinel.handle),sentinel);
 }finally{world.free();artwork.dispose();artwork.dispose();}
 assert.equal(disposed,geometries.size+materials.size+textures.size+instances.length,'every GPU-owned resource disposed once');assert.equal(artwork.root.children.length,0);
});

test('partial Cinderbank physics construction rolls back only its own allocations',()=>{
 const world=new R.World({x:0,y:0,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed());world.createCollider(R.ColliderDesc.ball(.1),sentinel);const create=world.createCollider.bind(world);let calls=0;
 world.createCollider=((...args:Parameters<typeof create>)=>{if(++calls===7)throw Error('allocation failed');return create(...args);})as typeof world.createCollider;
 try{assert.throws(()=>CINDERBANK.buildPhysics(R,world),/allocation failed/);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);assert.equal(world.getRigidBody(sentinel.handle),sentinel);}finally{world.free();}
});

test('24 stock and armored mixed cars fit and settle on forward, reverse and opposing grids without contacts',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const armor of [0,3]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;CINDERBANK.buildPhysics(R,world);
  const cars=Array.from({length:24},(_,id)=>{const kind=CAR_KINDS[id%11],spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),car=createVehiclePhysics(R,world,kind,spec.mass,armor),grid=courseGridSlot(CINDERBANK,id,direction);car.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);return{...car,kind,spec,grid,s:state()};});
  try{
   const handles=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(const c of cars)for(const sx of [-1,1])for(const sz of [-1,1]){const d=DEFINITIONS[c.kind],x=c.grid.x+Math.cos(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.sin(c.grid.yaw)*sz*(d.halfLength+.25),z=c.grid.z-Math.sin(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.cos(c.grid.yaw)*sz*(d.halfLength+.25);assert.ok(CINDERBANK.distance(x,z)<12,'whole armored footprint stays inside racing lane');}
   for(let tick=0;tick<120;tick++){for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.s,dt,undefined,undefined,0,[0,0,0,0]);world.step();if(tick===0||tick===119)for(const c of cars)for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{const parent=other.parent();if(parent&&parent.handle!==c.body.handle&&handles.has(parent.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});}
   assert.equal(contacts,0,`${direction}/${armor} grid contact`);for(const c of cars){const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y>.45&&p.y<1.1);assert.ok(1-2*(q.x*q.x+q.z*q.z)>.95);assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15,'no grid overlap separation');}
  }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 }
});

test('tail-grid starts and recovery preserve a full ordered oval lap in both directions',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const id of [0,1,22,23]){
  const actual=directionForCar(direction,id),route=courseRoute(CINDERBANK,actual),grid=courseGridSlot(CINDERBANK,id,direction),sign=actual==='reverse'?-1:1,index=direction==='opposing'?Math.floor(id/2)*2:id,back=Math.floor(index/2)*7;let next=grid.next,passed=grid.passed,last=Infinity,walk=0;
  for(;walk<CINDERBANK.length+back+1;walk+=.5){const p=CINDERBANK.point(sign*(walk-back)/CINDERBANK.length),check=checkRoute(route,p.x,p.z,next,last,CINDERBANK.checkpointRadius);last=check.distance;if(check.passed){passed++;next=(next+1)%24;last=Infinity;if(passed===24)break;}}
  assert.equal(passed,24);assert.equal(next,1);assert.ok(walk>CINDERBANK.length+back-16.5&&walk<CINDERBANK.length+back-15.5,'tail cars cannot receive a shortened lap');
  for(const checkpoint of [1,6,12,18]){const recovery=courseRecoverySlot(CINDERBANK,checkpoint,actual),at=route[(checkpoint+23)%24],to=route[checkpoint];assert.deepEqual({x:recovery.x,z:recovery.z},at);near(recovery.yaw,Math.atan2(to.x-at.x,to.z-at.z),0);}
 }
});

test('omitted and undefined gate radii preserve the exact old Quarry and Ironfield boundary behavior',()=>{
 for(const id of ['quarry-v1','ironfield-figure-eight-v1']as const)for(const direction of ['forward','reverse']as const){
  const route=courseRoute(getRaceCourse(id),direction);
  for(let next=0;next<route.length;next++)for(const radius of [0,11.999,12,12.001,40])for(const angle of [0,.4,Math.PI/2])for(const last of [0,12,Infinity]){
   const p=route[next],x=p.x+Math.cos(angle)*radius,z=p.z+Math.sin(angle)*radius,distance=Math.hypot(x-p.x,z-p.z),expected={passed:distance<12&&distance<last,distance};
   assert.deepEqual(checkRoute(route,x,z,next,last),expected);assert.deepEqual(checkRoute(route,x,z,next,last,undefined),expected);
  }
 }
});

test('legal shoulder lines complete every ordered gate with the course radius while old default remains exact',()=>{
 const route=courseRoute(CINDERBANK,'forward');
 assert.equal(checkRoute(route,0,-71.3,0,Infinity).passed,false,'the old12m default exposes the shoulder gap');
 assert.equal(checkRoute(route,0,-71.3,0,Infinity,CINDERBANK.checkpointRadius).passed,true,'the newcourse accepts a legal shoulder driver');
 for(const direction of ['forward','reverse']as const)for(const lane of [-13.3,13.3]){
  const route=courseRoute(CINDERBANK,direction),sign=direction==='reverse'?-1:1;let next=1,passed=0,last=Infinity;
  for(let walk=0;walk<CINDERBANK.length+1&&passed<24;walk+=.25){const t=sign*walk/CINDERBANK.length,p=CINDERBANK.point(t),q=CINDERBANK.point(t+sign*.000001),yaw=Math.atan2(q.x-p.x,q.z-p.z),x=p.x+Math.cos(yaw)*lane,z=p.z-Math.sin(yaw)*lane,check=checkRoute(route,x,z,next,last,CINDERBANK.checkpointRadius);last=check.distance;if(check.passed){passed++;next=(next+1)%24;last=Infinity;}}
  assert.equal(passed,24,`${direction} shoulder${lane} must not silently miss a gate`);assert.equal(next,1);
 }
});

test('every stock vehicle completes actual forward and reverse laps with normal driving controls and no barrier strikes',t=>{
 const results:string[]=[];
 for(const kind of CAR_KINDS)for(const direction of ['forward','reverse']as const){
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=CINDERBANK.buildPhysics(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(CINDERBANK,0,direction),s=state(),route=courseRoute(CINDERBANK,direction),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=grid.passed,last=Infinity,strikes=0,ticks=0,maxRoadDistance=0,minUp=1,asphalt=0,gravel=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=CINDERBANK.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray(driver.current,{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<7200&&passed<24;ticks++){
    s.input=brain.update(driver,[driver],'race',dt,probe,route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,CINDERBANK.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}
    maxRoadDistance=Math.max(maxRoadDistance,CINDERBANK.distance(driver.current.x,driver.current.z));const q=car.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(driver.surface==='asphalt')asphalt++;else gravel++;
   }
   assert.equal(passed,24,`${kind}/${direction} completes a real lap`);assert.equal(strikes,0,`${kind}/${direction} barrier strikes`);assert.ok(maxRoadDistance<10,`${kind}/${direction} stays in broad lane (${maxRoadDistance})`);assert.ok(minUp>.95,'flat course remains upright');assert.ok(asphalt>120&&gravel>120,'actual controller crosses both surface types');assert.equal(brain.memory.get(0)!.attempts,0,'no recovery/reverse escape required');results.push(`${kind}/${direction} ${(ticks*dt).toFixed(2)}s`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(results.join('; '));
});

test('visible outer and inner barriers physically stop a fast stock and armored car',()=>{
 for(const armor of [0,3])for(const side of [-1,1]){
  const world=new R.World({x:0,y:0,z:0}),events=new R.EventQueue(true);world.timestep=dt;CINDERBANK.buildPhysics(R,world);const kind:CarKind='van',spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),car=createVehiclePhysics(R,world,kind,spec.mass,armor);car.body.setTranslation({x:30,y:.89,z:-58},true);car.body.setRotation({x:0,y:side<0?1:0,z:0,w:side<0?0:1},true);car.body.setLinvel({x:0,y:0,z:side*32},true);let contacts=0,impulse=0;
  try{for(let tick=0;tick<60;tick++){world.step(events);events.drainContactForceEvents(e=>{contacts++;impulse=Math.max(impulse,e.totalForceMagnitude()*dt);});}assert.ok(contacts>0&&impulse>1500,'actual high-speed wall impact');assert.ok(Math.abs(car.body.translation().z+58)<15,'visible barrier prevents passage');assert.ok(car.body.linvel().z*side<8,'barrier removes outward speed');}finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
});
