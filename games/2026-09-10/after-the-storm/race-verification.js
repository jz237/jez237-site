import {aiInput,angleDelta,clamp} from './race-core.js';
// A full park routine using only helm, throttle, trim and stunt inputs.
export function parkMasteryInput(state,r){
 if(state.phase==='countdown')return {};
 const s=r.stunt,h=r.hydro,section=Math.min(3,s.nextCheckpoint),ramp=state.course.ramps[section],rings=state.course.rings,airIndex=section*3,waterIndex=airIndex+1,diveIndex=airIndex+2;
 const along=(r.x-ramp.x)*ramp.tx+(r.z-ramp.z)*ramp.tz;
 const v=r.parkDriver||=( {section:-1,stage:0} );if(v.section!==section){v.section=section;v.stage=0;}
 let target,desiredSpeed=17;
 if(v.stage<2){const d=v.stage===0?-30:-12;target={x:ramp.x+ramp.tx*d,z:ramp.z+ramp.tz*d};desiredSpeed=v.stage===0?9:12;if(Math.hypot(target.x-r.x,target.z-r.z)<3.5)v.stage++;}
 else if(!s.ringStatus[waterIndex]){target={x:ramp.x+ramp.tx*60,z:ramp.z+ramp.tz*60};}
 else{const p=state.course.checkpoints[section];target={x:p.x+p.tx*5,z:p.z+p.tz*5};desiredSpeed=12;}
 const error=angleDelta(Math.atan2(target.x-r.x-r.vx*.25,target.z-r.z-r.vz*.25)-r.heading);
 const input={throttle:clamp(.53+(desiredSpeed-r.speed)*.12,0,1),steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.15,dampen:true};
 if(h.airborne&&h.vy<0)input.dive=true;
 const kind=['flip','left','right','flip'][section];if(h.airborne&&(h.y-h.waterHeight>1.5||s.trick)&&Math.abs(s.angle)<6.2)input.trick=s.trick||kind;
 if(!h.airborne&&h.wet>.5&&(s.ringStatus[diveIndex]||along< -22)){
  const done=s.completedTricks;
  if(!done.somersault){input.trick=s.pose==='stand'&&s.poseTime>1?'somersault':s.pose==='somersault'?'':'stand';}
  else if(!done.handstand)input.trick=s.pose==='handstand'&&s.poseTime>1?'':'handstand';
  else if(!done.backwards)input.trick=s.pose==='backwards'&&s.poseTime>1?'':'backwards';
 }
 return input;
}
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
