// What the bowl's water shows of its state, and the fish's colours in it (water/effects.ts: cloud,
// tint, pale, heaterLamp): each eased towards what the effects ask (the water clouds and clears, the
// fish fades and colours up again, over seconds; the heater's lamp goes on and off all but at once),
// then given to the bowl's shader (GlobeView.setBowlWater) and to the sim's light (FluidSim
// waterColour: the light on the sand dimmed and coloured on its way down as the water dims it).

import { lightConfig } from '../config';
import { BOWL_WATER } from '../render/bowl';
import type { WaterEffects } from './effects';

/** How fast the look follows the effects (1/s), and the heater's lamp. */
const SETTLE = 0.7;
const SWITCH = 14;

/** `from` eased to `to` by a share k; there, once within a ten-thousandth (clear water is clear). */
const ease = (from: number, to: number, k: number): number => (Math.abs(to - from) < 1e-4 ? to : from + (to - from) * k);

export class WaterLook {
  private cloud: number;
  private tint: number;
  private pale: number;
  private lamp: number;
  /** (The sim's light's dimming, against its clear water's.) */
  private readonly colour: [number, number, number] = [1, 1, 1];

  /** Shown as `fx` has it from the first frame. */
  constructor(
    private readonly view: { setBowlWater(cloud: number, tint: number, pale: number, heaterLamp: number): void },
    private readonly sim: { waterColour: readonly [number, number, number] },
    fx: Readonly<WaterEffects>,
  ) {
    this.cloud = fx.cloud;
    this.tint = fx.tint;
    this.pale = fx.pale;
    this.lamp = fx.heaterLamp;
    this.apply();
  }

  /** One frame (dt s) of the bowl's water, as `fx` has it now. */
  update(dt: number, fx: Readonly<WaterEffects>): void {
    const k = 1 - Math.exp(-SETTLE * dt);
    this.cloud = ease(this.cloud, fx.cloud, k);
    this.tint = ease(this.tint, fx.tint, k);
    this.pale = ease(this.pale, fx.pale, k);
    this.lamp = ease(this.lamp, fx.heaterLamp, 1 - Math.exp(-SWITCH * dt));
    this.apply();
  }

  private apply(): void {
    this.view.setBowlWater(this.cloud, this.tint, this.pale, this.lamp);
    // (The sim's photons dim in its own clear water by lightConfig's absorption: the bloom's share
    // that is lost on the way down, and the tannins', over it.)
    const ext = lightConfig.waterAbsorption;
    const tannins = this.tint ** BOWL_WATER.tintPower;
    for (let c = 0; c < 3; c++) this.colour[c] = 1 + (BOWL_WATER.bloomLost * BOWL_WATER.bloom * this.cloud + BOWL_WATER.tannin[c] * tannins) / ext[c];
    this.sim.waterColour = this.colour;
  }
}
