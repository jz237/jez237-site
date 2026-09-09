export const RECOVERY_BANK='painted-recovery';
export const RECOVERY_FIGHTERS=['jez','benny'];

// Authored movement owns weight transfer; translating the entire standing
// normal also drags its supporting boot across the floor.
export function plantedNormal(f){
 const a=f.attacking;
 return Boolean(f.grounded&&a&&['light','heavy'].includes(a.kind)&&!a.animation&&!a.advanceSpeed&&!a.superMove);
}

export function createRecoverySelector(){
 const attacks=new WeakMap();
 return (f,tick,ready,opponent=null)=>{
  const a=f.attacking;
  if(a&&!attacks.has(a))attacks.set(a,ready);
  if(!ready||!RECOVERY_FIGHTERS.includes(f.def?.id)||!f.grounded||f.down||f.hitstunFrames||f.dizzyFrames||f.wakeupFrames||f.grabbed||f.grabbing||f.cinematicFrame!=null||f.carriedWeapon)return null;
  const pose=frame=>({bank:RECOVERY_BANK,frame});
  if(a){
   if(!attacks.get(a)||!plantedNormal(f)||f.crouch||a.cancelProfileId?.startsWith('crouch')||a.cancelProfileId?.startsWith('air'))return null;
   if(f.attackFrame>0&&f.attackFrame<a.activeStartFrame*.45&&a.limb!=='kick'&&(f.cancelledFrom||f.linkedFrom))return pose(2);
   if(f.attackFrame<a.activeEndFrame)return null;
   const duration=Math.max(1,a.totalFrames-a.activeEndFrame);
   const progress=Math.max(0,Math.min(.999,(f.attackFrame-a.activeEndFrame)/duration));
   // Never insert another fully extended strike during recovery. Begin with
   // the retracting elbow/knee, then lower into the next ready stance.
   return pose((a.limb==='kick'?4:0)+Math.min(3,Math.floor(progress*4)));
  }
  if(f.blockstunFrames>0){
   const age=tick-(f.lastImpactTick??tick),heavy=Boolean(f.lastHitHeavy);
   const recoil=age<(heavy?7:3);
   return pose(f.crouch?(recoil&&heavy?11:10):(recoil&&heavy?9:8));
  }
  // A cosmetic slip acknowledges a REAL missed attack. It grants no evade,
  // changes no hurtbox, and does not replace moving feet with a held stance.
  const other=opponent?.attacking;
  if((f.guarding||f.block)&&Math.abs(f.vx||0)<20&&other&&!opponent.attackConnected
    &&Math.abs(f.x-opponent.x)<(other.range||120)+70){
   const age=opponent.attackFrame-other.activeEndFrame;
   if(age>=0&&age<9)return pose(age<4?(f.crouch?13:12):14);
  }
  return null;
 };
}
