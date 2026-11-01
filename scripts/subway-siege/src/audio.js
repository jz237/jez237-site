// Ironline sound: every effect is placed where it happened (panned across the
// tunnel, quieter, duller and wetter up the line), runs through a synthetic
// tunnel reverb that changes with each sector, and sits on a mix that ducks
// the music under big blasts, muffles on hull hits and drops into slow motion
// with the rail pulse. Sub-bass under explosions is synthesised so blasts
// keep their weight on any clip.
const V4 = "../audio-ironline-v4/";
const V3 = "../audio-ironline-v3/";
const FILES = [
  "w_laser",
  "w_lance",
  "w_plasma",
  "w_tri",
  "w_heavy",
  "w_overheat",
  "w_nova",
  "w_saw",
  "e_shot",
  "e_charge",
  "boss_volley",
  "hit_1",
  "hit_2",
  "boom_s1",
  "boom_s2",
  "boom_m1",
  "boom_m2",
  "boom_l",
  "boom_boss",
  "debris",
  "shield_hit",
  "hull_hit",
  "player_death",
  "pulse_ready",
  "overdrive",
  "pick_weapon",
  "pick_shield",
  "pick_charge",
  "train_horn",
  "train_approach",
  "boss_phase",
  "wave_clear",
  "wave_alarm",
  "arc",
  "game_over",
  "transform",
  "drone_join",
  "ring_form",
  "amb_station",
  "amb_forge",
  "amb_water",
  "amb_ghost",
  "amb_surface",
];
const LEGACY = ["railgun", "rupture", "pulse", "train", "pickup", "boss"];
const WEAPON = {
  laser: ["w_laser", 0.16],
  lance: ["w_lance", 0.3],
  plasma: ["w_plasma", 0.15],
  tri: ["w_tri", 0.2],
  heavy: ["w_heavy", 0.3],
  overheat: ["w_overheat", 0.11],
  nova: ["w_nova", 0.21],
  saw: ["w_saw", 0.2],
};
const ROOMS = {
  station: { rt: 2.6, flutter: 0.068, early: 0.55, bright: 0.5, wet: 0.32 },
  forge: { rt: 2.1, flutter: 0.052, early: 0.6, bright: 0.7, wet: 0.3, ring: [410, 655, 1170] },
  water: { rt: 3.4, flutter: 0.082, early: 0.5, bright: 0.38, wet: 0.38 },
  ghost: { rt: 4.6, flutter: 0.094, early: 0.42, bright: 0.62, wet: 0.42 },
  surface: { rt: 1.25, flutter: 0, early: 0.25, bright: 0.6, wet: 0.2 },
};
const KINDS = ["station", "forge", "water", "ghost", "surface"];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Sound {
  constructor(settings) {
    this.settings = settings;
    this.buffers = {};
    this.ready = false;
    this.active = new Set();
    this.music = {};
    this.musicName = null;
    this.cooldowns = {};
    this.listener = { x: 0, z: 7 };
    this.sector = 0;
    this.irs = {};
    this.heartT = 0;
  }
  unlock() {
    if (!this.ctx) {
      try {
        this.build();
      } catch {
        return;
      }
    }
    this.ctx?.resume().catch(() => {});
    this.apply();
    if (this.musicName) this.setMusic(this.musicName);
  }
  build() {
    const ctx = (this.ctx = new (window.AudioContext ||
      window.webkitAudioContext)({ latencyHint: "interactive" }));
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -7;
    limiter.knee.value = 4;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.18;
    limiter.connect(ctx.destination);
    // Effects: voices -> dry/reverb -> muffle filter -> sfx gain -> glue -> limiter
    this.master = ctx.createGain();
    const glue = ctx.createDynamicsCompressor();
    glue.threshold.value = -18;
    glue.ratio.value = 3;
    glue.attack.value = 0.006;
    glue.release.value = 0.22;
    this.master.connect(glue).connect(limiter);
    this.muffle = ctx.createBiquadFilter();
    this.muffle.type = "lowpass";
    this.muffle.frequency.value = 20000;
    this.muffle.Q.value = 0.5;
    this.muffle.connect(this.master);
    this.dry = ctx.createGain();
    this.dry.connect(this.muffle);
    this.verbIn = ctx.createGain();
    this.verbs = [0, 1].map(() => {
      const conv = ctx.createConvolver(),
        g = ctx.createGain();
      g.gain.value = 0;
      this.verbIn.connect(conv).connect(g).connect(this.muffle);
      return { conv, g };
    });
    this.verbSlot = 0;
    // Synth layers (sub booms, tinnitus, heartbeat) skip the muffle.
    this.direct = ctx.createGain();
    this.direct.connect(this.master);
    this.amb = ctx.createGain();
    this.amb.gain.value = 0.55;
    this.amb.connect(this.master);
    // Music: element -> per-track gain -> filter -> duck -> music gain -> limiter
    this.musicGain = ctx.createGain();
    this.musicGain.connect(limiter);
    this.duck = ctx.createGain();
    this.duck.connect(this.musicGain);
    this.musicFilter = ctx.createBiquadFilter();
    this.musicFilter.type = "lowpass";
    this.musicFilter.frequency.value = 20000;
    this.musicFilter.connect(this.duck);
    this.makeEngine();
    this.noise = this.makeNoise();
    this.ready = true;
    this.setSector(this.sector, true);
    const load = (url, name) =>
      fetch(url)
        .then((r) => {
          if (!r.ok) throw Error("audio");
          return r.arrayBuffer();
        })
        .then((b) => ctx.decodeAudioData(b))
        .then((b) => {
          this.buffers[name] = b;
          if (name.startsWith("amb_")) this.startAmbience();
        })
        .catch(() => {});
    for (const name of FILES) load(`${V4}${name}.mp3`, name);
    for (const name of LEGACY) load(`${V3}${name}.mp3`, "v3_" + name);
  }
  apply() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.settings.sfx, t, 0.03);
    this.musicGain.gain.setTargetAtTime(this.settings.music, t, 0.03);
    for (const [name, m] of Object.entries(this.music))
      m.gain.gain.setTargetAtTime(
        name === this.musicName ? (name === "boss" ? 0.62 : 0.46) : 0,
        t,
        0.35,
      );
  }
  setMusic(name) {
    this.musicName = name;
    if (!this.ready) return;
    if (name && this.settings.music && !this.music[name]) {
      const a = new Audio(
        `../music/${name === "boss" ? "boss" : name === "menu" ? "title" : "game"}-track.mp3`,
      );
      a.loop = true;
      a.preload = "auto";
      const g = this.ctx.createGain();
      g.gain.value = 0;
      try {
        this.ctx.createMediaElementSource(a).connect(g);
      } catch {}
      g.connect(this.musicFilter);
      this.music[name] = { el: a, gain: g };
    }
    this.apply();
    for (const [k, m] of Object.entries(this.music)) {
      clearTimeout(m.stop);
      if (k === name && this.settings.music) m.el.play().catch(() => {});
      else m.stop = setTimeout(() => m.el.pause(), 1400);
    }
  }
  pause() {
    for (const m of Object.values(this.music)) m.el.pause();
    if (!this.ctx) return;
    this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    this.amb.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
  }
  stopEffects() {
    for (const s of this.active) {
      try {
        s.stop();
      } catch {}
    }
    this.active.clear();
  }
  get live() {
    return this.ready && this.settings.sfx > 0 && this.ctx.state === "running";
  }
  // Core voice: positioned, filtered, panned, sent to the room.
  voice(name, o = {}) {
    if (!this.live) return null;
    const b = this.buffers[name];
    if (!b) return null;
    const ctx = this.ctx,
      t = ctx.currentTime,
      gap = o.gap ?? 0.04;
    if (t - (this.cooldowns[name] ?? -9) < gap) return null;
    this.cooldowns[name] = t;
    if (this.active.size > 56) return null;
    const near = o.x === undefined,
      dx = near ? 0 : o.x - this.listener.x,
      dz = near ? 0 : (o.z ?? this.listener.z) - this.listener.z,
      d = Math.hypot(dx * 0.8, dz),
      src = ctx.createBufferSource(),
      g = ctx.createGain(),
      lp = ctx.createBiquadFilter(),
      pan = ctx.createStereoPanner(),
      send = ctx.createGain();
    src.buffer = b;
    src.playbackRate.value = (o.rate ?? 1) * (this.slow ? 0.82 : 1);
    g.gain.value = (o.gain ?? 0.5) / (1 + Math.max(0, d - 3) / 13);
    lp.type = "lowpass";
    lp.frequency.value = clamp(20000 * Math.exp(-Math.max(0, d - 4) / 17), 1600, 20000);
    pan.pan.value = clamp(o.pan ?? dx / 9, -0.85, 0.85);
    send.gain.value = (o.wet ?? 1) * (0.14 + Math.min(0.55, d / 38));
    src.connect(g).connect(lp).connect(pan);
    pan.connect(this.dry);
    pan.connect(send).connect(this.verbIn);
    this.active.add(src);
    src.onended = () => {
      this.active.delete(src);
      for (const n of [src, g, lp, pan, send]) n.disconnect();
    };
    src.start(t + Math.min(0.09, d / 343) + (o.delay ?? 0));
    return { src, g, pan };
  }
  pick(...names) {
    return names[Math.floor(Math.random() * names.length)];
  }
  // Legacy names still work (Classic-era call sites, QA harness).
  play(name, volume = 0.5, rate = 1, x) {
    const map = { railgun: "w_laser", rupture: "boom_m1", pickup: "pick_charge" };
    const n = this.buffers[map[name]] ? map[name] : "v3_" + name;
    this.voice(n, { gain: volume, rate, x, z: x === undefined ? undefined : this.listener.z });
  }
  fire(weapon, x, z) {
    const [name, gain] = WEAPON[weapon] || WEAPON.laser;
    this.voice(name, {
      gain,
      rate: 1 + (Math.random() - 0.5) * 0.08,
      x,
      z,
      gap: weapon === "overheat" ? 0.055 : 0.05,
      wet: 0.6,
    });
  }
  enemyFire(x, z, heavy = false) {
    this.voice("e_shot", { gain: heavy ? 0.34 : 0.2, rate: heavy ? 0.8 : 0.92 + Math.random() * 0.16, x, z, gap: 0.06 });
  }
  charge(x, z) {
    this.voice("e_charge", { gain: 0.32, x, z, gap: 0.3 });
  }
  bossVolley(x, z) {
    this.voice("boss_volley", { gain: 0.5, x, z, gap: 0.3 });
    this.sub(0.45, 0.6);
  }
  hit(x, z) {
    this.voice(this.pick("hit_1", "hit_2"), { gain: 0.16, rate: 0.9 + Math.random() * 0.25, x, z, gap: 0.035, wet: 0.7 });
  }
  explode(size, x, z) {
    const r = 0.92 + Math.random() * 0.14;
    if (size >= 4) {
      this.voice("boom_boss", { gain: 1, x, z, gap: 0.5, wet: 1.3 });
      this.voice("debris", { gain: 0.5, x, z, delay: 0.5, gap: 0.2 });
      this.sub(1.2, 2.4);
      this.duckMusic(0.25, 2.2);
    } else if (size >= 2.4) {
      this.voice("boom_l", { gain: 0.85, rate: r, x, z, gap: 0.1, wet: 1.2 });
      this.voice("debris", { gain: 0.42, x, z, delay: 0.25, gap: 0.2 });
      this.sub(0.85, 1.5);
      this.duckMusic(0.4, 1.2);
    } else if (size >= 1.2) {
      this.voice(this.pick("boom_m1", "boom_m2"), { gain: 0.62, rate: r, x, z, gap: 0.05 });
      this.sub(0.42 * size, 0.7);
      this.duckMusic(0.65, 0.6);
    } else {
      this.voice(this.pick("boom_s1", "boom_s2"), { gain: 0.44, rate: r * (1.06 - size * 0.06), x, z, gap: 0.04 });
      if (Math.random() < 0.5) this.sub(0.18, 0.35);
    }
  }
  playerHit(shielded, x, z) {
    if (shielded) {
      this.voice("shield_hit", { gain: 0.6, x, z, gap: 0.1 });
      this.dip(2400, 0.35);
    } else {
      this.voice("hull_hit", { gain: 0.8, x, z, gap: 0.1 });
      this.sub(0.5, 0.5);
      this.dip(520, 1.1);
      this.ring();
    }
  }
  playerDeath(x, z) {
    this.voice("player_death", { gain: 0.95, x, z, gap: 1 });
    this.sub(1, 1.6);
    this.voice("game_over", { gain: 0.55, delay: 1.3, gap: 1 });
    this.dip(700, 2.2);
  }
  pulse() {
    this.voice("v3_pulse", { gain: 0.85, gap: 0.3, wet: 1.4 });
    this.sub(0.8, 1.2);
    this.duckMusic(0.35, 1.2);
  }
  pulseReady() {
    this.voice("pulse_ready", { gain: 0.32, gap: 1 });
  }
  overdrive() {
    this.voice("overdrive", { gain: 0.55, gap: 1 });
  }
  pickup(type, x, z) {
    this.voice(type === "shield" ? "pick_shield" : type === "charge" ? "pick_charge" : "pick_weapon", { gain: 0.5, x, z, gap: 0.08, wet: 0.5 });
  }
  trainWarn(x) {
    this.voice("train_horn", { gain: 0.42, x, z: -22, gap: 1, wet: 1.4 });
    this.voice("train_approach", { gain: 0.6, x, z: -18, gap: 1, delay: 0.2, wet: 1.2 });
  }
  trainPass(x) {
    const v = this.voice("v3_train", { gain: 0.7, x, z: this.listener.z - 2, gap: 1, wet: 1.1 });
    if (!v) return;
    const t = this.ctx.currentTime;
    // Doppler: pitch falls as the express goes by.
    v.src.playbackRate.setValueAtTime(1.07, t);
    v.src.playbackRate.linearRampToValueAtTime(1.07, t + 0.9);
    v.src.playbackRate.linearRampToValueAtTime(0.9, t + 1.9);
    this.sub(0.35, 2);
  }
  bossArrive() {
    this.voice("v3_boss", { gain: 0.8, gap: 1, wet: 1.3 });
    this.voice("wave_alarm", { gain: 0.42, delay: 0.3, gap: 1, wet: 1.4 });
  }
  bossPhase(x, z) {
    this.voice("boss_phase", { gain: 0.7, x, z, gap: 0.5, wet: 1.2 });
    this.sub(0.6, 0.9);
  }
  transform(x, z) {
    this.voice("transform", { gain: 0.62, x, z, gap: 0.2, wet: 0.7 });
    this.sub(0.3, 0.45);
  }
  kitOff(x, z) {
    this.voice("transform", { gain: 0.3, rate: 1.35, x, z, gap: 0.2, wet: 0.6 });
  }
  droneJoin(x, z) {
    this.voice("drone_join", { gain: 0.55, x, z, gap: 0.2 });
  }
  ringForm() {
    this.voice("ring_form", { gain: 0.7, gap: 1, wet: 1.1 });
    this.sub(0.5, 1);
  }
  waveClear() {
    this.voice("wave_clear", { gain: 0.34, gap: 1, wet: 0.8 });
  }
  arc(x, z) {
    this.voice("arc", { gain: 0.26, rate: 0.85 + Math.random() * 0.3, x, z, gap: 0.12 });
  }
  // Synthesised sub-bass thump with a short click, for weight.
  sub(level, length) {
    if (!this.live) return;
    const ctx = this.ctx,
      t = ctx.currentTime,
      o = ctx.createOscillator(),
      g = ctx.createGain(),
      n = ctx.createBufferSource(),
      nf = ctx.createBiquadFilter(),
      ng = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(78, t);
    o.frequency.exponentialRampToValueAtTime(30, t + length * 0.8);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(clamp(level, 0.02, 1.3) * 0.55, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    n.buffer = this.noise;
    nf.type = "lowpass";
    nf.frequency.value = 260;
    ng.gain.setValueAtTime(clamp(level, 0, 1.3) * 0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + length * 0.5);
    o.connect(g).connect(this.direct);
    n.connect(nf).connect(ng).connect(this.direct);
    o.start(t);
    n.start(t, Math.random());
    o.stop(t + length + 0.05);
    n.stop(t + length * 0.5 + 0.05);
    o.onended = () => [o, g, n, nf, ng].forEach((x) => x.disconnect());
  }
  // Brief tinnitus after a hull breach.
  ring() {
    if (!this.live) return;
    const ctx = this.ctx,
      t = ctx.currentTime,
      o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.value = 3650;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.018, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    o.connect(g).connect(this.direct);
    o.start(t);
    o.stop(t + 1.6);
    o.onended = () => [o, g].forEach((x) => x.disconnect());
  }
  // Muffle everything (ears ringing), recovering over `time` seconds.
  dip(freq, time) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const f of [this.muffle.frequency, this.musicFilter.frequency]) {
      f.cancelScheduledValues(t);
      f.setValueAtTime(f.value, t);
      f.exponentialRampToValueAtTime(freq, t + 0.03);
      f.setTargetAtTime(20000, t + 0.08, time / 3);
    }
  }
  duckMusic(level, time) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime,
      d = this.duck.gain;
    d.cancelScheduledValues(t);
    d.setValueAtTime(Math.min(d.value, 1), t);
    d.linearRampToValueAtTime(level, t + 0.04);
    d.setTargetAtTime(1, t + 0.15, time / 3);
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
    g.connect(this.direct);
    o.start();
    o.stop(t + duration);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }
  makeNoise() {
    const sr = this.ctx.sampleRate,
      b = this.ctx.createBuffer(1, sr * 2, sr),
      d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  // Drone engine: two detuned saws through a speed-tracking lowpass.
  makeEngine() {
    const ctx = this.ctx;
    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0;
    this.enginePan = ctx.createStereoPanner();
    this.engineFilter = ctx.createBiquadFilter();
    this.engineFilter.type = "lowpass";
    this.engineFilter.frequency.value = 260;
    this.engineFilter.Q.value = 3;
    this.engineOsc = [55, 55.6, 110.3].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "triangle" : "sawtooth";
      o.frequency.value = f;
      o.connect(this.engineFilter);
      o.start();
      return o;
    });
    this.engineFilter.connect(this.engineGain).connect(this.enginePan).connect(this.dry);
  }
  // Synthetic tunnel impulse response: flutter echoes between parallel walls,
  // a dense tail that darkens as it decays, metal resonances in the foundry.
  makeIR(kind) {
    if (this.irs[kind]) return this.irs[kind];
    const R = ROOMS[kind],
      ctx = this.ctx,
      sr = ctx.sampleRate,
      len = Math.floor(sr * R.rt * 1.05),
      ir = ctx.createBuffer(2, len, sr);
    let seed = 11 + kind.length * 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr,
          n = rnd() * 2 - 1;
        lp += (n - lp) * (R.bright * Math.exp(-t * 2.2) + 0.035);
        d[i] = lp * 0.5 * Math.exp((-6.9 * t) / R.rt) * Math.min(1, t / 0.018);
        if (R.ring)
          for (const f of R.ring)
            d[i] += Math.sin(2 * Math.PI * f * t + ch) * 0.012 * Math.exp(-t * 2.6);
      }
      if (R.flutter)
        for (let k = 1; k < 16; k++) {
          const at = Math.floor((k * R.flutter + (rnd() - 0.5) * 0.004 + (ch ? 0.007 : 0)) * sr),
            g = R.early * Math.exp(-k * 0.22) * (k % 2 ? 1 : -0.8);
          for (let j = 0; j < 90 && at + j < len; j++)
            d[at + j] += g * (rnd() * 2 - 1) * Math.exp(-j / 22);
        }
    }
    return (this.irs[kind] = ir);
  }
  setSector(index, now = false) {
    this.sector = index;
    if (!this.ready) return;
    const kind = KINDS[index] || "station",
      t = this.ctx.currentTime,
      fade = now ? 0.02 : 1.2;
    const from = this.verbs[this.verbSlot];
    this.verbSlot ^= 1;
    const to = this.verbs[this.verbSlot];
    to.conv.buffer = this.makeIR(kind);
    from.g.gain.setTargetAtTime(0, t, fade / 3);
    to.g.gain.setTargetAtTime(ROOMS[kind].wet * 2.2, t, fade / 3);
    this.startAmbience();
  }
  startAmbience() {
    if (!this.ready) return;
    const name = "amb_" + (KINDS[this.sector] || "station"),
      b = this.buffers[name];
    if (!b || this.ambName === name) return;
    const ctx = this.ctx,
      t = ctx.currentTime;
    if (this.ambSrc) {
      const { src, g } = this.ambSrc;
      g.gain.setTargetAtTime(0, t, 0.8);
      src.stop(t + 4);
    }
    const src = ctx.createBufferSource(),
      g = ctx.createGain();
    src.buffer = b;
    src.loop = true;
    g.gain.value = 0;
    g.gain.setTargetAtTime(1, t, 0.8);
    src.connect(g).connect(this.amb);
    src.start(t, Math.random() * b.duration);
    this.ambName = name;
    this.ambSrc = { src, g };
  }
  // Per-frame: listener follows the drone, engine tracks speed, slow motion,
  // low-hull heartbeat, pulse-ready chime.
  update(dt, game) {
    if (!this.ready || this.ctx.state !== "running") return;
    const ctx = this.ctx,
      t = ctx.currentTime,
      p = game.player,
      play = game.state === "play";
    this.listener.x = p.x;
    this.listener.z = p.z;
    const speed = Math.min(1, Math.abs(game.velocityX || 0) / 12);
    this.engineGain.gain.setTargetAtTime(play && game.playerMesh?.visible !== false ? 0.035 + speed * 0.03 : game.state === "menu" ? 0.012 : 0, t, 0.08);
    this.engineFilter.frequency.setTargetAtTime(220 + speed * 700 + (game.overdrive > 0 ? 500 : 0), t, 0.06);
    this.engineOsc.forEach((o, i) => o.frequency.setTargetAtTime([55, 55.6, 110.3][i] * (1 + speed * 0.18 + (game.overdrive > 0 ? 0.12 : 0)), t, 0.1));
    this.enginePan.pan.setTargetAtTime(clamp(p.x / 12, -0.6, 0.6), t, 0.05);
    const slow = play && game.slow > 0;
    if (slow !== this.slow) {
      this.slow = slow;
      for (const f of [this.muffle.frequency, this.musicFilter.frequency]) {
        f.cancelScheduledValues(t);
        f.setTargetAtTime(slow ? 900 : 20000, t, slow ? 0.05 : 0.25);
      }
    }
    this.amb.gain.setTargetAtTime(game.state === "paused" ? 0 : 0.55, t, 0.3);
    if (play && p.lives === 1 && !game.demo) {
      this.heartT -= dt;
      if (this.heartT <= 0) {
        this.heartT = 0.95;
        for (const [at, f] of [[0, 52], [0.17, 46]]) {
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t + at);
          g.gain.exponentialRampToValueAtTime(0.22, t + at + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.16);
          o.connect(g).connect(this.direct);
          o.start(t + at);
          o.stop(t + at + 0.2);
          o.onended = () => [o, g].forEach((x) => x.disconnect());
        }
      }
    }
    const ready = play && p.charge >= 100;
    if (ready && !this.wasReady) this.pulseReady();
    this.wasReady = ready;
  }
}
