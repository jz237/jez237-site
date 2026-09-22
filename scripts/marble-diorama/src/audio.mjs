import { vacuumAt } from "./vacuum.mjs";
import { presenceAt } from "./mechanism-time.mjs";
import { effectSamples } from "./effects.mjs";
// No synthesized replacement music. Only explicitly verified local cues may play.
export class AudioEngine {
  constructor({
    createContext = () => new AudioContext(),
    fetchAudio = (...args) => fetch(...args),
    createWorker = () =>
      new Worker(
        new URL("assets/music/music-worker-csp2.js", document.baseURI),
      ),
  } = {}) {
    this.createContext = createContext;
    this.fetchAudio = fetchAudio;
    this.createWorker = createWorker;
    this.streamSources = new Set();
    this.context = null;
    this.musicVolume = 0.5;
    this.effectsVolume = 0.5;
    this.track = null;
    this.verifiedCues = {};
    this.lastImpact = 0;
    this.cueGeneration = 0;
    this.bufferCache = new Map();
    this.contextChange = Promise.resolve();
    this.wantRunning = false;
    this.lastMusicError = null;
    this.effectSources = new Set();
    this.effectBuffers = new Map();
    this.effectTimes = new Map();
    this.obstacleStates = new Map();
  }
  ensureContext() {
    if (!this.context) {
      this.context = this.createContext();
      this.musicBus = this.context.createGain();
      this.musicBus.connect(this.context.destination);
      this.musicBus.gain.value = this.musicVolume;
      this.bus = this.context.createGain();
      this.bus.connect(this.context.destination);
      this.bus.gain.value = this.effectsVolume;
      const buffer = this.context.createBuffer(
          1,
          this.context.sampleRate * 2,
          this.context.sampleRate,
        ),
        data = buffer.getChannelData(0);
      let seed = 237;
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        data[i] = seed / 2147483648 - 1;
      }
      this.rolling = this.context.createBufferSource();
      this.rolling.buffer = buffer;
      this.rolling.loop = true;
      this.rollingFilter = this.context.createBiquadFilter();
      this.rollingFilter.type = "lowpass";
      this.rollingFilter.frequency.value = 180;
      this.rollingGain = this.context.createGain();
      this.rollingGain.gain.value = 0;
      this.rolling
        .connect(this.rollingFilter)
        .connect(this.rollingGain)
        .connect(this.bus);
      this.rolling.start();
    }
    return this.context;
  }
  async unlock() {
    this.ensureContext();
    return this.setRunning(true);
  }
  setRunning(value) {
    this.wantRunning = value;
    // Reconcile the newest request after any pending browser state transition.
    this.contextChange = this.contextChange
      .catch(() => {})
      .then(async () => {
        if (!this.context || this.context.state === "closed") return;
        if (this.wantRunning && this.context.state !== "running")
          await this.context.resume();
        else if (!this.wantRunning && this.context.state === "running")
          await this.context.suspend();
      });
    return this.contextChange;
  }
  volumes(music, effects) {
    this.musicVolume = music;
    this.effectsVolume = effects;
    if (this.bus) this.bus.gain.value = effects;
    if (this.musicBus) this.musicBus.gain.value = music;
  }
  async playCue(id) {
    this.stop();
    const cue = this.verifiedCues[id];
    this.lastMusicError = null;
    if (!cue?.verified || !this.context) return false;
    if (cue.stream) return this.playStream(cue);
    const generation = this.cueGeneration;
    const loading = new AbortController();
    this.musicLoad = loading;
    try {
      let buffer = this.bufferCache.get(cue.path);
      if (!buffer) {
        const response = await this.fetchAudio(cue.path, {
          signal: loading.signal,
        });
        if (!response.ok)
          throw Error(`Music request failed (${response.status}).`);
        buffer = await this.context.decodeAudioData(
          await response.arrayBuffer(),
        );
      }
      // Abort is not sufficient once decoding has begun. A stale completion
      // must never replace the current cue, or resurrect a stopped one.
      if (generation !== this.cueGeneration) return false;
      const { start, loopStart, loopEnd } = cueTimes(cue, buffer.duration);
      this.bufferCache.delete(cue.path);
      this.bufferCache.set(cue.path, buffer);
      let bytes = [...this.bufferCache.values()].reduce(
        (n, b) => n + b.length * b.numberOfChannels * 4,
        0,
      );
      for (const [path, b] of this.bufferCache) {
        if (bytes <= 64 * 1024 * 1024) break;
        this.bufferCache.delete(path);
        bytes -= b.length * b.numberOfChannels * 4;
      }
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = cue.loop !== false;
      if (source.loop) {
        source.loopStart = loopStart;
        source.loopEnd = loopEnd;
      }
      source.connect(this.musicBus);
      source.onended = () => {
        source.disconnect();
        if (this.track === source) this.track = null;
      };
      source.start(0, start);
      this.track = source;
      return true;
    } catch (error) {
      if (generation === this.cueGeneration && error.name !== "AbortError")
        this.lastMusicError = error.message;
      return false;
    } finally {
      if (this.musicLoad === loading) this.musicLoad = null;
    }
  }
  playStream(cue) {
    const generation = this.cueGeneration;
    return new Promise((resolve) => {
      this.streamReady = resolve;
      let scheduled = 0;
      const fail = (message) => {
        if (generation !== this.cueGeneration) return;
        this.stop();
        this.lastMusicError = message;
        this.onMusicError?.(message);
        resolve(false);
      };
      let worker;
      try {
        worker = this.createWorker();
      } catch (error) {
        fail(error.message);
        return;
      }
      this.musicWorker = worker;
      worker.onerror = (event) =>
        fail(event.message || "The Amiga music player could not start.");
      worker.onmessage = ({ data }) => {
        if (generation !== this.cueGeneration) return;
        if (data.error) {
          fail(data.error);
          return;
        }
        const pcm = new Int16Array(data.pcm);
        const buffer = this.context.createBuffer(2, data.frames, data.rate);
        for (let channel = 0; channel < 2; channel++) {
          const samples = buffer.getChannelData(channel);
          for (let i = 0; i < data.frames; i++)
            samples[i] = (pcm[i * 2 + channel] / 32768) * (cue.gain ?? 1);
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.musicBus);
        this.streamSources.add(source);
        source.onended = () => {
          source.disconnect();
          this.streamSources.delete(source);
          if (generation === this.cueGeneration) worker.postMessage({});
        };
        const when = Math.max(scheduled, this.context.currentTime + 0.05);
        source.start(when);
        scheduled = when + buffer.duration;
        this.streamReady = null;
        resolve(true);
      };
      // Three seconds of queued audio absorb worker jitter; pausing freezes the
      // audio clock and bounds the queue instead of advancing the song silently.
      worker.postMessage({ cue });
      worker.postMessage({});
      worker.postMessage({});
    });
  }
  effect(kind, { gain = 1, key = kind, cooldown = 0.08 } = {}) {
    if (!this.context || this.context.state !== "running" || gain <= 0)
      return false;
    const now = this.context.currentTime;
    if (now - (this.effectTimes.get(key) ?? -Infinity) < cooldown) return false;
    let buffer = this.effectBuffers.get(kind);
    if (!buffer) {
      const samples = effectSamples(kind, this.context.sampleRate);
      if (!samples) return false;
      buffer = this.context.createBuffer(
        1,
        samples.length,
        this.context.sampleRate,
      );
      buffer.getChannelData(0).set(samples);
      this.effectBuffers.set(kind, buffer);
    }
    this.effectTimes.set(key, now);
    if (this.effectSources.size >= 16)
      this.effectSources.values().next().value.cancel();
    const source = this.context.createBufferSource(),
      volume = this.context.createGain();
    source.buffer = buffer;
    volume.gain.value = Math.min(1, gain);
    source.connect(volume).connect(this.bus);
    const voice = {
      cancel: () => {
        source.onended = null;
        source.stop();
        cleanup();
      },
    };
    const cleanup = () => {
      source.disconnect();
      volume.disconnect();
      this.effectSources.delete(voice);
    };
    source.onended = cleanup;
    this.effectSources.add(voice);
    source.start();
    return true;
  }
  event(event, assisted = false) {
    if (event.type === "impact") return this.impact(event.force);
    if (event.type === "fall" && event.cause === "acid")
      return this.effect("acid", { key: `acid-capture:${event.player}` });
    if (event.type === "fall" && event.cause === "vacuum") {
      this.effect("vacuum", { key: `vacuum-capture:${event.player}` });
      return this.effect("fall", { key: `fall:${event.player}` });
    }
    if (
      ["landing-bonus", "steelie-defeat", "traversal-bonus"].includes(
        event.type,
      )
    )
      return this.effect("collect", { key: `${event.type}:${event.player}` });
    if (event.type === "checkpoint" && !assisted) return;
    return this.effect(event.type, { key: `${event.type}:${event.player}` });
  }
  obstacles(sim) {
    // Sample actual simulated motion, once per simulation tick. Distance to
    // either racing player controls audibility in local two-player mode.
    if (this.obstacleTick === sim.tick) return;
    this.obstacleTick = sim.tick;
    const players = sim.players
      .filter((p) => p.status === "racing")
      .map((p) => p.current.position);
    const proximity = (pos) =>
      Math.max(
        0,
        ...players.map(
          (p) => 1 - Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z) / 14,
        ),
      );
    const activeTransfers = new Set(
      sim.players
        .filter((p) => p.status === "racing" && p.poweredTransfer)
        .map((p) => p.poweredTransfer),
    );
    for (const id of activeTransfers)
      this.effect("vacuum", {
        gain: 0.65,
        key: `transfer:${id}`,
        cooldown: 0.3,
      });
    for (const m of sim.movers ?? []) {
      const body = sim.world.getRigidBody(m.handle);
      if (!body.isEnabled()) continue;
      const a = m.previous,
        b = m.current;
      const movement = Math.hypot(
        b.position.x - a.position.x,
        b.position.y - a.position.y,
        b.position.z - a.position.z,
        b.rotation.x - a.rotation.x,
        b.rotation.y - a.rotation.y,
        b.rotation.z - a.rotation.z,
      );
      if (movement > 0.0001)
        this.effect("machine", {
          gain: proximity(b.position) * 0.55,
          key: "machinery",
          cooldown: 0.42,
        });
    }
    for (const e of sim.enemies ?? []) {
      const active =
        !e.hidden && !e.collected && !e.defeated && e.fallenAt === null;
      const previous = this.obstacleStates.get(e.handle);
      this.obstacleStates.set(e.handle, active);
      if (!active) continue;
      const gain = proximity(e.current.position);
      if (e.def.kind === "bird" && !previous)
        this.effect("bird", { gain, key: `bird:${e.handle}`, cooldown: 0.5 });
      if (
        e.def.kind === "muncher" &&
        Math.hypot(
          e.current.position.x - e.previous.position.x,
          e.current.position.z - e.previous.position.z,
        ) > 0.0001
      )
        this.effect("muncher", {
          gain: gain * 0.7,
          key: "munchers",
          cooldown: 0.65,
        });
    }
    for (const z of sim.course.zones ?? []) {
      const vacuum =
        z.kind === "vacuum"
          ? vacuumAt(
              z,
              (sim.tick / 120) * (sim.preset?.machineSpeed ?? 1),
              sim.course.parts,
              sim.nativeVacuumPoses,
            )
          : null;
      if (vacuum && !vacuum.active) continue;
      if (
        !["vacuum", "magnet", "acid"].includes(z.kind) ||
        !presenceAt(z, (sim.tick / 120) * (sim.preset?.machineSpeed ?? 1))
          .visible
      )
        continue;
      this.effect(z.kind, {
        gain:
          proximity(
            z.kind === "acid"
              ? sim.world
                  .getCollider(sim.acid.find((a) => a.zone === z).handle)
                  .translation()
              : (vacuum?.position ?? z),
          ) *
          0.65 *
          (vacuum?.strength ?? 1),
        key: z.kind,
        cooldown: z.kind === "acid" ? 0.75 : 0.3,
      });
    }
  }
  finishRace() {
    // Keep the audio clock alive for goal/timeout effects on the results screen.
    this.stopMusic();
    if (this.rollingGain) this.rollingGain.gain.value = 0;
  }
  impact(force) {
    if (
      !this.context ||
      this.context.state !== "running" ||
      force < 15 ||
      this.context.currentTime - this.lastImpact < 0.045
    )
      return;
    this.lastImpact = this.context.currentTime;
    const o = this.context.createOscillator(),
      g = this.context.createGain(),
      now = this.context.currentTime;
    const amplitude = Math.min(0.16, force / 1200);
    o.type = "sine";
    o.frequency.setValueAtTime(450 + Math.min(force, 200), now);
    o.frequency.exponentialRampToValueAtTime(95, now + 0.12);
    g.gain.setValueAtTime(amplitude, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g).connect(this.bus);
    o.start();
    o.stop(now + 0.2);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }
  motion(sim, enabled) {
    if (!this.context) return;
    let speed = 0,
      slip = 0;
    if (enabled)
      for (const p of sim.players)
        if (p.status === "racing" && p.grounded) {
          const b = sim.body(p),
            v = b.linvel(),
            w = b.angvel(),
            s = Math.hypot(v.x, v.z);
          speed = Math.max(speed, s);
          slip = Math.max(slip, Math.abs(s - Math.hypot(w.x, w.z) * 0.55));
        }
    if (enabled) this.obstacles(sim);
    const now = this.context.currentTime;
    this.rollingGain.gain.setTargetAtTime(
      Math.min(0.07, speed * 0.004 + slip * 0.006),
      now,
      0.04,
    );
    this.rollingFilter.frequency.setTargetAtTime(
      110 + speed * 35 + slip * 50,
      now,
      0.04,
    );
  }
  pause() {
    // Suspending the shared audio clock retains the exact music and effect
    // positions, including when a cue finishes loading while the game is paused.
    return this.setRunning(false);
  }
  async resume() {
    await this.unlock();
  }
  stop() {
    this.stopMusic();
    for (const voice of this.effectSources) voice.cancel();
    this.effectTimes.clear();
    this.obstacleStates.clear();
    this.obstacleTick = null;
  }
  stopMusic() {
    this.cueGeneration++;
    this.streamReady?.(false);
    this.streamReady = null;
    this.musicWorker?.terminate();
    this.musicWorker = null;
    for (const source of this.streamSources) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }
    this.streamSources.clear();
    this.musicLoad?.abort();
    this.musicLoad = null;
    if (this.rollingGain) this.rollingGain.gain.value = 0;
    if (this.track) {
      this.track.onended = null;
      this.track.stop();
      this.track.disconnect();
      this.track = null;
    }
  }
}

// Cue boundaries are integer frames in the provenance recording's sample rate.
// Convert to seconds for native Web Audio looping, including resampling devices.
export function cueTimes(cue, duration) {
  const rate = cue.sampleRate;
  const frame = (n) => Number.isSafeInteger(n) && n >= 0;
  const startFrame = cue.startFrame ?? 0;
  if (
    !Number.isFinite(rate) ||
    rate <= 0 ||
    !frame(startFrame) ||
    startFrame / rate >= duration
  )
    throw Error("Invalid music start frame or sample rate.");
  if (cue.loop === false) return { start: startFrame / rate };
  if (
    !frame(cue.loopStartFrame) ||
    !frame(cue.loopEndFrame) ||
    startFrame > cue.loopStartFrame ||
    cue.loopStartFrame >= cue.loopEndFrame ||
    cue.loopEndFrame / rate > duration + 1 / rate
  )
    throw Error("Invalid music loop frames.");
  return {
    start: startFrame / rate,
    loopStart: cue.loopStartFrame / rate,
    loopEnd: Math.min(duration, cue.loopEndFrame / rate),
  };
}
