import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';import {vehicleContactManifold} from '../src/vehicle-contact';import {ImpactAdjudicator} from '../src/impact-adjudication';
await R.init();
test('a real spinning body impact has closing speed and damage even with no initial centre velocity',()=>{
 const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=1/60;
 const body=world.createRigidBody(R.RigidBodyDesc.dynamic()),car=world.createCollider(R.ColliderDesc.cuboid(.9,.5,2.3).setDensity(400).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
 const wall=world.createCollider(R.ColliderDesc.cuboid(.5,3,8).setTranslation(1.8,0,0));body.setAngvel({x:0,y:8,z:0},true);
 const judge=new ImpactAdjudicator();let checked=false;
 for(let tick=0;tick<60&&!checked;tick++){
  const center={...body.linvel()},motion=captureCollisionMotion(world);world.step(queue);
  queue.drainContactForceEvents(e=>{
   const m=vehicleContactManifold(world,e.collider1(),e.collider2());if(!m)return;
   const va=collisionPointVelocity(world,motion,e.collider1(),m.point1),vb=collisionPointVelocity(world,motion,e.collider2(),m.point2),n=m.normal;
   const closing=Math.abs((vb.x-va.x)*n.x+(vb.y-va.y)*n.y+(vb.z-va.z)*n.z),old=Math.abs(center.x*n.x+center.y*n.y+center.z*n.z);
   const decision=judge.adjudicate([{key:'spin',closing,impulse:e.totalForceMagnitude()/60,damageScale:1}],tick/60);
   assert.ok(old<.65,'stationary centre misses the corner hit');assert.ok(closing>3);assert.ok(decision.some(d=>d.damage>0));checked=true;
  });
 }
 assert.ok(checked);queue.free();world.free();
});

import {Simulation} from '../multiplayer/simulation';
test('authority applies a spinning-corner impact to condition and records a nonzero replay direction',()=>{
 const sim=new Simulation(R,'playground');sim.phase='playing';sim.world.gravity={x:0,y:0,z:0};
 const car=sim.cars[0];car.body.setTranslation({x:0,y:40,z:0},true);car.body.setRotation({x:0,y:0,z:0,w:1},true);car.body.setLinvel({x:0,y:0,z:0},true);car.body.setAngvel({x:0,y:8,z:0},true);
 sim.world.createCollider(R.ColliderDesc.cuboid(.5,3,8).setTranslation(1.8,40,0));const humans=new Set(sim.cars.map(c=>c.state.id));
 for(let i=0;i<120&&!sim.damage.some(d=>d.car===0&&d.damage>0);i++)sim.step(humans);
 const hit=sim.damage.find(d=>d.car===0&&d.damage>0);assert.ok(hit);assert.ok(car.state.health<100);assert.ok(Math.hypot(hit.direction.x,hit.direction.y,hit.direction.z)>.99);assert.ok(sim.damage.some(d=>d.car===0&&d.scar));sim.queue.free();sim.world.free();
});
