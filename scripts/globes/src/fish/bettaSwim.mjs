// Globe-space locomotion. The Atelier supplies the anatomy, not the route.
// A seeded stream makes checks reproducible without a short repeating orbit.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const damp = (x, y, dt, rate) => x + (y - x) * (1 - Math.exp(-dt * rate));
const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
/** Points (x, y, z, `stride` floats apart, from `start` to `end`) turned in place about the axis
 *  through the origin that `turn` points along, by its length (rad): Rodrigues. */
export function turnPoints(points, turn, start = 0, end = points.length, stride = 3) {
  const angle = Math.hypot(turn[0], turn[1], turn[2]);
  if (!(angle > 0)) return;
  const kx = turn[0] / angle, ky = turn[1] / angle, kz = turn[2] / angle, c = Math.cos(angle), s = Math.sin(angle);
  for (let i = start; i < end; i += stride) {
    const x = points[i], y = points[i + 1], z = points[i + 2], along = (kx * x + ky * y + kz * z) * (1 - c);
    points[i] = x * c + (ky * z - kz * y) * s + kx * along;
    points[i + 1] = y * c + (kz * x - kx * z) * s + ky * along;
    points[i + 2] = z * c + (kx * y - ky * x) * s + kz * along;
  }
}
/** The point of segment a-b nearest p. */
const nearestOn = (p, a, b) => {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const t = clamp(((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / Math.max(ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2, 1e-12), 0, 1);
  return [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t];
};
export const BETTA_SCALE = 0.105;

// Labyrinth fish gulp air at the free surface. The mouth sits MOUTH_AHEAD in front of
// the neck (the route point) and MOUTH_UP above its axis, in globe units. A trip up is a near-vertical
// rise (GULP_PITCH nose up, give or take a little each time), the lips at the film for about
// GULP_LENGTH s (a third as long again or shorter: real bettas touch the film for well under half a
// second), then a sink back that levels out over about DIVE_LENGTH s.
export const GULP_PITCH = 1.3, GULP_LENGTH = 0.32, DIVE_LENGTH = 1.2, MOUTH_DEPTH = 0.003;
const MOUTH_AHEAD = 0.048, MOUTH_UP = 0.0087;
const MOUTH_REACH = Math.hypot(MOUTH_AHEAD, MOUTH_UP), MOUTH_PHASE = Math.atan2(MOUTH_UP, MOUTH_AHEAD);
export const bettaMouthHeight = (y, pitch) => y + MOUTH_AHEAD * Math.sin(pitch) + MOUTH_UP * Math.cos(pitch);
/** Where the lips are for a neck at `position` swimming along heading and pitch (sim frame). */
export const bettaMouth = (position, heading, pitch) => {
  const h = MOUTH_AHEAD * Math.cos(pitch) - MOUTH_UP * Math.sin(pitch);
  return [position[0] - Math.cos(heading) * h, bettaMouthHeight(position[1], pitch), position[2] + Math.sin(heading) * h];
};
/** The nose-up pitch that puts the lips at `height` when the neck is at `y`. */
const pitchForMouth = (y, height) => Math.asin(clamp((height - y) / MOUTH_REACH, -1, 1)) - MOUTH_PHASE;
/** The jaw's opening at `e` seconds into a gulp `length` s long: wide at once, shut by its end. */
export const gulpMouth = (e, length = GULP_LENGTH) => 1.1 * (smooth(0, 0.4 * length, e) - smooth(0.6 * length, length, e));
/** The opercular pulse `e` seconds after the mouth shuts on the air: the old air let go from under
 *  the gill covers as the new is pressed into the labyrinth, as it leaves the film. */
export const gulpGillCover = e => Math.sin(Math.PI * clamp(e / 0.5, 0, 1)) ** 1.2;
const GULPING = new Set(['rise', 'gulp', 'dive']);
// A fish tipping nose up or down where it hangs in the water (turning over to dive from the film,
// levelling out as it hovers), or coming round where it hovers, turns about its middle, not its neck
// (the route point): PITCH_PIVOT behind it, where the body's weight is (its long fins trailing aside). Its head dips as its tail
// rises, rather than the head held still and the body swung about it. (Swimming, a change of
// pitch is the route's own bend.)
export const PITCH_PIVOT = 0.06;
// Short of air (gasp, from gills the water has harmed), it goes up GASP_OFTEN times as often at
// the most, and from GASP_LINGER on it stays at the film for more gulps, up to GASP_GULPS more
// (each after a pause of GASP_PAUSE s, and up to as long again), hanging there between them.
export const GASP_OFTEN = 10, GASP_LINGER = 0.4, GASP_GULPS = 8, GASP_PAUSE = 1.7;
// A well fish goes up every GULP_EVERY s or so (half as long again at most: about twenty times an
// hour at rest), the sooner the busier it has been of late (up to GULP_BUSY less: a displaying or
// patrolling fish breathes about twice as often).
export const GULP_EVERY = 150, GULP_BUSY = 0.45;

// Slow, deliberate episodes that interrupt the route: facing its reflection in the glass with the
// fins flared, a lap round the globe, and settling on the sand or on the furnishings. They need a
// measured, wet fish in an upright globe, so they never run blind; a startle or a due gulp cuts any
// of them short.
export const BEHAVIORS = new Set(['mirror', 'lap', 'rest']);
// Lying down, the neck is REST_HEIGHT over the sand: the belly on it (its long ventral, anal and
// caudal fins laid out over it: bettaSpecimen.mjs). On a furnishing's solid part (PERCH_SOLID thick
// or more, lying within PERCH_SLOPE of level, as a branch of the wood or the top of a stone), it lies
// along the top, the neck PERCH_LIFT over it; it comes to it from behind and above along it
// (PERCH_BACK, PERCH_ABOVE), gliding down onto it.
export const REST_HEIGHT = 0.049, LAP_SPEED = 0.058;
// Its display at its reflection is a short bout, as a real one's is: it flares once it is all but up to
// the glass (DISPLAY_NEAR units off where it holds), facing its reflection and held there a moment
// (DISPLAY_LOOK s, turning no faster than DISPLAY_STILL rad/s: never as it comes round, only at what it
// sees), and holds there DISPLAY_HOLD s from then, up to four fifths as long again, then lets its fins
// down and leaves; the rest of the time it carries them relaxed. Startled, now and then (FLARE_AFTER of
// the time) it flares at whatever startled it, once it has stopped to hang in the water (from FLARE_WAIT
// s or so after the startle, within FLARE_WITHIN s of it, or not at all), facing it, for FLARE_BOUT s or
// up to half as long again.
export const DISPLAY_NEAR = 0.08, DISPLAY_HOLD = 3, DISPLAY_LOOK = 0.45, DISPLAY_STILL = 0.3;
export const FLARE_AFTER = 0.3, FLARE_WAIT = 0.8, FLARE_WITHIN = 8, FLARE_BOUT = 2.2;
export const PERCH_SOLID = 0.04, PERCH_SLOPE = 0.35, PERCH_LIFT = 0.041;
const PERCH_BACK = 0.16, PERCH_ABOVE = 0.05;
// (Down on it within 0.035 of its place; or, there PERCH_SETTLE s already, within PERCH_CLOSE.)
const PERCH_SETTLE = 3, PERCH_CLOSE = 0.06;
// (Going down to lie, coming no nearer its place for REST_STUCK s, it lies down short of it or gives it up.)
const REST_STUCK = 5;
const MIRROR_REACH = 0.025, LAP_RADIUS = 0.78, LAP_LEAD = 0.55;
// Listless (lethargy, 0..1: a fish unwell in poor water), it goes down to the sand far more often
// and stays up to REST_LONGER times as long, lying a little over on its side; it swims slower, on
// shorter legs, and hovers more; from LISTLESS on it no longer displays or patrols; it takes a
// harder knock to startle it. Going down to lie, it lets itself sink (at SAG_RATE for each unit
// above where it settles, between SAG_SLOWEST and SAG_FASTEST units/s, from half way listless on),
// swimming forward at most SAG_STILL less.
export const REST_LONGER = 6, LISTLESS = 0.4;
const SAG_RATE = 0.6, SAG_SLOWEST = 0.01, SAG_FASTEST = 0.03, SAG_STILL = 0.85;

// A knock on the glass: water that changes faster than the fish is used to. Measured with the
// globe in hand, idle water reads 0, a gentle drag ~0.4, a brisk swipe ~1.3 and a flick 2+.
// It answers with a C-start: the head whips round to the new heading in a few hundredths of a second
// (at up to STARTLE_WHIP rad/s), then the tail's power stroke throws it off at STARTLE_SPEED (about
// four and a half body lengths a second: a halfmoon's fins hold it back from a wild fish's ten or
// more), and it coasts, slowing over STARTLE_COAST s.
export const STARTLE_JOLT = 1.25, STARTLE_LENGTH = 0.9, STARTLE_COOLDOWN = 10, STARTLE_SPEED = 1.3;
export const STARTLE_WHIP = 35;
const STARTLE_COAST = 0.2;

// The fish only gains speed as fast as its tail (or sculling pectorals) is working: `stroke`, 0..1,
// is the host's measure of that, and speed can rise by at most STROKE_ACCEL x stroke per second. A
// still tail therefore cannot accelerate the body. Without a reading (headless runs) it is unlimited.
/** The slowest current a holding fish lets carry it (units/s): slower, it keeps its station. */
const HOLD_AGAINST = 0.12;
export const STROKE_ACCEL = 1.1;
// (A dart's beats are up to this many times as hard as an easy cruise's: the gait's measure.)
const STROKE_MOST = 3;
// Its trims while it hovers: up to TRIM_PITCH and TRIM_ROLL (rad) either way, a yaw of up to
// TRIM_YAW rad/s and a nudge forward of up to TRIM_NUDGE units/s, each kick lasting TRIM_KICK s.
// Backing up (its hover's creep, or easing off the glass), it works its pectorals the harder.
export const TRIM_PITCH = 0.08, TRIM_ROLL = 0.06, TRIM_YAW = 0.16, TRIM_NUDGE = 0.009, TRIM_KICK = 0.45;
// Hanging in the water it comes round in strokes, never as a slow, even spin: a beat of its outer
// pectoral (a sweep of the tail too, for a big one) swings its head into the turn, the rest of the
// body bending after it (the C: body-motion.js), and it turns on through the water as it straightens,
// slowing (YAW_DRAG, 1/s) to all but a stop before the next (at least YAW_GAP s after any stroke). A stroke sets
// it turning at up to YAW_PEAK rad/s, its head swung in at up to YAW_SNAP rad/s/s; it is enough to
// turn it as far as it means to, if it can.
export const YAW_DRAG = 1.6, YAW_PEAK = 1.5, YAW_SNAP = 5, YAW_GAP = 0.35;
// (Coming round from all but a standstill otherwise, each stroke a quicker one, slowing at TURN_DRAG,
// but never quicker than YAW_MOST rad/s: going back the way it came takes it the best part of a second
// or more, bent the whole way, not a snap; only a startle whips round faster. Once it has begun to come
// round one way, it goes on round that way for TURN_COMMIT s after its last stroke, rather than
// swinging back and forth between two ways out, a glass and a thing beside it.)
export const TURN_DRAG = 2.4, YAW_MOST = 2.2, TURN_COMMIT = 1.5;
// Coming round it curls into a C (curl, -1..1, + to its left, as a turn to its left curls it:
// body-motion.js bends the trunk by it, the head leading and the rear following): as deep as the turn
// it means to make is quick (CURL_RATE rad/s curls it three quarters of the way), formed as the turn
// begins (in about CURL_IN s) and let go more slowly as it ends (CURL_OUT s). Out of a C of CURL_STROKE
// or more that took it CURL_TURN rad or more round, the tail straightens with a sweep (KICK_OUT of a
// setting-off kick at the most), out the other way, that carries it off on its new heading.
export const CURL_RATE = 1.6, CURL_IN = 0.12, CURL_OUT = 0.35, CURL_STROKE = 0.45, CURL_TURN = 0.7, KICK_OUT = 0.7;
// Curled, it leans into the C as well (CURL_ROLL rad for a full one, at any pace: a fish coming round
// on the spot tips over into its turn too), so the C shows seen from its side, not only from above.
export const CURL_ROLL = 0.22;
// Hanging in the water it is never quite still: it keeps its balance with small corrections, the head
// drifting a little either way and brought back (BALANCE_YAW rad), a nod (BALANCE_PITCH rad: about its
// middle, so the head bobs) and a lean (BALANCE_ROLL rad), quicker than its slow trims, the pectorals
// answering. Lying down, it settles: it touches down with a nod (SETTLE_NOD rad, its tail lifting a
// little as its chin goes down) that it comes back out of over SETTLE_TIME s, its pectorals fanned.
export const BALANCE_YAW = 0.045, BALANCE_PITCH = 0.025, BALANCE_ROLL = 0.02;
export const SETTLE_NOD = 0.07, SETTLE_TIME = 0.7;
// Lying there it is never set like a stone: every REST_SHIFT s or so (up to twice as long) it shifts a
// little against what it lies on, on a beat of its pectorals (its head brought round up to REST_YAW rad
// either way, a nod of up to REST_NOD rad), and now and then (REST_FLICK of them) with a flick of its
// tail (REST_FLICK_SIZE of a setting-off sweep), its long fins stirred by it.
export const REST_SHIFT = 2.5, REST_YAW = 0.09, REST_NOD = 0.025, REST_FLICK = 0.35, REST_FLICK_SIZE = 0.3;
// (Its pectorals never quite rest: lying down they fan slowly (a hold of FAN_REST), and going on slowly
// too (FAN_SLOW, easing off as it goes faster, the tail taking over).)
export const FAN_REST = 0.2, FAN_SLOW = 0.2;
// Setting off from a stop it often darts (DART_START of the time; always in a burst; now and then
// from a hover, a short lunge, LUNGE_OFTEN of hovers): a strong beat or two of the tail, its fins
// folded, DART_TIME s at up to DART_SPEED (a body length and a half a second or more), then it coasts.
// A pass often ends in a hard stop (HARD_STOP of them), braked in BRAKE_TIME s on its pectorals,
// fanned, rather than eased into.
export const DART_START = 0.4, DART_SPEED = 0.5, DART_TIME = 0.3, LUNGE_OFTEN = 0.25, HARD_STOP = 0.45, BRAKE_TIME = 0.35;
// The stroke comes first and the move after it: darting or coming round from all but a standstill, it
// gains no way and swings round only slowly for STROKE_LEAD s after the stroke, while the sweep runs
// down the body to the tail; setting off, START_LEAD s, until its first sweep is at its widest. A
// hover turn takes a sweep of the tail with its pectoral beat from TURN_KICK of its strongest on (a
// half beat: the tail swung out the way the head is not), TURN_SWEEP the size of setting off's: turning
// on the spot, the pectorals do most of the work, and a full sweep would beat the tail for nothing.
export const STROKE_LEAD = 0.18, START_LEAD = 0.26, TURN_KICK = 0.5, TURN_SWEEP = 0.6;
// A fish hanging in the water or all but still keeps near level: it tips towards where it is going
// only as it means to get under way or does (from LEVEL_SLOW to LEVEL_FAST units/s).
const LEVEL_SLOW = 0.03, LEVEL_FAST = 0.09;
// Tipping nose up or down (but in a startle or a dart, for food, or going up to the film and back), it
// turns over at PITCH_FASTEST rad/s at the most, easing into and out of it at up to PITCH_SNAP rad/s/s:
// a big change of pitch takes a second or more, the body bending as it goes (body-motion.js). From all
// but a standstill a tip of PITCH_STROKE rad or more goes on a stroke, as a turn does, and waits on it.
export const PITCH_FASTEST = 0.45, PITCH_SNAP = 1.6, PITCH_STROKE = 0.14;
// Going up to the film (for air or a pellet) it swims up into it rather than tipping up on the spot:
// its head lifts and the rest follows (body-motion.js's head-led bend), its tail beating, the climb
// under way from the first (RISE_UNDER_WAY of its pace before it has tipped up at all), and its pitch
// building over most of the rise, at RISE_TIP rad/s at the most, eased into and out of at up to
// RISE_SNAP rad/s/s. Sinking back from the film it tips over the same way, a little quicker (DIVE_TIP at
// the most, DIVE_SNAP): it levels out within about a second and a half.
export const RISE_TIP = 1.35, RISE_SNAP = 2.6, RISE_UNDER_WAY = 0.55, DIVE_TIP = 1.8, DIVE_SNAP = 4.5;
// Hanging in the water, or going on slowly with its tail all but still (gliding, or on its pectorals),
// it gains way only on a stroke: for PUSH_TIME s after a beat of its pectorals or a sweep of its tail;
// between them it coasts, slowing (COAST, 1/s). Going on slowly it beats its pectorals again once it has
// slowed to PADDLE_AGAIN of its pace (PADDLE_GAP s apart at the least). Below PADDLE_TOP units/s its
// tail all but stops (the gait's tailSwing): above it, the tail's beat drives it.
export const PUSH_TIME = 0.4, COAST = 1.2, PADDLE_AGAIN = 0.8, PADDLE_GAP = 0.45, PADDLE_TOP = 0.035;
// Its long fins hang well below its line and trail behind it (FIN_REACH: the tips of the ventrals, the
// anal fin's edge and the caudal's foot, as they hang: how far back of the neck and how far under its
// line); it keeps them FIN_ROOM clear of the furnishings' solid parts, as a real one keeps them off
// things, easing away and up when they would touch.
const FIN_REACH = [[0.08, 0.15], [0.15, 0.15], [0.22, 0.17], [0.29, 0.14], [0.36, 0.05]];
// So too its body, as it passes a thing: its snout, its head, its belly and its rear (BODY_REACH: how far
// back of the neck, how far under its line, and how far out its skin is from there), which it keeps off
// a thing by as much (rather than brushing the bark with its snout, or its flank pressed into it): off its
// whole surface (the room the fins keep round it, less BODY_IN, the least that room stands off the bark
// or the stone), or else its solid part.
const BODY_REACH = [[-0.05, 0, 0.006], [0, 0.004, 0.026], [0.1, 0.004, 0.04], [0.2, 0.002, 0.026]], BODY_IN = 0.012;
export const FIN_ROOM = 0.025;

// Goals are a real stride away across the water and within the slope the fish can climb, so it never
// has to circle a point above or below it. A net turn beyond SPIN_LIMIT rad (leaking away over ~6 s)
// is a spin, and is cut short by heading off in a straight line.
export const MIN_LEG = 0.22, MAX_SLOPE = 0.32, SPIN_LIMIT = 1.6 * Math.PI;
// Taking a pellet off the film, as bettas do: it comes in this far under the film, short of the
// pellet by the ground a rise covers (FEED_RISE for each unit of height: its head tipped steeply up),
// and once it faces the pellet from there it holds there a moment looking up at it (FEED_LOOK s, up
// to twice that), its head tipped up, then rises to it, lips first. Held at the film without it for
// FEED_MISS (s), it has missed: it drops back and comes round again (FEED_AGAIN, s).
export const FEED_DEPTH = 0.18, FEED_RISE = 0.45, FEED_MISS = 0.8, FEED_AGAIN = 1.6, FEED_LOOK = 0.5;
// The take itself is a snap: from SNAP_REACH of the lips it lunges at SNAP_SPEED for SNAP_TIME s.
export const SNAP_REACH = 0.1, SNAP_SPEED = 0.5, SNAP_TIME = 0.09;
// Swimming, it turns in an arc, easing off towards TURN_FASTEST rad/s at the most; from a standstill
// it swings round at about TURN_STILL rad/s (on its pectorals: a quarter turn in a second or so) as
// it moves off.
const TURN_FASTEST = 2.7, TURN_STILL = 1.2;

export class BettaSwim {
  constructor(seed = 237) {
    this.seed = seed;
    this.position = [0.20, -0.17, 0.12];
    this.velocity = [0, 0, 0];
    /** The part of that velocity that is the fish turning over in place about its middle
     *  (PITCH_PIVOT), not travel. */
    this.turnVelocity = [0, 0, 0];
    this.target = [-0.34, -0.23, -0.18];
    this.heading = -0.35;
    this.pitch = this.angularVelocity = this.speed = this.time = 0;
    // (The rate it is tipping at, rad/s, nose up: eased in and out.)
    this.pitchTurn = 0;
    // (Whether it is easing its fins off a thing: FIN_ROOM.)
    this.finsClearing = false;
    // How hard it works its fins to hold or shift station at hover or slow speed (0..1): for the
    // pectorals' beat (the gait's hold).
    this.hold = 0;
    // The C it is curling into as it comes round (curl, -1..1, + to its left: CURL_*), for the body and
    // its fins; the deepest of this C, and the heading it began from (for the stroke out of it).
    this.curl = this.curlMost = 0; this.curlFrom = 0;
    // (The time since it touched down to lie, and whether it had.)
    this.settleClock = 9; this.wasSettled = false;
    // (Lying down: the heading it settled at; the shift it is making against what it lies on (yaw, pitch,
    // rad), the pitch shifted so far, and the time to the next shift (s).)
    this.restHeading = 0; this.restYaw = this.restPitch = this.restPitchNow = 0; this.restShiftClock = 0;
    // (How long it has hung in the water this time, s.)
    this.hoverClock = 0;
    this.steerRate = this.roll = this.rollRate = this.pitchRate = 0;
    this.sharpTurn = false;
    this.yawAccum = 0;
    this.spinBreaks = 0;
    this.waterSpin = [0, 0, 0];
    this.drive = 0.045;
    this.mode = 'cruise';
    this.timer = 7;
    this.cruiseSpeed = 0.12;
    // (How tight this leg's turns are: the radius of the arc it swims them round, units.)
    this.turnRadius = 0.08;
    this.drift = [0, 0, 0];
    this.initialized = false;
    // The phases of its small, never-repeating corrections (wander): from the seed, not drawn from a
    // stream, so they change nothing else.
    this.phases = Array.from({ length: 8 }, (_, k) => 2 * Math.PI * ((Math.imul(seed ^ (0x27d4eb2d * (k + 1)), 0x165667b1) >>> 0) / 4294967296));
    // Hovering: the heading it is slowly coming round to, and how fast (rad/s).
    this.hoverYaw = this.heading; this.hoverPivot = 0.3;
    // How busy it has been of late (0..1): it breathes the more often.
    this.activity = 0;
    // Own random stream so the trips never perturb the swimming route.
    this.gulpSeed = (seed ^ 0x9e3779b9) >>> 0;
    this.behaviorSeed = (seed ^ 0x85ebca6b) >>> 0;
    // Hanging in the water, its small corrections (trims): their own stream; the time to the next;
    // the pitch and roll it is trimming to (rad), the yaw it kicks round by and the nudge forward it
    // gives itself (rad/s, units/s) for the TRIM_KICK s after each; and how hard it is backing up on
    // its pectorals (0..1).
    this.trimSeed = (seed ^ 0xc2b2ae35) >>> 0;
    this.trimClock = 0;
    this.trimPitch = this.trimRoll = this.trimYaw = this.trimNudge = this.trimKick = 0;
    this.backing = 0;
    // Its strokes, each the visible cause of a move (taken by the host's gait, by their counts: cue):
    // its pectorals' beats (pushes, pushSize 0..1) and its tail's single sweeps (kicks, kickSize: signed,
    // the side it sweeps to); the time since the last; the turn its last stroke at hover, or coming
    // round from all but a standstill otherwise, left it making (rad/s, slowing).
    this.pushes = this.kicks = 0;
    this.pushSize = this.kickSize = 0;
    this.kickSweeps = 1;
    this.cueClock = 9;
    this.yawStroke = this.turnStroke = 0;
    // (The time since a stroke that sets off a move, which waits leadTime s on it; which way round it
    // is committed to coming, in a turn far round: -1, 1, or 0 for none.)
    this.leadClock = 9; this.leadTime = STROKE_LEAD;
    this.turnSide = 0;
    // (The speed it last meant to swim at, units/s.)
    this.intent = 0;
    // Darting (0..1: fins folded, beating hard) and braking (0..1: pectorals fanned): the time since
    // each began; whether it is to dart once it faces the way it is going; how fast it darts; whether
    // this pass is to end in a hard stop; when it lunges from this hover (s, its clock).
    this.dart = this.brake = 0;
    this.dartClock = this.brakeClock = 9;
    this.dartReady = false; this.dartSpeed = DART_SPEED;
    this.hardStop = false; this.lungeAt = Infinity; this.lunge = false; this.hoverLeft = 0;
    this.nextGulp = 22 + this.gulpRandom() * 14;
    // This trip up's own shape: how steeply it rises, how fast at most, how long its lips are at the
    // film, how long it takes to level out after; and the time since its mouth last shut on air (the
    // gill covers' pulse) and since it began going down.
    this.tripPitch = GULP_PITCH; this.risePace = 0.2; this.gulpLength = GULP_LENGTH;
    this.gillClock = 99; this.diveClock = 0;
    this.mirrorReady = 30 + this.behaviorRandom() * 25;
    this.lapReady = 70 + this.behaviorRandom() * 40;
    this.restReady = 50 + this.behaviorRandom() * 35;
    this.behaviorClock = this.holdClock = 0;
    this.flaring = false;
    // (How long it has hung at the glass facing its reflection (s); after a startle, from when it may flare
    // at what startled it and by when (s, its clock; -1 none), whether it is, and until when.)
    this.mirrorLook = 0;
    this.flareFrom = this.flareBy = this.flareUntil = -1; this.flaringAfter = false;
    this.mirrorPoint = [0, 0, 0];
    this.mirrorFace = 0; this.mirrorSide = 1; this.mirrorHold = 5; this.mirrorArrived = false;
    this.lapDir = 1; this.lapY = 0; this.lapAngle = this.lapTravelled = 0; this.lapLength = 2 * Math.PI;
    // (The furthest round it has come this lap, and when: a lap that gets no further round, kept back by
    // something in its way, it gives up.)
    this.lapBest = this.lapBestAt = 0;
    this.restY = 0; this.restHold = 8; this.restSettled = false; this.restBest = Infinity; this.restBestAt = 0;
    // (A place on the furnishings it is going to lie on, or null for the sand: findPerch.)
    this.perch = null;
    this.gulpClock = 0;
    this.gulp = this.gulpGill = 0;
    this.surfaceY = NaN;
    // The water the fish has got used to, to tell a sudden shove from a steady current or spin.
    this.flowRef = this.spinRef = null;
    this.jolt = 0;
    this.joltVector = [0, 0, 0];
    this.startleReady = 4;
    this.startleClock = 0;
    this.startleHeading = 0;
    this.startleDive = false;
    // Food (set by the host before each step: Betta.ts from FishFood): the pellet it is after (sim
    // frame) or null, and how wide its mouth is to open for it (0..1).
    this.food = null;
    this.gape = 0;
    this.feedHold = 0;
    this.feedRetry = 0;
    // (How long it has looked up at a pellet on the film from under it, and is to; the time into its
    // snap at one, or -1.)
    this.feedAim = 0; this.feedLook = FEED_LOOK;
    this.snapClock = -1;
    // What else is in the water (set by the host: the betta bowl's driftwood and plant), to keep
    // clear of: capsules { a, b, r }, sim frame.
    this.obstacles = [];
    // How much it has to do at the film (set by the host: the betta bowl's nest wanting rebuilding,
    // 0..1): it goes up for air sooner after each trip.
    this.gulpUrge = 0;
    // What the water is doing to it (set by the host: water/effects.ts, 0 in clear water): how
    // listless it is (lethargy) and how short of air (gasp).
    this.lethargy = 0;
    this.gasp = 0;
    // (When the wait for the next trip began; the gulps it has taken, and has still to take at the
    // film this trip; which side it lies over on as it rests.)
    this.gulpFrom = 0;
    this.gulps = 0;
    this.gulpsLeft = 0;
    this.restSide = 1;
  }

  /** How readily, listless, it goes down to lie, and how much it lets itself sink there rather than
   *  swim down (0..1: all of it from half way listless on). */
  get slump() {
    return Math.min(1, 2 * this.lethargy);
  }

  /** When it goes up for air next: sooner the shorter of air it is. */
  gulpDue() {
    return this.gasp > 0 ? this.gulpFrom + (this.nextGulp - this.gulpFrom) / (1 + (GASP_OFTEN - 1) * clamp(this.gasp, 0, 1)) : this.nextGulp;
  }

  /** Carried round as the bowl is turned about its own axis (turn: the turn this frame, rad, along
   *  that axis, sim frame): it keeps its place among the furnishings, as if the hand that turned the
   *  bowl had moved it with them. Where it is and is going, where it means to display, and the ways
   *  it faces turn with them; the water keeps its own motion, as the sim has it. */
  turnWith(turn) {
    for (const p of [this.position, this.velocity, this.target, this.mirrorPoint]) turnPoints(p, turn);
    if (this.perch) { turnPoints(this.perch.at, turn); turnPoints(this.perch.approach, turn); }
    // (Headings face along (-cos, sin) in x, z: a turn about the vertical adds to them; a bearing
    // round the axis, atan2(z, x), takes it away.)
    const yaw = turn[1];
    this.heading = wrap(this.heading + yaw);
    this.hoverYaw = wrap(this.hoverYaw + yaw);
    if (this.perch) this.perch.heading = wrap(this.perch.heading + yaw);
    this.mirrorFace = wrap(this.mirrorFace + yaw);
    this.startleHeading = wrap(this.startleHeading + yaw);
    this.lapAngle = wrap(this.lapAngle - yaw);
  }

  /** How far p is outside the nearest obstacle (Infinity with none), and the way out from it. */
  obstacleGap(p) {
    let gap = Infinity, away = [0, 0, 0];
    for (const o of this.obstacles) {
      const q = nearestOn(p, o.a, o.b);
      const d = [p[0] - q[0], p[1] - q[1], p[2] - q[2]], l = Math.hypot(...d);
      if (l - o.r < gap) { gap = l - o.r; away = l > 1e-9 ? d.map(v => v / l) : [0, 1, 0]; }
    }
    return { gap, away };
  }

  /** How far its long fins (FIN_REACH, for a neck at p facing along heading and pitch), and its body
   *  (BODY_REACH), are off the furnishings' solid parts (Infinity with none), and the way off from the nearest. */
  finGap(p, heading, pitch) {
    let gap = Infinity, away = [0, 1, 0];
    const ch = Math.cos(heading), sh = Math.sin(heading), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (const [back, down] of FIN_REACH) {
      const q = [p[0] + ch * cp * back - ch * sp * down, p[1] - sp * back - cp * down, p[2] - sh * cp * back + sh * sp * down];
      for (const o of this.obstacles) {
        // (The room its fins keep round a thing: its whole surface, fin, or its solid part.)
        const room = o.fin ?? o.solid;
        if (!(room > 0)) continue;
        const c = nearestOn(q, o.a, o.b), d = [q[0] - c[0], q[1] - c[1], q[2] - c[2]], l = Math.hypot(...d);
        if (l - room < gap) { gap = l - room; away = l > 1e-9 ? d.map(v => v / l) : [0, 1, 0]; }
      }
    }
    for (const [back, down, skin] of BODY_REACH) {
      const q = [p[0] + ch * cp * back - ch * sp * down, p[1] - sp * back - cp * down, p[2] - sh * cp * back + sh * sp * down];
      for (const o of this.obstacles) {
        const room = o.fin > 0 ? o.fin - BODY_IN : o.solid;
        if (!(room > 0)) continue;
        const c = nearestOn(q, o.a, o.b), d = [q[0] - c[0], q[1] - c[1], q[2] - c[2]], l = Math.hypot(...d);
        if (l - room - skin < gap) { gap = l - room - skin; away = l > 1e-9 ? d.map(v => v / l) : [0, 1, 0]; }
      }
    }
    return { gap, away };
  }

  /** The straight way from here to p keeps `margin` clear of every obstacle. */
  clearWay(p, margin) {
    if (!this.obstacles.length) return true;
    for (let k = 1; k <= 6; k++) {
      const t = k / 6;
      if (this.obstacleGap(this.position.map((v, i) => v + (p[i] - v) * t)).gap < margin) return false;
    }
    return true;
  }

  /** How sharply the water just changed, against what it has been doing for the last second. */
  readJolt(dt, water, wet) {
    const flow = water?.flow, spin = water?.angular;
    if (!flow || !spin || wet < 0.9) { this.flowRef = this.spinRef = null; this.joltVector = [0, 0, 0]; return 0; }
    if (!this.flowRef) { this.flowRef = [...flow]; this.spinRef = [...spin]; }
    const push = flow.map((v, k) => v - this.flowRef[k]);
    const twist = Math.hypot(...spin.map((v, k) => v - this.spinRef[k]));
    const follow = 1 - Math.exp(-1.5 * dt);
    for (let k = 0; k < 3; k++) { this.flowRef[k] += push[k] * follow; this.spinRef[k] += (spin[k] - this.spinRef[k]) * follow; }
    this.joltVector = push;
    return Math.max(Math.hypot(...push), 0.5 * twist);
  }

  /** C-start: bend away from the knock, then dart off along the new heading. */
  startStartle(env) {
    this.closeBehavior();
    const b = this.bounds(env), [px, py, pz] = this.joltVector;
    const along = Math.hypot(px, pz) > 0.3 * Math.hypot(px, py, pz);
    let turn = wrap((along ? Math.atan2(pz, -px) : this.heading + (this.random() < 0.5 ? -1.4 : 1.4)) - this.heading);
    if (Math.abs(turn) < 0.8) turn = (turn < 0 ? -1 : 1) * 0.8;
    turn = clamp(turn, -2.6, 2.6);
    // Keep the dart clear of the glass and of the wood and the plants: an arbitrary swing to the glass
    // side goes the other way, then it tries the other headings around the choice.
    const clear = h => {
      const end = [this.position[0] - Math.cos(h) * 0.32, this.position[1], this.position[2] + Math.sin(h) * 0.32];
      return Math.hypot(...end) <= b.radius && this.clearWay(end, 0);
    };
    if (!along && !clear(this.heading + turn)) turn = -turn;
    let chosen = null;
    // (Whichever way it goes, it whips round well off its heading: a C-start, never a flinch.)
    for (const offset of [0, 0.45, -0.45, 0.9, -0.9, 1.35, -1.35]) {
      if (Math.abs(turn + offset) < 0.7) continue;
      const h = this.heading + turn + offset;
      if (clear(h)) { chosen = h; break; }
    }
    this.startleHeading = wrap(chosen ?? Math.atan2(-this.position[2], this.position[0]));
    this.startleDive = Number.isFinite(this.surfaceY) && this.surfaceY - this.position[1] < 0.1;
    this.mode = 'startle'; this.startleClock = 0; this.timer = 99; this.sharpTurn = false;
    this.startleReady = this.time + STARTLE_COOLDOWN;
    this.nextGulp = Math.max(this.nextGulp, this.time + 30 + this.gulpRandom() * 30);
  }

  /** A slow, smooth wander in -1..1 (channel k, `rate` times as quick): three incommensurate waves,
   *  phased by the seed, so its small corrections never repeat and are the same at any frame rate. */
  wander(k, rate = 1) {
    const p = this.phases[k], t = this.time * rate;
    return (Math.sin(0.83 * t + p) + 0.6 * Math.sin(1.91 * t + 2.3 * p) + 0.35 * Math.sin(3.37 * t + 4.1 * p)) / 1.95;
  }

  /** How fast wander(k, rate) is changing (1/s). */
  wanderRate(k, rate = 1) {
    const p = this.phases[k], t = this.time * rate;
    return rate * (0.83 * Math.cos(0.83 * t + p) + 0.6 * 1.91 * Math.cos(1.91 * t + 2.3 * p) + 0.35 * 3.37 * Math.cos(3.37 * t + 4.1 * p)) / 1.95;
  }

  streamRandom(key) {
    const keep = this.seed;
    this.seed = this[key];
    const value = this.random();
    this[key] = this.seed;
    this.seed = keep;
    return value;
  }

  gulpRandom() { return this.streamRandom('gulpSeed'); }
  behaviorRandom() { return this.streamRandom('behaviorSeed'); }
  trimRandom() { return this.streamRandom('trimSeed'); }

  /** Hanging in the water it keeps trimming itself, as a real one does: every second or two a small
   *  correction (a nod, a lean, a touch of yaw, a nudge forward on a stroke of its pectorals), each
   *  eased in, rather than holding one smooth drift. */
  advanceTrim(dt, hovering) {
    this.trimKick = Math.max(0, this.trimKick - dt);
    if (!hovering) { this.trimClock = 0; this.trimPitch = this.trimRoll = this.trimKick = 0; return; }
    this.trimClock -= dt;
    if (this.trimClock > 0) return;
    this.trimClock = 0.7 + 1.8 * this.trimRandom();
    this.trimPitch = TRIM_PITCH * (2 * this.trimRandom() - 1);
    this.trimRoll = TRIM_ROLL * (2 * this.trimRandom() - 1);
    this.trimYaw = TRIM_YAW * (2 * this.trimRandom() - 1);
    this.trimNudge = TRIM_NUDGE * this.trimRandom();
    this.trimKick = TRIM_KICK;
    // (Each trim on a beat of the pectorals: the yaw's a small stroke round, as at hover.)
    this.yawStroke += 1.5 * this.trimYaw;
    this.cue(0.35 + 0.5 * Math.max(Math.abs(this.trimYaw) / TRIM_YAW, this.trimNudge / TRIM_NUDGE), 0, 1);
  }

  /** A stroke: a beat of the pectorals (push, 0..1; as it comes round, the outer one the harder) and,
   *  if kick, a sweep of the tail (its size, 0..1, to `side`; sweeps 2: and back across to the other),
   *  taken by the host's gait. lead: it sets off a move, which waits on it that long (s), or 0. after:
   *  it ends a move rather than begins one, and the strokes to come keep their own time (cueClock). */
  cue(push, kick, side, sweeps = 1, lead = 0, after = false) {
    if (push > 0) { this.pushes++; this.pushSize = Math.min(1, push); }
    if (kick > 0) { this.kicks++; this.kickSize = Math.min(1, kick) * (side < 0 ? -1 : 1); this.kickSweeps = sweeps; }
    if (!after) this.cueClock = 0;
    if (lead) { this.leadClock = 0; this.leadTime = lead; }
  }

  /** Only a measured, wet fish in an upright globe takes part in these. */
  behaviorOk(water, wet, upright) {
    return !!water && upright && wet > 0.99 && (water.airAbove ?? 0) < 0.1 && Number.isFinite(water.sand);
  }

  /** Near the glass at the end of a leg, it stops to face its reflection with the fins flared. */
  tryMirror(b, ok) {
    if (!ok || this.lethargy >= LISTLESS || this.time < this.mirrorReady) return false;
    const [x, y, z] = this.position, horizontal = Math.hypot(x, z);
    const reach = Math.sqrt(Math.max(0, (b.radius + MIRROR_REACH) ** 2 - y * y));
    // (Not carried high or low out of its own water: it displays where it swims.)
    if (horizontal < 0.5 * reach || reach - horizontal > 0.3 || y > b.high + 0.05 || y < b.low - 0.05) return false;
    const nx = x / horizontal, nz = z / horizontal;
    if (nx * -Math.cos(this.heading) + nz * Math.sin(this.heading) < 0) return false;
    if (!this.clearWay([nx * reach, y, nz * reach], 0.05)) return false;
    if (this.behaviorRandom() > 0.6 * (1 - this.lethargy / LISTLESS)) return false;
    this.mode = 'mirror'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = this.holdClock = 0; this.mirrorArrived = false;
    this.mirrorPoint = [nx * reach, y, nz * reach];
    this.mirrorFace = Math.atan2(nz, -nx);
    this.mirrorSide = this.behaviorRandom() < 0.5 ? -1 : 1;
    this.mirrorHold = DISPLAY_HOLD * (1 + this.behaviorRandom() * 0.8);
    return true;
  }

  /** A slow circuit of the globe, as a fish makes of a place it is still getting to know. */
  tryLap(b, ok) {
    if (!ok || this.lethargy >= LISTLESS || this.time < this.lapReady) return false;
    const [x, y, z] = this.position;
    if (Math.hypot(x, z) < 0.2 || this.behaviorRandom() > 0.5 * (1 - this.lethargy / LISTLESS)) return false;
    this.mode = 'lap'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = 0; this.cruiseSpeed = LAP_SPEED;
    this.lapDir = this.behaviorRandom() < 0.5 ? -1 : 1;
    this.lapLength = Math.PI * (1.5 + this.behaviorRandom());
    this.lapY = clamp(y, b.low + 0.02, b.high - 0.04);
    this.lapAngle = Math.atan2(z, x); this.lapTravelled = 0;
    this.lapBest = 0; this.lapBestAt = this.time;
    return true;
  }

  /** Now and then it sinks to the sand and stays there, fins easy, when it is over a place to lie;
   *  listless, it may go down besides (slumpDown). */
  tryRest(b, water, ok) {
    if (!ok) return false;
    if (this.slumpDown(b, water, ok)) return true;
    const y = water.sand + REST_HEIGHT;
    if (this.time < this.restReady) return false;
    // (About as often on the furnishings as on the sand, as bettas do, when there is one in reach.)
    const perch = this.behaviorRandom() < 0.5 ? this.findPerch(b, water) : null;
    if (perch) return this.lieDown(perch.at[1], perch);
    // (Listless, the readier to: it hangs about longer between its chances.)
    if (!this.restRoom(b, this.position[0], y, this.position[2]) || this.behaviorRandom() > 0.5 * (1 + this.slump)) return false;
    if (this.obstacleGap([this.position[0], y, this.position[2]]).gap < 0.1) return false;
    return this.lieDown(y);
  }

  /** Whether the neck at p is out of every obstacle's core (as the route holds it) and off every
   *  solid part by `lift` or more. */
  perchClear(p, lift) {
    return this.obstacles.every((o) => {
      const q = nearestOn(p, o.a, o.b), l = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
      return l >= 0.6 * o.r + 0.01 && l >= (o.solid ?? 0) + lift - 0.004;
    });
  }

  /** The nearest place within reach on the furnishings to lie on: the top of the middle of a solid
   *  part lying near level, which it can come at from behind and above along it with nothing in the
   *  way; null if there is none. */
  findPerch(b, water) {
    let best = null, nearest = 0.5;
    const [x0, , z0] = this.position;
    for (const o of this.obstacles) {
      if (!((o.solid ?? 0) >= PERCH_SOLID)) continue;
      const ab = [o.b[0] - o.a[0], o.b[1] - o.a[1], o.b[2] - o.a[2]], plan = Math.hypot(ab[0], ab[2]);
      if (plan < 1e-6 || Math.abs(ab[1]) > PERCH_SLOPE * plan) continue;
      const at = [o.a[0] + ab[0] / 2, o.a[1] + ab[1] / 2 + o.solid + PERCH_LIFT, o.a[2] + ab[2] / 2];
      const d = Math.hypot(at[0] - x0, at[2] - z0);
      if (d >= nearest || d < 0.12 || at[1] > b.high || at[1] < water.sand + REST_HEIGHT || Math.hypot(...at) > b.radius) continue;
      // (Along it the way it is going: it comes at it from its own side.)
      const s = (at[0] - x0) * ab[0] + (at[2] - z0) * ab[2] < 0 ? -1 : 1, dx = s * ab[0] / plan, dz = s * ab[2] / plan;
      const approach = [at[0] - dx * PERCH_BACK, at[1] + PERCH_ABOVE, at[2] - dz * PERCH_BACK];
      if (Math.hypot(...approach) > b.radius || !this.perchClear(at, PERCH_LIFT) || !this.perchClear(approach, PERCH_LIFT) || !this.clearWay(approach, 0.04)) continue;
      best = { at, approach, heading: Math.atan2(dz, -dx), pitch: Math.atan2(s * ab[1], plan), near: false, nearAt: 0 };
      nearest = d;
    }
    return best;
  }

  /** Listless, whenever it stops it may go down to lie, the likelier the more listless it is
   *  (slump), if it can from where it is: its way down, and where that ends, clear. */
  slumpDown(b, water, ok) {
    if (!ok || !(this.lethargy > 0) || this.behaviorRandom() >= this.slump) return false;
    const y = water.sand + REST_HEIGHT;
    return !!this.restLanding(b, this.position, this.heading, y) && this.lieDown(y);
  }

  /** Goes down to lie on the sand (the neck at y), or on a furnishing (perch: findPerch), for a while:
   *  many seconds, longer listless, and leaning over. */
  lieDown(y, perch = null) {
    this.mode = 'rest'; this.timer = 99; this.sharpTurn = false;
    this.behaviorClock = this.holdClock = 0; this.restSettled = false;
    this.perch = perch;
    this.restY = y; this.restHold = (9 + this.behaviorRandom() * 12) * (1 + (REST_LONGER - 1) * this.lethargy);
    // (How near it has come to its place, and when it last came nearer: REST_STUCK.)
    this.restBest = Infinity; this.restBestAt = 0;
    if (this.lethargy > 0) this.restSide = this.behaviorRandom() < 0.5 ? -1 : 1;
    return true;
  }

  /** Whether the neck has room to come to rest at (x, y, z) on the sand: clear of the glass (by
   *  less, the more listless it is: such a fish lies down anywhere it can). */
  restRoom(b, x, y, z) {
    return Math.hypot(x, z, y) <= b.radius + 0.02 + 0.06 * this.lethargy;
  }

  /** Swimming down to lie, how steeply nose down it goes `height` over where it lies (rad): steeply
   *  at first, gliding in flatter as it nears. */
  descentPitch(height) {
    return Math.min(0.75, 0.08 + 5 * height);
  }

  /** Going down to lie from `height` above where it settles, how far on it goes in each sixth of
   *  the height (nose low at first, levelling off as it arrives, as `sinking` steps it; listless,
   *  letting itself sink, less far: no further than this). */
  restRun(height) {
    const du = (height - 0.004) / 6;
    return Array.from({ length: 6 }, (_, k) => (du > 0 ? (du / Math.tan(this.descentPitch(height - (k + 0.5) * du))) * (1 - SAG_STILL * this.slump) : 0));
  }

  /** Where it comes to lie (on the sand, the neck at y) going down from p with this heading; null
   *  if that, or the way there, is not clear (listless, it lies down right by things, or against
   *  them: clear only of their solid parts). */
  restLanding(b, p, heading, y) {
    const fx = -Math.cos(heading), fz = Math.sin(heading), q = [p[0], p[1], p[2]], runs = this.restRun(p[1] - y), near = 0.12 * this.lethargy;
    for (const run of runs) {
      q[0] += fx * run; q[1] -= (p[1] - y - 0.004) / 6; q[2] += fz * run;
      if (this.obstacleGap(q).gap < 0.05 - near) return null;
    }
    q[1] = y;
    return this.restRoom(b, q[0], y, q[2]) && this.obstacleGap(q).gap >= 0.1 - near ? q : null;
  }

  /** Listless and not where it can lie down, now and then it makes for a place to: the nearest of a
   *  few on the sand round about that it can come down to, swimming slowly to where it would go
   *  down from, a little lower than it is (there, stopping, it goes down). */
  seekRest(b, water, ok) {
    if (!ok || this.behaviorRandom() >= this.slump) return false;
    const y = water.sand + REST_HEIGHT, [x0, y0, z0] = this.position, from = clamp(y0 - 0.08, b.low, b.high);
    let best = null, nearest = Infinity;
    for (let k = 0; k < 12; k++) {
      const r = 0.45 * Math.sqrt(this.behaviorRandom()), a = 2 * Math.PI * this.behaviorRandom();
      const x = r * Math.cos(a), z = r * Math.sin(a), d = Math.hypot(x - x0, z - z0);
      if (d >= nearest || !this.restRoom(b, x, y, z) || this.obstacleGap([x, y, z]).gap < 0.1 - 0.12 * this.lethargy) continue;
      // (Coming at it from here, where it would go down from: short of it by its way down.)
      const heading = Math.atan2(z - z0, -(x - x0)), run = this.restRun(from - y).reduce((a, v) => a + v, 0);
      if (d < run + 0.15) continue;
      const start = [x - (x - x0) / d * run, from, z - (z - z0) / d * run];
      if (Math.hypot(start[0], start[2]) > Math.sqrt(Math.max(0, b.radius ** 2 - from * from)) || !this.clearWay(start, 0.06) || !this.restLanding(b, start, heading, y)) continue;
      best = start; nearest = d;
    }
    if (!best) return false;
    this.mode = 'cruise'; this.timer = 15; this.sharpTurn = false;
    this.target = best;
    this.cruiseSpeed = 0.06 * (1 - 0.55 * this.lethargy);
    return true;
  }

  lapGoal(b) {
    const y = this.lapY + 0.035 * Math.sin(2 * Math.PI * this.behaviorClock / 11);
    const rho = LAP_RADIUS * Math.sqrt(Math.max(0, b.radius ** 2 - y * y));
    const a = Math.atan2(this.position[2], this.position[0]) + this.lapDir * LAP_LEAD;
    return [rho * Math.cos(a), y, rho * Math.sin(a)];
  }

  /** Clocks and arrivals for the running episode; ends it when it is done or the water no longer allows it. */
  stepBehavior(dt, env, water, wet, upright) {
    if (!this.behaviorOk(water, wet, upright)) { this.endBehavior(env); return; }
    this.behaviorClock += dt;
    const [x, y, z] = this.position;
    if (this.mode === 'mirror') {
      const d = Math.hypot(...this.mirrorPoint.map((v, k) => v - this.position[k]));
      // (It flares once it is at its reflection and facing it, for a short bout from then: DISPLAY_*.)
      if (!this.mirrorArrived && d < 0.05) { this.mirrorArrived = true; this.holdClock = 0; }
      if (!this.flaring && d < DISPLAY_NEAR && this.mirrorLook >= DISPLAY_LOOK) { this.flaring = true; this.holdClock = 0; }
      if (this.flaring) this.holdClock += dt;
      if ((this.mirrorArrived && this.holdClock >= this.mirrorHold) || this.behaviorClock > 16) this.endBehavior(env);
    } else if (this.mode === 'lap') {
      const theta = Math.atan2(z, x);
      this.lapTravelled += this.lapDir * wrap(theta - this.lapAngle);
      this.lapAngle = theta;
      if (this.lapTravelled > this.lapBest + 0.15) { this.lapBest = this.lapTravelled; this.lapBestAt = this.time; }
      if (this.lapTravelled >= this.lapLength || this.behaviorClock > 90 || this.time - this.lapBestAt > 8) this.endBehavior(env);
    } else if (this.mode === 'rest') {
      const perch = this.perch;
      if (!perch) this.restY = water.sand + REST_HEIGHT;
      // (Down on it; or, on the sand, given up waiting for that. One it cannot get to on the
      // furnishings, it gives up.)
      // (On a furnishing, near enough: its body, held off the wood, may keep it a little short.)
      // (Gliding down onto its place on the wood, it is down within 0.035 of it; or, once it has been at
      // it PERCH_SETTLE s, within PERCH_CLOSE of it at its height: the wood is wide enough there to lie on.)
      const off = perch ? Math.hypot(x - perch.at[0], y - perch.at[1], z - perch.at[2]) : 0;
      const down = perch ? perch.near && (off < 0.035 || (this.behaviorClock - perch.nearAt > PERCH_SETTLE && off < PERCH_CLOSE && Math.abs(y - perch.at[1]) < 0.025)) : y - this.restY < 0.004;
      // (Given up waiting only once all but down, or no longer getting lower: sinking slowly from high,
      // listless, it goes on down.)
      if (!this.restSettled && (down || (!perch && this.behaviorClock > 20 && (y - this.restY < 0.012 || Math.abs(this.velocity[1]) < 0.002)))) { this.restSettled = true; this.holdClock = 0; }
      // (Getting no nearer its place for REST_STUCK s, held off by something in its way, or circling it: on
      // the sand, all but down, it lies where it is; otherwise it gives that place up, for the sand under
      // it if it can lie there, or for another time.)
      // (Its place: on the wood, the point behind and above it it comes in from, then the place itself.)
      const left = perch ? (perch.near ? off : Math.hypot(x - perch.approach[0], y - perch.approach[1], z - perch.approach[2])) : y - this.restY;
      if (left < this.restBest - 0.005) { this.restBest = left; this.restBestAt = this.behaviorClock; }
      if (!this.restSettled && this.behaviorClock - this.restBestAt > REST_STUCK) {
        if (!perch && left < 0.03) { this.restSettled = true; this.holdClock = 0; }
        else {
          const sand = water.sand + REST_HEIGHT, b = this.bounds(env);
          if (perch && this.restRoom(b, x, sand, z) && this.restLanding(b, this.position, this.heading, sand)) { this.lieDown(sand); this.restBest = Infinity; this.restBestAt = 0; }
          else { this.endBehavior(env); return; }
        }
      }
      if (!this.restSettled && perch && this.behaviorClock > 20) { this.endBehavior(env); return; }
      if (this.restSettled) this.holdClock += dt;
      if ((this.restSettled && this.holdClock >= this.restHold) || this.behaviorClock > 40 * (1 + (REST_LONGER - 1) * this.lethargy)) this.endBehavior(env);
    }
  }

  /** Stops a running episode where it stands: cooldown for next time, fins relaxed. */
  closeBehavior() {
    if (!BEHAVIORS.has(this.mode)) return;
    const wait = this.behaviorRandom();
    if (this.mode === 'mirror') this.mirrorReady = this.time + 60 + wait * 60;
    else if (this.mode === 'lap') this.lapReady = this.time + 120 + wait * 80;
    else this.restReady = this.time + 90 + wait * 70 - 0.6 * this.lethargy * (90 + wait * 70);
    this.mirrorReady = Math.max(this.mirrorReady, this.time + 15);
    this.lapReady = Math.max(this.lapReady, this.time + 20);
    this.restReady = Math.max(this.restReady, this.time + 20);
    this.flaring = false; this.mirrorArrived = false; this.mirrorLook = 0; this.perch = null;
  }

  endBehavior(env) {
    this.closeBehavior();
    this.mode = 'glide'; this.timer = 1.1 + this.random() * 0.8; this.sharpTurn = false;
    this.chooseTarget(env);
  }

  random() {
    this.seed = (this.seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this.seed ^ this.seed >>> 15, 1 | this.seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  bounds(env) {
    const low = env.sandLevel + 0.22, high = env.level - 0.20;
    return { radius: Math.max(0.1, env.radius - 0.34), low: Math.min(low, high), high };
  }

  chooseTarget(env) {
    const b = this.bounds(env);
    // Usually investigate water ahead, as the koi does; an occasional reversal
    // is deliberate, not a fresh arbitrary spin at every waypoint.
    const reverse = this.random() < 0.18;
    // (Listless, it goes less far, and keeps low over the middle, where the sand is to lie on.)
    const L = this.lethargy, stride = 0.45 * (1 - 0.45 * L);
    let best = -Infinity, found = false;
    for (let attempt = 0; attempt < 16; attempt++) {
      const y = b.low + (b.high - b.low) * (0.08 + 0.84 * this.random());
      const r = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * Math.sqrt(this.random()) * 0.86;
      const a = this.random() * Math.PI * 2;
      const candidate = [r * Math.cos(a), y, r * Math.sin(a)];
      const delta = candidate.map((v, i) => v - this.position[i]), distance = Math.hypot(...delta);
      const ahead = (-delta[0] * Math.cos(this.heading) + delta[2] * Math.sin(this.heading)) / Math.max(distance, 1e-6);
      let score = ahead * (reverse ? -0.7 : 0.8) + this.random() * 0.45 - Math.abs(distance - stride) - (distance < 0.22 ? 2 : 0);
      if (L > 0) score -= L * (1.5 * (y - b.low) / Math.max(b.high - b.low, 1e-6) + 3 * Math.max(0, r - 0.22));
      // (Come a long way round one way of late, it would rather not go on round that way again.)
      const round = wrap(Math.atan2(delta[2], -delta[0]) - this.heading);
      if (round * this.yawAccum > 0) score -= Math.abs(round) * smooth(1.5, 3, Math.abs(this.yawAccum));
      // A goal almost overhead or underfoot cannot be reached by turning; it only makes the fish circle it.
      const leg = Math.hypot(delta[0], delta[2]);
      if (leg < MIN_LEG || Math.abs(delta[1]) > MAX_SLOPE * leg + 0.05) continue;
      if (!this.clearWay(candidate, 0.06)) continue;
      // (Nor where it would hang with its fins on a thing.)
      if (this.finGap(candidate, Math.atan2(delta[2], -delta[0]), 0).gap < 2 * FIN_ROOM) continue;
      if (score > best) { best = score; this.target = candidate; found = true; }
    }
    if (!found) this.target = this.targetAhead(b, 0.4);
    // (A pass of a third to two thirds of a body length a second, its pace rising and falling as it
    // strokes and glides: surge; and its own turning circle.)
    this.cruiseSpeed = (0.1 + this.random() * 0.09) * (1 - 0.55 * L);
    this.turnRadius = 0.05 + 0.06 * this.random();
    // (Whether it means to stop hard at the end of this pass: it comes in at its pace, then brakes.)
    this.hardStop = this.random() < HARD_STOP * (1 - L);
  }

  /** The plan for food, this step: where the neck is to go, which way the head is to turn (from
   *  the lips, and how near the pellet is to them in plan), and whether it is rising to it. One
   *  on the film it takes from below: it lines up under the film a rise's length short of the
   *  pellet (from too near, it swims out a way first), turns to it, then rises to it. */
  feedPlan(holdY, fx, fz) {
    const [x, y, z] = this.food;
    const lips = bettaMouth(this.position, this.heading, this.pitch);
    const dx = x - lips[0], dz = z - lips[2], plan = Math.hypot(dx, dz);
    const bearing = Math.atan2(dz, -dx);
    // (How near the pellet is to the lips, how far up from them, and whether it is in front of
    // them: what a snap needs.)
    const cp = Math.cos(this.pitch), to = [dx, y - lips[1], dz], reach = Math.hypot(...to), elevation = Math.atan2(to[1], plan);
    const before = (-Math.cos(this.heading) * cp * to[0] + Math.sin(this.pitch) * to[1] + Math.sin(this.heading) * cp * to[2]) > 0.75 * reach;
    if (!this.foodAtFilm()) return { goal: [x - fx * MOUTH_AHEAD, y - MOUTH_UP, z - fz * MOUTH_AHEAD], yaw: bearing, plan, reach, elevation, before, stage: 'swim' };
    const deep = this.surfaceY - MOUTH_DEPTH - lips[1];
    const facing = Math.cos(bearing - this.heading);
    const run = FEED_RISE * Math.max(0, deep - 0.01);
    // Under it: first it looks up at it a moment, then rises to it (once there, it keeps to it).
    const there = this.feedAim > 0;
    const under = this.time >= this.feedRetry && (plan < 0.03 || (facing > (there ? 0.6 : 0.85) && plan < run + (there ? 0.08 : 0.03) && plan > 0.6 * run - 0.02));
    if (under) return { goal: [x - fx * MOUTH_AHEAD, holdY, z - fz * MOUTH_AHEAD], yaw: bearing, plan, reach, elevation, before, stage: this.feedAim < this.feedLook ? 'aim' : 'rise' };
    const nx = x - this.position[0], nz = z - this.position[2], np = Math.max(Math.hypot(nx, nz), 1e-6);
    const standoff = FEED_RISE * FEED_DEPTH + MOUTH_AHEAD;
    const goal = [x - nx / np * standoff, Math.min(holdY, this.surfaceY - FEED_DEPTH), z - nz / np * standoff];
    const gx = goal[0] - this.position[0], gz = goal[2] - this.position[2];
    // (At the standoff, it turns to the pellet.)
    const yaw = Math.hypot(gx, gz) < 0.05 ? bearing : Math.atan2(gz, -gx);
    return { goal, yaw, plan: Math.max(plan, Math.hypot(gx, gz)), reach, elevation, before: false, stage: 'approach' };
  }

  foodAtFilm() {
    return !!this.food && Number.isFinite(this.surfaceY) && this.food[1] > this.surfaceY - 0.03;
  }

  /** A point straight along the current heading, kept inside the swimming volume. */
  targetAhead(b, reach) {
    let x = this.position[0] - Math.cos(this.heading) * reach, z = this.position[2] + Math.sin(this.heading) * reach;
    const y = clamp(this.position[1], b.low, b.high);
    const limit = Math.sqrt(Math.max(0, b.radius ** 2 - y * y)) * 0.86, h = Math.hypot(x, z);
    if (h > limit) { x *= limit / h; z *= limit / h; }
    return [x, y, z];
  }

  /**
   * @param {any} [water]
   * @param {number | null} [stroke] how hard the tail/pectorals are working, 0..1; null = no reading, no limit
   */
  advance(dt, flow, env, submerged = true, water = null, stroke = null) {
    if (!(dt > 0)) return;
    // Bounded substeps keep tab stalls and different display rates stable.
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-8) {
      const step = Math.min(1 / 60, remaining);
      this.step(step, flow, env, submerged, water, stroke);
      remaining -= step;
    }
  }

  /**
   * @param {any} water
   * @param {number | null} [stroke]
   */
  step(dt, flow, env, submerged, water, stroke = null) {
    const b = this.bounds(env);
    if (!this.initialized) {
      this.position[1] = clamp(this.position[1], b.low, b.high);
      this.target[1] = clamp(this.target[1], b.low, b.high);
      this.initialized = true;
    }
    this.time += dt;
    this.timer -= dt;
    this.gillClock += dt;
    this.diveClock += dt;
    this.cueClock += dt; this.dartClock += dt; this.brakeClock += dt; this.leadClock += dt; this.settleClock += dt;
    // (How busy it has been over the last minute or so: swimming hard, or displaying.)
    this.activity = damp(this.activity, this.drive > 0.12 || this.flaring ? 1 : 0, dt, 1 / 40);
    // A trip to the surface needs a measured, calm, level free surface above an
    // upright globe; without those readings (or in a tilted globe) it never starts.
    const gravity = env.gravity ?? [0, -24, 0], g = Math.hypot(...gravity);
    const surface = water?.surface;
    const upright = g > 1 && -gravity[1] > 0.985 * g;
    const surfaceOk = Number.isFinite(surface) && Math.abs(surface - env.level) < 0.04 && upright;
    if (surfaceOk) this.surfaceY = Number.isFinite(this.surfaceY) ? damp(this.surfaceY, surface, dt, 6) : surface;
    const wetNow = water?.submerged ?? (submerged ? 1 : 0);
    this.jolt = this.readJolt(dt, water, wetNow);
    // (Listless, it takes a harder knock to startle it.)
    if (this.mode !== 'startle' && this.jolt > STARTLE_JOLT * (1 + 1.5 * this.lethargy) && this.time >= this.startleReady && (water.airAbove ?? 0) < 0.6) this.startStartle(env);
    if (this.mode === 'startle') {
      this.startleClock += dt;
      if (this.startleClock >= STARTLE_LENGTH) {
        // (Now and then, it flares at what startled it, once it has stopped.)
        if (this.lethargy < LISTLESS && this.behaviorRandom() < FLARE_AFTER) {
          this.flareFrom = this.time + FLARE_WAIT * (0.7 + 0.6 * this.behaviorRandom());
          this.flareBy = this.time + FLARE_WITHIN; this.flareUntil = FLARE_BOUT * (1 + 0.5 * this.behaviorRandom());
        }
        this.mode = 'glide'; this.timer = 1.2 + this.random() * 0.8; this.sharpTurn = false;
        this.chooseTarget(env);
      }
    }
    const startling = this.mode === 'startle';
    // Food: it goes for it, from whatever it was doing (but fleeing). Once it is eaten (or gone) it
    // sinks back off the film, or swims on.
    if (this.food && !startling && this.mode !== 'feed' && wetNow > 0.9) {
      this.closeBehavior();
      this.mode = 'feed'; this.timer = 99; this.sharpTurn = false;
      this.feedAim = 0; this.feedLook = FEED_LOOK * (1 + this.random()); this.snapClock = -1;
    } else if (this.mode === 'feed' && !this.food && this.gape < 0.5) {
      const high = Number.isFinite(this.surfaceY) && this.surfaceY - this.position[1] < 0.1;
      if (high) this.startDive();
      else { this.mode = 'glide'; this.timer = 1 + this.random() * 0.6; this.chooseTarget(env); }
    }
    const feeding = this.mode === 'feed';
    let gulping = GULPING.has(this.mode);
    // Too near the film to tip up to the lips' angle: it swims on and goes when it has room.
    const due = this.gulpDue();
    if (!gulping && !feeding && this.time >= due && surfaceOk && this.surfaceY - this.position[1] > 0.07 && wetNow > 0.99 && (water.airAbove ?? 0) < 0.25 && this.mode !== 'burst' && !this.sharpTurn) {
      this.closeBehavior();
      this.mode = 'rise'; this.gulpClock = 0; this.timer = 9; gulping = true;
      // (Each trip its own: how steeply, how fast (about a second and a half up from where it is),
      // how long at the film.)
      this.tripPitch = GULP_PITCH + 0.2 * (this.gulpRandom() - 0.5);
      // (Swimming up into it, under way before it has tipped up: RISE_*.)
      this.risePace = clamp((this.surfaceY - this.position[1]) / (0.62 + 0.4 * this.gulpRandom()), 0.14, 0.38);
      this.gulpLength = GULP_LENGTH * (0.65 + 0.7 * this.gulpRandom());
    }
    if (BEHAVIORS.has(this.mode)) this.stepBehavior(dt, env, water, wetNow, upright);
    // (Touching down to lie: it settles, its pectorals fanned and beating once.)
    const settled = this.mode === 'rest' && this.restSettled;
    if (settled && !this.wasSettled) {
      this.settleClock = 0; this.brakeClock = 0; this.cue(0.6, 0, 1);
      this.restHeading = this.heading; this.restYaw = this.restPitch = 0; this.restShiftClock = REST_SHIFT * (0.8 + this.trimRandom());
    }
    this.wasSettled = settled;
    // (Lying there, now and then a small shift against what it lies on: REST_*.)
    if (settled) {
      this.restShiftClock -= dt;
      if (this.restShiftClock <= 0 && this.settleClock > SETTLE_TIME) {
        this.restShiftClock = REST_SHIFT * (1 + this.trimRandom());
        this.restYaw = REST_YAW * (2 * this.trimRandom() - 1);
        this.restPitch = REST_NOD * (2 * this.trimRandom() - 1);
        const flick = this.trimRandom() < REST_FLICK;
        this.cue(0.35 + 0.35 * this.trimRandom(), flick ? REST_FLICK_SIZE : 0, this.restYaw < 0 ? 1 : -1);
      }
    } else this.restYaw = this.restPitch = 0;
    this.restPitchNow = damp(this.restPitchNow, this.restPitch, dt, 3);
    const behaving = BEHAVIORS.has(this.mode), ok = this.behaviorOk(water, wetNow, upright);
    // An episode that a due gulp would cut short does not start (listless, it lies down for the
    // little while it has).
    const free = surfaceOk ? due - this.time : Infinity;
    const L = this.lethargy, briefly = 1 - 0.8 * L;
    // The lips' height above the neck grows with the nose-up pitch, so the target tracks it.
    const holdY = this.surfaceY - MOUTH_DEPTH - bettaMouthHeight(0, clamp(this.pitch, 0, 1.5));
    let rise = holdY - this.position[1];
    if (gulping) {
      this.gulpClock += dt;
      if (this.mode !== 'dive' && (!surfaceOk || wetNow < 0.5)) this.startDive();
      else if (this.mode === 'rise' && ((Math.abs(rise) < 0.012 && this.pitch > this.tripPitch - 0.35) || this.timer <= 0)) {
        if (Math.abs(rise) < 0.04) {
          this.mode = 'gulp'; this.gulpClock = 0; this.gulps++;
          // (Short of air, it means to stay at the film a while.)
          this.gulpsLeft = this.gasp > GASP_LINGER ? Math.round(GASP_GULPS * (this.gasp - GASP_LINGER) / (1 - GASP_LINGER) * (0.4 + 0.6 * this.gulpRandom())) : 0;
        }
        else this.startDive();
      } else if (this.mode === 'gulp' && this.gulpClock >= this.gulpLength) {
        // The mouth shut on the air, the gill covers let the old go. Lingering, it takes the next
        // after a pause, its mouth shut (the clock runs up to it).
        this.gillClock = 0;
        if (this.gulpsLeft > 0) { this.gulpsLeft--; this.gulps++; this.gulpClock = -GASP_PAUSE * (1 + this.gulpRandom()); }
        else this.startDive();
      } else if (this.mode === 'dive' && this.timer <= 0) {
        // (On down and away, swimming: coasting nose down from the dive, the tail stilled, it would
        // seem to sink rather than swim. Listless, only a little way, before it settles again.)
        this.mode = 'cruise'; this.timer = (6 + this.random() * 5) * (1 - 0.8 * clamp(this.lethargy, 0, 1));
        this.nextGulp = this.time + GULP_EVERY * (1 + 0.5 * this.gulpRandom()) * (1 - GULP_BUSY * this.activity) * (1 - 0.75 * clamp(this.gulpUrge, 0, 1));
        this.gulpFrom = this.time;
        this.chooseTarget(env);
        gulping = false;
      }
    }
    const toTarget = this.target.map((v, i) => v - this.position[i]);
    let distance = Math.hypot(...toTarget);
    // Passing over or under the goal counts as arriving: there is nothing left to turn towards. So does
    // passing it by inside its turning circle: it could only come round to it in a loop.
    const plan = Math.hypot(toTarget[0], toTarget[2]), abeam = Math.abs(wrap(Math.atan2(toTarget[2], -toTarget[0]) - this.heading)) > 1.2;
    const reached = distance < 0.075 || plan < 0.05 || (plan < 2 * this.turnRadius && abeam);
    if (!gulping && !startling && !behaving && !feeding && (this.timer <= 0 || (this.mode !== 'hover' && reached))) {
      if (this.mode === 'hover') {
        if (!this.tryLap(b, ok && free > 25) && !this.tryMirror(b, ok && free > 16) && !this.tryRest(b, water, ok && free > 30 * briefly)) {
          this.mode = this.random() < 0.18 * (1 - L) ? 'burst' : 'cruise';
          this.timer = this.mode === 'burst' ? 0.65 + this.random() * 0.45 : 6 + this.random() * 5;
          this.chooseTarget(env);
          // (Off in a dart, once it faces the way: always in a burst, often otherwise; listless, seldom.)
          this.dartReady = (this.mode === 'burst' || this.random() < DART_START) && this.random() >= L;
          this.dartSpeed = DART_SPEED * (0.8 + 0.2 * this.random());
        }
      } else if (this.mode === 'burst') {
        // (After a lunge, a short coast, and a hard stop.)
        this.mode = 'glide'; this.timer = this.lunge ? 0.35 + 0.3 * this.random() : 1.2 + this.random();
        if (this.lunge) this.hardStop = true;
      } else if (this.lunge || (!this.tryMirror(b, ok && free > 16) && !this.tryRest(b, water, ok && free > 30 * briefly) && !(L > 0 && this.seekRest(b, water, ok && free > 30 * briefly)))) {
        // (A lunge from a hover ends in that hover again.)
        // Each pass ends in a slowdown and a turn: now and then into another pass, mostly to a stop,
        // where it hangs in the water a good while, slowly coming round to look about it.
        // (One come in to stop hard stops; the others go on the more often, so as many go on as ever.)
        if (this.mode === 'cruise' && this.timer > 0 && !this.hardStop && this.random() < 0.3 / (1 - HARD_STOP) * (1 - L)) {
          this.timer = 4 + this.random() * 4;
          this.chooseTarget(env);
        } else {
          // (Back from a lunge, it hangs there for what was left of the hover.)
          this.mode = 'hover'; this.timer = this.lunge ? Math.max(1, this.hoverLeft) : (3 + this.random() * 9) * (1 + 2 * L);
          this.hoverYaw = wrap(this.heading + 3 * (this.random() - 0.5)); this.hoverPivot = 0.2 + 0.25 * this.random();
          // (Come in at a pace meant to end in a hard stop, it brakes; and now and then, hanging there,
          // it lunges at something a short way ahead.)
          if (this.hardStop && Math.abs(this.speed) > 0.05) { this.brakeClock = 0; this.cue(1, 0, 1); }
          this.lungeAt = !this.lunge && this.random() < LUNGE_OFTEN * (1 - L) ? this.time + 1.5 + this.random() * Math.max(0, this.timer - 2.5) : Infinity;
          this.hardStop = this.lunge = false;
        }
      }
    }
    // Look ahead and steer away before the body/tail reach the glass or bed.
    const fx = -Math.cos(this.heading), fz = Math.sin(this.heading);
    const look = this.position.map((v, i) => v + (i === 0 ? fx : i === 2 ? fz : 0) * (0.10 + Math.max(0, this.speed) * 0.8));
    // Facing the glass or lying on the sand is deliberate, not a near miss.
    // (Swallowing, the pellet already on its way in, it holds where it is.)
    const swallowing = feeding && !this.food;
    let feed = feeding && this.food ? this.feedPlan(holdY, fx, fz) : null;
    // Looking up at a pellet on the film from under it, before it rises to it.
    if (feed?.stage === 'aim') this.feedAim += dt;
    // Held at the film without the pellet: a miss. It drops back and comes round again.
    if (feed?.stage === 'rise' && rise < 0.006) this.feedHold += dt; else this.feedHold = 0;
    if (this.feedHold > FEED_MISS) { this.feedHold = 0; this.feedRetry = this.time + FEED_AGAIN; this.feedAim = 0; feed = this.feedPlan(holdY, fx, fz); }
    const striking = feed?.stage === 'rise', aiming = feed?.stage === 'aim';
    // The take: once the pellet is in front of its lips and near, a snap at it.
    // (Missed, it may snap again a moment later.)
    if (this.snapClock >= 0) this.snapClock = feeding && this.snapClock < SNAP_TIME + 0.4 ? this.snapClock + dt : -1;
    if (feed && this.snapClock < 0 && feed.before && feed.reach < SNAP_REACH && (feed.stage === 'swim' || striking)) this.snapClock = 0;
    const snapping = this.snapClock >= 0 && this.snapClock < SNAP_TIME;
    const climbing = this.mode === 'rise' || this.mode === 'gulp' || striking || aiming;
    // The head is deliberately at the surface during a trip, so air above it is not an emergency.
    const escaping = !climbing && (!submerged || (water?.airAbove ?? 0) > 0.25);
    // Going down to lie: on the sand, a swim down nose low, gliding in flatter as it nears; on a
    // furnishing, a swim to behind and above it, then a glide down onto it.
    const perch = this.mode === 'rest' ? this.perch : null;
    if (perch && !perch.near && Math.hypot(...perch.approach.map((v, k) => v - this.position[k])) < 0.06) { perch.near = true; perch.nearAt = this.behaviorClock; this.restBest = Infinity; this.restBestAt = this.behaviorClock; }
    const descent = this.mode === 'rest' ? this.position[1] - this.restY : 0;
    const sinking = this.mode === 'rest' && !escaping && !this.restSettled;
    // (Listless, it lets itself sink down to it, nose a little low, all but in place: SAG.)
    const sags = sinking && !perch && L > 0;
    // (Carried up out of the water it swims in, it looks for the glass about it as if at its top.)
    const roving = !gulping && !behaving;
    const nearWall = this.mode !== 'mirror' && !feeding && (this.mode !== 'rest' || sinking) && Math.hypot(look[0], roving ? Math.min(look[1], b.high) : look[1], look[2]) > b.radius;
    // (Nose for an obstacle ahead: it veers off, out from it and on round.)
    const ahead = this.obstacles.length && !escaping && this.mode !== 'rest' ? this.obstacleGap(look) : null;
    const nearThing = !!ahead && ahead.gap < 0.06 && !nearWall;
    // (Come to a stop among the wood or the plants, it eases out of them before it hangs there.)
    const among = this.mode === 'hover' && this.obstacles.length ? this.obstacleGap(this.position) : null;
    // (Its fins on or all but on a thing, it eases off it: up and away, under way or hanging there.)
    const finsFree = !escaping && !startling && !feeding && !climbing && !gulping && this.mode !== 'rest' && this.mode !== 'mirror';
    const fins = finsFree && this.obstacles.length ? this.finGap(this.position, this.heading, this.pitch) : null;
    // (Once easing off, it goes on until they are well clear.)
    const finsNear = !!fins && fins.gap < (this.finsClearing ? 2 * FIN_ROOM : FIN_ROOM) && !nearWall;
    this.finsClearing = finsNear;
    // (Hanging there with them on a thing, it does not stay: it goes on its way, its next leg chosen
    // clear of things.)
    if (finsNear && this.mode === 'hover' && this.timer > 0) this.timer = 0;
    const crowded = !!among && among.gap < 0 && !nearWall;
    let goal = this.target;
    if (feed) goal = feed.goal;
    else if (swallowing) goal = [...this.position];
    else if (climbing) goal = [this.position[0] + fx * 0.3, holdY, this.position[2] + fz * 0.3];
    else if (this.mode === 'dive') goal = [this.position[0] + fx * 0.2, clamp(this.position[1] - 0.1, b.low, b.high), this.position[2] + fz * 0.2];
    else if (this.mode === 'mirror') goal = this.mirrorPoint;
    else if (this.mode === 'lap') goal = this.lapGoal(b);
    else if (perch) goal = perch.near ? perch.at : perch.approach;
    else if (this.mode === 'rest') goal = [this.position[0] + fx * 0.3, this.restY, this.position[2] + fz * 0.3];
    if (startling) goal = [this.position[0] - Math.cos(this.startleHeading) * 0.3, this.position[1], this.position[2] + Math.sin(this.startleHeading) * 0.3];
    else if (nearWall) goal = [-this.position[0] * 0.45, clamp(this.position[1], b.low, b.high), -this.position[2] * 0.45];
    else if (nearThing) goal = [this.position[0] + ahead.away[0] * 0.3 + fx * 0.1, this.position[1] + Math.max(ahead.away[1], 0) * 0.15, this.position[2] + ahead.away[2] * 0.3 + fz * 0.1];
    else if (crowded) goal = [this.position[0] + among.away[0] * 0.2, clamp(this.position[1] + among.away[1] * 0.2, b.low, b.high), this.position[2] + among.away[2] * 0.2];
    else if (finsNear) goal = [this.position[0] + fins.away[0] * 0.2 + fx * 0.15, clamp(this.position[1] + Math.max(fins.away[1], 0.5) * 0.12, b.low, b.high), this.position[2] + fins.away[2] * 0.2 + fz * 0.15];
    if (escaping) goal = water ? [water.centroid[0], water.centroid[1] - 0.06, water.centroid[2]] : [this.position[0] * 0.6, b.low + 0.025, this.position[2] * 0.6];
    const delta = goal.map((v, i) => v - this.position[i]);
    distance = Math.hypot(...delta);
    // The bearing to a goal is meaningless once it is nearly overhead or underfoot, and chasing it is
    // what makes a fish circle: the nearer the goal is in plan, the less the heading follows it.
    let yawError = wrap(Math.atan2(delta[2], -delta[0]) - this.heading) * smooth(0.03, 0.12, Math.hypot(delta[0], delta[2]));
    // Parked at the glass it works at its reflection: head turned a little off square, swaying to and fro.
    // Going for food, the head turns as the plan says (to the pellet itself from the lips, close in).
    if (feed) yawError = wrap(feed.yaw - this.heading) * smooth(0.004, 0.02, feed.plan);
    // Gliding down onto its place on the wood, it steers for it however near (it would only circle it
    // otherwise), and right over it, lines up along the wood.
    if (perch && perch.near && !this.restSettled && goal === perch.at) {
      const plan = Math.hypot(delta[0], delta[2]), w = smooth(0.012, 0.035, plan);
      yawError = w * wrap(Math.atan2(delta[2], -delta[0]) - this.heading) + (1 - w) * wrap(perch.heading - this.heading);
    }
    const parked = this.mode === 'mirror' && this.mirrorArrived && !escaping;
    // (Flared, it turns a little off square and sways; until then it holds square on to its reflection.)
    // (Its flare all but built first, over the second it takes: then it turns.)
    if (parked) yawError = wrap(this.mirrorFace + (this.mirrorSide * 0.5 + 0.2 * Math.sin(2 * Math.PI * 0.55 * this.holdClock)) * smooth(0.8, 1.7, this.holdClock) - this.heading);
    // (Close to its reflection and facing it, still, it takes it in before it flares: DISPLAY_LOOK.)
    if (this.mode === 'mirror' && !this.flaring) {
      const near = Math.hypot(...this.mirrorPoint.map((v, k) => v - this.position[k])) < DISPLAY_NEAR;
      this.mirrorLook = near && Math.abs(wrap(this.mirrorFace - this.heading)) < 0.35 && Math.abs(this.steerRate) < DISPLAY_STILL ? this.mirrorLook + dt : 0;
    }
    // (After a startle: from when it may, once it hangs in the water, all but still and out of its turn,
    // until the bout ends, hanging there facing what it flares at; anything else it takes up (food, the
    // film, another startle, setting off) ends it.)
    if (this.flareFrom >= 0) {
      const there = this.mode === 'hover' && !escaping && !crowded;
      if (!there && (this.flaringAfter || this.time > this.flareBy || startling || feeding || gulping || BEHAVIORS.has(this.mode))) { this.flaringAfter = false; this.flareFrom = -1; }
      else if (this.flaringAfter && this.time >= this.flareUntil) { this.flaringAfter = false; this.flareFrom = -1; }
      else if (!this.flaringAfter && there && this.time >= this.flareFrom && this.time <= this.flareBy && Math.abs(this.steerRate) < DISPLAY_STILL && Math.abs(this.speed) < 0.03) {
        this.flaringAfter = true; this.flareUntil += this.time; this.timer = Math.max(this.timer, this.flareUntil - this.time + 0.8);
      }
    }
    // (Hanging in the water facing the glass, it comes round away from it, rather than swim off.)
    const hovering = this.mode === 'hover' && !escaping && !crowded;
    this.advanceTrim(dt, hovering);
    this.hoverClock = hovering ? this.hoverClock + dt : 0;
    if (hovering && this.time >= this.lungeAt) {
      this.lungeAt = Infinity;
      if (!nearWall && this.clearWay(this.targetAhead(b, 0.2), 0.06)) {
        this.hoverLeft = this.timer;
        this.mode = 'burst'; this.timer = DART_TIME + 0.1; this.lunge = true; this.target = this.targetAhead(b, 0.2);
        this.dartReady = true; this.dartSpeed = 0.75 * DART_SPEED;
      }
    }
    if (this.mode !== 'cruise' && this.mode !== 'burst') this.dartReady = false;
    if (this.mode !== 'burst' && this.mode !== 'glide') this.lunge = false;
    const kick = smooth(0, 0.15, this.trimKick);
    if (hovering && nearWall) this.hoverYaw = Math.atan2(-this.position[2], this.position[0]);
    const holding = (hovering || ((this.mode === 'gulp' || swallowing || aiming || (this.mode === 'rest' && !sinking)) && !nearWall)) && !escaping;
    const still = holding || parked;
    if (startling) this.sharpTurn = false;
    else if (holding || Math.abs(yawError) < 0.3) this.sharpTurn = false;
    else if (Math.abs(yawError) > 1.9) this.sharpTurn = true;
    // (Between strokes at hover, the turn the last one left slows; otherwise it is the turn it makes.)
    this.yawStroke = hovering ? this.yawStroke * Math.exp(-YAW_DRAG * dt) : this.steerRate;
    // (Coming round otherwise, a stroke swings it round as it builds, and slows it only once it has, or a
    // little after: a turn of the best part of a second, not a flick.)
    const built = Math.max(smooth(0.6, 0.95, Math.abs(this.steerRate) / Math.max(Math.abs(this.turnStroke), 1e-6)), smooth(STROKE_LEAD + 0.15, STROKE_LEAD + 0.4, this.cueClock));
    this.turnStroke *= Math.exp(-TURN_DRAG * built * dt);
    let wantedRate = 0, angularAcceleration = 5;
    if (startling) {
      // (The C-bend: round in a few frames, then straight.)
      wantedRate = clamp(yawError * 30, -STARTLE_WHIP, STARTLE_WHIP); angularAcceleration = 3000;
    } else if (hovering) {
      // Hanging in the water it comes round to look about it in strokes (YAW_*), never quite still.
      // (hoverPivot: how readily it comes round this time; none, it stays as it is turned.)
      const want = wrap(this.hoverYaw - this.heading), most = YAW_PEAK * Math.min(1, this.hoverPivot / 0.2);
      // (Flaring at a thing, it holds square on to it.)
      if (this.cueClock > YAW_GAP && Math.abs(want) > 0.25 && Math.abs(this.yawStroke) < 0.3 && most > 0.3 && !this.flaringAfter) {
        this.yawStroke = clamp(want * YAW_DRAG, -most, most);
        const size = Math.abs(this.yawStroke) / YAW_PEAK;
        this.cue(0.4 + 0.6 * size, size > TURN_KICK ? TURN_SWEEP * size : 0, this.yawStroke, 1, STROKE_LEAD);
      }
      // (Its head swings round once the stroke is under way; between strokes it does not turn of itself.)
      // (And it keeps its balance: the head drifting a little and brought back, once it has hung there a
      // moment: coming to a stop, its stroke and its brake are what it answers.)
      const balance = BALANCE_YAW * this.wanderRate(5, 1.2) * smooth(0.5, 2.5, this.hoverClock);
      wantedRate = this.yawStroke * smooth(0, STROKE_LEAD, this.leadClock) + balance; angularAcceleration = YAW_SNAP;
    } else if (aiming) wantedRate = clamp(yawError * 2, -1, 1);
    else if (this.mode === 'rest' && this.restSettled) wantedRate = clamp(3 * wrap((perch ? perch.heading : this.restHeading) + this.restYaw - this.heading), -0.3, 0.3);
    else if (!holding) {
      // Swimming, it turns in an arc, as fast as its way through the water takes it round this leg's
      // turning circle (turnRadius: tighter, to miss the glass or a thing in its way), its speed kept;
      // from a standstill it swings round more gently.
      const arc = Math.max(TURN_STILL * (1 - smooth(0.03, 0.08, Math.abs(this.speed))), Math.abs(this.speed) / (this.turnRadius * (nearWall || nearThing ? 0.6 : 1)));
      const maxRate = TURN_FASTEST * Math.tanh(arc / TURN_FASTEST);
      // A turn far round, once begun one way, goes on round that way: two ways out at once (the glass
      // and a thing beside it) must not leave it dithering, swung to and fro on the spot.
      if (Math.abs(yawError) < 1 && !(Math.abs(this.speed) < 0.04 && this.cueClock < TURN_COMMIT)) this.turnSide = 0;
      else if (!this.turnSide && Math.abs(yawError) > 1.6) this.turnSide = Math.sign(yawError);
      // (Not the long way round, though, for a goal that has come to lie far behind it the other way.)
      let round = this.turnSide && Math.sign(yawError) !== this.turnSide ? yawError + 2 * Math.PI * this.turnSide : yawError;
      if (Math.abs(round) > 4.4) { this.turnSide = Math.sign(yawError); round = yawError; }
      wantedRate = clamp(round * 2.2, -maxRate, maxRate);
      // Coming round from all but a standstill, it does so on a stroke: its outer pectoral, and for a
      // big turn a sweep of the tail, the head swinging round once it is under way.
      // As hanging in the water, it comes round in strokes, each swinging it round and slowing before
      // the next (turnStroke: the turn the last left it making), never as an even spin on the spot.
      // (Going down to lie, it homes in on its place as it glides, as ever; a small correction it
      // makes without a stroke.)
      const stalled = Math.abs(this.speed) < 0.04 && !escaping && !parked && this.mode !== 'rest';
      if (stalled && Math.abs(wantedRate) > 0.5 && Math.abs(this.turnStroke) < 0.3 && this.cueClock > YAW_GAP) {
        // (Going back the way it came, a strong one: the head whipped round, the body in a deep C.)
        const most = Math.min(YAW_MOST, Math.max(maxRate, YAW_PEAK) * (1 + smooth(1.2, 2.6, Math.abs(round))));
        this.turnStroke = clamp(round * TURN_DRAG, -most, most);
        // (A sweep of the tail only to begin a big one, and not easing out from among things: the strokes
        // after, the pectorals alone.)
        const size = Math.min(1, Math.abs(this.turnStroke) / YAW_PEAK), first = Math.abs(this.steerRate) < 0.15 && !crowded;
        this.cue(0.4 + 0.6 * size, first && size > TURN_KICK ? TURN_SWEEP * size : 0, this.turnStroke, 1, STROKE_LEAD);
      }
      // (A strong one swings round a little the quicker.)
      if (stalled && (Math.abs(wantedRate) > 0.5 || Math.abs(this.turnStroke) > 0.05)) { wantedRate = this.turnStroke * smooth(0, STROKE_LEAD, this.leadClock); angularAcceleration = YAW_SNAP * (1 + 0.4 * smooth(1.5, 2.2, Math.abs(this.turnStroke))); }
      else if (this.mode === 'rest' && Math.abs(this.speed) < 0.04 && !escaping) wantedRate *= smooth(0, STROKE_LEAD, this.leadClock);
    }
    if (holding || startling) this.turnSide = 0;
    for (let k = 0; k < 3; k++) this.waterSpin[k] = damp(this.waterSpin[k], water?.angular[k] ?? 0, dt, 5);
    this.steerRate += clamp(wantedRate - this.steerRate, -angularAcceleration * dt, angularAcceleration * dt);
    this.angularVelocity = this.steerRate + this.waterSpin[1] * 0.8;
    const oldHeading = this.heading;
    this.heading += this.angularVelocity * dt;
    // The C (CURL_*): as deep as the turn it means, or is making, is quick; the water's spin is no
    // turn of its own, and curls it not at all.
    const meant = Math.abs(wantedRate) > Math.abs(this.steerRate) ? wantedRate : this.steerRate, curlWant = Math.tanh(meant / CURL_RATE);
    // (A startle's C is its whip: at once.)
    this.curl = startling ? curlWant : this.curl + (curlWant - this.curl) * (1 - Math.exp(-dt / (Math.abs(curlWant) > Math.abs(this.curl) ? CURL_IN : CURL_OUT)));
    if (Math.abs(this.curl) < 0.1) { this.curlMost = 0; this.curlFrom = this.heading; }
    else this.curlMost = Math.max(this.curlMost, Math.abs(this.curl));
    // (Out of a deep one, a sweep of the tail the other way: the C let go with a stroke.)
    if (!startling && !gulping && this.curlMost > CURL_STROKE && Math.abs(this.curl) < 0.5 * this.curlMost && Math.abs(wrap(this.heading - this.curlFrom)) > CURL_TURN && this.cueClock > 0.25) {
      this.cue(0.3, KICK_OUT * this.curlMost, -Math.sign(this.curl), 1, 0, true);
      this.curlMost = 0;
    }
    // Failsafe: the fish's own net turn over the last few seconds. Several turns' worth is a spin
    // (a goal it cannot settle towards), so it gives that goal up and swims straight on.
    if (startling || gulping || behaving) this.yawAccum = 0;
    else {
      this.yawAccum = this.yawAccum * Math.exp(-dt / 6) + this.steerRate * dt;
      if (Math.abs(this.yawAccum) > SPIN_LIMIT) {
        this.spinBreaks++;
        this.yawAccum = 0; this.sharpTurn = false;
        this.target = this.targetAhead(b, 0.4);
      }
    }
    let pitchTarget = still ? 0 : clamp(Math.atan2(delta[1], Math.hypot(delta[0], delta[2])), escaping || feeding ? -0.6 : -0.32, feeding ? 1.2 : 0.32);
    // (All but still, it keeps near level, rather than stand on its tail going nowhere; nose down, it
    // still goes half as far, sinking away from the film.)
    if (!escaping && !feeding) {
      const under = smooth(LEVEL_SLOW, LEVEL_FAST, Math.max(Math.abs(this.speed), this.intent));
      pitchTarget *= pitchTarget > 0 ? under : 0.5 + 0.5 * under;
    }
    // Hovering, it hangs a little nose down, nodding slowly as it trims itself (level, just over the
    // sand).
    const floor = water ? water.sand + REST_HEIGHT - 0.004 : b.low, low = smooth(0.005, 0.04, this.position[1] - floor);
    if (hovering) pitchTarget = (-0.1 + 0.03 * this.wander(1, 0.5) + BALANCE_PITCH * this.wander(6, 1.3) * smooth(0.5, 2.5, this.hoverClock) + this.trimPitch) * low;
    // Going down to a perch well below, it glides at a gentle slope and sinks the rest of the way
    // (perchSink: the share of its speed it drops by), not nose down at the perch.
    let perchSink = 0;
    if (sinking && !perch) pitchTarget = -this.descentPitch(descent) * (1 - 0.65 * this.slump);
    else if (perch) {
      const slope = Math.atan2(delta[1], Math.hypot(delta[0], delta[2]));
      pitchTarget = this.restSettled ? perch.pitch + this.restNod() : clamp(slope, -0.4, 0.32);
      if (!this.restSettled) perchSink = clamp(Math.sin(this.pitch) - Math.sin(slope), 0, 0.6);
    } else if (this.mode === 'rest') pitchTarget = -0.03 + (this.restSettled ? this.restNod() : 0);
    // At the film the lips are trimmed by the tilt of the head alone, which moves them without moving the body.
    const trim = (low, high) => clamp(pitchForMouth(this.position[1], this.surfaceY - MOUTH_DEPTH), low, high);
    if (this.mode === 'rise') pitchTarget = rise > 0.08 ? this.tripPitch : trim(this.tripPitch - 0.12, this.tripPitch + 0.08);
    else if (this.mode === 'gulp') pitchTarget = trim(this.tripPitch - 0.12, this.tripPitch + 0.08);
    // Going down it lets itself sink back, levelling out, a touch nose down to swim off.
    else if (this.mode === 'dive') pitchTarget = -0.1;
    // Under a pellet on the film it looks up at it, then rises to it steeply along that line, lips first.
    if (aiming || striking) pitchTarget = clamp(feed.elevation, 0.8, 1.35);
    // Fleeing from the film, it dives so the snout never breaks the surface on the way out.
    if (startling && this.startleDive) pitchTarget = -0.45;
    const oldPitch = this.pitch, oldRoll = this.roll;
    const pitchSpin = -this.waterSpin[2] * Math.cos(this.heading) - this.waterSpin[0] * Math.sin(this.heading);
    const pitchPace = startling ? 8 : this.mode === 'rise' || aiming || striking ? 3.5 : this.mode === 'dive' ? 2.6 : hovering ? 2.2 : 2.4;
    const pitchMost = gulping || climbing ? 1.5 : 0.75;
    // (Up to the film and back, and up to a pellet on it, the tip builds over the rise: RISE_*.)
    const tipping = !startling && !snapping && (this.mode === 'rise' || this.mode === 'dive' || aiming || striking);
    if (tipping) {
      const diving = this.mode === 'dive', tip = pitchTarget - this.pitch, most = diving ? DIVE_TIP : RISE_TIP, snap = diving ? DIVE_SNAP : RISE_SNAP;
      const want = Math.sign(tip) * Math.min(Math.abs(tip) * pitchPace, Math.sqrt(1.6 * snap * Math.abs(tip)), most);
      this.pitchTurn += clamp(want - this.pitchTurn, -snap * dt, snap * dt);
      this.pitch = clamp(this.pitch + this.pitchTurn * dt + pitchSpin * dt * 0.8, -0.75, pitchMost);
    } else if (startling || gulping || climbing || feeding || this.dartClock < DART_TIME || this.mode === 'rest') {
      this.pitch = clamp(damp(this.pitch, pitchTarget, dt, pitchPace) + pitchSpin * dt * 0.8, -0.75, pitchMost);
      this.pitchTurn = (this.pitch - oldPitch) / dt;
    } else {
      // Otherwise it tips over gradually (PITCH_*), a big tip from all but a standstill on a stroke.
      // (On its pectorals: the tail is left to the turns and to setting off. Going down to lie, it
      // glides down as it goes.)
      const tip = pitchTarget - this.pitch, slow = Math.abs(this.speed) < 0.06 && this.mode !== 'rest';
      if (slow && Math.abs(tip) > PITCH_STROKE && Math.abs(this.pitchTurn) < 0.1 && this.cueClock > YAW_GAP && !escaping) this.cue(0.4 + 0.5 * Math.min(1, Math.abs(tip) / 0.5), 0, 1, 1, STROKE_LEAD);
      const want = Math.sign(tip) * Math.min(Math.abs(tip) * pitchPace, Math.sqrt(1.4 * PITCH_SNAP * Math.abs(tip)), PITCH_FASTEST) * (slow ? smooth(0, STROKE_LEAD, this.leadClock) : 1);
      this.pitchTurn += clamp(want - this.pitchTurn, -PITCH_SNAP * dt, PITCH_SNAP * dt);
      this.pitch = clamp(this.pitch + this.pitchTurn * dt + pitchSpin * dt * 0.8, -0.75, pitchMost);
    }
    const rollSpin = this.waterSpin[0] * Math.cos(this.heading) - this.waterSpin[2] * Math.sin(this.heading);
    // It banks into its turns, the more the faster it goes round, and rocks a little as it hangs or
    // lies. (Lying listless on the sand, it leans over a little onto one side, over a few seconds.)
    const lean = L > 0 && this.mode === 'rest' && this.restSettled ? 0.32 * L * this.restSide * smooth(0, 3, this.holdClock) : 0;
    const bank = clamp((0.35 * Math.abs(this.speed) + 0.03) * this.steerRate, -0.16, 0.16) + CURL_ROLL * this.curl;
    const rock = hovering ? 0.025 * this.wander(3, 0.7) + BALANCE_ROLL * this.wander(7, 1.5) * smooth(0.5, 2.5, this.hoverClock) + this.trimRoll : this.mode === 'rest' && this.restSettled ? 0.012 * this.wander(3, 0.5) : 0;
    this.roll = clamp(damp(this.roll, lean + bank + rock, dt, 2.6) + rollSpin * dt * 0.8, -0.65, 0.65);
    this.pitchRate = (this.pitch - oldPitch) / dt;
    this.rollRate = (this.roll - oldRoll) / dt;
    // Down towards the sand along the nose-down axis: the vertical rate eases off with the height left.
    const sinkSpeed = Math.min(0.13, clamp(0.9 * (descent - 0.002), 0.003, 0.08) / Math.max(0.1, Math.sin(-pitchTarget)));
    let desiredSpeed = sinking && !perch ? sinkSpeed * (1 - SAG_STILL * this.slump) : perch ? (perch.near ? clamp(1.2 * distance, 0.02, 0.05) : 0.09) : this.mode === 'burst' ? 0.2 * (1 - 0.4 * L) : this.mode === 'glide' ? 0.04 : feeding ? 0.21 * (1 - 0.5 * L) : this.cruiseSpeed;
    // (A pass: its pace rising and falling over a second or three as it strokes and glides.)
    if (this.mode === 'cruise') desiredSpeed *= 0.8 + 0.3 * this.wander(4, 1.6);
    // Hanging in the water, it creeps a little forward and back, correcting itself (only back, facing
    // the glass).
    // (Mostly forward: backing up is work for its pectorals, done now and then, not a slow slide.)
    // (Only on a stroke of its pectorals, its trims; between them it coasts to a stop. Backing off the
    // glass is the pectorals' steady work.)
    const creep = 0.008 * (0.35 + this.wander(2, 0.8)) + this.trimNudge * kick;
    const pushing = this.cueClock < PUSH_TIME;
    if (still) desiredSpeed = hovering ? (nearWall ? Math.min(0, creep) : pushing ? creep : 0) : 0;
    else {
      // It keeps its way on round a turn (but checks it, turning from the glass); only from all but a
      // standstill does a turn far round hold it back until it has swung round.
      const turning = 1 - 0.7 * smooth(0.9, 2.2, Math.abs(yawError)) * (1 - smooth(0.03, 0.08, Math.abs(this.speed)));
      desiredSpeed *= (nearWall ? 0.4 + 0.6 * Math.max(0, Math.cos(yawError)) : 0.8 + 0.2 * Math.max(0, Math.cos(yawError))) * turning * (this.hardStop && !nearWall ? 1 : clamp(distance / 0.14, 0.25, 1));
      // (Coming up to the glass to display, it slows and squares up to it first.)
      if (this.mode === 'mirror') desiredSpeed *= clamp(distance / 0.2, 0.1, 1) * (0.2 + 0.8 * Math.max(0, Math.cos(yawError)));
    }
    this.backing = hovering ? clamp(-desiredSpeed / 0.006, 0, 1) : 0;
    // Every speed is along the body axis; at the film the fins only creep it up the last millimetres.
    // Rising, it swims up into it, under way before it has tipped up (RISE_UNDER_WAY), the climb quickening as it tips.
    if (this.mode === 'rise') desiredSpeed = rise > 0 ? clamp(rise * 3, 0.006, this.risePace) * (RISE_UNDER_WAY + (1 - RISE_UNDER_WAY) * smooth(0.2, 0.7, this.pitch / this.tripPitch)) : 0;
    else if (this.mode === 'gulp') desiredSpeed = rise > 0.002 ? clamp(rise * 3, 0, 0.03) : 0;
    // Leaving the film it sinks back tail first while its head is still well up, then swims off.
    else if (this.mode === 'dive') desiredSpeed = -0.03 * smooth(0.3, 0.7, this.pitch) + 0.12 * smooth(0.1, -0.08, this.pitch);
    // Rising to a pellet, quickly at first; the last millimetres the fins creep it up, as for a gulp.
    else if (striking) desiredSpeed = rise > 0 ? clamp(feed.reach * 2.5, 0.02, 0.16) * smooth(0.3, 0.1, Math.abs(this.pitch - clamp(feed.elevation, 0.8, 1.35))) : 0;
    // The snap: a lunge (at the film, no further than the lips can go).
    if (snapping) desiredSpeed = this.foodAtFilm() ? clamp(Math.max(0, rise) * 14, 0, SNAP_SPEED) : SNAP_SPEED;
    // The dart starts once the head has swung round, then it coasts.
    if (startling) desiredSpeed = STARTLE_SPEED * Math.max(0, Math.cos(yawError)) ** 2 * Math.exp(-Math.max(0, this.startleClock - 0.1) / STARTLE_COAST) * (1 - 0.5 * L);
    if (escaping) desiredSpeed = Math.max(desiredSpeed, 0.16);
    // Off in a dart once it faces the way it is going (DART_*): a strong first beat, its fins folded.
    if (this.dartReady && !still && !escaping && Math.abs(yawError) < 0.45) { this.dartReady = false; this.dartClock = 0; this.cue(0.5, 1, this.kickSize < 0 ? 1 : -1, 1, STROKE_LEAD); }
    const darting = this.dartClock < DART_TIME && (this.mode === 'cruise' || this.mode === 'burst') && !escaping;
    if (darting) desiredSpeed = Math.max(desiredSpeed, this.dartSpeed * (1 - 0.4 * L));
    // Going on slowly with its tail all but still, it gains way only on a stroke, beating its pectorals
    // again as it slows (PADDLE_*); gliding, it only coasts.
    // (Easing out from among things where it hangs, it goes on its pectorals.)
    if (crowded && !escaping) desiredSpeed = Math.min(desiredSpeed, 0.9 * PADDLE_TOP);
    // What the tail is asked for, before the body has tipped into line to swim it.
    const intent = desiredSpeed;
    const paddling = (this.mode === 'cruise' || this.mode === 'lap' || crowded) && !still && !darting && !escaping && intent < PADDLE_TOP;
    if (paddling && intent > 0.004 && this.speed < PADDLE_AGAIN * intent && this.cueClock > PADDLE_GAP && this.leadClock > this.leadTime) this.cue(0.3 + 0.4 * clamp(intent / PADDLE_TOP, 0, 1), 0, 1);
    // Gliding, it coasts, slowing all the while, and once it has slowed to PADDLE_AGAIN of the pace it
    // means to keep, a sweep of its tail takes it on again: never a glide at an even speed.
    // (Going down to lie, it glides down the same way: a sweep of the tail, a coast down, another; not a
    // slide at an even pace with nothing driving it. Listless, letting itself sink, it only sinks.)
    const descending = sinking && !sags;
    const gliding = (this.mode === 'glide' || descending) && !escaping && !darting;
    if (gliding && intent > 0.004 && this.speed < PADDLE_AGAIN * intent && this.cueClock > PADDLE_GAP && this.leadClock > this.leadTime) this.cue(0.3, 0.45, this.kickSize < 0 ? 1 : -1);
    const coasting = ((paddling && intent > this.speed) || gliding) && this.cueClock >= PUSH_TIME;
    // (Each stroke a little surge past its pace, then the coast, the water dragging on it: COAST.)
    if (coasting) desiredSpeed = 0;
    else if ((paddling || gliding) && this.cueClock < PUSH_TIME) desiredSpeed *= 1.4;
    this.intent = Math.abs(intent);
    // (A burst of speed comes at once; a snap or a take brakes it hard, fins flared; coming up to the
    // film it brakes on its pectorals, so as not to break it; a hard stop is braked on them, fanned.)
    const slowing = Math.abs(desiredSpeed) < Math.abs(this.speed), braking = this.brakeClock < BRAKE_TIME && slowing;
    // (Coasting between strokes, slow, it slows only as the water drags on it; coming in faster, it
    // brakes on its fins.)
    const drag = (still && hovering && !nearWall && Math.abs(this.speed) < 0.025) || coasting;
    const pace = startling || snapping ? 30 : swallowing || (feeding && this.snapClock >= 0) ? 12 : darting && !slowing ? 14 : braking ? 10 : slowing ? (climbing ? 8 : drag ? COAST : 3.5) : 2.8;
    let nextSpeed = damp(this.speed, desiredSpeed, dt, pace);
    // Speed is only gained as fast as the tail is working; slowing down is drag, and costs nothing.
    if (!startling && !snapping && stroke !== null && Math.abs(nextSpeed) > Math.abs(this.speed)) nextSpeed = Math.sign(nextSpeed) * Math.min(Math.abs(nextSpeed), Math.abs(this.speed) + STROKE_ACCEL * clamp(stroke, 0, STROKE_MOST) * dt);
    // Gaining way from all but a stop with its tail all but still, it goes on a stroke: a whole beat of
    // the tail, out to one side and across to the other, and a beat of the pectorals (setting off,
    // levelling out to swim off from the film); it gets under way as the sweep reaches the tail.
    if (!startling && !snapping && !darting && desiredSpeed > Math.abs(this.speed) + 0.025 && this.drive < 0.12 && this.cueClock > 0.7) this.cue(0.6, 1, this.kickSize < 0 ? 1 : -1, 2, START_LEAD);
    if (!startling && !snapping && this.leadClock < this.leadTime && Math.abs(nextSpeed) > Math.abs(this.speed)) nextSpeed = this.speed;
    this.dart = darting ? 1 : 0;
    this.brake = this.brakeClock < BRAKE_TIME ? 1 : 0;
    this.speed = nextSpeed;
    // Same neutral-buoyancy inertia and finite station-keeping as the koi:
    // follow the full current with a 0.9s lag, not a capped 0.075-unit/s offset.
    const wet = water?.submerged ?? (submerged ? 1 : 0);
    if (wet > 0) for (let k = 0; k < 3; k++) this.drift[k] = damp(this.drift[k], flow[k], dt, 1 / 0.9);
    const driftSpeed = Math.hypot(...this.drift), hold = Math.max(0, driftSpeed - 0.15 * 0.42);
    if (wet > 0.99 && hold > 0) for (let k = 0; k < 3; k++) this.drift[k] *= 1 - Math.min(1, 1.6 * dt * hold / driftSpeed);
    // Weight only takes hold once the fish is well out of the water. A tail that briefly clears the
    // film (as the head tips down after a gulp) is still held up by the rest of the body.
    const dry = smooth(0.35, 0.9, 1 - wet);
    if (water && dry > 0) for (let k = 0; k < 3; k++) this.drift[k] += (env.gravity?.[k] ?? (k === 1 ? -24 : 0)) * dry * dt;
    const speedLimit = Math.hypot(...this.drift);
    if (speedLimit > 1.2) for (let k = 0; k < 3; k++) this.drift[k] *= 1.2 / speedLimit;
    const direction = [-Math.cos(this.heading) * Math.cos(this.pitch), Math.sin(this.pitch), Math.sin(this.heading) * Math.cos(this.pitch)];
    const old = [...this.position];
    // (Turning over or round in place, about its middle, as a hovering fish does: the neck swings with
    // the head by the change of pitch and heading; tipping just over the sand, about the neck, though
    // it still comes round about its middle there.)
    // (So too coming round slowly in any other way, but in a startle, at the film or after food.)
    const pivots = !startling && !feeding && !climbing && this.mode !== 'gulp' && !(this.mode === 'rest' && this.restSettled);
    const pivot = pivots ? PITCH_PIVOT * (1 - smooth(0.02, 0.08, Math.abs(this.speed))) : 0, tip = pivot * (this.mode === 'dive' ? 1 : low);
    const was = [-Math.cos(oldHeading) * Math.cos(oldPitch), Math.sin(oldPitch), Math.sin(oldHeading) * Math.cos(oldPitch)];
    const round = [-Math.cos(this.heading) * Math.cos(oldPitch), Math.sin(oldPitch), Math.sin(this.heading) * Math.cos(oldPitch)];
    for (let k = 0; k < 3; k++) {
      this.turnVelocity[k] = (pivot * (round[k] - was[k]) + tip * (direction[k] - round[k])) / dt;
      this.position[k] += (direction[k] * this.speed + this.drift[k] + this.turnVelocity[k]) * dt;
    }
    const unheld = [...this.position];
    if (sags) this.position[1] -= this.slump * clamp(SAG_RATE * descent, SAG_SLOWEST, SAG_FASTEST) * dt;
    if (perchSink > 0) this.position[1] -= perchSink * this.speed * dt;
    // Once settled on the sand, let the current go by; holding still in the water (hovering,
    // taking air, swallowing, displaying at the glass), work against a slow one (a bowl's gentle
    // circulation, not a slosh, which carries it) and keep station.
    if (this.mode === 'rest' && this.restSettled) for (let k = 0; k < 3; k++) this.drift[k] *= Math.exp(-4 * dt);
    // Swimming too, it holds its line against a slow one: it is not slid sideways or back by water it
    // cannot be seen to work against (it trims into it, and its fins and tail work the harder for
    // it: the gait's load is the water past it).
    else if (wet > 0.99 && Math.hypot(...flow) < HOLD_AGAINST) for (let k = 0; k < 3; k++) this.drift[k] *= Math.exp(-(hovering || parked ? 6 : still ? 3 : 4) * dt);
    const open = this.mode === 'gulp' ? gulpMouth(this.gulpClock, this.gulpLength) : feeding ? this.gape : 0;
    const pulse = this.mode === 'gulp' || this.mode === 'dive' ? gulpGillCover(this.gillClock) : 0;
    this.gulp = damp(this.gulp, open, dt, 25);
    this.gulpGill = damp(this.gulpGill, pulse, dt, 25);
    // Real water has no fixed horizontal ceiling when the globe is tilted.
    // Density probes steer it back into water; actual bed/glass contacts stop it.
    this.position[1] = clamp(this.position[1], floor, water ? env.radius - 0.25 : b.high);
    if (this.position[1] <= floor && this.drift[1] < 0) this.drift[1] = 0;
    // (A snap at the film stops with the lips at it.)
    if (snapping && this.foodAtFilm()) this.position[1] = Math.min(this.position[1], holdY);
    const horizontal = Math.hypot(this.position[0], this.position[2]);
    const radius = water ? env.radius - (feeding ? 0.2 : 0.29) : b.radius;
    this.position[1] = clamp(this.position[1], -radius, radius);
    const limit = Math.sqrt(Math.max(0, radius ** 2 - this.position[1] ** 2));
    if (horizontal > limit) {
      this.position[0] *= limit / horizontal; this.position[2] *= limit / horizontal;
      const n = Math.hypot(...this.position), outward = this.drift.reduce((sum, v, k) => sum + v * this.position[k] / n, 0);
      if (outward > 0) for (let k = 0; k < 3; k++) this.drift[k] -= outward * this.position[k] / n;
    }
    // (Never into one: the neck is held out of its core, as it is off the glass.)
    for (const o of this.obstacles) {
      const q = nearestOn(this.position, o.a, o.b);
      const d = this.position.map((v, k) => v - q[k]), l = Math.hypot(...d), r = o.r * 0.6;
      if (l >= r || l < 1e-9) continue;
      const n = d.map(v => v / l), into = this.drift.reduce((sum, v, k) => sum + v * n[k], 0);
      for (let k = 0; k < 3; k++) {
        this.position[k] = q[k] + n[k] * r;
        if (into < 0) this.drift[k] -= into * n[k];
      }
    }
    // (What the sand, the glass or a thing held back of its turning in place, it did not turn: the
    // part of their push against that motion comes off it.)
    const turning = Math.hypot(...this.turnVelocity);
    if (turning > 1e-9) {
      const held = this.position.reduce((sum, v, k) => sum + (v - unheld[k]) * this.turnVelocity[k], 0) / (turning * dt);
      if (held < 0) for (let k = 0; k < 3; k++) this.turnVelocity[k] *= Math.max(0, 1 + held / turning);
    }
    this.velocity = this.position.map((v, i) => (v - old[i]) / dt);
    // The tail follows what the fish means to do, not the speed it has reached: it leads a start and
    // eases off at once for a glide. A startle is the exception, and swims as fast as it flies.
    // Climbing to the air, sinking back from it, going down to lie, it works mostly its pectorals.
    const effortSpeed = startling ? Math.max(this.speed, intent) : Math.abs(intent);
    const effort = clamp(0.07 + effortSpeed * 1.4 + Math.abs(this.steerRate) * 0.06, 0.045, 0.40);
    this.drive = this.mode === 'glide' || descending ? 0.065 : parked ? 0.08 : this.mode === 'rest' && !sinking ? 0.03 : holding ? 0.045 + 0.1 * this.backing : this.mode === 'dive' && pivot > 0 ? 0.1 : this.mode === 'rise' || sinking ? Math.min(effort, 0.22) : effort;
    // How hard its fins work to hold it where it is or shift it a little (hold, 0..1): hanging in the
    // water a steady sculling, the harder for each nudge, turn or tip it makes there, backing off the
    // glass, holding against a current; going slowly the more the quicker; none once its tail does the
    // work (at pace, darting, startled), and little lying down.
    const nudge = this.cueClock < PUSH_TIME ? 1 - this.cueClock / PUSH_TIME : 0, against = clamp(Math.hypot(...flow) / HOLD_AGAINST, 0, 1);
    const turnWork = 0.2 * Math.min(1, Math.abs(this.steerRate) / YAW_PEAK) + 0.25 * Math.min(1, Math.abs(this.pitchTurn) / PITCH_FASTEST);
    // (Lying down, and going on slowly, its pectorals keep fanning, slowly: FAN_*; touching down, it
    // fans them the harder for a moment as it settles.)
    this.hold = startling || darting ? 0 : this.mode === 'rest' && !sinking ? FAN_REST + 0.4 * this.settle + 0.3 * nudge
      : still || this.mode === 'gulp' ? clamp(0.35 + 0.25 * nudge + 0.4 * this.backing + 0.3 * against + turnWork, 0, 1)
      : clamp(Math.max(FAN_SLOW * (1 - smooth(0.1, 0.3, Math.abs(this.speed))), (1 - smooth(0.05, 0.12, Math.abs(this.speed))) * (0.3 + 0.3 * nudge + 0.3 * clamp(this.intent / 0.035, 0, 1) + 0.2 * against + turnWork)), 0, 1);
  }

  /** Lying down, its settling as it touches down (0..1, rising and falling over SETTLE_TIME s). */
  get settle() {
    return this.settleClock < SETTLE_TIME ? Math.sin(Math.PI * this.settleClock / SETTLE_TIME) : 0;
  }

  /** Lying down, the nod of its settling and its small shifts against what it lies on (rad). */
  restNod() {
    return -SETTLE_NOD * this.settle + 0.012 * this.wander(6, 0.6) + this.restPitchNow;
  }

  /** Lets go of the film (or of a pellet taken there) and sinks back, levelling out. */
  startDive() {
    this.mode = 'dive'; this.timer = DIVE_LENGTH * (0.8 + 0.4 * this.gulpRandom()); this.diveClock = 0;
  }
}
