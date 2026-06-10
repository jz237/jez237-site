// Web Audio synth: ambient biome pads, dig thunks, gem chimes, drips, fire crackle.
// Everything generated — no audio files.

let ctx = null, master = null, padGain = null, fireGain = null;
let muted = false;
let padOscs = [];
let noiseBuf = null;

export function audioReady() { return !!ctx; }
export function isMuted() { return muted; }

export function initAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);

  // gentle bus compressor keeps chimes from spiking
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 4;
  master.disconnect();
  master.connect(comp).connect(ctx.destination);

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  // ambient pad bus
  padGain = ctx.createGain(); padGain.gain.value = 0;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass'; padFilter.frequency.value = 700; padFilter.Q.value = 0.4;
  const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
  lfo.frequency.value = 0.06; lfoG.gain.value = 220;
  lfo.connect(lfoG).connect(padFilter.frequency); lfo.start();
  padGain.connect(padFilter).connect(master);

  // campfire crackle bus (looped noise, gain by proximity)
  fireGain = ctx.createGain(); fireGain.gain.value = 0;
  const fSrc = ctx.createBufferSource();
  fSrc.buffer = noiseBuf; fSrc.loop = true;
  const fFil = ctx.createBiquadFilter();
  fFil.type = 'bandpass'; fFil.frequency.value = 2400; fFil.Q.value = 0.6;
  const fFil2 = ctx.createBiquadFilter();
  fFil2.type = 'lowpass'; fFil2.frequency.value = 3000;
  fSrc.connect(fFil).connect(fFil2).connect(fireGain).connect(master);
  fSrc.start();
}

export function toggleMute() {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 0.8;
  return muted;
}

// ---------- ambient pad: 3 detuned triangles on biome chord, crossfaded ----------
let currentChord = null;
export function setPadChord(freqs, level = 0.05) {
  if (!ctx) return;
  const key = freqs.join(',');
  if (key === currentChord) return;
  currentChord = key;
  const t = ctx.currentTime;
  padGain.gain.cancelScheduledValues(t);
  padGain.gain.setTargetAtTime(0, t, 1.2);
  const old = padOscs;
  setTimeout(() => old.forEach(o => { try { o.stop(); } catch (e) {} }), 3500);
  padOscs = [];
  for (const f of freqs) {
    for (const det of [-4, 3]) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      o.detune.value = det;
      const g = ctx.createGain(); g.gain.value = 0.33;
      o.connect(g).connect(padGain);
      o.start();
      padOscs.push(o);
    }
  }
  padGain.gain.setTargetAtTime(level, t + 1.0, 2.5);
}

export function setFireProximity(closeness) {     // 0..1
  if (!ctx) return;
  fireGain.gain.setTargetAtTime(closeness * 0.05, ctx.currentTime, 0.4);
  if (closeness > 0.15 && Math.random() < closeness * 0.045) {  // discrete pops
    blip(120 + Math.random() * 700, 0.03, 0.012, 'square');
  }
}

// ---------- one-shots ----------
function env(gainNode, t, a, peak, rel) {
  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(peak, t + a);
  gainNode.gain.exponentialRampToValueAtTime(0.0008, t + a + rel);
}

function blip(freq, a, peak, type = 'sine', rel = 0.12, dest = null) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  env(g, t, a, peak, rel);
  o.connect(g).connect(dest || master);
  o.start(t); o.stop(t + a + rel + 0.05);
}

function noiseHit(filterFreq, q, peak, rel, type = 'bandpass') {
  if (!ctx) return;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  s.playbackRate.value = 0.7 + Math.random() * 0.6;
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = filterFreq; f.Q.value = q;
  const g = ctx.createGain();
  env(g, t, 0.004, peak, rel);
  s.connect(f).connect(g).connect(master);
  s.start(t); s.stop(t + rel + 0.1);
}

export const sfx = {
  dig() {        // soft earthy thunk
    noiseHit(300 + Math.random() * 150, 0.8, 0.16, 0.09, 'lowpass');
    blip(95 + Math.random() * 25, 0.004, 0.1, 'sine', 0.07);
  },
  digStone() {
    noiseHit(900 + Math.random() * 400, 1.2, 0.13, 0.07);
    blip(140 + Math.random() * 40, 0.003, 0.08, 'triangle', 0.05);
  },
  tink() {       // too hard for current pick
    blip(1750 + Math.random() * 300, 0.002, 0.07, 'triangle', 0.06);
    noiseHit(3200, 3, 0.04, 0.04);
  },
  crumble() {    // tile breaks
    noiseHit(500, 0.6, 0.2, 0.24, 'lowpass');
    blip(70, 0.005, 0.12, 'sine', 0.14);
  },
  chime(value = 1) {   // gem discovery arpeggio (pentatonic, warmer with value)
    const base = [523.25, 587.33, 659.25, 783.99, 880][Math.min(4, value % 5)];
    [0, 4 / 12, 9 / 12].forEach((iv, i) => {
      setTimeout(() => {
        blip(base * Math.pow(2, iv), 0.008, 0.075, 'sine', 0.8);
        blip(base * Math.pow(2, iv) * 2, 0.008, 0.03, 'sine', 0.5);
      }, i * 90);
    });
  },
  pop() { blip(660 + Math.random() * 120, 0.004, 0.07, 'sine', 0.1); },
  bagFull() { blip(220, 0.01, 0.06, 'triangle', 0.2); setTimeout(() => blip(180, 0.01, 0.06, 'triangle', 0.25), 130); },
  splash() { noiseHit(950, 0.5, 0.14, 0.3, 'lowpass'); },
  drip() { blip(900 + Math.random() * 700, 0.002, 0.025, 'sine', 0.18); },
  rest() {       // cozy settle-by-the-fire flourish
    [392, 493.88, 587.33].forEach((f, i) =>
      setTimeout(() => blip(f, 0.02, 0.05, 'sine', 1.1), i * 160));
  },
  buy() {
    [659.25, 880].forEach((f, i) => setTimeout(() => blip(f, 0.005, 0.07, 'sine', 0.4), i * 80));
  },
  jump() { blip(300, 0.01, 0.022, 'sine', 0.08); },
  land() { noiseHit(260, 0.7, 0.07, 0.07, 'lowpass'); },
  journal() { blip(523.25, 0.01, 0.05, 'sine', 0.4); blip(1046.5, 0.015, 0.02, 'sine', 0.5); },
};
