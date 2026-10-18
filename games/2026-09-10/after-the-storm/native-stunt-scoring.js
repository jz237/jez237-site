// Independent reconstruction of a bounded Stunt scoring state machine.
// The optional native adapter consumes the arc and classifier helpers below.
// Award progression is still separate from the live HUD/score owner. Nothing
// here recognizes gestures, animates poses or discovers contacts.
//
// Future adapter order, once per source logical frame (50 native clock units):
//   1. Accumulate the tracked point-motion arc using the post-hull velocities.
//   2. Update the articulated rider, then classify its resulting actor/action.
//   3. Step scoring with that move; pass a geometrically qualified checkpoint
//      at the end of the SAME call. Repeat flags reset after move settlement.
// Ring contacts are separate events in source object iteration order.
// Skip calls while paused. `active:false` suppresses new move/CP awards, while
// an already scheduled finish award still counts down.
//
// Outputs are award ENQUEUE events, not the native displayed total. The separate
// native-stunt-awards module owns queue capacity and later capped transfer;
// native-stunt-records owns the post-drain numeric record branch. Ratings,
// unlocks, sounds and recovery side effects are outside this module. Its arc
// and landing helpers require explicit native values; live browser airtime,
// Euler turns or a button alone do not establish native scoring eligibility.

export const NATIVE_STUNT_MOVE=Object.freeze({
  NONE:0,HANDSTAND:1,BACKWARDS:2,ROLL_NEGATIVE:3,ROLL_POSITIVE:4,FLIP:5,
  LANDED:6,PARTIAL:7,FAILED:8,STANDING:9,SOMERSAULT:10,DIVE:11
});

const MAX_INT=0x7fffffff;
const F=Math.fround;
const repeatKeys=['handstand','backwards','standing','dive'];
const completedKeys=[...repeatKeys,'somersault','negativeRoll','positiveRoll','flip'];
const repeatKey=move=>({1:'handstand',2:'backwards',9:'standing',10:'standing',11:'dive'})[move];
const result=(state,awards=[])=>({state,awards});
const award=(kind,points,finish=false)=>({kind,points,finish});

function integer(value,name,min=0,max=MAX_INT){
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}
function finiteFloat(value,name){
  if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite binary32`);
  return F(value);
}
function boundedFloat(value,name,min,max){
  const n=finiteFloat(value,name);
  if(n<min||n>max)throw new RangeError(`${name} must be from ${min} to ${max}`);
  return n;
}
function boolean(value,name){
  if(typeof value!=='boolean')throw new TypeError(`${name} must be boolean`);
  return value;
}
function vector(value,name){
  if(!value)throw new TypeError(`${name} must have x, y and z`);
  return ['x','y','z'].map(axis=>finiteFloat(value[axis],`${name}.${axis}`));
}
function cloneState(state){
  if(!state)throw new TypeError('Expected a native stunt scoring state');
  integer(state.previousMove,'previousMove',0,11);
  integer(state.rotationGroup,'rotationGroup',0,3);
  integer(state.pending,'pending');
  integer(state.nextRingIndex,'nextRingIndex',0,65536);
  integer(state.ringStreak,'ringStreak');
  integer(state.ringCount,'ringCount');
  integer(state.delayedTrick,'delayedTrick');
  integer(state.delayedTicks,'delayedTicks',0,20);
  boolean(state.finished,'finished');
  for(const key of repeatKeys)boolean(state.repeat?.[key],`repeat.${key}`);
  for(const key of completedKeys)boolean(state.completed?.[key],`completed.${key}`);
  if(!Array.isArray(state.collectedRings)||state.collectedRings.length>65536)throw new TypeError('Expected collectedRings array');
  for(const index of state.collectedRings)integer(index,'collected ring index',0,65535);
  return {...state,repeat:{...state.repeat},completed:{...state.completed},collectedRings:[...state.collectedRings]};
}
function markPose(completed,move){
  const key=repeatKey(move);
  if(key)completed[key]=true;
  if(move===10)completed.somersault=true;
}
function rotationPoints(arcNative,multiplier){
  const points=F(finiteFloat(arcNative,'arcNative')*F(multiplier));
  if(!Number.isFinite(points)||points<-0x80000000||points>MAX_INT)throw new RangeError('Rotation score exceeds signed native range');
  return Math.trunc(points);
}

/** Create independent per-run state. Standing/somersault share a repeat flag. */
export function createNativeStuntScoring(){
  return {
    previousMove:0,rotationGroup:0,pending:0,
    repeat:Object.fromEntries(repeatKeys.map(key=>[key,false])),
    completed:Object.fromEntries(completedKeys.map(key=>[key,false])),
    nextRingIndex:0,ringStreak:0,ringCount:0,collectedRings:[],
    delayedTrick:0,delayedTicks:0,finished:false
  };
}

/**
 * Prepare source checkpoint interpolation and time points. Distances are
 * signed distances to the actual checkpoint plane before/after this frame;
 * crossing eligibility and finite gate width must already be established.
 * remainingClockNative is the countdown AFTER this frame's 50-unit update.
 * One source second is 1000 clock units. Offset and score truncate toward0.
 * A zero/zero crossing is undefined in source and rejected here.
 */
export function nativeStuntCheckpointTime({currentPlaneDistance,previousPlaneDistance,remainingClockNative}){
  const current=Math.abs(finiteFloat(currentPlaneDistance,'currentPlaneDistance'));
  const previous=Math.abs(finiteFloat(previousPlaneDistance,'previousPlaneDistance'));
  const denominator=F(current+previous);
  if(!Number.isFinite(denominator)||denominator===0)throw new RangeError('Checkpoint crossing needs a finite nonzero distance sum');
  const crossingOffsetNative=Math.trunc(F(F(current/denominator)*50));
  return {crossingOffsetNative,points:checkpointPoints(remainingClockNative,crossingOffsetNative)};
}
function checkpointPoints(remainingClockNative,crossingOffsetNative){
  integer(remainingClockNative,'remainingClockNative',0,299999);
  integer(crossingOffsetNative,'crossingOffsetNative',0,50);
  return Math.trunc((remainingClockNative+Math.trunc(crossingOffsetNative/2))/100)*5;
}

/**
 * One scoring frame. `move` is the native classifier result, not an input.
 * LANDED/PARTIAL require the native accumulated arc (already Up.y-adjusted
 * for LANDED). Pose awards occur on a transition to NONE; 9→10 awards the
 * standing accumulator plus400. Bases are granted only when previousMove=0.
 * Rotations are not subject to the four checkpoint-local repeat penalties.
 *
 * Optional checkpoint: {atFinishLine,completeRun,remainingClockNative,
 * crossingOffsetNative}. The caller establishes qualification/lap limits;
 * `completeRun` is a terminal crossing, not every finish-line crossing.
 * Finish flushes any positive pending amount and schedules it20 calls later.
 */
export function stepNativeStuntScoring(state,{move,arcNative,active=true,checkpoint=null}={}){
  integer(move,'move',0,11); boolean(active,'active');
  let rotationAward=0;
  if(move===6||move===7)rotationAward=rotationPoints(arcNative,move===6?14.3:7.15);
  let timePoints=0;
  if(checkpoint!==null){
    boolean(checkpoint.atFinishLine,'atFinishLine');
    boolean(checkpoint.completeRun,'completeRun');
    if(checkpoint.completeRun&&!checkpoint.atFinishLine)throw new RangeError('A complete run must cross its finish line');
    timePoints=checkpointPoints(checkpoint.remainingClockNative,checkpoint.crossingOffsetNative);
  }
  const next=cloneState(state),awards=[];
  if(next.delayedTicks>0&&--next.delayedTicks===0){
    awards.push(award('trick',next.delayedTrick,true));
    next.delayedTrick=0;
  }
  if(!active||next.finished)return result(next,awards);

  const previous=next.previousMove;
  let points=0;
  if(move>=3&&move<=5)next.rotationGroup=move-2;
  else if(move===6||move===7){
    points=rotationAward;
    if(move===6&&points>0&&next.rotationGroup){
      next.completed[['negativeRoll','positiveRoll','flip'][next.rotationGroup-1]]=true;
    }
    next.rotationGroup=0;
  }else if(move===8)next.rotationGroup=0;
  else if(next.rotationGroup===0&&previous!==0&&move===0){
    const key=repeatKey(previous);
    if(key&&previous!==10){
      points=next.repeat[key]?10:next.pending;
      next.repeat[key]=true;
      markPose(next.completed,previous);
    }
  }else if(previous===9&&move===10){
    points=next.repeat.standing?10:next.pending+400;
    next.repeat.standing=true;
    next.rotationGroup=0;
    markPose(next.completed,10);
  }
  if(points>0){awards.push(award('trick',points));next.pending=0;}

  if(next.rotationGroup)next.pending+=30;
  else if(move===1||move===2||move===9||move===11){
    const base={1:250,2:500,9:100,11:500}[move];
    next.pending+=previous===0?base:move===11?30:1;
  }else next.pending=0;
  integer(next.pending,'accumulated pending');
  next.previousMove=move;

  if(checkpoint!==null){
    if(!checkpoint.atFinishLine)for(const key of repeatKeys)next.repeat[key]=false;
    if(timePoints>0)awards.push(award('time',timePoints,checkpoint.atFinishLine));
    if(checkpoint.completeRun){
      next.finished=true;
      if(next.pending>0){
        markPose(next.completed,move);
        const key=repeatKey(move);
        next.delayedTrick=key&&next.repeat[key]?10:next.pending;
        next.delayedTicks=20;
        next.pending=0;
      }else next.delayedTrick=0;
    }
  }
  return result(next,awards);
}

/** Award a unique object hit using its separately authored chain order. */
export function collectNativeStuntRing(state,{ringIndex,chainOrder=ringIndex,active=true}={}){
  integer(ringIndex,'ringIndex',0,65535); integer(chainOrder,'chainOrder',0,65535); boolean(active,'active');
  const next=cloneState(state);
  if(!active||next.finished||next.collectedRings.includes(ringIndex))return result(next);
  next.collectedRings.push(ringIndex);
  next.ringStreak=chainOrder===next.nextRingIndex?next.ringStreak+1:1;
  next.nextRingIndex=chainOrder+1;
  next.ringCount++;
  return result(next,[award('ring',50*next.ringStreak)]);
}

/**
 * Classify already prepared source actor/action state. This does not decide
 * whether a pose/gesture is attainable or execute landing recovery. A released
 * roll/flip supplies landingTicks=-1; wet contact arms5, as does floor/box
 * contact after>5 airborne frames. Shore contact alone does not arm it.
 * At expiry FAILED has priority over PARTIAL; only LANDED scales arc by Up.y.
 * Recovery, crash and partial flags must come from the rider/contact solver.
 */
export function classifyNativeStuntFrame({actorState,animationFrame=0,action=0,wetCount=0,
  anyWet=wetCount>0,landingTicks=0,airborneFrames=0,floorContact=false,boxContact=false,
  recoveryState=0,crash=false,partial=false,arcNative=0,upY=1}={}){
  integer(actorState,'actorState',0,255); integer(animationFrame,'animationFrame',0,65535);
  integer(action,'action',0,4); integer(wetCount,'wetCount',0,12);
  integer(landingTicks,'landingTicks',-32768,32767); integer(airborneFrames,'airborneFrames',-2147483648);
  integer(recoveryState,'recoveryState');
  for(const [name,value] of Object.entries({anyWet,floorContact,boxContact,crash,partial}))boolean(value,name);
  let arc=finiteFloat(arcNative,'arcNative');
  const up=boundedFloat(upY,'upY',-1,1);
  if(landingTicks>0&&--landingTicks===0){
    const failed=(actorState===7&&recoveryState===0)||actorState===23||crash;
    const partialResult=(actorState===7&&recoveryState===1)||actorState===24||partial;
    const move=failed?8:partialResult?7:6;
    if(move===6)arc=finiteFloat(F(arc*up),'settled arcNative');
    return {move,landingTicks,arcNative:arc,settled:true};
  }
  if(landingTicks<0&&(anyWet||((floorContact||boxContact)&&airborneFrames>5)))landingTicks=5;
  let move=0;
  if(actorState===8)move=1;
  else if(actorState===9)move=2;
  else if(actorState===17)move=animationFrame===60?10:animationFrame===37?0:9;
  else if(action===2)move=3;
  else if(action===1)move=4;
  else if(action===4)move=5;
  else if(action===3&&wetCount===12)move=11;
  return {move,landingTicks,arcNative:arc,settled:false};
}

/**
 * Native point-motion arc, not radians/degrees or airtime. All vectors use
 * native point-velocity/displacement units, not SI velocities. front/rear are
 * upper hull points4/1; bodyDelta is the last hull tick's stored50/54/58 center
 * displacement, not the five-tick outer-frame displacement used by the HUD.
 * `tracking` and `simulationActive` are caller-owned source latches. The
 * source weights by1+abs(rightY)/2 and by2.8 during actions1/2; binary32 steps
 * matter at integer award thresholds. No tracking latch is invented here.
 */
export function accumulateNativeStuntArc(arcNative,{frontVelocityNative,rearVelocityNative,
  bodyDeltaNative,rightY,action=0,tracking=true,simulationActive=true}={}){
  let arc=finiteFloat(arcNative,'arcNative');
  integer(action,'action',0,4); boolean(tracking,'tracking'); boolean(simulationActive,'simulationActive');
  const front=vector(frontVelocityNative,'frontVelocityNative'),rear=vector(rearVelocityNative,'rearVelocityNative');
  const body=vector(bodyDeltaNative,'bodyDeltaNative'),right=boundedFloat(rightY,'rightY',-1,1);
  if(!tracking||!simulationActive)return arc;
  const relativeNorm=point=>{
    const d=point.map((v,i)=>F(v-body[i]));
    return F(Math.sqrt(F(F(F(d[0]*d[0])+F(d[1]*d[1]))+F(d[2]*d[2]))));
  };
  let step=F(F(relativeNorm(front)+relativeNorm(rear))*F(1+F(Math.abs(right)*.5)));
  if(action===1||action===2)step=F(F(2.8)*step);
  arc=F(arc+step);
  return finiteFloat(arc,'accumulated arcNative');
}
