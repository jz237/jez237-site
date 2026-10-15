import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose,nativeRecoveryEffectValues} from './native-rider-recovery.js';
import {nativeRiderAnchorMode} from './native-rider-anchors.js';

// Own one rider's recovered decision -> pose-completion phases. Hull ticks and
// pose evaluation stay external. Effects touch the ACTUAL12 point damping and
// native-displacement velocities/19 stored deltas, never hull positions or a
// fabricated recovery joint. No timer, input polling or animation clock lives
// here. Each recipe is applied once in the source order at its phase boundary.
const H=.01,axes=['x','y','z'],known=new WeakSet();
const copy=p=>({x:p.x,y:p.y,z:p.z});
function vector(p,name){if(!p||!axes.every(k=>Number.isFinite(p[k])))throw new TypeError(`${name} requires finite XYZ`);return p;}
function owner(value){if(!known.has(value))throw new TypeError('Expected a native rider lifecycle');}
function datum(value,hull,context){
 const n=typeof value==='function'?value(hull,context):value;
 if(!Number.isInteger(n)||n< -32768||n>32767)throw new RangeError('Recovery needs the actual signed source course datum');return n;
}
function finished(value,hull,context){
 const n=typeof value==='function'?value(hull,context):value;
 if(typeof n!=='boolean')throw new TypeError('Recovery needs explicit raceFinished');return n;
}
function apply(lifecycle,effects){
 const {hull,rider}=lifecycle,s=hull.scale;
 for(const effect of effects){
  const values=nativeRecoveryEffectValues(effect,{
   hullVelocitiesNative:hull.points.map(p=>Object.fromEntries(axes.map(k=>[k,p.velocity[k]*H/s]))),
   riderDeltasNative:rider.points.map(p=>Object.fromEntries(axes.map(k=>[k,p.storedDelta[k]/s])))
  });
  if(values.hullDamping)values.hullDamping.forEach((d,i)=>{hull.points[i].damping=d;});
  if(values.hullVelocitiesNative){
   values.hullVelocitiesNative.forEach((v,i)=>{for(const k of axes)hull.points[i].velocity[k]=v[k]*s/H;});
   hull.velocity=Object.fromEntries(axes.map(k=>[k,hull.points.reduce((sum,p)=>sum+p.velocity[k],0)/12]));
  }
  if(values.riderDeltasNative)values.riderDeltasNative.forEach((v,i)=>{for(const k of axes)rider.points[i].storedDelta[k]=v[k]*s;});
  if(values.riderJointTypes)values.riderJointTypes.forEach((type,i)=>{rider.points[i].type=type;});
  if(values.riderPhysicalMode!==undefined)lifecycle.physicalMode=values.riderPhysicalMode;
 }
}

/** The twelve saved coefficients are captured from the initial actual hull.
 * Recovery owns actor/frame/crash/contactMode; the caller still supplies scene
 * simulation state. Restored lifecycle state must belong to this rider/scale.
 */
export function createNativeRiderLifecycle({hull,rider,courseDatumNative,raceFinished=false,state}={}){
 if(hull?.points?.length!==12||rider?.points?.length!==19||hull.scale!==rider.scale)throw new TypeError('Recovery needs matching physical hull and articulated rider');
 if(courseDatumNative===undefined)throw new TypeError('courseDatumNative is required');
 datum(courseDatumNative,hull,{});finished(raceFinished,hull,{});
 // The normal host coefficients and their saved restore values must be the
 // same native stores, rather than double originals plus rounded backups.
 for(const p of hull.points){if(!Number.isFinite(p.damping))throw new TypeError('Physical point damping must be finite');p.damping=Math.fround(p.damping);}
 const recovery=createNativeRiderRecovery(state??{riderIndex:hull.rider,hullDamping:hull.points.map(p=>p.damping)});
 if(recovery.phase!=='ready'||recovery.riderIndex!==hull.rider)throw new RangeError('Restore a matching ready rider lifecycle');
 const lifecycle={hull,rider,courseDatumNative,raceFinished,state:recovery,physicalMode:nativeRiderAnchorMode(recovery.actorState),lastEffects:[],lastDecision:null};
 known.add(lifecycle);return lifecycle;
}

export function nativeRiderLifecycleSource(lifecycle){
 owner(lifecycle);const s=lifecycle.state;
 if(s.phase!=='ready')throw new Error('Complete the preceding rider pose before preparing controls');
 return {actorState:s.actorState,animationFrame:s.animationFrame,crash:s.crashCountdown!==0,contactMode:s.contactMode};
}

/** Actual prior solved joint2 is sampled BEFORE this frame's target/solve. */
export function decideNativeRiderLifecycle(lifecycle,{completedFrame,simulationState,controls,manipulationAction}={}){
 owner(lifecycle);const {hull,rider}=lifecycle;
 vector(rider.jointWorld,'physical joint2');
 const context={completedFrame,controls},decision=decideNativeActorAfterHull(lifecycle.state,{
  simulationState,raceFinished:finished(lifecycle.raceFinished,hull,context),
  frameSpeedNative:completedFrame.frameSpeedNative,wetCount:completedFrame.wetCount,upY:hull.frame.up.y,
  physicalJoint2YNative:rider.jointWorld.y/hull.scale,courseDatumNative:datum(lifecycle.courseDatumNative,hull,context),
  impacts:completedFrame.impacts,manipulationAction,frameForwardNative:copy(hull.frame.forward),engineEnabled:!!controls.throttle
 });
 apply(lifecycle,decision.effects);lifecycle.state=decision.state;lifecycle.lastDecision=decision;
 lifecycle.lastEffects=decision.effects.map(q=>structuredClone(q));return decision;
}

/** Complete the explicitly evaluated pose before B/point projection/link solve. */
export function finishNativeRiderLifecycle(lifecycle,outcome,controls){
 owner(lifecycle);
 if(lifecycle.lastDecision?.skipped)return null;
 const result=finishNativeActorPose(lifecycle.state,{...outcome,pressedButtons:controls.pressedButtons,releasedButtons:controls.releasedButtons,
  heldButtons:controls.heldButtons});
 apply(lifecycle,result.effects);lifecycle.state=result.state;
 lifecycle.lastEffects.push(...result.effects.map(q=>structuredClone(q)));return result;
}

export function nativeRiderLifecycleSnapshot(lifecycle){
 owner(lifecycle);return {state:structuredClone(lifecycle.state),physicalMode:lifecycle.physicalMode,effects:lifecycle.lastEffects.map(q=>structuredClone(q))};
}
