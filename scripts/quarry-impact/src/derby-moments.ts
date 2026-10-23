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
