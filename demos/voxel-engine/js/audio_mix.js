// The mixer: a fixed Web Audio graph built once on any BaseAudioContext (the
// live AudioContext in the game, an OfflineAudioContext in the checks).
//
//   voices 0..23 (small) -> muffle -> duck -+
//   voices 24..31 (big) --------------------+-> sfx -+
//   rumble bed (two noise loops) -----------+        +-> master -> compressor
//   reverb (two convolvers) ----------------+        |   -> soft clip -> volume
//   wind + birds ------------------------------> amb-+                -> out
//
// Deafness (deafen()) puts a low-pass between master and the compressor
// for as long as it lasts, and ducks master; the ringing that goes with it
// joins after the low-pass, at the compressor, as does the game's own
// voice (ui()).
//
// Starting a sound costs one AudioBufferSourceNode and a handful of param
// writes on the main thread; everything else runs on the audio thread. The
// per-voice chain (low-pass -> gain -> pan, plus a reverb send) is persistent
// and reused, so the only garbage is the source node Web Audio insists on.
//
// The browser processes every node that can reach the output, playing or
// not, so idle parts of the graph are unplugged: voices hang off the buses
// in groups of four that are connected only while one of them sounds, and
// the bed and the ambience bus likewise. A quiet scene runs a handful of
// nodes, not two hundred.
import { SOUNDS, BUFFER_COUNT, SND } from './audio_bank.js';

/** Voices that duck and muffle after a near blast (impacts, debris, steps). */
export const SMALL = 24;
/** Voices that do not (explosion layers, guns): the things doing the ducking. */
export const BIG = 8;
export const VOICES = SMALL + BIG;

const SPEED_OF_SOUND = 343;
// Smallest gain worth a voice: -54 dB is under the noise floor of the mix.
const AUDIBLE = 0.002;
// A stolen voice is faded over this long before the new sound starts, so
// stealing never clicks.
const STEAL_FADE = 0.004;
// How much louder than the quietest playing voice a sound must be to take it.
const STEAL_MARGIN = 1.25;
// Starting a voice costs 10-30 us of main-thread time (node bookkeeping in
// the browser, more when cold), so a frame may start at most this many; the
// rest are parked and started next frame, in the order they were asked for.
// On a slow machine "at most six" is still too much, so there is a clock as
// well (see the `budgetMs` option): past the budget only the first few starts
// of a frame go through.
// Parked requests: capacity and fields per record.
const MAX_FRAME_STARTS = 6;
const MIN_FRAME_STARTS = 2;
const Q_CAP = 48;
const Q_SIZE = 13;
// Spare sources created per frame (each ~20 us).
const SPARES_PER_FRAME = 2;
// Voices per group, and how long (s) a group, the bed or the ambience bus
// stays plugged in after going quiet (so footsteps do not replug per step,
// and fades finish before the unplug).
const GROUP = 4;
const GROUPS = VOICES / GROUP;
const LINGER = 1.5;
const FADE_OUT = 3;
// The soft clipper's input range. Peaks up to +12 dB over full scale are
// shaped instead of hard-clipped by the output device.
// The knee and the ceiling are the mix's headroom, which the measurements
// are read against (tools/harness/audio_sheet.mjs).
const CLIP_RANGE = 4;
export const CLIP_KNEE = 0.7;
export const CLIP_CEILING = 0.97;
// Wind bed gain: about -40 dBFS at the output, under everything.
const WIND_LEVEL = 0.03;
// A city's bed: a little over the wind it stands in for (about -36 dBFS).
const CITY_LEVEL = 0.05;
// How hard the summed buses drive the compressor. The mix was balanced at
// this level; the user's volume is applied after the dynamics, not here.
const BUS_LEVEL = 0.8;
// The hold: what keeps the world's sustained level under a ceiling. The
// compressor works in milliseconds and the clipper on samples; neither
// knows that a wreck has been throwing things for ten seconds. What goes
// out is listened to once a frame (HOLD_READ samples of it, high-passed at
// HOLD_HP Hz: its mean square plus HOLD_OFFSET dB is the short-term LUFS
// of a wreck, a strike or a firefight to half a decibel), averaged over
// HOLD_OVER seconds, and where that would be over HOLD_CEILING the world's
// bus is turned down, by HOLD_MOST dB at the most, over HOLD_ATTACK
// seconds, and let back up over HOLD_RELEASE. A blast is over before it
// moves, and the first of several is what it was; the tenth second of a
// wreck is not as loud as the first.
//
// NOT ON in the game: only where it is asked for (`hold: true`; in the
// page, `?hold=1`). Measured on the midnight session of 16 October it
// brings play from -14.6 to -15.7 LUFS and a strike's loudest 400 ms
// stays -8.6, but it gets there late (the third rocket of three is 2 dB
// under the first) and lets go slowly (after a barrage that had it all
// the way down, what follows is 6.0 dB down two seconds on, 3.4 at four,
// 2.0 at six, 1.5 at seven and 0.3 at fourteen): whether that is ears
// adapting or a mix pumping cannot be told from a picture. Built,
// measured and left for whoever can hear.
export const HOLD_CEILING = -16, HOLD_MOST = 6;
const HOLD_FLOOR = Math.pow(10, -HOLD_MOST / 20);
const HOLD_OVER = 1.5, HOLD_ATTACK = 1.5, HOLD_RELEASE = 4, HOLD_OFFSET = 4.7, HOLD_HP = 100, HOLD_READ = 512;
// The cheap reverb (see setReverbLow): per space (street, room), the delay
// times (s, mutually prime in milliseconds so their echoes never line up),
// the reverberation time (s), the damping low-pass in each loop (Hz) and the
// output level that gives it the loudness of the convolution it replaces.
const CHEAP_SPACES = [
  { delays: [0.023, 0.031, 0.043, 0.059, 0.071, 0.089], t60: 1.3, damp: 5500, level: 0.45 },
  { delays: [0.0053, 0.0079, 0.0113, 0.0149, 0.0187, 0.0233], t60: 0.36, damp: 13000, level: 0.44 },
];

// Continuous sounds under the director's hand (see drone()): an engine,
// tyres, a flame. Each is a loop on a channel of its own.
export const DRONES = 10;
// Voices of the game's own (score, clock: see ui()).
const UI_VOICES = 4;
// Seconds a drone's level and pitch take to follow (a time constant: the
// director looks at an engine every fifteenth of a second), and
// how long after it has been told to stop it stays plugged in and running.
const DRONE_GLIDE = 0.08;
// How fast the drones fall silent when the world stops (s).
const DRONE_STOP = 0.12;
// How long a sound that stands still with the world keeps its voice (s:
// nobody leaves a menu open for a day).
const HELD = 86400;
// The slowest a sound is started: a quarter of its speed for what is
// played and let go, and for a sound kept hold of (playNow(): a bomb's
// whistle in slow motion falls at a seventh of its speed) what the caller
// says, down to this. (One floor for both gave a whistle a quarter where
// a fifth was meant, and the caller, who kept what it had meant, a
// whistle that was over three seconds before its blast.)
const SLOWEST = 0.25, SLOWEST_HELD = 0.02;
// How long a sound that is made to stand still (hold()) runs on, unheard,
// while it fades: its speed is left alone until it is silent, so that it
// stops and does not swoop down. The caller counts the time as played.
export const HOLD_RUN = 0.1;
const DRONE_REST = 0.5;
// Deafness (see deafen()): where the cutoff ends up at depth 1 (Hz), how
// far the level drops at depth 1 (0.75 is 12 dB), the seconds (a time
// constant) the ears take to shut and to open towards what they are told;
// the ringing's level at depth 1 (tones where the ear is keenest: -30 dBFS
// is plenty) and the seconds it takes to come up; and how long after the
// end the low-pass and the ringing stay plugged in (s: the glides out are
// over by then).
const DEAF_LOW = 300;
const DEAF_DUCK = 0.75;
const DEAF_SHUT = 0.02;
const DEAF_OPEN = 0.1;
const RING_LEVEL = 0.035;
const RING_RISE = 0.06;
const DEAF_LINGER = 1;

// What the clipper makes of a sample (the curve below is this, in 8193
// points; a tool that wants to know what the clipper did to a mix asks
// here).
export function softClip(x) {
  const a = Math.abs(x), span = CLIP_CEILING - CLIP_KNEE;
  // Exactly linear below the knee: ordinary sounds pass untouched.
  return a <= CLIP_KNEE ? x : Math.sign(x) * (CLIP_KNEE + span * Math.tanh((a - CLIP_KNEE) / span));
}

function softClipCurve() {
  const n = 8193;
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) c[i] = softClip((i / (n - 1) * 2 - 1) * CLIP_RANGE);
  return c;
}

// Linear-interpolation resample that keeps the filter gain of an impulse
// response (fewer samples per second must each be larger).
function resampleImpulse(x, from, to) {
  const n = Math.floor(x.length * to / from);
  const y = new Float32Array(n);
  const step = from / to, g = from / to;
  for (let i = 0; i < n; i++) {
    const p = i * step, k = Math.floor(p), t = p - k;
    const a = x[k], b = k + 1 < x.length ? x[k + 1] : 0;
    y[i] = (a + (b - a) * t) * g;
  }
  return y;
}

/**
 * Declare the number fields of `o` that will hold fractions. A JS engine
 * gives a field the representation of what it first holds, and the first
 * time a field that has only seen small integers is given a fraction the
 * object changes shape: every piece of code optimised for the old shape is
 * thrown away and has to warm up again. That could be the frame a collapse
 * starts, or the first step under a roof. Passing each such field through a
 * fraction once, in the constructor, makes the shape final there.
 */
export function fractions(o, names) {
  for (let i = 0; i < names.length; i++) {
    const v = o[names[i]];
    o[names[i]] = 0.5;
    o[names[i]] = v;
  }
}
const MIXER_FRACTIONS = [
  'now', 'frameT0', 'budget', 'lx', 'ly', 'lz', 'rx', 'rz', 'fx', 'fy', 'fz', 'yaw', 'pitch',
  'sDist', 'sGain', 'sPan', 'sCut', 'sDelay', 'sWet', 'sSide', 'sUp', 'sFront',
  'ambZeroAt', 'ambTarget', 'room', 'sWhen', 'sDepth', 'sRecover', 'sLow',
  'bedLevel', 'bedPanSet', 'bedZeroAt', 'fireLevel', 'firePanSet', 'fireZeroAt',
  'open', 'deafSet', 'deafZeroAt', 'uiEnd', 'dScale', 'holdP', 'holdG', 'holdSet', 'holdAt', 'holdLow', 'meterA',
];

/**
 * One sound variant (an array of channels) as an AudioBuffer. Without `ac`
 * the buffer is built with the constructor, which needs no context: the bank
 * can be turned into buffers before the first gesture creates one.
 */
export function toBuffer(chans, sr, ac = null) {
  const b = ac ? ac.createBuffer(chans.length, chans[0].length, sr)
    : new AudioBuffer({ numberOfChannels: chans.length, length: chans[0].length, sampleRate: sr });
  for (let c = 0; c < chans.length; c++) b.copyToChannel(chans[c], c);
  return b;
}

export class Mixer {
  /**
   * opts: hrtf (PannerNode HRTF instead of stereo panning), budgetMs (once
   * update() has run this long, the frame's remaining voice starts wait for
   * the next frame; 0, the default, leaves only the count limit, which keeps
   * offline renders reproducible).
   */
  constructor(ac, opts = {}) {
    this.ac = ac;
    this.hrtf = !!opts.hrtf;
    this.budget = opts.budgetMs > 0 ? +opts.budgetMs : 0;
    this.unclipped = !!opts.unclipped;
    // (The hold: only where asked for. See HOLD_CEILING.)
    this.holdOn = HOLD_MOST > 0 && opts.hold === true;
    // Frames come by the wall clock (a page) and not by the audio clock (an
    // offline render): see frame()'s `wall`, and the director's slow motion.
    this.wall = !!opts.wall;
    // The audio clock at the start of the frame, and the wall clock (ms).
    this.now = 0;
    this.frameT0 = 0;

    // One slot past the bank holds a quantum of silence, for prime().
    this.buffers = new Array(BUFFER_COUNT + 1).fill(null);
    this.durs = new Float32Array(BUFFER_COUNT + 1);
    this.buffers[BUFFER_COUNT] = ac.createBuffer(1, 128, ac.sampleRate);
    this.durs[BUFFER_COUNT] = 128 / ac.sampleRate;
    this.lastVariant = new Uint8Array(SOUNDS.length);

    // Listener frame (unit vectors) and the result of the last locate().
    this.lx = 0; this.ly = 0; this.lz = 0;
    this.rx = 1; this.rz = 0;
    this.fx = 0; this.fy = 0; this.fz = -1;
    this.yaw = NaN; this.pitch = NaN;
    this.sDist = 0; this.sGain = 1; this.sPan = 0; this.sCut = 20000; this.sDelay = 0; this.sWet = 1;
    this.sSide = 0; this.sUp = 0; this.sFront = 1;

    // Voices in use per pool: all of them, or half on weak hardware (see
    // setVoiceLimit). Each sounding voice is audio-thread work.
    this.smallLimit = SMALL;
    this.bigLimit = BIG;
    this.slowest = SLOWEST;
    // Counters for stats().
    this.started = 0; this.stolen = 0; this.dropped = 0; this.culled = 0; this.deferred = 0; this.expired = 0;
    // Starts done this frame, and the queue of requests parked for the next.
    this.frameStarts = 0;
    // The voice the last play() started, -1 if it started none (yet).
    this.lastVoice = -1;
    this.q = new Float64Array(Q_CAP * Q_SIZE);
    this.qHead = 0;
    this.qLen = 0;

    this._buildMaster();
    this._buildVoices();
    this._buildBed();
    this._buildAmbience();
    fractions(this, MIXER_FRACTIONS);
  }

  _buildMaster() {
    const ac = this.ac;
    // The bus sum. The user's volume is `out`, after the dynamics.
    this.master = ac.createGain();
    this.master.gain.value = BUS_LEVEL;
    // Gentle bus compression: explosions push everything else down a little,
    // quiet moments come up. The clipper after it is the actual ceiling.
    const comp = this.comp = ac.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.knee.value = 8;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.18;
    const pre = ac.createGain();
    pre.gain.value = 1 / CLIP_RANGE;
    const clip = ac.createWaveShaper();
    clip.curve = softClipCurve();
    // Volume (and the mute fade) come last. Ahead of the compressor a lower
    // volume would only make it work less: a blast came out 1.5 dB quieter at
    // half volume while footsteps lost the full 6 dB.
    this.out = ac.createGain();
    // Deafness (see deafen()): everything the world sounds like, dull
    // and far away. The low-pass is in the path only while one lasts (two
    // more nodes that never rest were 0.4% of a core with nothing but the
    // wind playing, a sixth more than the whole idle graph); it goes in and
    // comes out with its cutoff at the top of the band, where a biquad
    // low-pass is the identity, so neither is heard. The level is master's
    // own gain.
    this.open = ac.sampleRate / 2;
    this.deaf = ac.createBiquadFilter();
    this.deaf.type = 'lowpass';
    this.deaf.frequency.value = this.open;
    this.deaf.Q.value = -3;
    this.deafIn = false;
    // The ringing is not of the world: it is not dulled with it.
    this.ringGain = ac.createGain();
    this.ringGain.gain.value = 0;
    this.ringStarted = false;
    // How deaf the listener has been told to be (0..1), and since when not
    // at all.
    this.deafSet = 0; this.deafZeroAt = 0;
    // The world's way into the compressor: the hold's gain (the game's own
    // voice and the ringing of the ears join after it, and are not held).
    this.world = comp;
    this.meter = null; this.meterBuf = null; this.meterA = 0;
    this.holdP = 0; this.holdG = 1; this.holdSet = 1; this.holdAt = -1; this.holdLow = 1;
    if (this.holdOn) {
      this.world = ac.createGain();
      this.world.connect(comp);
      this.meter = ac.createAnalyser();
      this.meter.fftSize = HOLD_READ;
      this.meterBuf = new Float32Array(HOLD_READ);
      this.meterA = Math.exp(-2 * Math.PI * HOLD_HP / ac.sampleRate);
    }
    this.master.connect(this.world);
    this.deaf.connect(this.world);
    // (`unclipped`: for measuring what the clipper takes off, by rendering
    // the same thing with and without it. Never in the game.)
    if (this.unclipped) comp.connect(this.out);
    else {
      comp.connect(pre);
      pre.connect(clip);
      clip.connect(this.out);
    }
    if (this.meter !== null) (this.unclipped ? comp : clip).connect(this.meter);
    this.out.connect(ac.destination);

    this.sfx = ac.createGain();
    // Calibrated so a voice at gain 1 right next to the listener lands just
    // under full scale after the centre-pan loss and the bus compressor.
    this.sfx.gain.value = 1.1;
    this.sfx.connect(this.master);
    this.amb = ac.createGain();
    this.amb.gain.value = 0;
    this.ambAwake = false;
    this.ambZeroAt = 0;

    // After a near blast everything except the blast is quieter and duller
    // for a moment, like stunned ears.
    this.muffle = ac.createBiquadFilter();
    this.muffle.type = 'lowpass';
    this.muffle.frequency.value = 20000;
    this.muffle.Q.value = -3;
    this.duck = ac.createGain();
    this.muffle.connect(this.duck);
    this.duck.connect(this.sfx);

    // Reverb: two inputs, so the sends of ducked voices duck with them, into
    // two spaces: the street (slapback, long dark tail) and a room (dense,
    // short). setRoom() crossfades between them as the listener moves under
    // a roof. A convolver fed silence stops working once its tail has rung
    // out, so the unused space costs nothing.
    //
    // Convolution is the dearest thing in the graph: 4% of a 2.3 GHz core
    // when everything is coming down, as much as two dozen voices. So each
    // space has a cheap stand-in for weak machines (setReverbLow): a small
    // feedback delay network, a fifth of the cost.
    this.revIn = ac.createGain();
    this.revInDucked = ac.createGain();
    this.revOut = ac.createGain();
    this.revOut.connect(this.sfx);
    const space = (level) => {
      const feed = ac.createGain();
      feed.gain.value = level;
      const conv = ac.createConvolver();
      conv.normalize = false;
      this.revIn.connect(feed);
      this.revInDucked.connect(feed);
      feed.connect(conv);
      conv.connect(this.revOut);
      return { feed: feed.gain, feedNode: feed, conv, cheap: null };
    };
    this.outdoor = space(1);
    this.indoor = space(0);
    this.room = 0;
    // The cheap spaces: whether the reverb is in use, and which of the two
    // are plugged in (bit 0 street, bit 1 room).
    this.cheapAwake = false;
    this.cheapPlugged = 0;
    // The impulse responses as delivered (bank rate, stereo), which of the
    // two convolvers have theirs loaded, and whether to load a space as soon
    // as its response arrives. Loading costs milliseconds of main-thread time
    // (the browser transforms the response), so the game picks its moment.
    this.irSrc = [null, null];
    this.irAt = [null, null];
    this.irLoaded = [false, false];
    this.autoSpaces = true;
    this.reverbLow = false;
    // The stun a blast() left behind: when it lands and how deep, for the
    // next one to carry on from (see blast()).
    this.sWhen = -1; this.sDepth = 0; this.sRecover = 1; this.sLow = 20000;
  }

  /**
   * The first half of loadSpace(), which may be done apart from it: the
   * space's impulse response at the context's rate. Returns false if the
   * response has not been delivered yet.
   */
  prepareSpace(i) {
    const src = this.irSrc[i];
    if (src === null) return false;
    if (this.irAt[i] !== null) return true;
    const ac = this.ac;
    let buf = src;
    if (src.sampleRate !== ac.sampleRate) {
      // Buffer sources resample on the fly, but a ConvolverNode only accepts
      // an impulse response at the context's own rate (often 44.1 kHz).
      const chans = [];
      for (let c = 0; c < src.numberOfChannels; c++) chans.push(resampleImpulse(src.getChannelData(c), src.sampleRate, ac.sampleRate));
      buf = toBuffer(chans, ac.sampleRate, ac);
    }
    this.irAt[i] = buf;
    return true;
  }

  /**
   * Load a space's impulse response into its convolver (0 street, 1 room).
   * Returns false if the response has not been delivered yet. The browser
   * transforms the response then and there, on this thread, in one piece.
   */
  loadSpace(i) {
    if (!this.prepareSpace(i)) return false;
    const sp = i === 0 ? this.outdoor : this.indoor;
    sp.conv.buffer = this.irAt[i];
    this.irAt[i] = null;
    this.irLoaded[i] = true;
    return true;
  }

  // A cheap space: a feedback delay network. Six delay lines, each damped by
  // a low-pass (the echoes darken as they die) and attenuated by what its
  // length costs at the reverberation time, feeding not only themselves but
  // each other, through a matrix that loses no energy (Householder: every
  // line gets its own output minus a third of the sum of all six). On their
  // own the lines would be six combs, each repeating its echo like a
  // metronome (measured: a tail ten times spikier than the convolution's);
  // crossed, every echo breeds six, and the tail thickens into a wash within
  // a few passes. Odd lines are heard on the left, even ones on the right.
  _cheapSpace(spec) {
    const ac = this.ac;
    // Nothing below 150 Hz: reverberant bass is mud.
    const input = ac.createBiquadFilter();
    input.type = 'highpass';
    input.frequency.value = 150;
    input.Q.value = -3;
    const out = ac.createGain();
    out.gain.value = spec.level;
    // (Each line is heard through an input of its own, and the six are
    // put on two sides after: a node's inputs are asked in their order,
    // but what feeds one input is asked in no order at all, and in a loop
    // whichever line is asked first hears the others a block of 128
    // samples sooner than they hear it. With three lines on one input the
    // first was a different line from one render to the next: the same
    // frames rendered twice came out up to 0.26 apart, sample for sample,
    // and a check on the low tier read 188 Hz or 363 by turns.)
    const lines = ac.createChannelMerger(spec.delays.length), apart = ac.createChannelSplitter(spec.delays.length);
    const sides = ac.createChannelMerger(2);
    lines.connect(apart);
    const cross = ac.createGain();
    cross.gain.value = -2 / spec.delays.length;
    for (let k = 0; k < spec.delays.length; k++) {
      const delay = ac.createDelay(1);
      delay.delayTime.value = spec.delays[k];
      const damp = ac.createBiquadFilter();
      damp.type = 'lowpass';
      damp.frequency.value = spec.damp;
      damp.Q.value = -3;
      const loss = ac.createGain();
      // Down 60 dB after t60 seconds of going round.
      loss.gain.value = Math.pow(10, -3 * spec.delays[k] / spec.t60);
      input.connect(delay);
      delay.connect(damp);
      damp.connect(loss);
      loss.connect(delay);
      loss.connect(cross);
      cross.connect(delay);
      loss.connect(lines, 0, k);
      apart.connect(sides, k, k & 1);
    }
    sides.connect(out);
    return { input, out };
  }

  /**
   * Cheap reverb on or off: the spaces' feeds go to their stand-ins or back
   * to the convolvers.
   */
  setReverbLow(on) {
    on = !!on;
    if (on === this.reverbLow) return;
    this.reverbLow = on;
    const spaces = [this.outdoor, this.indoor];
    for (let i = 0; i < 2; i++) {
      const sp = spaces[i];
      sp.feedNode.disconnect();
      if (on) {
        if (sp.cheap === null) sp.cheap = this._cheapSpace(CHEAP_SPACES[i]);
        sp.feedNode.connect(sp.cheap.input);
      } else {
        sp.feedNode.connect(sp.conv);
        if (this.cheapPlugged & (1 << i)) sp.cheap.out.disconnect();
      }
    }
    this.cheapAwake = false;
    this.cheapPlugged = 0;
    if (on && (this.groupsAwake > 0 || this.bedAwake)) this._wakeCheap();
  }

  // Feedback loops never fall silent by themselves as far as the browser can
  // tell, so a stand-in is plugged in only while something feeds the reverb
  // and the listener is where it belongs (the street's outdoors, the room's
  // under a roof), and both are unplugged when all is quiet (voice groups
  // linger longer than the tails last).
  _wakeCheap() {
    this.cheapAwake = true;
    if (this.room < 1 && (this.cheapPlugged & 1) === 0) {
      this.cheapPlugged |= 1;
      this.outdoor.cheap.out.connect(this.revOut);
    }
    if (this.room > 0 && (this.cheapPlugged & 2) === 0) {
      this.cheapPlugged |= 2;
      this.indoor.cheap.out.connect(this.revOut);
    }
  }

  _buildVoices() {
    const ac = this.ac;
    this.vIn = new Array(VOICES);
    this.vCut = new Array(VOICES);
    this.vGain = new Array(VOICES);
    this.vPan = new Array(VOICES);
    this.vSend = new Array(VOICES);
    this.vSendNode = new Array(VOICES);
    this.vSrc = new Array(VOICES).fill(null);
    // One created-and-connected source per voice, waiting to be started.
    this.vNext = new Array(VOICES).fill(null);
    this.spares = 0;
    this.spareCursor = 0;
    this.vStart = new Float64Array(VOICES);
    this.vEnd = new Float64Array(VOICES);
    // Until when the voice's gain is busy fading out a stolen sound.
    this.vFade = new Float64Array(VOICES);
    this.vLevel = new Float32Array(VOICES);
    this.vScore = new Float32Array(VOICES);
    this.vTau = new Float32Array(VOICES).fill(0.1);
    // For a sound that is made to stand still (hold()): the speed it plays
    // at, when it was held (0: it is not), and how long it had left then.
    this.vRate = new Float64Array(VOICES).fill(1);
    this.vHeld = new Float64Array(VOICES);
    this.vLeft = new Float64Array(VOICES);
    // How long a sound let go had run on, unheard, while it faded (s).
    this.vRan = new Float64Array(VOICES);
    // Per pool: the level a sound must beat to get in, and the frame time
    // that level was worked out for (see frame() and _start()).
    this.fullAt = new Float64Array(2).fill(-1);
    this.fullFloor = new Float32Array(2);
    // Group buses (dry and reverb send), whether each group is plugged in,
    // and when its last voice ends.
    this.gDry = new Array(GROUPS);
    this.gSend = new Array(GROUPS);
    this.gAwake = new Uint8Array(GROUPS);
    this.groupsAwake = 0;
    this.gEnd = new Float64Array(GROUPS);
    this.gCursor = 0;
    for (let g = 0; g < GROUPS; g++) {
      this.gDry[g] = ac.createGain();
      this.gSend[g] = ac.createGain();
    }
    for (let i = 0; i < VOICES; i++) {
      const g = (i / GROUP) | 0;
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = -3;
      const gain = ac.createGain();
      gain.gain.value = 0;
      const send = ac.createGain();
      send.gain.value = 0;
      filter.connect(gain);
      gain.connect(send);
      send.connect(this.gSend[g]);
      const out = this.gDry[g];
      if (this.hrtf) {
        const p = ac.createPanner();
        p.panningModel = 'HRTF';
        // Distance is handled by the voice gain; the panner only places.
        p.distanceModel = 'linear';
        p.rolloffFactor = 0;
        gain.connect(p);
        p.connect(out);
        this.vPan[i] = p;
      } else {
        const p = ac.createStereoPanner();
        gain.connect(p);
        p.connect(out);
        this.vPan[i] = p;
      }
      this.vIn[i] = filter;
      this.vCut[i] = filter.frequency;
      this.vGain[i] = gain.gain;
      this.vSend[i] = send.gain;
      this.vSendNode[i] = send;
    }
  }

  /** Switch between stereo panning and HRTF: rebuilds the voice chains. */
  setHrtf(on) {
    on = !!on;
    if (on === this.hrtf) return;
    for (let i = 0; i < VOICES; i++) {
      // Whatever is playing is cut; this is a settings change, not gameplay.
      if (this.vSrc[i]) { try { this.vSrc[i].stop(); } catch (e) { /* already stopped */ } }
      if (this.vNext[i]) this.vNext[i].disconnect();
      this.vPan[i].disconnect();
      this.vSendNode[i].disconnect();
    }
    for (let g = 0; g < GROUPS; g++) {
      this.gDry[g].disconnect();
      this.gSend[g].disconnect();
    }
    this.hrtf = on;
    this._buildVoices();
  }

  // The collapse roar: a low rumble and a mid "grit" layer. The director
  // raises them with the rate of destruction; at rest the bed is unplugged.
  _buildBed() {
    const ac = this.ac;
    this.bedLp = ac.createBiquadFilter();
    this.bedLp.type = 'lowpass';
    this.bedLp.frequency.value = 90;
    this.bedLp.Q.value = 0;
    this.bedLow = ac.createGain();
    this.bedLow.gain.value = 0;
    this.bedBp = ac.createBiquadFilter();
    this.bedBp.type = 'bandpass';
    this.bedBp.frequency.value = 480;
    this.bedBp.Q.value = 0.5;
    this.bedMid = ac.createGain();
    this.bedMid.gain.value = 0;
    this.bedPan = ac.createStereoPanner();
    this.bedLp.connect(this.bedLow);
    this.bedLow.connect(this.bedPan);
    this.bedBp.connect(this.bedMid);
    this.bedMid.connect(this.bedPan);
    this.bedSend = ac.createGain();
    this.bedSend.gain.value = 0.25;
    this.bedSend.connect(this.revIn);
    this.bedLevel = 0;
    this.bedPanSet = 0;
    this.bedStarted = false;
    this.bedAwake = false;
    this.bedZeroAt = 0;

    // Fire: one crackling loop, placed and levelled by the director, on the
    // ducked bus (a blast stuns it like everything else). Unplugged at rest.
    this.fireLp = ac.createBiquadFilter();
    this.fireLp.type = 'lowpass';
    this.fireLp.Q.value = -3;
    this.fireGain = ac.createGain();
    this.fireGain.gain.value = 0;
    this.firePan = ac.createStereoPanner();
    this.fireLp.connect(this.fireGain);
    this.fireGain.connect(this.firePan);
    this.fireLevel = 0;
    this.firePanSet = 0;
    this.fireStarted = false;
    this.fireAwake = false;
    this.fireZeroAt = 0;
  }

  // Wind is one long stereo loop with its gusting baked in (see the bank), so
  // the whole ambience is a source and a gain.
  _buildAmbience() {
    const ac = this.ac;
    this.windGain = ac.createGain();
    this.windGain.gain.value = WIND_LEVEL;
    this.windGain.connect(this.amb);
    // A city's bed beside the wind's (setCity): the same bus, so walls shut
    // it out and action ducks it as they do the wind.
    this.cityGain = ac.createGain();
    this.cityGain.gain.value = 0;
    this.cityGain.connect(this.amb);
    this.city = false;
    this.cityStarted = false;
    // Birds get two tiny voices of their own on the ambience bus.
    this.aIn = [];
    this.aGain = [];
    this.aPan = [];
    this.aSrc = [null, null];
    this.aEnd = new Float64Array(2);
    for (let i = 0; i < 2; i++) {
      const g = ac.createGain();
      g.gain.value = 0;
      const p = ac.createStereoPanner();
      g.connect(p);
      p.connect(this.amb);
      this.aIn.push(g);
      this.aGain.push(g.gain);
      this.aPan.push(p.pan);
    }
    this.ambTarget = 0;
    this.windStarted = false;
    // Drones: a looping source each (made when the channel is first given
    // a sound), a low-pass, a gain and a pan, on the ducked bus: a blast
    // stuns an engine as it stuns everything else. At rest a channel is
    // unplugged and its source stopped.
    this.dLp = [];
    this.dGain = [];
    this.dPan = [];
    this.dOut = [];
    this.dSrc = new Array(DRONES).fill(null);
    this.dSnd = new Int16Array(DRONES).fill(-1);
    // (As doubles, which is what they are compared with: kept as floats a
    // level of 0.095 never equalled itself, and a car at one speed wrote
    // its settings again 120 times a second.)
    this.dLevel = new Float64Array(DRONES);
    this.dRate = new Float64Array(DRONES).fill(1);
    this.dCut = new Float64Array(DRONES).fill(20000);
    // Settings written by drone() (a steady drone writes none).
    this.droneWrites = 0;
    // How many times a sound in the air was given another speed (retime()).
    this.retimes = 0;
    this.dPanSet = new Float64Array(DRONES);
    this.dAwake = new Uint8Array(DRONES);
    this.dZeroAt = new Float64Array(DRONES);
    this.dronesAwake = 0;
    this.dScale = 1;
    this.dHold = 1;
    this.ringSet = 0;
    for (let i = 0; i < DRONES; i++) {
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.Q.value = -3;
      const g = ac.createGain();
      g.gain.value = 0;
      const pan = ac.createStereoPanner();
      lp.connect(g);
      g.connect(pan);
      this.dLp.push(lp);
      this.dGain.push(g.gain);
      this.dPan.push(pan.pan);
      this.dOut.push(pan);
    }
    // The game's own voice (the score, the clock): it is not of the world,
    // so it joins after the ears a concussion shuts, at the compressor, has
    // no place and no room, and is never ducked. A few voices of its own.
    this.uiBus = ac.createGain();
    this.uIn = [];
    this.uGain = [];
    this.uSrc = new Array(UI_VOICES).fill(null);
    this.uEnd = new Float64Array(UI_VOICES);
    this.uLevel = new Float32Array(UI_VOICES);
    for (let i = 0; i < UI_VOICES; i++) {
      const g = ac.createGain();
      g.gain.value = 0;
      g.connect(this.uiBus);
      this.uIn.push(g);
      this.uGain.push(g.gain);
    }
    this.uiAwake = false;
    this.uiEnd = 0;
  }

  /**
   * Install the variants of one sound: AudioBuffers (see toBuffer(); they
   * are not tied to a context and are not copied), or arrays of channel
   * data, which are copied into new buffers here.
   */
  setSound(id, variants) {
    const s = SOUNDS[id];
    for (let v = 0; v < variants.length; v++) {
      const b = variants[v] instanceof AudioBuffer ? variants[v] : toBuffer(variants[v], s.sr, this.ac);
      this.buffers[s.base + v] = b;
      this.durs[s.base + v] = b.duration;
    }
    if (id === SND.ir_outdoor || id === SND.ir_indoor) {
      const i = id === SND.ir_outdoor ? 0 : 1;
      this.irSrc[i] = this.buffers[s.base];
      this.irAt[i] = null;
      if (this.autoSpaces) this.loadSpace(i);
    }
    if (id === SND.loop_brown || id === SND.loop_pink) this._startBed();
    if (id === SND.loop_wind) this._startWind();
    if (id === SND.loop_city) this._startCity();
    if (id === SND.loop_fire && !this.fireStarted) {
      this.fireStarted = true;
      this._loop(SND.loop_fire, this.fireLp);
    }
    if (id === SND.loop_ring && !this.ringStarted) {
      this.ringStarted = true;
      this._loop(SND.loop_ring, this.ringGain);
    }
  }

  has(id) {
    return this.buffers[SOUNDS[id].base] !== null;
  }

  _loop(id, dest) {
    const src = this.ac.createBufferSource();
    src.buffer = this.buffers[SOUNDS[id].base];
    src.loop = true;
    src.connect(dest);
    src.start();
    return src;
  }

  _startBed() {
    if (this.bedStarted || !this.has(SND.loop_brown) || !this.has(SND.loop_pink)) return;
    this.bedStarted = true;
    this._loop(SND.loop_brown, this.bedLp);
    this._loop(SND.loop_pink, this.bedBp);
  }

  _startWind() {
    if (this.windStarted) return;
    this.windStarted = true;
    this._loop(SND.loop_wind, this.windGain);
  }

  _startCity() {
    if (this.cityStarted || !this.city || this.buffers[SOUNDS[SND.loop_city].base] === null) return;
    this.cityStarted = true;
    this._loop(SND.loop_city, this.cityGain);
  }

  /**
   * The world is a city (or is not): its bed comes up under the wind, and
   * the wind, which is a field's, comes down. The loop starts when its
   * sound is in; a scene that is no city never starts it.
   */
  setCity(on) {
    on = !!on;
    if (on === this.city) return;
    this.city = on;
    const now = this.ac.currentTime;
    this.cityGain.gain.setTargetAtTime(on ? CITY_LEVEL : 0, now, 0.5);
    this.windGain.gain.setTargetAtTime(on ? WIND_LEVEL * 0.5 : WIND_LEVEL, now, 0.5);
    this._startCity();
  }

  /**
   * Run a quantum of silence through every voice. The first use of a voice
   * chain is several times dearer than the rest (the browser sets up param
   * timelines, connects the group); paying that here, inside the first
   * gesture, keeps it out of the frame with the first explosion.
   */
  prime() {
    const now = this.now = this.ac.currentTime;
    for (let i = 0; i < VOICES; i++) {
      this.frameStarts = 0;
      this._start(BUFFER_COUNT, now, 0, 1, 20000, 0, 0, 0, i >= SMALL, 0.01);
    }
    this.started = 0;
    this.frameStarts = 0;
    this.spare(VOICES);
    // The buses' automation too, with settings that change nothing.
    this.blast(now, 0);
    this.setBed(0, 0);
    this.setRoom(0);
    this.deaf.frequency.setValueAtTime(this.open, now);
    this.master.gain.setValueAtTime(BUS_LEVEL, now);
    this.ringGain.gain.setValueAtTime(0, now);
  }

  /**
   * Call once per frame before anything else, with the audio clock's time
   * (and, for the time budget, performance.now()): starts what the previous
   * frame had to park.
   */
  frame(now, wall = 0) {
    this.now = now;
    this.frameT0 = wall;
    this.frameStarts = 0;
    if (this.meter !== null) this._hold(now);
    const q = this.q;
    while (this.qLen > 0 && this.frameStarts < MAX_FRAME_STARTS && !this._spent()) {
      const o = this.qHead * Q_SIZE;
      this.qHead = (this.qHead + 1) % Q_CAP;
      this.qLen--;
      // Parked for too long (a stall): a transient this late is just noise.
      if (q[o + 1] < now - 0.1) { this.dropped++; this.expired++; continue; }
      this.sSide = q[o + 10]; this.sUp = q[o + 11]; this.sFront = q[o + 12];
      this._start(q[o], q[o + 1], q[o + 2], q[o + 3], q[o + 4], q[o + 5], q[o + 6], q[o + 7], q[o + 8] !== 0, q[o + 9]);
    }
    this._floor(0, 0, this.smallLimit);
    this._floor(1, SMALL, SMALL + this.bigLimit);
    return now;
  }

  // The hold (see HOLD_CEILING): listen to what goes out, and turn the
  // world's bus down where its sustained level would be over the ceiling.
  _hold(now) {
    const dt = this.holdAt < 0 ? 0 : now - this.holdAt;
    this.holdAt = now;
    // (A clock that has not moved has nothing new to listen to.)
    if (!(dt > 0)) return;
    const buf = this.meterBuf, a = this.meterA;
    this.meter.getFloatTimeDomainData(buf);
    let y = 0, x1 = 0, sum = 0;
    for (let i = 0; i < HOLD_READ; i++) {
      const x = buf[i];
      y = a * (y + x - x1);
      x1 = x;
      // (The filter's first samples are its own start, not the sound.)
      if (i >= 32) sum += y * y;
    }
    let p = this.holdP;
    p += (sum * (1 / (HOLD_READ - 32)) - p) * (dt < HOLD_OVER ? dt * (1 / HOLD_OVER) : 1);
    if (!(p >= 0)) p = 0;
    this.holdP = p;
    // What the level would be with the bus not turned down, and how far
    // down that asks for.
    let g = this.holdG;
    const free = 10 * Math.log10(p + 1e-12) + HOLD_OFFSET - 20 * Math.log10(g);
    let want = free > HOLD_CEILING ? Math.pow(10, (HOLD_CEILING - free) * 0.05) : 1;
    if (want < HOLD_FLOOR) want = HOLD_FLOOR;
    const tau = want < g ? HOLD_ATTACK : HOLD_RELEASE;
    g += (want - g) * (dt < tau ? dt / tau : 1);
    this.holdG = g;
    if (g < this.holdLow) this.holdLow = g;
    // (Written when it has moved by a tenth of a decibel.)
    const moved = g / this.holdSet;
    if (moved < 0.9886 || moved > 1.0116 || (g > 0.9999 && this.holdSet !== 1)) {
      if (g > 0.9999) g = this.holdG = 1;
      this.holdSet = g;
      this.world.gain.setTargetAtTime(g, now, 0.1);
    }
  }

  /**
   * Between frames (a task of the page's, `now` the audio clock as it is
   * then): start what the last frame parked, up to `most` of it, instead of
   * leaving it for the next frame. It is then a few milliseconds late and
   * not a frame, the next frame does not begin with the last one's work,
   * and a frame that takes a quarter of a second to come does not cost a
   * blast its body (what is parked is dropped once it is a tenth of a
   * second overdue). Returns how many started.
   */
  drain(now, most) {
    if (this.qLen === 0) return 0;
    if (now > this.now) this.now = now;
    const q = this.q, at = this.now;
    const side = this.sSide, up = this.sUp, front = this.sFront;
    let n = 0;
    while (this.qLen > 0 && n < most) {
      const o = this.qHead * Q_SIZE;
      this.qHead = (this.qHead + 1) % Q_CAP;
      this.qLen--;
      if (q[o + 1] < at - 0.1) { this.dropped++; this.expired++; continue; }
      this.sSide = q[o + 10]; this.sUp = q[o + 11]; this.sFront = q[o + 12];
      n += this._start(q[o], q[o + 1], q[o + 2], q[o + 3], q[o + 4], q[o + 5], q[o + 6], q[o + 7], q[o + 8] !== 0, q[o + 9]);
    }
    this.sSide = side; this.sUp = up; this.sFront = front;
    return n;
  }

  // The level a new sound must beat to get into a pool right now: 0 while a
  // voice is free, else the quietest voice's current level (with the steal
  // margin). Callers can then skip hopeless sounds before working them out.
  _floor(pool, lo, hi) {
    const now = this.now;
    let worst = Infinity;
    for (let i = lo; i < hi; i++) {
      if (this.vEnd[i] <= now) { worst = 0; break; }
      const age = now - this.vStart[i];
      const s = age > 0 ? this.vScore[i] * Math.exp(-age / this.vTau[i]) : this.vScore[i];
      if (s < worst) worst = s;
    }
    this.fullAt[pool] = now;
    this.fullFloor[pool] = worst * STEAL_MARGIN;
  }

  // Has this frame used up its time? (Never before its first few starts:
  // however slow the machine, sound must keep coming. And "at least", not
  // "more than": where the page's clock ticks in tenths of a millisecond,
  // the budget would otherwise be a tick longer than it says.)
  _spent() {
    return this.budget > 0 && this.frameStarts >= MIN_FRAME_STARTS && performance.now() - this.frameT0 >= this.budget;
  }

  /** Give up to `n` voices that lack one a ready-to-start source. */
  spare(n) {
    for (; n > 0 && this.spares < VOICES; n--) {
      let v = this.spareCursor;
      while (this.vNext[v] !== null) v = (v + 1) % VOICES;
      this.spareCursor = (v + 1) % VOICES;
      const src = this.ac.createBufferSource();
      src.connect(this.vIn[v]);
      this.vNext[v] = src;
      this.spares++;
    }
  }

  /**
   * Call once per frame after everything else: tops up the spare sources.
   * Creating a source is the expensive half of starting a voice, so it is
   * done here, a couple per frame and only with what is left of the frame's
   * start budget: the frame in which everything explodes does not also pay
   * for node creation, the quiet frames after it do.
   */
  endFrame() {
    let n = MAX_FRAME_STARTS - this.frameStarts;
    if (this.budget > 0 && performance.now() - this.frameT0 >= this.budget) n = 0;
    this.spare(n > SPARES_PER_FRAME ? SPARES_PER_FRAME : n);
    // Unplug what has gone quiet: one voice group a frame, the bed, ambience.
    const now = this.now;
    const g = this.gCursor;
    this.gCursor = (g + 1) % GROUPS;
    if (this.gAwake[g] !== 0 && now > this.gEnd[g] + LINGER) {
      this.gAwake[g] = 0;
      this.groupsAwake--;
      this.gDry[g].disconnect();
      this.gSend[g].disconnect();
    }
    if (this.bedAwake && this.bedLevel === 0 && now > this.bedZeroAt + FADE_OUT) {
      this.bedAwake = false;
      this.bedPan.disconnect();
    }
    if (this.fireAwake && this.fireLevel === 0 && now > this.fireZeroAt + FADE_OUT) {
      this.fireAwake = false;
      this.firePan.disconnect();
    }
    if (this.cheapAwake && this.groupsAwake === 0 && !this.bedAwake) {
      this.cheapAwake = false;
      if (this.cheapPlugged & 1) this.outdoor.cheap.out.disconnect();
      if (this.cheapPlugged & 2) this.indoor.cheap.out.disconnect();
      this.cheapPlugged = 0;
    }
    if (this.ambAwake && this.ambTarget === 0 && now > this.ambZeroAt + FADE_OUT) {
      this.ambAwake = false;
      this.amb.disconnect();
    }
    if (this.dronesAwake !== 0) {
      for (let i = 0; i < DRONES; i++) {
        if (this.dAwake[i] !== 0 && this.dLevel[i] === 0 && now > this.dZeroAt[i] + DRONE_REST) {
          this.dAwake[i] = 0;
          this.dronesAwake--;
          this.dOut[i].disconnect();
          this.dSrc[i].stop();
          this.dSrc[i] = null;
        }
      }
    }
    if (this.uiAwake && now > this.uiEnd + LINGER) {
      this.uiAwake = false;
      this.uiBus.disconnect();
    }
    if (this.deafIn && this.deafSet === 0 && now > this.deafZeroAt + DEAF_LINGER) {
      // The glides have run out: everything exactly as it was, and the
      // low-pass and the ringing out of the graph. (The new way round
      // before the old one goes: should the audio thread look in between,
      // it finds both, never neither.)
      this.deafIn = false;
      this._hear(now);
      this.master.connect(this.world);
      this.master.disconnect(this.deaf);
      this.ringGain.disconnect();
    }
  }

  setListener(pos, yaw, pitch) {
    this.lx = pos[0]; this.ly = pos[1]; this.lz = pos[2];
    if (yaw !== this.yaw || pitch !== this.pitch) {
      this.yaw = yaw; this.pitch = pitch;
      const sy = Math.sin(yaw), cy = Math.cos(yaw), sp = Math.sin(pitch), cp = Math.cos(pitch);
      // Yaw 0 looks down -Z and positive yaw turns left, so right is (cos, 0, -sin).
      this.rx = cy; this.rz = -sy;
      this.fx = -sy * cp; this.fy = sp; this.fz = -cy * cp;
    }
  }

  /**
   * Spatialise a source at (x, y, z) m whose level is `ref` metres "wide":
   * full gain inside ref, 1/d beyond. Results land in sGain (distance gain),
   * sPan, sCut (air-absorption low-pass, Hz), sDelay (s) and sWet (reverb
   * send multiplier); sDist is the distance.
   */
  locate(x, y, z, ref) {
    const dx = x - this.lx, dy = y - this.ly, dz = z - this.lz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    this.sDist = d;
    this.sGain = d > ref ? ref / d : 1;
    // The +0.3 m keeps sources at the listener's own position centred.
    const inv = 1 / (d + 0.3);
    const side = (dx * this.rx + dz * this.rz) * inv;
    const front = (dx * this.fx + dy * this.fy + dz * this.fz) * inv;
    this.sSide = side;
    this.sFront = front;
    // up = right x forward
    this.sUp = (dx * (-this.rz * this.fy) + dy * (this.rz * this.fx - this.rx * this.fz) + dz * (this.rx * this.fy)) * inv;
    // Never hard left or right: a head shadows the far ear by 10-15 dB at
    // most, and a fully panned source is fatiguing on headphones.
    this.sPan = side * 0.8;
    // Air eats the highs: ~14 kHz at 30 m, 6 kHz at 100 m, 1.6 kHz at 300 m
    // (stronger than real air so distance reads clearly). Sources behind the
    // head are duller still (the pinna shadows them above a few kHz): the
    // one front/back cue plain stereo can give.
    const q = d * (1 / 60);
    this.sCut = 20000 / (1 + q * Math.sqrt(q)) * (0.3 + 0.35 * (front + 1));
    this.sDelay = d * (1 / SPEED_OF_SOUND);
    // Direct sound falls with distance, the reverberant field much less.
    this.sWet = 0.5 + (d < 50 ? d * 0.018 : 0.9);
  }

  /**
   * Apply `t` concrete-equivalent metres of solid between listener and the
   * source last passed to locate(): quieter, much duller (walls pass bass),
   * and relatively more of it arrives as reverberation. 20 cm of concrete is
   * about -4 dB with the top rolled off to a third; a metre, -12 dB and a
   * muffled thump.
   */
  occlude(t) {
    const g = 1 / (1 + 3 * t);
    this.sGain *= g > 0.2 ? g : 0.2;
    const c = this.sCut / (1 + 8 * t);
    this.sCut = c > 350 ? c : 350;
    this.sWet *= t < 1 ? 1 + 1.5 * t : 2.5;
  }

  /** Flat buffer index of a variant of `snd`, never the one played last. */
  pick(snd, r) {
    const s = SOUNDS[snd];
    let v = this.lastVariant[snd];
    if (s.variants > 1) {
      v = (v + 1 + Math.floor(r * (s.variants - 1))) % s.variants;
      this.lastVariant[snd] = v;
    }
    return s.base + v;
  }

  /**
   * Start one sound. All numbers, no allocation besides the source node.
   *   buf     flat buffer index from pick()
   *   when    audio-clock start time (propagation delay already added)
   *   gain    linear; rate playback rate; cutoff low-pass Hz
   *   pan     -1..1 (ignored in HRTF mode, which uses the last locate())
   *   send    reverb send gain
   *   prio    importance multiplier for voice stealing
   *   big     use the un-ducked pool
   *   tau     loudness decay time of the sound at rate 1 (s)
   * Returns 1 if the sound got (or is queued for) a voice, 0 if it was not
   * worth one.
   */
  play(buf, when, gain, rate, cutoff, pan, send, prio, big, tau) {
    this.lastVoice = -1;
    if (this.buffers[buf] === null || !(gain > AUDIBLE)) { this.culled++; return 0; }
    if (this.frameStarts >= MAX_FRAME_STARTS || this._spent()) {
      // This frame has done its share of main-thread work. Park the request;
      // frame() starts it next frame, at most a frame late.
      if (this.qLen === Q_CAP) { this.dropped++; return 0; }
      const q = this.q, o = ((this.qHead + this.qLen) % Q_CAP) * Q_SIZE;
      q[o] = buf; q[o + 1] = when; q[o + 2] = gain; q[o + 3] = rate; q[o + 4] = cutoff; q[o + 5] = pan;
      q[o + 6] = send; q[o + 7] = prio; q[o + 8] = big ? 1 : 0; q[o + 9] = tau;
      q[o + 10] = this.sSide; q[o + 11] = this.sUp; q[o + 12] = this.sFront;
      this.qLen++;
      this.deferred++;
      return 1;
    }
    return this._start(buf, when, gain, rate, cutoff, pan, send, prio, big, tau);
  }

  _start(buf, when, gain, rate, cutoff, pan, send, prio, big, tau) {
    const now = this.now;
    const pool = big ? 1 : 0;
    const score = gain * prio;
    // Last line of defence. An AudioParam throws on a value that is not
    // finite, and an exception here would leave update() and stop the game's
    // frame loop: a broken number must cost one sound, nothing more. (A sum
    // is finite only if every term is.)
    let sum = when + score + rate + cutoff + pan + send + tau;
    if (this.hrtf) sum += this.sSide + this.sUp + this.sFront;
    if (!(sum - sum === 0)) { this.culled++; return 0; }
    // The pool's floor for this frame. Within a frame the quietest voice can
    // only get louder (by being replaced), so anything at or below the floor
    // is rejected without looking again.
    if (this.fullAt[pool] === now && score <= this.fullFloor[pool]) { this.dropped++; return 0; }
    const lo = big ? SMALL : 0, hi = big ? SMALL + this.bigLimit : this.smallLimit;
    let v = lo, worst = Infinity, free = false, wasHeld = false;
    for (let i = lo; i < hi; i++) {
      if (this.vEnd[i] <= now) { v = i; free = true; break; }
      const age = now - this.vStart[i];
      const s = age > 0 ? this.vScore[i] * Math.exp(-age / this.vTau[i]) : this.vScore[i];
      if (s < worst) { worst = s; v = i; }
    }
    const gp = this.vGain[v];
    if (!free) {
      // Everything is busy: take the quietest voice, but only for something
      // clearly louder than what it is playing right now (cutting a sound
      // short for an equal one is churn, not an improvement).
      if (worst * STEAL_MARGIN >= score) {
        this.fullAt[pool] = now;
        this.fullFloor[pool] = worst * STEAL_MARGIN;
        this.dropped++;
        return 0;
      }
      this.stolen++;
      wasHeld = this.vHeld[v] !== 0;
      if (this.vStart[v] > now) {
        // Its sound had not started yet: there is nothing to fade, but what
        // was scheduled for that sound has to go.
        this.vCut[v].cancelScheduledValues(now);
        this.vSend[v].cancelScheduledValues(now);
        const pn = this.vPan[v];
        if (this.hrtf) {
          pn.positionX.cancelScheduledValues(now);
          pn.positionY.cancelScheduledValues(now);
          pn.positionZ.cancelScheduledValues(now);
        } else {
          pn.pan.cancelScheduledValues(now);
        }
        if (this.vFade[v] > now) {
          // The voice was already stolen this frame and is still fading out
          // the sound before: that ramp stays, only what follows it goes.
          gp.cancelScheduledValues(this.vFade[v] + 1e-4);
        } else {
          gp.cancelScheduledValues(now);
          gp.setValueAtTime(0, now);
          this.vFade[v] = now;
        }
        this.vSrc[v].stop(now);
      } else {
        // Fade from the audio clock as it is this instant, not as it was
        // when the frame began. The audio thread renders a device buffer at
        // a time (10 ms is common); if it has moved on since, the start of
        // a fade scheduled from the stale time is already in the past and
        // the sound is cut with a click instead (2 steals in 150 clicked
        // with 3 ms between the clock reading and the steal).
        const fresh = this.ac.currentTime;
        const at = fresh > now ? fresh : now;
        if (this.vHeld[v] !== 0) {
          // (It stands still and is silent already: brought up to be
          // faded, as a sounding voice is, it clicked out of silence, a
          // step three times the largest of its own.)
          gp.cancelScheduledValues(at);
          gp.setValueAtTime(0, at);
          this.vFade[v] = at;
          this.vSrc[v].stop(at);
        } else {
          // (Three calls where one glide to nothing would seem to do, and was
          // tried, for the microseconds: it clicked, in the first engineer's
          // check of exactly this. A glide begun a few milliseconds in the
          // audio thread's past has already fallen most of the way.)
          gp.cancelScheduledValues(at);
          gp.setValueAtTime(this.vLevel[v], at);
          gp.linearRampToValueAtTime(0, at + STEAL_FADE);
          this.vFade[v] = at + STEAL_FADE;
          this.vSrc[v].stop(at + STEAL_FADE);
        }
      }
      if (when < this.vFade[v] + 0.001) when = this.vFade[v] + 0.001;
    } else if (when < now) {
      when = now;
    }
    if (cutoff > 20000) cutoff = 20000; else if (cutoff < 60) cutoff = 60;
    if (rate < this.slowest) rate = this.slowest; else if (rate > 4) rate = 4;

    // Creating and connecting the source is most of the cost of a start, so
    // each voice keeps one ready (see endFrame()); only a voice reused before
    // its spare was replaced pays for it here.
    let src = this.vNext[v];
    if (src === null) {
      src = this.ac.createBufferSource();
      src.connect(this.vIn[v]);
    } else {
      this.vNext[v] = null;
      this.spares--;
    }
    src.buffer = this.buffers[buf];
    src.playbackRate.value = rate;
    this.vRate[v] = rate; this.vHeld[v] = 0;
    this.vCut[v].setValueAtTime(cutoff, when);
    gp.setValueAtTime(gain, when);
    this.vSend[v].setValueAtTime(send, when);
    if (this.hrtf) {
      const p = this.vPan[v];
      p.positionX.setValueAtTime(this.sSide, when);
      p.positionY.setValueAtTime(this.sUp, when);
      p.positionZ.setValueAtTime(-this.sFront - 1e-3, when);
    } else {
      this.vPan[v].pan.setValueAtTime(pan < -1 ? -1 : pan > 1 ? 1 : pan, when);
    }
    src.start(when);

    const end = when + this.durs[buf] / rate;
    const g = (v / GROUP) | 0;
    if (end > this.gEnd[g]) this.gEnd[g] = end;
    if (this.gAwake[g] === 0) {
      this.gAwake[g] = 1;
      this.groupsAwake++;
      this.gDry[g].connect(big ? this.sfx : this.muffle);
      this.gSend[g].connect(big ? this.revIn : this.revInDucked);
      if (this.reverbLow && !this.cheapAwake) this._wakeCheap();
    }
    this.vSrc[v] = src;
    this.vStart[v] = when;
    this.vEnd[v] = end;
    // (A held sound's group was kept plugged in for as long as it might stand.)
    if (wasHeld) this._groupEnd(g);
    this.vLevel[v] = gain;
    this.vScore[v] = score;
    this.vTau[v] = tau / rate;
    this.lastVoice = v;
    this.started++;
    this.frameStarts++;
    return 1;
  }

  /**
   * play(), for a sound whose voice the caller means to keep hold of (to
   * cut() or retime() it): started now or not at all, never parked for the
   * next frame, so that lastVoice is its voice. Returns 1 if it started.
   */
  playNow(buf, when, gain, rate, cutoff, pan, send, prio, big, tau) {
    this.lastVoice = -1;
    if (this.buffers[buf] === null || !(gain > AUDIBLE)) { this.culled++; return 0; }
    this.slowest = SLOWEST_HELD;
    const n = this._start(buf, when, gain, rate, cutoff, pan, send, prio, big, tau);
    this.slowest = SLOWEST;
    return n;
  }

  /**
   * play(), for the player's own shot at the press: started now or not at
   * all, never parked for the next frame. (A press comes between two
   * frames, when the frame before has long spent its time: parked, the
   * gun was heard a frame after the hand in a collapse, 7 to 11 ms later
   * and 37 at the most, and where the next frame was more than a tenth of
   * a second away the parked shot was thrown out as stale: a shot with no
   * sound, once in 160 presses in the page.) Returns 1 if it started.
   */
  playAtOnce(buf, when, gain, rate, cutoff, pan, send, prio, big, tau) {
    this.lastVoice = -1;
    if (this.buffers[buf] === null || !(gain > AUDIBLE)) { this.culled++; return 0; }
    return this._start(buf, when, gain, rate, cutoff, pan, send, prio, big, tau);
  }

  /**
   * Change the speed of a sound that playNow() started (`v` and `start` as
   * for cut()): from now it plays at `rate` and will be over at `end`
   * (audio clock), which the caller works out. Returns false if the sound
   * is no longer there.
   */
  retime(v, start, rate, end) {
    const now = this.now;
    if (v < 0 || this.vStart[v] !== start || !(this.vEnd[v] > now) || !(rate > 0) || !(end > now)) return false;
    if (rate > 4) rate = 4;
    this.vRate[v] = rate;
    // (Standing still: it takes its new speed when it is let go.)
    if (this.vHeld[v] !== 0) { this.vLeft[v] = end - now; this.retimes++; return true; }
    this.vSrc[v].playbackRate.setTargetAtTime(rate, now, 0.03);
    this.vEnd[v] = end;
    const g = (v / GROUP) | 0;
    if (end > this.gEnd[g]) this.gEnd[g] = end;
    this.retimes++;
    return true;
  }

  /**
   * Cut short a sound that play() started: `v` is the voice it got (the
   * mixer's lastVoice straight after play(); -1 if the start was parked)
   * and `start` that voice's vStart then, which tells whether the voice
   * still plays that sound. It is faded out over a few milliseconds from
   * `when`. Returns false if the sound is no longer there to cut.
   */
  cut(v, start, when) {
    if (v < 0 || this.vStart[v] !== start || !(this.vEnd[v] > when)) return false;
    if (when < this.now) when = this.now;
    const gp = this.vGain[v];
    gp.cancelScheduledValues(when);
    if (when > start && this.vHeld[v] === 0) {
      gp.setValueAtTime(this.vLevel[v], when);
      gp.linearRampToValueAtTime(0, when + STEAL_FADE);
    } else {
      // It had not begun: it never will. (Or it stands still, and is
      // silent already: brought up to be faded, a held sound clicked.)
      gp.setValueAtTime(0, when);
    }
    this.vSrc[v].stop(when + STEAL_FADE);
    this.vEnd[v] = when + STEAL_FADE;
    this.vFade[v] = when + STEAL_FADE;
    if (this.vHeld[v] !== 0) {
      // (Its group was kept plugged in for as long as a held sound may
      // stand: it is plugged in now for as long as its sounds last.)
      this.vHeld[v] = 0;
      this._groupEnd((v / GROUP) | 0);
    }
    return true;
  }

  /**
   * Use only the first `small` + `big` voices of the pools. Fewer voices is
   * proportionally less audio-thread work when everything is coming down;
   * what gets dropped is the quietest of a dense texture.
   */
  setVoiceLimit(small, big) {
    this.smallLimit = small < 4 ? 4 : small > SMALL ? SMALL : small | 0;
    this.bigLimit = big < 3 ? 3 : big > BIG ? BIG : big | 0;
  }

  /** Voices sounding or scheduled right now. */
  active() {
    let n = 0;
    for (let i = 0; i < VOICES; i++) if (this.vEnd[i] > this.now) n++;
    return n;
  }

  /**
   * Stun the small-voice bus after a near blast arriving at `when`.
   * depth 0..1: how far it ducks (1 = almost silent) and how dull it gets.
   */
  blast(when, depth) {
    if (when < this.now) when = this.now;
    // What an earlier blast leaves of its stun at `when`: how far the bus is
    // still ducked (as a depth) and where the muffle cutoff will be. A blast
    // landing in the middle of that carries on from there. A weaker one must
    // not cut the recovery short.
    let cutoff = 20000;
    const t0 = this.sWhen + 0.13, t1 = t0 + this.sRecover * 1.2;
    const ramping = when > t0 && when < t1;
    if (when >= this.sWhen && when < t1) {
      cutoff = ramping ? this.sLow * Math.pow(20000 / this.sLow, (when - t0) / (t1 - t0)) : this.sLow;
      const since = when - this.sWhen - 0.08;
      const left = since > 0 ? this.sDepth * Math.exp(-since / (this.sRecover * 0.35)) : this.sDepth;
      if (left > depth) depth = left;
    }
    const hold = when + 0.03;
    const floor = 1 - depth * 0.8;
    const recover = 0.5 + 1.4 * depth;
    this._dip(this.duck.gain, floor, when, hold, recover);
    this._dip(this.revInDucked.gain, floor, when, hold, recover);
    // Hearing comes back from the bottom up: the cutoff recovers along a
    // straight line in pitch (exponential in Hz), not a rush back to bright.
    let low = 20000 * Math.pow(1 - depth * 0.9, 3) + 250;
    if (low > cutoff) low = cutoff;
    const f = this.muffle.frequency;
    f.cancelScheduledValues(when);
    // Cancelling removes the end point of a recovery ramp in progress, and
    // the cutoff would drop back to the ramp's start at once, long before
    // this blast arrives. Put the ramp back, ending at `when` where it would
    // have been by then: the same curve, since part of an exponential is one.
    if (ramping) f.exponentialRampToValueAtTime(cutoff, when);
    f.setTargetAtTime(low, when, 0.008);
    f.setValueAtTime(low, hold + 0.1);
    f.exponentialRampToValueAtTime(20000, hold + 0.1 + recover * 1.2);
    this.sWhen = when; this.sDepth = depth; this.sRecover = recover; this.sLow = low;
  }

  /**
   * How deaf the listener is, 0..1: the director follows the engine's own
   * figure for it (the shock of a blast that reached the player, falling
   * away), a few times a second. The whole mix goes dull and distant: a
   * low-pass between master and the compressor at
   * `300 Hz + Nyquist x (1 - depth)^5` (a tenth takes the air above 14
   * kHz, a quarter what is above 6 kHz, a half everything above 1 kHz,
   * three quarters all but the bass) and master down by up to 12 dB; and
   * the ears ring, over it. The ears shut quickly (a fiftieth
   * of a second: the blast itself has been heard by the time the engine's
   * figure is read) and open as they are told, gliding.
   *
   * Nothing is scheduled ahead: how long it lasts is the engine's to say,
   * frame by frame, in its own time (slow motion, a pause, a replay).
   */
  deafen(depth) {
    if (!(depth > 0)) depth = 0; else if (depth > 1) depth = 1;
    const was = this.deafSet;
    if (depth === was) return;
    const now = this.now;
    this.deafSet = depth;
    if (depth > 0) {
      if (!this.deafIn) {
        this.deafIn = true;
        this.master.connect(this.deaf);
        this.master.disconnect(this.world);
        this.ringGain.connect(this.comp);
      }
    } else {
      this.deafZeroAt = now;
    }
    const tc = depth > was ? DEAF_SHUT : DEAF_OPEN;
    const rest = (1 - depth) * (1 - depth);
    this.deaf.frequency.setTargetAtTime(depth > 0 ? this.open * rest * rest * (1 - depth) + DEAF_LOW : this.open, now, tc);
    this.master.gain.setTargetAtTime(BUS_LEVEL * (1 - DEAF_DUCK * depth), now, tc);
    // (The ringing fades in with the first quarter of the depth, so that
    // it leaves as it came: from nothing.)
    this.ringSet = RING_LEVEL * (0.25 + 0.75 * depth) * (depth < 0.25 ? 4 * depth : 1);
    this.ringGain.gain.setTargetAtTime(this.ringSet * this.dHold, now, depth > was ? RING_RISE : DEAF_OPEN);
  }

  // Hearing exactly as it is at rest, from `at` on.
  _hear(at) {
    const f = this.deaf.frequency, g = this.master.gain, r = this.ringGain.gain;
    f.cancelScheduledValues(at); f.setValueAtTime(this.open, at);
    g.cancelScheduledValues(at); g.setValueAtTime(BUS_LEVEL, at);
    r.cancelScheduledValues(at); r.setValueAtTime(0, at);
  }

  _dip(p, floor, when, hold, recover) {
    p.cancelScheduledValues(when);
    p.setTargetAtTime(floor, when, 0.008);
    p.setTargetAtTime(1, hold + 0.05, recover * 0.35);
  }

  /** Rumble bed level 0..1 and stereo position; call only when it changes. */
  setBed(level, pan) {
    const now = this.now;
    const tc = level > this.bedLevel ? 0.07 : 0.28;
    this.bedLevel = level;
    if (level > 0) {
      if (!this.bedAwake) {
        this.bedAwake = true;
        this.bedPan.connect(this.sfx);
        this.bedPan.connect(this.bedSend);
        if (this.reverbLow && !this.cheapAwake) this._wakeCheap();
      }
    } else {
      this.bedZeroAt = now;
    }
    this.bedLow.gain.setTargetAtTime(0.55 * level, now, tc);
    this.bedMid.gain.setTargetAtTime(0.4 * level * level, now, tc);
    this.bedLp.frequency.setTargetAtTime(90 + 420 * level, now, tc);
    if (Math.abs(pan - this.bedPanSet) > 0.05) {
      this.bedPanSet = pan;
      this.bedPan.pan.setTargetAtTime(pan, now, 0.15);
    }
  }

  /** Fire level 0..1, stereo position and low-pass (Hz); call on change. */
  setFire(level, pan, cutoff) {
    const now = this.now;
    this.fireLevel = level;
    if (level > 0) {
      if (!this.fireAwake) {
        this.fireAwake = true;
        this.firePan.connect(this.muffle);
      }
    } else {
      this.fireZeroAt = now;
    }
    this.fireGain.gain.setTargetAtTime(level * this.dHold, now, 0.35);
    this.fireLp.frequency.setTargetAtTime(cutoff > 20000 ? 20000 : cutoff < 300 ? 300 : cutoff, now, 0.35);
    if (Math.abs(pan - this.firePanSet) > 0.05) {
      this.firePanSet = pan;
      this.firePan.pan.setTargetAtTime(pan, now, 0.3);
    }
  }

  /** How enclosed the listener is, 0 (open air) .. 1 (in a room). */
  setRoom(w) {
    this.room = w;
    if (this.cheapAwake) this._wakeCheap();
    const now = this.now;
    this.outdoor.feed.setTargetAtTime(1 - w, now, 0.25);
    // Walls a few metres away return more energy than facades across a street.
    this.indoor.feed.setTargetAtTime(w * 1.4, now, 0.25);
  }

  /** Ambience bus level (already includes any ducking). */
  setAmbience(level, tc = 0.4) {
    this.ambTarget = level;
    if (level > 0) {
      if (!this.ambAwake) {
        this.ambAwake = true;
        this.amb.connect(this.master);
      }
    } else {
      this.ambZeroAt = this.now;
    }
    this.amb.gain.setTargetAtTime(level, this.now, tc);
  }

  /** One bird phrase on the ambience bus. Returns false if both are busy. */
  bird(buf, gain, rate, pan) {
    const b = this.buffers[buf];
    if (b === null) return false;
    const i = this.aEnd[0] <= this.now ? 0 : this.aEnd[1] <= this.now ? 1 : -1;
    if (i < 0) return false;
    const when = this.now + 0.01;
    const src = this.ac.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = rate;
    src.connect(this.aIn[i]);
    this.aGain[i].setValueAtTime(gain, when);
    this.aPan[i].setValueAtTime(pan, when);
    src.start(when);
    this.aSrc[i] = src;
    this.aEnd[i] = when + this.durs[buf] / rate;
    return true;
  }

  /**
   * The world is stopped (a pause, a menu) or goes on: the drones, which
   * are the sounds of things going on (an engine, a slide, water, a moan),
   * fall silent while it is, and are as they were when it goes on.
   */
  setStopped(on) {
    const hold = on ? 0 : 1;
    if (hold === this.dHold) return;
    this.dHold = hold;
    const now = this.now;
    for (let i = 0; i < DRONES; i++) {
      if (this.dLevel[i] > 0) this.dGain[i].setTargetAtTime(this.dLevel[i] * hold, now, on ? DRONE_STOP : DRONE_GLIDE);
    }
    // (A fire, and the ringing of ears that are shut: they are of the
    // world too. Left to its own slow glide a fire took two seconds to
    // fall silent, and the ringing sang for as long as a menu was open,
    // since the engine's figure for it stands still with the world.)
    if (this.fireLevel > 0) this.fireGain.gain.setTargetAtTime(this.fireLevel * hold, now, on ? DRONE_STOP : 0.35);
    if (this.ringSet > 0) this.ringGain.gain.setTargetAtTime(this.ringSet * hold, now, on ? DRONE_STOP : RING_RISE);
  }

  /**
   * A sound that play() started stands still with the world (`on`) or
   * goes on with it: `v` and `start` as for cut(). Stood still it is
   * silent and keeps its voice and its place in its buffer; going on, it
   * is as loud and as fast as it was, and ends when what it had left has
   * been played (`vRan`: how far it ran on while it faded, for a
   * caller that keeps count). A bomb's whistle played on through a menu at a
   * fiftieth of its speed was a rumble louder than the whistle.
   */
  hold(v, start, on) {
    const now = this.now;
    if (v < 0 || this.vStart[v] !== start || !(this.vEnd[v] > now)) return false;
    const gp = this.vGain[v], rp = this.vSrc[v].playbackRate, g = (v / GROUP) | 0;
    if (on) {
      if (this.vHeld[v] !== 0) return true;
      gp.cancelScheduledValues(now);
      rp.cancelScheduledValues(now);
      // (Silent first, still after: slowed as it faded, a whistle fell
      // two octaves on its way to standing still.)
      gp.setTargetAtTime(0, now, HOLD_RUN * 0.2);
      rp.setValueAtTime(0, now + HOLD_RUN);
      this.vHeld[v] = now;
      this.vLeft[v] = this.vEnd[v] - (start > now ? start : now);
      this.vEnd[v] = now + HELD;
      this.gEnd[g] = now + HELD;
    } else {
      if (this.vHeld[v] === 0) return true;
      // How far it ran on while it faded: all of HOLD_RUN, or as long as
      // it stood if that was less (and not at all if it had not begun).
      const since = now - (start > this.vHeld[v] ? start : this.vHeld[v]);
      const ran = since <= 0 ? 0 : since < HOLD_RUN ? since : HOLD_RUN;
      this.vRan[v] = ran;
      const left = this.vLeft[v] - ran;
      gp.cancelScheduledValues(now);
      rp.cancelScheduledValues(now);
      // Its speed first, at once, while it is silent; then its level. (Its
      // level glided up as its speed came up from nothing, and a whistle
      // let go began with a swoop of an octave.)
      rp.setValueAtTime(this.vRate[v], now);
      gp.setTargetAtTime(this.vLevel[v], now, 0.02);
      this.vHeld[v] = 0;
      // (It ends when what it had left has been played, without the
      // caller having to say: left for the caller, a whistle let go in the
      // frame its blast came was forgotten at speed nothing, its source
      // alive for good, a constant in the mix and a click on the next
      // sound of its voice.)
      this.vEnd[v] = now + (left > 0.02 ? left : 0.02);
      this._groupEnd(g);
    }
    return true;
  }

  /**
   * A sound that stands still (hold()) goes on from another place in
   * itself: `pos` seconds into its buffer, at `rate`, to be over at `end`
   * (audio clock). Its voice and its `start` stay what they were. For a
   * caller that knows where the sound should be by now: a bomb's whistle
   * that stood still each time its world did went on from where it had
   * run on to, with less left each time to fill the fall with, and
   * reached its blast at a third of its note. Returns false if the sound
   * is not standing still yet (it runs on for HOLD_RUN as it fades: let
   * it go with hold()) or is no longer there.
   */
  resume(v, start, pos, rate, end) {
    const now = this.now;
    if (v < 0 || this.vStart[v] !== start || this.vHeld[v] === 0 || start > now || now - this.vHeld[v] < HOLD_RUN) return false;
    const old = this.vSrc[v], buffer = old.buffer;
    if (!(rate > 0) || !(end > now) || !(pos >= 0) || buffer === null || !(pos < buffer.duration)) return false;
    if (rate > 4) rate = 4;
    let src = this.vNext[v];
    if (src === null) {
      src = this.ac.createBufferSource();
      src.connect(this.vIn[v]);
    } else {
      this.vNext[v] = null;
      this.spares--;
    }
    src.buffer = buffer;
    src.playbackRate.value = rate;
    // (The old source stands still and is silent: it ends here, and the
    // new one comes up as a held sound does when it is let go.)
    old.stop(now);
    const gp = this.vGain[v];
    gp.cancelScheduledValues(now);
    gp.setValueAtTime(0, now);
    gp.setTargetAtTime(this.vLevel[v], now, 0.02);
    src.start(now, pos);
    this.vSrc[v] = src;
    this.vRate[v] = rate;
    this.vHeld[v] = 0;
    this.vEnd[v] = end;
    this._groupEnd((v / GROUP) | 0);
    this.retimes++;
    return true;
  }

  // A group is plugged in for as long as the last of its sounds.
  _groupEnd(g) {
    let end = this.now;
    for (let i = g * GROUP; i < (g + 1) * GROUP; i++) if (this.vEnd[i] > end) end = this.vEnd[i];
    this.gEnd[g] = end;
  }

  /**
   * How fast the game's time runs for what is heard: 1, or less in slow
   * motion. Every drone turns that much slower (an engine at a fifth of the
   * speed is a fifth of the revs); the director slows what it starts.
   */
  setSlow(s) {
    if (!(s > 0)) s = 1;
    if (s === this.dScale) return;
    this.dScale = s;
    const now = this.now;
    for (let i = 0; i < DRONES; i++) {
      if (this.dSrc[i] === null) continue;
      const r = this.dRate[i] * s;
      this.dSrc[i].playbackRate.setTargetAtTime(r < 0.1 ? 0.1 : r > 8 ? 8 : r, now, DRONE_GLIDE);
    }
  }

  /**
   * Set drone `ch` (0..DRONES-1): loop sound `snd` at `level` (0 lets the
   * channel fade out and go to rest), played at `rate`, through a low-pass
   * at `cutoff` Hz, panned `pan`. Everything glides (level and rate in
   * about a twelfth of a second), so it can be called every frame or a
   * few times a second; it writes only what has changed.
   * A different sound on a channel that is sounding replaces it at once
   * (the director fades to zero first where that would be heard).
   */
  drone(ch, snd, level, rate, cutoff, pan) {
    const sum = level + rate + cutoff + pan;
    if (!(sum - sum === 0) || !(rate > 0)) return;
    const now = this.now;
    if (level > 0) {
      if (this.dSrc[ch] === null || this.dSnd[ch] !== snd) {
        const b = this.buffers[SOUNDS[snd].base];
        if (b === null) return;
        if (this.dSrc[ch] !== null) { this.dSrc[ch].stop(); this.dSrc[ch].disconnect(); }
        const src = this.ac.createBufferSource();
        src.buffer = b;
        src.loop = true;
        src.playbackRate.value = rate * this.dScale;
        src.connect(this.dLp[ch]);
        // (Not all drones from the same point of their loops: two channels
        // given the same sound would otherwise comb.)
        src.start(now, (ch * 0.37 * b.duration) % b.duration);
        this.dSrc[ch] = src;
        this.dSnd[ch] = snd;
        this.dRate[ch] = rate;
        this.dLp[ch].frequency.setValueAtTime(cutoff, now);
        this.dCut[ch] = cutoff;
      }
      if (this.dAwake[ch] === 0) {
        this.dAwake[ch] = 1;
        this.dronesAwake++;
        this.dOut[ch].connect(this.muffle);
      }
    } else {
      if (this.dLevel[ch] === 0) return;
      this.dZeroAt[ch] = now;
    }
    if (level !== this.dLevel[ch]) {
      this.dLevel[ch] = level;
      this.droneWrites++;
      this.dGain[ch].setTargetAtTime(level * this.dHold, now, DRONE_GLIDE);
    }
    if (level === 0) return;
    if (rate !== this.dRate[ch]) {
      this.dRate[ch] = rate;
      this.droneWrites++;
      const r = rate * this.dScale;
      this.dSrc[ch].playbackRate.setTargetAtTime(r < 0.1 ? 0.1 : r > 8 ? 8 : r, now, DRONE_GLIDE);
    }
    if (cutoff !== this.dCut[ch]) {
      this.dCut[ch] = cutoff;
      this.droneWrites++;
      this.dLp[ch].frequency.setTargetAtTime(cutoff > 20000 ? 20000 : cutoff < 60 ? 60 : cutoff, now, DRONE_GLIDE);
    }
    if (pan !== this.dPanSet[ch]) {
      this.dPanSet[ch] = pan;
      this.droneWrites++;
      this.dPan[ch].setTargetAtTime(pan < -1 ? -1 : pan > 1 ? 1 : pan, now, 0.1);
    }
  }

  /**
   * One sound in the game's own voice (see _buildAmbience): no place, no
   * distance, no room. With every voice busy the one nearest its end makes
   * way. Returns 1 if it plays.
   */
  ui(buf, when, gain, rate) {
    const b = this.buffers[buf];
    if (b === null || !(gain > 0 && rate > 0 && when - when === 0)) return 0;
    const now = this.now;
    if (when < now) when = now;
    let v = 0;
    for (let i = 0; i < UI_VOICES; i++) {
      if (this.uEnd[i] <= now) { v = i; break; }
      if (this.uEnd[i] < this.uEnd[v]) v = i;
    }
    const gp = this.uGain[v];
    gp.cancelScheduledValues(when);
    if (this.uEnd[v] > when) {
      gp.setValueAtTime(this.uLevel[v], when);
      gp.linearRampToValueAtTime(0, when + STEAL_FADE);
      this.uSrc[v].stop(when + STEAL_FADE);
      when += STEAL_FADE + 0.001;
    }
    const src = this.ac.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = rate;
    src.connect(this.uIn[v]);
    gp.setValueAtTime(gain, when);
    src.start(when);
    this.uSrc[v] = src;
    this.uLevel[v] = gain;
    this.uEnd[v] = when + this.durs[buf] / rate;
    if (this.uEnd[v] > this.uiEnd) this.uiEnd = this.uEnd[v];
    if (!this.uiAwake) {
      this.uiAwake = true;
      this.uiBus.connect(this.comp);
    }
    return 1;
  }

  /**
   * Stop everything that is sounding, scheduled or parked, now. For when the
   * output is muted: what was in flight must not be there when it returns.
   * (The bed and the wind are loops under the director's control.)
   */
  silence() {
    const now = this.now = this.ac.currentTime;
    for (let i = 0; i < VOICES; i++) {
      if (!(this.vEnd[i] > now)) continue;
      this.vGain[i].cancelScheduledValues(now);
      this.vGain[i].setValueAtTime(0, now);
      // A sound still on its way has the rest of its params scheduled too.
      this.vCut[i].cancelScheduledValues(now);
      this.vSend[i].cancelScheduledValues(now);
      const pn = this.vPan[i];
      if (this.hrtf) {
        pn.positionX.cancelScheduledValues(now);
        pn.positionY.cancelScheduledValues(now);
        pn.positionZ.cancelScheduledValues(now);
      } else {
        pn.pan.cancelScheduledValues(now);
      }
      this.vSrc[i].stop(now);
      this.vStart[i] = 0; this.vEnd[i] = 0; this.vFade[i] = 0; this.vScore[i] = 0; this.vHeld[i] = 0;
    }
    for (let g = 0; g < GROUPS; g++) if (this.gEnd[g] > now) this.gEnd[g] = now;
    for (let i = 0; i < 2; i++) {
      if (this.aEnd[i] > now) { this.aSrc[i].stop(now); this.aEnd[i] = 0; }
    }
    for (let i = 0; i < UI_VOICES; i++) {
      if (this.uEnd[i] > now) { this.uSrc[i].stop(now); this.uEnd[i] = 0; }
    }
    // Drones are the director's to bring back if their cause is still there.
    for (let i = 0; i < DRONES; i++) {
      if (this.dLevel[i] !== 0) {
        this.dLevel[i] = 0;
        this.dZeroAt[i] = now;
        this.dGain[i].cancelScheduledValues(now);
        this.dGain[i].setValueAtTime(0, now);
      }
    }
    this.qLen = 0;
    this.qHead = 0;
    // Nor deaf ears: the director says again if they still are. (Nor
    // their ringing: left as it was set, a world restarted while the ears
    // rang began with a second of ringing at full level, written back by
    // setStopped() as the new world went on.)
    if (this.deafSet !== 0) {
      this.deafSet = 0;
      this.deafZeroAt = now;
    }
    this.ringSet = 0;
    if (this.deafIn) this._hear(now);
  }

  /** Output volume 0..1, applied after the compressor and the clipper. */
  setVolume(v, tc = 0.02) {
    this.out.gain.setTargetAtTime(v, this.ac.currentTime, tc);
  }
}
