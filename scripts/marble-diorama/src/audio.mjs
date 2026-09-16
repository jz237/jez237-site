// No synthesized replacement music. Only explicitly verified local cues may play.
export class AudioEngine {
  constructor({
    createContext = () => new AudioContext(),
    fetchAudio = (...args) => fetch(...args),
  } = {}) {
    this.createContext = createContext;
    this.fetchAudio = fetchAudio;
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
    this.cueGeneration++;
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
