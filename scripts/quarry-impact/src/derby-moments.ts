/** Derby moments (offline): when the field comes down to the final two, a short slow-motion beat, a banner naming them, the
 * crowd. Pure helpers; main owns the clock and effects. */
export const FINAL_TWO={slowmo:.6,scale:.4,toast:2.6} as const;
/** True on the step the field drops from three or more cars to exactly two. */
export const finalTwo=(before:number,now:number)=>Number.isFinite(before)&&before>=3&&now===2;
/** "FINAL TWO · YOU VS #4 KESSLER R6": the player's car always reads YOU and comes first. */
export function finalTwoBanner(a:{id:number;name:string},b:{id:number;name:string},playerId=0){
  const [first,second]=b.id===playerId?[b,a]:[a,b],label=(c:{id:number;name:string})=>c.id===playerId?'YOU':`#${c.id+1} ${c.name}`;
  return `FINAL TWO · ${label(first)} VS ${label(second)}`.toUpperCase();
}
/** Revenge (offline): the player lands a hit of REVENGE.loss or more on the opponent who has dealt them the most damage. Once
 * per grudge: it can fire again only after that rival has dealt the player more damage since. */
export const REVENGE={loss:12} as const;
export function revenge(rival:{id:number;damage:number}|null,victimId:number,loss:number,settled:number|undefined){
  return !!rival&&rival.id===victimId&&Number.isFinite(loss)&&loss>=REVENGE.loss&&rival.damage>(settled??0);
}
/** Takedown combos (offline): the player's takedowns within COMBO.window seconds of the previous one chain into DOUBLE, TRIPLE …
 * Returns the chain length after a takedown at `time`, given the previous chain (0 = none) and its last time. */
export const COMBO={window:4} as const;
export function takedownChain(chain:number,last:number,time:number){
  return Number.isFinite(time)&&Number.isFinite(last)&&chain>0&&time-last<=COMBO.window&&time>=last?chain+1:1;
}
export const comboLabel=(chain:number)=>chain>=4?`${chain}x TAKEDOWN`:chain===3?'TRIPLE TAKEDOWN':chain===2?'DOUBLE TAKEDOWN':'';
