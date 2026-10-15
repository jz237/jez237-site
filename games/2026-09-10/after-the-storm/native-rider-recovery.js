// Reconstructed numeric post-hull rider lifecycle. One decision follows FIVE
// completed 10ms hull ticks; pose completion follows an ORIGINAL/EQUIVALENT
// target evaluator. Native impact velocity and completed-frame speed have
// different units. This module advances neither hulls nor animation clocks.
import {createNativeRiderActionDispatchState,dispatchNativeRiderActionRequest,
 nativeRiderActionNeedsRandom,prepareNativeRiderDiveReturn} from './native-rider-action-dispatch.js';
import {nativeRiderActionPoseInitialization,prepareNativeRiderActionPoseCompletion} from './native-rider-action-pose-lifecycle.js';

const F=Math.fround,axes=['x','y','z'],SCHEMA='native-rider-recovery-v2';
const impactFields=['primaryBuoyImpactNative','fixedSphereImpactNative','racerImpactNative',
 'shoreImpactNative','boxImpactNative','floorImpactNative','objectImpactNative'];
const severeTables=[[10,10.5,9.5,10],[9.5,10,9,8],[9.5,10,9,8],
 [8.5,9,8,8],[8.5,9,8,8],[8.5,9.5,8,9],[10,10.5,9.5,10]];
const moderateTables={fixedSphereImpactNative:[4,4,3,3.3],racerImpactNative:[5,6,5,5.5],
 shoreImpactNative:[4,4,3,3.3],boxImpactNative:[4,4,3,4],floorImpactNative:[5,7,4,6],
 objectImpactNative:[5,6,5.9,5.5]};
const severeTilt=[.38,.43,.43,.4].map(F),mildTilt=[.48,.53,.53,.5].map(F);
const moderatePrimary=[5,6,5.9,5.5].map(F),speedGate=F(22.22222328186035);
const actionActors=new Set([8,9,10,17,25]),poseActors=new Set([7,8,9,10,15,17,22,23,24,25]);
const stateFields=new Set(['schema','riderIndex','actorState','animationFrame','pendingActor','pendingAnimationFrame',
 'holdFrame','blendProgress','blendStep','crashCountdown','crashDampingLatch','contactMode','stumbleCountdown',
 'recoveryCounter','secondaryCounter','stumbleCounter','recoveryInputLock','alternateStumble','selectedActor',
 'selectionCountdown','lifecycleFrame','phase','pose','hullDamping']);
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} is outside its native integer range`);
 return value;
}
function number(value,name){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite float32`);
 return F(value);
}
function boolean(value,name){if(typeof value!=='boolean')throw new TypeError(`${name} must be a boolean`);return value;}
function vector(value,name){
 if(!value||typeof value!=='object')throw new TypeError(`${name} requires actual native XYZ`);
 return Object.fromEntries(axes.map(k=>[k,number(value[k],`${name}.${k}`)]));
}
function array(value,count,name,convert){
 if(!Array.isArray(value)||value.length!==count)throw new RangeError(`${name} requires ${count} entries`);
 return value.map((v,i)=>convert(v,`${name}[${i}]`));
}
function stateCopy(value,phase){
 if(!value||value.schema!==SCHEMA)throw new TypeError('Expected a serializable native rider recovery state');
 if(Object.keys(value).some(k=>!stateFields.has(k)))throw new TypeError('Unknown recovery state field');
 if(value.phase!==phase)throw new Error(`Expected recovery phase ${phase}, received ${value.phase}`);
 const s={...value,hullDamping:array(value.hullDamping,12,'hullDamping',number),pose:value.pose?{...value.pose}:null};
 integer(s.riderIndex,'riderIndex',0,3);integer(s.actorState,'actorState',0,25);
 integer(s.animationFrame,'animationFrame',0);integer(s.pendingActor,'pendingActor',-1,25);
 integer(s.pendingAnimationFrame,'pendingAnimationFrame',0);integer(s.holdFrame,'holdFrame',0,65535);
 for(const k of ['crashCountdown','stumbleCountdown','contactMode','alternateStumble'])integer(s[k],k,0,65535);
 for(const k of ['recoveryCounter','secondaryCounter','stumbleCounter','recoveryInputLock','selectedActor'])integer(s[k],k);
 integer(s.selectionCountdown,'selectionCountdown',-32768,32767);
 integer(s.lifecycleFrame,'lifecycleFrame',0,Number.MAX_SAFE_INTEGER-1);
 boolean(s.crashDampingLatch,'crashDampingLatch');
 s.blendProgress=number(s.blendProgress,'blendProgress');s.blendStep=number(s.blendStep,'blendStep');
 if(s.blendProgress<0||s.blendProgress>=1||s.blendStep<0||s.blendStep>=1||
  (s.blendProgress>0)!==(s.pendingActor>=0)||s.blendProgress>0&&s.blendStep===0)throw new RangeError('Inconsistent native actor blend');
 if(phase==='pose'){
  if(!s.pose||Object.keys(s.pose).some(k=>k!=='blendAtEvaluation')||
   boolean(s.pose.blendAtEvaluation,'pose.blendAtEvaluation')!==(s.blendProgress>0))throw new Error('Invalid pose evaluation context');
 }else if(s.pose!==null)throw new Error('A ready recovery state cannot retain a pending pose evaluation');
 return s;
}

/** riderIndex is the actual source ordinal0..3, with no avatar-name mapping.
 * hullDamping is the twelve saved native point coefficients, not a tuning
 * default. A JSON round-trip of either phase can be passed here to resume. */
export function createNativeRiderRecovery(options={}){
 const state={schema:SCHEMA,riderIndex:undefined,actorState:22,animationFrame:0,pendingActor:-1,
  pendingAnimationFrame:0,holdFrame:0,blendProgress:0,blendStep:0,crashCountdown:0,
  crashDampingLatch:false,contactMode:0,stumbleCountdown:0,recoveryCounter:-1,
  secondaryCounter:-1,stumbleCounter:0,recoveryInputLock:0,alternateStumble:0,
  selectedActor:-1,selectionCountdown:-1,lifecycleFrame:0,phase:'ready',pose:null,...options};
 if(state.phase!=='ready'&&state.phase!=='pose')throw new RangeError('Unknown recovery phase');
 return freeze(stateCopy(state,state.phase));
}

function initialization(s,actor){
 if(actionActors.has(actor)){
  const values=nativeRiderActionPoseInitialization({actorState:actor,alternate16cc:s.alternateStumble});
  return {kind:'initializeRiderActor',actorState:actor,physicalMode:values.physicalMode,
   jointTypes:[...values.riderJointTypes],requiresEquivalentInitializer:false};
 }
 const types=Array(19).fill(actor===23||actor===24?0:1);
 if(actor===7)for(const i of [0,1,2,6,7,8,9,10,14,15,16,17,18])types[i]=0;
 if(actor===15){for(const i of [2,7,8,15,16])types[i]=0;types[6]=2;types[14]=3;}
 if(actor===22){
  if(s.alternateStumble)for(const i of [2,6,7,14,15])types[i]=0;
  else{for(const i of [9,10,17,18])types[i]=4;types[6]=2;types[14]=3;}
 }
 if(actor===24){for(const i of [2,3,7,11,15])types[i]=5;types[6]=2;types[14]=3;s.stumbleCounter=0;}
 const known=actor===-1||poseActors.has(actor);
 return {kind:'initializeRiderActor',actorState:actor,physicalMode:actor>=18&&actor<=21?0:1,
  jointTypes:known?types:null,requiresEquivalentInitializer:!known};
}
function request(s,effects,actor,frame,rate,hold){
 const blend=F(rate);
 if(blend===1){
  if(s.actorState===actor)return null;
  s.actorState=actor;s.animationFrame=frame;s.pendingActor=-1;s.blendProgress=0;
  // Source immediate requests retain C64 and the old blend increment.
  effects.push(initialization(s,actor));
 }else{
  if(s.pendingActor===actor)return null;
  s.pendingActor=actor;s.pendingAnimationFrame=frame;s.blendProgress=blend;s.blendStep=blend;s.holdFrame=hold;
  effects.push(initialization(s,-1));
 }
 return {actorState:actor,animationFrame:frame,blend,holdFrame:hold};
}
function result(s,effects,actorRequest,phase,skipped=false,actionContext=null){
 s.phase=phase;s.pose=phase==='pose'?{blendAtEvaluation:s.blendProgress>0}:null;
 const poseRequest=phase==='pose'?{actorState:s.actorState,animationFrame:s.animationFrame,
  pending:s.pendingActor>=0?{actorState:s.pendingActor,animationFrame:s.pendingAnimationFrame,holdFrame:s.holdFrame}:null,
  blendProgress:s.blendProgress,requiresEquivalentTargets:true,
  actorSpecificCompletionSupported:poseActors.has(s.actorState)}:null;
 return freeze({state:s,effects:effects.map((effect,i)=>({...effect,effectId:`${s.lifecycleFrame}:${phase==='pose'?'decision':'completion'}:${i}`})),
  actorRequest,poseRequest,skipped,...(actionContext?{actionWrites:actionContext.state,
   actionDispatch:actionContext.diagnostics}:{})});
}

// The adapter owns these retained words/history. Validate and detach even if
// a higher-priority source branch skips their consumer. No duplicate lifecycle
// counter or RNG is initialized here. state650 is the actual race phase, not
// the separate simulationState argument of this completed-frame lifecycle.
function actionInputs(value){
 if(value===undefined)return null;
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('actionDispatch must be an explicit record');
 const state=createNativeRiderActionDispatchState(value.state),history=value.history;
 if(!history||typeof history!=='object'||Array.isArray(history))throw new TypeError('actionDispatch.history is required');
 const fields={tick:integer(value.tick,'actionDispatch.tick',0,0xffffffff),
  gestureTick15f0:integer(history.gestureTick15f0,'gestureTick15f0',0,0xffffffff),
  gestureWindowNative:integer(value.gestureWindowNative,'gestureWindowNative',0,0xffffffff),
  state650:integer(value.state650,'state650'),idleThresholdNative:integer(value.idleThresholdNative,'idleThresholdNative'),
  rawYNative:integer(value.rawYNative,'rawYNative',-128,127),
  workingXNative:integer(value.workingXNative,'workingXNative',-128,127),
  workingYNative:integer(value.workingYNative,'workingYNative',-128,127),
  heldButtonsB56:integer(value.heldButtonsB56,'heldButtonsB56',0,65535),
  ...Object.fromEntries(['flag1600','sequence15f8','sequence15fa'].map(k=>[k,integer(history[k],k,0,65535)]))};
 if(value.randomUnsigned32!==undefined&&typeof value.randomUnsigned32!=='function')throw new TypeError('randomUnsigned32 must be the explicit shared source provider');
 return {state,fields,randomUnsigned32:value.randomUnsigned32,diagnostics:{eligible:false,requestCleared:false,randomRead:false}};
}
function dispatchAction(s,q,a,effects){
 const snapshot={...a.fields,actorState:s.actorState,alternate16cc:s.alternateStumble,
  manipulationAction:q.manipulationAction,frameSpeedNative:q.frameSpeedNative,bodyUpY:q.upY};
 const needsRandom=nativeRiderActionNeedsRandom(a.state,snapshot);
 if(needsRandom&&!a.randomUnsigned32)throw new TypeError('This eligible idle branch needs the actual shared randomUnsigned32 provider');
 const prepared=dispatchNativeRiderActionRequest(a.state,snapshot,needsRandom?{randomUnsigned32:a.randomUnsigned32()}:{});
 a.state=prepared.state;a.diagnostics={eligible:true,requestCleared:prepared.requestCleared,randomRead:prepared.randomRead};
 const r=prepared.actorRequest;
 return r?request(s,effects,r.actorState,r.animationFrame,r.blend,r.holdFrame):null;
}
function inputs(snapshot){
 if(!snapshot||typeof snapshot!=='object')throw new TypeError('A completed native hull snapshot is required');
 const simulationState=integer(snapshot.simulationState,'simulationState',0,3);
 if(simulationState===0)return {simulationState};
 const q={simulationState,raceFinished:boolean(snapshot.raceFinished,'raceFinished'),
  frameSpeedNative:number(snapshot.frameSpeedNative,'frameSpeedNative'),
  wetCount:integer(snapshot.wetCount,'wetCount',0,12),upY:number(snapshot.upY,'upY'),
  manipulationAction:integer(snapshot.manipulationAction,'manipulationAction')};
 if(q.frameSpeedNative<0)throw new RangeError('frameSpeedNative is a displacement magnitude');
 if(!snapshot.impacts)throw new TypeError('All seven source impact channels are required');
 q.impacts=Object.fromEntries(impactFields.map(k=>{
  const value=number(snapshot.impacts[k],k);if(value<0)throw new RangeError('Impact maxima cannot be negative');return [k,value];
 }));
 q.impacts.normal=vector(snapshot.impacts.normal,'impacts.normal');
 boolean(snapshot.impacts.markedBox,'impacts.markedBox');
 return q;
}
function deltaEffect(upY,subtractForwardNative=null){
 return {kind:'transformRiderDeltas',jointCount:19,xzScale:F(.8),clearNegativeY:upY>F(.6),subtractForwardNative};
}

/** Completed-frame actor selection. The current hull steps are already done;
 * effects apply after them. simulationState0 returns ready without pose work.
 * physicalJoint2YNative/courseDatumNative are mandatory for actor23. Actor24
 * requires actual engineEnabled; entering24 requires actual frameForwardNative.
 * Normal selectedActor/selectionCountdown are explicit source state fields. */
export function decideNativeActorAfterHull(state,snapshot){
 const s=stateCopy(state,'ready'),q=inputs(snapshot),a=actionInputs(snapshot.actionDispatch),effects=[];
 if(q.simulationState===0)return result(s,effects,null,'ready',true,a);
 s.lifecycleFrame++;let actorRequest=null;
 const i=s.riderIndex,impact=q.impacts,fast=q.frameSpeedNative>speedGate&&!q.raceFinished;
 if(s.crashCountdown){
  s.crashCountdown--;
  if(s.crashCountdown===0){
   actorRequest=request(s,effects,23,0,1,0);effects.push(deltaEffect(q.upY));
   s.recoveryCounter=s.secondaryCounter=-1;
  }
 }else if(s.stumbleCountdown){
  s.stumbleCountdown--;
  if(s.stumbleCountdown===0||q.manipulationAction!==0){
   const forward=vector(snapshot.frameForwardNative,'frameForwardNative');
   actorRequest=request(s,effects,24,0,1,1);effects.push(deltaEffect(q.upY,forward));
   s.recoveryCounter=s.secondaryCounter=-1;s.contactMode=0;s.stumbleCountdown=0;
  }else{
   const cancel=F(F(mildTilt[i]*F(F(1)-F(.6)))+F(.6));
   if(q.upY>cancel){s.contactMode=0;s.stumbleCountdown=0;}
  }
 }else{
  const factor=s.actorState===8?F(.1):s.actorState===9?F(.15):s.actorState===17?F(.2):1;
  const thresholds=severeTables.map(table=>F(F(table[i])*factor));
  const severe=(fast&&impactFields.some((k,j)=>impact[k]>thresholds[j]))||
   q.wetCount>=1&&q.wetCount<=7&&q.upY<severeTilt[i]||impact.racerImpactNative>thresholds[2];
  if(severe&&s.actorState!==7&&s.actorState!==23){
   s.crashCountdown=5;
   if(!s.crashDampingLatch){
    s.crashDampingLatch=true;
    effects.push({kind:'crashHullKick',pointCount:12,dampingNative:F(.999),normal:{...impact.normal},velocityScale:F(1.5)});
   }
   if(s.contactMode===0)s.contactMode=1;
  }else if(s.actorState===22||s.actorState===15){
   if(s.selectedActor>=0&&s.selectionCountdown>=0){
    if(s.selectionCountdown===0)actorRequest=request(s,effects,s.selectedActor,1,.15,1);
    else s.selectionCountdown--;
   }else{
    const moderate=(fast&&Object.entries(moderateTables).some(([k,table])=>k!=='racerImpactNative'&&impact[k]>F(table[i])))||
     impact.racerImpactNative>F(moderateTables.racerImpactNative[i]);
    if(moderate)s.stumbleCountdown=1;
    else if(fast&&impact.primaryBuoyImpactNative>moderatePrimary[i]||q.wetCount>0&&q.upY<mildTilt[i]){
     s.stumbleCountdown=26;if(s.contactMode===0)s.contactMode=2;
    }else if(a)actorRequest=dispatchAction(s,q,a,effects);
   }
  }else if(s.actorState===24){
   const engineEnabled=boolean(snapshot.engineEnabled,'engineEnabled');
   if(q.wetCount>0||impact.floorImpactNative!==0||impact.boxImpactNative!==0){
    s.stumbleCounter=(s.stumbleCounter+1)|0;
    if(s.stumbleCounter>=41||s.stumbleCounter>=11&&(!engineEnabled||q.frameSpeedNative<F(11.111111640930176))){
     if(s.alternateStumble)actorRequest=request(s,effects,22,0,.075,0);
     else{s.recoveryInputLock=1;actorRequest=request(s,effects,7,57,.15,0);}
    }
   }
  }else if(s.actorState===23){
   const jointY=number(snapshot.physicalJoint2YNative,'physicalJoint2YNative');
   const datum=F(integer(snapshot.courseDatumNative,'courseDatumNative'));
   if(s.recoveryCounter<0){if(jointY<datum)s.recoveryCounter=0;}
   else{
    s.recoveryCounter=(s.recoveryCounter+4)|0;
    if(s.recoveryCounter>=100||s.recoveryCounter>=10&&q.wetCount>=8&&q.upY>F(.9)&&q.frameSpeedNative<F(8.333333969116211)){
     effects.push({kind:'clearRiderDeltas',jointCount:19});s.recoveryInputLock=0;
     actorRequest=request(s,effects,7,0,1,0);
     if(actorRequest)s.recoveryCounter=-1;
     if(s.contactMode)s.contactMode=0;
    }
   }
  }else if(s.actorState===25){
   const prepared=prepareNativeRiderDiveReturn({actorState:25,manipulationAction:q.manipulationAction,secondaryCounterC70:s.secondaryCounter});
   s.secondaryCounter=prepared.secondaryCounterC70;
   const r=prepared.actorRequest;
   if(r)actorRequest=request(s,effects,r.actorState,r.animationFrame,r.blend,r.holdFrame);
  }
 }
 // Successful53eac clears C6c regardless of which eligibility branch made
 // the request. The adapter owns that counter; a same-current/pending no-op
 // never returns actorRequest and must not produce this reset.
 if(a&&actorRequest)a.state={...a.state,idleFramesC6c:0};
 return result(s,effects,actorRequest,'pose',false,a);
}

/** Complete exactly one original/equivalent target evaluation. Explicit sampled
 * edges, not held buttons, accelerate7. Active blends need BOTH evaluator
 * outcomes, even when holdFrame prevents storing the pending frame. Other
 * action actors require their actual physicalMode and explicit source snapshot
 * through options. Active blends skip every actor-specific consumer. Targets
 * remain external; procedural23/24/25 return exactly0. Actor15's nonnegative
 * inactive-blend outcome requires the actual transient phase650. This is
 * distinct from simulation648 and is not retained as another phase owner. */
export function finishNativeActorPose(state,outcome,{physicalMode,poseCompletion,phase650}={}){
 const s=stateCopy(state,'pose'),effects=[];
 if(!outcome||typeof outcome!=='object')throw new TypeError('An equivalent pose evaluator outcome is required');
 if(!poseActors.has(s.actorState))throw new RangeError(`Actor ${s.actorState} requires its separate source post-pose consumer`);
 const next=integer(outcome.nextAnimationFrame,'nextAnimationFrame',-1);
 const pressed=integer(outcome.pressedButtons,'pressedButtons',0,65535),released=integer(outcome.releasedButtons,'releasedButtons',0,65535);
 if(outcome.heldButtons!==undefined)integer(outcome.heldButtons,'heldButtons',0,65535);
 if([23,24,25].includes(s.actorState)&&next!==0)throw new RangeError('Procedural actor23/24/25 must supply its evaluator return0');
 let actorRequest=null;
 if(s.pose.blendAtEvaluation){
  const pendingNext=integer(outcome.pendingNextAnimationFrame,'pendingNextAnimationFrame',-1);
  if([23,24,25].includes(s.pendingActor)&&pendingNext!==0)throw new RangeError('Pending procedural actor23/24/25 must supply its evaluator return0');
  if(next>=0)s.animationFrame=next;
  if(pendingNext>=0&&s.holdFrame===0)s.pendingAnimationFrame=pendingNext;
  s.blendProgress=F(s.blendProgress+s.blendStep);
  if(s.blendProgress>=1){
   s.actorState=s.pendingActor;s.animationFrame=s.pendingAnimationFrame;s.pendingActor=-1;s.blendProgress=0;
   effects.push(initialization(s,s.actorState));
  }
 }else if(actionActors.has(s.actorState)){
  const mode=integer(physicalMode,'physicalMode',0,1),prepared=prepareNativeRiderActionPoseCompletion(
   {actorState:s.actorState,animationFrame:s.animationFrame,physicalMode:mode},{nextAnimationFrame:next},poseCompletion);
  s.animationFrame=prepared.animationFrame;
  if(prepared.jointTypeWrites.length||prepared.physicalMode!==mode)effects.push({kind:'updateRiderPhysicalState',
   jointTypeWrites:prepared.jointTypeWrites.map(q=>({...q})),physicalMode:prepared.physicalMode});
  effects.push(...prepared.effects);
  const r=prepared.actorRequest;
  if(r)actorRequest=request(s,effects,r.actorState,r.animationFrame,r.blend,r.holdFrame);
 }else if(next<0){
  actorRequest=request(s,effects,22,0,.15,0);
 }else if(s.actorState===15){
  const phase=integer(phase650,'phase650');
  if(phase===2||phase===3)s.animationFrame=next;
 }else if(s.actorState===7){
  // The>=77 branch skips the source56 damping-restoration branch entirely.
  if(next>=77)actorRequest=request(s,effects,22,0,.15,0);
  else if(next>=56&&s.crashDampingLatch){
   effects.push({kind:'restoreHullDamping',pointCount:12,dampingNative:[...s.hullDamping]});s.crashDampingLatch=false;
  }
  s.animationFrame=next+(s.recoveryInputLock===0&&((pressed|released)&0xa000)!==0?1:0);
 }else s.animationFrame=next;
 const completed=result(s,effects,actorRequest,'ready');
 return poseCompletion===undefined?completed:freeze({...completed,actionWrites:actorRequest?{idleFramesC6c:0}:{}});
}

/** Detached values for an effect recipe; the integration layer applies them
 * ONCE in effects order. XYZ arrays contain actual native point velocities or
 * rider stored deltas. Float32 operation order matches the source consumers. */
export function nativeRecoveryEffectValues(effect,{hullVelocitiesNative,riderDeltasNative}={}){
 if(!effect||typeof effect!=='object')throw new TypeError('A recovery effect is required');
 if(effect.kind==='crashHullKick'){
  const normal=vector(effect.normal,'effect.normal'),velocities=array(hullVelocitiesNative,12,'hullVelocitiesNative',vector);
  return freeze({hullDamping:Array(12).fill(F(.999)),hullVelocitiesNative:velocities.map(v=>{
   const dot=F(F(F(normal.x*v.x)+F(normal.y*v.y))+F(normal.z*v.z)),negative=F(dot*F(-1));
   return Object.fromEntries(axes.map(k=>[k,number(F(F(v[k]*F(1.5))+F(negative*normal[k])),`kick velocity.${k}`)]));
  })});
 }
 if(effect.kind==='restoreHullDamping')return freeze({hullDamping:array(effect.dampingNative,12,'effect.dampingNative',number)});
 if(effect.kind==='clearRiderDeltas')return freeze({riderDeltasNative:Array.from({length:19},()=>({x:0,y:0,z:0}))});
 if(effect.kind==='transformRiderDeltas'){
  const deltas=array(riderDeltasNative,19,'riderDeltasNative',vector),forward=effect.subtractForwardNative?vector(effect.subtractForwardNative,'effect.subtractForwardNative'):null;
  boolean(effect.clearNegativeY,'effect.clearNegativeY');
  return freeze({riderDeltasNative:deltas.map(v=>{
   const out={x:F(v.x*F(.8)),y:effect.clearNegativeY&&v.y<0?0:v.y,z:F(v.z*F(.8))};
   if(forward)for(const k of axes)out[k]=F(out[k]-forward[k]);
   for(const k of axes)number(out[k],`rider delta.${k}`);return out;
  })});
 }
 if(effect.kind==='initializeRiderActor'){
  if(effect.requiresEquivalentInitializer)throw new RangeError('This actor needs its equivalent source initializer');
  return freeze({riderJointTypes:array(effect.jointTypes,19,'effect.jointTypes',(v,name)=>integer(v,name,0,5)),
   riderPhysicalMode:integer(effect.physicalMode,'effect.physicalMode',0,1)});
 }
 if(effect.kind==='updateRiderPhysicalState'){
  if(!Array.isArray(effect.jointTypeWrites))throw new TypeError('jointTypeWrites must be an ordered array');
  return freeze({riderJointTypeWrites:effect.jointTypeWrites.map(q=>({jointIndex:integer(q.jointIndex,'jointIndex',0,18),type:integer(q.type,'joint type',0,5)})),
   riderPhysicalMode:integer(effect.physicalMode,'physicalMode',0,1)});
 }
 if(effect.kind==='actionPoseCue'){
  if(![8,9,17].includes(effect.actorState))throw new RangeError('Unknown action pose cue');
  // This retained event is not an audio/RNG implementation. The integration
  // may consume it explicitly; applying physical recipes advances neither.
  return freeze({});
 }
 throw new RangeError('Unknown recovery effect');
}
