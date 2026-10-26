/** Dead brake bulb (offline, by an old rival's age): past BRAKE_BULB.age, one rival in BRAKE_BULB.share has lost a brake
 * filament on one side (each car its own, left or right) — that tail lamp still glows with the lamps, but when the driver brakes
 * only the other side brightens. */
export const BRAKE_BULB={age:.6,share:.4} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*41.93+salt*17.31)*43758.5453)%1;
/** Which side (−1 left, +1 right) of car `id` of this age has a dead brake bulb, or 0. */
export function deadBrakeSide(id:number,age:number){const n=Number.isFinite(id)?id:0;if(!(age>=BRAKE_BULB.age))return 0;return hash(n,1)<BRAKE_BULB.share?(hash(n,2)<.5?-1:1):0;}
