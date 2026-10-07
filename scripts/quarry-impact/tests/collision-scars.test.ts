import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import {CAR_KINDS} from '../src/rules';
import {createVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';
import {ImpactAdjudicator} from '../src/impact-adjudication';
import {Simulation} from '../multiplayer/simulation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';

await R.init();
const dt=1/60;
test('a light touch marks immediately, continuous rubbing is bounded, and a new touch is not suppressed',()=>{
 const judge=new CollisionScars(),touch={key:'car:wall',speed:.001,impulse:.00001};
 assert.deepEqual(judge.adjudicate([touch],0),[touch]);
 for(let tick=1;tick<15;tick++)assert.deepEqual(judge.adjudicate([touch],tick*dt),[]);
 assert.deepEqual(judge.adjudicate([touch],.25),[touch]);
 assert.deepEqual(judge.adjudicate([touch],.30),[touch],'separated contact marks again');
 assert.deepEqual(judge.adjudicate([{...touch,key:'other'}],.31),[{...touch,key:'other'}]);
 judge.clear();assert.deepEqual(judge.adjudicate([touch],.30),[touch]);
 assert.deepEqual(judge.adjudicate([{...touch,speed:0},{...touch,impulse:0},{...touch,speed:NaN}],.4),[]);
});

test('all eleven actual vehicle colliders report light contacts below the former force threshold',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=dt;
  const spec=vehicleSpecification(kind),car={kind,...createVehiclePhysics(R,world,kind,spec.mass,armor)};
  // A wide wall catches actual front tubes, armor or chassis; no invented force events.
  world.createCollider(R.ColliderDesc.cuboid(5,5,.5).setTranslation(0,0,4));
  car.body.setLinvel({x:0,y:0,z:.05},true);
  let contacts=0,light=0,health=0;const scars=new CollisionScars(),impacts=new ImpactAdjudicator();
  for(let tick=0;tick<6000&&contacts===0;tick++){
   // Slow sustained approach avoids damping stopping short of the wall.
   car.body.setLinvel({x:0,y:0,z:.05},true);
   const motion=captureCollisionMotion(world);world.step(queue);
   const rows:any[]=[];
   queue.drainContactForceEvents(e=>{
    const h1=e.collider1(),h2=e.collider2(),pair=vehicleContact(world,[car],h1,h2);if(!pair.a&&!pair.b)return;
    const m=vehicleContactManifold(world,h1,h2);assert.ok(m,kind+' witness');
    const va=collisionPointVelocity(world,motion,h1,m.point1),vb=collisionPointVelocity(world,motion,h2,m.point2);
    const speed=Math.hypot(vb.x-va.x,vb.y-va.y,vb.z-va.z),impulse=e.totalForceMagnitude()*dt;
    rows.push({key:pair.key,speed,impulse,closing:speed,damageScale:1});
    if(e.totalForceMagnitude()<15000)light++;
   });
   contacts+=scars.adjudicate(rows,tick*dt).length;
   health+=impacts.adjudicate(rows,tick*dt).reduce((sum,v)=>sum+v.damage,0);
  }
  assert.ok(contacts>0,`${kind} armor ${armor} marks`);assert.ok(light>0,`${kind} armor ${armor} reports light force`);assert.equal(health,0);
  queue.free();world.removeVehicleController(car.controller);world.free();
 }
});

test('point velocity includes rotating cars and props without inventing motion for stationary contacts',()=>{
 const world=new R.World({x:0,y:0,z:0});
 const body=world.createRigidBody(R.RigidBodyDesc.dynamic()),collider=world.createCollider(R.ColliderDesc.cuboid(1,1,1),body);
 const fixed=world.createCollider(R.ColliderDesc.cuboid(1,1,1).setTranslation(10,0,0));
 body.setAngvel({x:0,y:2,z:0},true);
 let motion=captureCollisionMotion(world);
 assert.deepEqual(collisionPointVelocity(world,motion,collider.handle,{x:1,y:0,z:0}),{x:0,y:0,z:-2});
 assert.deepEqual(collisionPointVelocity(world,motion,fixed.handle,{x:10,y:0,z:0}),{x:0,y:0,z:0});
 body.setAngvel({x:0,y:0,z:0},true);motion=captureCollisionMotion(world);
 assert.deepEqual(collisionPointVelocity(world,motion,collider.handle,{x:1,y:0,z:0}),{x:0,y:0,z:0});world.free();
});

test('authority emits zero-health scars from real light contact and retains them in reconnect and binary snapshots',()=>{
 const sim=new Simulation(R,'playground');sim.phase='playing';
 // Clear the course and create a controlled wall around an actual authoritative car.
 sim.world.gravity={x:0,y:0,z:0};
 const c=sim.cars[0];c.body.setTranslation({x:0,y:30,z:0},true);c.body.setRotation({x:0,y:0,z:0,w:1},true);
 sim.world.createCollider(R.ColliderDesc.cuboid(5,5,.5).setTranslation(0,30,3));
 const humans=new Set(sim.cars.map(c=>c.state.id));const before=structuredClone(c.state.components);
 for(let i=0;i<600&&!sim.damage.some(d=>d.car===0&&d.scar);i++){c.body.setLinvel({x:0,y:0,z:.05},true);sim.step(humans);}
 const events=sim.damage.filter(d=>d.car===0);assert.ok(events.some(d=>d.scar));assert.ok(events.every(d=>d.scar&&d.damage===0));
 assert.equal(c.state.health,100);assert.equal(c.state.inflicted,0);assert.deepEqual(c.state.components,before);
 const snapshot=sim.snapshot(true),decoded=decodeSnapshotWire(encodeSnapshotWire(snapshot))as typeof snapshot;
 assert.deepEqual(decoded,snapshot);assert.ok(decoded.cars[0].dents!.some(d=>d.scar));
 sim.queue.free();sim.world.free();
});
