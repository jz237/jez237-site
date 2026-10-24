/** Locked bumpers (offline): a car whose bumper is already knocked loose (loose >= LOCK.loose; offline bumpers tear off long
 * before they hang far) that hits a rival with that end at LOCK.minClosing..LOCK.maxClosing m/s can hook the two together (about
 * LOCK.chance of such hits). A rope as long as the gap at the hook plus LOCK.slack holds them: they drag each other about. While
 * the rope is taut and a car drives away from the other, strain builds (one second per car pulling per second); at LOCK.strain
 * the hooked bumper tears off. After LOCK.max seconds the hook slips free, and a gap past the rope length plus LOCK.snap (a car
 * recovered or teleported) lets go. */
export const LOCK={loose:.08,end:.55,minClosing:2,maxClosing:9,slack:.25,chance:.6,strain:1.2,ease:.5,max:6,snap:1,pull:.4,aim:.5} as const;
export type LockedBumper='front-bumper'|'rear-bumper';
/** The bumper at a contact LOCK.end or more of the half length ahead of (front) or behind (rear) the car's centre. */
export function bumperAt(localZ:number,halfLength:number):LockedBumper|null{
  if(!Number.isFinite(localZ)||!(halfLength>0))return null;
  return localZ>=LOCK.end*halfLength?'front-bumper':localZ<=-LOCK.end*halfLength?'rear-bumper':null;
}
/** Whether a hit hooks the cars: a bumper hanging loose at the contact, a moderate closing speed, and the pair's dice (seed). */
export function hooks(loose:number,closing:number,seed:number){
  const dice=((seed*.6180339887+.17)%1+1)%1;
  return loose>=LOCK.loose&&closing>=LOCK.minClosing&&closing<=LOCK.maxClosing&&Number.isFinite(dice)&&dice<LOCK.chance;
}
/** A car drives away from the hook: throttle past LOCK.pull (either way) with the car pointed within LOCK.aim of away. */
export function pullsAway(forward:{x:number;z:number},away:{x:number;z:number},throttle:number){
  const f=Math.hypot(forward.x,forward.z),a=Math.hypot(away.x,away.z);
  if(!(f>0)||!(a>0)||!Number.isFinite(throttle)||Math.abs(throttle)<LOCK.pull)return false;
  return Math.sign(throttle)*(forward.x*away.x+forward.z*away.z)/(f*a)>LOCK.aim;
}
/** Strain after a step of dt: grows while the rope is taut and `pulling` cars drive apart, otherwise eases off at LOCK.ease. */
export const lockStrain=(strain:number,taut:boolean,pulling:number,dt:number)=>!Number.isFinite(strain)||!(dt>0)?0:taut&&pulling>0?strain+dt*pulling:Math.max(0,strain-dt*LOCK.ease);
/** How a lock ends this step: torn (the bumper comes off), slipped (time up) or snapped (pulled impossibly far apart), else null. */
export function lockEnd(strain:number,age:number,gap:number,length:number):'torn'|'slipped'|'snapped'|null{
  return gap>length+LOCK.snap?'snapped':strain>=LOCK.strain?'torn':age>=LOCK.max?'slipped':null;
}
