// When Learn mode (Learn.ts) explains what the fish does: as it starts a behaviour, once it has kept
// at it a moment; not while another card is up, nor soon after one goes (GAP); and each behaviour
// only once in a while (COOLDOWN), however often the fish does it.

/** The swim's modes (fish/bettaSwim.mjs) and the behaviour each shows (content.ts CAPTIONS). A
 *  trip for air is one, up, at the film and back down; a burst, and the glide after it, are only
 *  the route's. */
export const MODE_CAPTIONS = { cruise: 'cruise', hover: 'hover', rise: 'air', gulp: 'air', dive: 'air', mirror: 'mirror', lap: 'lap', rest: 'rest', startle: 'startle', feed: 'feed' };

/** How long the fish must have kept at a behaviour before it is captioned (s): a hover between two
 *  legs can be over in a second, and it is well on its way to the glass or the sand before it
 *  displays or settles there. (A startle is over in a second.) */
export const AFTER = { cruise: 2.5, hover: 1.2, air: 1, mirror: 2.5, lap: 3, rest: 3, startle: 0, feed: 0.8 };
/** How long before the same is explained again (s); longer for what the fish does all the time. */
export const COOLDOWN = 300;
const COOLDOWN_LONG = { cruise: 900, hover: 900 };
/** How long after a card goes before a caption may come (s). */
export const GAP = 20;

export class CaptionClock {
  constructor() {
    /** The behaviour watched, and since when (s); when each was last explained; when a caption may
     *  come. */
    this.key = null;
    this.since = 0;
    this.said = new Map();
    this.freeAt = -Infinity;
  }

  /** Not explained within its cooldown, at time t. */
  ready(key, t) {
    const at = this.said.get(key);
    return at === undefined || t - at >= (COOLDOWN_LONG[key] ?? COOLDOWN);
  }

  /** The behaviour the fish shows at time t (s): a CAPTIONS id, or null. */
  watch(key, t) {
    if (key === this.key) return;
    this.key = key;
    this.since = t;
  }

  /** The caption due at time t, if any (taken: it will not be due again within its cooldown): the
   *  behaviour watched, once it has lasted AFTER, unless a card is up (busy) or went less than GAP
   *  ago. */
  due(t, busy) {
    const key = this.key;
    if (key === null || busy || t < this.freeAt || t - this.since < (AFTER[key] ?? 0) || !this.ready(key, t)) return null;
    this.said.set(key, t);
    return key;
  }

  /** Something that happens at a moment (the nest grows, a pellet sinks; the fins flared at the
   *  button, `asked`, shown over another card and with no gap): whether to caption it now (taken, as
   *  due takes one). */
  event(key, t, busy, asked = false) {
    if (!this.ready(key, t) || (!asked && (busy || t < this.freeAt))) return false;
    this.said.set(key, t);
    return true;
  }

  /** A card went at time t: no caption for GAP. */
  closed(t) {
    this.freeAt = t + GAP;
  }
}
