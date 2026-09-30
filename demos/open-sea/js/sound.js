// Procedural soundscape (Web Audio, no samples): surf that swells with the wave period, wind, rain, thunder, and a
// muffled world when the camera is under water. Starts only from a user gesture (the panel's "Sound on" button).
export class Sound {
  constructor() { this.on = false; this.ctx = null; this.unsupported = false; this._strike = null; }

  async setOn(v) {
    this.on = v;
    if (v) {
      if (!this.ctx) this._build();
      if (this.unsupported) { this.on = false; return; }
      try { await this.ctx.resume(); } catch { /* blocked: the next click will retry */ }
      this.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.4);
    } else if (this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      setTimeout(() => { if (!this.on && this.ctx) this.ctx.suspend(); }, 700);
    }
  }

  _noise(kind) {
    const c = this.ctx, n = c.sampleRate * 4, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    // cross-fade the loop point so it does not click
    const f = Math.floor(c.sampleRate * 0.05);
    for (let i = 0; i < f; i++) { const t = i / f; d[n - f + i] = d[n - f + i] * (1 - t) + d[i] * t; }
    const s = c.createBufferSource(); s.buffer = b; s.loop = true; s.loopEnd = (n - f) / c.sampleRate; s.start();
    return s;
  }

  _build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.unsupported = true; return; }
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0;
    this.muffle = c.createBiquadFilter(); this.muffle.type = 'lowpass'; this.muffle.frequency.value = 20000;
    this.muffle.connect(this.master); this.master.connect(c.destination);

    // surf: brown noise whose level rides a slow swell at the wave period
    const surf = this._noise('brown');
    this.surfLP = c.createBiquadFilter(); this.surfLP.type = 'lowpass'; this.surfLP.frequency.value = 500;
    this.surfMod = c.createGain(); this.surfMod.gain.value = 0.6;
    this.surfG = c.createGain(); this.surfG.gain.value = 0;
    this.lfo = c.createOscillator(); this.lfo.frequency.value = 0.12;
    this.lfoAmt = c.createGain(); this.lfoAmt.gain.value = 0.4;
    this.lfo.connect(this.lfoAmt); this.lfoAmt.connect(this.surfMod.gain); this.lfo.start();
    surf.connect(this.surfLP); this.surfLP.connect(this.surfMod); this.surfMod.connect(this.surfG); this.surfG.connect(this.muffle);

    // wind: band-passed noise that gusts
    const wind = this._noise('white');
    this.windBP = c.createBiquadFilter(); this.windBP.type = 'bandpass'; this.windBP.Q.value = 0.6; this.windBP.frequency.value = 400;
    this.windMod = c.createGain(); this.windMod.gain.value = 0.7;
    this.windG = c.createGain(); this.windG.gain.value = 0;
    this.gust = c.createOscillator(); this.gust.frequency.value = 0.09;
    this.gustAmt = c.createGain(); this.gustAmt.gain.value = 0.3;
    this.gust.connect(this.gustAmt); this.gustAmt.connect(this.windMod.gain); this.gust.start();
    wind.connect(this.windBP); this.windBP.connect(this.windMod); this.windMod.connect(this.windG); this.windG.connect(this.muffle);

    // rain: hiss
    const rain = this._noise('white');
    this.rainHP = c.createBiquadFilter(); this.rainHP.type = 'highpass'; this.rainHP.frequency.value = 1800;
    this.rainLP = c.createBiquadFilter(); this.rainLP.type = 'lowpass'; this.rainLP.frequency.value = 9000;
    this.rainG = c.createGain(); this.rainG.gain.value = 0;
    rain.connect(this.rainHP); this.rainHP.connect(this.rainLP); this.rainLP.connect(this.rainG); this.rainG.connect(this.muffle);

    this.thunderSrc = this._noise('brown');
    this.thunderSrc.disconnect();
  }

  _thunder(delay, dist) {
    const c = this.ctx, t0 = c.currentTime + delay;
    const g = c.createGain(), lp = c.createBiquadFilter(), src = c.createBufferSource();
    src.buffer = this.thunderSrc.buffer; src.loop = true;
    lp.type = 'lowpass'; lp.frequency.value = 180 + 500 / (1 + dist / 1500);
    const peak = 0.9 / (1 + dist / 3000);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.25);
    g.gain.setTargetAtTime(peak * 0.35, t0 + 0.3, 0.9);
    g.gain.setTargetAtTime(0, t0 + 1.8, 1.4);
    src.connect(lp); lp.connect(g); g.connect(this.muffle);
    src.start(t0); src.stop(t0 + 9);
  }

  // Call every frame with the app; cheap.
  update(app) {
    if (!this.on || !this.ctx || this.unsupported) return;
    const c = this.ctx, now = c.currentTime, tc = 0.35, S = app.state, sim = app.sim.cur;
    const under = app.under;
    const hs = sim.hs, U = sim.U;
    const surf = hs < 0.04 ? 0.03 : Math.min(0.85, 0.06 + 0.42 * Math.pow(hs / 3, 0.6));
    const wind = Math.min(0.6, Math.pow(U / 24, 1.5) * 0.6 + 0.01);
    const rain = Math.pow(S.rain, 1.2) * 0.4;
    this.surfG.gain.setTargetAtTime(surf * (under ? 1.6 : 1), now, tc);
    this.surfLP.frequency.setTargetAtTime(280 + 700 * Math.min(1, hs / 3.5), now, tc);
    this.lfo.frequency.setTargetAtTime(1 / Math.max(3, sim.tp * 1.05), now, 1.0);
    this.lfoAmt.gain.setTargetAtTime(hs < 0.2 ? 0.1 : 0.4, now, 1.0);
    this.windG.gain.setTargetAtTime(wind * (under ? 0.05 : 1), now, tc);
    this.windBP.frequency.setTargetAtTime(220 + 38 * U, now, tc);
    this.rainG.gain.setTargetAtTime(rain * (under ? 0.15 : 1), now, tc);
    this.muffle.frequency.setTargetAtTime(under ? 380 : 20000, now, 0.25);
    const L = app.lightning;
    if (L && L.strike && L.strike !== this._strike) {
      this._strike = L.strike;
      this._thunder(Math.min(14, (L.strike.dist / 343) * 0.6), L.strike.dist);
    }
  }
}
