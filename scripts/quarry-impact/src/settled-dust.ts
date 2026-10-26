/** Settled dust (offline): the dust hanging in the air over a gravel event (r368's dust in the air) settles on every car's
 * upward faces — roofs, bonnets, boot lids, screens — SETTLE.rate of the way to SETTLE.max a second in thick dust, and the
 * rain rinses it off (SETTLE.rinse of it a second in a full downpour). One film for the event (TOP_DUST, shared by the
 * cars' paint and glass), back to clean at the start of the next. */
export const SETTLE={rate:.04,max:.6,rinse:.06} as const;
export const TOP_DUST={value:0};
/** The settled film after dt seconds with this much dust in the air (0–1) and this hard a rain (0–1). */
export function settleStep(level:number,dt:number,air:number,rain:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0,a=Number.isFinite(air)?Math.max(0,Math.min(1,air)):0,r=Number.isFinite(rain)?Math.max(0,Math.min(1,rain)):0;
  let l=Number.isFinite(level)?Math.max(0,Math.min(SETTLE.max,level)):0;
  l+=(SETTLE.max-l)*(1-Math.exp(-SETTLE.rate*a*t));l*=Math.exp(-SETTLE.rinse*r*t);return l;
}
