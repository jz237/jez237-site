/** Rain showers (offline rain): the rain comes and goes rather than falling at one steady rate — its strength wanders
 * between SHOWERS.min and full over a minute or so (two slow swells, SHOWERS.periods s, each event its own), and the
 * falling rain, its hiss, the drops on the lens and how fast the puddles fill all follow it. */
export const SHOWERS={min:.35,periods:[47,83],mix:.6} as const;
/** How hard it is raining now (SHOWERS.min to 1), `time` seconds into the event, for this event's `seed`. */
export function showerLevel(time:number,seed:number){
  const t=Number.isFinite(time)?time:0,s=Number.isFinite(seed)?seed:0,[a,b]=SHOWERS.periods;
  const swell=SHOWERS.mix*Math.sin(2*Math.PI*t/a+s*6.283)+(1-SHOWERS.mix)*Math.sin(2*Math.PI*t/b+s*17.13);
  return SHOWERS.min+(1-SHOWERS.min)*(.5+.5*swell);
}
