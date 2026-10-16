// The failing streetlight's stutter (streetlight_5), a pure function of film time t (no state, no Math.random).
// The schedule (FLICKER_EPISODES) is exported for audio sync as world.flickerTimes:
//   { start, end, strength, blackout? } in film seconds; strength 1 = full stutter (lamp drops to near black),
//   0.4 = dips; `blackout: [b0, b1]` = the lamp is fully out between b0 and b1 (v2's scripted blackouts in ACT 1:
//   each time the light returns, the scarecrow has moved).
// Within an episode the lamp steps through irregular segments (60-280 ms: dropout / dim / on) - a failing LED
// driver, not a strobe; outside episodes it is steady.
import { CUES } from '../film/cues.js';

export const FLICKER_EPISODES = [
  { start: 3.25, end: 3.75, strength: 0.6 }, // P1: seen far up the block during the rack focus
  { start: 16.15, end: 16.8, strength: 0.75 }, // P4 high wide
  { start: 18.7, end: 18.98, strength: 0.4 }, // C1: a warning dip
  { start: CUES.flicker1 - 0.18, end: CUES.flicker1End + 0.16, strength: 1.0, blackout: [CUES.flicker1, CUES.flicker1End] },
  { start: CUES.flicker2 - 0.22, end: CUES.flicker2End + 0.12, strength: 1.0, blackout: [CUES.flicker2, CUES.flicker2End] },
  { start: 55.55, end: 56.25, strength: 0.8 }, // S2 high wide
  { start: 84.1, end: 84.5, strength: 0.5 }, // under the title
];

function hash1(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function episodeLevel(e, t) {
  if (e.blackout && t >= e.blackout[0] && t <= e.blackout[1]) {
    // fully out; the LED driver ticks once in the middle (a brief faint glow, not a flash)
    const mid = (e.blackout[0] + e.blackout[1]) / 2;
    return Math.abs(t - mid) < 0.035 ? 0.08 : 0.0;
  }
  // walk the hashed segments from the episode start (a handful of iterations)
  let t0 = e.start;
  let k = 0;
  const seed = e.start * 13.37;
  while (k < 64) {
    const len = 0.06 + 0.22 * hash1(seed + k * 3.17);
    if (t < t0 + len) break;
    t0 += len;
    k++;
  }
  const r = hash1(seed + k * 7.91 + 0.5);
  let level;
  if (r < 0.34) level = 0.03; // dropout
  else if (r < 0.58) level = 0.22 + 0.3 * hash1(seed + k + 0.25); // brown-out
  else level = 0.86 + 0.14 * hash1(seed + k + 1.7); // back on
  // electrical buzz while unstable (subtle ripple, never a strobe)
  level *= 0.93 + 0.07 * Math.sin(t * 2 * Math.PI * 47.0);
  return level;
}

// Multiplier for the failing lamp's light output at time t (1 = normal).
export function flickerAt(t) {
  let k = 1.0;
  for (const e of FLICKER_EPISODES) {
    if (t < e.start || t > e.end) continue;
    if (e.blackout && t >= e.blackout[0] && t <= e.blackout[1]) { k = Math.min(k, episodeLevel(e, t)); continue; }
    const u = (t - e.start) / (e.end - e.start);
    const env = e.blackout ? 1 : Math.min(1, u * 5, (1 - u) * 5);
    k = Math.min(k, 1 - e.strength * env * (1 - episodeLevel(e, t)));
  }
  return Math.max(0, k);
}

// Segment change points for audio (relay clicks / buzz): [{ t, level, episode }] for every episode.
export const FLICKER_EVENTS = (() => {
  const out = [];
  FLICKER_EPISODES.forEach((e, ei) => {
    let t0 = e.start;
    const seed = e.start * 13.37;
    for (let k = 0; k < 64 && t0 < e.end; k++) {
      if (e.blackout && t0 >= e.blackout[0] && t0 <= e.blackout[1]) { t0 += 0.06 + 0.22 * hash1(seed + k * 3.17); continue; }
      out.push({ t: +t0.toFixed(3), level: +flickerAt(t0 + 1e-4).toFixed(3), episode: ei });
      t0 += 0.06 + 0.22 * hash1(seed + k * 3.17);
    }
    if (e.blackout) {
      out.push({ t: e.blackout[0], level: 0, episode: ei, blackout: 'out' });
      out.push({ t: e.blackout[1], level: +flickerAt(e.blackout[1] + 0.01).toFixed(3), episode: ei, blackout: 'back' });
    }
    out.push({ t: e.end, level: 1, episode: ei });
  });
  return out.sort((a, b) => a.t - b.t);
})();

// The other cobra heads: steady.
export function steadyAt() {
  return 1.0;
}
