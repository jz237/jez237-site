import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {SALTMARSH} from '../src/port-farm-courses';
import {courseGridSlot,courseRoute,courseRecoveryArea} from '../src/race-course';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {stockSetup} from '../src/garage';
import {checkRoute,directionForCar} from '../src/event-rules';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {drivingObstacleClearance} from '../src/driving-probe';
import {RaceRecovery,freeRecoverySlot} from '../src/race-recovery';
import {createVehicleDrive} from '../src/drivetrain/chassis';
import {createVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
// Fixed 24-car field (the first 23 roster cars plus a second coupe) so later roster additions do not
// silently reshuffle this congestion regression; opposing-traffic outcomes are sensitive to field order.
const FIELD=[...CAR_KINDS.slice(0,23),CAR_KINDS[0]];
await R.init();
const dt=1/60;
const driver=(id:number,x:number,z:number,yaw:number,next:number):DriverCar=>({id,kind:'sedan',current:{x,y:.6,z},velocity:{x:0,y:0,z:0},forward:{x:Math.sin(yaw),y:0,z:Math.cos(yaw)},right:{x:Math.cos(yaw),y:0,z:-Math.sin(yaw)},speed:0,health:100,finished:false,nextCheckpoint:next,surface:'asphalt'});

test('race drivers keep the grid column they start in instead of crossing the other column',()=>{
 for(const direction of ['forward','reverse','opposing']as const){
  const brain=new DrivingBrain();
  for(let id=0;id<24;id++){
   const grid=courseGridSlot(SALTMARSH,id,direction),route=courseRoute(SALTMARSH,directionForCar(direction,id)),car=driver(id,grid.x,grid.z,grid.yaw,grid.next);
   brain.update(car,[car],'race',dt,undefined,route);
   const lane=brain.memory.get(id)!.lane,prev=route[(grid.next+route.length-1)%route.length],next=route[grid.next];
   const side=Math.sign((grid.x-prev.x)*(next.z-prev.z)-(grid.z-prev.z)*(next.x-prev.x));
   assert.equal(Math.abs(lane),1.7,`${direction}/${id}`);assert.equal(Math.sign(lane),side,`${direction}/${id} keeps its side`);
  }
 }
 // Arena and practice drivers keep the older spread of three lines.
 const brain=new DrivingBrain(),car=driver(4,0,0,0,1);brain.update(car,[car],'playground',dt);assert.equal(brain.memory.get(4)!.lane,0);
});

test('a driver door to door with a car slightly ahead eases away and gives way',()=>{
 const brain=new DrivingBrain(),route=courseRoute(SALTMARSH,'forward'),yaw=Math.PI/2;
 const me={...driver(1,-60,-118,yaw,1),speed:12,velocity:{x:12,y:0,z:0}},other={...driver(2,-58.5,-120,yaw,1),speed:12,velocity:{x:12,y:0,z:0}};
 const alone=new DrivingBrain(),solo={...me};alone.update(solo,[solo],'race',dt,undefined,route);
 let input=brain.update(me,[me,other],'race',dt,undefined,route);
 for(let i=0;i<20;i++)input=brain.update(me,[me,other],'race',dt,undefined,route);
 assert.equal(brain.memory.get(1)!.phase,'side by side');
 // The other car is on this car's right: steer left of the solo line and lift.
 const soloInput=alone.update(solo,[solo],'race',dt,undefined,route);
 assert.ok(input.steer<soloInput.steer-.1,'steers away from the neighbour');assert.ok(input.throttle<soloInput.throttle,'lifts to drop behind');
});

function race(direction:'forward'|'opposing'){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;SALTMARSH.buildPhysics(R,world);
 const brain=new DrivingBrain(),recovery=new RaceRecovery();
 const cars=Array.from({length:24},(_,id)=>{const kind=FIELD[id],spec=vehicleSpecification(kind,stockSetup(kind)),body=createVehiclePhysics(R,world,kind,spec.mass),grid=courseGridSlot(SALTMARSH,id,direction);
  body.body.setTranslation({x:grid.x,y:SALTMARSH.height(grid.x,grid.z)+.89,z:grid.z},true);body.body.setRotation({x:0,y:Math.sin(grid.yaw/2),z:0,w:Math.cos(grid.yaw/2)},true);
  const s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
  const d=Object.assign(driver(id,grid.x,grid.z,grid.yaw,grid.next),{kind,passed:grid.passed,last:Infinity,off:0});
  return{...body,kind,spec,s,d,route:courseRoute(SALTMARSH,directionForCar(direction,id)),drive:createVehicleDrive(body.body,body.controller,kind)};});
 const handles=new Set(cars.map(c=>c.body.handle)),drivers=cars.map(c=>c.d),condition={wheelDamage:new Float32Array(4),wheelShift:Array.from({length:4},()=>({x:0,y:0,z:0})),engineDamage:0,tyreDamage:undefined};
 const read=(c:typeof cars[0])=>{const d=c.d;d.current={...c.body.translation()};d.velocity={...c.body.linvel()};d.forward=rotateVehicleVector({x:0,y:0,z:1},c.body.rotation());d.right=rotateVehicleVector({x:1,y:0,z:0},c.body.rotation());d.speed=d.velocity.x*d.forward.x+d.velocity.y*d.forward.y+d.velocity.z*d.forward.z;d.surface=c.s.surface=SALTMARSH.surface(d.current.x,d.current.z);};
 const probe=(c:typeof cars[0])=>()=>{const d=c.d,yaw=Math.atan2(d.forward.x,d.forward.z),ray=(a:number)=>{const hit=world.castRay(new R.Ray({x:d.current.x,y:Math.max(d.current.y,SALTMARSH.height(d.current.x,d.current.z)+.55),z:d.current.z},{x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)}),24,true,undefined,undefined,undefined,c.body,col=>!handles.has(col.parent()?.handle as number));return hit?drivingObstacleClearance(d,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};};
 let first=-1,t=0;const finished=new Set<number>();
 try{
  for(let i=0;i<90;i++){for(const c of cars)c.drive.step(c.spec,c.s,dt,undefined,condition as any);world.step();}cars.forEach(read);
  for(;t<300&&!(first>=0&&t>first+60)&&finished.size<24;t+=dt){
   for(const c of cars){const d=c.d;
    if(!finished.has(d.id)){d.off=SALTMARSH.distance(d.current.x,d.current.z)>14?d.off+dt:0;
     if(d.off>7||recovery.ready(d as any,dt,brain.memory.get(d.id)?.attempts??0)){const def=DEFINITIONS[c.kind],shape=new R.Cuboid(def.halfWidth+.2,.25,def.halfLength+.2);
      const at=freeRecoverySlot(d as any,drivers as any,c.route,courseRecoveryArea(SALTMARSH),slot=>!!world.intersectionWithShape({x:slot.x,y:.8,z:slot.z},{x:0,y:Math.sin(slot.yaw/2),z:0,w:Math.cos(slot.yaw/2)},shape,undefined,undefined,undefined,c.body));
      if(at){c.body.setTranslation({x:at.x,y:.89,z:at.z},true);c.body.setRotation({x:0,y:Math.sin(at.yaw/2),z:0,w:Math.cos(at.yaw/2)},true);c.body.setLinvel({x:0,y:0,z:0},true);d.off=0;d.last=Infinity;brain.memory.delete(d.id);recovery.clear(d as any);read(c);}}}
    c.s.input=brain.update(d,drivers,'race',dt,probe(c),c.route);c.drive.step(c.spec,c.s,dt,undefined,condition as any);
   }
   world.step();
   for(const c of cars){read(c);const d=c.d,check=checkRoute(c.route,d.current.x,d.current.z,d.nextCheckpoint,d.last,SALTMARSH.checkpointRadius);d.last=check.distance;
    if(check.passed){if(!finished.has(d.id))d.passed++;d.nextCheckpoint=(d.nextCheckpoint+1)%24;d.last=Infinity;if(d.passed>=24&&!finished.has(d.id)){finished.add(d.id);d.finished=true;if(first<0)first=t;}}}
  }
 }finally{cars.forEach(c=>world.removeVehicleController(c.controller));world.free();}
 return{finished:finished.size,first,t};
}

test('a full mixed Saltmarsh field finishes inside the post-winner window in forward and opposing traffic',t=>{
 const forward=race('forward'),opposing=race('opposing');
 t.diagnostic(`forward ${forward.finished}/24 winner ${forward.first.toFixed(1)}s; opposing ${opposing.finished}/24 winner ${opposing.first.toFixed(1)}s`);
 assert.equal(forward.finished,24);assert.ok(opposing.finished>=22,'oncoming traffic no longer jams most of the field');
});
