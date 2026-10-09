import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {PINECREST,PINECREST_SOLIDS} from '../src/pinecrest-course';
import {createPinecrestWorld} from '../src/pinecrest-world';
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

test('Trail completes forward and reverse laps on all 25 non-Quarry circuits with no barrier strikes',t=>{
 const results:string[]=[];
 for(const id of Object.keys(COURSE_NAMES).filter(id=>id!=='quarry-v1'))for(const kind of ['trail']as const)for(const direction of ['forward','reverse']as const){
  const course=getRaceCourse(id as keyof typeof COURSE_NAMES);
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=course.buildPhysics!(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(course,0,direction),s=state(),route=courseRoute(course,direction),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:course.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=grid.passed,last=Infinity,strikes=0,ticks=0,maxRoadDistance=0,minUp=1,asphalt=0,gravel=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=course.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:driver.current.x,y:Math.max(driver.current.y,course.height(driver.current.x,driver.current.z)+.55),z:driver.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body,course.isDrivingObstacle);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<12000&&passed<24;ticks++){
    s.input=brain.update(driver,[driver],'race',dt,probe,route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,course.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}

    maxRoadDistance=Math.max(maxRoadDistance,course.distance(driver.current.x,driver.current.z));const q=car.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));if(driver.surface==='asphalt')asphalt++;else gravel++;
   }
   assert.equal(passed,24,`${id}/${kind}/${direction} completes a real lap`);assert.equal(strikes,0,`${id}/${kind}/${direction} barrier strikes`);assert.ok(minUp>.75,'technical course remains upright');results.push(`${id}/${kind}/${direction} ${(ticks*dt).toFixed(2)}s`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(results.join('; '));
});
