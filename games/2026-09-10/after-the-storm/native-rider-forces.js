import {NATIVE_HULL_STEP} from './native-hull.js';

// Independent numeric reconstruction of rider trim and manipulation forces.
// This module never invents an articulated joint or advances an animation.
// All working/raw axes are signed native integer axes, not hardware inputs;
// controller conditioning, nonlinear input mapping and gesture timestamps are
// supplied by the caller. Rider indices have no implicit character-name map.
//
// Frame order for a future adapter:
//   1. Prepare once per five hull ticks, using the PREVIOUS action/joint and
//      previous frame wet counts, displacement and contact accumulators.
//   2. Decide the action, then apply returned working-axis mute flags.
//   3. Each 10ms hull tick: jet, trim, ordinary gravity/roll balance, auxiliary
//      yaw, manipulation, dry correction, water, contacts, hull constraints.
//   4. Update the articulated rider after the five hull ticks.
// The existing native-water module does not call these helpers. Appending all
// of them after its complete force pass would not reproduce the stated order.
//
// Positions/jointWorld are in the hull's SI/world units. Force magnitudes are
// native point-velocity increments. The existing scale/timing assumption is
// .025 metres/native unit and .01 seconds/hull tick, so an increment converts
// to SI velocity by hull.scale/.01. Invoke each force once per fixed hull tick;
// render dt belongs to stepNativeHull's accumulator, not these force helpers.
// Whole rider constraints, poses, score tracking, engine-angle integration,
// dive buoyancy, water-drag input muting and recovery states remain unported.

const PARAMETERS=Object.freeze([
  {trimGeometry:.7,trimPositive:.002,trimNegative:.001,roll:.72,flip:.55,auxiliaryYaw:.002},
  {trimGeometry:.7,trimPositive:.002,trimNegative:.001,roll:.75,flip:.55,auxiliaryYaw:.0027},
  {trimGeometry:.7,trimPositive:.002,trimNegative:.001,roll:.63,flip:.55,auxiliaryYaw:.0021},
  {trimGeometry:.8,trimPositive:.0018,trimNegative:.0008,roll:.63,flip:.53,auxiliaryYaw:.002}
].map(Object.freeze));
const TRIM_WEIGHTS=[3,0,3,-3,0,-3,-1,-1,0,1,1,0];
const AUXILIARY_WEIGHTS=[1,1,1,-1,-1,-1,0,0,0,0,0,0];
const ROLL_WEIGHTS=[1,-1,1,0,0,0,0,0,0,1,1,-1];
const ROLL_GRAVITY=[-.5,.5,-.5,0,.5,0,0,0,.5,-.5,-.5,.5];
const FLIP_WEIGHTS=[-1,-1,-1,1,1,1,0,0,0,0,0,0];
const FLIP_GRAVITY=[-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5];
// Derived from the observed 1.8 frame-speed display conversion, retaining its
// binary32 boundaries. Force formulas otherwise use independent JS arithmetic.
const frameSpeed=displaySpeed=>Math.fround(displaySpeed/Math.fround(1.8));
const TRIM_SPEED=frameSpeed(30),AUXILIARY_SPEED=frameSpeed(20);
const ACTION_SPEED=frameSpeed(60),CONTACT_PITCH=Math.fround(.8);
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;

function finite(value,name){
  if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);
  return value;
}
function bounded(value,name,min,max){
  finite(value,name);
  if(value<min||value>max)throw new RangeError(`${name} must be from ${min} to ${max}`);
  return value;
}
function integer(value,name,min,max){
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}
function vector(value,name){
  if(!value||![value.x,value.y,value.z].every(Number.isFinite))throw new TypeError(`${name} must have finite x, y and z`);
  return value;
}
function profileParameters(profile){
  const index=integer(profile?.riderIndex,'riderIndex',0,3);
  for(const name of ['trimGeometry','trimPositive','trimNegative','roll','flip','auxiliaryYaw'])finite(profile[name],name);
  return index;
}
function hullData(hull,riderIndex){
  if(!hull||hull.points?.length!==12||!Number.isFinite(hull.scale)||hull.scale<=0)throw new TypeError('Expected a twelve-point native hull with positive scale');
  if(riderIndex!==undefined&&hull.rider!==riderIndex)throw new RangeError('Rider profile must match hull rider');
  vector(hull.center,'hull center');
  for(const name of ['forward','up','right'])vector(hull.frame?.[name],`hull ${name}`);
  for(const point of hull.points)vector(point.velocity,'point velocity');
  return hull.scale/NATIVE_HULL_STEP;
}
function updateVelocity(hull){
  hull.velocity=vec();
  for(const point of hull.points){
    hull.velocity.x+=point.velocity.x/12;
    hull.velocity.y+=point.velocity.y/12;
    hull.velocity.z+=point.velocity.z/12;
  }
  return hull;
}

/** Untuned rider-force coefficients in explicit native rider-index order. */
export function createNativeRiderProfile({riderIndex=0}={}){
  integer(riderIndex,'riderIndex',0,3);
  return Object.freeze({riderIndex,...PARAMETERS[riderIndex]});
}

/**
 * Prepare trim and auxiliary yaw once per source logical frame. Speeds here
 * are native displacement across five hull ticks, not metres/second or a
 * single point's native velocity. Contact flags represent nonzero source
 * accumulators; this helper does not discover geometry or classify materials.
 * jointWorld must be the caller's previous-frame articulated joint position.
 * A frozen copy is retained for all five ticks; no physical joint is inferred.
 * previousAction is used only for the prepared straight-jet override. Action
 * decisions happen afterwards and do not retroactively change these forces.
 */
export function prepareNativeRiderFrame(profile,{
  jointWorld,stickXNative=0,stickYNative=0,horizontalFrameSpeedNative=0,
  frameSpeedNative=0,forwardY=0,wetCount=0,floorContact=false,boxContact=false,
  shoreContact=false,actorState=22,previousAction=0
}={}){
  const riderIndex=profileParameters(profile);
  integer(stickXNative,'stickXNative',-128,127);integer(stickYNative,'stickYNative',-128,127);
  bounded(horizontalFrameSpeedNative,'horizontalFrameSpeedNative',0,Infinity);
  bounded(frameSpeedNative,'frameSpeedNative',0,Infinity);bounded(forwardY,'forwardY',-1,1);
  integer(wetCount,'wetCount',0,12);integer(actorState,'actorState',-1,255);
  integer(previousAction,'previousAction',0,4);
  if(jointWorld!==undefined)vector(jointWorld,'jointWorld');
  let trimMagnitudeNative=0;
  if(floorContact||boxContact){
    if(forwardY>CONTACT_PITCH)trimMagnitudeNative=70*profile.trimPositive;
  }else if(wetCount!==12&&(actorState===22||actorState===25)){
    trimMagnitudeNative=Math.sqrt(Math.max(0,1-forwardY*forwardY))*stickYNative;
    if(trimMagnitudeNative<0)trimMagnitudeNative*=profile.trimNegative;
    else{
      trimMagnitudeNative*=profile.trimPositive*(wetCount>0?.5:1);
      trimMagnitudeNative*=1-stickXNative*stickXNative/(4*70*70);
    }
    if(horizontalFrameSpeedNative<TRIM_SPEED){
      trimMagnitudeNative*=Math.max(horizontalFrameSpeedNative/TRIM_SPEED,.7);
    }
  }
  if(trimMagnitudeNative!==0&&jointWorld===undefined)throw new TypeError('Nonzero trim requires a previous-frame jointWorld');
  const auxiliaryYawNative=((frameSpeedNative<AUXILIARY_SPEED&&(actorState===7||actorState===22))||shoreContact)?
    profile.auxiliaryYaw*stickXNative:0;
  return Object.freeze({riderIndex,jointWorld:jointWorld===undefined?null:Object.freeze(copy(jointWorld)),
    trimMagnitudeNative,auxiliaryYawNative,jetStraight:previousAction!==0});
}

/**
 * Pure held-action decision; call AFTER prepareNativeRiderFrame. rawX/YNative
 * are pre-action source axes, distinct from the working axes used for trim.
 * gestureTicks are unsigned frame stamps refreshed by the input layer while
 * each working axis is beyond +/-14. Missing stamps cannot trigger an entry.
 * noWetNoContactFrames is the source frame counter supplied by the caller;
 * it is not necessarily geometric airtime. diveWetFrames counts qualifying
 * frames cumulatively during action3, and is not reset by a less-wet frame.
 * Rotation/score fields and landing-result timers remain the caller's job.
 */
export function decideNativeRiderAction(profile,{
  action=0,actionMagnitudeNative=0,rawXNative=0,rawYNative=0,frameSpeedNative=0,
  wetCount=0,throttle=false,tick=0,gestureTicks={},override=0,
  floorContact=false,boxContact=false,noWetNoContactFrames=0,diveWetFrames=0,
  actorState=22
}={}){
  const riderIndex=profileParameters(profile),oldAction=integer(action,'action',0,4);
  finite(actionMagnitudeNative,'actionMagnitudeNative');
  integer(rawXNative,'rawXNative',-128,127);integer(rawYNative,'rawYNative',-128,127);
  bounded(frameSpeedNative,'frameSpeedNative',0,Infinity);integer(wetCount,'wetCount',0,12);
  integer(tick,'tick',0,0xffffffff);integer(override,'override',0,0xffff);
  integer(noWetNoContactFrames,'noWetNoContactFrames',-0x80000000,0x7fffffff);
  integer(diveWetFrames,'diveWetFrames',0,0x7ffffffe);integer(actorState,'actorState',-1,255);
  if(!gestureTicks||typeof gestureTicks!=='object')throw new TypeError('gestureTicks must be an object');
  for(const name of ['negativeX','positiveX','negativeY','positiveY']){
    if(gestureTicks[name]!==undefined)integer(gestureTicks[name],`gestureTicks.${name}`,0,0xffffffff);
  }
  const recent=name=>gestureTicks[name]!==undefined&&((tick-gestureTicks[name])>>>0)<3;
  let muteSteering=false,muteTrim=false,landingPending=false;
  if(actorState!==22&&actorState!==25){
    action=0;landingPending=oldAction!==0;
  }else if(oldAction===0){
    if(wetCount===0&&frameSpeedNative>ACTION_SPEED&&throttle){
      if(rawXNative<=-70){if(recent('positiveX')||override===3)action=2;}
      else if(rawXNative>=70){if(recent('negativeX')||override===4)action=1;}
      else if(rawYNative<=-70){if(recent('positiveY')||override===5)action=4;}
      else if(rawYNative>=70&&recent('negativeY')){action=3;diveWetFrames=0;}
      if(action===1||action===2||action===4){
        actionMagnitudeNative=action===4?profile.flip:profile.roll*(action===2?-1:1);
        override=0;
      }
    }
  }else if(oldAction===3){
    if(wetCount>=8&&++diveWetFrames>30)action=0;
    if(rawYNative<70)action=0;
  }else{
    const held=oldAction===1?rawXNative>=70:oldAction===2?rawXNative<=-70:rawYNative<=-70;
    if(!held||((floorContact||boxContact)&&noWetNoContactFrames>5)){
      action=0;landingPending=true;
    }else if(oldAction===4)muteTrim=true;
    else muteSteering=true;
  }
  return Object.freeze({riderIndex,action,actionMagnitudeNative,diveWetFrames,override,
    entered:oldAction===0&&action!==0,ended:oldAction!==0&&action===0,
    muteSteering,muteTrim,landingPending,suppressDryCorrection:action!==0,
    buoyancyKOverride:action===3?.003:null});
}

/** Apply prepared, balanced trim immediately after rear jet impulses. */
export function applyNativeTrimForces(hull,profile,prepared){
  const riderIndex=profileParameters(profile),toVelocity=hullData(hull,riderIndex);
  const magnitude=finite(prepared?.trimMagnitudeNative,'trimMagnitudeNative');
  if(prepared.riderIndex!==undefined&&prepared.riderIndex!==riderIndex)throw new RangeError('Prepared rider must match profile rider');
  if(magnitude===0)return hull;
  const joint=vector(prepared.jointWorld,'jointWorld'),f=hull.frame.forward,u=hull.frame.up;
  const a=vec(joint.x-hull.center.x,joint.y-hull.center.y,joint.z-hull.center.z),along=dot(a,f);
  const q=vec(a.x-f.x*along,a.y-f.y*along,a.z-f.z*along),length=Math.hypot(q.x,q.y,q.z);
  // The observed source has no local degenerate-joint guard. Rejecting a
  // caller's unusable joint is explicit and does not invent a body direction.
  if(length<1e-12)throw new RangeError('Trim joint must have a component perpendicular to hull forward');
  q.x/=length;q.y/=length;q.z/=length;
  const t2=Math.min(dot(u,q)**2,1);
  const gain=(1-profile.trimGeometry*Math.sqrt(1-t2*t2))*magnitude*toVelocity;
  for(let i=0;i<12;i++){
    const v=hull.points[i].velocity,w=TRIM_WEIGHTS[i]*gain;
    v.x+=w*q.x;v.y+=w*q.y;v.z+=w*q.z;
  }
  return updateVelocity(hull);
}

/** Apply prepared low-speed/shore yaw after ordinary gravity/roll balance. */
export function applyNativeAuxiliaryYawForces(hull,prepared){
  const toVelocity=hullData(hull,prepared?.riderIndex);
  const magnitude=finite(prepared?.auxiliaryYawNative,'auxiliaryYawNative'),r=hull.frame.right;
  if(magnitude===0)return hull;
  for(let i=0;i<12;i++){
    const v=hull.points[i].velocity,w=AUXILIARY_WEIGHTS[i]*magnitude*toVelocity;
    v.x+=w*r.x;v.y+=w*r.y;v.z+=w*r.z;
  }
  return updateVelocity(hull);
}

/**
 * Apply explicit manipulation after auxiliary yaw, before dry correction/water.
 * actionMagnitudeNative is the entry-latched value returned by the decision
 * helper. gravityNative is the frame's already selected ordinary gravity.
 * Actions1/2 include a net sideways increment; action4 redistributes gravity.
 * Action3 has no direct impulse here: its buoyancy override must be consumed
 * at the later water stage by a future adapter, not silently applied here.
 */
export function applyNativeManipulationForces(hull,{
  action=0,actionMagnitudeNative=0,gravityNative=0,riderIndex
}={}){
  const toVelocity=hullData(hull,riderIndex);
  integer(action,'action',0,4);finite(actionMagnitudeNative,'actionMagnitudeNative');finite(gravityNative,'gravityNative');
  if(action!==1&&action!==2&&action!==4)return hull;
  const weights=action===4?FLIP_WEIGHTS:ROLL_WEIGHTS;
  const gravity=action===4?FLIP_GRAVITY:ROLL_GRAVITY;
  const direction=action===4?hull.frame.up:hull.frame.right;
  for(let i=0;i<12;i++){
    const v=hull.points[i].velocity,w=weights[i]*actionMagnitudeNative*toVelocity;
    v.x+=w*direction.x;
    v.y+=w*direction.y+gravity[i]*gravityNative*toVelocity;
    v.z+=w*direction.z;
  }
  return updateVelocity(hull);
}
