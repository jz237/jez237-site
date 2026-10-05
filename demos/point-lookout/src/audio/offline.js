// Offline render of the live soundscape (audio.js) for the video export (tools/video.mjs).
//
// The same graph, mix and event schedule as the live audio, rendered with an OfflineAudioContext
// against the visual timeline: audio time 0 = visual time t0, so a crash is heard d/343 s after its
// white water appears in frame, exactly as live. The render starts `preroll` seconds early (crash
// tails, wind automation and the compressor settle), which is trimmed off; the clip gets short
// fades at both ends.
import { buildSoundscape, makeSampleDataAsync, loadSurfModel, LEVELS } from './audio.js';

const LEAD_CTL = 0.25, LEAD_EV = 0.6; // as the live update(): parameter ramps / event look-ahead (s)

export const MAX_SECONDS = 1800; // the OfflineAudioContext holds the whole clip (~0.4 MB/s) in memory

let pcm = null; // interleaved float32 of the last render, fetched in chunks by audioChunk()

// Renders the clip and keeps it in this page; returns { rate, channels, frames, peak }.
export async function renderAudio(ctx, t0, dur, opts = {}) {
  const rate = opts.rate || 48000;
  const preroll = opts.preroll ?? 4;
  const fade = opts.fade ?? 0.5;
  const tier = opts.tier || ctx.quality?.tier || 'high';
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) throw new Error('OfflineAudioContext is not available');
  if (!(dur > 0) || dur > MAX_SECONDS) throw new Error(`audio duration must be 0..${MAX_SECONDS} s (got ${dur})`);
  pcm = null;

  const total = preroll + dur;
  const ac = new OAC({ numberOfChannels: 2, length: Math.ceil(total * rate), sampleRate: rate });
  const data = await makeSampleDataAsync(tier);
  const surf = await loadSurfModel(ctx.modules?.ocean);
  const oc = ctx.modules?.ocean;
  const breakerSource = oc && typeof oc.breakerEvents === 'function' ? (a, b) => oc.breakerEvents(a, b) : null;
  const sc = buildSoundscape(ac, { gustAt: ctx.wind.gustAt, data, tier, breakerSource, surf, reverb: 'taps' });

  const base = t0 - preroll; // visual time at audio time 0
  const toAudio = (tv) => tv - base;
  const schedule = () => {
    const now = ac.currentTime;
    const tv = base + now;
    sc.scheduleControls(tv, tv + LEAD_CTL, toAudio, now);
    sc.scheduleEvents(tv, tv + LEAD_EV, toAudio, now);
  };
  sc.master.gain.setValueAtTime(LEVELS.master, 0);
  sc.startSources(0);
  schedule();
  // schedule incrementally at suspend points (render-quantum aligned) so ac.currentTime advances as
  // it does live: the far-voice cap in playBreaker() frees voices by currentTime
  const quantum = 128 / rate;
  const step = Math.round(0.1 / quantum) * quantum;
  for (let k = 1; k * step < total; k++) {
    ac.suspend(k * step).then(() => { schedule(); ac.resume(); });
  }
  const buf = await ac.startRendering();

  const skip = Math.round(preroll * rate);
  const frames = Math.round(dur * rate);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  const out = new Float32Array(frames * 2);
  const nf = Math.max(1, Math.round(fade * rate));
  let peak = 0;
  for (let i = 0; i < frames; i++) {
    const g = Math.min(1, i / nf, (frames - 1 - i) / nf);
    const l = (L[skip + i] || 0) * g, r = (R[skip + i] || 0) * g;
    out[2 * i] = l; out[2 * i + 1] = r;
    peak = Math.max(peak, Math.abs(l), Math.abs(r));
  }
  pcm = out;
  return { rate, channels: 2, frames, peak };
}

// base64 of `n` interleaved stereo frames from frame `i0` of the last render (keep n to ~30 s: one
// base64 string of the whole clip would hit the browser's string length limit after ~17 min)
export function audioChunk(i0, n) {
  if (!pcm) throw new Error('no audio rendered');
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset + 8 * i0, 8 * Math.max(0, Math.min(n, pcm.length / 2 - i0)));
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function releaseAudio() { pcm = null; }
