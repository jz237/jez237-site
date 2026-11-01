import { Behaviour } from '@scenoco-three/core';
import { LEFT, RIGHT } from './grid';

/**
 * The game's sound: Millipede's own music and marquee samples (the same files the classic edition
 * plays), and its arcade synth for everything else — ported as it was, so the game still sounds like
 * itself. Panned by where on the field a sound comes from.
 *
 * Nothing can play until the page has been touched; `unlock` runs on the first touch or key.
 */
export type SoundName =
  | 'shot' | 'mushroom' | 'crumble' | 'segment' | 'enemy' | 'spider' | 'flea' | 'scorpion' | 'wave' | 'death' | 'bomb'
  | 'gameover' | 'submit' | 'start' | 'tick' | 'pickup' | 'oneup' | 'expire' | 'shield' | 'laser' | 'queenWarn'
  | 'queenHit' | 'queenDeath' | 'clink';
export type MusicName = 'musicTitle' | 'musicGame' | 'musicBoss';

const FILES: Record<string, string> = {
  musicTitle: 'audio/music-title.mp3', musicGame: 'audio/music-game.mp3', musicBoss: 'audio/music-boss.mp3',
  queenWarn: 'audio/sfx-queen-warn.mp3', queenDeath: 'audio/sfx-queen-death.mp3', death: 'audio/sfx-death.mp3',
  bomb: 'audio/sfx-bomb.mp3', oneup: 'audio/sfx-oneup.mp3', wave: 'audio/sfx-wave.mp3', gameover: 'audio/sfx-gameover.mp3',
  shot: 'audio/sfx-shot.mp3',
};
const SAMPLE_GAIN: Record<string, number> = { queenWarn: 0.8, queenDeath: 0.9, death: 0.85, bomb: 0.9, oneup: 0.6, wave: 0.5, gameover: 0.8, shot: 0.34 };
const LOUDNESS = 2.25;
const MUSIC_LEVEL = 0.42;
const MUTE_KEY = 'millipede_muted';

export class Sound extends Behaviour {
  muted = false;

  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private readonly buffers: Record<string, AudioBuffer> = {};
  private requested = false;
  private wanted: MusicName | null = null;
  private current: MusicName | null = null;
  private playing: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private lastShot = 0;

  override awake(): void {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      // storage refused: sound on
    }
    const unlock = () => this.unlock();
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }

  get ready(): boolean {
    return !!this.context && this.context.state === 'running';
  }

  unlock(): void {
    try {
      if (!this.context) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.context = new Ctor();
        this.master = this.context.createGain();
        this.master.gain.value = this.muted ? 0 : 1;
        this.master.connect(this.context.destination);
        this.sfxBus = this.context.createGain();
        this.sfxBus.connect(this.master);
        this.musicBus = this.context.createGain();
        this.musicBus.gain.value = MUSIC_LEVEL;
        this.musicBus.connect(this.master);
      }
      if (this.context.state === 'suspended') void this.context.resume().then(() => this.retry());
      this.load();
      this.retry();
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
    if (this.master && this.context) this.master.gain.setTargetAtTime(this.muted ? 0 : 1, this.context.currentTime, 0.03);
    return this.muted;
  }

  private load(): void {
    if (this.requested || !this.context) return;
    this.requested = true;
    for (const [name, url] of Object.entries(FILES)) {
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(url);
          return r.arrayBuffer();
        })
        .then((ab) => this.context!.decodeAudioData(ab))
        .then((buffer) => {
          this.buffers[name] = buffer;
          this.retry();
        })
        .catch(() => {});
    }
  }

  // --- music: looped tracks crossfaded on one bus, ducked under big moments -----------------

  music(name: MusicName | null): void {
    this.wanted = name;
    if (!this.ready || this.current === name) return;
    if (name && !this.buffers[name]) return;
    const ctx = this.context!;
    const t = ctx.currentTime;
    if (this.playing) {
      const old = this.playing;
      old.gain.gain.setTargetAtTime(0.0001, t, 0.35);
      try {
        old.src.stop(t + 1.6);
      } catch {
        // already stopped
      }
      this.playing = null;
    }
    this.current = name;
    if (!name) return;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = this.buffers[name]!;
    src.loop = true;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.setTargetAtTime(1, t, 0.5);
    src.connect(gain);
    gain.connect(this.musicBus!);
    src.start();
    this.playing = { src, gain };
  }

  private retry(): void {
    if (this.wanted && this.ready && this.current !== this.wanted && this.buffers[this.wanted]) this.music(this.wanted);
  }

  duck(amount = 0.35, seconds = 1.2): void {
    if (!this.context || !this.musicBus) return;
    const t = this.context.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setTargetAtTime(MUSIC_LEVEL * amount, t, 0.08);
    this.musicBus.gain.setTargetAtTime(MUSIC_LEVEL, t + seconds, 0.4);
  }

  // --- effects ----------------------------------------------------------------------------

  play(name: SoundName, x?: number): void {
    if (!this.ready || this.muted) return;
    try {
      this.effect(name, x);
    } catch {
      // a sound is never worth a crash
    }
  }

  private effect(name: SoundName, x?: number): void {
    const tone = (f: number, d: number, type: OscillatorType, g: number, end?: number, dt?: number) => this.tone(f, d, type, g, end, x, dt);
    const later = (ms: number, fn: () => void) => setTimeout(fn, ms);
    switch (name) {
      case 'death':
        if (this.sample('death', x)) return this.duck(0.3, 1);
        tone(180, 0.18, 'sawtooth', 0.05, 45);
        return this.noise(0.22, 0.045, true, x);
      case 'bomb':
        if (this.sample('bomb', x)) return this.duck(0.35, 1);
        tone(80, 0.18, 'sawtooth', 0.06, 38);
        tone(260, 0.11, 'triangle', 0.035, 520);
        return this.noise(0.16, 0.04, false, x);
      case 'oneup':
        if (this.sample('oneup', x)) return;
        return [659, 784, 1046, 1318].forEach((f, i) => later(i * 55, () => tone(f, 0.07, i % 2 ? 'square' : 'triangle', 0.022)));
      case 'wave':
        if (this.sample('wave', x)) return;
        return [220, 330, 440, 660].forEach((f, i) => later(i * 45, () => tone(f, 0.055, 'square', 0.018)));
      case 'gameover':
        if (this.sample('gameover', x)) return;
        return [392, 330, 262, 196].forEach((f, i) => later(i * 160, () => tone(f, 0.16, i % 2 ? 'triangle' : 'sawtooth', 0.03, f * 0.92)));
      case 'queenWarn':
        if (this.sample('queenWarn', x)) return this.duck(0.3, 1.4);
        [146, 196, 146, 262].forEach((f, i) => later(i * 70, () => tone(f, 0.09, i % 2 ? 'square' : 'sawtooth', 0.034)));
        return;
      case 'queenDeath':
        if (this.sample('queenDeath', x)) return this.duck(0.3, 1.2);
        [330, 247, 196, 147, 110].forEach((f, i) => later(i * 58, () => tone(f, 0.11, 'sawtooth', 0.035, Math.max(45, f * 0.5))));
        return this.noise(0.32, 0.045, true, x);
      case 'shot': {
        // At most one shot sound per 45 ms: two bolts a frame are one sound.
        const now = this.context!.currentTime;
        if (now - this.lastShot < 0.045) return;
        this.lastShot = now;
        if (this.sample('shot', x, 0.3 + Math.random() * 0.1, 0.95 + Math.random() * 0.22)) return;
        tone(1500, 0.07, 'square', 0.016, 380, 0.06);
        return tone(2900, 0.03, 'triangle', 0.006, 900, 0.06);
      }
      case 'mushroom':
        return [0, 12, 24].forEach((d, i) => later(d, () => tone(720 + i * 55, 0.011, 'triangle', 0.0048, 620, 0.04)));
      case 'crumble':
        tone(190, 0.07, 'triangle', 0.018, 80, 0.04);
        return this.noise(0.09, 0.018, true, x);
      case 'segment':
        tone(150, 0.045, 'sawtooth', 0.018, 90, 0.05);
        return tone(420, 0.026, 'square', 0.01, 250, 0.05);
      case 'enemy':
        tone(520, 0.06, 'square', 0.022, 180, 0.04);
        return this.noise(0.08, 0.018, false, x);
      case 'spider':
        tone(300, 0.07, 'square', 0.018, 420);
        return tone(190, 0.05, 'triangle', 0.012, 130);
      case 'flea':
        tone(720, 0.05, 'square', 0.016, 360);
        return tone(980, 0.035, 'square', 0.012, 700);
      case 'scorpion':
        tone(110, 0.13, 'sawtooth', 0.024, 260);
        return tone(660, 0.04, 'square', 0.012, 520);
      case 'submit':
        return [523, 659, 784, 1046].forEach((f, i) => later(i * 55, () => tone(f, 0.07, i % 2 ? 'triangle' : 'square', 0.02)));
      case 'start':
        return [196, 262, 392, 523].forEach((f, i) => later(i * 42, () => tone(f, 0.055, 'square', 0.018)));
      case 'tick':
        return tone(380, 0.035, 'square', 0.013, 440, 0.03);
      case 'clink':
        tone(1900, 0.03, 'triangle', 0.012, 1500, 0.08);
        return tone(2600, 0.02, 'square', 0.006, 2100, 0.08);
      case 'pickup':
        return [784, 1046, 1568].forEach((f, i) => later(i * 38, () => tone(f, 0.045, i % 2 ? 'triangle' : 'square', 0.018)));
      case 'expire':
        tone(520, 0.06, 'triangle', 0.014, 190);
        return tone(260, 0.07, 'square', 0.008, 130);
      case 'shield':
        tone(180, 0.08, 'sawtooth', 0.035, 70);
        tone(840, 0.08, 'square', 0.018, 360);
        return this.noise(0.12, 0.018, false, x);
      case 'laser':
        tone(1460, 0.035, 'square', 0.014, 920, 0.06);
        return this.noise(0.035, 0.008, false, x);
      case 'queenHit':
        tone(92, 0.07, 'sawtooth', 0.026, 55, 0.05);
        return tone(540, 0.035, 'square', 0.014, 360, 0.05);
    }
  }

  private pan(node: AudioNode, x?: number): void {
    const ctx = this.context!;
    if (x === undefined || !ctx.createStereoPanner) {
      node.connect(this.sfxBus!);
      return;
    }
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, ((x - LEFT) / (RIGHT - LEFT)) * 2 - 1)) * 0.7;
    node.connect(p);
    p.connect(this.sfxBus!);
  }

  private sample(name: string, x?: number, volume?: number, rate?: number): boolean {
    const buffer = this.buffers[name];
    if (!buffer) return false;
    const ctx = this.context!;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buffer;
    src.playbackRate.value = rate ?? 1 + (Math.random() * 2 - 1) * 0.03;
    gain.gain.value = volume ?? SAMPLE_GAIN[name] ?? 0.7;
    src.connect(gain);
    this.pan(gain, x);
    src.start();
    return true;
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, end?: number, x?: number, detune?: number): void {
    const ctx = this.context!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    if (detune) freq *= 1 + (Math.random() * 2 - 1) * detune;
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime;
    if (end) {
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + dur);
    }
    g.gain.setValueAtTime(Math.min(0.14, gain * LOUDNESS), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    this.pan(g, x);
    o.start();
    o.stop(t + dur);
  }

  private noise(dur: number, gain: number, dark: boolean, x?: number): void {
    const ctx = this.context!;
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const n = Math.random() * 2 - 1;
      last = dark ? last * 0.82 + n * 0.18 : n;
      data[i] = last;
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    const loud = Math.min(0.14, Math.max(0.0002, gain * LOUDNESS));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(loud, t + 0.006);
    g.gain.setValueAtTime(loud, t + Math.max(0.008, dur * 0.35));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.buffer = buffer;
    src.connect(g);
    this.pan(g, x);
    src.start();
    src.stop(t + dur);
  }
}
