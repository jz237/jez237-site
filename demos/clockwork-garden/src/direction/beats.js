import { keyed, clamp } from '../core/ease.js';

// Story beats: the single source of truth for when things happen.
// Every world object and every shot reads its timing from here.

export const DURATION = 58;

export const B = {
  // Act I — the heartbeat (darkness, midnight teal)
  balanceStart: 0.5,
  balancePeriod: 1.0, // two ticks per second
  pulseLaunch: 3.4, // energy leaves the escapement
  pulseArrive: 8.0, // reaches the mainspring barrel at the stem's root crown
  hubSpin: [8.0, 9.8], // barrel releases; train spins up together
  stemClimb: [9.0, 13.2], // light climbs the drive vein to the bud
  podsWake: [9.4, 15.0], // secondary roots wake glass seedpods

  // Act II — the bloom
  budGlow: [12.4, 14.0],
  sheath: [13.55, 14.6], // the bud's porcelain sepals swing open
  outer: [13.8, 17.0],
  middle: [16.2, 19.2],
  inner: [18.2, 20.8],
  core: [18.6, 21.6],
  stamens: [19.4, 21.8],

  // Act III — the inhabitants
  beeEmerge: 21.8, // our pollinator crawls from the brass skep
  beeTakeoff: 23.2,
  beeLand: 25.6,
  pollen: [25.9, 28.0],
  flowerRespond: 26.6,
  beeLeave: 28.6,
  monarch: [28.2, 32.4],
  monarchLand: 29.1,
  monarchOpen: [29.7, 31.9],
  beetle: [32.4, 35.8],
  ladybirdFly: 34.6,
  hummingbird: [35.8, 40.4],

  // Act IV — the reveal
  reveal: [40.4, 50.2],
  bloomWave: [41.0, 48.0],
  rise: [44.0, 50.0],
  songbirdTakeoff: 43.7,
  title: [50.2, 58.0],
  titleIn: [51.4, 54.2],
  fadeOut: [56.6, 58.0],
};

// Global "dawn" from 0 (moonlit midnight) to 1 (golden morning).
export function dawnAt(t) {
  return keyed(t, [
    [0, 0],
    [8, 0.0],
    [14, 0.16],
    [22, 0.4],
    [36, 0.5],
    [41, 0.62],
    [47, 1.0],
    [58, 1.0],
  ]);
}

// Number of escapement ticks (fork flips) up to time t, and the time since the
// last tick. Ticks happen at the balance wheel's zero crossings.
export function tickState(t) {
  const t0 = B.balanceStart + B.balancePeriod * 0.5;
  if (t < t0) return { count: 0, since: Infinity, phase: 0 };
  const half = B.balancePeriod / 2;
  const count = Math.floor((t - t0) / half) + 1;
  const since = (t - t0) - (count - 1) * half;
  return { count, since, phase: clamp(since / half) };
}
