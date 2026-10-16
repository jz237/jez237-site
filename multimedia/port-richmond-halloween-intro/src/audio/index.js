// PORT RICHMOND: Halloween intro - sound design engine (WebAudio).
//
//   import { createAudio } from './audio/index.js';
//   const audio = createAudio({ baseUrl: 'assets/audio/' });   // optional: events, camera, master
//   await audio.load((p) => bar.value = p);                     // fetch + decode (no AudioContext needed yet)
//   startButton.onclick = () => audio.start(0);                 // must be called from the user gesture
//   renderLoop: const t = audio.currentTime;                    // film seconds: the master clock while playing
//   audio.setMuted(true);  audio.skipToTitle();  audio.stop();
//   const buf = await audio.renderOffline(88);                  // AudioBuffer (48 kHz stereo), same graph code
//
// Sample-accurate: every event is scheduled with AudioBufferSourceNode.start(when, offset) against cue times from
// src/film/cues.js. The master's compressor look-ahead (12 ms) is compensated in the clock and the offline render.

import { CUES, FILM } from '../film/cues.js';
import { buildScore, titleEvents, EAS_TEXT, SOUND_PLACES, normTimes } from './score.js';
import { createMaster, createSession, CHAIN_LATENCY } from './mixer.js';
import { placeholderCamera, adaptCamera } from './spatial.js';

export { EAS_TEXT, SOUND_PLACES, CHAIN_LATENCY };

const SR = 48000;
const LOOKAHEAD = 4.0; // seconds of events scheduled ahead of the render clock
const LOOKAHEAD_HIDDEN = 14.0; // background tabs throttle timers to ~1 Hz
const TICK_MS = 200;

const evStart = (e) => e.t - (e.anchor === 'onset' ? 0.12 : 0) - 0.02;
const sortEvents = (list) => list.map((e) => ({ ...e, _start: evStart(e) })).sort((a, b) => a._start - b._start);

function onsetOf(buffer) {
  // same rule as tools/audio/build_assets.py: 1 ms RMS envelope reaches 10% of its maximum
  const d = buffer.getChannelData(0);
  const n = Math.max(1, Math.round(buffer.sampleRate * 0.001));
  const e = new Float32Array(Math.max(1, d.length - n));
  let acc = 0;
  for (let i = 0; i < n && i < d.length; i++) acc += d[i] * d[i];
  let mx = 0;
  for (let i = 0; i < e.length; i++) {
    e[i] = Math.sqrt(Math.max(0, acc) / n); // the running sum can drift below zero after loud passages
    if (e[i] > mx) mx = e[i];
    acc += d[i + n] * d[i + n] - d[i] * d[i];
  }
  for (let i = 0; i < e.length; i++) if (e[i] >= mx * 0.1) return i / buffer.sampleRate;
  return 0;
}

async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; await fn(items[k], k); }
  });
  await Promise.all(workers);
}

async function tryImport(rel) {
  try { return await import(new URL(rel, import.meta.url).href); } catch (e) { return null; }
}

// Event data from the other departments, imported defensively (placeholders built from cues.js otherwise):
//   src/props/timings.js  (pure JS, the props' deterministic simulations): railTaps, windGusts, tvState(), and v2's
//                         animatronicClacks (DRESS); v1-only exports (binImpacts, keyJingles, phoneBuzzTimes, ...)
//                         are still read defensively but go unused once their cues are NEVER
//   src/world/flicker.js  FLICKER_EPISODES + flickerAt(t) (the failing streetlight)
//   src/film/shots.js     (lead, v2) cameraAt(t) -> {position, lookAt}; shotAt(t).space; footstep times
//   src/film/choreo.js    (lead) breathTimesFacepaint (Act 2's under-car breath/puddle rhythm)
// Anything passed explicitly in createAudio({ events, camera }) wins. src/film/camera.js (v1's one-continuous-walk
// path) is deliberately NOT read here: until shots.js exists we use the v2 placeholder camera built from
// CUES/PLACES (spatial.js) instead, which is far closer to the real cut-based v2 blocking.
async function resolveExternal(given = {}) {
  const out = { ...given };
  const has = (m, k) => m && m[k] !== undefined;
  const props = (await tryImport('../props/timings.js')) || (await tryImport('../props/index.js'));
  if (props) {
    out.railTapTimes ??= has(props, 'railTaps') ? props.railTaps : props.railTapTimes;
    out.binImpactTimes ??= has(props, 'binImpacts') ? props.binImpacts : props.binImpactTimes;
    out.keyJingles ??= props.keyJingles;
    out.doorImpactTimes ??= props.doorImpactTimes;
    out.carRattleTimes ??= props.carRattleTimes;
    out.carBRockTimes ??= props.carBRockTimes;
    out.carAClangTimes ??= props.carAClangTimes;
    out.carBClangTime ??= props.carBClangTime;
    out.underbodyClangTimes ??= props.underbodyClangTimes;
    out.windGusts ??= props.windGusts;
    out.windowImpactTimes ??= props.windowImpactTimes;
    out.animatronicClacks ??= props.animatronicClacks;
    out.feetTrack ??= props.feetTrack || props.walkerFeetTrack;
    if (typeof props.tvState === 'function') out.tvState ??= props.tvState;
  }
  if (!out.flickerTimes && !out.flickerAt && !out.flickerEvents) {
    const fl = (await tryImport('../world/flicker.js')) || (await tryImport('../world/index.js'));
    if (fl) {
      if (typeof fl.flickerAt === 'function') out.flickerAt = fl.flickerAt;
      out.flickerTimes ??= fl.FLICKER_EPISODES || fl.flickerTimes;
      out.flickerEvents ??= fl.FLICKER_EVENTS;
    }
  }
  if (!out.footsteps || !out.camera || !out.shotAt) {
    const shots = await tryImport('../film/shots.js');
    if (shots) {
      out.camera ??= shots.cameraAt;
      out.shotAt ??= shots.shotAt;
      if (!out.footsteps) {
        const fs = shots.footstepTimes || shots.footsteps || shots.FOOTSTEPS;
        out.footsteps = typeof fs === 'function' ? fs() : fs;
      }
    }
  }
  if (!out.breathTimesFacepaint) {
    const ch = await tryImport('../film/choreo.js');
    const bt = ch && (ch.breathTimesFacepaint || ch.breathTimes);
    if (bt) out.breathTimesFacepaint = typeof bt === 'function' ? bt() : bt;
  }
  const sources = {};
  for (const k of ['railTapTimes', 'windGusts', 'footsteps', 'breathTimesFacepaint', 'feetTrack'])
    sources[k] = normTimes(out[k]) ? `external (${out[k].length})` : 'placeholder';
  // animatronicClacks is DRESS's { laugh1: [...], laugh2: [...] } object (not a flat array), so normTimes alone
  // can't see into it; check both the object shape and the older flat-array shape before calling it a placeholder.
  const ac = out.animatronicClacks;
  sources.animatronicClacks = normTimes(ac) ? `external (${ac.length})`
    : (ac && (normTimes(ac.laugh1) || normTimes(ac.laugh2))) ? `external (laugh1:${ac.laugh1?.length ?? 0}, laugh2:${ac.laugh2?.length ?? 0})`
    : 'placeholder';
  sources.flicker = out.flickerEvents ? 'external (FLICKER_EVENTS)' : out.flickerAt ? 'external (flickerAt)' : normTimes(out.flickerTimes) ? 'external' : 'placeholder';
  sources.tvState = out.tvState ? 'external' : 'placeholder';
  sources.camera = out.camera ? 'external (shots.js)' : 'placeholder (CUES/PLACES)';
  out._sources = sources;
  return out;
}

// a camera function that never throws and falls back per-sample
function safeCamera(fn) {
  const ph = placeholderCamera();
  if (!fn) return ph;
  const f = adaptCamera(fn);
  return (t) => {
    try {
      const p = f(t);
      if (p && Number.isFinite(p.x) && Number.isFinite(p.z) && Number.isFinite(p.yaw)) return p;
    } catch (e) { /* fall back */ }
    return ph(t);
  };
}

export function createAudio({ baseUrl, events = null, camera = null, anchors: anchorsIn = null, master: masterOpts = {} } = {}) {
  let base = baseUrl ? new URL(baseUrl, document.baseURI).href : new URL('../../assets/audio/', import.meta.url).href;
  if (!base.endsWith('/')) base += '/';
  const assets = new Map();
  let manifest = null;
  let ext = null;
  let score = null;
  let camFn = null;
  let loadPromise = null;
  let ctx = null;
  let master = null;
  let muted = false;
  let session = null;
  let queue = [];
  let ptr = 0;
  let timer = null;
  let state = 'idle'; // idle | loading | ready | playing | title | stopped
  let clock = null;
  let lastHeard = 0;
  const anchors = {};
  const toXYZ = (v) => { const p = v && (v.position || v); return p && Number.isFinite(p.x) && Number.isFinite(p.z) ? { x: p.x, y: p.y ?? 1.6, z: p.z } : null; };
  const setAnchors = (...objs) => { for (const o of objs) for (const [k, v] of Object.entries(o || {})) { const p = toXYZ(v); if (p) anchors[k] = p; } };
  const anchorOf = (name) => anchors[name] || SOUND_PLACES[name] || null;

  function heardTime() {
    // the context time currently reaching the listener (includes output latency where the browser reports it)
    let t;
    if (ctx.getOutputTimestamp) {
      const ts = ctx.getOutputTimestamp();
      if (ts && ts.contextTime > 0 && ts.performanceTime > 0) t = ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
    }
    if (t === undefined) t = ctx.currentTime - (ctx.baseLatency || 0) - (ctx.outputLatency || 0);
    t = Math.min(t, ctx.currentTime);
    if (t < lastHeard) t = lastHeard;
    lastHeard = t;
    return t;
  }

  function filmNow() {
    if (!clock) return 0;
    if (clock.frozen !== undefined) return clock.frozen;
    if (clock.mode === 'audio' && ctx && ctx.state !== 'running' && performance.now() - clock.perf0 > 900) {
      clock.mode = 'perf'; // the context never started (no gesture / blocked): keep the picture running
    }
    let t;
    if (clock.mode === 'audio') t = clock.filmStart + (heardTime() - clock.ctxStart) - CHAIN_LATENCY;
    else t = clock.filmStart + (performance.now() - clock.perf0) / 1000;
    t = Math.max(clock.filmStart, t);
    if (clock.last !== undefined && t < clock.last) t = clock.last;
    clock.last = t;
    return t;
  }

  // render-clock film time (scheduling horizon)
  const renderFilmTime = () => (clock && ctx ? clock.filmStart + (ctx.currentTime - clock.ctxStart) : 0);

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      try { ctx = new AC({ sampleRate: SR, latencyHint: 'playback' }); } catch (e) { ctx = new AC(); }
      master = createMaster(ctx, masterOpts);
      master.mute.gain.value = muted ? 0 : 1;
      ctx.onstatechange = () => {
        // audio became available after the picture started on the fallback clock: re-sync the sound to the picture
        if (ctx.state === 'running' && clock && clock.mode === 'perf' && clock.frozen === undefined && (state === 'playing' || state === 'title')) {
          const t = filmNow();
          if (state === 'title') begin(t, true); else begin(t, false);
        }
      };
    }
    // iOS/Safari 17+: play through the ringer switch once the viewer has asked for sound
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* unsupported */ }
    if (ctx.state !== 'running') { try { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ } }
  }

  async function load(onProgress) {
    if (loadPromise) { const r = await loadPromise; onProgress && onProgress(1); return r; }
    state = state === 'idle' ? 'loading' : state;
    loadPromise = (async () => {
      const res = await fetch(base + 'manifest.json');
      if (!res.ok) throw new Error(`audio manifest ${res.status}`);
      manifest = await res.json();
      const ids = Object.keys(manifest.assets);
      const total = manifest.totalBytes || ids.reduce((s, id) => s + (manifest.assets[id].bytes || 1), 0);
      let done = 0;
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const decs = {};
      const decoderFor = (rate) => (decs[rate] ||= new OAC(1, 1, rate)); // band-limited beds decode at lower rates (memory)
      const extP = resolveExternal(events || {});
      await pool(ids, 6, async (id) => {
        const a = manifest.assets[id];
        const r = await fetch(base + a.file);
        if (!r.ok) throw new Error(`audio asset ${a.file} ${r.status}`);
        const ab = await r.arrayBuffer();
        const buffer = await decoderFor(a.decodeRate || SR).decodeAudioData(ab);
        let onset = a.onset || 0;
        if (a.onset !== undefined) {
          // guard against decoders that keep AAC priming: trust the decoded attack if it moved
          const o = onsetOf(buffer);
          if (Math.abs(o - a.onset) > 0.002 && Math.abs(o - a.onset) < 0.12) onset = o;
        }
        assets.set(id, { buffer, dur: buffer.duration, onset, loop: a.loop || null });
        done += a.bytes || 1;
        if (onProgress) onProgress(Math.min(0.99, done / total));
      });
      ext = await extP;
      camFn = safeCamera(camera || ext.camera);
      score = buildScore(ext);
      if (state === 'loading') state = 'ready';
      if (onProgress) onProgress(1);
      return true;
    })();
    return loadPromise;
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function pump() {
    if (!session || !(state === 'playing' || state === 'title')) return;
    const horizon = renderFilmTime() + (typeof document !== 'undefined' && document.hidden ? LOOKAHEAD_HIDDEN : LOOKAHEAD);
    while (ptr < queue.length && queue[ptr]._start <= horizon) session.play(queue[ptr++]);
  }
  function startTimer() {
    stopTimer();
    timer = setInterval(pump, TICK_MS);
  }
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => pump());

  function begin(filmTime, titleOnly, fadeIn) {
    if (session) session.fadeOut(0.06);
    const ctxStart = ctx.currentTime + 0.12;
    session = createSession(ctx, master, assets, { filmStart: filmTime, ctxStart, camera: camFn, anchor: anchorOf });
    if (titleOnly) {
      queue = sortEvents(titleEvents(filmTime, { fadeIn: fadeIn ?? 1.5 }));
    } else {
      session.automate(score.automation);
      queue = sortEvents(score.events);
    }
    ptr = 0;
    lastHeard = 0;
    clock = { mode: ctx.state === 'running' ? 'audio' : (clock && clock.mode === 'perf' ? 'perf' : 'audio'), filmStart: filmTime, ctxStart, perf0: performance.now() + 120 };
    if (clock.mode === 'perf') clock.perf0 = performance.now();
    state = titleOnly ? 'title' : 'playing';
    pump();
    startTimer();
  }

  if (anchorsIn) setAnchors(anchorsIn);
  // assets failed to load: keep a film clock running on performance.now() so the picture still plays
  function silentClock(filmTime, st, err) {
    console.warn('[audio] assets unavailable, running silently:', err && err.message ? err.message : err);
    stopTimer();
    if (session) session.fadeOut(0.06);
    session = null;
    clock = { mode: 'perf', filmStart: Math.max(0, filmTime), perf0: performance.now() };
    state = st;
  }
  const api = {
    load,
    async start(filmTime = 0) {
      ensureContext(); // synchronous: inside the click handler
      try { await load(); } catch (e) { silentClock(filmTime, 'playing', e); return; }
      clock = null;
      begin(Math.max(0, filmTime), false);
    },
    stop() {
      const t = filmNow();
      stopTimer();
      if (session) session.fadeOut(0.06);
      session = null;
      if (clock) clock.frozen = t;
      state = 'stopped';
    },
    setMuted(m) {
      muted = !!m;
      if (master) {
        const g = master.mute.gain;
        const now = ctx.currentTime;
        g.cancelScheduledValues(now);
        g.setValueAtTime(g.value, now);
        g.linearRampToValueAtTime(muted ? 0 : 1, now + 0.03);
      }
    },
    get muted() { return muted; },
    get currentTime() { return filmNow(); },
    get state() { return state === 'playing' && clock && filmNow() >= FILM.duration ? 'title' : state; },
    get context() { return ctx; },
    get sources() { return ext ? ext._sources : null; },
    // Cancel the intro (short fade, no click) and start the title-state bed. The clock jumps to `filmTime`
    // (default FILM.duration: the held title state). If the film is already in its title section, nothing restarts.
    async skipToTitle(filmTime) {
      ensureContext();
      const now = clock ? filmNow() : 0;
      try { await load(); } catch (e) { silentClock(filmTime ?? Math.max(FILM.duration, now), 'title', e); return; }
      if (session && state === 'playing' && now >= CUES.titleFadeIn + 0.5) { state = 'title'; return; }
      if (state === 'title' && session) return;
      if (session) session.fadeOut(0.25);
      session = null;
      clock = null;
      begin(filmTime ?? Math.max(FILM.duration, now), true, 1.5);
    },
    // Offline render through the same graph: AudioBuffer of `duration` s at 48 kHz, aligned to film time
    // (compressor look-ahead removed). opts: { from, solo: [tag prefixes], mute: [tag prefixes], master: {...} }
    async renderOffline(duration = FILM.duration, opts = {}) {
      await load();
      const from = opts.from || 0;
      const len = Math.ceil(duration * SR);
      const lat = Math.round(CHAIN_LATENCY * SR);
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const oc = new OAC(2, len + lat + 256, SR);
      const m = createMaster(oc, { ...masterOpts, ...(opts.master || {}) });
      const s = createSession(oc, m, assets, { filmStart: from, ctxStart: 0, camera: camFn, anchor: anchorOf });
      s.automate(score.automation);
      let evs = score.events;
      if (opts.solo) evs = evs.filter((e) => opts.solo.some((p) => e.tag.startsWith(p)));
      if (opts.mute) evs = evs.filter((e) => !opts.mute.some((p) => e.tag.startsWith(p)));
      const end = from + duration;
      for (const e of sortEvents(evs)) if (e._start < end) s.play(e);
      const rendered = await oc.startRendering();
      const out = oc.createBuffer(2, len, SR);
      for (let c = 0; c < 2; c++) out.getChannelData(c).set(rendered.getChannelData(c).subarray(lat, lat + len));
      return out;
    },
    // the cue sheet actually scheduled (for docs/tools)
    cueSheet() {
      if (!score) return [];
      return score.events.filter((e) => e.t < FILM.duration + 10).map((e) => ({
        t: +e.t.toFixed(3), tag: e.tag, snd: e.snd || e.synth, gain: e.gain ?? (e.env ? e.env[0][1] : 0), bus: e.bus || 'ext',
        source: e.snd && manifest ? manifest.assets[e.snd]?.source : 'runtime synth',
      })).sort((a, b) => a.t - b.t);
    },
    get manifest() { return manifest; },
    // World positions for positioned sounds, e.g. audio.setAnchors(props.anchors, world.anchors) after loading them.
    // Accepts { name: THREE.Vector3 | { position } | { x, y, z } }; names used: see SOUND_PLACES in score.js.
    setAnchors,
    // tools: tap the final (post-mute) output, e.g. with an AnalyserNode
    _tap(node) { if (master) master.mute.connect(node); },
  };
  return api;
}
