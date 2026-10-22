import {RUB} from '../damage-handling';
import {assistedWheelStep} from './assists';
import {axleTorques} from './differential';
import {createDriveCalibration} from './calibration';
import {starterRPM} from '../engine-stall';
import {enginePowerFactor} from '../engine-condition';
import {wheelResponse} from '../wheel-physics';
import {vehicleFlatTyreRadius,tyreFailure} from '../tyre-condition';
import {captureDriveState,restoreDriveState} from './state';
import {freshAutoGear,stepAutoGear,manualDriveGear} from './gearing';
import type R from '@dimforge/rapier3d-compat';
import {stepVehiclePhysics,rotateVehicleVector,type PhysicsState,type VehicleSpecification} from '../vehicle-physics';
import {isFrontDriveKind,isClassicKind,vehicleWheelRadius} from '../classic-vehicle-specs';
import type {CarKind} from '../rules';
import {stepDrive} from './drive';import {stepWheel} from './wheel';
type Vec={x:number;y:number;z:number};
export type DriveCondition={wheelDamage?:ArrayLike<number>;wheelShift?:readonly Vec[];engineDamage?:number;tyreDamage?:ArrayLike<number>;wheelLost?:ArrayLike<number>};
const dot=(a:Vec,b:Vec)=>a.x*b.x+a.y*b.y+a.z*b.z;
export function effectiveInverseMass(body:R.RigidBody,point:Vec,d:Vec){
 if(!body.isDynamic())return 0;
 const c=body.worldCom(),r={x:point.x-c.x,y:point.y-c.y,z:point.z-c.z},a={x:r.y*d.z-r.z*d.y,y:r.z*d.x-r.x*d.z,z:r.x*d.y-r.y*d.x},m=body.effectiveWorldInvInertia(),v=body.effectiveInvMass();
 return d.x*d.x*v.x+d.y*d.y*v.y+d.z*d.z*v.z+a.x*(m.m11*a.x+m.m12*a.y+m.m13*a.z)+a.y*(m.m21*a.x+m.m22*a.y+m.m23*a.z)+a.z*(m.m31*a.x+m.m32*a.y+m.m33*a.z);
}
/** Shared angular-wheel adapter: preserve existing suspension/steering, suppress the
 * old drive/brake impulses, and supply engine-coupled longitudinal contact. */
export function createVehicleDrive(body:R.RigidBody,controller:R.DynamicRayCastVehicleController,kind:CarKind){
 const calibrate=createDriveCalibration(kind),gearbox=freshAutoGear();
 const engine={omega:850*2*Math.PI/60},wheels=Array.from({length:4},()=>({omega:0,angle:0}));
 const weights=isFrontDriveKind(kind)?[.5,.5,0,0]:(kind==='coupe'||isClassicKind(kind)&&kind!=='trail')?[0,0,.5,.5]:[.25,.25,.25,.25];

 return{get engine(){return engine;},get wheels(){return wheels;},get gearbox(){return gearbox;},snapshot(){return captureDriveState({engine,wheels,gearbox});},restore(value:unknown){restoreDriveState({engine,wheels,gearbox},value);},reset(speed=0){if(!Number.isFinite(speed))throw new RangeError('Invalid reset speed');engine.omega=850*2*Math.PI/60;Object.assign(gearbox,freshAutoGear());for(const w of wheels){w.omega=speed/vehicleWheelRadius(kind);w.angle=0;}},step(spec:VehicleSpecification,state:PhysicsState,dt:number,ratio?:number,condition:DriveCondition={}){
  if(Math.abs(state.input.throttle)>.001)body.wakeUp();
  stepVehiclePhysics(body,controller,kind,spec,state,dt,condition.wheelDamage,condition.wheelShift,condition.engineDamage,condition.tyreDamage,true,condition.wheelLost);
  const calibration=calibrate(spec);
  const gear=ratio===undefined?(state.input.transmission?manualDriveGear(state,calibration.ratioScale):stepAutoGear(gearbox,state.speed,engine.omega*60/(2*Math.PI),vehicleWheelRadius(kind),state.input.throttle,dt,calibration.ratioScale,state.gearLimit??5)):{ratio,clutch:1,allowThrottle:true};
  if(state.input.transmission)Object.assign(gearbox,{gear:state.gear===0?-1:Math.max(1,state.gear),pending:null,delay:0,cooldown:.65});
  // Automatic opposite-direction input brakes to a stop before selecting gear.
  // Otherwise idle torque can keep the old gear creeping forever.
  const directionBrake=!state.input.transmission&&ratio===undefined&&!gear.allowThrottle?Math.abs(state.input.throttle):0;
  // Brake torque competes with drive at each wheel; braking must not cut combustion.
  const drive=stepDrive(engine,wheels,[1.5,1.5,1.5,1.5],weights,gear.ratio,state.health>0&&gear.allowThrottle?(state.input.transmission?Math.max(0,state.input.throttle):Math.abs(state.input.throttle)):0,gear.clutch*(state.clutchGrip??1),dt,{...calibration.engine,peakTorque:calibration.engine.peakTorque*enginePowerFactor(state.health,condition.engineDamage)*(state.misfireFactor??1)},state.health>0&&!(state.engineStall!>0));
  for(const axle of [0,2])if(weights[axle]>0){const pair=axleTorques(wheels.slice(axle,axle+2),drive.torques.slice(axle,axle+2),[1.5,1.5],spec.differential,dt);drive.torques[axle]=pair[0];drive.torques[axle+1]=pair[1];}
  const q=body.rotation(),forward=rotateVehicleVector({x:0,y:0,z:1},q),right=rotateVehicleVector({x:1,y:0,z:0},q),radius=vehicleWheelRadius(kind),slips:number[]=[],contactSlips:number[]=[];
  for(let i=0;i<4;i++){
   const point=controller.wheelContactPoint(i),normal=controller.wheelContactNormal(i),grounded=!!controller.wheelIsInContact(i)&&!!point&&!!normal,ground=controller.wheelGroundObject(i)?.parent();
   const steer=controller.wheelSteering(i)??0,d={x:forward.x*Math.cos(steer)+right.x*Math.sin(steer),y:forward.y*Math.cos(steer)+right.y*Math.sin(steer),z:forward.z*Math.cos(steer)+right.z*Math.sin(steer)};
   if(normal){const n=dot(d,normal);d.x-=n*normal.x;d.y-=n*normal.y;d.z-=n*normal.z;}const length=Math.hypot(d.x,d.y,d.z);if(length>1e-8){d.x/=length;d.y/=length;d.z/=length;}
   const v=point?body.velocityAtPoint(point):body.linvel(),g=point&&ground?ground.velocityAtPoint(point):{x:0,y:0,z:0};
   const corner=wheelResponse(condition.wheelDamage?.[i]??0,i%2?1:-1,state.speed,radius,condition.tyreDamage?.[i],vehicleFlatTyreRadius(kind),!!condition.wheelLost?.[i]);
   const load=Math.min(controller.wheelMaxSuspensionForce(i)??0,Math.max(0,controller.wheelSuspensionForce(i)??0));
   const rollingTorque=grounded?tyreFailure(condition.tyreDamage?.[i])*.08*load*corner.radius:0;
   const serviceBrake=Math.max(state.input.brake,directionBrake)*2000*(i<2?spec.frontBrake:spec.rearBrake)*(state.brakeBias?.[i]??1);
   const parameters={dt,radius:corner.radius,inertia:1.5,driveTorque:drive.torques[i]*corner.power*(state.driveBias?.[i]??1),brakeTorque:rollingTorque+serviceBrake+(state.input.handbrake&&i>1?2500:0)+((state.rubDrag?.[i]??0)+(state.brakeDrag?.[i]??0)+(state.hubDrag?.[i]??0))*RUB.torque,grounded:grounded&&length>1e-8,speed:dot({x:v.x-g.x,y:v.y-g.y,z:v.z-g.z},d),inverseMass:point?effectiveInverseMass(body,point,d)+(ground?effectiveInverseMass(ground,point,d):0):0,normalLoad:load,friction:(state.surface==='asphalt'?.95:state.surface==='gravel'?.7:.55)*corner.grip*spec.grip*(state.slickGrip?.[i]??1),lateralImpulse:controller.wheelSideImpulse(i)??0};
   const result=stepWheel(wheels[i],assistedWheelStep(wheels[i],parameters,state.input.assists?.traction??0,state.input.assists?.abs??0,serviceBrake,state.input.handbrake));
   slips.push(result.slip);
   const side=normal?{x:d.y*normal.z-d.z*normal.y,y:d.z*normal.x-d.x*normal.z,z:d.x*normal.y-d.y*normal.x}:{x:0,y:0,z:0};
   contactSlips.push(grounded?Math.hypot(result.slip,dot({x:v.x-g.x,y:v.y-g.y,z:v.z-g.z},side)):0);
   if(grounded&&point){const impulse={x:d.x*result.impulse,y:d.y*result.impulse,z:d.z*result.impulse};body.applyImpulseAtPoint(impulse,point,true);if(ground?.isDynamic())ground.applyImpulseAtPoint({x:-impulse.x,y:-impulse.y,z:-impulse.z},point,true);}
  }
  state.rpm=state.health>0&&!(state.engineStall!>0)?drive.rpm:starterRPM(state.health,state.engineStall,state.input.throttle);if(!state.input.transmission&&ratio===undefined)state.gear=gearbox.gear<0?0:gearbox.gear;
  return{rpm:drive.rpm,slips,contactSlips,ratio:gear.ratio,clutch:gear.clutch};
 }};
}
