import {isClassicKind,classicWheelHalfTrack,vehicleWheelRadius} from './classic-vehicle-specs';
import type R from '@dimforge/rapier3d-compat';
import {DEFINITIONS,clamp,type CarKind} from './rules';
import {wheelResponse} from './wheel-physics';
type Vec={x:number;y:number;z:number};
type Quat=Vec&{w:number};
export type VehicleSpecification=ReturnType<typeof vehicleSpecification>;
export type PhysicsState={health:number;damageLeft:number;damageRight:number;steering:number;speed:number;slip:number;surface:'asphalt'|'gravel';gear:number;rpm:number;input:{throttle:number;steer:number;brake:number;handbrake:boolean}};
export function rotateVehicleVector(v:Vec,q:Quat):Vec{
 const tx=2*(q.y*v.z-q.z*v.y),ty=2*(q.z*v.x-q.x*v.z),tz=2*(q.x*v.y-q.y*v.x);
 return{x:v.x+q.w*tx+q.y*tz-q.z*ty,y:v.y+q.w*ty+q.z*tx-q.x*tz,z:v.z+q.w*tz+q.x*ty-q.y*tx};
}
const dot=(a:Vec,b:Vec)=>a.x*b.x+a.y*b.y+a.z*b.z;
/** Keep the utility floor shallow through damage and repair. */
export function vehicleChassisHalfExtents(kind:CarKind,health=100){
 const d=DEFINITIONS[kind],loss=100-health,utility=kind==='utility';
 return{x:(utility?.70:d.halfWidth-.06)-loss*.0008,y:utility?.065:.25,z:(utility?2.69:d.halfLength-.12)-loss*.0015};
}
/** Shared physical construction for the rendered vehicle and headless authority. */
export function createVehiclePhysics(api:typeof R,world:R.World,kind:CarKind,mass:number){
 const d=DEFINITIONS[kind],utility=kind==='utility',massHalfLength=utility?2.745:d.halfLength,massHeight=kind==='van'?1.9:1.3;
 const body=world.createRigidBody(api.RigidBodyDesc.dynamic().setLinearDamping(.06).setAngularDamping(.85).setCcdEnabled(true).setCanSleep(true));
 const collider=world.createCollider((utility?api.ColliderDesc.cuboid(.70,.065,2.69).setTranslation(0,-.25,-.22):api.ColliderDesc.cuboid(d.halfWidth-.06,.25,d.halfLength-.12))
  .setMassProperties(mass,utility?{x:0,y:.19,z:.34}:{x:0,y:kind==='van'?.15:-.06,z:0},{x:mass*((massHalfLength*2)**2+massHeight**2)/12,y:mass*((massHalfLength*2)**2+(d.halfWidth*2)**2)/12,z:mass*((d.halfWidth*2)**2+massHeight**2)/12},{x:0,y:0,z:0,w:1})
  .setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000),body);
 const classic=isClassicKind(kind),estate=kind==='wagon';
 // A van's windscreen slopes into the taller cargo shell. Its collision
 // hull follows that profile rather than putting an upright box above the nose.
 const vanUpper=Float32Array.from([
  [-.875,.99,-2.19],[.875,.99,-2.19],[-.790,1.915,-2.19],[.790,1.915,-2.19],
  [-.790,1.915,.665],[.790,1.915,.665],[-.880,1.08,1.05],[.880,1.08,1.05],
  [-.880,.99,1.05],[.880,.99,1.05],
 ].flatMap(([x,y,z])=>[x,y-.8200195,z]));
 const roofDesc=kind==='van'?api.ColliderDesc.convexHull(vanUpper)!:
  api.ColliderDesc.cuboid(kind==='compact'?.60:classic?.70:.65,classic?.22:.24,classic?(utility?.56:estate?1.195:kind==='compact'?.73:.72):.65)
   .setTranslation(0,classic?.43:kind==='coupe'?.12:.2,classic?(utility?-.16:estate?-.98:kind==='compact'?-.25:-.40):-.1);
 const roof=world.createCollider(roofDesc.setMass(0).setFriction(.5).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000),body);
 // Compound utility shell leaves the cargo opening empty above its floor.
 // All pieces share the chassis body, so suspension rays exclude them together.
 if(utility){
  const part=(x:number,y:number,z:number,hx:number,hy:number,hz:number)=>world.createCollider(api.ColliderDesc.cuboid(hx,hy,hz).setTranslation(x,y,z).setMass(0).setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000),body);
  part(0,-.03,.92,.854,.24,1.57);
  for(const side of [-1,1]){part(side*.785,0,-1.83,.09,.21,1.14);part(side*.60,-.10,-1.525,.145,.08,.38);}
  part(0,0,-2.92,.77,.21,.05);
 }
 const controller=world.createVehicleController(body);controller.indexUpAxis=1;controller.setIndexForwardAxis=2;
 for(const [x,z]of [[-1,1],[1,1],[-1,-1],[1,-1]]){const i=controller.numWheels();controller.addWheel({x:classic?x*classicWheelHalfTrack(kind):x*(d.halfWidth-.04),y:-.12,z:z*d.wheelbase/2},{x:0,y:-1,z:0},{x:-1,y:0,z:0},.36,vehicleWheelRadius(kind));
  controller.setWheelSuspensionStiffness(i,30);controller.setWheelSuspensionCompression(i,4.4);controller.setWheelSuspensionRelaxation(i,5.4);controller.setWheelMaxSuspensionTravel(i,.24);controller.setWheelMaxSuspensionForce(i,13000);controller.setWheelFrictionSlip(i,2.1);controller.setWheelSideFrictionStiffness(i,1.1);
 }
 return {body,collider,roof,controller};
}
const intact=new Float32Array(4),unshifted=[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}];
/** No renderer, wall clock or networking state: both simulations execute this kernel. */
export function stepVehiclePhysics(body:R.RigidBody,controller:R.DynamicRayCastVehicleController,kind:CarKind,spec:VehicleSpecification,state:PhysicsState,dt:number,wheelDamage:ArrayLike<number>=intact,wheelShift:readonly Vec[]=unshifted){
 const q=body.rotation(),velocity=body.linvel(),forward=rotateVehicleVector({x:0,y:0,z:1},q),right=rotateVehicleVector({x:1,y:0,z:0},q),up=rotateVehicleVector({x:0,y:1,z:0},q),def=DEFINITIONS[kind],alive=state.health>0;
 state.speed=dot(velocity,forward);state.slip=Math.abs(dot(velocity,right));
 const target=(alive?state.input.steer:0)*(.55*spec.steering/(1+Math.abs(state.speed)*.016))+(state.damageRight-state.damageLeft)*.0007;
 const alpha=1-Math.exp(-8*dt);state.steering=(1-alpha)*state.steering+alpha*target;
 const force=alive?state.input.throttle*spec.force*(.45+.55*state.health/100)*clamp((spec.speedLimit-Math.abs(state.speed))/10,0,1):0;
 const front=axleDrive(spec.differential,!!controller.wheelIsInContact(0),!!controller.wheelIsInContact(1)),rear=axleDrive(spec.differential,!!controller.wheelIsInContact(2),!!controller.wheelIsInContact(3));
 for(let i=0;i<4;i++){
  const corner=wheelResponse(wheelDamage[i],i%2?1:-1,state.speed,vehicleWheelRadius(kind)),shift=wheelShift[i];
  controller.setWheelSteering(i,(i<2?state.steering:0)+corner.toe);
  controller.setWheelChassisConnectionPointCs(i,{x:(isClassicKind(kind)?(i%2?1:-1)*classicWheelHalfTrack(kind):(i%2?1:-1)*(def.halfWidth-.04))+shift.x,y:-.12,z:(i<2?1:-1)*def.wheelbase/2+shift.z});
  controller.setWheelSuspensionRestLength(i,corner.rest+spec.rideHeight);controller.setWheelSuspensionCompression(i,4.4*spec.damping);controller.setWheelSuspensionRelaxation(i,5.4*spec.damping);
  controller.setWheelRadius(i,corner.radius);controller.setWheelMaxSuspensionForce(i,corner.force);controller.setWheelSideFrictionStiffness(i,corner.sideGrip);controller.setWheelAxleCs(i,{x:-Math.cos(corner.camber),y:Math.sin(corner.camber),z:0});
  controller.setWheelEngineForce(i,force*corner.power*((kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]));
  controller.setWheelBrake(i,!alive?18:state.input.brake*90*(i<2?spec.frontBrake:spec.rearBrake)+(state.input.handbrake&&i>1?100:0)+corner.drag);
  controller.setWheelFrictionSlip(i,(state.surface==='asphalt'?3.2:2.4)*(state.input.handbrake&&i>1?.6:1)*corner.grip*spec.grip);
  controller.setWheelSuspensionStiffness(i,corner.stiffness*spec.spring*(kind==='utility'&&i>1?1.16:1));
 }
 if(spec.differential>0&&alive&&Math.abs(state.input.throttle)>.1&&Math.abs(state.speed)>2)body.applyTorqueImpulse({x:0,y:-body.angvel().y*spec.mass*.16*spec.differential*Math.abs(state.input.throttle)*dt,z:0},true);
 controller.updateVehicle(dt,undefined,undefined,c=>c.parent()?.handle!==body.handle);
 if(up.y>.5){const av=body.angvel();body.applyTorqueImpulse({x:-av.x*spec.mass*.07*dt,y:(clamp(state.speed/def.wheelbase*Math.tan(state.steering)*.72,-1.7,1.7)-av.y)*spec.mass*2.6*dt,z:-av.z*spec.mass*.07*dt},true);}
 state.gear=state.speed<-.5?0:clamp(1+Math.floor(Math.max(0,state.speed)/spec.gearStep),1,5);
 state.rpm=alive?850+(Math.abs(state.speed)%spec.gearStep)/spec.gearStep*4600+Math.abs(state.input.throttle)*700:0;
 return up.y;
}

export type PhysicsTuning={engine:number;tires:number;armor:number;tune:{gearing:number;suspension:number;steering:number;brakeBias:number;differential:number}};
export function vehicleSpecification(kind: CarKind, input: PhysicsTuning = {engine:0,tires:0,armor:0,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}}) {
  const s = input, d = DEFINITIONS[kind];
  const ratio = 1 + s.tune.gearing * .22;
  return {mass: d.mass + s.armor * 95 + s.engine * 12,
    force: d.force * (1 + s.engine * .12) * ratio,
    speedLimit: ((kind==='wagon'?44:kind==='muscle'?50:kind==='utility'?46:kind==='compact'?38:kind==='van'?35:53) + s.engine * 1.4) / ratio, gearStep: (kind==='wagon'?7.4:kind==='muscle'?8.2:kind==='utility'?7.8:kind==='compact'?6.5:kind==='van'?6.8:9) / ratio,
    spring: (kind==='wagon'?.84:kind==='muscle'?.93:kind==='utility'?.96:kind==='compact'?.76:kind==='van'?.94:1)*(1 + s.tune.suspension * .35), damping: (kind==='wagon'?.92:kind==='van'?1.08:1)*(1 + s.tune.suspension * .18),
    rideHeight: -s.tune.suspension * .035, grip: 1 + s.tires * .06,
    steering: 1 + s.tune.steering * .25,
    frontBrake: 1 + s.tune.brakeBias * .36, rearBrake: 1 - s.tune.brakeBias * .36,
    damageScale: 1 / (1 + s.armor * .18), differential: s.tune.differential };
}

/** Per-axle limited-slip approximation, with the stock midpoint retaining legacy drive. */
export function axleDrive(lock: number, leftContact: boolean, rightContact: boolean): [number, number] {
  if (leftContact === rightContact || lock === 0) return [.5, .5];
  if(lock < 0) { const torque = .5 * (1 + lock * .8); return [torque, torque]; }
  return leftContact ? [.5 + .4 * lock, .5 - .4 * lock] : [.5 - .4 * lock, .5 + .4 * lock];
}
