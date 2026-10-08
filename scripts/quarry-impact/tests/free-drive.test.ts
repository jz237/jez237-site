import {ReplayRecorder,decodeReplay,encodeReplay,replayCourseId,replayCarStride} from '../src/replay-data';
import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES,type CourseId} from '../src/course-id';
import {getRaceCourse} from '../src/race-course';
import {freeDriveSpawn,freeDriveRecovery} from '../src/free-drive';
import {DEFAULT_EVENT,EVENT_KEY,readEventOptions} from '../src/event-rules';
import {exportSave,readSave} from '../src/save-backup';
import {DEFINITIONS,type CarKind} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
const venues=(Object.keys(COURSE_NAMES)as CourseId[]).filter(id=>id!=='quarry-v1');

test('free drive choices survive reload and portable backups independently of race rules; old saves remain exact',async()=>{
 assert.deepEqual(readEventOptions(),DEFAULT_EVENT);
 assert.deepEqual(readEventOptions(JSON.stringify({...DEFAULT_EVENT,playgroundCourse:'invalid',playgroundTraffic:'false'})),DEFAULT_EVENT);
 for(const playgroundCourse of Object.keys(COURSE_NAMES))for(const playgroundTraffic of [true,false]){
  const expected={...DEFAULT_EVENT,course:'ironfield-figure-eight-v1' as const,direction:'reverse' as const,playgroundCourse,playgroundTraffic};
  const normalized=readEventOptions(JSON.stringify(expected));assert.deepEqual(normalized,expected);
  const backup=await readSave(await exportSave({getItem:key=>key===EVENT_KEY?JSON.stringify(expected):null}));
  assert.deepEqual(readEventOptions(backup.entries[EVENT_KEY]),expected);
 }
});

test('practice recovery keeps safe airfield infield positions, avoids occupied or blocked ground and escapes every venue boundary',()=>{
 for(const id of venues){
  const course=getRaceCourse(id),p=course.point(.3),car={kind:'shuttle' as const,current:{x:p.x,y:course.height(p.x,p.z)+.9,z:p.z},forward:{x:0,z:1}};
  const here=freeDriveRecovery(course,car,[car],()=>false)!;assert.deepEqual(here,{x:p.x,z:p.z,yaw:0},id);
  car.current={x:1000,y:-10,z:1000};const recovery=freeDriveRecovery(course,car,[car],()=>false)!;assert.ok(recovery,id);assert.equal(course.outside(recovery.x,course.height(recovery.x,recovery.z)+.9,recovery.z),false,id);assert.ok(course.distance(recovery.x,recovery.z)<1,id);
  const parked={...car,current:{x:recovery.x,y:.9,z:recovery.z}};const alternate=freeDriveRecovery(course,car,[car,parked],()=>false)!;assert.ok(alternate);assert.ok(Math.hypot(alternate.x-recovery.x,alternate.z-recovery.z)>2*Math.hypot(DEFINITIONS.shuttle.halfLength,DEFINITIONS.shuttle.halfWidth)+.79,'does not spawn into traffic');
  assert.equal(freeDriveRecovery(course,car,[car],()=>true),undefined,'wait if no clear location');
 }
 const course=getRaceCourse('merefield-airfield-v1'),car={kind:'buggy' as const,current:{x:50,y:1,z:40},forward:{x:1,z:0}};
 assert.deepEqual(freeDriveRecovery(course,car,[car],()=>false),{x:50,z:40,yaw:Math.PI/2});
});

test('five-car practice grids physically settle without overlap on all added venues',()=>{
 for(const id of venues){
  const course=getRaceCourse(id),world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;course.buildPhysics!(R,world);
  const cars=Array.from({length:5},(_,index)=>{
   const kind=(['shuttle','sedan','hatch','muscle','wagon']as CarKind[])[index],spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),spawn=freeDriveSpawn(course,index);
   car.body.setTranslation({x:spawn.x,y:course.height(spawn.x,spawn.z)+.89,z:spawn.z},true);car.body.setRotation({x:0,y:Math.sin(spawn.yaw/2),z:0,w:Math.cos(spawn.yaw/2)},true);
   const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:course.surface(spawn.x,spawn.z),gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
   return{...car,spec,kind,spawn,state};
  });
  try{
   for(let i=0;i<120;i++){for(const c of cars)stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c.state,1/60,undefined,undefined,0,[0,0,0,0]);world.step();}
   const bodies=new Set(cars.map(c=>c.body.handle));let contacts=0;
   for(const c of cars){
    const p=c.body.translation(),q=c.body.rotation();assert.ok(p.y-course.height(p.x,p.z)>.4&&p.y-course.height(p.x,p.z)<1.2,id+' ground contact');assert.ok(1-2*(q.x*q.x+q.z*q.z)>.93,id+' upright');assert.ok(Math.hypot(p.x-c.spawn.x,p.z-c.spawn.z)<.4,id+' settled in place');
    for(let i=0;i<c.body.numColliders();i++)world.contactPairsWith(c.body.collider(i),other=>{if(other.parent()?.handle!==c.body.handle&&bodies.has(other.parent()!.handle))world.contactPair(c.body.collider(i),other,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<=0)contacts++;});});
   }
   assert.equal(contacts,0,id+' no overlapping cars');
  }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 }
});

test('practice replays retain every venue and pose while derby venue restrictions remain intact',()=>{
 for(const id of Object.keys(COURSE_NAMES)as CourseId[]){
  const meta={version:1 as const,mode:'playground' as const,reverse:false,courseId:id,props:0,created:'2026-10-08T00:00:00Z',cars:[{id:0,kind:'coupe' as const}]};
  const recorder=new ReplayRecorder(meta),values=new Float32Array(replayCarStride(meta));values[0]=12;values[1]=1;values[2]=30;values[6]=1;values[7]=100;for(let i=0;i<4;i++)values[21+i*8]=1;
  recorder.capture(0,()=>values,true);recorder.capture(1,()=>values,true);const doc=recorder.document(),loaded=decodeReplay(encodeReplay(doc));
  assert.equal(replayCourseId(loaded.meta),id);assert.equal(loaded.meta.mode,'playground');assert.deepEqual(loaded.frames,doc.frames);
  if(id!=='quarry-v1')assert.throws(()=>new ReplayRecorder({...meta,mode:'derby'}),/circuit races/);
 }
});
