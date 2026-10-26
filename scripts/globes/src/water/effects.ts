// What the bowl's water does to what is seen: the fish's spirits and the water's look, each 0..1.
// Water mode's care simulation (src/water) sets them as the water changes; CLEAR_WATER is the page
// as it always was, the water clean and warm and the fish well (Water mode off).

export interface WaterEffects {
  /** The fish: how listless (it rests more and longer, swims slower, leaves off displaying and
   *  patrolling). */
  lethargy: number;
  /** How much more often than usual it goes up for air (gills harmed by ammonia or nitrite). */
  gasp: number;
  /** How closely it holds its fins folded (clamped). */
  clamp: number;
  /** How faded its colours are. */
  pale: number;
  /** How keen it is on food (1: it takes every pellet; 0: it lets them sink). */
  appetite: number;
  /** How willing it is to build and tend its bubble nest. */
  nest: number;
  /** The water: how cloudy (a bloom of bacteria turns it milky). */
  cloud: number;
  /** How tea-brown (tannins from the almond leaf and the wood). */
  tint: number;
  /** The heater's lamp: lit while it heats. */
  heaterLamp: number;
}

export const CLEAR_WATER: Readonly<WaterEffects> = Object.freeze({ lethargy: 0, gasp: 0, clamp: 0, pale: 0, appetite: 1, nest: 1, cloud: 0, tint: 0, heaterLamp: 1 });

/** ?water=lethargy:0.8,cloud:0.5 (testing): those effects forced, the rest clear; null without it. */
export function forcedWaterEffects(q: string | null): WaterEffects | null {
  if (q === null) return null;
  const fx: WaterEffects = { ...CLEAR_WATER };
  for (const pair of q.split(',')) {
    const [k, v] = pair.split(':');
    if (k in fx && Number.isFinite(Number(v))) fx[k as keyof WaterEffects] = Math.min(Math.max(Number(v), 0), 1);
  }
  return fx;
}
