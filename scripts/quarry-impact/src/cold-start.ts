/** Cold start (offline): as the countdown begins every engine is started — a short crank on the starter, then it fires with
 * a burst of COLD_START.puffs puffs of pale blue-grey smoke from the tailpipe over COLD_START.span s, each car at its own moment in the
 * first second or so (COLD_START.window). */
export const COLD_START={window:[.5,1.5],crank:.45,puffs:5,span:.7,size:.55,volume:.28,done:2.8,puff:[.7,1.3],life:[1.6,2.6],tint:0xb8bfc6} as const;
/** When this car's engine fires, seconds into the countdown. */
export const fireTime=(id:number)=>COLD_START.window[0]+(((Number.isFinite(id)?id:0)*.6180339887)%1)*(COLD_START.window[1]-COLD_START.window[0]);
/** Puffs of smoke due from this car's tailpipe between `before` and `now` seconds into the countdown. */
export function coldStartPuffs(now:number,before:number,id:number){
  if(!(now>before))return 0;const f=fireTime(id);let n=0;
  for(let k=0;k<COLD_START.puffs;k++){const at=f+k*COLD_START.span/COLD_START.puffs;if(at>before&&at<=now)n++;}
  return n;
}
/** Whether this car's starter begins to crank between `before` and `now`. */
export const crankStarts=(now:number,before:number,id:number)=>{const at=fireTime(id)-COLD_START.crank;return now>before&&at>before&&at<=now;};
