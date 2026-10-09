import R from '@dimforge/rapier3d-compat';
import {normalizeSetup,type Setup} from './garage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,rotateVehicleVector,type PhysicsState} from './vehicle-physics';
import type {CarKind} from './rules';
export const CORNERING_RADIUS=40;
const dt=1/60,clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export type CorneringDirection=1|-1;
export type CorneringTrial={completed:boolean;speed:number;target:number;direction:CorneringDirection;radians:number;maxError:number;seconds:number};
/** The same bounded pedal/steering policy is used for every car and setup.
 * It drives a real chassis around a circle; it never moves the body. */
export function corneringInput(body:Pick<R.RigidBody,'translation'|'rotation'>,speed:number,target:number,direction:CorneringDirection){
 const p=body.translation(),q=body.rotation(),a=Math.atan2(p.z,p.x),look=a+direction*Math.max(5,Math.abs(speed)*.65)/CORNERING_RADIUS;
 const forward=rotateVehicleVector({x:0,y:0,z:1},q),right=rotateVehicleVector({x:1,y:0,z:0},q);
 const dx=CORNERING_RADIUS*Math.cos(look)-p.x,dz=CORNERING_RADIUS*Math.sin(look)-p.z;
 const angle=Math.atan2(dx*right.x+dz*right.z,dx*forward.x+dz*forward.z);
 return{steer:clamp(angle*1.7,-1,1),throttle:clamp((target-speed)*.5,0,1),brake:clamp((speed-target)*.5,0,1),handbrake:false};
}
/** A full measured circle after reaching the requested pace. Sustained lane
 * departures, loss of support or a roll invalidate the attempt. Runs begin
 * from rest, with the same default assists and automatic gears as straight tests. */
export function* simulateCorneringTrial(kind:CarKind,input:Setup,surface:'asphalt'|'gravel',target:number,direction:CorneringDirection):Generator<void,CorneringTrial>{
 if(!Number.isFinite(target)||target<8||target>40||![-1,1].includes(direction))throw new Error('Invalid cornering test');
 const setup=normalizeSetup(input,kind),spec=vehicleSpecification(kind,setup),world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;
 try{
  world.createCollider(R.ColliderDesc.cuboid(120,.5,120).setTranslation(0,-.5,0));
  const {body,controller}=createVehiclePhysics(R,world,kind,spec.mass,setup.armor);
  body.setTranslation({x:CORNERING_RADIUS,y:1.2,z:0},true);body.setRotation({x:0,y:direction===1?0:1,z:0,w:direction===1?1:0},true);
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface,gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  let measuring=false,lastAngle=0,radians=0,frames=0,speedSum=0,maxError=0,invalidFrames=0;
  for(let i=0;i<90*60;i++){
   const p=body.translation(),v=body.linvel(),q=body.rotation(),angle=Math.atan2(p.z,p.x),error=Math.abs(Math.hypot(p.x,p.z)-CORNERING_RADIUS);
   const upright=rotateVehicleVector({x:0,y:1,z:0},q).y;
   const supported=[0,1,2,3].filter(w=>controller.wheelIsInContact(w)).length>=3;
   if(measuring){radians+=direction*Math.atan2(Math.sin(angle-lastAngle),Math.cos(angle-lastAngle));frames++;speedSum+=Math.hypot(v.x,v.z);maxError=Math.max(maxError,error);}
   const invalid=error>4||upright<.65||!supported||measuring&&state.speed<target*.9;
   invalidFrames=i>180&&invalid?invalidFrames+1:0;
   if(invalidFrames>20)break;
   if(!measuring&&i>600&&state.speed>=target*.97&&error<4&&supported&&upright>=.65)measuring=true;
   lastAngle=angle;
   if(radians>=Math.PI*2)return{completed:maxError<=4&&upright>=.65&&supported&&speedSum/frames>=target*.9,speed:speedSum/frames*3.6,target,direction,radians,maxError,seconds:frames*dt};
   state.input=i<180?{throttle:0,brake:0,steer:0,handbrake:false}:corneringInput(body,state.speed,target,direction);
   stepVehiclePhysics(body,controller,kind,spec,state,dt);world.step();
   if(i%60===59)yield;
  }
  return{completed:false,speed:frames?speedSum/frames*3.6:0,target,direction,radians,maxError,seconds:frames*dt};
 }finally{world.free();}
}
/** Five refinements give a roughly 1 m/s search interval. Report the lower
 * achieved speed from the two directions, never an uncompleted trial. */
export function* simulateCornering(kind:CarKind,setup:Setup,surface:'asphalt'|'gravel'):Generator<void,number|null>{
 const directions:number[]=[];
 for(const direction of [1,-1]as const){
  let low=8,high=40,best=yield* simulateCorneringTrial(kind,setup,surface,low,direction);
  if(!best.completed)return null;
  for(let i=0;i<5;i++){
   const target=(low+high)/2,trial=yield* simulateCorneringTrial(kind,setup,surface,target,direction);
   if(trial.completed){low=target;best=trial;}else high=target;
  }
  directions.push(best.speed);
 }
 return Math.min(...directions);
}
