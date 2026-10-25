/** Steaming brakes (offline rain): rain on a hot brake disc boils off at the wheel — from BRAKE_STEAM.from disc heat (see
 * discHeat), up to BRAKE_STEAM.rate puffs a second when it is glowing. */
export const BRAKE_STEAM={from:.35,rate:4} as const;
/** Steam puffs a second off a disc this hot (0–1) in the rain. */
export const brakeSteamRate=(heat:number)=>Number.isFinite(heat)&&heat>BRAKE_STEAM.from?BRAKE_STEAM.rate*Math.min(1,(heat-BRAKE_STEAM.from)/(1-BRAKE_STEAM.from)):0;
