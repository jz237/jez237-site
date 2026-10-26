// Night on the betta bowl's page (NightToggle.ts, in the page's link bar): the room's lights off and
// the lid's lamp in its soft blue moonlight mode (render/studio.ts STUDIO_NIGHT, the light every pass
// is drawn in), and the fish drowsy, as a betta is at night: it settles more often and swims slower,
// but still moves now and then. Day and night fade into each other over a couple of seconds, never a
// cut. Off at first, remembered on this device.

/** Where the choice is kept on this device. */
export const STORAGE_KEY = 'betta.night';

/** How long the fade between day and night takes (s). */
export const FADE = 2;

/** How listless the fish is at night (water/effects.ts lethargy: it rests about a fifth of the time,
 *  and still patrols and displays, which it leaves off from 0.4). */
export const NIGHT_LETHARGY = 0.3;

/** Whether Night was on when this device last showed the page. storage: what gives localStorage
 *  (reaching it can throw, as reading it can: storage blocked, a private window), each meaning
 *  only that the page starts by day, as for a first visit. */
export function keptNight(storage) {
  try {
    return storage().getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Night kept on this device, or day (not kept where storage cannot be had: the next visit starts by
 *  day). */
export function keepNight(storage, on) {
  try {
    storage().setItem(STORAGE_KEY, on ? '1' : '0');
  } catch {
    // (Not remembered.)
  }
}

/** The fade: how far from day to night the page is now (0..1), eased in and out over FADE seconds.
 *  Turned back halfway, it goes back from where it is. */
export class NightFade {
  /** on: night from the start (kept from the last visit), there at once. */
  constructor(on = false) {
    this.on = on;
    this.progress = on ? 1 : 0;
  }

  /** Day (false) or night (true), to fade to. */
  set(on) {
    this.on = on;
  }

  /** The fade dt s on; how far into the night it is now (0 by day, 1 by night). */
  step(dt) {
    const way = (this.on ? 1 : -1) * Math.max(dt, 0) / FADE;
    this.progress = Math.min(Math.max(this.progress + way, 0), 1);
    return this.value;
  }

  get value() {
    const p = this.progress;
    return p * p * (3 - 2 * p);
  }
}

/** What the water does to the fish (water/effects.ts), with the night's drowsiness `night` of the
 *  way in (0..1): the more listless of the two, the rest as the water has it. By day the effects
 *  themselves (the same object); else `into`, made over each frame. Water mode's own reckoning is
 *  left as it is. */
export function drowsy(fx, night, into) {
  const sleepy = NIGHT_LETHARGY * night;
  if (!(sleepy > fx.lethargy)) return fx;
  Object.assign(into, fx);
  into.lethargy = sleepy;
  return into;
}
