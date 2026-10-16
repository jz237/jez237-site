// WebAudio graph for the intro: master chain, per-session buses/reverbs, and sample-accurate event playback.
// The same code drives the realtime AudioContext and the OfflineAudioContext (renderOffline).

import { noiseBuffer, staticBuffer, impulseResponse } from './synth.js';
import { relate } from './spatial.js';

export const dB = (d) => Math.pow(10, d / 20);

// Each DynamicsCompressorNode delays its output by a 6 ms look-ahead (measured in Chrome: exactly 288 samples
// at 48 kHz). The master has two (bus compressor + limiter): the film clock and the offline render compensate.
export const CHAIN_LATENCY = 0.012;

// Web Audio's compressor applies automatic makeup gain = (1 / curve(1.0))^0.6. With a hard knee the curve at 0 dBFS
// is T(1 - 1/R) dB, so the makeup is -0.6 T (1 - 1/R) dB; we cancel it so levels mean what they say.
function makeupDb(threshold, ratio) {
  return -0.6 * threshold * (1 - 1 / ratio);
}

export const MASTER_DEFAULTS = {
  drive: 11.7, // dB into the bus compressor (sets overall loudness: -16 LUFS integrated)
  compThreshold: -8, compRatio: 1.8, compAttack: 0.03, compRelease: 0.25,
  limThreshold: -1.6, limRatio: 20, limAttack: 0.001, limRelease: 0.08,
  ceiling: -1.5, // dB after the limiter (keeps true peak <= -1 dBTP with margin)
};

export function createMaster(ctx, opts = {}) {
  const o = { ...MASTER_DEFAULTS, ...opts };
  const input = ctx.createGain();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 30; hp.Q.value = 0.707;
  const drive = ctx.createGain();
  drive.gain.value = dB(o.drive);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = o.compThreshold; comp.knee.value = 0; comp.ratio.value = o.compRatio;
  comp.attack.value = o.compAttack; comp.release.value = o.compRelease;
  const compMk = ctx.createGain();
  compMk.gain.value = dB(-makeupDb(o.compThreshold, o.compRatio));
  const lim = ctx.createDynamicsCompressor();
  lim.threshold.value = o.limThreshold; lim.knee.value = 0; lim.ratio.value = o.limRatio;
  lim.attack.value = o.limAttack; lim.release.value = o.limRelease;
  const limMk = ctx.createGain();
  limMk.gain.value = dB(-makeupDb(o.limThreshold, o.limRatio) + o.ceiling);
  const mute = ctx.createGain();
  input.connect(hp).connect(drive).connect(comp).connect(compMk).connect(lim).connect(limMk).connect(mute);
  mute.connect(ctx.destination);
  return { input, mute, comp, lim, opts: o };
}

// ------------------------------------------------------------------------------------------------ automation
// keys: [[filmTime, value, mode?]] with mode 'lin' (default), 'step', 'exp'. Evaluated at the session start so a
// session started mid-film lands on the right value, then the remaining keys are scheduled.
function evalKeys(keys, t) {
  if (!keys.length) return undefined;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, m1] = keys[i];
    if (t < t1) {
      const [t0, v0] = keys[i - 1];
      if (m1 === 'step') return v0;
      const u = (t - t0) / Math.max(1e-9, t1 - t0);
      if (m1 === 'exp' && v0 > 0 && v1 > 0) return v0 * Math.pow(v1 / v0, u);
      return v0 + (v1 - v0) * u;
    }
  }
  return keys[keys.length - 1][1];
}

export function applyKeys(param, keys, s, from = s.filmStart) {
  if (!keys || !keys.length) return;
  const k = keys.slice().sort((a, b) => a[0] - b[0]);
  const t0 = Math.max(from, s.filmStart);
  const at0 = s.ctxOf(t0);
  param.setValueAtTime(evalKeys(k, t0), at0);
  for (const [t, v, m] of k) {
    if (t <= t0) continue;
    const at = s.ctxOf(t);
    if (m === 'step') param.setValueAtTime(v, at);
    else if (m === 'exp' && v > 0) param.exponentialRampToValueAtTime(v, at);
    else param.linearRampToValueAtTime(v, at);
  }
}

// ------------------------------------------------------------------------------------------------ session
export function createSession(ctx, master, assets, opt) {
  const s = {
    ctx,
    filmStart: opt.filmStart,
    ctxStart: opt.ctxStart,
    camera: opt.camera,
    anchor: opt.anchor || (() => null), // name -> {x, y, z}
    active: new Set(),
    stopped: false,
  };
  s.ctxOf = (t) => s.ctxStart + (t - s.filmStart);
  const G = (v = 1) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const BQ = (type, f, q = 0.707, gain = 0) => {
    const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; b.gain.value = gain; return b;
  };

  // session fader (stop / skip) -> master
  const out = G(1);
  out.connect(master.input);
  // intro cut (hard cut to black); the long tail reverb and the title bus bypass it
  const cut = G(1);
  cut.connect(out);
  // exterior world: muffled when the refuge door shuts
  const ext = G(1);
  const extMuffle = BQ('lowpass', 20000, 0.5);
  const extLevel = G(1);
  ext.connect(extMuffle).connect(extLevel).connect(cut);
  const int = G(1);
  int.connect(cut);
  const close = G(1);
  close.connect(cut);
  // TV in 3607 heard through its window: small speaker + glass
  const tv = G(1);
  const tvHp = BQ('highpass', 230, 0.8);
  const tvRes1 = BQ('peaking', 950, 1.3, 5);
  const tvRes2 = BQ('peaking', 2600, 1.6, 3);
  const tvLp = BQ('lowpass', 5200, 0.7);
  const tvSat = ctx.createWaveShaper();
  {
    const n = 1024; const c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(1.8 * x) / Math.tanh(1.8); }
    tvSat.curve = c; tvSat.oversample = '2x';
  }
  const glassLp = BQ('lowpass', 1900, 0.6);
  const glassRes = BQ('peaking', 380, 1.0, 3);
  tv.connect(tvHp).connect(tvRes1).connect(tvRes2).connect(tvLp).connect(tvSat).connect(glassLp).connect(glassRes).connect(ext);
  const title = G(1);
  title.connect(out);

  // reverbs
  const conv = (kind) => { const c = ctx.createConvolver(); c.normalize = false; c.buffer = impulseResponse(ctx, kind); return c; };
  const streetIn = G(1);
  const street = conv('street');
  streetIn.connect(street).connect(extMuffle); // the street's reverb is outside too
  const roomIn = G(1);
  const room = conv('room');
  roomIn.connect(room).connect(cut);
  const tailIn = G(1);
  const tail = conv('tail');
  tailIn.connect(tail).connect(out);
  const tailSend = G(1); // intro sends into the tail are cut with the picture; the tail itself rings on
  tailSend.connect(tailIn);

  s.nodes = { out, cut, ext, extMuffle, extLevel, int, close, tv, title, streetIn, roomIn, tailIn, tailSend };
  const busOf = { ext, int, close, tv, title };
  const sendOf = { street: streetIn, room: roomIn, tail: tailSend, tailTitle: tailIn };

  // session-level automation: { 'extMuffle.frequency': keys, 'extLevel.gain': keys(dB) ... }
  s.automate = (spec) => {
    for (const [name, keys] of Object.entries(spec || {})) {
      const [node, param] = name.split('.');
      const p = s.nodes[node] && s.nodes[node][param];
      if (!p) continue;
      const isGain = param === 'gain';
      applyKeys(p, keys.map(([t, v, m]) => [t, isGain ? dB(v) : v, m]), s);
    }
  };

  const track = (src, list, extra = []) => {
    const rec = { src, list, extra };
    s.active.add(rec);
    src.onended = () => {
      s.active.delete(rec);
      for (const n of list) { try { n.disconnect(); } catch (e) { /* already */ } }
    };
  };

  // ---------------------------------------------------------------------------------------- play one event
  s.play = (ev) => {
    if (s.stopped) return;
    const rate = ev.rate || 1;
    let a = null;
    let buffer = null;
    if (ev.snd) {
      a = assets.get(ev.snd);
      if (!a) return;
      buffer = a.buffer;
    } else if (ev.synth === 'static') buffer = staticBuffer(ctx);
    else if (ev.synth === 'noise') buffer = noiseBuffer(ctx, ev.color || 'pink', 4, ev.seed || 'n');
    const isOsc = ev.synth === 'drone';
    const loop = !!ev.loop || ev.synth === 'static' || ev.synth === 'noise';
    const loopStart = a && a.loop ? a.loop[0] : 0;
    const loopEnd = a && a.loop ? a.loop[1] : (buffer ? buffer.duration : 0);
    const anchorShift = ev.anchor === 'onset' && a ? (a.onset || 0) / rate : 0;
    let offset = ev.offset != null ? ev.offset : (loop && a && a.loop ? loopStart : 0);
    let startFilm = ev.t - anchorShift;
    let endFilm;
    if (ev.end != null) endFilm = ev.end;
    else if (ev.dur != null) endFilm = startFilm + ev.dur;
    else if (loop || isOsc) endFilm = Infinity;
    else endFilm = startFilm + (buffer.duration - offset) / rate;
    if (endFilm <= s.filmStart) return;
    const evStart = startFilm;
    if (startFilm < s.filmStart) {
      const skip = (s.filmStart - startFilm) * rate;
      offset += skip;
      if (loop && buffer) {
        const L = loopEnd - loopStart;
        if (offset >= loopEnd && L > 0) offset = loopStart + ((offset - loopStart) % L);
      } else if (buffer && offset >= buffer.duration) return;
      startFilm = s.filmStart;
    }
    const when = s.ctxOf(startFilm);

    const list = [];
    let src;
    if (isOsc) {
      // a small bank of oscillators summed into one gain
      src = ctx.createGain();
      src.gain.value = 1;
      const oscs = [];
      for (const [f, amp, type] of ev.partials) {
        const o = ctx.createOscillator();
        o.type = type || 'sine';
        o.frequency.value = f;
        const g = G(amp);
        o.connect(g).connect(src);
        o.start(when);
        if (endFilm !== Infinity) o.stop(s.ctxOf(endFilm) + 0.05);
        oscs.push(o);
        list.push(o, g);
      }
      src._oscs = oscs;
    } else {
      src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = rate;
      if (loop) { src.loop = true; src.loopStart = loopStart; src.loopEnd = loopEnd; }
      if (ev.rateKeys) applyKeys(src.playbackRate, ev.rateKeys, s, startFilm);
    }
    list.push(src);
    let node = src;
    for (const f of [].concat(ev.filter || [])) {
      const b = BQ(f.type || 'lowpass', f.freq || 1000, f.q ?? 0.707, f.gain || 0);
      if (f.freqKeys) applyKeys(b.frequency, f.freqKeys, s, startFilm);
      node.connect(b); node = b; list.push(b);
    }
    // level envelope: base level, fades, keyframes (dB, absolute film time)
    const g = G(0);
    node.connect(g); node = g; list.push(g);
    const base = ev.gain ?? 0;
    const keys = [];
    const fi = ev.fadeIn || 0;
    const fo = ev.fadeOut || 0;
    const envKeys = (ev.env || []).map(([t, d, m]) => [t, dB(d), m]);
    const levelAt = (t) => (envKeys.length ? evalKeys(envKeys, t) : dB(base));
    if (fi > 0) { keys.push([evStart, 0]); keys.push([evStart + fi, levelAt(evStart + fi)]); } else keys.push([evStart, levelAt(evStart), 'step']);
    for (const k of envKeys) if (k[0] > evStart + fi && (endFilm === Infinity || k[0] < endFilm - fo)) keys.push(k);
    if (endFilm !== Infinity) {
      if (fo > 0) { keys.push([endFilm - fo, levelAt(endFilm - fo)]); keys.push([endFilm, 0]); } else keys.push([endFilm, 0, 'step']);
    }
    keys.sort((x, y) => x[0] - y[0]);
    applyKeys(g.gain, keys, s, startFilm);
    if (ev.gateKeys) { // multiplicative chops (linear 0..1), e.g. a broadcast breaking up
      const gg = G(1);
      applyKeys(gg.gain, ev.gateKeys, s, startFilm);
      node.connect(gg); node = gg; list.push(gg);
    }

    // sends (post-level, pre-pan)
    for (const [name, d] of Object.entries(ev.send || {})) {
      const dst = sendOf[name];
      if (!dst) continue;
      const sg = G(dB(d));
      g.connect(sg).connect(dst);
      list.push(sg);
    }
    // placement
    if (ev.pos || ev.pan != null || ev.panKeys) {
      const p = ctx.createStereoPanner();
      list.push(p);
      if (ev.pos && s.camera) {
        const t1 = endFilm === Infinity ? startFilm + (ev.trackFor || 30) : Math.min(endFilm, startFilm + (ev.trackFor || 60));
        const step = Math.max(0.05, (t1 - startFilm) / 200);
        const panK = [];
        const distK = [];
        const lpK = [];
        for (let t = startFilm; t <= t1 + 1e-6; t += step) {
          const cam = s.camera(t);
          let pos = typeof ev.pos === 'function' ? ev.pos(t) : ev.pos;
          if (typeof pos === 'string') pos = s.anchor(pos);
          if (!cam || !pos) continue;
          const r = relate(cam, pos);
          panK.push([t, r.pan * (ev.panScale ?? 0.75)]);
          if (ev.ref) distK.push([t, dB(Math.max(-24, Math.min(6, -20 * Math.log10(Math.max(0.4, r.dist) / ev.ref))))]);
          lpK.push([t, r.behind ? 5200 : 18000]);
        }
        applyKeys(p.pan, panK, s, startFilm);
        if (distK.length) {
          const dg = G(1);
          applyKeys(dg.gain, distK, s, startFilm);
          node.connect(dg); node = dg; list.push(dg);
        }
        const blp = BQ('lowpass', 18000, 0.6);
        applyKeys(blp.frequency, lpK, s, startFilm);
        node.connect(blp); node = blp; list.push(blp);
      } else if (ev.panKeys) applyKeys(p.pan, ev.panKeys, s, startFilm);
      else p.pan.value = ev.pan;
      node.connect(p); node = p;
    }
    node.connect(busOf[ev.bus || 'ext'] || ext);
    if (!isOsc) {
      src.start(when, Math.max(0, offset));
      if (endFilm !== Infinity) src.stop(s.ctxOf(endFilm) + 0.02);
      track(src, list);
    } else {
      const o0 = src._oscs[0];
      if (o0) track(o0, list, src._oscs.slice(1));
    }
  };

  // fade the whole session out and release it
  s.fadeOut = (dur = 0.25) => {
    if (s.stopped) return;
    s.stopped = true;
    const now = ctx.currentTime;
    const gp = out.gain;
    gp.cancelScheduledValues(now);
    gp.setValueAtTime(gp.value, now);
    gp.linearRampToValueAtTime(0, now + dur);
    const end = now + dur + 0.03;
    for (const rec of s.active) {
      for (const n of [rec.src, ...rec.extra]) { try { n.stop(end); } catch (e) { /* not started */ } }
    }
    if (ctx instanceof AudioContext) {
      setTimeout(() => { try { out.disconnect(); } catch (e) { /* gone */ } }, (dur + 0.3) * 1000);
    }
  };
  return s;
}
