import {freeRecoverySlot} from '../src/race-recovery';
import {courseRecoveryArea} from '../src/race-course';
import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS} from '../src/rules';
import {WaypointRace,courseWaypoints} from '../src/waypoint-race';
import {readDemoOptions,DEFAULT_DEMO} from '../src/demo-session';
import {courseGridSlot,getRaceCourse} from '../src/race-course';
import {COURSE_NAMES} from '../src/course-id';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {drivingObstacleClearance} from '../src/driving-probe';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
await R.init();
const dt=1/60;
const state=():PhysicsState=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}});

test('all thirteen cars physically complete open ordered, free and random waypoint races',t=>{
 const results:string[]=[];
 for(const id of ['merefield-airfield-v1'] as (keyof typeof COURSE_NAMES)[])for(const format of ['ordered','free','random']as const)for(const seed of format==='random'?[3,10,22]:[22])for(const kind of CAR_KINDS){
  const ASHFORD=getRaceCourse(id),race=new WaypointRace(format,1,seed,ASHFORD.checkpoints,ASHFORD.waypointStations);
  const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true);world.timestep=dt;const owned=ASHFORD.buildPhysics!(R,world),walls=new Set(owned.slice(1)),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(ASHFORD,0,race.startDirection()),s=state(),brain=new DrivingBrain();car.body.setTranslation({x:grid.x,y:ASHFORD.height(grid.x,grid.z)+.89,z:grid.z},true);car.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const driver:DriverCar={id:0,kind,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:grid.next,surface:'asphalt'};
  let passed=0,strikes=0,ticks=0;
  const read=()=>{driver.current={...car.body.translation()};driver.velocity={...car.body.linvel()};driver.forward=rotateVehicleVector({x:0,y:0,z:1},car.body.rotation());driver.right=rotateVehicleVector({x:1,y:0,z:0},car.body.rotation());driver.speed=driver.velocity.x*driver.forward.x+driver.velocity.y*driver.forward.y+driver.velocity.z*driver.forward.z;driver.surface=s.surface=ASHFORD.surface(driver.current.x,driver.current.z);};
  const probe=()=>{const yaw=Math.atan2(driver.forward.x,driver.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:driver.current.x,y:Math.max(driver.current.y,ASHFORD.height(driver.current.x,driver.current.z)+.55),z:driver.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,car.body,ASHFORD.isDrivingObstacle);return hit?drivingObstacleClearance(driver,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
  try{
   for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step();}events.clear();read();
   for(;ticks<24000&&!race.get(0).finished;ticks++){
    const nav=race.navigation(0,driver.current,driver.forward);driver.nextCheckpoint=nav.next;s.input=brain.update(driver,[driver],'race',dt,probe,nav.route);assert.ok([s.input.throttle,s.input.steer,s.input.brake].every(Number.isFinite));stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt,undefined,undefined,0,[0,0,0,0]);world.step(events);read();
    events.drainContactForceEvents(e=>{const a=world.getCollider(e.collider1()).parent(),b=world.getCollider(e.collider2()).parent();if((a&&walls.has(a.handle))||(b&&walls.has(b.handle)))strikes++;});
    race.sample(0,driver.current);passed=race.get(0).passed;

   }
   assert.equal(passed,6,`${id}/${kind}/${format}/${seed}: ${passed} stations, target ${race.get(0).target}, pos ${JSON.stringify(driver.current)}`);assert.ok(driver.current&&Object.values(driver.current).every(Number.isFinite));assert.ok(ticks*dt<300,`${id}/${kind}/${format}/${seed} must complete its longer multi-traversal route within five minutes`);assert.equal(strikes,0,'open routes do not require contact with the perimeter wall');results.push(`${id}/${kind}/${format}/${seed} ${(ticks*dt).toFixed(2)}s, ${strikes} contacts`);
  }finally{world.removeVehicleController(car.controller);events.free();world.free();}
 }
 t.diagnostic(results.join('; '));
});

test('course stations score only active targets, preserve independent rounds and old demo defaults',()=>{
 assert.deepEqual(readDemoOptions(JSON.stringify(DEFAULT_DEMO)),DEFAULT_DEMO);
 for(const race of ['ordered','free','random'] as const){assert.equal(readDemoOptions(JSON.stringify({...DEFAULT_DEMO,race})).race,race);}
 for(const id of Object.keys(COURSE_NAMES) as (keyof typeof COURSE_NAMES)[]){const course=getRaceCourse(id),road=course.checkpoints,points=new WaypointRace('free',1,22,road,course.waypointStations).stations;assert.equal(points.length,6);
  for(const p of points)for(const q of points)if(p.id!==q.id)assert.ok(Math.hypot(p.x-q.x,p.z-q.z)>20,'Station zones must not overlap');
  for(const format of ['ordered','free','random']as const){const race=new WaypointRace(format,2,22,road,course.waypointStations);assert.equal(race.sample(0,points[0]),null);
   for(let round=0;round<2;round++){for(let i=0;i<5;i++){const target=race.available(0)[0];assert.ok(race.sample(0,points[target]));assert.equal(race.sample(0,points[target]),null);}assert.deepEqual(race.available(0),[0]);assert.ok(race.sample(0,points[0]));}
   assert.equal(race.get(0).passed,12);assert.ok(race.get(0).finished);assert.equal(race.get(1).passed,0);
  }
 }
});

test('open navigation chooses direct routes, preserves targets and resets only after collecting a station',()=>{
 const course=getRaceCourse('merefield-airfield-v1'),race=new WaypointRace('free',2,22,course.checkpoints,course.waypointStations),start={x:16,z:18};
 const nav=race.navigation(0,start,{x:1,z:0});assert.equal(race.get(0).target,3);assert.equal(nav.route.length,3);assert.deepEqual(nav.route[nav.next],race.stations[3]);assert.ok(nav.distance<4);
 const moved=race.navigation(0,{x:20,z:18});assert.equal(moved,nav);assert.equal(moved.next,1);assert.equal(race.get(0).passed,0);
 assert.equal(race.sample(0,race.stations[0]),null);assert.ok(race.sample(0,race.stations[3]));assert.equal(race.sample(0,race.stations[3]),null);
 const next=race.navigation(0,race.stations[3]);assert.notEqual(next,nav);assert.notEqual(race.get(0).target,3);assert.equal(race.get(1).passed,0);
 assert.throws(()=>new WaypointRace('free',1,1,course.checkpoints,[]),/six finite/);
});

test('completed open drivers circulate on the perimeter without changing their finished score',()=>{
 const course=getRaceCourse('merefield-airfield-v1'),race=new WaypointRace('ordered',1,22,course.checkpoints,course.waypointStations);
 for(const id of [1,2,3,4,5,0])race.sample(0,race.stations[id]);
 for(const fraction of [.02,.3,.6,.9]){const p=course.point(fraction),to=course.point(fraction+.001),nav=race.navigation(0,p,{x:to.x-p.x,z:to.z-p.z});assert.equal(nav.route,course.checkpoints);assert.equal(nav.reverse,false);assert.ok(nav.next>=0&&nav.next<24);assert.equal(race.sample(0,p),null);assert.equal(race.get(0).passed,6);}
});

test('open infield recoveries find clear space without awarding stations or changing circuit recovery areas',()=>{
 const course=getRaceCourse('merefield-airfield-v1'),race=new WaypointRace('ordered',1,22,course.checkpoints,course.waypointStations);race.sample(0,race.stations[1]);
 const from=race.stations[1],nav=race.navigation(0,from),car={kind:'regent' as const,current:from,speed:0,health:100,finished:false,passed:1,nextCheckpoint:nav.next},other={...car,kind:'shuttle' as const,current:{...from}};
 assert.ok(course.distance(from.x,from.z)>20,'recovery is genuinely inside the open infield');
 const slot=freeRecoverySlot(car,[car,other],nav.route,courseRecoveryArea(course,true),()=>false);assert.ok(slot);assert.ok(Math.hypot(slot.x-from.x,slot.z-from.z)>7,'occupied station is avoided');assert.equal(race.get(0).passed,1);
 assert.equal(courseRecoveryArea(course),course);const legacy=getRaceCourse('pinecrest-ridge-v1');assert.equal(courseRecoveryArea(legacy,true),legacy);assert.equal(courseRecoveryArea(course,true).distance(250,0),Infinity);
});
