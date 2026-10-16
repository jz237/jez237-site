import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';import {wheelContactMotion} from '../src/wheel-contact-motion';
await R.init();const forward={x:0,y:0,z:1},right={x:1,y:0,z:0};
function rig(){const w=new R.World({x:0,y:0,z:0}),body=w.createRigidBody(R.RigidBodyDesc.dynamic()),ground=w.createRigidBody(R.RigidBodyDesc.kinematicVelocityBased());let point={x:0,y:0,z:2},normal={x:0,y:1,z:0},steer=0,contact=true;
 const controller={wheelIsInContact:()=>contact,wheelContactPoint:()=>point,wheelContactNormal:()=>normal,wheelSteering:()=>steer,wheelGroundObject:()=>({parent:()=>ground})}as unknown as R.DynamicRayCastVehicleController;
 return{w,body,ground,set(p=point,n=normal,s=steer,c=contact){point=p;normal=n;steer=s;contact=c;},read(){return wheelContactMotion(body,controller,0,forward,right);}};}
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} vs ${b}`);
test('yaw produces opposite scrub at the axles even with zero centre lateral speed',()=>{const r=rig();try{r.body.setLinvel({x:0,y:0,z:20},true);r.body.setAngvel({x:0,y:1,z:0},true);near(r.read().lateral,2);r.set({x:0,y:0,z:-2});near(r.read().lateral,-2);near(r.read().longitudinal,20);}finally{r.w.free();}});
test('a wheel pointed along its contact velocity has no lateral scrub',()=>{const r=rig();try{r.body.setLinvel({x:5,y:0,z:20},true);r.set(undefined,undefined,Math.atan2(5,20));near(r.read().lateral,0);near(r.read().longitudinal,Math.hypot(5,20));near(r.read().angle,0);}finally{r.w.free();}});
test('moving and rotating ground is subtracted, with no airborne or normal-direction scrub',()=>{const r=rig();try{r.body.setLinvel({x:4,y:3,z:10},true);r.ground.setLinvel({x:4,y:0,z:10},true);near(r.read().lateral,0);near(r.read().longitudinal,0);r.ground.setAngvel({x:0,y:1,z:0},true);near(r.read().lateral,-2);r.set(undefined,undefined,0,false);assert.deepEqual(r.read(),{lateral:0,longitudinal:0,angle:0});}finally{r.w.free();}});

test('all chassis traction assists respond to spinning tyre contacts despite zero chassis side slip',async()=>{
 const {CAR_KINDS}=await import('../src/rules'),{createVehiclePhysics,stepVehiclePhysics,vehicleSpecification}=await import('../src/vehicle-physics');
 // Extreme yaw deliberately stresses the grip limiter on every drivetrain;
 // this is a kernel sensitivity check, not a representative driving manoeuvre.
 for(const kind of CAR_KINDS){const forces:number[]=[];
  for(const [level,yaw] of [[0,20],[.5,20],[1,20],[1,0]]as const){const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));const spec=vehicleSpecification(kind),{body,controller}=createVehiclePhysics(R,world,kind,spec.mass);
   const state={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel' as const,gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false,assists:{traction:level,stability:0 as const}}};
   try{body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<180;i++){body.wakeUp();stepVehiclePhysics(body,controller,kind,spec,state,1/60);world.step();}
    body.setRotation({x:0,y:0,z:0,w:1},true);body.setLinvel({x:0,y:0,z:20},true);body.setAngvel({x:0,y:yaw,z:0},true);state.input.throttle=1;stepVehiclePhysics(body,controller,kind,spec,state,1/60);
    assert.equal(state.slip,0);forces.push([0,1,2,3].reduce((total,i)=>total+Math.abs(controller.wheelEngineForce(i)??0),0));
   }finally{world.free();}
  }
  assert.ok(forces[0]>forces[1]&&forces[1]>forces[2],kind+' '+JSON.stringify(forces));assert.ok(forces[2]>=0);assert.ok(forces[2]<forces[3]-.1,kind+' contact yaw must affect traction despite identical chassis slip: '+JSON.stringify(forces));
 }
});

test('all chassis remain driveable through a sustained assisted turn on asphalt and gravel',async()=>{
 const {CAR_KINDS}=await import('../src/rules'),{createVehiclePhysics,stepVehiclePhysics,vehicleSpecification}=await import('../src/vehicle-physics');
 for(const kind of CAR_KINDS)for(const surface of ['asphalt','gravel']as const){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
  const spec=vehicleSpecification(kind),{body,controller}=createVehiclePhysics(R,world,kind,spec.mass);
  const state={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface,gear:1,rpm:850,input:{throttle:1,steer:0,brake:0,handbrake:false,assists:{traction:1 as const,stability:1 as const}}};
  try{body.setTranslation({x:0,y:1.2,z:0},true);let distance=0,last=body.translation();
   for(let tick=0;tick<600;tick++){
    state.input.steer=tick>240?.2:0;stepVehiclePhysics(body,controller,kind,spec,state,1/60);world.step();const p=body.translation();distance+=Math.hypot(p.x-last.x,p.z-last.z);last=p;
    assert.ok(Number.isFinite(state.speed)&&Number.isFinite(state.slip),kind+' '+surface);
    for(let i=0;i<4;i++)assert.ok(Number.isFinite(controller.wheelEngineForce(i)),kind);
   }
   assert.ok(distance>30,kind+' '+surface+' travelled '+distance);assert.ok(body.translation().y>.2,kind+' remains above the ground');
  }finally{world.free();}
 }
});
