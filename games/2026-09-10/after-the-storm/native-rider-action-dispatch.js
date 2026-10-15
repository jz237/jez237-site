// Independent reconstruction of bounded numeric action/history consumers.
// No pose, animation data, cold-start history, RNG or actor fallback is chosen.
// The actor selector below runs only AFTER the caller's source crash/stumble/
// selected-actor eligibility branch. It is not a replacement for that branch.
const F=Math.fround;
const SPEED_LIMIT=F(2.777777910232544),UP_LIMIT=.95;

function record(value,name){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must be an explicit record`);
 return value;
}
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} is outside its native integer range`);
 return value||0;
}
const word=(v,n)=>integer(v,n,0,65535),stamp=(v,n)=>integer(v,n,0,0xffffffff),axis=(v,n)=>integer(v,n,-128,127);
function scalar(value,name){
 if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must fit finite float32`);
 return F(value);
}
function frozen(value){
 if(value&&typeof value==='object'){Object.values(value).forEach(frozen);Object.freeze(value);}
 return value;
}
function request(actorState,animationFrame,blend,holdFrame){return {actorState,animationFrame,blend:F(blend),holdFrame};}

/** Actual retained61184 fields, with unsigned16 storage bits for the source
 * short reads/writes. ALL fields are required; zero history is not inferred.
 * directionMask15f6 is the same preceding raw mask used by native-controls.
 * The caller must keep these two views coherent if both are retained.
 */
export function createNativeRiderActionInputHistory(input){
 record(input,'action input history');
 return frozen({gestureTick15f0:stamp(input.gestureTick15f0,'gestureTick15f0'),
  ...Object.fromEntries(['flag1600','directionMask15f6','sequence15f8','sequence15fa',
   'lastPressedDirections15fc','quietFrames15fe'].map(k=>[k,word(input[k],k)]))});
}

const circleA=new Map([[0x100,0x800],[0x200,0x400],[0x400,0x100],[0x800,0x200]]);
const circleB=new Map([[0x100,0x400],[0x200,0x800],[0x400,0x200],[0x800,0x100]]);
function sequenceStep(count,last,pressed,order){
 if(count===0)return 1;
 const expected=order.get(last);
 // A diagonal previous edge is not decomposed into invented cardinal edges.
 return expected===undefined?count:(pressed&expected)!==0?(count+1)&65535:0;
}

/** The missing numeric tail of61184, ONCE per selected-racer input sample.
 * Invoke after actor/simulation filtering and actor8 scaling, using BEFORE-
 * human-curve preCurveYNative. Run before61708's optional human-only curve and
 * before ANY63c88 force preparation. AI uses the same61184 tail without that
 * later curve. Existing axis gesture stamps are updated by native-controls;
 * gestureTick15f0 here is a separate no-A|Z negative-Y timestamp.
 *
 * heldButtonsB56 is the copied held word; engineMaskC66 is its ACTUAL source
 * engine gate after filtering. They are separate inputs: held bits cannot
 * substitute for C66. tick is the actual unsigned source clock word.
 */
export function stepNativeRiderActionInputHistory(state,snapshot){
 const s={...createNativeRiderActionInputHistory(state)},q=record(snapshot,'action input snapshot');
 const x=axis(q.rawXNative,'rawXNative'),y=axis(q.rawYNative,'rawYNative');
 const workingY=axis(q.preCurveYNative,'preCurveYNative'),held=word(q.heldButtonsB56,'heldButtonsB56');
 const engine=word(q.engineMaskC66,'engineMaskC66'),tick=stamp(q.tick,'tick'),actor=integer(q.actorState,'actorState');
 if(workingY< -14&&(held&0xa000)===0){s.flag1600=0;s.gestureTick15f0=tick;}
 if(x< -64||x>64)s.flag1600=1;
 const mask=(x< -64?0x200:x>64?0x100:0)|(y< -64?0x400:y>64?0x800:0);
 const pressedDirections15f4=(s.directionMask15f6^mask)&mask;
 s.directionMask15f6=mask;
 if(actor===22||actor===15){
  if(engine===0&&pressedDirections15f4!==0){
   s.sequence15f8=sequenceStep(s.sequence15f8,s.lastPressedDirections15fc,pressedDirections15f4,circleA);
   s.sequence15fa=sequenceStep(s.sequence15fa,s.lastPressedDirections15fc,pressedDirections15f4,circleB);
   s.lastPressedDirections15fc=pressedDirections15f4;s.quietFrames15fe=0;
  }else{
   s.quietFrames15fe=(s.quietFrames15fe+1)&65535;
   if(s.quietFrames15fe>4)s.sequence15f8=s.sequence15fa=0;
  }
 }else s.sequence15f8=s.sequence15fa=0;
 return frozen({state:s,pressedDirections15f4});
}

export function createNativeRiderActionDispatchState(input){
 record(input,'action dispatch state');
 return frozen({action16f4:word(input.action16f4,'action16f4'),idleFramesC6c:integer(input.idleFramesC6c,'idleFramesC6c'),
  idleChoice16c4:integer(input.idleChoice16c4,'idleChoice16c4')});
}
function dispatchInputs(snapshot){
 const q=record(snapshot,'eligible action snapshot'),actorState=integer(q.actorState,'actorState');
 if(actorState!==22&&actorState!==15)throw new RangeError('This action dispatcher requires source-eligible actor22 or15');
 const out={actorState,manipulationAction:integer(q.manipulationAction,'manipulationAction',0,4),
  heldButtonsB56:word(q.heldButtonsB56,'heldButtonsB56'),rawYNative:axis(q.rawYNative,'rawYNative'),
  workingXNative:axis(q.workingXNative,'workingXNative'),workingYNative:axis(q.workingYNative,'workingYNative'),
  tick:stamp(q.tick,'tick'),gestureTick15f0:stamp(q.gestureTick15f0,'gestureTick15f0'),
  gestureWindowNative:stamp(q.gestureWindowNative,'gestureWindowNative'),flag1600:word(q.flag1600,'flag1600'),
  sequence15f8:word(q.sequence15f8,'sequence15f8'),sequence15fa:word(q.sequence15fa,'sequence15fa'),
  alternate16cc:word(q.alternate16cc,'alternate16cc'),state650:integer(q.state650,'state650'),
  frameSpeedNative:scalar(q.frameSpeedNative,'frameSpeedNative'),bodyUpY:scalar(q.bodyUpY,'bodyUpY'),
  idleThresholdNative:integer(q.idleThresholdNative,'idleThresholdNative')};
 if(out.frameSpeedNative<0)throw new RangeError('frameSpeedNative is the completed native frame displacement magnitude');
 return out;
}
function selectedActor(s,q){
 if(q.manipulationAction===3)return 25;
 const recent=((q.tick-q.gestureTick15f0)>>>0)<q.gestureWindowNative;
 if((q.heldButtonsB56&0xa000)===0&&q.rawYNative>=70&&recent&&q.flag1600===0||s.action16f4===1)return 8;
 if(q.sequence15fa>=4||s.action16f4===2)return 9;
 if(q.sequence15f8>=4||s.action16f4===9)return 17;
 return null;
}
function idleEligible(q){
 return q.actorState===22&&q.alternate16cc===0&&q.frameSpeedNative<SPEED_LIMIT&&q.bodyUpY>UP_LIMIT&&
  q.workingXNative> -12&&q.workingXNative<12&&q.workingYNative> -12&&q.workingYNative<12;
}

/** Check the conditional source RNG read without consuming a value or changing
 * history. Supply the actual next unsigned RNG result to the dispatcher ONLY
 * when true. Ordinary ROM globals are gestureWindowNative3 and threshold100;
 * their explicit inputs preserve caller ownership rather than invent startup.
 */
export function nativeRiderActionNeedsRandom(state,snapshot){
 const s=createNativeRiderActionDispatchState(state),q=dispatchInputs(snapshot);
 return selectedActor(s,q)===null&&idleEligible(q)&&q.idleThresholdNative<((s.idleFramesC6c+1)|0);
}

/** Bounded5de24 actor22/15 selector after upstream crash/stumble/selected-actor
 * eligibility, after the completed five hull ticks and BEFORE pose evaluation.
 * This returns a53eac CALL RECIPE; applying it still requires the real actor
 * request/blend/initializer consumer. An already-pending actor can make that
 * consumer a no-op. No physical pose is synthesized here.
 *
 * request1/recent gesture -> actor8; request2/sequence15fa -> actor9;
 * request9/sequence15f8 -> actor17. All three clear the request BEFORE scene/
 * alternate gates. Manipulation3 requests actor25 and retains16f4. Unknown
 * requests persist unless another real gesture/sequence branch clears them.
 * Idle counter increments without an invented failure reset and wraps int32.
 */
export function dispatchNativeRiderActionRequest(state,snapshot,{randomUnsigned32}={}){
 const s={...createNativeRiderActionDispatchState(state)},q=dispatchInputs(snapshot);
 if(randomUnsigned32!==undefined)stamp(randomUnsigned32,'randomUnsigned32');
 const out={state:s,actorRequest:null,requestCleared:false,randomRead:false},actor=selectedActor(s,q);
 if(actor===25){out.actorRequest=request(25,0,.15,0);return frozen(out);}
 if(actor!==null){
  s.action16f4=0;out.requestCleared=true;
  if(q.alternate16cc===0&&q.state650===3)out.actorRequest=request(actor,1,.15,1);
 }else if(idleEligible(q)){
  s.idleFramesC6c=(s.idleFramesC6c+1)|0;
  if(q.idleThresholdNative<s.idleFramesC6c){
   if(randomUnsigned32===undefined)throw new TypeError('This source idle branch requires the actual randomUnsigned32 result');
   s.idleChoice16c4=randomUnsigned32&3;out.randomRead=true;
   out.actorRequest=request(10,s.idleChoice16c4<2?26:1,1,1);
  }
 }
 return frozen(out);
}

/** Once in63c88 before action selection:16d4 counts sign transitions of hull
 * upY ONLY for actor22, not an actor ID or a continuous angular estimate.
 * Short fields retain storage bits; zero and negative zero are upright.
 */
export function prepareNativeRiderInversion(state,snapshot){
 record(state,'inversion state');record(snapshot,'inversion snapshot');
 const old=word(state.upsideDown16f0,'upsideDown16f0'),count=integer(state.turnCount16d4,'turnCount16d4');
 const actor=integer(snapshot.actorState,'actorState'),up=scalar(snapshot.upY,'upY'),next=Number(up<0);
 return frozen({upsideDown16f0:next,previousUpsideDown16f2:old,turnCount16d4:next!==old&&actor===22?(count+1)|0:count});
}

/** Completed-frame65c18 arc history, BEFORE5de24 actor selection. The dry/
 * no-contact counter accumulates qualifying frames and is NOT reset by water.
 * Wet or solid contact clears arc/turn count only when manipulation1598==0.
 * New manipulation-arc entry performs separate resets in63c88; this helper
 * does not replace those entry writes or the later rotation/score consumers.
 */
export function finishNativeRiderArcState(state,snapshot){
 record(state,'arc state');record(snapshot,'arc snapshot');
 const s={turnCount16d4:integer(state.turnCount16d4,'turnCount16d4'),
  noWetNoContactFrames16dc:integer(state.noWetNoContactFrames16dc,'noWetNoContactFrames16dc'),
  arcActive16e2:word(state.arcActive16e2,'arcActive16e2')};
 const wet=word(snapshot.fieldC7c,'fieldC7c'),action=integer(snapshot.manipulationAction,'manipulationAction',0,4);
 const floor=scalar(snapshot.floorImpactNative,'floorImpactNative'),box=scalar(snapshot.boxImpactNative,'boxImpactNative'),
  shore=scalar(snapshot.shoreImpactNative,'shoreImpactNative');
 if(wet===0&&F(F(floor+box)+shore)===0)s.noWetNoContactFrames16dc=(s.noWetNoContactFrames16dc+1)|0;
 else if(action===0){s.arcActive16e2=0;s.turnCount16d4=0;}
 return frozen(s);
}

/** Source numeric53c08 initialization for these additional action actors.
 * Targets/anatomy/animation remain explicitly external. During a blend the
 * source first initializes actor-1; use the existing blend consumer for that.
 */
export function nativeRiderActionActorInitialization({actorState,alternate16cc}={}){
 integer(actorState,'actorState');word(alternate16cc,'alternate16cc');
 if(![8,9,17,25].includes(actorState))throw new RangeError('Only action actors8/9/17/25 are covered by this initializer');
 const types=Array(19).fill(actorState===17?0:1);
 if(actorState===8)for(const i of [2,6,7,14,15])types[i]=0;
 else if(actorState===9)for(const i of [2,7,8,15,16])types[i]=0;
 else if(actorState===25){
  if(alternate16cc!==0)for(const i of [2,6,7,14,15])types[i]=0;
  else{for(const i of [9,10,17,18])types[i]=4;types[6]=2;types[14]=3;}
 }
 return frozen({physicalMode:actorState===8||actorState===17?0:1,riderJointTypes:types});
}

/** Separate, source-eligible actor25 pre-pose return branch. Other actors are
 * deliberately rejected. A finished manipulation requests ordinary actor22
 * and clears C70 to-1; ongoing manipulation retains that field and actor.
 */
export function prepareNativeRiderDiveReturn({actorState,manipulationAction,secondaryCounterC70}={}){
 if(integer(actorState,'actorState')!==25)throw new RangeError('The dive return leaf requires actor25');
 integer(manipulationAction,'manipulationAction',0,4);integer(secondaryCounterC70,'secondaryCounterC70');
 return frozen({actorRequest:manipulationAction===0?request(22,0,.15,0):null,
  secondaryCounterC70:manipulationAction===0?-1:secondaryCounterC70});
}
