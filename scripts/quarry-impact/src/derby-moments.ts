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
/** "REVENGE READY" on the HUD: the opponent who has hurt the player most (at least REVENGE.ready damage) has hurt them again since
 * the last revenge (or never been paid back). */
export const revengeReady=(rival:{id:number;damage:number}|null,settled:number|undefined)=>!!rival&&rival.damage>=REVENGE_READY&&rival.damage>(settled??0);
export const REVENGE_READY=10;
/** A takedown the player lands while their own car is hanging on (below LAST_GASP health, still alive). */
export const LAST_GASP=15;
export const lastGasp=(playerHealth:number)=>Number.isFinite(playerHealth)&&playerHealth>0&&playerHealth<LAST_GASP;
/** Stripped (offline): once the player's still-running car has shed STRIPPED.first major parts (bumpers, bonnet, boot or
 * tailgate, doors, front wings), the crowd hears about it; again at STRIPPED.shell. */
export const STRIPPED={first:5,shell:8} as const;
export const strippedLabel=(before:number,now:number)=>!Number.isFinite(before)||!Number.isFinite(now)?'':now>=STRIPPED.shell&&before<STRIPPED.shell?`BARE SHELL · ${now} PARTS GONE`:now>=STRIPPED.first&&before<STRIPPED.first?`STRIPPED · ${now} PARTS GONE`:'';
/** Final four (offline): the step a field of five or more comes down to four, when the late-derby frenzy starts. */
export const FINAL_FOUR={toast:2.2} as const;
export const finalFour=(before:number,now:number)=>Number.isFinite(before)&&before>=5&&now===4;
export const finalFourBanner=(playerIn:boolean)=>playerIn?`FINAL FOUR · YOU'RE STILL IN IT`:'FINAL FOUR';
/** Destruction points (offline scored derbies), credited to the driver who did it. */
export const DESTRUCTION_POINTS={engine:40,rolled:30,pit:15,wing:10,door:10,burnt:35,pin:20} as const;
/** Rolled (offline): a car that has stayed upside down for ROLLED.sustain seconds within ROLLED.window of being hit was rolled by
 * that hitter. Once per roll: it counts again only after the car has been back on its wheels. */
export const ROLLED={sustain:.3,window:2.5} as const;
export const rolledBy=(inverted:number,armed:boolean,hit:{by:number;at:number}|undefined,time:number)=>armed&&Number.isFinite(inverted)&&inverted>=ROLLED.sustain&&!!hit&&time-hit.at>=0&&time-hit.at<=ROLLED.window?hit.by:-1;
