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
