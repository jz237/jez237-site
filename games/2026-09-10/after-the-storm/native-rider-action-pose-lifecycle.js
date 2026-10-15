// Independently reconstructed numeric post-pose action rules. The caller has
// completed the current target evaluator. Active blends use the shared actor
// lifecycle instead: these special frame/grip rules do not run while blending.
// This module supplies no animation records, physical targets or clock advance.
import {nativeRiderActionActorInitialization} from './native-rider-action-dispatch.js';

const F=Math.fround,actors=new Set([8,9,10,17,25]);
function record(value,name){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must be an explicit record`);
 return value;
}
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} is outside its native integer range`);
 return value||0;
}
const axis=(value,name)=>integer(value,name,-128,127),word=(value,name)=>integer(value,name,0,65535);
function frozen(value){
 if(value&&typeof value==='object'){Object.values(value).forEach(frozen);Object.freeze(value);}
 return value;
}
function ordinaryRequest(){return {actorState:22,animationFrame:0,blend:F(.15),holdFrame:0};}

/** Numeric wrapper around the idle actor's generic pose evaluator return.
 * Supply the real equivalent evaluator result, not the stored current frame.
 * Its descriptor has49 frames; the idle selector starts at26 for choices0/1
 * and1 for choices2/3. Choice1 restarts at1 on a negative generic return, but
 * choices1/2 end at generic return25. No random value is chosen here. */
export function nativeRiderIdlePoseOutcome(input){
 record(input,'idle pose outcome');
 const next=integer(input.nextAnimationFrame,'nextAnimationFrame');
 if(next===25){
  const choice=integer(input.idleChoice16c4,'idleChoice16c4');
  return choice===1||choice===2?-1:next;
 }
 if(next<0)return integer(input.idleChoice16c4,'idleChoice16c4')===1?1:next;
 return next;
}

/** Numeric actor initializer recipe. Existing action initialization remains
 * authoritative for8/9/17/25. Actor10 uses ordinary grip constraints with
 * four unbound foot endpoints; geometry/rest dimensions remain caller-owned.
 * This recipe is applied only by a successful shared actor request or actual
 * blend completion, never merely because a pending actor was evaluated. */
export function nativeRiderActionPoseInitialization(input){
 record(input,'action initializer');
 const actor=integer(input.actorState,'actorState');
 if(actor!==10)return nativeRiderActionActorInitialization(input);
 const types=Array(19).fill(1);
 for(const i of [18,17,10,9])types[i]=0;
 types[6]=2;types[14]=3;
 return frozen({physicalMode:1,riderJointTypes:types});
}

/** One no-active-blend post-pose branch of the source outer-frame lifecycle.
 *
 * state: {actorState,animationFrame,physicalMode}. It is a copied numeric view,
 * not ownership of the actor/blend/request state. outcome.nextAnimationFrame
 * comes from the actual equivalent current evaluator; actor25 returns exactly0.
 *
 * Only consumed snapshot fields are required. Raw Y is B53, working X/Y are
 * B5e/B5f, heldButtonsB56 is the WHOLE held word, directionMask15f6 is retained
 * raw directional history. finished2c2c and record2c24 are separate signed
 * words; finished short-circuits the latter. Feedback additionally consumes
 * racerIndex/primaryRacerIndex and gameMode648 (not the race-mode620 field).
 *
 * Apply jointTypeWrites in returned order before B preprocessing and19-point
 * solving. Apply actorRequest through the existing common request consumer;
 * it may be a no-op for an already-pending actor. Negative completion retains
 * the prior current frame. A cue recipe records a source feedback call only;
 * actual sound/RNG/muting belongs to its separate effect consumer.
 *
 * Actor25's manipulation-ended return is PRE-pose and remains the existing
 * prepareNativeRiderDiveReturn helper. It is not repeated here.
 */
export function prepareNativeRiderActionPoseCompletion(state,outcome,snapshot={}){
 record(state,'action pose state');record(outcome,'equivalent pose outcome');record(snapshot,'action pose snapshot');
 const actor=integer(state.actorState,'actorState');
 if(!actors.has(actor))throw new RangeError('Only action actors8/9/10/17/25 have this post-pose consumer');
 let frame=integer(state.animationFrame,'animationFrame',0),mode=integer(state.physicalMode,'physicalMode',0,1);
 const next=integer(outcome.nextAnimationFrame,'nextAnimationFrame');
 if(actor===25&&next!==0)throw new RangeError('Actor25 requires its actual evaluator return0');
 const writes=[],effects=[];let actorRequest=null;
 const setType=(jointIndex,type)=>writes.push({jointIndex,type});
 const allTypes=type=>{for(let j=18;j>=0;j--)setType(j,type);};
 const unfinished=()=>integer(snapshot.finished2c2c,'finished2c2c')===0&&integer(snapshot.record2c24,'record2c24')===0;
 const cue=()=>{
  const racer=integer(snapshot.racerIndex,'racerIndex',0,3),primary=integer(snapshot.primaryRacerIndex,'primaryRacerIndex',0,3);
  if(racer===primary&&integer(snapshot.gameMode648,'gameMode648')!==1)effects.push({kind:'actionPoseCue',actorState:actor});
 };
 if(next<0)actorRequest=ordinaryRequest();
 else if(actor===10){
  if(word(snapshot.heldButtonsB56,'heldButtonsB56')!==0||
   axis(snapshot.workingXNative,'workingXNative')>12||snapshot.workingXNative< -12||
   axis(snapshot.workingYNative,'workingYNative')>12||snapshot.workingYNative< -12)actorRequest=ordinaryRequest();
  frame=next;
 }else if(actor===17){
  if(next===23){
   frame=23;cue();allTypes(1);mode=1;setType(6,2);setType(14,3);
   for(const j of [18,17,10,9])setType(j,0);
  }else if(next===24){
   if(unfinished()){
    const y=axis(snapshot.rawYNative,'rawYNative');
    if(y<=34){mode=0;allTypes(0);frame=y< -35?40:24;}
   }else frame=24;
  }else frame=next;
 }else if(actor===9){
  if(next>=84){setType(6,2);setType(14,3);}
  else if(next>=60){setType(14,1);setType(6,1);}
  else if(next>22){setType(6,3);setType(14,2);}
  if(next===25){frame=(word(snapshot.directionMask15f6,'directionMask15f6')&0x400)!==0?25:62;cue();}
  else if(next!==46||axis(snapshot.rawYNative,'rawYNative')>= -34||!unfinished())frame=next;
 }else if(actor===8){
  if(next===30){frame=30;cue();}
  else if(next!==31||axis(snapshot.rawYNative,'rawYNative')<=34||!unfinished())frame=next;
 }else frame=next;
 return frozen({animationFrame:frame,physicalMode:mode,jointTypeWrites:writes,actorRequest,effects});
}
