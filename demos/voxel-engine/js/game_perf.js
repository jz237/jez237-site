// Performance readout: a compact always-on summary and the F3 detail view
// with a rolling frame graph. Per-frame work is a few array writes and (with
// F3 open) one canvas column; text is rebuilt five times a second.
//
// The graph is there to make a bad frame impossible to miss and easy to
// blame: every column is the frame's time with the main-thread share stacked
// inside it by cause (sim, mesh, draw), and a frame well over what the
// display has been getting is flagged to the full height of the graph,
// counted, and named in the text below with whatever cost the most in it.
import { OUT, PFLAG, PROF } from './engine.js';

const HISTORY = 240;
// Height of the graph in ms: the first of these that leaves the typical
// frame in the lower half (a 60 Hz display reads against 16.7 and 33.3 ms
// guides, a machine at 15 fps against 66.7 and 133).
const GRAPH_SCALES = [40, 80, 160];
const TEXT_INTERVAL = 200;
const PEAK_WINDOW = 10; // text refreshes per peak window (2 s)
// A spike is a frame this much over the typical recent frame (the median of
// the history): by ratio on a fast display, by margin on a slow one.
const SPIKE_RATIO = 1.6, SPIKE_MARGIN = 8;
const SPIKE_LOG = 8;
const SPIKE_WINDOW = 10000; // ms over which spikes are counted
const SIM = [['player', PROF.PLAYER], ['structure', PROF.STRUCTURE], ['physics', PROF.PHYSICS], ['impacts', PROF.IMPACTS], ['particles', PROF.PARTICLES]];
const PARTS = [['fx', PROF.PARTICLE_FX], ['solids', PROF.PARTICLE_SOLIDS], ['rubble', PROF.PARTICLE_RUBBLE], ['gas', PROF.PARTICLE_GAS]];
// Frame bars are coloured by state (on budget, one frame late, worse); the
// two labelled guides carry the same information without colour.
const GOOD = 'rgba(12,163,12,0.55)', WARN = 'rgba(250,178,25,0.6)', BAD = 'rgba(208,59,59,0.65)';
const SIM_INK = '#4aa8ff', MESH_INK = '#b48cff', DRAW_INK = '#d9dde2', SPIKE_INK = '#ff4d4d', GUIDE = 'rgba(255,255,255,0.3)';

const ms = (v) => (v < 10 ? v.toFixed(2) : v.toFixed(1));
const pad = (s, n) => String(s).padStart(n);
const count = (n) => (n >= 10000 ? (n / 1000).toFixed(0) + 'k' : String(n));

export function createPerf(ctx) {
  const { sim, renderer } = ctx;
  // The sim on another thread: its steps and its meshing are in no frame of
  // this one, and are neither stacked into the graph nor blamed for a spike.
  const remote = sim.remote === true;
  const hudEl = document.getElementById('hud');
  const detail = document.getElementById('detail');
  const profEl = document.getElementById('prof');
  const canvas = document.getElementById('graph');
  const g = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const guides = [...document.querySelectorAll('#graphbox span')];
  let graphMs = 0, yLow = 0, yHigh = 0;
  function setScale(scale) {
    if (scale === graphMs) return;
    graphMs = scale;
    // Guides at one and two frames of the display rate the scale is for.
    const low = scale * 5 / 12, high = scale * 10 / 12;
    yLow = H - Math.round(low / scale * H);
    yHigh = H - Math.round(high / scale * H);
    for (const [el, v, y] of [[guides[0], high, yHigh], [guides[1], low, yLow]]) {
      el.textContent = `${v.toFixed(1)} ms`;
      el.style.bottom = (H - y + 2) + 'px';
    }
    g.clearRect(0, 0, W, H);
  }
  setScale(GRAPH_SCALES[0]);

  const frameMs = new Float32Array(HISTORY);
  const sorted = new Float32Array(HISTORY);
  // Averages and peaks: the engine's profiler slots, then our own.
  const FRAME = PROF.LEN, CPUI = PROF.LEN + 1, DRAW = PROF.LEN + 2, GPU = PROF.LEN + 3, N = PROF.LEN + 4;
  const ema = new Float32Array(N);
  // Peaks over a sliding window: the larger of the current and previous one.
  let peakNow = new Float32Array(N), peakOld = new Float32Array(N);
  // Smoothed frame time (s), sim steps per frame, when the text was last
  // rebuilt, and the typical frame (ms) spikes are judged against. In a
  // typed array because floats written to closure variables are boxed on
  // the heap on every write.
  const A = new Float64Array([1 / 60, 1, -1e9, 1000 / 60]);
  const DT = 0, STEPS = 1, TEXT_AT = 2, TYPICAL = 3;
  // The last few spikes: when, how long, and what cost the most.
  const spikeAt = new Float64Array(SPIKE_LOG).fill(-1e12), spikeMs = new Float32Array(SPIKE_LOG), spikeCost = new Float32Array(SPIKE_LOG);
  const spikeCause = new Array(SPIKE_LOG).fill('');
  let spikeHead = 0, spikeTotal = 0;
  // The frame before this one: its profiler slots, then main-thread time,
  // draw time and step count. The time between two frames is spent on the
  // first one's work, so that is what a long interval is blamed on.
  const before = new Float32Array(PROF.LEN + 3);
  const B_CPU = PROF.LEN, B_DRAW = PROF.LEN + 1, B_STEPS = PROF.LEN + 2;
  let haveBefore = false;
  let head = 0, filled = 0;
  // When the frame being measured began, and how long after the one before
  // (ms): the loop's own `dt` is capped at 100 ms, which is where a real
  // hitch begins.
  let tickAt = 0, tickMs = 0;
  let lastFrame = -1, refreshes = 0;
  let open = false, stepped = false, shownText = '';

  const peak = (i) => Math.max(peakNow[i], peakOld[i]);

  // What cost the most in a frame that took `dtMs`: `f[p..]` are the
  // profiler slots of the work done in it, in which `steps` sim steps ran
  // (the profiler holds the last of them).
  function blame(f, p, steps, dtMs, cpuMs, drawMs, now) {
    let name = 'browser / gpu', cost = dtMs - cpuMs;
    if (remote) steps = 0;
    const sim = f[p + PROF.STEP_TOTAL] * steps;
    for (const [n, i] of SIM) {
      const v = f[p + i] * steps;
      if (v > cost) { name = n; cost = v; }
    }
    // Several steps in one frame is its own cause: the sim catching up
    // after a slow frame, none of its parts slow by itself.
    if (steps > 2 && sim > cost * 1.5) { name = `sim x${steps}`; cost = sim; }
    if (!remote && f[p + PROF.REMESH] > cost) { name = 'mesh'; cost = f[p + PROF.REMESH]; }
    if (drawMs > cost) { name = 'draw'; cost = drawMs; }
    spikeAt[spikeHead] = now;
    spikeMs[spikeHead] = dtMs;
    spikeCost[spikeHead] = cost;
    spikeCause[spikeHead] = name;
    spikeHead = (spikeHead + 1) % SPIKE_LOG;
    spikeTotal++;
  }

  function column(dtMs, simMs, meshMs, drawMs, spike) {
    // 'copy' replaces the canvas with its shifted self; the default would
    // draw the shifted image over the old one and smear every bar leftwards.
    g.globalCompositeOperation = 'copy';
    g.drawImage(canvas, -1, 0);
    g.globalCompositeOperation = 'source-over';
    const x = W - 1;
    const h = Math.min(H, Math.max(1, Math.round(dtMs / graphMs * H)));
    if (spike) {
      // Two columns wide, in its own colour, with a line to the top of the
      // graph and a flag on it whatever the frame's own height: a spike
      // must not hide among its neighbours.
      g.fillStyle = SPIKE_INK;
      g.fillRect(x - 1, 0, 2, H);
      g.fillRect(x - 4, 0, 5, 6);
    } else {
      g.fillStyle = dtMs < graphMs * 0.46 ? GOOD : dtMs < graphMs * 0.875 ? WARN : BAD;
      g.fillRect(x, H - h, 1, h);
    }
    // The main thread's share, stacked from the bottom inside the frame's
    // own bar: sim, mesh, draw.
    let y = H;
    const stack = (v, ink) => {
      const s = Math.min(y - (H - h), Math.round(v / graphMs * H));
      if (s <= 0) return;
      g.fillStyle = ink;
      g.fillRect(spike ? x - 1 : x, y - s, spike ? 2 : 1, s);
      y -= s;
    };
    stack(simMs, SIM_INK);
    stack(meshMs, MESH_INK);
    stack(drawMs, DRAW_INK);
    g.fillStyle = GUIDE;
    g.fillRect(x, yLow, 1, 1);
    g.fillRect(x, yHigh, 1, 1);
  }

  function summary(out) {
    const st = renderer.stats || {};
    const sim = ema[PROF.STEP_TOTAL] * A[STEPS];
    // Under the harness there is no display rate to report.
    const rate = stepped ? 'stepped' : `${pad((1 / A[DT]).toFixed(0), 3)} fps`;
    const gpu = st.gpuMs >= 0 ? `  gpu ${ms(ema[GPU])}` : '';
    // (After the size: which way the trial of laying depth first went on
    // this machine, once one has ended: render_quality.js, DepthTrial.)
    const tier = st.tier ? `${st.tier}${renderer.autoQuality ? ' auto' : ''} ${Math.round((st.scale || 1) * 100)}%${st.depth ? ' depth-' + st.depth : ''}  ` : '';
    // (Shown only while game time runs behind the clock.)
    const gov = ctx.governor;
    const effort = gov && gov.slow ? `  slow motion ${gov.speed.toFixed(2)}x` : '';
    return `${rate}  cpu ${ms(ema[CPUI])}${gpu} ms\n` +
      `sim${remote ? ' (worker)' : ''} ${ms(sim)}: struct ${ms(ema[PROF.STRUCTURE])} phys ${ms(ema[PROF.PHYSICS])} part ${ms(ema[PROF.PARTICLES])}  mesh ${ms(ema[PROF.REMESH])}\n` +
      `${tier}awake ${out[OUT.STAT_AWAKE]}/${out[OUT.STAT_BODIES]}  particles ${count(out[OUT.STAT_PARTICLES])}${effort}`;
  }

  // The frame ledger (frame_ledger.js): mean and worst over the frames it
  // holds of what a frame cost outside the step and asked of the GPU.
  let ledMean = null, ledWorst = null;
  function ledger() {
    const L = ctx.ledger;
    if (!L || !L.held) return '';
    if (!ledMean) { ledMean = new Float64Array(L.FIELDS.length); ledWorst = new Float64Array(L.FIELDS.length); }
    const n = L.stats(ledMean, ledWorst), F = L.F;
    const big = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e4 ? (v / 1e3).toFixed(0) + 'k' : v.toFixed(0));
    const two = (name, i, f = big) => `${name.padEnd(11)}${pad(f(ledMean[i]), 6)} ${pad(f(ledWorst[i]), 6)}`;
    const scene = Math.max(ledMean[F.scenePx], 1);
    const screens = (v) => (v / scene).toFixed(1);
    let t = `ledger, ${n} frames  avg    max\n` +
      two('off step', F.outside, ms) + '  ms main thread\n' +
      two(' prepare', F.prepare, ms) + `  render ${ms(ledMean[F.render])} ${ms(ledWorst[F.render])}\n` +
      two(' sync', F.rSync, ms) + `  other ${ms(ledMean[F.other] + ledMean[F.update] + ledMean[F.hud] + ledMean[F.audio])}\n`;
    if (L.counting) {
      t += two('draws', F.draws) + `  sub ${big(ledMean[F.subDraws])} ${big(ledWorst[F.subDraws])}\n` +
        two('triangles', F.tris) + `  shadow ${big(ledWorst[F['shadow.tris']])}\n` +
        two('upload', F.upBytes) + `  B  quads ${big(ledWorst[F.quadBytes])}\n` +
        two('targets', F.targets) + `  gl ${big(ledMean[F.glCalls])} ${big(ledWorst[F.glCalls])}\n` +
        two('full screen', F.fsPx, screens) + '  screens\n' +
        two('gas', F.gasFill, (v) => v.toFixed(1)) + `  screens, 1/${ledWorst[F.gasStep]}  ${big(ledWorst[F.sprites])} sprites\n`;
      if (ledWorst[F.links] + ledWorst[F.blocking] > 0) t += two('blocking', F.blocking) + `  links ${ledWorst[F.links]}\n`;
    }
    return t;
  }

  function details(out, live, now) {
    const p99 = live[Math.min(filled - 1, Math.floor(filled * 0.99))] || 0;
    const row = (name, i, note = '') => `${name.padEnd(11)}${pad(ms(ema[i]), 6)} ${pad(ms(peak(i)), 6)}${note}\n`;
    let t = `             avg    max   ms\n` +
      row('frame', FRAME, `  1% low ${(1000 / Math.max(p99, 0.1)).toFixed(0)} fps`) +
      row('cpu', CPUI) +
      row('step', PROF.STEP_TOTAL, `  x${A[STEPS].toFixed(1)} per frame`);
    for (const [name, i] of SIM) t += row(' ' + name, i);
    for (const [name, i] of PARTS) if (peak(i) > 0) t += row('  ' + name, i);
    // Slots other subsystems claimed later still show up, unnamed.
    for (let i = PROF.PARTICLE_GAS + 1; i < PROF.LEN; i++) if (peak(i) > 0 && i !== PROF.PHYSICS_OVER) t += row(` slot ${i}`, i);
    // Not a time: the counted cost of a physics step over its budget (1 = at the budget).
    if (peak(PROF.PHYSICS_OVER) > 1) t += `${' phys over'.padEnd(11)}${pad(ema[PROF.PHYSICS_OVER].toFixed(2), 6)} ${pad(peak(PROF.PHYSICS_OVER).toFixed(2), 6)}  x its budget\n`;
    t += row('prepare', PROF.PREPARE_TOTAL, `  mesh ${ms(ema[PROF.REMESH])}`) + row('draw', DRAW);
    const st = renderer.stats;
    if (st && st.gpuMs >= 0) t += row('gpu', GPU);
    if (remote) {
      const w = sim.stats, fr = sim.frame;
      t += `worker     round trip ${ms(w.roundMs)} ms  packet ${(fr.bytes / 1024).toFixed(0)} KB  drawn again ${(100 * w.stale / Math.max(1, w.draws)).toFixed(0)}%\n`;
    }

    // Spikes: how many lately, and the latest few with their cause.
    let recent = 0, worst = 0;
    for (let i = 0; i < SPIKE_LOG; i++) {
      if (now - spikeAt[i] > SPIKE_WINDOW) continue;
      recent++;
      worst = Math.max(worst, spikeMs[i]);
    }
    t += recent ? `spikes ${recent}${recent === SPIKE_LOG ? '+' : ''} in 10 s, worst ${ms(worst)} ms (over ${ms(Math.max(A[TYPICAL] * SPIKE_RATIO, A[TYPICAL] + SPIKE_MARGIN))})\n` : `no spikes in 10 s (${spikeTotal} so far)\n`;
    for (let n = 1; n <= 3; n++) {
      const i = (spikeHead - n + SPIKE_LOG) % SPIKE_LOG;
      if (now - spikeAt[i] > SPIKE_WINDOW) break;
      t += ` ${pad(ms(spikeMs[i]), 5)} ms ${pad(((now - spikeAt[i]) / 1000).toFixed(1), 4)} s ago  ${spikeCause[i]} ${ms(spikeCost[i])}\n`;
    }

    t += ledger();
    if (st && st.tier) {
      t += `tier ${st.tier}${renderer.autoQuality ? ' (auto)' : ''}  scale ${Number(st.scale || 1).toFixed(2)}${st.thrift ? '  thrift ' + st.thrift : ''}  ${st.width}x${st.height}  draws ${st.drawCalls}\n`;
    } else {
      t += `view ${ctx.canvas.width}x${ctx.canvas.height}  scale ${Number(renderer.renderScale || 1).toFixed(2)}\n`;
    }
    if (ctx.governor) t += ctx.governor.describe() + '\n';
    t += `bodies ${out[OUT.STAT_BODIES]} (${out[OUT.STAT_AWAKE]} awake)  contacts ${out[OUT.STAT_CONTACTS]}\n` +
      `particles ${out[OUT.STAT_PARTICLES]}  quads ${out[OUT.STAT_QUADS]}  dirty ${out[OUT.STAT_DIRTY_CHUNKS]}\n`;
    const c = renderer.cam.pos;
    const flags = out[OUT.PLAYER_FLAGS];
    const mode = flags & PFLAG.NOCLIP ? 'fly' : flags & PFLAG.GROUND ? (flags & PFLAG.ON_BODY ? 'on body' : 'ground') : 'air';
    return t + `eye ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${c[2].toFixed(1)}  fov ${Number(renderer.fov || 0).toFixed(0)}  ${mode}${flags & PFLAG.CROUCH ? ' crouch' : ''}${flags & PFLAG.EMBEDDED ? ' embedded' : ''}`;
  }

  return {
    get open() { return open; },
    get spikes() { return spikeTotal; },
    toggle() {
      open = !open;
      detail.hidden = !open;
      // The readouts are shown only while the stats are open (game.css).
      document.body.classList.toggle('stats', open);
      if (open) g.clearRect(0, 0, W, H);
      A[TEXT_AT] = -1e9;
    },
    // Engine restarted: the step counter starts over.
    reset() {
      lastFrame = -1;
    },
    // A frame begins (`now` from performance.now()).
    tick(now) {
      tickMs = tickAt ? now - tickAt : 0;
      tickAt = now;
    },
    frame(out, timing, now) {
      stepped = !!timing.nominal;
      // Over a second is not a frame: the tab was in the background. (A
      // call with no tick before it is fed by hand and means its own dt.)
      const span = !stepped && tickMs > 0 && tickMs < 1000 ? tickMs : timing.dt * 1000, cpuMs = timing.cpuMs;
      tickMs = 0;
      // An interval that is not one (the frame loop's first `dt` after boot
      // has been seen 1.2 s negative, and the readout said "-9 fps" until
      // the average recovered) is no sample: the frame counts as typical.
      const dtMs = span > 0 ? span : A[DT] * 1000;
      frameMs[head] = dtMs;
      head = (head + 1) % HISTORY;
      if (filled < HISTORY) filled++;
      // Harness frames are isolated samples: show them as they are rather
      // than a tenth of the way towards them.
      const k = stepped ? 1 : 0.1;
      A[DT] += (dtMs / 1000 - A[DT]) * k;
      const frame = out[OUT.STAT_FRAME];
      // (The harness steps any number of times between two looks at the
      // HUD: what it shows there is one step.)
      const steps = lastFrame < 0 || stepped ? 1 : Math.min(8, Math.max(0, frame - lastFrame));
      lastFrame = frame;
      A[STEPS] += (steps - A[STEPS]) * k;
      const f = sim.frame.f32, p = out[OUT.PROF_PTR] >> 2;
      for (let i = 0; i < PROF.LEN; i++) {
        const v = f[p + i];
        ema[i] += (v - ema[i]) * k;
        if (v > peakNow[i]) peakNow[i] = v;
      }
      const st = renderer.stats;
      // (Stepped by the harness there is no frame the draw time is a share
      // of: it is the software rasteriser's, and stays out of the graph.)
      const drawMs = st && !stepped ? st.cpuMs : 0, gpuMs = st && st.gpuMs >= 0 ? st.gpuMs : 0;
      const own = (i, v) => {
        ema[i] += (v - ema[i]) * k;
        if (v > peakNow[i]) peakNow[i] = v;
      };
      own(FRAME, dtMs);
      own(CPUI, cpuMs);
      own(DRAW, drawMs);
      own(GPU, gpuMs);
      const spike = dtMs > Math.max(A[TYPICAL] * SPIKE_RATIO, A[TYPICAL] + SPIKE_MARGIN);
      // Live, `dt` ran from the frame before to this one and holds that
      // frame's work. Stepped by the harness there is no such interval.
      const live = haveBefore && !stepped;
      const wf = live ? before : f, wp = live ? 0 : p;
      const wSteps = live ? before[B_STEPS] : steps, wCpu = live ? before[B_CPU] : cpuMs, wDraw = live ? before[B_DRAW] : drawMs;
      if (spike) blame(wf, wp, wSteps, dtMs, wCpu, wDraw, now);
      if (open) column(dtMs, remote ? 0 : wf[wp + PROF.STEP_TOTAL] * wSteps, remote ? 0 : wf[wp + PROF.PREPARE_TOTAL], wDraw, spike);
      for (let i = 0; i < PROF.LEN; i++) before[i] = f[p + i];
      before[B_CPU] = cpuMs;
      before[B_DRAW] = drawMs;
      before[B_STEPS] = steps;
      haveBefore = true;
      // Harness frames are not real time apart: every one of them may be
      // the screenshot, so the text is always current there.
      if (!stepped && now - A[TEXT_AT] < TEXT_INTERVAL) return;
      A[TEXT_AT] = now;
      sorted.set(frameMs);
      const recent = sorted.subarray(0, filled).sort();
      A[TYPICAL] = recent[filled >> 1] || 1000 / 60;
      if (open) setScale(GRAPH_SCALES.find((v) => A[TYPICAL] <= v * 0.5) || GRAPH_SCALES[GRAPH_SCALES.length - 1]);
      // (A paused game shows the same lines five times a second: a
      // write only when they differ.)
      const text = summary(out);
      if (text !== shownText) hudEl.textContent = shownText = text;
      if (open) profEl.textContent = details(out, recent, now);
      if (++refreshes >= PEAK_WINDOW) {
        refreshes = 0;
        const t = peakOld;
        peakOld = peakNow;
        peakNow = t;
        peakNow.fill(0);
      }
    },
  };
}
