import {NATIVE_HULL_STEP} from './native-hull.js';

// Independent numeric reconstruction for the ordinary one-player point hull.
// Call applyNativeWaterForces from stepNativeHull's beforeIntegrate callback,
// then discover/apply contacts. This module does not advance hull positions.
//
// Conversion assumption: .025 metres/native unit and five 10ms physics ticks
// per 50ms logical frame. Native point velocity is displacement per physics
// tick; native HUD/frame speed is displacement across ALL FIVE ticks. A native
// point-velocity increment becomes increment*hull.scale/.01 metres/second.
// These logical-clock/SI assumptions do not establish full native equivalence.
//
// Included: ordinary profile, jet, gravity, roll balance, dry-motion correction,
// buoyancy, grouped water drag and five-tick input/wet-count preparation.
// Excluded: fore/aft rider-joint moments, auxiliary low-speed/shore yaw force,
// special manipulation/stunt states, wipeout recovery, AI, two-player catch-up
// and other pose/power overrides.
// stickY affects vertical water drag here; its rider-joint force is unported.

export const NATIVE_WATER_SCALE = .025;
const STEP=NATIVE_HULL_STEP,FRAME_TICKS=5,LOWER=[0,2,3,5,6,7,9,10],UPPER=[1,4,8,11];
const RIGHT_LOWER=new Set([2,5,7,10]);
const DRAG_PAIRS=[[3,5],[6,7],[9,10]];
const PARAMS=[
  {steering:[28,22],slowSpeed:41.7,slowGain:.3,lowRatio:[.45,.35],highRatio:[.95,1],pivot:30,
    engine:[.589,.556],bonus:.1,lateral:[.92,.8109],roll:[.023,.0317],height:0,dryGravity:1},
  {steering:[27,21],slowSpeed:50,slowGain:.4,lowRatio:[.4,.3],highRatio:[.94,1],pivot:80,
    engine:[.5722,.5472],bonus:.16,lateral:[.95,.8409],roll:[.008,.024],height:-5,dryGravity:1.2},
  {steering:[32,26],slowSpeed:39,slowGain:.2,lowRatio:[1.2,1],highRatio:[.95,1],pivot:99,
    engine:[.5127,.4827],bonus:.09,lateral:[.89,.5627],roll:[.017,.0431],height:2,dryGravity:.9},
  {steering:[33,27],slowSpeed:27.8,slowGain:.05,lowRatio:[.7,.4],highRatio:[.95,1],pivot:30,
    engine:[.575,.545],bonus:.11,lateral:[.91,.8],roll:[.009,.019],height:0,dryGravity:1}
];
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const length=p=>Math.hypot(p.x,p.y,p.z);
const difference=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(pair,t)=>pair[0]+(pair[1]-pair[0])*t/11;

function finite(value,name){if(!Number.isFinite(value))throw new TypeError(`${name} must be finite`);return value;}
function range(value,name,min,max){finite(value,name);if(value<min||value>max)throw new RangeError(`${name} must be from ${min} to ${max}`);return value;}

/** Numeric native rider order is explicit; no browser character-name mapping. */
export function createNativeWaterProfile({riderIndex=0,tuneB6c=0,tuneB70=0,tuneB74=0}={}){
  if(!Number.isInteger(riderIndex)||riderIndex<0||riderIndex>3)throw new RangeError('riderIndex must be from 0 to 3');
  for(const [name,value]of Object.entries({tuneB6c,tuneB70,tuneB74}))range(value,name,0,11);
  const p=PARAMS[riderIndex],engine=lerp(p.engine,tuneB74);
  return Object.freeze({
    riderIndex,tuneB6c,tuneB70,tuneB74,
    steeringDegrees:lerp(p.steering,tuneB6c),steeringSlowFrameSpeed:p.slowSpeed,steeringSlowGain:p.slowGain,
    lowSpeedForceRatio:lerp(p.lowRatio,tuneB70),highSpeedForceRatio:lerp(p.highRatio,tuneB70),
    // /1.8 converts HUD/frame speed; /5 converts frame displacement to substep.
    pivotSpeedNative:(p.pivot+(100-p.pivot)*tuneB70/11)/1.8/5,
    upperCurveSpeedNative:100/1.8/5,
    peakForceNative:engine,powerBonusNative:p.bonus,contactForceNative:engine+p.bonus,
    waterLateralRetention:lerp(p.lateral,tuneB74),rollBalance:lerp(p.roll,tuneB74),
    referenceHeightOffsetNative:p.height,dryGravityMultiplier:p.dryGravity,
    gravityNative:-.192,buoyancyCapLengthFactor:.8
  });
}

/** Target force is a native point-velocity increment, applied to TWO rear points. */
export function nativeJetMagnitude(profile,{speedNative=0,forwardY=0,rearWet=false,powerSteps=5,powerFactor=1,staticContact=false,contactFactor=1}={}){
  range(speedNative,'speedNative',0,Infinity);range(forwardY,'forwardY',-1,1);
  range(powerSteps,'powerSteps',0,5);range(powerFactor,'powerFactor',0,1);range(contactFactor,'contactFactor',0,1);
  if(staticContact)return profile.contactForceNative*contactFactor;
  const pivot=profile.pivotSpeedNative,upper=profile.upperCurveSpeedNative;
  let ratio;
  if(speedNative>=upper)ratio=profile.highSpeedForceRatio;
  else if(speedNative>=pivot){
    const index=Math.trunc((speedNative-pivot)*1024/(upper-pivot));
    ratio=1-(1-Math.cos(index*Math.PI*2/4096))*(1-profile.highSpeedForceRatio);
  }else{
    const index=Math.trunc((pivot-speedNative)*2048/pivot);
    ratio=1-(1-Math.cos(index*Math.PI*2/4096))*(1-profile.lowSpeedForceRatio)/2;
  }
  return (ratio*profile.peakForceNative+powerSteps/5*profile.powerBonusNative)*
    Math.sqrt(Math.max(0,1-forwardY*forwardY))*(rearWet?1:.75)*powerFactor;
}

/**
 * Pure raw wave-cell response, entirely in NATIVE units. Slopes are the two
 * source cell height differences, not world gradients. Cell selection/grid
 * animation is absent. The raw direction is deliberately not renormalized.
 */
export function nativeWaveCellImpulse({h00,slopeU,slopeV,offsetU,offsetV,pointY,referenceHeight=0,k=.03,maxPairLengthNative}){
  for(const [name,value]of Object.entries({h00,slopeU,slopeV,offsetU,offsetV,pointY,referenceHeight,k,maxPairLengthNative}))finite(value,name);
  if(k<0||maxPairLengthNative<=0)throw new RangeError('Wave response requires nonnegative k and positive pair length');
  const denominator=Math.sqrt((slopeU*slopeU+slopeV*slopeV+4096)*4096);
  const a=slopeU/denominator,b=slopeV/denominator,c=4096/denominator;
  const immersion=offsetU*a+(referenceHeight+h00-pointY)*c+offsetV*b;
  const wet=immersion>=0,magnitude=wet?Math.min(immersion*k,.8*maxPairLengthNative*k):0;
  return {wet,immersion,surfaceHeight:referenceHeight+h00+(offsetU*slopeU+offsetV*slopeV)/4096,
    velocity:vec(magnitude*(a-.5*b),magnitude*c,magnitude*.8660253882408142*b)};
}

/** One separate state per hull; profiles may be shared. */
export function createNativeWaterState(profile=createNativeWaterProfile()){
  return {
    profile,wet:Array(12).fill(false),wetCount:0,anyWet:false,framePhase:0,
    frameSpeedNative:0,frameDisplacementNative:vec(),referenceDisplacementNative:vec(),
    referenceOffsetWorld:0,forceNative:0,buoyancyK:.03,verticalDamping:.85,
    frameControls:null,frameStartCenter:null,frameStartReference:null,
    lastHullTick:null,boundHull:null,lastJet:null,lastGravityNative:0,lastBuoyancy:[]
  };
}

function controls(options){
  const result={throttle:!!options.throttle,stickX:options.stickX??0,stickY:options.stickY??0,
    powerSteps:options.powerSteps??5,powerFactor:options.powerFactor??1};
  range(result.stickX,'stickX',-1,1);range(result.stickY,'stickY',-1,1);
  range(result.powerSteps,'powerSteps',0,5);range(result.powerFactor,'powerFactor',0,1);
  return result;
}

function referencePoint(hull){
  const {center:c,frame:{up:u,forward:f},scale}=hull;
  return vec(c.x+scale*(.1806645*u.x-26.9998535*f.x),
    c.y+scale*(.1806645*u.y-26.9998535*f.y),c.z+scale*(.1806645*u.z-26.9998535*f.z));
}

function prepareFrame(hull,state,input){
  const reference=referencePoint(hull),scale=hull.scale;
  if(state.frameStartCenter){
    const movement=difference(hull.center,state.frameStartCenter);
    state.frameDisplacementNative=vec(movement.x/scale,movement.y/scale,movement.z/scale);
    state.frameSpeedNative=length(state.frameDisplacementNative);
    const d=difference(reference,state.frameStartReference);
    state.referenceDisplacementNative=vec(d.x/scale,d.y/scale,d.z/scale);
  }
  state.frameStartCenter=copy(hull.center);state.frameStartReference=reference;
  state.frameControls=input;
  // The height adjustment uses horizontal frame displacement, not point speed.
  const horizontal=Math.hypot(state.frameDisplacementNative.x,state.frameDisplacementNative.z);
  state.referenceOffsetWorld=scale*(state.profile.referenceHeightOffsetNative+3*Math.min(horizontal/(100/3),1));
}

function sampleSurface(surface,x,z,time){
  const sample=typeof surface==='function'?surface(x,z,time):surface;
  if(typeof sample==='number')return {height:finite(sample,'surface height'),dx:0,dz:0};
  if(!sample)throw new TypeError('surface must return a height or {height, gradient:{x,z}}');
  return {height:finite(sample.height,'surface height'),
    dx:finite(sample.gradient?.x??0,'surface gradient x'),dz:finite(sample.gradient?.z??0,'surface gradient z')};
}

function dragGroup(hull,indices,applyHorizontal,lateral,vertical){
  const f=hull.frame.forward,denominator=Math.hypot(f.x,f.z);
  const fx=denominator?f.x/denominator:0,fz=denominator?f.z/denominator:0;
  for(const index of indices){
    const v=hull.points[index].velocity;
    if(applyHorizontal){
      const along=v.x*fx+v.z*fz;
      v.x=along*fx*(1-lateral)+lateral*v.x;
      v.z=along*fz*(1-lateral)+lateral*v.z;
    }
    v.y*=vertical;
  }
}

/**
 * Supply forces once from a native-hull 10ms beforeIntegrate callback.
 * surface is a world height, function(x,z,time), or sampled object with gradient.
 * A supplied gradient uses normalized modern-surface pressure as an explicit
 * approximation; numeric/zero-gradient surfaces use the exact flat-water rule.
 * Source wave-cell math above is separate from this modern height sampler.
 * stickX/Y are normalized signed native B5e/B5f inputs. Positive stickX pushes
 * the REAR toward body-right; an adapter must choose its browser steering sign.
 * staticContact/contactFactor are the caller's current contact accumulator;
 * this module does not discover, reset or latch geometry contacts.
 */
export function applyNativeWaterForces(hull,state,options={}){
  if(hull.points.length!==12||!Number.isFinite(hull.scale)||hull.scale<=0)throw new TypeError('Expected a twelve-point native hull with positive scale');
  if(state.profile.riderIndex!==hull.rider)throw new RangeError('Water riderIndex must match hull rider');
  const input=controls(options),surface=options.surface??0,contactFactor=options.contactFactor??1;
  range(contactFactor,'contactFactor',0,1);
  if(state.boundHull&&state.boundHull!==hull)throw new Error('A water state belongs to one hull');
  if(state.lastHullTick!==null&&hull.ticks!==state.lastHullTick+1)throw new Error('Apply water forces once for each consecutive hull tick');
  state.boundHull=hull;state.lastHullTick=hull.ticks;
  if(state.framePhase===0)prepareFrame(hull,state,input);
  const p=state.profile,c=state.frameControls,scale=hull.scale,toVelocity=scale/STEP;
  const {forward:f,right:r,up:u}=hull.frame;
  const bodyDelta=vec(hull.motionVelocity.x*STEP/scale,hull.motionVelocity.y*STEP/scale,hull.motionVelocity.z*STEP/scale);

  const target=nativeJetMagnitude(p,{
    speedNative:length(bodyDelta),forwardY:clamp(f.y,-1,1),rearWet:state.wet[0]||state.wet[2],
    powerSteps:c.powerSteps,powerFactor:c.powerFactor*(state.wetCount===12?.45:1),
    staticContact:!!options.staticContact,contactFactor
  });
  state.forceNative=c.throttle?target:Math.max(0,state.forceNative-.005);
  const slow=state.frameSpeedNative<p.steeringSlowFrameSpeed?
    1+(1-state.frameSpeedNative/p.steeringSlowFrameSpeed)*p.steeringSlowGain:1;
  const rawStick=Math.trunc(c.stickX*70);
  const angleIndex=Math.trunc(rawStick*p.steeringDegrees*slow/70*4096/360);
  // Regenerate trigonometry at the observed 4096-step angle, without shipping
  // the original runtime lookup table or claiming bit-identical float results.
  const angle=angleIndex*Math.PI*2/4096,cos=Math.cos(angle),sin=Math.sin(angle);
  const d=vec(cos*f.x+sin*r.x,cos*f.y+sin*r.y,cos*f.z+sin*r.z),horizontal=Math.hypot(d.x,d.z);
  const force=state.forceNative*toVelocity;
  const jet=vec(horizontal?force*d.x/horizontal:0,force*d.y,horizontal?force*d.z/horizontal:0);
  for(const index of [0,2]){
    const v=hull.points[index].velocity;v.x+=jet.x;v.y+=jet.y;v.z+=jet.z;
  }
  state.lastJet={magnitudeNative:state.forceNative,angleIndex,angleRadians:angle,velocity:jet};

  const gravity=p.gravityNative*(state.anyWet?1:p.dryGravityMultiplier);
  const balance=p.rollBalance*dot(r,state.referenceDisplacementNative);
  for(const index of LOWER)hull.points[index].velocity.y+=(gravity+(RIGHT_LOWER.has(index)?balance:-balance))*toVelocity;
  state.lastGravityNative=gravity;
  if(state.wetCount===0){
    const a=-.0045*(bodyDelta.x*u.x+bodyDelta.z*u.z);
    for(const point of hull.points){
      point.velocity.x+=.1*u.x*a*toVelocity;
      point.velocity.y+=u.y*a*toVelocity;
      point.velocity.z+=.1*u.z*a*toVelocity;
    }
  }
  const pressure=-.3*f.y*dot(bodyDelta,f),targetK=.03+(.004-.03)*clamp(pressure,0,1);
  state.buoyancyK=state.buoyancyK<.004?state.buoyancyK+.001:targetK;
  const cap=p.buoyancyCapLengthFactor*Math.max(...hull.restLengths)*state.buoyancyK/STEP;
  state.lastBuoyancy=[];
  for(let i=0;i<12;i++){
    const point=hull.points[i],water=sampleSurface(surface,point.position.x,point.position.z,hull.simulationTime);
    const denominator=Math.hypot(water.dx,1,water.dz),normal=vec(-water.dx/denominator,1/denominator,-water.dz/denominator);
    const immersion=(water.height+state.referenceOffsetWorld-point.position.y)*normal.y;
    state.wet[i]=immersion>=0;
    const impulse=state.wet[i]?Math.min(immersion*state.buoyancyK/STEP,cap):0;
    const velocity=vec(normal.x*impulse,normal.y*impulse,normal.z*impulse);
    point.velocity.x+=velocity.x;point.velocity.y+=velocity.y;point.velocity.z+=velocity.z;
    state.lastBuoyancy.push(velocity);
  }
  for(const index of UPPER)if(state.wet[index])dragGroup(hull,[index],true,p.waterLateralRetention,state.verticalDamping);
  for(const pair of DRAG_PAIRS)if(state.wet[pair[0]]||state.wet[pair[1]])dragGroup(hull,pair,true,p.waterLateralRetention,state.verticalDamping);
  if(state.wet[0]||state.wet[2])dragGroup(hull,[0,2],false,p.waterLateralRetention,state.verticalDamping);
  const stickY=Math.trunc(c.stickY*70)/70;
  state.verticalDamping=stickY<0?.85+(.91-.85)*stickY*stickY:
    .85+(.745-.85)*stickY*(state.buoyancyK-.004)/(.03-.004);
  // Wet bits are known after the fifth water pass. No later force in that tick
  // consumes these aggregate counts; the next logical frame does. Frame speed
  // is captured on its first call, after the prior tick's hull integration.
  if(state.framePhase===FRAME_TICKS-1){
    state.wetCount=state.wet.filter(Boolean).length;state.anyWet=state.wetCount>0;
  }
  state.framePhase=(state.framePhase+1)%FRAME_TICKS;
  hull.velocity=vec();
  for(const point of hull.points){
    hull.velocity.x+=point.velocity.x/12;
    hull.velocity.y+=point.velocity.y/12;
    hull.velocity.z+=point.velocity.z/12;
  }
  return state;
}
