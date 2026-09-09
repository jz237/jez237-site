// Doubled presentation slots for Jez and Benny. Never changes combat clocks.
import {SMOOTH_REGISTRATION} from './smooth-registration.mjs';
export function smoothVerticalOffset(id,bank,frame,height=0){
 const r=SMOOTH_REGISTRATION[id]?.[bank]?.[frame];
 if(!r)return null;
 return r.floor+(162-r.center-r.floor)*Math.max(0,Math.min(1,height/110));
}
export const SMOOTH_FIGHTERS=['jez','benny'];
export const SMOOTH_BANKS=['smooth-flow','smooth-footwork','smooth-approach','smooth-contact'];
const pose=(bank,frame)=>({bank,frame});
const flow=i=>pose('painted-flow',i),recovery=i=>pose('painted-recovery',i),fresh=i=>pose('smooth-flow',i);
export const SMOOTH_TRACKS={
 punchPrep:[flow(0),fresh(0),flow(1),fresh(1),fresh(2),flow(2),fresh(3),flow(3)],
 kickPrep:[flow(8),fresh(8),flow(9),fresh(9),flow(10),fresh(10),flow(11),fresh(11)],
 punchReturn:[recovery(0),fresh(4),fresh(5),recovery(1),fresh(6),recovery(2),fresh(7),recovery(3)],
 kickReturn:[recovery(4),fresh(12),recovery(5),fresh(13),recovery(6),fresh(14),fresh(15),recovery(7)],
};
const slot=(p,n)=>Math.max(0,Math.min(n-1,Math.floor(p*n)));
// Only interpolate presentation within the same attack and phase. Contact,
// landing, cancels and hitstop retain the authoritative simulation pose.
export function smoothAttackFrame(f,previous,alpha){
 const a=f.attacking,n=f.attackFrame;
 if(!SMOOTH_FIGHTERS.includes(f.def?.id)||!a||!['light','heavy'].includes(a.kind)
  ||a.animation||a.superMove||a.advanceSpeed||f.hitstunFrames||f.blockstunFrames||f.down
  ||previous?.attack!==a
  ||previous.grounded!==f.grounded||n-previous.frame!==1
  ||n>=a.activeStartFrame&&n<a.activeEndFrame)return n;
 const start=n>=a.activeEndFrame?Math.max(a.activeEndFrame,previous.frame):previous.frame;
 return start+(n-start)*Math.max(0,Math.min(1,alpha));
}
export function createSmoothSelector(){
 const moves=new WeakMap(),history=new WeakMap();
 return (owner,f,tick,ready,opponent=null)=>{
  if(!owner||!SMOOTH_FIGHTERS.includes(f.def?.id))return null;
  const a=f.attacking;
  if(a&&!moves.has(a))moves.set(a,ready);
  let h=history.get(owner);if(!h||tick<h.tick){h={tick,x:f.x||0,distance:0,direction:Math.sign(f.vx||0),turn:-Infinity,moving:false,guarding:false,guard:tick};history.set(owner,h);}
  if(tick>h.tick){const direction=Math.sign(f.vx||0);if(direction&&direction!==h.direction){h.distance=0;h.turn=tick;}const moving=f.grounded&&!a&&Math.abs(f.vx||0)>20;
   if(moving&&h.moving)h.distance+=Math.min(40,Math.abs((f.x||0)-h.x));else h.distance=0;
   const guarding=Boolean(f.block||f.guarding);if(guarding&&!h.guarding)h.guard=tick;
   Object.assign(h,{tick,x:f.x||0,direction,moving,guarding});}
  if(!ready||f.down||f.hitstunFrames||f.dizzyFrames||f.wakeupFrames||f.grabbed||f.grabbing||f.cinematicFrame!=null||f.carriedWeapon)return null;
  if(a){
   if(!moves.get(a)||!['light','heavy'].includes(a.kind)||a.animation||a.superMove||a.advanceSpeed)return null;
   const frame=f.attackFrame,start=a.activeStartFrame,end=a.activeEndFrame,total=a.totalFrames;
   if(![frame,start,end,total].every(Number.isFinite))return null;
   const prep=frame<start,p=prep?Math.max(0,frame-1)/Math.max(1,start-1):(frame-end)/Math.max(1,total-end),kick=a.limb==='kick';
   const air=!f.grounded||a.cancelProfileId?.startsWith('air'),low=f.crouch||a.cancelProfileId?.startsWith('crouch');
   if(air&&f.grounded)return null;
   if(air||low){
    const base=(air?8:0)+(kick?4:0);
    if(frame>=start&&frame<end)return pose('smooth-contact',base+1);
    return pose('smooth-approach',base+(prep?slot(p,2):kick?2+slot(p,2):slot(p,2)?3:1));
   }
   if(frame>=start&&frame<end)return null;
   return SMOOTH_TRACKS[(kick?'kick':'punch')+(prep?'Prep':'Return')][slot(p,8)];
  }
  if(!f.grounded||f.dashFrames>0)return null;
  const moving=Math.abs(f.vx||0)>20;
  if(moving&&!f.blockstunFrames){
   if(tick-h.turn<3)return null;
   const step=Math.floor(h.distance/12)%8;if(step%2===0)return null;
   return pose('smooth-footwork',(f.vx*f.facing>=0?0:4)+Math.floor(step/2));
  }
  if(f.blockstunFrames>0){
   const age=tick-(f.lastImpactTick??tick);
   if(age>=(f.lastHitHeavy?3:1)&&age<(f.lastHitHeavy?6:3))return pose('smooth-footwork',f.crouch?11:9);
  }
  const other=opponent?.attacking;
  if((f.block||f.guarding)&&!moving&&other&&!opponent.attackConnected&&Math.abs(f.x-opponent.x)<(other.range||120)+70){
   const age=opponent.attackFrame-other.activeEndFrame;
   if(age>=1&&age<3)return pose('smooth-footwork',f.crouch?13:12);
   if(age>=5&&age<7)return pose('smooth-footwork',f.crouch?15:14);
  }
  // A half-raised cover, only while settling into a held guard.
  if((f.block||f.guarding)&&!moving&&tick-h.guard<2)return pose('smooth-footwork',f.crouch?10:8);
  return null;
 };
}
