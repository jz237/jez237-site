import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {BRACKEN,BRACKEN_SOLIDS,BRACKEN_TERRAIN,brackenTerrainPatch} from '../src/bracken-course';
import {createBrackenWorld} from '../src/bracken-world';
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
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=BRACKEN.buildPhysics(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(BRACKEN,0,direction),s=state(),route=courseRoute(BRACKEN,direction),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:BRACKEN.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=grid.passed,last=Infinity,strikes=0,ticks=0,maxRoadDistance=0,minUp=1,asphalt=0,gravel=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=BRACKEN.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:driver.current.x,y:Math.max(driver.current.y,BRACKEN.height(driver.current.x,driver.current.z)+.55),z:driver.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<12000&&passed<24;ticks++){
    s.input=brain.update(driver,[driver],'race',dt,probe,route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,BRACKEN.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}
    maxRoadDistance=Math.max(maxRoadDistance,BRACKEN.distance(driver.current.x,driver.current.z));const q=car.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(driver.surface==='asphalt')asphalt++;else gravel++;
   }
   assert.equal(passed,24,`${kind}/${direction} completes a real lap`);assert.equal(strikes,0,`${kind}/${direction} barrier strikes`);assert.ok(maxRoadDistance<14.5,`${kind}/${direction} stays in broad lane (${maxRoadDistance})`);assert.ok(minUp>.75,'hilly course remains upright');assert.ok(asphalt>120&&gravel>120,'actual controller crosses both surface types');assert.equal(brain.memory.get(0)!.attempts,0,'no recovery/reverse escape required');results.push(`${kind}/${direction} ${(ticks*dt).toFixed(2)}s`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(results.join('; '));
});

test('24 stock and armored mixed cars fit and settle on forward, reverse and opposing grids without contacts',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const armor of [0,3]){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;BRACKEN.buildPhysics(R,world);
  const cars=Array.from({length:24},(_,id)=>{const kind=CAR_KINDS[id%11],spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),car=createVehiclePhysics(R,world,kind,spec.mass,armor),grid=courseGridSlot(BRACKEN,id,direction);car.body.setTranslation({x:grid.x,y:BRACKEN.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);return{...car,kind,spec,grid,s:state()};});
  try{
   const handles=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(const c of cars)for(const sx of [-1,1])for(const sz of [-1,1]){const d=DEFINITIONS[c.kind],x=c.grid.x+Math.cos(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.sin(c.grid.yaw)*sz*(d.halfLength+.25),z=c.grid.z-Math.sin(c.grid.yaw)*sx*(d.halfWidth+.25)+Math.cos(c.grid.yaw)*sz*(d.halfLength+.25);assert.ok(BRACKEN.distance(x,z)<12,'whole armored footprint stays inside racing lane');}
   for(let tick=0;tick<120;tick++){for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.s,dt,undefined,undefined,0,[0,0,0,0]);world.step();if(tick===0||tick===119)for(const c of cars)for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{const parent=other.parent();if(parent&&parent.handle!==c.body.handle&&handles.has(parent.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});}
   assert.equal(contacts,0,`${direction}/${armor} grid contact`);for(const c of cars){const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y-BRACKEN.height(p.x,p.z)>.45&&p.y-BRACKEN.height(p.x,p.z)<1.1);assert.ok(1-2*(q.x*q.x+q.z*q.z)>.95);assert.ok(Math.hypot(p.x-c.grid.x,p.z-c.grid.z)<.15,'no grid overlap separation');}
  }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 }
});

test('tail-grid starts and recovery preserve a full ordered rallycross lap in both directions',()=>{
 for(const direction of ['forward','reverse','opposing']as const)for(const id of [0,1,22,23]){
  const actual=directionForCar(direction,id),route=courseRoute(BRACKEN,actual),grid=courseGridSlot(BRACKEN,id,direction),sign=actual==='reverse'?-1:1,index=direction==='opposing'?Math.floor(id/2)*2:id,back=Math.floor(index/2)*7;let next=grid.next,passed=grid.passed,last=Infinity,walk=0;
  for(;walk<BRACKEN.length+back+1;walk+=.5){const p=BRACKEN.point(sign*(walk-back)/BRACKEN.length),check=checkRoute(route,p.x,p.z,next,last,BRACKEN.checkpointRadius);last=check.distance;if(check.passed){passed++;next=(next+1)%24;last=Infinity;if(passed===24)break;}}
  assert.equal(passed,24);assert.equal(next,1);assert.ok(walk>BRACKEN.length+back-16.5&&walk<BRACKEN.length+back-15.5,'tail cars cannot receive a shortened lap');
  for(const checkpoint of [1,6,12,18]){const recovery=courseRecoverySlot(BRACKEN,checkpoint,actual),at=route[(checkpoint+23)%24],to=route[checkpoint];assert.deepEqual({x:recovery.x,z:recovery.z},at);near(recovery.yaw,Math.atan2(to.x-at.x,to.z-at.z),0);}
 }
});


test('rallycross terrain height, upward triangles, render geometry and all collision tiles agree',()=>{
 const world=new R.World({x:0,y:0,z:0}),owned=BRACKEN.buildPhysics(R,world),terrain=world.getRigidBody(owned[0])!,patch=brackenTerrainPatch();
 try{
  assert.equal(terrain.numColliders(),108);assert.equal(patch.indices.length,180*140*6);
  let triangles=0;for(let i=0;i<terrain.numColliders();i++)triangles+=terrain.collider(i).indices()!.length/3;
  assert.equal(triangles,patch.indices.length/3);
  world.step();let min=Infinity,max=-Infinity;
  for(let i=0;i<256;i++){const p=BRACKEN.point(i/256),q=BRACKEN.point((i+1)/256);near(Math.hypot(q.x-p.x,q.z-p.z),BRACKEN.length/256,.035);assert.ok(BRACKEN.distance(p.x,p.z)<.003);const y=BRACKEN.height(p.x,p.z);min=Math.min(min,y);max=Math.max(max,y);
   for(const dx of [-8,0,8]){const h=BRACKEN.height(p.x+dx,p.z),hit=world.castRay(new R.Ray({x:p.x+dx,y:30,z:p.z},{x:0,y:-1,z:0}),50,true,undefined,undefined,undefined,undefined,c=>c.parent()?.handle===terrain.handle);assert.ok(hit);near(30-hit.timeOfImpact,h,5e-5);}
  }
  assert.ok(max-min>4,'at least four metres of course elevation change');
  for(let i=0;i<patch.indices.length;i+=3){const a=patch.indices[i]*3,b=patch.indices[i+1]*3,c=patch.indices[i+2]*3,v=patch.positions;assert.ok((v[b+2]-v[a+2])*(v[c]-v[a])-(v[b]-v[a])*(v[c+2]-v[a+2])>0);}
  for(const s of BRACKEN_SOLIDS)if(s.id.startsWith('bracken_barrier'))assert.ok(BRACKEN.distance(s.x,s.z)>14.7,'barriers clear the full driving corridor');
 }finally{world.free();}
});

test('rallycross visuals match physical terrain, surface bands and solids; all owned GPU resources dispose once',()=>{
 const artwork=createBrackenWorld(),patch=brackenTerrainPatch(),ground=artwork.root.getObjectByName('bracken_ground') as T.Mesh;
 assert.deepEqual(ground.geometry.getAttribute('position').array,patch.positions);assert.deepEqual(ground.geometry.index!.array,patch.indices);
 const geometry=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>(),instances:T.InstancedMesh[]=[],matrices:T.Matrix4[]=[];
 artwork.root.traverse(o=>{assert.equal(o.matrixAutoUpdate,false);if(o instanceof T.Mesh){geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}if(o instanceof T.InstancedMesh){instances.push(o);for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m);}}});
 for(const s of BRACKEN_SOLIDS){const expected=new T.Matrix4().compose(new T.Vector3(s.x,s.y,s.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),s.yaw),new T.Vector3(...s.half).multiplyScalar(2));assert.ok(matrices.some(m=>m.elements.every((v,j)=>Math.abs(v-expected.elements[j])<1e-5)),s.id);}
 const {width,height,spanX,spanZ,road}=artwork.groundCoverage;
 for(const t of [.05,.15,.4,.5,.65,.77,.95]){const p=BRACKEN.point(t),col=Math.floor((p.x+spanX/2)/spanX*width),row=Math.floor((spanZ/2-p.z)/spanZ*height);assert.equal(road[(row*width+col)*4+3]>0,BRACKEN.surface(p.x,p.z)==='asphalt');}
 let disposed=0;for(const resource of [...geometry,...materials,...textures,...instances])resource.addEventListener('dispose',()=>disposed++);
 artwork.dispose();artwork.dispose();assert.equal(disposed,geometry.size+materials.size+textures.size+instances.length);assert.equal(artwork.root.children.length,0);
});

test('rallycross physics rolls back failed allocations and groups every terrain tile as one damage contact',async()=>{
 const {terrainContactHandle}=await import('../src/terrain-collision');
 const world=new R.World({x:0,y:0,z:0}),sentinel=world.createRigidBody(R.RigidBodyDesc.fixed());world.createCollider(R.ColliderDesc.ball(.1),sentinel);
 const create=world.createCollider.bind(world);let calls=0;world.createCollider=((...args:Parameters<typeof create>)=>{if(++calls===30)throw Error('allocation failed');return create(...args);})as typeof world.createCollider;
 try{assert.throws(()=>BRACKEN.buildPhysics(R,world),/allocation failed/);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);world.createCollider=create;const owned=BRACKEN.buildPhysics(R,world),ground=world.getRigidBody(owned[0])!;for(let i=0;i<ground.numColliders();i++)assert.equal(terrainContactHandle(world,ground.collider(i).handle),ground.collider(0).handle);for(const h of owned)world.removeRigidBody(world.getRigidBody(h)!);assert.equal(world.bodies.len(),1);assert.equal(world.colliders.len(),1);}finally{world.free();}
});
