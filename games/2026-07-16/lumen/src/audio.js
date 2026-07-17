// Generative WebAudio: a deep-sea ambient bed + event-aware synthesized SFX.
// Zero assets. Every event callout is synthesized with random variation so
// no two fires sound identical; per-event cooldowns + a voice cap keep a
// full gauntlet from becoming a firehose.

const SETTINGS_KEY = 'lumen_settings_v1';

function loadSettings() {
  try { return { master: 0.8, music: 0.55, sfx: 0.75, voice: 0.85, muted: false, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; }
  catch { return { master: 0.8, music: 0.55, sfx: 0.75, voice: 0.85, muted: false }; }
}

// The grove speaks: HTMLAudio pools, one line at a time, priority-interrupt,
// variant rotation with no immediate repeats. Files in assets/vo/.
const VO = {
  wave:     { files: ['wave_v1', 'wave_v2'], pri: 1 },
  wave5:    { files: ['wave5_v1', 'wave5_v2'], pri: 2 },
  brood:    { files: ['brood_v1', 'brood_v2'], pri: 3 },
  unlit:    { files: ['unlit_v1', 'unlit_v2'], pri: 3 },
  phase:    { files: ['phase_v1', 'phase_v2'], pri: 3 },
  shatter:  { files: ['shatter'], pri: 2 },
  overload: { files: ['overload'], pri: 2 },
  freezelock: { files: ['freezelock'], pri: 2 },
  meltdown: { files: ['meltdown'], pri: 2 },
  hearthit: { files: ['hearthit_v1', 'hearthit_v2'], pri: 2 },
  victory:  { files: ['victory_v1', 'victory_v2'], pri: 4 },
  defeat:   { files: ['defeat_v1', 'defeat_v2'], pri: 4 },
  tidecaller: { files: ['tidecaller_v1', 'tidecaller_v2'], pri: 3 },
};

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.settings = loadSettings();
    this.voices = 0;
    this.cool = {};       // per-event cooldown clocks
    this.mood = 0;
    this.voClips = {};    // lazy HTMLAudio cache
    this.voLast = {};     // last variant per line, for no-repeat
    this.voPlaying = null; this.voPri = 0; this.voLastAt = 0;
    this._ambientTimer = null;
  }

  // must be called from a user gesture
  start() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.musicBus = this.ctx.createGain();
    this.sfxBus = this.ctx.createGain();
    this.musicBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.applyVolumes();
    this.startAmbient();
  }

  applyVolumes() {
    if (!this.ctx) return;
    const s = this.settings;
    this.master.gain.value = s.muted ? 0 : s.master;
    this.musicBus.gain.value = s.music;
    this.sfxBus.gain.value = s.sfx;
  }

  save() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { } }
  setVolume(kind, v) { this.settings[kind] = v; this.applyVolumes(); this.save(); }
  toggleMute() { this.settings.muted = !this.settings.muted; this.applyVolumes(); this.save(); return this.settings.muted; }
  setMood(m) { this.mood = m; }

  state() {
    return this.ctx ? { state: this.ctx.state, voices: this.voices, muted: this.settings.muted, vo: !!this.voPlaying } : { state: 'off' };
  }

  // priority-interrupt voice: higher lines cut lower ones; 3.5s spacing for equals
  say(line) {
    const def = VO[line];
    if (!def || this.settings.muted || this.settings.voice <= 0.01) return;
    const now = performance.now();
    if (this.voPlaying && !this.voPlaying.ended) {
      if (def.pri <= this.voPri) return;
      this.voPlaying.pause();
    } else if (now - this.voLastAt < 3500 && def.pri < 3) return;
    let pick = def.files[Math.floor(Math.random() * def.files.length)];
    if (def.files.length > 1 && pick === this.voLast[line]) {
      pick = def.files[(def.files.indexOf(pick) + 1) % def.files.length];
    }
    this.voLast[line] = pick;
    let clip = this.voClips[pick];
    if (!clip) { clip = new Audio('assets/vo/' + pick + '.mp3'); this.voClips[pick] = clip; }
    clip.volume = Math.max(0, Math.min(1, this.settings.voice * this.settings.master));
    clip.currentTime = 0;
    clip.play().catch(() => { });
    this.voPlaying = clip; this.voPri = def.pri; this.voLastAt = now;
  }

  // --- primitives -----------------------------------------------------------
  v(x, pct = 0.12) { return x * (1 + (Math.random() * 2 - 1) * pct); }

  env(node, t0, a, peak, dur) {
    node.gain.setValueAtTime(0.0001, t0);
    node.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  tone({ freq, dur = 0.3, type = 'sine', gain = 0.2, glide = null, bus = null, attack = 0.008, detune = 0 }) {
    if (!this.ctx || this.voices > 24) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, glide), t0 + dur * 0.9);
    osc.detune.value = detune;
    this.env(g, t0, attack, gain, dur);
    osc.connect(g); g.connect(bus || this.sfxBus);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
    this.voices++;
    osc.onended = () => { this.voices--; };
  }

  noise({ dur = 0.25, freq = 1200, q = 1, gain = 0.15, type = 'bandpass', sweep = null, bus = null }) {
    if (!this.ctx || this.voices > 24) return;
    const t0 = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
    if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(30, sweep), t0 + dur);
    const g = this.ctx.createGain();
    this.env(g, t0, 0.005, gain, dur);
    src.connect(f); f.connect(g); g.connect(bus || this.sfxBus);
    src.start(t0);
    this.voices++;
    src.onended = () => { this.voices--; };
  }

  chord(freqs, dur, gain, type = 'sine', stagger = 0.06) {
    freqs.forEach((f, i) => setTimeout(() => this.tone({ freq: this.v(f, 0.01), dur, type, gain }), i * stagger * 1000));
  }

  // --- ambient bed -----------------------------------------------------------
  startAmbient() {
    const ctx = this.ctx;
    // two detuned drones through a slowly-breathing lowpass
    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.value = 320;
    this.droneFilter.Q.value = 0.7;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    this.droneFilter.connect(droneGain); droneGain.connect(this.musicBus);
    this.drones = [55, 55.6, 82.4].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 2 ? 0.4 : 1;
      o.connect(g); g.connect(this.droneFilter);
      o.start();
      return o;
    });
    // slow LFO on the filter — the sea breathing
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.045;
    const lfoG = ctx.createGain(); lfoG.gain.value = 140;
    lfo.connect(lfoG); lfoG.connect(this.droneFilter.frequency);
    lfo.start();
    // sparse biolum blips, pentatonic, mood-shifted
    const scale = [523, 587, 659, 784, 880, 1046];
    const blip = () => {
      if (!this.ctx) return;
      if (this.ctx.state === 'running' && Math.random() < 0.85) {
        const f = scale[Math.floor(Math.random() * scale.length)] * (1 + this.mood * 0.06);
        this.tone({ freq: this.v(f, 0.01), dur: this.v(2.2, 0.3), type: 'sine', gain: 0.022, bus: this.musicBus, attack: 0.4 });
        if (Math.random() < 0.3) this.tone({ freq: this.v(f * 1.5, 0.01), dur: 2.8, type: 'sine', gain: 0.012, bus: this.musicBus, attack: 0.6 });
      }
      this._ambientTimer = setTimeout(blip, 1800 + Math.random() * 5200);
    };
    blip();
  }

  // --- event routing -----------------------------------------------------------
  // cooldown-gated so a 30-creature volley doesn't stack 30 identical sounds
  gate(key, ms) {
    const now = performance.now();
    if (this.cool[key] && now - this.cool[key] < ms) return false;
    this.cool[key] = now;
    return true;
  }

  on(ev) {
    if (!this.ctx || this.ctx.state !== 'running' || this.settings.muted) return;
    switch (ev.type) {
      case 'fire':
        if (!this.gate('fire_' + ev.towerType, 90)) break;
        switch (ev.towerType) {
          case 'coral': this.tone({ freq: this.v(340), dur: 0.14, type: 'triangle', gain: 0.06, glide: this.v(240) }); break;
          case 'tesla': this.noise({ dur: 0.12, freq: this.v(2600), q: 2.5, gain: 0.07, sweep: 700 }); break;
          case 'spire': this.tone({ freq: this.v(1560, 0.05), dur: 0.5, type: 'sine', gain: 0.05 });
            this.tone({ freq: this.v(2093, 0.04), dur: 0.4, type: 'sine', gain: 0.03 }); break;
          case 'urchin': this.tone({ freq: this.v(1200), dur: 0.22, type: 'sawtooth', gain: 0.05, glide: 180 }); break;
          case 'bloom': this.noise({ dur: 0.3, freq: 300, gain: 0.07, sweep: 90, type: 'lowpass' });
            this.tone({ freq: this.v(140), dur: 0.25, gain: 0.06, glide: 60 }); break;
          case 'bramble': this.noise({ dur: 0.06, freq: this.v(1900), q: 4, gain: 0.045 }); break;
        }
        break;
      case 'impact':
        if (!this.gate('impact', 110)) break;
        this.noise({ dur: 0.18, freq: this.v(700), gain: 0.06, sweep: 160, type: 'lowpass' });
        this.tone({ freq: this.v(180), dur: 0.16, gain: 0.05, glide: 70 });
        break;
      case 'kill':
        if (ev.boss) {
          this.tone({ freq: 90, dur: 2.2, gain: 0.3, glide: 38 });
          this.noise({ dur: 1.6, freq: 500, gain: 0.2, sweep: 80, type: 'lowpass' });
          this.chord([262, 392, 523, 784], 2.2, 0.08, 'triangle', 0.12);
        } else if (this.gate('kill', 70)) {
          this.tone({ freq: this.v(880, 0.2), dur: 0.09, type: 'sine', gain: 0.045, glide: this.v(1400, 0.2) });
        }
        break;
      case 'mix':
        if (!this.gate('mix', 140)) break;
        switch (ev.mix) {
          case 'shatter': this.chord([1976, 1568, 1319, 988], 0.5, 0.05, 'sine', 0.03);
            this.noise({ dur: 0.3, freq: 3200, q: 3, gain: 0.05, sweep: 1400 }); break;
          case 'overload': this.noise({ dur: 0.35, freq: this.v(2000), q: 1.2, gain: 0.09, sweep: 400 });
            this.tone({ freq: this.v(70), dur: 0.3, gain: 0.09, type: 'square', glide: 40 }); break;
          case 'freezelock': this.tone({ freq: this.v(110), dur: 0.4, gain: 0.09, glide: 55 });
            this.tone({ freq: this.v(2637, 0.02), dur: 0.9, gain: 0.04 }); break;
          case 'meltdown': this.noise({ dur: 0.9, freq: this.v(900), q: 0.8, gain: 0.07, sweep: 220, type: 'lowpass' }); break;
        }
        break;
      case 'discover':
        this.chord([523, 659, 988], 0.8, 0.09, 'triangle', 0.11);
        this.say(ev.mix);
        break;
      case 'place':
        this.tone({ freq: this.v(200), dur: 0.35, type: 'triangle', gain: 0.09, glide: this.v(520) });
        this.noise({ dur: 0.25, freq: 900, gain: 0.03, sweep: 2400 });
        break;
      case 'upgrade':
        this.chord([this.v(392, 0.01), this.v(523, 0.01), this.v(659, 0.01)], 0.5, 0.06, 'triangle', 0.07);
        break;
      case 'sell':
        this.tone({ freq: 500, dur: 0.3, type: 'triangle', gain: 0.06, glide: 160 });
        break;
      case 'heartHit':
        if (this.gate('voHeart', 9000)) this.say('hearthit');
        this.tone({ freq: 65, dur: 0.8, gain: 0.22, type: 'sine' });
        this.tone({ freq: this.v(392), dur: 0.5, gain: 0.07, type: 'sawtooth', glide: 250, detune: 18 });
        break;
      case 'waveStart':
        if (this.gate('waveStart', 800)) this.tone({ freq: 98, dur: 1.1, gain: 0.12, glide: 130, type: 'triangle' });
        if (ev.wave % 5 === 0) this.say('wave5');
        else if (Math.random() < 0.35) this.say('wave');
        break;
      case 'waveClear':
        this.chord([392, 494, 587], 0.9, 0.05, 'sine', 0.09);
        break;
      case 'surgeBonus':
        this.chord([659, 784], 0.3, 0.05, 'triangle', 0.05);
        break;
      case 'shieldBreak':
        if (this.gate('shieldBreak', 120)) this.noise({ dur: 0.2, freq: this.v(2800), q: 2, gain: 0.07, sweep: 900 });
        break;
      case 'bossSpawn':
        this.say(ev.bossId === 'tidecaller' ? 'tidecaller' : ev.boss ? 'unlit' : 'brood');
        this.tone({ freq: 49, dur: 3.0, gain: 0.28 });
        this.noise({ dur: 2.0, freq: 200, gain: 0.1, sweep: 60, type: 'lowpass' });
        break;
      case 'bossTelegraph':
        this.tone({ freq: 80, dur: ev.dur || 2.4, gain: 0.15, glide: 190, type: 'sawtooth', attack: 0.8 });
        break;
      case 'bossPulse':
        this.tone({ freq: 55, dur: 1.0, gain: 0.3, glide: 30 });
        this.noise({ dur: 0.6, freq: 400, gain: 0.14, sweep: 90, type: 'lowpass' });
        break;
      case 'tideSwell':
        this.noise({ dur: 0.9, freq: this.v(600), q: 0.8, gain: 0.1, sweep: 2400, type: 'bandpass' });
        this.tone({ freq: this.v(220), dur: 0.8, gain: 0.08, glide: 520 });
        break;
      case 'bossSummon':
        this.noise({ dur: 0.5, freq: 900, gain: 0.1, sweep: 200, type: 'lowpass' });
        this.tone({ freq: this.v(110), dur: 0.5, gain: 0.1, glide: 60 });
        break;
      case 'bossPhase':
        this.say('phase');
        this.noise({ dur: 1.2, freq: 1400, gain: 0.16, sweep: 200 });
        this.tone({ freq: 65, dur: 1.6, gain: 0.22, glide: 90 });
        break;
      case 'victory':
        this.say('victory');
        this.chord([392, 523, 659, 784, 1046], 2.4, 0.09, 'triangle', 0.16);
        break;
      case 'gameOver':
        this.say('defeat');
        this.chord([330, 262, 196, 131], 2.6, 0.1, 'sine', 0.3);
        break;
    }
  }
}
