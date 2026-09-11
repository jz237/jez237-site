import {wave} from './simulation.js';
import {aiInput,angleDelta,clamp} from './race-core.js';
// A full park routine using only helm, throttle, trim and stunt inputs.
export function parkMasteryInput(state,r){
 if(state.course.stuntLayout)return authoredParkInput(state,r);
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
 if(state.verifyFortressRidge&&state.course.id==='citadel'&&!state.course.reverse&&r.lap===1){
  const z=r.z/.8+300;
  if(z<195&&!r.fortressRidge)r.fortressRidge={waitAt:null,done:false};
  const guide=r.fortressRidge;
  if(guide&&!guide.done){
   if(z<126)guide.done=true;
   else{if(z<175&&guide.waitAt===null)guide.waitAt=state.time;
    const waiting=guide.waitAt!==null&&state.time<guide.waitAt+(state.ridgeWait??4.5);
    const error=angleDelta(Math.atan2((81-210)*.8-r.x-r.vx*.12,(100-300)*.8-r.z-r.vz*.12)-r.heading);
    return {throttle:waiting?0:1,brake:waiting,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),lean:1,dampen:true};
   }
  }
 }

 if(state.verifyDrakeInner&&state.course.id==='reed'){
  if(r.next===(state.course.reverse?14:4)&&r.drakeInner?.lap!==r.lap)r.drakeInner={lap:r.lap,stage:0};
  const guide=r.drakeInner,path=[[277,77],[269,84],[251,96],[239,state.course.reverse?101:103],[200,107],[168,103],[139,93],[112,78]];
  if(state.course.reverse)path.reverse();
  if(guide?.lap===r.lap&&guide.stage<path.length){const p=path[guide.stage],x=(p[0]-200)*.75,z=(p[1]-240)*.75,anticipation=state.course.reverse?.25:.15,error=angleDelta(Math.atan2(x-r.x-r.vx*anticipation,z-r.z-r.vz*anticipation)-r.heading);
   if(Math.hypot(x-r.x,z-r.z)<2)guide.stage++;
   return {throttle:.32,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true};
  }
 }

 if(state.verifySunsetShortcut&&state.course.id==='amber'&&!state.course.reverse&&r.lap===state.laps){
  if(r.next===state.course.gates.length-4&&r.z<(455-275)*.75&&r.x>(445-245)*.75)r.sunsetShortcut=true;
  if(r.sunsetShortcut){const x=(410-245)*.75,z=(290-275)*.75,error=angleDelta(Math.atan2(x-r.x-r.vx*.18,z-r.z-r.vz*.18)-r.heading);return {throttle:1,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true};}
 }

 if(state.verifyPierSurface&&r.lap>1){
  if(r.next===state.course.gates.findIndex(g=>g.width===110)&&r.pierSurface?.lap!==r.lap)r.pierSurface={lap:r.lap,stage:0};
  const guide=r.pierSurface,path=state.course.reverse?[[355,580],[310,602],[260,602],[236,590],[236,560],[236,495],[210,470],[170,455]]:[[160,450],[168,484],[236,495],[236,542],[260,580],[310,602],[355,580]];
  if(guide&&guide.lap===r.lap&&guide.stage<path.length){
   const point=path[guide.stage],x=(point[0]-210)*.8,z=(point[1]-325)*.8;
   if(state.course.reverse&&guide.stage===4&&Math.hypot(x-r.x,z-r.z)<5){
    const clear=[1.5,2,2.5,3,3.5].every(t=>wave(x,(526-325)*.8,state.time+t,state.weather.storm)<-.7);
    if(!clear)return {throttle:0,brake:true,dampen:true};
   }
   if(Math.hypot(x-r.x,z-r.z)<(guide.stage===(state.course.reverse?4:2)?2:5))guide.stage++;
   const error=angleDelta(Math.atan2(x-r.x-r.vx*.15,z-r.z-r.vz*.15)-r.heading);
   return {throttle:.65,steer:clamp(error*2.4-(r.yawVelocity||0)*.12,-1,1),brake:Math.abs(error)>1.1,dampen:true};
  }
 }

 if(state.verifyPierDive&&r.pierDiveStage!==5){
  const a=state.course.ramps.find(a=>a.id===151);
  if(a&&(r.next===state.course.gates.findIndex(g=>g.width===110)&&!state.course.reverse&&r.lap===1||r.pierDiveStage!==undefined)){
   r.pierDiveStage??=0;const stage=r.pierDiveStage,h=r.hydro;
   // Expert approaches from its extra western buoy; use the southern side of the same pile gap.
   const path=[{x:a.x-a.tx*10,z:a.z-a.tz*10},{x:((state.difficulty===2?232:235)-210)*.8,z:(540-325)*.8},{x:(260-210)*.8,z:(580-325)*.8},{x:(310-210)*.8,z:(602-325)*.8},{x:(355-210)*.8,z:(580-325)*.8}];
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
 if(state.mode==='practice'&&state.course.stuntLayout){const h=r.hydro,v=r.playgroundVerification||={contact:false,airborne:false,landed:false,peak:0,done:false};if(h.onRamp&&!v.contact){v.contact=true;v.landing=h.landingId;}if(v.contact){v.airborne||=h.airborne;v.peak=Math.max(v.peak,h.y-h.waterHeight);v.landed||=h.landingId>v.landing;v.done=v.landed&&r.stunt.rings>0;}return authoredParkInput(state,r);}
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
 if(state.mode==='stunt'&&state.course.stuntLayout?.verificationTargets)return authoredStuntInput(state,r);
 const input=aiInput(state,r);if(state.mode!=='stunt')return input;
 const s=r.stunt,h=r.hydro,kind=['flip','left','right','flip'][s.nextCheckpoint%4];
 if(h.airborne&&(h.y-h.waterHeight>1.5||s.trick)&&Math.abs(s.angle)<6.20)input.trick=s.trick||kind;
 else if(!h.airborne&&h.wet>.5&&r.next%6>=4){input.trick=['stand','handstand','backwards','stand'][s.nextCheckpoint%4];if(s.pose==='stand'&&s.poseTime>1.2)input.trick='somersault';}
 return input;
}

// Follow the original park objects using ordinary inputs; only the simulation
// may mark rings, tricks and checkpoint crossings.
function authoredParkInput(state,r){
 if(state.phase==='countdown')return {};
 const c=state.course,s=r.stunt,h=r.hydro;
 const driver=r.authoredParkDriver||={index:0,activeRamp:-1};
 const ring=i=>({...c.rings[i],kind:'ring'}),cp=i=>({...c.stuntLayout.checkpoints[i],kind:'checkpoint'}),ramp=i=>({...c.ramps[i],kind:'ramp',rampIndex:i});
 const targets=[ring(0),ring(1),ring(2),cp(0),ring(3),ring(4),ring(5),ring(6),cp(1),ramp(0),ramp(1),ramp(2),cp(2),ring(7),ring(8),ramp(3),ring(9),cp(3)];
 let q=targets[Math.min(driver.index,targets.length-1)];
 const along=(r.x-q.x)*q.tx+(r.z-q.z)*q.tz;
 if(q.kind==='ramp'&&along> -10&&along<8)driver.activeRamp=q.rampIndex;
 if(along>(q.kind==='ramp'?q.length/2:1)&&driver.index<targets.length-1){driver.index++;q=targets[driver.index];}
 const aim=q.kind==='ramp'?q.length/2+5:5,error=angleDelta(Math.atan2(q.x+q.tx*aim-r.x-r.vx*.15,q.z+q.tz*aim-r.z-r.vz*.15)-r.heading),desired=q.kind==='ramp'?12:13;
 const input={throttle:clamp(.53+(desired-r.speed)*.15,0,1),steer:clamp(error*2.5-(r.yawVelocity||0)*.15,-1,1),brake:Math.abs(error)>1.2,dampen:true,lean:q.kind==='ramp'?-1:0};
 if(h.airborne&&driver.activeRamp>=0){const kind=['flip','left','right','flip'][driver.activeRamp];if(h.y-h.waterHeight>1.2||s.trick){if(Math.abs(s.angle)<6.2)input.trick=s.trick||kind;}if(driver.activeRamp===3&&h.vy<0)input.dive=true;}
 if(!h.airborne&&h.wet>.5){const done=s.completedTricks;if(!done.somersault)input.trick=s.pose==='stand'&&s.poseTime>1?'somersault':s.pose==='somersault'?'':'stand';else if(!done.handstand)input.trick=s.pose==='handstand'&&s.poseTime>2?'':'handstand';else if(!done.backwards)input.trick=s.pose==='backwards'&&s.poseTime>2?'':'backwards';}
 return input;
}

// Authored stunt routes have different object counts and spacing per venue.
function authoredStuntInput(state,r){
 if(state.phase==='countdown')return {};
 const targets=state.course.stuntLayout.verificationTargets,v=r.authoredStuntDriver||={index:0},h=r.hydro,s=r.stunt;
 if(h.onRamp){v.rampJump=true;v.rampLanding=h.landingId;}else if(h.landingId>v.rampLanding)v.rampJump=false;
 let q=targets[Math.min(v.index,targets.length-1)],along=(r.x-q.x)*q.tx+(r.z-q.z)*q.tz;
 if(along>(q.kind==='ramp'?q.length/2:1)&&v.index<targets.length-1)q=targets[++v.index];
 const aim=q.kind==='ramp'?q.length/2+4:1.3,error=angleDelta(Math.atan2(q.x+q.tx*aim-r.x-r.vx*.12,q.z+q.tz*aim-r.z-r.vz*.12)-r.heading);
 const input={throttle:clamp(.53+(13-r.speed)*.16,0,1),steer:clamp(error*2.5-(r.yawVelocity||0)*.15,-1,1),brake:Math.abs(error)>1.1,dampen:true,lean:q.kind==='ramp'?-1:0};
 if(v.rampJump&&h.airborne&&(h.y-h.waterHeight>1.2||s.trick)&&Math.abs(s.angle)<6.2)input.trick=s.trick||'flip';
 else if(!h.airborne&&h.wet>.5&&q.kind!=='ramp')input.trick=s.pose==='handstand'&&s.poseTime>2?'':'handstand';
 return input;
}
