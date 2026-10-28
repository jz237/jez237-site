// The betta moved in a worker (src/fish/bettaWorker.mjs, bettaLink.mjs) against the same fish moved
// on the page's thread (bettaSpecimen.mjs). Given the same inputs, the worker's twin, built without
// its textures, answers each frame's step with what the page's specimen did that frame, bit for bit:
// the vertices the GPU refit is fed, the probes, the mouth, the swim the page reads, what it did to
// the water. A step and a pose cross unchanged; the page's side holds the last pose while a reply
// is late, then takes them oldest first and catches up, keeps the time of a step it could not send,
// makes no buffer a frame, leads the furnishings by the frames until the pose is drawn, and hears
// when the worker failed or went silent.
// Run: node --test betta-worker.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { Worker as NodeWorker } from 'node:worker_threads';
import { FIN_QUALITY } from '../betta-atelier/src/fin-dynamics.js';
import { BettaRemote, poseBytes, readStep, stepScratch, writePose, writeStep } from './src/fish/bettaLink.mjs';
import { BettaSpecimen } from './src/fish/bettaSpecimen.mjs';
import { BETTA_SURFACE_COUNT, bettaSurfaceHeights } from './src/fish/bettaWater.mjs';

// (The page's specimen loads its photographs: images that never arrive.)
globalThis.document ??= { createElementNS: () => ({ addEventListener() {}, removeEventListener() {}, style: {} }) };

const PHONE = { step: 1 / 60, passScale: 0.5, maxFrame: 1 / 30 };
const DESKTOP = { step: 1 / 120, passScale: 1, maxFrame: 0.07 };
const ENV = { radius: 0.99125, sandLevel: -0.6, level: 0.181, iso: 0.5 };
const STILL = [0, 0, 0];
/** Two of the bowl's solid parts across the fish's water (where they are with the bowl upright), and
 *  the room its fins keep round them (fin: as the page sends them, main.ts). */
const SOLIDS = [{ a: [-0.45, -0.3, -0.1], b: [0.4, -0.22, 0.15], r: 0.06, solid: 0.045, fin: 0.045 }, { a: [0.1, -0.5, -0.3], b: [0.05, 0.05, -0.25], r: 0.04, solid: 0.03, fin: 0.04 }];

/** The water as the fish's probes find it: a slow swirl, a knock now and then, the film at the
 *  level, the bed under the head moving a little. */
function sense(t, points) {
  const probes = new Float32Array(128 * 4), knock = t % 13 > 5 && t % 13 < 5.3 ? 2 : 0;
  for (let i = 0; i < 16; i++) {
    const x = points[i * 4], y = points[i * 4 + 1];
    probes.set([0.03 * Math.sin(0.2 * t + y * 3) + knock, 0.01 * Math.sin(0.3 * t + x * 2), 0.03 * Math.cos(0.2 * t + y * 3), y < ENV.level ? 1 : 0], i * 4);
  }
  const heights = bettaSurfaceHeights(ENV.level);
  for (let k = 0; k < BETTA_SURFACE_COUNT; k++) probes[(16 + k) * 4 + 3] = 0.5 + (ENV.level - heights[k]) * 20;
  const sand = new Float32Array(128).fill(ENV.sandLevel);
  sand[0] += 0.02 * Math.sin(t * 0.4);
  return { probes, sand, centroid: [0.001 * Math.sin(t), (ENV.sandLevel + ENV.level) / 2, 0] };
}

/** Frame i's inputs, from the fish the page has (the reference: open loop): a jittered frame time,
 *  no reading for the first frames, the bowl rocking (its solids turned, the weight it feels), a
 *  flare, a pellet, what the water is doing to it (listless a little, short of air now and then,
 *  its fins clamped and opening), the nest's urge. */
function inputs(i, t, fps, ref, turned) {
  const a = 0.35 * Math.sin(0.45 * t), c = Math.cos(a), s = Math.sin(a);
  SOLIDS.forEach((o, k) => {
    for (const [from, to] of [[o.a, turned[k].a], [o.b, turned[k].b]]) to.splice(0, 3, c * from[0] - s * from[1], s * from[0] + c * from[1], from[2]);
  });
  const feeding = t % 17 > 6.5 && t % 17 < 11;
  return {
    dt: (1 / fps) * (1 + 0.25 * Math.sin(i * 0.37)),
    sense: i < 5 ? null : sense(t, ref.probes),
    env: { ...ENV, gravity: [7.2 * Math.sin(a), -24 + 2 * Math.sin(t * 1.3), 0.4 * Math.cos(0.7 * t)] },
    host: { obstacles: turned, food: feeding ? { pos: [0.12, -0.05, 0.08] } : null, gapeWant: feeding ? 0.6 : 0, flared: Math.floor(t / 5) % 2 === 1, water: { lethargy: 0.15 + 0.15 * Math.sin(0.21 * t), gasp: Math.max(0, Math.sin(0.17 * t)), clamp: 0.5 + 0.5 * Math.sin(0.4 * t) } },
    gulpUrge: 0.5 + 0.5 * Math.sin(0.3 * t),
  };
}

/** What the page reads of a fish after a frame (the specimen, or the remote), and the vertices drawn. */
function reading(fish, vertices) {
  const d = fish.takeDisturbance(), s = fish.swim;
  return { vertices: Float32Array.from(vertices), probes: fish.probes.slice(), mouth: fish.mouth.toArray(), level: fish.level, mode: s.mode, heading: s.heading, pitch: s.pitch, push: d.push, pushAt: d.pushAt.toArray(), bubbles: d.bubbles, bubblesAt: d.bubblesAt.toArray() };
}

const bits = (x) => new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
function assertSameBits(x, y, label) {
  for (const k of Object.keys(x)) {
    if (x[k] instanceof Float32Array) {
      const p = bits(x[k]), q = bits(y[k]), at = p.findIndex((v, j) => v !== q[j]);
      assert.ok(p.length === q.length && at < 0, `${label}: ${k} differs at byte ${at}`);
    }
    else if (Array.isArray(x[k])) x[k].forEach((v, j) => assert.ok(Object.is(v, y[k][j]), `${label}: ${k}[${j}] ${v} vs ${y[k][j]}`));
    else assert.ok(Object.is(x[k], y[k]), `${label}: ${k} ${x[k]} vs ${y[k]}`);
  }
}

/** bettaWorker.mjs in a node worker thread, as a page's Worker: messages wait until it has run. */
class PageWorker {
  constructor() {
    const boot = `
      const { parentPort, workerData } = require('node:worker_threads');
      globalThis.self = globalThis;
      globalThis.postMessage = (m, t) => parentPort.postMessage(m, t);
      const queue = [];
      let up = false;
      parentPort.on('message', (data) => (up ? globalThis.onmessage({ data }) : queue.push(data)));
      import(workerData).then(() => { up = true; for (const data of queue) globalThis.onmessage({ data }); });`;
    this.thread = new NodeWorker(boot, { eval: true, workerData: new URL('./src/fish/bettaWorker.mjs', import.meta.url).href });
    this.thread.on('message', (data) => this.onmessage({ data }));
    this.thread.on('error', (e) => this.onerror({ message: e.message }));
  }
  postMessage(message, transfer) { this.thread.postMessage(message, transfer); }
  terminate() { return this.thread.terminate(); }
}

/** A worker that keeps what it is sent, and the steps it has yet to answer. */
function fakeWorker() {
  const sent = [], pending = [];
  return {
    sent,
    pending,
    postMessage(m) {
      sent.push({ ...m, spare: m.spare && [...m.spare] });
      if (m.step) pending.push(m.step);
    },
    terminate() {},
  };
}

test('a step and a pose cross bit for bit', () => {
  Object.assign(FIN_QUALITY, PHONE);
  const fish = new BettaSpecimen({ textures: false }), scratch = stepScratch();
  const turned = SOLIDS.map((o) => ({ ...o, a: [...o.a], b: [...o.b] }));
  let t = 0;
  for (let i = 0; i < 40; i++) {
    const x = inputs(i, t, 60, fish, turned);
    t += x.dt;
    if (x.sense) x.sense.probes.set([NaN, -0, 1e-40, 3.4e38], 4);
    const back = readStep(writeStep(null, x.dt, x.sense, x.env, x.host, x.gulpUrge), fish, scratch);
    assert.ok(Object.is(back.dt, x.dt));
    assert.deepEqual(back.env, x.env);
    assert.deepEqual(back.host, x.host);
    assert.ok(Object.is(fish.swim.gulpUrge, x.gulpUrge));
    if (!x.sense) assert.equal(back.sense, null);
    else {
      assert.deepEqual(bits(back.sense.probes), bits(x.sense.probes.subarray(0, 96)));
      assert.deepEqual(bits(back.sense.sand), bits(x.sense.sand.subarray(0, 6)));
      assert.deepEqual(back.sense.centroid, x.sense.centroid);
    }
    fish.step(back.dt, back.sense, back.env, back.host);
  }
  // (A step written again over one with more obstacles: what is read is what was last written.)
  const env = { ...ENV, gravity: [0, -24, 0] }, none = { obstacles: turned, food: null, gapeWant: 0, flared: false };
  const long = writeStep(null, 0.016, null, env, none, 0);
  assert.equal(readStep(writeStep(long, 0.016, null, env, { ...none, obstacles: turned.slice(1) }, 0), fish, scratch).host.obstacles.length, 1);
  // A pose, as the page's side then reads it.
  fish.ripple = 0.25;
  fish.rippleAt.set(0.1, 0.18, -0.2);
  fish.bubbleCount = 3;
  fish.bubbleAt.set(-0.05, 0.1, 0.02);
  const s = fish.swim;
  const want = { vertices: fish.vertices.slice(), probes: fish.probes.slice(), mouth: fish.mouth.toArray(), level: fish.level, mode: s.mode, heading: s.heading, pitch: s.pitch, push: 0.25, pushAt: [0.1, 0.18, -0.2], bubbles: 3, bubblesAt: [-0.05, 0.1, 0.02] };
  const buffer = writePose(null, fish);
  assert.equal(buffer.byteLength, poseBytes(fish.vertices.length));
  assert.ok(fish.ripple === 0 && fish.bubbleCount === 0, 'taken');
  const remote = new BettaRemote(fakeWorker(), new BettaSpecimen({ textures: false }));
  remote.receive({ pose: buffer, step: null, mode: s.mode });
  assertSameBits(want, reading(remote, remote.take()), 'pose');
});

test("the worker's twin moves as the page's specimen does, a frame later, bit for bit", async () => {
  const fps = 60, frames = 480;
  Object.assign(FIN_QUALITY, PHONE);
  const page = new BettaSpecimen(), worker = new PageWorker();
  const remote = new BettaRemote(worker, page);
  const turned = SOLIDS.map((o) => ({ ...o, a: [...o.a], b: [...o.b] }));
  const tick = () => new Promise((r) => setImmediate(r));
  let t = 0, last = null;
  const modes = new Set();
  try {
    while (!remote.ready) await tick();
    for (let i = 0; i < frames; i++) {
      // (Its last 120 frames solved as on a desktop: the worker follows FIN_QUALITY as it changes.)
      if (i === frames - 120) Object.assign(FIN_QUALITY, DESKTOP);
      const x = inputs(i, t, fps, page, turned);
      t += x.dt;
      // The page's frame with the worker: the pose back from the last frame's step, then this step.
      const drawn = remote.take();
      if (i === 0) assert.equal(drawn, null);
      else assertSameBits(last, reading(remote, drawn), `frame ${i}`);
      remote.swim.gulpUrge = x.gulpUrge;
      remote.post(x.dt, x.sense, x.env, x.host, STILL);
      // ...and on the page's thread.
      page.swim.gulpUrge = x.gulpUrge;
      page.step(x.dt, x.sense, x.env, x.host);
      last = reading(page, page.vertices);
      modes.add(page.swim.mode);
      // (A worker on time.)
      while (!remote.waiting.length) await tick();
    }
  } finally {
    await worker.terminate();
    Object.assign(FIN_QUALITY, PHONE);
  }
  assert.ok(remote.posed && !remote.failed);
  for (const m of ['startle', 'feed']) assert.ok(modes.has(m), `it was seen to ${m} (${[...modes]})`);
});

test('late replies are held, then taken oldest first and caught up on; no time or water lost', () => {
  Object.assign(FIN_QUALITY, PHONE);
  const fish = new BettaSpecimen({ textures: false }), worker = fakeWorker();
  const remote = new BettaRemote(worker, fish);
  const env = { ...ENV, gravity: [0, -24, 0] }, host = { obstacles: [], food: null, gapeWant: 0, flared: false };
  const step = (dt) => remote.post(dt, null, env, host, STILL);
  const reply = (mode, bubbles = 0) => {
    fish.bubbleCount = bubbles;
    remote.receive({ pose: writePose(null, fish), step: worker.pending.shift(), mode });
  };
  assert.ok(worker.sent[0].start);
  step(0.016);
  assert.equal(worker.sent.length, 1, 'nothing is sent before it is ready');
  remote.receive({ ready: true });
  // Two steps unanswered; the third's time is kept for the next one sent.
  for (const dt of [0.01, 0.02, 0.03]) {
    assert.equal(remote.take(), null);
    step(dt);
  }
  assert.ok(!remote.posed);
  assert.equal(worker.pending.length, 2);
  reply('a');
  assert.ok(remote.take());
  assert.ok(remote.posed);
  assert.equal(remote.swim.mode, 'a');
  step(0.04);
  assert.equal(worker.pending.at(-1)[0], 0.03 + 0.04);
  // Late: nothing to take, the last pose stays drawn. Then two at once: the older is drawn.
  assert.equal(remote.take(), null);
  step(1 / 60);
  reply('b');
  reply('c', 2);
  assert.ok(remote.take());
  assert.equal(remote.swim.mode, 'b');
  remote.takeDisturbance();
  // On time again, two behind: on the 120th frame in a row with a pose to spare, one is skipped.
  let spare = 1, n = 0;
  for (; n < 200; n++) {
    step(1 / 60);
    reply(`pose ${n}`, 1);
    spare++;
    assert.ok(remote.take());
    if (remote.swim.mode === `pose ${n}`) break;
    assert.equal(remote.swim.mode, n ? `pose ${n - 1}` : 'c');
  }
  assert.equal(spare, 120);
  assert.equal(remote.takeDisturbance().bubbles, 2 + n + 1, "the skipped pose's bubbles too");
  // No buffer is made a frame: the steps come back to be written again, the poses drawn go back.
  const steps = new Set(worker.sent.filter((m) => m.step).map((m) => m.step));
  assert.ok(steps.size <= 3, `${steps.size} step buffers`);
  assert.ok(worker.sent.slice(-n).every((m) => m.spare.length >= 1));
});

test('the furnishings are sent where the bowl will have turned them by the time the pose is drawn', () => {
  const worker = fakeWorker(), fish = new BettaSpecimen({ textures: false }), remote = new BettaRemote(worker, fish), scratch = stepScratch();
  remote.receive({ ready: true });
  const env = { ...ENV, gravity: [0, -24, 0] }, host = { obstacles: SOLIDS, food: null, gapeWant: 0, flared: false };
  const omega = [0.8, -2.5, 1.1], dt = 1 / 60, w = Math.hypot(...omega);
  /** p turned by angle about omega (as a rotation matrix would turn it). */
  const turned = (p, angle) => {
    const k = omega.map((v) => v / w), c = Math.cos(angle), s = Math.sin(angle), along = k[0] * p[0] + k[1] * p[1] + k[2] * p[2];
    const cross = [k[1] * p[2] - k[2] * p[1], k[2] * p[0] - k[0] * p[2], k[0] * p[1] - k[1] * p[0]];
    return p.map((v, j) => v * c + cross[j] * s + k[j] * along * (1 - c));
  };
  const reply = () => remote.receive({ pose: writePose(null, fish), step: worker.pending.shift(), mode: 'cruise' });
  // On by a frame's turn for the frame it is drawn in, and one more for each pose to be drawn before
  // it: nothing ahead (a frame behind); a step unanswered (a worker slower than a frame: two
  // behind); a pose waiting and a step unanswered; the pose taken, then two waiting, one taken.
  for (const [ahead, behind] of [[() => {}, 1], [() => {}, 2], [reply, 3], [() => (remote.take(), reply(), reply(), remote.take()), 2]]) {
    ahead();
    remote.post(dt, null, env, host, omega);
    const sent = readStep(worker.pending.at(-1), fish, scratch).host.obstacles;
    SOLIDS.forEach((o, k) => {
      for (const end of ['a', 'b']) turned(o[end], w * dt * behind).forEach((v, j) => assert.ok(Math.abs(v - sent[k][end][j]) < 1e-15, `${behind} behind: ${end}`));
    });
  }
  // Still: sent as they are, to the bit.
  remote.post(dt, null, env, host, STILL);
  readStep(worker.pending.at(-1), fish, scratch).host.obstacles.forEach((o, k) => assert.deepEqual([o.a, o.b], [SOLIDS[k].a, SOLIDS[k].b]));
});

test('a worker that never comes up, or stops answering, without an error is given up for lost', () => {
  const env = { ...ENV, gravity: [0, -24, 0] }, host = { obstacles: [], food: null, gapeWant: 0, flared: false };
  // Never ready: the fish's first 299 frames hold (nothing to draw yet), the 300th gives it up.
  const silent = new BettaRemote(fakeWorker(), new BettaSpecimen({ textures: false }));
  for (let i = 0; i < 299; i++) assert.equal(silent.take(), null);
  assert.equal(silent.failed, null);
  silent.take();
  assert.equal(silent.failed, 'the betta worker never came up');
  // Answering, late now and then: each pose taken starts the count again.
  const worker = fakeWorker(), fish = new BettaSpecimen({ textures: false }), remote = new BettaRemote(worker, fish);
  remote.receive({ ready: true });
  const frame = () => {
    remote.take();
    remote.post(1 / 60, null, env, host, STILL);
  };
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 290; j++) frame();
    while (worker.pending.length) remote.receive({ pose: writePose(null, fish), step: worker.pending.shift(), mode: 'cruise' });
  }
  assert.equal(remote.failed, null);
  // The two back drawn, then nothing more back: 300 frames in a row with nothing to take.
  for (let i = 0; i < 2; i++) frame();
  for (let i = 0; i < 299; i++) frame();
  assert.equal(remote.failed, null);
  frame();
  assert.equal(remote.failed, 'the betta worker stopped answering');
  const sent = worker.sent.length;
  frame();
  assert.equal(worker.sent.length, sent, 'nothing more sent');
});

test('a worker that fails is heard', () => {
  const worker = fakeWorker(), remote = new BettaRemote(worker, new BettaSpecimen({ textures: false }));
  remote.receive({ ready: true });
  worker.onerror({ message: 'gone', preventDefault() {} });
  assert.equal(remote.failed, 'gone');
  remote.post(0.016, null, { ...ENV, gravity: [0, -24, 0] }, { obstacles: [], food: null, gapeWant: 0, flared: false }, STILL);
  assert.equal(worker.sent.length, 1, 'nothing more sent');
});
