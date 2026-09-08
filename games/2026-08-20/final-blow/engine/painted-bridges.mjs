// Six newly painted cells: guard calibration plus five transition poses.
export const BRIDGE_BANK='painted-bridges';
export const BRIDGE_FIGHTERS=['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post'];
export function createBridgeSelector(){
 const availability=new WeakMap();
 return (fighter,ready,flowReady=false)=>{
  const a=fighter.attacking;
  if(!a||!BRIDGE_FIGHTERS.includes(fighter.def?.id))return null;
  if(!availability.has(a))availability.set(a,ready);
  if(!availability.get(a)||!ready||!fighter.grounded||fighter.crouch||a.limb==='kick'||a.superMove
   ||fighter.hitstunFrames||fighter.blockstunFrames||fighter.wakeupFrames||fighter.dizzyFrames||fighter.down||fighter.grabbed||fighter.grabbing||fighter.cinematicFrame!=null
   ||a.cancelProfileId?.startsWith('crouch')||a.cancelProfileId?.startsWith('air'))return null;
  const f=fighter.attackFrame,start=a.activeStartFrame,end=a.activeEndFrame,total=a.totalFrames;
  if(![f,start,end,total].every(Number.isFinite))return null;
  const pose=frame=>({bank:BRIDGE_BANK,frame});
  const linked=Boolean(fighter.cancelledFrom||fighter.linkedFrom);
  if(['launcher','enhancedLauncher'].includes(a.kitAction)&&f<start){
   if(f<start*.25)return linked?pose(3):null;
   return pose(f<start*.65?4:5);
  }
  if(a.animation||!['light','heavy'].includes(a.kind)||a.advanceSpeed)return null;
  if(a.kind==='heavy'&&f<start){
   if(linked&&f<start*.2)return pose(1);
   return pose(f<start*.65?2:1);
  }
  // Never replace a contact drawing, or alter combat timing to fit a picture.
  if(f<end)return null;
  const progress=(f-end)/Math.max(1,total-end);
  if(a.kind==='light'){
   const slot=Math.min(4,Math.floor(progress*5));
   if(slot<2)return pose(slot+1);
   return flowReady?{bank:'painted-flow',frame:slot+3}:null;
  }
  return progress>=.2&&progress<.6?pose(3):progress>=.6&&progress<.85?pose(2):null;
 };
}
