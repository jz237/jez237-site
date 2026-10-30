// The betta moved in a worker, a frame behind the page (bettaWorker.mjs; Betta.ts draws it): what
// goes there each frame (a step: the frame's inputs, packed) and what comes back (a pose: the
// vertices, the probes and mouth, what the page reads of its swim, what it did to the water), in
// buffers handed back and forth, so that a frame allocates none of them. Every number goes as the
// float it was (the water's readings float32, the rest float64), so the worker's twin of the page's
// specimen (bettaSpecimen.mjs) moves as that specimen would, bit for bit.
import * as THREE from 'three';
import { FIN_QUALITY } from '../../../betta-atelier/src/fin-dynamics.js';
import { turnPoints } from './bettaSwim.mjs';

/** The water's readings the betta reads (bettaWater.mjs readBettaWater): its 16 probes, then the 8
 *  of the column above its mouth (BETTA_SURFACE_AT), four floats each, and the sand under the first
 *  six. */
const SENSE_FLOATS = 24 * 4, SENSE_SAND = 6;
/** A step (float64s): dt; FIN_QUALITY's step, passScale, maxFrame; the globe (KoiEnv); the host's
 *  inputs (a pellet or none, where; the gape; flared; the swim's gulpUrge; what the water is doing
 *  to it: lethargy, gasp, clamp); the water's reading or none, its centroid; how many obstacles;
 *  the bowl's turn about its own axis since the last step; the reading's probes and sand; then the
 *  obstacles, ten floats each (a, b, r, solid, fin, leaf). */
const S = { dt: 0, quality: 1, radius: 4, level: 5, sandLevel: 6, iso: 7, gravity: 8, food: 11, foodAt: 12, gape: 15, flared: 16, gulpUrge: 17, water: 18, sensed: 21, centroid: 22, obstacles: 25, turn: 26, probes: 29, sand: 29 + SENSE_FLOATS, capsules: 29 + SENSE_FLOATS + SENSE_SAND };
/** A pose: float64s first (the swim's heading and pitch, the water level it was moved at, the
 *  mouth, the ripple and where, the bubbles and where; 16 of them, so the float32s are aligned),
 *  then float32s (the 16 probes, four each; the vertices, three each). */
const P = { heading: 0, pitch: 1, level: 2, mouth: 3, ripple: 6, rippleAt: 7, bubbles: 10, bubbleAt: 11 };
const POSE_HEAD = 16, PROBE_FLOATS = 16 * 4;
/** Steps sent and not yet answered, at most (past that a frame's time is kept for the next step). */
const IN_FLIGHT = 2;
/** Frames in a row with a second pose waiting (two seconds at 60 a second: the worker answering in
 *  time again, after a late reply put the page two frames behind) before one is skipped, to draw a
 *  frame behind again. (Each skip is a frame's jump; a worker late now and then is better met two
 *  behind than with a frame held, and a skip, each time.) */
const CATCH_UP = 120;
/** Frames in a row with no pose to take (five seconds at 60 a second) before the worker is taken
 *  for lost: one that never came up, or stopped answering, without an error to say so (its script's
 *  fetch stalled, say, or it hangs). Its fish is then moved on the page's thread (Betta.ts). */
const STALLED = 300;

/** The bytes of a pose of `vertices` floats. */
export const poseBytes = (vertices) => POSE_HEAD * 8 + (PROBE_FLOATS + vertices) * 4;

/**
 * A step's inputs into `data` (a Float64Array back from the worker, or null, or one too short: a new
 * one is made). dt, sense, env as BettaSpecimen.step takes them; host: what it reads of its host
 * (BettaHost); gulpUrge: the swim's (BettaSwim.gulpUrge, set by the page); lead: a turn (rad, about
 * its axis: sim frame) to carry the obstacles on by, or null; turn: the bowl's turn about its own
 * axis since the last step (rad, along it: sim frame), which carries the fish, or null. Returns the
 * array.
 */
export function writeStep(data, dt, sense, env, host, gulpUrge, lead = null, turn = null) {
  const obstacles = host.obstacles, length = S.capsules + obstacles.length * 10;
  if (!data || data.length < length) data = new Float64Array(length);
  data[S.dt] = dt;
  data[S.quality] = FIN_QUALITY.step; data[S.quality + 1] = FIN_QUALITY.passScale; data[S.quality + 2] = FIN_QUALITY.maxFrame;
  data[S.radius] = env.radius; data[S.level] = env.level; data[S.sandLevel] = env.sandLevel; data[S.iso] = env.iso;
  data.set(env.gravity, S.gravity);
  data[S.food] = host.food ? 1 : 0;
  if (host.food) data.set(host.food.pos, S.foodAt);
  data[S.gape] = host.gapeWant;
  data[S.flared] = host.flared ? 1 : 0;
  data[S.gulpUrge] = gulpUrge;
  const w = host.water;
  data[S.water] = w ? w.lethargy : 0; data[S.water + 1] = w ? w.gasp : 0; data[S.water + 2] = w ? w.clamp : 0;
  data[S.sensed] = sense ? 1 : 0;
  if (sense) {
    data.set(sense.centroid, S.centroid);
    data.set(sense.probes.subarray(0, SENSE_FLOATS), S.probes);
    data.set(sense.sand.subarray(0, SENSE_SAND), S.sand);
  }
  data[S.obstacles] = obstacles.length;
  for (let k = 0; k < 3; k++) data[S.turn + k] = turn ? turn[k] : 0;
  const angle = lead ? Math.hypot(lead[0], lead[1], lead[2]) : 0;
  obstacles.forEach((o, k) => {
    const at = S.capsules + k * 10;
    if (angle > 0) {
      turnBy(o.a, lead, angle, data, at);
      turnBy(o.b, lead, angle, data, at + 3);
    } else {
      data.set(o.a, at);
      data.set(o.b, at + 3);
    }
    data[at + 6] = o.r;
    data[at + 7] = o.solid;
    data[at + 8] = o.fin ?? o.solid;
    data[at + 9] = o.leaf ? 1 : 0;
  });
  return data;
}

/** p turned by `angle` about the axis `turn` points along (Rodrigues), into out at `at`. */
function turnBy(p, turn, angle, out, at) {
  const kx = turn[0] / angle, ky = turn[1] / angle, kz = turn[2] / angle, c = Math.cos(angle), s = Math.sin(angle);
  const along = (kx * p[0] + ky * p[1] + kz * p[2]) * (1 - c);
  out[at] = p[0] * c + (ky * p[2] - kz * p[1]) * s + kx * along;
  out[at + 1] = p[1] * c + (kz * p[0] - kx * p[2]) * s + ky * along;
  out[at + 2] = p[2] * c + (kx * p[1] - ky * p[0]) * s + kz * along;
}

/** Scratch for readStep, made once: what it unpacks into. */
export function stepScratch() {
  return {
    sense: { probes: new Float32Array(SENSE_FLOATS), sand: new Float32Array(SENSE_SAND), centroid: [0, 0, 0] },
    env: { radius: 0, level: 0, sandLevel: 0, iso: 0, gravity: [0, 0, 0] },
    host: { obstacles: [], food: null, gapeWant: 0, flared: false, water: { lethargy: 0, gasp: 0, clamp: 0 } },
    food: { pos: [0, 0, 0] },
    turn: [0, 0, 0],
  };
}

/**
 * A step written by writeStep, unpacked into `scratch` (stepScratch) for `fish` (the worker's
 * specimen): FIN_QUALITY and the swim's gulpUrge set as the page had them. Returns { dt, sense,
 * env, host, turn } for fish.step.
 */
export function readStep(data, fish, scratch) {
  const { sense, env, host, food, turn } = scratch;
  FIN_QUALITY.step = data[S.quality]; FIN_QUALITY.passScale = data[S.quality + 1]; FIN_QUALITY.maxFrame = data[S.quality + 2];
  env.radius = data[S.radius]; env.level = data[S.level]; env.sandLevel = data[S.sandLevel]; env.iso = data[S.iso];
  for (let k = 0; k < 3; k++) env.gravity[k] = data[S.gravity + k];
  for (let k = 0; k < 3; k++) food.pos[k] = data[S.foodAt + k];
  host.food = data[S.food] ? food : null;
  host.gapeWant = data[S.gape];
  host.flared = data[S.flared] === 1;
  fish.swim.gulpUrge = data[S.gulpUrge];
  host.water.lethargy = data[S.water]; host.water.gasp = data[S.water + 1]; host.water.clamp = data[S.water + 2];
  for (let k = 0; k < 3; k++) sense.centroid[k] = data[S.centroid + k];
  sense.probes.set(data.subarray(S.probes, S.probes + SENSE_FLOATS));
  sense.sand.set(data.subarray(S.sand, S.sand + SENSE_SAND));
  const n = data[S.obstacles], obstacles = host.obstacles;
  while (obstacles.length < n) obstacles.push({ a: [0, 0, 0], b: [0, 0, 0], r: 0, solid: 0, fin: 0, leaf: false });
  obstacles.length = n;
  obstacles.forEach((o, k) => {
    const at = S.capsules + k * 10;
    for (let j = 0; j < 3; j++) { o.a[j] = data[at + j]; o.b[j] = data[at + 3 + j]; }
    o.r = data[at + 6];
    o.solid = data[at + 7];
    o.fin = data[at + 8];
    o.leaf = data[at + 9] === 1;
  });
  for (let k = 0; k < 3; k++) turn[k] = data[S.turn + k];
  const turned = turn[0] !== 0 || turn[1] !== 0 || turn[2] !== 0;
  return { dt: data[S.dt], sense: data[S.sensed] ? sense : null, env, host, turn: turned ? turn : null };
}

/** `fish`'s pose after a step into `buffer` (an ArrayBuffer of poseBytes, back from the page, or
 *  null: a new one is made), and what it did to the water (taken: reset). Returns the buffer. */
export function writePose(buffer, fish) {
  buffer ??= new ArrayBuffer(poseBytes(fish.vertices.length));
  const head = new Float64Array(buffer, 0, POSE_HEAD), floats = new Float32Array(buffer, POSE_HEAD * 8);
  const d = fish.takeDisturbance();
  head[P.heading] = fish.swim.heading; head[P.pitch] = fish.swim.pitch; head[P.level] = fish.level;
  fish.mouth.toArray(head, P.mouth);
  head[P.ripple] = d.push; d.pushAt.toArray(head, P.rippleAt);
  head[P.bubbles] = d.bubbles; d.bubblesAt.toArray(head, P.bubbleAt);
  floats.set(fish.probes);
  floats.set(fish.vertices, PROBE_FLOATS);
  return buffer;
}

/**
 * The page's side of the worker (bettaWorker.mjs): each frame the page takes a pose to draw (take),
 * the one the worker made of the last frame's step (after a late reply, of the one before), then
 * sends this frame's step (post). What the page reads of the fish it reads here, as BettaSpecimen
 * has it: probes, mouth, level, swim (mode, heading, pitch; gulpUrge, which the page sets),
 * takeDisturbance(). worker: the worker (anything with postMessage, onmessage, onerror and
 * terminate); twin: the page's specimen, as built (the worker builds its own alike; until its first
 * pose comes, this one's is read).
 */
export class BettaRemote {
  constructor(worker, twin) {
    this.worker = worker;
    this.vertexFloats = twin.vertices.length;
    this.probes = twin.probes.slice();
    this.mouth = twin.mouth.clone();
    this.level = twin.level;
    this.swim = { mode: twin.swim.mode, heading: twin.swim.heading, pitch: twin.swim.pitch, gulpUrge: twin.swim.gulpUrge };
    /** It has built its specimen; a pose has been taken; why it stopped, if it has. */
    this.ready = false;
    this.posed = false;
    /** @type {string | null} */
    this.failed = null;
    this.disturbance = { push: 0, pushAt: new THREE.Vector3(), bubbles: 0, bubblesAt: new THREE.Vector3() };
    // (Steps sent and not answered; time not yet sent; the poses back, oldest first, not yet drawn;
    // drawn poses' buffers, to go back with the next step; steps' buffers back, to write steps in;
    // frames in a row with a pose to spare; frames in a row with none to take; post's turn.)
    this.sent = 0;
    this.owed = 0;
    this.waiting = [];
    this.spare = [];
    this.steps = [];
    this.spareRun = 0;
    this.held = 0;
    this.turn = [0, 0, 0];
    // (The bowl's turns about its own axis: all of them so far; those not yet sent; at each step
    // still to be drawn, all of them as it was sent, oldest first, and arrays to keep those in;
    // and, as a pose is drawn, those since its step.)
    this.turned = [0, 0, 0];
    this.turnOwed = [0, 0, 0];
    this.turnedAt = [];
    this.turnedFree = [];
    this.turnSince = [0, 0, 0];
    worker.onmessage = (e) => this.receive(e.data);
    worker.onerror = (e) => {
      e.preventDefault?.();
      this.failed = e.message || 'the betta worker failed';
    };
    worker.postMessage({ start: { quality: { ...FIN_QUALITY }, vertices: this.vertexFloats } });
  }

  receive(data) {
    if (data.ready) {
      this.ready = true;
      return;
    }
    this.sent--;
    this.steps.push(data.step);
    this.waiting.push(data);
  }

  /** This frame's step (as BettaSpecimen.step takes it, the host's inputs read from `host`), sent;
   *  or, with IN_FLIGHT steps unanswered, its time kept for the next. Nothing before it is ready.
   *  omega: the bowl's spin (rad/s, sim frame). Its pose is drawn a frame or more from now (one,
   *  and one more for each pose to be drawn before it: those waiting, and those of the steps still
   *  unanswered), so the furnishings it is kept out of are sent where the bowl's spin will have
   *  carried them by then: where they are drawn with it. (Not its turn about its own axis, `turn`
   *  this frame, as Betta.update has it: the fish is carried round with that, and keeps its place
   *  among them.)
   *  @param {ArrayLike<number> | null} [turn] */
  post(dt, sense, env, host, omega, turn = null) {
    if (turn) for (let k = 0; k < 3; k++) this.turnOwed[k] += turn[k];
    if (!this.ready || this.failed) return;
    if (this.sent >= IN_FLIGHT) {
      this.owed += dt;
      return;
    }
    const ahead = (1 + this.waiting.length + this.sent) * dt, lead = this.turn, rate = turn && dt > 0 ? 1 / dt : 0;
    for (let k = 0; k < 3; k++) lead[k] = (omega[k] - (turn ? turn[k] : 0) * rate) * ahead;
    const step = writeStep(this.steps.pop() ?? null, dt + this.owed, sense, env, host, this.swim.gulpUrge, lead, this.turnOwed);
    this.owed = 0;
    this.turnOwed.fill(0);
    const at = this.turnedFree.pop() ?? [0, 0, 0];
    for (let k = 0; k < 3; k++) at[k] = this.turned[k];
    this.turnedAt.push(at);
    this.worker.postMessage({ step, spare: this.spare }, [step.buffer, ...this.spare]);
    this.spare.length = 0;
    this.sent++;
  }

  /** The pose to draw this frame, if one has come: its vertices (good until the next post). From
   *  now on its probes, mouth and swim are what the page reads, and what it did to the water is
   *  taken with them. Taken oldest first, so that a reply a little late costs a frame's delay, not
   *  a frame held and the next skipped; once a second pose has been waiting CATCH_UP frames in a
   *  row, one is skipped (what it did to the water still taken), to be a frame behind again. Null:
   *  none has come, and the last one stays drawn; after STALLED such frames in a row the worker
   *  has failed. (A frame takes one pose and sends one step, and IN_FLIGHT bounds the steps
   *  unanswered, so no more than two are ever waiting.) turn: the bowl's turn about its own axis
   *  this frame (Betta.update): a pose is drawn carried on by the turns since its step was sent, as
   *  the fish has been carried by those before it.
   *  @param {ArrayLike<number> | null} [turn] */
  take(turn = null) {
    if (turn) for (let k = 0; k < 3; k++) this.turned[k] += turn[k];
    const waiting = this.waiting;
    if (!waiting.length) {
      if (++this.held >= STALLED) this.failed = this.ready ? 'the betta worker stopped answering' : 'the betta worker never came up';
      return null;
    }
    this.held = 0;
    this.spareRun = waiting.length > 1 ? this.spareRun + 1 : 0;
    if (this.spareRun >= CATCH_UP) {
      this.spareRun = 0;
      this.absorb(this.carried(waiting.shift()));
    }
    const pose = this.carried(waiting.shift()), buffer = this.absorb(pose);
    const head = new Float64Array(buffer, 0, POSE_HEAD), floats = new Float32Array(buffer, POSE_HEAD * 8);
    const s = this.swim, since = this.turnSince;
    s.mode = pose.mode;
    s.heading = head[P.heading] + since[1];
    s.pitch = head[P.pitch];
    this.level = head[P.level];
    this.mouth.fromArray(head, P.mouth);
    this.probes.set(floats.subarray(0, PROBE_FLOATS));
    turnPoints(this.probes, since, 0, PROBE_FLOATS, 4);
    this.posed = true;
    const vertices = floats.subarray(PROBE_FLOATS, PROBE_FLOATS + this.vertexFloats);
    turnPoints(vertices, since);
    return vertices;
  }

  /** A pose carried on by the bowl's turns since its step was sent (turnSince, from its step's
   *  record): its mouth, and where it dimpled the film and let bubbles go. Returns the pose. */
  carried(pose) {
    const at = this.turnedAt.shift(), since = this.turnSince;
    if (at) {
      for (let k = 0; k < 3; k++) since[k] = this.turned[k] - at[k];
      this.turnedFree.push(at);
    } else since.fill(0);
    const head = new Float64Array(pose.pose, 0, POSE_HEAD);
    for (const at of [P.mouth, P.rippleAt, P.bubbleAt]) turnPoints(head, since, at, at + 3);
    return pose;
  }

  /** A pose's disturbance of the water added to what the page has yet to take; its buffer to go back. */
  absorb(pose) {
    const head = new Float64Array(pose.pose, 0, POSE_HEAD), d = this.disturbance;
    d.push += head[P.ripple];
    d.pushAt.fromArray(head, P.rippleAt);
    d.bubbles += head[P.bubbles];
    d.bubblesAt.fromArray(head, P.bubbleAt);
    this.spare.push(pose.pose);
    return pose.pose;
  }

  /** As BettaSpecimen.takeDisturbance: what the poses taken did to the water since last asked. */
  takeDisturbance() {
    const d = this.disturbance, out = { push: d.push, pushAt: d.pushAt, bubbles: d.bubbles, bubblesAt: d.bubblesAt };
    d.push = 0;
    d.bubbles = 0;
    return out;
  }

  close() {
    this.worker.terminate();
  }
}
