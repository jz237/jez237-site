// Renders the sound bank off the main thread and posts each sound as soon as
// it exists (most important first), so nothing audio-related ever costs the
// game a frame. Channel data is transferred, not copied.
import { RENDER_ORDER, FIRST_BANK, renderSound } from './audio_bank.js';

const t0 = performance.now();
// (The time the first bank's sounds took, by itself: see FIRST_BANK.)
let first = 0;
for (const id of RENDER_ORDER) {
  const t = performance.now();
  const variants = renderSound(id);
  if (id < FIRST_BANK) first += performance.now() - t;
  const transfer = [];
  for (const chans of variants) for (const c of chans) transfer.push(c.buffer);
  postMessage({ id, variants }, transfer);
}
postMessage({ done: true, ms: performance.now() - t0, first });
