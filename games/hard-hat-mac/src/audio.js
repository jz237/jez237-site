// Web Audio engine: buffered SFX/voice/ambience, streamed crossfading music, positional panning.
import * as THREE from 'three';
import { settings, clamp } from './util.js';

const BASE = './assets/audio/';
const SFX = ['step_steel_a', 'step_steel_b', 'step_dirt', 'step_wood', 'jump', 'land', 'ladder', 'pickup', 'place', 'rivet', 'rivet_done', 'bolt_fall', 'clink',
  'stomp', 'dizzy', 'splat', 'zap', 'steam', 'press', 'sizzle', 'lunchbox', 'coffee', 'hardhat', 'extra_life', 'tick', 'ui_click', 'ui_confirm', 'spring',
  'wrecking', 'firework', 'cheer', 'yank', 'ding', 'gust', 'crate_drop', 'hopper', 'magnet', 'flag', 'timeup', 'elevator_loop', 'conveyor_loop', 'crane_loop',
  'dog_bark', 'dog_whine', 'swing', 'bonk', 'ko_bell', 'shove', 'pile_driver', 'pump_on', 'valve', 'splash', 'gull', 'gull_dive', 'boat_horn',
  'crumble', 'debris', 'unbolt', 'scrap_drop', 'thunder', 'lightning_charge', 'switch_on', 'medal', 'skyline', 'coop_join', 'water_loop'];
const VOICE = ['fm_l1', 'fm_l2', 'fm_l3', 'fm_l4', 'fm_clear1', 'fm_clear2', 'fm_hurry', 'fm_gameover', 'fm_round', 'fm_topped', 'mac_whoa', 'mac_yeah', 'mac_gotit',
  'mac_oof', 'mac_heave', 'vd_laugh', 'vd_taunt', 'vd_ow', 'in_cite', 'in_halt', 'an_title', 'an_go', 'an_gameover', 'an_record', 'in_ow', 'mac_take', 'mac_lights', 'fm_demo',
  'fm_l5', 'fm_l6', 'fm_l7', 'fm_l8', 'fm_coop', 'mac_shove', 'an_newbest'];
const LINES = {
  fm_l1: 'Foreman: "Mornin\', Mac! Four girders need settin\' on the frame. Drop \'em in the gaps and rivet \'em tight!"',
  fm_l2: 'Foreman: "Crane yard, Mac. The crew left their lunchboxes all over the site. Round up all five!"',
  fm_l3: 'Foreman: "Night shift at the mill. Load four crates into the hopper, and stay clear of the hot stuff!"',
  fm_l4: 'Foreman: "Topping out! Forty floors up. Set the last beams and raise the flag. Hold onto that hat!"',
  fm_l5: 'Foreman: "Down in the pit, Mac! The storm flooded the foundation. Get four pumps runnin\' before the water swallows the job!"',
  fm_l6: 'Foreman: "River span today. Set the deck girders across the bridge and rivet \'em down. And watch those gulls, they bite!"',
  fm_l7: 'Foreman: "Wreckin\' crew, Mac. Unbolt four old beams and haul \'em to the scrap bin. Keep off the cracked floors!"',
  fm_l8: 'Foreman: "Storm\'s rollin\' in! Light up the warning beacons on the frame before the lightning finds ya!"',
  fm_coop: 'Foreman: "Two of ya? Good. Double the hands, half the excuses!"', mac_shove: 'Mac: "Outta my way!"',
  fm_clear1: 'Foreman: "That\'s how it\'s done, Mac!"', fm_clear2: 'Foreman: "Shift complete. Nice work!"', fm_hurry: 'Foreman: "Clock\'s runnin\' out, Mac! Move it!"',
  fm_gameover: 'Foreman: "That\'s a wrap, Mac. Go home and get some rest."', fm_round: 'Foreman: "New round, Mac. They\'re gettin\' faster!"', fm_topped: 'Foreman: "We topped out! Drinks are on me tonight!"',
  vd_taunt: 'Vandal: "Catch me if you can, hard hat!"', vd_laugh: 'Vandal: (snickers)', vd_ow: 'Vandal: "Ow! Hey!"',
  in_cite: 'Inspector: "Citation! Safety violation!"', in_ow: 'Inspector: "Ow! That’s going in my report!"', fm_demo: 'Foreman: "Watch close, kid. This is how a pro works the site."', in_halt: 'Inspector: "Hold it right there!"', dog_bark: 'Yard dog: (barks)',
};
// Wordless vocal effort sounds: SFX, not speech. They stay when narration is off, but are rate-limited.
const GRUNTS = new Set(['mac_whoa', 'mac_oof', 'mac_heave', 'vd_laugh']);
// Speech gate (same policy in every jez237 game): one line at a time, SPEECH_GAP seconds of real time of
// quiet after any line before a routine line may play and ROUTINE_GAP s between routine lines; key lines skip
// both gaps but wait (up to KEY_WAIT s) for the current line instead of overlapping it; no back-to-back repeats;
// routine quips are chance-gated, at most QUIPS_PER_SHIFT per shift and each line once per shift.
// Settings > Voice & narration OFF = no spoken lines at all.
const SPEECH_GAP = 24, ROUTINE_GAP = 150, KEY_WAIT = 6, QUIPS_PER_SHIFT = 1, GRUNT_GAP = 3;

export class AudioEngine {
  constructor() {
    this.buf = new Map(); this.motors = new Map(); this.ready = false; this.ctx = null;
    this.listener = new THREE.Vector3(); this.right = new THREE.Vector3(1, 0, 0); this.ear = new THREE.Vector3();
    this.music = { els: [], cur: -1, name: null }; this.amb = null; this.ducks = 0; this.captionFn = null;
    this.sp = { busyUntil: 0, lastEnd: -1e9, lastRoutine: -1e9, last: null, recent: [], heard: new Set(), shift: new Set(), quips: 0, cur: null, pendT: 0, gruntT: {}, gruntAny: -1e9 };
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
  // Legacy entry point: dog sounds stay SFX, grunts go to grunt(), anything worded goes through the gate as a routine line.
  voice(name, vol = 1, pos = null) {
    if (name === 'dog_bark' || name === 'dog_whine') { const src = this.play(name, { pos, vol, range: 30 }); if (src && this.captionFn && LINES[name]) this.captionFn(LINES[name]); return src; }
    if (GRUNTS.has(name)) return this.grunt(name, vol, pos);
    return this.say(name, { vol, pos });
  }
  // A worded line through the speech gate. names: one clip or variants (a recent one is avoided).
  // o: { vol, pos, key (big moment: skips the gap, waits instead of overlapping), once (once per page visit),
  //      quip (routine: counts toward the per-shift budget, once per shift per line), chance, when () => still wanted? }
  say(names, o = {}) {
    if (settings.narration === false) return null;
    const S = this.sp, now = performance.now() / 1000;
    let list = (Array.isArray(names) ? names : [names]).filter(n => n !== S.last && !(o.once && S.heard.has(n)) && !(o.quip && S.shift.has(n)));
    if (list.length > 1) { const fresh = list.filter(n => !S.recent.includes(n)); if (fresh.length) list = fresh; }
    if (!list.length) return null;
    const name = list[Math.floor(Math.random() * list.length)];
    if (!o.key) {
      if (o.quip && S.quips >= QUIPS_PER_SHIFT) return null;
      if (now < S.busyUntil || now - S.lastEnd < SPEECH_GAP || now - S.lastRoutine < ROUTINE_GAP) return null;
      if (o.chance != null && Math.random() >= o.chance) return null;
    } else if (now < S.busyUntil) {
      const wait = S.busyUntil - now + .4;
      if (wait > KEY_WAIT) return null;
      clearTimeout(S.pendT); S.pendT = setTimeout(() => this.say(name, o), wait * 1000);
      return null;
    }
    if (o.when && !o.when()) return null;
    const src = this.play(name, { bus: 'voice', vol: o.vol ?? 1, pos: o.pos || null, range: 40 });
    if (!src) return null;
    const end = now + src.buffer.duration;
    S.busyUntil = end; S.lastEnd = end; S.last = name; S.recent = [name, ...S.recent].slice(0, 4);
    S.heard.add(name); S.shift.add(name); if (o.quip) S.quips++; if (!o.key) S.lastRoutine = now;
    S.cur = src; src.addEventListener('ended', () => { if (S.cur === src) S.cur = null; });
    if (this.captionFn && LINES[name]) this.captionFn(LINES[name]);
    if (name.startsWith('fm_')) { this.ducks++; this.applyVolumes(); src.addEventListener('ended', () => { this.ducks--; this.applyVolumes(); }); }
    return src;
  }
  // Wordless effort sound (oof, heave, scream, snicker): never under a spoken line, per-sound gap + a short shared gap.
  grunt(name, vol = 1, pos = null, { chance = 1, gap = 8 } = {}) {
    const S = this.sp, now = performance.now() / 1000;
    if (now < S.busyUntil || now - (S.gruntT[name] ?? -1e9) < gap || now - S.gruntAny < GRUNT_GAP) return null;
    if (chance < 1 && Math.random() >= chance) return null;
    const src = this.play(name, { bus: 'voice', vol, pos, range: 40 });
    if (src) { S.gruntT[name] = S.gruntAny = now; if (this.captionFn && LINES[name]) this.captionFn(LINES[name]); }
    return src;
  }
  heard(name) { return this.sp.heard.has(name); }
  newShift() { this.sp.shift.clear(); this.sp.quips = 0; }
  stopSpeech() {
    const S = this.sp; clearTimeout(S.pendT);
    if (S.cur) { try { S.cur.stop(); } catch {} S.cur = null; }
    S.busyUntil = 0;
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
