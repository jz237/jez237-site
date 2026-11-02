// General MIDI music for the Descent II web page: plays the game's own songs
// (converted from .hmp to MIDI by the engine) through SpessaSynth with the
// GeneralUser GS sound bank. Bundled by build.mjs into web/synth/d2synth.js.

import { WorkletSynthesizer, Sequencer } from 'spessasynth_lib';

const base = new URL('.', import.meta.url);
let ctx = null;
let synth = null;
let seq = null;
let out = null;
let meter = null;
let loading = null;
let volume = 0.75;
let current = null; // the latest play request; a newer request or stop() replaces it
let state = 'stopped';

async function init() {
  ctx = new AudioContext({ latencyHint: 'playback' });
  await ctx.audioWorklet.addModule(new URL('spessasynth_processor.min.js', base));
  synth = new WorkletSynthesizer(ctx);
  synth.setLogLevel(false, false, false); // no 'missing preset' chatter before the bank loads
  out = ctx.createGain();
  out.gain.value = volume;
  synth.connect(out);
  out.connect(ctx.destination);
  meter = ctx.createAnalyser();
  meter.fftSize = 2048;
  out.connect(meter);
  const bank = await fetch(new URL('GeneralUserGS.sf3', base));
  if (!bank.ok) throw new Error(`sound bank: HTTP ${bank.status}`);
  await synth.soundBankManager.addSoundBank(await bank.arrayBuffer(), 'main');
  await synth.isReady;
  seq = new Sequencer(synth);
}

// Starts downloading the sound bank; safe to call repeatedly.
export function load() {
  if (!loading) loading = init();
  return loading;
}

export async function play(bytes, loop) {
  const request = { bytes, loop };
  current = request;
  await load();
  if (current !== request) return; // stopped or replaced while the bank loaded
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
  synth.stopAll(true);
  seq.loadNewSongList([{ binary: bytes.buffer, fileName: 'descent.mid' }]);
  seq.loopCount = loop ? Infinity : 0;
  seq.play();
  state = 'playing';
}

export function stop() {
  current = null;
  state = 'stopped';
  if (!seq) return;
  seq.pause();
  synth.stopAll(true);
}

export function pause() {
  if (state !== 'playing') return;
  state = 'paused';
  seq.pause();
  synth.stopAll(false);
}

export function resume() {
  if (state !== 'paused') return;
  state = 'playing';
  seq.play();
}

export function toggle() {
  if (state === 'playing') pause(); else resume();
}

export function setVolume(v) {
  volume = v;
  if (out) out.gain.value = v;
}

// For tests: what the synth is doing right now, with the output's RMS and peak level.
export function status() {
  let rms = 0;
  let peak = 0;
  if (meter) {
    const buf = new Float32Array(meter.fftSize);
    meter.getFloatTimeDomainData(buf);
    for (const v of buf) {
      rms += v * v;
      peak = Math.max(peak, Math.abs(v));
    }
    rms = Math.sqrt(rms / buf.length);
  }
  return {
    rms,
    peak,
    state,
    loaded: !!seq,
    time: seq ? seq.currentTime : 0,
    paused: seq ? seq.paused : true,
    volume,
    context: ctx ? ctx.state : 'none',
  };
}
