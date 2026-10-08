import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES,isCourseId,resolveCourseId} from '../src/course-id';
import {IRONFIELD,IRONFIELD_BARRIERS,IRONFIELD_SOLIDS} from '../src/ironfield-course';
import {QUARRY_COURSE,getRaceCourse,courseRoute,courseGridSlot,courseRecoverySlot,type CourseDirection} from '../src/race-course';
import {CAR_KINDS,CHECKPOINTS,trackPoint,surfaceAt,DEFINITIONS} from '../src/rules';
import {landscapeHeight} from '../src/quarry-layout';
import {circuitRoute,raceGridSlot,checkRoute,directionForCar} from '../src/event-rules';
import {stockSetup} from '../src/garage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {vehicleContact} from '../src/vehicle-contact';

await R.init();
const dt=1/60;
const near=(a:number,b:number,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const state=():PhysicsState=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}});
const directions:CourseDirection[]=['forward','reverse','opposing'];

test('persistent course identities are bounded and old or invalid settings retain Quarry',()=>{
 assert.deepEqual(Object.keys(COURSE_NAMES),['quarry-v1','ironfield-figure-eight-v1','cinderbank-oval-v1','bracken-rallycross-v1','ashford-autodrome-v1','redbank-jump-v1']);
 for(const value of [undefined,null,0,{},[],true,'','ironfield','../../track','toString','constructor']){assert.equal(isCourseId(value),false);assert.equal(resolveCourseId(value),'quarry-v1');}
 assert.equal(resolveCourseId('ironfield-figure-eight-v1'),IRONFIELD.id);assert.equal(getRaceCourse('quarry-v1'),QUARRY_COURSE);assert.equal(getRaceCourse(IRONFIELD.id),IRONFIELD);
});

test('Quarry course adapters preserve original routes, all grids and terrain arithmetic exactly',()=>{
 assert.equal(QUARRY_COURSE.checkpoints,CHECKPOINTS);assert.equal(QUARRY_COURSE.point,trackPoint);assert.equal(QUARRY_COURSE.height,landscapeHeight);assert.equal(QUARRY_COURSE.surface,surfaceAt);assert.equal(QUARRY_COURSE.buildPhysics,undefined,'existing Quarry world remains the physics owner');
 for(const direction of directions){assert.equal(courseRoute(QUARRY_COURSE,direction),circuitRoute(direction));for(let id=0;id<24;id++)assert.deepEqual(courseGridSlot(QUARRY_COURSE,id,direction),raceGridSlot(id,direction));}
 for(const [x,z]of [[0,0],[0,88],[88,0],[-110,-90],[175,20],[-230,140]]){
  let previous=Infinity;for(let k=0;k<100;k++){const p=trackPoint(k/100);previous=Math.min(previous,Math.hypot(x-p.x,z-p.z));}
  assert.equal(QUARRY_COURSE.distance(x,z),previous);assert.equal(QUARRY_COURSE.surface(x,z),surfaceAt(x,z));assert.equal(QUARRY_COURSE.height(x,z),landscapeHeight(x,z));
 }
 for(const p of [[255,0,0],[255.001,0,0],[0,-8,0],[0,-8.001,0]])assert.equal(QUARRY_COURSE.outside(...p as [number,number,number]),Math.hypot(p[0],p[2])>255||p[1]<-8);
});

test('Ironfield is a closed equal-distance original figure-eight with an open crossing',()=>{
 assert.ok(IRONFIELD.length>725&&IRONFIELD.length<727);assert.deepEqual(IRONFIELD.point(0),IRONFIELD.point(1));assert.deepEqual(IRONFIELD.point(-.25),IRONFIELD.point(.75));
 const steps=IRONFIELD.samples.map((p,i)=>{const next=IRONFIELD.samples[(i+1)%IRONFIELD.samples.length];return Math.hypot(p.x-next.x,p.z-next.z);});assert.ok(Math.min(...steps)>1.4&&Math.max(...steps)<1.43);
 assert.equal(IRONFIELD.checkpoints.length,24);assert.ok(IRONFIELD.distance(0,0)<.02);assert.equal(IRONFIELD.surface(0,0),'asphalt');assert.equal(IRONFIELD.surface(50,0),'gravel');assert.equal(IRONFIELD.height(110,64),0);
 assert.equal(IRONFIELD.outside(170,0,125),false);assert.equal(IRONFIELD.outside(170.01,0,0),true);assert.equal(IRONFIELD.outside(0,-8.01,0),true);
 assert.ok(IRONFIELD_BARRIERS.length>400);for(const b of IRONFIELD_BARRIERS)assert.ok(IRONFIELD.distance(b.x,b.z)>9.1);
 assert.equal(IRONFIELD_SOLIDS.length,IRONFIELD_BARRIERS.length+7);
});

test('course physics owns every exact visible OBB and removes without leaking or touching other bodies',()=>{
 const world=new R.World({x:0,y:0,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(200,10,200));world.createCollider(R.ColliderDesc.ball(.5),sentinel);
 try{
  for(let cycle=0;cycle<3;cycle++){
   const owned=IRONFIELD.buildPhysics(R,world),solids=IRONFIELD_SOLIDS.filter(s=>s.collision);assert.equal(new Set(owned).size,owned.length);assert.equal(owned.length,solids.length+1);assert.equal(world.bodies.len(),owned.length+1);assert.equal(world.colliders.len(),owned.length+1);
   const floor=world.getRigidBody(owned[0])!;assert.equal(floor.numColliders(),1);assert.deepEqual({...floor.collider(0).halfExtents()},{x:180,y:.5,z:135});near(floor.collider(0).translation().y,-.5);
   solids.forEach((s,i)=>{const body=world.getRigidBody(owned[i+1])!,collider=body.collider(0);assert.equal(body.isFixed(),true);assert.equal(body.numColliders(),1);near(body.translation().x,s.x);near(body.translation().y,s.y);near(body.translation().z,s.z);near(body.rotation().y,Math.sin(s.yaw/2));near(body.rotation().w,Math.cos(s.yaw/2));const h=collider.halfExtents();near(h.x,s.half[0]);near(h.y,s.half[1]);near(h.z,s.half[2]);});
   owned.forEach(handle=>world.removeRigidBody(world.getRigidBody(handle)!));assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);assert.equal(world.getRigidBody(sentinel.handle),sentinel);
  }
 }finally{world.free();}
});

test('failed course construction rolls back only its own bodies and colliders',()=>{
 const world=new R.World({x:0,y:0,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed()),create=world.createCollider.bind(world);world.createCollider(R.ColliderDesc.ball(.5),sentinel);let calls=0;
 world.createCollider=((...args:Parameters<typeof create>)=>{if(++calls===5)throw Error('fixture allocation failure');return create(...args);})as typeof world.createCollider;
 try{assert.throws(()=>IRONFIELD.buildPhysics(R,world),/fixture allocation failure/);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);assert.equal(world.getRigidBody(sentinel.handle),sentinel);}finally{world.free();}
});

test('full 24-car grids fit and settle without inter-car contacts for every direction and stock/competition armor',()=>{
 for(const direction of directions)for(const armor of [0,3]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;IRONFIELD.buildPhysics(R,world);
  const cars=Array.from({length:24},(_,id)=>{const kind=CAR_KINDS[id%CAR_KINDS.length],setup=stockSetup(kind);setup.armor=armor;const spec=vehicleSpecification(kind,setup),car=createVehiclePhysics(R,world,kind,spec.mass,armor),grid=courseGridSlot(IRONFIELD,id,direction);car.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);return{...car,kind,spec,grid,s:state()};});
  try{
   for(const c of cars){assert.ok(IRONFIELD.distance(c.grid.x,c.grid.z)<2.6);for(const sx of [-1,1])for(const sz of [-1,1]){const d=DEFINITIONS[c.kind],x=c.grid.x+Math.cos(c.grid.yaw)*sx*(d.halfWidth+.20)+Math.sin(c.grid.yaw)*sz*(d.halfLength+.20),z=c.grid.z-Math.sin(c.grid.yaw)*sx*(d.halfWidth+.20)+Math.cos(c.grid.yaw)*sz*(d.halfLength+.20);assert.ok(IRONFIELD.distance(x,z)<IRONFIELD.halfWidth,`${direction}/${armor}/${c.kind} complete conservative footprint leaves road`);}}
   const handles=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(let tick=0;tick<120;tick++){
    for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.s,dt,undefined,undefined,0,[0,0,0,0]);world.step();
    if(tick===0||tick===119)for(const c of cars)for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{const owner=other.parent();if(owner&&owner.handle!==c.body.handle&&handles.has(owner.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});
   }
   assert.equal(contacts,0,`${direction}/${armor} grid has colliding cars`);
   for(const c of cars){const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y>.45&&p.y<1.1);assert.ok(1-2*(q.x*q.x+q.z*q.z)>.95,`${direction}/${armor}/${c.kind} must settle upright`);assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15,'grid must not separate overlapping cars during settling');}
  }finally{for(const c of cars)world.removeVehicleController(c.controller);world.free();}
 }
});

test('all eleven stock and armored compound bodies physically traverse both crossing branches in both directions',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3])for(const branch of [-1,1])for(const sign of [-1,1]){
  const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=dt;const owned=new Set(IRONFIELD.buildPhysics(R,world)),setup=stockSetup(kind);setup.armor=armor;
  const spec=vehicleSpecification(kind,setup),car={kind,...createVehiclePhysics(R,world,kind,spec.mass,armor)},length=Math.hypot(110,128),d={x:sign*110/length,y:0,z:sign*128*branch/length},yaw=Math.atan2(d.x,d.z);
  car.body.setTranslation({x:-18*d.x,y:.89,z:-18*d.z},true);car.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);car.body.setLinvel({x:d.x*40,y:0,z:d.z*40},true);let barrierContacts=0;
  try{
   for(let tick=0;tick<58;tick++){world.step(queue);queue.drainContactForceEvents(e=>{const hit=vehicleContact(world,[car],e.collider1(),e.collider2());if(!hit.a&&!hit.b)return;const a=world.getCollider(e.collider1()).parent()?.handle,b=world.getCollider(e.collider2()).parent()?.handle;if(a!==undefined&&owned.has(a)||b!==undefined&&owned.has(b))barrierContacts++;});}
   assert.equal(barrierContacts,0,`${kind}/${armor}/${branch}/${sign} crossing obstruction`);const p=car.body.translation();assert.ok(p.x*d.x+p.z*d.z>18,'entire car traverses crossing');assert.ok(car.body.linvel().x*d.x+car.body.linvel().z*d.z>37,'no hidden junction collision removes speed');
  }finally{world.removeVehicleController(car.controller);queue.free();world.free();}
 }
});

test('real high-speed impacts stop all eleven stock and armored cars at the visible loop barrier',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=dt;const owned=new Set(IRONFIELD.buildPhysics(R,world)),setup=stockSetup(kind);setup.armor=armor;
  const spec=vehicleSpecification(kind,setup),car={kind,...createVehiclePhysics(R,world,kind,spec.mass,armor)},p=IRONFIELD.point(.02),q=IRONFIELD.point(.0201),yaw=Math.atan2(q.x-p.x,q.z-p.z),d={x:Math.cos(yaw),y:0,z:-Math.sin(yaw)},heading=Math.atan2(d.x,d.z);
  car.body.setTranslation({x:p.x,y:.89,z:p.z},true);car.body.setRotation({x:0,y:Math.sin(heading/2),z:0,w:Math.cos(heading/2)},true);car.body.setLinvel({x:d.x*28,y:0,z:d.z*28},true);let contacts=0,maximumImpulse=0;
  try{
   for(let tick=0;tick<45;tick++){world.step(queue);queue.drainContactForceEvents(e=>{const hit=vehicleContact(world,[car],e.collider1(),e.collider2());if(!hit.a&&!hit.b)return;const a=world.getCollider(e.collider1()).parent()?.handle,b=world.getCollider(e.collider2()).parent()?.handle;if(a!==undefined&&owned.has(a)||b!==undefined&&owned.has(b)){contacts++;maximumImpulse=Math.max(maximumImpulse,e.totalForceMagnitude()*dt);}});}
   assert.ok(contacts>0&&maximumImpulse>1500,`${kind}/${armor} must report a physical crash`);const at=car.body.translation();assert.ok((at.x-p.x)*d.x+(at.z-p.z)*d.z<11,'barrier prevents passage');assert.ok(car.body.linvel().x*d.x+car.body.linvel().z*d.z<8,'barrier removes most outward speed');
  }finally{world.removeVehicleController(car.controller);queue.free();world.free();}
 }
});

test('ordered gates, full tail-grid lap credit and branch-specific recovery cannot skip a lobe',()=>{
 for(const direction of directions)for(let id=0;id<24;id++){
  const actualDirection=directionForCar(direction,id),route=courseRoute(IRONFIELD,actualDirection),grid=courseGridSlot(IRONFIELD,id,direction);let next=grid.next,passed=grid.passed;
  const wrong=route[(next+12)%route.length];assert.equal(checkRoute(route,wrong.x,wrong.z,next,Infinity).passed,false,'opposite lobe gate does not advance progress');
  for(let tick=0;passed<48;tick++){assert.ok(tick<52);const target=route[next];assert.equal(checkRoute(route,target.x,target.z,next,Infinity).passed,true);passed++;next=(next+1)%route.length;}
  assert.equal(next,1);assert.equal(passed,48);
  for(const gate of [9,21]){const recovery=courseRecoverySlot(IRONFIELD,gate,actualDirection),previous=route[(gate+23)%24],target=route[gate];assert.deepEqual({x:recovery.x,z:recovery.z},previous);near(recovery.yaw,Math.atan2(target.x-previous.x,target.z-previous.z),0);assert.ok(Math.hypot(recovery.x-target.x,recovery.z-target.z)>20,'recovery remains behind required gate rather than at crossing');}
 }
 const forward=courseRoute(IRONFIELD,'forward');assert.notDeepEqual(courseRecoverySlot(IRONFIELD,9,'forward'),courseRecoverySlot(IRONFIELD,21,'forward'));assert.equal(forward,IRONFIELD.checkpoints);
});

test('continuous progress requires both complete lobes and preserves the full tail-grid distance',()=>{
 for(const direction of directions)for(let id=0;id<24;id++){
  const actual=directionForCar(direction,id),route=courseRoute(IRONFIELD,actual),grid=courseGridSlot(IRONFIELD,id,direction),sign=actual==='reverse'?-1:1;
  const index=direction==='opposing'?Math.floor(id/2)*2:id,back=Math.floor(index/2)*7;let next=grid.next,passed=grid.passed,last=Infinity,walk=0;
  for(;walk<IRONFIELD.length*2+back+1;walk+=.5){
   const p=IRONFIELD.point(sign*(walk-back)/IRONFIELD.length),check=checkRoute(route,p.x,p.z,next,last);last=check.distance;
   if(check.passed){passed++;next=(next+1)%24;last=Infinity;if(passed===48)break;}
  }
  assert.equal(passed,48);assert.equal(next,1);
  // Gates retain the existing12m capture radius. Curvature makes its arc
  // distance slightly larger; finishing must still require both full lobes.
  assert.ok(walk>IRONFIELD.length*2+back-12.5&&walk<IRONFIELD.length*2+back-11.5);
 }
 const route=courseRoute(IRONFIELD,'forward');let next=1,passed=0,last=Infinity;
 // Repeatedly traversing only half of the ordered course cannot manufacture
 // laps at the crossing, even after six times a full lap's travelled distance.
 for(let repeat=0;repeat<12;repeat++)for(let step=0;step<726;step++){
  const p=IRONFIELD.point(step/1452),check=checkRoute(route,p.x,p.z,next,last);last=check.distance;
  if(check.passed){passed++;next=(next+1)%24;last=Infinity;}
 }
 assert.ok(passed<24,'missing lobe must prevent even one complete lap');
});
