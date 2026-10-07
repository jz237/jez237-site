import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Quaternion,Euler} from 'three';
import {terrainCollisionTiles,terrainContactHandle} from '../src/terrain-collision';
import {terrainGeometry,createQuarryPhysics,quarryColliderLayout} from '../src/quarry-layout';
import {vehicleContact} from '../src/vehicle-contact';
import {createVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';
import {stockSetup} from '../src/garage';
import {CAR_KINDS} from '../src/rules';
import {CollisionScars} from '../src/collision-contact';
import {ImpactAdjudicator} from '../src/impact-adjudication';
await R.init();
const dt=1/60;
const triangle=(p:Float32Array,i:Uint32Array,offset:number)=>Array.from(i.slice(offset,offset+3)).flatMap(n=>Array.from(p.slice(n*3,n*3+3))).join(',');

test('terrain partition retains every original triangle, coordinate and winding exactly once',()=>{
 const mesh=terrainGeometry(),tiles=terrainCollisionTiles(mesh),faces=new Map<string,number>();
 assert.equal(tiles.length,400);assert.equal(new Set(tiles.map(t=>t.key)).size,400);
 for(let i=0;i<mesh.indices.length;i+=3){const key=triangle(mesh.positions,mesh.indices,i);faces.set(key,(faces.get(key)??0)+1);}
 let count=0;
 for(const tile of tiles)for(let i=0;i<tile.indices.length;i+=3){const key=triangle(tile.positions,tile.indices,i),n=faces.get(key);assert.ok(n,'no invented, reordered or duplicated face');if(n===1)faces.delete(key);else faces.set(key,n-1);count++;}
 assert.equal(count,73728);assert.equal(faces.size,0,'no omitted terrain');
});

test('factory registers every terrain tile for enable, restore and removal, preserving all other scenery',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),owned=createQuarryPhysics(R,world,false);
 try{
  const terrain=[...owned.statics].filter(([id])=>id==='terrain'||id.startsWith('terrain:')).map(([,c])=>c);
  assert.equal(terrain.length,400);assert.equal(owned.statics.size,quarryColliderLayout().length+399);
  for(const spec of quarryColliderLayout().filter(s=>s.id!=='terrain'))assert.ok(owned.statics.has(spec.id),spec.id);
  assert.equal(new Set(terrain.map(c=>terrainContactHandle(world,c.handle))).size,1);
  const handles=new Set(terrain.map(c=>c.handle)),ray=new R.Ray({x:0,y:100,z:0},{x:0,y:-1,z:0});world.step();
  const hit=()=>world.castRay(ray,200,true,undefined,undefined,undefined,undefined,c=>handles.has(c.handle));
  assert.ok(hit());terrain.forEach(c=>c.setEnabled(false));world.step();assert.equal(hit(),null);
  terrain.forEach(c=>c.setEnabled(true));world.step();assert.ok(hit());
  for(const c of terrain)world.removeCollider(c,true);world.step();assert.equal(hit(),null);
  assert.equal(world.colliders.len(),owned.statics.size-400+owned.props.length);
 }finally{world.free();}
});

test('terrain seams share one logical impact without merging separate cars or scenery',()=>{
 const world=new R.World({x:0,y:0,z:0}),owned=createQuarryPhysics(R,world,false),tiles=[...owned.statics].filter(([id])=>id==='terrain'||id.startsWith('terrain:')).map(([,c])=>c);
 const car={kind:'buggy',...createVehiclePhysics(R,world,'buggy',vehicleSpecification('buggy').mass)},other={kind:'buggy',...createVehiclePhysics(R,world,'buggy',vehicleSpecification('buggy').mass)};
 try{
  const keys=new Set(tiles.flatMap(t=>Array.from({length:car.body.numColliders()},(_,i)=>vehicleContact(world,[car,other],car.body.collider(i).handle,t.handle).key)));
  assert.equal(keys.size,1);
  const key=[...keys][0];assert.notEqual(vehicleContact(world,[car,other],other.collider.handle,tiles[0].handle).key,key);
  assert.notEqual(vehicleContact(world,[car,other],car.collider.handle,owned.statics.get('quarry-cliffs')!.handle).key,key);
  const contacts=tiles.map((t,i)=>({key:vehicleContact(world,[car],car.collider.handle,t.handle).key,impulse:50000+i,closing:8,speed:8,damageScale:1}));
  assert.equal(new CollisionScars().adjudicate(contacts,0).length,1);
  assert.equal(new ImpactAdjudicator().adjudicate(contacts,0).length,1);
  assert.deepEqual(new ImpactAdjudicator().adjudicate(contacts,0),new ImpactAdjudicator().adjudicate([contacts.at(-1)!],0));
 }finally{world.removeVehicleController(car.controller);world.removeVehicleController(other.controller);world.free();}
});

test('full CCD stops every vehicle family in fast, angular and steep-edge terrain impacts',()=>{
 const mesh=terrainGeometry(),world=new R.World({x:0,y:-9.81,z:0}),queue=new R.EventQueue(true);world.timestep=dt;
 for(const tile of terrainCollisionTiles(mesh))world.createCollider(R.ColliderDesc.trimesh(tile.positions,tile.indices).setFriction(.85));world.step();
 const height=(x:number,z:number)=>{const hit=world.castRay(new R.Ray({x,y:150,z},{x:0,y:-1,z:0}),300,true,undefined,undefined,undefined,undefined,c=>c.parent()===null);assert.ok(hit);return 150-hit.timeOfImpact;};
 const cases=[{x:0,z:0,v:{x:0,y:-180,z:0},w:{x:0,y:0,z:0},angles:[0,0,0]},{x:32,z:32,v:{x:35,y:-120,z:25},w:{x:0,y:0,z:0},angles:[.35,.5,.2]},{x:0,z:32,v:{x:24,y:-60,z:0},w:{x:12,y:17,z:8},angles:[.7,.3,1.2]},{x:-160,z:-6.64,v:{x:-50,y:-80,z:12},w:{x:8,y:-5,z:6},angles:[.3,.2,.4]}];
 try{for(const kind of CAR_KINDS)for(const armor of[0,3])for(const scenario of cases){
  const spec=vehicleSpecification(kind,{...stockSetup(kind),armor}),rig=createVehiclePhysics(R,world,kind,spec.mass,armor);
  try{
   assert.ok(rig.body.isCcdEnabled());rig.body.setTranslation({x:scenario.x,y:height(scenario.x,scenario.z)+5,z:scenario.z},true);
   rig.body.setRotation(new Quaternion().setFromEuler(new Euler(...scenario.angles)),true);rig.body.setLinvel(scenario.v,true);rig.body.setAngvel(scenario.w,true);let contacts=0;
   for(let tick=0;tick<90;tick++){world.step(queue);queue.drainContactForceEvents(()=>contacts++);const p=rig.body.translation();assert.ok(Object.values(p).every(Number.isFinite));assert.ok(p.y-height(p.x,p.z)>0,`${kind} armor ${armor} must not pass through terrain`);}
   assert.ok(contacts>0,kind+' must hit the ground');
  }finally{world.removeVehicleController(rig.controller);world.removeRigidBody(rig.body);}
 }}finally{queue.free();world.free();}
});
