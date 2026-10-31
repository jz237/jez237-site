import * as THREE from 'three';

const clamp = THREE.MathUtils.clamp;
/** Zero velocity at lift, crest transitions and touchdown. */
export const transferEase = (t:number) => {
  t=clamp(t,0,1);return t*t*(3-2*t);
};

/** Timing templates, adapted to the actual footholds rather than fixed world poses.
 * Directional timings mirror each other so a blocked step retraces its exact arc.
 * The proportions are animation estimates; published level/dowel trials do not
 * measure an adult descending this habitat's large sandstone edges. */
export function transferTiming(fromY:number,toY:number,top:number) {
  const rise=toY-fromY;
  const raised=Math.abs(rise)>.008||top>Math.min(fromY,toY)+.008;
  return {raised, liftEnd:rise>.008?.32:rise<-.008?.20:.28,
    lowerStart:rise>.008?.80:rise<-.008?.68:.72,
    duration:rise<-.008?.38:raised?.34:0};
}

/** A committed transfer has its own clock; gait phase only requests lift-off. */
export function footTransfer(from:THREE.Vector3,to:THREE.Vector3,top:number,
  phase:number,lift:number,settling=false,out=new THREE.Vector3()) {
  const timing=transferTiming(from.y,to.y,top),climbing=!settling&&timing.raised;
  const {liftEnd,lowerStart}=timing;
  // A descending paw retracts while it lifts. A strictly vertical lift can
  // overextend an already straight limb before it is allowed to move inward.
  // Mirror that overlap on ascent so a rejected transfer still retraces its
  // exact arc; the foothold planner and runtime contacts check this same path.
  const rise=to.y-from.y;
  const travelStart=rise<-.008?0:liftEnd,travelEnd=rise>.008?1:lowerStart;
  out.lerpVectors(from,to,transferEase(climbing?(phase-travelStart)/(travelEnd-travelStart):phase));
  if(climbing){
    const peak=Math.max(top,from.y,to.y)+.012;
    out.y=phase<liftEnd?THREE.MathUtils.lerp(from.y,peak,transferEase(phase/liftEnd))
      :phase>lowerStart?THREE.MathUtils.lerp(peak,to.y,transferEase((phase-lowerStart)/(1-lowerStart))):peak;
  }else if(!settling){
    // Smooth lift and lowering without a velocity discontinuity at contact.
    out.y+=lift*Math.sin(Math.PI*phase)**2;
  }
  return out;
}
