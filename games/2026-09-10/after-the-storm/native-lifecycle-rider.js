import {riderPose as modernRiderPose} from './rider-pose.js';
import {createAuthoredNativeRider,authoredNativeRiderTargets,authoredNativeRiderHistory,authoredNativeRiderAuxiliaryTargets} from './authored-native-rider.js';
import {stepNativeRiderAnchors} from './native-rider-anchors.js';
import {prepareNativeRiderWipeoutPose} from './native-rider-wipeout-pose.js';
import {prepareNativeRiderStumblePose} from './native-rider-stumble-pose.js';
import {createAuthoredNativeRecoveryPose} from './authored-native-recovery-pose.js';
import {createAuthoredNativeActionPoses} from './authored-native-action-poses.js';

// Source actor timing/effects with explicitly authored anatomy/action/remount art.
// Each current/pending pose is evaluated separately without stepping physics.
// Imported25-point blending is an authored adaptation of the source pose-block
// interpolation, not bit-exact source animation. One auxiliary solve follows
// completion effects; the adapter then runs B and the nineteen-point solve.
// Modern rest lengths/steering-circle radius and endpoint history are retained
// consistently. Fixed native procedural dimensions do not prove geometry parity.
const F=Math.fround,axes=['x','y','z'],copy=p=>({x:p.x,y:p.y,z:p.z});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
function local(p,hull){
 const d={x:p.x-hull.center.x,y:p.y-hull.center.y,z:p.z-hull.center.z};
 return {x:dot(d,hull.frame.right)/hull.scale,y:dot(d,hull.frame.up)/hull.scale,z:dot(d,hull.frame.forward)/hull.scale};
}
function blend(a,b,t,scale){
 return a.map((p,i)=>Object.fromEntries(axes.map(k=>[k,F(F(p[k]/scale)*F(1-t)+F(b[i][k]/scale)*t)*scale])));
}

export function createNativeLifecycleRider({initialHull,geometryProvider=modernRiderPose}={}){
 const base=createAuthoredNativeRider({initialHull,geometryProvider}),{articulatedRider:rider,anchorState,anchorRig,restTargets}=base;
 const scale=initialHull.scale,restTargetsLocal=restTargets.map(p=>local(p,initialHull));
 const actions=createAuthoredNativeActionPoses({scale,restTargetsLocal});
 let remount=null,expectedSolves=0,previousFrame=-1;
 let yawForward={x:initialHull.frame.forward.x,z:initialHull.frame.forward.z};
 const yawLength=Math.hypot(yawForward.x,yawForward.z);
 if(!yawLength)throw new RangeError('Initial lifecycle rig requires an explicit horizontal heading');
 yawForward={x:F(yawForward.x/yawLength),z:F(yawForward.z/yawLength)};
 function evaluate(actor,animationFrame,hull,context){
  if(actor===22){
   const x=context.controls.conditionedXNative??context.controls.workingXNative??0,turn=Math.max(-1,Math.min(1,-x/70));
   const p=geometryProvider('',context.time,turn,{speed:Math.hypot(...axes.map(k=>hull.velocity[k])),steering:turn*.3});
   const targets=authoredNativeRiderTargets(p,hull);
   return {targets,auxiliaryTargets:authoredNativeRiderAuxiliaryTargets(targets,p,hull,anchorRig),nextAnimationFrame:0};
  }
  const physical={positions:rider.points.map(p=>copy(p.position)),storedDeltas:rider.points.map(p=>copy(p.storedDelta)),
   center:hull.center,forward:hull.frame.forward,up:hull.frame.up,right:hull.frame.right,scale};
  if(actor===23)return prepareNativeRiderWipeoutPose(physical);
  if(actor===24)return prepareNativeRiderStumblePose({...physical,auxiliaryPivot:anchorState.points[2].position,
   auxiliaryPivotDelta:anchorState.points[2].storedDelta,yawForward,alternateStumble:context.recoveryState?.alternateStumble??0});
  if(actor===7){
   remount??=createAuthoredNativeRecoveryPose({scale,restTargetsLocal});
   const p=remount.evaluate({animationFrame,hull,entryPositions:physical.positions});
   return {...p,auxiliaryTargets:authoredNativeRiderAuxiliaryTargets(p.targets,{yaw:0},hull,anchorRig)};
  }
  if([8,9,10,17,25].includes(actor)){
   const supplied=context.actionPoseState,retained=context.recoveryState?.alternateStumble;
   if(actor===25&&supplied?.alternate16cc!==undefined&&retained!==undefined&&supplied.alternate16cc!==retained)
    throw new Error('Action pose alternate16cc must match the actual lifecycle owner');
   const p=actions.evaluate({actorState:actor,animationFrame,hull,idleChoice16c4:supplied?.idleChoice16c4,
    alternate16cc:supplied?.alternate16cc??retained});
   return {...p,auxiliaryTargets:authoredNativeRiderAuxiliaryTargets(p.targets,{yaw:0},hull,anchorRig)};
  }
  throw new RangeError(`Native lifecycle actor ${actor} needs its equivalent physical pose`);
 }
 const riderPose=(hull,context)=>{
  const request=context?.poseRequest,frame=context?.logicalFrame;
  if(!request||!Number.isInteger(frame)||frame<=previousFrame)throw new Error('Lifecycle poses require one ordered decision per logical frame');
  if(hull.scale!==scale||rider.logicalFrames!==expectedSolves)throw new Error('Complete the preceding physical rider solve before preparing another pose');
  const h=Math.hypot(hull.frame.forward.x,hull.frame.forward.z);
  if(h>0)yawForward={x:F(hull.frame.forward.x/h),z:F(hull.frame.forward.z/h)};
  if(request.actorState!==7&&request.pending?.actorState!==7)remount=null;
  const active=evaluate(request.actorState,request.animationFrame,hull,context);
  const pending=request.pending?evaluate(request.pending.actorState,request.pending.animationFrame,hull,context):null;
  const targets=pending?blend(active.targets,pending.targets,request.blendProgress,scale):active.targets.map(copy);
  const auxiliary=pending?blend(active.auxiliaryTargets,pending.auxiliaryTargets,request.blendProgress,scale):active.auxiliaryTargets.map(copy);
  const historyTargets=authoredNativeRiderHistory(rider.points.map(p=>p.position),restTargets);
  const auxiliaryHistory=anchorState.points.map(p=>copy(p.position));let resolved=false;
  previousFrame=frame;expectedSolves++;
  return {targets,historyTargets,
   animationOutcome:{nextAnimationFrame:active.nextAnimationFrame,...(pending?{pendingNextAnimationFrame:pending.nextAnimationFrame}:{})},
   resolveAnchors({mode}={}){
    if(resolved)throw new Error('Resolve native lifecycle auxiliary anchors once');
    if(!Number.isInteger(mode))throw new TypeError('Use the final lifecycle physical mode');
    // Source actor9 can exchange the two physical grip bindings post-pose.
    // The modern authored role map keeps anatomical handA/handB stable. Order
    // the authored auxiliary grip goals by the FINAL actual type2/3 bindings,
    // after completion effects, rather than crossing its two forearm chains.
    // This is a geometry adapter, not the original pose-block target order.
    const anchorTargets=auxiliary.map(copy);
    if(rider.points[6].type===3&&rider.points[14].type===2)
     [anchorTargets[3],anchorTargets[4]]=[anchorTargets[4],anchorTargets[3]];
    stepNativeRiderAnchors(anchorState,{targets:anchorTargets,historyTargets:auxiliaryHistory,up:hull.frame.up,mode});resolved=true;
    return {2:copy(anchorState.anchors[2]),3:copy(anchorState.anchors[3])};
   }};
 };
 return {...base,riderPose,provenance:Object.freeze({...base.provenance,
  lifecycle:'source decision/pose-completion timing and physical effect order',
  recoveryGeometry:'authored actor7; reconstructed procedural23/24; authored rest/circle/history compatibility policy',
  actionGeometry:actions.provenance,
  gripGeometry:'authored auxiliary grip order follows final actual type2/3 anatomical bindings',
  targetBlend:'authored imported-point interpolation; not original normalized pose-block interpolation'})};
}
