import test from 'node:test';
import assert from 'node:assert/strict';
import {transform} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,vehicleSuspensionRestLength,vehicleSuspensionTravel,type PhysicsState} from '../src/vehicle-physics';
import {vehicleArmorLayout} from '../src/vehicle-armor-spec';
import {vehicleContact} from '../src/vehicle-contact';
import {vehicleWheelRadius} from '../src/classic-vehicle-specs';
import {readArmorPrevious} from './armor-invariants';
await R.init();
const dt=1/60;
const near=(a:number,b:number,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const vectorNear=(a:{x:number;y:number;z:number},b:{x:number;y:number;z:number},tolerance=1e-5)=>{near(a.x,b.x,tolerance);near(a.y,b.y,tolerance);near(a.z,b.z,tolerance);};
const state=():PhysicsState=>({health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}});
const setup=(armor:number)=>({engine:2,tires:1,armor,tune:{gearing:.2,suspension:-.2,steering:.1,brakeBias:0,differential:.3}});
const previousSource=readArmorPrevious('src/vehicle-physics.ts').toString().replace(/from '([^']+)'/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`);
const previous=await import('data:text/javascript;base64,'+Buffer.from((await transform(previousSource,{loader:'ts',format:'esm',target:'es2022'})).code).toString('base64'));

test('all eleven stock cars retain exact mass properties, shapes and driving trajectories',()=>{
 assert.equal(CAR_KINDS.length,11);
 for(const kind of CAR_KINDS){
  const runs=[{create:createVehiclePhysics,step:stepVehiclePhysics,spec:vehicleSpecification},{create:previous.createVehiclePhysics,step:previous.stepVehiclePhysics,spec:previous.vehicleSpecification}].map(api=>{
   const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));
   const spec=api.spec(kind,setup(0)),car=api.create(R,world,kind,spec.mass);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};
  });
  try{
   const [a,b]=runs;assert.deepEqual(a.spec,b.spec);assert.equal(a.body.numColliders(),b.body.numColliders());assert.equal(a.body.mass(),b.body.mass());assert.deepEqual(a.body.localCom(),b.body.localCom());assert.deepEqual(a.body.principalInertia(),b.body.principalInertia());
   for(let i=0;i<a.body.numColliders();i++){assert.deepEqual(a.body.collider(i).shape,b.body.collider(i).shape);assert.deepEqual(a.body.collider(i).translation(),b.body.collider(i).translation());assert.deepEqual(a.body.collider(i).rotation(),b.body.collider(i).rotation());}
   for(let tick=0;tick<300;tick++){
    for(const r of runs){r.s.input={throttle:tick<30?0:tick<180?.75:tick<240?0:-.5,steer:tick>=100&&tick<180?.11:0,brake:tick>=180&&tick<240?1:0,handbrake:false};r.api.step(r.body,r.controller,kind,r.spec,r.s,dt,undefined,undefined,.12);r.world.step();}
    assert.deepEqual(a.body.translation(),b.body.translation(),`${kind} tick ${tick}`);assert.deepEqual(a.body.rotation(),b.body.rotation());assert.deepEqual(a.s,b.s);
   }
  }finally{for(const r of runs){r.world.removeVehicleController(r.controller);r.world.free();}}
 }
});

test('fitted armor adds collision without double-counting mass or changing flat-ground handling',()=>{
 for(const kind of CAR_KINDS)for(const level of [1,2,3]){
  const runs=[{create:createVehiclePhysics,step:stepVehiclePhysics},{create:previous.createVehiclePhysics,step:previous.stepVehiclePhysics}].map(api=>{
   const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));
   const spec=vehicleSpecification(kind,setup(level)),car=api.create(R,world,kind,spec.mass,level);car.body.setTranslation({x:0,y:.89,z:0},true);return{api,world,spec,...car,s:state()};
  });
  try{
   const [a,b]=runs,layout=vehicleArmorLayout(kind,level);assert.ok(layout.beams.length>0);assert.equal(a.body.numColliders(),b.body.numColliders()+(level===1?2:4));
   near(a.body.mass(),DEFINITIONS[kind].mass+95*level+24,.001);assert.equal(a.body.mass(),b.body.mass());vectorNear(a.body.localCom(),b.body.localCom(),1e-6);vectorNear(a.body.principalInertia(),b.body.principalInertia(),.002);
   for(let i=b.body.numColliders();i<a.body.numColliders();i++)assert.equal(a.body.collider(i).mass(),0);
   for(let tick=0;tick<210;tick++){
    for(const r of runs){r.s.input={throttle:tick<30?0:tick<150?.6:0,steer:tick>=85&&tick<150?.08:0,brake:tick>=150?1:0,handbrake:false};r.api.step(r.body,r.controller,kind,r.spec,r.s,dt,undefined,undefined,0);r.world.step();}
    // Rapier re-normalizes accumulated mass properties for each zero-mass part,
    // introducing float32 roundoff. Keep that below a tenth of a millimetre.
    vectorNear(a.body.translation(),b.body.translation(),.0001);vectorNear(a.body.rotation(),b.body.rotation(),.00001);near(a.body.rotation().w,b.body.rotation().w,.00001);near(a.s.speed,b.s.speed,.0001);near(a.s.steering,b.s.steering,.00001);near(a.s.rpm,b.s.rpm,.01);assert.equal(a.s.gear,b.s.gear);
   }
  }finally{for(const r of runs){r.world.removeVehicleController(r.controller);r.world.free();}}
 }
});

test('actual narrow projectiles strike front reinforcement and report its owning car for all eleven kinds',()=>{
 for(const kind of CAR_KINDS){
  const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true),spec=vehicleSpecification(kind,setup(1)),car={kind,...createVehiclePhysics(R,world,kind,spec.mass,1)},layout=vehicleArmorLayout(kind,1);
  car.body.setBodyType(R.RigidBodyType.Fixed,true);
  const stockCount=car.body.numColliders()-2;
  const beam=layout.beams.filter(b=>b.region==='front'&&Math.abs(b.a.x-b.b.x)>.5).sort((a,b)=>(b.a.z+b.b.z)-(a.a.z+a.b.z))[0];assert.ok(beam,kind+' front crossbar');
  const point={x:(beam.a.x+beam.b.x)/2,y:(beam.a.y+beam.b.y)/2-layout.modelOffset,z:(beam.a.z+beam.b.z)/2};
  const missile=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(point.x,point.y,point.z+1).setCcdEnabled(true));
  const probe=world.createCollider(R.ColliderDesc.cuboid(.04,.04,.04).setMass(100).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS),missile);missile.setLinvel({x:0,y:0,z:-18},true);
  let firstContact:number|undefined;
  try{
   for(let tick=0;tick<12;tick++){world.step(queue);queue.drainContactForceEvents(event=>{const h1=event.collider1(),h2=event.collider2();if(h1!==probe.handle&&h2!==probe.handle)return;const contact=vehicleContact(world,[car],h1,h2);assert.equal(contact.a??contact.b,car);firstContact??=h1===probe.handle?h2:h1;});}
   assert.ok(firstContact!==undefined,kind+' guard must physically stop the probe');assert.ok(Array.from({length:car.body.numColliders()-stockCount},(_,i)=>car.body.collider(stockCount+i).handle).includes(firstContact),kind+' first contact must be reinforcement');
   assert.ok(missile.linvel().z> -5,kind+' guard must absorb incoming speed');
  }finally{queue.free();world.removeVehicleController(car.controller);world.free();}
 }
});

test('reinforcement contacts share one car-pair cooldown while two-collider stock cadence stays unchanged',()=>{
 const world=new R.World({x:0,y:0,z:0}),cars:({kind:CarKind}&ReturnType<typeof createVehiclePhysics>)[]=[];
 try{
  for(const kind of CAR_KINDS){
   const a={kind,...createVehiclePhysics(R,world,kind,DEFINITIONS[kind].mass+285,3)},b={kind:'coupe' as const,...createVehiclePhysics(R,world,'coupe',DEFINITIONS.coupe.mass)};cars.push(a,b);const keys=new Set<string>();
   for(let i=0;i<a.body.numColliders();i++)for(let j=0;j<b.body.numColliders();j++){const c=vehicleContact(world,[a,b],a.body.collider(i).handle,b.body.collider(j).handle);assert.equal(c.a,a);assert.equal(c.b,b);keys.add(c.key);assert.equal(vehicleContact(world,[a,b],b.body.collider(j).handle,a.body.collider(i).handle).key,c.key);}
   assert.equal(keys.size,1,kind+' compound pair must not multiply damage');
  }
  const a={kind:'coupe' as const,...createVehiclePhysics(R,world,'coupe',1480)},b={kind:'sedan' as const,...createVehiclePhysics(R,world,'sedan',1650)};cars.push(a,b);const keys=new Set<string>();
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)keys.add(vehicleContact(world,[a,b],a.body.collider(i).handle,b.body.collider(j).handle).key);assert.equal(keys.size,4);
 }finally{for(const car of cars)world.removeVehicleController(car.controller);world.free();}
});

test('all four tier-three contact envelopes meet their visible outer impact rails',()=>{
 for(const kind of CAR_KINDS){
  const world=new R.World({x:0,y:0,z:0}),car=createVehiclePhysics(R,world,kind,DEFINITIONS[kind].mass+285,3),layout=vehicleArmorLayout(kind,3);car.body.setBodyType(R.RigidBodyType.Fixed,true);world.step();
  try{
   for(const [index,region] of (['front','rear','left','right']as const).entries()){
    const beam=layout.beams.find(b=>b.id===region+(index<2?'-impact-1':'-sill'))!;assert.ok(beam);
    const outward={x:index===2?-1:index===3?1:0,y:0,z:index===0?1:index===1?-1:0},point={x:(beam.a.x+beam.b.x)/2,y:(beam.a.y+beam.b.y)/2-layout.modelOffset,z:(beam.a.z+beam.b.z)/2};
    const ray=new R.Ray({x:point.x+outward.x*.5,y:point.y,z:point.z+outward.z*.5},{x:-outward.x,y:0,z:-outward.z}),hit=world.castRay(ray,1,true)!;
    assert.ok(hit,kind+' '+region);assert.equal(hit.collider.handle,car.body.collider(car.body.numColliders()-4+index).handle);near(hit.timeOfImpact,.5-beam.radius,.0001);
   }
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});

test('maximum reinforcement leaves the buggy cockpit and utility cargo bed physically open',()=>{
 for(const [kind,z,floor] of [['buggy',-.15,-.527],['utility',-1.9,-.185]] as const){
  const world=new R.World({x:0,y:-9.81,z:0}),car=createVehiclePhysics(R,world,kind,DEFINITIONS[kind].mass+285,3);car.body.setTranslation({x:0,y:1,z:0},true);car.body.setBodyType(R.RigidBodyType.Fixed,true);world.step();
  try{
   const ray=world.castRay(new R.Ray({x:0,y:4,z},{x:0,y:-1,z:0}),6,true)!;assert.ok(ray);near(4-ray.timeOfImpact,1+floor,.001);
   const box=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,2.8,z));world.createCollider(R.ColliderDesc.cuboid(.07,.08,.07).setDensity(200),box);for(let tick=0;tick<180;tick++)world.step();
   near(box.translation().y,1+floor+.08,.012);assert.ok(Math.abs(box.translation().x)<.10,kind+' box passes through opening');
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});

test('reinforcement clears real wheel volumes through full suspension travel and steering',()=>{
 for(const kind of CAR_KINDS){
  const world=new R.World({x:0,y:0,z:0}),car=createVehiclePhysics(R,world,kind,DEFINITIONS[kind].mass+285,3),stockCount=car.body.numColliders()-4;
  try{
   for(let wheel=0;wheel<4;wheel++)for(const travel of [-1,0,1])for(const steer of wheel<2?[-.7,0,.7]:[0]){
    const anchor=car.controller.wheelChassisConnectionPointCs(wheel)!,position={x:anchor.x,y:anchor.y-vehicleSuspensionRestLength(kind)+travel*vehicleSuspensionTravel(kind),z:anchor.z};
    // A wheel is a sideways cylinder; steering rotates that axle around body Y.
    const s=Math.sin(steer/2),c=Math.cos(steer/2),rotation={x:s*Math.SQRT1_2,y:s*Math.SQRT1_2,z:c*Math.SQRT1_2,w:c*Math.SQRT1_2};
    const tyre=new R.Cylinder(.14,vehicleWheelRadius(kind));
    for(let i=stockCount;i<car.body.numColliders();i++)assert.equal(car.body.collider(i).intersectsShape(tyre,position,rotation),false,`${kind} armor piece ${i-stockCount}, wheel ${wheel}, travel ${travel}, steer ${steer}`);
   }
  }finally{world.removeVehicleController(car.controller);world.free();}
 }
});
