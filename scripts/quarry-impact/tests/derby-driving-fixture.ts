import {drivingObstacleClearance} from '../src/driving-probe';
import R from '@dimforge/rapier3d-compat';
import{DrivingBrain}from'../src/driving-brain';
import{createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector}from'../src/vehicle-physics';
import{DERBY_ARENA as arena}from'../src/derby-arena';import{derbyGridSlot}from'../src/event-rules';import{CAR_KINDS}from'../src/rules';

export function derbyDrivingFixture(count=8,mixed=false,seconds=120,Brain=DrivingBrain){
 const w=new R.World({x:0,y:-9.81,z:0}),q=new R.EventQueue(true);w.timestep=1/60;
 w.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));
 for(let i=0;i<96;i++){const a=i/96*Math.PI*2;w.createCollider(R.ColliderDesc.cuboid(2.22,.58,.375).setTranslation(arena.x+Math.sin(a)*arena.radius,.58,arena.z+Math.cos(a)*arena.radius).setRotation({x:0,y:Math.sin(a/2),z:0,w:Math.cos(a/2)}));}
 const brain=new Brain(arena),cars=Array.from({length:count},(_,id)=>{const kind=mixed?CAR_KINDS[id%CAR_KINDS.length]:'utility',spec=vehicleSpecification(kind),c=createVehiclePhysics(R,w,kind,spec.mass),p=derbyGridSlot(id,count,arena);c.body.setTranslation({x:p.x,y:.88,z:p.z},true);c.body.setRotation({x:0,y:Math.sin(p.yaw/2),z:0,w:Math.cos(p.yaw/2)},true);return{...c,id,kind,spec,current:{x:p.x,y:.88,z:p.z},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,rollTime:0,finished:false,nextCheckpoint:1,surface:'gravel' as const,damageLeft:0,damageRight:0,steering:0,slip:0,gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};});
 const byBody=new Map(cars.map(c=>[c.body.handle,c]));let recoveries=0,fast=0,slow=0,total=0,hits=0,strong=0,speed=0;const phases:Record<string,number>={},last=new Map<string,number>();
 for(let tick=0;tick<seconds*60;tick++){
  for(const c of cars){const up=rotateVehicleVector({x:0,y:1,z:0},c.body.rotation());c.rollTime=up.y<.2?c.rollTime+1/60:0;
   // Match the real solo derby's five-second rollover recovery, including its
   // condition penalty. An inverted lightweight car must not stay parked for
   // the remaining two-minute fixture when gameplay would have recovered it.
   if(c.rollTime>5){const p=c.body.translation(),f=rotateVehicleVector({x:0,y:0,z:1},c.body.rotation()),yaw=Math.atan2(f.x,f.z);c.body.setTranslation({x:p.x,y:.89,z:p.z},true);c.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);c.body.setLinvel({x:0,y:0,z:0},true);c.body.setAngvel({x:0,y:0,z:0},true);c.rollTime=0;c.health=Math.max(1,c.health-7);brain.memory.delete(c.id);recoveries++;}
   c.current={...c.body.translation()};c.velocity={...c.body.linvel()};c.forward=rotateVehicleVector({x:0,y:0,z:1},c.body.rotation());c.right=rotateVehicleVector({x:1,y:0,z:0},c.body.rotation());c.speed=c.velocity.x*c.forward.x+c.velocity.z*c.forward.z;}
  for(const c of cars){c.input=brain.update(c,cars,'derby',1/60,()=>{const yaw=Math.atan2(c.forward.x,c.forward.z);const ray=(a:number)=>{const dir={x:Math.sin(yaw+a),y:0,z:Math.cos(yaw+a)},start={x:c.current.x,y:c.current.y,z:c.current.z};const hit=w.castRay(new R.Ray(start,dir),24,true,undefined,undefined,undefined,c.body,col=>!byBody.has(col.parent()?.handle!));return hit?drivingObstacleClearance(c,a,hit.timeOfImpact):24;};return{front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};});stepVehiclePhysics(c.body,c.controller,c.kind,c.spec,c,1/60);if(tick>=20*60){total++;if(Math.abs(c.speed)>6)fast++;if(Math.abs(c.speed)<2)slow++;speed+=Math.abs(c.speed);const p=brain.memory.get(c.id)?.phase??'?';phases[p]=(phases[p]??0)+1;}}
  w.step(q);q.drainContactForceEvents(e=>{if(tick<20*60)return;const a=byBody.get(w.getCollider(e.collider1()).parent()?.handle!),b=byBody.get(w.getCollider(e.collider2()).parent()?.handle!);if(!a||!b||a===b)return;const key=[a.id,b.id].sort().join(':');if(tick-(last.get(key)??-1e4)<30)return;const dx=b.current.x-a.current.x,dz=b.current.z-a.current.z,d=Math.hypot(dx,dz),closing=((a.velocity.x-b.velocity.x)*dx+(a.velocity.z-b.velocity.z)*dz)/Math.max(1,d);if(e.totalForceMagnitude()/60>1500){last.set(key,tick);hits++;if(closing>6)strong++;}});
 }
 const r={count,mixed,meanSpeed:+(speed/total).toFixed(2),fastFraction:+(fast/total).toFixed(3),slowFraction:+(slow/total).toFixed(3),hits,strong,recoveries,phases};q.free();w.free();return r;
}
