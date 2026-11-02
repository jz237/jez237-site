// Web Audio engine: buffered SFX/voice/ambience, streamed crossfading music, positional panning.
import * as THREE from 'three';
import { settings, clamp } from './util.js';

const BASE = './assets/audio/';
const SFX = ['step_steel_a', 'step_steel_b', 'step_dirt', 'step_wood', 'jump', 'land', 'ladder', 'pickup', 'place', 'rivet', 'rivet_done', 'bolt_fall', 'clink',
  'stomp', 'dizzy', 'splat', 'zap', 'steam', 'press', 'sizzle', 'lunchbox', 'coffee', 'hardhat', 'extra_life', 'tick', 'ui_click', 'ui_confirm', 'spring',
  'wrecking', 'firework', 'cheer', 'yank', 'ding', 'gust', 'crate_drop', 'hopper', 'magnet', 'flag', 'timeup', 'elevator_loop', 'conveyor_loop', 'crane_loop',
  'dog_bark', 'dog_whine'];
const VOICE = ['fm_l1', 'fm_l2', 'fm_l3', 'fm_l4', 'fm_clear1', 'fm_clear2', 'fm_hurry', 'fm_gameover', 'fm_round', 'fm_topped', 'mac_whoa', 'mac_yeah', 'mac_gotit',
  'mac_oof', 'mac_heave', 'vd_laugh', 'vd_taunt', 'vd_ow', 'in_cite', 'in_halt', 'an_title', 'an_go', 'an_gameover', 'an_record'];
const LINES = {
  fm_l1: 'Foreman: "Mornin\', Mac! Four girders need settin\' on the frame. Drop \'em in the gaps and rivet \'em tight!"',
  fm_l2: 'Foreman: "Crane yard, Mac. The crew left their lunchboxes all over the site. Round up all five!"',
  fm_l3: 'Foreman: "Night shift at the mill. Load four crates into the hopper, and stay clear of the hot stuff!"',
  fm_l4: 'Foreman: "Topping out! Forty floors up. Set the last beams and raise the flag. Hold onto that hat!"',
  fm_clear1: 'Foreman: "That\'s how it\'s done, Mac!"', fm_clear2: 'Foreman: "Shift complete. Nice work!"', fm_hurry: 'Foreman: "Clock\'s runnin\' out, Mac! Move it!"',
  fm_gameover: 'Foreman: "That\'s a wrap, Mac. Go home and get some rest."', fm_round: 'Foreman: "New round, Mac. They\'re gettin\' faster!"', fm_topped: 'Foreman: "We topped out! Drinks are on me tonight!"',
  vd_taunt: 'Vandal: "Catch me if you can, hard hat!"', vd_laugh: 'Vandal: (snickers)', vd_ow: 'Vandal: "Ow! Hey!"',
  in_cite: 'Inspector: "Citation! Safety violation!"', in_halt: 'Inspector: "Hold it right there!"', dog_bark: 'Yard dog: (barks)',
};

export class AudioEngine {
  constructor() {
    this.buf = new Map(); this.motors = new Map(); this.ready = false; this.ctx = null;
    this.listener = new THREE.Vector3(); this.right = new THREE.Vector3(1, 0, 0); this.ear = new THREE.Vector3();
    this.music = { els: [], cur: -1, name: null }; this.amb = null; this.ducks = 0; this.captionFn = null;
  }
  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain(); this.master.connect(ctx.destination);
    this.comp = ctx.createDynamicsCompressor(); this.comp.threshold.value = -10; this.comp.ratio.value = 4; this.comp.connect(this.master);
    for (const k of ['sfxBus', 'voiceBus', 'ambBus', 'musBus']) { this[k] = ctx.createGain(); this[k].connect(k === 'musBus' ? this.master : this.comp); }
    this.applyVolumes();
  }
  applyVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, m = settings.muted ? 0 : 1;
    this.master.gain.setTargetAtTime(m, t, .05);
    this.sfxBus.gain.setTargetAtTime(settings.sfx, t, .05); this.voiceBus.gain.setTargetAtTime(settings.voice * 1.1, t, .05);
    this.ambBus.gain.setTargetAtTime(settings.sfx * .55, t, .05); this.musBus.gain.setTargetAtTime(settings.music * .55 * (this.ducks > 0 ? .4 : 1), t, .15);
  }
  async load(onProgress) {
    this.ensure(); if (!this.ctx) return;
    const names = [...SFX, ...VOICE]; let done = 0;
    await Promise.all(names.map(async n => {
      try {
        const r = await fetch(BASE + n + '.mp3'); if (!r.ok) throw 0;
        const ab = await r.arrayBuffer(); this.buf.set(n, await this.ctx.decodeAudioData(ab));
      } catch { /* missing clip: stay silent */ }
      onProgress && onProgress(++done / names.length);
    }));
    this.ready = true;
  }
  async loadOne(n) {
    if (this.buf.has(n) || !this.ctx) return this.buf.get(n);
    try { const r = await fetch(BASE + n + '.mp3'); const b = await this.ctx.decodeAudioData(await r.arrayBuffer()); this.buf.set(n, b); return b; } catch { return null; }
  }
  unlock() { this.ensure(); if (this.ctx && this.ctx.state !== 'running') this.ctx.resume(); }
  setListener(earPos, camRight) { this.ear.copy(earPos); this.right.copy(camRight).setY(0).normalize(); }
  spatial(pos, range = 28) {
    if (!pos) return [1, 0];
    const dx = pos.x - this.ear.x, dy = pos.y - this.ear.y, dz = pos.z - this.ear.z, d = Math.hypot(dx, dy * 1.3, dz);
    const g = d > range ? 0 : 1 / (1 + (d / (range * .28)) ** 2);
    const pan = d > .5 ? clamp((dx * this.right.x + dz * this.right.z) / d, -1, 1) * .75 : 0;
    return [g, pan];
  }
  play(name, o = {}) {
    if (!this.ctx || this.ctx.state !== 'running') return null;
    const b = this.buf.get(name); if (!b) return null;
    const [g, pan] = this.spatial(o.pos, o.range); if (g < .01) return null;
    const src = this.ctx.createBufferSource(); src.buffer = b; src.playbackRate.value = o.rate || 1;
    const gain = this.ctx.createGain(); gain.gain.value = (o.vol ?? 1) * g;
    const p = this.ctx.createStereoPanner(); p.pan.value = pan;
    src.connect(gain).connect(p).connect(o.bus === 'voice' ? this.voiceBus : this.sfxBus); src.start();
    return src;
  }
  voice(name, vol = 1, pos = null) {
    if (this.captionFn && LINES[name]) this.captionFn(LINES[name]);
    if (name === 'dog_bark' || name === 'dog_whine') return this.play(name, { pos, vol, range: 30 });
    const src = this.play(name, { bus: 'voice', vol, pos, range: 40 });
    if (src && name.startsWith('fm_')) { this.ducks++; this.applyVolumes(); src.onended = () => { this.ducks--; this.applyVolumes(); }; }
    return src;
  }
  // Persistent positional loop owned by an object (elevator, crane...). vol 0 fades it out.
  motor(name, owner, pos, vol, rate = 1) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    let m = this.motors.get(owner);
    const [g, pan] = this.spatial(pos, 26);
    const target = vol * g;
    if (!m) {
      if (target < .005) return;
      const b = this.buf.get(name); if (!b) return;
      const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true; src.playbackRate.value = rate;
      const gain = this.ctx.createGain(); gain.gain.value = 0; const p = this.ctx.createStereoPanner();
      src.connect(gain).connect(p).connect(this.sfxBus); src.start(0, Math.random() * b.duration);
      m = { src, gain, p }; this.motors.set(owner, m);
    }
    const t = this.ctx.currentTime;
    m.gain.gain.setTargetAtTime(target, t, .12); m.p.pan.setTargetAtTime(pan, t, .1);
    if (target < .002 && vol === 0) { m.gain.gain.setTargetAtTime(0, t, .1); const mm = m; setTimeout(() => { try { mm.src.stop(); } catch {} }, 600); this.motors.delete(owner); }
  }
  stopMotors() { for (const m of this.motors.values()) { try { m.src.stop(); } catch {} } this.motors.clear(); }
  async ambience(name) {
    if (!this.ctx) return;
    if (this.amb && this.amb.name === name) return;
    const old = this.amb; this.amb = null;
    if (old) { old.g.gain.setTargetAtTime(0, this.ctx.currentTime, .5); setTimeout(() => { try { old.src.stop(); } catch {} }, 2500); }
    if (!name) return;
    const b = await this.loadOne(name); if (!b) return;
    const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true;
    const g = this.ctx.createGain(); g.gain.value = 0; src.connect(g).connect(this.ambBus); src.start();
    g.gain.setTargetAtTime(1, this.ctx.currentTime, 1.2);
    this.amb = { name, src, g };
  }
  // ---- music: two streamed <audio> elements crossfading at the loop point
  playMusic(name, { loop = true, fade = 1.5 } = {}) {
    if (!this.ctx) return;
    const M = this.music;
    if (M.name === name && loop) return;
    this.stopMusic(fade);
    M.name = name; M.loop = loop;
    this.startTrack(name, fade);
  }
  startTrack(name, fade) {
    const M = this.music, el = new Audio(BASE + name + '.mp3'); el.crossOrigin = 'anonymous'; el.preload = 'auto';
    const node = this.ctx.createMediaElementSource(el), g = this.ctx.createGain(); g.gain.value = 0;
    node.connect(g).connect(this.musBus);
    const tr = { el, g, name, started: false, xf: false };
    el.play().then(() => { tr.started = true; g.gain.setTargetAtTime(1, this.ctx.currentTime, fade / 3); }).catch(() => {});
    M.els.push(tr);
    return tr;
  }
  stopMusic(fade = 1) {
    if (!this.ctx) return;
    const M = this.music;
    for (const tr of M.els) { tr.g.gain.setTargetAtTime(0, this.ctx.currentTime, fade / 3); const t = tr; setTimeout(() => { t.el.pause(); t.el.src = ''; }, fade * 1000 + 300); }
    M.els = []; M.name = null;
  }
  update() {
    const M = this.music; if (!this.ctx || !M.name || !M.loop) return;
    const cur = M.els[M.els.length - 1];
    if (cur && cur.started && !cur.xf && cur.el.duration && cur.el.currentTime > cur.el.duration - 4.5) {
      cur.xf = true; cur.g.gain.setTargetAtTime(0, this.ctx.currentTime, 1.3);
      setTimeout(() => { cur.el.pause(); cur.el.src = ''; M.els = M.els.filter(t => t !== cur); }, 5000);
      this.startTrack(M.name, 3);
    }
  }
  sting(name) { this.stopMusic(.6); const tr = this.startTrack(name, .2); this.music.name = name; this.music.loop = false; return tr; }
}
