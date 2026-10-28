// A reduced-order wet membrane: inextensible but bendable rays, compliant tissue, anchored
// insertions, velocity-dependent water drag, a little weight and the lag of the water the fin
// carries. Not a CFD/biological calibration: fitted by eye to footage of male halfmoons.
import { draw, kickSweep } from './swim-gait.js';
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const water = { strength: 0, direction: 'changing' };

// World-space current. All fins and suspended particles sample the same field.
// Direction changes ease in at the caller; eddies vary in space, not per frame.
export function waterVelocity(t, x, y, z, strength, direction, out) {
  let a = 0, b = 0, c = 0;
  switch (direction) {
    case 'right': a = 1; break;
    case 'left': a = -1; break;
    case 'front': c = 1; break;
    case 'back': c = -1; break;
    case 'up': b = 1; break;
    case 'down': b = -1; break;
    default:
      a = Math.cos(t * 0.19);
      c = Math.sin(t * 0.19);
      b = 0.32 * Math.sin(t * 0.31 + 0.8);
  }
  const speed = strength * (0.82 + 0.18 * Math.sin(t * 0.73));
  out[0] = speed * (a + 0.16 * Math.sin(y * 1.4 + z * 0.7 - t * 1.1));
  out[1] = speed * (b + 0.12 * Math.sin(z * 1.2 + x * 0.8 + t * 0.83));
  out[2] = speed * (c + 0.17 * Math.sin(x * 1.6 - y * 0.6 - t * 0.91));
  return out;
}

/** How finely the fins are solved: the step (s), the share of the constraint passes, and the most
 *  of a frame that is caught up on (s). A host on a slow device may lighten it (Globes on phones). */
export const FIN_QUALITY = { step: 1 / 120, passScale: 1, maxFrame: 0.07 };

/** Clamped (state.clamp, 0..1: an unwell fish holding its fins folded in), how much of each broad
 *  fin's spread closes up at the most (caudal, dorsal, anal), how far the caudal droops (rad), and
 *  how far the ventrals tuck back (rad) and in towards each other (a share). */
const CLAMP_FOLD = [0.62, 0.68, 0.62], CLAMP_DROOP = 0.12, CLAMP_TUCK = 1.05, CLAMP_PINCH = 0.6;

/** The broad fins' spread (caudal, dorsal, anal), as a share of their photographed, displayed fan (the
 *  full D is display's, state.flare: Pexels 37685390's fish, gill covers out). A calm male carries them
 *  relaxed (fitted to the relaxed clips: Pexels 12659950, 4107166, 6590365, 19036689; the caudal some
 *  90-105 deg tip to tip at hover, drooping 25-35 deg, and some 55-70 deg trailing under way): stopped
 *  (the caudal well short of a D, the dorsal partly down: raised when alert, DORSAL_ALERT, the anal a
 *  soft curtain) and under way (the caudal a closed trailing fan, the dorsal laid back); how fast each
 *  opens again (1/s: the caudal last, after a turn or a stop), and how fast they all close as the water
 *  sweeps them back; a stop spreads them a little (STOP_SPREAD more, braking hard). The caudal's lower
 *  lobe hangs LOWER_LOBE (rad) below its upper one at rest, and the whole fan droops by DROOP (rad)
 *  stopped, less under way (the water carries it straight back), none in display. */
const OPEN_STOPPED = [0.62, 0.5, 0.72], OPEN_UNDER_WAY = [0.32, 0.36, 0.58], OPENING = [0.9, 1.6, 1.3], CLOSING = 2.8, LOWER_LOBE = 0.16;
const STOP_SPREAD = 0.12, DROOP = [0.38, 0.1];
/** Each fin's weight in water (its sag: Atelier units/s^2 down, pectorals none; the caudal light,
 *  its lower lobe's hang held in its shape, LOWER_LOBE, so that it never swings down as a flap; the
 *  dorsal's little, held up by its rays rather than flopping over; the ventrals' little, held as
 *  they are by their own muscles rather than hanging plumb) and
 *  the share of the body's acceleration it and the water it carries resist (so it lags a start and
 *  swings on in a stop: the ventrals far less, held by the fish rather than hung from it, so that they
 *  never swing on like weighted strings). */
const WEIGHT = [0.8, 0.4, 1.1, 0, 0.12], INERTIA = [0.35, 0.35, 0.35, 0.35, 0.12];
/** A broad fin is never a flat sheet: partly closed, its membrane gathers into pleats between the
 *  rays (PLEAT: their lean at the margin, rad, per share of the fan closed; FOLDS: half-waves across
 *  the fan), and the caudal's two lobes lean a little apart, a slow wander and the turn's lag
 *  twisting them (TWIST, rad), so that seen edge-on it reads as a gathered, curving curtain. (The
 *  caudal's pleats are the shallower: carried partly closed, they would stiffen it against the water.) */
const PLEAT = [0.13, 0.12, 0.2], FOLDS = [7, 6, 9], TWIST = 0.3;
/** The dorsal's spread when the fish rests (laid down) and when it is alert (raised: turning, or
 *  lifted now and then as it looks about, for DORSAL_LIFT s), and how fast it rises and lowers (1/s). */
const DORSAL_REST = 0.3, DORSAL_ALERT = 0.78, DORSAL_LIFT = [0.6, 1.6], DORSAL_RISE = 3.5, DORSAL_FALL = 1.1;
/** The fish's own push and brake as the fins feel them (state.accel along the body, Atelier units/s^2:
 *  forwards, and backwards): a dart folds the long fins and draws the pectorals in, a stop spreads them
 *  and flares the pectorals forward. */
const PUSH = [1.2, 3.2], BRAKE = [0.3, 1.6];
/** At hover the caudal's spread wanders by up to SAG (a share of the fan: it sags partly shut and
 *  spreads again, now and then, on no beat). */
const SAG = 0.07;
/** A pectoral's own stroke: how far the left's beat slips against the right's (rad, either way), how far
 *  it lies back against the flank when resting (rad), and how far it swings forward and out to brake. */
const SLIP = 1.8, LIE = 0.4, FLARE_FORWARD = 0.45;
/** A beat the host's gait asks of the pectorals (state.push rising: a push off, a trim, the stroke that
 *  brings it round at hover) is one stroke plain to see: the fin reaches forward and out, sweeps hard
 *  back along the flank and comes round again (STROKE_TIME s; STROKE_REACH rad at the most either way),
 *  the outer fin of the turn it comes with the most (the inner one STROKE_INNER of that), over the
 *  gait's own beat. */
const STROKE_TIME = 0.45, STROKE_REACH = 0.6, STROKE_INNER = 0.35;
/** A kick of the tail (state.kick, kickAt, kickSweeps: the gait's sweep, or whole beat) swings the caudal fan out further
 *  than the peduncle goes (KICK_FAN rad at the most), driven through the water by the muscles at the
 *  rays' bases (KICK_HOLD: the share of the way to its target the inner fan is pulled each of the
 *  first constraint passes, at the kick's height), its margin trailing like a sail's leech. */
const KICK_FAN = 0.26, KICK_HOLD = 0.25;
/** The ventral streamers are held by their own muscles in the fish's frame, not hung from it: at hover
 *  swung forward of their photographed rake by PELVIC_HOLD (rad: down and a little back from the
 *  belly, whatever way the fish is tipped), splayed apart (PELVIC_SPLAY, sideways at the tip per unit
 *  of length, wandering by PELVIC_SPLAY_WANDER each fin on its own), trailing back under way. */
const PELVIC_HOLD = 0.26, PELVIC_SPLAY = 0.2, PELVIC_SPLAY_WANDER = 0.1;
/** At hover the pectorals fan all but without pause (Pexels 4107166, 37685390: some 1.5-3.3 Hz, alternating
 *  or together): through the gait's rests the fins keep a beat of their own (FAN_HZ, quicker the harder
 *  the fish works to hold its station), the gait's own beats come a little quicker there (FAN_QUICK),
 *  and they sweep wider (FAN_SWEEP more, at the hardest work). */
const FAN_HZ = 2.2, FAN_QUICK = 1.15, FAN_SWEEP = 0.2;
/** Nor do they stop when it rests on the wood (Pexels 7209739: a whitish flicker behind the gill even
 *  then): resting they fan on more slowly, in a time of their own (REST_HZ), the gait's rests only a
 *  weaker beat there (REST_POWER of a full one), and as wide as at hover (REST_SWEEP more). */
const REST_HZ = 1.35, REST_POWER = 0.8, REST_SWEEP = 0.22;
/** Each ray tip of a broad fin flutters on its own, small and quick, out of step with its neighbours, on
 *  top of the slow billow (TIP_FLUTTER: out of the membrane at the tip, Atelier units; a share of it in
 *  the fan's plane), in fits: each tip's flutter swells and dies on its own. */
const TIP_FLUTTER = 0.075;
/** Nor is a halfmoon's margin one smooth curve (Pexels 12659950): its ray tips stand out at different
 *  lengths (RAGGED: Atelier units at the most either way along the ray, caudal, dorsal, anal: each tip its
 *  own, redrawn now and then and eased to), and the billow runs along it unevenly, higher in some
 *  stretches than in others (UNEVEN: a share of the billow either way) and quicker in some (UNEVEN_PACE:
 *  rad of the wave's phase bunched or spread across the fan), the stretches drifting along it. */
const RAGGED = [0.045, 0.035, 0.04], UNEVEN = 0.5, UNEVEN_PACE = 1.1;
/** The C the body bends into to turn (state.curl, -1..1, + towards the fish's left: the body's word for
 *  it, or the fins' own from the turn's rate, a full C at CURL_RATE rad/s or so): the caudal is dragged
 *  round behind the peduncle (CURL_DRAG rad at the margin per unit of the C's change a second), its lobes
 *  twisting apart into a ribbon (CURL_TWIST), and it closes up (CURL_CLOSE more of the fan: caudal,
 *  dorsal, anal) to fan back out slowly once the tail straightens out of the C; the dorsal and the anal
 *  trail the same way at their rear; the pelvics are swung out and forward to steer (CURL_PELVIC rad). */
/** No fin ever breaks the surface or passes into a furnishing: every node is held SURFACE_CLEAR (Atelier
 *  units) under the water's surface (state.surfaceY: its height in the fish's own frame, along the
 *  fish's up, -state.down; none: no surface), the fin flattening along under the film as it would, and
 *  out of the host's solids (state.solids), lying on them; what is drawn over the solved shape (the
 *  margins' shimmer and ragged tips) is held to the same. */
const SURFACE_CLEAR = 0.02;
const CURL_RATE = 1.6, CURL_DRAG = 0.1, CURL_TWIST = 0.5, CURL_CLOSE = [0.16, 0, 0.08], CURL_PELVIC = 0.22;
/** The anal fin ripples in a wave running back along its length (and the dorsal's rear a little):
 *  UNDULATE rad at the margin (caudal, dorsal, anal), at about UNDULATE_HZ, harder as the fish works. */
const UNDULATE = [0, 0.08, 0.18], UNDULATE_HZ = 1.4;

export class FinDynamics {
  constructor({ point, kind, side, columns = 29, rows = 17 }) {
    Object.assign(this, { kind, side, columns, rows });
    this.count = columns * rows;
    this.rest = new Float32Array(this.count * 3);
    this.roots = new Float32Array(columns * 3);
    this.position = new Float32Array(this.count * 3);
    this.previous = new Float32Array(this.count * 3);
    this.target = new Float32Array(this.count * 3);
    this.lastTarget = new Float32Array(this.count * 3);
    this.frameTarget = new Float32Array(this.count * 3);
    this.displayTarget = new Float32Array(this.count * 3);
    this.previousFlare = null;
    this.weights = new Float32Array(this.count);
    this.displacement = new Float32Array(this.count * 4);
    this.accumulator = 0;
    this.initialized = false;
    this.steps = 0;
    this.flow = [0, 0, 0];
    this.scratch = [0, 0, 0];
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i;
      const p = point(i / (columns - 1), j / (rows - 1));
      this.rest.set(p, n * 3);
      if (j === 0) this.roots.set(p, i * 3);
      this.weights[n] = j === 0 ? 0 : 0.25 + 0.75 * j / (rows - 1);
    }
    const links = [], folding = [];
    const add = (a, b, stiffness, folds = false) => {
      const length = Math.hypot(...[0, 1, 2].map(k => this.rest[a * 3 + k] - this.rest[b * 3 + k]));
      if (length > 0.00001) { links.push(a, b, length, stiffness); folding.push(folds ? 1 : 0); }
    };
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i;
      if (j) add(n - columns, n, 0.96); // non-stretching fin rays
      if (i) add(n - 1, n, kind < 3 ? 0.45 : 0.65, true); // membrane between rays
      if (j && i) {
        add(n - columns - 1, n, kind < 3 ? 0.15 : 0.22, true);
        add(n - columns, n - 1, kind < 3 ? 0.15 : 0.22, true);
      }
      // Ray bending, not ray stretching (a broad fin's rays curve, never kink; the caudal's the stiffest,
      // the dorsal's and the anal's supple enough to ripple).
      if (j > 1) add(n - columns * 2, n, kind === 0 ? 0.4 : kind < 3 ? 0.2 : 0.12);
    }
    this.links = new Float32Array(links);
    this.folding = new Uint8Array(folding);
    this.linkLengths = new Float32Array(folding.length);
    // What the solver reads every substep that never changes, worked out once: each link's ends (as
    // offsets into the position arrays) and [stiffness, both ends' weight, end a's, end b's]; the
    // chords that fold with the fan (the broad fins'), every other link keeping its rest length; each
    // ray segment's rest length; each node's offset from its root, and for the broad fins its angle
    // and in-plane length there.
    const m = folding.length;
    this.linkEnds = new Int32Array(m * 2);
    this.linkTerms = new Float64Array(m * 4);
    const refolding = [];
    for (let l = 0; l < m; l++) {
      const a = links[l * 4], b = links[l * 4 + 1];
      this.linkEnds[l * 2] = a * 3; this.linkEnds[l * 2 + 1] = b * 3;
      this.linkTerms.set([this.links[l * 4 + 3], this.weights[a] + this.weights[b], this.weights[a], this.weights[b]], l * 4);
      if (kind < 3 && folding[l]) refolding.push(l);
      else this.linkLengths[l] = this.links[l * 4 + 2];
    }
    this.refolding = Int32Array.from(refolding);
    this.rayRest = new Float64Array(this.count);
    this.restOffset = new Float64Array(this.count * 3);
    this.restAngle = new Float64Array(this.count);
    this.restSpan = new Float64Array(this.count);
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i, q = n * 3, a = q - columns * 3, r = i * 3;
      if (j) this.rayRest[n] = Math.hypot(this.rest[q] - this.rest[a], this.rest[q + 1] - this.rest[a + 1], this.rest[q + 2] - this.rest[a + 2]);
      const x = this.rest[q] - this.roots[r], y = this.rest[q + 1] - this.roots[r + 1], z = this.rest[q + 2] - this.roots[r + 2];
      this.restOffset[q] = x; this.restOffset[q + 1] = y; this.restOffset[q + 2] = z;
      this.restAngle[n] = Math.atan2(y, x); this.restSpan[n] = Math.hypot(x, y);
    }
    // Scratch: each row's stiffness and target terms, each column's root frame.
    this.rowStiffness = new Float64Array(rows);
    this.rowTerms = new Float64Array(rows * 4);
    this.rootFrames = new Float64Array(columns * 4);
    // Each node's rest point carried by the body in the last displacement (advance), and the body
    // and its revision it was carried by: a host drawing vertices that sit on the nodes reuses it.
    this.carried = new Float64Array(this.count * 3);
    this.carriedBy = null;
    this.carriedAt = -1;
    // How far each caudal ray lies below the fan's axis (0..1, the lower lobe's droop).
    this.lowerLobe = new Float64Array(this.count);
    if (kind === 0) for (let n = 0; n < this.count; n++) this.lowerLobe[n] = Math.max(0, -Math.sin(this.restAngle[n]));
    // The broad fins' spread now (OPEN_STOPPED...), the margins' flutter (its phase, rad), and the
    // ventrals' own will: a quick flick forward now and then (flick, flickRate, next at flickAt s),
    // a splay when braking, and a slow wander between, each fin on its own.
    this.open = OPEN_STOPPED[kind] ?? 1;
    this.flutterPhase = 0;
    this.seed = 0x5eed + kind * 977 + (side + 1) * 131;
    this.clock = 0;
    this.flick = this.flickRate = this.splay = 0;
    this.flickAt = 0.4 + 2 * draw(this);
    this.wander = this.wanderTo = 0;
    this.wanderAt = 0;
    // (The ventral's tip follows its root a little late, so a flick bends the streamer along its
    // length: flickTip, splayTip, wanderTip; ripple: a slow wave running down it, rad.)
    this.flickTip = this.splayTip = this.wanderTip = this.ripple = 0;
    // Each ray tip of a broad fin trembles on its own (tipPhase, rad, at tipRate Hz), the caudal's
    // lobes twist (twist, rad, easing to twistTo) and the dorsal is raised now and then (liftAt,
    // liftUntil s; turnLag: the turn, felt late).
    this.tipPhase = new Float64Array(columns);
    this.tipRate = new Float64Array(columns);
    for (let i = 0; i < columns; i++) { this.tipPhase[i] = 2 * Math.PI * draw(this); this.tipRate[i] = 3 + 4 * draw(this); }
    this.twist = this.twistTo = this.turnLag = 0;
    this.twistAt = 0;
    this.liftAt = 2 + 4 * draw(this);
    this.liftUntil = 0;
    // The broad fins' billow is the water's, not a clock's: two slow waves (billow, swell: phases,
    // rad), each at a pace that wanders (pace, easing to paceTo: a share of the gait's billow), in
    // gusts (gust, easing to gustTo, redrawn at gustAt s) and stirred by the body's own moves (stir);
    // lastBillow, lastTurn: the gait's billow and the turn last frame. The caudal's spread sags a
    // little now and then at hover (sag, easing to sagTo, redrawn at sagAt s).
    this.billow = 2 * Math.PI * draw(this); this.swell = 2 * Math.PI * draw(this);
    this.pace = this.paceTo = 1; this.gust = this.gustTo = 0.7; this.gustAt = 0; this.stir = 0;
    this.lastBillow = this.lastTurn = null;
    this.sag = this.sagTo = 0; this.sagAt = 0;
    // No two of the tail's beats carry the long fins alike: each beat's sway (a share, easing to
    // swayTo; stroke: the beat's count).
    this.sway = this.swayTo = 1; this.stroke = 0;
    // The fish's push and brake as this fin feels them (0..1, eased).
    this.push = this.brake = 0;
    // A pectoral beats in its own time: its stroke slips against the other's (slip, easing to slipTo,
    // redrawn at slipAt s), each beat a little stronger or weaker (own, easing to ownTo; beat: the
    // count), and now and then it rests alone for a moment (alone: s left; resting: how far into
    // that rest, 0..1).
    this.slip = this.slipTo = 0; this.slipAt = 0; this.own = this.ownTo = 1; this.beat = 0; this.alone = this.resting = 0;
    // (The gait's push as last felt, and the stroke it set going: how far through, 0..1, 1 done; its
    // size; how much this fin is the outer one of the turn, 0..1. The caudal: how hard a kick drives
    // its rays now, 0..1.)
    this.lastPush = 0; this.strokeAt = 1; this.strokeSize = 0; this.outer = 0.5; this.kickHold = 0;
    // (The ventral's flicks and twitches send a wave down it, dying away: wave, its size; its splay
    // wanders too, splayWander, easing to splayTo.)
    this.wave = 0;
    this.splayWander = this.splayTo = 0;
    // (The pectorals' own beat: fan, its phase, rad, carried on from the gait's (lastGait); fanPower,
    // 0..1+, the gait's power or, at hover, its own; still: how much the fish holds station on them.
    // work: how hard the fish works to hold or shift its station, 0..1, eased. The broad fins' own
    // undulation, its phase, rad; each ray tip's flutter: its phase, rate (Hz) and swell, easing to
    // jitTo, redrawn at jitAt s.)
    this.fan = 0; this.lastGait = null; this.fanPower = 1; this.still = 0; this.work = 0; this.undulate = 0;
    // (Resting on something, idle: 0..1, eased, for the pectorals' own beat there.)
    this.idle = 0;
    // (A ventral's trail: how far back the pace has swept it, 0..1, eased.)
    this.trail = 0;
    // (The body's C as this fin feels it, -1..1, and its rate of change, 1/s.)
    this.curl = this.curlRate = 0;
    this.jitPhase = new Float64Array(columns); this.jitRate = new Float64Array(columns);
    this.jitAmp = new Float64Array(columns); this.jitTo = new Float64Array(columns); this.jitAt = new Float64Array(columns);
    if (kind < 3) for (let i = 0; i < columns; i++) { this.jitPhase[i] = 2 * Math.PI * draw(this); this.jitRate[i] = 6 + 6 * draw(this); }
    // (Each ray tip's own length past the margin's curve, Atelier units, easing to ragTo, redrawn at ragAt
    // s; the uneven stretches' phases, rad, drifting; each column's share of the billow and of the margin's
    // shimmer now, worked out with the targets. Drawn from a stream of their own, ragged, so that the
    // fin's other wanderings come as they did.)
    this.ragged = { seed: 0x7a66ed + kind * 389 + (side + 1) * 71 };
    this.rag = new Float64Array(columns); this.ragTo = new Float64Array(columns); this.ragAt = new Float64Array(columns);
    this.lumps = [0, 0, 0].map(() => 2 * Math.PI * draw(this.ragged));
    this.lumpy = new Float64Array(columns).fill(1);
    if (kind < 3) for (let i = 0; i < columns; i++) { this.ragTo[i] = this.rag[i] = RAGGED[kind] * (2 * draw(this.ragged) - 1); this.ragAt[i] = 1 + 5 * draw(this.ragged); }
    // How far the fin reaches from its insertions' middle (with a margin for its bending), and the
    // host's solids within that reach this frame (each: start, start to end, 1 / its length squared,
    // radius), that it lies on.
    let reach = 0;
    const mid = [0, 1, 2].map((k) => this.roots.reduce((sum, x, i) => sum + (i % 3 === k ? x : 0), 0) / columns);
    for (let n = 0; n < this.count; n++) reach = Math.max(reach, Math.hypot(this.rest[n * 3] - mid[0], this.rest[n * 3 + 1] - mid[1], this.rest[n * 3 + 2] - mid[2]));
    this.reach = reach * 1.15 + 0.1;
    this.touching = new Float64Array(8 * 32);
    this.touchCount = 0;
  }

  /** What the fish's motion asks of the fins this frame (dt > 0): the broad fins close as the
   *  water sweeps them back and open again once the fish stops (the caudal last) and billow in
   *  gusts; the pectorals keep their own time; the ventrals flick, splay and twitch. state.speed:
   *  the water past the fish (body lengths/s); state.accel:
   *  the fish's acceleration in its own frame (Atelier units/s^2, +x towards the tail). */
  advancePosture(dt, state) {
    const { kind } = this, speed = state.speed ?? 0, under = smooth(0.08, 0.6, speed), r = () => draw(this);
    const along = state.accel ? state.accel[0] : 0, turn = state.turn ?? 0;
    // (A host's gait may say so outright: state.dart, state.brake, 0..1.)
    this.push += (Math.max(smooth(PUSH[0], PUSH[1], -along), state.dart ?? 0) - this.push) * (1 - Math.exp(-9 * dt));
    this.brake += (Math.max(smooth(BRAKE[0], BRAKE[1], along), state.brake ?? 0) - this.brake) * (1 - Math.exp(-6 * dt));
    // The body's own small moves (a trim, a push, the turn changing) stir the long fins up a little.
    const turned = this.lastTurn === null ? 0 : Math.abs(turn - this.lastTurn) / dt;
    this.lastTurn = turn;
    const moved = clamp(0.35 * turned + 0.25 * Math.hypot(...(state.accel ?? [0, 0, 0])), 0, 1.2);
    this.stir += (moved - this.stir) * (1 - Math.exp(-(moved > this.stir ? 6 : 1.2) * dt));
    // How hard the fish works to hold or shift its station: the body's word for it (state.hold), or the
    // fins' own reckoning (a push, a brake, creeping along, turning, the body's moves).
    const hold = state.hold ?? clamp(0.25 + 0.6 * (state.push ?? 0) + 0.5 * this.brake + 0.4 * smooth(0.02, 0.3, speed) + 0.25 * Math.min(1, Math.abs(turn)) + 0.15 * this.stir, 0, 1);
    this.work += (hold - this.work) * (1 - Math.exp(-4 * dt));
    // The C the body is bending into (eased a little: the fins feel it through the water), and how fast
    // it is changing (1/s: + bending further towards the left, or straightening out of a right-hand C).
    const curl = clamp(state.curl ?? Math.tanh(turn / CURL_RATE), -1, 1), lastCurl = this.curl;
    this.curl += (curl - this.curl) * (1 - Math.exp(-12 * dt));
    this.curlRate += ((this.curl - lastCurl) / dt - this.curlRate) * (1 - Math.exp(-10 * dt));
    if (kind < 3) {
      // (The caudal and the anal fold even in a slow turn at hover; the dorsal rises in a quick one.)
      const turning = kind === 1 ? smooth(0.4, 1.6, Math.abs(turn)) : smooth(0.25, 1.3, Math.abs(turn));
      this.clock += dt;
      // A dart folds the long fins as quickly as the water sweeps them back; a stop spreads them sooner.
      let want = OPEN_STOPPED[kind] + (OPEN_UNDER_WAY[kind] - OPEN_STOPPED[kind]) * Math.max(under, 0.8 * turning, this.push) - CURL_CLOSE[kind] * Math.abs(this.curl)
        + STOP_SPREAD * this.brake, rate;
      // The billow's own pace and gusts: the gait's billow (the pectorals' wash, the travel) sets
      // its mean pace, but no two seconds alike.
      const gaitBillow = state.billowPhase ?? 0, flowed = this.lastBillow === null ? 0 : clamp(gaitBillow - this.lastBillow, 0, 1);
      this.lastBillow = gaitBillow;
      if (this.clock >= this.gustAt) {
        this.gustTo = 0.2 + 1.3 * r() * r(); this.paceTo = 0.55 + 0.9 * r();
        this.gustAt = this.clock + 0.4 + 1.6 * r();
      }
      this.gust += (this.gustTo - this.gust) * (1 - Math.exp(-2.2 * dt));
      this.pace += (this.paceTo - this.pace) * (1 - Math.exp(-1.4 * dt));
      const stroke = Math.floor((state.phase ?? 0) / (2 * Math.PI));
      if (stroke !== this.stroke) { this.stroke = stroke; this.swayTo = 0.5 + 0.85 * r(); }
      this.sway += (this.swayTo - this.sway) * (1 - Math.exp(-5 * dt));
      this.billow += flowed * this.pace;
      this.swell += flowed * (1.75 - this.pace) * 0.6;
      if (kind === 1) {
        // The dorsal goes up when the fish is alert (turning, or now and then as it looks about at
        // hover) and down when it rests, quick to rise and slow to fall.
        if (this.clock >= this.liftAt) {
          this.liftUntil = this.clock + DORSAL_LIFT[0] + (DORSAL_LIFT[1] - DORSAL_LIFT[0]) * r();
          this.liftAt = this.liftUntil + 4 + 10 * r();
        }
        const resting = state.mode === 'rest' ? 1 : 0, lifted = this.clock < this.liftUntil ? 1 - under : 0;
        want += (DORSAL_REST - want) * resting;
        want += (DORSAL_ALERT - want) * Math.max(turning, lifted) * (1 - resting);
        // (Lowered a little as the body moves: a push, a trim, a turn.)
        want -= 0.1 * Math.max(this.push, clamp(this.stir, 0, 1)) * (1 - resting);
        rate = want > this.open ? DORSAL_RISE : DORSAL_FALL;
      } else {
        if (kind === 0 && state.mode === 'hover') {
          // At hover the fan sags partly shut and spreads again now and then, on no beat.
          if (this.clock >= this.sagAt) { this.sagTo = -SAG * r() * r() * 1.4 + 0.3 * SAG * r(); this.sagAt = this.clock + 1.2 + 4 * r(); }
          this.sag += (this.sagTo - this.sag) * (1 - Math.exp(-0.9 * dt));
          want += this.sag * (1 - under) * (1 - turning);
        }
        rate = want < this.open ? CLOSING * (1 + this.push) : OPENING[kind] * (1 + 1.5 * this.brake);
      }
      this.open += (want - this.open) * (1 - Math.exp(-rate * dt));
      // The margins flutter faster and wider the faster the water goes past; each ray tip at its own rate.
      const quick = 1 + 0.6 * Math.min(1, speed);
      this.flutterPhase += dt * Math.PI * 2 * (4.5 + 3.5 * Math.min(1, speed));
      for (let i = 0; i < this.columns; i++) {
        this.tipPhase[i] += dt * Math.PI * 2 * this.tipRate[i] * quick;
        this.jitPhase[i] += dt * Math.PI * 2 * this.jitRate[i] * quick;
        if (this.clock >= this.jitAt[i]) { const a = r(); this.jitTo[i] = 0.15 + 1.6 * a * a; this.jitAt[i] = this.clock + 0.2 + 0.8 * r(); }
        if (this.clock >= this.ragAt[i]) { this.ragTo[i] = RAGGED[kind] * (2 * draw(this.ragged) - 1); this.ragAt[i] = this.clock + 2 + 5 * draw(this.ragged); }
        this.rag[i] += (this.ragTo[i] - this.rag[i]) * (1 - Math.exp(-0.7 * dt));
        this.jitAmp[i] += (this.jitTo[i] - this.jitAmp[i]) * (1 - Math.exp(-8 * dt));
      }
      this.undulate += dt * Math.PI * 2 * UNDULATE_HZ * (0.8 + 0.4 * this.work);
      // (The uneven stretches drift along the margin with the billow, each at its own pace.)
      const drift = 0.15 * flowed * this.pace;
      this.lumps[0] += 0.43 * drift; this.lumps[1] -= 0.71 * drift; this.lumps[2] += 0.29 * drift;
      if (kind === 0) {
        // The lobes' slow twist wanders, and a turn twists them late.
        if (this.clock >= this.twistAt) { this.twistTo = r() * 2 - 1; this.twistAt = this.clock + 1 + 2.5 * r(); }
        this.twist += (this.twistTo - this.twist) * (1 - Math.exp(-1.2 * dt));
        this.turnLag += (clamp(turn, -1.5, 1.5) - this.turnLag) * (1 - Math.exp(-2.5 * dt));
        this.kickHold = state.kick && (state.kickAt ?? 1) < 1 ? Math.min(1, Math.abs(state.kick)) * Math.abs(Math.sin(Math.PI * state.kickAt * (state.kickSweeps ?? 1))) : 0;
      }
    } else if (kind === 3) {
      this.clock += dt;
      // Each pectoral beats in its own time: the left's stroke slips in and out of step with the
      // right's (which keeps the gait's time), and holding station each beat is a little stronger or
      // weaker than the last, and now and then one fin rests alone, lying back against the flank,
      // while the other beats on (only within the gait's runs of beats, pectoralPower: a fin driven
      // without them beats on).
      if (this.clock >= this.slipAt) { this.slipTo = this.side < 0 ? SLIP * (r() * 2 - 1) : 0; this.slipAt = this.clock + 0.6 + 2.2 * r(); }
      this.slip += (this.slipTo - this.slip) * (1 - Math.exp(-1.6 * dt));
      // Holding station (still) the fins beat on through the gait's rests, in a beat of their own, the
      // two in the same time (so the slip alone sets how they go together); a lone rest is brief.
      // (Over a second or so: a change of mode shifts the beat, not the fin's size, at a stroke.)
      this.still += (smooth(0.5, 0.9, state.pectoralScull ?? state.scull ?? 0) * (1 - under) - this.still) * (1 - Math.exp(-1.2 * dt));
      const still = this.still;
      // Resting (the host's mode) the fins fan on slowly in a time of their own (over a second or so, like still).
      this.idle += ((state.mode === 'rest' ? 1 - under : 0) * (1 - still) - this.idle) * (1 - Math.exp(-1.2 * dt));
      const idle = this.idle;
      const gait = state.pectoralPhase ?? 0, gaitStep = this.lastGait === null ? 0 : clamp(gait - this.lastGait, 0, 3);
      if (this.lastGait === null) this.fan = gait;
      this.lastGait = gait;
      const own = dt * 2 * Math.PI * FAN_HZ * (1 + 0.35 * this.work), resting = dt * 2 * Math.PI * REST_HZ * (1 + 0.3 * this.work);
      this.fan += gaitStep + still * Math.max(0, Math.max(gaitStep * FAN_QUICK, own) - gaitStep) + idle * (resting - gaitStep);
      // (Off station, it falls back into the gait's time within a second or two, never beating backwards.)
      const off = this.fan - gait, behind = off - 2 * Math.PI * Math.round(off / (2 * Math.PI));
      this.fan -= clamp(behind * (1 - Math.max(still, idle)) * (1 - Math.exp(-1.5 * dt)), -0.5 * gaitStep, 0.5 * gaitStep);
      this.fanPower += (Math.max(state.pectoralPower ?? 1, still, REST_POWER * idle) - this.fanPower) * (1 - Math.exp(-7 * dt));
      const beat = Math.floor((this.fan + this.slip) / (2 * Math.PI) + (this.side < 0 ? 0.5 : 0));
      if (beat !== this.beat) {
        this.beat = beat;
        this.ownTo = 1 + still * (0.42 * r() - 0.28);
        if (this.alone <= 0 && state.pectoralPower !== undefined && r() < 0.09 * still) this.alone = (0.35 + 0.75 * r()) * (1 - 0.7 * still);
      }
      this.own += (this.ownTo - this.own) * (1 - Math.exp(-10 * dt));
      // A new push sets a stroke going; the outer fin of the turn (body.steer: + towards side +1) is
      // known within a tenth of a second or so, as the head starts round.
      const push = state.push ?? 0, steer = state.body?.steer ?? turn;
      if (push > this.lastPush + 0.05) { this.strokeAt = 0; this.strokeSize = Math.min(1, push); }
      this.lastPush = push;
      this.strokeAt = Math.min(1, this.strokeAt + dt / STROKE_TIME);
      this.outer += (0.5 - 0.5 * Math.tanh(5 * this.side * steer) - this.outer) * (1 - Math.exp(-14 * dt));
      this.alone = Math.max(0, this.alone - dt);
      this.resting += ((this.alone > 0 ? 1 : 0) - this.resting) * (1 - Math.exp(-7 * dt));
    } else if (kind === 4) {
      this.clock += dt;
      // A flick: kicked forward quickly, then back without swinging through: a twitch, not a
      // pendulum. They come now and then, sooner when the fish moves (stir) or brakes.
      this.flickAt -= dt * (2.5 * this.stir + 2 * this.brake);
      if (this.clock >= this.flickAt) {
        const kick = (9 + 10 * r()) * (1 - 0.6 * under);
        this.flickRate += kick;
        this.wave += 0.012 * kick;
        this.flickAt = this.clock + 1.2 + 5 * r() * r();
      }
      const w = 13, k = Math.exp(-1.7 * w * dt);
      this.flickRate = (this.flickRate - w * w * this.flick * dt) * k;
      this.flick += this.flickRate * dt;
      // Between flicks it twitches to a new set and holds it, rather than drifting to and fro.
      if (this.clock >= this.wanderAt) {
        const to = r() * 2 - 1;
        this.wave += 0.05 * Math.abs(to - this.wanderTo);
        this.wanderTo = to; this.wanderAt = this.clock + 0.8 + 2.5 * r();
        this.splayTo = r() * 2 - 1;
      }
      this.wander += (this.wanderTo - this.wander) * (1 - Math.exp(-9 * dt));
      this.splayWander += (this.splayTo - this.splayWander) * (1 - Math.exp(-5 * dt));
      // Splayed out to brake, and a little as it flicks; swept back in a dart.
      this.splay += (Math.max(this.brake, 0.5 * clamp(this.flick, 0, 1)) - this.splay) * (1 - Math.exp(-6 * dt));
      // The tip follows late (the streamer bends), and each flick or twitch sends a wave down it,
      // dying away: in between, it just trails.
      const late = 1 - Math.exp(-3.5 * dt);
      this.flickTip += (this.flick - this.flickTip) * late;
      this.splayTip += (this.splay - this.splayTip) * late;
      this.wanderTip += (this.wander - this.wanderTip) * late;
      this.wave = Math.min(this.wave, 0.3) * Math.exp(-2.6 * dt);
      this.ripple += dt * Math.PI * 2 * (2.2 + 1.0 * under);
      // (How far it is trailed back: the fish's pace over a second or so, not each stroke's surge.)
      this.trail += (under - this.trail) * (1 - Math.exp(-1.2 * dt));
    }
  }

  makeTargets(state) {
    const { phase, drive, turn, flare, body } = state;
    const turnBend = body.turnBend ?? Math.tanh(turn * 0.95);
    const { columns: w, rows: h, kind, side, roots, target, scratch, restOffset: offset, rowTerms: row } = this;
    // (What is the same across the fin, or along a row, once.)
    // Clamped, the rays close up: the caudal's fan narrows and droops, the dorsal and the anal lie
    // back along the body, the membranes held taut; the ventrals tuck back, close together.
    const folded = state.clamp ?? 0, held = 1 - 0.6 * folded;
    const spread = (this.open + (1 - this.open) * flare) * (1 - (CLAMP_FOLD[kind] ?? 0) * folded), fold = kind === 0 ? (DROOP[0] + (DROOP[1] - DROOP[0]) * smooth(0.08, 0.6, state.speed ?? 0)) * (1 - flare) + CLAMP_DROOP * folded : 0;
    const lower = LOWER_LOBE * (1 - flare);
    // The membranes billow slowly, stirred by the pectorals' wash and the water going past (at about
    // the gait's billow pace), more as the fish moves and turns, less held open in display; in gusts,
    // and stirred up by the body's moves, while the swell, a second, slower wave, comes and goes.
    const speed = Math.min(state.speed ?? 0, 1.2);
    const billowSize = (1 - flare * 0.7) * held * (0.025 + 0.035 * (state.wash ?? 0) + 0.05 * speed + 0.02 * Math.min(1, Math.abs(turn)))
      * (this.gust + 0.6 * this.stir), swellSize = billowSize * (1.2 - this.gust) * 0.8;
    // Partly closed, the membrane gathers into pleats; the caudal's lobes twist apart.
    const pleat = kind < 3 ? PLEAT[kind] * (0.5 + clamp(1 - spread, 0, 1)) * held * (1 - 0.6 * flare) : 0;
    // (The body's C changing drags the caudal round behind, its lobes twisting, and the rear of the dorsal
    // and the anal after it.)
    const curling = clamp(this.curlRate, -3, 3) * (1 - 0.7 * flare), dragged = kind < 3 ? -CURL_DRAG * curling : 0;
    const twist = kind === 0 ? TWIST * (0.6 * this.twist - 0.5 * this.turnLag - CURL_TWIST * clamp(curling, -2, 2)) * (1 - 0.7 * flare) : 0;
    // (A kick of the tail swings the fan out beyond the peduncle's own swing.)
    const kicked = kind === 0 && state.kick ? KICK_FAN * state.kick * kickSweep(state.kickAt ?? 1, 1, state.kickSweeps ?? 1) : 0;
    // (The anal's undulation, and the dorsal's: most at hover, harder as the fish works.)
    const undulation = (UNDULATE[kind] ?? 0) * (0.6 + 0.6 * this.work) * (1 - 0.6 * smooth(0.08, 0.6, state.speed ?? 0)) * held * (1 - 0.7 * flare);
    if (kind === 3) {
      // Alternating rowing stroke, then feathered/cupped recovery.
      // (Each fin in its own time: slipping in and out of step with the other.)
      const beat = this.fan + this.slip + (side < 0 ? Math.PI : 0);
      // Sculling fans a little wider than slow swimming; a startle or a dart draws the fins in toward
      // the flanks. The fan keeps beating and keeps most of its span, so the fold reads as a change of
      // pose and not as the fin shrinking. Power follows the gait's slow pectoral effort, not the
      // tail's. Resting between runs of beats (the gait's pectoralPower) or alone, a fan lies back
      // against the flank; at hover a turn is the pectorals' work, one fin beating harder than the
      // other (the outer one: its stroke brings the fish round); to brake, both swing forward and out.
      // A push's own stroke, plain to see, takes over from the gait's beat while it lasts.
      const effort = state.pectoralEffort ?? state.effort ?? drive, stroking = this.strokeAt < 1 ? Math.sin(Math.PI * this.strokeAt) : 0;
      const tuck = Math.max(state.tuck ?? 0, this.push), beating = this.fanPower * (1 - 0.86 * this.resting);
      const power = (0.62 + 0.36 * effort + 0.05 * (state.pectoralScull ?? state.scull ?? 0)) * (1 - 0.35 * tuck) * beating * this.own
        * (1 - 0.3 * side * clamp(turn, -1, 1) * (1 - effort)) * (1 + 0.25 * this.brake) * (1 - 0.6 * stroking)
        * (1 + FAN_SWEEP * this.still * (0.45 + 0.55 * this.work) + REST_SWEEP * this.idle);
      const cup = Math.max(0, Math.cos(beat)), lie = LIE * Math.max(0, 1 - beating) * (1 - this.brake) - FLARE_FORWARD * this.brake;
      const reach = this.strokeAt < 1 ? STROKE_REACH * this.strokeSize * (STROKE_INNER + (1 - STROKE_INNER) * this.outer) * Math.sin(2 * Math.PI * this.strokeAt) : 0;
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1);
        // (A push's stroke swings the margin the most.)
        const stroke = side * (power * (0.48 * Math.sin(beat) + 0.18 * Math.sin(beat - v * 1.5) * v) - 0.12 - 0.13 * tuck - lie + reach * (0.55 + 0.45 * v));
        const feather = side * (0.41 + beating * (0.9 * cup - 0.29)) * v;
        row[j * 4] = Math.cos(stroke); row[j * 4 + 1] = Math.sin(stroke);
        row[j * 4 + 2] = Math.cos(feather); row[j * 4 + 3] = Math.sin(feather);
      }
    } else if (kind === 4) {
      // (Positive swings the streamer back.) Trailing further back under way (its tip swept back
      // more, and further in a dart), flicked forward and splayed out when the fish brakes, twitched
      // to a new set of its own between: each a little later at the tip than at the root, so the thin
      // streamer bends along its length rather than swinging as a rod, a flick's wave running down it.
      // (Held forward of the photographed rake at hover, trailing back under way; swung forward and out to
      // steer as the body curls into a turn. Only the thin outer part waves on its own, quicker and shorter
      // than a wave down the whole streamer: the rest is held.)
      const under = this.trail, base = -flare * 0.16 + CLAMP_TUCK * folded - PELVIC_HOLD * (1 - under);
      const steering = CURL_PELVIC * Math.abs(this.curl);
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1), tip = v * v, thin = smooth(0.4, 1, v) ** 2;
        const flick = this.flick + (this.flickTip - this.flick) * tip, splay = this.splay + (this.splayTip - this.splay) * tip;
        const wander = this.wander + (this.wanderTip - this.wander) * tip;
        const angle = base + 0.34 + (0.12 + 0.4 * under) * (0.7 + 0.6 * v) - 0.12 - 0.45 * flick - 0.3 * splay + 0.07 * wander - steering
          + 0.25 * this.push * v + (0.12 + this.wave) * thin * Math.sin(this.ripple - v * 6);
        // (The streamer's tip waves sideways too, on its own beat.)
        row[j * 4] = side * v * (PELVIC_SPLAY * (1 - 0.5 * this.push) + 0.2 * splay + PELVIC_SPLAY_WANDER * this.splayWander + 0.5 * steering)
          + 0.05 * thin * Math.sin(0.7 * this.ripple - v * 5 + side);
        row[j * 4 + 1] = Math.cos(angle); row[j * 4 + 2] = Math.sin(angle);
      }
    }
    const lumps = this.lumps;
    for (let i = 0; i < w; i++) {
      const u = i / (w - 1), r = i * 3, pleated = pleat * Math.sin(u * Math.PI * FOLDS[kind] + kind);
      // (The billow higher in some stretches of the margin than others, and running on quicker in some.)
      const lumpy = kind < 3 ? 1 + UNEVEN * (0.6 * Math.sin(9.4 * u + lumps[0]) + 0.4 * Math.sin(21 * u + lumps[1])) : 1;
      const bunched = kind < 3 ? UNEVEN_PACE * Math.sin(5.1 * u + lumps[2]) : 0;
      this.lumpy[i] = lumpy;
      body.frame(roots[r], scratch);
      const tangentCos = scratch[2], tangentSin = scratch[3];
      body.transform(roots[r], roots[r + 1], roots[r + 2], scratch);
      const rx = scratch[0], ry = scratch[1], rz = scratch[2];
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1), m = j * w + i, n = m * 3;
        let x = offset[n], y = offset[n + 1], z = offset[n + 2];
        // Fold by changing ray angle, not shortening or scaling the fin.
        if (kind < 3) {
          const angle = this.restAngle[m] * spread - fold - lower * this.lowerLobe[m], length = this.restSpan[m];
          x = length * Math.cos(angle); y = length * Math.sin(angle);
          // (A turn leans the dorsal and anal over, more towards their tips: their rays bend, rather
          // than the fin tipping over from its base like a flap.)
          const wave = kind === 0
            ? (0.004 + drive * 0.4) * this.sway * Math.sin(phase - 2.5 - v * 0.8)
            : (0.006 + drive * 0.13) * this.sway * Math.sin(phase * 0.8 - u * 3.7 - v * 0.7 + kind * 1.8)
              + turnBend * (0.20 + u * 0.20) * (0.3 + 0.7 * v) + 0.6 * dragged * u * v
              // (A wave running back along it, the dorsal's mostly at its rear.)
              + undulation * (kind === 1 ? 0.25 + 0.75 * u : 1) * Math.sin(this.undulate - u * 7 - v * 0.6 + kind);
          // Bend throughout the ray, not just a ruffled outer border, but held near the body by the
          // rays' stiffness: most of it in the outer half. Phase varies across the fan and travels out
          // along each ray, so the membrane billows.
          const billow = lumpy * (billowSize * Math.sin(this.billow - u * 5.5 - bunched - v * 2.2 + kind * 1.8) + swellSize * Math.sin(this.swell + u * 3.1 - v * 1.6));
          // The pleats and the twist lean the rays apart, more towards the margin.
          const upper = Math.sin(this.restAngle[m]);
          const bend = (wave + billow) * (0.1 + 0.9 * v ** 1.5) + (pleated + twist * upper) * v;
          // Bend about the ray's in-plane perpendicular; roots stay attached.
          const length3 = Math.hypot(x, y), cosBend = Math.cos(bend);
          x *= cosBend; y *= cosBend;
          z += length3 * Math.sin(bend);
          if (kind === 0) {
            // The broad caudal fan wraps behind the peduncle during a turn.
            // Rotate across its span, preserving ray length and vertical spread;
            // the membrane solver supplies the slower free-edge follow-through.
            // (The lobes' tips more than the middle: the fan's outline bends in the turn.)
            const sweep = turnBend * v * (0.1 + 0.12 * Math.abs(upper)) + kicked * (0.6 + 0.4 * v) + dragged * v ** 1.5, cosSweep = Math.cos(sweep), sinSweep = Math.sin(sweep);
            const cx = x * cosSweep - z * sinSweep;
            z = x * sinSweep + z * cosSweep; x = cx;
          }
        } else if (kind === 3) {
          // (The row's stroke, then its feather.)
          const cx = x * row[j * 4] - z * row[j * 4 + 1];
          z = x * row[j * 4 + 1] + z * row[j * 4]; x = cx;
          const cy = y * row[j * 4 + 2] - z * row[j * 4 + 3];
          z = y * row[j * 4 + 3] + z * row[j * 4 + 2]; y = cy;
        } else {
          const cosA = row[j * 4 + 1], sinA = row[j * 4 + 2], cx = x * cosA - y * sinA;
          y = x * sinA + y * cosA; x = cx;
          z = z * (1 - CLAMP_PINCH * folded) + row[j * 4];
        }
        target[n] = rx + x * tangentCos - z * tangentSin;
        target[n + 1] = ry + y; target[n + 2] = rz + x * tangentSin + z * tangentCos;
      }
    }
  }

  advance(dt, state) {
    if (dt > 0) this.advancePosture(dt, state);
    this.lastTarget.set(this.target);
    const opening = dt > 0 && this.initialized && this.kind < 3 && Math.abs(state.flare - this.previousFlare) > 1e-8;
    if (opening) {
      this.makeTargets({ ...state, flare: this.previousFlare });
      this.displayTarget.set(this.target);
    }
    this.makeTargets(state);
    if (opening) {
      // A deliberate display changes the ray fan over the controller's one
      // second. Carry the existing folds/flow deflection with that rest-shape
      // change; do not replace them with a continuously pinned target surface.
      for (let q = this.columns * 3; q < this.position.length; q++) {
        const shift = this.target[q] - this.displayTarget[q];
        this.position[q] += shift; this.previous[q] += shift;
        this.lastTarget[q] += shift;
      }
    }
    if (dt > 0 || !this.initialized) this.previousFlare = state.flare;
    if (!this.initialized) {
      this.position.set(this.target); this.previous.set(this.target);
      this.lastTarget.set(this.target);
      this.initialized = true;
    }
    this.frameTarget.set(this.target);
    this.findSolids(state.solids);
    this.accumulator += Math.min(dt, FIN_QUALITY.maxFrame);
    const step = FIN_QUALITY.step;
    const substeps = Math.floor((this.accumulator + 1e-10) / step);
    let completed = 0;
    const { target, lastTarget, frameTarget } = this;
    while (completed < substeps) {
      // Move insertions throughout the substeps, not in one frame-sized jump.
      // This matters once the trunk has a substantial muscular stroke.
      const blend = ++completed / substeps;
      // (The last substep on the frame's own targets exactly, not a rounding off them.)
      if (completed === substeps) target.set(frameTarget);
      else for (let i = 0; i < target.length; i++) target[i] = lastTarget[i] + (frameTarget[i] - lastTarget[i]) * blend;
      this.integrate(step, state);
      this.accumulator = Math.max(0, this.accumulator - step);
      this.steps++;
    }
    target.set(frameTarget);
    // (A frame too short for a step, the step being coarse (FIN_QUALITY) and the screen quick: the
    // last solved shape, relative to the body, is carried with it as it is.)
    if (!completed && this.steps) return;
    const { position, rest, scratch, displacement, carried } = this;
    for (let n = 0; n < this.count; n++) {
      state.body.transform(rest[n * 3], rest[n * 3 + 1], rest[n * 3 + 2], scratch);
      for (let k = 0; k < 3; k++) {
        carried[n * 3 + k] = scratch[k];
        displacement[n * 4 + k] = position[n * 3 + k] - scratch[k];
      }
    }
    if (this.kind < 3) this.flutter(state);
    this.keepClear(state);
    this.carriedBy = state.body;
    this.carriedAt = state.body.revision;
  }

  // The broad fins' margins (their outer third) shimmer, faster and wider than any body motion, even
  // with the fish still: small ripples running out along the margin from the fan's middle, across
  // the membrane, and each ray tip trembling on its own in the fan's plane, so the outline never
  // holds still; the ripple higher in some stretches than others, and each ray tip standing out past the
  // margin's curve by its own length. Drawn over the solved shape (the solver's soft fringe would
  // smooth it away).
  flutter(state) {
    const { columns: w, rows: h, position: p, displacement, tipPhase, rag, lumpy } = this;
    const calm = (1 - 0.5 * state.flare) * (1 - 0.5 * (state.clamp ?? 0)), speed = Math.min(1, state.speed ?? 0);
    const size = calm * (0.02 + 0.03 * speed + 0.008 * (state.wash ?? 0)), tremble = calm * (0.016 + 0.02 * speed);
    const jitter = calm * TIP_FLUTTER * (0.7 + 0.5 * speed + 0.3 * Math.min(1, this.stir)), { jitPhase, jitAmp } = this;
    for (let j = Math.ceil((h - 1) * 0.6); j < h; j++) {
      const v = j / (h - 1), edge = smooth(0.6, 1, v) ** 1.5;
      for (let i = 0; i < w; i++) {
        const n = j * w + i, q = n * 3, u = i / (w - 1);
        const a = (j * w + Math.max(0, i - 1)) * 3, b = (j * w + Math.min(w - 1, i + 1)) * 3, c = q - w * 3;
        const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
        const vx = p[q] - p[c], vy = p[q + 1] - p[c + 1], vz = p[q + 2] - p[c + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const out = Math.abs(u - 0.5);
        const ripple = 0.65 * Math.sin(this.flutterPhase - out * 40 + v * 4) + 0.35 * Math.sin(0.61 * this.flutterPhase - u * 17 + tipPhase[i] * 0.3);
        // (And each ray tip on its own, out of the membrane and a little across and along the fan.)
        const tip = smooth(0.7, 1, v) ** 2, own = tip * jitter * jitAmp[i] * (0.7 * Math.sin(jitPhase[i]) + 0.3 * Math.sin(1.9 * tipPhase[i] + i));
        const s = (edge * size * ripple * lumpy[i] + own) / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1);
        const t = (edge * tremble * Math.sin(tipPhase[i] + v * 2) + 0.45 * own) / (Math.sqrt(ux * ux + uy * uy + uz * uz) || 1);
        const l = (0.25 * own + calm * rag[i] * smooth(0.75, 1, v) ** 2) / (Math.sqrt(vx * vx + vy * vy + vz * vz) || 1);
        displacement[n * 4] += nx * s + ux * t + vx * l; displacement[n * 4 + 1] += ny * s + uy * t + vy * l; displacement[n * 4 + 2] += nz * s + uz * t + vz * l;
      }
    }
  }

  /** What is drawn (each node as carried, plus its displacement) held under the surface and out of the
   *  solids the fin could touch, as the solver holds the nodes: the shimmer drawn over the solved shape
   *  folds along them too, never through. (The insertions are the body's: they stay where it puts them.) */
  keepClear(state) {
    const { carried, displacement: d, touching, columns: w } = this, surface = typeof state.surfaceY === 'number', down = state.down;
    if (!surface && !this.touchCount) return;
    const ux = down ? -down[0] : 0, uy = down ? -down[1] : 1, uz = down ? -down[2] : 0, top = state.surfaceY - SURFACE_CLEAR;
    for (let n = w; n < this.count; n++) {
      const q = n * 3, e = n * 4;
      let x = carried[q] + d[e], y = carried[q + 1] + d[e + 1], z = carried[q + 2] + d[e + 2];
      for (let k = 0; k < this.touchCount; k++) {
        const o = k * 8, ax = touching[o], ay = touching[o + 1], az = touching[o + 2];
        const bx = touching[o + 3], by = touching[o + 4], bz = touching[o + 5], r = touching[o + 7];
        const t = clamp(((x - ax) * bx + (y - ay) * by + (z - az) * bz) * touching[o + 6], 0, 1);
        const cx = ax + bx * t, cy = ay + by * t, cz = az + bz * t, dx = x - cx, dy = y - cy, dz = z - cz, d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r * r || d2 < 1e-18) continue;
        const out = r / Math.sqrt(d2);
        x = cx + dx * out; y = cy + dy * out; z = cz + dz * out;
      }
      if (surface) {
        const over = ux * x + uy * y + uz * z - top;
        if (over > 0) { x -= ux * over; y -= uy * over; z -= uz * over; }
      }
      d[e] = x - carried[q]; d[e + 1] = y - carried[q + 1]; d[e + 2] = z - carried[q + 2];
    }
  }

  /** The host's solids (state.solids: { data: [start, end, radius] each, count }, in the fish's frame)
   *  that the fin could touch this frame: those passing within its reach of its insertions. */
  findSolids(solids) {
    this.touchCount = 0;
    if (!solids) return;
    const { target, columns: w, touching } = this;
    let mx = 0, my = 0, mz = 0;
    for (let i = 0; i < w; i++) { mx += target[i * 3]; my += target[i * 3 + 1]; mz += target[i * 3 + 2]; }
    mx /= w; my /= w; mz /= w;
    for (let k = 0; k < solids.count; k++) {
      const d = solids.data, o = k * 7, ax = d[o], ay = d[o + 1], az = d[o + 2];
      const bx = d[o + 3] - ax, by = d[o + 4] - ay, bz = d[o + 5] - az, r = d[o + 6];
      const l2 = bx * bx + by * by + bz * bz, inv = l2 > 1e-12 ? 1 / l2 : 0;
      const t = clamp(((mx - ax) * bx + (my - ay) * by + (mz - az) * bz) * inv, 0, 1);
      if (Math.hypot(mx - ax - bx * t, my - ay - by * t, mz - az - bz * t) > this.reach + r) continue;
      const at = this.touchCount++ * 8;
      touching[at] = ax; touching[at + 1] = ay; touching[at + 2] = az;
      touching[at + 3] = bx; touching[at + 4] = by; touching[at + 5] = bz; touching[at + 6] = inv; touching[at + 7] = r;
    }
  }

  integrate(dt, state) {
    const { position: p, previous: old, target, columns: w, rows: h, flow, linkLengths: lengths, linkEnds: ends, linkTerms: terms } = this;
    const { heading, velocity, angularVelocity, origin, strength, direction, time, localHydrodynamics: local } = state;
    const co = Math.cos(heading), si = Math.sin(heading), dt2 = dt * dt;
    // A fin ray resists stretching, not lateral bending like a rigid sail. The broad fins' inner
    // half is just stiff enough to take up the tail's 2-3 Hz beat and still yield to the water;
    // their outer half is softer, trailing the beat and lagging, settling within a second or so when
    // the body turns or stops, but the rays still hold it out in shape: it ripples, never drapes.
    // Display adds muscular tension without pinning their positions against the water. (A row's stiffness, once for the row. Clamped fins are held in
    // by muscle too.)
    const stiffness = this.rowStiffness, folded = state.clamp ?? 0;
    for (let j = 1; j < h; j++) {
      const v = j / (h - 1);
      stiffness[j] = this.kind < 3
        ? (this.kind ? 9 : 14) + 300 * (1 - v) ** 2 + state.flare * (5 + 22 * (1 - v) ** 2) + folded * (6 + 20 * (1 - v) ** 2)
        // (The ventral streamer is the muscle's out to its middle, so a flick or a twitch shows along
        // it, and only its last third is left to the water: even there its leading ray holds it out
        // straight, bending, not crumpling like a thread.)
        : this.kind === 4 ? 6 + 12 * folded + 260 * (1 - v) ** 2 : 5.0 + (this.kind === 3 ? 160 : 110) * (1 - v) ** 3;
    }
    // The fin's weight, along the fish's own down (state.down), and the lag of its mass against the
    // body's acceleration (state.accel), the same at every node; the water's own damping per second
    // (a thin ventral streamer is held hardest by it: it trails and settles, never swinging on freely;
    // nor do the broad fins swing on, cloth-like, after a move).
    const down = state.down, accel = state.accel, weight = WEIGHT[this.kind];
    const gx = (down ? down[0] : 0) * weight - (accel ? accel[0] : 0) * INERTIA[this.kind];
    const gy = (down ? down[1] : -1) * weight - (accel ? accel[1] : 0) * INERTIA[this.kind];
    const gz = (down ? down[2] : 0) * weight - (accel ? accel[2] : 0) * INERTIA[this.kind];
    const keep = Math.exp(-(this.kind === 4 ? 4.5 : this.kind === 3 ? 2.2 : 3) * dt);
    for (let q = 0; q < w * 3; q++) p[q] = old[q] = target[q];
    for (let j = 1; j < h; j++) for (let i = 0; i < w; i++) {
      const q = (j * w + i) * 3;
      const a = (j * w + Math.max(0, i - 1)) * 3, b = (j * w + Math.min(w - 1, i + 1)) * 3;
      const c = ((j - 1) * w + i) * 3, d = (Math.min(h - 1, j + 1) * w + i) * 3;
      const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
      const vx = p[d] - p[c], vy = p[d + 1] - p[c + 1], vz = p[d + 2] - p[c + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= len; ny /= len; nz /= len;
      let rvx, rvy, rvz;
      if (local) {
        // Host fish may pitch and roll in a turbulent globe. Use the full body
        // frame and omega x radius, not a yaw-only approximation of fin drag.
        const { flow: u, velocity: v, angular: w } = local;
        rvx = u[0] - v[0] - (w[1] * p[q + 2] - w[2] * p[q + 1]) - (p[q] - old[q]) / dt;
        rvy = u[1] - v[1] - (w[2] * p[q] - w[0] * p[q + 2]) - (p[q + 1] - old[q + 1]) / dt;
        rvz = u[2] - v[2] - (w[0] * p[q + 1] - w[1] * p[q]) - (p[q + 2] - old[q + 2]) / dt;
      } else {
        const wx = co * p[q] + si * p[q + 2], wz = -si * p[q] + co * p[q + 2];
        if (state.externalFlow) {
          for (let k = 0; k < 3; k++) flow[k] = state.externalFlow[k];
        } else waterVelocity(time, wx + origin[0], p[q + 1] + origin[1], wz + origin[2], strength, direction, flow);
        // Relative fluid includes translation, turning and each membrane's own speed.
        const fx = flow[0] - velocity[0], fz = flow[2] - velocity[2];
        rvx = co * fx - si * fz - angularVelocity * p[q + 2] - (p[q] - old[q]) / dt;
        rvy = flow[1] - velocity[1] - (p[q + 1] - old[q + 1]) / dt;
        rvz = si * fx + co * fz + angularVelocity * p[q] - (p[q + 2] - old[q + 2]) / dt;
      }
      const normalSpeed = clamp(rvx * nx + rvy * ny + rvz * nz, -2, 2);
      // Water pressing on the membrane's face drags it hard; water sliding along it, far less (a
      // fast fish's fins stream back as a narrowed fan rather than being crumpled up by it).
      const pressure = normalSpeed * (2.6 + Math.abs(normalSpeed) * 3.5);
      const k = stiffness[j];
      const dx = nx * pressure + rvx * 0.3 + gx, dy = ny * pressure + rvy * 0.3 + gy, dz = nz * pressure + rvz * 0.3 + gz;
      let current = p[q], acceleration = clamp((target[q] - current) * k + dx, -80, 80);
      p[q] += (current - old[q]) * keep + acceleration * dt2;
      old[q] = current;
      current = p[q + 1]; acceleration = clamp((target[q + 1] - current) * k + dy, -80, 80);
      p[q + 1] += (current - old[q + 1]) * keep + acceleration * dt2;
      old[q + 1] = current;
      current = p[q + 2]; acceleration = clamp((target[q + 2] - current) * k + dz, -80, 80);
      p[q + 2] += (current - old[q + 2]) * keep + acceleration * dt2;
      old[q + 2] = current;
    }
    // Cross-ray chord spacing folds with the ray fan. Fin-ray lengths stay
    // fixed; unresolved accordion pleats are represented by shorter chords,
    // not by shrinking the rays. Keeping open-fan chords here would fight closure.
    // (Only those chords change: every other link keeps the rest length it was given.)
    for (let f = 0; f < this.refolding.length; f++) {
      const l = this.refolding[f], a = ends[l * 2], b = ends[l * 2 + 1];
      lengths[l] = Math.hypot(target[b] - target[a], target[b + 1] - target[a + 1], target[b + 2] - target[a + 2]);
    }
    // Alternate constraint traversal to avoid a persistent preferred bend direction.
    const passes = Math.max(3, Math.round((this.kind === 3 ? 12 : 8) * FIN_QUALITY.passScale));
    const m = lengths.length;
    for (let pass = 0; pass < passes; pass++) {
      // Pectoral rays are actively rotated by the muscular base, not merely
      // pulled by a weak spring (which filters a rapid stroke into a slow sway).
      // Actuation fades across the span; the outer membrane stays water-driven.
      // (So are the caudal's in a kick: its inner fan swept through the water with the peduncle.)
      const drive = this.kind === 3 ? 0.5 : this.kind === 0 ? KICK_HOLD * this.kickHold : 0;
      if (drive && pass < 4) for (let j = 1; j < h; j++) {
        const v = j / (h - 1), u = this.kind === 3 ? clamp((v - 0.22) / 0.55, 0, 1) : clamp((v - 0.3) / 0.6, 0, 1);
        const muscle = drive * (1 - u * u * (3 - 2 * u));
        for (let i = 0; i < w; i++) for (let k = 0; k < 3; k++) {
          const q = (j * w + i) * 3 + k;
          p[q] += (target[q] - p[q]) * muscle;
        }
      }
      // No permanent positional pin across the inner half of the broad fins.
      // Only the insertion is fixed; ray/membrane constraints transmit tension.
      const back = pass % 2 === 1;
      for (let s = 0; s < m; s++) {
        const l = back ? m - 1 - s : s, ai = ends[l * 2], bi = ends[l * 2 + 1];
        const dx = p[bi] - p[ai], dy = p[bi + 1] - p[ai + 1], dz = p[bi + 2] - p[ai + 2];
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz), weight = terms[l * 4 + 1];
        if (length < 1e-7 || !weight) continue;
        const correction = (length - lengths[l]) / length * terms[l * 4] / weight;
        const wa = correction * terms[l * 4 + 2], wb = correction * terms[l * 4 + 3];
        p[ai] += dx * wa; p[ai + 1] += dy * wa; p[ai + 2] += dz * wa;
        p[bi] -= dx * wb; p[bi + 1] -= dy * wb; p[bi + 2] -= dz * wb;
      }
    }
    // Fast trunk strokes can otherwise stretch tiny insertion segments of the
    // long fins before the iterative membrane constraints converge. A final
    // root-to-tip ray limit carries that correction outward without moving roots.
    // The pelvic feelers need it most: it keeps every ray joined to its pinned insertion.
    if (this.kind !== 3) for (let j = 1; j < h; j++) for (let i = 0; i < w; i++) {
      const n = j * w + i, q = n * 3, a = q - w * 3;
      const dx = p[q] - p[a], dy = p[q + 1] - p[a + 1], dz = p[q + 2] - p[a + 2];
      const length = Math.hypot(dx, dy, dz), restLength = this.rayRest[n];
      if (length > 1e-7 && restLength > 1e-7) {
        const ratio = clamp(length, restLength * 0.94, restLength * 1.06) / length;
        p[q] = p[a] + dx * ratio; p[q + 1] = p[a + 1] + dy * ratio; p[q + 2] = p[a + 2] + dz * ratio;
      }
    }
    // Paired fins may fold along the flank, but must not pass through the fish.
    if (state.bodyRadius && this.side) {
      // (Each column's root frame once: every node of the column starts from it.)
      const frames = this.rootFrames, s = this.scratch;
      for (let i = 0; i < w; i++) {
        state.body.frame(this.roots[i * 3], s);
        frames[i * 4] = s[0]; frames[i * 4 + 1] = s[1]; frames[i * 4 + 2] = s[2]; frames[i * 4 + 3] = s[3];
      }
      for (let n = w; n < this.count; n++) {
        const q = n * 3, i = n % w, rootX = this.roots[i * 3];
        const cx = frames[i * 4], cz = frames[i * 4 + 1], co = frames[i * 4 + 2], si = frames[i * 4 + 3];
        const localX = rootX + (p[q] - cx) * co + (p[q + 2] - cz) * si;
        const radius = state.bodyRadius(localX, p[q + 1]);
        state.body.frame(localX, s);
        const centerX = s[0], centerZ = s[1], c = s[2], sn = s[3];
        const lateral = -(p[q] - centerX) * sn + (p[q + 2] - centerZ) * c;
        if (radius > 0 && lateral * this.side < radius + 0.009) {
          const push = this.side * (radius + 0.009) - lateral;
          p[q] -= sn * push; p[q + 2] += c * push;
          old[q] = p[q]; old[q + 2] = p[q + 2];
        }
      }
    }
    // A fin that meets a solid lies on it, held there (the surface's grip takes its speed), and slides
    // off it as the fish moves on; the membrane carries the rest of the fin with it.
    const touching = this.touching;
    for (let k = 0; k < this.touchCount; k++) {
      const o = k * 8, ax = touching[o], ay = touching[o + 1], az = touching[o + 2];
      const bx = touching[o + 3], by = touching[o + 4], bz = touching[o + 5], inv = touching[o + 6], r = touching[o + 7];
      for (let q = w * 3; q < p.length; q += 3) {
        const t = clamp(((p[q] - ax) * bx + (p[q + 1] - ay) * by + (p[q + 2] - az) * bz) * inv, 0, 1);
        const cx = ax + bx * t, cy = ay + by * t, cz = az + bz * t;
        const dx = p[q] - cx, dy = p[q + 1] - cy, dz = p[q + 2] - cz, d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r * r || d2 < 1e-18) continue;
        const out = r / Math.sqrt(d2);
        p[q] = old[q] = cx + dx * out; p[q + 1] = old[q + 1] = cy + dy * out; p[q + 2] = old[q + 2] = cz + dz * out;
      }
    }
    // Under the surface: a node that would rise through the film is held just under it, its speed up
    // through it taken away (along it, it slides on), so the fin flattens along the underside.
    if (typeof state.surfaceY === 'number') {
      const ux = down ? -down[0] : 0, uy = down ? -down[1] : 1, uz = down ? -down[2] : 0, top = state.surfaceY - SURFACE_CLEAR;
      for (let q = w * 3; q < p.length; q += 3) {
        const over = ux * p[q] + uy * p[q + 1] + uz * p[q + 2] - top;
        if (over <= 0) continue;
        p[q] -= ux * over; p[q + 1] -= uy * over; p[q + 2] -= uz * over;
        const rise = ux * (p[q] - old[q]) + uy * (p[q + 1] - old[q + 1]) + uz * (p[q + 2] - old[q + 2]);
        if (rise > 0) { old[q] += ux * rise; old[q + 1] += uy * rise; old[q + 2] += uz * rise; }
      }
    }
  }

  metrics() {
    let maxDisplacement = 0, maxRayStrain = 0, anchorError = 0;
    for (let n = 0; n < this.count; n++) {
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(...this.displacement.subarray(n * 4, n * 4 + 3)));
      if (n < this.columns) for (let k = 0; k < 3; k++) anchorError = Math.max(anchorError, Math.abs(this.position[n * 3 + k] - this.target[n * 3 + k]));
    }
    for (let n = this.columns; n < this.count; n++) {
      const a = (n - this.columns) * 3, b = n * 3;
      const original = Math.hypot(...[0, 1, 2].map(k => this.rest[a + k] - this.rest[b + k]));
      if (original > 0.005) maxRayStrain = Math.max(maxRayStrain, Math.abs(Math.hypot(...[0, 1, 2].map(k => this.position[a + k] - this.position[b + k])) / original - 1));
    }
    return { kind: this.kind, side: this.side, maxDisplacement, maxRayStrain, anchorError, steps: this.steps };
  }
}
