import * as T from 'three';
import {createStuntWorld} from '../src/stunt-world';
import {buildStuntPhysics} from '../src/stunt-layout';
import {StuntChallengeProgress} from '../src/stunt-challenge';
import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {DOUBLE_LOOP,doubleLoopPoint,doubleLoopMesh} from '../src/double-loop';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from '../src/vehicle-physics';
await R.init();
test('stock Ravine drives two connected inversions and exits upright with normal inputs',()=>{
 const kind='buggy';
 const radius=DOUBLE_LOOP.radius,shift=DOUBLE_LOOP.shift*DOUBLE_LOOP.turns,segments=DOUBLE_LOOP.segments,world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;buildStuntPhysics(R,world);
 const points=Array.from({length:segments+1},(_,i)=>doubleLoopPoint(i/segments));
 const spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass),yaw=Math.atan(DOUBLE_LOOP.shift/(Math.PI*2*radius));car.body.setTranslation({x:DOUBLE_LOOP.x-150*Math.tan(yaw),y:.89,z:DOUBLE_LOOP.z-150},true);car.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);
 const s:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false}};
 const progress=new StuntChallengeProgress('double-loop'),firstOnly=new StuntChallengeProgress('double-loop');
 let maxY=0,minUp=1,inverted=0,firstInverted=0,secondInverted=0,entered=false,complete=false,entranceSpeed=0,index=0;
 for(let tick=0;tick<2400;tick++){
  const p0=car.body.translation(),q0=car.body.rotation(),forward=rotateVehicleVector({x:0,y:0,z:1},q0),right=rotateVehicleVector({x:1,y:0,z:0},q0);
  if(p0.z>DOUBLE_LOOP.z-5&&!entered){entered=true;entranceSpeed=s.speed;}
  if(entered){let dist=Infinity;for(let i=index;i<Math.min(points.length,index+35);i++){const p=points[i],d=Math.hypot(p.x-p0.x,p.y-p0.y,p.z-p0.z);if(d<dist){dist=d;index=i;}}const target=index>segments-12?{x:DOUBLE_LOOP.x+shift+Math.sin(yaw)*15,y:0,z:DOUBLE_LOOP.z+Math.cos(yaw)*15}:points[Math.min(segments,index+12)],dx=target.x-p0.x,dy=target.y-p0.y,dz=target.z-p0.z;s.input.steer=Math.max(-1,Math.min(1,Math.atan2(dx*right.x+dy*right.y+dz*right.z,dx*forward.x+dy*forward.y+dz*forward.z)*1.5));}
  const targetSpeed=radius===20?36:radius===16?32:29;s.input.throttle=s.speed<targetSpeed?1:0;s.input.brake=s.speed>targetSpeed+1?.1:0;
  stepVehiclePhysics(car.body,car.controller,kind,spec,s,1/60);world.step();const p=car.body.translation(),q=car.body.rotation(),up=1-2*(q.x*q.x+q.z*q.z);maxY=Math.max(maxY,p.y);minUp=Math.min(minUp,up);
  const sample={...p,up,grounded:[0,1,2,3].filter(i=>car.controller.wheelIsInContact(i)).length,health:s.health};progress.sample(1/60,sample);if(index<segments/2)firstOnly.sample(1/60,sample);
  if(up<-.5){inverted++;if(index<segments/2)firstInverted++;else secondInverted++;}if(index>segments-15&&p.z>DOUBLE_LOOP.z+7&&p.y<2&&up>.8){complete=true;break;}

 }
 world.removeVehicleController(car.controller);world.free();
 assert.ok(progress.completed,progress.hint);assert.equal(firstOnly.completed,false,'one loop cannot earn the double-loop medal');assert.ok(firstInverted>60&&secondInverted>60,`both loops inverted: ${firstInverted}/${secondInverted}, index ${index}`);assert.ok(complete,'exit upright beyond the loop');assert.ok(maxY>30&&minUp<-.99&&inverted>60,'actual upside-down traversal');assert.ok(entranceSpeed>30&&entranceSpeed<34,'reachable run-up speed');
});

test('double-loop artwork uses the same continuous ribbon as physics',()=>{
 const art=createStuntWorld();try{const mesh=art.root.getObjectByName('driveable_double_loop') as T.Mesh,expected=doubleLoopMesh();assert.ok(mesh);assert.deepEqual(mesh.geometry.getAttribute('position').array,expected.positions);assert.deepEqual(mesh.geometry.index!.array,expected.indices);for(const t of [0,.5,1]){const p=doubleLoopPoint(t);assert.ok(Math.abs(p.y)<1e-8);assert.ok(Math.abs(p.z-DOUBLE_LOOP.z)<1e-8);}assert.equal(doubleLoopPoint(1).x-doubleLoopPoint(0).x,32);}finally{art.dispose();}
});
