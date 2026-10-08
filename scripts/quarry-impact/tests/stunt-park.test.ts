import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {STUNT_PARK} from '../src/stunt-course';
import {createStuntWorld} from '../src/stunt-world';
import {buildStuntPhysics,STUNT_LOOP,STUNT_BARRIERS,STUNT_SUPPORTS,STUNT_RAMPS,stuntLoopPoint,stuntLoopMesh,stuntRampMesh} from '../src/stunt-layout';
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

test('every stock vehicle completes actual forward and reverse laps with normal driving controls and no barrier strikes',t=>{
 const results:string[]=[];
 for(const kind of CAR_KINDS)for(const direction of ['forward','reverse']as const){
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=STUNT_PARK.buildPhysics(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(STUNT_PARK,0,direction),s=state(),route=courseRoute(STUNT_PARK,direction),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:STUNT_PARK.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=grid.passed,last=Infinity,strikes=0,ticks=0,maxRoadDistance=0,minUp=1,asphalt=0,gravel=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=STUNT_PARK.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:driver.current.x,y:Math.max(driver.current.y,STUNT_PARK.height(driver.current.x,driver.current.z)+.55),z:driver.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body,STUNT_PARK.isDrivingObstacle);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<12000&&passed<24;ticks++){
    s.input=brain.update(driver,[driver],'race',dt,probe,route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,STUNT_PARK.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}

    maxRoadDistance=Math.max(maxRoadDistance,STUNT_PARK.distance(driver.current.x,driver.current.z));const q=car.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(driver.surface==='asphalt')asphalt++;else gravel++;
   }
   assert.equal(passed,24,`${kind}/${direction} completes a real lap`);assert.equal(strikes,0,`${kind}/${direction} barrier strikes`);assert.ok(maxRoadDistance<15.7,`${kind}/${direction} stays in broad lane (${maxRoadDistance})`);assert.ok(minUp>.75,'technical course remains upright');assert.ok(asphalt>120&&gravel===0,'actual perimeter is asphalt');assert.equal(brain.memory.get(0)!.attempts,0,'no recovery/reverse escape required');results.push(`${kind}/${direction} ${(ticks*dt).toFixed(2)}s`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(STUNT_PARK.name+': '+results.join('; '));
});

test('24 stock and armored mixed cars fit and settle on forward, reverse and opposing grids without contacts',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const armor of [0,3]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;STUNT_PARK.buildPhysics(R,world);
  const cars=Array.from({length:24},(_,id)=>{const kind=CAR_KINDS[id%CAR_KINDS.length],spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),car=createVehiclePhysics(R,world,kind,spec.mass,armor),grid=courseGridSlot(STUNT_PARK,id,direction);car.body.setTranslation({x:grid.x,y:STUNT_PARK.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);return{...car,kind,spec,grid,s:state()};});
  try{
   const handles=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(const c of cars)for(const sx of [-1,1])for(const sz of [-1,1]){const d=DEFINITIONS[c.kind],x=c.grid.x+Math.cos(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.sin(c.grid.yaw)*sz*(d.halfLength+.25),z=c.grid.z-Math.sin(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.cos(c.grid.yaw)*sz*(d.halfLength+.25);assert.ok(STUNT_PARK.distance(x,z)<14,'whole armored footprint stays inside racing lane');}
   for(let tick=0;tick<120;tick++){for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.s,dt,undefined,undefined,0,[0,0,0,0]);world.step();if(tick===0||tick===119)for(const c of cars)for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{const parent=other.parent();if(parent&&parent.handle!==c.body.handle&&handles.has(parent.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});}
   assert.equal(contacts,0,`${direction}/${armor} grid contact`);for(const c of cars){const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y-STUNT_PARK.height(p.x,p.z)>.45&&p.y-STUNT_PARK.height(p.x,p.z)<1.1);assert.ok(1-2*(q.x*q.x+q.z*q.z)>.95);assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15,'no grid overlap separation');}
  }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 }
});

test('tail-grid starts and recovery preserve a full ordered circuit lap in both directions',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const id of [0,1,22,23]){
  const actual=directionForCar(direction,id),route=courseRoute(STUNT_PARK,actual),grid=courseGridSlot(STUNT_PARK,id,direction),sign=actual==='reverse'?-1:1,index=direction==='opposing'?Math.floor(id/2)*2:id,back=Math.floor(index/2)*7;let next=grid.next,passed=grid.passed,last=Infinity,walk=0;
  for(;walk<STUNT_PARK.length+back+1;walk+=.5){const p=STUNT_PARK.point(sign*(walk-back)/STUNT_PARK.length),check=checkRoute(route,p.x,p.z,next,last,STUNT_PARK.checkpointRadius);last=check.distance;if(check.passed){passed++;next=(next+1)%24;last=Infinity;if(passed===24)break;}}
  assert.equal(passed,24);assert.equal(next,1);assert.ok(walk>STUNT_PARK.length+back-15.5&&walk<STUNT_PARK.length+back-14.5,'tail cars cannot receive a shortened lap');
  for(const checkpoint of [1,6,12,18]){const recovery=courseRecoverySlot(STUNT_PARK,checkpoint,actual),at=route[(checkpoint+23)%24],to=route[checkpoint];assert.deepEqual({x:recovery.x,z:recovery.z},at);near(recovery.yaw,Math.atan2(to.x-at.x,to.z-at.z),0);}
 }
});




test('stunt ribbon and ramp scenery use their physical vertices and disposal releases every owned resource',()=>{
 const art=createStuntWorld();
 for(const [name,expected]of [['driveable_helical_loop',stuntLoopMesh()],...STUNT_RAMPS.map(r=>[r.id,stuntRampMesh(r)])]as const){
  const mesh=art.root.getObjectByName(name as string)as T.Mesh;assert.ok(mesh);assert.deepEqual(mesh.geometry.getAttribute('position').array,expected.positions);assert.deepEqual(mesh.geometry.index!.array,expected.indices);
 }
 const resources=new Set<any>();art.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}if(o instanceof T.InstancedMesh)resources.add(o);});let disposed=0;for(const r of resources)r.addEventListener('dispose',()=>disposed++);art.dispose();art.dispose();assert.equal(disposed,resources.size);assert.equal(art.root.children.length,0);
});

test('loop, ramp and boundary physics construction rolls back cleanly on allocation failure',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed()),create=world.createCollider.bind(world);let count=0;
 world.createCollider=((...args:Parameters<typeof create>)=>{if(++count===20)throw Error('allocation failed');return create(...args);})as typeof world.createCollider;
 try{assert.throws(()=>buildStuntPhysics(R,world),/allocation failed/);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),0);assert.ok(world.getRigidBody(sentinel.handle));}finally{world.free();}
});

test('the stock Ravine drives a complete inverted loop using only throttle, braking and steering',()=>{
 const kind='buggy';
 const radius=STUNT_LOOP.radius,shift=STUNT_LOOP.shift,segments=STUNT_LOOP.segments,world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;buildStuntPhysics(R,world);
 const points=Array.from({length:segments+1},(_,i)=>stuntLoopPoint(i/segments));
 const spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),yaw=Math.atan(shift/(Math.PI*2*radius));car.body.setTranslation({x:STUNT_LOOP.x-150*Math.tan(yaw),y:.89,z:STUNT_LOOP.z-150},true);car.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);
 const s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};
 let maxY=0,minUp=1,inverted=0,entered=false,complete=false,entranceSpeed=0,index=0;
 for(let tick=0;tick<2400;tick++){
  const p0=car.body.translation(),q0=car.body.rotation(),forward=rotateVehicleVector({x:0,y:0,z:1},q0),right=rotateVehicleVector({x:1,y:0,z:0},q0);
  if(p0.z>STUNT_LOOP.z-5&&!entered){entered=true;entranceSpeed=s.speed;}
  if(entered){let dist=Infinity;for(let i=index;i<Math.min(points.length,index+35);i++){const p=points[i],d=Math.hypot(p.x-p0.x,p.y-p0.y,p.z-p0.z);if(d<dist){dist=d;index=i;}}const target=index>segments-12?{x:STUNT_LOOP.x+shift+Math.sin(yaw)*15,y:0,z:STUNT_LOOP.z+Math.cos(yaw)*15}:points[Math.min(segments,index+12)],dx=target.x-p0.x,dy=target.y-p0.y,dz=target.z-p0.z;s.input.steer=Math.max(-1,Math.min(1,Math.atan2(dx*right.x+dy*right.y+dz*right.z,dx*forward.x+dy*forward.y+dz*forward.z)*1.5));}
  const targetSpeed=radius===20?36:radius===16?32:29;s.input.throttle=s.speed<targetSpeed?1:0;s.input.brake=s.speed>targetSpeed+1?.1:0;
  stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();const p=car.body.translation(),q=car.body.rotation(),up=1-2*(q.x*q.x+q.z*q.z);maxY=Math.max(maxY,p.y);minUp=Math.min(minUp,up);
  if(up<-.5)inverted++;if(index>segments-15&&p.z>STUNT_LOOP.z+5&&p.y<2&&up>.8){complete=true;break;}

 }
 world.removeVehicleController(car.controller);world.free();
 assert.ok(complete,'exit upright beyond the loop');assert.ok(maxY>30&&minUp<-.99&&inverted>60,'actual upside-down traversal');assert.ok(entranceSpeed>30&&entranceSpeed<34,'reachable run-up speed');
});
