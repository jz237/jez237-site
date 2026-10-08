import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {createVehiclePhysics,vehicleSpecification,vehicleChassisHalfExtents,stepVehiclePhysics} from '../src/vehicle-physics';
import {freshComponents,applyComponentImpact,validComponents} from '../src/component-damage';
import {accumulateStructure,freshStructure} from '../src/structural-damage';
import {Simulation} from '../multiplayer/simulation';
import {STEP,NEUTRAL,type Snapshot} from '../multiplayer/protocol';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {validOnlineSnapshot} from '../src/network-validation';
await R.init();
const close=(a:number,b:number,e=1e-5)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const vector=(a:any,b:any)=>{for(const k of ['x','y','z'])close(a[k],b[k]);};
function envelopes(body:R.RigidBody){return Array.from({length:body.numColliders()},(_,i)=>{const c=body.collider(i),s=c.shape;return{handle:c.handle,p:{...c.translationWrtParent()},q:{...c.rotationWrtParent()},shape:s.type,h:s.type===R.ShapeType.Cuboid?{...c.halfExtents()}:undefined,vertices:s.type===R.ShapeType.ConvexPolyhedron?Array.from((s as R.ConvexPolyhedron).vertices):undefined,radius:s.type===R.ShapeType.Capsule?(s as R.Capsule).radius:undefined,height:s.type===R.ShapeType.Capsule?(s as R.Capsule).halfHeight:undefined};});}
function restored(actual:ReturnType<typeof envelopes>,expected:ReturnType<typeof envelopes>){
 const rounded=(v:unknown)=>JSON.parse(JSON.stringify(v,(k,n)=>typeof n==='number'&&k!=='handle'?Math.round(n*1e5)/1e5:n));
 assert.deepEqual(rounded(actual),rounded(expected));
}
function mass(body:R.RigidBody){return{mass:body.mass(),center:{...body.localCom()},inertia:{...body.principalInertia()},frame:{...body.principalInertiaLocalFrame()}};}
function sameMass(body:R.RigidBody,original:ReturnType<typeof mass>){close(body.mass(),original.mass,.001);vector(body.localCom(),original.center);vector(body.principalInertia(),original.inertia);}
const cast=(c:R.Collider,origin:{x:number;y:number;z:number},dir:{x:number;y:number;z:number})=>c.castRay(new R.Ray(origin,dir),20,true);

test('crash structure is directional, bounded and independent of cosmetic scuffs or legacy state',()=>{
 for(const kind of CAR_KINDS){const d=DEFINITIONS[kind],state=freshStructure();accumulateStructure(state,kind,{x:0,y:0,z:d.halfLength},{x:0,y:0,z:-1},30);assert.ok(state[0]>.4,kind);assert.deepEqual(state.slice(1),[0,0,0,0]);
  const before=state.slice();for(const damage of [0,1,2,-10,NaN,Infinity])accumulateStructure(state,kind,{x:0,y:0,z:d.halfLength},{x:0,y:0,z:-1},damage);assert.deepEqual(state,before);
  accumulateStructure(state,kind,{x:0,y:0,z:d.halfLength},{x:0,y:0,z:1},30);assert.deepEqual(state,before,'outward impulses cannot enlarge crush');
  for(let i=0;i<100;i++)accumulateStructure(state,kind,{x:0,y:0,z:d.halfLength},{x:0,y:0,z:-1},30);assert.equal(state[0],1);
 }
 const c=freshComponents();for(const structure of [null,[],[0,0,0,0],[0,0,0,0,NaN],[0,0,0,0,1.1],[0,0,0,0,-1],['0',0,0,0,0]])assert.equal(validComponents({...c,structure}),false);
 delete c.structure;assert.ok(validComponents(c));applyComponentImpact(c,'coupe',{x:0,y:0,z:2},{x:0,y:0,z:-1},40);assert.equal(c.structure,undefined);
});

test('every stock and armored chassis compresses the struck end while preserving handles, mass, safe volume and repair',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass,armor);
  try{
   world.step();const original=envelopes(car.body),m=mass(car.body),h=car.collider.halfExtents(),p=car.collider.translationWrtParent()!,front=p.z+h.z,rear=p.z-h.z;
   const incoming={x:0,y:p.y,z:10},back={x:0,y:p.y,z:-10};
   close(10-cast(car.collider,incoming,{x:0,y:0,z:-1}),front);close(-10+cast(car.collider,back,{x:0,y:0,z:1}),rear);
   car.structure.update([1,0,0,0,0],40);world.step();
   assert.ok(10-cast(car.collider,incoming,{x:0,y:0,z:-1})<front-.04,`${kind}/${armor} front actually retreats`);
   close(-10+cast(car.collider,back,{x:0,y:0,z:1}),rear);sameMass(car.body,m);
   for(const structure of [[1,1,1,1,1],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]){
    car.structure.update(structure,0);world.step();sameMass(car.body,m);const changed=envelopes(car.body);assert.deepEqual(changed.map(p=>p.handle),original.map(p=>p.handle));
    for(let i=0;i<car.body.numColliders();i++){const c=car.body.collider(i);assert.ok(c.volume()>0,`${kind} part ${i} volume`);assert.equal(c.isEnabled(),true);assert.equal(c.activeEvents(),R.ActiveEvents.CONTACT_FORCE_EVENTS);}
   }
   car.structure.update(freshStructure());world.step();restored(envelopes(car.body),original);sameMass(car.body,m);
   car.structure.update(undefined,40);vector(car.collider.halfExtents(),vehicleChassisHalfExtents(kind,40));car.structure.update(undefined,20);car.structure.update(freshStructure());world.step();restored(envelopes(car.body),original);
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});

test('crushed utility bed and buggy cockpit stay open, while armor and roof collision envelopes move',()=>{
 for(const kind of ['utility','buggy','van']as const){const world=new R.World({x:0,y:0,z:0}),car=createVehiclePhysics(R,world,kind,vehicleSpecification(kind).mass,3);
  try{
   world.step();const original=envelopes(car.body);car.structure.update([1,1,1,1,1],0);world.step();const changed=envelopes(car.body);
   assert.ok(changed.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(original[i])).length>original.length/2,kind+' compound pieces update');
   if(kind==='utility'||kind==='buggy'){
    const z=kind==='utility'?-1.9:0,origin={x:0,y:4,z};let top=-Infinity;
    for(let i=0;i<car.body.numColliders();i++){const hit=cast(car.body.collider(i),origin,{x:0,y:-1,z:0});if(hit>=0)top=Math.max(top,4-hit);}
    assert.ok(top<0,`${kind} opening filled at ${top}`);
   }else{const roof=changed[1],before=original[1];assert.ok(Math.max(...roof.vertices!.filter((_,i)=>i%3===1))<Math.max(...before.vertices!.filter((_,i)=>i%3===1))-.1);}
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});

test('crush survives bounded history loss, frozen transport and cold restore; race recovery keeps it and repair clears it',()=>{
 const sim=new Simulation(R,'playground'),cold=new Simulation(R,'playground');
 try{sim.phase='playing';const c=sim.cars[0];applyComponentImpact(c.state.components!,c.kind,{x:0,y:0,z:2},{x:0,y:0,z:-1},40);c.state.health=60;c.structure.update(c.state.components!.structure,60);c.state.dents=[];
  const snapshot={...sim.snapshot(true),members:[],ack:{}} as Snapshot,wire=decodeSnapshotWire(encodeSnapshotWire(snapshot)) as Snapshot;assert.ok(validOnlineSnapshot(wire));cold.restore(wire);
  assert.deepEqual(cold.cars[0].state.components!.structure,c.state.components!.structure);vector(cold.cars[0].collider.halfExtents(),c.collider.halfExtents());vector(cold.cars[0].collider.translationWrtParent(),c.collider.translationWrtParent());
  const race=new Simulation(R,'race');try{race.restore({...wire,mode:'race'});const before=envelopes(race.cars[0].body);assert.ok(race.recover(0));assert.deepEqual(envelopes(race.cars[0].body),before);}finally{race.dispose();}
  assert.ok(cold.recover(0));assert.deepEqual(cold.cars[0].state.components!.structure,freshStructure());vector(cold.cars[0].collider.halfExtents(),vehicleChassisHalfExtents('coupe'));
  for(const missing of [false,true]){const legacy=structuredClone(wire);legacy.elapsed=20;if(missing)delete legacy.cars[0].components;else delete legacy.cars[0].components!.structure;cold.restore(legacy);assert.equal(cold.cars[0].state.components!.structure,undefined);vector(cold.cars[0].collider.halfExtents(),vehicleChassisHalfExtents('coupe',60));}
 }finally{sim.dispose();cold.dispose();}
});

test('all damaged vehicle types still accelerate, steer and brake with finite stable physical state',()=>{
 for(const kind of CAR_KINDS){const world=new R.World({x:0,y:-9.81,z:0}),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass,3);world.timestep=STEP;
  world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));car.body.setTranslation({x:0,y:1,z:0},true);car.structure.update([1,.5,.8,.3,.7],40);
  const state={health:40,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,input:{...NEUTRAL}};
  try{let moving=0;for(let i=0;i<540;i++){state.input={throttle:i>=60&&i<420?1:0,steer:i>=300&&i<360?.2:0,brake:i>=420?1:0,handbrake:false};stepVehiclePhysics(car.body,car.controller,kind,spec,state,STEP);world.step();if(i===419)moving=Math.abs(state.speed);assert.ok(Object.values(car.body.translation()).every(Number.isFinite));}
   assert.ok(moving>6,`${kind} acceleration ${moving}`);assert.ok(Math.abs(state.speed)<moving*.6,`${kind} brakes ${state.speed} from ${moving}`);assert.ok(car.body.translation().y<2,kind+' grounded');
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});
