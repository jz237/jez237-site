import {createNativeHull,stepNativeHull,NATIVE_HULL_STEP} from './native-hull.js';
import {createNativeWaterProfile,createNativeWaterState,applyNativeWaterForces} from './native-water.js';
import {createNativeRiderProfile,prepareNativeRiderFrame,applyNativeTrimForces,
  applyNativeAuxiliaryYawForces,decideNativeRiderAction,applyNativeManipulationForces} from './native-rider-forces.js';
import {createNativeControlState,sampleNativeControls} from './native-controls.js';
import {stepNativeArticulatedRider} from './native-articulated-rider.js';
import {createNativeRiderControlState,prepareNativeRiderControls,finishNativeRiderControls} from './native-rider-controls.js';
import {createNativeImpactState,resetNativeImpacts,recordNativeImpact,nativeImpactSnapshot} from './native-impact-state.js';

// Ordinary force-profile adapter, used by the explicit native race preview. Source
// actor/action inputs and recovered dive/roll/flip decisions are explicit. Input
// actor gates are supported, but other actors' full physical/animation overrides,
// wipeout recovery, scoring, AI and two-player catch-up are not implemented.
// A nonzero source trim, including its nose-up solid-contact override, needs
// the caller's previous-frame physical jointWorld. No substitute joint is made.
// Roll reference and its frame displacement are derived from the hull alone.
//
// Each tick interleaves jet → prepared trim → gravity/roll balance → prepared
// auxiliary yaw → current manipulation → action-gated dry correction → dive K
// override/ordinary K → buoyancy/drag → contacts → point-hull integration.
// Once per five ticks, the optional articulated provider supplies authored pose
// targets/history/anchors. Its physical joint2 output feeds the NEXT frame.
// The modern height/gradient water branch retains native-water's documented
// pressure approximation; an explicit cellAtNative surface instead reads the
// host's recovered raw field. The adapter never animates the shared field.
//
// Source geometry hooks run AFTER water and BEFORE the hull snapshot/integration
// in this order: shore, floor, boxes, optional dynamicPlanes, racingBuoys,
// fixedSpheres, primarySpheres. The last name is a legacy API name for GENERIC
// floating/breakable objects, not the racing primary-route buoys. Source order
// is primary-route7e8c8 -> hidden/fixed7ef80 -> generic7ecbc. Dynamic planes are
// a caller extension of the geometry stage, not a separately recovered call.
// Their caller owns finite clipping/candidate order. Use context.applyContact
// for point responses, not a rigid-craft impulse distribution. Other response
// bridges must report their approximation explicitly. There is no implicit
// swept contact supplement, rescue, course boundary or collision discovery.

const H=NATIVE_HULL_STEP,FRAME_TICKS=5;
const articulatedOwners=new WeakMap();
const CONTACT_DRIVE_SPEED=Math.fround(5/Math.fround(1.8));
const contactPhases=['shore','floor','boxes','dynamicPlanes','racingBuoys','fixedSpheres','primarySpheres'];
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const difference=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const magnitude=v=>Math.hypot(v.x,v.y,v.z);
// native-water accepts normalized axes then truncates *70. Bias by one JS ulp
// toward the intended integer so e.g29/70 does not become28 on that roundtrip.
const forceAxis=v=>v===0?0:Math.max(-1,Math.min(1,v/70+Math.sign(v)*Number.EPSILON));
const contactsZero=()=>({shoreImpactNative:0,floorImpactNative:0,boxImpactNative:0,markedBox:false});
const finite=(v,name)=>{if(!Number.isFinite(v))throw new TypeError(`${name} must be finite`);return v;};
function range(v,name,min,max){finite(v,name);if(v<min||v>max)throw new RangeError(`${name} must be from ${min} to ${max}`);return v;}
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);return v;}
function vector(p,name){if(!p||![p.x,p.y,p.z].every(Number.isFinite))throw new TypeError(`${name} must have finite x, y and z`);return p;}
function referencePoint(hull){
  const {center:c,frame:{up:u,forward:f},scale:s}=hull;
  return vec(c.x+s*(.1806645*u.x-26.9998535*f.x),c.y+s*(.1806645*u.y-26.9998535*f.y),
    c.z+s*(.1806645*u.z-26.9998535*f.z));
}
function meanVelocity(hull){
  const v=vec();for(const p of hull.points){v.x+=p.velocity.x/12;v.y+=p.velocity.y/12;v.z+=p.velocity.z/12;}
  hull.velocity=v;
}
function hookSet(hooks){
  if(!hooks||typeof hooks!=='object')throw new TypeError('contacts must be a hook object');
  for(const name of contactPhases)if(hooks[name]!==undefined&&typeof hooks[name]!=='function')throw new TypeError(`contacts.${name} must be a function`);
  return hooks;
}
function mergeContacts(target,report){
  if(report===undefined||report===null)return;
  if(Array.isArray(report)){for(const r of report)mergeContacts(target,r);return;}
  if(typeof report!=='object')throw new TypeError('Contact hooks return contact reports or undefined');
  for(const name of ['shoreImpactNative','floorImpactNative','boxImpactNative']){
    if(report[name]!==undefined)target[name]=Math.max(target[name],range(report[name],name,0,Infinity));
  }
  if(report.markedBox!==undefined){
    if(typeof report.markedBox!=='boolean')throw new TypeError('markedBox must be boolean');
    target.markedBox||=report.markedBox;
  }
}

const initialAction=()=>({action:0,actionMagnitudeNative:0,diveWetFrames:0,override:0,noWetNoContactFrames:0,arcActive:false});
function actionState(value={},previous=initialAction()){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('actionState must be an object');
  const result={...previous,...value};
  for(const key of Object.keys(value))if(!(key in initialAction()))throw new TypeError(`Unsupported actionState.${key}`);
  integer(result.action,'action',0,4);finite(result.actionMagnitudeNative,'actionMagnitudeNative');
  integer(result.diveWetFrames,'diveWetFrames',0,0x7ffffffe);integer(result.override,'override',0,0xffff);
  integer(result.noWetNoContactFrames,'noWetNoContactFrames',0,0x7ffffffe);
  if(typeof result.arcActive!=='boolean')throw new TypeError('arcActive must be boolean');
  return result;
}
function sourceSettings(value={}){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('sourceState must be an object or frame provider');
  const result={actorState:value.actorState??22,animationFrame:value.animationFrame??0,
    simulationState:value.simulationState??3,crash:value.crash??false,contactMode:value.contactMode??0};
  integer(result.actorState,'actorState',-1,255);integer(result.animationFrame,'animationFrame',0,65535);
  integer(result.simulationState,'simulationState',0,3);
  integer(result.contactMode,'contactMode',0,65535);
  if(typeof result.crash!=='boolean')throw new TypeError('crash must be boolean');
  return {...result,...(value.actionState===undefined?{}:{actionState:value.actionState})};
}

/**
 * Apply a qualified geometry hit to the point hull. normal is a source unit
 * normal (small source float normalization residuals are retained). Penetration
 * is in WORLD units. Shore/floor only remove incoming normal velocity; boxes
 * project it even when outgoing. All12 positions receive the common push while
 * only the contacted point velocity changes. The integrator snapshots later,
 * excluding that common push from persistent velocity. Returns native impact.
 */
export function applyNativeRaceContact(hull,{kind,pointIndex,normal,penetration=0,flag=false}={}){
  if(!hull||hull.points?.length!==12||!Number.isFinite(hull.scale)||hull.scale<=0)throw new TypeError('Expected a native point hull');
  if(!['shore','floor','box'].includes(kind))throw new RangeError('Contact kind must be shore, floor or box');
  if(!Number.isInteger(pointIndex)||pointIndex<0||pointIndex>11)throw new RangeError('Invalid pointIndex');
  vector(normal,'normal');range(penetration,'penetration',0,Infinity);
  if(Math.abs(magnitude(normal)-1)>.001)throw new RangeError('Contact normal must have source unit length');
  if(typeof flag!=='boolean')throw new TypeError('flag must be boolean');
  if(kind==='shore'&&(Math.abs(normal.y)>1e-8||penetration<=0||penetration>=16*hull.scale))return null;
  if(kind==='floor'&&penetration>16*hull.scale)return null;
  if(kind==='box'&&normal.y<=0&&[1,8,11].includes(pointIndex))return null;
  const v=hull.points[pointIndex].velocity,incoming=-dot(v,normal);
  if(kind!=='box'&&incoming<=0)return null;
  v.x+=incoming*normal.x;v.y+=incoming*normal.y;v.z+=incoming*normal.z;
  for(const point of hull.points){
    point.position.x+=penetration*normal.x;
    point.position.y+=penetration*normal.y;
    point.position.z+=penetration*normal.z;
  }
  meanVelocity(hull);
  const impact=Math.max(0,incoming)*H/hull.scale*(kind==='box'&&flag ? .4 : 1);
  return {[kind==='shore'?'shoreImpactNative':kind==='floor'?'floorImpactNative':'boxImpactNative']:impact,
    ...(kind==='box'?{markedBox:flag}:{})};
}

/**
 * Create an isolated craft. Numeric rider order and tune fields are explicit.
 * `surface` follows native-water's world-height/gradient contract. `contacts`
 * contains optional ordered callbacks(hull,context), which may mutate points.
 * `jointWorld` may be a world vector or function(hull,frameContext). Its value
 * is copied once per logical frame and retained for all five substeps.
 * Alternatively pass an independently initialized articulatedRider and required
 * riderPose(hull,completedFrameContext) provider. It returns explicit targets,
 * historyTargets, anchors and optional types for native-articulated-rider.
 * sourceState is an object or per-frame function(hull,frameContext). It supplies
 * actorState/animationFrame/simulationState/crash and optional actionState. An
 * object actionState at construction is initial state only; a provider or step
 * override may explicitly restore it on a later frame. No pose is chosen here.
 */
export function createNativeRaceAdapter({riderIndex=0,tuneB6c=0,tuneB70=0,tuneB74=0,
  position,velocity,heading=0,pitch=0,roll=0,scale=.025,surface=0,contacts={},jointWorld,
  contactFactor=1,powerSteps=5,sourceState={},articulatedRider,riderPose}={}){
  range(contactFactor,'contactFactor',0,1);range(powerSteps,'powerSteps',0,5);hookSet(contacts);
  if(jointWorld!==undefined&&typeof jointWorld!=='function')vector(jointWorld,'jointWorld');
  const hull=createNativeHull({position,velocity,heading,pitch,roll,scale,rider:riderIndex});
  const profile=createNativeWaterProfile({riderIndex,tuneB6c,tuneB70,tuneB74});
  const water=createNativeWaterState(profile),rider=createNativeRiderProfile({riderIndex}),impacts=createNativeImpactState();
  const riderControlState=createNativeRiderControlState({baseLateralRetention:profile.waterLateralRetention,baseRollBalance:profile.rollBalance});
  const source=typeof sourceState==='function'?{}:sourceSettings(sourceState),action=actionState(source.actionState);
  if(articulatedRider!==undefined){
    if(articulatedRider?.points?.length!==19||articulatedRider.scale!==scale)throw new TypeError('articulatedRider must be a nineteen-point rider at the hull scale');
    vector(articulatedRider.jointWorld,'physical jointWorld');
    if(typeof riderPose!=='function')throw new TypeError('articulatedRider requires a riderPose provider');
    if(jointWorld!==undefined)throw new TypeError('Use articulatedRider or explicit jointWorld, not both');
    if(articulatedOwners.has(articulatedRider))throw new Error('An articulated rider belongs to one adapter');
    articulatedOwners.set(articulatedRider,hull);
  }else if(riderPose!==undefined)throw new TypeError('riderPose requires an articulatedRider');
  // The source reset seeds aggregate wet state to8/true before later water
  // samples establish point bits. Rear wet flags remain independently false.
  water.wetCount=8;water.anyWet=true;
  return {hull,water,rider,riderControlState,impacts,controlState:createNativeControlState(),surface,contacts,jointWorld,
    sourceState:typeof sourceState==='function'?sourceState:{...source,actionState:undefined},
    actionState:action,articulatedRider,riderPose,
    contactFactor,powerSteps,remainder:0,logicalFrames:0,stepsLast:0,frame:null,
    preparedHullTick:null,pendingFrameCompletion:false,
    contactWindow:contactsZero(),contactDriveFrames:0,lastControls:null,
    lastFrame:{logicalFrame:0,clockUnits:0,frameDisplacementNative:vec(),frameSpeedNative:0,
      hudSpeed:0,referenceDisplacementNative:vec(),referenceChangeNative:vec(),
      wetCount:8,anyWet:true,contacts:contactsZero(),impacts:nativeImpactSnapshot(impacts),actorState:source.actorState??22,
      actionState:{...action},jointWorld:articulatedRider?copy(articulatedRider.jointWorld):null}};
}

function nativeInput(input){
  if(!input||typeof input!=='object')throw new TypeError('Expected race controls');
  const raw=['rawXNative','rawYNative','heldButtons'].some(k=>input[k]!==undefined);
  if(raw){
    if(['steer','trim','throttle'].some(k=>input[k]!==undefined))throw new TypeError('Use either normalized race controls or raw native controls');
    return {rawXNative:input.rawXNative??0,rawYNative:input.rawYNative??0,heldButtons:input.heldButtons??0};
  }
  const steer=range(input.steer??0,'steer',-1,1),trim=range(input.trim??0,'trim',-1,1);
  const throttle=input.throttle??false;
  if(typeof throttle!=='boolean')range(throttle,'throttle',0,1);
  return {rawXNative:-Math.trunc(70*steer)||0,rawYNative:Math.trunc(70*trim)||0,
    heldButtons:throttle>0?0x8000:0};
}

function beginFrame(adapter,input,options){
  const {hull,water,lastFrame,logicalFrames}=adapter;
  const requested=typeof input==='function'?input(hull.simulationTime,logicalFrames):input;
  const previousContacts={...lastFrame.contacts};
  const frameContext={logicalFrame:logicalFrames,time:hull.simulationTime,
    previousContacts,previousFrame:lastFrame,previousAction:{...adapter.actionState}};
  const sourceProvider=options.sourceState??adapter.sourceState;
  const source=sourceSettings(typeof sourceProvider==='function'?sourceProvider(hull,frameContext):sourceProvider);
  const oldAction=actionState(source.actionState,adapter.actionState);
  const sampled=sampleNativeControls(adapter.controlState,{...nativeInput(requested),tick:logicalFrames>>>0,...source});
  const physicalControls=prepareNativeRiderControls(adapter.riderControlState,{heldButtons:sampled.heldButtons,
    pressedButtons:sampled.pressedButtons,actorState:source.actorState,riderIndex:adapter.rider.riderIndex,
    wet:water.anyWet,contactMode:source.contactMode});
  frameContext.controls=sampled;frameContext.actorState=source.actorState;
  if(adapter.articulatedRider&&options.jointWorld!==undefined)throw new TypeError('articulatedRider owns the physical jointWorld');
  const provider=options.jointWorld??adapter.jointWorld;
  const joint=adapter.articulatedRider?adapter.articulatedRider.jointWorld:typeof provider==='function'?provider(hull,frameContext):provider;
  const poseProvider=options.riderPose??adapter.riderPose;
  if(adapter.articulatedRider&&typeof poseProvider!=='function')throw new TypeError('Expected a riderPose provider');
  const prepared=prepareNativeRiderFrame(adapter.rider,{
    jointWorld:joint,stickXNative:sampled.workingXNative,stickYNative:sampled.workingYNative,
    frameSpeedNative:lastFrame.frameSpeedNative,
    horizontalFrameSpeedNative:Math.hypot(lastFrame.frameDisplacementNative.x,lastFrame.frameDisplacementNative.z),
    forwardY:Math.max(-1,Math.min(1,hull.frame.forward.y)),wetCount:water.wetCount,
    shoreContact:previousContacts.shoreImpactNative>0,floorContact:previousContacts.floorImpactNative>0,
    boxContact:previousContacts.boxImpactNative>0,actorState:source.actorState,previousAction:oldAction.action
  });
  const decision=decideNativeRiderAction(adapter.rider,{...oldAction,actorState:source.actorState,
    rawXNative:sampled.rawXNative,rawYNative:sampled.rawYNative,wetCount:water.wetCount,
    frameSpeedNative:lastFrame.frameSpeedNative,throttle:sampled.throttle,tick:logicalFrames>>>0,
    gestureTicks:sampled.gestureTicks,floorContact:previousContacts.floorImpactNative>0,
    boxContact:previousContacts.boxImpactNative>0});
  const nextAction={...oldAction,action:decision.action,actionMagnitudeNative:decision.actionMagnitudeNative,
    diveWetFrames:decision.diveWetFrames,override:decision.override};
  if(decision.entered){
    if(!nextAction.arcActive)nextAction.noWetNoContactFrames=0;
    nextAction.arcActive=true;
  }
  const forceControls={...sampled,conditionedXNative:sampled.workingXNative,conditionedYNative:sampled.workingYNative,
    workingXNative:decision.muteSteering?0:sampled.workingXNative,workingYNative:decision.muteTrim?0:sampled.workingYNative};
  // Everything that may reject missing trim input precedes these mutations.
  adapter.controlState=sampled.state;adapter.lastControls=forceControls;adapter.actionState=nextAction;
  adapter.riderControlState=physicalControls.state;
  adapter.frame={startCenter:copy(hull.center),startReference:referencePoint(hull),prepared,
    controls:forceControls,physicalControls,previousContacts,action:decision,actorState:source.actorState,
    simulationState:source.simulationState,riderPose:poseProvider};
  resetNativeImpacts(adapter.impacts,{simulationState:source.simulationState});
  if(source.simulationState!==0)adapter.contactWindow=contactsZero();
}

function endFrame(adapter){
  const {hull,water,frame,lastFrame,contactWindow}=adapter,s=hull.scale;
  const movement=difference(hull.center,frame.startCenter),reference=difference(referencePoint(hull),frame.startReference);
  const displacement=vec(movement.x/s,movement.y/s,movement.z/s),speed=magnitude(displacement);
  const referenceDisplacement=vec(reference.x/s,reference.y/s,reference.z/s);
  const referenceChange=difference(referenceDisplacement,lastFrame.referenceDisplacementNative);
  if((contactWindow.floorImpactNative===0&&contactWindow.boxImpactNative===0)||!frame.controls.throttle)adapter.contactDriveFrames=0;
  else if(adapter.contactDriveFrames<40&&speed<CONTACT_DRIVE_SPEED)adapter.contactDriveFrames++;
  // Source arc counter accumulates qualifying dry/no-solid frames; wet contact
  // does not zero it. A new action arc resets it only when no arc was active.
  if(!water.anyWet&&contactWindow.floorImpactNative+contactWindow.boxImpactNative+contactWindow.shoreImpactNative===0){
    adapter.actionState.noWetNoContactFrames=Math.min(0x7ffffffe,adapter.actionState.noWetNoContactFrames+1);
  }else if(adapter.actionState.action===0)adapter.actionState.arcActive=false;
  adapter.logicalFrames++;
  adapter.lastFrame={logicalFrame:adapter.logicalFrames,clockUnits:adapter.logicalFrames*50,
    frameDisplacementNative:displacement,frameSpeedNative:speed,
    hudSpeed:Math.trunc(Math.fround(Math.trunc(Math.fround(speed))*Math.fround(1.8))),
    referenceDisplacementNative:referenceDisplacement,referenceChangeNative:referenceChange,
    wetCount:water.wetCount,anyWet:water.anyWet,contacts:{...contactWindow},impacts:nativeImpactSnapshot(adapter.impacts),
    actorState:frame.actorState,actionState:{...adapter.actionState},jointWorld:frame.prepared.jointWorld?copy(frame.prepared.jointWorld):null};
  let postControls;
  if(adapter.articulatedRider){
    const pose=frame.riderPose(hull,{logicalFrame:adapter.logicalFrames-1,time:hull.simulationTime,
      controls:frame.controls,actorState:frame.actorState,action:frame.action,completedFrame:adapter.lastFrame});
    postControls=finishNativeRiderControls(adapter.riderControlState,{targets:pose.targets,center:hull.center,up:hull.frame.up,scale:s});
    let manipulationDeltas=postControls.manipulationDeltas;
    if(pose.manipulationDeltas!==undefined){
      if(!Array.isArray(pose.manipulationDeltas)||pose.manipulationDeltas.length!==19)throw new TypeError('Pose manipulationDeltas must contain nineteen vectors');
      manipulationDeltas=manipulationDeltas.map((p,i)=>{
        const q=vector(pose.manipulationDeltas[i],`manipulationDeltas[${i}]`);return vec(p.x+q.x,p.y+q.y,p.z+q.z);
      });
    }
    stepNativeArticulatedRider(adapter.articulatedRider,{...pose,targets:postControls.targets,manipulationDeltas,center:hull.center,up:hull.frame.up});
    adapter.lastFrame.jointWorld=copy(adapter.articulatedRider.jointWorld);
  }else postControls=finishNativeRiderControls(adapter.riderControlState);
  adapter.riderControlState=postControls.state;
  const c=frame.physicalControls;
  adapter.lastFrame.physicalControls={gravityNative:c.gravityNative,lateralRetention:c.lateralRetention,rollBalance:c.rollBalance,
    crouchFactor:c.crouchFactor,enteredCrouch:c.enteredCrouch,nextCrouchFactor:postControls.state.crouchFactor};
}

/** Prepare without moving points. A multi-craft world prepares ALL riders
 * before its first hull tick. Single-adapter stepping calls this automatically.
 * Repeated preparation would consume input/history twice and is rejected.
 */
export function prepareNativeRaceAdapterFrame(adapter,input={},options={}){
 if(!adapter?.hull||adapter.hull.ticks%FRAME_TICKS!==0||adapter.pendingFrameCompletion)
  throw new Error('Native frame preparation requires a completed outer boundary');
 if(adapter.preparedHullTick===adapter.hull.ticks)throw new Error('Native frame is already prepared');
 beginFrame(adapter,input,options);adapter.preparedHullTick=adapter.hull.ticks;return adapter;
}

/** Complete a deferred fifth tick after ALL hulls have finished. This runs the
 * nineteen-point rider solve before water/cameras/floating objects advance.
 */
export function completeNativeRaceAdapterFrame(adapter){
 if(!adapter?.pendingFrameCompletion||adapter.hull.ticks%FRAME_TICKS!==0)
  throw new Error('No deferred native frame completion');
 endFrame(adapter);adapter.pendingFrameCompletion=false;return adapter;
}

/**
 * Advance through fixed10ms ticks. dt=0 performs no input sampling. Inputs are
 * normalized {throttle,steer,trim} or explicit {rawXNative,rawYNative,heldButtons}.
 * Positive browser steer turns right (+heading), hence negative native raw X;
 * positive trim is native+Y. Any positive throttle value means held sourceA.
 * A function(time,logicalFrame) may supply time-indexed inputs for replays.
 * Inputs/source state/joint are sampled once per five ticks. A physical rider
 * solve follows tick5 when provided; its joint is used on the next preparation.
 * options.sourceState restores explicit action fields at frame boundaries;
 * fields not supplied retain the adapter's action lifecycle. Pause by omitting calls.
 * Contact hooks run each tick. applyContact() reports geometry responses to
 * both the legacy contact-drive window and the seven native impact channels.
 * Other kernels call recordImpact({channel,incomingNative,normal,markedBox})
 * for EACH qualified contact in traversal order. report()/hook return values
 * retain the legacy three-field contact-drive contract; without a normal they
 * cannot supply the shared source impact normal or replace recordImpact().
 */
export function stepNativeRaceAdapter(adapter,dt,input={},options={}){
  range(dt,'dt',0,1);
  if(adapter.pendingFrameCompletion)throw new Error('Complete the deferred native rider frame before stepping');
  if(options.deferFrameCompletion!==undefined&&typeof options.deferFrameCompletion!=='boolean')throw new TypeError('deferFrameCompletion must be boolean');
  const hooks=hookSet(options.contacts??adapter.contacts),surface=options.surface??adapter.surface;
  adapter.stepsLast=0;
  if(dt===0)return adapter;
  const previousRemainder=adapter.remainder,previousTicks=adapter.hull.ticks;
  adapter.remainder+=dt;
  const steps=Math.floor((adapter.remainder+1e-12)/H);
  if(options.deferFrameCompletion&&steps>FRAME_TICKS-adapter.hull.ticks%FRAME_TICKS){
    adapter.remainder=previousRemainder;throw new RangeError('Deferred completion stops at the next outer boundary');
  }
  try{
    for(let i=0;i<steps;i++){
      if(adapter.hull.ticks%FRAME_TICKS===0&&adapter.preparedHullTick!==adapter.hull.ticks)prepareNativeRaceAdapterFrame(adapter,input,options);
      if(adapter.pendingFrameCompletion)throw new Error('Deferred completion permits no next-frame hull tick');
      stepNativeHull(adapter.hull,H,{beforeIntegrate:hull=>{
        const {frame,water,contactWindow}=adapter,c=frame.controls;
        applyNativeWaterForces(hull,water,{surface,throttle:c.throttle,
          stickX:forceAxis(c.workingXNative),stickY:forceAxis(c.workingYNative),
          powerSteps:adapter.powerSteps,powerFactor:c.powerFactor,
          jetStraight:frame.prepared.jetStraight,suppressDryCorrection:frame.action.suppressDryCorrection,
          buoyancyKOverride:frame.action.buoyancyKOverride,
          gravityNativeOverride:frame.physicalControls.gravityNative,
          waterLateralRetentionOverride:frame.physicalControls.lateralRetention,rollBalanceOverride:frame.physicalControls.rollBalance,
          clearEngine:frame.actorState===23,
          afterJet:h=>applyNativeTrimForces(h,adapter.rider,frame.prepared),
          afterGravity:(h,w)=>{
            applyNativeAuxiliaryYawForces(h,frame.prepared);
            applyNativeManipulationForces(h,{...frame.action,gravityNative:w.lastGravityNative,riderIndex:adapter.rider.riderIndex});
          },
          staticContact:adapter.contactDriveFrames>=40||contactWindow.floorImpactNative>0,
          contactFactor:adapter.contactDriveFrames>=40?1:adapter.contactFactor});
        const context={logicalFrame:adapter.logicalFrames,substep:hull.ticks%FRAME_TICKS,
          time:hull.simulationTime,controls:c,water,contactWindow,actorState:frame.actorState,action:frame.action,
          report:report=>mergeContacts(contactWindow,report),
          recordImpact:hit=>recordNativeImpact(adapter.impacts,hit),
          applyContact:hit=>{
            // Read signed incoming before the point response changes velocity.
            // The public legacy report retains its existing world conversion;
            // the seven-channel producer applies source float32 box scaling.
            const p=hull.points[hit?.pointIndex],n=hit?.normal;
            const incomingNative=p&&n?-dot(p.velocity,n)*H/hull.scale:NaN;
            const report=applyNativeRaceContact(hull,hit);mergeContacts(contactWindow,report);
            if(report)recordNativeImpact(adapter.impacts,{channel:hit.kind,incomingNative,normal:n,markedBox:hit.kind==='box'&&!!hit.flag});
            return report;
          }};
        for(const phase of contactPhases)if(hooks[phase])mergeContacts(contactWindow,hooks[phase](hull,context));
      }});
      adapter.remainder=Math.max(0,adapter.remainder-H);adapter.stepsLast++;
      if(adapter.hull.ticks%FRAME_TICKS===0){
        if(options.deferFrameCompletion)adapter.pendingFrameCompletion=true;
        else endFrame(adapter);
      }
    }
  }catch(error){
    if(adapter.hull.ticks===previousTicks)adapter.remainder=previousRemainder;
    throw error;
  }
  return adapter;
}

/** Copy a render/HUD snapshot; force/action state stays owned by the adapter. */
export function nativeRaceSnapshot(adapter){
  const {hull,lastFrame}=adapter,{forward:f,right:r,up:u}=hull.frame;
  return {position:copy(hull.center),velocity:copy(hull.velocity),
    frame:{forward:copy(f),right:copy(r),up:copy(u)},heading:Math.atan2(f.x,f.z),
    pitch:-Math.asin(Math.max(-1,Math.min(1,f.y))),roll:Math.atan2(r.y,u.y),
    source:{...lastFrame,frameDisplacementNative:copy(lastFrame.frameDisplacementNative),
      referenceDisplacementNative:copy(lastFrame.referenceDisplacementNative),
      referenceChangeNative:copy(lastFrame.referenceChangeNative),contacts:{...lastFrame.contacts},
      impacts:{...lastFrame.impacts,normal:copy(lastFrame.impacts.normal)},
      ...(lastFrame.physicalControls?{physicalControls:{...lastFrame.physicalControls}}:{}),
      actionState:{...lastFrame.actionState},jointWorld:lastFrame.jointWorld?copy(lastFrame.jointWorld):null},
    simulationTime:hull.simulationTime,remainder:adapter.remainder};
}
