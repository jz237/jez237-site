/** Rev limiter (offline, the sound only): floored with the revs against the limiter (past LIMITER.rpm with the pedal past
 * LIMITER.throttle), an engine bounces off its ignition cut — the combustion cutting out LIMITER.hz times a second for
 * LIMITER.duty of each beat, down to LIMITER.cut of its loudness and LIMITER.drop rpm lower in pitch: brap-brap-brap.
 * Each car keeps its own beat. */
export const LIMITER={rpm:6200,throttle:.6,hz:12,duty:.4,cut:.25,drop:240,response:.012} as const;
/** Is this engine bouncing off its limiter? */
export const onLimiter=(rpm:number,throttle:number,running:boolean)=>running&&Number.isFinite(rpm)&&rpm>=LIMITER.rpm&&Number.isFinite(throttle)&&Math.abs(throttle)>=LIMITER.throttle;
/** Is the ignition cut at this moment (s) for this car? */
export function limiterCut(time:number,id:number){
  const t=Number.isFinite(time)?time:0,phase=(t*LIMITER.hz+(Number.isFinite(id)?id:0)*.37)%1;return phase<LIMITER.duty;
}
