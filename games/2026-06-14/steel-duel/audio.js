/* Steel Duel — WebAudio synth + sampled tank SFX. window.SDAudio */
(function () {
  'use strict';
  let ctx = null, master = null, muted = false, engineNode = null, engineGain = null, engineFilt = null;
  let sampleLoadStarted = false;
  const samples = { fire: [], tankHit: [] };
  const sampleCursor = { fire: 0, tankHit: 0 };
  const sampleUrls = {
    fire: ['sfx/tank-shot-01.mp3', 'sfx/tank-shot-02.mp3', 'sfx/tank-shot-03.mp3'],
    tankHit: ['sfx/tank-hit-01.mp3', 'sfx/tank-hit-02.mp3', 'sfx/tank-hit-03.mp3', 'sfx/tank-hit-04.mp3'],
  };

  function ensure() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.6;
      master.connect(ctx.destination);
      loadSamples();
    } catch (e) { ctx = null; }
    return ctx;
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function loadSamples() {
    if (!ctx || sampleLoadStarted) return;
    sampleLoadStarted = true;
    Object.keys(sampleUrls).forEach(kind => {
      sampleUrls[kind].forEach(url => {
        fetch(url)
          .then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error('SFX ' + r.status)))
          .then(buf => ctx.decodeAudioData(buf))
          .then(audio => samples[kind].push(audio))
          .catch(() => {});
      });
    });
  }

  function tone(freq, dur, type, gain, slideTo) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.2, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, gain, filtFreq, filtType) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime, n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = filtType || 'lowpass'; f.frequency.value = filtFreq || 1200;
    const g = ctx.createGain(); g.gain.value = gain || 0.3;
    src.connect(f); f.connect(g); g.connect(master); src.start(t);
  }
  function playSample(kind, gain, fallback) {
    if (!ensure() || muted) return;
    const bank = samples[kind] || [];
    if (!bank.length) { fallback(); return; }
    const src = ctx.createBufferSource(), g = ctx.createGain();
    const idx = sampleCursor[kind]++ % bank.length;
    src.buffer = bank[idx];
    src.playbackRate.value = 0.96 + Math.random() * 0.08;
    g.gain.value = gain == null ? 0.9 : gain;
    src.connect(g); g.connect(master); src.start(ctx.currentTime);
  }
  function synthFire() { tone(620, 0.12, 'square', 0.18, 180); noise(0.06, 0.12, 2200); }
  function synthTankHit() { noise(0.055, 0.22, 3600, 'highpass'); tone(260, 0.07, 'square', 0.11, 140); tone(740, 0.035, 'triangle', 0.07, 520); }

  const SDAudio = {
    init() { ensure(); resume(); },
    resume,
    setMuted(b) { muted = !!b; if (master) master.gain.value = muted ? 0 : 0.6; if (engineGain) engineGain.gain.value = 0; },
    isMuted() { return muted; },
    fire() { playSample('fire', 0.82, synthFire); },
    tankHit() { playSample('tankHit', 0.86, synthTankHit); },
    wall() { noise(0.09, 0.18, 500); tone(120, 0.08, 'sine', 0.12, 70); },
    explosion() { noise(0.5, 0.5, 900); tone(90, 0.5, 'sawtooth', 0.3, 30); tone(160, 0.35, 'square', 0.15, 40); },
    mine() { noise(0.45, 0.55, 2600, 'highpass'); noise(0.4, 0.4, 700); tone(70, 0.45, 'sawtooth', 0.3, 28); },
    start() { [330, 440, 554, 660].forEach((f, i) => setTimeout(() => tone(f, 0.14, 'triangle', 0.2), i * 90)); },
    roundEnd() { [660, 554, 440, 294].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.2), i * 130)); },
    ui() { tone(440, 0.05, 'square', 0.1); },
    point() { tone(880, 0.1, 'square', 0.15, 1320); },
    engine(level) {
      if (!ensure() || muted) return;
      if (!engineNode) {
        engineNode = ctx.createOscillator(); engineNode.type = 'sawtooth'; engineNode.frequency.value = 46;
        engineFilt = ctx.createBiquadFilter(); engineFilt.type = 'lowpass'; engineFilt.frequency.value = 160;
        engineGain = ctx.createGain(); engineGain.gain.value = 0;
        engineNode.connect(engineFilt); engineFilt.connect(engineGain); engineGain.connect(master);
        engineNode.start();
      }
      const g = Math.max(0, Math.min(0.12, level));
      engineGain.gain.setTargetAtTime(muted ? 0 : g, ctx.currentTime, 0.08);
    },
  };
  window.SDAudio = SDAudio;
})();
