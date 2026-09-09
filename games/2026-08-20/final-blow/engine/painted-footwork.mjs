export const FOOTWORK_BANK='painted-footwork';
export const FOOTWORK_FIGHTERS=['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post'];
// Distance-driven shuffles keep their cadence when walking speed changes.
// This observer is presentation-only and never changes movement or hit timing.
export function createFootworkSelector(){
 const history=new WeakMap(),attacks=new WeakMap();
 return (owner,f,tick,ready)=>{
  if(!owner||!FOOTWORK_FIGHTERS.includes(f.def?.id))return null;
  let h=history.get(owner);
  if(!h||tick<h.tick){h={tick,x:f.x||0,distance:0,moving:false,grounded:f.grounded,stop:-Infinity,land:-Infinity,turn:-Infinity,direction:Math.sign(f.vx||0)};history.set(owner,h);}
  const moving=f.grounded&&!f.attacking&&Math.abs(f.vx||0)>20;
  if(tick>h.tick){
   const direction=Math.sign(f.vx||0);
   if(moving&&h.moving&&direction!==h.direction){h.turn=tick;h.distance=0;}
   if(moving&&h.moving)h.distance+=Math.min(40,Math.abs((f.x||0)-h.x));
   if(!moving&&h.moving)h.stop=tick;
   if(f.grounded&&!h.grounded)h.land=tick;
   if(moving&&!h.moving)h.distance=0;
   Object.assign(h,{tick,x:f.x||0,moving,grounded:f.grounded,direction});
  }
  const a=f.attacking;
  if(a&&!attacks.has(a))attacks.set(a,ready);
  if(!ready||f.down||f.hitstunFrames||f.dizzyFrames||f.wakeupFrames||f.grabbed||f.grabbing||f.cinematicFrame!=null||f.carriedWeapon)return null;
  const pose=frame=>({bank:FOOTWORK_BANK,frame});
  if(a){
   if(!attacks.has(a))attacks.set(a,ready);
   if(!attacks.get(a)||a.animation||a.superMove||a.advanceSpeed)return null;
   const frame=f.attackFrame,start=a.activeStartFrame,end=a.activeEndFrame,total=a.totalFrames;
   if(frame>=start&&frame<end)return null;
   const prep=frame/Math.max(1,start),recover=(frame-end)/Math.max(1,total-end);
   const air=a.cancelProfileId?.startsWith('air')||!f.grounded;
   const low=a.cancelProfileId?.startsWith('crouch')||f.crouch;
   if(air&&f.grounded)return null;
   if(air)return a.limb==='kick'&&prep>=.3&&prep<1?pose(13):a.limb!=='kick'&&recover>=.2&&recover<.6?pose(14):null;
   if(low)return a.limb!=='kick'&&prep>=.4&&prep<1?pose(11):a.limb==='kick'&&recover>=.2&&recover<.7?pose(12):null;
   return a.limb==='kick'&&prep>=.45&&prep<.6?pose(10):null;
  }
  if(!f.grounded||f.dashFrames>0)return null;
  if(f.blockstunFrames>0){
   const low=f.crouch,age=tick-(f.lastImpactTick??tick);
   return pose(age>=0&&age<(f.lastHitHeavy?7:3)?(low?9:8):(low?7:6));
  }
  if(tick-h.land<6)return pose(15);
  if(moving){if(tick-h.turn<3)return pose(5);const step=Math.floor(h.distance/24)%4;return pose((f.vx*f.facing>=0?[0,1,2,5]:[0,3,4,5])[step]);}
  if(tick-h.stop<6)return pose(5);
  if(f.block||f.guarding)return pose(f.crouch?7:6);
  return null;
 };
}
