import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey,type AIDifficulty} from '../src/ai-difficulty';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {readEventOptions,DEFAULT_EVENT,checkRoute} from '../src/event-rules';
import {readDemoOptions,DEFAULT_DEMO} from '../src/demo-session';
import {CINDERBANK} from '../src/cinderbank-course';
import {courseGridSlot,courseRoute} from '../src/race-course';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {drivingObstacleClearance} from '../src/driving-probe';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
import {derbyDrivingFixture} from './derby-driving-fixture';
const difficulties=Object.keys(AI_DIFFICULTIES) as AIDifficulty[];

test('difficulty persists independently for events and demos and safely upgrades old saves',()=>{
 for(const read of [readEventOptions,readDemoOptions]){
  for(const difficulty of difficulties){const saved=read(JSON.stringify({version:1,difficulty}));assert.equal(saved.difficulty,difficulty);assert.deepEqual(read(JSON.stringify(saved)),saved);}
  for(const difficulty of [null,undefined,2,{},'constructor','__proto__','impossible']){const saved=read(JSON.stringify({version:1,difficulty}));assert.equal(saved.difficulty,undefined);assert.equal(readAIDifficulty(saved.difficulty),'amateur');}
 }
 assert.deepEqual(readEventOptions(JSON.stringify(DEFAULT_EVENT)),DEFAULT_EVENT);
 assert.deepEqual(readDemoOptions(JSON.stringify(DEFAULT_DEMO)),DEFAULT_DEMO);
 assert.equal(sessionAIDifficulty(true,false,'novice','expert'),'novice');
 assert.equal(sessionAIDifficulty(true,true,'novice','expert'),'expert');
 assert.equal(sessionAIDifficulty(false,false,'novice','expert'),'amateur','fixed challenges/cups and online do not inherit custom options');
 assert.equal(sessionAIDifficulty(true,true,'expert',undefined),'amateur','old demos retain the original driver');
 const key='race:cinderbank-oval-v1:forward:2:11';assert.equal(difficultyRecordKey(key,'amateur'),key);
 assert.equal(new Set(difficulties.map(d=>difficultyRecordKey(key,d))).size,3,'best records do not mix different opponents');
});
const car=(id:number,z=0,speed=0):DriverCar=>({id,current:{x:0,y:1,z},velocity:{x:0,y:0,z:speed},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed,health:100,finished:false,nextCheckpoint:1,surface:'asphalt'});
const road=[{x:0,z:0},{x:0,z:100},{x:0,z:200}];
test('levels change pace but retain braking, blocked-rear recovery and wreck retirement',()=>{
 const inputs=difficulties.map(d=>{const brain=new DrivingBrain(undefined,d),self=car(1,10,20);return brain.update(self,[self],'race',.1,undefined,road);});
 assert.ok(inputs[0].brake>0&&inputs[0].throttle===0);assert.ok(inputs[1].throttle>0);assert.ok(inputs[2].throttle>=inputs[1].throttle);
 for(const d of difficulties){
  const b=new DrivingBrain(undefined,d),self=car(1,10,24),blocked=()=>({front:1,left:5,right:2,rear:1});
  assert.ok(b.update(self,[self],'race',.1,blocked,road).brake>.9);
  self.speed=0;for(let i=0;i<240;i++)assert.ok(b.update(self,[self],'race',1/60,blocked,road).throttle>=0);
  self.health=0;assert.equal(b.update(self,[self],'race',.1).brake,1);assert.equal(self.health,0);
 }
});

/** Actual production suspension/tyres on the authored oval with its barriers.
 * No position advances, speed overrides, repairs or completion shortcuts. */
function lap(kind:CarKind,difficulty:AIDifficulty,direction:'forward'|'reverse'){
 const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true),dt=1/60;
 world.timestep=dt;const walls=new Set(CINDERBANK.buildPhysics(R,world).slice(1)),spec=vehicleSpecification(kind),vehicle=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(CINDERBANK,0,direction),route=courseRoute(CINDERBANK,direction),brain=new DrivingBrain(undefined,difficulty);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
 const driver={...car(0),kind,nextCheckpoint:grid.next};vehicle.body.setTranslation({x:grid.x,y:.89,z:grid.z},true);vehicle.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
 let passed=grid.passed,last=Infinity,ticks=0,strikes=0,minUp=1;
 const read=()=>{driver.current={...vehicle.body.translation()};driver.velocity={...vehicle.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},vehicle.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},vehicle.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;state.surface=driver.surface=CINDERBANK.surface(driver.current.x,driver.current.z);};
 const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray(driver.current,{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,vehicle.body);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
 try{
  for(let i=0;i<90;i++){stepVehiclePhysics(vehicle.body,vehicle.controller,kind,spec,state,dt);world.step();}read();events.clear();
  for(;ticks<9000&&passed<24;ticks++){
   state.input=brain.update(driver,[driver],'race',dt,probe,route);stepVehiclePhysics(vehicle.body,vehicle.controller,kind,spec,state,dt);world.step(events);read();
   events.drainContactForceEvents(e=>{if([e.collider1(),e.collider2()].some(handle=>walls.has(world.getCollider(handle).parent()?.handle!)))strikes++;});
   const check=checkRoute(route,driver.current.x,driver.current.z,driver.nextCheckpoint,last,CINDERBANK.checkpointRadius);last=check.distance;if(check.passed){passed++;driver.nextCheckpoint=(driver.nextCheckpoint+1)%24;last=Infinity;}
   const q=vehicle.body.rotation();minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));
  }
  assert.equal(passed,24,`${kind}/${difficulty}/${direction} finishes`);assert.equal(strikes,0,`${kind}/${difficulty}/${direction} barrier strikes`);assert.ok(minUp>.9,'no rollover');assert.equal(brain.memory.get(0)!.attempts,0,'no recovery needed');return ticks*dt;
 }finally{events.free();world.free();}
}
test('all eleven real vehicles finish both oval directions at all three levels with ordered lap pace',async t=>{
 await R.init();const rows=[];
 for(const kind of CAR_KINDS)for(const direction of ['forward','reverse']as const){
  const times=difficulties.map(d=>lap(kind,d,direction));assert.ok(times[0]>times[1]*1.05,`${kind}/${direction}: Novice noticeably slower ${times}`);assert.ok(times[1]>times[2]*1.025,`${kind}/${direction}: Expert noticeably faster ${times}`);rows.push({kind,direction,seconds:times.map(n=>+n.toFixed(2))});
 }t.diagnostic(JSON.stringify(rows));
});
test('every derby level continues producing repeated physical impacts after opening contact',async t=>{
 await R.init();
 for(const difficulty of difficulties){
  class SelectedBrain extends DrivingBrain{constructor(...args:ConstructorParameters<typeof DrivingBrain>){super(args[0],difficulty);}}
  const result=derbyDrivingFixture(11,true,60,SelectedBrain);t.diagnostic(JSON.stringify({difficulty,...result}));assert.ok(result.hits>35&&result.strong>15,'repeated substantial post-opening impacts');assert.ok(result.fastFraction>.2&&result.slowFraction<.5,'drivers keep rebuilding momentum');
 }
});
