import {createNativeAIMotionState,prepareNativeAIMotion} from './native-ai-motion.js';
import {createNativeAITargetWindow,prepareNativeAITarget} from './native-ai-target.js';
import {prepareNativeAICorrections} from './native-ai-corrections.js';
import {prepareNativeAISteering} from './native-ai-steering.js';
import {nativeAIWaterSamplePoints,prepareNativeAIWaterTrim,nativeAITrafficBlocked,prepareNativeAIButtons,prepareNativeAITail} from './native-ai-actions.js';
import {selectNativeAIPower} from './native-ai-power.js';
import {prepareNativeAIStartInput} from './native-ai-start.js';
import {queryNativeWaterField} from './native-water-field.js';

const F=Math.fround;
function record(v,name){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`${name} must be an explicit record`);return v;}
function integer(v,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} is outside its native integer range`);return v||0;
}
function scalar(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${name} must fit finite float32`);return F(v);}
function boolean(v,name){if(typeof v!=='boolean')throw new TypeError(`${name} must be boolean`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Explicit retained state only: no cold/start/restart history is invented.
 * racerIndex/avatar/role/budget are the source initializer's independent fields.
 * flag94 remains a caller-supplied retained native word; it is NOT the nearby
 * object flag98 or the water-selection-circle flagA4. Shared previous-navigation
 * history belongs to the caller's globals and must pass through racers in the
 * source input order. Restore numeric snapshots through this creator.
 */
export function createNativeAIDriverState(input){
 record(input,'AI driver state');
 const result={racerIndex:integer(input.racerIndex,'racerIndex',0,3),avatar:integer(input.avatar,'avatar',0,3),
  role:integer(input.role,'role',-1,2),turnBudgetDegrees:scalar(input.turnBudgetDegrees,'turnBudgetDegrees'),
  motionState:createNativeAIMotionState(input.motionState),
  courseEscapeFrames:integer(input.courseEscapeFrames,'courseEscapeFrames'),
  courseEscapeActive:boolean(input.courseEscapeActive,'courseEscapeActive'),dryFloorFrames:integer(input.dryFloorFrames,'dryFloorFrames'),
  fieldE0:integer(input.fieldE0,'fieldE0'),flag94:integer(input.flag94,'flag94'),
  lastRawXNative:integer(input.lastRawXNative,'lastRawXNative',-128,127)};
 if(result.turnBudgetDegrees<0)throw new RangeError('turnBudgetDegrees must be nonnegative');
 return freeze(result);
}

/** ONE selected-racer source input-producer sample, before common61184 actor
 * preparation. table is the explicitly selected/initialized source target table;
 * context85eec course-family policy, ALL-racer navigation, initialization/RNG,
 * primary judging/ranking, actors and the world clock remain caller-owned.
 *
 * racers is an ordered source-slot snapshot. Every entry supplies body with
 * positionNative/frameSpeedNative and record.place293c. The selected body also
 * supplies the ORIGINAL motionDirection, forwardNative, rightNative, bodyUpY,
 * steeringDegrees, actorState, pendingActorState, animationFrame,
 * priorControlActive, markedBox15de, fieldC7c, floorImpactNative,
 * impactNormalNative, rawXNative, heldButtons, powerFactor, action16f4 and
 * actionState16d4. Its record adds sourceLap, navigationSourceRow,
 * finished2c2c and record2c24. No browser/HUD/rank aliases are inferred.
 *
 * globals uses original numeric state650/state638/mode620, difficulty,
 * courseIndex, reverse, players, primaryHumanIndex, datumNative, toggleD9914,
 * trainingSelection, previousNavigationGlobal and chargeTimerNative. Geometry
 * supplies the actual selectionCircleNative, selected cameraCornersNative,
 * raw-order proximityObjectCentersNative/proximityCount and optional COMPLETE
 * nodePositionsNative. A gated unusual role needs explicit behindThresholdNative.
 *
 * Driving phase650==3 runs86da8 -> two-pass target -> corrections/steering ->
 * two exact plane-water queries/trim -> conditional traffic/buttons -> power ->
 * action tail. Other phases run only the separate start-input leaf. State and
 * snapshot inputs are copied. Neither water nor any source producer is advanced.
 * The returned action16f4 MUST reach its real action consumer before admission;
 * this function never substitutes a pose or discards an unsupported action.
 */
export function prepareNativeAIDriver(table,state,{globals,racers,geometry,waterField,behindThresholdNative}={}){
 const old=createNativeAIDriverState(state);
 record(globals,'globals');
 if(!Array.isArray(racers)||racers.length<1||racers.length>4)throw new RangeError('Expected one to four ordered source racers');
 integer(old.racerIndex,'racerIndex',0,racers.length-1);
 // Capture the coherent numeric DTO before evaluating any source leaf. The
 // actual read-only lattice and compiled immutable table keep their ownership.
 const snapshot=structuredClone({globals,racers,geometry});
 const g=snapshot.globals,roster=snapshot.racers,own=record(roster[old.racerIndex],'selected racer');
 const body=record(own.body,'selected body'),progress=record(own.record,'selected race record');
 integer(g.state650,'state650');integer(g.courseIndex,'courseIndex',0,8);
 if(table?.courseIndex!==g.courseIndex)throw new RangeError('Selected target table must match the source course');
 const window=createNativeAITargetWindow(table,{avatar:old.avatar,navigationSourceRow:progress.navigationSourceRow});
 if(g.state650!==3){
  const start=prepareNativeAIStartInput({role:old.role,difficulty:g.difficulty,chargeTimerNative:g.chargeTimerNative,heldButtons:body.heldButtons});
  return freeze({state:old,controls:{controlOrigin:'ai',...start,basePowerFactor:scalar(body.powerFactor,'powerFactor')},
   action16f4:integer(body.action16f4,'action16f4',0,65535),globalWrites:{},frame:{phase:'start',window}});
 }
 const geo=record(snapshot.geometry,'source geometry');
 integer(g.primaryHumanIndex,'primaryHumanIndex',0,roster.length-1);
 const primary=record(roster[g.primaryHumanIndex],'primary human'),primaryBody=record(primary.body,'primary human body');
 const primaryRecord=record(primary.record,'primary human race record');
 integer(progress.place293c,'place293c');
 integer(body.markedBox15de,'markedBox15de',-32768,32767);
 const motion=prepareNativeAIMotion(old.motionState,{motionDirection:body.motionDirection,actorState:body.actorState,
  animationFrame:body.animationFrame,priorControlActive:body.priorControlActive,frameSpeedNative:body.frameSpeedNative,
  markedBox:body.markedBox15de!==0,wetCount:body.fieldC7c,positionNative:body.positionNative,
  proximityObjectCentersNative:geo.proximityObjectCentersNative,proximityCount:geo.proximityCount,
  selectionCircleNative:geo.selectionCircleNative,referenceProgress:primaryRecord.place293c,racerProgress:progress.place293c,
  racerIndex:old.racerIndex,players:g.players,difficulty:g.difficulty,role:old.role,courseIndex:g.courseIndex,behindThresholdNative});
 const target=prepareNativeAITarget(table,{avatar:old.avatar,navigationSourceRow:progress.navigationSourceRow,
  positionNativeXZ:body.positionNative,nodePositionsNative:geo.nodePositionsNative,sourceLap:progress.sourceLap});
 const corrections=prepareNativeAICorrections({targetSegment:target.segment,courseIndex:g.courseIndex,reverse:g.reverse,
  positionNative:body.positionNative,sourceLap:progress.sourceLap,courseEscapeFrames:old.courseEscapeFrames,dryFloorFrames:old.dryFloorFrames,
  floorImpactNative:body.floorImpactNative,wetCount:body.fieldC7c,impactNormalXZ:body.impactNormalNative,difficulty:g.difficulty,
  primaryHumanPositionNativeXZ:primaryBody.positionNative,rightXZ:body.rightNative});
 const steering=prepareNativeAISteering({targetDirectionXZ:corrections.targetSegment.directionXZ,forwardXZ:body.forwardNative,rightXZ:body.rightNative,
  predictedDirectionXZ:motion.predictedDirectionXZ,steeringDegrees:body.steeringDegrees,turnBudgetDegrees:old.turnBudgetDegrees,
  previousRawXNative:body.rawXNative,recoveryPhase:motion.state.recoveryPhase,stuckFrames:motion.state.stuckFrames,
  wetCount:body.fieldC7c,impactNormalXZ:body.impactNormalNative});
 const waterPoints=nativeAIWaterSamplePoints({positionNative:body.positionNative,forwardNative:body.forwardNative});
 const waterHeightsNative=waterPoints.map(p=>queryNativeWaterField(waterField,p.x,p.z,{datumNative:g.datumNative}).sourcePlaneQueryNative);
 const trim=prepareNativeAIWaterTrim({positionNative:body.positionNative,forwardNative:body.forwardNative,datumNative:g.datumNative,
  waterHeightsNative,state638:g.state638,mode620:g.mode620,difficulty:g.difficulty,courseIndex:g.courseIndex,fieldC7c:body.fieldC7c,
  flag94:old.flag94,markedBox15de:body.markedBox15de,rawYNative:steering.rawYNative});
 const buttonInput={state638:g.state638,flag98:Number(motion.nearObjects),actorC54:body.actorState,pendingActorC5c:body.pendingActorState,
  record2c24:progress.record2c24,difficulty:g.difficulty,toggleD9914:g.toggleD9914,phase8c:steering.recoveryPhase,
  impactNormalNative:body.impactNormalNative,fieldC7c:body.fieldC7c,heldButtons:body.heldButtons,trafficBlocked:false};
 let buttons=prepareNativeAIButtons(buttonInput),trafficBlocked=null;
 if(buttons.trafficTested){
  trafficBlocked=nativeAITrafficBlocked({racerIndex:old.racerIndex,cameraCornersNative:geo.cameraCornersNative,
   racers:roster.map(r=>({positionNative:r.body?.positionNative,frameSpeedNative:r.body?.frameSpeedNative}))});
  buttons=prepareNativeAIButtons({...buttonInput,trafficBlocked});
 }
 const power=selectNativeAIPower({difficulty:g.difficulty,role:old.role,avatar:old.avatar,
  own293c:progress.place293c,slotZero293c:roster[0].record?.place293c,flagA4:Number(motion.withinSelectionCircle),
  flagB0:motion.state.flagB0,flag98:Number(motion.nearObjects),finished2c2c:progress.finished2c2c,
  markedBox15de:body.markedBox15de,fieldC7c:body.fieldC7c,counter90:motion.state.stuckFrames,
  courseIndex:g.courseIndex,rawXNative:steering.rawXNative,previousPowerFactor:body.powerFactor});
 const tail=prepareNativeAITail({positionNative:body.positionNative,bodyUpY:body.bodyUpY,rawXNative:steering.rawXNative,
  rawYNative:trim.rawYNative,action16f4:body.action16f4,actionState16d4:body.actionState16d4,fieldE0:old.fieldE0,
  flag9c:motion.state.dryMarkedContact,markedBox15de:body.markedBox15de,fieldC7c:body.fieldC7c,
  mode620:g.mode620,trainingSelection:g.trainingSelection,navigation2948:progress.navigationSourceRow,
  previousNavigationGlobal:g.previousNavigationGlobal,courseIndex:g.courseIndex,racerIndex:old.racerIndex});
 const next=createNativeAIDriverState({...old,motionState:{...motion.state,recoveryPhase:steering.recoveryPhase},
  courseEscapeFrames:corrections.courseEscapeFrames,courseEscapeActive:corrections.courseEscapeActive,
  dryFloorFrames:corrections.dryFloorFrames,fieldE0:tail.fieldE0,lastRawXNative:steering.lastRawXNative});
 return freeze({state:next,controls:{controlOrigin:'ai',rawXNative:tail.rawXNative,rawYNative:tail.rawYNative,
  heldButtons:buttons.heldButtons,basePowerFactor:power},action16f4:tail.action16f4,
  globalWrites:{previousNavigationGlobal:tail.previousNavigationGlobal},
  frame:{phase:'driving',motion,target,corrections,steering,waterPoints,waterHeightsNative,trim,buttons,trafficBlocked}});
}
