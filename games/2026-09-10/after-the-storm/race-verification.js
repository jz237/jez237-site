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
 if(state.verifyPierDive&&r.pierDiveStage!==5){
  const a=state.course.ramps.find(a=>a.id===151);
  if(a&&(r.next===state.course.gates.findIndex(g=>g.width===110)&&!state.course.reverse&&r.lap===1||r.pierDiveStage!==undefined)){
   r.pierDiveStage??=0;const stage=r.pierDiveStage,h=r.hydro;
   const path=[{x:a.x-a.tx*10,z:a.z-a.tz*10},{x:(235-210)*.8,z:(540-325)*.8},{x:(260-210)*.8,z:(580-325)*.8},{x:(310-210)*.8,z:(602-325)*.8},{x:(355-210)*.8,z:(580-325)*.8}];
   const target=path[stage];if(Math.hypot(target.x-r.x,target.z-r.z)<(stage===0?3:6)){r.pierDiveStage++;if(r.pierDiveStage===5)return aiInput(state,r);}
   const error=angleDelta(Math.atan2(target.x-r.x-r.vx*.15,target.z-r.z-r.vz*.15)-r.heading);
   return {throttle:1,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true,dive:stage===1&&h.airborne&&h.vy<0&&h.y-h.waterHeight<.6};
  }
 }

 if(state.verifyShipJump&&r.shipJumpStage!==2){
  if(r.hydro.onRamp)r.shipJumpLanding=r.hydro.landingId;
  if(r.shipJumpLanding!==undefined&&r.hydro.landingId>r.shipJumpLanding){r.shipJumpStage=2;return aiInput(state,r);}
  const a=state.course.ramps.find(a=>a.id===150);
  // Stay on the race line until the first two buoys are cleared and the
  // northern island tip has been rounded. Distance alone cuts across land.
  if(a&&(r.next===3&&r.x<72&&r.z< -180||r.shipJumpStage!==undefined)){
   r.shipJumpStage??=0;
   // Cross the lower forward hull on a westward takeoff line, avoiding the cabin.
   const heading=Math.atan2(a.tx,a.tz)-(r.shipJumpStage===1?.4:0),along=r.shipJumpStage===0?-30:60,x=a.x+Math.sin(heading)*along,z=a.z+Math.cos(heading)*along;
   if(r.shipJumpStage===0&&Math.hypot(r.x-x,r.z-z)<3)r.shipJumpStage=1;
   const error=angleDelta(Math.atan2(x-r.x-r.vx*.15,z-r.z-r.vz*.15)-r.heading);
   return {throttle:1,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true};
  }
 }

 if(state.verifyIceBalance&&r.onIce&&!r.wipeout)return {...aiInput(state,r),throttle:1,steer:1};
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
