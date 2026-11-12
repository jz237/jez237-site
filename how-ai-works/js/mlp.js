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

  /* ---------- a visitor's own drawing: packing it into a link, and making practice copies of it ---------- */
  // 64 squares as 16 hex digits and back (null if the text is not exactly that)
  function toHex(x) {
    let s = '';
    for (let i = 0; i < N * N; i += 4) s += ((x[i] > 0.5 ? 8 : 0) | (x[i + 1] > 0.5 ? 4 : 0) | (x[i + 2] > 0.5 ? 2 : 0) | (x[i + 3] > 0.5 ? 1 : 0)).toString(16);
    return s;
  }
  function fromHex(s) {
    if (typeof s !== 'string' || !/^[0-9a-f]{16}$/.test(s)) return null;
    const x = new Float32Array(N * N);
    for (let i = 0; i < x.length; i++) x[i] = (parseInt(s[i >> 2], 16) >> (3 - (i & 3))) & 1;
    return x;
  }
  // the lit part of a drawing, cut out: one bit mask per row
  function crop(src) {
    let r0 = N, r1 = -1, c0 = N, c1 = -1;
    for (let i = 0; i < src.length; i++) if (src[i] > 0.5) { const rr = Math.floor(i / N), cc = i % N; r0 = Math.min(r0, rr); r1 = Math.max(r1, rr); c0 = Math.min(c0, cc); c1 = Math.max(c1, cc); }
    if (r1 < 0) return null;
    const rows = [];
    for (let a = r0; a <= r1; a++) { let m = 0; for (let b = c0; b <= c1; b++) if (src[a * N + b] > 0.5) m |= 1 << (b - c0); rows.push(m); }
    return { rows, w: c1 - c0 + 1 };
  }
  function turn(g) {                    // rows become columns, so the same two functions below can work sideways
    const cols = [];
    for (let b = 0; b < g.w; b++) { let m = 0; for (let a = 0; a < g.rows.length; a++) if ((g.rows[a] >> b) & 1) m |= 1 << a; cols.push(m); }
    return { rows: cols, w: g.rows.length };
  }
  // one row taller: a new row goes in between two rows and carries on only the strokes that run through both,
  // so a stem gets longer but a bar does not get thicker
  function grow(g, r) {
    if (g.rows.length >= N) return false;
    const at = [];
    for (let i = 0; i + 1 < g.rows.length; i++) if (g.rows[i] & g.rows[i + 1]) at.push(i);
    if (!at.length) return false;
    const i = at[Math.floor(r() * at.length)];
    g.rows.splice(i + 1, 0, g.rows[i] & g.rows[i + 1]);
    return true;
  }
  // one row shorter: only a row whose squares all carry on into a neighbouring row may go, so nothing is cut off
  function shrink(g, r) {
    if (g.rows.length <= 2) return false;
    const at = [];
    for (let i = 0; i < g.rows.length; i++) {
      const near = (i ? g.rows[i - 1] : 0) | (i + 1 < g.rows.length ? g.rows[i + 1] : 0);
      if (g.rows[i] && (g.rows[i] & ~near) === 0) at.push(i);
    }
    if (!at.length) return false;
    g.rows.splice(at[Math.floor(r() * at.length)], 1);
    return true;
  }
  // plain resizing, the way a picture is scaled: a square is lit if any square it stands for was lit
  function scale(g, H, W) {
    const h = g.rows.length, w = g.w, rows = [];
    for (let i = 0; i < H; i++) {
      let m = 0;
      const a0 = Math.floor(i * h / H), a1 = Math.max(a0, Math.ceil((i + 1) * h / H) - 1);
      for (let j = 0; j < W; j++) {
        const b0 = Math.floor(j * w / W), b1 = Math.max(b0, Math.ceil((j + 1) * w / W) - 1);
        let lit = 0;
        for (let a = a0; a <= a1 && !lit; a++) for (let b = b0; b <= b1; b++) if ((g.rows[a] >> b) & 1) { lit = 1; break; }
        if (lit) m |= 1 << j;
      }
      rows.push(m);
    }
    return { rows, w: W };
  }
  // A practice copy of a drawing. About a quarter are the drawing as it is, most are made a row or two taller,
  // shorter, wider or narrower with the strokes kept thin, and some are scaled like a picture. Each is then put
  // down anywhere it fits and speckled like the built-in shapes. plain = no speckle.
  function variant(src, r, plain) {
    const out = new Float32Array(N * N);
    let g = crop(src);
    if (!g) return out;
    const int = n => Math.floor(r() * n), u = r();
    if (u < 0.6) {
      for (let side = 0; side < 2; side++) {
        const d = int(5) - 2;
        for (let k = 0; k < Math.abs(d); k++) if (!(d > 0 ? grow(g, r) : shrink(g, r))) break;
        g = turn(g);
      }
    } else if (u < 0.75) {
      const f = 0.65 + 0.8 * r(), fit = n => Math.max(1, Math.min(N, Math.round(n * f * (0.88 + 0.24 * r()))));
      g = scale(g, fit(g.rows.length), fit(g.w));
    }
    const r0 = int(N - g.rows.length + 1), c0 = int(N - g.w + 1);
    for (let a = 0; a < g.rows.length; a++) for (let b = 0; b < g.w; b++) if ((g.rows[a] >> b) & 1) out[(r0 + a) * N + c0 + b] = 1;
    if (!plain) for (let i = 0; i < out.length; i++) {
      if (out[i]) out[i] = r() < 0.04 ? 0 : 0.8 + 0.2 * r();
      else if (r() < 0.05) out[i] = 0.15 + 0.35 * r();
    }
    return out;
  }

  /* ---------- questions the page asks of a network ----------
     Each one runs fresh passes with the weights as they are at that moment, never with numbers saved earlier,
     so the answers stay true while the network is being trained. off is the same switched-off mask forward() takes. */
  function best(p) { let b = 0; for (let j = 1; j < p.length; j++) if (p[j] > p[b]) b = j; return b; }
  const flipped = v => (v > 0.5 ? 0 : 1);

  // Why this answer: flip each input square in turn and see how far the odds of answer `cls` move.
  function why(net, x, cls, off) {
    const tmp = Float32Array.from(x), base = net.forward(tmp, off)[cls], d = new Float32Array(tmp.length);
    for (let i = 0; i < tmp.length; i++) {
      const keep = tmp[i]; tmp[i] = flipped(keep);
      d[i] = net.forward(tmp, off)[cls] - base; tmp[i] = keep;
    }
    return { base, d };
  }

  // Follow the signal: start at output `cls` and walk back a layer at a time, each time keeping the few neurons
  // that did most to push the ones already kept the way they went. A neuron's push on the next one is
  // weight x value; it counts as help when it has the sign of the direction being followed.
  // Returns, per layer, the kept neurons { i, r } (r = its share of the push, all the way from the answer)
  // and, per gap, the connections between kept neurons { from, to, r, neg }.
  // share = how much of everything pushing the answer up comes from the kept neurons of the last hidden layer.
  function trace(net, x, cls, off, keep) {
    keep = keep || 6;
    net.forward(x, off);
    const G = net.G, nodes = new Array(G + 1), edges = new Array(G);
    let share = 0;
    nodes[G] = [{ i: cls, r: 1, s: 1 }];
    for (let g = G - 1; g >= 0; g--) {
      const nIn = net.sizes[g], W = net.W[g], src = net.a[g], R = new Float32Array(nIn), flows = [];
      nodes[g + 1].forEach(nd => {
        let sum = 0;
        for (let i = 0; i < nIn; i++) { const c = nd.s * W[nd.i * nIn + i] * src[i]; if (c > 0) sum += c; }
        if (!sum) return;
        for (let i = 0; i < nIn; i++) {
          const c = nd.s * W[nd.i * nIn + i] * src[i];
          if (c > 0) { const f = nd.r * c / sum; R[i] += f; flows.push([i, nd.i, f]); }
        }
      });
      const kept = [];
      for (let i = 0; i < nIn; i++) if (R[i] > 0) kept.push(i);
      kept.sort((p, q) => R[q] - R[p] || p - q);
      kept.length = Math.min(kept.length, g ? keep : keep * 2);
      const on = new Uint8Array(nIn);
      kept.forEach(i => { on[i] = 1; });
      if (g === G - 1) kept.forEach(i => { share += R[i]; });
      nodes[g] = kept.map(i => ({ i, r: R[i], s: src[i] < 0 ? -1 : 1 }));
      edges[g] = flows.filter(f => on[f[0]]).sort((p, q) => q[2] - p[2]).slice(0, 18).map(f => ({ from: f[0], to: f[1], r: f[2], neg: W[f[1] * nIn + f[0]] < 0 }));
    }
    nodes.forEach(list => list.forEach(nd => { delete nd.s; }));
    return { cls, nodes, edges, share };
  }

  // Fool it: the fewest input squares to flip so that the answer changes.
  // Every single flip and every pair is tried, so a result of one or two is the true minimum (exact = true).
  // Past that, squares are flipped greedily and the set is then trimmed: a set that works, not a proof it is the smallest,
  // unless it comes out at three, which is the least there could be once every pair has failed.
  // Returns { from, to, flips, exact, least } or, when nothing within `limit` flips works, { from, flips: null }.
  function fool(net, x, off, limit) {
    const n = x.length, tmp = Float32Array.from(x), from = best(net.forward(tmp, off));
    // how far the first answer is ahead of the runner-up; below zero means the answer has changed
    const lead = () => { const p = net.forward(tmp, off); let o = -1; for (let j = 0; j < p.length; j++) if (j !== from && (o < 0 || p[j] > p[o])) o = j; return p[from] - p[o]; };
    const set = (i, on) => { tmp[i] = on ? flipped(x[i]) : x[i]; };
    const done = (flips, exact, least) => { flips.forEach(i => set(i, true)); const to = best(net.forward(tmp, off)); return { from, to, flips: flips.slice().sort((a, b) => a - b), exact, least }; };
    let low = 0, pick = null;
    const single = new Float32Array(n);
    for (let i = 0; i < n; i++) { set(i, true); single[i] = lead(); set(i, false); if (single[i] < low) { low = single[i]; pick = [i]; } }
    if (pick) return done(pick, true, 1);
    for (let i = 0; i < n; i++) {
      set(i, true);
      for (let j = i + 1; j < n; j++) { set(j, true); const m = lead(); set(j, false); if (m < low) { low = m; pick = [i, j]; } }
      set(i, false);
    }
    if (pick) return done(pick, true, 2);
    const flips = [], used = new Uint8Array(n), max = Math.min(n, limit || 16);
    let m = 1;
    while (flips.length < max && m >= 0) {
      let at = -1, lo = Infinity;
      for (let i = 0; i < n; i++) if (!used[i]) { set(i, true); const v = lead(); set(i, false); if (v < lo) { lo = v; at = i; } }
      if (at < 0) break;
      set(at, true); used[at] = 1; flips.push(at); m = lo;
    }
    if (m >= 0) return { from, flips: null };
    // trim: put back any flip the fooled answer does not need, and keep going round until every one left is needed
    for (let again = true; again;) {
      again = false;
      for (let k = flips.length - 1; k >= 0; k--) {
        set(flips[k], false);
        if (lead() < 0) { flips.splice(k, 1); again = true; } else set(flips[k], true);
      }
    }
    for (let i = 0; i < n; i++) set(i, false);
    return done(flips, flips.length === 3, 3);
  }

  // What makes each hidden neuron fire: run `count` fresh drawings (draw(c) makes one of class c), and for every
  // hidden neuron average the `top` drawings that pushed it highest. Per hidden layer it returns
  //   pics  the averaged drawing for each neuron, laid end to end
  //   fav   the class most common among a neuron's top drawings, and share = how much of the top that class takes
  //   hi    the highest value the neuron reached
  function excite(net, draw, count, classes, top) {
    top = top || 30;
    const nIn = net.sizes[0], xs = [], ys = new Uint8Array(count), acts = [];
    for (let l = 1; l < net.G; l++) acts[l] = new Float32Array(count * net.sizes[l]);
    for (let s = 0; s < count; s++) {
      const c = s % classes, x = draw(c);
      xs.push(x); ys[s] = c; net.forward(x);
      for (let l = 1; l < net.G; l++) acts[l].set(net.a[l], s * net.sizes[l]);
    }
    const out = [], col = new Float32Array(count), hist = new Uint16Array(classes);
    for (let l = 1; l < net.G; l++) {
      const n = net.sizes[l], pics = new Float32Array(n * nIn), fav = new Uint8Array(n), share = new Float32Array(n), hi = new Float32Array(n);
      for (let j = 0; j < n; j++) {
        for (let s = 0; s < count; s++) col[s] = acts[l][s * n + j];
        const cut = Float32Array.from(col).sort()[Math.max(0, count - top)];
        let used = 0, m = -Infinity;
        hist.fill(0);
        for (let s = 0; s < count && used < top; s++) if (col[s] >= cut) {
          used++; hist[ys[s]]++; if (col[s] > m) m = col[s];
          for (let q = 0, o = j * nIn; q < nIn; q++) pics[o + q] += xs[s][q];
        }
        for (let q = 0, o = j * nIn; q < nIn; q++) pics[o + q] /= used || 1;
        let b = 0; for (let c = 1; c < classes; c++) if (hist[c] > hist[b]) b = c;
        fav[j] = b; share[j] = hist[b] / (used || 1); hi[j] = m;
      }
      out[l] = { pics, fav, share, hi };
    }
    return out;
  }

  return {
    MLP, rng, shapes: { N, NAMES, GLYPHS, make, variant, toHex, fromHex }, probe: { best, why, trace, fool, excite },
    accuracy, trainStep, SIZES: [64, 144, 144, 144, 64, 9], GRID: [8, 12, 12, 12, 8, 3], LR: 0.003, BATCH: 16
  };
});
