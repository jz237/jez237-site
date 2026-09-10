import {aiInput,angleDelta,clamp} from './race-core.js';
// Verification issues the same inputs available to a rider. It does not move
// craft, award scores, or mark objectives complete.
export function verificationInput(state,r){
 if(state.mode==='practice'){
  const ramp=state.course.ramps[0],v=r.playgroundVerification||=( {contact:false,airborne:false,landed:false,peak:0,done:false} );
  v.contact ||= r.hydro.onRamp;v.airborne ||= v.contact&&r.hydro.airborne;v.peak=Math.max(v.peak,r.hydro.y-r.hydro.waterHeight);
  if(v.airborne&&!r.hydro.airborne&&!r.hydro.onRamp&&r.hydro.wet>.4)v.landed=true;
  const along=(r.x-ramp.x)*ramp.tx+(r.z-ramp.z)*ramp.tz;
  const target=along<ramp.length/2?ramp.length/2+3:55;
  const error=angleDelta(Math.atan2(ramp.x+ramp.tx*target-r.x,ramp.z+ramp.tz*target-r.z)-r.heading);
  const stop=v.landed&&along>35;v.done=stop&&r.speed<1;
  return {throttle:stop?0:.92,steer:clamp(error*1.6,-1,1),brake:stop||Math.abs(error)>1.1,dampen:true};
 }
 const input=aiInput(state,r);if(state.mode!=='stunt')return input;
 const s=r.stunt,h=r.hydro,kind=['flip','left','right','flip'][s.nextCheckpoint%4];
 if(h.airborne&&(h.y-h.waterHeight>1.5||s.trick)&&Math.abs(s.angle)<6.20)input.trick=s.trick||kind;
 else if(!h.airborne&&h.wet>.5&&r.next%6>=4){input.trick=['stand','handstand','backwards','stand'][s.nextCheckpoint%4];if(s.pose==='stand'&&s.poseTime>1.2)input.trick='somersault';}
 return input;
}
