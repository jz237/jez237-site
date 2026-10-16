// Independent numeric reconstruction of the bounded opponent steering stage.
// The caller supplies the FINAL source-selected/corrected target direction and
// preceding physical/AI history. Route advancement, course/proximity escapes,
// throttle, power selection, RNG, clocks and human input conditioning are not
// chosen here. Returned axes are signed RAW native bytes, before actor gating.
const F=Math.fround;
const DEADZONE=F(.05),SHARP=.5,PHASE_CLEAR=.15,STUCK_NORMAL_SQUARED=.95;

function integer(value,name,min,max){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from${min} to${max}`);
 return value||0;
}
function scalar(value,name){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite native float32`);
 return F(value);
}
function xz(value,name){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must have finite x and z`);
 return {x:scalar(value.x,`${name}.x`),z:scalar(value.z,`${name}.z`)};
}
function trunc(value){
 if(!Number.isFinite(value)||value< -2147483648||value>=2147483648)
  throw new RangeError('AI steering float-to-int conversion is outside its supported finite range');
 return Math.trunc(value)||0;
}
function normalizedRight(right){
 const squared=F(F(right.z*right.z)+F(right.x*right.x));
 if(!Number.isFinite(squared))throw new RangeError('AI horizontal right length must fit native float32');
 if(squared===0)return right;
 const inverse=F(1/F(Math.sqrt(squared)));
 return {x:F(right.x*inverse),z:F(right.z*inverse)};
}

/**
 * Pure selected-racer steering/trim preparation. XZ values are native frame
 * components, not world positions. targetDirectionXZ is passed through as
 * supplied; only the body's rightXZ is horizontally normalized. The predicted
 * direction comes from the source motion-history producer, not a substitute
 * hull velocity. Budget and physical steering degrees are separate inputs.
 *
 * recoveryPhase(0..3), stuckFrames and previousRawXNative are preceding AI
 * fields. wetCount and impactNormalXZ come from the completed physical frame.
 * The caller commits returned recoveryPhase/lastRawXNative to its AI state,
 * then applies the ordinary actor/crash/simulation input preparation with AI
 * origin, bypassing the subsequent human-only radial/square curve.
 */
export function prepareNativeAISteering({targetDirectionXZ,forwardXZ,rightXZ,predictedDirectionXZ,
 steeringDegrees,turnBudgetDegrees,previousRawXNative,recoveryPhase,stuckFrames,wetCount,impactNormalXZ}={}){
 const target=xz(targetDirectionXZ,'targetDirectionXZ'),forward=xz(forwardXZ,'forwardXZ');
 const right=normalizedRight(xz(rightXZ,'rightXZ')),prediction=xz(predictedDirectionXZ,'predictedDirectionXZ');
 const normal=xz(impactNormalXZ,'impactNormalXZ');
 const degrees=scalar(steeringDegrees,'steeringDegrees'),budget=scalar(turnBudgetDegrees,'turnBudgetDegrees');
 if(degrees<=0||budget<0)throw new RangeError('steeringDegrees must be positive and turnBudgetDegrees nonnegative');
 let x=integer(previousRawXNative,'previousRawXNative',-128,127);
 let phase=integer(recoveryPhase,'recoveryPhase',0,3);
 integer(stuckFrames,'stuckFrames',-2147483648,2147483647);integer(wetCount,'wetCount',0,12);
 const lateralError=F(F(target.x*right.x)+F(target.z*right.z));
 const gain=F(F(budget*70)/degrees);
 const motionCross=F(F(prediction.z*target.x)-F(target.z*prediction.x));
 const alignment=F(lateralError*motionCross);
 const forwardDot=F(F(forward.x*target.x)+F(target.z*forward.z));
 const normalSquared=F(F(normal.x*normal.x)+F(normal.z*normal.z));
 if(![lateralError,gain,alignment,forwardDot,normalSquared].every(Number.isFinite))
  throw new RangeError('AI steering arithmetic must remain finite native float32');
 // This threshold is a source DOUBLE and is intentionally asymmetric: it
 // clears phase for every negative error as well as small positive errors.
 if(lateralError<PHASE_CLEAR)phase=0;
 let desired=0,trim=0;
 if(alignment>=0){
  if(Math.abs(lateralError)>SHARP){
   desired=trunc(lateralError<0?gain:F(-gain));trim=-42;
  }else if(Math.abs(lateralError)>DEADZONE){
   const ratio=F((lateralError<0?F(-lateralError):lateralError)/SHARP);
   desired=trunc(lateralError<0?F(ratio*gain):F(F(-gain)*ratio));
   trim=trunc(F(ratio*-35));
  }
 }
 const wrongWay=forwardDot<0;
 if(wrongWay)desired=lateralError<0?70:-70;
 desired=Math.max(-70,Math.min(70,desired));
 // Two-stage source update: a35 step, then snap if the REMAINING gap<=35.
 // This can move70 in one call, e.g0->35->70. It is not a max35 approach.
 if(desired-x>35)x+=35;
 if(desired-x< -35)x-=35;
 if(Math.abs(desired-x)<=35)x=desired;
 // Post-slew recovery turn uses a strict frame count and a DOUBLE squared
 // normal threshold. A dry craft qualifies even with no shared normal.
 if(stuckFrames>49&&(wetCount===0||normalSquared>=STUCK_NORMAL_SQUARED))x=lateralError>0?-70:70;
 return Object.freeze({rawXNative:x,rawYNative:trim,lateralError,wrongWay,recoveryPhase:phase,
  lastRawXNative:x,desiredRawXNative:desired});
}
