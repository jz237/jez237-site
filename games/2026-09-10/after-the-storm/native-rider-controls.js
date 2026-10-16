// Independently reconstructed B/R physical controls. No device bindings, poses
// or original assets. Prepare once before five hull ticks; finish once during
// the post-hull rider phase, before physical target projection and link solving.
// The source gravity/retention branches use binary32 arithmetic. World targets
// are explicitly converted to native coordinates for the recovered B transform.

const F=Math.fround,COUNT=19,B=0x4000,R=0x10;
const CROUCH_START=F(.9),CROUCH_STEP=F(.01),BASE_GRAVITY=F(-.192);
const TARGET_PIVOT_NATIVE=.1806645,MANIPULATION_NATIVE=F(-1.1);
const axes=['x','y','z'];
const copy=p=>({x:p.x,y:p.y,z:p.z});
const zeros=()=>Array.from({length:COUNT},()=>({x:0,y:0,z:0}));
const finite=(value,name)=>{
  if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);
  return value;
};
function range(value,name,min,max){
  finite(value,name);if(value<min||value>max)throw new RangeError(`${name} must be from ${min} to ${max}`);
  return value;
}
function integer(value,name,min,max){
  if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}
function vector(value,name){
  if(!value||!axes.every(k=>Number.isFinite(value[k])))throw new TypeError(`${name} must contain finite x, y and z`);
  return value;
}
function stateValue(state,phase){
  if(!state||state.phase!==phase)throw new TypeError(`Expected a ${phase} native rider control state`);
  for(const key of ['baseLateralRetention','lateralRetention','baseRollBalance','rollBalance'])range(state[key],key,0,1);
  range(state.crouchFactor,'crouchFactor',CROUCH_START,1);
  integer(state.heldButtons,'heldButtons',0,0xffff);
  return state;
}
const frozen=state=>Object.freeze(state);

// Recovered default profile record, not a claim about every saved menu choice.
// B6c steers; B70 selects the jet curve; B74 affects jet, grip and roll together.
export const NATIVE_RIDER_TUNE_DEFAULTS=Object.freeze({tuneB6c:5,tuneB70:5,tuneB74:5});
// Verified numeric selection order; menu position is not a physical avatar ID.
export const NATIVE_RIDER_MENU_ORDER=Object.freeze([0,2,3,1]);

/** Supply the selected profile's coefficients; no numeric rider is inferred. */
export function createNativeRiderControlState({baseLateralRetention,baseRollBalance}={}){
  range(baseLateralRetention,'baseLateralRetention',0,1);range(baseRollBalance,'baseRollBalance',0,1);
  return frozen({phase:'ready',baseLateralRetention:F(baseLateralRetention),baseRollBalance:F(baseRollBalance),
    lateralRetention:F(baseLateralRetention),rollBalance:F(baseRollBalance),crouchFactor:1,heldButtons:0});
}

/**
 * Pure frame preparation from sampleNativeControls' held/pressed button fields.
 * wet is the previous aggregate C7c flag; contactMode is the source 1602 value.
 * gravityNative is FINAL selected gravity, including the dry-rider multiplier.
 * Do not apply the profile's dry multiplier a second time. This helper does not
 * change accelerator masks or synthesize braking/reverse forces. Raw B/R bits
 * remain meaningful even when the separate force-axis/engine gate is muted.
 */
export function prepareNativeRiderControls(state,{heldButtons=0,pressedButtons=0,
  actorState=22,riderIndex=0,wet=true,contactMode=0}={}){
  stateValue(state,'ready');integer(heldButtons,'heldButtons',0,0xffff);
  integer(pressedButtons,'pressedButtons',0,0xffff);integer(actorState,'actorState',-1,255);
  integer(riderIndex,'riderIndex',0,3);integer(contactMode,'contactMode',0,0xffff);
  if(typeof wet!=='boolean')throw new TypeError('wet must be boolean');
  if((pressedButtons&heldButtons)!==pressedButtons)throw new RangeError('Pressed buttons must also be held');
  const {baseLateralRetention:base,baseRollBalance:baseRoll}=state;
  let lateralRetention,rollBalance=state.rollBalance,crouchFactor=state.crouchFactor;
  if(heldButtons&R){
    lateralRetention=F(F(base*F(.2))+F(.8));
    // The source R branch intentionally leaves the prior roll value untouched.
  }else if(contactMode){
    lateralRetention=contactMode===1?F(.999):F(F(F(1-base)*F(.6))+base);
    rollBalance=F(baseRoll*F(.01));
  }else{
    lateralRetention=F(state.lateralRetention+Math.max(-CROUCH_STEP,Math.min(CROUCH_STEP,F(base-state.lateralRetention))));
    rollBalance=baseRoll;
  }
  const enteredCrouch=!!(pressedButtons&B)&&actorState===22&&crouchFactor===1;
  if(enteredCrouch)crouchFactor=CROUCH_START;
  let gravityNative=BASE_GRAVITY;
  if(!wet&&riderIndex===1)gravityNative=F(gravityNative*F(1.2));
  else if(!wet&&riderIndex===2)gravityNative=F(gravityNative*F(.9));
  if(actorState===23)gravityNative=F(gravityNative*F(.7));
  if(crouchFactor<1)gravityNative=F(gravityNative*F(F(F(1-crouchFactor)*F(7.5))+1));
  const next=frozen({...state,phase:'prepared',heldButtons,crouchFactor,lateralRetention,rollBalance});
  return {state:next,gravityNative,lateralRetention,rollBalance,crouchFactor,enteredCrouch};
}

/**
 * Apply the post-hull B transform, then advance its factor for the NEXT frame.
 * targets are nineteen world vectors. manipulationDeltas are added to the
 * physical rider's stored deltas BEFORE its negative-up clamp/projection, not
 * after link solving. Both arrays are copied and never overwrite caller poses.
 * With no targets, return null arrays and advance only the control lifecycle;
 * that permits an explicitly incomplete adapter without a physical rider.
 * State is plain serializable data; a copied replay state can resume normally.
 */
export function finishNativeRiderControls(state,{heldButtons=state?.heldButtons,targets,
  center,up,scale=.025,active=true}={}){
  stateValue(state,'prepared');integer(heldButtons,'heldButtons',0,0xffff);
  if(heldButtons!==state.heldButtons)throw new RangeError('Keep the frame-sampled held buttons through the post-hull phase');
  if(typeof active!=='boolean')throw new TypeError('Post-pose activity must be boolean');
  if(!active&&targets!==undefined)throw new Error('An inactive post-pose phase cannot transform targets');
  let output=null,manipulationDeltas=null;
  if(targets!==undefined){
    if(!Array.isArray(targets)||targets.length!==COUNT)throw new TypeError('targets must contain nineteen world vectors');
    output=targets.map((p,i)=>copy(vector(p,`targets[${i}]`)));
    vector(center,'center');vector(up,'up');finite(scale,'scale');
    if(scale<=0)throw new RangeError('scale must be positive');
    if(Math.abs(Math.hypot(up.x,up.y,up.z)-1)>1e-6)throw new RangeError('up must be a unit hull axis');
    manipulationDeltas=zeros();
    if(state.crouchFactor<1){
      const c=Object.fromEntries(axes.map(k=>[k,F(center[k]/scale)]));
      const u=Object.fromEntries(axes.map(k=>[k,F(up[k])]));
      for(let i=0;i<COUNT;i++){
        const d=Object.fromEntries(axes.map(k=>[k,F(F(output[i][k]/scale)-c[k])]));
        const q=F(F(F(u.x*d.x)+F(u.y*d.y))+F(u.z*d.z));
        // This expression is double in the source, converted to binary32 once.
        const qNew=F((q-TARGET_PIVOT_NATIVE)*state.crouchFactor+TARGET_PIVOT_NATIVE);
        for(const k of axes){
          output[i][k]=F(F(c[k]+F(qNew*u[k]))+F(d[k]-F(q*u[k])))*scale;
          manipulationDeltas[i][k]=F(MANIPULATION_NATIVE*u[k])*scale;
          finite(output[i][k],`transformed targets[${i}].${k}`);
        }
      }
    }
  }
  const crouchFactor=active&&state.crouchFactor<1?(heldButtons&B?Math.min(1,F(state.crouchFactor+CROUCH_STEP)):1):state.crouchFactor;
  return {state:frozen({...state,phase:'ready',crouchFactor}),targets:output,manipulationDeltas};
}
