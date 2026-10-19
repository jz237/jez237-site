const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const vectors=new Map([[0x44,'positionNative'],[0xb78,'frameDisplacementNative'],[0x6c,'forwardNative'],
 [0x84,'rightNative'],[0x1618,'referenceVelocityNative'],[0x50,'tickDisplacementNative']]);
const scalars=new Map([[0xbf0,['boundaryDriftNative','x']],[0xbf4,['boundaryDriftNative','z']],[0xc4c,['floorImpactNative']]]);
const halves=new Map([[0x16e0,'stumbleCountdown16e0'],[0x16cc,'alternate16cc'],[0xc66,'engineMaskC66']]);
function integer(v,name,max){if(!Number.isInteger(v)||v<0||v>max)throw new RangeError('Invalid '+name);return v;}
function finite(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite '+name);return F(v);}

/** Two explicit views of the same physical fields read by AE210/B08F8.
 * Structured callers supply real native-unit owners, including applied wrap
 * drift. No absent memory is filled with zeros and no body array is synthesized.
 * Reads remain branch-lazy: e.g. an extra scene actor needs neither view.
 */
export function nativeEffectBodyView(input,slot){
 integer(slot,'physical effect slot',3);
 const raw=input.bodyWordsBySlot?.[slot],fields=input.bodyFieldsBySlot?.[slot];
 if(raw!==undefined&&fields!==undefined)throw new TypeError('Supply one physical effect body view per slot');
 if(raw===undefined&&fields===undefined)return null;
 let words;
 if(raw!==undefined){
  if(!Array.isArray(raw)||raw.length!==1478)throw new RangeError('Supply physical body words[1478]');
  words=raw.map(w=>integer(w,'physical body word',0xffffffff));
 }else if(!fields||typeof fields!=='object'||Array.isArray(fields))throw new TypeError('Supply physical body fields');
 return {
  float(offset){
   const vector=[...vectors].find(([base])=>offset>=base&&offset<base+12&&offset%4===0),path=scalars.get(offset);
   if(!vector&&!path)throw new RangeError('Unsupported physical effect float');
   if(words){b.setUint32(0,words[offset/4]);return finite(b.getFloat32(0),'physical effect field');}
   if(vector)return finite(fields[vector[1]]?.[['x','y','z'][(offset-vector[0])/4]],vector[1]);
   return finite(path.length===1?fields[path[0]]:fields[path[0]]?.[path[1]],path.join('.'));
  },
  half(offset){
   const name=halves.get(offset);if(!name)throw new RangeError('Unsupported physical effect halfword');
   if(words)return (words[offset>>>2]>>>(offset&2?0:16))&65535;
   return integer(fields[name],name,65535);
  }
 };
}

export function nativeEffectEngineMask(input,slot){return nativeEffectBodyView(input,slot)?.half(0xc66);}

/** Capture the actual completed structured physics owners. The caller must
 * supply the applied source BF0/BF4 translation; it cannot be inferred from
 * craft displacement, terrain bounds, camera motion or an assumed zero wrap.
 * Fresh startup requires its own source initialization rather than this view.
 */
export function captureNativeEffectBody(adapter,{boundaryDriftNative}={}){
 if(!adapter?.frame||adapter.pendingFrameCompletion||adapter.logicalFrames<1||!adapter.riderLifecycle||
    adapter.preparedHullTick===adapter.hull.ticks||adapter.sampledHullTick!==null||adapter.inactiveTicks!==0||adapter.hull.ticks%5!==0)
  throw new TypeError('Effect body capture requires completed physical owners');
 return captureFields(adapter,boundaryDriftNative,true);
}

/** AE7C4 runs before any input or hull frame. Capture that fresh physical
 * owner without sampling controls or pretending a completed frame exists.
 * The caller supplies62E50's actual startup BF0/BF4 (a2=0 resets both; a2!=0
 * has a different retained-center path). C4C is read from the impact owner,
 * not reset here. C66 is deliberately absent: the reset retains that field,
 * AE210 does not read it, and only a later sampled frame can supply it here.
 */
export function captureNativeInitialEffectBody(adapter,{boundaryDriftNative}={}){
 if(!adapter?.hull?.initialization||!adapter.riderLifecycle||adapter.frame!==null||adapter.logicalFrames!==0||
  adapter.hull.ticks!==0||adapter.remainder!==0||adapter.pendingFrameCompletion||adapter.preparedHullTick!==null||
  adapter.sampledHullTick!==null||adapter.inactiveTicks!==0||adapter.lastControls!==null)
  throw new TypeError('Initial effect body capture requires unsampled fresh physical owners');
 return captureFields(adapter,boundaryDriftNative,false);
}

function captureFields(adapter,boundaryDriftNative,includeEngine){
 const {hull,lastFrame,riderLifecycle,impacts}=adapter,motion=hull.sprayMotionNative;
 if(!Number.isFinite(hull.scale)||hull.scale<=0||!motion)throw new TypeError('Effect body capture requires native motion and scale');
 const vector=(p,scale=1)=>Object.freeze(Object.fromEntries(['x','y','z'].map(k=>[k,finite(p?.[k]/scale,'physical effect vector')])));
 const fields={positionNative:vector(hull.center,hull.scale),frameDisplacementNative:vector(lastFrame.frameDisplacementNative),
  forwardNative:vector(hull.frame.forward),rightNative:vector(hull.frame.right),referenceVelocityNative:vector(motion.velocity),
  tickDisplacementNative:vector(motion.centerVelocity),boundaryDriftNative:Object.freeze({x:finite(boundaryDriftNative?.x,'applied boundary drift.x'),z:finite(boundaryDriftNative?.z,'applied boundary drift.z')}),
  floorImpactNative:finite(impacts.floorImpactNative,'floor impact'),alternate16cc:integer(riderLifecycle.state.alternateStumble,'alternate16cc',65535),
  stumbleCountdown16e0:integer(riderLifecycle.state.stumbleCountdown,'stumbleCountdown16e0',65535),
  ...(includeEngine?{engineMaskC66:integer(adapter.frame.controls.engineMask,'engineMaskC66',65535)}:{})};
 return Object.freeze(fields);
}
