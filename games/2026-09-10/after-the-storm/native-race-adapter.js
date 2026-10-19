import {createNativeHull,createNativeHullFromStart,stepNativeHull,NATIVE_HULL_STEP,nativeHullIntegrationGain} from './native-hull.js';
import {createNativeWaterProfile,createNativeWaterState,applyNativeWaterForces} from './native-water.js';
import {createNativeRiderProfile,prepareNativeRiderFrame,applyNativeTrimForces,
  applyNativeAuxiliaryYawForces,decideNativeRiderAction,applyNativeManipulationForces} from './native-rider-forces.js';
import {createNativeControlState,sampleNativeControls,nativeRiderControlOrigin} from './native-controls.js';
import {prepareNativeTwoPlayerCatchup} from './native-two-player-catchup.js';
import {stepNativeArticulatedRider} from './native-articulated-rider.js';
import {createNativeRiderControlState,prepareNativeRiderControls,finishNativeRiderControls} from './native-rider-controls.js';
import {createNativeImpactState,resetNativeImpacts,recordNativeImpact,nativeImpactSnapshot,nativePreparedIceStability} from './native-impact-state.js';
import {createNativeRiderLifecycle,nativeRiderLifecycleSource,decideNativeRiderLifecycle,finishNativeRiderLifecycle,nativeRiderLifecycleSnapshot} from './native-rider-lifecycle.js';
import {nextNativeDryContactFrames} from './native-race-body-fields.js';
import {prepareNativeFrameKinematics,nativeFrameReferencePoint} from './native-frame-kinematics.js';
import {prepareNativeRiderWaterState} from './native-rider-water-state.js';
import {initialNativeHullWetState,completeNativeHullWetState} from './native-hull-wet-state.js';
import {accumulateNativeStuntArc} from './native-stunt-scoring.js';
import {prepareNativeRiderLanding} from './native-rider-landing.js';
import {prepareNativeHullLandingShape} from './native-hull-landing-shape.js';
import {createNativeRiderActionInputHistory,stepNativeRiderActionInputHistory,
  prepareNativeRiderInversion,finishNativeRiderArcState} from './native-rider-action-dispatch.js';

// Force-profile adapter used by the explicit native race preview. Optional
// riderRecovery owns recovered decision/completion phases with explicit
// equivalent physical poses. Optional riderActions supplies retained gesture/
// idle state and actual scene/RNG context for the additional action actors.
// Original AI scheduling and stunt scoring require separate integration.
// A nonzero source trim, including its nose-up solid-contact override, needs
// the caller's previous-frame physical jointWorld. No substitute joint is made.
// Roll reference and its frame displacement are derived from the hull alone.
//
// Each tick interleaves jet → prepared trim → gravity/roll balance → prepared
// auxiliary yaw → current manipulation → action-gated dry correction → dive K
// override/ordinary K → buoyancy/drag → contacts → point-hull integration.
// Once per five ticks, recovery decides from the completed hull and prior
// solved joint2, then the optional articulated provider supplies physical pose
// targets/history/anchors. Its new joint2 output feeds the NEXT frame.
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
const floatWord=new DataView(new ArrayBuffer(4));
function bitsToFloat(bits){floatWord.setUint32(0,bits);return floatWord.getFloat32(0);}
function floatToBits(value){floatWord.setFloat32(0,value);return floatWord.getUint32(0);}
const articulatedOwners=new WeakMap();
const latchedControlFrames=new WeakMap();
const busyAdapters=new WeakSet();
function adapterOperation(adapter,operation){
  if(busyAdapters.has(adapter))throw new Error('Native adapter operation is not reentrant');
  busyAdapters.add(adapter);try{return operation();}finally{busyAdapters.delete(adapter);}
}
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

const initialAction=()=>({action:0,actionMagnitudeNative:0,diveWetFrames:0,override:0,noWetNoContactFrames:0,arcActive:false,
  turnCount16d4:0,upsideDown16f0:0,previousUpsideDown16f2:0,field15ecBits:0,field16e8:0,field16ec:0});
function actionState(value={},previous=initialAction()){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('actionState must be an object');
  const result={...previous,...value};
  for(const key of Object.keys(value))if(!(key in initialAction()))throw new TypeError(`Unsupported actionState.${key}`);
  integer(result.action,'action',0,4);finite(result.actionMagnitudeNative,'actionMagnitudeNative');
  integer(result.diveWetFrames,'diveWetFrames',0,0x7ffffffe);integer(result.override,'override',0,0xffff);
  integer(result.noWetNoContactFrames,'noWetNoContactFrames',-0x80000000,0x7fffffff);
  integer(result.turnCount16d4,'turnCount16d4',-0x80000000,0x7fffffff);
  for(const name of ['upsideDown16f0','previousUpsideDown16f2'])integer(result[name],name,0,0xffff);
  //15ec has one storage-bit owner. The optional landing path below consumes
  // its arc; adapters without that explicit option retain entry writes only.
  integer(result.field15ecBits,'field15ecBits',0,0xffffffff);
  for(const name of ['field16e8','field16ec'])integer(result[name],name,-0x80000000,0x7fffffff);
  if(typeof result.arcActive!=='boolean')throw new TypeError('arcActive must be boolean');
  return result;
}

const historyFields=['gestureTick15f0','flag1600','sequence15f8','sequence15fa','lastPressedDirections15fc','quietFrames15fe'];
function record(value,name){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must be an explicit record`);
  return value;
}
function onlyKeys(value,keys,name){for(const key of Object.keys(value))if(!keys.includes(key))throw new TypeError(`Unsupported ${name}.${key}`);}
function actionInputHistory(value,directionMask15f6){
  record(value,'riderActions.inputHistory');onlyKeys(value,historyFields,'riderActions.inputHistory');
  const result=createNativeRiderActionInputHistory({...value,directionMask15f6});
  return Object.freeze(Object.fromEntries(historyFields.map(key=>[key,result[key]])));
}
function actionSource(value){
  record(value,'riderActions.source');
  onlyKeys(value,['state650','gestureWindowNative','idleThresholdNative','randomUnsigned32','poseCompletion'],'riderActions.source');
  integer(value.state650,'state650',-0x80000000,0x7fffffff);
  integer(value.gestureWindowNative,'gestureWindowNative',0,0xffffffff);
  integer(value.idleThresholdNative,'idleThresholdNative',-0x80000000,0x7fffffff);
  if(value.randomUnsigned32!==undefined&&typeof value.randomUnsigned32!=='function')throw new TypeError('randomUnsigned32 must be the shared source RNG callback');
  const pose=record(value.poseCompletion,'riderActions.source.poseCompletion');
  onlyKeys(pose,['finished2c2c','record2c24','racerIndex','primaryRacerIndex','gameMode648'],'poseCompletion');
  const poseCompletion={};
  for(const key of ['finished2c2c','record2c24','gameMode648'])poseCompletion[key]=integer(pose[key],key,-0x80000000,0x7fffffff);
  for(const key of ['racerIndex','primaryRacerIndex'])poseCompletion[key]=integer(pose[key],key,0,3);
  return Object.freeze({state650:value.state650,gestureWindowNative:value.gestureWindowNative,
    idleThresholdNative:value.idleThresholdNative,randomUnsigned32:value.randomUnsigned32,poseCompletion:Object.freeze(poseCompletion)});
}
function createRiderActions(value,lifecycle){
  if(value===undefined)return null;
  if(!lifecycle)throw new TypeError('riderActions requires the physical rider lifecycle');
  record(value,'riderActions');onlyKeys(value,['inputHistory','idleFramesC6c','idleChoice16c4','source'],'riderActions');
  const history=actionInputHistory(value.inputHistory,0);
  integer(value.idleFramesC6c,'idleFramesC6c',-0x80000000,0x7fffffff);
  integer(value.idleChoice16c4,'idleChoice16c4',-0x80000000,0x7fffffff);
  // No ROM reset history, scene, or per-craft RNG is inferred. Function
  // providers are captured once at the same input boundary as the controller.
  const source=typeof value.source==='function'?value.source:actionSource(value.source);
  return {inputHistory:history,idleFramesC6c:value.idleFramesC6c,idleChoice16c4:value.idleChoice16c4,source};
}
function createRiderLanding(value,actions,hull){
  if(value===undefined)return null;
  if(!actions)throw new TypeError('riderLanding requires the physical action and record owners');
  record(value,'riderLanding');onlyKeys(value,['landingTicks','localPointsNative'],'riderLanding');
  integer(value.landingTicks,'landingTicks',-32768,32767);
  const local=value.localPointsNative;
  const native=p=>Object.fromEntries(['x','y','z'].map(k=>[k,p[k]/hull.scale]));
  prepareNativeHullLandingShape({pointsNative:hull.points.map(p=>native(p.position)),localPointsNative:local,centerNative:native(hull.center),frame:hull.frame});
  return {landingTicks:value.landingTicks,localPointsNative:local.map(p=>({...p}))};
}
function riderActionSnapshot(adapter){
  const actions=adapter.riderActions;
  return actions?{inputHistory:{...actions.inputHistory,directionMask15f6:adapter.controlState.directionMask},
    action16f4:adapter.actionState.override,idleFramesC6c:actions.idleFramesC6c,idleChoice16c4:actions.idleChoice16c4}:null;
}
function sourceSettings(value={}){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('sourceState must be an object or frame provider');
  const result={actorState:value.actorState??22,animationFrame:value.animationFrame??0,
    simulationState:value.simulationState??3,crash:value.crash??false,contactMode:value.contactMode??0,
    weed2c50:integer(value.weed2c50??0,'weed2c50',-2147483648,2147483647)};
  integer(result.actorState,'actorState',-1,255);integer(result.animationFrame,'animationFrame',0,65535);
  integer(result.simulationState,'simulationState',0,3);
  integer(result.contactMode,'contactMode',0,65535);
  if(typeof result.crash!=='boolean')throw new TypeError('crash must be boolean');
  return {...result,...(value.actionState===undefined?{}:{actionState:value.actionState}),
    ...(value.catchup===undefined?{}:{catchup:structuredClone(value.catchup)}),
    ...(Object.hasOwn(value,'phase650')?{phase650:integer(value.phase650,'phase650',-0x80000000,0x7fffffff)}:{}),
    ...(Object.hasOwn(value,'sourceTick')?{sourceTick:integer(value.sourceTick,'sourceTick',0,0xffffffff)}:{})};
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
 * Optional sourceTick is the actual shared unsigned input clock. A provider
 * can supply its current value for all selected racers, including a retained
 * nonzero epoch. Omission uses the preview's logical-frame clock; no epoch is
 * inferred from restored gesture history or advanced by snapshot/render calls.
 * Active unblended actor15 requires signed sourceState.phase650, captured with
 * the controls for its completion after tick5. The existing riderActions
 * source.state650 can supply that same word; two explicit writers must agree.
 * Source simulation648 is independent and is never a phase650 fallback.
 * controlOrigin is the default caller-owned INPUT DISPATCH, separate from the
 * human identity and computer physics profile. Trusted frame options may
 * explicitly change it for a source takeover without resetting input history.
 * AI samples require raw controls and a supplied binary32 basePowerFactor,
 * skipping only the final human stick curve. Input payloads/sourceState/pose
 * hooks cannot select a different origin implicitly. This prerequisite does
 * not implement an AI producer or navigation. computerProfile selects the
 * separate recovered physical coefficient branch; input takeover never
 * changes that constructor choice.
 * sourceAIInput enables source input dispatch and requires a physical lifecycle.
 * With default origin ai, the computer slot calls616B0 directly on every frame.
 * With default origin human,61708 calls this producer only for a negative
 * lifecycle.selectionCountdown; nonnegative values poll input normally.
 * The producer receives(hull,context)
 * and must return raw AI controls, retained basePowerFactor and any16f4 write.
 * Context includes the captured source scene, countdown and prior controls.
 * The caller owns the actual AI driver/context/history; no fallback producer,
 * device record, zero history or scene-derived takeover is synthesized here.
 * Without this option the existing explicit input dispatch remains available
 * for prepared fixtures and callers which already own source scheduling.
 * riderActions opts into the additional gesture/idle actor path. Supply the
 * six retained inputHistory fields (directionMask15f6 has one control owner),
 * signed idleFramesC6c/idleChoice16c4, and source object/provider containing
 * state650, gestureWindowNative, idleThresholdNative, poseCompletion and an
 * optional actual shared randomUnsigned32 callback. poseCompletion contains
 * finished2c2c/record2c24/gameMode648 signed words and racerIndex/primaryRacerIndex
 * slots0..3. No source initialization or scene values are guessed.
 * riderLanding additionally supplies retained signed16 landingTicks and the
 * caller's twelve localPointsNative for51EC0 repair. It requires riderActions.
 * The source last-tick50/54/58 displacement owns arc translation removal;
 * physicalMode157c (not contactMode) owns the recovered landing classification.
 * riderWaterQuery supplies the pure source scalar plane in native units. When
 * supplied, every completed frame owns C84/C86 after the physical rider pose,
 * including simulation0. Source hosts supply it for every racer, before water
 * evolution; audio consumes the completed fields without another rider query.
 */
export function createNativeRaceAdapter({riderIndex=0,tuneB6c=0,tuneB70=0,tuneB74=0,
  position,velocity,heading=0,pitch=0,roll=0,scale=.025,surface=0,contacts={},jointWorld,
  contactFactor=1,powerSteps=5,sourceState={},articulatedRider,riderPose,riderRecovery,riderActions,riderLanding,riderWaterQuery,controlOrigin='human',computerProfile=false,hullStart,sourceAIInput}={}){
  if(controlOrigin!=='human'&&controlOrigin!=='ai')throw new RangeError('controlOrigin must be human or ai');
  if(typeof computerProfile!=='boolean')throw new TypeError('computerProfile must be boolean');
  if(riderWaterQuery!==undefined&&typeof riderWaterQuery!=='function')throw new TypeError('riderWaterQuery must supply the source scalar plane');
  range(contactFactor,'contactFactor',0,1);range(powerSteps,'powerSteps',0,5);hookSet(contacts);
  if(jointWorld!==undefined&&typeof jointWorld!=='function')vector(jointWorld,'jointWorld');
  if(hullStart!==undefined&&velocity&&[velocity.x,velocity.y,velocity.z].some(v=>v!==0))throw new RangeError('Prepared native startup clears velocity');
  const hull=hullStart!==undefined?createNativeHullFromStart({prepared:hullStart,scale,rider:riderIndex,computerProfile}):
    createNativeHull({position,velocity,heading,pitch,roll,scale,rider:riderIndex,computerProfile});
  const profile=createNativeWaterProfile({riderIndex,tuneB6c,tuneB70,tuneB74,computerProfile});
  const water=createNativeWaterState(profile),rider=createNativeRiderProfile({riderIndex}),impacts=createNativeImpactState();
  const riderControlState=createNativeRiderControlState({baseLateralRetention:profile.waterLateralRetention,baseRollBalance:profile.rollBalance});
  const source=typeof sourceState==='function'?{}:sourceSettings(sourceState),action=actionState(source.actionState);
  if(articulatedRider!==undefined){
    if(articulatedRider?.points?.length!==19||articulatedRider.scale!==scale)throw new TypeError('articulatedRider must be a nineteen-point rider at the hull scale');
    vector(articulatedRider.jointWorld,'physical jointWorld');
    if(typeof riderPose!=='function')throw new TypeError('articulatedRider requires a riderPose provider');
    if(jointWorld!==undefined)throw new TypeError('Use articulatedRider or explicit jointWorld, not both');
    if(articulatedOwners.has(articulatedRider))throw new Error('An articulated rider belongs to one adapter');
  }else if(riderPose!==undefined)throw new TypeError('riderPose requires an articulatedRider');
  if(riderRecovery!==undefined&&(!articulatedRider||!riderRecovery||typeof riderRecovery!=='object'))throw new TypeError('riderRecovery requires a physical rider and explicit course settings');
  if(riderRecovery)for(const key of Object.keys(riderRecovery))if(!['courseDatumNative','raceFinished','state','physicalMode'].includes(key))throw new TypeError(`Unsupported riderRecovery.${key}`);
  const lifecycle=riderRecovery===undefined?null:createNativeRiderLifecycle({...riderRecovery,hull,rider:articulatedRider});
  if(sourceAIInput!==undefined&&(typeof sourceAIInput!=='function'||!lifecycle))
    throw new TypeError('sourceAIInput requires a producer and physical rider lifecycle');
  const actions=createRiderActions(riderActions,lifecycle);
  const landing=createRiderLanding(riderLanding,actions,hull);
  if(landing)finite(bitsToFloat(action.field15ecBits),'retained landing arc');
  if(articulatedRider)articulatedOwners.set(articulatedRider,hull);
  // The source reset seeds aggregate wet state to8/true before later water
  // samples establish point bits. Rear wet flags remain independently false.
  const wetState=initialNativeHullWetState();water.wetCount=wetState.wetCountC78;water.anyWet=wetState.wetFlagC7c!==0;
  const adapter={hull,water,wetState,rider,riderControlState,impacts,controlState:createNativeControlState(),surface,contacts,jointWorld,
    sourceState:typeof sourceState==='function'?sourceState:{...(lifecycle?sourceState:source),actionState:undefined},
    actionState:action,articulatedRider,riderPose,riderLifecycle:lifecycle,riderActions:actions,riderLanding:landing,
    riderWaterState:Object.freeze({bodyC84:0,bodyC86:0}),
    contactFactor,powerSteps,remainder:0,logicalFrames:0,stepsLast:0,frame:null,
    preparedHullTick:null,pendingFrameCompletion:false,inactiveTicks:0,
    objectHitKind16d8:0,contactWindow:contactsZero(),contactDriveFrames:0,dryContactFrames16d0:0,lastControls:null,
    lastFrame:{objectHitKind16d8:0,logicalFrame:0,clockUnits:0,frameDisplacementNative:vec(),frameDisplacementChangeNative:vec(),frameSpeedNative:0,maxFrameSpeedNative:0,
      hudSpeed:0,referencePositionNative:nativeFrameReferencePoint(Object.fromEntries(['x','y','z'].map(k=>[k,hull.center[k]/scale])),hull.frame.up,hull.frame.forward),
      referenceDisplacementNative:vec(),referenceChangeNative:vec(),
      wetCount:8,anyWet:true,wetState,contacts:contactsZero(),impacts:nativeImpactSnapshot(impacts),actorState:lifecycle?.state.actorState??source.actorState??22,
      animationFrame:lifecycle?.state.animationFrame??source.animationFrame??0,actionState:{...action},jointWorld:articulatedRider?copy(articulatedRider.jointWorld):null,
      ...(lifecycle?{recovery:nativeRiderLifecycleSnapshot(lifecycle)}:{})}};
  if(actions)adapter.lastFrame.riderActions=riderActionSnapshot(adapter);
  Object.defineProperties(adapter,{controlOrigin:{value:controlOrigin,enumerable:true},computerProfile:{value:computerProfile,enumerable:true},
    sourceAIInput:{value:sourceAIInput,enumerable:true},riderWaterQuery:{value:riderWaterQuery,enumerable:true},
    sampledHullTick:{get:()=>latchedControlFrames.get(adapter)?.hullTick??null,enumerable:true}});return adapter;
}

function nativeInput(input,origin){
  if(!input||typeof input!=='object')throw new TypeError('Expected race controls');
  if(origin!=='human'&&origin!=='ai')throw new RangeError('controlOrigin must be human or ai');
  if(input.controlOrigin!==undefined&&input.controlOrigin!==origin)throw new RangeError('Input controlOrigin must match its adapter');
  const raw=['rawXNative','rawYNative','heldButtons'].some(k=>input[k]!==undefined);
  if(origin==='ai'&&!raw)throw new TypeError('AI adapters require raw native controls and basePowerFactor');
  const role={controlOrigin:origin,...(input.basePowerFactor===undefined?{}:{basePowerFactor:input.basePowerFactor})};
  if(raw){
    if(['steer','trim','throttle'].some(k=>input[k]!==undefined))throw new TypeError('Use either normalized race controls or raw native controls');
    return {...role,rawXNative:input.rawXNative??0,rawYNative:input.rawYNative??0,heldButtons:input.heldButtons??0};
  }
  const steer=range(input.steer??0,'steer',-1,1),trim=range(input.trim??0,'trim',-1,1);
  const throttle=input.throttle??false;
  if(typeof throttle!=='boolean')range(throttle,'throttle',0,1);
  return {...role,rawXNative:-Math.trunc(70*steer)||0,rawYNative:Math.trunc(70*trim)||0,
    heldButtons:throttle>0?0x8000:0};
}

function sampleFrameControls(adapter,input,options){
  const {hull,lastFrame,logicalFrames}=adapter;
  // Preserve the explicit caller's established poll order. The source wrapper
  // must inspect its lifecycle before polling either producer, and must never
  // read human input on the AI branch (including invalid/disconnected input).
  let requested=adapter.sourceAIInput?undefined:typeof input==='function'?input(logicalFrames*H*FRAME_TICKS,logicalFrames):input;
  const previousContacts={...lastFrame.contacts};
  const frameContext={logicalFrame:logicalFrames,time:logicalFrames*H*FRAME_TICKS,
    previousContacts,previousFrame:lastFrame,previousAction:{...adapter.actionState}};
  const sourceProvider=options.sourceState??adapter.sourceState;
  const requestedSource=typeof sourceProvider==='function'?sourceProvider(hull,frameContext):sourceProvider;
  const suppliedSource=sourceSettings(requestedSource);
  // The lifecycle's preceding completed actor controls all FIVE current hull
  // ticks. A later collision decision never rewrites this sampled force frame.
  const lifecycleSource=adapter.riderLifecycle?nativeRiderLifecycleSource(adapter.riderLifecycle):null;
  if(lifecycleSource)for(const key of ['actorState','animationFrame','crash','contactMode']){
    if(Object.hasOwn(requestedSource,key)&&requestedSource[key]!==lifecycleSource[key])throw new Error(`The rider lifecycle owns sourceState.${key}`);
  }
  const source=lifecycleSource?{...suppliedSource,...lifecycleSource}:suppliedSource;
  const oldAction=actionState(source.actionState,adapter.actionState);
  let origin=options.controlOrigin===undefined?adapter.controlOrigin:options.controlOrigin;
  if(adapter.sourceAIInput){
    const selectionCountdown=adapter.riderLifecycle.state.selectionCountdown;
    //665B0 dispatches computer slots directly to616B0. Only61708's human
    // branch reads1446; a computer's result/start countdown cannot select a device.
    origin=adapter.controlOrigin==='ai'?'ai':nativeRiderControlOrigin(selectionCountdown);
    if(options.controlOrigin!==undefined&&options.controlOrigin!==origin)
      throw new Error(adapter.controlOrigin==='ai'?'The source computer slot owns controlOrigin':'The source rider countdown owns controlOrigin');
    requested=origin==='ai'?adapter.sourceAIInput(hull,{...frameContext,source:{...source},selectionCountdown,
      previousControls:adapter.lastControls?structuredClone(adapter.lastControls):null}):
      typeof input==='function'?input(logicalFrames*H*FRAME_TICKS,logicalFrames):input;
  }
  const inputFields=nativeInput(requested,origin);
  // AI preparation returns16f4 beside its raw controls. Transport that exact
  // word through the same owner used by pre-hull manipulation and post-hull
  // actor dispatch; a second explicit writer must agree at this boundary.
  if(Object.hasOwn(requested,'action16f4')){
    const word=integer(requested.action16f4,'action16f4',0,0xffff);
    if(source.actionState&&Object.hasOwn(source.actionState,'override')&&source.actionState.override!==word)
      throw new Error('Input action16f4 conflicts with sourceState.actionState.override');
    oldAction.override=word;
  }
  const sampled=sampleNativeControls(adapter.controlState,{...inputFields,tick:source.sourceTick??logicalFrames>>>0,...source});
  frameContext.controls=sampled;frameContext.actorState=source.actorState;
  let actionHistory=null,capturedActionSource=null;
  if(adapter.riderActions){
    const history=stepNativeRiderActionInputHistory({...adapter.riderActions.inputHistory,
      directionMask15f6:adapter.controlState.directionMask},{actorState:source.actorState,
      rawXNative:sampled.rawXNative,rawYNative:sampled.rawYNative,preCurveYNative:sampled.preCurveYNative,
      heldButtonsB56:sampled.heldButtons,engineMaskC66:sampled.engineMask,tick:sampled.state.tick});
    if(history.state.directionMask15f6!==sampled.directionMask||history.pressedDirections15f4!==sampled.pressedDirections)
      throw new Error('Native input and action history disagree on directionMask15f6');
    actionHistory=Object.freeze(Object.fromEntries(historyFields.map(key=>[key,history.state[key]])));
    const provider=adapter.riderActions.source;
    capturedActionSource=actionSource(typeof provider==='function'?provider(hull,frameContext):provider);
  }
  // Ordinary665B0 completes every rider before79528/F03E0 and the i1 stage
  // can change650. Capture its actual input word with this frame's controls;
  // never reread a later scene phase or derive it from simulation648.
  if(source.phase650!==undefined&&capturedActionSource&&source.phase650!==capturedActionSource.state650)
    throw new Error('sourceState.phase650 and riderActions.source.state650 must share the actual scene owner');
  const phase650=source.phase650??capturedActionSource?.state650;
  if(adapter.riderLifecycle&&source.actorState===15&&source.simulationState!==0&&adapter.riderLifecycle.state.blendProgress===0)
    integer(phase650,'active actor15 phase650',-0x80000000,0x7fffffff);
  return {hullTick:hull.ticks,previousContacts,frameContext,source,oldAction,sampled,actionHistory,capturedActionSource,phase650};
}

function beginFrame(adapter,input,options){
  const {hull,water,lastFrame,logicalFrames}=adapter;
  const latched=latchedControlFrames.get(adapter);
  if(latched&&latched.hullTick!==hull.ticks)throw new Error('Native controls must share their sampled hull boundary');
  if(latched&&options.controlOrigin!==undefined&&options.controlOrigin!==latched.sampled.controlOrigin)
    throw new Error('Native controlOrigin is already latched for this frame');
  const {previousContacts,frameContext,source,oldAction,sampled,actionHistory,capturedActionSource,phase650}=latched??sampleFrameControls(adapter,input,options);
  const physicalControls=prepareNativeRiderControls(adapter.riderControlState,{heldButtons:sampled.heldButtons,
    pressedButtons:sampled.pressedButtons,actorState:source.actorState,riderIndex:adapter.rider.riderIndex,
    wet:water.anyWet,contactMode:source.contactMode});
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
  const inversion=prepareNativeRiderInversion(oldAction,{actorState:source.actorState,upY:hull.frame.up.y});
  const decision=decideNativeRiderAction(adapter.rider,{...oldAction,actorState:source.actorState,
    rawXNative:sampled.rawXNative,rawYNative:sampled.rawYNative,wetCount:water.wetCount,
    frameSpeedNative:lastFrame.frameSpeedNative,throttle:sampled.throttle,tick:sampled.state.tick,
    gestureTicks:sampled.gestureTicks,floorContact:previousContacts.floorImpactNative>0,
    boxContact:previousContacts.boxImpactNative>0});
  const nextAction={...oldAction,...inversion,action:decision.action,actionMagnitudeNative:decision.actionMagnitudeNative,
    diveWetFrames:decision.diveWetFrames,override:decision.override};
  if(decision.entered){
    if(!nextAction.arcActive){nextAction.noWetNoContactFrames=0;nextAction.turnCount16d4=0;nextAction.field15ecBits=0;}
    nextAction.arcActive=true;
    if(decision.action!==3){nextAction.field16e8=3;nextAction.field16ec=0;}
  }
  const forceControls={...sampled,conditionedXNative:sampled.workingXNative,conditionedYNative:sampled.workingYNative,
    workingXNative:decision.muteSteering?0:sampled.workingXNative,workingYNative:decision.muteTrim?0:sampled.workingYNative};
  let catchup=null;
  if(source.catchup){
    const q=source.catchup;
    integer(q.checkpointClock2c4,'checkpointClock2c4',-2147483648,2147483647);
    if(q.players===2&&q.enabled4970!==0&&q.checkpointClock2c4!==0){
      const F=Math.fround,p=water.profile,speed=F(lastFrame.frameSpeedNative),threshold=F(p.steeringSlowFrameSpeed);
      const steering=speed>=threshold?F(p.steeringDegrees):
        F(F(F(F(1-F(speed/threshold))*F(p.steeringSlowGain))+1)*F(p.steeringDegrees));
      catchup=prepareNativeTwoPlayerCatchup({...q,riderIndex:hull.rider,
        powerFactor1578:sampled.powerFactor,steeringDegrees1588:steering});
      forceControls.powerFactor=catchup.powerFactor;
      forceControls.steeringDegreesOverride=catchup.steeringDegrees;
    }
  }
  // Everything that may reject missing trim input precedes these mutations.
  hull.integrationGain=nativeHullIntegrationGain(source.weed2c50);
  adapter.controlState=sampled.state;adapter.lastControls=forceControls;adapter.actionState=nextAction;
  if(adapter.riderLanding&&decision.landingPending)adapter.riderLanding.landingTicks=-1;
  if(actionHistory)adapter.riderActions.inputHistory=actionHistory;
  latchedControlFrames.delete(adapter);
  adapter.riderControlState=physicalControls.state;
  adapter.frame={iceStabilityNative:nativePreparedIceStability(adapter.rider.riderIndex,source.actorState),startCenter:copy(hull.center),prepared,
    controls:forceControls,physicalControls,previousContacts,action:decision,actorState:source.actorState,
    simulationState:source.simulationState,animationFrame:source.animationFrame,riderPose:poseProvider,
    actionHistory,actionSource:capturedActionSource,phase650,catchup,weed2c50:source.weed2c50};
  resetNativeImpacts(adapter.impacts,{simulationState:source.simulationState});
  if(source.simulationState!==0)adapter.contactWindow=contactsZero();
}

function endFrame(adapter,beforeActorDecision){
  const {hull,water,frame,lastFrame,contactWindow}=adapter,s=hull.scale;
  adapter.wetState=completeNativeHullWetState(adapter.wetState.wetFlagC7c,water.wet.map(Number));
  water.wetCount=adapter.wetState.wetCountC78;water.anyWet=adapter.wetState.wetFlagC7c!==0;
  adapter.dryContactFrames16d0=nextNativeDryContactFrames(adapter.dryContactFrames16d0,{anyWet:water.anyWet,impacts:adapter.impacts});
  const inactive=frame.simulationState===0;
  // Preserve the actual completed reference history and original binary32
  // stores. Recomputing a new starting reference each frame loses that owner.
  const nativePosition=p=>Object.fromEntries(['x','y','z'].map(k=>[k,p[k]/s]));
  const motion=prepareNativeFrameKinematics({displacementNative:lastFrame.frameDisplacementNative,
    displacementChangeNative:lastFrame.frameDisplacementChangeNative,speedNative:lastFrame.frameSpeedNative,maxSpeedNative:lastFrame.maxFrameSpeedNative,
    referencePositionNative:lastFrame.referencePositionNative,referenceDisplacementNative:lastFrame.referenceDisplacementNative,
    referenceChangeNative:lastFrame.referenceChangeNative,contactDriveFrames:adapter.contactDriveFrames},
   {simulation648:frame.simulationState,positionNative:nativePosition(hull.center),priorPositionNative:nativePosition(frame.startCenter),
    upNative:hull.frame.up,forwardNative:hull.frame.forward,floorImpactNative:adapter.impacts.floorImpactNative,
    boxImpactNative:adapter.impacts.boxImpactNative,engineMaskC66:frame.controls.engineMask}).state;
  const displacement=motion.displacementNative,speed=motion.speedNative;
  adapter.contactDriveFrames=motion.contactDriveFrames;
  const arc=finishNativeRiderArcState({turnCount16d4:adapter.actionState.turnCount16d4,
    noWetNoContactFrames16dc:adapter.actionState.noWetNoContactFrames,arcActive16e2:Number(adapter.actionState.arcActive)},
    {fieldC7c:adapter.wetState.wetFlagC7c,manipulationAction:adapter.actionState.action,...contactWindow});
  Object.assign(adapter.actionState,{turnCount16d4:arc.turnCount16d4,noWetNoContactFrames:arc.noWetNoContactFrames16dc,
    arcActive:arc.arcActive16e2!==0});
  if(adapter.riderLanding){
    const velocity=i=>Object.fromEntries(['x','y','z'].map(k=>[k,Math.fround(hull.points[i].velocity[k]*H/s)]));
    adapter.actionState.field15ecBits=floatToBits(accumulateNativeStuntArc(bitsToFloat(adapter.actionState.field15ecBits),{
      frontVelocityNative:velocity(4),rearVelocityNative:velocity(1),bodyDeltaNative:hull.sprayMotionNative.centerVelocity,rightY:hull.frame.right.y,
      action:adapter.actionState.action,tracking:adapter.actionState.arcActive,simulationActive:!inactive}));
  }
  adapter.logicalFrames++;
  adapter.lastFrame={logicalFrame:adapter.logicalFrames,clockUnits:adapter.logicalFrames*50,
    frameDisplacementNative:displacement,frameDisplacementChangeNative:motion.displacementChangeNative,frameSpeedNative:speed,maxFrameSpeedNative:motion.maxSpeedNative,
    hudSpeed:inactive?lastFrame.hudSpeed:Math.trunc(Math.fround(Math.trunc(Math.fround(speed))*Math.fround(1.8))),
    referencePositionNative:motion.referencePositionNative,referenceDisplacementNative:motion.referenceDisplacementNative,referenceChangeNative:motion.referenceChangeNative,
    wetCount:water.wetCount,anyWet:water.anyWet,wetState:adapter.wetState,contacts:{...contactWindow},impacts:nativeImpactSnapshot(adapter.impacts),objectHitKind16d8:adapter.objectHitKind16d8,
    actorState:frame.actorState,animationFrame:frame.animationFrame,actionState:{...adapter.actionState},jointWorld:frame.prepared.jointWorld?copy(frame.prepared.jointWorld):null};
  if(beforeActorDecision)beforeActorDecision();
  const actions=adapter.riderActions,actionSource=frame.actionSource;
  const actionDispatch=actions?{state:{action16f4:adapter.actionState.override,idleFramesC6c:actions.idleFramesC6c,
    idleChoice16c4:actions.idleChoice16c4},history:frame.actionHistory,tick:frame.controls.state.tick,
    state650:actionSource.state650,gestureWindowNative:actionSource.gestureWindowNative,
    idleThresholdNative:actionSource.idleThresholdNative,randomUnsigned32:actionSource.randomUnsigned32}:undefined;
  const decision=adapter.riderLifecycle?decideNativeRiderLifecycle(adapter.riderLifecycle,{completedFrame:adapter.lastFrame,
    simulationState:frame.simulationState,controls:frame.controls,manipulationAction:adapter.actionState.action,actionDispatch}):null;
  if(decision?.actionWrites){
    adapter.actionState.override=decision.actionWrites.action16f4;
    actions.idleFramesC6c=decision.actionWrites.idleFramesC6c;actions.idleChoice16c4=decision.actionWrites.idleChoice16c4;
  }
  let postControls;
  if(adapter.articulatedRider&&!inactive&&!decision?.skipped){
    const pose=frame.riderPose(hull,{logicalFrame:adapter.logicalFrames-1,physicalFrame:adapter.articulatedRider.logicalFrames,time:hull.simulationTime,
      controls:frame.controls,actorState:decision?.state.actorState??frame.actorState,
      animationFrame:decision?.state.animationFrame??frame.animationFrame,
      poseRequest:decision?.poseRequest??null,recoveryState:decision?.state??null,
      actionPoseState:actions?{idleChoice16c4:actions.idleChoice16c4,alternate16cc:decision.state.alternateStumble}:undefined,
      action:frame.action,completedFrame:adapter.lastFrame});
    if(adapter.riderLifecycle){
      if(!pose.animationOutcome)throw new TypeError('Recovery requires an explicit equivalent pose evaluator outcome');
      const completion=finishNativeRiderLifecycle(adapter.riderLifecycle,pose.animationOutcome,frame.controls,actionSource?.poseCompletion,{phase650:frame.phase650});
      if(actions&&completion.actionWrites?.idleFramesC6c!==undefined)actions.idleFramesC6c=completion.actionWrites.idleFramesC6c;
    }
    // A lifecycle-aware provider evaluates both poses purely, then resolves
    // auxiliary anchors ONCE after the completion/initializer effects.
    const anchors=pose.resolveAnchors?pose.resolveAnchors({mode:adapter.riderLifecycle?.physicalMode}):pose.anchors;
    postControls=finishNativeRiderControls(adapter.riderControlState,{targets:pose.targets,center:hull.center,up:hull.frame.up,scale:s});
    let manipulationDeltas=postControls.manipulationDeltas;
    if(pose.manipulationDeltas!==undefined){
      if(!Array.isArray(pose.manipulationDeltas)||pose.manipulationDeltas.length!==19)throw new TypeError('Pose manipulationDeltas must contain nineteen vectors');
      manipulationDeltas=manipulationDeltas.map((p,i)=>{
        const q=vector(pose.manipulationDeltas[i],`manipulationDeltas[${i}]`);return vec(p.x+q.x,p.y+q.y,p.z+q.z);
      });
    }
    stepNativeArticulatedRider(adapter.articulatedRider,{...pose,anchors,
      ...(adapter.riderLifecycle?{types:adapter.articulatedRider.points.map(p=>p.type)}:{}),
      targets:postControls.targets,manipulationDeltas,center:hull.center,up:hull.frame.up});
    adapter.lastFrame.jointWorld=copy(adapter.articulatedRider.jointWorld);
  }else postControls=finishNativeRiderControls(adapter.riderControlState,{active:!inactive&&!decision?.skipped});
  adapter.riderControlState=postControls.state;
  const c=frame.physicalControls;
  adapter.lastFrame.physicalControls={gravityNative:c.gravityNative,lateralRetention:c.lateralRetention,rollBalance:c.rollBalance,
    crouchFactor:c.crouchFactor,enteredCrouch:c.enteredCrouch,nextCrouchFactor:postControls.state.crouchFactor};
  if(adapter.riderLifecycle){
    const final=adapter.riderLifecycle.state;
    adapter.lastFrame.controlActorState=frame.actorState;adapter.lastFrame.controlAnimationFrame=frame.animationFrame;
    adapter.lastFrame.actorState=final.actorState;adapter.lastFrame.animationFrame=final.animationFrame;
    adapter.lastFrame.recovery=nativeRiderLifecycleSnapshot(adapter.riderLifecycle);
  }
  if(adapter.riderWaterQuery){
    adapter.riderWaterState=prepareNativeRiderWaterState(adapter.riderWaterState,{actorState:adapter.lastFrame.actorState,
      jointWorld:adapter.articulatedRider?.jointWorld,scale:s,queryNative:adapter.riderWaterQuery});
    adapter.lastFrame.riderWater=adapter.riderWaterState;
  }
  if(adapter.riderLanding){
    const final=adapter.riderLifecycle.state,record=actionSource.poseCompletion;
    const result=prepareNativeRiderLanding({landingTicks:adapter.riderLanding.landingTicks,arcNative:bitsToFloat(adapter.actionState.field15ecBits)},
      {actorState:final.actorState,animationFrame:final.animationFrame,action:adapter.actionState.action,wetCount:water.wetCount,anyWet:water.anyWet,
       airborneFrames:adapter.actionState.noWetNoContactFrames,floorContact:contactWindow.floorImpactNative!==0,boxContact:contactWindow.boxImpactNative!==0,
       recoveryState:adapter.riderLifecycle.physicalMode,crash:final.crashCountdown!==0,partial:final.stumbleCountdown!==0,upY:hull.frame.up.y,
       racerIndex:record.racerIndex,primaryRacerIndex:record.primaryRacerIndex});
    adapter.riderLanding.landingTicks=result.landingTicks;
    adapter.actionState.field15ecBits=floatToBits(result.arcNative);
    if(result.settled){
      const repair=prepareNativeHullLandingShape({pointsNative:hull.points.map(p=>Object.fromEntries(['x','y','z'].map(k=>[k,p.position[k]/s]))),
       localPointsNative:adapter.riderLanding.localPointsNative,centerNative:Object.fromEntries(['x','y','z'].map(k=>[k,hull.center[k]/s])),frame:hull.frame});
      if(repair.reset)repair.pointsNative.forEach((p,i)=>{for(const k of ['x','y','z'])hull.points[i].position[k]=p[k]*s;});
      result.hullReset=repair.reset;
    }
    adapter.lastFrame.landing=result;
  }
  adapter.lastFrame.actionState={...adapter.actionState};
  if(actions)adapter.lastFrame.riderActions=riderActionSnapshot(adapter);
}

/** Source input/61184 phase, before any rider's63c88 force preparation. The
 * explicit call consumes input history and captures the shared16f4 request
 * once, without touching physical forces, impacts, hull points or rider solves.
 * A failed later preparation
 * retains that sample; it must not poll the controller again. Standalone
 * prepare still validates its entire implicit preparation before committing.
 */
export function latchNativeRaceAdapterControls(adapter,input={},options={}){
  return adapterOperation(adapter,()=>latchControls(adapter,input,options));
}
function latchControls(adapter,input,options){
  if(!adapter?.hull||adapter.hull.ticks%FRAME_TICKS!==0||adapter.pendingFrameCompletion)
    throw new Error('Native control sampling requires a completed outer boundary');
  if(adapter.preparedHullTick===adapter.hull.ticks||latchedControlFrames.has(adapter))throw new Error('Native controls are already sampled or prepared');
  const value=sampleFrameControls(adapter,input,options);
  latchedControlFrames.set(adapter,value);adapter.controlState=value.sampled.state;
  if(value.actionHistory)adapter.riderActions.inputHistory=value.actionHistory;
  adapter.actionState={...adapter.actionState,override:value.oldAction.override};
  adapter.lastControls={...value.sampled,conditionedXNative:value.sampled.workingXNative,conditionedYNative:value.sampled.workingYNative};
  return adapter;
}

/** Prepare without moving points. A multi-craft world samples ALL controls,
 * then prepares ALL riders before its first hull tick. Standalone stepping
 * samples implicitly unless the caller explicitly latched its input already.
 * Repeated preparation would consume input/history twice and is rejected.
 */
export function prepareNativeRaceAdapterFrame(adapter,input={},options={}){
  return adapterOperation(adapter,()=>prepareFrame(adapter,input,options));
}
function prepareFrame(adapter,input,options){
 if(!adapter?.hull||adapter.hull.ticks%FRAME_TICKS!==0||adapter.pendingFrameCompletion)
  throw new Error('Native frame preparation requires a completed outer boundary');
 if(adapter.preparedHullTick===adapter.hull.ticks)throw new Error('Native frame is already prepared');
 beginFrame(adapter,input,options);adapter.preparedHullTick=adapter.hull.ticks;return adapter;
}

/** Complete source65C18 at a simulation0 outer boundary. Controls and63C88
 * preparation still ran, but no hull ticks, contacts, actor advance or physical
 * rider solve occur. Source motion history remains retained, not overwritten0. */
export function completeNativeRaceAdapterInactiveFrame(adapter,{beforeActorDecision}={}){
 if(beforeActorDecision!==undefined&&typeof beforeActorDecision!=='function')throw new TypeError('beforeActorDecision must be a function');
 return adapterOperation(adapter,()=>{
  if(!adapter?.frame||adapter.frame.simulationState!==0||adapter.preparedHullTick!==adapter.hull.ticks||adapter.pendingFrameCompletion||adapter.hull.ticks%FRAME_TICKS!==0)
   throw new Error('Inactive completion requires one prepared simulation0 frame');
  endFrame(adapter,beforeActorDecision);adapter.preparedHullTick=null;adapter.inactiveTicks=0;return adapter;
 });
}

/** Complete a deferred fifth tick after ALL hulls have finished. This runs the
 * nineteen-point rider solve before water/cameras/floating objects advance.
 */
export function completeNativeRaceAdapterFrame(adapter,{beforeActorDecision}={}){
  if(beforeActorDecision!==undefined&&typeof beforeActorDecision!=='function')throw new TypeError('beforeActorDecision must be a function');
  return adapterOperation(adapter,()=>completeFrame(adapter,beforeActorDecision));
}
function completeFrame(adapter,beforeActorDecision){
 if(!adapter?.pendingFrameCompletion||adapter.hull.ticks%FRAME_TICKS!==0)
  throw new Error('No deferred native frame completion');
 endFrame(adapter,beforeActorDecision);adapter.pendingFrameCompletion=false;if(adapter.frame.simulationState===0){adapter.preparedHullTick=null;adapter.inactiveTicks=0;}return adapter;
}

/**
 * Advance through fixed10ms ticks. dt=0 performs no input sampling. Inputs are
 * normalized {throttle,steer,trim} or explicit {rawXNative,rawYNative,heldButtons}.
 * Optional unsigned action16f4 shares the pre-/post-hull action request word.
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
  return adapterOperation(adapter,()=>stepAdapter(adapter,dt,input,options));
}
function stepAdapter(adapter,dt,input,options){
  range(dt,'dt',0,1);
  if(adapter.pendingFrameCompletion)throw new Error('Complete the deferred native rider frame before stepping');
  if(options.deferFrameCompletion!==undefined&&typeof options.deferFrameCompletion!=='boolean')throw new TypeError('deferFrameCompletion must be boolean');
  const hooks=hookSet(options.contacts??adapter.contacts),surface=options.surface??adapter.surface;
  adapter.stepsLast=0;
  if(dt===0)return adapter;
  const previousRemainder=adapter.remainder,previousTicks=adapter.hull.ticks;
  adapter.remainder+=dt;
  const steps=Math.floor((adapter.remainder+1e-12)/H);
  if(options.deferFrameCompletion&&steps>FRAME_TICKS-(adapter.inactiveTicks||adapter.hull.ticks%FRAME_TICKS)){
    adapter.remainder=previousRemainder;throw new RangeError('Deferred completion stops at the next outer boundary');
  }
  try{
    for(let i=0;i<steps;i++){
      if(adapter.hull.ticks%FRAME_TICKS===0&&adapter.preparedHullTick!==adapter.hull.ticks)prepareFrame(adapter,input,options);
      if(adapter.pendingFrameCompletion)throw new Error('Deferred completion permits no next-frame hull tick');
      if(adapter.frame.simulationState===0){
        adapter.remainder=Math.max(0,adapter.remainder-H);adapter.inactiveTicks++;
        if(adapter.inactiveTicks===FRAME_TICKS){
          if(options.deferFrameCompletion)adapter.pendingFrameCompletion=true;
          else{endFrame(adapter);adapter.preparedHullTick=null;adapter.inactiveTicks=0;}
        }
        continue;
      }
      stepNativeHull(adapter.hull,H,{beforeIntegrate:hull=>{
        const {frame,water,contactWindow}=adapter,c=frame.controls;
        applyNativeWaterForces(hull,water,{surface,throttle:c.throttle,
          stickX:forceAxis(c.workingXNative),stickY:forceAxis(c.workingYNative),
          powerSteps:adapter.powerSteps,powerFactor:c.powerFactor,
          steeringDegreesOverride:c.steeringDegreesOverride,
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
          readBoxContactState:()=>({floorImpactNative:adapter.impacts.floorImpactNative,boxImpactNative:adapter.impacts.boxImpactNative,normalNative:copy(adapter.impacts.normal),markedBox:adapter.impacts.markedBox}),
          readFixedSphereState:()=>({maximum:adapter.impacts.fixedSphereImpactNative,normal:copy(adapter.impacts.normal)}),
          readGenericObjectState:()=>({maximum:adapter.impacts.objectImpactNative,normal:copy(adapter.impacts.normal),hitKind:adapter.objectHitKind16d8,stabilityNative:frame.iceStabilityNative}),
          recordGenericHitKind:kind=>{if(!Number.isInteger(kind)||kind<0||kind>2)throw new RangeError('Invalid generic hit kind');adapter.objectHitKind16d8=kind;},
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
      frameDisplacementChangeNative:copy(lastFrame.frameDisplacementChangeNative),
      referencePositionNative:copy(lastFrame.referencePositionNative),
      referenceDisplacementNative:copy(lastFrame.referenceDisplacementNative),
      referenceChangeNative:copy(lastFrame.referenceChangeNative),contacts:{...lastFrame.contacts},
      impacts:{...lastFrame.impacts,normal:copy(lastFrame.impacts.normal)},
      ...(lastFrame.recovery?{recovery:structuredClone(lastFrame.recovery)}:{}),
      ...(lastFrame.riderActions?{riderActions:structuredClone(lastFrame.riderActions)}:{}),
      ...(lastFrame.landing?{landing:structuredClone(lastFrame.landing)}:{}),
      ...(lastFrame.riderWater?{riderWater:{...lastFrame.riderWater}}:{}),
      ...(lastFrame.physicalControls?{physicalControls:{...lastFrame.physicalControls}}:{}),
      actionState:{...lastFrame.actionState},jointWorld:lastFrame.jointWorld?copy(lastFrame.jointWorld):null},
    simulationTime:hull.simulationTime,remainder:adapter.remainder};
}
