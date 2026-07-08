/* Turrican II — Redux : audio.js
 * Original WebAudio synth (SFX + looping music). No external/copyrighted audio.
 * Driving melodic-chiptune spirit; all melodies are original.
 */
(function (root, factory) { root.TAudio = factory(); })(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function createAudio() {
    let ctx = null, master = null, musicGain = null, sfxGain = null;
    let musicWarmth = null, musicComp = null, musicDelay = null, delaySend = null;
    let musicBase = 0.34;
    let musicOn = true, sfxOn = true, muted = false;
    let seq = null, seqTimer = null, curWorld = 1;
    // produced-music (ElevenLabs, original score) streamed layer -> musicGain
    let streamGain = null, curSource = null, curStreamKey = null, loadToken = 0;
    const musicBuffers = {};
    // produced one-shot SFX (ElevenLabs, original) layered over the synth SFX
    const sfxBuffers = {};
    let sfxPreloaded = false;

    function ensure() {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.85; master.connect(ctx.destination);
      // glue/limiter so stacked voices + SFX never clip
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
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.5; sfxGain.connect(musicComp);
      // produced-score bus (own gain so it can crossfade in over the synth fallback)
      streamGain = ctx.createGain(); streamGain.gain.value = 1; streamGain.connect(musicGain);
    }

    // ---- rich subtractive synth voice (detuned osc stack + ADSR + filter env
    //      + optional vibrato + optional delay send) ------------------------
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
      for (let v = 0; v < voices; v++) {
        const osc = ctx.createOscillator(); osc.type = o.type || 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t + dur);
        osc.detune.setValueAtTime(voices === 1 ? 0 : (v / (voices - 1) - 0.5) * 2 * (o.detune || 8), t);
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
    // punchy drum kit
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

    // ---- one-shot synth voice --------------------------------------------
    function blip(freq, dur, type, vol, slideTo, dest, when) {
      if (!ctx || muted) return;
      const t0 = when != null ? when : ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(dest || sfxGain); o.start(t0); o.stop(t0 + dur + 0.02);
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
      src.connect(f); f.connect(g); g.connect(sfxGain); src.start();
    }

    // ---- SFX --------------------------------------------------------------
    const SFX = {
      shoot: () => blip(680, 0.08, 'square', 0.16, 340),
      shootb: () => blip(340, 0.11, 'triangle', 0.2, 520),
      eshoot: () => blip(300, 0.12, 'sawtooth', 0.14, 160),
      beam: () => blip(900 + Math.random() * 200, 0.05, 'sawtooth', 0.06, 700),
      jump: () => blip(320, 0.16, 'square', 0.2, 640),
      morph: () => { blip(200, 0.2, 'sawtooth', 0.2, 900); noise(0.15, 0.1, 2000); },
      explode: () => { noise(0.35, 0.4, 900); blip(120, 0.3, 'sawtooth', 0.2, 40); },
      hit: () => blip(160, 0.2, 'square', 0.25, 60),
      gem: () => blip(1200, 0.09, 'sine', 0.18, 1600),
      power: () => { blip(600, 0.1, 'square', 0.2, 900); setTimeout(() => blip(900, 0.12, 'square', 0.2, 1300), 90); },
      die: () => { blip(400, 0.6, 'sawtooth', 0.3, 60); noise(0.5, 0.3, 600); },
      bomb: () => { noise(0.6, 0.5, 1600); blip(80, 0.5, 'sawtooth', 0.3, 30); },
      line: () => blip(500, 0.25, 'sawtooth', 0.2, 1200),
      complete: () => [0, 1, 2, 3].forEach((i) => setTimeout(() => blip([523, 659, 784, 1047][i], 0.2, 'square', 0.22), i * 120)),
      gameover: () => [0, 1, 2].forEach((i) => setTimeout(() => blip([392, 330, 262][i], 0.4, 'sawtooth', 0.25), i * 220)),
      crate: () => { noise(0.14, 0.22, 2200); blip(360, 0.08, 'square', 0.14, 140); },
      flame: () => noise(0.3, 0.2, 900),
      splash: () => { noise(0.25, 0.3, 1400); blip(300, 0.15, 'sine', 0.12, 90); },
      land: () => { noise(0.12, 0.25, 480); blip(90, 0.1, 'sine', 0.18, 55); },
      tick: () => blip(1050, 0.07, 'square', 0.15, 900),
      checkpoint: () => [0, 1].forEach((i) => setTimeout(() => blip(700 + i * 260, 0.14, 'square', 0.2), i * 100)),
      hatch: () => { blip(900, 0.12, 'sine', 0.15, 300); noise(0.1, 0.15, 3000); },
      // boss suite
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
        blip([392, 494, 587, 784, 587, 784, 988][i], i >= 5 ? 0.5 : 0.18, 'square', 0.22), i * 150)),
    };
    // ---- produced sample SFX (original ElevenLabs one-shots) --------------
    // High-impact events use decoded samples; everything else + any load
    // failure falls back to the synth SFX above.
    const SFX_URLS = {
      shoot: 'assets/audio/sfx/sfx-shoot.mp3', hit: 'assets/audio/sfx/sfx-hit.mp3',
      explode: 'assets/audio/sfx/sfx-explode.mp3', bomb: 'assets/audio/sfx/sfx-bomb.mp3',
      power: 'assets/audio/sfx/sfx-power.mp3', gem: 'assets/audio/sfx/sfx-gem.mp3',
      die: 'assets/audio/sfx/sfx-die.mp3', bosshit: 'assets/audio/sfx/sfx-bosshit.mp3',
      bossdie: 'assets/audio/sfx/sfx-bossdie.mp3', stomp: 'assets/audio/sfx/sfx-stomp.mp3',
      phase: 'assets/audio/sfx/sfx-phase.mp3',
      // musical payoff stings (produced) for the reward/transition moments
      complete: 'assets/audio/sfx/sfx-complete.mp3', victory: 'assets/audio/sfx/sfx-victory.mp3',
      gameover: 'assets/audio/sfx/sfx-gameover.mp3',
    };
    const SFX_GAIN = { shoot: 0.55, hit: 0.6, gem: 0.7, bomb: 1.0, bossdie: 1.0, stomp: 0.95, explode: 0.9,
      complete: 0.95, victory: 1.0, gameover: 0.95 };
    const SFX_PITCHVAR = { shoot: 0.12, hit: 0.14, gem: 0.1, bosshit: 0.1, explode: 0.08 }; // repeated: vary pitch
    function loadSfx(name) {
      const url = SFX_URLS[name]; if (!url || !ctx) return;
      if (sfxBuffers[url] !== undefined) return;               // loading / loaded / errored
      sfxBuffers[url] = 'loading';
      fetch(url).then((r) => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => { sfxBuffers[url] = buf; })
        .catch(() => { sfxBuffers[url] = 'error'; });
    }
    function preloadSfx() {
      if (sfxPreloaded || !ctx) return; sfxPreloaded = true;
      for (const k in SFX_URLS) loadSfx(k);
    }
    function playSample(name, buf) {
      const src = ctx.createBufferSource(); src.buffer = buf;
      const pv = SFX_PITCHVAR[name];
      if (pv) src.playbackRate.value = 1 + (Math.random() - 0.5) * pv;
      const g = ctx.createGain(); g.gain.value = SFX_GAIN[name] != null ? SFX_GAIN[name] : 0.85;
      src.connect(g); g.connect(sfxGain); src.start();
    }
    function play(name) {
      if (!sfxOn || muted) return; ensure(); if (!ctx) return;
      const url = SFX_URLS[name];
      const buf = url ? sfxBuffers[url] : undefined;
      if (buf && buf !== 'loading' && buf !== 'error') { playSample(name, buf); return; }
      if (url && buf === undefined) loadSfx(name);   // first use: kick off load, synth this time
      const f = SFX[name]; if (f) f();               // synth now (permanent fallback if the file fails)
    }

    // ---- MUSIC ---------------------------------------------------------
    // Original per-world compositions in the spirit of SPEC §6, played by a
    // WebAudio-clock lookahead scheduler (no setTimeout drift, survives
    // background-tab throttling far better).
    //
    // Pattern format: 16th-note steps. Numbers are semitone offsets from the
    // track root; null = rest. Drums: k kick, s snare, h hat, H open hat.
    function n(root, semi) { return root * Math.pow(2, semi / 12); }
    const TRACKS = {
      title: { // anthemic, heroic build
        bpm: 116, root: 196, bassType: 'triangle', leadType: 'square',
        bass: [0, null, 0, null, 5, null, 5, null, 7, null, 7, null, 5, null, 3, null],
        lead: [12, null, null, 7, 12, null, 14, null, 16, null, 14, 12, 14, null, null, null,
               12, null, null, 7, 12, null, 16, null, 19, null, null, 16, 14, 12, 14, null],
        pad: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]],
        drums: 'k.h.s.h.k.h.s.hh',
      },
      1: { // desert: adventurous, bright, propulsive
        bpm: 132, root: 220, bassType: 'triangle', leadType: 'square',
        bass: [0, 0, null, 0, null, 0, 3, null, 5, 5, null, 5, 7, null, 3, null],
        lead: [null, null, 12, null, 15, null, 12, null, 17, null, 15, null, 12, null, 10, null,
               null, null, 12, null, 15, null, 19, null, 17, null, 15, null, 12, 10, 12, null],
        pad: [[0, 3, 7], [0, 3, 7], [5, 8, 12], [7, 10, 14]],
        drums: 'k.h.s.h.k.hks.h.',
      },
      2: { // submerged: dark, echoey, mysterious
        bpm: 96, root: 174, bassType: 'sine', leadType: 'sine',
        bass: [0, null, null, null, null, null, 3, null, null, null, 2, null, null, null, null, null],
        lead: [12, null, null, null, 15, null, null, null, null, null, 14, null, null, null, 10, null,
               12, null, null, null, 17, null, null, null, 15, null, null, null, null, null, null, null],
        pad: [[0, 3, 7], [0, 2, 7], [-2, 3, 7], [0, 3, 8]],
        drums: 'k.......k...s...',
        echo: true,
      },
      3: { // corridor: relentless fast arpeggios
        bpm: 152, root: 262, bassType: 'sawtooth', leadType: 'square',
        bass: [0, 0, 0, 0, -2, -2, -2, -2, -4, -4, -4, -4, -2, -2, -2, -2],
        lead: [0, 4, 7, 12, 7, 4, 0, 4, 7, 12, 16, 12, 7, 4, 7, 12,
               -2, 2, 5, 10, 5, 2, -2, 2, 5, 10, 14, 10, 5, 2, 5, 10],
        pad: null,
        drums: 'k.hhs.hhk.hhs.hh',
      },
      4: { // factory: mechanical, metallic groove
        bpm: 120, root: 174, bassType: 'sawtooth', leadType: 'square',
        bass: [0, null, 0, 0, null, 0, null, 3, 0, null, 0, 0, null, 5, 3, null],
        lead: [null, null, null, null, 12, null, null, 10, null, null, 12, null, null, null, 15, null,
               null, null, null, null, 12, null, null, 10, null, null, 8, null, 10, null, null, null],
        pad: [[0, 2, 7], [0, 2, 7], [-4, 0, 5], [-2, 2, 7]],
        drums: 'kkh.s.hkk.hks.hH',
      },
      5: { // alien ship: eerie, sparse, heartbeat pulse
        bpm: 88, root: 165, bassType: 'sine', leadType: 'triangle',
        bass: [0, 0, null, null, null, null, null, null, 1, 1, null, null, null, null, null, null],
        lead: [null, null, null, null, 13, null, null, null, null, null, null, 12, null, null, null, null,
               null, null, 18, null, null, null, 17, null, null, null, null, null, 13, null, null, null],
        pad: [[0, 1, 7], [0, 1, 6], [0, 1, 7], [-1, 5, 6]],
        drums: 'kk..............',
        echo: true,
      },
      boss: { // urgent, minor, pounding
        bpm: 144, root: 185, bassType: 'sawtooth', leadType: 'sawtooth',
        bass: [0, 0, null, 0, 0, null, 1, null, 0, 0, null, 0, -2, null, 1, null],
        lead: [12, null, 13, null, 12, null, null, 8, null, null, 12, 13, null, 15, null, 13,
               12, null, 13, null, 16, null, null, 13, null, 12, null, 8, null, null, null, null],
        pad: [[0, 3, 6], [0, 3, 6], [-2, 1, 6], [1, 3, 8]],
        drums: 'k.k.s.k.k.kks.kh',
      },
    };

    let schedTimer = null, curTrack = null, stepIdx = 0, nextTime = 0;

    function scheduleStep(tr, i, t) {
      const b16 = i % 16;
      const stepDur = 60 / tr.bpm / 4;
      // bass: saw+sub detuned stack with a punchy filter env
      const bnote = tr.bass[b16];
      if (bnote != null) synth(n(tr.root / 2, bnote), t, stepDur * 1.7, {
        type: tr.bassType || 'sawtooth', voices: 2, detune: 5, vol: 0.34,
        a: 0.005, d: 0.09, s: 0.5, r: 0.08, ff: 900, ft: 380, q: 3.5 });
      // lead: 2 detuned voices, vibrato, filter "pluck", delay space
      const lnote = tr.lead[i % tr.lead.length];
      if (lnote != null) synth(n(tr.root, lnote), t, stepDur * 1.3, {
        type: tr.leadType || 'square', voices: 2, detune: 11, vol: 0.2,
        a: 0.008, d: 0.06, s: 0.62, r: 0.12, ff: 5600, ft: 2500, q: 1.4,
        vib: tr.leadType === 'sine' ? 0 : 6, vibRate: 5.5, send: tr.echo ? 0.4 : 0.16 });
      // pad: warm 3-voice bed, once per bar
      if (tr.pad && b16 === 0) {
        const chord = tr.pad[Math.floor(i / 16) % tr.pad.length];
        for (const c of chord) synth(n(tr.root, c), t, stepDur * 15, {
          type: 'sawtooth', voices: 3, detune: 13, vol: 0.055,
          a: 0.35, d: 0.5, s: 0.85, r: 0.7, ff: 2300, ft: 1500, q: 0.6 });
      }
      const ch = tr.drums[b16];
      if (ch && ch !== '.') drum(ch, t);
    }

    // ---- produced-score streaming (original ElevenLabs compositions) -------
    // Rich, fully-produced original tracks decoded to AudioBuffers and looped
    // gaplessly through the music bus. Falls back to the synth scheduler while
    // a track loads, or permanently if a file 404s / fails to decode.
    const STREAM_URLS = {
      title: 'assets/audio/music/music-title.mp3',
      action: 'assets/audio/music/music-action.mp3',       // W1 desert: driving heroic
      ambient: 'assets/audio/music/music-ambient.mp3',     // W2 submerged: atmospheric
      corridor: 'assets/audio/music/music-corridor.mp3',   // W3 shmup: relentless chase
      factory: 'assets/audio/music/music-factory.mp3',     // W4 factory: industrial groove
      alien: 'assets/audio/music/music-alien.mp3',         // W5 ship: brooding finale
      boss: 'assets/audio/music/music-boss.mp3',
    };
    const WORLD_TRACK = { 1: 'action', 2: 'ambient', 3: 'corridor', 4: 'factory', 5: 'alien' };
    function streamKeyFor(trackId) {
      if (trackId === 'title') return 'title';
      if (trackId === 'boss') return 'boss';
      return WORLD_TRACK[trackId] || 'action';             // per-world unique theme (default driving)
    }
    function loadBuffer(url) {
      if (musicBuffers[url]) return Promise.resolve(musicBuffers[url]);
      return fetch(url)
        .then((r) => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
        .then((buf) => (musicBuffers[url] = buf))
        .catch(() => (musicBuffers[url] = 'error'));
    }
    function stopStream() {
      if (curSource) { try { curSource.stop(); } catch (e) {} try { curSource.disconnect(); } catch (e) {} curSource = null; }
    }
    function playStream(buf, fadeIn) {
      if (!ctx || !streamGain) return;
      stopStream();
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      // skip MP3 encoder padding at both ends so the loop stays seamless
      const trim = Math.min(0.05, buf.duration * 0.02);
      src.loopStart = trim; src.loopEnd = Math.max(trim + 1, buf.duration - trim);
      src.connect(streamGain);
      const g = streamGain.gain; g.cancelScheduledValues(ctx.currentTime);
      if (fadeIn) { g.setValueAtTime(0.0001, ctx.currentTime); g.linearRampToValueAtTime(1, ctx.currentTime + 0.7); }
      else g.setValueAtTime(1, ctx.currentTime);
      src.start(ctx.currentTime, trim);
      curSource = src;
    }

    // ---- synth fallback scheduler -----------------------------------------
    function startSynthMusic(trackId) {
      stopSynthMusic();
      if (!ctx || !musicOn || muted) return;
      curTrack = TRACKS[trackId] || TRACKS[1];
      // tempo-synced dotted-eighth delay for that Amiga "space"
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
      curWorld = trackId || 1;
      stopMusic();
      if (!musicOn || muted) return;
      const key = streamKeyFor(trackId);
      const url = STREAM_URLS[key];
      curStreamKey = key;
      const tok = ++loadToken;
      const cached = musicBuffers[url];
      if (cached && cached !== 'error') { playStream(cached, false); return; }
      // instant music now via the synth; upgrade to the produced score once decoded
      startSynthMusic(trackId);
      if (cached === 'error') return;                       // known-bad file: stay on synth
      loadBuffer(url).then((buf) => {
        if (tok !== loadToken || !musicOn || muted) return; // track changed / stopped / muted
        if (buf === 'error') return;                        // load failed: stay on synth
        stopSynthMusic();
        playStream(buf, true);                              // crossfade up over the synth
      });
    }
    function stopMusic() {
      loadToken++;            // invalidate any in-flight produced-track handoff, so an
                             // mp3 that finishes decoding after an explicit stop (tab
                             // hidden / win / gameover) can't resurrect a looping track
      stopSynthMusic();
      stopStream();
    }

    // duck music briefly under big impacts
    function duck(amount, secs) {
      if (!ctx || !musicGain) return;
      const g = musicGain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(musicBase * amount, ctx.currentTime); // respects a 0 slider
      g.setTargetAtTime(musicBase, ctx.currentTime + (secs || 0.25), 0.3);
    }

    // ---- VOICE (event pools with variants, no immediate repeats) ----------
    // Quality bar: every noticeable event gets its own pooled callouts.
    const VO_LINES = {
      start: ['Mission start. Move out, soldier.', 'Drop zone reached. Good hunting.'],
      clear: ['Sector cleared. Advance.', 'Objective complete. Well done.', 'Zone secure. Push forward.'],
      bosswarn: ['Warning! Massive hostile inbound.', 'Guardian signature detected. Stand your ground.', 'Big one coming. Weapons hot.'],
      bossdown: ['Target destroyed. Outstanding work.', 'Guardian eliminated. The route is open.', "Direct hit! It's down."],
      oneup: ['Extra life secured.', 'Reinforcements credited.'],
      lowenergy: ['Armor critical. Find energy, now!', 'Warning: energy reserves failing.'],
      lowtime: ["Clock's running out. Hurry!", 'Time critical. Move it, soldier.'],
      weapon: ['Firepower enhanced.', 'Weapon systems upgraded.', "Now you're packing heat."],
      death: ['Soldier down... get back up.', "You're hit! Recover and re-engage."],
      gameover: ['Mission failed. The Machine prevails... for now.', "We've lost contact. Landorin falls."],
      victory: ['The Machine is destroyed. Landorin is free. Magnificent work, soldier.'],
      shmup: ['Fighter systems online. Punch it!', "You've got the ship. Fly hard."],
      freeze: ['Cryo burst deployed.'],
    };
    let voiceOn = true, voiceVol = 0.9, lastVoiceAt = 0, curVoice = null, toastCb = null;
    const lastVoiceIdx = {};
    function playVoice(name, priority) {
      if (!voiceOn || muted) return;
      const lines = VO_LINES[name]; if (!lines) return;
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (!priority && now - lastVoiceAt < 1600) return;
      const busy = curVoice && !curVoice.paused && !curVoice.ended;
      if (priority && busy) { try { curVoice.pause(); } catch (e) {} }
      else if (busy && !priority && now - lastVoiceAt < 8000) return; // 8s failsafe vs stuck elements
      let i = Math.floor(Math.random() * lines.length);
      if (lines.length > 1 && i === lastVoiceIdx[name]) i = (i + 1) % lines.length;
      lastVoiceIdx[name] = i;
      lastVoiceAt = now;
      const a = new Audio(`assets/audio/vo-${name}-${i}.mp3`);
      a.volume = voiceVol;
      a.onerror = () => { if (curVoice === a) curVoice = null; };
      a.play().catch(() => { if (curVoice === a) curVoice = null; });
      curVoice = a;
      if (toastCb) toastCb(lines[i]);
    }
    function setVoice(on) { voiceOn = on; }
    function setVoiceLevel(v) { voiceVol = 0.9 * v; }
    function onVoiceToast(cb) { toastCb = cb; }

    let wasPlayingBeforeMute = false;
    function toggleMute() {
      muted = !muted;
      if (muted) {
        wasPlayingBeforeMute = !!(schedTimer || curSource);
        stopMusic();
        if (master) master.gain.value = 0;                    // instant silence incl. tails
        if (curVoice && !curVoice.paused) { try { curVoice.pause(); } catch (e) {} }
      } else {
        if (master) master.gain.value = 0.9;
        if (wasPlayingBeforeMute) startMusic(curWorld);       // only revive what was playing
      }
      return muted;
    }
    function setMusic(on) { musicOn = on; if (!on) stopMusic(); else startMusic(curWorld); }
    function setSfx(on) { sfxOn = on; }
    function setLevels(music, sfx) {
      ensure(); if (!ctx) return;
      musicBase = 0.32 * music;
      if (musicGain) musicGain.gain.value = musicBase;
      if (sfxGain) sfxGain.gain.value = 0.5 * sfx;
    }

    return { resume, play, startMusic, stopMusic, toggleMute, setMusic, setSfx, setLevels, duck,
      playVoice, setVoice, setVoiceLevel, onVoiceToast,
      get muted() { return muted; }, ensure };
  }

  return { createAudio };
});
