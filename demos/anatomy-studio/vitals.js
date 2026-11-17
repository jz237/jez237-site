/**
 * Vitals: the controls and read-outs for the living body.
 *   - heart rate, breathing rate, and Rest / Exercise presets;
 *   - playback speed, and a scrubber that holds the heart anywhere in one beat with the phase named;
 *   - a small monitor on the stage: an ECG and a breathing curve drawn in step with the motion;
 *   - optional sound: the two heart sounds at the moments the valves shut, and the breath.
 *
 * The ECG is drawn from the same clock that moves the heart, so the P wave leads the atria, the QRS complex the
 * ventricles, and the T wave falls as they relax. It is a textbook shape, not a recording.
 */
import { REST, EXERCISE, BEAT_PHASES, beatPhase } from './life.js?v=342c152a42';

const el = id => document.getElementById(id);
const bump = (x, at, width, height) => height * Math.exp(-((x - at) ** 2) / (2 * width * width));
/** Lead-II-like trace for a point in the beat (0..1). */
export const ecg = phase => bump(phase, 0.045, 0.022, 0.13) + bump(phase, 0.128, 0.006, -0.1) + bump(phase, 0.142, 0.008, 1) + bump(phase, 0.158, 0.007, -0.24) + bump(phase, 0.39, 0.045, 0.3);

export function createVitals({ life, onChange }) {
  const canvas = el('vitals-canvas'), ctx = canvas.getContext('2d');
  const W = 264, H = 96, SECONDS = 4.5, trace = [];   // { t, ecg, breath }
  let clock = 0, lastBeat = 0, audio = null, shown = !matchMedia('(max-width: 760px)').matches;   // off to begin with on a phone, where the stage is small
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

  // ---------------------------------------------------------------- sound
  function startSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return null;
    const ac = new Ctx(), master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination);
    // breath: filtered noise whose loudness follows how fast the chest is moving
    const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ac.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const band = ac.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 700; band.Q.value = 0.7;
    const breath = ac.createGain(); breath.gain.value = 0;
    noise.connect(band); band.connect(breath); breath.connect(master); noise.start();
    /** A heart sound: a short low thump. S1 (inflow valves shutting) is lower and longer than S2 (outflow valves). */
    const thump = (frequency, seconds, loudness) => {
      const t = ac.currentTime, osc = ac.createOscillator(), gain = ac.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(frequency * 1.6, t); osc.frequency.exponentialRampToValueAtTime(frequency, t + seconds * 0.6);
      gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(loudness, t + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
      osc.connect(gain); gain.connect(master); osc.start(t); osc.stop(t + seconds + 0.02);
    };
    return { ac, breath, band, thump, last: 0, lastUp: 0 };
  }
  function sound(dt, state, signals, weight) {
    if (!audio) return;
    if (weight <= 0 || state.speed === 0 || state.scrub !== null) { audio.breath.gain.setTargetAtTime(0, audio.ac.currentTime, 0.05); return; }
    if (lastBeat < 0.14 && state.beat >= 0.14) audio.thump(48, 0.14, 0.9);    // "lub": mitral and tricuspid shut
    if (lastBeat < 0.46 && state.beat >= 0.46) audio.thump(72, 0.09, 0.6);    // "dub": aortic and pulmonary shut
    const flow = dt > 0 ? Math.abs(signals.breath - audio.last) / dt : 0; audio.last = signals.breath;
    audio.band.frequency.setTargetAtTime(signals.breath > audio.lastUp ? 900 : 520, audio.ac.currentTime, 0.1); audio.lastUp = signals.breath;
    audio.breath.gain.setTargetAtTime(Math.min(0.09, flow * 0.07) * weight, audio.ac.currentTime, 0.08);
  }

  // ---------------------------------------------------------------- the monitor
  function draw(state, weight) {
    ctx.clearRect(0, 0, W, H);
    const frozen = state.scrub !== null || state.speed === 0;
    ctx.lineWidth = 1.4; ctx.lineJoin = 'round';
    const top = 14, ecgBase = 52, ecgGain = 34, breathBase = 88, breathGain = 20;
    if (frozen) {
      // one whole beat, with the phases shaded in turn and a marker where the heart is held
      let from = 0;
      BEAT_PHASES.forEach((ph, i) => { ctx.fillStyle = i % 2 ? '#f5b39c14' : '#f5b39c05'; ctx.fillRect(from * W, top, (ph.until - from) * W, 50); from = ph.until; });
      ctx.strokeStyle = '#8fe0b4'; ctx.beginPath();
      for (let x = 0; x <= W; x++) { const y = ecgBase - ecg(x / W) * ecgGain; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.strokeStyle = '#f5b39c'; ctx.beginPath(); ctx.moveTo(state.beat * W, top); ctx.lineTo(state.beat * W, top + 50); ctx.stroke();
    } else {
      ctx.strokeStyle = '#8fe0b4'; ctx.beginPath();
      trace.forEach((s, i) => { const x = W - (clock - s.t) / SECONDS * W, y = ecgBase - s.ecg * ecgGain; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    }
    ctx.strokeStyle = '#7fb6e6'; ctx.beginPath();
    trace.forEach((s, i) => { const x = W - (clock - s.t) / SECONDS * W, y = breathBase - s.breath * breathGain; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
    ctx.font = '600 8.5px "DM Sans", sans-serif'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#8fe0b4'; ctx.fillText(`${Math.round(state.bpm)} BPM`, 6, 3);
    ctx.fillStyle = '#7fb6e6'; ctx.fillText(`${Math.round(state.breaths)} BREATHS / MIN`, 62, 3);
    ctx.fillStyle = '#f5b39c'; ctx.textAlign = 'right'; ctx.fillText(weight > 0 ? state.phase.toUpperCase() : 'AT REST: EXPLODED', W - 6, 3); ctx.textAlign = 'left';
  }

  /** Once per drawn frame. */
  function frame(dt, weight) {
    const state = life.getState(), signals = life.signals;
    canvas.parentElement.hidden = !shown || !life.on;
    if (weight > 0 && state.scrub === null && state.speed > 0) {
      clock += dt * state.speed;
      trace.push({ t: clock, ecg: ecg(state.beat), breath: Math.min(1.7, signals.breath) / 1.7 });
      while (trace.length && clock - trace[0].t > SECONDS) trace.shift();
    }
    sound(dt, state, signals, weight);
    lastBeat = state.beat;
    if (!canvas.parentElement.hidden) draw(state, weight);
    // the phase read-out beside the scrubber
    const ph = beatPhase(state.beat);
    if (el('beat-phase').textContent !== ph.name) { el('beat-phase').textContent = ph.name; el('beat-note').textContent = ph.note; }
    if (state.scrub === null && document.activeElement !== el('beat-scrub')) el('beat-scrub').value = Math.round(state.beat * 1000);
  }

  // ---------------------------------------------------------------- controls
  const show = () => { const s = life.getState(); el('rate-heart').value = s.bpm; el('rate-heart-out').textContent = `${Math.round(s.bpm)} a minute`; el('rate-breath').value = s.breaths; el('rate-breath-out').textContent = `${Math.round(s.breaths)} a minute`;
    for (const b of document.querySelectorAll('[data-preset]')) { const p = b.dataset.preset === 'exercise' ? EXERCISE : REST, on = s.bpm === p.bpm && s.breaths === p.breaths; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); } };
  el('rate-heart').oninput = e => { life.setRates({ bpm: Number(e.target.value) }); show(); onChange(); };
  el('rate-breath').oninput = e => { life.setRates({ breaths: Number(e.target.value) }); show(); onChange(); };
  for (const b of document.querySelectorAll('[data-preset]')) b.onclick = () => { life.setRates(b.dataset.preset === 'exercise' ? EXERCISE : REST); show(); onChange(); };
  el('life-speed').onchange = e => { life.setSpeed(Number(e.target.value)); onChange(); };
  el('beat-scrub').oninput = e => { life.scrub(Number(e.target.value) / 1000); el('beat-release').hidden = false; onChange(); };
  el('beat-release').onclick = () => { life.scrub(null); el('beat-release').hidden = true; onChange(); };
  el('sound-toggle').onclick = () => {
    if (audio) { audio.ac.close(); audio = null; } else audio = startSound();
    el('sound-toggle').setAttribute('aria-pressed', !!audio); onChange();
  };
  el('monitor-toggle').onclick = () => { shown = !shown; el('monitor-toggle').setAttribute('aria-pressed', shown); onChange(); };
  el('monitor-toggle').setAttribute('aria-pressed', shown);
  show();
  return { frame, show, getState: () => ({ sound: !!audio, monitor: shown, samples: trace.length }) };
}
