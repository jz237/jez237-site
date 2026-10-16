// Ordinary helm input for reconstructed source-layout Stunt courses.
// Guides only choose controls. Finite aperture and checkpoint adjudication
// remain in the simulation, including missed optional rings and player retries.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angleDelta=a=>Math.atan2(Math.sin(a),Math.cos(a));

export function sourceStuntInput(state,r){
 if(state.phase==='countdown')return {};
 const targets=state.course.stuntLayout.verificationTargets,control=state.course.stuntLayout.pilotControl??{},v=r.authoredStuntDriver??={index:0},s=r.stunt;
 const pos=q=>({x:q.navX??q.x,z:q.navZ??q.z});
 let q=targets[Math.min(v.index,targets.length-1)],p=pos(q);
 const distance=Math.hypot(p.x-r.x,p.z-r.z),ringForward=q.kind==='ring'?(r.x-q.x)*q.tx+(r.z-q.z)*q.tz:0;
 const previous=pos(targets[Math.max(0,v.index-1)]),dx=p.x-previous.x,dz=p.z-previous.z,length=Math.hypot(dx,dz)||1,ux=dx/length,uz=dz/length;
 const along=(r.x-p.x)*ux+(r.z-p.z)*uz,cross=(r.x-p.x)*uz-(r.z-p.z)*ux;
 const missed=state.course.stuntLayout.verificationOnePass&&q.kind==='ring'&&v.activeIndex===v.index&&v.ringForward*ringForward<0&&s.ringStatus[q.ringIndex]==='miss';
 const guideDone=distance<(q.radius??3)||along>0&&Math.abs(cross)<(control.guideWidth??8);
 const done=q.kind==='ring'?s.ringStatus[q.ringIndex]==='hit'||missed:q.kind==='checkpoint'?s.nextCheckpoint>q.checkpointIndex:guideDone;
 if(done&&v.index<targets.length-1){q=targets[++v.index];p=pos(q);v.recovery=false;}
 else if(q.kind==='waypoint'&&along>0&&!guideDone)v.recovery=true;
 v.activeIndex=v.index;v.ringForward=q.kind==='ring'?(r.x-q.x)*q.tx+(r.z-q.z)*q.tz:0;
 const prev=pos(targets[Math.max(0,v.index-1)]),next=pos(targets[Math.min(targets.length-1,v.index+1)]),span=Math.hypot(next.x-prev.x,next.z-prev.z)||1,tx=(next.x-prev.x)/span,tz=(next.z-prev.z)/span;
 const aim=Math.max(3.4,r.speed*.20);let desiredHeading=Math.atan2(p.x+tx*aim-r.x-r.vx*.12,p.z+tz*aim-r.z-r.vz*.12);
 if(q.kind==='waypoint'&&!v.recovery){
  const dx=p.x-prev.x,dz=p.z-prev.z,length=Math.hypot(dx,dz)||1,ux=dx/length,uz=dz/length;
  const along=(r.x-prev.x)*ux+(r.z-prev.z)*uz,cross=(r.x-prev.x)*uz-(r.z-prev.z)*ux,lateral=r.vx*uz-r.vz*ux;
  // Begin a course's authored bend before reaching its waypoint. This adjusts
  // helm input only; the physical checkpoint/ring still decides each crossing.
  const remaining=Math.max(0,length-along),blend=clamp(1-remaining/(control.bendLead??5),0,1),nx=next.x-p.x,nz=next.z-p.z,nLength=Math.hypot(nx,nz)||1;
  const forward=Math.max(5,r.speed),correction=clamp(-cross*2-lateral*.8,-forward*.8,forward*.8);
  desiredHeading=Math.atan2((ux*(1-blend)+nx/nLength*blend)*forward+uz*correction,(uz*(1-blend)+nz/nLength*blend)*forward-ux*correction);
 }else if(v.recovery)desiredHeading=Math.atan2(p.x-r.x-r.vx*.10,p.z-r.z-r.vz*.10);
 const error=angleDelta(desiredHeading-r.heading),desired=v.recovery?Math.min(q.speed??18,10):q.speed??18;
 const controls={throttle:clamp(.53+(desired-r.speed)*.16,0,1),steer:clamp(error*(control.steeringGain??2.3)-(r.yawVelocity||0)*(control.yawDamping??.24),-1,1),brake:!r.onIce&&(Math.abs(error)>1.1||r.speed>desired+2),dampen:q.dampen??true};
 if(q.dive)controls.dive=q.dive==='descending'?r.hydro.diveRemaining>0||r.hydro.airborne&&r.hydro.vy<0&&r.hydro.y-r.hydro.waterHeight>.8:true;
 if(Number.isFinite(q.lean))controls.lean=clamp(q.lean,-1,1);
 return controls;
}
