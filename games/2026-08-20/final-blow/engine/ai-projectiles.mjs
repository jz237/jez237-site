import {MOVEMENT_RULES,FIGHTER_SCALE} from './defense.mjs';
import {getFighterKit,getKitMoveProfile} from './fighter-kits.mjs';
// The caller supplies only reaction-delayed snapshots of visible projectiles.
export function projectileIntent(self,observation,frame,roll=.5){
 if(!self.grounded || self.attacking || self.down || self.grabbed || self.grabbing || self.wakeupFrames || self.hitstunFrames)return null;
 const age=Math.max(0,frame-observation.frame),threats=[];
 for(const shot of observation.projectiles||[]){
  if(shot.lifeFrames<=age || shot.armFrames>age+30)continue;
  const x=shot.x+shot.vx*age/60,dx=self.x-x;
  if(shot.vx && Math.sign(dx)!==Math.sign(shot.vx))continue;
  const distance=Math.max(0,Math.abs(dx)-(shot.width||0)/2-38);
  const eta=shot.vx?distance/Math.abs(shot.vx)*60:distance<55?0:Infinity;
  if(eta<65)threats.push({...shot,eta,distance});
 }
 threats.sort((a,b)=>a.eta-b.eta);const first=threats[0];
 if(!first)return null;
 const id=self.kitId||self.id||self.def?.kitId||self.def?.id;
 const layered=threats.some((shot,index)=>index>0&&shot.eta-first.eta<30);
 const counter=getFighterKit(id)?.ai?.rangedAction;
 const counterMove=counter&&getKitMoveProfile(id,counter),shot=counterMove?.projectile;
 // Counter with a real projectile clash, not a melee counter stance that
 // cannot catch fireballs in this engine.
 const ownY=self.y+(shot?.yOffsets?.[0]??-110)*FIGHTER_SCALE;
 if(!layered && shot?.speed>0 && Math.abs(ownY-first.y)<(shot.height*FIGHTER_SCALE+first.height)/2
   && first.eta>(shot.spawnFrames?.[0]??counterMove.startupFrames)+8 && roll<.25)
  return {movement:'hold',action:counter,reason:'projectile-counter'};
 const landingRoom=observation.x>self.x?MOVEMENT_RULES.stageMaxX-self.x:self.x-MOVEMENT_RULES.stageMinX;
 const meet=first.distance/(Math.abs(first.vx)+MOVEMENT_RULES.forwardJumpVelocityX);
 const feet=self.y+MOVEMENT_RULES.jumpVelocityY*meet+.5*Math.round(2180*FIGHTER_SCALE)*meet*meet;
 const clears=feet+10<first.y-first.height/2;
 if(clears && first.vx && !layered && first.eta>=15 && first.eta<=38 && landingRoom>200 && roll<.42)
  return {movement:'advance',action:null,jump:true,reason:'projectile-jump'};
 if(first.eta<24 || layered || !first.vx)
  return {movement:'hold',action:null,guard:true,down:first.level==='low',reason:'projectile-block'};
 return {movement:'advance',action:null,guard:false,reason:'projectile-advance'};
}
