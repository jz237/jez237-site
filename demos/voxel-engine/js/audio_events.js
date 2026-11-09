// The director: turns engine events into sounds on the mixer.
//
// A collapse can raise hundreds of events in one frame. Playing each would
// cost hundreds of voices and sound like a machine gun, so events flow
// through "lanes" (one per material class and kind):
//   - the loudest few events in a lane this frame are played exactly;
//   - the rest are summarised as energy in the lane's cloud, which keeps
//     emitting grains (the same recipe at the cloud's centre, level matched
//     to the leftover energy) over the following frames;
//   - everything also feeds the rumble bed, a continuous roar whose level
//     follows the rate of destruction.
// So 200 simultaneous impacts become a dense rattle plus a roar, the voice
// count stays capped, and the per-frame cost is bounded by token buckets.
import { VOICES, VOICE_STRIDE, VOICE_CLASS, VOICE_FLAG, MAT } from './audio_materials.js';
import { OUT, WATER, EV, EV_STRIDE, SIM_DT, TOOL, TOOL_STATE, SAID, GAME, GAME_MODE, OBJ_STATE, VEHICLE, VEHICLE_STATE, REPLAY, REPLAY_MODE } from './engine.js';
import { SND, SOUNDS } from './audio_bank.js';
import { fractions } from './audio_mix.js';

// Runtime randomness: pitch, timing and variant jitter. Own generator so
// offline checks are reproducible.
let rs = 0x2545f491;
function rnd() {
  rs ^= rs << 13; rs ^= rs >>> 17; rs ^= rs << 5;
  return (rs >>> 0) * 2.3283064365386963e-10;
}
export function seedDirector(s) { rs = (s | 0) || 1; }

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ---------------------------------------------------------------- materials --

// Per material: sound class, pitch (playback rate), brightness, level and
// what else is to be known of it. The engine's table (acoustics::voice_of),
// by way of audio_materials.js; an id beyond it sounds like concrete.
const C_STONE = VOICE_CLASS.STONE, C_WOOD = VOICE_CLASS.WOOD, C_METAL = VOICE_CLASS.METAL, C_COPPER = VOICE_CLASS.COPPER;
const C_GLASS = VOICE_CLASS.GLASS, C_SOFT = VOICE_CLASS.SOFT, C_LEAF = VOICE_CLASS.LEAF, C_PLASTER = VOICE_CLASS.PLASTER;
const NCLASS = 8;
const mClass = new Uint8Array(256);
const mPitch = new Float32Array(256).fill(1);
const mBright = new Float32Array(256).fill(1);
const mGain = new Float32Array(256).fill(1);
const mFlags = new Uint8Array(256);
for (let id = 0, p = 0; p < VOICES.length && id < 256; id++, p += VOICE_STRIDE) {
  mClass[id] = VOICES[p]; mPitch[id] = VOICES[p + 1]; mBright[id] = VOICES[p + 2]; mGain[id] = VOICES[p + 3]; mFlags[id] = VOICES[p + 4];
}
const REBAR = VOICE_FLAG.REBAR, LOOSE = VOICE_FLAG.LOOSE, HUSHED = VOICE_FLAG.HUSHED, SHEET = VOICE_FLAG.SHEET;
// What burning fuel on the ground says is burning.
const FUEL = MAT.EXPLOSIVE;

const cImpact = [SND.imp_stone, SND.imp_wood, SND.imp_metal, SND.imp_copper, SND.imp_glass, SND.imp_soft, SND.imp_leaf, SND.imp_plaster];
const cBreak = [SND.brk_stone, SND.brk_wood, SND.brk_metal, SND.brk_metal, SND.brk_glass, SND.brk_soft, SND.imp_leaf, SND.brk_plaster];
const cCrack = [SND.crack_stone, SND.crack_wood, SND.crack_metal, SND.crack_metal, SND.ping, SND.imp_soft, SND.imp_leaf, SND.imp_plaster];
const cCreak = [SND.creak_stone, SND.creak_wood, SND.creak_metal, SND.creak_metal, SND.ping, -1, -1, SND.creak_stone];
const cDetach = [SND.tear, SND.brk_wood, SND.brk_metal, SND.brk_metal, SND.brk_glass, SND.brk_soft, SND.imp_leaf, SND.brk_plaster];
const cStep = [SND.step_hard, SND.step_wood, SND.step_metal, SND.step_metal, SND.step_gravel, SND.step_soft, SND.step_soft, SND.step_hard];
// Distance (m) inside which the class plays at full level: ringing and
// brittle things carry further than dead ones.
const cRef = [3, 3, 4.5, 4, 3.5, 2.5, 2, 2.5];
// Brightness of the strike at a given closing speed: hard surfaces excite
// their high modes even when tapped.
const cBright = [1, 1.1, 3, 2.5, 4, 0.6, 2.5, 1.6];
const cImpactGain = [1, 0.9, 0.8, 0.8, 0.7, 0.7, 0.5, 0.8];
// Copper tears and snaps with steel's recipes, played higher and duller: a
// softer, thinner metal.
const cTearRate = [1, 1, 1, 1.3, 1, 1, 1, 1];
const cTearCut = [1, 1, 1, 0.2, 1, 1, 1, 1];

const TAU = Float32Array.from(SOUNDS, (s) => s.tau);

// ------------------------------------------------------------------- lanes --

const L_IMPACT = 0, L_BREAK = NCLASS, L_CRACK = 2 * NCLASS, L_DETACH = L_CRACK + 1, L_CREAK = L_CRACK + 2, L_GLASS = L_CRACK + 3;
const NLANES = L_GLASS + 1;
// Exact events kept per lane per frame, and reservoir record layout.
const TOP = 3;
const R_LOUD = 0, R_X = 1, R_Y = 2, R_Z = 3, R_MAG = 4, R_MAT = 5, R_A = 6, R_SIZE = 7;
// Exact events a lane may play per frame. Glass and detach recipes are
// several voices each and groans are long, so they get fewer.
const LANE_EXACT = new Uint8Array(NLANES).fill(TOP);
LANE_EXACT[L_DETACH] = 2; LANE_EXACT[L_CREAK] = 1; LANE_EXACT[L_GLASS] = 1;
// The stealing priority each lane's recipe gives its main voice.
const LANE_PRIO = new Float32Array(NLANES).fill(1);
LANE_PRIO.fill(1.2, L_BREAK, L_CRACK);
LANE_PRIO[L_DETACH] = 1.4; LANE_PRIO[L_CREAK] = 1.1; LANE_PRIO[L_GLASS] = 1.5;
// Cloud grains a lane may emit per frame.
const CLOUD_GRAINS = 2;
// A cloud below this energy (-46 dB) is dropped.
const CLOUD_FLOOR = 2.5e-5;
// Seconds for unspent cloud energy to fade: the rattle outlasts the frame
// that caused it but not by much.
const CLOUD_TAU = 0.12;
// Events below this estimated loudness (-48 dB) only feed the bed.
const QUIET = 0.004;
// Past this many new events in a frame the bulk kinds are stride-sampled and
// weighted, so cost stays bounded whatever the engine throws at us.
const MAX_EVENTS = 1024;
// Largest magnitude (impulse, mass, voxel count, radius) and `a` (speed,
// power) a record may carry and still be believed.
const MAX_MAG = 1e12;
const MAX_A = 1e6;
// A cloud grain may play this much louder than one event of its kind would:
// it stands for several, but it is still one object being hit.
const GRAIN_MAX = 1.5;

// Voice starts per second the lanes may sustain (bursts of up to 6). Grains
// fuse into a texture well below this rate; more would only be main-thread
// cost and voice churn.
const LANE_RATE = 200;
// Shortest time between two creaks (they last a second or more).
const CREAK_GAP = 0.3;
// Frames between enclosure probes.
const PROBE_FRAMES = 30;
// Rumble bed: most energy a second of events may add, and its decay time.
const BED_RATE = 5;
const BED_TAU = 0.4;
// Fire: how long what has caught goes on crackling without more fuel (its
// energy falls to 1/e in this many seconds), the most fuel that counts, and
// the level of one unit of it (one ignition next to the listener).
const FIRE_TAU = 1.5;
const FIRE_FULL = 36;
const FIRE_UNIT = 0.1;
// The roar of a big fire, at full size and full fuel, against the crackle.
const ROAR_UNIT = 0.11;
// A fire that burns says so three times a second. One that has been saying
// so and has said nothing for this long (s) is out, and dies away at
// FIRE_OUT, not as slowly as one that was only ever heard to catch.
const FIRE_SILENT = 0.7, FIRE_OUT = 0.4;

// Answers about what is in the way that are kept (a power of two), and for
// how long (s).
const OCC_SLOTS = 64;
const OCC_KEEP = 0.25;
// Where the engine's figure for the player's shock is in the tool state
// (undefined on an engine that has none).
const SHOCK = TOOL_STATE.SHOCK;
// The flamethrower's tank (see tank()): where the engine says how full it
// is (1 is a full tank, six seconds of fire), and how full it must be
// again before it can be heard to run dry again (a twentieth: a third of
// a second of fire. Taken for seconds at first, the half that stood here
// was half a tank, and a player firing in bursts heard it starve once).
const TANK = TOOL_STATE.FUEL, TANK_AGAIN = 0.05;
// The share of its peak the figure falls to before the ears begin to open.
const SHOCK_HOLD = 0.7;
// Seconds of lead a start is given, so that it lands on a sample-accurate
// time instead of "as soon as the audio thread gets to it".
const LEAD = 0.004;
// Drone channels of the mixer (see Mixer.drone).
// Kinds of blast, by what set it off: [crack, thump, body, pitch, roll].
// 0: a rocket, a drum, anything not said. 1: a cutting charge, shaped to
// cut: nearly all crack, high and dry. 2: a satchel, a bag of it lying in
// the open: more thump and body than crack, lower. 3: a breaching charge,
// tamped against what it breaches: a hard flat crack, no thump to speak
// of. 4: a bomb: the lowest and the biggest, and it rolls on.
const BLAST_STRIDE = 5;
const BLAST = new Float32Array([
  1, 1, 1, 1, 0,
  1.35, 0.45, 0.6, 1.22, 0,
  0.8, 1.25, 1.2, 0.86, 0,
  1.3, 0, 0.75, 1.35, 0,
  0.9, 1.35, 1.25, 0.78, 0.45,
]);
// Which kind each tool's is (by the tool's id; the engine says source =
// tool + 1, and one past the last tool for the big red button).
const BLAST_OF = new Uint8Array(64);
if (TOOL.CHARGE !== undefined) BLAST_OF[TOOL.CHARGE] = 1;
if (TOOL.SATCHEL !== undefined) BLAST_OF[TOOL.SATCHEL] = 2;
if (TOOL.BREACH !== undefined) BLAST_OF[TOOL.BREACH] = 3;
if (TOOL.STRIKE !== undefined) BLAST_OF[TOOL.STRIKE] = 4;
// The step of the links' scale for a multiplier (1 is the first).
const linkStep = (b) => (b >= 1 ? (b < LINK_SCALE.length ? (b | 0) - 1 : LINK_SCALE.length - 1) : 0);
// The page shows the card this long (s) after the game's last word
// (game_modes.js, CARD_DELAY), and the medal's sound goes with the card.
// Records of damage are heard this far apart at the closest.
const CARD_DELAY = 1.1, DAMAGE_GAP = 0.5;
// What is fired from the hand, against a blast (the sheet's `guns`): the
// loudest 400 ms of a rocket's blast 15 m off is the mark, and the rifle
// held down is 5 LU under it, the shotgun 3, the cannon 1. (Until the tools
// played their own sounds nobody had heard these levels in the game: the
// rifle, at 0.7 and nine a second, was the loudest thing in it.)
const GUN_RIFLE = 0.46, GUN_SHOTGUN = 0.72, GUN_CANNON = 0.55, RIFLE_BURST = 0.25;
// A structure going (`ev::CREAK` with a ratio of 1 or more: a check has
// condemned connections of a frame that has not come to rest; `a` how many,
// `b` the frame's size in nodes). The records come 0.3 to 0.8 s apart for
// the seconds before the big piece lets go. How slowly what has let go is
// forgotten while they come (s), how long after the last of them it is
// taken to be over, how fast the moan then dies; the distance inside which
// a connection counts in full (m); and the moan's level when a tower has
// been going for some seconds beside the listener.
const STRAIN_TAU = 8, STRAIN_HOLD = 1.5, STRAIN_OUT = 0.5, STRAIN_MOST = 4096, STRAIN_REF = 15, GROAN_LEVEL = 0.2;
// How much lower a big frame groans than a small one: the rate for a frame
// of `nodes` (a shed is a hundred, the office 2,800, the tower 9,800).
const frameRate = (nodes) => clamp(1.5 - 0.3 * Math.log10((nodes > 10 ? nodes : 10) * 0.01), 0.75, 1.6);
// After a fall: the bed has been this far open, and has come down to this.
const SETTLE_FROM = 0.5, SETTLE_AT = 0.12;
// Water on the move (the water block's FLOW: litres a second passing from
// column to column, and about where): nothing under FLOOD_FROM, a flood in
// full at FLOOD_FULL (a 30 m3 tank holed peaks near it); its level beside
// the listener; and the distance inside which it is at that level (m).
const FLOOD_FROM = 150, FLOOD_FULL = 3e5, FLOOD_LEVEL = 0.35, FLOOD_REF = 8;
const W_FLOW = WATER ? WATER.FLOW : undefined, W_FLOW_X = WATER ? WATER.FLOW_X : undefined, W_FLOW_Z = WATER ? WATER.FLOW_Z : undefined;
// A river (river()): the floats of one of the water block's rectangles (0
// in an engine without them) and where each of its figures is, as
// engine/src/water/output.rs lays a rectangle out; the current under
// which standing water is still (m/s) and the one at which a river is as
// loud as it gets; the distance inside which it is at full level (m), its
// level there, and the most rectangles looked at.
const W_RECT = WATER && WATER.RECT_STRIDE > 0 ? WATER.RECT_STRIDE : 0;
const RECT_X0 = 0, RECT_Z0 = 1, RECT_X1 = 2, RECT_Z1 = 3, RECT_LEVEL = 4, RECT_CX = 5, RECT_CZ = 6;
const RIVER_FROM = 0.15, RIVER_FULL = 2, RIVER_REF = 8, RIVER_LEVEL = 0.16, RIVER_MOST = 256;
// Slow motion: the world's speed under which sounds slow with it, how far
// they slow at the most (a playback rate), by what power of the world's
// speed, how fast the figure is followed (per measurement), the longest
// wait between two steps that is still slow motion and not a world that
// was stopped (s), the shortest stretch the world's speed is measured over
// (s), and how long without a step before the world is taken to be
// stopped (s).
const SLOW_FROM = 0.75, SLOW_MIN = 0.5, SLOW_POWER = 0.5, SLOW_FOLLOW = 0.5, SLOW_GAP = 0.6, SLOW_WINDOW = 0.1, STOP_AFTER = 0.5;
// How long what is heard takes to follow a speed the shell has said (s).
const SLOW_GLIDE = 0.08;
// Told how fast the world is meant to run, whether it does is measured
// over so many steps at a time (a count of steps, not a length of time:
// in slow motion a tenth of a second holds one step or two, and one step
// more or fewer is no measure); under SLOW_FROM of what is meant twice
// running, the machine is not keeping up and the world's speed is what
// is measured, until a measure is back over this share of what is meant.
const SLOW_STEPS = 6, SLOW_BACK = 0.9;
// And at its edges (the fourth and the fifth review). A measure is also
// closed after SLOW_WAIT seconds whatever it holds (a world that all but
// stands was heard at full speed for the nine seconds its twelve steps
// took). The machine is taken to lag when the low measures running have
// lasted SLOW_SURE seconds (two frames of 150 ms are not slow motion:
// with the frames about them their two measures last 0.42 s at the
// worst, which at 0.4 was lag at one phase in twelve).
// What the machine could do is remembered for LAG_KEPT seconds: when slow
// motion ends on a machine that was lagging, it is lagging again at once
// (sounds went to full speed for the six tenths of a second it took to
// find out, and back).
//
// While it lags the ear's figure (slowRate) goes towards an aim over
// LAG_EASE, and the aim is moved by the measures with a time constant of
// LAG_TAU: a world in a wreck on a slow machine runs at anything from a
// fifth to nine tenths of its speed from one half second to the next (six
// steps over whole frames alone read 0.75 and 0.67 by turns), and sounds
// go with its speed over two or three seconds, not with each measure.
// When it is first believed the aim is the measure itself (the second of
// two that agree; three quarters of the way there and then the time
// constant, a drop to 0.3 was not heard to within 3% for 4.7 s). A
// machine that has caught up is heard to over LAG_EASE as well (in the
// page a world back at full speed took every engine up six semitones
// between two frames). A whistle is timed by a figure of its own, below:
// given the ear's, a strike's third bomb fell in a world that had slowed
// to 0.4 while its whistle was told 0.7, and it spent its sound and sank
// to a hum.
//
// A world that brings no step is a slow world for STALL_AFTER seconds and
// a stopped one after (at half a second, steps 0.45 and 0.55 s apart
// switched an engine off and on ten times in ten seconds; no fall
// measured in the page has a wait over 0.22 s).
const SLOW_WAIT = 0.5, SLOW_SURE = 0.5, LAG_KEPT = 10, LAG_TAU = 1, LAG_EASE = 0.45, STALL_AFTER = 2;
// What a whistle is timed by is the shell's word times the share of it the
// world has kept over the last second (`share`): steps over time, summed
// in twentieths of a second, a wait of more than WAIT_MOST between two steps
// left out (a stall is not a speed). It is known whether or not the
// machine is taken to lag, it is all there a second after the pace
// changes, and one late frame moves it by what one late frame is. (Set to
// the last measure the moment lag was believed and to the shell's word
// the moment it was left, a whistle fell an octave and rose again within a
// tenth of a second whenever three frames came late; and a world that
// kept four fifths of its speed, which is not lag, was not followed at
// all: its whistle spent itself and came to its blast at 246 Hz for 609.
// Gone towards with a time constant instead, it was never quite there,
// and a strike's third whistle kept slowing to its end.)
// No more than all of it, and within a fiftieth of all of it is all of
// it: no further, a whistle has slack of its own (rounded up from 0.94,
// the share stepped from 1 to 0.89 in one frame on the way down).
// How much longer its sound takes to come is reckoned at where the ear's
// figure is going (`farTo`), gone towards over FAR_TAU (`farW`): reckoned
// at the figure as it is on its way, a strike's third whistle was 1.8 dB
// further down at its blast (the check for that, `incoming_lag`, fails).
// A hitch is not a speed either: a step that comes more than HITCH times
// as long after the one before as steps have lately come (`pTyp`, which
// moves a quarter at a time towards each gap) is left out with its wait.
// One late frame, or three running, change nothing; five running are how
// steps come now. (Counted, one frame of 150 ms made the share 0.92 for a
// second: a whistle slowed for a world that was at full speed again, then
// hurried, three changes of speed and 5% over its note at the blast for
// 83 ms lost. Waited out instead for the half second lag is believed in,
// a strike's third whistle was 5 dB down at its blast.)
const PACE_BINS = 20, PACE_BIN = 0.05, WAIT_MOST = 0.4, FAR_TAU = 0.5, HITCH = 3;
const DR_ENG_LO = 0, DR_ENG_HI = 1, DR_ROLL = 2, DR_SKID = 3, DR_JET = 4, DR_GRIND = 5, DR_HORN = 6, DR_ROAR = 7, DR_GROAN = 8, DR_WATER = 9;
// Where in the vehicle's state the simulation says what slides and what
// holds it up (not there in an engine before the vehicles' second pass).
const V_SLIP = VEHICLE_STATE.SLIP, V_SLIP_MAT = VEHICLE_STATE.SLIP_MATERIAL, V_PUSH = VEHICLE_STATE.PUSH, V_HELD = VEHICLE_STATE.HELD, V_EDGE = VEHICLE_STATE.EDGE;
// A tyre squeals from this much sliding (m/s) and is at full cry this far
// above it; the horn's level.
// An engine dying under its driver (see vehicle()).
const WRECK_LEVEL = 0.4;
const SLIP_FROM = 0.7, SLIP_FULL = 5, HORN_LEVEL = 0.6;
// The gearbox the engine sound is given: the share of top speed each gear
// reaches, how near that the change up comes and how far below the gear
// under it the change down; revs at idle (0..1) and the time they take to
// follow (s).
const GEAR_TOP = [0.2, 0.4, 0.66, 1];
const GEAR_UP = 0.94;
const GEAR_DOWN = 0.6;
const REV_IDLE = 0.06;
const REV_TAU = 0.12;
// Seconds the flamethrower's jet is held open after it last said it fires
// (it says so every quarter second).
const JET_HOLD = 0.4;
// v to the nearest multiple of q of itself (a ratio step), and a level to
// the nearest two-hundredth: what the drones are given, so that values
// that have not really changed are not written again.
const quant = (v, q) => Math.exp(Math.round(Math.log(v) / q) * q);
const step = (v) => Math.round(v * 200) * 0.005;
// A link in the chain is played this much higher (playback rate) at each
// step of the multiplier: a major pentatonic scale over two octaves.
const LINK_SCALE = Float32Array.from([0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24], (s) => Math.pow(2, s / 12));
// The clock is heard for its last CLOCK_LAST seconds, and differently for
// the last CLOCK_URGENT.
const CLOCK_LAST = 10;
const CLOCK_URGENT = 3;
// How far ahead (s) a tick is scheduled: more than the time between two
// looks at the clock.
const CLOCK_AHEAD = 0.1;
// `b` of a JOINT_BREAK that is a rope (`physics`: 0 ball, 1 hinge, 2 rope,
// 3 weld, 4 pin).
const JOINT_ROPE = 2;
// Bombs coming down (`ev::INCOMING`): the distance (m) inside which the
// whistle plays at full level (it is meant to be heard from across the
// map), the most bombs kept count of at once (two carpets of nine: the
// sandbox's toy), the most whistles sounding at once and how many of a
// stick get the long whistle (the rest the short one: nine long ones are
// nine voices at once, and are not heard as nine), how far a whistle may
// be sped up or slowed down to end on its blast, and the longest wait (s)
// believed.
const WHISTLE_REF = 40;
const WHISTLE_MAX = 18, WHISTLE_SOUNDING = 8, WHISTLE_LONG = 4;
// A rock coming down (see incoming()): its roar against a whistle's 0.16.
const METEOR_LEVEL = 0.6;
// A blast within WHISTLE_NEAR metres (level) of a whistle's mark and
// within WHISTLE_EARLY seconds (of the game's time) of when it was due is
// that whistle's bomb.
const WHISTLE_NEAR = 30;
const WHISTLE_EARLY = 1;
const WHISTLE_FAST = 1.5;
const WHISTLE_SLOW = 0.7;
const INCOMING_MAX = 30;
// The slowest the game's time is taken to run against the audio clock's
// by what follows it step by step (a whistle: it does not divide by
// nothing; a world that is stopped holds it still, see frame()).
const SIM_RATE_MIN = 0.02;
// A whistle's speed is left alone while it would end within this (s) of
// when its bomb is heard: the audio clock read once a frame moves by a
// device's block at a time (10 to 20 ms), a step of the game by a sixtieth,
// and in a whistle's last quarter second either is more than a sixteenth of
// what is left (four or five changes of speed in the last sixth of a
// flight, measured in the page). The blast cuts what is over.
const WHISTLE_SLACK = 0.03;
// A shot begun at the press is answered by the world's own record of it
// within this many frames that bring a step: past that the press was
// refused, and the next shot of that tool is its own. (The shell's count
// for the kick and the flash, game_press.js: a claim lapses after the
// fourth such frame. One fewer here, and a launcher whose record came in
// the fourth would have kicked once and been heard twice.)
const PRESS_TOOLS = 32, PRESS_FRAMES = 4;
// (In the table of whistles, the voice of one whose sound is over before its bomb is down.)
const SPENT = -2;
// What is in the air stands still when the world has brought no step for
// this long though it is meant to run (a simulation stuck in a step), and
// goes on with the next step: its bomb hangs where it is, and played on
// through 0.6 s of that every second and a half a whistle had spent
// itself before its bomb was down (76 Hz and 5 dB under where 627 Hz was
// due). Half a second: a hit-stop is a twelfth, and on a worker slowed
// four and six times on a busy box a fall has waits of 0.37 to 0.45 s
// several times over (at 0.3 every sounding whistle dropped out for a
// tenth of a second at each); the long ones there are 0.8 to 1.4 s.
const AIR_STILL = 0.5;
const SOUND_SPEED = 343;

// Loudness (0..~1.3) of each kind before distance.
const ampImpact = (j, v) => {
  // Energy-like: impulse x closing speed. Fourth root = 30 dB of level for
  // 60 dB of energy, so pebbles are audible and slabs do not clip.
  const a = 0.05 * Math.sqrt(Math.sqrt(j * (v > 0.5 ? v : 0.5)));
  // A body at rest still trades impulse with the ground every step (its
  // weight times dt) at next to no closing speed. That is not a sound:
  // fade out below half a metre per second, silent under 0.15.
  const gate = v >= 0.5 ? 1 : v > 0.15 ? (v - 0.15) * (1 / 0.35) : 0;
  return (a > 1.3 ? 1.3 : a) * gate;
};
const ampBreak = (n) => { const a = 0.09 * Math.pow(n > 1 ? n : 1, 0.33); return a > 1.2 ? 1.2 : a; };
const ampCrack = (ratio) => clamp(0.22 + 0.12 * (ratio - 1), 0.15, 0.6);
const ampDetach = (mass) => clamp(0.19 * Math.log10(mass > 1 ? mass : 1) - 0.12, 0.08, 1.1);
const ampCreak = (ratio) => clamp(0.07 + 0.2 * (ratio - 0.7), 0.05, 0.22);
// (A pane goes as one record now, of a hundred voxels and more, and a
// blast's as one of thousands: at 0.25 n^0.3 up to 1 every window was at
// full level, louder six metres off than the rifle that broke it.)
const ampGlass = (n) => { const a = 0.2 * Math.pow(n > 1 ? n : 1, 0.25); return a > 0.55 ? 0.55 : a; };
const ampSplash = (j) => clamp(0.045 * Math.pow(j > 1 ? j : 1, 0.3), 0.05, 0.7);

export class Director {
  // `engine` is optional: with its acoustic queries sounds are occluded by
  // the world and the reverb follows the listener indoors.
  constructor(mixer, engine = null) {
    this.mixer = mixer;
    this.engine = engine && typeof engine.acousticOcclusion === 'function' && typeof engine.acousticEnclosure === 'function' ? engine : null;
    this.t0 = 0;
    this.lastNow = -1;
    this.tok = 6;
    this.tokBig = 8;

    this.resN = new Uint8Array(NLANES);
    this.res = new Float32Array(NLANES * TOP * R_SIZE);
    // Per-frame lane sums: energy, and energy-weighted position, magnitude,
    // `a` and squared position (for the spread).
    this.fE = new Float64Array(NLANES);
    this.fX = new Float64Array(NLANES);
    this.fY = new Float64Array(NLANES);
    this.fZ = new Float64Array(NLANES);
    this.fQ = new Float64Array(NLANES);
    this.fMag = new Float64Array(NLANES);
    this.fA = new Float64Array(NLANES);
    // Energy and count of the lane's events played exactly this frame, and
    // the material of the loudest.
    this.fExact = new Float64Array(NLANES);
    this.fPlayed = new Uint8Array(NLANES);
    this.fTopMat = new Uint8Array(NLANES);
    // Set when the pool turned the lane's loudest event away this frame.
    this.fShut = new Uint8Array(NLANES);
    this.touched = new Uint8Array(NLANES);
    // take() hands an event to offer() through this instead of as arguments:
    // floats passed to a call that is not inlined are boxed, one heap number
    // each, which at hundreds of events a frame was 38 KB of garbage a frame.
    this.ev = new Float64Array(6);
    // Lane the per-frame loops start from; rotates so that when tokens run
    // out it is not always the same lanes that go without.
    this.first = 0;
    // Clouds.
    this.cE = new Float64Array(NLANES);
    this.cX = new Float64Array(NLANES);
    this.cY = new Float64Array(NLANES);
    this.cZ = new Float64Array(NLANES);
    this.cSpread = new Float32Array(NLANES);
    this.cMag = new Float32Array(NLANES);
    this.cA = new Float32Array(NLANES);
    this.cMat = new Uint8Array(NLANES);
    // The loudest a grain of the cloud can come out before distance (its
    // largest piece): lets a cloud that cannot get a voice skip its turn.
    this.cTop = new Float32Array(NLANES);
    this.clouds = 0;
    this.creakAt = 0;

    this.bedE = 0;
    this.bedIn = 0;
    this.bedSide = 0;
    this.bedSideIn = 0;
    this.bedSet = 0;
    // Fire: fuel burning and arriving, their sideways and distance moments.
    this.fireE = 0; this.fireIn = 0;
    this.fireSide = 0; this.fireSideIn = 0;
    this.fireDist = 0; this.fireDistIn = 0;
    this.fireSet = 0;
    // The share of the fire that crackles and the share that roars.
    this.fireCrack = 0; this.fireCrackIn = 0; this.fireRoar = 0; this.fireRoarIn = 0; this.roarSet = 0; this.fireQuiet = 0; this.fireSays = false;
    this.damageAt = -1; this.radioAt = -1; this.rifleAt = -1;
    // Shots begun at the press (press()) that the world has not yet
    // answered, by tool: how many, and how many stepping frames the claim
    // still has.
    this.owed = new Uint8Array(PRESS_TOOLS); this.owedLeft = new Uint8Array(PRESS_TOOLS); this.owedAny = 0; this.pressing = false;
    // What is going: strain held, arriving, its side; the frame's size; the
    // moan as set. And how far the bed has been open since it last closed.
    this.strainE = 0; this.strainIn = 0; this.strainSide = 0; this.strainSideIn = 0; this.strainNodes = 0; this.groanSet = 0; this.strainQuiet = 0;
    this.bedPeak = 0; this.bedWet = 0; this.bedWetIn = 0; this.bedPeakWet = 0;
    this.floodSet = 0; this.rvSpeed = 0; this.rvPan = 0; this.rvCut = 20000;
    // The horn: held, and sounding.
    this.horn = false; this.hornSet = false;
    this.vLoose = false; this.vPush = 0; this.vBrake = 0; this.vWheels = 0; this.vKind = -1; this.vWrecks = 0;
    this.stun = 0;
    this.foot = 1;
    // Direct kinds played this frame (each has a small per-frame cap).
    this.nExplosions = 0; this.nShots = 0; this.nSteps = 0; this.nIgnites = 0; this.nIncoming = 0; this.nJoints = 0; this.nSplashes = 0;
    // What the world last said is in the way (see place()): the key of the
    // source's and the listener's cells, the answer, and until when it is
    // believed. And how many times the world has been asked.
    this.occKey = new Int32Array(OCC_SLOTS);
    this.occSolid = new Float32Array(OCC_SLOTS);
    this.occUntil = new Float64Array(OCC_SLOTS).fill(-1);
    this.occAsked = 0;
    // Whole seconds left on the game's clock when last looked at (-1: no
    // clock running), and the last second a tick was played for.
    this.clockLeft = -1; this.clockDone = -1;
    // The vehicle being driven (see vehicle()): whether there is one, the
    // seconds since the player got in, the gear, the revs (0..1), how far
    // the tyres slide (0..1), the count of walls gone through last seen;
    // and the bookkeeping of looking every other frame.
    this.vOn = false; this.vSince = 0; this.vGear = 0; this.vRev = 0; this.vSlip = 0; this.vRams = 0;
    this.vTick = 0; this.vDt = 0; this.dtLast = 1 / 60;
    // The flamethrower's jet: seconds it is still held open, whether its
    // drone is on, and where the nozzle was last heard.
    this.jetHold = 0; this.jetOn = false; this.jetDry = false; this.jetPan = 0; this.jetGain = 1; this.jetCut = 20000;
    // Whistles in the air (see incoming() and whistling()): the mark each
    // falls on, the seconds of the game's time until its bomb lands, the
    // seconds its sound takes to get here, the call it stands for a whole
    // stick of (0: one bomb of its own), whether it is the lesser voice of
    // a stick and its place beside the mark; and once it sounds: its voice
    // (-1 before) and that voice's start time (its identity), the length of
    // its buffer, how much of that has played and how fast it plays.
    this.wN = 0; this.wGo = 0;
    this.wX = new Float64Array(WHISTLE_MAX);
    this.wY = new Float64Array(WHISTLE_MAX);
    this.wZ = new Float64Array(WHISTLE_MAX);
    this.wLeft = new Float64Array(WHISTLE_MAX);
    this.wDelay = new Float64Array(WHISTLE_MAX);
    this.wCall = new Uint8Array(WHISTLE_MAX);
    this.wSecond = new Uint8Array(WHISTLE_MAX);
    this.wShort = new Uint8Array(WHISTLE_MAX);
    this.wRock = new Uint8Array(WHISTLE_MAX);
    this.wSide = new Float32Array(WHISTLE_MAX);
    this.wVoice = new Int8Array(WHISTLE_MAX);
    this.wStart = new Float64Array(WHISTLE_MAX);
    this.wDur = new Float64Array(WHISTLE_MAX);
    this.wPos = new Float64Array(WHISTLE_MAX);
    // (Where in its sound it was when the world last moved: where its bomb is.)
    this.wAt = new Float64Array(WHISTLE_MAX);
    this.wRate = new Float64Array(WHISTLE_MAX);
    this.wSerial = 1;
    // How fast the game's time runs against the audio clock's (1 at full
    // speed, 0.2 in slow motion, 0 paused), from the steps each frame says
    // it took (-1: it has not said; then a frame is taken to be its own
    // length of the game's time).
    this.simSteps = -1; this.simSeq = -1;
    // The same, smoothed, and what is made of it: the rate sounds are
    // slowed to and the factor their travel is stretched by.
    this.slowRate = 1; this.slow = 1; this.far = 1; this.farTo = 1; this.realAcc = 0; this.simAcc = 0; this.lastWall = -1;
    this.stopped = false; this.air = false; this.simKnown = false;
    // What the shell says of the world's speed (pace(); -1: nothing), how
    // long it has held the world, slow stretches seen running (when it
    // says nothing), and the game's time gone by since the last step.
    this.paceSaid = -1; this.paceWas = -1; this.still = 0; this.slowSeen = 0; this.gameAhead = 0;
    this.pReal = new Float64Array(PACE_BINS); this.pSim = new Float64Array(PACE_BINS); this.pBin = 0;
    this.lag = 0; this.lowFor = 0; this.lagWas = 0; this.lagAge = 0; this.slowRaw = 1; this.stall = 0; this.measuring = 0; this.glide = SLOW_GLIDE; this.lagAim = 1; this.timeRate = 1; this.share = 1; this.farW = 1; this.pWait = 0; this.pTyp = SIM_DT; this.paced(1);
    // The engine's figure for the shock of a blast that reached the player
    // (see shock()): what it was at the last look, its peak since it was
    // last nothing, and what the mixer has been told.
    this.shockLast = 0; this.shockPeak = 0; this.shockSet = 0;
    // Which things the game said this frame (bits by SAID).
    this.saidMask = 0;
    this.whistles = 0; this.whistlesCut = 0;
    this.presses = 0; this.pressesPaired = 0; this.pressesLapsed = 0;

    this.ambience = true;
    // The world is a city (settle()): its bed and its far horns for the
    // wind and the birds of a field.
    this.city = false;
    this.ambSet = -1;
    this.nextBird = -1;

    // Enclosure probe: frames until the next one, and the last reading.
    this.probeWait = 0;
    this.room = 0;

    // Counters for stats().
    this.events = 0; this.exact = 0; this.grains = 0; this.summarised = 0; this.rejected = 0;
    fractions(this, ['t0', 'lastNow', 'tok', 'tokBig', 'creakAt', 'bedE', 'bedIn', 'bedSide', 'bedSideIn', 'bedSet', 'stun', 'ambSet', 'nextBird', 'room',
      'fireE', 'fireIn', 'fireSide', 'fireSideIn', 'fireDist', 'fireDistIn', 'fireSet', 'fireCrack', 'fireCrackIn', 'fireRoar', 'fireRoarIn', 'roarSet', 'fireQuiet', 'vPush', 'vBrake', 'vWheels', 'vWrecks', 'damageAt', 'radioAt', 'rifleAt', 'strainE', 'strainIn', 'strainSide', 'strainSideIn', 'strainNodes', 'groanSet', 'strainQuiet', 'bedPeak', 'bedWet', 'bedWetIn', 'bedPeakWet', 'floodSet', 'rvSpeed', 'rvPan', 'rvCut',
      'vSince', 'vRev', 'vSlip', 'vDt', 'dtLast', 'jetHold', 'jetPan', 'jetGain', 'jetCut',
      // (Whole numbers, but read out of a float array or made by Math.ceil:
      // the engine may hold them as fractions.)
      'vRams', 'clockLeft', 'clockDone', 'simSteps', 'simSeq', 'slowRate', 'slow', 'far', 'farTo', 'farW', 'share', 'pWait', 'pBin', 'pTyp', 'realAcc', 'simAcc', 'lastWall', 'paceSaid', 'paceWas', 'still', 'gameAhead', 'lowFor', 'lagWas', 'lagAge', 'slowRaw', 'glide', 'lagAim', 'timeRate', 'shockLast', 'shockPeak', 'shockSet']);
  }

  /**
   * Forget everything in flight (clouds, the bed, the stun): the mix has
   * been silenced, and none of it should come back when sound does.
   */
  reset() {
    this.cE.fill(0);
    this.clouds = 0;
    this.touched.fill(0);
    this.bedE = 0; this.bedIn = 0; this.bedSide = 0; this.bedSideIn = 0; this.bedPeak = 0; this.bedWet = 0; this.bedWetIn = 0;
    this.strainE = 0; this.strainIn = 0; this.strainSide = 0; this.strainSideIn = 0; this.groanSet = 0;
    if (this.bedSet !== 0) { this.bedSet = 0; this.mixer.setBed(0, 0); }
    this.fireE = 0; this.fireIn = 0; this.fireSide = 0; this.fireSideIn = 0; this.fireDist = 0; this.fireDistIn = 0;
    this.fireCrack = 0; this.fireCrackIn = 0; this.fireRoar = 0; this.fireRoarIn = 0; this.roarSet = 0; this.fireSays = false;
    this.hornSet = false;
    if (this.fireSet !== 0) { this.fireSet = 0; this.mixer.setFire(0, 0, 20000); }
    this.stun = 0;
    this.occUntil.fill(-1);
    this.wN = 0; this.wGo = 0;
    // (A press the old world never answered is one the count knows of; and
    // the new world's first rifle shot is a first shot, not one of a burst.)
    if (this.owedAny !== 0) { for (let i = 0; i < PRESS_TOOLS; i++) this.pressesLapsed += this.owed[i]; }
    this.owed.fill(0); this.owedAny = 0; this.rifleAt = -1;
    // (A new world runs at its own speed until it says otherwise.)
    this.slowRate = 1; this.far = 1; this.farTo = 1; this.realAcc = 0; this.simAcc = 0; this.still = 0; this.slowSeen = 0; this.gameAhead = 0; this.paceWas = -1;
    this.lag = 0; this.lowFor = 0; this.lagWas = 0; this.lagAge = 0; this.slowRaw = 1; this.stall = 0; this.measuring = 0; this.glide = SLOW_GLIDE; this.lagAim = 1; this.timeRate = 1; this.share = 1; this.farW = 1; this.pWait = 0; this.pTyp = SIM_DT; this.paced(1);
    if (this.slow !== 1) { this.slow = 1; this.mixer.setSlow(1); }
    if (this.stopped) { this.stopped = false; this.mixer.setStopped(false); }
    this.air = false;
    // (The mixer hears again; if the player is still deaf the next look at
    // the engine's figure says so.)
    this.shockSet = 0;
    // (The mixer has stopped the drones; an engine still running is brought
    // back by the next look at its state, without its starter.)
    this.jetHold = 0; this.jetOn = false; this.jetDry = false;
    this.lastNow = -1;
  }

  /**
   * Spatialise a source for the recipes: mixer.locate(), then whatever the
   * world puts in the way (when the engine can say).
   */
  place(x, y, z, ref) {
    const m = this.mixer;
    m.locate(x, y, z, ref);
    if (this.engine !== null && m.sDist > 1.5) {
      // What is in the way is asked of the world once per place and
      // moment: sounds of a collapse come from the same few metres frame
      // after frame, and each question is a ray marched through the world
      // (18 us in the high-rise; with everything coming down that was a
      // tenth of update()). An answer is kept for a quarter of a second,
      // for sources in the same two-metre cell heard from the same one.
      const key = (((x * 0.5) | 0) * 73856093) ^ (((y * 0.5) | 0) * 19349663) ^ (((z * 0.5) | 0) * 83492791) ^ (((m.lx * 0.5) | 0) * 2654435761) ^ (((m.ly * 0.5) | 0) * 40503) ^ (((m.lz * 0.5) | 0) * 2246822519);
      const slot = (key ^ (key >>> 15)) & (OCC_SLOTS - 1);
      let solid;
      if (this.occKey[slot] === key && m.now < this.occUntil[slot]) {
        solid = this.occSolid[slot];
      } else {
        solid = this.engine.acousticOcclusion(m.lx, m.ly, m.lz, x, y, z);
        this.occKey[slot] = key; this.occSolid[slot] = solid; this.occUntil[slot] = m.now + OCC_KEEP;
        this.occAsked++;
      }
      if (solid > 0) m.occlude(solid);
    }
  }

  /**
   * How fast the shell means the world to run (the game's time scale: 1,
   * 0.2 in slow motion, 0 while it is held or stopped), before the frame's
   * state and events; under 0 or not a number when nobody says, and the
   * director then reads it off the frames' steps.
   */
  pace(rate) {
    // (Up to sixteen times: a replay at four times was taken for twice, and
    // a bomb's whistle rose as it fell, chasing a landing twice as near as
    // it was told.)
    this.paceSaid = rate >= 0 ? (rate < 16 ? +rate : 16) : -1;
  }

  // The world runs at `r` of its speed, as far as is now known (`k`: how
  // far to go towards it): what is heard of the world from here on is as
  // slow. Not for a machine that is a little behind: only under SLOW_FROM
  // of the world's speed, and then by less than the world slows (a fifth
  // of the speed is an octave down, not two and a third).
  // What is known of the share of its pace the world keeps is carried
  // over a change of the shell's word (or is all of it, at the start):
  // half a second's worth at that share, which the next second replaces.
  paced(said) {
    this.pReal.fill(0); this.pSim.fill(0);
    this.pReal[0] = 0.5; this.pSim[0] = 0.5 * said * this.share;
    this.pBin = 1; this.pWait = 0;
  }

  runAt(r, k) {
    if (r > 2) r = 2;
    this.slowRate += (r - this.slowRate) * k;
    const w = this.slowRate;
    // (And how much longer it will take when the figure has got to where
    // it is going: what a whistle is timed to. Timed to the figure on its
    // way, a whistle 40 m off was 135 ms from over when its blast came.)
    this.farTo = r >= 1 ? 1 : 1 / (r > SLOW_MIN * 0.4 ? r : SLOW_MIN * 0.4);
    // (How much longer a sound takes to arrive goes with the world's speed
    // all the way: it was 1 down to three quarters and a third more just
    // under, and at three quarters it flipped.)
    this.far = w >= 1 ? 1 : 1 / (w > SLOW_MIN * 0.4 ? w : SLOW_MIN * 0.4);
    const raw = w >= SLOW_FROM ? 1 : Math.max(SLOW_MIN, Math.pow(w / SLOW_FROM, SLOW_POWER));
    // In steps of 3%, and a new step only when the figure is three
    // quarters of a step away from the one it is on, or has come to rest:
    // a speed that wavers by a hundredth is one speed.
    const off = raw > this.slow ? raw / this.slow : this.slow / raw, rests = raw === this.slowRaw;
    this.slowRaw = raw;
    if (off > 1.0228 || rests) {
      const slow = raw === 1 ? 1 : quant(raw, 0.03);
      if (slow !== this.slow) {
        this.slow = slow;
        this.mixer.setSlow(slow);
      }
    }
  }

  /** One sound through the mixer; returns 1 if it got a voice. (`which`:
   *  which of the sound's variants, 0..1; by chance when not given.) */
  fire(snd, when, gain, rate, cut, pan, send, prio, big, which) {
    const m = this.mixer;
    // In slow motion what happens is heard as slowly as it is seen: lower,
    // longer, and as much later as its sound has further to come.
    if (this.slow !== 1) {
      rate *= this.slow;
      const ahead = when - this.t0;
      if (ahead > 0) when = this.t0 + ahead * this.far;
    }
    const buf = m.pick(snd, which === undefined ? rnd() : which);
    // (The player's own shot, at the press: now, whatever the frame before spent.)
    if (this.pressing) return m.playAtOnce(buf, when, gain, rate, cut, pan, send, prio, big, TAU[snd]);
    return m.play(buf, when, gain, rate, cut, pan, send, prio, big, TAU[snd]);
  }

  // ---------------------------------------------------------------- recipes --
  // Each returns the number of voices it started. `scale` is 1 for a real
  // event and the level-matching factor for a cloud grain; `jit` is the
  // onset jitter in seconds.

  impact(x, y, z, j, mat, v, scale, jit) {
    const m = this.mixer;
    const cls = mClass[mat];
    this.place(x, y, z, cRef[cls]);
    const amp = ampImpact(j, v) * mGain[mat] * cImpactGain[cls] * scale * m.sGain;
    const when = this.t0 + m.sDelay + jit;
    // Effective mass of the collision: heavier things are lower and, because
    // a slower buffer is also a longer one, ring longer.
    const mass = j / (v > 0.3 ? v : 0.3);
    const rate = clamp(1.9 * Math.pow(mass > 0.1 ? mass : 0.1, -0.11), 0.5, 1.9) * mPitch[mat] * (0.92 + 0.16 * rnd());
    // Closing speed sets the contact time and so the brightness.
    let cut = 700 * Math.pow(1 + v, 1.35) * mBright[mat] * cBright[cls];
    if (cut > m.sCut) cut = m.sCut;
    // (Sheet is a panel: its own short boom and rattle, not a bar's ring.)
    const sheet = (mFlags[mat] & SHEET) !== 0;
    let n = this.fire(sheet ? SND.imp_sheet : cImpact[cls], when, amp, sheet ? rate * (1 / 1.45) : rate, cut, m.sPan, 0.2 * m.sWet, 1, false);
    if ((mFlags[mat] & REBAR) !== 0 && amp > 0.08) {
      n += this.fire(SND.imp_metal, when, amp * 0.22, rate * 0.9, cut * 2, m.sPan, 0.15 * m.sWet, 0.6, false);
    }
    if (j > 2500) {
      // Weight: a low thud under anything heavy. Lows carry further.
      const h = Math.log10(j / 2500);
      const g = clamp(0.25 + 0.3 * h, 0, 1) * scale * Math.pow(m.sGain, 0.7);
      n += this.fire(SND.rumble_hit, when, g, clamp(1.15 - 0.12 * h, 0.7, 1.15), 1200, m.sPan * 0.5, 0.2 * m.sWet, 1.5, false);
    }
    return n;
  }

  breakage(x, y, z, count, mat, scale, jit) {
    const cls = mClass[mat];
    if (cls === C_GLASS) return this.glass(x, y, z, count, scale, jit);
    const m = this.mixer;
    this.place(x, y, z, cRef[cls] * 1.5);
    const amp = ampBreak(count) * mGain[mat] * scale * m.sGain;
    const when = this.t0 + m.sDelay + jit;
    const rate = clamp(1.5 * Math.pow(count > 1 ? count : 1, -0.1), 0.6, 1.5) * mPitch[mat] * cTearRate[cls] * (0.92 + 0.16 * rnd());
    const cut = m.sCut * clamp(mBright[mat], 0.5, 1) * cTearCut[cls];
    // (Sheet gives way by folding: the crunch a vehicle's body makes.)
    const sheet = (mFlags[mat] & SHEET) !== 0;
    let n = this.fire(sheet ? SND.veh_crunch : cBreak[cls], when, amp, sheet ? rate * (1 / 1.45) : rate, cut, m.sPan, 0.25 * m.sWet, 1.2, false);
    if (count > 250) {
      const h = Math.log10(count / 250);
      const g = clamp(0.3 + 0.25 * h, 0, 0.9) * scale * Math.pow(m.sGain, 0.7);
      n += this.fire(SND.rumble_hit, when, g, clamp(1.1 - 0.12 * h, 0.7, 1.1), 1200, m.sPan * 0.5, 0.2 * m.sWet, 1.5, false);
    }
    return n;
  }

  glass(x, y, z, count, scale, jit) {
    const m = this.mixer;
    this.place(x, y, z, 4);
    const amp = ampGlass(count) * scale * m.sGain;
    const when = this.t0 + m.sDelay + jit;
    const pan = m.sPan, cut = m.sCut, wet = m.sWet;
    let n = this.fire(SND.brk_glass, when, amp, 0.9 + 0.25 * rnd(), cut, pan, 0.25 * wet, 1.5, false);
    // The shower: more glass, more waves of shards, spread over half a second.
    const showers = clamp(Math.round(Math.log2(count + 1)) - 1, 0, 5);
    for (let k = 0; k < showers; k++) {
      n += this.fire(SND.tinkle, when + 0.06 + k * 0.09 + 0.06 * rnd(), amp * (0.7 - 0.1 * k), 0.8 + 0.5 * rnd(),
        cut, pan + 0.3 * (rnd() - 0.5), 0.2 * wet, 0.8, false);
    }
    return n;
  }

  crack(x, y, z, ratio, mat, scale, jit) {
    const m = this.mixer;
    const cls = mClass[mat];
    this.place(x, y, z, 5);
    const amp = ampCrack(ratio) * mGain[mat] * scale * m.sGain;
    return this.fire(cCrack[cls], this.t0 + m.sDelay + jit, amp, mPitch[mat] * cTearRate[cls] * (0.85 + 0.35 * rnd()), m.sCut * cTearCut[cls], m.sPan, 0.3 * m.sWet, 1, false);
  }

  detach(x, y, z, mass, mat, scale, jit) {
    const m = this.mixer;
    const cls = mClass[mat];
    this.place(x, y, z, 5);
    const amp = ampDetach(mass) * scale * m.sGain;
    const when = this.t0 + m.sDelay + jit;
    const lm = Math.log10(mass > 1 ? mass : 1);
    let n = this.fire(cDetach[cls], when, amp, clamp(1.7 - 0.22 * lm, 0.6, 1.5) * cTearRate[cls] * (0.92 + 0.16 * rnd()), m.sCut * cTearCut[cls], m.sPan, 0.3 * m.sWet, 1.4, false);
    if (mass > 150) {
      const h = lm - 2.176;
      const g = clamp(0.2 + 0.22 * h, 0, 1) * scale * Math.pow(m.sGain, 0.7);
      n += this.fire(SND.rumble_hit, when + 0.02, g, clamp(1.2 - 0.13 * h, 0.65, 1.2), 1200, m.sPan * 0.5, 0.2 * m.sWet, 1.6, false);
    }
    return n;
  }

  creak(x, y, z, ratio, mat, nodes) {
    const m = this.mixer;
    let cls = mClass[mat];
    // Reinforced concrete groans as concrete or as its steel, at random.
    if ((mFlags[mat] & REBAR) !== 0 && rnd() < 0.5) cls = C_METAL;
    const snd = cCreak[cls];
    if (snd < 0) return 0;
    this.place(x, y, z, 6);
    const amp = ampCreak(ratio) * m.sGain;
    // (Lower the bigger the frame it is part of, where the engine says.)
    const size = nodes > 0 ? frameRate(nodes) * (1 / 1.08) : 1;
    return this.fire(snd, this.t0 + m.sDelay, amp, (0.8 + 0.45 * rnd()) * size, m.sCut, m.sPan, 0.3 * m.sWet, 1.1, false);
  }

  // A frame is going (see STRAIN_TAU): `n` of its connections were
  // condemned at this check, and it is `nodes` big. Its groan now, by how
  // many and how big; and strain for the moan that holds between one such
  // record and the next, so that the seconds before a building comes down
  // are heard as one thing rising and not as creaks apart.
  going(x, y, z, mat, n, nodes) {
    const m = this.mixer;
    let cls = mClass[mat];
    if ((mFlags[mat] & REBAR) !== 0 && rnd() < 0.5) cls = C_METAL;
    this.place(x, y, z, 10);
    if (!(n >= 1)) n = 1; else if (n > 4096) n = 4096;
    const many = Math.log2(1 + n);
    const d = m.sDist, g = d > STRAIN_REF ? STRAIN_REF / d : 1;
    const s = n * g * g;
    this.strainIn += s;
    this.strainSideIn += s * m.sPan;
    // (The biggest frame that is going is the one that moans: a scrap's
    // record after the building's does not send the note back up.)
    if (nodes > this.strainNodes) this.strainNodes = nodes;
    const snd = cCreak[cls];
    if (snd < 0) return 0;
    const amp = clamp(0.06 + 0.045 * many, 0.08, 0.36) * m.sGain;
    return this.fire(snd, this.t0 + m.sDelay, amp, frameRate(nodes) * (0.85 + 0.2 * rnd()), m.sCut, m.sPan, 0.35 * m.sWet, 1.6, false);
  }

  // The moan of what is going (going()). How loud is how much has let go
  // since it began (the count of connections, by distance), not how much
  // let go at the last look: a building on its way down is heard further
  // on its way each second, whatever the size of each step. It holds
  // between one record and the next and dies away when they stop.
  strain(dt) {
    if (!(this.strainE >= 0)) this.strainE = 0;
    if (!(this.strainIn >= 0)) this.strainIn = 0;
    if (!(this.strainSide - this.strainSide === 0)) this.strainSide = 0;
    if (!(this.strainSideIn - this.strainSideIn === 0)) this.strainSideIn = 0;
    this.strainQuiet = this.strainIn > 0 ? 0 : this.strainQuiet + dt;
    const total = this.strainE + this.strainIn, sided = this.strainSide + this.strainSideIn;
    // (What has let go is forgotten slowly while it goes on, and at once
    // when it has stopped: the next thing to go starts from nothing.)
    const over = this.strainQuiet > STRAIN_HOLD;
    // (Over: the moan is what dies away, in STRAIN_OUT, however much had
    // let go. Its level goes by the count's logarithm, so the count is
    // taken down by a root, not a fraction: by a fraction a tower's moan
    // outlasted its cause by six seconds.)
    const held = total > STRAIN_MOST ? STRAIN_MOST : total;
    const fade = over ? Math.pow(1 + held, Math.exp(-dt / STRAIN_OUT)) - 1 : held * Math.exp(-dt / STRAIN_TAU);
    this.strainSide = total > 0 ? sided * (fade / total) : 0;
    this.strainE = fade;
    this.strainIn = 0; this.strainSideIn = 0;
    if (this.strainE <= 1e-3) {
      if (this.groanSet !== 0) { this.groanSet = 0; this.mixer.drone(DR_GROAN, 0, 0, 1, 20000, 0); }
      this.strainE = 0; this.strainSide = 0; this.strainNodes = 0;
      return;
    }
    const level = clamp(Math.log2(1 + total) * (1 / 8), 0, 1);
    const nodes = this.strainNodes > 0 ? this.strainNodes : 1000;
    const big = clamp(Math.log10(nodes) * (1 / 3.5), 0.4, 1.2);
    const set = level < 0.08 ? 0 : step(GROAN_LEVEL * level * big);
    if (Math.abs(set - this.groanSet) > 0.008 || (set === 0 && this.groanSet !== 0)) {
      this.groanSet = set;
      this.mixer.drone(DR_GROAN, SND.loop_groan, set, quant(frameRate(nodes), 0.03), quant(280 + 1100 * level, 0.12), clamp(sided / total, -1, 1) * 0.7);
    }
  }

  step(x, y, z, speed, mat, wet) {
    const m = this.mixer;
    const cls = mClass[mat];
    this.place(x, y, z, 2);
    const amp = clamp(0.05 + 0.02 * speed, 0.05, 0.5) * m.sGain;
    const when = this.t0 + m.sDelay;
    const hard = speed > 7;
    let cut = 3000 + 1500 * speed;
    if (cut > m.sCut) cut = m.sCut;
    // Alternate feet a little left and right of centre.
    this.foot = -this.foot;
    const pan = m.sPan + this.foot * 0.08;
    // Anything broken and lying loose crunches, whatever it was; a carpet
    // takes the footfall whatever it lies on.
    const fl = mFlags[mat];
    const snd = (fl & HUSHED) !== 0 ? SND.step_soft : (fl & LOOSE) !== 0 && cls !== C_SOFT && cls !== C_LEAF ? SND.step_gravel : cStep[cls];
    if (wet) {
      // A foot through water: the bed is muffled under the slosh, a short
      // wash of spray and the drops falling back.
      let n = this.fire(snd, when, amp * 0.4, 0.8 + 0.15 * rnd(), cut * 0.25, pan, 0.05, 1, false);
      n += this.fire(SND.imp_leaf, when, amp * 1.1, 0.5 + 0.15 * rnd(), 2600 + 500 * speed, pan, 0.1, 1.5, false);
      n += this.fire(SND.brk_soft, when + 0.02, amp * 0.5, 1.25 + 0.3 * rnd(), 1800, pan, 0.08, 0.8, false);
      return n;
    }
    let n = this.fire(snd, when, (fl & HUSHED) !== 0 ? amp * 0.6 : amp, (0.9 + 0.22 * rnd()) * (hard ? 0.85 : 1), cut, pan, 0.08, 1.5, false);
    if (cls === C_LEAF) n += this.fire(SND.imp_leaf, when, amp * 0.6, 1 + 0.3 * rnd(), cut, pan, 0.05, 0.8, false);
    if (hard) n += this.fire(SND.rumble_hit, when, clamp((speed - 7) * 0.06, 0, 0.5) * m.sGain, 1.3, 1200, pan, 0.1, 1.2, false);
    return n;
  }

  // Something going into water (`ev::SPLASH`: `j` the blow in N s, `v` the
  // speed it went in at, `who`: 0 a body, 1 the player, 2 a blast in the
  // water, whose `j` is the water it threw). The splash, slower and so
  // lower and longer the heavier the blow; a thump under a heavy one; and
  // for a blast a column of it, coming down for a second after.
  splash(x, y, z, j, v, who) {
    const m = this.mixer;
    this.place(x, y, z, 4);
    const when = this.t0 + m.sDelay;
    const size = Math.log10(j > 10 ? j : 10) - 1;       // 0: a brick let fall; 2: a crate from a height; 3 and up: a slab
    const amp = ampSplash(j) * m.sGain * (who === 1 ? 0.7 : 1);
    const rate = clamp(1.35 - 0.22 * size, 0.5, 1.35) * (0.92 + 0.16 * rnd());
    let cut = clamp(9000 - 1500 * size, 2500, 9000) + 250 * (v < 12 ? v : 12);
    if (cut > m.sCut) cut = m.sCut;
    let n = this.fire(SND.splash, when, amp, rate, cut, m.sPan, 0.25 * m.sWet, 1.2, false);
    if (who === 2) n += this.fire(SND.splash, when + 0.18 + 0.1 * rnd(), amp * 0.7, rate * 0.7, cut, m.sPan + 0.2 * (rnd() - 0.5), 0.3 * m.sWet, 1, false);
    if (j > 2500) {
      const h = Math.log10(j / 2500);
      n += this.fire(SND.rumble_hit, when, clamp(0.2 + 0.25 * h, 0, 0.8) * Math.pow(m.sGain, 0.7), clamp(1.1 - 0.12 * h, 0.7, 1.1), 900, m.sPan * 0.5, 0.2 * m.sWet, 1.3, false);
    }
    return n;
  }

  // Water on the move, heard as one thing where most of it moves (the
  // frame's water block, or `frame.water` = [litres a second, x, z] where a
  // tool's frame says it so): looked at with the rest of the frame's state.
  flood(frame) {
    let flow = 0, fx = 0, fz = 0;
    const said = frame.water;
    if (said) { flow = said[0]; fx = said[1]; fz = said[2]; }
    else if (W_FLOW !== undefined && frame.out && frame.f32) {
      const p = frame.out[OUT.WATER_PTR] >> 2;
      if (p > 0) { flow = frame.f32[p + W_FLOW]; fx = frame.f32[p + W_FLOW_X]; fz = frame.f32[p + W_FLOW_Z]; }
    }
    const m = this.mixer;
    // Two things are water going on: what is on the move (a tank holed, a
    // flood), and a river in its bed. One voice for both, and it is both:
    // as loud as the louder, and between them in speed, in brightness and
    // in place by how loud each is. (The louder alone had it at first: with
    // something fallen into the river the two were as loud as each other,
    // and the voice changed hands 22 times in four seconds, a third of an
    // octave each time.)
    let set = 0, rate = 1, cut = 20000, pan = 0;
    if (flow > FLOOD_FROM && fx - fx === 0 && fz - fz === 0) {
      // (By the decade: ten times the water is not ten times the noise.)
      const level = clamp(Math.log10(flow / FLOOD_FROM) / Math.log10(FLOOD_FULL / FLOOD_FROM), 0, 1);
      m.locate(fx, m.ly, fz, FLOOD_REF);
      set = FLOOD_LEVEL * (0.25 + 0.75 * level) * m.sGain;
      rate = 0.8 + 0.35 * level;
      cut = (1800 + 5000 * level) * (m.sCut < 20000 ? m.sCut / 20000 : 1) + 400;
      pan = m.sPan * 0.8;
    }
    const river = this.river(frame);
    if (river > 0) {
      // (A river runs, it does not rush: lower and duller than a flood.)
      const u = this.rvSpeed, share = river / (river + set);
      rate += (0.62 + 0.2 * u - rate) * share;
      cut += ((900 + 2600 * u) * (this.rvCut < 20000 ? this.rvCut / 20000 : 1) + 300 - cut) * share;
      pan += (this.rvPan * 0.8 - pan) * share;
      if (river > set) set = river;
    }
    if (set < 0.008) {
      if (this.floodSet !== 0) { this.floodSet = 0; m.drone(DR_WATER, 0, 0, 1, 20000, 0); }
      return;
    }
    set = step(set);
    this.floodSet = set;
    m.drone(DR_WATER, SND.loop_water, set, quant(rate, 0.03), quant(cut, 0.12), step(pan));
  }

  // A river: standing water with a current (the water block's rectangles,
  // `[x0, z0, x1, z1, level, current x, current z, depth]`, or a frame's
  // `rivers` in the same form). Returns how loud the nearest one that runs
  // is where the listener stands (0: none), and leaves how fast it runs
  // (0..1), its side and how the world between dulls it in rvSpeed, rvPan
  // and rvCut. Heard from the nearest point of its surface.
  river(frame) {
    let f = frame.rivers, at = 0, n = 0;
    if (f !== undefined) n = f ? (f.length / W_RECT) | 0 : 0;
    else if (W_RECT > 0 && frame.out && frame.u32 && frame.f32) {
      const p = frame.out[OUT.WATER_PTR] >> 2;
      if (p > 0) { n = frame.u32[p + WATER.RECT_COUNT]; at = frame.u32[p + WATER.RECT_PTR] >> 2; f = frame.f32; }
    }
    if (!(n > 0)) return 0;
    if (n > RIVER_MOST) n = RIVER_MOST;
    const m = this.mixer, lx = m.lx, ly = m.ly, lz = m.lz;
    let best = 0, bx = 0, by = 0, bz = 0, bu = 0;
    for (let i = 0, p = at; i < n; i++, p += W_RECT) {
      const cx = f[p + RECT_CX], cz = f[p + RECT_CZ];
      const speed = Math.sqrt(cx * cx + cz * cz);
      if (!(speed > RIVER_FROM)) continue;
      const x0 = f[p + RECT_X0], z0 = f[p + RECT_Z0], x1 = f[p + RECT_X1], z1 = f[p + RECT_Z1], y = f[p + RECT_LEVEL];
      const x = lx < x0 ? x0 : lx > x1 ? x1 : lx, z = lz < z0 ? z0 : lz > z1 ? z1 : lz;
      const dx = x - lx, dy = y - ly, dz = z - lz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // (Not a number anywhere in it: not a river.)
      if (!(d - d === 0)) continue;
      const u = speed < RIVER_FULL ? (speed - RIVER_FROM) / (RIVER_FULL - RIVER_FROM) : 1;
      const g = (0.4 + 0.6 * u) * (d > RIVER_REF ? RIVER_REF / d : 1);
      if (g > best) { best = g; bx = x; by = y; bz = z; bu = u; }
    }
    if (best === 0) return 0;
    // (With what the world puts between: a river down in its gorge is not
    // heard through the rock as if the rock were not there.)
    this.place(bx, by, bz, RIVER_REF);
    this.rvSpeed = bu; this.rvPan = m.sPan; this.rvCut = m.sCut;
    return RIVER_LEVEL * (0.4 + 0.6 * bu) * m.sGain;
  }

  // `tool` is the engine's tool id (`TOOL` in engine.js, `tools::tool`).
  // (Until the second sound engineer this switch counted from one where the
  // engine counts from zero, and every tool played its neighbour's sound:
  // the rifle swung a hammer, the spawner fired the cannon.)
  // The player's own shot, begun at the press: the game says when a
  // press is one the world will answer with a shot of `tool` (with the
  // simulation on its own thread the world's record of it comes a frame
  // later, and the gun was heard a frame after the hand). Its sound
  // starts now, at the muzzle, and the world's record of it is
  // not heard again (frame()); a press the world then refuses has been
  // heard, and is not cut short. Returns the voices it started.
  press(tool) {
    const m = this.mixer;
    // (Only what makes its shot at the press: a charge, a strike or the
    // gravity gun answers when the world does.)
    if (this.stopped || !(tool === TOOL.RIFLE || tool === TOOL.SHOTGUN || tool === TOOL.ROCKET || tool === TOOL.CANNON || tool === TOOL.HAMMER)) return 0;
    // (Where the engine puts the shot's record: its muzzle, a little
    // right of and below the eye, `tools::muzzle`; the hammer's 0.6 m
    // ahead. So the sound at the press is the sound its record makes.)
    const hammer = tool === TOOL.HAMMER, ahead = hammer ? 0.6 : 0.45, right = hammer ? 0 : 0.16, up = hammer ? 0 : -0.12;
    this.pressing = true;
    const n = this.shot(
      m.lx + ahead * m.fx + right * m.rx + up * (-m.rz * m.fy),
      m.ly + ahead * m.fy + up * (m.rz * m.fx - m.rx * m.fz),
      m.lz + ahead * m.fz + right * m.rz + up * (m.rx * m.fy), tool);
    this.pressing = false;
    // (Nothing begun, no voice to be had or a sound not yet made: the
    // world's record of the shot is still to be heard.)
    if (n === 0) return 0;
    this.tokBig -= n;
    if (this.owed[tool] === 0) this.owedAny++;
    if (this.owed[tool] < 255) this.owed[tool]++;
    this.owedLeft[tool] = PRESS_FRAMES;
    this.presses++;
    return n;
  }

  shot(x, y, z, tool) {
    const m = this.mixer;
    const guns = tool === TOOL.RIFLE || tool === TOOL.SHOTGUN || tool === TOOL.CANNON;
    // (A strike's shot is at the mark, which may be a street away.)
    this.place(x, y, z, guns ? 25 : tool === TOOL.STRIKE ? 12 : 4);
    const when = this.t0 + m.sDelay;
    const g = m.sGain, cut = m.sCut, pan = m.sPan, wet = m.sWet;
    const r = 0.96 + 0.09 * rnd();
    switch (tool) {
      case TOOL.HAMMER: // the swing, then the tool's own thunk as it lands
        return this.fire(SND.whoosh, when, 0.22 * g, 0.9 + 0.25 * rnd(), cut, pan, 0.05, 1.5, false)
          + this.fire(SND.hammer_hit, when + 0.07, 0.18 * g, r, cut, pan, 0.08, 1.5, false);
      case TOOL.RIFLE: {
        // Held down it fires nine a second: the first shot is the gun, the
        // ones that follow within a quarter of a second ride on it, a
        // little under it and with less of the street's echo each (the
        // echoes of a burst are one echo, not nine laid end on end).
        const burst = m.now - this.rifleAt < RIFLE_BURST;
        this.rifleAt = m.now;
        return this.fire(SND.rifle, when, (burst ? 0.75 : 1) * GUN_RIFLE * g, r, cut, pan, (burst ? 0.3 : 0.8) * wet, 3, true);
      }
      case TOOL.SHOTGUN:
        return this.fire(SND.shotgun, when, GUN_SHOTGUN * g, r, cut, pan, 0.8 * wet, 3, true);
      case TOOL.ROCKET:
        return this.fire(SND.rocket, when, 0.55 * g, r, cut, pan, 0.3 * wet, 2.5, true);
      case TOOL.CHARGE:
        return this.fire(SND.beep, when, 0.12 * g, 1, cut, pan, 0.05, 2, false)
          + this.fire(SND.hammer_hit, when, 0.12 * g, 0.8, cut, pan, 0.05, 1, false);
      case TOOL.GRAVITY:
        return this.fire(SND.grav, when, 0.28 * g, r, cut, pan, 0.15, 2, false);
      case TOOL.CANNON:
        this.bedIn += g * g;
        return this.fire(SND.cannon, when, GUN_CANNON * g, r, cut, pan, 0.8 * wet, 3.5, true);
      case TOOL.SPAWNER:
        return this.fire(SND.pop, when, 0.22 * g, r, cut, pan, 0.1, 1.5, false);
      case TOOL.SATCHEL: // thrown: the swing, the canvas, the fuse lit
        return this.fire(SND.satchel_throw, when, 0.22 * g, r, cut, pan, 0.1 * wet, 1.8, false);
      case TOOL.BREACH: // set against the wall and armed
        return this.fire(SND.breach_set, when, 0.25 * g, r, cut, pan, 0.08, 2, false);
      case TOOL.STRIKE:
        // Called: the marker flare catches where the player pointed, and the
        // handset answers in their ear (no place, no distance, no room).
        return this.fire(SND.flare, when, 0.4 * g, r, cut, pan, 0.2 * wet, 1.5, false) + this.handset(0.1);
      default:
        return this.fire(SND.pop, when, 0.15 * g, r, cut, pan, 0.1, 1.5, false);
    }
  }

  // The handset's answer to a strike being called. The tool says it was
  // called and so may the game being played: one word, whoever says it.
  handset(gain) {
    const m = this.mixer;
    if (m.now - this.radioAt < 0.5) return 0;
    this.radioAt = m.now;
    return m.ui(m.pick(SND.radio, rnd()), this.t0, gain, 1);
  }

  // The game speaks (`ev::SCORE`, Mayhem): `what` is a SAID, `mag` and `b`
  // what that one carries. In the game's own voice: not in the street.
  said(what, mag, b) {
    const m = this.mixer, t = this.t0;
    const link = SOUNDS[SND.score_link].base;
    switch (what) {
      case SAID.CHAIN: {
        // A link: one note, a step up the scale for every step of the
        // multiplier (b), so a chain is heard climbing.
        return m.ui(link, t, 0.13, LINK_SCALE[linkStep(b)]);
      }
      case SAID.SLIP: {
        // The multiplier lost a step (b is what it is now): the link it
        // had, and under it the one it has, falling and quieter. A chain
        // going is a run of these, a second apart, down to nothing.
        const now = linkStep(b), was = now + 1 < LINK_SCALE.length ? now + 1 : now;
        return m.ui(link, t, 0.07, LINK_SCALE[was]) + m.ui(link, t + 0.09, 0.09, LINK_SCALE[now] * 0.5);
      }
      case SAID.COLLAPSE:
        // (In a contract, b = -1: the target itself has let go. The moment
        // of the job; the same call, stronger.)
        return m.ui(SOUNDS[SND.score_going].base, t, b < 0 ? 0.22 : 0.16, 1);
      case SAID.LEVELLED:
        return m.ui(SOUNDS[SND.score_down].base, t, 0.2, 1);
      case SAID.SWEEP:
        // Every structure down with time to spare: the scale run up.
        return m.ui(link, t, 0.11, LINK_SCALE[0]) + m.ui(link, t + 0.07, 0.12, LINK_SCALE[2]) + m.ui(link, t + 0.14, 0.13, LINK_SCALE[4]) + m.ui(link, t + 0.21, 0.15, LINK_SCALE[7]);
      case SAID.TIME:
        // (b = 1: the scene was swept clean, and SWEEP has said so. The
        // horn is for a clock that ran out.)
        return b === 1 ? 0 : m.ui(SOUNDS[SND.score_time].base, t, 0.12, 1);
      case SAID.FINAL: {
        // With the card it belongs to (the page shows it CARD_DELAY after
        // the record). b is the medal; -1 a job lost: the same as none,
        // lower.
        const s = SOUNDS[SND.score_final];
        const medal = b >= 0 ? (b < s.variants ? b | 0 : s.variants - 1) : 0;
        return m.ui(s.base + medal, t + CARD_DELAY, 0.22, b < 0 ? 0.75 : 1);
      }
      case SAID.STRIKE:
        // One earned (0); one called (seconds until it lands: the bombs
        // have their own whistle, the call a word on the handset); the
        // button pressed to no effect (below 0): a dull no.
        if (mag > 0) return this.handset(0.09);
        if (mag < 0) return m.ui(SOUNDS[SND.score_no].base, t, 0.12, 1);
        return m.ui(SOUNDS[SND.score_strike].base, t, 0.12, 1);
      case SAID.DAMAGE:
        // A neighbour is paying for it (mag: dollars so far). Not more
        // than twice a second, however many records say so.
        if (m.now - this.damageAt < DAMAGE_GAP) return 0;
        this.damageAt = m.now;
        return m.ui(SOUNDS[SND.score_no].base, t, 0.1, 1.5) + m.ui(SOUNDS[SND.score_no].base, t + 0.11, 0.1, 1.26);
      case SAID.VOID:
        // The job is lost: the link's note falling an octave in three.
        return m.ui(link, t, 0.14, LINK_SCALE[4] * 0.5) + m.ui(link, t + 0.16, 0.14, LINK_SCALE[2] * 0.5) + m.ui(link, t + 0.32, 0.16, LINK_SCALE[0] * 0.5) + m.ui(SOUNDS[SND.score_no].base, t + 0.32, 0.14, 0.75);
      default:
        return 0;
    }
  }

  // What the frame says beyond its events (`sim.frame`, or what a tool's
  // stand-in for it holds): the game's clock, the vehicle being driven.
  // Call before frame(), once per update.
  //
  // Each is looked at every fourth frame, in different frames. That is
  // often enough (an engine's drones glide from one setting to the next;
  // the clock's ticks are scheduled ahead, on the second), and looking is
  // not free: asking the frame for a state view is a call into the engine,
  // and each setting written to a drone is a few microseconds of this
  // thread. Every frame, the two cost 6 us on foot and 19 us driving.
  state(frame) {
    // (What is started from here is started for this frame, not the last.)
    this.t0 = this.mixer.now + LEAD;
    // (A frame handed out again, as the worker's is when the display is
    // faster than the sim, brings its steps once.)
    const steps = frame.steps, seq = frame.seq;
    this.simSteps = steps >= 0 && steps < 1000 ? (seq !== undefined && seq === this.simSeq ? 0 : steps) : -1;
    this.simSeq = seq - seq === 0 ? seq : -1;
    // (A frame that is played back by a tool may say what the shell would.)
    if (frame.pace !== undefined) this.pace(frame.pace);
    this.vDt += this.dtLast;
    // (The horn at once, not at the vehicle's next look.)
    if (this.horn !== this.hornSet) this.honk(frame.vehicleState);
    this.vTick = (this.vTick + 1) & 3;
    if (this.vTick === 0) {
      this.vehicle(frame.vehicleState, this.vDt);
      this.vDt = 0;
    } else if (this.vTick === 2) {
      this.clock(frame.game);
    } else if (this.vTick === 1) {
      if (SHOCK !== undefined) this.shock(frame);
      if (TANK !== undefined) this.tank(frame.toolState);
    } else if (this.vTick === 3) {
      this.flood(frame);
    }
  }

  // How deaf the player is: the engine's figure for the shock of a blast
  // that reached them (`TOOL_STATE.SHOCK`: how hard it hit, falling away to
  // nothing over the seconds their ears ring, in the game's own time).
  // Following the figure, rather than timing an `ev::CONCUSSION`, is right
  // by construction in slow motion, through a pause, and when two blasts
  // overlap (the engine keeps the worse). The figure falls in a straight
  // line; ears do not open in one: they stay shut and then open. So the
  // depth stays at the figure's peak until the figure has fallen to
  // SHOCK_HOLD of it, and from there falls as the root of what is left.
  // Someone watching a replay was not there: they hear it all.
  shock(frame) {
    const ts = frame.toolState;
    let s = ts ? ts[SHOCK] : 0;
    if (!(s > 0)) s = 0; else if (s > 1) s = 1;
    if (s === 0 && this.shockSet === 0) { this.shockLast = 0; this.shockPeak = 0; return; }
    if (s > 0) {
      const rp = frame.replay;
      if (rp && rp[REPLAY.MODE] !== REPLAY_MODE.OFF) s = 0;
    }
    if (s > this.shockLast || s > this.shockPeak) this.shockPeak = s;
    if (s === 0) this.shockPeak = 0;
    this.shockLast = s;
    const part = s / (SHOCK_HOLD * (this.shockPeak > 0 ? this.shockPeak : 1));
    const depth = Math.round(this.shockPeak * (part < 1 ? Math.sqrt(part) : 1) * 64) * (1 / 64);
    if (depth !== this.shockSet) {
      this.shockSet = depth;
      this.mixer.deafen(depth);
      if (depth > this.stun) this.stun = depth;
    }
  }

  // The clock of a timed game, heard in its last seconds: a tick as each
  // whole second is reached. The clock is looked at every fifteenth of a
  // second, so a tick is scheduled when its second is less than a tenth
  // away, for the moment it comes; one that was missed all the same (a
  // stall) is played late rather than not at all.
  clock(game) {
    if (!game || game[GAME.MODE] === GAME_MODE.NONE || game[GAME.STATE] !== OBJ_STATE.RUNNING) { this.clockLeft = -1; return; }
    const rem = game[GAME.TIME] - game[GAME.CLOCK];
    if (!(rem > 0)) { this.clockLeft = -1; return; }
    const left = Math.ceil(rem);
    // (Not on the first look at a clock: a game joined at 0:07 does not tick
    // for the second it is already in.)
    if (this.clockLeft >= 0 && left < this.clockLeft && left !== this.clockDone) this.tick(left, 0);
    this.clockLeft = left;
    const next = left - 1, ahead = rem - next;
    if (ahead <= CLOCK_AHEAD && next !== this.clockDone) this.tick(next, ahead);
  }

  tick(left, ahead) {
    this.clockDone = left;
    if (left < 1 || left > CLOCK_LAST) return;
    this.mixer.ui(SOUNDS[SND.clock_tick].base + (left <= CLOCK_URGENT ? 1 : 0), this.t0 + ahead * this.far, left <= CLOCK_URGENT ? 0.14 : 0.1, 1);
  }

  // How many vehicles are wrecks, as the engine counts them. (A figure that
  // is not a number is not kept: nothing is greater than it, and no engine
  // would be heard to die again.)
  wrecks(n) { if (n - n === 0) this.vWrecks = n; }

  // The vehicle the player drives (`vehicleState()`; `dt` seconds since
  // the last call): its engine, its tyres, what it runs into. The engine
  // has no revs of its own in the simulation, so it is given a gearbox
  // here: revs follow the speed within a gear, drop at each change up, and
  // never fall below what the throttle holds them at (a clutch slipping
  // from rest, wheels in the air). Two loops, one of the engine turning
  // slowly and one of it turning fast, each played at the speed that puts
  // it at these revs, crossfaded.
  vehicle(vs, dt) {
    const m = this.mixer;
    if (!vs || !(vs[VEHICLE_STATE.DRIVING] > 0)) {
      if (this.vOn) {
        this.vOn = false;
        m.drone(DR_ENG_LO, 0, 0, 1, 20000, 0); m.drone(DR_ENG_HI, 0, 0, 1, 20000, 0);
        m.drone(DR_ROLL, 0, 0, 1, 20000, 0); m.drone(DR_SKID, 0, 0, 1, 20000, 0);
        m.drone(DR_GRIND, 0, 0, 1, 20000, 0); m.drone(DR_HORN, 0, 0, 1, 20000, 0);
        this.hornSet = false;
        // Put out of it because it is one vehicle fewer (the count of the
        // wrecked went up as the driving stopped): the engine did not
        // stop, it died, beside the driver who has just been put outside.
        // (Which of its two deaths goes by the count, not by chance: a run
        // with it and the same run without are then the same but for it.)
        if (vs && vs[VEHICLE_STATE.WRECKED] > this.vWrecks) this.fire(SND.eng_die, this.t0, WRECK_LEVEL, this.vKind === VEHICLE.CAR ? 1 : 0.8, 12000, 0, 0.15, 3, true, (vs[VEHICLE_STATE.WRECKED] & 1) * 0.6);
      }
      if (vs) { this.vRams = vs[VEHICLE_STATE.RAMS]; this.wrecks(vs[VEHICLE_STATE.WRECKED]); }
      return;
    }
    this.wrecks(vs[VEHICLE_STATE.WRECKED]);
    const kind = vs[VEHICLE_STATE.KIND] | 0;
    // (Another kind is another vehicle, however it was got into.)
    if (this.vOn && kind !== this.vKind) { this.vOn = false; this.hornSet = false; this.mixer.drone(DR_HORN, 0, 0, 1, 20000, 0); }
    this.vKind = kind;
    const diesel = kind !== VEHICLE.CAR;
    const heavy = kind === VEHICLE.TRUCK || kind === VEHICLE.DOZER;
    const top = vs[VEHICLE_STATE.TOP_SPEED] > 1 ? vs[VEHICLE_STATE.TOP_SPEED] : 1;
    let u = Math.abs(vs[VEHICLE_STATE.SPEED]) / top;
    if (!(u < 1.5)) u = u > 0 ? 1.5 : 0;
    let th = Math.abs(vs[VEHICLE_STATE.THROTTLE]);
    if (!(th <= 1)) th = th > 0 ? 1 : 0;
    const grounded = vs[VEHICLE_STATE.GROUNDED] > 0;
    if (!this.vOn) {
      // Getting in: the starter, and the engine comes up under it.
      this.vOn = true; this.vSince = 0; this.vGear = 0; this.vRev = REV_IDLE; this.vSlip = 0; this.vLoose = false; this.vPush = 0; this.vBrake = 0;
      this.vRams = vs[VEHICLE_STATE.RAMS];
      this.vWheels = vs[VEHICLE_STATE.WHEELS];
      this.fire(SND.eng_start, this.t0, 0.26, diesel ? 0.82 : 1.05, 7000, 0, 0.06, 2.5, false);
    }
    this.vSince += dt;
    let g = this.vGear;
    while (g < GEAR_TOP.length - 1 && u > GEAR_TOP[g] * GEAR_UP) g++;
    while (g > 0 && u < GEAR_TOP[g - 1] * GEAR_DOWN) g--;
    this.vGear = g;
    // How hard the drive leans on what holds the vehicle up (0..1, there
    // only with the throttle down against something): the engine labours,
    // pulled down in its revs and louder for it, and what it leans on is
    // ground against the blade or the bumper.
    let push = V_PUSH !== undefined ? vs[V_PUSH] : 0;
    if (!(push > 0)) push = 0; else if (push > 1) push = 1;
    this.vPush += (push - this.vPush) * (1 - Math.exp(-dt / 0.15));
    push = this.vPush;
    let want = u / GEAR_TOP[g];
    const held = REV_IDLE + (grounded ? 0.22 - 0.07 * push : 0.75) * th;
    if (want < held) want = held;
    if (want > 1.08) want = 1.08;
    this.vRev += (want - this.vRev) * (1 - Math.exp(-dt / REV_TAU));
    const rev = this.vRev;
    const rpm = diesel ? 650 + 1950 * rev : 850 + 5150 * rev;
    // Quantised (a hundredth of pitch, a sixth of a tone; a two-hundredth
    // of level; an eighth of the cutoff): the drones glide over the steps,
    // and a steady engine writes nothing.
    const x = clamp((rev - 0.2) * (1 / 0.45), 0, 1);
    const up = clamp((this.vSince - 0.45) * (1 / 0.35), 0, 1);
    const level = (0.07 + 0.1 * th + 0.05 * rev + 0.07 * push) * (heavy ? 1.25 : 1) * up;
    // (A diesel's knock is its sound at idle: its top stays open.)
    const inside = vs[VEHICLE_STATE.COCKPIT] > 0 ? 0.55 : 1;
    const cut = quant(inside * ((diesel ? 2400 : 700) + 2600 * th + 2200 * rev + 1500 * push), 0.12);
    m.drone(DR_ENG_LO, diesel ? SND.eng_diesel_lo : SND.eng_petrol_lo, step(level * Math.cos(x * 1.5708)), quant(rpm / (diesel ? 700 : 1000), 0.01), cut, 0);
    m.drone(DR_ENG_HI, diesel ? SND.eng_diesel_hi : SND.eng_petrol_hi, step(level * Math.sin(x * 1.5708)), quant(rpm / (diesel ? 2200 : 3600), 0.01), cut * 1.3, 0);
    // Tyres: the road under them by speed, and what they do when they
    // slide. The simulation says how fast the tyre that slides most slides
    // over the ground and on what: on a road it squeals, the higher the
    // faster; on what lies loose it throws the ground about. (An engine
    // that does not say is guessed at, from the handbrake and from
    // steering hard at speed.)
    const fast = u > 1 ? 1 : u;
    m.drone(DR_ROLL, SND.loop_pink, grounded ? step(0.1 * Math.pow(fast, 0.7)) : 0, quant(0.7 + 0.8 * fast, 0.04), quant(250 + 1400 * fast, 0.12), 0);
    let slip = 0, slide = 0;
    if (V_SLIP !== undefined) {
      slide = vs[V_SLIP];
      if (!(slide > 0)) slide = 0; else if (slide > 40) slide = 40;
      slip = clamp((slide - SLIP_FROM) * (1 / SLIP_FULL), 0, 1);
      // (What it slides on is looked at while it is quiet: one loop is not
      // swapped for the other in mid cry.)
      if (slip > 0 && this.vSlip < 0.05) this.vLoose = (mFlags[vs[V_SLIP_MAT] & 255] & LOOSE) !== 0;
    } else if (grounded) {
      const steer = Math.abs(vs[VEHICLE_STATE.STEER]);
      const turn = (steer * fast - 0.4) * 2.5;
      const brake = vs[VEHICLE_STATE.HANDBRAKE] > 0 ? fast * 4 : 0;
      slip = clamp(turn > brake ? turn : brake, 0, 1);
      slide = SLIP_FROM + SLIP_FULL * slip;
    }
    this.vSlip += (slip - this.vSlip) * (1 - Math.exp(-dt / 0.08));
    // The brakes the edge of the map puts on (the vehicle is stopped
    // before it and no tyre slides in that): pads on discs, higher and
    // thinner than rubber on a road, for as long as it is still moving.
    let brakes = 0;
    if (V_EDGE !== undefined && vs[V_EDGE] > 0 && grounded && this.vSlip < 0.05) {
      const v = Math.abs(vs[VEHICLE_STATE.SPEED]);
      brakes = clamp((v - 1.5) * 0.15, 0, 1);
    }
    this.vBrake += (brakes - this.vBrake) * (1 - Math.exp(-dt / 0.06));
    if (this.vBrake > 0.03 && this.vSlip < 0.05) m.drone(DR_SKID, SND.loop_skid, step(0.06 * this.vBrake), quant((heavy ? 1.25 : 1.7) + 0.2 * this.vBrake, 0.02), 9000, 0);
    else if (this.vLoose) m.drone(DR_SKID, SND.loop_scrabble, this.vSlip > 0.03 ? step(0.34 * this.vSlip) : 0, quant(0.75 + 0.03 * slide, 0.03), 8000, 0);
    else m.drone(DR_SKID, SND.loop_skid, this.vSlip > 0.03 ? step(0.11 * this.vSlip) : 0, quant(0.82 + 0.025 * slide, 0.02), 7000, 0);
    // What it leans on, ground: lower the more there is of it (the plug it
    // would have to push out, J), louder and brighter the harder it leans.
    let heldRate = 1;
    if (push > 0.03 && V_HELD !== undefined) {
      const j = vs[V_HELD];
      heldRate = clamp(1.3 - 0.11 * (Math.log10(j > 1000 ? j : 1000) - 3), 0.7, 1.3);
    }
    m.drone(DR_GRIND, SND.loop_grind, push > 0.03 ? step((heavy ? 0.32 : 0.22) * Math.sqrt(push)) : 0, quant(heldRate, 0.03), quant(inside * (500 + 2600 * push), 0.12), 0);
    this.honk(vs);
    // Through something (the count of walls gone through went up): the
    // body takes it, as well as whatever the wall has to say.
    // A wheel gone (the count of those it still has went down): what held
    // it lets go, and the body drops on that corner.
    const wheels = vs[VEHICLE_STATE.WHEELS];
    if (wheels !== this.vWheels) {
      if (wheels < this.vWheels && wheels >= 0) {
        this.fire(SND.joint_snap, this.t0, 0.4, (heavy ? 0.6 : 0.8) * (0.95 + 0.1 * rnd()), 7000, 0, 0.12, 2, false);
        this.fire(SND.veh_crunch, this.t0 + 0.04, 0.38, (heavy ? 0.7 : 0.95) * (0.95 + 0.1 * rnd()), 6000, 0, 0.15, 2, false);
      }
      this.vWheels = wheels;
    }
    const rams = vs[VEHICLE_STATE.RAMS];
    if (rams !== this.vRams) {
      if (rams > this.vRams) this.fire(SND.veh_crunch, this.t0, clamp(0.14 + 0.4 * fast, 0.14, 0.5), (heavy ? 0.75 : 1) * (0.9 + 0.2 * rnd()), 8000, 0, 0.15, 2, false);
      this.vRams = rams;
    }
  }

  // The horn: sounds for as long as it is held (`horn`, set by whoever has
  // the key) with somebody at the wheel. It changes nothing in the
  // simulation, so nothing there knows of it; the shell does.
  honk(vs) {
    const on = this.horn && this.vOn && vs !== null && vs !== undefined && vs[VEHICLE_STATE.DRIVING] > 0;
    if (on === this.hornSet) return;
    this.hornSet = on;
    const kind = on ? vs[VEHICLE_STATE.KIND] | 0 : 0;
    this.mixer.drone(DR_HORN, kind === VEHICLE.CAR ? SND.horn_car : SND.horn_truck, on ? (kind === VEHICLE.CAR ? HORN_LEVEL : 1.3 * HORN_LEVEL) : 0, 1, on && vs[VEHICLE_STATE.COCKPIT] > 0 ? 3200 : 9000, 0);
  }

  // A joint let go (`ev::JOINT_BREAK`): `load` is the force (N) or torque
  // (N m) that broke it, `kind` what it was (2 is a rope).
  joint(x, y, z, load, kind) {
    const m = this.mixer;
    this.place(x, y, z, 5);
    const lg = Math.log10(load > 100 ? load : 100);
    // A hundred times the load is 8 dB louder (and lower, below).
    const amp = clamp(0.16 * Math.pow(load * 0.001, 0.2), 0.08, 0.5) * m.sGain;
    const rate = clamp(1.35 - 0.13 * (lg - 2), 0.7, 1.35) * (0.94 + 0.12 * rnd());
    return this.fire(kind === JOINT_ROPE ? SND.rope_snap : SND.joint_snap, this.t0 + m.sDelay, amp, rate, m.sCut, m.sPan, 0.25 * m.sWet, 1.4, false);
  }

  // Bombs on their way to (x, y, z): the first lands `secs` of the game's
  // time from now, `count` of them `gap` seconds apart (0 when the engine
  // does not say: then they are one whistle, thickened). Each falls with a
  // whistle that ends where its blast begins. Nothing sounds yet: they are
  // put down in the table, and whistling() starts each when its time comes
  // and keeps it in step with the game's time. A thing with a material
  // (`mat` over 0: the sandbox's meteor is stone) is no bomb and has no
  // fins to whistle: it comes down with a roar of its own, one voice.
  incoming(x, y, z, secs, count, gap, mat) {
    const m = this.mixer;
    m.locate(x, y, z, WHISTLE_REF);
    const rock = mat > 0;
    const apart = gap > 0;
    const bombs = count < 1 ? 1 : count > WHISTLE_MAX ? WHISTLE_MAX : count;
    const voices = apart ? bombs : bombs > 1 && !rock ? 2 : 1;
    for (let k = 0; k < voices && this.wN < WHISTLE_MAX; k++) {
      const i = this.wN++;
      this.wX[i] = x; this.wY[i] = y; this.wZ[i] = z;
      this.wLeft[i] = apart ? secs + k * gap : secs;
      this.wDelay[i] = m.sDelay;
      this.wCall[i] = apart ? 0 : this.wSerial;
      // A stick of bombs heard as one: the second voice a shade quieter, a
      // little to one side.
      this.wSecond[i] = !apart && k > 0 ? 1 : 0;
      this.wShort[i] = apart && k >= WHISTLE_LONG ? 1 : 0;
      this.wRock[i] = rock ? 1 : 0;
      this.wSide[i] = apart ? 0.12 * (k - 0.5 * (voices - 1)) : k > 0 ? 0.15 : 0;
      this.wVoice[i] = -1;
    }
    this.wSerial = this.wSerial % 255 + 1;
  }

  // The whistles in the air, once a frame: `dt` seconds of the audio clock
  // and `simDt` of the game's have gone by. A bomb falls in the game's
  // time, which slow motion stretches and a pause stops; its whistle is
  // started when the slowest it may be played would just fill the time
  // left, and played faster or slower from then on (in slow motion far
  // slower: lower, as everything slowed is) so that it ends as its bomb
  // lands, whatever the game's time does meanwhile.
  whistling(dt, simDt) {
    const m = this.mixer, now = m.now;
    const rate = this.timeRate > SIM_RATE_MIN ? this.timeRate : SIM_RATE_MIN;
    const ahead = this.gameAhead;
    let sounding = 0;
    for (let i = 0; i < this.wN; i++) if (this.wVoice[i] >= 0) sounding++;
    for (let i = this.wN - 1; i >= 0; i--) {
      const left = (this.wLeft[i] -= simDt) - ahead;
      const v = this.wVoice[i];
      // Its bomb never came (or went unheard): it has played itself out.
      // (Unless it stands still with a stopped world: then it is let go
      // here, or its voice would be kept for as long as a held one is.)
      if (left < -WHISTLE_EARLY) {
        if (v >= 0 && this.air) m.cut(v, this.wStart[i], now);
        this.forget(i);
        continue;
      }
      if (v === SPENT) continue;
      if (v < 0) {
        // (Nothing begins to fall in a world that stands still.)
        if (this.air) continue;
        // Seconds of the audio clock until the bomb lands.
        const wait = left / rate;
        const slow = WHISTLE_SLOW * (rate < 1 ? rate : 1);
        const long = m.durs[SOUNDS[SND.whistle].base], short = m.durs[SOUNDS[SND.whistle_short].base];
        let snd = SND.whistle;
        if (this.wRock[i] !== 0) {
          // A rock's roar: one length, begun when that fills the time left.
          const roar = m.durs[SOUNDS[SND.meteor].base];
          if (wait * slow > roar) continue;
          if (wait * WHISTLE_FAST < roar) { this.forget(i); continue; }
          snd = SND.meteor;
        } else if (this.wShort[i] === 0 && wait * WHISTLE_FAST >= long) {
          // More time than the slowest whistle fills: not yet.
          if (wait * slow > long) continue;
        } else if (wait * WHISTLE_FAST >= short) {
          if (wait * slow > short) continue;
          snd = SND.whistle_short;
        } else {
          // Less than the fastest needs: the bomb is already here.
          this.forget(i);
          continue;
        }
        // (No more at once than a sky holds apart: one more waits for a
        // voice, and is the shorter for it. Two carpets lost a whistle of
        // their eighteen when it was dropped instead.)
        if (sounding >= WHISTLE_SOUNDING) continue;
        sounding++;
        this.place(this.wX[i], this.wY[i], this.wZ[i], WHISTLE_REF);
        const buf = m.pick(snd, rnd());
        const dur = m.durs[buf];
        let r = dur / wait;
        if (r < slow) r = slow; else if (r > WHISTLE_FAST) r = WHISTLE_FAST;
        // (It is as far away as the blast will be: both arrive late by the
        // same time. Started now or not at all: its voice is kept hold of.)
        if (m.playNow(buf, this.t0 + m.sDelay * this.far, (this.wRock[i] !== 0 ? METEOR_LEVEL : this.wSecond[i] !== 0 ? 0.1 : 0.16) * m.sGain, r, m.sCut, m.sPan + this.wSide[i], 0.2 * m.sWet, 9, false, TAU[snd]) === 0) { this.forget(i); continue; }
        const got = m.lastVoice;
        this.wVoice[i] = got; this.wStart[i] = m.vStart[got]; this.wDelay[i] = m.sDelay;
        this.wDur[i] = dur; this.wPos[i] = 0; this.wAt[i] = 0; this.wRate[i] = r;
        this.whistles++;
        continue;
      }
      // Stolen for something louder, or over: nothing left to keep in
      // step. Its bomb is still to come, though, and its blast is its own
      // to end on: forgotten here, the blast was given to the next bomb's
      // whistle, which ended a third of a second early, and so on down a
      // carpet to a last bomb that fell in silence.
      if (m.vStart[v] !== this.wStart[i] || !(m.vEnd[v] > now)) { this.wVoice[i] = SPENT; continue; }
      // (Standing still with the world: frame() holds it.)
      if (this.air) continue;
      const lead = this.wStart[i] - now;
      if (this.wGo !== 0) {
        // Let go. It goes on from the place in its sound where its bomb
        // is (where it was when the world last moved), at the speed that
        // fills the time until the blast is heard with what is left from
        // there: the speed it had, unless the world's pace has changed
        // meanwhile. (Gone on from where it had run on to as it faded, it
        // had a tenth of a second less to fill the fall with each time,
        // and after three waits of a world that sticks it came to its
        // blast at a third of its note.)
        // (Or further on, if the world moved while it stood: a replay
        // skips ahead with the shell saying 0. From where it had been,
        // hurried to its blast, it ended an octave over its note.)
        const due = left / rate + this.wDelay[i] * this.farW, on = this.wDur[i] - this.wRate[i] * due;
        const pos = on > this.wAt[i] ? on : this.wAt[i], rest = this.wDur[i] - pos;
        if (due > 0.01 && rest > 0.01) {
          let r = rest / due;
          if (r < SIM_RATE_MIN) r = SIM_RATE_MIN; else if (r > 3) r = 3;
          if (m.resume(v, this.wStart[i], pos, r, now + rest / r)) {
            this.wPos[i] = pos; this.wRate[i] = r;
            continue;
          }
        }
        // (Not standing still yet, or not begun: as fast as it was, and
        // what of it ran on unheard as it faded is played.)
        if (m.hold(v, this.wStart[i], false)) this.wPos[i] += m.vRan[v] * this.wRate[i];
      }
      if (lead <= 0) this.wPos[i] += dt * this.wRate[i];
      const remain = this.wDur[i] - this.wPos[i];
      // What is left of it must fill the time until its bomb is heard.
      // (Its sound has as far to come as the blast's, at the game's speed.)
      const until = left / rate + this.wDelay[i] * this.farW - (lead > 0 ? lead : 0);
      if (!(remain > 0.01 && until > 0.01)) continue;
      // (Looked at when the game's time has moved, or when it is let go
      // after standing still: between two steps there is nothing new to
      // be in step with, and a world that has stopped stepping without
      // saying so would have its whistle slowed frame by frame to fill a
      // time that does not shrink.)
      if (!(simDt > 0)) continue;
      this.wAt[i] = this.wPos[i];
      const want = remain / until;
      const off = want / this.wRate[i];
      const late = remain / this.wRate[i] - until;
      // (Let go after standing still it takes the speed that ends it on
      // its blast, whatever that is: nobody hears a change of speed in a
      // sound that was silent. Left to the slack, a whistle let go for
      // the eighth time 0.9 s before its bomb landed was 70 ms from over
      // when its blast came.)
      if (this.wGo !== 0 ? off !== 1 : !(off <= 1.06 && off >= 0.94) && !(late <= WHISTLE_SLACK && late >= -WHISTLE_SLACK)) {
        const r = want < SIM_RATE_MIN ? SIM_RATE_MIN : want > 3 ? 3 : want;
        // (At the slowest or the fastest it can go it is not told so again every step.)
        if (r !== this.wRate[i] && m.retime(v, this.wStart[i], r, now + (lead > 0 ? lead : 0) + remain / r)) this.wRate[i] = r;
      }
    }
  }

  // A blast is heard `delay` seconds from now, from (x, ., z): if a whistle
  // is on its way down to somewhere near there about now, this is its bomb,
  // and the whistle ends here (a bomb lands when it meets something, which
  // is not always when promised). Of several, the one due soonest; whistles
  // that stand for a whole stick (no gap known) all end on its first blast.
  landed(x, z, delay) {
    let best = -1;
    for (let i = 0; i < this.wN; i++) {
      const dx = this.wX[i] - x, dz = this.wZ[i] - z;
      if (dx * dx + dz * dz > WHISTLE_NEAR * WHISTLE_NEAR) continue;
      if (this.wLeft[i] > WHISTLE_EARLY || this.wLeft[i] < -WHISTLE_EARLY) continue;
      if (best < 0 || this.wLeft[i] < this.wLeft[best]) best = i;
    }
    if (best < 0) return;
    const call = this.wCall[best], heard = this.mixer.now + delay;
    for (let i = this.wN - 1; i >= 0; i--) {
      if (i !== best && (call === 0 || this.wCall[i] !== call)) continue;
      if (this.wVoice[i] >= 0 && this.mixer.cut(this.wVoice[i], this.wStart[i], heard)) this.whistlesCut++;
      this.forget(i);
    }
  }

  forget(i) {
    const last = --this.wN;
    this.wX[i] = this.wX[last]; this.wY[i] = this.wY[last]; this.wZ[i] = this.wZ[last];
    this.wLeft[i] = this.wLeft[last]; this.wDelay[i] = this.wDelay[last];
    this.wCall[i] = this.wCall[last]; this.wSecond[i] = this.wSecond[last]; this.wShort[i] = this.wShort[last]; this.wRock[i] = this.wRock[last]; this.wSide[i] = this.wSide[last];
    this.wVoice[i] = this.wVoice[last]; this.wStart[i] = this.wStart[last];
    this.wDur[i] = this.wDur[last]; this.wPos[i] = this.wPos[last]; this.wAt[i] = this.wAt[last]; this.wRate[i] = this.wRate[last];
  }

  ignite(x, y, z, intensity) {
    const m = this.mixer;
    this.place(x, y, z, 4);
    const amp = clamp(0.2 + 0.2 * intensity, 0.15, 0.6) * m.sGain;
    return this.fire(SND.ignite, this.t0 + m.sDelay, amp, 0.85 + 0.3 * rnd(), m.sCut, m.sPan, 0.2 * m.sWet, 1.2, false);
  }

  // Layered blast. `lite` (crack + body only) is used when several go off in
  // the same frame, so a chain of barrels does not eat the whole big pool.
  explosion(x, y, z, radius, power, lite, by) {
    const m = this.mixer;
    const size = radius * Math.sqrt(power > 0.05 ? power : 0.05);
    // What set it off (`by`: the engine's tools::source, a tool's id and
    // one, 0 for a drum or anything that is not a tool's) says what kind of
    // blast it is: the same radius is not the same bang from a shaped
    // charge, a bag of explosive and a bomb.
    const kind = by >= 1 ? BLAST_OF[(by | 0) - 1] | 0 : 0, k = kind * BLAST_STRIDE;
    const kCrack = BLAST[k], kSub = BLAST[k + 1], kBody = BLAST[k + 2], kPitch = BLAST[k + 3], kTail = BLAST[k + 4];
    this.place(x, y, z, 5 + 4 * size);
    const d = m.sDist, g = m.sGain, pan = m.sPan * 0.8, cut = m.sCut, wet = m.sWet;
    const amp = clamp(0.5 + 0.2 * size, 0.4, 1.3);
    // Distance changes the balance, not just the level: the crack dies in
    // the air, the low end rolls on. Beyond ~200 m only the boom is left.
    const far = clamp((d - 40) / 160, 0, 1), near = 1 - far;
    // Light is instant; the sound arrives d / 343 seconds later.
    const when = this.t0 + m.sDelay;
    const pitch = clamp(1.2 - 0.08 * size, 0.62, 1.2) * kPitch;
    // Layers in order of how much a late start would hurt (the mixer parks
    // whatever exceeds its per-frame budget until the next frame).
    let n = this.fire(SND.exp_crack, when, amp * g * near * near * kCrack, pitch * (0.95 + 0.1 * rnd()), cut, pan, 0.45 * wet, 4, true);
    const level = amp * g;
    this.bedIn += level * level * 3;
    if (!lite && kSub > 0) n += this.fire(SND.exp_sub, when, amp * Math.pow(g, 0.8) * 0.9 * (1 - 0.6 * far) * kSub, clamp(1.15 - 0.07 * size, 0.6, 1.15) * (kPitch < 1 ? kPitch : 1), 900, pan * 0.3, 0.1, 4, true);
    n += this.fire(SND.exp_body, when + 0.004, amp * Math.pow(g, 0.9) * 0.85 * kBody, pitch * (0.95 + 0.1 * rnd()), cut * 0.8, pan, 0.6 * wet, 3.5, true);
    if (lite) return n;
    // (The roll of it: what is left of any blast a long way off, and part
    // of a bomb's at any distance.)
    const roll = far > kTail ? far : kTail;
    if (roll > 0.05) n += this.fire(SND.exp_far, when, amp * Math.pow(g, 0.7) * roll * 1.3, (0.9 + 0.2 * rnd()) * (kPitch < 1 ? kPitch : 1), 2000, pan * 0.5, 0.3, 3, true);
    if (near > 0.3) n += this.fire(SND.exp_debris, when, amp * g * 0.4 * near, 0.9 + 0.25 * rnd(), cut, pan, 0.2 * wet, 1.2, false);
    if (level > 0.3) {
      // Close enough to stun: duck and muffle everything that is not the blast.
      const depth = clamp(level - 0.3, 0, 0.85);
      // (When it is heard: in slow motion that is later, as the blast is.)
      m.blast(this.t0 + m.sDelay * this.far, depth);
      if (depth > this.stun) this.stun = depth;
      // Whether the ears ring is the engine's to say where it says it
      // (`ev::CONCUSSION`); an engine that does not gets the host's guess.
      if (EV.CONCUSSION === undefined && level > 0.9) n += this.fire(SND.ear_ring, when + 0.05, 0.03 + 0.05 * (level - 0.9), 1, 20000, 0, 0, 0.5, true);
    }
    return n;
  }

  // ------------------------------------------------------------------ lanes --

  // Add the event in this.ev (estimated loudness at the listener, position,
  // magnitude, `a`) to its lane; `w` is its weight when it stands for several
  // stride-sampled events.
  offer(lane, mat, w) {
    const ev = this.ev;
    const loud = ev[0], x = ev[1], y = ev[2], z = ev[3], mag = ev[4], a = ev[5];
    const e = loud * loud * w;
    if (this.touched[lane] === 0) {
      this.touched[lane] = 1;
      this.fE[lane] = 0; this.fX[lane] = 0; this.fY[lane] = 0; this.fZ[lane] = 0;
      this.fQ[lane] = 0; this.fMag[lane] = 0; this.fA[lane] = 0;
      this.fExact[lane] = 0; this.fPlayed[lane] = 0; this.fShut[lane] = 0;
      this.resN[lane] = 0;
    }
    this.fE[lane] += e;
    this.fX[lane] += e * x; this.fY[lane] += e * y; this.fZ[lane] += e * z;
    this.fQ[lane] += e * (x * x + y * y + z * z);
    this.fMag[lane] += e * mag;
    this.fA[lane] += e * a;
    // Keep the TOP loudest: replace the quietest slot if this one beats it.
    const res = this.res;
    const base = lane * TOP * R_SIZE;
    let slot;
    const n = this.resN[lane];
    if (n < TOP) {
      slot = base + n * R_SIZE;
      this.resN[lane] = n + 1;
    } else {
      slot = base;
      for (let k = 1; k < TOP; k++) if (res[base + k * R_SIZE] < res[slot]) slot = base + k * R_SIZE;
      if (res[slot] >= loud) return;
    }
    res[slot + R_LOUD] = loud; res[slot + R_X] = x; res[slot + R_Y] = y; res[slot + R_Z] = z;
    res[slot + R_MAG] = mag; res[slot + R_MAT] = mat; res[slot + R_A] = a;
  }

  // Run the recipe for a lane. Returns voices started.
  emit(lane, x, y, z, mag, mat, a, scale, jit) {
    if (lane < L_BREAK) return this.impact(x, y, z, mag, mat, a, scale, jit);
    if (lane < L_CRACK) return this.breakage(x, y, z, mag, mat, scale, jit);
    if (lane === L_CRACK) return this.crack(x, y, z, mag, mat, scale, jit);
    if (lane === L_DETACH) return this.detach(x, y, z, mag, mat, scale, jit);
    if (lane === L_GLASS) return this.glass(x, y, z, mag, scale, jit);
    return this.creak(x, y, z, mag, mat, a);
  }

  // Loudness estimate of a lane event before distance (for cloud grains).
  est(lane, mag, mat, a) {
    if (lane < L_BREAK) return ampImpact(mag, a) * mGain[mat] * cImpactGain[mClass[mat]];
    if (lane < L_CRACK) return ampBreak(mag) * mGain[mat];
    if (lane === L_CRACK) return ampCrack(mag) * mGain[mat];
    if (lane === L_DETACH) return ampDetach(mag);
    if (lane === L_GLASS) return ampGlass(mag);
    return ampCreak(mag);
  }

  // Play the loudest event still in the lane's reservoir, if the lane and the
  // token bucket allow. Returns false when the lane has nothing more to give.
  playNext(lane) {
    if (this.tok < 1 || this.fShut[lane] !== 0 || this.fPlayed[lane] >= LANE_EXACT[lane]) return false;
    const res = this.res;
    const base = lane * TOP * R_SIZE;
    const n = this.resN[lane];
    let best = -1, bl = 0;
    for (let k = 0; k < n; k++) {
      const l = res[base + k * R_SIZE];
      if (l > bl) { bl = l; best = k; }
    }
    if (best < 0) return false;
    // Quieter than everything the small pool is playing: it would be turned
    // away, so do not even work out the recipe (or ask the world about it).
    const m = this.mixer;
    if (m.fullAt[0] === m.now && bl * LANE_PRIO[lane] <= m.fullFloor[0]) { this.fShut[lane] = 1; return false; }
    if (lane === L_CREAK) {
      // Groans are long: a few at a time at most.
      if (this.t0 < this.creakAt) return false;
      this.creakAt = this.t0 + CREAK_GAP;
    }
    const s = base + best * R_SIZE;
    if (this.fPlayed[lane] === 0) this.fTopMat[lane] = res[s + R_MAT] | 0;
    this.tok -= this.emit(lane, res[s + R_X], res[s + R_Y], res[s + R_Z], res[s + R_MAG], res[s + R_MAT] | 0, res[s + R_A], 1, 0.012 * rnd());
    this.exact++;
    this.fPlayed[lane]++;
    this.fExact[lane] += bl * bl;
    res[s] = 0;
    return true;
  }

  // Whatever the lane did not play exactly this frame becomes cloud energy.
  settle(lane) {
    if (lane === L_CREAK) return;
    const res = this.res;
    const base = lane * TOP * R_SIZE;
    const n = this.resN[lane];
    let topMat = this.fTopMat[lane];
    if (this.fPlayed[lane] === 0) {
      let topLoud = -1;
      for (let k = 0; k < n; k++) {
        const l = res[base + k * R_SIZE];
        if (l > topLoud) { topLoud = l; topMat = res[base + k * R_SIZE + R_MAT] | 0; }
      }
    }
    const rest = this.fE[lane] - this.fExact[lane];
    if (!(rest > CLOUD_FLOOR)) return;
    const w = this.fE[lane];
    const mx = this.fX[lane] / w, my = this.fY[lane] / w, mz = this.fZ[lane] / w;
    const variance = this.fQ[lane] / w - (mx * mx + my * my + mz * mz);
    const spread = variance > 0 ? Math.sqrt(variance) : 0;
    const old = this.cE[lane];
    if (!(old > 0)) {
      // A new cloud is this frame's leftovers and nothing else. Assigned, not
      // blended, so whatever the lane's last cloud left behind is gone.
      this.clouds++;
      this.cE[lane] = rest;
      this.cX[lane] = mx; this.cY[lane] = my; this.cZ[lane] = mz;
      this.cSpread[lane] = spread;
      this.cMag[lane] = this.fMag[lane] / w;
      this.cA[lane] = this.fA[lane] / w;
      this.cMat[lane] = topMat;
      this.cTop[lane] = this.est(lane, 2 * this.cMag[lane], topMat, this.cA[lane]);
      return;
    }
    const k = rest / (old + rest);
    this.cE[lane] = old + rest;
    this.cX[lane] += (mx - this.cX[lane]) * k;
    this.cY[lane] += (my - this.cY[lane]) * k;
    this.cZ[lane] += (mz - this.cZ[lane]) * k;
    this.cSpread[lane] += (spread - this.cSpread[lane]) * k;
    this.cMag[lane] += (this.fMag[lane] / w - this.cMag[lane]) * k;
    this.cA[lane] += (this.fA[lane] / w - this.cA[lane]) * k;
    // The material of the frame's loudest event names the cloud.
    if (k > 0.5) this.cMat[lane] = topMat;
    this.cTop[lane] = this.est(lane, 2 * this.cMag[lane], this.cMat[lane], this.cA[lane]);
  }

  cloud(lane, decay) {
    let e = this.cE[lane];
    const m = this.mixer;
    const spread = this.cSpread[lane] > 6 ? 6 : this.cSpread[lane];
    const mat = this.cMat[lane];
    const cls = mClass[mat];
    const ref = lane < L_BREAK ? cRef[cls] : lane < L_CRACK ? cRef[cls] * 1.5 : lane === L_GLASS ? 4 : 5;
    const full = m.fullAt[0] === m.now;
    let grains = CLOUD_GRAINS;
    if (full) {
      // With the pool full, most clouds have no chance of a voice in most
      // frames. The most this one could ask for is its largest piece at its
      // nearest point; if the pool would turn even that away, it sits the
      // frame out for the price of a square root.
      const dx = this.cX[lane] - m.lx, dy = this.cY[lane] - m.ly, dz = this.cZ[lane] - m.lz;
      const near = Math.sqrt(dx * dx + dy * dy + dz * dz) - 1.5 * spread;
      const most = GRAIN_MAX * this.cTop[lane] * (near > ref ? ref / near : 1);
      if (most * LANE_PRIO[lane] <= m.fullFloor[0]) grains = 0;
    }
    for (let i = 0; i < grains && e > CLOUD_FLOOR && this.tok >= 1; i++) {
      // Each grain carries 40% of what is left.
      const loud = Math.sqrt(e * 0.4);
      const x = this.cX[lane] + (rnd() - 0.5) * 2 * spread;
      const y = this.cY[lane] + (rnd() - 0.5) * spread;
      const z = this.cZ[lane] + (rnd() - 0.5) * 2 * spread;
      // Pieces come in all sizes: spread the magnitude over a 4:1 range.
      const mag = this.cMag[lane] * (0.5 + 1.5 * rnd());
      // What the recipe would play at for this event; scale it to the
      // grain's share of the energy.
      m.locate(x, y, z, ref);
      const natural = this.est(lane, mag, mat, this.cA[lane]) * m.sGain;
      const scale = clamp(loud / (natural > 1e-4 ? natural : 1e-4), 0.05, GRAIN_MAX);
      // What the recipe will ask the mixer for is the scaled level, not the
      // grain's share. If the pool would turn that away, stop before paying
      // for the recipe (and its ray march), and keep the energy: it may get
      // a voice once the pool quietens, or fade unheard under what is louder.
      if (full && natural * scale * LANE_PRIO[lane] <= m.fullFloor[0]) break;
      this.tok -= this.emit(lane, x, y, z, mag, mat, this.cA[lane], scale, 0.045 * rnd());
      this.grains++;
      e -= loud * loud;
    }
    e *= decay;
    // (Not `e <= floor`: a NaN must end the cloud too, not live in it.)
    if (!(e > CLOUD_FLOOR)) { e = 0; this.clouds--; }
    this.cE[lane] = e;
  }

  // ------------------------------------------------------------------ frame --

  /**
   * Process the newest `fresh` of `count` event records at f32[ptr >> 2].
   * The mixer's frame() and setListener() must already have run.
   */
  frame(f32, ptr, count, fresh) {
    const m = this.mixer;
    const now = m.now;
    let dt = this.lastNow < 0 ? 1 / 60 : now - this.lastNow;
    // (How long sounds have played since the last look, which is what a
    // whistle's place in its sound goes by: a frame that is 150 ms late
    // played 150 ms of it. Counted as the tenth of a second everything
    // else here takes a late frame for, a whistle was credited 50 ms less
    // than it had played for each such frame, and after three it was
    // over before its blast.)
    const played = dt < 0 ? 0 : dt > 1 ? 1 : dt;
    if (dt < 0) dt = 0; else if (dt > 0.1) dt = 0.1;
    this.lastNow = now;
    this.t0 = now + LEAD;
    this.tok += dt * LANE_RATE; if (this.tok > 6) this.tok = 6;
    this.tokBig += dt * 240; if (this.tokBig > 8) this.tokBig = 8;

    this.first = (this.first + 7) % NLANES;
    // The game's time against the audio clock's (see whistling()).
    this.simKnown = this.simSteps >= 0;
    const simDt = this.simKnown ? this.simSteps * SIM_DT : dt;
    this.simSteps = -1;
    // The time that has passed, by the clock frames come by: the wall's in
    // a page, since the audio clock a page can read moves a device buffer
    // at a time (10 ms and more: on a fast display half the frames see it
    // stand still).
    let real = dt;
    if (m.wall) {
      real = this.lastWall < 0 ? dt : (m.frameT0 - this.lastWall) * 0.001;
      this.lastWall = m.frameT0;
      if (!(real >= 0)) real = 0; else if (real > 1) real = 1;
    }
    // How fast the world runs, for everything of it that is heard (the
    // game's own voice does not slow), and whether it runs at all.
    let stopped, snap = false;
    const said = this.paceSaid;
    if (said >= 0) {
      // The shell says how fast it means the world to run (pace(): 1, a
      // fifth in slow motion, a quarter for a breath, 0 while it holds the
      // world or has stopped it). That is taken at its word. Read off the
      // steps instead, as below, a hit-stop of five frames after a close
      // blast was slow motion for a tenth of a second (what followed was
      // flat and late), and a step every fifth frame was a speed that
      // swung between a ninth and a third thirty times a second, which a
      // bomb's whistle followed. Nothing changes while the world is held:
      // a hold is not slow motion, and it is a stopped world only when it
      // has lasted STOP_AFTER.
      // (So it was while a hit-stop was said as 0. Since 15 October the
      // game holds the simulation's clock for a hit-stop and goes on
      // saying 1, which is a late frame and is measured as one below; 0
      // is said for a pause, a menu and a world being loaded, and is a
      // stopped world from the frame it is said. Waited out for half a
      // second, a bomb's whistle went on playing while the bomb did not
      // fall, and was slowed frame by frame to fill a time that no longer
      // shrank: two octaves down before it was held.)
      //
      // What the shell cannot say is whether the machine keeps up. Where
      // it does not, the frame loop drops the time it cannot simulate
      // (heavy destruction is slow motion, not a slide show) and the
      // world runs at a third or a tenth of what was meant: the sound
      // goes with the world. That is measured, SLOW_STEPS steps at a
      // time while the shell means the same speed, and believed only
      // when two measures running say so (one late frame is a hitch).
      if (said !== this.paceWas) {
        // (More is meant than the machine could last do: it lags at once.)
        if (said > this.paceWas && this.lag === 0 && this.lagWas > 0 && this.lagAge < LAG_KEPT && this.lagWas < said * SLOW_FROM) {
          this.lag = 1;
          this.lagAim = this.lagWas; this.share = this.lagWas / said;
        } else if (this.share < 1 && this.paceWas > 0 && said > 0) {
          // (What the machine could do of the old pace it can do of the
          // new: all of it, if less is meant now than it managed.)
          const can = this.share * this.paceWas / said;
          this.share = can < 1 ? can : 1;
          if (can >= 1 && this.lag !== 0) { this.lag = 0; this.slowSeen = 0; this.lowFor = 0; }
        }
        snap = said > 0;
        // (A new word: what is known of the share it keeps is carried into it.)
        if (snap) this.paced(said);
        this.paceWas = said; this.realAcc = 0; this.simAcc = 0; this.measuring = 0; this.glide = SLOW_GLIDE;
      }
      this.lagAge += real;
      if (said > 0) {
        // A world that is meant to run and brings no step at all for
        // STALL_AFTER (a simulation stuck in one long step) stands: that
        // is a stopped world, until two steps come within that long of
        // each other. Short of that it is a slow world, by the measures
        // below.
        if (simDt > 0) {
          if (this.stall !== 0 && this.still <= STALL_AFTER) this.stall = 0;
          this.still = 0;
        } else {
          this.still += real;
          if (this.still > STALL_AFTER) this.stall = 1;
        }
        // (A measure is from a step: to the sixth after it, or for
        // SLOW_WAIT. A wait is in no measure. Measured from wherever the
        // last had closed, the empty measure of a stall of 0.6 s and the
        // one that held its end were two low measures running, a machine
        // that lags, and a whistle in the air was timed by half the
        // world's speed for a tenth of a second: down 18 semitones and up
        // again.)
        if (this.stall !== 0) this.measuring = 0;
        else if (this.measuring !== 0) { this.realAcc += real; this.simAcc += simDt; }
        else if (simDt > 0) { this.measuring = 1; this.realAcc = 0; this.simAcc = 0; }
        if (this.measuring !== 0 && (this.simAcc > (SLOW_STEPS - 0.5) * SIM_DT || this.realAcc >= SLOW_WAIT)) {
          const took = this.realAcc, inst = this.simAcc / took, kept = inst / said;
          this.realAcc = 0; this.simAcc = 0;
          // (The next is from the step that closed this one; closed by the wait, from the next that comes.)
          if (!(simDt > 0)) this.measuring = 0;
          if (this.lag !== 0) {
            if (kept >= SLOW_BACK) {
              this.lag = 0; this.slowSeen = 0; this.lowFor = 0; this.glide = LAG_EASE;
              // (The world runs faster than the machine was thought able to: it has caught up.)
              if (inst > this.lagWas) this.lagWas = 0;
            } else {
              // (Where the ear's figure is to go; it goes there frame by
              // frame, below. What a whistle is timed by follows faster.)
              this.lagAim += (inst - this.lagAim) * (1 - Math.exp(-took * (1 / LAG_TAU)));
              this.lagWas = this.lagAim; this.lagAge = 0;
            }
          } else if (kept >= SLOW_FROM) {
            this.slowSeen = 0; this.lowFor = 0;
            if (inst > this.lagWas) this.lagWas = 0;
          } else {
            this.lowFor += took;
            if (++this.slowSeen >= 2 && this.lowFor >= SLOW_SURE) {
              this.lag = 1;
              // (The second of two measures that agree: the whole of it was slow.)
              this.lagAim = inst;
              this.lagWas = this.lagAim; this.lagAge = 0;
            }
          }
        }
        if (this.lag !== 0) this.runAt(this.lagAim, real < LAG_EASE ? real * (1 / LAG_EASE) : 1);
        else {
          const over = this.glide;
          this.runAt(said, real < over ? real / over : 1);
          // (There: the next change of speed is a key's again.)
          if (over !== SLOW_GLIDE && Math.abs(this.slowRate - said) < 0.01 * said) { this.glide = SLOW_GLIDE; this.runAt(said, 1); }
        }
        // (The share of its pace the world has kept over the last second,
        // looked at when a step comes; and how much longer a whistle's
        // sound will take to come, gone towards. A word of the shell's is
        // taken at once.)
        if (this.stall === 0) {
          this.pWait += real;
          if (simDt > 0) {
            const gap = this.pWait, typ = this.pTyp;
            this.pTyp = gap > typ ? (typ < WAIT_MOST ? typ * 1.25 : typ) : (typ > 0.004 ? typ * 0.8 : typ);
            if (gap <= WAIT_MOST && gap <= HITCH * typ) {
              let b = this.pBin;
              this.pReal[b] += gap; this.pSim[b] += simDt;
              if (this.pReal[b] >= PACE_BIN - 0.0005) { b = b + 1 === PACE_BINS ? 0 : b + 1; this.pBin = b; this.pReal[b] = 0; this.pSim[b] = 0; }
              let over = 0, done = 0;
              for (let i = 0; i < PACE_BINS; i++) { over += this.pReal[i]; done += this.pSim[i]; }
              const share = done / (over * said);
              // (All of it within a fiftieth: a second holds a frame more or
              // fewer, and an audio clock tells the time in blocks.)
              this.share = share < 0.98 ? share : 1;
            }
            this.pWait = 0;
          }
          if (snap) this.farW = this.farTo;
          else if (this.farW !== this.farTo) {
            this.farW += (this.farTo - this.farW) * (real < FAR_TAU ? real * (1 / FAR_TAU) : 1);
            if (Math.abs(this.farW - this.farTo) < 0.004) this.farW = this.farTo;
          }
        } else this.pWait = 0;
        this.timeRate = said * this.share;
      } else {
        this.still = 0; this.stall = 0; this.measuring = 0;
      }
      stopped = said === 0 || this.stall !== 0;
    } else {
      // Nobody says (a tool that plays frames, an offline render): by the
      // steps, over a tenth of a second or more between frames that step
      // (a step more or fewer in so many is not slow motion: a simulation
      // on its own thread hands its steps over unevenly), and only when
      // two such stretches running say so (one is a hitch). A wait of more
      // than SLOW_GAP between two steps is a world that was stopped, which
      // is not slow motion either.
      this.realAcc += real;
      if (simDt > 0) {
        if (this.realAcc > SLOW_GAP) {
          this.realAcc = 0; this.simAcc = 0;
        } else {
          this.simAcc += simDt;
          if (this.realAcc >= SLOW_WINDOW) {
            const inst = this.simAcc / this.realAcc;
            this.realAcc = 0; this.simAcc = 0;
            // (Full speed is full speed: seven steps in a tenth of a second
            // and five in the next are a simulation on its own thread, and a
            // whistle that followed them changed its speed 13 times in a
            // flight.)
            if (inst >= SLOW_FROM) { this.slowSeen = 0; this.runAt(1, SLOW_FOLLOW); }
            else if (++this.slowSeen >= 2) this.runAt(inst, this.slowSeen === 2 ? 0.75 : SLOW_FOLLOW);
          }
        }
      }
      stopped = this.realAcc > STOP_AFTER;
    }
    // (The game's time that has gone by since the last step was handed
    // over, as near as the world's speed says: what follows the game's
    // time step by step, a whistle, would else see it move in jumps.)
    // (Where nobody says, the one figure there is times a whistle too.)
    if (said < 0) { this.timeRate = this.slowRate; this.farTo = this.far; this.farW = this.far; }
    const world = said === 0 ? 0 : this.timeRate;
    if (simDt > 0) this.gameAhead = 0;
    else { this.gameAhead += real * world; if (this.gameAhead > SIM_DT) this.gameAhead = SIM_DT; }
    if (stopped !== this.stopped) {
      this.stopped = stopped;
      m.setStopped(stopped);
    }
    // (What is in the air stands still with the world, and goes on with
    // it: with a stopped world, and with one that has brought no step for
    // AIR_STILL, long before that is a stopped world to anything else.)
    const air = stopped || (said > 0 && this.still > AIR_STILL);
    if (air !== this.air) {
      this.air = air;
      // (Made to stand still here; let go where it is kept in step, which
      // knows where its bomb is: whistling().)
      if (air) for (let i = 0; i < this.wN; i++) { const v = this.wVoice[i]; if (v >= 0) m.hold(v, this.wStart[i], true); }
      else this.wGo = 1;
    }
    // (Seconds of the game's time, for what waits on records that come in
    // the game's time: a fire that says it burns every twentieth step is
    // not out because the steps are far apart.)
    const game = this.simKnown ? simDt : dt;
    if (fresh > 0) this.intake(f32, ptr, count, fresh);
    if (this.wN !== 0) this.whistling(played, simDt);
    // (A press's claim on the world's next shot of its tool runs out.)
    if (this.owedAny !== 0) {
      for (let i = 0; i < PRESS_TOOLS; i++) {
        if (this.owed[i] === 0) continue;
        if (simDt > 0 && this.owedLeft[i] > 0) this.owedLeft[i]--;
        if (this.owedLeft[i] === 0) { this.pressesLapsed += this.owed[i]; this.owed[i] = 0; this.owedAny--; }
      }
    }
    // (Let go is let go for what was in the air then: not for a bomb called later.)
    this.wGo = 0;
    if (this.clouds > 0) {
      const decay = Math.exp(-dt / CLOUD_TAU);
      for (let i = 0; i < NLANES; i++) {
        const lane = (this.first + i) % NLANES;
        if (this.cE[lane] !== 0) this.cloud(lane, decay);
      }
    }
    this.dtLast = dt;
    this.probe();
    this.bed(dt);
    if (this.strainE > 0 || this.strainIn > 0 || this.groanSet !== 0) this.strain(game);
    this.flames(game);
    if (this.jetHold > 0 || this.jetOn) this.jet(game);
    this.ambient(now, dt);
  }

  // One event record at f32[p], standing for `w` events like it.
  take(f32, p, w) {
    const m = this.mixer;
    const kind = f32[p] | 0;
    const x = f32[p + 1], y = f32[p + 2], z = f32[p + 3];
    const mag = f32[p + 4];
    const mat = f32[p + 5] & 255;
    let a = f32[p + 6];
    const dx = x - m.lx, dy = y - m.ly, dz = z - m.lz;
    const d2 = dx * dx + dy * dy + dz * dz;
    // Records are believed only when they make sense. A NaN or absurd
    // position, or a magnitude that is NaN, negative or infinite (a division
    // by zero somewhere upstream), is dropped whole: one such value in the
    // sums below would stay there for the rest of the session, and garbage is
    // better silent than loud.
    // (A SHOT's magnitude means nothing, so it is not held against it. A
    // SCORE's is points, money or seconds: a loss is negative, a fortune
    // is large, and "the button did nothing" is -1; only what is not a
    // number is garbage there.)
    if (!(d2 < 1e10) || (kind === EV.SCORE ? !(mag - mag === 0) : !(mag >= 0 && mag <= MAX_MAG) && kind !== EV.SHOT)) { this.rejected++; return; }
    // A closing speed with the wrong sign is still a closing speed; anything
    // else that is not a number counts as none.
    if (a < 0) a = -a;
    if (!(a <= MAX_A)) a = 0;
    // A THUD carries no closing speed: treat it as a solid landing.
    if (kind === EV.THUD && a === 0) a = 3;
    const d = Math.sqrt(d2);
    const cls = mClass[mat];
    // (Every arm assigns `loud` a float expression, never a bare call result:
    // mixed representations make the optimiser box it.)
    let lane = 0, loud = 0.0, ref = 1.0, bedW = 0.0;
    switch (kind) {
      case EV.IMPACT:
      case EV.THUD:
        lane = L_IMPACT + cls; ref = cRef[cls]; bedW = 1;
        loud = ampImpact(mag, a) * mGain[mat] * cImpactGain[cls];
        break;
      case EV.BREAK:
        if (cls === C_GLASS) { lane = L_GLASS; ref = 4; loud = +ampGlass(mag); } else { lane = L_BREAK + cls; ref = cRef[cls] * 1.5; loud = ampBreak(mag) * mGain[mat]; }
        bedW = 1.5;
        break;
      case EV.GLASS:
        lane = L_GLASS; ref = 4; bedW = 0.5; loud = +ampGlass(mag);
        break;
      case EV.FRACTURE:
        lane = L_CRACK; ref = 5; bedW = 0.5; loud = ampCrack(mag) * mGain[mat];
        break;
      case EV.DETACH:
        lane = L_DETACH; ref = 5; bedW = 3; loud = +ampDetach(mag);
        break;
      case EV.CREAK:
        // (b: the size of the frame it is a connection of, in nodes. A
        // ratio of 1 or more is not a creak: the frame is going.)
        if (mag >= 1) { if (this.tok >= 1) this.tok -= this.going(x, y, z, mat, a, f32[p + 7]); return; }
        a = f32[p + 7];
        if (!(a >= 0 && a <= MAX_A)) a = 0;
        lane = L_CREAK; ref = 6; bedW = 0; loud = +ampCreak(mag);
        break;
      case EV.EXPLOSION: {
        // Every blast is heard, but only the first two of a frame (and only
        // while the big pool has tokens) get every layer; a chain of barrels
        // is cracks and bodies. Past four in one frame they only feed the bed.
        if (this.wN !== 0) this.landed(x, z, d * (1 / SOUND_SPEED) * this.far);
        const n = this.nExplosions++;
        if (n < 4) this.tokBig -= this.explosion(x, y, z, mag, a, n >= 2 || this.tokBig < 3, f32[p + 7]);
        else { const g = d > 14 ? 14 / d : 1; this.bedIn += g * g * 3; }
        return;
      }
      case EV.SHOT: {
        // (The world's word for a shot that was heard at the press: not heard again.)
        const tool = a | 0;
        if (this.owedAny !== 0 && tool >= 0 && tool < PRESS_TOOLS && this.owed[tool] !== 0) {
          if (--this.owed[tool] === 0) this.owedAny--; else this.owedLeft[tool] = PRESS_FRAMES;
          this.pressesPaired++;
          return;
        }
        if (this.nShots < 3 && this.tokBig >= 1) { this.tokBig -= this.shot(x, y, z, tool); this.nShots++; }
        return;
      }
      case EV.SCORE: {
        // Each thing the game can say, once a frame: a frame that brings
        // four records must not lose the one that says the game is over.
        const what = a | 0, bit = what > 0 && what < 31 ? 1 << what : 0;
        if ((this.saidMask & bit) === 0) { this.saidMask |= bit; this.said(what, mag, f32[p + 7]); }
        return;
      }
      case EV.JOINT_BREAK:
        if (this.nJoints < 2 && this.tok >= 1) { this.tok -= this.joint(x, y, z, mag, f32[p + 7] | 0); this.nJoints++; }
        return;
      // (`ev::CONCUSSION` is not heard as an event: how deaf the player is
      // comes from the engine's own figure for it, frame by frame, in
      // shock().)
      case EV.INCOMING: {
        // mag = seconds until the first bomb lands, a = how many, b = seconds
        // between them (when the engine says); a material when what is
        // coming is no bomb but a thing of that material (a rock).
        const gap = f32[p + 7];
        if (this.nIncoming < 2 && mag <= INCOMING_MAX) { this.incoming(x, y, z, mag, a | 0, gap > 0 && gap < INCOMING_MAX ? gap : 0, mat); this.nIncoming++; }
        return;
      }
      case EV.FOOTSTEP:
        // (b = 1: the step was taken in water.)
        if (this.nSteps < 2 && this.tokBig >= 1) { this.tokBig -= this.step(x, y, z, mag, mat, f32[p + 7] === 1); this.nSteps++; }
        return;
      case EV.SPLASH: {
        // The first three of a frame are heard as they are; a heap of
        // rubble going in together is those three and the bed.
        if (this.nSplashes < 3 && this.tokBig >= 1) { this.tokBig -= this.splash(x, y, z, mag, a, f32[p + 7] | 0); this.nSplashes++; }
        const g = (d > 4 ? 4 / d : 1) * ampSplash(mag);
        this.bedIn += g * g * w;
        this.bedWetIn += g * g * w;
        return;
      }
      case EV.IGNITE: {
        // The flamethrower says it is firing with these, four times a
        // second (`a` the tool, b = 1): the jet, held open from one to the
        // next, and no whoomp but the first.
        const jet = a === TOOL.FLAME && f32[p + 7] === 1;
        if (jet) {
          if (!(this.jetHold > 0) && this.tokBig >= 1) this.tokBig -= this.ignite(x, y, z, mag);
          m.locate(x, y, z, 3);
          this.jetHold = JET_HOLD; this.jetPan = m.sPan; this.jetGain = m.sGain; this.jetCut = m.sCut;
          // (Not fuel for the crackle: what the jet sets alight says so itself.)
          return;
        }
        // Two kinds of record. Something caught (b = 0): the whoomp of it
        // (one per frame). And a fire saying that it burns (b = 1, three
        // times a second for as long as it does, at one patch of it, its
        // magnitude the size of the whole fire and its material what is
        // burning there): no whoomp, that is not a fire catching. Both are
        // fuel for the fire that is heard burning: at full level within 6 m.
        const burning = f32[p + 7] === 1;
        if (burning) this.fireSays = true;
        if (!burning && this.nIgnites < 1 && this.tokBig >= 1) { this.tokBig -= this.ignite(x, y, z, mag); this.nIgnites++; }
        const g = d > 6 ? 6 / d : 1;
        const fuel = (mag > 3 ? 3 : mag < 0.2 ? 0.2 : mag) * g * g * w;
        // What burns says how: timber spits and cracks; plaster on its laths
        // and what is already char less; cloth, rubber and fuel hardly at
        // all, they flutter and roar. And a fire roars by its size: a patch
        // of it does not, a house of it does (a fire that says its size
        // says 1.5 for 750 voxels alight and more).
        const cls = mClass[mat];
        const crack = mat === FUEL ? 0.1 : cls === C_WOOD ? mBright[mat] < 0.7 ? 0.5 : 1 : cls === C_PLASTER ? 0.6 : cls === C_SOFT || cls === C_LEAF ? 0.25 : 0.5;
        const big = burning ? clamp((mag - 0.25) * 0.8, 0, 1) : clamp((mag - 0.9) * 0.5, 0, 1);
        this.fireCrackIn += fuel * crack;
        this.fireRoarIn += fuel * (mat === FUEL ? 0.6 + 0.4 * big : big);
        this.fireIn += fuel;
        this.fireSideIn += fuel * (dx * m.rx + dz * m.rz) / (d + 0.3);
        this.fireDistIn += fuel * d;
        return;
      }
      default:
        return;
    }
    if (d > ref) loud *= ref / d;
    const e = loud * loud * w;
    this.bedIn += e * bedW;
    this.bedSideIn += e * bedW * (dx * m.rx + dz * m.rz) / (d + 0.3);
    if (loud < QUIET) return;
    const ev = this.ev;
    ev[0] = loud; ev[1] = x; ev[2] = y; ev[3] = z; ev[4] = mag; ev[5] = a;
    this.offer(lane, mat, w);
  }

  intake(f32, ptr, count, fresh) {
    this.events += fresh;
    this.nExplosions = 0; this.nShots = 0; this.nSteps = 0; this.nIgnites = 0; this.nIncoming = 0; this.nJoints = 0; this.nSplashes = 0; this.saidMask = 0;
    const begin = (ptr >> 2) + (count - fresh) * EV_STRIDE;
    const end = (ptr >> 2) + count * EV_STRIDE;
    if (fresh <= MAX_EVENTS) {
      for (let p = begin; p < end; p += EV_STRIDE) this.take(f32, p, 1);
    } else {
      // Too many to look at each one. The bulk kinds (impacts, breaks,
      // fractures) are stride-sampled, each sample standing for `step`
      // events; the rare kinds are singular and are all taken.
      const step = Math.ceil(fresh / MAX_EVENTS);
      let bulk = 0, seen = 0;
      for (let p = begin; p < end; p += EV_STRIDE) {
        const kind = f32[p] | 0;
        if (kind === EV.IMPACT || kind === EV.BREAK || kind === EV.FRACTURE || kind === EV.THUD) {
          if (bulk++ % step === 0) { this.take(f32, p, step); seen++; }
        } else {
          this.take(f32, p, 1);
        }
      }
      this.summarised += bulk - seen;
    }
    // Loudest event of every lane first, then second loudest, and so on:
    // with few tokens every material still gets its headline hit.
    const first = this.first;
    for (let rank = 0; rank < TOP && this.tok >= 1; rank++) {
      let any = false;
      for (let i = 0; i < NLANES; i++) {
        const lane = (first + i) % NLANES;
        if (this.touched[lane] !== 0 && this.playNext(lane)) any = true;
      }
      if (!any) break;
    }
    for (let lane = 0; lane < NLANES; lane++) {
      if (this.touched[lane] !== 0) {
        this.touched[lane] = 0;
        this.settle(lane);
      }
    }
  }

  // The roar: a leaky integrator of destruction energy. What a frame can add
  // is capped, so one event, however big, barely moves it (it has its own
  // rumble layer); only sustained destruction fills it. It saturates in
  // about a fifth of a second of collapse and dies away over half a second.
  bed(dt) {
    // The integrators heal themselves: whatever got in, a NaN does not stay.
    if (!(this.bedE >= 0)) this.bedE = 0;
    if (!(this.bedIn >= 0)) this.bedIn = 0;
    if (!(this.bedSide - this.bedSide === 0)) this.bedSide = 0;
    if (!(this.bedSideIn - this.bedSideIn === 0)) this.bedSideIn = 0;
    if (this.bedE <= 1e-6 && this.bedIn <= 0) {
      if (this.bedSet !== 0) { this.bedSet = 0; this.mixer.setBed(0, 0); }
      return;
    }
    const cap = BED_RATE * dt;
    const k = this.bedIn > cap ? cap / this.bedIn : 1;
    const total = this.bedE + this.bedIn * k;
    const sided = this.bedSide + this.bedSideIn * k;
    const side = total > 0 ? clamp(sided / total, -1, 1) : 0;
    const fade = Math.exp(-dt / BED_TAU);
    this.bedE = total * fade;
    this.bedSide = sided * fade;
    this.bedIn = 0;
    this.bedSideIn = 0;
    const level = clamp((Math.sqrt(total) - 0.3) * 1.1, 0, 1);
    if (Math.abs(level - this.bedSet) > 0.03 || (level === 0 && this.bedSet !== 0)) {
      this.bedSet = level;
      this.mixer.setBed(level, side * 0.7);
    }
    // After a fall: when a bed that was well open comes down, what was
    // thrown up settles (once per fall, where the fall was, as loud as it
    // was open).
    // (Not when it was water that opened the bed: a heap of rubble going
    // into a river is splashes, and no stones settle after.)
    if (!(this.bedWet >= 0)) this.bedWet = 0;
    this.bedWet = (this.bedWet + this.bedWetIn * k) * fade;
    this.bedWetIn = 0;
    if (level > this.bedPeak) { this.bedPeak = level; this.bedPeakWet = total > 0 ? this.bedWet / (total * fade) : 0; }
    else if (level < SETTLE_AT && this.bedPeak >= SETTLE_FROM && this.bedPeakWet >= 0.5) this.bedPeak = 0;
    else if (level < SETTLE_AT && this.bedPeak >= SETTLE_FROM) {
      const m = this.mixer;
      // (Under a twentieth of the roar it follows: a fall is over when
      // its last piece lands, and this must not say otherwise.)
      this.fire(SND.settle, this.t0, 0.2 * this.bedPeak, 0.9 + 0.2 * rnd(), 7000, side * 0.7, 0.3 * m.sWet, 1, false);
      this.bedPeak = 0;
    } else if (level === 0) this.bedPeak = 0;
  }

  // Fire, like the bed: a leaky integrator, of fuel. Every IGNITE adds some
  // and what has caught crackles on for a few seconds, so a fire that keeps
  // spreading (or an engine that repeats IGNITE while something burns) is a
  // steady sound, placed at the fuel's centre, and one that stops dies down.
  flames(dt) {
    if (!(this.fireE >= 0)) this.fireE = 0;
    if (!(this.fireIn >= 0)) this.fireIn = 0;
    if (this.fireE <= 1e-4 && this.fireIn <= 0) {
      if (this.fireSet !== 0) { this.fireSet = 0; this.mixer.setFire(0, 0, 20000); }
      if (this.roarSet !== 0) { this.roarSet = 0; this.mixer.drone(DR_ROAR, 0, 0, 1, 20000, 0); }
      this.fireE = 0; this.fireSide = 0; this.fireDist = 0; this.fireCrack = 0; this.fireRoar = 0; this.fireSays = false;
      return;
    }
    // Past a full blaze more fuel changes where the fire is, not how loud.
    const sum = this.fireE + this.fireIn;
    const k = sum > FIRE_FULL ? FIRE_FULL / sum : 1;
    const total = sum * k;
    const sided = (this.fireSide + this.fireSideIn) * k;
    const dist = (this.fireDist + this.fireDistIn) * k;
    let crack = (this.fireCrack + this.fireCrackIn) * k, roar = (this.fireRoar + this.fireRoarIn) * k;
    if (!(crack >= 0)) crack = 0;
    if (!(roar >= 0)) roar = 0;
    this.fireQuiet = this.fireIn > 0 ? 0 : this.fireQuiet + dt;
    const fade = Math.exp(-dt / (this.fireSays && this.fireQuiet > FIRE_SILENT ? FIRE_OUT : FIRE_TAU));
    this.fireE = total * fade;
    this.fireSide = sided * fade;
    this.fireDist = dist * fade;
    this.fireCrack = crack * fade;
    this.fireRoar = roar * fade;
    this.fireIn = 0; this.fireSideIn = 0; this.fireDistIn = 0; this.fireCrackIn = 0; this.fireRoarIn = 0;
    // The same air as everything else: duller with distance.
    const q = dist / total * (1 / 60);
    const air = 1 / (1 + q * Math.sqrt(q));
    const pan = clamp(sided / total, -1, 1) * 0.7;
    // The crackle, by how much of what burns crackles; the roar under it,
    // by how much of it is a big fire or fuel, lower and wider the bigger.
    const level = FIRE_UNIT * Math.sqrt(total * (crack / total));
    if (Math.abs(level - this.fireSet) > 0.02 || (level < 0.01 && this.fireSet !== 0)) {
      const set = level < 0.01 ? 0 : level;
      this.fireSet = set;
      this.mixer.setFire(set, pan, 20000 * air);
    }
    const share = roar / total;
    const deep = ROAR_UNIT * Math.sqrt(roar);
    if (Math.abs(deep - this.roarSet) > 0.015 || (deep < 0.01 && this.roarSet !== 0)) {
      const set = deep < 0.01 ? 0 : step(deep);
      this.roarSet = set;
      this.mixer.drone(DR_ROAR, SND.loop_brown, set, quant(1.25 - 0.45 * share, 0.05), quant((260 + 700 * share) * (0.5 + 0.5 * air), 0.12), pan);
    }
  }

  // The flamethrower's tank (`toolState[TOOL_STATE.FUEL]`, how full it is). Run
  // dry while the jet is on, the jet starves: it is cut at once and its
  // last puffs are heard, where letting go only lets it die away. Once a
  // tank: again when it has been let fill a little.
  tank(ts) {
    const fuel = ts ? ts[TANK] : 1;
    if (!(fuel <= 0)) { if (fuel > TANK_AGAIN) this.jetDry = false; return; }
    if (this.jetDry || !(this.jetHold > 0 || this.jetOn)) return;
    this.jetDry = true;
    this.jetHold = 0;
    const m = this.mixer;
    this.fire(SND.jet_dry, this.t0, 0.3 * this.jetGain, 0.94 + 0.12 * rnd(), this.jetCut, this.jetPan, 0.06, 2, false);
  }

  // The flamethrower's jet: a loop held open while the tool keeps saying
  // it fires, let go a quarter of a second after it stops saying so.
  jet(dt) {
    const m = this.mixer;
    this.jetHold -= dt;
    const on = this.jetHold > 0;
    this.jetOn = on;
    m.drone(DR_JET, SND.loop_jet, on ? step(0.2 * this.jetGain) : 0, 1, on ? quant(this.jetCut, 0.1) : 20000, on ? this.jetPan : 0);
  }

  /**
   * Is the listener under a roof? Twice a second the engine casts five rays
   * through the world: up, and the four compass directions. A roof alone is
   * half enclosed, each wall adds an eighth; the room reverb fades in from
   * "a roof and two walls".
   */
  probe() {
    if (this.engine === null || --this.probeWait > 0) return;
    this.probeWait = PROBE_FRAMES;
    const m = this.mixer;
    const bits = this.engine.acousticEnclosure(m.lx, m.ly, m.lz);
    const hits = (bits & 1) * 4 + (bits >> 1 & 1) + (bits >> 2 & 1) + (bits >> 3 & 1) + (bits >> 4 & 1);
    const room = clamp((hits / 8 - 0.5) * 2.5, 0, 1);
    if (Math.abs(room - this.room) > 0.05) {
      this.room = room;
      m.setRoom(room);
    }
  }

  // Where the world is: `city` when its streets are a city's. (Said by the
  // shell, which knows the scene; nothing in a frame says it.)
  setting(city) {
    this.city = !!city;
    this.mixer.setCity(this.city);
    this.nextBird = -1;
  }

  // Wind and birds, ducked under action and for a while after a blast, and
  // mostly shut out by walls.
  ambient(now, dt) {
    if (this.stun > 0) { this.stun -= dt * 0.5; if (this.stun < 0) this.stun = 0; }
    const m = this.mixer;
    const busy = this.bedSet * 2 + this.stun * 1.5;
    const target = this.ambience ? (1 - 0.85 * (busy > 1 ? 1 : busy)) * (1 - 0.6 * this.room) : 0;
    if (Math.abs(target - this.ambSet) > 0.04 || (target === 0 && this.ambSet !== 0)) {
      this.ambSet = target;
      m.setAmbience(target, target < m.ambTarget ? 0.1 : 0.8);
    }
    if (!this.ambience) return;
    if (this.nextBird < 0) this.nextBird = now + 3 + 5 * rnd();
    if (now >= this.nextBird) {
      if (this.city) {
        // No birds over an avenue: now and then a horn a few blocks off
        // (the voices the birds have), and long gaps between.
        if (busy < 0.05) m.bird(m.pick(SND.far_horn, rnd()), 0.02 + 0.03 * rnd(), 0.92 + 0.16 * rnd(), 1.4 * (rnd() - 0.5));
        this.nextBird = now + (rnd() < 0.2 ? 1.5 + 1.5 * rnd() : 9 + 22 * rnd());
        return;
      }
      if (busy < 0.05) m.bird(m.pick(SND.bird, rnd()), 0.012 + 0.023 * rnd(), 0.9 + 0.25 * rnd(), 1.6 * (rnd() - 0.5));
      // Birds answer themselves: often a quick repeat, otherwise a long gap.
      this.nextBird = now + (rnd() < 0.35 ? 0.7 + 0.8 * rnd() : 5 + 9 * rnd());
    }
  }
}
