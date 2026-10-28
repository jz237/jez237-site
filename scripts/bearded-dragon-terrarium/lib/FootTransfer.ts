import * as THREE from 'three';

const clamp = THREE.MathUtils.clamp;
/** Zero velocity at lift, crest transitions and touchdown. */
export const transferEase = (t:number) => {
  t=clamp(t,0,1);return t*t*(3-2*t);
};

/** A committed transfer has its own clock; gait phase only requests lift-off. */
export function footTransfer(from:THREE.Vector3,to:THREE.Vector3,top:number,
  phase:number,lift:number,settling=false,out=new THREE.Vector3()) {
  const climbing=!settling&&(Math.abs(to.y-from.y)>.008||top>Math.min(to.y,from.y)+.008);
  out.lerpVectors(from,to,transferEase(climbing?(phase-.28)/.44:phase));
  if(climbing){
    const peak=Math.max(top,from.y,to.y)+.012;
    out.y=phase<.28?THREE.MathUtils.lerp(from.y,peak,transferEase(phase/.28))
      :phase>.72?THREE.MathUtils.lerp(peak,to.y,transferEase((phase-.72)/.28)):peak;
  }else if(!settling){
    // Smooth lift and lowering without a velocity discontinuity at contact.
    out.y+=lift*Math.sin(Math.PI*phase)**2;
  }
  return out;
}
