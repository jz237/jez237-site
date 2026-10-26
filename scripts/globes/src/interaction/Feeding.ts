// Feeding the betta (its bowl's page): the only time its lid comes off. Asked for (the Feed button,
// or a click on the lid), it waits for the bowl to stand still and keeps it there: nobody can pick
// it up until the lid is back on (with the mouth open, a tilt would pour the water out). The lid is
// lifted off, a pinch of floating pellets goes in through the mouth one at a time, and once the
// fish has eaten them (or after a while, if it leaves some) the lid goes back on.

import type { BowlLid } from './BowlLid';
import type { GlobeController } from './GlobeController';

type Vec3 = [number, number, number];

/** A betta's meal: three pellets (two or three, once or twice a day, is what a betta needs: Learn
 *  mode's advice, app/learn/content.ts), let go this far apart (s). */
const PELLETS = 3;
const PELLET_GAP = 0.45;
/** Where they are let go: over the open mouth, a little off its middle, and how far apart (the sim
 *  frame: the bowl stands upright). */
const DROP_AT: Vec3 = [0.07, 0.72, 0.1];
const DROP_SPREAD = 0.08;
/** The lid goes back on this long after the last pellet has gone, or this long after the first was
 *  dropped, whatever is left (s). */
const AFTER = 1.8;
const LONGEST = 30;
/** How long it waits for the bowl to come to rest before it gives up (s). */
const SETTLE_WAIT = 8;

export type FeedState = 'idle' | 'waiting' | 'opening' | 'feeding' | 'closing';

export class Feeding {
  state: FeedState = 'idle';
  /** Called whenever the state changes (the page's button follows it). */
  onChange: (() => void) | null = null;
  /** Called as each pellet goes in (Learn mode counts them: app/learn/feedLog.mjs). */
  onDrop: (() => void) | null = null;
  /** The meal under way is one of Water mode's routine (water/WaterCare.ts), not asked for. */
  routine = false;
  private clock = 0;
  private dropped = 0;
  private emptyFor = 0;

  constructor(
    private readonly lid: BowlLid,
    private readonly controller: GlobeController,
  ) {}

  /** Feeds the fish (when nothing is under way), or puts the lid back on now (while it is fed).
   *  routine: Water mode's meal on time. */
  request(routine = false): void {
    if (this.state === 'idle') {
      this.routine = routine;
      this.controller.locked = true;
      this.set('waiting');
    } else if (this.state === 'waiting' || this.state === 'opening' || this.state === 'feeding') {
      this.close();
    }
  }

  /** drop: lets a pellet go at p (sim frame); false if there is no room for it. left: how many
   *  pellets are still in the water. */
  update(dt: number, drop: (p: Vec3) => boolean, left: number): void {
    this.clock += dt;
    if (this.state === 'waiting') {
      if (this.controller.settled) {
        this.lid.set(false);
        this.set('opening');
      } else if (this.clock > SETTLE_WAIT) {
        this.controller.locked = false;
        this.set('idle');
      }
    } else if (this.state === 'opening') {
      if (this.lid.clear) {
        this.dropped = 0;
        this.emptyFor = 0;
        this.set('feeding');
      }
    } else if (this.state === 'feeding') {
      while (this.dropped < PELLETS && this.clock >= this.dropped * PELLET_GAP) {
        const a = this.dropped * 2.4 + 0.7;
        const r = DROP_SPREAD * Math.sqrt((this.dropped + 0.5) / PELLETS);
        if (!drop([DROP_AT[0] + r * Math.cos(a), DROP_AT[1], DROP_AT[2] + r * Math.sin(a)])) break;
        this.dropped++;
        this.onDrop?.();
      }
      const allIn = this.dropped >= PELLETS;
      this.emptyFor = allIn && left === 0 ? this.emptyFor + dt : 0;
      if (this.emptyFor > AFTER || this.clock > LONGEST) this.close();
    } else if (this.state === 'closing') {
      if (this.lid.seated) {
        this.controller.locked = false;
        this.set('idle');
      }
    }
  }

  private close(): void {
    this.lid.set(true);
    this.set('closing');
  }

  private set(state: FeedState): void {
    this.state = state;
    this.clock = 0;
    this.onChange?.();
  }
}
