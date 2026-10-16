// Deterministic event times and motion curves for the props, derived ONLY from src/film/cues.js.
// Pure JS (no THREE), safe to import from the audio engine:  import { railTapTimes, phoneBuzzTimes,
// binImpactTimes, binImpacts, doorImpactTimes, windGusts, carRattleTimes } from '../props/timings.js'.
// Everything is computed once at import from fixed seeds, so picture and sound always agree.
import { CUES } from '../film/cues.js';
import { rng, fbm1, noise1, bump, bumpIntegral, clamp, smoothstep } from './util.js';

// ---------------------------------------------------------------------------------------------------------------
// WIND: a light breeze plus discrete gusts. windGust1 is the scripted one (leaves scrape across the street);
// the others are "occasional" and deterministic. strength ~ 0..1 (1 = a strong gust that moves leaves).
// ---- DRESS v2: gusts re-timed to the v2 shots (exterior only; none inside car A / under car B / in 3609) ----
export const windGusts = [
  { t: CUES.pumpkinGutter - 0.45, rise: 0.4, dur: 1.6, strength: 0.4, dir: -0.6 },  // P1: the breath of wind that makes the hero candle gutter
  { t: CUES.windGust1, rise: 0.7, dur: 3.2, strength: 1.0, dir: -1.15 }, // dir: travel direction = (sin dir, 0, -cos dir): 0 = NE (-Z), +pi/2 = toward SE side (+X)
  { t: CUES.railTapStart + 4.9, rise: 0.6, dur: 3.0, strength: 0.7, dir: -0.5 },   // P2 -> P3 (bat taps)
  { t: CUES.scarecrowHeadLift + 0.9, rise: 0.6, dur: 2.6, strength: 0.5, dir: -0.3 },
  { t: CUES.figuresTurn + 1.2, rise: 0.7, dur: 3.0, strength: 0.6, dir: -0.4 },     // P4 high wide: leaves along the street
  { t: CUES.shotC2 + 0.2, rise: 0.5, dur: 2.2, strength: 0.55, dir: 0.4 },          // C2 over the scarecrow's shoulder
  { t: CUES.fallAsphalt - 0.3, rise: 0.5, dur: 2.4, strength: 0.5, dir: -0.2 },     // C4 on the asphalt
  { t: CUES.feet1 + 0.6, rise: 0.6, dur: 2.8, strength: 0.6, dir: 0.3 },            // U2: leaves skitter past the letterbox
  { t: CUES.screamerShriek + 0.4, rise: 0.6, dur: 3.0, strength: 0.7, dir: -0.6 },  // S1/S2
  { t: CUES.nearMiss + 0.8, rise: 0.5, dur: 2.4, strength: 0.55, dir: 0.2 },        // S3 run
  { t: CUES.titleFadeIn + 1.5, rise: 1.0, dur: 4.0, strength: 0.7, dir: -0.3 },
  { t: CUES.titleFadeIn + 7.2, rise: 1.0, dur: 3.5, strength: 0.5, dir: -0.1 },
];
// ---- end DRESS v2 gusts ----
export const leafGustTimes = windGusts.map((g) => +(g.t + g.rise).toFixed(3)); // gust peaks (for leaf-scrape audio)

// wind strength 0..~1.2 at time t (breeze + gusts + flutter)
export function windAt(t) {
  let w = 0.12 + 0.06 * fbm1(t * 0.35, 11);
  for (const g of windGusts) w += g.strength * bump(t, g.t, g.rise, g.dur);
  return Math.max(0, w + 0.05 * noise1(t * 3.1, 5));
}
// integral of the gust part (for leaf displacement): sum of strength * integral(bump)
export function gustIntegral(t, gi = -1) {
  let s = 0;
  for (let i = 0; i < windGusts.length; i++) {
    if (gi >= 0 && i !== gi) continue;
    const g = windGusts[i];
    s += g.strength * bumpIntegral(t, g.t, g.rise, g.dur);
  }
  return s;
}

// ---------------------------------------------------------------------------------------------------------------
// RAIL TAP (3605): a hard plastic bat on a ~22 cm fishing line tied to the stoop railing's top rail. Wind pushes
// it out from the balusters, gravity swings it back; it clacks against the iron when the swing returns.
// Simulated once at import (2 kHz, fixed seed) -> angle table (240 Hz) + exact tap times.
export const RAIL_BAT = { L: 0.29, contactAngle: 0.0, restAngle: 0.02, sampleHz: 240, simHz: 2000 };
const _rail = (() => {
  const { L, contactAngle, restAngle, sampleHz, simHz } = RAIL_BAT;
  const g = 9.81;
  const dt = 1 / simHz;
  const T = CUES.railTapEnd + 3;
  const n = Math.ceil(T * sampleHz) + 2;
  const table = new Float32Array(n);
  const taps = [];
  let th = restAngle, w = 0, t = 0, lastTap = -1;
  const win = (x) => smoothstep(CUES.railTapStart - 0.6, CUES.railTapStart + 0.2, x) * (1 - smoothstep(CUES.railTapEnd - 0.8, CUES.railTapEnd + 0.3, x));
  let k = 0;
  const steps = Math.ceil(T * simHz);
  for (let s = 0; s <= steps; s++) {
    t = s * dt;
    // wind forcing on the light plastic bat: turbulent, strong only inside the tap window
    const turb = Math.max(0, 0.45 + 0.75 * fbm1(t * 1.2, 31) + 0.9 * noise1(t * 2.9, 77));
    const F = (0.2 + 14 * win(t)) * (0.4 + windAt(t)) * turb;
    // the knot holds the bat ~2 cm off the balusters at rest
    const acc = -(g / L) * Math.sin(th - restAngle) - 0.5 * w + F * Math.cos(th);
    w += acc * dt;
    const prev = th;
    th += w * dt;
    if (th < contactAngle) {
      // impact with the baluster: restitution, record the tap (interpolated time)
      const f = (prev - contactAngle) / Math.max(1e-9, prev - th);
      const tt = t - dt + f * dt;
      const v = -w;
      th = contactAngle + (contactAngle - th) * 0.3;
      w = -w * 0.5;
      if (v > 0.15 && tt - lastTap > 0.07) { taps.push({ t: +tt.toFixed(4), v: +Math.min(1, v / 2.2).toFixed(3) }); lastTap = tt; }
    }
    if (t >= k / sampleHz) { if (k < n) table[k] = th; k++; }
  }
  for (; k < n; k++) table[k] = th;
  return { table, taps };
})();
// every tap the bat makes (the swing only gets strong inside [railTapStart, railTapEnd]); v = impact strength 0..1
export const railTaps = _rail.taps;
export const railTapTimes = railTaps.map((x) => x.t);
// bat swing angle (radians from the rest plane, 0 = against the balusters) at time t
export function railBatAngle(t) {
  const { sampleHz } = RAIL_BAT;
  const x = clamp(t, 0, (_rail.table.length - 2) / sampleHz) * sampleHz;
  const i = Math.floor(x), f = x - i;
  return _rail.table[i] * (1 - f) + _rail.table[i + 1] * f;
}

// ---------------------------------------------------------------------------------------------------------------
// PHONE on the 3607 stoop: three vibration bursts; screen lit for the incoming call, then a missed-call notice.
export const PHONE = { period: 1.55, buzzDur: 0.8, callEnd: 0, missedEnd: 0 };
export const phoneBuzzTimes = [0, 1, 2].map((i) => +(CUES.phoneBuzz + i * PHONE.period).toFixed(3));
PHONE.callEnd = phoneBuzzTimes[2] + PHONE.buzzDur + 1.0;   // ringing stops
PHONE.missedEnd = PHONE.callEnd + 5.5;                     // screen times out
export const phoneScreenOn = [CUES.phoneBuzz, PHONE.missedEnd];
// vibration envelope 0..1 at t (motor spin-up/down), and the screen state
export function phoneVibration(t) {
  let v = 0;
  for (const b of phoneBuzzTimes) {
    if (t >= b && t <= b + PHONE.buzzDur + 0.06) v = Math.max(v, smoothstep(b, b + 0.05, t) * (1 - smoothstep(b + PHONE.buzzDur - 0.04, b + PHONE.buzzDur + 0.06, t)));
  }
  return v;
}
export function phoneScreen(t) {
  if (t < CUES.phoneBuzz || t > PHONE.missedEnd + 0.4) return { mode: 'off', level: 0 };
  if (t < PHONE.callEnd) return { mode: 'call', level: smoothstep(CUES.phoneBuzz, CUES.phoneBuzz + 0.12, t) };
  if (t < PHONE.missedEnd) return { mode: 'missed', level: 0.75 };
  return { mode: 'missed', level: 0.75 * (1 - smoothstep(PHONE.missedEnd, PHONE.missedEnd + 0.4, t)) };
}

// ---------------------------------------------------------------------------------------------------------------
// 3609 FRONT DOOR default timeline (radians, 0 = shut, + = open inward). Ajar until doorEnter, flung open by the
// camera, then slammed at doorSlam.
export const DOOR = { ajar: 25 * Math.PI / 180, open: 96 * Math.PI / 180, openDur: 0.42, slamDur: 0.3 };
export function doorAngleAt(t) {
  const c0 = CUES.doorEnter - 0.1, c1 = c0 + DOOR.openDur;   // DRESS v2: flung open at doorEnter - 0.1
  const s1 = CUES.doorSlam, s0 = s1 - DOOR.slamDur;
  if (t < c0) {
    // ajar, with a tiny draught sway
    return DOOR.ajar + 0.012 * fbm1(t * 0.4, 3) + 0.004 * noise1(t * 2.3, 9);
  }
  if (t < c1) {
    const x = (t - c0) / DOOR.openDur; // pushed hard: fast start, decelerates into the stop
    return DOOR.ajar + (DOOR.open - DOOR.ajar) * (1 - Math.pow(1 - x, 2.4));
  }
  if (t < s0) {
    // bounced off the stop, settles
    const x = t - c1;
    return DOOR.open - 0.06 * Math.abs(Math.sin(x * 9)) * Math.exp(-x * 6);
  }
  if (t < s1) {
    const x = (t - s0) / DOOR.slamDur; // slammed: accelerates shut
    return DOOR.open * (1 - x * x * (1.6 - 0.6 * x));
  }
  // shut; latch shudder
  const x = t - s1;
  return Math.max(0, 0.012 * Math.sin(x * 70) * Math.exp(-x * 25));
}
export const doorImpactTimes = [+(CUES.doorEnter - 0.1 + DOOR.openDur).toFixed(3), CUES.doorSlam];   // DRESS v2
// ---- DRESS v2: 3609 deadbolt thumb turn (radians, 0 = vertical/unlocked -> pi/2 locked) and the hand slap ----
export const DEADBOLT = { turn: 0.13 };
export function deadboltAngleAt(t) {
  const x = (t - CUES.deadbolt) / DEADBOLT.turn;
  if (x <= 0) return 0;
  if (x >= 1) return Math.PI / 2 + 0.03 * Math.exp(-(t - CUES.deadbolt - DEADBOLT.turn) * 30) * Math.sin((t - CUES.deadbolt) * 90);
  return (Math.PI / 2) * (x * x * (3 - 2 * x));
}
export const deadboltTime = +(CUES.deadbolt + DEADBOLT.turn).toFixed(3);   // the bolt throws home (clack)
// hand slap on the outside of the door's 4-lite window: palm contact at doorSlap, drags ~6 cm down, peels off
export function doorSlapAt(t) {
  const x = t - CUES.doorSlap;
  if (x < -0.06) return { hand: 0, press: 0, drag: 0, print: 0 };
  const hand = x < 0 ? (x + 0.06) / 0.06 : 1 - Math.min(1, Math.max(0, (x - 0.42) / 0.16));
  const press = x < 0 ? 0 : Math.exp(-x * 5.0);
  const drag = Math.min(1, Math.max(0, x / 0.4));
  const print = x < 0 ? 0 : Math.min(1, x / 0.05);
  return { hand: Math.max(0, hand), press, drag, print };
}
// ---- end DRESS v2 door ----

// KEYS hanging in the 3609 door's outside lock: a pendulum (ring + keys) driven by the door's motion.
// Out-of-plane angle `o` (+ = away from the door face) and in-plane angle `s` (+ = away from the hinge).
// simulateKeys(angleFn) integrates over [t0, t1] and returns tables + jingle events (keys hitting the door).
export const KEYS = { r: 0.843, l: 0.05, contact: -0.3, hz: 480 };
export function simulateKeys(angleFn, t0 = 0, t1 = 88, hz = KEYS.hz) {
  const g = 9.81, { r, l, contact } = KEYS;
  const dt = 1 / hz, h = 1 / hz;
  const n = Math.ceil((t1 - t0) * hz) + 2;
  const O = new Float32Array(n), S = new Float32Array(n);
  const jingles = [];
  let o = 0, wo = 0, s = 0, ws = 0, last = -1;
  for (let i = 0; i < n; i++) {
    const t = t0 + i * dt;
    const a0 = angleFn(t - h), a1 = angleFn(t), a2 = angleFn(t + h);
    const om = (a2 - a0) / (2 * h), al = (a2 - 2 * a1 + a0) / (h * h);
    const aT = Math.max(-400, Math.min(400, r * al)), aC = Math.min(60, r * om * om);
    wo += (-(g / l) * Math.sin(o) - 2.2 * wo + (aT / l) * Math.cos(o)) * dt;
    ws += (-(g / l) * Math.sin(s) - 2.6 * ws + (aC / l) * Math.cos(s)) * dt;
    o += wo * dt; s += ws * dt;
    o = Math.max(-1.2, Math.min(1.5, o)); s = Math.max(-1.2, Math.min(1.2, s));
    if (o < contact) {
      const v = -wo;
      o = contact; wo = -wo * 0.3;
      if (v > 0.8 && t - last > 0.05) { jingles.push({ t: +t.toFixed(4), v: +Math.min(1, v / 12).toFixed(3) }); last = t; }
    }
    O[i] = o; S[i] = s;
  }
  return {
    t0, hz, O, S, jingles,
    at(t) {
      const x = Math.max(0, Math.min(n - 2, (t - t0) * hz));
      const i = Math.floor(x), f = x - i;
      return [O[i] * (1 - f) + O[i + 1] * f, S[i] * (1 - f) + S[i + 1] * f];
    },
  };
}
const _keys = simulateKeys(doorAngleAt, CUES.doorEnter - 3, CUES.doorSlam + 4);
export const keyJingles = _keys.jingles;
export const keyJingleTimes = keyJingles.map((j) => j.t);
export const defaultKeySim = _keys;

// ---------------------------------------------------------------------------------------------------------------
// CAR DOOR RATTLE: the hero infected grabs the open driver door frame at scare2Contact; the door jolts on its
// hinge and the car rocks; a second smaller jolt when it pulls itself forward.
export const carRattleTimes = [CUES.scare2Contact, +(CUES.scare2Contact + 0.38).toFixed(3)];
export function carRattle(t) {
  let door = 0, rock = 0;
  const amps = [1.0, 0.45];
  carRattleTimes.forEach((t0, i) => {
    const x = t - t0;
    if (x < 0 || x > 2.5) return;
    door += amps[i] * (-0.06 * Math.exp(-x * 5.5) * Math.cos(x * 2 * Math.PI * 4.2) - 0.025 * Math.exp(-x * 2.0));
    rock += amps[i] * 0.012 * Math.exp(-x * 3.2) * Math.sin(x * 2 * Math.PI * 1.6);
  });
  return { door, rock };
}

// ---------------------------------------------------------------------------------------------------------------
// RECYCLING TOTER knocked over at binKnock: tips sideways, lid flops open, bottles/cans spill and roll into the
// NW gutter. A small deterministic 2D/2.5D simulation in the toter's local frame, run once at import.
// Local frame: origin at the toter's footprint centre on the road, +x = tip direction (along the street, world +Z,
// the camera's retreat direction), y up, +z = toward the NW curb (world -X). The toter falls backward (onto its
// wheels/hinge side), the lid flops open onto the road, bottles spill out and roll down the camber into the gutter.
export const TOTER = {
  w: 0.58, d: 0.72, h: 1.0,      // footprint along the tip axis (w), across it (d), height
  omega0: 2.6,                   // initial tip angular velocity (rad/s) from the camera's clip
  crossSlope: 0.03,              // road falls toward the gutter (+z)
  alongSlope: 0.012,             // and gently toward E Venango (+x)
  gutterZ: 1.05,                 // distance from the toter centre to the NW curb face along +z (m)
  sampleHz: 120,
};
function simToter() {
  const { w, h, omega0, sampleHz } = TOTER;
  const wDepth = TOTER.d; void wDepth;
  const g = 9.81;
  const r = 0.5 * Math.hypot(w, h);
  const a0 = Math.atan2(w / 2, h / 2);
  const I = (w * w + h * h) / 3;                 // per unit mass, about the edge
  const dt = 1 / 4000;
  const t0 = CUES.binKnock;
  let th = 0, om = omega0, t = 0;
  const impacts = [];
  const N = Math.ceil(4.0 * sampleHz);
  const body = new Float32Array(N);              // tip angle samples from t0
  const lid = new Float32Array(N);               // lid opening angle relative to the body
  let k = 0, ground = -1, bounces = 0;
  for (let s = 0; s < 4.0 / dt; s++) {
    t = s * dt;
    const torque = (g * r * Math.sin(th - a0)) / I;
    om += torque * dt;
    th += om * dt;
    if (th >= Math.PI / 2) {
      th = Math.PI / 2;
      if (om > 0.35) { impacts.push({ t: +(t0 + t).toFixed(4), type: 'toter', v: +Math.min(1, om / 4).toFixed(3) }); bounces++; }
      if (ground < 0) ground = t;
      om = -om * (bounces < 2 ? 0.22 : 0.0);
    }
    if (th < 0) { th = 0; om = 0; }
    if (t >= k / sampleHz && k < N) { body[k] = th; k++; }
  }
  // lid: starts opening when the body passes ~60 deg (contents shift), slaps open onto the road after the impact
  const tl0 = (() => { for (let i = 0; i < N; i++) if (body[i] > 1.05) return i / sampleHz; return 0.5; })();
  const tlHit = ground + 0.16;
  for (let i = 0; i < N; i++) {
    const x = i / sampleHz;
    let a = 0;
    if (x > tl0) a = 0.35 * smoothstep(tl0, ground, x);
    if (x > ground) {
      const y = (x - ground) / (tlHit - ground);
      const LO = Math.PI / 2 - 0.035; // the lid lands flat on the road beyond the toter's mouth
      a = y < 1 ? 0.35 + (LO - 0.35) * y * y : LO - 0.1 * Math.abs(Math.sin((x - tlHit) * 18)) * Math.exp(-(x - tlHit) * 9);
    }
    lid[i] = a;
  }
  impacts.push({ t: +(t0 + tlHit).toFixed(4), type: 'lid', v: 0.7 });
  // bottles/cans: spill from the opening after the ground impact, roll to the gutter
  const R = rng(4531);
  const kinds = ['glass', 'can', 'glass', 'plastic', 'can', 'glass', 'can', 'glass'];
  const items = [];
  const openX = h;                                // opening sits ~h along +x after the fall
  for (let j = 0; j < kinds.length; j++) {
    const kind = kinds[j];
    const rad = kind === 'can' ? 0.033 : kind === 'plastic' ? 0.036 : 0.031;
    const e = kind === 'glass' ? 0.32 : kind === 'can' ? 0.22 : 0.12;
    const ts = ground + 0.05 + j * 0.055 + R() * 0.05;
    let x = openX * (0.8 + 0.2 * R()) + w / 2 - 0.1, z = (R() - 0.5) * 0.4, y = 0.08 + R() * 0.3;
    let vx = 0.5 + R() * 1.3, vz = (R() - 0.3) * 1.2, vy = 0.2 + R() * 0.5;
    let roll = R() * 6.28, heading = Math.atan2(vz, vx), spin = 0;
    const curve = kind === 'glass' ? (R() - 0.5) * 1.6 : (R() - 0.5) * 0.3; // bottles curve around their neck
    const n = Math.ceil(3.6 * sampleHz);
    const P = new Float32Array(n * 5);            // x, y, z, roll, heading
    let last = -1, kk = 0, rolling = false;
    for (let s = 0; s < 3.6 / dt; s++) {
      const tt = s * dt;
      if (!rolling) {
        vy -= g * dt; x += vx * dt; y += vy * dt; z += vz * dt; roll += spin * dt;
        if (z > TOTER.gutterZ - rad && vz > 0) { z = TOTER.gutterZ - rad; vz = -vz * 0.3; }
        if (y <= 0) {
          y = 0;
          const v = -vy;
          if (v > 0.25 && tt - last > 0.04) { impacts.push({ t: +(t0 + ts + tt).toFixed(4), type: kind, v: +Math.min(1, v / 3).toFixed(3) }); last = tt; }
          vy = v * e;
          vx *= 0.75; vz *= 0.75;
          spin = Math.hypot(vx, vz) / rad;
          if (vy < 0.18) { rolling = true; vy = 0; }
        }
      } else {
        // rolling on the cambered road: slope pulls toward the gutter (+z) and downhill (+x), friction slows it
        const sp = Math.hypot(vx, vz);
        heading = Math.atan2(vz, vx) + curve * dt * (sp > 0.05 ? 1 : 0);
        const fr = Math.min(sp, (kind === 'glass' ? 0.5 : 0.3) * dt);
        vx = Math.cos(heading) * Math.max(0, sp - fr) + TOTER.alongSlope * g * 0.65 * dt;
        vz = Math.sin(heading) * Math.max(0, sp - fr) + TOTER.crossSlope * g * 0.65 * dt;
        x += vx * dt; z += vz * dt;
        roll += (Math.hypot(vx, vz) / rad) * dt;
        // NW curb face: bounce back into the gutter
        if (z > TOTER.gutterZ - rad && vz > 0) {
          const v = vz;
          z = TOTER.gutterZ - rad;
          if (v > 0.12 && tt - last > 0.05) { impacts.push({ t: +(t0 + ts + tt).toFixed(4), type: kind, v: +Math.min(1, v / 2).toFixed(3), curb: true }); last = tt; }
          vz = -v * 0.25;
        }
      }
      if (tt >= kk / sampleHz && kk < n) { P[kk * 5] = x; P[kk * 5 + 1] = y; P[kk * 5 + 2] = z; P[kk * 5 + 3] = roll; P[kk * 5 + 4] = heading; kk++; }
    }
    for (; kk < n; kk++) { P.copyWithin(kk * 5, (kk - 1) * 5, kk * 5); }
    items.push({ kind, rad, ts, P, n });
  }
  impacts.push({ t: t0, type: 'clip', v: 0.6 });   // the camera clips the toter
  impacts.sort((a, b) => a.t - b.t);
  return { body, lid, items, impacts, N, ground };
}
const _toter = simToter();
export const binImpacts = _toter.impacts;
export const binImpactTimes = binImpacts.map((x) => x.t);
export const toterSim = _toter; // tables for the props module (local frame, seconds from CUES.binKnock)

// ---------------------------------------------------------------------------------------------------------------
// CURTAIN (NW side): twitches aside at curtainMove, holds, falls back.
export function curtainOpen(t) {
  const t0 = CUES.curtainMove;
  if (t < t0 - 0.2) return 0;
  const a = smoothstep(t0, t0 + 0.45, t);
  const b = 1 - smoothstep(t0 + 1.9, t0 + 2.9, t);
  return Math.max(0, a * b + 0.04 * Math.sin((t - t0) * 9) * Math.exp(-Math.max(0, t - t0 - 0.45) * 3) * (t > t0 + 0.45 ? 1 : 0));
}

// ---------------------------------------------------------------------------------------------------------------
// 3607 WINDOW impacts (from cues): times at which the pane is struck from inside.
export const windowImpactTimes = [CUES.scare1, CUES.scare1Knock2];

// TV (3607): screen state. 'off' until tvFlickerStart, power-on stutter, EAS card from easStart, static from easBreak.
export function tvState(t) {
  if (t < CUES.tvFlickerStart) return { mode: 'off', level: 0 };
  if (t < CUES.easStart) {
    const x = (t - CUES.tvFlickerStart) / (CUES.easStart - CUES.tvFlickerStart);
    const on = noise1(t * 37, 4) > 0.15 - x * 0.9 ? 1 : 0.1;
    return { mode: 'eas', level: on * (0.4 + 0.6 * x) };
  }
  if (t < CUES.easBreak) {
    const glitch = noise1(t * 23, 6) > 0.86 ? 0.55 : 1;
    return { mode: 'eas', level: glitch * (0.93 + 0.07 * noise1(t * 60, 8)) };
  }
  // static, with brief returns of the card
  const back = noise1(t * 1.3, 12) > 0.82 && t < CUES.easBreak + 2.5;
  return { mode: back ? 'eas' : 'static', level: 0.75 + 0.25 * noise1(t * 30, 13) };
}

// ---------------------------------------------------------------------------------------------------------------
// DRESS (v2): the 3607 animatronic skeleton's jaw-clack / head-jerk syllable times for both tinny-speaker laughs
// ("Happy Hal-low-een! Ha ha ha ha!", ~9 beats). The AUDIO agent schedules the matching voice line + clack SFX
// from these same times so picture and sound always agree. laugh1 is the full-length trigger (animatronicLaugh,
// ~2.6 s); laugh2 is the shorter re-trigger further off (animatronicLaugh2).
const ANIMATRONIC_SYLLABLES = [0.0, 0.14, 0.32, 0.48, 0.68, 1.15, 1.45, 1.75, 2.05];
export const animatronicClacks = {
  laugh1: ANIMATRONIC_SYLLABLES.map((dt) => +(CUES.animatronicLaugh + dt).toFixed(3)),
  laugh2: ANIMATRONIC_SYLLABLES.slice(0, 7).map((dt) => +(CUES.animatronicLaugh2 + dt).toFixed(3)),
};

// =================================================================================================================
// ---- CAR agent section (v2 car A / car B). Only the CAR agent edits between these markers. --------------------
// Car frame (glTF): +X = forward (world -Z), +Y up, +Z = car right = the street side (world +X).
// roll > 0: the roof leans toward the street side; pitch > 0: nose up; heave > 0: body up (metres).
// Body response to an impulse = damped oscillation on tired springs; `loads` = quasi-static weight (someone leaning).
export const CAR_SPRING = { fRoll: 1.45, fPitch: 1.75, fHeave: 1.6, zeta: 0.2 };
function carSpring(x, f, zeta) {
  if (x <= 0) return 0;
  const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - zeta * zeta);
  return Math.exp(-zeta * w * x) * Math.sin(wd * x);
}
function carRockSum(t, events, loads) {
  let roll = 0, pitch = 0, heave = 0;
  const { fRoll, fPitch, fHeave, zeta } = CAR_SPRING;
  for (let i = 0; i < events.length; i++) {
    const e = events[i], x = t - e.t;
    if (x <= 0 || x > 6) continue;
    roll += (e.roll || 0) * carSpring(x, fRoll, zeta);
    pitch += (e.pitch || 0) * carSpring(x, fPitch, zeta);
    heave += (e.heave || 0) * carSpring(x, fHeave, zeta);
  }
  for (let i = 0; i < loads.length; i++) {
    const l = loads[i];
    const k = smoothstep(l.t0, l.t0 + (l.rise || 0.3), t) * (1 - smoothstep(l.t1, l.t1 + (l.fall || 0.6), t));
    roll += (l.roll || 0) * k; pitch += (l.pitch || 0) * k; heave += (l.heave || 0) * k;
  }
  return { roll, pitch, heave };
}
// CAR A: scare one (the WreckVictim punches through the curb-side rear window and pushes in), our exit, and the
// WreckVictim falling out of the open street-side door in S1. Amplitudes in rad / m (peak of the first swing ~0.7x).
export const CAR_A_ROCK = {
  events: [
    { t: CUES.windowSmash, roll: 0.011, pitch: 0.0015, heave: -0.003, kind: 'smash' },        // punch from the curb side
    { t: CUES.smashFace, roll: -0.007, heave: -0.004, kind: 'push' },                         // its weight on the sill
    { t: CUES.smashGrab, roll: -0.009, heave: -0.004, kind: 'push' },                         // both arms in, grabs
    { t: +(CUES.smashGrab + 0.42).toFixed(3), roll: -0.005, kind: 'push' },
    { t: +(CUES.smashHoldEnd - 0.25).toFixed(3), roll: -0.007, heave: -0.002, kind: 'push' },  // shoves in further
    { t: CUES.carDoorOpen, roll: 0.007, heave: -0.004, kind: 'door' },                        // we shove the door, scramble
    { t: +(CUES.fallAsphalt - 0.3).toFixed(3), roll: -0.005, heave: 0.005, kind: 'exit' },    // our weight leaves
    { t: +(CUES.fallAsphalt + 0.6).toFixed(3), roll: -0.006, kind: 'push' },                  // it drags itself in
    { t: +(CUES.shotS1 + 0.7).toFixed(3), roll: 0.009, heave: 0.003, kind: 'fallOut' },       // it falls out (S1)
  ],
  loads: [
    { t0: CUES.smashFace, t1: CUES.shotS1 + 0.6, rise: 0.5, fall: 0.8, roll: -0.006, heave: -0.005 }, // leaning in
  ],
};
export function carARock(t, events = CAR_A_ROCK.events, loads = CAR_A_ROCK.loads) { return carRockSum(t, events, loads); }
// CAR B: scare two. The head clangs up into the street-side sill (the street side jolts up -> roof leans to the
// curb), the grab/yank, our kick, and the infected crawling out from under it in S3.
export const CAR_B_ROCK = {
  events: [
    { t: CUES.contact2, roll: -0.017, pitch: 0.002, heave: 0.006, kind: 'clang' },
    { t: CUES.grabYank, roll: 0.006, kind: 'pull' },
    { t: +(CUES.grabYank + 0.28).toFixed(3), roll: 0.004, kind: 'pull' },
    { t: CUES.kickFree, roll: -0.006, heave: 0.003, kind: 'kick' },
    { t: +(CUES.kickFree + 0.38).toFixed(3), roll: 0.004, kind: 'kick' },
    { t: +(CUES.nearMiss - 0.9).toFixed(3), roll: 0.006, kind: 'crawlOut' },
  ],
  loads: [],
};
export function carBRock(t, events = CAR_B_ROCK.events, loads = CAR_B_ROCK.loads) { return carRockSum(t, events, loads); }
export const carAClangTimes = CAR_A_ROCK.events.map((e) => e.t);     // body thumps / suspension creaks (audio)
export const carBRockTimes = CAR_B_ROCK.events.map((e) => e.t);
export const carBClangTime = CUES.contact2;                          // the head on the sill (metallic clang)

// CAR A street-side rear door (radians, 0 = shut, + = open outward): latch pops at carDoorOpen - 0.06, shoved open
// to ~66 deg in 0.34 s, thumps into the check strap, bounces and settles ~3 deg short. Stays open.
export const CAR_A_DOOR = { open: 66 * Math.PI / 180, pop: 0.035, popDur: 0.06, shove: 0.34 };
export function carARearDoorAngle(t) {
  const { open, pop, popDur, shove } = CAR_A_DOOR;
  const t0 = CUES.carDoorOpen;
  if (t < t0 - popDur) return 0;
  if (t < t0) return pop * smoothstep(t0 - popDur, t0, t);
  const x = t - t0;
  if (x < shove) { const u = x / shove; return pop + (open - pop) * (1 - Math.pow(1 - u, 2.2)); }
  const y = x - shove;
  return open - 0.085 * Math.abs(Math.sin(y * 9)) * Math.exp(-y * 5) - 0.05 * (1 - Math.exp(-y * 3));
}
export const carADoorTimes = [+(CUES.carDoorOpen - CAR_A_DOOR.popDur).toFixed(3), +(CUES.carDoorOpen + CAR_A_DOOR.shove).toFixed(3)]; // latch, check strap

// CAR B under-car drips: fixed sources on the underbody (car B frame, metres; y = height above the ground under the
// car), each drips every `period` s (jittered); a drop falls in sqrt(2h/g). The face drip is extra: it leaves
// the underbody so that it lands at exactly CUES.dripOnFace (its source/landing point is set by src/props/car.js).
// (pass 1: heights = car B's modelled SUV underbody, src/props/underbody.js heightAt)
export const UNDER_DRIPS = [
  { x: 1.02, y: 0.25, z: 0.44, period: 2.3, phase: 0.4 },    // front subframe corner, street side
  { x: 0.55, y: 0.275, z: 0.79, period: 3.1, phase: 1.7 },   // street-side floor pan seam, front
  { x: -0.30, y: 0.275, z: 0.80, period: 2.7, phase: 0.9 },  // street-side floor pan seam, middle
  { x: -0.95, y: 0.275, z: 0.78, period: 3.6, phase: 2.6 },  // street-side floor pan seam, rear
  { x: 0.78, y: 0.22, z: -0.19, period: 1.9, phase: 0.2 },   // resonator low point
  { x: -1.35, y: 0.215, z: 0.10, period: 2.5, phase: 1.3 },  // rear differential
  { x: -0.85, y: 0.215, z: -0.6, period: 4.2, phase: 3.1 },  // fuel tank strap, curb side
  { x: 0.75, y: 0.275, z: -0.62, period: 3.3, phase: 2.2 },  // floor pan rib, curb side
];
const G = 9.81;
export function dripFallTime(h) { return Math.sqrt(2 * Math.max(0.005, h) / G); }
// detach times of source i in [t0, t1)
export function dripDetachTimes(i, t0, t1) {
  const s = UNDER_DRIPS[i], out = [];
  const k0 = Math.floor((t0 - s.phase) / s.period) - 1, k1 = Math.ceil((t1 - s.phase) / s.period) + 1;
  for (let k = k0; k <= k1; k++) {
    const td = s.phase + k * s.period + 0.35 * s.period * (noise1(k * 1.37 + i * 11.1, 71) * 0.5);
    if (td >= t0 && td < t1) out.push(td);
  }
  return out;
}
// every drip that LANDS in [t0, t1): { t (landing), td (detach), i (source) }; under-car window by default (audio)
export function underDripEvents(t0 = CUES.shotU1, t1 = CUES.standUp + 1.5) {
  const ev = [];
  for (let i = 0; i < UNDER_DRIPS.length; i++) {
    const tf = dripFallTime(UNDER_DRIPS[i].y);
    for (const td of dripDetachTimes(i, t0 - tf, t1 - tf)) ev.push({ t: +(td + tf).toFixed(4), td: +td.toFixed(4), i });
  }
  ev.push({ t: CUES.dripOnFace, td: +(CUES.dripOnFace - dripFallTime(0.09)).toFixed(4), i: -1, face: true });
  return ev.sort((a, b) => a.t - b.t);
}
export const underDripTimes = underDripEvents().map((e) => e.t);
// ---- end CAR agent section --------------------------------------------------------------------------------------
