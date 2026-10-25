// The phone's sim (the betta bowl's LITE tier): its config, and what the sim may lighten while the
// water moves little (FluidSim.runtime), none of it changing a pipeline:
// - the pressure sweeps a substep by how much the water moves (FluidSim.agitation): fewer while it
//   is calm, more in a hard shake;
// - the photons traced in two halves of their rows, a frame each, the maps adding both (the sun's
//   light on the sand and through the water from all the rays of the last two frames);
// - while the bowl stands still, the bed the water, the light and the picture see (the sand's
//   surface, and the container: glass and sand) built every few frames; the sand flows every frame
//   as before, but creeps there far less than a texel a second.
// ?simq=0 runs it as round 2 did, every frame the config's sweeps, every photon and the sand (for
// A/Bs on a phone, and ?bench's rows).

import type { SimConfig } from '../config';

/** What FluidSim lightens by what the water is doing (FluidSim.runtime). */
export interface SimRuntime {
  /** Pressure sweeps a substep: the water calm, moving, in a hard shake (FluidSim.agitation). */
  readonly sweeps: readonly [number, number, number];
  /** The photons in two halves of their rows, a frame each (where the sim has the room for them:
   *  a runtime with them set before its init()). */
  readonly photonHalves: boolean;
  /** While the bowl stands still, the bed it shows is built every this many frames. */
  readonly stillBedEvery: number;
}

/** The phone's sim config: a coarser grid, two substeps a frame at 60 fps (of up to 1/100 s; three
 *  in a slower frame), fewer sweeps and sand substeps. */
export const PHONE_SIM: Pick<SimConfig, 'gridRes' | 'maxSubsteps' | 'maxSubstepDt' | 'pressureIterations' | 'sandSubsteps'> = {
  gridRes: 40,
  maxSubsteps: 3,
  maxSubstepDt: 1 / 100,
  pressureIterations: 24,
  sandSubsteps: 6,
};

/** Round 2's phone sim (?simq=0). */
export const PHONE_SIMQ0: SimRuntime = { sweeps: [24, 24, 24], photonHalves: false, stillBedEvery: 1 };

/** The phone's sim now (?simq=1, the default; measured: docs/architecture.md, S2). */
export const PHONE_SIMQ1: SimRuntime = { sweeps: [12, 20, 24], photonHalves: true, stillBedEvery: 4 };

/** ?simq's runtime (anything but 0: the default). */
export function phoneRuntime(simq: string | null): SimRuntime {
  return simq === '0' ? PHONE_SIMQ0 : PHONE_SIMQ1;
}
