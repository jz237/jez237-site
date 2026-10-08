import {limitTractionForce,type DrivingAssists} from './driving-assists';
import {stepTransmission,type TransmissionInput,type TransmissionState} from './transmission';
import {VehicleStructure} from './vehicle-structure';
import {advanceEngineRestart,starterRPM} from './engine-stall';
import {isClassicKind,classicWheelHalfTrack,vehicleWheelRadius} from './classic-vehicle-specs';
import type R from '@dimforge/rapier3d-compat';
import {DEFINITIONS,clamp,type CarKind} from './rules';
import {wheelResponse} from './wheel-physics';
import {tyreFailure,vehicleFlatTyreRadius} from './tyre-condition';
import {enginePowerFactor} from './engine-condition';
import {vehicleArmorLayout,vehicleArmorCollisionHulls} from './vehicle-armor-spec';
type Vec={x:number;y:number;z:number};
type Quat=Vec&{w:number};
export type VehicleSpecification=ReturnType<typeof vehicleSpecification>;
export type PhysicsState={health:number;engineStall?:number;damageLeft:number;damageRight:number;steering:number;speed:number;slip:number;surface:'asphalt'|'gravel';gear:number;rpm:number;transmission?:TransmissionState;input:{throttle:number;steer:number;brake:number;handbrake:boolean;assists?:DrivingAssists;transmission?:TransmissionInput}};
export function rotateVehicleVector(v:Vec,q:Quat):Vec{
 const tx=2*(q.y*v.z-q.z*v.y),ty=2*(q.z*v.x-q.x*v.z),tz=2*(q.x*v.y-q.y*v.x);
 return{x:v.x+q.w*tx+q.y*tz-q.z*ty,y:v.y+q.w*ty+q.z*tx-q.x*tz,z:v.z+q.w*tz+q.x*ty-q.y*tx};
}
const dot=(a:Vec,b:Vec)=>a.x*b.x+a.y*b.y+a.z*b.z;
/** Inverse mass seen by an impulse at this point, including rotation. */
function contactInverseMass(body:R.RigidBody,point:Vec,direction:Vec){
 if(!body.isDynamic())return 0;
 const center=body.worldCom(),rx=point.x-center.x,ry=point.y-center.y,rz=point.z-center.z;
 const x=ry*direction.z-rz*direction.y,y=rz*direction.x-rx*direction.z,z=rx*direction.y-ry*direction.x;
 const m=body.effectiveWorldInvInertia(),linear=body.effectiveInvMass();
 return direction.x*direction.x*linear.x+direction.y*direction.y*linear.y+direction.z*direction.z*linear.z+
  x*(m.m11*x+m.m12*y+m.m13*z)+y*(m.m21*x+m.m22*y+m.m23*z)+z*(m.m31*x+m.m32*y+m.m33*z);
}
function applyTyreRollingResistance(body:R.RigidBody,controller:R.DynamicRayCastVehicleController,index:number,failure:number,forward:Vec,right:Vec,dt:number){
 if(failure===0||!controller.wheelIsInContact(index))return;
 const point=controller.wheelContactPoint(index),normal=controller.wheelContactNormal(index);if(!point||!normal)return;
 const steer=controller.wheelSteering(index)??0,c=Math.cos(steer),s=Math.sin(steer),direction={x:forward.x*c+right.x*s,y:forward.y*c+right.y*s,z:forward.z*c+right.z*s};
 const normalPart=dot(direction,normal);direction.x-=normal.x*normalPart;direction.y-=normal.y*normalPart;direction.z-=normal.z*normalPart;
 const length=Math.hypot(direction.x,direction.y,direction.z);if(length<1e-8)return;direction.x/=length;direction.y/=length;direction.z/=length;
 const ground=controller.wheelGroundObject(index)?.parent(),velocity=body.velocityAtPoint(point),groundVelocity=ground?.velocityAtPoint(point)??{x:0,y:0,z:0};
 const speed=dot({x:velocity.x-groundVelocity.x,y:velocity.y-groundVelocity.y,z:velocity.z-groundVelocity.z},direction);
 const inverseMass=contactInverseMass(body,point,direction)+(ground?contactInverseMass(ground,point,direction):0);if(inverseMass<=0)return;
 const load=Math.min(controller.wheelMaxSuspensionForce(index)??0,Math.max(0,controller.wheelSuspensionForce(index)??0));
 const magnitude=-Math.sign(speed)*Math.min(failure*.45*load*dt,Math.abs(speed)/inverseMass);
 const impulse={x:direction.x*magnitude,y:direction.y*magnitude,z:direction.z*magnitude};
 body.applyImpulseAtPoint(impulse,point,true);
 if(ground?.isDynamic())ground.applyImpulseAtPoint({x:-impulse.x,y:-impulse.y,z:-impulse.z},point,true);
}
export const vehicleSuspensionRestLength=(kind:CarKind)=>kind==='buggy'?.44:.36;
export const vehicleSuspensionTravel=(kind:CarKind)=>kind==='buggy'?.32:.24;
/** Keep open cargo/cockpit floors shallow through damage and repair. */
export function vehicleChassisHalfExtents(kind:CarKind,health=100){
 const d=DEFINITIONS[kind],loss=100-health,utility=kind==='utility';
 if(kind==='buggy')return{x:.55-loss*.00035,y:.013,z:.725-loss*.00055};
 return{x:(utility?.70:d.halfWidth-.06)-loss*.0008,y:utility?.065:.25,z:(utility?2.69:d.halfLength-.12)-loss*.0015};
}
/** Shared physical construction for the rendered vehicle and headless authority. */
export function createVehiclePhysics(api:typeof R,world:R.World,kind:CarKind,mass:number,armor=0){
 const d=DEFINITIONS[kind],utility=kind==='utility',buggy=kind==='buggy',massHalfLength=utility?2.745:d.halfLength,massHeight=kind==='shuttle'?2.5:kind==='van'?1.9:1.3;
 const body=world.createRigidBody(api.RigidBodyDesc.dynamic().setLinearDamping(.06).setAngularDamping(.85).setCcdEnabled(true).setCanSleep(true));
 const collider=world.createCollider((utility?api.ColliderDesc.cuboid(.70,.065,2.69).setTranslation(0,-.25,-.22):buggy?api.ColliderDesc.cuboid(.55,.013,.725).setTranslation(0,-.54,-.115):api.ColliderDesc.cuboid(d.halfWidth-.06,.25,d.halfLength-.12))
  .setMassProperties(mass,utility?{x:0,y:.19,z:.34}:buggy?{x:0,y:.46,z:-.085}:{x:0,y:kind==='shuttle'?.30:kind==='van'?.15:-.06,z:kind==='tern'?.16:kind==='marten'?-.22:0},{x:mass*((massHalfLength*2)**2+massHeight**2)/12,y:mass*((massHalfLength*2)**2+(d.halfWidth*2)**2)/12,z:mass*((d.halfWidth*2)**2+massHeight**2)/12},{x:0,y:0,z:0,w:1})
  .setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
 const classic=isClassicKind(kind),estate=kind==='wagon';
 // A van's windscreen slopes into the taller cargo shell. Its collision
 // hull follows that profile rather than putting an upright box above the nose.
 const vanUpper=Float32Array.from([
  [-.875,.99,-2.19],[.875,.99,-2.19],[-.790,1.915,-2.19],[.790,1.915,-2.19],
  [-.790,1.915,.665],[.790,1.915,.665],[-.880,1.08,1.05],[.880,1.08,1.05],
  [-.880,.99,1.05],[.880,.99,1.05],
 ].flatMap(([x,y,z])=>[x,y-.8200195,z]));
 const ternUpper=Float32Array.from([[-.76,1.015,.62],[.76,1.015,.62],[-.632,1.478,.094],[.632,1.478,.094],[-.632,1.478,-1.02],[.632,1.478,-1.02],[-.734,1.015,-1.76],[.734,1.015,-1.76]].flatMap(([x,y,z])=>[x,y-.8200195,z]));
 const martenUpper=Float32Array.from([[-.740,1.023,.62],[.740,1.023,.62],[-.597,1.478,.11],[.597,1.478,.11],[-.597,1.478,-.78],[.597,1.478,-.78],[-.740,1.023,-1.30],[.740,1.023,-1.30]].flatMap(([x,y,z])=>[x,y-.8200195,z]));
 const shuttleUpper=Float32Array.from([[-1.03,1.12,-3],[1.03,1.12,-3],[-.865,2.50,-3],[.865,2.50,-3],[-.865,2.50,2.72],[.865,2.50,2.72],[-1.03,1.12,3],[1.03,1.12,3]].flatMap(([x,y,z])=>[x,y-.90,z]));
 const roofDesc=kind==='shuttle'?api.ColliderDesc.convexHull(shuttleUpper)!:buggy?api.ColliderDesc.capsule(.35,.026).setRotation({x:0,y:0,z:Math.SQRT1_2,w:Math.SQRT1_2}).setTranslation(0,.734,-.63):kind==='marten'?api.ColliderDesc.convexHull(martenUpper)!:kind==='tern'?api.ColliderDesc.convexHull(ternUpper)!:kind==='van'?api.ColliderDesc.convexHull(vanUpper)!:
  api.ColliderDesc.cuboid(kind==='compact'?.60:classic?.70:.65,classic?.22:.24,classic?(utility?.56:estate?1.195:kind==='compact'?.73:.72):.65)
   .setTranslation(0,classic?.43:kind==='coupe'?.12:.2,classic?(utility?-.16:estate?-.98:kind==='compact'?-.25:-.40):-.1);
 const roof=world.createCollider(roofDesc.setMass(0).setFriction(.5).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
 // Compound utility shell leaves the cargo opening empty above its floor.
 // All pieces share the chassis body, so suspension rays exclude them together.
 if(utility){
  const part=(x:number,y:number,z:number,hx:number,hy:number,hz:number)=>world.createCollider(api.ColliderDesc.cuboid(hx,hy,hz).setTranslation(x,y,z).setMass(0).setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
  part(0,-.03,.92,.854,.24,1.57);
  for(const side of [-1,1]){part(side*.785,0,-1.83,.09,.21,1.14);part(side*.60,-.10,-1.525,.145,.08,.38);}
  part(0,0,-2.92,.77,.21,.05);
 }
 // A buggy has tube collision along the authored cage, not a filled cabin.
 // Coordinates below are model-local, then moved to the shared chassis datum.
 if(buggy){
  const finish=(desc:R.ColliderDesc)=>world.createCollider(desc.setMass(0).setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
  const bar=(a:Vec,b:Vec,radius=.026)=>{
   const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,length=Math.hypot(dx,dy,dz),ny=dy/length;
   const scale=Math.sqrt(2*(1+ny)),rotation=scale<1e-8?{x:1,y:0,z:0,w:0}:{x:dz/length/scale,y:0,z:-dx/length/scale,w:scale/2};
   finish(api.ColliderDesc.capsule(length/2,radius).setRotation(rotation).setTranslation((a.x+b.x)/2,(a.y+b.y)/2-.96,(a.z+b.z)/2));
  };
  const v=(x:number,y:number,z:number)=>({x,y,z});
  for(const side of [-1,1]){
   bar(v(side*.59,.40,-1.48),v(side*.59,.40,1.37));
   bar(v(side*.64,.43,-.73),v(side*.64,.43,.52));
   bar(v(side*.64,.84,-.73),v(side*.64,.69,.52));
   bar(v(side*.64,.44,-.72),v(side*.63,1.42,-.65));
   bar(v(side*.63,1.42,-.65),v(side*.59,1.60,-.63));
   bar(v(side*.59,1.60,-.63),v(side*.35,1.694,-.63));
   bar(v(side*.63,.65,.52),v(side*.61,1.39,.23));
   bar(v(side*.61,1.39,.23),v(side*.57,1.52,.17));
   bar(v(side*.57,1.52,.17),v(side*.34,1.612,.17));
   bar(v(side*.57,1.52,.17),v(side*.58,1.62,-.19));
   bar(v(side*.58,1.62,-.19),v(side*.59,1.60,-.63));
   bar(v(side*.59,1.60,-.63),v(side*.48,.52,-1.54));
   bar(v(side*.59,.40,1.39),v(side*.55,.48,1.67),.030);
   bar(v(side*.55,.48,1.67),v(side*.30,.491,1.752),.030);
   bar(v(side*.48,.43,-1.55),v(side*.48,.56,-1.71),.029);
   bar(v(side*.48,.56,-1.71),v(0,.58,-1.76),.029);
  }
  bar(v(-.34,1.612,.17),v(.34,1.612,.17));
  bar(v(-.30,.491,1.752),v(.30,.491,1.752),.030);
  finish(api.ColliderDesc.cuboid(.51,.29,.33).setTranslation(0,.69-.96,-1.27));
  finish(api.ColliderDesc.cuboid(.57,.285,.018).setTranslation(0,.705-.96,-.86));
  const skin:number[]=[];
  for(const t of [0,.25,.5,.75,1]){const width=.61-.22*t+.050*Math.sin(t*Math.PI);
   for(const u of [-1,-.75,-.5,0,.5,.75,1])skin.push(u*width,.91-.345*t+.040*Math.sin(t*Math.PI)-.095*u**4-.008-.96,.53+.94*t+.055*(1-u*u)*t**5);
   for(const side of [-1,1])skin.push(side*(width-.025),.61-.18*t-.96,.53+.94*t);
  }
  const nose=Float32Array.from(skin);
  finish(api.ColliderDesc.convexHull(nose)!);
 }
 // Each fitted reinforcement assembly gets a shallow contact envelope from its
 // visible beam/pad surfaces. Separate regions keep the cockpit and bed open.
 // The chassis already carries armor mass; these envelopes must not add it again.
 if(armor>0){
  const layout=vehicleArmorLayout(kind,armor);
  for(const {points} of vehicleArmorCollisionHulls(layout)){
   const vertices=Float32Array.from(points.flatMap(p=>[p.x,p.y-layout.modelOffset,p.z]));
   world.createCollider(api.ColliderDesc.convexHull(vertices)!.setMass(0).setFriction(.45).setRestitution(.035).setActiveEvents(api.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
  }
 }
 const controller=world.createVehicleController(body);controller.indexUpAxis=1;controller.setIndexForwardAxis=2;
 for(const [x,z]of [[-1,1],[1,1],[-1,-1],[1,-1]]){const i=controller.numWheels();controller.addWheel({x:classic?x*classicWheelHalfTrack(kind):x*(d.halfWidth-.04),y:-.12,z:z*d.wheelbase/2},{x:0,y:-1,z:0},{x:-1,y:0,z:0},vehicleSuspensionRestLength(kind),vehicleWheelRadius(kind));
  controller.setWheelSuspensionStiffness(i,30);controller.setWheelSuspensionCompression(i,4.4);controller.setWheelSuspensionRelaxation(i,5.4);controller.setWheelMaxSuspensionTravel(i,vehicleSuspensionTravel(kind));controller.setWheelMaxSuspensionForce(i,13000);controller.setWheelFrictionSlip(i,2.1);controller.setWheelSideFrictionStiffness(i,1.1);
 }
 const structure=new VehicleStructure(api,body,collider,health=>vehicleChassisHalfExtents(kind,health));
 return {body,collider,roof,controller,structure};
}
const intact=new Float32Array(4),unshifted=[{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0},{x:0,y:0,z:0}];
/** No renderer, wall clock or networking state: both simulations execute this kernel. */
export function stepVehiclePhysics(body:R.RigidBody,controller:R.DynamicRayCastVehicleController,kind:CarKind,spec:VehicleSpecification,state:PhysicsState,dt:number,wheelDamage:ArrayLike<number>=intact,wheelShift:readonly Vec[]=unshifted,engineDamage?:number,tyreDamage?:ArrayLike<number>){
 const q=body.rotation(),velocity=body.linvel(),forward=rotateVehicleVector({x:0,y:0,z:1},q),right=rotateVehicleVector({x:1,y:0,z:0},q),up=rotateVehicleVector({x:0,y:1,z:0},q),def=DEFINITIONS[kind],alive=state.health>0;
 const running=advanceEngineRestart(state,dt);
 state.speed=dot(velocity,forward);state.slip=Math.abs(dot(velocity,right));
 const target=(alive?state.input.steer:0)*(.55*spec.steering/(1+Math.abs(state.speed)*.016))+(state.damageRight-state.damageLeft)*.0007;
 const alpha=1-Math.exp(-8*dt);state.steering=(1-alpha)*state.steering+alpha*target;
 const throttle=stepTransmission(state,spec,dt,running);
 const force=running?throttle*spec.force*enginePowerFactor(state.health,engineDamage)*clamp((spec.speedLimit-Math.abs(state.speed))/10,0,1):0;
 const front=axleDrive(spec.differential,!!controller.wheelIsInContact(0),!!controller.wheelIsInContact(1)),rear=axleDrive(spec.differential,!!controller.wheelIsInContact(2),!!controller.wheelIsInContact(3));
 for(let i=0;i<4;i++){
  const corner=wheelResponse(wheelDamage[i],i%2?1:-1,state.speed,vehicleWheelRadius(kind),tyreDamage?.[i],vehicleFlatTyreRadius(kind)),shift=wheelShift[i];
  controller.setWheelSteering(i,(i<2?state.steering:0)+corner.toe);
  controller.setWheelChassisConnectionPointCs(i,{x:(isClassicKind(kind)?(i%2?1:-1)*classicWheelHalfTrack(kind):(i%2?1:-1)*(def.halfWidth-.04))+shift.x,y:-.12,z:(i<2?1:-1)*def.wheelbase/2+shift.z});
  controller.setWheelSuspensionRestLength(i,(kind==='buggy'?corner.rest*(.44/.36):corner.rest)+spec.rideHeight);controller.setWheelSuspensionCompression(i,4.4*spec.damping*(spec.compression??1));controller.setWheelSuspensionRelaxation(i,5.4*spec.damping*(spec.rebound??1));
  controller.setWheelRadius(i,corner.radius);controller.setWheelMaxSuspensionForce(i,corner.force);controller.setWheelSideFrictionStiffness(i,corner.sideGrip);controller.setWheelAxleCs(i,{x:-Math.cos(corner.camber),y:Math.sin(corner.camber),z:0});
  // Rapier ignores wheelBrake when engine force is nonzero. Disengage only
  // the handbraked rear wheels so the brake works while front drive is retained.
  let wheelForce=state.input.handbrake&&i>1&&kind!=='tern'?0:force*corner.power*(kind==='tern'?(i<2?front[i%2]:0):(kind==='coupe'||isClassicKind(kind))?(i>1?rear[i%2]:0):.5*(i<2?front:rear)[i%2]);
  if(state.input.assists?.traction&&!state.input.handbrake)wheelForce=limitTractionForce(wheelForce,state.input.assists.traction,!!controller.wheelIsInContact(i),Math.min(corner.force,Math.max(0,controller.wheelSuspensionForce(i)??0)),state.slip,state.surface,corner.grip*spec.grip);
  controller.setWheelEngineForce(i,wheelForce);
  controller.setWheelBrake(i,!alive?18:state.input.brake*90*(i<2?spec.frontBrake:spec.rearBrake)+(state.input.handbrake&&i>1?100:0)+corner.drag);
  controller.setWheelFrictionSlip(i,(state.surface==='asphalt'?3.2:2.4)*(state.input.handbrake&&i>1?.6:1)*corner.grip*spec.grip);
  controller.setWheelSuspensionStiffness(i,corner.stiffness*spec.spring*(kind==='utility'&&i>1?1.16:1));
 }
 if(spec.differential>0&&running&&Math.abs(throttle)>.1&&Math.abs(state.speed)>2)body.applyTorqueImpulse({x:0,y:-body.angvel().y*spec.mass*.16*spec.differential*Math.abs(throttle)*dt,z:0},true);
 controller.updateVehicle(dt,undefined,undefined,c=>c.parent()?.handle!==body.handle);
 // Rapier ignores wheelBrake while engineForce is nonzero. Apply tyre rolling
 // loss to the actual contact on both driven and free wheels, capped at the
 // impulse that cancels their relative ground speed so it cannot propel a car.
 if(tyreDamage)for(let i=0;i<4;i++)applyTyreRollingResistance(body,controller,i,tyreFailure(tyreDamage[i]),forward,right,dt);
 if(up.y>.5){const av=body.angvel(),frontFailure=(tyreFailure(tyreDamage?.[0])+tyreFailure(tyreDamage?.[1]))/2,rearFailure=(tyreFailure(tyreDamage?.[2])+tyreFailure(tyreDamage?.[3]))/2;
  // A flat front tyre cannot receive the intact steering assist; rear failures
  // also leave more of the actual contact-induced yaw instead of cancelling it.
  const turnGrip=1-.7*frontFailure,yawAssist=1-.65*Math.max(frontFailure,rearFailure);
  body.applyTorqueImpulse({x:-av.x*spec.mass*.07*dt,y:(clamp(state.speed/def.wheelbase*Math.tan(state.steering)*.72*turnGrip,-1.7,1.7)-av.y)*spec.mass*2.6*dt*yawAssist*(state.input.assists?.stability??1),z:-av.z*spec.mass*.07*dt},true);}
 if(!state.input.transmission||!running)state.rpm=running?850+(Math.abs(state.speed)%spec.gearStep)/spec.gearStep*4600+Math.abs(state.input.throttle)*700:starterRPM(state.health,state.engineStall,state.input.throttle);
 return up.y;
}

export type PhysicsTuning={engine:number;tires:number;armor:number;tune:{gearing:number;suspension:number;steering:number;brakeBias:number;differential:number;compression?:number;rebound?:number;rideHeight?:number;brakePressure?:number}};
export function vehicleSpecification(kind: CarKind, input: PhysicsTuning = {engine:0,tires:0,armor:0,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}}) {
  const s = input, d = DEFINITIONS[kind];
  const ratio = 1 + s.tune.gearing * .22;
  return {mass: d.mass + s.armor * 95 + s.engine * 12,
    force: d.force * (1 + s.engine * .12) * ratio,
    speedLimit: ((kind==='shuttle'?31:kind==='wagon'?44:kind==='muscle'?50:kind==='utility'?46:kind==='compact'?38:kind==='van'?35:kind==='tern'?42:kind==='marten'?40:kind==='buggy'?44:53) + s.engine * 1.4) / ratio, gearStep: (kind==='shuttle'?5.9:kind==='wagon'?7.4:kind==='muscle'?8.2:kind==='utility'?7.8:kind==='compact'?6.5:kind==='van'?6.8:kind==='tern'?7:kind==='marten'?6.6:kind==='buggy'?7.1:9) / ratio,
    spring: (kind==='shuttle'?1.15:kind==='wagon'?.84:kind==='muscle'?.93:kind==='utility'?.96:kind==='compact'?.76:kind==='van'?.94:kind==='tern'?.83:kind==='marten'?.78:kind==='buggy'?.68:1)*(1 + s.tune.suspension * .35), damping: (kind==='shuttle'?1.20:kind==='wagon'?.92:kind==='van'?1.08:kind==='marten'?.96:kind==='buggy'?1.12:1)*(1 + s.tune.suspension * .18),
    ...(s.tune.compression?{compression:1+s.tune.compression*.5}:{}),
    ...(s.tune.rebound?{rebound:1+s.tune.rebound*.5}:{}),
    rideHeight: s.tune.rideHeight?-s.tune.suspension * .035+s.tune.rideHeight*.06:-s.tune.suspension * .035, grip: 1 + s.tires * .06,
    steering: 1 + s.tune.steering * .25,
    frontBrake: (1 + s.tune.brakeBias * .36)*(1+(s.tune.brakePressure??0)*.5), rearBrake: (1 - s.tune.brakeBias * .36)*(1+(s.tune.brakePressure??0)*.5),
    damageScale: 1 / (1 + s.armor * .18), differential: s.tune.differential };
}

/** Per-axle limited-slip approximation, with the stock midpoint retaining legacy drive. */
export function axleDrive(lock: number, leftContact: boolean, rightContact: boolean): [number, number] {
  if (leftContact === rightContact || lock === 0) return [.5, .5];
  if(lock < 0) { const torque = .5 * (1 + lock * .8); return [torque, torque]; }
  return leftContact ? [.5 + .4 * lock, .5 - .4 * lock] : [.5 - .4 * lock, .5 + .4 * lock];
}
