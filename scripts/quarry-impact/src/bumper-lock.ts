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
const dice=(seed:number)=>((seed*.6180339887+.17)%1+1)%1;
export function hooks(loose:number,closing:number,seed:number){
  const roll=dice(seed);
  return loose>=LOCK.loose&&closing>=LOCK.minClosing&&closing<=LOCK.maxClosing&&Number.isFinite(roll)&&roll<LOCK.chance;
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
/** Dragged on its wire (offline): about TETHER.chance of torn-off bumpers stay tied to the car by a wire at least TETHER.length
 * m long and are dragged along behind, sparking where they scrape the ground (moving TETHER.spark m/s or more, within
 * TETHER.low m of it, every TETHER.gap s), until the wire snaps after TETHER.min..TETHER.min+TETHER.span seconds (the bumper's
 * dice) — time runs TETHER.fastRate times faster above TETHER.fast m/s — or the car ends up more than TETHER.snap m beyond it. */
export const TETHER={chance:.5,length:1.2,min:1.5,span:2.5,fast:14,fastRate:2,spark:3,low:.35,gap:.08,snap:3} as const;
export const tethers=(seed:number)=>Number.isFinite(seed)&&dice(seed+.5)<TETHER.chance;
export const tetherLife=(seed:number)=>Number.isFinite(seed)?TETHER.min+TETHER.span*dice(seed*3+1):TETHER.min;
export const tetherAge=(age:number,speed:number,dt:number)=>!Number.isFinite(age)||!(dt>0)?age:age+dt*(Math.abs(speed)>TETHER.fast?TETHER.fastRate:1);
