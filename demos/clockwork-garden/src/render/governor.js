// Frame governor: keeps motion smooth on whatever machine the garden runs on.
//
// A frame that misses the display's refresh is shown for two refreshes, and
// a garden moving at 60 fps with a dropped frame every second or so reads as
// choppy even though the average looks fine. The governor watches every
// frame's interval, the main thread's work and (where the browser exposes a
// GPU timer) the GPU's, and trades detail for a steady frame rate:
//   · GPU-bound: render at a lower resolution (the canvas is scaled up by the
//     browser), in steps down to half;
//   · main-thread-bound (interactive modes): the key light's shadow map is
//     redrawn every other frame, then small details are culled sooner, then
//     sooner still (applied by the caller through `onCpu`);
// and steps back up once there is clear headroom. Each change is held for a
// while (longer after a step back up didn't hold), so it never hunts.
// On a display faster than 60 Hz the target is still 60 fps: if the full rate
// can't be held, frames are paced to every second refresh (an even 60 rather
// than an uneven 80–100).
// It also tells the bee-scale planting build how much of each frame is spare.

const RES = [1, 0.88, 0.77, 0.67, 0.58, 0.5];
const CPU_LEVELS = 3;
const WINDOW = 90; // frames of history

export class Governor {
  constructor({ renderer, base = 1, enabled = true, minHeight = 480, minRatio = 0.7, onScale = null, onCpu = null }) {
    this.renderer = renderer;
    this.enabled = enabled;
    this.base = base; // the quality tier's pixel ratio, which the scale multiplies
    this.minHeight = minHeight; // never below this many rows…
    this.minRatio = minRatio; // …or this many pixels per CSS pixel
    this.trial = null; // a resolution step taken without a GPU timer, on probation
    this.resUselessUntil = 0;
    this.onScale = onScale;
    this.onCpu = onCpu;
    this.res = 0; // index into RES
    this.cpuLevel = 0;
    this.cpuOn = false; // the caller has main-thread levels to offer (interactive modes)
    this.intervals = [];
    this.work = [];
    this.gpuMs = [];
    this.period = 1000 / 60; // the display's refresh, measured
    this.periodSamples = [];
    this.cap = 1; // render every n-th refresh
    this.lastChange = -1e9;
    this.settleUntil = 0;
    this.holdUp = 5000; // wait before trying a step back up (doubles when one fails)
    this.lastUp = null; // { t, what } of the last step up, to undo it if it doesn't hold
    this.lastRender = 0;
    this.frameNo = 0;
    // GPU timing, where available (desktop Chrome, some others): results read a few frames late
    const gl = renderer.getContext();
    this.gl = gl;
    this.timer = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? gl.getExtension('EXT_disjoint_timer_query_webgl2') : null;
    this.queries = [];
    this.active = null;
  }

  get scale() { return RES[this.res]; }
  get target() { return this.period * this.cap; }

  // frames to skip on a fast display while capped (call first thing in the loop)
  skip(now) {
    if (this.cap <= 1) { this.lastRender = now; return false; }
    if (now - this.lastRender < this.target - this.period * 0.5) return true;
    this.lastRender = now;
    return false;
  }

  // GPU timer around the frame's draws
  begin() {
    if (!this.timer || this.active || this.queries.length > 4) return;
    const q = this.gl.createQuery();
    this.gl.beginQuery(this.timer.TIME_ELAPSED_EXT, q);
    this.active = q;
  }
  end() {
    if (!this.active) return;
    this.gl.endQuery(this.timer.TIME_ELAPSED_EXT);
    this.queries.push(this.active);
    this.active = null;
  }
  _poll() {
    const gl = this.gl;
    while (this.queries.length) {
      const q = this.queries[0];
      if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
      const disjoint = gl.getParameter(this.timer.GPU_DISJOINT_EXT);
      if (!disjoint) this._push(this.gpuMs, gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6);
      gl.deleteQuery(q);
      this.queries.shift();
    }
  }
  _push(arr, v, n = WINDOW) { arr.push(v); if (arr.length > n) arr.shift(); }

  // the spare part of a frame (ms) for background work such as the planting build
  spare() {
    const cost = Math.max(this._mean(this.work, 20), this._mean(this.gpuMs, 20));
    return this.target * 0.85 - cost;
  }

  _mean(a, n = a.length) {
    if (!a.length) return 0;
    let s = 0; const k = Math.min(n, a.length);
    for (let i = a.length - k; i < a.length; i++) s += a[i];
    return s / k;
  }

  // once per rendered frame: interval since the last rendered frame and the
  // main thread's work for it (ms)
  frame(now, interval, workMs) {
    this.frameNo++;
    if (this.timer) this._poll();
    if (interval > 250) { this.intervals.length = 0; this.settleUntil = now + 500; return; } // tab was hidden, a stall, a mode switch
    this._push(this.intervals, interval);
    this._push(this.work, workMs);
    // the display's refresh: the shortest steady intervals seen (uncapped frames only)
    if (this.cap === 1) this._push(this.periodSamples, interval, 240);
    if (this.frameNo % 60 === 0 && this.periodSamples.length >= 120) {
      const s = [...this.periodSamples].sort((a, b) => a - b);
      const p = s[Math.floor(s.length * 0.1)];
      const busy = Math.max(this._mean(this.work, 60), this._mean(this.gpuMs, 40));
      if (p > 4 && p < this.period * 0.97) this.period = p; // a faster display than assumed
      // a slower one (a 50 Hz panel, a phone's low-power 30 Hz): only when
      // every frame is slow although the work is light, so a slow garden
      // never passes for a slow display
      else if (p > this.period * 1.3 && busy < p * 0.5 && p < 45) this.period = p;
    }
    if (!this.enabled || now < this.settleUntil || this.intervals.length < 45) return;
    const target = this.target;
    const recent = this.intervals.slice(-60);
    const missed = recent.filter((d) => d > target * 1.45).length;
    const meanI = this._mean(recent);
    const cpu = this._mean(this.work, 60);
    const gpu = this.gpuMs.length >= 20 ? this._mean(this.gpuMs, 40) : null;
    const since = now - this.lastChange;
    // a step up that brought misses back: undo it and wait longer before the next try
    if (this.lastUp && now - this.lastUp.t < 3000 && missed >= 3) {
      if (this.lastUp.what === 'res') this._setRes(this.res + 1, now);
      else if (this.lastUp.what === 'cpu') this._setCpu(this.cpuLevel + 1, now);
      else this.cap = this._capFor();
      this.lastUp = null;
      this.holdUp = Math.min(60000, this.holdUp * 2);
      return;
    }
    // a resolution step taken blind (no GPU timer): kept only if it helped
    if (this.trial && now - this.trial.t > 2000) {
      if (!(meanI < this.trial.meanI * 0.93 || missed < this.trial.missed * 0.6)) {
        this._setRes(this.res - 1, now);
        this.resUselessUntil = now + 30000;
      }
      this.trial = null;
      return;
    }
    const over = missed >= 4 || meanI > target * 1.1;
    if (over && since > 1000 && !this.trial) {
      // a fast display that can't be held at its full rate: pace at 60
      if (this.cap === 1 && this._capFor() > 1) { this.cap = this._capFor(); this.lastChange = now; this.settleUntil = now + 600; return; }
      const cpuLeft = this.cpuOn && this.cpuLevel < CPU_LEVELS;
      if (gpu != null) {
        // measured: fewer pixels only help a busy GPU
        const gpuBound = gpu > target * 0.6 && gpu >= cpu * 0.8;
        if (gpuBound && this._canLower()) return this._setRes(this.res + 1, now);
        if (cpuLeft) return this._setCpu(this.cpuLevel + 1, now);
        return;
      }
      // unmeasured: busy JavaScript points at the main thread; otherwise try
      // fewer pixels and keep them only if frames got quicker
      if (cpuLeft && (cpu > target * 0.75 || now < this.resUselessUntil)) return this._setCpu(this.cpuLevel + 1, now);
      if (now >= this.resUselessUntil && this._canLower()) {
        this.trial = { t: now, meanI, missed };
        return this._setRes(this.res + 1, now);
      }
      if (cpuLeft) return this._setCpu(this.cpuLevel + 1, now);
      return;
    }
    // headroom: no misses for a while and the work comfortably inside the budget
    if (!missed && since > this.holdUp) {
      const all = this.intervals.slice(-WINDOW).filter((d) => d > target * 1.45).length === 0;
      if (!all) return;
      if (this.cap > 1 && Math.max(cpu, gpu ?? cpu) < this.period * 0.75) { this.cap = 1; this.lastChange = now; this.lastUp = { t: now, what: 'cap' }; return; }
      if (this.cpuLevel > 0 && cpu < target * 0.55) { this._setCpu(this.cpuLevel - 1, now); this.lastUp = { t: now, what: 'cpu' }; return; }
      if (this.res > 0) {
        const k = (RES[this.res - 1] / RES[this.res]) ** 2; // GPU cost grows with the pixel count
        const ok = gpu != null ? gpu * k < target * 0.58 : cpu < target * 0.6;
        if (ok) { this._setRes(this.res - 1, now); this.lastUp = { t: now, what: 'res' }; }
      }
    }
  }

  // refreshes per frame for an even ~60 fps on a fast display (120 Hz → 2, 144 → 2, 240 → 4; 90 → 1)
  _capFor() { return Math.max(1, Math.floor(17.5 / this.period)); }

  _canLower() {
    if (this.res >= RES.length - 1) return false;
    const k = RES[this.res + 1];
    const h = this.renderer.domElement.height * (k / RES[this.res]);
    return h >= this.minHeight && this.base * k >= this.minRatio;
  }
  _setRes(i, now) {
    i = Math.max(0, Math.min(RES.length - 1, i));
    if (i === this.res) return;
    this.res = i;
    this.lastChange = now;
    this.settleUntil = now + 700; // the resize itself costs a frame or two
    this.gpuMs.length = 0;
    this.onScale?.(RES[this.res]);
  }
  _setCpu(i, now) {
    this.cpuLevel = Math.max(0, Math.min(CPU_LEVELS, i));
    this.lastChange = now;
    this.settleUntil = now + 500;
    this.onCpu?.(this.cpuLevel);
  }
  // a new mode or screen: let it settle before judging it
  settle(now, ms = 1500) { this.settleUntil = Math.max(this.settleUntil, now + ms); this.intervals.length = 0; }

  stats() {
    const r = this.intervals.slice(-60);
    const s = [...r].sort((a, b) => a - b);
    return {
      fps: r.length ? 1000 / this._mean(r) : 0,
      p95: s.length ? s[Math.floor(s.length * 0.95)] : 0,
      missed: r.filter((d) => d > this.target * 1.45).length,
      cpu: this._mean(this.work, 60),
      gpu: this.gpuMs.length ? this._mean(this.gpuMs, 40) : null,
      scale: this.scale,
      cpuLevel: this.cpuLevel,
      hz: 1000 / this.period,
      cap: this.cap,
    };
  }
}
