/* Shard Assault : audio.js
 * Web Audio engine. Produced, original ElevenLabs material (SFX variants, footsteps,
 * loops, per-world ambience beds, music, announcer VO) with WebAudio synth fallbacks
 * for anything that fails to load. Sounds are placed in space relative to the camera
 * (stereo pan + distance gain/low-pass), sent to a per-world synthetic reverb, and
 * muffled while the trooper is underwater.
 */
(function (root, factory) { root.TAudio = factory(); })(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const A = 'assets/audio/', AV = '?v=sa2'; // AV: bump when audio files are replaced in place (cache bust)
  const VIEW_W = 640, VIEW_H = 360;
  const LOOP_PAD = 0.1;     // produced loops carry 0.1 s of wrap-around pre/post roll

  // ---- produced sample banks ---------------------------------------------
  function v(base, n) { const out = []; for (let i = 0; i < n; i++) out.push(A + 'sfx/' + base + '-' + i + '.mp3'); return out; }
  const BANK = {
    shoot: v('shoot', 4), shootb: v('shootb', 4), beamon: v('beamon', 1), hit: v('hit', 4),
    explode: v('explode-s', 2).concat(v('explode-m', 2)),
    'explode-small': v('explode-s', 2), 'explode-medium': v('explode-m', 2), 'explode-large': v('explode-l', 2),
    crate: v('crate', 2), eshoot: v('eshoot', 4), flame: v('flame', 2), hatch: v('hatch', 2),
    stomp: v('stomp', 2), dash: v('dash', 2), spawn: v('spawn', 2), warning: v('warning', 1),
    tele: v('tele', 2), coreopen: v('coreopen', 1), clink: v('clink', 4), bosshit: v('bosshit', 4),
    bossdie: v('bossdie', 2), phase: v('phase', 2), morph: v('morph', 2), splash: v('splash', 2),
    drip: v('drip', 3), plip: v('plip', 2), stroke: v('stroke', 3),
    jump: v('jump', 4), land: v('land', 4), line: v('line', 2), checkpoint: v('checkpoint', 1),
    gem: v('gem', 4), power: v('power', 2), die: v('die', 2), bomb: v('bomb', 2), tick: v('tick', 1),
    'boss-warden': v('boss-warden', 1), 'boss-maw': v('boss-maw', 1), 'boss-gunship': v('boss-gunship', 1),
    'boss-colossus': v('boss-colossus', 1), 'boss-queen': v('boss-queen', 1), 'boss-machine': v('boss-machine', 1),
    'title-impact': v('title-impact', 1),
    'ui-move': v('ui-move', 1), 'ui-select': v('ui-select', 1), 'ui-back': v('ui-back', 1), 'ui-start': v('ui-start', 1),
    // produced musical stings (kept from the previous score)
    complete: [A + 'sfx/sfx-complete.mp3'], victory: [A + 'sfx/sfx-victory.mp3'], gameover: [A + 'sfx/sfx-gameover.mp3'],
  };
  const STEPS = { rock: v('step-rock', 4), wet: v('step-wet', 4), metal: v('step-metal', 4), organic: v('step-organic', 4) };
  const LOOPS = { beam: A + 'sfx/loop-beam.mp3', engine: A + 'sfx/loop-engine.mp3', roll: A + 'sfx/loop-roll.mp3', heart: A + 'sfx/loop-heart.mp3',
    lap: A + 'sfx/loop-lap.mp3', under: A + 'sfx/loop-under.mp3' };
  const AMB = { 1: A + 'amb/amb-world1.mp3', 2: A + 'amb/amb-world2.mp3', 3: A + 'amb/amb-world3.mp3', 4: A + 'amb/amb-world4.mp3', 5: A + 'amb/amb-world5.mp3' };
  const AMB_GAIN = { 1: 0.8, 2: 0.9, 3: 0.7, 4: 0.75, 5: 0.9 };
  const SURFACE = { 1: 'rock', 2: 'wet', 3: null, 4: 'metal', 5: 'organic' };
  // per-variant level trims (dB) that even out loudness inside a family
  const TRIM_DB = { 'bosshit-2': 2.4, 'clink-0': 2.4, 'explode-m-0': -2.6, 'explode-m-1': 2.6, 'explode-s-0': 2.0,
    'explode-s-1': -2.0, 'hatch-0': 2.1, 'hatch-1': -2.2, 'hit-0': -1.5, 'land-0': 2.9, 'land-3': -2.4, 'phase-0': 2.5,
    'phase-1': -2.5, 'shoot-0': 1.6, 'shoot-1': 3.5, 'shoot-2': -1.8, 'shoot-3': -1.6, 'step-organic-3': 1.8, 'step-wet-0': 4.3 };
  function trimGain(url) {
    const m = /\/([a-z0-9-]+)\.mp3$/.exec(url); const db = m ? TRIM_DB[m[1]] : 0;
    return db ? Math.pow(10, db / 20) : 1;
  }
  // per-name playback: gain, pitch spread, max simultaneous voices, min retrigger gap (s), np = non-positional
  const DEF = {
    shoot: { gain: 0.5, pitch: 0.07, max: 3, gap: 0.045 }, shootb: { gain: 0.6, pitch: 0.07, max: 3, gap: 0.06 },
    beamon: { gain: 0.55, pitch: 0.04, max: 1, gap: 0.2 }, hit: { gain: 0.85, pitch: 0.08, max: 2, gap: 0.08 },
    explode: { gain: 0.8, pitch: 0.1, max: 4, gap: 0.04 }, 'explode-small': { gain: 0.8, pitch: 0.1, max: 4, gap: 0.04 },
    'explode-medium': { gain: 0.85, pitch: 0.08, max: 3, gap: 0.05 }, 'explode-large': { gain: 0.95, pitch: 0.06, max: 2, gap: 0.12 },
    crate: { gain: 0.7, pitch: 0.08, max: 2, gap: 0.05 }, eshoot: { gain: 0.45, pitch: 0.1, max: 4, gap: 0.05 },
    flame: { gain: 0.6, pitch: 0.06, max: 2, gap: 0.1 }, hatch: { gain: 0.7, pitch: 0.08, max: 2, gap: 0.08 },
    stomp: { gain: 1.0, pitch: 0.05, max: 2, gap: 0.15 }, dash: { gain: 0.85, pitch: 0.05, max: 1, gap: 0.2 },
    spawn: { gain: 0.75, pitch: 0.06, max: 2, gap: 0.15 }, warning: { gain: 0.8, max: 1, gap: 1.0, np: true },
    tele: { gain: 0.6, pitch: 0.05, max: 1, gap: 0.2 }, coreopen: { gain: 0.75, max: 1, gap: 0.3 },
    clink: { gain: 0.45, pitch: 0.12, max: 3, gap: 0.05 }, bosshit: { gain: 0.6, pitch: 0.1, max: 3, gap: 0.045 },
    bossdie: { gain: 1.0, max: 1, gap: 1.0 }, phase: { gain: 0.9, pitch: 0.04, max: 1, gap: 0.4 },
    morph: { gain: 0.6, pitch: 0.05, max: 1, gap: 0.08 }, splash: { gain: 0.7, pitch: 0.08, max: 2, gap: 0.1 },
    drip: { gain: 0.42, pitch: 0.12, max: 3, gap: 0.12 }, plip: { gain: 0.4, pitch: 0.12, max: 3, gap: 0.05 },
    stroke: { gain: 0.38, pitch: 0.1, max: 2, gap: 0.22 },
    jump: { gain: 0.5, pitch: 0.08, max: 1, gap: 0.06 }, land: { gain: 0.7, pitch: 0.08, max: 1, gap: 0.08 },
    line: { gain: 0.85, pitch: 0.04, max: 2, gap: 0.15 }, checkpoint: { gain: 0.7, max: 1, gap: 0.5, np: true },
    gem: { gain: 0.45, pitch: 0.04, max: 3, gap: 0.035 }, power: { gain: 0.75, max: 1, gap: 0.15, np: true },
    die: { gain: 1.0, max: 1, gap: 0.5 }, bomb: { gain: 1.0, max: 1, gap: 0.3, np: true },
    tick: { gain: 0.5, max: 1, gap: 0.3, np: true },
    'boss-warden': { gain: 0.95, max: 1, gap: 1 }, 'boss-maw': { gain: 0.95, max: 1, gap: 1 },
    'boss-gunship': { gain: 0.95, max: 1, gap: 1 }, 'boss-colossus': { gain: 0.95, max: 1, gap: 1 },
    'boss-queen': { gain: 0.95, max: 1, gap: 1 }, 'boss-machine': { gain: 1.0, max: 1, gap: 1 },
    'title-impact': { gain: 0.9, max: 1, gap: 0.5, ui: true },
    'ui-move': { gain: 0.6, max: 2, gap: 0.03, ui: true }, 'ui-select': { gain: 0.7, max: 2, gap: 0.05, ui: true },
    'ui-back': { gain: 0.65, max: 2, gap: 0.05, ui: true }, 'ui-start': { gain: 0.85, max: 1, gap: 0.3, ui: true },
    complete: { gain: 0.95, max: 1, gap: 0.5, ui: true }, victory: { gain: 1.0, max: 1, gap: 0.5, ui: true },
    gameover: { gain: 0.95, max: 1, gap: 0.5, ui: true },
  };
  // per-world synthetic reverb: tail length, wet level, brightness, pre-delay, extras
  const REV = {
    1: { dur: 0.9, wet: 0.16, lp: 7000, pre: 0.012, echo: [0.19, 0.22] },   // open mesa air + canyon slap
    2: { dur: 3.4, wet: 0.36, lp: 4500, pre: 0.025 },                       // flooded caverns: large, wet
    3: { dur: 1.5, wet: 0.2, lp: 6500, pre: 0.015, echo: [0.26, 0.15] },     // rift: medium + wall echo
    4: { dur: 2.0, wet: 0.26, lp: 8000, pre: 0.01, metal: true },            // foundry: metallic ring
    5: { dur: 4.8, wet: 0.32, lp: 2600, pre: 0.04, swell: 0.08 },            // spire: dark, long, blooming
  };

  function createAudio() {
    let ctx = null, master = null, limiter = null, musicGain = null, sfxGain = null;
    let musicWarmth = null, musicComp = null, musicDelay = null, delaySend = null;
    let sfxComp = null, sfxLevel = null, uiLevel = null, uiBus = null, worldBus = null, ambBus = null, muffle = null, revIn = null;
    let musicBase = 0.34, sfxBase = 0.55;
    let musicOn = true, sfxOn = true, muted = false, paused = false;
    let seq = null, seqTimer = null, curWorld = 1;
    let synthOut = null;            // temporary positional destination for synth fallbacks
    let pannerOK = false;
    // produced-music streamed layer -> musicGain
    let streamGain = null, curSource = null, curStreamKey = null, loadToken = 0;
    const musicBuffers = {};
    const bufs = {};                // url -> AudioBuffer | 'loading' | 'error'
    const waiters = {};
    let sfxPreloaded = false;

    function ensure() {
      if (ctx) return;
      const AC = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
      if (!AC) return;
      ctx = new AC();
      pannerOK = typeof ctx.createStereoPanner === 'function';
      limiter = ctx.createDynamicsCompressor();           // brick-wall safety on the sum
      limiter.threshold.value = -1.5; limiter.knee.value = 0; limiter.ratio.value = 20;
      limiter.attack.value = 0.002; limiter.release.value = 0.12; limiter.connect(ctx.destination);
      master = ctx.createGain(); master.gain.value = 0.85; master.connect(limiter);
      // glue/limiter so stacked voices never clip
      musicComp = ctx.createDynamicsCompressor();
      musicComp.threshold.value = -13; musicComp.knee.value = 24; musicComp.ratio.value = 3.2;
      musicComp.attack.value = 0.004; musicComp.release.value = 0.18;
      musicComp.connect(master);
      // music bus: musicGain -> warmth lowpass -> comp, with a tempo-synced delay send
      musicGain = ctx.createGain(); musicGain.gain.value = musicBase;
      musicWarmth = ctx.createBiquadFilter(); musicWarmth.type = 'lowpass';
      musicWarmth.frequency.value = 13000; musicWarmth.Q.value = 0.4;
      musicGain.connect(musicWarmth); musicWarmth.connect(musicComp);
      musicDelay = ctx.createDelay(1.0); musicDelay.delayTime.value = 0.28;
      const dfb = ctx.createGain(); dfb.gain.value = 0.32;
      delaySend = ctx.createGain(); delaySend.gain.value = 1;
      delaySend.connect(musicDelay); musicDelay.connect(dfb); dfb.connect(musicDelay);
      const dwet = ctx.createGain(); dwet.gain.value = 0.5; musicDelay.connect(dwet); dwet.connect(musicComp);
      streamGain = ctx.createGain(); streamGain.gain.value = 1; streamGain.connect(musicGain);
      // SFX graph: voices -> worldBus (+ reverb send) -> muffle -> sfxLevel -> sfxComp -> master
      sfxComp = ctx.createDynamicsCompressor();
      sfxComp.threshold.value = -10; sfxComp.knee.value = 10; sfxComp.ratio.value = 4;
      sfxComp.attack.value = 0.003; sfxComp.release.value = 0.15; sfxComp.connect(master);
      sfxLevel = ctx.createGain(); sfxLevel.gain.value = sfxBase; sfxLevel.connect(sfxComp);
      muffle = ctx.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 20000; muffle.Q.value = 0.7;
      muffle.connect(sfxLevel);
      worldBus = ctx.createGain(); worldBus.gain.value = 1; worldBus.connect(muffle);
      ambBus = ctx.createGain(); ambBus.gain.value = 1; ambBus.connect(muffle);
      revIn = ctx.createGain(); revIn.gain.value = 1;
      uiLevel = ctx.createGain(); uiLevel.gain.value = sfxBase; uiLevel.connect(sfxComp);
      uiBus = ctx.createGain(); uiBus.gain.value = 1; uiBus.connect(uiLevel);
      sfxGain = worldBus;                                  // synth fallbacks land on the world bus
      setReverb(1);
    }

    // ---- buffer loading ----------------------------------------------------
    function loadBuf(url, cb) {
      if (!ctx || !url) { if (cb) cb(null); return; }
      const b = bufs[url];
      if (b && b !== 'loading') { if (cb) cb(b === 'error' ? null : b); return; }
      if (cb) (waiters[url] || (waiters[url] = [])).push(cb);
      if (b === 'loading') return;
      bufs[url] = 'loading';
      const done = (val) => { bufs[url] = val; const w = waiters[url]; delete waiters[url]; if (w) for (const f of w) f(val === 'error' ? null : val); };
      fetch(url + AV).then((r) => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => done(buf)).catch(() => done('error'));
    }
    function ready(url) { const b = bufs[url]; return b && b !== 'loading' && b !== 'error' ? b : null; }
    // small queue so the common sounds decode first and requests don't flood the host
    const preloadQueue = []; let preloadActive = 0;
    function queueLoad(url) { if (bufs[url] === undefined && preloadQueue.indexOf(url) < 0) preloadQueue.push(url); pumpQueue(); }
    function pumpQueue() {
      while (ctx && preloadActive < 6 && preloadQueue.length) {
        const url = preloadQueue.shift(); if (bufs[url] !== undefined) continue;
        preloadActive++; loadBuf(url, () => { preloadActive--; pumpQueue(); });
      }
    }
    const PRELOAD_ORDER = ['shoot', 'shootb', 'hit', 'explode', 'eshoot', 'jump', 'land', 'gem', 'clink', 'bosshit', 'power', 'die',
      'beamon', 'crate', 'morph', 'splash', 'line', 'bomb', 'checkpoint', 'ui-move', 'ui-select', 'ui-back', 'ui-start',
      'flame', 'hatch', 'stomp', 'dash', 'spawn', 'warning', 'tele', 'coreopen', 'phase', 'bossdie', 'tick', 'complete'];
    function preloadSfx() {
      if (sfxPreloaded || !ctx) return; sfxPreloaded = true;
      for (const k of PRELOAD_ORDER) for (const u of BANK[k]) queueLoad(u);
      for (const k in LOOPS) queueLoad(LOOPS[k]);
      for (const s in STEPS) for (const u of STEPS[s]) queueLoad(u);
      for (const k in BANK) for (const u of BANK[k]) queueLoad(u);
    }

    // ---- rich subtractive synth voice (music fallback) -----------------------
    function synth(freq, t, dur, o) {
      if (!ctx || muted) return;
      o = o || {};
      const vol = o.vol != null ? o.vol : 0.2;
      const a = o.a != null ? o.a : 0.01, d = o.d != null ? o.d : 0.08;
      const sus = o.s != null ? o.s : 0.6, rel = o.r != null ? o.r : 0.12;
      const hold = Math.max(a + d, dur);
      const amp = ctx.createGain(); amp.gain.setValueAtTime(0.0001, t);
      amp.gain.linearRampToValueAtTime(vol, t + a);
      amp.gain.linearRampToValueAtTime(Math.max(0.0002, vol * sus), t + a + d);
      amp.gain.setValueAtTime(Math.max(0.0002, vol * sus), t + hold);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + hold + rel);
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.Q.value = o.q || 1;
      const ff = o.ff || 4000, ft = o.ft != null ? o.ft : ff;
      flt.frequency.setValueAtTime(ff, t);
      if (ft !== ff) flt.frequency.exponentialRampToValueAtTime(Math.max(80, ft), t + a + d);
      amp.connect(flt); flt.connect(o.dest || musicGain);
      if (o.send && delaySend) { const sg = ctx.createGain(); sg.gain.value = o.send; flt.connect(sg); sg.connect(delaySend); }
      const voices = o.voices || 1; const oscs = [];
      for (let vv = 0; vv < voices; vv++) {
        const osc = ctx.createOscillator(); osc.type = o.type || 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t + dur);
        osc.detune.setValueAtTime(voices === 1 ? 0 : (vv / (voices - 1) - 0.5) * 2 * (o.detune || 8), t);
        osc.connect(amp); osc.start(t); osc.stop(t + hold + rel + 0.03); oscs.push(osc);
      }
      if (o.vib) {
        const lfo = ctx.createOscillator(); lfo.frequency.value = o.vibRate || 5.5;
        const lg = ctx.createGain(); lg.gain.value = o.vib; lfo.connect(lg);
        for (const osc of oscs) lg.connect(osc.detune);
        lfo.start(t); lfo.stop(t + hold + rel + 0.03);
      }
    }
    function noiseBurst(t, dur, vol, ftype, ffreq, q, dest) {
      if (!ctx || muted) return;
      const len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate); const dt = buf.getChannelData(0);
      for (let i = 0; i < len; i++) dt[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.value = ffreq; if (q) f.Q.value = q;
      const g = ctx.createGain(); g.gain.value = vol;
      src.connect(f); f.connect(g); g.connect(dest || musicGain); src.start(t); src.stop(t + dur + 0.02);
    }
    function drum(ch, t) {
      if (!ctx || muted) return;
      if (ch === 'k') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(165, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.11);
        g.gain.setValueAtTime(0.95, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + 0.2);
        noiseBurst(t, 0.012, 0.3, 'highpass', 3200);
      } else if (ch === 's') {
        noiseBurst(t, 0.15, 0.5, 'bandpass', 1800, 1.1);
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.1);
        g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + 0.13);
      } else if (ch === 'h') { noiseBurst(t, 0.03, 0.2, 'highpass', 8500); }
      else if (ch === 'H') { noiseBurst(t, 0.14, 0.16, 'highpass', 7200); }
    }
    function resume() { ensure(); if (ctx && ctx.state === 'suspended') ctx.resume(); preloadSfx(); }

    // ---- one-shot synth voices (fallback SFX) --------------------------------
    function blip(freq, dur, type, vol, slideTo, dest, when) {
      if (!ctx || muted) return;
      const t0 = when != null ? when : ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(dest || synthOut || sfxGain); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    function noise(dur, vol, filterFreq) {
      if (!ctx || muted) return;
      const n = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterFreq || 1200;
      const g = ctx.createGain(); g.gain.value = vol || 0.3;
      src.connect(f); f.connect(g); g.connect(synthOut || sfxGain); src.start();
    }
    const SFX = {
      shoot: () => blip(680, 0.08, 'square', 0.16, 340),
      shootb: () => blip(340, 0.11, 'triangle', 0.2, 520),
      eshoot: () => blip(300, 0.12, 'sawtooth', 0.14, 160),
      beam: () => blip(900 + Math.random() * 200, 0.05, 'sawtooth', 0.06, 700),
      beamon: () => blip(500, 0.18, 'sawtooth', 0.12, 1100),
      jump: () => blip(320, 0.16, 'square', 0.2, 640),
      morph: () => { blip(200, 0.2, 'sawtooth', 0.2, 900); noise(0.15, 0.1, 2000); },
      explode: () => { noise(0.35, 0.4, 900); blip(120, 0.3, 'sawtooth', 0.2, 40); },
      'explode-small': () => { noise(0.25, 0.35, 1200); blip(140, 0.2, 'sawtooth', 0.18, 50); },
      'explode-medium': () => { noise(0.4, 0.4, 900); blip(110, 0.35, 'sawtooth', 0.2, 40); },
      'explode-large': () => { noise(0.8, 0.5, 600); blip(80, 0.7, 'sawtooth', 0.28, 28); },
      hit: () => blip(160, 0.2, 'square', 0.25, 60),
      gem: () => blip(1200, 0.09, 'sine', 0.18, 1600),
      power: () => { blip(600, 0.1, 'square', 0.2, 900); setTimeout(() => blip(900, 0.12, 'square', 0.2, 1300), 90); },
      die: () => { blip(400, 0.6, 'sawtooth', 0.3, 60); noise(0.5, 0.3, 600); },
      bomb: () => { noise(0.6, 0.5, 1600); blip(80, 0.5, 'sawtooth', 0.3, 30); },
      line: () => blip(500, 0.25, 'sawtooth', 0.2, 1200),
      complete: () => [0, 1, 2, 3].forEach((i) => setTimeout(() => blip([523, 659, 784, 1047][i], 0.2, 'square', 0.22, 0, uiBus), i * 120)),
      gameover: () => [0, 1, 2].forEach((i) => setTimeout(() => blip([392, 330, 262][i], 0.4, 'sawtooth', 0.25, 0, uiBus), i * 220)),
      crate: () => { noise(0.14, 0.22, 2200); blip(360, 0.08, 'square', 0.14, 140); },
      flame: () => noise(0.3, 0.2, 900),
      splash: () => { noise(0.25, 0.3, 1400); blip(300, 0.15, 'sine', 0.12, 90); },
      land: () => { noise(0.12, 0.25, 480); blip(90, 0.1, 'sine', 0.18, 55); },
      step: () => { noise(0.06, 0.12, 700); },
      tick: () => blip(1050, 0.07, 'square', 0.15, 900),
      checkpoint: () => [0, 1].forEach((i) => setTimeout(() => blip(700 + i * 260, 0.14, 'square', 0.2), i * 100)),
      hatch: () => { blip(900, 0.12, 'sine', 0.15, 300); noise(0.1, 0.15, 3000); },
      warning: () => [0, 1, 2, 3].forEach((i) => setTimeout(() => blip(i % 2 ? 620 : 470, 0.22, 'sawtooth', 0.3), i * 240)),
      tele: () => blip(180, 0.3, 'sawtooth', 0.18, 420),
      stomp: () => { noise(0.3, 0.5, 500); blip(70, 0.35, 'sine', 0.4, 34); },
      dash: () => blip(240, 0.35, 'sawtooth', 0.22, 700),
      spawn: () => { blip(520, 0.2, 'square', 0.18, 260); noise(0.12, 0.12, 3000); },
      clink: () => blip(1500 + Math.random() * 500, 0.04, 'square', 0.08, 900),
      bosshit: () => { blip(300, 0.09, 'square', 0.22, 140); noise(0.06, 0.12, 2400); },
      coreopen: () => [0, 1].forEach((i) => setTimeout(() => blip(880 + i * 220, 0.14, 'sine', 0.2), i * 90)),
      phase: () => { noise(0.5, 0.45, 1100); blip(200, 0.5, 'sawtooth', 0.3, 60); },
      bossdie: () => { noise(0.9, 0.6, 700); [0, 1, 2, 3, 4].forEach((i) => setTimeout(() => { noise(0.4, 0.4, 900 - i * 120); blip(160 - i * 20, 0.35, 'sawtooth', 0.25, 40); }, i * 180)); },
      victory: () => [0, 1, 2, 3, 4, 5, 6].forEach((i) => setTimeout(() =>
        blip([392, 494, 587, 784, 587, 784, 988][i], i >= 5 ? 0.5 : 0.18, 'square', 0.22, 0, uiBus), i * 150)),
      'boss-warden': () => { noise(0.8, 0.4, 500); blip(90, 0.8, 'sawtooth', 0.25, 45); },
      'boss-maw': () => { noise(0.8, 0.35, 380); blip(70, 0.9, 'sawtooth', 0.25, 40); },
      'boss-gunship': () => blip(150, 0.9, 'sawtooth', 0.22, 600),
      'boss-colossus': () => { noise(0.7, 0.4, 700); blip(60, 0.9, 'square', 0.25, 40); },
      'boss-queen': () => blip(1400, 0.6, 'sawtooth', 0.18, 700),
      'boss-machine': () => { blip(55, 1.2, 'sawtooth', 0.28, 110); blip(1320, 1.0, 'sine', 0.1, 1980); },
      'title-impact': () => { noise(0.9, 0.5, 900); blip(70, 0.9, 'sine', 0.4, 35); },
      'ui-move': () => blip(1050, 0.04, 'square', 0.1, 900, uiBus),
      'ui-select': () => { blip(800, 0.07, 'square', 0.14, 0, uiBus); blip(1200, 0.09, 'square', 0.12, 0, uiBus, ctx.currentTime + 0.06); },
      'ui-back': () => blip(700, 0.1, 'square', 0.12, 420, uiBus),
      'ui-start': () => { blip(400, 0.4, 'sawtooth', 0.18, 1200, uiBus); noise(0.3, 0.12, 3000); },
    };

    // ---- listener + spatialisation -------------------------------------------
    let lx = VIEW_W / 2, ly = VIEW_H / 2, haveListener = false;
    function setListener(x, y) { lx = x; ly = y; haveListener = true; }
    function spatial(x, y, np) {
      if (np || x == null || y == null || (x === 0 && y === 0) || !haveListener || !isFinite(x) || !isFinite(y)) {
        return { pan: 0, gain: 1, lp: 0, send: 0.8 };
      }
      const dx = x - lx, dy = y - ly;
      const d = Math.sqrt(dx * dx + dy * dy * 1.56);
      const pan = Math.max(-1, Math.min(1, dx / 430)) * 0.9;     // screen edge (dx 320) ~ 0.67
      let gain = 1, lp = 0;
      if (d > 360) {                                              // beyond the visible area: fade + darken
        const k = Math.min(1, (d - 360) / 900);
        gain = (1 - k) * (1 - k); lp = 16000 * Math.pow(0.12, k);
      }
      if (gain < 0.03) return null;
      return { pan, gain, lp, send: 0.8 * (1 + Math.min(1.5, d / 600)) };
    }
    // voice output chain: gain -> [lowpass] -> [pan] -> bus (+ reverb send)
    function chain(sp, ui) {
      const g = ctx.createGain(); let node = g;
      if (sp.lp && sp.lp < 15000) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = sp.lp; node.connect(f); node = f; }
      if (pannerOK && sp.pan) { const p = ctx.createStereoPanner(); p.pan.value = sp.pan; node.connect(p); node = p; }
      node.connect(ui ? uiBus : worldBus);
      if (!ui && revIn && sp.send) { const s = ctx.createGain(); s.gain.value = sp.send; node.connect(s); s.connect(revIn); }
      return g;
    }

    // ---- produced one-shots with variants, voice limiting --------------------
    const vstate = {}; let liveVoices = [];
    let gemLast = -9, gemStep = 0, beamLast = -9, beamX = null, beamY = null;
    function pickVariant(name, urls, st) {
      let i = Math.floor(Math.random() * urls.length);
      if (urls.length > 1 && i === st.idx) i = (i + 1) % urls.length;
      for (let k = 0; k < urls.length; k++) {
        const j = (i + k) % urls.length; const b = ready(urls[j]);
        if (b) { st.idx = j; return { url: urls[j], buf: b }; }
        if (bufs[urls[j]] === undefined) loadBuf(urls[j]);
      }
      return null;
    }
    function stealVoice(vo) {
      try { vo.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.012); vo.src.stop(ctx.currentTime + 0.06); } catch (e) {}
      vo.dead = true;
    }
    function playSample(name, buf, url, sp, def, rateMul) {
      const now = ctx.currentTime;
      const src = ctx.createBufferSource(); src.buffer = buf;
      src.playbackRate.value = (1 + (Math.random() * 2 - 1) * (def.pitch || 0)) * (rateMul || 1);
      const g = chain(sp, def.ui);
      g.gain.value = (def.gain != null ? def.gain : 0.8) * trimGain(url) * sp.gain;
      src.connect(g); src.start();
      const st = vstate[name];
      const vo = { src, g, t: now, name, ui: !!def.ui };
      st.voices.push(vo); liveVoices.push(vo);
      src.onended = () => {
        vo.dead = true;
        try { src.disconnect(); g.disconnect(); } catch (e) {}
      };
      st.voices = st.voices.filter((x) => !x.dead);
      while (st.voices.length > (def.max || 4)) stealVoice(st.voices.shift());
      liveVoices = liveVoices.filter((x) => !x.dead);
      if (liveVoices.length > 40) { const old = liveVoices.find((x) => !x.ui); if (old) stealVoice(old); }
      return vo;
    }
    function play(name, x, y, opts) {
      if (!sfxOn || muted || !name) return; ensure(); if (!ctx) return;
      if (name === 'beam') { beamLast = ctx.currentTime; beamX = x; beamY = y; return; }   // loop trigger
      const def = DEF[name] || { gain: 0.8, max: 4, gap: 0.03 };
      const sp = spatial(x, y, def.np || def.ui);
      if (!sp) return;                                      // far offscreen: inaudible, skip
      const now = ctx.currentTime;
      const st = vstate[name] || (vstate[name] = { last: -9, idx: -1, voices: [] });
      if (now - st.last < (def.gap || 0)) return;
      st.last = now;
      let rateMul = opts && opts.rate ? opts.rate : 1;
      if (name === 'gem') {                                 // quick pickups climb in pitch
        gemStep = now - gemLast < 0.45 ? Math.min(gemStep + 1, 5) : 0; gemLast = now;
        rateMul *= Math.pow(2, (gemStep * 1.5) / 12);
      }
      const urls = BANK[name];
      const pick = urls ? pickVariant(name, urls, st) : null;
      if (pick) {
        const vo = playSample(name, pick.buf, pick.url, sp, def, rateMul);
        if (opts && opts.gain != null) vo.g.gain.value *= opts.gain;
        return;
      }
      const f = SFX[name]; if (!f) return;                  // synth now (permanent fallback if the file fails)
      const g = chain(sp, def.ui); g.gain.value = sp.gain;
      synthOut = g; try { f(); } finally { synthOut = null; }
    }
    function ui(name) {
      const map = { move: 'ui-move', adjust: 'ui-move', select: 'ui-select', back: 'ui-back', start: 'ui-start', title: 'title-impact' };
      const n = map[name] || ('ui-' + name);
      play(n, null, null, name === 'adjust' ? { rate: 1.22, gain: 0.85 } : null);
    }
    function bossRoar(key, x, y) { play('boss-' + key, x, y); }
    function playStep(surface, x, y, gainMul) {
      const urls = STEPS[surface]; if (!urls || !ctx || !sfxOn || muted) return;
      const sp = spatial(x, y); if (!sp) return;
      const st = vstate['step'] || (vstate['step'] = { last: -9, idx: -1, voices: [] });
      const pick = pickVariant('step', urls, st);
      const def = { gain: 0.55 * (gainMul || 1), pitch: 0.06, max: 2 };
      if (pick) { playSample('step', pick.buf, pick.url, sp, def, 1); return; }
      const g = chain(sp, false); g.gain.value = sp.gain * (gainMul || 1); synthOut = g; try { SFX.step(); } finally { synthOut = null; }
    }

    // ---- loops (beam hum, fighter engine, morph roll, heartbeat) --------------
    const loopState = {};
    function loopSet(key, on, vol, rate, x, y) {
      if (!ctx) return;
      const L = loopState[key] || (loopState[key] = { src: null, g: null, p: null, on: false, offAt: 0 });
      const now = ctx.currentTime;
      if (on && !paused && sfxOn && !muted) {
        const url = LOOPS[key]; const buf = ready(url);
        if (!buf) { if (bufs[url] === undefined) loadBuf(url); return; }
        if (!L.src) {
          const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
          const pad = Math.min(LOOP_PAD, buf.duration / 4);
          src.loopStart = pad; src.loopEnd = buf.duration - pad;
          const g = ctx.createGain(); g.gain.value = 0.0001;
          src.connect(g); let out = g;
          if (pannerOK) { L.p = ctx.createStereoPanner(); g.connect(L.p); out = L.p; } else L.p = null;
          out.connect(worldBus);
          const s = ctx.createGain(); s.gain.value = 0.5; out.connect(s); s.connect(revIn);
          src.start(now, pad + Math.random() * (src.loopEnd - pad - 0.05));
          L.src = src; L.g = g; L.s = s; L.out = out;
        }
        const sp = spatial(x, y);
        L.g.gain.setTargetAtTime(Math.max(0.0001, vol * (sp ? sp.gain : 0)), now, 0.05);
        L.src.playbackRate.setTargetAtTime(rate, now, 0.08);
        if (L.p) L.p.pan.setTargetAtTime(sp ? sp.pan : 0, now, 0.05);
        L.on = true;
      } else if (L.src) {
        if (L.on) { L.g.gain.cancelScheduledValues(now); L.g.gain.setTargetAtTime(0.0001, now, 0.05); L.on = false; L.offAt = now; }
        else if (now - L.offAt > 0.5) killLoop(L);
      }
    }
    function killLoop(L) {
      if (!L || !L.src) return;
      try { L.src.stop(); } catch (e) {}
      try { L.src.disconnect(); L.g.disconnect(); if (L.p) L.p.disconnect(); L.s.disconnect(); } catch (e) {}
      L.src = null; L.on = false;
    }
    function allLoopsOff(hard) {
      for (const k in loopState) {
        const L = loopState[k]; if (!L.src) continue;
        if (hard) killLoop(L);
        else { L.g.gain.cancelScheduledValues(ctx.currentTime); L.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05); L.on = false; L.offAt = ctx.currentTime; }
      }
    }

    // ---- per-world reverb (synthetic impulse responses) -----------------------
    const irCache = {}; let rev = null, revWorld = 0;
    function makeIR(c) {
      const sr = ctx.sampleRate, pre = Math.floor(c.pre * sr), n = pre + Math.floor(sr * c.dur);
      const ir = ctx.createBuffer(2, n, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch); let lp = 0;
        for (let i = pre; i < n; i++) {
          const t = (i - pre) / sr;
          const env = Math.exp(-6.9 * t / c.dur) * (c.swell ? Math.min(1, t / c.swell) : 1);
          const fc = c.lp * Math.exp(-1.4 * t / c.dur) + 250;          // tail darkens as it decays
          const a = Math.exp(-2 * Math.PI * fc / sr);
          lp = (1 - a) * (Math.random() * 2 - 1) + a * lp;
          d[i] = lp * env * (1 + (1 - a) * 0.5);
        }
        if (c.metal) {                                                  // inharmonic plate/pipe ring
          const fr = [431, 689, 1130, 1873, 2711];
          for (const f of fr) {
            const ph = Math.random() * 6.283, w = 2 * Math.PI * f / sr, dk = 5.5 / (c.dur * sr);
            for (let i = pre; i < n; i++) { const k = i - pre; d[i] += 0.035 * Math.sin(w * k + ph) * Math.exp(-dk * k); }
          }
        }
        if (c.echo) {                                                   // discrete canyon slap-back
          const k0 = pre + Math.floor(c.echo[0] * sr * (ch ? 1.06 : 1)), len = Math.floor(0.05 * sr);
          for (let i = 0; i < len && k0 + i < n; i++) d[k0 + i] += (Math.random() * 2 - 1) * c.echo[1] * Math.exp(-i / (0.01 * sr));
        }
      }
      return ir;
    }
    function setReverb(world) {
      if (!ctx || world === revWorld) return;
      revWorld = world;
      const c = REV[world] || REV[1];
      const ir = irCache[world] || (irCache[world] = makeIR(c));
      const conv = ctx.createConvolver(); conv.normalize = true; conv.buffer = ir;
      const wet = ctx.createGain(); wet.gain.value = 0.0001;
      revIn.connect(conv); conv.connect(wet); wet.connect(worldBus);
      const now = ctx.currentTime;
      wet.gain.setTargetAtTime(c.wet, now, 0.25);
      const old = rev; rev = { conv, wet };
      if (old) {
        old.wet.gain.setTargetAtTime(0.0001, now, 0.25);
        setTimeout(() => { try { revIn.disconnect(old.conv); old.conv.disconnect(); old.wet.disconnect(); } catch (e) {} }, 2500);
      }
    }

    // ---- ambience beds -------------------------------------------------------
    let amb = null, ambToken = 0, sceneWorld = 0, sceneType = null;
    function fadeOutAmb(secs) {
      if (!amb) return;
      const a = amb; amb = null;
      const now = ctx.currentTime;
      a.g.gain.cancelScheduledValues(now); a.g.gain.setValueAtTime(Math.max(0.0001, a.g.gain.value), now);
      a.g.gain.linearRampToValueAtTime(0.0001, now + secs);
      try { a.src.stop(now + secs + 0.05); } catch (e) {}
      a.src.onended = () => { try { a.src.disconnect(); a.g.disconnect(); } catch (e) {} };
    }
    function startAmb(world) {
      const tok = ++ambToken, url = AMB[world];
      loadBuf(url, (buf) => {
        if (tok !== ambToken || !buf || !ctx) return;
        fadeOutAmb(1.5);
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const pad = Math.min(LOOP_PAD, buf.duration / 4);
        src.loopStart = pad; src.loopEnd = buf.duration - pad;
        const g = ctx.createGain(); g.gain.value = 0.0001;
        src.connect(g); g.connect(ambBus);
        const now = ctx.currentTime;
        src.start(now, pad + Math.random() * (buf.duration - 2 * pad - 1));
        g.gain.setValueAtTime(0.0001, now); g.gain.linearRampToValueAtTime(AMB_GAIN[world] || 0.8, now + 2.0);
        amb = { src, g, world };
      });
    }
    function setScene(world, type) {
      ensure(); if (!ctx) return;
      world = Math.max(1, Math.min(5, (world | 0) || 1));
      sceneType = type || null;
      setReverb(world);
      if (world === sceneWorld && (amb || ambToken)) { sceneWorld = world; return; }
      sceneWorld = world;
      startAmb(world);
      // warm this world's footsteps
      const s = SURFACE[world]; if (s) for (const u of STEPS[s]) queueLoad(u);
    }
    function stopScene() {
      if (!ctx) return;
      ambToken++; fadeOutAmb(1.0);
      allLoopsOff(false);
      sceneWorld = 0; haveListener = false;
      muffle.frequency.cancelScheduledValues(ctx.currentTime); muffle.frequency.setTargetAtTime(20000, ctx.currentTime, 0.05); curLP = 20000;
    }
    function setPaused(on) {
      paused = !!on; ensure(); if (!ctx) return;
      const now = ctx.currentTime;
      ambBus.gain.cancelScheduledValues(now);
      ambBus.gain.setTargetAtTime(paused ? 0.0001 : 1, now, 0.08);
      if (paused) allLoopsOff(false);
    }

    // ---- per-frame driver ------------------------------------------------------
    let stepT = 0, prevGround = true, beamWasOn = false, curLP = 20000, lastState = null;
    // open water surfaces of a level (game coords), cached per level
    let wsLevel = null, wsList = null;
    function waterSurfaces(l) {
      if (!l || !l.hasWater) return null;
      if (l === wsLevel) return wsList;
      wsLevel = l; wsList = [];
      for (let ty = 1; ty < l.rows; ty++) for (let tx = 0; tx < l.cols; tx++) {
        if (l.tiles[ty * l.cols + tx] !== 5 || l.tiles[(ty - 1) * l.cols + tx] === 5) continue;
        const last = wsList[wsList.length - 1];
        if (last && last.ty === ty && last.x1 === tx * 20) last.x1 += 20; else wsList.push({ ty, x0: tx * 20, x1: tx * 20 + 20, y: ty * 20 + 3 });
      }
      return wsList;
    }
    function update(state, dt) {
      if (!ctx || !state) return;
      lastState = state;
      dt = Math.min(0.1, Math.max(0, dt || 0));
      const cam = state.cam || { x: 0, y: 0 };
      setListener(cam.x + VIEW_W / 2, cam.y + VIEW_H / 2);
      if (state.level && state.level.world && state.level.world !== sceneWorld) setScene(state.level.world, state.level.type);
      const p = state.player; if (!p) return;
      const now = ctx.currentTime;
      const live = !p.dead && !paused && sfxOn && !muted && !state.gameOver;
      const px = p.x + (p.w || 0) / 2, py = p.y + (p.h || 0) / 2;
      const shmup = !!(state.level && state.level.type === 'shmup');
      const avx = Math.abs(p.vx || 0);
      // Arc Lance hum while the beam is held (engine also pings 'beam' every 3 frames)
      const beamOn = live && (!!p.beamActive || now - beamLast < 0.12);
      if (beamOn && !beamWasOn) play('beamon', px, py);
      beamWasOn = beamOn;
      loopSet('beam', beamOn, 0.5, 1 + 0.025 * Math.sin(now * 9), px, py);
      // fighter engine: pitch rides the ship's speed
      const spd = Math.sqrt((p.vx || 0) * (p.vx || 0) + (p.vy || 0) * (p.vy || 0));
      loopSet('engine', live && shmup, 0.5, 0.85 + Math.min(0.45, spd / 520), px, py);
      // morph-ball roll
      loopSet('roll', live && !shmup && !!p.morph && !!p.onGround && avx > 30, 0.55, 0.75 + Math.min(0.6, avx / 350), px, py);
      // water: lapping when the trooper is near an open surface, a deep muffled bed once under
      const ws = waterSurfaces(state.level);
      let near = 1e9;
      if (ws) for (const w of ws) { const dx = px < w.x0 ? w.x0 - px : px > w.x1 ? px - w.x1 : 0; near = Math.min(near, Math.hypot(dx, py - w.y)); }
      loopSet('lap', live && !!ws && near < 320, 0.5 * Math.max(0, 1 - near / 320), 1, px, ws ? py : null);
      loopSet('under', live && !!p.inWater, 0.55, 1, null, null);
      // low-armour heartbeat (faster as energy falls)
      const e = p.energy != null ? p.energy : 100;
      loopSet('heart', live && e > 0 && e < 30, 0.7, 1 + (30 - e) / 90, null, null);
      // footsteps by world surface
      const surf = SURFACE[sceneWorld || (state.level && state.level.world) || 1];
      const walking = live && !shmup && surf && p.onGround && !p.morph && !p.inWater && avx > 40;
      if (walking) {
        stepT -= dt;
        if (stepT <= 0) {
          playStep(surf, px, p.y + (p.h || 0));
          stepT = Math.max(0.24, Math.min(0.42, 0.3 * Math.sqrt(205 / avx)));
        }
      } else stepT = Math.min(stepT, 0.05);
      if (live && !shmup && surf && p.onGround && !prevGround && !p.morph && !p.inWater) playStep(surf, px, p.y + (p.h || 0), 0.8);
      prevGround = !!p.onGround;
      // underwater: everything in the world goes dull
      const wantLP = (p.inWater && !p.dead) ? 650 : 20000;
      if (wantLP !== curLP) { muffle.frequency.cancelScheduledValues(now); muffle.frequency.setTargetAtTime(wantLP, now, 0.06); curLP = wantLP; }
    }

    // ---- MUSIC ---------------------------------------------------------------
    function n(root, semi) { return root * Math.pow(2, semi / 12); }
    const TRACKS = {
      title: { bpm: 116, root: 196, bassType: 'triangle', leadType: 'square',
        bass: [0, null, 0, null, 5, null, 5, null, 7, null, 7, null, 5, null, 3, null],
        lead: [12, null, null, 7, 12, null, 14, null, 16, null, 14, 12, 14, null, null, null,
               12, null, null, 7, 12, null, 16, null, 19, null, null, 16, 14, 12, 14, null],
        pad: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]], drums: 'k.h.s.h.k.h.s.hh' },
      1: { bpm: 132, root: 220, bassType: 'triangle', leadType: 'square',
        bass: [0, 0, null, 0, null, 0, 3, null, 5, 5, null, 5, 7, null, 3, null],
        lead: [null, null, 12, null, 15, null, 12, null, 17, null, 15, null, 12, null, 10, null,
               null, null, 12, null, 15, null, 19, null, 17, null, 15, null, 12, 10, 12, null],
        pad: [[0, 3, 7], [0, 3, 7], [5, 8, 12], [7, 10, 14]], drums: 'k.h.s.h.k.hks.h.' },
      2: { bpm: 96, root: 174, bassType: 'sine', leadType: 'sine',
        bass: [0, null, null, null, null, null, 3, null, null, null, 2, null, null, null, null, null],
        lead: [12, null, null, null, 15, null, null, null, null, null, 14, null, null, null, 10, null,
               12, null, null, null, 17, null, null, null, 15, null, null, null, null, null, null, null],
        pad: [[0, 3, 7], [0, 2, 7], [-2, 3, 7], [0, 3, 8]], drums: 'k.......k...s...', echo: true },
      3: { bpm: 152, root: 262, bassType: 'sawtooth', leadType: 'square',
        bass: [0, 0, 0, 0, -2, -2, -2, -2, -4, -4, -4, -4, -2, -2, -2, -2],
        lead: [0, 4, 7, 12, 7, 4, 0, 4, 7, 12, 16, 12, 7, 4, 7, 12,
               -2, 2, 5, 10, 5, 2, -2, 2, 5, 10, 14, 10, 5, 2, 5, 10],
        pad: null, drums: 'k.hhs.hhk.hhs.hh' },
      4: { bpm: 120, root: 174, bassType: 'sawtooth', leadType: 'square',
        bass: [0, null, 0, 0, null, 0, null, 3, 0, null, 0, 0, null, 5, 3, null],
        lead: [null, null, null, null, 12, null, null, 10, null, null, 12, null, null, null, 15, null,
               null, null, null, null, 12, null, null, 10, null, null, 8, null, 10, null, null, null],
        pad: [[0, 2, 7], [0, 2, 7], [-4, 0, 5], [-2, 2, 7]], drums: 'kkh.s.hkk.hks.hH' },
      5: { bpm: 88, root: 165, bassType: 'sine', leadType: 'triangle',
        bass: [0, 0, null, null, null, null, null, null, 1, 1, null, null, null, null, null, null],
        lead: [null, null, null, null, 13, null, null, null, null, null, null, 12, null, null, null, null,
               null, null, 18, null, null, null, 17, null, null, null, null, null, 13, null, null, null],
        pad: [[0, 1, 7], [0, 1, 6], [0, 1, 7], [-1, 5, 6]], drums: 'kk..............', echo: true },
      boss: { bpm: 144, root: 185, bassType: 'sawtooth', leadType: 'sawtooth',
        bass: [0, 0, null, 0, 0, null, 1, null, 0, 0, null, 0, -2, null, 1, null],
        lead: [12, null, 13, null, 12, null, null, 8, null, null, 12, 13, null, 15, null, 13,
               12, null, 13, null, 16, null, null, 13, null, 12, null, 8, null, null, null, null],
        pad: [[0, 3, 6], [0, 3, 6], [-2, 1, 6], [1, 3, 8]], drums: 'k.k.s.k.k.kks.kh' },
    };
    TRACKS.sovereign = TRACKS.boss;

    let schedTimer = null, curTrack = null, stepIdx = 0, nextTime = 0;
    function scheduleStep(tr, i, t) {
      const b16 = i % 16;
      const stepDur = 60 / tr.bpm / 4;
      const bnote = tr.bass[b16];
      if (bnote != null) synth(n(tr.root / 2, bnote), t, stepDur * 1.7, {
        type: tr.bassType || 'sawtooth', voices: 2, detune: 5, vol: 0.34,
        a: 0.005, d: 0.09, s: 0.5, r: 0.08, ff: 900, ft: 380, q: 3.5 });
      const lnote = tr.lead[i % tr.lead.length];
      if (lnote != null) synth(n(tr.root, lnote), t, stepDur * 1.3, {
        type: tr.leadType || 'square', voices: 2, detune: 11, vol: 0.2,
        a: 0.008, d: 0.06, s: 0.62, r: 0.12, ff: 5600, ft: 2500, q: 1.4,
        vib: tr.leadType === 'sine' ? 0 : 6, vibRate: 5.5, send: tr.echo ? 0.4 : 0.16 });
      if (tr.pad && b16 === 0) {
        const chord = tr.pad[Math.floor(i / 16) % tr.pad.length];
        for (const c of chord) synth(n(tr.root, c), t, stepDur * 15, {
          type: 'sawtooth', voices: 3, detune: 13, vol: 0.055,
          a: 0.35, d: 0.5, s: 0.85, r: 0.7, ff: 2300, ft: 1500, q: 0.6 });
      }
      const ch = tr.drums[b16];
      if (ch && ch !== '.') drum(ch, t);
    }

    // produced score (original ElevenLabs compositions), looped gaplessly
    const STREAM_URLS = {
      title: A + 'music/music-title.mp3',          // Shard Assault main theme
      action: A + 'music/music-action.mp3',        // W1 Shattered Mesa
      ambient: A + 'music/music-ambient.mp3',      // W2 Drowned Vaults
      corridor: A + 'music/music-corridor.mp3',    // W3 Rift Run
      factory: A + 'music/music-factory.mp3',      // W4 Cinder Foundry
      alien: A + 'music/music-alien.mp3',          // W5 The Hollow Spire
      boss: A + 'music/music-boss.mp3',
      sovereign: A + 'music/music-sovereign.mp3',  // final boss: THE SOVEREIGN (intro once, then a 32-bar loop)
    };
    const STREAM_LOOP = { sovereign: [48.1815, 99.37] };
    const WORLD_TRACK = { 1: 'action', 2: 'ambient', 3: 'corridor', 4: 'factory', 5: 'alien' };
    function streamKeyFor(trackId) {
      if (trackId === 'title' || trackId === 'boss' || trackId === 'sovereign') return trackId;
      return WORLD_TRACK[trackId] || 'action';
    }
    function loadMusic(url) {
      if (musicBuffers[url]) return Promise.resolve(musicBuffers[url]);
      return fetch(url + AV)
        .then((r) => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => (musicBuffers[url] = buf))
        .catch(() => (musicBuffers[url] = 'error'));
    }
    function stopStream() {
      if (curSource) { try { curSource.stop(); } catch (e) {} try { curSource.disconnect(); } catch (e) {} curSource = null; }
    }
    function playStream(buf, fadeIn, key) {
      if (!ctx || !streamGain) return;
      stopStream();
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = STREAM_LOOP[key];
      let startAt;
      if (lp && lp[1] < buf.duration) { src.loopStart = lp[0]; src.loopEnd = lp[1]; startAt = 0; }
      else {
        // whole-song loop: skip MP3 encoder padding at both ends
        const trim = Math.min(0.05, buf.duration * 0.02);
        src.loopStart = trim; src.loopEnd = Math.max(trim + 1, buf.duration - trim); startAt = trim;
      }
      src.connect(streamGain);
      const g = streamGain.gain; g.cancelScheduledValues(ctx.currentTime);
      if (fadeIn) { g.setValueAtTime(0.0001, ctx.currentTime); g.linearRampToValueAtTime(1, ctx.currentTime + 0.7); }
      else g.setValueAtTime(1, ctx.currentTime);
      src.start(ctx.currentTime, startAt);
      curSource = src;
    }
    function startSynthMusic(trackId) {
      stopSynthMusic();
      if (!ctx || !musicOn || muted) return;
      curTrack = TRACKS[trackId] || TRACKS[1];
      if (musicDelay) musicDelay.delayTime.setValueAtTime(Math.min(0.9, (60 / curTrack.bpm) * 0.75), ctx.currentTime);
      stepIdx = 0;
      nextTime = ctx.currentTime + 0.08;
      schedTimer = setInterval(() => {
        if (!ctx || !musicOn || muted || !curTrack) return;
        const stepDur = 60 / curTrack.bpm / 4;
        while (nextTime < ctx.currentTime + 0.18) {
          scheduleStep(curTrack, stepIdx, nextTime);
          nextTime += stepDur;
          stepIdx++;
        }
      }, 45);
    }
    function stopSynthMusic() {
      if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
      if (seqTimer) { clearTimeout(seqTimer); seqTimer = null; }
      curTrack = null;
    }
    function startMusic(trackId) {
      ensure(); if (!ctx) return;
      // the final boss (THE SOVEREIGN) gets its own theme even when game.js asks for 'boss'
      if (trackId === 'boss' && lastState && lastState.boss && lastState.boss.key === 'machine') trackId = 'sovereign';
      curWorld = trackId || 1;
      stopMusic();
      if (!musicOn || muted) return;
      const key = streamKeyFor(trackId);
      const url = STREAM_URLS[key];
      curStreamKey = key;
      const tok = ++loadToken;
      const cached = musicBuffers[url];
      if (cached && cached !== 'error') { playStream(cached, false, key); return; }
      startSynthMusic(trackId);
      if (cached === 'error') return;
      loadMusic(url).then((buf) => {
        if (tok !== loadToken || !musicOn || muted) return;
        if (buf === 'error') return;
        stopSynthMusic();
        playStream(buf, true, key);
      });
    }
    function stopMusic() {
      loadToken++;            // invalidate any in-flight produced-track handoff
      stopSynthMusic();
      stopStream();
    }
    function duck(amount, secs) {
      if (!ctx || !musicGain) return;
      const g = musicGain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(musicBase * amount, ctx.currentTime);
      g.setTargetAtTime(musicBase, ctx.currentTime + (secs || 0.25), 0.3);
    }

    // ---- VOICE: announcer pools with variants, no immediate repeats ------------
    const VO_LINES = {
      title: ['Shard Assault!', 'Shard... Assault!'],
      start: ['Drop confirmed. Take Kethra back, trooper!', 'Boots on the crystal. Move out!', "Trooper deployed. Break the Sovereign's grip!"],
      clear: ['Sector clear. Keep pushing!', 'Zone secured. The Sovereign is losing ground.', 'Stage clear! Onward, trooper!'],
      bosswarn: ['Warning! Guardian incoming!', 'Massive crystal signature. Brace yourself!', 'Big one inbound. Weapons hot!'],
      bossdown: ['Guardian shattered! Outstanding!', 'Target destroyed. The path is open!', 'Down it goes! Nice work, trooper!'],
      oneup: ['Extra life!', 'One up! Reinforcements locked in.'],
      lowenergy: ['Armor critical! Find energy, now!', 'Warning! Suit integrity failing!'],
      lowtime: ["Clock's running out. Move it!", 'Time critical! Hurry, trooper!'],
      weapon: ['Weapon upgraded!', 'Firepower boosted!', "Now that's firepower!"],
      'weapon-scatter': ['Scatter!'], 'weapon-lance': ['Arc Lance!'], 'weapon-ricochet': ['Ricochet!'],
      death: ['Trooper down! Get back in there!', "You're hit! Shake it off!"],
      gameover: ['Mission failed. Kethra falls to the Sovereign.', 'Signal lost. The Sovereign endures... for now.'],
      victory: ['The Sovereign is shattered! Kethra is free! Magnificent work, trooper!', "It's over! The Spire has fallen, and Kethra is free!"],
      shmup: ['Fighter online! Punch it through the rift!', "You've got the ship. Fly hard, trooper!"],
      freeze: ['Cryo burst!', 'Freeze them solid!'],
      shockwall: ['Shockwall!'],
      world1: ['World one. Shattered Mesa.'], world2: ['World two. Drowned Vaults.'], world3: ['World three. Rift Run.'],
      world4: ['World four. Cinder Foundry.'], world5: ['World five. The Hollow Spire.'],
      'bosswarn-warden': ['Warning! The Dune Warden approaches!'],
      'bosswarn-maw': ['Warning! The Abyss Maw rises from the deep!'],
      'bosswarn-gunship': ['Warning! Blockade Gunship dead ahead!'],
      'bosswarn-colossus': ['Warning! The Forge Colossus is awake!'],
      'bosswarn-queen': ['Warning! The Hive Queen stirs!'],
      'bosswarn-machine': ['This is it. The Sovereign itself. End this, trooper!'],
    };
    let voiceOn = true, voiceVol = 0.9, lastVoiceAt = 0, curVoice = null, toastCb = null;
    const lastVoiceIdx = {};
    // A DIFFERENT announcer every game: voice sets live at assets/audio/vo/<voice>-<event>-<i>.mp3
    const VOICES = ['harry', 'bella', 'brian', 'callum', 'charlie', 'chris', 'eric', 'jessica', 'liam', 'lily', 'matilda'];
    let voiceName = VOICES[Math.floor(Math.random() * VOICES.length)], lastVoiceName = null;
    function rollVoice() {
      let vn = VOICES[Math.floor(Math.random() * VOICES.length)];
      if (VOICES.length > 1 && vn === lastVoiceName) vn = VOICES[(VOICES.indexOf(vn) + 1) % VOICES.length];
      lastVoiceName = vn; voiceName = vn;
    }
    function playVoice(name, priority) {
      if (!voiceOn || muted) return;
      let lines = VO_LINES[name];
      let family = null;
      if (!lines) {                                   // unknown sub-event -> its family (e.g. bosswarn-xyz -> bosswarn)
        family = String(name).split('-')[0]; lines = VO_LINES[family]; if (!lines) return; name = family;
      }
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (!priority && now - lastVoiceAt < 1600) return;
      const busy = curVoice && !curVoice.paused && !curVoice.ended;
      if (priority && busy) { try { curVoice.pause(); } catch (e) {} }
      else if (busy && !priority && now - lastVoiceAt < 8000) return; // 8s failsafe vs stuck elements
      let i = Math.floor(Math.random() * lines.length);
      if (lines.length > 1 && i === lastVoiceIdx[name]) i = (i + 1) % lines.length;
      lastVoiceIdx[name] = i;
      lastVoiceAt = now;
      if (typeof Audio === 'undefined') return;
      // fallback chain: chosen voice -> Harry's set -> the event family's line -> silence
      const fam = name.indexOf('-') > 0 ? name.split('-')[0] : null;
      const chainUrls = [`${A}vo/${voiceName}-${name}-${i}.mp3`];
      if (voiceName !== 'harry') chainUrls.push(`${A}vo/harry-${name}-${i}.mp3`);
      if (fam && VO_LINES[fam]) chainUrls.push(`${A}vo/${voiceName}-${fam}-0.mp3`);
      let step = 0;
      const tryNext = () => {
        if (step >= chainUrls.length) { curVoice = null; return; }
        const a = new Audio(chainUrls[step++] + AV);
        a.volume = voiceVol; curVoice = a;
        a.onerror = () => { if (curVoice === a) tryNext(); };
        const pr = a.play(); if (pr && pr.catch) pr.catch(() => { if (curVoice === a && a.error) tryNext(); });
      };
      tryNext();
      if (toastCb) toastCb(lines[i]);
    }
    function setVoice(on) { voiceOn = on; }
    function setVoiceLevel(vv) { voiceVol = Math.max(0, Math.min(1, 0.9 * vv)); }
    function onVoiceToast(cb) { toastCb = cb; }

    let wasPlayingBeforeMute = false;
    function toggleMute() {
      muted = !muted;
      if (muted) {
        wasPlayingBeforeMute = !!(schedTimer || curSource);
        stopMusic();
        if (master) master.gain.value = 0;
        if (curVoice && !curVoice.paused) { try { curVoice.pause(); } catch (e) {} }
        if (ctx) allLoopsOff(true);
      } else {
        if (master) master.gain.value = 0.85;
        if (wasPlayingBeforeMute) startMusic(curWorld);
      }
      return muted;
    }
    function setMusic(on) { musicOn = on; if (!on) stopMusic(); else startMusic(curWorld); }
    function setSfx(on) {
      sfxOn = on; if (!ctx) return;
      ambBus.gain.setTargetAtTime(on && !paused ? 1 : 0.0001, ctx.currentTime, 0.08);
      if (!on) allLoopsOff(false);
    }
    function setLevels(music, sfx) {
      ensure(); if (!ctx) return;
      musicBase = 0.32 * music;
      if (musicGain) musicGain.gain.value = musicBase;
      if (sfxLevel) sfxLevel.gain.value = sfxBase * sfx;
      if (uiLevel) uiLevel.gain.value = sfxBase * sfx;
    }
    function debug() {
      let loaded = 0, loading = 0; const errors = [];
      for (const u in bufs) { const b = bufs[u]; if (b === 'loading') loading++; else if (b === 'error') errors.push(u); else loaded++; }
      const loops = {}; for (const k in loopState) loops[k] = !!(loopState[k].src && loopState[k].on);
      return { ctx: ctx ? ctx.state : 'none', loaded, loading, errors, voices: liveVoices.filter((x) => !x.dead).length,
        scene: sceneWorld, ambience: amb ? amb.world : 0, reverb: revWorld, loops, listener: [lx, ly],
        muffle: muffle ? muffle.frequency.value : 0, voice: voiceName, music: curStreamKey };
    }

    return { resume, play, ui, bossRoar, update, setScene, stopScene, setPaused, setListener,
      startMusic, stopMusic, toggleMute, setMusic, setSfx, setLevels, duck,
      playVoice, setVoice, setVoiceLevel, onVoiceToast, rollVoice, getVoiceSet: () => voiceName,
      get muted() { return muted; }, ensure, _debug: debug, VO_LINES };
  }

  return { createAudio, BANK, STEPS, LOOPS, AMB };
});
