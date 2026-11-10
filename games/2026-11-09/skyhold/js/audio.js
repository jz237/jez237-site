// Audio: every sample except the cabinet layer (below) is an ElevenLabs render (made by scripts/skyhold/gen_audio.py + process_audio.py, see
// scripts/skyhold/AUDIO.md). Effects are positioned in 3D (Web Audio panners with the listener on the camera) so the
// beam, the alien machines and the explosions sit where they happen; the gunship turbine, the lifters' tractor hum,
// the carrier drone and the per-planet ambient beds are seamless loops (thrust, liftloop, bossloop, amb_<planet>).
// A third layer, the CABINET SOUNDS (Options), plays the sound effects of the 1980 arcade cabinet this genre comes
// from, rendered from its sound ROM (audio/cabinet/, copied from the site's arcade cabinet exhibit, see manifest.json
// there). Like the cabinet's one-channel sound board, a cabinet sound cuts off the one before unless that one ranks higher.
// The colony-command voice ducks the music and only one line plays at a time. Music loops with a crossfade; clear and
// over are one-shot stings. (js/chip.js adds a live-synthesised retro layer on top.)
import { Chip } from './chip.js?v=26';

const SFX = ['beam', 'beamhit', 'pop', 'boomS', 'boomM', 'boomL', 'debris', 'warpin', 'grab', 'distress', 'fuse', 'fall', 'catch', 'land', 'lost',
  'mine', 'minebeep', 'hivepop', 'swarm', 'prowler', 'bolt', 'tell', 'nova', 'blink', 'blinkin', 'shieldhit', 'death', 'spawn', 'pickup', 'pwend',
  'life', 'alarm', 'bossroar', 'bosshit', 'nodebreak', 'bossbeam', 'colonyfall', 'waveclear', 'tally', 'upgrade', 'medal', 'uimove', 'uiok', 'uiback', 'rewind',
  'thrust', 'liftloop', 'bossloop', 'amb_verdant', 'amb_dune', 'amb_frost', 'amb_cinder', 'amb_umbra'];
const VOICE = ['begin', 's2', 's3', 's4', 's5', 'boss', 'bossdown', 'clear', 'lastlife', 'gameover', 'newrecord', 'champion', 'colonyfall', 'saved',
  'endless', 'partner', 'replay', 'lifted'];
const MUSIC = new Set(['title', 's1', 's2', 's3', 's4', 's5', 'boss', 'clear', 'over']);  // clear, over: stings
// tracks with intensity layers (music/drums_<t>.mp3, music/lead_<t>.mp3: the same length as the track and on its beat,
// made by scripts/skyhold/process_layers.py). These loop natively, in step, instead of crossfading copies.
const LAYERED = new Set(['s1', 's2', 's3', 's4', 's5', 'boss']);
// the decoded loop without the encoder's leading and trailing silence (some browsers keep it), as [start, end] seconds
function body(b) {
  const d = b.getChannelData(0), n = d.length, e = 1e-6;
  let i = 0, j = n - 1;
  while (i < 4096 && Math.abs(d[i]) < e) i++;
  while (j > n - 4096 && Math.abs(d[j]) < e) j--;
  return [i / b.sampleRate, (j + 1) / b.sampleRate];
}
const V = '?v=26';
// the cabinet layer: file names in audio/cabinet/ and how they rank (higher cuts off lower; lower waits, so is dropped)
const CAB = { fire: 1, explosion: 2, swarmer: 2, mutant: 3, bomber: 3, pod: 3, abduct: 4, fall: 4, credit: 4, catch: 5, delivery: 5,
  extra: 6, hyperspace: 6, bomb: 7, death: 8, planet: 9, start: 9, thrust: 0 };
const CAB_GAIN = 0.2;   // the cabinet's square waves run about 14 dB hotter than our samples

export class Audio {
  constructor(base) {
    this.base = base;
    this.ctx = null;
    this.buf = new Map();
    this.vol = { master: 0.9, music: 0.5, sfx: 0.9, voice: 1 };
    this.music = null; this.musicName = null;
    this.speaking = 0; this.voiceQ = []; this.lastPlay = new Map();
    this.rate = 1; this.loading = null; this.loops = new Map(); this.beds = new Map(); this.chip = null; this.retroOn = true; this.retroVol = 0.55;
    this.cabOn = true; this.cabCh = null; this.layersOn = true; this.layerK = [0, 0];
  }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -12; this.comp.ratio.value = 4; this.comp.attack.value = 0.004; this.comp.release.value = 0.22;
    this.master.connect(this.comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicFilter = ctx.createBiquadFilter(); this.musicFilter.type = 'lowpass'; this.musicFilter.frequency.value = 20000;
    this.duck = ctx.createGain();
    this.musicBus.connect(this.musicFilter).connect(this.duck).connect(this.master);
    this.sfxBus = ctx.createGain(); this.sfxBus.connect(this.master);
    this.voiceBus = ctx.createGain(); this.voiceBus.connect(this.master);
    // the retro layer: crunchy synthesised blips of our own design on top of the samples (Options: RETRO SOUNDS)
    this.chipBus = ctx.createGain(); this.chipBus.gain.value = this.retroVol; this.chipBus.connect(this.sfxBus);
    this.chip = new Chip(ctx, this.chipBus);
    this.cabBus = ctx.createGain(); this.cabBus.gain.value = this.cabOn ? CAB_GAIN : 0; this.cabBus.connect(this.sfxBus);
    this.applyVolumes();
    this.loading = this.loadAll();
  }
  applyVolumes() {
    if (!this.ctx) return;
    this.master.gain.value = this.vol.master; this.musicBus.gain.value = this.vol.music;
    this.sfxBus.gain.value = this.vol.sfx; this.voiceBus.gain.value = this.vol.voice;
  }
  async load(name, url) {
    if (this.buf.has(name)) return this.buf.get(name);
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const b = await this.ctx.decodeAudioData(await r.arrayBuffer());
      this.buf.set(name, b);
      return b;
    } catch { return null; }
  }
  async loadAll() {
    const jobs = [];
    for (const n of SFX) jobs.push([n, `${this.base}audio/${n}.mp3${V}`]);
    for (const n of VOICE) jobs.push(['v_' + n, `${this.base}voice/v_${n}.mp3${V}`]);
    for (const n of Object.keys(CAB)) jobs.push(['cab_' + n, `${this.base}audio/cabinet/${n}.wav${V}`]);
    let i = 0;
    const worker = async () => { while (i < jobs.length) { const j = jobs[i++]; await this.load(j[0], j[1]); } };
    await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  }

  // the listener rides on the camera
  setListener(cam) {
    if (!this.ctx) return;
    const L = this.ctx.listener, p = cam.position, t = this.ctx.currentTime;
    const f = _f.set(0, 0, -1).applyQuaternion(cam.quaternion), u = _u.set(0, 1, 0).applyQuaternion(cam.quaternion);
    if (L.positionX) {
      L.positionX.setTargetAtTime(p.x, t, 0.03); L.positionY.setTargetAtTime(p.y, t, 0.03); L.positionZ.setTargetAtTime(p.z, t, 0.03);
      L.forwardX.value = f.x; L.forwardY.value = f.y; L.forwardZ.value = f.z; L.upX.value = u.x; L.upY.value = u.y; L.upZ.value = u.z;
    } else { L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z); }
  }
  panner(x, y, z) {
    const p = this.ctx.createPanner();
    p.panningModel = 'equalpower'; p.distanceModel = 'inverse'; p.refDistance = 34; p.rolloffFactor = 1.1; p.maxDistance = 500;
    if (p.positionX) { p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z || 0; } else p.setPosition(x, y, z || 0);
    return p;
  }

  // o: { x, y, z } position, vol, rate, vary, gap, loop, bus
  play(name, o = {}) {
    if (!this.ctx) return null;
    const b = this.buf.get(name);
    if (!b) return null;
    const now = this.ctx.currentTime;
    const gap = o.gap ?? 0.03, last = this.lastPlay.get(name) || 0;
    if (now - last < gap) return null;
    this.lastPlay.set(name, now);
    const src = this.ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = (o.rate ?? 1) * (1 + (Math.random() - 0.5) * (o.vary ?? 0.08)) * (o.noSlow ? 1 : this.rate);
    const g = this.ctx.createGain();
    g.gain.value = o.vol ?? 1;
    let node = src.connect(g);
    let pan = null;
    if (o.x !== undefined && Number.isFinite(o.x) && Number.isFinite(o.y ?? 1) && Number.isFinite(o.z ?? 0)) { pan = this.panner(o.x, o.y ?? 1, o.z ?? 0); node = node.connect(pan); }
    node.connect(o.bus === 'voice' ? this.voiceBus : o.bus === 'cab' ? this.cabBus : this.sfxBus);
    if (o.loop) src.loop = true;
    src.start(now + (o.delay || 0));
    return { src, gain: g, pan };
  }
  // a positioned loop that can be moved and re-pitched every frame
  loop(key, name, vol = 0.4, bus) {
    if (!this.ctx) return null;
    let h = this.loops.get(key);
    if (h) return h;
    h = this.play(name, { loop: true, vol: 0, vary: 0, gap: 0, x: 0, y: 0, z: 0, bus });
    if (!h) return null;
    h.base = vol;
    this.loops.set(key, h);
    return h;
  }
  setLoop(key, x, y, z, vol, rate) {
    const h = this.loops.get(key);
    if (!h) return;
    const t = this.ctx.currentTime;
    h.gain.gain.setTargetAtTime(vol * h.base, t, 0.08);
    if (rate) h.src.playbackRate.setTargetAtTime(rate * this.rate, t, 0.1);
    if (h.pan.positionX) { h.pan.positionX.setTargetAtTime(x, t, 0.03); h.pan.positionY.setTargetAtTime(y, t, 0.03); h.pan.positionZ.setTargetAtTime(z, t, 0.03); }
  }
  stopLoops() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const h of this.loops.values()) { h.gain.gain.setTargetAtTime(0, t, 0.1); h.src.stop(t + 0.5); }
    this.loops.clear();
  }

  // narration: one line at a time, music ducks underneath
  say(name, o = {}) {
    if (!this.ctx || !this.buf.has(name)) return false;
    const now = this.ctx.currentTime;
    if (this.speaking > now + 0.1) { if (o.priority) this.voiceQ = [{ name, o }]; return false; }
    const b = this.buf.get(name), start = now + (o.delay || 0);
    this.line = this.play(name, { bus: 'voice', vary: 0, noSlow: true, vol: o.vol ?? 1, gap: 0, delay: o.delay });
    this.speaking = start + b.duration;
    const d = this.duck.gain;
    d.cancelScheduledValues(now);
    d.setTargetAtTime(0.42, start, 0.05);
    d.setTargetAtTime(1, this.speaking + 0.1, 0.25);
    clearTimeout(this.qTimer);
    this.qTimer = setTimeout(() => { const n = this.voiceQ.shift(); if (n) this.say(n.name, n.o); }, (this.speaking - now) * 1000 + 120);
    return true;
  }
  hush() {
    this.voiceQ = []; clearTimeout(this.qTimer);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try { if (this.line) this.line.src.stop(); } catch { /* ended */ }
    this.line = null; this.speaking = 0;
    this.duck.gain.cancelScheduledValues(now); this.duck.gain.setTargetAtTime(1, now, 0.2);
  }

  async playMusic(name, fade = 1.5) {
    if (!this.ctx || this.musicName === name) return;
    this.musicName = name;
    if (LAYERED.has(name)) return this.playLayered(name, fade);
    const b = await this.load('music_' + name, `${this.base}music/${name}.mp3${V}`);
    if (!b || this.musicName !== name) return;
    this.stopMusic(fade);
    const m = { name, b, voices: [], stop: false };
    this.music = m;
    const XF = 3;
    const schedule = (when) => {
      if (m.stop) return;
      const src = this.ctx.createBufferSource();
      src.buffer = b; src.playbackRate.value = this.rate;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(1, when + (m.voices.length ? XF : fade));
      src.connect(g).connect(this.musicBus);
      src.start(when);
      const dur = b.duration / this.rate;
      g.gain.setValueAtTime(1, when + dur - XF);
      g.gain.linearRampToValueAtTime(0, when + dur);
      src.stop(when + dur + 0.1);
      m.voices.push({ src, g });
      if (m.voices.length > 3) m.voices.shift();
      m.timer = setTimeout(() => schedule(when + dur - XF), Math.max(0, (when + dur - XF - this.ctx.currentTime - 1) * 1000));
    };
    schedule(this.ctx.currentTime + 0.05);
  }
  // a layered track: the track and its two layers start on the same sample and loop natively, so they stay in step
  // (slow motion changes all their rates together). The layers start silent; setLayers() fades them.
  async playLayered(name, fade) {
    const get = (n) => this.load('music_' + n, `${this.base}music/${n}.mp3${V}`);
    // keep only this track's layers decoded (each is ~40 MB of PCM); very low-memory devices skip them
    for (const k of [...this.buf.keys()]) if (/^music_(drums|lead)_/.test(k) && !k.endsWith('_' + name)) this.buf.delete(k);
    const lay = this.layersOn && !(navigator.deviceMemory && navigator.deviceMemory <= 2);
    const [b, bd, bl] = await Promise.all([get(name), lay ? get('drums_' + name) : null, lay ? get('lead_' + name) : null]);
    if (!b || this.musicName !== name) return;
    this.stopMusic(fade);
    const m = { name, b, voices: [], layers: [], stop: false };
    this.music = m;
    const when = this.ctx.currentTime + 0.08;
    const start = (buf, gain, ramp) => {
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const [a, e] = body(buf); src.loopStart = a; src.loopEnd = e;
      src.playbackRate.value = this.rate;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, when);
      if (ramp) g.gain.linearRampToValueAtTime(gain, when + fade);
      src.connect(g).connect(this.musicBus);
      src.start(when, a);
      return { src, g };
    };
    m.voices.push(start(b, 1, true));
    // both layers must be the track's own length, or they would drift out of step: skip any that is not
    const okLen = (x) => x && Math.abs((body(x)[1] - body(x)[0]) - (body(b)[1] - body(b)[0])) < 0.01;
    for (const [x, k] of [[bd, 'drums'], [bl, 'lead']]) if (okLen(x)) { const v = start(x, 0, false); v.k = k; m.layers.push(v); m.voices.push(v); }
    this.setLayers(this.layerK[0], this.layerK[1], true);
  }
  // intensity layers 0..1 (drums, lead)
  setLayers(d, l, snap) {
    this.layerK = [d, l];
    const m = this.music;
    if (!this.ctx || !m || !m.layers) return;
    const t = this.ctx.currentTime, on = this.layersOn ? 1 : 0;
    for (const v of m.layers) {
      const want = (v.k === 'drums' ? d * 0.95 : l * 0.8) * on;
      if (snap) v.g.gain.setTargetAtTime(want, t + 0.1, 0.05); else v.g.gain.setTargetAtTime(want, t, 0.25);
    }
  }
  setLayersOn(on) { this.layersOn = !!on; this.setLayers(this.layerK[0], this.layerK[1]); }
  stopMusic(fade = 1) {
    const m = this.music;
    if (!m) return;
    m.stop = true; clearTimeout(m.timer);
    const now = this.ctx.currentTime;
    for (const v of m.voices) {
      try { v.g.gain.cancelScheduledValues(now); v.g.gain.setValueAtTime(v.g.gain.value, now); v.g.gain.linearRampToValueAtTime(0, now + fade); v.src.stop(now + fade + 0.05); } catch { /* stopped */ }
    }
    this.music = null;
    if (!fade) this.musicName = null;
  }
  sting(name) {
    if (!this.ctx) return;
    this.musicName = null;
    this.stopMusic(0.6);
    this.load('music_' + name, `${this.base}music/${name}.mp3${V}`).then((b) => {
      if (!b) return;
      const src = this.ctx.createBufferSource(); src.buffer = b;
      src.connect(this.musicBus); src.start();
    });
  }
  setRate(r) {
    if (!this.ctx || Math.abs(r - this.rate) < 0.01) return;
    this.rate = r;
    const now = this.ctx.currentTime;
    if (this.music) for (const v of this.music.voices) v.src.playbackRate.setTargetAtTime(r, now, 0.12);
    this.musicFilter.frequency.setTargetAtTime(r < 0.9 ? 900 + r * 3000 : 20000, now, 0.1);
  }
  // a retro blip (o: { vol, pan, rate }); x, the sim position, pans it left / right of the listener when given
  retro(name, o = {}) { if (!this.retroOn || !this.chip) return; try { this.chip.play(name, o); } catch { /* never let a blip break play */ } }
  setRetro(on) { this.retroOn = !!on; }
  // a cabinet sound (o: { vol, pan -1..1, rate, gap }): one channel, ranked like the cabinet's sound board
  cab(name, o = {}) {
    if (!this.cabOn || !this.ctx) return;
    const b = this.buf.get('cab_' + name);
    if (!b) return;
    const now = this.ctx.currentTime, pr = CAB[name] ?? 1, c = this.cabCh, busy = c && now < c.end;
    if (busy && pr < c.pr) return;
    if (c && c.name === name && now - c.t < (o.gap ?? 0.04)) return;
    if (busy) { try { c.g.gain.setTargetAtTime(0, now, 0.003); c.src.stop(now + 0.02); } catch { /* ended */ } }
    try {
      const src = this.ctx.createBufferSource(); src.buffer = b;
      const rate = (o.rate ?? 1) * this.rate; src.playbackRate.value = rate;
      const g = this.ctx.createGain(); g.gain.value = o.vol ?? 1;
      let node = src.connect(g);
      if (o.pan && this.ctx.createStereoPanner) { const p = this.ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, o.pan * 0.6)); node = node.connect(p); }
      node.connect(this.cabBus);
      src.start(now);
      this.cabCh = { name, pr, t: now, end: now + b.duration / rate, src, g };
    } catch { /* never let a cabinet sound break play */ }
  }
  setCab(on) { this.cabOn = !!on; if (this.ctx) this.cabBus.gain.setTargetAtTime(on ? CAB_GAIN : 0, this.ctx.currentTime, 0.05); }
  // a non-positional ambient bed (planet ambience) whose level is driven every frame
  bed(key, name) {
    if (!this.ctx) return null;
    let h = this.beds.get(key);
    if (h) return h;
    const b = this.buf.get(name);
    if (!b) return null;
    const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true;
    const g = this.ctx.createGain(); g.gain.value = 0;
    src.connect(g).connect(this.sfxBus);
    src.start(this.ctx.currentTime, Math.random() * b.duration);
    h = { src, gain: g };
    this.beds.set(key, h);
    return h;
  }
  setBed(key, name, vol, rate = 1) {
    const h = this.bed(key, name);
    if (!h) return;
    const t = this.ctx.currentTime;
    h.gain.gain.setTargetAtTime(vol, t, 0.4);
    h.src.playbackRate.setTargetAtTime(rate * this.rate, t, 0.3);
  }
  muffle(on) { if (this.ctx) this.musicFilter.frequency.setTargetAtTime(on ? 700 : 20000, this.ctx.currentTime, 0.15); }
}
const _f = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }, applyQuaternion(q) { const { x, y, z } = this, qx = q.x, qy = q.y, qz = q.z, qw = q.w; const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z; this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy; this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz; this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx; return this; } };
const _u = { ..._f };
_u.set = _f.set; _u.applyQuaternion = _f.applyQuaternion;
