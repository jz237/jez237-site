import type {CombatMotion} from './combat-feats';
/** Quarry balance choices; the reference specifies damage-based rivals, not values. */
export const RIVAL_HIT_POINTS=25;
export type RivalState={version:1;count:number;damage:[number,number,number][];chosen:[number,number][];cooldowns:[number,number,number][]};
const id=(value:unknown,count:number):value is number=>Number.isInteger(value)&&Number(value)>=0&&Number(value)<count;
const finite=(value:unknown,min:number,max:number):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
export function validRivalState(value:unknown,duration:number):value is RivalState{
 const s=value as RivalState;if(!s||s.version!==1||!Number.isInteger(s.count)||s.count<2||s.count>24||!finite(duration,0,1200))return false;
 const pairs=(rows:unknown,max:number):rows is number[][]=>Array.isArray(rows)&&rows.length<=max&&rows.every(r=>Array.isArray(r)&&r.length===3&&id(r[0],s.count)&&id(r[1],s.count)&&r[0]!==r[1])&&new Set(rows.map(r=>r[0]+':'+r[1])).size===rows.length;
 return pairs(s.damage,s.count*(s.count-1))&&s.damage.every(r=>finite(r[2],Number.MIN_VALUE,1e9))&&
  pairs(s.cooldowns,s.count*(s.count-1))&&s.cooldowns.every(r=>finite(r[2],0,duration+2))&&
  Array.isArray(s.chosen)&&s.chosen.length<=s.count&&new Set(s.chosen.map(r=>r?.[0])).size===s.chosen.length&&s.chosen.every(r=>Array.isArray(r)&&r.length===2&&id(r[0],s.count)&&id(r[1],s.count)&&r[0]!==r[1]&&s.damage.some(d=>d[0]===r[0]&&d[1]===r[1]));
}
/** Observes actual health loss only. It cannot alter damage, motion, or respawns. */
export class DerbyRivals{
 private damage=new Map<number,Map<number,number>>();
 private chosen=new Map<number,number>();
 private cooldowns=new Map<string,number>();
 constructor(readonly count:number){if(!Number.isInteger(count)||count<2||count>24)throw Error('Invalid rival field');}
 reset(){this.damage.clear();this.chosen.clear();this.cooldowns.clear();}
 record(attacker:number,victim:number,loss:number){
  if(!id(attacker,this.count)||!id(victim,this.count)||attacker===victim||!finite(loss,Number.MIN_VALUE,100))return;
  let row=this.damage.get(victim);if(!row){row=new Map();this.damage.set(victim,row);}row.set(attacker,Math.min(1e9,(row.get(attacker)??0)+loss));
 }
 /** Retain a tied rival to avoid flicker; otherwise ties use stable driver ids. */
 rival(driver:number,living:ReadonlySet<number>):number|null{
  if(!id(driver,this.count)||!living.has(driver)){this.chosen.delete(driver);return null;}
  const candidates=[...(this.damage.get(driver)??[])].filter(([opponent])=>living.has(opponent));
  const held=this.chosen.get(driver);candidates.sort((a,b)=>b[1]-a[1]||Number(b[0]===held)-Number(a[0]===held)||a[0]-b[0]);
  const selected=candidates[0]?.[0];if(selected===undefined){this.chosen.delete(driver);return null;}this.chosen.set(driver,selected);return selected;
 }
 /** Bonus only for a meaningful attacking hit, never reciprocal parked damage. */
 hit(attacker:CombatMotion,victim:CombatMotion,loss:number,time:number,living:ReadonlySet<number>,selected:number|null=this.rival(attacker.id,living)):number{
  if(!finite(time,0,1200)||!finite(loss,4,100)||!finite(attacker.health,Number.MIN_VALUE,100)||!finite(victim.health,Number.MIN_VALUE,100)||selected!==victim.id||!living.has(attacker.id)||!living.has(victim.id))return 0;
  const dx=victim.x-attacker.x,dz=victim.z-attacker.z,d=Math.hypot(dx,dz),closing=(attacker.vx*dx+attacker.vz*dz)/d;
  if(!Number.isFinite(closing)||d<.01||closing<2)return 0;
  const key=attacker.id+':'+victim.id;if((this.cooldowns.get(key)??-Infinity)>time)return 0;
  this.cooldowns.set(key,time+2);return RIVAL_HIT_POINTS;
 }
 selected(driver:number){return this.chosen.get(driver)??null;}
 snapshot():RivalState{return{version:1,count:this.count,damage:[...this.damage].flatMap(([victim,row])=>[...row].map(([attacker,loss])=>[victim,attacker,loss] as [number,number,number])),chosen:[...this.chosen],cooldowns:[...this.cooldowns].map(([key,until])=>{const [a,b]=key.split(':').map(Number);return[a,b,until]})};}
 restore(state:unknown,duration:number){
  if(!validRivalState(state,duration)||state.count!==this.count)throw Error('Invalid rival state');
  this.reset();for(const [victim,attacker,loss]of state.damage){let row=this.damage.get(victim);if(!row){row=new Map();this.damage.set(victim,row);}row.set(attacker,loss);}
  for(const [driver,opponent]of state.chosen)this.chosen.set(driver,opponent);for(const [a,b,until]of state.cooldowns)this.cooldowns.set(a+':'+b,until);
 }
}
