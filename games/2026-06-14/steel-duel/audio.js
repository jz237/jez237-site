/* Steel Duel — WebAudio engine over the ElevenLabs bank in audio/: panned SFX, announcer (radio EQ, ducks the
   music), crossfading music loops, engine/tread loops, synth fallbacks while samples load. window.SDAudio */
(function () {
  'use strict';
  const BASE = 'audio/';
  const SFX = {
    cannon: ['cannon1', 'cannon2', 'cannon3'], hit: ['hit1', 'hit2', 'hit3'], wall: ['wall1', 'wall2'], wallbreak: ['wallbreak'],
    explode: ['explode1', 'explode2'], mine: ['mine1', 'mine2'], ricochet: ['ricochet1', 'ricochet2'], flak: ['flak'],
    bosshorn: ['bosshorn'], klaxon: ['klaxon'], pickup: ['pickup'], shield: ['shield'], repair: ['repair'], ui: ['ui'],
    victory: ['victory'], defeat: ['defeat'], whoosh: ['whoosh'],
  };
  const VO = ['title', 'ready', 'fight', 'wave1', 'wave2', 'wave3', 'waveclear', 'levelclear', 'boss', 'bastion', 'mauler', 'warlord', 'bossdown',
    'phase', 'flank', 'tankdown', 'lastlife', 'extralife', 'double', 'triple', 'rampage', 'p1scores', 'p2scores', 'teamscores', 'enemyscores',
    '20s', '10s', 'p1wins', 'p2wins', 'youwin', 'cpuwins', 'draw', 'teamwins', 'gameover', 'complete', 'shield', 'repair', 'rapid', 'mine'];
  const MUSIC = { menu: 'music_menu.mp3', battle: 'music_battle.mp3', boss: 'music_boss.mp3' };

  let ctx = null, master = null, sfxBus = null, musicBus = null, voiceBus = null, duck = null;
  let muted = false, musicOn = true, loadStarted = false;
  const buf = {}, cursor = {}, lastPlay = {};
  let engine = null, treads = null, engineGain = null, treadGain = null;
  let voQueue = [], voPlaying = null, voUntil = 0;
  let mTrack = null, mWant = null, mCur = null, mLoading = {};

  function ensure() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 0.85; master.connect(ctx.destination);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
      sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(comp); comp.connect(master);
      duck = ctx.createGain(); duck.gain.value = 1; duck.connect(master);
      musicBus = ctx.createGain(); musicBus.gain.value = musicOn ? 0.36 : 0; musicBus.connect(duck);
      // announcer: radio-ish band + presence, then its own bus
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 170;
      const pres = ctx.createBiquadFilter(); pres.type = 'peaking'; pres.frequency.value = 2600; pres.gain.value = 4; pres.Q.value = 0.8;
      voiceBus = ctx.createGain(); voiceBus.gain.value = 1.0;
      hp.connect(pres); pres.connect(voiceBus); voiceBus.connect(master); voiceBus.input = hp;
      load();
    } catch (e) { ctx = null; }
    return ctx;
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function fetchBuf(name, file) {
    return fetch(BASE + file).then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status))))
      .then(a => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej))).then(b => { buf[name] = b; return b; }).catch(() => null);
  }
  function load() {
    if (!ctx || loadStarted) return; loadStarted = true;
    const jobs = [];
    for (const k of Object.keys(SFX)) for (const n of SFX[k]) jobs.push([n, n + '.mp3']);
    for (const v of VO) jobs.push(['vo_' + v, 'vo_' + v + '.mp3']);
    jobs.push(['engine', 'engine.wav'], ['treads', 'treads.wav']);
    let i = 0;
    const next = () => { if (i >= jobs.length) return; const [n, f] = jobs[i++]; fetchBuf(n, f).then(next); };
    for (let k = 0; k < 6; k++) next();
  }

  /* ---- synth fallbacks (also used for tiny UI blips) ---- */
  function tone(freq, dur, type, gain, slideTo, when) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime + (when || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain || 0.2, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, gain, freq, type) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime, n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ctx.createBufferSource(); s.buffer = b; const f = ctx.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq || 1200;
    const g = ctx.createGain(); g.gain.value = gain || 0.3; s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t);
  }
  const FALLBACK = {
    cannon() { tone(620, 0.12, 'square', 0.18, 180); noise(0.08, 0.14, 2200); },
    hit() { noise(0.06, 0.22, 3600, 'highpass'); tone(260, 0.07, 'square', 0.11, 140); },
    wall() { noise(0.09, 0.18, 500); tone(120, 0.08, 'sine', 0.12, 70); },
    wallbreak() { noise(0.4, 0.3, 600); },
    explode() { noise(0.5, 0.5, 900); tone(90, 0.5, 'sawtooth', 0.3, 30); },
    mine() { noise(0.45, 0.55, 2600, 'highpass'); tone(70, 0.45, 'sawtooth', 0.3, 28); },
    ricochet() { tone(2400, 0.18, 'triangle', 0.12, 900); },
    flak() { noise(0.12, 0.2, 2400, 'bandpass'); },
    pickup() { [660, 880, 1320].forEach((f, i) => tone(f, 0.09, 'triangle', 0.16, 0, i * 0.06)); },
    victory() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.2, 0, i * 0.13)); },
    defeat() { [440, 349, 294, 220].forEach((f, i) => tone(f, 0.26, 'triangle', 0.2, 0, i * 0.15)); },
  };

  /* ---- sample playback ---- */
  function play(kind, o) {
    o = o || {};
    if (!ensure() || muted) return;
    const names = SFX[kind] || [kind], loaded = names.filter(n => buf[n]);
    if (!loaded.length) { const f = FALLBACK[kind] || FALLBACK[kind.replace(/\d+$/, '')]; if (f) f(); return; }
    const now = ctx.currentTime;
    if (o.minGap && lastPlay[kind] && now - lastPlay[kind] < o.minGap) return;
    lastPlay[kind] = now;
    const n = loaded[(cursor[kind] = ((cursor[kind] || 0) + 1 + (Math.random() < 0.4 ? 1 : 0)) % loaded.length)];
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf[n]; s.playbackRate.value = (o.rate || 1) * (o.vary === false ? 1 : 0.95 + Math.random() * 0.1);
    g.gain.value = o.gain == null ? 0.8 : o.gain;
    let node = g;
    if (o.pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-0.9, Math.min(0.9, o.pan)); g.connect(p); node = p; }
    if (o.lowpass) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lowpass; node.connect(f); node = f; }
    s.connect(g); node.connect(sfxBus); s.start(now + (o.delay || 0));
  }

  /* ---- announcer ---- */
  function say(line, prio) {
    if (!ensure() || muted) return;
    prio = prio || 1;
    const key = 'vo_' + line;
    if (!buf[key]) return;
    const now = ctx.currentTime;
    if (voPlaying && now < voUntil) {
      if (prio >= 3) { try { voPlaying.stop(); } catch (e) {} voQueue = []; }
      else { if (voQueue.length < 2 && !voQueue.includes(line)) voQueue.push(line); return; }
    }
    const s = ctx.createBufferSource(); s.buffer = buf[key]; s.connect(voiceBus.input);
    s.start(now); voPlaying = s; voUntil = now + buf[key].duration;
    duck.gain.cancelScheduledValues(now); duck.gain.setTargetAtTime(0.45, now, 0.05); duck.gain.setTargetAtTime(1, voUntil, 0.35);
    s.onended = () => { if (voPlaying === s) { voPlaying = null; const nx = voQueue.shift(); if (nx) say(nx, 2); } };
  }

  /* ---- music: crossfaded loops ---- */
  function startTrack(name) {
    const b = buf['music_' + name]; if (!b) return;
    const now = ctx.currentTime, s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = b; g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(1, now + 1.6);
    s.connect(g); g.connect(musicBus); s.start(now, 0.05);
    if (mCur) fadeOut(mCur, 1.6);
    mCur = { s, g, name, started: now, dur: b.duration - 0.05 };
  }
  function fadeOut(m, t) { const now = ctx.currentTime; m.g.gain.cancelScheduledValues(now); m.g.gain.setValueAtTime(m.g.gain.value, now); m.g.gain.linearRampToValueAtTime(0, now + t); try { m.s.stop(now + t + 0.05); } catch (e) {} }
  function music(name) {
    mWant = name || null;
    if (!ensure()) return;
    if (!mWant) { if (mCur) { fadeOut(mCur, 1.2); mCur = null; } return; }
    if (mCur && mCur.name === mWant) return;
    if (buf['music_' + mWant]) { startTrack(mWant); return; }
    if (!mLoading[mWant]) { const want = mWant; mLoading[want] = fetchBuf('music_' + want, MUSIC[want]).then(() => { if (mWant === want && (!mCur || mCur.name !== want)) startTrack(want); }); }
  }
  function tickMusic() {
    if (!ctx || !mCur || !mWant) return;
    if (ctx.currentTime - mCur.started > mCur.dur - 3.2 && mCur.name === mWant) startTrack(mWant);   // overlap the loop seam
  }

  /* ---- engine + treads ---- */
  function loopSrc(name, gainNode) {
    const s = ctx.createBufferSource(); s.buffer = buf[name]; s.loop = true; s.connect(gainNode); s.start(); return s;
  }
  function engineLevel(level, motion) {
    if (!ensure()) return;
    if (!engineGain) { engineGain = ctx.createGain(); engineGain.gain.value = 0; engineGain.connect(sfxBus); treadGain = ctx.createGain(); treadGain.gain.value = 0; treadGain.connect(sfxBus); }
    if (!engine && buf.engine) engine = loopSrc('engine', engineGain);
    if (!treads && buf.treads) treads = loopSrc('treads', treadGain);
    const now = ctx.currentTime, l = muted ? 0 : Math.max(0, Math.min(1, level)), m = muted ? 0 : Math.max(0, Math.min(1, motion == null ? level : motion));
    engineGain.gain.setTargetAtTime(l > 0 ? 0.08 + l * 0.16 : 0, now, 0.15);
    treadGain.gain.setTargetAtTime(m * 0.2, now, 0.1);
    if (engine) engine.playbackRate.setTargetAtTime(0.82 + m * 0.36, now, 0.2);
    if (treads) treads.playbackRate.setTargetAtTime(0.75 + m * 0.4, now, 0.2);
  }

  const SDAudio = {
    init() { ensure(); resume(); },
    resume,
    setMuted(b) { muted = !!b; if (master) master.gain.value = muted ? 0 : 0.85; if (muted) engineLevel(0, 0); },
    isMuted() { return muted; },
    setMusic(on) { musicOn = !!on; if (musicBus) musicBus.gain.value = musicOn ? 0.36 : 0; },
    get musicOn() { return musicOn; },
    play, say, music, tick() { tickMusic(); },
    engine(level, motion) { if (ctx) engineLevel(level, motion); },
    loaded() { return Object.keys(buf).length; },
    get context() { return ctx; },
    // legacy one-shots (kept for callers outside the event path)
    fire() { play('cannon', { gain: 0.6 }); }, tankHit() { play('hit', { gain: 0.75 }); }, wall() { play('wall', { gain: 0.5 }); },
    explosion() { play('explode', { gain: 0.9 }); }, mine() { play('mine', { gain: 1 }); },
    start() { [330, 440, 554, 660].forEach((f, i) => tone(f, 0.14, 'triangle', 0.12, 0, i * 0.09)); },
    roundEnd() { [660, 554, 440, 294].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, 0, i * 0.13)); },
    ui() { if (buf.ui) play('ui', { gain: 0.35, vary: false }); else tone(440, 0.05, 'square', 0.08); },
    point() { tone(880, 0.1, 'square', 0.1, 1320); },
    blip(f) { tone(f || 880, 0.08, 'square', 0.1); },
  };
  window.SDAudio = SDAudio;
})();
