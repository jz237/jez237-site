/** Beams in the dust (offline, dusk): dust hanging in the air shows the headlamp beams the way rain does. The dust in the
 * air rises quickly while cars raise dust plumes on dry gravel (DUST_BEAMS.rise a second, toward the plumes' share of
 * DUST_BEAMS.cars full ones) and settles slowly once they stop (DUST_BEAMS.settle a second); the beams show at
 * DUST_BEAMS.strength of it. */
export const DUST_BEAMS={strength:.6,rise:2,settle:.22,cars:2} as const;
/** The dust in the air (0–1) after dt seconds with these dust plumes (each 0–1 of a full one) rising. */
export function dustAirStep(level:number,plumes:readonly number[],dt:number){
  const l=Number.isFinite(level)?Math.max(0,Math.min(1,level)):0,t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0;
  const target=Math.min(1,plumes.reduce((s,p)=>s+(Number.isFinite(p)?Math.max(0,Math.min(1,p)):0),0)/DUST_BEAMS.cars);
  const rate=target>l?DUST_BEAMS.rise:DUST_BEAMS.settle;return l+(target-l)*(1-Math.exp(-rate*t));
}
