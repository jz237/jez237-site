import {nativeRiderStartFrameView,prepareNativeRiderStartPose,nativeRiderStartAnatomy} from './native-rider-start-pose.js';

// A selected-record bridge, not an animation asset or a second pose clock.
// The physical hull supplies its current center and fitted axes. The caller
// supplies the four actual retained yaw words and the requested eighteen
// records. No heading, neutral pose or earlier selection is substituted.
// Original/equivalent artwork remains an explicit caller responsibility. An
// optional complete anatomy adapts dimensions BEFORE numeric evaluation; its
// global result is never resized or retargeted after the solve.
const F=Math.fround,AXES=['x','y','z'],providers=new WeakSet();
export const NATIVE_RIDER_START_TYPES=Object.freeze([1,1,0,1,1,1,2,0,0,1,1,1,1,1,3,0,0,1,1]);
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function vector(v,name){
 if(!v||!AXES.every(k=>Number.isFinite(v[k])&&Number.isFinite(F(v[k]))))throw new TypeError(`${name} requires finite float32 XYZ`);
 return Object.fromEntries(AXES.map(k=>[k,F(v[k])]));
}
function body(hull,scale,yawFrame){
 if(hull?.scale!==scale)throw new RangeError('Start provider and physical hull scales must match');
 vector(hull.center,'hull.center');
 return {position:vector(Object.fromEntries(AXES.map(k=>[k,hull.center[k]/scale])),'native hull center'),
  right:vector(hull.frame?.right,'hull.frame.right'),up:vector(hull.frame?.up,'hull.frame.up'),
  forward:vector(hull.frame?.forward,'hull.frame.forward'),yawFrame};
}
function world(p,scale){
 const out=Object.fromEntries(AXES.map(k=>[k,p[k]*scale]));
 if(!AXES.every(k=>Number.isFinite(out[k])))throw new RangeError('Start pose conversion must remain finite');
 return out;
}

/** selectFrame receives the immutable descriptor7 view BEFORE data is read.
 * readYawFrame returns the current four independent source1434..1440 words,
 * including their actual retained values for a vertical physical hull. Neither
 * callback is polled per substep or allowed to supply the lifecycle outcome.
 * evaluate is pure with respect to physical points/anchors/actor state. */
export function createNativeRiderStartPoseProvider({scale,selectFrame,readYawFrame,anatomy}={}){
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive and finite');
 if(typeof selectFrame!=='function')throw new TypeError('selectFrame must supply the actual requested selected records');
 if(typeof readYawFrame!=='function')throw new TypeError('readYawFrame must supply the actual retained yaw words');
 const dimensions=nativeRiderStartAnatomy(anatomy);
 const provenance=freeze({mechanics:'numeric actor15 evaluator and nineteen-plus-six point mapping',
  geometry:'explicit selected caller records; no animation data or anatomical resizing included',
  anatomy:dimensions===nativeRiderStartAnatomy()?'original numeric dimensions':'explicit caller anatomy; source fixed-size geometry adapted',
  units:'native global pose converted once to world by the declared hull scale',
  timing:'caller-owned actor/frame/phase; no provider clock or selected-frame cache'});
 const provider={provenance,evaluate({hull,animationFrame,context}={}){
  const frameView=nativeRiderStartFrameView({animationFrame});
  const bodyNative=body(hull,scale,readYawFrame(hull,context));
  const selectedFrame=selectFrame(frameView,context);
  const pose=prepareNativeRiderStartPose({frameView,selectedFrame,bodyNative,anatomy:dimensions});
  return freeze({targets:pose.targetsNative.map(p=>world(p,scale)),
   auxiliaryTargets:pose.auxiliaryTargetsNative.map(p=>world(p,scale)),
   evaluatedAnimationFrame:pose.evaluatedAnimationFrame,nextAnimationFrame:pose.nextAnimationFrame,provenance});
 }};
 providers.add(provider);return Object.freeze(provider);
}

/** Prepare the ordinary source15/frame56 seed. This is the pose/type portion
 * of physical startup, not the full6390C/62E50 retained-body initializer.
 * Separate rest lengths, circle radius, hull profile and source scene belong
 * to their existing owners. Initialization performs no auxiliary/body solve. */
export function prepareNativeRiderStartSeed(provider,{hull}={}){
 if(!providers.has(provider))throw new TypeError('Expected a native selected-record start provider');
 const pose=provider.evaluate({hull,animationFrame:56});
 if(pose.evaluatedAnimationFrame!==56||pose.nextAnimationFrame!==57)throw new Error('Ordinary start must evaluate56 and return57');
 return freeze({actorState:15,animationFrame:pose.nextAnimationFrame-1,physicalMode:1,
  types:[...NATIVE_RIDER_START_TYPES],positions:pose.targets.map(p=>({...p})),
  auxiliaryPositions:pose.auxiliaryTargets.map(p=>({...p})),provenance:pose.provenance});
}
