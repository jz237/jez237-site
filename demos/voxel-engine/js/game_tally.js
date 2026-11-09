// 'What just happened': voxels destroyed, pieces created and the largest
// piece of the destruction in progress, counted by the engine
// (player/tally.rs). It is there because it is fun to watch the numbers
// run while a building comes down. They run at ten a second: faster than
// that nobody reads them, and every change is a DOM write and a string.
import { TALLY } from './engine.js';

// A bullet hole or a hammer blow is not an event: the counter comes up for
// a real bite out of something, or for anything that broke loose.
const MIN_VOXELS = 100;
const WRITE_INTERVAL = 100;
const grouped = new Intl.NumberFormat('en-US');

export const voxelCount = (n) => grouped.format(Math.round(n));
export const massText = (kg) => (kg >= 1000 ? `${(kg / 1000).toFixed(kg >= 100000 ? 0 : 1)} t` : `${Math.round(kg)} kg`);

export function createTally(ctx) {
  const { sim } = ctx;
  const el = document.getElementById('tally');
  const voxelsEl = document.getElementById('tally-voxels');
  const piecesEl = document.getElementById('tally-pieces');
  const largestEl = document.getElementById('tally-largest');
  let voxels = -1, pieces = -1, largest = -1, shown = false, wroteAt = -1e9;

  return {
    // Engine restarted: nothing has happened yet.
    reset() {
      shown = false;
      el.hidden = true;
      wroteAt = -1e9;
    },
    frame(now) {
      const t = sim.frame.tally;
      const worth = t[TALLY.VOXELS] >= MIN_VOXELS || t[TALLY.PIECES] >= 1;
      const on = worth && t[TALLY.ACTIVE] !== 0;
      const turned = on !== shown;
      if (turned) {
        shown = on;
        // Goes out by fading (the numbers stay readable while it does) and
        // comes back at once.
        el.hidden = false;
        el.classList.toggle('fade', !on);
      }
      // Written as it comes up and as it goes out (the final count), and
      // in between at the pace above. Every harness frame may be the
      // screenshot, so there it is always current.
      if (!turned && (!on || (!ctx.harness && now - wroteAt < WRITE_INTERVAL))) return;
      wroteAt = now;
      if (t[TALLY.VOXELS] !== voxels) voxelsEl.textContent = voxelCount(voxels = t[TALLY.VOXELS]);
      if (t[TALLY.PIECES] !== pieces) piecesEl.textContent = voxelCount(pieces = t[TALLY.PIECES]);
      if (t[TALLY.LARGEST] !== largest) largestEl.textContent = massText(largest = t[TALLY.LARGEST]);
    },
  };
}
