// The sound design, as data: every event is placed relative to src/film/cues.js (never hard-coded beat times).
// v2 "HIDE": rewritten for the new cut-based structure (docs/DESIGN-v2.md) -- prologue at the display, Act 1 hiding
// in car A, Act 2 pinned under car B, Act 3 the street wakes, Act 4 false safety in 3609, then the handoff.
//
// Event fields (see mixer.js play()):
//   tag      cue-sheet label ('scare1.slap'); tools can solo/mute by prefix
//   t        film time of the event's anchor; anchor:'onset' lines the asset's measured attack up with t
//   snd      asset id (assets/audio/manifest.json) | synth: 'static' | 'noise' | 'drone' (partials)
//   gain     dB (assets are normalised to -1.5 dBFS peak); env: [[t, dB]] absolute keyframes instead
//   bus      'ext' (outside; muffled by the refuge door, or by car A / under car B once inside them)
//            | 'int' (3609 room) | 'close' (player / point blank / the creature right beside us)
//            | 'tv' (3607 TV: speaker + window glass) | 'title'
//   pan | panKeys [[t, pan]] | pos {x,y,z} or pos(t) (follows the camera; ref = distance where gain applies)
//   rate, offset, dur, end, loop, fadeIn, fadeOut, filter [{type, freq, q, gain}], send {street, room, tail}
//   gateKeys [[t, 0..1, mode]] multiplicative chops

import { CUES as C, FILM, PLACES as P } from '../film/cues.js';
import { makeRng } from './rng.js';

// The TV in 3607 plays the game's own emergency broadcast line (data/audio/voice/vo_eas_shelter_01.wav), visible
// and audible through its window for the whole prologue (P1-P4) and faintly into Act 1 before the car windows and
// distance take it under the rain and wind.
export const EAS_TEXT = {
  file: 'vo_eas_shelter_01',
  spoken: 'This is the emergency alert system. Residents of Port Richmond, shelter in place. Do not approach infected individuals.',
  heard: [
    { from: 'easStart', text: 'This is the emergency alert system. Residents of Port Rich—' },
    { from: 'easBreak', text: '[static]' },
    { from: 'easBreak+1.05', text: '...not approach infected indiv— [static]' },
  ],
  screen: ['EMERGENCY ALERT SYSTEM', 'RESIDENTS OF PORT RICHMOND: SHELTER IN PLACE', 'DO NOT APPROACH INFECTED INDIVIDUALS'],
};

// World anchors for positioned sounds (Three.js frame). Events name an anchor; the engine resolves it from
// createAudio({ anchors }) / audio.setAnchors(props.anchors, world.anchors) when the page passes them, else from
// these fallbacks. The 3607/3605 stoop positions are estimated from src/world/frame.js's reference measurements
// (SE facade x ~= +5.0; 3601 Witte z ~= +21.6, ~5.2 m per address toward the terminal wall) until CREATURES/DRESS/
// CAR publish real anchors for them.
export const SOUND_PLACES = {
  streetlightFailing: { x: P.failingLight.x, y: P.failingLight.y, z: P.failingLight.z },
  displayStoop: { x: 5.2, y: 0.9, z: 6.0 },      // 3607: the pumpkin, the skeleton animatronic, both scarecrows
  screamerStoop: { x: 5.2, y: 1.6, z: 11.2 },    // 3605: the screamer, the plastic bat's railing
  railing3605: { x: 4.95, y: 0.75, z: 13.0 },
  tvWindow: { x: 5.505, y: 1.25, z: 6.352 },
  gutter: { x: 5.4, y: 0.5, z: 8.95 },
  carA: { x: P.carA.x, y: 0.75, z: P.carA.z },
  carB: { x: P.carB.x, y: 0.2, z: P.carB.z },
  refugeDoor: { x: P.refugeDoor.x, y: P.refugeDoor.y, z: P.refugeDoor.z },
  refugeRoom: { x: P.refugeRoom.x, y: P.refugeRoom.y, z: P.refugeRoom.z },
  stairsFoot3609: { x: 9.0, y: 1.4, z: 1.5 },
  bruteBlock: { x: -0.4, y: 1.8, z: 23.5 },      // toward E Venango, beyond car B
};

function softGate(keys, ramp = 0.003) {
  const out = [];
  let prev = keys.length ? keys[0][1] : 1;
  for (const [t, v] of keys) { out.push([t, prev], [t + ramp, v]); prev = v; }
  return out;
}

const lerp3 = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, y: (a.y ?? 1.6) + ((b.y ?? 1.6) - (a.y ?? 1.6)) * u, z: a.z + (b.z - a.z) * u });
const path = (t0, a, t1, b) => (t) => lerp3(a, b, Math.max(0, Math.min(1, (t - t0) / Math.max(1e-6, t1 - t0))));

// ------------------------------------------------------------------------------------------------ external arrays
export function normTimes(arr) {
  if (!Array.isArray(arr) || !arr.length) return null;
  return arr
    .map((x) => (typeof x === 'number' ? { t: x } : { ...x, t: x.t ?? x.time ?? x.start }))
    .filter((x) => Number.isFinite(x.t))
    .sort((a, b) => a.t - b.t);
}

function placeholderRailTaps() {
  const r = makeRng('rail-taps');
  const out = [];
  let t = C.railTapStart + 0.15;
  while (t < C.railTapEnd) {
    const s = 0.55 + 0.45 * r.next();
    out.push({ t, strength: s });
    if (r.next() < 0.35) out.push({ t: t + r.range(0.11, 0.2), strength: s * 0.55 });
    t += r.range(0.6, 2.3);
  }
  return out;
}
const placeholderFlicker = () => [
  { t: C.flicker1 - 0.18, dur: C.flicker1End - C.flicker1 + 0.34 },
  { t: C.flicker2 - 0.22, dur: C.flicker2End - C.flicker2 + 0.34 },
];

// The animatronic's syllable onsets (seconds from CUES.animatronicLaugh), printed by
// tools/audio/synth_assets.py's syn_animatronic_laugh(): "HAP-PY HAL-L-OW-WEEN HA HA HA HA". Velocity is the jaw's
// closing speed (louder clack = faster/harder syllable); 'L' is soft (a liquid, barely a clack).
export const ANIMATRONIC_CLACKS_FALLBACK = [
  { t: 0.035, v: 1.0 }, { t: 0.2, v: 0.85 }, { t: 0.415, v: 0.95 }, { t: 0.515, v: 0.4 }, { t: 0.58, v: 0.85 },
  { t: 0.73, v: 1.0 }, { t: 1.288, v: 0.8 }, { t: 1.536, v: 0.72 }, { t: 1.784, v: 0.8 }, { t: 2.032, v: 0.7 },
];
// Resolve the DRESS agent's animatronicClacks (either absolute film time, or offsets from the laugh's own start)
// against the measured fallback, which is already offsets from CUES.animatronicLaugh.
function resolveClacks(raw, laughStart) {
  const n = normTimes(raw);
  if (!n) return ANIMATRONIC_CLACKS_FALLBACK.map((c) => ({ t: laughStart + c.t, v: c.v }));
  const absolute = n.some((x) => x.t > 6); // offsets are always < ~2.3 s; absolute film times for this beat are > 10 s
  return n.map((x) => ({ t: absolute ? x.t : laughStart + x.t, v: x.v ?? x.strength ?? 0.85 }));
}

// Act 2: the facepaint infected's wet breathing/puddle-bubble rhythm, ~1.7 s and irregular, from faceDown until the
// gaze locks (src/film/choreo.js is expected to export breathTimesFacepaint once the lead builds the close-up).
function placeholderBreathFacepaint() {
  const r = makeRng('breath-facepaint');
  const out = [];
  let t = C.faceDown + 0.4;
  while (t < C.gazeLock2 - 0.15) { out.push(t); t += 1.7 * (0.8 + 0.4 * r.next()); }
  return out;
}

// Camera footsteps until src/film/shots.js exports them: v2 is mostly stationary (hiding in the car, pinned under
// it, sitting against the door), so -- unlike v1's continuous walk -- there is very little walking to score: a
// couple of steps standing up, the sprint for 3609, the stoop.
export function placeholderFootsteps() {
  const out = [];
  const walk = (t0, t1, dt, surface, intensity, seed) => {
    const r = makeRng(seed);
    for (let t = t0; t < t1; t += dt * (1 + 0.08 * (r.next() - 0.5))) out.push({ t, surface, intensity: intensity * (0.85 + 0.3 * r.next()) });
  };
  const at = (list, surface, intensity) => list.forEach((t) => out.push({ t, surface, intensity }));
  at([C.standUp + 0.25, C.standUp + 0.85], 'asphalt', 0.4);
  at([55.4, 56.3], 'asphalt', 0.35); // repositioning during S2, not yet the sprint
  walk(C.shotS3, C.reachStoop - 0.15, 0.3, 'asphalt', 1.0, 'fs-run');
  at([C.reachStoop - 0.1, C.reachStoop + 0.3, C.reachStoop + 0.65], 'concrete', 0.95);
  return out.sort((a, b) => a.t - b.t);
}

// ------------------------------------------------------------------------------------------------ the score
export function buildScore(ext = {}) {
  const events = [];
  const E = (tag, t, snd, o = {}) => events.push({ tag, t, snd, ...o });
  const S = (tag, t, synth, o = {}) => events.push({ tag, t, synth, ...o });
  const r = makeRng('score-v2');
  const SP = SOUND_PLACES;

  // ---------------------------------------------------------------- beds (shared across the whole film)
  // "light steady rain": the open-air flavour (prologue, Act 3's open street); ducked while inside car A / under
  // car B, where the roof/glass or underbody flavour takes over instead. A gutter runs throughout near 3607/3605;
  // its own distance falloff (pos + ref) does the fading as the car positions move away, not a hand-authored env.
  const rainOpenEnv = [
    [0, -20], [C.shotC1 - 0.4, -20], [C.shotC1 + 0.6, -34], [C.windowSmash, -34], [C.carDoorOpen, -24], [C.fallAsphalt + 0.3, -20],
    [C.shotU1 - 0.3, -20], [C.shotU1 + 0.5, -36], [C.standUp, -36], [C.shotS1, -21], [C.doorSlam - 0.2, -21], [C.doorSlam + 0.1, -38],
  ];
  E('bed.rainStreet', 0, 'rain_street', { loop: true, fadeIn: 2.5, end: C.cutToBlack + 0.05, env: rainOpenEnv, send: { street: -9 } });
  E('bed.rainRoof', C.shotC1 - 0.3, 'rain_roof', { loop: true, fadeIn: 1.2, end: C.windowSmash + 0.1, fadeOut: 0.15, gain: -16, bus: 'ext' });
  E('bed.rainGlass', C.shotC1, 'rain_glass', { loop: true, fadeIn: 1.5, end: C.windowSmash + 0.1, fadeOut: 0.15, gain: -22, bus: 'close' });
  E('bed.rainUnder', C.shotU1 - 0.2, 'rain_underbody', { loop: true, fadeIn: 1.0, end: C.standUp + 0.3, fadeOut: 0.4, gain: -13, bus: 'ext' });
  E('bed.gutter', 0.8, 'drip', { loop: true, fadeIn: 2, end: C.doorEnter, fadeOut: 2, gain: -24, pos: 'gutter', ref: 6, send: { street: -10 } });
  E('bed.wind', 0, 'bed_wind', { loop: true, fadeIn: 3.5, end: C.cutToBlack + 0.05, gain: -20.5 });
  E('bed.wires', 0, 'bed_wires', { loop: true, fadeIn: 4.5, end: C.cutToBlack + 0.05, gain: -23 });
  E('bed.night', 0, 'bed_night', { loop: true, fadeIn: 4.5, end: C.cutToBlack + 0.05, offset: 7.0, gain: -28 });
  E('bed.rumble', 0, 'bed_rumble', { loop: true, fadeIn: 3, end: C.cutToBlack + 0.05, gain: -28 });

  // the failing streetlight: the ballast buzz follows the lamp's light output; re-strikes tick. Prefer the precise
  // FLICKER_EVENTS table (src/world/flicker.js) when it is passed through; else derive ticks from flickerAt/episodes.
  const BUZZ = -31;
  const buzzEnv = [[0, BUZZ]];
  if (normTimes(ext.flickerEvents)) {
    const evs = normTimes(ext.flickerEvents);
    for (const fe of evs) {
      if (fe.t > C.doorSlam) continue;
      const lvl = fe.level ?? 1;
      buzzEnv.push([fe.t, BUZZ + 20 * Math.log10(Math.max(0.02, lvl)) - (lvl < 0.1 ? 12 : 0), 'step']);
      if (fe.blackout === undefined && lvl > 0.3) {
        E('block.flickerTick', fe.t, 'flicker_tick', { anchor: 'onset', gain: -24 + 2 * r.next(), dur: 0.05, fadeOut: 0.02, rate: 0.9 + 0.2 * r.next(), pos: 'streetlightFailing', ref: 12 });
      }
    }
  } else {
    const episodes = (normTimes(ext.flickerTimes) || placeholderFlicker().map((f) => ({ t: f.t, start: f.t, end: f.t + f.dur, strength: 1 })))
      .map((e) => ({ start: e.start ?? e.t, end: e.end ?? (e.t + (e.dur || 0.1)), strength: e.strength ?? 1 }));
    for (const ep of episodes) {
      if (ep.start > C.doorSlam) continue;
      const level = ext.flickerAt || ((t) => (t >= ep.start && t <= ep.end ? 1 - ep.strength * (Math.sin(t * 61) > 0 ? 0.95 : 0.2) : 1));
      buzzEnv.push([ep.start - 0.01, BUZZ]);
      let prev = 1; let lastTick = -1;
      for (let t = ep.start; t <= ep.end + 0.01; t += 0.01) {
        const v = Math.max(0.02, Math.min(1, level(t)));
        buzzEnv.push([t, BUZZ + 20 * Math.log10(v) - (v < 0.1 ? 12 : 0)]);
        if (v - prev > 0.45 && t - lastTick > 0.09) {
          E('block.flickerTick', t, 'flicker_tick', { anchor: 'onset', gain: -24 - 6 * (1 - ep.strength) + 2 * r.next(), dur: 0.05, fadeOut: 0.02, rate: 0.9 + 0.2 * r.next(), pos: 'streetlightFailing', ref: 12 });
          lastTick = t;
        }
        prev = v;
      }
      buzzEnv.push([ep.end + 0.02, BUZZ + 1.5], [ep.end + 0.4, BUZZ]);
    }
  }
  E('bed.buzzFailing', 0.4, 'buzz', { loop: true, fadeIn: 2.5, end: C.doorSlam + 0.05, env: buzzEnv.map(([t, d, m]) => [t, d + 4, m]), pos: 'streetlightFailing', ref: 12, trackFor: 66 });

  // wind gusts + leaf scrapes (props' wind drives the leaves on screen)
  const gusts = normTimes(ext.windGusts);
  if (gusts) {
    let k = 0;
    for (const g of gusts) {
      if (g.t > C.cutToBlack - 1 || g.t > C.titleFadeIn - 0.5) continue;
      const s = g.strength ?? 0.6;
      E('wind.gust', g.t - 0.1, k % 2 ? 'gust_2' : 'gust_1', { gain: -14 + 12 * Math.log10(s), rate: 0.94 + 0.12 * r.next() });
      if (s >= 0.55) {
        const from = (g.dir ?? 0) < 0 ? -0.65 : 0.65;
        const tl = g.t + (g.rise ?? 0.6) * 0.5;
        E('wind.leaves', tl, ['leaves_1', 'leaves_2', 'leaves_3'][k % 3], { gain: -17 + 10 * Math.log10(s), panKeys: [[tl, from], [tl + 3.2, -from * 0.8]] });
      }
      k++;
    }
  } else {
    E('wind.gust', C.windGust1 - 0.15, 'gust_1', { gain: -13 });
    E('wind.leaves', C.windGust1 + 0.3, 'leaves_1', { gain: -20, panKeys: [[C.windGust1 + 0.3, -0.65], [C.windGust1 + 3.3, 0.55]] });
    E('wind.leaves', 9.4, 'leaves_3', { gain: -25, panKeys: [[9.4, 0.4], [13.3, -0.3]] });
    E('wind.gust', 12.3, 'gust_2', { gain: -19 });
  }

  // ================================================================= PROLOGUE: THE DISPLAY (0 - 17.5, objective)
  E('display.dog', C.dogFar, 'dog_far', { gain: -25, pan: -0.55, filter: { type: 'lowpass', freq: 3000 }, send: { street: -8 } });
  const taps = normTimes(ext.railTapTimes) || placeholderRailTaps();
  const tapState = {};
  for (const tp of taps) {
    const s = tp.v ?? tp.strength ?? tp.intensity ?? 0.8;
    if (s < 0.04) continue;
    E('display.railTap', tp.t, r.pickNoRepeat(['rail_tap_1', 'rail_tap_2', 'rail_tap_3'], tapState),
      { anchor: 'onset', gain: -18 + 13 * Math.log10(Math.max(0.05, s)), rate: 0.96 + 0.08 * r.next(), pos: tp.pos || 'railing3605', ref: 6, send: { street: -14 } });
  }
  // TV: power-on stutter, the broadcast, the break into static, the card's brief returns -- visible/audible behind
  // 3607's glass through the whole prologue, fading under the rain/wind once we are hiding in car A.
  {
    const tv = ext.tvState || ((t) => {
      if (t < C.tvFlickerStart) return { mode: 'off', level: 0 };
      if (t < C.easBreak) return { mode: 'eas', level: 1 };
      const back = t > C.easBreak + 1.05 && t < C.easBreak + 2.4 && Math.sin(t * 9.3) > 0.4;
      return { mode: back ? 'eas' : 'static', level: 1 };
    });
    const voiceGate = []; const staticGate = [];
    let pv = -1; let ps = -1;
    const tvEnd = C.shotC1 + 2.0;
    for (let t = C.tvFlickerStart - 0.02; t <= tvEnd; t += 0.01) {
      const s = tv(t) || { mode: 'off', level: 0 };
      const on = s.mode !== 'off' && (s.level ?? 1) > 0.3;
      const v = t >= C.easBreak && s.mode === 'eas' && on ? 1 : 0;
      let st = 0;
      if (on) st = t < C.easBreak ? (t < C.easStart ? 0.6 : 0.3) : (v ? 0.35 : 1);
      if (v !== pv) { voiceGate.push([t, v, 'step']); pv = v; }
      if (st !== ps) { staticGate.push([t, st, 'step']); ps = st; }
    }
    S('display.tvStatic', C.tvFlickerStart - 0.02, 'static', {
      bus: 'tv', pos: 'tvWindow', end: tvEnd, fadeOut: 1.2, gateKeys: softGate(staticGate),
      env: [[C.tvFlickerStart, -34], [C.easBreak - 0.01, -34], [C.easBreak, -23, 'step'], [C.easBreak + 0.35, -27], [C.shotP4, -30], [tvEnd - 1.5, -40]],
    });
    E('display.tvHum', C.tvFlickerStart, 'buzz', { bus: 'tv', loop: true, offset: 2.1, gain: -38, pos: 'tvWindow', end: tvEnd, fadeIn: 0.05, fadeOut: 1.2,
      gateKeys: softGate(staticGate.map(([t, v, m]) => [t, v > 0 ? 1 : 0, m])) });
    E('display.eas', C.easStart, 'eas_shelter', { bus: 'tv', gain: -11.5, pos: 'tvWindow', dur: C.easBreak - C.easStart, fadeOut: 0.004 });
    E('display.easReturns', C.easBreak, 'eas_shelter', { bus: 'tv', gain: -14.5, offset: C.easBreak - C.easStart, dur: 2.9, pos: 'tvWindow', gateKeys: softGate(voiceGate) });
  }
  // the animatronic: relay click + servo whine, then the tinny toy-speaker voice with jaw claks on the syllables
  {
    E('display.relay', C.animatronicTrigger, 'relay_click', { anchor: 'onset', gain: -9, pos: 'displayStoop', ref: 4, send: { street: -10 } });
    E('display.servo', C.animatronicTrigger + 0.01, 'servo_whine', { gain: -14, pos: 'displayStoop', ref: 4 });
    const laughs = [
      { t: C.animatronicLaugh, key: 'laugh1', snd: 'animatronic_laugh', gain: -3, clackGain: -11, lp: null, send: { street: -8 } },
      { t: C.animatronicLaugh2, key: 'laugh2', snd: 'animatronic_laugh_far', gain: -11, clackGain: -19, lp: { type: 'lowpass', freq: 2200 }, send: { street: -4, tail: -16 } },
    ];
    for (const L of laughs) {
      if (L.t > C.cutToBlack) continue;
      E('display.laugh', L.t, L.snd, { anchor: 'onset', gain: L.gain, pos: 'displayStoop', ref: 4, filter: L.lp || undefined, send: L.send });
      // DRESS publishes { laugh1: [9 absolute times], laugh2: [7 absolute times] } in src/props/timings.js (one
      // entry per syllable, no velocity); pick the matching half so the jaw clack and this clack agree. A bare
      // array (older shape, or nothing published yet) still works through resolveClacks's own fallback table.
      const raw = ext.animatronicClacks && !Array.isArray(ext.animatronicClacks) ? ext.animatronicClacks[L.key] : ext.animatronicClacks;
      const clacks = resolveClacks(raw, L.t);
      for (const c of clacks) E('display.clack', c.t, 'teeth_clack', { anchor: 'onset', gain: L.clackGain + 10 * Math.log10(Math.max(0.1, c.v)), rate: 0.92 + 0.12 * r.next(), pos: 'displayStoop', ref: 4 });
    }
  }
  // the sack-masked scarecrow lifts its head in the out-of-focus background (barely audible: easy to overlook)
  E('display.headLift', C.scarecrowHeadLift + 0.3, 'rustle', { gain: -34, offset: 0.4, dur: 1.0, fadeIn: 0.3, fadeOut: 0.4, pos: 'displayStoop', ref: 4 });
  // figures step out from between cars/doorways and turn toward the noise: distant, quiet, staggered
  {
    const fig = makeRng('figures-turn');
    const spots = [[-2.0, -8.5], [1.0, -16.0], [-1.8, -2.5]];
    spots.forEach(([x, z], i) => {
      const t = C.figuresTurn + i * 0.7 + fig.range(0, 0.4);
      E('display.figureStep', t, fig.pick(['dragstep_1', 'dragstep_2', 'step_asph_1']), { gain: -30, pos: { x, y: 0.1, z }, ref: 8, send: { street: -10 } });
    });
  }

  // ================================================================= ACT 1: THE CAR (17.5 - 33.6) -- SCARE ONE
  // rain on the roof/glass is scheduled in the beds block above; our breathing, shallow and held, faster after
  // flicker1; C2 (23.0-25.2) is an objective cutaway outside the car, so the ext bus briefly opens up and the
  // approaching scarecrow's wet burlap/breath is heard close.
  {
    const slow = [C.shotC1 + 0.6, C.shotC1 + 4.3, C.shotC1 + 8.0, C.shotC1 + 11.6];
    slow.forEach((t, i) => E('car.breathSlow', t, i % 2 ? 'breath_out_soft' : 'breath_in_soft', { bus: 'close', gain: -24 }));
    for (let t = C.flicker1 + 0.5, i = 0; t < C.windowSmash - 0.4; t += 1.05 + 0.1 * r.next(), i++) {
      E('car.breathFast', t, i % 2 ? 'breath_pant_out' : 'breath_pant_in', { bus: 'close', gain: -20 - (i % 2) });
    }
  }
  // C2 objective insert: outside, rain open, the scarecrow close -- wet burlap breath
  E('car.c2Open', C.shotC2, 'rain_street', { offset: 1.5, dur: C.shotC3 - C.shotC2 + 0.3, fadeIn: 0.2, fadeOut: 0.3, gain: -16 });
  E('car.scarecrowBreath', C.shotC2 + 0.4, 'idle_o', { gain: -14, pos: 'carA', ref: 2, filter: { type: 'lowpass', freq: 2600 }, send: { street: -10 } });
  E('car.scarecrowSack', C.shotC2 + 0.9, 'rustle', { gain: -20, offset: 0.6, dur: 1.2, pos: 'carA', ref: 2 });
  // the scarecrow approaching under the failing light, during C1/C3 (POV): distant dragged steps that get closer
  {
    const approach = path(C.shotC1, { x: 0.2, y: 0.1, z: -19.2 }, C.windowSmash - 0.6, { x: -0.1, y: 0.1, z: -1.5 });
    for (let t = C.shotC1 + 1.0, i = 0; t < C.windowSmash - 0.7; t += 1.6 + 0.3 * r.next(), i++) {
      E('car.scarecrowStep', t, r.pick(['dragstep_1', 'dragstep_2', 'dragstep_3']), { gain: -26 + 8 * (t - C.shotC1) / (C.windowSmash - C.shotC1), pos: approach, ref: 10, send: { street: -12 } });
    }
  }

  // SCARE ONE at windowSmash: the curb-side rear window (our left) explodes inward -- a WreckVictim punches through
  const PL = -0.62; // the window is beside the camera, on our left (curb side)
  E('scare1.smash', C.windowSmash, 'glass_slap_1', { anchor: 'onset', gain: -1, pan: PL, send: { street: -16 } });
  E('scare1.smashTex', C.windowSmash + 0.003, 'glass_slap_2', { anchor: 'onset', gain: -8, pan: PL + 0.05 });
  E('scare1.thump', C.windowSmash, 'thump_low', { anchor: 'onset', gain: -6, pan: PL + 0.1 });
  E('scare1.ring', C.windowSmash, 'glass_ring_2', { anchor: 'onset', gain: -2, pan: PL - 0.02, send: { street: -12 } });
  E('scare1.roar', C.windowSmash + 0.02, 'roar_gut', { anchor: 'onset', bus: 'close', gain: -5, rate: 0.92 });
  E('scare1.gasp', C.windowSmash + 0.06, 'breath_gasp', { bus: 'close', gain: -9 });
  E('scare1.shards', C.windowSmash + 0.04, 'glass_shards', { gain: -11, pan: PL + 0.15 });
  const faceMuffle = [{ type: 'lowpass', freq: 2600, q: 0.7 }];
  E('scare1.face', C.smashFace, 'groan_glass_1', { bus: 'close', gain: -4, rate: 0.9, filter: faceMuffle });
  E('scare1.grab', C.smashGrab, 'fabric_2', { bus: 'close', gain: -10, filter: { type: 'highpass', freq: 250 } });
  E('scare1.grab2', C.smashGrab + 0.07, 'grab', { bus: 'close', gain: -13 });
  E('scare1.squeak', C.windowSmash + 0.5, 'glass_squeak', { gain: -22, pan: PL });
  [[C.smashHoldEnd - 0.15, 'breath_pant_in', -22], [C.smashHoldEnd + 0.2, 'breath_pant_out', -22]].forEach(([t, s, g]) => E('scare1.after', t, s, { bus: 'close', gain: g }));
  E('scare1.doorOpen', C.carDoorOpen, 'door_creak_push', { anchor: 'onset', gain: -16, pan: -0.3 });
  E('scare1.doorClunk', C.carDoorOpen + 0.08, 'veh_clank', { anchor: 'onset', gain: -14, pan: -0.3 });
  E('scare1.fallThud', C.fallAsphalt, 'body_fall_wet', { anchor: 'onset', bus: 'close', gain: -7 });
  E('scare1.fallCloth', C.fallAsphalt + 0.02, 'fabric_1', { bus: 'close', gain: -14 });
  E('scare1.fallWinded', C.fallAsphalt + 0.3, 'winded_2', { bus: 'close', gain: -18 });
  E('scare1.behindGlass', C.fallAsphalt + 0.5, 'groan_glass_2', { gain: -19, rate: 0.9, pan: -0.4, filter: faceMuffle });
  E('scare1.dragIn', C.fallAsphalt + 0.8, 'dragstep_3', { gain: -22, pan: -0.35, send: { street: -14 } });
  // subtle car-body creaks from the CAR agent's own rock simulation (carAClangTimes, flagged "(audio)" in
  // src/props/timings.js): quiet texture under the glass attack and the car settling after, not a separate layer.
  {
    const clangs = normTimes(ext.carAClangTimes);
    if (clangs) for (const c of clangs) E('scare1.bodyCreak', c.t, r.pick(['veh_creak', 'suspension_creak']), { gain: -24 + 6 * r.next(), pos: 'carA', ref: 3, send: { street: -16 } });
  }

  // ================================================================= ACT 2: UNDER (33.6 - 52.5) -- SCARE TWO
  // close, dry, claustrophobic: rain_underbody (beds) carries the exterior now; everything here is on the close
  // bus (dry, no reverb) except the walker's feet passing on the street above/beside us.
  E('under.slide', C.shotU1, 'fabric_2', { bus: 'close', gain: -15, offset: 0.1, dur: 0.9, fadeIn: 0.1, fadeOut: 0.3 });
  E('under.settle', C.underSettle, 'breath_gasp_b', { bus: 'close', gain: -16 });
  for (let t = C.underSettle + 0.6, i = 0; t < C.feet1 - 0.3; t += 1.3 + 0.2 * r.next(), i++) {
    E('under.ownBreath', t, i % 2 ? 'breath_out_soft' : 'breath_in_soft', { bus: 'close', gain: -22 });
  }
  // feet1: an unrelated walker passes along the street above/beside us (bare foot, one shoe, dragging) -- moving
  // through and on, not stopping
  {
    const walkerPath = path(C.feet1, { x: SP.carB.x + 0.4, y: 0.05, z: SP.carB.z - 2.6 }, C.feet1 + 2.8, { x: SP.carB.x + 0.4, y: 0.05, z: SP.carB.z + 2.9 });
    let foot = 0;
    for (let t = C.feet1, i = 0; t < C.feet1 + 2.75; i++, foot ^= 1) {
      if (foot === 0) E('under.walkerBareFoot', t, i % 2 ? 'barefoot_slap_1' : 'barefoot_slap_2', { gain: -19, pos: walkerPath, ref: 2.2, rate: 0.95 + 0.1 * r.next(), send: { street: -16 } });
      else { E('under.walkerShoe', t, r.pick(['step_asph_1', 'step_asph_3']), { gain: -23, pos: walkerPath, ref: 2.2, rate: 0.9 }); E('under.walkerDrag', t + 0.1, r.pick(['dragstep_2', 'dragstep_4']), { gain: -28, pos: walkerPath, ref: 2.2 }); }
      t += 0.56 + 0.08 * r.next();
    }
  }
  // feetStop: the facepaint infected itself arrives and stops beside the car -- this is the one that kneels next
  {
    const arrive = path(C.feet1 + 1.3, { x: SP.carB.x + 0.3, y: 0.05, z: SP.carB.z - 1.7 }, C.feetStop, { x: SP.carB.x + 0.25, y: 0.05, z: SP.carB.z - 0.3 });
    for (let t = C.feet1 + 1.4, i = 0; t < C.feetStop - 0.08; t += 0.5 + 0.05 * r.next(), i++) {
      E('under.approachStep', t, r.pick(['step_asph_2', 'step_asph_4', 'step_asph_5']), { gain: -14, pos: arrive, ref: 1.8, rate: 0.95 + 0.08 * r.next() });
    }
    E('under.stop', C.feetStop, 'step_asph_1', { anchor: 'onset', gain: -11, pos: 'carB', ref: 1.6, rate: 0.85 });
  }
  E('under.kneel', C.kneel, 'knee_thud_wet', { anchor: 'onset', bus: 'close', gain: -5 });
  E('under.kneelCloth', C.kneel + 0.02, 'fabric_3', { bus: 'close', gain: -16 });
  E('under.handsDown', C.handsDown, 'puddle_slap', { anchor: 'onset', bus: 'close', gain: -6 });
  E('under.faceDown', C.faceDown, 'rustle', { bus: 'close', gain: -22, offset: 0.2, dur: 0.9, fadeIn: 0.1, fadeOut: 0.3 });
  // its wet breathing at 60 cm + bubbling in the puddle on its breath times; the drip from the underbody on its face
  {
    const breathTimes = normTimes(ext.breathTimesFacepaint) || placeholderBreathFacepaint().map((t) => ({ t }));
    const bState = {}; const bubState = {};
    const prox = [{ type: 'lowshelf', freq: 220, gain: 4 }];
    for (const b of breathTimes) {
      // it stops breathing (and the puddle stops bubbling) the instant its eyes lock: gazeLock2 to lunge2 is the
      // quietest moment of the act (lead's note), so nothing from this loop may sound at or after gazeLock2.
      if (b.t >= C.gazeLock2) continue;
      E('under.creatureBreath', b.t, r.pickNoRepeat(['zbreath_1', 'zbreath_2', 'zbreath_3'], bState), { bus: 'close', gain: -10, rate: 0.84 + 0.06 * r.next(), filter: prox });
      E('under.bubble', b.t + 0.05, r.pickNoRepeat(['puddle_bubble_1', 'puddle_bubble_2', 'puddle_bubble_3'], bubState), { bus: 'close', gain: -14 });
    }
    E('under.jawClick', C.inspectStart + 0.6, 'jaw_click', { bus: 'close', gain: -18 });
  }
  E('under.drip', C.dripOnFace, 'drip_plink', { anchor: 'onset', bus: 'close', gain: -8 });
  // phoneBuzz2: our phone wakes in our hand -- two muffled vibration buzzes against the asphalt (on vibrate, no
  // ringtone; low-mid rattle, not a clean motor whine). Its cold screen light is what finally reveals the face.
  {
    const buzzFilter = [{ type: 'lowpass', freq: 850, q: 0.7 }, { type: 'peaking', freq: 170, q: 1.1, gain: 5 }];
    E('under.phoneBuzz1', C.phoneBuzz2, 'phone_buzz_1', { bus: 'close', loop: true, dur: 0.42, fadeIn: 0.02, fadeOut: 0.05, gain: -15, filter: buzzFilter });
    E('under.phoneBuzz2', C.phoneBuzz2 + 0.70, 'phone_buzz_2', { bus: 'close', loop: true, dur: 0.42, fadeIn: 0.02, fadeOut: 0.05, gain: -15, filter: buzzFilter });
  }
  // gazeLock2: its eyes lock onto us -- everything close stops (handled above/below); only rain, the drip, and our
  // own held breath remain until lunge2. A single quiet breath-catch, not continuous breathing: we are holding it.
  E('under.ownHeldBreath', C.gazeLock2 + 0.1, 'breath_in_soft', { bus: 'close', gain: -25 });
  E('under.gazeHush', C.gazeLock2, null, { synth: 'noise', color: 'pink', gain: -70, dur: 0.05 }); // placeholder keeps the tag visible in the cue sheet
  // SCARE TWO: it lunges under the car -- metallic CLANG on the underbody + suspension creak/rock + snarl/roar + grab
  const DL = -0.35; // the creature reaches from our left under the car (adjust once shots.js gives exact blocking)
  E('scare2.lunge', C.lunge2, 'lunge', { anchor: 'onset', bus: 'close', gain: -5, pan: DL * 0.5, send: { street: -16 } });
  E('scare2.clang', C.contact2, 'underbody_clang', { anchor: 'onset', gain: -5, pan: DL, send: { street: -10 } });
  E('scare2.creak', C.contact2 + 0.02, 'suspension_creak', { gain: -11, pan: DL });
  E('scare2.rock', C.contact2 + 0.05, 'veh_creak', { gain: -15, offset: 0.1, pan: DL * 0.6 });
  E('scare2.roar', C.contact2 + 0.03, 'roar_gut_b', { anchor: 'onset', bus: 'close', gain: -6, rate: 0.85 });
  E('scare2.snarl', C.contact2 + 0.1, 'snarl', { bus: 'close', gain: -8 });
  E('scare2.grab', C.contact2 + 0.08, 'fabric_1', { bus: 'close', gain: -10, filter: { type: 'highpass', freq: 250 } });
  E('scare2.grabHand', C.grabYank, 'grab', { bus: 'close', gain: -9 });
  E('scare2.gasp', C.grabYank + 0.05, 'breath_gasp_b', { bus: 'close', gain: -12 });
  {
    // prefer the CAR agent's v2 rock events (carBRockTimes: contact2/grabYank/kickFree-aligned); carRattleTimes is a
    // stale v1 export still pointing at the retired scare2Contact cue (CUES.NEVER), kept only as a last-resort fallback.
    const rt = normTimes(ext.carBRockTimes) || normTimes(ext.carRattleTimes) || [{ t: C.contact2 + 0.3 }];
    for (const jt of rt) if (jt.t > C.contact2 + 0.1 && jt.t < C.kickFree) E('scare2.jolt', jt.t, 'suspension_creak', { anchor: 'onset', gain: -14, rate: 1.05 + 0.1 * r.next(), pan: DL });
  }
  E('scare2.kick', C.kickFree, 'gravel_scrape', { bus: 'close', gain: -9 });
  E('scare2.kickCloth', C.kickFree + 0.02, 'fabric_2', { bus: 'close', gain: -13 });
  E('scare2.frustGrowl', C.kickFree + 0.3, 'zgrowl_1', { gain: -13, pan: DL, send: { street: -10 } });
  E('scare2.roll', C.rollOut, 'gravel_scrape', { bus: 'close', gain: -8, rate: 0.9 });
  E('scare2.rollCloth', C.rollOut + 0.03, 'fabric_3', { bus: 'close', gain: -12 });
  E('scare2.standWinded', C.standUp, 'winded_1', { bus: 'close', gain: -16 });
  E('scare2.standPant', C.standUp + 0.6, 'breath_pant_in', { bus: 'close', gain: -20 });

  // ================================================================= ACT 3: THE STREET WAKES (52.5 - 64.0)
  E('wakes.crowdFar', C.shotS1, 'crowd_far', { loop: true, fadeIn: 1.5, end: C.doorSlam, send: { street: -6 },
    env: [[C.shotS1, -38], [C.screamerShriek, -30], [C.bruteBlocks + 1, -27], [C.shotS3, -24], [C.doorEnter, -26], [C.doorSlam - 0.2, -27]] });
  E('wakes.crowdNear', C.bruteBlocks, 'crowd_near', { loop: true, fadeIn: 1.5, end: C.relief, fadeOut: 2, send: { street: -8 },
    env: [[C.bruteBlocks, -42], [C.shotS3, -28], [C.reachStoop, -24], [C.doorSlam - 0.2, -25], [C.doorSlam + 3.5, -30], [C.relief, -36]] });
  E('wakes.shriek', C.screamerShriek, 'shriek', { anchor: 'onset', gain: -16.5, pos: 'screamerStoop', filter: { type: 'lowpass', freq: 6000 }, send: { tail: -5, street: -3 } });
  E('wakes.shriekEcho', C.screamerShriek + 0.115, 'shriek', { anchor: 'onset', gain: -28, pan: -0.3, filter: { type: 'lowpass', freq: 2500 }, send: { tail: -8 } });
  {
    const B = 'bruteBlock';
    [[0, 'brute_step_1', -12], [0.85, 'brute_step_2', -11], [1.7, 'brute_step_3', -11], [2.6, 'brute_step_1', -11]].forEach(([d, s, g]) =>
      E('wakes.bruteStep', C.bruteBlocks + d, s, { anchor: 'onset', gain: g, rate: d > 2 ? 0.95 : 1, pos: B, ref: 7, send: { street: -8 } }));
    E('wakes.bruteGrowl', C.bruteBlocks + 0.45, 'brute_growl', { gain: -13, pos: B, ref: 7, send: { street: -8 } });
    E('wakes.bruteRoar', C.bruteBlocks + 2.0, 'brute_roar', { gain: -13.5, pos: B, ref: 7, send: { street: -6 } });
  }
  // the sack-masked scarecrow walking down the middle of the street, and the wreck victim out of car A
  {
    const scTrack = path(C.shotS1, { x: 0.1, y: 0.1, z: -1.5 }, C.shotS3 + 1.0, { x: 0.3, y: 0.1, z: 9.0 });
    for (let t = C.shotS1 + 0.4, i = 0; t < C.shotS3 + 0.8; t += 0.8 + 0.1 * r.next(), i++) E('wakes.scarecrowStep', t, r.pick(['dragstep_1', 'dragstep_3']), { gain: -24, pos: scTrack, ref: 8, send: { street: -10 } });
    E('wakes.wreckGrowl', C.shotS1 + 0.6, 'zgrowl_2', { gain: -17, pos: 'carA', ref: 5, send: { street: -10 } });
  }
  // our run across the street: heavy breathing + near miss + reaching the stoop
  E('wakes.runCloth', C.shotS3 + 0.1, 'fabric_1', { bus: 'close', gain: -18 });
  for (let t = C.shotS3 + 0.3, k = 0; t < C.doorEnter - 0.1; t += 0.32 + 0.03 * r.next(), k++) {
    E('wakes.pant', t, k % 2 ? 'breath_pant_out' : 'breath_pant_in', { bus: 'close', gain: -19 - (k % 2) });
  }
  E('wakes.nearMissSwipe', C.nearMiss, 'swipe_whoosh', { anchor: 'onset', bus: 'close', gain: -8, pan: -0.4 });
  E('wakes.nearMissSnarl', C.nearMiss + 0.05, 'snarl', { bus: 'close', gain: -10, pan: -0.3 });
  E('wakes.nearMissClaw', C.nearMiss + 0.02, 'underbody_clang', { gain: -22, rate: 1.6, pan: -0.4 });
  E('wakes.screamerDown', C.screamerDescends, 'zscream', { gain: -16, pos: 'screamerStoop', filter: { type: 'lowpass', freq: 5000 }, send: { street: -8 } });
  for (let i = 0, t = C.screamerDescends + 0.2; t < C.reachStoop; i++, t += 0.4) E('wakes.screamerStep', t, r.pick(['step_conc_1', 'step_conc_2']), { gain: -18, pos: 'screamerStoop', ref: 6 });
  E('wakes.stoopClimb', C.reachStoop, 'fabric_2', { bus: 'close', gain: -20 });

  // ================================================================= ACT 4: FALSE SAFETY (64.0 - 77.9) -- SCARE THREE
  E('refuge.doorPush', C.doorEnter - 0.1, 'door_creak_push', { gain: -17, pos: 'refugeDoor', ref: 1.2 });
  E('refuge.enterCloth', C.doorEnter + 0.1, 'fabric_2', { bus: 'close', gain: -19 });
  {
    const di = normTimes(ext.doorImpactTimes);
    const stop = di && di.find((x) => x.t < C.doorSlam - 0.1 && x.t > C.doorEnter - 0.3);
    if (stop) { E('refuge.doorStop', stop.t, 'wood_knock', { anchor: 'onset', bus: 'int', gain: -14, pan: 0.3, send: { room: -10 } }); }
  }
  E('refuge.slam', C.doorSlam, 'door_slam', { anchor: 'onset', bus: 'int', gain: 1, pan: -0.1, send: { room: -10 } });
  E('refuge.slamThud', C.doorSlam, 'room_thud', { anchor: 'onset', bus: 'int', gain: -4, pan: -0.1 });
  E('refuge.slamWood', C.doorSlam, 'wood_knock_b', { anchor: 'onset', bus: 'int', gain: -7, pan: -0.1 });
  E('refuge.deadbolt', C.deadbolt, 'deadbolt', { anchor: 'onset', bus: 'int', gain: -8, pan: -0.12 });
  E('refuge.doorSlap', C.doorSlap, 'glass_slap_1', { anchor: 'onset', gain: -14, rate: 0.95, pan: -0.15, send: { room: -14 } });
  E('refuge.doorSlapTex', C.doorSlap, 'glass_slap_2', { anchor: 'onset', gain: -20, pan: -0.18 });
  E('refuge.outsideGrowl', C.doorSlap + 0.1, 'zgrowl_2', { gain: -17, pan: -0.15 });
  E('refuge.moans', C.silenceStart + 1.2, 'moans_far', { loop: true, fadeIn: 2.5, end: C.cutToBlack + 0.05, env: [[C.silenceStart + 1.2, -24], [C.relief, -23], [C.creak3 - 1, -27]] });
  E('refuge.lampHum', C.doorSlam, 'buzz', { bus: 'int', loop: true, fadeIn: 0.4, end: C.cutToBlack + 0.05, gain: -32, pan: 0.3 }); // "lamp hum" (ballast buzz), not the fridge
  E('refuge.clock', C.doorSlam + 0.1, 'clock', { bus: 'int', loop: true, fadeIn: 1.5, end: C.cutToBlack + 0.05, gain: -33, pan: -0.4 });
  S('refuge.roomTone', C.doorSlam, 'noise', { color: 'pink', seed: 'roomtone', bus: 'int', gain: -48, filter: { type: 'lowpass', freq: 900 }, end: C.cutToBlack + 0.05, fadeIn: 0.3 });
  [[C.doorSlam + 0.3, 'winded_1', -10], [C.doorSlam + 1.7, 'winded_2', -12], [C.silenceStart + 2.1, 'breath_pant_in', -17],
    [C.silenceStart + 2.45, 'breath_pant_out', -17], [C.checkKitchen + 0.3, 'breath_in_soft', -21], [C.checkStairs + 0.5, 'breath_out_soft', -21],
    [C.relief, 'breath_exhale', -13], [C.relief + 1.1, 'breath_in_soft', -24]].forEach(([t, s, g]) => E('refuge.breath', t, s, { bus: 'close', gain: g }));
  E('refuge.checkCloth', C.checkKitchen - 0.1, 'rustle', { bus: 'close', offset: 0.3, dur: 0.8, gain: -28, fadeIn: 0.1, fadeOut: 0.3 });
  E('refuge.shift1', C.checkKitchen + 0.2, 'floor_creak_1', { bus: 'int', gain: -26, pan: 0.15, rate: 0.92 });
  E('refuge.stairsLook', C.checkStairs, 'rustle', { bus: 'close', offset: 1.0, dur: 0.6, gain: -29, fadeIn: 0.1, fadeOut: 0.3 });
  E('refuge.stairs', C.checkStairs + 0.3, 'stairs_creak', { bus: 'int', gain: -22, pos: 'stairsFoot3609', panScale: 0.7, send: { room: -4 } });
  E('refuge.slideDown', C.slideDown, 'rustle', { bus: 'close', offset: 0.2, dur: 1.4, gain: -18, fadeIn: 0.1, fadeOut: 0.4 });
  E('refuge.slideFloor', C.slideDown + 0.1, 'floor_creak_2', { bus: 'int', gain: -24, rate: 0.9 });
  E('refuge.photoQuiet', C.lookPhoto + 0.4, 'breath_in_soft', { bus: 'close', gain: -26 });
  // misdirection: something slips around the sofa, low, at the edge of frame -- a very faint rustle
  E('refuge.sofaSlip', C.sofaSlip, 'rustle', { gain: -32, offset: 0.4, dur: 0.8, fadeIn: 0.2, fadeOut: 0.4, pan: -0.5 });
  // SCARE THREE: a floorboard creaks beside us, close, floor level, from our RIGHT (+Z); we turn and she is already
  // there on all fours, frozen -- a held reveal (reveal3 to attack3) before she rises into us.
  E('scare3.creak', C.creak3, 'floor_creak_heavy', { bus: 'int', gain: -10, pan: 0.45, send: { room: -8 } });
  E('refuge.turn', C.reveal3, 'rustle', { bus: 'close', offset: 2.0, dur: Math.max(0.15, C.attack3 - C.reveal3 - 0.1), gain: -22, fadeIn: 0.05, fadeOut: 0.2 });
  // the hold itself: near-total silence but for one tiny wet click (she is jawless -- no jaw clack, just a wet throat
  // sound) partway through, cheaper and stranger than a music sting.
  E('scare3.wetClick', C.reveal3 + 0.3, 'jaw_click', { bus: 'close', gain: -27, rate: 0.75 });
  E('scare3.shriek', C.attack3, 'vox3_shriek', { anchor: 'onset', bus: 'close', rate: 0.9, pan: -0.1, send: { room: -10 },
    env: [[C.attack3, -6], [C.contact3 - 0.16, -6], [C.contact3 - 0.05, -13], [C.contact3 + 0.1, -11]] });
  E('scare3.gurgle', C.attack3 + 0.02, 'gurgle_wet', { bus: 'close', gain: -8, pan: -0.08 });
  E('scare3.body', C.attack3, 'vox3_body', { anchor: 'onset', bus: 'close', pan: -0.05, send: { room: -13 },
    env: [[C.attack3, -9], [C.contact3 - 0.16, -9], [C.contact3 - 0.05, -16], [C.contact3 + 0.1, -15]] });
  E('scare3.sub', C.attack3, 'sub_thump', { anchor: 'onset', bus: 'close', gain: -14 });
  E('scare3.gasp', C.attack3 + 0.1, 'breath_gasp', { bus: 'close', gain: -14 });
  E('scare3.rise', C.attack3 + 0.12, 'getup', { bus: 'close', gain: -18, pan: -0.1 });
  E('scare3.contact', C.contact3, 'shove', { anchor: 'onset', bus: 'close', gain: -4 });
  E('scare3.contactThud', C.contact3, 'room_thud', { anchor: 'onset', bus: 'close', gain: -8 });
  E('scare3.contactCloth', C.contact3, 'fabric_3', { bus: 'close', gain: -11 });
  E('scare3.contactSub', C.contact3, 'sub_thump', { anchor: 'onset', bus: 'close', gain: -12, rate: 0.9 });
  E('scare3.scream', C.contact3, 'vox3_scream', { anchor: 'onset', bus: 'close', gain: -7, send: { tail: -9, room: -11 } });
  E('scare3.gurgle2', C.contact3 + 0.03, 'gurgle_wet', { bus: 'close', gain: -6, rate: 1.1 });
  E('scare3.grab', C.contact3 + 0.06, 'grab', { bus: 'close', gain: -10 });

  // ================================================================= HANDOFF (77.9 - 88.0)
  // the hard cut rings a dark tail (automation, below); over black, the animatronic's callback, distant and tiny
  E('handoff.callback', C.cutToBlack + 0.7, 'animatronic_laugh_far', { bus: 'title', gain: -22, filter: { type: 'lowpass', freq: 1500 }, send: { tailTitle: -6 } });
  events.push(...titleEvents(C.titleFadeIn, { gusts: (gusts || []).filter((g) => g.t >= C.titleFadeIn - 0.5) }));

  // ================================================================= footsteps (the camera's own)
  const steps = normTimes(ext.footsteps) || placeholderFootsteps();
  const stepState = { a: {}, c: {}, w: {} };
  for (const st of steps) {
    const surf = String(st.surface || 'asphalt').toLowerCase();
    const inten = Math.max(0.05, st.intensity ?? st.strength ?? 0.5);
    const g = -26 + 14 * Math.log10(inten / 0.5);
    const inside = st.t > C.doorEnter;
    const send = inside ? { room: -14 } : { street: -22 };
    const pan = st.side !== undefined ? (st.side ? 0.06 : -0.06) + (r.next() - 0.5) * 0.04 : (r.next() - 0.5) * 0.12;
    const rate = 0.95 + 0.1 * r.next();
    if (/wood|floor|interior|inside/.test(surf)) {
      E('step.wood', st.t, r.pickNoRepeat(['step_conc_1', 'step_conc_2', 'step_conc_3'], stepState.w),
        { anchor: 'onset', bus: 'close', gain: g - 3, rate: rate * 0.9, pan, filter: { type: 'lowpass', freq: 1600 }, send });
    } else if (/concrete|sidewalk|stoop|step|pavement/.test(surf)) {
      E('step.concrete', st.t, r.pickNoRepeat(['step_conc_1', 'step_conc_2', 'step_conc_3'], stepState.c), { anchor: 'onset', bus: 'close', gain: g, rate, pan, send });
    } else {
      E('step.asphalt', st.t, r.pickNoRepeat(['step_asph_1', 'step_asph_2', 'step_asph_3', 'step_asph_4', 'step_asph_5'], stepState.a),
        { anchor: 'onset', bus: 'close', gain: g, rate, pan, send });
    }
  }

  // ---------------------------------------------------------------- session automation
  const automation = {
    // car A (windows up): partial muffle; carDoorOpen: exterior rushes in
    // under car B: a different, drier/duller partial muffle (claustrophobic, not glass-muffled)
    // gazeLock2 -> lunge2: a brief hush (close bus is handled per-event; ext stays, so rain/drips remain audible)
    // doorSlam: the full refuge muffle, as before
    'extLevel.gain': [
      [0, 0], [C.shotC1 - 0.3, 0], [C.shotC1 + 0.3, -5], [C.windowSmash - 0.02, -5], [C.windowSmash, 0, 'step'],
      [C.fallAsphalt + 0.6, 0], [C.shotU1 - 0.2, 0], [C.shotU1 + 0.4, -9], [C.standUp - 0.2, -9], [C.standUp + 0.3, 0],
      [C.doorSlam - 0.005, 0], [C.doorSlam + 0.05, -13],
    ],
    'extMuffle.frequency': [
      [0, 20000], [C.shotC1 - 0.3, 20000], [C.shotC1 + 0.3, 3200], [C.windowSmash - 0.02, 3200], [C.windowSmash, 20000, 'step'],
      [C.fallAsphalt + 0.6, 20000], [C.shotU1 - 0.2, 20000], [C.shotU1 + 0.4, 2200], [C.standUp - 0.2, 2200], [C.standUp + 0.3, 20000],
      [C.doorSlam - 0.005, 20000], [C.doorSlam + 0.045, 420, 'exp'],
    ],
    // Act 2's hush: the creature's own close-bus sounds are already time-bounded to end at gazeLock2 above, so no
    // extra automation is needed there; this just softens the player's own breath for the same beat.
    'close.gain': [[0, 0], [C.gazeLock2 - 0.1, 0], [C.gazeLock2 + 0.05, -10], [C.lunge2 - 0.01, -10], [C.lunge2, 0, 'step']],
    // hard cut to black: everything but the long tail reverb (and the title bus) stops dead
    'cut.gain': [[0, 0], [C.cutToBlack, 0], [C.cutToBlack + 0.006, -120]],
    'tailSend.gain': [[0, 0], [C.cutToBlack, 0], [C.cutToBlack + 0.006, -120]],
  };
  return { events: events.filter(Boolean), automation };
}

// The title-state bed: the game's own title music + the street + flies, with the title loop's distant stingers.
// Loops indefinitely (stingers are generated an hour ahead).
export function titleEvents(t0, { fadeIn = 3.0, gusts = [] } = {}) {
  const ev = [];
  const E = (tag, t, snd, o = {}) => ev.push({ tag, t, snd, bus: 'title', ...o });
  E('title.music', t0, 'mus_title', { loop: true, offset: 0, gain: -16.5, fadeIn });
  E('title.wind', t0, 'bed_wind', { loop: true, gain: -30.5, fadeIn: fadeIn + 1 });
  E('title.night', t0 + 0.5, 'bed_night', { loop: true, gain: -34.5, fadeIn: fadeIn + 1 });
  E('title.flies', t0 + 1.5, 'flies', { loop: true, gain: -38.5, pan: -0.35, fadeIn: 3 });
  gusts.forEach((g, i) => E('title.gust', g.t - 0.1, i % 2 ? 'gust_2' : 'gust_1', { gain: -22 + 12 * Math.log10(g.strength ?? 0.6) }));
  const r = makeRng('title-stingers');
  const cycle = [
    (t) => E('title.farScream', t, 'ttl_scream_1', { gain: -27, pan: 0.4, send: { tailTitle: -14 } }),
    (t) => E('title.carAlarm', t, 'car_alarm_far', { loop: true, dur: 9 + 3 * r.next(), fadeIn: 0.05, fadeOut: 2.5, gain: -37, pan: -0.6, filter: { type: 'lowpass', freq: 2600 } }),
    (t) => E('title.gust', t, 'gust_2', { gain: -25 }),
    (t) => E('title.farScream', t, 'ttl_scream_2', { gain: -28, pan: -0.3, send: { tailTitle: -14 } }),
    (t) => E('title.dog', t, 'dog_far', { gain: -30, pan: 0.6, filter: { type: 'lowpass', freq: 2800 } }),
    (t) => E('title.farScream', t, 'ttl_scream_3', { gain: -28, pan: 0.15, send: { tailTitle: -14 } }),
    (t) => E('title.horde', t, 'far_horde_2', { gain: -33, pan: -0.5, filter: { type: 'lowpass', freq: 1800 } }),
  ];
  let t = t0 + 6.5;
  for (let k = 0; t < t0 + 3600; k++) {
    cycle[k % cycle.length](t);
    t += 34 + 18 * r.next();
  }
  return ev;
}

export const SCORE_INFO = { duration: FILM.duration };
