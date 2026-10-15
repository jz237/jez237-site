// Pure telemetry conversion. No hull/water integration, render bones, progress
// or actor decisions are performed here. Call once after the native world step;
// use its racer/hydro fields as presentation patches, not a replacement solver.
// The caller owns one previous sample per craft and discards it on reset/seek.

const AXES=['x','y','z'],copy=v=>({x:v.x,y:v.y,z:v.z});
const angleDelta=a=>Math.atan2(Math.sin(a),Math.cos(a));
const length=v=>Math.hypot(v.x,v.y,v.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const semanticBooleans=['airborne','launched','onRamp','diveUsed','diveRecovery'];
const semanticNumbers=['airTime','impact','diveRemaining','load','anticipation','compression','compressionVelocity','drag'];
const semanticNonnegative=new Set(['airTime','impact','diveRemaining','load','anticipation','compression','drag']);

// These fractions are an explicitly authored display policy for the native
// eight lower hull points. They are not native pressure weights or wetCount.
export const NATIVE_PRESENTATION_WET_GROUPS=Object.freeze(Object.fromEntries(Object.entries({
  lower:[0,2,3,5,6,7,9,10],bow:[3,5,6,7],stern:[0,2,9,10],
  port:[0,3,6,9],starboard:[2,5,7,10],rearIntake:[0,2]
}).map(([key,indices])=>[key,Object.freeze(indices)])));

function finite(v,name){if(!Number.isFinite(v))throw new TypeError(`${name} must be finite`);return v;}
function vector(v,name){if(!v||!AXES.every(k=>Number.isFinite(v[k])))throw new TypeError(`${name} must have finite x, y and z`);return v;}
function nonnegative(v,name){finite(v,name);if(v<0)throw new RangeError(`${name} must be nonnegative`);return v;}
function integer(v,name){if(!Number.isSafeInteger(v)||v<0)throw new RangeError(`${name} must be a nonnegative safe integer`);return v;}
function normalized(v,name){vector(v,name);const n=length(v);if(!Number.isFinite(n)||n<1e-9)throw new RangeError(`${name} is degenerate`);return {x:v.x/n,y:v.y/n,z:v.z/n};}
function wetBits(flags){
  if((!Array.isArray(flags)&&!(flags instanceof Uint8Array))||flags.length!==12)throw new TypeError('wetFlags must contain twelve boolean or 0/1 point flags');
  return Array.from(flags,(v)=>{if(v!==true&&v!==false&&v!==0&&v!==1)throw new TypeError('wetFlags entries must be boolean or 0/1');return !!v;});
}
function semanticPatch(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('semantics must be an explicit hydro-field object');
  const result={};
  for(const [key,v]of Object.entries(value)){
    if(semanticBooleans.includes(key)){if(typeof v!=='boolean')throw new TypeError(`${key} must be boolean`);}
    else if(semanticNumbers.includes(key)){finite(v,key);if(semanticNonnegative.has(key))nonnegative(v,key);}
    else if(key==='landingId')integer(v,key);
    else throw new TypeError(`Unsupported semantic field ${key}`);
    result[key]=v;
  }
  return result;
}
function priorSample(previous,scale,time){
  if(previous===undefined)return null;
  const p=previous?.sample??previous;
  if(!p||typeof p!=='object')throw new TypeError('previous must be a prior presentation or its sample');
  for(const key of ['time','heading','pitch','roll','waterHeight','speed'])finite(p[key],`previous.${key}`);
  if(p.scale!==scale)throw new RangeError('Discard previous presentation when changing scale');
  if(p.time>time+1e-12)throw new RangeError('Discard previous presentation when resetting or seeking backwards');
  for(const key of ['yawVelocity','pitchVelocity','rollVelocity','waterVelocity'])finite(p.rates?.[key],`previous.rates.${key}`);
  if(typeof p.ratesAvailable!=='boolean')throw new TypeError('previous.ratesAvailable must be boolean');
  return p;
}
function sourceTelemetry(s,scale){
  if(!s||typeof s!=='object')throw new TypeError('Expected native snapshot source telemetry');
  integer(s.hudSpeed,'source.hudSpeed');nonnegative(s.frameSpeedNative,'source.frameSpeedNative');
  integer(s.logicalFrame,'source.logicalFrame');integer(s.clockUnits,'source.clockUnits');integer(s.wetCount,'source.wetCount');
  if(s.wetCount>12||typeof s.anyWet!=='boolean')throw new RangeError('Invalid source aggregate wet state');
  vector(s.frameDisplacementNative,'source.frameDisplacementNative');
  const average=copy(s.frameDisplacementNative);
  for(const key of AXES)average[key]=finite(average[key]*scale/.05,'frame average world velocity');
  return {hudSpeed:s.hudSpeed,frameSpeedNative:s.frameSpeedNative,
    frameDisplacementNative:copy(s.frameDisplacementNative),frameAverageVelocityWorld:average,
    logicalFrame:s.logicalFrame,clockUnits:s.clockUnits,wetCount:s.wetCount,anyWet:s.anyWet};
}

/**
 * snapshot is nativeRaceSnapshot(adapter), with world position/velocity.
 * wetFlags is adapter.water.wet, sampled independently of the frame-latched
 * source wetCount. renderHeightNative is the center water query's rendered
 * height INCLUDING its datum, not sourcePlaneQueryNative. It is scaled once.
 *
 * Returns {racer, source, derived, sample}. racer.speed is instantaneous world
 * horizontal speed; source.hudSpeed preserves the separate source integer.
 * Lower-point wet fractions and attitude derivatives serve display consumers;
 * derived flags do not decide native airborne, landing, wipeout or scoring.
 * Those hydro fields appear ONLY when supplied explicitly through semantics.
 * Rates use physical snapshot.simulationTime, never render dt or HUD frames.
 * A repeated physical tick holds the previous rates without accumulating time.
 */
export function nativeRacerPresentation(snapshot,{wetFlags,renderHeightNative,scale=.025,previous,semantics={}}={}){
  if(!snapshot||typeof snapshot!=='object')throw new TypeError('Expected a native race snapshot');
  finite(scale,'scale');if(scale<=0)throw new RangeError('scale must be positive');
  const position=vector(snapshot.position,'snapshot.position'),velocity=vector(snapshot.velocity,'snapshot.velocity');
  const time=nonnegative(snapshot.simulationTime,'snapshot.simulationTime'),bits=wetBits(wetFlags),semantic=semanticPatch(semantics);
  const waterHeight=finite(finite(renderHeightNative,'renderHeightNative')*scale,'world water height');
  const f=normalized(snapshot.frame?.forward,'frame.forward'),r=normalized(snapshot.frame?.right,'frame.right'),u=normalized(snapshot.frame?.up,'frame.up');
  if(Math.max(Math.abs(dot(f,r)),Math.abs(dot(f,u)),Math.abs(dot(r,u)))>.001||dot(cross(f,r),u)<.999)throw new RangeError('Expected a right-handed orthogonal hull frame');
  const prior=priorSample(previous,scale,time),singular=Math.hypot(f.x,f.z)<1e-8;
  const heading=singular?(prior?.heading??0):Math.atan2(f.x,f.z),pitch=-Math.asin(clamp(f.y,-1,1)),roll=Math.atan2(r.y,u.y);
  const speed=finite(Math.hypot(velocity.x,velocity.z),'world horizontal speed'),speed3D=finite(length(velocity),'world 3D speed');
  const elapsed=prior?Math.max(0,time-prior.time):0;
  const rates=prior?{...prior.rates}:{yawVelocity:0,pitchVelocity:0,rollVelocity:0,waterVelocity:0};
  if(elapsed>1e-12){
    rates.yawVelocity=angleDelta(heading-prior.heading)/elapsed;
    rates.pitchVelocity=angleDelta(pitch-prior.pitch)/elapsed;
    rates.rollVelocity=angleDelta(roll-prior.roll)/elapsed;
    // This is the sampled surface rate along the craft path, not lattice V.
    rates.waterVelocity=(waterHeight-prior.waterHeight)/elapsed;
  }
  Object.entries(rates).forEach(([key,v])=>finite(v,key));
  const fraction=group=>NATIVE_PRESENTATION_WET_GROUPS[group].reduce((sum,i)=>sum+Number(bits[i]),0)/NATIVE_PRESENTATION_WET_GROUPS[group].length;
  const pointWetCount=bits.filter(Boolean).length,lowerWetFraction=fraction('lower'),ratesAvailable=elapsed>1e-12||!!prior?.ratesAvailable;
  const hydro={initialized:true,y:position.y,vy:velocity.y,pitch,roll,pitchVelocity:rates.pitchVelocity,rollVelocity:rates.rollVelocity,
    waterHeight,waterVelocity:rates.waterVelocity,wet:lowerWetFraction,bowWet:fraction('bow'),sternWet:fraction('stern'),
    portWet:fraction('port'),starboardWet:fraction('starboard'),intake:Number(bits[0]||bits[2]),previousSpeed:prior?.speed??speed,...semantic};
  const source=sourceTelemetry(snapshot.source,scale);
  return {racer:{x:position.x,y:position.y,z:position.z,vx:velocity.x,vy:velocity.y,vz:velocity.z,speed,heading,yawVelocity:rates.yawVelocity,hydro},
    source,derived:{presentationOnly:true,pointWetFlags:[...bits],pointWetCount,pointAnyWet:pointWetCount>0,
      lowerWetFraction,allPointsDry:pointWetCount===0,centerAboveRenderedWater:position.y>waterHeight,
      centerClearanceWorld:finite(position.y-waterHeight,'center clearance'),speed3DWorld:speed3D,attitudeSingular:singular,
      wetPolicy:'lower-point display fractions; source rear OR for intake',ratesAvailable,
      rateSource:!prior?'unavailable':elapsed>1e-12?'physical-snapshot-difference':'held-physical-tick',semanticFields:Object.keys(semantic)},
    sample:{time,scale,heading,pitch,roll,waterHeight,speed,rates:{...rates},ratesAvailable}};
}
