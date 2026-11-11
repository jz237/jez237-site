/* A small feed-forward network (a "multilayer perceptron") and the nine 8x8 shapes it learns to
   tell apart. No DOM in here: the page and tools/build-hero-weights.js both run this same file,
   so the weights that ship were trained by exactly the code the visitor can re-run in the hero. */
(function (root, factory) {
  const m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m; else root.LabMLP = m;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- the network: tanh hidden layers, softmax output, Adam ---------- */
  function MLP(sizes, seed) {
    this.sizes = sizes; this.G = sizes.length - 1;
    this.W = []; this.b = []; this.a = sizes.map(n => new Float32Array(n)); this.z = [];
    this.d = []; this.gW = []; this.gb = []; this.mW = []; this.vW = []; this.mb = []; this.vb = [];
    for (let g = 0; g < this.G; g++) {
      const n = sizes[g] * sizes[g + 1], o = sizes[g + 1];
      this.W.push(new Float32Array(n)); this.b.push(new Float32Array(o)); this.z.push(new Float32Array(o)); this.d.push(new Float32Array(o));
      this.gW.push(new Float32Array(n)); this.gb.push(new Float32Array(o));
      this.mW.push(new Float32Array(n)); this.vW.push(new Float32Array(n)); this.mb.push(new Float32Array(o)); this.vb.push(new Float32Array(o));
    }
    this.din = new Float32Array(sizes[0]);     // how the loss would change if each input changed
    this.weights = this.W.reduce((s, w) => s + w.length, 0);
    this.init(seed == null ? 1 : seed);
  }
  MLP.prototype.init = function (seed) {
    const r = rng(seed), gauss = () => (r() + r() + r() + r() - 2) * 1.7321;      // close to a unit bell curve
    for (let g = 0; g < this.G; g++) {
      const k = Math.sqrt(1 / this.sizes[g]);
      for (let n = 0; n < this.W[g].length; n++) this.W[g][n] = gauss() * k;
      this.b[g].fill(0); this.mW[g].fill(0); this.vW[g].fill(0); this.mb[g].fill(0); this.vb[g].fill(0);
    }
    this.t = 0;
  };
  // x: Float32Array of inputs. Leaves every layer's values in this.a (the last layer is probabilities).
  // off (optional): per layer, a Uint8Array marking hidden neurons to switch off (they send 0). For looking only: backward() ignores it.
  MLP.prototype.forward = function (x, off) {
    this.a[0].set(x);
    for (let g = 0; g < this.G; g++) {
      const src = this.a[g], out = this.a[g + 1], z = this.z[g], W = this.W[g], nIn = src.length, nOut = out.length, last = g === this.G - 1;
      for (let j = 0; j < nOut; j++) {
        let s = this.b[g][j];
        for (let i = 0, o = j * nIn; i < nIn; i++) s += W[o + i] * src[i];
        z[j] = s;
        if (!last) out[j] = off && off[g + 1] && off[g + 1][j] ? 0 : Math.tanh(s);
      }
      if (last) {
        let m = -Infinity, sum = 0;
        for (let j = 0; j < nOut; j++) if (z[j] > m) m = z[j];
        for (let j = 0; j < nOut; j++) { out[j] = Math.exp(z[j] - m); sum += out[j]; }
        for (let j = 0; j < nOut; j++) out[j] /= sum;
      }
    }
    return this.a[this.G];
  };
  // After forward(): work out the blame for the right answer y, layer by layer, back to the input.
  // Leaves each layer's blame in this.d (and this.din), adds to the gradient sums, returns the loss.
  MLP.prototype.backward = function (y) {
    const p = this.a[this.G], dl = this.d[this.G - 1];
    for (let j = 0; j < p.length; j++) dl[j] = p[j] - (j === y ? 1 : 0);
    for (let g = this.G - 1; g >= 0; g--) {
      const src = this.a[g], d = this.d[g], W = this.W[g], nIn = src.length, nOut = d.length, gW = this.gW[g], gb = this.gb[g];
      const prev = g ? this.d[g - 1] : this.din;
      prev.fill(0);
      for (let j = 0; j < nOut; j++) {
        const dj = d[j];
        gb[j] += dj;
        for (let i = 0, o = j * nIn; i < nIn; i++) { gW[o + i] += dj * src[i]; prev[i] += W[o + i] * dj; }
      }
      if (g) for (let i = 0; i < nIn; i++) prev[i] *= 1 - src[i] * src[i];
    }
    return -Math.log(Math.max(1e-12, p[y]));
  };
  MLP.prototype.step = function (lr, n) {
    const b1 = 0.9, b2 = 0.999; this.t++;
    const c1 = 1 - Math.pow(b1, this.t), c2 = 1 - Math.pow(b2, this.t), k = 1 / (n || 1);
    const upd = (w, gr, m, v) => {
      for (let i = 0; i < w.length; i++) {
        const q = gr[i] * k;
        m[i] = b1 * m[i] + (1 - b1) * q; v[i] = b2 * v[i] + (1 - b2) * q * q;
        w[i] -= lr * (m[i] / c1) / (Math.sqrt(v[i] / c2) + 1e-8);
        gr[i] = 0;
      }
    };
    for (let g = 0; g < this.G; g++) { upd(this.W[g], this.gW[g], this.mW[g], this.vW[g]); upd(this.b[g], this.gb[g], this.mb[g], this.vb[g]); }
  };
  MLP.prototype.trainBatch = function (xs, ys, lr) {
    let loss = 0;
    for (let n = 0; n < xs.length; n++) { this.forward(xs[n]); loss += this.backward(ys[n]); }
    this.step(lr, xs.length);
    return loss / xs.length;
  };
  MLP.prototype.predict = function (x) {
    const p = this.forward(x); let b = 0;
    for (let j = 1; j < p.length; j++) if (p[j] > p[b]) b = j;
    return b;
  };

  /* ---------- shipping the weights: 8 bits each, one scale per tensor, base64 ---------- */
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function enc(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      s += B64[a >> 2] + B64[((a & 3) << 4) | (b >> 4)] + (i + 1 < bytes.length ? B64[((b & 15) << 2) | (c >> 6)] : '=') + (i + 2 < bytes.length ? B64[c & 63] : '=');
    }
    return s;
  }
  function dec(s) {
    const n = Math.floor(s.length * 3 / 4) - (s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0), out = new Uint8Array(n), map = {};
    for (let i = 0; i < 64; i++) map[B64[i]] = i;
    for (let i = 0, o = 0; i < s.length; i += 4) {
      const a = map[s[i]], b = map[s[i + 1]], c = map[s[i + 2]] || 0, d = map[s[i + 3]] || 0;
      if (o < n) out[o++] = (a << 2) | (b >> 4);
      if (o < n) out[o++] = ((b & 15) << 4) | (c >> 2);
      if (o < n) out[o++] = ((c & 3) << 6) | d;
    }
    return out;
  }
  MLP.prototype.tensors = function () { const t = []; for (let g = 0; g < this.G; g++) t.push(this.W[g], this.b[g]); return t; };
  MLP.prototype.pack = function () {
    const ts = this.tensors(), scales = [], bytes = new Uint8Array(ts.reduce((s, t) => s + t.length, 0));
    let o = 0;
    ts.forEach(t => {
      let m = 1e-9; for (let i = 0; i < t.length; i++) if (Math.abs(t[i]) > m) m = Math.abs(t[i]);
      scales.push(+m.toPrecision(6));
      for (let i = 0; i < t.length; i++) bytes[o++] = Math.round(t[i] / m * 127) + 128;
    });
    return { sizes: this.sizes.slice(), scales, data: enc(bytes) };
  };
  MLP.prototype.unpack = function (pk) {
    if (!pk || !pk.sizes || pk.sizes.length !== this.sizes.length || pk.sizes.some((n, i) => n !== this.sizes[i])) return false;
    const bytes = dec(pk.data), ts = this.tensors();
    if (bytes.length !== ts.reduce((s, t) => s + t.length, 0)) return false;
    let o = 0;
    ts.forEach((t, n) => { for (let i = 0; i < t.length; i++) t[i] = (bytes[o++] - 128) / 127 * pk.scales[n]; });
    for (let g = 0; g < this.G; g++) { this.mW[g].fill(0); this.vW[g].fill(0); this.mb[g].fill(0); this.vb[g].fill(0); }
    this.t = 0;
    return true;
  };

  /* ---------- the nine shapes, drawn on an 8x8 grid ---------- */
  const N = 8;
  const NAMES = ['flat line', 'upright line', 'falling slope', 'rising slope', 'plus', 'cross', 'box', 'block', 'checks'];
  const GLYPHS = ['─', '│', '╲', '╱', '┼', '╳', '□', '■', '▦'];
  // clean = no speckle and full brightness (used for the example buttons)
  function make(cls, r, clean) {
    const x = new Float32Array(N * N), on = (rr, cc) => { if (rr >= 0 && rr < N && cc >= 0 && cc < N) x[rr * N + cc] = 1; }, int = n => Math.floor(r() * n);
    if (cls === 0 || cls === 1) {
      const line = int(N), len = N - 2 + int(3), s = int(N - len + 1);
      for (let i = 0; i < len; i++) cls ? on(s + i, line) : on(line, s + i);
    } else if (cls === 2 || cls === 3) {
      const len = N - 2 + int(3), r0 = int(N - len + 1), c0 = int(N - len + 1);
      for (let i = 0; i < len; i++) on(r0 + i, cls === 2 ? c0 + i : c0 + len - 1 - i);
    } else if (cls === 4 || cls === 5) {
      const cr = 1 + int(N - 2), cc = 1 + int(N - 2), arm = 1 + int(N / 2 - 1);
      on(cr, cc);
      for (let k = 1; k <= arm; k++) {
        if (cls === 4) { on(cr, cc - k); on(cr, cc + k); on(cr - k, cc); on(cr + k, cc); }
        else { on(cr - k, cc - k); on(cr + k, cc + k); on(cr - k, cc + k); on(cr + k, cc - k); }
      }
    } else if (cls === 6) {
      const h = 3 + int(N - 3), w = 3 + int(N - 3), r0 = int(N - h + 1), c0 = int(N - w + 1);
      for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (!i || !j || i === h - 1 || j === w - 1) on(r0 + i, c0 + j);
    } else if (cls === 7) {
      const h = 2 + int(N / 2 - 1), w = 2 + int(N / 2 - 1), r0 = int(N - h + 1), c0 = int(N - w + 1);
      for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) on(r0 + i, c0 + j);
    } else {
      const h = N - 2 + int(3), w = N - 2 + int(3), r0 = int(N - h + 1), c0 = int(N - w + 1), par = int(2);
      for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if ((i + j) % 2 === par) on(r0 + i, c0 + j);
    }
    if (!clean) for (let i = 0; i < x.length; i++) {
      if (x[i]) x[i] = r() < 0.04 ? 0 : 0.8 + 0.2 * r();
      else if (r() < 0.05) x[i] = 0.15 + 0.35 * r();
    }
    return x;
  }
  function accuracy(net, r, n) {
    let ok = 0;
    for (let i = 0; i < n; i++) { const c = Math.floor(r() * NAMES.length); if (net.predict(make(c, r)) === c) ok++; }
    return ok / n;
  }
  // one training step on a fresh batch of shapes
  function trainStep(net, r, size, lr) {
    const xs = [], ys = [];
    for (let i = 0; i < size; i++) { const c = Math.floor(r() * NAMES.length); xs.push(make(c, r)); ys.push(c); }
    return net.trainBatch(xs, ys, lr);
  }

  return { MLP, rng, shapes: { N, NAMES, GLYPHS, make }, accuracy, trainStep, SIZES: [64, 144, 144, 144, 64, 9], GRID: [8, 12, 12, 12, 8, 3], LR: 0.003, BATCH: 16 };
});
