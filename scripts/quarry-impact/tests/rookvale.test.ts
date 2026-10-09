import {ROOKVALE_BARRIERS as artBarriers} from '../src/rookvale-course';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {ROOKVALE} from '../src/rookvale-course';
import {createRookvaleWorld} from '../src/rookvale-world';
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

test('the raised infield, visible terrain and suspension-contact floor agree across the whole yard',()=>{
 const world=new R.World({x:0,y:0,z:0}),owned=ROOKVALE.buildPhysics(R,world),art=createRookvaleWorld();world.step();
 try{
  const mesh=art.root.getObjectByName('rookvale_loading_apron') as T.Mesh;
  const positions=mesh.geometry.getAttribute('position');let raised=0,flat=0;
  for(let x=-190;x<=190;x+=19)for(let z=-140;z<=140;z+=20){
   const y=ROOKVALE.height(x+.37,z+.61),hit=world.castRay(new R.Ray({x:x+.37,y:20,z:z+.61},{x:0,y:-1,z:0}),30,true,undefined,undefined,undefined,undefined,c=>c.parent()?.handle===owned[0]);
   assert.ok(hit);near(20-hit.timeOfImpact,y,3e-5);if(y>3.9)raised++;if(y===0)flat++;
  }
  assert.ok(raised>10&&flat>10);near(ROOKVALE.height(0,0),4);near(ROOKVALE.height(0,-108),0);
  for(let i=0;i<positions.count;i+=37)near(positions.getY(i),ROOKVALE.height(positions.getX(i),positions.getZ(i)),1e-5);
  assert.equal(ROOKVALE.surface(0,0),'asphalt');assert.equal(ROOKVALE.surface(0,75),'gravel');
 }finally{art.dispose();world.free();}
});

for(const ROOKVALE_TEST of [ROOKVALE]){
 const ROOKVALE_TEST_SOLIDS=artBarriers;
 const createRookvaleTestWorld=createRookvaleWorld;
 test('every stock vehicle completes actual forward and reverse laps with normal driving controls and no barrier strikes',t=>{
 const results:string[]=[];
 for(const kind of CAR_KINDS)for(const direction of ['forward','reverse']as const){
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=ROOKVALE_TEST.buildPhysics(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(ROOKVALE_TEST,0,direction),s=state(),route=courseRoute(ROOKVALE_TEST,direction),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:ROOKVALE_TEST.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=grid.passed,last=Infinity,strikes=0,ticks=0,maxRoadDistance=0,minUp=1,asphalt=0,gravel=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=ROOKVALE_TEST.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:driver.current.x,y:Math.max(driver.current.y,ROOKVALE_TEST.height(driver.current.x,driver.current.z)+.55),z:driver.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body,ROOKVALE_TEST.isDrivingObstacle);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<12000&&passed<24;ticks++){
    s.input=brain.update(driver,[driver],'race',dt,probe,route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,ROOKVALE_TEST.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}

    maxRoadDistance=Math.max(maxRoadDistance,ROOKVALE_TEST.distance(driver.current.x,driver.current.z));const q=car.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(driver.surface==='asphalt')asphalt++;else gravel++;
   }
   assert.equal(passed,24,`${kind}/${direction} completes a real lap`);assert.equal(strikes,0,`${kind}/${direction} barrier strikes`);assert.ok(maxRoadDistance<15.7,`${kind}/${direction} stays in broad lane (${maxRoadDistance})`);assert.ok(minUp>.75,'technical course remains upright');assert.ok(asphalt>120&&gravel>120,'actual controller drives both course surfaces');assert.equal(brain.memory.get(0)!.attempts,0,'no recovery/reverse escape required');results.push(`${kind}/${direction} ${(ticks*dt).toFixed(2)}s`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(ROOKVALE_TEST.name+': '+results.join('; '));
});

test('24 stock and armored mixed cars fit and settle on forward, reverse and opposing grids without contacts',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const armor of [0,3]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;ROOKVALE_TEST.buildPhysics(R,world);
  const cars=Array.from({length:24},(_,id)=>{const kind=CAR_KINDS[id%CAR_KINDS.length],spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),car=createVehiclePhysics(R,world,kind,spec.mass,armor),grid=courseGridSlot(ROOKVALE_TEST,id,direction);car.body.setTranslation({x:grid.x,y:ROOKVALE_TEST.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);return{...car,kind,spec,grid,s:state()};});
  try{
   const handles=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(const c of cars)for(const sx of [-1,1])for(const sz of [-1,1]){const d=DEFINITIONS[c.kind],x=c.grid.x+Math.cos(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.sin(c.grid.yaw)*sz*(d.halfLength+.25),z=c.grid.z-Math.sin(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.cos(c.grid.yaw)*sz*(d.halfLength+.25);assert.ok(ROOKVALE_TEST.distance(x,z)<14,'whole armored footprint stays inside racing lane');}
   for(let tick=0;tick<120;tick++){for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.s,dt,undefined,undefined,0,[0,0,0,0]);world.step();if(tick===0||tick===119)for(const c of cars)for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{const parent=other.parent();if(parent&&parent.handle!==c.body.handle&&handles.has(parent.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});}
   assert.equal(contacts,0,`${direction}/${armor} grid contact`);for(const c of cars){const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y-ROOKVALE_TEST.height(p.x,p.z)>.45&&p.y-ROOKVALE_TEST.height(p.x,p.z)<1.1);assert.ok(1-2*(q.x*q.x+q.z*q.z)>.95);assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15,'no grid overlap separation');}
  }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 }
});

test('tail-grid starts and recovery preserve a full ordered circuit lap in both directions',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const id of [0,1,22,23]){
  const actual=directionForCar(direction,id),route=courseRoute(ROOKVALE_TEST,actual),grid=courseGridSlot(ROOKVALE_TEST,id,direction),sign=actual==='reverse'?-1:1,index=direction==='opposing'?Math.floor(id/2)*2:id,back=Math.floor(index/2)*7;let next=grid.next,passed=grid.passed,last=Infinity,walk=0;
  for(;walk<ROOKVALE_TEST.length+back+1;walk+=.5){const p=ROOKVALE_TEST.point(sign*(walk-back)/ROOKVALE_TEST.length),check=checkRoute(route,p.x,p.z,next,last,ROOKVALE_TEST.checkpointRadius);last=check.distance;if(check.passed){passed++;next=(next+1)%24;last=Infinity;if(passed===24)break;}}
  assert.equal(passed,24);assert.equal(next,1);assert.ok(walk>ROOKVALE_TEST.length+back-15.5&&walk<ROOKVALE_TEST.length+back-14.5,'tail cars cannot receive a shortened lap');
  for(const checkpoint of [1,6,12,18]){const recovery=courseRecoverySlot(ROOKVALE_TEST,checkpoint,actual),at=route[(checkpoint+23)%24],to=route[checkpoint];assert.deepEqual({x:recovery.x,z:recovery.z},at);near(recovery.yaw,Math.atan2(to.x-at.x,to.z-at.z),0);}
 }
});



test('all visible course barriers match physics records and owned graphics dispose once',()=>{
 const artwork=createRookvaleTestWorld();
 const geometry=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>(),instances:T.InstancedMesh[]=[],matrices:T.Matrix4[]=[];
 artwork.root.traverse(o=>{assert.equal(o.matrixAutoUpdate,false);if(o instanceof T.Mesh){geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}if(o instanceof T.InstancedMesh){instances.push(o);for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}}});
 for(const s of ROOKVALE_TEST_SOLIDS){const expected=new T.Matrix4().compose(new T.Vector3(s.x,s.y,s.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),s.yaw),new T.Vector3(...s.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,j)=>Math.abs(v-expected.elements[j])<1e-5)),'perimeter barrier');}
 let disposed=0;for(const resource of [...geometry,...materials,...textures,...instances])resource.addEventListener('dispose',()=>disposed++);
 artwork.dispose();artwork.dispose();assert.equal(disposed,geometry.size+materials.size+textures.size+instances.length);assert.equal(artwork.root.children.length,0);
});

test('hill terrain and track boundaries agree with physics and failed construction rolls back',()=>{
 const world=new R.World({x:0,y:0,z:0});const owned=ROOKVALE_TEST.buildPhysics(R,world);world.step();
 try{for(const p of ROOKVALE_TEST.samples){const hit=world.castRay(new R.Ray({x:p.x,y:30,z:p.z},{x:0,y:-1,z:0}),50,true,undefined,undefined,undefined,undefined,c=>c.parent()?.handle===owned[0]);assert.ok(hit);near(30-hit.timeOfImpact,ROOKVALE_TEST.height(p.x,p.z));assert.ok(['asphalt','gravel'].includes(ROOKVALE_TEST.surface(p.x,p.z)));assert.equal(ROOKVALE_TEST.outside(p.x,0,p.z),false);}assert.equal(world.bodies.len(),ROOKVALE_TEST_SOLIDS.length+1);}finally{world.free();}
 const failed=new R.World({x:0,y:0,z:0}),sentinel=failed.createRigidBody(R.RigidBodyDesc.fixed()),create=failed.createCollider.bind(failed);let calls=0;failed.createCollider=((...args:Parameters<typeof create>)=>{if(++calls===30)throw Error('allocation failed');return create(...args);}) as typeof failed.createCollider;
 try{assert.throws(()=>ROOKVALE_TEST.buildPhysics(R,failed),/allocation failed/);assert.equal(failed.bodies.len(),1);assert.equal(failed.colliders.len(),0);assert.ok(failed.getRigidBody(sentinel.handle));}finally{failed.free();}
});

}
