// Independent numeric controller preparation. No DOM, device polling or live
// key bindings belong here. Call once per logical frame, before hull forces.
// Device deadzones/calibration and normalized-browser→raw-native conversion
// remain caller choices. Native raw axes, pre-curve working axes, curved force
// axes and slewed raw X serve different consumers and must stay separate.
// Circle/pose gesture recognition and rider animation transitions are omitted;
// directional timestamps below supply the recovered manipulation-force API.

const F=Math.fround;
const gestureKeys=['negativeX','positiveX','negativeY','positiveY'];
const integer=(v,name,min,max)=>{
  if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return v;
};
const axis=(value,name)=>integer(value,name,-128,127);
const boolean=(value,name)=>{if(typeof value!=='boolean')throw new TypeError(`${name} must be boolean`);return value;};
const signedNearest=value=>Math.trunc(value+(value<0?-.5:.5));
function inputOrigin(value){
  if(value!=='human'&&value!=='ai')throw new RangeError('controlOrigin must be human or ai');return value;
}
function powerBaseline(origin,value){
  // Human preparation explicitly starts at1. AI's producer owns its retained
  // multiplier and must supply it even when a branch did not write a new one.
  if(origin==='human'){
    if(value!==undefined&&value!==1)throw new RangeError('Human basePowerFactor must remain1');return 1;
  }
  if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError('AI basePowerFactor must be finite binary32');
  return F(value);
}

/** Signed square curve after diagonal gain; small-axis rounding is intrinsic. */
export function conditionNativeStick(rawXNative,rawYNative){
  axis(rawXNative,'rawXNative');axis(rawYNative,'rawYNative');
  if(rawXNative===0&&rawYNative===0)return {workingXNative:0,workingYNative:0};
  const length=F(Math.sqrt(F(rawXNative*rawXNative+rawYNative*rawYNative)));
  const largest=Math.max(Math.abs(rawXNative),Math.abs(rawYNative));
  const gain=F(70/F(F(70/length)*largest));
  const curve=value=>{
    const n=F(F(value*gain)/70);
    const magnitude=Math.min(70,Math.trunc(F(F(n*n)*70)+.5));
    return value<0?-magnitude:magnitude;
  };
  // Avoid negative zero leaking into records, comparisons and control tests.
  return {workingXNative:curve(rawXNative)||0,workingYNative:curve(rawYNative)||0};
}

/** Source initialization seeds the four direction stamps with the start tick. */
export function createNativeControlState({tick=0}={}){
  integer(tick,'tick',0,0xffffffff);
  return {tick,heldButtons:0,smoothedXNative:0,directionMask:0,
    gestureTicks:Object.fromEntries(gestureKeys.map(key=>[key,tick]))};
}

/**
 * Pure source input preparation. Actor22 is ordinary riding; actor gates and
 * pose multipliers are exposed for future callers without choosing animations.
 * simulationState0/1 or crash mute force axes and engine. The adapter uses3;
 * original state2 routes human selection through a different outer caller.
 *
 * Gesture timestamps use pre-curve working axes beyond strict±14. Direction
 * edges use RAW axes beyond strict±64; stunt entry later uses RAW±70. Slewed X
 * approaches raw X by at most15 per logical frame and is not force steering.
 * heldButtons is the native16-bit mask; A/Z (0xa000) engage the source engine.
 *
 * AI dispatch supplies RAW signed bytes and its explicit basePowerFactor.
 * Common actor gates/multipliers still apply, but AI does not run the final
 * human diagonal/square curve. Muting axes/engine retains the supplied base.
 * This is input preparation only, not the missing AI steering/navigation.
 */
export function sampleNativeControls(state,{rawXNative=0,rawYNative=0,heldButtons=0,
  tick=(state?.tick+1)>>>0,actorState=22,animationFrame=0,simulationState=3,crash=false,
  controlOrigin='human',basePowerFactor}={}){
  if(!state||!state.gestureTicks)throw new TypeError('Expected a native control state');
  inputOrigin(controlOrigin);const baseline=powerBaseline(controlOrigin,basePowerFactor);
  axis(rawXNative,'rawXNative');axis(rawYNative,'rawYNative');
  integer(heldButtons,'heldButtons',0,0xffff);integer(tick,'tick',0,0xffffffff);
  integer(actorState,'actorState',-1,255);integer(animationFrame,'animationFrame',0,65535);
  integer(simulationState,'simulationState',0,3);boolean(crash,'crash');
  integer(state.heldButtons,'previous heldButtons',0,0xffff);
  integer(state.tick,'previous tick',0,0xffffffff);
  integer(state.smoothedXNative,'smoothedXNative',-128,127);
  integer(state.directionMask,'previous directionMask',0,0xffff);
  for(const key of gestureKeys)integer(state.gestureTicks[key],`gestureTicks.${key}`,0,0xffffffff);
  const changed=state.heldButtons^heldButtons;
  const pressedButtons=changed&heldButtons,releasedButtons=changed&state.heldButtons;
  const smoothedXNative=state.smoothedXNative+Math.max(-15,Math.min(15,rawXNative-state.smoothedXNative));
  let preCurveXNative=rawXNative,preCurveYNative=rawYNative,powerFactor=baseline;
  const muted=crash||actorState===23||(actorState===7&&animationFrame<56)||
    (actorState>0&&actorState<7)||simulationState===0||simulationState===1;
  if(muted)preCurveXNative=preCurveYNative=0;
  else if(actorState===24)powerFactor=F(powerFactor*F(.3));
  else if(actorState===9||actorState===17)powerFactor=F(powerFactor*F(.9));
  else if(actorState===8){
    preCurveXNative=signedNearest(F(preCurveXNative*F(.8)));
    powerFactor=F(powerFactor*F(.85));
  }
  const gestureTicks={...state.gestureTicks};
  if(preCurveXNative<-14)gestureTicks.negativeX=tick;
  else if(preCurveXNative>14)gestureTicks.positiveX=tick;
  if(preCurveYNative<-14)gestureTicks.negativeY=tick;
  else if(preCurveYNative>14)gestureTicks.positiveY=tick;
  const directionMask=(rawXNative<-64?0x200:rawXNative>64?0x100:0)|
    (rawYNative<-64?0x400:rawYNative>64?0x800:0);
  const pressedDirections=(state.directionMask^directionMask)&directionMask;
  const engineMask=muted?0:heldButtons&0xa000;
  const conditioned=controlOrigin==='human'?conditionNativeStick(preCurveXNative,preCurveYNative):
    {workingXNative:preCurveXNative,workingYNative:preCurveYNative};
  const next={tick,heldButtons,smoothedXNative,directionMask,gestureTicks};
  return {state:next,controlOrigin,basePowerFactor:baseline,rawXNative,rawYNative,preCurveXNative,preCurveYNative,...conditioned,
    smoothedXNative,heldButtons,pressedButtons,releasedButtons,directionMask,pressedDirections,
    engineMask,throttle:engineMask!==0,powerFactor,gestureTicks:{...gestureTicks},muted};
}
