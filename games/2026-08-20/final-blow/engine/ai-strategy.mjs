import {signatureNext} from "./signature-routes.mjs";
import {MOVEMENT_RULES, THROW_RULES} from './defense.mjs';
import {canCancelAttack, GRIT_RULES, COMBO_RULES} from './combos.mjs';
import {getFighterKit,getKitMoveProfile,fighterActionGroup} from './fighter-kits.mjs';

export const FIGHT_STYLES=Object.freeze({
  jez:{name:'calculated',range:170,initiative:.45,dash:.12,reset:30},
  benny:{name:'rushdown',range:110,initiative:.82,dash:.65,reset:18},
  alan:{name:'counterpuncher',range:185,initiative:.35,dash:.05,reset:34},
  ali:{name:'combination fighter',range:130,initiative:.76,dash:.5,reset:20},
  commissioner:{name:'reach control',range:190,initiative:.5,dash:.08,reset:32},
  cyraxx:{name:'space traps',range:230,initiative:.46,dash:.1,reset:30},
  deathblow:{name:'grappler',range:105,initiative:.7,dash:.3,reset:26},
  devil:{name:'power pressure',range:180,initiative:.67,dash:.25,reset:24},
  donald:{name:'projectile keepaway',range:285,initiative:.4,dash:.04,reset:36},
  post:{name:'trap keepaway',range:250,initiative:.38,dash:.07,reset:38},
});
export function fighterStyle(id){return FIGHT_STYLES[id] || FIGHT_STYLES.jez;}
// Number of distinct committed moves, rather than hits in a multi-hit special.
export const EXCHANGE_STYLES=Object.freeze({
 jez:{moves:3,bait:.22,punish:.9}, benny:{moves:3,bait:.06,punish:.7},
 alan:{moves:2,bait:.25,punish:.96}, ali:{moves:4,bait:.1,punish:.75},
 commissioner:{moves:2,bait:.18,punish:.9}, cyraxx:{moves:2,bait:.16,punish:.7},
 deathblow:{moves:2,bait:.08,punish:.8}, devil:{moves:3,bait:.09,punish:.78},
 donald:{moves:2,bait:.2,punish:.76}, post:{moves:2,bait:.18,punish:.74},
});
export function exchangeStyle(id){return EXCHANGE_STYLES[id]||EXCHANGE_STYLES.jez;}
export function roundStrategy(self,opponent,timeRemaining=99){
  const lead=self.health-opponent.health;
  if(timeRemaining<=12 && lead<0)return 'desperation';
  if(timeRemaining<=25 && lead>=12)return 'protect-lead';
  if(lead<=-25 || (timeRemaining<=25 && lead<=-8))return 'chase';
  return 'balanced';
}
export function moveReaches(move,distance){
  if(!move)return false;
  const projectile=move.projectile;
  const projectileReach=projectile ? Math.abs(projectile.speed||0)*(projectile.lifeFrames||0)/60
    + Math.max(0,...(projectile.xOffsets||[]))+(projectile.width||0)/2 : 0;
  const trapReach=move.trap ? Math.max(0,...(move.trap.offsets||[]))+(move.trap.radius||0) : 0;
  return distance<=Math.max(move.range||0,projectileReach,trapReach);
}
export function comboObjective(self,opponent){
 const room=opponent.x>self.x?MOVEMENT_RULES.stageMaxX-opponent.x:opponent.x-MOVEMENT_RULES.stageMinX;
 return opponent.health<=24?'finish':room<170?'knockdown':'corner-carry';
}
export function scoreComboOption(option,self,opponent){
 const {move,cost}=option;
 const scale=COMBO_RULES.hitScales[Math.min(self.combo?.hits||0,COMBO_RULES.hitScales.length-1)];
 const damage=(move.damage||0)*(1+Math.max(0,(move.maxHits||1)-1)*.52)*scale;
 if(damage>=opponent.health)return 1000-cost*2-(move.startupFrames||0);
 const objective=comboObjective(self,opponent);
 const knockdown=Boolean(move.knockdown||move.knockdownOnFinal||move.launchVelocityY);
 return damage-cost*.12+(objective==='corner-carry'?Math.min(30,(move.push||0)*.06):objective==='knockdown'&&knockdown?35:0);
}
export function selectComboContinuation(id,self,opponent,roll=.5){
  if(self.attackConnected!=='hit' || !self.attacking || self.confirmWindowFrames===0)return null;
  const moves=self.aiBrain?.exchangeMoves||1;
  const budget=exchangeStyle(id).moves;
  // A successful opener earns a short route. A nearly defeated opponent can
  // justify one extra finisher, but never an unbounded succession of cancels.
  if(moves>=budget+(opponent.health<=24?1:0))return null;
  if(self.attacking.rhythmCancel && self.rhythmStacks<(self.attacking.rhythmCancelStacks||2))return null;
  const distance=Math.abs(self.x-opponent.x);
  const actions=['light','heavy','special','commandSpecial','backSpecial','launcher','enhanced','enhancedCommandSpecial','enhancedBackSpecial','enhancedLauncher','super'];
  const options=[];
  for(const action of actions){
    const move=getKitMoveProfile(id,action,{airborne:!self.grounded,crouching:self.crouch});
    if(!move || !canCancelAttack(self.attacking,fighterActionGroup(action),self.attackFrame,'hit'))continue;
    const cost=move.gritCost || (action==='super'?100:action.startsWith('enhanced')?25:0);
    if(cost>self.meter || !moveReaches(move,distance))continue;
    // Keep a defensive reserve on low life unless this hit can close the round.
    if(cost && self.health<30 && self.meter-cost<GRIT_RULES.guardReversalCost && opponent.health>move.damage)continue;
    options.push({action,move,cost});
  }
  const signature=signatureNext(id,self.attacking.kitAction,self.aiBrain?.signatureVariant||0);
  const score=option=>scoreComboOption(option,self,opponent)
    +(signature.includes(option.action)?Math.max(0,36-signature.indexOf(option.action)*18):0)
    +(moves>=budget-1&&(option.move.knockdown||option.move.knockdownOnFinal||option.move.launchVelocityY)?28:0);
  options.sort((a,b)=>score(b)-score(a));
  const best=options.find(option=>option.cost===0 || roll<.78);
  return best?.action || null;
}
export function meterOpportunity(self,opponent,frame,action){
  if(!['super','enhanced','enhancedCommandSpecial','enhancedBackSpecial','enhancedLauncher'].includes(action))return true;
  if(action==='enhanced' && self.grounded && self.blockstunFrames>0 && self.meter>=GRIT_RULES.guardReversalCost)return true;
  const id=self.kitId||self.id||self.def?.kitId||self.def?.id;
  const move=getKitMoveProfile(id,action,{airborne:!self.grounded,crouching:self.crouch});
  if(!moveReaches(move,Math.abs(self.x-opponent.x)))return false;
  if(self.attackConnected==='hit' && self.attacking && self.confirmWindowFrames!==0)
    return canCancelAttack(self.attacking,fighterActionGroup(action),self.attackFrame,'hit');
  const now=opponent.attackFrame+Math.max(0,frame-opponent.frame);
  if(action==='enhancedLauncher' && self.wakeupFrames>0 && self.wakeupFrames<=4
    && self.meter>=GRIT_RULES.enhancedSpecialCost && opponent.attacking && now<=opponent.attackActiveEndFrame)return true;
  const recovery=opponent.attacking && now>opponent.attackActiveEndFrame ? opponent.attackTotalFrames-now : 0;
  return !opponent.guarding && recovery>=move.startupFrames+2;
}
export function strategicIntent({id,self,opponent,frame,timeRemaining,roll,until=0,previousMovement}){
  if(!self.grounded || self.attacking || self.down || self.wakeupFrames || self.hitstunFrames || self.blockstunFrames || self.grabbed || self.grabbing)return null;
  const style=fighterStyle(id), kit=getFighterKit(id)?.ai;
  const distance=Math.abs(self.x-opponent.x), right=opponent.x>self.x;
  const room=right?self.x-MOVEMENT_RULES.stageMinX:MOVEMENT_RULES.stageMaxX-self.x;
  const opponentRoom=right?MOVEMENT_RULES.stageMaxX-opponent.x:opponent.x-MOVEMENT_RULES.stageMinX;
  const plan=roundStrategy(self,opponent,timeRemaining);
  const move=(action,reason,extra={})=>{
    const profile=getKitMoveProfile(id,action,{crouching:extra.down,limb:extra.limb});
    return moveReaches(profile,distance)?{movement:'hold',action,reason,...extra}:null;
  };
  if(room<85 && distance<280 && !opponent.down){
    if(!opponent.attacking && distance>170)return {movement:'advance',action:null,dash:true,reason:'corner-escape'};
    if(!opponent.attacking && roll<.4)return {movement:'advance',action:null,jump:true,reason:'corner-escape'};
    return move('light','corner-counter') || {movement:'hold',action:null,guard:true,reason:'corner-defense'};
  }
  // A brief reset belongs between finished exchanges, never inside a combo.
  if(frame<until && plan!=='desperation')return {movement:distance<style.range+35&&room>100?'retreat':'hold',action:null,guard:true,reason:'exchange-reset'};
  if(plan==='protect-lead'){
    if(distance<style.range+65 && room>100)return {movement:'retreat',action:null,guard:true,reason:'protect-lead'};
    if(roll<.3)return move(kit?.rangedAction,'protect-poke') || move('light','protect-poke');
    return {movement:'hold',action:null,guard:true,reason:'protect-lead'};
  }
  if(opponentRoom<100 && distance<280 && opponent.grounded && !opponent.down){
    if(opponent.guarding && distance<THROW_RULES.grabRange-12 && roll<.35)
      return {movement:'hold',action:'throw',reason:'corner-pressure'};
    return move('light','corner-pressure') || {movement:'advance',action:null,guard:true,reason:'corner-pressure'};
  }
  if(plan==='chase'||plan==='desperation'){
    const attack=move(kit?.pokeAction,'chase') || move('light','chase');
    return attack || {movement:'advance',action:null,dash:distance>240,reason:'chase'};
  }
  if(roll>.68)return null; // Leave room for the existing kit choices and showcase variety.
  // Hysteresis lets a shuffle finish through the preferred range instead of
  // reversing each decision. Urgent defense above this layer still interrupts.
  if(distance>style.range+(previousMovement==='advance'?12:35)){
    if(roll<style.initiative*.35){const ranged=move(kit?.rangedAction,'style-strike');if(ranged)return ranged;}
    return {movement:'advance',action:null,dash:distance>240&&roll<style.dash,reason:'style-spacing'};
  }
  if(distance<style.range-(previousMovement==='retreat'?12:35) && room>100 && style.initiative<.6)
    return {movement:'retreat',action:null,guard:true,reason:'style-spacing'};
  if(roll<style.initiative*.6){
    if(id==='deathblow'&&distance<THROW_RULES.grabRange-12)return {movement:'hold',action:'throw',reason:'style-strike'};
    return move(kit?.pokeAction,'style-strike') || move('light','style-strike');
  }
  return {movement:'hold',action:null,guard:style.initiative<.6,reason:'style-spacing'};
}
