import {riderPose as modernRiderPose} from './rider-pose.js';
import {createAuthoredNativeRider,authoredNativeRiderTargets,authoredNativeRiderHistory,authoredNativeRiderAuxiliaryTargets} from './authored-native-rider.js';
import {stepNativeRiderAnchors} from './native-rider-anchors.js';
import {prepareNativeRiderWipeoutPose} from './native-rider-wipeout-pose.js';
import {prepareNativeRiderStumblePose} from './native-rider-stumble-pose.js';
import {createAuthoredNativeRecoveryPose} from './authored-native-recovery-pose.js';
import {createAuthoredNativeActionPoses} from './authored-native-action-poses.js';
import {createNativeRiderStartPoseProvider,prepareNativeRiderStartSeed,createNativeRiderResultPoseProvider} from './native-rider-start-provider.js';
import {createAuthoredNativeStartRecords} from './authored-native-start-records.js';
import {createAuthoredNativeResultRecords} from './authored-native-result-records.js';
import {createNativeRiderRecovery} from './native-rider-recovery.js';

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

/** startPoseProvider may override the authored detailed-rider records and
 * explicit modern dimensions. The default reads the physical hull's actual
 * retained yawFrame; a source-prepared hull is required for starting poses.
 * initializeStart
 * seeds its actual25 positions/types at construction, without consuming a
 * logical frame or fitting rest mechanics from the launch pose. The returned
 * initialRiderRecovery must be supplied to the adapter along with its own
 * courseDatumNative/raceFinished inputs. The default host still starts22. */
export function createNativeLifecycleRider({initialHull,geometryProvider=modernRiderPose,anchorRig:providedAnchorRig,
 startPoseProvider,resultPoseProvider,initializeStart=false}={}){
 if(typeof initializeStart!=='boolean')throw new TypeError('initializeStart must be boolean');
 if(startPoseProvider!==undefined&&typeof startPoseProvider?.evaluate!=='function')throw new TypeError('startPoseProvider must be an explicit selected-record provider');
 if(resultPoseProvider!==undefined&&typeof resultPoseProvider?.evaluate!=='function')throw new TypeError('resultPoseProvider must be an explicit selected-record provider');
 const base=createAuthoredNativeRider({initialHull,geometryProvider,anchorRig:providedAnchorRig}),{articulatedRider:rider,anchorState,anchorRig,restTargets}=base;
 const scale=initialHull.scale,restTargetsLocal=restTargets.map(p=>local(p,initialHull));
 const actions=createAuthoredNativeActionPoses({scale,restTargetsLocal});
 const resultArtwork=resultPoseProvider?null:createAuthoredNativeResultRecords({scale,restTargetsLocal,anchorRig});
 const results=resultPoseProvider??createNativeRiderResultPoseProvider({scale,...resultArtwork,readYawFrame:hull=>hull.yawFrame});
 let remount=null,expectedSolves=0,previousFrame=-1;
 let yawForward={x:initialHull.frame.forward.x,z:initialHull.frame.forward.z};
 const yawLength=Math.hypot(yawForward.x,yawForward.z);
 if(yawLength)yawForward={x:F(yawForward.x/yawLength),z:F(yawForward.z/yawLength)};
 else{
  const x=initialHull.yawFrame?.field1434,z=initialHull.yawFrame?.field1438;
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x,z)===0)throw new RangeError('Initial lifecycle rig requires an explicit horizontal heading');
  yawForward={x:F(x),z:F(z)};
 }
 let activeStart=startPoseProvider,authoredStart;
 function startProvider(){
  if(!activeStart){
   authoredStart=createAuthoredNativeStartRecords({scale,restTargetsLocal,anchorRig});
   activeStart=createNativeRiderStartPoseProvider({scale,...authoredStart,readYawFrame:hull=>hull.yawFrame});
  }
  return activeStart;
 }
 // Prepare every selected goal before installing anything into physical state.
 const seed=initializeStart?prepareNativeRiderStartSeed(startProvider(),{hull:initialHull}):null;
 let initialRiderRecovery;
 if(seed){
  rider.points=seed.positions.map((position,i)=>({position:copy(position),storedDelta:{x:0,y:0,z:0},type:seed.types[i]}));
  rider.jointWorld=copy(rider.points[2].position);
  anchorState.points=seed.auxiliaryPositions.map(position=>({position:copy(position),storedDelta:{x:0,y:0,z:0}}));
  anchorState.anchors={2:copy(anchorState.points[3].position),3:copy(anchorState.points[4].position)};
  anchorState.mode=seed.physicalMode;
  initialRiderRecovery=Object.freeze({state:createNativeRiderRecovery({riderIndex:initialHull.rider,
   //62F44->631F0 initializes actual1446 to10;16C8 starts-1. The countdown
   // is consumed only after a result is selected and an eligible actor runs.
   hullDamping:initialHull.points.map(p=>p.damping),actorState:seed.actorState,animationFrame:seed.animationFrame,
   selectedActor:-1,selectionCountdown:10}),physicalMode:seed.physicalMode});
 }
 function evaluate(actor,animationFrame,hull,context){
  if(actor>=1&&actor<=6)return results.evaluate({actorState:actor,animationFrame,hull,context});
  if(actor===15){
   return startProvider().evaluate({animationFrame,hull,context});
  }
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
 return {...base,riderPose,...(initialRiderRecovery?{initialRiderRecovery}:{}),provenance:Object.freeze({...base.provenance,
  lifecycle:'source decision/pose-completion timing and physical effect order',
  recoveryGeometry:'authored actor7; reconstructed procedural23/24; authored rest/circle/history compatibility policy',
  actionGeometry:actions.provenance,
  resultGeometry:results.provenance,resultArtwork:resultArtwork?.provenance??'explicit caller-supplied result records',
  startGeometry:activeStart?.provenance??'authored detailed-rider selected records and explicit modern anatomy, prepared when requested',
  ...(authoredStart?{startArtwork:authoredStart.provenance}:{}),
  startInitialization:seed?'actor15/frame56 physical25-point/type seed; independent authored rest/circle; not full retained-body startup':'ordinary actor22 host initialization',
  gripGeometry:'authored auxiliary grip order follows final actual type2/3 anatomical bindings',
  targetBlend:'authored imported-point interpolation; not original normalized pose-block interpolation'})};
}
