/** Beams in the dust (offline, dusk): dust hanging in the air shows the headlamp beams the way rain does. The dust in the
 * air rises quickly while cars raise dust plumes on dry gravel (DUST_BEAMS.rise a second, toward the plumes' share of
 * DUST_BEAMS.cars full ones) and settles slowly once they stop (DUST_BEAMS.settle a second); the beams show at
 * DUST_BEAMS.strength of it. */
export const DUST_BEAMS={strength:.6,rise:2,settle:.22,cars:2} as const;
/** Smoke and knocked-off dust thicken the air too: a burning car counts as SMOKE_HAZE.fire full dust plumes, and the dust a hard
 * knock shakes off a car adds SMOKE_HAZE.knock of one for a full cloud, fading over SMOKE_HAZE.fade s. */
export const SMOKE_HAZE={fire:1.5,knock:.8,fade:2} as const;
/** What a hard knock's cloud of `puffs` (of `full` for a full one) adds to the haze still hanging from earlier ones. */
export const knockHaze=(haze:number,puffs:number,full:number)=>Math.min(2,(Number.isFinite(haze)?Math.max(0,haze):0)+(Number.isFinite(puffs)&&full>0?Math.max(0,puffs)/full:0)*SMOKE_HAZE.knock);
/** The dust in the air (0–1) after dt seconds with these dust plumes (each up to 2 full ones: a fire's smoke) rising. */
export function dustAirStep(level:number,plumes:readonly number[],dt:number){
  const l=Number.isFinite(level)?Math.max(0,Math.min(1,level)):0,t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0;
  const target=Math.min(1,plumes.reduce((s,p)=>s+(Number.isFinite(p)?Math.max(0,Math.min(2,p)):0),0)/DUST_BEAMS.cars);
  const rate=target>l?DUST_BEAMS.rise:DUST_BEAMS.settle;return l+(target-l)*(1-Math.exp(-rate*t));
}
