// Independent numeric reconstruction of the selected-racer AI motion update.
// Inputs are preceding ORIGINAL source fields, not inferred initialization or
// modern velocity/camera/rank substitutes. Nothing here polls controls, moves
// a hull, chooses a target, advances a clock or selects an opponent role.
const F=Math.fround,INT_MIN=-2147483648,INT_MAX=2147483647;
const DISTANCE_CAP=100000000,NEAR_SQUARED=2250000,SPEED_FACTOR=F(1.8);
const BEHIND_THRESHOLDS=[[60,120,180],[40,80,120],[20,60,100]];
function integer(value,name,min=INT_MIN,max=INT_MAX){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from${min} to${max}`);
 return value||0;
}
function scalar(value,name){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite native float32`);
 return F(value);
}
function arithmetic(value){
 const result=F(value);
 if(!Number.isFinite(result))throw new RangeError('AI motion arithmetic must remain finite native float32');
 return result;
}
function vector(value,axes,name){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must contain ${axes.join('/')}`);
 return Object.fromEntries(axes.map(k=>[k,scalar(value[k],`${name}.${k}`)]));
}
function boolean(value,name){if(typeof value!=='boolean')throw new TypeError(`${name} must be boolean`);return value;}
function squaredXZ(a,b){
 const x=arithmetic(a.x-b.x),z=arithmetic(a.z-b.z);
 return arithmetic(arithmetic(x*x)+arithmetic(z*z));
}
function frozenState(value){Object.freeze(value.previousMotionDirection);return Object.freeze(value);}

/** Copy the retained fields consumed by this update. ALL are required: this
 * does not seed an original AI history or choose neutral startup values.
 * previousMotionDirection is AI's prior copy of body motion5c/60/64: the unit
 * direction of the last actual HULL TICK's center displacement. It is neither
 * body forward nor a frame-average/SI velocity. The signed counters preserve
 * source32-bit wrap. dryMarkedContact and flagB0/B4 are numeric source flags;
 * B0/B4's downstream power/action meanings are intentionally not renamed.
 */
export function createNativeAIMotionState({previousMotionDirection,recoveryPhase,stuckFrames,
 dryMarkedContact,offCircleBehindFrames,flagB0,flagB4}={}){
 return frozenState({previousMotionDirection:vector(previousMotionDirection,['x','y','z'],'previousMotionDirection'),
  recoveryPhase:integer(recoveryPhase,'recoveryPhase',0,3),stuckFrames:integer(stuckFrames,'stuckFrames'),
  dryMarkedContact:integer(dryMarkedContact,'dryMarkedContact',0,1),
  offCircleBehindFrames:integer(offCircleBehindFrames,'offCircleBehindFrames'),
  flagB0:integer(flagB0,'flagB0',0,1),flagB4:integer(flagB4,'flagB4',0,1)});
}

/** Detached mutable finite-number copy; restore through the same creator.
 * Standard JSON does not preserve signed-zero bits. This is not a float-bit
 * replay codec; structured cloning retains the complete numeric snapshot.
 */
export function nativeAIMotionSnapshot(state){
 const value=createNativeAIMotionState(state);return {...value,previousMotionDirection:{...value.previousMotionDirection}};
}

/** The established ordinary difficulty0..2/role0..2 table, in OUTER updates.
 * Reverse is a separate source selector, not a fourth difficulty row. Other
 * role reads (including human role-1) require an explicit recovered threshold.
 */
export function nativeAIMotionBehindThreshold({difficulty,role}={}){
 return BEHIND_THRESHOLDS[integer(difficulty,'difficulty',0,2)][integer(role,'role',0,2)];
}

/** Pure once-per-selected-racer86da8 update, including its proximity helper.
 * All positions/circle radii are NATIVE units, with no world-scale conversion.
 * motionDirection is the current body5c/60/64 field. priorControlActive means
 * preceding numeric15dc!=0, NOT held accelerator or engineMask; this runs
 * before current61184. frameSpeedNative is preceding five-tick displacement
 * magnitudeB90. markedBox means preceding15de!=0; wetCount is aggregateC7c.
 *
 * proximityObjectCentersNative retains raw object record order. The source
 * helper scans its FIRST proximityCount records, not the separately produced
 * qualifying-index list. The caller owns that count/table selection. The
 * selectionCircleNative is the source water-selection circle, not a modern
 * presentation camera. Progress values are exact signed race-record+4 reads;
 * this function does not infer them from browser place, laps or route targets.
 *
 * Only racerIndex!=0 AND players==1 reads difficulty/role/threshold. Known
 * roles use the fixed table; another original role requires an explicitly
 * supplied behindThresholdNative. No adjacent table bytes are interpreted as
 * a new semantic row. flagB0/B4 otherwise persist, then course6 forcesB4=1.
 *
 * Returned state contains the retained fields. predictedMotionDirection,
 * predictedDirectionXZ, nearObjects and withinSelectionCircle are the other
 * source writes, all overwritten each call. The caller composes them into its
 * AI record. Horizontal normalization preserves source float32 order and a
 * zero squared length keeps the supplied components; no heading is invented.
 */
export function prepareNativeAIMotion(state,{motionDirection,actorState,animationFrame,priorControlActive,
 frameSpeedNative,markedBox,wetCount,positionNative,proximityObjectCentersNative,proximityCount,
 selectionCircleNative,referenceProgress,racerProgress,racerIndex,players,difficulty,role,
 courseIndex,behindThresholdNative}={}){
 const old=createNativeAIMotionState(state),current=vector(motionDirection,['x','y','z'],'motionDirection');
 integer(actorState,'actorState');integer(animationFrame,'animationFrame');
 boolean(priorControlActive,'priorControlActive');boolean(markedBox,'markedBox');integer(wetCount,'wetCount',0,12);
 const speed=scalar(frameSpeedNative,'frameSpeedNative');if(speed<0)throw new RangeError('frameSpeedNative must be nonnegative');
 const position=vector(positionNative,['x','z'],'positionNative'),circle=vector(selectionCircleNative,['x','z','radiusSquared'],'selectionCircleNative');
 if(circle.radiusSquared<0)throw new RangeError('selectionCircleNative.radiusSquared must be nonnegative');
 integer(referenceProgress,'referenceProgress');integer(racerProgress,'racerProgress');
 integer(racerIndex,'racerIndex',0,3);integer(players,'players',1,2);integer(courseIndex,'courseIndex',0,8);
 if(!Array.isArray(proximityObjectCentersNative)||proximityObjectCentersNative.length>64)
  throw new RangeError('Expected at most64 raw-order proximity object centers');
 integer(proximityCount,'proximityCount',0,proximityObjectCentersNative.length);
 const objects=proximityObjectCentersNative.slice(0,proximityCount).map((p,i)=>vector(p,['x','z'],`proximityObjectCentersNative[${i}]`));
 const eligible=racerIndex!==0&&players===1;let threshold=null,thresholdSource=null;
 if(eligible){
  integer(difficulty,'difficulty',0,2);integer(role,'role');
  if(role>=0&&role<=2){
   threshold=nativeAIMotionBehindThreshold({difficulty,role});thresholdSource='native-difficulty-role-table';
   if(behindThresholdNative!==undefined&&behindThresholdNative!==threshold)throw new RangeError('behindThresholdNative contradicts the established source table');
  }else{
   threshold=integer(behindThresholdNative,'explicit behindThresholdNative');thresholdSource='caller-supplied-original-read';
  }
 }
 const predicted=Object.fromEntries(['x','y','z'].map(k=>[k,arithmetic(current[k]+arithmetic(current[k]-old.previousMotionDirection[k]))]));
 const horizontalSquared=arithmetic(arithmetic(predicted.z*predicted.z)+arithmetic(predicted.x*predicted.x));
 let direction={x:predicted.x,z:predicted.z};
 if(horizontalSquared!==0){
  const inverse=arithmetic(1/arithmetic(Math.sqrt(horizontalSquared)));
  direction={x:arithmetic(predicted.x*inverse),z:arithmetic(predicted.z*inverse)};
 }
 let phase=old.recoveryPhase;
 if(actorState===23)phase=1;
 else if(actorState===7){if(phase===1)phase=2;if(phase===2&&animationFrame>=56)phase=3;}
 const speedTimes1_8Native=arithmetic(speed*SPEED_FACTOR);
 const stuck=priorControlActive&&speedTimes1_8Native<30?(old.stuckFrames+1)|0:0;
 let dry=markedBox?1:old.dryMarkedContact;if(wetCount!==0)dry=0;
 let nearest=DISTANCE_CAP;for(const object of objects){const squared=squaredXZ(object,position);if(squared<nearest)nearest=squared;}
 const near=nearest<NEAR_SQUARED,selectionSquared=squaredXZ(position,circle),inside=!(circle.radiusSquared<selectionSquared);
 let behind=old.offCircleBehindFrames;
 if(referenceProgress<racerProgress&&!inside){if(behind<1000)behind=(behind+1)|0;}else behind=0;
 let b0=old.flagB0,b4=old.flagB4;
 if(eligible){b0=Number(behind>threshold);b4=1-b0;}
 if(courseIndex===6)b4=1;
 const next=createNativeAIMotionState({previousMotionDirection:current,recoveryPhase:phase,stuckFrames:stuck,
  dryMarkedContact:dry,offCircleBehindFrames:behind,flagB0:b0,flagB4:b4});
 return Object.freeze({state:next,predictedMotionDirection:Object.freeze(predicted),predictedDirectionXZ:Object.freeze(direction),
  nearObjects:near,withinSelectionCircle:inside,diagnostic:Object.freeze({nearestObjectDistanceSquaredNative:nearest,
   selectionDistanceSquaredNative:selectionSquared,speedTimes1_8Native,behindThresholdNative:threshold,thresholdSource})});
}
