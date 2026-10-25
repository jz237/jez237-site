/** Rain on a hot bonnet (offline rain). A running engine heats up as it works (BONNET_STEAM.warm a second at full throttle
 * and revs, BONNET_STEAM.idle ticking over) and cools at BONNET_STEAM.cool a second once it stops; cars come to the line
 * at BONNET_STEAM.start. Past BONNET_STEAM.from the rain on the bonnet boils off in wisps of steam, up to BONNET_STEAM.rate
 * puffs a second when the engine is as hot as it gets — and a wreck keeps steaming as it cools. */
export const BONNET_STEAM={warm:.04,idle:.003,cool:.006,start:.3,from:.35,rate:4,revs:7000} as const;
const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
/** Engine heat 0–1 after dt seconds: running (pedal 0–1, revs per minute) or not. */
export function bonnetHeat(heat:number,running:boolean,throttle:number,rpm:number,dt:number){
  const h=Number.isFinite(heat)?clamp01(heat):BONNET_STEAM.start;if(!(dt>0))return h;
  if(!running)return clamp01(h-BONNET_STEAM.cool*dt);
  const work=clamp01(Number.isFinite(throttle)?Math.abs(throttle):0)*clamp01((Number.isFinite(rpm)?rpm:0)/BONNET_STEAM.revs);
  return clamp01(h+(BONNET_STEAM.idle+BONNET_STEAM.warm*work)*(1-h)*dt-(work<.05?BONNET_STEAM.cool*.25*dt:0));
}
/** Steam puffs a second off a bonnet this hot in the rain. */
export const steamRate=(heat:number)=>Number.isFinite(heat)&&heat>BONNET_STEAM.from?BONNET_STEAM.rate*(heat-BONNET_STEAM.from)/(1-BONNET_STEAM.from):0;
