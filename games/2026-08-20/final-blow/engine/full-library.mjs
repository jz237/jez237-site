// Presentation-only companions for every populated Jez/Benny movement bank.
// The original pose descriptor remains authoritative for combat and anatomy.
export const FULL_LIBRARY_FIGHTERS=['jez','benny'];
export const fullLibraryBank=bank=>`full-${bank}`;
export const sourceLibraryBank=bank=>bank.startsWith('full-')?bank.slice(5):bank;
export const FULL_LIBRARY_BANKS=['base','motion','motion2','motion3','walk','specials','specials-legacy','unified','unified-ext','unified-ext2','unified-ext3','unified-ext4','unified-ext5','inbetween-unified','inbetween-unified-ext2','inbetween-unified-ext3','inbetween-unified-ext4','inbetween-unified-ext5','inbetween-specials','inbetween-approach','painted-flow','painted-bridges','painted-footwork','painted-recovery','smooth-flow','smooth-footwork','smooth-approach','smooth-contact'];

const fraction=n=>n-Math.floor(n);
export function fullLibraryAttackFrame(f,previous,alpha){
 const a=f.attacking,n=f.attackFrame;
 if(!FULL_LIBRARY_FIGHTERS.includes(f.def?.id)||!a||previous?.attack!==a||previous.grounded!==f.grounded||n-previous.frame!==1||f.hitstunFrames||f.blockstunFrames||f.down)return n;
 const phase=t=>t<a.activeStartFrame?0:t<a.activeEndFrame?1:2;
 if(phase(n)!==phase(previous.frame))return n;
 return previous.frame+(n-previous.frame)*Math.max(0,Math.min(1,alpha));
}
export function normalLibraryPhase(f,source){
 const a=f.attacking;
 if(!a||!['light','heavy'].includes(a.kind)||a.animation||a.superMove)return null;
 const n=f.attackFrame,start=a.activeStartFrame,end=a.activeEndFrame,total=a.totalFrames;
 if(![n,start,end,total].every(Number.isFinite))return null;
 if(source==='smooth-contact')return Math.min(.999999,Math.max(0,(n-start)/Math.max(1,end-start)));
 if(!['smooth-flow','painted-flow','painted-recovery','smooth-approach'].includes(source))return null;
 const p=n<start?Math.max(0,n-1)/Math.max(1,start-1):(n-end)/Math.max(1,total-end);
 if(n>=start&&n<end)return null;
 const slots=source==='smooth-approach'?2:a.advanceSpeed?(n<start?4:3):8;
 return fraction(Math.max(0,Math.min(.999999,p))*slots);
}

export function createFullLibrarySelector(){
 const entries=new WeakMap();
 return(owner,f,pose,tick,ready)=>{
  if(!owner||!FULL_LIBRARY_FIGHTERS.includes(f.def?.id)||!pose)return pose;
  if(f.preview&&tick===0)return pose;
  if(f.attacking&&f.attackFrame>=f.attacking.totalFrames)return pose;
  const source=pose.artBank||pose.bank,frame=pose.frame;
  if(!Number.isInteger(frame)||source.startsWith('full-'))return pose;
  const key=`${source}:${frame}`;
  let entry=entries.get(owner);
  if(!entry||entry.key!==key||tick<entry.tick){
   const a=f.attacking,n=f.attackFrame;
   const boundary=a?(n<a.activeStartFrame?a.activeStartFrame:n<a.activeEndFrame?a.activeEndFrame:a.totalFrames):null;
   const remaining=boundary===null?[f.dashFrames,f.wakeupFrames,f.blockstunFrames,f.hitstunFrames,f.airTechFlipFrames,f.tauntFrames,f.dizzyFrames].filter(v=>Number.isFinite(v)&&v>0):[boundary-n];
   const window=Math.min(.5,...remaining.filter(v=>v>0).map(v=>v/2));
   entry={key,tick,ready:Boolean(ready),attack:a,window};entries.set(owner,entry);
  }
  if(!ready||!entry.ready)return pose;
  // Sub-tick sampling adds a drawing without lengthening the underlying move.
  // Never cycle a held knock-out pose or reset an attack's hit timing.
  const age=tick-entry.tick;
  const phase=normalLibraryPhase(f,source);
  const contact=f.attacking&&f.attackFrame>=f.attacking.activeStartFrame&&f.attackFrame<f.attacking.activeEndFrame;
  // Contact companions preserve full reach and add follow-through after the
  // impact. Preparatory drawings precede their matching original key.
  const idleEndpoint=!f.attacking&&source==='unified'&&frame===0;
  const companion=idleEndpoint?age>=.125&&age<entry.window:phase!==null?(contact?phase>=.5:phase<.5):age<entry.window;
  return companion?{...pose,artBank:fullLibraryBank(source),sourceArtBank:source}:pose;
 };
}
