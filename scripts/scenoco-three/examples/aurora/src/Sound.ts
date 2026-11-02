import { Behaviour } from '@scenoco-three/core';

/**
 * Aurora Siege's own sound, carried over: its synth (launch thumps, whistles, layered explosions, the
 * city crash, the fanfare, the nuke), its two soundtrack pieces, and the commander's voice — eleven
 * announcers, one picked per run, heard rarely (`SAY`) and switched off with NARRATION. The files live
 * beside the classic edition and are shared with it.
 */
const TRACKS = ['../assets/last-life-ascent.mp3', '../assets/final-boss-approach.mp3'];
const VOICES = ['harry', 'bella', 'brian', 'callum', 'charlie', 'chris', 'eric', 'jessica', 'liam', 'lily', 'matilda'];
export const VOICE_TEXT: Record<string, string> = {
  'vo-incoming': 'INCOMING — ENGAGE', 'vo-wave': 'HOLD THE LINE', 'vo-wave-2': 'MULTIPLE CONTACTS ON RADAR', 'vo-wave-3': 'WEAPONS FREE',
  'vo-city-lost': 'CITY LOST', 'vo-city-lost-2': 'CITY DOWN — TIGHTEN THE NET', 'vo-last-city': 'ONE CITY REMAINING',
  'vo-sector-secure': 'SECTOR SECURED', 'vo-secure-2': 'WAVE NEUTRALIZED', 'vo-secure-3': 'ALL CLEAR — REARMING',
  'vo-mirv': 'MIRV SEPARATION', 'vo-mirv-2': 'WARHEADS SPLITTING', 'vo-smart': 'SMART WEAPONS — THEY EVADE',
  'vo-bomber': 'BOMBER ON APPROACH', 'vo-orbital': 'ORBITAL WEAPON CHARGING', 'vo-meteor': 'METEOR SHOWER INBOUND',
  'vo-stealth': 'STEALTH SIGNATURES DETECTED', 'vo-nuke': 'NUCLEAR WARHEADS — STOP THEM', 'vo-ammo-low': 'AMMUNITION LOW',
  'vo-chain': 'BEAUTIFUL CHAIN', 'vo-boss': 'BOSS INBOUND — BRACE', 'vo-base-down': 'LAUNCH BASE DESTROYED',
};
const POOLS: Record<string, string[]> = {
  wave: ['vo-wave', 'vo-wave-2', 'vo-wave-3'],
  secure: ['vo-sector-secure', 'vo-secure-2', 'vo-secure-3'],
  cityLost: ['vo-city-lost', 'vo-city-lost-2'],
  mirv: ['vo-mirv', 'vo-mirv-2'],
};
/**
 * How rarely the commander speaks (v1.0.5: a line every wave, every city and every MIRV was monotonous).
 * `key`: the big moments — the opening call, each boss's own line, the last city. They skip the
 * quiet gap but never talk over a line: one arriving mid-line waits for it to end.
 * `once`: only the first time in a run (the general boss warning; each boss's own line announces it after).
 * `first`: heard the first time it comes up in a run, if the gap allows; after that only at `chance`.
 * Anything else is heard only at `chance`, and only when the gap allows. An event not listed is silent.
 */
const SAY: Record<string, { key?: boolean; once?: boolean; first?: boolean; chance?: number }> = {
  'vo-incoming': { key: true, once: true },
  'vo-boss': { key: true, once: true },
  'vo-bomber': { key: true },
  'vo-orbital': { key: true },
  'vo-meteor': { key: true },
  'vo-stealth': { key: true },
  'vo-nuke': { key: true },
  'vo-last-city': { key: true },
  cityLost: { first: true, chance: 0.1 },
  mirv: { first: true },
  'vo-smart': { first: true },
  wave: { chance: 0.05 },
  secure: { chance: 0.05 },
  'vo-base-down': { chance: 0.08 },
  'vo-chain': { chance: 0.1 },
  'vo-ammo-low': { chance: 0.08 },
};
/** Seconds of real time between the end of one line and the start of the next, key lines aside. */
const GAP = 25;
/** A key line that has waited this long for another to finish is no longer news. */
const STALE = 6000;
const MUTE_KEY = 'auroraSiege3d_muted';
const NARRATION_KEY = 'auroraSiege3d_narration';

interface Falling {
  tone: OscillatorNode;
  second: OscillatorNode;
  air: AudioBufferSourceNode;
  band: BiquadFilterNode;
  toneGain: GainNode;
  airGain: GainNode;
  pan: StereoPannerNode | null;
  lfo: OscillatorNode;
  voice: Voice;
}

interface Voice {
  base: number;
  drop: number;
  curve: number;
  interval: number;
  beat: number;
  airPitch: number;
  airMix: number;
  level: number;
  weave: number;
  phase: number;
  shape: OscillatorType;
  second: OscillatorType;
  rate: number;
  depth: number;
  q: number;
}

export class Sound extends Behaviour {
  muted = false;
  /** The commander's voice on or off (remembered); off, no line is spoken or captioned. Whistles and music stay. */
  narration = true;
  /** Shown when the commander speaks: the line in words; '' when a line is cut short. */
  onVoice: ((text: string) => void) | null = null;

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private air: AudioBuffer | null = null;
  private lastWhistle = 0;
  private readonly falling = new Map<object, Falling>();
  private readonly music = new Audio();
  private track = 0;
  private wantMusic = false;
  private readonly voice = new Audio();
  private announcer = VOICES[0]!;
  /** A line is playing now. */
  private speaking = false;
  /** performance.now() when the last line ended (or started, while it plays). */
  private quietSince = -Infinity;
  private lastLine = '';
  private readonly lastPick: Record<string, string> = {};
  /** Events heard this run, for `first`. */
  private readonly heard = new Set<string>();
  /** Key lines waiting for the one speaking to finish. */
  private readonly waiting: { event: string; at: number }[] = [];
  private voiceGuard = 0;
  private line = 0;

  override awake(): void {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1';
      this.narration = localStorage.getItem(NARRATION_KEY) !== '0';
    } catch {
      // storage refused
    }
    const done = () => this.lineDone();
    this.voice.addEventListener('ended', done);
    this.voice.addEventListener('error', done);
    this.music.preload = 'auto';
    this.music.volume = 0.42;
    this.music.addEventListener('ended', () => {
      this.track = (this.track + 1) % TRACKS.length;
      this.music.src = TRACKS[this.track]!;
      if (this.wantMusic) void this.music.play().catch(() => {});
    });
    this.music.src = TRACKS[0]!;
    this.voice.preload = 'auto';
    const unlock = () => this.unlock();
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }

  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.55;
        this.master.connect(this.ctx.destination);
        const len = this.ctx.sampleRate * 2;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
        // A loop of even noise for the rush of air round a falling warhead.
        this.air = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const air = this.air.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) air[i] = last = last * 0.6 + (Math.random() * 2 - 1) * 0.4;
        this.drone();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      if (this.wantMusic && this.music.paused && !this.muted) void this.music.play().catch(() => {});
    } catch {
      // no Web Audio: a silent game
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0');
    } catch {
      // not remembered
    }
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.muted ? 0 : 0.55, this.ctx.currentTime, 0.03);
    if (this.muted) {
      this.music.pause();
      this.hush();
    } else if (this.wantMusic) void this.music.play().catch(() => {});
    return this.muted;
  }

  /** Narration on or off, remembered apart from the sound switch. Off cuts any line short. */
  toggleNarration(): boolean {
    this.narration = !this.narration;
    try {
      localStorage.setItem(NARRATION_KEY, this.narration ? '1' : '0');
    } catch {
      // not remembered
    }
    if (!this.narration) this.hush();
    return this.narration;
  }

  /** The soundtrack on or off, and how loud: full on the title, stepped back under play. */
  setMusic(on: boolean, level = 0.42): void {
    this.wantMusic = on;
    this.music.volume = level;
    if (!on) this.music.pause();
    else if (!this.muted && this.ctx && this.music.paused) void this.music.play().catch(() => {});
  }

  /** A new run: a new announcer, and every `first` line may be heard again. */
  newRun(): void {
    let next = VOICES[Math.floor(Math.random() * VOICES.length)]!;
    if (next === this.announcer) next = VOICES[(VOICES.indexOf(next) + 1) % VOICES.length]!;
    this.announcer = next;
    this.heard.clear();
    this.waiting.length = 0;
  }

  /**
   * Something the commander might say. The one gate every line goes through: nothing with narration
   * off or the sound muted; never over another line; never the same clip twice running; and, but for
   * the `key` moments, only after GAP quiet seconds and then only as `SAY` allows.
   */
  announce(event: string): void {
    if (this.muted || !this.narration) return;
    const say = SAY[event] ?? {};
    if (say.once && this.heard.has(event)) return;
    if (say.key) {
      if (this.speaking) {
        if (this.waiting.length < 2) this.waiting.push({ event, at: performance.now() });
        return;
      }
    } else {
      if (this.speaking || performance.now() - this.quietSince < GAP * 1000) return;
      const fresh = say.first && !this.heard.has(event);
      if (!fresh && !(Math.random() < (say.chance ?? 0))) return;
    }
    this.speak(event);
  }

  /** Stop talking: the line cut short, its caption cleared, nothing left waiting. */
  hush(): void {
    this.waiting.length = 0;
    if (!this.speaking) return;
    this.voice.pause();
    this.lineDone();
    this.onVoice?.('');
  }

  private speak(event: string): void {
    // From the event's pool, never the clip just heard, nor this event's last line if it has another.
    const pool = (POOLS[event] ?? [event]).filter((p) => p !== this.lastLine);
    const fresh = pool.filter((p) => p !== this.lastPick[event]);
    const from = fresh.length ? fresh : pool;
    const pick = from[Math.floor(Math.random() * from.length)];
    if (!pick) return;
    this.lastPick[event] = this.lastLine = pick;
    this.heard.add(event);
    this.speaking = true;
    this.quietSince = performance.now();
    this.onVoice?.(VOICE_TEXT[pick] ?? '');
    // A clip that never reports its end does not hold the voice for good; a late failure of an
    // earlier line does not end this one.
    const line = ++this.line;
    const failed = () => line === this.line && this.lineDone();
    clearTimeout(this.voiceGuard);
    this.voiceGuard = window.setTimeout(failed, 6000);
    try {
      this.voice.src = `../assets/vo/${this.announcer}/${pick}.mp3`;
      this.voice.volume = 0.9;
      this.voice.currentTime = 0;
      void this.voice.play().catch(failed);
    } catch {
      failed();
    }
  }

  /** The line has ended (or failed): the quiet starts now, and a key line waiting gets its turn. */
  private lineDone(): void {
    if (!this.speaking) return;
    this.speaking = false;
    clearTimeout(this.voiceGuard);
    this.quietSince = performance.now();
    while (this.waiting.length) {
      const next = this.waiting.shift()!;
      if (performance.now() - next.at < STALE) return this.announce(next.event);
    }
  }

  // --- incoming warheads ---------------------------------------------------------------------

  /**
   * The falling warheads' whistles: each a tone sliding down as it drops, with a rush of air round it,
   * swelling as it nears the ground and panned to where it is. Called every frame with the ones to voice
   * (the nearest few); any not in the list fades out. An empty list silences them all.
   */
  incoming(list: { id: object; pan: number; progress: number; kind: string; speed: number }[]): void {
    if (!this.live || !this.air) {
      for (const [id, f] of this.falling) this.release(id, f);
      return;
    }
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const keep = new Set(list.map((l) => l.id));
    for (const [id, f] of this.falling) if (!keep.has(id)) this.release(id, f);
    for (const l of list) {
      let f = this.falling.get(l.id);
      if (!f) {
        f = this.fall(l.kind, l.speed);
        this.falling.set(l.id, f);
      }
      const v = f.voice;
      const k = Math.min(1, Math.max(0, l.progress));
      // Its own fall: from its own pitch, dropping by its own share, faster toward the end for a quick one.
      let pitch = v.base * (1 - v.drop * k ** v.curve);
      // A smart warhead's tone wavers as it weaves; a MIRV bus wails up and down before it splits.
      if (l.kind === 'smart') pitch *= 1 + 0.07 * Math.sin(t * v.weave + v.phase);
      if (l.kind === 'mirv') pitch *= 1 + 0.05 * Math.sin(t * 2.2 + v.phase);
      f.tone.frequency.setTargetAtTime(pitch, t, 0.05);
      f.second.frequency.setTargetAtTime(pitch * v.interval + v.beat, t, 0.05);
      f.band.frequency.setTargetAtTime(Math.min(9000, pitch * v.airPitch), t, 0.06);
      const loud = v.level * (0.5 + 0.5 * k ** 1.3);
      f.toneGain.gain.setTargetAtTime(loud, t, 0.08);
      f.airGain.gain.setTargetAtTime(loud * v.airMix, t, 0.08);
      f.pan?.pan.setTargetAtTime(Math.max(-0.8, Math.min(0.8, l.pan * 0.8)), t, 0.05);
    }
  }

  /**
   * A falling warhead's voice: no two alike. Each draws its own pitch, fall, waveform, warble and rush of
   * air, within a character for its kind — a fast one higher and quicker to drop, a heavy one lower.
   */
  private fall(kind: string, speed: number): Falling {
    const ctx = this.ctx!;
    const r = (a: number, b: number) => a + Math.random() * (b - a);
    const quick = Math.max(0.75, Math.min(1.3, speed / 1.8));
    const shapes: OscillatorType[] = ['sine', 'sine', 'triangle'];
    let v: Voice = {
      base: r(1150, 2100) * quick, drop: r(0.55, 0.75), curve: r(0.9, 1.6), interval: r(1.003, 1.012), beat: r(1, 7),
      airPitch: r(1.3, 2.4), airMix: r(0.6, 1.3), level: r(0.13, 0.19), weave: r(5, 9), phase: r(0, 6.28),
      shape: shapes[Math.floor(Math.random() * shapes.length)]!, second: 'triangle', rate: r(4.5, 8.5), depth: r(10, 34), q: r(1.8, 4),
    };
    if (kind === 'nuke') v = { ...v, base: r(210, 290), drop: r(0.45, 0.6), shape: 'sawtooth', second: 'sawtooth', interval: r(0.497, 0.503), beat: r(0.5, 2), airPitch: r(1.2, 1.8), airMix: r(1.4, 1.9), level: r(0.22, 0.28), rate: r(2, 3.5), depth: r(4, 9), q: r(0.6, 1) };
    if (kind === 'mirv') v = { ...v, base: v.base * 0.82, interval: r(1.18, 1.26), level: v.level * 1.05, depth: v.depth * 0.6 };
    if (kind === 'smart') v = { ...v, shape: 'triangle', second: 'square', interval: r(1.49, 1.51), level: v.level * 0.85, airMix: v.airMix * 0.7 };
    if (kind === 'bomb') v = { ...v, base: r(700, 1100), drop: r(0.5, 0.65), shape: 'triangle', rate: r(9, 13), depth: r(6, 14), airMix: v.airMix * 1.3 };
    if (kind === 'stealth') v = { ...v, level: v.level * 0.55, airMix: 1.8, depth: 3, q: 0.9 };
    const tone = ctx.createOscillator();
    const second = ctx.createOscillator();
    tone.type = v.shape;
    second.type = v.second;
    tone.frequency.value = v.base;
    second.frequency.value = v.base * v.interval;
    const toneGain = ctx.createGain();
    toneGain.gain.value = 0;
    const air = ctx.createBufferSource();
    air.buffer = this.air;
    air.loop = true;
    air.playbackRate.value = r(0.8, 1.25);
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = v.q;
    const airGain = ctx.createGain();
    airGain.gain.value = 0;
    // The second partial a little quieter, so the pair beats rather than buzzes.
    const secondGain = ctx.createGain();
    secondGain.gain.value = v.second === 'square' || v.second === 'sawtooth' ? 0.18 : 0.45;
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const out: AudioNode = pan ?? this.master!;
    tone.connect(toneGain);
    second.connect(secondGain).connect(toneGain);
    toneGain.connect(out);
    air.connect(band).connect(airGain).connect(out);
    if (pan) pan.connect(this.master!);
    // The warble: its own speed and depth.
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = v.rate;
    depth.gain.value = v.depth;
    lfo.connect(depth);
    depth.connect(tone.frequency);
    depth.connect(second.frequency);
    const start = ctx.currentTime + Math.random() * 0.05;
    lfo.start(start);
    tone.start(start);
    second.start(start);
    air.start(start, Math.random() * 1.5);
    return { tone, second, air, band, toneGain, airGain, pan, lfo, voice: v };
  }

  private release(id: object, f: Falling): void {
    this.falling.delete(id);
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    f.toneGain.gain.setTargetAtTime(0, t, 0.04);
    f.airGain.gain.setTargetAtTime(0, t, 0.04);
    for (const node of [f.tone, f.second, f.air, f.lfo]) {
      try {
        node.stop(t + 0.3);
      } catch {
        // already stopped
      }
    }
  }

  // --- the synth -----------------------------------------------------------------------------

  private get live(): boolean {
    return !!this.ctx && !!this.master && this.ctx.state === 'running' && !this.muted;
  }

  burst(freq = 70, dur = 0.45, gain = 0.18, type: OscillatorType = 'sawtooth', glide = 0.5, delay = 0): void {
    if (!this.live) return;
    const ctx = this.ctx!;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * glide), t + dur);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  hiss(dur = 0.28, gain = 0.14, hp = 400, lp = 1800, delay = 0): void {
    if (!this.live || !this.noise) return;
    const ctx = this.ctx!;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const h = ctx.createBiquadFilter();
    h.type = 'highpass';
    h.frequency.value = hp;
    const l = ctx.createBiquadFilter();
    l.type = 'lowpass';
    l.frequency.value = lp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(h).connect(l).connect(g).connect(this.master!);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  launch(): void {
    if (!this.live) return;
    this.burst(140, 0.12, 0.14, 'square', 0.4);
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.25);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
    osc.connect(lp).connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.35);
    this.hiss(0.3, 0.12, 300, 3000);
  }

  /** A warhead breaking into view: a bright falling whistle, panned to where it is. Not more than four a second. */
  whistle(pan = 0, nuke = false): void {
    if (!this.live) return;
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    if (t - this.lastWhistle < 0.25) return;
    this.lastWhistle = t;
    const r = (a: number, b: number) => a + Math.random() * (b - a);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = nuke ? 'sawtooth' : Math.random() < 0.7 ? 'sine' : 'triangle';
    const from = nuke ? r(360, 480) : r(1700, 2600);
    const len = r(0.5, 0.9);
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(from * r(0.38, 0.55), t + len);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime((nuke ? 0.22 : 0.16) * r(0.75, 1.1), t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + len + 0.05);
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (p) p.pan.value = Math.max(-0.8, Math.min(0.8, pan * 0.8));
    o.connect(g);
    if (p) g.connect(p).connect(this.master!);
    else g.connect(this.master!);
    o.start(t);
    o.stop(t + 1);
  }

  explosion(power = 1, combo = 1): void {
    this.hiss(0.5 * power, 0.22 * Math.min(1.4, power), 80, 1200);
    this.burst(90 + combo * 10, 0.55 * power, 0.12 * power, 'sawtooth', 0.35);
    this.burst(35, 1.0 * power, 0.14 * power, 'triangle', 0.3);
    for (let i = 0; i < 3; i++) this.burst(28 + Math.random() * 25, 0.4 * power, (0.06 + Math.random() * 0.04) * power, 'sawtooth', 0.7, 0.06 + i * 0.09);
    this.hiss(0.45 * power, 0.08 * power, 200, 2500, 0.15);
  }

  cityCrash(): void {
    this.hiss(1.0, 0.32, 40, 900);
    this.burst(50, 0.9, 0.16, 'square', 0.25);
    this.burst(25, 1.0, 0.18, 'triangle', 0.4);
    this.hiss(1.0, 0.12, 400, 900, 0.2);
  }

  fanfare(): void {
    [330, 392, 494, 587, 659].forEach((f, i) => {
      this.burst(f, 0.35, 0.09, 'triangle', 1.3, i * 0.09);
      this.burst(f * 2, 0.25, 0.04, 'sine', 1.2, i * 0.09);
    });
    this.hiss(1.5, 0.06, 3000, 12000);
  }

  combo(count: number): void {
    this.burst(400 + count * 65, 0.16, 0.05 + Math.min(0.08, count * 0.01), 'square', 1.02);
  }

  nuke(): void {
    this.burst(20, 2.0, 0.25, 'triangle', 0.15);
    this.burst(30, 1.5, 0.2, 'sawtooth', 0.2);
    for (let i = 0; i < 6; i++) this.burst(18 + Math.random() * 15, 0.8, 0.12, 'sawtooth', 0.6, 0.1 + i * 0.15);
    this.hiss(1.5, 0.3, 30, 800);
    this.hiss(1.6, 0.15, 100, 1500, 0.4);
  }

  ping(): void {
    this.burst(1200, 0.15, 0.06, 'sine', 0.5);
  }

  tick(): void {
    this.burst(380, 0.035, 0.03, 'square', 1.15);
  }

  pick(): void {
    [784, 1046, 1568].forEach((f, i) => this.burst(f, 0.06, 0.045, i % 2 ? 'triangle' : 'square', 1, i * 0.04));
  }

  coin(step: number): void {
    this.burst(880 + step * 12, 0.05, 0.03, 'square', 1.05);
  }

  private drone(): void {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    o1.type = 'sine';
    o2.type = 'triangle';
    o1.frequency.value = 44;
    o2.frequency.value = 55;
    lfo.frequency.value = 0.12;
    lfoG.gain.value = 0.02;
    lfo.connect(lfoG).connect(g.gain);
    g.gain.value = 0.025;
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master!);
    o1.start(t);
    o2.start(t);
    lfo.start(t);
  }
}
