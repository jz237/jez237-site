import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {createQuarryPhysics} from '../src/quarry-layout';
import {IRONFIELD} from '../src/ironfield-course';
import {stockSetup} from '../src/garage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';

await R.init();
const dt=1/60,gravity={x:0,y:-9.81,z:0};
const near=(actual:number,expected:number,tolerance=1e-4)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
const bodyState=(body:R.RigidBody)=>({handle:body.handle,p:{...body.translation()},q:{...body.rotation()},v:{...body.linvel()},w:{...body.angvel()},sleeping:body.isSleeping(),enabled:body.isEnabled(),colliders:body.numColliders()});
const counts=(world:R.World)=>({bodies:world.bodies.len(),colliders:world.colliders.len(),controllers:world.vehicleControllers.size});
function car(world:R.World,x:number,y:number,z:number){
 const spec=vehicleSpecification('tern',stockSetup('tern')),physical=createVehiclePhysics(R,world,'tern',spec.mass);
 physical.body.setTranslation({x,y,z},true);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false}};
 return{...physical,state,step(){stepVehiclePhysics(physical.body,physical.controller,'tern',spec,state,dt,undefined,undefined,0,[0,0,0,0]);}};
}
function ball(world:R.World,x:number,y:number,z:number){
 const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(x,y,z).setCcdEnabled(true));
 const collider=world.createCollider(R.ColliderDesc.ball(.3).setMass(20).setRestitution(0),body);return{body,collider};
}
function contactCount(world:R.World,a:R.Collider,b:R.Collider){let count=0;world.contactPair(a,b,m=>{count+=m.numSolverContacts();});return count;}

test('actual Quarry and Ironfield worlds keep overlapping terrain rays, falling contacts and suspension queries separate',()=>{
 const quarry=new R.World(gravity),ironfield=new R.World(gravity);quarry.timestep=ironfield.timestep=dt;
 // This point is inside the real roof footprint and clear of Ironfield's
 // inner loop barrier: the intended contrast is roof versus open floor.
 const original=createQuarryPhysics(R,quarry,false),owned=IRONFIELD.buildPhysics(R,ironfield),roof=original.statics.get('works-roof')!,floor=ironfield.getRigidBody(owned[0])!.collider(0),p={...roof.translation(),z:roof.translation().z+4},top=p.y+roof.halfExtents().y;
 const qc=car(quarry,p.x,top+.89,p.z),ic=car(ironfield,p.x,top+.89,p.z),qb=ball(quarry,p.x+3,top+2,p.z),ib=ball(ironfield,p.x+3,top+2,p.z);
 try{
  quarry.step();ironfield.step();
  const ray=new R.Ray({x:p.x-3,y:top+10,z:p.z},{x:0,y:-1,z:0});
  const quarryHit=quarry.castRay(ray,30,true)!,ironfieldHit=ironfield.castRay(ray,30,true)!;
  assert.equal(quarryHit.collider,roof);assert.equal(ironfieldHit.collider,floor);
  near(ray.origin.y-quarryHit.timeOfImpact,top);near(ray.origin.y-ironfieldHit.timeOfImpact,0);
  for(let tick=0;tick<180;tick++){
   qc.step();ic.step();
   if(tick<12)for(let wheel=0;wheel<4;wheel++)assert.equal(ic.controller.wheelIsInContact(wheel),false,'Ironfield suspension must fall through the absent Quarry roof');
   quarry.step();ironfield.step();
  }
  assert.ok(qc.body.translation().y>top+.5&&qc.body.translation().y<top+1);
  assert.ok(ic.body.translation().y>.5&&ic.body.translation().y<1,JSON.stringify({p:ic.body.translation(),q:ic.body.rotation(),v:ic.body.linvel()}));
  for(let wheel=0;wheel<4;wheel++){
   assert.equal(qc.controller.wheelIsInContact(wheel),true);assert.equal(ic.controller.wheelIsInContact(wheel),true);
   assert.equal(qc.controller.wheelGroundObject(wheel),roof);assert.equal(ic.controller.wheelGroundObject(wheel),floor);
   near(qc.controller.wheelContactPoint(wheel)!.y,top);near(ic.controller.wheelContactPoint(wheel)!.y,0);
  }
  near(qb.body.translation().y,top+.3,.01);near(ib.body.translation().y,.3,.01);
  assert.ok(contactCount(quarry,qb.collider,roof)>0,'Quarry projectile physically rests on its actual roof');
  assert.ok(contactCount(ironfield,ib.collider,floor)>0,'Ironfield projectile physically rests on its own floor');
 }finally{quarry.removeVehicleController(qc.controller);ironfield.removeVehicleController(ic.controller);quarry.free();ironfield.free();}
});

test('stepping and disposing an owned Ironfield world preserves every retained Quarry prop and world count exactly',()=>{
 const quarry=new R.World(gravity),original=createQuarryPhysics(R,quarry,false);quarry.timestep=dt;
 try{
  quarry.step();
  // Keep real props awake with nonzero motion so equality cannot be explained
  // by every body sleeping or an empty/stubbed retained world.
  original.props.forEach(({body},i)=>{body.setLinvel({x:.25+i*.01,y:.12,z:-.4},true);body.setAngvel({x:.1,y:i*.03,z:-.07},true);});
  const before={counts:counts(quarry),props:original.props.map(({body})=>bodyState(body)),statics:[...original.statics].map(([id,c])=>({id,handle:c.handle,enabled:c.isEnabled(),p:{...c.translation()},q:{...c.rotation()}}))};
  assert.equal(before.props.length,22);assert.ok(before.counts.colliders>1000);assert.ok(before.props.every(p=>!p.sleeping&&p.v.x>0));
  for(let cycle=0;cycle<2;cycle++){
   const world=new R.World(gravity);world.timestep=dt;const owned=IRONFIELD.buildPhysics(R,world),c=car(world,0,.89,0);
   try{
    for(let tick=0;tick<180;tick++){c.state.input={throttle:tick<90?.55:0,steer:tick<90?.08:0,brake:tick>=90?1:0,handbrake:false};c.step();world.step();}
    assert.ok(Math.hypot(c.body.translation().x,c.body.translation().z)>4,'new-world vehicle really ran');
    assert.ok(Object.values(c.body.translation()).every(Number.isFinite));
    world.removeVehicleController(c.controller);world.removeRigidBody(c.body);
    for(const handle of owned)world.removeRigidBody(world.getRigidBody(handle)!);
    assert.deepEqual(counts(world),{bodies:0,colliders:0,controllers:0},'all owned course physics is removable');
   }finally{world.free();}
   const after={counts:counts(quarry),props:original.props.map(({body})=>bodyState(body)),statics:[...original.statics].map(([id,c])=>({id,handle:c.handle,enabled:c.isEnabled(),p:{...c.translation()},q:{...c.rotation()}}))};
   assert.deepEqual(after,before,'constructing/stepping/freeing another world cannot alter the retained Quarry');
  }
  quarry.step();assert.ok(original.props.some(({body},i)=>body.translation().x!==before.props[i].p.x),'retained world remains usable when resumed');
 }finally{quarry.free();}
});
