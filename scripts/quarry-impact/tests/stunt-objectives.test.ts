import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {StuntChallengeProgress,stuntChallengeSpawn,type StuntSample} from '../src/stunt-challenge';
import {STUNT_PARK} from '../src/stunt-course';
import {STUNT_LOOP,stuntLoopPoint} from '../src/stunt-layout';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
import {CHALLENGES,challengeMedal,challengeCourse} from '../src/challenges';
import {emptyRun} from '../src/session-telemetry';
await R.init();
const traces:Record<string,StuntSample[]>={};
for(const task of ['loop','gap']as const)test('stock Ravine earns '+task+' completion through physical driving and the live milestone detector',()=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;STUNT_PARK.buildPhysics(R,world);
 const spec=vehicleSpecification('buggy'),car=createVehiclePhysics(R,world,'buggy',spec.mass),spawn=stuntChallengeSpawn(task)??STUNT_PARK.practiceSpawn;
 car.body.setTranslation({x:spawn.x,y:.89,z:spawn.z},true);car.body.setRotation({x:0,y:Math.sin(spawn.yaw/2),z:0,w:Math.cos(spawn.yaw/2)},true);
 const s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
 const progress=new StuntChallengeProgress(task),trace:StuntSample[]=[],points=Array.from({length:361},(_,i)=>stuntLoopPoint(i/360));let index=0,entered=false,elapsed=0;
 try{
  for(let i=0;i<90;i++){stepVehiclePhysics(car.body,car.controller,'buggy',spec,s,1/60);world.step();}
  for(let tick=0;tick<2700&&!progress.completed;tick++){
   const p=car.body.translation(),q=car.body.rotation(),forward=rotateVehicleVector({x:0,y:0,z:1},q),right=rotateVehicleVector({x:1,y:0,z:0},q);let steer=0;
   if(task==='loop'){
    if(p.z>STUNT_LOOP.z-5)entered=true;
    if(entered){let distance=Infinity;for(let i=index;i<Math.min(361,index+35);i++){const t=points[i],d=Math.hypot(t.x-p.x,t.y-p.y,t.z-p.z);if(d<distance){distance=d;index=i;}}
     const target=index>348?{x:STUNT_LOOP.x+STUNT_LOOP.shift+Math.sin(spawn.yaw)*15,y:0,z:STUNT_LOOP.z+Math.cos(spawn.yaw)*15}:points[Math.min(360,index+12)],dx=target.x-p.x,dy=target.y-p.y,dz=target.z-p.z;steer=Math.max(-1,Math.min(1,Math.atan2(dx*right.x+dy*right.y+dz*right.z,dx*forward.x+dy*forward.y+dz*forward.z)*1.5));}
   }
   const target=task==='loop'?32:27.5;s.input={throttle:s.speed<target?1:0,brake:s.speed>target+1?.1:0,steer,handbrake:false};stepVehiclePhysics(car.body,car.controller,'buggy',spec,s,1/60);world.step();elapsed+=1/60;
   const at=car.body.translation(),rot=car.body.rotation(),sample={...at,up:1-2*(rot.x**2+rot.z**2),grounded:[0,1,2,3].filter(i=>car.controller.wheelIsInContact(i)).length,health:100};trace.push(sample);progress.sample(1/60,sample);
  }
  assert.ok(progress.completed,task+' completed: '+progress.hint);assert.ok(elapsed<16,'gold attainable without state injection');traces[task]=trace;
  for(const bad of ['air','upright','teleport','wreck']as const){const rejected=new StuntChallengeProgress(task);for(const [i,sample]of trace.entries())rejected.sample(1/60,{...sample,...(bad==='air'?{grounded:0}:bad==='upright'?{up:0}:bad==='teleport'&&i===2?{x:sample.x+100}:bad==='wreck'?{health:0}:{})});assert.equal(rejected.completed,false,task+'/'+bad+' must not qualify');}
 }finally{world.removeVehicleController(car.controller);world.free();}
});

test('stunt medals require actual completion, condition, time and no recovery; previous challenge venues remain fixed',()=>{
 for(const id of ['ravine-alderwick-loop','ravine-alderwick-gap']){const c=CHALLENGES.find(c=>c.id===id)!,r={...emptyRun(),completed:true,finished:true,seconds:14,health:80};assert.equal(challengeCourse(c),'alderwick-stunt-v1');assert.equal(challengeMedal(c,r),3);for(const change of [{finished:false},{recovered:true},{health:49},{seconds:46},{completed:false}])assert.equal(challengeMedal(c,{...r,...change}),0);}
 for(const c of CHALLENGES.slice(0,53))if(c.mode!=='race')assert.equal(challengeCourse(c),'quarry-v1');
});
