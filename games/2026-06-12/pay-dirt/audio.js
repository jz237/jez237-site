/* Pay Dirt — audio.js
   WebAudio: procedural SFX + a looping sequenced cavern theme. No external assets.
   Everything degrades to a safe no-op if the context can't start (e.g. headless). */
'use strict';
const AUDIO = (() => {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let muted = false;
  try { muted = localStorage.getItem('paydirt-muted') === '1'; } catch (e) {}

  function ensure(){
    if (ctx){ if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx.state === 'running'; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.9; sfxGain.connect(master);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.5; musicGain.connect(master);
    } catch (e){ ctx = null; return false; }
    return ctx.state === 'running';
  }

  function setMuted(m){
    muted = m;
    try { localStorage.setItem('paydirt-muted', m ? '1' : '0'); } catch (e) {}
    if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.02);
  }

  /* ---------- synthesis helpers ---------- */
  function env(node, t, a, peak, d, sus){
    const g = node.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(0.0001, t);
    g.exponentialRampToValueAtTime(peak, t + a);
    g.exponentialRampToValueAtTime(Math.max(0.0001, sus || 0.0001), t + a + d);
  }
  function tone(freq, t, dur, type, peak, dest){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    env(g, t, 0.006, peak, dur);
    o.connect(g).connect(dest || sfxGain);
    o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  function slide(f0, f1, t, dur, type, peak){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sawtooth';
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    env(g, t, 0.006, peak, dur);
    o.connect(g).connect(sfxGain);
    o.start(t); o.stop(t + dur + 0.05);
  }
  let noiseBuf = null;
  function noise(t, dur, peak, lp, hp){
    if (!noiseBuf){
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const g = ctx.createGain(); env(g, t, 0.004, peak, dur);
    let node = src;
    if (lp){ const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node.connect(f); node = f; }
    if (hp){ const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; node.connect(f); node = f; }
    node.connect(g).connect(sfxGain);
    src.start(t); src.stop(t + dur + 0.05);
  }

  /* ---------- SFX ---------- */
  function sfx(name){
    if (!ctx || muted || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    switch (name){
      case 'dig':    noise(t, 0.16, 0.5, 1400, 200); slide(180, 90, t, 0.16, 'square', 0.18); break;
      case 'land':   noise(t, 0.08, 0.3, 700); tone(110, t, 0.07, 'sine', 0.25); break;
      case 'gold':   tone(740, t, 0.08, 'triangle', 0.3); tone(1180, t + 0.06, 0.12, 'triangle', 0.28); break;
      case 'goldhi': tone(990, t, 0.07, 'triangle', 0.3); tone(1480, t + 0.05, 0.1, 'triangle', 0.3); tone(1980, t + 0.1, 0.12, 'sine', 0.2); break;
      case 'power':  [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.05, 0.16, 'triangle', 0.26)); break;
      case 'reveal': [392, 523, 659, 784, 988].forEach((f, i) => tone(f, t + i * 0.06, 0.3, 'sine', 0.22)); break;
      case 'trap':   slide(440, 140, t, 0.22, 'square', 0.26); noise(t, 0.1, 0.25, 900); break;
      case 'seal':   tone(90, t, 0.18, 'sine', 0.34); noise(t, 0.18, 0.4, 800, 120); break;
      case 'boom':   slide(220, 30, t, 0.5, 'sawtooth', 0.4); noise(t, 0.45, 0.6, 1200); noise(t, 0.45, 0.4, 300); break;
      case 'die':    slide(330, 70, t, 0.6, 'sawtooth', 0.32); tone(110, t + 0.1, 0.5, 'square', 0.2); break;
      case 'win':    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.09, 0.4, 'triangle', 0.28)); break;
      case 'ui':     tone(660, t, 0.05, 'square', 0.16); break;
      case 'tick':   tone(880, t, 0.03, 'square', 0.12); break;
      case 'step':   noise(t, 0.04, 0.12, 600, 150); break;
      case 'rung':   tone(330, t, 0.04, 'square', 0.08); break;
    }
  }

  /* ---------- music: looping cavern theme ---------- */
  // A minor pentatonic, slow brooding loop. Lookahead scheduler on the audio clock.
  let playing = false, timer = null, step = 0, nextTime = 0;
  const BPM = 96, SPB = 60 / BPM, STEP = SPB / 2; // eighth notes
  // bass progression (one root per bar of 8 steps): Am F C G
  const bassSeq = [55.00, 43.65, 32.70, 49.00]; // A1 F1 C1 G1
  const A_MIN_PENT = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // A C D E G A
  const arpPattern = [0, 2, 4, 3, 5, 4, 2, 1];

  function scheduleStep(s, t){
    if (!musicGain) return;
    const bar = (s >> 3) % bassSeq.length;
    const inBar = s & 7;
    // bass on beats 0 and 4
    if (inBar === 0 || inBar === 4){
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = bassSeq[bar];
      env(g, t, 0.02, 0.5, SPB * 1.6);
      o.connect(g).connect(musicGain); o.start(t); o.stop(t + SPB * 1.8);
    }
    // soft kick every beat
    if (inBar % 2 === 0){
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      env(g, t, 0.005, 0.45, 0.14); o.connect(g).connect(musicGain); o.start(t); o.stop(t + 0.2);
    }
    // arp melody
    const note = A_MIN_PENT[arpPattern[inBar] % A_MIN_PENT.length] * (bar === 2 ? 1.0 : 1.0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = note;
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 1600;
    env(g, t, 0.01, 0.12, STEP * 0.9);
    o.connect(filt).connect(g).connect(musicGain); o.start(t); o.stop(t + STEP);
    // occasional high shimmer
    if (inBar === 6 && bar % 2 === 1){
      tone(A_MIN_PENT[5] * 2, t, 0.4, 'triangle', 0.07, musicGain);
    }
  }

  function scheduler(){
    if (!ctx || !playing) return;
    while (nextTime < ctx.currentTime + 0.12){
      scheduleStep(step, nextTime);
      nextTime += STEP;
      step++;
    }
  }

  function startMusic(){
    if (!ensure() || playing) return;
    playing = true; step = 0; nextTime = ctx.currentTime + 0.06;
    timer = setInterval(scheduler, 25);
  }
  function stopMusic(){
    playing = false;
    if (timer){ clearInterval(timer); timer = null; }
  }

  return { ensure, sfx, startMusic, stopMusic, setMuted, get muted(){ return muted; }, get running(){ return !!(ctx && ctx.state === 'running'); } };
})();
