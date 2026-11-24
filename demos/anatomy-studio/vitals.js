/**
 * Vitals: the controls and read-outs for the living body.
 *   - heart rate, breathing rate, and Rest / Exercise presets;
 *   - teaching conditions (fast, slow and irregular heartbeat, shallow breathing, a leaking valve);
 *   - playback speed, and a scrubber that holds the heart anywhere in one beat with the phase named;
 *   - a small monitor on the stage: an ECG and a breathing curve drawn in step with the motion;
 *   - optional sound: the two heart sounds at the moments the valves shut, and the breath.
 *
 * The ECG is drawn from the same clock that moves the heart, so the P wave leads the atria, the QRS complex the
 * ventricles, and the T wave falls as they relax. It is a textbook shape, not a recording.
 *
 * The monitor and the blood-flow overlay start switched off: the opening view is the model, and these are asked for.
 * A screen reader gets the same information as text (#vitals-text), announced when the pace or condition changes.
 */
import { REST, EXERCISE, BEAT_PHASES, CONDITIONS, beatPhase } from './life.js?v=b85a6d00ce';

const el = id => document.getElementById(id);
const bump = (x, at, width, height) => height * Math.exp(-((x - at) ** 2) / (2 * width * width));
/** Lead-II-like trace for a point in the beat (0..1). With fibrillating atria there is no P wave, only a fine ripple. */
export const ecg = (phase, irregular = false, time = 0) => (irregular ? 0.03 * Math.sin(time * 41) + 0.02 * Math.sin(time * 67 + 1) : bump(phase, 0.045, 0.022, 0.13))
  + bump(phase, 0.128, 0.006, -0.1) + bump(phase, 0.142, 0.008, 1) + bump(phase, 0.158, 0.007, -0.24) + bump(phase, 0.39, 0.045, 0.3);

export function createVitals({ life, onChange }) {
  const canvas = el('vitals-canvas'), ctx = canvas.getContext('2d');
  const W = 264, H = 96, SECONDS = 4.5, trace = [];   // { t, ecg, breath }
  let clock = 0, lastBeat = 0, audio = null, shown = false, level = 0;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

  // ---------------------------------------------------------------- sound
  function startSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return null;
    const ac = new Ctx(), master = ac.createGain(); master.gain.value = 0.55; master.connect(ac.destination);
    const meter = ac.createAnalyser(); meter.fftSize = 1024; master.connect(meter);   // lets the page (and its tests) confirm that sound is actually being made
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
    return { ac, breath, band, thump, meter, samples: new Float32Array(1024), last: 0, lastUp: 0, thumps: 0 };
  }
  function sound(dt, state, signals, weight) {
    if (!audio) return;
    audio.meter.getFloatTimeDomainData(audio.samples);
    let peak = 0; for (const v of audio.samples) peak = Math.max(peak, Math.abs(v)); level = Math.max(level * 0.9, peak);
    if (weight <= 0 || state.speed === 0 || state.scrub !== null) { audio.breath.gain.setTargetAtTime(0, audio.ac.currentTime, 0.05); return; }
    if (lastBeat < 0.14 && state.beat >= 0.14) { audio.thump(48, 0.14, 0.9); audio.thumps++; }    // "lub": mitral and tricuspid shut
    if (lastBeat < 0.46 && state.beat >= 0.46) { audio.thump(72, 0.09, 0.6); audio.thumps++; }    // "dub": aortic and pulmonary shut
    const flow = dt > 0 ? Math.abs(signals.breath - audio.last) / dt : 0;
    audio.band.frequency.setTargetAtTime(signals.breath > audio.last ? 900 : 520, audio.ac.currentTime, 0.1); audio.last = signals.breath;
    audio.breath.gain.setTargetAtTime(Math.min(0.09, flow * 0.07) * weight, audio.ac.currentTime, 0.08);
  }

  // ---------------------------------------------------------------- the monitor
  function draw(state, weight) {
    ctx.clearRect(0, 0, W, H);
    const frozen = state.scrub !== null || state.speed === 0, irregular = !!CONDITIONS[state.condition]?.irregular;
    ctx.lineWidth = 1.4; ctx.lineJoin = 'round';
    const top = 14, ecgBase = 52, ecgGain = 34, breathBase = 88, breathGain = 20;
    if (frozen) {
      // one whole beat, with the phases shaded in turn and a marker where the heart is held
      let from = 0;
      BEAT_PHASES.forEach((ph, i) => { ctx.fillStyle = i % 2 ? '#f5b39c14' : '#f5b39c05'; ctx.fillRect(from * W, top, (ph.until - from) * W, 50); from = ph.until; });
      ctx.strokeStyle = '#8fe0b4'; ctx.beginPath();
      for (let x = 0; x <= W; x++) { const y = ecgBase - ecg(x / W, irregular, x * 0.02) * ecgGain; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
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
      trace.push({ t: clock, ecg: ecg(state.beat, !!CONDITIONS[state.condition]?.irregular, clock), breath: Math.min(1.7, signals.breath) / 1.7 });
      while (trace.length && clock - trace[0].t > SECONDS) trace.shift();
    }
    sound(dt, state, signals, weight);
    lastBeat = state.beat;
    if (!canvas.parentElement.hidden) draw(state, weight);
    // the phase read-out beside the scrubber
    const ph = beatPhase(state.beat);
    if (el('beat-phase').textContent !== ph.name) { el('beat-phase').textContent = ph.name; el('beat-note').textContent = ph.note; el('beat-scrub').setAttribute('aria-valuetext', ph.name); }
    if (state.scrub === null && document.activeElement !== el('beat-scrub')) el('beat-scrub').value = Math.round(state.beat * 1000);
  }

  // ---------------------------------------------------------------- controls
  /** Bring every control into line with the engine, and say the state in words for a screen reader. */
  function show() {
    const s = life.getState(), cond = CONDITIONS[s.condition];
    el('rate-heart').value = s.bpm; el('rate-heart-out').textContent = `${Math.round(s.bpm)} a minute`; el('rate-heart').setAttribute('aria-valuetext', `${Math.round(s.bpm)} beats a minute`);
    el('rate-breath').value = s.breaths; el('rate-breath-out').textContent = `${Math.round(s.breaths)} a minute`; el('rate-breath').setAttribute('aria-valuetext', `${Math.round(s.breaths)} breaths a minute`);
    el('condition').value = s.condition; el('condition-note').textContent = cond.note;
    for (const b of document.querySelectorAll('[data-preset]')) { const p = b.dataset.preset === 'exercise' ? EXERCISE : REST, on = s.condition === 'normal' && s.bpm === p.bpm && s.breaths === p.breaths; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); }
    el('vitals-text').textContent = `${cond.name}. Heart ${Math.round(s.bpm)} beats a minute, breathing ${Math.round(s.breaths)} a minute${s.speed !== 1 ? `, shown at ${s.speed === 0 ? 'a standstill' : `${s.speed} times real speed`}` : ''}.`;
  }
  el('rate-heart').oninput = e => { life.setRates({ bpm: Number(e.target.value) }); show(); onChange(); };
  el('rate-breath').oninput = e => { life.setRates({ breaths: Number(e.target.value) }); show(); onChange(); };
  for (const b of document.querySelectorAll('[data-preset]')) b.onclick = () => { life.setCondition('normal'); life.setRates(b.dataset.preset === 'exercise' ? EXERCISE : REST); show(); onChange(); };
  el('condition').replaceChildren(...Object.entries(CONDITIONS).map(([id, c]) => new Option(c.name, id)));
  el('condition').onchange = e => { life.setCondition(e.target.value); show(); onChange(); };
  el('life-speed').onchange = e => { life.setSpeed(Number(e.target.value)); show(); onChange(); };
  el('beat-scrub').oninput = e => { life.scrub(Number(e.target.value) / 1000); el('beat-release').hidden = false; onChange(); };
  el('beat-release').onclick = () => { life.scrub(null); el('beat-release').hidden = true; onChange(); };
  let parked = null;   // switched off, the audio context is suspended and kept: closing one can stall the page, and browsers cap how many may be made
  const setSound = on => { if (on && !audio) { if (parked) { audio = parked; parked = null; audio.ac.resume(); } else audio = startSound(); } else if (!on && audio) { audio.ac.suspend(); parked = audio; audio = null; level = 0; } el('sound-toggle').setAttribute('aria-pressed', !!audio); onChange(); };
  el('sound-toggle').onclick = () => setSound(!audio);
  const setMonitor = on => { shown = !!on; el('monitor-toggle').setAttribute('aria-pressed', shown); onChange(); };
  el('monitor-toggle').onclick = () => setMonitor(!shown);
  setMonitor(false);
  show();
  return { frame, show, setMonitor, setSound, get monitor() { return shown; }, getState: () => ({ sound: !!audio, level: +level.toFixed(4), thumps: audio?.thumps ?? 0, monitor: shown, samples: trace.length }) };
}
