// The source clears C38..C50 and the shared15b4/8/c normal once before five
// hull steps, except when simulationState is0. Each family has its OWN strict
// maximum; the shared normal follows the last increase in traversal order,
// rather than the largest final impact. Values are native point-velocity per
//10ms step, not outer-frame displacement or world units per second.
const F=Math.fround,axes=['x','y','z'];
export const NATIVE_IMPACT_FIELDS=Object.freeze({
 primaryBuoy:'primaryBuoyImpactNative',fixedSphere:'fixedSphereImpactNative',racer:'racerImpactNative',
 shore:'shoreImpactNative',box:'boxImpactNative',floor:'floorImpactNative',object:'objectImpactNative'
});
const fields=Object.values(NATIVE_IMPACT_FIELDS),owners=new WeakSet();
//63C88 prepares16A0 from numeric bodyB64 and the actor at frame preparation.
//7E938 compares HALF this value, after its strict C50 maximum test.
export function nativePreparedIceStability(riderIndex,actorState){
 if(!Number.isInteger(riderIndex)||riderIndex<0||riderIndex>3||!Number.isInteger(actorState))throw new TypeError('Expected numeric source rider and actor');
 const factor=actorState===8?F(.1):actorState===9?F(.15):actorState===17?F(.2):1;
 return F([9.5,10,9,8][riderIndex]*factor);
}
const zero=()=>({x:0,y:0,z:0});
function owned(state){if(!owners.has(state))throw new TypeError('Expected a native impact state');}
function normalVector(value){
 if(!value||!axes.every(k=>Number.isFinite(value[k])))throw new TypeError('Impact normal must have finite XYZ');
 if(Math.abs(Math.hypot(value.x,value.y,value.z)-1)>.001)throw new RangeError('Impact normal must have source unit length');
 return {x:F(value.x),y:F(value.y),z:F(value.z)};
}

export function createNativeImpactState(){
 const state={...Object.fromEntries(fields.map(k=>[k,0])),normal:zero(),markedBox:false};
 owners.add(state);return state;
}

/** Preparation gate recovered at64bc4. Simulation0 retains EVERYTHING. */
export function resetNativeImpacts(state,{simulationState=3}={}){
 owned(state);
 if(!Number.isInteger(simulationState)||simulationState<0||simulationState>3)throw new RangeError('Invalid native simulation state');
 if(simulationState!==0){for(const k of fields)state[k]=0;state.normal=zero();state.markedBox=false;}
 return state;
}

/** Report every qualified contact in its actual traversal order. Signed
 * incomingNative is measured BEFORE physical correction. A marked box sets
 * its latch even for an outgoing overlap and attenuates only its recorded
 * impact, using source float32(.4); the caller still applies the full response.
 * A nonpositive/equal impact leaves the normal untouched. */
export function recordNativeImpact(state,{channel,incomingNative,normal,markedBox=false}={}){
 owned(state);
 if(!Object.hasOwn(NATIVE_IMPACT_FIELDS,channel))throw new RangeError('Unknown native impact channel');
 const field=NATIVE_IMPACT_FIELDS[channel];
 if(!Number.isFinite(incomingNative)||!Number.isFinite(F(incomingNative)))throw new TypeError('Native incoming impact must be finite float32');
 if(typeof markedBox!=='boolean'||markedBox&&channel!=='box')throw new TypeError('markedBox is a boolean box-contact flag');
 const nextNormal=normalVector(normal);
 let incoming=F(incomingNative);
 if(markedBox){state.markedBox=true;incoming=F(incoming*F(.4));}
 if(!(state[field]<incoming))return false;
 state[field]=incoming;state.normal=nextNormal;return true;
}

/** Detached immutable values for completed-frame consumers and diagnostics. */
export function nativeImpactSnapshot(state){
 owned(state);return Object.freeze({...Object.fromEntries(fields.map(k=>[k,state[k]])),
  normal:Object.freeze({...state.normal}),markedBox:state.markedBox});
}
