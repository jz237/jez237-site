import {getKitMoveProfile} from './fighter-kits.mjs';
import {MOVEMENT_RULES,ATTACK_LEVELS} from './defense.mjs';

export function recoveryApproach(self,observed,frame){
 if(!self.grounded||self.attacking||self.down||self.grabbed||self.grabbing||self.hitstunFrames||self.blockstunFrames||self.wakeupFrames||!observed.grounded||observed.down||!observed.attacking)return null;
 const now=observed.attackFrame+Math.max(0,frame-observed.frame);
 if(now<=observed.attackActiveEndFrame)return null;
 const remaining=observed.attackTotalFrames-now;
 const poke=getKitMoveProfile(self.kitId||self.id||self.def?.id,'light');
 if(!poke)return null;
 const gap=Math.abs(self.x-observed.x)-poke.range+8;
 const walk=self.movement?.walkForward||180;
 // Approach only while the observed recovery pays for BOTH the step and
 // startup. Re-evaluate every tick, so a stale read cannot become a charge.
 if(gap>0&&gap<65&&Math.ceil(gap/walk*60)+poke.startupFrames+4<=remaining)
   return {movement:'advance',action:null,guard:true,reason:'recovery-approach'};
 return null;
}

// Decisions use the delayed animation sample plus elapsed ticks, never live input.
export function deliberateDefense(self, observed, frame, roll) {
 if(!self.grounded||self.attacking||self.down||self.grabbed||self.grabbing||self.hitstunFrames>0||self.blockstunFrames>0||self.wakeupFrames>0)return null;
 if(!observed.attacking||!observed.grounded||observed.attackLevel===ATTACK_LEVELS.THROW)return null;
 const now=(observed.attackFrame||0)+Math.max(0,frame-observed.frame);
 if(now>=observed.attackActiveEndFrame)return null;
 const distance=Math.abs(observed.x-self.x),range=observed.attackRange||105;
 if(distance>range+42)return null;
 const remaining=observed.attackStartupFrame-now;
 const id=self.kitId||self.id||self.def?.id;
 // Interrupt only a visibly slow ordinary windup. Specials can have armor,
 // invulnerability or counters, so those remain a block/spacing decision.
 if(roll<.28&&observed.attackKind==='heavy'&&remaining>0){
  const poke=getKitMoveProfile(id,'light');
  if(poke&&distance<=poke.range-8&&poke.startupFrames+3<remaining)
   return {movement:'hold',action:'light',reason:'windup-interrupt'};
 }
 // Back-walk only when the remaining startup buys enough distance to clear
 // the swing, with stage space to spare. Still cover against delayed errors.
 const room=observed.x>self.x?self.x-MOVEMENT_RULES.stageMinX:MOVEMENT_RULES.stageMaxX-self.x;
 const travel=(self.movement?.walkBack||120)*Math.max(0,remaining-2)/60;
 const needed=Math.max(0,range+24-distance);
 if(roll<.65&&remaining>3&&distance>range*.65&&travel>=needed&&room>needed+38)
  return {movement:'retreat',action:null,guard:true,down:observed.attackLevel===ATTACK_LEVELS.LOW,reason:'spacing-defense'};
 // Cover the torso against lows and grounded mids, but stay standing against
 // overheads. This is crouch guarding, not immunity to a mid-level strike.
 if(roll<.42&&observed.attackLevel===ATTACK_LEVELS.MID)
  return {movement:'hold',action:null,guard:true,down:true,reason:'crouch-cover'};
 return null;
}
