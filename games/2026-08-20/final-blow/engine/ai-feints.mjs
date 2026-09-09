import {createFighterMove} from './fighter-kits.mjs';
import {MOVEMENT_RULES,THROW_RULES} from './defense.mjs';
import {exchangeStyle} from './ai-strategy.mjs';

// A short, committed approach -> retreat -> watch sequence. These are ordinary
// movement inputs, so an opponent can hit the bait and no fake strike deals damage.
export function feintIntent(brain,self,opponent,frame,roll,timeRemaining=99) {
 if(!self.grounded||self.attacking||self.down||self.grabbed||self.grabbing||self.hitstunFrames||self.blockstunFrames||self.wakeupFrames||!opponent.grounded||opponent.down||timeRemaining<18||self.health<25){brain.feint=null;return null;}
 const direction=Math.sign(opponent.x-self.x)||1;
 const distance=Math.abs(opponent.x-self.x);
 const room=direction>0?self.x-MOVEMENT_RULES.stageMinX:MOVEMENT_RULES.stageMaxX-self.x;
 if(opponent.attacking||room<80){brain.feint=null;return null;}
 if(brain.feint){
  const age=frame-brain.feint.started;
  if(age>=30||brain.feint.direction!==direction){brain.feint=null;return null;}
  const phase=age<7?'approach':age<21?'retreat':'watch';
  return {movement:phase==='approach'?'advance':phase==='retreat'?'retreat':'hold',action:null,guard:phase!=='approach',reason:'feint-'+phase};
 }
 const reach=createFighterMove(opponent.fighterId||'jez','heavy')?.range||170;
 const style=exchangeStyle(self.kitId||self.id||self.def?.id);
 if(frame-(brain.lastFeintFrame??-Infinity)<300||roll>=style.bait||distance<Math.max(THROW_RULES.grabRange+60,reach+20)||distance>reach+110||opponent.guarding)return null;
 brain.lastFeintFrame=frame;brain.feint={started:frame,direction};
 return {movement:'advance',action:null,reason:'feint-approach'};
}

export function blockedStringAlternative(brain,self,opponent,frame,roll) {
 if(!(frame<=brain.blockedPlanUntil)||self.attacking||!self.grounded||self.hitstunFrames||self.blockstunFrames||self.down||self.wakeupFrames||opponent.attacking||!opponent.grounded||opponent.down)return null;
 if(!opponent.guarding)return null;
 const distance=Math.abs(opponent.x-self.x),id=self.kitId||self.id||self.def?.id;
 if(distance<THROW_RULES.grabRange-12&&roll<.35)return {movement:'hold',action:'throw',reason:'blocked-string-throw'};
 const low=createFighterMove(id,'light',{crouching:true});
 if(!opponent.crouching&&low&&distance<=low.range&&roll<.72)return {movement:'hold',action:'light',down:true,reason:'blocked-string-low'};
 const room=opponent.x>self.x?self.x-MOVEMENT_RULES.stageMinX:MOVEMENT_RULES.stageMaxX-self.x;
 return room>100?{movement:'retreat',action:null,guard:true,reason:'blocked-string-reset'}:null;
}
