export class Sound {
  constructor(settings) {
    this.settings = settings;
    this.buffers = {};
    this.ready = false;
    this.current = null;
    this.lastShot = 0;
    this.active = new Set();
    this.music = {};
    this.musicName = null;
    this.cooldowns = {};
  }
  unlock() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.ratio.value = 6;
        this.master.connect(comp);
        comp.connect(this.ctx.destination);
        this.ready = true;
        for (const name of [
          "railgun",
          "rupture",
          "pulse",
          "train",
          "pickup",
          "boss",
        ])
          fetch(`../audio-ironline-v3/${name}.mp3`)
            .then((r) => {
              if (!r.ok) throw Error("audio");
              return r.arrayBuffer();
            })
            .then((b) => this.ctx.decodeAudioData(b))
            .then((b) => (this.buffers[name] = b))
            .catch(() => {});
      } catch {
        return;
      }
    }
    this.ctx?.resume().catch(() => {});
    this.apply();
    if (this.musicName) this.setMusic(this.musicName);
  }
  apply() {
    if (this.master) this.master.gain.value = this.settings.sfx;
    for (const [name, m] of Object.entries(this.music))
      m.volume =
        name === this.musicName
          ? this.settings.music * (name === "boss" ? 0.32 : 0.22)
          : 0;
  }
  setMusic(name) {
    this.musicName = name;
    if (!this.ready) return;
    for (const [k, m] of Object.entries(this.music)) if (k !== name) m.pause();
    if (!name || !this.settings.music) return;
    if (!this.music[name]) {
      const a = new Audio(
        `../music/${name === "boss" ? "boss" : name === "menu" ? "title" : "game"}-track.mp3`,
      );
      a.loop = true;
      a.preload = "none";
      this.music[name] = a;
    }
    this.apply();
    this.music[name].play().catch(() => {});
  }
  pause() {
    Object.values(this.music).forEach((m) => m.pause());
  }
  stopEffects() {
    for (const s of this.active) {
      try {
        s.stop();
      } catch {}
    }
    this.active.clear();
  }
  play(name, volume = 0.5, rate = 1, x = 0) {
    if (!this.ready || !this.settings.sfx) return;
    const t = this.ctx.currentTime;
    const gap = name === "railgun" ? 0.075 : name === "rupture" ? 0.07 : 0.08;
    if (t - (this.cooldowns[name] ?? -99) < gap) return;
    this.cooldowns[name] = t;
    const b = this.buffers[name];
    if (!b) {
      this.tone(
        name === "pickup" ? 780 : name === "railgun" ? 280 : 80,
        0.12,
        volume * 0.2,
      );
      return;
    }
    if (this.active.size > 22) return;
    const src = this.ctx.createBufferSource(),
      g = this.ctx.createGain(),
      pan = this.ctx.createStereoPanner();
    src.buffer = b;
    src.playbackRate.value = rate;
    g.gain.value = volume;
    pan.pan.value = Math.max(-0.75, Math.min(0.75, x / 10));
    src.connect(g);
    g.connect(pan);
    pan.connect(this.master);
    this.active.add(src);
    src.onended = () => {
      this.active.delete(src);
      src.disconnect();
      g.disconnect();
      pan.disconnect();
    };
    src.start();
  }
  tone(freq = 500, duration = 0.08, volume = 0.07) {
    if (!this.ready || !this.settings.sfx) return;
    const t = this.ctx.currentTime,
      o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(
      Math.max(30, freq * 0.5),
      t + duration,
    );
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(t + duration);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }
}
