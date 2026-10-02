import R from '@dimforge/rapier3d-compat';
import {createHash} from 'node:crypto';
import type {CarKind} from '../src/rules';
import type {PhysicsState,PhysicsTuning,createVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';

export type PhysicsAPI={createVehiclePhysics:typeof createVehiclePhysics;vehicleSpecification:typeof vehicleSpecification;stepVehiclePhysics:(...args:any[])=>unknown};
export const dt=1/60;
export const kinds:CarKind[]=['coupe','sedan','hatch','muscle','wagon','utility','compact','van','tern','marten','buggy'];
export const setup=(tuned=false):PhysicsTuning=>({engine:tuned?2:0,tires:tuned?2:0,armor:tuned?3:0,tune:{gearing:tuned?.35:0,suspension:tuned?-.25:0,steering:tuned?.2:0,brakeBias:tuned?-.2:0,differential:tuned?.5:0}});
const neutral=()=>({throttle:0,steer:0,brake:0,handbrake:false});
const fresh=():PhysicsState=>({health:70,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:neutral()});
const yaw=(q:R.Quaternion)=>Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.x*q.x));
const wrap=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));
const speed=(body:R.RigidBody)=>{const v=body.linvel();return Math.hypot(v.x,v.z);};
function rig(api:PhysicsAPI,kind:CarKind,tuned=false){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0).setFriction(1));
 const tuning=setup(tuned),spec=api.vehicleSpecification(kind,tuning),car=api.createVehiclePhysics(R,world,kind,spec.mass,tuning.armor);car.body.setTranslation({x:0,y:.89,z:0},true);
 return{...car,world,spec,state:fresh(),dispose(){world.removeVehicleController(car.controller);world.free();}};
}
export function trajectory(api:PhysicsAPI,kind:CarKind,tuned:boolean,damaged:boolean,condition?:unknown,originalWheelDamage?:readonly number[]){
 const r=rig(api,kind,tuned),samples:number[]=[],damage=originalWheelDamage??(damaged?[.64,.35,.15,.59]:[0,0,0,0]),shift=damaged?[{x:.08,y:0,z:-.07},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:-.04,y:0,z:.06}]:Array.from({length:4},()=>({x:0,y:0,z:0}));
 try{
  const bodyProperties={colliders:r.body.numColliders(),mass:r.body.mass(),com:{...r.body.localCom()},inertia:{...r.body.principalInertia()},shapes:Array.from({length:r.body.numColliders()},(_,i)=>({shape:r.body.collider(i).shape,position:r.body.collider(i).translation(),rotation:r.body.collider(i).rotation()}))};
  for(let tick=0;tick<360;tick++){
   r.state.input={throttle:tick<30?0:tick<160?.85:tick<220?0:tick<290?-.7:.6,steer:tick>=100&&tick<160?.16:tick>=290?-.13:0,brake:tick>=160&&tick<220?1:0,handbrake:tick>=140&&tick<150};
   api.stepVehiclePhysics(r.body,r.controller,kind,r.spec,r.state,dt,damage,shift,0,condition);r.world.step();
   for(const v of [r.body.translation(),r.body.rotation(),r.body.linvel(),r.body.angvel()])samples.push(...Object.values(v));
   samples.push(r.state.speed,r.state.slip,r.state.steering,r.state.gear,r.state.rpm);
   for(let i=0;i<4;i++)samples.push(r.controller.wheelRadius(i)!,r.controller.wheelSuspensionLength(i)!,r.controller.wheelEngineForce(i)!,r.controller.wheelBrake(i)!);
  }
  const values=Float64Array.from(samples);return{kind,tuned,damaged,bodyProperties,sha256:createHash('sha256').update(new Uint8Array(values.buffer)).digest('hex'),finite:samples.every(Number.isFinite),final:{p:{...r.body.translation()},q:{...r.body.rotation()},v:{...r.body.linvel()},state:r.state}};
 }finally{r.dispose();}
}
export type Trial='acceleration'|'coast'|'brake'|'turn';
/** Identical prescribed body state isolates controller configuration from the
 * later trajectory changes caused by the explicitly corrected radius. */
export function wheelParameters(api:PhysicsAPI,kind:CarKind,wheelDamage:readonly number[],tyreDamage?:readonly number[],speed=12){
 const r=rig(api,kind);r.body.setLinvel({x:0,y:0,z:speed},true);r.state.input={throttle:.7,steer:.1,brake:.2,handbrake:false};
 try{
  api.stepVehiclePhysics(r.body,r.controller,kind,r.spec,r.state,dt,wheelDamage,Array.from({length:4},()=>({x:0,y:0,z:0})),0,tyreDamage);
  return Array.from({length:4},(_,i)=>({radius:r.controller.wheelRadius(i),stiffness:r.controller.wheelSuspensionStiffness(i),rest:r.controller.wheelSuspensionRestLength(i),force:r.controller.wheelMaxSuspensionForce(i),grip:r.controller.wheelFrictionSlip(i),sideGrip:r.controller.wheelSideFrictionStiffness(i),steering:r.controller.wheelSteering(i),axle:r.controller.wheelAxleCs(i),engineForce:r.controller.wheelEngineForce(i),brake:r.controller.wheelBrake(i)}));
 }finally{r.dispose();}
}
export function trial(api:PhysicsAPI,kind:CarKind,corner:'intact'|'front-left'|'rear-left',scenario:Trial,condition?:unknown,originalWheelDamage?:readonly number[]){
 const r=rig(api,kind),damage=originalWheelDamage?[...originalWheelDamage]:[0,0,0,0],shift=Array.from({length:4},()=>({x:0,y:0,z:0}));if(!originalWheelDamage&&corner!=='intact')damage[corner==='front-left'?0:2]=1;
 const step=()=>{api.stepVehiclePhysics(r.body,r.controller,kind,r.spec,r.state,dt,damage,shift,0,condition);r.world.step();};
 try{
  for(let i=0;i<180;i++)step();
  const initialSpeed=scenario==='acceleration'?0:scenario==='turn'?12:15;
  r.body.setLinvel({x:0,y:0,z:initialSpeed},true);r.body.setAngvel({x:0,y:0,z:0},true);
  const start={...r.body.translation()},initialYaw=yaw(r.body.rotation());let previous={...start},previousYaw=initialYaw,path=0,heading=0,maximumYawRate=0,minUp=1,contacts=0,steps=0;
  const maxSteps=scenario==='acceleration'?360:scenario==='coast'?240:scenario==='brake'?600:120;
  r.state.input={throttle:scenario==='acceleration'?1:0,steer:scenario==='turn'?.18:0,brake:scenario==='brake'?1:0,handbrake:false};
  for(let tick=0;tick<maxSteps;tick++){
   step();steps++;const p=r.body.translation(),q=r.body.rotation(),angle=yaw(q);path+=Math.hypot(p.x-previous.x,p.z-previous.z);heading+=wrap(angle-previousYaw);previous={...p};previousYaw=angle;
   maximumYawRate=Math.max(maximumYawRate,Math.abs(r.body.angvel().y));minUp=Math.min(minUp,1-2*(q.x*q.x+q.z*q.z));
   for(let wheel=0;wheel<4;wheel++)if(r.controller.wheelIsInContact(wheel))contacts++;
   if(scenario==='brake'&&speed(r.body)<.5)break;
  }
  const p=r.body.translation();return{kind,corner,scenario,seconds:steps*dt,initialSpeed,finalSpeed:speed(r.body),forwardDistance:p.z-start.z,lateralOffset:p.x-start.x,pathDistance:path,headingRadians:heading,maximumYawRate,minUp,groundedWheelFraction:contacts/(steps*4),radii:Array.from({length:4},(_,i)=>r.controller.wheelRadius(i)),engineForces:Array.from({length:4},(_,i)=>r.controller.wheelEngineForce(i)),finite:Object.values(p).every(Number.isFinite)&&Object.values(r.body.linvel()).every(Number.isFinite)};
 }finally{r.dispose();}
}
/** Real controller contact probes: no synthetic contact force or impulse mocks. */
export function motionProbe(api:PhysicsAPI,kind:CarKind,condition:number[],initialSpeed:number,airborne:boolean){
 const r=rig(api,kind),damage=[0,0,0,0],shift=Array.from({length:4},()=>({x:0,y:0,z:0}));
 const step=()=>{api.stepVehiclePhysics(r.body,r.controller,kind,r.spec,r.state,dt,damage,shift,0,condition);r.world.step();};
 try{
  if(airborne)r.body.setTranslation({x:0,y:100,z:0},true);else for(let i=0;i<180;i++)step();
  r.body.setLinvel({x:0,y:0,z:initialSpeed},true);r.body.setAngvel({x:0,y:0,z:0},true);
  let contacts=0;
  for(let i=0;i<180;i++){step();for(let j=0;j<4;j++)if(r.controller.wheelIsInContact(j))contacts++;}
  return{velocity:{...r.body.linvel()},position:{...r.body.translation()},rotation:{...r.body.rotation()},contacts};
 }finally{r.dispose();}
}
