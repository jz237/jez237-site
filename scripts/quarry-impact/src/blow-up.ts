/** Blowing up (offline events). A car left burning BOOM.prime seconds primes its fuel tank, which goes up 6–12 s later (the
 * thermal state's fuel blast; water or the extinguisher cancel it). When it goes, the car itself is blown into the air,
 * tumbling (BOOM.lift m/s up, BOOM.spin of spin), up to BOOM.parts of its panels are thrown outward (BOOM.kick, BOOM.partLift),
 * every window is blown out and the car is destroyed. A player within BOOM.near metres sees it in slow motion, and the
 * event waits BOOM.hold seconds before it can end on that wreck, so the blast plays out. */
export const BOOM={prime:10,lift:7,spin:2.2,parts:6,kick:7,partLift:5,near:30,slowmo:.8,scale:.3,hold:1.8} as const;
/** True once a burning car should have its fuel tank primed: leaking fuel, a tank hanging down, or burning long enough. */
export const primesTank=(fuelLeak:number,tankDown:boolean,burnTime:number)=>fuelLeak>.3||tankDown||burnTime>=BOOM.prime;
