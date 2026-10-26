// Learn mode's count of the betta's food (Learn.ts): each pellet as it goes in (Feeding.ts), this
// visit; and, as a meal is asked for, the advice it calls for (content.ts FEEDING).

/** A day's food for a betta: two or three pellets, once or twice a day. */
export const DAY_PELLETS = 6;
/** The pellets of the last half day count as today's (s). */
export const DAY = 12 * 3600;
/** A meal sooner than this after the last (s) is one too soon: they are best spaced out. */
export const SPACING = 4 * 3600;
/** Pellets let go less than this apart (s) are one meal. */
const MEAL_GAP = 60;

export class FeedLog {
  constructor() {
    /** When each pellet went in (s), oldest first, within DAY of the last. */
    this.times = [];
  }

  /** A pellet went in at time t (s). */
  drop(t) {
    this.times.push(t);
    while (this.times[0] < t - DAY) this.times.shift();
  }

  /** The pellets in the DAY before t. */
  recent(t) {
    return this.times.filter((at) => at > t - DAY && at <= t).length;
  }

  /** The last meal before t: its pellets, and when its last went in (s); or null. */
  lastMeal(t) {
    const past = this.times.filter((at) => at > t - DAY && at <= t);
    if (!past.length) return null;
    let k = past.length - 1;
    while (k > 0 && past[k] - past[k - 1] < MEAL_GAP) k--;
    return { pellets: past.length - k, at: past[past.length - 1] };
  }

  /** What to say as a meal is asked for at time t: 'over' (a day's food or more in the last DAY:
   *  how many, over how many minutes), 'again' (a meal within SPACING: its pellets, how many
   *  minutes ago), else 'rule' (how to feed a betta). */
  advise(t) {
    const recent = this.recent(t);
    if (recent >= DAY_PELLETS) {
      const first = this.times.find((at) => at > t - DAY);
      return { advice: 'over', pellets: recent, minutes: (t - first) / 60 };
    }
    const last = this.lastMeal(t);
    if (last && t - last.at < SPACING) return { advice: 'again', pellets: last.pellets, minutes: (t - last.at) / 60 };
    return { advice: 'rule', pellets: 0, minutes: 0 };
  }
}
