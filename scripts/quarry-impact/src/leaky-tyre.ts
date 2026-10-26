import {LEAK} from './damage-handling';

/** Slow puncture (offline, by an old rival's age): past SLOW.age, one rival in SLOW.share arrives with a tyre already losing air
 * (each car its own corner) — set past the leak's onset, between SLOW.start of the way, so it hisses from the off and goes soft,
 * then flat, a minute or two into an event as it rolls (the leak runs faster the more it has lost and the faster the car goes). */
export const SLOW={age:.45,share:.3,start:[.5,.62]} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*53.17+salt*29.41)*43758.5453)%1;
/** Which tyre (0–3) of car `id` of this age has a slow puncture and how far gone it starts (tyre damage), or null. */
export function slowPuncture(id:number,age:number){
  const n=Number.isFinite(id)?id:0;if(!(age>=SLOW.age)||hash(n,1)>=SLOW.share)return null;
  return {wheel:Math.floor(hash(n,2)*4)%4,damage:Math.max(LEAK.onset,SLOW.start[0]+(SLOW.start[1]-SLOW.start[0])*hash(n,3))};
}
