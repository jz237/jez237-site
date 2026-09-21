import test from "node:test";
import assert from "node:assert/strict";
import { AudioEngine, cueTimes } from "../src/audio.mjs";
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
const cue = {
  verified: true,
  path: "./music/test.wav",
  sampleRate: 44100,
  startFrame: 2205,
  loopStartFrame: 4410,
  loopEndFrame: 44100,
};
function fixture() {
  const sources = [],
    requests = [];
  const param = () => ({
    value: 0,
    setTargetAtTime() {},
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  });
  const node = () => ({
    gain: param(),
    frequency: param(),
    connect() {
      return this;
    },
    disconnect() {
      this.disconnected = true;
    },
  });
  const context = {
    state: "suspended",
    currentTime: 0,
    destination: {},
    sampleRate: 48000,
    createGain: node,
    createBiquadFilter: node,
    createBuffer: (numberOfChannels, length, sampleRate) => ({
      numberOfChannels,
      length,
      sampleRate,
      duration: length / sampleRate,
      getChannelData: () => new Float32Array(length),
    }),
    createBufferSource() {
      const source = {
        ...node(),
        start(...args) {
          this.started = args;
        },
        stop() {
          this.stopped = true;
        },
      };
      sources.push(source);
      return source;
    },
    async decodeAudioData(data) {
      return data;
    },
    async resume() {
      this.state = "running";
    },
    async suspend() {
      this.state = "suspended";
    },
  };
  const audio = new AudioEngine({
    createContext: () => context,
    fetchAudio: (path, options) => {
      const task = deferred();
      requests.push({ path, options, task });
      return task.promise;
    },
  });
  audio.verifiedCues = { a: cue, b: { ...cue, path: "./music/second.wav" } };
  const buffer = { duration: 2, length: 96000, numberOfChannels: 2 };
  const resolve = (index = 0, body = buffer) =>
    requests[index].task.resolve({ ok: true, arrayBuffer: async () => body });
  return { audio, context, sources, requests, resolve, buffer };
}
test("cue frames preserve a nonzero intro and reject invalid loop boundaries", () => {
  assert.deepEqual(cueTimes(cue, 2), {
    start: 0.05,
    loopStart: 0.1,
    loopEnd: 1,
  });
  assert.deepEqual(cueTimes({ ...cue, loop: false }, 2), { start: 0.05 });
  for (const invalid of [
    { sampleRate: 0 },
    { startFrame: -1 },
    { loopStartFrame: 2000 },
    { loopEndFrame: 4000 },
    { loopEndFrame: 90000 },
    { loopEndFrame: 1.5 },
  ])
    assert.throws(() => cueTimes({ ...cue, ...invalid }, 2));
});
test("verified cues use native looping in source time at a different device sample rate", async () => {
  const f = fixture();
  await f.audio.unlock();
  const pending = f.audio.playCue("a");
  f.resolve();
  assert.equal(await pending, true);
  const s = f.audio.track;
  assert.equal(s.loop, true);
  assert.equal(s.loopStart, 0.1);
  assert.equal(s.loopEnd, 1);
  assert.deepEqual(s.started, [0, 0.05]);
  f.audio.volumes(0.2, 0.7);
  assert.equal(f.audio.musicBus.gain.value, 0.2);
  assert.equal(f.audio.bus.gain.value, 0.7);
});
test("unverified or locked cues never fetch audio or create a music source", async () => {
  const f = fixture();
  assert.equal(await f.audio.playCue("a"), false);
  await f.audio.unlock();
  f.audio.verifiedCues.a = { ...cue, verified: false };
  assert.equal(await f.audio.playCue("a"), false);
  assert.equal(f.requests.length, 0);
  assert.equal(f.audio.track, null);
});
test("late fetching and decoding cannot replace a newer cue", async () => {
  const f = fixture();
  await f.audio.unlock();
  const decoding = deferred();
  f.context.decodeAudioData = async (data) =>
    data === "slow" ? decoding.promise : data;
  const old = f.audio.playCue("a");
  f.resolve(0, "slow");
  await Promise.resolve();
  await Promise.resolve();
  const current = f.audio.playCue("b");
  f.resolve(1);
  assert.equal(await current, true);
  const active = f.audio.track;
  decoding.resolve(f.buffer);
  assert.equal(await old, false);
  assert.equal(f.audio.track, active);
  assert.ok(f.requests[0].options.signal.aborted);
  assert.equal(
    f.sources.filter((s) => s !== f.audio.rolling && s.started).length,
    1,
  );
});
test("stop during download prevents later playback and stale failure messages", async () => {
  const f = fixture();
  await f.audio.unlock();
  const pending = f.audio.playCue("a");
  f.audio.stop();
  f.requests[0].task.reject(Error("late network failure"));
  assert.equal(await pending, false);
  assert.equal(f.audio.track, null);
  assert.equal(f.audio.lastMusicError, null);
});
test("restart stops the previous source and reuses decoded data from the intro", async () => {
  const f = fixture();
  await f.audio.unlock();
  const pending = f.audio.playCue("a");
  f.resolve();
  await pending;
  const old = f.audio.track;
  assert.equal(await f.audio.playCue("a"), true);
  assert.ok(old.stopped && old.disconnected);
  assert.notEqual(f.audio.track, old);
  assert.equal(f.requests.length, 1);
  assert.deepEqual(f.audio.track.started, [0, 0.05]);
});
test("pause freezes the shared clock and resume keeps the same source", async () => {
  const f = fixture();
  await f.audio.unlock();
  const pending = f.audio.playCue("a");
  f.resolve();
  await pending;
  const source = f.audio.track;
  await f.audio.pause();
  assert.equal(f.context.state, "suspended");
  await f.audio.resume();
  assert.equal(f.context.state, "running");
  assert.equal(f.audio.track, source);
  assert.equal(source.stopped, undefined);
});
test("a cue decoded while paused stays on the suspended clock", async () => {
  const f = fixture();
  await f.audio.unlock();
  const pending = f.audio.playCue("a");
  await f.audio.pause();
  f.resolve();
  await pending;
  assert.equal(f.context.state, "suspended");
  assert.ok(f.audio.track);
  await f.audio.resume();
  assert.equal(f.context.state, "running");
});
test("rapid pause and resume reconcile the latest request after an in-flight suspension", async () => {
  const f = fixture();
  await f.audio.unlock();
  const suspended = deferred();
  f.context.suspend = async () => {
    await suspended.promise;
    f.context.state = "suspended";
  };
  const pause = f.audio.pause();
  await Promise.resolve();
  await Promise.resolve();
  const resume = f.audio.resume();
  suspended.resolve();
  await Promise.all([pause, resume]);
  assert.equal(f.context.state, "running");
  assert.equal(f.audio.wantRunning, true);
  await Promise.all([f.audio.resume(), f.audio.pause()]);
  assert.equal(f.context.state, "suspended");
});
test("one-shot ending cues finish without looping or clearing a replacement track", async () => {
  const f = fixture();
  await f.audio.unlock();
  f.audio.verifiedCues.a = { ...cue, loop: false };
  const pending = f.audio.playCue("a");
  f.resolve();
  await pending;
  const old = f.audio.track,
    ended = old.onended;
  assert.equal(old.loop, false);
  const next = f.audio.playCue("b");
  f.resolve(1);
  await next;
  const current = f.audio.track;
  ended();
  assert.equal(f.audio.track, current);
  current.onended();
  assert.equal(f.audio.track, null);
});
test("network and cue validation failures report an error without starting audio", async () => {
  const f = fixture();
  await f.audio.unlock();
  let pending = f.audio.playCue("a");
  f.requests[0].task.resolve({ ok: false, status: 404 });
  assert.equal(await pending, false);
  assert.match(f.audio.lastMusicError, /404/);
  assert.equal(f.audio.track, null);
  f.audio.verifiedCues.a = { ...cue, loopEndFrame: 999999 };
  pending = f.audio.playCue("a");
  f.resolve(1);
  assert.equal(await pending, false);
  assert.match(f.audio.lastMusicError, /loop frames/);
  assert.equal(f.audio.track, null);
});

test("original module streaming schedules contiguous audio and terminates on stop", async () => {
  const { audio, context } = fixture();
  const workers = [];
  audio.createWorker = () => {
    const w = {
      messages: [],
      postMessage(m) {
        this.messages.push(m);
      },
      terminate() {
        this.terminated = true;
      },
    };
    workers.push(w);
    return w;
  };
  audio.verifiedCues.original = {
    verified: true,
    stream: true,
    module: "Practice",
    subsong: 1,
  };
  await audio.unlock();
  const ready = audio.playCue("original"),
    w = workers[0];
  assert.equal(w.messages.length, 3);
  const chunk = {
    pcm: new Int16Array([4096, -4096, 8192, -8192]).buffer,
    frames: 2,
    rate: 2,
  };
  w.onmessage({ data: chunk });
  assert.equal(await ready, true);
  w.onmessage({ data: chunk });
  const sources = [...audio.streamSources];
  assert.equal(sources.length, 2);
  assert.equal(sources[1].started[0], sources[0].started[0] + 1);
  await audio.pause();
  assert.equal(context.state, "suspended");
  await audio.resume();
  assert.equal(context.state, "running");
  audio.stop();
  assert.equal(w.terminated, true);
  assert.ok(sources.every((s) => s.stopped && s.disconnected));
  w.onmessage({ data: chunk });
  assert.equal(audio.streamSources.size, 0);
});

test("module startup cancellation and worker errors settle without overlapping music", async () => {
  const { audio } = fixture();
  let worker;
  audio.createWorker = () =>
    (worker = {
      postMessage() {},
      terminate() {
        this.terminated = true;
      },
    });
  audio.verifiedCues.original = { verified: true, stream: true };
  await audio.unlock();
  const first = audio.playCue("original");
  audio.stop();
  assert.equal(await first, false);
  const next = audio.playCue("original");
  worker.onmessage({ data: { error: "missing module" } });
  assert.equal(await next, false);
  assert.equal(audio.lastMusicError, "missing module");
  assert.equal(worker.terminated, true);
});

test("game events play on the effects bus; results stop music without truncating goal", async () => {
  const { audio, context, sources } = fixture();
  await audio.unlock();
  for (const type of [
    "fall",
    "respawn",
    "collect",
    "spring",
    "finish",
    "timeout",
  ])
    assert.equal(audio.event({ type, player: 0 }), true, type);
  assert.equal(audio.effectSources.size, 6);
  const effects = sources.slice(1);
  audio.finishRace();
  assert.equal(context.state, "running");
  assert.ok(effects.every((s) => !s.stopped));
  audio.volumes(0.5, 0);
  assert.equal(audio.bus.gain.value, 0);
  assert.equal(audio.musicBus.gain.value, 0.5);
  await audio.pause();
  assert.equal(audio.event({ type: "fall", player: 1 }), false);
  await audio.resume();
  assert.equal(audio.event({ type: "fall", player: 1 }), true);
  audio.stop();
  assert.equal(audio.effectSources.size, 0);
  assert.ok(effects.every((s) => s.stopped));
});
test("effects throttle repeated events, permit both players, and bound polyphony", async () => {
  const { audio, context } = fixture();
  await audio.unlock();
  assert.equal(audio.event({ type: "fall", player: 0 }), true);
  assert.equal(audio.event({ type: "fall", player: 0 }), false);
  assert.equal(audio.event({ type: "fall", player: 1 }), true);
  assert.equal(
    audio.event({ type: "checkpoint", player: 0 }, false),
    undefined,
  );
  assert.equal(audio.event({ type: "checkpoint", player: 0 }, true), true);
  for (let i = 0; i < 30; i++) {
    context.currentTime += 0.2;
    audio.event({ type: "collect", player: 0 });
  }
  assert.equal(audio.effectSources.size, 16);
});
test("obstacles are audible only near a racing player and while moving or active", async () => {
  const { audio, context } = fixture();
  await audio.unlock();
  const pose = (x) => ({
    position: { x, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
  });
  const sim = {
    tick: 1,
    players: [{ status: "racing", current: pose(100) }],
    world: { getRigidBody: () => ({ isEnabled: () => true }) },
    movers: [{ handle: 1, previous: pose(0), current: pose(0.02) }],
    enemies: [],
    course: { zones: [] },
  };
  audio.obstacles(sim);
  assert.equal(audio.effectSources.size, 0);
  sim.tick++;
  sim.players[0].current = pose(1);
  audio.obstacles(sim);
  assert.equal(audio.effectSources.size, 1);
  sim.tick++;
  context.currentTime = 1;
  sim.movers[0].previous = pose(0.02);
  audio.obstacles(sim);
  assert.equal(audio.effectSources.size, 1);
});

test("moving acid sound follows the current sensor instead of its starting position", async () => {
  const { audio } = fixture();
  await audio.unlock();
  const zone = { kind: "acid", x: 100, y: 0, z: 0 };
  let location = { x: 1, y: 0, z: 0 };
  const sim = {
    tick: 1,
    players: [
      { status: "racing", current: { position: { x: 0, y: 0, z: 0 } } },
    ],
    course: { zones: [zone] },
    enemies: [],
    acid: [{ zone, handle: 4 }],
    world: { getCollider: () => ({ translation: () => location }) },
  };
  const calls = [];
  audio.effect = (name, options) => calls.push({ name, ...options });
  audio.obstacles(sim);
  assert.ok(calls[0].gain > 0.5);
  location = { x: 100, y: 0, z: 0 };
  sim.tick++;
  audio.obstacles(sim);
  assert.equal(calls[1].gain, 0);
});

test("landing awards use the effects bus with separate player throttles", async () => {
  const { audio } = fixture();
  await audio.unlock();
  const calls = [];
  audio.effect = (name, options) => calls.push({ name, ...options });
  audio.event({ type: "landing-bonus", player: 0, score: 4500 });
  audio.event({ type: "landing-bonus", player: 1, score: 4500 });
  assert.deepEqual(calls, [
    { name: "collect", key: "landing-bonus:0" },
    { name: "collect", key: "landing-bonus:1" },
  ]);
});

test("steelie knockouts use the reward cue with separate player keys", async () => {
  const { audio } = fixture();
  await audio.unlock();
  const calls = [];
  audio.effect = (name, options) => calls.push({ name, ...options });
  audio.event({ type: "steelie-defeat", player: 0, score: 1000 });
  audio.event({ type: "steelie-defeat", player: 1, score: 1000 });
  assert.deepEqual(calls, [
    { name: "collect", key: "steelie-defeat:0" },
    { name: "collect", key: "steelie-defeat:1" },
  ]);
});
