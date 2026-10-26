// Water mode's running of the simulation (WaterCare.ts gives it the page and the panel): the bowl
// (chemistry.mjs) on its clock, the routine's meals (counted, never through the lid) and water
// changes, the food the fish eats or leaves when the Feed button lifts the lid (FishFood.ts), the
// uneaten pellets shown on the sand, what the water does to the fish written to water.fx
// (effects.ts), and what is kept on this device. No DOM: the tests run it in Node with stand-ins for
// the page (water-care.test.mjs).

import { BowlWater, DAY, HOUR, MEAL, PELLET_N } from './chemistry.mjs';
import { FeedLog } from '../app/learn/feedLog.mjs';

/** Sim seconds a second, at each speed: paused, Play (half an hour a second), Fast (six hours). */
export const RATE = { pause: 0, play: 30 * 60, fast: 6 * HOUR };
/** Most uneaten pellets shown on the sand at once (the newest), leaving room for a meal (FishFood
 *  holds seven). */
export const SHOWN = 4;
/** What is kept: bump when its shape changes (an old one is set aside for a new bowl). */
export const VERSION = 1;
/** Where pellets are laid on the sand (counted meals): open sand at the front of the bowl (the globe
 *  frame, in front of the wood and between the stones), a little above it, to settle. */
const SAND = { x: [-0.3, 0.3], z: [0.28, 0.56], above: 0.015 };
const ROUTINES = { meals: [0, 1, 2, 4], change: ['none', 'weekly', 'twice', 'test'] };

/** "Day 3 · 2:40 pm", to ten minutes. */
export function clockText(t) {
  const minutes = Math.floor((t % DAY) / 600) * 10;
  const h = Math.floor(minutes / 60);
  return `Day ${Math.floor(t / DAY) + 1} · ${h % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

/**
 * host: the page's parts it works with -
 *  water: { fx } (main.ts: what the fish and the bowl's look read);
 *  idle: the effects water.fx holds while off (CLEAR_WATER, or ?water='s);
 *  feeding: Feeding (its state: a meal asked for with the Feed button);
 *  food: FishFood (eatenCount, leave(), lay(p), rot(slot, left), isLeft(slot), take(slot));
 *  rotation(): the globe frame to the sim frame (column-major 3x3);
 *  bed: the sand's height at rest (the globe frame).
 */
export class Care {
  constructor(host) {
    this.host = host;
    this.on = false;
    this.bowl = BowlWater.start('new');
    /** @type {'pause' | 'play' | 'fast'} */
    this.speed = 'play';
    this.routine = { meals: 2, change: 'none' };
    /** The fish's food by the simulation's clock, for Learn's advice (each pellet at the time its
     *  meal was given: mealAt): Learn's MealClock. */
    this.mealAt = 0;
    this.meals = { log: new FeedLog(), now: () => this.bowl.s.t, drop: () => this.meals.log.drop(this.mealAt) };
    this.feedState = host.feeding.state;
    /** FishFood's count of pellets eaten, as last seen. */
    this.eaten = 0;
    /** Uneaten pellets shown on the sand: the bowl's id for each, and its FishFood slot. */
    this.shown = new Map();
  }

  /** On (water.fx the bowl's; only what happens from now on counted) or off (water.fx idle, the
   *  pellets on the sand taken away). */
  set(on) {
    this.on = on;
    const h = this.host;
    if (!on) {
      h.water.fx = h.idle;
      for (const slot of this.shown.values()) h.food.take(slot);
      this.shown.clear();
      return;
    }
    h.water.fx = this.bowl.fx;
    this.eaten = h.food.eatenCount;
    this.feedState = h.feeding.state;
    this.mealAt = this.bowl.s.t;
    this.sync();
  }

  /** Each frame while on (after the fish and the food have moved): the food eaten, and settled
   *  uneaten (left to rot), since the last; then `dt` real seconds of the clock (none while the
   *  page is hidden), with the meals and water changes it brings. */
  frame(dt, hidden = false) {
    const h = this.host;
    const fed = h.feeding.state;
    if (fed !== this.feedState) {
      if (this.feedState === 'idle') this.mealAt = this.bowl.s.t;
      this.feedState = fed;
    }
    const eaten = h.food.eatenCount - this.eaten;
    this.eaten = h.food.eatenCount;
    if (eaten > 0) this.bowl.eat(eaten);
    for (const slot of h.food.leave()) this.shown.set(this.bowl.leave(), slot);
    const run = hidden ? 0 : dt * RATE[this.speed];
    if (run > 0) this.bowl.advance(run, this.routine, () => this.meal());
  }

  /** A meal of the routine, due now, counted (the lid stays on): the fish eats what its appetite
   *  allows, the rest is laid on the sand; Learn's count has it too. */
  meal() {
    for (let k = 0; k < MEAL; k++) this.meals.log.drop(this.bowl.s.t);
    this.bowl.meal(MEAL);
  }

  /** The uneaten pellets shown on the sand brought into line with the bowl's: the newest few, each
   *  crumbling as it rots, laid there if not already, taken away once rotted or siphoned. */
  sync() {
    const food = this.host.food;
    const newest = this.bowl.s.pellets.slice(-SHOWN);
    for (const [id, slot] of this.shown) {
      if (!newest.some((p) => p[0] === id) || !food.isLeft(slot)) {
        food.take(slot);
        this.shown.delete(id);
      }
    }
    for (const [id, n] of newest) {
      const slot = this.shown.get(id) ?? food.lay(this.spot(id));
      if (slot < 0) continue;
      this.shown.set(id, slot);
      food.rot(slot, n / PELLET_N);
    }
  }

  /** Where pellet `id` is laid (the sim frame): a spot on the open sand, the same each time. */
  spot(id) {
    const u = (id * 0.618034) % 1;
    const v = (id * 0.754878 + 0.5) % 1;
    const g = [SAND.x[0] + u * (SAND.x[1] - SAND.x[0]), this.host.bed + SAND.above, SAND.z[0] + v * (SAND.z[1] - SAND.z[0])];
    const m = this.host.rotation();
    return [0, 1, 2].map((i) => m[i] * g[0] + m[3 + i] * g[1] + m[6 + i] * g[2]);
  }

  /** A fresh start: 'new', 'cycled' or 'neglected' (chemistry.mjs). */
  startOver(kind) {
    this.bowl = BowlWater.start(kind);
    this.meals.log = new FeedLog();
    this.mealAt = this.bowl.s.t;
    if (this.on) this.host.water.fx = this.bowl.fx;
    this.sync();
  }

  /** `days` run at once with the routine, its meals counted (testing). */
  forward(days) {
    this.bowl.advance(days * DAY, this.routine, () => this.meal());
    this.sync();
  }

  /** What is kept on this device: the bowl, the clock's speed, the routine. */
  toJSON() {
    return { v: VERSION, bowl: this.bowl, speed: this.speed, meals: this.routine.meals, change: this.routine.change };
  }

  /** Back from what was kept (toJSON, parsed): false if it is not something this kept. */
  restore(saved) {
    if (!saved || saved.v !== VERSION) return false;
    const bowl = BowlWater.restore(saved.bowl);
    if (!bowl) return false;
    this.bowl = bowl;
    if (saved.speed in RATE) this.speed = saved.speed;
    if (ROUTINES.meals.includes(saved.meals)) this.routine.meals = saved.meals;
    if (ROUTINES.change.includes(saved.change)) this.routine.change = saved.change;
    return true;
  }
}
